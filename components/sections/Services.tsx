'use client';

import { useEffect, useRef } from 'react';

type IconKey =
  | 'landing'
  | 'web'
  | 'ecommerce'
  | 'app'
  | 'mantenimiento'
  | 'custom'
  | 'automation';

const Icon = ({ k }: { k: IconKey }) => {
  switch (k) {
    case 'landing':
      return (
        <svg viewBox="0 0 30 30" fill="none" stroke="#C0001A" strokeWidth="1.4" strokeLinecap="round">
          <rect x="2" y="5" width="26" height="18" rx="2" />
          <line x1="2" y1="10" x2="28" y2="10" />
          <circle cx="5.5" cy="7.5" r="1" fill="#C0001A" stroke="none" />
          <circle cx="9" cy="7.5" r="1" fill="#C0001A" stroke="none" />
          <line x1="8" y1="17" x2="22" y2="17" />
          <line x1="8" y1="20" x2="17" y2="20" />
        </svg>
      );
    case 'web':
      return (
        <svg viewBox="0 0 30 30" fill="none" stroke="#C0001A" strokeWidth="1.4" strokeLinecap="round">
          <rect x="2" y="3" width="26" height="24" rx="2" />
          <line x1="2" y1="9" x2="28" y2="9" />
          <line x1="9" y1="3" x2="9" y2="9" />
          <line x1="7" y1="14" x2="23" y2="14" />
          <line x1="7" y1="18" x2="20" y2="18" />
          <line x1="7" y1="22" x2="16" y2="22" />
        </svg>
      );
    case 'ecommerce':
      return (
        <svg viewBox="0 0 30 30" fill="none" stroke="#C0001A" strokeWidth="1.4" strokeLinecap="round">
          <rect x="2" y="3" width="26" height="24" rx="2" />
          <line x1="2" y1="9" x2="28" y2="9" />
          <rect x="7" y="13" width="7" height="7" rx="1" />
          <rect x="16" y="13" width="7" height="3" rx="1" />
          <rect x="16" y="18" width="7" height="2" rx=".5" />
          <line x1="7" y1="23" x2="23" y2="23" />
        </svg>
      );
    case 'app':
      return (
        <svg viewBox="0 0 30 30" fill="none" stroke="#C0001A" strokeWidth="1.4" strokeLinecap="round">
          <rect x="8" y="2" width="14" height="26" rx="3" />
          <line x1="8" y1="7" x2="22" y2="7" />
          <line x1="8" y1="23" x2="22" y2="23" />
          <circle cx="15" cy="25.5" r="1" fill="#C0001A" stroke="none" />
        </svg>
      );
    case 'mantenimiento':
      return (
        <svg viewBox="0 0 30 30" fill="none" stroke="#C0001A" strokeWidth="1.4" strokeLinecap="round">
          <circle cx="15" cy="15" r="5" />
          <path d="M15 2v4M15 24v4M2 15h4M24 15h4M6.34 6.34l2.83 2.83M20.83 20.83l2.83 2.83M6.34 23.66l2.83-2.83M20.83 9.17l2.83-2.83" />
        </svg>
      );
    case 'custom':
      return (
        <svg viewBox="0 0 30 30" fill="none" stroke="#C0001A" strokeWidth="1.4" strokeLinecap="round">
          <path d="M4 22L10 16L14 20L20 12L26 16" />
          <rect x="3" y="3" width="24" height="24" rx="2" />
          <circle cx="22" cy="8" r="3" />
        </svg>
      );
    case 'automation':
      return (
        <svg viewBox="0 0 30 30" fill="none" stroke="#C0001A" strokeWidth="1.4" strokeLinecap="round">
          <path d="M4 6h22a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H14l-6 5v-5H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
          <circle cx="10" cy="14" r="1" fill="#C0001A" stroke="none" />
          <circle cx="15" cy="14" r="1" fill="#C0001A" stroke="none" />
          <circle cx="20" cy="14" r="1" fill="#C0001A" stroke="none" />
        </svg>
      );
  }
};

type Card = {
  k: IconKey;
  num: string;
  name: string;
  tagline: string;
  tags: string[];
  price: string;
  priceMuted?: string;
  badge?: { text: string; variant?: 'default' | 'new' };
};

