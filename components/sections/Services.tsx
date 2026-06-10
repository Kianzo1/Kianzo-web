'use client';

import { useEffect, useRef } from 'react';
import { useLang } from '@/context/LanguageContext';

type IconKey = 'landing' | 'web' | 'ecommerce' | 'app' | 'mantenimiento' | 'custom' | 'automation';

const Icon = ({ k }: { k: IconKey }) => {
  switch (k) {
    case 'landing': return (<svg viewBox="0 0 30 30" fill="none" stroke="#C0001A" strokeWidth="1.4" strokeLinecap="round"><rect x="2" y="5" width="26" height="18" rx="2" /><line x1="2" y1="10" x2="28" y2="10" /><circle cx="5.5" cy="7.5" r="1" fill="#C0001A" stroke="none" /><circle cx="9" cy="7.5" r="1" fill="#C0001A" stroke="none" /><line x1="8" y1="17" x2="22" y2="17" /><line x1="8" y1="20" x2="17" y2="20" /></svg>);
    case 'web': return (<svg viewBox="0 0 30 30" fill="none" stroke="#C0001A" strokeWidth="1.4" strokeLinecap="round"><rect x="2" y="3" width="26" height="24" rx="2" /><line x1="2" y1="9" x2="28" y2="9" /><line x1="9" y1="3" x2="9" y2="9" /><line x1="7" y1="14" x2="23" y2="14" /><line x1="7" y1="18" x2="20" y2="18" /><line x1="7" y1="22" x2="16" y2="22" /></svg>);
    case 'ecommerce': return (<svg viewBox="0 0 30 30" fill="none" stroke="#C0001A" strokeWidth="1.4" strokeLinecap="round"><rect x="2" y="3" width="26" height="24" rx="2" /><line x1="2" y1="9" x2="28" y2="9" /><rect x="7" y="13" width="7" height="7" rx="1" /><rect x="16" y="13" width="7" height="3" rx="1" /><rect x="16" y="18" width="7" height="2" rx=".5" /><line x1="7" y1="23" x2="23" y2="23" /></svg>);
    case 'app': return (<svg viewBox="0 0 30 30" fill="none" stroke="#C0001A" strokeWidth="1.4" strokeLinecap="round"><rect x="8" y="2" width="14" height="26" rx="3" /><line x1="8" y1="7" x2="22" y2="7" /><line x1="8" y1="23" x2="22" y2="23" /><circle cx="15" cy="25.5" r="1" fill="#C0001A" stroke="none" /></svg>);
    case 'mantenimiento': return (<svg viewBox="0 0 30 30" fill="none" stroke="#C0001A" strokeWidth="1.4" strokeLinecap="round"><circle cx="15" cy="15" r="5" /><path d="M15 2v4M15 24v4M2 15h4M24 15h4M6.34 6.34l2.83 2.83M20.83 20.83l2.83 2.83M6.34 23.66l2.83-2.83M20.83 9.17l2.83-2.83" /></svg>);
    case 'custom': return (<svg viewBox="0 0 30 30" fill="none" stroke="#C0001A" strokeWidth="1.4" strokeLinecap="round"><path d="M4 22L10 16L14 20L20 12L26 16" /><rect x="3" y="3" width="24" height="24" rx="2" /><circle cx="22" cy="8" r="3" /></svg>);
    case 'automation': return (<svg viewBox="0 0 30 30" fill="none" stroke="#C0001A" strokeWidth="1.4" strokeLinecap="round"><path d="M4 6h22a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H14l-6 5v-5H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" /><circle cx="10" cy="14" r="1" fill="#C0001A" stroke="none" /><circle cx="15" cy="14" r="1" fill="#C0001A" stroke="none" /><circle cx="20" cy="14" r="1" fill="#C0001A" stroke="none" /></svg>);
  }
};

