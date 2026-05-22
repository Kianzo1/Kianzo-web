const projects = [
  {
    slug: 'carrizo',
    title: 'Carrizo Instalaciones',
    category: 'Web Institucional',
    desc: 'Rediseño completo para empresa de gas y plomería en Mendoza. Landing moderna con galería de trabajos, servicios y contacto directo por WhatsApp.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    url: '/carrizo/index.html',
    img: '/portfolio/carrizo.webp',
  },
  {
    slug: 'istore',
    title: 'iStore',
    category: 'E-commerce · Demo',
    desc: 'Tienda de productos Apple con experiencia premium. Catálogo interactivo, carrito, modo demo con datos de ejemplo y diseño inspirado en Apple.com.',
    tags: ['React', 'Vite', 'TypeScript'],
    url: '/istore/index.html',
    img: '/portfolio/istore.webp',
  },
];

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
        <p className="svc-desc" data-reveal="right" style={{ maxWidth: 300 }}>
          Proyectos reales, clientes reales. Cada trabajo habla por nosotros.
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
                <span className="port-card-cta">Ver proyecto →</span>
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
