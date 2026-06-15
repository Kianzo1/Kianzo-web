import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/api-auth'

const NOTION_HEADERS = {
  'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
}

async function uploadFileToNotion(archivo: File): Promise<string | null> {
  try {
    const createRes = await fetch('https://api.notion.com/v1/file_uploads', {
      method: 'POST',
      headers: NOTION_HEADERS,
      body: JSON.stringify({
        filename: archivo.name,
        content_type: archivo.type || 'application/pdf',
      }),
    })
    if (!createRes.ok) return null

    const { id, upload_url } = await createRes.json()
    const arrayBuffer = await archivo.arrayBuffer()
    const fd = new FormData()
    fd.append('file', new Blob([arrayBuffer], { type: archivo.type }), archivo.name)

    await fetch(upload_url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
      },
      body: fd,
    })

    return id
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const contentType = request.headers.get('content-type') ?? ''
  let proyecto = '', cliente = '', descripcion = '', servicio = '', monto = '', estado = 'Borrador'
  let archivo: File | null = null

  if (contentType.includes('multipart/form-data')) {
    const fd = await request.formData()
    proyecto    = fd.get('proyecto') as string ?? ''
    cliente     = fd.get('cliente') as string ?? ''
    descripcion = fd.get('descripcion') as string ?? ''
    servicio    = fd.get('servicio') as string ?? ''
    monto       = fd.get('monto') as string ?? ''
    estado      = fd.get('estado') as string ?? 'Borrador'
    archivo     = fd.get('archivo') as File | null
  } else {
    const body = await request.json()
    ;({ proyecto, cliente, descripcion, servicio, monto, estado } = body)
  }

  if (!proyecto || !cliente) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  const fileUploadId = archivo && archivo.size > 0 ? await uploadFileToNotion(archivo) : null

  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: NOTION_HEADERS,
    body: JSON.stringify({
      parent: { database_id: process.env.NOTION_PRESUPUESTOS_DB_ID },
      properties: {
        Proyecto: { title: [{ text: { content: proyecto } }] },
        Cliente: { rich_text: [{ text: { content: cliente } }] },
        ...(descripcion && { Descripción: { rich_text: [{ text: { content: descripcion } }] } }),
        ...(servicio && { Servicio: { select: { name: servicio } } }),
        ...(monto && { 'Monto USD': { number: parseFloat(monto) } }),
        Estado: { select: { name: estado } },
        ...(fileUploadId && {
          Archivo: { files: [{ type: 'file_upload', file_upload: { id: fileUploadId } }] },
        }),
      },
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    return NextResponse.json({ error: err.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
