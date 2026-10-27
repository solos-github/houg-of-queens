/* ---------- Inventar: Taschen (6 Slots), Kleiderschrank, Geschenke, Tickets, Werkzeuge ---------- */
const BAG_SLOTS=6,BAG_STACK=3;
S.bag=[];S.wardrobe={};S.outfit=null;S.fxT=0;S.fxMul=1;
const clampN=(v,a,b)=>Math.max(a,Math.min(b,v));
function fxSpeed(sec,mul,name){S.fxT=sec;S.fxMul=mul;banner(name,(mul>1?'Tempo ×':'Tempo ×')+mul+' für '+sec+' s',mul>=1?'#8ee26b':'#ffb347');}
const nearHome=()=>{try{return atHome();}catch(e){return true;}};
const workBlocked=()=>{try{return S.chapter>=3&&isWorkday()&&!S.workHome;}catch(e){return false;}};

/* ===== Gegenstände ===== */
const BAGI={
 // Getränke
 energy:{n:'Mega-Energydrink',ic:'🥤',cat:'Getränk',d:'Tempo ×1,3 für 90 Sekunden. Drückt kräftig auf die Blase.',v:2,
  use(){S.urge=Math.min(100,S.urge+12);fxSpeed(90,1.3,'ENERGYDRINK');SND.eat();try{playDrink(player,2.2);}catch(e){}return true;}},
 kaffee:{n:'Kaffee to go',ic:'☕',cat:'Getränk',d:'Tempo ×1,12 für 2 Minuten und Haussegen +2.',v:1,
  use(){S.mood=Math.min(100,S.mood+2);fxSpeed(120,1.12,'KAFFEE');SND.eat();try{playDrink(player,2.2);}catch(e){}return true;}},
 milch:{n:'Erdbeer-Milchshake',ic:'🥛',cat:'Getränk',d:'Hunger +20, Haussegen +4. Cremig und viel zu süß.',v:2,
  use(){S.hunger=Math.min(100,S.hunger+20);S.mood=Math.min(100,S.mood+4);banner('MILCHSHAKE','Hunger +20 · Haussegen +4','#ff9d3d');SND.eat();try{playDrink(player,2.2);}catch(e){}return true;}},
 bier:{n:'Kühles Bier',ic:'🍺',cat:'Getränk',d:'Haussegen +8, Harndrang +14, danach 60 s etwas träger.',v:2,gift:{archie:{m:0,line:'Ein Bier? Hm. Du bist nicht ganz dumm, Houg.'},friend:{s:8,line:'Na endlich jemand mit Verstand! Prost!'}},
  use(){S.mood=Math.min(100,S.mood+8);S.urge=Math.min(100,S.urge+14);fxSpeed(60,0.9,'BIER');SND.eat();try{playDrink(player,2.2);}catch(e){}return true;}},
 smoothie:{n:'Mysteriöser Smoothie',ic:'🧪',cat:'Getränk',d:'Grünlich. Niemand weiß, was drin ist. Wirkung zufällig.',v:1,
  use(){const r=Math.floor(Math.random()*4);
   if(r===0){S.hunger=Math.min(100,S.hunger+30);banner('SMOOTHIE','Überraschend lecker · Hunger +30','#8ee26b');}
   else if(r===1){S.urge=Math.min(100,S.urge+35);banner('SMOOTHIE','Das hat Folgen · Harndrang +35','#ffb347');say('Houg','Oh. Oh nein. Das arbeitet sofort.',2800);}
   else if(r===2){fxSpeed(60,1.5,'SMOOTHIE');say('Houg','Ich sehe Farben! Und ich bin SCHNELL!',2800);}
   else{S.mood=Math.max(0,S.mood-5);S.hygiene=Math.max(0,S.hygiene-4);banner('SMOOTHIE','Schmeckt nach Gartenerde · Haussegen −5','#ff7b7b');}
   SND.eat();try{playDrink(player,2.2);}catch(e){}return true;}},
 // Fundstücke
 ente:{n:'Gummiente',ic:'🦆',cat:'Fundstück',d:'Quietscht. Connie findet sie bestimmt süß. Oder auch nicht.',v:3,gift:{connie:{m:4,line:'Eine Gummiente? Houg … na gut. Die kommt ins Bad.'},archie:{m:-2,line:'Was soll ich damit, du Idiot?'},friend:{s:6,line:'Haha! Die ist super!'}},
  use(){SND.click(900);S.mood=Math.min(100,S.mood+2);banner('QUIETSCH','Haussegen +2','#f5c542');return 'keep';}},
 bowling:{n:'Alte Bowlingkugel',ic:'🎳',cat:'Fundstück',d:'Schwer und mit Namen „Gus“ beschriftet. Lässt sich verkaufen.',v:14,gift:{friend:{s:10,line:'Eine Kugel mit Namen drauf! Respekt, Houg.'}},
  use(){SND.click(240);say('Houg','Strike. Wenn hier eine Bahn wäre.',2400);return 'keep';}},
 elvis:{n:'Wackel-Elvis',ic:'🕺',cat:'Fundstück',d:'Wackelt mit der Hüfte. Archies heimliche Schwäche.',v:9,gift:{archie:{m:6,line:'Der King! Das ist… moment. Das ist tatsächlich schön. Verschwinde, bevor ich rührselig werde.'},connie:{m:-2,line:'Der kommt nicht ins Wohnzimmer.'},friend:{s:8,line:'Thank you, thank you very much!'}},
  use(){SND.click(700);S.mood=Math.min(100,S.mood+3);banner('ELVIS WACKELT','Haussegen +3','#f5c542');return 'keep';}},
 socke:{n:'Einzelne Socke',ic:'🧦',cat:'Fundstück',d:'Keine Ahnung, wem die gehört. Wertlos.',v:1,
  use(){say('Houg','Die Gegenstücke verschwinden irgendwo. Wie immer.',2400);return false;}},
 golf:{n:'Rostiger Golfschläger',ic:'⛳',cat:'Fundstück',d:'Ein Eisen 7, das schon bessere Zeiten gesehen hat.',v:8,gift:{friend:{s:9,line:'Ein Golfschläger! Wir sollten mal spielen gehen.'},archie:{m:2,line:'Das ist ein Eisen 7. Immerhin etwas Vernünftiges.'}},
  use(){say('Houg','Ein Schwung im Flur… nein. Connie würde mich töten.',2600);return false;}},
 zahn:{n:'Goldzahn',ic:'🦷',cat:'Fundstück',d:'Ob das echt ist? Bringt beim Verkaufen gutes Geld.',v:28,
  use(){say('Houg','Den will ich lieber nicht in den Mund nehmen.',2400);return false;}},
 // Geschenke
 blumen:{n:'Blumenstrauß',ic:'💐',cat:'Geschenk',d:'Roter Klassiker. Connie freut sich über so etwas immer.',v:3,gift:{connie:{m:14,line:'Houg! Blumen? Womit habe ich das verdient? Ich stelle sie sofort ins Wasser.'},archie:{m:-1,line:'Blumen? Für mich? Ich bin nicht tot, Houg.'},friend:{s:3,line:'Äh… danke? Sehr aufmerksam.'}},
  use(){S.mood=Math.min(100,S.mood+1);say('Houg','Die duften wirklich gut. Die behalte ich für Connie.',2600);return false;}},
 pralinen:{n:'Pralinenschachtel',ic:'🍫',cat:'Geschenk',d:'Für Connie oder zum Selbstessen. Hunger +10.',v:4,gift:{connie:{m:11,line:'Pralinen! Du kennst mich einfach, Schatz.'},archie:{m:5,line:'Hm. Ich nehme sie. Aber nur aus Höflichkeit.'},friend:{s:7,line:'Die teilen wir uns alle, oder?'}},
  use(){S.hunger=Math.min(100,S.hunger+10);S.mood=Math.min(100,S.mood+3);banner('PRALINEN','Hunger +10 · Haussegen +3','#ff9d3d');SND.eat();return true;}},
 // Tickets und Gutscheine
 kino:{n:'Kinokarten (2)',ic:'🎟',cat:'Ticket',d:'Kinoabend mit Connie: 2 Stunden. Haussegen +15, Sozialkontakte +20. Nur nachmittags/abends, wenn Connie zuhause ist.',v:5,
  use(){
   if(S.mode!=='play'||!nearHome()||workBlocked()){say('Houg','Jetzt nicht. Erst zuhause und wenn keine Arbeit ruft.',2600);return false;}
   if(connie.away||!connie.mesh.visible||S.cLeft){say('Houg','Ohne Connie macht Kino keinen Spaß.',2400);return false;}
   if(S.minutes<14*60||S.minutes>19.5*60){say('Houg','Die Vorstellungen laufen nur zwischen 14 und 19:30 Uhr.',2800);return false;}
   outing('KINOABEND','Ihr seht einen Film über sprechende Autos. Connie weint, Houg schläft.',120,{m:15,s:20,h:-12});
   setTimeout(()=>say('Connie','Das war wunderschön! Danke für den Abend, Houg.',4200),1400);return true;}},
 sport:{n:'Football-Tickets',ic:'🏟',cat:'Ticket',d:'Ein Spiel im Stadion: 3 Stunden. Sozialkontakte +30, Haussegen +8, Hunger −15. Tagsüber, nicht an Arbeitstagen.',v:7,
  use(){
   if(S.mode!=='play'||!nearHome()||workBlocked()){say('Houg','Jetzt nicht. Erst zuhause und wenn keine Arbeit ruft.',2600);return false;}
   if(S.minutes<10*60||S.minutes>16.5*60){say('Houg','Das Spiel beginnt zwischen 10 und 16:30 Uhr.',2600);return false;}
   outing('STADION','Die Queens Knights gewinnen in der Verlängerung. Houg heiser, aber glücklich.',180,{m:8,s:30,h:-15});return true;}},
 resti:{n:'Restaurantgutschein',ic:'🍽',cat:'Gutschein',d:'Zieht beim nächsten Einkauf bei Boopers bis zu $20 ab. Wird an der Kasse automatisch eingelöst.',v:6,auto:1,
  use(){say('Houg','Den löse ich bei Boopers ein.',2200);return false;}},
 coupon:{n:'Rabattcoupon',ic:'🏷',cat:'Gutschein',d:'50 % auf den nächsten Einkauf in einem beliebigen Laden. Wird an der Kasse automatisch eingelöst.',v:2,auto:1,
  use(){say('Houg','Der gilt an der Kasse. Ich muss nur einkaufen gehen.',2400);return false;}},
 // Werkzeug
 tape:{n:'Klebeband',ic:'🩹',cat:'Werkzeug',d:'Entschärft einen laufenden Streich sofort. Hält alles zusammen, außer Hougs Pläne.',v:3,
  use(){if(!S.prank){say('Houg','Gerade klebt nichts. Noch nicht.',2200);return false;}prankEnd(true);return true;}},
 driver:{n:'Schraubenzieher',ic:'🪛',cat:'Werkzeug',d:'Entschärft einen laufenden Streich sofort. Notfalls auch als Hebel.',v:4,
  use(){if(!S.prank){say('Houg','Nichts zu schrauben.',2000);return false;}prankEnd(true);return true;}},
 batt:{n:'Ersatzbatterien',ic:'🔋',cat:'Werkzeug',d:'Findet die Fernbedienung sofort wieder, wenn der Fernseher wartet (Sperre aufgehoben).',v:3,
  use(){if(!(S.tvCd>0)){say('Houg','Die fernbedienung funktioniert gerade. Seltsam.',2400);return false;}S.tvCd=0;SND.ding();banner('BATTERIEN','Fernbedienung funktioniert wieder','#8ee26b');return true;}},
 torch:{n:'Taschenlampe',ic:'🔦',cat:'Werkzeug',d:'Wird nie verbraucht. In der Nacht (20–6 Uhr) findest du in Mülleimern mehr und besseres.',v:8,
  use(){say('Houg',(S.minutes>=20*60||S.minutes<6*60)?'Perfekt für die Mülleimer. Ich bin quasi Schatzsucher.':'Tagsüber brauche ich sie nicht. Nachts durchsuche ich Mülleimer damit besser.',3000);return 'keep';}}
};
const BAG_ORDER=Object.keys(BAGI);
BAG_ORDER.forEach(id=>BAGI[id].id=id);

