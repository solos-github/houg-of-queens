/* ---------- Radio (Garage), Grill-Ausbaustufen und Barbecue im Garten ---------- */
// Radio auf dem Beistelltisch neben der Garagencouch
{const g=new THREE.Group();g.position.set(24.75,0.62,-2.95);g.rotation.y=Math.PI/2;W.add(g);
 box(W,0.55,0.62,0.55,0x6b4a2f,24.75,0,-2.95);block(24.45,-3.25,25.05,-2.65);
 box(g,0.5,0.26,0.2,0x6b4a2f,0,0,0);box(g,0.4,0.18,0.02,0x2a2a2a,0,0.04,0.105,false);
 cylS(g,0.07,0.07,0.02,12,0x888888,-0.12,0.1,0.118).rotation.x=Math.PI/2;
 box(g,0.14,0.05,0.02,0xf2d36b,0.1,0.15,0.11,false);
 const an=box(g,0.015,0.35,0.015,0xcccccc,0.2,0.2,-0.05,false);an.rotation.z=-0.4;}
STATIC_INTER.push({id:'radio',x:24.5,z:-2.1,r:1.5,prio:3.6,blip:'#f5c542',
  label:()=>'Radio: '+((musicOn||RADIO.on)?radioName()+' (E: nächster Sender)':'aus (E: einschalten)'),use:radioNext});

