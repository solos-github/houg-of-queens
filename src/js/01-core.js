/* ---------- Kern: Helfer, Renderer, Licht, Figuren, Audio ---------- */
const $=id=>document.getElementById(id);
const rand=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const angLerp=(a,b,t)=>{let d=((b-a+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;return a+d*t;};

const canvas=$('c');
let renderer;
try{
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,logarithmicDepthBuffer:true});
}catch(e){
  document.body.insertAdjacentHTML('beforeend','<div class="ov"><h2>WebGL wird nicht unterstützt</h2><p>Bitte einen aktuellen Browser mit aktivierter Hardwarebeschleunigung nutzen.</p></div>');
  throw e;
}
const MOB=!!window.HOUG_MOBILE;
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,MOB?1.5:2));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;

const scene=new THREE.Scene();
const SKY_DAY=new THREE.Color(0x9ad0ff), SKY_NIGHT=new THREE.Color(0x1a1840), SKY_DUSK=new THREE.Color(0xff9c6b);
scene.background=SKY_DAY.clone();
scene.fog=new THREE.Fog(0x9ad0ff,60,160);
const camera=new THREE.PerspectiveCamera(60,1,0.45,220)   /* größerer Near-Wert: deutlich weniger Z-Fighting (Flackern) bei deckungsgleichen Flächen */;

const hemi=new THREE.HemisphereLight(0xffffff,0x6a5a48,0.75);
scene.add(hemi);
const sun=new THREE.DirectionalLight(0xfff2d6,0.85);
sun.position.set(18,30,14);
sun.target.position.set(4,0,0);
sun.castShadow=true;
sun.shadow.mapSize.set(MOB?2048:4096,MOB?2048:4096);   // feinere Schatten: 1,3 cm pro Pixel (weniger Zacken an Möbelkanten)
const sc=sun.shadow.camera; sc.left=-26;sc.right=26;sc.top=22;sc.bottom=-22;sc.near=1;sc.far=90;
sc.updateProjectionMatrix();
sun.shadow.bias=-0.0012;sun.shadow.normalBias=0.06;
scene.add(sun,sun.target);

function resize(){
  const w=$('stage').clientWidth||window.innerWidth, h=$('stage').clientHeight||window.innerHeight;
  renderer.setSize(w,h,false);
  camera.aspect=w/h; camera.updateProjectionMatrix();
}
window.addEventListener('resize',resize);
if(window.ResizeObserver) new ResizeObserver(resize).observe($('stage'));
resize();

/* ---------- Material & Bausteine ---------- */
const mats={};
function M(col){return mats[col]||(mats[col]=new THREE.MeshStandardMaterial({color:col,roughness:.95,metalness:0,flatShading:true}));}
/* y = Unterkante, Position in Eltern-Koordinaten */
function box(parent,w,h,d,col,x,y,z,shadow=true){
  const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(col));
  m.position.set(x,y+h/2,z);
  if(shadow){m.castShadow=true;m.receiveShadow=true;}else m.receiveShadow=true;
  parent.add(m);return m;
}
function cyl(parent,rt,rb,h,seg,col,x,y,z){
  const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),M(col));
  m.position.set(x,y+h/2,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
}

