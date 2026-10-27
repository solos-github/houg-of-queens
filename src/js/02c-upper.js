/* ---------- Haustür, Obergeschoss, Keller, Wegenetz ---------- */
setFloor(0);
box(W,0.9,0.02,1.4,0x6a4a2a,-7.9,0,0,false);
{const g=new THREE.Mesh(new THREE.PlaneGeometry(0.7,0.4),new THREE.MeshStandardMaterial({color:0x3fb0a8,emissive:0x1a5a55,roughness:.3}));
 g.position.set(-8.84,2.6,0);g.rotation.y=Math.PI/2;W.add(g);}

/* ----- Obergeschoss ----- */
setFloor(1);
{const m=MT(TX_WOOD_UP,.9);
 tbox(U,7.42,0.3,12.06,m,-5.215,-0.3,0);tbox(U,7.62,0.3,12.06,m,5.115,-0.3,0);tbox(U,2.8,0.3,10.32,m,-0.1,-0.3,0.86);   // 2 cm kleiner als die Außenflächen der Wände: kein Z-Fighting mit dem Mauerwerk darunter
 tbox(U,10.3,0.03,9.2,MT(TX_CARPET,1),-3.85,0,1.4);
 tbox(U,5,0.03,4.5,MT(TX_TILE_B,.7),6.5,0,-3.75);
 const r=tbox(U,3.2,0.03,2.2,MT(TX_RUG1,1),-4.2,0.03,1.5);
 const h=tbox(U,8,0.03,1.2,MT(TX_RUG3,1),2.65,0,0.5);h.rotation.y=Math.PI/2;}
wall('z',-9,-6,6,[[-4.6,-2.6,'w'],[2.6,4.6,'w']],[UPW,BRICK],{inS:1});
wall('x',-6,-9,9,[[6.2,7.8,'w']],[UPW,BRICK],{inS:1});
wall('x',6,-9,9,[[-6.8,-4.6,'w'],[-2.8,-0.6,'w'],[2.0,3.2,'w'],[5.4,7.4,'w']],[BRICK,UPW],{inS:-1});
wall('z',9,-6,6,[[-4.6,-2.8,'w'],[1.5,3.5,'w']],[BRICK,UPW],{inS:-1});
wall('z',1.3,-6,6,[[-6.2,-4.4],[0.2,2.0]],[UPW,UPW],{extA:false,extB:false});
wall('x',-3.2,-9,1.3,[],[UPW,UPW],{extB:false});
wall('z',4.0,-6,6,[[-4.8,-3.2],[1.5,3.1]],[UPW,UPW],{extA:false,extB:false});
wall('x',-1.5,4,9,[],[UPW,TILEW],{extA:false});
/* Bad: dunkle Wandverkleidung, damit der Raum nicht überstrahlt */
{const BP=0x4f7f88,BP2=0x3f6a73;
 for(const [w,h,d,x,y,z] of [[4.7,2.9,0.05,6.5,0,-5.82],[0.05,2.9,1.05,4.18,0,-5.3],[0.05,2.9,1.55,4.18,0,-2.43],[0.05,2.9,1.2,8.82,0,-5.25],[0.05,2.9,1.15,8.82,0,-2.22],[0.05,0.95,1.8,8.82,0,-3.7],[0.05,0.65,1.8,8.82,2.25,-3.7],[4.7,2.9,0.05,6.5,0,-1.68]])box(U,w,h,d,BP,x,y,z,false);
 box(U,4.7,0.05,0.07,BP2,6.5,1.15,-5.8,false);box(U,4.7,0.05,0.07,BP2,6.5,1.15,-1.66,false);}
