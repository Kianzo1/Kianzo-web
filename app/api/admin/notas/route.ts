import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/api-auth'

const DB_ID = process.env.NOTION_NOTAS_DB_ID
const HEADERS = {
  'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
}

function toNota(p: any) {
  return {
    id: p.id,
    titulo: p.properties?.Titulo?.title?.[0]?.plain_text ?? '',
    contenido: p.properties?.Contenido?.rich_text?.map((r: any) => r.plain_text).join('') ?? '',
    color: p.properties?.Color?.select?.name ?? 'Bordeaux',
    fijada: p.properties?.Fijada?.checkbox ?? false,
    creado: p.created_time,
    editado: p.last_edited_time,
  }
}

function buildProps(data: any) {
  const props: any = {}
  if (data.titulo !== undefined) props.Titulo = { title: [{ text: { content: data.titulo || 'Sin título' } }] }
  if (data.contenido !== undefined) props.Contenido = { rich_text: data.contenido ? [{ text: { content: String(data.contenido).slice(0, 1900) } }] : [] }
  if (data.color !== undefined) props.Color = { select: { name: data.color } }
  if (data.fijada !== undefined) props.Fijada = { checkbox: !!data.fijada }
  return props
}

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated(request))) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  if (!DB_ID) return NextResponse.json({ notas: [], disponible: false })

  const res = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
    method: 'POST', headers: HEADERS,
    body: JSON.stringify({ sorts: [{ timestamp: 'created_time', direction: 'descending' }], page_size: 100 }),
  })
  if (!res.ok) return NextResponse.json({ notas: [], disponible: true })
  const d = await res.json()
  const notas = (d.results ?? []).map(toNota)
  return NextResponse.json({ notas, disponible: true })
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated(request))) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  if (!DB_ID) return NextResponse.json({ error: 'NOTION_NOTAS_DB_ID no configurado' }, { status: 400 })

  const body = await request.json()
  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST', headers: HEADERS,
    body: JSON.stringify({
      parent: { database_id: DB_ID },
      properties: buildProps({ titulo: body.titulo || 'Sin título', contenido: body.contenido || '', color: body.color || 'Bordeaux', fijada: body.fijada || false }),
    }),
  })
  if (!res.ok) { const e = await res.json(); return NextResponse.json({ error: e.message }, { status: 500 }) }
  return NextResponse.json({ ok: true, nota: toNota(await res.json()) })
}

export async function PATCH(request: NextRequest) {
  if (!(await isAuthenticated(request))) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id, ...cambios } = await request.json()
  if (!id) return NextResponse.json({ error: 'Falta el id' }, { status: 400 })

  const res = await fetch(`https://api.notion.com/v1/pages/${id}`, {
    method: 'PATCH', headers: HEADERS, body: JSON.stringify({ properties: buildProps(cambios) }),
  })
  if (!res.ok) { const e = await res.json(); return NextResponse.json({ error: e.message }, { status: 500 }) }
  return NextResponse.json({ ok: true, nota: toNota(await res.json()) })
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated(request))) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'Falta el id' }, { status: 400 })

  const res = await fetch(`https://api.notion.com/v1/pages/${id}`, {
    method: 'PATCH', headers: HEADERS, body: JSON.stringify({ archived: true }),
  })
  return NextResponse.json({ ok: res.ok })
}
