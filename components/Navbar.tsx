'use client';

import { useEffect, useState } from 'react';

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
        <a href="#hero" className="nav-logo">
          <NavLogo />
          <div>
            <span className="nav-logo-text">
              Kianzo<span>.</span>
            </span>
            <span className="nav-ja">キアンゾ</span>
          </div>
        </a>
        <ul className="nav-links">
          <li><a href="#servicios">Servicios</a></li>
          <li><a href="#proceso">Proceso</a></li>
          <li><a href="#nosotros">Nosotros</a></li>
          <li><a href="#contacto" className="nav-cta">Hablemos</a></li>
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
        <a href="#servicios" onClick={close}>Servicios</a>
        <a href="#proceso" onClick={close}>Proceso</a>
        <a href="#nosotros" onClick={close}>Nosotros</a>
        <a href="#contacto" className="drawer-cta" onClick={close}>Hablemos</a>
      </div>
    </>
  );
}
