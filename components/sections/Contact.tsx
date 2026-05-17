'use client';

import { EnvelopeSimple, WhatsappLogo } from '@phosphor-icons/react';

export default function Contact() {
  return (
    <section id="contacto" className="kianzo-section contact-section">
      <div className="contact-bg" aria-hidden />
      <div className="contact-inner">
        <div className="sec-eyebrow contact-eyebrow" data-reveal="up">
          <div className="sec-line" />
          <span className="sec-tag">Hablemos</span>
          <span className="sec-tag-ja">連絡</span>
        </div>

        <h2 className="sec-title contact-title" data-reveal="up">
          ¿Listo para <strong>empezar</strong>?
        </h2>

        <p className="contact-desc" data-reveal="up">
          Contanos tu proyecto. Te respondemos en menos de 48 horas con una
          cotización sin compromiso.
        </p>

        <div className="contact-actions" data-reveal="up">
          <a
            href="https://wa.me/549XXXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-btn contact-btn-wa"
          >
            <WhatsappLogo weight="fill" size={18} />
            <span>WhatsApp</span>
            <span className="contact-btn-arrow">→</span>
          </a>
          <a href="mailto:hola@kianzo.com" className="contact-btn contact-btn-ghost">
            <EnvelopeSimple weight="light" size={18} />
            <span>hola@kianzo.com</span>
            <span className="contact-btn-arrow">→</span>
          </a>
        </div>

        <div className="contact-meta" data-reveal="up">
          <span>Mendoza · AR</span>
          <span className="contact-meta-dot" />
          <span>Respuesta &lt; 48 hs</span>
          <span className="contact-meta-dot" />
          <span>Cotización gratis</span>
          <span className="contact-meta-dot" />
          <span>LATAM</span>
        </div>
      </div>
    </section>
  );
}
