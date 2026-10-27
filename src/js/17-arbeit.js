/* ---------- Kapitel 3: Arbeit bei YPS · Truck, Routen, Schichtplan, Mülleimer ---------- */
setFloor(0);
Object.assign(S,{work:70,dayMode:null,workHome:false,vac:[],shift:null,arrived:false,carryStop:null,shiftOver:false,noLate:false,cLeft:false,ch3:false,lastRoute:'',shiftN:0});
S.cnt.parcels=0;
TALKERS.push('chef mahler');COL['chef mahler']='#ffd36b';

/* ===== Nachbarschaft erweitern: Nordring, Südring, Westallee ===== */
{
  const RD=0x4a4d57;
  box(OUT,100,0.02,6,RD,-67,-0.045,-72,false);
  box(OUT,100,0.02,6,RD,-67,-0.045,72,false);
  box(OUT,6,0.02,150,RD,-80,-0.045,0,false);
  for(let x=-112;x<=-24;x+=6){box(OUT,2.4,0.01,0.18,0xf0d26a,x,-0.03,-72,false);box(OUT,2.4,0.01,0.18,0xf0d26a,x,-0.03,72,false);}
  for(let z=-66;z<=66;z+=6)box(OUT,0.18,0.01,2.4,0xf0d26a,-80,-0.03,z,false);
  box(OUT,2.4,0.04,138,0xb9b6ad,-75.8,-0.05,0,false);box(OUT,2.4,0.04,138,0xb9b6ad,-84.2,-0.05,0,false);
  const WZ=[-54,-38,-22,-6,10,26,42,58];
  WZ.forEach((z,i)=>neighborHouse(-63.25,z,-1,NB_STYLES[i%6],i%2===1));
  WZ.forEach((z,i)=>neighborHouse(-97.25,z,1,NB_STYLES[(i+2)%6],i%2===0));
  for(let z=-60;z<=64;z+=8){tree(-74.2,z+2,1);tree(-85.8,z+5,1.1);}
}

/* ===== Hilfsfunktionen für Hauseingänge ===== */
function nbDoor(cx,cz,facing,mirror,shop){
  const m=mirror?-1:1,off=shop?1.4:2.0;
  return facing<0?{x:cx-8.65-off,z:cz+(shop?0:m*2.8)}:{x:cx+8.65+off,z:cz-(shop?0:m*2.8)};
}
const addr=(street,z,side)=>street+' '+(Math.round((z+130)/4)*2+side);
const OURS_Z=[-44,-32,-20,15.5,46.5],ACROSS_Z=[-46.5,-15.5,0,31,46.5],WALLEE_Z=[-54,-38,-22,-6,10,26,42,58];
const stopOurs=i=>Object.assign(nbDoor(-0.65,OURS_Z[i],-1,i%2===1,false),{label:addr('Rego Park Ave',OURS_Z[i],1)});
const stopAcross=i=>Object.assign(nbDoor(-34.65,ACROSS_Z[i],1,i%2===0,false),{label:addr('Rego Park Ave',ACROSS_Z[i],0)});
const stopShop=id=>{const d=SHOPS_DEF.find(s=>s.id===id);return Object.assign(nbDoor(d.cx,d.cz,d.facing,false,true),{label:d.name});};
const stopWE=i=>Object.assign(nbDoor(-63.25,WALLEE_Z[i],-1,i%2===1,false),{label:addr('Westallee',WALLEE_Z[i],1)});
const stopWW=i=>Object.assign(nbDoor(-97.25,WALLEE_Z[i],1,i%2===0,false),{label:addr('Westallee',WALLEE_Z[i],0)});
const ROUTES=[
  {id:'A',name:'Rego Park Ave Nord',stops:()=>[stopOurs(0),stopOurs(1),stopOurs(2),stopAcross(0),stopAcross(1),stopShop('markt')]},
  {id:'B',name:'Rego Park Ave Süd',stops:()=>[stopOurs(3),stopOurs(4),stopAcross(2),stopAcross(3),stopAcross(4),stopShop('spaeti'),stopShop('baeckerei')]},
  {id:'C',name:'Westallee Rundtour',stops:()=>[stopWE(0),stopWW(1),stopWE(2),stopWW(3),stopWE(4),stopWW(5),stopWE(6),stopWW(7)]}
];