/* ---------- glatte Bausteine ---------- */
const msC={};
function MS(col,r=.8){const k=col+'_'+r;return msC[k]||(msC[k]=new THREE.MeshStandardMaterial({color:col,roughness:r,metalness:0}));}
function cylS(parent,rt,rb,h,seg,col,x,y,z,r){
  const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),MS(col,r));
  m.position.set(x,y+h/2,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
}
function sph(parent,rad,col,x,y,z,sx=1,sy=1,sz=1,r){
  const m=new THREE.Mesh(new THREE.SphereGeometry(rad,16,12),MS(col,r));
  m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;parent.add(m);return m;
}
/* ---------- Texturen (zur Laufzeit gezeichnet) ---------- */
function mkTex(w,h,fn,rx=1,ry=1){
  const cv=document.createElement('canvas');cv.width=w;cv.height=h;
  fn(cv.getContext('2d'),w,h);
  const t=new THREE.CanvasTexture(cv);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);t.anisotropy=4;return t;
}
function MT(map,r=.85){return new THREE.MeshStandardMaterial({map,roughness:r,metalness:0});}
function drawWood(c,w,h){
  c.fillStyle='#35241b';c.fillRect(0,0,w,h);const rows=8,rh=h/rows;
  for(let r=0;r<rows;r++){let x=-Math.random()*w*.5;
    while(x<w){const len=w*(.45+Math.random()*.5),sh=30+Math.floor(Math.random()*22);
      c.fillStyle='rgb('+(sh+26)+','+(sh+10)+','+(sh+2)+')';c.fillRect(x+1.5,r*rh+1.5,len-3,rh-3);
      c.strokeStyle='rgba(0,0,0,.2)';c.lineWidth=1;
      for(let k=0;k<5;k++){const y=r*rh+rh*(.15+.17*k);c.beginPath();c.moveTo(x+4,y);c.lineTo(x+len-4,y+(Math.random()-.5)*3);c.stroke();}
      x+=len;}}
}
function drawRug(c,w,h,base,accent){
  c.fillStyle='#e8d9ae';c.fillRect(0,0,w,h);
  c.fillStyle='#23325f';c.fillRect(w*.03,h*.04,w*.94,h*.92);
  c.fillStyle=base;c.fillRect(w*.075,h*.09,w*.85,h*.82);
  c.save();c.beginPath();c.rect(w*.075,h*.09,w*.85,h*.82);c.clip();
  c.strokeStyle=accent;c.lineWidth=3;
  for(let i=-12;i<16;i++){const x=w*.075+i*w*.07;
    c.beginPath();c.moveTo(x,h*.09);c.lineTo(x+h*.82,h*.91);c.stroke();
    c.beginPath();c.moveTo(x,h*.91);c.lineTo(x+h*.82,h*.09);c.stroke();}
  c.translate(w/2,h/2);c.scale(1.7,1);
  c.fillStyle='#23325f';c.beginPath();c.arc(0,0,h*.26,0,7);c.fill();
  c.fillStyle='#e8d9ae';c.beginPath();c.arc(0,0,h*.19,0,7);c.fill();
  c.fillStyle=base;c.beginPath();c.arc(0,0,h*.12,0,7);c.fill();
  c.restore();
  c.fillStyle='#e8d9ae';for(let i=0;i<40;i++){c.fillRect(i*w/40+1,0,w/80,4);c.fillRect(i*w/40+1,h-4,w/80,4);}
}
function drawGingham(c,w,h){
  c.fillStyle='#fff';c.fillRect(0,0,w,h);const n=8,s=w/n;
  c.fillStyle='rgba(205,40,50,.85)';
  for(let i=0;i<n;i++)for(let j=0;j<n;j++)if((i+j)%2===0)c.fillRect(i*s,j*s,s,s);
  c.fillStyle='rgba(205,40,50,.45)';
  for(let i=0;i<n;i++)for(let j=0;j<n;j++)if((i+j)%2===1)c.fillRect(i*s,j*s,s,s);
}
function drawConcrete(c,w,h){c.fillStyle='#8a8a8e';c.fillRect(0,0,w,h);for(let i=0;i<500;i++){const g=120+Math.random()*40;c.fillStyle='rgb('+g+','+g+','+(g+3)+')';c.fillRect(Math.random()*w,Math.random()*h,3,3);}}
function drawGrass(c,w,h){c.fillStyle='#5f9e4d';c.fillRect(0,0,w,h);for(let i=0;i<900;i++){const g=Math.random();c.fillStyle=g>.5?'#6aae56':'#528a42';c.fillRect(Math.random()*w,Math.random()*h,2,5);}}

