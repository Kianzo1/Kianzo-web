'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Phone, VideoCamera, UsersThree, Briefcase, Tag, Plus, X, Check, Trash, CaretLeft, CaretRight, Clock, CalendarBlank, PencilSimple } from '@phosphor-icons/react'
import { useLiveRefresh } from '@/lib/useLiveRefresh'

type Tarea = {
  id: string; titulo: string; fecha: string; hora: string
  tipo: string; notas: string; hecha: boolean; creado: string
}

const TIPOS: Record<string, { label: string; color: string; icon: any }> = {
  llamada:      { label: 'Llamada',       color: '#10B981', icon: Phone },
  videollamada: { label: 'Videollamada',  color: '#3B82F6', icon: VideoCamera },
  reunion:      { label: 'Reunión',       color: '#8B5CF6', icon: UsersThree },
  proyecto:     { label: 'Proyecto',      color: '#C0001A', icon: Briefcase },
  otro:         { label: 'Otro',          color: '#F59E0B', icon: Tag },
}
const tipoInfo = (t: string) => TIPOS[t] ?? TIPOS.otro

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
// Color por día (estilo board de Notion)
const DIA_COLOR = ['#E0567A', '#4A90D9', '#C0623F', '#4FA86A', '#9B6BC7', '#C79A5B', '#5BB8C7']

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function startOfWeek(d: Date) {
  const x = new Date(d)
  const day = (x.getDay() + 6) % 7 // lunes = 0
  x.setDate(x.getDate() - day)
  x.setHours(0, 0, 0, 0)
  return x
}
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x }

