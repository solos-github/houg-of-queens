/* ---------- Außenansicht: Dach, Gesims, Vordach, Vorgarten, Nachbarschaft ---------- */
setFloor(0);
const ROOF=new THREE.Group();scene.add(ROOF);          // Dach nur sichtbar, wenn man draußen ist
const SHINGLE=new THREE.MeshStandardMaterial({color:0x797b82,roughness:.95,side:THREE.DoubleSide,flatShading:true});
const WHITE=0xf3f0e8,STONE=0x857b70;

/* Walmdach: First entlang x (w > d) */
function hipRoof(parent,w,d,h,ov,x,y,z){
  const hw=w/2+ov,hd=d/2+ov,r=(w-d)/2;
  const v=[[-hw,0,-hd],[hw,0,-hd],[hw,0,hd],[-hw,0,hd],[-r,h,0],[r,h,0]];
  const idx=[0,1,5, 0,5,4,  2,3,4, 2,4,5,  3,0,4,  1,2,5];
  const pos=[];for(const i of idx)pos.push(...v[i]);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.computeVertexNormals();
  const m=new THREE.Mesh(g,SHINGLE);m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;
}
/* Fenster/Türen als aufgesetzte Flächen an der Fassade (lokal: Fassade bei x=-hd, zeigt nach -x) */
function paneSet(g,hd,z,w,y0,h,n,glass){
  box(g,0.06,h+0.18,w+0.18,WHITE,-hd-0.03,y0-0.09,z,false);
  const pw=(w-0.06*(n+1))/n;
  for(let i=0;i<n;i++)box(g,0.08,h,pw,glass||0x9fb2c0,-hd-0.045,y0,z-w/2+0.06+pw/2+i*(pw+0.06),false);
  box(g,0.1,0.04,w+0.4,0xd9d2c3,-hd-0.08,y0-0.13,z,false);     // Fensterbank
}
function doorSet(g,hd,z,y0){
  box(g,0.06,2.3,1.15,WHITE,-hd-0.03,y0,z,false);
  box(g,0.09,2.15,0.95,0x6b4423,-hd-0.05,y0,z,false);
  box(g,0.1,0.8,0.55,0xbfd8e6,-hd-0.07,y0+1.1,z,false);
}
function stoop(g,hd,z,n,stepH){
  for(let k=0;k<n;k++){
    box(g,0.34,stepH*(k+1),1.9,0x9c4b39,-hd-0.2-0.34*(n-1-k),0,z,false);
    box(g,0.36,0.04,2.0,0xb5aca0,-hd-0.2-0.34*(n-1-k),stepH*(k+1),z,false);
  }
  for(const sz of [-1,1]){
    const zz=z+sz*1.0,top=stepH*n+0.9;
    const L=Math.hypot(0.34*n,top-0.9);
    const rail=box(g,L,0.04,0.04,0xcfd3d6,-hd-0.2-0.34*(n-1)/2,0.9+stepH*n/2,zz,false);rail.rotation.z=-Math.atan2(stepH*n,0.34*n)*-1;
    for(let k=0;k<=n;k+=2)box(g,0.035,0.9+stepH*k,0.035,0xcfd3d6,-hd-0.2-0.34*(n-1-k)+0.17,0,zz,false);
  }
}
/* Gesims-Vordach über dem Erdgeschoss, Dach, Gaube */
function roofSet(g,hd,hw){
  const band=box(g,1.2,0.1,hw*2+0.9,0x6f7177,-hd-0.55,2.82,0,false);band.rotation.z=0.12;
  box(g,0.06,0.2,hw*2+0.9,WHITE,-hd-1.12,2.72,0,false);
  hipRoof(g,hd*2,hw*2,2.6,0.75,0,5.8,0);
  const ov=0.75;
  box(g,0.07,0.22,hw*2+ov*2,WHITE,-hd-ov,5.7,0,false);box(g,0.07,0.22,hw*2+ov*2,WHITE,hd+ov,5.7,0,false);
  box(g,hd*2+ov*2,0.22,0.07,WHITE,0,5.7,-hw-ov,false);box(g,hd*2+ov*2,0.22,0.07,WHITE,0,5.7,hw+ov,false);
  // Gaube mit Doppelfenster
  const dx=-hd+1.4;
  box(g,2.0,1.7,2.4,0xe7e2d6,dx+1.0,6.0,0);
  box(g,0.06,1.1,1.9,WHITE,dx-0.02,6.25,0,false);
  for(const sz of [-1,1])box(g,0.08,0.95,0.78,0x9fb2c0,dx-0.04,6.32,sz*0.46,false);
  const dr=box(g,2.8,0.1,2.9,0x6f7177,dx+1.0,7.62,0,false);dr.rotation.z=0.16;
  box(g,0.06,0.18,2.9,WHITE,dx-0.38,7.5,0,false);
}
function trimFoundation(g,hd,hw,z0,z1){
  box(g,0.12,0.7,z1-z0,STONE,-hd-0.06,0,(z0+z1)/2,false);
}

