/* ---------- Welt: Etagen, Wandsystem, Böden, Außenbereich ---------- */
const OUT=new THREE.Group();scene.add(OUT);              // Draußen
const W=new THREE.Group();scene.add(W);                  // Erdgeschoss
const U=new THREE.Group();U.position.y=2.9;scene.add(U); // Obergeschoss
const BM=new THREE.Group();BM.position.y=-2.9;scene.add(BM); // Keller
U.visible=false;BM.visible=false;
const colliders=[];
const wallMeshes={'-1':[],'0':[],'1':[]};
const radarWalls={'-1':[],'0':[],'1':[]};
let FL=0,GR=W;
function setFloor(f){FL=f;GR=f===1?U:(f===-1?BM:W);}
function block(x0,z0,x1,z1){const c={x0,x1,z0,z1,on:true,fl:FL};colliders.push(c);return c;}
const T=0.3,WALLH=2.9,TOPC=0xd8cdb8,BASEC=0xf3efe6,TRIM=0xf4f1ea;
const PINK=0xd9b0a2,YEL=0xe8cf8f,BRICK=0xa9553f,GREYW=0x9a948e,UPW=0xc9d4de,TILEW=0xb9dcdc,CREAM=0xe6d9bf;
function tbox(parent,w,h,d,mat,x,y,z){
  const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);
  m.position.set(x,y+h/2,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
}
function drawBrick(c,w,h){
  c.fillStyle='#cdc3b2';c.fillRect(0,0,w,h);
  const rows=16,bh=h/rows,bw=w/5;
  for(let r=0;r<rows;r++){
    const off=(r%2)*bw/2;
    for(let k=-1;k<6;k++){
      const x=k*bw+off,rnd=Math.random();
      const base=rnd<0.12?[110,52,44]:(rnd<0.35?[150,66,48]:[168,78,56]);
      const v=(Math.random()-0.5)*22;
      c.fillStyle='rgb('+Math.round(base[0]+v)+','+Math.round(base[1]+v*0.5)+','+Math.round(base[2]+v*0.5)+')';
      c.fillRect(x+1.5,r*bh+1.5,bw-3,bh-3);
    }
  }
}
const TXB=mkTex(256,256,drawBrick,1,1);
const _bm={};
function brickMat(len,h){
  const k=(Math.round(len*2)/2)+'x'+(Math.round(h*2)/2);
  if(!_bm[k]){const t=TXB.clone();t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(Math.max(0.3,len/1.6),Math.max(0.3,h/1.6));t.needsUpdate=true;
    _bm[k]=new THREE.MeshStandardMaterial({map:t,roughness:.95,metalness:0});}
  return _bm[k];
}
const GING=MT(mkTex(64,64,drawGingham,1,1));

