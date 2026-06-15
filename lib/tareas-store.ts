import { promises as fs } from 'fs'
import path from 'path'

// Capa de datos de las tareas del kanban.
// - Si existe NOTION_TAREAS_DB_ID en .env.local → guarda/lee desde Notion (se refleja en la app de Notion).
// - Si no → fallback a un archivo JSON local (data/tareas.json) para no romper nada.

export type Tarea = {
  id: string
  titulo: string
  fecha: string        // YYYY-MM-DD
  hora: string         // HH:MM o ''
  tipo: string         // llamada | videollamada | reunion | proyecto | otro
  notas: string
  hecha: boolean
  creado: string       // ISO
}

const USAR_NOTION = !!process.env.NOTION_TAREAS_DB_ID

// ---- Mapeo de tipos: clave interna <-> etiqueta del select de Notion ----
const TIPO_A_NOTION: Record<string, string> = {
  llamada: 'Llamada', videollamada: 'Videollamada', reunion: 'Reunión', proyecto: 'Proyecto', otro: 'Otro',
}
const NOTION_A_TIPO: Record<string, string> = Object.fromEntries(
  Object.entries(TIPO_A_NOTION).map(([k, v]) => [v, k])
)

// =====================  BACKEND NOTION  =====================
const NOTION_HEADERS = {
  'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
}

const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
function diaDeFecha(fecha: string): string {
  const [y, m, d] = fecha.split('-').map(Number)
  return DIAS_SEMANA[new Date(y, m - 1, d).getDay()]
}

function fechaToStart(fecha: string, hora: string) {
  return hora ? `${fecha}T${hora}:00` : fecha
}
function parseStart(start: string | undefined): { fecha: string; hora: string } {
  if (!start) return { fecha: new Date().toISOString().slice(0, 10), hora: '' }
  if (start.includes('T')) {
    const [f, t] = start.split('T')
    return { fecha: f, hora: (t ?? '').slice(0, 5) }
  }
  return { fecha: start, hora: '' }
}

function notionToTarea(p: any): Tarea {
  const start = p.properties?.Fecha?.date?.start
  const { fecha, hora } = parseStart(start)
  return {
    id: p.id,
    titulo: p.properties?.Tarea?.title?.[0]?.plain_text ?? 'Sin título',
    fecha, hora,
    tipo: NOTION_A_TIPO[p.properties?.Tipo?.select?.name ?? ''] ?? 'otro',
    notas: p.properties?.Notas?.rich_text?.[0]?.plain_text ?? '',
    hecha: p.properties?.Hecha?.checkbox ?? false,
    creado: p.created_time,
  }
}

function tareaToProps(data: Partial<Tarea>) {
  const props: any = {}
  if (data.titulo !== undefined) props.Tarea = { title: [{ text: { content: data.titulo || 'Sin título' } }] }
  if (data.fecha !== undefined || data.hora !== undefined) {
    // fecha/hora se setean juntas; el caller debe pasar ambas en edición de fecha
    props.Fecha = { date: { start: fechaToStart(data.fecha!, data.hora ?? '') } }
    // Día de la semana (para la vista de tablero en Notion) — derivado de la fecha
    if (data.fecha) props['Día'] = { select: { name: diaDeFecha(data.fecha) } }
  }
  if (data.tipo !== undefined) props.Tipo = { select: { name: TIPO_A_NOTION[data.tipo] ?? 'Otro' } }
  if (data.hecha !== undefined) props.Hecha = { checkbox: !!data.hecha }
  if (data.notas !== undefined) props.Notas = { rich_text: data.notas ? [{ text: { content: data.notas } }] : [] }
  return props
}

