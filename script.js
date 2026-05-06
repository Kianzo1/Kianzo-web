/* INTRO SCREEN — desbloquea el audio en el primer click del usuario */
(function(){
  const intro=document.getElementById('introScreen');
  if(!intro) return;

  /* Estado global del audio para que katana slash lo use */
  window.__kianzoAudio={ctx:null,buf:null};

  /* Si el usuario ya entró en esta sesión → saltar intro */
  if(sessionStorage.getItem('kianzoEntered')==='1'){
    intro.remove();
    return;
  }

  /* Pre-fetch del audio mientras el usuario mira la intro */
  let rawBuf=null;
  fetch('sword.mp3')
    .then(r=>r.arrayBuffer())
    .then(ab=>{rawBuf=ab;})
    .catch(()=>{});

  function dismiss(){
    sessionStorage.setItem('kianzoEntered','1');
    /* Click del usuario = gesto cualificante para Chrome → audio desbloqueado */
    try{
      const ctx=new(window.AudioContext||window.webkitAudioContext)();
      window.__kianzoAudio.ctx=ctx;
      if(rawBuf){
        ctx.decodeAudioData(rawBuf.slice(0))
          .then(b=>{window.__kianzoAudio.buf=b;})
          .catch(()=>{});
      } else {
        /* Por si el fetch no terminó: reintentar al obtenerlo */
        fetch('sword.mp3').then(r=>r.arrayBuffer())
          .then(ab=>ctx.decodeAudioData(ab))
          .then(b=>{window.__kianzoAudio.buf=b;})
          .catch(()=>{});
      }
    }catch(e){}

    /* Sonido de bienvenida: primeros 5.5s de sound.mp3 con fade-out
       (no es la espada — sword.mp3 SOLO se reproduce al tocar "trasciende") */
    try{
      const ambient=new Audio('sound.mp3');
      ambient.volume=0.68;
      ambient.play().catch(()=>{});
      /* Fade-out empieza a los 5s, termina a los 5.5s */
      setTimeout(()=>{
        const fade=setInterval(()=>{
          if(ambient.volume>0.05) ambient.volume-=0.05;
          else{ambient.pause();ambient.currentTime=0;clearInterval(fade);}
        },50);
      },5000);
    }catch(e){}

    intro.classList.add('gone');
    document.body.style.overflow='';
    setTimeout(()=>intro.remove(),1000);
  }

  document.body.style.overflow='hidden';
  intro.addEventListener('click',dismiss);
})();

/* SCROLL PROGRESS */
const prog=document.getElementById('scrollProgress');
window.addEventListener('scroll',()=>{
  const h=document.documentElement;
  const pct=scrollY/(h.scrollHeight-h.clientHeight)*100;
  if(prog) prog.style.width=pct+'%';
},{passive:true});

/* STRIP COUNTERS */
function animNum(el,end,dur=1200){
  const t0=performance.now();
  (function s(t){
    const p=Math.min((t-t0)/dur,1),v=Math.round((1-Math.pow(1-p,3))*end);
    el.textContent=v;
    if(p<1) requestAnimationFrame(s);
  })(t0);
}
new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    const n1=document.getElementById('n1'),n2=document.getElementById('n2'),n3=document.getElementById('n3');
    if(n1&&!n1.dataset.done){n1.dataset.done=1;animNum(n1,7)}
    if(n2&&!n2.dataset.done){n2.dataset.done=1;animNum(n2,100)}
    if(n3&&!n3.dataset.done){n3.dataset.done=1;animNum(n3,2)}
    document.querySelectorAll('.num-item').forEach(i=>i.classList.add('revealed'));
  });
},{threshold:.3}).observe(document.querySelector('.numbers-strip')||document.body);

/* CURSOR */
const cur=document.getElementById('cursor'),ring=document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.cssText+=`;left:${mx}px;top:${my}px`});
(function t(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.cssText+=`;left:${rx}px;top:${ry}px`;requestAnimationFrame(t)})();

/* NAV */
window.addEventListener('scroll',()=>document.getElementById('navbar').classList.toggle('scrolled',scrollY>60),{passive:true});

/* PARALLAX */
const pBg=document.getElementById('parallaxBg'),kL1=document.getElementById('kL1'),kL2=document.getElementById('kL2'),glow=document.getElementById('heroGlow'),fuji=document.getElementById('fujiWrap'),sun=document.querySelector('.sun-float');
window.addEventListener('scroll',()=>{
  const y=scrollY;
  if(pBg) pBg.style.transform=`translateY(${y*.18}px)`;
  if(kL1) kL1.style.transform=`translateY(${y*.35}px) translateX(${y*.04}px)`;
  if(kL2) kL2.style.transform=`translateY(${y*.22}px) translateX(-${y*.02}px)`;
  if(glow) glow.style.transform=`translateY(${y*.5}px)`;
  if(fuji) fuji.style.transform=`translateY(${y*.28}px)`;
  if(sun)  sun.style.marginTop=`${y*-.15}px`;
},{passive:true});

/* MOUSE PARALLAX HERO */
document.getElementById('hero').addEventListener('mousemove',e=>{
  const r=e.currentTarget.getBoundingClientRect(),dx=(e.clientX-r.left-r.width/2)/(r.width/2),dy=(e.clientY-r.top-r.height/2)/(r.height/2);
  if(kL1) kL1.style.transform+=` translate(${dx*8}px,${dy*5}px)`;
  if(glow) glow.style.transform=`translate(${dx*25}px,${dy*15+scrollY*.5}px)`;
});

/* SCROLL REVEAL */
const rObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    e.target.classList.add('revealed');
    if(e.target.classList.contains('stat')) e.target.classList.add('line-go');
  });
},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('[data-reveal]').forEach(el=>rObs.observe(el));

