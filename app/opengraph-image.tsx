import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Kianzo — Diseño Web, Apps Móviles & Automatización en Mendoza';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0D0D0D',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Red glow top-right */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-80px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(192,0,26,0.35) 0%, transparent 70%)',
          }}
        />
        {/* Red glow bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-60px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(192,0,26,0.2) 0%, transparent 70%)',
          }}
        />

        {/* Top: brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '22px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            KI<span style={{ color: '#C0001A' }}>·</span>ANZO
          </span>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '14px', letterSpacing: '0.1em' }}>· Mendoza, Argentina</span>
        </div>

        {/* Center: headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '16px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            Diseño · Desarrollo · Automatización
          </div>
          <div style={{ color: '#ffffff', fontSize: '72px', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
            Páginas web que
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ color: '#C0001A', fontSize: '72px', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
              convierten.
            </div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '22px', marginTop: '8px' }}>
            Apps móviles · E-commerce · Automatización con IA · Desde USD 250
          </div>
        </div>

        {/* Bottom: url */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '16px', letterSpacing: '0.08em' }}>kianzo.org</span>
          <div style={{
            background: '#C0001A',
            color: '#fff',
            fontSize: '15px',
            fontWeight: 600,
            padding: '12px 28px',
            borderRadius: '8px',
            letterSpacing: '0.06em',
          }}>
            Ver proyectos →
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
