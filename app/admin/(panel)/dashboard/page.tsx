'use client'

import React, { useCallback, useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useLiveRefresh } from '@/lib/useLiveRefresh'
import { FileText, Folder, Clock, ArrowUpRight, Scales, BellRinging, Phone, VideoCamera, UsersThree, Briefcase, Tag, CalendarBlank, Check, MagnifyingGlass, Lightning, ChartLineUp, Users, X } from '@phosphor-icons/react'
import Atropos from 'atropos/react'
import 'atropos/css'

type Tarea = { id: string; titulo: string; fecha: string; hora: string; tipo: string; hecha: boolean }
const TIPOS_T: Record<string, { color: string; icon: any }> = {
  llamada: { color: '#10B981', icon: Phone }, videollamada: { color: '#3B82F6', icon: VideoCamera },
  reunion: { color: '#8B5CF6', icon: UsersThree }, proyecto: { color: '#C0001A', icon: Briefcase }, otro: { color: '#F59E0B', icon: Tag },
}

type Seguimiento = { proyecto: string; cliente: string; estado: string; monto: number | null; dias: number }

type DashboardData = {
  proyectosActivos: number
  cerradosMes: number
  ingresosMes: number
  gastosMes: number
  mantenimientoMes: number
  balanceMes: number
  presupuestosPendientes: number
  seguimiento: Seguimiento[]
  recientes: { nombre: string; estado: string; editado: string }[]
  historialMeses?: { label: string; ingresos: number }[]
}

// Contador animado
function AnimatedNumber({ value, prefix = '' }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number>(0)
  useEffect(() => {
    const start = Date.now()
    const duration = 1000
    const from = 0
    function tick() {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(from + (value - from) * ease))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value])
  return <>{prefix}{display.toLocaleString('es-AR')}</>
}

// Shimmer skeleton
function Shimmer({ h = 110, br = 12 }: { h?: number; br?: number }) {
  return (
    <div style={{ height: h, borderRadius: br, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)', animation: 'shimmer 1.8s ease-in-out infinite' }} />
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub, color = '#C0001A', numeric = false, delay = 0 }: {
  icon: any; label: string; value: number | string; sub?: string; color?: string; numeric?: boolean; delay?: number
}) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t) }, [delay])

  return (
    <Atropos
      activeOffset={10}
      shadowScale={1.02}
      rotateXMax={8}
      rotateYMax={8}
      shadow={false}
      highlight={false}
      style={{ borderRadius: 14, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)', transition: `opacity 0.5s ease ${delay}ms, transform 0.5s cubic-bezier(0.32,0.72,0,1) ${delay}ms` }}
    >
    <div
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.borderColor = `${color}35`
        el.style.background = `${color}08`
        el.style.boxShadow = `0 0 24px ${color}12, inset 0 1px 0 rgba(255,255,255,0.06)`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.borderColor = 'rgba(255,255,255,0.07)'
        el.style.background = 'rgba(255,255,255,0.025)'
        el.style.boxShadow = 'none'
      }}
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14,
        padding: '22px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        position: 'relative',
        overflow: 'hidden',
        transition: `border-color 0.25s, background 0.25s, box-shadow 0.25s`,
      }}
    >
      {/* Glow top-left */}
      <div style={{ position: 'absolute', top: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: `${color}10`, filter: 'blur(20px)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}18`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} color={color} />
        </div>
      </div>
      <div>
        <p style={{ fontSize: 30, fontWeight: 600, color: '#fff', lineHeight: 1, margin: 0, fontVariantNumeric: 'tabular-nums' }}>
          {numeric && typeof value === 'number'
            ? <AnimatedNumber value={value} />
            : value}
        </p>
        {sub && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 6, margin: '6px 0 0' }}>{sub}</p>}
      </div>
    </div>
    </Atropos>
  )
}

