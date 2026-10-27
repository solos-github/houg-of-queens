/* ---------- Archie kommt öfter aus dem Keller: besucht verschiedene Orte im Haus und im Garten, beleidigt Houg, wenn Connie nicht da ist ---------- */
S.archVisitCd=40;S.archInsultCd=15;
const ARCH_SPOTS=[
  {n:'B',face:[-4.6,3.3],a:'talk'},{n:'E',face:[-2.6,5],a:'scratch'},{n:'G',face:[0.8,5],a:'breath'},{n:'KS',face:[8,3.3],a:'scratch'},
  {n:'F',face:[-12,0],a:'breath'},{n:'A',face:[-7.2,3],a:'talk'},{n:'W1',face:[-4.6,3.3],a:'scratch'},
  {n:'GS',face:[11,6],a:'breath'},{n:'GY',face:[23.5,6],a:'talk'},{n:'GT',face:[9.7,-1],a:'scratch'},{n:'GGc',face:[14,-3],a:'breath'}
];
const ARCH_INSULT=[
  'Na, du Faulpelz? Liegst du schon wieder herum, statt etwas Vernünftiges zu tun?',
  'Meine Tochter hätte einen besseren Mann verdient. Einen mit Arbeitsmoral.',
  'Du siehst aus wie ein Sack Kartoffeln, der Fernsehen gelernt hat.',
  'Dein Bauch kommt in jedes Zimmer eine Sekunde früher als du.',
  'Früher hatten wir Männer. Heute haben wir dich.',
  'Du hast das Gehirn eines Toasters, Houg. Und der ist wenigstens warm.',
  'Wenn Dummheit wehtäte, würdest du den ganzen Tag schreien.',
  'Ich habe in meinem Keller schon interessantere Spinnen kennengelernt als dich.',
  'Hast du wieder was gegessen? Ach, wann hättest du je nichts gegessen.',
  'Wenn Connie nicht hinschaut, bist du noch zwei Stufen tiefer, ist dir das klar?',
  'Ein Mann ohne Plan, ohne Job und ohne Frisur. Beeindruckend.',
  'Du bist der Grund, warum der Keller so gemütlich ist. Da bin ich wenigstens weg von dir.'
];
function archieVisit(){
  const spots=ARCH_SPOTS.slice().sort(()=>Math.random()-0.5).slice(0,2+(Math.random()<0.4?1:0)),plan=[];
  for(const s of spots){
    plan.push({go:s.n},{fn:()=>{faceTo(archie,s.face[0],s.face[1]);if(archie.mesh.userData.acts&&archie.mesh.userData.acts[s.a])playOnce(archie.mesh,s.a,3);}},{wait:rand(7,16)});
  }
  plan.push({go:'KI'});
  archie.plan=plan;
}
function archieStep(dt){
  if(archie)archBbqStep(dt);
  if(!archie||!S.archieHere||S.mode!=='play'||S.scene||S.prank||!atHome())return;
  S.archInsultCd-=dt;
  const idle=!archie.path.length&&!archie.plan.length&&archie.wait<=0,inCellar=archie.y<-1;
  if(inCellar&&idle){
    S.archVisitCd-=dt*(connie.away?2.5:1);
    if(S.archVisitCd<=0){S.archVisitCd=connie.away?rand(30,55):rand(70,120);archieVisit();}
  }
  const alone=connie.away||connie.sitting===false&&Math.hypot(connie.x-archie.x,connie.z-archie.z)>9;
  if(!inCellar&&alone&&S.archInsultCd<=0&&Math.abs(P.y-archie.y)<1.5&&Math.hypot(P.x-archie.x,P.z-archie.z)<4.5){
    S.archInsultCd=rand(40,70);faceTo(archie,P.x,P.z);
    const i=Math.floor(Math.random()*ARCH_INSULT.length),t=ARCH_INSULT[i];
    if(Math.random()<0.3)vline('archie_insult_'+(i+1),'archie',t,4600,'Archie');else say('Archie',t,4600);
    setTimeout(()=>{if(S.mode==='play')say('Houg',pick(['Danke, Archie. Wirklich.','Der Keller steht noch leer, falls du zurück möchtest.','Ich überhöre das einfach.']),2800);},4800);
  }
}

/* ---------- Archie beim Barbecue: mit 50 % Wahrscheinlichkeit dabei und stichelt gegen die Jungs ---------- */
S.bbqArchie=false;S.bbqTeaseT=12;
const BBQ_TEASE={
  Spike:['Spike, wohnst du eigentlich immer noch bei deiner Mutter? Oder bist du nur im Weg?','Spike, deine Mutter hat angerufen. Du sollst nach Hause, dein Zimmer aufräumen.','Das Würstchen hat mehr Charakter als du, Spike. Und es wohnt nicht mal zu Hause.'],
  Dean:['Dean, du grillst, als würdest du eine Kündigung ausstellen: ohne Gefühl und viel zu spät.','Dean, als ich so alt war, hatte ich ein Haus, ein Auto und Haare. Du hast zwei von drei, glaube ich.'],
  Benny:['Benny, hör auf zu essen, sonst reicht die Wurst für niemanden mehr.','Benny, bei deinem Humor wäre ich auch lieber still.']
};
const BBQ_REPLY={Spike:['Ich helfe meiner Mum nur aus, Archie!','Das ist eine Lüge! Meistens.'],Dean:['Er redet wieder, Houg.','Archie, iss was, dann bist du still.'],Benny:['Haha, sehr lustig, Archie.','Ich esse nur für die Gesellschaft.']};
function archBbqJoin(){
  S.bbqArchie=false;
  if(!archie||!S.archieHere||S.chapter<2||Math.random()>=0.5)return;
  S.bbqArchie=true;S.bbqTeaseT=10;
  archie.path=[];archie.wait=0;
  archie.plan=[{go:'GGc'},{fn:()=>faceTo(archie,13.6,-1.2)},{wait:9999}];
  setTimeout(()=>{if(S.bbq&&S.bbqArchie)say('Archie',pick(['Grillen? Dann komme ich mit. Irgendwer muss ja aufpassen, dass ihr nicht alles anbrennen lasst.','Ich rieche Würstchen. Ich bin dabei.']),3800);},3500);
}
function archBbqStep(dt){
  if(S.bbqArchie&&!S.bbq&&!S.friends){     // Barbecue vorbei: zurück in den Keller
    S.bbqArchie=false;archie.plan=[{go:'KI'}];archie.wait=0;return;
  }
  if(!S.bbqArchie||!S.bbq||!archie||S.scene||S.mode!=='play')return;
  S.bbqTeaseT-=dt;if(S.bbqTeaseT>0)return;
  S.bbqTeaseT=rand(16,26);
  const fr=friendNPCs.filter(n=>BBQ_TEASE[n.name]);if(!fr.length)return;
  const f=pick(fr),L=BBQ_TEASE[f.name],i=Math.floor(Math.random()*L.length);
  faceTo(archie,f.x,f.z);
  if(Math.random()<0.3)vline('archie_bbq_'+f.name.toLowerCase()+'_'+(i+1),'archie',L[i],4800,'Archie');else say('Archie',L[i],4800);
  if(Math.random()<0.6)setTimeout(()=>{if(S.bbq)say(f.name,pick(BBQ_REPLY[f.name]),2800);},5000);
}
