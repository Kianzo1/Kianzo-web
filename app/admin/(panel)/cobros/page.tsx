'use client'

import { useCallback, useEffect, useState } from 'react'
import { CurrencyDollar, Spinner, Briefcase } from '@phosphor-icons/react'
import { useLiveRefresh } from '@/lib/useLiveRefresh'

type Proyecto = {
  id: string; nombre: string; cliente: string; estado: string
  monto: number | null; servicio: string; creado: string
}

// Columnas del pipeline de cobro
const COLUMNAS = [
  { key: 'Pendiente',  color: '#F59E0B', desc: 'Por cobrar' },
  { key: 'En proceso', color: '#3B82F6', desc: 'En curso' },
  { key: 'Cobrado',    color: '#10B981', desc: 'Finalizado' },
  { key: 'Cancelado',  color: '#6B7280', desc: 'Sin avance' },
] as const

// Mapeo del estado real del proyecto → columna de cobro
const ESTADO_A_COBRO: Record<string, string> = {
  'Aprobado':             'Pendiente',
  'En desarrollo':        'En proceso',
  'Correcciones':         'En proceso',
  'Anticipo cobrado':     'En proceso',
  'Activo mantenimiento': 'Cobrado',
  'Cerrado':              'Cobrado',
  'Cancelado':            'Cancelado',
}
function columnaDe(estado: string): string {
  return ESTADO_A_COBRO[estado] ?? 'Pendiente'
}

// Estado representativo al soltar una card en una columna
const COBRO_A_ESTADO: Record<string, string> = {
  'Pendiente':  'Aprobado',
  'En proceso': 'En desarrollo',
  'Cobrado':    'Cerrado',
  'Cancelado':  'Cancelado',
}

// Estados específicos disponibles dentro de cada columna (para elegir el fino)
const ESTADOS_POR_COLUMNA: Record<string, string[]> = (() => {
  const m: Record<string, string[]> = { Pendiente: [], 'En proceso': [], Cobrado: [], Cancelado: [] }
  Object.entries(ESTADO_A_COBRO).forEach(([estado, col]) => { (m[col] ??= []).push(estado) })
  return m
})()

function fmt(n: number) {
  return n.toLocaleString('es-AR')
}

