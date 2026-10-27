/* ---------- Kanzlei-Turm innen (5 Etagen) + Quest "Connie vergisst etwas" mit Wachen und Sichtkegeln ---------- */
const TW={z:240,w:44,d:30,R:9.5,FOV:1.22};
const twx=i=>-220+i*110;
const TWNAME=['Lobby','Großraumbüro','Konferenzetage','Chefetage','Dachlounge'];
const TWF=[];                       // je Etage: {cx,cz,los:[],guards:[],cs:[x,z],cow:[x,z],...}
const TWANIM=[];
const TWCOL={n:0};
function tqFloorAt(x,z){for(let i=0;i<5;i++)if(Math.abs(x-twx(i))<TW.w/2+1&&Math.abs(z-TW.z)<TW.d/2+1)return i;return -1;}
function towerRoom(x,z){const f=tqFloorAt(x,z);return f<0?null:'KANZLEI-TURM · '+(f+1)+'. Etage';}

/* ---- Bausteine ---- */
function fwall(f,axis,pos,a,b,gaps,cs){
  const n0=colliders.length;setFloor(0);
  if(axis==='x')wall('x',f.cz+pos,f.cx+a,f.cx+b,gaps.map(g=>[f.cx+g[0],f.cx+g[1]].concat(g.slice(2))),cs,{});
  else wall('z',f.cx+pos,f.cz+a,f.cz+b,gaps.map(g=>[f.cz+g[0],f.cz+g[1]].concat(g.slice(2))),cs,{});
  for(let i=n0;i<colliders.length;i++){const c=colliders[i];f.los.push([c.x0,c.z0,c.x1,c.z1]);}
}
function fblock(f,lx,lz,w,d,los){
  const x=f.cx+lx,z=f.cz+lz;block(x-w/2,z-d/2,x+w/2,z+d/2);
  if(los)f.los.push([x-w/2,z-d/2,x+w/2,z+d/2]);
}
function fgrp(f,lx,lz,rot){const g=new THREE.Group();g.position.set(f.cx+lx,0,f.cz+lz);g.rotation.y=rot||0;W.add(g);return g;}
function fChair(f,lx,lz,rot,col){
  const g=fgrp(f,lx,lz,rot);col=col||0x3b4b63;
  box(g,0.5,0.07,0.5,col,0,0.45,0);box(g,0.5,0.5,0.07,col,0,0.52,-0.22);cylS(g,0.04,0.04,0.45,6,0x2a2a2e,0,0,0);box(g,0.5,0.04,0.04,0x2a2a2e,0,0.02,0,false);box(g,0.04,0.04,0.5,0x2a2a2e,0,0.02,0,false);
}
function fDesk(f,lx,lz,rot,opt){
  opt=opt||{};const g=fgrp(f,lx,lz,rot),wd=opt.w||1.6,dp=0.8;
  box(g,wd,0.05,dp,opt.col||0x8a6a47,0,0.72,0);box(g,0.06,0.72,dp-0.1,0x4c3a28,-wd/2+0.08,0,0);box(g,0.06,0.72,dp-0.1,0x4c3a28,wd/2-0.08,0,0);
  if(!opt.bare){
    box(g,0.5,0.34,0.04,0x14181e,0.0,0.84,-0.18);box(g,0.5,0.3,0.01,0x4a84c4,0,0.86,-0.155,false);box(g,0.2,0.1,0.03,0x14181e,0,0.77,-0.18);
    box(g,0.42,0.015,0.14,0x23262c,0,0.775,0.08,false);
    if(opt.lamp)cylS(g,0.02,0.05,0.35,6,0xe0c050,0.6,0.77,-0.2);
  }
  const sw=(Math.round(rot/(Math.PI/2))%2)!==0;
  fblock(f,lx,lz,sw?dp:wd,sw?wd:dp,false);
  if(!opt.nochair){const o=0.85,c=Math.cos(rot||0),s=Math.sin(rot||0);fChair(f,lx+s*o,lz+c*o,(rot||0)+Math.PI,opt.chair);}
}
function fPlant(f,lx,lz,s){
  s=s||1;const g=fgrp(f,lx,lz,0);
  cylS(g,0.26*s,0.2*s,0.42*s,10,0x9a6a48,0,0,0);
  for(let i=0;i<5;i++){const a=i*1.26;sph(g,0.3*s,i%2?0x2f8f4a:0x3aa85b,Math.cos(a)*0.18*s,0.7*s+i*0.14*s,Math.sin(a)*0.18*s,1,1.3,1);}
  fblock(f,lx,lz,0.5*s,0.5*s,s>=1.3);
}
function fPillar(f,lx,lz){const g=fgrp(f,lx,lz,0);box(g,1,2.9,1,0xb9b3a8,0,0,0);box(g,1.12,0.2,1.12,0x8e887e,0,0,0);box(g,1.12,0.16,1.12,0x8e887e,0,2.74,0);fblock(f,lx,lz,1,1,true);}
function fFountain(f,lx,lz,big){
  const g=fgrp(f,lx,lz,0),r=big?1.8:1.3;
  cylS(g,r,r+0.1,0.55,24,0x9aa0a8,0,0,0);
  const wt=new THREE.Mesh(new THREE.CylinderGeometry(r-0.12,r-0.12,0.04,24),new THREE.MeshStandardMaterial({color:0x4ab0e0,transparent:true,opacity:0.75,roughness:0.1}));wt.position.y=0.5;g.add(wt);
  cylS(g,0.12,0.18,1.0,10,0xb6bcc4,0,0.55,0);cylS(g,0.55,0.4,0.18,16,0x9aa0a8,0,1.4,0);
  const top=new THREE.Mesh(new THREE.CylinderGeometry(0.43,0.43,0.03,16),new THREE.MeshStandardMaterial({color:0x4ab0e0,transparent:true,opacity:0.75}));top.position.y=1.57;g.add(top);
  const sp=sph(g,0.1,0xbfe6ff,0,1.8,0,1,1.8,1);
  TWANIM.push(t=>{wt.material.opacity=0.68+0.08*Math.sin(t*2+lx);sp.scale.y=1.6+0.4*Math.sin(t*5+lz);});
  fblock(f,lx,lz,r*1.8,r*1.8,false);
}
function fTable(f,lx,lz,w,d,col,round){
  const g=fgrp(f,lx,lz,0);col=col||0x7a5a3c;
  if(round){cylS(g,w/2,w/2,0.05,18,col,0,0.72,0);cylS(g,0.06,0.1,0.72,8,0x3a2e24,0,0,0);}
  else{box(g,w,0.06,d,col,0,0.72,0);for(const sx of[-1,1])for(const sz of[-1,1])box(g,0.07,0.72,0.07,0x3a2e24,sx*(w/2-0.1),0,sz*(d/2-0.1),false);}
  fblock(f,lx,lz,w,d,false);
}
function fSofa(f,lx,lz,rot,col){
  const g=fgrp(f,lx,lz,rot);col=col||0x6a3b4a;
  box(g,2.1,0.4,0.9,col,0,0,0);box(g,2.1,0.5,0.2,col,0,0.4,-0.38);box(g,0.2,0.3,0.9,col,-1.0,0.4,0);box(g,0.2,0.3,0.9,col,1.0,0.4,0);
  const sw=(Math.round(rot/(Math.PI/2))%2)!==0;fblock(f,lx,lz,sw?0.9:2.1,sw?2.1:0.9,false);
}
function fCooler(f,lx,lz){const g=fgrp(f,lx,lz,0);box(g,0.4,0.9,0.4,0xe6e8ea,0,0,0);cylS(g,0.16,0.16,0.45,10,0x7fc4ee,0,0.9,0);fblock(f,lx,lz,0.5,0.5,false);}
function fShelf(f,lx,lz,rot){const g=fgrp(f,lx,lz,rot);box(g,1.6,2.0,0.4,0x6b5239,0,0,0);for(let i=0;i<4;i++){box(g,1.5,0.3,0.3,[0x2c4f8a,0xa23b3b,0x3a7a4a,0xd9b43a][i],0,0.25+i*0.45,0.02,false);}const sw=(Math.round((rot||0)/(Math.PI/2))%2)!==0;fblock(f,lx,lz,sw?0.4:1.6,sw?1.6:0.4,false);}
function fBoard(f,lx,lz,rot){const g=fgrp(f,lx,lz,rot);box(g,3,1.3,0.06,0xf4f4f0,0,1.0,0,false);box(g,3.1,0.06,0.08,0x777,0,0.97,0,false);box(g,0.8,0.05,0.07,0x2a5ad0,-0.6,1.7,0.01,false);box(g,1.0,0.05,0.07,0xd03a3a,0.5,1.4,0.01,false);}
function fBar(f,lx,lz,len){const g=fgrp(f,lx,lz,0);box(g,len,1.05,0.8,0x3a2a22,0,0,0);box(g,len+0.2,0.06,1.0,0x9a7a52,0,1.05,0);fblock(f,lx,lz,len,0.9,false);
  for(let x=-len/2+0.8;x<len/2;x+=1.6){cylS(g,0.2,0.2,0.05,10,0xa23b3b,x,0.7,1.0);cylS(g,0.03,0.03,0.7,6,0x777,x,0,1.0);}}

