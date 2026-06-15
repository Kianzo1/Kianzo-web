import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/api-auth'
import { getConfig, setConfig, CONFIG_DISPONIBLE } from '@/lib/config-store'

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const config = await getConfig()
  return NextResponse.json({ config, disponible: CONFIG_DISPONIBLE })
}

export async function PATCH(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  if (!CONFIG_DISPONIBLE) {
    return NextResponse.json({ error: 'Falta configurar NOTION_CONFIG_DB_ID en el servidor' }, { status: 400 })
  }
  const body = await request.json()
  const partial: Record<string, unknown> = {}
  if (typeof body.nombre === 'string') partial.nombre = body.nombre.trim() || 'Kianzo'
  if (body.metaMensual !== undefined) {
    const n = parseFloat(body.metaMensual)
    partial.metaMensual = isNaN(n) || n < 0 ? 0 : n
  }
  try {
    const config = await setConfig(partial)
    return NextResponse.json({ ok: true, config })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Error al guardar' }, { status: 500 })
  }
}
