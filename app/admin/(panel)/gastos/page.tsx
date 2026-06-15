'use client'

import { useState, useEffect, useRef, useCallback, FormEvent } from 'react'
import { Plus, CheckCircle, Warning, X, TrendUp, TrendDown, CurrencyDollar, Trash, PencilSimple } from '@phosphor-icons/react'
import { useLiveRefresh } from '@/lib/useLiveRefresh'
import CustomSelect from '@/app/admin/components/CustomSelect'

type Gasto = {
  id: string; nombre: string; monto: number | null
  categoria: string; mes: string; fijo: boolean; notas: string; fecha: string
}

const CATEGORIAS = ['Hosting', 'Software', 'Marketing', 'Herramientas', 'Servicios', 'Impuestos', 'Educación', 'Otro']
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const MES_ACTUAL = MESES[new Date().getMonth()]

const CAT_COLOR: Record<string, string> = {
  'Hosting':      '#3B82F6',
  'Software':     '#8B5CF6',
  'Marketing':    '#F59E0B',
  'Herramientas': '#10B981',
  'Servicios':    '#06B6D4',
  'Impuestos':    '#EF4444',
  'Educación':    '#EC4899',
  'Otro':         '#6B7280',
}

const inp = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none',
  width: '100%', boxSizing: 'border-box' as const, fontFamily: 'inherit',
}
const lbl = { fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }

// ─── Contador animado ────────────────────────────────────────────────
function AnimatedNumber({ value, prefix = '' }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number>(0)
  useEffect(() => {
    const start = Date.now()
    const duration = 900
    const from = display
    function tick() {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(from + (value - from) * ease))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value])
  return <>{prefix}{display >= 1000 ? `${(display/1000).toFixed(1)}k` : display}</>
}

// ─── Dona SVG animada con hover tooltip ────────────────────────────
function DonutChart({ segments, total }: {
  segments: { name: string; value: number; color: string }[]
  total: number
}) {
  const r = 54, cx = 70, cy = 70, stroke = 14
  const circ = 2 * Math.PI * r
  const [mounted, setMounted] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t) }, [])

  const gaps = segments.length > 1 ? segments.length * 2.5 : 0
  const usable = circ - gaps
  const segData: { dasharray: string; rot: number; len: number }[] = []
  let offset = 0
  segments.forEach(s => {
    const pct = total > 0 ? s.value / total : 0
    const len = pct * usable
    segData.push({ dasharray: `${len} ${circ - len}`, rot: -90 + (offset / circ) * 360, len })
    offset += len + (segments.length > 1 ? 2.5 : 0)
  })

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const hSeg = hovered !== null ? segments[hovered] : null

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef} width={140} height={140} viewBox="0 0 140 140"
        onMouseMove={handleMouseMove} onMouseLeave={() => { setHovered(null); setTooltip(null) }}>
        <defs>
          <filter id="glow-strong"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="glow-soft"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>

        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={stroke} />

        {/* Segmentos */}
        {segments.map((s, i) => {
          const { dasharray, rot, len } = segData[i]
          const isHov = hovered === i
          const isDim = hovered !== null && !isHov
          const sw = isHov ? stroke + 3 : stroke
          // animación: empieza oculto y revela con transición delayed
          const animDelay = `${i * 120}ms`
          const dashoffset = mounted ? 0 : len
          return (
            <circle key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={sw}
              strokeDasharray={dasharray}
              strokeDashoffset={dashoffset}
              strokeLinecap="round"
              transform={`rotate(${rot} ${cx} ${cy})`}
              style={{
                filter: isHov ? `drop-shadow(0 0 8px ${s.color}) drop-shadow(0 0 16px ${s.color}88)` : `drop-shadow(0 0 3px ${s.color}66)`,
                opacity: isDim ? 0.2 : 1,
                transition: `stroke-dashoffset 0.9s cubic-bezier(0.32,0.72,0,1) ${animDelay}, opacity 0.2s ease, stroke-width 0.15s ease, filter 0.2s ease`,
              }}
              onMouseEnter={() => setHovered(i)}
            />
          )
        })}

        {/* Halo del segmento hover */}
        {hovered !== null && (() => {
          const { dasharray, rot } = segData[hovered]
          return (
            <circle cx={cx} cy={cy} r={r} fill="none"
              stroke={segments[hovered].color} strokeWidth={stroke + 8}
              strokeDasharray={dasharray} strokeDashoffset={0}
              strokeLinecap="round"
              transform={`rotate(${rot} ${cx} ${cy})`}
              style={{ opacity: 0.08, pointerEvents: 'none' }}
            />
          )
        })()}

        {/* Centro */}
        <text x={cx} y={cy - 10} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="8.5" letterSpacing="1.8" style={{ textTransform: 'uppercase' }}>
          {hSeg ? hSeg.name.toUpperCase() : 'TOTAL'}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill={hSeg ? hSeg.color : 'white'} fontSize={hSeg ? '13' : '15'} fontWeight="700"
          style={{ transition: 'fill 0.2s', filter: hSeg ? `drop-shadow(0 0 6px ${hSeg.color}88)` : 'none' }}>
          {hSeg ? `$${hSeg.value}` : `$${total}`}
        </text>
        {hSeg && (
          <text x={cx} y={cy + 22} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10">
            {((hSeg.value / total) * 100).toFixed(0)}%
          </text>
        )}
      </svg>
    </div>
  )
}