/* Geländer am Treppenloch */
block(-1.6,-4.6,1.4,-4.48);
box(U,2.9,0.06,0.08,0x5a3b22,-0.1,0.9,-4.45,false);
for(const x of [-1.4,-0.4,0.6,1.2])box(U,0.06,0.9,0.06,TRIM,x,0,-4.45,false);
/* Schlafzimmer */
{box(U,3.0,0.45,2.2,0x6b4a2f,-7.5,0,1.1);box(U,2.8,0.25,2.0,0xe8e0f0,-7.45,0.45,1.1);
 box(U,0.12,1.1,2.3,0x5a3b22,-8.95,0,1.1);
 box(U,0.4,0.15,0.8,0xffffff,-8.5,0.7,0.65);box(U,0.4,0.15,0.8,0xffffff,-8.5,0.7,1.55);
 box(U,1.7,0.08,2.05,0x7a8fb5,-6.9,0.7,1.1);block(-9,-0.05,-5.95,2.25);
 for(const z of [-0.5,2.7]){box(U,0.5,0.55,0.5,0x6b4a2f,-8.65,0,z);cylS(U,0.1,0.13,0.2,8,0x884422,-8.65,0.55,z);cylS(U,0.13,0.2,0.28,10,0xf2c98a,-8.65,0.75,z);block(-8.95,z-0.3,-8.35,z+0.3);}
 box(U,2.2,2.2,0.7,0x6b4a2f,-4.0,0,-2.7);for(const sx of [-1,1])box(U,0.04,1.6,0.03,0x4a2e1c,-4.0+sx*0.55,0.3,-2.33,false);block(-5.1,-3.1,-2.9,-2.3);
 box(U,1.6,0.9,0.5,0x7a5a3a,-2.0,0,5.6);box(U,1.1,0.8,0.04,0xcfe8f2,-2.0,1.0,5.85,false);block(-2.8,5.3,-1.2,5.9);
 box(U,0.7,0.5,0.7,0xd9b46a,-3.5,0,4.4);block(-3.85,4.05,-3.15,4.75);
 // Kleiderschrank an der Südwand (zwischen den Fenstern), Türen zum Raum
 box(U,1.6,2.1,0.6,0x7a5a3a,-3.7,0,5.55);box(U,0.03,1.9,0.02,0x3e2a18,-3.7,0.1,5.24,false);box(U,1.64,0.06,0.64,0x6b4a2f,-3.7,2.1,5.55,false);
 for(const sx of [-1,1])box(U,0.04,0.2,0.03,0xd9c27a,-3.7+sx*0.12,1.0,5.22,false);
 block(-4.5,5.25,-2.9,5.85);}
/* Bad */
{box(U,2.8,0.6,1.0,0xc9d2d8,7.6,0,-5.5);box(U,2.5,0.04,0.7,0x7ec8e3,7.6,0.56,-5.5,false);block(6.2,-6,9,-4.95);
 box(U,0.7,0.4,0.8,0xd2dade,5.0,0,-5.3);box(U,0.7,0.7,0.25,0xd2dade,5.0,0.4,-5.7);block(4.6,-6,5.4,-4.85);
 box(U,0.5,0.85,0.55,0xd2dade,4.55,0,-2.4);box(U,0.05,0.8,0.7,0xcfe8f2,4.2,1.3,-2.4,false);block(4.3,-2.7,4.9,-2.1);
 box(U,0.6,0.04,1.0,0x5aa0d0,6.0,0.03,-2.3,false);}
