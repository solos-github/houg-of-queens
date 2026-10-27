/* ---------- Touch-Steuerung (nur index-mobile.html): Stick links, Kamera ziehen, Tasten rechts ---------- */
(function touchInit(){
  const st=document.getElementById('stage')||document.body;
  const root=document.createElement('div');root.id='tc';
  root.innerHTML=
   '<div id="tcZone"><div id="tcRing"><i id="tcKnob"></i></div></div>'+
   '<div id="tcBtns">'+
     '<button type="button" data-k="KeyE" data-hold="1" class="big">E<small>Benutzen</small></button>'+
     '<button type="button" data-k="KeyX">🚲<small>Rad / Truck</small></button>'+
     '<button type="button" data-k="KeyT">🎯<small>Werfen</small></button>'+
     '<button type="button" id="tcSprint">🏃<small>Rennen</small></button>'+
   '</div>'+
   '<div id="tcTop">'+
     '<button type="button" data-k="KeyQ">📋</button><button type="button" data-k="KeyI">🎒</button>'+
     '<button type="button" id="tcRadio">📻</button><button type="button" id="tcZin">＋</button><button type="button" id="tcZout">－</button>'+
     '<button type="button" id="tcFs">⛶</button><button type="button" data-k="KeyP">⏸</button>'+
   '</div>'+
   '<div id="tcTv"><button type="button" data-k="KeyS">◀</button><button type="button" data-k="KeyW">▶</button><button type="button" data-k="Space">OK</button></div>'+
   '<button type="button" id="tcBack" data-k="Escape">✕ Zurück</button>'+
   '<div id="tcRot"><div>📱↻<br>Bitte das Gerät ins Querformat drehen</div></div>';
  /* Uhr, Tag und Kontostand ganz nach links oben */
  try{const hud=document.getElementById('hud'),tl=document.createElement('div');tl.id='tl';
    for(const id of ['clock','day','money']){const el=document.getElementById(id);if(el)tl.appendChild(el);}
    hud.insertBefore(tl,hud.firstChild);}catch(e){console.warn('tl',e);}
  st.appendChild(root);
  for(const s of ['#tcZone','#tcBtns','#tcTop','#tcTv','#tcBack'])root.querySelector(s).style.display='none';
  const $q=s=>root.querySelector(s);
  let sprint=false;
  /* Tasten */
  const tap=(code)=>{padKey(code,true);setTimeout(()=>padKey(code,false),70);};
  root.addEventListener('pointerdown',e=>{
    const b=e.target.closest('button');if(!b)return;
    e.preventDefault();
    if(b.id==='tcSprint'){sprint=!sprint;b.classList.toggle('on',sprint);return;}
    if(b.id==='tcRadio'){try{if(TRK.mounted)radioNext();else toggleMusic();}catch(_){}return;}
    if(b.id==='tcZin'){camDist=clamp(camDist-1.2,3,11);return;}
    if(b.id==='tcZout'){camDist=clamp(camDist+1.2,3,11);return;}
    if(b.id==='tcFs'){try{const d=document.documentElement;if(document.fullscreenElement)document.exitFullscreen();else{(d.requestFullscreen||d.webkitRequestFullscreen).call(d);try{screen.orientation.lock('landscape').catch(()=>{});}catch(_){}}}catch(_){}return;}
    const k=b.dataset.k;if(!k)return;
    if(b.dataset.hold){padKey(k,true);b.classList.add('on');
      const up=()=>{padKey(k,false);b.classList.remove('on');b.removeEventListener('pointerup',up);b.removeEventListener('pointercancel',up);b.removeEventListener('pointerleave',up);};
      b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('pointerleave',up);
    }else tap(k);
  });
  /* Schwebender Stick */
  const zone=$q('#tcZone'),ring=$q('#tcRing'),knob=$q('#tcKnob');
  let sid=null,ox=0,oy=0;const R=56;
  const upd=(x,y)=>{
    let dx=x-ox,dy=y-oy;const d=Math.hypot(dx,dy);if(d>R){dx*=R/d;dy*=R/d;}
    knob.style.transform='translate('+dx+'px,'+dy+'px)';
    let mx=dx/R,mz=-dy/R;const m=Math.hypot(mx,mz);
    if(m<0.12){mx=mz=0;}
    TOUCH.mx=mx;TOUCH.mz=mz;
    keys.ShiftLeft=sprint||m>0.97;
  };
  zone.addEventListener('pointerdown',e=>{
    if(sid!==null)return;e.preventDefault();sid=e.pointerId;ox=e.clientX;oy=e.clientY;
    try{zone.setPointerCapture(sid);}catch(_){}
    const r=zone.getBoundingClientRect();ring.style.display='block';ring.style.left=(ox-r.left-R)+'px';ring.style.top=(oy-r.top-R)+'px';upd(ox,oy);
  });
  zone.addEventListener('pointermove',e=>{if(e.pointerId===sid)upd(e.clientX,e.clientY);});
  const end=e=>{if(e.pointerId!==sid)return;sid=null;TOUCH.mx=TOUCH.mz=0;keys.ShiftLeft=sprint;ring.style.display='none';knob.style.transform='';};
  zone.addEventListener('pointerup',end);zone.addEventListener('pointercancel',end);
  /* Sichtbarkeit je Spielmodus */
  const show=(el,v,d)=>{el.style.display=v?(d||'block'):'none';};
  setInterval(()=>{
    const m=S.mode,play=m==='play';
    show(zone,play);show($q('#tcBtns'),play);show($q('#tcTop'),play,'flex');
    show($q('#tcTv'),m==='tv','flex');show($q('#tcBack'),m==='tv'||m==='dish','flex');
    if(!play&&sid!==null){sid=null;TOUCH.mx=TOUCH.mz=0;ring.style.display='none';}
    if(!play){keys.ShiftLeft=false;}
    const ok=!!(document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen);show($q('#tcFs'),ok,'flex');
  },150);
  /* Zoom/Doppeltipp-Zoom des Browsers verhindern */
  for(const ev of ['gesturestart','gesturechange','gestureend'])document.addEventListener(ev,e=>e.preventDefault());
  document.addEventListener('contextmenu',e=>e.preventDefault());
})();
