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
    'Kianzo — Desarrollo de páginas web profesionales y aplicaciones móviles en Mendoza, Argentina. Landing pages, e-commerce, webs institucionales desde USD 150. Cotización gratis.',
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
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
