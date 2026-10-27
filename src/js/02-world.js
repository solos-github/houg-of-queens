/* ---------- Welt: Haus, Kellerannex, Vorgarten, Straße ---------- */
const W=new THREE.Group(); scene.add(W);
const colliders=[];      // {x0,x1,z0,z1,on}
const wallMeshes=[];     // für Kamera-Raycast
const radarWalls=[];     // Rechtecke für den Radar
const T=0.4, WALLH=3;
function block(x0,z0,x1,z1){const c={x0,x1,z0,z1,on:true};colliders.push(c);return c;}
function segX(z,a,b,col){ // Wand parallel zur X-Achse
  if(b-a<0.01)return;
  const m=box(W,b-a,WALLH,T,col,(a+b)/2,0,z);wallMeshes.push(m);
  block(a,z-T/2,b,z+T/2);radarWalls.push([a,z-T/2,b,z+T/2]);
}
function segZ(x,a,b,col){
  if(b-a<0.01)return;
  const m=box(W,T,WALLH,b-a,col,x,0,(a+b)/2);wallMeshes.push(m);
  block(x-T/2,a,x+T/2,b);radarWalls.push([x-T/2,a,x+T/2,b]);
}
/* Wand mit Türlücken; gaps = [[von,bis],...] sichtbare Lücken */
function wallX(z,xa,xb,gaps,col,extA=true,extB=true){
  const e=T/2;let cur=xa-(extA?e:0);
  for(const [g0,g1] of gaps){segX(z,cur,g0+0,col);cur=g1;
    box(W,g1-g0,0.6,T,col,(g0+g1)/2,2.4,z);}
  segX(z,cur,xb+(extB?e:0),col);
}
function wallZ(x,za,zb,gaps,col,extA=true,extB=true){
  const e=T/2;let cur=za-(extA?e:0);
  for(const [g0,g1] of gaps){segZ(x,cur,g0,col);cur=g1;
    box(W,T,0.6,g1-g0,col,x,2.4,(g0+g1)/2);}
  segZ(x,cur,zb+(extB?e:0),col);
}
const WC=0xefe3c8, WA=0xa89c92;

/* Boden */
box(W,160,0.4,160,0x6dbb5a,0,-0.45,0,false);                 // Gras (Oberkante -0.05)
box(W,160,0.02,6,0x4a4d57,0,-0.05,15,false);                  // Straße
box(W,160,0.04,2.6,0xb9b6ad,0,-0.05,10.8,false);             // Gehweg vorn
box(W,160,0.04,2.6,0xb9b6ad,0,-0.05,19.2,false);             // Gehweg hinten
box(W,2.2,0.04,4.4,0xc9c5b8,0,-0.05,7.8,false);              // Weg zur Haustür
for(let x=-60;x<=60;x+=6)box(W,2.4,0.01,0.18,0xf0d26a,x,-0.03,15,false);
box(W,18.8,0.4,12.8,0x7a6a58,0,-0.4,0);                      // Hausplatte
box(W,8.8,0.4,6.8,0x6f6f74,13,-0.4,-3);                      // Annex-Platte
function floor(x0,z0,x1,z1,col){box(W,x1-x0,0.04,z1-z0,col,(x0+x1)/2,0,(z0+z1)/2,false);}
floor(-9,-6,0,1,0xb98a5a);      // Wohnzimmer
floor(0,-6,9,1,0xd9d4c6);       // Küche
floor(-3,1,3,6,0xa77a4b);       // Flur
floor(-9,1,-3,6,0x8f6f9a);      // Schlafzimmer
floor(3,1,9,6,0x9fd0d8);        // Bad
floor(9,-6,17,0,0x8d8d92);      // Keller
box(W,5,0.02,3.2,0xa83a3a,-4.5,0.04,-2.8,false); // Teppich

/* Außenwände */
wallX(-6,-9,9,[],WC);
wallZ(-9,-6,6,[],WC);
wallX(6,-9,9,[[-1.1,1.1]],WC);
wallZ(9,-6,6,[[-4.2,-1.8]],WC);
/* Innenwände */
wallX(1,-9,9,[[-5.8,-3.8],[-3,3],[4.8,6.8]],WC,false,false);
wallZ(-3,1,6,[],WC,false,true);
wallZ(3,1,6,[],WC,false,true);
wallZ(0,-6,-3,[],WC,false,false);
/* Annex (Keller) */
wallX(-6,9,17,[],WA,false,true);
wallX(0,9,17,[],WA,false,true);
wallZ(17,-6,0,[],WA,true,true);
const annexRoof=box(W,9,0.3,7,0x2a2530,13,3.0,-3);  // verdeckt den Keller, bis Kapitel 2 beginnt

