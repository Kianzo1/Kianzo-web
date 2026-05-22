import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Noto_Sans_JP, Space_Grotesk } from 'next/font/google';
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
  weight: ['300', '400', '700'],
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
  metadataBase: new URL('https://kianzo.com'),
  title: 'Kianzo | Diseño Web & Apps Móviles en Mendoza, Argentina',
  description:
    'Kianzo — Desarrollo de páginas web profesionales y aplicaciones móviles en Mendoza, Argentina. Landing pages, e-commerce, webs institucionales desde USD 250. Cotización gratis.',
  keywords: [
    'diseño web mendoza',
    'desarrollo web mendoza',
    'páginas web mendoza',
    'apps móviles mendoza',
    'landing page mendoza',
    'e-commerce argentina',
    'desarrollador web mendoza',
    'agencia digital mendoza',
    'automatización whatsapp',
    'kianzo',
  ],
  authors: [{ name: 'Kianzo' }],
  creator: 'Kianzo',
  alternates: { canonical: 'https://kianzo.com' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://kianzo.com',
    siteName: 'Kianzo',
    title: 'Kianzo | Diseño Web & Apps Móviles en Mendoza',
    description:
      'Desarrollo web y apps móviles con precisión japonesa. Mendoza, Argentina.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kianzo | Diseño Web & Apps Móviles',
    description: 'Desarrollo web y apps móviles. Mendoza, Argentina.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0D0D0D',
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Kianzo',
  description: 'Agencia de desarrollo web y aplicaciones móviles en Mendoza, Argentina.',
  url: 'https://kianzo.com',
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
    name: 'Servicios de Desarrollo Web',
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
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
