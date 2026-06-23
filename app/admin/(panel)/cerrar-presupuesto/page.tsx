'use client'

import { useState, useEffect, useCallback, FormEvent } from 'react'
import { useLiveRefresh } from '@/lib/useLiveRefresh'
import { CheckCircle, Warning } from '@phosphor-icons/react'
import CustomSelect from '@/app/admin/components/CustomSelect'
import PdfDropZone from '@/app/admin/components/PdfDropZone'

type Presupuesto = {
  id: string; proyecto: string; cliente: string
  estado: string; monto: number | null; servicio: string
}

const ESTADOS_CIERRE = ['Aprobado', 'Cerrado', 'Rechazado']

const field = { display: 'flex' as const, flexDirection: 'column' as const, gap: 6 }
const lbl = { fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }
const inp = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none',
  width: '100%', boxSizing: 'border-box' as const, fontFamily: 'inherit',
}

export default function CerrarPresupuestoPage() {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([])
  const [loadingP, setLoadingP] = useState(true)
  const [presupuestoId, setPresupuestoId] = useState('')
  const [estado, setEstado] = useState('Aprobado')
  const [montoFinal, setMontoFinal] = useState('')
  const [notas, setNotas] = useState('')
  const [crearProyecto, setCrearProyecto] = useState(true)
  const [archivo, setArchivo] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const loadPresupuestos = useCallback(() => {
    fetch('/api/admin/presupuestos')
      .then(r => r.json())
      .then(d => { setPresupuestos(d.presupuestos ?? []); setLoadingP(false) })
      .catch(() => setLoadingP(false))
  }, [])
  useEffect(() => { loadPresupuestos() }, [loadPresupuestos])
  useLiveRefresh(loadPresupuestos)

  const seleccionado = presupuestos.find(p => p.id === presupuestoId)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!presupuestoId) return
    setLoading(true); setError('')

    const fd = new FormData()
    fd.append('presupuestoId', presupuestoId)
    fd.append('estado', estado)
    fd.append('crearProyecto', String(crearProyecto))
    if (montoFinal) fd.append('montoFinal', montoFinal)
    if (notas) fd.append('notas', notas)
    if (archivo) fd.append('archivo', archivo)

    const res = await fetch('/api/admin/cerrar-presupuesto', { method: 'POST', body: fd })
    if (res.ok) { setSuccess(true) }
    else { const d = await res.json(); setError(d.error ?? 'Error') }
    setLoading(false)
  }

  function reset() {
    setSuccess(false); setPresupuestoId(''); setEstado('Aprobado')
    setMontoFinal(''); setNotas(''); setArchivo(null); setCrearProyecto(true)
  }

  if (success) return (
    <div style={{ padding: '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, textAlign: 'center' }}>
      <style>{`
        @keyframes kzSuccessIn { from{opacity:0;transform:translateY(24px) scale(0.94)}to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes kzRingPop   { 0%{transform:scale(0.7);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1} }
        @keyframes kzCheckIn   { 0%{stroke-dashoffset:60}100%{stroke-dashoffset:0} }
        @keyframes kzLineGrow  { from{width:0;opacity:0}to{width:80px;opacity:1} }
      `}</style>
      <div style={{ animation: 'kzSuccessIn 0.5s cubic-bezier(0.32,0.72,0,1) both', display:'flex', flexDirection:'column', alignItems:'center', gap:0, width:'100%', maxWidth:420 }}>
        {/* Icon with rings */}
        <div style={{ position:'relative', width:96, height:96, marginBottom:28 }}>
          {/* outer ring */}
          <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'1px solid rgba(16,185,129,0.15)', animation:'kzRingPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s both' }} />
          {/* middle ring */}
          <div style={{ position:'absolute', inset:10, borderRadius:'50%', border:'1px solid rgba(16,185,129,0.25)', animation:'kzRingPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both' }} />
          {/* inner circle */}
          <div style={{ position:'absolute', inset:20, borderRadius:'50%', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.4)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 28px rgba(16,185,129,0.2)', animation:'kzRingPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.3s both' }}>
            <CheckCircle size={28} color="#10B981" weight="bold" />
          </div>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: 26, fontFamily: 'var(--font-serif-var), Cormorant Garamond, serif', fontWeight: 600, color: '#fff', margin: '0 0 10px', letterSpacing:'-0.01em' }}>
          Presupuesto cerrado
        </h2>

        {/* Divider line */}
        <div style={{ width:80, height:1, background:'linear-gradient(90deg,transparent,rgba(16,185,129,0.4),transparent)', margin:'0 auto 18px', animation:'kzLineGrow 0.6s ease 0.4s both' }} />

        {/* Detail card */}
        <div style={{ background:'rgba(16,185,129,0.04)', border:'1px solid rgba(16,185,129,0.12)', borderRadius:14, padding:'16px 24px', marginBottom:24, width:'100%' }}>
          <p style={{ fontSize:15, color:'#fff', margin:'0 0 6px', fontWeight:600 }}>{seleccionado?.proyecto ?? 'Presupuesto'}</p>
          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.35)' }}>✓ Actualizado en Notion</span>
            {crearProyecto && <span style={{ fontSize:12, color:'rgba(16,185,129,0.7)' }}>✓ Proyecto creado</span>}
            {archivo && <span style={{ fontSize:12, color:'rgba(255,255,255,0.35)' }}>✓ PDF adjuntado</span>}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={reset} style={{ padding:'10px 22px', borderRadius:10, background:'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(16,185,129,0.06))', border:'1px solid rgba(16,185,129,0.25)', color:'#10B981', fontSize:13, fontWeight:600, fontFamily:'inherit', cursor:'pointer', transition:'all 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background='rgba(16,185,129,0.2)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background='linear-gradient(135deg,rgba(16,185,129,0.15),rgba(16,185,129,0.06))'}
          >
            Cerrar otro
          </button>
          <a href="/admin/proyectos" style={{ padding:'10px 22px', borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', fontSize:13, fontWeight:500, fontFamily:'inherit', cursor:'pointer', textDecoration:'none', display:'flex', alignItems:'center', transition:'all 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.8)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.5)'}
          >
            Ver proyectos →
          </a>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ padding: '40px 40px', maxWidth: 640, animation: 'kzFadeUp 0.4s ease both' }}>
      <style>{`@keyframes kzFadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>Gestión</p>
        <h1 style={{ fontSize: 28, fontWeight: 400, color: '#fff', margin: 0, lineHeight: 1.1 }}>
          <span style={{ fontFamily: 'var(--font-serif-var), Cormorant Garamond, serif', fontWeight: 600, fontStyle: 'italic' }}>Cerrar </span>
          <span style={{ fontFamily: 'var(--font-body-var), Space Grotesk, sans-serif', fontWeight: 300, letterSpacing: '-0.01em', color: 'rgba(255,255,255,0.7)' }}>presupuesto</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Selector de presupuesto */}
        <div style={field}>
          <label style={lbl}>Presupuesto *</label>
          {loadingP ? (
            <div style={{ ...inp, color: 'rgba(255,255,255,0.2)' }}>Cargando...</div>
          ) : (
            <CustomSelect
              value={presupuestoId}
              onChange={v => {
                setPresupuestoId(v)
                const p = presupuestos.find(x => x.id === v)
                if (p?.monto) setMontoFinal(String(p.monto))
              }}
              placeholder="Seleccioná un presupuesto"
              required
              options={[
                { value: '', label: 'Seleccioná un presupuesto' },
                ...presupuestos.map(p => ({ value: p.id, label: p.proyecto, sublabel: p.cliente || undefined })),
              ]}
            />
          )}
        </div>

        {/* Info del seleccionado */}
        {seleccionado && (
          <div style={{ background: 'rgba(192,0,26,0.08)', border: '1px solid rgba(192,0,26,0.2)', borderRadius: 8, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C0001A', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 13, color: '#fff', margin: 0, fontWeight: 500 }}>{seleccionado.proyecto}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                {seleccionado.cliente}{seleccionado.servicio ? ` · ${seleccionado.servicio}` : ''} · {seleccionado.estado}
              </p>
            </div>
          </div>
        )}

        {/* Estado de cierre */}
        <div style={field}>
          <label style={lbl}>Estado final</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {ESTADOS_CIERRE.map(e => (
              <button key={e} type="button" onClick={() => setEstado(e)} style={{
                padding: '7px 16px', borderRadius: 6, fontSize: 12, fontFamily: 'inherit',
                border: estado === e ? '1px solid rgba(192,0,26,0.5)' : '1px solid rgba(255,255,255,0.09)',
                background: estado === e ? 'rgba(192,0,26,0.12)' : 'rgba(255,255,255,0.03)',
                color: estado === e ? '#fff' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.15s',
              }}>{e}</button>
            ))}
          </div>
        </div>

        {/* Monto */}
        <div style={field}>
          <label style={lbl}>Monto final (USD)</label>
          <input type="number" value={montoFinal} onChange={e => setMontoFinal(e.target.value)} placeholder="0" min="0" step="0.01" style={inp} />
        </div>

        {/* Zona de upload PDF */}
        <div style={field}>
          <label style={lbl}>Adjuntar contrato PDF firmado</label>
          <PdfDropZone archivo={archivo} onFile={setArchivo} />
        </div>

        {/* Notas */}
        <div style={field}>
          <label style={lbl}>Notas</label>
          <textarea value={notas} onChange={e => setNotas(e.target.value)} placeholder="Observaciones, condiciones, acuerdos..." rows={3} style={{ ...inp, resize: 'none' }} />
        </div>

        {/* Crear proyecto */}
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}>
          <input type="checkbox" checked={crearProyecto} onChange={e => setCrearProyecto(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#C0001A' }} />
          <div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: 0 }}>Crear proyecto automáticamente</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>Genera una entrada en la base de proyectos con los datos del presupuesto</p>
          </div>
        </label>

        {error && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8 }}>
            <Warning size={15} color="#EF4444" />
            <p style={{ fontSize: 13, color: '#EF4444', margin: 0 }}>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !presupuestoId}
          style={{
            marginTop: 4,
            background: presupuestoId ? '#C0001A' : 'rgba(255,255,255,0.06)',
            color: presupuestoId ? '#fff' : 'rgba(255,255,255,0.25)',
            border: 'none', borderRadius: 8, padding: '13px 20px',
            fontSize: 14, fontWeight: 500, letterSpacing: '0.02em',
            opacity: loading ? 0.6 : 1, fontFamily: 'inherit', transition: 'all 0.2s',
          }}
        >
          {loading ? 'Cerrando...' : 'Cerrar presupuesto'}
        </button>
      </form>
    </div>
  )
}
