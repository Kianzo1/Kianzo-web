'use client';

import { useEffect, useState } from 'react';

const KianzoLogo = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="19" stroke="#C0001A" strokeWidth="1" />
    <path d="M20 7L34 30H6Z" fill="none" stroke="#F7F5F2" strokeWidth="1.2" />
    <path d="M13 30Q20 15 27 30" fill="#C0001A" />
    <path d="M15.5 30Q20 19 24.5 30" fill="#0D0D0D" />
    <line x1="5" y1="30" x2="35" y2="30" stroke="#F7F5F2" strokeWidth=".8" opacity=".5" />
  </svg>
);

export default function IntroScreen() {
  const [gone, setGone] = useState(false);
  const [skip, setSkip] = useState<boolean | null>(null);

  useEffect(() => {
    const seen = sessionStorage.getItem('kianzo-intro-seen');
    if (seen) {
      setSkip(true);
      document.body.classList.remove('locked');
      return;
    }
    setSkip(false);
    document.body.classList.add('locked');
    return () => document.body.classList.remove('locked');
  }, []);

  useEffect(() => {
    if (gone) {
      document.body.classList.remove('locked');
      sessionStorage.setItem('kianzo-intro-seen', '1');
    }
  }, [gone]);

  if (skip === null || skip) return null;

  const handleEnter = () => {
    try {
      const audio = new Audio('/sounds/sound.mp3');
      audio.volume = 0.5;
      void audio.play().catch(() => {});
      // Fade out + stop at 7s
      setTimeout(() => {
        const fade = setInterval(() => {
          if (audio.volume > 0.05) {
            audio.volume = Math.max(0, audio.volume - 0.05);
          } else {
            audio.pause();
            audio.currentTime = 0;
            clearInterval(fade);
          }
        }, 80);
      }, 6200);
    } catch {}
    setGone(true);
  };

  return (
    <div className={`intro-screen${gone ? ' gone' : ''}`}>
      <div className="intro-kanji-bg">入</div>
      <div className="intro-content">
        <div className="intro-logo">
          <KianzoLogo />
        </div>
        <div className="intro-name">
          Kianzo<span>.</span>
        </div>
        <div className="intro-ja">キアンゾ</div>
        <div className="intro-tagline">Diseño que trasciende</div>
        <button className="intro-enter" onClick={handleEnter} type="button">
          <span className="intro-line" />
          <span className="intro-text">Entrar</span>
          <span className="intro-arrow">→</span>
        </button>
        <div className="intro-hint">Pulsá para acceder · 入場</div>
      </div>
    </div>
  );
}
