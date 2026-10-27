/* ---------- Erdgeschoss: Wohn-/Essbereich, Küche, Hinterflur ---------- */
setFloor(0);
const BLUE=0x6a8fbf,WOODD=0x4a2e1c,WOODM=0x7a4f2c;

/* Wände */
wall('z',-9,-6,6,[[-5.4,-1.6,'w'],[-0.9,0.9],[2.1,3.9,'w']],[PINK,BRICK],{inS:1});
wall('x',-6,-9,1.5,[],[PINK,BRICK],{inS:1,extB:false});
wall('x',-6,1.5,9,[[4.3,5.6]],[YEL,BRICK],{extA:false});
wall('x',6,-9,1.5,[[-7.4,-5.0,'w'],[-2.6,-0.2,'w']],[BRICK,PINK],{inS:-1,extB:false});
wall('x',6,1.5,9,[[3.6,6.2,'w']],[BRICK,YEL],{inS:-1,ging:true,extA:false});
wall('z',9,-6,6,[[-4.0,-2.4],[-0.8,1.8,'w']],[BRICK,YEL],{inS:-1,ging:true});
wall('z',1.5,-6,6,[[-3.3,-1.7],[-0.5,2.5,'p',1.05,2.2]],[YEL,PINK],{extA:false,extB:false});
/* Hinterflur (Alcove) mit zugenagelter Kellertür */
wall('z',4.15,-8,-6,[],[CREAM,BRICK],{extB:false});
wall('z',5.75,-8,-6,[],[BRICK,CREAM],{extB:false});
wall('x',-8,4.15,5.75,[[4.3,5.6]],[CREAM,GREYW]);
box(W,1.5,0.4,2.2,0x4a3226,4.95,-0.4,-7.0);
box(W,0.5,0.02,0.3,0x333333,4.95,0.0,-6.4,false);   // Lüftungsgitter
const kellerDoor=new THREE.Group();W.add(kellerDoor);
box(kellerDoor,1.3,2.35,0.1,0x6b4423,4.95,0,-8.0);
for(const y of [0.6,1.2,1.8])box(kellerDoor,1.5,0.2,0.06,0xc9a56a,4.95,y,-7.92);
const kellerBlock=block(4.3,-8.15,5.6,-7.85);
/* Schatten der Stufen-Schachtwände an der Oberfläche */
block(4.0,-10.95,4.3,-8.0);block(5.6,-10.95,5.9,-8.0);block(4.3,-10.95,5.6,-10.8);

/* Überdachter Kellerabgang: gemauerter Schacht mit sichtbaren Stufen, Dach über dem Loch im Rasen */
const SROOF=new THREE.Group();scene.add(SROOF);
{
  for(let k=0;k<10;k++){const top=2.9-k*0.29,zc=-8.2-0.26*(k+0.5);box(W,1.3,top,0.26,0x8a8a8e,4.95,-2.9,zc);box(W,1.3,0.03,0.28,0x9a7a52,4.95,-2.9+top,zc,false);}
  box(W,1.3,0.3,0.3,0x6a6a6e,4.95,-2.9,-10.9,false);
  for(const [x,w] of [[4.15,0.3],[5.75,0.3]]){box(W,w-0.02,5.5,2.86,0x9c4a38,x+(x<5?-0.02:0.02),-2.9,-9.58);box(W,w+0.12,0.12,3.17,0xe8dfc8,x,2.55,-9.5,false);}
  box(W,1.5,2.6,0.2,0x9c4a38,4.95,0,-10.95);                  // Stirnwand über der Erde, unten bleibt der Gang in den Keller offen
  tbox(SROOF,2.3,0.2,3.075,MT(TX_CONC,.95),4.95,2.6,-9.6875);   // Dach endet an der Hauswand (z=-8.15), überlappt die Alkovenwände nicht mehr
  box(SROOF,2.4,0.1,3.075,0x6a3a2a,4.95,2.8,-9.6875,false);
}

/* Teppiche */
{let m=tbox(W,6.2,0.03,4.2,MT(TX_RUGB,1),-4.6,0,0.6);
 m=tbox(W,3.8,0.03,2.6,MT(TX_RUGB,1),-0.1,0,1.0);m.rotation.y=Math.PI/2;
 tbox(W,1.8,0.03,1.0,MT(TX_RUGB,1),-0.8,0,-3.7);}