/* Wohnzimmer */
function sofa(){
  const g=new THREE.Group();g.position.set(-4.5,0,-1.2);W.add(g);
  box(g,3.2,0.45,1.2,0x3f6fb0,0,0,0);box(g,3.2,0.6,0.35,0x35609c,0,0.45,0.45);
  box(g,0.3,0.35,1.2,0x35609c,-1.45,0.45,0);box(g,0.3,0.35,1.2,0x35609c,1.45,0.45,0);
  block(-6.1,-1.8,-2.9,-0.6);
}
sofa();
box(W,1.6,0.1,0.8,0x7a4f2c,-4.5,0.42,-3.0);
for(const [lx,lz] of [[-5.2,-3.3],[-3.8,-3.3],[-5.2,-2.7],[-3.8,-2.7]])box(W,0.1,0.42,0.1,0x5b3b24,lx,0,lz);
block(-5.3,-3.4,-3.7,-2.6);
box(W,2.6,0.6,0.7,0x5b3b24,-4.5,0,-5.55);block(-5.8,-5.9,-3.2,-5.2);
box(W,2.2,1.3,0.18,0x111111,-4.5,0.62,-5.5);
const tvTex=document.createElement('canvas');tvTex.width=256;tvTex.height=160;
const tvTexture=new THREE.CanvasTexture(tvTex);
const tvScreen=new THREE.Mesh(new THREE.PlaneGeometry(1.95,1.1),new THREE.MeshBasicMaterial({map:tvTexture}));
tvScreen.position.set(-4.5,1.27,-5.405);W.add(tvScreen);
box(W,0.6,2.2,2.4,0x6b4a2f,-8.55,0,-3.5);block(-8.85,-4.7,-8.25,-2.3);                  // Regal
for(let i=0;i<4;i++)box(W,0.35,0.3,2.0,[0xc0392b,0x2980b9,0xf1c40f,0x27ae60][i],-8.45,0.35+i*0.5,-3.5,false);
{const g=new THREE.Group();g.position.set(-7.8,0,-0.8);W.add(g);                            // Sessel
 box(g,1.1,0.5,1.1,0x8a3b3b,0,0,0);box(g,1.1,0.6,0.3,0x7a3030,0,0.5,0.4);block(-8.35,-1.35,-7.25,-0.25);}
cyl(W,0.05,0.05,1.7,6,0x444444,-1.3,0,-5.0);cyl(W,0.3,0.45,0.4,8,0xfff1b8,-1.3,1.6,-5.0);  // Stehlampe
box(W,1.2,0.8,0.05,0xd9a441,-1.9,1.5,-5.76,false);box(W,1.0,0.6,0.05,0x7fb5d6,-1.9,1.6,-5.74,false);