/* ---------- Figuren (Cartoon-Proportionen nach den Charakterblättern) ---------- */
let ARGYLE=null;
function argyleMat(){
  if(!ARGYLE)ARGYLE=MT(mkTex(128,128,(c,w,h)=>{
    c.fillStyle='#575c3b';c.fillRect(0,0,w,h);
    const d=(x,y,r,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(x,y-r*1.5);c.lineTo(x+r,y);c.lineTo(x,y+r*1.5);c.lineTo(x-r,y);c.closePath();c.fill();};
    for(const [x,y] of [[w*.25,h*.25],[w*.75,h*.25],[w*.25,h*.75],[w*.75,h*.75]]){d(x,y,w*.2,'#8c8a62');d(x,y,w*.09,'#4b3340');}
    d(w*.5,h*.5,w*.2,'#4b3340');d(w*.5,h*.5,w*.09,'#8c8a62');
  },2,2),.95);
  return ARGYLE;
}
function makeHuman(o){
  const g=new THREE.Group(),body=new THREE.Group();g.add(body);
  const skin=o.skin||0xf2c4a0,bel=o.belly||1,wst=o.waist||1;
  const legs=[],arms=[];
  const sl=o.sleeve==='short'?.26:(o.sleeve==='three'?.42:.6),th=o.armThick||1;
  for(const sx of [-1,1]){
    const leg=new THREE.Group();leg.position.set(sx*0.16*bel,0.82,0);
    cylS(leg,0.135,0.105+(o.flare||0),0.8,12,o.pants,0,-0.8,0);
    sph(leg,0.12,o.shoe||0x222222,0,-0.77,0.07,1.05*(o.shoeScale||1),0.55*(o.shoeScale||1),1.8*(o.shoeScale||1));
    body.add(leg);legs.push(leg);
    const arm=new THREE.Group();arm.position.set(sx*0.45*bel*wst,1.5,0);
    cylS(arm,0.105*th,0.095*th,sl,10,o.shirt,0,-sl,0);
    if(sl<0.6)cylS(arm,0.088*th,0.075*th,0.6-sl,10,skin,0,-0.6,0);
    sph(arm,0.085*th,skin,0,-0.66,0);
    body.add(arm);arms.push(arm);
  }
  const torso=sph(body,0.42,o.shirt,0,1.14,0,bel*wst,1.25,0.7*bel);
  if(o.argyle)torso.material=argyleMat();
  sph(body,0.4,o.pants,0,0.86,0,bel*wst*0.95,0.5,0.7*bel);
  if(o.belt){
    const t=new THREE.Mesh(new THREE.TorusGeometry(0.4,0.026,6,22),MS(0x35200f));
    t.rotation.x=Math.PI/2;t.scale.set(bel*wst*0.98,0.72*bel,1);t.position.set(0,0.95,0);body.add(t);
    box(body,0.07,0.06,0.03,0xa8a8a8,0,0.92,0.29*bel,false);
  }
  if(o.pockets)for(const sx of [-1,1])box(body,0.15,0.15,0.03,o.pocket||o.shirt,sx*0.16*bel,1.36,0.275*bel,false);
  if(o.collar){for(const sx of [-1,1]){const c=box(body,0.14,0.09,0.04,o.collarCol||o.shirt,sx*0.1,1.58,0.19,false);c.rotation.z=-sx*0.5;}}
  if(o.undertee)box(body,0.15,0.1,0.03,0xe9e6e0,0,1.54,0.22,false);
  if(o.vneck)sph(body,0.1,skin,0,1.5,0.2,1,1.25,0.45);
  if(o.bust)for(const sx of [-1,1])sph(body,0.13,o.shirt,sx*0.13,1.3,0.2);
  cylS(body,0.075,0.085,0.15,8,skin,0,1.55,0);
  sph(body,0.29,skin,0,1.88,0,1,1.08,1);
  if(o.chin)sph(body,0.2,skin,0,1.66,0.09,1.25,0.7,1);
  sph(body,0.07*(o.nose||1),skin,0,1.83,0.285,1,1.15,1.15);
  for(const sx of [-1,1]){
    sph(body,0.08*(o.ears||1),skin,sx*0.29,1.88,0,0.5,1,0.8);
    sph(body,0.045,0xffffff,sx*0.1,1.93,0.255,1,1.1,0.5);
    sph(body,0.025,0x1a1210,sx*0.1,1.93,0.285);
    const b=box(body,0.13,0.03,0.03,o.brow||0x2a1c14,sx*0.1,2.0,0.27,false);b.rotation.z=sx*(o.tilt||0.08);
    if(o.hoops){const h=new THREE.Mesh(new THREE.TorusGeometry(0.045,0.009,6,12),MS(0xd9b85c,.4));h.position.set(sx*0.3,1.8,0.02);h.rotation.y=Math.PI/2;body.add(h);}
  }
  box(body,0.15,0.024,0.03,o.lips||0x9a4a3a,0,1.755,0.268,false);
  if(o.hair!==null&&o.hair!==undefined)sph(body,0.3,o.hair,0,1.99,-0.04,1,0.65,1.03);
  if(o.longHair){
    sph(body,0.3,o.hair,0,1.72,-0.14,1.05,1.35,0.75);
    for(const sx of [-1,1])sph(body,0.12,o.hair,sx*0.26,1.72,0.0,0.7,2.0,0.9);
    if(o.bangs)sph(body,0.2,o.hair,0.1,2.0,0.17,1.2,0.4,0.7);
  }
  if(o.sidehair){
    for(const sx of [-1,1])sph(body,0.1,o.sidehair,sx*0.27,1.93,-0.04,0.6,1.3,1);
    sph(body,0.2,o.sidehair,0,1.9,-0.2,1.1,0.6,0.4);
  }
  g.scale.setScalar(0.85*(o.scale||1));
  g.userData={legs,arms,body};
  return g;
}
function animWalk(g,t,amt,sp){
  if(g.userData.mixer){modelAnim(g,amt,sp);return;}
  const u=g.userData,s=Math.sin(t*9)*0.7*amt;
  u.legs[0].rotation.x=s;u.legs[1].rotation.x=-s;
  u.arms[0].rotation.x=-s;u.arms[1].rotation.x=s;
  u.body.position.y=Math.abs(Math.sin(t*9))*0.05*amt;
}
const LOOKS={
  dave:{shirt:0x6a4a33,pocket:0x5f4230,pants:0x4b3424,hair:0x3a261a,belly:1.3,armThick:1.3,sleeve:'short',shoe:0x1e1a18,shoeScale:1.3,
        pockets:true,belt:true,collar:true,undertee:true,nose:1.6,ears:1.1,chin:true,skin:0xf0b896,scale:1.05},
  connie:{shirt:0x6e2a45,pants:0x2b3550,flare:0.04,hair:0x4a2f22,longHair:true,bangs:true,hoops:true,sleeve:'three',belly:0.8,waist:0.85,
        shoe:0x5b4a3a,shoeScale:1.1,vneck:true,bust:true,lips:0xb5483f,skin:0xf3c9a6,nose:0.8,scale:0.97},
  archie:{shirt:0x5c6140,argyle:true,pants:0x6b5238,hair:null,sidehair:0xbdbdbd,belly:0.98,sleeve:'long',shoe:0x3a2a20,shoeScale:1.15,
        collar:true,collarCol:0xe6dcc0,belt:true,nose:1.7,ears:1.9,brow:0x3a3a3a,tilt:0.28,skin:0xe9b894,scale:0.95},
  dean:{shirt:0x2f9e44,pants:0x333333,hair:null,sidehair:0x222222,skin:0x8d5a3b,belly:1.08,sleeve:'short',shoe:0x222222,nose:1.1,ears:1,scale:1.1},
  spike:{shirt:0xd63c3c,pants:0x3a4a6a,hair:0xe6c35a,belly:1,sleeve:'short',shoe:0x222222,nose:1,ears:1,scale:1},
  benny:{shirt:0xf2c33d,pants:0x2a2a2a,hair:0x222222,belly:0.95,sleeve:'short',shoe:0x222222,nose:1.1,ears:1.1,scale:0.96}
};

