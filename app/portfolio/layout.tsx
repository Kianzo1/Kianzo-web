import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio · Proyectos Web & Apps | Kianzo Mendoza',
  description:
    'Proyectos reales de diseño web, e-commerce, apps y automatización desarrollados por Kianzo en Mendoza, Argentina. iStore, Alma Cóndor, Starlight Dancewear y más.',
  keywords: [
    'portfolio diseño web mendoza',
    'proyectos web mendoza',
    'ejemplos de páginas web mendoza',
    'trabajos agencia web mendoza',
    'e-commerce mendoza',
    'tienda online mendoza',
    'app móvil mendoza',
    'kianzo portfolio',
  ],
  alternates: { canonical: 'https://kianzo.org/portfolio' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://kianzo.org/portfolio',
    siteName: 'Kianzo',
    title: 'Portfolio · Proyectos Web & Apps | Kianzo Mendoza',
    description:
      'Proyectos reales de diseño web, e-commerce, apps y automatización por Kianzo en Mendoza.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Kianzo Portfolio — Proyectos Web en Mendoza',
      },
    ],
  },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
