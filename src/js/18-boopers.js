/* ---------- Die Stadt wächst: Madison Avenue, Skyline Boulevard, Kanzlei-Turm und das Pub BOOPERS ---------- */
setFloor(0);

/* ===== Straßen ===== */
{
  const RD=0x4a4d57;
  box(OUT,122,0.02,6,RD,44,-0.045,-72,false);          // Nordring nach Osten
  box(OUT,122,0.02,6,RD,44,-0.045,72,false);           // Südring nach Osten
  box(OUT,6,0.02,150,RD,48,-0.045,0,false);            // Madison Avenue
  box(OUT,6,0.02,150,RD,104,-0.045,0,false);           // Skyline Boulevard
  for(let x=-12;x<=102;x+=6){box(OUT,2.4,0.01,0.18,0xf0d26a,x,-0.03,-72,false);box(OUT,2.4,0.01,0.18,0xf0d26a,x,-0.03,72,false);}
  for(let z=-66;z<=66;z+=6){box(OUT,0.18,0.01,2.4,0xf0d26a,48,-0.03,z,false);box(OUT,0.18,0.01,2.4,0xf0d26a,104,-0.03,z,false);}
  for(const x of [43.8,52.2,99.8,108.2])box(OUT,2.4,0.04,138,0xb9b6ad,x,-0.05,0,false);
  for(let z=-62;z<=66;z+=9){tree(41.4,z+2,1);tree(110.6,z+5,1.1);}
  // Häuser an der Skyline (Westseite, Blick nach Osten)
  [8,24,40,56].forEach((z,i)=>neighborHouse(86.75,z,1,NB_STYLES[(i+1)%6],i%2===0));
}

