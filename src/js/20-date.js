/* ---------- Essen gehen mit Connie: alle zwei Wochen sonntags (Tag 7, 21, 35 …), Treffpunkt Boopers ---------- */
const DATE_T={x:57.6,z:23.4};
NODES.BPC=[DATE_T.x+1.0,DATE_T.z,0];
S.date={st:'none'};
const DATE_LINES=['Endlich nehmen wir uns mal Zeit füreinander.','Bestell, was du willst, Schatz. Aber nicht das ganze Menü.','Und bitte kein Wort über YPS oder Archie.','Der Burger hier soll ja gut sein.'];
const dateConnie=(()=>{
  const n=makeNPC('Connie',LOOKS.connie,'BPC',{blip:'#ff7eb3',talk:()=>S.date.st==='there'?'Setz dich zu mir, Houg! (E am Tisch: gemeinsam essen)':pick(DATE_LINES)});
  attachModel(n.mesh,typeof CONNIE_B64==='string'?CONNIE_B64:'',{height:1.7});
  n.mesh.rotation.y=Math.atan2(DATE_T.x-n.x,DATE_T.z-n.z);n.away=true;return n;
})();
{ // Tisch mit zwei Stühlen und Kerze
  cylS(W,0.7,0.7,0.07,18,0xf2ece0,DATE_T.x,0.74,DATE_T.z);cylS(W,0.08,0.18,0.74,10,0x3a2a22,DATE_T.x,0,DATE_T.z);
  cylS(W,0.05,0.05,0.18,8,0xf6e7b0,DATE_T.x,0.81,DATE_T.z);sph(W,0.05,0xffb347,DATE_T.x,1.02,DATE_T.z,1,1.4,1);
  for(const sx of [-1,1]){box(W,0.5,0.06,0.5,0x7a2a2a,DATE_T.x+sx*1.0,0.46,DATE_T.z);box(W,0.06,0.5,0.5,0x7a2a2a,DATE_T.x+sx*1.22,0.46,DATE_T.z,false);}
  block(DATE_T.x-0.8,DATE_T.z-0.8,DATE_T.x+0.8,DATE_T.z+0.8);
}
const isDateDay=()=>weekdayIdx()===6&&(S.day-7)%14===0;
function connieSend(){      // Connie geht zum Restaurant
  connieUnsit();
  connie.path=[];connie.plan=[{go:'Fo'},{fn:()=>{connie.away=true;connie.mesh.visible=false;}}];
}
function connieHomeAgain(){
  const p=NODES.Fo;connie.node='Fo';connie.x=p[0];connie.z=p[1];connie.y=p[2];connie.away=false;connie.mesh.visible=true;connie.path=[];connie.plan=[{go:'K2'}];connie.wait=0;
}
function dateNewDay(){
  if(S.date&&(S.date.st==='wait'||S.date.st==='there'))dateMiss(true);
  S.date={st:'none'};
  if(!isDateDay())return;
  S.date.st='ask';
  setTimeout(()=>{
    if(S.mode!=='play'||S.date.st!=='ask')return;
    S.date.st='wait';
    sayQueue([['Connie','Houg, heute ist Sonntag. Wir gehen heute Abend essen, ins Boopers. Um sechs, du hast es versprochen!',5200],['Houg','Habe ich das?',2200]]);
    banner('VERABREDUNG','Um 18:00 Uhr: Essen mit Connie im Boopers','#ff7eb3');
  },7000);
}
function dateMiss(late){
  S.date.st='missed';
  S.mood=Math.max(0,S.mood-18);S.social=Math.max(0,S.social-8);
  connieHomeAgain();
  dateConnie.away=true;
  if(!late){banner('VERSETZT','Connie wartet nicht mehr. Haussegen hängt schief.','#ff7b7b');sayQueue([['Connie','Ich habe zwei Stunden allein im Boopers gesessen, Houg!',4200]]);}
  else setTimeout(()=>say('Connie','Du hast mich gestern im Boopers sitzen lassen. Das vergesse ich nicht!',5200),9000);
}
function dateStep(dt){
  const d=S.date;if(!d)return;
  if(d.st==='wait'){
    if(S.minutes>=17*60+30&&!connie.away&&!connie.plan.length&&!d.sent){d.sent=true;say('Connie','Ich gehe schon mal vor. Bis gleich im Boopers!',4000);connieSend();}
    if(S.minutes>=18*60){d.st='there';dateConnie.away=false;banner('VERABREDUNG','Connie wartet im Boopers am Tisch','#ff7eb3');}
  }
  if(d.st==='there'&&S.minutes>=21*60+30)dateMiss(false);
  if(d.st==='there'||d.st==='wait'){/* Connie sichtbar nur am Tisch */}
  dateConnie.away=d.st!=='there';
}
function dateTarget(){
  const d=S.date;if(!d||(d.st!=='wait'&&d.st!=='there'))return null;
  return {x:DATE_T.x,z:DATE_T.z,fl:0,label:d.st==='wait'?'Boopers: Tisch bei Connie (ab 18:00)':'Mit Connie essen'};
}
function dateQuestHTML(){
  const d=S.date;if(!d||(d.st!=='wait'&&d.st!=='there'))return '';
  return '<div class="qh"><em>VERABREDUNG</em> · Essen mit Connie</div><div class="qs cur"><span>➤</span><span>'+(d.st==='wait'?'Um 18:00 Uhr im Boopers sein':'Zum Tisch bei Connie im Boopers')+'</span></div><div class="qd">Connie wartet bis 21:30 Uhr</div>';
}
function dateEat(){
  const d=S.date;
  if(d.st!=='there'){say('Houg','Da sitzt niemand. Noch nicht.',2200);return;}
  const cost=30,pay=S.money>=cost;
  if(pay)S.money-=cost;
  d.st='done';SND.eat();playDrink(player,2.4);
  S.hunger=Math.min(100,S.hunger+70);S.social=Math.min(100,S.social+35);S.mood=Math.min(100,S.mood+(pay?25:12));S.urge=Math.min(100,S.urge+10);
  banner('ESSEN MIT CONNIE',pay?'Gezahlt: $'+cost+' · Sozialkontakte +35, Haussegen +25':'Connie lädt dich ein · Haussegen +12','#ff7eb3');
  sayQueue([['Connie','Siehst du, Houg? Das ist Romantik.',3400],['Houg',pay?'Das war teuer, aber es war gut.':'Danke für die Einladung, Schatz.',3200],['Connie','Ich fahre schon mal nach Hause. Komm nicht zu spät!',3600]]);
  setTimeout(()=>{dateConnie.away=true;connieHomeAgain();},9000);
}
STATIC_INTER.push({id:'date',x:DATE_T.x,z:DATE_T.z,r:2.2,prio:3.6,blip:'#ff7eb3',
  label:()=>S.date.st==='there'?'Mit Connie essen ($30) (E)':null,use:dateEat});
