import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/api-auth'

const HEADERS = {
  'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
}

async function patchPage(id: string, properties: Record<string, unknown>) {
  return fetch(`https://api.notion.com/v1/pages/${id}`, {
    method: 'PATCH',
    headers: HEADERS,
    body: JSON.stringify({ properties }),
  })
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { proyectoId, fechaEntrega, montoFinal, notas, servicio, linkEntregado, cobroCompleto, mantenimiento, mantenimientoUSD } = body

  if (!proyectoId) {
    return NextResponse.json({ error: 'Falta el proyecto' }, { status: 400 })
  }

  const fecha = fechaEntrega || new Date().toISOString().slice(0, 10)

  // PATCH 1 — propiedades core confirmadas en Notion
  const coreProps: Record<string, unknown> = {
    Estado: { select: { name: 'Cerrado' } },
    'Fecha entrega': { date: { start: fecha } },
    Mantenimiento: { checkbox: !!mantenimiento },
  }
  if (montoFinal) coreProps['Monto Total USD'] = { number: parseFloat(montoFinal) }
  if (mantenimiento && mantenimientoUSD) coreProps['Mantenimiento USD'] = { number: parseFloat(mantenimientoUSD) }
  if (servicio) coreProps['Servicio'] = { select: { name: servicio } }

  const res = await patchPage(proyectoId, coreProps)
  if (!res.ok) {
    const err = await res.json()
    return NextResponse.json({ error: err.message ?? 'Error al cerrar proyecto' }, { status: 500 })
  }

  // PATCH 2 — propiedades opcionales, sin bloquear si no existen
  const optionalPatches: Promise<Response>[] = []
  if (notas) optionalPatches.push(patchPage(proyectoId, { Notas: { rich_text: [{ text: { content: notas } }] } }))
  if (linkEntregado) optionalPatches.push(patchPage(proyectoId, { 'Link entrega': { url: linkEntregado } }))
  if (cobroCompleto) optionalPatches.push(patchPage(proyectoId, { Cobrado: { checkbox: true } }))
  await Promise.allSettled(optionalPatches)

  return NextResponse.json({ ok: true })
}
