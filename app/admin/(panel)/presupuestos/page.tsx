'use client'

import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { Clock, CurrencyDollar, Trash, Warning, X, MagnifyingGlass, CaretDown, FilePdf, Spinner } from '@phosphor-icons/react'
import { useLiveRefresh } from '@/lib/useLiveRefresh'
import { createPortal } from 'react-dom'
import CustomSelect from '@/app/admin/components/CustomSelect'

type Presupuesto = {
  id: string; proyecto: string; cliente: string
  estado: string; monto: number | null; servicio: string; creado: string
}

const ESTADO_STYLE: Record<string, { color: string; bg: string }> = {
  'Enviado':         { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  'En negociacion':  { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  'En revisión':     { color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
  'Aprobado':        { color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  'Rechazado':       { color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  'Cerrado':         { color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.06)' },
  'Borrador':        { color: 'rgba(255,255,255,0.35)', bg: 'rgba(255,255,255,0.06)' },
}

const MESES_LABEL = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}

function ConfirmModal({ nombre, onConfirm, onCancel, loading }: {
  nombre: string; onConfirm: () => void; onCancel: () => void; loading: boolean
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', animation: 'kzFadeIn 0.15s ease' }}>
      <style>{`@keyframes kzFadeIn{from{opacity:0}to{opacity:1}} @keyframes kzSlideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}} @keyframes kzSpin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, width: 420, maxWidth: '90vw', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.7)', animation: 'kzSlideUp 0.2s cubic-bezier(0.32,0.72,0,1)' }}>
        <div style={{ height: 3, background: 'linear-gradient(90deg, #C0001A, #ff3352)' }} />
        <div style={{ padding: '28px 28px 24px' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(192,0,26,0.1)', border: '1px solid rgba(192,0,26,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Warning size={24} color="#C0001A" weight="fill" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', margin: '0 0 8px', fontFamily: 'inherit' }}>¿Eliminar este registro?</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: '0 0 10px' }}>Estás por eliminar permanentemente:</p>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
            <p style={{ fontSize: 14, color: '#fff', fontWeight: 500, margin: 0 }}>{nombre}</p>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', margin: '0 0 24px' }}>Esta acción archiva el registro en Notion. No se puede deshacer desde el panel.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onCancel} disabled={loading} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 500, fontFamily: 'inherit' }}>Cancelar</button>
            <button onClick={onConfirm} disabled={loading} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: 'none', background: loading ? 'rgba(192,0,26,0.5)' : '#C0001A', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? <><div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'kzSpin 0.6s linear infinite' }} />Eliminando...</> : <><Trash size={15} />Sí, eliminar</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const ESTADOS_PRESU = ['Borrador','Enviado','En negociacion','En revisión','Aprobado','Cerrado','Rechazado']

function EstadoPresupuestoPill({ item, onUpdate }: { item: Presupuesto; onUpdate: (id: string, estado: string) => void }) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const ref = useRef<HTMLButtonElement>(null)

  function openMenu() {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    setPos({ top: r.bottom + 6, left: r.left })
    setOpen(true)
  }

  async function cambiar(nuevoEstado: string) {
    setOpen(false)
    if (nuevoEstado === item.estado) return
    setSaving(true)
    try {
      await fetch('/api/admin/presupuestos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, estado: nuevoEstado }),
      })
      onUpdate(item.id, nuevoEstado)
    } catch {}
    setSaving(false)
  }

  const st = ESTADO_STYLE[item.estado] ?? { color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.06)' }
  return (
    <>
      <button ref={ref} onClick={e => { e.stopPropagation(); openMenu() }} disabled={saving}
        style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: saving ? 'rgba(255,255,255,0.3)' : st.color, background: st.bg, border: `1px solid ${st.color}30`, borderRadius: 6, padding: '4px 8px 4px 9px', whiteSpace: 'nowrap', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
        {saving ? '...' : item.estado || '—'}
        {!saving && <span style={{ fontSize: 9, opacity: 0.5 }}>▾</span>}
      </button>
      {open && typeof document !== 'undefined' && createPortal(
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={() => setOpen(false)} />
          <div style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 999, background: '#161616', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.7)', minWidth: 180, animation: 'kzAcIn 0.15s ease' }}>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '8px 12px 4px', margin: 0 }}>Estado</p>
            {ESTADOS_PRESU.map(e => {
              const c = ESTADO_STYLE[e] ?? { color: 'rgba(255,255,255,0.5)', bg: 'transparent' }
              const activo = e === item.estado
              return (
                <button key={e} onClick={() => cambiar(e)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 12px', background: activo ? 'rgba(192,0,26,0.1)' : 'transparent', borderLeft: activo ? '2px solid #C0001A' : '2px solid transparent', borderTop: 'none', borderRight: 'none', borderBottom: 'none', color: activo ? '#fff' : 'rgba(255,255,255,0.6)', fontSize: 13, fontFamily: 'inherit', textAlign: 'left', cursor: 'pointer', transition: 'all 0.12s' }}
                  onMouseEnter={ev => { const el = ev.currentTarget as HTMLElement; el.style.background = 'rgba(192,0,26,0.12)'; el.style.color = '#fff'; el.style.borderLeftColor = '#C0001A' }}
                  onMouseLeave={ev => { const el = ev.currentTarget as HTMLElement; el.style.background = activo ? 'rgba(192,0,26,0.1)' : 'transparent'; el.style.color = activo ? '#fff' : 'rgba(255,255,255,0.6)'; el.style.borderLeftColor = activo ? '#C0001A' : 'transparent' }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0, boxShadow: activo ? `0 0 6px ${c.color}` : 'none' }} />
                  {e}
                  {activo && <span style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>actual</span>}
                </button>
              )
            })}
          </div>
        </>,
        document.body
      )}
    </>
  )
}

function BotonPDF({ id, cliente }: { id: string; cliente: string }) {
  const [loading, setLoading] = useState(false)

  async function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    setLoading(true)
    const res = await fetch(`/api/admin/generar-pdf?id=${id}`)
    if (res.ok) {
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `propuesta-${cliente.replace(/\s+/g, '-').toLowerCase() || 'kianzo'}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title="Generar PDF"
      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: loading ? '1px solid rgba(192,0,26,0.3)' : '1px solid rgba(192,0,26,0.4)', background: loading ? 'rgba(192,0,26,0.06)' : 'rgba(192,0,26,0.1)', color: loading ? 'rgba(255,255,255,0.4)' : '#fff', fontSize: 12, fontFamily: 'inherit', cursor: loading ? 'default' : 'pointer', transition: 'all 0.15s', flexShrink: 0 }}
    >
      {loading
        ? <><Spinner size={13} style={{ animation: 'kzSpin 0.8s linear infinite' }} />Generando...</>
        : <><FilePdf size={13} weight="fill" />Generar PDF</>
      }
    </button>
  )
}

export default function PresupuestosPage() {
  const [tab,       setTab]       = useState<'activos' | 'respondidos'>('activos')
  const [items,     setItems]     = useState<Presupuesto[]>([])
  const [loading,   setLoading]   = useState(true)
  const [toDelete,  setToDelete]  = useState<Presupuesto | null>(null)
  const [deleting,  setDeleting]  = useState(false)
  const [deleted,   setDeleted]   = useState<string[]>([])
  const [busqueda,  setBusqueda]  = useState('')
  const [mesFiltro, setMesFiltro] = useState('todos')
  const [estadoFiltro, setEstadoFiltro] = useState('todos')
  const [expanded,  setExpanded]  = useState<string | null>(null)

  const load = useCallback((t: 'activos' | 'respondidos') => {
    setLoading(true)
    fetch(`/api/admin/presupuestos?tipo=${t}`)
      .then(r => r.json())
      .then(d => { setItems(d.presupuestos ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { load(tab) }, [tab, load])
  useLiveRefresh(() => load(tab))

  const mesesDisponibles = useMemo(() => {
    const set = new Set<string>()
    items.forEach(p => {
      const d = new Date(p.creado)
      set.add(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`)
    })
    return Array.from(set).sort().reverse()
  }, [items])

  async function handleDelete() {
    if (!toDelete) return
    setDeleting(true)
    const res = await fetch('/api/admin/eliminar', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: toDelete.id }),
    })
    if (res.ok) { setDeleted(d => [...d, toDelete.id]); setToDelete(null) }
    setDeleting(false)
  }

  function handleEstadoUpdate(id: string, nuevoEstado: string) {
    setItems(prev => prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p))
  }

  const estadosDisponibles = useMemo(() => {
    const set = new Set<string>()
    items.filter(p => !deleted.includes(p.id)).forEach(p => { if (p.estado) set.add(p.estado) })
    return Array.from(set).sort()
  }, [items, deleted])

  const visible = useMemo(() => items
    .filter(p => !deleted.includes(p.id))
    .filter(p => estadoFiltro === 'todos' || p.estado === estadoFiltro)
    .filter(p => {
      if (mesFiltro === 'todos') return true
      const d = new Date(p.creado)
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}` === mesFiltro
    })
    .filter(p => !busqueda || p.proyecto.toLowerCase().includes(busqueda.toLowerCase()) || p.cliente.toLowerCase().includes(busqueda.toLowerCase()))
  , [items, deleted, estadoFiltro, mesFiltro, busqueda])

  useEffect(() => {
    if (estadoFiltro !== 'todos' && !estadosDisponibles.includes(estadoFiltro)) setEstadoFiltro('todos')
  }, [estadosDisponibles, estadoFiltro])

  function formatMesLabel(key: string) {
    const [year, month] = key.split('-')
    return `${MESES_LABEL[parseInt(month)-1]} ${year}`
  }

  return (
    <div style={{ padding: '40px 40px', maxWidth: 860 }}>

      {toDelete && <ConfirmModal nombre={toDelete.proyecto} onConfirm={handleDelete} onCancel={() => setToDelete(null)} loading={deleting} />}

      {/* Header */}
      <div style={{ marginBottom: 22, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <div>
          <p style={{ fontSize: 11, color: '#C0001A', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6, opacity: 0.7 }}>Gestión</p>
          <h1 style={{ fontSize: 28, fontWeight: 400, color: '#fff', margin: 0, lineHeight: 1.1 }}>
            <span style={{ fontFamily: 'var(--font-serif-var), Cormorant Garamond, serif', fontWeight: 600, fontStyle: 'italic' }}>Presu</span>
            <span style={{ fontFamily: 'var(--font-body-var), Space Grotesk, sans-serif', fontWeight: 300, letterSpacing: '-0.01em', color: 'rgba(255,255,255,0.7)' }}>puestos</span>
          </h1>
        </div>
        {!loading && visible.length > 0 && (
          <div style={{ display: 'flex', gap: 10 }}>
            {(() => {
              const totalMonto = visible.filter(p => p.monto != null).reduce((s, p) => s + (p.monto ?? 0), 0)
              const urgentes = visible.filter(p => daysSince(p.creado) >= 7).length
              return (
                <>
                  {totalMonto > 0 && (
                    <div style={{ textAlign: 'center', padding: '8px 16px', background: 'rgba(192,0,26,0.08)', border: '1px solid rgba(192,0,26,0.2)', borderRadius: 10 }}>
                      <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0, fontVariantNumeric: 'tabular-nums' }}>USD {totalMonto.toLocaleString('es-AR')}</p>
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: '3px 0 0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>En negociación</p>
                    </div>
                  )}
                  {urgentes > 0 && (
                    <div style={{ textAlign: 'center', padding: '8px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10 }}>
                      <p style={{ fontSize: 16, fontWeight: 700, color: '#EF4444', margin: 0 }}>{urgentes}</p>
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: '3px 0 0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Sin respuesta</p>
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        )}
      </div>

      {/* Controles */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 4 }}>
          {(['activos', 'respondidos'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 18px', borderRadius: 7, border: 'none', fontFamily: 'inherit',
              fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
              background: tab === t ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: tab === t ? '#fff' : 'rgba(255,255,255,0.35)',
              boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
            }}>
              {t === 'activos' ? 'Activos' : 'Respondidos'}
            </button>
          ))}
        </div>

        {/* Búsqueda */}
        <div style={{ position: 'relative', flex: 1, minWidth: 160 }}>
          <MagnifyingGlass size={14} color="rgba(255,255,255,0.25)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar proyecto o cliente..."
            style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 8, padding: '9px 14px 9px 34px', color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const }}
          />
        </div>

        {/* Filtro estado */}
        <CustomSelect value={estadoFiltro} onChange={setEstadoFiltro} placeholder="Todos los estados"
          style={{ minWidth: 150 }}
          options={[
            { value: 'todos', label: 'Todos los estados' },
            ...estadosDisponibles.map(e => ({ value: e, label: e, color: (ESTADO_STYLE[e]?.color) ?? 'rgba(255,255,255,0.4)' })),
          ]} />

        {/* Filtro mes */}
        <CustomSelect value={mesFiltro} onChange={setMesFiltro} placeholder="Todos los meses"
          style={{ minWidth: 130 }}
          options={[{ value: 'todos', label: 'Todos los meses' }, ...mesesDisponibles.map(m => ({ value: m, label: formatMesLabel(m) }))]} />
      </div>

      {/* Conteo */}
      <div style={{ marginBottom: 14 }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
          {visible.length} {visible.length === 1 ? 'presupuesto' : 'presupuestos'}
          {mesFiltro !== 'todos' ? ` en ${formatMesLabel(mesFiltro)}` : ''}
          {busqueda ? ` · "${busqueda}"` : ''}
        </span>
      </div>

      <style>{`
        @keyframes kzRowIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer  { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes kzAcIn   { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes kzSpin   { to{transform:rotate(360deg)} }
      `}</style>

      {/* Lista */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ height: 72, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)', animation: 'shimmer 1.8s ease-in-out infinite' }} />
            </div>
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>
          {busqueda ? `Sin resultados para "${busqueda}"` : `Sin presupuestos ${tab}`}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {visible.map((p, idx) => {
            const dias = daysSince(p.creado)
            const isExpanded = expanded === p.id
            const fecha = new Date(p.creado)
            const urgente = dias >= 7 && tab === 'activos'
            return (
              <div key={p.id} style={{
                background: isExpanded ? 'rgba(192,0,26,0.04)' : 'rgba(255,255,255,0.025)',
                border: `1px solid ${isExpanded ? 'rgba(192,0,26,0.28)' : urgente ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 13, overflow: 'hidden',
                transition: 'border-color 0.2s, background 0.2s',
                animation: `kzRowIn 0.35s ease ${idx * 40}ms both`,
                boxShadow: isExpanded ? '0 0 0 1px rgba(192,0,26,0.1) inset' : 'none',
              }}>
                {/* Barra urgencia */}
                {urgente && !isExpanded && (
                  <div style={{ height: 2, background: `linear-gradient(90deg, #EF4444, transparent)`, opacity: 0.6 }} />
                )}
                {isExpanded && (
                  <div style={{ height: 2, background: 'linear-gradient(90deg, #C0001A, #ff3352, transparent)' }} />
                )}

                {/* Fila principal */}
                <div style={{ padding: '13px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, cursor: 'pointer' }}
                  onClick={() => setExpanded(isExpanded ? null : p.id)}
                  onMouseEnter={e => { if (!isExpanded) { const el = e.currentTarget.parentElement!; el.style.borderColor = 'rgba(255,255,255,0.13)'; el.style.background = 'rgba(255,255,255,0.04)' } }}
                  onMouseLeave={e => { if (!isExpanded) { const el = e.currentTarget.parentElement!; el.style.borderColor = urgente ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.07)'; el.style.background = 'rgba(255,255,255,0.025)' } }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: 14, color: '#fff', margin: 0, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.proyecto}</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '3px 0 0' }}>
                      {p.cliente}{p.servicio ? ` · ${p.servicio}` : ''}
                      <span style={{ color: 'rgba(255,255,255,0.2)', marginLeft: 8 }}>· {MESES_LABEL[fecha.getMonth()]} {fecha.getFullYear()}</span>
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    {p.monto != null && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CurrencyDollar size={13} color="rgba(255,255,255,0.3)" />
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>USD {p.monto.toLocaleString('es-AR')}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: dias > 7 ? '#EF4444' : 'rgba(255,255,255,0.22)' }}>
                      <Clock size={12} /><span style={{ fontSize: 11 }}>{dias}d</span>
                    </div>
                    <EstadoPresupuestoPill item={p} onUpdate={handleEstadoUpdate} />
                    <button onClick={e => { e.stopPropagation(); setToDelete(p) }} title="Eliminar"
                      style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', flexShrink: 0, cursor: 'pointer' }}
                      onMouseEnter={e => { const b = e.currentTarget; b.style.background='rgba(192,0,26,0.1)'; b.style.color='#C0001A'; b.style.borderColor='rgba(192,0,26,0.25)' }}
                      onMouseLeave={e => { const b = e.currentTarget; b.style.background='rgba(255,255,255,0.03)'; b.style.color='rgba(255,255,255,0.25)'; b.style.borderColor='rgba(255,255,255,0.08)' }}
                    ><Trash size={13} /></button>
                    <CaretDown size={13} color="rgba(255,255,255,0.2)" style={{ transition: 'transform 0.25s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }} />
                  </div>
                </div>

                {/* Panel expandido */}
                <div style={{ maxHeight: isExpanded ? 180 : 0, overflow: 'hidden', transition: 'max-height 0.3s cubic-bezier(0.32,0.72,0,1)' }}>
                  <div style={{ margin: '0 18px 14px', padding: '14px 16px', background: 'rgba(192,0,26,0.05)', border: '1px solid rgba(192,0,26,0.15)', borderRadius: 10, display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div>
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 3px' }}>Creado</p>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{fecha.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                    {p.servicio && (
                      <div>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 3px' }}>Servicio</p>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{p.servicio}</p>
                      </div>
                    )}
                    {urgente && (
                      <div>
                        <p style={{ fontSize: 10, color: 'rgba(239,68,68,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 3px' }}>⚠ Sin respuesta</p>
                        <p style={{ fontSize: 13, color: '#EF4444', margin: 0, fontWeight: 600 }}>{dias} días</p>
                      </div>
                    )}
                    {p.monto && (
                      <div>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 3px' }}>Monto</p>
                        <p style={{ fontSize: 16, color: '#fff', margin: 0, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>USD {p.monto.toLocaleString('es-AR')}</p>
                      </div>
                    )}
                    {/* Botón generar PDF */}
                    <div style={{ marginLeft: 'auto' }}>
                      <BotonPDF id={p.id} cliente={p.cliente} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