const cards: Card[] = [
  {
    k: 'landing',
    num: '01',
    name: 'Landing Page',
    tagline: 'Tu negocio en la web en 7 días',
    tags: ['Diseño a medida', 'Carga rápida', 'SEO básico'],
    price: 'USD 200',
    priceMuted: 'precio base',
  },
  {
    k: 'web',
    num: '02',
    name: 'Web Institucional',
    tagline: 'Presencia profesional completa',
    tags: ['Multi-sección', 'Panel admin', 'Blog', 'SEO avanzado'],
    price: 'USD 350',
    priceMuted: 'precio base',
  },
  {
    k: 'ecommerce',
    num: '03',
    name: 'E-commerce',
    tagline: 'Vendé las 24 hs, los 7 días',
    tags: ['Carrito de compras', 'MercadoPago', 'Gestión de stock'],
    price: 'USD 500',
    priceMuted: 'precio base',
  },
  {
    k: 'automation',
    num: '04',
    name: 'Automatización WhatsApp',
    tagline: 'Tu negocio responde solo, las 24 horas',
    tags: ['Respuestas 24/7', 'IA Conversacional', 'Agenda automática'],
    price: 'Consultar',
    priceMuted: 'cotización a medida',
    badge: { text: 'Nuevo', variant: 'new' },
  },
  {
    k: 'app',
    num: '05',
    name: 'App Móvil',
    tagline: 'Tu negocio en el bolsillo de tus clientes',
    tags: ['Android & iOS', 'Multiplataforma', 'Nativa'],
    price: 'Consultar',
    priceMuted: 'cotización gratis',
  },
  {
    k: 'mantenimiento',
    num: '06',
    name: 'Mantenimiento',
    tagline: 'Tu sitio siempre en perfecto estado',
    tags: ['Actualizaciones', 'Seguridad', 'Soporte mensual'],
    price: 'USD 15',
    priceMuted: 'aprox / mes',
  },
];

export default function Services() {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const targets = el.querySelectorAll('[data-reveal]');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, []);

  // Spotlight: el glow sigue el cursor dentro de cada card
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('.svc-card');
    const cleanup: (() => void)[] = [];
    cards.forEach((card) => {
      const onMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      };
      card.addEventListener('mousemove', onMove);
      cleanup.push(() => card.removeEventListener('mousemove', onMove));
    });
    return () => cleanup.forEach((fn) => fn());
  }, []);

  return (
    <section id="servicios" className="kianzo-section" ref={headerRef}>
      <div className="svc-header">
        <div data-reveal="left">
          <div className="sec-eyebrow">
            <div className="sec-line" />
            <span className="sec-tag">Servicios</span>
            <span className="sec-tag-ja">サービス</span>
          </div>
          <h2 className="sec-title">
            Lo que <strong>construimos</strong>
          </h2>
        </div>
        <p className="svc-desc" data-reveal="right">
          Desde una landing page hasta una app completa. Soluciones para
          negocios que quieren destacar.
        </p>
      </div>

      <div className="svc-grid">
        {cards.map((c) => (
          <div className="svc-card" key={c.num}>
            <div className="svc-card-glow" />
            {c.badge && (
              <div
                className={`svc-badge${
                  c.badge.variant === 'new' ? ' svc-badge-new' : ''
                }`}
              >
                {c.badge.text}
              </div>
            )}
            <div className="svc-icon-wrap">
              <Icon k={c.k} />
            </div>
            <div className="svc-num">{c.num}</div>
            <div className="svc-name">{c.name}</div>
            <div className="svc-tagline">{c.tagline}</div>
            <div className="svc-tags">
              {c.tags.map((t) => (
                <span className="svc-tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
            <div
              className={`svc-price${
                c.price === 'Consultar' || c.price === 'Gratis'
                  ? ' svc-price-muted'
                  : ''
              }`}
            >
              {c.price}
              {c.priceMuted && <small>{c.priceMuted}</small>}
            </div>
          </div>
        ))}
      </div>

      <div className="combo-bar" data-reveal="blur">
        <div>
          <h3>Combo Web + App Móvil</h3>
          <p>
            Contratá ambos servicios juntos y accedé a un descuento especial.
            La solución digital completa para tu negocio.
          </p>
        </div>
        <a
          href="https://wa.me/5492616272454?text=Hola%2C%20me%20interesa%20el%20combo%20Web%20%2B%20App%20M%C3%B3vil%20con%2020%25%20off"
          target="_blank"
          rel="noopener noreferrer"
          className="combo-pill"
        >
          20% OFF · Consultar
        </a>
      </div>
    </section>
  );
}
