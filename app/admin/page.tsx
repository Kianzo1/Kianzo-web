'use client'

import { useState, FormEvent, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Eye, EyeSlash, LockKey } from '@phosphor-icons/react'
import { signIn } from 'next-auth/react'

function KianzoLogo({ size = 56 }: { size?: number }) {
  return <img src="/logo-kianzo.png" width={size} height={size} alt="Kianzo" style={{ objectFit: 'contain' }} />
}

function RadarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let angle = 0
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const maxR = Math.min(cx, cy)

    // Puntos aleatorios fijos (blips)
    const blips = Array.from({ length: 8 }, () => ({
      angle: Math.random() * Math.PI * 2,
      r: (0.25 + Math.random() * 0.65) * maxR,
      alpha: 0,
      lit: false,
    }))

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Círculos de fondo
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath()
        ctx.arc(cx, cy, (i / 4) * maxR, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(192,0,26,0.08)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Líneas cruzadas
      ctx.strokeStyle = 'rgba(192,0,26,0.06)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(cx, cy - maxR); ctx.lineTo(cx, cy + maxR); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx - maxR, cy); ctx.lineTo(cx + maxR, cy); ctx.stroke()

      // Sweep gradient (cono de barrido) — usamos fillStyle con arcos
      const sweepLen = Math.PI * 0.7
      for (let i = 0; i < 40; i++) {
        const a = angle - (i / 40) * sweepLen
        const alpha = (1 - i / 40) * 0.18
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.arc(cx, cy, maxR, a - 0.08, a)
        ctx.closePath()
        ctx.fillStyle = `rgba(192,0,26,${alpha})`
        ctx.fill()
      }

      // Línea del sweep
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR)
      ctx.strokeStyle = 'rgba(192,0,26,0.7)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Blips
      blips.forEach(b => {
        const diff = ((angle - b.angle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2)
        if (diff < 0.15) { b.alpha = 1; b.lit = true }
        else if (b.lit) { b.alpha = Math.max(0, b.alpha - 0.012) }
        if (b.alpha > 0) {
          const bx = cx + Math.cos(b.angle) * b.r
          const by = cy + Math.sin(b.angle) * b.r
          ctx.beginPath()
          ctx.arc(bx, by, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(192,0,26,${b.alpha})`
          ctx.fill()
          ctx.beginPath()
          ctx.arc(bx, by, 6, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(192,0,26,${b.alpha * 0.2})`
          ctx.fill()
        }
      })

      // Punto central
      ctx.beginPath()
      ctx.arc(cx, cy, 3, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(192,0,26,0.8)'
      ctx.fill()

      angle += 0.018
      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={340}
      height={340}
      style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.55, pointerEvents: 'none' }}
    />
  )
}