/* ---- Etagen bauen ---- */
function twFloorTex(i){
  return mkTex(128,128,(c,w,h)=>{
    const P0=[['#e9e6df','#2b2f36'],['#6f7f95','#66768c'],['#8a6a47','#7c5d3d'],['#6e2a35','#5f232d'],['#d8c7a2','#cdbb92']][i];
    c.fillStyle=P0[0];c.fillRect(0,0,w,h);
    if(i===0){c.fillStyle=P0[1];c.fillRect(0,0,w/2,h/2);c.fillRect(w/2,h/2,w/2,h/2);}
    else if(i===2||i===4){for(let k=0;k<8;k++){c.fillStyle=k%2?P0[1]:P0[0];c.fillRect(0,k*16,w,16);c.strokeStyle='rgba(0,0,0,.18)';c.strokeRect(0,k*16,w,16);}}
    else{for(let k=0;k<260;k++){c.fillStyle=Math.random()>.5?'rgba(255,255,255,.07)':'rgba(0,0,0,.08)';c.fillRect(Math.random()*w,Math.random()*h,2,2);}}
  },i===0?10:12,i===0?7:8);
}
function twBuild(i){
  const f={i,cx:twx(i),cz:TW.z,los:[],guards:[]};TWF.push(f);setFloor(0);
  tbox(W,TW.w+2,0.4,TW.d+2,MT(twFloorTex(i),.8),f.cx,-0.4,f.cz);
  const WC=[[0xe6e0d2,0x6d737b],[0xc9d3de,0x6d737b],[0xd8c9a8,0x6d737b],[0xcfc1b0,0x6d737b],[0xf0ece2,0x6d737b]][i];
  const win=(a)=>a.map(x=>[x[0],x[1],'w',1.0,2.2]);
  // Außenwände (Aufzug nördlich: durchgehende Wand)
  fwall(f,'x',-15,-22,22,win([[-18,-14],[-8,-4],[2,6]]),WC);
  fwall(f,'x',15,-22,22,win([[-18,-14],[-8,-4],[2,6],[10,14]]),WC);
  fwall(f,'z',22,-15,15,win([[-10,-6],[6,10]]),WC);
  fwall(f,'z',-22,-15,15,i===0?[[-2,2]].concat(win([[-12,-8],[8,12]])):win([[-12,-8],[8,12]]),WC);
  // Aufzug (Nordwand, rechts)
  const eg=fgrp(f,18,-14.72,0);box(eg,4.2,2.4,0.1,0x8a9098,0,0,0,false);box(eg,1.9,2.2,0.06,0xc5cbd2,-0.98,0.05,0.07,false);box(eg,1.9,2.2,0.06,0xc5cbd2,0.98,0.05,0.07,false);
  box(eg,4.4,0.3,0.14,0x30353b,0,2.4,0.02,false);
  const lab=document.createElement('canvas');lab.width=128;lab.height=64;const lc=lab.getContext&&lab.getContext('2d');
  if(lc){lc.fillStyle='#10161c';lc.fillRect(0,0,128,64);lc.fillStyle='#ffb347';lc.font='bold 44px Arial';lc.textAlign='center';lc.textBaseline='middle';lc.fillText(String(i+1),64,34);}
  const lm=new THREE.Mesh(new THREE.PlaneGeometry(0.6,0.3),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(lab)}));lm.position.set(0,2.55,0.1);eg.add(lm);
  f.padUp=[f.cx+16.6,f.cz-13.4];f.padDn=[f.cx+19.4,f.cz-13.4];
  if(i<4)box(W,0.9,0.03,0.9,0x3fb66b,f.padUp[0],0,f.padUp[1],false);
  if(i>0)box(W,0.9,0.03,0.9,0xd25a4a,f.padDn[0],0,f.padDn[1],false);
  f.arrive=[f.cx+18,f.cz-10.8];
  // Einrichtung
  if(i===0){        // Lobby: Brunnen, Empfang, Sitzgruppen, Pflanzen
    fFountain(f,0,3,true);
    const rg=fgrp(f,-2,-9.2,0);box(rg,6.4,1.1,1.0,0x4a3a2e,0,0,0);box(rg,6.6,0.06,1.2,0xb9a27a,0,1.1,0);box(rg,0.6,0.35,0.04,0x14181e,-1.5,1.16,0.1,false);fblock(f,-2,-9.2,6.4,1.0,false);
    f.cow=[-2,-11.0];f.cowPad=[-2,-7.7];
    for(const [x,z] of[[-15,8],[-15,-5]]){fTable(f,x,z,1.4,1.4,0xcbb68a,true);fChair(f,x-1.1,z,Math.PI/2,0x7a3b3b);fChair(f,x+1.1,z,-Math.PI/2,0x7a3b3b);}
    for(const [x,z] of[[-20,-13],[-20,13],[20,13],[8,-12.5]])fPlant(f,x,z,1.5);
    fPillar(f,-8,-3);fPillar(f,8,-3);fPillar(f,-8,9);fPillar(f,8,9);
    fDesk(f,14,6,0,{col:0xb9a27a,nochair:true});
    f.cs=[14,4.6];
    f.exit=[-20.6,0];
    f.guardPts=[[[-11,-6],[-11,12],[12,12],[12,-6]]];
  }else if(i===1){  // Großraumbüro
    for(const cx of[-15,-5,5])for(const cz of[-9,-2,5,11]){fDesk(f,cx,cz,0,{lamp:(cx+cz)%3===0});}
    for(const [x,z] of[[-20.3,-13.5],[-20.3,13.5],[11,13.5],[11,-13.5]])fPlant(f,x,z,1.5);
    fPlant(f,-7.5,-12.5,1);fPlant(f,3,12.5,1);fCooler(f,12,0);fShelf(f,-21.3,0,Math.PI/2);fShelf(f,10,-14.4,0);
    fPillar(f,-7.5,2);fPillar(f,3,-6);
    f.cow=[11,5];f.cowPad=[9.4,5];f.cs=[-5,12.9];
    f.guardPts=[[[-11.5,-12],[-11.5,12.5]],[[0,12.5],[0,-13]]];
  }else if(i===2){  // Konferenzetage
    fTable(f,0,0,12,1.8,0x6a4a30,false);
    for(let k=-5;k<=5;k+=1.25){fChair(f,k,-1.5,0,0x2f3f5a);fChair(f,k,1.5,Math.PI,0x2f3f5a);}
    fTable(f,-14,-9,2.2,1.4,0x8a6a47,false);for(const k of[-1,1]){fChair(f,-14+k*0.6,-10.4,0,0x5a3b3b);fChair(f,-14+k*0.6,-7.6,Math.PI,0x5a3b3b);}
    fBoard(f,-21.7,0,Math.PI/2);fSofa(f,-16,11,0,0x3a5a7a);fTable(f,-16,8.3,1.2,0.7,0xcbb68a,false);
    fCooler(f,-20,13);fCooler(f,12,12.5);fFountain(f,13,7,false);
    for(const [x,z] of[[-20.3,-13.5],[20.3,13.5],[20.3,-8],[5,13.5]])fPlant(f,x,z,1.4);
    fPillar(f,-10,-5);fPillar(f,10,-5);fPillar(f,-10,5);
    f.cow=[-17,-3];f.cowPad=[-15.5,-3];f.cs=[-12,-9];
    f.guardPts=[[[-9,-5.2],[9,-5.2],[9,5.2],[-9,5.2]]];
  }else if(i===3){  // Chefetage: drei Büros hinter Wänden
    const CW=[0xd9cdb8,0x6d737b];
    fwall(f,'x',-4,-22,8,[[-18,-16],[-8,-6],[2,4]],CW);
    fwall(f,'z',-12,-15,-4,[],CW);fwall(f,'z',-2,-15,-4,[],CW);fwall(f,'z',8,-15,-4,[[-10,-8]],CW);
    for(const [ox,col] of[[-17,0x2a1f18],[-7,0x3a2a1e],[3,0x4a3626]]){
      fDesk(f,ox,-11.5,0,{col,w:2.0,chair:0x1e1e22,lamp:true});fPlant(f,ox-3.3,-13.4,1);fShelf(f,ox+3.3,-14.4,0);
    }
    fFountain(f,0,6,true);fSofa(f,-15,12.5,0,0x3a3340);fSofa(f,-15,2.3,Math.PI,0x3a3340);fTable(f,-15,7.4,1.4,0.9,0x2a1f18,false);
    fTable(f,13,8,3,1.4,0x2a1f18,false);for(const k of[-1,0,1]){fChair(f,13+k*0.9,6.6,0,0x1e1e22);fChair(f,13+k*0.9,9.4,Math.PI,0x1e1e22);}
    for(const [x,z] of[[20.3,13.5],[20.3,0],[-20.3,-1.5],[6,13.5]])fPlant(f,x,z,1.4);
    f.cow=[7,2];f.cowPad=[5.6,2];f.cs=[-7,-9.6];
    f.guardPts=[[[-18.5,0.5],[-18.5,10.5],[9,10.5],[9,0.5]],[[10,-1.5],[18,-1.5],[18,12],[10,12]]];
  }else{            // Dachlounge
    fBar(f,0,12.4,12);
    for(const [x,z] of[[-12,-6],[-4,-6],[4,-6],[-14,3],[14,4]]){fTable(f,x,z,1.3,1.3,0xe8e0cc,true);for(let k=0;k<4;k++){const a=k*Math.PI/2;fChair(f,x+Math.cos(a)*1.0,z+Math.sin(a)*1.0,-a+Math.PI/2,0xc0603a);}}
    fFountain(f,-14,-12,false);fFountain(f,14,-4,false);
    for(const [x,z] of[[-20.3,-3],[-20.3,5],[20.3,12],[20.3,-12],[-8,-13],[0,-2],[9,-13]])fPlant(f,x,z,1.6);
    fSofa(f,-17,12,0,0x3a7a6a);fPillar(f,-6,2);fPillar(f,8,3);
    f.cow=[-10,10];f.cowPad=[-10,8.6];f.cs=[10,-9];
    f.guardPts=[[[-18,-1],[2,-1],[2,9],[-18,9]],[[12,-9],[18,-9],[18,8],[12,8]]];
  }
  // Wachen
  f.guardPts.forEach(pts=>{
    const gm=makeHuman({shirt:0x1b2a44,pants:0x151a24,hair:0x161616,belly:1.15,sleeve:'short',shoe:0x101010,collar:true,belt:true,nose:1.1,ears:1,skin:0xc99a78,scale:1.12});
    scene.add(gm);
    const pos=new Float32Array(20*3),idx=[];for(let k=1;k<19;k++)idx.push(0,k,k+1);
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setIndex(idx);
    const mat=new THREE.MeshBasicMaterial({color:0xffe14d,transparent:true,opacity:0.28,depthWrite:false,side:THREE.DoubleSide});
    const cone=new THREE.Mesh(geo,mat);cone.frustumCulled=false;cone.renderOrder=3;scene.add(cone);cone.visible=false;
    const g={f,pts:pts.map(p=>[f.cx+p[0],f.cz+p[1]]),pi:0,x:f.cx+pts[0][0],z:f.cz+pts[0][1],h:0,base:0,wait:0,t:rand(0,9),alert:0,mesh:gm,cone,geo,mat,mv:false};
    gm.position.set(g.x,0.04,g.z);gm.visible=false;
    f.guards.push(g);
  });
  // Mitarbeiter / Hinweisgeber
  const looks=[{shirt:0x2a5a8a,pants:0x222222,hair:0xc0a040,longHair:true,bangs:true,lips:0xb5483f,skin:0xf3c9a6,scale:0.97,sleeve:'short',bust:true,belly:0.8,waist:0.85,shoe:0x222222,shoeScale:1.1},LOOKS.spike,LOOKS.benny,LOOKS.dean,{shirt:0xe8e0d0,pants:0x222222,hair:0x7a3a1a,longHair:true,bangs:true,lips:0xb5483f,skin:0xe8b896,scale:0.97,sleeve:'short',bust:true,belly:0.8,waist:0.85,shoe:0x222222,shoeScale:1.1}];
  const names=['Empfang','Kollege Moritz','Kollegin Jana','Assistent Kuhn','Barkeeperin Lea'];
  NODES['TW'+i]=[f.cx+f.cow[0],f.cz+f.cow[1],0];ADJ['TW'+i]=[];
  f.npc=makeNPC(names[i],looks[i],'TW'+i,{});f.npc.mesh.rotation.y=Math.atan2(f.cowPad[0]-f.cow[0],f.cowPad[1]-f.cow[1]);
  f.npc.nameT=names[i];
  return f;
}
for(let i=0;i<5;i++)twBuild(i);
/* Leuchte für Innenräume */
const twLight=new THREE.PointLight(0xfff0d8,0,70,1.4);scene.add(twLight);
/* Connie am Arbeitsplatz */
NODES.TWC=[0,0,0];ADJ.TWC=[];
const twConnie=(()=>{const n=makeNPC('Connie',LOOKS.connie,'TWC',{blip:'#ff7eb3'});attachModel(n.mesh,typeof CONNIE_B64==='string'?CONNIE_B64:'',{height:1.7});n.away=true;return n;})();

