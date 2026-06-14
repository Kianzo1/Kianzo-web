'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Cursor from '@/components/ui/Cursor';
import RevealObserver from '@/components/ui/RevealObserver';
import { useLang } from '@/context/LanguageContext';
import allProjects, { FILTERS, FilterKey } from '@/lib/projects';

// ── Preload animejs once ──────────────────────────────────────────────────────
let _animate: any = null;
let _stagger: any = null;
let _ready: Promise<void> | null = null;
function loadAnime() {
  if (!_ready) _ready = import('animejs').then(({ animate, stagger }) => { _animate = animate; _stagger = stagger; });
  return _ready;
}
if (typeof window !== 'undefined') loadAnime();

export default function PortfolioPage() {
  const { t } = useLang();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [visible, setVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const filtered = activeFilter === 'all'
    ? allProjects
    : allProjects.filter(p => p.cat === activeFilter);

  // Animate header in
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  // Animate focus items on scroll
  useEffect(() => {
    const items = document.querySelectorAll('.pfx-focus-item--anim');
    if (!items.length) return;
    let obs: IntersectionObserver;
    loadAnime().then(() => {
      obs = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        _animate('.pfx-focus-item--anim', {
          opacity: [0, 1],
          translateX: [-32, 0],
          duration: 700,
          delay: _stagger(90),
          easing: 'cubicBezier(0.16, 1, 0.3, 1)',
        });
      }, { threshold: 0.15 });
      obs.observe(items[0] as Element);
    });
    return () => obs?.disconnect();
  }, []);

  // Animate rows on filter change
  useEffect(() => {
    loadAnime().then(() => {
      _animate('.pfx-row', {
        opacity: [0, 1],
        translateY: [18, 0],
        duration: 520,
        delay: _stagger(55),
        easing: 'cubicBezier(0.16, 1, 0.3, 1)',
      });
    });
  }, [activeFilter]);

  return (
    <>
      <Cursor />
      <RevealObserver />
      <Navbar />
      <main className="pfx-main">

        {/* ── HERO ── */}
        <header
          ref={headerRef}
          className="pfx-hero"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <div className="pfx-hero-top">
            <Link href="/" className="btn-glow pfx-back">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M10 2L4 7L10 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t('pf_back')}
            </Link>
            <span className="pfx-hero-count">Portfolio · {allProjects.length} proyectos</span>
          </div>

          <div className="pfx-hero-body">
            <div className="pfx-hero-fuji-wrap">
              <img src="/images/art-fuji.jpg" aria-hidden="true" className="pfx-hero-fuji" alt="" />
              <div className="pfx-hero-fuji-red" />
            </div>
            <div className="pfx-hero-ghost">作品</div>
            <h1 className="pfx-hero-h1" data-reveal="up">
              <span className="pfx-hero-h1-outline">Nuestros</span>
              <span className="pfx-hero-h1-solid">trabajos<span className="pfx-hero-dot">.</span></span>
            </h1>
            <p className="pfx-hero-sub" data-reveal="up" style={{'--reveal-delay':'120ms'} as React.CSSProperties}>{t('pf_sub')}</p>
          </div>

        </header>

        {/* ── FILTER BAR ── */}
        <div className="pfx-filters">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`pfx-filter-btn ${activeFilter === f.key ? 'pfx-filter-btn--active' : ''}`}
              onClick={() => setActiveFilter(f.key as FilterKey)}
            >
              {f.label}
              {f.key !== 'all' && (
                <span className="pfx-filter-count">
                  {allProjects.filter(p => p.cat === f.key).length}
                </span>
              )}
            </button>
          ))}
          <span className="pfx-filter-total">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* ── PROJECT LIST — filas horizontales con thumbnail ── */}
        <div className="pfx-index">
          {filtered.map((p, i) => (
            <a
              key={p.slug}
              href={p.comingSoon ? undefined : p.url}
              target={p.url.startsWith('http') && !p.comingSoon ? '_blank' : '_self'}
              rel="noopener noreferrer"
              aria-disabled={p.comingSoon}
              className={`pfx-row${p.comingSoon ? ' pfx-row--soon' : ''}`}
              data-reveal="up"
              style={{ '--pcolor': p.color, '--reveal-delay': `${i * 70}ms` } as React.CSSProperties}
            >
              <div className="pfx-row-thumb">
                <img src={p.img} alt={p.title} loading="lazy" />
                {p.comingSoon && <span className="pfx-row-soon-badge">Próximamente</span>}
                <span className="pfx-row-thumb-num">{p.num}</span>
              </div>
              <div className="pfx-row-body">
                <span className="pfx-row-cat">{p.catLabel}</span>
                <h3 className="pfx-row-title">{p.title}</h3>
                <p className="pfx-row-desc">{p.desc}</p>
                <div className="pfx-row-tags">
                  {p.tags.map(tag => <span key={tag} className="pfx-tag-sm">{tag}</span>)}
                </div>
              </div>
              <div className="pfx-row-meta">
                <span className="pfx-row-year">{p.year}</span>
                <span className="pfx-row-arrow">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M4 14L14 4M14 4H7M14 4V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="pfx-empty">
            <span>Sin proyectos en esta categoría aún.</span>
          </div>
        )}

        {/* ── STRIP ── */}
        <div className="pfx-strip">
          <div className="pfx-strip-track">
            {['Diseño Web','·','React','·','Next.js','·','TypeScript','·','Apps','·','E-commerce','·','UI/UX','·','Tailwind','·',
              'Diseño Web','·','React','·','Next.js','·','TypeScript','·','Apps','·','E-commerce','·','UI/UX','·','Tailwind','·'].map((w,i) => (
              <span key={i} className={w==='·' ? 'pfx-strip-sep' : 'pfx-strip-item'}>{w}</span>
            ))}
          </div>
        </div>

        {/* ── ENFOQUE ── */}
        <section className="pfx-focus">
          <div className="pfx-focus-left" data-reveal="left">
            <span className="pfx-focus-eyebrow">— Lo que hacemos</span>
            <h2 className="pfx-focus-title">Diseño que<br/><em>convierte.</em></h2>
            <p className="pfx-focus-caption">Cada servicio está construido desde cero, sin templates, con obsesión por el detalle.</p>
          </div>
          <div className="pfx-focus-right">
            {[
              { n:'01', t:'Sitios Institucionales', d:'Landing pages y webs para empresas que necesitan presencia profesional y conversión real.', tag:'WEB' },
              { n:'02', t:'E-commerce', d:'Tiendas online con catálogo, carrito y experiencia de compra premium. Diseño que vende.', tag:'SHOP' },
              { n:'03', t:'Apps & Demos', d:'Prototipos funcionales y apps móviles con diseño nativo. De la idea al producto.', tag:'APP' },
              { n:'04', t:'Restaurantes & Gastronomía', d:'Experiencias visuales cinematográficas para bares, parrillas y hoteles boutique.', tag:'GASTRO' },
            ].map((item, i) => (
              <div key={item.n} className="pfx-focus-item pfx-focus-item--anim" style={{'--fi': i} as React.CSSProperties}>
                <div className="pfx-focus-item-inner">
                  <span className="pfx-focus-num">{item.n}</span>
                  <div className="pfx-focus-item-body">
                    <div className="pfx-focus-item-head">
                      <h3 className="pfx-focus-item-title">{item.t}</h3>
                      <span className="pfx-focus-item-tag">{item.tag}</span>
                    </div>
                    <p className="pfx-focus-item-desc">{item.d}</p>
                  </div>
                  <svg className="pfx-focus-arrow" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M4 14L14 4M14 4H7M14 4V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="pfx-focus-bar"/>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="pfx-cta">
          <div className="pfx-cta-bg">KIANZO</div>
          <p className="pfx-cta-eyebrow" data-reveal="up">{t('pf_cta_label')}</p>
          <h2 className="pfx-cta-h2" data-reveal="up" style={{'--reveal-delay':'80ms'} as React.CSSProperties}>{t('pf_cta_title')}</h2>
          <Link href="/#contacto" className="pfx-cta-btn">
            {t('pf_cta_btn')}
            <span className="pfx-cta-btn-icon">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </Link>
        </section>

      </main>
    </>
  );
}