/* Gästezimmer / Rumpelkammer */
{ // Schreibtisch am Ostfenster: Monitor, Tastatur, Maus, Laptop rechts
 const WD=0x8a6a40,WD2=0x6f5230;
 box(U,0.8,0.05,2.1,WD,8.55,0.72,3.0);
 for(const [x,z] of [[8.2,2.1],[8.2,3.9],[8.88,2.1],[8.88,3.9]])box(U,0.06,0.72,0.06,WD2,x,0,z);
 box(U,0.04,0.55,1.9,WD2,8.92,0.17,3.0);box(U,0.5,0.18,0.5,WD2,8.62,0.5,2.4);      // Rückwand + Schubladenblock
 box(U,0.4,0.02,0.04,0x222222,8.37,0.62,2.4,false);
 block(8.1,1.9,9,4.1);
 // Monitor mittig
 box(U,0.22,0.015,0.28,0x1c1c1f,8.72,0.77,2.65);box(U,0.04,0.2,0.05,0x1c1c1f,8.76,0.78,2.65);
 box(U,0.045,0.42,0.7,0x111114,8.78,0.97,2.65);
 {const sc=document.createElement('canvas');sc.width=256;sc.height=140;const c=sc.getContext('2d');
  c.fillStyle='#1d3f7a';c.fillRect(0,0,256,140);c.fillStyle='#e8eef8';c.fillRect(0,0,256,16);c.fillStyle='#1d3f7a';c.font='bold 12px Arial';c.fillText('Houg-Shop  ·  Online',6,12);
  for(let i=0;i<6;i++){c.fillStyle=['#f5c542','#7fd16a','#e86aa4','#58b4ff','#f5c542','#7fd16a'][i];c.fillRect(10+(i%3)*80,30+Math.floor(i/3)*52,70,42);c.fillStyle='#fff';c.fillRect(14+(i%3)*80,62+Math.floor(i/3)*52,40,5);}
  const t=new THREE.CanvasTexture(sc);const m=new THREE.Mesh(new THREE.PlaneGeometry(0.64,0.36),new THREE.MeshBasicMaterial({map:t}));
  m.position.set(8.752,1.0,2.65);m.rotation.y=-Math.PI/2;U.add(m);}
 // Tastatur + Maus
 box(U,0.17,0.018,0.46,0x2a2a2e,8.3,0.77,2.65);box(U,0.15,0.006,0.42,0x8d9096,8.3,0.788,2.65,false);
 box(U,0.07,0.025,0.045,0x15151a,8.32,0.77,3.05);
 // Laptop auf der rechten Tischseite
 box(U,0.28,0.02,0.4,0xb9bcc2,8.35,0.77,3.55);box(U,0.2,0.004,0.26,0x2a2a2e,8.33,0.79,3.55,false);
 {const lid=box(U,0.012,0.26,0.4,0xb9bcc2,8.5,0.79,3.55,false);lid.rotation.z=-0.3;
  const ls=new THREE.Mesh(new THREE.PlaneGeometry(0.37,0.23),new THREE.MeshBasicMaterial({color:0x58b4ff}));
  ls.position.set(8.485,0.92,3.55);ls.rotation.set(0,-Math.PI/2,-0.3);U.add(ls);}
 // Bürostuhl
 box(U,0.45,0.05,0.45,0x2f3a4a,7.8,0.45,2.65);box(U,0.06,0.45,0.06,0x333333,7.8,0,2.65);
 box(U,0.5,0.05,0.5,0x222222,7.8,0.02,2.65,false);box(U,0.06,0.5,0.42,0x2f3a4a,7.58,0.5,2.65);
 for(let i=0;i<4;i++)box(U,0.8,0.6,0.8,0xb08a55,4.7+(i%2)*0.9,Math.floor(i/2)*0.6,5.3);block(4.3,4.9,6.5,5.8);
 box(U,0.4,1.8,1.6,0x6b4a2f,8.7,0,0.0);block(8.4,-0.8,9,0.8);}
/* Flur */
{cylS(U,0.2,0.16,0.3,10,0xa0522d,3.4,0,5.3);for(let i=0;i<6;i++)sph(U,0.17,0x2f8f4a,3.4+Math.sin(i)*0.2,0.6+i*0.07,5.3+Math.cos(i*1.7)*0.2,1,0.8,1);block(3.1,5.0,3.7,5.6);
 for(const [z,c] of [[-1.0,0xd8c0a0],[3.6,0xc8d8b0],[4.9,0xb0c4d8]])pic(1.55,1.4,z,0.5,0.6,c,'W2');}
{const l1=new THREE.PointLight(0xffe2b0,0.55,14);l1.position.set(-4,2.4,1.5);U.add(l1);
 const l2=new THREE.PointLight(0xfff0cf,0.45,12);l2.position.set(2.7,2.4,0);U.add(l2);}

