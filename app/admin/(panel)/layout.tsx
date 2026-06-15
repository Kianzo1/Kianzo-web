'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState, useRef, useEffect, FormEvent } from 'react'
import { ChartBar, FolderOpen, FileText, FilePlus, SignOut, ArrowSquareOut, CheckSquare, Wallet, Briefcase, X, PaperPlaneTilt, Spinner, UsersThree, Wrench, CalendarBlank, Microphone, MicrophoneSlash, CurrencyDollar, Receipt, CaretDown, List, GearSix, Lightbulb } from '@phosphor-icons/react'
import TaskNotifier from './TaskNotifier'

type Msg = { role: 'user' | 'assistant'; content: string }
type BotData = { clientes: string[]; proyectos: string[]; gastos: string[]; categorias: string[] }

const CATEGORIAS_GASTO = ['Hosting','Software','Marketing','Herramientas','Servicios','Impuestos','Educación','Otro']
const SERVICIOS_PRESU  = ['Landing Page','Web Institucional','E-commerce','App Móvil','Mantenimiento','Diseño','Otro']
const MESES_SUGS       = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function buildSuggestions(q: string, data: BotData): string[] {
  if (!q.trim()) return []
  const ql = q.toLowerCase()
  const results: string[] = []

  // Comandos de gasto
  if ('gasto'.startsWith(ql) || ql.startsWith('gasto')) {
    data.gastos.slice(0, 4).forEach(g => {
      if (!q.toLowerCase().startsWith('gasto') || g.toLowerCase().includes(ql.replace('gasto','').trim()))
        results.push(`gasto ${g}`)
    })
    if (results.length === 0 && ql.startsWith('gasto')) {
      CATEGORIAS_GASTO.filter(c => c.toLowerCase().includes(ql.replace(/gasto\s*/,'').trim())).slice(0,3)
        .forEach(c => results.push(`gasto ... ${c.toLowerCase()}`))
    }
  }

  // Comandos de presupuesto
  if ('presupuesto'.startsWith(ql) || ql.startsWith('presu')) {
    data.clientes.slice(0, 4).forEach(c => {
      if (!ql.includes(' ') || c.toLowerCase().includes(ql.split(' ').slice(-1)[0]))
        results.push(`presupuesto ${c} landing page`)
    })
  }

  // Clientes mientras escribe nombre
  if (ql.length >= 2 && !ql.startsWith('gasto') && !ql.startsWith('presu')) {
    data.clientes.filter(c => c.toLowerCase().includes(ql)).slice(0,3)
      .forEach(c => results.push(`presupuesto ${c}`))
    data.proyectos.filter(p => p.toLowerCase().includes(ql)).slice(0,2)
      .forEach(p => results.push(`cerrar proyecto ${p}`))
  }

  // Consultas
  if ('cuánto gasté'.startsWith(ql) || ql.includes('gasté') || ql.includes('gaste')) {
    MESES_SUGS.slice(0,6).forEach(m => results.push(`cuánto gasté en ${m}`))
  }
  if ('proyectos'.startsWith(ql)) results.push('proyectos activos')
  if ('presupuestos'.startsWith(ql) || ql.includes('pendiente')) results.push('presupuestos pendientes')

  // Balance / finanzas
  if ('balance'.startsWith(ql) || ql.includes('plata') || ql.includes('gan') || ql.includes('balance')) {
    results.push('balance del mes')
  }
  // Seguimiento
  if ('seguimiento'.startsWith(ql) || ql.includes('follow') || ql.includes('seguir')) {
    results.push('presupuestos para seguir')
  }
  // Cliente
  if ('cliente'.startsWith(ql) || ql.startsWith('cliente')) {
    const resto = ql.replace(/cliente\s*/, '').trim()
    data.clientes.filter(c => !resto || c.toLowerCase().includes(resto)).slice(0, 4)
      .forEach(c => results.push(`cliente ${c}`))
  }
  // Editar / eliminar gasto
  if (ql.startsWith('subi') || ql.startsWith('cambia') || ql.startsWith('edita')) {
    data.gastos.slice(0, 3).forEach(g => results.push(`subí ${g.split(' ')[0]} a `))
  }
  if (ql.startsWith('borra') || ql.startsWith('elimina')) {
    data.gastos.slice(0, 3).forEach(g => results.push(`borrá gasto ${g.split(' ')[0]}`))
  }
  // Aprobar / cambiar estado presupuesto
  if (ql.startsWith('aproba') || ql.startsWith('cerra') || ql.startsWith('rechaza')) {
    data.clientes.slice(0, 3).forEach(c => results.push(`aprobá presupuesto de ${c}`))
  }
  // Tareas / agenda
  if (ql.startsWith('tarea') || ql.startsWith('agreg') || ql.startsWith('recorda') || ql.includes('agenda')) {
    results.push('agregá tarea llamar a un cliente mañana 10am')
    results.push('recordame reunión el viernes 16hs')
  }
  if (ql.includes('hoy') || ql.startsWith('que tengo') || ql.startsWith('qué tengo')) {
    results.push('qué tareas tengo hoy')
  }

  // Crear proyecto
  if (ql.startsWith('creá el proyecto') || ql.startsWith('crea el proyecto') || ql.startsWith('nuevo proyecto') || ql.startsWith('arrancamos')) {
    data.clientes.slice(0, 3).forEach(c => results.push(`creá el proyecto para ${c} `))
  }
  // Notas / ideas
  if (ql.startsWith('anota') || ql.startsWith('idea') || ql.startsWith('nota') || ql.includes('se me ocurre')) {
    results.push('anotá la idea de ')
    results.push('qué ideas tengo')
  }
  // Estado de proyecto / cobros
  if (ql.startsWith('mové') || ql.startsWith('move') || ql.startsWith('pasá') || ql.startsWith('pasa') || ql.includes('cobrado')) {
    data.proyectos.slice(0, 3).forEach(p => results.push(`marcá ${p} como cobrado`))
  }
  // Mantenimiento
  if (ql.startsWith('manteni') || ql.includes('mantenimiento')) {
    data.proyectos.slice(0, 2).forEach(p => results.push(`activá mantenimiento de ${p} a `))
  }
  // Configuración
  if (ql.startsWith('meta') || ql.includes('meta del mes') || ql.startsWith('config')) {
    results.push('poné la meta del mes en ')
  }
  if (ql.startsWith('cambiá mi nombre') || ql.startsWith('cambia mi nombre')) {
    results.push('cambiá mi nombre a ')
  }
  if (ql.startsWith('borra') || ql.startsWith('elimina')) {
    results.push('borrá todas las tareas')
    results.push('borrá las tareas de hoy')
  }

  // Categorías en contexto de gasto
  if (ql.startsWith('gasto')) {
    CATEGORIAS_GASTO.filter(c => c.toLowerCase().startsWith(ql.split(' ').slice(-1)[0])).slice(0,3)
      .forEach(c => results.push(`${q.split(' ').slice(0,-1).join(' ')} ${c}`))
  }

  return [...new Set(results)].slice(0, 6)
}

