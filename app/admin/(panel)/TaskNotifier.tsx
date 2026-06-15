'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { BellRinging, Bell, X, Check, SpeakerHigh, SpeakerSlash, CalendarBlank, GearSix, Clock, FileText, ArrowRight } from '@phosphor-icons/react'

type Tarea = { id: string; titulo: string; fecha: string; hora: string; tipo: string; hecha: boolean }
type Urgente = { proyecto: string; cliente: string; dias: number; monto: number | null }

const LEAD_OPCIONES = [5, 10, 15, 30]
const KEY_LEAD = 'kz_notif_lead'
const KEY_SOUND = 'kz_notif_sound'

// Avisa de tareas próximas mientras el panel esté abierto.
// - Resumen al entrar (tareas de hoy, con y sin hora).
// - Aviso previo configurable para tareas con hora (notificación del navegador + banner + sonido).
export default function TaskNotifier() {
  const avisadas = useRef<Set<string>>(new Set())
  const resumenMostrado = useRef(false)
  const [alerta, setAlerta] = useState<Tarea | null>(null)
  const [resumen, setResumen] = useState<{ conHora: Tarea[]; sinHora: Tarea[] } | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [tareasHoy, setTareasHoy] = useState<Tarea[]>([])
  const [urgentes, setUrgentes] = useState<Urgente[]>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [lead, setLead] = useState(10)
  const [sound, setSound] = useState(true)
  const [notifSistema, setNotifSistema] = useState(true)
  const [permiso, setPermiso] = useState<NotificationPermission>('default')

  // Cargar prefs
  useEffect(() => {
    const l = parseInt(localStorage.getItem(KEY_LEAD) ?? '10', 10)
    if (!isNaN(l)) setLead(l)
    setSound(localStorage.getItem(KEY_SOUND) !== '0')
    setNotifSistema(localStorage.getItem('kz_notif_sistema') !== '0')
    if (typeof Notification !== 'undefined') setPermiso(Notification.permission)
    try {
      const raw = localStorage.getItem('kz_notif_dismissed')
      if (raw) setDismissed(new Set(JSON.parse(raw)))
    } catch {}
  }, [])

  function persistDismissed(s: Set<string>) {
    localStorage.setItem('kz_notif_dismissed', JSON.stringify([...s]))
  }
  function descartar(key: string) {
    setDismissed(prev => { const n = new Set(prev); n.add(key); persistDismissed(n); return n })
  }
  function descartarTodo() {
    const keys = [...tareasHoy.map(t => `t:${t.id}`), ...urgentes.map(u => `p:${u.proyecto}|${u.cliente}`)]
    setDismissed(prev => { const n = new Set(prev); keys.forEach(k => n.add(k)); persistDismissed(n); return n })
  }

  function guardarLead(n: number) { setLead(n); localStorage.setItem(KEY_LEAD, String(n)) }
  function toggleSound() { setSound(s => { localStorage.setItem(KEY_SOUND, s ? '0' : '1'); return !s }) }

  function pedirPermiso() {
    if (typeof Notification === 'undefined') return
    Notification.requestPermission().then(p => {
      setPermiso(p)
    }).catch(() => {})
  }

  async function mostrarNotif(titulo: string, body: string, tag: string) {
    // Preferir service worker (funciona con panel minimizado)
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'KZ_NOTIFY', title: titulo, body, tag })
      return
    }
    // Fallback: Notification API directa
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try { new Notification(titulo, { body, tag, icon: '/logo-kianzo.png' }) } catch {}
    }
  }

  function beep() {
    if (!sound) return
    try {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext
      const ctx = new AC()
      const o = ctx.createOscillator(); const g = ctx.createGain()
      o.connect(g); g.connect(ctx.destination)
      o.type = 'sine'; o.frequency.value = 880
      g.gain.setValueAtTime(0.0001, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45)
      o.start(); o.stop(ctx.currentTime + 0.45)
    } catch {}
  }

  useEffect(() => {
    function hoyISO() {
      const n = new Date()
      return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`
    }
    function nowMins() { const n = new Date(); return n.getHours() * 60 + n.getMinutes() }

    async function check() {
      try {
        const d = await fetch('/api/admin/tareas').then(r => r.json())
        const tareas = (d.tareas ?? []) as Tarea[]
        const iso = hoyISO()
        const mins = nowMins()
        const deHoy = tareas.filter(t => !t.hecha && t.fecha === iso)
        setTareasHoy(deHoy.sort((a, b) => (a.hora || '99').localeCompare(b.hora || '99')))

        // Resumen al entrar (una vez)
        if (!resumenMostrado.current) {
          resumenMostrado.current = true
          const conHora = deHoy.filter(t => t.hora).sort((a, b) => a.hora.localeCompare(b.hora))
          const sinHora = deHoy.filter(t => !t.hora)
          if (conHora.length + sinHora.length > 0) {
            setResumen({ conHora, sinHora })
            setTimeout(() => setResumen(null), 14000)
          }
        }

        // Avisos previos para tareas con hora
        for (const t of deHoy) {
          if (!t.hora || avisadas.current.has(t.id)) continue
          const [h, m] = t.hora.split(':').map(Number)
          const diff = (h * 60 + m) - mins
          if (diff <= lead && diff >= -5) {
            avisadas.current.add(t.id)
            const cuerpo = diff <= 0 ? '¡Es ahora!' : `En ${diff} min · ${t.hora}`
            if (notifSistema && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
              mostrarNotif('📋 ' + t.titulo, cuerpo, t.id)
            }
            beep()
            setAlerta(t)
            setTimeout(() => setAlerta(b => (b?.id === t.id ? null : b)), 12000)
          }
        }
      } catch {}
    }

    check()
    const iv = setInterval(check, 60000)
    return () => clearInterval(iv)
  }, [lead, sound])

  // Presupuestos urgentes (sin respuesta >7 días) — para el panel de la campana
  useEffect(() => {
    async function loadUrgentes() {
      try {
        const d = await fetch('/api/admin/presupuestos?tipo=activos').then(r => r.json())
        const lista = (d.presupuestos ?? []) as { proyecto: string; cliente: string; monto: number | null; creado: string }[]
        const u = lista
          .map(p => ({ proyecto: p.proyecto, cliente: p.cliente, monto: p.monto, dias: Math.floor((Date.now() - new Date(p.creado).getTime()) / 86400000) }))
          .filter(p => p.dias >= 7)
          .sort((a, b) => b.dias - a.dias)
        setUrgentes(u)
      } catch {}
    }
    loadUrgentes()
    const iv = setInterval(loadUrgentes, 300000) // cada 5 min
    return () => clearInterval(iv)
  }, [])

  const tareasVisibles = tareasHoy.filter(t => !dismissed.has(`t:${t.id}`))
  const urgentesVisibles = urgentes.filter(u => !dismissed.has(`p:${u.proyecto}|${u.cliente}`))
  const totalNotif = tareasVisibles.length + urgentesVisibles.length

  return (
    <>
      <style>{`
        @keyframes kzNotifIn{from{opacity:0;transform:translate(-50%,12px)}to{opacity:1;transform:translate(-50%,0)}}
        @keyframes kzPopIn{from{opacity:0;transform:translateY(8px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes kzBadgePop{from{opacity:0;transform:scale(0)}to{opacity:1;transform:scale(1)}}
        .kz-notif-x{opacity:0;transition:opacity 0.15s}
        .kz-notif-row:hover .kz-notif-x{opacity:1}
      `}</style>

      {/* Botón campana + settings (izquierda, sobre "Cerrar sesión") */}
      <div style={{ position: 'fixed', bottom: 96, left: 20, zIndex: 290 }}>
        {/* Panel de contenido — tareas de hoy + presupuestos urgentes */}
        {panelOpen && !settingsOpen && (
          <div style={{ position: 'absolute', bottom: 52, left: 0, width: 300, background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.6)', animation: 'kzPopIn 0.18s cubic-bezier(0.32,0.72,0,1)' }}>
            <div style={{ height: 3, background: 'linear-gradient(90deg, #C0001A, #ff3352)' }} />
            <div style={{ padding: '16px 16px 14px' }}>
              {/* Header con gear */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 13, color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Bell size={15} color="#C0001A" weight="fill" /> Notificaciones
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setSettingsOpen(true)} title="Configurar" style={{ width: 26, height: 26, borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><GearSix size={14} /></button>
                  <button onClick={() => setPanelOpen(false)} style={{ width: 26, height: 26, borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={13} /></button>
                </div>
              </div>

              {totalNotif === 0 ? (
                <div style={{ padding: '20px 0 12px', textAlign: 'center' }}>
                  <Check size={26} color="rgba(16,185,129,0.6)" weight="bold" />
                  <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)', margin: '8px 0 0' }}>Todo al día 🎉</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 360, overflowY: 'auto' }}>
                  {/* Tareas de hoy */}
                  {tareasVisibles.length > 0 && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <CalendarBlank size={12} color="#C0001A" /> Hoy · {tareasVisibles.length}
                        </span>
                        <Link href="/admin/agenda" onClick={() => setPanelOpen(false)} style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>Agenda <ArrowRight size={10} /></Link>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {tareasVisibles.slice(0, 5).map(t => (
                          <div key={t.id} className="kz-notif-row" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 9px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#C0001A', flexShrink: 0 }} />
                            <span style={{ flex: 1, fontSize: 12.5, color: 'rgba(255,255,255,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.titulo}</span>
                            {t.hora && <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}><Clock size={10} /> {t.hora}</span>}
                            <button onClick={() => descartar(`t:${t.id}`)} title="Descartar" className="kz-notif-x" style={{ width: 18, height: 18, borderRadius: 5, border: 'none', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}><X size={10} /></button>
                          </div>
                        ))}
                        {tareasVisibles.length > 5 && <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.3)', paddingLeft: 4 }}>+{tareasVisibles.length - 5} más</span>}
                      </div>
                    </div>
                  )}

                  {/* Presupuestos urgentes */}
                  {urgentesVisibles.length > 0 && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 10, color: 'rgba(245,158,11,0.8)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <FileText size={12} color="#F59E0B" /> Sin respuesta · {urgentesVisibles.length}
                        </span>
                        <Link href="/admin/presupuestos" onClick={() => setPanelOpen(false)} style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>Ver <ArrowRight size={10} /></Link>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {urgentesVisibles.slice(0, 5).map((u, i) => (
                          <div key={i} className="kz-notif-row" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 9px', borderRadius: 8, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
                            <span style={{ flex: 1, minWidth: 0 }}>
                              <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.8)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.proyecto}</span>
                              {u.cliente && <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.3)' }}>{u.cliente}</span>}
                            </span>
                            <span style={{ fontSize: 10, color: '#F59E0B', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 5, padding: '2px 7px', whiteSpace: 'nowrap', flexShrink: 0 }}>{u.dias}d</span>
                            <button onClick={() => descartar(`p:${u.proyecto}|${u.cliente}`)} title="Descartar" className="kz-notif-x" style={{ width: 18, height: 18, borderRadius: 5, border: 'none', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}><X size={10} /></button>
                          </div>
                        ))}
                        {urgentesVisibles.length > 5 && <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.3)', paddingLeft: 4 }}>+{urgentesVisibles.length - 5} más</span>}
                      </div>
                    </div>
                  )}

                  {/* Limpiar todo */}
                  <button onClick={descartarTodo} style={{ marginTop: 2, padding: '9px 0', borderRadius: 9, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'all 0.15s' }}
                    onMouseEnter={e => { const b = e.currentTarget; b.style.background = 'rgba(192,0,26,0.1)'; b.style.color = '#ff5577'; b.style.borderColor = 'rgba(192,0,26,0.25)' }}
                    onMouseLeave={e => { const b = e.currentTarget; b.style.background = 'rgba(255,255,255,0.03)'; b.style.color = 'rgba(255,255,255,0.5)'; b.style.borderColor = 'rgba(255,255,255,0.08)' }}>
                    <Check size={13} weight="bold" /> Marcar todas como vistas
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {settingsOpen && (
          <div style={{ position: 'absolute', bottom: 52, left: 0, width: 268, background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '18px 18px 16px', boxShadow: '0 24px 60px rgba(0,0,0,0.6)', animation: 'kzPopIn 0.18s cubic-bezier(0.32,0.72,0,1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>Notificaciones</span>
              <button onClick={() => setSettingsOpen(false)} style={{ width: 24, height: 24, borderRadius: 6, border: 'none', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={13} /></button>
            </div>

            {/* Antelación */}
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>Avisar antes</p>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {LEAD_OPCIONES.map(n => (
                <button key={n} onClick={() => guardarLead(n)} style={{
                  flex: 1, padding: '7px 0', borderRadius: 8, fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
                  border: lead === n ? '1px solid rgba(192,0,26,0.5)' : '1px solid rgba(255,255,255,0.08)',
                  background: lead === n ? 'rgba(192,0,26,0.14)' : 'rgba(255,255,255,0.03)',
                  color: lead === n ? '#fff' : 'rgba(255,255,255,0.45)',
                }}>{n}m</button>
              ))}
            </div>

            {/* Sonido */}
            <button onClick={toggleSound} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.7)', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', marginBottom: 10 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {sound ? <SpeakerHigh size={15} /> : <SpeakerSlash size={15} />} Sonido
              </span>
              <span style={{ width: 34, height: 18, borderRadius: 99, background: sound ? '#C0001A' : 'rgba(255,255,255,0.12)', position: 'relative', transition: 'background 0.2s' }}>
                <span style={{ position: 'absolute', top: 2, left: sound ? 18 : 2, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
              </span>
            </button>

            {/* Toggle notif sistema */}
            <button onClick={() => { setNotifSistema(s => { localStorage.setItem('kz_notif_sistema', s ? '0' : '1'); return !s }) }} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.7)', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', marginBottom: 10 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                🔔 Avisos del sistema
              </span>
              <span style={{ width: 34, height: 18, borderRadius: 99, background: notifSistema ? '#C0001A' : 'rgba(255,255,255,0.12)', position: 'relative', transition: 'background 0.2s' }}>
                <span style={{ position: 'absolute', top: 2, left: notifSistema ? 18 : 2, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
              </span>
            </button>

            {/* Permiso navegador */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, marginTop: 4 }}>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>Avisos del sistema</p>
              {permiso === 'granted' ? (
                <p style={{ fontSize: 12, color: 'rgba(16,185,129,0.9)', margin: 0, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 0' }}>
                  <Check size={13} weight="bold" /> Activo — te avisamos aunque estés en otra pestaña
                </p>
              ) : permiso === 'denied' ? (
                <p style={{ fontSize: 11, color: 'rgba(255,90,90,0.8)', margin: 0, lineHeight: 1.5 }}>
                  Bloqueado en el navegador. Tocá el 🔒 en la barra → Notificaciones → Permitir, y recargá.
                </p>
              ) : (
                <button onClick={pedirPermiso} style={{ width: '100%', padding: '10px', borderRadius: 9, border: '1px solid rgba(192,0,26,0.35)', background: 'rgba(192,0,26,0.12)', color: '#ff8090', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', fontWeight: 500 }}>
                  Activar avisos fuera del panel
                </button>
              )}
            </div>
          </div>
        )}
        <button onClick={() => { setPanelOpen(o => !o); setSettingsOpen(false) }} title="Notificaciones" style={{
          position: 'relative',
          width: 42, height: 42, borderRadius: '50%',
          border: `1px solid ${totalNotif > 0 ? 'rgba(192,0,26,0.4)' : 'rgba(255,255,255,0.1)'}`,
          background: 'rgba(20,20,20,0.9)', backdropFilter: 'blur(10px)',
          color: totalNotif > 0 ? '#ff5577' : 'rgba(255,255,255,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          boxShadow: totalNotif > 0 ? '0 8px 24px rgba(192,0,26,0.25)' : '0 8px 24px rgba(0,0,0,0.4)',
          transition: 'all 0.2s',
        }}>
          <Bell size={18} weight={(panelOpen || totalNotif > 0) ? 'fill' : 'regular'} />
          {totalNotif > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, padding: '0 5px',
              borderRadius: 9, background: '#C0001A', color: '#fff', fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #0a0a0a', boxShadow: '0 0 8px rgba(192,0,26,0.6)',
              animation: 'kzBadgePop 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            }}>{totalNotif > 9 ? '9+' : totalNotif}</span>
          )}
        </button>
      </div>

      {/* Resumen al entrar */}
      {resumen && (
        <div style={{ position: 'fixed', bottom: 88, left: '50%', transform: 'translateX(-50%)', zIndex: 300, animation: 'kzNotifIn 0.3s cubic-bezier(0.32,0.72,0,1)' }}>
          <div style={{ width: 320, maxWidth: '90vw', background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>
            <div style={{ height: 3, background: 'linear-gradient(90deg, #C0001A, #ff3352)' }} />
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#fff', fontWeight: 600 }}>
                  <CalendarBlank size={15} color="#C0001A" weight="fill" />
                  {resumen.conHora.length + resumen.sinHora.length} tarea{resumen.conHora.length + resumen.sinHora.length !== 1 ? 's' : ''} para hoy
                </span>
                <button onClick={() => setResumen(null)} style={{ width: 22, height: 22, borderRadius: 6, border: 'none', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={12} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[...resumen.conHora, ...resumen.sinHora].slice(0, 4).map(t => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#C0001A', flexShrink: 0 }} />
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.titulo}</span>
                    {t.hora && <span style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>{t.hora}</span>}
                  </div>
                ))}
                {(resumen.conHora.length + resumen.sinHora.length) > 4 && (
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', paddingLeft: 13 }}>+{resumen.conHora.length + resumen.sinHora.length - 4} más</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerta previa de tarea */}
      {alerta && (
        <div style={{ position: 'fixed', bottom: 88, left: '50%', transform: 'translateX(-50%)', zIndex: 301, animation: 'kzNotifIn 0.3s cubic-bezier(0.32,0.72,0,1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#141414', border: '1px solid rgba(192,0,26,0.35)', borderRadius: 12, padding: '12px 16px', boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset', minWidth: 280 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(192,0,26,0.12)', border: '1px solid rgba(192,0,26,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BellRinging size={17} color="#C0001A" weight="fill" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, color: '#fff', margin: 0, fontWeight: 500 }}>{alerta.titulo}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>Tarea a las {alerta.hora}</p>
            </div>
            <button onClick={() => setAlerta(null)} style={{ width: 24, height: 24, borderRadius: 6, border: 'none', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}><X size={13} /></button>
          </div>
        </div>
      )}
    </>
  )
}