// ─── Sparkline con hover crosshair + tooltip ──────────────────────
function SparkLine({ data, color = '#C0001A', height = 80, id = 'sl' }: {
  data: { label: string; value: number }[]
  color?: string; height?: number; id?: string
}) {
  const W = 780, H = height
  const [mouseX, setMouseX] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const pathRef = useRef<SVGPathElement>(null)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 100); return () => clearTimeout(t) }, [])

  if (data.length < 2) return null
  const max = Math.max(...data.map(d => d.value), 1)
  const pts = data.map((d, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - (d.value / max) * (H - 12) - 2,
    label: d.label, value: d.value,
  }))

  // Smooth curve with cubic bezier
  function smoothPath(points: typeof pts) {
    if (points.length < 2) return ''
    let d = `M${points[0].x},${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1], p1 = points[i]
      const cpx = (p0.x + p1.x) / 2
      d += ` C${cpx},${p0.y} ${cpx},${p1.y} ${p1.x},${p1.y}`
    }
    return d
  }

  const line = smoothPath(pts)
  const area = `${line} L${pts[pts.length-1].x},${H} L${pts[0].x},${H} Z`

  // Closest point to mouse
  let hovIdx: number | null = null
  if (mouseX !== null) {
    let minDist = Infinity
    pts.forEach((p, i) => { const d = Math.abs(p.x - mouseX); if (d < minDist) { minDist = d; hovIdx = i } })
  }
  const hovPt = hovIdx !== null ? pts[hovIdx] : null

  const gradId = `areaGrad_${id}`
  const pathLen = pathRef.current?.getTotalLength() ?? 1200

  return (
    <svg viewBox={`0 0 ${W} ${H + 22}`} width="100%" height={H + 22} preserveAspectRatio="none"
      style={{ overflow: 'visible', cursor: 'crosshair' }}
      onMouseMove={e => {
        const rect = e.currentTarget.getBoundingClientRect()
        const pct = (e.clientX - rect.left) / rect.width
        setMouseX(pct * W)
      }}
      onMouseLeave={() => setMouseX(null)}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <style>{`
          @keyframes drawLine_${id} { from { stroke-dashoffset: ${pathLen}px } to { stroke-dashoffset: 0px } }
        `}</style>
      </defs>

      {/* Grid */}
      {[0.25, 0.5, 0.75].map(t => (
        <line key={t} x1={0} y1={H - t*(H-12)-2} x2={W} y2={H - t*(H-12)-2}
          stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
      ))}

      {/* Área */}
      <path d={area} fill={`url(#${gradId})`} style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.8s ease 0.3s' }} />

      {/* Línea animada */}
      <path ref={pathRef} d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        style={{
          filter: `drop-shadow(0 0 6px ${color}99)`,
          strokeDasharray: `${pathLen}px`,
          strokeDashoffset: mounted ? '0px' : `${pathLen}px`,
          transition: mounted ? `stroke-dashoffset 1.1s cubic-bezier(0.32,0.72,0,1)` : 'none',
        }} />

      {/* Puntos */}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={hovIdx === i ? 5 : 3}
          fill={color} style={{ filter: `drop-shadow(0 0 ${hovIdx === i ? 8 : 4}px ${color})`, transition: 'r 0.15s, filter 0.15s', opacity: mounted ? 1 : 0 }} />
      ))}

      {/* Crosshair + tooltip */}
      {hovPt && (
        <>
          <line x1={hovPt.x} y1={0} x2={hovPt.x} y2={H}
            stroke={color} strokeWidth="1" strokeOpacity="0.25" strokeDasharray="4 3" />
          <circle cx={hovPt.x} cy={hovPt.y} r={6} fill={color} style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
          <circle cx={hovPt.x} cy={hovPt.y} r={10} fill={color} fillOpacity="0.15" />
          {/* Tooltip */}
          <g transform={`translate(${Math.min(Math.max(hovPt.x - 34, 0), W - 70)}, ${hovPt.y > H/2 ? hovPt.y - 42 : hovPt.y + 10})`}>
            <rect rx={6} ry={6} width={70} height={28} fill="#1a1a1a" stroke={`${color}40`} strokeWidth="1" />
            <text x={35} y={11} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9" letterSpacing="1">{hovPt.label.toUpperCase()}</text>
            <text x={35} y={23} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">${hovPt.value}</text>
          </g>
        </>
      )}

      {/* Labels eje X */}
      {data.map((d, i) => (
        <text key={i} x={pts[i].x} y={H + 17} textAnchor="middle"
          fill={hovIdx === i ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.18)'}
          fontSize="10" style={{ transition: 'fill 0.15s' }}>{d.label}</text>
      ))}
    </svg>
  )
}

