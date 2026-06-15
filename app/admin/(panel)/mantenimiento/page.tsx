'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Wrench, PencilSimple, Check, X, Trash, ArrowsClockwise, CurrencyDollar, TrendUp } from '@phosphor-icons/react'
import { useLiveRefresh } from '@/lib/useLiveRefresh'

type Proyecto = {
  id: string; nombre: string; cliente: string; estado: string
  monto: number | null; servicio: string
  mantenimiento: boolean; mantenimientoUSD: number | null; creado: string
}

function AnimatedNumber({ value, prefix = '' }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number>(0)
  useEffect(() => {
    const start = Date.now(); const duration = 900
    function tick() {
      const p = Math.min((Date.now() - start) / duration, 1)
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))))
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value])
  return <>{prefix}{display.toLocaleString('es-AR')}</>
}

function MRRBarChart({ proyectos, total }: { proyectos: Proyecto[]; total: number }) {
  const sorted = [...proyectos].sort((a, b) => (b.mantenimientoUSD ?? 0) - (a.mantenimientoUSD ?? 0))
  const COLORS = ['#C0001A', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#06B6D4']
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 22px', marginBottom: 16 }}>
      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 18px' }}>Distribución MRR</p>

      {/* Stacked bar total */}
      <div style={{ height: 10, borderRadius: 5, overflow: 'hidden', display: 'flex', marginBottom: 20, background: 'rgba(255,255,255,0.04)' }}>
        {sorted.map((p, i) => {
          const pct = total > 0 ? ((p.mantenimientoUSD ?? 0) / total) * 100 : 0
          return (
            <div key={p.id} title={`${p.nombre}: $${p.mantenimientoUSD}`}
              style={{ width: `${pct}%`, background: COLORS[i % COLORS.length], transition: 'width 1s cubic-bezier(0.32,0.72,0,1)', borderRight: i < sorted.length - 1 ? '2px solid rgba(0,0,0,0.3)' : 'none' }}
            />
          )
        })}
      </div>

      {/* Barras individuales */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sorted.map((p, i) => {
          const pct = total > 0 ? ((p.mantenimientoUSD ?? 0) / total) * 100 : 0
          const color = COLORS[i % COLORS.length]
          const iniciales = (p.cliente || p.nombre).split(' ').slice(0, 2).map((w: string) => w[0]?.toUpperCase() ?? '').join('')
          return (
            <div key={p.id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, boxShadow: `0 0 6px ${color}` }} />
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{p.nombre}</span>
                  {p.cliente && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{p.cliente}</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 13, color, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>USD {(p.mantenimientoUSD ?? 0).toLocaleString('es-AR')}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{pct.toFixed(0)}%</span>
                </div>
              </div>
              <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}99)`, borderRadius: 3, animation: `kzBarGrow 0.9s cubic-bezier(0.32,0.72,0,1) ${i * 80}ms both` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Shimmer({ h = 64 }: { h?: number }) {
  return (
    <div style={{ height: h, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)', animation: 'shimmer 1.8s ease-in-out infinite' }} />
    </div>
  )
}

function ConfirmModal({ nombre, onConfirm, onCancel, loading }: { nombre: string; onConfirm: () => void; onCancel: () => void; loading: boolean }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)', animation: 'kzFadeIn 0.15s ease' }}>
      <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, width: 420, maxWidth: '90vw', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.7)', animation: 'kzSlideUp 0.2s cubic-bezier(0.32,0.72,0,1)' }}>
        <div style={{ height: 3, background: 'linear-gradient(90deg, #C0001A, #8B5CF6)' }} />
        <div style={{ padding: '28px' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(192,0,26,0.1)', border: '1px solid rgba(192,0,26,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Wrench size={22} color="#C0001A" weight="fill" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', margin: '0 0 8px' }}>¿Quitar el mantenimiento?</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: '0 0 10px', lineHeight: 1.5 }}>
            <span style={{ color: '#fff', fontWeight: 500 }}>{nombre}</span> dejará de figurar en mantenimientos.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            <button onClick={onCancel} disabled={loading} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 500, fontFamily: 'inherit' }}>Cancelar</button>
            <button onClick={onConfirm} disabled={loading} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: 'none', background: loading ? 'rgba(192,0,26,0.5)' : '#C0001A', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}>{loading ? 'Quitando...' : 'Sí, quitar'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MantRow({ p, idx, onSaved, onRemove, color }: { p: Proyecto; idx: number; onSaved: () => void; onRemove: (p: Proyecto) => void; color: string }) {
  const [editing, setEditing] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [valor, setValor] = useState(String(p.mantenimientoUSD ?? ''))
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    await fetch('/api/admin/proyectos', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id, mantenimientoUSD: valor }),
    })
    setSaving(false); setEditing(false); onSaved()
  }

  const iniciales = (p.cliente || p.nombre).split(' ').slice(0, 2).map((w: string) => w[0]?.toUpperCase() ?? '').join('')
  const anuales = (p.mantenimientoUSD ?? 0) * 12

  return (
    <div style={{ background: expanded ? 'rgba(192,0,26,0.04)' : 'rgba(255,255,255,0.025)', border: `1px solid ${expanded ? 'rgba(192,0,26,0.25)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, overflow: 'hidden', animation: `kzRowIn 0.4s ease ${idx * 50}ms both`, transition: 'border-color 0.2s, background 0.2s' }}
      onMouseEnter={e => { if (!expanded) { e.currentTarget.style.borderColor = `${color}44`; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' } }}
      onMouseLeave={e => { if (!expanded) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.025)' } }}
    >
      {/* Fila principal */}
      <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }} onClick={() => !editing && setExpanded(v => !v)}>
        {/* Left accent bar */}
        <div style={{ width: 3, height: 36, borderRadius: 2, background: expanded ? '#C0001A' : color, flexShrink: 0, transition: 'background 0.2s' }} />

        <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}20`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13, fontWeight: 700, color, letterSpacing: '-0.02em' }}>{iniciales || '?'}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, color: '#fff', margin: 0, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nombre}</p>
          {p.cliente && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '2px 0 0' }}>{p.cliente}{p.servicio ? ` · ${p.servicio}` : ''}</p>}
        </div>

        {editing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>USD</span>
            <input type="number" value={valor} autoFocus onChange={e => setValor(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false) }}
              style={{ width: 80, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(192,0,26,0.4)', borderRadius: 7, padding: '6px 10px', color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
            <button onClick={save} disabled={saving} style={{ width: 30, height: 30, borderRadius: 7, border: 'none', background: '#C0001A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Check size={14} /></button>
            <button onClick={() => setEditing(false)} style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={14} /></button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 16, color, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>USD {(p.mantenimientoUSD ?? 0).toLocaleString('es-AR')}<span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>/mes</span></div>
            </div>
            <button onClick={e => { e.stopPropagation(); setValor(String(p.mantenimientoUSD ?? '')); setEditing(true) }} title="Editar monto"
              style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', cursor: 'pointer' }}
              onMouseEnter={e => { const b = e.currentTarget; b.style.color = color; b.style.borderColor = `${color}50` }}
              onMouseLeave={e => { const b = e.currentTarget; b.style.color = 'rgba(255,255,255,0.35)'; b.style.borderColor = 'rgba(255,255,255,0.08)' }}
            ><PencilSimple size={13} /></button>
            <button onClick={e => { e.stopPropagation(); onRemove(p) }} title="Quitar mantenimiento"
              style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', cursor: 'pointer' }}
              onMouseEnter={e => { const b = e.currentTarget; b.style.color = '#C0001A'; b.style.borderColor = 'rgba(192,0,26,0.3)' }}
              onMouseLeave={e => { const b = e.currentTarget; b.style.color = 'rgba(255,255,255,0.25)'; b.style.borderColor = 'rgba(255,255,255,0.08)' }}
            ><Trash size={13} /></button>
          </div>
        )}
      </div>

      {/* Panel expandido */}
      <div style={{ maxHeight: expanded ? 120 : 0, overflow: 'hidden', transition: 'max-height 0.3s cubic-bezier(0.32,0.72,0,1)' }}>
        <div style={{ padding: '0 18px 16px 73px', display: 'flex', gap: 20 }}>
          <div style={{ background: 'rgba(192,0,26,0.06)', border: '1px solid rgba(192,0,26,0.15)', borderRadius: 10, padding: '10px 16px', flex: 1 }}>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>Proyección anual</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0, fontVariantNumeric: 'tabular-nums' }}>USD {anuales.toLocaleString('es-AR')}</p>
          </div>
          {p.monto && (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 16px', flex: 1 }}>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>Proyecto original</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.7)', margin: 0, fontVariantNumeric: 'tabular-nums' }}>USD {p.monto.toLocaleString('es-AR')}</p>
            </div>
          )}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 16px', flex: 1 }}>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>Estado</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{p.estado || '—'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MantenimientoPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [loading, setLoading] = useState(true)
  const [toRemove, setToRemove] = useState<Proyecto | null>(null)
  const [removing, setRemoving] = useState(false)

  const load = useCallback(() => {
    fetch('/api/admin/proyectos')
      .then(r => r.json())
      .then(d => { setProyectos((d.proyectos ?? []).filter((p: Proyecto) => p.mantenimiento)); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])
  useLiveRefresh(load)

  async function handleRemove() {
    if (!toRemove) return
    setRemoving(true)
    await fetch('/api/admin/proyectos', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: toRemove.id, mantenimiento: false }),
    })
    setRemoving(false); setToRemove(null); load()
  }

  const totalMRR = proyectos.reduce((s, p) => s + (p.mantenimientoUSD ?? 0), 0)
  const anuales = totalMRR * 12

  const COLORS = ['#C0001A', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#06B6D4']

  return (
    <div style={{ padding: '40px 40px', maxWidth: 820 }}>

      <style>{`
        @keyframes shimmer    { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes kzRowIn    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes kzFadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes kzSlideUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes kzBarGrow  { from{width:0} to{width:var(--w, 100%)} }
      `}</style>

      {toRemove && <ConfirmModal nombre={toRemove.nombre} onConfirm={handleRemove} onCancel={() => setToRemove(null)} loading={removing} />}

      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <div>
          <p style={{ fontSize: 11, color: '#C0001A', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6, opacity: 0.7 }}>Recurrente</p>
          <h1 style={{ fontSize: 28, fontWeight: 400, color: '#fff', margin: 0, lineHeight: 1.1 }}>
            <span style={{ fontFamily: 'var(--font-serif-var), Cormorant Garamond, serif', fontWeight: 600, fontStyle: 'italic' }}>Manteni</span>
            <span style={{ fontFamily: 'var(--font-body-var), Space Grotesk, sans-serif', fontWeight: 300, letterSpacing: '-0.01em', color: 'rgba(255,255,255,0.7)' }}>mientos</span>
          </h1>
        </div>
        {!loading && proyectos.length > 0 && (
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 3px' }}>Proyección anual</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#C0001A', margin: 0, fontVariantNumeric: 'tabular-nums' }}>USD <AnimatedNumber value={anuales} /></p>
          </div>
        )}
      </div>

      {/* Stat cards */}
      {!loading && proyectos.length > 0 && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          {/* MRR card */}
          <div style={{ flex: 2, minWidth: 200, background: 'linear-gradient(135deg, rgba(192,0,26,0.12), rgba(255,255,255,0.02))', border: '1px solid rgba(192,0,26,0.25)', borderRadius: 16, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -30, right: -10, width: 120, height: 120, borderRadius: '50%', background: 'rgba(192,0,26,0.15)', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
              <ArrowsClockwise size={13} color="#C0001A" />
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Ingreso recurrente mensual</span>
            </div>
            <p style={{ fontSize: 34, fontWeight: 700, color: '#fff', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
              USD <AnimatedNumber value={totalMRR} /><span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>/mes</span>
            </p>
          </div>
          {/* Clientes card */}
          <div style={{ minWidth: 130, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>Clientes</p>
            <p style={{ fontSize: 30, fontWeight: 700, color: '#fff', margin: 0 }}><AnimatedNumber value={proyectos.length} /></p>
          </div>
          {/* Promedio card */}
          <div style={{ minWidth: 130, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>Promedio</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.8)', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
              USD <AnimatedNumber value={Math.round(totalMRR / proyectos.length)} />
            </p>
          </div>
        </div>
      )}

      {/* Gráfico de distribución */}
      {!loading && proyectos.length > 1 && (
        <MRRBarChart proyectos={proyectos} total={totalMRR} />
      )}

      {/* Lista */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{[...Array(3)].map((_, i) => <Shimmer key={i} h={68} />)}</div>
      ) : proyectos.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Wrench size={26} color="rgba(255,255,255,0.15)" />
          </div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', margin: '0 0 6px' }}>Ningún proyecto con mantenimiento activo</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)' }}>Marcá "Lleva mantenimiento" al cerrar un proyecto</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>Clic en cada fila para ver detalles</p>
          {proyectos.map((p, i) => (
            <MantRow key={p.id} p={p} idx={i} onSaved={load} onRemove={setToRemove} color={COLORS[i % COLORS.length]} />
          ))}
        </div>
      )}
    </div>
  )
}
