import { Document, Page, Text, View, Image, StyleSheet, Svg, Path, Rect, Circle, Line, Font } from '@react-pdf/renderer'
import type { PDFPresupuestoData } from './presupuesto-types'

export type { PDFPresupuestoData }

/* ─── Fonts ────────────────────────────────────────────────────────────── */
import nodepath from 'path'

function fontPath(pkg: string, file: string) {
  return nodepath.join(process.cwd(), 'node_modules', '@fontsource', pkg, 'files', file)
}

Font.register({
  family: 'SpaceGrotesk',
  fonts: [{ src: fontPath('space-grotesk', 'space-grotesk-latin-700-normal.woff'), fontWeight: 700, fontStyle: 'normal' }],
})
Font.register({
  family: 'Montserrat',
  fonts: [{ src: fontPath('montserrat', 'montserrat-latin-600-normal.woff'), fontWeight: 600, fontStyle: 'normal' }],
})

/* ─── Palette ──────────────────────────────────────────────────────────── */
const RED       = '#C0001A'
const RED_SOFT  = '#D62828'
const BLACK     = '#0A0A0A'
const DARK      = '#1A1A1A'
const CHARCOAL  = '#2E2E2E'
const GRAY      = '#6B6B6B'
const GRAY_MED  = '#999'
const LIGHT     = '#F5F5F5'
const LIGHTER   = '#FAFAFA'
const BORDER    = '#E0E0E0'
const WHITE     = '#FFFFFF'
const RED_BG    = 'rgba(192,0,26,0.04)'
const RED_BORDER= 'rgba(192,0,26,0.18)'

/* ─── Static data ──────────────────────────────────────────────────────── */
const SERVICIOS = ['Landing Page','Web Institucional','E-commerce','App Movil','Automatizacion','Hosting','Dominio','Mantenimiento','Soporte']
const OBLIG_CLIENTE = [
  'Proveer el contenido (textos, informacion, accesos) necesario.',
  'Entregar el material grafico en los formatos solicitados.',
  'Responder consultas y aprobaciones en tiempos razonables.',
  'Cumplir con los pagos segun lo acordado.',
]
const OBLIG_KIANZO = [
  'Desarrollar el proyecto conforme al alcance acordado.',
  'Mantener comunicacion fluida durante el proceso.',
  'Realizar la entrega en los tiempos y condiciones acordadas.',
]
const MANT_INCLUYE = ['Hosting y dominio','Monitoreo del funcionamiento','Copias de seguridad periodicas','Correccion de errores menores','Actualizaciones menores (seguridad, librerias, plugins)']
const MANT_NO_INCLUYE = ['Redisenos completos','Nuevas funcionalidades','Ampliaciones del alcance original']

/* ─── Helpers ──────────────────────────────────────────────────────────── */
function fDate(s: string) {
  if (!s) return '—'
  const M = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
  const d = new Date(s + 'T12:00:00')
  return `${d.getDate()} de ${M[d.getMonth()]} de ${d.getFullYear()}`
}
function fUSD(n: number | null) {
  if (n == null) return '—'
  return `USD ${n.toLocaleString('es-AR')}`
}

/* ─── SVG Icons (all stroke-based, no Unicode chars) ───────────────────── */
const SP = { stroke: RED_SOFT, strokeWidth: 1.5, fill: 'none' } as const