/* ===== Kleiderschrank ===== */
const CLOTHES={
 ips:{n:'IPS-Uniform',ic:'📦',price:40,m:{cash:1.1,spd:1.08,hung:0.85},bo:[{i:'💰',s:'+10 % Geld',t:'Aufgaben und Lieferungen bringen 10 % mehr Geld.'},{i:'👟',s:'+8 % Tempo',t:'Du läufst 8 % schneller – Paketboten haben Routine.'},{i:'🍔',s:'Hunger −15 %',t:'Der Hunger sinkt 15 % langsamer.'}],d:'Die offizielle Lieferuniform. Aufgaben und Lieferungen bringen 10 % mehr Geld.',
  c:{line:'Die IPS-Uniform steht dir. Und ich muss dich nicht an die Arbeit erinnern.'},a:{line:'Wie der Paketbote. Genau so siehst du aus.'},f:{line:'Houg, bringst du uns auch ein Paket mit?'}},
 trikot:{n:'Football-Trikot',ic:'🏈',price:30,m:{soc:0.5,spd:1.1,urge:0.8},bo:[{i:'👥',s:'Fans halten zu dir',t:'Sozialkontakte sinken nur halb so schnell.'},{i:'🏃',s:'+10 % Tempo',t:'Du läufst 10 % schneller – Sportlerbeine.'},{i:'🚽',s:'Blase +20 %',t:'Harndrang steigt 20 % langsamer.'}],d:'Die Queens Knights. Sozialkontakte sinken nur halb so schnell.',
  c:{line:'Das Trikot! Hoffentlich wäschst du es jetzt auch mal.'},a:{line:'Football! Du siehst aus wie ein riesiger Hotdog.'},f:{line:'Das ist der Geist! Los, Knights!'}},
 anzug:{n:'Anzug',ic:'🤵',price:90,m:{guard:0.7,price:0.9,rew:1.5},bo:[{i:'🕶',s:'Unauffällig',t:'Wachen im Kanzlei-Turm erkennen dich erst aus 30 % kürzerer Entfernung.'},{i:'🛍',s:'Preise −10 %',t:'Läden und Laptop-Shop: alles 10 % günstiger – du siehst vertrauenswürdig aus.'},{i:'🎁',s:'Belohnungen +50 %',t:'Belohnungen für Aufgaben und Lieferungen fallen 50 % häufiger aus.'}],d:'Schick. Wachen im Kanzlei-Turm erkennen dich erst aus 30 % kürzerer Entfernung.',
  c:{line:'Wow, Houg. Das sieht richtig gut aus!'},a:{line:'Ein Anzug. Hat jemand gestorben oder bist du bei Gericht?'},f:{line:'Hey, der Herr Rechtsanwalt!'}},
 bademantel:{n:'Bademantel',ic:'🛁',cat:'',price:35,m:{hyg:0.5,hung:0.8,regen:1.6},bo:[{i:'🧼',s:'Hygiene −50 %',t:'Die Hygiene sinkt nur halb so schnell.'},{i:'🍔',s:'Hunger −20 %',t:'Der Hunger sinkt 20 % langsamer – du bewegst dich kaum.'},{i:'❤️',s:'Erholung +60 %',t:'Die Gesundheit regeneriert 60 % schneller.'}],d:'Gemütlich. Hygiene sinkt nur halb so schnell, aber peinlich draußen.',
  c:{line:'Im Bademantel bleibst du aber zuhause, Schatz.'},a:{line:'Du siehst aus wie ein nasser Teppich.'},f:{line:'Mann, Houg! Hast du nichts zum Anziehen?'}},
 kostuem:{n:'Hühnerkostüm',ic:'🐔',price:25,m:{sell:1.25,spd:1.12},bo:[{i:'🤝',s:'Sozial +',t:'Sozialkontakte steigen langsam von selbst – alle starren dich an.'},{i:'💵',s:'Verkauf +25 %',t:'Händler zahlen 25 % mehr für Fundstücke – Mitleidsbonus.'},{i:'🐔',s:'+12 % Tempo',t:'Hühnerbeine: Du läufst 12 % schneller.'},{i:'😳',s:'Peinlich',t:'Haussegen sinkt langsam, solange du es trägst.',bad:1}],d:'Absurd und peinlich. Haussegen sinkt langsam, dafür steigen die Sozialkontakte.',
  c:{line:'Houg. Was. Ist. Das.'},a:{line:'Hahaha! Das mache ich mit dir bis in die Ewigkeit!'},f:{line:'Ein Huhn! Wir haben ein Huhn dabei!'}}
};
function om(k){const o=S.outfit&&CLOTHES[S.outfit];return (o&&o.m&&o.m[k])||1;}
const bonusChips=o=>(o.bo||[]).map(b=>'<span class="ochip'+(b.bad?' bad':'')+'" data-tip="'+(o.n+': '+b.t).replace(/"/g,'&quot;')+'">'+b.i+' '+b.s+'</span>').join('');
let ohKey='@';
function outfitHud(){
  const k=S.outfit||'';if(ohKey===k)return;ohKey=k;
  const el=$('outfitHud');if(!el)return;const o=k&&CLOTHES[k];
  el.innerHTML=o?'<span class="ochip ohead" data-tip="'+o.n+' – '+o.d.replace(/"/g,'&quot;')+'">'+o.ic+' '+o.n+'</span>'+bonusChips(o):'';
}
(function(){
  let tip=null;
  const get=()=>tip||(tip=document.getElementById('otip'));
  document.addEventListener('mouseover',e=>{const c=e.target.closest&&e.target.closest('.ochip[data-tip]');const t=get();if(!t)return;if(!c){t.style.display='none';return;}t.textContent=c.dataset.tip;t.style.display='block';});
  document.addEventListener('mousemove',e=>{const t=get();if(!t||t.style.display!=='block')return;t.style.left=Math.min(innerWidth-t.offsetWidth-8,e.clientX+14)+'px';t.style.top=Math.min(innerHeight-t.offsetHeight-8,e.clientY+16)+'px';});
})();
function outfitReactNow(){
  const o=S.outfit&&CLOTHES[S.outfit];if(!o)return;
  const c=bagTargets();
  const t=c.find(x=>x.key==='connie')||c.find(x=>x.key==='archie')||c[0];
  if(!t)return;
  const l=t.key==='connie'?o.c:(t.key==='archie'?o.a:o.f);
  say(t.name,l.line,4400);
}
function wearOutfit(id){
  if(id&&!S.wardrobe[id])return;
  S.outfit=(S.outfit===id)?null:id;
  SND.click(520);
  banner(S.outfit?'ANGEZOGEN':'AUSGEZOGEN',S.outfit?CLOTHES[S.outfit].n:'Normale Kleidung','#8ee26b');
  if(S.outfit)setTimeout(outfitReactNow,900);
  outfitVisual();outfitHud();bagRender();
}
let outfitCd=60;
function outfitStep(dt){
  if(S.mode!=='play'||!S.outfit)return;
  if(S.outfit==='kostuem'){S.social=Math.min(100,S.social+0.05*dt);S.mood=Math.max(0,S.mood-0.03*dt);}
  outfitCd-=dt;
  if(outfitCd<=0){outfitCd=rand(80,140);if(Math.random()<0.7)outfitReactNow();}
}

/* ===== Taschen ===== */
const bagCount=()=>S.bag.length;
const bagHas=id=>S.bag.some(s=>s.id===id);
function bagCanAdd(id){return S.bag.some(s=>s.id===id&&s.q<BAG_STACK)||S.bag.length<BAG_SLOTS;}
function bagAdd(id,q){
  q=q||1;
  for(let i=0;i<q;i++){
    const st=S.bag.find(s=>s.id===id&&s.q<BAG_STACK);
    if(st)st.q++;else if(S.bag.length<BAG_SLOTS)S.bag.push({id,q:1});else return false;
  }
  return true;
}
function bagTake(id){
  const i=S.bag.findIndex(s=>s.id===id);if(i<0)return false;
  if(--S.bag[i].q<=0)S.bag.splice(i,1);return true;
}
function bagGive(id,why){
  const it=BAGI[id];if(!it)return;
  if(bagAdd(id,1))banner('NEU IN DER TASCHE',it.ic+' '+it.n+(why?' · '+why:''),'#f5c542');
  else banner('TASCHE VOLL',it.n+' bleibt liegen','#ff7b7b');
}
/* Gelegentliche Belohnung (Aufgaben, Lieferungen) */
const REWARDS=['kaffee','energy','milch','tape','driver','batt','blumen','pralinen','coupon','kino','sport','resti','bier','ente'];
function bagReward(chance,pool){
  if(Math.random()>=chance*om('rew'))return;
  setTimeout(()=>bagGive(pick(pool||REWARDS),'als Belohnung'),1200);
}
/* Rabatt an der Kasse (Läden): Rückgabe {price, used} */
function bagDiscount(pr,store){
  if(store==='boopers'&&bagHas('resti'))return {price:Math.max(0,pr-20),used:'resti',note:'Restaurantgutschein −$'+Math.min(20,pr)};
  if(bagHas('coupon'))return {price:Math.ceil(pr/2),used:'coupon',note:'Rabattcoupon −50 %'};
  return {price:pr,used:null,note:''};
}
/* Ausflüge (Tickets) */
function outing(title,text,min,e){
  S.minutes+=min;
  S.mood=Math.min(100,S.mood+e.m);S.social=Math.min(100,S.social+e.s);S.hunger=Math.max(0,S.hunger+e.h);
  S.urge=Math.min(100,S.urge+min*0.12);
  SND.win();banner(title,text+' · Haussegen +'+e.m+', Sozialkontakte +'+e.s,'#8ee26b');
}
/* Beschenkbare Personen in der Nähe */
function bagTargets(){
  const out=[],near=(o,r)=>o&&o.mesh&&o.mesh.visible&&Math.abs((o.y||0)-P.y)<1.6&&Math.hypot(o.x-P.x,o.z-P.z)<r;
  try{if(connie&&!connie.away&&!S.cLeft&&near(connie,4.2))out.push({key:'connie',name:'Connie',npc:connie});}catch(e){}
  try{if(archie&&S.archieHere&&near(archie,4.2))out.push({key:'archie',name:'Archie',npc:archie});}catch(e){}
  try{for(const n of friendNPCs)if(near(n,4.2))out.push({key:'friend',name:n.name||'Freund',npc:n});}catch(e){}
  return out;
}
function bagGift(id,idx){
  const it=BAGI[id],ts=bagTargets(),t=ts[idx];if(!it||!t||!it.gift)return;
  const g=it.gift[t.key];
  if(!g){say(t.name,'Danke, aber das brauche ich nicht.',2600);return;}
  if(!bagTake(id))return;
  if(g.m!==undefined)S.mood=clampN(S.mood+g.m,0,100);
  if(g.s!==undefined)S.social=clampN(S.social+g.s,0,100);
  const gain=[];if(g.m)gain.push('Haussegen '+(g.m>0?'+':'')+g.m);if(g.s)gain.push('Sozialkontakte +'+g.s);
  SND.win();banner('GESCHENK',it.ic+' '+it.n+' für '+t.name+(gain.length?' · '+gain.join(', '):''),(g.m<0)?'#ffb347':'#8ee26b');
  closeBag();setTimeout(()=>say(t.name,g.line,4600),500);
}
function bagUse(id){
  const it=BAGI[id];if(!it||!bagHas(id))return;
  if(it.auto){it.use();return;}
  closeBag();
  const r=it.use();
  if(r===true)bagTake(id);
}
function bagDrop(id){const it=BAGI[id];if(!bagTake(id))return;banner('WEGGEWORFEN',it.ic+' '+it.n,'#9aa0a8');bagRender();}
function bagNearStore(){try{for(const k in STORES){const s=STORES[k];if(Math.hypot(s.x-P.x,s.z-P.z)<9)return k;}}catch(e){}return null;}
function bagSell(id){
  const it=BAGI[id];if(!it||!bagNearStore()||!bagTake(id))return;
  const v=Math.round(it.v*om('sell'));S.money+=v;SND.click(760);banner('VERKAUFT',it.ic+' '+it.n+' · +$'+v,'#f5c542');bagRender();
}
/* ===== Oberfläche ===== */
function openBag(){
  if(S.mode!=='play')return;
  S.mode='bag';$('bag').hidden=false;bagRender();
}
function closeBag(){$('bag').hidden=true;if(S.mode==='bag')S.mode='play';}
function bagRender(){
  const ts=bagTargets(),near=bagNearStore();
  $('bagInfo').textContent='Taschen '+S.bag.length+'/'+BAG_SLOTS+' · Hände: '+($('item')?$('item').textContent:'')+(S.fxT>0?' · Effekt: noch '+Math.ceil(S.fxT)+' s':'')+(near?' · Laden in der Nähe: Verkaufen möglich':'')+(S.towerKey?' · 🗝 Turmschlüssel':'')+(ts.length?' · Gegenüber: '+ts.map(t=>t.name).join(', '):'');
  $('bagItems').innerHTML=S.bag.length?S.bag.map(s=>{
    const it=BAGI[s.id];
    const b=[];
    if(it.auto)b.push('<button type="button" data-bu="'+s.id+'">Info</button>');else b.push('<button type="button" data-bu="'+s.id+'">'+(it.cat==='Getränk'||s.id==='pralinen'?'Trinken/Essen':'Benutzen')+'</button>');
    if(it.gift)ts.forEach((t,i)=>b.push('<button type="button" data-bg="'+s.id+':'+i+'">An '+t.name+'</button>'));
    if(near)b.push('<button type="button" data-bs="'+s.id+'">Verkaufen ($'+it.v+')</button>');
    b.push('<button type="button" class="alt" data-bd="'+s.id+'">Wegwerfen</button>');
    return '<div class="card food"><h3>'+it.ic+' '+it.n+(s.q>1?' ×'+s.q:'')+'</h3><p><i>'+it.cat+'</i> · '+it.d+'</p><div class="bagbtn">'+b.join('')+'</div></div>';
  }).join(''):'<div class="card"><h3>Leer</h3><p>Noch nichts in den Taschen. Läden, Mülleimer und Belohnungen füllen sie.</p></div>';
  $('bagClothes').innerHTML=Object.keys(CLOTHES).filter(k=>S.wardrobe[k]).map(k=>{
    const c=CLOTHES[k],on=S.outfit===k;
    return '<div class="card'+(on?' own':'')+'"><h3>'+c.ic+' '+c.n+(on?' (an)':'')+'</h3><p>'+c.d+'</p><div class="ochips">'+bonusChips(c)+'</div><div class="bagbtn"><button type="button" data-bw="'+k+'">'+(on?'Ausziehen':'Anziehen')+'</button></div></div>';
  }).join('')||'<div class="card"><h3>Kleiderschrank leer</h3><p>Kleidung kannst du am Laptop bestellen.</p></div>';
}
$('bag').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.id==='bagClose'){closeBag();return;}
  if(b.dataset.bu){bagUse(b.dataset.bu);return;}
  if(b.dataset.bg){const [id,i]=b.dataset.bg.split(':');bagGift(id,+i);return;}
  if(b.dataset.bs){bagSell(b.dataset.bs);return;}
  if(b.dataset.bd){bagDrop(b.dataset.bd);return;}
  if(b.dataset.bw){wearOutfit(b.dataset.bw);return;}
});
/* Kleidung am Laptop kaufen */
function clothCards(){
  return Object.keys(CLOTHES).map(k=>{const c=CLOTHES[k],own=!!S.wardrobe[k],pr=shopPrice(c.price);
    return '<div class="card'+(own?' own':'')+'"><h3>'+c.ic+' '+c.n+'</h3><p>'+c.d+'</p><div class="ochips">'+bonusChips(c)+'</div><button type="button" data-cloth="'+k+'"'+(own||S.money<pr?' disabled':'')+'>'+(own?'Im Kleiderschrank':'Kaufen ($'+pr+')')+'</button></div>';}).join('');
}
function clothBuy(k){
  const c=CLOTHES[k];if(!c||S.wardrobe[k])return;const pr=shopPrice(c.price);if(S.money<pr)return;
  S.money-=pr;S.wardrobe[k]=1;SND.win();banner('GEKAUFT',c.ic+' '+c.n+' · im Kleiderschrank (Taste I)','#8ee26b');renderPhone();
}
/* Zeitgesteuerte Effekte */
function bagStep(dt){
  outfitHud();
  if(!S.wardGift){S.wardGift=1;Object.keys(CLOTHES).forEach(k=>{S.wardrobe[k]=1;});try{banner('TESTGESCHENK','Alle 5 Outfits im Kleiderschrank (Taste I)','#8ee26b');}catch(e){}}
  outfitVisual();
  if(S.fxT>0){S.fxT-=dt;if(S.fxT<=0){S.fxT=0;S.fxMul=1;}}
  outfitStep(dt);
}
/* Mülleimer: Gegenstände finden */
const BIN_ITEMS=['socke','ente','bowling','elvis','golf','zahn','tape','batt','kaffee','coupon','driver','smoothie'];
const BIN_RARE=['zahn','elvis','resti','kino','sport','blumen'];
function binItem(night){
  const pool=(night&&bagHas('torch')&&Math.random()<0.5)?BIN_RARE:BIN_ITEMS;
  const id=pick(pool),it=BAGI[id];
  if(bagAdd(id,1)){SND.ding();banner('FUNDSTÜCK',it.ic+' '+it.n+' · '+it.d.split('.')[0],'#f5c542');hLine('bin_money',2200);}
  else{SND.buzz();banner('TASCHE VOLL',it.ic+' '+it.n+' bleibt im Mülleimer','#ff7b7b');}
}
/* Läden: Gegenstände für die Taschen */
function addStoreItems(){
  const add=(k,list)=>{if(STORES[k])for(const x of list)STORES[k].items.push(x);};
  add('spaeti',[
   {id:'i_energy',n:'Mega-Energydrink (mitnehmen)',p:4,inv:'energy',d:'In die Tasche: Tempo ×1,3 für 90 s, wenn du ihn trinkst.'},
   {id:'i_kaffee',n:'Kaffee to go (mitnehmen)',p:3,inv:'kaffee',d:'In die Tasche: Tempo ×1,12 und Haussegen +2.'},
   {id:'i_bier',n:'Dosenbier (mitnehmen)',p:3,inv:'bier',d:'In die Tasche: gutes Geschenk für Archie und die Jungs.'},
   {id:'i_batt',n:'Ersatzbatterien',p:5,inv:'batt',d:'In die Tasche: rettet den Fernsehabend.'},
   {id:'i_tape',n:'Klebeband',p:4,inv:'tape',d:'In die Tasche: entschärft einen Streich.'},
   {id:'i_torch',n:'Taschenlampe',p:12,inv:'torch',d:'In die Tasche: nachts bessere Mülleimer-Funde.'},
   {id:'i_kino',n:'Kinokarten (2)',p:12,inv:'kino',d:'In die Tasche: Kinoabend mit Connie.'}]);
  add('baeckerei',[
   {id:'i_kaffee',n:'Kaffee to go (mitnehmen)',p:3,inv:'kaffee',d:'In die Tasche: Tempo ×1,12 und Haussegen +2.'},
   {id:'i_pralinen',n:'Pralinenschachtel',p:7,inv:'pralinen',d:'In die Tasche: Geschenk für Connie.'}]);
  add('markt',[
   {id:'i_blumen',n:'Blumenstrauß',p:8,inv:'blumen',d:'In die Tasche: Geschenk für Connie.'},
   {id:'i_smoothie',n:'Mysteriöser Smoothie',p:5,inv:'smoothie',d:'In die Tasche: Wirkung zufällig.'},
   {id:'i_milch',n:'Erdbeer-Milchshake',p:4,inv:'milch',d:'In die Tasche: Hunger +20 und Haussegen +4.'},
   {id:'i_driver',n:'Schraubenzieher',p:6,inv:'driver',d:'In die Tasche: entschärft einen Streich.'},
   {id:'i_resti',n:'Restaurantgutschein',p:12,inv:'resti',d:'In die Tasche: bis zu $20 Rabatt bei Boopers.'}]);
  add('boopers',[
   {id:'i_sport',n:'Football-Tickets',p:20,inv:'sport',d:'In die Tasche: Stadionbesuch, Sozialkontakte +30.'},
   {id:'i_biertogo',n:'Bier zum Mitnehmen',p:4,inv:'bier',d:'In die Tasche: gutes Geschenk.'}]);
}
addStoreItems();

