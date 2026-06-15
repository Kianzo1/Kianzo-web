'use client'

import { useEffect, useState, useCallback } from 'react'
import { GearSix, Check, Spinner, Target, User, Warning } from '@phosphor-icons/react'

type Config = { nombre: string; metaMensual: number }

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<Config>({ nombre: 'Kianzo', metaMensual: 0 })
  const [disponible, setDisponible] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(0)
  const [error, setError] = useState('')

  // Campos editables
  const [nombre, setNombre] = useState('')
  const [meta, setMeta] = useState('')

  const load = useCallback(() => {
    fetch('/api/admin/config').then(r => r.json()).then(d => {
      const c = d.config as Config
      setConfig(c); setDisponible(d.disponible)
      setNombre(c.nombre); setMeta(c.metaMensual ? String(c.metaMensual) : '')
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])
  useEffect(() => { load() }, [load])

  const dirty = nombre.trim() !== config.nombre || (parseFloat(meta) || 0) !== config.metaMensual

  async function guardar() {
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/admin/config', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, metaMensual: meta }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error ?? 'Error al guardar')
      setConfig(d.config); setSavedAt(Date.now())
      setTimeout(() => setSavedAt(0), 2500)
    } catch (e: any) {
      setError(e.message)
    }
    setSaving(false)
  }

  return (
    <div style={{ padding: '40px 40px 80px', maxWidth: 720 }}>
      <style>{`
        @keyframes cfgUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cfgSpin { to { transform: rotate(360deg) } }
        .cfg-input:focus { border-color: rgba(192,0,26,0.45) !important; background: rgba(192,0,26,0.04) !important; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 30, animation: 'cfgUp 0.5s ease both' }}>
        <p style={{ fontSize: 11, color: '#C0001A', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6, opacity: 0.7 }}>Panel</p>
        <h1 style={{ fontSize: 28, fontWeight: 400, color: '#fff', margin: 0, lineHeight: 1.1 }}>
          <span style={{ fontFamily: 'var(--font-serif-var), Cormorant Garamond, serif', fontWeight: 600, fontStyle: 'italic' }}>Config</span>
          <span style={{ fontFamily: 'var(--font-body-var), Space Grotesk, sans-serif', fontWeight: 300, letterSpacing: '-0.01em', color: 'rgba(255,255,255,0.7)' }}>uración</span>
        </h1>
      </div>

      {/* Aviso si no está configurada la DB de Notion */}
      {!loading && !disponible && (
        <div style={{ display: 'flex', gap: 12, padding: '16px 18px', borderRadius: 12, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)', marginBottom: 22, animation: 'cfgUp 0.5s ease both' }}>
          <Warning size={20} color="#F59E0B" weight="fill" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: 13.5, color: '#F59E0B', margin: '0 0 6px', fontWeight: 600 }}>Falta conectar la base de datos de Config en Notion</p>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.55 }}>
              Creá una base en Notion con dos propiedades: <strong style={{ color: 'rgba(255,255,255,0.7)' }}>Clave</strong> (título) y <strong style={{ color: 'rgba(255,255,255,0.7)' }}>Valor</strong> (texto). Después agregá <code style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: 4 }}>NOTION_CONFIG_DB_ID</code> en el .env.local con el ID de esa base y reiniciá el servidor. Hasta entonces no se puede guardar.
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ height: 320, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'cfgUp 0.5s ease 0.08s both' }}>

          {/* Card: Identidad */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(192,0,26,0.12)', border: '1px solid rgba(192,0,26,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={17} color="#C0001A" />
              </div>
              <div>
                <p style={{ fontSize: 14, color: '#fff', margin: 0, fontWeight: 600 }}>Identidad</p>
                <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.35)', margin: '2px 0 0' }}>El nombre que aparece en el saludo del dashboard</p>
              </div>
            </div>
            <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Nombre</label>
            <input className="cfg-input" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Kianzo"
              style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 15, outline: 'none', fontFamily: 'inherit', transition: 'all 0.18s' }} />
          </div>

          {/* Card: Meta mensual */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={17} color="#10B981" />
              </div>
              <div>
                <p style={{ fontSize: 14, color: '#fff', margin: 0, fontWeight: 600 }}>Meta mensual</p>
                <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.35)', margin: '2px 0 0' }}>Objetivo de ingresos del mes — se muestra como progreso en el dashboard</p>
              </div>
            </div>
            <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Objetivo (USD)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: 'rgba(255,255,255,0.35)', pointerEvents: 'none' }}>USD</span>
              <input className="cfg-input" value={meta} onChange={e => setMeta(e.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal" placeholder="0"
                style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, padding: '12px 16px 12px 52px', color: '#fff', fontSize: 15, outline: 'none', fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums', transition: 'all 0.18s' }} />
            </div>
            <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.3)', margin: '10px 0 0' }}>Dejalo en 0 para no mostrar meta.</p>
          </div>

          {/* Barra de acción */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginTop: 4 }}>
            <div style={{ fontSize: 12.5 }}>
              {error
                ? <span style={{ color: '#EF4444' }}>{error}</span>
                : savedAt
                  ? <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: 6 }}><Check size={14} weight="bold" /> Guardado y sincronizado en Notion</span>
                  : dirty
                    ? <span style={{ color: 'rgba(255,255,255,0.35)' }}>Cambios sin guardar</span>
                    : <span style={{ color: 'rgba(255,255,255,0.25)' }}>Todo guardado</span>}
            </div>
            <button onClick={guardar} disabled={saving || !dirty || !disponible}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 11, border: 'none',
                fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: (saving || !dirty || !disponible) ? 'not-allowed' : 'pointer',
                background: (!dirty || !disponible) ? 'rgba(255,255,255,0.05)' : saving ? 'rgba(192,0,26,0.5)' : '#C0001A',
                color: (!dirty || !disponible) ? 'rgba(255,255,255,0.3)' : '#fff', transition: 'all 0.18s',
              }}>
              {saving
                ? <><Spinner size={15} style={{ animation: 'cfgSpin 0.7s linear infinite' }} /> Guardando...</>
                : <><GearSix size={15} /> Guardar cambios</>}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
