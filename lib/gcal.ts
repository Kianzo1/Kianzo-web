import { promises as fs } from 'fs'
import path from 'path'
import type { Tarea } from './tareas-store'

const CALENDAR_ID = process.env.GCAL_CALENDAR_ID ?? 'primary'
// En Vercel el filesystem es read-only; /tmp es la única carpeta escribible en runtime
const MAP_FILE = process.env.VERCEL
  ? '/tmp/gcal-ids.json'
  : path.join(process.cwd(), 'data', 'gcal-ids.json')

// ── Token refresh ──────────────────────────────────────────────────
async function getAccessToken(): Promise<string | null> {
  const refreshToken = process.env.GCAL_REFRESH_TOKEN
  if (!refreshToken) return null
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.AUTH_GOOGLE_ID ?? '',
      client_secret: process.env.AUTH_GOOGLE_SECRET ?? '',
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  const d = await res.json()
  return d.access_token ?? null
}

// ── ID map (tareaId → gcalEventId) ────────────────────────────────
async function readMap(): Promise<Record<string, string>> {
  try { return JSON.parse(await fs.readFile(MAP_FILE, 'utf-8')) } catch { return {} }
}
async function writeMap(m: Record<string, string>) {
  await fs.mkdir(path.dirname(MAP_FILE), { recursive: true })
  await fs.writeFile(MAP_FILE, JSON.stringify(m, null, 2), 'utf-8')
}
export async function getGCalId(tareaId: string): Promise<string | undefined> {
  return (await readMap())[tareaId]
}
async function saveGCalId(tareaId: string, eventId: string) {
  const m = await readMap(); m[tareaId] = eventId; await writeMap(m)
}
async function removeGCalId(tareaId: string) {
  const m = await readMap(); delete m[tareaId]; await writeMap(m)
}

// ── Event builder ──────────────────────────────────────────────────
const TIPO_EMOJI: Record<string, string> = {
  llamada: '📞', videollamada: '🎥', reunion: '🤝', proyecto: '⚡', otro: '📌',
}

function buildEvent(tarea: Tarea) {
  const emoji = TIPO_EMOJI[tarea.tipo] ?? '📌'
  const title = `${emoji} ${tarea.titulo}`
  const desc = tarea.notas || ''

  if (tarea.hora) {
    // timed event — pasar como string local sin conversión UTC para respetar timezone
    const [h, min] = tarea.hora.split(':').map(Number)
    const endH = h + 1 < 24 ? h + 1 : 23
    const endMin = h + 1 < 24 ? min : 59
    const endHora = `${String(endH).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`
    return {
      summary: title,
      description: desc,
      start: { dateTime: `${tarea.fecha}T${tarea.hora}:00`, timeZone: 'America/Argentina/Buenos_Aires' },
      end: { dateTime: `${tarea.fecha}T${endHora}:00`, timeZone: 'America/Argentina/Buenos_Aires' },
      reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 120 }] },
    }
  } else {
    // all-day event — Google exige end.date = día siguiente (fin exclusivo)
    const [y, m, d] = tarea.fecha.split('-').map(Number)
    const finDate = new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10)
    // notifica a las 9:00 AM (540 min desde medianoche)
    return {
      summary: title,
      description: desc,
      start: { date: tarea.fecha },
      end: { date: finDate },
      reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 540 }] },
    }
  }
}

// ── CRUD ───────────────────────────────────────────────────────────
export async function gcalCreate(tarea: Tarea): Promise<void> {
  const token = await getAccessToken()
  if (!token) return
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(buildEvent(tarea)),
    }
  )
  if (res.ok) {
    const ev = await res.json()
    await saveGCalId(tarea.id, ev.id)
  }
}

export async function gcalUpdate(tarea: Tarea): Promise<void> {
  const token = await getAccessToken()
  if (!token) return
  const eventId = await getGCalId(tarea.id)
  if (!eventId) { await gcalCreate(tarea); return }
  await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events/${eventId}`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(buildEvent(tarea)),
    }
  )
}

export async function gcalDelete(tareaId: string): Promise<void> {
  const token = await getAccessToken()
  if (!token) return
  const eventId = await getGCalId(tareaId)
  if (!eventId) return
  await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events/${eventId}`,
    { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
  )
  await removeGCalId(tareaId)
}
