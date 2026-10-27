/* ---------- Stimmen (Platzhalter per Sprachausgabe) und Hintergrundmusik ---------- */
/* Eigene Sprachaufnahmen: unten bei VOICE_CLIPS einen Eintrag ergänzen, z. B. connie_ciao:'data:audio/mp3;base64,…' oder eine Datei-URL. */
/* Sprachaufnahmen: Lege MP3-Dateien mit genau diesen Namen in den Ordner  audio/voice/  neben index.html.
   Fehlt eine Datei, spricht stattdessen die Sprachausgabe (TTS) bzw. ein Platzhalterklang. */
const VOICE_DIR='audio/voice/';
const VOICE_LINES={
  connie_ciao:{who:'connie',text:'Ciao, Schatz! Bis um drei!'},
  connie_back:{who:'connie',text:'Ich bin wieder da!'},
  houg_hunger_1:{who:'houg',text:'Ich hab Hunger!'},
  houg_hunger_2:{who:'houg',text:'Mein Magen knurrt. Ich brauch ein Sandwich!'},
  houg_hunger_3:{who:'houg',text:'Hunger! Jetzt sofort!'},
  houg_urge_1:{who:'houg',text:'Ich muss mal dringend!'},
  houg_urge_2:{who:'houg',text:'Wo ist das Klo? Schnell!'},
  houg_accident:{who:'houg',text:'Oh nein … das Sofa!'}
};
/* Wird ein NPC angesprochen, läuft  <name>_hey.mp3  (connie_hey, archie_hey, dean_hey, spike_hey, benny_hey). Fehlt sie, bleibt es still (keine Sprachausgabe). */
function clipDebug(key,a,why){
  const u=a&&a.src?a.src:VOICE_DIR+key+'.mp3',code=a&&a.error?a.error.code:'-';
  try{console.warn('MP3 nicht abspielbar',key,u,why,'MediaError',code);}catch(e){}
  banner('MP3 NICHT ABSPIELBAR',key+'.mp3 · '+(why||'?')+' · Code '+code+' · '+u.slice(-60),'#ff7b7b');
}
/* Nur MP3, nie Sprachausgabe: liefert das Audio-Element oder null (Datei fehlt / nicht abspielbar) */
function clipOnly(key){
  if(voiceMuted||clipState[key]==='missing')return null;
  let a=null;
  try{
    a=new Audio(VOICE_DIR+key+'.mp3');a.volume=0.9;a.preload='auto';
    a.addEventListener('error',()=>{clipState[key]='missing';clipDebug(key,a,'error');},{once:true});
    const pr=a.play();if(pr&&pr.catch)pr.catch(e=>{if(!e||e.name!=='NotAllowedError'){clipState[key]='missing';clipDebug(key,a,e&&e.name);}});
  }catch(e){clipState[key]='missing';clipDebug(key,a,String(e));return null;}
  return a;
}
function npcHey(name){clipOnly(name+'_hey');}
const clipState={};        // key -> 'ok' / 'missing'
const VOICE_CLIPS={};      // optional: Eintrag key:'data:audio/mp3;base64,…' überschreibt die Datei
const VOICES={connie:{pitch:1.45,rate:1.05},houg:{pitch:0.65,rate:0.92},archie:{pitch:0.5,rate:0.85},dean:{pitch:0.85,rate:1.0},spike:{pitch:0.75,rate:1.1},benny:{pitch:1.0,rate:0.95}};
function voiceTones(key){   // Platzhalterklang, falls keine Sprachausgabe da ist
  if(key==='connie_ciao'){tone(880,.14,'triangle',.07);tone(660,.14,'triangle',.07,0,.16);tone(990,.25,'triangle',.07,0,.34);}
  else if(key==='connie_back'){tone(660,.14,'triangle',.07);tone(880,.2,'triangle',.07,0,.16);}
  else if(key.indexOf('houg_hunger')===0){tone(140,.35,'sawtooth',.07,70);tone(110,.4,'sawtooth',.07,60,.4);}
  else{tone(200,.25,'sawtooth',.06,90);}
}
const TTS_ON=false;      // Sprachsynthese komplett aus: nur mp3-Dateien (audio/voice/) werden gesprochen, sonst bleibt es beim Untertitel
function voiceTTS(key,who,text){
  if(!TTS_ON)return;
  try{
    const ss=window.speechSynthesis;
    if(!ss||typeof SpeechSynthesisUtterance==='undefined'){voiceTones(key);return;}
    const vs=ss.getVoices(),de=vs.find(v=>/^de/i.test(v.lang));
    if(vs.length&&!de){voiceTones(key);return;}
    const u=new SpeechSynthesisUtterance(text),p=VOICES[who];
    u.lang='de-DE';if(de)u.voice=de;u.pitch=p.pitch;u.rate=p.rate;u.volume=1;
    ss.speak(u);
  }catch(e){voiceTones(key);}
}
function voiceSay(key,who,text,subtitle=true){
  if(VOICE_LINES[key]){who=VOICE_LINES[key].who;text=VOICE_LINES[key].text;}
  if(subtitle)say(who==='connie'?'Connie':'Houg',text,3200);
  if(voiceMuted)return;
  const fallback=()=>voiceTTS(key,who,text);
  if(clipState[key]==='missing'){fallback();return;}
  let done=false,a0=null;const url=VOICE_CLIPS[key]||(VOICE_DIR+key+'.mp3');
  const fail=(why)=>{if(done)return;done=true;clipState[key]='missing';clipDebug(key,a0,why);fallback();};
  try{
    const a=new Audio(url);a0=a;a.volume=0.9;a.preload='auto';
    a.addEventListener('error',()=>fail('error'),{once:true});
    const pr=a.play();
    if(pr&&pr.then)pr.then(()=>{clipState[key]='ok';done=true;}).catch(e=>{if(e&&e.name==='NotAllowedError'){done=true;return;}fail(e&&e.name);});
  }catch(e){fail(String(e));}
}
let voiceMuted=false,hungerCd=0,hungerArmed=true;
function hungerVoice(dt){
  hungerCd-=dt;
  if(S.hunger>45)hungerArmed=true;
  if(S.hunger<30&&hungerArmed&&hungerCd<=0&&S.mode==='play'){
    hungerArmed=false;hungerCd=45;
    voiceSay(pick(['houg_hunger_1','houg_hunger_2','houg_hunger_3']),'houg','');
  }
}

