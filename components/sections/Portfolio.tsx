export default function Portfolio() {
  return (
    <section id="portfolio" className="kianzo-section portfolio-section">
      <div className="port-header">
        <div data-reveal="left">
          <div className="sec-eyebrow">
            <div className="sec-line" />
            <span className="sec-tag">Portfolio</span>
            <span className="sec-tag-ja">作品集</span>
          </div>
          <h2 className="sec-title">
            Nuestros <strong>trabajos</strong>
          </h2>
        </div>
        <p
          className="svc-desc"
          data-reveal="right"
          style={{ maxWidth: 300 }}
        >
          Proyectos reales, clientes reales. Cada trabajo habla por nosotros.
        </p>
      </div>
      <div className="port-grid">
        <div className="port-empty" data-reveal="blur">
          <strong>Próximos proyectos aquí</strong>
          <p>
            Estamos cerrando nuestros primeros trabajos.
            <br />
            Volvé pronto para ver casos reales.
          </p>
        </div>
      </div>
    </section>
  );
}
