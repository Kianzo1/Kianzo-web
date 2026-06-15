'use client'

import { useState, useEffect, useCallback, FormEvent, Suspense, useRef } from 'react'
import { useLiveRefresh } from '@/lib/useLiveRefresh'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Warning, Trash, FolderOpen, Archive } from '@phosphor-icons/react'
import CustomSelect from '@/app/admin/components/CustomSelect'
import confetti from 'canvas-confetti'

type Proyecto = { id: string; nombre: string; cliente: string; estado: string; monto?: number | null; servicio?: string; creado?: string }

const SERVICIOS = ['Landing Page', 'Web Institucional', 'E-commerce', 'App Móvil', 'Mantenimiento', 'Diseño', 'Otro']

const ESTADO_COLOR: Record<string, { color: string; bg: string }> = {
  'Activo':   { color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  'En curso': { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  'Cerrado':  { color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.06)' },
  'Pausado':  { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
}

const field  = { display: 'flex' as const, flexDirection: 'column' as const, gap: 6 }
const label  = { fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }
const input  = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14,
  outline: 'none', width: '100%', boxSizing: 'border-box' as const, fontFamily: 'inherit',
}

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
      <style>{`
        @keyframes kzFadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes kzSlideUp { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
        @keyframes kzSpin    { to { transform:rotate(360deg) } }
      `}</style>
      <div style={{
        background: '#141414', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 18, width: 420, maxWidth: '90vw', overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset',
        animation: 'kzSlideUp 0.2s cubic-bezier(0.32,0.72,0,1)',
      }}>
        <div style={{ height: 3, background: 'linear-gradient(90deg, #C0001A, #ff3352)' }} />
        <div style={{ padding: '28px 28px 24px' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'rgba(192,0,26,0.1)', border: '1px solid rgba(192,0,26,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
          }}>
            <Warning size={24} color="#C0001A" weight="fill" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', margin: '0 0 8px', fontFamily: 'inherit' }}>
            ¿Eliminar este registro?
          </h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: '0 0 10px', lineHeight: 1.5 }}>
            Estás por eliminar permanentemente:
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, padding: '10px 14px', marginBottom: 16,
          }}>
            <p style={{ fontSize: 14, color: '#fff', fontWeight: 500, margin: 0 }}>{nombre}</p>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', margin: '0 0 24px', lineHeight: 1.5 }}>
            Esta acción archiva el registro en Notion. No se puede deshacer desde el panel.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={onCancel} disabled={loading}
              style={{
                flex: 1, padding: '11px 0', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)',
                fontSize: 14, fontWeight: 500, fontFamily: 'inherit', transition: 'all 0.15s',
              }}
            >Cancelar</button>
            <button
              onClick={onConfirm} disabled={loading}
              style={{
                flex: 1, padding: '11px 0', borderRadius: 10, border: 'none',
                background: loading ? 'rgba(192,0,26,0.5)' : '#C0001A',
                color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
                transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {loading
                ? <><div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'kzSpin 0.6s linear infinite' }} />Eliminando...</>
                : <><Trash size={15} />Sí, eliminar</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function toISO(d: Date) { return d.toISOString().slice(0, 10) }
function addDays(d: Date, n: number) { const r = new Date(d); r.setDate(r.getDate() + n); return r }
function fmtLabel(iso: string) {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
}

function FechaSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [showCustom, setShowCustom] = useState(false)
  const hoy = new Date()
  const OPCIONES = [
    { label: 'Hoy', value: toISO(hoy) },
    { label: 'Mañana', value: toISO(addDays(hoy, 1)) },
    { label: 'En 3 días', value: toISO(addDays(hoy, 3)) },
    { label: 'En 1 semana', value: toISO(addDays(hoy, 7)) },
    { label: 'Elegir fecha...', value: '__custom__' },
  ]
  const esPreset = OPCIONES.slice(0, 4).some(o => o.value === value)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Pills de opciones rápidas */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
        {OPCIONES.map(op => {
          const isCustom = op.value === '__custom__'
          const active = isCustom ? (!esPreset && value) || showCustom : value === op.value
          return (
            <button key={op.value} type="button"
              onClick={() => {
                if (isCustom) { setShowCustom(true); if (esPreset || !value) onChange(toISO(hoy)) }
                else { setShowCustom(false); onChange(op.value) }
              }}
              style={{
                padding: '7px 13px', borderRadius: 8, fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
                border: active ? '1px solid rgba(192,0,26,0.55)' : '1px solid rgba(255,255,255,0.09)',
                background: active ? 'rgba(192,0,26,0.12)' : 'rgba(255,255,255,0.03)',
                color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                transition: 'all 0.15s cubic-bezier(0.32,0.72,0,1)',
                fontWeight: active ? 500 : 400,
              }}
            >{op.label}</button>
          )
        })}
      </div>

      {/* Input de fecha custom */}
      {(!esPreset && value) || showCustom ? (
        <div style={{ position: 'relative' }}>
          <input type="date" value={value} onChange={e => onChange(e.target.value)}
            style={{
              background: 'rgba(192,0,26,0.06)', border: '1px solid rgba(192,0,26,0.28)',
              borderRadius: 8, padding: '9px 14px', color: '#fff', fontSize: 13,
              outline: 'none', width: '100%', boxSizing: 'border-box' as const,
              fontFamily: 'inherit', colorScheme: 'dark',
            }}
          />
          {value && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '4px 0 0' }}>{fmtLabel(value)}</p>}
        </div>
      ) : value && (
        <p style={{ fontSize: 12, color: 'rgba(192,0,26,0.8)', margin: 0, paddingLeft: 2 }}>
          {fmtLabel(value)}
        </p>
      )}
    </div>
  )
}