/* ===== Kanzlei-Turm (Wolkenkratzer, zunächst nicht betretbar) ===== */
const TOWER={x:76,z:-40,door:{x:59.4,z:-40}};
{
  const win=mkTex(128,128,(c,w,h)=>{
    c.fillStyle='#1d2c3a';c.fillRect(0,0,w,h);
    const lit=Math.random()<0.18;
    c.fillStyle=lit?'#ffe9a8':'#3b5a78';c.fillRect(10,12,w-20,h-34);
    c.fillStyle='rgba(255,255,255,.18)';c.fillRect(10,12,w-20,10);
    c.fillStyle='#10171e';c.fillRect(w/2-2,12,4,h-34);
  },8,26);
  const tw=new THREE.Mesh(new THREE.BoxGeometry(24,80,24),MT(win,.35));tw.position.set(TOWER.x,40,TOWER.z);OUT.add(tw);
  const top=new THREE.Mesh(new THREE.BoxGeometry(14,10,14),MT(win,.35));top.position.set(TOWER.x,85,TOWER.z);OUT.add(top);
  box(OUT,16,1.2,16,0x454c55,TOWER.x,90,TOWER.z,false);
  cylS(OUT,0.25,0.25,18,6,0xcccccc,TOWER.x,91,TOWER.z);
  // Sockel mit Eingang auf der Westseite
  box(OUT,32,6,32,0x6d737b,TOWER.x,0,TOWER.z);
  box(OUT,34,0.6,34,0x30353b,TOWER.x,6,TOWER.z,false);
  box(OUT,0.4,3.2,4.4,0x1a2a36,TOWER.door.x-0.9,0,TOWER.z,false);           // Glastür
  box(OUT,0.5,0.3,6,0x30353b,TOWER.door.x-1.0,3.3,TOWER.z,false);
  const sg=mkTex(512,128,(c,w,h)=>{c.fillStyle='#14202b';c.fillRect(0,0,w,h);c.strokeStyle='#c9a24b';c.lineWidth=6;c.strokeRect(6,6,w-12,h-12);
    c.fillStyle='#c9a24b';c.font='bold 62px Arial, sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('KANZLEI-TURM',w/2,h/2+3);});
  const sm=new THREE.Mesh(new THREE.PlaneGeometry(8,2),new THREE.MeshStandardMaterial({map:sg,roughness:.5,emissive:0xffffff,emissiveMap:sg,emissiveIntensity:.4}));
  sm.position.set(TOWER.door.x-1.36,4.9,TOWER.z);sm.rotation.y=-Math.PI/2;OUT.add(sm);
  box(OUT,0.1,2.2,8.2,0x14202b,TOWER.door.x-1.28,3.8,TOWER.z,false);      // dunkler Schildkasten dahinter: Schild liegt 2 cm davor
  box(OUT,38,0.04,38,0xaaa8a2,TOWER.x-1,-0.05,TOWER.z,false);
  block(TOWER.x-16,TOWER.z-16,TOWER.x+16,TOWER.z+16);
  STATIC_INTER.push({id:'tower',x:TOWER.door.x-2.4,z:TOWER.z,r:2.6,prio:2.2,blip:'#c9a24b',
    label:()=>'Kanzlei-Turm (Zutritt nur für Mitarbeiter)',
    use:()=>say('Houg',connie.away?'Da oben im Turm arbeitet Connie. Ohne Ausweis komme ich nicht an der Empfangsdame vorbei.':'Die Tür ist verschlossen. Connie arbeitet hier, aber heute ist der Zutritt nichts für mich.',4200)});
}

/* ===== BOOPERS (Pub & Restaurant, betretbar) ===== */
const BP={x0:54,x1:72,z0:10,z1:28};
const inPub=(x,z)=>x>BP.x0-0.2&&x<BP.x1+0.2&&z>BP.z0-0.2&&z<BP.z1+0.2;
const PROOF=new THREE.Group();scene.add(PROOF);
const POKER_C={x:64,z:22};
{
  const cx=(BP.x0+BP.x1)/2,cz=(BP.z0+BP.z1)/2;
  tbox(W,19,0.4,19,MT(TX_WOOD,.9),cx,-0.4,cz);
  wall('x',BP.z0,BP.x0,BP.x1,[[60,62,'w',1.0,2.2],[66,68,'w',1.0,2.2]],[CREAM,BRICK],{inS:1});
  wall('x',BP.z1,BP.x0,BP.x1,[[58,60,'w',1.0,2.2],[66,68,'w',1.0,2.2]],[BRICK,CREAM],{inS:-1});
  wall('z',BP.x0,BP.z0,BP.z1,[[12,14.5,'w',1.0,2.2],[18,20],[23.5,26,'w',1.0,2.2]],[CREAM,BRICK],{inS:1});
  wall('z',BP.x1,BP.z0,BP.z1,[[23,25,'w',1.0,2.2]],[BRICK,CREAM],{inS:-1});
  const rs=new THREE.MeshStandardMaterial({color:0x4a3a34,roughness:.95});
  tbox(PROOF,19.4,0.18,19.4,rs,cx,2.9,cz);
  for(const [w,d,x,z] of [[19.4,0.2,cx,BP.z0-0.25],[0.2,19.4,BP.x0-0.25,cz],[0.2,19.4,BP.x1+0.25,cz],[19.4,0.2,cx,BP.z1+0.25]])tbox(PROOF,w,0.4,d,M(0x2e2420),x,3.08,z);
  // Leuchtschild über der Tür (Westseite, zur Madison Avenue)
  const sg=mkTex(512,128,(c,w,h)=>{c.fillStyle='#22130e';c.fillRect(0,0,w,h);c.strokeStyle='#ffcf5a';c.lineWidth=7;c.strokeRect(6,6,w-12,h-12);
    c.fillStyle='#ffcf5a';c.font='bold 88px Arial, sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('BOOPERS',w/2,h/2+4);});
  const sm=new THREE.Mesh(new THREE.PlaneGeometry(7,1.75),new THREE.MeshStandardMaterial({map:sg,roughness:.5,emissive:0xffffff,emissiveMap:sg,emissiveIntensity:.55}));
  sm.position.set(BP.x0-0.52,3.9,19);sm.rotation.y=-Math.PI/2;PROOF.add(sm);
  box(PROOF,0.3,1.9,7.2,0x22130e,BP.x0-0.35,3.0,19,false);
  box(OUT,5,0.04,7,0xb9b6ad,BP.x0-2.6,-0.05,19,false);          // Vorplatz
  // Bar an der Nordwand
  box(W,8.4,1.1,0.9,0x5a3b22,61,0,11.5);box(W,8.6,0.07,1.1,0xd8cdb8,61,1.1,11.5,false);block(56.7,11.0,65.3,12.0);
  box(W,9,0.1,0.35,0x7b5a3a,61,1.5,10.3,false);box(W,9,0.1,0.35,0x7b5a3a,61,2.0,10.3,false);
  const bc=[0x3a8a4a,0xc04040,0xe0a030,0x4a7ac0,0x9a5ab0];
  for(let i=0;i<14;i++){box(W,0.12,0.38,0.12,bc[i%5],56.9+i*0.6,1.6,10.3,false);if(i<11)box(W,0.12,0.38,0.12,bc[(i+2)%5],57.2+i*0.7,2.1,10.3,false);}
  for(let i=0;i<5;i++){cylS(W,0.22,0.2,0.62,10,0x7a2a2a,57.5+i*1.6,0,13.0);cylS(W,0.25,0.25,0.07,10,0xcfc9bb,57.5+i*1.6,0.62,13.0);}
  // Spielautomaten an der Ostwand (Front nach Westen)
  for(const z of [14.4,15.9]){
    const g=new THREE.Group();g.position.set(71.2,0,z);g.rotation.y=-Math.PI/2;W.add(g);
    box(g,0.9,1.9,0.8,z<15?0x7a1f2b:0x1f3d7a,0,0,0);
    box(g,0.7,0.5,0.05,0x101820,0,1.0,0.41,false);
    for(let k=0;k<3;k++)box(g,0.18,0.34,0.04,0xfff2c0,-0.22+k*0.22,1.08,0.43,false);
    box(g,0.7,0.14,0.05,0xffcf5a,0,1.7,0.41,false);box(g,0.7,0.06,0.3,0x333333,0,0.85,0.45,false);
    box(g,0.07,0.5,0.07,0xc0c0c0,0.52,0.9,0,false);sph(g,0.09,0xd83b3b,0.52,1.45,0);
  }
  block(70.7,13.9,71.8,16.5);
  // Pokertisch mit vier Stühlen
  cylS(W,1.5,1.5,0.1,22,0x1f6b3a,POKER_C.x,0.78,POKER_C.z);cylS(W,1.55,1.55,0.08,22,0x5a3b22,POKER_C.x,0.72,POKER_C.z);cylS(W,0.2,0.3,0.74,10,0x3a2a22,POKER_C.x,0,POKER_C.z);
  for(let k=0;k<4;k++){const a=k*Math.PI/2,x=POKER_C.x+Math.cos(a)*2.0,z=POKER_C.z+Math.sin(a)*2.0;
    box(W,0.5,0.06,0.5,0x7a2a2a,x,0.45,z,false);cylS(W,0.04,0.04,0.45,6,0x333333,x,0,z);}
  for(const [dx,dz,c] of [[-0.4,0.2,0xd83b3b],[0.1,-0.3,0x3b78d8],[0.4,0.3,0xf2c744]])cylS(W,0.12,0.12,0.06,10,c,POKER_C.x+dx,0.88,POKER_C.z+dz);
  block(POKER_C.x-1.6,POKER_C.z-1.6,POKER_C.x+1.6,POKER_C.z+1.6);
  // Zwei Esstische mit Stühlen
  for(const [tx,tz] of [[58.5,24.5],[68.5,25.5]]){
    cylS(W,0.7,0.7,0.06,16,0xe8e2d2,tx,0.74,tz);cylS(W,0.06,0.06,0.74,8,0x555555,tx,0,tz);
    for(const a of [0.6,2.2,3.8,5.4])box(W,0.45,0.05,0.45,0x7a4a2a,tx+Math.cos(a)*1.1,0.45,tz+Math.sin(a)*1.1,false);
    block(tx-0.8,tz-0.8,tx+0.8,tz+0.8);
  }
  // Teppich, Lampen, Lichter
  tbox(W,3.4,0.03,3.4,MT(TX_RUG1,1),POKER_C.x,0,POKER_C.z);
  for(const [x,z] of [[POKER_C.x,POKER_C.z],[61,13],[58.5,24.5],[68.5,25.5]]){cylS(W,0.02,0.02,0.7,4,0x333333,x,2.1,z);sph(W,0.28,0xffd98a,x,2.0,z,1,0.7,1);}
  const pl=new THREE.PointLight(0xffc890,0.9,16);pl.position.set(cx,2.4,cz);W.add(pl);
}
/* Freunde am Pokertisch */
const PUB_LINES={
  Dean:['Setz dich, Houg! Ich habe heute ein gutes Gefühl.','Pommes gibt es hier, Burger auch. Was will man mehr?','Wer mogelt, fliegt raus. Außer ich.'],
  Spike:['Ich bluffe nie. Naja, fast nie.','Meine Mum denkt, ich sei bei der Arbeit. Ich bin bei Boopers.','Der Automat da hinten zahlt ständig. Hab ich gehört.'],
  Benny:['Ich setze alles auf mein Blatt!','Burger, Pommes und Poker – der perfekte Abend.','Houg, du schuldest mir noch ein Sandwich.']
};
const PUB_SEAT={Dean:[POKER_C.x+2.0,POKER_C.z],Spike:[POKER_C.x,POKER_C.z-2.0],Benny:[POKER_C.x-2.0,POKER_C.z]};
NODES.BPD=[PUB_SEAT.Dean[0],PUB_SEAT.Dean[1],0];NODES.BPS=[PUB_SEAT.Spike[0],PUB_SEAT.Spike[1],0];NODES.BPB=[PUB_SEAT.Benny[0],PUB_SEAT.Benny[1],0];
const PUBF=[['Dean','dean','BPD',typeof DEAN_B64==='string'?DEAN_B64:'',1.82],['Spike','spike','BPS',typeof SPIKE_B64==='string'?SPIKE_B64:'',1.78],['Benny','benny','BPB',typeof BENNY_B64==='string'?BENNY_B64:'',1.74]].map(([nm,lk,nd,b64,h])=>{
  const n=makeNPC(nm,LOOKS[lk],nd,{blip:'#7fd1ff',talk:()=>pick(PUB_LINES[nm])});
  attachModel(n.mesh,b64,{height:h});n.mesh.rotation.y=Math.atan2(POKER_C.x-n.x,POKER_C.z-n.z);n.away=true;return n;
});
const pubOpen=()=>{const t=S.minutes%1440;return t>=11*60&&t<23*60;};
const pubFriendsOn=()=>pubOpen()&&!S.friends&&(isWorkday()?S.minutes>=17*60:S.minutes>=12*60);
function townStep(dt){
  PROOF.visible=!inPub(P.x,P.z);
  const on=pubFriendsOn();
  for(const n of PUBF){n.away=!on;const u=n.mesh.userData;if(on&&u.acts&&u.acts.sitdrink&&!u.pose)u.pose='sitdrink';}
  deanWork.away=!(isWorkday()&&S.minutes>=7*60&&S.minutes<18*60);
  dateStep(dt);dinnerStep(dt);connieStep(dt);tqStep(dt);archieStep(dt);garageStep(dt);bagStep(dt);
}
function townRoom(x,z){
  if(P.fl!==0)return null;
  if(inPub(x,z))return 'BOOPERS';
  if(x>50&&x<75&&z>5&&z<33)return 'BOOPERS-VORPLATZ';
  if(x>40&&x<56&&z>-70&&z<70)return 'MADISON AVE';
  if(x>98&&x<110&&z>-70&&z<70)return 'SKYLINE BLVD';
  if(x>56&&x<96&&z>-60&&z<-20)return 'KANZLEI-TURM';
  if(x>-14&&z<-69&&z>-75)return 'NORDRING';
  if(x>-14&&z>69&&z<75)return 'SÜDRING';
  return null;
}

/* ===== Speisekarte (Burger & Pommes) ===== */
STORES.boopers={name:'Boopers',open:[11*60,23*60],tag:'Täglich 11:00–23:00 Uhr. Burger, Pommes, Getränke.',x:61,z:13.9,
  items:[
   {id:'burger',n:'Boopers-Burger',p:8,h:45,m:2,full:70,d:'Doppelt Fleisch, Käse, Zwiebeln.'},
   {id:'pommes',n:'Pommes mit Mayo',p:4,h:20,m:1,full:30,d:'Knusprig und fettig.'},
   {id:'menue',n:'Cheeseburger-Menü',p:12,h:68,m:4,full:130,u:6,d:'Burger, Pommes und eine Cola. Macht lange satt.'},
   {id:'cola',n:'Kalte Cola',p:3,h:6,u:10,drink:1,d:'Erfrischt. Drückt auf die Blase.'},
   {id:'bier',n:'Zapfbier',p:4,h:4,m:5,u:14,drink:1,d:'Hebt die Stimmung. Drückt auf die Blase.'}
  ]};
STATIC_INTER.push({id:'store-boopers',x:61,z:13.9,r:2.4,prio:3.3,blip:'#f5c542',
  label:()=>storeOpen('boopers')?'Boopers: Essen bestellen (E)':'Boopers hat geschlossen (11:00–23:00)',
  use:()=>{if(!storeOpen('boopers')){say('Houg','Zu. Ich komme später wieder.',2400);SND.buzz();return;}openStore('boopers');}});

/* ===== Glücksautomat ===== */
const SLOT_SYM=['🍒','🍋','🔔','⭐','7️⃣','🍀'];
const SL={spin:false,reels:['❔','❔','❔'],msg:'Wähle deinen Einsatz. Dieser Automat zahlt erstaunlich oft.',bet:0,t:0};
function slotOutcome(){
  const r=Math.random(),sy=SLOT_SYM,shuffle=a=>a.sort(()=>Math.random()-0.5);
  if(r<0.54){const a=shuffle(sy.slice());return {mult:0,reels:a.slice(0,3)};}
  if(r<0.82){const a=shuffle(sy.slice()),pair=[a[0],a[0],a[1]];return {mult:1.5,reels:shuffle(pair)};}
  if(r<0.93)return {mult:2,reels:['🍒','🍒','🍒']};
  if(r<0.98)return {mult:4,reels:['🔔','🔔','🔔']};
  return {mult:10,reels:['7️⃣','7️⃣','7️⃣']};
}
function slotOpen(){S.mode='casino';$('casino').hidden=false;SL.spin=false;slotRender();}
function slotRender(){
  $('slInfo').textContent='Dein Geld: $'+Math.floor(S.money);
  $('slReels').innerHTML=SL.reels.map(s=>'<span class="reel">'+s+'</span>').join('')+'<p>'+SL.msg+'</p>';
  $('slBtns').innerHTML=[1,2,5,10,20].map(b=>'<div class="card food"><h3>Einsatz $'+b+'</h3><button type="button" data-sl="'+b+'"'+((SL.spin||S.money<b)?' disabled':'')+'>Drehen</button></div>').join('');
}
function slotSpin(bet){
  if(SL.spin||S.money<bet)return;
  S.money-=bet;SL.spin=true;SL.bet=bet;SL.msg='…';SND.click(500);
  const iv=setInterval(()=>{SL.reels=[pick(SLOT_SYM),pick(SLOT_SYM),pick(SLOT_SYM)];slotRender();SND.click(300+Math.random()*300);},110);
  setTimeout(()=>{
    clearInterval(iv);const o=slotOutcome();SL.reels=o.reels;SL.spin=false;
    if(o.mult>0){const win=Math.round(bet*o.mult);S.money+=win;SL.msg=(o.mult>=10?'JACKPOT! ':'Gewonnen! ')+'+$'+win+' (×'+o.mult+')';SND.win();
      if(o.mult>=4)banner('GEWINN!','+$'+win+' am Automaten','#f5c542');hLine('slot_win',2600);}
    else{SL.msg='Leider nichts. Nochmal?';SND.buzz();if(Math.random()<0.5)hLine('slot_lose',2600);}
    slotRender();
  },1300);
}
$('casino').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.id==='slClose'){gameClose();return;}
  if(b.dataset.sl)slotSpin(+b.dataset.sl);
});

/* ===== Poker (Texas Hold'em, du gegen Dean, Spike und Benny) ===== */
const RANKS=['2','3','4','5','6','7','8','9','10','J','Q','K','A'],SUITS=['♠','♥','♦','♣'];
const HANDS=['Hohe Karte','Ein Paar','Zwei Paare','Drilling','Straße','Flush','Full House','Vierling','Straight Flush'];
const cardHTML=c=>'<span class="pc'+((c&3)===1||(c&3)===2?' red':'')+'">'+RANKS[c>>2]+SUITS[c&3]+'</span>';
const backHTML='<span class="pc back">??</span>';
function eval5(c){
  const r=c.map(x=>x>>2).sort((a,b)=>b-a),su=c.map(x=>x&3),flush=su.every(s=>s===su[0]),cnt={};
  r.forEach(x=>{cnt[x]=(cnt[x]||0)+1;});
  const g=Object.keys(cnt).map(Number).sort((a,b)=>cnt[b]-cnt[a]||b-a),u=[...new Set(r)];
  let st=0;if(u.length===5){if(u[0]-u[4]===4)st=u[0]+1;else if(u[0]===12&&u[1]===3)st=4;}
  let cat;
  if(st&&flush)cat=8;else if(cnt[g[0]]===4)cat=7;else if(cnt[g[0]]===3&&cnt[g[1]]===2)cat=6;else if(flush)cat=5;else if(st)cat=4;
  else if(cnt[g[0]]===3)cat=3;else if(cnt[g[0]]===2&&cnt[g[1]]===2)cat=2;else if(cnt[g[0]]===2)cat=1;else cat=0;
  const tb=st?[st]:g;let sc=cat;for(let i=0;i<5;i++)sc=sc*15+(tb[i]===undefined?0:tb[i]+1);
  return sc;
}
function bestHand(cards){
  let best=-1;const n=cards.length;
  const rec=(start,pick5)=>{if(pick5.length===5){const s=eval5(pick5);if(s>best)best=s;return;}for(let i=start;i<n;i++){pick5.push(cards[i]);rec(i+1,pick5);pick5.pop();}};
  rec(0,[]);return best;
}
const handCat=sc=>Math.floor(sc/Math.pow(15,5));
const PK={stage:'bet',hand:null,last:10,msg:'',names:['Du','Dean','Spike','Benny']};
function pkOpen(){
  if(!pubFriendsOn()){say('Houg','Die Freunde sind noch nicht da. Unter der Woche ab 17:00, am Wochenende ab 12:00.',3600);SND.buzz();return;}
  S.mode='poker';$('poker').hidden=false;PK.stage='bet';PK.hand=null;PK.msg='Stell deinen Einsatz ein. Alle zahlen ihn ein, der Beste gewinnt den Pot.';pkRender();
}
function pkPay(i,x){const H=PK.hand;H.pot+=x;H.paid[i]+=x;if(i===0)S.money-=x;}
function pkDeal(bet){
  bet=Math.floor(bet);
  if(!(bet>=1)||bet>S.money){PK.msg='Ungültiger Einsatz (mindestens $1, höchstens dein Geld).';pkRender();return;}
  PK.last=bet;
  const deck=[];for(let i=0;i<52;i++)deck.push(i);deck.sort(()=>Math.random()-0.5);
  const H={bet,pot:0,paid:[0,0,0,0],folded:[false,false,false,false],hole:[0,1,2,3].map(()=>[deck.pop(),deck.pop()]),board:[deck.pop(),deck.pop(),deck.pop(),deck.pop(),deck.pop()],raiser:-1,result:null};
  PK.hand=H;for(let i=0;i<4;i++)pkPay(i,bet);
  PK.stage='r1';PK.msg='Der Flop liegt aus. Mitgehen (schieben), erhöhen oder passen?';SND.click(620);pkRender();
}
const pkCards=(H,i,n)=>H.hole[i].concat(H.board.slice(0,n));
const pkShown=()=>PK.stage==='r1'||PK.stage==='r1call'?3:5;
function pkFriendsReact(raise){
  const H=PK.hand,n=pkShown();
  for(const i of [1,2,3]){
    if(H.folded[i])continue;
    const cat=handCat(bestHand(pkCards(H,i,n).length>=5?pkCards(H,i,n):pkCards(H,i,n).concat([0,0,0].slice(0,5-pkCards(H,i,n).length))));
    const foldP=cat===0?(raise?0.45:0.08):(cat===1?(raise?0.15:0):0);
    if(Math.random()<foldP){H.folded[i]=true;continue;}
    if(raise)pkPay(i,H.bet);
  }
}
function pkNext(){
  const H=PK.hand;
  if(H.folded[1]&&H.folded[2]&&H.folded[3]){pkFinish();return;}
  if(PK.stage==='r1'||PK.stage==='r1call'){PK.stage='r2';PK.msg='Turn und River liegen aus. Letzte Runde.';pkRender();}
  else pkFinish();
}
function pkAct(a){
  const H=PK.hand;if(!H)return;
  if(a==='fold'){H.folded[0]=true;pkFinish();return;}
  if(PK.stage==='r1call'||PK.stage==='r2call'){      // Antwort auf die Erhöhung eines Freundes
    if(a==='call'){if(S.money<H.bet)return;pkPay(0,H.bet);for(const i of [1,2,3])if(!H.folded[i]&&i!==H.raiser)pkPay(i,H.bet);pkNext();}
    return;
  }
  if(a==='allin'){pkAllIn();return;}
  if(a==='raise'){if(S.money<H.bet)return;pkPay(0,H.bet);pkFriendsReact(true);pkNext();return;}
  if(a==='check'){
    // starke Freunde erhöhen gelegentlich
    const n=pkShown();
    const strong=[1,2,3].filter(i=>!H.folded[i]&&handCat(bestHand(pkCards(H,i,n).length>=5?pkCards(H,i,n):pkCards(H,i,n).concat([0,0,0].slice(0,5-pkCards(H,i,n).length))))>=3&&Math.random()<0.4);
    if(strong.length){const i=strong[0];H.raiser=i;pkPay(i,H.bet);PK.stage=PK.stage==='r1'?'r1call':'r2call';PK.msg=PK.names[i]+' erhöht um $'+H.bet+'! Mitgehen oder passen?';say(PK.names[i],pick(['Ich erhöhe!','Wer traut sich?','Jetzt wird es ernst.']),2400);SND.click(700);pkRender();return;}
    pkFriendsReact(false);pkNext();
  }
}
function pkAllIn(){
  const H=PK.hand,amt=Math.floor(S.money);if(!H||amt<=0)return;
  pkPay(0,amt);hLine('poker_allin',2400);SND.click(800);banner('ALL IN!','Du setzt $'+amt,'#ff5aa5');
  for(const i of [1,2,3]){
    if(H.folded[i])continue;
    const cs=pkCards(H,i,5),cat=handCat(bestHand(cs));
    const foldP=cat===0?0.7:(cat===1?0.4:(cat===2?0.15:0));
    if(Math.random()<foldP){H.folded[i]=true;say(PK.names[i],pick(['Nein, das ist mir zu heiß.','Ich passe. Mutiger Zug, Houg.']),2400);}
    else{pkPay(i,amt);say(PK.names[i],pick(['Ich bin dabei!','Zeig, was du hast!']),2400);}
  }
  pkFinish();
}
function pkFinish(){
  const H=PK.hand;PK.stage='done';
  const alive=[0,1,2,3].filter(i=>!H.folded[i]);
  const sc={};let top=-1;
  for(const i of alive){sc[i]=bestHand(pkCards(H,i,5));if(sc[i]>top)top=sc[i];}
  const win=alive.filter(i=>sc[i]===top),share=Math.floor(H.pot/win.length);
  H.result={win,sc,share};
  if(win.includes(0)){S.money+=share;}
  S.social=Math.min(100,S.social+3);S.mood=Math.min(100,S.mood+(win.includes(0)?3:0));
  const hn=i=>HANDS[handCat(sc[i])];
  if(H.folded[0])PK.msg='Du hast gepasst und deinen Einsatz verloren ($'+H.paid[0]+'). '+win.map(i=>PK.names[i]).join(' & ')+' gewinnt mit '+hn(win[0])+'.';
  else if(win.includes(0)){PK.msg='Du gewinnst $'+share+' mit '+hn(0)+'!';SND.win();banner('POKER-GEWINN','+$'+share+' · '+hn(0),'#f5c542');say(pick(['Dean','Spike','Benny']),pick(['Beginnerglück, Houg!','Das war Absicht, oder?','Na toll, du schon wieder.']),3000);setTimeout(()=>hLine('poker_win',2800),3200);}
  else{PK.msg=win.map(i=>PK.names[i]).join(' & ')+' gewinnt $'+share+' mit '+hn(win[0])+'. Du hattest '+hn(0)+'.';SND.buzz();say(PK.names[win[0]],pick(['Danke für die Chips, Houg!','Das war knapp.','Gut gespielt. Nicht gut genug.']),3000);setTimeout(()=>hLine('poker_lose',2800),3200);}
  pkRender();
}
function pkRender(){
  const H=PK.hand,done=PK.stage==='done',n=H?(done?5:pkShown()):0;
  $('pkInfo').textContent='Dein Geld: $'+Math.floor(S.money)+(H?' · Pot $'+H.pot+' · Einsatz $'+H.bet:'');
  let t='';
  if(H){
    t+='<div class="pkb">Tisch: '+H.board.slice(0,n).map(cardHTML).join('')+(n<5?(5-n===2?backHTML+backHTML:''):'')+'</div>';
    for(let i=0;i<4;i++){
      const show=i===0||(done&&!H.folded[i]);
      const st=H.folded[i]?'<em>passt</em>':(done&&H.result.win.includes(i)?'<b>GEWINNT</b> ('+HANDS[handCat(H.result.sc[i])]+')':(done?HANDS[handCat(H.result.sc[i])]:''));
      t+='<div class="pkp"><span>'+PK.names[i]+'</span>'+(show?H.hole[i].map(cardHTML).join(''):backHTML+backHTML)+' '+st+'</div>';
    }
    if(!done&&!H.folded[0]){const cs=pkCards(H,0,n);if(cs.length>=5)t+='<div class="pkp">Dein Blatt: <b>'+HANDS[handCat(bestHand(cs))]+'</b></div>';}
  }
  $('pkTable').innerHTML=t+'<p>'+PK.msg+'</p>';
  let b='';
  if(PK.stage==='bet'||done){
    const maxB=Math.floor(S.money);
    b='<div class="card food"><h3>Einsatz</h3><p>Du bestimmst, wie viel jeder einzahlt.</p><input id="pkBet" type="number" min="1" max="'+maxB+'" value="'+Math.min(PK.last,Math.max(1,maxB))+'">'
      +'<div>'+[5,10,25,50,100].map(v=>'<button type="button" data-pkq="'+v+'"'+(S.money<v?' disabled':'')+'>$'+v+'</button>').join(' ')+' <button type="button" data-pkq="all"'+(S.money<1?' disabled':'')+'>ALL IN</button></div>'
      +'<button type="button" data-pk="deal"'+(S.money<1?' disabled':'')+'>'+(done?'Nächste Runde austeilen':'Karten austeilen')+'</button></div>';
  }else if(PK.stage==='r1call'||PK.stage==='r2call'){
    b='<div class="card food"><h3>Erhöhung</h3><button type="button" data-pk="call"'+(S.money<H.bet?' disabled':'')+'>Mitgehen (+$'+H.bet+')</button> <button type="button" data-pk="fold">Passen</button></div>';
  }else{
    b='<div class="card food"><h3>Deine Aktion</h3><button type="button" data-pk="check">Mitgehen (schieben)</button> <button type="button" data-pk="raise"'+(S.money<H.bet?' disabled':'')+'>Erhöhen (+$'+H.bet+')</button> <button type="button" data-pk="allin"'+(S.money<1?' disabled':'')+'>ALL IN ($'+Math.floor(S.money)+')</button> <button type="button" data-pk="fold">Passen</button></div>';
  }
  $('pkBtns').innerHTML=b;
}
$('poker').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.id==='pkClose'){gameClose();return;}
  if(b.dataset.pkq){const v=b.dataset.pkq==='all'?Math.floor(S.money):+b.dataset.pkq;const inp=$('pkBet');if(inp)inp.value=v;PK.last=v;return;}
  if(b.dataset.pk==='deal'){const inp=$('pkBet');pkDeal(inp?+inp.value:PK.last);return;}
  if(b.dataset.pk)pkAct(b.dataset.pk);
});
function gameClose(){
  if(S.mode==='poker'){
    if(PK.hand&&PK.stage!=='done'&&PK.stage!=='bet'){PK.hand.folded[0]=true;PK.stage='done';}
    $('poker').hidden=true;PK.stage='bet';PK.hand=null;
  }
  if(S.mode==='casino'){$('casino').hidden=true;}
  S.mode='play';
}
STATIC_INTER.push(
 {id:'slot',x:69.6,z:15.2,r:2.2,prio:3.4,blip:'#ff5aa5',
  label:()=>pubOpen()?'Glücksautomat spielen (E)':'Boopers hat geschlossen',
  use:()=>{if(!pubOpen()){say('Houg','Zu. Ich komme später wieder.',2400);SND.buzz();return;}slotOpen();}},
 {id:'poker',x:POKER_C.x,z:POKER_C.z+2.5,r:2.2,prio:3.4,blip:'#3b9dff',
  label:()=>pubOpen()?(pubFriendsOn()?'Poker mit Dean, Spike und Benny (E)':'Pokertisch (Freunde kommen unter der Woche ab 17:00, am Wochenende ab 12:00)'):'Boopers hat geschlossen',
  use:()=>{if(!pubOpen()){say('Houg','Zu. Ich komme später wieder.',2400);SND.buzz();return;}pkOpen();}}
);