export default function Services() {
  const { t } = useLang();
  const headerRef = useRef<HTMLDivElement>(null);

  const cards = [
    { k: 'landing' as IconKey, num: '01', name: t('svc1_name'), tagline: t('svc1_tagline'), tags: [t('svc1_t1'), t('svc1_t2'), t('svc1_t3')], price: 'USD 200', priceMuted: t('svc_price_muted') },
    { k: 'web' as IconKey, num: '02', name: t('svc2_name'), tagline: t('svc2_tagline'), tags: [t('svc2_t1'), t('svc2_t2'), t('svc2_t3'), t('svc2_t4')], price: 'USD 350', priceMuted: t('svc_price_muted') },
    { k: 'ecommerce' as IconKey, num: '03', name: t('svc3_name'), tagline: t('svc3_tagline'), tags: [t('svc3_t1'), t('svc3_t2'), t('svc3_t3')], price: 'USD 500', priceMuted: t('svc_price_muted') },
    { k: 'automation' as IconKey, num: '04', name: t('svc4_name'), tagline: t('svc4_tagline'), tags: [t('svc4_t1'), t('svc4_t2'), t('svc4_t3')], price: t('svc_consult'), priceMuted: t('svc_consult_muted'), badge: { text: t('svc_badge_new'), variant: 'new' as const } },
    { k: 'app' as IconKey, num: '05', name: t('svc5_name'), tagline: t('svc5_tagline'), tags: [t('svc5_t1'), t('svc5_t2'), t('svc5_t3')], price: t('svc_consult'), priceMuted: t('svc_quote_free') },
    { k: 'mantenimiento' as IconKey, num: '06', name: t('svc6_name'), tagline: t('svc6_tagline'), tags: [t('svc6_t1'), t('svc6_t2'), t('svc6_t3')], price: 'USD 15', priceMuted: t('svc_month') },
  ];

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const targets = el.querySelectorAll('[data-reveal]');
    const obs = new IntersectionObserver((entries) => { entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } }); }, { threshold: 0.2 });
    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const cardEls = document.querySelectorAll<HTMLElement>('.svc-card');
    const cleanup: (() => void)[] = [];
    cardEls.forEach((card) => {
      const onMove = (e: MouseEvent) => { const r = card.getBoundingClientRect(); card.style.setProperty('--mx', `${e.clientX - r.left}px`); card.style.setProperty('--my', `${e.clientY - r.top}px`); };
      card.addEventListener('mousemove', onMove);
      cleanup.push(() => card.removeEventListener('mousemove', onMove));
    });
    return () => cleanup.forEach((fn) => fn());
  }, []);

  useEffect(() => {
    const grid = document.querySelector('.svc-grid');
    if (!grid) return;
    const obs = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      const { animate, stagger } = await import('animejs');
      animate('.svc-card', {
        translateY: [40, 0],
        opacity: [0, 1],
        scale: [0.96, 1],
        duration: 900,
        delay: stagger(80),
        easing: 'cubicBezier(0.16, 1, 0.3, 1)',
      });
    }, { threshold: 0.08 });
    obs.observe(grid);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="servicios" className="kianzo-section" ref={headerRef}>
      <div className="svc-header">
        <div data-reveal="left">
          <div className="sec-eyebrow">
            <div className="sec-line" />
            <span className="sec-tag">{t('svc_tag')}</span>
            <span className="sec-tag-ja">サービス</span>
          </div>
          <h2 className="sec-title">{t('svc_title_1')} <strong>{t('svc_title_2')}</strong></h2>
        </div>
        <p className="svc-desc" data-reveal="right">{t('svc_desc')}</p>
      </div>

      <div className="svc-grid">
        {cards.map((c) => (
          <div className="svc-card" key={c.num}>
            <div className="svc-card-glow" />
            {c.badge && <div className={`svc-badge${c.badge.variant === 'new' ? ' svc-badge-new' : ''}`}>{c.badge.text}</div>}
            <div className="svc-icon-wrap"><Icon k={c.k} /></div>
            <div className="svc-num">{c.num}</div>
            <div className="svc-name">{c.name}</div>
            <div className="svc-tagline">{c.tagline}</div>
            <div className="svc-tags">{c.tags.map((tag) => <span className="svc-tag" key={tag}>{tag}</span>)}</div>
            <div className={`svc-price${c.price === t('svc_consult') || c.price === 'Gratis' ? ' svc-price-muted' : ''}`}>
              {c.price}{c.priceMuted && <small>{c.priceMuted}</small>}
            </div>
          </div>
        ))}
      </div>

      <div className="combo-bar" data-reveal="blur">
        <div>
          <h3>{t('combo_title')}</h3>
          <p>{t('combo_desc')}</p>
        </div>
        <a href="https://wa.me/5492616272454?text=Hola%2C%20me%20interesa%20el%20combo%20Web%20%2B%20App%20M%C3%B3vil%20con%2020%25%20off" target="_blank" rel="noopener noreferrer" className="combo-pill">
          {t('combo_pill')}
        </a>
      </div>
    </section>
  );
}
