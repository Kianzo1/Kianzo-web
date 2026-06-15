'use client'

import { useState, FormEvent, useRef, DragEvent } from 'react'
import { CheckCircle, Warning, FilePdf, UploadSimple, X } from '@phosphor-icons/react'
import CustomSelect from '@/app/admin/components/CustomSelect'

const SERVICIOS = ['Landing Page', 'Web Institucional', 'E-commerce', 'App Móvil', 'Mantenimiento', 'Diseño', 'Otro']
const ESTADOS  = ['Borrador', 'Enviado', 'En negociacion', 'En revisión', 'Aprobado']

const field = { display: 'flex' as const, flexDirection: 'column' as const, gap: 6 }
const lbl   = { fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }
const inp   = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none',
  width: '100%', boxSizing: 'border-box' as const, fontFamily: 'inherit',
}

export default function NuevoPresupuestoPage() {
  const [proyecto, setProyecto]     = useState('')
  const [cliente, setCliente]       = useState('')
  const [descripcion, setDesc]      = useState('')
  const [servicio, setServicio]     = useState('')
  const [monto, setMonto]           = useState('')
  const [estado, setEstado]         = useState('Borrador')
  const [archivo, setArchivo]       = useState<File | null>(null)
  const [dragging, setDragging]     = useState(false)
  const [loading, setLoading]       = useState(false)
  const [success, setSuccess]       = useState(false)
  const [error, setError]           = useState('')
  const fileInputRef                = useRef<HTMLInputElement>(null)

  function handleDragOver(e: DragEvent) { e.preventDefault(); setDragging(true) }
  function handleDragLeave() { setDragging(false) }
  function handleDrop(e: DragEvent) {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f && (f.type === 'application/pdf' || f.name.endsWith('.pdf'))) setArchivo(f)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const fd = new FormData()
    fd.append('proyecto', proyecto)
    fd.append('cliente', cliente)
    fd.append('descripcion', descripcion)
    fd.append('servicio', servicio)
    fd.append('monto', monto)
    fd.append('estado', estado)
    if (archivo) fd.append('archivo', archivo)
    const res = await fetch('/api/admin/nuevo-presupuesto', { method: 'POST', body: fd })
    if (res.ok) { setSuccess(true) }
    else { const d = await res.json(); setError(d.error ?? 'Error al crear') }
    setLoading(false)
  }

  function reset() {
    setSuccess(false); setProyecto(''); setCliente(''); setDesc('')
    setServicio(''); setMonto(''); setEstado('Borrador'); setArchivo(null)
  }

  if (success) return (
    <div style={{ padding: '80px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center', animation: 'kzFadeUp 0.4s ease both' }}>
      <style>{`@keyframes kzFadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(16,185,129,0.15)' }}>
        <CheckCircle size={32} color="#10B981" weight="fill" />
      </div>
      <h2 style={{ fontSize: 24, fontFamily: 'var(--font-serif-var), Cormorant Garamond, serif', fontWeight: 600, color: '#fff', margin: 0 }}>Presupuesto creado</h2>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0 }}>"{proyecto}" fue agregado a Notion</p>
      <button onClick={reset} style={{ marginTop: 8, fontSize: 13, color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontFamily: 'inherit' }}>Crear otro</button>
    </div>
  )

  return (
    <div style={{ padding: '40px 40px', maxWidth: 640 }}>
      <style>{`@keyframes kzFadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ marginBottom: 32, animation: 'kzFadeUp 0.4s ease both' }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>Gestión</p>
        <h1 style={{ fontSize: 28, fontWeight: 400, color: '#fff', margin: 0, lineHeight: 1.1 }}>
          <span style={{ fontFamily: 'var(--font-serif-var), Cormorant Garamond, serif', fontWeight: 600, fontStyle: 'italic' }}>Nuevo </span>
          <span style={{ fontFamily: 'var(--font-body-var), Space Grotesk, sans-serif', fontWeight: 300, letterSpacing: '-0.01em', color: 'rgba(255,255,255,0.7)' }}>presupuesto</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'kzFadeUp 0.45s ease 0.05s both' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={field}>
            <label style={lbl}>Nombre del proyecto *</label>
            <input value={proyecto} onChange={e => setProyecto(e.target.value)} required placeholder="Landing Page — Cliente" style={inp} />
          </div>
          <div style={field}>
            <label style={lbl}>Cliente *</label>
            <input value={cliente} onChange={e => setCliente(e.target.value)} required placeholder="Nombre completo" style={inp} />
          </div>
        </div>

        <div style={field}>
          <label style={lbl}>Descripción</label>
          <textarea value={descripcion} onChange={e => setDesc(e.target.value)} placeholder="Detalle del proyecto, requerimientos, notas..." rows={3} style={{ ...inp, resize: 'none' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={field}>
            <label style={lbl}>Servicio</label>
            <CustomSelect value={servicio} onChange={setServicio} placeholder="Sin especificar"
              options={[{ value: '', label: 'Sin especificar' }, ...SERVICIOS.map(s => ({ value: s, label: s }))]} />
          </div>
          <div style={field}>
            <label style={lbl}>Monto (USD)</label>
            <input type="number" value={monto} onChange={e => setMonto(e.target.value)} placeholder="0" min="0" step="0.01" style={inp} />
          </div>
        </div>

        <div style={field}>
          <label style={lbl}>Estado inicial</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
            {ESTADOS.map(e => (
              <button
                key={e} type="button"
                onClick={() => setEstado(e)}
                style={{
                  padding: '7px 14px', borderRadius: 6, fontSize: 12, fontFamily: 'inherit',
                  border: estado === e ? '1px solid rgba(192,0,26,0.5)' : '1px solid rgba(255,255,255,0.09)',
                  background: estado === e ? 'rgba(192,0,26,0.12)' : 'rgba(255,255,255,0.03)',
                  color: estado === e ? '#fff' : 'rgba(255,255,255,0.45)',
                  transition: 'all 0.15s',
                }}
              >{e}</button>
            ))}
          </div>
        </div>

        {/* PDF upload */}
        <div style={field}>
          <label style={lbl}>Adjuntar presupuesto PDF</label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !archivo && fileInputRef.current?.click()}
            style={{
              border: `1.5px dashed ${dragging ? '#C0001A' : archivo ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.12)'}`,
              borderRadius: 10, padding: '20px',
              display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 8,
              background: dragging ? 'rgba(192,0,26,0.06)' : archivo ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
              transition: 'all 0.2s', cursor: archivo ? 'default' : 'pointer',
            }}
          >
            {archivo ? (
              <>
                <FilePdf size={26} color="#10B981" />
                <p style={{ fontSize: 13, color: '#fff', margin: 0, fontWeight: 500 }}>{archivo.name}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>{(archivo.size / 1024).toFixed(0)} KB</p>
                <button type="button" onClick={ev => { ev.stopPropagation(); setArchivo(null) }}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  <X size={11} /> Quitar archivo
                </button>
              </>
            ) : (
              <>
                <UploadSimple size={24} color={dragging ? '#C0001A' : 'rgba(255,255,255,0.2)'} />
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                  {dragging ? 'Soltá el archivo aquí' : 'Arrastrá el PDF o hacé click para seleccionar'}
                </p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: 0 }}>Solo archivos PDF</p>
              </>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" onChange={e => { const f = e.target.files?.[0]; if (f) setArchivo(f) }} style={{ display: 'none' }} />
        </div>

        {error && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8 }}>
            <Warning size={15} color="#EF4444" />
            <p style={{ fontSize: 13, color: '#EF4444', margin: 0 }}>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 4, background: '#C0001A', color: '#fff', border: 'none',
            borderRadius: 8, padding: '13px 20px', fontSize: 14, fontWeight: 500,
            letterSpacing: '0.02em', opacity: loading ? 0.6 : 1, fontFamily: 'inherit',
            transition: 'background 0.2s',
          }}
        >
          {loading ? 'Creando...' : 'Crear presupuesto en Notion'}
        </button>
      </form>
    </div>
  )
}
