'use client';

import Link from 'next/link';
import { useEffect, useRef, useCallback } from 'react';
import { useLang } from '@/context/LanguageContext';
import allProjects from '@/lib/projects';

// Home siempre muestra solo los featured (máx 3)
const projects = allProjects.filter(p => p.featured).slice(0, 3);

// ── Preload animejs once at module level ──────────────────────────────────────
let _animate: any = null;
let _stagger: any = null;
let _animePromise: Promise<void> | null = null;

function preloadAnime() {
  if (_animePromise) return _animePromise;
  _animePromise = import('animejs').then(({ animate, stagger }) => {
    _animate = animate;
    _stagger = stagger;
  });
  return _animePromise;
}

// Preload on module import (not on hover)
if (typeof window !== 'undefined') preloadAnime();

export default function Portfolio() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let io: IntersectionObserver;

    preloadAnime().then(() => {
      io = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        _animate(headerRef.current?.querySelectorAll('.port-ani-word'), {
          translateY: ['100%', '0%'],
          opacity: [0, 1],
          duration: 900,
          delay: _stagger(80),
          easing: 'cubicBezier(0.16, 1, 0.3, 1)',
        });

        _animate(gridRef.current?.querySelectorAll('.port-ani-card'), {
          translateY: [60, 0],
          opacity: [0, 1],
          scale: [0.96, 1],
          duration: 1000,
          delay: _stagger(120, { start: 250 }),
          easing: 'cubicBezier(0.16, 1, 0.3, 1)',
        });

        _animate(ctaRef.current?.querySelector('.port-ani-line'), {
          width: ['0%', '100%'],
          duration: 1200,
          delay: 600,
          easing: 'cubicBezier(0.16, 1, 0.3, 1)',
        });

        _animate(ctaRef.current?.querySelectorAll('.port-ani-cta-el'), {
          translateY: [20, 0],
          opacity: [0, 1],
          duration: 800,
          delay: _stagger(100, { start: 500 }),
          easing: 'cubicBezier(0.16, 1, 0.3, 1)',
        });

      }, { threshold: 0.1 });

      if (sectionRef.current) io.observe(sectionRef.current);
    });

    return () => io?.disconnect();
  }, []);

  // useCallback so functions aren't recreated on every render
  const handleCardEnter = useCallback((i: number, el: HTMLElement) => {
    if (!_animate) return;
    _animate(el.querySelector('.port-ani-img'),    { scale: 1.08, duration: 600, easing: 'cubicBezier(0.16,1,0.3,1)' });
    _animate(el.querySelector('.port-ani-overlay'), { opacity: 1,  duration: 350, easing: 'linear' });
    _animate(el.querySelector('.port-ani-cta-pill'),{ translateY: [10, 0], opacity: [0, 1], duration: 400, easing: 'cubicBezier(0.16,1,0.3,1)' });
    _animate(el.querySelector('.port-ani-bar'),     { width: ['0%', '100%'], duration: 500, easing: 'cubicBezier(0.16,1,0.3,1)' });
    _animate(el, { translateY: -6, duration: 400, easing: 'cubicBezier(0.16,1,0.3,1)' });
  }, []);

  const handleCardLeave = useCallback((el: HTMLElement) => {
    if (!_animate) return;
    _animate(el.querySelector('.port-ani-img'),    { scale: 1,  duration: 500, easing: 'cubicBezier(0.16,1,0.3,1)' });
    _animate(el.querySelector('.port-ani-overlay'), { opacity: 0, duration: 300, easing: 'linear' });
    _animate(el.querySelector('.port-ani-cta-pill'),{ opacity: 0, duration: 250, easing: 'linear' });
    _animate(el.querySelector('.port-ani-bar'),     { width: '0%', duration: 400, easing: 'cubicBezier(0.16,1,0.3,1)' });
    _animate(el, { translateY: 0, duration: 400, easing: 'cubicBezier(0.16,1,0.3,1)' });
  }, []);

  return (
    <section id="portfolio" ref={sectionRef} className="portfolio-section port-v3-section">

      {/* ── Header ── */}
      <div ref={headerRef} className="port-v3-header kianzo-section" style={{ paddingBottom: '2rem' }}>
        <div>
          <div className="sec-eyebrow">
            <div className="sec-line" />
            <span className="sec-tag">{t('port_tag')}</span>
            <span className="sec-tag-ja">作品集</span>
          </div>
          <h2 className="sec-title" style={{ overflow: 'hidden' }}>
            <span className="port-ani-word" style={{ display:'inline-block', opacity:0, transform:'translateY(100%)' }}>
              {t('port_title_1')}&nbsp;
            </span>
            <strong>
              <span className="port-ani-word" style={{ display:'inline-block', opacity:0, transform:'translateY(100%)' }}>
                {t('port_title_strong')}
              </span>
            </strong>
          </h2>
        </div>
        <div className="port-v3-header-right">
          <p className="svc-desc port-ani-word" style={{ maxWidth: 270, textAlign: 'right', opacity: 0, transform: 'translateY(20px)' }}>
            {t('port_desc')}
          </p>
          <Link href="/portfolio" className="btn-glow port-ani-word" style={{ opacity: 0, transform: 'translateY(20px)', fontSize: '0.72rem', padding: '0.55rem 1.4rem' }}>
            {t('port_view_all')}
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
              <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* ── Cards ── */}
      <div className="port-v3-grid kianzo-section" style={{ paddingTop: '3rem' }} ref={gridRef}>
        {projects.map((p, i) => (
          <a
            key={p.slug}
            href={p.comingSoon ? undefined : p.url}
            target={p.url.startsWith('http') && !p.comingSoon ? '_blank' : '_self'}
            rel="noopener noreferrer"
            aria-disabled={p.comingSoon}
            className={`port-ani-card port-v3-card-new${p.comingSoon ? ' port-v3-card--soon' : ''}`}
            style={{ opacity: 0, '--pcolor': p.color } as React.CSSProperties}
            onMouseEnter={e => !p.comingSoon && handleCardEnter(i, e.currentTarget as HTMLElement)}
            onMouseLeave={e => !p.comingSoon && handleCardLeave(e.currentTarget as HTMLElement)}
          >
            <div className="port-v3n-img-wrap">
              <img
                src={p.img}
                alt={p.title}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                width={800}
                height={500}
                className="port-ani-img"
              />
              <div className="port-ani-overlay port-v3n-overlay">
                <span className="port-ani-cta-pill port-v3n-pill">{t('port_cta')}</span>
              </div>
              <span className="port-v3n-num">{p.num}</span>
            </div>
            <div className="port-v3n-body">
              <div>
                <span className="port-card-cat">{p.catLabel}</span>
                <h3 className="port-v3n-title">{p.title}</h3>
                <p className="port-v3n-desc">{p.desc}</p>
              </div>
              <div className="port-v3n-footer">
                <div className="port-card-tags">
                  {p.tags.map(tag => <span key={tag} className="port-tag">{tag}</span>)}
                </div>
                <span className="port-v3n-arrow">↗</span>
              </div>
            </div>
            <div className="port-ani-bar port-v3n-bar" />
          </a>
        ))}
      </div>

      {/* ── Métricas + CTA ── */}
      <div ref={ctaRef} className="port-metrics">
        <div className="port-ani-line port-v3n-top-line" />
        <div className="port-metrics-grid">
          {[
            { num: '+3',   label: 'Proyectos\nentregados',    ja: 'プロジェクト' },
            { num: '100%', label: 'Clientes\nsatisfechos',    ja: '満足度' },
            { num: '7',    label: 'Días promedio\nde entrega', ja: '納期' },
            { num: '48h',  label: 'Tiempo de\nrespuesta',     ja: '対応時間' },
          ].map((m, i) => (
            <div key={i} className="port-ani-cta-el port-metric-item" style={{ opacity: 0 }}>
              <span className="port-metric-num">{m.num}</span>
              <span className="port-metric-ja">{m.ja}</span>
              <span className="port-metric-label">{m.label.split('\n').map((l, j) => <span key={j}>{l}<br/></span>)}</span>
            </div>
          ))}
          <div className="port-ani-cta-el port-metric-cta" style={{ opacity: 0 }}>
            <p className="port-metric-cta-text">{t('port_desc')}</p>
            <Link href="/portfolio" className="btn-glow">
              {t('port_view_all')}
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
