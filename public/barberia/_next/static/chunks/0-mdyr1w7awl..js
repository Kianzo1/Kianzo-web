(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,69376,e=>{"use strict";var r=e.i(2953);let a=`
  .gb {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: pointer;
    text-decoration: none;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 0 32px;
    height: 52px;
    border-radius: 3px;
    border: none;
    -webkit-tap-highlight-color: transparent;
    white-space: nowrap;
  }

  /* ─── Left-to-right gold fill on hover ─── */
  .gb::before {
    content: '';
    width: 0;
    height: 100%;
    border-radius: 3px;
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(to right,
      #8B6914 0%,
      #C9A84C 40%,
      #F0D060 70%,
      #C9A84C 100%
    );
    transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    z-index: 0;
    pointer-events: none;
  }
  .gb:hover::before { width: 100%; }

  /* ─── Text sits above blob ─── */
  .gb__text {
    position: relative;
    z-index: 1;
    transition: color 0.3s ease;
  }

  /* ─── Variants ─── */
  .gb--dark {
    background: #0a0a0a;
    color: #fff;
  }
  .gb--dark:hover .gb__text { color: #1a0f00; }

  .gb--white {
    background: #fff;
    color: #0a0a0a;
  }
  .gb--white:hover .gb__text { color: #1a0f00; }

  .gb--outline {
    background: transparent;
    color: #fff;
    box-shadow: inset 0 0 0 1.5px rgba(255,255,255,0.28);
  }
  .gb--outline:hover .gb__text { color: #1a0f00; }

  .gb--outline-dark {
    background: transparent;
    color: #0a0a0a;
    box-shadow: inset 0 0 0 1.5px rgba(0,0,0,0.22);
  }
  .gb--outline-dark:hover .gb__text { color: #1a0f00; }

  .gb:disabled { opacity: 0.45; cursor: not-allowed; pointer-events: none; }
`;e.s(["GoldButton",0,function({href:e,onClick:t,children:o,variant:i="dark",className:s="",type:n="button",disabled:l}){let p=`gb gb--${i} ${s}`.trim(),c=(0,r.jsx)("span",{className:"gb__text",children:o});return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("style",{children:a}),e?(0,r.jsx)("a",{href:e,className:p,children:c}):(0,r.jsx)("button",{type:n,onClick:t,disabled:l,className:p,children:c})]})}])},20768,e=>{"use strict";var r=e.i(2953),a=e.i(89849),t=e.i(69376);let o="CONFIÁ.",i="SABEMOS DE ESTILO.";e.s(["HeroSection",0,function(){let[e,s]=(0,a.useState)("typing1"),[n,l]=(0,a.useState)(""),[p,c]=(0,a.useState)(""),d=(0,a.useRef)(null);(0,a.useEffect)(()=>{let r=(e,r)=>{d.current=setTimeout(e,r)};return"typing1"===e?n.length<o.length?r(()=>l(o.slice(0,n.length+1)),60):r(()=>s("pause1"),350):"pause1"===e?r(()=>s("typing2"),180):"typing2"===e?p.length<i.length?r(()=>c(i.slice(0,p.length+1)),40):r(()=>s("pause2"),3800):"pause2"===e?r(()=>s("erase2"),0):"erase2"===e?p.length>0?r(()=>c(p.slice(0,-1)),18):r(()=>s("erase1"),0):"erase1"===e&&(n.length>0?r(()=>l(n.slice(0,-1)),30):r(()=>s("typing1"),380)),()=>{d.current&&clearTimeout(d.current)}},[e,n,p]);let b=(0,a.useRef)(null),[m,g]=(0,a.useState)(!1),[f,x]=(0,a.useState)(!1);return(0,a.useEffect)(()=>{let e=setTimeout(()=>g(!0),80),r=setTimeout(()=>x(!0),1600);return()=>{clearTimeout(e),clearTimeout(r)}},[]),(0,r.jsxs)(r.Fragment,{children:[!f&&(0,r.jsx)("div",{"aria-hidden":!0,style:{position:"fixed",inset:0,zIndex:9999,pointerEvents:"none",background:"#080808",backgroundImage:"repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 14px)",transformOrigin:"top center",transform:m?"scaleY(0)":"scaleY(1)",transition:m?"transform 1.2s cubic-bezier(.55,.02,.1,.9) 0.08s":"none"}}),(0,r.jsxs)("section",{className:"hero-section",children:[(0,r.jsxs)("div",{className:"hero-bg",children:[(0,r.jsx)("video",{ref:b,autoPlay:!0,muted:!0,loop:!0,playsInline:!0,poster:"/barberia/hero-barberia.png",style:{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 30%",display:"block",position:"absolute",top:0,left:0},children:(0,r.jsx)("source",{src:"/barberia/hero-barber.mp4",type:"video/mp4"})}),(0,r.jsx)("div",{className:"hero-overlay-main"}),(0,r.jsx)("div",{className:"hero-overlay-bottom"}),(0,r.jsx)("div",{className:"hero-overlay-top"})]}),(0,r.jsx)("div",{className:"hero-wm","aria-hidden":!0,children:"DISTRITO"}),(0,r.jsx)("div",{className:"hero-logo-row hero-fade-down",children:(0,r.jsx)("img",{src:"/barberia/logo-barberia.png",alt:"Distrito Barbershop",width:220,height:220,className:"hero-logo-img"})}),(0,r.jsxs)("div",{className:"hero-content-row",children:[(0,r.jsxs)("div",{className:"hero-headline hero-fade-up",children:[(0,r.jsxs)("div",{className:"hero-line1",children:[n,("typing1"===e||"erase1"===e||"pause1"===e)&&(0,r.jsx)("span",{className:"hero-cursor"})]}),(0,r.jsxs)("div",{className:"hero-line2",style:{visibility:"typing2"===e||"pause2"===e||"erase2"===e?"visible":"hidden"},children:[p||" ",("typing2"===e||"erase2"===e)&&(0,r.jsx)("span",{className:"hero-cursor hero-cursor--sm"})]})]}),(0,r.jsx)("p",{className:"hero-body hero-fade-up hero-delay-2",children:"Cinco sucursales, academia profesional y una comunidad masculina que vive el estilo, el fútbol y la cultura urbana."}),(0,r.jsxs)("div",{className:"hero-ctas hero-fade-up hero-delay-3",children:[(0,r.jsx)(t.GoldButton,{href:"#",variant:"white",children:"Reservar turno →"}),(0,r.jsx)(t.GoldButton,{href:"/academia",variant:"outline",children:"Ver academia →"})]})]}),(0,r.jsx)("div",{className:"hero-spacer"}),(0,r.jsx)("style",{children:`
          /* ── Section ──────────────────────────────── */
          .hero-section {
            background: #000;
            height: 100dvh;
            position: relative;
            overflow: hidden;
            display: grid;
            grid-template-rows: auto 1fr auto;
          }

          /* ── Background ───────────────────────────── */
          .hero-bg {
            position: absolute;
            inset: 0;
            z-index: 0;
            overflow: hidden;
          }
          .hero-overlay-main   { position: absolute; inset: 0; background: rgba(0,0,0,0.5); }
          .hero-overlay-bottom { position: absolute; bottom: 0; left: 0; right: 0; height: 32%; background: linear-gradient(to top, rgba(0,0,0,0.72), transparent); }
          .hero-overlay-top    { position: absolute; top: 0; left: 0; right: 0; height: 28%; background: linear-gradient(to bottom, rgba(0,0,0,0.55), transparent); }

          /* ── Watermark ────────────────────────────── */
          .hero-wm {
            position: absolute; z-index: 1;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%) rotate(-8deg);
            font-family: var(--font-display);
            font-size: clamp(160px, 22vw, 380px);
            letter-spacing: -0.05em;
            text-transform: uppercase;
            color: rgba(255,255,255,0.025);
            pointer-events: none; user-select: none; line-height: 1;
          }

          /* ── Logo ─────────────────────────────────── */
          .hero-logo-row {
            position: relative; z-index: 2;
            display: flex; justify-content: center; padding-top: 36px;
          }
          .hero-logo-img {
            display: block; border-radius: 50%;
            filter: drop-shadow(0 6px 32px rgba(0,0,0,0.75)) drop-shadow(0 0 12px rgba(0,0,0,0.5));
          }

          /* ── Content ──────────────────────────────── */
          .hero-content-row {
            position: relative; z-index: 2;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            text-align: center; padding: 0 var(--gutter);
          }

          /* ── Headline ─────────────────────────────── */
          .hero-headline {
            font-family: var(--font-display);
            font-size: clamp(44px, 6.8vw, 108px);
            line-height: 0.93; letter-spacing: -0.03em;
            text-transform: uppercase; color: #fff; margin-bottom: 28px;
          }
          .hero-line1 { display: block; }
          .hero-line2 {
            display: block; color: rgba(255,255,255,0.48);
            font-size: 0.58em; letter-spacing: -0.01em; margin-top: 0.14em;
          }

          /* ── Cursor ───────────────────────────────── */
          .hero-cursor {
            display: inline-block; width: 3px; height: 0.82em;
            background: #fff; margin-left: 3px; vertical-align: middle;
            animation: cur-blink 1s step-end infinite;
          }
          .hero-cursor--sm { height: 0.7em; }
          @keyframes cur-blink { 0%,100%{opacity:1} 50%{opacity:0} }

          /* ── Body ─────────────────────────────────── */
          .hero-body {
            font-size: 15px; color: rgba(255,255,255,0.48);
            line-height: 1.6; max-width: 38ch; margin: 0 0 32px;
          }

          /* ── CTAs ─────────────────────────────────── */
          .hero-ctas { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; }

          /* ── Spacer ───────────────────────────────── */
          .hero-spacer { position: relative; z-index: 2; height: 32px; }

          /* ── Entry animations ─────────────────────── */
          @keyframes fadeDown {
            from { opacity: 0; transform: translateY(-14px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .hero-fade-down { animation: fadeDown 0.8s cubic-bezier(0.22,1,0.36,1) 1.3s both; }
          .hero-fade-up   { animation: fadeUp  0.8s cubic-bezier(0.22,1,0.36,1) 1.4s both; }
          .hero-delay-2   { animation-delay: 1.55s; }
          .hero-delay-3   { animation-delay: 1.7s; }

          /* ── Mobile ───────────────────────────────── */
          @media (max-width: 768px) {
            .hero-logo-row { padding-top: 40px; }
            .hero-logo-img { width: 140px !important; height: 140px !important; }
            .hero-headline { font-size: clamp(32px, 10vw, 52px) !important; margin-bottom: 14px; }
            .hero-body { font-size: 13px; margin-bottom: 20px; max-width: 28ch; }
            .hero-ctas { gap: 8px; }
            .hero-ctas a, .hero-ctas button { font-size: 10px !important; padding: 0 18px !important; height: 42px !important; }
          }
        `})]})]})}])},11511,e=>{"use strict";let r,a;var t=e.i(2953),o=e.i(5448),i=e.i(23002),s=e.i(89849);let n={sm:{borderRadius:32,borderWidth:1,width:70,height:36},md:{borderRadius:16,borderWidth:1},line:{borderRadius:16,borderWidth:1},"pulse-outside":{borderRadius:16,borderWidth:1},"pulse-inner":{borderRadius:16,borderWidth:1}},l={sm:{dark:{strokeOpacity:.46,innerOpacity:.24,bloomOpacity:.38,innerShadow:"rgba(255, 255, 255, 0.3)",saturation:1.2},light:{strokeOpacity:.12,innerOpacity:.3,bloomOpacity:.16,innerShadow:"rgba(0, 0, 0, 0.14)",saturation:1.8}},md:{dark:{strokeOpacity:.26,innerOpacity:.42,bloomOpacity:.24,innerShadow:"rgba(255, 255, 255, 0.27)",saturation:1.2},light:{strokeOpacity:.12,innerOpacity:.26,bloomOpacity:.34,innerShadow:"rgba(0, 0, 0, 0.14)",saturation:1.5}},line:{dark:{strokeOpacity:1.14,innerOpacity:.7,bloomOpacity:.8,innerShadow:"rgba(255, 255, 255, 0.1)",saturation:1.2},light:{strokeOpacity:.16,innerOpacity:.32,bloomOpacity:.3,innerShadow:"rgba(0, 0, 0, 0.14)",saturation:1.95}},"pulse-outside":{dark:{strokeOpacity:.94,innerOpacity:.34,bloomOpacity:.3,innerShadow:"transparent",saturation:1.2,brightness:1.9,hairlineOpacity:0},light:{strokeOpacity:1.96,innerOpacity:1.04,bloomOpacity:.42,innerShadow:"transparent",saturation:.6,brightness:1.7,hairlineOpacity:0}},"pulse-inner":{dark:{strokeOpacity:1.54,innerOpacity:.44,bloomOpacity:.66,innerShadow:"transparent",saturation:1.2,brightness:.75},light:{strokeOpacity:.32,innerOpacity:.4,bloomOpacity:.8,innerShadow:"transparent",saturation:.75,brightness:1.3}}},p=(l.md.dark,l.md.light,{colorful:{border:[{color:"rgb(255, 50, 100)",pos:"33% -7.4%",size:"70px 40px"},{color:"rgb(40, 140, 255)",pos:"12% -5%",size:"60px 35px"},{color:"rgb(50, 200, 80)",pos:"2.1% 68.3%",size:"40px 70px"},{color:"rgb(30, 185, 170)",pos:"2.1% 68.3%",size:"20px 35px"},{color:"rgb(100, 70, 255)",pos:"74.4% 100%",size:"180px 32px"},{color:"rgb(40, 140, 255)",pos:"55% 100%",size:"85px 26px"},{color:"rgb(255, 120, 40)",pos:"93.9% 0%",size:"74px 32px"},{color:"rgb(240, 50, 180)",pos:"100% 27.1%",size:"26px 42px"},{color:"rgb(180, 40, 240)",pos:"100% 27.1%",size:"52px 48px"}],spike:{primary:"rgb(255, 60, 80)",secondary:"rgba(40, 190, 180, 0.98)"},spikeLt:{primary:"rgb(200, 30, 60)",secondary:"rgb(20, 150, 140)"}},mono:{border:[{color:"rgb(180, 180, 180)",pos:"33% -7.4%",size:"70px 40px"},{color:"rgb(140, 140, 140)",pos:"12% -5%",size:"60px 35px"},{color:"rgb(160, 160, 160)",pos:"2.1% 68.3%",size:"40px 70px"},{color:"rgb(130, 130, 130)",pos:"2.1% 68.3%",size:"20px 35px"},{color:"rgb(170, 170, 170)",pos:"74.4% 100%",size:"180px 32px"},{color:"rgb(150, 150, 150)",pos:"55% 100%",size:"85px 26px"},{color:"rgb(190, 190, 190)",pos:"93.9% 0%",size:"74px 32px"},{color:"rgb(145, 145, 145)",pos:"100% 27.1%",size:"26px 42px"},{color:"rgb(165, 165, 165)",pos:"100% 27.1%",size:"52px 48px"}],spike:{primary:"rgb(200, 200, 200)",secondary:"rgb(170, 170, 170)"},spikeLt:{primary:"rgb(80, 80, 80)",secondary:"rgb(120, 120, 120)"}},ocean:{border:[{color:"rgb(100, 80, 220)",pos:"33% -7.4%",size:"70px 40px"},{color:"rgb(60, 120, 255)",pos:"12% -5%",size:"60px 35px"},{color:"rgb(80, 100, 200)",pos:"2.1% 68.3%",size:"40px 70px"},{color:"rgb(50, 140, 220)",pos:"2.1% 68.3%",size:"20px 35px"},{color:"rgb(120, 80, 255)",pos:"74.4% 100%",size:"180px 32px"},{color:"rgb(70, 130, 255)",pos:"55% 100%",size:"85px 26px"},{color:"rgb(140, 100, 240)",pos:"93.9% 0%",size:"74px 32px"},{color:"rgb(90, 110, 230)",pos:"100% 27.1%",size:"26px 42px"},{color:"rgb(130, 70, 255)",pos:"100% 27.1%",size:"52px 48px"}],spike:{primary:"rgb(100, 120, 255)",secondary:"rgba(130, 100, 220, 0.98)"},spikeLt:{primary:"rgb(60, 60, 180)",secondary:"rgb(80, 100, 200)"}},sunset:{border:[{color:"rgb(255, 80, 50)",pos:"33% -7.4%",size:"70px 40px"},{color:"rgb(255, 160, 40)",pos:"12% -5%",size:"60px 35px"},{color:"rgb(255, 120, 60)",pos:"2.1% 68.3%",size:"40px 70px"},{color:"rgb(255, 200, 50)",pos:"2.1% 68.3%",size:"20px 35px"},{color:"rgb(255, 100, 80)",pos:"74.4% 100%",size:"180px 32px"},{color:"rgb(255, 180, 60)",pos:"55% 100%",size:"85px 26px"},{color:"rgb(255, 60, 60)",pos:"93.9% 0%",size:"74px 32px"},{color:"rgb(255, 140, 50)",pos:"100% 27.1%",size:"26px 42px"},{color:"rgb(255, 90, 70)",pos:"100% 27.1%",size:"52px 48px"}],spike:{primary:"rgb(255, 140, 80)",secondary:"rgba(255, 100, 60, 0.98)"},spikeLt:{primary:"rgb(200, 80, 40)",secondary:"rgb(220, 120, 30)"}}}),c={colorful:{border:[{color:"rgb(50, 200, 80)",pos:"2% 68%",size:"9px 18px"},{color:"rgb(30, 185, 170)",pos:"2% 68%",size:"4px 8px"},{color:"rgb(255, 120, 40)",pos:"72% -3%",size:"59px 9px"},{color:"rgb(100, 70, 255)",pos:"74% 100%",size:"42px 7px"},{color:"rgb(240, 50, 180)",pos:"100% 27%",size:"10px 17px"},{color:"rgb(180, 40, 240)",pos:"100% 27%",size:"10px 18px"},{color:"rgb(40, 140, 255)",pos:"100% 27%",size:"5px 10px"},{color:"rgb(255, 50, 100)",pos:"100% 27%",size:"11px 12px"}],inner:[{color:"rgba(50, 200, 80, 0.5)",pos:"2% 68%",size:"9px 18px"},{color:"rgba(30, 185, 170, 0.45)",pos:"2% 68%",size:"4px 8px"},{color:"rgba(255, 120, 40, 0.35)",pos:"72% -3%",size:"59px 9px"},{color:"rgba(100, 70, 255, 0.35)",pos:"74% 100%",size:"42px 7px"},{color:"rgba(240, 50, 180, 0.3)",pos:"100% 27%",size:"10px 17px"},{color:"rgba(180, 40, 240, 0.4)",pos:"100% 27%",size:"10px 18px"},{color:"rgba(40, 140, 255, 0.3)",pos:"100% 27%",size:"5px 10px"},{color:"rgba(255, 50, 100, 0.3)",pos:"100% 27%",size:"11px 12px"}]},mono:{border:[{color:"rgb(160, 160, 160)",pos:"2% 68%",size:"9px 18px"},{color:"rgb(140, 140, 140)",pos:"2% 68%",size:"4px 8px"},{color:"rgb(180, 180, 180)",pos:"72% -3%",size:"59px 9px"},{color:"rgb(150, 150, 150)",pos:"74% 100%",size:"42px 7px"},{color:"rgb(170, 170, 170)",pos:"100% 27%",size:"10px 17px"},{color:"rgb(155, 155, 155)",pos:"100% 27%",size:"10px 18px"},{color:"rgb(145, 145, 145)",pos:"100% 27%",size:"5px 10px"},{color:"rgb(165, 165, 165)",pos:"100% 27%",size:"11px 12px"}],inner:[{color:"rgba(160, 160, 160, 0.25)",pos:"2% 68%",size:"9px 18px"},{color:"rgba(140, 140, 140, 0.22)",pos:"2% 68%",size:"4px 8px"},{color:"rgba(180, 180, 180, 0.17)",pos:"72% -3%",size:"59px 9px"},{color:"rgba(150, 150, 150, 0.17)",pos:"74% 100%",size:"42px 7px"},{color:"rgba(170, 170, 170, 0.15)",pos:"100% 27%",size:"10px 17px"},{color:"rgba(155, 155, 155, 0.20)",pos:"100% 27%",size:"10px 18px"},{color:"rgba(145, 145, 145, 0.15)",pos:"100% 27%",size:"5px 10px"},{color:"rgba(165, 165, 165, 0.15)",pos:"100% 27%",size:"11px 12px"}]},ocean:{border:[{color:"rgb(60, 140, 200)",pos:"2% 68%",size:"9px 18px"},{color:"rgb(50, 120, 180)",pos:"2% 68%",size:"4px 8px"},{color:"rgb(100, 80, 220)",pos:"72% -3%",size:"59px 9px"},{color:"rgb(80, 100, 255)",pos:"74% 100%",size:"42px 7px"},{color:"rgb(120, 70, 240)",pos:"100% 27%",size:"10px 17px"},{color:"rgb(90, 80, 220)",pos:"100% 27%",size:"10px 18px"},{color:"rgb(70, 110, 255)",pos:"100% 27%",size:"5px 10px"},{color:"rgb(110, 90, 230)",pos:"100% 27%",size:"11px 12px"}],inner:[{color:"rgba(60, 140, 200, 0.5)",pos:"2% 68%",size:"9px 18px"},{color:"rgba(50, 120, 180, 0.45)",pos:"2% 68%",size:"4px 8px"},{color:"rgba(100, 80, 220, 0.35)",pos:"72% -3%",size:"59px 9px"},{color:"rgba(80, 100, 255, 0.35)",pos:"74% 100%",size:"42px 7px"},{color:"rgba(120, 70, 240, 0.3)",pos:"100% 27%",size:"10px 17px"},{color:"rgba(90, 80, 220, 0.4)",pos:"100% 27%",size:"10px 18px"},{color:"rgba(70, 110, 255, 0.3)",pos:"100% 27%",size:"5px 10px"},{color:"rgba(110, 90, 230, 0.3)",pos:"100% 27%",size:"11px 12px"}]},sunset:{border:[{color:"rgb(255, 180, 50)",pos:"2% 68%",size:"9px 18px"},{color:"rgb(255, 150, 40)",pos:"2% 68%",size:"4px 8px"},{color:"rgb(255, 80, 60)",pos:"72% -3%",size:"59px 9px"},{color:"rgb(255, 100, 80)",pos:"74% 100%",size:"42px 7px"},{color:"rgb(255, 60, 80)",pos:"100% 27%",size:"10px 17px"},{color:"rgb(255, 120, 60)",pos:"100% 27%",size:"10px 18px"},{color:"rgb(255, 200, 50)",pos:"100% 27%",size:"5px 10px"},{color:"rgb(255, 90, 70)",pos:"100% 27%",size:"11px 12px"}],inner:[{color:"rgba(255, 180, 50, 0.5)",pos:"2% 68%",size:"9px 18px"},{color:"rgba(255, 150, 40, 0.45)",pos:"2% 68%",size:"4px 8px"},{color:"rgba(255, 80, 60, 0.35)",pos:"72% -3%",size:"59px 9px"},{color:"rgba(255, 100, 80, 0.35)",pos:"74% 100%",size:"42px 7px"},{color:"rgba(255, 60, 80, 0.3)",pos:"100% 27%",size:"10px 17px"},{color:"rgba(255, 120, 60, 0.4)",pos:"100% 27%",size:"10px 18px"},{color:"rgba(255, 200, 50, 0.3)",pos:"100% 27%",size:"5px 10px"},{color:"rgba(255, 90, 70, 0.3)",pos:"100% 27%",size:"11px 12px"}]}},d={colorful:{dark:[{color:"rgb(255, 50, 100)",sizeW:36,sizeH:36,offsetX:0,offsetY:2},{color:"rgb(40, 180, 220)",sizeW:30,sizeH:32,offsetX:39,offsetY:0},{color:"rgb(50, 200, 80)",sizeW:33,sizeH:28,offsetX:-36,offsetY:2},{color:"rgb(180, 40, 240)",sizeW:29,sizeH:34,offsetX:-54,offsetY:0},{color:"rgb(255, 160, 30)",sizeW:27,sizeH:30,offsetX:51,offsetY:-1},{color:"rgb(100, 70, 255)",sizeW:36,sizeH:24,offsetX:21,offsetY:1},{color:"rgb(40, 140, 255)",sizeW:30,sizeH:22,offsetX:-21,offsetY:0},{color:"rgb(240, 50, 180)",sizeW:25,sizeH:28,offsetX:66,offsetY:1},{color:"rgb(30, 185, 170)",sizeW:23,sizeH:30,offsetX:-66,offsetY:-1}],light:[{color:"rgb(255, 50, 100)",sizeW:45,sizeH:36,offsetX:0,offsetY:2},{color:"rgb(40, 140, 255)",sizeW:35,sizeH:32,offsetX:65,offsetY:0},{color:"rgb(50, 200, 80)",sizeW:40,sizeH:28,offsetX:-60,offsetY:2},{color:"rgb(180, 40, 240)",sizeW:35,sizeH:34,offsetX:-90,offsetY:0},{color:"rgb(30, 185, 170)",sizeW:38,sizeH:30,offsetX:85,offsetY:-1},{color:"rgb(100, 70, 255)",sizeW:50,sizeH:24,offsetX:35,offsetY:1},{color:"rgb(40, 140, 255)",sizeW:40,sizeH:22,offsetX:-35,offsetY:0},{color:"rgb(255, 120, 40)",sizeW:35,sizeH:28,offsetX:110,offsetY:1},{color:"rgb(240, 50, 180)",sizeW:30,sizeH:30,offsetX:-110,offsetY:-1}]},mono:{dark:[{color:"rgb(200, 200, 200)",sizeW:36,sizeH:36,offsetX:0,offsetY:2},{color:"rgb(170, 170, 170)",sizeW:30,sizeH:32,offsetX:39,offsetY:0},{color:"rgb(155, 155, 155)",sizeW:33,sizeH:28,offsetX:-36,offsetY:2},{color:"rgb(185, 185, 185)",sizeW:29,sizeH:34,offsetX:-54,offsetY:0},{color:"rgb(165, 165, 165)",sizeW:27,sizeH:30,offsetX:51,offsetY:-1},{color:"rgb(180, 180, 180)",sizeW:36,sizeH:24,offsetX:21,offsetY:1},{color:"rgb(160, 160, 160)",sizeW:30,sizeH:22,offsetX:-21,offsetY:0},{color:"rgb(175, 175, 175)",sizeW:25,sizeH:28,offsetX:66,offsetY:1},{color:"rgb(190, 190, 190)",sizeW:23,sizeH:30,offsetX:-66,offsetY:-1}],light:[{color:"rgb(100, 100, 100)",sizeW:45,sizeH:36,offsetX:0,offsetY:2},{color:"rgb(80, 80, 80)",sizeW:35,sizeH:32,offsetX:65,offsetY:0},{color:"rgb(90, 90, 90)",sizeW:40,sizeH:28,offsetX:-60,offsetY:2},{color:"rgb(70, 70, 70)",sizeW:35,sizeH:34,offsetX:-90,offsetY:0},{color:"rgb(85, 85, 85)",sizeW:38,sizeH:30,offsetX:85,offsetY:-1},{color:"rgb(95, 95, 95)",sizeW:50,sizeH:24,offsetX:35,offsetY:1},{color:"rgb(75, 75, 75)",sizeW:40,sizeH:22,offsetX:-35,offsetY:0},{color:"rgb(105, 105, 105)",sizeW:35,sizeH:28,offsetX:110,offsetY:1},{color:"rgb(65, 65, 65)",sizeW:30,sizeH:30,offsetX:-110,offsetY:-1}]},ocean:{dark:[{color:"rgb(100, 80, 220)",sizeW:36,sizeH:36,offsetX:0,offsetY:2},{color:"rgb(60, 120, 255)",sizeW:30,sizeH:32,offsetX:39,offsetY:0},{color:"rgb(80, 100, 200)",sizeW:33,sizeH:28,offsetX:-36,offsetY:2},{color:"rgb(130, 70, 255)",sizeW:29,sizeH:34,offsetX:-54,offsetY:0},{color:"rgb(70, 130, 255)",sizeW:27,sizeH:30,offsetX:51,offsetY:-1},{color:"rgb(120, 80, 255)",sizeW:36,sizeH:24,offsetX:21,offsetY:1},{color:"rgb(90, 110, 230)",sizeW:30,sizeH:22,offsetX:-21,offsetY:0},{color:"rgb(110, 90, 240)",sizeW:25,sizeH:28,offsetX:66,offsetY:1},{color:"rgb(140, 100, 255)",sizeW:23,sizeH:30,offsetX:-66,offsetY:-1}],light:[{color:"rgb(80, 60, 200)",sizeW:45,sizeH:36,offsetX:0,offsetY:2},{color:"rgb(50, 100, 220)",sizeW:35,sizeH:32,offsetX:65,offsetY:0},{color:"rgb(70, 90, 190)",sizeW:40,sizeH:28,offsetX:-60,offsetY:2},{color:"rgb(110, 60, 220)",sizeW:35,sizeH:34,offsetX:-90,offsetY:0},{color:"rgb(60, 110, 230)",sizeW:38,sizeH:30,offsetX:85,offsetY:-1},{color:"rgb(100, 70, 240)",sizeW:50,sizeH:24,offsetX:35,offsetY:1},{color:"rgb(80, 100, 210)",sizeW:40,sizeH:22,offsetX:-35,offsetY:0},{color:"rgb(90, 80, 225)",sizeW:35,sizeH:28,offsetX:110,offsetY:1},{color:"rgb(120, 90, 245)",sizeW:30,sizeH:30,offsetX:-110,offsetY:-1}]},sunset:{dark:[{color:"rgb(255, 100, 60)",sizeW:36,sizeH:36,offsetX:0,offsetY:2},{color:"rgb(255, 180, 50)",sizeW:30,sizeH:32,offsetX:39,offsetY:0},{color:"rgb(255, 140, 70)",sizeW:33,sizeH:28,offsetX:-36,offsetY:2},{color:"rgb(255, 80, 80)",sizeW:29,sizeH:34,offsetX:-54,offsetY:0},{color:"rgb(255, 200, 60)",sizeW:27,sizeH:30,offsetX:51,offsetY:-1},{color:"rgb(255, 120, 50)",sizeW:36,sizeH:24,offsetX:21,offsetY:1},{color:"rgb(255, 160, 80)",sizeW:30,sizeH:22,offsetX:-21,offsetY:0},{color:"rgb(255, 90, 60)",sizeW:25,sizeH:28,offsetX:66,offsetY:1},{color:"rgb(255, 70, 70)",sizeW:23,sizeH:30,offsetX:-66,offsetY:-1}],light:[{color:"rgb(220, 80, 40)",sizeW:45,sizeH:36,offsetX:0,offsetY:2},{color:"rgb(230, 150, 30)",sizeW:35,sizeH:32,offsetX:65,offsetY:0},{color:"rgb(210, 110, 50)",sizeW:40,sizeH:28,offsetX:-60,offsetY:2},{color:"rgb(200, 60, 60)",sizeW:35,sizeH:34,offsetX:-90,offsetY:0},{color:"rgb(220, 170, 40)",sizeW:38,sizeH:30,offsetX:85,offsetY:-1},{color:"rgb(210, 100, 30)",sizeW:50,sizeH:24,offsetX:35,offsetY:1},{color:"rgb(230, 130, 60)",sizeW:40,sizeH:22,offsetX:-35,offsetY:0},{color:"rgb(190, 70, 50)",sizeW:35,sizeH:28,offsetX:110,offsetY:1},{color:"rgb(180, 50, 50)",sizeW:30,sizeH:30,offsetX:-110,offsetY:-1}]}},b={colorful:[{color:"rgba(255, 50, 100, 0.48)",sizeW:33,sizeH:30,offsetX:0,offsetY:0},{color:"rgba(40, 180, 220, 0.42)",sizeW:24,sizeH:26,offsetX:39,offsetY:-3},{color:"rgba(50, 200, 80, 0.48)",sizeW:27,sizeH:24,offsetX:-36,offsetY:0},{color:"rgba(180, 40, 240, 0.42)",sizeW:23,sizeH:28,offsetX:-54,offsetY:-2},{color:"rgba(255, 160, 30, 0.50)",sizeW:24,sizeH:24,offsetX:51,offsetY:-1},{color:"rgba(100, 70, 255, 0.45)",sizeW:30,sizeH:20,offsetX:21,offsetY:0},{color:"rgba(40, 140, 255, 0.40)",sizeW:25,sizeH:18,offsetX:-21,offsetY:-2},{color:"rgba(240, 50, 180, 0.45)",sizeW:21,sizeH:24,offsetX:66,offsetY:0},{color:"rgba(30, 185, 170, 0.52)",sizeW:18,sizeH:26,offsetX:-66,offsetY:-1}],mono:[{color:"rgba(200, 200, 200, 0.48)",sizeW:33,sizeH:30,offsetX:0,offsetY:0},{color:"rgba(170, 170, 170, 0.42)",sizeW:24,sizeH:26,offsetX:39,offsetY:-3},{color:"rgba(155, 155, 155, 0.48)",sizeW:27,sizeH:24,offsetX:-36,offsetY:0},{color:"rgba(185, 185, 185, 0.42)",sizeW:23,sizeH:28,offsetX:-54,offsetY:-2},{color:"rgba(165, 165, 165, 0.50)",sizeW:24,sizeH:24,offsetX:51,offsetY:-1},{color:"rgba(180, 180, 180, 0.45)",sizeW:30,sizeH:20,offsetX:21,offsetY:0},{color:"rgba(160, 160, 160, 0.40)",sizeW:25,sizeH:18,offsetX:-21,offsetY:-2},{color:"rgba(175, 175, 175, 0.45)",sizeW:21,sizeH:24,offsetX:66,offsetY:0},{color:"rgba(190, 190, 190, 0.52)",sizeW:18,sizeH:26,offsetX:-66,offsetY:-1}],ocean:[{color:"rgba(100, 80, 220, 0.48)",sizeW:33,sizeH:30,offsetX:0,offsetY:0},{color:"rgba(60, 120, 255, 0.42)",sizeW:24,sizeH:26,offsetX:39,offsetY:-3},{color:"rgba(80, 100, 200, 0.48)",sizeW:27,sizeH:24,offsetX:-36,offsetY:0},{color:"rgba(130, 70, 255, 0.42)",sizeW:23,sizeH:28,offsetX:-54,offsetY:-2},{color:"rgba(70, 130, 255, 0.50)",sizeW:24,sizeH:24,offsetX:51,offsetY:-1},{color:"rgba(120, 80, 255, 0.45)",sizeW:30,sizeH:20,offsetX:21,offsetY:0},{color:"rgba(90, 110, 230, 0.40)",sizeW:25,sizeH:18,offsetX:-21,offsetY:-2},{color:"rgba(110, 90, 240, 0.45)",sizeW:21,sizeH:24,offsetX:66,offsetY:0},{color:"rgba(140, 100, 255, 0.52)",sizeW:18,sizeH:26,offsetX:-66,offsetY:-1}],sunset:[{color:"rgba(255, 100, 60, 0.48)",sizeW:33,sizeH:30,offsetX:0,offsetY:0},{color:"rgba(255, 180, 50, 0.42)",sizeW:24,sizeH:26,offsetX:39,offsetY:-3},{color:"rgba(255, 140, 70, 0.48)",sizeW:27,sizeH:24,offsetX:-36,offsetY:0},{color:"rgba(255, 80, 80, 0.42)",sizeW:23,sizeH:28,offsetX:-54,offsetY:-2},{color:"rgba(255, 200, 60, 0.50)",sizeW:24,sizeH:24,offsetX:51,offsetY:-1},{color:"rgba(255, 120, 50, 0.45)",sizeW:30,sizeH:20,offsetX:21,offsetY:0},{color:"rgba(255, 160, 80, 0.40)",sizeW:25,sizeH:18,offsetX:-21,offsetY:-2},{color:"rgba(255, 90, 60, 0.45)",sizeW:21,sizeH:24,offsetX:66,offsetY:0},{color:"rgba(255, 70, 70, 0.52)",sizeW:18,sizeH:26,offsetX:-66,offsetY:-1}]},m={colorful:{dark:{spikes:[{color1:"rgb(100, 70, 255)",color2:"rgba(100, 70, 255, 1)"},{color1:"rgba(255, 170, 40, 0.59)",color2:"rgba(255, 170, 40, 0.29)"},{color1:"rgb(50, 200, 100)",color2:"rgba(50, 200, 100, 1)"},{color1:"rgba(200, 50, 240, 0.91)",color2:"rgba(200, 50, 240, 0.45)"},{color1:"rgb(40, 140, 255)",color2:"rgba(40, 140, 255, 1)"}]},light:{spikes:[{color1:"rgb(80, 50, 200)",color2:"rgba(80, 50, 200, 0.8)"},{color1:"rgba(210, 130, 0, 0.7)",color2:"rgba(210, 130, 0, 0.46)"},{color1:"rgb(30, 160, 70)",color2:"rgba(30, 160, 70, 0.82)"},{color1:"rgb(160, 30, 190)",color2:"rgba(160, 30, 190, 0.7)"},{color1:"rgb(30, 100, 200)",color2:"rgba(30, 100, 200, 0.78)"}]}},mono:{dark:{spikes:[{color1:"rgb(200, 200, 200)",color2:"rgba(200, 200, 200, 1)"},{color1:"rgba(180, 180, 180, 0.59)",color2:"rgba(180, 180, 180, 0.29)"},{color1:"rgb(190, 190, 190)",color2:"rgba(190, 190, 190, 1)"},{color1:"rgba(170, 170, 170, 0.91)",color2:"rgba(170, 170, 170, 0.45)"},{color1:"rgb(185, 185, 185)",color2:"rgba(185, 185, 185, 1)"}]},light:{spikes:[{color1:"rgb(80, 80, 80)",color2:"rgba(80, 80, 80, 0.8)"},{color1:"rgba(100, 100, 100, 0.7)",color2:"rgba(100, 100, 100, 0.46)"},{color1:"rgb(70, 70, 70)",color2:"rgba(70, 70, 70, 0.82)"},{color1:"rgb(90, 90, 90)",color2:"rgba(90, 90, 90, 0.7)"},{color1:"rgb(85, 85, 85)",color2:"rgba(85, 85, 85, 0.78)"}]}},ocean:{dark:{spikes:[{color1:"rgb(100, 80, 255)",color2:"rgb(100, 80, 255)"},{color1:"rgba(80, 130, 220, 0.59)",color2:"rgba(80, 130, 220, 0.29)"},{color1:"rgb(60, 100, 255)",color2:"rgb(60, 100, 255)"},{color1:"rgba(90, 120, 200, 0.91)",color2:"rgba(90, 120, 200, 0.45)"},{color1:"rgb(120, 90, 255)",color2:"rgb(120, 90, 255)"}]},light:{spikes:[{color1:"rgb(50, 40, 180)",color2:"rgba(50, 40, 180, 0.8)"},{color1:"rgba(40, 80, 200, 0.7)",color2:"rgba(40, 80, 200, 0.46)"},{color1:"rgb(30, 50, 190)",color2:"rgba(30, 50, 190, 0.82)"},{color1:"rgb(60, 90, 180)",color2:"rgba(60, 90, 180, 0.7)"},{color1:"rgb(70, 60, 200)",color2:"rgba(70, 60, 200, 0.78)"}]}},sunset:{dark:{spikes:[{color1:"rgb(255, 100, 80)",color2:"rgb(255, 100, 80)"},{color1:"rgba(255, 150, 80, 0.59)",color2:"rgba(255, 150, 80, 0.29)"},{color1:"rgb(255, 80, 60)",color2:"rgb(255, 80, 60)"},{color1:"rgba(255, 120, 50, 0.91)",color2:"rgba(255, 120, 50, 0.45)"},{color1:"rgb(255, 140, 70)",color2:"rgb(255, 140, 70)"}]},light:{spikes:[{color1:"rgb(200, 60, 30)",color2:"rgba(200, 60, 30, 0.8)"},{color1:"rgba(220, 100, 20, 0.7)",color2:"rgba(220, 100, 20, 0.46)"},{color1:"rgb(180, 40, 20)",color2:"rgba(180, 40, 20, 0.82)"},{color1:"rgb(210, 80, 10)",color2:"rgba(210, 80, 10, 0.7)"},{color1:"rgb(190, 70, 30)",color2:"rgba(190, 70, 30, 0.78)"}]}}};function g(e,r){let a=e.match(/^rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*[\d.]+\s*\)$/);if(a)return`rgba(${a[1]}, ${a[2]}, ${a[3]}, ${r})`;let t=e.match(/^rgb\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/);return t?`rgba(${t[1]}, ${t[2]}, ${t[3]}, ${r})`:e}function f(e,r){let a=e.match(/^rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/);if(a)return`rgba(${a[1]}, ${a[2]}, ${a[3]}, ${(parseFloat(a[4])*r).toFixed(2)})`;let t=e.match(/^rgb\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/);return t?`rgba(${t[1]}, ${t[2]}, ${t[3]}, ${r.toFixed(2)})`:e}let x=[{region:1,quad:"tl"},{region:2,quad:"tl"},{region:3,quad:"bl"},{region:1,quad:"bl"},{region:2,quad:"br"},{region:3,quad:"br"},{region:1,quad:"tr"},{region:2,quad:"tr"},{region:3,quad:"tr"}],u=[[65,35],[55,30],[35,65],[15,30],[173,28],[80,22],[69,28],[22,38],[47,44]],h=[{ci:0,region:1,quad:"tl",w:84,h:48},{ci:1,region:2,quad:"tl",w:72,h:42},{ci:2,region:3,quad:"bl",w:48,h:84},{ci:4,region:2,quad:"br",w:216,h:38},{ci:5,region:3,quad:"br",w:102,h:31},{ci:6,region:1,quad:"tr",w:89,h:38},{ci:8,region:3,quad:"tr",w:62,h:58}],v=[{ci:0,region:1,quad:"tl",w:80,h:19,x:"27%",y:"0%"},{ci:6,region:2,quad:"tr",w:74,h:11,x:"73%",y:"-1%"},{ci:7,region:3,quad:"tr",w:15,h:44,x:"100%",y:"33%"},{ci:8,region:1,quad:"br",w:19,h:38,x:"101%",y:"72%"},{ci:4,region:2,quad:"br",w:84,h:13,x:"67%",y:"100%"},{ci:1,region:3,quad:"bl",w:60,h:21,x:"24%",y:"101%"},{ci:2,region:1,quad:"bl",w:17,h:40,x:"0%",y:"60%"},{ci:3,region:2,quad:"tl",w:13,h:32,x:"-1%",y:"28%"}],y=[{ci:0,region:1,quad:"tl",w:110,h:30,x:"27%",y:"3%"},{ci:6,region:2,quad:"tr",w:100,h:20,x:"73%",y:"1%"},{ci:7,region:3,quad:"tr",w:26,h:62,x:"100%",y:"33%"},{ci:8,region:1,quad:"br",w:30,h:56,x:"101%",y:"72%"},{ci:4,region:2,quad:"br",w:120,h:22,x:"67%",y:"99%"},{ci:1,region:3,quad:"bl",w:88,h:32,x:"24%",y:"99%"},{ci:2,region:1,quad:"bl",w:28,h:58,x:"0%",y:"60%"}];function $(e,r,a,t,o,i,s,n){let l;return`radial-gradient(ellipse calc(${r}px * var(--bw${t}-${n}) * var(--pulse-glow-sx, 1)) calc(${a}px * var(--bh${t}-${n}) * var(--bgh-${n}) * var(--pulse-glow-sy, 1)) at calc(${i} + var(--bx${t}-${n})) calc(${s} + var(--by${t}-${n})), ${l=e.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/),`rgba(${l?`${l[1]}, ${l[2]}, ${l[3]}`:"255, 255, 255"}, var(--bop-${o}-${n}))`}, transparent)`}function w(e,r,a){let t=p[r].border;return e.map(e=>{let r=t[e.ci],[o,i]=r.pos.split(" ");return $(r.color,e.w,e.h,e.region,e.quad,e.x??o,e.y??i,a)}).join(`,
    `)}function k(e,r,a){let t=p[r].border,o=+a.toFixed(3);return e.map(e=>{let r=t[e.ci],[a,i]=r.pos.split(" "),s=e.x??a,n=e.y??i,l=r.color.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/),p=l?`${l[1]}, ${l[2]}, ${l[3]}`:"255, 255, 255";return`radial-gradient(ellipse ${e.w}px ${e.h}px at ${s} ${n}, rgba(${p}, ${o}), transparent)`}).join(`,
    `)}function z(e){return`
[data-beam="${e}"][data-paused],
[data-beam="${e}"][data-paused]::after,
[data-beam="${e}"][data-paused]::before,
[data-beam="${e}"][data-paused] [data-beam-bloom] {
  animation-play-state: paused !important;
}`}function j(e){let r=["bw1","bh1","bw2","bh2","bw3","bh3","bgh","bop-tl","bop-tr","bop-bl","bop-br"].map(r=>`@property --${r}-${e} {
  syntax: "<number>";
  initial-value: 1;
  inherits: true;
}`).join(`

`),a=["bx1","by1","bx2","by2","bx3","by3"].map(r=>`@property --${r}-${e} {
  syntax: "<length>";
  initial-value: 0px;
  inherits: true;
}`).join(`

`);return`${r}

${a}

@property --beam-opacity-${e} {
  syntax: "<number>";
  initial-value: 0;
  inherits: true;
}

@property --beam-hue-${e} {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: true;
}`}function W(e,r,a){let t="dark"===r,o=a/2.3;return"pulse-inner"===e?{sp:.28,dr:t?33:40,op:t?.48:.45,gh:t?.34:.22,bs:(t?1.9:2.6)*o,ss:(t?2.6:4.6)*o,ghs:(t?2.4:5.5)*o,huePeriod:12}:{sp:t?.28:.36,dr:t?14:19,op:.46*!!t,gh:t?.16:.58,bs:(t?2.3:3.7)*o,ss:(t?6.4:4.6)*o,ghs:(t?2.4:3.8)*o,huePeriod:8}}function S(e,r,a){return`  animation: ${r}-${e} ${a}s ease forwards;`}let H=new Set,F=null,X=0,Y=1e3/30-2,N=2*Math.PI;function C(e){return(1-Math.cos(N*e))/2}function O(e){if(F=requestAnimationFrame(O),e-X<Y)return;X=e;let r=e/1e3;H.forEach(({el:e,config:a})=>{for(let t of a.oscillators){let a=(r-t.delay)/t.period,o=t.a+(t.b-t.a)*C(a);e.style.setProperty(t.prop,"px"===t.unit?`${o.toFixed(2)}px`:o.toFixed(4))}if(a.hue){let{prop:t,range:o,period:i}=a.hue,s=-o+2*o*C(r/i);e.style.setProperty(t,`${s.toFixed(2)}deg`)}})}let T=(0,s.forwardRef)(function({children:e,size:r="md",colorVariant:a="colorful",theme:o="dark",staticColors:i=!1,duration:Y,active:N=!0,borderRadius:C,brightness:T,saturation:R,hueRange:E=30,strength:I=1,className:M,style:A,onActivate:q,onDeactivate:B,onAnimationEnd:D,...P},G){let L=(0,s.useId)().replace(/:/g,"-"),_=function(){let[e,r]=(0,s.useState)(()=>typeof window>"u"||window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");return(0,s.useEffect)(()=>{if(typeof window>"u")return;let e=window.matchMedia("(prefers-color-scheme: dark)"),a=e=>{r(e.matches?"dark":"light")};return e.addEventListener("change",a),()=>e.removeEventListener("change",a)},[]),e}(),V=(0,s.useRef)(null),[U,K]=(0,s.useState)(N),[J,Q]=(0,s.useState)(!1),[Z,ee]=(0,s.useState)(!0),[er,ea]=(0,s.useState)(null),[et,eo]=(0,s.useState)({x:1,y:1});(0,s.useEffect)(()=>{if(null!=C)return;let e=V.current;if(!e)return;let r=()=>{let r=e.firstElementChild;if(!r)return;let a=parseFloat(getComputedStyle(r).borderTopLeftRadius);!isNaN(a)&&a>0&&ea(a)};r();let a=new MutationObserver(r);return a.observe(e,{childList:!0,subtree:!1}),()=>a.disconnect()},[C,e]),(0,s.useEffect)(()=>{!N||U||J?N||!U||J||Q(!0):K(!0)},[N,U,J]),(0,s.useEffect)(()=>{let e=V.current;if(!e||typeof IntersectionObserver>"u")return;let r=new IntersectionObserver(e=>{for(let r of e)ee(r.isIntersecting)},{rootMargin:"256px"});return r.observe(e),()=>r.disconnect()},[]),(0,s.useEffect)(()=>{if("pulse-outside"!==r)return void eo({x:1,y:1});let e=V.current;if(!e)return;let a=e=>Math.max(.35,Math.min(4,e)),t=()=>{let r=e.firstElementChild;if(!r)return;let t=r.getBoundingClientRect();if(!t.width||!t.height)return;let o=+a(t.width/350).toFixed(3),i=+a(t.height/140).toFixed(3);eo(e=>e.x===o&&e.y===i?e:{x:o,y:i})};if(t(),typeof ResizeObserver>"u")return;let o=e.firstElementChild;if(!o)return;let i=new ResizeObserver(t);return i.observe(o),()=>i.disconnect()},[r,e]);let ei=(0,s.useCallback)(e=>{let r=e.animationName;r.includes("fade-out")?(K(!1),Q(!1),null==B||B()):r.includes("fade-in")&&(null==q||q()),null==D||D(e)},[q,B,D]),es="auto"===o?_:o,en=l[r][es],el=n[r],ep="pulse-inner"===r||"pulse-outside"===r,ec=C??er??el.borderRadius,ed=Y??("line"===r?3.1:ep?2.3:1.96),eb=R??en.saturation,em=T??en.brightness??1.3,eg="line"===r?Math.min(E,13):E,ef="mono"===a||i,ex=(0,s.useMemo)(()=>(function(e){let{size:r}=e;return"line"===r?function(e){let{id:r,borderRadius:a,borderWidth:t,duration:o,strokeOpacity:i,innerOpacity:s,bloomOpacity:n,innerShadow:l,colorVariant:c,staticColors:x,brightness:u,saturation:h,hueRange:v,theme:y}=e,$=Math.max(0,a-t),w="dark"===y,k=x?"":`animation: beam-hue-shift-${r} 12s ease-in-out infinite;`,j=x?"":`animation: beam-hue-shift-bloom-${r} 8s ease-in-out infinite;`,W=x?"":`
@keyframes beam-hue-shift-${r} {
  0% { filter: hue-rotate(-${v}deg) brightness(${u.toFixed(2)}) saturate(${h.toFixed(2)}); }
  50% { filter: hue-rotate(${v}deg) brightness(${u.toFixed(2)}) saturate(${h.toFixed(2)}); }
  100% { filter: hue-rotate(-${v}deg) brightness(${u.toFixed(2)}) saturate(${h.toFixed(2)}); }
}

@keyframes beam-hue-shift-bloom-${r} {
  0% { filter: blur(8px) hue-rotate(-${v+10}deg) brightness(${u.toFixed(2)}) saturate(${h.toFixed(2)}); }
  50% { filter: blur(8px) hue-rotate(${v+10}deg) brightness(${u.toFixed(2)}) saturate(${h.toFixed(2)}); }
  100% { filter: blur(8px) hue-rotate(-${v+10}deg) brightness(${u.toFixed(2)}) saturate(${h.toFixed(2)}); }
}`,S=w?`radial-gradient(
        ellipse calc(24px * var(--beam-w-${r})) calc(28px * var(--beam-h-${r})) at calc(var(--beam-x-${r}) * 100%) calc(100% + 2px),
        rgba(255, 255, 255, 0.38) 0%,
        rgba(255, 255, 255, 0.12) 30%,
        transparent 65%
      )`:`radial-gradient(
        ellipse calc(35px * var(--beam-w-${r})) calc(28px * var(--beam-h-${r})) at calc(var(--beam-x-${r}) * 100%) calc(100% + 2px),
        rgba(0, 0, 0, 0.6) 0%,
        rgba(0, 0, 0, 0.25) 35%,
        transparent 70%
      )`,H=d[c][w?"dark":"light"].map(e=>{let a=0===e.offsetX?"":e.offsetX>0?` + ${e.offsetX}px`:` - ${Math.abs(e.offsetX)}px`,t=0===e.offsetY?"":e.offsetY>0?` + ${e.offsetY}px`:` - ${Math.abs(e.offsetY)}px`;return`radial-gradient(ellipse calc(${e.sizeW}px * var(--beam-w-${r})) calc(${e.sizeH}px * var(--beam-h-${r})) at calc(var(--beam-x-${r}) * 100%${a}) calc(100%${t}), ${e.color}, transparent)`}).join(`,
       `),F=b[c].map(e=>{let a=0===e.offsetX?"":e.offsetX>0?` + ${e.offsetX}px`:` - ${Math.abs(e.offsetX)}px`,t=0===e.offsetY?"":` - ${Math.abs(e.offsetY)}px`;return`radial-gradient(ellipse calc(${e.sizeW}px * var(--beam-w-${r})) calc(${e.sizeH}px * var(--beam-h-${r})) at calc(var(--beam-x-${r}) * 100%${a}) calc(100%${t}), ${e.color}, transparent)`}).join(`,
    `),X=function(e,r,a){let t,o=(t=p[e],r?t.spike:t.spikeLt),i=m[e][r?"dark":"light"],s="mono"===e,n=s?.14:1,l=s?f(o.primary,.14):o.primary,c=s?f(o.primary,.09):o.primary,d=s?f(o.secondary,.12):o.secondary,b=s?g(o.secondary,.06):g(o.secondary,.49),x=i.spikes.map(e=>s?{color1:f(e.color1,n),color2:f(e.color2,.7*n)}:e),u=s?"12px":"0.8px",h=s?"14px":"2px",v=s?"12px":"1.2px",y=s?"42px":"92px",$=s?"38px":"72px",w=s?"40px":"85px",k=s?"32px":"60px";if(r)return`radial-gradient(ellipse calc(${u} * var(--beam-spike-${a})) calc(${y} * var(--beam-h-${a})) at 8% calc(100% - 2px), ${l}, ${c} 30%, transparent 88%),
       radial-gradient(ellipse calc(10px * var(--beam-spike2-${a})) calc(35px * var(--beam-h-${a})) at 22% calc(100% - 4px), ${d}, ${b} 50%, transparent 95%),
       radial-gradient(ellipse calc(${h} * (2 - var(--beam-spike-${a}))) calc(${$} * var(--beam-h-${a})) at 36% calc(100% - 3px), ${x[0].color1}, ${x[0].color2} 40%, transparent 90%),
       radial-gradient(ellipse calc(14px * var(--beam-spike2-${a})) calc(28px * var(--beam-h-${a})) at 50% calc(100% - 2px), ${x[1].color1}, ${x[1].color2} 55%, transparent 96%),
       radial-gradient(ellipse calc(${v} * (2 - var(--beam-spike2-${a}))) calc(${w} * var(--beam-h-${a})) at 64% calc(100% - 4px), ${x[2].color1}, ${x[2].color2} 35%, transparent 89%),
       radial-gradient(ellipse calc(7px * var(--beam-spike-${a})) calc(45px * var(--beam-h-${a})) at 78% calc(100% - 2px), ${x[3].color1}, ${x[3].color2} 48%, transparent 94%),
       radial-gradient(ellipse calc(${s?"10px":"0.6px"} * (2 - var(--beam-spike-${a}))) calc(${k} * var(--beam-h-${a})) at 92% calc(100% - 3px), ${x[4].color1}, ${x[4].color2} 42%, transparent 91%),
       radial-gradient(ellipse calc(21px * var(--beam-spike-${a})) calc(15px * var(--beam-spike2-${a})) at calc(var(--beam-x-${a}) * 100%) calc(100% + 1px), ${s?"rgba(255, 255, 255, 0.5)":"rgba(255, 255, 255, 1)"} 0%, ${s?"rgba(255, 255, 255, 0.45)":"rgba(255, 255, 255, 0.9)"} 20%, ${s?"rgba(255, 255, 255, 0.25)":"rgba(255, 255, 255, 0.5)"} 50%, transparent 100%),
       radial-gradient(ellipse calc(42px * var(--beam-w-${a})) calc(40px * var(--beam-h-${a})) at calc(var(--beam-x-${a}) * 100%) 100%, ${s?"rgba(255, 255, 255, 0.15)":"rgba(255, 255, 255, 0.3)"} 0%, ${s?"rgba(255, 255, 255, 0.06)":"rgba(255, 255, 255, 0.12)"} 25%, ${s?"rgba(255, 255, 255, 0.015)":"rgba(255, 255, 255, 0.03)"} 55%, transparent 80%)`;{let e=s?f(o.primary,.11):g(o.primary,.85),r=s?f(o.secondary,.09):g(o.secondary,.7);return`radial-gradient(ellipse calc(${u} * var(--beam-spike-${a})) calc(${y} * var(--beam-h-${a})) at 8% calc(100% - 2px), ${l}, ${e} 30%, transparent 88%),
       radial-gradient(ellipse calc(10px * var(--beam-spike2-${a})) calc(35px * var(--beam-h-${a})) at 22% calc(100% - 4px), ${d}, ${r} 50%, transparent 95%),
       radial-gradient(ellipse calc(${h} * (2 - var(--beam-spike-${a}))) calc(${$} * var(--beam-h-${a})) at 36% calc(100% - 3px), ${x[0].color1}, ${x[0].color2} 40%, transparent 90%),
       radial-gradient(ellipse calc(14px * var(--beam-spike2-${a})) calc(28px * var(--beam-h-${a})) at 50% calc(100% - 2px), ${x[1].color1}, ${x[1].color2} 55%, transparent 96%),
       radial-gradient(ellipse calc(${v} * (2 - var(--beam-spike2-${a}))) calc(${w} * var(--beam-h-${a})) at 64% calc(100% - 4px), ${x[2].color1}, ${x[2].color2} 35%, transparent 89%),
       radial-gradient(ellipse calc(7px * var(--beam-spike-${a})) calc(45px * var(--beam-h-${a})) at 78% calc(100% - 2px), ${x[3].color1}, ${x[3].color2} 48%, transparent 94%),
       radial-gradient(ellipse calc(${s?"12px":"1px"} * (2 - var(--beam-spike-${a}))) calc(${k} * var(--beam-h-${a})) at 92% calc(100% - 3px), ${x[4].color1}, ${x[4].color2} 42%, transparent 91%),
       radial-gradient(ellipse calc(50px * var(--beam-w-${a})) calc(32px * var(--beam-h-${a})) at calc(var(--beam-x-${a}) * 100%) calc(100%), rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.18) 30%, rgba(0, 0, 0, 0.03) 60%, transparent 85%)`}}(c,w,r),Y="mono"===c?"filter: blur(6px);":"";return`
@property --beam-x-${r} {
  syntax: "<number>";
  initial-value: 0;
  inherits: true;
}

@property --beam-w-${r} {
  syntax: "<number>";
  initial-value: 1;
  inherits: true;
}

@property --beam-h-${r} {
  syntax: "<number>";
  initial-value: 1;
  inherits: true;
}

@property --beam-spike-${r} {
  syntax: "<number>";
  initial-value: 1;
  inherits: true;
}

@property --beam-spike2-${r} {
  syntax: "<number>";
  initial-value: 1;
  inherits: true;
}

@property --beam-edge-${r} {
  syntax: "<number>";
  initial-value: 1;
  inherits: true;
}

@property --beam-opacity-${r} {
  syntax: "<number>";
  initial-value: 0;
  inherits: true;
}

[data-beam="${r}"] {
  position: relative;
  border-radius: ${a}px;
  overflow: hidden;
}

[data-beam="${r}"][data-active] {
  animation:
    beam-travel-${r} ${o}s linear infinite,
    beam-edge-fade-${r} ${o}s linear infinite,
    beam-breathe-${r} ${(1.3*o).toFixed(1)}s ease-in-out infinite,
    beam-spike-${r} ${(1.33*o).toFixed(1)}s ease-in-out infinite,
    beam-spike2-${r} ${(1.7*o).toFixed(1)}s ease-in-out infinite,
    beam-fade-in-${r} 0.6s ease forwards;
}

[data-beam="${r}"][data-fading] {
  animation:
    beam-travel-${r} ${o}s linear infinite,
    beam-edge-fade-${r} ${o}s linear infinite,
    beam-breathe-${r} ${(1.3*o).toFixed(1)}s ease-in-out infinite,
    beam-spike-${r} ${(1.33*o).toFixed(1)}s ease-in-out infinite,
    beam-spike2-${r} ${(1.7*o).toFixed(1)}s ease-in-out infinite,
    beam-fade-out-${r} 0.5s ease forwards;
}

[data-beam="${r}"][data-active]::after,
[data-beam="${r}"][data-fading]::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${$}px;
  padding: ${t}px;
  clip-path: inset(0 round ${a}px);
  background: ${S}, ${H};
  -webkit-mask:
    radial-gradient(
      ellipse calc(78px * var(--beam-w-${r})) calc(60px * var(--beam-h-${r})) at calc(var(--beam-x-${r}) * 100%) 100%,
      white 0%, rgba(255, 255, 255, 0.5) 45%, transparent 100%
    ),
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: source-in, xor;
  mask:
    radial-gradient(
      ellipse calc(78px * var(--beam-w-${r})) calc(60px * var(--beam-h-${r})) at calc(var(--beam-x-${r}) * 100%) 100%,
      white 0%, rgba(255, 255, 255, 0.5) 45%, transparent 100%
    ),
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: intersect, exclude;
  pointer-events: none;
  z-index: 2;
  opacity: calc(var(--beam-opacity-${r}) * var(--beam-edge-${r}) * ${i.toFixed(2)} * var(--beam-strength, 1));
  ${k}
}

[data-beam="${r}"][data-active]::before,
[data-beam="${r}"][data-fading]::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${a}px;
  background: ${F};
  box-shadow: inset 0 0 9px 1px ${l};
  -webkit-mask-image:
    radial-gradient(
      ellipse calc(78px * var(--beam-w-${r})) calc(60px * var(--beam-h-${r})) at calc(var(--beam-x-${r}) * 100%) 100%,
      white 0%, rgba(255, 255, 255, 0.5) 45%, transparent 100%
    ),
    linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),
    linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);
  -webkit-mask-composite: source-in, source-over;
  mask-image:
    radial-gradient(
      ellipse calc(78px * var(--beam-w-${r})) calc(60px * var(--beam-h-${r})) at calc(var(--beam-x-${r}) * 100%) 100%,
      white 0%, rgba(255, 255, 255, 0.5) 45%, transparent 100%
    ),
    linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),
    linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);
  mask-composite: intersect, add;
  pointer-events: none;
  z-index: 1;
  opacity: calc(var(--beam-opacity-${r}) * var(--beam-edge-${r}) * ${s.toFixed(2)} * var(--beam-strength, 1));
  clip-path: inset(0 round ${a}px);
  ${k}
}

[data-beam="${r}"] [data-beam-bloom] {
  display: none;
  position: absolute;
  inset: 0;
  border-radius: ${$}px;
  clip-path: inset(0 round ${a}px);
  padding: 0;
  -webkit-mask: radial-gradient(
    ellipse calc(84px * var(--beam-w-${r})) calc(110px * var(--beam-h-${r})) at calc(var(--beam-x-${r}) * 100%) 100%,
    white 0%, rgba(255, 255, 255, 0.5) 35%, transparent 100%
  );
  -webkit-mask-composite: source-over;
  mask: radial-gradient(
    ellipse calc(84px * var(--beam-w-${r})) calc(110px * var(--beam-h-${r})) at calc(var(--beam-x-${r}) * 100%) 100%,
    white 0%, rgba(255, 255, 255, 0.5) 35%, transparent 100%
  );
  mask-composite: add;
  background: ${X};
  ${Y}
  pointer-events: none;
  z-index: 3;
  opacity: 0;
}

[data-beam="${r}"][data-active] [data-beam-bloom],
[data-beam="${r}"][data-fading] [data-beam-bloom] {
  display: block;
  opacity: calc(var(--beam-opacity-${r}) * var(--beam-edge-${r}) * ${n.toFixed(2)} * var(--beam-strength, 1));
  ${j}
}

@keyframes beam-travel-${r} {
  0%   { --beam-x-${r}: 0.06;  --beam-w-${r}: 0.5; }
  10%  { --beam-x-${r}: 0.15;  --beam-w-${r}: 0.8; }
  20%  { --beam-x-${r}: 0.25;  --beam-w-${r}: 1.1; }
  30%  { --beam-x-${r}: 0.35;  --beam-w-${r}: 1.3; }
  40%  { --beam-x-${r}: 0.44;  --beam-w-${r}: 1.45; }
  50%  { --beam-x-${r}: 0.5;   --beam-w-${r}: 1.5; }
  60%  { --beam-x-${r}: 0.56;  --beam-w-${r}: 1.45; }
  70%  { --beam-x-${r}: 0.65;  --beam-w-${r}: 1.3; }
  80%  { --beam-x-${r}: 0.75;  --beam-w-${r}: 1.1; }
  90%  { --beam-x-${r}: 0.85;  --beam-w-${r}: 0.8; }
  100% { --beam-x-${r}: 0.94;  --beam-w-${r}: 0.5; }
}

@keyframes beam-edge-fade-${r} {
  0%    { --beam-edge-${r}: 0; }
  12.5% { --beam-edge-${r}: 0; }
  32.5% { --beam-edge-${r}: 1; }
  67.5% { --beam-edge-${r}: 1; }
  87.5% { --beam-edge-${r}: 0; }
  100%  { --beam-edge-${r}: 0; }
}

@keyframes beam-breathe-${r} {
  0%, 100% { --beam-h-${r}: 0.8; }
  25%      { --beam-h-${r}: 1.25; }
  55%      { --beam-h-${r}: 0.85; }
  80%      { --beam-h-${r}: 1.3; }
}

@keyframes beam-spike-${r} {
  0%   { --beam-spike-${r}: 0.8; }
  25%  { --beam-spike-${r}: 1.3; }
  50%  { --beam-spike-${r}: 0.9; }
  75%  { --beam-spike-${r}: 1.4; }
  100% { --beam-spike-${r}: 0.8; }
}

@keyframes beam-spike2-${r} {
  0%   { --beam-spike2-${r}: 1.2; }
  25%  { --beam-spike2-${r}: 0.7; }
  50%  { --beam-spike2-${r}: 1.4; }
  75%  { --beam-spike2-${r}: 0.8; }
  100% { --beam-spike2-${r}: 1.2; }
}

@keyframes beam-fade-in-${r} {
  to { --beam-opacity-${r}: 1; }
}

@keyframes beam-fade-out-${r} {
  from { --beam-opacity-${r}: 1; }
  to { --beam-opacity-${r}: 0; }
}
${W}
${z(r)}
`}(e):"sm"===r?function(e){let{id:r,borderRadius:a,borderWidth:t,duration:o,strokeOpacity:i,innerOpacity:s,bloomOpacity:n,innerShadow:l,colorVariant:p,staticColors:d,brightness:b,saturation:m,hueRange:g,theme:f}=e,x=Math.max(0,a-t),u="mono"===p?.5:1,h=d?"":`animation: beam-hue-shift-${r} 12s ease-in-out infinite;`,v=d?"":`
@keyframes beam-hue-shift-${r} {
  0% { filter: hue-rotate(-${g}deg) brightness(${b.toFixed(2)}) saturate(${m.toFixed(2)}); }
  50% { filter: hue-rotate(${g}deg) brightness(${b.toFixed(2)}) saturate(${m.toFixed(2)}); }
  100% { filter: hue-rotate(-${g}deg) brightness(${b.toFixed(2)}) saturate(${m.toFixed(2)}); }
}`,y="dark"===f,$=y?`conic-gradient(
        from var(--beam-angle-${r}),
        transparent 0%, transparent 54%,
        rgba(255, 255, 255, 0.1) 57%,
        rgba(255, 255, 255, 0.3) 60%,
        rgba(255, 255, 255, 0.6) 63%,
        rgba(255, 255, 255, 0.75) 66%,
        rgba(255, 255, 255, 0.6) 69%,
        rgba(255, 255, 255, 0.3) 72%,
        rgba(255, 255, 255, 0.1) 75%,
        transparent 78%, transparent 100%
      )`:`conic-gradient(
        from var(--beam-angle-${r}),
        transparent 0%, transparent 54%,
        rgba(0, 0, 0, 0.08) 57%,
        rgba(0, 0, 0, 0.2) 60%,
        rgba(0, 0, 0, 0.4) 63%,
        rgba(0, 0, 0, 0.55) 66%,
        rgba(0, 0, 0, 0.4) 69%,
        rgba(0, 0, 0, 0.2) 72%,
        rgba(0, 0, 0, 0.08) 75%,
        transparent 78%, transparent 100%
      )`,w=c[p].border.map(e=>`radial-gradient(ellipse ${e.size} at ${e.pos}, ${e.color}, transparent)`).join(`,
    `),k=c[p].inner.map(e=>`radial-gradient(ellipse ${e.size} at ${e.pos}, ${e.color}, transparent)`).join(`,
    `),j=y?`conic-gradient(
        from var(--beam-angle-${r}),
        transparent 0%, transparent 58%,
        rgba(255, 255, 255, 0.03) 62%,
        rgba(255, 255, 255, 0.08) 65%,
        rgba(255, 255, 255, 0.2) 67%,
        rgba(255, 255, 255, 0.45) 69%,
        rgba(255, 255, 255, 0.85) 70%,
        rgba(255, 255, 255, 0.85) 70.5%,
        rgba(255, 255, 255, 0.45) 71.5%,
        rgba(255, 255, 255, 0.2) 73%,
        rgba(255, 255, 255, 0.08) 75%,
        rgba(255, 255, 255, 0.03) 78%,
        transparent 82%
      )`:`conic-gradient(
        from var(--beam-angle-${r}),
        transparent 0%, transparent 58%,
        rgba(0, 0, 0, 0.02) 62%,
        rgba(0, 0, 0, 0.08) 65%,
        rgba(0, 0, 0, 0.2) 67%,
        rgba(0, 0, 0, 0.4) 69%,
        rgba(0, 0, 0, 0.6) 70%,
        rgba(0, 0, 0, 0.6) 70.5%,
        rgba(0, 0, 0, 0.4) 71.5%,
        rgba(0, 0, 0, 0.2) 73%,
        rgba(0, 0, 0, 0.08) 75%,
        rgba(0, 0, 0, 0.02) 78%,
        transparent 82%
      )`,W=`conic-gradient(
    from var(--beam-angle-${r}),
    transparent 0%, transparent 22%,
    rgba(255, 255, 255, 0.12) 28%, rgba(255, 255, 255, 0.4) 36%,
    white 46%, white 82%,
    rgba(255, 255, 255, 0.4) 88%, rgba(255, 255, 255, 0.12) 94%,
    transparent 97%, transparent 100%
  )`;return`
@property --beam-angle-${r} {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: true;
}

@property --beam-opacity-${r} {
  syntax: "<number>";
  initial-value: 0;
  inherits: true;
}

[data-beam="${r}"] {
  position: relative;
  border-radius: ${a}px;
  overflow: hidden;
}

[data-beam="${r}"][data-active] {
  animation:
    beam-spin-${r} ${o}s linear infinite,
    beam-fade-in-${r} 0.6s ease forwards;
}

[data-beam="${r}"][data-fading] {
  animation:
    beam-spin-${r} ${o}s linear infinite,
    beam-fade-out-${r} 0.5s ease forwards;
}

[data-beam="${r}"][data-active]::after,
[data-beam="${r}"][data-fading]::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${x}px;
  padding: ${t}px;
  clip-path: inset(0 round ${a}px);
  background: ${$},${w};
  -webkit-mask:
    conic-gradient(
      from var(--beam-angle-${r}),
      transparent 0%, transparent 30%,
      rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
      white 52%, white 80%,
      rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
      transparent 95%, transparent 100%
    ),
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: source-in, xor;
  mask:
    conic-gradient(
      from var(--beam-angle-${r}),
      transparent 0%, transparent 30%,
      rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
      white 52%, white 80%,
      rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
      transparent 95%, transparent 100%
    ),
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: intersect, exclude;
  pointer-events: none;
  z-index: 2;
  opacity: calc(var(--beam-opacity-${r}) * ${(i*u).toFixed(2)} * var(--beam-strength, 1));
  ${h}
}

[data-beam="${r}"][data-active]::before,
[data-beam="${r}"][data-fading]::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${a}px;
  clip-path: inset(0 round ${a}px);
  background: ${k};
  box-shadow: inset 0 0 5px 1px ${l};
  -webkit-mask-image: ${W};
  -webkit-mask-composite: source-over;
  mask-image: ${W};
  mask-composite: add;
  pointer-events: none;
  z-index: 1;
  opacity: calc(var(--beam-opacity-${r}) * ${(s*u).toFixed(2)} * var(--beam-strength, 1));
  ${h}
}

[data-beam="${r}"] [data-beam-bloom] {
  display: none;
  position: absolute;
  inset: 0;
  border-radius: ${x}px;
  clip-path: inset(0 round ${a}px);
  background: ${j};
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  padding: ${t}px;
  filter: blur(8px) brightness(${b.toFixed(2)}) saturate(${m.toFixed(2)});
  pointer-events: none;
  z-index: 3;
  opacity: 0;
}

[data-beam="${r}"][data-active] [data-beam-bloom],
[data-beam="${r}"][data-fading] [data-beam-bloom] {
  display: block;
  opacity: calc(var(--beam-opacity-${r}) * ${(n*u).toFixed(2)} * var(--beam-strength, 1));
}

@keyframes beam-spin-${r} {
  to { --beam-angle-${r}: 360deg; }
}

@keyframes beam-fade-in-${r} {
  to { --beam-opacity-${r}: 1; }
}

@keyframes beam-fade-out-${r} {
  from { --beam-opacity-${r}: 1; }
  to { --beam-opacity-${r}: 0; }
}
${v}
${z(r)}
`}(e):"pulse-inner"===r?function(e){var r;let a,t,o,{id:i,borderRadius:s,borderWidth:n,duration:l,strokeOpacity:c,innerOpacity:d,bloomOpacity:b,colorVariant:m,staticColors:g,brightness:f,saturation:v,hueRange:y,theme:w}=e,H="mono"===m?.5:1,F=(c*H).toFixed(2),X=(d*H).toFixed(2),Y=(b*H).toFixed(2),{op:N}=W("pulse-inner",w,l),C=f.toFixed(2),O=v.toFixed(2),T=g?`filter: brightness(${C}) saturate(${O});`:`filter: hue-rotate(var(--beam-hue-${i})) brightness(${C}) saturate(${O});`,R=`filter: blur(8px) brightness(${C}) saturate(${O});`,E=p[m].border.map((e,r)=>{let{region:a,quad:t}=x[r],[o,s]=e.pos.split(" "),[n,l]=e.size.split(" ").map(parseFloat);return $(e.color,n,l,a,t,o,s,i)}).join(`,
    `),I=(r="dark"===w,a=p[m].border.map((e,r)=>{let{region:a,quad:t}=x[r],[o,s]=e.pos.split(" "),[n,l]=u[r];return $(e.color,n,l,a,t,o,s,i)}),t=r?"255, 255, 255":"0, 0, 0",o=r?.18:.08,[...a,...[["0%","0%","tl"],["100%","0%","tr"],["0%","100%","bl"],["100%","100%","br"]].map(([e,r,a])=>`radial-gradient(ellipse 60px 60px at ${e} ${r}, rgba(${t}, calc(${o} * var(--bop-${a}-${i}))), transparent 70%)`)].join(`,
    `)),M=k(h,m,1-.5*N);return`
${j(i)}

[data-beam="${i}"] {
  position: relative;
  border-radius: ${s}px;
  overflow: hidden;
  isolation: isolate;
}

[data-beam="${i}"][data-active] {
${S(i,"beam-fade-in",.6)}
}

[data-beam="${i}"][data-fading] {
${S(i,"beam-fade-out",.5)}
}

[data-beam="${i}"][data-active]::after,
[data-beam="${i}"][data-fading]::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${s}px;
  padding: ${n}px;
  clip-path: inset(0 round ${s}px);
  background: ${E};
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
  z-index: 2;
  will-change: opacity, filter;
  opacity: calc(var(--beam-opacity-${i}) * ${F} * var(--beam-strength, 1));
  ${T}
}

[data-beam="${i}"][data-active]::before,
[data-beam="${i}"][data-fading]::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${s}px;
  clip-path: inset(0 round ${s}px);
  background: ${I};
  -webkit-mask-image:
    linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),
    linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);
  -webkit-mask-composite: source-over;
  mask-image:
    linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),
    linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);
  mask-composite: add;
  pointer-events: none;
  z-index: 1;
  will-change: opacity, filter;
  opacity: calc(var(--beam-opacity-${i}) * ${X} * var(--beam-strength, 1));
  ${T}
}

[data-beam="${i}"] [data-beam-bloom] {
  display: none;
  position: absolute;
  inset: 0;
  border-radius: ${s}px;
  clip-path: inset(0 round ${s}px);
  background: ${M};
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  padding: ${n}px;
  pointer-events: none;
  z-index: 3;
  will-change: opacity;
  opacity: 0;
}

[data-beam="${i}"][data-active] [data-beam-bloom],
[data-beam="${i}"][data-fading] [data-beam-bloom] {
  display: block;
  opacity: calc(var(--beam-opacity-${i}) * ${Y} * var(--beam-strength, 1));
  ${R}
}

@keyframes beam-fade-in-${i} { to { --beam-opacity-${i}: 1; } }
@keyframes beam-fade-out-${i} { from { --beam-opacity-${i}: 1; } to { --beam-opacity-${i}: 0; } }
${z(i)}

@media (prefers-reduced-motion: reduce) {
  [data-beam="${i}"][data-active],
  [data-beam="${i}"][data-fading],
  [data-beam="${i}"][data-active]::after,
  [data-beam="${i}"][data-fading]::after,
  [data-beam="${i}"][data-active]::before,
  [data-beam="${i}"][data-fading]::before,
  [data-beam="${i}"][data-active] [data-beam-bloom],
  [data-beam="${i}"][data-fading] [data-beam-bloom] {
    animation: none !important;
  }
}
`}(e):"pulse-outside"===r?function(e){let{id:r,borderRadius:a,duration:t,strokeOpacity:o,innerOpacity:i,bloomOpacity:s,colorVariant:n,staticColors:l,brightness:p,saturation:c,hueRange:d,theme:b,hairlineOpacity:m=0}=e,g="dark"===b,f="mono"===n?.5:1,x=(o*f).toFixed(2),u=(i*f).toFixed(2),h=(s*f).toFixed(2),$=g?"70, 70, 70":"0, 0, 0",H=m.toFixed(2),F=`linear-gradient(rgba(${$}, ${H}), rgba(${$}, ${H}))`,{op:X}=W("pulse-outside",b,t),Y=g?3:6,N=p.toFixed(2),C=c.toFixed(2),O=l?`filter: brightness(${N}) saturate(${C});`:`filter: hue-rotate(var(--beam-hue-${r})) brightness(${N}) saturate(${C});`,T=l?`filter: blur(${Y}px) brightness(${N}) saturate(${C});`:`filter: blur(${Y}px) hue-rotate(var(--beam-hue-${r})) brightness(${N}) saturate(${C});`,R=`filter: blur(${g?22.5:15}px) brightness(${N}) saturate(${C});`,E=w(v,n,r),I=w(v,n,r),M=k(y,n,1-.5*X),A=m>0?`${E},
    ${F}`:E;return`
${j(r)}

[data-beam="${r}"] {
  position: relative;
  border-radius: ${a}px;
  overflow: visible;
  isolation: isolate;
}

[data-beam="${r}"][data-active] {
${S(r,"beam-fade-in",.6)}
}

[data-beam="${r}"][data-fading] {
${S(r,"beam-fade-out",.5)}
}
${m>0?`
/* Idle hairline — painted above the (opaque) child in the inner 1px edge ring so
   it overlaps a standard inset component border exactly. */
[data-beam="${r}"]::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${a}px;
  padding: 1px;
  clip-path: inset(0 round ${a}px);
  background: ${F};
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
  z-index: 2;
}
`:""}
[data-beam="${r}"][data-active]::after,
[data-beam="${r}"][data-fading]::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${a}px;
  padding: 1px;
  clip-path: inset(0 round ${a}px);
  background: ${A};
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
  z-index: 2;
  will-change: opacity, filter;
  opacity: calc(var(--beam-opacity-${r}) * ${x} * var(--beam-strength, 1));
  ${O}
}

[data-beam="${r}"][data-active]::before,
[data-beam="${r}"][data-fading]::before {
  content: "";
  position: absolute;
  inset: -10px;
  z-index: -1;
  border-radius: ${a+10}px;
  background: ${I};
  transform: scale(0.95, 0.9);
  pointer-events: none;
  will-change: opacity, filter;
  opacity: calc(var(--beam-opacity-${r}) * ${u} * var(--beam-strength, 1));
  ${T}
}

[data-beam="${r}"] [data-beam-bloom] {
  display: none;
  position: absolute;
  inset: -30px;
  z-index: -1;
  border-radius: ${a+30}px;
  background: ${M};
  transform: scale(0.95, 0.9);
  pointer-events: none;
  will-change: transform;
  opacity: 0;
}

[data-beam="${r}"][data-active] [data-beam-bloom],
[data-beam="${r}"][data-fading] [data-beam-bloom] {
  display: block;
  opacity: calc(var(--beam-opacity-${r}) * ${h} * var(--beam-strength, 1));
  ${R}
}

@keyframes beam-fade-in-${r} { to { --beam-opacity-${r}: 1; } }
@keyframes beam-fade-out-${r} { from { --beam-opacity-${r}: 1; } to { --beam-opacity-${r}: 0; } }
${z(r)}

@media (prefers-reduced-motion: reduce) {
  [data-beam="${r}"][data-active],
  [data-beam="${r}"][data-fading],
  [data-beam="${r}"][data-active]::after,
  [data-beam="${r}"][data-fading]::after,
  [data-beam="${r}"][data-active]::before,
  [data-beam="${r}"][data-fading]::before,
  [data-beam="${r}"][data-active] [data-beam-bloom],
  [data-beam="${r}"][data-fading] [data-beam-bloom] {
    animation: none !important;
  }
}
`}(e):function(e){let r,a,{id:t,borderRadius:o,borderWidth:i,duration:s,strokeOpacity:n,innerOpacity:l,bloomOpacity:c,innerShadow:d,colorVariant:b,staticColors:m,brightness:g,saturation:f,hueRange:x,theme:u}=e,h=Math.max(0,o-i),v="mono"===b?.5:1,y=m?"":`animation: beam-hue-shift-${t} 12s ease-in-out infinite;`,$=m?"":`
@keyframes beam-hue-shift-${t} {
  0% { filter: hue-rotate(-${x}deg) brightness(${g.toFixed(2)}) saturate(${f.toFixed(2)}); }
  50% { filter: hue-rotate(${x}deg) brightness(${g.toFixed(2)}) saturate(${f.toFixed(2)}); }
  100% { filter: hue-rotate(-${x}deg) brightness(${g.toFixed(2)}) saturate(${f.toFixed(2)}); }
}`,w="dark"===u,k=w?`conic-gradient(
        from var(--beam-angle-${t}),
        transparent 0%, transparent 54%,
        rgba(255, 255, 255, 0.1) 57%,
        rgba(255, 255, 255, 0.3) 60%,
        rgba(255, 255, 255, 0.6) 63%,
        rgba(255, 255, 255, 0.75) 66%,
        rgba(255, 255, 255, 0.6) 69%,
        rgba(255, 255, 255, 0.3) 72%,
        rgba(255, 255, 255, 0.1) 75%,
        transparent 78%, transparent 100%
      )`:`conic-gradient(
        from var(--beam-angle-${t}),
        transparent 0%, transparent 54%,
        rgba(0, 0, 0, 0.08) 57%,
        rgba(0, 0, 0, 0.2) 60%,
        rgba(0, 0, 0, 0.4) 63%,
        rgba(0, 0, 0, 0.55) 66%,
        rgba(0, 0, 0, 0.4) 69%,
        rgba(0, 0, 0, 0.2) 72%,
        rgba(0, 0, 0, 0.08) 75%,
        transparent 78%, transparent 100%
      )`,j=p[b].border.map(e=>`radial-gradient(ellipse ${e.size} at ${e.pos}, ${e.color}, transparent)`).join(`,
    `),W=(r=p[b],a="mono"===b?.225:.45,r.border.map(e=>{let r=e.color.replace("rgb(","rgba(").replace(")",`, ${a})`);return`radial-gradient(ellipse ${e.size.split(" ").map(e=>{let r=parseInt(e);return`${Math.round(.9*r)}px`}).join(" ")} at ${e.pos}, ${r}, transparent)`}).join(`,
    `)),S=w?`conic-gradient(
        from var(--beam-angle-${t}),
        transparent 0%, transparent 58%,
        rgba(255, 255, 255, 0.03) 62%,
        rgba(255, 255, 255, 0.08) 65%,
        rgba(255, 255, 255, 0.2) 67%,
        rgba(255, 255, 255, 0.45) 69%,
        rgba(255, 255, 255, 0.85) 70%,
        rgba(255, 255, 255, 0.85) 70.5%,
        rgba(255, 255, 255, 0.45) 71.5%,
        rgba(255, 255, 255, 0.2) 73%,
        rgba(255, 255, 255, 0.08) 75%,
        rgba(255, 255, 255, 0.03) 78%,
        transparent 82%
      )`:`conic-gradient(
        from var(--beam-angle-${t}),
        transparent 0%, transparent 58%,
        rgba(0, 0, 0, 0.02) 62%,
        rgba(0, 0, 0, 0.08) 65%,
        rgba(0, 0, 0, 0.2) 67%,
        rgba(0, 0, 0, 0.4) 69%,
        rgba(0, 0, 0, 0.6) 70%,
        rgba(0, 0, 0, 0.6) 70.5%,
        rgba(0, 0, 0, 0.4) 71.5%,
        rgba(0, 0, 0, 0.2) 73%,
        rgba(0, 0, 0, 0.08) 75%,
        rgba(0, 0, 0, 0.02) 78%,
        transparent 82%
      )`;return`