export default function CobrosPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [loading, setLoading] = useState(true)
  const [dragId, setDragId] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<string | null>(null)
  // Picker de estado fino al soltar: { id, colKey }
  const [picker, setPicker] = useState<{ id: string; colKey: string } | null>(null)

  const load = useCallback(() => {
    fetch('/api/admin/proyectos')
      .then(r => r.json())
      .then(d => { setProyectos(d.proyectos ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])
  useEffect(() => { load() }, [load])
  useLiveRefresh(load)

  // Soltar: si la columna tiene 1 solo estado → directo; si tiene varios → abrir picker
  function soltarEn(id: string, colKey: string) {
    const actual = proyectos.find(p => p.id === id)
    if (!actual || columnaDe(actual.estado) === colKey) return
    const opciones = ESTADOS_POR_COLUMNA[colKey] ?? []
    if (opciones.length <= 1) {
      aplicarEstado(id, opciones[0] ?? COBRO_A_ESTADO[colKey])
    } else {
      setPicker({ id, colKey })
    }
  }

  async function aplicarEstado(id: string, nuevoEstado: string) {
    const actual = proyectos.find(p => p.id === id)
    if (!actual) return
    const estadoPrevio = actual.estado
    setProyectos(ps => ps.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p))
    setPicker(null)
    try {
      const res = await fetch('/api/admin/proyectos', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, estado: nuevoEstado }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setProyectos(ps => ps.map(p => p.id === id ? { ...p, estado: estadoPrevio } : p))
    }
  }

  const porColumna: Record<string, Proyecto[]> = {}
  COLUMNAS.forEach(c => { porColumna[c.key] = [] })
  proyectos.forEach(p => {
    const col = columnaDe(p.estado)
    ;(porColumna[col] ??= []).push(p)
  })

  const totalPipeline = proyectos
    .filter(p => columnaDe(p.estado) !== 'Cancelado')
    .reduce((s, p) => s + (p.monto ?? 0), 0)
  const cobrado = porColumna['Cobrado'].reduce((s, p) => s + (p.monto ?? 0), 0)

  return (
    <div style={{ padding: '44px 48px 80px' }}>
      <style>{`
        @keyframes cbUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cbSpin { to { transform: rotate(360deg) } }
        .cb-card { transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s, border-color 0.18s; }
        .cb-card:hover { transform: translateY(-2px) scale(1.01); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .cb-col-scroll::-webkit-scrollbar { width: 4px }
        .cb-col-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px }
        @keyframes cbFade { from{opacity:0} to{opacity:1} }
        @keyframes cbModalUp { from{opacity:0;transform:translateY(12px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }
      `}</style>

      {/* Picker de estado fino */}
      {picker && (() => {
        const col = COLUMNAS.find(c => c.key === picker.colKey)!
        const proy = proyectos.find(p => p.id === picker.id)
        const opciones = ESTADOS_POR_COLUMNA[picker.colKey] ?? []
        return (
          <div onClick={() => setPicker(null)} style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', animation: 'cbFade 0.15s ease' }}>
            <div onClick={e => e.stopPropagation()} style={{ width: 360, maxWidth: '90vw', background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.6)', animation: 'cbModalUp 0.2s cubic-bezier(0.32,0.72,0,1)' }}>
              <div style={{ height: 3, background: `linear-gradient(90deg, ${col.color}, ${col.color}55)` }} />
              <div style={{ padding: '22px 24px' }}>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>Mover a {col.key}</p>
                <p style={{ fontSize: 15, color: '#fff', fontWeight: 600, margin: '0 0 4px' }}>{proy?.nombre}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '0 0 18px' }}>¿En qué estado queda?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {opciones.map(est => {
                    const actual = proy?.estado === est
                    return (
                      <button key={est} onClick={() => aplicarEstado(picker.id, est)} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                        padding: '12px 16px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                        background: actual ? `${col.color}1a` : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${actual ? col.color + '50' : 'rgba(255,255,255,0.08)'}`,
                        color: actual ? '#fff' : 'rgba(255,255,255,0.75)', fontSize: 14,
                        transition: 'all 0.15s',
                      }}
                        onMouseEnter={e => { const b = e.currentTarget; b.style.borderColor = col.color + '50'; b.style.background = `${col.color}12` }}
                        onMouseLeave={e => { const b = e.currentTarget; if (!actual) { b.style.borderColor = 'rgba(255,255,255,0.08)'; b.style.background = 'rgba(255,255,255,0.03)' } }}
                      >
                        {est}
                        {actual && <span style={{ fontSize: 10, color: col.color }}>actual</span>}
                      </button>
                    )
                  })}
                </div>
                <button onClick={() => setPicker(null)} style={{ width: '100%', marginTop: 14, padding: '10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.55)', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer' }}>Cancelar</button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Header */}
      <div className="cb-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 32, animation: 'cbUp 0.5s cubic-bezier(0.22,1,0.36,1) both' }}>
        <div>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>Finanzas · Pipeline</p>
          <h1 style={{ fontSize: 34, fontWeight: 400, color: '#fff', margin: 0, lineHeight: 1.05 }}>
            <span style={{ fontFamily: 'var(--font-serif-var), Cormorant Garamond, serif', fontWeight: 600, fontStyle: 'italic' }}>Cobros </span>
            <span style={{ fontFamily: 'var(--font-body-var), Space Grotesk, sans-serif', fontWeight: 300, letterSpacing: '-0.01em', color: 'rgba(255,255,255,0.6)' }}>por proyecto</span>
          </h1>
        </div>
        {/* Resumen */}
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ padding: '14px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>En pipeline</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: 0, fontVariantNumeric: 'tabular-nums' }}>USD {fmt(totalPipeline)}</p>
          </div>
          <div style={{ padding: '14px 20px', borderRadius: 14, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <p style={{ fontSize: 10, color: 'rgba(16,185,129,0.8)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>Cobrado</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#10B981', margin: 0, fontVariantNumeric: 'tabular-nums', textShadow: '0 0 30px rgba(16,185,129,0.3)' }}>USD {fmt(cobrado)}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.3)', padding: '60px 0', justifyContent: 'center' }}>
          <Spinner size={18} style={{ animation: 'cbSpin 0.7s linear infinite' }} /> Cargando proyectos...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {COLUMNAS.map((col, ci) => {
            const items = porColumna[col.key] ?? []
            const totalCol = items.reduce((s, p) => s + (p.monto ?? 0), 0)
            const over = dragOver === col.key
            return (
              <div key={col.key}
                onDragOver={e => { e.preventDefault(); setDragOver(col.key) }}
                onDragLeave={() => setDragOver(o => o === col.key ? null : o)}
                onDrop={() => { if (dragId) soltarEn(dragId, col.key); setDragId(null); setDragOver(null) }}
                style={{
                display: 'flex', flexDirection: 'column', minHeight: 280,
                background: over ? `${col.color}14` : 'rgba(255,255,255,0.015)',
                border: `1px solid ${over ? col.color + '70' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 16, overflow: 'hidden', transition: 'background 0.15s, border-color 0.15s',
                animation: `cbUp 0.5s cubic-bezier(0.22,1,0.36,1) ${ci * 0.07}s both`,
              }}>
                {/* Barra color */}
                <div style={{ height: 3, background: `linear-gradient(90deg, ${col.color}, ${col.color}55)` }} />
                {/* Header columna */}
                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: col.color, background: `${col.color}18`, border: `1px solid ${col.color}35`, borderRadius: 7, padding: '3px 11px' }}>{col.key}</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{items.length}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.04em' }}>{col.desc}</span>
                    {totalCol > 0 && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>USD {fmt(totalCol)}</span>}
                  </div>
                </div>
                {/* Cards */}
                <div className="cb-col-scroll" style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', maxHeight: 600 }}>
                  {items.length === 0 ? (
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)', textAlign: 'center', padding: '24px 0', margin: 0 }}>Sin proyectos</p>
                  ) : items.map((p, i) => (
                    <div key={p.id} className="cb-card"
                      draggable
                      onDragStart={() => setDragId(p.id)}
                      onDragEnd={() => { setDragId(null); setDragOver(null) }}
                      style={{
                      padding: '13px 15px', borderRadius: 12, cursor: 'grab',
                      background: 'rgba(255,255,255,0.035)', border: `1px solid ${col.color}26`,
                      borderLeft: `2px solid ${col.color}`,
                      opacity: dragId === p.id ? 0.4 : 1,
                      animation: `cbUp 0.4s cubic-bezier(0.22,1,0.36,1) ${ci * 0.07 + i * 0.04 + 0.1}s both`,
                    }}>
                      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', margin: 0, fontWeight: 500, lineHeight: 1.35, wordBreak: 'break-word' }}>{p.nombre}</p>
                      {p.cliente && (
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Briefcase size={11} /> {p.cliente}
                        </p>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, gap: 8 }}>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.05)', borderRadius: 5, padding: '2px 7px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.estado || '—'}</span>
                        {p.monto != null && (
                          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>USD {fmt(p.monto)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Nota mapeo */}
      {!loading && (
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
          <CurrencyDollar size={12} /> Arrastrá una card a otra columna para cambiar el estado del proyecto en Notion.
        </p>
      )}
    </div>
  )
}
