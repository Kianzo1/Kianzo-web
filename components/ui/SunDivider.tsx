'use client'
import { useEffect, useRef } from 'react'

const SIZE     = 78
const GRAVITY  = 0.53
const RESTIT   = 0.50
const MIN_BNC  = 2.0

export default function SunDivider() {
  const lineRef = useRef<HTMLDivElement>(null)
  const discRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const line = lineRef.current
    const disc = discRef.current
    if (!line || !disc) return

    let triggered = false
    let animId    = 0

    const runPhysics = () => {
      if (triggered) return
      triggered = true

      const rect   = line.getBoundingClientRect()
      const floorY = rect.top          // Y del separador en el viewport
      const startX = rect.left + rect.width * 0.68

      let x = startX, y = -SIZE
      let vx = -0.6, vy = 0
      let rotation = 0, alpha = 0
      let bounces = 0
      type Phase = 'fall' | 'roll' | 'fade'
      let phase: Phase = 'fall'

      const tick = () => {
        if (phase === 'fall') {
          vy += GRAVITY
          x  += vx
          y  += vy
          alpha = Math.min(alpha + 0.045, 1)

          if (y + SIZE >= floorY && vy > 0) {
            y  = floorY - SIZE
            vy = -Math.abs(vy) * RESTIT
            bounces++
            if (Math.abs(vy) < MIN_BNC) {
              vy = 0; vx = -1.6; phase = 'roll'
            }
          }
        } else if (phase === 'roll') {
          x  += vx
          vx *= 0.986
          if (x < -SIZE * 2 || Math.abs(vx) < 0.18) phase = 'fade'
        } else {
          alpha -= 0.022
          x     += vx
          if (alpha <= 0) {
            disc.style.display = 'none'
            return
          }
        }

        rotation += vx * 2.2 + (phase === 'fall' ? 1.4 : 0)

        disc.style.display   = 'block'
        disc.style.left      = `${x}px`
        disc.style.top       = `${y}px`
        disc.style.opacity   = String(Math.max(0, alpha))
        disc.style.transform = `rotate(${rotation}deg)`

        animId = requestAnimationFrame(tick)
      }

      animId = requestAnimationFrame(tick)
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { runPhysics(); obs.disconnect() }
      },
      { threshold: 0, rootMargin: '-25% 0px -25% 0px' }
    )
    obs.observe(line)

    return () => { obs.disconnect(); cancelAnimationFrame(animId) }
  }, [])

  return (
    <>
      {/* Línea separadora visible */}
      <div ref={lineRef} className="sun-divider-wrap">
        <span className="sun-divider-line" />
        <span className="sun-divider-dot" />
        <span className="sun-divider-line" />
      </div>

      {/* Sol físico (fixed) */}
      <div
        ref={discRef}
        aria-hidden="true"
        style={{
          position:      'fixed',
          width:         SIZE,
          height:        SIZE,
          borderRadius:  '50%',
          background:    '#A3001A',
          boxShadow:     'inset 0 -10px 22px rgba(0,0,0,0.55), 0 0 36px rgba(163,0,26,0.22)',
          display:       'none',
          opacity:       0,
          pointerEvents: 'none',
          zIndex:        20,
          willChange:    'transform, opacity, left, top',
        }}
      />
    </>
  )
}