function BotWidget() {
  const [open, setOpen]         = useState(false)
  const [msgs, setMsgs]         = useState<Msg[]>([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [pulse, setPulse]       = useState(false)
  const [acIdx, setAcIdx]       = useState(-1)
  const [showAc, setShowAc]     = useState(false)
  const [data, setData]         = useState<BotData>({ clientes: [], proyectos: [], gastos: [], categorias: CATEGORIAS_GASTO })
  const [dataLoaded, setDataLoaded] = useState(false)
  const [micActive, setMicActive]   = useState(false)
  const [micError, setMicError]     = useState('')
  const recognitionRef              = useRef<any>(null)
  const bottomRef               = useRef<HTMLDivElement>(null)
  const inputRef                = useRef<HTMLInputElement>(null)

  // Cargar datos reales al abrir
  useEffect(() => {
    if (!open || dataLoaded) return
    Promise.all([
      fetch('/api/admin/presupuestos?tipo=activos').then(r => r.json()).catch(() => ({})),
      fetch('/api/admin/proyectos').then(r => r.json()).catch(() => ({})),
      fetch('/api/admin/gastos').then(r => r.json()).catch(() => ({})),
    ]).then(([pres, proy, gas]) => {
      const clientes = [...new Set<string>([
        ...(pres.presupuestos ?? []).map((p: any) => p.cliente).filter(Boolean),
        ...(proy.proyectos ?? []).map((p: any) => p.cliente).filter(Boolean),
      ])].slice(0, 20)
      const proyectos = (proy.proyectos ?? []).map((p: any) => p.nombre).filter(Boolean).slice(0, 20)
      const gastosNames = [...new Set<string>(
        (gas.gastos ?? []).map((g: any) => {
          const cat = g.categoria ? ` ${g.categoria.toLowerCase()}` : ''
          const monto = g.monto ? ` $${g.monto}` : ''
          const fijo = g.fijo ? ' fijo' : ''
          return `${g.nombre}${monto}${cat}${fijo}`
        })
      )].slice(0, 20)
      setData({ clientes, proyectos, gastos: gastosNames, categorias: CATEGORIAS_GASTO })
      setDataLoaded(true)
    })
  }, [open, dataLoaded])

  // Mostrar alertas proactivas al abrir el bot por primera vez
  useEffect(() => {
    if (!open || msgs.length > 0) return
    setLoading(true)
    fetch('/api/admin/bot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje: 'alertas', historial: [] }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.mensaje) setMsgs([{ role: 'assistant', content: d.mensaje }])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 150) }, [open])

  const suggestions = buildSuggestions(input, data)

  function selectSuggestion(s: string) {
    // Si termina en "..." no completar hasta el final
    const clean = s.replace(/ \.\.\..*$/, ' ')
    setInput(clean)
    setShowAc(false)
    setAcIdx(-1)
    inputRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showAc || suggestions.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setAcIdx(i => Math.min(i + 1, suggestions.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setAcIdx(i => Math.max(i - 1, -1)) }
    if (e.key === 'Tab' || (e.key === 'Enter' && acIdx >= 0)) {
      e.preventDefault()
      selectSuggestion(acIdx >= 0 ? suggestions[acIdx] : suggestions[0])
    }
    if (e.key === 'Escape') { setShowAc(false); setAcIdx(-1) }
  }

  function toggleMic() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) { setMicError('Tu navegador no soporta reconocimiento de voz'); return }

    if (micActive) {
      recognitionRef.current?.stop()
      setMicActive(false)
      return
    }

    const rec = new SpeechRecognition()
    rec.lang = 'es-AR'
    rec.continuous = false
    rec.interimResults = false
    recognitionRef.current = rec

    rec.onstart = () => { setMicActive(true); setMicError('') }
    rec.onresult = (e: any) => {
      const texto = e.results[0][0].transcript
      setInput(texto)
      setShowAc(true)
      setMicActive(false)
      inputRef.current?.focus()
    }
    rec.onerror = (e: any) => {
      setMicActive(false)
      const MENSAJES: Record<string, string> = {
        'not-allowed': 'Permití el micrófono: tocá el 🔒 en la barra de direcciones → Micrófono → Permitir, y recargá.',
        'service-not-allowed': 'El micrófono está bloqueado en el sistema. Habilitalo para el navegador en Configuración.',
        'audio-capture': 'No se detectó ningún micrófono conectado.',
        'network': 'Sin conexión para el reconocimiento de voz.',
      }
      if (e.error === 'no-speech') return
      setMicError(MENSAJES[e.error] ?? ('Error de micrófono: ' + e.error))
    }
    rec.onend = () => setMicActive(false)
    rec.start()
  }

  async function send(e: FormEvent) {
    e.preventDefault()
    const txt = input.trim()
    if (!txt || loading) return
    setInput(''); setShowAc(false); setAcIdx(-1)
    const newMsgs: Msg[] = [...msgs, { role: 'user', content: txt }]
    setMsgs(newMsgs)
    setLoading(true)
    const historial = msgs.map(m => ({ role: m.role, content: m.content }))
    try {
      const res = await fetch('/api/admin/bot', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: txt, historial }),
      })
      const d = await res.json()
      setMsgs([...newMsgs, { role: 'assistant', content: d.error ?? d.mensaje ?? 'Sin respuesta' }])
      if (!open) setPulse(true)
      // Refrescar datos si el bot hizo alguna acción (crear/editar/etc.)
      if (d.accion) {
        setDataLoaded(false)
        window.dispatchEvent(new Event('kz:refresh'))
      }
    } catch {
      setMsgs([...newMsgs, { role: 'assistant', content: 'Error de conexión.' }])
    }
    setLoading(false)
  }

  function renderMsg(text: string) {
    let html = text
      // negritas
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#fff;font-weight:600">$1</strong>')
      // itálicas con _texto_  (hints suaves)
      .replace(/_([^_\n]+)_/g, '<em style="color:rgba(255,255,255,0.42);font-style:italic">$1</em>')
      // montos: USD 200 · $100 · $12 → verde
      .replace(/(USD\s?\$?\d[\d.,]*|\$\d[\d.,]*)/g, '<span style="color:#34D399;font-weight:600">$1</span>')
    // check de confirmación al inicio de línea (✓ o ✅)
    html = html.replace(/(^|<br\/>)\s*(✓|✅)\s*/g, '$1<span class="kz-check">✓</span> ')
    // cruz de error/cancelado
    html = html.replace(/(^|<br\/>)\s*(✗|❌|⚠️?)\s*/g, '$1<span class="kz-xmark">!</span> ')
    // saltos de línea
    html = html.replace(/\n/g, '<br/>')
    return html
  }

  const hasUnread = pulse && !open

  // Ejemplos vacíos con datos reales
  const ejemplos = [
    data.gastos[0] ? `gasto ${data.gastos[0]}` : 'gasto Vercel $40 software fijo',
    'balance del mes',
    data.clientes[0] ? `cliente ${data.clientes[0]}` : 'cliente Juan',
    'presupuestos para seguir',
  ]

  return (
    <>
      <style>{`
        @keyframes kzBotIn { from{opacity:0;transform:translateY(16px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes kzPulse { 0%,100%{box-shadow:0 0 0 0 rgba(192,0,26,0.5)}60%{box-shadow:0 0 0 8px rgba(192,0,26,0)} }
        @keyframes kzDots  { 0%,80%,100%{opacity:0.2;transform:scale(0.8)}40%{opacity:1;transform:scale(1)} }
        @keyframes kzAcIn  { from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)} }
        @keyframes kzMicPulse { 0%,100%{box-shadow:0 0 0 0 rgba(192,0,26,0.6)}60%{box-shadow:0 0 0 8px rgba(192,0,26,0)} }
        .kz-bot-bubble { max-width:86%; padding:10px 14px; border-radius:14px; font-size:13px; line-height:1.58; word-break:break-word; animation:kzBubbleIn 0.3s cubic-bezier(0.32,0.72,0,1); }
        .kz-bot-user { background:linear-gradient(135deg,rgba(192,0,26,0.22),rgba(192,0,26,0.12)); border:1px solid rgba(192,0,26,0.28); color:#fff; align-self:flex-end; border-bottom-right-radius:4px; }
        .kz-bot-ai   { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); color:rgba(255,255,255,0.9); align-self:flex-start; border-bottom-left-radius:4px; }
        @keyframes kzBubbleIn { from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)} }
        .kz-check { display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; border-radius:50%; background:rgba(16,185,129,0.18); border:1px solid rgba(16,185,129,0.45); color:#34D399; font-size:11px; font-weight:800; margin-right:3px; vertical-align:-3px; box-shadow:0 0 10px rgba(16,185,129,0.25); animation:kzCheckPop 0.4s cubic-bezier(0.34,1.56,0.64,1); }
        .kz-xmark { display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; border-radius:50%; background:rgba(245,158,11,0.16); border:1px solid rgba(245,158,11,0.45); color:#F59E0B; font-size:11px; font-weight:800; margin-right:3px; vertical-align:-3px; animation:kzCheckPop 0.4s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes kzCheckPop { 0%{transform:scale(0) rotate(-30deg)} 60%{transform:scale(1.3) rotate(8deg)} 100%{transform:scale(1) rotate(0)} }
        @media (max-width: 860px) {
          .kz-bot-panel { left:12px !important; right:12px !important; width:auto !important; height:72dvh !important; bottom:80px !important; }
        }
        .kz-ac-item  { width:100%; text-align:left; padding:8px 12px; background:transparent; border:none; color:rgba(255,255,255,0.6); font-size:12.5px; font-family:inherit; cursor:pointer; transition:background 0.1s,color 0.1s; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .kz-ac-item:hover,.kz-ac-item.active { background:rgba(192,0,26,0.12); color:#fff; }
        .kz-ac-item .kz-ac-label { color:rgba(255,255,255,0.25); font-size:10px; margin-left:6px; }
      `}</style>

      {open && (
        <div className="kz-bot-panel" style={{ position:'fixed', bottom:88, right:24, width:460, height:600, background:'rgba(10,10,12,0.97)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:22, boxShadow:'0 40px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(192,0,26,0.12), inset 0 1px 0 rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', overflow:'hidden', zIndex:200, animation:'kzBotIn 0.28s cubic-bezier(0.32,0.72,0,1)', backdropFilter:'blur(24px)' }}>

          {/* Top glow bar */}
          <div style={{ height:2, background:'linear-gradient(90deg,transparent,#C0001A 30%,#ff3352 70%,transparent)', flexShrink:0 }} />

          {/* Header */}
          <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:12, flexShrink:0, background:'rgba(255,255,255,0.012)' }}>
            {/* Avatar doble-bezel */}
            <div style={{ padding:3, background:'rgba(192,0,26,0.12)', border:'1px solid rgba(192,0,26,0.22)', borderRadius:14, boxShadow:'0 0 20px rgba(192,0,26,0.18)' }}>
              <div style={{ width:40, height:40, borderRadius:11, background:'linear-gradient(135deg,#1E0005,#0A0002)', border:'1px solid rgba(192,0,26,0.35)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                <KianBotIcon size={28} />
              </div>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:0, lineHeight:1, letterSpacing:'0.01em' }}>Kian</p>
                <span style={{ fontSize:10, color:'rgba(192,0,26,0.9)', background:'rgba(192,0,26,0.12)', border:'1px solid rgba(192,0,26,0.3)', borderRadius:4, padding:'1px 5px', letterSpacing:'0.08em', fontWeight:600 }}>BOT</span>
              </div>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.28)', margin:'4px 0 0', display:'flex', alignItems:'center', gap:5 }}>
                <span style={{ width:5, height:5, borderRadius:'50%', background: dataLoaded ? '#10B981' : '#F59E0B', display:'inline-block', boxShadow: dataLoaded ? '0 0 5px #10B981' : '0 0 5px #F59E0B', flexShrink:0 }} />
                {dataLoaded ? `${data.clientes.length} clientes · ${data.proyectos.length} proyectos` : 'Sincronizando...'}
              </p>
            </div>
            <button onClick={() => setOpen(false)} style={{ width:28, height:28, borderRadius:7, border:'1px solid rgba(255,255,255,0.07)', background:'rgba(255,255,255,0.03)', color:'rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.65)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.03)'; (e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.3)' }}
            ><X size={13}/></button>
          </div>

          {/* Mensajes */}
          <div style={{ flex:1, overflowY:'auto', padding:'16px 14px', display:'flex', flexDirection:'column', gap:10 }}>
            {msgs.length === 0 && (
              <div style={{ padding:'12px 2px' }}>
                <div style={{ textAlign:'center', marginBottom:18, paddingTop:8 }}>
                  <div style={{ padding:4, background:'rgba(192,0,26,0.1)', border:'1px solid rgba(192,0,26,0.2)', borderRadius:20, margin:'0 auto 14px', width:'fit-content', boxShadow:'0 0 28px rgba(192,0,26,0.2)' }}>
                    <div style={{ width:56, height:56, borderRadius:16, background:'linear-gradient(135deg,#1E0005,#0A0002)', border:'1px solid rgba(192,0,26,0.35)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <KianBotIcon size={38} />
                    </div>
                  </div>
                  <p style={{ fontSize:14, color:'#fff', margin:'0 0 4px', fontWeight:600, letterSpacing:'0.01em' }}>Hola, soy <span style={{ color:'#C0001A' }}>Kian</span></p>
                  <p style={{ fontSize:11, color:'rgba(255,255,255,0.22)', margin:0, lineHeight:1.5 }}>Tu asistente interno — gastos, proyectos, alertas y más</p>
                </div>
                <p style={{ fontSize:10, color:'rgba(255,255,255,0.2)', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:8, paddingLeft:2 }}>Ejemplos rápidos</p>
                {ejemplos.map(e => (
                  <button key={e} onClick={() => { setInput(e); setTimeout(() => inputRef.current?.focus(), 50) }}
                    style={{ display:'block', width:'100%', textAlign:'left', padding:'10px 14px', margin:'5px 0', borderRadius:10, border:'1px solid rgba(255,255,255,0.07)', background:'rgba(255,255,255,0.025)', color:'rgba(255,255,255,0.45)', fontSize:13, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}
                    onMouseEnter={ev => { (ev.currentTarget as HTMLElement).style.borderColor='rgba(192,0,26,0.3)'; (ev.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.8)'; (ev.currentTarget as HTMLElement).style.background='rgba(192,0,26,0.07)' }}
                    onMouseLeave={ev => { (ev.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.07)'; (ev.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.45)'; (ev.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.025)' }}
                  >{e}</button>
                ))}
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={`kz-bot-bubble ${m.role === 'user' ? 'kz-bot-user' : 'kz-bot-ai'}`}
                dangerouslySetInnerHTML={{ __html: renderMsg(m.content) }} />
            ))}
            {loading && (
              <div className="kz-bot-bubble kz-bot-ai" style={{ display:'flex', gap:5, alignItems:'center', padding:'11px 16px' }}>
                {[0,1,2].map(i => <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:'rgba(255,255,255,0.35)', animation:`kzDots 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Autocomplete dropdown */}
          {showAc && suggestions.length > 0 && (
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', background:'rgba(20,20,20,0.98)', flexShrink:0, animation:'kzAcIn 0.15s ease', maxHeight:180, overflowY:'auto' }}>
              <p style={{ fontSize:10, color:'rgba(255,255,255,0.18)', letterSpacing:'0.1em', padding:'6px 12px 2px', margin:0 }}>SUGERENCIAS — Tab para completar</p>
              {suggestions.map((s, i) => {
                const parts = s.split(' ')
                const cmd = parts[0]
                const rest = parts.slice(1).join(' ')
                return (
                  <button key={s} className={`kz-ac-item${i === acIdx ? ' active' : ''}`}
                    onMouseDown={e => { e.preventDefault(); selectSuggestion(s) }}
                    onMouseEnter={() => setAcIdx(i)}>
                    <span style={{ color: cmd === 'gasto' ? '#F59E0B' : cmd === 'presupuesto' ? '#3B82F6' : cmd === 'cuánto' ? '#10B981' : 'rgba(255,255,255,0.5)', fontWeight:600 }}>{cmd}</span>
                    {rest && <span style={{ color:'rgba(255,255,255,0.55)', marginLeft:5 }}>{rest}</span>}
                  </button>
                )
              })}
            </div>
          )}

          {/* Input */}
          <div style={{ flexShrink:0, background:'rgba(0,0,0,0.2)', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
            {micError && (
              <p style={{ fontSize:11, color:'#EF4444', margin:0, padding:'6px 14px 0', display:'flex', alignItems:'center', gap:4 }}>
                <MicrophoneSlash size={12} /> {micError}
              </p>
            )}
            {micActive && (
              <p style={{ fontSize:11, color:'#C0001A', margin:0, padding:'6px 14px 0', display:'flex', alignItems:'center', gap:5 }}>
                <span style={{ width:7, height:7, borderRadius:'50%', background:'#C0001A', display:'inline-block', animation:'kzMicPulse 1s ease infinite' }} />
                Escuchando... hablá ahora
              </p>
            )}
            <form onSubmit={send} style={{ padding:'12px 14px', display:'flex', gap:8 }}>
              <div style={{ flex:1, position:'relative' }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => { setInput(e.target.value); setShowAc(true); setAcIdx(-1) }}
                  onFocus={() => setShowAc(true)}
                  onBlur={() => setTimeout(() => setShowAc(false), 150)}
                  onKeyDown={handleKeyDown}
                  placeholder={micActive ? 'Escuchando...' : 'Escribí o hablá...'}
                  disabled={loading}
                  style={{ width:'100%', background: micActive ? 'rgba(192,0,26,0.07)' : 'rgba(255,255,255,0.06)', border: micActive ? '1px solid rgba(192,0,26,0.4)' : '1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:'11px 16px', color:'#fff', fontSize:13.5, outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'all 0.2s', lineHeight:1.4 }}
                />
              </div>
              {/* Botón micrófono */}
              <button type="button" onClick={toggleMic} title={micActive ? 'Detener' : 'Hablar'}
                style={{ width:42, height:42, borderRadius:12, background: micActive ? 'rgba(192,0,26,0.2)' : 'rgba(255,255,255,0.05)', border: micActive ? '1px solid rgba(192,0,26,0.5)' : '1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0, transition:'all 0.2s', animation: micActive ? 'kzMicPulse 1s ease infinite' : 'none' }}>
                {micActive
                  ? <MicrophoneSlash size={17} color="#C0001A" weight="fill" />
                  : <Microphone size={17} color="rgba(255,255,255,0.45)" weight="regular" />}
              </button>
              {/* Botón enviar */}
              <button type="submit" disabled={loading || !input.trim()}
                style={{ width:42, height:42, borderRadius:12, background: input.trim() && !loading ? 'linear-gradient(135deg,#C0001A,#e5001f)' : 'rgba(255,255,255,0.05)', border: input.trim() && !loading ? 'none' : '1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s cubic-bezier(0.32,0.72,0,1)', cursor: input.trim() && !loading ? 'pointer' : 'default', flexShrink:0, boxShadow: input.trim() && !loading ? '0 4px 16px rgba(192,0,26,0.4)' : 'none' }}>
                {loading
                  ? <Spinner size={17} color="rgba(255,255,255,0.4)" style={{ animation:'kzSpin 0.8s linear infinite' }} />
                  : <PaperPlaneTilt size={17} color={input.trim() ? '#fff' : 'rgba(255,255,255,0.25)'} weight="fill" />}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => { setOpen(v => !v); setPulse(false) }}
        style={{ position:'fixed', bottom:24, right:24, width:54, height:54, borderRadius:16, background: open ? 'rgba(20,20,22,0.95)' : 'linear-gradient(135deg,#C0001A,#8A0012)', border: open ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(192,0,26,0.4)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow: open ? 'none' : '0 8px 32px rgba(192,0,26,0.55), inset 0 1px 0 rgba(255,255,255,0.1)', transition:'all 0.22s cubic-bezier(0.32,0.72,0,1)', zIndex:201, cursor:'pointer', animation: hasUnread ? 'kzPulse 1.5s ease infinite' : 'none' }}
      >
        {open
          ? <X size={18} color="rgba(255,255,255,0.6)"/>
          : <KianBotIcon size={32} />
        }
        {hasUnread && <div style={{ position:'absolute', top:9, right:9, width:9, height:9, borderRadius:'50%', background:'#ff3352', border:'2px solid #0D0D0D', boxShadow:'0 0 8px rgba(255,51,82,0.7)' }} />}
      </button>
    </>
  )
}

function KianBotIcon({ size = 22 }: { size?: number }) {
  const s = size
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="kbHelm" x1="20" y1="3" x2="20" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2A0008"/>
          <stop offset="100%" stopColor="#0D0002"/>
        </linearGradient>
        <linearGradient id="kbVisor" x1="8" y1="22" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1A0005"/>
          <stop offset="100%" stopColor="#080001"/>
        </linearGradient>
        <linearGradient id="kbCrest" x1="20" y1="2" x2="20" y2="11" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF2040"/>
          <stop offset="100%" stopColor="#C0001A"/>
        </linearGradient>
        <linearGradient id="kbHornL" x1="10" y1="14" x2="3" y2="1" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C0001A"/>
          <stop offset="100%" stopColor="#FF3355"/>
        </linearGradient>
        <linearGradient id="kbHornR" x1="30" y1="14" x2="37" y2="1" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C0001A"/>
          <stop offset="100%" stopColor="#FF3355"/>
        </linearGradient>
      </defs>

      {/* Glow ambiental */}
      <ellipse cx="20" cy="26" rx="14" ry="6" fill="rgba(192,0,26,0.12)"/>

      {/* Casco principal — cúpula kabuto */}
      <path d="M7 22 C7 13 12 5 20 5 C28 5 33 13 33 22 L33 25 L7 25 Z" fill="url(#kbHelm)" stroke="#C0001A" strokeWidth="1.2"/>

      {/* Shikoro — guardas laterales (cuelgan del casco) */}
      <path d="M7 22 L4 28 C4 29.1 4.9 30 6 30 L12 30 L12 25 Z" fill="url(#kbVisor)" stroke="#C0001A" strokeWidth="0.9" opacity="0.85"/>
      <path d="M33 22 L36 28 C36 29.1 35.1 30 34 30 L28 30 L28 25 Z" fill="url(#kbVisor)" stroke="#C0001A" strokeWidth="0.9" opacity="0.85"/>

      {/* Mengu — máscara / visor central */}
      <rect x="9" y="24" width="22" height="9" rx="3" fill="url(#kbVisor)" stroke="#C0001A" strokeWidth="1"/>

      {/* Dos ranuras de ojos separadas — estilo samurai */}
      <rect x="11" y="27" width="7" height="2" rx="1" fill="#C0001A" opacity="0.95"/>
      <rect x="22" y="27" width="7" height="2" rx="1" fill="#C0001A" opacity="0.95"/>
      {/* Brillo en cada ojo */}
      <rect x="11.5" y="27.2" width="2.5" height="0.9" rx="0.45" fill="rgba(255,120,120,0.65)"/>
      <rect x="22.5" y="27.2" width="2.5" height="0.9" rx="0.45" fill="rgba(255,120,120,0.65)"/>

      {/* Maedate — cresta/cuerno central */}
      <path d="M20 2 L22.5 10 L20 9 L17.5 10 Z" fill="url(#kbCrest)"/>
      <line x1="20" y1="2" x2="20" y2="10" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6"/>

      {/* Cuernos de dragón — largos, curvos, barridos hacia afuera y arriba */}
      {/* Cuerno izquierdo — barre hacia afuera y sube curvo a la punta */}
      <path d="M10 14 C5 13, 0 8, 3 1 C4 3, 7 6, 11 12 Z"
        fill="url(#kbHornL)"/>
      {/* Brillo izquierdo */}
      <path d="M9 13 C5 11, 2 7, 4 2" stroke="rgba(255,150,150,0.35)" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      {/* Cuerno derecho — espejo */}
      <path d="M30 14 C35 13, 40 8, 37 1 C36 3, 33 6, 29 12 Z"
        fill="url(#kbHornR)"/>
      {/* Brillo derecho */}
      <path d="M31 13 C35 11, 38 7, 36 2" stroke="rgba(255,150,150,0.35)" strokeWidth="0.8" fill="none" strokeLinecap="round"/>

      {/* Detalle linea superior del casco */}
      <path d="M10 18 Q20 14 30 18" stroke="rgba(192,0,26,0.4)" strokeWidth="0.8" fill="none"/>

      {/* Remaches decorativos */}
      <circle cx="20" cy="10" r="1.2" fill="#C0001A" opacity="0.6"/>
      <circle cx="14" cy="19" r="0.9" fill="rgba(192,0,26,0.45)"/>
      <circle cx="26" cy="19" r="0.9" fill="rgba(192,0,26,0.45)"/>
    </svg>
  )
}

function KianzoLogo({ size = 36 }: { size?: number }) {
  return <img src="/logo-kianzo.png" width={size} height={size} alt="Kianzo" style={{ objectFit: 'contain' }} />
}

type NavLeaf = { href: string; label: string; icon: any }
type NavGroup = { group: string; label: string; icon: any; children: NavLeaf[] }
type NavItem = NavLeaf | NavGroup
const isGroup = (n: NavItem): n is NavGroup => 'group' in n

const NAV: NavItem[] = [
  { href: '/admin/dashboard',           label: 'Dashboard',           icon: ChartBar },
  { href: '/admin/agenda',              label: 'Agenda',              icon: CalendarBlank },
  { href: '/admin/clientes',            label: 'Clientes',            icon: UsersThree },
  { href: '/admin/proyectos',           label: 'Proyectos',           icon: Briefcase },
  { href: '/admin/presupuestos',        label: 'Presupuestos',        icon: FileText },
  { href: '/admin/cerrar-presupuesto',  label: 'Cerrar presupuesto',  icon: CheckSquare },
  { href: '/admin/cerrar-proyecto',     label: 'Cerrar proyecto',     icon: FolderOpen },
  { href: '/admin/nuevo-presupuesto',   label: 'Nuevo presupuesto',   icon: FilePlus },
  { group: 'finanzas', label: 'Finanzas', icon: Wallet, children: [
    { href: '/admin/cobros',        label: 'Cobros',          icon: CurrencyDollar },
    { href: '/admin/gastos',        label: 'Gastos',          icon: Receipt },
    { href: '/admin/mantenimiento', label: 'Mantenimientos',  icon: Wrench },
  ] },
  { href: '/admin/notas',               label: 'Ideas & Notas',       icon: Lightbulb },
  { href: '/admin/configuracion',       label: 'Configuración',       icon: GearSix },
]

const NOTION_LINKS = [
  { label: 'Proyectos',    href: 'https://app.notion.com/p/365edc32ec368047aeb6f88a75a95b53' },
  { label: 'Presupuestos', href: 'https://app.notion.com/p/37bedc32ec3681d2be6dfe40431d96e6' },
  { label: 'Gastos',       href: 'https://app.notion.com/p/37fedc32ec368127b87bc30c5863f851' },
]

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  // Grupos abiertos — abre automáticamente el que contiene la ruta activa
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    NAV.forEach(n => { if (isGroup(n) && n.children.some(c => pathname === c.href)) init[n.group] = true })
    return init
  })
  useEffect(() => {
    NAV.forEach(n => {
      if (isGroup(n) && n.children.some(c => pathname === c.href)) {
        setOpenGroups(g => g[n.group] ? g : { ...g, [n.group]: true })
      }
    })
  }, [pathname])

  // Registrar service worker (PWA instalable)
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])

  // Drawer del sidebar en mobile
  const [navOpen, setNavOpen] = useState(false)
  useEffect(() => { setNavOpen(false) }, [pathname])

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0D0D0D', cursor: 'default', position: 'relative' }}>
      {/* Gradiente rojo muy sutil arriba a la derecha */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 80% 5%, rgba(192,0,26,0.09) 0%, transparent 100%)',
      }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 45% 45% at 10% 95%, rgba(192,0,26,0.055) 0%, transparent 100%)',
      }} />
      <style>{`
        * { cursor: default !important; }
        button, a { cursor: pointer !important; }
        input, textarea, select { cursor: text !important; }
        .kz-nav-item { display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:6px; font-size:15px; font-weight:400; color:rgba(255,255,255,0.5); text-decoration:none; transition:all 0.15s; letter-spacing:0.01em; position:relative; border-left:2px solid transparent; }
        .kz-nav-item:hover { color:rgba(255,255,255,0.85); background:rgba(255,255,255,0.04); }
        .kz-nav-item.active { color:#fff; background:rgba(192,0,26,0.08); border-left:2px solid #C0001A; padding-left:12px; }
        .kz-nav-item.active svg { color:#C0001A; }
        .kz-nav-sub { font-size:14px; padding:8px 14px; color:rgba(255,255,255,0.4); }
        .kz-sidebar { width:220px; min-height:100vh; border-right:1px solid transparent; border-image: linear-gradient(to bottom, transparent 0%, rgba(192,0,26,0.18) 30%, rgba(192,0,26,0.18) 70%, transparent 100%) 1; display:flex; flex-direction:column; padding:28px 16px; position:sticky; top:0; height:100vh; z-index:1; }
        .kz-main { flex:1; min-height:100vh; overflow-y:auto; position:relative; z-index:1; }
        .kz-notion-link { display:flex; align-items:center; gap:6px; font-size:14px; color:rgba(255,255,255,0.3); text-decoration:none; padding:5px 8px; border-radius:4px; transition:color 0.15s; }
        .kz-notion-link:hover { color:rgba(255,255,255,0.65); }
        .kz-logout { display:flex; align-items:center; gap:8px; font-size:14px; color:rgba(255,255,255,0.25); background:none; border:none; padding:8px 14px; border-radius:6px; width:100%; text-align:left; transition:all 0.15s; }
        .kz-logout:hover { color:rgba(192,0,26,0.8); background:rgba(192,0,26,0.08); }
        .kz-divider { height:1px; background: linear-gradient(90deg, transparent, rgba(192,0,26,0.25), transparent); margin:16px 0; }
        input:focus, textarea:focus, select:focus { border-color: rgba(192,0,26,0.6) !important; box-shadow: 0 0 0 3px rgba(192,0,26,0.08) !important; outline: none !important; }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        @keyframes kzSpin { to { transform: rotate(360deg) } }

        /* ── Mobile ── */
        .kz-mobile-topbar { display: none; }
        .kz-backdrop { display: none; }
        @media (max-width: 860px) {
          .kz-sidebar {
            position: fixed; top: 0; left: 0; height: 100dvh; width: 264px; max-width: 84vw;
            background: #0D0D0D; transform: translateX(-100%); transition: transform 0.26s cubic-bezier(0.32,0.72,0,1);
            z-index: 60; box-shadow: 0 0 60px rgba(0,0,0,0.6); padding-top: 24px;
          }
          .kz-sidebar.kz-open { transform: translateX(0); }
          .kz-mobile-topbar {
            display: flex; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 40;
            height: 56px; padding: 0 16px; background: rgba(13,13,13,0.92); backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(255,255,255,0.06);
          }
          .kz-backdrop {
            display: block; position: fixed; inset: 0; z-index: 55; background: rgba(0,0,0,0.55);
            backdrop-filter: blur(2px); animation: kzFadeBd 0.2s ease;
          }
          .kz-main > div { padding-left: 16px !important; padding-right: 16px !important; padding-top: 20px !important; }
        }
        @keyframes kzFadeBd { from { opacity: 0 } to { opacity: 1 } }
      `}</style>

      {/* Backdrop mobile */}
      {navOpen && <div className="kz-backdrop" onClick={() => setNavOpen(false)} />}

      <aside className={`kz-sidebar${navOpen ? ' kz-open' : ''}`}>
        <div style={{ marginBottom: 32 }}>
          <Link href="/admin/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <KianzoLogo size={38} />
            <div>
              <span style={{ fontFamily: 'var(--font-body-var), Space Grotesk, sans-serif', fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.22em', display: 'block', lineHeight: 1 }}>KIANZO</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginTop: 4 }}>Panel interno</span>
            </div>
          </Link>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          {NAV.map(item => {
            if (!isGroup(item)) {
              const { href, label, icon: Icon } = item
              return (
                <Link key={href} href={href} className={`kz-nav-item${pathname === href ? ' active' : ''}`}>
                  <Icon size={16} weight="regular" />
                  {label}
                </Link>
              )
            }
            // Grupo colapsable
            const { group, label, icon: Icon, children } = item
            const abierto = !!openGroups[group]
            const algunActivo = children.some(c => pathname === c.href)
            return (
              <div key={group}>
                <button
                  onClick={() => setOpenGroups(g => ({ ...g, [group]: !g[group] }))}
                  className={`kz-nav-item${algunActivo && !abierto ? ' active' : ''}`}
                  style={{ width: '100%', background: 'none', textAlign: 'left', justifyContent: 'space-between', fontFamily: 'inherit' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon size={16} weight="regular" />
                    {label}
                  </span>
                  <CaretDown size={13} weight="bold" style={{ transition: 'transform 0.2s', transform: abierto ? 'rotate(0deg)' : 'rotate(-90deg)', opacity: 0.5 }} />
                </button>
                <div style={{ display: 'grid', gridTemplateRows: abierto ? '1fr' : '0fr', transition: 'grid-template-rows 0.22s cubic-bezier(0.32,0.72,0,1)' }}>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 14, marginTop: 2 }}>
                      {children.map(({ href, label: clabel, icon: CIcon }) => (
                        <Link key={href} href={href} className={`kz-nav-item kz-nav-sub${pathname === href ? ' active' : ''}`}>
                          <CIcon size={15} weight="regular" />
                          {clabel}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          <div className="kz-divider" style={{ marginTop: 24 }} />

          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em', textTransform: 'uppercase', paddingLeft: 8, marginBottom: 4 }}>Notion</p>
          {NOTION_LINKS.map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="kz-notion-link">
              <ArrowSquareOut size={12} />
              {label}
            </a>
          ))}
        </nav>

        <button onClick={handleLogout} className="kz-logout">
          <SignOut size={14} />
          Cerrar sesión
        </button>
      </aside>

      <main className="kz-main">
        {/* Topbar mobile con hamburguesa */}
        <div className="kz-mobile-topbar">
          <button onClick={() => setNavOpen(true)} aria-label="Menú" style={{ width: 38, height: 38, borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <List size={18} />
          </button>
          <Link href="/admin/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <KianzoLogo size={26} />
            <span style={{ fontFamily: 'var(--font-body-var), Space Grotesk, sans-serif', fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.2em' }}>KIANZO</span>
          </Link>
        </div>
        {children}
      </main>

      <BotWidget />
      <TaskNotifier />
    </div>
  )
}