function LoginForm() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'password' | 'otp'>('password')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/admin/dashboard'
  const codeRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setTimeout(() => setMounted(true), 80) }, [])
  useEffect(() => { if (step === 'otp') setTimeout(() => codeRef.current?.focus(), 100) }, [step])

  async function handlePassword(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const data = await res.json()
    if (res.ok) {
      setStep('otp')
    } else {
      setError(data.error ?? 'Error')
    }
    setLoading(false)
  }

  async function handleOtp(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
    if (res.ok) {
      router.push(redirect)
    } else {
      const data = await res.json()
      setError(data.error ?? 'Código incorrecto')
      if (data.error?.includes('expirado')) setStep('password')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#080808',
      cursor: 'default',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'var(--font-body-var), Space Grotesk, sans-serif',
    }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%   { transform: translate(-50%,-50%) scale(0.92); opacity: 0.5; }
          50%  { transform: translate(-50%,-50%) scale(1.04); opacity: 0.15; }
          100% { transform: translate(-50%,-50%) scale(0.92); opacity: 0.5; }
        }
        @keyframes scan-line {
          0%   { top: 0%; opacity: 0; }
          10%  { opacity: 0.6; }
          90%  { opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }
        .kz-login-input { transition: border-color 0.3s cubic-bezier(0.32,0.72,0,1), box-shadow 0.3s cubic-bezier(0.32,0.72,0,1); }
        .kz-login-input:focus { border-color: rgba(192,0,26,0.7) !important; box-shadow: 0 0 0 3px rgba(192,0,26,0.1), inset 0 1px 2px rgba(0,0,0,0.4) !important; outline: none; }
        .kz-btn { transition: all 0.4s cubic-bezier(0.32,0.72,0,1); }
        .kz-btn:not(:disabled):hover { background: #a8001a !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(192,0,26,0.3); }
        .kz-btn:not(:disabled):active { transform: translateY(0) scale(0.98); }
        .kz-eye { transition: color 0.2s; }
        .kz-eye:hover { color: rgba(255,255,255,0.7) !important; }
        input[type=password]::-ms-reveal { display: none; }
      `}</style>

      {/* Elementos animados solo client-side */}
      {mounted && <>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RadarCanvas />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, transparent 0%, #080808 75%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(192,0,26,0.5), transparent)', animation: 'scan-line 4s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(192,0,26,0.4) 50%, transparent 100%)', pointerEvents: 'none' }} />
      </>}

      {/* Card */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: '100%', maxWidth: 380,
        padding: '0 24px',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.7s cubic-bezier(0.32,0.72,0,1), transform 0.7s cubic-bezier(0.32,0.72,0,1)',
      }}>

        {/* Logo + nombre */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 36 }}>
          {/* Anillo pulsante detrás del logo */}
          <div style={{ position: 'relative', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 80, height: 80, borderRadius: '50%', border: '1px solid rgba(192,0,26,0.25)', animation: 'pulse-ring 3s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 96, height: 96, borderRadius: '50%', border: '1px solid rgba(192,0,26,0.1)', animation: 'pulse-ring 3s ease-in-out infinite 0.5s' }} />
            <KianzoLogo size={56} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 20, fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.28em', margin: 0 }}>KIANZO</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '6px 0 0' }}>Acceso restringido</p>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', margin: '16px auto 0', maxWidth: 280, lineHeight: 1.45, fontStyle: 'italic', fontFamily: 'var(--font-serif-var), Cormorant Garamond, serif', fontWeight: 500 }}>
              Donde las grandes ideas encuentran su forma.
            </p>
          </div>
        </div>

        {/* Doble bezel card */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20,
          padding: 6,
        }}>
          <div style={{
            background: 'rgba(10,10,10,0.95)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 15,
            padding: '28px 24px',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.04)',
          }}>
            {/* Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 22 }}>
              <LockKey size={13} color="rgba(192,0,26,0.7)" weight="light" />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Panel interno</span>
            </div>

            {step === 'password' ? (
              <form onSubmit={handlePassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Contraseña</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                      autoFocus required className="kz-login-input"
                      style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 44px 12px 14px', color: '#fff', fontSize: 16, fontFamily: 'inherit', letterSpacing: showPassword ? '0.02em' : '0.12em' }}
                      placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPassword(v => !v)} className="kz-eye"
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 4, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} tabIndex={-1}>
                      {showPassword ? <Eye size={16} weight="light" /> : <EyeSlash size={16} weight="light" />}
                    </button>
                  </div>
                </div>
                {error && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: 'rgba(192,0,26,0.08)', border: '1px solid rgba(192,0,26,0.2)', borderRadius: 8, animation: 'fadeUp 0.3s cubic-bezier(0.32,0.72,0,1)' }}>
                    <LockKey size={13} color="#C0001A" />
                    <p style={{ fontSize: 13, color: 'rgba(255,100,100,0.9)', margin: 0 }}>{error}</p>
                  </div>
                )}
                <div style={{ background: 'rgba(192,0,26,0.15)', borderRadius: 12, padding: 3, marginTop: 4 }}>
                  <button type="submit" disabled={loading} className="kz-btn" style={{ width: '100%', background: '#C0001A', color: '#fff', border: 'none', borderRadius: 9, padding: '13px 20px', fontSize: 15, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: loading ? 0.6 : 1, fontFamily: 'inherit', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)' }}>
                    {loading ? 'Enviando código...' : 'Continuar'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleOtp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ textAlign: 'center', padding: '4px 0 8px' }}>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '0 0 4px' }}>Código enviado a</p>
                  <p style={{ fontSize: 13, color: '#fff', fontWeight: 600, margin: 0 }}>kianzo.web@gmail.com</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Código de 6 dígitos</label>
                  <input ref={codeRef} type="text" inputMode="numeric" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required maxLength={6} className="kz-login-input"
                    style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '14px', color: '#fff', fontSize: 28, fontFamily: 'inherit', letterSpacing: '0.3em', textAlign: 'center' }}
                    placeholder="······" />
                </div>
                {error && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: 'rgba(192,0,26,0.08)', border: '1px solid rgba(192,0,26,0.2)', borderRadius: 8 }}>
                    <LockKey size={13} color="#C0001A" />
                    <p style={{ fontSize: 13, color: 'rgba(255,100,100,0.9)', margin: 0 }}>{error}</p>
                  </div>
                )}
                <div style={{ background: 'rgba(192,0,26,0.15)', borderRadius: 12, padding: 3, marginTop: 4 }}>
                  <button type="submit" disabled={loading || code.length < 6} className="kz-btn" style={{ width: '100%', background: '#C0001A', color: '#fff', border: 'none', borderRadius: 9, padding: '13px 20px', fontSize: 15, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: (loading || code.length < 6) ? 0.5 : 1, fontFamily: 'inherit', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)' }}>
                    {loading ? 'Verificando...' : 'Ingresar'}
                  </button>
                </div>
                <button type="button" onClick={() => { setStep('password'); setCode(''); setError('') }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
                  ← Volver a ingresar contraseña
                </button>
              </form>
            )}

            {/* Divisor */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>O</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>

            {/* Google Sign In */}
            <button
              onClick={() => signIn('google', { callbackUrl: '/admin/dashboard' })}
              className="kz-btn"
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '12px 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.8)',
                fontSize: 14, fontFamily: 'inherit', cursor: 'pointer', fontWeight: 500,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 24, letterSpacing: '0.08em' }}>
          Solo uso interno · kianzo.org
        </p>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
