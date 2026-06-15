import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const res = await fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_PROYECTOS_DB_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filter: { property: 'Name', title: { is_not_empty: true } },
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
      page_size: 100,
    }),
  })

  const data = await res.json()

  const proyectos = data.results?.map((p: any) => ({
    id: p.id,
    nombre: p.properties?.Name?.title?.[0]?.plain_text ?? 'Sin nombre',
    cliente: p.properties?.Cliente?.rich_text?.[0]?.plain_text ?? '',
    estado: p.properties?.Estado?.select?.name ?? '',
    monto: p.properties?.['Monto Total USD']?.number ?? p.properties?.['Precio USD']?.number ?? null,
    servicio: p.properties?.Servicio?.select?.name ?? '',
    mantenimiento: p.properties?.Mantenimiento?.checkbox ?? false,
    mantenimientoUSD: p.properties?.['Mantenimiento USD']?.number ?? null,
    creado: p.created_time,
  })) ?? []

  return NextResponse.json({ proyectos })
}

const NOTION_HEADERS = {
  'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
}

// Editar mantenimiento (toggle on/off + monto) de un proyecto
export async function PATCH(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id, mantenimiento, mantenimientoUSD, estado } = await request.json()
  if (!id) return NextResponse.json({ error: 'Falta el id' }, { status: 400 })

  const props: any = {}
  if (mantenimiento !== undefined) props.Mantenimiento = { checkbox: !!mantenimiento }
  if (mantenimientoUSD !== undefined) {
    props['Mantenimiento USD'] = { number: mantenimientoUSD === '' || mantenimientoUSD == null ? null : parseFloat(mantenimientoUSD) }
  }
  if (estado !== undefined) props.Estado = { select: estado ? { name: estado } : null }

  const res = await fetch(`https://api.notion.com/v1/pages/${id}`, {
    method: 'PATCH', headers: NOTION_HEADERS, body: JSON.stringify({ properties: props }),
  })

  if (!res.ok) {
    const err = await res.json()
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
