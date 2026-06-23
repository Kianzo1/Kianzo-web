'use client'

import { useState, FormEvent, useCallback } from 'react'
import { CheckCircle, Warning, FilePdf, Spinner } from '@phosphor-icons/react'
import CustomSelect from '@/app/admin/components/CustomSelect'
import { field, lbl, inp } from '@/app/admin/components/FormStyles'

const SERVICIOS = ['Landing Page', 'Web Institucional', 'E-commerce', 'App Móvil', 'Mantenimiento', 'Diseño', 'Otro']
const ESTADOS = ['Borrador', 'Enviado', 'En negociacion', 'En revisión', 'Aprobado']
const PERIODICIDADES = ['Mensual', 'Trimestral', 'Anual']

const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }
const grid3: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }

function SecLabel({ children }: { children: string }) {
  return (
    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.14em', textTransform: 'uppercase', borderLeft: '2px solid #C0001A', paddingLeft: 10, margin: '8px 0 0' }}>
      {children}
    </p>
  )
}

export default function NuevoPresupuestoPage() {
  // ── Datos del cliente ──
  const [proyecto, setProyecto]   = useState('')
  const [cliente, setCliente]     = useState('')
  const [empresa, setEmpresa]     = useState('')
  const [telefono, setTelefono]   = useState('')
  const [email, setEmail]         = useState('')
  const [fechaEmision, setFechaEmision] = useState(new Date().toISOString().slice(0, 10))

  // ── Proyecto ──
  const [descripcion, setDesc]        = useState('')
  const [alcanceIncluye, setAIncluye] = useState('')
  const [alcanceNoIncluye, setANoInc] = useState('')

  // ── Servicio / Estado ──
  const [servicio, setServicio] = useState('')
  const [estado, setEstado]     = useState('Borrador')

  // ── Plazos ──
  const [fechaInicio, setFechaInicio]     = useState('')
  const [fechaEntrega, setFechaEntrega]   = useState('')
  const [duracion, setDuracion]           = useState('')

  // ── Inversión ──
  const [monto, setMonto]           = useState('')
  const [anticipo, setAnticipo]     = useState('')
  const [formaDePago, setFormaPago] = useState('50% de anticipo para iniciar el proyecto y 50% restante contra entrega final.')
  const [rondas, setRondas]         = useState('2')

  // ── Mantenimiento ──
  const [contrataMant, setContrataMant]   = useState(false)
  const [valorMant, setValorMant]         = useState('')
  const [periodicidad, setPeriodicidad]   = useState('Mensual')

  // ── UI ──
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [pageId, setPageId]     = useState('')
  const [error, setError]       = useState('')
  const [generando, setGenerando] = useState(false)

  const saldo = monto && anticipo
    ? Math.max(0, parseFloat(monto) - parseFloat(anticipo))
    : null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')

    const body = {
      proyecto, cliente, empresa, telefono, email, fechaEmision,
      descripcion, alcanceIncluye, alcanceNoIncluye,
      servicio, estado,
      fechaInicio, fechaEntrega, duracion,
      monto, anticipo,
      saldo: saldo != null ? String(saldo) : '',
      formaDePago, rondas,
      contrataMant, valorMant, periodicidad,
    }

    const res = await fetch('/api/admin/nuevo-presupuesto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      const d = await res.json()
      setPageId(d.id ?? '')
      setSuccess(true)
    } else {
      const d = await res.json()
      setError(d.error ?? 'Error al crear')
    }
    setLoading(false)
  }

  async function handleGenerarPDF() {
    if (!pageId) return
    setGenerando(true)
    const res = await fetch(`/api/admin/generar-pdf?id=${pageId}`)
    if (res.ok) {
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `propuesta-${cliente.replace(/\s+/g, '-').toLowerCase() || 'kianzo'}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    }
    setGenerando(false)
  }

  function reset() {
    setSuccess(false); setPageId('')
    setProyecto(''); setCliente(''); setEmpresa(''); setTelefono(''); setEmail('')
    setFechaEmision(new Date().toISOString().slice(0, 10))
    setDesc(''); setAIncluye(''); setANoInc('')
    setServicio(''); setEstado('Borrador')
    setFechaInicio(''); setFechaEntrega(''); setDuracion('')
    setMonto(''); setAnticipo('')
    setFormaPago('50% de anticipo para iniciar el proyecto y 50% restante contra entrega final.')
    setRondas('2')
    setContrataMant(false); setValorMant(''); setPeriodicidad('Mensual')
  }

  if (success) return (
    <div style={{ padding: '80px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center', animation: 'kzFadeUp 0.4s ease both' }}>
      <style>{`@keyframes kzFadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} @keyframes kzSpin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CheckCircle size={32} color="#10B981" weight="fill" />
      </div>
      <h2 style={{ fontSize: 24, fontFamily: 'var(--font-serif-var), Cormorant Garamond, serif', fontWeight: 600, color: '#fff', margin: 0 }}>Presupuesto creado</h2>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0 }}>"{proyecto}" fue guardado en Notion</p>

      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        {pageId && (
          <button
            onClick={handleGenerarPDF}
            disabled={generando}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 10, background: generando ? 'rgba(192,0,26,0.5)' : '#C0001A', border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: generando ? 'default' : 'pointer', transition: 'all 0.2s' }}
          >
            {generando
              ? <><Spinner size={16} style={{ animation: 'kzSpin 0.8s linear infinite' }} />Generando...</>
              : <><FilePdf size={16} weight="fill" />Generar PDF</>
            }
          </button>
        )}
        <button
          onClick={reset}
          style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '11px 22px', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Crear otro
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ padding: '40px 40px', maxWidth: 720 }}>
      <style>{`@keyframes kzFadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ marginBottom: 32, animation: 'kzFadeUp 0.4s ease both' }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>Gestión</p>
        <h1 style={{ fontSize: 28, fontWeight: 400, color: '#fff', margin: 0, lineHeight: 1.1 }}>
          <span style={{ fontFamily: 'var(--font-serif-var), Cormorant Garamond, serif', fontWeight: 600, fontStyle: 'italic' }}>Nuevo </span>
          <span style={{ fontFamily: 'var(--font-body-var), Space Grotesk, sans-serif', fontWeight: 300, letterSpacing: '-0.01em', color: 'rgba(255,255,255,0.7)' }}>presupuesto</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'kzFadeUp 0.45s ease 0.05s both' }}>

        {/* ── DATOS DEL CLIENTE ── */}
        <SecLabel>Datos del cliente</SecLabel>
        <div style={grid2}>
          <div style={field}><label style={lbl}>Nombre del proyecto *</label><input value={proyecto} onChange={e => setProyecto(e.target.value)} required placeholder="Landing Page — Cliente" style={inp} /></div>
          <div style={field}><label style={lbl}>Fecha de emisión</label><input type="date" value={fechaEmision} onChange={e => setFechaEmision(e.target.value)} style={inp} /></div>
        </div>
        <div style={grid2}>
          <div style={field}><label style={lbl}>Cliente *</label><input value={cliente} onChange={e => setCliente(e.target.value)} required placeholder="Nombre completo" style={inp} /></div>
          <div style={field}><label style={lbl}>Empresa</label><input value={empresa} onChange={e => setEmpresa(e.target.value)} placeholder="Nombre de la empresa" style={inp} /></div>
        </div>
        <div style={grid2}>
          <div style={field}><label style={lbl}>Teléfono</label><input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="+54 9 261 000 0000" style={inp} /></div>
          <div style={field}><label style={lbl}>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="cliente@email.com" style={inp} /></div>
        </div>

        {/* ── DESCRIPCIÓN ── */}
        <SecLabel>Proyecto</SecLabel>
        <div style={field}>
          <label style={lbl}>Descripción del proyecto</label>
          <textarea value={descripcion} onChange={e => setDesc(e.target.value)} placeholder="¿Qué se va a desarrollar? Detallá el proyecto, objetivos y requerimientos principales." rows={3} style={{ ...inp, resize: 'none' }} />
        </div>

        {/* ── SERVICIO ── */}
        <div style={grid2}>
          <div style={field}>
            <label style={lbl}>Servicio principal</label>
            <CustomSelect value={servicio} onChange={setServicio} placeholder="Sin especificar"
              options={[{ value: '', label: 'Sin especificar' }, ...SERVICIOS.map(s => ({ value: s, label: s }))]} />
          </div>
          <div style={field}>
            <label style={lbl}>Estado inicial</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {ESTADOS.map(e => (
                <button key={e} type="button" onClick={() => setEstado(e)} style={{ padding: '7px 12px', borderRadius: 6, fontSize: 11, fontFamily: 'inherit', border: estado === e ? '1px solid rgba(192,0,26,0.5)' : '1px solid rgba(255,255,255,0.09)', background: estado === e ? 'rgba(192,0,26,0.12)' : 'rgba(255,255,255,0.03)', color: estado === e ? '#fff' : 'rgba(255,255,255,0.45)', transition: 'all 0.15s' }}>{e}</button>
              ))}
            </div>
          </div>
        </div>

        {/* ── ALCANCE ── */}
        <SecLabel>Alcance del trabajo</SecLabel>
        <div style={grid2}>
          <div style={field}>
            <label style={lbl}>Incluye (uno por línea)</label>
            <textarea value={alcanceIncluye} onChange={e => setAIncluye(e.target.value)} placeholder={"Diseño personalizado\nDesarrollo responsive\nPanel de administración\nOptimización SEO básica"} rows={5} style={{ ...inp, resize: 'none' }} />
          </div>
          <div style={field}>
            <label style={lbl}>No incluye (uno por línea)</label>
            <textarea value={alcanceNoIncluye} onChange={e => setANoInc(e.target.value)} placeholder={"Campañas publicitarias\nRedacción de contenidos\nIntegraciones no especificadas"} rows={5} style={{ ...inp, resize: 'none' }} />
          </div>
        </div>

        {/* ── PLAZOS ── */}
        <SecLabel>Plazos</SecLabel>
        <div style={grid3}>
          <div style={field}><label style={lbl}>Fecha de inicio</label><input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} style={inp} /></div>
          <div style={field}><label style={lbl}>Fecha de entrega</label><input type="date" value={fechaEntrega} onChange={e => setFechaEntrega(e.target.value)} style={inp} /></div>
          <div style={field}><label style={lbl}>Duración estimada</label><input value={duracion} onChange={e => setDuracion(e.target.value)} placeholder="4 semanas" style={inp} /></div>
        </div>

        {/* ── INVERSIÓN ── */}
        <SecLabel>Inversión</SecLabel>
        <div style={grid2}>
          <div style={field}><label style={lbl}>Valor total (USD) *</label><input type="number" value={monto} onChange={e => setMonto(e.target.value)} required placeholder="500" min="0" step="0.01" style={inp} /></div>
          <div style={field}><label style={lbl}>Anticipo (USD)</label><input type="number" value={anticipo} onChange={e => setAnticipo(e.target.value)} placeholder="250" min="0" step="0.01" style={inp} /></div>
        </div>

        {saldo !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Saldo restante calculado:</span>
            <span style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>USD {saldo.toLocaleString('es-AR')}</span>
          </div>
        )}

        <div style={field}>
          <label style={lbl}>Forma de pago</label>
          <input value={formaDePago} onChange={e => setFormaPago(e.target.value)} placeholder="50% anticipo, 50% contra entrega" style={inp} />
        </div>
        <div style={{ ...field, maxWidth: 200 }}>
          <label style={lbl}>Rondas de revisión</label>
          <input type="number" value={rondas} onChange={e => setRondas(e.target.value)} min="0" max="10" step="1" style={inp} />
        </div>

        {/* ── MANTENIMIENTO ── */}
        <SecLabel>Servicio de mantenimiento</SecLabel>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={contrataMant} onChange={e => setContrataMant(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#C0001A' }} />
          <div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: 0 }}>El cliente contrata mantenimiento</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>Hosting, dominio, monitoreo, backups y correcciones menores</p>
          </div>
        </label>

        {contrataMant && (
          <div style={grid2}>
            <div style={field}><label style={lbl}>Valor de mantenimiento (USD)</label><input type="number" value={valorMant} onChange={e => setValorMant(e.target.value)} placeholder="15" min="0" step="0.01" style={inp} /></div>
            <div style={field}>
              <label style={lbl}>Periodicidad</label>
              <CustomSelect value={periodicidad} onChange={setPeriodicidad} placeholder="Mensual"
                options={PERIODICIDADES.map(p => ({ value: p, label: p }))} />
            </div>
          </div>
        )}

        {error && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8 }}>
            <Warning size={15} color="#EF4444" />
            <p style={{ fontSize: 13, color: '#EF4444', margin: 0 }}>{error}</p>
          </div>
        )}

        <button type="submit" disabled={loading} style={{ marginTop: 4, background: '#C0001A', color: '#fff', border: 'none', borderRadius: 8, padding: '13px 20px', fontSize: 14, fontWeight: 500, letterSpacing: '0.02em', opacity: loading ? 0.6 : 1, fontFamily: 'inherit', transition: 'background 0.2s' }}>
          {loading ? 'Creando...' : 'Crear presupuesto en Notion'}
        </button>
      </form>
    </div>
  )
}