@property --beam-angle-${t} {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: true;
}

@property --beam-opacity-${t} {
  syntax: "<number>";
  initial-value: 0;
  inherits: true;
}

[data-beam="${t}"] {
  position: relative;
  border-radius: ${o}px;
  overflow: hidden;
}

[data-beam="${t}"][data-active] {
  animation:
    beam-spin-${t} ${s}s linear infinite,
    beam-fade-in-${t} 0.6s ease forwards;
}

[data-beam="${t}"][data-fading] {
  animation:
    beam-spin-${t} ${s}s linear infinite,
    beam-fade-out-${t} 0.5s ease forwards;
}

[data-beam="${t}"][data-active]::after,
[data-beam="${t}"][data-fading]::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${h}px;
  padding: ${i}px;
  clip-path: inset(0 round ${o}px);
  background: ${k},${j};
  -webkit-mask:
    conic-gradient(
      from var(--beam-angle-${t}),
      transparent 0%, transparent 30%,
      rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
      white 52%, white 80%,
      rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
      transparent 95%, transparent 100%
    ),
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: source-in, xor;
  mask:
    conic-gradient(
      from var(--beam-angle-${t}),
      transparent 0%, transparent 30%,
      rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
      white 52%, white 80%,
      rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
      transparent 95%, transparent 100%
    ),
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: intersect, exclude;
  pointer-events: none;
  z-index: 2;
  opacity: calc(var(--beam-opacity-${t}) * ${(n*v).toFixed(2)} * var(--beam-strength, 1));
  ${y}
}