/* Sofa (Front +z) */
{const g=new THREE.Group();g.position.set(-4.6,0,-1.6);W.add(g);const w=3.9,cc=0xa8814f,cd=0xb98f5c;
 box(g,w-0.06,0.22,1.24,0x7a5a36,0,0,0);        // etwas kleiner als die Armlehnen: keine deckungsgleichen Flächen mehr
 for(let i=0;i<3;i++)box(g,(w-0.7)/3-0.03,0.26,0.95,cd,-(w-0.7)/3+i*(w-0.7)/3,0.22,0.12);
 box(g,w-0.5,0.7,0.3,cc,0,0.22,-0.52);
 for(const sx of [-1,1]){box(g,0.38,0.5,1.3,cc,sx*(w/2-0.19),0,0);
   const a=cylS(g,0.2,0.2,1.32,14,cc,sx*(w/2-0.19),0,0);a.rotation.x=Math.PI/2;a.position.y=0.55;}
 const p1=box(g,0.5,0.46,0.14,0x6fb59a,-1.6,0.45,0.0);p1.rotation.set(-0.3,0.4,0.1);
 const p2=box(g,0.5,0.46,0.14,0xe0b13e,1.45,0.45,0.0);p2.rotation.set(-0.3,-0.3,-0.1);
 block(-4.6-w/2,-2.4,-4.6+w/2,-0.8);}
/* Couchtisch (oval) */
{const t=cylS(W,0.9,0.9,0.06,24,0xd29a4a,-4.6,0.42,0.9);t.scale.set(1,1,0.55);
 for(const [lx,lz] of [[-.55,-.2],[.55,-.2],[-.55,.2],[.55,.2]])cylS(W,0.04,0.04,0.42,6,0x9a6a30,-4.6+lx,0,0.9+lz);
 sph(W,0.07,0xc62828,-4.4,0.52,0.85);sph(W,0.07,0xc62828,-4.3,0.52,0.95);
 box(W,0.34,0.02,0.26,0xe9e4d6,-4.9,0.48,0.95);box(W,0.3,0.02,0.24,0xb9d0e8,-4.2,0.48,0.82);
 block(-5.5,0.45,-3.7,1.35);}
/* Fernseher auf gelbem Hocker (Bildschirm zeigt nach Norden) */
const tvTex=document.createElement('canvas');tvTex.width=256;tvTex.height=160;
const tvTexture=new THREE.CanvasTexture(tvTex);
const tvScreen=new THREE.Mesh(new THREE.PlaneGeometry(0.82,0.62),new THREE.MeshBasicMaterial({map:tvTexture}));
const oldTV=new THREE.Group();W.add(oldTV);
{box(W,1.3,0.5,1.0,0xd8b540,-4.6,0,3.3);
 box(oldTV,1.15,0.85,0.9,0x262626,-4.6,0.5,3.35);box(oldTV,0.7,0.5,0.4,0x1d1d1d,-4.6,0.7,3.95);
 box(oldTV,0.95,0.7,0.05,0x111111,-4.6,0.58,2.87);
 tvScreen.position.set(-4.6,0.93,2.835);tvScreen.rotation.y=Math.PI;W.add(tvScreen);
 block(-5.3,2.75,-3.9,3.95);}
/* Grüner Sessel */
function armchair(x,z,ry,col,armc,blk){
  const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;W.add(g);
  box(g,1.0,0.4,0.95,col,0,0.1,0);box(g,1.0,0.8,0.25,col,0,0.1,-0.45);
  for(const sx of [-1,1])box(g,0.2,0.35,0.95,armc||col,sx*0.5,0.1,0);
  for(const [lx,lz] of [[-.4,-.4],[.4,-.4],[-.4,.4],[.4,.4]])box(g,0.07,0.1,0.07,0x4a2e1c,lx,0,lz);
  block(blk[0],blk[1],blk[2],blk[3]);return g;
}
armchair(-7.8,-4.5,Math.PI/4,0xcdbc7c,0xcdbc7c,[-8.4,-5.1,-7.2,-3.9]);
/* Beistelltisch + Lampe (Nordfenster), Konsole + Lampe (Südfenster) */
{box(W,0.5,0.06,1.2,WOODD,-8.55,0.75,-3.2);
 for(const [lx,lz] of [[-.2,-.5],[.2,-.5],[-.2,.5],[.2,.5]])box(W,0.05,0.75,0.05,WOODD,-8.55+lx,0,-3.2+lz);
 cylS(W,0.09,0.12,0.2,8,0x884422,-8.55,0.81,-3.2);cylS(W,0.12,0.2,0.28,10,0xe9a05a,-8.55,1.0,-3.2);
 block(-8.85,-3.85,-8.3,-2.55);
 box(W,0.5,0.06,1.6,0xc7a577,-8.55,0.84,3.2);
 for(const [lx,lz] of [[-.2,-.7],[.2,-.7],[-.2,.7],[.2,.7]])box(W,0.05,0.84,0.05,0xc7a577,-8.55+lx,0,3.2+lz);
 box(W,0.45,0.04,1.5,0xc7a577,-8.55,0.3,3.2);
 cylS(W,0.1,0.13,0.22,8,0xdddddd,-8.55,0.9,3.7);cylS(W,0.14,0.22,0.32,10,0xf4efe0,-8.55,1.1,3.7);
 sph(W,0.12,0xc0392b,-8.55,0.98,2.7);
 block(-8.85,2.35,-8.3,4.05);}
