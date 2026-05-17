export type Service = {
  id: string;
  number: string;
  title: string;
  tagline: string;
  features: string[];
  price: string;
  badge?: string;
};

export const services: Service[] = [
  {
    id: 'landing',
    number: '01',
    title: 'Landing Page',
    tagline: 'Tu negocio en la web en 7 días',
    features: ['Diseño a medida', 'Carga rápida', 'SEO básico'],
    price: 'USD 150',
  },
  {
    id: 'web',
    number: '02',
    title: 'Web Institucional',
    tagline: 'Presencia profesional completa',
    features: ['Multi-sección', 'Panel admin', 'Blog', 'SEO avanzado'],
    price: 'USD 400',
  },
  {
    id: 'ecommerce',
    number: '03',
    title: 'E-commerce',
    tagline: 'Vendé las 24 hs, los 7 días',
    features: ['Carrito de compras', 'MercadoPago', 'Gestión de stock'],
    price: 'USD 700',
  },
  {
    id: 'app',
    number: '04',
    title: 'App Móvil',
    tagline: 'Tu negocio en el bolsillo de tus clientes',
    features: ['Android & iOS', 'Multiplataforma', 'Nativa'],
    price: 'Consultar',
    badge: 'Próximamente',
  },
  {
    id: 'mantenimiento',
    number: '05',
    title: 'Mantenimiento',
    tagline: 'Tu sitio siempre en perfecto estado',
    features: ['Actualizaciones', 'Seguridad', 'Soporte mensual'],
    price: 'USD 30/mes',
  },
  {
    id: 'custom',
    number: '06',
    title: 'A medida',
    tagline: 'Tu idea, nuestro código',
    features: ['100% personalizado', 'Cualquier tecnología'],
    price: 'Cotización gratis',
  },
  {
    id: 'automation',
    number: '07',
    title: 'Automatización WhatsApp',
    tagline: 'Tu negocio trabaja solo',
    features: ['Respuestas 24/7', 'IA Conversacional', 'Sin código extra'],
    price: 'Consultar',
    badge: 'Nuevo',
  },
];

export const stats = [
  { value: '+5', ja: 'プロジェクト', label: 'Proyectos entregados' },
  { value: '48h', ja: '応答時間', label: 'Tiempo de respuesta' },
  { value: '7', ja: '納期', label: 'Días promedio de entrega' },
  { value: '100%', ja: '満足度', label: 'Clientes satisfechos' },
];

export const process = [
  {
    number: '01',
    title: 'Primera consulta',
    desc: 'Nos contás tu idea y lo que necesitás. Sin compromiso y sin costo. Respondemos en 24 hs.',
    ja: '相談 · Consulta',
  },
  {
    number: '02',
    title: 'Propuesta & precio',
    desc: 'En 48 hs recibís una propuesta detallada con tiempos, alcance y costo exacto. Sin letras chicas.',
    ja: '提案 · Propuesta',
  },
  {
    number: '03',
    title: 'Diseño & desarrollo',
    desc: 'Construimos tu proyecto con actualizaciones periódicas. Podés ver el avance en todo momento.',
    ja: '開発 · Desarrollo',
  },
  {
    number: '04',
    title: 'Entrega & soporte',
    desc: 'Lanzamos tu proyecto y te capacitamos para usarlo. Seguimos disponibles post-entrega.',
    ja: '完成 · Entrega',
  },
];

export const numbers = [
  { value: '7', suffix: ' días', label: 'Tiempo promedio de entrega', ja: '納期' },
  { value: '100', suffix: '%', label: 'Clientes satisfechos', ja: '満足度' },
  { value: '2', suffix: '+', label: 'Años desarrollando', ja: '経験' },
];

export const values = [
  {
    kanji: '改',
    name: 'Kaizen · Mejora continua',
    desc: 'Cada proyecto nos hace mejores. Nunca entregamos algo con lo que no estamos conformes.',
  },
  {
    kanji: '匠',
    name: 'Monozukuri · El arte de hacer',
    desc: 'Tratamos cada web como una obra. No usamos templates, construimos desde cero.',
  },
  {
    kanji: '心',
    name: 'Omotenashi · Servicio total',
    desc: 'Acompañamos al cliente desde la idea hasta el lanzamiento y más allá.',
  },
  {
    kanji: '道',
    name: 'Comunicación clara',
    desc: 'Sin tecnicismos. Te explicamos todo de forma simple y honesta.',
  },
];

export const navLinks = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#proceso', label: 'Proceso' },
  { href: '#nosotros', label: 'Nosotros' },
];

export const automationFeatures = [
  {
    icon: 'ChatCircle',
    title: 'Atención al instante',
    desc: 'Responde en segundos, sin importar la hora',
  },
  {
    icon: 'CalendarCheck',
    title: 'Agenda citas sola',
    desc: 'Los clientes reservan su espacio automáticamente',
  },
  {
    icon: 'ShoppingCart',
    title: 'Toma pedidos',
    desc: 'Recibe órdenes sin intervención manual',
  },
  {
    icon: 'MegaphoneSimple',
    title: 'Campañas masivas',
    desc: 'Llega a cientos de clientes con un mensaje',
  },
  {
    icon: 'ChartBar',
    title: 'Reportes en tiempo real',
    desc: 'Panel donde ves cuántos clientes atendió tu bot',
  },
  {
    icon: 'UserCircle',
    title: 'Siempre hay un humano',
    desc: 'Te conecta cuando el cliente lo necesita',
  },
] as const;