/* ----- unser Haus: Fassade ergänzen ----- */
{
  const hd=9.3,hw=6.3;
  roofSet(ROOF,hd,hw);
  // Fundament, Kellerfenster, Briefkasten, Stufen mit Geländer
  box(OUT,0.12,0.75,hw-0.9,STONE,-9.36,0,-(hw+0.9)/2,false);box(OUT,0.12,0.75,hw-0.9,STONE,-9.36,0,(hw+0.9)/2,false);   // Fundament mit Lücke an der Tür
  for(const z of [-3.6,3.0]){box(OUT,0.14,0.35,1.1,0x2c3a46,-9.4,0.18,z,false);box(OUT,0.16,0.04,1.3,0xd9d2c3,-9.41,0.14,z,false);}
  box(OUT,0.14,0.28,0.4,0x1d1d1d,-9.42,1.4,-1.35,false);
  stoop(OUT,hd,0,3,0.06);
  paneSet(OUT,hd,-3.5,3.8,0.95,1.3,3);paneSet(OUT,hd,3.0,1.8,0.95,1.3,2);
}

/* ----- Vorgarten ----- */
{
  const bed=cylS(OUT,2.4,2.4,0.04,22,0x5a3b27,-10.9,0,-3.6);bed.scale.set(0.6,1,1.2);
  const greens=[0x2f8f4a,0x3aa85b,0x5f8f6a,0x7b9a78,0x2d7a45];
  for(const [x,z,r,c] of [[-10.6,-4.8,0.5,0],[-11.0,-3.5,0.6,1],[-10.5,-2.6,0.45,3],[-11.4,-4.2,0.4,4],[-10.2,-3.9,0.4,2],[-11.2,-2.4,0.35,1]])sph(OUT,r,greens[c],x,r*0.8,z,1,0.85,1);
  for(const [x,z,c] of [[-10.0,-3.2,0xe86aa4],[-10.1,-4.3,0xf2c744],[-10.8,-2.1,0xb97ad9],[-10.3,-2.9,0xf2c744],[-11.1,-5.2,0xe86aa4]])sph(OUT,0.09,c,x,0.45,z);
  for(const [x,z,r] of [[-10.4,2.0,0.55],[-10.5,3.0,0.5],[-10.4,4.2,0.6],[-10.4,5.6,0.5]])sph(OUT,r,greens[(Math.floor(z)+5)%5],x,r*0.8,z,1,0.85,1);
  const TXP=mkTex(128,128,(c,w,h)=>{c.fillStyle='#b9aea0';c.fillRect(0,0,w,h);for(let y=0;y<8;y++)for(let x=0;x<8;x++){const o=(y%2)*8;c.fillStyle=((x+y)%3===0)?'#c98b5c':((x+y)%3===1)?'#a39a8d':'#d2c2a8';c.fillRect(x*16+o-8,y*16,15,15);}},2,2);
  tbox(OUT,3.0,0.03,1.9,MT(TXP,.95),-10.8,0,0);
  // Laubbaum rechts vom Eingang
  cylS(OUT,0.2,0.3,2.4,8,0x6e4a2a,-11.9,0,5.0);block(-12.15,4.75,-11.65,5.25);
  for(const [x,y,z,r] of [[-11.9,3.2,5.0,1.5],[-11.2,3.6,4.6,1.2],[-12.6,3.4,5.6,1.3],[-11.5,4.2,5.6,1.2],[-12.3,4.3,4.5,1.1]])sph(OUT,r,0x3b8f3f,x,y,z,1,0.85,1);
}


