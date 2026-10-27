/* ---------- Controller (Gamepad API, Standard-Belegung: Xbox/PlayStation/Switch Pro) ----------
   Spiel:  Linker Stick laufen · Rechter Stick Kamera · A benutzen (halten bei Balken) · X Fahrrad rufen/absteigen
           Y nächste Aufgabe · B oder RT rennen · D-Pad hoch/runter Zoom · Start Pause · Select Musik
   Menüs:  D-Pad/Stick wählen · A bestätigen · B zurück
   Fernseher: Stick/D-Pad Kanal ±1 · LB/RB ±5 · A einrasten · B zurück   Geschirr: Stick = Cursor, A halten = greifen */
const TOUCH={mx:0,mz:0};
const PAD={on:false,mx:0,mz:0,prev:[],focus:0,cx:320,cy:210,drag:false,nav:{u:0,d:0,l:0,r:0}};
function padGet(){
  try{
    if(typeof navigator==='undefined'||!navigator.getGamepads)return null;
    for(const g of navigator.getGamepads()){if(g&&g.connected)return g;}
  }catch(e){}
  return null;
}
function padKey(code,down){
  try{window.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code:code,key:code}));}catch(e){}
}
const padDz=v=>Math.abs(v)<0.2?0:(v-Math.sign(v)*0.2)/0.8;
function padUIButtons(){
  const out=[];
  for(const b of document.querySelectorAll('.ov:not([hidden]) button, #phone:not([hidden]) button')){
    if(!b.disabled&&b.offsetParent!==null)out.push(b);
  }
  return out;
}
function padUI(dir,press){
  const L=padUIButtons();if(!L.length)return;
  document.querySelectorAll('.padfocus').forEach(e=>e.classList.remove('padfocus'));
  if(PAD.focus>=L.length||PAD.focus<0)PAD.focus=0;
  if(dir){PAD.focus=(PAD.focus+dir+L.length)%L.length;}
  const el=L[PAD.focus];el.classList.add('padfocus');try{el.scrollIntoView({block:'nearest'});}catch(e){}
  if(press)el.click();
}
function padPoll(dt){
  const g=padGet();
  if(!g){PAD.on=false;PAD.mx=TOUCH.mx;PAD.mz=TOUCH.mz;return;}
  const b=i=>g.buttons[i]&&g.buttons[i].pressed;
  const pressed=i=>b(i)&&!PAD.prev[i];
  const lx=padDz(g.axes[0]||0),ly=padDz(g.axes[1]||0),rx=padDz(g.axes[2]||0),ry=padDz(g.axes[3]||0);
  const up=b(12)||ly<-0.5,dn=b(13)||ly>0.5,lf=b(14)||lx<-0.5,rt=b(15)||lx>0.5;
  const nav={u:up?1:0,d:dn?1:0,l:lf?1:0,r:rt?1:0},pn=PAD.nav;
  const eu=nav.u&&!pn.u,ed=nav.d&&!pn.d,el=nav.l&&!pn.l,er=nav.r&&!pn.r;
  PAD.nav=nav;PAD.on=true;
  const m=S.mode;
  if(m==='play'){
    PAD.mx=lx;PAD.mz=-ly;
    camYaw-=rx*2.6*dt;camPitch=clamp(camPitch+ry*1.6*dt,0.12,1.2);
    if(b(12))camDist=clamp(camDist-6*dt,3,11);if(b(13))camDist=clamp(camDist+6*dt,3,11);
    const sprint=b(1)||b(7)||b(10);keys.ShiftLeft=sprint;
    if(pressed(0))padKey('KeyE',true);if(!b(0)&&PAD.prev[0])padKey('KeyE',false);
    if(pressed(2))padKey('KeyX',true);
    if(pressed(4))padKey('KeyT',true);
    if(pressed(5))padKey('KeyR',true);
    if(pressed(3))padKey('KeyQ',true);
    if(pressed(9))padKey('KeyP',true);
    if(pressed(8))padKey('KeyM',true);
    if(pressed(6))padKey('KeyI',true);
  }else{
    PAD.mx=PAD.mz=0;
    if(PAD.prev[0]&&!b(0))padKey('KeyE',false);
    if(m==='tv'){
      if(eu||er)tvChannel(1);if(ed||el)tvChannel(-1);
      if(pressed(5))tvChannel(5);if(pressed(4))tvChannel(-5);
      if(pressed(0))tvLock();if(pressed(1))tvClose(true);
    }else if(m==='dish'){
      PAD.cx=clamp(PAD.cx+lx*360*dt,0,640);PAD.cy=clamp(PAD.cy+ly*360*dt,0,420);
      if(b(0)&&!PAD.drag){PAD.drag=true;dishDown(PAD.cx,PAD.cy);}
      else if(PAD.drag&&b(0))dishMove(PAD.cx,PAD.cy);
      else if(PAD.drag&&!b(0)){PAD.drag=false;dishUp(PAD.cx,PAD.cy);}
      if(pressed(1))dishClose(false);
    }else if(m==='faint'){}
    else{
      if(eu||el)padUI(-1,false);else if(ed||er)padUI(1,false);
      else if(pressed(0))padUI(0,true);
      else if(pressed(1)){
        if(m==='shop')closePhone();
        else if(m==='bag')closeBag();
        else if(m==='board')closeBoard();
        else if(m==='casino'||m==='poker')gameClose();
        else if(m==='pause'){const r=$('resumeBtn');if(r)r.click();}
      }else if(PAD.prev.length===0||pressed(0)===false&&!document.querySelector('.padfocus'))padUI(0,false);
    }
  }
  if(m!=='dish')PAD.drag=false;
  PAD.prev=g.buttons.map(x=>x&&x.pressed);
}
function padDishCursor(){
  if(!PAD.on)return;const c=dctx;
  c.save();c.strokeStyle='#fff';c.lineWidth=3;c.beginPath();c.arc(PAD.cx,PAD.cy,14,0,7);c.stroke();
  c.strokeStyle='#000';c.lineWidth=1.5;c.beginPath();c.arc(PAD.cx,PAD.cy,16,0,7);c.stroke();c.restore();
}
window.addEventListener('gamepadconnected',e=>{try{banner('CONTROLLER','Verbunden: '+String(e.gamepad.id).slice(0,40),'#8ee26b');}catch(_){}});
