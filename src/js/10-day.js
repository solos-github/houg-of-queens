/* ---------- Tagesablauf: Wochentage, Connies Arbeitszeit, Tagesbewertung und Buffs ---------- */
const DAYS=['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'];
const weekdayIdx=()=>(S.day-1)%7;
const isWorkday=()=>weekdayIdx()<5;

const BUFFS={
  satt:{n:'Satt & zufrieden',d:'Der Hunger sinkt 40 % langsamer.'},
  cash:{n:'Fleißiger Tag',d:'Aufgaben von Connie bringen 50 % mehr Geld.'},
  tempo:{n:'Ausgeschlafen',d:'Houg läuft 15 % schneller.'},
  tvglueck:{n:'Fernsehglück',d:'Fernsehabend bringt 50 % mehr Sozialkontakte, keine Wartezeit auf die Fernbedienung.'},
  zeit:{n:'Zeitpuffer',d:'Connie kommt eine Stunde später nach Hause.'},
  spar:{n:'Sparfuchs',d:'Pizza und Online-Shop sind 20 % billiger.'},
  glueck:{n:'Glückspilz',d:'Archies Streiche kommen seltener und du hast mehr Zeit, sie zu entschärfen.'},
  dicke:{n:'Dicke Luft',d:'Der Hunger sinkt 40 % schneller und Aufgaben bringen 25 % weniger Geld.',bad:true}
};
const GOOD=['satt','cash','tempo','tvglueck','zeit','spar','glueck'];
const buffOn=id=>S.buffs.includes(id);
function buffMult(k){
  if(k==='taskmoney')return (buffOn('cash')?1.5:1)*(buffOn('dicke')?0.75:1)*om('cash');
  if(k==='tvmoney')return buffOn('tvglueck')?1.5:1;
  return 1;
}
const hungerMult=()=>(S.fullT>0?0.65:1)*(buffOn('satt')?0.6:1)*(buffOn('dicke')?1.4:1)*om('hung');
const speedMult=()=>om('spd')*(buffOn('tempo')?1.15:1)*(S.fxT>0?S.fxMul:1);
const shopPrice=p=>Math.round(p*(buffOn('spar')?0.8:1)*om('price'));
const pizzaPrice=()=>buffOn('spar')?10:12;

/* Zeitplan: Aufgaben verteilen, Connie weg und zurück */
function schedule(){
  const work=isWorkday();
  if(S.chapter>=3&&work&&!S.workHome){workSchedule();return;}
  const tAssign=work?7*60:9*60;
  S.tBack=(work?15*60:17*60)+(buffOn('zeit')?60:0);
  if(!S.assigned&&S.minutes>=tAssign){S.assigned=true;issueTasks(work);if(work)setTimeout(()=>{if(S.mode!=='start')connieLeave();},9000);}
  if(S.assigned&&!S.evaluated&&S.minutes>=S.tBack){S.evaluated=true;evaluateTasks(work);}
}

/* Tagesbewertung */
function rate(m){return m>=85?{k:'Himmlisch',n:3}:(m>=65?{k:'Harmonisch',n:2}:(m>=40?{k:'Geht so',n:1}:{k:'Dicke Luft',n:0}));}
let nextBuffs=[];
function startDayCard(bed){
  S.mode='daycard';
  const r=rate(S.mood);
  const pool=GOOD.slice().sort(()=>Math.random()-0.5);
  nextBuffs=r.n>0?pool.slice(0,r.n):['dicke'];
  $('dcT').textContent=DAYS[weekdayIdx()]+' · Tag '+S.day+' vorbei';
  $('dcR').textContent='Haussegen '+Math.round(S.mood)+' % – '+r.k;
  $('dcB').innerHTML=nextBuffs.map(id=>'<div class="card'+(BUFFS[id].bad?' food':'')+'"><h3>'+BUFFS[id].n+'</h3><p>'+BUFFS[id].d+'</p></div>').join('');
  $('dcS').textContent=bed?'Du hast im Bett geschlafen: Gesundheit +25.':'Du bist am Küchentisch eingenickt: Gesundheit nur +5.';
  S._bed=bed;
  $('daycard').hidden=false;
}
function startNextDay(){
  $('daycard').hidden=true;
  const bed=S._bed;
  S.day++;S.minutes=6*60;S.urge=20;S.hygiene=Math.max(S.hygiene-10,30);S.social=Math.max(S.social-10,20);S.bbq=false;S.ring=null;S.bonusCnt=0;S.bonusDone={};S.bonusT=40;S.hunger=Math.max(S.hunger-10,25);S.health=Math.min(100,S.health+(bed?25:5));
  S.mood=50+(S.mood-50)*0.5+(bed?5:0);S.mood=clamp(S.mood,0,100);
  S.buffs=nextBuffs.slice();
  S.assigned=false;S.evaluated=false;S.todo=[];S.task=null;S.prank&&prankEnd(false);
  workNewDay();dateNewDay();dinnerNewDay();tqNewDay();
  setCarry(null);clearStepProp();marker.visible=false;
  connieUnsit();connie.away=false;connie.mesh.visible=true;connie.plan=[];connie.path=[];
  const p=NODES.K2;connie.node='K2';connie.x=p[0];connie.z=p[1];connie.y=p[2];
  P.x=-5.0;P.z=3.4;P.y=2.9;P.vx=P.vz=0;
  S.mode='play';
  banner(DAYS[weekdayIdx()].toUpperCase(),'Tag '+S.day+' · '+S.buffs.map(b=>BUFFS[b].n).join(', '),BUFFS[S.buffs[0]].bad?'#ff7b7b':'#8ee26b');
  try{autoSave();}catch(e){}
  if(S.chapter>=3&&isWorkday())workMorning();
  else say('Connie',isWorkday()?'Guten Morgen! Ich muss gleich los, aber vorher sage ich dir noch, was heute ansteht.':'Guten Morgen, Schatz. Heute ist Wochenende, aber …',4200);
}
$('dcGo').addEventListener('click',startNextDay);

/* Intro */
$('introGo').addEventListener('click',()=>{
  introStop();
  $('intro').hidden=true;$('hud').hidden=false;S.mode='play';canvas.focus();
  say('Connie','Guten Morgen, Houg! Ich muss um sieben los, aber vorher sage ich dir noch, was heute ansteht.',5200);
});