/* ---------- Audio (einfache Synthesizer-Töne, startet nach Klick) ---------- */
let AC=null;
function audioInit(){
  if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){AC=null;}}
  if(AC&&AC.state==='suspended')AC.resume();
  if(AC&&typeof startMusic==='function')startMusic();
}
function tone(f,d=.15,type='square',v=.05,f2,delay=0){
  if(!AC)return;
  try{
    const t0=AC.currentTime+delay,o=AC.createOscillator(),g=AC.createGain();
    o.type=type;o.frequency.setValueAtTime(f,t0);
    if(f2)o.frequency.exponentialRampToValueAtTime(f2,t0+d);
    g.gain.setValueAtTime(v,t0);g.gain.exponentialRampToValueAtTime(0.0001,t0+d);
    o.connect(g);g.connect(AC.destination);o.start(t0);o.stop(t0+d+0.02);
  }catch(e){}
}
const SND={
  ding(){tone(880,.25,'sine',.07);tone(1320,.35,'sine',.06,0,.12);},
  bell(){tone(659,.45,'sine',.08);tone(523,.7,'sine',.08,0,.35);},
  win(){[523,659,784,1046].forEach((f,i)=>tone(f,.18,'square',.05,0,i*.09));},
  buzz(){tone(120,.3,'sawtooth',.07,60);},
  fart(){tone(95,.75,'sawtooth',.09,38);tone(130,.4,'square',.03,50,.1);},
  click(f=400){tone(f,.05,'square',.04);},
  eat(){tone(300,.08,'triangle',.07);tone(260,.08,'triangle',.07,0,.1);tone(340,.1,'triangle',.07,0,.2);},
  faint(){tone(300,.9,'sawtooth',.08,60);}
};
