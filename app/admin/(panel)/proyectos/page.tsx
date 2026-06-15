'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Trash, Warning, FolderOpen, Archive, CurrencyDollar, MagnifyingGlass, CaretUpDown, CaretDown } from '@phosphor-icons/react'
import { useLiveRefresh } from '@/lib/useLiveRefresh'
import { createPortal } from 'react-dom'
import CustomSelect from '@/app/admin/components/CustomSelect'

type Proyecto = { id: string; nombre: string; cliente: string; estado: string; monto?: number | null; servicio?: string; creado?: string }

const ESTADOS_PROYECTO = ['En desarrollo', 'Activo', 'En curso', 'Pausado', 'Cerrado']

const ESTADO_COLOR: Record<string, { color: string; bg: string }> = {
  'Activo':        { color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  'En desarrollo': { color: '#6366F1', bg: 'rgba(99,102,241,0.12)' },
  'En curso':      { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  'Cerrado':       { color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.06)' },
  'Pausado':       { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
}

function EstadoPill({ proyecto, onUpdate }: { proyecto: Proyecto; onUpdate: (id: string, estado: string) => void }) {
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

  async function cambiarEstado(nuevoEstado: string) {
    setOpen(false)
    if (nuevoEstado === proyecto.estado) return
    setSaving(true)
    try {
      await fetch('/api/admin/proyectos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: proyecto.id, estado: nuevoEstado }),
      })
      onUpdate(proyecto.id, nuevoEstado)
    } catch {}
    setSaving(false)
  }

  const es = ESTADO_COLOR[proyecto.estado] ?? { color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.06)' }

  return (
    <>
      <button ref={ref} onClick={openMenu} disabled={saving}
        style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: saving ? 'rgba(255,255,255,0.3)' : es.color, background: es.bg, border: `1px solid ${es.color}30`, borderRadius: 6, padding: '4px 8px 4px 9px', whiteSpace: 'nowrap', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.8' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
      >
        {saving ? '...' : proyecto.estado || '—'}
        {!saving && <CaretUpDown size={10} style={{ opacity: 0.6 }} />}
      </button>

      {open && typeof document !== 'undefined' && createPortal(
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={() => setOpen(false)} />
          <div style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 999, background: '#161616', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.7)', minWidth: 160, animation: 'kzAcIn 0.15s ease' }}>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '8px 12px 4px', margin: 0 }}>Estado</p>
            {ESTADOS_PROYECTO.map(e => {
              const c = ESTADO_COLOR[e] ?? { color: 'rgba(255,255,255,0.5)', bg: 'transparent' }
              const activo = e === proyecto.estado
              return (
                <button key={e} onClick={() => cambiarEstado(e)}
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

const MESES_LABEL = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

function ConfirmModal({ nombre, onConfirm, onCancel, loading }: {
  nombre: string; onConfirm: () => void; onCancel: () => void; loading: boolean
}) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
      animation: 'kzFadeIn 0.15s ease',
    }}>
      <style>{`@keyframes kzFadeIn{from{opacity:0}to{opacity:1}} @keyframes kzSlideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}} @keyframes kzSpin{to{transform:rotate(360deg)}}`}</style>
      <div style={{
        background: '#141414', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 18, width: 420, maxWidth: '90vw', overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset',
        animation: 'kzSlideUp 0.2s cubic-bezier(0.32,0.72,0,1)',
      }}>
        <div style={{ height: 3, background: 'linear-gradient(90deg, #C0001A, #ff3352)' }} />
        <div style={{ padding: '28px 28px 24px' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(192,0,26,0.1)', border: '1px solid rgba(192,0,26,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Warning size={24} color="#C0001A" weight="fill" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', margin: '0 0 8px', fontFamily: 'inherit' }}>¿Eliminar este proyecto?</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: '0 0 10px', lineHeight: 1.5 }}>Estás por eliminar permanentemente:</p>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
            <p style={{ fontSize: 14, color: '#fff', fontWeight: 500, margin: 0 }}>{nombre}</p>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', margin: '0 0 24px', lineHeight: 1.5 }}>Esta acción archiva el registro en Notion. No se puede deshacer desde el panel.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onCancel} disabled={loading} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 500, fontFamily: 'inherit', transition: 'all 0.15s' }}>Cancelar</button>
            <button onClick={onConfirm} disabled={loading} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: 'none', background: loading ? 'rgba(192,0,26,0.5)' : '#C0001A', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? <><div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'kzSpin 0.6s linear infinite' }} />Eliminando...</> : <><Trash size={15} />Sí, eliminar</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProyectosPage() {
  const [tab,      setTab]      = useState<'activos' | 'cerrados'>('activos')
  const [all,      setAll]      = useState<Proyecto[]>([])
  const [loading,  setLoading]  = useState(true)
  const [toDelete, setToDelete] = useState<Proyecto | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleted,  setDeleted]  = useState<string[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [mesFiltro, setMesFiltro] = useState<string>('todos')
  const [estadoFiltro, setEstadoFiltro] = useState<string>('todos')
  const [expanded, setExpanded] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/proyectos')
      .then(r => r.json())
      .then(d => { setAll(d.proyectos ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function handleEstadoUpdate(id: string, nuevoEstado: string) {
    setAll(prev => prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p))
    window.dispatchEvent(new Event('kz:refresh'))
  }

  useEffect(() => { load() }, [load])
  useLiveRefresh(load)

  // Años/meses disponibles en los datos
  const mesesDisponibles = useMemo(() => {
    const set = new Set<string>()
    all.forEach(p => {
      if (p.creado) {
        const d = new Date(p.creado)
        set.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}`)
      }
    })
    return Array.from(set).sort().reverse()
  }, [all])

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

  // Estados presentes en los datos del tab actual
  const estadosDisponibles = useMemo(() => {
    const set = new Set<string>()
    all.filter(p => !deleted.includes(p.id))
      .filter(p => tab === 'cerrados' ? p.estado === 'Cerrado' : p.estado !== 'Cerrado')
      .forEach(p => { if (p.estado) set.add(p.estado) })
    return Array.from(set).sort()
  }, [all, deleted, tab])

  const visible = useMemo(() => all
    .filter(p => !deleted.includes(p.id))
    .filter(p => tab === 'cerrados' ? p.estado === 'Cerrado' : p.estado !== 'Cerrado')
    .filter(p => estadoFiltro === 'todos' || p.estado === estadoFiltro)
    .filter(p => {
      if (mesFiltro === 'todos') return true
      if (!p.creado) return false
      const d = new Date(p.creado)
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}` === mesFiltro
    })
    .filter(p => !busqueda || p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.cliente.toLowerCase().includes(busqueda.toLowerCase()))
  , [all, deleted, tab, estadoFiltro, mesFiltro, busqueda])

  // Reset filtro de estado si el estado seleccionado ya no existe en el tab
  useEffect(() => {
    if (estadoFiltro !== 'todos' && !estadosDisponibles.includes(estadoFiltro)) setEstadoFiltro('todos')
  }, [estadosDisponibles, estadoFiltro])

  const totalActivos  = all.filter(p => !deleted.includes(p.id) && p.estado !== 'Cerrado').length
  const totalCerrados = all.filter(p => !deleted.includes(p.id) && p.estado === 'Cerrado').length

  function formatMesLabel(key: string) {
    const [year, month] = key.split('-')
    return `${MESES_LABEL[parseInt(month)-1]} ${year}`
  }

  return (
    <div style={{ padding: '40px 40px', maxWidth: 860 }}>

      {toDelete && <ConfirmModal nombre={toDelete.nombre} onConfirm={handleDelete} onCancel={() => setToDelete(null)} loading={deleting} />}

      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <div>
          <p style={{ fontSize: 11, color: '#C0001A', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6, opacity: 0.7 }}>Gestión</p>
          <h1 style={{ fontSize: 28, fontWeight: 400, color: '#fff', margin: 0, lineHeight: 1.1 }}>
            <span style={{ fontFamily: 'var(--font-serif-var), Cormorant Garamond, serif', fontWeight: 600, fontStyle: 'italic' }}>Pro</span>
            <span style={{ fontFamily: 'var(--font-body-var), Space Grotesk, sans-serif', fontWeight: 300, letterSpacing: '-0.01em', color: 'rgba(255,255,255,0.7)' }}>yectos</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10 }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#10B981', margin: 0, lineHeight: 1 }}>{totalActivos}</p>
            <p style={{ fontSize: 10, color: 'rgba(16,185,129,0.6)', margin: '4px 0 0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Activos</p>
          </div>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10 }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1 }}>{totalCerrados}</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', margin: '4px 0 0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Cerrados</p>
          </div>
        </div>
      </div>

      {/* Controles: tabs + búsqueda + mes */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 4 }}>
          {([['activos', 'Activos', FolderOpen], ['cerrados', 'Cerrados', Archive]] as const).map(([key, lbl, Icon]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 7, border: 'none', fontFamily: 'inherit',
              fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
              background: tab === key ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: tab === key ? '#fff' : 'rgba(255,255,255,0.35)',
              boxShadow: tab === key ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
            }}>
              <Icon size={14} />{lbl}
            </button>
          ))}
        </div>

        {/* Búsqueda */}
        <div style={{ position: 'relative', flex: 1, minWidth: 160 }}>
          <MagnifyingGlass size={14} color="rgba(255,255,255,0.25)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar proyecto o cliente..."
            style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 8, padding: '9px 14px 9px 34px', color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
        </div>

        {/* Filtro estado */}
        <CustomSelect value={estadoFiltro} onChange={setEstadoFiltro} placeholder="Todos los estados"
          style={{ minWidth: 150 }}
          options={[
            { value: 'todos', label: 'Todos los estados' },
            ...estadosDisponibles.map(e => ({ value: e, label: e, color: (ESTADO_COLOR[e]?.color) ?? 'rgba(255,255,255,0.4)' })),
          ]}
        />

        {/* Filtro mes */}
        <CustomSelect value={mesFiltro} onChange={setMesFiltro} placeholder="Todos los meses"
          style={{ minWidth: 130 }}
          options={[{ value: 'todos', label: 'Todos los meses' }, ...mesesDisponibles.map(m => ({ value: m, label: formatMesLabel(m) }))]}
        />
      </div>

      {/* Conteo visible */}
      <div style={{ marginBottom: 14 }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
          {visible.length} {visible.length === 1 ? 'proyecto' : 'proyectos'}
          {mesFiltro !== 'todos' ? ` en ${formatMesLabel(mesFiltro)}` : ''}
          {busqueda ? ` · "${busqueda}"` : ''}
        </span>
      </div>

      <style>{`@keyframes kzRowIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes kzAcIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Lista */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ height: 64, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)', animation: 'shimmer 1.8s ease-in-out infinite' }} />
            </div>
          ))}
          <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
        </div>
      ) : visible.length === 0 ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>
          {busqueda ? `Sin resultados para "${busqueda}"` : `Sin proyectos ${tab}`}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {visible.map((p, idx) => {
            const fecha = p.creado ? new Date(p.creado) : null
            const isExpanded = expanded === p.id
            const es = ESTADO_COLOR[p.estado] ?? { color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.06)' }
            return (
              <div key={p.id} style={{
                background: isExpanded ? 'rgba(192,0,26,0.04)' : 'rgba(255,255,255,0.025)',
                border: `1px solid ${isExpanded ? 'rgba(192,0,26,0.28)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 13, overflow: 'hidden',
                transition: 'border-color 0.2s, background 0.2s',
                animation: `kzRowIn 0.35s ease ${idx * 40}ms both`,
                boxShadow: isExpanded ? '0 0 0 1px rgba(192,0,26,0.1) inset' : 'none',
              }}>
                {isExpanded && (
                  <div style={{ height: 2, background: 'linear-gradient(90deg, #C0001A, #ff3352, transparent)' }} />
                )}

                {/* Fila principal */}
                <div style={{ padding: '13px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, cursor: 'pointer' }}
                  onClick={() => setExpanded(isExpanded ? null : p.id)}
                  onMouseEnter={e => { if (!isExpanded) { const el = e.currentTarget.parentElement!; el.style.borderColor = 'rgba(255,255,255,0.14)'; el.style.background = 'rgba(255,255,255,0.04)' } }}
                  onMouseLeave={e => { if (!isExpanded) { const el = e.currentTarget.parentElement!; el.style.borderColor = 'rgba(255,255,255,0.07)'; el.style.background = 'rgba(255,255,255,0.025)' } }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: 14, color: '#fff', margin: 0, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nombre}</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '3px 0 0' }}>
                      {p.cliente}{p.servicio ? ` · ${p.servicio}` : ''}
                      {fecha ? <span style={{ color: 'rgba(255,255,255,0.2)', marginLeft: 8 }}>· {MESES_LABEL[fecha.getMonth()]} {fecha.getFullYear()}</span> : null}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    {p.monto != null && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CurrencyDollar size={13} color="rgba(255,255,255,0.3)" />
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>USD {p.monto.toLocaleString('es-AR')}</span>
                      </div>
                    )}
                    <EstadoPill proyecto={p} onUpdate={handleEstadoUpdate} />
                    <button onClick={e => { e.stopPropagation(); setToDelete(p) }} title="Eliminar"
                      style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', flexShrink: 0, cursor: 'pointer' }}
                      onMouseEnter={e => { const b = e.currentTarget; b.style.background='rgba(192,0,26,0.1)'; b.style.color='#C0001A'; b.style.borderColor='rgba(192,0,26,0.25)' }}
                      onMouseLeave={e => { const b = e.currentTarget; b.style.background='rgba(255,255,255,0.03)'; b.style.color='rgba(255,255,255,0.25)'; b.style.borderColor='rgba(255,255,255,0.08)' }}
                    ><Trash size={13} /></button>
                    <CaretDown size={13} color="rgba(255,255,255,0.2)" style={{ transition: 'transform 0.25s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }} />
                  </div>
                </div>

                {/* Panel expandido */}
                <div style={{ maxHeight: isExpanded ? 130 : 0, overflow: 'hidden', transition: 'max-height 0.3s cubic-bezier(0.32,0.72,0,1)' }}>
                  <div style={{ margin: '0 18px 14px', padding: '14px 16px', background: 'rgba(192,0,26,0.05)', border: '1px solid rgba(192,0,26,0.15)', borderRadius: 10, display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    {fecha && (
                      <div>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 3px' }}>Ingreso</p>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{fecha.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      </div>
                    )}
                    {p.servicio && (
                      <div>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 3px' }}>Servicio</p>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{p.servicio}</p>
                      </div>
                    )}
                    <div>
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 3px' }}>Estado</p>
                      <span style={{ fontSize: 12, color: es.color, background: es.bg, border: `1px solid ${es.color}40`, borderRadius: 5, padding: '3px 9px' }}>{p.estado || '—'}</span>
                    </div>
                    {p.monto != null && (
                      <div style={{ marginLeft: 'auto' }}>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 3px' }}>Monto</p>
                        <p style={{ fontSize: 18, color: '#fff', margin: 0, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>USD {p.monto.toLocaleString('es-AR')}</p>
                      </div>
                    )}
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