/* ===== Sichtbare Kleidung: Teile am Skelett von Houg (Modellraum, Ruhepose) ===== */
const OV={groups:{},ready:false,cur:null};
function hougOutfitBuild(model){
  model.updateMatrixWorld(true);
  const inv=model.matrixWorld.clone().invert();
  const bone=n=>{const n2=n.replace(':','');let b=null;model.traverse(o=>{if(o.name===n||o.name===n2)b=o;});return b;};
  const rel=b=>inv.clone().multiply(b.matrixWorld);
  const pos=n=>{const b=bone(n);return b?new THREE.Vector3().setFromMatrixPosition(rel(b)):null;};
  const mat=(c,rough)=>new THREE.MeshStandardMaterial({color:c,roughness:rough===undefined?0.85:rough,metalness:0});
  const grp={};
  const G=id=>grp[id]||(grp[id]=new THREE.Group());
  // Teil an Knochen hängen: Pose (Position, Drehung, Skalierung) im Modellraum, Ruhepose
  function put(id,boneName,mesh,p,q,s){
    const b=bone(boneName);if(!b)return null;
    const M=new THREE.Matrix4().compose(p,q||new THREE.Quaternion(),s||new THREE.Vector3(1,1,1));
    mesh.matrixAutoUpdate=false;mesh.matrix.copy(rel(b).invert()).multiply(M);mesh.castShadow=false;mesh.receiveShadow=true;
    b.add(mesh);(G(id).userData.parts=G(id).userData.parts||[]).push(mesh);return mesh;
  }
  const V=(x,y,z)=>new THREE.Vector3(x,y,z);
  const eul=(x,y,z)=>new THREE.Quaternion().setFromEuler(new THREE.Euler(x,y,z));
  const shell=(id,boneName,y0,y1,rBot,rTop,zs,c,yc)=>{   // elliptischer Zylinder um den Rumpf
    const h=y1-y0,m=new THREE.Mesh(new THREE.CylinderGeometry(rTop,rBot,h,18,1,false),mat(c));
    return put(id,boneName,m,V(0,y0+h/2,yc||0),null,V(1,1,zs));
  };
  const box=(id,boneName,w,h,d,c,x,y,z,rx,ry,rz,rough)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c,rough));return put(id,boneName,m,V(x,y,z),eul(rx||0,ry||0,rz||0));};
  const ball=(id,boneName,r,c,x,y,z,sx,sy,sz)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(r,14,10),mat(c));return put(id,boneName,m,V(x,y,z),null,V(sx||1,sy||1,sz||1));};
  // Gliedmaße: Zylinder von A nach B, an Knochen boneName
  const limb=(id,boneName,A,B,rA,rB,c)=>{
    if(!A||!B)return;const d=B.clone().sub(A),len=d.length(),m=new THREE.Mesh(new THREE.CylinderGeometry(rB,rA,len,12,1,false),mat(c));
    const q=new THREE.Quaternion().setFromUnitVectors(V(0,1,0),d.clone().normalize());
    put(id,boneName,m,A.clone().add(B).multiplyScalar(0.5),q);
  };
  const J={};for(const n of ['LeftArm','LeftForeArm','LeftHand','RightArm','RightForeArm','RightHand','LeftUpLeg','LeftLeg','LeftFoot','LeftToeBase','RightUpLeg','RightLeg','RightFoot','RightToeBase','Head','Spine1'])J[n]=pos('mixamorig:'+n);
  const sleeves=(id,c,full,r1,r2)=>{
    for(const s of ['Left','Right']){
      limb(id,'mixamorig:'+s+'Arm',J[s+'Arm'],J[s+'ForeArm'],r1,(r1+r2)/2,c);
      if(full)limb(id,'mixamorig:'+s+'ForeArm',J[s+'ForeArm'],J[s+'Hand'].clone().lerp(J[s+'ForeArm'],0.15),(r1+r2)/2,r2,c);
    }};
  const pants=(id,c,r0,r1,r2,full)=>{
    for(const s of ['Left','Right']){
      limb(id,'mixamorig:'+s+'UpLeg',J[s+'UpLeg'].clone().add(V(0,0.04,0)),J[s+'Leg'],r0,r1,c);
      if(full)limb(id,'mixamorig:'+s+'Leg',J[s+'Leg'],J[s+'Foot'].clone().add(V(0,0.03,0)),r1,r2,c);
    }};
  // Schultern schließen (Joch + Kappen auf den Ärmeln) und Becken (Rücken unten) abdecken
  const closeUp=(id,c,rs,cp,pr)=>{
    const sy=(J.LeftArm?J.LeftArm.y:1.35);
    ball(id,'mixamorig:Spine1',1,c,0,sy-0.02,-0.005,0.31,0.07,0.22);
    for(const s of ['Left','Right']){const a=J[s+'Arm'];if(a)ball(id,'mixamorig:'+s+'Arm',rs,c,a.x,a.y,a.z);}
    shell(id,'mixamorig:Hips',0.60,0.92,0.25,0.265,0.78,cp||c);
  };
  // ---------- IPS-Uniform: braune Uniform, Cap, Paket-Abzeichen ----------
  {const id='ips',br=0x5a3a1c,dk=0x3e2813;
   shell(id,'mixamorig:Spine1',0.80,1.29,0.265,0.235,0.78,br);
   sleeves(id,br,true,0.072,0.056);closeUp(id,br,0.078,0x4a3220);
   pants(id,0x4a3220,0.120,0.092,0.074,true);
   box(id,'mixamorig:Spine1',0.14,0.10,0.02,0xf2c24a,0.09,1.12,0.245);         // Abzeichen
   box(id,'mixamorig:Spine1',0.52,0.035,0.50,dk,0,0.93,0);                       // Gürtel
   ball(id,'mixamorig:Head',0.172,dk,0.0,1.605,0.02,1,0.62,1.05);                // Cap
   box(id,'mixamorig:Head',0.24,0.025,0.14,dk,0.0,1.585,0.20,0.15,0,0);}         // Schirm
  // ---------- Football-Trikot: blau mit weißen Streifen und Nummer ----------
  {const id='trikot',bl=0x1d4fa3,wh=0xf4f4f4;
   shell(id,'mixamorig:Spine1',0.80,1.29,0.265,0.235,0.78,bl);
   shell(id,'mixamorig:Spine1',0.90,0.96,0.27,0.27,0.78,wh);
   shell(id,'mixamorig:Spine1',1.10,1.15,0.25,0.25,0.78,wh);
   sleeves(id,bl,true,0.072,0.056);closeUp(id,bl,0.078,0xf4f4f4);pants(id,0xf4f4f4,0.120,0.092,0.074,true);
   const cv=document.createElement('canvas');cv.width=cv.height=128;const cx=cv.getContext('2d');cx.fillStyle='#f4f4f4';cx.font='bold 100px Arial';cx.textAlign='center';cx.textBaseline='middle';cx.fillText('7',64,70);
   const nt=new THREE.CanvasTexture(cv),nm=new THREE.Mesh(new THREE.PlaneGeometry(0.22,0.22),new THREE.MeshBasicMaterial({map:nt,transparent:true}));
   put(id,'mixamorig:Spine1',nm,V(0,1.05,-0.255),eul(0,Math.PI,0));
   const nf=new THREE.Mesh(new THREE.PlaneGeometry(0.2,0.2),new THREE.MeshBasicMaterial({map:nt,transparent:true}));
   put(id,'mixamorig:Spine1',nf,V(0,1.03,0.27),eul(0,0,0));
   ball(id,'mixamorig:Head',0.15,0x1d4fa3,0,1.63,0.0,1,0.4,1.0);}                // Stirnband
  // ---------- Anzug: Sakko, Hose, Hemd, Krawatte ----------
  {const id='anzug',gr=0x2a2d36,wh=0xf3f3f1;
   shell(id,'mixamorig:Spine1',0.78,1.30,0.265,0.235,0.78,gr);
   sleeves(id,gr,true,0.072,0.056);closeUp(id,gr,0.078,0x24262e);
   pants(id,0x24262e,0.120,0.092,0.074,true);
   box(id,'mixamorig:Spine1',0.15,0.34,0.02,wh,0,1.13,0.248);                     // Hemd
   box(id,'mixamorig:Spine1',0.06,0.30,0.022,0xb3262e,0,1.10,0.262);              // Krawatte
   box(id,'mixamorig:Spine1',0.075,0.06,0.03,0xb3262e,0,1.27,0.262);               // Knoten
   box(id,'mixamorig:Spine1',0.06,0.36,0.015,gr,-0.10,1.12,0.255,0,0,0.18);        // Revers links
   box(id,'mixamorig:Spine1',0.06,0.36,0.015,gr,0.10,1.12,0.255,0,0,-0.18);        // Revers rechts
   for(const s of ['Left','Right'])box(id,'mixamorig:'+s+'Foot',0.20,0.09,0.38,0x15151a,J[s+'Foot'].x,0.05,0.06);}   // Schuhe
  // ---------- Bademantel: weißer Frottee, Gürtel, Kragen ----------
  {const id='bademantel',wh=0xf1efe8;
   shell(id,'mixamorig:Spine1',0.72,1.30,0.265,0.235,0.78,0xdfe6ee);
   sleeves(id,0xdfe6ee,true,0.072,0.056);closeUp(id,0xdfe6ee,0.078,0xdfe6ee,0.335);
   pants(id,0xdfe6ee,0.120,0.092,0.074,true);
   shell(id,'mixamorig:Spine1',0.90,0.97,0.275,0.275,0.78,0x8b6f4e);                // Gürtel
   box(id,'mixamorig:Spine1',0.09,0.06,0.03,0x8b6f4e,0.0,0.93,0.30);              // Gürtelknoten
   box(id,'mixamorig:Spine1',0.05,0.34,0.03,0x8b6f4e,-0.06,0.77,0.30,0,0,0.12);   // Gürtelenden
   box(id,'mixamorig:Spine1',0.05,0.34,0.03,0x8b6f4e,0.06,0.77,0.30,0,0,-0.12);
   {const col=new THREE.Mesh(new THREE.TorusGeometry(0.17,0.045,8,20),mat(0xc9d3de));put(id,'mixamorig:Spine1',col,V(0,1.31,0.0),eul(Math.PI/2,0,0),V(1.05,0.95,1));} // Schalkragen
   box(id,'mixamorig:Spine1',0.07,0.46,0.03,0xc9d3de,-0.08,1.07,0.255,0,0,-0.30);  // Kragen links
   box(id,'mixamorig:Spine1',0.07,0.46,0.03,0xc9d3de,0.08,1.07,0.255,0,0,0.30);    // Kragen rechts
   box(id,'mixamorig:Spine1',0.12,0.12,0.03,0xc9d3de,0.19,0.88,0.27);}              // Tasche

  // ---------- Hühnerkostüm: gelbes Gefieder, Kamm, Schnabel, Füße ----------
  {const id='kostuem',ye=0xf4cf3a,wh=0xfff2b0,rd=0xd8362e,or=0xf08a1f;
   shell(id,'mixamorig:Spine1',0.70,1.30,0.265,0.235,0.78,ye);
   sleeves(id,ye,true,0.072,0.056);closeUp(id,ye,0.078,0xf08a1f,0.33);
   pants(id,or,0.120,0.092,0.074,true);
   ball(id,'mixamorig:Spine1',0.14,wh,0,1.0,0.26,1,1.1,0.55);                      // Bauch
   for(const [x,y] of [[-0.10,0.82],[0,0.78],[0.10,0.82]])ball(id,'mixamorig:Spine1',0.09,ye,x,y,-0.29,1,1.3,0.7);   // Schwanz
   for(const [x,y,r] of [[-0.06,1.76,0.045],[0,1.79,0.055],[0.06,1.76,0.045]])ball(id,'mixamorig:Head',r,rd,x,y,0.03);   // Kamm
   const bk=new THREE.Mesh(new THREE.ConeGeometry(0.05,0.14,8),mat(or));put(id,'mixamorig:Head',bk,V(0,1.43,0.30),eul(Math.PI/2,0,0)); // Schnabel
   ball(id,'mixamorig:Head',0.03,rd,0,1.36,0.24);                                  // Kehllappen
   for(const s of ['Left','Right'])box(id,'mixamorig:'+s+'Foot',0.19,0.05,0.38,or,J[s+'Foot'].x,0.03,0.06);}   // Hühnerfüße
  for(const k in grp){grp[k].visible=false;}
  // Körper unsichtbar machen (nur Kopf, Hals, Hände, Füße bleiben): Dreiecke nach Hauptknochen filtern
  try{let sm=null;model.traverse(o=>{if(o.isSkinnedMesh&&!sm)sm=o;});
   if(sm&&sm.geometry&&sm.geometry.index&&sm.geometry.attributes.skinIndex){
    const g=sm.geometry,si=g.attributes.skinIndex,sw=g.attributes.skinWeight,bn=sm.skeleton.bones.map(b=>b.name);
    const keepV=new Uint8Array(si.count);
    for(let v=0;v<si.count;v++){let bi=si.getX(v),bw=sw.getX(v);
      for(const k of [1,2,3]){const w=[0,sw.getY(v),sw.getZ(v),sw.getW(v)][k],ix=[0,si.getY(v),si.getZ(v),si.getW(v)][k];if(w>bw){bw=w;bi=ix;}}
      keepV[v]=/Head|Neck|Hand|Foot|Toe/.test(bn[bi]||'')?1:0;}
    const ia=g.index.array,out=[];
    for(let i=0;i<ia.length;i+=3){if(keepV[ia[i]]||keepV[ia[i+1]]||keepV[ia[i+2]])out.push(ia[i],ia[i+1],ia[i+2]);}
    const Ctor=ia.constructor;
    OV.skin={g,full:g.index,part:new THREE.BufferAttribute(new Ctor(out),1)};
   }}catch(e){console.warn('outfit body',e);}
  OV.groups=grp;OV.ready=true;OV.cur=null;outfitVisual();
}
function outfitVisual(){
  if(!OV.ready)return;
  const want=S.outfit||null;if(OV.cur===want)return;
  for(const k in OV.groups)for(const m of (OV.groups[k].userData.parts||[]))m.visible=(k===want);
  if(OV.skin){try{OV.skin.g.setIndex(want?OV.skin.part:OV.skin.full);}catch(e){}}
  OV.cur=want;
}