/* ----- Keller ----- */
setFloor(-1);
tbox(BM,12.6,0.3,5.6,MT(TX_CONC,1),3,-0.3,-13.4);tbox(BM,1.3,0.3,2.6,MT(TX_CONC,1),4.95,-0.3,-9.5);
wall('z',-3,-16,-10.8,[],[GREYW,GREYW]);
wall('z',9,-16,-10.8,[],[GREYW,GREYW]);
wall('x',-16,-3,9,[],[GREYW,GREYW]);
wall('x',-10.8,-3,9,[[4.3,5.6]],[GREYW,GREYW]);
wall('z',4.15,-10.8,-8,[],[GREYW,GREYW],{extA:false,extB:false});
wall('z',5.75,-10.8,-8,[],[GREYW,GREYW],{extA:false,extB:false});
{box(BM,2.2,0.4,1.0,0x5b6b4a,-1.9,0,-14.8);box(BM,2.0,0.2,0.9,0xe0d8c8,-1.9,0.4,-14.8);box(BM,0.4,0.12,0.7,0xffffff,-2.6,0.6,-14.8);block(-3,-15.35,-0.8,-14.25);
 box(BM,0.7,0.5,0.7,0xb08a55,-1.9,0,-11.8);box(BM,0.6,0.5,0.5,0x262626,-1.9,0.5,-11.8);block(-2.3,-12.2,-1.5,-11.4);
 box(BM,1.1,0.4,1.0,0x6a3a3a,1.2,0,-12.2);box(BM,1.1,0.8,0.3,0x5a2a2a,1.2,0.4,-12.6);block(0.6,-12.8,1.8,-11.7);
 box(BM,2.4,1.0,0.8,WOODM,6.5,0,-15.4);block(5.3,-15.9,7.7,-14.9);
 for(const z of [-12.2,-13.1])box(BM,0.9,1.0,0.8,0xe8e8e8,8.4,0,z);block(7.9,-13.6,9,-11.8);
 cylS(BM,0.35,0.35,1.6,12,0x8a6a5a,8.3,0,-15.0);block(7.9,-15.5,8.7,-14.5);
 for(let i=0;i<5;i++)box(BM,0.8,0.6,0.8,0xb08a55,-2.4+(i%3)*0.85,Math.floor(i/3)*0.6,-10.0+0);
 cylS(BM,0.02,0.02,0.7,4,0x222222,3,2.2,-13.4);cylS(BM,0.1,0.1,0.16,8,0xffe9a0,3,2.0,-13.4);
 const l=new THREE.PointLight(0xffe9b0,0.75,15);l.position.set(3,2.2,-13.4);BM.add(l);
 const l2=new THREE.PointLight(0xffe9b0,0.5,10);l2.position.set(4.95,1.8,-9.5);BM.add(l2);}
setFloor(0);

/* ----- Wegenetz für NPCs: Knoten [x,z,y] ----- */
const NODES={Fo:[-11.5,0,0],F:[-7.8,0,0],A:[-7.2,2.0,0],B:[-3.5,2.0,0],E:[-2.6,4.4,0],G:[0.8,3.8,0],K1:[2.4,3.3,0],K2:[3.0,2.5,0],
  K3:[3.2,-2.2,0],KF:[3.4,-4.0,0],A1:[4.95,-4.6,0],A2:[4.95,-7.0,0],SD:[4.95,-8.3,0],SB:[4.95,-10.9,-2.9],
  KI:[3,-13.5,-2.9],KB:[7,-13.5,-2.9],KC:[-1,-13.5,-2.9],KS:[7.2,3.3,0],W1:[-2.3,0.8,0],GD:[23.5,-0.15,0],G1:[23.5,-1.4,0],GA:[21.6,-1.6,0],GB:[22.8,-1.5,0],GC:[24.1,-1.7,0],GSA:[22.0,-3.05,0],GSB:[22.8,-3.05,0],GSC:[23.6,-3.05,0],GS:[11.0,3.6,0],GY:[23.5,3.6,0],KD:[7.8,-3.3,0],GT:[9.7,-3.2,0],GGc:[11.8,-3.2,0],GG1:[11.8,-1.2,0],GG2:[15.4,-1.2,0],GG3:[15.2,-3.4,0],N1:[-1.5,-2.3,0],DW:[0.9,-2.5,0],DE:[2.4,-2.5,0]};
const EDGES=[['Fo','F'],['F','A'],['A','B'],['B','E'],['E','G'],['K1','K2'],['K2','K3'],['K3','KF'],['KF','A1'],['A1','A2'],
  ['A2','SD'],['SD','SB'],['SB','KI'],['KI','KB'],['KI','KC'],['K1','KS'],['B','W1'],['GD','G1'],['G1','GA'],['G1','GB'],['G1','GC'],['K3','KD'],['KD','GT'],['GT','GGc'],['GGc','GG1'],['GGc','GG2'],['GGc','GG3'],['W1','N1'],['N1','DW'],['DW','DE'],['DE','K3'],['GG1','GS'],['GS','GY'],['GY','GD'],['G1','GSB'],['GSB','GSA'],['GSB','GSC']];
const ADJ={};for(const k in NODES)ADJ[k]=[];
for(const [a,b] of EDGES){ADJ[a].push(b);ADJ[b].push(a);}
function route(from,to){
  if(from===to)return [];
  const prev={},q=[from];prev[from]=null;
  while(q.length){const c=q.shift();if(c===to)break;for(const n of ADJ[c])if(!(n in prev)){prev[n]=c;q.push(n);}}
  if(!(to in prev))return [];
  const out=[];for(let c=to;c!==from;c=prev[c])out.unshift(c);return out;
}
