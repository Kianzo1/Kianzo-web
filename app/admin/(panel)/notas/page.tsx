'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useLiveRefresh } from '@/lib/useLiveRefresh'
import { Lightbulb, PushPin, PushPinSlash, Trash, PencilSimple, X, Check, Plus, Sparkle, MagnifyingGlass, SquaresFour, ClockCounterClockwise, Microphone, MicrophoneSlash } from '@phosphor-icons/react'

type Nota = { id: string; titulo: string; contenido: string; color: string; fijada: boolean; creado: string; editado: string }

const COLORES: Record<string, { hex: string; soft: string; border: string }> = {
  Bordeaux:  { hex: '#C0001A', soft: 'rgba(192,0,26,0.08)',  border: 'rgba(192,0,26,0.28)' },
  Azul:      { hex: '#3B82F6', soft: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.28)' },
  Esmeralda: { hex: '#10B981', soft: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.28)' },
  Violeta:   { hex: '#8B5CF6', soft: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.28)' },
  Ambar:     { hex: '#F59E0B', soft: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.28)' },
  Gris:      { hex: '#8B93A1', soft: 'rgba(139,147,161,0.07)', border: 'rgba(139,147,161,0.25)' },
}
const COLOR_KEYS = Object.keys(COLORES)
const col = (c: string) => COLORES[c] ?? COLORES.Bordeaux

function ColorDots({ value, onChange, size = 16 }: { value: string; onChange: (c: string) => void; size?: number }) {
  return (
    <div style={{ display: 'flex', gap: 7 }}>
      {COLOR_KEYS.map(c => {
        const active = c === value
        return (
          <button key={c} type="button" onClick={() => onChange(c)} title={c}
            style={{ width: size, height: size, borderRadius: '50%', background: col(c).hex, cursor: 'pointer', padding: 0,
              border: active ? '2px solid #fff' : '2px solid transparent',
              boxShadow: active ? `0 0 0 2px ${col(c).hex}, 0 0 8px ${col(c).hex}90` : 'none',
              transform: active ? 'scale(1.12)' : 'scale(1)', transition: 'all 0.15s cubic-bezier(0.34,1.56,0.64,1)' }} />
        )
      })}
    </div>
  )
}

