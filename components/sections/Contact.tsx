'use client';

import { EnvelopeSimple, WhatsappLogo } from '@phosphor-icons/react';
import { useLang } from '@/context/LanguageContext';

export default function Contact() {
  const { t } = useLang();

  return (
    <section id="contacto" className="kianzo-section contact-section">
      <div className="contact-bg" aria-hidden />
      <div className="contact-inner">
        <div className="sec-eyebrow contact-eyebrow" data-reveal="up">
          <div className="sec-line" />
          <span className="sec-tag">{t('contact_tag')}</span>
          <span className="sec-tag-ja">連絡</span>
        </div>

        <h2 className="sec-title contact-title" data-reveal="up">
          {t('contact_title_1')} <strong>{t('contact_title_2')}</strong>{t('contact_title_3')}
        </h2>

        <p className="contact-desc" data-reveal="up">{t('contact_desc')}</p>

        <div className="contact-actions" data-reveal="up">
          <a href="https://wa.me/5492616272454" target="_blank" rel="noopener noreferrer" className="contact-btn contact-btn-wa">
            <WhatsappLogo weight="fill" size={18} />
            <span>WhatsApp</span>
            <span className="contact-btn-arrow">→</span>
          </a>
          <a href="https://mail.google.com/mail/?view=cm&to=kianzo.web@gmail.com" target="_blank" rel="noopener noreferrer" className="contact-btn contact-btn-ghost">
            <EnvelopeSimple weight="light" size={18} />
            <span>kianzo.web@gmail.com</span>
            <span className="contact-btn-arrow">→</span>
          </a>
        </div>

        <div className="contact-meta" data-reveal="up">
          <span>{t('contact_meta1')}</span>
          <span className="contact-meta-dot" />
          <span>{t('contact_meta2')}</span>
          <span className="contact-meta-dot" />
          <span>{t('contact_meta3')}</span>
          <span className="contact-meta-dot" />
          <span>{t('contact_meta4')}</span>
        </div>
      </div>
    </section>
  );
}
