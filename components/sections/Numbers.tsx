'use client';

import { useEffect, useRef, useState } from 'react';

const items = [
  { value: 7, suffix: ' días', label: 'Tiempo promedio de entrega', ja: '納期' },
  { value: 100, suffix: '%', label: 'Clientes satisfechos', ja: '満足度' },
  { value: 2, suffix: '+', label: 'Años desarrollando', ja: '経験' },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          obs.disconnect();
          const dur = 1500;
          const start = performance.now();
          let raf = 0;
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(target * eased));
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {n}
      <span>{suffix}</span>
    </span>
  );
}

export default function Numbers() {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const cells = strip.querySelectorAll<HTMLElement>('.num-item');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            cells.forEach((c, i) =>
              setTimeout(() => c.classList.add('revealed'), i * 120)
            );
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    obs.observe(strip);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="numbers-strip" ref={stripRef}>
      <span className="numbers-strip-kanji" aria-hidden>数</span>
      {items.map((i) => (
        <div className="num-item" key={i.label}>
          <span className="num-big">
            <Counter target={i.value} suffix={i.suffix} />
          </span>
          <span className="num-label">{i.label}</span>
          <span className="num-ja">{i.ja}</span>
        </div>
      ))}
    </div>
  );
}