// Grill-Ausbaustufen
function grillTier(){return S.deco.grill2?2:(S.deco.grill1?1:0);}
let gasGrill=null,bbqStation=null,fireLight=null;
function buildGasGrill(){
  if(GRILL0)GRILL0.visible=false;
  const g=new THREE.Group();g.position.set(14.2,0,-5.2);OUT.add(g);gasGrill=g;
  box(g,1.1,0.75,0.55,0x9aa0a6,0,0.1,0);box(g,1.14,0.1,0.6,0x2b2b2e,0,0.85,0);
  box(g,1.1,0.32,0.55,0x2b2b2e,0,0.95,0);box(g,1.0,0.05,0.05,0xc9ced3,0,1.2,0.3,false);
  for(let i=0;i<4;i++)cylS(g,0.035,0.035,0.05,8,0xd8dce0,-0.36+i*0.24,0.62,0.29).rotation.x=Math.PI/2;
  box(g,0.5,0.06,0.5,0x8a6a45,0.8,0.82,0.0);box(g,0.04,0.7,0.04,0x555555,0.62,0.1,0.2,false);box(g,0.04,0.7,0.04,0x555555,0.98,0.1,0.2,false);
  for(const sx of [-1,1])cylS(g,0.09,0.09,0.06,10,0x222222,sx*0.45,0,-0.25).rotation.z=Math.PI/2;
  box(g,0.55,0.62,0.4,0xc2c7cc,-0.9,0.08,0);   // Beistellschrank
  box(g,0.6,0.04,0.45,0x2b2b2e,-0.9,0.7,0);
  block(13.0,-5.6,15.4,-4.8);
}
function buildBbqStation(){
  const g=new THREE.Group();OUT.add(g);bbqStation=g;
  box(g,2.6,0.9,0.7,0xa9553f,16.2,0,-7.9);box(g,2.7,0.06,0.78,0x4a4a50,16.2,0.9,-7.9);
  box(g,0.5,0.04,0.35,0xc9ced3,15.5,0.96,-7.9,false);cylS(g,0.025,0.025,0.3,6,0xc9ced3,15.5,0.96,-8.1);
  // Smoker
  const sm=cylS(g,0.38,0.38,1.1,16,0x2f3a32,17.3,0.5,-6.4);sm.rotation.z=Math.PI/2;sm.position.y=0.95;
  cylS(g,0.12,0.12,0.5,10,0x2a2a2a,16.95,1.2,-6.4);
  for(const dz of [-0.3,0.3])box(g,0.06,0.55,0.06,0x333333,17.3,0,-6.4+dz);
  // Barhocker
  for(const z of [-7.1,-6.4,-5.7])if(false){}
  for(const x of [15.3,16.2,17.1]){cylS(g,0.2,0.2,0.05,10,0x6b4a2f,x,0.65,-7.15);cylS(g,0.04,0.04,0.65,6,0x333333,x,0,-7.15);}
  // Lichterkette
  for(let i=0;i<=14;i++){const x=9.8+i*0.55,y=2.55-Math.sin(i/14*Math.PI)*0.25;
    const b=new THREE.Mesh(new THREE.SphereGeometry(0.07,8,6),new THREE.MeshBasicMaterial({color:i%2?0xffe08a:0xffb86b}));b.position.set(x,y,-8.3);g.add(b);}
  const pl=new THREE.PointLight(0xffd29a,0.6,12);pl.position.set(14,2.4,-6);g.add(pl);
  block(14.9,-8.3,17.5,-7.5);block(16.9,-6.9,17.7,-5.9);
}
CATALOG.push(
 {id:'grill1',name:'Gasgrill „Hausmeister“',price:140,deco:1,desc:'Großer Gasgrill mit Beistellschrank im Garten. Barbecue bringt mehr Sozialkontakte (+45) und die Jungs bringen Essen mit.',buy(){buildGasGrill();}},
 {id:'grill2',name:'BBQ-Station „Queens Deluxe“',price:320,deco:1,req:'grill1',desc:'Outdoor-Küche mit Smoker, Barhockern und Lichterkette. Barbecue: Sozialkontakte +65, Hunger +35.',buy(){buildBbqStation();}}
);
/* Barbecue */
const BBQ={0:{cost:40,gain:30,food:15},1:{cost:55,gain:45,food:25},2:{cost:75,gain:65,food:35}};
S.bbq=false;
function bbqStart(){
  const t=grillTier(),b=BBQ[t];
  if(S.friends||S.bbq){say('Houg','Die Jungs sind doch schon da.',2400);return;}
  if(S.minutes<9*60||S.minutes>=21*60){say('Houg','Zu früh oder zu spät für ein Barbecue. Zwischen 9 und 21 Uhr.',3200);SND.buzz();return;}
  if(S.money<b.cost){say('Houg','Für Fleisch und Bier fehlen mir $'+Math.ceil(b.cost-S.money)+'.',3000);SND.buzz();return;}
  S.money-=b.cost;S.bbq=true;S.bbqTier=t;archBbqJoin();SND.ding();sfxPlay('barbecue');
  banner('BARBECUE!','−$'+b.cost+' · die Jungs kommen in den Garten','#ff9d3d');
  friendsArrive(true);
}
STATIC_INTER.push({id:'bbq',x:14.2,z:-4.1,r:1.9,prio:3,blip:'#ff9d3d',
  label:()=>{const b=BBQ[grillTier()];return (S.friends||S.bbq)?'Barbecue läuft …':'Barbecue mit den Jungs ($'+b.cost+') · Sozialkontakte +'+b.gain;},
  use:bbqStart});
let bbqDrinkT=0;
function socialStep(dt){
  if(S.bbq){
    if(!fireLight){fireLight=new THREE.PointLight(0xff8a3a,0.8,6);fireLight.position.set(14.2,1.3,-5.2);OUT.add(fireLight);}
    fireLight.intensity=0.7+Math.sin(performance.now()/90)*0.15;
    const b=BBQ[S.bbqTier||0];S.social=Math.min(100,S.social+b.gain/75*dt+1*dt);   // zusätzlich 1 Sozialpunkt je Spielminute (1 s = 1 Min.)
    S.hunger=Math.min(100,S.hunger+b.food/75*dt);
    bbqDrinkT-=dt;if(bbqDrinkT<=0){bbqDrinkT=rand(3,6);const fr=friendNPCs.filter(n=>n.node.startsWith('GG'));if(fr.length)playDrink(pick(fr).mesh,2.6);}
  }else if(fireLight){OUT.remove(fireLight);fireLight=null;}
}
