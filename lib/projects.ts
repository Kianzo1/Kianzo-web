export type Project = {
  slug: string;
  num: string;
  year: string;
  title: string;
  cat: 'web' | 'ecommerce' | 'app' | 'restaurante' | 'demo';
  catLabel: string;
  desc: string;
  tags: string[];
  img: string;
  url: string;
  featured: boolean;   // true = aparece en home (máx 3)
  color: string;
  comingSoon?: boolean; // true = deshabilita el link, muestra badge
};

// ─── AGREGAR PROYECTOS AQUÍ ───────────────────────────────────────────────────
const projects: Project[] = [
  {
    slug: 'istore',
    num: '01',
    year: '2024',
    title: 'iStore',
    cat: 'ecommerce',
    catLabel: 'E-commerce · Demo',
    desc: 'Tienda de productos Apple con experiencia premium. Catálogo interactivo, carrito, modo demo con datos de ejemplo y diseño inspirado en Apple.com.',
    tags: ['React', 'Vite', 'TypeScript'],
    img: '/portfolio/istore.webp',
    url: '/istore/index.html',
    featured: true,
    color: '#5ba3ff',
  },
  {
    slug: 'alma-condor',
    num: '02',
    year: '2025',
    title: 'Alma Cóndor',
    cat: 'restaurante',
    catLabel: 'Restaurante · Demo',
    desc: 'Sitio premium para parrilla de autor en Mendoza. Experiencia visual cinematográfica con animaciones de scroll, carta interactiva y cava de vinos.',
    tags: ['Next.js', 'TypeScript', 'Tailwind'],
    img: '/portfolio/alma-condor.webp',
    url: '/alma-condor/index.html',
    featured: true,
    color: '#C0001A',
  },
  {
    slug: 'carrizo',
    num: '03',
    year: '2024',
    title: 'Carrizo Instalaciones',
    cat: 'web',
    catLabel: 'Web Institucional',
    desc: 'Rediseño completo para empresa de gas y plomería en Mendoza. Landing moderna con galería de trabajos, servicios y contacto directo por WhatsApp.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    img: '/portfolio/carrizo.webp',
    url: '/carrizo/index.html',
    featured: true,
    color: '#ff6340',
  },
  {
    slug: 'starlight-dancewear',
    num: '04',
    year: '2025',
    title: 'Starlight Dancewear',
    cat: 'ecommerce',
    catLabel: 'E-commerce',
    desc: 'Tienda online de indumentaria para bailarines. Maillots, vestuarios y ropa de ensayo con experiencia de compra premium, animaciones GSAP y diseño editorial.',
    tags: ['React', 'Vite', 'Tailwind', 'GSAP'],
    img: '/portfolio/starlight-dancewear.webp',
    url: '/starlight-dancewear/index.html',
    featured: false,
    color: '#e879a0',
  },
  // ─── PRÓXIMOS PROYECTOS ───────────────────────────────────────────────────
  // Copiar bloque de arriba y pegar acá. Cambiar featured: false para que
  // no aparezca en home pero sí en la página de portfolio.
];

export default projects;

// Filtros disponibles (se generan automáticamente del array)
export const FILTERS = [
  { key: 'all',         label: 'Todos' },
  { key: 'web',         label: 'Web' },
  { key: 'ecommerce',   label: 'E-commerce' },
  { key: 'app',         label: 'App' },
  { key: 'restaurante', label: 'Restaurante' },
  { key: 'demo',        label: 'Demo' },
] as const;

export type FilterKey = typeof FILTERS[number]['key'];
