'use client';

import { useLang } from '@/context/LanguageContext';

export default function Portfolio() {
  const { t } = useLang();

  const projects = [
    {
      slug: 'carrizo',
      title: 'Carrizo Instalaciones',
      category: t('port1_cat'),
      desc: t('port1_desc'),
      tags: ['HTML', 'CSS', 'JavaScript'],
      url: '/carrizo/index.html',
      img: '/portfolio/carrizo.webp',
    },
    {
      slug: 'istore',
      title: 'iStore',
      category: t('port2_cat'),
      desc: t('port2_desc'),
      tags: ['React', 'Vite', 'TypeScript'],
      url: '/istore/index.html',
      img: '/portfolio/istore.webp',
    },
  ];

  return (
    <section id="portfolio" className="kianzo-section portfolio-section">
      <div className="port-header">
        <div data-reveal="left">
          <div className="sec-eyebrow">
            <div className="sec-line" />
            <span className="sec-tag">{t('port_tag')}</span>
            <span className="sec-tag-ja">作品集</span>
          </div>
          <h2 className="sec-title">
            {t('port_title_1')} <strong>{t('port_title_strong')}</strong>
          </h2>
        </div>
        <p className="svc-desc" data-reveal="right" style={{ maxWidth: 300 }}>
          {t('port_desc')}
        </p>
      </div>

      <div className="port-grid">
        {projects.map((p) => (
          <a
            key={p.slug}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="port-card"
            data-reveal="blur"
          >
            <div className="port-card-img">
              <img src={p.img} alt={p.title} loading="lazy" />
              <div className="port-card-overlay">
                <span className="port-card-cta">{t('port_cta')}</span>
              </div>
            </div>
            <div className="port-card-body">
              <span className="port-card-cat">{p.category}</span>
              <h3 className="port-card-title">{p.title}</h3>
              <p className="port-card-desc">{p.desc}</p>
              <div className="port-card-tags">
                {p.tags.map((t) => (
                  <span key={t} className="port-tag">{t}</span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