/* ===== YPS-Gebäude (betretbar) ===== */
const YPS={x0:-53,x1:-37,z0:-91,z1:-81,dx:-45,dz:-79.6};
const inYPS=(x,z)=>x>YPS.x0-0.2&&x<YPS.x1+0.2&&z>YPS.z0-0.2&&z<YPS.z1+0.2;
const YROOF=new THREE.Group();scene.add(YROOF);
{
  const cx=(YPS.x0+YPS.x1)/2,cz=(YPS.z0+YPS.z1)/2;
  tbox(W,17,0.4,11,MT(TX_CARPET,1),cx,-0.4,cz);
  wall('x',YPS.z0,YPS.x0,YPS.x1,[],[CREAM,BRICK],{inS:1});
  wall('x',YPS.z1,YPS.x0,YPS.x1,[[-46,-44]],[BRICK,CREAM],{inS:-1});
  wall('z',YPS.x0,YPS.z0,YPS.z1,[[-88.5,-86.5,'w',1.0,2.2]],[CREAM,BRICK],{inS:1});
  wall('z',YPS.x1,YPS.z0,YPS.z1,[[-89.5,-88,'w',1.0,2.2]],[BRICK,CREAM],{inS:-1});
  // Dach mit Attika und großem Schild
  const rs=new THREE.MeshStandardMaterial({color:0x6a6c72,roughness:.95});
  tbox(YROOF,17.4,0.18,11.4,rs,cx,2.9,cz);
  for(const [w,d,x,z] of [[17.4,0.2,cx,YPS.z0-0.25],[0.2,11.4,YPS.x0-0.25,cz],[0.2,11.4,YPS.x1+0.25,cz],[17.4,0.2,cx,YPS.z1+0.25]])tbox(YROOF,w,0.4,d,M(0x5b3a22),x,3.08,z);
  const sg=mkTex(512,128,(c,w,h)=>{c.fillStyle='#5b3a22';c.fillRect(0,0,w,h);c.strokeStyle='#f2b705';c.lineWidth=6;c.strokeRect(6,6,w-12,h-12);
    c.fillStyle='#f2b705';c.font='bold 96px Arial, sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('YPS',w/2-60,h/2+6);
    c.font='bold 30px Arial, sans-serif';c.fillText('PAKETDIENST',w/2+112,h/2+4);});
  const sm=new THREE.Mesh(new THREE.PlaneGeometry(6.4,1.6),new THREE.MeshStandardMaterial({map:sg,roughness:.6,emissive:0xffffff,emissiveMap:sg,emissiveIntensity:.45}));
  sm.position.set(cx,3.9,YPS.z1+0.5);YROOF.add(sm);
  box(YROOF,6.6,1.8,0.2,0x3a2616,cx,3.0,YPS.z1+0.3,false);
  // Hof davor
  box(OUT,17,0.04,6.6,0xb5b3ad,cx,-0.05,-77.8,false);
  for(let x=-52;x<=-38;x+=3.5)box(OUT,0.1,0.01,4.4,0xf4f4f4,x,-0.01,-77.5,false);
  // Regale mit Paketen
  function shelf(x,z,w){
    for(const sx of [-1,1])box(W,0.08,2.3,0.6,0x5a5f66,x+sx*w/2,0,z);
    for(const y of [0.2,0.9,1.6])box(W,w,0.06,0.6,0x7a8089,x,y,z,false);
    for(const y of [0.26,0.96,1.66])for(let k=0;k<4;k++)box(W,0.5+(k%2)*0.15,0.4,0.45,0xc99a5b+((k*0x040404)&0xffffff),x-w/2+0.45+k*(w-0.6)/3.2,y,z,false);
    block(x-w/2-0.05,z-0.35,x+w/2+0.05,z+0.35);
  }
  shelf(-50.8,-90.3,3.2);shelf(-39.4,-90.3,3.2);
  // Schichtplan-Brett an der Nordwand
  box(W,2.8,1.4,0.08,0x5a3b22,-45,0.9,-90.8,false);
  box(W,2.6,1.2,0.04,0xb88a52,-45,1.0,-90.75,false);
  const pc=[0xffffff,0xfff3a8,0xcfe8ff,0xffd0d0];
  for(let k=0;k<9;k++)box(W,0.38,0.5,0.02,pc[k%4],-46.0+(k%5)*0.5,1.2+Math.floor(k/5)*0.5-0.1,-90.7,false);
  const hd=mkTex(256,64,(c,w,h)=>{c.fillStyle='#f2b705';c.fillRect(0,0,w,h);c.fillStyle='#3a2616';c.font='bold 40px Arial, sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('SCHICHTPLAN',w/2,h/2+2);});
  {const m=new THREE.Mesh(new THREE.PlaneGeometry(2.2,0.5),new THREE.MeshBasicMaterial({map:hd}));m.position.set(-45,2.45,-90.7);W.add(m);}
  box(W,2.6,0.08,0.7,0x7b5a3a,-45,0.85,-90.4,false);
  // Tresen
  box(W,3.0,1.05,0.8,0x7b5a3a,-50.2,0,-86.3);box(W,3.1,0.06,0.9,0xd8cdb8,-50.2,1.05,-86.3,false);block(-51.7,-86.7,-48.7,-85.9);
  box(W,0.5,0.35,0.4,0x1e2024,-49.4,1.11,-86.3,false);
  // Snackautomat an der Ostwand
  {const g=new THREE.Group();g.position.set(-38.2,0,-85.2);g.rotation.y=-Math.PI/2;W.add(g);
   box(g,1.0,1.9,0.85,0xc0392b,0,0,0);
   box(g,0.72,1.1,0.05,0x1b2a33,-0.06,0.6,0.44,false);
   const cols=[0xf2b705,0x3a8a4a,0xd84a3a,0x4a7ac0,0xe08a2b];
   for(let r=0;r<4;r++)for(let k=0;k<4;k++)box(g,0.13,0.18,0.06,cols[(r+k)%5],-0.27+k*0.17,0.78+r*0.22-0.05,0.4,false);
   box(g,0.2,0.3,0.05,0x222222,0.36,1.1,0.43,false);box(g,0.5,0.14,0.05,0x111111,-0.06,0.12,0.43,false);
   box(g,0.7,0.18,0.04,0xf2b705,-0.06,1.72,0.43,false);
   block(-38.7,-85.8,-37.7,-84.6);}
  // Pflanze, Mülleimer, Wasserspender
  cylS(W,0.28,0.22,0.5,12,0xa0522d,-52.2,0,-82.2);for(let i=0;i<6;i++)sph(W,0.28,0x2f8f4a,-52.2+Math.sin(i*1.4)*0.2,0.8+i*0.13,-82.2+Math.cos(i*1.4)*0.2,1,1.1,1);
  box(W,0.45,1.0,0.45,0xcfe3ef,-38.2,0,-82.4);box(W,0.38,0.38,0.38,0x7fc4e6,-38.2,1.0,-82.4,false);block(-38.5,-82.7,-37.9,-82.1);
}
const YD_NODE='YD';NODES[YD_NODE]=[-49.6,-84.6,0];

/* Dean arbeitet bei YPS */
const deanWork=makeNPC('Dean',LOOKS.dean,YD_NODE,{blip:'#7fd1ff',talk:()=>pick([
  'Houg! Du siehst aus, als hättest du deinen Truck im Schlaf gefahren.',
  'Der Snackautomat frisst mein Geld. Aber wehe, du fasst meinen Riegel an.',
  'Mahler beobachtet uns durch die Kamera. Glaube ich. Vielleicht ist es auch nur ein Rauchmelder.',
  'Wer Pakete wirft, hat Spaß. Wer sie trägt, hat Rücken.',
  'Wenn du krank bist, schreit Mahler am Telefon. Es lohnt sich nur, wenn du wirklich im Sterben liegst.'])});
attachModel(deanWork.mesh,typeof DEAN_B64==='string'?DEAN_B64:'',{height:1.82});
deanWork.mesh.rotation.y=0.98;

/* ===== Der Truck ===== */
const TRK={g:new THREE.Group(),x:-16,z:-9,rot:Math.PI,v:0,mounted:false,col:null,camOld:6.5,wheels:[]};
{
  const g=TRK.g,BODY=0x5b3a22;
  box(g,2.1,0.35,5.4,0x2a2a2e,0,0.3,0);
  box(g,2.3,2.2,3.5,BODY,0,0.65,-0.95);
  box(g,2.32,0.22,3.52,0xf2b705,0,1.0,-0.95,false);
  box(g,2.2,1.5,1.7,BODY,0,0.65,1.85);
  box(g,1.9,0.7,0.06,0x9fd0e6,0,1.25,2.72,false);
  for(const sx of [-1,1]){box(g,0.06,0.6,1.1,0x9fd0e6,sx*1.1,1.2,1.75,false);box(g,0.3,0.18,0.1,0x2a2a2e,sx*0.6,0.4,2.78,false);box(g,0.2,0.16,0.06,0xfff3b0,sx*0.8,0.62,2.74,false);}
  box(g,2.2,0.2,0.2,0x1e1e22,0,0.28,2.8,false);
  const side=mkTex(256,128,(c,w,h)=>{c.fillStyle='#5b3a22';c.fillRect(0,0,w,h);c.fillStyle='#f2b705';c.font='bold 90px Arial, sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('YPS',w/2,h/2+4);});
  for(const sx of [-1,1]){const m=new THREE.Mesh(new THREE.PlaneGeometry(3.0,1.1),new THREE.MeshStandardMaterial({map:side,roughness:.7}));m.position.set(sx*1.16,1.8,-0.95);m.rotation.y=sx*Math.PI/2;g.add(m);}
  for(const [wx,wz] of [[-1.05,1.8],[1.05,1.8],[-1.05,-1.6],[1.05,-1.6]]){const w=cylS(g,0.45,0.45,0.3,14,0x1a1a1a,wx,0,wz);w.rotation.z=Math.PI/2;w.position.set(wx,0.45,wz);TRK.wheels.push(w);}
  g.position.set(TRK.x,0,TRK.z);g.rotation.y=TRK.rot;OUT.add(g);
  TRK.col=block(0,0,0,0);
}
function truckSyncCol(){
  const T0=TRK.car?TRK.sv:TRK;      // fährt Houg gerade den Tercel, bleibt der Truck am Parkplatz stehen
  const c=TRK.col,s=Math.abs(Math.sin(T0.rot)),k=Math.abs(Math.cos(T0.rot)),hx=1.15*k+2.7*s,hz=1.15*s+2.7*k;
  c.x0=T0.x-hx;c.x1=T0.x+hx;c.z0=T0.z-hz;c.z1=T0.z+hz;c.on=TRK.car?true:!TRK.mounted;
}
function truckReset(){
  if(TRK.mounted)truckOut(true);
  TRK.x=-16;TRK.z=-9;TRK.rot=Math.PI;TRK.v=0;TRK.g.position.set(TRK.x,0,TRK.z);TRK.g.rotation.y=TRK.rot;truckSyncCol();
}
function truckIn(){
  if(TRK.mounted||BIKE.mounted)return;
  if(S.carryStop&&!S.carryStop.done){S.carryStop=null;setCarry(null);}
  TRK.mounted=true;TRK.v=0;TRK.camOld=camDist;camDist=Math.max(camDist,9.5);
  P.x=TRK.x;P.z=TRK.z;P.y=0;P.fl=0;P.vx=P.vz=0;player.visible=false;truckSyncCol();
  engineStart();
  banner(TRK.car?'TOYOTA TERCEL':'TRUCK','W/S Gas & Bremse · A/D lenken · R Radio · X aussteigen'+(pendingStops().length?' · T Paket werfen':''),'#f2b705');
}
function truckOut(quiet){
  if(!TRK.mounted)return;
  const wasCar=!!TRK.car;
  TRK.mounted=false;TRK.v=0;camDist=TRK.camOld;player.visible=true;
  const lx=Math.cos(TRK.rot),lz=-Math.sin(TRK.rot);
  let best=null;
  for(const [sx,d] of [[1,2.3],[-1,2.3],[1,3.0],[-1,3.0]]){
    const [nx,nz]=collide(TRK.x+lx*sx*d,TRK.z+lz*sx*d,0.45,0);
    if(Math.hypot(nx-(TRK.x+lx*sx*d),nz-(TRK.z+lz*sx*d))<0.05){best=[nx,nz];break;}
  }
  if(!best)best=collide(TRK.x+lx*2.6,TRK.z+lz*2.6,0.45,0);
  P.x=best[0];P.z=best[1];P.vx=P.vz=0;P.rot=TRK.rot;
  truckSyncCol();
  if(quiet){carRestore(wasCar);return;}
  // Paket für das nächstgelegene Ziel mitnehmen
  const nx=nearestStop(TRK.x,TRK.z,null);
  if(nx&&nx.d<26&&!S.carryStop){S.carryStop=nx.s;setCarry('Paket → '+nx.s.label,0xc99a5b,'parcel');say('Houg',pick(['Na dann, ab zur Haustür.','Persönlich zustellen, das gibt Trinkgeld.']),2200);}
  carRestore(wasCar);
}
function truckKey(){
  if(BIKE.mounted)return false;
  if(TRK.mounted){truckOut(false);SND.click(380);return true;}
  const dC=Math.hypot(P.x-CAR.x,P.z-CAR.z),dT=Math.hypot(P.x-TRK.x,P.z-TRK.z);
  if(dC<3.6&&P.fl===0&&dC<=dT){carIn();return true;}
  if(S.chapter>=3&&dT<4.4&&P.fl===0){truckIn();return true;}
  return false;
}
function truckForceOut(){if(TRK.mounted){const wc=!!TRK.car;TRK.mounted=false;camDist=TRK.camOld;player.visible=true;carRestore(wc);truckSyncCol();}}
/* Truck-Sound: Startton audio/voice/houg_truck_1.mp3 (einmal), danach audio/voice/houg_truck_drive.mp3 als Dauerschleife (auch in audio/ gefunden) */
const ENG={a:null,s:null,i:0,dead:false,loopOn:false,drive:['audio/voice/houg_truck_drive.mp3','audio/houg_truck_drive.mp3','audio/truck_engine.mp3'],start:['audio/voice/houg_truck_1.mp3','audio/houg_truck_1.mp3']};
function engineStart(){
  ENG.loopOn=false;if(voiceMuted)return;
  const beginLoop=()=>{if(TRK.mounted)ENG.loopOn=true;};
  try{
    if(!ENG.a&&!ENG.dead){
      const a=new Audio(ENG.drive[0]);a.loop=true;a.volume=0.4*AUDK;a.preload='auto';a.preservesPitch=false;a.webkitPreservesPitch=false;a.mozPreservesPitch=false;ENG.a=a;
      a.addEventListener('error',()=>{if(ENG.i+1<ENG.drive.length){ENG.i++;a.src=ENG.drive[ENG.i];a.load();}else ENG.dead=true;});
    }
    let si=0;const s=new Audio(ENG.start[0]);s.volume=0.9*AUDK;ENG.s=s;
    let failed=false;
    s.addEventListener('ended',beginLoop);
    s.addEventListener('error',()=>{
      if(si+1<ENG.start.length){si++;s.src=ENG.start[si];s.load();s.play().catch(()=>{});return;}
      if(!failed){failed=true;hLine('truck',2200);beginLoop();}      // kein Startton: Sprachzeile (TTS) und gleich die Fahrschleife
    });
    const pr=s.play();if(pr&&pr.catch)pr.catch(e=>{if(e&&e.name==='NotAllowedError')beginLoop();});
  }catch(e){beginLoop();}
}
setInterval(()=>{
  const a=ENG.a;
  if(!TRK.mounted||S.mode!=='play'||voiceMuted){if(ENG.s&&!ENG.s.paused&&!TRK.mounted)try{ENG.s.pause();}catch(e){}if(a&&!a.paused)a.pause();return;}
  if(!a||ENG.dead||!ENG.loopOn)return;
  if(a.paused)a.play().catch(()=>{});
  const sp=Math.min(1,Math.abs(TRK.v)/12);
  a.volume=(0.3+0.55*sp)*AUDK;a.playbackRate=0.85+0.5*sp;
},250);
function truckUpdate(dt){
  let ix=0,iz=0;
  if(keys.KeyW)iz+=1;if(keys.KeyS)iz-=1;if(keys.KeyD)ix+=1;if(keys.KeyA)ix-=1;
  if(keys.ArrowLeft)camYaw+=1.8*dt;if(keys.ArrowRight)camYaw-=1.8*dt;
  if(!ix&&!iz&&(PAD.mx||PAD.mz)){ix=PAD.mx;iz=PAD.mz;}
  const vmax=((keys.ShiftLeft||keys.ShiftRight)?15:11.5)*(TRK.car?0.9:1);
  if(iz>0.1)TRK.v=Math.min(vmax*Math.min(1,iz),TRK.v+(TRK.v<0?16:7)*dt);
  else if(iz<-0.1)TRK.v=TRK.v>0.2?Math.max(0,TRK.v-16*dt):Math.max(-5,TRK.v-5*dt);
  else TRK.v-=TRK.v*Math.min(1,1.4*dt);
  if(S.hunger<=0)TRK.v*=0.995;
  const sf=clamp(Math.abs(TRK.v)/4,0,1)*(TRK.v>=0?1:-1);
  TRK.rot-=ix*1.55*dt*sf;
  const nx=TRK.x+Math.sin(TRK.rot)*TRK.v*dt,nz=TRK.z+Math.cos(TRK.rot)*TRK.v*dt;
  const [cx,cz]=collide(nx,nz,TRK.car?0.8:1.35,0);
  if(Math.hypot(cx-nx,cz-nz)>0.02){TRK.v*=0.35;}
  TRK.x=cx;TRK.z=cz;
  const VG=TRK.car?CAR.g:TRK.g;
  VG.position.set(TRK.x,0,TRK.z);VG.rotation.y=TRK.rot;
  VG.rotation.z=-ix*0.02*sf;
  for(const w of (TRK.car?CAR.wheels:TRK.wheels))w.rotation.x+=TRK.v*dt/(TRK.car?0.3:0.45);
  P.x=TRK.x;P.z=TRK.z;P.y=0;P.fl=0;P.vx=Math.sin(TRK.rot)*TRK.v;P.vz=Math.cos(TRK.rot)*TRK.v;P.rot=TRK.rot;
  if(!dragging&&Math.abs(TRK.v)>1)camYaw=angLerp(camYaw,TRK.rot+(TRK.v>=0?Math.PI:0),Math.min(1,dt*(TRK.v>=0?2.2:1.2)));
  U.visible=true;BM.visible=false;ROOF.visible=true;GROOF.visible=true;YROOF.visible=true;
  player.position.set(P.x,P.y+0.04,P.z);player.rotation.y=P.rot;
  truckSyncCol();
}

/* ===== Schicht, Pakete, Lohn ===== */
const PAY_CLEAN=28,PAY_THROW=12,PAY_ROUTE=20;
const wageMult=()=>0.6+0.4*clamp(S.work,0,100)/100;
function workMod(d){S.work=clamp(S.work+d,0,100);}
const pendingStops=()=>S.shift?S.shift.stops.filter(s=>!s.done):[];
const cargoCount=()=>pendingStops().length-((S.carryStop&&!S.carryStop.done)?1:0);
function nearestStop(x,z,excl){
  let b=null,bd=1e9;
  for(const s of pendingStops()){if(s===excl||s===S.carryStop)continue;const d=Math.hypot(s.x-x,s.z-z);if(d<bd){bd=d;b=s;}}
  return b?{s:b,d:bd}:null;
}
const PROJ=[];
function flyParcel(x0,z0,x1,z1,miss){
  const m=makeItem('parcel');m.scale.setScalar(1.3);OUT.add(m);
  PROJ.push({m,x0,z0,x1,z1,t:0,dur:miss?0.55:0.85,h:0});
}
function projStep(dt){
  for(let i=PROJ.length-1;i>=0;i--){
    const p=PROJ[i];p.t+=dt;const k=Math.min(1,p.t/p.dur);
    p.m.position.set(lerp(p.x0,p.x1,k),0.15+Math.sin(k*Math.PI)*2.0+(1-k)*1.4,lerp(p.z0,p.z1,k));p.m.rotation.y+=dt*9;
    if(k>=1){p.m.position.y=0.05;p.h+=dt;if(p.h>7){OUT.remove(p.m);PROJ.splice(i,1);}}
  }
}
const THANKS=['Danke! Wurde auch Zeit.','Oh, ein Paket! Genau das habe ich bestellt.','Super, stellen Sie es einfach da ab. Danke!','Endlich! Mein Hund hat schon gewartet.'];
const COMPLAINTS=['Hey! Das war mein Blumenbeet!','Da liegt jetzt ein Paket im Gebüsch!','Wird das Ihr Ernst?! Ich beschwere mich bei YPS!','Haben Sie das gerade aus dem Fenster geworfen?!'];
function resolveStop(s,how){
  if(s.done)return;s.done=true;
  if(S.carryStop===s){S.carryStop=null;setCarry(null);}
  let pay=0;
  if(how==='clean'){pay=Math.round(PAY_CLEAN*wageMult());workMod(2);S.shift.clean++;}
  else if(how==='thrown'){pay=Math.round(PAY_THROW*wageMult());workMod(0.6);S.shift.thrown++;}
  else{workMod(-3);S.shift.lost++;}
  S.money+=pay;S.shift.paid+=pay;S.cnt.parcels++;
  if(how==='lost')banner('PAKET VERLOREN','Daneben – kein Lohn · Arbeit −3','#ff7b7b');
  else banner(how==='clean'?'PAKET ZUGESTELLT':'PAKET GEWORFEN','+$'+pay+(how==='thrown'?' (geworfen zahlt weniger)':'')+' · '+s.label,'#8ee26b');
  if(how!=='lost')SND.win();else SND.buzz();
  if(!pendingStops().length)finishRoute();
  checkParcelGoal();
}
function finishRoute(){
  const bonus=Math.round(PAY_ROUTE*wageMult());
  S.money+=bonus;S.shift.paid+=bonus;workMod(6);S.shift.finished=true;
  setTimeout(()=>{banner('ROUTE ABGESCHLOSSEN','Bonus +$'+bonus+' · Arbeit +6 · Schicht gesamt $'+S.shift.paid,'#f5c542');SND.ding();
    say('Houg',S.minutes<16.5*60?'Route fertig. Zurück zu YPS, die nächste holen – oder Feierabend.':'Route fertig. Das war\'s für heute.',3600);},900);
}
function checkParcelGoal(){
  if(S.cnt.parcels>=20&&!S.ch3Done){S.ch3Done=true;setTimeout(()=>{banner('KAPITEL 3 GESCHAFFT','20 Pakete zugestellt – weiter geht\'s im freien Spiel','#f5c542');SND.win();say('Chef Mahler','Zwanzig Pakete. Sie sind nicht der Schlechteste, Houg.',4200);},1500);}
}
const atHome=()=>!TRK.mounted&&!BIKE.mounted&&P.x>-14.5&&P.x<34.6&&P.z>-9.2&&P.z<7.5;
function throwKey(){
  if(S.mode!=='play'||!TRK.mounted)return;
  if(cargoCount()<=0){say('Houg','Der Laderaum ist leer.',1800);SND.buzz();return;}
  const n=nearestStop(TRK.x,TRK.z,null);
  if(!n||n.d>24){say('Houg','Hier ist nichts zuzustellen.',1800);SND.buzz();return;}
  const sp=Math.abs(TRK.v),dx=Math.sin(TRK.rot),dz=Math.cos(TRK.rot),rx=-Math.cos(TRK.rot),rz=Math.sin(TRK.rot);
  const side=((n.s.x-TRK.x)*rx+(n.s.z-TRK.z)*rz)>=0?1:-1;
  const near=n.d<=11,hit=near&&Math.random()<clamp(1-(sp-5)/12,0.35,1);
  const x0=TRK.x+rx*side*1.2,z0=TRK.z+rz*side*1.2;
  SND.click(700);
  if(hit){flyParcel(x0,z0,n.s.x,n.s.z,false);setTimeout(()=>{resolveStop(n.s,'thrown');if(Math.random()<0.2){if(Math.random()<0.6)aLine('meckern');else aLine('danke');}},850);}
  else{
    const tx=near?n.s.x+rx*side*2.5+dx*3:x0+rx*side*7+dx*sp*0.4,tz=near?n.s.z+rz*side*2.5+dz*3:z0+rz*side*7+dz*sp*0.4;
    flyParcel(x0,z0,tx,tz,true);
    setTimeout(()=>{resolveStop(n.s,'lost');},600);
  }
}

/* ===== Schichtplan-Brett ===== */
function canStartShift(){
  if(S.chapter<3)return 'Das Brett ist noch leer.';
  if(!isWorkday())return 'Am Wochenende hat YPS zu.';
  if(S.workHome)return S.dayMode==='absent'?'Du wurdest heute schon als abwesend gemeldet.':'Du hast heute frei (krank oder Urlaub).';
  if(S.minutes>=17*60)return 'Nach 17:00 Uhr werden keine Routen mehr vergeben.';
  if(pendingStops().length)return 'Du hast noch Pakete im Truck.';
  return null;
}
function assignRoute(){
  const why=canStartShift();if(why){say('Houg',why,2400);return;}
  const pool=ROUTES.filter(r=>r.id!==S.lastRoute),r=pick(pool);
  S.lastRoute=r.id;S.dayMode='work';S.arrived=true;S.shiftOver=false;
  if(S.shiftN===0&&S.minutes>9*60&&!S.noLate){workMod(-4);say('Chef Mahler','Neun Uhr durch, Houg! Kommen Sie gefälligst pünktlich!',3600);}
  S.shiftN++;
  S.shift={route:r,name:r.name,stops:r.stops().map(s=>Object.assign({},s,{done:false})),paid:0,clean:0,thrown:0,lost:0,finished:false};
  buildStopMarks();
  banner('ROUTE '+r.id+' · '+r.name,S.shift.stops.length+' Pakete geladen · Steig in den Truck vor dem Büro','#f5c542');
  SND.ding();
  say('Chef Mahler','Route '+r.id+', '+r.name+'. '+S.shift.stops.length+' Pakete. Zustellen, nicht verlieren, nicht aus dem Fenster werfen. Okay, werfen ist erlaubt, aber ich sehe es nicht gerne.',6200);
}
function openBoard(){S.mode='board';$('board').hidden=false;renderBoard();}
function closeBoard(){$('board').hidden=true;S.mode='play';}
function renderBoard(){
  const why=canStartShift(),work=Math.round(S.work);
  $('bdSub').textContent='Arbeitssituation '+work+' % · Lohn pro Paket zugestellt $'+Math.round(PAY_CLEAN*wageMult())+', geworfen $'+Math.round(PAY_THROW*wageMult());
  let h='<div class="card food"><h3>Heutige Schicht</h3><p>'+(S.shift&&pendingStops().length?('Route '+S.shift.route.id+' · '+S.shift.name+' · noch '+pendingStops().length+' Pakete'):(why||'Bereit für die nächste Route. Du bekommst eine von drei möglichen Routen zugewiesen.'))+'</p>'
    +'<button type="button" data-bd="route"'+(why?' disabled':'')+'>'+(S.shiftN?'Nächste Route holen':'Schichtplan prüfen')+'</button></div>';
  const booked=S.vac.filter(d=>d>S.day).length;
  for(let k=1;k<=7;k++){
    const d=S.day+k,wd=(d-1)%7,isWE=wd>=5,has=S.vac.includes(d);
    h+='<div class="card'+(has?' own':'')+'"><h3>'+DAYS[wd]+' · Tag '+d+'</h3><p>'+(isWE?'Wochenende – ohnehin frei.':(has?'Urlaub genehmigt. Connies Aufgaben warten.':'Normale Schicht ab 7:00 Uhr.'))+'</p>'
      +(isWE?'':'<button type="button" data-vac="'+d+'"'+((!has&&booked>=3)?' disabled':'')+'>'+(has?'Urlaub stornieren':(booked>=3?'Maximal 3 Urlaubstage':'Urlaub nehmen'))+'</button>')+'</div>';
  }
  $('bdC').innerHTML=h;
}
$('board').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.id==='bdClose'){closeBoard();return;}
  if(b.dataset.bd==='route'){closeBoard();assignRoute();return;}
  if(b.dataset.vac){
    const d=+b.dataset.vac,i=S.vac.indexOf(d);
    if(i>=0)S.vac.splice(i,1);else if(S.vac.filter(x=>x>S.day).length<3){S.vac.push(d);SND.click(620);say('Chef Mahler','Urlaub genehmigt. Aber kommen Sie erholt wieder.',2800);}
    renderBoard();
  }
});

/* ===== Krankmeldung per Telefon ===== */
function sickAvailable(){return S.chapter>=3&&isWorkday()&&!S.workHome&&!S.arrived&&!S.shift&&S.minutes<11*60;}
function workPhoneCard(){
  if(!sickAvailable())return '';
  return '<div class="card food"><h3>🤒 Beim Chef krankmelden</h3><p>Du bleibst zuhause und übernimmst Connies Aufgaben. Dein Chef wird sauer: Arbeitssituation −12.</p><button type="button" data-sick="1">Krank melden</button></div>';
}
function callSick(){
  if(!sickAvailable())return;
  closePhone();
  S.workHome=true;S.dayMode='sick';S.assigned=false;S.evaluated=false;workMod(-12);
  say('Chef Mahler',pick(['Krank?! Schon wieder?! Ich hoffe, Sie liegen wirklich im Bett, Houg!','Das ist jetzt schon das dritte Mal, dass ich meinen Truck selbst beladen muss. Gute Besserung, wenn es denn stimmt!','Krank. Natürlich. Am Tag mit den meisten Paketen. Wunderbar.']),5600);
  banner('KRANKGEMELDET','Arbeitssituation −12 · Heute übernimmst du Connies Aufgaben','#ff7b7b');
  SND.buzz();
}

/* ===== Tagesablauf an Arbeitstagen ===== */
function workSchedule(){
  const m=S.minutes;
  if(!S.assigned&&m>=7*60){
    S.assigned=true;S.evaluated=false;S.tBack=15*60+(buffOn('zeit')?60:0);
    if(S.vac.includes(S.day)){S.dayMode='vac';S.workHome=true;S.assigned=false;banner('URLAUB','Heute frei · Connie hat Aufgaben für dich','#8ee26b');return;}
    setTimeout(()=>{if(S.mode!=='start'&&!S.workHome)connieLeave();},9000);
    sayQueue([['Connie','Houg, es ist sieben! Dein Truck steht vor dem Haus. YPS wartet nicht.',4200],['Houg','Ich fahre ja schon.',2200]]);
  }
  if(S.assigned&&!S.evaluated&&!S.workHome&&m>=S.tBack){S.evaluated=true;if(S.cLeft)connieReturn();}
  if(S.assigned&&!S.workHome&&!S.arrived&&S.dayMode===null&&m>=11*60){
    S.dayMode='absent';workMod(-20);S.workHome=true;S.assigned=false;S.evaluated=false;
    say('Chef Mahler','Houg! Es ist elf Uhr und Sie sind weder da noch krank gemeldet! Das hat Konsequenzen!',5600);
    banner('UNENTSCHULDIGT','Arbeitssituation −20 · Connie hat Aufgaben für dich','#ff7b7b');SND.buzz();
  }
  if(S.shift&&!S.shiftOver&&m>=18*60)shiftEnd();
  if(S.work<=10&&!S.warnedLow&&S.mode==='play'){S.warnedLow=true;say('Chef Mahler','Ihre Arbeitssituation ist katastrophal, Houg. Lohn nur noch 60 %. Reißen Sie sich zusammen.',5200);}
  if(S.work>30)S.warnedLow=false;
}
function shiftEnd(){
  S.shiftOver=true;
  const left=pendingStops();
  if(left.length){workMod(-2*left.length);left.forEach(s=>s.done=true);S.carryStop=null;setCarry(null);
    banner('FEIERABEND',left.length+' Paket(e) nicht zugestellt · Arbeit −'+(2*left.length),'#ff7b7b');SND.buzz();}
  else banner('FEIERABEND','18:00 Uhr · Schönen Abend, Houg!','#8ee26b');
  S.shift=null;clearStopMarks();
}
function workNewDay(){
  clearStopMarks();S.dayMode=null;S.workHome=false;S.shift=null;S.carryStop=null;S.arrived=false;S.shiftOver=false;S.shiftN=0;S.noLate=false;S.cLeft=false;
  S.vac=S.vac.filter(d=>d>=S.day);BINS.forEach(b=>{b.until=0;});
  if(!isWorkday())S.dayMode='free';
  truckReset();
}
function workStart(){
  S.ch3=true;
  if(isWorkday()){
    // unter der Woche: laufende Quests und Streiche abbrechen, der Tag wird übersprungen
    S.todo=[];S.task=null;setCarry(null);clearStepProp();marker.visible=false;if(S.prank)prankEnd(false);
    S.assigned=true;S.evaluated=true;S.dayMode='free';
    banner('KAPITEL 3 · YPS','Aufgaben abgebrochen · der Tag wird übersprungen, morgen beginnt die Arbeit','#f5c542');
    say('Connie','Houg, YPS hat angerufen! Du fängst morgen an. Schlaf dich aus.',4600);
    setTimeout(()=>{if(S.mode==='play')endDay(true);},4800);
  }else{
    sayQueue([['Connie','Houg, YPS hat angerufen. Du fängst am Montag um sieben an!',4600],['Houg','Dann habe ich noch das Wochenende.',2600]]);
    banner('KAPITEL 3 · YPS','Am Montag beginnt die Arbeit · bis dahin gelten noch Connies Aufgaben','#f5c542');
  }
}
/* Morgens an einem Arbeitstag: zur Arbeit gehen oder krank melden (außer bei Urlaub) */
function workMorning(){
  if(S.vac.includes(S.day)){
    say('Connie','Guten Morgen, Schatz! Du hast heute Urlaub. Das Haus freut sich schon.',4200);
    setTimeout(()=>banner('URLAUB','Heute frei · Connie hat Aufgaben für dich','#8ee26b'),2900);
    return;
  }
  sayQueue([['Connie','Guten Morgen, Houg! Heute ist ein Arbeitstag.',3000],['Houg','Geh zur Arbeit oder melde dich telefonisch krank.',3600]]);
  setTimeout(()=>banner('GEH ZUR ARBEIT ODER MELDE DICH KRANK','Truck vor dem Haus (E) · oder Telefon: Krank melden','#f5c542'),2900);
}

/* ===== Sichtbare Zustellziele: Leuchtsäule, Paket und Beschriftung über jedem Ziel ===== */
const STOPMARKS=new THREE.Group();scene.add(STOPMARKS);
function labelSprite(text,num){
  const cv=document.createElement('canvas');cv.width=512;cv.height=128;const c=cv.getContext&&cv.getContext('2d');
  if(c){c.fillStyle='rgba(20,14,6,.82)';c.fillRect(0,0,512,128);c.strokeStyle='#f2b705';c.lineWidth=8;c.strokeRect(4,4,504,120);
    c.fillStyle='#f2b705';c.font='bold 70px Arial, sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(String(num),54,66);
    c.fillStyle='#fff';c.font='bold 40px Arial, sans-serif';c.fillText(text,290,66);}
  const tx=new THREE.CanvasTexture(cv);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tx,transparent:true,depthTest:false}));sp.scale.set(7,1.75,1);sp.renderOrder=10;return sp;
}
function clearStopMarks(){while(STOPMARKS.children.length)STOPMARKS.remove(STOPMARKS.children[0]);}
function buildStopMarks(){
  clearStopMarks();if(!S.shift)return;
  S.shift.stops.forEach((st,i)=>{
    const g=new THREE.Group();g.position.set(st.x,0,st.z);
    const beam=new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.35,12,10,1,true),new THREE.MeshBasicMaterial({color:0xf2b705,transparent:true,opacity:0.32,depthWrite:false}));beam.position.y=6;g.add(beam);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(1.1,0.1,6,24),new THREE.MeshBasicMaterial({color:0xf2b705}));ring.rotation.x=Math.PI/2;ring.position.y=0.1;g.add(ring);
    const icon=makeItem('parcel');icon.scale.setScalar(1.8);icon.position.y=3.2;g.add(icon);
    const lab=labelSprite(st.label,i+1);lab.position.y=5.2;g.add(lab);
    g.userData={beam,ring,icon,st};st.mark=g;STOPMARKS.add(g);
  });
}
function stopMarkStep(dt){
  for(const g of STOPMARKS.children){
    const u=g.userData,st=u.st;g.visible=!st.done;if(st.done)continue;
    u.icon.rotation.y+=dt*1.8;u.icon.position.y=3.2+Math.sin(performance.now()/400+g.position.x)*0.25;
    const cur=st===S.carryStop;
    u.beam.material.color.setHex(cur?0x5be37a:0xf2b705);u.ring.material.color.setHex(cur?0x5be37a:0xf2b705);
  }
}

