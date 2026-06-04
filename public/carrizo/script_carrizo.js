/* ============================================================
   CARRIZO INSTALACIONES — script.js
============================================================ */

// ── LOGO: ELIMINAR FONDO BLANCO DEL PNG ──────────────────────
(function removeLogoWhite() {
  const logos = document.querySelectorAll('.img-logo img, .footer-logo-img');
  logos.forEach(img => {
    const process = () => {
      if (img.dataset.processed) return;
      img.dataset.processed = '1';
      try {
        const c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const d = ctx.getImageData(0, 0, c.width, c.height);
        const px = d.data;
        for (let i = 0; i < px.length; i += 4) {
          if (px[i] > 230 && px[i+1] > 230 && px[i+2] > 230) px[i+3] = 0;
        }
        ctx.putImageData(d, 0, 0);
        img.src = c.toDataURL('image/png');
      } catch(e) { /* CORS u otro error: se muestra el logo original */ }
    };
    if (img.complete && img.naturalWidth > 0) process();
    else img.addEventListener('load', process);
  });
})();

// ── SCROLL TO TOP ────────────────────────────────────────────
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', scrollY > 400);
  }, { passive: true });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── SCROLL PROGRESS ──────────────────────────────────────────















const prog = document.createElement('div');
prog.className = 'scroll-progress';
document.body.prepend(prog);
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  prog.style.width = (scrollY / (h.scrollHeight - h.clientHeight) * 100) + '%';
}, { passive: true });

// ── HAMBURGER ────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mainNav   = document.getElementById('mainNav');
if (hamburger && mainNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mainNav.classList.toggle('open');
  });
  mainNav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mainNav.classList.remove('open');
    })
  );
  document.addEventListener('click', e => {
    if (!mainNav.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove('open');
      mainNav.classList.remove('open');
    }
  });
}

// ── NAV GLASS ────────────────────────────────────────────────
const navBar = document.querySelector('.container-header');
if (navBar) {
  const updateNav = () => {
    if (scrollY > 60) {
      navBar.style.cssText = 'background:rgba(10,12,16,0.92);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);position:sticky;top:0;z-index:10;transition:background .4s,backdrop-filter .4s';
      navBar.classList.add('nav--scrolled');
    } else {
      navBar.style.cssText = 'background:rgba(10,12,16,0.22);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);position:sticky;top:0;z-index:10;transition:background .4s,backdrop-filter .4s';
      navBar.classList.remove('nav--scrolled');
    }
  };
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}

// ══════════════════════════════════════════════════════════════
// HERO CANVAS — floating ember / spark effect
// Thin glowing lines + drifting particles over the hero image
// ══════════════════════════════════════════════════════════════
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particles
  const COUNT = 55;
  const particles = [];

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = Math.random() * canvas.width;
      this.y  = init ? Math.random() * canvas.height : canvas.height + 10;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(Math.random() * 0.6 + 0.2);
      this.r  = Math.random() * 1.8 + 0.4;
      this.life = 0;
      this.maxLife = Math.random() * 200 + 120;
      // warm ember colors: orange → amber → white tip
      const t = Math.random();
      this.color = t < 0.5
        ? `rgba(232,80,26,`
        : t < 0.8
          ? `rgba(255,160,60,`
          : `rgba(255,220,140,`;
    }
    draw() {
      const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.7;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + alpha + ')';
      ctx.fill();
    }
    update() {
      this.x += this.vx + Math.sin(this.life * 0.04) * 0.3;
      this.y += this.vy;
      this.life++;
      if (this.life >= this.maxLife) this.reset();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  // Thin diagonal scan lines (very subtle)
  function drawLines() {
    ctx.save();
    ctx.strokeStyle = 'rgba(232,80,26,0.04)';
    ctx.lineWidth   = 1;
    const spacing = 48;
    const offset  = (Date.now() * 0.012) % spacing;
    for (let x = -canvas.height + offset; x < canvas.width + canvas.height; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + canvas.height, canvas.height);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Glowing horizontal line that drifts up slowly
  let lineY = canvas.height * 0.75;

  function drawGlowLine() {
    lineY -= 0.15;
    if (lineY < -20) lineY = canvas.height + 20;
    const grad = ctx.createLinearGradient(0, lineY, canvas.width, lineY);
    grad.addColorStop(0,    'rgba(232,80,26,0)');
    grad.addColorStop(0.35, 'rgba(232,80,26,0.06)');
    grad.addColorStop(0.5,  'rgba(255,140,60,0.12)');
    grad.addColorStop(0.65, 'rgba(232,80,26,0.06)');
    grad.addColorStop(1,    'rgba(232,80,26,0)');
    ctx.beginPath();
    ctx.moveTo(0, lineY);
    ctx.lineTo(canvas.width, lineY);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLines();
    drawGlowLine();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  loop();

  // Stop canvas when hero scrolls out of view (performance)
  const heroEl = document.querySelector('.container-1');
  let running = true;
  if (heroEl) {
    const stopObs = new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
    });
    stopObs.observe(heroEl);
  }
})();

