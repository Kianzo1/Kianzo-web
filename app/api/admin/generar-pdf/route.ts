import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement, type ReactElement } from 'react'
import type { DocumentProps } from '@react-pdf/renderer'
import fs from 'fs'
import path from 'path'
import { isAuthenticated } from '@/lib/api-auth'
import PresupuestoPDF from '@/lib/pdf-template'
import type { PDFPresupuestoData } from '@/lib/presupuesto-types'

export const runtime = 'nodejs'

const NOTION_HEADERS = {
  'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
}

function getText(props: any, key: string): string {
  return props?.[key]?.rich_text?.[0]?.plain_text ?? ''
}
function getNum(props: any, key: string): number | null {
  return props?.[key]?.number ?? null
}
function getDate(props: any, key: string): string {
  return props?.[key]?.date?.start ?? ''
}
function getSelect(props: any, key: string): string {
  return props?.[key]?.select?.name ?? ''
}

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Falta el id' }, { status: 400 })

  // Fetch full page from Notion
  const pageRes = await fetch(`https://api.notion.com/v1/pages/${id}`, { headers: NOTION_HEADERS })
  if (!pageRes.ok) return NextResponse.json({ error: 'Presupuesto no encontrado' }, { status: 404 })

  const page = await pageRes.json()
  const p = page.properties

  const data: PDFPresupuestoData = {
    proyecto:      p?.Proyecto?.title?.[0]?.plain_text ?? '',
    cliente:       getText(p, 'Cliente'),
    empresa:       getText(p, 'Empresa'),
    telefono:      p?.Telefono?.phone_number ?? '',
    email:         p?.Email?.email ?? '',
    fechaEmision:  getDate(p, 'Fecha emision') || new Date().toISOString().slice(0, 10),
    descripcion:   getText(p, 'Descripción'),
    alcanceIncluye:    getText(p, 'Alcance incluye'),
    alcanceNoIncluye:  getText(p, 'Alcance no incluye'),
    fechaInicio:       getDate(p, 'Fecha inicio'),
    fechaEntrega:      getDate(p, 'Fecha entrega'),
    duracionEstimada:  getText(p, 'Duracion estimada'),
    monto:    getNum(p, 'Monto USD'),
    anticipo: getNum(p, 'Anticipo USD'),
    saldo:    getNum(p, 'Saldo USD'),
    formaDePago:   getText(p, 'Forma de pago'),
    rondasRevision: getNum(p, 'Rondas revision'),
    contrataMantenimiento: p?.['Contrata mantenimiento']?.checkbox ?? false,
    valorMantenimiento:    getNum(p, 'Valor mantenimiento'),
    periodicidadMantenimiento: getSelect(p, 'Periodicidad mantenimiento'),
    servicio: getSelect(p, 'Servicio'),
  }

  // Read logo from filesystem
  const logoBuffer = fs.readFileSync(path.join(process.cwd(), 'public', 'logo-kianzo.png'))
  const logo = `data:image/png;base64,${logoBuffer.toString('base64')}`

  const pdfBuffer = await renderToBuffer(
    createElement(PresupuestoPDF, { data, logo }) as ReactElement<DocumentProps>
  )

  const filename = `propuesta-${data.cliente.replace(/\s+/g, '-').toLowerCase() || 'kianzo'}.pdf`

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
