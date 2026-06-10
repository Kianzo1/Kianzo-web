'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '@/context/LanguageContext';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01キアンゾ';
const ORIGINAL = 'Kianzo';

function useScramble() {
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef(0);

  const trigger = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(rafRef.current);
    let frame = 0;
    const total = 11;
    const tick = () => {
      const revealed = Math.floor((frame / total) * ORIGINAL.length);
      let out = '';
      for (let i = 0; i < ORIGINAL.length; i++) {
        out += i < revealed
          ? ORIGINAL[i]
          : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      el.textContent = out;
      frame++;
      if (frame <= total) rafRef.current = requestAnimationFrame(tick);
      else el.textContent = ORIGINAL;
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);
  return { ref, trigger };
}

const NavLogo = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="19" stroke="#C0001A" strokeWidth="1" />
    <path d="M20 7L34 30H6Z" fill="none" stroke="#F7F5F2" strokeWidth="1.2" />
    <path d="M13 30Q20 15 27 30" fill="#C0001A" />
    <path d="M15.5 30Q20 19 24.5 30" fill="#0D0D0D" />
    <line x1="5" y1="30" x2="35" y2="30" stroke="#F7F5F2" strokeWidth=".8" opacity=".5" />
  </svg>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { lang, setLang, t } = useLang();
  const { ref: logoRef, trigger: scrambleLogo } = useScramble();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setDrawerOpen(false);

  return (
    <>
      <nav className={`kianzo-nav${scrolled ? ' scrolled' : ''}`}>
        <a href="/" className="nav-logo" onMouseEnter={scrambleLogo} onClick={(e) => { e.preventDefault(); router.push('/'); window.scrollTo({ top: 0 }); }}>
          <NavLogo />
          <div>
            <span className="nav-logo-text">
              <span ref={logoRef}>Kianzo</span><span>.</span>
            </span>
            <span className="nav-ja">キアンゾ</span>
          </div>
        </a>
        <ul className="nav-links">
          <li><a href="#servicios">{t('nav_servicios')}</a></li>
          <li><a href="#proceso">{t('nav_proceso')}</a></li>
          <li><a href="#nosotros">{t('nav_nosotros')}</a></li>
          <li><a href="#contacto" className="nav-cta">{t('nav_cta')}</a></li>
          <li>
            <button className="lang-btn" onClick={() => setLang(lang === 'ES' ? 'EN' : 'ES')} aria-label="Cambiar idioma">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/>
              </svg>
              <span className="lang-active">{lang}</span>
              <span className="lang-sep" />
              <span className="lang-inactive">{lang === 'ES' ? 'EN' : 'ES'}</span>
            </button>
          </li>
        </ul>
        <button
          className={`nav-hamburger${drawerOpen ? ' open' : ''}`}
          aria-label="Menú"
          onClick={() => setDrawerOpen((v) => !v)}
          type="button"
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`nav-drawer${drawerOpen ? ' open' : ''}`}>
        <a href="#servicios" onClick={close}>{t('nav_servicios')}</a>
        <a href="#proceso" onClick={close}>{t('nav_proceso')}</a>
        <a href="#nosotros" onClick={close}>{t('nav_nosotros')}</a>
        <a href="#contacto" className="drawer-cta" onClick={close}>{t('nav_cta')}</a>
      </div>
    </>
  );
}