/* Stehlampe (Dreibein) */
{for(const a of [0,2.1,4.2]){const l=cylS(W,0.02,0.02,1.7,5,0x9a6a30,-7.3+Math.sin(a)*0.18,0,-2.2+Math.cos(a)*0.18);l.rotation.z=Math.sin(a)*0.08;l.rotation.x=Math.cos(a)*0.08;}
 cylS(W,0.22,0.34,0.5,14,0xf4efe0,-7.3,1.55,-2.2);}
/* Bücherregal, Fenster-Jalousie, Vitrine */
{box(W,2.2,1.4,0.5,0x6b4a2f,-5.4,0,-5.7);
 const cols=[0xc0392b,0x2980b9,0xf1c40f,0x27ae60,0xe67e22,0x8e44ad,0xecf0f1];
 for(let r=0;r<3;r++)for(let k=0;k<12;k++)box(W,0.1,0.28+Math.random()*0.06,0.28,pick(cols),-6.35+k*0.17,0.12+r*0.42,-5.68,false);
 box(W,0.55,0.18,0.3,0xc9c9c9,-6.0,1.4,-5.7);box(W,0.4,0.16,0.28,0xe0e0e0,-5.4,1.4,-5.7);
 cylS(W,0.12,0.09,0.16,8,0xa0522d,-4.7,1.4,-5.7);sph(W,0.16,0x3f9f4f,-4.7,1.7,-5.7,1,1.1,1);
 for(let i=0;i<8;i++)box(W,1.9,0.03,0.04,0xe8dcc0,-5.4,1.55+i*0.12,-5.8,false);
 block(-6.5,-6,-4.3,-5.4);
 box(W,1.3,1.75,0.5,WOODD,-2.4,0,-5.7);
 for(const sx of [-1,1])box(W,0.52,1.1,0.03,0x8fb5c9,-2.4+sx*0.3,0.45,-5.43,false);
 box(W,0.04,1.2,0.04,0x2a170c,-2.4,0.4,-5.42,false);
 cylS(W,0.07,0.1,0.15,8,0x3a5a7a,-2.4,1.75,-5.7);cylS(W,0.13,0.2,0.28,10,0x74a9b8,-2.4,1.9,-5.7);
 block(-3.05,-6,-1.75,-5.4);
 box(W,0.2,2.9,0.2,WOODD,-1.55,0,-4.2);block(-1.65,-4.3,-1.45,-4.1);}

/* Bilder an den Wänden */
function pic(x,y,z,w,h,col,face){
  const ns=face==='N'||face==='S',fx=ns?w:0.04,fz=ns?0.04:w;
  box(GR,fx,h,fz,0x3a2a1c,x,y,z,false);
  const ix=ns?w-0.1:0.05,iz=ns?0.05:w-0.1;
  box(GR,ix,h-0.1,iz,col,x,y+0.05,z+(face==='N'?0.01:face==='S'?-0.01:0),false);
}
for(const [x,y,w,h,c] of [[-2.4,1.5,0.9,0.7,0x6aa0c8],[-1.7,1.9,0.45,0.55,0xd8b0b0],[-0.9,1.55,0.5,0.6,0xb8c8a8]])pic(x,y,-5.83,w,h,c,'N');
pic(0.2,2.0,-5.83,1.3,0.9,0x3a5ea8,'N');pic(-0.6,1.0,-5.83,0.4,0.5,0xe0c8a8,'N');

/* Treppe zum Obergeschoss (Läufer, weiße Setzstufen, Geländer) */
for(let k=0;k<10;k++){
  const x0=-1.3+0.26*k,h=(k+1)*0.29;
  box(W,0.26,h,1.4,0xf0ece4,x0+0.13,0,-5.3);
  box(W,0.28,0.03,1.4,0x8a6a40,x0+0.13,h,-5.3);
  box(W,0.26,0.035,0.95,0x8c2f39,x0+0.13,h+0.03,-5.3,false);
  if(k%2===0)box(W,0.06,0.9,0.06,TRIM,x0+0.13,h,-4.62,false);
}
{const L=Math.hypot(2.6,2.61),r=box(W,L,0.07,0.09,0x5a3b22,0,2.5,-4.62,false);r.rotation.z=Math.atan2(2.61,2.6);
 box(W,0.14,1.4,0.14,0x5a3b22,-1.38,0,-4.62);}