/* ===== Lieferroute D: Madison Avenue & Skyline Boulevard ===== */
{
  const skyW=i=>{const z=[8,24,40,56][i];return Object.assign(nbDoor(86.75,z,1,i%2===0,false),{label:addr('Skyline Blvd',z,0)});};
  ROUTES.push({id:'D',name:'Madison & Skyline',stops:()=>[
    {x:BP.x0-2.4,z:19,label:'BOOPERS'},{x:TOWER.door.x-2.4,z:TOWER.z+3,label:'KANZLEI-TURM'},skyW(0),skyW(1),skyW(2),skyW(3)]});
}

/* ===== Mehr Mülleimer in der Stadt (setzen sich jeden Tag zurück) ===== */
{
  const MORE=[
    [43.2,-50,'Mülleimer an der Madison Avenue'],[52.8,-20,'Mülleimer an der Madison Avenue'],[43.2,35,'Mülleimer an der Madison Avenue'],[52.8,52,'Mülleimer an der Madison Avenue'],
    [51.6,13,'Mülleimer vor Boopers'],[51.6,25,'Mülleimer vor Boopers'],
    [99.2,-45,'Mülleimer am Skyline Boulevard'],[108.8,20,'Mülleimer am Skyline Boulevard'],[99.2,45,'Mülleimer am Skyline Boulevard'],
    [57,-27,'Mülleimer am Kanzlei-Turm'],[57,-53,'Mülleimer am Kanzlei-Turm'],
    [-60,-67.4,'Mülleimer am Nordring'],[20,-67.4,'Mülleimer am Nordring'],[-30,-76.6,'Mülleimer am Nordring'],
    [-50,67.4,'Mülleimer am Südring'],[10,76.6,'Mülleimer am Südring'],[75,67.4,'Mülleimer am Südring'],
    [-21.4,45,'Mülleimer in der Rego Park Ave'],[-13.4,-47,'Mülleimer in der Rego Park Ave'],[-13.4,55,'Mülleimer in der Rego Park Ave'],[-21.4,-12,'Mülleimer in der Rego Park Ave'],
    [-85.2,-40,'Mülleimer in der Westallee'],[-74.8,40,'Mülleimer in der Westallee'],[-85.2,58,'Mülleimer in der Westallee'],
    [-12.2,-12,'Mülleimer vor unserem Haus'],[16,3.2,'Mülleimer im Garten'],[-45,-76.4,'Mülleimer vor YPS']
  ];
  for(const [x,z,n] of MORE){
    const b={x,z,n};BINS.push(b);const i=BINS.length-1;
    cylS(OUT,0.32,0.28,0.85,10,0x4b5560,x,0,z);cylS(OUT,0.35,0.35,0.07,10,0x2e353d,x,0.85,z);block(x-0.33,z-0.33,x+0.33,z+0.33);
    STATIC_INTER.push({id:'bin'+i,x,z,r:1.7,prio:2.5,
      label:()=>{if(TRK.mounted)return null;const now=S.day*1440+S.minutes;return (b.until&&now<b.until)?b.n+' (heute schon durchsucht)':b.n+' durchsuchen (E halten)';},
      hold:()=>{const now=S.day*1440+S.minutes;return (b.until&&now<b.until)?0:1.1;},use:()=>binSearch(b)});
  }
}