/* ---- Sichtgeometrie ---- */
function rayHit(ox,oz,dx,dz,maxd,rects){
  let best=maxd;
  for(const r of rects){
    let t0=0,t1=best;
    if(Math.abs(dx)<1e-9){if(ox<r[0]||ox>r[2])continue;}
    else{let a=(r[0]-ox)/dx,b=(r[2]-ox)/dx;if(a>b){const t=a;a=b;b=t;}t0=Math.max(t0,a);t1=Math.min(t1,b);if(t0>t1)continue;}
    if(Math.abs(dz)<1e-9){if(oz<r[1]||oz>r[3])continue;}
    else{let a=(r[1]-oz)/dz,b=(r[3]-oz)/dz;if(a>b){const t=a;a=b;b=t;}t0=Math.max(t0,a);t1=Math.min(t1,b);if(t0>t1)continue;}
    if(t0<best)best=t0;
  }
  return best;
}
function losClear(f,ax,az,bx,bz){
  const dx=bx-ax,dz=bz-az,d=Math.hypot(dx,dz);if(d<0.01)return true;
  return rayHit(ax,az,dx/d,dz/d,d-0.05,f.los)>=d-0.06;
}
const angDiff=(a,b)=>{let d=a-b;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;return d;};
function guardSees(g,px,pz){
  const dx=px-g.x,dz=pz-g.z,d=Math.hypot(dx,dz);
  if(d>TW.R*om('guard'))return {seen:false,d};
  if(d<1.3)return {seen:losClear(g.f,g.x,g.z,px,pz),d};     // ganz nah: bemerkt
  if(Math.abs(angDiff(Math.atan2(dx,dz),g.h))>TW.FOV/2)return {seen:false,d};
  return {seen:losClear(g.f,g.x,g.z,px,pz),d};
}
function guardUpdate(g,dt,active,px,pz,shown){
  g.t+=dt;
  if(g.wait>0){g.wait-=dt;g.mv=false;g.h=g.base+Math.sin(g.t*1.4)*0.85;}
  else{
    const w=g.pts[g.pi],dx=w[0]-g.x,dz=w[1]-g.z,d=Math.hypot(dx,dz);
    if(d<0.2){g.pi=(g.pi+1)%g.pts.length;g.wait=rand(1.2,2.6);g.mv=false;}
    else{const st=Math.min(d,1.7*dt);g.x+=dx/d*st;g.z+=dz/d*st;g.mv=true;g.base=Math.atan2(dx,dz);g.h=angLerp(g.h,g.base,Math.min(1,dt*6));}
  }
  g.mesh.position.set(g.x,0.04,g.z);g.mesh.rotation.y=g.h;g.mesh.visible=shown;
  animWalk(g.mesh,g.t,g.mv?1:0,g.mv?1.7:0);
  let seen=false,dist=99;
  if(active&&shown){const r=guardSees(g,px,pz);seen=r.seen;dist=r.d;}
  if(seen)g.alert=Math.min(1.05,g.alert+dt/(0.85+dist/TW.R*1.5));else g.alert=Math.max(0,g.alert-dt*0.45);
  g.cone.visible=shown&&active;
  if(g.cone.visible){
    const a=g.geo.attributes.position.array,N=18;
    a[0]=g.x;a[1]=0.07;a[2]=g.z;
    for(let k=0;k<=N;k++){
      const an=g.h-TW.FOV/2+TW.FOV*k/N,dx=Math.sin(an),dz=Math.cos(an),d=rayHit(g.x,g.z,dx,dz,TW.R,g.f.los);
      a[3+k*3]=g.x+dx*d;a[4+k*3]=0.07;a[5+k*3]=g.z+dz*d;
    }
    g.geo.attributes.position.needsUpdate=true;
    const al=clamp(g.alert,0,1);g.mat.color.setRGB(1,1-al*0.8,0.3-al*0.3);g.mat.opacity=0.24+0.3*al;
  }
  return seen;
}