// ─── Bar chart vertical animado ─────────────────────────────────────
function BarChart({ data, id = 'bc' }: {
  data: { label: string; total: number; fijos: number; variables: number; año: number }[]
  id?: string
}) {
  const [mounted, setMounted]   = useState(false)
  const [hovered, setHovered]   = useState<number | null>(null)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 120); return () => clearTimeout(t) }, [])

  if (!data.length) return null
  const W = 720, H = 160, barW = Math.min(56, (W / data.length) * 0.55)
  const gap = W / data.length
  const max = Math.max(...data.map(d => d.total), 1)
  const añoActual = new Date().getFullYear()

  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${W} ${H + 48}`} width="100%" height={H + 48} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={`bg_${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C0001A" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#C0001A" stopOpacity="0.4"/>
          </linearGradient>
          <linearGradient id={`fg_${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff6b6b" stopOpacity="1"/>
            <stop offset="100%" stopColor="#C0001A" stopOpacity="0.8"/>
          </linearGradient>
          <filter id={`gbar_${id}`}>
            <feGaussianBlur stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Grid horizontales */}
        {[0.25, 0.5, 0.75, 1].map(t => {
          const y = H - t * H
          return (
            <g key={t}>
              <line x1={0} y1={y} x2={W} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray={t === 1 ? '0' : '4 4'} />
              <text x={-6} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.18)" fontSize="9">
                ${Math.round(max * t) >= 1000 ? `${(max * t / 1000).toFixed(0)}k` : Math.round(max * t)}
              </text>
            </g>
          )
        })}

        {/* Barras */}
        {data.map((d, i) => {
          const x = i * gap + gap / 2
          const totalH = mounted ? (d.total / max) * H : 0
          const fijosH = mounted ? (d.fijos / max) * H : 0
          const varsH  = mounted ? (d.variables / max) * H : 0
          const isHov  = hovered === i
          const isCurrent = d.año === añoActual
          const delay = `${i * 60}ms`

          return (
            <g key={d.año}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'default' }}>

              {/* Barra fondo (total) */}
              <rect
                x={x - barW/2} y={H - totalH} width={barW} height={totalH}
                rx={5} ry={5}
                fill={isCurrent ? `url(#fg_${id})` : `url(#bg_${id})`}
                style={{
                  filter: isHov ? `drop-shadow(0 0 10px #C0001A88) drop-shadow(0 0 20px #C0001A44)` : isCurrent ? `drop-shadow(0 0 6px #C0001A55)` : 'none',
                  transition: `y 0.75s cubic-bezier(0.32,0.72,0,1) ${delay}, height 0.75s cubic-bezier(0.32,0.72,0,1) ${delay}, filter 0.2s`,
                  opacity: hovered !== null && !isHov ? 0.35 : 1,
                }}
              />

              {/* Segmento fijos (tope) */}
              <rect
                x={x - barW/2 + 3} y={H - fijosH} width={barW - 6} height={fijosH}
                rx={4} ry={4}
                fill="rgba(239,68,68,0.0)"
                stroke="rgba(239,68,68,0.35)" strokeWidth="1"
                style={{ transition: `y 0.75s cubic-bezier(0.32,0.72,0,1) ${delay}, height 0.75s cubic-bezier(0.32,0.72,0,1) ${delay}` }}
              />

              {/* Indicador año actual */}
              {isCurrent && (
                <rect x={x - barW/2} y={H - totalH - 3} width={barW} height={3} rx={1.5}
                  fill="#ff3352" style={{ filter: 'drop-shadow(0 0 4px #ff335299)' }} />
              )}

              {/* Label año */}
              <text x={x} y={H + 18} textAnchor="middle"
                fill={isCurrent ? '#fff' : isHov ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)'}
                fontSize={isCurrent ? '12' : '11'} fontWeight={isCurrent ? '600' : '400'}
                style={{ transition: 'fill 0.2s' }}>
                {d.label}
              </text>
              {isCurrent && (
                <text x={x} y={H + 31} textAnchor="middle" fill="#C0001A" fontSize="8" letterSpacing="1">ACTUAL</text>
              )}

              {/* Valor encima */}
              {(isHov || isCurrent) && totalH > 0 && (
                <text x={x} y={H - totalH - 10} textAnchor="middle"
                  fill={isHov ? '#fff' : 'rgba(255,255,255,0.5)'}
                  fontSize="11" fontWeight="700"
                  style={{ filter: isHov ? 'drop-shadow(0 0 6px #C0001A)' : 'none' }}>
                  ${d.total >= 1000 ? `${(d.total/1000).toFixed(1)}k` : d.total}
                </text>
              )}

              {/* Tooltip hover */}
              {isHov && (
                <g transform={`translate(${Math.min(Math.max(x - 52, 0), W - 110)}, ${H - totalH - 72})`}>
                  <rect rx={8} ry={8} width={110} height={62} fill="#1a1a1a" stroke="rgba(192,0,26,0.3)" strokeWidth="1" />
                  <rect rx={8} ry={8} width={110} height={3} fill="linear-gradient(90deg,#C0001A,#ff3352)" />
                  <rect rx={0} ry={0} width={110} height={3} fill="#C0001A" />
                  <text x={55} y={17} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" letterSpacing="1">{d.año}</text>
                  <text x={55} y={32} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">${d.total >= 1000 ? `${(d.total/1000).toFixed(1)}k` : d.total}</text>
                  <text x={10} y={48} fill="#EF4444" fontSize="9">F ${d.fijos}</text>
                  <text x={65} y={48} fill="#F59E0B" fontSize="9">V ${d.variables}</text>
                </g>
              )}
            </g>
          )
        })}

        {/* Eje X */}
        <line x1={0} y1={H} x2={W} y2={H} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      </svg>
    </div>
  )
}

// ─── HBar animada con glow ─────────────────────────────────────────
function HBar({ pct, color, delay = 0 }: { pct: number; color: string; delay?: number }) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setW(Math.max(pct, 0)), delay + 80)
    return () => clearTimeout(t)
  }, [pct, delay])
  return (
    <div style={{ height: 7, borderRadius: 99, background: 'rgba(255,255,255,0.05)', overflow: 'visible', position: 'relative' }}>
      <div style={{
        height: '100%', borderRadius: 99, width: `${w}%`,
        background: `linear-gradient(90deg, ${color}66, ${color})`,
        boxShadow: `0 0 10px ${color}55, 0 0 20px ${color}22`,
        transition: `width 0.85s cubic-bezier(0.32,0.72,0,1)`,
        position: 'relative',
      }}>
        {/* Shimmer tip */}
        {w > 2 && <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#fff', boxShadow: `0 0 6px ${color}, 0 0 12px ${color}` }} />}
      </div>
    </div>
  )
}