/* Ladenfront: Schaufenster, Tür, Markise, Schild (lokal: Fassade bei x=-hd, zeigt nach -x) */
const SHOPGLASS=new THREE.MeshStandardMaterial({color:0xcfe8f2,emissive:0xffedb8,emissiveIntensity:.42,roughness:.2,metalness:0});
function shopFront(g,hd,st){
  const hw=5.8;
  box(g,0.2,0.5,hw*2,STONE,-hd-0.1,0,0,false);                                  // Sockel
  box(g,0.1,0.1,hw*2-0.4,0x3a3a3a,-hd-0.1,2.55,0,false);                         // Sturz
  for(const sz of [-1,1]){
    box(g,0.08,1.9,3.8,0x2d2d30,-hd-0.1,0.55,sz*3.1,false);
    const gl=new THREE.Mesh(new THREE.BoxGeometry(0.06,1.7,3.6),SHOPGLASS);gl.position.set(-hd-0.16,0.65+0.85,sz*3.1);g.add(gl);
    // Auslage hinter dem Glas
    for(let k=0;k<4;k++)box(g,0.35,0.35,0.5,st.goods[k%st.goods.length],-hd-0.4,0.5,sz*3.1-1.35+k*0.9,false);
  }
  box(g,0.1,2.3,1.5,0x2d2d30,-hd-0.12,0,0,false);
  const dg=new THREE.Mesh(new THREE.BoxGeometry(0.06,2.0,1.2),SHOPGLASS);dg.position.set(-hd-0.2,1.1,0);g.add(dg);
  box(g,0.04,0.14,0.5,0xe33b3b,-hd-0.24,1.55,0,false);                          // "Offen"-Schild
  // Markise
  const aw=mkTex(128,64,(c,w,h)=>{for(let i=0;i<8;i++){c.fillStyle=i%2?'#f4f1ea':st.awn;c.fillRect(i*16,0,16,h);}},1,1);
  const am=new THREE.Mesh(new THREE.BoxGeometry(1.5,0.06,hw*2-0.6),[MT(aw),MT(aw),MT(aw),MT(aw),MT(aw),MT(aw)]);
  am.position.set(-hd-0.9,2.75,0);am.rotation.z=0.3;am.castShadow=true;g.add(am);
  // Schild
  const sg=mkTex(512,96,(c,w,h)=>{c.fillStyle=st.sign;c.fillRect(0,0,w,h);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(6,6,w-12,h-12);c.fillStyle=st.sign;c.fillRect(10,10,w-20,h-20);
    c.fillStyle='#fff';c.font='bold 58px Arial, sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(st.name,w/2,h/2+3);});
  const sm=new THREE.Mesh(new THREE.PlaneGeometry(8.0,1.15),new THREE.MeshStandardMaterial({map:sg,roughness:.6,emissive:0xffffff,emissiveMap:sg,emissiveIntensity:.35}));
  sm.position.set(-hd-0.35,3.55,0);sm.rotation.y=-Math.PI/2;g.add(sm);   // 2 cm vor dem Schildkasten (vorher bündig = Flackern)
  box(g,0.3,1.25,8.2,0x2d2d30,-hd-0.18,2.93,0,false);
  // Ware vor dem Laden
  for(let k=0;k<3;k++)box(g,0.6,0.5,0.6,st.goods[k%st.goods.length],-hd-1.6,0,-4.6+k*0.7,false);
}
/* ----- Nachbarhäuser (nicht betretbar) ----- */
const NB_STYLES=[
  {brick:true},{brick:false,col:0xd8c9a8},{brick:true},{brick:false,col:0xe6e3da},{brick:false,col:0xc7d0d6},{brick:true}
];
function neighborHouse(cx,cz,facing,st,mirror){
  const hd=8.65,hw=5.8,g=new THREE.Group();g.position.set(cx,0,cz);g.rotation.y=facing>0?Math.PI:0;OUT.add(g);
  // Baukörper
  const mat=st.brick?null:M(st.col);
  const bw=(w,h)=>st.brick?brickMat(w,h):mat;
  const body=new THREE.Mesh(new THREE.BoxGeometry(hd*2,5.8,hw*2),[bw(hw*2,5.8),bw(hw*2,5.8),M(0x8a8a8a),M(0x8a8a8a),bw(hd*2,5.8),bw(hd*2,5.8)]);
  body.position.y=2.9;body.castShadow=true;body.receiveShadow=true;g.add(body);
  roofSet(g,hd,hw);
  // Fassade (Fenster links/rechts je nach Spiegelung)
  const m=mirror?-1:1;
  box(g,0.12,0.75,hw*2,STONE,-hd-0.06,0,0,false);
  if(st.shop){shopFront(g,hd,st);paneSet(g,hd,-m*2.8,1.7,3.85,1.3,2);paneSet(g,hd,m*2.8,1.7,3.85,1.3,2);}
  else{
  paneSet(g,hd,-m*2.6,3.4,0.95,1.3,3);
  doorSet(g,hd,m*2.8,0.7);stoop(g,hd,m*2.8,5,0.14);
  paneSet(g,hd,-m*2.8,1.7,3.85,1.3,2);paneSet(g,hd,m*2.8,1.7,3.85,1.3,2);
  box(g,0.14,0.35,1.0,0x2c3a46,-hd-0.04,0.18,-m*2.6,false);}
  block(cx-hd,cz-hw,cx+hd,cz+hw);
  return g;
}
/* Reihe auf unserer Straßenseite und gegenüber – drei Häuser sind Läden */
const SHOPS_DEF=[
  {id:'spaeti',name:'SPÄTI 24',cx:-0.65,cz:31,facing:-1,sign:'#1d5fa8',awn:'#d83b3b',goods:[0xe0a030,0x3a8a4a,0xc04040,0x4a7ac0]},
  {id:'baeckerei',name:'BÄCKEREI BREZEL',cx:-34.65,cz:15.5,facing:1,sign:'#8a5a2b',awn:'#e0a64a',goods:[0xd9a45b,0xc58a45,0xf0d9a8,0xa86a32]},
  {id:'markt',name:'MARKT FRISCH',cx:-34.65,cz:-31,facing:1,sign:'#2c8a4a',awn:'#2c8a4a',goods:[0xd84a3a,0xf2c744,0x7ac14a,0xe08a2b]}
];
{
  const ours=[-44,-32,-20,15.5,46.5];
  ours.forEach((z,i)=>neighborHouse(-0.65,z,-1,NB_STYLES[i%6],i%2===1));
  const across=[-46.5,-15.5,0,31,46.5];
  across.forEach((z,i)=>neighborHouse(-34.65,z,1,NB_STYLES[(i+2)%6],i%2===0));
  SHOPS_DEF.forEach(d=>neighborHouse(d.cx,d.cz,d.facing,Object.assign({shop:true,brick:true},d),d.id==='baeckerei'));
  // Einfahrten in den Lücken
  for(const z of [-26,-38,7.75,23.25,38.75])box(OUT,15,0.03,2.2,0xaaa8a2,-1.5,-0.03,z,false);
}

/* ----- Straßenbäume und Büsche ----- */
{
  const greens=[0x2f8f4a,0x3aa85b,0x5f8f6a,0x2d7a45];
  function leafy(x,z,s){
    cylS(OUT,0.16*s,0.24*s,2.2*s,8,0x6e4a2a,x,0,z);block(x-0.25,z-0.25,x+0.25,z+0.25);
    for(const [dx,dy,dz,r] of [[0,3.0,0,1.35],[0.8,3.4,0.4,1.0],[-0.8,3.2,-0.5,1.1],[0.2,4.0,-0.3,0.95]])sph(OUT,r*s,pick(greens),x+dx*s,dy*s,z+dz*s,1,0.88,1);
  }
  function bush(x,z,r){sph(OUT,r,pick(greens),x,r*0.7,z,1.2,0.8,1);}
  for(let z=-54;z<=54;z+=9){
    if(Math.abs(z)>8&&Math.abs(z+3-31)>5){leafy(-12.9,z+3,1);}
    if(Math.abs(z+4-15.5)>5&&Math.abs(z+4+31)>5)leafy(-22.4,z+4,1.05);
  }
  for(let z=-56;z<=56;z+=3.4){
    if(Math.abs(z)>7&&Math.abs(z-31)>6){bush(-11.4,z,0.45+Math.random()*0.2);}
    if(Math.abs(z+1-15.5)>6&&Math.abs(z+1+31)>6)bush(-23.4,z+1,0.45+Math.random()*0.25);
  }
}

/* ----- Kleiner Garten hinter der Küchentür (Ostseite) mit Grill ----- */
let GRILL0=null;
{
  const gx0=9.3,gx1=18,gz0=-8.5,gz1=2.5,cz=-3.2;
  const FENCE=0xe9e4d8;
  function fence(x0,z0,x1,z1){
    const L=Math.hypot(x1-x0,z1-z0),a=Math.atan2(z1-z0,x1-x0);
    const g=new THREE.Group();g.position.set((x0+x1)/2,0,(z0+z1)/2);g.rotation.y=-a;OUT.add(g);
    box(g,L,0.07,0.05,FENCE,0,0.85,0,false);box(g,L,0.07,0.05,FENCE,0,0.4,0,false);
    for(let t=-L/2;t<=L/2+0.01;t+=0.3)box(g,0.07,1.0,0.03,FENCE,t,0,0,false);
    block(Math.min(x0,x1)-0.1,Math.min(z0,z1)-0.1,Math.max(x0,x1)+0.1,Math.max(z0,z1)+0.1);
  }
  fence(gx0,gz0,gx1,gz0);fence(gx1,gz0,gx1,-6.45);fence(gx1,0.1,gx1,gz1);fence(gx1,gz1,gx0+3.5,gz1);   // Tor-Lücke im Süden bei x 9.3-12.8
  fence(gx0,gz0,gx0,-6.4);
  // Terrasse
  const TXT=mkTex(128,128,(c,w,h)=>{c.fillStyle='#b4aca0';c.fillRect(0,0,w,h);for(let y=0;y<4;y++)for(let x=0;x<4;x++){c.fillStyle=(x+y)%2?'#a49c90':'#bdb5a8';c.fillRect(x*32+1,y*32+1,30,30);}},3,3);
  tbox(OUT,4.2,0.04,4.4,MT(TXT,.95),11.5,0,cz,false);
  for(let x=9.3;x<12;x+=0.9)box(OUT,0.5,0.03,0.7,0xb5aca0,x+0.2,0,cz,false);
  // Grill (Kugelgrill)
  {const g=new THREE.Group();g.position.set(14.2,0,-5.2);OUT.add(g);GRILL0=g;
   for(const [dx,dz] of [[-0.3,-0.3],[0.3,-0.3],[-0.3,0.3],[0.3,0.3]]){const l=box(g,0.04,0.8,0.04,0x2b2b2b,dx,0,dz,false);l.rotation.z=dx*0.2;}
   cylS(g,0.5,0.4,0.35,14,0x1f1f22,0,0.8,0);
   const lid=sph(g,0.5,0x25262a,0,1.15,0,1,0.6,1);
   box(g,0.5,0.04,0.08,0x888888,0,1.1,0.52,false);
   box(g,0.8,0.05,0.4,0x8a6a45,0.0,0.55,0.0,false);
   block(13.6,-5.8,14.8,-4.6);}
  // Sitzgruppe
  {const g=new THREE.Group();g.position.set(13.6,0,-1.2);OUT.add(g);
   cylS(g,0.9,0.9,0.05,16,0xcfc9bb,0,0.74,0);cylS(g,0.07,0.07,0.74,8,0x555555,0,0,0);
   for(const a of [0,2.1,4.2]){const c=box(g,0.45,0.05,0.45,0xe8e2d2,Math.cos(a)*1.2,0.45,Math.sin(a)*1.2,false);box(g,0.05,0.45,0.05,0x555555,Math.cos(a)*1.2,0,Math.sin(a)*1.2,false);}
   block(12.6,-2.2,14.6,-0.2);}
  // Blumenbeete am Zaun
  for(const [x,z] of [[10.2,-7.8],[12.2,-7.9],[15.0,-7.9],[17.3,-7.2],[16.5,1.8],[14.0,1.8]]){
    sph(OUT,0.45,pick([0x2f8f4a,0x3aa85b,0x2d7a45]),x,0.35,z,1.2,0.8,1);
    sph(OUT,0.08,pick([0xe86aa4,0xf2c744,0xb97ad9]),x+0.1,0.62,z+0.05);}
}