// ── Botón de dictado por voz (Web Speech API) ───────────────────────
function MicBtn({ onText, size = 36 }: { onText: (t: string) => void; size?: number }) {
  const [active, setActive] = useState(false)
  const [err, setErr] = useState('')
  const recRef = useRef<any>(null)

  function toggle() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { setErr('Tu navegador no soporta dictado por voz'); return }
    if (active) { recRef.current?.stop(); setActive(false); return }
    const rec = new SR()
    rec.lang = 'es-AR'; rec.continuous = false; rec.interimResults = false
    recRef.current = rec
    rec.onstart = () => { setActive(true); setErr('') }
    rec.onresult = (e: any) => { onText(e.results[0][0].transcript); setActive(false) }
    rec.onerror = (e: any) => {
      setActive(false)
      if (e.error === 'no-speech') return
      setErr(e.error === 'not-allowed' ? 'Permití el micrófono en el 🔒 de la barra' : 'Error de micrófono')
    }
    rec.onend = () => setActive(false)
    rec.start()
  }

  return (
    <button type="button" onClick={toggle} title={active ? 'Detener' : 'Dictar por voz'}
      style={{ width: size, height: size, borderRadius: 10, flexShrink: 0,
        background: active ? 'rgba(192,0,26,0.2)' : 'rgba(255,255,255,0.05)',
        border: active ? '1px solid rgba(192,0,26,0.5)' : '1px solid rgba(255,255,255,0.1)',
        color: active ? '#ff5577' : 'rgba(255,255,255,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        transition: 'all 0.2s', animation: active ? 'ntMicPulse 1s ease infinite' : 'none' }}
      onMouseDown={e => e.preventDefault()}>
      {active ? <MicrophoneSlash size={size * 0.45} weight="fill" /> : <Microphone size={size * 0.45} />}
      {err && <span style={{ position: 'absolute' }} />}
    </button>
  )
}

// ── Composer (crear idea) ───────────────────────────────────────────
function Composer({ onCreate }: { onCreate: (n: { titulo: string; contenido: string; color: string }) => Promise<void> }) {
  const [expanded, setExpanded] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [contenido, setContenido] = useState('')
  const [color, setColor] = useState('Bordeaux')
  const [saving, setSaving] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  async function guardar() {
    if (!titulo.trim() && !contenido.trim()) { setExpanded(false); return }
    setSaving(true)
    await onCreate({ titulo: titulo.trim() || 'Sin título', contenido: contenido.trim(), color })
    setTitulo(''); setContenido(''); setColor('Bordeaux'); setExpanded(false); setSaving(false)
  }

  const c = col(color)
  return (
    <div ref={wrapRef} style={{ maxWidth: 620, margin: '0 auto 32px' }}>
      <div style={{
        background: expanded ? c.soft : 'rgba(255,255,255,0.03)',
        border: `1px solid ${expanded ? c.border : 'rgba(255,255,255,0.09)'}`,
        borderRadius: 16, padding: expanded ? '18px 20px' : '4px 8px',
        boxShadow: expanded ? `0 12px 40px rgba(0,0,0,0.35), 0 0 0 1px ${c.border} inset` : 'none',
        transition: 'all 0.28s cubic-bezier(0.32,0.72,0,1)',
      }}>
        {!expanded ? (
          <button onClick={() => setExpanded(true)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 12px', background: 'none', border: 'none', cursor: 'text', fontFamily: 'inherit', textAlign: 'left' }}>
            <Sparkle size={18} color="#C0001A" weight="fill" />
            <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>Anotá una idea antes de que se te escape...</span>
            <Plus size={18} color="rgba(255,255,255,0.3)" style={{ marginLeft: 'auto' }} />
          </button>
        ) : (
          <>
            <input autoFocus value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título de la idea"
              style={{ width: '100%', boxSizing: 'border-box', background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 17, fontWeight: 600, fontFamily: 'inherit', marginBottom: 8 }} />
            <textarea value={contenido} onChange={e => setContenido(e.target.value)} placeholder="Desarrollá la idea, links, lo que sea..." rows={3}
              style={{ width: '100%', boxSizing: 'border-box', background: 'none', border: 'none', outline: 'none', color: 'rgba(255,255,255,0.78)', fontSize: 14, fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.55 }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <ColorDots value={color} onChange={setColor} />
                <MicBtn size={32} onText={t => setContenido(prev => (prev ? prev + ' ' : '') + t)} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { setExpanded(false); setTitulo(''); setContenido('') }} style={{ padding: '8px 16px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.55)', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer' }}>Cancelar</button>
                <button onClick={guardar} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 18px', borderRadius: 9, border: 'none', background: c.hex, color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', boxShadow: `0 4px 16px ${c.hex}50` }}>
                  {saving ? 'Guardando...' : <><Check size={14} weight="bold" /> Guardar idea</>}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Modal de edición ────────────────────────────────────────────────
function EditModal({ nota, onSave, onClose }: { nota: Nota; onSave: (id: string, d: Partial<Nota>) => Promise<void>; onClose: () => void }) {
  const [titulo, setTitulo] = useState(nota.titulo)
  const [contenido, setContenido] = useState(nota.contenido)
  const [color, setColor] = useState(nota.color)
  const [saving, setSaving] = useState(false)
  const c = col(color)

  async function guardar() {
    setSaving(true)
    await onSave(nota.id, { titulo: titulo.trim() || 'Sin título', contenido: contenido.trim(), color })
    setSaving(false); onClose()
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', animation: 'ntFade 0.15s ease', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 540, maxWidth: '100%', background: '#141414', border: `1px solid ${c.border}`, borderRadius: 18, overflow: 'hidden', boxShadow: `0 40px 100px rgba(0,0,0,0.7)`, animation: 'ntUp 0.22s cubic-bezier(0.32,0.72,0,1)' }}>
        <div style={{ height: 3, background: `linear-gradient(90deg, ${c.hex}, ${c.hex}55)` }} />
        <div style={{ padding: '24px 26px' }}>
          <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título"
            style={{ width: '100%', boxSizing: 'border-box', background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 19, fontWeight: 600, fontFamily: 'inherit', marginBottom: 12 }} />
          <textarea value={contenido} onChange={e => setContenido(e.target.value)} placeholder="Contenido..." rows={6}
            style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 14px', outline: 'none', color: 'rgba(255,255,255,0.8)', fontSize: 14.5, fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.6 }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ColorDots value={color} onChange={setColor} size={18} />
              <MicBtn size={34} onText={t => setContenido(prev => (prev ? prev + ' ' : '') + t)} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={onClose} style={{ padding: '9px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.6)', fontSize: 13.5, fontFamily: 'inherit', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={guardar} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 20px', borderRadius: 10, border: 'none', background: c.hex, color: '#fff', fontSize: 13.5, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', boxShadow: `0 4px 16px ${c.hex}50` }}>
                {saving ? 'Guardando...' : <><Check size={15} weight="bold" /> Guardar</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Card de nota ────────────────────────────────────────────────────
function NotaCard({ nota, idx, onEdit, onDelete, onPin }: { nota: Nota; idx: number; onEdit: (n: Nota) => void; onDelete: (n: Nota) => void; onPin: (n: Nota) => void }) {
  const c = col(nota.color)
  const [hover, setHover] = useState(false)
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={() => onEdit(nota)}
      style={{
        breakInside: 'avoid', marginBottom: 16, cursor: 'pointer',
        background: c.soft, border: `1px solid ${hover ? c.hex + '55' : c.border}`,
        borderRadius: 16, padding: '16px 18px 14px', position: 'relative', overflow: 'hidden',
        transform: hover ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hover ? `0 14px 36px rgba(0,0,0,0.4), 0 0 0 1px ${c.hex}30 inset` : '0 2px 8px rgba(0,0,0,0.15)',
        transition: 'all 0.2s cubic-bezier(0.32,0.72,0,1)',
        animation: `ntCardIn 0.4s cubic-bezier(0.22,1,0.36,1) ${idx * 45}ms both`,
      }}>
      {/* Barra de color lateral */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(to bottom, ${c.hex}, ${c.hex}30)` }} />
      {nota.fijada && (
        <PushPin size={13} color={c.hex} weight="fill" style={{ position: 'absolute', top: 14, right: 14 }} />
      )}

      <p style={{ fontSize: 15.5, color: '#fff', fontWeight: 600, margin: '0 0 7px', paddingRight: nota.fijada ? 20 : 0, lineHeight: 1.3, wordBreak: 'break-word' }}>{nota.titulo}</p>
      {nota.contenido && (
        <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.62)', margin: 0, lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{nota.contenido}</p>
      )}

      {/* Footer: fecha + acciones */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, height: 24 }}>
        <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.02em' }}>
          {new Date(nota.creado).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
        </span>
        <div style={{ display: 'flex', gap: 4, opacity: hover ? 1 : 0, transform: hover ? 'translateX(0)' : 'translateX(6px)', transition: 'all 0.2s' }}>
          {[
            { icon: nota.fijada ? PushPinSlash : PushPin, fn: () => onPin(nota), title: nota.fijada ? 'Desfijar' : 'Fijar' },
            { icon: PencilSimple, fn: () => onEdit(nota), title: 'Editar' },
            { icon: Trash, fn: () => onDelete(nota), title: 'Eliminar', danger: true },
          ].map((b, i) => {
            const Icon = b.icon
            return (
              <button key={i} title={b.title}
                onClick={e => { e.stopPropagation(); b.fn() }}
                style={{ width: 26, height: 26, borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)', color: b.danger ? 'rgba(255,120,120,0.7)' : 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.background = b.danger ? 'rgba(192,0,26,0.18)' : c.soft; el.style.color = b.danger ? '#ff6b6b' : c.hex; el.style.borderColor = b.danger ? 'rgba(192,0,26,0.4)' : c.border }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'rgba(0,0,0,0.2)'; el.style.color = b.danger ? 'rgba(255,120,120,0.7)' : 'rgba(255,255,255,0.5)'; el.style.borderColor = 'rgba(255,255,255,0.08)' }}
              ><Icon size={13} weight={b.danger ? 'regular' : 'fill'} /></button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Agrupado por fecha para la línea de tiempo ──────────────────────
function bucketDe(iso: string): { key: string; label: string } {
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
  const f = new Date(iso); f.setHours(0, 0, 0, 0)
  const diff = Math.round((hoy.getTime() - f.getTime()) / 86400000)
  if (diff <= 0) return { key: 'hoy', label: 'Hoy' }
  if (diff === 1) return { key: 'ayer', label: 'Ayer' }
  if (diff <= 7) return { key: 'semana', label: 'Esta semana' }
  if (diff <= 30) return { key: 'mes', label: 'Este mes' }
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
  return { key: `${f.getFullYear()}-${f.getMonth()}`, label: `${meses[f.getMonth()]} ${f.getFullYear()}` }
}

function Timeline({ notas, onEdit, onDelete, onPin }: { notas: Nota[]; onEdit: (n: Nota) => void; onDelete: (n: Nota) => void; onPin: (n: Nota) => void }) {
  // Orden cronológico descendente y agrupado por bucket
  const orden = [...notas].sort((a, b) => b.creado.localeCompare(a.creado))
  const grupos: { label: string; items: Nota[] }[] = []
  orden.forEach(n => {
    const { label } = bucketDe(n.creado)
    const g = grupos.find(x => x.label === label)
    if (g) g.items.push(n); else grupos.push({ label, items: [n] })
  })

  return (
    <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto', paddingLeft: 8 }}>
      {/* Línea vertical */}
      <div style={{ position: 'absolute', left: 16, top: 8, bottom: 8, width: 2, background: 'linear-gradient(to bottom, rgba(192,0,26,0.4), rgba(255,255,255,0.06))' }} />
      {grupos.map((g, gi) => (
        <div key={g.label} style={{ marginBottom: 10 }}>
          {/* Etiqueta del bucket */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '0 0 12px', animation: `ntCardIn 0.4s ease ${gi * 60}ms both` }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(192,0,26,0.12)', border: '1px solid rgba(192,0,26,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
              <ClockCounterClockwise size={15} color="#C0001A" />
            </div>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>{g.label}</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>· {g.items.length}</span>
          </div>
          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 50, marginBottom: 22 }}>
            {g.items.map((n, i) => {
              const c = col(n.color)
              return (
                <div key={n.id} onClick={() => onEdit(n)} className="nt-tl-row"
                  style={{ position: 'relative', background: c.soft, border: `1px solid ${c.border}`, borderRadius: 12, padding: '12px 15px', cursor: 'pointer', transition: 'all 0.18s', animation: `ntCardIn 0.4s ease ${gi * 60 + i * 35 + 80}ms both` }}>
                  {/* Punto conector */}
                  <span style={{ position: 'absolute', left: -42, top: 18, width: 9, height: 9, borderRadius: '50%', background: c.hex, boxShadow: `0 0 0 3px #0a0a0a, 0 0 8px ${c.hex}`, zIndex: 1 }} />
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        {n.fijada && <PushPin size={11} color={c.hex} weight="fill" />}
                        <p style={{ fontSize: 14.5, color: '#fff', fontWeight: 600, margin: 0, lineHeight: 1.3, wordBreak: 'break-word' }}>{n.titulo}</p>
                      </div>
                      {n.contenido && <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.58)', margin: '5px 0 0', lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{n.contenido}</p>}
                    </div>
                    <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.3)', flexShrink: 0, whiteSpace: 'nowrap' }}>
                      {new Date(n.creado).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {/* Acciones */}
                  <div className="nt-tl-actions" style={{ display: 'flex', gap: 4, marginTop: 10, justifyContent: 'flex-end' }}>
                    {[
                      { icon: n.fijada ? PushPinSlash : PushPin, fn: () => onPin(n), title: n.fijada ? 'Desfijar' : 'Fijar' },
                      { icon: PencilSimple, fn: () => onEdit(n), title: 'Editar' },
                      { icon: Trash, fn: () => onDelete(n), title: 'Eliminar', danger: true },
                    ].map((b, bi) => {
                      const Icon = b.icon
                      return (
                        <button key={bi} title={b.title} onClick={e => { e.stopPropagation(); b.fn() }}
                          style={{ width: 25, height: 25, borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)', color: b.danger ? 'rgba(255,120,120,0.7)' : 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <Icon size={12} weight={b.danger ? 'regular' : 'fill'} />
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function NotasPage() {
  const [notas, setNotas] = useState<Nota[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Nota | null>(null)
  const [toDelete, setToDelete] = useState<Nota | null>(null)
  const [q, setQ] = useState('')
  const [colorFiltro, setColorFiltro] = useState<string>('todos')
  const [vista, setVista] = useState<'mosaico' | 'timeline'>('mosaico')

  const load = useCallback(() => {
    fetch('/api/admin/notas').then(r => r.json()).then(d => { setNotas(d.notas ?? []); setLoading(false) }).catch(() => setLoading(false))
  }, [])
  useEffect(() => { load() }, [load])
  useLiveRefresh(load)

  async function crear(n: { titulo: string; contenido: string; color: string }) {
    const tmp: Nota = { id: 'tmp_' + Date.now(), ...n, fijada: false, creado: new Date().toISOString(), editado: new Date().toISOString() }
    setNotas(ns => [tmp, ...ns])
    const res = await fetch('/api/admin/notas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(n) }).then(r => r.json()).catch(() => null)
    if (res?.nota) setNotas(ns => ns.map(x => x.id === tmp.id ? res.nota : x))
    else load()
  }

  async function editar(id: string, d: Partial<Nota>) {
    setNotas(ns => ns.map(x => x.id === id ? { ...x, ...d } : x))
    await fetch('/api/admin/notas', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...d }) }).catch(() => {})
  }

  async function pin(n: Nota) {
    setNotas(ns => ns.map(x => x.id === n.id ? { ...x, fijada: !x.fijada } : x))
    await fetch('/api/admin/notas', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: n.id, fijada: !n.fijada }) }).catch(() => {})
  }

  async function borrar() {
    if (!toDelete) return
    const id = toDelete.id
    setNotas(ns => ns.filter(x => x.id !== id)); setToDelete(null)
    await fetch('/api/admin/notas', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }).catch(() => {})
  }

  const filtradas = notas
    .filter(n => colorFiltro === 'todos' || n.color === colorFiltro)
    .filter(n => !q || n.titulo.toLowerCase().includes(q.toLowerCase()) || n.contenido.toLowerCase().includes(q.toLowerCase()))
  const fijadas = filtradas.filter(n => n.fijada)
  const resto = filtradas.filter(n => !n.fijada)

  return (
    <div style={{ padding: '40px 40px 90px', maxWidth: 1100, margin: '0 auto' }}>
      <style>{`
        @keyframes ntFade { from{opacity:0} to{opacity:1} }
        @keyframes ntUp { from{opacity:0;transform:translateY(16px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes ntCardIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ntHeaderIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ntMicPulse { 0%,100%{box-shadow:0 0 0 0 rgba(192,0,26,0.4)} 50%{box-shadow:0 0 0 5px rgba(192,0,26,0)} }
        .nt-masonry { column-gap: 16px; }
        @media (min-width: 1px)   { .nt-masonry { column-count: 1; } }
        @media (min-width: 560px) { .nt-masonry { column-count: 2; } }
        @media (min-width: 920px) { .nt-masonry { column-count: 3; } }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28, animation: 'ntHeaderIn 0.5s ease both' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 99, background: 'rgba(192,0,26,0.1)', border: '1px solid rgba(192,0,26,0.25)', marginBottom: 14 }}>
          <Lightbulb size={13} color="#C0001A" weight="fill" />
          <span style={{ fontSize: 10.5, color: '#ff5577', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600 }}>Brainstorm</span>
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 400, color: '#fff', margin: 0, lineHeight: 1.05 }}>
          <span style={{ fontFamily: 'var(--font-serif-var), Cormorant Garamond, serif', fontWeight: 600, fontStyle: 'italic' }}>Ideas </span>
          <span style={{ fontFamily: 'var(--font-body-var), Space Grotesk, sans-serif', fontWeight: 300, letterSpacing: '-0.01em', color: 'rgba(255,255,255,0.65)' }}>y notas</span>
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)', margin: '8px 0 0' }}>Capturá lo que se te ocurra. Se guarda al instante en Notion.</p>
      </div>

      <Composer onCreate={crear} />

      {/* Barra de control: buscar + vista + filtro color */}
      {!loading && notas.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22, flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Buscar */}
          <div style={{ position: 'relative' }}>
            <MagnifyingGlass size={14} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar ideas..."
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 9, padding: '8px 14px 8px 34px', color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'inherit', width: 210, boxSizing: 'border-box' }} />
          </div>

          {/* Toggle de vista */}
          <div style={{ display: 'flex', gap: 3, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 3 }}>
            {([['mosaico', 'Mosaico', SquaresFour], ['timeline', 'Línea de tiempo', ClockCounterClockwise]] as const).map(([key, lbl, Icon]) => (
              <button key={key} onClick={() => setVista(key)} title={lbl} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 7, border: 'none', fontFamily: 'inherit',
                fontSize: 12.5, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
                background: vista === key ? 'rgba(192,0,26,0.16)' : 'transparent',
                color: vista === key ? '#ff5577' : 'rgba(255,255,255,0.4)',
              }}><Icon size={15} weight={vista === key ? 'fill' : 'regular'} />{lbl}</button>
            ))}
          </div>

          {/* Filtro por color — chip con dropdown simple */}
          <div style={{ display: 'flex', gap: 5, alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '4px 6px' }}>
            <button onClick={() => setColorFiltro('todos')} title="Todos los colores"
              style={{ fontSize: 12, padding: '4px 10px', borderRadius: 7, border: 'none', background: colorFiltro === 'todos' ? 'rgba(255,255,255,0.1)' : 'transparent', color: colorFiltro === 'todos' ? '#fff' : 'rgba(255,255,255,0.4)', cursor: 'pointer', fontFamily: 'inherit' }}>Todos</button>
            {COLOR_KEYS.map(c => (
              <button key={c} onClick={() => setColorFiltro(colorFiltro === c ? 'todos' : c)} title={c}
                style={{ width: 24, height: 24, borderRadius: 7, background: colorFiltro === c ? col(c).hex : 'transparent', cursor: 'pointer', padding: 0, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: col(c).hex, border: colorFiltro === c ? '2px solid #fff' : '2px solid transparent', boxShadow: colorFiltro === c ? `0 0 6px ${col(c).hex}` : 'none' }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Contenido */}
      {loading ? (
        <div className="nt-masonry">
          {[180, 120, 150, 200, 140, 110].map((h, i) => (
            <div key={i} style={{ breakInside: 'avoid', marginBottom: 16, height: h, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }} />
          ))}
        </div>
      ) : filtradas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '70px 20px' }}>
          <Lightbulb size={40} color="rgba(255,255,255,0.15)" weight="light" />
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)', margin: '16px 0 0' }}>
            {q || colorFiltro !== 'todos' ? 'Ninguna idea coincide con el filtro' : 'Todavía no anotaste ninguna idea'}
          </p>
          {!q && colorFiltro === 'todos' && <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.22)', margin: '6px 0 0' }}>Usá el campo de arriba para empezar ✨</p>}
        </div>
      ) : vista === 'timeline' ? (
        <Timeline notas={filtradas} onEdit={setEditing} onDelete={setToDelete} onPin={pin} />
      ) : (
        <>
          {fijadas.length > 0 && (
            <>
              <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 7 }}><PushPin size={12} weight="fill" color="#C0001A" /> Fijadas</p>
              <div className="nt-masonry" style={{ marginBottom: 24 }}>
                {fijadas.map((n, i) => <NotaCard key={n.id} nota={n} idx={i} onEdit={setEditing} onDelete={setToDelete} onPin={pin} />)}
              </div>
            </>
          )}
          {resto.length > 0 && (
            <>
              {fijadas.length > 0 && <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 12px' }}>Otras ideas</p>}
              <div className="nt-masonry">
                {resto.map((n, i) => <NotaCard key={n.id} nota={n} idx={i} onEdit={setEditing} onDelete={setToDelete} onPin={pin} />)}
              </div>
            </>
          )}
        </>
      )}

      {editing && <EditModal nota={editing} onSave={editar} onClose={() => setEditing(null)} />}

      {/* Confirmar borrado */}
      {toDelete && (
        <div onClick={() => setToDelete(null)} style={{ position: 'fixed', inset: 0, zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)', animation: 'ntFade 0.15s ease', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ width: 380, maxWidth: '100%', background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.7)', animation: 'ntUp 0.2s cubic-bezier(0.32,0.72,0,1)' }}>
            <div style={{ height: 3, background: 'linear-gradient(90deg, #C0001A, #ff3352)' }} />
            <div style={{ padding: '24px 26px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(192,0,26,0.1)', border: '1px solid rgba(192,0,26,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}><Trash size={20} color="#C0001A" /></div>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: '#fff', margin: '0 0 6px' }}>¿Eliminar esta idea?</h3>
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.45)', margin: '0 0 20px', lineHeight: 1.5 }}>"{toDelete.titulo}" se archivará en Notion.</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setToDelete(null)} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' }}>Cancelar</button>
                <button onClick={borrar} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: 'none', background: '#C0001A', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}><Trash size={15} /> Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