/* ---------- Öffentliche Toiletten: bei YPS und im Boopers ---------- */
function wcCubicle(id,bx,bz,face,ix,iz){
  // face 'e': Rückwand im Westen, Schüssel zeigt nach Osten; face 'n': Rückwand im Süden, Schüssel zeigt nach Norden
  const g=new THREE.Group();g.position.set(bx,0,bz);W.add(g);
  if(face==='n')g.rotation.y=Math.PI/2;      // lokal +x = Blickrichtung der Schüssel
  box(g,0.22,0.5,0.4,0xf2f2f2,0,0,0);                         // Tank
  box(g,0.5,0.1,0.5,0xf7f7f7,0.32,0.38,0,false);               // Schüssel
  cylS(g,0.22,0.16,0.34,10,0xf7f7f7,0.4,0.05,0,1);
  box(g,0.02,0.55,0.05,0x888888,-0.08,0.5,0,false);
  const sg=mkTex(128,128,(c,w,h)=>{c.fillStyle='#1d4f8f';c.fillRect(0,0,w,h);c.fillStyle='#fff';c.font='bold 70px Arial, sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('WC',w/2,h/2+4);});
  const sm=new THREE.Mesh(new THREE.PlaneGeometry(0.5,0.5),new THREE.MeshStandardMaterial({map:sg,roughness:.6}));
  sm.position.set(-0.12,1.75,0);sm.rotation.y=Math.PI/2;g.add(sm);
  for(const sz of [-0.9,0.9]){box(g,1.3,1.9,0.06,0x7c8590,0.6,0,sz);}   // Trennwände
  if(face==='e'){for(const sz of [-0.9,0.9])block(bx-0.05,bz+sz-0.04,bx+1.25,bz+sz+0.04);}
  else{for(const sx of [-0.9,0.9])block(bx+sx-0.04,bz-1.25,bx+sx+0.04,bz+0.05);}
  STATIC_INTER.push({id,x:ix,z:iz,r:1.4,prio:3,blip:'#58b4ff',
    label:()=>TRK.mounted?null:(S.urge>40?'Toilette benutzen (E halten)':'Toilette (noch kein Harndrang)'),
    hold:()=>S.urge>40?2.5:0,
    use:()=>{sfxPlay('toilet');S.urge=0;S.hygiene=Math.max(0,S.hygiene-2);SND.click(300);banner('ERLEICHTERUNG','Harndrang 0','#58b4ff');hLine('toilet');}});
}
wcCubicle('wc_yps',-52.6,-83.0,'e',-51.4,-83.0);
wcCubicle('wc_boopers',69.4,27.7,'n',69.4,25.7);
