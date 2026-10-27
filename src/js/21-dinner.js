/* ---------- Abendessen mit Connie auf der Couch: täglich ab 19:00 Uhr, außer sonntags ---------- */
S.dinner={st:'none'};S.scene=null;
const DINNER_SEAT={connie:-3.6,houg:-4.6,archie:-5.6,z:-1.2,sink:-0.38};
const DSTORY=[
 {l:['Du glaubst nicht, was heute im Kanzlei-Turm los war. Der Aufzug ist zwischen dem 14. und 15. Stock stehen geblieben.','Mit mir: mein Chef, ein Paketbote und ein Mann, der ununterbrochen Opern gesungen hat.','Nach zwei Stunden hat der Paketbote mitgesungen. Mein Chef hat geweint.'],e:'clap'},
 {l:['Mein Kollege Gordon hat heute versehentlich eine Mail an die ganze Kanzlei geschickt. Mit seinem Mittagessen als Anhang.','Der Betreff war: „Bitte nicht lachen.“','Inzwischen gibt es auf allen Fluren Bilder von diesem Sandwich.'],e:'clap'},
 {l:['Heute war ein Mandant da, der seinen Nachbarn verklagen will, weil dessen Hecke zu fröhlich aussieht.','Ich habe ihm gesagt, dafür gibt es keinen Paragrafen.','Er hat gefragt, ob wir einen erfinden können. Ich glaube, er kommt wieder.'],e:'clap'},
 {l:['Die Kaffeemaschine im dritten Stock ist kaputt. Es gab eine Sitzung dazu, eine ganze Stunde.','Ergebnis: Wir bilden einen Arbeitskreis.','Ich habe mir inzwischen einen Kaffee von unten geholt. Allein. Wie eine Verbrecherin.'],e:'doze'},
 {l:['Frau Brandt aus der Buchhaltung hat mir heute zwanzig Minuten lang von ihrem Urlaub erzählt.','Es ging um einen Campingplatz. Und um Mücken. Und um den Campingplatz.','Houg, ich habe mir innerlich eine Kerze angezündet, dass sie aufhört.'],e:'doze'},
 {l:['Heute hat jemand in der Kantine meinen Salat gegessen. Mit Namen drauf!','Ich habe eine Nachricht an alle geschrieben. Es hat sich niemand gemeldet.','Aber beim Mittagessen hat Gordon plötzlich ganz verdächtig gegrinst.'],e:'clap'},
 {l:['Wir hatten heute eine Brandschutzübung. Alle mussten über die Treppe raus, 30 Stockwerke.','Mein Chef kam als Letzter unten an. Er hat gesagt, er hätte „das Gebäude gesichert“.','In Wahrheit hat er auf jedem Stockwerk Pause gemacht.'],e:'clap'},
 {l:['Es gab heute wieder Streit um den Parkplatz vor dem Turm. Zwei Anwälte, ein Parkplatz.','Sie haben sich so lange angebrüllt, bis ein Abschleppwagen kam.','Der hat dann beide Autos mitgenommen. Und alle haben geklatscht.'],e:'clap'},
 {l:['Heute habe ich zum ersten Mal die Dachterrasse vom Turm gesehen. Man sieht ganz Queens.','Und mitten drin – ich schwöre – unser Haus. Klein wie ein Streichholz.','Ich habe kurz gewunken. Du hast nicht zufällig zurückgewunken?'],e:null},
 {l:['Mein Chef will, dass wir freitags „lockere Kleidung“ tragen. Gordon kam im Bademantel.','Der Chef hat gesagt, das sei „zu locker“. Gordon sagte, das sei sein Anzug-Bademantel.','Wir mussten die Sitzung abbrechen, weil keiner mehr konnte.'],e:'clap'},
 {l:['Ich musste heute einen Vertrag vorlesen, 214 Seiten. Laut. Für einen Mandanten, der kein Lesen mag.','Bei Seite 90 ist er eingeschlafen. Bei Seite 150 ich fast auch.','Aber er hat unterschrieben. Ohne ein Wort zu verstehen. So läuft das.'],e:'doze'},
 {l:['Gordon hat mich heute gefragt, ob er sich meinen Regenschirm leihen darf. Für drinnen.','Er sagte, über seinem Schreibtisch tropft die Klimaanlage.','Jetzt sitzt er mit meinem Schirm im Büro und tut so, als wäre es ein Strandurlaub.'],e:'clap'},
 {l:['Heute war der große Tag der offenen Tür. Ich durfte die Gäste durch den Turm führen.','Ein kleiner Junge hat gefragt, ob wir hier Bösewichte einsperren. Ich sagte: „Nur ihre Verträge.“','Seine Mutter hat gelacht. Mein Chef nicht.'],e:'clap'}
];
const ARCHIE_TV=['Zu meiner Zeit hat man im Büro noch richtig gearbeitet. Mit Schreibmaschine und schlechter Laune.','Ein Aufzug mit Oper? Das klingt nach meiner Hochzeit.','Mädchen, du solltest mehr essen. Und weniger erzählen.','Schmeckt wie früher. Also: nach nichts.','Könnt ihr den Fernseher mal anmachen? Ich ertrage nur Fernsehen.','Hmpf.'];
const dinnerOn=()=>weekdayIdx()!==6;
const hasAct=(m,k)=>!!(m.userData.acts&&m.userData.acts[k]);
/* Houg setzt sich: mit Sitz-Clip auf Sitzhöhe, sonst tief in die Polster */
function hougSeat(x,z,rot){
  P.x=x;P.z=z;P.fl=0;P.rot=rot;P.vx=P.vz=0;
  const pose=hasAct(player,'sittalk')?'sittalk':(hasAct(player,'sitdrink')?'sitdrink':null);
  player.userData.pose=pose;P.y=pose?0:DINNER_SEAT.sink;
  if(pose==='sittalk'){      // der Clip sitzt rund 0,4 m hinter dem Ursprung und etwas seitlich: nach vorn/mittig korrigieren
    const c=Math.cos(rot),s=Math.sin(rot);P.x+=0.15*c+0.36*s;P.z+=-0.15*s+0.36*c;
  }
}
function hougStand(){const u=player.userData;if(u.pose&&hasAct(player,'sitstand'))playOnce(player,'sitstand',3.2);u.pose=null;}
function dinnerNewDay(){S.dinner={st:'none'};}
function dinnerSit(n,x,sink){n.x=x;n.z=DINNER_SEAT.z;n.y=sink?DINNER_SEAT.sink:0;n.path=[];n.plan=[];n.wait=9999;n.mesh.position.set(n.x,n.y+0.04,n.z);n.mesh.rotation.y=0;}
function dinnerStart(){
  if(S.scene||S.mode!=='play'||TRK.mounted||BIKE.mounted)return;
  S.dinner.st='scene';S.scene={t:0};
  if(S.prank)prankEnd(false);
  setCarry(null);clearStepProp();marker.visible=false;S.task=null;
  // Houg setzt sich (ohne Sitz-Clip: tief in die Polster)
  S.scene.P0={x:P.x,z:P.z,y:P.y,rot:P.rot};
  hougSeat(DINNER_SEAT.houg,DINNER_SEAT.z,0);
  connie.away=false;connie.mesh.visible=true;connie.sitting=false;
  // Connie: kurz hinsetzen (Übergang), dann Sitzpose
  connie.x=DINNER_SEAT.connie;connie.z=DINNER_SEAT.z+0.55;connie.y=0;connie.path=[];connie.plan=[];connie.wait=9999;connie.mesh.position.set(connie.x,0.04,connie.z);connie.mesh.rotation.y=0;
  const cu=connie.mesh.userData;
  if(cu.acts&&cu.acts.standsit)playOnce(connie.mesh,'standsit',3.4);
  setTimeout(()=>{if(!S.scene)return;dinnerSit(connie,DINNER_SEAT.connie,false);if(cu.acts&&cu.acts.sitdrink)cu.pose='sitdrink';},cu.acts&&cu.acts.standsit?3300:200);
  const arch=S.archieHere&&archie&&!archie.away;
  if(arch){const au=archie.mesh.userData;dinnerSit(archie,DINNER_SEAT.archie,!hasAct(archie.mesh,'sitdrink'));if(hasAct(archie.mesh,'sitdrink'))au.pose='sitdrink';}
  const st=DSTORY[(S.day-1)%DSTORY.length];
  const L=[['Connie','Das Essen ist fertig, Houg! Setz dich, ich erzähle dir von meinem Tag.',3600]];
  st.l.forEach(t=>L.push(['Connie',t,Math.max(4600,t.length*62)]));
  if(arch)L.splice(2,0,['Archie',pick(ARCHIE_TV),3800]);
  L.push(['Connie','So war das. Und bei dir, Schatz?',2800],['Houg','Das Essen ist gut.',2400]);
  banner('ABENDESSEN','Mit Connie'+(arch?' und Archie':'')+' auf der Couch','#ff9d3d');
  sayQueue(L);
  const total=L.reduce((a,x)=>a+x[2]+300,0)+400;
  // Pointe: Klatschen oder Eindösen kurz vor Schluss
  setTimeout(()=>{if(!S.scene)return;if(st.e==='clap'&&cu.acts&&cu.acts.sitclap)playOnce(connie.mesh,'sitclap',3.2);},total-6200);
  setTimeout(()=>{if(S.scene&&st.e==='doze'&&cu.acts&&cu.acts.sitdoze)cu.pose='sitdoze';},total-5200);
  if(arch)setTimeout(()=>{if(S.scene&&hasAct(archie.mesh,'sitclap'))playOnce(archie.mesh,'sitclap',3.3);},total-9000);
  if(arch)setTimeout(()=>{if(S.scene&&st.e==='doze'&&hasAct(archie.mesh,'sitdoze'))archie.mesh.userData.pose='sitdoze';},total-4800);
  setTimeout(dinnerEnd,total);
}
function dinnerEnd(){
  if(!S.scene||S.scene.ending)return;
  S.scene.ending=true;
  // aufstehen: Houg und Archie mit Sitz→Stand-Clip, Connie steht einfach auf
  const cu=connie.mesh.userData;cu.pose=null;cu.once=null;
  hougStand();
  if(S.archieHere&&archie){const au=archie.mesh.userData;if(au.pose&&hasAct(archie.mesh,'sitstand'))playOnce(archie.mesh,'sitstand',2.4);au.pose=null;}
  setTimeout(dinnerFinish,hasAct(player,'sitstand')?2900:200);
}
function dinnerFinish(){
  if(!S.scene)return;
  const P0=S.scene.P0;S.scene=null;S.dinner.st='done';
  P.x=-4.6;P.z=-0.2;P.y=0;P.rot=P0?P0.rot:0;player.userData.pose=null;
  connie.x=-3.0;connie.z=-0.1;connie.y=0;connie.wait=0;connie.path=[];connie.plan=[{go:'K2'}];
  if(S.archieHere&&archie){archie.wait=0;archie.path=[];archie.plan=[{go:'KI'}];archie.y=0;archie.x=-5.4;archie.z=-0.4;archie.mesh.userData.once=null;}
  S.hunger=Math.min(100,S.hunger+35);S.social=Math.min(100,S.social+20);S.mood=Math.min(100,S.mood+10);S.minutes=Math.min(S.minutes+40,23*60);
  SND.win();banner('SATT UND ZUFRIEDEN','Hunger +35 · Sozialkontakte +20 · Haussegen +10','#8ee26b');
}
/* Fernsehen im Sitzen: Houg setzt sich kurz auf die Couch, schaut etwa 8 Sekunden und steht wieder auf */
function tvSitStart(){
  if(S.scene||S.mode!=='play'||TRK.mounted||BIKE.mounted){watchTV();return;}
  const garage=P.x>12;
  if(garage&&S.friends){watchTV();return;}       // Sofa in der Garage ist von den Jungs besetzt
  S.scene={t:0,kind:'tv',P0:{x:P.x,z:P.z,y:P.y,rot:P.rot}};
  if(garage)hougSeat(22.8,-3.05,Math.PI);else hougSeat(-4.6,-1.2,0);
  setTimeout(()=>{
    if(!S.scene||S.scene.kind!=='tv')return;
    hougStand();
    setTimeout(()=>{if(!S.scene||S.scene.kind!=='tv')return;const P0=S.scene.P0;S.scene=null;P.x=P0.x;P.z=P0.z;P.y=0;P.rot=P0.rot;player.userData.pose=null;watchTV();},hasAct(player,'sitstand')?2900:200);
  },8000);
}
function sceneHold(dt){
  S.scene.t+=dt;P.vx=P.vz=0;
  player.position.set(P.x,P.y+0.04,P.z);player.rotation.y=P.rot;
  const u=player.userData;if(u.acts&&u.acts.drink&&!u.once&&Math.random()<dt/9)playOnce(player,'drink',2.6);
  animWalk(player,P.t,0,0);
}
function dinnerStep(dt){
  const d=S.dinner;if(!d||S.scene)return;
  if(d.st==='none'&&dinnerOn()&&S.minutes>=19*60&&S.minutes<23*60&&S.mode==='play'){
    d.st='call';SND.bell();
    say('Connie','Houg! Das Abendessen ist fertig. Komm auf die Couch!',4200);
    banner('ABENDESSEN','Komm zur Couch · Connie wartet','#ff9d3d');
  }
  if(d.st==='call'&&S.minutes>=20*60+30){
    d.st='missed';S.mood=Math.max(0,S.mood-10);S.social=Math.max(0,S.social-6);
    banner('ESSEN KALT','Connie ist sauer. Haussegen −10','#ff7b7b');say('Connie','Das Essen ist kalt! Du kommst nie pünktlich!',4200);
  }
}
function dinnerTarget(){const d=S.dinner;return d&&d.st==='call'?{x:-4.6,z:-0.5,fl:0,label:'Abendessen mit Connie auf der Couch'}:null;}
function dinnerQuestHTML(){const d=S.dinner;if(!d||d.st!=='call')return '';return '<div class="qh"><em>ABENDESSEN</em> · 19:00 Uhr</div><div class="qs cur"><span>➤</span><span>Zur Couch gehen und mit Connie essen</span></div><div class="qd">Connie wartet bis 20:30 Uhr</div>';}
STATIC_INTER.push({id:'dinner',x:-4.6,z:-0.4,r:2.6,prio:3.8,quest:true,blip:'#ff9d3d',
  label:()=>S.dinner.st==='call'&&!TRK.mounted?'Abendessen mit Connie (E)':null,use:dinnerStart});
