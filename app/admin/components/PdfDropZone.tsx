'use client'

import { useRef } from 'react'
import type { DragEvent, ChangeEvent } from 'react'
import { FilePdf, UploadSimple, X } from '@phosphor-icons/react'

type Props = {
  archivo: File | null
  onFile: (f: File | null) => void
}

export default function PdfDropZone({ archivo, onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = [false, (_: boolean) => {}]

  function handleDragOver(e: DragEvent) { e.preventDefault() }
  function handleDrop(e: DragEvent) {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f && (f.type === 'application/pdf' || f.name.endsWith('.pdf'))) onFile(f)
  }
  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) onFile(f)
  }

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !archivo && inputRef.current?.click()}
        style={{
          border: `1.5px dashed ${archivo ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.12)'}`,
          borderRadius: 10,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          background: archivo ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
          transition: 'all 0.2s',
          cursor: archivo ? 'default' : 'pointer',
        }}
      >
        {archivo ? (
          <>
            <FilePdf size={26} color="#10B981" />
            <p style={{ fontSize: 13, color: '#fff', margin: 0, fontWeight: 500 }}>{archivo.name}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>{(archivo.size / 1024).toFixed(0)} KB</p>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onFile(null) }}
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', textDecoration: 'underline', textUnderlineOffset: 3 }}
            >
              <X size={11} /> Quitar archivo
            </button>
          </>
        ) : (
          <>
            <UploadSimple size={24} color="rgba(255,255,255,0.2)" />
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
              Arrastrá el PDF o hacé click para seleccionar
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: 0 }}>Solo archivos PDF</p>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleInput}
        style={{ display: 'none' }}
      />
    </div>
  )
}
