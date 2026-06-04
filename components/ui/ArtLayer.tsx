'use client';

import { useEffect, useRef } from 'react';

type Variant = 'tiger' | 'hannya' | 'fuji' | 'landscape' | 'samurai' | 'paisaje' | 'paisaje2';

/**
 * Capa decorativa de arte ukiyo-e. Se desvanece al entrar en viewport.
 * `variant` mapea a una clase CSS (.art-tiger, .art-hannya, etc.)
 * El samurai usa un <img> rotado para mostrarse horizontal (el archivo es vertical).
 */
export default function ArtLayer({ variant }: { variant: Variant }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('art-in');
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return <div ref={ref} className={`art-deco art-${variant}`} aria-hidden />;
}
