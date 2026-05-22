'use client'
import { useEffect, useRef } from 'react'

// Porcentajes del scroll total donde aparece el sol
const TRIGGERS = [0.30, 0.62]
const SIZE = 52 // px

export default function RoamingSun() {
  const discRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = discRef.current
    if (!el) return

    const triggered = new Set<number>()
    let animId = 0
    let busy = false

    const peek = (xPct: number) => {
      if (busy) return
      busy = true
      cancelAnimationFrame(animId)

      const vw = window.innerWidth
      const vh = window.innerHeight
      const cx = vw * xPct
      // El sol aparece justo debajo del borde inferior del viewport
      const floorY = vh - SIZE * 0.3   // cuánto asoma (70% oculto, 30% visible)
      const peekY  = vh - SIZE * 0.85  // cuánto sube al máximo

      let y = vh + SIZE                // empieza off-screen abajo
      let alpha = 0
      type Phase = 'rise' | 'hold' | 'sink'
      let phase: Phase = 'rise'
      let holdTicks = 0

      const tick = () => {
        if (phase === 'rise') {
          y -= 2.8
          alpha = Math.min(alpha + 0.04, 0.55)
          if (y <= peekY) {
            y = peekY
            phase = 'hold'
          }
        } else if (phase === 'hold') {
          holdTicks++
          if (holdTicks > 55) phase = 'sink'
        } else {
          y += 2.2
          alpha = Math.max(alpha - 0.03, 0)
          if (alpha <= 0) {
            el.style.opacity = '0'
            el.style.display = 'none'
            busy = false
            return
          }
        }

        el.style.display    = 'block'
        el.style.left       = `${cx - SIZE / 2}px`
        el.style.top        = `${y}px`
        el.style.opacity    = String(alpha)

        animId = requestAnimationFrame(tick)
      }

      animId = requestAnimationFrame(tick)
    }

    const onScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight
      if (maxScroll <= 0) return
      const progress = window.scrollY / maxScroll

      for (const t of TRIGGERS) {
        if (!triggered.has(t) && progress >= t) {
          triggered.add(t)
          const xPct = t < 0.5 ? 0.72 : 0.55
          peek(xPct)
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <div
      ref={discRef}
      aria-hidden="true"
      style={{
        position:      'fixed',
        width:         SIZE,
        height:        SIZE,
        borderRadius:  '50%',
        background:    '#A3001A',
        boxShadow:     'inset 0 -6px 14px rgba(0,0,0,0.55), 0 0 28px rgba(163,0,26,0.3)',
        display:       'none',
        opacity:       0,
        pointerEvents: 'none',
        zIndex:        15,
        willChange:    'top, opacity',
      }}
    />
  )
}
