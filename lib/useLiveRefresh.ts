'use client'

import { useEffect, useRef } from 'react'

// Vuelve a ejecutar `onRefresh` cuando:
//  - otra parte del panel dispara el evento global 'kz:refresh' (ej: el bot crea algo)
//  - la pestaña vuelve a tener foco / se vuelve visible
// Así los datos se actualizan solos, sin recargar la página.
export function useLiveRefresh(onRefresh: () => void) {
  const cb = useRef(onRefresh)
  cb.current = onRefresh

  useEffect(() => {
    const handler = () => cb.current()
    const onVisible = () => { if (!document.hidden) cb.current() }

    window.addEventListener('kz:refresh', handler)
    window.addEventListener('focus', handler)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.removeEventListener('kz:refresh', handler)
      window.removeEventListener('focus', handler)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])
}

// Para disparar el refresco desde cualquier lado tras una mutación.
export function emitRefresh() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('kz:refresh'))
}