/* ===== Mülleimer durchsuchen ===== */
const BINS=[
  {x:-12.9,z:-3.3,n:'Altpapier-Tonne'},{x:-12.9,z:5.6,n:'Altglas-Container'},
  {x:-13.4,z:30,n:'Mülleimer am Späti'},{x:-21.4,z:17,n:'Mülleimer an der Bäckerei'},{x:-21.4,z:-29,n:'Mülleimer am Markt'},
  {x:-41.6,z:-77.2,n:'Müllcontainer bei YPS'},{x:-77.2,z:-16,n:'Mülleimer in der Westallee'},{x:-82.8,z:24,n:'Mülleimer in der Westallee'}
];
for(const b of BINS.slice(2)){cylS(OUT,0.32,0.28,0.85,10,0x4b5560,b.x,0,b.z);cylS(OUT,0.35,0.35,0.07,10,0x2e353d,b.x,0.85,b.z);block(b.x-0.33,b.z-0.33,b.x+0.33,b.z+0.33);}
const FOUND_FOOD=[['ein halbes Sandwich',12],['einen angebissenen Apfel',6],['eine Brezel von gestern',10],['eine Pizzaecke',14],['eine Tüte Chips',9]];
function binSearch(b){
  const now=S.day*1440+S.minutes;
  if(b.until&&now<b.until){say('Houg','Hier habe ich schon alles durchwühlt.',2000);return;}
  b.until=now+6*60;
  const r=Math.random();playOnce(player,'scratch',1.6);
  const night=S.minutes>=20*60||S.minutes<6*60;
  if(r<0.30){const v=1+Math.floor(Math.random()*8);S.money+=v;SND.click(760);banner('$'+v+' GEFUNDEN!','im '+b.n+' · +$'+v,'#f5c542');hLine('bin_money',2200);}
  else if(r<0.50){binItem(night);}
  else if(r<0.72){const f=pick(FOUND_FOOD);S.hunger=Math.min(100,S.hunger+f[1]);S.hygiene=Math.max(0,S.hygiene-2);SND.eat();banner('ESSEN GEFUNDEN','Du isst '+f[0]+' · Hunger +'+f[1],'#ff9d3d');hLine('bin_food',2200);}
  else{S.hygiene=Math.max(0,S.hygiene-3);SND.buzz();banner('NUR MÜLL','Nichts Brauchbares · Hygiene −3','#9aa0a8');hLine('bin_trash',2200);}
}
BINS.forEach((b,i)=>STATIC_INTER.push({id:'bin'+i,x:b.x,z:b.z,r:1.7,prio:2.5,
  label:()=>{if(TRK.mounted)return null;const now=S.day*1440+S.minutes;return (b.until&&now<b.until)?b.n+' (heute schon durchsucht)':b.n+' durchsuchen (E halten)';},
  hold:()=>{const now=S.day*1440+S.minutes;return (b.until&&now<b.until)?0:1.1;},use:()=>binSearch(b)}));

