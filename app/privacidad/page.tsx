import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidad | Kianzo',
  description:
    'Política de Privacidad de Kianzo — cómo recopilamos, usamos y protegemos los datos de nuestros clientes y de quienes nos contactan, incluido WhatsApp Business.',
  alternates: { canonical: 'https://kianzo.org/privacidad' },
  robots: { index: true, follow: true },
};

const ACTUALIZADO = '10 de junio de 2026';

export default function PrivacidadPage() {
  return (
    <main className="pp">
      <style>{`
        .pp {
          background: #0D0D0D;
          color: #F7F5F2;
          min-height: 100vh;
          font-family: var(--font-body, 'Space Grotesk', sans-serif);
          padding: 0 0 6rem;
        }
        .pp-bar {
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 1.75rem 0;
          margin-bottom: 4rem;
        }
        .pp-wrap { max-width: 760px; margin: 0 auto; padding: 0 1.5rem; }
        .pp-logo {
          font-family: var(--font-serif, 'Cormorant Garamond', serif);
          font-size: 1.75rem;
          font-weight: 600;
          color: #F7F5F2;
          text-decoration: none;
          letter-spacing: 0.02em;
        }
        .pp-logo span { color: #C0001A; }
        .pp-back {
          display: inline-block;
          margin-top: 0.4rem;
          font-size: 0.8rem;
          color: #737370;
          text-decoration: none;
          transition: color 0.3s var(--ease, ease);
        }
        .pp-back:hover { color: #C0001A; }
        .pp h1 {
          font-family: var(--font-serif, 'Cormorant Garamond', serif);
          font-size: clamp(2.2rem, 6vw, 3.4rem);
          font-weight: 600;
          line-height: 1.05;
          margin: 0 0 0.75rem;
        }
        .pp-meta {
          font-size: 0.85rem;
          color: #737370;
          margin-bottom: 3.5rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(192,0,26,0.28);
        }
        .pp h2 {
          font-family: var(--font-serif, 'Cormorant Garamond', serif);
          font-size: 1.7rem;
          font-weight: 600;
          margin: 3rem 0 1rem;
          color: #F7F5F2;
        }
        .pp h2 .num {
          color: #C0001A;
          font-size: 1.1rem;
          font-family: var(--font-body, sans-serif);
          margin-right: 0.6rem;
          vertical-align: middle;
        }
        .pp p, .pp li {
          font-size: 1rem;
          line-height: 1.85;
          color: #bbbbbb;
          font-weight: 300;
        }
        .pp p { margin: 0 0 1.1rem; }
        .pp ul { margin: 0 0 1.1rem; padding-left: 1.3rem; }
        .pp li { margin-bottom: 0.5rem; }
        .pp strong { color: #F7F5F2; font-weight: 500; }
        .pp a.inline { color: #C0001A; text-decoration: none; }
        .pp a.inline:hover { text-decoration: underline; }
        .pp-contact {
          margin-top: 4rem;
          padding: 2rem;
          background: #131313;
          border: 1px solid rgba(255,255,255,0.07);
          border-left: 3px solid #C0001A;
          border-radius: 4px;
        }
        .pp-contact p { margin-bottom: 0.4rem; }
      `}</style>

      <div className="pp-bar">
        <div className="pp-wrap">
          <Link href="/" className="pp-logo">
            Kianzo<span>.</span>
          </Link>
          <br />
          <Link href="/" className="pp-back">
            ← Volver al inicio
          </Link>
        </div>
      </div>

      <div className="pp-wrap">
        <h1>Política de Privacidad</h1>
        <p className="pp-meta">Última actualización: {ACTUALIZADO}</p>

        <p>
          En <strong>Kianzo</strong> respetamos tu privacidad y nos tomamos en serio
          la protección de tus datos. Esta política explica qué información
          recopilamos, cómo la usamos, con quién la compartimos y qué derechos tenés
          sobre ella. Kianzo es una empresa de desarrollo web y aplicaciones móviles
          con sede en Mendoza, Argentina.
        </p>

        <h2><span className="num">01</span>Quiénes somos</h2>
        <p>
          Kianzo presta servicios de diseño y desarrollo de páginas web,
          aplicaciones móviles, comercio electrónico y automatización de procesos.
          El responsable del tratamiento de los datos es Kianzo, con domicilio en
          Mendoza, Argentina, y correo de contacto{' '}
          <a className="inline" href="mailto:kianzo.web@gmail.com">
            kianzo.web@gmail.com
          </a>
          .
        </p>

        <h2><span className="num">02</span>Qué datos recopilamos</h2>
        <p>Recopilamos únicamente la información necesaria para prestar nuestros servicios:</p>
        <ul>
          <li>
            <strong>Datos de contacto:</strong> nombre, correo electrónico, número
            de teléfono y nombre de la empresa, cuando nos los proporcionás a través
            del formulario de contacto, WhatsApp, correo o redes sociales.
          </li>
          <li>
            <strong>Datos del proyecto:</strong> la información que compartís sobre
            el trabajo que querés realizar (descripción, requisitos, materiales).
          </li>
          <li>
            <strong>Datos de navegación:</strong> información técnica anónima sobre
            cómo se usa nuestro sitio (páginas visitadas, tiempo de permanencia),
            recopilada de forma agregada mediante herramientas de analítica.
          </li>
        </ul>
        <p>
          No recopilamos datos sensibles ni información de tarjetas. Los pagos, cuando
          corresponden, se procesan a través de plataformas externas seguras.
        </p>

        <h2><span className="num">03</span>Cómo usamos tus datos</h2>
        <p>Usamos la información que nos das exclusivamente para:</p>
        <ul>
          <li>Responder a tus consultas y elaborar presupuestos.</li>
          <li>Prestar, gestionar y dar seguimiento a los servicios contratados.</li>
          <li>Comunicarnos con vos sobre el estado de tu proyecto.</li>
          <li>Cumplir con obligaciones legales y administrativas.</li>
        </ul>
        <p>
          Nunca vendemos tus datos ni los usamos para fines distintos a los aquí
          descritos.
        </p>

        <h2><span className="num">04</span>WhatsApp y comunicaciones</h2>
        <p>
          Utilizamos <strong>WhatsApp Business</strong> y otros canales (correo
          electrónico, redes sociales) para comunicarnos con clientes y personas
          interesadas. Cuando nos escribís por WhatsApp, recibimos tu número de
          teléfono y el contenido de los mensajes que nos enviás, que usamos
          únicamente para responder y dar seguimiento a tu consulta o proyecto. El
          uso de WhatsApp también está sujeto a la política de privacidad de Meta
          Platforms, Inc.
        </p>

        <h2><span className="num">05</span>Con quién compartimos tus datos</h2>
        <p>
          No compartimos tu información con terceros salvo con los proveedores de
          servicios que nos permiten operar, y siempre limitado a lo estrictamente
          necesario. Entre ellos pueden encontrarse:
        </p>
        <ul>
          <li><strong>Meta Platforms</strong> (WhatsApp Business) — comunicación con clientes.</li>
          <li><strong>Plataformas de pago</strong> (como MercadoPago y Stripe) — procesamiento de pagos.</li>
          <li><strong>Herramientas de gestión y automatización</strong> — organización interna de proyectos.</li>
          <li><strong>Proveedores de hosting y analítica</strong> — funcionamiento del sitio web.</li>
        </ul>
        <p>
          Todos estos proveedores tratan los datos bajo sus propias políticas de
          seguridad y privacidad.
        </p>

        <h2><span className="num">06</span>Seguridad de los datos</h2>
        <p>
          Aplicamos medidas técnicas y organizativas razonables para proteger tu
          información frente a accesos no autorizados, pérdida o alteración.
          Limitamos el acceso a los datos únicamente a las personas que los necesitan
          para prestar el servicio y utilizamos conexiones cifradas siempre que es
          posible. Ningún sistema es completamente infalible, pero trabajamos para
          mantener tus datos protegidos en todo momento.
        </p>

        <h2><span className="num">07</span>Conservación de los datos</h2>
        <p>
          Conservamos tus datos solo durante el tiempo necesario para cumplir con los
          fines descritos en esta política y con las obligaciones legales aplicables.
          Cuando ya no los necesitamos, los eliminamos o anonimizamos de forma segura.
        </p>

        <h2><span className="num">08</span>Tus derechos</h2>
        <p>
          Tenés derecho a acceder a tus datos personales, rectificarlos, solicitar su
          eliminación u oponerte a su tratamiento. Para ejercer cualquiera de estos
          derechos, escribinos a{' '}
          <a className="inline" href="mailto:kianzo.web@gmail.com">
            kianzo.web@gmail.com
          </a>{' '}
          y responderemos a la brevedad.
        </p>

        <h2><span className="num">09</span>Cambios en esta política</h2>
        <p>
          Podemos actualizar esta política de privacidad ocasionalmente. Cualquier
          cambio se publicará en esta misma página, con la fecha de última
          actualización indicada arriba. Te recomendamos revisarla periódicamente.
        </p>

        <div className="pp-contact">
          <h2 style={{ marginTop: 0 }}>Contacto</h2>
          <p>
            Si tenés preguntas sobre esta política o sobre el tratamiento de tus
            datos, podés contactarnos:
          </p>
          <p><strong>Kianzo</strong> — Mendoza, Argentina</p>
          <p>
            Email:{' '}
            <a className="inline" href="mailto:kianzo.web@gmail.com">
              kianzo.web@gmail.com
            </a>
          </p>
          <p>
            WhatsApp:{' '}
            <a className="inline" href="https://wa.me/5492616272454" target="_blank" rel="noopener noreferrer">
              +54 9 261 627 2454
            </a>
          </p>
          <p>
            Web:{' '}
            <a className="inline" href="https://kianzo.org">
              kianzo.org
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
