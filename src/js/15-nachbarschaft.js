/* ---------- Nachbarschaft: Fahrrad und drei Läden (Späti, Bäckerei, Supermarkt) ---------- */
S.store=null;S.fullT=0;
/* ----- Fahrrad ----- */
const BIKE={g:new THREE.Group(),x:-12.2,z:-9.2,rot:0,mounted:false};
{
  const g=BIKE.g,RED=0xc0392b,BLK=0x1c1c1e;
  for(const z of [-0.55,0.55]){
    const w=new THREE.Mesh(new THREE.TorusGeometry(0.34,0.035,6,18),M(BLK));w.rotation.y=Math.PI/2;w.position.set(0,0.37,z);w.castShadow=true;g.add(w);
    cylS(g,0.05,0.05,0.08,8,0x999999,0,0.33,z).rotation.z=Math.PI/2;
  }
  box(g,0.05,0.05,1.05,RED,0,0.6,0,false);                       // Oberrohr
  const sp=box(g,0.05,0.5,0.05,RED,0,0.3,-0.2,false);sp.rotation.x=0.35;     // Sitzrohr
  const fk=box(g,0.04,0.62,0.04,0x888888,0,0.2,0.52,false);fk.rotation.x=-0.22;  // Gabel
  box(g,0.04,0.3,0.04,0x888888,0,0.85,0.45,false);                // Lenkerstange
  box(g,0.6,0.04,0.04,BLK,0,1.1,0.43,false);                      // Lenker
  box(g,0.16,0.07,0.3,BLK,0,0.92,-0.25,false);                    // Sattel
  box(g,0.2,0.04,0.5,0x888888,0,0.5,-0.62,false);                 // Gepäckträger
  g.position.set(BIKE.x,0,BIKE.z);scene.add(g);
}
function bikeOutside(){return !(P.x>-9.7&&P.x<9.7&&Math.abs(P.z)<6.7)&&!(P.x>18.1&&P.x<34.4&&P.z<-0.3&&P.z>-6.3)&&!inYPS(P.x,P.z)&&!inPub(P.x,P.z)&&P.fl===0&&P.y<0.5;}
function bikeMount(){
  if(BIKE.mounted)return;BIKE.mounted=true;S.store=null;SND.click(520);hLine('bike',1800);
}
function bikeDismount(){
  if(!BIKE.mounted)return;BIKE.mounted=false;BIKE.x=P.x;BIKE.z=P.z;BIKE.rot=P.rot;
}
function bikeKey(){
  if(S.mode!=='play')return;
  if(BIKE.mounted){bikeDismount();SND.click(380);return;}
  if(!bikeOutside()){say('Houg','Das Fahrrad kann ich nur draußen rufen.',2400);SND.buzz();return;}
  BIKE.x=P.x+Math.sin(P.rot)*0.9;BIKE.z=P.z+Math.cos(P.rot)*0.9;BIKE.rot=P.rot;
  bikeMount();banner('FAHRRAD','Aufgestiegen · X zum Absteigen','#8ee26b');
}
function bikeUpdate(dt){
  const g=BIKE.g;
  if(BIKE.mounted){
    if(!bikeOutside()){bikeDismount();}      // am Haus automatisch absteigen
    else{BIKE.x=P.x;BIKE.z=P.z;BIKE.rot=P.rot;}
  }
  g.position.set(BIKE.x,BIKE.mounted?P.y:0,BIKE.z);g.rotation.y=BIKE.rot;
  g.visible=Math.abs(g.position.y-P.y)<1.6||BIKE.mounted;
  if(BIKE.mounted){
    const sp=Math.hypot(P.vx,P.vz);
    BIKE.wheel=(BIKE.wheel||0)+sp*dt*3;
    player.position.y=P.y+0.04+0.32;
    animWalk(player,P.t,0,0);
  }
}
/* ----- Läden ----- */
const STORES={
 spaeti:{name:'Späti 24',open:[0,1440],tag:'Immer offen. Schnelle Snacks.',x:-10.8,z:31,
  items:[
   {id:'riegel',n:'Schokoriegel',p:2,h:12,m:2,d:'Kurz satt, kurz glücklich.'},
   {id:'chips',n:'Paprika-Chips',p:3,h:16,m:3,u:2,d:'Knabbern, aber nicht lange satt.'},
   {id:'cola',n:'Kalte Cola',p:2,h:6,m:2,u:10,drink:1,d:'Erfrischt. Drückt auf die Blase.'},
   {id:'bier',n:'Feierabendbier',p:3,h:4,m:6,u:14,drink:1,d:'Hebt die Stimmung. Drückt auf die Blase.'},
   {id:'hotdog',n:'Hotdog mit Röstzwiebeln',p:5,h:30,m:2,full:60,d:'Solide. Hält eine Weile vor.'},
   {id:'doener',n:'Dönerteller',p:9,h:55,m:4,full:150,u:4,d:'Macht richtig satt. Hunger kommt viel langsamer.'}
  ]},
 baeckerei:{name:'Bäckerei Brezel',open:[360,1080],tag:'Täglich 6:00–18:00 Uhr. Frisch gebacken.',x:-24.5,z:15.5,
  items:[
   {id:'broetchen',n:'Frische Brötchen',p:2,h:14,d:'Warm und knusprig.'},
   {id:'brezel',n:'Laugenbrezel',p:2,h:16,m:1,d:'Klassiker.'},
   {id:'croissant',n:'Butter-Croissant',p:3,h:18,m:3,d:'Gut zum Kaffee.'},
   {id:'kuchen',n:'Stück Käsekuchen',p:6,h:28,m:7,full:40,d:'Süß und sättigend. Haussegen +7.'},
   {id:'brot',n:'Brotlaib für Sandwiches',p:8,stock:4,d:'Füllt den Sandwich-Vorrat im Kühlschrank um 4.'}
  ]},
 markt:{name:'Markt Frisch',open:[420,1320],tag:'Täglich 7:00–22:00 Uhr. Gesundes und Vorräte.',x:-24.5,z:-31,
  items:[
   {id:'banane',n:'Banane',p:1,h:8,hp:3,d:'Billig und gesund.'},
   {id:'obst',n:'Obstkorb',p:6,h:24,hp:8,m:2,d:'Gesund. Gibt Gesundheit.'},
   {id:'salat',n:'Salat-Bowl mit Hähnchen',p:8,h:32,hp:10,full:50,d:'Leicht, aber ordentlich satt.'},
   {id:'tkpizza',n:'Tiefkühlpizza (frisch gebacken)',p:6,h:45,m:3,full:90,d:'Satt für ein paar Stunden.'},
   {id:'vorrat',n:'Wocheneinkauf für den Kühlschrank',p:14,stock:6,d:'Füllt den Sandwich-Vorrat um 6.'},
   {id:'duschgel',n:'Duschgel & Seife',p:5,hyg:25,d:'Hygiene +25, ohne Badewanne.'}
  ]}
};
const storeOpen=k=>{const o=STORES[k].open,t=S.minutes%1440;return t>=o[0]&&t<o[1];};
function openStore(k){
  if(BIKE.mounted)bikeDismount();
  S.store=k;S.mode='shop';$('phone').hidden=false;
  $('phTitle').textContent=STORES[k].name;$('phClose').textContent='Verlassen (Esc)';
  for(const id of ['secShop','phShop','secGoal','phGoal'])$(id).style.display='none';
  for(const id of ['secFood','phFood'])$(id).style.display='';
  $('secFood').textContent=STORES[k].tag;
  renderStore();
}
function renderStore(){
  const st=STORES[S.store];if(!st)return;
  $('phCash').textContent='Dein Geld: $'+Math.floor(S.money)+' · Hunger '+Math.round(S.hunger)+'/100';
  $('phFood').innerHTML=st.items.map(it=>{
    const pr0=shopPrice(it.p),dcn=bagDiscount(pr0,S.store),pr=dcn.price,eff=[];
    if(it.h)eff.push('Hunger +'+it.h);if(it.full)eff.push('hält '+(it.full>=100?'lang':'etwas länger')+' vor');
    if(it.m)eff.push('Haussegen +'+it.m);if(it.hp)eff.push('Gesundheit +'+it.hp);if(it.hyg)eff.push('Hygiene +'+it.hyg);
    if(it.inv)eff.push('landet in der Tasche');if(it.stock)eff.push('Vorrat +'+it.stock);if(it.u)eff.push('Harndrang +'+it.u);
    const pureFood=it.h&&!it.stock&&!it.hyg&&!it.m&&!it.hp,full=it.h&&S.hunger>=97&&pureFood;
    const bad=S.money<pr||full||(it.stock&&S.stock>=maxStock())||(it.hyg&&S.hygiene>=95)||(it.inv&&!bagCanAdd(it.inv));
    return '<div class="card food"><h3>'+it.n+'</h3><p>'+it.d+'<br><b>'+eff.join(' · ')+'</b></p><button type="button" data-item="'+it.id+'"'+(bad?' disabled':'')+'>'+
      (full?'Du bist satt':(it.stock&&S.stock>=maxStock()?'Vorrat voll':(it.hyg&&S.hygiene>=95?'Schon sauber':(it.inv&&!bagCanAdd(it.inv)?'Tasche voll':'Kaufen ($'+pr+(dcn.used?' statt $'+pr0:'')+')'))))+'</button></div>';
  }).join('');
}
function storeBuy(id){
  const st=STORES[S.store];if(!st)return;const it=st.items.find(i=>i.id===id);if(!it)return;
  const pr0=shopPrice(it.p),dcn=bagDiscount(pr0,S.store),pr=dcn.price;if(S.money<pr)return;
  if(it.inv&&!bagCanAdd(it.inv))return;
  S.money-=pr;if(dcn.used){bagTake(dcn.used);banner('EINGELÖST',dcn.note,'#8ee26b');}
  if(it.inv){bagAdd(it.inv,1);SND.ding();banner('IN DIE TASCHE',BAGI[it.inv].ic+' '+BAGI[it.inv].n+' · −$'+pr,'#8ee26b');renderStore();return;}
  if(it.h)S.hunger=Math.min(100,S.hunger+it.h);
  if(it.m)S.mood=Math.min(100,S.mood+it.m);
  if(it.hp)S.health=Math.min(100,S.health+it.hp);
  if(it.hyg)S.hygiene=Math.min(100,S.hygiene+it.hyg);
  if(it.u)S.urge=Math.min(100,S.urge+it.u);
  if(it.stock)S.stock=Math.min(maxStock(),S.stock+it.stock);
  if(it.full)S.fullT=Math.max(S.fullT,it.full*2);
  SND.eat();if(it.drink)playDrink(player,2.2);else if(it.h)playOnce(player,'cheer',1.2);
  banner('GEKAUFT',it.n+' · −$'+pr,'#8ee26b');hLine('shop',2200);
  renderStore();
}
function shopStep(dt){if(S.fullT>0)S.fullT-=dt;}
for(const k in STORES){
  const st=STORES[k];
  STATIC_INTER.push({id:'store-'+k,x:st.x,z:st.z,r:2.3,prio:3.2,blip:'#f5c542',
    label:()=>storeOpen(k)?st.name+' betreten (E)':st.name+' hat geschlossen ('+st.tag+')',
    use:()=>{if(!storeOpen(k)){say('Houg','Zu. Ich komme später wieder.',2400);SND.buzz();return;}openStore(k);}});
}
STATIC_INTER.push({id:'bikeLoc',get x(){return BIKE.x;},get z(){return BIKE.z;},r:1.7,prio:2.6,blip:'#e04b3a',
  label:()=>BIKE.mounted?null:'Fahrrad: aufsteigen (E) · X ruft es zu dir',use:bikeMount});
