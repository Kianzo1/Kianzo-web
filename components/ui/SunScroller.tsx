'use client';

import { useEffect, useRef } from 'react';

export default function SunScroller() {
  const wrapRef = useRef<HTMLButtonElement>(null);
  const discRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const disc = discRef.current;
    if (!wrap || !disc) return;

    const RADIUS = 21; // px (radio del sol = 42px / 2)
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

    let rotation = 0;
    let lastScrollY = window.scrollY;
    let rafId = 0;
    let running = true;

    const loop = () => {
      if (!running) return;

      const sy = window.scrollY;
      const visible = sy > window.innerHeight * 0.8;
      wrap.style.opacity = visible ? '1' : '0';
      wrap.style.pointerEvents = visible ? 'auto' : 'none';

      const scrollDelta = sy - lastScrollY;
      rotation += (scrollDelta / CIRCUMFERENCE) * 360;
      lastScrollY = sy;

      disc.style.transform = `rotate(${rotation}deg)`;

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <button
      ref={wrapRef}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="sun-scroller"
      aria-label="Volver al inicio"
      title="Volver al inicio"
    >
      {/* Tooltip de inicio */}
      <span className="sun-scroller-label" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
        <span>Inicio</span>
      </span>

      {/* Glow exterior */}
      <span className="sun-scroller-glow" />

      {/* Disco sólido que rota */}
      <span className="sun-scroller-disc" ref={discRef} />

      {/* Anillo exterior */}
      <span className="sun-scroller-ring" />
    </button>
  );
}
