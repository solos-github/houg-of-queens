/* ---------- Telefon, Pizza-Bestellung und Versandkatalog ---------- */
const STEEL=new THREE.MeshStandardMaterial({color:0xc4c9cc,metalness:.75,roughness:.3});
function scaleFridge(h){if(!fridgeBody)return;fridgeBody.scale.y=h;fridgeBody.position.y=h;}
const CATALOG=[
 {id:'fridge1',name:'Großer Kühlschrank',price:60,desc:'Vorrat bis 12 Sandwiches, jedes sättigt +36 statt +30.',
  buy(){S.upg.fridge=1;fridgeBody.material=M(0xf1f0ec);scaleFridge(1.07);}},
 {id:'fridge2',name:'Edelstahl-Kühlschrank',price:150,req:'fridge1',desc:'Vorrat bis 18 Sandwiches, jedes sättigt +44. Mit Eisspender.',
  buy(){S.upg.fridge=2;fridgeBody.material=M(0xf4f4f1);scaleFridge(1.14);box(W,0.4,0.25,0.03,0x2a6fd0,3.55,1.2,-5.12,false);S.stock=Math.min(maxStock(),S.stock+4);}},
 {id:'tv1',name:'Flachbild-Fernseher',price:80,desc:'Größeres Bild: Fernsehabend bringt 1,5-fach Sozialkontakte.',
  buy(){S.upg.tv=1;oldTV.visible=false;box(W,1.5,0.9,0.06,0x101010,-4.6,0.6,3.3);box(W,0.5,0.08,0.3,0x1a1a1a,-4.6,0.5,3.3);tvScreen.position.set(-4.6,1.05,3.265);tvScreen.scale.set(1.6,1.35,1);}},
 {id:'tv2',name:'Heimkino mit Soundbar',price:200,req:'tv1',desc:'Zwei Standlautsprecher: Fernsehabend bringt doppelt Sozialkontakte.',
  buy(){S.upg.tv=2;for(const sx of [-1,1]){box(W,0.35,1.2,0.3,0x1b1b1b,-4.6+sx*1.3,0,3.2);cylS(W,0.1,0.1,0.02,12,0x555555,-4.6+sx*1.3,0.9,3.03);}box(W,1.2,0.1,0.14,0x222222,-4.6,0.5,3.0);}},
 {id:'plant',name:'Große Zimmerpflanze',price:25,deco:1,desc:'Ecke im Wohnzimmer. Connie freut sich: Haussegen +8.',
  buy(){cylS(W,0.28,0.22,0.5,12,0xa0522d,-8.2,0,5.2);for(let i=0;i<7;i++)sph(W,0.3,0x2f8f4a,-8.2+Math.sin(i*1.4)*0.22,0.8+i*0.14,5.2+Math.cos(i*1.4)*0.22,1,1.1,1);}},
 {id:'art',name:'Football-Poster',price:35,deco:1,desc:'Gerahmt, an der Südwand. Haussegen +8.',
  buy(){pic(-3.0,1.5,5.83,1.1,0.75,0x3a8a4a,'S');pic(-1.7,1.6,5.83,0.5,0.6,0xd8b040,'S');}},
 {id:'lamp',name:'Stehlampe',price:45,deco:1,desc:'Warmes Licht im Esszimmer. Haussegen +8.',
  buy(){cylS(W,0.2,0.2,0.04,10,0x6b4a2f,-2.2,0,4.9);cylS(W,0.03,0.03,1.6,6,0x8a6a40,-2.2,0,4.9);cylS(W,0.2,0.32,0.4,12,0xf8e8b8,-2.2,1.55,4.9);const l=new THREE.PointLight(0xffd9a0,0.5,8);l.position.set(-2.2,1.8,4.9);W.add(l);}},
 {id:'rug',name:'Neuer Küchenteppich',price:60,deco:1,desc:'Vor dem Herd. Haussegen +8.',
  buy(){tbox(W,2.4,0.03,1.6,MT(TX_RUG2,1),3.2,0,-1.4);}},
 {id:'aquarium',name:'Aquarium',price:90,deco:1,desc:'Auf dem Schrank unter der Durchreiche. Haussegen +8.',
  buy(){      // auf dem weißen Schrank unter der Durchreiche (x 1.2, z 1.0), Boden, Deckel, Glas, Fische
        const cx=1.2,cz=1.0,top=1.05;
        box(W,0.42,0.05,1.1,0x3a3a3a,cx,top,cz,false);
        const m=new THREE.Mesh(new THREE.BoxGeometry(0.38,0.4,1.0),new THREE.MeshStandardMaterial({color:0x7fd0e8,transparent:true,opacity:.42,roughness:.1}));m.position.set(cx,top+0.27,cz);W.add(m);
        box(W,0.36,0.08,0.98,0xd8c690,cx,top+0.09,cz,false);
        for(const [dz,c,dy] of [[-0.3,0xff8a2b,0.22],[0.0,0xffd33b,0.3],[0.28,0xff5a5a,0.25]])sph(W,0.05,c,cx,top+dy,cz+dz,1.6,1,1);
        sph(W,0.04,0x3f8f4a,cx,top+0.2,cz-0.42,1,2.2,1);sph(W,0.04,0x3f8f4a,cx,top+0.2,cz+0.4,1,2.6,1);}}
];
const TRIPS=[{name:'Wochenende in Coney Island',cost:600},{name:'Kurztrip nach Miami',cost:1800},{name:'Hawaii-Urlaub mit Connie',cost:4500}];
S.trip=0;S.tripLevel=0;
function tripDeposit(amount){
  if(S.tripLevel>=TRIPS.length)return;
  const tr=TRIPS[S.tripLevel],a=Math.min(amount==='all'?S.money:amount,S.money,tr.cost-S.trip);
  if(a<=0)return;
  S.money-=a;S.trip+=a;SND.click(620);
  if(S.trip>=tr.cost){
    S.tripLevel++;S.trip=0;S.mood=Math.min(100,S.mood+25);S.social=Math.min(100,S.social+30);SND.win();
    banner('REISE GEBUCHT!',tr.name+' · Haussegen +25 · Sozialkontakte +30','#8ee26b');
    if(S.tripLevel>=TRIPS.length)setTimeout(()=>say('Connie','Hawaii?! Du hast wirklich gespart. Ich liebe dich, Houg.',6000),1500);
    else setTimeout(()=>say('Connie','Das wird schön, Schatz! Was kommt als Nächstes?',4000),1500);
  }
}
function openShopUI(laptop){
  S.mode='shop';$('phone').hidden=false;$('secFood').textContent='Essen';
  $('phTitle').textContent=laptop?'Laptop – Online-Shop':'Telefon';
  $('phClose').textContent=laptop?'Laptop zuklappen (Esc)':'Auflegen (Esc)';
  for(const id of ['secFood','phFood'])$(id).style.display=laptop?'none':'';
  for(const id of ['secShop','phShop','secGoal','phGoal'])$(id).style.display=laptop?'':'none';
  renderPhone();
}
function openPhone(){openShopUI(false);}
function openLaptop(){openShopUI(true);}
function closePhone(){$('phone').hidden=true;S.mode='play';S.store=null;}
function renderPhone(){
  if(S.store){renderStore();return;}
  $('phCash').textContent='Dein Geld: $'+Math.floor(S.money);
  const pz=S.pizzaT>0||S.pizzaReady;
  $('phFood').innerHTML=
   '<div class="card food"><h3>🥪 Sandwich aus dem Kühlschrank</h3><p><b>Gratis.</b> Sättigt +'+sandwichGain()+' Hunger. Verbraucht den Vorrat ('+S.stock+'/'+maxStock()+'). Wird der Vorrat leer, musst du bei Connie die Aufgabe „Einkäufe einräumen“ erledigen.</p></div>'+
   '<div class="card food"><h3>🍕 Pizza bestellen</h3><p><b>$'+pizzaPrice()+'.</b> Sättigt +60 Hunger und bringt +10 Haussegen. Unabhängig vom Vorrat, aber erst nach 40 Sekunden an der Haustür abholen.</p>'+
   '<button type="button" data-pizza="1"'+(pz||S.money<pizzaPrice()?' disabled':'')+'>'+(pz?'Schon unterwegs':'Bestellen ($'+pizzaPrice()+')')+'</button></div>'+workPhoneCard();
  {const done=S.tripLevel>=TRIPS.length,tr=TRIPS[Math.min(S.tripLevel,TRIPS.length-1)];
   $('phGoal').innerHTML=done?'<div class="card own"><h3>Alle Reisen gebucht</h3><p>Du hast alles erreicht. Genieße das Leben in Queens.</p></div>':
    '<div class="card"><h3>✈ '+tr.name+'</h3><p>Reisekasse: <b>$'+Math.floor(S.trip)+' / $'+tr.cost+'</b> ('+Math.round(S.trip/tr.cost*100)+'%). Langfristiges Ziel: Sparen, bis die Reise gebucht ist. Gibt Haussegen und Sozialkontakte.</p>'+
    [50,200,'all'].map(v=>'<button type="button" data-save="'+v+'"'+(S.money<=0?' disabled':'')+'>'+(v==='all'?'Alles einzahlen':'$'+v+' einzahlen')+'</button>').join(' ')+'</div>';}
  $('phShop').innerHTML=CATALOG.map(it=>{
    const own=!!S.deco[it.id]||(it.id==='fridge1'&&S.upg.fridge>=1)||(it.id==='fridge2'&&S.upg.fridge>=2)||(it.id==='tv1'&&S.upg.tv>=1)||(it.id==='tv2'&&S.upg.tv>=2);
    const locked=it.req&&!(it.req==='fridge1'?S.upg.fridge>=1:(it.req==='tv1'?S.upg.tv>=1:!!S.deco[it.req]));
    const pr=shopPrice(it.price),dis=own||locked||S.money<pr;
    return '<div class="card'+(own?' own':'')+'"><h3>'+it.name+'</h3><p>'+it.desc+'</p><button type="button" data-buy="'+it.id+'"'+(dis?' disabled':'')+'>'+(own?'Gekauft':(locked?'Erst Vorstufe kaufen':'Kaufen ($'+pr+')'))+'</button></div>';
  }).join('')+'<div class="sec" style="grid-column:1/-1">Kleidung – kommt in den Kleiderschrank (Taste I)</div>'+clothCards();
}
$('phone').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.id==='phClose'){closePhone();return;}
  if(b.dataset.item){storeBuy(b.dataset.item);return;}
  if(b.dataset.cloth){clothBuy(b.dataset.cloth);return;}
  if(b.dataset.pizza){orderPizza();renderPhone();return;}
  if(b.dataset.sick){callSick();return;}
  if(b.dataset.save){tripDeposit(b.dataset.save==='all'?'all':+b.dataset.save);renderPhone();return;}
  if(b.dataset.buy){
    const it=CATALOG.find(c=>c.id===b.dataset.buy);if(!it)return;const pr=shopPrice(it.price);if(S.money<pr)return;
    S.money-=pr;it.buy();
    if(it.deco){S.deco[it.id]=1;S.mood=Math.min(100,S.mood+8);}
    SND.win();playOnce(player,'checkout',2.4);banner('GEKAUFT',it.name,'#8ee26b');renderPhone();
  }
});
