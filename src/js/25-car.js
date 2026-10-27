/* ---------- Hougs Wagen: Toyota Tercel Wagon in der Garage (fährt über die Truck-Steuerung) ---------- */
const CAR={g:new THREE.Group(),x:31.0,z:-4.2,rot:Math.PI/2,wheels:[],col:null};
{
  const g=CAR.g,BODY=0xa9b9a4,GL=0x24323f;
  box(g,1.55,0.25,4.0,0x232326,0,0.18,0);
  box(g,1.66,0.5,4.2,BODY,0,0.3,0);                       // Karosserie
  box(g,1.58,0.52,2.75,BODY,0,0.8,-0.25);                 // Kombi-Dachaufbau
  box(g,1.5,0.06,2.7,0xcfd8cb,0,1.33,-0.25,false);
  box(g,1.4,0.42,0.04,GL,0,0.86,1.14,false);              // Windschutzscheibe
  box(g,1.4,0.40,0.04,GL,0,0.88,-1.64,false);             // Heckscheibe
  for(const sx of [-1,1]){
    box(g,0.04,0.38,1.15,GL,sx*0.8,0.9,0.36,false);box(g,0.04,0.38,1.15,GL,sx*0.8,0.9,-0.85,false);box(g,0.04,0.35,0.5,GL,sx*0.8,0.9,-1.4,false);
    box(g,0.05,0.5,0.05,BODY,sx*0.8,0.8,-0.25,false);
    box(g,0.14,0.1,0.12,0x222,sx*0.9,0.78,0.85,false);    // Spiegel
    box(g,0.28,0.14,0.05,0xfff3b0,sx*0.55,0.5,2.12,false);   // Scheinwerfer
    box(g,0.26,0.12,0.05,0xc62828,sx*0.58,0.52,-2.12,false);  // Rücklicht
    box(g,0.04,0.04,2.4,0xaab2b8,sx*0.55,1.4,-0.25,false);   // Dachreling
  }
  box(g,1.5,0.04,0.04,0xaab2b8,0,1.42,0.7,false);box(g,1.5,0.04,0.04,0xaab2b8,0,1.42,-1.2,false);
  box(g,0.8,0.14,0.04,0x2a2a2e,0,0.48,2.12,false);        // Grill
  box(g,1.72,0.16,0.12,0x2a2a2e,0,0.18,2.15,false);box(g,1.72,0.16,0.12,0x2a2a2e,0,0.18,-2.15,false);
  const lp=mkTex(128,48,(c,w,h)=>{c.fillStyle='#f4f1e6';c.fillRect(0,0,w,h);c.strokeStyle='#223';c.lineWidth=3;c.strokeRect(2,2,w-4,h-4);c.fillStyle='#223';c.font='bold 30px Arial';c.textAlign='center';c.textBaseline='middle';c.fillText('QNS 482',w/2,h/2+1);});
  const pl=new THREE.Mesh(new THREE.PlaneGeometry(0.42,0.16),new THREE.MeshStandardMaterial({map:lp}));pl.position.set(0,0.4,-2.165);pl.rotation.y=Math.PI;g.add(pl);
  for(const [wx,wz] of [[-0.85,1.35],[0.85,1.35],[-0.85,-1.35],[0.85,-1.35]]){const w=cylS(g,0.3,0.3,0.22,14,0x1a1a1a,wx,0,wz);w.rotation.z=Math.PI/2;w.position.set(wx,0.3,wz);CAR.wheels.push(w);
    const hub=cylS(g,0.15,0.15,0.24,10,0xb9bec4,wx,0,wz);hub.rotation.z=Math.PI/2;hub.position.set(wx,0.3,wz);}
  g.position.set(CAR.x,0,CAR.z);g.rotation.y=CAR.rot;OUT.add(g);
  CAR.col=block(0,0,0,0);
}
function carSyncCol(){
  const c=CAR.col,s=Math.abs(Math.sin(CAR.rot)),k=Math.abs(Math.cos(CAR.rot)),hx=0.85*k+2.1*s,hz=0.85*s+2.1*k;
  c.x0=CAR.x-hx;c.x1=CAR.x+hx;c.z0=CAR.z-hz;c.z1=CAR.z+hz;c.on=!(TRK.mounted&&TRK.car);
}
carSyncCol();
function carIn(){
  if(TRK.mounted||BIKE.mounted)return;
  TRK.sv={x:TRK.x,z:TRK.z,rot:TRK.rot};TRK.car=true;
  TRK.x=CAR.x;TRK.z=CAR.z;TRK.rot=CAR.rot;
  truckIn();carSyncCol();
}
function carRestore(wasCar){          // beim Aussteigen: Wagen parkt dort, Truck kehrt an seinen Platz zurück
  if(!wasCar||!TRK.car)return;
  CAR.x=TRK.x;CAR.z=TRK.z;CAR.rot=TRK.rot;CAR.g.position.set(CAR.x,0,CAR.z);CAR.g.rotation.y=CAR.rot;CAR.g.rotation.z=0;
  TRK.x=TRK.sv.x;TRK.z=TRK.sv.z;TRK.rot=TRK.sv.rot;TRK.v=0;TRK.car=false;
  TRK.g.position.set(TRK.x,0,TRK.z);TRK.g.rotation.y=TRK.rot;
  carSyncCol();truckSyncCol();
}
STATIC_INTER.push({id:'car',get x(){return CAR.x;},get z(){return CAR.z;},r:3.0,prio:1.3,blip:'#9bb0a0',
  label:()=>(TRK.mounted||BIKE.mounted)?null:'Toyota Tercel Wagon: einsteigen (E oder X)',use:()=>carIn()});
