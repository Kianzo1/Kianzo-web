import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kianzo · Panel interno',
    short_name: 'Kianzo',
    description: 'Panel interno de Kianzo — agenda, proyectos, finanzas y más.',
    start_url: '/admin/dashboard',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0D0D0D',
    theme_color: '#0D0D0D',
    lang: 'es-AR',
    icons: [
      { src: '/logo-kianzo.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/logo-kianzo.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/logo-kianzo.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