// ─── Modal confirmar eliminación ────────────────────────────────────
function ConfirmModal({ nombre, onConfirm, onCancel, loading }: {
  nombre: string; onConfirm: () => void; onCancel: () => void; loading: boolean
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', animation: 'kzFadeIn 0.15s ease' }}>
      <style>{`@keyframes kzFadeIn{from{opacity:0}to{opacity:1}} @keyframes kzSlideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}} @keyframes kzSpin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, width: 420, maxWidth: '90vw', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.7)', animation: 'kzSlideUp 0.2s cubic-bezier(0.32,0.72,0,1)' }}>
        <div style={{ height: 3, background: 'linear-gradient(90deg, #C0001A, #ff3352)' }} />
        <div style={{ padding: '28px 28px 24px' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(192,0,26,0.1)', border: '1px solid rgba(192,0,26,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Warning size={24} color="#C0001A" weight="fill" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', margin: '0 0 8px', fontFamily: 'inherit' }}>¿Eliminar este gasto?</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: '0 0 10px' }}>Estás por eliminar:</p>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
            <p style={{ fontSize: 14, color: '#fff', fontWeight: 500, margin: 0 }}>{nombre}</p>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', margin: '0 0 24px' }}>Esta acción archiva el registro en Notion. No se puede deshacer desde el panel.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onCancel} disabled={loading} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' }}>Cancelar</button>
            <button onClick={onConfirm} disabled={loading} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: 'none', background: loading ? 'rgba(192,0,26,0.5)' : '#C0001A', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
              {loading ? <><div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'kzSpin 0.6s linear infinite' }} />Eliminando...</> : <><Trash size={15} />Sí, eliminar</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Modal de edición ────────────────────────────────────────────────
function EditModal({ gasto, onSave, onCancel }: {
  gasto: Gasto; onSave: (updated: Partial<Gasto>) => Promise<void>; onCancel: () => void
}) {
  const [nombre, setNombre]       = useState(gasto.nombre)
  const [monto, setMonto]         = useState(gasto.monto?.toString() ?? '')
  const [categoria, setCategoria] = useState(gasto.categoria)
  const [mes, setMes]             = useState(gasto.mes)
  const [fijo, setFijo]           = useState(gasto.fijo)
  const [notas, setNotas]         = useState(gasto.notas)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')
  const inp2 = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' as const, fontFamily: 'inherit' }
  const lbl2 = { fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 6, display: 'block' as const }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      await onSave({ nombre, monto: monto ? parseFloat(monto) : null, categoria, mes, fijo, notas } as any)
    } catch {
      setError('Error al guardar')
      setSaving(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', animation: 'kzFadeIn 0.15s ease' }}>
      <style>{`@keyframes kzFadeIn{from{opacity:0}to{opacity:1}} @keyframes kzSlideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}} @keyframes kzSpin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, width: 480, maxWidth: '92vw', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.7)', animation: 'kzSlideUp 0.2s cubic-bezier(0.32,0.72,0,1)' }}>
        <div style={{ height: 3, background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)' }} />
        <div style={{ padding: '24px 28px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PencilSimple size={18} color="#3B82F6" />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', margin: 0, fontFamily: 'inherit' }}>Editar gasto</h3>
            </div>
            <button onClick={onCancel} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={16} /></button>
          </div>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={lbl2}>Nombre *</label>
                <input value={nombre} onChange={e => setNombre(e.target.value)} required style={inp2} />
              </div>
              <div>
                <label style={lbl2}>Monto (USD)</label>
                <input type="number" value={monto} onChange={e => setMonto(e.target.value)} min="0" step="0.01" style={inp2} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={lbl2}>Categoría</label>
                <CustomSelect value={categoria} onChange={setCategoria} style={inp2}
                  options={[{ value: '', label: 'Sin categoría' }, ...CATEGORIAS.map(c => ({ value: c, label: c, color: CAT_COLOR[c] }))]} />
              </div>
              <div>
                <label style={lbl2}>Mes</label>
                <CustomSelect value={mes} onChange={setMes} style={inp2}
                  options={MESES.map(m => ({ value: m, label: m }))} />
              </div>
            </div>
            <div>
              <label style={lbl2}>Notas</label>
              <input value={notas} onChange={e => setNotas(e.target.value)} style={inp2} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }}>
              <input type="checkbox" checked={fijo} onChange={e => setFijo(e.target.checked)} style={{ width: 15, height: 15, accentColor: '#EF4444' }} />
              <div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0 }}>Gasto fijo</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>Se repite todos los meses</p>
              </div>
            </label>
            {error && <p style={{ fontSize: 12, color: '#EF4444', margin: 0 }}>{error}</p>}
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button type="button" onClick={onCancel} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' }}>Cancelar</button>
              <button type="submit" disabled={saving} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: 'none', background: saving ? 'rgba(59,130,246,0.5)' : '#3B82F6', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
                {saving ? <><div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'kzSpin 0.6s linear infinite' }} />Guardando...</> : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function GastosPage() {
  const [gastos, setGastos]           = useState<Gasto[]>([])
  const [loading, setLoading]         = useState(true)
  const [mesFiltro, setMesFiltro]     = useState(MES_ACTUAL)
  const [showForm, setShowForm]       = useState(false)
  const [vistaDetalle, setVistaDetalle] = useState<'todos' | 'fijos' | 'variables' | null>(null)
  const [hoveredCat, setHoveredCat]   = useState<string | null>(null)
  const [toDelete, setToDelete]       = useState<Gasto | null>(null)
  const [deleting, setDeleting]       = useState(false)
  const [deleted, setDeleted]         = useState<string[]>([])
  const [toEdit, setToEdit]           = useState<Gasto | null>(null)
  const [vistaGrafico, setVistaGrafico] = useState<'mensual' | 'anual'>('mensual')

  const [nombre, setNombre]       = useState('')
  const [monto, setMonto]         = useState('')
  const [categoria, setCategoria] = useState('')
  const [mes, setMes]             = useState(MES_ACTUAL)
  const [fijo, setFijo]           = useState(false)
  const [notas, setNotas]         = useState('')
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState(false)

  function loadGastos() {
    setLoading(true)
    fetch('/api/admin/gastos')
      .then(r => r.json())
      .then(d => { setGastos(d.gastos ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }
  useEffect(() => { loadGastos() }, [])
  useLiveRefresh(loadGastos)

  const gastosMes      = gastos.filter(g => g.mes === mesFiltro)
  const totalMes       = gastosMes.reduce((s, g) => s + (g.monto ?? 0), 0)
  const gastosFijos    = gastosMes.filter(g => g.fijo)
  const gastosVariables = gastosMes.filter(g => !g.fijo)
  const fijos          = gastosFijos.reduce((s, g) => s + (g.monto ?? 0), 0)
  const variables      = gastosVariables.reduce((s, g) => s + (g.monto ?? 0), 0)

  const gastosDetalle = vistaDetalle === 'fijos' ? gastosFijos
    : vistaDetalle === 'variables' ? gastosVariables
    : gastosMes

  // Datos para gráficos
  const porCategoria = CATEGORIAS
    .map(cat => ({ name: cat, value: gastosMes.filter(g => g.categoria === cat).reduce((s,g) => s+(g.monto??0), 0), color: CAT_COLOR[cat] }))
    .filter(d => d.value > 0)
    .sort((a,b) => b.value - a.value)

  const porMes = MESES
    .map(m => ({
      label: m.slice(0,3),
      value: gastos.filter(g => g.mes === m).reduce((s,g) => s+(g.monto??0), 0),
      fijos: gastos.filter(g => g.mes === m && g.fijo).reduce((s,g) => s+(g.monto??0), 0),
      variables: gastos.filter(g => g.mes === m && !g.fijo).reduce((s,g) => s+(g.monto??0), 0),
    }))
    .filter(d => d.value > 0)

  // Datos anuales agrupados por año de creación
  const añoActual = new Date().getFullYear()
  const porAño = (() => {
    const map = new Map<number, { total: number; fijos: number; variables: number }>()
    gastos.forEach(g => {
      const año = new Date(g.fecha).getFullYear()
      if (!map.has(año)) map.set(año, { total: 0, fijos: 0, variables: 0 })
      const e = map.get(año)!
      e.total += g.monto ?? 0
      if (g.fijo) e.fijos += g.monto ?? 0
      else e.variables += g.monto ?? 0
    })
    return Array.from(map.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([año, d]) => ({ año, label: String(año), ...d }))
  })()

  const totalAnual = porAño.find(d => d.año === añoActual)?.total ?? 0
  const totalAñoAnterior = porAño.find(d => d.año === añoActual - 1)?.total ?? 0
  const yoyPct = totalAñoAnterior > 0 ? ((totalAnual - totalAñoAnterior) / totalAñoAnterior) * 100 : null
  const mesPromedio = totalAnual > 0 ? Math.round(totalAnual / new Date().getMonth() + 1) : 0
  // categoría top del año actual
  const catTopAño = CATEGORIAS
    .map(cat => ({ name: cat, value: gastos.filter(g => new Date(g.fecha).getFullYear() === añoActual && g.categoria === cat).reduce((s,g) => s+(g.monto??0), 0), color: CAT_COLOR[cat] }))
    .sort((a,b) => b.value - a.value)[0]

  async function handleDelete() {
    if (!toDelete) return
    setDeleting(true)
    const res = await fetch('/api/admin/eliminar', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: toDelete.id }),
    })
    if (res.ok) { setDeleted(d => [...d, toDelete.id]); setToDelete(null) }
    setDeleting(false)
  }

  async function handleEdit(updated: Partial<Gasto>) {
    if (!toEdit) return
    const res = await fetch('/api/admin/gastos', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: toEdit.id, ...updated }),
    })
    if (res.ok) {
      setGastos(gs => gs.map(g => g.id === toEdit.id ? { ...g, ...updated } : g))
      setToEdit(null)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/admin/gastos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, monto, categoria, mes, fijo, notas }),
      })
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false); setShowForm(false)
          setNombre(''); setMonto(''); setCategoria(''); setMes(MES_ACTUAL); setFijo(false); setNotas('')
          loadGastos()
        }, 1200)
      } else {
        const d = await res.json(); setError(d.error ?? 'Error al guardar')
      }
    } catch {
      setError('Error de conexión — el servidor puede estar reiniciando')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ padding: '44px 48px 80px', maxWidth: 1400, margin: '0 auto' }}>
      {toDelete && <ConfirmModal nombre={toDelete.nombre} onConfirm={handleDelete} onCancel={() => setToDelete(null)} loading={deleting} />}
      {toEdit && <EditModal gasto={toEdit} onSave={handleEdit} onCancel={() => setToEdit(null)} />}
      <style>{`
        @keyframes barIn { from { width: 0 } }
        .cat-row { transition: opacity 0.2s; }
        .cat-row:hover { opacity: 1 !important; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>Finanzas</p>
          <h1 style={{ fontSize: 28, fontWeight: 400, color: '#fff', margin: 0, lineHeight: 1.1 }}>
            <span style={{ fontFamily: 'var(--font-serif-var), Cormorant Garamond, serif', fontWeight: 600, fontStyle: 'italic' }}>Gastos </span>
            <span style={{ fontFamily: 'var(--font-body-var), Space Grotesk, sans-serif', fontWeight: 300, letterSpacing: '-0.01em', color: 'rgba(255,255,255,0.7)' }}>mensuales</span>
          </h1>
        </div>
        <button onClick={() => setShowForm(v => !v)} style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: showForm ? 'rgba(255,255,255,0.06)' : '#C0001A',
          color: '#fff', border: 'none', borderRadius: 8,
          padding: '10px 16px', fontSize: 13, fontWeight: 500, fontFamily: 'inherit', transition: 'all 0.2s',
        }}>
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? 'Cancelar' : 'Nuevo gasto'}
        </button>
      </div>

      {/* Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total del mes',    value: totalMes,  icon: CurrencyDollar, color: '#C0001A', rgb: '192,0,26',   key: 'todos'     },
          { label: 'Gastos fijos',     value: fijos,     icon: TrendDown,      color: '#EF4444', rgb: '239,68,68',  key: 'fijos'     },
          { label: 'Gastos variables', value: variables, icon: TrendUp,        color: '#F59E0B', rgb: '245,158,11', key: 'variables' },
        ].map(({ label, value, icon: Icon, color, rgb, key }) => {
          const activo = vistaDetalle === key
          return (
            <button key={key} onClick={() => setVistaDetalle(activo ? null : key as any)} style={{
              background: activo ? `rgba(${rgb},0.1)` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${activo ? color + '40' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 12, padding: '16px 18px', textAlign: 'left',
              transition: 'all 0.2s', cursor: 'pointer',
              transform: activo ? 'translateY(-1px)' : 'none',
              boxShadow: activo ? `0 4px 20px rgba(${rgb},0.15)` : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                <Icon size={14} color={activo ? color : 'rgba(255,255,255,0.3)'} />
                <span style={{ fontSize: 11, color: activo ? color : 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
              </div>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                USD <AnimatedNumber value={value} />
              </p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', margin: '6px 0 0', letterSpacing: '0.06em' }}>
                {activo ? '↑ Click para cerrar' : 'Click para ver detalle'}
              </p>
            </button>
          )
        })}
      </div>

      {/* Filtro de mes */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 28 }}>
        {MESES.map(m => (
          <button key={m} onClick={() => setMesFiltro(m)} style={{
            padding: '5px 12px', borderRadius: 6, fontSize: 12, fontFamily: 'inherit',
            border: mesFiltro === m ? '1px solid rgba(192,0,26,0.5)' : '1px solid rgba(255,255,255,0.08)',
            background: mesFiltro === m ? 'rgba(192,0,26,0.12)' : 'rgba(255,255,255,0.02)',
            color: mesFiltro === m ? '#fff' : 'rgba(255,255,255,0.35)',
            transition: 'all 0.15s',
          }}>{m}</button>
        ))}
      </div>

      {/* Formulario */}
      {showForm && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '24px', marginBottom: 28, maxWidth: 760 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)', margin: '0 0 18px', letterSpacing: '0.04em' }}>Registrar gasto</p>
          {success ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#10B981' }}>
              <CheckCircle size={20} /><span style={{ fontSize: 14 }}>Gasto guardado en Notion</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={lbl}>Nombre *</label>
                  <input value={nombre} onChange={e => setNombre(e.target.value)} required placeholder="Ej: Vercel Pro" style={inp} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={lbl}>Monto (USD)</label>
                  <input type="number" value={monto} onChange={e => setMonto(e.target.value)} placeholder="0" min="0" step="0.01" style={inp} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={lbl}>Categoría</label>
                  <CustomSelect value={categoria} onChange={setCategoria}
                    options={[{ value: '', label: 'Sin categoría' }, ...CATEGORIAS.map(c => ({ value: c, label: c, color: CAT_COLOR[c] }))]} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={lbl}>Mes</label>
                  <CustomSelect value={mes} onChange={setMes}
                    options={MESES.map(m => ({ value: m, label: m }))} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={lbl}>Notas</label>
                <input value={notas} onChange={e => setNotas(e.target.value)} placeholder="Descripción opcional..." style={inp} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }}>
                <input type="checkbox" checked={fijo} onChange={e => setFijo(e.target.checked)} style={{ width: 15, height: 15, accentColor: '#EF4444' }} />
                <div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0 }}>Gasto fijo</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>Se repite todos los meses</p>
                </div>
              </label>
              {error && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '9px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8 }}>
                  <Warning size={14} color="#EF4444" />
                  <p style={{ fontSize: 12, color: '#EF4444', margin: 0 }}>{error}</p>
                </div>
              )}
              <button type="submit" disabled={saving} style={{
                background: '#C0001A', color: '#fff', border: 'none', borderRadius: 8,
                padding: '11px 20px', fontSize: 14, fontWeight: 500, fontFamily: 'inherit',
                opacity: saving ? 0.6 : 1, transition: 'opacity 0.2s', alignSelf: 'flex-start',
              }}>
                {saving ? 'Guardando...' : 'Guardar gasto'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* ── GRÁFICOS ────────────────────────────────────────────── */}
      {(gastosMes.length > 0 || porAño.length > 0) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>

          {/* Tab Mensual / Anual */}
          <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 4, alignSelf: 'flex-start' }}>
            {(['mensual', 'anual'] as const).map(v => (
              <button key={v} onClick={() => setVistaGrafico(v)} style={{
                padding: '7px 20px', borderRadius: 7, border: 'none', fontFamily: 'inherit',
                fontSize: 13, fontWeight: 500, transition: 'all 0.2s cubic-bezier(0.32,0.72,0,1)',
                background: vistaGrafico === v ? 'rgba(255,255,255,0.09)' : 'transparent',
                color: vistaGrafico === v ? '#fff' : 'rgba(255,255,255,0.3)',
                boxShadow: vistaGrafico === v ? '0 1px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)' : 'none',
                cursor: 'pointer',
              }}>
                {v === 'mensual' ? 'Mensual' : 'Anual'}
              </button>
            ))}
          </div>

          {vistaGrafico === 'mensual' && gastosMes.length > 0 && <>
          {/* Fila 1: dona + barras de categoría */}
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 14 }}>

            {/* Dona */}
            <div style={{
              background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 4px', alignSelf: 'flex-start' }}>Resumen</p>
              <DonutChart segments={porCategoria} total={totalMes} />
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: '#EF4444', margin: 0, letterSpacing: '0.08em' }}>FIJOS</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '2px 0 0' }}>{gastosFijos.length}</p>
                </div>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.07)' }} />
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: '#F59E0B', margin: 0, letterSpacing: '0.08em' }}>VARIABLES</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '2px 0 0' }}>{gastosVariables.length}</p>
                </div>
              </div>
            </div>

            {/* Barras horizontales */}
            <div style={{
              background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, padding: '20px 24px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: 0 }}>Distribución — {mesFiltro}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: 0 }}>{porCategoria.length} categorías</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {porCategoria.map((d, idx) => {
                  const pct = totalMes > 0 ? (d.value / totalMes) * 100 : 0
                  const dim = hoveredCat !== null && hoveredCat !== d.name
                  return (
                    <div key={d.name}
                      onMouseEnter={() => setHoveredCat(d.name)}
                      onMouseLeave={() => setHoveredCat(null)}
                      style={{ opacity: dim ? 0.25 : 1, transition: 'opacity 0.25s' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 7, height: 7, borderRadius: '50%', background: d.color, boxShadow: `0 0 8px ${d.color}` }} />
                          <span style={{ fontSize: 13, color: hoveredCat === d.name ? '#fff' : 'rgba(255,255,255,0.65)', transition: 'color 0.2s' }}>{d.name}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontVariantNumeric: 'tabular-nums' }}>{pct.toFixed(0)}%</span>
                          <span style={{ fontSize: 14, fontWeight: 700, color: hoveredCat === d.name ? d.color : '#fff', fontVariantNumeric: 'tabular-nums', transition: 'color 0.2s', textShadow: hoveredCat === d.name ? `0 0 12px ${d.color}88` : 'none' }}>USD {d.value.toLocaleString('es-AR')}</span>
                        </div>
                      </div>
                      <HBar pct={pct} color={d.color} delay={idx * 80} />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Fila 2: sparkline evolución anual */}
          {porMes.length > 1 && (
            <div style={{
              background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, padding: '20px 24px 12px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: 0 }}>Evolución anual</p>
                <div style={{ display: 'flex', gap: 18 }}>
                  {[
                    { label: 'Total', color: '#C0001A' },
                    { label: 'Fijos', color: '#EF4444' },
                    { label: 'Variables', color: '#F59E0B' },
                  ].map(l => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 18, height: 2, borderRadius: 1, background: l.color, boxShadow: `0 0 4px ${l.color}` }} />
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>{l.label.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Tres sparklines superpuestos */}
              <div style={{ position: 'relative', height: 96 }}>
                <div style={{ position: 'absolute', inset: 0 }}>
                  <SparkLine data={porMes.map(m => ({ label: m.label, value: m.fijos }))}     color="#EF4444" height={80} id="fijos" />
                </div>
                <div style={{ position: 'absolute', inset: 0 }}>
                  <SparkLine data={porMes.map(m => ({ label: m.label, value: m.variables }))} color="#F59E0B" height={80} id="vars" />
                </div>
                <div style={{ position: 'absolute', inset: 0 }}>
                  <SparkLine data={porMes.map(m => ({ label: m.label, value: m.value }))}     color="#C0001A" height={80} id="total" />
                </div>
              </div>
            </div>
          )}
          </>}

          {/* ── VISTA ANUAL ── */}
          {vistaGrafico === 'anual' && porAño.length > 0 && <>
          {/* KPIs anuales */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {/* Total año actual */}
            <div style={{ background: 'rgba(192,0,26,0.07)', border: '1px solid rgba(192,0,26,0.18)', borderRadius: 12, padding: '16px 18px' }}>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>Total {añoActual}</p>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#fff', margin: '0 0 4px', fontVariantNumeric: 'tabular-nums' }}>
                USD <AnimatedNumber value={totalAnual} />
              </p>
              {yoyPct !== null && (
                <p style={{ fontSize: 12, color: yoyPct > 0 ? '#EF4444' : '#10B981', margin: 0 }}>
                  {yoyPct > 0 ? '▲' : '▼'} {Math.abs(yoyPct).toFixed(0)}% vs {añoActual - 1}
                </p>
              )}
            </div>

            {/* Promedio mensual */}
            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 18px' }}>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>Promedio / mes</p>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#fff', margin: '0 0 4px', fontVariantNumeric: 'tabular-nums' }}>
                USD <AnimatedNumber value={Math.round(totalAnual / Math.max(new Date().getMonth() + 1, 1))} />
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', margin: 0 }}>basado en {new Date().getMonth() + 1} meses</p>
            </div>

            {/* Categoría top */}
            {catTopAño && catTopAño.value > 0 && (
              <div style={{ background: `${catTopAño.color}0d`, border: `1px solid ${catTopAño.color}28`, borderRadius: 12, padding: '16px 18px' }}>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>Mayor categoría</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: catTopAño.color, margin: '0 0 4px', textShadow: `0 0 20px ${catTopAño.color}66` }}>
                  {catTopAño.name}
                </p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', margin: 0 }}>
                  USD {catTopAño.value.toLocaleString('es-AR')} · {((catTopAño.value / totalAnual) * 100).toFixed(0)}% del total
                </p>
              </div>
            )}
          </div>

          {/* Bar chart por año */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 24px 10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: 0 }}>Gasto total por año</p>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: '#C0001A', boxShadow: '0 0 6px #C0001A88' }} />
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>TOTAL</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, border: '1px solid rgba(239,68,68,0.5)' }} />
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>FIJOS</span>
                </div>
              </div>
            </div>
            <BarChart data={porAño} id="annual" />
          </div>
          </>}

        </div>
      )}

      {/* Título de la vista activa */}
      {vistaDetalle && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ width: 4, height: 22, borderRadius: 2, background: vistaDetalle === 'fijos' ? '#EF4444' : vistaDetalle === 'variables' ? '#F59E0B' : '#C0001A' }} />
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', margin: 0, fontWeight: 500 }}>
            {vistaDetalle === 'todos' ? 'Todos los gastos' : vistaDetalle === 'fijos' ? 'Gastos fijos' : 'Gastos variables'}
          </p>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>·</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{mesFiltro}</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginLeft: 2 }}>({gastosDetalle.length} {gastosDetalle.length === 1 ? 'gasto' : 'gastos'})</span>
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {[...Array(4)].map((_, i) => <div key={i} style={{ height: 60, background: 'rgba(255,255,255,0.03)', borderRadius: 10 }} />)}
        </div>
      ) : gastosDetalle.length === 0 ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>
          {vistaDetalle ? 'Sin gastos en esta categoría' : `Sin gastos registrados en ${mesFiltro}`}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {gastosDetalle.filter(g => !deleted.includes(g.id)).map(g => {
            const catColor = CAT_COLOR[g.categoria] ?? 'rgba(255,255,255,0.3)'
            return (
              <div key={g.id} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, padding: '14px 18px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1 }}>
                  <div style={{ width: 4, height: 36, borderRadius: 2, background: g.fijo ? '#EF4444' : '#F59E0B', flexShrink: 0, boxShadow: `0 0 6px ${g.fijo ? '#EF4444' : '#F59E0B'}66` }} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 15, color: '#fff', margin: 0, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.nombre}</p>
                    {g.notas && <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '4px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.notas}</p>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  {g.categoria && (
                    <span style={{ fontSize: 12, color: catColor, background: `${catColor}15`, border: `1px solid ${catColor}35`, borderRadius: 6, padding: '4px 10px', fontWeight: 500 }}>
                      {g.categoria}
                    </span>
                  )}
                  {g.fijo && (
                    <span style={{ fontSize: 11, color: '#EF4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 6, padding: '4px 10px', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>
                      Fijo
                    </span>
                  )}
                  {g.monto != null && (
                    <span style={{ fontSize: 17, fontWeight: 700, color: '#fff', minWidth: 90, textAlign: 'right' as const, fontVariantNumeric: 'tabular-nums' }}>
                      USD {g.monto.toLocaleString('es-AR')}
                    </span>
                  )}
                  {/* Botones acción */}
                  <button onClick={() => setToEdit(g)} title="Editar" style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', flexShrink: 0, cursor: 'pointer' }}
                    onMouseEnter={e => { const b = e.currentTarget; b.style.background='rgba(59,130,246,0.1)'; b.style.color='#3B82F6'; b.style.borderColor='rgba(59,130,246,0.25)' }}
                    onMouseLeave={e => { const b = e.currentTarget; b.style.background='rgba(255,255,255,0.03)'; b.style.color='rgba(255,255,255,0.25)'; b.style.borderColor='rgba(255,255,255,0.08)' }}
                  ><PencilSimple size={13} /></button>
                  <button onClick={() => setToDelete(g)} title="Eliminar" style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', flexShrink: 0, cursor: 'pointer' }}
                    onMouseEnter={e => { const b = e.currentTarget; b.style.background='rgba(192,0,26,0.1)'; b.style.color='#C0001A'; b.style.borderColor='rgba(192,0,26,0.25)' }}
                    onMouseLeave={e => { const b = e.currentTarget; b.style.background='rgba(255,255,255,0.03)'; b.style.color='rgba(255,255,255,0.25)'; b.style.borderColor='rgba(255,255,255,0.08)' }}
                  ><Trash size={13} /></button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