/* Küche */
box(W,1.2,2.2,1.1,0xdfe6ea,1.5,0,-5.3);box(W,0.08,0.5,0.06,0x555555,2.0,1.1,-4.72);block(0.9,-5.85,2.1,-4.75);
box(W,4.2,1.0,1.1,0xc79f6b,4.5,0,-5.4);box(W,4.3,0.06,1.2,0xf0efe9,4.5,1.0,-5.4);
box(W,1.0,0.04,0.7,0x8aa0b0,4.5,1.06,-5.3,false);cyl(W,0.04,0.04,0.35,6,0x999999,4.5,1.06,-5.75);block(2.4,-5.95,6.6,-4.85);
box(W,0.95,0.85,0.06,0xcfd4d8,3.3,0.08,-4.82);box(W,0.6,0.04,0.05,0x555555,3.3,0.78,-4.77);box(W,0.9,0.06,0.04,0x2a2f36,3.3,0.9,-4.80);
box(W,1.2,1.0,1.1,0x8a8a8a,7.6,0,-5.4);for(const bx of[-0.25,0.25])cyl(W,0.2,0.2,0.04,8,0x222222,7.6+bx,1.0,-5.4);block(7.0,-5.95,8.2,-4.85);
box(W,2,0.1,1.4,0xb78a54,6.2,0.75,-3.2);
for(const [lx,lz] of [[5.3,-3.8],[7.1,-3.8],[5.3,-2.6],[7.1,-2.6]])box(W,0.1,0.75,0.1,0x6b4a2f,lx,0,lz);
block(5.2,-3.9,7.2,-2.5);
box(W,0.6,0.5,0.6,0x5a8a5a,5.2,0,-1.6);box(W,0.6,0.5,0.6,0x5a8a5a,7.2,0,-1.6);
const kellerDoor=new THREE.Group();W.add(kellerDoor);
box(kellerDoor,0.3,2.4,2.4,0x7b5a3a,9,0,-3);
box(kellerDoor,0.42,0.22,2.8,0xc9a56a,9,0.7,-3);box(kellerDoor,0.42,0.22,2.8,0xc9a56a,9,1.3,-3);box(kellerDoor,0.42,0.22,2.8,0xc9a56a,9,1.9,-3);
const kellerBlock=block(8.8,-4.2,9.2,-1.8);

/* Flur */
box(W,0.8,0.8,0.6,0x6b4a2f,2.4,0,4.4);box(W,0.3,0.15,0.2,0xcc2222,2.4,0.8,4.4);block(2.0,4.1,2.8,4.7);
cyl(W,0.04,0.04,1.8,6,0x444444,-2.4,0,5.4);box(W,0.4,0.05,0.05,0x444444,-2.4,1.7,5.4);block(-2.6,5.2,-2.2,5.6);
box(W,1.4,0.02,0.8,0x6a4a2a,0,0.04,5.2,false);
box(W,0.08,2.3,1.1,0x8a4b2a,-1.15,0,6.6);   // offene Haustür

/* Schlafzimmer */
{const g=new THREE.Group();g.position.set(-7.7,0,4.25);W.add(g);
 box(g,2.2,0.5,3.1,0x8c5a3c,0,0,0);box(g,2.0,0.25,2.9,0xe8e0f0,0,0.5,0);box(g,1.2,0.15,0.5,0xffffff,0,0.75,-1.1);block(-8.8,2.7,-6.6,5.8);}
box(W,1.6,2.2,0.9,0x7a5a3a,-8.0,0,1.85);block(-8.8,1.4,-7.2,2.3);
box(W,0.7,0.5,0.7,0xd9b46a,-5.5,0,4.8);block(-5.85,4.45,-5.15,5.15);
box(W,0.5,0.5,0.5,0x6b4a2f,-6.0,0,5.6);cyl(W,0.1,0.18,0.35,6,0xfff1b8,-6.0,0.5,5.6);block(-6.25,5.35,-5.75,5.85);

/* Bad */
box(W,1.4,0.7,3.6,0xf2f5f7,8.2,0,3.8);box(W,1.1,0.05,3.3,0x7ec8e3,8.2,0.66,3.8,false);block(7.5,2.0,8.9,5.6);
box(W,0.7,0.45,0.8,0xffffff,4.0,0,5.3);box(W,0.7,0.6,0.25,0xffffff,4.0,0.45,5.65);block(3.6,4.9,4.4,5.8);
box(W,0.6,0.9,0.5,0xffffff,3.7,0,2.0);box(W,0.05,0.8,0.7,0xcfe8f2,3.22,1.4,2.0,false);block(3.4,1.75,4.0,2.25);

/* Keller */
box(W,1.0,0.4,2.2,0x5b6b4a,15.5,0,-2.0);block(15,-3.1,16,-0.9);
for(let i=0;i<4;i++)box(W,0.9,0.7,0.9,0xb08a55,10.3+(i%2)*0.9,Math.floor(i/2)*0.7,-5.2);block(9.8,-5.7,11.6,-4.6);
box(W,2.4,1.0,0.8,0x6b4a2f,13.2,0,-5.5);block(12,-5.9,14.4,-5.1);
box(W,1.2,0.6,1.1,0x6a3a3a,14.0,0,-4.0);box(W,1.2,0.7,0.3,0x5a2a2a,14.0,0.6,-3.5);block(13.4,-4.55,14.6,-3.45);
cyl(W,0.02,0.02,0.8,4,0x222222,12.5,2.2,-3);cyl(W,0.12,0.12,0.18,8,0xffe9a0,12.5,2.0,-3);