// ─── Business Health Score ────────────────────────────────────────────────
function BusinessHealthScore({ data }: { data: DashboardData }) {
  const [animated, setAnimated] = useState(0)

  // Compute score 0-100
  const winRate = data.cerradosMes + data.presupuestosPendientes > 0
    ? data.cerradosMes / (data.cerradosMes + data.presupuestosPendientes) : 0
  const winPts = winRate * 35
  const balancePts = data.balanceMes >= 0 ? 35 : Math.max(0, 35 + (data.balanceMes / 2000) * 35)
  const mrrPts = Math.min((data.mantenimientoMes / 1500) * 20, 20)
  const projPts = Math.min((data.proyectosActivos / 5) * 10, 10)
  const score = Math.round(winPts + balancePts + mrrPts + projPts)

  useEffect(() => {
    const start = Date.now()
    const dur = 1400
    function tick() {
      const p = Math.min((Date.now() - start) / dur, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setAnimated(Math.round(score * e))
      if (p < 1) requestAnimationFrame(tick)
    }
    const t = setTimeout(() => requestAnimationFrame(tick), 300)
    return () => clearTimeout(t)
  }, [score])

  const color = score >= 75 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444'
  const label = score >= 75 ? 'Excelente' : score >= 50 ? 'Bueno' : 'Crítico'

  // SVG circle math
  const R = 52, C = 2 * Math.PI * R
  const dash = (animated / 100) * C

  return (
    <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 22px', animation: 'fadeSlideUp 0.5s ease 0.4s both' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <ChartLineUp size={15} color={color} weight="fill" />
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Business Health Score</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* Circular gauge */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <svg width={128} height={128} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={64} cy={64} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} />
            <circle cx={64} cy={64} r={R} fill="none" stroke={color} strokeWidth={10}
              strokeDasharray={`${dash} ${C}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.05s linear, stroke 0.4s ease', filter: `drop-shadow(0 0 6px ${color}80)` }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <span style={{ fontSize: 30, fontWeight: 700, color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{animated}</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}>/ 100</span>
          </div>
        </div>
        {/* Breakdown */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 16, fontWeight: 600, color }}>{label}</span>
            <span style={{ fontSize: 11, background: `${color}18`, border: `1px solid ${color}30`, color, borderRadius: 6, padding: '2px 10px' }}>
              {score >= 75 ? '↑ En forma' : score >= 50 ? '→ Estable' : '↓ Atención'}
            </span>
          </div>
          {[
            { label: 'Win rate', pts: Math.round(winPts), max: 35, color: '#3B82F6' },
            { label: 'Balance', pts: Math.round(balancePts), max: 35, color: '#10B981' },
            { label: 'MRR', pts: Math.round(mrrPts), max: 20, color: '#8B5CF6' },
            { label: 'Proyectos', pts: Math.round(projPts), max: 10, color: '#F59E0B' },
          ].map(item => (
            <div key={item.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{item.label}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontVariantNumeric: 'tabular-nums' }}>{item.pts}/{item.max}</span>
              </div>
              <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }}>
                <div style={{ height: 4, borderRadius: 4, background: item.color, width: `${(item.pts / item.max) * 100}%`, transition: 'width 1.2s cubic-bezier(0.32,0.72,0,1)', boxShadow: `0 0 6px ${item.color}60` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Revenue Chart ───────────────────────────────────────────────────────
const PERIODOS = [{ n: 3, label: '3M' }, { n: 6, label: '6M' }, { n: 12, label: '1 año' }] as const

function RevenueChart({ historial: historialFull }: { historial: { label: string; ingresos: number }[] }) {
  const [progress, setProgress] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)
  const [periodo, setPeriodo] = useState<number>(6)

  // Recortar a los últimos N meses
  const historial = historialFull.slice(-periodo)
  const todosEnCero = historial.every(h => h.ingresos === 0)
  const maxVal = Math.max(...historial.map(h => h.ingresos), todosEnCero ? 100 : 1)

  // Total e indicador de tendencia del período
  const totalPeriodo = historial.reduce((s, h) => s + h.ingresos, 0)

  useEffect(() => {
    setHovered(null)
    setProgress(0)
    const start = Date.now()
    const dur = 1000
    function tick() {
      const p = Math.min((Date.now() - start) / dur, 1)
      setProgress(1 - Math.pow(1 - p, 3))
      if (p < 1) requestAnimationFrame(tick)
    }
    const t = setTimeout(() => requestAnimationFrame(tick), 150)
    return () => clearTimeout(t)
  }, [periodo])

  const W = 100, H = 60
  const pts = historial.map((h, i) => ({
    x: (i / (historial.length - 1)) * W,
    y: H - (h.ingresos / maxVal) * H * progress,
    ...h,
  }))
  const pathD = pts.reduce((d, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${d} C ${pts[i-1].x + W/historial.length/2} ${pts[i-1].y}, ${p.x - W/historial.length/2} ${p.y}, ${p.x} ${p.y}`, '')
  const areaD = `${pathD} L ${W} ${H} L 0 ${H} Z`

  return (
    <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 22px', animation: 'fadeSlideUp 0.5s ease 0.3s both' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ChartLineUp size={15} color="#C0001A" weight="fill" />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Revenue</span>
          {todosEnCero && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.04)', borderRadius: 5, padding: '2px 8px', border: '1px solid rgba(255,255,255,0.07)' }}>Sin cierres registrados aún</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!todosEnCero && (
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontVariantNumeric: 'tabular-nums' }}>
              Total <span style={{ color: '#C0001A', fontWeight: 600 }}>USD {totalPeriodo.toLocaleString('es-AR')}</span>
            </span>
          )}
          {/* Selector de período */}
          <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: 3 }}>
            {PERIODOS.map(p => (
              <button key={p.n} onClick={() => setPeriodo(p.n)} style={{
                padding: '4px 11px', borderRadius: 6, border: 'none', fontFamily: 'inherit',
                fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                background: periodo === p.n ? 'rgba(192,0,26,0.16)' : 'transparent',
                color: periodo === p.n ? '#ff5577' : 'rgba(255,255,255,0.35)',
              }}>{p.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG chart */}
      <div style={{ position: 'relative' }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: 100, display: 'block', overflow: 'visible' }}>
          <defs>
            <linearGradient id="kzRevGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C0001A" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#C0001A" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Area fill */}
          <path d={areaD} fill="url(#kzRevGrad)" />
          {/* Line */}
          <path d={pathD} fill="none" stroke="#C0001A" strokeWidth="0.8" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 3px rgba(192,0,26,0.6))' }} />
          {/* Dots */}
          {pts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={hovered === i ? 2 : 1.2}
              fill={hovered === i ? '#C0001A' : '#fff'}
              stroke="#C0001A" strokeWidth={0.5}
              style={{ transition: 'r 0.15s', cursor: 'default' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </svg>

        {/* Tooltip */}
        {hovered !== null && (
          <div style={{ position: 'absolute', top: 0, left: `${pts[hovered].x}%`, transform: 'translate(-50%, -100%)', pointerEvents: 'none', background: 'rgba(20,20,20,0.95)', border: '1px solid rgba(192,0,26,0.35)', borderRadius: 8, padding: '6px 10px', fontSize: 11 }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>{pts[hovered].label}</p>
            <p style={{ color: '#fff', margin: 0, fontWeight: 600 }}>USD {pts[hovered].ingresos.toLocaleString('es-AR')}</p>
          </div>
        )}
      </div>

      {/* Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        {historial.map((h, i) => (
          <span key={i} style={{ fontSize: 10, color: hovered === i ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)', textTransform: 'capitalize', transition: 'color 0.15s' }}>{h.label}</span>
        ))}
      </div>
    </div>
  )
}

// ─── Ctrl+K Palette ──────────────────────────────────────────────────────
const ACCIONES_RAPIDAS = [
  { icon: Briefcase, label: 'Nuevo proyecto', href: '/admin/proyectos', color: '#3B82F6' },
  { icon: FileText, label: 'Nuevo presupuesto', href: '/admin/presupuestos', color: '#F59E0B' },
  { icon: Users, label: 'Clientes', href: '/admin/clientes', color: '#8B5CF6' },
  { icon: CalendarBlank, label: 'Agenda', href: '/admin/agenda', color: '#10B981' },
  { icon: Lightning, label: 'Cerrar proyecto', href: '/admin/cerrar-proyecto', color: '#C0001A' },
]

function CmdKPalette({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ nombre: string; tipo: string; href: string }[]>([])
  const [sel, setSel] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setOpen])

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 50); setQuery(''); setSel(0) }
  }, [open])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const q = query.toLowerCase()
    Promise.all([
      fetch('/api/admin/proyectos').then(r => r.json()).catch(() => ({ proyectos: [] })),
      fetch('/api/admin/clientes').then(r => r.json()).catch(() => ({ clientes: [] })),
    ]).then(([p, c]) => {
      const res: { nombre: string; tipo: string; href: string }[] = [
        ...(p.proyectos ?? []).filter((x: any) => (x.nombre ?? x.name ?? '').toLowerCase().includes(q)).slice(0, 4).map((x: any) => ({ nombre: x.nombre ?? x.name, tipo: 'Proyecto', href: '/admin/proyectos' })),
        ...(c.clientes ?? []).filter((x: any) => (x.nombre ?? x.name ?? '').toLowerCase().includes(q)).slice(0, 3).map((x: any) => ({ nombre: x.nombre ?? x.name, tipo: 'Cliente', href: '/admin/clientes' })),
      ]
      setResults(res); setSel(0)
    })
  }, [query])

  const filteredAcciones = ACCIONES_RAPIDAS.filter(a => !query.trim() || a.label.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (!open) return
      const total = results.length + filteredAcciones.length
      if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => (s + 1) % total) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => (s - 1 + total) % total) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, results.length, filteredAcciones.length])

  if (!open) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 120, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
    >
      <div style={{ width: '100%', maxWidth: 560, background: '#111', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.7)', animation: 'kzFadeUp 0.18s ease both' }}>
        {/* Search input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <MagnifyingGlass size={16} color="rgba(255,255,255,0.4)" />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar proyectos, clientes, acciones..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 15, color: '#fff', fontFamily: 'inherit' }} />
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'rgba(255,255,255,0.35)', fontSize: 11, padding: '2px 8px', cursor: 'pointer', fontFamily: 'inherit' }}>Esc</button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 360, overflowY: 'auto', padding: '8px 0' }}>
          {results.length > 0 && (
            <>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 20px 4px' }}>Resultados</p>
              {results.map((r, i) => (
                <Link key={i} href={r.href} onClick={() => setOpen(false)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', background: sel === i ? 'rgba(255,255,255,0.06)' : 'transparent', transition: 'background 0.1s' }}
                    onMouseEnter={() => setSel(i)} >
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Briefcase size={14} color="rgba(255,255,255,0.5)" />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, color: '#fff', margin: 0 }}>{r.nombre}</p>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>{r.tipo}</p>
                    </div>
                    <ArrowUpRight size={13} color="rgba(255,255,255,0.2)" style={{ marginLeft: 'auto' }} />
                  </div>
                </Link>
              ))}
            </>
          )}

          {/* Quick actions */}
          {filteredAcciones.length > 0 && (
            <>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '8px 20px 4px' }}>Acciones rápidas</p>
              {filteredAcciones.map((a, i) => {
                const idx = results.length + i
                return (
                  <Link key={i} href={a.href} onClick={() => setOpen(false)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', background: sel === idx ? 'rgba(255,255,255,0.06)' : 'transparent', transition: 'background 0.1s' }}
                      onMouseEnter={() => setSel(idx)}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: `${a.color}18`, border: `1px solid ${a.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <a.icon size={14} color={a.color} />
                      </div>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{a.label}</span>
                      <ArrowUpRight size={13} color="rgba(255,255,255,0.2)" style={{ marginLeft: 'auto' }} />
                    </div>
                  </Link>
                )
              })}
            </>
          )}

          {!query.trim() && results.length === 0 && filteredAcciones.length === 0 && (
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', textAlign: 'center', padding: '24px 20px' }}>Escribí para buscar...</p>
          )}
        </div>
      </div>
    </div>
  )
}

// Balance hero — ingresos + mantenimiento vs gastos vs neto del mes — ingresos + mantenimiento vs gastos vs neto del mes
function BalanceHero({ ingresos, gastos, mantenimiento, balance, mes, meta }: { ingresos: number; gastos: number; mantenimiento: number; balance: number; mes: string; meta: number }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 0); return () => clearTimeout(t) }, [])
  const positivo = balance >= 0
  const acento = positivo ? '#10B981' : '#EF4444'

  // Progreso de meta mensual: ingresos facturados + mantenimiento vs objetivo
  const logrado = ingresos + mantenimiento
  const pct = meta > 0 ? Math.min((logrado / meta) * 100, 100) : 0
  const metaCumplida = meta > 0 && logrado >= meta
  const metaColor = metaCumplida ? '#10B981' : '#C0001A'

  return (
    <div style={{
      background: `linear-gradient(135deg, ${acento}0d 0%, rgba(255,255,255,0.02) 60%)`,
      border: `1px solid ${acento}25`,
      borderRadius: 16, padding: '24px 26px', marginBottom: 14, position: 'relative', overflow: 'hidden',
      opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)',
      transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.32,0.72,0,1)',
    }}>
      <div style={{ position: 'absolute', top: -40, right: -20, width: 160, height: 160, borderRadius: '50%', background: `${acento}12`, filter: 'blur(50px)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Scales size={15} color={acento} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Balance · {mes}</span>
          </div>
          <p style={{ fontSize: 40, fontWeight: 600, color: acento, lineHeight: 1, margin: 0, fontVariantNumeric: 'tabular-nums', textShadow: `0 0 40px ${acento}40` }}>
            {positivo ? '' : '−'}USD <AnimatedNumber value={Math.abs(balance)} />
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: '8px 0 0' }}>
            {positivo ? 'Ganancia neta del mes' : 'Pérdida del mes'}
          </p>
        </div>

        {/* Desglose */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>Proyectos</p>
            <p style={{ fontSize: 20, fontWeight: 600, color: '#10B981', margin: 0, fontVariantNumeric: 'tabular-nums' }}>USD <AnimatedNumber value={ingresos} /></p>
          </div>
          <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.1)' }} />
          <div>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>Mantenimiento</p>
            <p style={{ fontSize: 20, fontWeight: 600, color: '#A78BFA', margin: 0, fontVariantNumeric: 'tabular-nums' }}>USD <AnimatedNumber value={mantenimiento} /></p>
          </div>
          <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.1)' }} />
          <div>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>Gastos</p>
            <p style={{ fontSize: 20, fontWeight: 600, color: '#F59E0B', margin: 0, fontVariantNumeric: 'tabular-nums' }}>USD <AnimatedNumber value={gastos} /></p>
          </div>
        </div>
      </div>

      {/* Progreso de meta mensual */}
      {meta > 0 && (
        <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 7 }}>
              🎯 Meta del mes
              {metaCumplida && <span style={{ fontSize: 10, color: '#10B981', background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 5, padding: '1px 8px', letterSpacing: '0.04em' }}>¡Cumplida!</span>}
            </span>
            <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', fontVariantNumeric: 'tabular-nums' }}>
              <span style={{ color: metaColor, fontWeight: 600 }}>USD {logrado.toLocaleString('es-AR')}</span>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}> / {meta.toLocaleString('es-AR')}</span>
            </span>
          </div>
          <div style={{ height: 8, borderRadius: 6, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', position: 'relative' }}>
            <div style={{
              height: '100%', borderRadius: 6, width: visible ? `${pct}%` : '0%',
              background: metaCumplida ? 'linear-gradient(90deg, #10B981, #34D399)' : 'linear-gradient(90deg, #C0001A, #ff3352)',
              boxShadow: `0 0 12px ${metaColor}70`,
              transition: 'width 1.2s cubic-bezier(0.32,0.72,0,1)',
            }} />
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '8px 0 0' }}>
            {metaCumplida ? 'Superaste el objetivo del mes 🚀' : `Te falta USD ${Math.max(meta - logrado, 0).toLocaleString('es-AR')} para llegar`}
          </p>
        </div>
      )}

    </div>
  )
}

function fechaLabel(fecha: string, hoy: string) {
  const mañana = new Date(hoy); mañana.setDate(mañana.getDate() + 1)
  const mañanaStr = mañana.toISOString().slice(0, 10)
  if (fecha === hoy) return null // sin etiqueta para hoy
  if (fecha === mañanaStr) return 'Mañana'
  return fecha
}

function TareasHoy() {
  const [tareas, setTareas] = useState<Tarea[]>([])
  const hoy = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD local

  const load = useCallback(() => {
    fetch('/api/admin/tareas').then(r => r.json())
      .then(d => {
        const proximas = new Date(hoy); proximas.setDate(proximas.getDate() + 2)
        const proxStr = proximas.toISOString().slice(0, 10)
        setTareas((d.tareas ?? []).filter((t: Tarea) => t.fecha >= hoy && t.fecha <= proxStr))
      })
      .catch(() => {})
  }, [hoy])
  useEffect(() => { load() }, [load])
  useLiveRefresh(load)

  async function toggle(t: Tarea) {
    setTareas(ts => ts.map(x => x.id === t.id ? { ...x, hecha: !x.hecha } : x))
    await fetch('/api/admin/tareas', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: t.id, hecha: !t.hecha }) })
  }

  const orden = [...tareas].sort((a, b) => a.fecha.localeCompare(b.fecha) || (a.hora || '99').localeCompare(b.hora || '99'))
  const pend = tareas.filter(t => !t.hecha && t.fecha === hoy).length

  return (
    <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 22px', marginBottom: 14, animation: 'fadeSlideUp 0.5s ease 0.2s both' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <CalendarBlank size={16} color="#C0001A" weight="fill" />
          <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>Tareas próximas</span>
          {pend > 0 && <span style={{ fontSize: 11, color: '#C0001A', background: 'rgba(192,0,26,0.12)', border: '1px solid rgba(192,0,26,0.25)', borderRadius: 5, padding: '1px 7px' }}>{pend} hoy</span>}
        </div>
        <Link href="/admin/agenda" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>Ver agenda <ArrowUpRight size={12} /></Link>
      </div>
      {orden.length === 0 ? (
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)', margin: 0 }}>Sin tareas los próximos días 🎉</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {orden.map((t, i) => {
            const info = TIPOS_T[t.tipo] ?? TIPOS_T.otro
            const Icon = info.icon
            const etiqueta = fechaLabel(t.fecha, hoy)
            return (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.15)', border: `1px solid ${t.hecha ? 'rgba(255,255,255,0.04)' : info.color + '22'}`, borderLeft: `2px solid ${etiqueta ? 'rgba(255,255,255,0.15)' : info.color}`, opacity: t.hecha ? 0.5 : 1, transition: 'opacity 0.2s', animation: `fadeSlideUp 0.35s ease ${i * 50 + 250}ms both` }}>
                <button onClick={() => toggle(t)} style={{ width: 17, height: 17, borderRadius: 5, flexShrink: 0, cursor: 'pointer', border: `1.5px solid ${t.hecha ? info.color : 'rgba(255,255,255,0.25)'}`, background: t.hecha ? info.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>{t.hecha && <Check size={11} color="#fff" weight="bold" />}</button>
                <Icon size={14} color={etiqueta ? 'rgba(255,255,255,0.3)' : info.color} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13, color: t.hecha ? 'rgba(255,255,255,0.45)' : etiqueta ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.85)', textDecoration: t.hecha ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.titulo}</span>
                {etiqueta && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.06)', borderRadius: 4, padding: '2px 6px', flexShrink: 0 }}>{etiqueta}</span>}
                {t.hora && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}><Clock size={11} /> {t.hora}</span>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const TIPO_COLOR: Record<string, string> = {
  llamada: '#10B981', videollamada: '#3B82F6', reunion: '#8B5CF6', proyecto: '#C0001A', otro: '#F59E0B'
}
const TIPO_EMOJI: Record<string, string> = {
  llamada: '📞', videollamada: '🎥', reunion: '🤝', proyecto: '⚡', otro: '📌'
}
const DIAS_NOMBRE = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado']
const MESES_NOMBRE = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']

function CalPopover({ iso, tareas, style }: { iso: string; tareas: Tarea[]; style: React.CSSProperties }) {
  const [y, m, d] = iso.split('-').map(Number)
  const fecha = new Date(y, m - 1, d)
  const label = `${DIAS_NOMBRE[fecha.getDay()]} ${d} de ${MESES_NOMBRE[m - 1]}`
  const tareasDelDia = tareas.filter(t => t.fecha === iso).sort((a, b) => (a.hora || '99').localeCompare(b.hora || '99'))

  return (
    <div style={{
      position: 'fixed', zIndex: 999, pointerEvents: 'none',
      background: 'rgba(12,12,14,0.97)', border: '1px solid rgba(192,0,26,0.3)',
      borderRadius: 12, padding: '14px 16px', minWidth: 220, maxWidth: 280,
      boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
      backdropFilter: 'blur(16px)',
      animation: 'calPopIn 0.18s cubic-bezier(0.32,0.72,0,1) both',
      ...style,
    }}>
      <p style={{ fontSize: 10, color: '#C0001A', letterSpacing: '0.1em', textTransform: 'capitalize', margin: '0 0 10px', fontWeight: 600 }}>{label}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {tareasDelDia.slice(0, 5).map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 3, height: 3, borderRadius: '50%', background: TIPO_COLOR[t.tipo] ?? '#F59E0B', flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: t.hecha ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.85)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: t.hecha ? 'line-through' : 'none' }}>
              {TIPO_EMOJI[t.tipo] ?? '📌'} {t.titulo}
            </span>
            {t.hora && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>{t.hora}</span>}
          </div>
        ))}
        {tareasDelDia.length > 5 && (
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: 0 }}>+{tareasDelDia.length - 5} más</p>
        )}
      </div>
    </div>
  )
}

function MiniCalendario() {
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [mes, setMes] = useState(() => new Date())
  const [hoveredIso, setHoveredIso] = useState<string | null>(null)
  const [popPos, setPopPos] = useState({ x: 0, y: 0 })
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const hoy = new Date().toLocaleDateString('en-CA')

  const loadCal = useCallback(() => {
    fetch('/api/admin/tareas').then(r => r.json())
      .then(d => setTareas(d.tareas ?? []))
      .catch(() => {})
  }, [])
  useEffect(() => { loadCal() }, [loadCal])
  useLiveRefresh(loadCal)

  const year = mes.getFullYear()
  const month = mes.getMonth()
  const primerDia = new Date(year, month, 1)
  const diasMes = new Date(year, month + 1, 0).getDate()
  const offsetInicio = (primerDia.getDay() + 6) % 7
  const nombreMes = mes.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })

  const fechasConTareas = new Set(
    tareas.filter(t => t.fecha.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)).map(t => t.fecha)
  )
  const tiposPorFecha: Record<string, string[]> = {}
  tareas.forEach(t => {
    if (!tiposPorFecha[t.fecha]) tiposPorFecha[t.fecha] = []
    if (!tiposPorFecha[t.fecha].includes(t.tipo)) tiposPorFecha[t.fecha].push(t.tipo)
  })

  const celdas = [...Array(offsetInicio).fill(null), ...Array.from({ length: diasMes }, (_, i) => i + 1)]
  const semanas: (number | null)[][] = []
  for (let i = 0; i < celdas.length; i += 7) semanas.push(celdas.slice(i, i + 7).concat(Array(7 - celdas.slice(i, i + 7).length).fill(null)))

  function handleDayEnter(iso: string, e: React.MouseEvent<HTMLDivElement>) {
    clearTimeout(leaveTimer.current)
    if (!fechasConTareas.has(iso)) { setHoveredIso(null); return }
    const rect = e.currentTarget.getBoundingClientRect()
    const POP_W = 290
    // Si no entra a la derecha, lo abrimos a la izquierda de la celda
    const x = rect.right + 10 + POP_W > window.innerWidth ? Math.max(8, rect.left - POP_W - 10) : rect.right + 10
    const y = Math.min(rect.top - 8, window.innerHeight - 220)
    setPopPos({ x, y })
    setHoveredIso(iso)
  }

  function handleDayLeave() {
    leaveTimer.current = setTimeout(() => setHoveredIso(null), 120)
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 22px', animation: 'fadeSlideUp 0.5s ease 0.35s both', position: 'relative' }}>
      <style>{`@keyframes calPopIn { from{opacity:0;transform:scale(0.96) translateY(4px)} to{opacity:1;transform:scale(1) translateY(0)} }`}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CalendarBlank size={16} color="#C0001A" weight="fill" />
          <span style={{ fontSize: 13, color: '#fff', fontWeight: 600, textTransform: 'capitalize' }}>{nombreMes}</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => setMes(m => new Date(m.getFullYear(), m.getMonth() - 1))}
            style={{ width: 26, height: 26, borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
          <button onClick={() => setMes(new Date())}
            style={{ padding: '0 8px', height: 26, borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)', fontSize: 10, cursor: 'pointer', letterSpacing: '0.05em' }}>HOY</button>
          <button onClick={() => setMes(m => new Date(m.getFullYear(), m.getMonth() + 1))}
            style={{ width: 26, height: 26, borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
        </div>
      </div>

      {/* Días de semana */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 6 }}>
        {['L','M','X','J','V','S','D'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 600, letterSpacing: '0.08em', padding: '4px 0' }}>{d}</div>
        ))}
      </div>

      {/* Semanas */}
      {semanas.map((semana, si) => (
        <div key={si} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 2 }}>
          {semana.map((dia, di) => {
            if (!dia) return <div key={di} />
            const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
            const esHoy = iso === hoy
            const tieneT = fechasConTareas.has(iso)
            const tipos = tiposPorFecha[iso] ?? []
            const isHovered = hoveredIso === iso
            return (
              <div key={di}
                onMouseEnter={e => handleDayEnter(iso, e)}
                onMouseLeave={handleDayLeave}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5px 2px',
                  borderRadius: 7,
                  background: isHovered ? 'rgba(192,0,26,0.18)' : esHoy ? 'rgba(192,0,26,0.15)' : tieneT ? 'rgba(255,255,255,0.04)' : 'transparent',
                  border: esHoy ? '1px solid rgba(192,0,26,0.35)' : isHovered ? '1px solid rgba(192,0,26,0.4)' : '1px solid transparent',
                  cursor: tieneT ? 'pointer' : 'default',
                  transition: 'all 0.15s cubic-bezier(0.32,0.72,0,1)',
                  transform: isHovered && tieneT ? 'scale(1.12)' : 'scale(1)',
                }}>
                <span style={{ fontSize: 12, color: esHoy ? '#fff' : tieneT ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)', fontWeight: esHoy || isHovered ? 700 : 400, lineHeight: 1 }}>{dia}</span>
                {tipos.length > 0 && (
                  <div style={{ display: 'flex', gap: 2, marginTop: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {tipos.slice(0, 3).map((tp, ti) => (
                      <div key={ti} style={{ width: 4, height: 4, borderRadius: '50%', background: TIPO_COLOR[tp] ?? '#F59E0B', boxShadow: isHovered ? `0 0 4px ${TIPO_COLOR[tp]}` : 'none', transition: 'box-shadow 0.15s' }} />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}

      {/* Popover flotante — portal directo al body para evitar clipping */}
      {hoveredIso && fechasConTareas.has(hoveredIso) && typeof document !== 'undefined' && createPortal(
        <CalPopover iso={hoveredIso} tareas={tareas} style={{ left: popPos.x, top: popPos.y }} />,
        document.body
      )}
    </div>
  )
}

// Frases motivadoras — 10 frases, cambian cada lunes (semana ISO)
const FRASES_KIANZO = [
  { texto: 'Cada pixel cuenta una historia. Hacé que valga la pena contarla.', autor: 'Filosofía Kianzo' },
  { texto: 'No diseñamos páginas, construimos experiencias que la gente recuerda.', autor: 'Filosofía Kianzo' },
  { texto: 'Lo simple es lo más difícil de lograr. Y es exactamente lo que buscamos.', autor: 'Filosofía Kianzo' },
  { texto: 'Un buen diseño es invisible. Un gran diseño es inolvidable.', autor: 'Filosofía Kianzo' },
  { texto: 'La diferencia entre bueno y extraordinario está en los detalles.', autor: 'Filosofía Kianzo' },
  { texto: 'Convertimos ideas en marcas, y marcas en movimientos.', autor: 'Filosofía Kianzo' },
  { texto: 'El código limpio es poesía. El diseño limpio es arquitectura.', autor: 'Filosofía Kianzo' },
  { texto: 'No seguimos tendencias — las anticipamos.', autor: 'Filosofía Kianzo' },
  { texto: 'Cada proyecto es una oportunidad de dejar una marca en el mundo digital.', autor: 'Filosofía Kianzo' },
  { texto: 'El cliente ve el resultado. Nosotros vivimos el proceso. Ambos tienen que ser extraordinarios.', autor: 'Filosofía Kianzo' },
]

function getISOWeek(d: Date): number {
  const date = new Date(d); date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7)
  const week1 = new Date(date.getFullYear(), 0, 4)
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [cmdkOpen, setCmdkOpen] = useState(false)
  const [nombre, setNombre] = useState('Kianzo')
  const [metaMensual, setMetaMensual] = useState(0)

  const load = useCallback(() => {
    fetch('/api/admin/dashboard')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])
  useEffect(() => { load() }, [load])
  useLiveRefresh(load)

  // Config compartida (nombre + meta mensual)
  useEffect(() => {
    fetch('/api/admin/config').then(r => r.json()).then(d => {
      if (d.config?.nombre) setNombre(d.config.nombre)
      setMetaMensual(d.config?.metaMensual ?? 0)
    }).catch(() => {})
  }, [])

  // Global Ctrl+K listener para abrir la palette desde cualquier página
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setCmdkOpen(o => !o) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const now = new Date()
  const mes = now.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
  const frase = FRASES_KIANZO[getISOWeek(now) % FRASES_KIANZO.length]
  const hora = now.getHours()
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div style={{ padding: '36px 40px 80px', maxWidth: 1400, margin: '0 auto' }}>
      <style>{`
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes kzFadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes kzSearchPulse { 0%,100%{box-shadow:0 0 0 0 rgba(192,0,26,0)} 50%{box-shadow:0 0 0 3px rgba(192,0,26,0.15)} }
      `}</style>

      {/* ── Header: título izq | frase + buscar der ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32, marginBottom: 28, flexWrap: 'wrap' }}>

        {/* Saludo + título */}
        <div style={{ animation: 'fadeSlideUp 0.5s ease both' }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>{saludo} · {mes}</p>
          <h1 style={{ fontSize: 38, fontWeight: 400, color: '#fff', lineHeight: 1.05, margin: 0 }}>
            <span style={{ fontFamily: 'var(--font-serif-var), Cormorant Garamond, serif', fontWeight: 600, fontStyle: 'italic' }}>Bienvenido, </span>
            <span style={{ fontFamily: 'var(--font-body-var), Space Grotesk, sans-serif', fontWeight: 300, color: '#C0001A', letterSpacing: '-0.01em', textShadow: '0 0 40px rgba(192,0,26,0.4)' }}>{nombre}</span>
          </h1>
        </div>

        {/* Frase + buscar — bloque derecho integrado */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, animation: 'fadeSlideUp 0.5s ease 0.1s both', maxWidth: 440 }}>
          {/* Frase del día */}
          <div style={{ position: 'relative', padding: '18px 22px 18px 26px', borderRadius: '14px 14px 0 0', background: 'linear-gradient(135deg, rgba(192,0,26,0.07) 0%, rgba(255,255,255,0.015) 100%)', border: '1px solid rgba(192,0,26,0.18)', borderBottom: 'none' }}>
            <div style={{ position: 'absolute', left: 0, top: 16, bottom: 16, width: 3, borderRadius: 3, background: 'linear-gradient(to bottom, #C0001A, #ff3352)' }} />
            <span style={{ position: 'absolute', top: 6, left: 14, fontSize: 38, color: 'rgba(192,0,26,0.25)', fontFamily: 'Georgia, serif', lineHeight: 1 }}>"</span>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.78)', margin: 0, lineHeight: 1.55, fontStyle: 'italic', fontFamily: 'var(--font-serif-var), Cormorant Garamond, serif', fontWeight: 500 }}>{frase.texto}</p>
            <p style={{ fontSize: 10, color: 'rgba(192,0,26,0.7)', margin: '8px 0 0', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>— {frase.autor}</p>
          </div>
          {/* Botón buscar — tab inferior de la frase card */}
          <button
            onClick={() => setCmdkOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(192,0,26,0.18)',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '0 0 14px 14px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.22s cubic-bezier(0.32,0.72,0,1)',
              width: '100%',
            }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.background = 'rgba(255,255,255,0.06)'; el.style.borderColor = 'rgba(192,0,26,0.3)' }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'rgba(255,255,255,0.03)'; el.style.borderColor = 'rgba(192,0,26,0.18)' }}
          >
            <MagnifyingGlass size={13} color="rgba(255,255,255,0.3)" />
            <span style={{ flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.01em', textAlign: 'left' }}>Buscar proyectos, clientes...</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <kbd style={{ fontSize: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '2px 6px', color: 'rgba(255,255,255,0.22)', fontFamily: 'inherit' }}>Ctrl</kbd>
              <kbd style={{ fontSize: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '2px 6px', color: 'rgba(255,255,255,0.22)', fontFamily: 'inherit' }}>K</kbd>
            </div>
          </button>
        </div>
      </div>

      {/* ── Balance hero ── */}
      {loading ? (
        <div style={{ marginBottom: 14 }}><Shimmer h={110} br={16} /></div>
      ) : (
        <BalanceHero ingresos={data?.ingresosMes ?? 0} gastos={data?.gastosMes ?? 0} mantenimiento={data?.mantenimientoMes ?? 0} balance={data?.balanceMes ?? 0} mes={mes} meta={metaMensual} />
      )}

      {/* ── Stat cards (3 col) ── */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 14 }}>
          {[...Array(3)].map((_, i) => <Shimmer key={i} h={108} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 14 }}>
          <StatCard icon={Folder} label="Proyectos activos" value={data?.proyectosActivos ?? 0} color="#3B82F6" numeric delay={0} />
          <StatCard icon={FileText} label="Presupuestos pendientes" value={data?.presupuestosPendientes ?? 0} color="#F59E0B" numeric delay={80} />
          <StatCard icon={Folder} label="Cerrados este mes" value={data?.cerradosMes ?? 0} color="#C0001A" numeric delay={160} />
        </div>
      )}

      {/* ── Calendario + Business Health Score (lado a lado) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <MiniCalendario />
        {!loading && data
          ? <BusinessHealthScore data={data} />
          : <Shimmer h={280} />
        }
      </div>

      {/* ── Seguimiento (si hay) ── */}
      {!loading && (data?.seguimiento?.length ?? 0) > 0 && (
        <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.22)', borderRadius: 14, padding: '18px 22px', marginBottom: 14, animation: 'fadeSlideUp 0.5s ease 0.25s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
            <BellRinging size={16} color="#F59E0B" weight="fill" />
            <span style={{ fontSize: 13, color: '#F59E0B', fontWeight: 600 }}>
              {data!.seguimiento.length} presupuesto{data!.seguimiento.length > 1 ? 's' : ''} sin respuesta
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>· conviene hacer follow-up</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data!.seguimiento.slice(0, 5).map((s, i) => (
              <Link key={i} href="/admin/presupuestos" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.15)', transition: 'all 0.2s', animation: `fadeSlideUp 0.4s ease ${i * 60 + 300}ms both` }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(245,158,11,0.3)'; el.style.transform = 'translateX(3px)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.05)'; el.style.transform = 'translateX(0)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.proyecto}</span>
                    {s.cliente && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>· {s.cliente}</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    {s.monto != null && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontVariantNumeric: 'tabular-nums' }}>USD {s.monto.toLocaleString('es-AR')}</span>}
                    <span style={{ fontSize: 10, color: '#F59E0B', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 5, padding: '2px 8px', whiteSpace: 'nowrap' }}>hace {s.dias} días</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Revenue Chart — ancho completo al fondo ── */}
      {!loading && data?.historialMeses && (
        <RevenueChart historial={data.historialMeses} />
      )}

      {/* Ctrl+K Command Palette */}
      <CmdKPalette open={cmdkOpen} setOpen={setCmdkOpen} />
    </div>
  )
}