/* Klavier mit Familienfotos + Hocker */
{box(W,1.5,1.25,0.62,0x5a3721,0.55,0,-4.2);box(W,1.56,0.05,0.66,0x4a2e1c,0.55,1.25,-4.2);
 box(W,1.3,0.05,0.22,0xf4f1ea,0.55,0.76,-3.86,false);box(W,1.3,0.03,0.12,0x2a2a2a,0.55,0.82,-3.92,false);
 for(const [x,c] of [[0.1,0xd0b090],[0.4,0xb0c4d8],[0.7,0xe0c0c0]])box(W,0.2,0.26,0.04,c,x,1.3,-4.15,false);
 cylS(W,0.08,0.1,0.14,8,0x333333,1.0,1.3,-4.2);
 box(W,0.6,0.45,0.3,0x5a3721,0.55,0,-3.3);box(W,0.56,0.04,0.28,0xeee8d6,0.55,0.45,-3.3,false);
 block(-0.2,-4.55,1.3,-3.85);}
/* Esstisch + Stühle */
{box(W,1.3,0.08,3.0,0xcaa05c,-0.1,0.74,1.0);
 for(const [lx,lz] of [[-.55,-1.3],[.55,-1.3],[-.55,1.3],[.55,1.3]])box(W,0.08,0.74,0.08,0xb08848,-0.1+lx,0,1.0+lz);
 box(W,0.5,0.01,2.5,0xf4f1ea,-0.1,0.82,1.0,false);box(W,0.3,0.02,0.22,0xe4e0d4,-0.1,0.83,0.4,false);
 cylS(W,0.12,0.12,0.03,10,0x3a86d1,-0.1,0.83,1.8);
 block(-0.75,-0.5,0.55,2.5);}
function chair(x,z,ry,col,seatCol){
  const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;W.add(g);
  box(g,0.5,0.06,0.5,col,0,0.45,0);if(seatCol)box(g,0.44,0.05,0.44,seatCol,0,0.51,0,false);
  for(const [lx,lz] of [[-.21,-.21],[.21,-.21],[-.21,.21],[.21,.21]])box(g,0.05,0.45,0.05,col,lx,0,lz);
  box(g,0.05,0.5,0.05,col,-.21,0.5,-.23);box(g,0.05,0.5,0.05,col,.21,0.5,-.23);
  for(let i=0;i<4;i++)box(g,0.03,0.38,0.03,col,-.12+i*.08,0.56,-.23,false);
  box(g,0.46,0.06,0.04,col,0,0.94,-.23);return g;
}
for(const z of [-0.1,1.0,2.1])chair(-1.2,z,Math.PI/2,0xc79a5a);
chair(-0.1,-1.1,0,0xc79a5a);chair(-0.1,3.1,Math.PI,0xc79a5a);
/* Durchreiche-Regal im Esszimmer (weißer Schrank unter der Durchreiche) */
box(W,0.45,1.05,3.0,0xf0ede5,1.2,0,1.0);block(0.95,-0.5,1.4,2.5);

