'use client';

import { useEffect, useRef } from 'react';

const MountainSVG = () => (
  <svg
    className="fuji-main"
    viewBox="0 0 700 600"
    preserveAspectRatio="xMidYMax meet"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="mG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e8e6e3" />
        <stop offset="28%" stopColor="#bbb9b6" />
        <stop offset="70%" stopColor="#3a3a3a" />
        <stop offset="100%" stopColor="#181818" />
      </linearGradient>
      <linearGradient id="sG" x1="0" y1="0" x2=".3" y2="1">
        <stop offset="0%" stopColor="#fff" />
        <stop offset="100%" stopColor="#d8d6d3" />
      </linearGradient>
    </defs>
    <rect width="700" height="600" fill="#0d0d0d" />
    <ellipse cx="350" cy="490" rx="320" ry="60" fill="rgba(192,0,26,0.06)" />
    <circle cx="200" cy="320" r="8" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
    <path d="M480 230L620 490H340Z" fill="#181818" opacity=".6" />
    <path d="M350 80L580 490H120Z" fill="url(#mG)" />
    <path d="M350 80L395 170Q375 183 350 177Q325 183 305 170Z" fill="url(#sG)" />
    <path d="M350 80L580 490Q465 400 350 370Z" fill="rgba(0,0,0,.4)" />
    <line x1="80" y1="490" x2="620" y2="490" stroke="rgba(255,255,255,.08)" strokeWidth=".7" />
    <g opacity=".18" fill="#C0001A">
      <rect x="290" y="430" width="4" height="55" />
      <rect x="336" y="430" width="4" height="55" />
      <rect x="282" y="428" width="60" height="4" rx="1" />
      <rect x="286" y="436" width="52" height="3" rx="1" />
    </g>
  </svg>
);

const SunOrb = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="hero-sun"
    aria-label="Activar sol"
  >
    <span className="hero-sun-glow" />
    <span className="hero-sun-disc">
      <span className="hero-sun-spec" />
    </span>
    <span className="hero-sun-ring hero-sun-ring-1" />
    <span className="hero-sun-ring hero-sun-ring-2" />
  </button>
);

export default function Hero() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const kanji1Ref = useRef<HTMLDivElement>(null);
  const kanji2Ref = useRef<HTMLDivElement>(null);
  const fujiRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const strongRef = useRef<HTMLElement>(null);

  // Combined SCROLL + MOUSE parallax
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let scrollY = 0;
    let mx = 0,
      my = 0;
    let pending = false;
    let raf = 0;

    const apply = () => {
      pending = false;
      // scroll deltas + mouse deltas (mouse in normalized -1..1)
      const sy = scrollY;
      if (parallaxRef.current)
        parallaxRef.current.style.transform = `translate3d(${mx * 18}px, ${sy * 0.25 + my * 12}px, 0)`;
      if (glowRef.current)
        glowRef.current.style.transform = `translate3d(${mx * 30 + sy * 0.05}px, ${my * 25 - sy * 0.12}px, 0)`;
      if (kanji1Ref.current)
        kanji1Ref.current.style.transform = `translate3d(${mx * 40 + sy * 0.08}px, ${my * 30 + sy * 0.35}px, 0)`;
      if (kanji2Ref.current)
        kanji2Ref.current.style.transform = `translate3d(${-mx * 25 - sy * 0.05}px, ${-my * 20 - sy * 0.2}px, 0)`;
      if (fujiRef.current)
        fujiRef.current.style.transform = `translate3d(${-mx * 14}px, ${-my * 10 - sy * 0.12}px, 0)`;
      if (sunRef.current)
        sunRef.current.style.transform = `translate3d(${-mx * 28}px, ${-my * 22 - sy * 0.18}px, 0)`;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(apply);
      }
    };

    const onMouse = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      mx = (e.clientX / r.width - 0.5) * 2;
      my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(apply);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });
    apply();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouse);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Katana slash on click
  const handleSlash = () => {
    const el = strongRef.current;
    if (!el) return;
    el.classList.remove('slash-active');
    void el.offsetWidth;
    el.classList.add('slash-active');
    try {
      const a = new Audio('/sounds/sword.mp3');
      a.volume = 0.35;
      void a.play().catch(() => {});
    } catch {}
  };

  // Sun click → pro rotation + glow pulse + sound
  const handleSunClick = () => {
    const el = sunRef.current;
    if (!el) return;
    el.classList.remove('hero-sun-active');
    void el.offsetWidth;
    el.classList.add('hero-sun-active');
    try {
      const a = new Audio('/sounds/sword.mp3');
      a.volume = 0.2;
      a.playbackRate = 1.6;
      void a.play().catch(() => {});
    } catch {}
  };

  return (
    <section ref={sectionRef} className="hero" id="hero">
      <div className="hero-bg-parallax" ref={parallaxRef}>
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="gR" cx="60%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#C0001A" stopOpacity=".1" />
              <stop offset="100%" stopColor="#C0001A" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1440" height="900" fill="#0D0D0D" />
          <rect width="1440" height="900" fill="url(#gR)" />
          <g stroke="rgba(255,255,255,0.024)" strokeWidth=".5">
            <line x1="0" y1="300" x2="1440" y2="300" />
            <line x1="0" y1="600" x2="1440" y2="600" />
            <line x1="480" y1="0" x2="480" y2="900" />
            <line x1="960" y1="0" x2="960" y2="900" />
          </g>
        </svg>
      </div>

      <div className="kanji-deco kanji-1" aria-hidden ref={kanji1Ref}>山<br />技</div>
      <div className="kanji-deco kanji-2" aria-hidden ref={kanji2Ref}>道</div>
      <div className="hero-glow" ref={glowRef} />

      <div className="hero-left">
        <div className="hero-tag">Desarrollo digital · Mendoza, Argentina</div>
        <h1 className="hero-title">
          <span className="word w1"><span className="word-inner">Diseño</span></span>{' '}
          <span className="word w2"><span className="word-inner">que</span></span>
          <br />
          <strong ref={strongRef} onClick={handleSlash}>
            <span className="word w3"><span className="word-inner">trasciende.</span></span>
          </strong>
          <br />
          <span className="word w4"><span className="word-inner">Código</span></span>{' '}
          <span className="word w5"><span className="word-inner">que funciona.</span></span>
        </h1>
        <p className="hero-sub">
          Páginas web y aplicaciones móviles construidas con precisión y disciplina.
          Cada proyecto, una obra.
        </p>
        <div className="hero-btns">
          <a href="#servicios" className="btn-red">Ver servicios</a>
          <a href="#contacto" className="btn-outline">Cotizá gratis →</a>
        </div>
      </div>

      <div className="hero-right">
        <div className="fuji-wrap" ref={fujiRef}>
          <MountainSVG />
        </div>
        <div className="hero-sun-wrap" ref={sunRef}>
          <SunOrb onClick={handleSunClick} />
        </div>
      </div>

      <div className="hero-scroll">
        <div className="scroll-bar" />
        Scroll
      </div>
    </section>
  );
}