/* ----- Hintergrundmusik: drei selbst komponierte Schleifen, umschaltbar am Garagenradio ----- */
let musicGain=null,musicOn=false,musicTimer=0,mStep=0,mNext=0,songIdx=0;
const mf=m=>440*Math.pow(2,(m-69)/12);
const SONGS=[
 {name:'Sonntagsbraten',bpm:108,swing:0.12,melType:'triangle',melV:0.05,stabType:'square',stabV:0.012,stab:[2,6],
  chords:[[48,[60,64,67]],[45,[57,60,64]],[41,[57,60,65]],[43,[59,62,67]],[48,[60,64,67]],[41,[57,60,65]],[43,[59,62,67]],[48,[60,64,67]]],
  mel:[[[0,76,2],[2,79,1],[3,76,1],[4,74,2],[6,72,2]],[[0,72,2],[2,76,2],[4,81,3],[7,79,1]],[[0,81,2],[2,79,1],[3,77,1],[4,76,2],[6,74,2]],[[0,74,2],[2,67,2],[4,71,2],[6,74,2]],
       [[0,76,2],[2,79,2],[4,84,3],[7,83,1]],[[0,81,2],[2,77,2],[4,72,2],[6,77,2]],[[0,79,2],[2,77,1],[3,76,1],[4,74,2],[6,71,2]],[[0,72,4],[4,67,2],[6,76,2]]]},
 {name:'Grillabend-Blues',bpm:100,swing:0.3,melType:'sawtooth',melV:0.022,stabType:'triangle',stabV:0.03,stab:[2,6],
  chords:[[45,[57,61,64]],[50,[57,62,66]],[45,[57,61,64]],[45,[57,61,64]],[50,[57,62,66]],[50,[57,62,66]],[45,[57,61,64]],[52,[56,59,62]]],
  mel:[[[0,69,2],[2,72,1],[3,74,1],[4,75,2],[6,76,2]],[[0,74,2],[2,72,2],[4,69,3],[7,67,1]],[[0,69,1],[1,72,1],[2,76,2],[4,79,2],[6,76,2]],[[0,75,2],[2,74,2],[4,72,2],[6,69,2]],
       [[0,74,2],[2,77,2],[4,81,2],[6,79,2]],[[0,77,2],[2,76,1],[3,74,1],[4,72,4]],[[0,69,2],[2,76,2],[4,75,2],[6,74,2]],[[0,72,2],[2,71,2],[4,69,4]]]},
 {name:'Fernsehabend',bpm:76,swing:0.0,melType:'sine',melV:0.07,stabType:'sine',stabV:0.02,stab:[0,4],
  chords:[[41,[57,60,65]],[38,[57,62,65]],[46,[58,62,65]],[48,[55,60,64]],[41,[57,60,65]],[38,[57,62,65]],[46,[58,62,65]],[48,[55,60,64]]],
  mel:[[[0,72,4],[4,69,2],[6,65,2]],[[0,69,4],[4,74,3],[7,72,1]],[[0,70,4],[4,74,2],[6,77,2]],[[0,76,6],[6,72,2]],
       [[0,77,2],[2,76,2],[4,72,4]],[[0,74,4],[4,69,2],[6,72,2]],[[0,74,2],[2,72,2],[4,70,4]],[[0,72,6],[6,65,2]]]}
];
function mNote(m,t,len,type,v){
  if(!AC||!musicGain)return;
  try{
    const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=mf(m);
    g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v,t+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+len);
    o.connect(g);g.connect(musicGain);o.start(t);o.stop(t+len+0.05);
  }catch(e){}
}
function mSchedule(){
  if(!AC||!musicGain)return;
  const sg=SONGS[songIdx],E8=60/sg.bpm/2;
  while(mNext<AC.currentTime+0.35){
    const bar=Math.floor(mStep/8)%8,s=mStep%8,[root,tri]=sg.chords[bar],t=mNext+((s%2)?E8*sg.swing:0);
    if(s===0)mNote(root,t,E8*3.6,'triangle',0.09);
    if(s===4)mNote(root+7,t,E8*3.2,'triangle',0.07);
    if(sg.stab.includes(s))for(const n of tri)mNote(n,t,E8*(sg.stabType==='sine'?3.5:1.1),sg.stabType,sg.stabV);
    for(const [st,n,l] of sg.mel[bar])if(st===s)mNote(n,t,E8*l*0.95,sg.melType,sg.melV);
    mNext+=E8;mStep++;
  }
}
function startMusic(){
  if(!AC||musicGain)return;
  musicGain=AC.createGain();musicGain.gain.value=0.45;musicGain.connect(AC.destination);
  mNext=AC.currentTime+0.1;mStep=0;
  musicTimer=setInterval(mSchedule,120);
}
function musicLevel(){
  if(!musicGain)return;
  const still=(S.mode==='tv'||!!S.scene),quiet=(S.mode==='dish');      // am Fernseher: Musik aus
  if(RADIO.a&&RADIO.on)try{RADIO.a.volume=still?0:(quiet?0.2:0.6);}catch(e){}
  const target=(musicOn&&!RADIO.on&&!still)?(quiet?0.18:0.45):0;
  musicGain.gain.setTargetAtTime(target,AC.currentTime,0.25);
}
function toggleMusic(){
  if(RADIO.on){radioFileOff();musicOn=false;}else musicOn=!musicOn;
  banner('MUSIK',musicOn?'AN':'AUS (M zum Einschalten)','#8ee26b');
}
/* Radio in der Garage: Sender durchschalten, am Ende aus */
const RADIO={a:null,on:false,dead:false};
const radioName=()=>RADIO.on?'Intro (intro.mp3)':(musicOn?SONGS[songIdx].name:'aus');
function radioFileOff(){RADIO.on=false;try{if(RADIO.a)RADIO.a.pause();}catch(e){}}
const RADIO_SRC=['audio/intro.mp3','audio/voice/intro.mp3','intro.mp3','audio/Intro.mp3'];
function radioFileOn(){
  if(RADIO.dead)return false;
  try{
    if(!RADIO.a){
      RADIO.i=0;RADIO.a=new Audio(RADIO_SRC[0]);RADIO.a.loop=true;RADIO.a.volume=0.6;RADIO.a.preload='auto';
      RADIO.a.addEventListener('error',()=>{
        if(RADIO.i+1<RADIO_SRC.length){RADIO.i++;RADIO.a.src=RADIO_SRC[RADIO.i];RADIO.a.load();if(RADIO.on){const pr=RADIO.a.play();if(pr&&pr.catch)pr.catch(()=>{});}return;}
        RADIO.dead=true;if(RADIO.on){radioFileOff();musicOn=false;banner('RADIO','intro.mp3 nicht gefunden (audio/intro.mp3)','#ffb36b');}
      });
    }
    try{RADIO.a.currentTime=0;}catch(e){}
    const pr=RADIO.a.play();if(pr&&pr.catch)pr.catch(e=>{if(RADIO.on&&e&&e.name==='NotAllowedError')banner('RADIO','Browser blockiert Ton · nochmal E drücken','#ffb36b');});
    RADIO.on=true;return true;
  }catch(e){return false;}
}
function radioNext(){
  if(RADIO.on){radioFileOff();musicOn=false;}
  else if(!musicOn){musicOn=true;songIdx=0;}
  else if(songIdx+1>=SONGS.length){if(!radioFileOn())musicOn=false;}
  else songIdx++;
  mStep=0;if(AC)mNext=AC.currentTime+0.1;
  SND.click(musicOn||RADIO.on?520:260);
  banner('RADIO',radioName(),'#8ee26b');
}

