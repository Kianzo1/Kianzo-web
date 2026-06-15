import { NextRequest, NextResponse } from 'next/server'
import { listarTareas, crearTarea, editarTarea, eliminarTarea } from '@/lib/tareas-store'
import { gcalCreate, gcalUpdate, gcalDelete } from '@/lib/gcal'
import { isAuthenticated } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated(request))) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const tareas = await listarTareas()
  return NextResponse.json({ tareas })
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated(request))) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const body = await request.json()
  if (!body.titulo?.trim()) return NextResponse.json({ error: 'Falta el título' }, { status: 400 })
  const tarea = await crearTarea(body)
  gcalCreate(tarea).catch(() => {}) // fire-and-forget
  return NextResponse.json({ ok: true, tarea })
}

export async function PATCH(request: NextRequest) {
  if (!(await isAuthenticated(request))) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id, ...cambios } = await request.json()
  if (!id) return NextResponse.json({ error: 'Falta el id' }, { status: 400 })
  const tarea = await editarTarea(id, cambios)
  if (!tarea) return NextResponse.json({ error: 'No encontrada' }, { status: 404 })
  gcalUpdate(tarea).catch(() => {}) // fire-and-forget
  return NextResponse.json({ ok: true, tarea })
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated(request))) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'Falta el id' }, { status: 400 })
  gcalDelete(id).catch(() => {}) // fire-and-forget
  const ok = await eliminarTarea(id)
  return NextResponse.json({ ok })
}
