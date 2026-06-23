import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/api-auth'

const NOTION_HEADERS = {
  'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
}

function richText(value: string) {
  return [{ text: { content: value.slice(0, 2000) } }]
}
function dateVal(value: string) {
  return value ? { start: value } : undefined
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json()

  const {
    proyecto, cliente, empresa, telefono, email, fechaEmision,
    descripcion, alcanceIncluye, alcanceNoIncluye,
    servicio, estado,
    fechaInicio, fechaEntrega, duracion,
    monto, anticipo, saldo,
    formaDePago, rondas,
    contrataMant, valorMant, periodicidad,
  } = body

  if (!proyecto || !cliente) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  const properties: Record<string, unknown> = {
    Proyecto:  { title: richText(proyecto) },
    Cliente:   { rich_text: richText(cliente) },
    Estado:    { select: { name: estado || 'Borrador' } },
    ...(empresa    && { Empresa:   { rich_text: richText(empresa) } }),
    ...(telefono   && { Telefono:  { phone_number: telefono } }),
    ...(email      && { Email:     { email } }),
    ...(fechaEmision && { 'Fecha emision': { date: dateVal(fechaEmision) } }),
    ...(descripcion  && { 'Descripción':   { rich_text: richText(descripcion) } }),
    ...(alcanceIncluye   && { 'Alcance incluye':    { rich_text: richText(alcanceIncluye) } }),
    ...(alcanceNoIncluye && { 'Alcance no incluye': { rich_text: richText(alcanceNoIncluye) } }),
    ...(servicio  && { Servicio: { select: { name: servicio } } }),
    ...(fechaInicio  && { 'Fecha inicio':   { date: dateVal(fechaInicio) } }),
    ...(fechaEntrega && { 'Fecha entrega':  { date: dateVal(fechaEntrega) } }),
    ...(duracion     && { 'Duracion estimada': { rich_text: richText(duracion) } }),
    ...(monto        && { 'Monto USD':     { number: parseFloat(monto) } }),
    ...(anticipo     && { 'Anticipo USD':  { number: parseFloat(anticipo) } }),
    ...(saldo        && { 'Saldo USD':     { number: parseFloat(saldo) } }),
    ...(formaDePago  && { 'Forma de pago': { rich_text: richText(formaDePago) } }),
    ...(rondas       && { 'Rondas revision': { number: parseInt(rondas) } }),
    'Contrata mantenimiento': { checkbox: !!contrataMant },
    ...(contrataMant && valorMant   && { 'Valor mantenimiento':       { number: parseFloat(valorMant) } }),
    ...(contrataMant && periodicidad && { 'Periodicidad mantenimiento': { select: { name: periodicidad } } }),
  }

  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: NOTION_HEADERS,
    body: JSON.stringify({
      parent: { database_id: process.env.NOTION_PRESUPUESTOS_DB_ID },
      properties,
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    return NextResponse.json({ error: err.message }, { status: 500 })
  }

  const created = await res.json()
  return NextResponse.json({ ok: true, id: created.id })
}
