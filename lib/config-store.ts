// Configuración compartida del panel — guardada en Notion (key-value).
// DB con propiedades: "Clave" (title) y "Valor" (rich_text).
// Si NOTION_CONFIG_DB_ID no está seteado → devuelve defaults y no persiste.

export type Config = {
  nombre: string
  metaMensual: number   // objetivo de ingresos USD del mes (0 = sin meta)
}

export const CONFIG_DEFAULT: Config = {
  nombre: 'Kianzo',
  metaMensual: 0,
}

const DB_ID = process.env.NOTION_CONFIG_DB_ID
const HEADERS = {
  'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
}

export const CONFIG_DISPONIBLE = !!DB_ID

type Row = { id: string; clave: string; valor: string }

async function listRows(): Promise<Row[]> {
  if (!DB_ID) return []
  const res = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
    method: 'POST', headers: HEADERS, body: JSON.stringify({ page_size: 100 }),
  })
  if (!res.ok) return []
  const d = await res.json()
  return (d.results ?? []).map((p: any) => ({
    id: p.id,
    clave: p.properties?.Clave?.title?.[0]?.plain_text ?? '',
    valor: p.properties?.Valor?.rich_text?.[0]?.plain_text ?? '',
  }))
}

export async function getConfig(): Promise<Config> {
  if (!DB_ID) return { ...CONFIG_DEFAULT }
  try {
    const rows = await listRows()
    const map: Record<string, string> = {}
    rows.forEach(r => { if (r.clave) map[r.clave] = r.valor })
    return {
      nombre: map.nombre || CONFIG_DEFAULT.nombre,
      metaMensual: map.meta_mensual ? parseFloat(map.meta_mensual) || 0 : 0,
    }
  } catch {
    return { ...CONFIG_DEFAULT }
  }
}

async function upsert(clave: string, valor: string, rows: Row[]) {
  const existing = rows.find(r => r.clave === clave)
  if (existing) {
    return fetch(`https://api.notion.com/v1/pages/${existing.id}`, {
      method: 'PATCH', headers: HEADERS,
      body: JSON.stringify({ properties: { Valor: { rich_text: [{ text: { content: valor } }] } } }),
    })
  }
  return fetch('https://api.notion.com/v1/pages', {
    method: 'POST', headers: HEADERS,
    body: JSON.stringify({
      parent: { database_id: DB_ID },
      properties: {
        Clave: { title: [{ text: { content: clave } }] },
        Valor: { rich_text: [{ text: { content: valor } }] },
      },
    }),
  })
}

export async function setConfig(partial: Partial<Config>): Promise<Config> {
  if (!DB_ID) throw new Error('NOTION_CONFIG_DB_ID no configurado')
  const rows = await listRows()
  const ops: Promise<Response>[] = []
  if (partial.nombre !== undefined) ops.push(upsert('nombre', partial.nombre, rows))
  if (partial.metaMensual !== undefined) ops.push(upsert('meta_mensual', String(partial.metaMensual), rows))
  await Promise.allSettled(ops)
  return getConfig()
}