/* ----- Startbildschirm: audio/intro.mp3 (falls vorhanden; sonst bleibt es still) ----- */
const INTRO={a:null,tried:false,stopped:false};
function introPlay(){
  if(INTRO.stopped||INTRO.tried&&INTRO.a&&!INTRO.a.paused)return;
  try{
    if(!INTRO.a){INTRO.a=new Audio('audio/intro.mp3');INTRO.a.volume=0.9;INTRO.a.preload='auto';INTRO.a.addEventListener('error',()=>{INTRO.dead=true;try{console.warn('intro.mp3 nicht ladbar',INTRO.a.error&&INTRO.a.error.code);}catch(e){}},{once:true});}
    if(INTRO.dead)return;
    const pr=INTRO.a.play();INTRO.tried=true;
    if(pr&&pr.catch)pr.catch(()=>{});     // Autoplay gesperrt: beim ersten Tastendruck/Klick erneut versuchen
  }catch(e){}
}
function introStop(){      // ausblenden, dann anhalten
  INTRO.stopped=true;const a=INTRO.a;if(!a)return;
  let v=a.volume;const iv=setInterval(()=>{v-=0.08;if(v<=0.02){clearInterval(iv);try{a.pause();}catch(e){}}else{try{a.volume=v;}catch(e){}}},100);
}
introPlay();
for(const ev of ['pointerdown','keydown','gamepadconnected'])window.addEventListener(ev,()=>{if(S.mode==='start'||S.mode==='intro')introPlay();},{passive:true});

