'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type Variant = 'up' | 'left' | 'right' | 'scale' | 'blur';

type Props = {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
};

export default function RevealWrapper({
  children,
  variant = 'up',
  delay = 0,
  className = '',
  as: Tag = 'div',
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible(true), delay);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  const variantClass = `reveal-${variant}`;
  const Element = Tag as 'div';

  return (
    <Element
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal ${variantClass} ${visible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </Element>
  );
}
