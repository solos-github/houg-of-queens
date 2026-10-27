/* ---------- Türen: Haustür, Gartentür, Garagentür (E öffnet/schließt, schließen nach 3 s von selbst) und Garagentor (hoch/runter) ---------- */
setFloor(0);
const DOORS=[];
/* o: name, wall ('x' = Tür in einer Wand bei x=pos, Öffnung entlang z; 'z' = Wand bei z=pos, Öffnung entlang x), pos, g0,g1, dir (+1/-1 Schwungrichtung) */
function makeDoor(o){
  const alongZ=(o.wall||'x')==='x',w=o.g1-o.g0,pivot=new THREE.Group();W.add(pivot);
  const lw=w-0.06,col=o.col||0x7a4a24;
  if(alongZ){
    const sg=o.hinge==='g1'?-1:1;     // Scharnier an g1: Blatt reicht in -z
    pivot.position.set(o.pos+(o.off||0),0,sg>0?o.g0+0.02:o.g1-0.02);
    box(pivot,0.07,2.3,lw,col,0,0,sg*lw/2);
    if(o.glass)box(pivot,0.09,0.8,lw*0.55,0xbfe3f2,0,1.2,sg*lw/2,false);
    if(o.sign){box(pivot,0.1,0.45,lw*0.6,0xd62839,0,0.9,sg*lw/2,false);box(pivot,0.11,0.3,lw*0.45,0xf4f1ea,0,0.97,sg*lw/2,false);}
    box(pivot,0.14,0.05,0.14,0xd9c27a,0,1.05,sg*(lw-0.12),false);
  }else{
    pivot.position.set(o.g0+0.02,0,o.pos);
    box(pivot,lw,2.3,0.07,col,lw/2,0,0);
    box(pivot,lw*0.5,0.03,0.09,0x6f7479,lw/2,1.7,0,false);box(pivot,lw*0.5,0.03,0.09,0x6f7479,lw/2,0.5,0,false);
    box(pivot,0.14,0.14,0.05,0xd9c27a,lw-0.12,1.0,0,false);
  }
  const d={name:o.name,pivot,alongZ,cx:alongZ?o.pos:(o.g0+o.g1)/2,cz:alongZ?(o.g0+o.g1)/2:o.pos,hw:w/2,dir:o.dir,open:o.open||1.75,hideOpen:!!o.hideOpen,ang:0,target:0,t:0,auto:true,sp:3.2,
    col:alongZ?block(o.pos-0.2,o.g0,o.pos+0.2,o.g1):block(o.g0,o.pos-0.2,o.g1,o.pos+0.2)};
  DOORS.push(d);
  STATIC_INTER.push({id:'door-'+o.name,x:d.cx,z:d.cz,r:o.r||1.9,prio:3.5,
    label:()=>(d.target>0?o.name+' schließen':o.name+' öffnen'),use:()=>toggleDoor(d)});
  return d;
}
/* Rolltor: fährt nach oben auf und nach unten zu */
function makeGarageDoor(x,g0,g1,h){
  const w=g1-g0,pivot=new THREE.Group();W.add(pivot);pivot.position.set(x,h,(g0+g1)/2);
  box(pivot,0.1,h,w-0.04,0xe9e5da,0,-h,0);
  for(let k=1;k<5;k++)for(const sx of [-1,1])box(pivot,0.02,0.04,w-0.04,0xb9b3a5,sx*0.055,-h+k*h/5,0,false);
  for(let i=0;i<4;i++)box(pivot,0.03,0.28,0.9,0x9fb2c0,-0.06,-0.7,-w/2+0.55+i*1.22,false);
  box(pivot,0.16,0.08,0.08,0x444444,-0.08,-1.35,w/2-0.35,false);box(pivot,0.16,0.08,0.08,0x444444,0.08,-1.35,w/2-0.35,false);
  const d={name:'Garagentor',pivot,roll:true,alongZ:true,cx:x,cz:(g0+g1)/2,hw:w/2,dir:1,ang:0,target:0,t:0,auto:false,sp:0.9,
    col:block(x-0.2,g0,x+0.2,g1)};
  DOORS.push(d);
  STATIC_INTER.push({id:'door-garage'+x,x:x,z:d.cz,r:2.7,prio:3.5,
    label:()=>d.target>0?'Garagentor schließen':'Garagentor öffnen',use:()=>toggleDoor(d)});
  return d;
}
function toggleDoor(d){
  if(d.target>0){if(!d.auto&&doorBlocked(d)){SND.buzz();return;}d.target=0;d.t=0;}
  else{d.target=1;d.t=d.auto?3:1e9;}
  SND.click(d.target?300:220);
}
function inDoor(d,x,z,margin){
  const across=d.alongZ?Math.abs(x-d.cx):Math.abs(z-d.cz),along=d.alongZ?Math.abs(z-d.cz):Math.abs(x-d.cx);
  return across<margin&&along<d.hw+(margin>1?1.2:0.1);
}
function doorBlocked(d){   // jemand steht in der Tür
  if(P.y<1.2&&inDoor(d,P.x,P.z,d.roll?1.0:0.9))return true;
  for(const n of NPCS)if(!n.away&&n.y<1.2&&inDoor(d,n.x,n.z,d.roll?1.0:0.9))return true;
  return false;
}
function updateDoors(dt){
  for(const d of DOORS){
    if(d.auto&&d.target===0)for(const n of NPCS){   // Figuren öffnen Türen im Vorbeigehen
      if(!n.away&&n.y<1.2&&inDoor(d,n.x,n.z,1.5)){d.target=1;d.t=3;break;}
    }
    if(d.target>0&&d.auto){
      if(doorBlocked(d))d.t=Math.max(d.t,0.8);
      else{d.t-=dt;if(d.t<=0){d.target=0;SND.click(220);}}
    }
    const goal=d.target>0?1:0,sp=dt*d.sp;
    d.ang+=Math.max(-sp,Math.min(sp,goal-d.ang));
    if(d.roll){d.pivot.scale.y=Math.max(0.03,1-d.ang);d.pivot.visible=d.ang<0.97;d.col.on=d.ang<0.85;}
    else{d.pivot.rotation.y=d.dir*d.ang*d.open;if(d.hideOpen)d.pivot.visible=d.ang<0.55;d.col.on=d.ang<0.05&&d.target===0;}
  }
}
makeDoor({name:'Haustür',pos:-9,g0:-0.9,g1:0.9,dir:1,glass:true,hinge:'g1',off:0.185,open:-(Math.PI-0.08),hideOpen:false});
makeDoor({name:'Gartentür',pos:9,g0:-4.0,g1:-2.4,dir:1,glass:true,sign:true});
makeDoor({name:'Garagentür',wall:'z',pos:-0.2,g0:22.9,g1:24.15,dir:1,col:0x8a9097,r:1.5});
makeGarageDoor(18.2,-5.5,-0.7,2.35);
makeGarageDoor(34.2,-5.5,-0.7,2.35);       // zweites Tor auf der gegenüberliegenden Seite
{ // Wandtelefon rechts neben der Durchreiche (Küchenseite)
  box(W,0.1,0.28,0.14,0xf2f2f2,1.72,1.25,-1.1,false);
  box(W,0.12,0.06,0.2,0x333333,1.7,1.42,-1.1,false);
  box(W,0.03,0.2,0.02,0x222222,1.76,1.0,-1.0,false);
}
// zweiter Fernseher in der Garage startet ebenfalls das Kanalsurf-Spiel
{const c=STATIC_INTER.find(i=>i.id==='couch');STATIC_INTER.push(Object.assign({},c,{id:'couch2',x:22.8,z:-1.7,r:2.3}));}