/* ----- Geräusch-Dateien (optional, sonst still): audio/toilet.mp3, audio/shower.mp3, audio/barbecue.mp3 (auch in audio/voice/ gefunden) ----- */
const SFX_AUDIO={};
function sfxPlay(name){
  if(voiceMuted)return;
  const dirs=['audio/','audio/voice/'];
  const tryDir=i=>{
    if(i>=dirs.length)return;
    try{
      const prev=SFX_AUDIO[name];if(prev){try{prev.pause();}catch(e){}}
      const a=new Audio(dirs[i]+name+'.mp3');a.volume=0.9;SFX_AUDIO[name]=a;
      let moved=false;const next=()=>{if(moved)return;moved=true;tryDir(i+1);};
      a.addEventListener('error',next,{once:true});
      const pr=a.play();if(pr&&pr.catch)pr.catch(e=>{if(!e||e.name!=='NotAllowedError')next();});
    }catch(e){tryDir(i+1);}
  };
  tryDir(0);
}

/* ---------- Sprechzeilen (Sprachausgabe), jede durch eine MP3 ersetzbar ---------- */
/* Datei:  audio/voice/<schlüssel>.mp3   Schlüssel: houg_<name>_<nr> bzw. anwohner_<name>_<nr>. Fehlt die Datei, spricht die Sprachausgabe. */
VOICES.anwohner={pitch:1.2,rate:1.0};
const HL={
  toilet:['Ahh. Das tat gut.','Endlich. Das war knapp.'],
  bath:['Wie neugeboren!','Ahh, schön warm. Ich bleibe noch fünf Minuten.'],
  sandwich:['Mhm, Pastrami.','Das hat gefehlt.','Ein Sandwich ist wie eine Umarmung.'],
  pizza:['Heiß und fettig. Perfekt.','Pizza! Endlich ein richtiges Essen.'],
  bin_money:['Wer wirft denn Geld weg?','Heute ist mein Glückstag.'],
  bin_food:['Schmeckt … überraschend okay.','Das ist noch gut. Ich bin mir fast sicher.'],
  bin_trash:['Das riecht nach Montag.','Wirklich nur Müll.','Das hätte ich mir sparen können.'],
  snack:['Der Automat versteht mich.','Gut, dass ich Kleingeld habe.'],
  truck:['Dann mal los. Die Pakete warten nicht.','Truck starten. Ich bin der König der Straße.'],
  shop:['Das hat sich gelohnt.','Lecker. Genau das, was ich brauchte.'],
  slot_win:['Ha! Der Automat liebt mich!','Klingeln, bitte mehr davon!'],
  slot_lose:['Mist. Der Nächste zahlt bestimmt.','Das Geld ist weg. Egal, noch einmal.'],
  poker_win:['Ein Pokerface braucht Übung. Ich habe sie.','Danke für die Chips, Jungs!'],
  poker_lose:['Das war ein Bluff. Ganz sicher.','Autsch. Dean, du bist ein Fuchs.'],
  poker_allin:['Alles oder nichts!','Ich setze alles. Was soll schon passieren?'],
  bike:['Aufs Rad, fertig, los!','Fahrrad ist schneller als zu Fuß. Meistens.'],
  tv:['Und jetzt Football.','Fernbedienung, mein alter Freund.'],
  laptop:['Mal sehen, was das Internet heute hat.','Online-Shopping, mein zweiter Vorname.'],
  bed:['Gute Nacht, Welt.','Endlich schlafen.'],
  archie:['Archie! Das war wieder eine von deinen Ideen!','Netter Versuch, Archie. Aber nicht mit mir.','Archie, ich schwöre, irgendwann bekomme ich dich!','Mein Schwiegervater, der Spaßvogel. Haha. Sehr lustig.']
};
const AW={
  danke:['Danke! Wurde auch Zeit.','Oh, ein Paket! Genau das habe ich bestellt.','Super, vielen Dank. Schönen Tag noch!','Endlich! Mein Hund hat schon gewartet.','Perfekt, pünktlich auf die Minute. Danke, junger Mann!'],
  meckern:['Hey! Das war mein Blumenbeet!','Da liegt jetzt ein Paket im Gebüsch!','Wird das Ihr Ernst?! Ich beschwere mich bei YPS!','Haben Sie das gerade aus dem Fenster geworfen?!']
};
function vline(key,who,text,ms,subName){
  say(subName,text,ms||3000);
  if(voiceMuted)return;
  const fallback=()=>{try{window.speechSynthesis&&window.speechSynthesis.cancel();}catch(e){}voiceTTS(key,who,text);};
  if(clipState[key]==='missing'){fallback();return;}
  let done=false,a0=null;const url=VOICE_CLIPS[key]||(VOICE_DIR+key+'.mp3');
  const fail=why=>{if(done)return;done=true;clipState[key]='missing';fallback();};
  try{
    const a=new Audio(url);a0=a;a.volume=0.9;a.preload='auto';
    a.addEventListener('error',()=>fail('error'),{once:true});
    const pr=a.play();
    if(pr&&pr.then)pr.then(()=>{clipState[key]='ok';done=true;}).catch(e=>{if(e&&e.name==='NotAllowedError'){done=true;return;}fail(e&&e.name);});
  }catch(e){fail(String(e));}
}
function hLine(name,ms){const L=HL[name],i=Math.floor(Math.random()*L.length);vline('houg_'+name+'_'+(i+1),'houg',L[i],ms||2600,'Houg');}
function aLine(name,ms){const L=AW[name],i=Math.floor(Math.random()*L.length);vline('anwohner_'+name+'_'+(i+1),'anwohner',L[i],ms||2800,'Anwohner');}

