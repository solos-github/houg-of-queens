/* ---------- Steuerung, Kamera, HUD, Hauptschleife ---------- */
const keys={};let ePressed=false;
let camYaw=0,camPitch=0.5,camDist=6.5,camCur=6.5,dragging=false,lastX=0,lastY=0;
const rayc=new THREE.Raycaster();

window.addEventListener('keydown',e=>{
  if(e.code==='KeyT'&&!e.repeat&&S.mode==='play'){throwKey();return;}
  if(e.code==='KeyX'&&!e.repeat&&S.mode==='play'){if(!truckKey())bikeKey();return;}
  if(e.code==='KeyM'&&S.mode!=='start'&&S.mode!=='intro'){toggleMusic();return;}
  if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
  if(S.mode==='tv'){
    if(e.code==='Escape'){tvClose(true);}
    else if(['KeyE','PageUp'].includes(e.code))tvChannel(5);
    else if(['KeyQ','PageDown'].includes(e.code))tvChannel(-5);
    else if(['KeyW','ArrowUp','ArrowRight','KeyD'].includes(e.code))tvChannel(1);
    else if(['KeyS','ArrowDown','ArrowLeft','KeyA'].includes(e.code))tvChannel(-1);
    else if(e.code==='Space'||e.code==='Enter')tvLock();
    return;
  }
  if(S.mode==='dish'){if(e.code==='Escape')dishClose(false);return;}
  if(S.mode==='shop'){if(e.code==='Escape'||e.code==='KeyE')closePhone();return;}
  if(S.mode==='bag'){if(e.code==='Escape'||e.code==='KeyI'||e.code==='KeyE')closeBag();return;}
  if(e.code==='KeyI'&&!e.repeat&&S.mode==='play'){openBag();return;}
  if(S.mode==='board'){if(e.code==='Escape'||e.code==='KeyE')closeBoard();return;}
  if(S.mode==='casino'||S.mode==='poker'){if(e.code==='Escape')gameClose();return;}
  if(e.repeat){keys[e.code]=true;return;}
  keys[e.code]=true;
  if(e.code==='KeyE')ePressed=true;
  if(e.code==='KeyR'&&S.mode==='play'&&TRK.mounted){radioNext();return;}
  if(e.code==='KeyQ'&&S.mode==='play')cycleTask();
  if(e.code==='KeyP'||e.code==='Escape'){
    if(S.mode==='play'){S.mode='pause';$('pause').hidden=false;}
    else if(S.mode==='pause'){S.mode='play';$('pause').hidden=true;}
  }
});
window.addEventListener('keyup',e=>{keys[e.code]=false;});
window.addEventListener('blur',()=>{for(const k in keys)keys[k]=false;});
canvas.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);canvas.focus();});
canvas.addEventListener('pointerup',e=>{dragging=false;try{canvas.releasePointerCapture(e.pointerId);}catch(_){}});
canvas.addEventListener('pointermove',e=>{
  if(!dragging)return;
  camYaw-=(e.clientX-lastX)*0.006;camPitch=clamp(camPitch+(e.clientY-lastY)*0.004,0.12,1.2);
  lastX=e.clientX;lastY=e.clientY;
});
canvas.addEventListener('wheel',e=>{e.preventDefault();camDist=clamp(camDist+e.deltaY*0.005,3,11);},{passive:false});
canvas.addEventListener('contextmenu',e=>e.preventDefault());
function goFullscreen(on){
  try{const d=document.documentElement,fs=document.fullscreenElement||document.webkitFullscreenElement;
    if(on===false||(on===undefined&&fs)){if(fs)(document.exitFullscreen||document.webkitExitFullscreen).call(document);return;}
    if(!fs){const r=d.requestFullscreen||d.webkitRequestFullscreen;if(r){const p=r.call(d);if(p&&p.catch)p.catch(()=>{});}
      try{if(window.HOUG_MOBILE&&screen.orientation&&screen.orientation.lock)screen.orientation.lock('landscape').catch(()=>{});}catch(e){}}
  }catch(e){}
}
window.addEventListener('keydown',e=>{if(e.code==='KeyF'&&!e.repeat&&!e.ctrlKey&&!e.metaKey&&['play','pause','start'].includes(S.mode))goFullscreen();});
$('goBtn').addEventListener('click',()=>{
  goFullscreen(true);audioInit();introPlay();$('start').hidden=true;$('intro').hidden=false;S.mode='intro';
});
$('resumeBtn').addEventListener('click',()=>{S.mode='play';$('pause').hidden=true;});
$('endBtn').addEventListener('click',()=>{$('endcard').hidden=true;S.mode='play';});