[data-beam="${t}"][data-active]::before,
[data-beam="${t}"][data-fading]::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${o}px;
  background: ${W};
  box-shadow: inset 0 0 9px 1px ${d};
  -webkit-mask-image:
    conic-gradient(
      from var(--beam-angle-${t}),
      transparent 0%, transparent 30%,
      rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
      white 52%, white 80%,
      rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
      transparent 95%, transparent 100%
    ),
    linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),
    linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);
  -webkit-mask-composite: source-in, source-over;
  mask-image:
    conic-gradient(
      from var(--beam-angle-${t}),
      transparent 0%, transparent 30%,
      rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
      white 52%, white 80%,
      rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
      transparent 95%, transparent 100%
    ),
    linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),
    linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);
  mask-composite: intersect, add;
  pointer-events: none;
  z-index: 1;
  opacity: calc(var(--beam-opacity-${t}) * ${(l*v).toFixed(2)} * var(--beam-strength, 1));
  clip-path: inset(0 round ${o}px);
  ${y}
}

[data-beam="${t}"] [data-beam-bloom] {
  display: none;
  position: absolute;
  inset: 0;
  border-radius: ${h}px;
  clip-path: inset(0 round ${o}px);
  background: ${S};
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  padding: ${i}px;
  filter: blur(8px) brightness(${g.toFixed(2)}) saturate(${f.toFixed(2)});
  pointer-events: none;
  z-index: 3;
  opacity: 0;
}