function MiniCalendarioAgenda({ tareas, onSelectFecha }: { tareas: Tarea[]; onSelectFecha: (fecha: string) => void }) {
  const [mes, setMes] = useState(() => new Date())
  const [tooltip, setTooltip] = useState<string | null>(null)
  const hoy = new Date().toLocaleDateString('en-CA')
  const year = mes.getFullYear()
  const month = mes.getMonth()
  const primerDia = new Date(year, month, 1)
  const diasMes = new Date(year, month + 1, 0).getDate()
  const offsetInicio = (primerDia.getDay() + 6) % 7
  const nombreMes = mes.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })

  const TIPO_COLOR: Record<string, string> = {
    llamada: '#10B981', videollamada: '#3B82F6', reunion: '#8B5CF6', proyecto: '#C0001A', otro: '#F59E0B'
  }

  // Agrupar tareas por fecha con datos completos
  const tareasPorFecha: Record<string, Tarea[]> = {}
  tareas.forEach(t => {
    if (!tareasPorFecha[t.fecha]) tareasPorFecha[t.fecha] = []
    tareasPorFecha[t.fecha].push(t)
  })

  const celdas = [...Array(offsetInicio).fill(null), ...Array.from({ length: diasMes }, (_, i) => i + 1)]
  const semanas: (number | null)[][] = []
  for (let i = 0; i < celdas.length; i += 7) {
    const chunk = celdas.slice(i, i + 7)
    while (chunk.length < 7) chunk.push(null)
    semanas.push(chunk)
  }

  // Timeline
  const proximas = [...tareas]
    .filter(t => !t.hecha && t.fecha >= hoy)
    .sort((a, b) => (a.fecha + (a.hora || '99')).localeCompare(b.fecha + (b.hora || '99')))
    .slice(0, 15)

  return (
    <div style={{ marginTop: 36 }}>
      {/* ── Calendario ── */}
      <div className="kz-cal-in" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 22, padding: '32px 36px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, background: 'radial-gradient(circle, rgba(192,0,26,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 6px' }}>Calendario mensual</p>
            <span style={{ fontSize: 26, color: '#fff', fontWeight: 600, textTransform: 'capitalize', letterSpacing: '-0.02em' }}>{nombreMes}</span>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginRight: 8 }}>
              {tareas.filter(t => t.fecha.startsWith(`${year}-${String(month + 1).padStart(2,'0')}`)).length} eventos este mes
            </div>
            <button onClick={() => setMes(m => new Date(m.getFullYear(), m.getMonth() - 1))} className="kz-nav-btn" style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>‹</button>
            <button onClick={() => setMes(new Date())} className="kz-nav-btn" style={{ height: 38, padding: '0 16px', borderRadius: 10, border: '1px solid rgba(192,0,26,0.35)', background: 'rgba(192,0,26,0.1)', color: '#ff6070', cursor: 'pointer', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'inherit' }}>HOY</button>
            <button onClick={() => setMes(m => new Date(m.getFullYear(), m.getMonth() + 1))} className="kz-nav-btn" style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>›</button>
          </div>
        </div>

        {/* Header días */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 12 }}>
          {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map((d, i) => (
            <div key={d} style={{ textAlign: 'center', fontSize: 11, color: i >= 5 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{d}</div>
          ))}
        </div>

        {/* Semanas — celdas con info de eventos */}
        {semanas.map((semana, si) => (
          <div key={si} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 8 }}>
            {semana.map((dia, di) => {
              if (!dia) return <div key={di} />
              const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
              const esHoy = iso === hoy
              const tareasDelDia = tareasPorFecha[iso] ?? []
              const tieneT = tareasDelDia.length > 0
              const esFin = di >= 5
              const pendientes = tareasDelDia.filter(t => !t.hecha)
              const hechas = tareasDelDia.filter(t => t.hecha)
              return (
                <div key={di} onClick={() => tieneT && onSelectFecha(iso)}
                  className="kz-cal-day"
                  style={{
                    display: 'flex', flexDirection: 'column', padding: '10px 10px 10px', borderRadius: 14,
                    minHeight: 90,
                    background: esHoy ? 'rgba(192,0,26,0.15)' : tieneT ? 'rgba(255,255,255,0.035)' : esFin ? 'rgba(255,255,255,0.008)' : 'transparent',
                    border: esHoy ? '1px solid rgba(192,0,26,0.45)' : tieneT ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.03)',
                    cursor: tieneT ? 'pointer' : 'default',
                    boxShadow: esHoy ? '0 0 22px rgba(192,0,26,0.22)' : 'none',
                    animation: `kzFadeIn 0.4s ease ${si * 0.04 + di * 0.015}s both`,
                    position: 'relative',
                  }}>
                  {/* Número */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: tieneT ? 8 : 0 }}>
                    <span style={{ fontSize: 15, color: esHoy ? '#fff' : tieneT ? 'rgba(255,255,255,0.9)' : esFin ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.38)', fontWeight: esHoy ? 700 : tieneT ? 600 : 400, lineHeight: 1 }}>{dia}</span>
                    {tieneT && (
                      <span style={{ fontSize: 9, color: esHoy ? 'rgba(255,150,150,0.8)' : 'rgba(255,255,255,0.25)', fontWeight: 600 }}>{tareasDelDia.length}</span>
                    )}
                  </div>

                  {/* Eventos del día — chips con nombre */}
                  {pendientes.slice(0, 3).map((t, ti) => {
                    const info = tipoInfo(t.tipo)
                    const Icon = info.icon
                    return (
                      <div key={t.id} style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '3px 6px', borderRadius: 5, marginBottom: 3,
                        background: `${info.color}18`, borderLeft: `2px solid ${info.color}`,
                        animation: `kzFadeIn 0.3s ease ${si * 0.04 + di * 0.015 + ti * 0.04}s both`,
                      }}>
                        <Icon size={9} color={info.color} style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.3 }}>{t.titulo}</span>
                      </div>
                    )
                  })}
                  {pendientes.length > 3 && (
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', paddingLeft: 6 }}>+{pendientes.length - 3} más</span>
                  )}
                  {hechas.length > 0 && pendientes.length === 0 && (
                    <div style={{ fontSize: 9, color: '#10B981', display: 'flex', alignItems: 'center', gap: 3, paddingLeft: 2 }}>
                      <Check size={9} /> {hechas.length} completada{hechas.length > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}

        {/* Leyenda */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>Tipos de evento</span>
          {Object.entries(TIPO_COLOR).map(([k, c]) => {
            const Icon = tipoInfo(k).icon
            return (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 22, height: 22, borderRadius: 7, background: `${c}18`, border: `1px solid ${c}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={11} color={c} />
                </div>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', textTransform: 'capitalize' }}>{k}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Línea de tiempo ── */}
      {proximas.length > 0 && (
        <div className="kz-tl-in" style={{ marginTop: 28, background: 'linear-gradient(135deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 22, padding: '32px 36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 6px' }}>Lo que viene</p>
              <span style={{ fontSize: 20, color: '#fff', fontWeight: 600, letterSpacing: '-0.02em' }}>Próximos eventos</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Hoy', 'Semana', 'Mes'].map((label, li) => {
                const counts = [
                  proximas.filter(t => t.fecha === hoy).length,
                  proximas.filter(t => t.fecha <= toISO(addDays(new Date(), 7))).length,
                  proximas.length,
                ]
                return (
                  <div key={label} style={{ textAlign: 'center', padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: li === 0 ? '#ff6070' : 'rgba(255,255,255,0.8)' }}>{counts[li]}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>{label}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Timeline items */}
          <div style={{ position: 'relative', paddingLeft: 32 }}>
            <div style={{ position: 'absolute', left: 8, top: 8, bottom: 8, width: 1, background: 'linear-gradient(to bottom, rgba(192,0,26,0.6), rgba(255,255,255,0.04))' }} />

            {proximas.map((t, i) => {
              const info = tipoInfo(t.tipo)
              const Icon = info.icon
              const esHoyT = t.fecha === hoy
              const esMañana = t.fecha === toISO(addDays(new Date(), 1))
              const fechaObj = new Date(t.fecha + 'T00:00:00')
              const fechaLabel = esHoyT ? 'Hoy' : esMañana ? 'Mañana' : fechaObj.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
              const showFecha = i === 0 || proximas[i - 1].fecha !== t.fecha
              return (
                <div key={t.id} style={{ animation: `kzTimelineIn 0.45s cubic-bezier(0.22,1,0.36,1) ${i * 0.04}s both` }}>
                  {showFecha && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, marginTop: i > 0 ? 24 : 0 }}>
                      <div style={{ position: 'absolute', left: 3, width: 13, height: 13, borderRadius: '50%', background: esHoyT ? '#C0001A' : 'rgba(255,255,255,0.12)', border: `2px solid ${esHoyT ? '#ff4060' : 'rgba(255,255,255,0.18)'}`, boxShadow: esHoyT ? '0 0 12px rgba(192,0,26,0.6)' : 'none' }} />
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: esHoyT ? '#ff6070' : 'rgba(255,255,255,0.55)', textTransform: 'capitalize', letterSpacing: '0.02em' }}>{fechaLabel}</span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginLeft: 8 }}>
                          {proximas.filter(x => x.fecha === t.fecha).length} evento{proximas.filter(x => x.fecha === t.fecha).length > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="kz-timeline-item" style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 18px', borderRadius: 14, marginBottom: 8, background: 'rgba(255,255,255,0.025)', border: `1px solid ${info.color}22`, borderLeft: `3px solid ${info.color}` }}>
                    <div style={{ width: 36, height: 36, borderRadius: 11, background: `${info.color}18`, border: `1px solid ${info.color}38`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} color={info.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.88)', margin: '0 0 6px', lineHeight: 1.35, fontWeight: 500 }}>{t.titulo}</p>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, color: info.color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><Icon size={10} /> {info.label}</span>
                        {t.hora && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={10} /> {t.hora}</span>}
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)' }}>{new Date(t.fecha + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>
                    {t.hecha && <div style={{ width: 20, height: 20, borderRadius: 6, background: '#10B98122', border: '1px solid #10B98144', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={11} color="#10B981" /></div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function AgendaPage() {
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [loading, setLoading] = useState(true)
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()))
  const [composerDia, setComposerDia] = useState<string | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<string | null>(null)

  const load = useCallback(() => {
    fetch('/api/admin/tareas').then(r => r.json())
      .then(d => { setTareas(d.tareas ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])
  useEffect(() => { load() }, [load])
  useLiveRefresh(load)

  const hoyISO = toISO(new Date())
  const dias = [...Array(7)].map((_, i) => addDays(weekStart, i))

  async function crear(fecha: string, titulo: string, tipo: string, hora: string) {
    const tmp: Tarea = { id: 'tmp_' + Date.now(), titulo, fecha, hora, tipo, notas: '', hecha: false, creado: new Date().toISOString() }
    setTareas(t => [...t, tmp])
    const res = await fetch('/api/admin/tareas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ titulo, fecha, tipo, hora }) })
    const d = await res.json()
    setTareas(t => t.map(x => x.id === tmp.id ? d.tarea : x))
  }
  async function toggle(t: Tarea) {
    setTareas(ts => ts.map(x => x.id === t.id ? { ...x, hecha: !x.hecha } : x))
    await fetch('/api/admin/tareas', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: t.id, hecha: !t.hecha }) })
  }
  async function borrar(t: Tarea) {
    setTareas(ts => ts.filter(x => x.id !== t.id))
    await fetch('/api/admin/tareas', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: t.id }) })
  }
  async function editar(id: string, titulo: string, hora: string, tipo: string) {
    setTareas(ts => ts.map(x => x.id === id ? { ...x, titulo, hora, tipo } : x))
    await fetch('/api/admin/tareas', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, titulo, hora, tipo }) })
  }
  async function mover(id: string, fecha: string) {
    setTareas(ts => ts.map(x => x.id === id ? { ...x, fecha } : x))
    await fetch('/api/admin/tareas', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, fecha }) })
  }

  const rangoLabel = `${weekStart.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })} – ${addDays(weekStart, 6).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}`
  const totalSemana = tareas.filter(t => { const f = t.fecha; return f >= toISO(weekStart) && f <= toISO(addDays(weekStart, 6)) }).length

  return (
    <div style={{ padding: '44px 48px 100px' }}>
      <style>{`
        @keyframes kzFadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes kzFadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes kzPop      { from{opacity:0;transform:scale(0.93)} to{opacity:1;transform:scale(1)} }
        @keyframes kzSlideL   { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)} }
        @keyframes kzGlow     { 0%,100%{box-shadow:0 0 16px rgba(192,0,26,0.15)} 50%{box-shadow:0 0 32px rgba(192,0,26,0.32)} }
        @keyframes kzDotPulse { 0%,100%{transform:scale(1);opacity:0.8} 50%{transform:scale(1.5);opacity:1} }
        @keyframes kzBarSlide { from{transform:scaleX(0)} to{transform:scaleX(1)} }
        @keyframes kzTimelineIn { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }

        .kz-col-scroll::-webkit-scrollbar { width: 4px }
        .kz-col-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px }
        .kz-col-scroll::-webkit-scrollbar-track { background: transparent }

        .kz-day-col { transition: background 0.22s, border-color 0.22s, box-shadow 0.22s, transform 0.22s !important }
        .kz-day-col:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.25) !important }

        .kz-card { transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s, border-color 0.18s !important }
        .kz-card:hover { transform: translateY(-2px) scale(1.01); box-shadow: 0 6px 20px rgba(0,0,0,0.3) !important }

        .kz-cal-day { transition: background 0.15s, border-color 0.15s, transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s !important }
        .kz-cal-day:hover { transform: scale(1.06); z-index: 2; box-shadow: 0 4px 16px rgba(0,0,0,0.3) !important }

        .kz-timeline-item { transition: background 0.15s, transform 0.18s cubic-bezier(0.34,1.56,0.64,1) !important }
        .kz-timeline-item:hover { transform: translateX(4px); background: rgba(255,255,255,0.04) !important }

        .kz-nav-btn { transition: background 0.15s, color 0.15s, transform 0.12s !important }
        .kz-nav-btn:hover { background: rgba(255,255,255,0.07) !important; transform: scale(1.05) }
        .kz-nav-btn:active { transform: scale(0.96) }

        .kz-add-btn { transition: border-color 0.15s, color 0.15s, background 0.15s !important }
        .kz-header-in { animation: kzFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both }
        .kz-board-in  { animation: kzFadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both }
        .kz-cal-in    { animation: kzFadeUp 0.65s cubic-bezier(0.22,1,0.36,1) 0.18s both }
        .kz-tl-in     { animation: kzFadeUp 0.65s cubic-bezier(0.22,1,0.36,1) 0.28s both }

        .kz-hoy-badge { animation: kzGlow 2.5s ease-in-out infinite }
        .kz-dot-pulse { animation: kzDotPulse 2s ease-in-out infinite }
        .kz-bar { transform-origin: left; animation: kzBarSlide 0.5s cubic-bezier(0.22,1,0.36,1) both }
      `}</style>

      {/* Header */}
      <div className="kz-header-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 20 }}>
        <div>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>Agenda semanal</p>
          <h1 style={{ fontSize: 34, fontWeight: 400, color: '#fff', margin: 0, lineHeight: 1.05 }}>
            <span style={{ fontFamily: 'var(--font-serif-var), Cormorant Garamond, serif', fontWeight: 600, fontStyle: 'italic' }}>Tareas </span>
            <span style={{ fontFamily: 'var(--font-body-var), Space Grotesk, sans-serif', fontWeight: 300, letterSpacing: '-0.01em', color: 'rgba(255,255,255,0.6)' }}>de la semana</span>
          </h1>
        </div>
        {/* Nav semanas */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => setWeekStart(startOfWeek(new Date()))} style={navBtnStyle}>Hoy</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 4 }}>
            <button onClick={() => setWeekStart(w => addDays(w, -7))} style={iconNavStyle}><CaretLeft size={14} /></button>
            <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)', minWidth: 120, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{rangoLabel}</span>
            <button onClick={() => setWeekStart(w => addDays(w, 7))} style={iconNavStyle}><CaretRight size={14} /></button>
          </div>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{totalSemana} tarea{totalSemana !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Kanban */}
      <div className="kz-board-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(220px, 1fr))', gap: 14, overflowX: 'auto', paddingBottom: 8 }}>
        {dias.map((d, i) => {
          const iso = toISO(d)
          const esHoy = iso === hoyISO
          const dcol = DIA_COLOR[i]
          const delDia = tareas.filter(t => t.fecha === iso).sort((a, b) => (a.hora || '99').localeCompare(b.hora || '99'))
          const over = dragOver === iso
          return (
            <div key={iso} className="kz-day-col"
              onDragOver={e => { e.preventDefault(); setDragOver(iso) }}
              onDragLeave={() => setDragOver(o => o === iso ? null : o)}
              onDrop={() => { if (dragId) mover(dragId, iso); setDragId(null); setDragOver(null) }}
              style={{
                display: 'flex', flexDirection: 'column', minHeight: 240,
                background: over ? `${dcol}18` : esHoy ? 'rgba(192,0,26,0.025)' : 'rgba(255,255,255,0.015)',
                border: `1px solid ${over ? dcol + '80' : esHoy ? 'rgba(192,0,26,0.18)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 16, overflow: 'hidden',
                boxShadow: esHoy ? '0 0 18px rgba(192,0,26,0.07)' : 'none',
                animation: `kzFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 0.06}s both`,
              }}>
              {/* Barra color día */}
              <div className="kz-bar" style={{ height: 3, background: `linear-gradient(90deg, ${dcol}, ${dcol}60)`, opacity: esHoy ? 1 : 0.7, animationDelay: `${i * 0.06 + 0.2}s` }} />
              {/* Header día */}
              <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: dcol, background: `${dcol}18`, border: `1px solid ${dcol}35`, borderRadius: 7, padding: '3px 10px', letterSpacing: '0.03em' }}>{DIAS[i]}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {esHoy && <span className="kz-hoy-badge" style={{ fontSize: 9, color: '#ff6070', background: 'rgba(192,0,26,0.15)', border: '1px solid rgba(192,0,26,0.35)', borderRadius: 5, padding: '2px 6px', letterSpacing: '0.08em', fontWeight: 700 }}>HOY</span>}
                    <span style={{ fontSize: 15, color: esHoy ? '#fff' : 'rgba(255,255,255,0.4)', fontWeight: esHoy ? 700 : 400 }}>{d.getDate()}</span>
                  </div>
                </div>
                {delDia.length > 0 && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>{delDia.length} tarea{delDia.length !== 1 ? 's' : ''}</div>}
              </div>

              {/* Tareas */}
              <div className="kz-col-scroll" style={{ flex: 1, padding: 10, display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', maxHeight: 560 }}>
                {delDia.map(t => (
                  <TareaCard key={t.id} t={t} onToggle={toggle} onDelete={borrar} onEdit={editar}
                    onDragStart={() => setDragId(t.id)} onDragEnd={() => { setDragId(null); setDragOver(null) }} />
                ))}

                {composerDia === iso ? (
                  <Composer onCancel={() => setComposerDia(null)} onCreate={(titulo, tipo, hora) => { crear(iso, titulo, tipo, hora); setComposerDia(null) }} />
                ) : (
                  <button onClick={() => setComposerDia(iso)} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    padding: '8px', borderRadius: 8, border: '1px dashed rgba(255,255,255,0.1)',
                    background: 'transparent', color: 'rgba(255,255,255,0.3)', fontSize: 12, cursor: 'pointer',
                    fontFamily: 'inherit', transition: 'all 0.15s', marginTop: delDia.length ? 2 : 0,
                  }}
                    onMouseEnter={e => { const b = e.currentTarget; b.style.borderColor = 'rgba(192,0,26,0.3)'; b.style.color = 'rgba(255,255,255,0.6)' }}
                    onMouseLeave={e => { const b = e.currentTarget; b.style.borderColor = 'rgba(255,255,255,0.1)'; b.style.color = 'rgba(255,255,255,0.3)' }}
                  ><Plus size={12} /> Agregar</button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {loading && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 16 }}>Cargando tareas...</p>}

      {/* Leyenda */}
      <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
        {Object.entries(TIPOS).map(([k, v]) => {
          const Icon = v.icon
          return (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 18, height: 18, borderRadius: 5, background: `${v.color}1f`, border: `1px solid ${v.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={11} color={v.color} />
              </div>
              <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.4)' }}>{v.label}</span>
            </div>
          )
        })}
      </div>

      {/* Mini Calendario abajo */}
      <MiniCalendarioAgenda tareas={tareas} onSelectFecha={(fecha) => {
        const d = new Date(fecha + 'T00:00:00')
        setWeekStart(startOfWeek(d))
      }} />
    </div>
  )
}

function TareaCard({ t, onToggle, onDelete, onEdit, onDragStart, onDragEnd }: {
  t: Tarea; onToggle: (t: Tarea) => void; onDelete: (t: Tarea) => void
  onEdit: (id: string, titulo: string, hora: string, tipo: string) => void
  onDragStart: () => void; onDragEnd: () => void
}) {
  const info = tipoInfo(t.tipo)
  const Icon = info.icon
  const [hover, setHover] = useState(false)
  const [editing, setEditing] = useState(false)
  const [eTitulo, setETitulo] = useState(t.titulo)
  const [eHora, setEHora] = useState(t.hora)
  const [eTipo, setETipo] = useState(t.tipo)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  function saveEdit() {
    if (eTitulo.trim()) onEdit(t.id, eTitulo.trim(), eHora, eTipo)
    setEditing(false)
  }

  if (editing) return (
    <div style={{ padding: 9, borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(192,0,26,0.35)', animation: 'kzPop 0.15s ease' }}>
      <input ref={inputRef} value={eTitulo} onChange={e => setETitulo(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditing(false) }}
        style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '7px 9px', color: '#fff', fontSize: 12.5, outline: 'none', fontFamily: 'inherit', marginBottom: 8 }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
        {Object.entries(TIPOS).map(([k, v]) => {
          const TIcon = v.icon
          const sel = eTipo === k
          return (
            <button key={k} onClick={() => setETipo(k)} title={v.label} style={{
              width: 26, height: 26, borderRadius: 6, cursor: 'pointer',
              border: `1px solid ${sel ? v.color : 'rgba(255,255,255,0.1)'}`,
              background: sel ? `${v.color}22` : 'rgba(255,255,255,0.03)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><TIcon size={13} color={sel ? v.color : 'rgba(255,255,255,0.4)'} /></button>
          )
        })}
        <TimePicker value={eHora} onChange={setEHora} />
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={saveEdit} style={{ flex: 1, padding: '6px', borderRadius: 6, border: 'none', background: '#C0001A', color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><Check size={12} /> Guardar</button>
        <button onClick={() => setEditing(false)} style={{ width: 30, padding: '6px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></button>
      </div>
    </div>
  )

  return (
    <div draggable onDragStart={onDragStart} onDragEnd={onDragEnd}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      className="kz-card"
      style={{
        padding: '10px 11px', borderRadius: 10, cursor: 'grab',
        background: hover ? (t.hecha ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)') : t.hecha ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${t.hecha ? 'rgba(255,255,255,0.05)' : hover ? info.color + '55' : info.color + '2a'}`,
        borderLeft: `2px solid ${info.color}`,
        animation: 'kzPop 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        opacity: t.hecha ? 0.5 : 1,
        boxShadow: hover ? `0 4px 16px rgba(0,0,0,0.25), 0 0 10px ${info.color}15` : 'none',
      }}>
      {/* Fila superior: checkbox + título + botones */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
        <button onClick={() => onToggle(t)} title={t.hecha ? 'Reabrir' : 'Completar'} style={{
          width: 16, height: 16, borderRadius: 4, flexShrink: 0, marginTop: 2, cursor: 'pointer',
          border: `1.5px solid ${t.hecha ? info.color : 'rgba(255,255,255,0.25)'}`,
          background: t.hecha ? info.color : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
        }}>{t.hecha && <Check size={10} color="#fff" weight="bold" />}</button>

        <p style={{ flex: 1, fontSize: 12.5, color: t.hecha ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.45, textDecoration: t.hecha ? 'line-through' : 'none', wordBreak: 'break-word' }}>{t.titulo}</p>

        {/* Botones siempre reservados en espacio, solo visibles en hover */}
        <div style={{ display: 'flex', gap: 3, flexShrink: 0, opacity: hover ? 1 : 0, transition: 'opacity 0.15s' }}>
          <button onClick={() => setEditing(true)} title="Editar" style={{
            width: 20, height: 20, borderRadius: 5, border: 'none',
            background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}><PencilSimple size={11} /></button>
          <button onClick={() => onDelete(t)} title="Eliminar" style={{
            width: 20, height: 20, borderRadius: 5, border: 'none',
            background: 'rgba(192,0,26,0.15)', color: '#ff5e78',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}><Trash size={11} /></button>
        </div>
      </div>

      {/* Fila inferior: tipo + hora */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 6, paddingLeft: 23 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: info.color }}>
          <Icon size={11} /> {info.label}
        </span>
        {t.hora && <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 10, color: 'rgba(255,255,255,0.4)' }}><Clock size={10} /> {t.hora}</span>}
      </div>
    </div>
  )
}

function TimePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [h, setH] = useState(value ? value.split(':')[0] : '')
  const [m, setM] = useState(value ? value.split(':')[1] : '')
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function click(e: MouseEvent) {
      if (btnRef.current?.contains(e.target as Node)) return
      if (dropRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', click)
    return () => document.removeEventListener('mousedown', click)
  }, [])

  function toggle() {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setPos({ top: r.top - 10, left: r.left, width: r.width })
    }
    setOpen(o => !o)
  }

  function pick(hh: string, mm: string) {
    setH(hh); setM(mm)
    onChange(`${hh}:${mm}`)
    setOpen(false)
  }
  function clear() { setH(''); setM(''); onChange(''); setOpen(false) }

  const label = h && m ? `${h}:${m}` : null
  const HORAS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
  const MINUTOS = ['00', '15', '30', '45']

  const dropdown = open ? createPortal(
    <div ref={dropRef} style={{
      position: 'fixed',
      top: pos.top,
      left: pos.left,
      transform: 'translateY(-100%)',
      zIndex: 9999,
      background: '#1c1c1c',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 12,
      padding: 10,
      minWidth: Math.max(pos.width, 180),
      boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
      animation: 'kzPop 0.15s cubic-bezier(0.34,1.56,0.64,1)',
    }}>
      <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px 2px' }}>Seleccionar hora</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <div style={{ maxHeight: 140, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }} className="kz-col-scroll">
          {HORAS.map(hh => (
            <button key={hh} onClick={() => { setH(hh); if (m) pick(hh, m) }} style={{
              padding: '5px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', textAlign: 'center',
              fontSize: 12, fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums',
              background: h === hh ? 'rgba(192,0,26,0.25)' : 'transparent',
              color: h === hh ? '#ff8090' : 'rgba(255,255,255,0.55)',
              fontWeight: h === hh ? 700 : 400,
              transition: 'background 0.1s',
            }}>{hh}h</button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {MINUTOS.map(mm => (
            <button key={mm} onClick={() => { setM(mm); if (h) pick(h, mm) }} style={{
              padding: '7px 8px', borderRadius: 7, border: `1px solid ${m === mm ? 'rgba(192,0,26,0.5)' : 'rgba(255,255,255,0.07)'}`,
              cursor: 'pointer', textAlign: 'center', fontSize: 12, fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums',
              background: m === mm ? 'rgba(192,0,26,0.2)' : 'rgba(255,255,255,0.03)',
              color: m === mm ? '#ff8090' : 'rgba(255,255,255,0.55)',
              fontWeight: m === mm ? 700 : 400,
              transition: 'all 0.1s',
            }}>:{mm}</button>
          ))}
          {label && (
            <button onClick={clear} style={{
              padding: '5px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
              fontSize: 10, fontFamily: 'inherit', background: 'transparent', color: 'rgba(255,255,255,0.2)',
              marginTop: 4,
            }}>Quitar</button>
          )}
        </div>
      </div>
    </div>,
    document.body
  ) : null

  return (
    <div style={{ position: 'relative', flex: 1, minWidth: 70 }}>
      <button ref={btnRef} onClick={toggle} style={{
        width: '100%', height: 26, borderRadius: 6, border: `1px solid ${open ? 'rgba(192,0,26,0.5)' : 'rgba(255,255,255,0.1)'}`,
        background: open ? 'rgba(192,0,26,0.08)' : 'rgba(0,0,0,0.2)', color: label ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)',
        fontSize: 11.5, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
        transition: 'all 0.15s',
      }}>
        <Clock size={11} color={label ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)'} />
        {label ?? 'Hora'}
      </button>
      {dropdown}
    </div>
  )
}

function Composer({ onCreate, onCancel }: { onCreate: (titulo: string, tipo: string, hora: string) => void; onCancel: () => void }) {
  const [titulo, setTitulo] = useState('')
  const [tipo, setTipo] = useState('otro')
  const [hora, setHora] = useState('')
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => { ref.current?.focus() }, [])

  function submit() { if (titulo.trim()) onCreate(titulo.trim(), tipo, hora) }

  return (
    <div style={{ padding: 9, borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(192,0,26,0.3)', animation: 'kzPop 0.15s ease' }}>
      <input ref={ref} value={titulo} onChange={e => setTitulo(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') onCancel() }}
        placeholder="¿Qué hay que hacer?"
        style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '7px 9px', color: '#fff', fontSize: 12.5, outline: 'none', fontFamily: 'inherit' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, margin: '8px 0' }}>
        {Object.entries(TIPOS).map(([k, v]) => {
          const Icon = v.icon
          const sel = tipo === k
          return (
            <button key={k} onClick={() => setTipo(k)} title={v.label} style={{
              width: 26, height: 26, borderRadius: 6, cursor: 'pointer',
              border: `1px solid ${sel ? v.color : 'rgba(255,255,255,0.1)'}`,
              background: sel ? `${v.color}22` : 'rgba(255,255,255,0.03)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon size={13} color={sel ? v.color : 'rgba(255,255,255,0.4)'} /></button>
          )
        })}
        <TimePicker value={hora} onChange={setHora} />
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={submit} style={{ flex: 1, padding: '6px', borderRadius: 6, border: 'none', background: '#C0001A', color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><Check size={12} /> Agregar</button>
        <button onClick={onCancel} style={{ width: 30, padding: '6px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></button>
      </div>
    </div>
  )
}

const navBtnStyle: React.CSSProperties = {
  padding: '8px 14px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.6)', fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit',
}
const iconNavStyle: React.CSSProperties = {
  width: 28, height: 28, borderRadius: 7, border: 'none', background: 'transparent',
  color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
}
