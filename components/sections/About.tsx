'use client';

import { useLang } from '@/context/LanguageContext';
import ArtLayer from '@/components/ui/ArtLayer';

export default function About() {
  const { t } = useLang();

  const values = [
    { jp: '改', title: t('val1_title'), desc: t('val1_desc') },
    { jp: '匠', title: t('val2_title'), desc: t('val2_desc') },
    { jp: '心', title: t('val3_title'), desc: t('val3_desc') },
    { jp: '道', title: t('val4_title'), desc: t('val4_desc') },
  ];

  return (
    <section id="nosotros" className="kianzo-section nosotros-section">
      <ArtLayer variant="hannya" />
      <div className="nosotros-content">
        <div data-reveal="up">
          <div className="sec-eyebrow">
            <div className="sec-line" />
            <span className="sec-tag">{t('about_tag')}</span>
            <span className="sec-tag-ja">私たちについて</span>
          </div>
          <h2 className="sec-title">
            {t('about_title_1')}<br /><strong>{t('about_title_2')}</strong>
          </h2>
        </div>
        <div className="about-grid">
          <div className="about-text" data-reveal="left">
            <div className="about-kanji-bg">匠 道</div>
            <p>{t('about_p1')}</p>
            <p>{t('about_p2')}</p>
            <p>{t('about_p3')}</p>
          </div>
          <div className="values" data-reveal="right">
            {values.map((v) => (
              <div className="val" key={v.jp}>
                <div className="val-jp">{v.jp}</div>
                <div className="val-body">
                  <h4>{v.title}</h4>
                  <p>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