/* Quader-Wandstück mit unterschiedlichen Farben je Seite; axis 'x' = Wand läuft entlang x (z=pos) */
function wbox(axis,a,b,y0,y1,pos,cs,th){
  // Wände entlang z sind 4 mm dünner und 3 mm niedriger: an den Ecken überlagern sich sonst die Wandenden deckungsgleich (Z-Fighting/Flackern)
  if(!th&&axis==='z'){th=T-0.004;if(y1>=WALLH)y1=WALLH-0.01;}
  th=th||T;const len=b-a,h=y1-y0;
  const geo=axis==='x'?new THREE.BoxGeometry(len,h,th):new THREE.BoxGeometry(th,h,len);
  const top=M(TOPC),A=cs[0]===BRICK?brickMat(len,h):M(cs[0]),B=cs[1]===BRICK?brickMat(len,h):M(cs[1]),E=M(0xcdbfa8);
  const m=new THREE.Mesh(geo,axis==='x'?[E,E,top,top,A,B]:[A,B,top,top,E,E]),c=(a+b)/2;
  if(axis==='x')m.position.set(c,y0+h/2,pos);else m.position.set(pos,y0+h/2,c);
  m.castShadow=true;m.receiveShadow=true;GR.add(m);return m;
}
function wrect(axis,s,t,pos){
  if(axis==='x'){block(s,pos-T/2,t,pos+T/2);radarWalls[FL].push([s,pos-T/2,t,pos+T/2]);}
  else{block(pos-T/2,s,pos+T/2,t);radarWalls[FL].push([pos-T/2,s,pos+T/2,t]);}
}
function wbase(axis,s,t,pos){
  const len=t-s,c=(s+t)/2,o=T/2+0.02;
  for(const sg of [-1,1]){
    if(axis==='x')box(GR,len,0.14,0.04,BASEC,c,0,pos+sg*o,false);
    else box(GR,0.036,0.137,len-0.006,BASEC,pos+sg*o,0,c,false);
  }
}
function windowDeco(axis,g0,g1,s0,s1,pos,opt){
  const c=(g0+g1)/2,len=g1-g0,inS=opt.inS||1;
  const glass=new THREE.Mesh(new THREE.PlaneGeometry(len,s1-s0),new THREE.MeshStandardMaterial({color:0xcfe6f7,transparent:true,opacity:.3,roughness:.1,side:THREE.DoubleSide}));
  if(axis==='x')glass.position.set(c,(s0+s1)/2,pos);
  else{glass.position.set(pos,(s0+s1)/2,c);glass.rotation.y=Math.PI/2;}
  GR.add(glass);
  const fm=[TRIM,TRIM],th=T+0.08,mid=(s0+s1)/2;
  wbox(axis,g0,g1,s0-0.05,s0+0.03,pos,fm,th);wbox(axis,g0,g1,s1-0.03,s1+0.05,pos,fm,th);
  const np_=len>3?3:2;for(let i=1;i<np_;i++){const mc=g0+len*i/np_;wbox(axis,mc-0.03,mc+0.03,s0,s1,pos,fm,T+0.04);}
  wbox(axis,g0-0.12,g1+0.12,s0-0.1,s0-0.02,pos,[0xd9d2c3,0xd9d2c3],T+0.24);
  wbox(axis,g0,g0+0.06,s0,s1,pos,fm,th);wbox(axis,g1-0.06,g1,s0,s1,pos,fm,th);
  wbox(axis,g0,g1,mid-0.02,mid+0.02,pos,fm,T+0.04);
  const cm=opt.ging?GING:M(0xf1eee8),off=inS*(T/2+0.07);
  for(const [a,b] of [[g0-0.4,g0+0.05],[g1-0.05,g1+0.4]]){
    const h=s1-s0+0.55,y=s0-0.3;
    const m=axis==='x'?new THREE.Mesh(new THREE.BoxGeometry(b-a,h,0.06),cm):new THREE.Mesh(new THREE.BoxGeometry(0.06,h,b-a),cm);
    if(axis==='x')m.position.set((a+b)/2,y+h/2,pos+off);else m.position.set(pos+off,y+h/2,(a+b)/2);
    m.castShadow=true;GR.add(m);
  }
}
/* gaps: [von,bis] = Tür; [von,bis,'w',y0,y1] = Fenster; [von,bis,'p',y0,y1] = Durchreiche */
function wall(axis,pos,a,b,gaps,cs,opt){
  opt=opt||{};const e=T/2;
  const ee=e-0.012;   // Wandenden enden 1,2 cm vor der Gegenfläche der Nachbarwand: nie deckungsgleich -> kein Flackern an Ecken      // z-Wände enden 3 mm vor den x-Wänden: Eckflächen liegen nicht mehr deckungsgleich
  let cur=a-(opt.extA===false?0:ee);const end=b+(opt.extB===false?0:ee);
  const seg=(s,t)=>{if(t-s<0.02)return;wallMeshes[FL].push(wbox(axis,s,t,0,WALLH,pos,cs));wbase(axis,s,t,pos);wrect(axis,s,t,pos);};
  for(const g of gaps){
    const g0=g[0],g1=g[1],kind=g[2];
    seg(cur,g0);
    if(!kind){
      wallMeshes[FL].push(wbox(axis,g0,g1,2.35,WALLH,pos,cs));
      const fm=[TRIM,TRIM];
      wbox(axis,g0,g0+0.08,0,2.35,pos,fm,T+0.08);wbox(axis,g1-0.08,g1,0,2.35,pos,fm,T+0.08);wbox(axis,g0,g1,2.3,2.38,pos,fm,T+0.08);
    }else{
      const s0=g[3]===undefined?0.95:g[3],s1=g[4]===undefined?2.25:g[4];
      wallMeshes[FL].push(wbox(axis,g0,g1,0,s0,pos,cs));wallMeshes[FL].push(wbox(axis,g0,g1,s1,WALLH,pos,cs));
      wrect(axis,g0,g1,pos);
      if(kind==='w')windowDeco(axis,g0,g1,s0,s1,pos,opt);
    }
    cur=g1;
  }
  seg(cur,end);
}