/* ---- HUD ---- */
const tqHud=document.createElement('div');
tqHud.style.cssText='position:fixed;top:96px;left:50%;transform:translateX(-50%);width:270px;height:24px;background:rgba(10,12,16,.75);border:2px solid #c9a24b;border-radius:6px;display:none;z-index:30;overflow:hidden;font:bold 12px Arial,sans-serif;color:#fff;text-align:center;line-height:22px';
const tqBar=document.createElement('i');tqBar.style.cssText='position:absolute;left:0;top:0;bottom:0;width:0;background:#e0a020;opacity:.85';
const tqTxt=document.createElement('span');tqTxt.style.cssText='position:relative';tqTxt.textContent='WACHSAMKEIT';
tqHud.appendChild(tqBar);tqHud.appendChild(tqTxt);document.body.appendChild(tqHud);
const tqFadeEl=document.createElement('div');
tqFadeEl.style.cssText='position:fixed;inset:0;background:#000;opacity:0;pointer-events:none;z-index:40;transition:opacity .25s';document.body.appendChild(tqFadeEl);
function tqFade(fn){tqFadeEl.style.opacity='1';fn();setTimeout(()=>{tqFadeEl.style.opacity='0';},180);}

/* ---- Quest ---- */
const TQI={
  folder:{name:'Aktenmappe',col:0x2c4f8a,kind:'folder',x:-0.1,z:3.3,label:'Aktenmappe vom Esstisch nehmen',
    call:'Houg! Ich habe meine Unterlagen für die Besprechung auf dem Esstisch liegen lassen. Die Aktenmappe, die blaue! Bring sie mir bitte ins Büro, schnell!'},
  umbrella:{name:'Regenschirm',col:0x2a6bd1,kind:'umbrella',x:-8.2,z:-1.3,label:'Regenschirm von der Garderobe nehmen',
    call:'Houg, es zieht ein Gewitter auf und mein Regenschirm hängt noch an der Garderobe. Bring ihn mir doch bitte ins Büro!'},
  lunch:{name:'Lunchtüte',col:0xc8a064,kind:'sandwich',x:3.55,z:-4.5,label:'Lunchtüte aus dem Kühlschrank holen',
    call:'Schatz, ich habe meine Lunchtüte im Kühlschrank vergessen. Ich habe Hunger und die Kantine ist eine Katastrophe. Kannst du sie mir bringen?'},
  takeout:{name:'Boopers-Tüte',col:0xc9a06a,kind:'takeout',x:63.2,z:14.0,label:'Boopers-Tüte für Connie holen ($9)',cost:9,
    call:'Houg, ich verhungere! Hol mir bitte was Warmes vom Boopers, Burger und Pommes, und bring es mir ins Büro. Ich zahle es dir zurück. Vielleicht.'}
};
S.tq={st:'none',at:null};
function tqNewDay(){
  tqCleanup();
  const ok=(isWorkday()||weekdayIdx()===5)&&S.day>1&&Math.random()<0.75;
  S.tq={st:'none',at:ok?9*60+Math.floor(rand(0,170)):null};
}
function tqCleanup(){tqHud.style.display='none';for(const f of TWF)for(const g of f.guards){g.cone.visible=false;g.mesh.visible=false;g.alert=0;}twLight.intensity=0;twConnie.away=true;}
function tqCan(){
  return S.mode==='play'&&!S.scene&&!S.cLeft&&!S.prank&&!S.ring&&!connie.away&&!TRK.mounted&&!BIKE.mounted&&tqFloorAt(P.x,P.z)<0
    &&!(isWorkday()&&S.chapter>=3&&!S.workHome)&&!(S.date&&(S.date.st==='wait'||S.date.st==='there'))&&!(S.dinner&&S.dinner.st&&S.dinner.st!=='none')&&S.minutes<14*60;
}
function tqStart(){
  const q=S.tq;q.st='pre';q.tc=18;
  say('Connie','Ich muss jetzt ins Büro. Bis heute Abend, Schatz!',3200);
  connieSend();
}
function tqCall(){
  const q=S.tq,list=['folder','umbrella','lunch'];if(S.minutes>=11*60&&S.minutes<22*60)list.push('takeout');
  q.item=pick(list);q.floor=Math.floor(Math.random()*5);q.has=false;q.known=false;q.caught=0;q.t0=S.minutes;q.dl=S.minutes+120;q.st='go';
  SND.bell();
  sayQueue([['Connie',TQI[q.item].call,6500],['Houg','Das Büro im Kanzlei-Turm. Na toll. Und an der Empfangsdame komme ich nur vorbei, wenn mich keiner sieht.',4200]]);
  banner('CONNIE BRAUCHT HILFE','Bring ihr: '+TQI[q.item].name+' · bis '+fmtT(q.dl)+' Uhr','#ff7eb3');
}
function tqHolds(){const q=S.tq;return q&&q.st!=='none'&&!q.back&&q.st!=='pre';}
function tqActive(){const q=S.tq;return q&&q.st==='go';}
function tqFail(why){
  const q=S.tq;if(q.st!=='go')return;q.st='failed';
  if(q.has&&S.carryKind===TQI[q.item].kind)setCarry(null);q.has=false;
  S.mood=Math.max(0,S.mood-(why==='caught'?14:10));
  banner('QUEST GESCHEITERT',why==='caught'?'Dreimal erwischt – Hausverbot im Turm':why==='time'?'Zu spät. Connie hat es allein geregelt':'Connie ist sauer','#ff7b7b');
  if(tqFloorAt(P.x,P.z)>=0)tqLeave(true);
}
function tqLeave(forced){
  tqFade(()=>{
    P.x=TOWER.door.x-2.4;P.z=TOWER.z;P.y=0;P.vx=P.vz=0;P.rot=-Math.PI/2;tqCleanup();
  });
  if(forced)setTimeout(()=>say('Wache',pick(['Und jetzt raus hier, ich will dich nicht mehr sehen!','Raus mit dir. Hier wird nicht herumgeschlichen.']),3200),300);
}
function tqEnter(visit){
  const q=S.tq;
  tqFade(()=>{const f=TWF[0];P.x=f.cx-20;P.z=f.cz;P.y=0;P.vx=P.vz=0;P.rot=Math.PI/2;});
  SND.ding();
  if(q.st==='go'&&q.has)say('Houg','Schnell rein und unauffällig bleiben. Wachen und ihre Sichtfelder meiden!',3400);
  else say('Houg','Ich sehe mich nur mal um. Die Wachen scheinen heute friedlich zu sein.',3400);
}
function tqCaught(){
  const q=S.tq;q.caught++;SND.buzz();
  banner('ERWISCHT!',q.caught>=3?'Dritte Verwarnung':'Verwarnung '+q.caught+'/3 · zurück zum Eingang','#ff7b7b');
  S.mood=Math.max(0,S.mood-5);S.minutes+=8;
  for(const f of TWF)for(const g of f.guards)g.alert=0;
  if(q.caught>=3){tqFail('caught');return;}
  tqLeave(true);
}
function tqDeliver(){
  const q=S.tq;q.st='done';setCarry(null);q.has=false;
  const fast=S.minutes-q.t0<=60;
  S.money+=35+(fast?15:0);S.mood=Math.min(100,S.mood+14);S.social=Math.min(100,S.social+6);S.urge=Math.min(100,S.urge+8);
  SND.win();bagReward(0.7,['pralinen','blumen','kino','sport','resti','energy','coupon']);
  banner('GESCHAFFT!','Connie freut sich · +$'+(35+(fast?15:0))+', Haussegen +14'+(fast?' (schnell!)':''),'#8ee26b');
  sayQueue([['Connie',pick(['Du bist ein Schatz, Houg! Und jetzt verschwinde, bevor mein Chef dich sieht.','Das hat ja geklappt! Ich habe dich gar nicht reinkommen sehen. Gut so.']),4200],['Houg','Für dich laufe ich auch durch ein Sicherheitssystem, Schatz.',3000]]);
}
function tqConniePos(){const q=S.tq;const f=TWF[q.floor==null?0:q.floor];return [f.cx+f.cs[0],f.cz+f.cs[1]];}
function tqTarget(){
  const q=S.tq;if(!q||q.st!=='go')return null;
  const it=TQI[q.item],cur=tqFloorAt(P.x,P.z);
  if(!q.has)return {x:it.x,z:it.z,fl:0,label:it.label};
  if(cur<0)return {x:TOWER.door.x-2.4,z:TOWER.z,fl:0,label:'Kanzlei-Turm'};
  if(!q.known)return null;
  if(cur===q.floor){const p=tqConniePos();return {x:p[0],z:p[1],fl:0,label:'Connie'};}
  const f=TWF[cur],pad=q.floor>cur?f.padUp:f.padDn;
  return {x:pad[0],z:pad[1],fl:0,label:q.floor>cur?'Aufzug nach oben':'Aufzug nach unten'};
}
function tqQuestHTML(){
  const q=S.tq;if(!q||q.st!=='go')return '';
  const it=TQI[q.item],cur=tqFloorAt(P.x,P.z);
  let t;
  if(!q.has)t=it.label;
  else if(cur<0)t='Bring '+it.name+' zum Kanzlei-Turm';
  else if(!q.known)t='Finde heraus, in welcher Etage Connie arbeitet (Kollegen fragen)';
  else if(cur===q.floor)t='Gib Connie die '+it.name;
  else t='Connie sitzt in der '+(q.floor+1)+'. Etage ('+TWNAME[q.floor]+')';
  return '<div class="qh"><em>CONNIE BRAUCHT HILFE</em> · '+it.name+'</div><div class="qs cur"><span>➤</span><span>'+t+'</span></div><div class="qd">Frist '+fmtT(q.dl)+' Uhr · Verwarnungen '+q.caught+'/3</div>';
}
function tqRide(dir){
  const cur=tqFloorAt(P.x,P.z),nf=cur+dir;if(cur<0||nf<0||nf>4)return;
  tqFade(()=>{const f=TWF[nf];P.x=f.arrive[0];P.z=f.arrive[1];P.y=0;P.vx=P.vz=0;P.rot=0;});
  S.minutes+=1.5;SND.ding();
  banner((nf+1)+'. ETAGE',TWNAME[nf],'#c9a24b');
}
function tqHint(f){
  const q=S.tq,i=f.i;
  if(!q||q.st!=='go'){say(f.npc.nameT,pick(['Heute ist viel los hier.','Ohne Termin kommen Sie nicht weit.']),2600);return;}
  const lines=[];
  if(q.floor===i){q.known=true;lines.push('Connie? Die sitzt gleich hier bei uns, schauen Sie nur nach dem Leuchtzeichen. Aber lassen Sie sich nicht von der Wache sehen.');}
  else if(q.floor>i)lines.push(pick(['Connie? Nicht bei uns. Soweit ich weiß, sitzt sie weiter oben.','Connie von der Rechtsabteilung? Die ist weiter oben, fahren Sie mit dem Aufzug hoch.']));
  else lines.push(pick(['Connie? Die ist weiter unten, nicht hier.','Connie? Eine oder mehrere Etagen tiefer, glaube ich.']));
  say(f.npc.nameT,lines[0],4600);
}
let tqPickups=Object.keys(TQI);
for(const id of tqPickups){
  const it=TQI[id];
  STATIC_INTER.push({id:'tq-'+id,x:it.x,z:it.z,r:id==='takeout'?1.6:1.5,prio:4.4,blip:'#ff7eb3',
    label:()=>{const q=S.tq;return q&&q.st==='go'&&!q.has&&q.item===id?it.label:null;},
    use:()=>{
      const q=S.tq;if(S.carry){say('Houg','Meine Hände sind voll.',2200);return;}
      if(it.cost){if(S.money<it.cost){say('Houg','Mir fehlen $'+it.cost+' für die Tüte.',2600);SND.buzz();return;}S.money-=it.cost;}
      setCarry(it.name,it.col,it.kind);q.has=true;SND.ding();
      say('Houg','Gut. Jetzt zum Kanzlei-Turm.',2600);
    }});
}
/* Fußabtreter vor der Tür und ein Stein rechts davon: darunter liegt der Turmschlüssel */
S.towerKey=false;
const twStone=new THREE.Group();
{
  const mt=mkTex(256,128,(c,w,h)=>{c.fillStyle='#5b3d28';c.fillRect(0,0,w,h);c.strokeStyle='#c9a24b';c.lineWidth=6;c.strokeRect(8,8,w-16,h-16);c.fillStyle='#e8d9b0';c.font='bold 38px Arial, sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('WILLKOMMEN',w/2,h/2+2);});
  const mg=new THREE.Group();mg.position.set(TOWER.door.x-1.9,0.0,TOWER.z);mg.rotation.y=-Math.PI/2;OUT.add(mg);   // Schrift von außen (Straßenseite) lesbar
  const mm=new THREE.Mesh(new THREE.PlaneGeometry(1.8,0.9),new THREE.MeshStandardMaterial({map:mt,roughness:1}));mm.rotation.x=-Math.PI/2;mm.position.y=0.05;mg.add(mm);
  box(mg,1.86,0.02,0.96,0x3a2718,0,0,0,false);
  twStone.position.set(TOWER.door.x-1.9,0,TOWER.z+2.3);OUT.add(twStone);
  sph(twStone,0.34,0x8c8f94,0,0.12,0,1.3,0.8,1);sph(twStone,0.2,0x9a9da2,0.22,0.08,0.12,1,0.7,1);
}
function tqStoneSync(){twStone.position.z=TOWER.z+(S.towerKey?3.0:2.3);twStone.rotation.z=S.towerKey?0.5:0;}
STATIC_INTER.push({id:'tw-stone',x:TOWER.door.x-1.9,z:TOWER.z+2.3,r:1.4,prio:3.4,blip:'#8c8f94',
  label:()=>S.towerKey?null:'Stein anheben (E)',
  use:()=>{S.towerKey=true;tqStoneSync();SND.ding();banner('SCHLÜSSEL GEFUNDEN','Der Turmschlüssel lag unter dem Stein','#c9a24b');say('Houg','Na also. Ein Klassiker: Schlüssel unter dem Stein.',3000);}});
{ // Eingang zum Turm
  const tw=STATIC_INTER.find(i=>i.id==='tower');
  const oldLabel=tw.label,oldUse=tw.use;
  tw.label=()=>{const q=S.tq;if(q&&q.st==='go')return q.has?'Kanzlei-Turm betreten (E)':'Kanzlei-Turm (erst die '+TQI[q.item].name+' besorgen)';return S.towerKey?'Kanzlei-Turm mit dem Schlüssel aufschließen (E)':'Kanzlei-Turm (abgeschlossen)';};
  tw.use=()=>{const q=S.tq;if(q&&q.st==='go'){if(q.has)tqEnter();else if(S.towerKey)tqEnter(true);else say('Houg','Ohne '+TQI[q.item].name+' brauche ich gar nicht erst hochzugehen.',2800);return;}
    if(S.towerKey){tqEnter(true);return;}
    say('Houg',pick(['Abgeschlossen. Unter dem Fußabtreter oder einem Stein liegt doch immer ein Schlüssel.','Zu. Wer versteckt hier wohl den Ersatzschlüssel?']),3400);};
  tw.prio=3.2;
}
for(const f of TWF){
  const i=f.i;
  STATIC_INTER.push({id:'tw-up'+i,x:f.padUp[0],z:f.padUp[1],r:1.1,prio:3.6,blip:'#3fb66b',label:()=>i<4?'Aufzug nach oben ('+(i+2)+'. Etage)':null,use:()=>tqRide(1)});
  STATIC_INTER.push({id:'tw-dn'+i,x:f.padDn[0],z:f.padDn[1],r:1.1,prio:3.6,blip:'#d25a4a',label:()=>i>0?'Aufzug nach unten ('+i+'. Etage)':null,use:()=>tqRide(-1)});
  STATIC_INTER.push({id:'tw-cow'+i,x:f.cx+f.cowPad[0],z:f.cz+f.cowPad[1],r:1.7,prio:3.4,blip:'#c9a24b',label:()=>f.npc.nameT+' fragen (E)',use:()=>tqHint(f)});
}
STATIC_INTER.push({id:'tw-exit',x:TWF[0].cx+TWF[0].exit[0],z:TWF[0].cz+TWF[0].exit[1],r:1.6,prio:3.4,blip:'#c9a24b',label:()=>'Turm verlassen (E)',use:()=>tqLeave(false)});
STATIC_INTER.push({id:'tw-connie',get x(){return tqConniePos()[0];},get z(){return tqConniePos()[1];},r:2.0,prio:5,blip:'#ff7eb3',
  label:()=>{const q=S.tq;if(!q||q.st!=='go'||tqFloorAt(P.x,P.z)!==q.floor)return null;return q.has?'Connie die '+TQI[q.item].name+' geben (E)':'Mit Connie reden';},
  use:()=>{const q=S.tq;if(q.has)tqDeliver();else say('Connie','Wo ist denn, was ich brauche?',2600);}});

/* ---- Takt ---- */
function tqStep(dt){
  const q=S.tq;if(!q)return;
  tqStoneSync();
  const tm=performance.now()/1000;for(const a of TWANIM)a(tm);
  if(q.st==='none'&&q.at!=null&&S.minutes>=q.at&&tqCan())tqStart();
  if(q.st==='pre'){q.tc-=dt;if(q.tc<=0)tqCall();}
  if(q.st==='go'){
    if(q.has&&!S.carry){const it=TQI[q.item];setCarry(it.name,it.col,it.kind);}      // z. B. nach dem Laden
    else if(q.has&&S.carryKind!==TQI[q.item].kind)q.has=false;                       // Hände anderweitig belegt
    if(S.minutes>=q.dl)tqFail('time');
  }
  if(tqHolds()){connie.away=true;connie.mesh.visible=false;}
  if((q.st==='done'||q.st==='failed')&&!q.back&&S.minutes>=17*60+20){q.back=true;connieHomeAgain();}
  const cur=tqFloorAt(P.x,P.z),act=q.st==='go';
  // Connie im Turm
  const pos=q.floor!=null?tqConniePos():[0,0];
  twConnie.away=!(q.st==='go'||q.st==='done')||q.floor==null;
  if(!twConnie.away){twConnie.x=pos[0];twConnie.z=pos[1];twConnie.y=0;twConnie.mesh.rotation.y=Math.atan2(TWF[q.floor].cx+TWF[q.floor].cs[0]*0.5-pos[0],-2);}
  for(const f of TWF){const here=f.i===cur;f.npc.mesh.visible=here;}
  if(cur<0){tqHud.style.display='none';twLight.intensity=0;for(const f of TWF)for(const g of f.guards){g.cone.visible=false;g.mesh.visible=false;}return;}
  const f=TWF[cur];twLight.position.set(f.cx,3.0,f.cz);twLight.intensity=S.minutes/60>17||S.minutes/60<7?1.1:0.5;
  let top=0;
  for(const fl of TWF)for(const g of fl.guards){
    const shown=fl.i===cur;
    if(shown){const s=guardUpdate(g,dt,act&&S.mode==='play',P.x,P.z,true);top=Math.max(top,g.alert);}
    else{g.cone.visible=false;g.mesh.visible=false;}
  }
  if(act){
    tqHud.style.display='block';tqBar.style.width=Math.min(100,top*100)+'%';tqBar.style.background=top>0.66?'#d63c3c':(top>0.33?'#e07a20':'#e0a020');
    tqTxt.textContent=top>0.05?'ENTDECKT?':'Wachen meiden';
    if(top>=1&&S.mode==='play')tqCaught();
  }else tqHud.style.display='none';
}
