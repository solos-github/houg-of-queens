/* ---------- Gegenstände für Aufgaben (Wäschekorb, Einkaufstüte, Post, …) ---------- */
function makeItem(kind){
  const g=new THREE.Group();
  const tilt=(m,x,y,z)=>{m.rotation.set(x||0,y||0,z||0);return m;};
  switch(kind){
  case 'trash':{
    sph(g,0.26,0x1b1b1d,0,0,0,1,1.15,0.95);
    cylS(g,0.07,0.1,0.14,8,0x1b1b1d,0,0.55,0);sph(g,0.08,0x1b1b1d,0.07,0.7,0,1,0.8,1);sph(g,0.08,0x1b1b1d,-0.07,0.7,0.02,1,0.8,1);
    sph(g,0.07,0x3a3a3f,0.12,0.25,0.18,1,1.6,0.5);break;}
  case 'laundry':{
    cylS(g,0.28,0.23,0.36,14,0xc9a36b,0,0,0);
    for(let i=0;i<3;i++)cylS(g,0.285-i*0.004,0.285-i*0.004,0.025,14,0xa8824f,0,0.06+i*0.11,0);
    cylS(g,0.29,0.29,0.03,14,0xb08a55,0,0.34,0);
    sph(g,0.2,0x8fb8e8,-0.07,0.42,0.02,1.2,0.55,1);
    tilt(box(g,0.34,0.06,0.26,0xffffff,0.06,0.42,-0.05),0.1,0.3,0.15);
    sph(g,0.12,0xe05a5a,0.12,0.46,0.1,1,0.7,1);
    tilt(box(g,0.3,0.05,0.18,0xf2d65c,-0.12,0.46,-0.1),0,-0.4,0.1);break;}
  case 'groceries':{
    box(g,0.42,0.46,0.3,0xc8a064,0,0,0);
    box(g,0.43,0.04,0.31,0xb58d52,0,0.46,0);
    tilt(cylS(g,0.045,0.045,0.5,8,0xd9a65b,-0.1,0.3,0.02),0,0,-0.18);
    tilt(cylS(g,0.0,0.05,0.22,8,0xe8832a,0.08,0.38,0.05),0,0,0.2);
    cylS(g,0.03,0.0,0.12,6,0x3e9c3a,0.1,0.58,0.04);
    box(g,0.12,0.2,0.1,0xffffff,0.12,0.44,-0.06);box(g,0.12,0.06,0.1,0x3a73c9,0.12,0.64,-0.06,false);
    sph(g,0.07,0xd63a3a,-0.12,0.52,-0.08);sph(g,0.07,0x7fc241,-0.02,0.52,0.1);break;}
  case 'post':{
    for(let i=0;i<5;i++)tilt(box(g,0.3,0.018,0.2,i%2?0xf2ede0:0xe8e0cf,0,i*0.02,0),0,(i-2)*0.12,0);
    tilt(box(g,0.32,0.02,0.24,0x3a7bd5,0,0.105,0),0,0.2,0);
    box(g,0.06,0.022,0.045,0xd63a3a,0.09,0.13,-0.05,false);break;}
  case 'dishes':{
    for(let i=0;i<5;i++)cylS(g,0.2-(i%2)*0.01,0.15,0.03,16,i%2?0xf5f5f5:0xe9eef2,0,i*0.032,0);
    cylS(g,0.07,0.06,0.1,10,0x3a73c9,0.2,0,0.1);break;}
  case 'can':{
    cylS(g,0.14,0.15,0.24,14,0x3aa08a,0,0,0);
    tilt(cylS(g,0.025,0.035,0.34,8,0x3aa08a,0.2,0.1,0),0,0,-0.9);
    cylS(g,0.045,0.045,0.04,10,0x2c7f6c,0.34,0.36,0);
    box(g,0.04,0.2,0.04,0x2c7f6c,-0.15,0.1,0);box(g,0.2,0.04,0.04,0x2c7f6c,-0.06,0.3,0);break;}
  case 'charcoal':{
    box(g,0.42,0.52,0.14,0x2a2a2d,0,0,0);box(g,0.3,0.18,0.01,0xd24a2a,0,0.2,0.075,false);
    box(g,0.2,0.03,0.011,0xffffff,0,0.3,0.076,false);break;}
  case 'sausage':{
    cylS(g,0.2,0.18,0.03,14,0xf5f5f5,0,0,0);
    for(let i=0;i<3;i++)tilt(cylS(g,0.035,0.035,0.26,8,i%2?0xc8643c:0xd77a52,-0.07+i*0.07,0.07,0),Math.PI/2,0,0).position.z=0;break;}
  case 'parcel':{
    box(g,0.55,0.38,0.42,0xc8a064,0,0,0);box(g,0.09,0.385,0.425,0xe8d9b0,0,0,0,false);
    box(g,0.14,0.002+0.005,0.1,0xffffff,0.16,0.385,0.08,false);box(g,0.1,0.15,0.01,0xf4f4f4,0.12,0.15,0.215,false);break;}
  case 'bulb':{
    sph(g,0.075,0xfff3b0,0,0.1,0);cylS(g,0.04,0.04,0.08,8,0x9a9a9a,0,0,0);box(g,0.14,0.14,0.14,0xe9e9e9,0,-0.0,0,false).visible=false;break;}
  case 'bottles':{
    for(let i=0;i<3;i++){const x=(i-1)*0.1;cylS(g,0.05,0.05,0.24,8,i===1?0x7a4a24:0x2f7d3a,x,0,(i%2)*0.05);cylS(g,0.02,0.03,0.12,8,i===1?0x7a4a24:0x2f7d3a,x,0.24,(i%2)*0.05);}break;}
  case 'veg':{
    box(g,0.42,0.14,0.3,0x8a5a30,0,0,0);
    sph(g,0.09,0xd63a3a,-0.1,0.2,0.02);sph(g,0.09,0xd63a3a,0.05,0.2,-0.06);sph(g,0.12,0x5cb04a,0.1,0.22,0.06,1,0.9,1);
    tilt(cylS(g,0.0,0.05,0.22,8,0xe8832a,-0.04,0.17,0.1),0,0,1.2);sph(g,0.07,0xf2c744,-0.14,0.18,-0.07);break;}

  case 'rolls':{   // Brötchentüte
    box(g,0.3,0.34,0.2,0xd9b98a,0,0,0);tilt(box(g,0.3,0.05,0.06,0xc4a272,0,0.34,0),0.4,0,0);tilt(box(g,0.3,0.05,0.06,0xc4a272,0,0.34,0.07),-0.4,0,0);
    for(const [x,z] of [[-0.07,0],[0.07,0.02],[0,-0.03]]){sph(g,0.075,0xc88a4a,x,0.42,z,1,0.8,1.15);box(g,0.07,0.01,0.01,0xe8c590,x,0.47,z,false);}
    box(g,0.16,0.1,0.01,0xf4f1ea,0,0.16,0.105,false);box(g,0.1,0.02,0.012,0xb8472a,0,0.2,0.108,false);break;}
  case 'milk':{    // Milchtüte + Eierkarton
    box(g,0.11,0.24,0.11,0xf6f6f2,-0.09,0,0);box(g,0.112,0.07,0.112,0x3a73c9,-0.09,0.08,0,false);
    tilt(box(g,0.11,0.01,0.08,0xe9e9e4,-0.09,0.26,-0.03),0.7,0,0);tilt(box(g,0.11,0.01,0.08,0xe9e9e4,-0.09,0.26,0.03),-0.7,0,0);
    box(g,0.26,0.05,0.09,0xcdb58f,0.1,0,0);
    for(let i=0;i<3;i++)sph(g,0.034,0xf6ecd8,0.03+i*0.07,0.07,0,1,1.25,1);
    box(g,0.26,0.02,0.09,0xbfa67c,0.1,0.05,0,false).visible=false;break;}
  case 'paper':{   // Zeitung + Chipstüte
    tilt(box(g,0.3,0.03,0.22,0xe6e2d6,0,0,0),0,0.15,0);
    for(let i=0;i<5;i++)tilt(box(g,0.24,0.004,0.012,0x3a3a3a,0,0.032,-0.07+i*0.035),0,0.15,0);
    box(g,0.1,0.01,0.07,0x6a6a6a,-0.07,0.034,-0.08,false);
    tilt(box(g,0.2,0.3,0.06,0xd83a2a,0.08,0.03,0.02),0.25,-0.3,0.1);
    tilt(box(g,0.2,0.03,0.07,0xb52f22,0.1,0.33,0.05),0.25,-0.3,0.1);
    tilt(cylS(g,0.06,0.06,0.01,12,0xf2c744,0.07,0.2,0.07),Math.PI/2+0.25,0,0);break;}
  case 'cakepan':{ // Kuchenform mit Kuchen
    cylS(g,0.22,0.2,0.07,18,0xb9bcc2,0,0,0);
    cylS(g,0.19,0.19,0.05,18,0xc9915a,0,0.07,0);cylS(g,0.16,0.16,0.012,18,0xf4f1ea,0,0.12,0);
    for(let i=0;i<6;i++){const a=i*1.047;sph(g,0.02,0xd63a3a,Math.cos(a)*0.1,0.14,Math.sin(a)*0.1);}
    box(g,0.22,0.012,0.22,0xe6e0d0,0,-0.0,0,false).visible=false;break;}
  case 'bundle':{  // Altpapier-Bündel
    for(let i=0;i<9;i++)tilt(box(g,0.34,0.026,0.26,i%3===0?0xe6e2d6:(i%3===1?0xd3d0c6:0xc9c4b4),0,i*0.027,0),0,(i-4)*0.05,0);
    box(g,0.012,0.25,0.012,0xb08a55,0.05,0,0.0,false).visible=false;
    box(g,0.36,0.012,0.012,0xb08a55,0,0.1,0.0,false);box(g,0.012,0.012,0.28,0xb08a55,0.03,0.2,0,false);box(g,0.36,0.012,0.012,0xb08a55,0,0.2,0.0,false);break;}
  case 'sandwich':{ // Papiertüte mit versteckten Sandwiches
    box(g,0.3,0.34,0.2,0xc8a064,0,0,0);tilt(box(g,0.3,0.05,0.05,0xb58d52,0,0.34,-0.08),0.5,0,0);
    for(const [x,r] of [[-0.06,-0.15],[0.07,0.2]]){
      const s=new THREE.Group();s.position.set(x,0.34,0.0);s.rotation.set(0,r,0.0);g.add(s);
      box(s,0.17,0.035,0.15,0xe8c27a,0,0,0);box(s,0.16,0.02,0.14,0xa4d05a,0,0.035,0,false);box(s,0.15,0.02,0.13,0xe59a9a,0,0.055,0,false);box(s,0.17,0.035,0.15,0xe8c27a,0,0.075,0);
      cylS(s,0.006,0.006,0.14,5,0xd9c27a,0,0.0,0);box(s,0.04,0.025,0.01,0xd63a3a,0.0,0.14,0,false);}
    break;}
  case 'whoopee':{ // Furzkissen
    sph(g,0.24,0xe85a9a,0,0.05,0,1,0.26,0.8);sph(g,0.2,0xf27ab4,-0.02,0.07,-0.02,1,0.22,0.7);
    tilt(cylS(g,0.035,0.045,0.12,8,0xc23c7a,0.24,0.04,0.0),0,0,-1.45);
    sph(g,0.05,0xfff0f6,-0.08,0.11,-0.08,1,0.3,0.6);break;}
  case 'cable':{   // Fernsehkabel mit Stecker
    let x=0,z=0;
    for(let i=0;i<9;i++){const nx=Math.sin((i+1)*0.8)*0.12,nz=(i+1)*0.1;const dx=nx-x,dz=nz-z,L=Math.hypot(dx,dz);
      const seg=cylS(g,0.014,0.014,L+0.01,6,0x222226,(x+nx)/2,0.012,(z+nz)/2);seg.rotation.set(Math.PI/2,0,0);seg.rotation.order='YXZ';seg.rotation.y=Math.atan2(dx,dz);x=nx;z=nz;}
    box(g,0.07,0.03,0.05,0x1a1a1c,x,0,z+0.03);box(g,0.012,0.012,0.04,0xc9c9c9,x-0.02,0.01,z+0.07,false);box(g,0.012,0.012,0.04,0xc9c9c9,x+0.02,0.01,z+0.07,false);break;}
  case 'bucket':{  // Wassereimer
    cylS(g,0.15,0.11,0.28,14,0x8a949c,0,0,0);cylS(g,0.153,0.153,0.02,14,0x6f7881,0,0.26,0);cylS(g,0.135,0.135,0.012,14,0x4aa8d8,0,0.265,0);
    const h=new THREE.Mesh(new THREE.TorusGeometry(0.15,0.01,6,14,Math.PI),M(0x555b61));h.position.y=0.28;g.add(h);
    for(const [x,z] of [[0.19,0.06],[-0.17,-0.12]])sph(g,0.025,0x4aa8d8,x,0.012,z,1.4,0.35,1.4);break;}
  case 'spider':{  // Plastikspinne
    sph(g,0.07,0x1b1b1d,0,0.08,0,1,0.8,1.2);sph(g,0.045,0x1b1b1d,0,0.09,0.1);
    sph(g,0.012,0xd63a3a,-0.02,0.105,0.14);sph(g,0.012,0xd63a3a,0.02,0.105,0.14);
    for(let i=0;i<4;i++)for(const sx of [-1,1]){
      const a=(i-1.5)*0.45;
      const l1=box(g,0.12,0.012,0.012,0x1b1b1d,sx*0.09,0.1,(i-1.5)*0.03,false);l1.rotation.y=-sx*a*0.6;l1.rotation.z=sx*0.5;
      const l2=box(g,0.12,0.012,0.012,0x1b1b1d,sx*0.17,0.05,(i-1.5)*0.05,false);l2.rotation.y=-sx*a*0.6;l2.rotation.z=-sx*0.9;}
    break;}
  case 'shoes':{   // zusammengebundene Turnschuhe
    for(const [x,z,r] of [[-0.1,0,0.15],[0.1,0.03,-0.2]]){
      const s=new THREE.Group();s.position.set(x,0,z);s.rotation.y=r;g.add(s);
      box(s,0.1,0.035,0.27,0xf2f2f2,0,0,0);box(s,0.095,0.07,0.15,0x3a73c9,0,0.035,-0.05);sph(s,0.05,0x3a73c9,0,0.06,0.09,1,0.7,1.2);
      box(s,0.07,0.012,0.08,0xffffff,0,0.105,0.0,false);box(s,0.1,0.06,0.03,0x2a5aa0,0,0.035,-0.14);}
    for(let i=0;i<3;i++){const l=box(g,0.22,0.008,0.012,0xf2f2f2,0,0.1,-0.02+i*0.03,false);l.rotation.y=(i-1)*0.4;}
    sph(g,0.025,0xf2f2f2,0,0.1,0.02);break;}
  case 'saltsugar':{ // Salz- und Zuckerstreuer (vertauscht)
    for(const [x,col,cap] of [[-0.06,0xeaf0f2,0xbfc4c8],[0.06,0xf4eedc,0xd9a45b]]){
      cylS(g,0.032,0.032,0.1,10,col,x,0,0);cylS(g,0.034,0.034,0.03,10,cap,x,0.1,0);
      box(g,0.04,0.03,0.005,x<0?0x3a73c9:0xd63a3a,x,0.04,0.033,false);}
    tilt(box(g,0.12,0.005,0.012,0xffffff,0,0.002,0.09),0,0.3,0);break;}
  case 'doll':{    // Gruselpuppe
    cylS(g,0.05,0.09,0.2,10,0x7a2a3a,0,0,0);
    sph(g,0.075,0xf0d9c4,0,0.27,0);sph(g,0.085,0x1b1b1d,0,0.3,-0.02,1,0.8,1);
    sph(g,0.02,0x111111,-0.03,0.275,0.065);sph(g,0.02,0x111111,0.03,0.275,0.065);sph(g,0.008,0xffffff,-0.03,0.282,0.082);sph(g,0.008,0xffffff,0.03,0.282,0.082);
    box(g,0.04,0.008,0.01,0xb82020,0,0.235,0.072,false);
    for(const sx of [-1,1])tilt(cylS(g,0.02,0.02,0.15,6,0xf0d9c4,sx*0.08,0.1,0.04),0.9,0,sx*0.4);
    for(const sx of [-1,1])tilt(cylS(g,0.022,0.02,0.16,6,0xf0d9c4,sx*0.035,0,0.09),1.4,0,0);break;}
  case 'folder':{   // Aktenmappe
    box(g,0.34,0.05,0.26,0x2c4f8a,0,0,0);box(g,0.3,0.012,0.22,0xe8e4d6,0,0.05,0,false);box(g,0.1,0.02,0.04,0xd9b43a,0.1,0.052,0.08,false);break;}
  case 'umbrella':{ // zusammengerollter Regenschirm
    cylS(g,0.03,0.03,0.7,8,0x30363f,0,0,0);cylS(g,0.05,0.03,0.5,8,0x2a6bd1,0,0.2,0);tilt(cylS(g,0.02,0.02,0.1,6,0x8a5a2b,0,0.7,0),0,0,0);break;}
  case 'takeout':{  // Boopers-Tüte mit Pommes
    box(g,0.28,0.32,0.18,0xc9a06a,0,0,0);tilt(box(g,0.28,0.05,0.06,0xb48a55,0,0.32,0),0.4,0,0);tilt(box(g,0.28,0.05,0.06,0xb48a55,0,0.32,0.06),-0.4,0,0);
    box(g,0.14,0.1,0.01,0xf5d04a,0,0.12,0.095,false);box(g,0.1,0.02,0.012,0xb8472a,0,0.17,0.098,false);
    for(let i=0;i<4;i++)box(g,0.015,0.1,0.015,0xf3c94d,-0.05+i*0.034,0.34,0,false);break;}
  default:box(g,0.5,0.4,0.4,0x888888,0,0,0);
  }
  g.traverse(o=>{if(o.isMesh){o.castShadow=true;}});
  return g;
}
