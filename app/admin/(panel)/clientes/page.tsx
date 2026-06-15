'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useLiveRefresh } from '@/lib/useLiveRefresh'
import { Users, CaretDown, Folder, FileText, CurrencyDollar, MagnifyingGlass } from '@phosphor-icons/react'

type Item = { nombre: string; estado: string; monto: number | null; servicio: string; creado: string }
type Cliente = {
  nombre: string
  proyectos: Item[]
  presupuestos: Item[]
  totalFacturado: number
  totalPotencial: number
}

const ESTADO_COLOR: Record<string, string> = {
  'En desarrollo': '#3B82F6', 'Activo mantenimiento': '#8B5CF6', 'Anticipo cobrado': '#F59E0B',
  'Correcciones': '#EF4444', 'Aprobado': '#10B981', 'Cerrado': 'rgba(255,255,255,0.35)',
  'Borrador': 'rgba(255,255,255,0.4)', 'Enviado': '#3B82F6', 'En negociacion': '#F59E0B',
  'En revisión': '#8B5CF6', 'Rechazado': '#EF4444',
}
const colorEstado = (e: string) => ESTADO_COLOR[e] ?? 'rgba(255,255,255,0.35)'

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number>(0)
  useEffect(() => {
    const start = Date.now(); const duration = 800
    function tick() {
      const p = Math.min((Date.now() - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(value * ease))
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value])
  return <>{display.toLocaleString('es-AR')}</>
}

function Shimmer({ h = 64 }: { h?: number }) {
  return (
    <div style={{ height: h, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)', animation: 'shimmer 1.8s ease-in-out infinite' }} />
    </div>
  )
}

function ClienteCard({ c, idx }: { c: Cliente; idx: number }) {
  const [open, setOpen] = useState(false)
  const totalItems = c.proyectos.length + c.presupuestos.length
  const iniciales = c.nombre.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')

  return (
    <div style={{
      border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, background: 'rgba(255,255,255,0.025)',
      overflow: 'hidden', animation: `kzRowIn 0.4s ease ${idx * 50}ms both`, transition: 'border-color 0.2s',
    }}>
      {/* Header clickeable */}
      <div onClick={() => setOpen(v => !v)}
        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', cursor: 'pointer', transition: 'background 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        {/* Avatar iniciales */}
        <div style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(192,0,26,0.12)', border: '1px solid rgba(192,0,26,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 15, fontWeight: 600, color: '#C0001A' }}>
          {iniciales || '?'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 15, color: '#fff', margin: 0, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nombre}</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: '3px 0 0' }}>
            {c.proyectos.length} proyecto{c.proyectos.length !== 1 ? 's' : ''} · {c.presupuestos.length} presupuesto{c.presupuestos.length !== 1 ? 's' : ''}
          </p>
        </div>
        {/* Montos */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexShrink: 0 }}>
          {c.totalFacturado > 0 && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Facturado</p>
              <p style={{ fontSize: 15, color: '#10B981', margin: '2px 0 0', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>USD <AnimatedNumber value={c.totalFacturado} /></p>
            </div>
          )}
          {c.totalPotencial > 0 && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>En juego</p>
              <p style={{ fontSize: 15, color: '#F59E0B', margin: '2px 0 0', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>USD <AnimatedNumber value={c.totalPotencial} /></p>
            </div>
          )}
          <CaretDown size={16} color="rgba(255,255,255,0.3)" style={{ transition: 'transform 0.3s cubic-bezier(0.32,0.72,0,1)', transform: open ? 'rotate(180deg)' : 'rotate(0)' }} />
        </div>
      </div>

      {/* Detalle expandible */}
      <div style={{ maxHeight: open ? 600 : 0, overflow: 'hidden', transition: 'max-height 0.4s cubic-bezier(0.32,0.72,0,1)' }}>
        <div style={{ padding: '4px 20px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          {/* Proyectos */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, margin: '14px 0 10px' }}>
              <Folder size={13} color="#3B82F6" />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Proyectos</span>
            </div>
            {c.proyectos.length === 0 ? <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', margin: 0 }}>Ninguno</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {c.proyectos.map((p, i) => <ItemRow key={i} item={p} />)}
              </div>
            )}
          </div>
          {/* Presupuestos */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, margin: '14px 0 10px' }}>
              <FileText size={13} color="#F59E0B" />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Presupuestos</span>
            </div>
            {c.presupuestos.length === 0 ? <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', margin: 0 }}>Ninguno</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {c.presupuestos.map((p, i) => <ItemRow key={i} item={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ItemRow({ item }: { item: Item }) {
  const col = colorEstado(item.estado)
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '7px 10px', borderRadius: 7, background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.8)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.nombre}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
        {item.monto != null && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontVariantNumeric: 'tabular-nums' }}>${item.monto.toLocaleString('es-AR')}</span>}
        <span style={{ fontSize: 9.5, color: col, background: `${col}1f`, border: `1px solid ${col}33`, borderRadius: 4, padding: '2px 6px', whiteSpace: 'nowrap' }}>{item.estado || '—'}</span>
      </div>
    </div>
  )
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')

  const load = useCallback(() => {
    fetch('/api/admin/clientes')
      .then(r => r.json())
      .then(d => { setClientes(d.clientes ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])
  useEffect(() => { load() }, [load])
  useLiveRefresh(load)

  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  const filtrados = q ? clientes.filter(c => norm(c.nombre).includes(norm(q))) : clientes

  const totalFacturado = clientes.reduce((s, c) => s + c.totalFacturado, 0)
  const totalPotencial = clientes.reduce((s, c) => s + c.totalPotencial, 0)

  return (
    <div style={{ padding: '40px 40px', maxWidth: 900 }}>

      <style>{`
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes kzRowIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 28, position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: 11, color: '#10B981', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6, opacity: 0.7 }}>CRM</p>
        <h1 style={{ fontSize: 28, fontWeight: 400, color: '#fff', margin: 0, lineHeight: 1.1 }}>
          <span style={{ fontFamily: 'var(--font-serif-var), Cormorant Garamond, serif', fontWeight: 600, fontStyle: 'italic' }}>Clientes </span>
          <span style={{ fontFamily: 'var(--font-body-var), Space Grotesk, sans-serif', fontWeight: 300, letterSpacing: '-0.01em', color: 'rgba(255,255,255,0.7)' }}>y cuentas</span>
        </h1>
      </div>

      {/* Resumen + búsqueda */}
      {!loading && clientes.length > 0 && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 11, background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <CurrencyDollar size={15} color="#10B981" />
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>Facturado total:</span>
            <span style={{ fontSize: 14, color: '#10B981', fontWeight: 600 }}>USD <AnimatedNumber value={totalFacturado} /></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 11, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <CurrencyDollar size={15} color="#F59E0B" />
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>En juego:</span>
            <span style={{ fontSize: 14, color: '#F59E0B', fontWeight: 600 }}>USD <AnimatedNumber value={totalPotencial} /></span>
          </div>
          <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
            <MagnifyingGlass size={15} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar cliente..."
              style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, padding: '10px 14px 10px 36px', color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
          </div>
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...Array(4)].map((_, i) => <Shimmer key={i} h={74} />)}
        </div>
      ) : filtrados.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <Users size={32} color="rgba(255,255,255,0.15)" />
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 12 }}>
            {clientes.length === 0 ? 'Todavía no hay clientes registrados' : 'Ningún cliente coincide con la búsqueda'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtrados.map((c, i) => <ClienteCard key={c.nombre} c={c} idx={i} />)}
        </div>
      )}
    </div>
  )
}