async function notionList(): Promise<Tarea[]> {
  const res = await fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_TAREAS_DB_ID}/query`, {
    method: 'POST', headers: NOTION_HEADERS,
    body: JSON.stringify({ filter: { property: 'Tarea', title: { is_not_empty: true } }, page_size: 100 }),
  })
  const d = await res.json()
  return (d.results ?? []).map(notionToTarea)
}

async function notionCreate(data: Partial<Tarea>): Promise<Tarea> {
  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST', headers: NOTION_HEADERS,
    body: JSON.stringify({
      parent: { database_id: process.env.NOTION_TAREAS_DB_ID },
      properties: tareaToProps({
        titulo: data.titulo || 'Sin título',
        fecha: data.fecha || new Date().toISOString().slice(0, 10),
        hora: data.hora ?? '',
        tipo: data.tipo || 'otro',
        hecha: false,
        notas: data.notas || '',
      }),
    }),
  })
  const p = await res.json()
  return notionToTarea(p)
}

async function notionEdit(id: string, cambios: Partial<Tarea>, actual?: Tarea): Promise<Tarea | null> {
  // Si cambia fecha u hora, hay que mandar ambas juntas (Notion las guarda en un solo campo Fecha)
  const merged: Partial<Tarea> = { ...cambios }
  if ((cambios.fecha !== undefined || cambios.hora !== undefined) && actual) {
    merged.fecha = cambios.fecha ?? actual.fecha
    merged.hora = cambios.hora ?? actual.hora
  }
  const res = await fetch(`https://api.notion.com/v1/pages/${id}`, {
    method: 'PATCH', headers: NOTION_HEADERS, body: JSON.stringify({ properties: tareaToProps(merged) }),
  })
  if (!res.ok) return null
  return notionToTarea(await res.json())
}

async function notionDelete(id: string): Promise<boolean> {
  const res = await fetch(`https://api.notion.com/v1/pages/${id}`, {
    method: 'PATCH', headers: NOTION_HEADERS, body: JSON.stringify({ archived: true }),
  })
  return res.ok
}

// =====================  BACKEND ARCHIVO LOCAL  =====================
const FILE = path.join(process.cwd(), 'data', 'tareas.json')

async function fileReadAll(): Promise<Tarea[]> {
  try { return JSON.parse(await fs.readFile(FILE, 'utf-8')) as Tarea[] } catch { return [] }
}
async function fileWriteAll(t: Tarea[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true })
  await fs.writeFile(FILE, JSON.stringify(t, null, 2), 'utf-8')
}

// =====================  API PÚBLICA (elige backend)  =====================
export async function listarTareas(): Promise<Tarea[]> {
  return USAR_NOTION ? notionList() : fileReadAll()
}

export async function crearTarea(data: Partial<Tarea>): Promise<Tarea> {
  if (USAR_NOTION) return notionCreate(data)
  const tareas = await fileReadAll()
  const nueva: Tarea = {
    id: `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    titulo: data.titulo?.trim() || 'Sin título',
    fecha: data.fecha || new Date().toISOString().slice(0, 10),
    hora: data.hora || '', tipo: data.tipo || 'otro', notas: data.notas || '',
    hecha: false, creado: new Date().toISOString(),
  }
  tareas.push(nueva); await fileWriteAll(tareas); return nueva
}

export async function editarTarea(id: string, cambios: Partial<Tarea>): Promise<Tarea | null> {
  if (USAR_NOTION) {
    const actual = (await notionList()).find(t => t.id === id)
    return notionEdit(id, cambios, actual)
  }
  const tareas = await fileReadAll()
  const i = tareas.findIndex(t => t.id === id)
  if (i === -1) return null
  const { id: _ignore, ...resto } = cambios
  tareas[i] = { ...tareas[i], ...resto }
  await fileWriteAll(tareas); return tareas[i]
}

export async function eliminarTarea(id: string): Promise<boolean> {
  if (USAR_NOTION) return notionDelete(id)
  const tareas = await fileReadAll()
  const filtradas = tareas.filter(t => t.id !== id)
  if (filtradas.length === tareas.length) return false
  await fileWriteAll(filtradas); return true
}
