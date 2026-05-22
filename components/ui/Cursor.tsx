'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    setSupported(fine);
    setMounted(true);
    if (!fine) return;

    let tx = -200,
      ty = -200;
    let dx = -200,
      dy = -200;
    let rx = -200,
      ry = -200;
    let raf = 0;
    let running = true;

    const loop = () => {
      dx += (tx - dx) * 0.85;
      dy += (ty - dy) * 0.85;
      rx += (tx - rx) * 0.22;
      ry += (ty - ry) * 0.22;
      if (dotRef.current)
        dotRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      if (running) raf = requestAnimationFrame(loop);
    };

    const move = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const onOver = (e: Event) => {
      const t = (e.target as HTMLElement)?.closest?.('a, button, [role="button"]');
      if (t) {
        dotRef.current?.classList.add('cursor-hover');
        ringRef.current?.classList.add('cursor-hover');
      }
    };
    const onOut = (e: Event) => {
      const t = (e.target as HTMLElement)?.closest?.('a, button, [role="button"]');
      if (t) {
        dotRef.current?.classList.remove('cursor-hover');
        ringRef.current?.classList.remove('cursor-hover');
      }
    };

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!mounted || !supported) return null;

  return createPortal(
    <>
      <div className="cursor" ref={dotRef} aria-hidden />
      <div className="cursor-ring" ref={ringRef} aria-hidden />
    </>,
    document.body
  );
}
