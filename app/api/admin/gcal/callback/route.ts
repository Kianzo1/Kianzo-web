import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return new NextResponse(
      `<html><body style="font-family:monospace;background:#0a0a0a;color:#fff;padding:40px">
        <h2 style="color:#EF4444">Error en autorización</h2>
        <p>${error ?? 'No se recibió código'}</p>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  const origin = request.nextUrl.origin
  const redirectUri = `${origin}/api/admin/gcal/callback`

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.AUTH_GOOGLE_ID ?? '',
      client_secret: process.env.AUTH_GOOGLE_SECRET ?? '',
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  const tokens = await res.json()

  if (!tokens.refresh_token) {
    return new NextResponse(
      `<html><body style="font-family:monospace;background:#0a0a0a;color:#fff;padding:40px">
        <h2 style="color:#F59E0B">⚠️ No se recibió refresh_token</h2>
        <p>Esto pasa cuando la cuenta ya autorizó la app antes. Revocá el acceso en <a href="https://myaccount.google.com/permissions" style="color:#C0001A">myaccount.google.com/permissions</a> y volvé a intentar.</p>
        <pre style="background:#111;padding:16px;border-radius:8px">${JSON.stringify(tokens, null, 2)}</pre>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  return new NextResponse(
    `<html><body style="font-family:monospace;background:#0a0a0a;color:#fff;padding:40px;max-width:700px;margin:0 auto">
      <h2 style="color:#10B981">✅ Google Calendar autorizado</h2>
      <p>Copiá estos valores en tu <strong>.env.local</strong>:</p>
      <pre style="background:#111;border:1px solid #222;padding:20px;border-radius:10px;word-break:break-all;font-size:13px">GCAL_REFRESH_TOKEN=${tokens.refresh_token}
GCAL_CALENDAR_ID=primary</pre>
      <p style="color:rgba(255,255,255,0.5);font-size:13px">Si querés usar un calendario específico (no "primary"), abrí Google Calendar → Configuración del calendario → ID del calendario y pegalo en GCAL_CALENDAR_ID.</p>
      <p style="color:rgba(255,255,255,0.5);font-size:13px">Después de guardar en .env.local, reiniciá el servidor de desarrollo.</p>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}