/* ---------- Radar ---------- */
const rctx=$('radar').getContext('2d');
function drawRadar(blips){
  const c=rctx,sc=3.4,cy=Math.cos(camYaw),sy=Math.sin(camYaw);
  // Vorwärts f=(-sy,-cy), rechts r=(cy,-sy): rx=dx*cy-dz*sy, ry=-(dx*-sy+dz*-cy)
  const T2=(x,z)=>{const dx=x-P.x,dz=z-P.z;return [75+(dx*cy-dz*sy)*sc,75+(dx*sy+dz*cy)*sc];};
  c.clearRect(0,0,150,150);c.save();c.beginPath();c.arc(75,75,73,0,7);c.clip();
  c.fillStyle='rgba(22,32,64,.9)';c.fillRect(0,0,150,150);
  c.fillStyle='rgba(120,150,210,.85)';
  for(const [x0,z0,x1,z1] of radarWalls[P.fl]){
    const a=T2(x0,z0),b=T2(x1,z0),d=T2(x1,z1),e=T2(x0,z1);
    c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d[0],d[1]);c.lineTo(e[0],e[1]);c.closePath();c.fill();
  }
  for(const b of blips){
    const p=T2(b.x,b.z);let px=p[0],py=p[1];
    const dx=px-75,dy=py-75,dd=Math.hypot(dx,dy);
    if(dd>66){px=75+dx/dd*66;py=75+dy/dd*66;}
    c.globalAlpha=(b.fl||0)===P.fl?1:0.4;
    c.fillStyle=b.blip;c.strokeStyle='#000';c.lineWidth=2;c.beginPath();c.arc(px,py,b.quest?7:4.5,0,7);c.fill();c.stroke();
    if(b.quest){c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.arc(px,py,9+Math.sin(performance.now()/180)*2,0,7);c.stroke();}c.globalAlpha=1;
  }
  const fx=Math.sin(P.rot),fz=Math.cos(P.rot),rx=fx*cy-fz*sy,ry=fx*sy+fz*cy;
  c.translate(75,75);c.rotate(Math.atan2(rx,-ry));
  c.fillStyle='#fff';c.strokeStyle='#000';c.lineWidth=2;c.beginPath();c.moveTo(0,-8);c.lineTo(6,7);c.lineTo(0,3);c.lineTo(-6,7);c.closePath();c.fill();c.stroke();
  c.restore();
}
function roomAt(x,z){
  {const wr=townRoom(x,z)||workRoom(x,z)||towerRoom(x,z);if(wr)return wr;}
  if(P.fl===-1)return 'KELLER';
  if(P.fl===0&&x>18.1&&x<34.4&&z<-0.3&&z>-6.3)return 'GARAGE';
  if(x<-14.4)return 'STRASSE';if(x<-9.3)return 'VORGARTEN';
  if(x>9.3||z>6.3||z<-6.3){if(x>4.1&&x<5.8&&z<-6.3&&z>-8)return 'KELLERGANG';return (x>9.3&&x<18&&z>-8.5&&z<2.5)?'GARTEN':'HINTERHOF';}
  if(P.fl===1){
    if(x<1.3)return z<-3.2?'ANKLEIDE':'SCHLAFZIMMER';
    if(x<4)return 'FLUR';return z<-1.5?'BAD':'GÄSTEZIMMER';
  }
  if(x>=-1.3&&x<=1.3&&z>=-6&&z<=-4.6)return 'TREPPE';
  if(x<-1.5)return 'WOHNZIMMER';if(x<1.5)return 'ESSZIMMER';
  return 'KÜCHE';
}

