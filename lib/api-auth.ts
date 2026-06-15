import { NextRequest } from 'next/server'
import { auth } from '@/auth'

/**
 * Acepta tanto el login con OTP (cookie kz_admin_session)
 * como el login con Google OAuth (sesión NextAuth).
 */
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  // OTP login — cookie seteada por /api/admin/otp
  const cookie = request.cookies.get('kz_admin_session')?.value
  if (cookie && cookie === process.env.ADMIN_SESSION_TOKEN) return true

  // Google OAuth — sesión NextAuth
  try {
    const session = await auth()
    if (session?.user?.email) return true
  } catch {
    // auth() puede fallar en contextos de edge/route si no está configurada
  }

  return false
}