/* STAGGER SERVICE CARDS */
new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    entry.target.querySelectorAll('.svc-card').forEach((c,i)=>{
      c.style.cssText='opacity:0;transform:translateY(45px) scale(.96)';
      setTimeout(()=>{
        c.style.transition=`opacity .75s ${i*.09}s cubic-bezier(.16,1,.3,1),transform .75s ${i*.09}s cubic-bezier(.16,1,.3,1)`;
        c.style.opacity='1';c.style.transform='none';
      },60+i*90);
    });
  });
},{threshold:.08}).observe(document.getElementById('svcGrid'));

/* PROCESS TIMELINE */
(function(){
  const track = document.getElementById('processTrack');
  if(!track) return;
  const steps = track.querySelectorAll('.process-step');

  // Observe each step individually — stagger by 180ms each
  const stepObs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const idx = +e.target.dataset.step;
      setTimeout(()=>{
        e.target.classList.add('step-visible');
      }, idx * 180);
      stepObs.unobserve(e.target);
    });
  },{threshold:.25,rootMargin:'0px 0px -60px 0px'});

  steps.forEach(s => stepObs.observe(s));

  // Draw the vertical line when track enters view
  const lineObs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      e.target.classList.add('line-in');
      lineObs.unobserve(e.target);
    });
  },{threshold:.1});
  lineObs.observe(track);
})();

/* COUNTERS */
function countUp(el,end,pre,suf){
  const t0=performance.now(),dur=1300;
  (function s(t){
    const p=Math.min((t-t0)/dur,1),v=Math.round((1-Math.pow(1-p,3))*end);
    el.textContent=(pre||'')+v+(suf||'');
    if(p<1) requestAnimationFrame(s);
  })(t0);
}
new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    const el=e.target.querySelector('[data-count]');
    if(!el||el.dataset.done) return;
    el.dataset.done=1;
    countUp(el,+el.dataset.count,el.dataset.prefix||'',el.dataset.suffix||'');
  });
},{threshold:.5}).observe(document.querySelector('.stats-row')||document.body);

/* PORTFOLIO TILT */
document.querySelectorAll('.port-card').forEach(c=>{
  c.addEventListener('mousemove',e=>{
    const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    c.style.transform=`translateY(-6px) rotateY(${x*7}deg) rotateX(${-y*4}deg)`;
  });
  c.addEventListener('mouseleave',()=>{c.style.transition='transform .5s cubic-bezier(.16,1,.3,1),border-color .35s';c.style.transform='';});
});

/* CARD GLOW follow mouse */
document.querySelectorAll('.svc-card').forEach(card=>{
  const g=card.querySelector('.svc-card-glow');
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    if(g){g.style.left=(e.clientX-r.left-110)+'px';g.style.top=(e.clientY-r.top-110)+'px';}
  });
});

/* MAGNETIC BUTTONS */
document.querySelectorAll('.btn-red,.btn-outline,.cbtn').forEach(btn=>{
  btn.addEventListener('mouseenter',()=>{btn.style.transition='transform .12s'});
  btn.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect();
    const dx=(e.clientX-(r.left+r.width/2))*.3;
    const dy=(e.clientY-(r.top+r.height/2))*.3;
    btn.style.transform=`translate(${dx}px,${dy}px)`;
  });
  btn.addEventListener('mouseleave',()=>{
    btn.style.transition='transform .65s cubic-bezier(.16,1,.3,1)';
    btn.style.transform='';
  });
});

/* HAMBURGER MENU */
(function(){
  const hbg=document.getElementById('navHamburger');
  const drawer=document.getElementById('navDrawer');
  if(!hbg||!drawer) return;
  function toggle(){
    const open=hbg.classList.toggle('open');
    drawer.classList.toggle('open',open);
    document.body.style.overflow=open?'hidden':'';
  }
  hbg.addEventListener('click',toggle);
  drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    hbg.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow='';
  }));
})();

/* KATANA SLASH — hero strong (una sola vez por carga) */
(function(){
  const strong=document.querySelector('.hero-title strong');
  if(!strong) return;
  let done=false;

  window.addEventListener('pageshow',()=>{ done=false; });

  function playSound(){
    const a=window.__kianzoAudio;
    /* Caso 1: la intro se mostró → AudioContext ya desbloqueado */
    if(a&&a.ctx&&a.buf){
      try{
        if(a.ctx.state==='suspended') a.ctx.resume();
        const src=a.ctx.createBufferSource();
        src.buffer=a.buf;
        const g=a.ctx.createGain();
        g.gain.value=0.55;
        src.connect(g);g.connect(a.ctx.destination);
        src.start(0);
        return;
      }catch(e){}
    }
    /* Caso 2: se saltó la intro (recarga) → usar HTMLAudio
       el mousedown sobre la palabra es gesto cualificante por sí mismo */
    try{
      const sfx=new Audio('sword.mp3');
      sfx.volume=0.55;
      sfx.play().catch(()=>{});
    }catch(e){}
  }

  strong.addEventListener('mousedown',()=>{
    if(done) return;
    done=true;
    playSound();
    strong.classList.add('slash-active');
    setTimeout(()=>strong.classList.remove('slash-active'),1400);
  });
})();

/* ACTIVE NAV */
new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    document.querySelectorAll('.nav-links a').forEach(a=>a.style.color='');
    const a=document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
    if(a) a.style.color='var(--white)';
  });
},{threshold:.4}).observe(document.body);
document.querySelectorAll('section[id]').forEach(s=>{
  new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      document.querySelectorAll('.nav-links a').forEach(a=>a.style.color='');
      const a=document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if(a) a.style.color='var(--white)';
    });
  },{threshold:.4}).observe(s);
});