[data-beam="${t}"][data-active] [data-beam-bloom],
[data-beam="${t}"][data-fading] [data-beam-bloom] {
  display: block;
  opacity: calc(var(--beam-opacity-${t}) * ${(c*v).toFixed(2)} * var(--beam-strength, 1));
}

@keyframes beam-spin-${t} {
  to { --beam-angle-${t}: 360deg; }
}

@keyframes beam-fade-in-${t} {
  to { --beam-opacity-${t}: 1; }
}

@keyframes beam-fade-out-${t} {
  from { --beam-opacity-${t}: 1; }
  to { --beam-opacity-${t}: 0; }
}
${$}
${z(t)}
`}(e)})({id:L,borderRadius:ec,borderWidth:el.borderWidth,duration:ed,strokeOpacity:en.strokeOpacity,innerOpacity:en.innerOpacity,bloomOpacity:en.bloomOpacity,innerShadow:en.innerShadow,size:r,colorVariant:a,staticColors:ef,brightness:em,saturation:eb,hueRange:eg,theme:es,hairlineOpacity:en.hairlineOpacity}),[L,ec,el.borderWidth,ed,en.strokeOpacity,en.innerOpacity,en.bloomOpacity,en.innerShadow,en.hairlineOpacity,r,a,ef,em,eb,eg,es]),eu=(0,s.useMemo)(()=>ep?function(e,r,a,t,o,i){if("pulse-inner"!==e&&"pulse-outside"!==e)return null;let s=W(e,r,a);return{oscillators:function(e,r){let{sp:a,dr:t,op:o,gh:i,bs:s,ss:n,ghs:l}=r;return[{prop:`--bw1-${e}`,a:1-a,b:1+1.1*a,period:.9*n,delay:0,unit:""},{prop:`--bh1-${e}`,a:1+.9*a,b:1-.85*a,period:1.26*n,delay:0,unit:""},{prop:`--bx1-${e}`,a:-t,b:.9*t,period:1.6*s,delay:0,unit:"px"},{prop:`--by1-${e}`,a:.55*t,b:-(.7*t),period:1.6*s,delay:0,unit:"px"},{prop:`--bw2-${e}`,a:1+a,b:1-.85*a,period:1.1*n,delay:0,unit:""},{prop:`--bh2-${e}`,a:1-.8*a,b:1+1.05*a,period:.81*n,delay:0,unit:""},{prop:`--bx2-${e}`,a:.8*t,b:-(.9*t),period:1.88*s,delay:0,unit:"px"},{prop:`--by2-${e}`,a:-t,b:.65*t,period:1.88*s,delay:0,unit:"px"},{prop:`--bw3-${e}`,a:1-.6*a,b:1+1.15*a,period:.98*n,delay:0,unit:""},{prop:`--bh3-${e}`,a:1+.75*a,b:1-a,period:1.4*n,delay:0,unit:""},{prop:`--bx3-${e}`,a:-(.6*t),b:t,period:1.45*s,delay:0,unit:"px"},{prop:`--by3-${e}`,a:-(.85*t),b:.45*t,period:1.45*s,delay:0,unit:"px"},{prop:`--bgh-${e}`,a:1-i,b:1+i,period:l,delay:0,unit:""},{prop:`--bop-tl-${e}`,a:1-o,b:1,period:s,delay:0,unit:""},{prop:`--bop-tr-${e}`,a:1-o,b:1,period:1.32*s,delay:.28*s,unit:""},{prop:`--bop-bl-${e}`,a:1-o,b:1,period:.84*s,delay:.55*s,unit:""},{prop:`--bop-br-${e}`,a:1-o,b:1,period:1.58*s,delay:.83*s,unit:""}]}(i,s),hue:o?null:{prop:`--beam-hue-${i}`,range:t,period:s.huePeriod}}}(r,es,ed,eg,ef,L):null,[ep,r,es,ed,eg,ef,L]);(0,s.useEffect)(()=>{var e;if(!eu||!(U||J)||!Z)return;let r=V.current;if(r&&!("u">typeof window&&null!=(e=window.matchMedia)&&e.call(window,"(prefers-reduced-motion: reduce)").matches)){let e;return e={el:r,config:eu},H.add(e),null==F&&(X=0,F=requestAnimationFrame(O)),()=>{H.delete(e),0===H.size&&null!=F&&(cancelAnimationFrame(F),F=null)}}},[eu,U,J,Z]);let eh=(0,s.useCallback)(e=>{V.current=e,"function"==typeof G?G(e):G&&(G.current=e)},[G]),ev={...A??{},"--beam-strength":Math.max(0,Math.min(1,I)),..."pulse-outside"===r?{"--pulse-glow-sx":et.x,"--pulse-glow-sy":et.y}:{}};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("style",{children:ex}),(0,t.jsxs)("div",{...P,ref:eh,"data-beam":L,"data-active":U&&!J?"":void 0,"data-fading":J?"":void 0,"data-paused":!U||J||Z?void 0:"",className:M,style:ev,onAnimationEnd:ei,children:[e,(0,t.jsx)("div",{"data-beam-bloom":!0})]})]})});function R(){for(var e,r,a=0,t="",o=arguments.length;a<o;a++)(e=arguments[a])&&(r=function e(r){var a,t,o="";if("string"==typeof r||"number"==typeof r)o+=r;else if("object"==typeof r)if(Array.isArray(r)){var i=r.length;for(a=0;a<i;a++)r[a]&&(t=e(r[a]))&&(o&&(o+=" "),o+=t)}else for(t in r)r[t]&&(o&&(o+=" "),o+=t);return o}(e))&&(t&&(t+=" "),t+=r);return t}let E=(e=new Map,r=null,a)=>({nextPart:e,validators:r,classGroupId:a}),I=[],M=(e,r,a)=>{if(0==e.length-r)return a.classGroupId;let t=e[r],o=a.nextPart.get(t);if(o){let a=M(e,r+1,o);if(a)return a}let i=a.validators;if(null===i)return;let s=0===r?e.join("-"):e.slice(r).join("-"),n=i.length;for(let e=0;e<n;e++){let r=i[e];if(r.validator(s))return r.classGroupId}},A=(e,r)=>{let a=E();for(let t in e)q(e[t],a,t,r);return a},q=(e,r,a,t)=>{let o=e.length;for(let i=0;i<o;i++)B(e[i],r,a,t)},B=(e,r,a,t)=>{"string"==typeof e?D(e,r,a):"function"==typeof e?P(e,r,a,t):G(e,r,a,t)},D=(e,r,a)=>{(""===e?r:L(r,e)).classGroupId=a},P=(e,r,a,t)=>{_(e)?q(e(t),r,a,t):(null===r.validators&&(r.validators=[]),r.validators.push({classGroupId:a,validator:e}))},G=(e,r,a,t)=>{let o=Object.entries(e),i=o.length;for(let e=0;e<i;e++){let[i,s]=o[e];q(s,L(r,i),a,t)}},L=(e,r)=>{let a=e,t=r.split("-"),o=t.length;for(let e=0;e<o;e++){let r=t[e],o=a.nextPart.get(r);o||(o=E(),a.nextPart.set(r,o)),a=o}return a},_=e=>"isThemeGetter"in e&&!0===e.isThemeGetter,V=[],U=(e,r,a,t,o)=>({modifiers:e,hasImportantModifier:r,baseClassName:a,maybePostfixModifierPosition:t,isExternal:o}),K=/\s+/,J=e=>{let r;if("string"==typeof e)return e;let a="";for(let t=0;t<e.length;t++)e[t]&&(r=J(e[t]))&&(a&&(a+=" "),a+=r);return a},Q=[],Z=e=>{let r=r=>r[e]||Q;return r.isThemeGetter=!0,r},ee=/^\[(?:(\w[\w-]*):)?(.+)\]$/i,er=/^\((?:(\w[\w-]*):)?(.+)\)$/i,ea=/^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,et=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,eo=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,ei=/^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,es=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,en=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,el=e=>ea.test(e),ep=e=>!!e&&!Number.isNaN(Number(e)),ec=e=>!!e&&Number.isInteger(Number(e)),ed=e=>e.endsWith("%")&&ep(e.slice(0,-1)),eb=e=>et.test(e),em=()=>!0,eg=e=>eo.test(e)&&!ei.test(e),ef=()=>!1,ex=e=>es.test(e),eu=e=>en.test(e),eh=e=>!e$(e)&&!eF(e),ev=e=>e.startsWith("@container")&&("/"===e[10]&&void 0!==e[11]||"s"===e[11]&&void 0!==e[16]&&e.startsWith("-size/",10)||"n"===e[11]&&void 0!==e[18]&&e.startsWith("-normal/",10)),ey=e=>eE(e,eq,ef),e$=e=>ee.test(e),ew=e=>eE(e,eB,eg),ek=e=>eE(e,eD,ep),ez=e=>eE(e,eG,em),ej=e=>eE(e,eP,ef),eW=e=>eE(e,eM,ef),eS=e=>eE(e,eA,eu),eH=e=>eE(e,eL,ex),eF=e=>er.test(e),eX=e=>eI(e,eB),eY=e=>eI(e,eP),eN=e=>eI(e,eM),eC=e=>eI(e,eq),eO=e=>eI(e,eA),eT=e=>eI(e,eL,!0),eR=e=>eI(e,eG,!0),eE=(e,r,a)=>{let t=ee.exec(e);return!!t&&(t[1]?r(t[1]):a(t[2]))},eI=(e,r,a=!1)=>{let t=er.exec(e);return!!t&&(t[1]?r(t[1]):a)},eM=e=>"position"===e||"percentage"===e,eA=e=>"image"===e||"url"===e,eq=e=>"length"===e||"size"===e||"bg-size"===e,eB=e=>"length"===e,eD=e=>"number"===e,eP=e=>"family-name"===e,eG=e=>"number"===e||"weight"===e,eL=e=>"shadow"===e,e_=((e,...r)=>{let a,t,o,i,s=e=>{let r=t(e);if(r)return r;let i=((e,r)=>{let{parseClassName:a,getClassGroupId:t,getConflictingClassGroupIds:o,sortModifiers:i,postfixLookupClassGroupIds:s}=r,n=[],l=e.trim().split(K),p="";for(let e=l.length-1;e>=0;e-=1){let r,c=l[e],{isExternal:d,modifiers:b,hasImportantModifier:m,baseClassName:g,maybePostfixModifierPosition:f}=a(c);if(d){p=c+(p.length>0?" "+p:p);continue}let x=!!f;if(x){let e=(r=t(g.substring(0,f)))&&s[r]?t(g):void 0;e&&e!==r&&(r=e,x=!1)}else r=t(g);if(!r){if(!x||!(r=t(g))){p=c+(p.length>0?" "+p:p);continue}x=!1}let u=0===b.length?"":1===b.length?b[0]:i(b).join(":"),h=m?u+"!":u,v=h+r;if(n.indexOf(v)>-1)continue;n.push(v);let y=o(r,x);for(let e=0;e<y.length;++e){let r=y[e];n.push(h+r)}p=c+(p.length>0?" "+p:p)}return p})(e,a);return o(e,i),i};return i=n=>{var l;let p;return t=(a={cache:(e=>{if(e<1)return{get:()=>void 0,set:()=>{}};let r=0,a=Object.create(null),t=Object.create(null),o=(o,i)=>{a[o]=i,++r>e&&(r=0,t=a,a=Object.create(null))};return{get(e){let r=a[e];return void 0!==r?r:void 0!==(r=t[e])?(o(e,r),r):void 0},set(e,r){e in a?a[e]=r:o(e,r)}}})((l=r.reduce((e,r)=>r(e),e())).cacheSize),parseClassName:(e=>{let{prefix:r,experimentalParseClassName:a}=e,t=e=>{let r,a=[],t=0,o=0,i=0,s=e.length;for(let n=0;n<s;n++){let s=e[n];if(0===t&&0===o){if(":"===s){a.push(e.slice(i,n)),i=n+1;continue}if("/"===s){r=n;continue}}"["===s?t++:"]"===s?t--:"("===s?o++:")"===s&&o--}let n=0===a.length?e:e.slice(i),l=n,p=!1;return n.endsWith("!")?(l=n.slice(0,-1),p=!0):n.startsWith("!")&&(l=n.slice(1),p=!0),U(a,p,l,r&&r>i?r-i:void 0)};if(r){let e=r+":",a=t;t=r=>r.startsWith(e)?a(r.slice(e.length)):U(V,!1,r,void 0,!0)}if(a){let e=t;t=r=>a({className:r,parseClassName:e})}return t})(l),sortModifiers:(p=new Map,l.orderSensitiveModifiers.forEach((e,r)=>{p.set(e,1e6+r)}),e=>{let r=[],a=[];for(let t=0;t<e.length;t++){let o=e[t],i="["===o[0],s=p.has(o);i||s?(a.length>0&&(a.sort(),r.push(...a),a=[]),r.push(o)):a.push(o)}return a.length>0&&(a.sort(),r.push(...a)),r}),postfixLookupClassGroupIds:(e=>{let r=Object.create(null),a=e.postfixLookupClassGroups;if(a)for(let e=0;e<a.length;e++)r[a[e]]=!0;return r})(l),...(e=>{let r=(e=>{let{theme:r,classGroups:a}=e;return A(a,r)})(e),{conflictingClassGroups:a,conflictingClassGroupModifiers:t}=e;return{getClassGroupId:e=>{if(e.startsWith("[")&&e.endsWith("]")){var a;let r,t,o;return -1===(a=e).slice(1,-1).indexOf(":")?void 0:(t=(r=a.slice(1,-1)).indexOf(":"),(o=r.slice(0,t))?"arbitrary.."+o:void 0)}let t=e.split("-"),o=+(""===t[0]&&t.length>1);return M(t,o,r)},getConflictingClassGroupIds:(e,r)=>{if(r){let r=t[e],o=a[e];if(r){if(o){let e=Array(o.length+r.length);for(let r=0;r<o.length;r++)e[r]=o[r];for(let a=0;a<r.length;a++)e[o.length+a]=r[a];return e}return r}return o||I}return a[e]||I}}})(l)}).cache.get,o=a.cache.set,i=s,s(n)},(...e)=>i(((...e)=>{let r,a,t=0,o="";for(;t<e.length;)(r=e[t++])&&(a=J(r))&&(o&&(o+=" "),o+=a);return o})(...e))})(()=>{let e=Z("color"),r=Z("font"),a=Z("text"),t=Z("font-weight"),o=Z("tracking"),i=Z("leading"),s=Z("breakpoint"),n=Z("container"),l=Z("spacing"),p=Z("radius"),c=Z("shadow"),d=Z("inset-shadow"),b=Z("text-shadow"),m=Z("drop-shadow"),g=Z("blur"),f=Z("perspective"),x=Z("aspect"),u=Z("ease"),h=Z("animate"),v=()=>["auto","avoid","all","avoid-page","page","left","right","column"],y=()=>["center","top","bottom","left","right","top-left","left-top","top-right","right-top","bottom-right","right-bottom","bottom-left","left-bottom"],$=()=>[...y(),eF,e$],w=()=>["auto","hidden","clip","visible","scroll"],k=()=>["auto","contain","none"],z=()=>[eF,e$,l],j=()=>[el,"full","auto",...z()],W=()=>[ec,"none","subgrid",eF,e$],S=()=>["auto",{span:["full",ec,eF,e$]},ec,eF,e$],H=()=>[ec,"auto",eF,e$],F=()=>["auto","min","max","fr",eF,e$],X=()=>["start","end","center","between","around","evenly","stretch","baseline","center-safe","end-safe"],Y=()=>["start","end","center","stretch","center-safe","end-safe"],N=()=>["auto",...z()],C=()=>[el,"auto","full","dvw","dvh","lvw","lvh","svw","svh","min","max","fit",...z()],O=()=>[el,"screen","full","dvw","lvw","svw","min","max","fit",...z()],T=()=>[el,"screen","full","lh","dvh","lvh","svh","min","max","fit",...z()],R=()=>[e,eF,e$],E=()=>[...y(),eN,eW,{position:[eF,e$]}],I=()=>["no-repeat",{repeat:["","x","y","space","round"]}],M=()=>["auto","cover","contain",eC,ey,{size:[eF,e$]}],A=()=>[ed,eX,ew],q=()=>["","none","full",p,eF,e$],B=()=>["",ep,eX,ew],D=()=>["solid","dashed","dotted","double"],P=()=>["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"],G=()=>[ep,ed,eN,eW],L=()=>["","none",g,eF,e$],_=()=>["none",ep,eF,e$],V=()=>["none",ep,eF,e$],U=()=>[ep,eF,e$],K=()=>[el,"full",...z()];return{cacheSize:500,theme:{animate:["spin","ping","pulse","bounce"],aspect:["video"],blur:[eb],breakpoint:[eb],color:[em],container:[eb],"drop-shadow":[eb],ease:["in","out","in-out"],font:[eh],"font-weight":["thin","extralight","light","normal","medium","semibold","bold","extrabold","black"],"inset-shadow":[eb],leading:["none","tight","snug","normal","relaxed","loose"],perspective:["dramatic","near","normal","midrange","distant","none"],radius:[eb],shadow:[eb],spacing:["px",ep],text:[eb],"text-shadow":[eb],tracking:["tighter","tight","normal","wide","wider","widest"]},classGroups:{aspect:[{aspect:["auto","square",el,e$,eF,x]}],container:["container"],"container-type":[{"@container":["","normal","size",eF,e$]}],"container-named":[ev],columns:[{columns:[ep,e$,eF,n]}],"break-after":[{"break-after":v()}],"break-before":[{"break-before":v()}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],sr:["sr-only","not-sr-only"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:$()}],overflow:[{overflow:w()}],"overflow-x":[{"overflow-x":w()}],"overflow-y":[{"overflow-y":w()}],overscroll:[{overscroll:k()}],"overscroll-x":[{"overscroll-x":k()}],"overscroll-y":[{"overscroll-y":k()}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:j()}],"inset-x":[{"inset-x":j()}],"inset-y":[{"inset-y":j()}],start:[{"inset-s":j(),start:j()}],end:[{"inset-e":j(),end:j()}],"inset-bs":[{"inset-bs":j()}],"inset-be":[{"inset-be":j()}],top:[{top:j()}],right:[{right:j()}],bottom:[{bottom:j()}],left:[{left:j()}],visibility:["visible","invisible","collapse"],z:[{z:[ec,"auto",eF,e$]}],basis:[{basis:[el,"full","auto",n,...z()]}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["nowrap","wrap","wrap-reverse"]}],flex:[{flex:[ep,el,"auto","initial","none",e$]}],grow:[{grow:["",ep,eF,e$]}],shrink:[{shrink:["",ep,eF,e$]}],order:[{order:[ec,"first","last","none",eF,e$]}],"grid-cols":[{"grid-cols":W()}],"col-start-end":[{col:S()}],"col-start":[{"col-start":H()}],"col-end":[{"col-end":H()}],"grid-rows":[{"grid-rows":W()}],"row-start-end":[{row:S()}],"row-start":[{"row-start":H()}],"row-end":[{"row-end":H()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":F()}],"auto-rows":[{"auto-rows":F()}],gap:[{gap:z()}],"gap-x":[{"gap-x":z()}],"gap-y":[{"gap-y":z()}],"justify-content":[{justify:[...X(),"normal"]}],"justify-items":[{"justify-items":[...Y(),"normal"]}],"justify-self":[{"justify-self":["auto",...Y()]}],"align-content":[{content:["normal",...X()]}],"align-items":[{items:[...Y(),{baseline:["","last"]}]}],"align-self":[{self:["auto",...Y(),{baseline:["","last"]}]}],"place-content":[{"place-content":X()}],"place-items":[{"place-items":[...Y(),"baseline"]}],"place-self":[{"place-self":["auto",...Y()]}],p:[{p:z()}],px:[{px:z()}],py:[{py:z()}],ps:[{ps:z()}],pe:[{pe:z()}],pbs:[{pbs:z()}],pbe:[{pbe:z()}],pt:[{pt:z()}],pr:[{pr:z()}],pb:[{pb:z()}],pl:[{pl:z()}],m:[{m:N()}],mx:[{mx:N()}],my:[{my:N()}],ms:[{ms:N()}],me:[{me:N()}],mbs:[{mbs:N()}],mbe:[{mbe:N()}],mt:[{mt:N()}],mr:[{mr:N()}],mb:[{mb:N()}],ml:[{ml:N()}],"space-x":[{"space-x":z()}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":z()}],"space-y-reverse":["space-y-reverse"],size:[{size:C()}],"inline-size":[{inline:["auto",...O()]}],"min-inline-size":[{"min-inline":["auto",...O()]}],"max-inline-size":[{"max-inline":["none",...O()]}],"block-size":[{block:["auto",...T()]}],"min-block-size":[{"min-block":["auto",...T()]}],"max-block-size":[{"max-block":["none",...T()]}],w:[{w:[n,"screen",...C()]}],"min-w":[{"min-w":[n,"screen","none",...C()]}],"max-w":[{"max-w":[n,"screen","none","prose",{screen:[s]},...C()]}],h:[{h:["screen","lh",...C()]}],"min-h":[{"min-h":["screen","lh","none",...C()]}],"max-h":[{"max-h":["screen","lh",...C()]}],"font-size":[{text:["base",a,eX,ew]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:[t,eR,ez]}],"font-stretch":[{"font-stretch":["ultra-condensed","extra-condensed","condensed","semi-condensed","normal","semi-expanded","expanded","extra-expanded","ultra-expanded",ed,e$]}],"font-family":[{font:[eY,ej,r]}],"font-features":[{"font-features":[e$]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractions"],tracking:[{tracking:[o,eF,e$]}],"line-clamp":[{"line-clamp":[ep,"none",eF,ek]}],leading:[{leading:[i,...z()]}],"list-image":[{"list-image":["none",eF,e$]}],"list-style-position":[{list:["inside","outside"]}],"list-style-type":[{list:["disc","decimal","none",eF,e$]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"placeholder-color":[{placeholder:R()}],"text-color":[{text:R()}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:[...D(),"wavy"]}],"text-decoration-thickness":[{decoration:[ep,"from-font","auto",eF,ew]}],"text-decoration-color":[{decoration:R()}],"underline-offset":[{"underline-offset":[ep,"auto",eF,e$]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:z()}],"tab-size":[{tab:[ec,eF,e$]}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",eF,e$]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],wrap:[{wrap:["break-word","anywhere","normal"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",eF,e$]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:E()}],"bg-repeat":[{bg:I()}],"bg-size":[{bg:M()}],"bg-image":[{bg:["none",{linear:[{to:["t","tr","r","br","b","bl","l","tl"]},ec,eF,e$],radial:["",eF,e$],conic:[ec,eF,e$]},eO,eS]}],"bg-color":[{bg:R()}],"gradient-from-pos":[{from:A()}],"gradient-via-pos":[{via:A()}],"gradient-to-pos":[{to:A()}],"gradient-from":[{from:R()}],"gradient-via":[{via:R()}],"gradient-to":[{to:R()}],rounded:[{rounded:q()}],"rounded-s":[{"rounded-s":q()}],"rounded-e":[{"rounded-e":q()}],"rounded-t":[{"rounded-t":q()}],"rounded-r":[{"rounded-r":q()}],"rounded-b":[{"rounded-b":q()}],"rounded-l":[{"rounded-l":q()}],"rounded-ss":[{"rounded-ss":q()}],"rounded-se":[{"rounded-se":q()}],"rounded-ee":[{"rounded-ee":q()}],"rounded-es":[{"rounded-es":q()}],"rounded-tl":[{"rounded-tl":q()}],"rounded-tr":[{"rounded-tr":q()}],"rounded-br":[{"rounded-br":q()}],"rounded-bl":[{"rounded-bl":q()}],"border-w":[{border:B()}],"border-w-x":[{"border-x":B()}],"border-w-y":[{"border-y":B()}],"border-w-s":[{"border-s":B()}],"border-w-e":[{"border-e":B()}],"border-w-bs":[{"border-bs":B()}],"border-w-be":[{"border-be":B()}],"border-w-t":[{"border-t":B()}],"border-w-r":[{"border-r":B()}],"border-w-b":[{"border-b":B()}],"border-w-l":[{"border-l":B()}],"divide-x":[{"divide-x":B()}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":B()}],"divide-y-reverse":["divide-y-reverse"],"border-style":[{border:[...D(),"hidden","none"]}],"divide-style":[{divide:[...D(),"hidden","none"]}],"border-color":[{border:R()}],"border-color-x":[{"border-x":R()}],"border-color-y":[{"border-y":R()}],"border-color-s":[{"border-s":R()}],"border-color-e":[{"border-e":R()}],"border-color-bs":[{"border-bs":R()}],"border-color-be":[{"border-be":R()}],"border-color-t":[{"border-t":R()}],"border-color-r":[{"border-r":R()}],"border-color-b":[{"border-b":R()}],"border-color-l":[{"border-l":R()}],"divide-color":[{divide:R()}],"outline-style":[{outline:[...D(),"none","hidden"]}],"outline-offset":[{"outline-offset":[ep,eF,e$]}],"outline-w":[{outline:["",ep,eX,ew]}],"outline-color":[{outline:R()}],shadow:[{shadow:["","none",c,eT,eH]}],"shadow-color":[{shadow:R()}],"inset-shadow":[{"inset-shadow":["none",d,eT,eH]}],"inset-shadow-color":[{"inset-shadow":R()}],"ring-w":[{ring:B()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:R()}],"ring-offset-w":[{"ring-offset":[ep,ew]}],"ring-offset-color":[{"ring-offset":R()}],"inset-ring-w":[{"inset-ring":B()}],"inset-ring-color":[{"inset-ring":R()}],"text-shadow":[{"text-shadow":["none",b,eT,eH]}],"text-shadow-color":[{"text-shadow":R()}],opacity:[{opacity:[ep,eF,e$]}],"mix-blend":[{"mix-blend":[...P(),"plus-darker","plus-lighter"]}],"bg-blend":[{"bg-blend":P()}],"mask-clip":[{"mask-clip":["border","padding","content","fill","stroke","view"]},"mask-no-clip"],"mask-composite":[{mask:["add","subtract","intersect","exclude"]}],"mask-image-linear-pos":[{"mask-linear":[ep]}],"mask-image-linear-from-pos":[{"mask-linear-from":G()}],"mask-image-linear-to-pos":[{"mask-linear-to":G()}],"mask-image-linear-from-color":[{"mask-linear-from":R()}],"mask-image-linear-to-color":[{"mask-linear-to":R()}],"mask-image-t-from-pos":[{"mask-t-from":G()}],"mask-image-t-to-pos":[{"mask-t-to":G()}],"mask-image-t-from-color":[{"mask-t-from":R()}],"mask-image-t-to-color":[{"mask-t-to":R()}],"mask-image-r-from-pos":[{"mask-r-from":G()}],"mask-image-r-to-pos":[{"mask-r-to":G()}],"mask-image-r-from-color":[{"mask-r-from":R()}],"mask-image-r-to-color":[{"mask-r-to":R()}],"mask-image-b-from-pos":[{"mask-b-from":G()}],"mask-image-b-to-pos":[{"mask-b-to":G()}],"mask-image-b-from-color":[{"mask-b-from":R()}],"mask-image-b-to-color":[{"mask-b-to":R()}],"mask-image-l-from-pos":[{"mask-l-from":G()}],"mask-image-l-to-pos":[{"mask-l-to":G()}],"mask-image-l-from-color":[{"mask-l-from":R()}],"mask-image-l-to-color":[{"mask-l-to":R()}],"mask-image-x-from-pos":[{"mask-x-from":G()}],"mask-image-x-to-pos":[{"mask-x-to":G()}],"mask-image-x-from-color":[{"mask-x-from":R()}],"mask-image-x-to-color":[{"mask-x-to":R()}],"mask-image-y-from-pos":[{"mask-y-from":G()}],"mask-image-y-to-pos":[{"mask-y-to":G()}],"mask-image-y-from-color":[{"mask-y-from":R()}],"mask-image-y-to-color":[{"mask-y-to":R()}],"mask-image-radial":[{"mask-radial":[eF,e$]}],"mask-image-radial-from-pos":[{"mask-radial-from":G()}],"mask-image-radial-to-pos":[{"mask-radial-to":G()}],"mask-image-radial-from-color":[{"mask-radial-from":R()}],"mask-image-radial-to-color":[{"mask-radial-to":R()}],"mask-image-radial-shape":[{"mask-radial":["circle","ellipse"]}],"mask-image-radial-size":[{"mask-radial":[{closest:["side","corner"],farthest:["side","corner"]}]}],"mask-image-radial-pos":[{"mask-radial-at":y()}],"mask-image-conic-pos":[{"mask-conic":[ep]}],"mask-image-conic-from-pos":[{"mask-conic-from":G()}],"mask-image-conic-to-pos":[{"mask-conic-to":G()}],"mask-image-conic-from-color":[{"mask-conic-from":R()}],"mask-image-conic-to-color":[{"mask-conic-to":R()}],"mask-mode":[{mask:["alpha","luminance","match"]}],"mask-origin":[{"mask-origin":["border","padding","content","fill","stroke","view"]}],"mask-position":[{mask:E()}],"mask-repeat":[{mask:I()}],"mask-size":[{mask:M()}],"mask-type":[{"mask-type":["alpha","luminance"]}],"mask-image":[{mask:["none",eF,e$]}],filter:[{filter:["","none",eF,e$]}],blur:[{blur:L()}],brightness:[{brightness:[ep,eF,e$]}],contrast:[{contrast:[ep,eF,e$]}],"drop-shadow":[{"drop-shadow":["","none",m,eT,eH]}],"drop-shadow-color":[{"drop-shadow":R()}],grayscale:[{grayscale:["",ep,eF,e$]}],"hue-rotate":[{"hue-rotate":[ep,eF,e$]}],invert:[{invert:["",ep,eF,e$]}],saturate:[{saturate:[ep,eF,e$]}],sepia:[{sepia:["",ep,eF,e$]}],"backdrop-filter":[{"backdrop-filter":["","none",eF,e$]}],"backdrop-blur":[{"backdrop-blur":L()}],"backdrop-brightness":[{"backdrop-brightness":[ep,eF,e$]}],"backdrop-contrast":[{"backdrop-contrast":[ep,eF,e$]}],"backdrop-grayscale":[{"backdrop-grayscale":["",ep,eF,e$]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[ep,eF,e$]}],"backdrop-invert":[{"backdrop-invert":["",ep,eF,e$]}],"backdrop-opacity":[{"backdrop-opacity":[ep,eF,e$]}],"backdrop-saturate":[{"backdrop-saturate":[ep,eF,e$]}],"backdrop-sepia":[{"backdrop-sepia":["",ep,eF,e$]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":z()}],"border-spacing-x":[{"border-spacing-x":z()}],"border-spacing-y":[{"border-spacing-y":z()}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["","all","colors","opacity","shadow","transform","none",eF,e$]}],"transition-behavior":[{transition:["normal","discrete"]}],duration:[{duration:[ep,"initial",eF,e$]}],ease:[{ease:["linear","initial",u,eF,e$]}],delay:[{delay:[ep,eF,e$]}],animate:[{animate:["none",h,eF,e$]}],backface:[{backface:["hidden","visible"]}],perspective:[{perspective:[f,eF,e$]}],"perspective-origin":[{"perspective-origin":$()}],rotate:[{rotate:_()}],"rotate-x":[{"rotate-x":_()}],"rotate-y":[{"rotate-y":_()}],"rotate-z":[{"rotate-z":_()}],scale:[{scale:V()}],"scale-x":[{"scale-x":V()}],"scale-y":[{"scale-y":V()}],"scale-z":[{"scale-z":V()}],"scale-3d":["scale-3d"],skew:[{skew:U()}],"skew-x":[{"skew-x":U()}],"skew-y":[{"skew-y":U()}],transform:[{transform:[eF,e$,"","none","gpu","cpu"]}],"transform-origin":[{origin:$()}],"transform-style":[{transform:["3d","flat"]}],translate:[{translate:K()}],"translate-x":[{"translate-x":K()}],"translate-y":[{"translate-y":K()}],"translate-z":[{"translate-z":K()}],"translate-none":["translate-none"],zoom:[{zoom:[ec,eF,e$]}],accent:[{accent:R()}],appearance:[{appearance:["none","auto"]}],"caret-color":[{caret:R()}],"color-scheme":[{scheme:["normal","dark","light","light-dark","only-dark","only-light"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",eF,e$]}],"field-sizing":[{"field-sizing":["fixed","content"]}],"pointer-events":[{"pointer-events":["auto","none"]}],resize:[{resize:["none","","y","x"]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scrollbar-thumb-color":[{"scrollbar-thumb":R()}],"scrollbar-track-color":[{"scrollbar-track":R()}],"scrollbar-gutter":[{"scrollbar-gutter":["auto","stable","both"]}],"scrollbar-w":[{scrollbar:["auto","thin","none"]}],"scroll-m":[{"scroll-m":z()}],"scroll-mx":[{"scroll-mx":z()}],"scroll-my":[{"scroll-my":z()}],"scroll-ms":[{"scroll-ms":z()}],"scroll-me":[{"scroll-me":z()}],"scroll-mbs":[{"scroll-mbs":z()}],"scroll-mbe":[{"scroll-mbe":z()}],"scroll-mt":[{"scroll-mt":z()}],"scroll-mr":[{"scroll-mr":z()}],"scroll-mb":[{"scroll-mb":z()}],"scroll-ml":[{"scroll-ml":z()}],"scroll-p":[{"scroll-p":z()}],"scroll-px":[{"scroll-px":z()}],"scroll-py":[{"scroll-py":z()}],"scroll-ps":[{"scroll-ps":z()}],"scroll-pe":[{"scroll-pe":z()}],"scroll-pbs":[{"scroll-pbs":z()}],"scroll-pbe":[{"scroll-pbe":z()}],"scroll-pt":[{"scroll-pt":z()}],"scroll-pr":[{"scroll-pr":z()}],"scroll-pb":[{"scroll-pb":z()}],"scroll-pl":[{"scroll-pl":z()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",eF,e$]}],fill:[{fill:["none",...R()]}],"stroke-w":[{stroke:[ep,eX,ew,ek]}],stroke:[{stroke:["none",...R()]}],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{"container-named":["container-type"],overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","inset-bs","inset-be","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pbs","pbe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mbs","mbe","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-x","border-w-y","border-w-s","border-w-e","border-w-bs","border-w-be","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-x","border-color-y","border-color-s","border-color-e","border-color-bs","border-color-be","border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],translate:["translate-x","translate-y","translate-none"],"translate-none":["translate","translate-x","translate-y","translate-z"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mbs","scroll-mbe","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pbs","scroll-pbe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]},postfixLookupClassGroups:["container-type"],orderSensitiveModifiers:["*","**","after","backdrop","before","details-content","file","first-letter","first-line","marker","placeholder","selection"]}});function eV(...e){return e_(R(e))}let eU=e=>"boolean"==typeof e?`${e}`:0===e?"0":e,eK=(r="inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold tracking-[0.18em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer font-[var(--font-mono)] text-[11px]",a={variants:{variant:{default:"bg-white text-black border border-transparent hover:bg-white/90",outline:"bg-black/90 text-white border border-white/20 hover:bg-black/70 hover:border-white/35",secondary:"bg-black text-white border border-transparent hover:bg-black/85",ghost:"bg-transparent text-white/85 border border-white/15 hover:border-white/40 hover:text-white","ghost-light":"bg-transparent text-black border border-black/18 hover:border-black/50"},size:{default:"h-[48px] px-7 py-3 rounded-md",sm:"h-[40px] px-5 py-2 rounded-md text-[10px]",lg:"h-[54px] px-9 py-4 rounded-md text-[12px]",icon:"h-9 w-9 rounded-md","icon-sm":"h-8 w-8 rounded-md"}},defaultVariants:{variant:"default",size:"default"}},e=>{var t;if((null==a?void 0:a.variants)==null)return R(r,null==e?void 0:e.class,null==e?void 0:e.className);let{variants:o,defaultVariants:i}=a,s=Object.keys(o).map(r=>{let a=null==e?void 0:e[r],t=null==i?void 0:i[r];if(null===a)return null;let s=eU(a)||eU(t);return o[r][s]}),n=e&&Object.entries(e).reduce((e,r)=>{let[a,t]=r;return void 0===t||(e[a]=t),e},{});return R(r,s,null==a||null==(t=a.compoundVariants)?void 0:t.reduce((e,r)=>{let{class:a,className:t,...o}=r;return Object.entries(o).every(e=>{let[r,a]=e;return Array.isArray(a)?a.includes({...i,...n}[r]):({...i,...n})[r]===a})?[...e,a,t]:e},[]),null==e?void 0:e.class,null==e?void 0:e.className)}),eJ=s.forwardRef(({className:e,variant:r,size:a,...o},i)=>(0,t.jsx)("button",{className:eV(eK({variant:r,size:a,className:e})),ref:i,...o}));eJ.displayName="ShadcnButton";let eQ=(0,s.forwardRef)(function({beamSize:e="sm",borderBeamClassName:r,borderBeamStyle:a,theme:o="dark",colorVariant:i="colorful",staticColors:s,duration:n,active:l=!0,borderRadius:p,brightness:c,saturation:d,hueRange:b,strength:m,onActivate:g,onDeactivate:f,className:x,href:u,children:h,textColor:v,...y},$){let w=u?(0,t.jsx)("a",{href:u,className:eV("inline-flex items-center justify-center gap-2 whitespace-nowrap","font-semibold tracking-[0.18em] uppercase transition-colors","cursor-pointer text-[11px] h-[48px] px-7 py-3 rounded-md","focus-visible:outline-none",x),style:{fontFamily:"var(--font-mono)",textDecoration:"none",position:"relative",zIndex:2,...v?{color:v}:{}},children:h}):(0,t.jsx)(eJ,{className:x,style:v?{position:"relative",zIndex:2,color:v}:{position:"relative",zIndex:2},...y,children:h});return(0,t.jsx)(T,{active:l,borderRadius:p,brightness:c,className:eV("overflow-visible! inline-flex w-fit min-w-0 flex-col items-stretch leading-none",r),colorVariant:i,duration:n,hueRange:b,onActivate:g,onDeactivate:f,ref:$,saturation:d,size:e,staticColors:s,strength:m,style:a,theme:o,children:w})});eQ.displayName="BorderBeamButton";let eZ=[{num:"01",name:"Corte de cabello",price:"$5.000",desc:"Adaptado a tu estructura. Con producto Distrito."},{num:"02",name:"Fade / Skin Fade",price:"$6.500",desc:"High, mid o low fade. Precisión milimétrica."},{num:"03",name:"Arreglo de barba",price:"$3.500",desc:"Perfilado o afeitado con navaja caliente."},{num:"04",name:"Corte + Barba",price:"$8.500",desc:"El combo insignia. Café incluido."},{num:"05",name:"Color",price:"desde $9.000",desc:"Decoloración, mechas o color plano."},{num:"06",name:"Tratamiento",price:"desde $12.000",desc:"Alisado, definición o hidratación profesional."}];e.s(["GallerySection",0,function(){return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("style",{children:`
      .gal-header { grid-template-columns: 1fr 1.4fr; }

      /* ── Persiana row ─── */
      .svc-persiana {
        display: grid;
        grid-template-columns: 80px 1fr auto;
        align-items: center;
        gap: 0 40px;
        padding: 28px var(--gutter);
        max-width: var(--max);
        margin: 0 auto;
        position: relative;
        cursor: default;
      }
      .svc-persiana-wrap {
        border-top: 1px solid rgba(0,0,0,0.08);
        position: relative;
        transition: background 0.35s ease;
      }
      .svc-persiana-wrap::before {
        content: '';
        position: absolute;
        left: 0; top: 0; bottom: 0;
        width: 3px;
        background: #C9A84C;
        transform: scaleY(0);
        transform-origin: bottom;
        transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
      }
      .svc-persiana-wrap:hover::before { transform: scaleY(1); }
      .svc-persiana-wrap:hover { background: rgba(0,0,0,0.03); }
      .svc-persiana-wrap:hover .svc-p-num { color: #C9A84C; }
      .svc-persiana-wrap:hover .svc-p-name { color: #000; }
      .svc-persiana-wrap:hover .svc-p-price { color: #C9A84C; }
      .svc-persiana-wrap:hover .svc-p-desc { max-height: 50px; opacity: 1; }

      .svc-p-num {
        font-family: var(--font-display);
        font-size: clamp(36px, 4vw, 60px);
        line-height: 1;
        letter-spacing: -0.04em;
        color: rgba(0,0,0,0.1);
        transition: color 0.35s ease;
        user-select: none;
      }
      .svc-p-name {
        font-family: var(--font-display);
        font-size: clamp(22px, 3vw, 42px);
        text-transform: uppercase;
        line-height: 1;
        letter-spacing: -0.01em;
        color: rgba(0,0,0,0.75);
        transition: color 0.3s ease;
      }
      .svc-p-desc {
        max-height: 0;
        opacity: 0;
        overflow: hidden;
        transition: max-height 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease;
      }
      .svc-p-desc p {
        margin: 8px 0 0;
        font-size: 14px;
        line-height: 1.5;
        color: rgba(0,0,0,0.42);
      }
      .svc-p-price {
        font-family: var(--font-display);
        font-size: clamp(20px, 2.2vw, 32px);
        text-transform: uppercase;
        line-height: 1;
        color: rgba(0,0,0,0.55);
        text-align: right;
        flex-shrink: 0;
        transition: color 0.35s ease;
      }

      @media (max-width: 768px) {
        .gal-header { grid-template-columns: 1fr !important; gap: 12px !important; margin-bottom: 36px !important; }
        .gal-header h2 { font-size: clamp(28px, 8vw, 48px) !important; }
        .gal-header p { font-size: 13px !important; }
        .svc-persiana { grid-template-columns: 1fr auto !important; gap: 0 12px !important; padding: 16px var(--gutter) !important; }
        .svc-p-num { display: none !important; }
        .svc-p-name { font-size: 16px !important; }
        .svc-p-price { font-size: 15px !important; }
        .svc-p-desc { max-height: 30px !important; opacity: 1 !important; overflow: visible !important; }
        .svc-p-desc p { color: rgba(0,0,0,0.42) !important; font-size: 11px !important; margin-top: 4px !important; }
      }
    `}),(0,t.jsxs)("section",{id:"galeria",style:{background:"#fff",padding:"clamp(72px, 10vh, 120px) 0",position:"relative",zIndex:3,borderRadius:"20px 20px 0 0",boxShadow:"0 -12px 60px rgba(0,0,0,0.22)"},children:[(0,t.jsxs)("div",{style:{maxWidth:"var(--max)",margin:"0 auto",padding:"0 var(--gutter)"},children:[(0,t.jsxs)("div",{className:"grid items-end gap-10 gal-header",style:{marginBottom:64},children:[(0,t.jsxs)(o.RevealWrapper,{children:[(0,t.jsx)(i.Eyebrow,{num:"05",children:"Servicios"}),(0,t.jsxs)("h2",{style:{fontFamily:"var(--font-display)",fontSize:"clamp(38px, 5.6vw, 96px)",lineHeight:.88,textTransform:"uppercase",letterSpacing:"-0.01em",margin:"16px 0 0",color:"var(--ink)"},children:["El menú",(0,t.jsx)("br",{}),"del"," ",(0,t.jsx)("em",{style:{fontFamily:"var(--font-display2)",fontStyle:"italic",display:"inline-block",transform:"skewX(-6deg)"},children:"Distrito."})]})]}),(0,t.jsxs)(o.RevealWrapper,{delay:.1,children:[(0,t.jsx)("p",{style:{color:"var(--ink)",opacity:.45,fontSize:16,maxWidth:"46ch",lineHeight:1.65},children:"Cada servicio ejecutado por barberos certificados. Todos los precios incluyen lavado, producto y la experiencia Distrito completa."}),(0,t.jsx)("div",{style:{marginTop:24},children:(0,t.jsx)(eQ,{href:"#",colorVariant:"colorful",theme:"light",textColor:"#fff",className:"bg-black border border-transparent hover:bg-black/85",children:"Reservar turno →"})})]})]}),(0,t.jsx)(o.RevealWrapper,{children:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:16,marginBottom:0,color:"rgba(0,0,0,0.18)"},children:[(0,t.jsx)("span",{style:{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.28em",textTransform:"uppercase"},children:"Cortar aquí"}),(0,t.jsx)("div",{style:{flex:1,borderTop:"1.5px dashed rgba(0,0,0,0.15)"}}),(0,t.jsx)("span",{style:{fontSize:20,transform:"rotate(-45deg)",display:"inline-block"},children:"✂"})]})})]}),(0,t.jsx)("div",{style:{borderBottom:"1px solid rgba(0,0,0,0.08)",marginTop:0},children:eZ.map((e,r)=>(0,t.jsx)(o.RevealWrapper,{delay:.05*r,children:(0,t.jsx)("div",{className:"svc-persiana-wrap",children:(0,t.jsxs)("div",{className:"svc-persiana",children:[(0,t.jsx)("span",{className:"svc-p-num","aria-hidden":!0,children:e.num}),(0,t.jsxs)("div",{children:[(0,t.jsx)("span",{className:"svc-p-name",children:e.name}),(0,t.jsx)("div",{className:"svc-p-desc",children:(0,t.jsx)("p",{children:e.desc})})]}),(0,t.jsx)("div",{className:"svc-p-price",children:e.price})]})})},e.num))}),(0,t.jsx)("div",{style:{maxWidth:"var(--max)",margin:"0 auto",padding:"0 var(--gutter)"},children:(0,t.jsx)(o.RevealWrapper,{delay:.1,children:(0,t.jsxs)("div",{className:"flex justify-between items-center flex-wrap gap-4 mt-8",style:{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(0,0,0,0.35)"},children:[(0,t.jsx)("span",{children:"Precios orientativos · Consultar en sucursal"}),(0,t.jsx)("span",{children:"5 sucursales en Mendoza"})]})})})]})]})}],11511)},85299,e=>{"use strict";var r=e.i(2953),a=e.i(89849),t=e.i(5448),o=e.i(23002);let i=[{name:"Enzo",role:"Defensor",imgs:["/barberia/enzo-futbol.webp","/barberia/enzo-corte.jpeg"]},{name:"Eze",role:"Mediocampo",imgs:["/barberia/eze-futbol.jpeg","/barberia/eze-corte.jpeg"]},{name:"Nacho",role:"Defensor",imgs:["/barberia/nacho-futbol.jpg","/barberia/nacho-corte.jpeg"]}];function s({player:e,delay:o}){let[i,n]=(0,a.useState)(0),l=(0,a.useRef)(null);(0,a.useEffect)(()=>(l.current=setInterval(()=>{n(r=>(r+1)%e.imgs.length)},2500),()=>{l.current&&clearInterval(l.current)}),[e.imgs.length]);let p=["Cancha","Distrito"];return(0,r.jsx)(t.RevealWrapper,{delay:o,children:(0,r.jsxs)("div",{className:"fame-card",style:{border:"1px solid var(--line)",overflow:"hidden"},children:[(0,r.jsxs)("div",{style:{position:"relative",aspectRatio:"3/4",overflow:"hidden",background:"#111"},children:[e.imgs.map((a,t)=>(0,r.jsx)("img",{src:a,alt:`${e.name} - ${p[t]}`,style:{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",display:"block",opacity:+(i===t),transition:"opacity 0.8s cubic-bezier(0.22,1,0.36,1)"}},t)),(0,r.jsxs)("div",{className:"fame-badge",style:{position:"absolute",bottom:14,left:14,zIndex:3,display:"flex",alignItems:"center",gap:8,padding:"5px 12px",background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)",fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(255,255,255,0.75)",transition:"opacity 0.3s"},children:[(0,r.jsx)("span",{style:{width:5,height:5,borderRadius:"50%",background:0===i?"#fff":"rgba(255,255,255,0.4)",transition:"background 0.4s"}}),p[i]]}),(0,r.jsx)("div",{className:"fame-dots",style:{position:"absolute",bottom:16,right:16,zIndex:3,display:"flex",gap:5},children:e.imgs.map((e,a)=>(0,r.jsx)("div",{className:`fame-dot${i===a?" fame-dot--active":""}`,style:{width:i===a?16:5,height:5,borderRadius:3,background:i===a?"#fff":"rgba(255,255,255,0.3)",transition:"all 0.4s cubic-bezier(0.22,1,0.36,1)"}},a))})]}),(0,r.jsx)("div",{className:"fame-info",style:{padding:"18px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid var(--line)"},children:(0,r.jsxs)("div",{children:[(0,r.jsx)("div",{className:"fame-name",style:{fontFamily:"var(--font-display)",fontSize:24,textTransform:"uppercase",lineHeight:1},children:e.name}),(0,r.jsx)("div",{className:"fame-role",style:{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--paper-mute)",marginTop:4},children:e.role})]})})]})})}e.s(["FameSection",0,function(){return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("style",{children:`
      @media (max-width: 768px) {
        .fame-header { flex-direction: column; align-items: flex-start !important; gap: 14px !important; margin-bottom: 28px !important; }
        .fame-header h2 { font-size: clamp(24px, 7vw, 40px) !important; }
        .fame-grid   { grid-template-columns: repeat(3, 1fr) !important; gap: 6px !important; }
        .fame-card { border-width: 1px !important; }
        .fame-card .fame-info { padding: 8px 6px !important; }
        .fame-card .fame-name { font-size: 12px !important; }
        .fame-card .fame-role { font-size: 7px !important; letter-spacing: 0.1em !important; margin-top: 2px !important; }
        .fame-card .fame-badge { padding: 2px 5px !important; font-size: 6px !important; bottom: 4px !important; left: 4px !important; gap: 4px !important; }
        .fame-card .fame-dots { bottom: 6px !important; right: 4px !important; gap: 2px !important; }
        .fame-card .fame-dot { width: 3px !important; height: 3px !important; }
        .fame-card .fame-dot--active { width: 8px !important; }
      }
    `}),(0,r.jsx)("section",{id:"futbol",style:{background:"#050505",padding:"clamp(64px, 9vh, 100px) 0",borderTop:"1px solid var(--line)"},children:(0,r.jsxs)("div",{style:{maxWidth:"var(--max)",margin:"0 auto",padding:"0 var(--gutter)"},children:[(0,r.jsxs)("div",{className:"fame-header flex items-end justify-between gap-6 flex-wrap",style:{marginBottom:48},children:[(0,r.jsxs)(t.RevealWrapper,{children:[(0,r.jsx)(o.Eyebrow,{num:"05",children:"Hall of Fame · Fútbol"}),(0,r.jsxs)("h2",{style:{fontFamily:"var(--font-display)",fontSize:"clamp(32px, 4.5vw, 72px)",lineHeight:.9,textTransform:"uppercase",letterSpacing:"-0.01em",margin:"12px 0 0"},children:["Cortamos",(0,r.jsx)("br",{}),"al que"," ",(0,r.jsx)("em",{style:{fontFamily:"var(--font-display2)",fontStyle:"italic",color:"var(--paper)",display:"inline-block",transform:"skewX(-8deg)"},children:"juega."})]})]}),(0,r.jsx)(t.RevealWrapper,{delay:.1,children:(0,r.jsxs)("div",{style:{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:"0.22em",textTransform:"uppercase",color:"var(--paper-mute)",textAlign:"right"},children:[(0,r.jsx)("span",{style:{color:"var(--paper)"},children:"En la cancha y en la silla"}),(0,r.jsx)("br",{}),"El mismo estilo"]})})]}),(0,r.jsx)("div",{className:"grid gap-5 fame-grid",style:{gridTemplateColumns:"repeat(3,1fr)"},children:i.map((e,a)=>(0,r.jsx)(s,{player:e,delay:.12*a},e.name))})]})})]})}])},10121,e=>{"use strict";var r=e.i(2953);let a=[{name:"Godoy Cruz",logo:"/barberia/clubs/gc-loco.png"},{name:"Brasil",logo:"/barberia/clubs/br-logo.webp"},{name:"Rep. Dominicana",logo:"/barberia/clubs/rd-logo.avif"},{name:"Tigre",logo:"/barberia/clubs/tigre-logo.png"},{name:"Colón",logo:"/barberia/clubs/colon-logo.png"}],t=[...a,...a,...a];e.s(["ClubsTicker",0,function(){return(0,r.jsxs)("div",{style:{background:"#080808",borderTop:"1px solid rgba(255,255,255,0.06)",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"0",overflow:"hidden"},children:[(0,r.jsx)("div",{style:{textAlign:"center",padding:"16px 0 10px",fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.28em",textTransform:"uppercase",color:"rgba(255,255,255,0.25)"},children:"También jugadores de estos clubes y selecciones pasan por nuestra silla"}),(0,r.jsx)("style",{children:`
        .clubs-track {
          display: flex;
          gap: 0;
          width: max-content;
          animation: clubs-scroll 22s linear infinite;
        }
        @keyframes clubs-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        .clubs-track:hover { animation-play-state: paused; }
      `}),(0,r.jsx)("div",{className:"clubs-track","aria-hidden":!0,children:t.map((e,a)=>(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:14,padding:"0 36px",flexShrink:0},children:[(0,r.jsx)("img",{src:e.logo,alt:e.name,style:{width:52,height:52,objectFit:"contain",flexShrink:0,transition:"transform 0.3s"}}),(0,r.jsx)("span",{style:{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.4)",whiteSpace:"nowrap"},children:e.name}),(0,r.jsx)("span",{style:{color:"rgba(255,255,255,0.1)",fontSize:14,marginLeft:20},children:"·"})]},a))})]})}])},43819,e=>{"use strict";var r=e.i(2953),a=e.i(37177),t=e.i(5448),o=e.i(23002);let i=e.i(20301).courses.slice(0,3);e.s(["AcademiaPreviewSection",0,function(){return(0,r.jsxs)("section",{id:"academia-preview",style:{padding:"clamp(80px, 12vh, 160px) 0",background:"linear-gradient(180deg, var(--ink) 0%, #0a0a0a 100%)"},children:[(0,r.jsx)("style",{children:`
        /* ─── Title underline — dorado sutil ─── */
        .brut-card .brut-title::after {
          content: "";
          position: absolute;
          bottom: 0; left: 0;
          width: 88%; height: 2px;
          background: linear-gradient(90deg, #7a5200, #C9A84C, #F0D060, #C9A84C);
          transform: translateX(-108%);
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .brut-card:hover .brut-title::after {
          transform: translateX(0);
        }
        .brut-card .brut-arrow {
          transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), color 0.25s;
        }
        .brut-card:hover .brut-arrow {
          transform: translateX(4px);
          color: #C9A84C;
        }

        /* ─── Responsive ─── */
        @media (max-width: 768px) {
          .acad-header { grid-template-columns: 1fr !important; gap: 12px !important; }
          .acad-header h2 { font-size: clamp(28px, 8vw, 48px) !important; }
          .acad-header p { font-size: 14px !important; }
          .acad-cards  { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
          .acad-cards .brut-card { padding: 10px 10px 0 !important; min-height: auto !important; border-width: 1.5px !important; box-shadow: 3px 3px 0 rgba(201,168,76,0.15) !important; }
          .acad-cards .brut-card h3 { font-size: 14px !important; margin-bottom: 6px !important; padding-bottom: 6px !important; }
          .acad-cards .brut-card .flex.justify-between { margin-bottom: 8px !important; }
          .acad-cards .brut-card .flex.justify-between span { font-size: 8px !important; padding: 2px 6px !important; }
          .acad-cards .brut-card p { font-size: 10px !important; margin-bottom: 8px !important; line-height: 1.4 !important; }
          .acad-cards .brut-card .grid.gap-3 { padding: 8px 0 !important; gap: 4px !important; }
          .acad-cards .brut-card .grid.gap-3 div { font-size: 7px !important; }
          .acad-cards .brut-card .grid.gap-3 b { font-size: 10px !important; margin-top: 2px !important; }
          .acad-cards .brut-cta-strip { margin-left: -10px !important; margin-right: -10px !important; padding: 8px 10px !important; font-size: 8px !important; letter-spacing: 0.14em !important; }
        }

        /* ─── Bot\xf3n "Ver todos los cursos" — hover blanco simple ─── */
        .brut-see-all {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 52px;
          padding: 0 32px;
          border: 1.5px solid rgba(255,255,255,0.28);
          background: transparent;
          color: #fff;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 3px;
          cursor: pointer;
          transition: background 0.28s ease, color 0.28s ease, border-color 0.28s ease;
        }
        .brut-see-all:hover {
          background: #fff;
          color: #0a0a0a;
          border-color: #fff;
        }
      `}),(0,r.jsxs)("div",{style:{maxWidth:"var(--max)",margin:"0 auto",padding:"0 var(--gutter)"},children:[(0,r.jsxs)("div",{className:"grid items-end gap-10 acad-header",style:{gridTemplateColumns:"1fr 2fr",marginBottom:56},children:[(0,r.jsxs)(t.RevealWrapper,{children:[(0,r.jsx)(o.Eyebrow,{num:"07",children:"Academia Distrito"}),(0,r.jsxs)("h2",{style:{fontFamily:"var(--font-display)",fontSize:"clamp(36px, 5.4vw, 92px)",lineHeight:.88,textTransform:"uppercase",letterSpacing:"-0.01em",margin:"16px 0 0"},children:["Formá la",(0,r.jsx)("br",{}),"próxima ",(0,r.jsx)("em",{style:{fontFamily:"var(--font-display2)",fontStyle:"italic",color:"var(--paper)",display:"inline-block",transform:"skewX(-8deg)"},children:"generación."})]})]}),(0,r.jsx)(t.RevealWrapper,{delay:.1,children:(0,r.jsx)("p",{style:{color:"var(--paper-dim)",fontSize:16,maxWidth:540},children:"Nuestra academia profesional forma barberos listos para trabajar desde el primer día. Cursos cortos, profesores en actividad, salida laboral garantizada en la red Distrito."})})]}),(0,r.jsx)("div",{className:"grid gap-6 acad-cards",style:{gridTemplateColumns:"repeat(3,1fr)"},children:i.map((e,o)=>{let i="Avanzado"===e.level||"Pro"===e.level;return(0,r.jsx)(t.RevealWrapper,{delay:.08*o,children:(0,r.jsxs)(a.default,{href:`/academia/${e.slug}`,className:"brut-card flex flex-col",style:{border:"3px solid rgba(255,255,255,0.82)",padding:"28px 28px 0",background:"#0d0d0d",minHeight:400,transition:"transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s cubic-bezier(0.22,1,0.36,1)",boxShadow:"8px 8px 0 rgba(201,168,76,0.18)",display:"flex",flexDirection:"column"},onMouseEnter:e=>{let r=e.currentTarget;r.style.transform="translate(-4px, -4px)",r.style.boxShadow="12px 12px 0 rgba(201,168,76,0.38)"},onMouseLeave:e=>{let r=e.currentTarget;r.style.transform="translate(0, 0)",r.style.boxShadow="8px 8px 0 rgba(201,168,76,0.18)"},children:[(0,r.jsxs)("div",{className:"flex justify-between items-start mb-7",children:[(0,r.jsx)("span",{style:{padding:"4px 10px",border:`2px solid ${i?"rgba(255,255,255,0.85)":"rgba(255,255,255,0.35)"}`,fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:i?"var(--paper)":"rgba(255,255,255,0.45)"},children:e.level}),(0,r.jsxs)("span",{style:{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--paper-mute)",letterSpacing:"0.2em"},children:[e.num," / 03"]})]}),(0,r.jsxs)("h3",{className:"brut-title",style:{fontFamily:"var(--font-display)",fontSize:36,textTransform:"uppercase",lineHeight:.95,margin:"0 0 20px",paddingBottom:12,position:"relative",overflow:"hidden"},children:[e.title,(0,r.jsx)("br",{}),e.subtitle]}),(0,r.jsxs)("p",{style:{color:"rgba(255,255,255,0.45)",fontSize:14,lineHeight:1.55,margin:"0 0 24px",flex:1},children:[e.description.slice(0,110),"..."]}),(0,r.jsxs)("div",{className:"grid gap-3",style:{gridTemplateColumns:"1fr 1fr",borderTop:"2px solid rgba(255,255,255,0.12)",padding:"16px 0"},children:[(0,r.jsxs)("div",{style:{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.35)"},children:["Duración",(0,r.jsx)("b",{style:{display:"block",marginTop:4,color:"var(--paper)",fontWeight:700,letterSpacing:"0.06em",fontFamily:"var(--font-display)",fontSize:14},children:e.duration})]}),(0,r.jsxs)("div",{style:{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.35)"},children:["Modalidad",(0,r.jsx)("b",{style:{display:"block",marginTop:4,color:"var(--paper)",fontWeight:700,letterSpacing:"0.06em",fontFamily:"var(--font-display)",fontSize:14},children:e.modality})]})]}),(0,r.jsxs)("div",{className:"brut-cta-strip",style:{margin:"0 -28px",padding:"14px 28px",background:"rgba(255,255,255,0.06)",borderTop:"2px solid rgba(255,255,255,0.82)",display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:"0.22em",textTransform:"uppercase",color:"var(--paper)",fontWeight:700},children:["Ver curso",(0,r.jsx)("span",{className:"brut-arrow",children:"→"})]})]})},e.id)})}),(0,r.jsx)("div",{className:"text-center",style:{marginTop:56},children:(0,r.jsx)("a",{href:"/academia",className:"brut-see-all",children:"Ver todos los cursos →"})})]})]})}])},10466,e=>{"use strict";var r=e.i(2953),a=e.i(89849),t=e.i(37177),o=e.i(5448),i=e.i(23002),s=e.i(23877);let n="#C9A84C",l=(0,a.lazy)(()=>e.A(2450));e.s(["SucursalesPreviewSection",0,function(){let[e,p]=(0,a.useState)(null);return(0,r.jsxs)("section",{id:"sucursales",style:{padding:"clamp(80px, 12vh, 160px) 0"},children:[(0,r.jsx)("style",{children:`
        @media (max-width: 768px) {
          .suc-header { grid-template-columns: 1fr !important; gap: 12px !important; margin-bottom: 32px !important; }
          .suc-header h2 { font-size: clamp(28px, 8vw, 48px) !important; }
          .suc-header p { font-size: 14px !important; }
          .suc-layout { grid-template-columns: 1fr !important; }
          .suc-map-box { min-height: 260px !important; max-height: 50vw !important; }
          .suc-branch { padding: 16px !important; }
          .suc-branch h4 { font-size: 18px !important; }
        }
        .suc-branch {
          padding: 24px;
          cursor: pointer;
          transition: background 0.3s;
          position: relative;
        }
        .suc-branch::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          background: transparent;
          transition: background 0.3s;
        }
        .suc-branch:hover { background: rgba(255,255,255,0.04); }
        .suc-branch--on { background: rgba(201,168,76,0.06) !important; }
        .suc-branch--on::before { background: ${n} !important; }
      `}),(0,r.jsxs)("div",{style:{maxWidth:"var(--max)",margin:"0 auto",padding:"0 var(--gutter)"},children:[(0,r.jsxs)("div",{className:"grid items-end gap-10 suc-header",style:{gridTemplateColumns:"1fr 2fr",marginBottom:56},children:[(0,r.jsxs)(o.RevealWrapper,{children:[(0,r.jsx)(i.Eyebrow,{num:"09",children:"Sucursales"}),(0,r.jsxs)("h2",{style:{fontFamily:"var(--font-display)",fontSize:"clamp(36px, 5.4vw, 92px)",lineHeight:.88,textTransform:"uppercase",letterSpacing:"-0.01em",margin:"16px 0 0"},children:["5 puntos",(0,r.jsx)("br",{}),"en ",(0,r.jsx)("em",{style:{fontFamily:"var(--font-display2)",fontStyle:"italic",color:"var(--paper)",display:"inline-block",transform:"skewX(-8deg)"},children:"Mendoza."})]})]}),(0,r.jsx)(o.RevealWrapper,{delay:.1,children:(0,r.jsx)("p",{style:{color:"var(--paper-dim)",fontSize:16,maxWidth:540},children:"Encontrá tu sucursal más cercana. Reservá online en cualquiera de las cinco. Todas abren los 7 días."})})]}),(0,r.jsxs)("div",{className:"grid gap-6 suc-layout",style:{gridTemplateColumns:"1.4fr 1fr",minHeight:440},children:[(0,r.jsx)(o.RevealWrapper,{children:(0,r.jsxs)("div",{className:"suc-map-box",style:{border:"1px solid rgba(201,168,76,0.12)",overflow:"hidden",height:"100%",minHeight:440,maxHeight:"65vh",background:"#070707",position:"relative",zIndex:0},children:[(0,r.jsx)(a.Suspense,{fallback:(0,r.jsx)("div",{style:{width:"100%",height:"100%",minHeight:440,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(201,168,76,0.3)"},children:"Cargando mapa..."}),children:(0,r.jsx)(l,{branches:s.branches,activeId:e,onSelect:p})}),(0,r.jsx)("div",{style:{position:"absolute",top:16,left:16,zIndex:500,fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:n,opacity:.5,padding:"6px 10px",border:"1px solid rgba(201,168,76,0.18)",background:"rgba(0,0,0,0.7)",pointerEvents:"none"},children:"Mendoza · AR"}),(0,r.jsx)("div",{style:{position:"absolute",bottom:16,right:16,zIndex:500,fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:n,opacity:.5,padding:"6px 10px",border:"1px solid rgba(201,168,76,0.18)",background:"rgba(0,0,0,0.7)",pointerEvents:"none"},children:"−32.89°, −68.84°"})]})}),(0,r.jsx)(o.RevealWrapper,{delay:.1,children:(0,r.jsx)("div",{style:{border:"1px solid var(--line)",overflowY:"auto",maxHeight:"65vh",minHeight:440},children:s.branches.map((a,t)=>{let o=e===a.id;return(0,r.jsxs)("div",{className:`suc-branch${o?" suc-branch--on":""}`,style:{borderBottom:t<s.branches.length-1?"1px solid var(--line)":"none"},onClick:()=>p(o?null:a.id),children:[(0,r.jsx)("div",{style:{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.2em",color:o?n:"var(--paper)",marginBottom:6,transition:"color 0.3s"},children:a.num}),(0,r.jsx)("h4",{style:{fontFamily:"var(--font-display)",fontSize:24,textTransform:"uppercase",margin:"0 0 8px",lineHeight:1,color:o?n:"var(--paper)",transition:"color 0.3s"},children:a.name}),(0,r.jsx)("p",{style:{margin:0,fontSize:13,color:"var(--paper-dim)"},children:a.address}),(0,r.jsx)("div",{className:"flex items-center gap-2 mt-3",style:{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--paper-mute)"},children:a.isOpen?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("span",{style:{width:6,height:6,borderRadius:"50%",background:o?n:"#4dbb6a",display:"inline-block",flexShrink:0}}),"Abierto · ",(0,r.jsx)("b",{style:{color:o?n:"#4dbb6a",fontWeight:500},children:a.hours})]}):(0,r.jsxs)(r.Fragment,{children:["Cerrado · ",(0,r.jsx)("b",{style:{color:"var(--paper-mute)"},children:a.hours})]})})]},a.id)})})})]}),(0,r.jsx)("div",{className:"text-right mt-8",children:(0,r.jsx)(t.default,{href:"/sucursales",className:"inline-flex items-center gap-3.5",style:{padding:"16px 28px",fontFamily:"var(--font-mono)",fontSize:12,fontWeight:500,letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--paper)",border:"1px solid var(--line)",transition:"border-color 0.3s, color 0.3s"},onMouseEnter:e=>{e.currentTarget.style.borderColor=n,e.currentTarget.style.color=n},onMouseLeave:e=>{e.currentTarget.style.borderColor="var(--line)",e.currentTarget.style.color="var(--paper)"},children:"Ver mapa completo →"})})]})]})}])},94633,e=>{"use strict";var r=e.i(2953),a=e.i(5448),t=e.i(23002);let o=[{platform:"tiktok",id:"7315862093738151211"},{platform:"tiktok",id:"7478174993419963703"},{platform:"instagram",id:"DDPlJibulbU"},{platform:"instagram",id:"DNW3uHzt6cY"}];e.s(["SocialWallSection",0,function(){return(0,r.jsxs)("section",{id:"social",style:{padding:"clamp(56px, 8vh, 88px) 0",background:"#fff"},children:[(0,r.jsx)("style",{children:`
        .social-card {
          position: relative;
          aspect-ratio: 9/16;
          overflow: hidden;
          background: #f5f5f5;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 10px;
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1),
                      border-color 0.35s,
                      box-shadow 0.4s;
        }
        .social-card:hover {
          transform: translateY(-6px);
          border-color: rgba(0,0,0,0.14);
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
        }
        .social-card iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        .social-badge {
          position: absolute;
          top: 10px; left: 10px;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          font-family: var(--font-mono);
          font-size: 8px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          pointer-events: none;
        }
        .social-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        @keyframes pulse-red {
          0%,100% { opacity:1; transform:scale(1); }
          50%     { opacity:.35; transform:scale(.65); }
        }
        @media (max-width: 768px) {
          .social-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; }
          .social-card { border-radius: 6px; }
          .social-badge { font-size: 7px !important; padding: 3px 7px !important; }
          #social h2 { font-size: clamp(22px, 6vw, 36px) !important; }
        }
      `}),(0,r.jsxs)("div",{style:{maxWidth:"var(--max)",margin:"0 auto",padding:"0 var(--gutter)"},children:[(0,r.jsxs)("div",{className:"flex items-end justify-between gap-6 flex-wrap",style:{marginBottom:36},children:[(0,r.jsxs)(a.RevealWrapper,{children:[(0,r.jsx)(t.Eyebrow,{num:"09",children:(0,r.jsx)("span",{style:{color:"rgba(0,0,0,0.4)"},children:"Redes"})}),(0,r.jsxs)("h2",{style:{fontFamily:"var(--font-display)",fontSize:"clamp(28px, 3.8vw, 56px)",lineHeight:.9,textTransform:"uppercase",letterSpacing:"-0.01em",margin:"10px 0 0",color:"#0a0a0a"},children:["Lo nuevo del"," ",(0,r.jsx)("em",{style:{fontFamily:"var(--font-display2)",fontStyle:"italic",color:"#1a1a1a",display:"inline-block",transform:"skewX(-6deg)"},children:"feed."})]})]}),(0,r.jsx)(a.RevealWrapper,{delay:.1,children:(0,r.jsxs)("div",{className:"flex items-center gap-2",style:{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(0,0,0,0.45)"},children:[(0,r.jsx)("span",{style:{width:6,height:6,borderRadius:"50%",background:"#e64646",flexShrink:0,animation:"pulse-red 2s ease-in-out infinite"}}),"TikTok + Instagram"]})})]}),(0,r.jsx)("div",{className:"grid gap-4 social-grid",style:{gridTemplateColumns:"repeat(4, 1fr)"},children:o.map((e,t)=>(0,r.jsx)(a.RevealWrapper,{delay:.08*t,children:(0,r.jsxs)("div",{className:"social-card",children:[(0,r.jsx)("iframe",{src:"tiktok"===e.platform?`https://www.tiktok.com/player/v1/${e.id}?&music_info=0&description=0&rel=0&autoplay=0`:`https://www.instagram.com/p/${e.id}/embed/?hidecaption=true`,allow:"autoplay; encrypted-media",allowFullScreen:!0,loading:"lazy",scrolling:"no"}),(0,r.jsxs)("div",{className:"social-badge",children:[(0,r.jsx)("span",{className:"social-dot",style:{background:"tiktok"===e.platform?"#00f2ea":"#e1306c"}}),"tiktok"===e.platform?"TikTok":"IG"]})]})},e.id))})]})]})}])},52906,e=>{"use strict";var r=e.i(2953),a=e.i(89849);let t=[{year:"'17",title:"El origen",description:"Primera silla. Un local de 30m² y una idea: hacer la mejor barbería de Mendoza.",img:"/barberia/2017.png"},{year:"'19",title:"Expansión",description:"Segunda y tercera sucursal. El equipo crece a 18 barberos formados internamente.",img:"/barberia/2019.jpg"},{year:"'21",title:"Academia",description:"Lanzamos la primera academia profesional de barbería de Cuyo. Cohorte cero: 24 alumnos.",img:"/barberia/2021.webp"},{year:"'23",title:"Internacional",description:"Primer barbero Distrito en Madrid. La marca cruza el océano y empieza a sonar afuera.",img:"/barberia/2023-final.jpg"},{year:"'26",title:"Hoy",description:"5 sucursales, 320 alumnos egresados, comunidad consolidada. Distrito sigue creciendo.",isActive:!0,img:"/barberia/2026.jpg"}],o=["#060606","#0a0a0a","#0d0d0d","#0a0a0a","#0d0d0d","#111"];e.s(["HistorySection",0,function(){let e=(0,a.useRef)(null),i=(0,a.useRef)(null),[s,n]=(0,a.useState)(0),l=(0,a.useRef)(0),p=t.length+1,c=(0,a.useCallback)(()=>{cancelAnimationFrame(l.current),l.current=requestAnimationFrame(()=>{let r=e.current,a=i.current;if(!r||!a)return;let t=r.getBoundingClientRect(),o=r.offsetHeight-window.innerHeight;if(o<=0)return;let s=Math.max(0,Math.min(1,-t.top/o));n(s);let l=a.scrollWidth-window.innerWidth;a.style.transform=`translate3d(${-s*l}px, 0, 0)`})},[]);(0,a.useEffect)(()=>(window.addEventListener("scroll",c,{passive:!0}),c(),()=>{window.removeEventListener("scroll",c),cancelAnimationFrame(l.current)}),[c]);let d=Math.min(p-1,Math.floor(s*p));return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("style",{children:`
        /* ─── Scroll spacer wrapper ────────────────────────────── */
        .hs-wrapper {
          position: relative;
          height: ${100*p}vh;
        }

        /* ─── Sticky viewport ──────────────────────────────────── */
        .hs-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          background: #060606;
        }

        /* ─── Flex track ───────────────────────────────────────── */
        .hs-container {
          display: flex;
          width: 100%;
          will-change: transform;
        }

        /* ─── Individual panels ────────────────────────────────── */
        .hs-panel {
          min-width: 100vw;
          height: 100dvh;
          flex-shrink: 0;
          position: relative;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        /* panel divider */
        .hs-panel::after {
          content: '';
          position: absolute;
          top: 12%; bottom: 12%; right: 0;
          width: 1px;
          background: rgba(255,255,255,0.06);
        }
        .hs-panel:last-child::after { display: none; }

        /* ─── Giant year / word watermark ──────────────────────── */
        .hs-wm {
          position: absolute;
          bottom: -0.08em; right: -0.03em;
          font-family: var(--font-display);
          font-size: clamp(220px, 30vw, 500px);
          line-height: 1;
          letter-spacing: -0.05em;
          color: rgba(255,255,255,0.045);
          pointer-events: none; user-select: none;
          text-transform: uppercase;
        }

        /* ─── Content wrapper ──────────────────────────────────── */
        .hs-inner {
          padding: 0 clamp(52px, 9vw, 140px);
          position: relative;
          z-index: 2;
          max-width: 860px;
        }

        /* ─── Eyebrow ──────────────────────────────────────────── */
        .hs-eye {
          display: flex; align-items: center; gap: 16px;
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: rgba(255,255,255,0.28);
          margin-bottom: 36px;
        }
        .hs-eye-line { width: 36px; height: 1px; background: rgba(255,255,255,0.2); }

        /* ─── Intro panel ──────────────────────────────────────── */
        .hs-intro-h {
          font-family: var(--font-display);
          font-size: clamp(56px, 8.5vw, 136px);
          line-height: 0.9; letter-spacing: -0.03em;
          text-transform: uppercase; color: #fff;
          margin: 0 0 28px;
        }
        .hs-intro-p {
          font-size: 16px; color: rgba(255,255,255,0.38);
          line-height: 1.65; max-width: 42ch;
        }

        /* ─── Era panel ────────────────────────────────────────── */
        .hs-yr {
          font-family: var(--font-display);
          font-size: clamp(88px, 14vw, 220px);
          line-height: 0.88; letter-spacing: -0.04em;
          color: #fff; margin: 0 0 20px;
        }
        .hs-era-lbl {
          font-family: var(--font-mono); font-size: 12px;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: rgba(255,255,255,0.4); margin: 0 0 18px;
        }
        .hs-era-txt {
          font-family: var(--font-display2); font-style: italic;
          font-size: clamp(20px, 2.5vw, 36px);
          line-height: 1.3; color: rgba(255,255,255,0.7);
          max-width: 24ch; text-transform: uppercase;
        }
        .hs-active-badge {
          display: inline-flex; align-items: center; gap: 10px;
          margin-top: 36px; padding: 10px 22px;
          border: 1px solid rgba(255,255,255,0.18);
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .hs-dot-pulse {
          width: 6px; height: 6px; border-radius: 50%; background: #fff;
          animation: hs-pulse 2s ease-in-out infinite;
        }
        @keyframes hs-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.6)} }

        /* ─── Scroll cue ───────────────────────────────────────── */
        .hs-cue {
          position: absolute; bottom: 44px; right: clamp(52px, 7vw, 100px);
          display: flex; align-items: center; gap: 12px;
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.24em; text-transform: uppercase;
          color: rgba(255,255,255,0.22); z-index: 10;
        }

        /* ─── Progress dots ────────────────────────────────────── */
        .hs-progress {
          position: absolute; bottom: 44px; left: 50%; transform: translateX(-50%);
          display: flex; gap: 7px; z-index: 10;
        }
        .hs-pd { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.18); transition: background 0.3s; }
        .hs-pd-on { background: rgba(255,255,255,0.85); }

        /* ─── Active glow strip ────────────────────────────────── */
        .hs-glow {
          position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.5), transparent);
        }

        /* ─── Editorial photo (right side of panel) ───────────── */
        .hs-photo {
          position: absolute;
          right: clamp(32px, 6vw, 90px);
          top: 50%;
          transform: translateY(-50%);
          z-index: 1;
          pointer-events: none;
        }
        .hs-photo img {
          display: block;
          max-height: 72vh;
          height: auto;
          width: auto;
          max-width: 46vw;
          object-fit: cover;
          outline: 1px solid rgba(255,255,255,0.15);
          box-shadow: 0 24px 64px rgba(0,0,0,0.65);
          filter: grayscale(12%) contrast(1.05);
        }

        /* 2017 — m\xe1s ancha, llega m\xe1s al centro */
        .hs-photo--17 {
          right: clamp(16px, 2vw, 40px);
        }
        .hs-photo--17 img {
          max-width: 58vw;
          max-height: 76vh;
        }

        /* 2021 — ocupa todo el alto del viewport */
        .hs-photo--21 {
          top: 0;
          transform: none;
          right: clamp(12px, 2vw, 40px);
        }
        .hs-photo--21 img {
          height: 100dvh;
          max-height: 100dvh;
          max-width: 52vw;
          width: auto;
          object-fit: cover;
          object-position: center top;
        }

        /* 2026 — un poco m\xe1s grande */
        .hs-photo--26 {
          right: clamp(20px, 3vw, 60px);
        }
        .hs-photo--26 img {
          max-height: 84vh;
          max-width: 52vw;
        }

        /* ─── Mobile: igual que desktop pero tipograf\xeda compacta ── */
        @media (max-width: 768px) {
          .hs-wm    { font-size: clamp(80px, 28vw, 160px); }
          .hs-yr    { font-size: clamp(56px, 18vw, 110px); margin-bottom: 12px; }
          .hs-intro-h { font-size: clamp(40px, 14vw, 80px); }
          .hs-inner { padding: 0 clamp(24px, 7vw, 52px); }
          .hs-era-txt { font-size: clamp(16px, 4vw, 22px); }
          .hs-photo img { max-width: 40vw; max-height: 60vh; }
          .hs-photo--17 img { max-width: 44vw; }
          .hs-photo--21 img { max-width: 40vw; }
          .hs-photo--26 img { max-height: 68vh; }
        }
      `}),(0,r.jsx)("div",{className:"hs-wrapper",ref:e,children:(0,r.jsx)("div",{className:"hs-sticky",children:(0,r.jsxs)("div",{ref:i,className:"hs-container",id:"historia",children:[(0,r.jsxs)("div",{className:"hs-panel",style:{background:o[0]},children:[(0,r.jsx)("div",{className:"hs-wm","aria-hidden":!0,children:"HISTORIA"}),(0,r.jsxs)("div",{className:"hs-inner",children:[(0,r.jsxs)("div",{className:"hs-eye",children:[(0,r.jsx)("span",{className:"hs-eye-line"}),"03 · Nuestra Historia"]}),(0,r.jsxs)("h2",{className:"hs-intro-h",children:["Una",(0,r.jsx)("br",{}),"década",(0,r.jsx)("br",{}),"construyendo",(0,r.jsx)("br",{}),"el ",(0,r.jsx)("em",{style:{fontFamily:"var(--font-display2)",fontStyle:"italic"},children:"Distrito."})]}),(0,r.jsx)("p",{className:"hs-intro-p",children:"De una silla prestada en un barrio de Mendoza a la cadena de barberías más grande de la provincia. Scrolleá para recorrer la historia."})]}),(0,r.jsxs)("div",{className:"hs-cue","aria-hidden":!0,children:["Scrolleá para avanzar",(0,r.jsx)("svg",{width:"38",height:"10",viewBox:"0 0 38 10",fill:"none",children:(0,r.jsx)("path",{d:"M0 5h36M31 1l5 4-5 4",stroke:"rgba(255,255,255,0.3)",strokeWidth:"1.2"})})]})]}),t.map((e,a)=>(0,r.jsxs)("div",{className:"hs-panel",style:{background:o[a+1]},children:[(0,r.jsx)("div",{className:"hs-wm","aria-hidden":!0,children:e.year.replace("'","")}),e.isActive&&(0,r.jsx)("div",{className:"hs-glow"}),e.img&&(0,r.jsx)("div",{className:`hs-photo hs-photo--${e.year.replace("'","")}`,"aria-hidden":!0,children:(0,r.jsx)("img",{src:e.img,alt:"",loading:"lazy"})}),(0,r.jsxs)("div",{className:"hs-inner",children:[(0,r.jsxs)("div",{className:"hs-eye",children:[(0,r.jsx)("span",{className:"hs-eye-line"}),String(a+1).padStart(2,"0")," / ",String(t.length).padStart(2,"0")]}),(0,r.jsx)("div",{className:"hs-yr",children:e.year}),(0,r.jsx)("div",{className:"hs-era-lbl",children:e.title}),(0,r.jsx)("p",{className:"hs-era-txt",children:e.description}),e.isActive&&(0,r.jsxs)("div",{className:"hs-active-badge",children:["En curso · Ahora mismo ",(0,r.jsx)("span",{className:"hs-dot-pulse"})]})]}),(0,r.jsx)("div",{className:"hs-progress","aria-hidden":!0,children:Array.from({length:p}).map((e,a)=>(0,r.jsx)("div",{className:`hs-pd${a===d?" hs-pd-on":""}`},a))})]},e.year))]})})})]})}],52906)},50976,e=>{"use strict";var r=e.i(2953),a=e.i(5448),t=e.i(69376);e.s(["CtaFinalSection",0,function(){return(0,r.jsxs)("section",{id:"reservar",className:"relative overflow-hidden",style:{padding:"clamp(120px, 18vh, 220px) 0",textAlign:"center",background:"#fff",borderTop:"1px solid rgba(0,0,0,0.08)"},children:[(0,r.jsx)("style",{children:`
        @media (max-width: 768px) {
          .cta-btns { flex-direction: column; align-items: center; gap: 10px !important; }
          #reservar { padding: clamp(60px, 12vh, 100px) 0 !important; }
          #reservar h2 { font-size: clamp(40px, 10vw, 80px) !important; margin-bottom: 28px !important; }
        }
      `}),(0,r.jsxs)("div",{style:{maxWidth:"var(--max)",margin:"0 auto",padding:"0 var(--gutter)"},children:[(0,r.jsx)(a.RevealWrapper,{children:(0,r.jsxs)("p",{style:{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(0,0,0,0.35)",marginBottom:32,display:"flex",alignItems:"center",justifyContent:"center",gap:12},children:[(0,r.jsx)("span",{style:{width:24,height:1,background:"rgba(0,0,0,0.2)"}}),"Punto final",(0,r.jsx)("span",{style:{width:24,height:1,background:"rgba(0,0,0,0.2)"}})]})}),(0,r.jsx)(a.RevealWrapper,{delay:.1,children:(0,r.jsxs)("h2",{style:{fontFamily:"var(--font-display)",fontSize:"clamp(64px, 12vw, 200px)",textTransform:"uppercase",lineHeight:.88,margin:"0 0 56px",letterSpacing:"-0.03em",color:"#000"},children:["Formá parte",(0,r.jsx)("br",{}),(0,r.jsx)("em",{style:{fontStyle:"italic",fontFamily:"var(--font-display2)",opacity:.15},children:"del Distrito."})]})}),(0,r.jsx)(a.RevealWrapper,{delay:.2,children:(0,r.jsxs)("div",{className:"cta-btns flex gap-4 justify-center flex-wrap",children:[(0,r.jsx)(t.GoldButton,{href:"#",variant:"dark",children:"Reservar turno →"}),(0,r.jsx)(t.GoldButton,{href:"/academia",variant:"outline-dark",children:"Inscribirme a la academia →"})]})})]})]})}])},82749,e=>{"use strict";e.s(["ScrollRefresher",0,function(){return null}])}]);