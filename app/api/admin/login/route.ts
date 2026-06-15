import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Login por contraseña solo disponible en desarrollo local
  if ((process.env.NODE_ENV as string) === 'production') {
    return NextResponse.json({ error: 'Usá Google para ingresar' }, { status: 403 })
  }

  const { password } = await request.json()

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set('kz_admin_session', process.env.ADMIN_SESSION_TOKEN!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 8,
    path: '/',
  })

  return response
}
