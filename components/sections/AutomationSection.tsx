'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  CalendarBlank,
  ChatCircleDots,
  ChartLineUp,
  Megaphone,
  ShoppingBagOpen,
  UserCircle,
} from '@phosphor-icons/react';
import { useEffect, useMemo, useState } from 'react';

const features = [
  { Icon: ChatCircleDots, title: 'Atención al instante' },
  { Icon: CalendarBlank, title: 'Agenda citas sola' },
  { Icon: ShoppingBagOpen, title: 'Toma pedidos' },
  { Icon: Megaphone, title: 'Campañas masivas' },
  { Icon: ChartLineUp, title: 'Reportes en vivo' },
  { Icon: UserCircle, title: 'Humano de respaldo' },
] as const;

const chatScript = [
  { from: 'user', text: 'Hola, quiero reservar mesa para 4' },
  { from: 'bot', text: '¡Hola! Claro. ¿Para qué día?' },
  { from: 'user', text: 'Viernes a las 20hs' },
  { from: 'bot', text: 'Perfecto. ¿Interior o terraza?' },
  { from: 'user', text: 'Terraza' },
  { from: 'bot', text: '✓ Reservado · vie 20:00 · terraza · 4 personas' },
] as const;

const hourlyData = [4, 2, 1, 1, 2, 5, 12, 28, 45, 62, 78, 84, 92, 88, 73, 65, 58, 71, 86, 95, 82, 54, 32, 14];

// ─── CHART ───────────────────────────────────────────────────

function ActivityChart() {
  const W = 600;
  const H = 220;
  const PAD = { top: 20, right: 8, bottom: 28, left: 8 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const max = Math.max(...hourlyData);

  const { linePath, areaPath, dots } = useMemo(() => {
    const points = hourlyData.map((v, i) => ({
      x: PAD.left + (i / (hourlyData.length - 1)) * innerW,
      y: PAD.top + innerH - (v / max) * innerH,
    }));
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;
      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
    }
    const area = `${d} L ${points[points.length - 1].x} ${PAD.top + innerH} L ${points[0].x} ${PAD.top + innerH} Z`;
    return { linePath: d, areaPath: area, dots: points };
  }, [innerW, innerH, max]);

  const peakIdx = hourlyData.indexOf(max);
  const peak = dots[peakIdx];

  return (
    <div className="auto-chart">
      <div className="auto-chart-head">
        <div>
          <p className="auto-eyebrow-mini">Actividad · 24h</p>
          <p className="auto-big-num">
            1.247 <span>conversaciones</span>
          </p>
        </div>
        <p className="auto-chart-unit">mensajes / hora</p>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="auto-chart-svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C0001A" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#C0001A" stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.path
          d={areaPath}
          fill="url(#chartArea)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.6 }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke="#C0001A"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
        {[0, 6, 12, 18, 23].map((h) => {
          const x = PAD.left + (h / 23) * innerW;
          return (
            <text
              key={h}
              x={x}
              y={H - 10}
              textAnchor="middle"
              fontSize="10"
              letterSpacing="0.12em"
              fill="rgba(255,255,255,0.3)"
            >
              {String(h).padStart(2, '0')}h
            </text>
          );
        })}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <circle cx={peak.x} cy={peak.y} r="10" fill="#C0001A" opacity="0.18" />
          <circle cx={peak.x} cy={peak.y} r="4" fill="#0d0d0d" stroke="#C0001A" strokeWidth="1.4" />
        </motion.g>
      </svg>

      <div className="auto-chart-foot">
        <span>Pico <strong>19:00</strong></span>
        <span>Promedio <strong>47 / h</strong></span>
      </div>
    </div>
  );
}

// ─── CHAT ────────────────────────────────────────────────────

function ChatMock() {
  const [count, setCount] = useState(1);
  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => (c >= chatScript.length ? 1 : c + 1));
    }, 2000);
    return () => clearInterval(id);
  }, []);
  const visible = chatScript.slice(0, count);

  return (
    <div className="auto-chat">
      <div className="auto-chat-head">
        <div className="auto-chat-avatar">k</div>
        <div className="auto-chat-meta">
          <p className="auto-chat-name">Kianzo Bot</p>
          <p className="auto-chat-status">
            <span className="auto-chat-dot" /> en línea
          </p>
        </div>
      </div>
      <div className="auto-chat-body">
        <AnimatePresence initial={false}>
          {visible.map((m, i) => (
            <motion.div
              key={`${count}-${i}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`auto-msg auto-msg-${m.from}`}
            >
              {m.text}
              {m.from === 'user' && <span className="auto-msg-check">✓✓</span>}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────

export default function AutomationSection() {
  return (
    <section id="automatizacion" className="kianzo-section automation-section">
      <div className="svc-header">
        <div data-reveal="left">
          <div className="sec-eyebrow">
            <div className="sec-line" />
            <span className="sec-tag">Automatización</span>
            <span className="sec-tag-ja">自動化</span>
          </div>
          <h2 className="sec-title">
            Tu negocio trabaja <strong>mientras dormís</strong>
          </h2>
        </div>
        <p className="svc-desc" data-reveal="right">
          Un asistente inteligente en WhatsApp que atiende, reserva y vende por
          vos — las 24 horas.
        </p>
      </div>

      <div className="auto-stage" data-reveal="up">
        <ActivityChart />
        <ChatMock />
      </div>

      <div className="auto-features-grid" data-reveal="up">
        {features.map((f) => (
          <div className="auto-feature" key={f.title}>
            <f.Icon weight="thin" size={22} />
            <span>{f.title}</span>
          </div>
        ))}
      </div>

      <div className="combo-bar" data-reveal="blur">
        <div>
          <h3>¿Lo aplicamos a tu negocio?</h3>
          <p>
            Quince minutos. Te mostramos el bot funcionando con un caso real de
            tu rubro — sin costo, sin compromiso.
          </p>
        </div>
        <a href="#contacto" className="combo-pill">
          Empezar →
        </a>
      </div>
    </section>
  );
}
