import type { CSSProperties } from 'react'

export const field: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
}

export const lbl: CSSProperties = {
  fontSize: 11,
  color: 'rgba(255,255,255,0.35)',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
}

export const inp: CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 8,
  padding: '10px 14px',
  color: '#fff',
  fontSize: 14,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
}

export const sectionDivider = (label: string): CSSProperties => ({
  fontSize: 10,
  color: 'rgba(255,255,255,0.22)',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  borderLeft: '2px solid #C0001A',
  paddingLeft: 10,
  marginTop: 8,
})