/* ---------- HUD ---------- */
let hudT=0,lastGoals='';
function updateHUD(it){
  const h=Math.floor(S.minutes/60),m=Math.floor(S.minutes%60);
  $('clock').textContent=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');
  $('day').textContent=DAYS[weekdayIdx()]+' · Tag '+S.day;
  $('buffs').textContent=S.buffs.map(b=>BUFFS[b].n).join(' · ');$('buffs').className=buffOn('dicke')?'bad':'';
  $('money').textContent='$'+String(Math.floor(S.money)).padStart(8,'0');
  $('bH').style.width=clamp(S.health,0,100)+'%';
  $('bF').style.width=clamp(S.hunger,0,100)+'%';
  $('bM').style.width=clamp(S.mood,0,100)+'%';needsHUD();
  $('item').textContent=S.carry||'Hände leer';
  $('zoneN').textContent=roomAt(P.x,P.z);
  const ch=CHAPTERS[S.chapter-1];
  const gl=ch.goals.map(g=>{const v=Math.min(S.cnt[g.k],g.need);return '<div class="g'+(v>=g.need?' ok':'')+'"><span>'+g.t+'</span><span>'+v+'/'+g.need+'</span></div>';}).join('');
  const tr=TRIPS[Math.min(S.tripLevel,TRIPS.length-1)],trip=S.tripLevel>=TRIPS.length?'<div class="g ok"><span>Alle Reisen gebucht</span><span>✔</span></div>':'<div class="g"><span>Reisekasse: '+tr.name+'</span><span>$'+Math.floor(S.trip)+'/'+tr.cost+'</span></div>';
  const html=(gl||'<div class="g"><span>Freies Spiel</span></div>')+trip;
  if(html!==lastGoals){lastGoals=html;$('goalList').innerHTML=html;$('chT').textContent='KAPITEL '+ch.n;$('chS').textContent=ch.title;}
  let obj='';
  if(S.task){const st=S.task.def.steps[S.task.step];obj=S.task.def.title+': '+st.label;}
  else if(S.prank)obj='Streich! '+(S.prank.type==='cushion'?'Das Sofa.':S.prank.type==='fridge'?'Such die Sandwiches.':'Das Fernsehkabel.')+'  ('+Math.ceil(S.prank.time)+' s)';
  else if(S.pizzaReady)obj='Die Pizza wartet an der Haustür.';
  else if(S.hunger<25)obj='Du hast Hunger. Ab in die Küche.';
  if(!obj){const wo=workObjective();if(wo)obj=wo;}
  $('obj').textContent=obj;
  $('inv').textContent='Sandwich-Vorrat '+S.stock+'/'+maxStock()+' · [I] Tasche '+S.bag.length+'/'+BAG_SLOTS+(S.pizzaT>0?' · Pizza in '+Math.ceil(S.pizzaT)+' s':(S.pizzaReady?' · Pizza wartet!':''));
  updateQuestUI();
  if(it){$('prompt').innerHTML='<kbd>E</kbd>'+it.label();}else $('prompt').innerHTML='';
  workHUD(it);
}