/* ---------- Küche ---------- */
let fridgeBody=null;
function cab(x,z,w,d,h,y,col){return box(W,w,h,d,col||BLUE,x,y,z);}
{cab(2.325,-5.675,1.35,0.65,0.9,0);box(W,1.4,0.05,0.7,0xcfa061,2.325,0.9,-5.65);
 box(W,0.5,0.3,0.4,0xeeeeee,2.5,0.95,-5.7);box(W,0.2,0.35,0.2,0xd9b04a,1.95,0.95,-5.7);
 cab(2.325,-5.8,1.35,0.4,0.8,1.65);
 for(const dx of [-0.34,0.34]){box(W,0.03,0.5,0.02,0x2a3a50,2.325+dx,1.8,-5.59,false);}
 block(1.65,-6,3.0,-5.3);
 fridgeBody=box(W,1.1,2.0,0.85,0xf4f4f1,3.55,0,-5.575);box(W,0.02,1.9,0.02,0x3a3a3a,3.55,0.05,-5.14,false);
 for(const sx of [-1,1])box(W,0.04,0.7,0.04,0x2a2a2a,3.55+sx*0.1,0.9,-5.13,false);
 for(const [mx,my,mc] of [[3.2,1.3,0xe74c3c],[3.8,1.55,0x3498db],[3.3,1.0,0xf1c40f],[3.75,0.85,0x2ecc71],[3.35,1.7,0x9b59b6]])box(W,0.1,0.1,0.02,mc,mx,my,-5.13,false);
 for(let i=0;i<5;i++)box(W,0.11,0.3,0.22,[0xe74c3c,0xf1c40f,0x3498db,0x2ecc71,0xe67e22][i],3.1+i*0.15,2.0,-5.65);
 cab(3.55,-5.8,1.1,0.4,0.45,2.1);   // endet unter der Obergeschoss-Decke (2,6 m): ragt nicht mehr in Decke und Wand hinein
 block(3.0,-6,4.1,-5.15);
 box(W,0.9,2.3,0.6,BLUE,6.7,0,-5.7);box(W,0.03,0.8,0.02,0x2a3a50,6.7,1.2,-5.39,false);block(6.25,-6,7.15,-5.4);
 cab(7.9,-5.8,1.4,0.4,0.8,1.7);
 cylS(W,0.2,0.2,0.65,12,0xf4f4f4,5.95,0,-5.5);cylS(W,0.21,0.21,0.05,12,0xdddddd,5.95,0.65,-5.5);
 /* Ostwand: Spüle + Geschirrspüler */
 cab(8.675,1.5,0.65,6.2,0.9,0);box(W,0.72,0.05,6.3,0xcfa061,8.65,0.9,1.5);
 box(W,0.5,0.03,0.85,0xf0f0f0,8.62,0.95,0.5);cylS(W,0.03,0.03,0.3,6,0xaaaaaa,8.82,0.95,0.5);
 box(W,0.05,0.8,0.7,0xd9dde0,8.32,0.05,2.8);box(W,0.03,0.04,0.5,0x555555,8.29,0.75,2.8,false);box(W,0.02,0.05,0.5,0x2a2f36,8.29,0.9,2.8,false);
 cab(8.8,3.2,0.4,2.7,0.8,1.7);cab(8.8,-1.25,0.4,0.7,0.8,1.7);
 box(W,0.3,0.35,0.25,0xf2f2f2,8.7,0.95,-1.2);box(W,0.2,0.2,0.3,0xcfcfcf,8.65,0.95,3.5);
 block(8.3,-1.6,9,4.6);
 /* Halbinsel mit Herd */
 cab(7.125,4.275,2.45,0.65,0.9,0);box(W,2.55,0.05,0.72,0xcfa061,7.125,0.9,4.275);
 box(W,0.9,0.02,0.55,0x111111,7.0,0.95,4.275,false);for(const [bx,bz] of [[-.2,-.12],[.2,-.12],[-.2,.12],[.2,.12]])cylS(W,0.08,0.08,0.02,10,0x333333,7.0+bx,0.97,4.275+bz);
 block(5.9,3.95,8.35,4.6);
 // Gartentür und Wandtelefon: siehe 11-doors.js
 pic(7.5,1.9,-5.84,0.5,0.6,0xd8a04a,'N');pic(8.2,1.9,-5.84,0.5,0.6,0x4a90c8,'N');pic(3.6,2.5,-5.84,0.5,0.3,0xc8503a,'N');}
/* runder Küchentisch mit weißen Stühlen */
{cylS(W,0.95,0.95,0.06,24,0x9a6a3a,5.0,0.74,0.8);
 for(const a of [0.8,2.4,3.9,5.5])cylS(W,0.04,0.04,0.74,6,0xf2f0ea,5.0+Math.cos(a)*0.65,0,0.8+Math.sin(a)*0.65);
 for(const [dx,dz] of [[-0.35,0.2],[0.3,-0.3],[0.1,0.45]])cylS(W,0.2,0.2,0.012,14,0x7fa0d0,5.0+dx,0.8,0.8+dz);
 block(4.05,-0.15,5.95,1.75);
 for(let i=0;i<4;i++){const a=0.5+i*Math.PI/2,x=5.0+Math.cos(a)*1.45,z=0.8+Math.sin(a)*1.45;chair(x,z,Math.atan2(5.0-x,0.8-z),0xf2f0ea,0x6a8fbf);}}

/* Lichter im Erdgeschoss */
{const l1=new THREE.PointLight(0xffe2b0,0.6,16);l1.position.set(-4,2.5,0.5);W.add(l1);
 const l2=new THREE.PointLight(0xfff0cf,0.5,14);l2.position.set(5.2,2.5,0.5);W.add(l2);}
