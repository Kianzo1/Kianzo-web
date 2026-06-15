import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/api-auth'

const HEADERS = {
  'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
}

async function queryDB(dbId: string, body: object) {
  const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: 'POST', headers: HEADERS, body: JSON.stringify(body),
  })
  return res.json()
}

function normalizar(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()
}

type Item = { nombre: string; estado: string; monto: number | null; servicio: string; creado: string }
type Cliente = {
  nombre: string
  proyectos: Item[]
  presupuestos: Item[]
  totalFacturado: number   // suma de proyectos cerrados
  totalPotencial: number   // suma de presupuestos no cerrados
}

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const [proyData, presData] = await Promise.all([
    queryDB(process.env.NOTION_PROYECTOS_DB_ID!, {
      filter: { property: 'Name', title: { is_not_empty: true } },
      page_size: 100,
    }),
    queryDB(process.env.NOTION_PRESUPUESTOS_DB_ID!, {
      filter: { property: 'Proyecto', title: { is_not_empty: true } },
      page_size: 100,
    }),
  ])

  const mapa = new Map<string, Cliente>()

  function getCliente(nombreRaw: string): Cliente | null {
    const nombre = (nombreRaw ?? '').trim()
    if (!nombre) return null
    const key = normalizar(nombre)
    if (!mapa.has(key)) {
      mapa.set(key, { nombre, proyectos: [], presupuestos: [], totalFacturado: 0, totalPotencial: 0 })
    }
    return mapa.get(key)!
  }

  for (const p of proyData.results ?? []) {
    const c = getCliente(p.properties?.Cliente?.rich_text?.[0]?.plain_text ?? '')
    if (!c) continue
    const monto = p.properties?.['Monto Total USD']?.number ?? p.properties?.['Precio USD']?.number ?? null
    const estado = p.properties?.Estado?.select?.name ?? ''
    c.proyectos.push({
      nombre: p.properties?.Name?.title?.[0]?.plain_text ?? 'Sin nombre',
      estado, monto,
      servicio: p.properties?.Servicio?.select?.name ?? '',
      creado: p.created_time,
    })
    if (estado === 'Cerrado' && monto) c.totalFacturado += monto
  }

  for (const p of presData.results ?? []) {
    const c = getCliente(p.properties?.Cliente?.rich_text?.[0]?.plain_text ?? '')
    if (!c) continue
    const monto = p.properties?.['Monto USD']?.number ?? null
    const estado = p.properties?.Estado?.select?.name ?? ''
    c.presupuestos.push({
      nombre: p.properties?.Proyecto?.title?.[0]?.plain_text ?? 'Sin nombre',
      estado, monto,
      servicio: p.properties?.Servicio?.select?.name ?? '',
      creado: p.created_time,
    })
    if (estado !== 'Cerrado' && estado !== 'Rechazado' && monto) c.totalPotencial += monto
  }

  const clientes = [...mapa.values()].sort((a, b) =>
    (b.totalFacturado + b.totalPotencial) - (a.totalFacturado + a.totalPotencial)
  )

  return NextResponse.json({ clientes })
}