/* ===== Interaktionen: Truck, Brett, Snackautomat, Zustellung ===== */
STATIC_INTER.push(
 {id:'truck',get x(){return TRK.x;},get z(){return TRK.z;},r:4.4,prio:1.2,blip:'#f2b705',
  label:()=>{if(TRK.mounted||BIKE.mounted)return null;return S.chapter>=3?'In den Truck steigen (E oder X)':'YPS-Truck (ab Kapitel 3)';},
  use:()=>{if(S.chapter<3){say('Houg','Der Truck gehört YPS. Mein Job beginnt erst in Kapitel 3.',3000);return;}truckIn();}},
 {id:'board',x:-45,z:-89.3,r:2.0,prio:3.4,blip:'#f2b705',label:()=>TRK.mounted?null:'Schichtplan-Brett: Route holen & Urlaub (E)',use:()=>{if(S.chapter<3){say('Houg','Ein Brett mit Zetteln. Interessant.',2200);return;}openBoard();}},
 {id:'snack',x:-39.4,z:-85.2,r:1.7,prio:3.3,blip:'#ff9d3d',label:()=>TRK.mounted?null:(S.money>=2?'Snackautomat ($2–3)':'Snackautomat (zu wenig Geld)'),
  use:()=>{
    if(S.money<2){say('Houg','Der Automat will Geld. Ich habe keins.',2200);SND.buzz();return;}
    const it=pick([['Schokoriegel',2,12,0],['Erdnüsse',2,10,0],['Chips',3,16,0],['Cola',2,6,10]]);
    if(S.money<it[1]){say('Houg','Das ist mir zu teuer.',1800);SND.buzz();return;}
    S.money-=it[1];S.hunger=Math.min(100,S.hunger+it[2]);S.urge=Math.min(100,S.urge+it[3]);SND.eat();
    hLine('snack',2200);
    banner('SNACKAUTOMAT',it[0]+' · Hunger +'+it[2]+' · −$'+it[1],'#ff9d3d');
    if(Math.random()<0.15){S.money+=2;say('Houg','Er hat mir das Wechselgeld doppelt gegeben!',2400);}
  }},
 {id:'deliver',get x(){return S.carryStop?S.carryStop.x:99999;},get z(){return S.carryStop?S.carryStop.z:99999;},r:2.0,prio:5,
  get blip(){return S.carryStop?'#f5c542':null;},
  label:()=>(S.carryStop&&!S.carryStop.done&&!TRK.mounted)?'Paket abliefern: '+S.carryStop.label+' (+$'+Math.round(PAY_CLEAN*wageMult())+')':null,
  use:()=>{const s=S.carryStop;if(!s)return;playOnce(player,'checkout',1.6);resolveStop(s,'clean');if(Math.random()<0.2)aLine('danke');}}
);
function workInter(){
  const L=[];
  if(S.shift)for(const s of pendingStops())if(s!==S.carryStop)L.push({id:'ws',x:s.x,z:s.z,r:0.1,prio:0,blip:'#f5c542',quest:true,label:()=>null,use(){}});
  return L;
}

