(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,58743,t=>{"use strict";var e=t.i(2953),o=t.i(89849);let a="#C9A84C",r="rgba(201,168,76,0.5)",n={centro:[-32.8908,-68.8272],"godoy-cruz":[-32.922,-68.841],guaymallan:[-32.879,-68.795],chacras:[-32.978,-68.878],lujan:[-32.95,-68.86]};t.s(["default",0,function({branches:i,activeId:p,onSelect:l}){let s=(0,o.useRef)(null),m=(0,o.useRef)(null),d=(0,o.useRef)({}),c=(0,o.useRef)({}),g=(0,o.useCallback)(t=>{l(t)},[l]);return(0,o.useEffect)(()=>{if(!s.current||m.current)return;let e=!1;return t.A(29364).then(t=>{if(e||!s.current||m.current)return;if(delete t.Icon.Default.prototype._getIconUrl,t.Icon.Default.mergeOptions({iconRetinaUrl:"",iconUrl:"",shadowUrl:""}),!document.getElementById("leaflet-css")){let t=document.createElement("link");t.id="leaflet-css",t.rel="stylesheet",t.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",document.head.appendChild(t)}let o=t.map(s.current,{center:[-32.91,-68.835],zoom:12,zoomControl:!1,attributionControl:!1,scrollWheelZoom:!1,dragging:!0,doubleClickZoom:!1});m.current=o,t.tileLayer("https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",{subdomains:"abcd",maxZoom:19}).addTo(o),i.forEach(e=>{let a=n[e.id];if(!a)return;let r=t.divIcon({className:"",iconSize:[0,0],iconAnchor:[0,0],html:`
            <div class="mz-pin" data-id="${e.id}">
              <div class="mz-pin-glow"></div>
              <div class="mz-pin-core"></div>
              <div class="mz-pin-ring"></div>
              <div class="mz-flag">
                <div class="mz-flag-line"></div>
                <div class="mz-flag-card">
                  <span class="mz-flag-title">Distrito</span>
                  <span class="mz-flag-addr">${e.name}</span>
                </div>
              </div>
            </div>
          `}),i=t.marker(a,{icon:r}).addTo(o),p=t.popup({closeButton:!1,className:"mz-popup",offset:[0,-24],autoPan:!1}).setContent(`
          <div class="mz-card">
            <div class="mz-card-header">EL DISTRITO</div>
            <div class="mz-card-name">${e.name}</div>
            <div class="mz-card-addr">${e.address}</div>
            <div class="mz-card-hours">${e.hours}</div>
          </div>
        `);i.on("click",()=>g(e.id)),d.current[e.id]=i,c.current[e.id]=p}),t.control.zoom({position:"bottomleft"}).addTo(o),setTimeout(()=>o.invalidateSize(),200)}),()=>{e=!0,m.current&&(m.current.remove(),m.current=null)}},[]),(0,o.useEffect)(()=>{m.current&&Object.keys(d.current).forEach(t=>{let e=s.current?.querySelector(`.mz-pin[data-id="${t}"]`);if(e)if(t===p){e.classList.add("mz-pin--on"),d.current[t].bindPopup(c.current[t]).openPopup();let o=n[t];o&&m.current.panTo(o,{animate:!0,duration:.5})}else e.classList.remove("mz-pin--on"),d.current[t].closePopup().unbindPopup()})},[p]),(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)("style",{children:`
        /* ─── Golden tint on tiles ─── */
        .mz-map .leaflet-tile-pane {
          filter: sepia(0.35) hue-rotate(5deg) brightness(0.85) saturate(1.6);
        }

        /* ─── Keep map below navbar (z-index < 50) ─── */
        .mz-map .leaflet-pane,
        .mz-map .leaflet-top,
        .mz-map .leaflet-bottom {
          z-index: 1 !important;
        }
        .mz-map .leaflet-popup-pane {
          z-index: 3 !important;
        }
        .mz-map .leaflet-marker-pane {
          z-index: 2 !important;
        }

        .mz-map .leaflet-control-zoom a {
          background: rgba(7,7,7,0.85) !important;
          color: ${a} !important;
          border-color: rgba(201,168,76,0.2) !important;
          font-size: 16px !important;
          width: 30px !important;
          height: 30px !important;
          line-height: 30px !important;
        }
        .mz-map .leaflet-control-zoom { border: none !important; }

        /* ─── Pin — always golden ─── */
        .mz-pin {
          position: relative;
          width: 0; height: 0;
        }
        .mz-pin-glow {
          position: absolute;
          top: -20px; left: -20px;
          width: 40px; height: 40px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.22) 0%, transparent 70%);
          transition: all 0.4s;
          pointer-events: none;
        }
        .mz-pin-core {
          position: absolute;
          top: -6px; left: -6px;
          width: 12px; height: 12px;
          border-radius: 50%;
          background: ${a};
          box-shadow: 0 0 10px rgba(201,168,76,0.6), 0 0 28px rgba(201,168,76,0.25);
          transition: all 0.3s;
        }
        .mz-pin-ring {
          position: absolute;
          top: -10px; left: -10px;
          width: 20px; height: 20px;
          border-radius: 50%;
          border: 1.5px solid rgba(201,168,76,0.3);
          animation: mz-ring-soft 3s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes mz-ring-soft {
          0%, 100% { transform: scale(1);   opacity: 0.5; }
          50%      { transform: scale(1.4); opacity: 0.15; }
        }

        /* ─── Flag label (always visible) ─── */
        .mz-flag {
          position: absolute;
          top: -38px; left: 10px;
          display: flex;
          align-items: flex-end;
          pointer-events: none;
        }
        .mz-flag-line {
          width: 1px; height: 28px;
          background: linear-gradient(to top, ${a}, rgba(201,168,76,0.15));
          position: absolute;
          left: -10px; bottom: -10px;
        }
        .mz-flag-card {
          background: rgba(7,7,7,0.88);
          border: 1px solid rgba(201,168,76,0.35);
          padding: 5px 10px;
          display: flex;
          flex-direction: column;
          gap: 1px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.6);
          white-space: nowrap;
        }
        .mz-flag-title {
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: ${a};
        }
        .mz-flag-addr {
          font-family: var(--font-mono);
          font-size: 8px;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.5);
        }

        /* ─── Active state — brighter ─── */
        .mz-pin--on .mz-pin-glow {
          background: radial-gradient(circle, rgba(201,168,76,0.4) 0%, transparent 70%);
          transform: scale(1.8);
        }
        .mz-pin--on .mz-pin-core {
          width: 14px; height: 14px;
          top: -7px; left: -7px;
          box-shadow: 0 0 18px rgba(201,168,76,0.9), 0 0 50px rgba(201,168,76,0.4);
        }
        .mz-pin--on .mz-pin-ring {
          animation: mz-ring-pulse 2s ease-out infinite;
          border-color: rgba(201,168,76,0.5);
        }
        .mz-pin--on .mz-flag-card {
          border-color: ${a};
          background: rgba(7,7,7,0.95);
          box-shadow: 0 4px 24px rgba(0,0,0,0.7), 0 0 16px rgba(201,168,76,0.12);
        }
        @keyframes mz-ring-pulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(2.8); opacity: 0; }
        }

        /* ─── Popup detail card ─── */
        .mz-popup .leaflet-popup-content-wrapper {
          background: rgba(7,7,7,0.94) !important;
          border: 1px solid ${r} !important;
          border-radius: 3px !important;
          box-shadow: 0 12px 40px rgba(0,0,0,0.7), 0 0 30px rgba(201,168,76,0.1) !important;
          padding: 0 !important;
        }
        .mz-popup .leaflet-popup-tip {
          background: rgba(7,7,7,0.94) !important;
          border: 1px solid ${r} !important;
          border-top: none !important;
          border-left: none !important;
          box-shadow: none !important;
        }
        .mz-popup .leaflet-popup-content { margin: 0 !important; }
        .mz-card {
          padding: 14px 18px;
          min-width: 190px;
        }
        .mz-card-header {
          font-family: var(--font-mono);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.2em; color: ${a};
          margin-bottom: 8px; padding-bottom: 8px;
          border-bottom: 1px solid rgba(201,168,76,0.2);
        }
        .mz-card-name {
          font-family: var(--font-mono);
          font-size: 12px; font-weight: 600;
          color: rgba(255,255,255,0.85);
          letter-spacing: 0.05em; margin-bottom: 3px;
        }
        .mz-card-addr {
          font-family: var(--font-mono);
          font-size: 10px; color: rgba(255,255,255,0.4);
          letter-spacing: 0.02em; line-height: 1.5;
          margin-bottom: 4px;
        }
        .mz-card-hours {
          font-family: var(--font-mono);
          font-size: 9px; color: ${a};
          letter-spacing: 0.1em; opacity: 0.7;
        }
      `}),(0,e.jsx)("div",{ref:s,className:"mz-map",style:{width:"100%",height:"100%"}})]})}])},29364,t=>{t.v(e=>Promise.all(["static/chunks/04lp6hf2ekz18.js"].map(e=>t.l(e))).then(()=>e(56703)))}]);