/* Archie stellt eine Falle auf und redet mit Houg: 10 Sätze, in 30 % der Fälle gesprochen (mp3 archie_trap_1..10, sonst TTS) */
const ARCH_TRAP=[
 'Hallo, mein Junge. Setz dich ruhig, es passiert bestimmt nichts.',
 'Houg, ich räume nur ein bisschen auf. Du brauchst gar nicht herzuschauen.',
 'Früher hat man so etwas Humor genannt, mein Junge.',
 'Schau nicht so misstrauisch, Houg. Ich bin ein alter Mann.',
 'Ich habe nichts gemacht. Wirklich. Frag Connie, sie weiß es auch nicht.',
 'Na, Houg, heute schon was Aufregendes erlebt? Gleich vielleicht.',
 'Geh ruhig weiter, mein Junge. Ich passe hier auf. Auf alles.',
 'In meinem Alter muss man sich die Unterhaltung selbst machen.',
 'Du siehst müde aus, Houg. Leg dich doch mal irgendwo hin.',
 'Das ist kein Streich, das ist Erziehung.'
];
function archTrapLine(){
  const i=Math.floor(Math.random()*ARCH_TRAP.length),t=ARCH_TRAP[i];
  if(Math.random()<0.3)vline('archie_trap_'+(i+1),'archie',t,4200,'Archie');
  else say('Archie',t,4200);
}