/* ---------- Texturen ---------- */
const TX_WOOD=mkTex(512,512,drawWood,8,5.2);
const TX_WOOD_UP=mkTex(512,512,(c,w,h)=>{drawWood(c,w,h);c.fillStyle='rgba(255,230,190,.25)';c.fillRect(0,0,w,h);},6,5);
const TX_CONC=mkTex(128,128,drawConcrete,10,5);
const TX_GRASS=mkTex(128,128,drawGrass,70,70);
const TX_RUGB=mkTex(64,64,(c,w,h)=>{c.fillStyle='#6b4a32';c.fillRect(0,0,w,h);for(let i=0;i<220;i++){c.fillStyle=Math.random()>.5?'#745238':'#61432c';c.fillRect(Math.random()*w,Math.random()*h,2,2);}},1,1);
const TX_RUG1=mkTex(512,384,(c,w,h)=>drawRug(c,w,h,'#9b2f3b','#c98a6a'),1,1);
const TX_RUG2=mkTex(512,384,(c,w,h)=>drawRug(c,w,h,'#b3425a','#d6a07a'),1,1);
const TX_RUG3=mkTex(512,384,(c,w,h)=>drawRug(c,w,h,'#8a3340','#c98a6a'),1,1);
const TX_TILE=mkTex(128,128,(c,w,h)=>{c.fillStyle='#e8f0f0';c.fillRect(0,0,w,h);c.strokeStyle='#b8c8c8';c.lineWidth=3;c.strokeRect(1,1,w-2,h-2);},10,6);
const TX_TILE_B=mkTex(128,128,(c,w,h)=>{c.fillStyle='#7b979c';c.fillRect(0,0,w,h);c.strokeStyle='#50686d';c.lineWidth=3;c.strokeRect(1,1,w-2,h-2);},10,6);
const TX_CARPET=mkTex(64,64,(c,w,h)=>{c.fillStyle='#7d8ba1';c.fillRect(0,0,w,h);for(let i=0;i<300;i++){c.fillStyle=Math.random()>.5?'#8794a8':'#707e94';c.fillRect(Math.random()*w,Math.random()*h,2,2);}},8,6);

/* ---------- Außenbereich (Straße im Westen, Hinterhof im Osten) ---------- */
setFloor(0);
/* Rasen in Stücken, damit über dem Kellerabgang (x 4.0–5.9, z −11.0 … −8.0) ein Loch bleibt */
const GRASS_HOLE={x0:4.0,x1:5.9,z0:-11.0,z1:-8.0};
const grassPieces=[];
function grassPiece(x0,x1,z0,z1){
  const t=TX_GRASS.clone();t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(70*(x1-x0)/240,70*(z1-z0)/240);t.needsUpdate=true;
  const m=tbox(OUT,x1-x0,0.4,z1-z0,MT(t,1),(x0+x1)/2,-0.45,(z0+z1)/2);grassPieces.push(m);return m;
}
const grassMesh=grassPiece(-120,120,GRASS_HOLE.z1,120);
grassPiece(-120,120,-120,GRASS_HOLE.z0);grassPiece(-120,GRASS_HOLE.x0,GRASS_HOLE.z0,GRASS_HOLE.z1);grassPiece(GRASS_HOLE.x1,120,GRASS_HOLE.z0,GRASS_HOLE.z1);
box(OUT,6,0.02,240,0x4a4d57,-17.4,-0.05,0,false);
box(OUT,2.4,0.04,240,0xb9b6ad,-13.2,-0.05,0,false);
box(OUT,2.4,0.04,240,0xb9b6ad,-21.6,-0.05,0,false);
box(OUT,3.2,0.04,2.3,0xc9c5b8,-10.6,-0.05,0,false);
for(let z=-90;z<=90;z+=6)box(OUT,0.18,0.01,2.4,0xf0d26a,-17.4,-0.03,z,false);
box(OUT,1.3,0.12,2.4,0xbab5aa,-9.7,-0.05,0,false);   // Türstufe
function tree(x,z,s){
  s=s||1;cylS(OUT,0.18*s,0.26*s,1.5*s,8,0x6e4a2a,x,0,z);
  const a=new THREE.Mesh(new THREE.ConeGeometry(1.4*s,2.4*s,9),MS(0x2f8f4a));a.position.set(x,2.0*s,z);a.castShadow=true;OUT.add(a);
  const b=new THREE.Mesh(new THREE.ConeGeometry(1.05*s,2.0*s,9),MS(0x3aa85b));b.position.set(x,3.2*s,z);b.castShadow=true;OUT.add(b);
}
for(const [x,z,s] of [[14,10,1],[22,2,1.2],[16,-14,1.1]])tree(x,z,s);
function nbHouse(x,z,col,roof,face){
  box(OUT,7,4.2,8,col,x,0,z);
  const r=new THREE.Mesh(new THREE.ConeGeometry(6.4,2.8,4),MS(roof));r.position.set(x,5.6,z);r.rotation.y=Math.PI/4;r.castShadow=true;OUT.add(r);
  for(const dz of [-2.2,2.2])box(OUT,0.1,1.5,1.2,0x7fb5d6,x+face*3.55,1.3,z+dz,false);
  box(OUT,0.1,2.1,1.0,0x6b4a2f,x+face*3.55,0,z,false);
}
nbHouse(24,-19,0xb7c9d9,0x6b4a2f,-1);nbHouse(24,10,0xd9b38c,0x4a5b6b,-1);
{const g=new THREE.Group();g.position.set(-12.9,0,3.6);OUT.add(g);cylS(g,0.36,0.3,0.9,10,0x6b7078,0,0,0);cylS(g,0.39,0.39,0.08,10,0x555a60,0,0.9,0);}
/* Fliegengitter-Tür-Rampe etc. entfällt; Rasen hinter dem Haus bleibt frei */

/* ---------- Böden ---------- */
const slab=tbox(W,18.6,0.4,12.6,MT(TX_WOOD,.9),0,-0.4,0);   // Erdgeschoss (Dielen)
