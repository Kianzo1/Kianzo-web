import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/api-auth'

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const formData = await request.formData()
  const presupuestoId = formData.get('presupuestoId') as string
  const estado = (formData.get('estado') as string) || 'Aprobado'
  const montoFinal = formData.get('montoFinal') as string
  const notas = formData.get('notas') as string
  const crearProyecto = formData.get('crearProyecto') === 'true'
  const archivo = formData.get('archivo') as File | null

  if (!presupuestoId) {
    return NextResponse.json({ error: 'Falta el presupuesto' }, { status: 400 })
  }

  let fileUploadId: string | null = null

  // 1. Si hay archivo, subirlo a Notion Files API
  if (archivo && archivo.size > 0) {
    try {
      // Crear el file upload en Notion
      const createRes = await fetch('https://api.notion.com/v1/file_uploads', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: archivo.name,
          content_type: archivo.type || 'application/pdf',
        }),
      })

      if (createRes.ok) {
        const createData = await createRes.json()
        fileUploadId = createData.id
        const uploadUrl = createData.upload_url

        // Subir el contenido del archivo
        const arrayBuffer = await archivo.arrayBuffer()
        const fileFormData = new FormData()
        fileFormData.append('file', new Blob([arrayBuffer], { type: archivo.type }), archivo.name)

        await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
            'Notion-Version': '2022-06-28',
          },
          body: fileFormData,
        })
      }
    } catch {
      // Si falla el upload del archivo, continuamos sin él
    }
  }

  // 2. PATCH el presupuesto en Notion
  const properties: Record<string, unknown> = {
    Estado: { select: { name: estado } },
    ...(montoFinal && { 'Monto USD': { number: parseFloat(montoFinal) } }),
    ...(fileUploadId && {
      Archivo: {
        files: [{
          type: 'file_upload',
          file_upload: { id: fileUploadId },
        }],
      },
    }),
  }

  const patchRes = await fetch(`https://api.notion.com/v1/pages/${presupuestoId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ properties }),
  })

  if (!patchRes.ok) {
    const err = await patchRes.json()
    return NextResponse.json({ error: err.message }, { status: 500 })
  }

  // 3. Si se pidió crear proyecto, crearlo en la DB de Proyectos
  if (crearProyecto) {
    // Leer datos del presupuesto para copiarlos
    const presRes = await fetch(`https://api.notion.com/v1/pages/${presupuestoId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
      },
    })
    if (presRes.ok) {
      const presData = await presRes.json()
      const props = presData.properties

      const nombreProp = props['Nombre']?.title?.[0]?.plain_text
        || props['Proyecto']?.title?.[0]?.plain_text
        || 'Nuevo proyecto'
      const clienteProp = props['Cliente']?.rich_text?.[0]?.plain_text || ''
      const servicioProp = props['Servicio']?.select?.name || ''
      const montoProp = props['Monto USD']?.number ?? (montoFinal ? parseFloat(montoFinal) : null)

      // Crear proyecto base (solo propiedades seguras)
      const createRes = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parent: { database_id: process.env.NOTION_PROYECTOS_DB_ID },
          properties: {
            Name: { title: [{ text: { content: nombreProp } }] },
            ...(clienteProp && { Cliente: { rich_text: [{ text: { content: clienteProp } }] } }),
            ...(servicioProp && { Servicio: { select: { name: servicioProp } } }),
            Estado: { select: { name: 'En desarrollo' } },
          },
        }),
      })
      // Intentar escribir monto con los dos nombres posibles (uno fallará silenciosamente)
      if (montoProp != null && createRes.ok) {
        const newPage = await createRes.json()
        const montoHeaders = { 'Authorization': `Bearer ${process.env.NOTION_TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' }
        await Promise.allSettled([
          fetch(`https://api.notion.com/v1/pages/${newPage.id}`, { method: 'PATCH', headers: montoHeaders, body: JSON.stringify({ properties: { 'Monto Total USD': { number: montoProp } } }) }),
        ])
      }
    }
  }

  return NextResponse.json({ ok: true, archivoSubido: !!fileUploadId })
}