// ══════════════════════════════════════════════════════════════
// HERO PARALLAX (bg + text)
// ══════════════════════════════════════════════════════════════
const heroBg = document.querySelector('.container-1');
window.addEventListener('scroll', () => {
  if (!heroBg) return;
  const y = scrollY;
  if (y < window.innerHeight * 1.2) {
    heroBg.style.backgroundPositionY = `calc(center + ${y * 0.3}px)`;
    const txt = heroBg.querySelector('.presentacion-inicio');
    if (txt) {
      txt.style.transform = `translateY(${y * 0.14}px)`;
      txt.style.opacity   = Math.max(0, 1 - y / 500);
    }
  }
}, { passive: true });

// ══════════════════════════════════════════════════════════════
// BRIDGE STRIP PARALLAX
// ══════════════════════════════════════════════════════════════
window.addEventListener('scroll', () => {
  const bridge = document.getElementById('bridgeStrip');
  if (!bridge) return;
  const rect = bridge.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > window.innerHeight) return;
  const layer = bridge.querySelector('.parallax-inner-layer');
  if (layer) {
    const progress = (window.innerHeight / 2 - rect.top - rect.height / 2) * 0.22;
    layer.style.transform = `translateY(${progress}px)`;
  }
}, { passive: true });

// ══════════════════════════════════════════════════════════════
// GALERIA TRABAJOS — parallax removed to keep cards aligned
// ══════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════
// GALERÍA DE TRABAJOS — slideshow con crossfade + progress bar
// ══════════════════════════════════════════════════════════════
// document.addEventListener('DOMContentLoaded', () => {
//   const servicios = [
//     {
//       selector: '.imagenes-servicio-1',
//       imgs: ['imagenes/img6.jpg','imagenes/img11.jpg','imagenes/img8.HEIC']
//     },
//     {
//       selector: '.imagenes-servicio-2',
//       imgs: ['imagenes/img2.jpg','imagenes/gas-5.jpg','imagenes/gas-10.jpg']
//     },
//     {
//       selector: '.imagenes-servicio-3',
//       imgs: ['imagenes/gas-7.jpg','imagenes/gas-8.jpg','imagenes/gas-9.jpg']
//     },
//     {
//       selector: '.imagenes-servicio-4',
//       imgs: ['imagenes/gas-11.jpg','imagenes/gas-12.jpg','imagenes/gas-13.jpg']
//     }
//   ];

//   servicios.forEach(serv => {
//     const el = document.querySelector(serv.selector);
//     if (!el) return;

//     let i = 1, showA = true;
//     const duration = 4000;
//     let start = Date.now(), elapsed = 0, paused = false, raf;

//     const a = document.createElement('div');
//     const b = document.createElement('div');
//     const bar = document.createElement('div');
//     const barInner = document.createElement('div');

//     bar.className = 'progress-bar';
//     barInner.className = 'progress-bar-inner';
//     bar.appendChild(barInner);
//     a.className = 'layer a';
//     b.className = 'layer b';

//     el.style.position = 'relative';
//     // clear any existing children first
//     el.innerHTML = '';
//     el.appendChild(a);
//     el.appendChild(b);
//     el.appendChild(bar);

//     a.style.backgroundImage = `url(${serv.imgs[0]})`;
//     b.style.backgroundImage = `url(${serv.imgs[1]})`;

//     const cambiar = () => {
//       const next     = serv.imgs[i];
//       const incoming = showA ? b : a;
//       const outgoing = showA ? a : b;

//       incoming.style.backgroundImage = `url(${next})`;
//       incoming.style.filter    = 'blur(18px)';
//       incoming.style.opacity   = '0';
//       incoming.style.transform = 'scale(1.08)';

//       requestAnimationFrame(() => {
//         incoming.style.transition = 'opacity 1.4s ease, filter 1.4s ease, transform 1.4s ease';
//         outgoing.style.transition = 'opacity 1.4s ease';
//         incoming.style.opacity   = '1';
//         incoming.style.filter    = 'blur(0)';
//         incoming.style.transform = 'scale(1)';
//         outgoing.style.opacity   = '0';
//       });

