import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/api-auth'

const HEADERS = {
  'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
}

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const tipo = searchParams.get('tipo') // 'activos' | 'respondidos' | null (todos)

  const filter: any = { property: 'Proyecto', title: { is_not_empty: true } }

  const body: any = {
    filter: tipo === 'respondidos'
      ? { and: [filter, { property: 'Estado', select: { equals: 'Cerrado' } }] }
      : tipo === 'activos'
        ? { and: [filter, { property: 'Estado', select: { does_not_equal: 'Cerrado' } }] }
        : filter,
    sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    page_size: 100,
  }

  const res = await fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_PRESUPUESTOS_DB_ID}/query`, {
    method: 'POST', headers: HEADERS, body: JSON.stringify(body),
  })

  const data = await res.json()

  const presupuestos = data.results?.map((p: any) => ({
    id: p.id,
    proyecto: p.properties?.Proyecto?.title?.[0]?.plain_text ?? 'Sin nombre',
    cliente: p.properties?.Cliente?.rich_text?.[0]?.plain_text ?? '',
    estado: p.properties?.Estado?.select?.name ?? '',
    monto: p.properties?.['Monto USD']?.number ?? null,
    servicio: p.properties?.Servicio?.select?.name ?? '',
    creado: p.created_time,
  })) ?? []

  return NextResponse.json({ presupuestos })
}

export async function PATCH(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const { id, estado } = await request.json()
  if (!id || !estado) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })

  const res = await fetch(`https://api.notion.com/v1/pages/${id}`, {
    method: 'PATCH', headers: HEADERS,
    body: JSON.stringify({ properties: { Estado: { select: { name: estado } } } }),
  })
  if (!res.ok) { const e = await res.json(); return NextResponse.json({ error: e.message }, { status: 500 }) }
  return NextResponse.json({ ok: true })
}

