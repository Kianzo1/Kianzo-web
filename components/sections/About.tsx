const values = [
  {
    jp: '改',
    title: 'Kaizen · Mejora continua',
    desc: 'Cada proyecto nos hace mejores. Nunca entregamos algo con lo que no estamos conformes.',
  },
  {
    jp: '匠',
    title: 'Monozukuri · El arte de hacer',
    desc: 'Tratamos cada web como una obra. No usamos templates, construimos desde cero.',
  },
  {
    jp: '心',
    title: 'Omotenashi · Servicio total',
    desc: 'Acompañamos al cliente desde la idea hasta el lanzamiento y más allá.',
  },
  {
    jp: '道',
    title: 'Comunicación clara',
    desc: 'Sin tecnicismos. Te explicamos todo de forma simple y honesta.',
  },
];

export default function About() {
  return (
    <section id="nosotros" className="kianzo-section nosotros-section">
      <div className="nosotros-content">
        <div data-reveal="up">
          <div className="sec-eyebrow">
            <div className="sec-line" />
            <span className="sec-tag">Nosotros</span>
            <span className="sec-tag-ja">私たちについて</span>
          </div>
          <h2 className="sec-title">
            Dos desarrolladores,
            <br />
            <strong>un objetivo.</strong>
          </h2>
        </div>
        <div className="about-grid">
          <div className="about-text" data-reveal="left">
            <div className="about-kanji-bg">匠 道</div>
            <p>
              Somos un equipo de dos desarrolladores de software de Mendoza,
              Argentina. Nos especializamos en construir páginas web y
              aplicaciones móviles que combinan diseño de calidad con código
              sólido.
            </p>
            <p>
              Nuestra inspiración viene de la filosofía japonesa del{' '}
              <em>Kaizen</em>: mejora continua, atención al detalle y
              compromiso con la excelencia en cada proyecto que tomamos.
            </p>
            <p>
              Estamos en constante aprendizaje — actualmente sumando
              desarrollo de apps móviles a nuestro stack para ofrecer
              soluciones digitales completas.
            </p>
          </div>
          <div className="values" data-reveal="right">
            {values.map((v) => (
              <div className="val" key={v.title}>
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
