'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CaretUpDown, Check } from '@phosphor-icons/react'

export type SelectOption = { value: string; label: string; sublabel?: string; color?: string }

type Props = {
  value: string
  onChange: (v: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  style?: React.CSSProperties
  required?: boolean
}

export default function CustomSelect({ value, onChange, options, placeholder = 'Seleccioná...', disabled, style, required }: Props) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)

  const selected = options.find(o => o.value === value)

  function openDropdown() {
    if (disabled) return
    if (!btnRef.current) return
    const r = btnRef.current.getBoundingClientRect()
    // Si no cabe abajo, abrir arriba
    const spaceBelow = window.innerHeight - r.bottom
    const menuH = Math.min(options.length * 44 + 16, 280)
    const top = spaceBelow < menuH ? r.top - menuH - 4 : r.bottom + 4
    setPos({ top, left: r.left, width: r.width })
    setOpen(true)
  }

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  const baseStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 8, padding: '10px 14px', color: selected ? '#fff' : 'rgba(255,255,255,0.3)',
    fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box',
    fontFamily: 'inherit', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1, textAlign: 'left', transition: 'border-color 0.15s',
    ...style,
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={openDropdown}
        disabled={disabled}
        style={{ ...baseStyle, borderColor: open ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.09)' }}
        onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.16)' }}
        onMouseLeave={e => { if (!open) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.09)' }}
        aria-required={required}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
          {selected ? (
            <>
              {selected.color && <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: selected.color, marginRight: 8, verticalAlign: 'middle', flexShrink: 0 }} />}
              {selected.label}
              {selected.sublabel && <span style={{ color: 'rgba(255,255,255,0.35)', marginLeft: 8, fontSize: 12 }}>{selected.sublabel}</span>}
            </>
          ) : (
            placeholder
          )}
        </span>
        <CaretUpDown size={14} style={{ flexShrink: 0, opacity: 0.4 }} />
      </button>

      {open && typeof document !== 'undefined' && createPortal(
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 1998 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'fixed', top: pos.top, left: pos.left, width: pos.width,
            zIndex: 1999, background: '#161618', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, overflow: 'hidden auto', maxHeight: 280,
            boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04) inset',
            animation: 'kzSelectIn 0.14s cubic-bezier(0.32,0.72,0,1)',
          }}>
            <style>{`@keyframes kzSelectIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>
            {options.map(o => {
              const isCurrent = o.value === value
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => { onChange(o.value); setOpen(false) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: '10px 14px 10px 12px',
                    background: isCurrent ? 'rgba(192,0,26,0.1)' : 'transparent',
                    borderLeft: isCurrent ? '2px solid #C0001A' : '2px solid transparent',
                    borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                    color: isCurrent ? '#fff' : 'rgba(255,255,255,0.65)',
                    fontSize: 13.5, fontFamily: 'inherit', textAlign: 'left', cursor: 'pointer',
                    transition: 'background 0.12s, border-color 0.12s, color 0.12s',
                  }}
                  onMouseEnter={ev => { const el = ev.currentTarget as HTMLElement; el.style.background = 'rgba(192,0,26,0.12)'; el.style.color = '#fff'; el.style.borderLeftColor = '#C0001A' }}
                  onMouseLeave={ev => { const el = ev.currentTarget as HTMLElement; el.style.background = isCurrent ? 'rgba(192,0,26,0.1)' : 'transparent'; el.style.color = isCurrent ? '#fff' : 'rgba(255,255,255,0.65)'; el.style.borderLeftColor = isCurrent ? '#C0001A' : 'transparent' }}
                >
                  {o.color && <span style={{ width: 8, height: 8, borderRadius: '50%', background: o.color, flexShrink: 0, boxShadow: isCurrent ? `0 0 6px ${o.color}` : 'none' }} />}
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {o.label}
                    {o.sublabel && <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 8, fontSize: 11 }}>{o.sublabel}</span>}
                  </span>
                  {isCurrent && <Check size={13} style={{ flexShrink: 0, opacity: 0.6 }} />}
                </button>
              )
            })}
          </div>
        </>,
        document.body
      )}
    </>
  )
}