/* Draußen */
function tree(x,z,s=1){cyl(W,0.18*s,0.25*s,1.4*s,6,0x7a5230,x,0,z);
  const a=new THREE.Mesh(new THREE.ConeGeometry(1.3*s,2.2*s,6),M(0x2f8f4a));a.position.set(x,1.9*s,z);a.castShadow=true;W.add(a);
  const b=new THREE.Mesh(new THREE.ConeGeometry(1.0*s,1.8*s,6),M(0x39a85a));b.position.set(x,3.0*s,z);b.castShadow=true;W.add(b);}
for(const [x,z,s] of [[-14,9,1.1],[-20,3,1],[14,9,1],[22,6,1.2],[-13,-10,1],[24,-12,1.1],[-26,-4,1.2],[30,2,1]])tree(x,z,s);
function nbHouse(x,z,col,roof){box(W,8,4,6,col,x,0,z);const r=new THREE.Mesh(new THREE.ConeGeometry(6.2,2.6,4),M(roof));r.position.set(x,5.3,z);r.rotation.y=Math.PI/4;r.castShadow=true;W.add(r);
  box(W,1.2,1.6,0.1,0x7fb5d6,x-2,1.2,z+3.02,false);box(W,1.2,1.6,0.1,0x7fb5d6,x+2,1.2,z+3.02,false);}
nbHouse(-24,-13,0xd9b38c,0x8a3b3b);nbHouse(27,-14,0xb7c9d9,0x5b4a6b);nbHouse(-28,8,0xe3c9a0,0x6b4a2f);
{const g=new THREE.Group();g.position.set(6.2,0,9.3);W.add(g);cyl(g,0.35,0.3,0.9,8,0x6b7078,0,0,0);cyl(g,0.38,0.38,0.08,8,0x555a60,0,0.9,0);}
/* Lieferwagen (Platzhalter für Kapitel 3) */
{const g=new THREE.Group();g.position.set(-8,0,13.6);W.add(g);
 box(g,4.4,1.7,2.0,0x7a5230,0,0.4,0);box(g,1.3,1.1,1.9,0x6a4526,2.4,0.4,0);box(g,0.06,0.6,1.5,0xbfe3f2,3.06,1.0,0,false);
 for(const [wx,wz] of [[-1.4,1.0],[1.4,1.0],[-1.4,-1.0],[1.4,-1.0],[2.5,1.0],[2.5,-1.0]])cyl(g,0.38,0.38,0.2,10,0x222222,wx,0,wz).rotation.x=Math.PI/2;
 block(-10.4,12.5,-5.6,14.7);}

/* Wegenetz für NPCs (gerade Verbindungen laufen nur durch Türen und freie Flächen) */
const NODES={Fo:[0,8.2],F:[0,5.6],H:[0,3.3],M:[0,0.2],K:[3,-2],BD:[5.8,0.3],B:[6,3.6],
  L1:[-3,0.3],L2:[-4.8,0.3],L3:[-6.2,0.3],R:[-5.5,3.6],T1:[-2.2,-1.2],T:[-2.5,-4.4],
  K0:[8,-1.2],KD:[8.4,-3],KI:[13,-3],KB:[12.5,-1.2],KC:[14.2,-4.8]};
const EDGES=[['Fo','F'],['F','H'],['H','M'],['M','K'],['M','L1'],['L1','L2'],['L2','L3'],['L2','R'],['K','BD'],['BD','B'],
  ['K','K0'],['K0','KD'],['KD','KI'],['KI','KB'],['KI','KC'],['L1','T1'],['T1','T']];
const ADJ={};for(const k in NODES)ADJ[k]=[];
for(const [a,b] of EDGES){ADJ[a].push(b);ADJ[b].push(a);}
function route(from,to){
  if(from===to)return [];
  const prev={[from]:null},q=[from];
  while(q.length){const c=q.shift();if(c===to)break;for(const n of ADJ[c])if(!(n in prev)){prev[n]=c;q.push(n);}}
  if(!(to in prev))return [];
  const out=[];for(let c=to;c!==from;c=prev[c])out.unshift(c);return out;
}
