'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { stats } from '@/lib/data';

function Counter({ value }: { value: string }) {
  // Parse ONCE — memoize so the effect doesn't re-fire on every render
  const parsed = useMemo(() => {
    const m = value.match(/(\+?)(\d+)(.*)/);
    if (!m) return null;
    return { prefix: m[1], target: parseInt(m[2], 10), suffix: m[3] };
  }, [value]);

  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!parsed) return;
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          obs.disconnect();
          const dur = 1400;
          const start = performance.now();
          let raf = 0;
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(parsed.target * eased));
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          return () => cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [parsed]);

  if (!parsed) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      {parsed.prefix}
      {n}
      {parsed.suffix}
    </span>
  );
}

export default function Stats() {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const items = row.querySelectorAll('.stat');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            items.forEach((it, i) => {
              setTimeout(() => it.classList.add('line-go'), i * 140);
            });
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    obs.observe(row);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="stats-row" ref={rowRef}>
      {stats.map((s) => (
        <div className="stat" key={s.label}>
          <div className="stat-num">
            <Counter value={s.value} />
          </div>
          <div className="stat-jp">{s.ja}</div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