/* ---------- Aufgaben-Anzeige: Panel, Bildschirm-Pfeil ---------- */
function fmtT(m){m=Math.max(0,Math.floor(m));return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');}
function questTarget(){
  let t=null;
  {const wt=workTarget();if(wt)return {t:wt};}
  {const tqt=tqTarget();if(tqt)return {t:tqt};}
  {const dtg=dateTarget()||dinnerTarget();if(dtg)return {t:dtg};}
  if(S.prank){const pr=S.prank;t={x:pr.x,z:pr.z,fl:0,label:'Streich entschärfen'};}
  else if(S.task){const st=S.task.def.steps[S.task.step];t={x:st.x,z:st.z,fl:st.fl||0,label:st.label};}
  else if(S.pizzaReady){t={x:-7.5,z:0.9,fl:0,label:'Pizza an der Haustür'};}
  return {t};
}
function navPoint(t){
  if(t.fl===P.fl)return {x:t.x,z:t.z,y:flY(t.fl),hint:''};
  if(t.fl===1)return P.fl===0?{x:-0.9,z:-3.9,y:0,hint:'Treppe hoch ↑'}:{x:-0.9,z:-3.9,y:flY(P.fl),hint:'Obergeschoss ↑'};
  if(t.fl===-1)return {x:4.95,z:P.fl===0?-7:-11.2,y:flY(P.fl),hint:'Keller ↓'};
  return P.fl===1?{x:2.3,z:-5.2,y:2.9,hint:'Treppe runter ↓'}:{x:4.95,z:-11.2,y:-2.9,hint:'Treppe hoch ↑'};
}
const _pv=new THREE.Vector3();
function updateQuestUI(){
  const q=questTarget();
  const todo=S.todo;
  let html='';
  if(todo.length){
    const done=todo.filter(t=>t.done).length;
    html+='<div class="qh"><em>AUFGABEN</em> · '+done+'/'+todo.length+' erledigt</div>';
    todo.forEach(t=>{
      const cur=S.task===t;
      html+='<div class="qs '+(t.done?'done':(cur?'cur':''))+'"><span>'+(t.done?'✔':(cur?'➤':'○'))+'</span><span>'+t.def.title+(cur?' – '+t.def.steps[t.step].label:'')+'</span></div>';
    });
    const open=todo.length-done,start=S.tBack-(isWorkday()?480:480);
    html+='<div class="qt"><i style="width:'+clamp((S.minutes-start)/(S.tBack-start)*100,0,100)+'%"></i></div>';
    html+='<div class="qd">Frist '+fmtT(S.tBack)+' Uhr (noch '+fmtT(S.tBack-S.minutes)+' h)'+(open>1&&!S.carry?' · Q wechselt die Aufgabe':'')+'</div>';
  }else if(S.prank){html='<div class="qh"><em>STREICH!</em></div><div class="qs cur"><span>➤</span><span>'+S.prank.text+'</span></div>';}
  else if(S.pizzaReady){html='<div class="qh"><em>ZIEL</em> · Pizza abholen</div>';}
  {const wq=workQuestHTML();if(wq)html=wq+html;}
  {const dq=dateQuestHTML()||dinnerQuestHTML();if(dq)html=dq+html;}
  {const tqh=tqQuestHTML();if(tqh)html=tqh+html;}
  if(html){$('quest').hidden=false;$('quest').innerHTML=html;}else $('quest').hidden=true;
  if(!q.t){$('pin').hidden=true;return;}
  const n=navPoint(q.t),dist=Math.round(Math.hypot(n.x-P.x,n.z-P.z));
  const st=$('stage'),Wd=st.clientWidth||1,Hd=st.clientHeight||1;
  _pv.set(n.x,n.y+2.0,n.z).project(camera);
  let sx=(_pv.x*0.5+0.5)*Wd,sy=(-_pv.y*0.5+0.5)*Hd;
  if(_pv.z>1){sx=Wd-sx;sy=Hd-sy;}
  const m=70,cx=Wd/2,cy=Hd/2;
  const off=_pv.z>1||sx<m||sx>Wd-m||sy<m+30||sy>Hd-200;
  const pin=$('pin');pin.hidden=false;
  if(off){
    const ang=Math.atan2(sy-cy,sx-cx);
    const ex=clamp(sx,m,Wd-m),ey=clamp(sy,m+30,Hd-200);
    pin.style.left=ex+'px';pin.style.top=ey+'px';
    $('pinA').style.transform='rotate('+(ang+Math.PI/2)+'rad)';
  }else{
    pin.style.left=sx+'px';pin.style.top=(sy-24+Math.sin(performance.now()/220)*5)+'px';
    $('pinA').style.transform='';
  }
  $('pinA').textContent=off?'▲':'▼';
  $('pinT').textContent=n.hint?n.hint:q.t.label;
  $('pinD').textContent=dist+' m';
}

/* ---------- Spiel-Logik pro Frame ---------- */
let holdT=0,holdId=null;
function lighting(){
  const t=S.minutes/60;
  let k=1;if(t>18)k=clamp(1-(t-18)/5,0.2,1);
  const dusk=t>17&&t<21?clamp(1-Math.abs(t-19)/2,0,1):0;
  scene.background.copy(SKY_NIGHT).lerp(SKY_DAY,k).lerp(SKY_DUSK,dusk*0.5);
  scene.fog.color.copy(scene.background);
  hemi.intensity=0.28+0.5*k;sun.intensity=0.15+0.7*k;
}
function step(dt){
  // Zeit
  S.minutes+=dt;if(S.minutes>=23*60)endDay(false);
  // Hunger, Gesundheit
  S.hunger=Math.max(0,S.hunger-0.22*dt*hungerMult());
  if(S.hunger<=0)S.health-=1.5*dt;else if(S.hunger>40)S.health=Math.min(100,S.health+0.5*dt*om('regen'));
  if(S.health<=0){faint();return;}
  if(S.tvCd>0)S.tvCd-=dt;
  // Pizza
  if(S.pizzaT>0){S.pizzaT-=dt;if(S.pizzaT<=0)pizzaArrive();}
  // Tagesplan
  schedule();updateDoors(dt);hungerVoice(dt);musicLevel();needsStep(dt);socialStep(dt);player.userData.carry=S.carryKind==='parcel';
  // Streiche
  if(S.prank){S.prank.time-=dt;if(S.prank.time<=0)prankEnd(false);}
  else if(S.archieHere&&!S.bbqArchie&&S.mode==='play'&&!S.scene&&atHome()&&!(S.chapter>=3&&isWorkday()&&!S.workHome)){S.prankCd-=dt;if(S.prankCd<=0&&archie&&archie.path.length===0&&archie.plan.length===0)startPrank();}
  // Besuch
  if(S.friends){S.friendT-=dt;if(S.friendT<=0)friendsLeave();}
  else{
    S.friendCd-=dt;
    if(S.friendCd<=0){
      S.friendCd=rand(100,150);
      if(!S.ring&&!S.prank&&!S.scene&&S.mode==='play'&&S.minutes>=9*60&&S.minutes<21*60&&Math.random()<0.25&&!(S.chapter>=3&&isWorkday()&&!S.workHome))startCall();
    }
  }
  callStep(dt);bonusStep(dt);shopStep(dt);workStep(dt);townStep(dt);
  // Marker für Pizza
  if(S.pizzaReady&&!S.task&&!S.prank){marker.visible=true;marker.position.set(-7.5,0,0.9);}
  else if(!S.task&&!S.prank&&!S.pizzaReady)marker.visible=false;
  marker.rotation.y+=dt*1.5;const pu=1+Math.sin(performance.now()/260)*0.12;marker.scale.set(pu,1,pu);
  if(decoCount())S.mood=Math.min(100,S.mood+decoCount()*0.012*dt);
}
function faint(){
  S.mode='faint';$('faint').hidden=false;SND.faint();
  setTimeout(()=>{
    S.money=Math.max(0,S.money-20);S.hunger=45;S.health=60;P.x=-6.8;P.z=0.3;P.y=0;setCarry(null);truckForceOut();S.carryStop=null;
    if(S.todo.length){const i=S.todo.findIndex(t=>!t.done);selectTask(i);}
    $('faint').hidden=true;S.mode='play';
  },3200);
}
function movePlayer(dt){
  let ix=0,iz=0;
  if(keys.KeyW)iz+=1;if(keys.KeyS)iz-=1;if(keys.KeyD)ix+=1;if(keys.KeyA)ix-=1;
  if(keys.ArrowLeft)camYaw+=1.8*dt;if(keys.ArrowRight)camYaw-=1.8*dt;
  let mag=1;
  if(!ix&&!iz&&(PAD.mx||PAD.mz)){ix=PAD.mx;iz=PAD.mz;mag=Math.min(1,Math.hypot(ix,iz));}
  const len=Math.hypot(ix,iz);
  const sy=Math.sin(camYaw),cy=Math.cos(camYaw);
  let tx=0,tz=0;
  if(len>0){ix/=len;iz/=len;tx=-sy*iz+cy*ix;tz=-cy*iz-sy*ix;tx*=mag;tz*=mag;}
  const spd=(BIKE.mounted?8.6:(keys.ShiftLeft||keys.ShiftRight?6.2:4.2))*(S.hunger<=0?0.6:1)*speedMult();
  P.vx=lerp(P.vx,tx*spd,Math.min(1,dt*14));P.vz=lerp(P.vz,tz*spd,Math.min(1,dt*14));
  const [nx,nz]=collide(P.x+P.vx*dt,P.z+P.vz*dt,BIKE.mounted?0.6:0.42,P.fl);
  P.x=nx;P.z=nz;
  P.y=lerp(P.y,levelY(P.x,P.z,P.y),Math.min(1,dt*14));P.fl=flOf(P.y);
  const outside=!(P.x>-9.7&&P.x<9.7&&Math.abs(P.z)<6.7),inGar=(P.x>18.1&&P.x<34.4&&P.z<-0.3&&P.z>-6.3);
  U.visible=P.y>1.2||(outside&&P.y<1.2&&P.fl===0);BM.visible=P.y<-0.3;
  ROOF.visible=outside&&!inGar;GROOF.visible=!inGar;
  SROOF.visible=!(P.x>3.9&&P.x<6.0&&P.z<-7.9&&P.z>-11.2&&P.y<0.6);
  {const sameFl=Math.abs(marker.position.y-flY(P.fl))<0.5;marker.children.forEach(c=>c.visible=sameFl);}
  const sp=Math.hypot(P.vx,P.vz);
  if(sp>0.3)P.rot=angLerp(P.rot,Math.atan2(P.vx,P.vz),Math.min(1,dt*12));
  P.t+=dt*(sp/4.2);
  player.position.set(P.x,P.y+0.04,P.z);player.rotation.y=P.rot;
  animWalk(player,P.t,Math.min(1,sp/4),sp);
  bikeUpdate(dt);
}
function updateCamera(dt){
  const head=new THREE.Vector3(P.x,P.y+1.8,P.z);
  const dir=new THREE.Vector3(Math.sin(camYaw)*Math.cos(camPitch),Math.sin(camPitch),Math.cos(camYaw)*Math.cos(camPitch));
  rayc.set(head,dir);rayc.far=camDist+0.4;
  const occ=P.fl===-1?wallMeshes['-1'].concat([slab],grassPieces):wallMeshes[P.fl];
  const hits=rayc.intersectObjects(occ,false);
  let target=camDist;if(hits.length)target=Math.max(1.1,hits[0].distance-0.4);
  camCur=target<camCur?target:lerp(camCur,target,Math.min(1,dt*6));
  camera.position.copy(head).addScaledVector(dir,camCur);
  camera.lookAt(P.x,P.y+1.4,P.z);
}
function interact(dt){
  const L=gatherInter();let best=null,bs=-1e9;
  for(const it of L){
    if((it.fl||0)!==P.fl)continue;
    const d=Math.hypot(it.x-P.x,it.z-P.z);
    if(d<it.r){const lab=it.label();if(lab===null)continue;const sc=it.prio*100-d;if(sc>bs){bs=sc;best=it;}}
  }
  if(!best){holdT=0;holdId=null;$('hold').style.display='none';return {best:null,L};}
  const hd=best.hold?best.hold():0;
  if(hd>0){
    if(keys.KeyE){
      if(holdId!==best.id){holdId=best.id;holdT=0;}
      holdT+=dt;$('hold').style.display='block';$('hold').firstElementChild.style.width=(holdT/hd*100)+'%';
      if(holdT>=hd){holdT=0;holdId=null;keys.KeyE=false;$('hold').style.display='none';best.use();}
    }else{holdT=0;holdId=null;$('hold').style.display='none';}
  }else{
    $('hold').style.display='none';holdT=0;holdId=null;
    if(ePressed)best.use();
  }
  return {best,L};
}

let last=performance.now(),acc=0;
function frame(now){
  requestAnimationFrame(frame);
  const dt=Math.min(0.05,(now-last)/1000);last=now;
  padPoll(dt);
  if(S.mode==='play'){
    step(dt);
    if(S.mode==='play'){
      if(TRK.mounted)truckUpdate(dt);else if(S.scene)sceneHold(dt);else movePlayer(dt);
      for(const n of NPCS.slice())updateNPC(n,dt);
      const r=S.scene?{best:null,L:[]}:interact(dt);
      acc+=dt;if(acc>0.08){acc=0;updateHUD(r.best);drawRadar(r.L.filter(i=>i.blip));}
      lighting();
      updateAmbientTV(dt,P.fl===0&&Math.hypot(P.x+4.6,P.z-3.3)<16);
    }
  }else if(S.mode==='tv'){tvUpdate(dt);}
  else if(S.mode==='dish'){dishUpdate(dt);padDishCursor();}
  else if(S.mode==='start'){camYaw+=dt*0.12;}
  ePressed=false;
  updateCamera(dt);
  renderer.render(scene,camera);
}
/* Einstieg */
window.__dq={speedMult,saveSnapshot,BAGI,CLOTHES,bagAdd,bagTake,bagUse,bagGift,bagGive,bagDiscount,bagTargets,bagStep,bagCanAdd,bagReward,wearOutfit,clothBuy,binItem,openBag,closeBag,bagRender,outing,outfitReactNow,bagHas,archBbqJoin,archBbqStep,friendsArrive,friendsLeave,socialStep,updateNPC,goTo,truckKey,CAR,carIn,keys,archieStep,archieVisit,archieObj:()=>archie,hougSeat,bonusStep,TW,TWF,TQI,tqStep,tqStart,tqCall,tqEnter,tqRide,tqDeliver,tqFail,tqCaught,tqNewDay,tqFloorAt,tqTarget,tqQuestHTML,tqConniePos,guardSees,rayHit,losClear,twConnie,connieHomeAgain,tvSitStart,connieObj:()=>connie,connieStep,CACT,connieChoose,NODES,EDGES,colliders,dinnerStep,dinnerStart,dinnerEnd,dinnerTarget,DSTORY,sceneHold,dateNewDay,dateStep,dateEat,dateTarget,dateQuestHTML,dateConnie,isDateDay,ARCH_TRAP,VOICE_LINES,STATIC_INTER,collide,startPrank,archTrapLine,saveSnapshot,applySave,saveGame,loadGame,storeGet,CATALOG,BINS,archieGet:()=>archie,HL,AW,PK,SL,pkOpen,pkDeal,pkAct,pkFinish,slotOutcome,slotSpin,eval5,bestHand,inPub,pubFriendsOn,PUBF,STORES,TOWER,BP,TRK,truckIn,truckOut,truckUpdate,throwKey,assignRoute,callSick,workSchedule,workStart,workNewDay,resolveStop,pendingStops,cargoCount,ROUTES,YPS,inYPS,BINS,binSearch,PROJ,canStartShift,openBoard,renderBoard,workObjective,workTarget,PAD,padPoll,BIKE,STORES,storeBuy,openStore,bikeKey,bikeMount,bikeDismount,storeOpen,watchTV,bonusStep,tripDeposit,TRIPS,peopleInRoom,startCall,answerCall,DOORS,toggleDoor,updateDoors,DISH,dishDown,dishMove,dishUp,dishOpen,S,P,TASKS,startTask,chapterStart,nextChapter,tvOpen,TV,NPCS,startPrank,advanceTask,openPhone,CATALOG,issueTasks,evaluateTasks,startDayCard,startNextDay,schedule,connie,friendsArrive,gatherInter,collide,levelY,flOf,NODES,route,colliders};
updateHUD(null);drawRadar([]);
requestAnimationFrame(frame);
