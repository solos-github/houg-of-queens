/* ---------- Garage im Garten: dort, wo vorher der östliche Zaun stand (geradeaus von der Küchentür), ohne Auto ---------- */
setFloor(0);
const GROOF=new THREE.Group();scene.add(GROOF);
{
  const GX0=18.2,GX1=34.2,GMID=26.2,GZ0=-6.2,GZ1=-0.2;   // doppelt so lang: Osthälfte mit Auto, Kicker, Kühlschrank, Werkzeugschrank                 // Wandmittellinien
  const DX=27.2,DZ=5.8;                                       // Verschiebung gegenüber dem alten Standort
  const cx=(GX0+GX1)/2,cz=(GZ0+GZ1)/2;
  tbox(W,16.3,0.4,6.3,MT(TX_CONC),cx,-0.4,cz);                // Betonboden
  wall('z',GX0,GZ0,GZ1,[[-5.5,-0.7]],[CREAM,BRICK],{inS:1});   // Gartenseite, Toröffnung (Tor siehe 11-doors.js)
  wall('z',GMID,GZ0,GZ1,[[-4.9,-0.25]],[CREAM,CREAM],{inS:1,extB:false});   // Trennwand mit breiter Öffnung
  wall('z',GX1,GZ0,GZ1,[[-5.5,-0.7]],[BRICK,CREAM],{inS:-1});   // zweites Garagentor (Osten, siehe 11-doors.js)
  wall('x',GZ0,GX0,GX1,[[32.0,33.6,'w',1.0,2.2]],[CREAM,BRICK],{inS:1});
  wall('x',GZ1,GX0,GX1,[[22.9,24.15],[28.0,30.0,'w',1.0,2.2],[31.0,33.0,'w',1.0,2.2]],[BRICK,CREAM],{inS:-1}); // Südwand mit der grauen Tür zum Hof
  // Platte vor dem Tor
  box(OUT,1.4,0.04,5.4,0xc9c5b8,17.5,-0.05,-3.1,false);box(OUT,1.4,0.04,5.4,0xc9c5b8,35.0,-0.05,-3.1,false);
  // Flachdach mit Attika
  const rs=new THREE.MeshStandardMaterial({color:0x6a6c72,roughness:.95});
  tbox(GROOF,16.7,0.18,6.7,rs,cx,2.9,cz);
  for(const [w,d,x,z] of [[16.7,0.2,cx,GZ0-0.25],[0.2,6.7,GX0-0.25,cz],[0.2,6.7,GX1+0.25,cz],[16.7,0.2,cx,GZ1+0.25]])tbox(GROOF,w,0.4,d,M(0xd8cdb8),x,3.08,z);
  const BR=[0x7a4a24,0x6b4423,0x8a5a30];
  function cabinet(x,z,w,d,h,face,c){   // face: Richtung der Türen als Winkel (0 = +z, PI/2 = +x, -PI/2 = -x)
    const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=face;W.add(g);
    box(g,w,h,d,c||BR[0],0,0,0);
    box(g,w-0.08,0.04,0.02,0x2e1b0c,0,h*0.5,d/2+0.01,false);
    const n=Math.max(1,Math.round(w/0.6));
    for(let i=1;i<n;i++)box(g,0.02,h-0.15,0.02,0x2e1b0c,-w/2+w*i/n,0.07,d/2+0.01,false);
    for(let i=0;i<n;i++)box(g,0.03,0.12,0.03,0xd9c27a,-w/2+w*(i+0.5)/n+0.1,h*0.55,d/2+0.03,false);
    const a=Math.abs(Math.sin(face))>0.5;
    block(x-(a?d:w)/2,z-(a?w:d)/2,x+(a?d:w)/2,z+(a?w:d)/2);
    return g;
  }
  // braune Schränke: Nordwand links/rechts und Ostwand
  cabinet(DX-8.0,DZ-11.6,1.8,0.55,2.0,0,BR[0]);
  cabinet(DX-6.2,DZ-11.6,0.6,0.55,2.0,0,BR[1]);
  cabinet(DX-2.1,DZ-11.6,1.6,0.55,2.0,0,BR[2]);
  // Fernseher auf Sideboard an der Nordwand, Sofa davor
  cabinet(DX-4.4,DZ-11.6,1.8,0.5,0.55,0,BR[1]);
  box(W,1.4,0.78,0.07,0x0e0f12,DX-4.4,0.95,DZ-11.7,false);
  {const gs=new THREE.Mesh(new THREE.PlaneGeometry(1.28,0.66),new THREE.MeshBasicMaterial({map:tvTexture}));gs.position.set(DX-4.4,1.33,DZ-11.655);W.add(gs);}
  box(W,0.5,0.06,0.2,0x1a1a1a,DX-4.4,0.55,DZ-11.6,false);
  {const g=new THREE.Group();g.position.set(DX-4.4,0,DZ-8.7);g.rotation.y=Math.PI;W.add(g);
   const w=2.5,cc=0x7b5a3a,cd=0x8d6b47;                       // braune Couch, Blick zum Fernseher
   box(g,w-0.06,0.25,0.94,0x5a3f27,0,0,0);
   for(let i=0;i<3;i++)box(g,(w-0.5)/3-0.03,0.22,0.78,cd,-(w-0.5)/3+i*(w-0.5)/3,0.25,0.1);
   box(g,w,0.65,0.25,cc,0,0.25,-0.42);
   for(const sx of [-1,1])box(g,0.25,0.55,1.0,cc,sx*(w/2-0.125),0,0);
   block(DX-4.4-w/2,DZ-8.7-0.55,DX-4.4+w/2,DZ-8.7+0.55);}
  tbox(W,2.8,0.02,1.8,MT(TX_RUG3,1),DX-4.4,0,DZ-10.1);          // Teppich
  // Kleinkram (Fass im Nordosten der Westhälfte; Kisten wandern in die Osthälfte, die Fahrspur an der Südwand bleibt frei)
  cylS(W,0.25,0.22,0.55,10,0x3a5f8a,25.5,0,-4.3);block(25.25,-4.55,25.75,-4.05);
  box(W,0.5,0.45,0.5,0xb9a27a,27.0,0,-5.6);block(26.75,-5.85,27.25,-5.35);box(W,0.5,0.45,0.5,0xb9a27a,27.0,0.45,-5.6,false);
  // ---- Osthälfte ----
  // Tischkicker (Nordseite, längs zur x-Achse)
  {const g=new THREE.Group();g.position.set(28.9,0,-1.3);W.add(g);
   for(const sx of [-1,1])for(const sz of [-1,1])box(g,0.08,0.78,0.08,0x2b2b2e,sx*0.62,0,sz*0.3);
   box(g,1.4,0.1,0.75,0x6b4a2f,0,0.78,0);box(g,1.3,0.02,0.65,0x2f8f4a,0,0.88,0,false);
   box(g,1.4,0.16,0.04,0x5a3b22,0,0.88,0.38,false);box(g,1.4,0.16,0.04,0x5a3b22,0,0.88,-0.38,false);
   for(const sx of [-1,1])box(g,0.04,0.16,0.75,0x5a3b22,sx*0.7,0.88,0,false);
   for(const x of [-0.4,0,0.4]){const r=box(g,0.03,0.03,1.0,0xcfcfcf,x,0.98,0,false);for(const z of [-0.2,0,0.2])box(g,0.05,0.12,0.07,x<0?0xd63c3c:0x2a5ad0,x,0.9,z,false);}
   for(const sz of [-1,1]){box(g,0.05,0.05,0.22,0x222,0,0,0,false);cylS(g,0.04,0.04,0.12,6,0x222,0.5*sz,0.98,0.52);}
   block(28.15,-1.72,29.65,-0.88);}
  // Kühlschrank (rot) in der Nordostecke
  {const g=new THREE.Group();g.position.set(33.3,0,-0.8);g.rotation.y=Math.PI;W.add(g);
   box(g,0.8,1.75,0.7,0xb3262a,0,0,0);box(g,0.8,0.02,0.02,0x5a1214,0,1.12,-0.36,false);box(g,0.04,0.5,0.04,0xd8d8d8,0.3,1.2,-0.37,false);box(g,0.04,0.7,0.04,0xd8d8d8,0.3,0.3,-0.37,false);
   block(32.9,-1.15,33.7,-0.45);}
  // Roter Werkzeugschrank mit Schubladen (Rollwagen) an der Nordwand
  {const g=new THREE.Group();g.position.set(31.2,0,-0.65);g.rotation.y=Math.PI;W.add(g);
   box(g,1.5,1.15,0.6,0xc62828,0,0.12,0);box(g,1.54,0.05,0.64,0x1b1b1d,0,1.27,0);box(g,1.5,0.14,0.55,0x555a60,0,0,0,false);
   for(let i=0;i<6;i++){box(g,1.38,0.015,0.02,0x7a1414,0,0.28+i*0.17,-0.31,false);box(g,0.5,0.03,0.03,0xcfd3d8,0,0.34+i*0.17,-0.33,false);}
   for(const sx of [-1,1])cylS(g,0.06,0.06,0.04,8,0x111,sx*0.62,0,-0.2);
   box(g,0.3,0.12,0.2,0x2a2a2e,-0.4,1.32,0,false);box(g,0.04,0.3,0.04,0xe0b020,0.4,1.32,0,false);
   block(30.45,-1.0,31.95,-0.3);}
  // Hinweisschild
  box(W,1.4,0.5,0.03,0xf2b705,27.6,1.6,-6.03,false);box(W,1.3,0.4,0.02,0x1a1a1a,27.6,1.65,-6.02,false);
}
