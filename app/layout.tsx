import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Noto_Sans_JP, Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Providers from '@/components/Providers';
import './globals.css';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif-var',
  display: 'swap',
});

const ja = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ja-var',
  display: 'swap',
});

const body = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-body-var',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kianzo.org'),
  title: 'Kianzo | Diseño Web, Apps Móviles & Automatización · Mendoza',
  description:
    'Kianzo — Páginas web profesionales, apps móviles y automatización de procesos para negocios en Mendoza, Argentina. Landing pages, e-commerce y chatbots desde USD 250. Cotización gratis.',
  keywords: [
    'diseño web mendoza',
    'desarrollo web mendoza',
    'páginas web mendoza',
    'agencia web mendoza',
    'apps móviles mendoza',
    'landing page mendoza',
    'landing page argentina',
    'e-commerce mendoza',
    'e-commerce argentina',
    'desarrollador web mendoza',
    'agencia digital mendoza',
    'páginas web para empresas mendoza',
    'crear página web mendoza',
    'diseño web profesional argentina',
    'automatización whatsapp mendoza',
    'automatización de procesos mendoza',
    'automatización n8n',
    'chatbot whatsapp mendoza',
    'chatbot para negocios',
    'automatización para pymes argentina',
    'apps móviles argentina',
    'desarrollo app móvil mendoza',
    'kianzo',
    'kianzo web',
    'kianzo mendoza',
  ],
  authors: [{ name: 'Kianzo' }],
  creator: 'Kianzo',
  alternates: { canonical: 'https://kianzo.org' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://kianzo.org',
    siteName: 'Kianzo',
    title: 'Kianzo | Diseño Web, Apps Móviles & Automatización en Mendoza',
    description:
      'Páginas web profesionales, apps móviles y automatización de procesos para negocios en Mendoza, Argentina. Desde USD 250.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Kianzo — Diseño Web, Apps Móviles & Automatización en Mendoza',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kianzo | Diseño Web, Apps Móviles & Automatización',
    description: 'Páginas web, apps y automatización para negocios. Mendoza, Argentina.',
    images: ['/opengraph-image'],
  },
  robots: { index: true, follow: true },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Kianzo',
  },
};

export const viewport: Viewport = {
  themeColor: '#0D0D0D',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Kianzo',
  description: 'Agencia de desarrollo web, aplicaciones móviles y automatización de procesos en Mendoza, Argentina.',
  url: 'https://kianzo.org',
  email: 'kianzo.web@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Mendoza',
    addressRegion: 'Mendoza',
    addressCountry: 'AR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -32.8908,
    longitude: -68.8272,
  },
  openingHours: 'Mo-Fr 09:00-18:00',
  priceRange: 'USD 250 - USD 700+',
  sameAs: ['https://instagram.com/kianzo.ar', 'https://tiktok.com/@kianzo.web'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicios Digitales Kianzo',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Landing Page', description: 'Página de aterrizaje profesional, entrega en 7 días.' },
        price: '250',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Web Institucional', description: 'Sitio web multi-sección con panel admin, blog y SEO.' },
        price: '450',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'E-commerce', description: 'Tienda online con carrito, MercadoPago y gestión de stock.' },
        price: '700',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Automatización de Procesos', description: 'Automatización con n8n: chatbots de WhatsApp, CRM, notificaciones y flujos de trabajo para pymes.' },
        price: '300',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'App Móvil', description: 'Aplicaciones móviles nativas para iOS y Android.' },
        price: '800',
        priceCurrency: 'USD',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${serif.variable} ${ja.variable} ${body.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-black text-white antialiased">
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
