'use client';

import { useEffect, useRef } from 'react';

type StepIcon = 'consult' | 'doc' | 'grid' | 'check';

const StepSVG = ({ k }: { k: StepIcon }) => {
  switch (k) {
    case 'consult':
      return (
        <svg viewBox="0 0 36 36" fill="none" stroke="#ff8090" strokeWidth="1.4" strokeLinecap="round">
          <circle cx="18" cy="14" r="7" />
          <path d="M6 32c0-6.627 5.373-12 12-12s12 5.373 12 12" />
        </svg>
      );
    case 'doc':
      return (
        <svg viewBox="0 0 36 36" fill="none" stroke="#ff8090" strokeWidth="1.4" strokeLinecap="round">
          <rect x="4" y="6" width="28" height="24" rx="2" />
          <line x1="4" y1="13" x2="32" y2="13" />
          <line x1="10" y1="19" x2="26" y2="19" />
          <line x1="10" y1="24" x2="20" y2="24" />
        </svg>
      );
    case 'grid':
      return (
        <svg viewBox="0 0 36 36" fill="none" stroke="#ff8090" strokeWidth="1.4" strokeLinecap="round">
          <rect x="3" y="3" width="13" height="13" rx="1.5" />
          <rect x="20" y="3" width="13" height="13" rx="1.5" />
          <rect x="3" y="20" width="13" height="13" rx="1.5" />
          <rect x="20" y="20" width="13" height="13" rx="1.5" />
        </svg>
      );
    case 'check':
      return (
        <svg viewBox="0 0 36 36" fill="none" stroke="#ff8090" strokeWidth="1.4" strokeLinecap="round">
          <path d="M6 18l8 8L30 10" />
          <circle cx="18" cy="18" r="15" />
        </svg>
      );
  }
};

const steps: { num: string; title: string; desc: string; ja: string; icon: StepIcon }[] = [
  {
    num: '01',
    title: 'Primera consulta',
    desc: 'Nos contás tu idea y lo que necesitás. Sin compromiso y sin costo. Respondemos en 24 hs.',
    ja: '相談 · Consulta',
    icon: 'consult',
  },
  {
    num: '02',
    title: 'Propuesta & precio',
    desc: 'En 48 hs recibís una propuesta detallada con tiempos, alcance y costo exacto. Sin letras chicas.',
    ja: '提案 · Propuesta',
    icon: 'doc',
  },
  {
    num: '03',
    title: 'Diseño & desarrollo',
    desc: 'Construimos tu proyecto con actualizaciones periódicas. Podés ver el avance en todo momento.',
    ja: '開発 · Desarrollo',
    icon: 'grid',
  },
  {
    num: '04',
    title: 'Entrega & soporte',
    desc: 'Lanzamos tu proyecto y te capacitamos para usarlo. Seguimos disponibles post-entrega.',
    ja: '完成 · Entrega',
    icon: 'check',
  },
];

export default function Process() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const stepEls = track.querySelectorAll<HTMLElement>('.process-step');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            track.classList.add('line-in');
            stepEls.forEach((s, i) => {
              setTimeout(() => s.classList.add('step-visible'), 200 + i * 180);
            });
            obs.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    obs.observe(track);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="proceso" className="kianzo-section proceso-section">
      <div className="proceso-top-fade" />
      <div className="proceso-content">
        <div className="process-header">
          <div className="sec-eyebrow">
            <div className="sec-line" />
            <span className="sec-tag">Proceso</span>
            <span className="sec-tag-ja">プロセス</span>
          </div>
          <h2 className="sec-title">
            ¿Cómo <strong>trabajamos?</strong>
          </h2>
          <p>
            Un proceso claro y transparente, de principio a fin. Sin
            tecnicismos, sin sorpresas.
          </p>
        </div>

        <div className="process-track" ref={trackRef}>
          {steps.map((s) => (
            <div className="process-step" key={s.num}>
              <div className="step-bubble">
                <span className="step-num-badge">{s.num}</span>
                <StepSVG k={s.icon} />
              </div>
              <div className="step-title">{s.title}</div>
              <p className="step-desc">{s.desc}</p>
              <div className="step-ja">{s.ja}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
