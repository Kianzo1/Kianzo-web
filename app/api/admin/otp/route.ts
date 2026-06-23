import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// OTP en memoria (válido 5 minutos)
const otpStore = new Map<string, { code: string; expires: number }>()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function POST(request: NextRequest) {
  const { password, code } = await request.json()

  // Paso 1: verificar contraseña y enviar OTP
  if (password && !code) {
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000))
    otpStore.set('kianzo', { code: otp, expires: Date.now() + 5 * 60 * 1000 })

    if (process.env.NODE_ENV === 'development') {
      // En local el OTP se imprime en la terminal (no se envía email)
      console.log(`\n🔐 OTP de desarrollo: ${otp}\n`)
    } else {
      await transporter.sendMail({
        from: `"Kianzo Panel" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        subject: `🔐 Código de acceso: ${otp}`,
        html: `
          <div style="font-family:sans-serif;max-width:400px;margin:0 auto;padding:32px;background:#0d0d0d;color:#fff;border-radius:12px;">
            <h2 style="margin:0 0 8px;color:#fff">Kianzo Panel</h2>
            <p style="color:rgba(255,255,255,0.5);margin:0 0 32px;font-size:14px">Código de acceso de un solo uso</p>
            <div style="background:#1a1a1a;border:1px solid rgba(192,0,26,0.3);border-radius:10px;padding:24px;text-align:center;">
              <span style="font-size:42px;font-weight:700;letter-spacing:12px;color:#fff">${otp}</span>
            </div>
            <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:16px 0 0;text-align:center">Válido por 5 minutos · Solo uso interno</p>
          </div>
        `,
      })
    }

    return NextResponse.json({ ok: true, step: 'otp_sent' })
  }

  // Paso 2: verificar OTP
  if (code) {
    const stored = otpStore.get('kianzo')
    if (!stored || Date.now() > stored.expires) {
      return NextResponse.json({ error: 'Código expirado, volvé a ingresar la contraseña' }, { status: 401 })
    }
    if (stored.code !== code) {
      return NextResponse.json({ error: 'Código incorrecto' }, { status: 401 })
    }

    otpStore.delete('kianzo')

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

  return NextResponse.json({ error: 'Petición inválida' }, { status: 400 })
}