/* ===== HUD, Ziele, Balken ===== */
function workObjective(){
  if(S.chapter<3)return null;
  if(S.workHome||!isWorkday())return null;
  if(S.shift&&pendingStops().length){
    if(S.carryStop)return 'Paket abliefern: '+S.carryStop.label+' (oder X: zurück in den Truck)';
    return 'Route '+S.shift.route.id+': '+cargoCount()+' Pakete · nächstes Ziel '+(nearestStop(P.x,P.z,null)||{s:{label:'-'}}).s.label+' · T wirft, X steigt aus';
  }
  if(S.shiftOver||S.minutes>=18*60)return 'Feierabend. Fahr nach Hause.';
  if(S.shift&&S.shift.finished)return 'Route fertig · zurück zu YPS (neue Route am Brett) oder Feierabend';
  if(!S.arrived&&!TRK.mounted)return 'Geh zur Arbeit (Truck vor dem Haus, E) oder melde dich per Telefon krank';
  if(!S.arrived)return 'Fahre zu YPS (Nordring) und prüfe den Schichtplan';
  return 'Prüfe den Schichtplan im YPS-Büro';
}
function workTarget(){
  if(S.chapter<3||S.workHome||!isWorkday())return null;
  if(S.carryStop&&!S.carryStop.done)return {x:S.carryStop.x,z:S.carryStop.z,fl:0,label:(S.shift.stops.indexOf(S.carryStop)+1)+'. '+S.carryStop.label};
  if(S.shift&&pendingStops().length){const n=nearestStop(P.x,P.z,null);if(n)return {x:n.s.x,z:n.s.z,fl:0,label:(S.shift.stops.indexOf(n.s)+1)+'. '+n.s.label};}
  if(S.shiftOver||S.minutes>=18*60)return null;
  if(!TRK.mounted&&!S.arrived&&Math.hypot(P.x-TRK.x,P.z-TRK.z)>6)return {x:TRK.x,z:TRK.z,fl:0,label:'Truck'};
  if(!S.arrived||!S.shift||S.shift.finished)return {x:inYPS(P.x,P.z)?-45:YPS.dx,z:inYPS(P.x,P.z)?-89.3:YPS.dz,fl:0,label:inYPS(P.x,P.z)?'Schichtplan':'YPS'};
  return null;
}
function workQuestHTML(){
  if(!S.shift||S.chapter<3)return '';
  const s=S.shift;
  let h='<div class="qh"><em>ROUTE '+s.route.id+'</em> · '+s.name+'</div>';
  s.stops.forEach((st,i)=>{h+='<div class="qs '+(st.done?'done':(st===S.carryStop?'cur':''))+'"><span>'+(st.done?'✔':(st===S.carryStop?'➤':'○'))+'</span><span>'+(i+1)+'. '+st.label+'</span></div>';});
  h+='<div class="qd">Schicht bis 18:00 Uhr · bisher $'+s.paid+' verdient</div>';
  return h;
}
function workHUD(it){
  if(S.chapter>=3){$('barW').hidden=false;$('bW').style.width=clamp(S.work,0,100)+'%';}
  if(TRK.mounted&&!it){
    const kmh=Math.round(Math.abs(TRK.v)*3.6*1.2);
    $('prompt').innerHTML=(pendingStops().length?'<kbd>T</kbd>Paket werfen ('+Math.max(0,cargoCount())+' an Bord) · ':'')+'<kbd>X</kbd>aussteigen · '+kmh+' km/h';
  }
  // Statusbalken blinken unter 30 % (Harndrang: über 70 %, dort ist wenig gut)
  const bar=(id,low)=>{const e=$(id);if(e&&e.parentNode&&e.parentNode.parentNode)e.parentNode.parentNode.classList.toggle('low',low);};
  bar('bH',S.health<30);bar('bF',S.hunger<30);bar('bM',S.mood<30);bar('bU',S.urge>70);bar('bY',S.hygiene<30);bar('bS',S.social<30);bar('bW',S.chapter>=3&&S.work<30);
}
function workRoom(x,z){
  if(P.fl!==0)return null;
  if(inYPS(x,z))return 'YPS-BÜRO';
  if(x>YPS.x0-9&&x<YPS.x1+9&&z<-74&&z>-96)return 'YPS-HOF';
  if(x<-76&&x>-84)return 'WESTALLEE';
  if(z<-69&&z>-75)return 'NORDRING';
  if(z>69&&z<75)return 'SÜDRING';
  if(x<-60)return 'WESTALLEE';
  return null;
}
/* Ankunft bei YPS, Sonne folgt dem Spieler in der Ferne, Projektile */
function workStep(dt){
  if(!S.arrived&&S.chapter>=3&&S.dayMode===null&&inYPS(P.x,P.z)&&isWorkday()&&!S.workHome){
    S.arrived=true;banner('BEI YPS','Prüfe den Schichtplan am Brett an der Nordwand','#f5c542');
    say('Dean',pick(['Morgen, Houg! Mahler ist schon wieder schlecht drauf.','Da bist du ja. Das Brett hängt hinten, Schichtplan ansehen.']),3800);
  }
  YROOF.visible=!inYPS(P.x,P.z);
  projStep(dt);stopMarkStep(dt);
  {const far=Math.abs(P.x)>22||Math.abs(P.z)>18||P.x>12;
   let sx=4,sz=0;
   if(far){sx=Math.round(P.x/4)*4;sz=Math.round(P.z/4)*4;}
   if(sun.target.position.x!==sx||sun.target.position.z!==sz){sun.position.set(sx+14,30,sz+14);sun.target.position.set(sx,0,sz);sun.target.updateMatrixWorld();}}
  truckSyncCol();
}