function CerrarForm() {
  const searchParams = useSearchParams()
  const idParam = searchParams.get('id') ?? ''

  // Form cerrar
  const [proyectos,    setProyectos]    = useState<Proyecto[]>([])
  const [proyectoId,   setProyectoId]   = useState(idParam)
  const [fechaEntrega, setFechaEntrega] = useState('')
  const [montoFinal,   setMontoFinal]   = useState('')
  const [servicio,     setServicio]     = useState('')
  const [notas,        setNotas]        = useState('')
  const [linkEntregado,setLinkEntregado]= useState('')
  const [cobroCompleto,setCobroCompleto]= useState(false)
  const [mantenimiento,setMantenimiento]= useState(false)
  const [mantenimientoUSD,setMantenimientoUSD] = useState('')
  const [loading,      setLoading]      = useState(false)
  const [success,      setSuccess]      = useState(false)
  const [error,        setError]        = useState('')
  const [loadingP,     setLoadingP]     = useState(true)
  const [errorP,       setErrorP]       = useState('')

  // Lista proyectos
  const [tab,          setTab]          = useState<'activos' | 'cerrados'>('activos')
  const [listaAll,     setListaAll]     = useState<Proyecto[]>([])
  const [loadingLista, setLoadingLista] = useState(true)
  const [toDelete,     setToDelete]     = useState<Proyecto | null>(null)
  const [deleting,     setDeleting]     = useState(false)
  const [deleted,      setDeleted]      = useState<string[]>([])

  function loadDropdown() {
    setLoadingP(true); setErrorP('')
    fetch('/api/admin/proyectos')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(d => {
        if (d.error) throw new Error(d.error)
        const activos = (d.proyectos ?? []).filter((p: Proyecto) => p.estado !== 'Cerrado')
        setProyectos(activos)
        if (activos.length === 0) setErrorP('No hay proyectos activos en Notion')
        setLoadingP(false)
      })
      .catch((e: Error) => { setErrorP(e.message); setLoadingP(false) })
  }

  const loadLista = useCallback(() => {
    setLoadingLista(true)
    fetch('/api/admin/proyectos')
      .then(r => r.json())
      .then(d => { setListaAll(d.proyectos ?? []); setLoadingLista(false) })
      .catch(() => setLoadingLista(false))
  }, [])

  useEffect(() => { loadDropdown(); loadLista() }, [loadLista])
  useLiveRefresh(loadLista)

  const seleccionado = proyectos.find(p => p.id === proyectoId)

  // Al seleccionar proyecto, pre-llenar monto con el valor original de Notion
  useEffect(() => {
    if (seleccionado?.monto != null) {
      setMontoFinal(String(seleccionado.monto))
    }
  }, [proyectoId])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!proyectoId) return
    setLoading(true); setError('')
    const res = await fetch('/api/admin/cerrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proyectoId, fechaEntrega, montoFinal, notas, servicio, linkEntregado, cobroCompleto, mantenimiento, mantenimientoUSD }),
    })
    if (res.ok) {
      const colors = ['#C0001A', '#ff3352', '#ff6680', '#ffffff', '#ffcc00']
      setSuccess(true)
      setTimeout(() => {
        confetti({ particleCount: 140, spread: 90, origin: { x: 0.5, y: 0.55 }, colors, zIndex: 9999 })
        setTimeout(() => confetti({ particleCount: 80, spread: 130, origin: { x: 0.5, y: 0.6 }, colors, zIndex: 9999 }), 350)
        setTimeout(() => confetti({ particleCount: 50, spread: 70, origin: { x: 0.3, y: 0.5 }, colors, zIndex: 9999 }), 600)
      }, 100)
    }
    else { const d = await res.json(); setError(d.error ?? 'Error') }
    setLoading(false)
  }

  function reset() {
    setSuccess(false); setProyectoId(''); setFechaEntrega(''); setMontoFinal('')
    setServicio(''); setNotas(''); setLinkEntregado(''); setCobroCompleto(false)
    setMantenimiento(false); setMantenimientoUSD('')
  }

  async function handleDelete() {
    if (!toDelete) return
    setDeleting(true)
    const res = await fetch('/api/admin/eliminar', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: toDelete.id }),
    })
    if (res.ok) { setDeleted(d => [...d, toDelete.id]); setToDelete(null) }
    setDeleting(false)
  }

  const listaVisible = listaAll
    .filter(p => !deleted.includes(p.id))
    .filter(p => tab === 'cerrados' ? p.estado === 'Cerrado' : p.estado !== 'Cerrado')

  if (success) return (
    <div style={{ padding: '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <style>{`
        @keyframes kzSuccessIn  { from{opacity:0;transform:translateY(24px) scale(0.94)}to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes kzRingPop    { 0%{transform:scale(0.7);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1} }
        @keyframes kzLineGrow   { from{width:0;opacity:0}to{width:80px;opacity:1} }
        @keyframes kzBadgePop   { 0%{transform:scale(0) rotate(-12deg);opacity:0}70%{transform:scale(1.1) rotate(3deg)}100%{transform:scale(1) rotate(0);opacity:1} }
      `}</style>
      <div style={{ animation: 'kzSuccessIn 0.5s cubic-bezier(0.32,0.72,0,1) both', display:'flex', flexDirection:'column', alignItems:'center', gap:0, width:'100%', maxWidth:420 }}>
        {/* Rings */}
        <div style={{ position:'relative', width:100, height:100, marginBottom:28 }}>
          <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'1px solid rgba(16,185,129,0.12)', animation:'kzRingPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.05s both' }} />
          <div style={{ position:'absolute', inset:10, borderRadius:'50%', border:'1px solid rgba(16,185,129,0.22)', animation:'kzRingPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.15s both' }} />
          <div style={{ position:'absolute', inset:20, borderRadius:'50%', background:'rgba(16,185,129,0.09)', border:'1px solid rgba(16,185,129,0.38)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 30px rgba(16,185,129,0.18)', animation:'kzRingPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.25s both' }}>
            <CheckCircle size={30} color="#10B981" weight="bold" />
          </div>
          {/* Badge */}
          <div style={{ position:'absolute', top:0, right:0, background:'linear-gradient(135deg,#C0001A,#8A0012)', borderRadius:20, padding:'3px 8px', fontSize:9, fontWeight:700, color:'#fff', letterSpacing:'0.1em', animation:'kzBadgePop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.5s both' }}>
            +MRKT
          </div>
        </div>

        <h2 style={{ fontSize:27, fontFamily:'var(--font-serif-var), Cormorant Garamond, serif', fontWeight:600, color:'#fff', margin:'0 0 10px', letterSpacing:'-0.01em' }}>
          Proyecto cerrado
        </h2>
        <div style={{ width:80, height:1, background:'linear-gradient(90deg,transparent,rgba(16,185,129,0.4),transparent)', margin:'0 auto 20px', animation:'kzLineGrow 0.6s ease 0.4s both' }} />

        <div style={{ background:'rgba(16,185,129,0.04)', border:'1px solid rgba(16,185,129,0.12)', borderRadius:14, padding:'16px 24px', marginBottom:24, width:'100%' }}>
          <p style={{ fontSize:15, color:'#fff', margin:'0 0 8px', fontWeight:600 }}>{seleccionado?.nombre}</p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.35)' }}>✓ Estado → Cerrado</span>
            {montoFinal && <span style={{ fontSize:12, color:'rgba(16,185,129,0.75)', fontWeight:600 }}>✓ ${montoFinal} registrados</span>}
            {mantenimiento && <span style={{ fontSize:12, color:'rgba(139,92,246,0.8)' }}>✓ Mantenimiento activo</span>}
          </div>
        </div>

        <div style={{ display:'flex', gap:10 }}>
          <button onClick={reset} style={{ padding:'10px 22px', borderRadius:10, background:'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(16,185,129,0.06))', border:'1px solid rgba(16,185,129,0.25)', color:'#10B981', fontSize:13, fontWeight:600, fontFamily:'inherit', cursor:'pointer', transition:'all 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background='rgba(16,185,129,0.2)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background='linear-gradient(135deg,rgba(16,185,129,0.15),rgba(16,185,129,0.06))'}
          >
            Cerrar otro
          </button>
          <a href="/admin/dashboard" style={{ padding:'10px 22px', borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', fontSize:13, fontWeight:500, fontFamily:'inherit', cursor:'pointer', textDecoration:'none', display:'flex', alignItems:'center', transition:'all 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.8)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.5)'}
          >
            Dashboard →
          </a>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ padding: '40px 40px', maxWidth: 800, animation: 'kzFadeUp 0.4s ease both' }}>
      <style>{`@keyframes kzFadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
      {toDelete && (
        <ConfirmModal
          nombre={toDelete.nombre}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
          loading={deleting}
        />
      )}

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>Gestión</p>
        <h1 style={{ fontSize: 28, fontWeight: 400, color: '#fff', margin: 0, lineHeight: 1.1 }}>
          <span style={{ fontFamily: 'var(--font-serif-var), Cormorant Garamond, serif', fontWeight: 600, fontStyle: 'italic' }}>Cerrar </span>
          <span style={{ fontFamily: 'var(--font-body-var), Space Grotesk, sans-serif', fontWeight: 300, letterSpacing: '-0.01em', color: 'rgba(255,255,255,0.7)' }}>proyecto</span>
        </h1>
      </div>

      {/* Formulario cerrar */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 48 }}>
        <div style={field}>
          <label style={label}>Proyecto *</label>
          {loadingP ? (
            <div style={{ ...input, color: 'rgba(255,255,255,0.2)' }}>Cargando proyectos...</div>
          ) : errorP ? (
            <div style={{ padding: '18px 20px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FolderOpen size={18} color="rgba(255,255,255,0.25)" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: '0 0 3px', fontWeight: 500 }}>
                  {errorP.includes('activos') ? 'Sin proyectos activos' : 'No se pudieron cargar los proyectos'}
                </p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', margin: 0 }}>
                  {errorP.includes('activos') ? 'Todos los proyectos están cerrados o aún no creaste ninguno.' : errorP}
                </p>
              </div>
              <button type="button" onClick={loadDropdown} style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, padding: '6px 12px', flexShrink: 0, fontFamily: 'inherit', cursor: 'pointer' }}>Reintentar</button>
            </div>
          ) : (
            <CustomSelect
              value={proyectoId}
              onChange={setProyectoId}
              placeholder="Seleccioná un proyecto"
              required
              options={[
                { value: '', label: 'Seleccioná un proyecto' },
                ...proyectos.map(p => ({ value: p.id, label: p.nombre, sublabel: p.cliente || undefined })),
              ]}
            />
          )}
        </div>

        {seleccionado && (
          <div style={{ background: 'rgba(192,0,26,0.07)', border: '1px solid rgba(192,0,26,0.22)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ height: 2, background: 'linear-gradient(90deg, #C0001A, #ff3352, transparent)' }} />
            <div style={{ padding: '14px 16px', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' as const }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, color: '#fff', margin: 0, fontWeight: 600 }}>{seleccionado.nombre}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>
                  {seleccionado.cliente}{seleccionado.servicio ? ` · ${seleccionado.servicio}` : ''}
                </p>
              </div>
              {seleccionado.monto != null ? (
                <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, margin: '0 0 2px' }}>Pactado originalmente</p>
                  <p style={{ fontSize: 20, color: '#fff', margin: 0, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                    USD {seleccionado.monto.toLocaleString('es-AR')}
                  </p>
                </div>
              ) : (
                <div style={{ flexShrink: 0 }}>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: 0, fontStyle: 'italic' }}>Sin monto registrado</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={field}>
            <label style={label}>Fecha de entrega</label>
            <FechaSelect value={fechaEntrega} onChange={setFechaEntrega} />
          </div>
          <div style={field}>
            <label style={label}>Monto final (USD)</label>
            <input type="number" value={montoFinal} onChange={e => setMontoFinal(e.target.value)} placeholder="0" min="0" step="0.01" style={input} />
            {seleccionado?.monto != null && montoFinal && (() => {
              const diff = parseFloat(montoFinal) - seleccionado.monto!
              if (diff === 0 || isNaN(diff)) return null
              const mas = diff > 0
              return (
                <p style={{ fontSize: 11, margin: '3px 0 0', color: mas ? '#10B981' : '#F59E0B' }}>
                  {mas ? '▲' : '▼'} {mas ? '+' : ''}USD {diff.toLocaleString('es-AR')} vs lo pactado
                </p>
              )
            })()}
          </div>
        </div>

        <div style={field}>
          <label style={label}>Servicio</label>
          <CustomSelect
            value={servicio}
            onChange={setServicio}
            placeholder="Sin cambios"
            options={[{ value: '', label: 'Sin cambios' }, ...SERVICIOS.map(s => ({ value: s, label: s }))]}
          />
        </div>

        <div style={field}>
          <label style={label}>Link del proyecto entregado</label>
          <input type="url" value={linkEntregado} onChange={e => setLinkEntregado(e.target.value)} placeholder="https://..." style={input} />
        </div>

        <div style={field}>
          <label style={label}>Notas de cierre</label>
          <textarea value={notas} onChange={e => setNotas(e.target.value)} placeholder="Entregables, contraseñas, observaciones finales..." rows={3} style={{ ...input, resize: 'none' }} />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}>
          <input type="checkbox" checked={cobroCompleto} onChange={e => setCobroCompleto(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#10B981' }} />
          <div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: 0 }}>Cobro completo recibido</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>El 100% del pago fue acreditado</p>
          </div>
        </label>

        {/* Mantenimiento */}
        <div style={{ background: mantenimiento ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${mantenimiento ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, transition: 'all 0.2s', overflow: 'hidden' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', cursor: 'pointer' }}>
            <input type="checkbox" checked={mantenimiento} onChange={e => setMantenimiento(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#8B5CF6' }} />
            <div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: 0 }}>Lleva mantenimiento mensual</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>Marcá si el cliente contrató mantenimiento recurrente</p>
            </div>
          </label>
          <div style={{ maxHeight: mantenimiento ? 90 : 0, overflow: 'hidden', transition: 'max-height 0.3s cubic-bezier(0.32,0.72,0,1)' }}>
            <div style={{ padding: '0 16px 14px 42px' }}>
              <label style={label}>Cuota mensual (USD)</label>
              <input type="number" value={mantenimientoUSD} onChange={e => setMantenimientoUSD(e.target.value)} placeholder="30" min="0" step="0.01" style={{ ...input, marginTop: 6 }} />
            </div>
          </div>
        </div>

        {error && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8 }}>
            <Warning size={15} color="#EF4444" />
            <p style={{ fontSize: 13, color: '#EF4444', margin: 0 }}>{error}</p>
          </div>
        )}

        <button
          type="submit" disabled={loading || !proyectoId}
          style={{
            marginTop: 4, borderRadius: 8, padding: '13px 20px', fontSize: 14, fontWeight: 500,
            letterSpacing: '0.02em', transition: 'all 0.2s', opacity: loading ? 0.6 : 1,
            fontFamily: 'inherit', border: 'none',
            background: proyectoId ? '#C0001A' : 'rgba(255,255,255,0.06)',
            color: proyectoId ? '#fff' : 'rgba(255,255,255,0.25)',
          }}
        >
          {loading ? 'Cerrando...' : 'Cerrar proyecto'}
        </button>
      </form>

      {/* Divisor */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)', marginBottom: 40 }} />

      {/* Lista de todos los proyectos */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.7)', margin: 0 }}>Todos los proyectos</h2>
          <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 4 }}>
            {([['activos', 'Activos', FolderOpen], ['cerrados', 'Cerrados', Archive]] as const).map(([key, lbl, Icon]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 16px', borderRadius: 7, border: 'none', fontFamily: 'inherit',
                  fontSize: 12, fontWeight: 500, transition: 'all 0.15s',
                  background: tab === key ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: tab === key ? '#fff' : 'rgba(255,255,255,0.35)',
                  boxShadow: tab === key ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
                }}
              >
                <Icon size={13} />
                {lbl}
              </button>
            ))}
          </div>
        </div>

        {loadingLista ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...Array(3)].map((_, i) => <div key={i} style={{ height: 60, background: 'rgba(255,255,255,0.03)', borderRadius: 10 }} />)}
          </div>
        ) : listaVisible.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>
            Sin proyectos {tab}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {listaVisible.map(p => {
              const es = ESTADO_COLOR[p.estado] ?? { color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.06)' }
              return (
                <div key={p.id} style={{
                  background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12, padding: '14px 18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: 14, color: '#fff', margin: 0, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nombre}</p>
                    {p.cliente && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '3px 0 0' }}>{p.cliente}{p.servicio ? ` · ${p.servicio}` : ''}</p>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    {p.monto != null && (
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                        USD {p.monto.toLocaleString('es-AR')}
                      </span>
                    )}
                    <span style={{
                      fontSize: 11, color: es.color, background: es.bg,
                      border: `1px solid ${es.color}30`, borderRadius: 5, padding: '3px 8px', whiteSpace: 'nowrap',
                    }}>{p.estado || '—'}</span>
                    <button
                      onClick={() => setToDelete(p)}
                      title="Eliminar"
                      style={{
                        width: 30, height: 30, borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', flexShrink: 0,
                      }}
                      onMouseEnter={e => { const b = e.currentTarget; b.style.background='rgba(192,0,26,0.1)'; b.style.color='#C0001A'; b.style.borderColor='rgba(192,0,26,0.25)' }}
                      onMouseLeave={e => { const b = e.currentTarget; b.style.background='rgba(255,255,255,0.03)'; b.style.color='rgba(255,255,255,0.25)'; b.style.borderColor='rgba(255,255,255,0.08)' }}
                    >
                      <Trash size={13} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CerrarProyectoPage() {
  return <Suspense><CerrarForm /></Suspense>
}
