export type Lang = 'ES' | 'EN';

const translations = {
  ES: {
    // Navbar
    nav_servicios: 'Servicios',
    nav_proceso: 'Proceso',
    nav_nosotros: 'Nosotros',
    nav_cta: 'Hablemos',

    // Hero
    hero_tag: 'Desarrollo digital · Mendoza, Argentina',
    hero_line1: 'Diseño',
    hero_line2: 'que',
    hero_strong: 'trasciende.',
    hero_line4: 'Código',
    hero_line5: 'que funciona.',
    hero_sub: 'Páginas web y aplicaciones móviles construidas con precisión y disciplina. Cada proyecto, una obra.',
    hero_btn_primary: 'Ver servicios',
    hero_btn_secondary: 'Cotizá gratis →',

    // Services
    svc_tag: 'Servicios',
    svc_title_1: 'Lo que',
    svc_title_2: 'construimos',
    svc_desc: 'Desde una landing page hasta una app completa. Soluciones para negocios que quieren destacar.',
    svc_price_muted: 'precio base',
    svc_consult: 'Consultar',
    svc_consult_muted: 'cotización a medida',
    svc_quote_free: 'cotización gratis',
    svc_month: 'aprox / mes',
    svc_badge_new: 'Nuevo',

    svc1_name: 'Landing Page',
    svc1_tagline: 'Tu negocio en la web en 7 días',
    svc1_t1: 'Diseño a medida', svc1_t2: 'Carga rápida', svc1_t3: 'SEO básico',

    svc2_name: 'Web Institucional',
    svc2_tagline: 'Presencia profesional completa',
    svc2_t1: 'Multi-sección', svc2_t2: 'Panel admin', svc2_t3: 'Blog', svc2_t4: 'SEO avanzado',

    svc3_name: 'E-commerce',
    svc3_tagline: 'Vendé las 24 hs, los 7 días',
    svc3_t1: 'Carrito de compras', svc3_t2: 'MercadoPago', svc3_t3: 'Gestión de stock',

    svc4_name: 'Automatización WhatsApp',
    svc4_tagline: 'Tu negocio responde solo, las 24 horas',
    svc4_t1: 'Respuestas 24/7', svc4_t2: 'IA Conversacional', svc4_t3: 'Agenda automática',

    svc5_name: 'App Móvil',
    svc5_tagline: 'Tu negocio en el bolsillo de tus clientes',
    svc5_t1: 'Android & iOS', svc5_t2: 'Multiplataforma', svc5_t3: 'Nativa',

    svc6_name: 'Mantenimiento',
    svc6_tagline: 'Tu sitio siempre en perfecto estado',
    svc6_t1: 'Actualizaciones', svc6_t2: 'Seguridad', svc6_t3: 'Soporte mensual',

    combo_title: 'Combo Web + App Móvil',
    combo_desc: 'Contratá ambos servicios juntos y accedé a un descuento especial. La solución digital completa para tu negocio.',
    combo_pill: '20% OFF · Consultar',

    // Process
    proc_tag: 'Proceso',
    proc_title_1: '¿Cómo',
    proc_title_2: 'trabajamos?',
    proc_desc: 'Un proceso claro y transparente, de principio a fin. Sin tecnicismos, sin sorpresas.',

    step1_title: 'Primera consulta',
    step1_desc: 'Nos contás tu idea y lo que necesitás. Sin compromiso y sin costo. Respondemos en 24 hs.',

    step2_title: 'Propuesta & precio',
    step2_desc: 'En 48 hs recibís una propuesta detallada con tiempos, alcance y costo exacto. Sin letras chicas.',

    step3_title: 'Diseño & desarrollo',
    step3_desc: 'Construimos tu proyecto con actualizaciones periódicas. Podés ver el avance en todo momento.',

    step4_title: 'Entrega & soporte',
    step4_desc: 'Lanzamos tu proyecto y te capacitamos para usarlo. Seguimos disponibles post-entrega.',

    // Numbers
    num1_label: 'Tiempo promedio de entrega',
    num2_label: 'Clientes satisfechos',
    num3_label: 'Años desarrollando',

    // About
    about_tag: 'Nosotros',
    about_title_1: 'Dos desarrolladores,',
    about_title_2: 'un objetivo.',
    about_p1: 'Somos un equipo de dos desarrolladores de software de Mendoza, Argentina. Nos especializamos en construir páginas web y aplicaciones móviles que combinan diseño de calidad con código sólido.',
    about_p2: 'Nuestra inspiración viene de la filosofía japonesa del Kaizen: mejora continua, atención al detalle y compromiso con la excelencia en cada proyecto que tomamos.',
    about_p3: 'Estamos en constante aprendizaje — actualmente sumando desarrollo de apps móviles a nuestro stack para ofrecer soluciones digitales completas.',

    val1_title: 'Kaizen · Mejora continua',
    val1_desc: 'Cada proyecto nos hace mejores. Nunca entregamos algo con lo que no estamos conformes.',
    val2_title: 'Monozukuri · El arte de hacer',
    val2_desc: 'Tratamos cada web como una obra. No usamos templates, construimos desde cero.',
    val3_title: 'Omotenashi · Servicio total',
    val3_desc: 'Acompañamos al cliente desde la idea hasta el lanzamiento y más allá.',
    val4_title: 'Comunicación clara',
    val4_desc: 'Sin tecnicismos. Te explicamos todo de forma simple y honesta.',

    // Contact
    contact_tag: 'Hablemos',
    contact_title_1: '¿Listo para',
    contact_title_2: 'empezar',
    contact_title_3: '?',
    contact_desc: 'Contanos tu proyecto. Te respondemos en menos de 48 horas con una cotización sin compromiso.',
    contact_meta1: 'Mendoza · AR',
    contact_meta2: 'Respuesta < 48 hs',
    contact_meta3: 'Cotización gratis',
    contact_meta4: 'LATAM',

    // Stats
    stat1_label: 'Proyectos entregados',
    stat2_label: 'Tiempo de respuesta',
    stat3_label: 'Días promedio de entrega',
    stat4_label: 'Clientes satisfechos',

    // Automation
    auto_tag: 'Automatización',
    auto_title_1: 'Tu negocio trabaja',
    auto_title_strong: 'mientras dormís',
    auto_desc: 'Un asistente inteligente en WhatsApp que atiende, reserva y vende por vos — las 24 horas.',
    auto_feat1: 'Atención al instante',
    auto_feat2: 'Agenda citas sola',
    auto_feat3: 'Toma pedidos',
    auto_feat4: 'Campañas masivas',
    auto_feat5: 'Reportes en vivo',
    auto_feat6: 'Humano de respaldo',
    auto_chart_eyebrow: 'Actividad · 24h',
    auto_chart_num_label: 'conversaciones',
    auto_chart_unit: 'mensajes / hora',
    auto_chart_peak: 'Pico',
    auto_chart_avg: 'Promedio',
    auto_bot_status: 'en línea',
    auto_chat1: 'Hola, quiero reservar mesa para 4',
    auto_chat2: '¡Hola! Claro. ¿Para qué día?',
    auto_chat3: 'Viernes a las 20hs',
    auto_chat4: 'Perfecto. ¿Interior o terraza?',
    auto_chat5: 'Terraza',
    auto_chat6: '✓ Reservado · vie 20:00 · terraza · 4 personas',
    auto_combo_title: '¿Lo aplicamos a tu negocio?',
    auto_combo_desc: 'Quince minutos. Te mostramos el bot funcionando con un caso real de tu rubro — sin costo, sin compromiso.',
    auto_combo_pill: 'Empezar →',

    // Portfolio
    port_tag: 'Portfolio',
    port_title_1: 'Nuestros',
    port_title_strong: 'trabajos',
    port_desc: 'Proyectos reales, clientes reales. Cada trabajo habla por nosotros.',
    port_cta: 'Ver proyecto →',
    port1_cat: 'Web Institucional',
    port1_desc: 'Rediseño completo para empresa de gas y plomería en Mendoza. Landing moderna con galería de trabajos, servicios y contacto directo por WhatsApp.',
    port2_cat: 'E-commerce · Demo',
    port2_desc: 'Tienda de productos Apple con experiencia premium. Catálogo interactivo, carrito, modo demo con datos de ejemplo y diseño inspirado en Apple.com.',
    port3_cat: 'Restaurante · Demo',
    port3_desc: 'Sitio premium para parrilla de autor en Mendoza. Experiencia visual cinematográfica con animaciones de scroll, carta interactiva y cava de vinos.',

    // Footer
    footer_copy: '© 2025 Kianzo · Desarrollo Web & Apps · Mendoza, Argentina',
  },

  EN: {
    // Navbar
    nav_servicios: 'Services',
    nav_proceso: 'Process',
    nav_nosotros: 'About',
    nav_cta: "Let's Talk",

    // Hero
    hero_tag: 'Digital Development · Mendoza, Argentina',
    hero_line1: 'Design',
    hero_line2: 'that',
    hero_strong: 'transcends.',
    hero_line4: 'Code',
    hero_line5: 'that works.',
    hero_sub: 'Web pages and mobile apps built with precision and discipline. Every project, a work of art.',
    hero_btn_primary: 'View services',
    hero_btn_secondary: 'Get a free quote →',

    // Services
    svc_tag: 'Services',
    svc_title_1: 'What we',
    svc_title_2: 'build',
    svc_desc: 'From a landing page to a full app. Solutions for businesses that want to stand out.',
    svc_price_muted: 'base price',
    svc_consult: 'Inquire',
    svc_consult_muted: 'custom quote',
    svc_quote_free: 'free quote',
    svc_month: 'approx / mo',
    svc_badge_new: 'New',

    svc1_name: 'Landing Page',
    svc1_tagline: 'Your business online in 7 days',
    svc1_t1: 'Custom design', svc1_t2: 'Fast loading', svc1_t3: 'Basic SEO',

    svc2_name: 'Institutional Website',
    svc2_tagline: 'Complete professional presence',
    svc2_t1: 'Multi-section', svc2_t2: 'Admin panel', svc2_t3: 'Blog', svc2_t4: 'Advanced SEO',

    svc3_name: 'E-commerce',
    svc3_tagline: 'Sell 24/7, every day',
    svc3_t1: 'Shopping cart', svc3_t2: 'MercadoPago', svc3_t3: 'Stock management',

    svc4_name: 'WhatsApp Automation',
    svc4_tagline: 'Your business responds alone, 24 hours',
    svc4_t1: '24/7 Responses', svc4_t2: 'Conversational AI', svc4_t3: 'Auto scheduling',

    svc5_name: 'Mobile App',
    svc5_tagline: "Your business in your clients' pocket",
    svc5_t1: 'Android & iOS', svc5_t2: 'Cross-platform', svc5_t3: 'Native',

    svc6_name: 'Maintenance',
    svc6_tagline: 'Your site always in perfect shape',
    svc6_t1: 'Updates', svc6_t2: 'Security', svc6_t3: 'Monthly support',

    combo_title: 'Web + Mobile App Bundle',
    combo_desc: 'Get both services together and unlock a special discount. The complete digital solution for your business.',
    combo_pill: '20% OFF · Inquire',

    // Process
    proc_tag: 'Process',
    proc_title_1: 'How do',
    proc_title_2: 'we work?',
    proc_desc: 'A clear and transparent process, from start to finish. No jargon, no surprises.',

    step1_title: 'Initial consultation',
    step1_desc: 'Tell us your idea and what you need. No commitment, no cost. We respond in 24 hrs.',

    step2_title: 'Proposal & price',
    step2_desc: 'In 48 hrs you receive a detailed proposal with timeline, scope and exact cost. No fine print.',

    step3_title: 'Design & development',
    step3_desc: 'We build your project with regular updates. You can see the progress at any time.',

    step4_title: 'Delivery & support',
    step4_desc: 'We launch your project and train you to use it. We stay available after delivery.',

    // Numbers
    num1_label: 'Average delivery time',
    num2_label: 'Satisfied clients',
    num3_label: 'Years developing',

    // About
    about_tag: 'About',
    about_title_1: 'Two developers,',
    about_title_2: 'one goal.',
    about_p1: 'We are a team of two software developers from Mendoza, Argentina. We specialize in building websites and mobile apps that combine quality design with solid code.',
    about_p2: 'Our inspiration comes from the Japanese philosophy of Kaizen: continuous improvement, attention to detail, and commitment to excellence in every project we take.',
    about_p3: "We are in constant learning — currently adding mobile app development to our stack to offer complete digital solutions.",

    val1_title: 'Kaizen · Continuous improvement',
    val1_desc: 'Every project makes us better. We never deliver something we are not proud of.',
    val2_title: 'Monozukuri · The art of making',
    val2_desc: 'We treat every website as a work of art. No templates — we build from scratch.',
    val3_title: 'Omotenashi · Total service',
    val3_desc: 'We accompany the client from idea to launch and beyond.',
    val4_title: 'Clear communication',
    val4_desc: 'No jargon. We explain everything in a simple and honest way.',

    // Contact
    contact_tag: "Let's Talk",
    contact_title_1: 'Ready to',
    contact_title_2: 'start',
    contact_title_3: '?',
    contact_desc: 'Tell us about your project. We respond in less than 48 hours with a no-obligation quote.',
    contact_meta1: 'Mendoza · AR',
    contact_meta2: 'Response < 48 hrs',
    contact_meta3: 'Free quote',
    contact_meta4: 'LATAM',

    // Stats
    stat1_label: 'Projects delivered',
    stat2_label: 'Response time',
    stat3_label: 'Average delivery days',
    stat4_label: 'Satisfied clients',

    // Automation
    auto_tag: 'Automation',
    auto_title_1: 'Your business works',
    auto_title_strong: 'while you sleep',
    auto_desc: 'A smart WhatsApp assistant that answers, books and sells for you — 24 hours a day.',
    auto_feat1: 'Instant replies',
    auto_feat2: 'Books appointments',
    auto_feat3: 'Takes orders',
    auto_feat4: 'Mass campaigns',
    auto_feat5: 'Live reports',
    auto_feat6: 'Human backup',
    auto_chart_eyebrow: 'Activity · 24h',
    auto_chart_num_label: 'conversations',
    auto_chart_unit: 'messages / hour',
    auto_chart_peak: 'Peak',
    auto_chart_avg: 'Average',
    auto_bot_status: 'online',
    auto_chat1: 'Hi, I want to book a table for 4',
    auto_chat2: 'Hello! Sure. For which day?',
    auto_chat3: 'Friday at 8pm',
    auto_chat4: 'Perfect. Indoor or terrace?',
    auto_chat5: 'Terrace',
    auto_chat6: '✓ Booked · Fri 8:00pm · terrace · 4 people',
    auto_combo_title: 'Shall we apply it to your business?',
    auto_combo_desc: 'Fifteen minutes. We show you the bot working with a real case from your industry — free, no commitment.',
    auto_combo_pill: 'Get started →',

    // Portfolio
    port_tag: 'Portfolio',
    port_title_1: 'Our',
    port_title_strong: 'work',
    port_desc: 'Real projects, real clients. Every project speaks for us.',
    port_cta: 'View project →',
    port1_cat: 'Institutional Website',
    port1_desc: 'Complete redesign for a gas and plumbing company in Mendoza. Modern landing with a work gallery, services and direct WhatsApp contact.',
    port2_cat: 'E-commerce · Demo',
    port2_desc: 'Apple products store with a premium experience. Interactive catalog, cart, demo mode with sample data and Apple.com-inspired design.',
    port3_cat: 'Restaurant · Demo',
    port3_desc: 'Premium site for an upscale steakhouse in Mendoza. Cinematic visual experience with scroll animations, interactive menu and wine cellar.',

    // Footer
    footer_copy: '© 2025 Kianzo · Web Development & Apps · Mendoza, Argentina',
  },
} as const;

export type TranslationKey = keyof typeof translations.ES;
export default translations;
