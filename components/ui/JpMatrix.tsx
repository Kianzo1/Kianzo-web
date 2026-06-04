'use client';

const KATA =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ';

/**
 * Lluvia de katakana estilo "matrix", recoloreada a rojo Kianzo.
 * Caracteres deterministas (función del índice) → sin mismatch de hidratación SSR/cliente.
 */
export default function JpMatrix({
  count = 520,
  className = '',
}: {
  count?: number;
  className?: string;
}) {
  const chars = Array.from(
    { length: count },
    (_, i) => KATA[(i * 7 + 13) % KATA.length]
  );

  return (
    <div className={`jp-matrix ${className}`} aria-hidden>
      {chars.map((c, i) => (
        <span key={i}>{c}</span>
      ))}
    </div>
  );
}