/* Garagen-Kühlschrank und Tischkicker */
S.garCd={fr:0,kick:0};
STATIC_INTER.push({id:'gar-fridge',x:33.3,z:-1.9,r:1.6,prio:3.3,blip:'#cfe8f2',
  label:()=>TRK.mounted?null:(S.garCd.fr>0?'Garagen-Kühlschrank (gerade leer getrunken)':'Garagen-Kühlschrank: kühles Getränk (E)'),
  use:()=>{if(S.garCd.fr>0){say('Houg','Ich habe gerade erst eins gehabt.',2200);return;}S.garCd.fr=90;S.hunger=Math.min(100,S.hunger+5);S.mood=Math.min(100,S.mood+4);SND.eat();playDrink(player,2.4);say('Houg','Ahh, das tut gut.',2200);}});
STATIC_INTER.push({id:'gar-kicker',x:28.9,z:-2.4,r:1.6,prio:3.3,blip:'#2f8f4a',
  label:()=>TRK.mounted?null:(S.garCd.kick>0?'Tischkicker (gerade gespielt)':(S.friends?'Tischkicker spielen mit den Jungs (E)':'Tischkicker spielen (E)')),
  use:()=>{if(S.garCd.kick>0){say('Houg','Noch eine Runde später.',2200);return;}S.garCd.kick=120;
    const f=S.friends?1:0;S.mood=Math.min(100,S.mood+6+f*3);S.social=Math.min(100,S.social+3+f*8);S.hunger=Math.max(0,S.hunger-3);S.minutes=Math.min(S.minutes+12,23*60);
    SND.win();banner('TISCHKICKER','Tor! Haussegen +'+(6+f*3)+' · Sozialkontakte +'+(3+f*8),'#2f8f4a');say('Houg',pick(['Und das Tor zum 5:4!','Das war Absicht. Wirklich.']),2400);}});
STATIC_INTER.push({id:'gar-tools',x:31.2,z:-1.8,r:1.5,prio:3.2,blip:'#c62828',
  label:()=>TRK.mounted?null:'Werkzeugschrank',use:()=>say('Houg',pick(['Sechs Schubladen, und ich weiß nicht, wofür auch nur eine ist.','Da drin liegt sicher ein Schraubenschlüssel. Und Archies Zahnprothese.']),3000)});
function garageStep(dt){if(S.garCd){S.garCd.fr=Math.max(0,S.garCd.fr-dt);S.garCd.kick=Math.max(0,S.garCd.kick-dt);}}
