/* ---------- Bedürfnisse: Harndrang, Hygiene, Sozialkontakte · Bad & Toilette ---------- */
S.urge=20;S.hygiene=80;S.social=60;
let urgeArmed=true,urgeCd=0;
function needsStep(dt){
  S.urge=Math.min(100,S.urge+0.28*dt*om('urge'));
  S.hygiene=Math.max(0,S.hygiene-0.1*dt*om('hyg'));
  S.social=Math.max(0,S.social-0.08*dt*om('soc'));
  if(S.hygiene<20)S.mood=Math.max(0,S.mood-0.05*dt);
  if(S.social<15)S.mood=Math.max(0,S.mood-0.05*dt);
  urgeCd-=dt;
  if(S.urge<50)urgeArmed=true;
  if(S.urge>78&&urgeArmed&&urgeCd<=0&&S.mode==='play'){
    urgeArmed=false;urgeCd=40;
    voiceSay(pick(['houg_urge_1','houg_urge_2']),'houg','');
  }
  if(S.urge>=100&&S.mode==='play'){   // Malheur
    S.urge=15;S.hygiene=Math.max(0,S.hygiene-35);S.mood=Math.max(0,S.mood-10);
    SND.buzz();banner('MALHEUR','Harndrang zu spät bemerkt · Hygiene −35 · Haussegen −10','#ff7b7b');
    voiceSay('houg_accident','houg','Oh nein … das Sofa!');
  }
}
function needsHUD(){
  $('bU').style.width=clamp(S.urge,0,100)+'%';
  $('bY').style.width=clamp(S.hygiene,0,100)+'%';
  $('bS').style.width=clamp(S.social,0,100)+'%';
}
/* Toilette und Badewanne im Obergeschoss */
STATIC_INTER.push(
 {id:'toilet',x:5.0,z:-4.3,r:1.3,fl:1,prio:3,blip:'#58b4ff',
  label:()=>S.urge>40?'Toilette benutzen (E halten)':'Toilette (noch kein Harndrang)',
  hold:()=>S.urge>40?2.5:0,
  use:()=>{sfxPlay('toilet');S.urge=0;S.hygiene=Math.max(0,S.hygiene-2);SND.click(300);banner('ERLEICHTERUNG','Harndrang 0','#58b4ff');hLine('toilet');}},
 {id:'bath',x:7.6,z:-4.4,r:1.5,fl:1,prio:3,blip:'#7ec8e3',
  label:()=>S.hygiene<95?'Baden (E halten)':'Baden (du bist sauber)',
  hold:()=>S.hygiene<95?4:0,
  use:()=>{sfxPlay('shower');S.hygiene=100;S.mood=Math.min(100,S.mood+6);S.hunger=Math.max(0,S.hunger-4);SND.win();playOnce(player,'cheer',1.8);banner('FRISCH GEBADET','Hygiene 100 · Haussegen +6','#7ec8e3');hLine('bath',2600);}}
);
