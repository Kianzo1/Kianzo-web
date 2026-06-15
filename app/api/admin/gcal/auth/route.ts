import { NextRequest, NextResponse } from 'next/server'

// Ruta de uso único para autorizar acceso a Google Calendar.
// Visitar /api/admin/gcal/auth desde una sesión autenticada → redirige a Google.
export async function GET(request: NextRequest) {
  const session = request.cookies.get('kz_admin_session')?.value
  if (!session || session !== process.env.ADMIN_SESSION_TOKEN) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const clientId = process.env.AUTH_GOOGLE_ID
  if (!clientId) return NextResponse.json({ error: 'AUTH_GOOGLE_ID no configurado' }, { status: 500 })

  const origin = request.nextUrl.origin
  const redirectUri = `${origin}/api/admin/gcal/callback`

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/calendar',
    access_type: 'offline',
    prompt: 'consent',
    state: 'gcal_setup',
  })

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
}
