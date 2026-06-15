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

  const res = await fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_GASTOS_DB_ID}/query`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      filter: { property: 'Nombre', title: { is_not_empty: true } },
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    }),
  })

  if (!res.ok) return NextResponse.json({ error: 'Error al obtener gastos' }, { status: 500 })

  const data = await res.json()
  const gastos = data.results?.map((g: any) => ({
    id: g.id,
    nombre: g.properties?.Nombre?.title?.[0]?.plain_text ?? '',
    monto: g.properties?.Monto?.number ?? null,
    categoria: g.properties?.Categoria?.select?.name ?? '',
    mes: g.properties?.Mes?.select?.name ?? '',
    fijo: g.properties?.Fijo?.checkbox ?? false,
    notas: g.properties?.Notas?.rich_text?.[0]?.plain_text ?? '',
    fecha: g.created_time,
  })) ?? []

  return NextResponse.json({ gastos })
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { nombre, monto, categoria, mes, fijo, notas } = await request.json()

  if (!nombre) return NextResponse.json({ error: 'Falta el nombre' }, { status: 400 })

  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      parent: { database_id: process.env.NOTION_GASTOS_DB_ID },
      properties: {
        Nombre: { title: [{ text: { content: nombre } }] },
        ...(monto && { Monto: { number: parseFloat(monto) } }),
        ...(categoria && { Categoria: { select: { name: categoria } } }),
        ...(mes && { Mes: { select: { name: mes } } }),
        Fijo: { checkbox: fijo ?? false },
        ...(notas && { Notas: { rich_text: [{ text: { content: notas } }] } }),
      },
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    return NextResponse.json({ error: err.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function PATCH(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id, nombre, monto, categoria, mes, fijo, notas } = await request.json()
  if (!id) return NextResponse.json({ error: 'Falta el id' }, { status: 400 })

  const res = await fetch(`https://api.notion.com/v1/pages/${id}`, {
    method: 'PATCH',
    headers: HEADERS,
    body: JSON.stringify({
      properties: {
        Nombre: { title: [{ text: { content: nombre } }] },
        Monto: { number: monto ? parseFloat(monto) : null },
        Categoria: categoria ? { select: { name: categoria } } : { select: null },
        Mes: mes ? { select: { name: mes } } : { select: null },
        Fijo: { checkbox: fijo ?? false },
        Notas: { rich_text: notas ? [{ text: { content: notas } }] : [] },
      },
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    return NextResponse.json({ error: err.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