function IUser({ sz = 16 }: { sz?: number }) {
  return (<Svg viewBox="0 0 24 24" width={sz} height={sz}><Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...SP} /><Circle cx={12} cy={7} r={4} {...SP} /></Svg>)
}
function IBuilding({ sz = 16 }: { sz?: number }) {
  return (<Svg viewBox="0 0 24 24" width={sz} height={sz}><Path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" {...SP} /><Path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" {...SP} /><Path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 0-2 2h-2" {...SP} /><Path d="M10 6h4M10 10h4M10 14h4M10 18h4" {...SP} /></Svg>)
}
function IPhone({ sz = 16 }: { sz?: number }) {
  return (<Svg viewBox="0 0 24 24" width={sz} height={sz}><Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.5 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6.08 6.08l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" {...SP} /></Svg>)
}
function IMail({ sz = 16 }: { sz?: number }) {
  return (<Svg viewBox="0 0 24 24" width={sz} height={sz}><Rect x={2} y={4} width={20} height={16} rx={2} {...SP} /><Path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" {...SP} /></Svg>)
}
function ICalendar({ sz = 16 }: { sz?: number }) {
  return (<Svg viewBox="0 0 24 24" width={sz} height={sz}><Rect x={3} y={4} width={18} height={18} rx={2} {...SP} /><Path d="M16 2v4M8 2v4M3 10h18" {...SP} /></Svg>)
}
function IClock({ sz = 16 }: { sz?: number }) {
  return (<Svg viewBox="0 0 24 24" width={sz} height={sz}><Circle cx={12} cy={12} r={10} {...SP} /><Path d="M12 6v6l4 2" {...SP} /></Svg>)
}
function IWallet({ sz = 16 }: { sz?: number }) {
  return (<Svg viewBox="0 0 24 24" width={sz} height={sz}><Path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" {...SP} /><Path d="M3 5v14a2 2 0 0 0 2 2h16v-5" {...SP} /><Path d="M18 12a2 2 0 0 0 0 4h4v-4Z" {...SP} /></Svg>)
}
function IShieldCheck({ sz = 16 }: { sz?: number }) {
  return (<Svg viewBox="0 0 24 24" width={sz} height={sz}><Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...SP} /><Path d="m9 12 2 2 4-4" {...SP} /></Svg>)
}
function ILock({ sz = 16 }: { sz?: number }) {
  return (<Svg viewBox="0 0 24 24" width={sz} height={sz}><Rect x={3} y={11} width={18} height={11} rx={2} {...SP} /><Path d="M7 11V7a5 5 0 0 1 10 0v4" {...SP} /></Svg>)
}
function ICopyright({ sz = 16 }: { sz?: number }) {
  return (<Svg viewBox="0 0 24 24" width={sz} height={sz}><Circle cx={12} cy={12} r={10} {...SP} /><Path d="M15 9.354a4 4 0 1 0 0 5.292" {...SP} /></Svg>)
}
function IPenSquare({ sz = 16 }: { sz?: number }) {
  return (<Svg viewBox="0 0 24 24" width={sz} height={sz}><Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" {...SP} /><Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" {...SP} /></Svg>)
}
function IFileText({ sz = 16 }: { sz?: number }) {
  return (<Svg viewBox="0 0 24 24" width={sz} height={sz}><Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...SP} /><Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" {...SP} /></Svg>)
}
function IBriefcase({ sz = 16 }: { sz?: number }) {
  return (<Svg viewBox="0 0 24 24" width={sz} height={sz}><Rect x={2} y={7} width={20} height={14} rx={2} {...SP} /><Path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" {...SP} /></Svg>)
}

function CheckSvg({ sz = 10 }: { sz?: number }) {
  return (<Svg viewBox="0 0 24 24" width={sz} height={sz}><Path d="M5 12l5 5L20 7" stroke={WHITE} strokeWidth={3} fill="none" /></Svg>)
}
function XSvg({ sz = 9 }: { sz?: number }) {
  return (<Svg viewBox="0 0 24 24" width={sz} height={sz}><Path d="M18 6L6 18M6 6l12 12" stroke={GRAY_MED} strokeWidth={2.5} fill="none" /></Svg>)
}
function CheckCircleSvg({ sz = 12 }: { sz?: number }) {
  return (<Svg viewBox="0 0 24 24" width={sz} height={sz}><Circle cx={12} cy={12} r={10} stroke={RED_SOFT} strokeWidth={1.5} fill="rgba(214,40,40,0.08)" /><Path d="m9 12 2 2 4-4" stroke={RED_SOFT} strokeWidth={2} fill="none" /></Svg>)
}
function XCircleSvg({ sz = 12 }: { sz?: number }) {
  return (<Svg viewBox="0 0 24 24" width={sz} height={sz}><Circle cx={12} cy={12} r={10} stroke={BORDER} strokeWidth={1.5} fill="none" /><Path d="m15 9-6 6M9 9l6 6" stroke={GRAY_MED} strokeWidth={1.5} fill="none" /></Svg>)
}

/* ─── Decorative petal ─────────────────────────────────────────────────── */
function Petal({ right, top, opacity = 0.06, size = 1 }: { right: number; top: number; opacity?: number; size?: number }) {
  const w = Math.round(8 * size); const h = Math.round(13 * size)
  return (
    <Svg width={w} height={h} style={{ position: 'absolute', right, top }}>
      <Path d={`M${w/2} 0 C${w*0.85} ${h*0.25} ${w*0.85} ${h*0.65} ${w/2} ${h} C${w*0.15} ${h*0.65} ${w*0.15} ${h*0.25} ${w/2} 0`} fill={RED} fillOpacity={opacity} />
    </Svg>
  )
}
function PetalCluster({ right, top, op = 0.05 }: { right: number; top: number; op?: number }) {
  return (
    <View style={{ position: 'absolute', right, top, width: 30, height: 30 }}>
      <Petal right={10} top={0} opacity={op} size={0.8} />
      <Petal right={0} top={8} opacity={op * 0.7} size={0.65} />
      <Petal right={18} top={12} opacity={op * 0.5} size={0.55} />
    </View>
  )
}

/* ─── Styles ───────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  /* ── Cover ── */
  coverPage:       { backgroundColor: BLACK, position: 'relative' },
  coverAccent:     { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, backgroundColor: RED },
  coverBody:       { padding: 56, paddingTop: 64 },
  coverBrandRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: 90 },
  coverLogo:       { width: 48, height: 48, borderRadius: 24 },
  coverBrandText:  { marginLeft: 14 },
  coverBrandName:  { color: WHITE, fontSize: 18, fontFamily: 'SpaceGrotesk', fontWeight: 700, letterSpacing: 6 },
  coverBrandSub:   { color: 'rgba(255,255,255,0.2)', fontSize: 7, fontFamily: 'Helvetica', letterSpacing: 3, marginTop: 2 },
  coverRedLine:    { width: 52, height: 3, backgroundColor: RED, marginBottom: 24 },
  coverT1:         { color: WHITE, fontSize: 48, fontFamily: 'SpaceGrotesk', fontWeight: 700, lineHeight: 1.05, letterSpacing: -0.5 },
  coverT2:         { color: WHITE, fontSize: 48, fontFamily: 'SpaceGrotesk', fontWeight: 700, lineHeight: 1.05, letterSpacing: -0.5, marginBottom: 12 },
  coverSub:        { color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Helvetica', letterSpacing: 3, textTransform: 'uppercase' as const },
  coverFooter:     { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 56, paddingBottom: 44 },
  coverFooterLine: { height: 0.5, backgroundColor: RED, marginBottom: 16 },
  coverFooterRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  coverKaizen:     { color: RED, fontSize: 8, fontFamily: 'SpaceGrotesk', fontWeight: 700, letterSpacing: 6, marginBottom: 3 },
  coverTagline:    { color: 'rgba(255,255,255,0.22)', fontSize: 7.5, fontFamily: 'Helvetica', lineHeight: 1.6 },
  coverMetaLabel:  { color: 'rgba(255,255,255,0.2)', fontSize: 6.5, fontFamily: 'Helvetica', letterSpacing: 2, textTransform: 'uppercase' as const, marginBottom: 2, textAlign: 'right' as const },
  coverMetaValue:  { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontFamily: 'SpaceGrotesk', fontWeight: 700, textAlign: 'right' as const },

  /* ── Content pages ── */
  contentPage:   { backgroundColor: WHITE, position: 'relative' },
  accentBar:     { position: 'absolute', left: 0, top: 0, width: 4, height: 100, backgroundColor: RED },

  /* ── Header ── */
  hdr:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 40, paddingTop: 22, paddingBottom: 14, borderBottomWidth: 0.5, borderBottomColor: BORDER, borderBottomStyle: 'solid' },
  hdrLeft:   { flexDirection: 'row', alignItems: 'center' },
  hdrLogoW:  { width: 22, height: 22, borderRadius: 11, overflow: 'hidden', backgroundColor: BLACK },
  hdrLogo:   { width: 22, height: 22 },
  hdrBrand:  { color: DARK, fontSize: 10, fontFamily: 'SpaceGrotesk', fontWeight: 700, letterSpacing: 4, marginLeft: 8 },
  hdrDot:    { color: RED, fontSize: 10, fontFamily: 'SpaceGrotesk', fontWeight: 700 },
  hdrRight:  { color: GRAY_MED, fontSize: 7, fontFamily: 'Helvetica', letterSpacing: 0.5 },
  hdrNum:    { color: RED, fontSize: 8, fontFamily: 'SpaceGrotesk', fontWeight: 700, letterSpacing: 1 },

  /* ── Body ── */
  body: { paddingHorizontal: 40, paddingVertical: 16 },

  /* ── Section header ── */
  secWrap:   { position: 'relative', marginTop: 16, marginBottom: 10 },
  secRow:    { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  secNum:    { color: WHITE, fontSize: 7, fontFamily: 'SpaceGrotesk', fontWeight: 700, backgroundColor: RED, paddingVertical: 3, paddingHorizontal: 7, borderRadius: 3, marginRight: 10 },
  secTitle:  { color: DARK, fontSize: 10.5, fontFamily: 'SpaceGrotesk', fontWeight: 700, letterSpacing: 2.5 },
  secLine:   { height: 0.5, backgroundColor: BORDER },
  decorNum:  { position: 'absolute', right: -8, top: -24, fontSize: 85, fontFamily: 'SpaceGrotesk', fontWeight: 700, color: 'rgba(192,0,26,0.08)', lineHeight: 1 },

  /* ── Info grid ── */
  infoGrid:     { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  infoCell:     { width: '33%', paddingBottom: 16, paddingRight: 10 },
  infoIconRow:  { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 5 },
  infoLabel:    { color: GRAY_MED, fontSize: 6.5, fontFamily: 'Montserrat', fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase' as const },
  infoValue:    { color: DARK, fontSize: 9.5, fontFamily: 'Helvetica-Bold' },

  /* ── Description ── */
  descQ: { color: CHARCOAL, fontSize: 8.5, fontFamily: 'Montserrat', fontWeight: 600, marginBottom: 5 },
  descT: { color: CHARCOAL, fontSize: 8.5, fontFamily: 'Helvetica', lineHeight: 1.7 },

  /* ── Services grid ── */
  svcGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  svcChip:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: BORDER, borderStyle: 'solid', backgroundColor: WHITE, width: '31.5%' },
  svcChipOn:  { backgroundColor: RED_BG, borderColor: RED_BORDER, borderWidth: 1 },
  svcDot:     { width: 16, height: 16, borderRadius: 8, marginRight: 8, borderWidth: 1, borderColor: BORDER, borderStyle: 'solid', backgroundColor: WHITE, alignItems: 'center', justifyContent: 'center' },
  svcDotOn:   { backgroundColor: RED, borderColor: RED, borderWidth: 1 },
  svcLabel:   { color: GRAY, fontSize: 7.5, fontFamily: 'Helvetica' },
  svcLabelOn: { color: DARK, fontSize: 7.5, fontFamily: 'Helvetica-Bold' },

  /* ── Alcance ── */
  alcRow:     { flexDirection: 'row', gap: 12 },
  alcCol:     { flex: 1 },
  alcHdr:     { paddingVertical: 7, paddingHorizontal: 12, borderRadius: 5, marginBottom: 10 },
  alcHdrText: { color: WHITE, fontSize: 7, fontFamily: 'Montserrat', fontWeight: 600, letterSpacing: 1.5 },
  alcItem:    { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 5 },
  alcText:    { color: CHARCOAL, fontSize: 8, fontFamily: 'Helvetica', lineHeight: 1.6, flex: 1 },
  alcNote:    { backgroundColor: LIGHTER, borderLeftWidth: 3, borderLeftColor: RED, borderLeftStyle: 'solid', padding: 10, marginTop: 14, borderRadius: 3 },
  alcNoteT:   { color: GRAY, fontSize: 7.5, fontFamily: 'Helvetica-Oblique', lineHeight: 1.6 },

  /* ── Plazos ── */
  plRow:    { flexDirection: 'row', gap: 8, marginBottom: 6 },
  plCard:   { flex: 1, padding: 14, borderRadius: 8, backgroundColor: LIGHTER, borderWidth: 0.5, borderColor: BORDER, borderStyle: 'solid' },
  plIcon:   { marginBottom: 6 },
  plLabel:  { color: GRAY_MED, fontSize: 6.5, fontFamily: 'Montserrat', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 4 },
  plValue:  { color: DARK, fontSize: 10, fontFamily: 'Helvetica-Bold' },
  plNote:   { color: GRAY, fontSize: 7.5, fontFamily: 'Helvetica-Oblique', lineHeight: 1.6, marginTop: 4 },

  /* ── Investment ── */
  invTable:     { borderRadius: 8, overflow: 'hidden', marginBottom: 12, borderWidth: 0.5, borderColor: BORDER, borderStyle: 'solid' },
  invHeader:    { flexDirection: 'row', paddingVertical: 9, paddingHorizontal: 14, backgroundColor: DARK },
  invHeaderT:   { color: 'rgba(255,255,255,0.6)', fontSize: 7, fontFamily: 'Montserrat', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 1 },
  invRow:       { flexDirection: 'row', paddingVertical: 11, paddingHorizontal: 14, borderBottomWidth: 0.5, borderBottomColor: BORDER, borderBottomStyle: 'solid' },
  invRowAlt:    { backgroundColor: LIGHTER },
  invRowTotal:  { flexDirection: 'row', paddingVertical: 13, paddingHorizontal: 14, backgroundColor: RED },
  invConcept:   { color: CHARCOAL, fontSize: 9, fontFamily: 'Helvetica', flex: 1 },
  invAmount:    { color: DARK, fontSize: 9, fontFamily: 'Helvetica-Bold' },
  invConceptT:  { color: WHITE, fontSize: 10, fontFamily: 'SpaceGrotesk', fontWeight: 700, flex: 1 },
  invAmountT:   { color: WHITE, fontSize: 10, fontFamily: 'SpaceGrotesk', fontWeight: 700 },
  payInfo:      { borderLeftWidth: 3, borderLeftColor: RED, borderLeftStyle: 'solid', paddingLeft: 12, marginTop: 10 },
  payLabel:     { color: GRAY_MED, fontSize: 6.5, fontFamily: 'Montserrat', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 3 },
  payText:      { color: CHARCOAL, fontSize: 8.5, fontFamily: 'Helvetica', lineHeight: 1.5 },

  /* ── Mantenimiento ── */
  mantBox:       { backgroundColor: RED_BG, borderWidth: 1, borderColor: RED_BORDER, borderStyle: 'solid', borderRadius: 8, padding: 16, marginBottom: 10 },
  mantBoxNo:     { backgroundColor: LIGHTER, borderWidth: 0.5, borderColor: BORDER, borderStyle: 'solid', borderRadius: 8, padding: 16, marginBottom: 10 },
  mantHdr:       { flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingBottom: 8, borderBottomWidth: 0.5, borderBottomColor: RED_BORDER, borderBottomStyle: 'solid' },
  mantHdrNo:     { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  mantTitle:     { color: DARK, fontSize: 9, fontFamily: 'Helvetica-Bold', marginLeft: 8 },
  mantCols:      { flexDirection: 'row', gap: 16 },
  mantCol:       { flex: 1 },
  mantSubTitle:  { color: GRAY, fontSize: 7, fontFamily: 'Montserrat', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 6 },
  mantItem:      { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  mantText:      { color: CHARCOAL, fontSize: 7.5, fontFamily: 'Helvetica', lineHeight: 1.5, flex: 1 },
  mantPriceRow:  { flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 0.5, borderTopColor: RED_BORDER, borderTopStyle: 'solid' },
  mantPriceLabel:{ color: GRAY, fontSize: 7.5, fontFamily: 'Helvetica', flex: 1 },
  mantPrice:     { color: RED, fontSize: 16, fontFamily: 'SpaceGrotesk', fontWeight: 700 },

  /* ── Obligaciones ── */
  obligRow:    { flexDirection: 'row', gap: 16, marginBottom: 12 },
  obligCol:    { flex: 1 },
  obligHdr:    { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  obligTitle:  { color: DARK, fontSize: 8.5, fontFamily: 'Helvetica-Bold' },
  obligItem:   { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 5 },
  obligDot:    { width: 4, height: 4, borderRadius: 2, backgroundColor: RED_SOFT, marginRight: 8, marginTop: 4, flexShrink: 0 },
  obligText:   { color: CHARCOAL, fontSize: 7.5, fontFamily: 'Helvetica', lineHeight: 1.6, flex: 1 },

  /* ── Legal cards ── */
  legalRow:       { flexDirection: 'row', gap: 8, marginBottom: 12 },
  legalCard:      { flex: 1, padding: 14, borderRadius: 8, backgroundColor: LIGHTER, borderWidth: 0.5, borderColor: BORDER, borderStyle: 'solid' },
  legalIconWrap:  { width: 28, height: 28, borderRadius: 14, backgroundColor: RED_BG, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  legalNum:       { color: RED_SOFT, fontSize: 8, fontFamily: 'SpaceGrotesk', fontWeight: 700, marginBottom: 3 },
  legalCardTitle: { color: DARK, fontSize: 6.5, fontFamily: 'Montserrat', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 6 },
  legalText:      { color: GRAY, fontSize: 7, fontFamily: 'Helvetica', lineHeight: 1.7 },

  /* ── Aceptacion ── */
  aceptText:  { color: GRAY, fontSize: 7.5, fontFamily: 'Helvetica', lineHeight: 1.8, marginBottom: 18 },
  firmaRow:   { flexDirection: 'row', gap: 32 },
  firmaCol:   { flex: 1 },
  firmaTit:   { color: DARK, fontSize: 9, fontFamily: 'SpaceGrotesk', fontWeight: 700, letterSpacing: 2, marginBottom: 18 },
  firmaLine:  { borderBottomWidth: 0.5, borderBottomColor: CHARCOAL, borderBottomStyle: 'solid', paddingBottom: 3, marginBottom: 5 },
  firmaLabel: { color: GRAY_MED, fontSize: 7, fontFamily: 'Helvetica' },

  /* ── Page chrome ── */
  pageNum:     { position: 'absolute', bottom: 18, right: 40, color: RED, fontSize: 8, fontFamily: 'SpaceGrotesk', fontWeight: 700, letterSpacing: 1 },
  pageNumSep:  { position: 'absolute', bottom: 22, right: 58, width: 16, height: 0.5, backgroundColor: BORDER },
  footer:      { position: 'absolute', bottom: 18, left: 40, color: GRAY_MED, fontSize: 6.5, fontFamily: 'Helvetica', letterSpacing: 2 },
  watermark:   { position: 'absolute', right: 30, color: 'rgba(192,0,26,0.025)', fontSize: 28, fontFamily: 'SpaceGrotesk', fontWeight: 700, letterSpacing: 14 },
})

/* ─── Shared layout components ─────────────────────────────────────────── */
function Header({ logo, fecha, pageNum }: { logo: string; fecha: string; pageNum: string }) {
  return (
    <View style={s.hdr}>
      <View style={s.hdrLeft}>
        <View style={s.hdrLogoW}><Image src={logo} style={s.hdrLogo} /></View>
        <Text style={s.hdrBrand}>KIANZO</Text>
        <Text style={s.hdrDot}>.</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Text style={s.hdrRight}>PROPUESTA COMERCIAL  |  {fDate(fecha)}</Text>
      </View>
    </View>
  )
}

function SecHeader({ num, title, icon, decorNum }: { num: string; title: string; icon?: React.ReactNode; decorNum?: string }) {
  return (
    <View style={s.secWrap}>
      <Text style={s.decorNum}>{decorNum ?? num}</Text>
      <View style={s.secRow}>
        <Text style={s.secNum}>{num}</Text>
        {icon && <View style={{ marginRight: 6 }}>{icon}</View>}
        <Text style={s.secTitle}>{title}</Text>
      </View>
      <View style={s.secLine} />
    </View>
  )
}

function PageChrome({ num }: { num: string }) {
  return (
    <>
      <Text style={s.footer}>kianzo.com</Text>
      <View style={s.pageNumSep} />
      <Text style={s.pageNum}>{num}</Text>
    </>
  )
}

/* ─── Main export ──────────────────────────────────────────────────────── */
export default function PresupuestoPDF({ data, logo }: { data: PDFPresupuestoData; logo: string }) {
  const incluyeItems  = data.alcanceIncluye?.split('\n').map(l => l.trim()).filter(Boolean) ?? []
  const noIncluyeItems = data.alcanceNoIncluye?.split('\n').map(l => l.trim()).filter(Boolean) ?? []

  const infoEntries = [
    { label: 'Cliente',     value: data.cliente  || '---', icon: <IUser sz={13} /> },
    { label: 'Empresa',     value: data.empresa  || '---', icon: <IBuilding sz={13} /> },
    { label: 'Telefono',    value: data.telefono || '---', icon: <IPhone sz={13} /> },
    { label: 'Email',       value: data.email    || '---', icon: <IMail sz={13} /> },
    { label: 'Fecha',       value: fDate(data.fechaEmision), icon: <ICalendar sz={13} /> },
    { label: 'Responsable', value: 'Kianzo Team',           icon: <IUser sz={13} /> },
  ]

  return (
    <Document>
      {/* ══ PAGE 1: COVER ══ */}
      <Page size="A4" style={s.coverPage}>
        <View style={s.coverAccent} />
        <PetalCluster right={60} top={300} op={0.04} />
        <Petal right={45} top={540} opacity={0.03} size={1.2} />
        <Petal right={80} top={580} opacity={0.025} size={0.9} />

        {/* Geometric accent — top right */}
        <View style={{ position: 'absolute', right: 0, top: 0, width: 200, height: 200 }}>
          <Svg width={200} height={200}>
            <Path d="M200 0 L200 200 L0 0 Z" fill={RED} fillOpacity={0.06} />
          </Svg>
        </View>
        <View style={{ position: 'absolute', right: 0, top: 0, width: 120, height: 120 }}>
          <Svg width={120} height={120}>
            <Path d="M120 0 L120 120 L0 0 Z" fill={RED} fillOpacity={0.04} />
          </Svg>
        </View>

        <View style={s.coverBody}>
          <View style={s.coverBrandRow}>
            <Image src={logo} style={s.coverLogo} />
            <View style={s.coverBrandText}>
              <Text style={s.coverBrandName}>KIANZO</Text>
              <Text style={s.coverBrandSub}>ESTUDIO DIGITAL</Text>
            </View>
          </View>

          <View style={s.coverRedLine} />
          <Text style={s.coverT1}>PROPUESTA</Text>
          <Text style={s.coverT2}>COMERCIAL</Text>
          <Text style={s.coverSub}>Acuerdo de desarrollo</Text>
        </View>

        <View style={s.coverFooter}>
          <View style={s.coverFooterLine} />
          <View style={s.coverFooterRow}>
            <View>
              <Text style={s.coverKaizen}>KAIZEN</Text>
              <Text style={s.coverTagline}>{'Disenado con precision.\nConstruido para evolucionar.'}</Text>
            </View>
            <View>
              <Text style={s.coverMetaLabel}>Preparado para</Text>
              <Text style={s.coverMetaValue}>{data.cliente || '---'}</Text>
              <Text style={[s.coverMetaLabel, { marginTop: 8 }]}>Fecha</Text>
              <Text style={s.coverMetaValue}>{fDate(data.fechaEmision)}</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* ══ PAGE 2: INFO + DESC + SERVICES ══ */}
      <Page size="A4" style={s.contentPage}>
        <View style={s.accentBar} />
        <Header logo={logo} fecha={data.fechaEmision} pageNum="01" />
        <Petal right={50} top={88} opacity={0.045} size={0.85} />
        <Text style={[s.watermark, { top: 400 }]}>KAIZEN</Text>

        <View style={s.body}>
          <SecHeader num="01" title="INFORMACION GENERAL" icon={<IUser sz={14} />} />
          <View style={s.infoGrid}>
            {infoEntries.map(e => (
              <View key={e.label} style={s.infoCell}>
                <View style={s.infoIconRow}>
                  {e.icon}
                  <Text style={s.infoLabel}>{e.label}</Text>
                </View>
                <Text style={s.infoValue}>{e.value}</Text>
              </View>
            ))}
          </View>

          <SecHeader num="02" title="DESCRIPCION DEL PROYECTO" icon={<IFileText sz={14} />} />
          <Text style={s.descQ}>Que se desarrollara?</Text>
          <Text style={s.descT}>{data.descripcion || '---'}</Text>

          <SecHeader num="03" title="SERVICIOS CONTRATADOS" icon={<IBriefcase sz={14} />} />
          <View style={s.svcGrid}>
            {SERVICIOS.map(svc => {
              const on = data.servicio === svc || (svc === 'Mantenimiento' && data.contrataMantenimiento)
              return (
                <View key={svc} style={[s.svcChip, on && s.svcChipOn]}>
                  <View style={[s.svcDot, on && s.svcDotOn]}>
                    {on && <CheckSvg sz={8} />}
                  </View>
                  <Text style={on ? s.svcLabelOn : s.svcLabel}>{svc}</Text>
                </View>
              )
            })}
          </View>
        </View>

        <PageChrome num="01" />
      </Page>

      {/* ══ PAGE 3: SCOPE + TIMELINE + INVESTMENT ══ */}
      <Page size="A4" style={s.contentPage}>
        <View style={s.accentBar} />
        <Header logo={logo} fecha={data.fechaEmision} pageNum="02" />
        <Petal right={46} top={700} opacity={0.04} size={1.0} />

        <View style={s.body}>
          <SecHeader num="04" title="ALCANCE" />
          <View style={s.alcRow}>
            <View style={s.alcCol}>
              <View style={[s.alcHdr, { backgroundColor: DARK }]}>
                <Text style={s.alcHdrText}>INCLUYE</Text>
              </View>
              {incluyeItems.map((item, i) => (
                <View key={i} style={s.alcItem}>
                  <View style={{ marginRight: 6, marginTop: 1 }}><CheckCircleSvg /></View>
                  <Text style={s.alcText}>{item}</Text>
                </View>
              ))}
            </View>
            <View style={s.alcCol}>
              <View style={[s.alcHdr, { backgroundColor: GRAY }]}>
                <Text style={s.alcHdrText}>NO INCLUYE</Text>
              </View>
              {noIncluyeItems.map((item, i) => (
                <View key={i} style={s.alcItem}>
                  <View style={{ marginRight: 6, marginTop: 1 }}><XCircleSvg /></View>
                  <Text style={s.alcText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={s.alcNote}>
            <Text style={s.alcNoteT}>
              Toda funcionalidad o seccion que no este detallada en el apartado Incluye se considera fuera del alcance original del proyecto y podra requerir un nuevo presupuesto y/o extension de plazos.
            </Text>
          </View>

          <SecHeader num="05" title="PLAZOS" icon={<IClock sz={14} />} />
          <View style={s.plRow}>
            {[
              { label: 'Fecha de inicio',   value: fDate(data.fechaInicio),   icon: <ICalendar sz={18} /> },
              { label: 'Fecha de entrega',  value: fDate(data.fechaEntrega),  icon: <ICalendar sz={18} /> },
              { label: 'Duracion estimada', value: data.duracionEstimada || '---', icon: <IClock sz={18} /> },
            ].map(({ label, value, icon }) => (
              <View key={label} style={s.plCard}>
                <View style={s.plIcon}>{icon}</View>
                <Text style={s.plLabel}>{label}</Text>
                <Text style={s.plValue}>{value}</Text>
              </View>
            ))}
          </View>
          <Text style={s.plNote}>
            Los plazos son estimativos y pueden verse afectados por demoras en la entrega de contenido o respuestas del cliente.
          </Text>

          <SecHeader num="06" title="INVERSION" icon={<IWallet sz={14} />} />
          <View style={s.invTable}>
            <View style={s.invHeader}>
              <Text style={[s.invHeaderT, { flex: 1 }]}>Concepto</Text>
              <Text style={s.invHeaderT}>Monto (USD)</Text>
            </View>
            <View style={s.invRow}>
              <Text style={s.invConcept}>Valor total del proyecto</Text>
              <Text style={s.invAmount}>{fUSD(data.monto)}</Text>
            </View>
            <View style={[s.invRow, s.invRowAlt]}>
              <Text style={s.invConcept}>Anticipo ({data.monto && data.anticipo ? Math.round((data.anticipo / data.monto) * 100) : '50'}%)</Text>
              <Text style={s.invAmount}>{fUSD(data.anticipo)}</Text>
            </View>
            <View style={s.invRow}>
              <Text style={s.invConcept}>Saldo restante</Text>
              <Text style={s.invAmount}>{fUSD(data.saldo)}</Text>
            </View>
            <View style={s.invRowTotal}>
              <Text style={s.invConceptT}>TOTAL</Text>
              <Text style={s.invAmountT}>{fUSD(data.monto)}</Text>
            </View>
          </View>

          {data.formaDePago && (
            <View style={s.payInfo}>
              <Text style={s.payLabel}>Forma de pago</Text>
              <Text style={s.payText}>{data.formaDePago}</Text>
            </View>
          )}
          {data.rondasRevision != null && (
            <View style={[s.payInfo, { marginTop: 8 }]}>
              <Text style={s.payLabel}>Revisiones</Text>
              <Text style={s.payText}>El proyecto incluye {data.rondasRevision} ronda{data.rondasRevision !== 1 ? 's' : ''} de cambios dentro del alcance original.</Text>
            </View>
          )}
        </View>

        <PageChrome num="02" />
      </Page>

      {/* ══ PAGE 4: MAINTENANCE + OBLIGATIONS + LEGAL + ACCEPTANCE ══ */}
      <Page size="A4" style={s.contentPage}>
        <View style={s.accentBar} />
        <Header logo={logo} fecha={data.fechaEmision} pageNum="03" />
        <Petal right={52} top={100} opacity={0.04} size={0.85} />
        <Text style={[s.watermark, { bottom: 120 }]}>KAIZEN</Text>

        <View style={s.body}>
          <SecHeader num="07" title="MANTENIMIENTO" icon={<IShieldCheck sz={14} />} />
          {data.contrataMantenimiento ? (
            <View style={s.mantBox}>
              <View style={s.mantHdr}>
                <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: RED, alignItems: 'center', justifyContent: 'center' }}>
                  <CheckSvg sz={10} />
                </View>
                <Text style={s.mantTitle}>SI CONTRATA MANTENIMIENTO</Text>
              </View>
              <View style={s.mantCols}>
                <View style={s.mantCol}>
                  <Text style={s.mantSubTitle}>Incluye</Text>
                  {MANT_INCLUYE.map((item, i) => (
                    <View key={i} style={s.mantItem}>
                      <View style={{ marginRight: 6 }}><CheckCircleSvg sz={10} /></View>
                      <Text style={s.mantText}>{item}</Text>
                    </View>
                  ))}
                </View>
                <View style={s.mantCol}>
                  <Text style={s.mantSubTitle}>No incluye</Text>
                  {MANT_NO_INCLUYE.map((item, i) => (
                    <View key={i} style={s.mantItem}>
                      <View style={{ marginRight: 6 }}><XCircleSvg sz={10} /></View>
                      <Text style={s.mantText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={s.mantPriceRow}>
                <Text style={s.mantPriceLabel}>Valor del mantenimiento:</Text>
                <Text style={s.mantPrice}>{fUSD(data.valorMantenimiento)} / {data.periodicidadMantenimiento || 'mes'}</Text>
              </View>
            </View>
          ) : (
            <View style={s.mantBoxNo}>
              <View style={s.mantHdrNo}>
                <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: LIGHT, borderWidth: 1, borderColor: BORDER, borderStyle: 'solid', alignItems: 'center', justifyContent: 'center' }}>
                  <XSvg sz={8} />
                </View>
                <Text style={[s.mantTitle, { color: GRAY }]}>NO CONTRATA MANTENIMIENTO</Text>
              </View>
              <Text style={s.mantText}>
                El cliente sera responsable de la contratacion, renovacion y administracion del hosting, dominio y toda la infraestructura necesaria. Kianzo no sera responsable por interrupciones, vencimientos o fallas derivadas de la falta de mantenimiento de dicha infraestructura.
              </Text>
            </View>
          )}

          <SecHeader num="08" title="OBLIGACIONES" decorNum="08" />
          <View style={s.obligRow}>
            <View style={s.obligCol}>
              <View style={s.obligHdr}>
                <Text style={[s.secNum, { marginRight: 6 }]}>08</Text>
                <Text style={s.obligTitle}>Del cliente</Text>
              </View>
              {OBLIG_CLIENTE.map((item, i) => (
                <View key={i} style={s.obligItem}>
                  <View style={s.obligDot} />
                  <Text style={s.obligText}>{item}</Text>
                </View>
              ))}
            </View>
            <View style={s.obligCol}>
              <View style={s.obligHdr}>
                <Text style={[s.secNum, { marginRight: 6 }]}>09</Text>
                <Text style={s.obligTitle}>De Kianzo</Text>
              </View>
              {OBLIG_KIANZO.map((item, i) => (
                <View key={i} style={s.obligItem}>
                  <View style={s.obligDot} />
                  <Text style={s.obligText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View wrap={false}>
            <View style={s.legalRow}>
              {[
                { num: '10', title: 'Garantia',              text: 'Garantia tecnica de 30 dias corridos posteriores a la entrega para corregir errores de funcionamiento atribuibles al desarrollo original.', Icon: IShieldCheck },
                { num: '11', title: 'Confidencialidad',      text: 'Ambas partes se comprometen a mantener confidencialidad sobre la informacion comercial, tecnica o estrategica intercambiada.', Icon: ILock },
                { num: '12', title: 'Propiedad Intelectual', text: 'Una vez abonado el 100% del proyecto, el cliente adquiere los derechos de uso del trabajo realizado.', Icon: ICopyright },
              ].map(({ num, title, text, Icon }) => (
                <View key={num} style={s.legalCard}>
                  <View style={s.legalIconWrap}><Icon sz={14} /></View>
                  <Text style={s.legalNum}>{num}</Text>
                  <Text style={s.legalCardTitle}>{title.toUpperCase()}</Text>
                  <Text style={s.legalText}>{text}</Text>
                </View>
              ))}
            </View>
          </View>

          <View wrap={false}>
            <SecHeader num="13" title="ACEPTACION" icon={<IPenSquare sz={14} />} />
            <Text style={s.aceptText}>
              Al firmar este documento, ambas partes declaran haber leido, comprendido y aceptado la totalidad de los terminos, condiciones, plazos y valores aqui establecidos. El presente acuerdo constituye el entendimiento completo entre las partes respecto al proyecto descrito, y reemplaza cualquier acuerdo previo, verbal o escrito, relacionado con el mismo objeto. Ambas partes se comprometen a cumplir con las obligaciones, plazos y condiciones de pago detallados en este documento.
            </Text>
            <View style={s.firmaRow}>
              {['CLIENTE', 'KIANZO'].map(parte => (
                <View key={parte} style={s.firmaCol}>
                  <Text style={s.firmaTit}>{parte}</Text>
                  {['Firma', 'Aclaracion', 'Fecha'].map(field => (
                    <View key={field} style={{ marginBottom: 18 }}>
                      <View style={s.firmaLine} />
                      <Text style={s.firmaLabel}>{field}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </View>

        <PageChrome num="03" />
      </Page>
    </Document>
  )
}