//       showA = !showA;
//       i = (i + 1) % serv.imgs.length;
//     };

//     const animate = () => {
//       if (paused) return;
//       elapsed = Date.now() - start;
//       const progress = Math.min(elapsed / duration, 1);
//       barInner.style.transform = `scaleX(${progress})`;
//       if (progress >= 1) { cambiar(); start = Date.now(); elapsed = 0; }
//       raf = requestAnimationFrame(animate);
//     };

//     animate();
//     el.addEventListener('mouseenter', () => { paused = true; cancelAnimationFrame(raf); elapsed = Date.now() - start; });
//     el.addEventListener('mouseleave', () => { if (!paused) return; paused = false; start = Date.now() - elapsed; animate(); });
//   });
// });

// ══════════════════════════════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════════════════════════════
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.feature').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.13}s`;
  revealObs.observe(el);
});
document.querySelectorAll('.sobre-block').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.14}s`;
  revealObs.observe(el);
});

const bridge = document.getElementById('bridgeStrip');
if (bridge) revealObs.observe(bridge);

const fadeObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity   = '1';
      e.target.style.transform = 'translateY(0)';
      fadeObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

['.sobre-bottom', '.badges', '.galeria-header'].forEach(sel => {
  const el = document.querySelector(sel);
  if (el) {
    Object.assign(el.style, { opacity:'0', transform:'translateY(20px)', transition:'opacity .75s .15s ease, transform .75s .15s ease' });
    fadeObs.observe(el);
  }
});



document.addEventListener("DOMContentLoaded", () => {

  const servicios = [
    {
      selector: ".imagenes-servicio-1",
      imgs: ["imagenes/img6.jpg","imagenes/img24.JPG","imagenes/img32.jpeg"]
    },
    {
      selector: ".imagenes-servicio-2",
      imgs: ["imagenes/img39.jpeg","imagenes/img17.jpg","imagenes/img37.jpeg"]
    },
    {
      selector: ".imagenes-servicio-3",
      imgs: ["imagenes/img43.jpeg","imagenes/img61.jpeg","imagenes/img28.jpg"]
    },
    {
      selector: ".imagenes-servicio-4",
      imgs: ["imagenes/img54.jpeg","imagenes/img51.jpeg","imagenes/img18.jpg"]
    }
  ];

  servicios.forEach((serv) => {
    const el = document.querySelector(serv.selector);
    if (!el) return;

    let i = 1;
    let showA = true;

    let duration = 4000;
    let start = Date.now();
    let elapsed = 0;
    let paused = false;

    let raf;

    const a = document.createElement("div");
    const b = document.createElement("div");

    const bar = document.createElement("div");
    const barInner = document.createElement("div");

    bar.className = "progress-bar";
    barInner.className = "progress-bar-inner";

    bar.appendChild(barInner);

    a.className = "layer a";
    b.className = "layer b";

    el.style.position = "relative";
    el.appendChild(a);
    el.appendChild(b);
    el.appendChild(bar);

    a.style.backgroundImage = `url(${serv.imgs[0]})`;

    const animate = () => {
      if (paused) return;

      const now = Date.now();
      elapsed = now - start;

      const progress = Math.min(elapsed / duration, 1);

      barInner.style.transform = `scaleX(${progress})`;

      if (progress >= 1) {
        cambiar();
        start = Date.now();
        elapsed = 0;
      }

      raf = requestAnimationFrame(animate);
    };

    const cambiar = () => {
      const next = serv.imgs[i];

      const incoming = showA ? b : a;
      const outgoing = showA ? a : b;

      incoming.style.backgroundImage = `url(${next})`;

      incoming.style.filter = "blur(22px)";
      incoming.style.opacity = "0";
      incoming.style.transform = "scale(1.1)";

      requestAnimationFrame(() => {
        incoming.style.transition = "opacity 1.4s ease, filter 1.4s ease, transform 1.4s ease";
        outgoing.style.transition = "opacity 1.4s ease, filter 1.4s ease";

        incoming.style.opacity = "1";
        incoming.style.filter = "blur(0px)";
        incoming.style.transform = "scale(1)";

        outgoing.style.opacity = "0";
      });

      showA = !showA;
      i = (i + 1) % serv.imgs.length;
    };

    const startLoop = () => {
      start = Date.now() - elapsed;
      animate();
    };

    const pause = () => {
      paused = true;
      cancelAnimationFrame(raf);
      elapsed = Date.now() - start;
    };

    const resume = () => {
      if (!paused) return;
      paused = false;
      start = Date.now() - elapsed;
      animate();
    };

    // init
    animate();

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);

  });

});


