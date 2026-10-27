/* ---------- Aufgaben, Streiche, Besuch, Kapitel, Interaktionen ---------- */
const marker=new THREE.Group();scene.add(marker);marker.visible=false;
{const bm=new THREE.MeshBasicMaterial({color:0xf5c542,transparent:true,opacity:.32,side:THREE.DoubleSide,depthWrite:false});
 marker.add(new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,3.4,14,1,true),bm).translateY(1.7));
 const ring=new THREE.Mesh(new THREE.TorusGeometry(.6,.06,6,20),new THREE.MeshBasicMaterial({color:0xf5c542}));ring.rotation.x=Math.PI/2;ring.position.y=.08;marker.add(ring);}
let stepProp=null;

const TASKS=[
 {id:'trash',title:'Müll rausbringen',say:'Der Müll stinkt schon wieder.',
  steps:[{x:5.95,z:-4.5,label:'Müllsack nehmen (Küche)',item:'trash',carry:['Müllsack',0x222222,'trash']},{x:-11.9,z:3.6,label:'Müllsack in die Tonne vor dem Haus werfen'}]},
 {id:'laundry',title:'Wäsche wegbringen',say:'Die frische Wäsche liegt im Bad.',
  steps:[{x:6.4,z:-3.2,fl:1,label:'Wäschekorb nehmen (Bad, oben)',item:'laundry',carry:['Wäschekorb',0x8fb8e8,'laundry']},{x:-4.4,z:4.8,fl:1,label:'Wäsche im Schlafzimmer ablegen'}]},
 {id:'dishes',title:'Abwasch',say:'Das Geschirr stapelt sich seit gestern.',
  steps:[{x:7.6,z:1.6,label:'Abwasch in der Küche (Minispiel)',mini:true}]},
 {id:'groceries',title:'Einkäufe einräumen',say:'Die Einkäufe stehen an der Haustür.',
  steps:[{x:-7.4,z:0.0,label:'Einkäufe an der Haustür nehmen',item:'groceries',carry:['Einkäufe',0xc8a064,'groceries']},{x:3.55,z:-4.5,label:'Einkäufe in den Kühlschrank räumen',hold:1.5,stock:4}]},
 {id:'bed',title:'Bett machen',say:'Das Bett sieht aus wie ein Schlachtfeld.',
  steps:[{x:-5.4,z:1.1,fl:1,label:'Bett machen (E gedrückt halten)',hold:2.5}]},
 {id:'post',title:'Post hereinholen',say:'Die Post liegt noch im Briefkasten.',
  steps:[{x:-10.5,z:-2.4,label:'Post aus dem Briefkasten holen',item:'post',pos:[-10.9,1.33,-2.9],carry:['Post',0xf2ede0,'post']},{x:-0.1,z:3.3,label:'Post auf den Esstisch legen'}]},
 {id:'plants',title:'Pflanzen gießen',say:'Die Pflanzen lassen schon die Köpfe hängen.',
  steps:[{x:7.6,z:1.0,label:'Gießkanne am Spülbecken füllen',item:'can',carry:['Gießkanne',0x3aa08a,'can']},
         {x:-4.7,z:-4.9,label:'Zimmerpflanze gießen (E halten)',hold:1.2},
         {x:14.0,z:0.9,label:'Beete im Garten gießen (E halten)',hold:1.5}]},
 {id:'grill',title:'Grill vorbereiten',say:'Heute Abend wird gegrillt. Mach den Grill fertig.',
  steps:[{x:25.1,z:-4.7,label:'Grillkohle aus dem Garagenschrank holen',item:'charcoal',carry:['Grillkohle',0x2a2a2d,'charcoal']},
         {x:14.2,z:-4.2,label:'Kohle in den Grill im Garten füllen (E halten)',hold:1.5,drop:true},
         {x:3.55,z:-4.5,label:'Würstchen aus dem Kühlschrank holen',carry:['Würstchen',0xd77a52,'sausage']},
         {x:14.2,z:-4.2,label:'Würstchen auf den Grill legen (E halten)',hold:2.0}]},
 {id:'dinner',title:'Abendessen vorbereiten',say:'Ich wünsche mir heute Abend etwas Warmes auf dem Tisch.',
  steps:[{x:3.55,z:-4.5,label:'Zutaten aus dem Kühlschrank holen',carry:['Zutaten',0x8a5a30,'veg']},
         {x:7.0,z:3.3,label:'Essen kochen (E halten)',hold:3,drop:true},
         {x:7.6,z:2.4,label:'Teller aus dem Schrank holen',carry:['Teller',0xf5f5f5,'dishes']},
         {x:-0.1,z:3.3,label:'Tisch decken (E halten)',hold:2}]},
 {id:'parcel',title:'Paket in die Garage bringen',say:'Da ist ein Paket für uns. Stell es in die Garage.',
  steps:[{x:-8.2,z:-1.3,label:'Paket an der Haustür nehmen',item:'parcel',carry:['Paket',0xc8a064,'parcel']},{x:19.2,z:-4.7,label:'Paket ins Garagenregal stellen'}]},
 {id:'bulb',title:'Glühbirne wechseln',say:'Die Lampe im Wohnzimmer ist schon wieder kaputt.',
  steps:[{x:21.0,z:-4.7,label:'Glühbirne aus dem Garagenschrank holen',item:'bulb',carry:['Glühbirne',0xfff3b0,'bulb']},{x:-7.6,z:-3.2,label:'Lampe im Wohnzimmer wechseln (E halten)',hold:1.5}]},
 {id:'rolls',title:'Brötchen vom Bäcker holen',far:true,say:'Zum Frühstück fehlen noch Brötchen. Die Bäckerei an der Straße hat offen.',
  steps:[{x:-24.5,z:15.5,label:'Brötchen in der Bäckerei abholen',item:'rolls',pos:[-25.1,0,16.8],carry:['Brötchen',0xd9b98a,'rolls']},{x:-0.1,z:3.6,label:'Brötchen auf den Esstisch stellen'}]},
 {id:'milk',title:'Milch und Eier besorgen',far:true,say:'Milch und Eier sind alle. Hol welche im Markt gegenüber.',
  steps:[{x:-24.5,z:-31,label:'Milch und Eier im Markt besorgen',item:'milk',pos:[-25.1,0,-29.8],carry:['Milch & Eier',0xf5f5f5,'milk']},{x:3.55,z:-4.5,label:'Milch und Eier in den Kühlschrank stellen',hold:1.2}]},
 {id:'paper',title:'Zeitung und Chips vom Späti',far:true,say:'Dein Vater will die Zeitung, und du brauchst bestimmt wieder Chips. Hol beides beim Späti.',
  steps:[{x:-10.8,z:31,label:'Zeitung und Chips im Späti holen',item:'paper',pos:[-10.2,0,32.2],carry:['Zeitung & Chips',0xe6e2d6,'paper']},{x:-4.6,z:0.1,label:'Zeitung und Chips aufs Sofa legen'}]},
 {id:'cakepan',title:'Kuchenform zu Fou Lerrigno',far:true,say:'Bring bitte die Kuchenform zurück zu Fou Lerrigno, zwei Häuser die Straße runter.',
  steps:[{x:7.6,z:2.4,label:'Kuchenform aus der Küche holen',item:'cakepan',pos:[8.6,0.95,2.0],carry:['Kuchenform',0xb9bcc2,'cakepan']},{x:-11.6,z:12.7,label:'Bei Fou Lerrigno klingeln und Form abgeben (E halten)',hold:1.5,drop:true}]},
 {id:'bundle',title:'Altpapier wegbringen',far:true,say:'Das Altpapier stapelt sich im Flur. Die blaue Tonne steht an der Straße.',
  steps:[{x:-7.4,z:3.3,label:'Altpapierbündel nehmen (Flur)',item:'bundle',carry:['Altpapier',0xe6e2d6,'bundle']},{x:-11.9,z:-3.3,label:'Altpapier in die blaue Tonne werfen'}]},
 {id:'glass',title:'Altglas wegbringen',say:'Die leeren Flaschen müssen endlich weg.',
  steps:[{x:6.0,z:-3.3,label:'Leere Flaschen einsammeln (Küche)',item:'bottles',carry:['Altglas',0x2f7d3a,'bottles']},{x:-11.9,z:5.5,label:'Altglas in den Container werfen'}]}
];
/* Müllcontainer: Deckel hinten (Hausseite) aufgeklappt, die Öffnung zeigt zur Straße */
function openBin(x,z,w,h,col,colD,mark){
  const g=new THREE.Group();g.position.set(x,0,z);OUT.add(g);
  box(g,w,h,0.8,col,0,0,0);
  box(g,w-0.12,0.03,0.68,0x14161a,0,h,0,false);                       // dunkle Öffnung
  const hinge=new THREE.Group();hinge.position.set(w/2,h,0);hinge.rotation.z=-1.95;g.add(hinge);   // Scharnier an der Hausseite
  box(hinge,w+0.05,0.06,0.85,colD,-(w+0.05)/2,0,0,false);
  box(g,0.05,0.2,0.4,mark,-w/2-0.02,h*0.6,0,false);                   // Aufkleber zur Straße
}
/* Altpapier-Tonne an der Straße */
openBin(-12.9,-3.3,0.9,1.0,0x2f5fa0,0x244a80,0xf4f4f4);block(-13.35,-3.7,-12.45,-2.9);
/* Altglas-Container an der Straße */
openBin(-12.9,5.6,0.9,1.1,0x2f7d3a,0x245f2d,0x111111);block(-13.35,5.2,-12.45,6.0);
/* Briefkasten vor dem Haus */
box(OUT,0.12,1.0,0.12,0x5a3b22,-10.9,0,-2.9);box(OUT,0.5,0.32,0.34,0x2a4a8a,-10.9,1.0,-2.9);box(OUT,0.5,0.06,0.36,0xd8d8d8,-10.9,1.32,-2.9,false);

function clearStepProp(){if(stepProp){if(stepProp.parent)stepProp.parent.remove(stepProp);stepProp=null;}}
function setupStep(){
  clearStepProp();
  if(!S.task){marker.visible=false;return;}
  const t=S.task,st=t.def.steps[t.step];
  marker.position.set(st.x,flY(st.fl||0),st.z);marker.visible=true;
  if(st.item){stepProp=makeItem(st.item);const p=st.pos||[st.x,0,st.z];stepProp.position.set(p[0],p[1],p[2]);stepProp.rotation.y=0.4;grp(st.fl||0).add(stepProp);}
}
/* Aufgabenliste des Tages */
function selectTask(i){
  setCarry(null);
  const t=S.todo[i];
  if(!t||t.done){S.task=null;setupStep();return;}
  t.step=0;S.ti=i;S.task=t;setupStep();
}
function nextOpen(from){
  const n=S.todo.length;
  for(let k=1;k<=n;k++){const i=(from+k)%n;if(!S.todo[i].done)return i;}
  return -1;
}
function cycleTask(){
  if(S.todo.length<2)return;
  if(S.carry){say('Houg','Erst ablegen, dann wechseln.',2200);SND.buzz();return;}
  const i=nextOpen(S.ti);if(i<0||i===S.ti)return;
  SND.click(520);selectTask(i);say('Houg','Als Nächstes: '+S.task.def.title+'.',2200);
}
function issueTasks(work){
  const pool=TASKS.slice();for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}pool.length=5;
  if(!pool.some(d=>d.far)){const far=TASKS.filter(d=>d.far);pool[Math.floor(Math.random()*5)]=pick(far);}
  S.todo=pool.map(def=>({def,step:0,done:false}));
  selectTask(0);SND.ding();
  banner('5 AUFGABEN VON CONNIE',work?'Bis 15:00 Uhr erledigen':'Bis zum Nachmittag erledigen','#f5c542');
  const lines=S.dayMode==='absent'?[['Connie','Dein Chef hat angerufen. Du warst nicht da?! Dann kannst du ja gleich den Haushalt machen. Heute steht an:',5000]]:(S.cLeft?[['Connie','Ich habe von deinem Chef gehört, du bist zuhause. Dann hast du ja Zeit. Heute steht an:',4600]]:(work?[['Connie','Ich muss in die Kanzlei, Schatz. Heute steht an:',3600]]:[['Connie','Heute ist Wochenende, aber das Haus macht sich nicht von allein. Heute steht an:',4200]]));
  lines.push(['Connie',pool.map(d=>d.title).join(', ')+'.',5200]);
  lines.push(['Connie',work?'Wenn ich um drei zurück bin, ist alles erledigt. Alles, Houg!':'Bis zum Abend, ja?',3600]);
  sayQueue(lines);
}
S.bonusCnt=0;S.bonusT=40;S.lastBonus=null;S.bonusDone={};
function bonusStep(dt){
  if(!atHome()||S.scene)return;      // Bonusaufgaben nur, wenn der Spieler zu Hause ist
  if(!S.assigned||S.task||S.prank||S.mode!=='play'||S.minutes<7*60||S.minutes>=21*60||S.bonusCnt>=8)return;
  if(!S.todo.length||(S.chapter>=3&&isWorkday()&&!S.workHome))return;     // bei der Arbeit keine Extra-Aufgaben von Connie
  if(!S.todo.every(t=>t.done))return;
  S.bonusT-=dt;if(S.bonusT>0)return;
  const used=new Set(S.todo.map(t=>t.def.id));for(const k in S.bonusDone)used.add(k);
  const pool=TASKS.filter(d=>d.id!==S.lastBonus&&d.id!=='dishes'&&!used.has(d.id));
  if(!pool.length)return;      // jede Aufgabe höchstens einmal pro Tag
  const def=pick(pool);S.lastBonus=def.id;S.bonusDone[def.id]=1;S.bonusCnt++;S.bonusT=40;
  S.todo.push({def,step:0,done:false,bonus:true});selectTask(S.todo.length-1);SND.ding();
  banner('BONUSJOB','Extra-Aufgabe: '+def.title+' (+$14)','#f5c542');
  say(connie.away?'Houg':'Connie',connie.away?'Mir fällt noch was ein: '+def.title+'.':'Wenn du schon dabei bist: '+def.title+'.',3400);
}
function startTask(def){S.todo=[{def,step:0,done:false}];selectTask(0);say('Connie',def.say,4200);SND.ding();}
function advanceTask(){
  const t=S.task;if(!t)return;
  const st=t.def.steps[t.step];SND.click(520);
  if(st.drop)setCarry(null);
  if(st.carry)setCarry(st.carry[0],st.carry[1],st.carry[2]);
  if(st.stock){S.stock=Math.min(maxStock(),S.stock+st.stock);}
  t.step++;
  if(t.step>=t.def.steps.length)completeTask();else setupStep();
}
function completeTask(){
  const t=S.task;
  const reward=Math.round((t&&t.bonus?14:20)*buffMult('taskmoney'));
  if(t)t.done=true;
  if(t&&t.bonus)S.bonusT=40;
  setCarry(null);clearStepProp();marker.visible=false;S.task=null;
  S.money+=reward;S.mood=Math.min(100,S.mood+4);S.cnt.tasks++;bagReward(0.22);
  playOnce(player,'cheer',1.8);SND.win();banner('AUFGABE ERLEDIGT',t?t.def.title+'  +$'+reward:'+$'+reward);
  const i=nextOpen(S.ti);
  if(i>=0)selectTask(i);
  else if(S.todo.length>1){say('Houg','Alles erledigt. Jetzt Fernsehen!',3000);}
  checkChapter();
}
/* Connie kommt zurück bzw. Tagesbewertung der Aufgaben */
function evaluateTasks(work){
  const open=S.todo.filter(t=>!t.done&&!t.bonus).length,total=S.todo.filter(t=>!t.bonus).length;
  setCarry(null);clearStepProp();marker.visible=false;S.task=null;
  if(total){
    if(open===0){S.money+=30;S.mood=Math.min(100,S.mood+12);SND.win();banner('ALLES ERLEDIGT!','Connie ist zufrieden · +$30 · Haussegen +12','#8ee26b');
      say('Connie','Das sieht ja alles ordentlich aus. Ich bin beeindruckt, Schatz.',4200);}
    else{S.mood=Math.max(0,S.mood-12*open);SND.buzz();banner(open+' AUFGABE'+(open>1?'N':'')+' VERPASST','Haussegen −'+(12*open),'#ff7b7b');
      say('Connie',open===total?'Du hast NICHTS gemacht?! Den ganzen Tag?':'Das war nicht alles, Houg. Ich muss mich um alles selbst kümmern.',4600);}
  }
  S.todo=[];
  if(work)connieReturn();
}
function connieLeave(){
  if(connie.away||S.cLeft)return;S.cLeft=true;connieUnsit();
  voiceSay('connie_ciao','connie','Ciao, Schatz! Bis um drei!');
  connie.path=[];connie.plan=[{go:'Fo'},{fn:()=>{connie.away=true;connie.mesh.visible=false;}}];
}
function connieReturn(){
  S.cLeft=false;
  voiceSay('connie_back','connie','Ich bin wieder da!');
  const p=NODES.Fo;connie.node='Fo';connie.x=p[0];connie.z=p[1];connie.y=p[2];connie.away=false;connie.mesh.visible=true;
  connie.path=[];connie.plan=[{go:'K2'}];connie.wait=0;
}
/* ---------- Streiche (ab Kapitel 2, Archie) ---------- */
let prankProps=[];
function prankClear(){for(const p of prankProps)W.remove(p);prankProps=[];}
function prankEnd(ok){
  const pr=S.prank;if(!pr)return;
  prankClear();S.prank=null;S.prankCd=rand(170,260)*(buffOn('glueck')?1.6:1);
  if(pr.type==='fridge')S.fridgeBlock=false;
  if(pr.type==='cable')S.tvBroken=false;
  if(!ok&&pr.type==='bucket')S.hygiene=Math.max(0,S.hygiene-12);
  if(!ok&&pr.type==='salt')S.hunger=Math.max(0,S.hunger-6);
  marker.visible=!!S.task;if(S.task)setupStep();
  if(ok){S.money+=10;S.cnt.pranks++;SND.win();banner('STREICH ABGEWEHRT','+$10');
    hLine('archie',3000);setTimeout(()=>say('Archie',pick(['Ach, wie langweilig. Du merkst auch alles.','Beim nächsten Mal erwische ich dich!']),3800),3200);checkChapter();}
  else{S.mood=Math.max(0,S.mood-8);SND.buzz();banner('STREICH ERFOLGREICH','Haussegen −8','#ff7b7b');
    say('Connie','Houg! Was hat dein Schwiegervater jetzt wieder angestellt?',4200);}
}
const PRANK_TYPES=['cushion','fridge','cable','bucket','spider','shoes','salt','doll'];
function prankItem(kind,x,y,z,ry){const m=makeItem(kind);m.position.set(x,y,z);m.rotation.y=ry||0;W.add(m);prankProps.push(m);return m;}
function startPrank(){
  if(!archie)return;
  const type=pick(PRANK_TYPES);
  const pr={type,time:Math.round(50*(buffOn('glueck')?1.5:1))};S.prank=pr;
  if(type==='cushion'){
    pr.x=-4.6;pr.z=-0.2;pr.node='B';
    prankItem('whoopee',-4.9,0.5,-1.3,0.3);
    pr.text='Archie hat ein Furzkissen auf die Couch gelegt.';
  }else if(type==='fridge'){
    const sp=pick([{x:6.8,z:2.4,node:'KS'},{x:0.8,z:3.8,node:'G'},{x:-3.5,z:2.0,node:'B'},{x:-7.2,z:2.0,node:'A'}]);
    Object.assign(pr,sp);S.fridgeBlock=true;
    prankItem('sandwich',sp.x,0,sp.z,0.5);
    pr.text='Archie hat den Kühlschrank leergeräumt und die Sandwiches versteckt.';
  }else if(type==='cable'){
    pr.x=-4.0;pr.z=2.2;pr.node='B';S.tvBroken=true;
    prankItem('cable',-4.0,0.0,2.45,0.0);
    pr.text='Archie hat das Fernsehkabel gezogen.';
  }else if(type==='bucket'){
    Object.assign(pr,{x:2.0,z:-2.5,node:'DE',label:'Wassereimer aus der Küchentür stellen',hold:0.8});
    prankItem('bucket',1.55,0,-2.5);
    pr.text='Archie hat einen vollen Wassereimer in die Küchentür gestellt.';
  }else if(type==='spider'){
    Object.assign(pr,{x:-0.1,z:3.9,node:'G',label:'Plastikspinne vom Esstisch nehmen',hold:0.6});
    prankItem('spider',-0.1,0.83,1.6,0.8);
    pr.text='Archie hat eine riesige Plastikspinne auf den Esstisch gesetzt.';
  }else if(type==='shoes'){
    Object.assign(pr,{x:-8.0,z:1.4,node:'F',label:'Schnürsenkel lösen (E halten)',hold:2});
    prankItem('shoes',-8.4,0,2.0,0.3);
    pr.text='Archie hat deine Turnschuhe im Flur zusammengebunden.';
  }else if(type==='salt'){
    Object.assign(pr,{x:7.6,z:-0.8,node:'KD',label:'Salz und Zucker zurücktauschen (E halten)',hold:1.5});
    prankItem('saltsugar',8.7,0.95,-0.8,0.0);
    pr.text='Archie hat Salz und Zucker vertauscht.';
  }else{
    Object.assign(pr,{x:-0.1,z:3.9,node:'G',label:'Gruselpuppe vom Stuhl nehmen',hold:0.6});
    prankItem('doll',-0.1,0.51,3.1,Math.PI);
    pr.text='Archie hat eine Gruselpuppe an den Esstisch gesetzt.';
  }
  prankProps.forEach((m,i)=>{if(!m.parent)W.add(m);});
  marker.position.set(pr.x,0,pr.z);marker.visible=true;
  archie.plan=[{go:pr.node},{fn:()=>playOnce(archie.mesh,'kneel',2.6)},{wait:3},{fn:()=>playOnce(archie.mesh,'scratch',3)},{wait:3},{go:'KI'}];
  SND.ding();archTrapLine();
  setTimeout(()=>{if(S.prank===pr)say('Houg',pr.text,4500);},1800);
}

/* ---------- Besuch der Freunde ---------- */
/* Reden bringt +2 Sozialkontakte (je Person höchstens alle 4 s) und lässt die Figur gestikulieren */
function npcTalkGain(n){
  const now=performance.now();
  if(!n.lastTalk||now-n.lastTalk>4000){n.lastTalk=now;S.social=Math.min(100,S.social+2);}
  if(n.mesh.userData.pose)return;
  const u=n.mesh.userData;
  if(u.acts){const k=u.acts.chat?'chat':(u.acts.talk?'talk':(u.acts.drink?'drink':null));if(k)playOnce(n.mesh,k,3);}
}
function peopleInRoom(){
  let n=1;
  for(const m of NPCS)if(!m.away&&m.name!=='Pizzabote'&&flOf(m.y)===P.fl&&Math.hypot(m.x-P.x,m.z-P.z)<7)n++;
  return n;
}
function watchTV(){
  const n=peopleInRoom(),gain=Math.round(2*n*tvMult()*buffMult('tvmoney')*10)/10;
  S.social=Math.min(100,S.social+gain);S.mood=Math.min(100,S.mood+3);
  S.tvCd=buffOn('tvglueck')?0:30;S.cnt.tv++;SND.win();
  banner('FERNSEHABEND','+'+gain+' Sozialkontakte ('+n+' Person'+(n>1?'en':'')+' im Raum)','#a77bf0');
  checkChapter();
}
let friendNPCs=[];
/* Anrufe der Jungs: mit 1/4 Chance, reihum, nur wenn Houg abnimmt kommt der Anrufer vorbei */
const CALLERS=['Dean','Spike','Benny'];S.ring=null;S.callIdx=0;S.ringT=0;let ringBeep=0;
function startCall(){
  const name=CALLERS[S.callIdx++%CALLERS.length];
  S.ring={name};S.ringT=30;ringBeep=0;
  banner('ANRUF','Das Telefon klingelt – '+name+' (Küche)','#7fd1ff');
}
function answerCall(){
  const n=S.ring.name;S.ring=null;SND.click(500);
  say(n,'Hey Houg! Ich komm auf ein Bier vorbei. Football läuft!',3800);
  setTimeout(()=>{if(!S.friends&&S.mode!=='start')friendsArrive(false,n);},2500);
}
function callStep(dt){
  if(S.ring){
    S.ringT-=dt;ringBeep-=dt;
    if(ringBeep<=0){ringBeep=1.8;tone(880,.12,'square',.05);tone(1040,.12,'square',.05,0,.16);tone(880,.12,'square',.05,0,.4);tone(1040,.12,'square',.05,0,.56);}
    if(S.ringT<=0){banner('VERPASSTER ANRUF',S.ring.name+' hat aufgelegt','#ff7b7b');S.ring=null;}
  }
}
const FRIEND_LINES={
  Dean:['Houg, heute Abend gibt es Football. Mach den Fernseher an!','Hast du noch was zu essen? Egal, ich nehm einfach dein Sandwich.','Deine Frau ist die Beste. Sag ihr nicht, dass ich das gesagt hab.'],
  Spike:['Ich wohne nicht bei meiner Mum, ich helfe ihr nur aus.','Ich kann morgen vielleicht nicht kommen, ich muss Mum die Haare schneiden.','Ich sehe täglich seltsame Menschen am Ticketverkauf. Du scheinst dagegen normal.','Hast du noch was zu essen? Egal, ich nehm einfach dein Sandwich.'],
  Benny:['Houg, heute Abend gibt es Football. Mach den Fernseher an!','Hast du noch was zu essen? Egal, ich nehm einfach dein Sandwich.','Deine Frau ist die Beste. Sag ihr nicht, dass ich das gesagt hab.']
};
function friendsArrive(garden,only){
  S.friends=true;S.friendT=garden?75:80;SND.bell();
  if(!garden)S.social=Math.min(100,S.social+20);
  let defs=garden?[['Dean',LOOKS.dean,'GG1'],['Spike',LOOKS.spike,'GG2'],['Benny',LOOKS.benny,'GG3']]:[['Dean',LOOKS.dean,'GSB'],['Spike',LOOKS.spike,'GSA'],['Benny',LOOKS.benny,'GSC']];
  if(only)defs=defs.filter(d=>d[0]===only);
  const B64={Dean:typeof DEAN_B64==='string'?DEAN_B64:'',Spike:typeof SPIKE_B64==='string'?SPIKE_B64:'',Benny:typeof BENNY_B64==='string'?BENNY_B64:''};
  friendNPCs=defs.map(([nm,lk,nd],i)=>{
    const n=makeNPC(nm,lk,'Fo',{speed:2.4,blip:'#7fd1ff',talk:()=>pick(FRIEND_LINES[nm])});
    attachModel(n.mesh,B64[nm],{height:nm==='Dean'?1.82:(nm==='Spike'?1.78:1.74)});
    n.plan=[{wait:i*0.4},{go:nd}];
    if(garden){      // Barbecue: freudiger Auftritt, dann an den Gartentisch setzen (oder daneben stehen und trinken)
      n.plan.push({fn:()=>playOnce(n.mesh,'clap',1.2)},{wait:0.6},{fn:()=>{
        const u=n.mesh.userData,seat=!!(u.acts&&u.acts.sitdrink),a=[0,2.1,4.2][['Dean','Spike','Benny'].indexOf(nm)%3],r=seat?1.2:1.95;
        n.x=13.6+Math.cos(a)*r;n.z=-1.2+Math.sin(a)*r;n.y=0;
        n.mesh.rotation.y=Math.atan2(13.6-n.x,-1.2-n.z);
        if(seat)u.pose='sitdrink';
      }});
      for(let k=0;k<8;k++)n.plan.push({wait:rand(9,15)},{fn:()=>{const u=n.mesh.userData;if(u.acts&&u.acts.talk&&!u.pose)playOnce(n.mesh,'talk',3.5);}});
    }
    else{    // Garage: alle drei setzen sich aufs Sofa
      n.plan.push({fn:()=>{n.mesh.rotation.y=Math.PI;const u=n.mesh.userData;if(u.acts&&u.acts.sitdrink)u.pose='sitdrink';}});
      for(let k=0;k<6;k++)n.plan.push({wait:rand(9,15)},{fn:()=>{const u=n.mesh.userData;if(u.acts&&u.acts.talk&&!u.pose)playOnce(n.mesh,'talk',3.5);}});
    }
    return n;});
  say(only||'Dean',garden?'Houg! Barbecue im Garten – wo ist das Bier?':(only?'Ich bin da, Houg! Ab in die Garage, Fernsehen!':'Houg! Wir sind da. Football-Abend in der Garage, wie versprochen!'),4500);
}
function friendsLeave(){
  S.friends=false;S.bbq=false;
  for(const n of friendNPCs){n.roam=null;n.mesh.userData.pose=null;n.plan=[{go:'Fo'},{fn:()=>removeNPC(n)}];}
  friendNPCs=[];S.friendCd=rand(150,200);
  say('Dean','Bis nächste Woche, Houg!',3000);
}

/* ---------- Kapitel ---------- */
const CHAPTERS=[
 {n:1,title:'Ein ganz normaler Montag',sub:'Archie ist noch nicht da. Der Keller bleibt zugenagelt.',
  goals:[{k:'tasks',need:4,t:'Aufgaben für Connie'},{k:'tv',need:2,t:'Fernsehabende'}]},
 {n:2,title:'Der Mitbewohner',sub:'Archie zieht in den Keller und hat Spaß an Streichen.',
  goals:[{k:'tasks',need:4,t:'Aufgaben für Connie'},{k:'pranks',need:3,t:'Streiche abgewehrt'}]},
 {n:3,title:'Arbeit bei YPS',sub:'Pakete ausliefern, Chef Mahler ertragen.',goals:[{k:'parcels',need:20,t:'Pakete zugestellt'}]}
];
function checkChapter(){
  const ch=CHAPTERS[S.chapter-1];
  if(!ch.goals.length||S.mode!=='play')return;
  if(ch.goals.every(g=>S.cnt[g.k]>=g.need))setTimeout(nextChapter,2200);
}
function nextChapter(){
  if(S.chapter>=CHAPTERS.length)return;
  S.chapter++;S.cnt={tasks:0,tv:0,pranks:0,parcels:0};
  const ch=CHAPTERS[S.chapter-1];
  $('cardK').textContent='KAPITEL '+ch.n;$('cardT').textContent=ch.title;
  S.mode='card';$('card').hidden=false;SND.win();
  setTimeout(()=>{$('card').hidden=true;S.mode='play';chapterStart(ch.n);},3400);
}
function chapterStart(n,quiet){
  if(n===2){
    kellerBlock.on=false;kellerDoor.visible=false;
    archie=makeNPC('Archie',LOOKS.archie,'KI',{roam:['KI','KB','KC'],blip:'#b9e07a',talk:()=>{playOnce(archie.mesh,'scratch',3);return pick([
      'In meinem Alter braucht man keinen Platz, nur einen guten Sessel.',
      'Hast du irgendwo meine Zahnprothese gesehen? Nur ein Scherz.',
      'Ich tu doch nichts. Ich bin ein alter Mann.']);}});
    attachModel(archie.mesh,typeof ARCHIE_B64==='string'?ARCHIE_B64:'',{height:1.72});
    archie.speed=2.0;S.archieHere=true;S.prankCd=120;
    if(!quiet)SND.bell();
    if(!quiet)sayQueue([['Connie','Houg, mein Vater zieht heute bei uns ein. In den Keller.',4200,'connie_dadmovesin'],
              ['Archie','Hallo, mein Junge. Ich hoffe, die Wände sind dick.',4000,'archie_walls'],
              ['Houg','Ich ahne nichts Gutes.',3200]]);
  }
  if(n===3)workStart();
}

/* ---------- Interaktionen ---------- */
function eatSandwich(){
  if(S.fridgeBlock){say('Houg','Leer! Archie war hier.',2600);SND.buzz();return;}
  if(S.stock<=0){say('Houg','Der Kühlschrank ist leer. Einkäufe einräumen oder Pizza bestellen.',3400);SND.buzz();return;}
  S.stock--;S.urge=Math.min(100,S.urge+6);S.hunger=Math.min(100,S.hunger+sandwichGain());SND.eat();playDrink(player,2.4);
  hLine('sandwich',2400);
}
function orderPizza(){
  if(S.pizzaT>0||S.pizzaReady){say('Houg','Die Pizza ist schon unterwegs.',2400);return;}
  if(S.money<pizzaPrice()){say('Houg','Zu wenig Geld für Pizza.',2400);SND.buzz();return;}
  S.money-=pizzaPrice();S.pizzaT=40;SND.click(600);say('Houg','Eine große Pizza bitte. In 40 Sekunden? Super.',3200);
  banner('PIZZA BESTELLT','-$'+pizzaPrice()+' · kommt in 40 s an die Haustür','#ff9d3d');
}
let pizzaProp=null;
function pizzaArrive(){S.pizzaReady=true;SND.bell();say('Pizzabote','Lieferung für Heffron!',3500);
  pizzaProp=box(W,0.7,0.1,0.7,0xe8d3a0,-7.5,0.04,0.9);marker.position.set(-7.5,0,0.9);}
function sleepNow(){
  if(S.minutes<20*60){say('Houg','Noch nicht müde. Ab 20:00 Uhr.',2600);return;}
  if(S.todo.length&&S.todo.some(t=>!t.done)){say('Houg','Erst die Aufgaben von Connie erledigen.',2800);SND.buzz();return;}
  hLine('bed');endDay(true);
}
function endDay(bed){startDayCard(bed);}

const STATIC_INTER=[
 {id:'fridge',x:3.55,z:-4.6,r:1.7,prio:3,blip:'#ff9d3d',
  label:()=>S.fridgeBlock?'Kühlschrank (leergeräumt!)':(S.stock>0?'Sandwich aus dem Kühlschrank (gratis, +'+sandwichGain()+' Hunger) · Vorrat '+S.stock+'/'+maxStock():'Kühlschrank leer – Einkäufe einräumen oder Pizza bestellen'),
  hold:()=>(!S.fridgeBlock&&S.stock>0)?1.1:0,use:eatSandwich},
 {id:'couch',x:-4.6,z:0.1,r:2.4,prio:3,blip:'#58b4ff',
  label:()=>S.tvBroken?'Fernseher (Kabel gezogen!)':(S.tvCd>0?'Fernbedienung nicht gefunden … ('+Math.ceil(S.tvCd)+'s)':(S.mood<=10?'Fernsehen verboten (Haussegen)':'Fernsehen (E halten) · +2 Sozialkontakte pro Person im Raum')),
  hold:()=>(S.tvBroken||S.tvCd>0||S.mood<=10)?0:6,
  use:()=>{
    if(S.tvBroken){say('Houg','Bild ist schwarz. Das Kabel hängt irgendwo.',2800);SND.buzz();return;}
    if(S.tvCd>0)return;
    if(S.mood<=10){say('Connie','Kein Fernsehen, bevor hier alles in Ordnung ist!',3400);SND.buzz();return;}
    hLine('tv');tvSitStart();}},
 {id:'phone',x:2.7,z:-1.1,r:1.5,prio:3,blip:'#8ee26b',label:()=>S.ring?'Telefon klingelt: '+S.ring.name+' – Anruf annehmen':'Telefon',use:()=>S.ring?answerCall():openPhone()},
 {id:'laptop',x:7.55,z:3.45,r:1.7,fl:1,prio:3,blip:'#8ee26b',label:()=>'Laptop: Verbesserungen & Upgrades kaufen',use:()=>{hLine('laptop');openLaptop();}},
 {id:'bed',x:-5.2,z:1.1,r:2.2,fl:1,prio:3,label:()=>S.minutes>=20*60?'Schlafen (Tag beenden)':'Bett (Schlafen ab 20:00)',use:sleepNow},
 {id:'keller',x:4.95,z:-6.7,r:1.6,prio:1,label:()=>kellerBlock.on?'Zugenagelte Kellertür':null,
  use:()=>say('Connie','Da unten steht nur altes Zeug. Lass die Tür zu.',3200)}
];
function gatherInter(){
  const L=STATIC_INTER.slice();
  if(S.task&&S.task.def.steps[S.task.step]){const st=S.task.def.steps[S.task.step];
    L.push({id:'task',quest:true,x:st.x,z:st.z,fl:st.fl||0,r:1.5,prio:4,blip:'#f5c542',label:()=>st.label,hold:()=>st.hold||0,use:()=>st.mini?dishOpen():advanceTask()});}
  if(S.pizzaReady)L.push({id:'pizza',x:-7.5,z:0.9,r:1.6,prio:4,blip:'#f5c542',label:()=>'Pizza nehmen (+60 Hunger, +10 Haussegen)',use:()=>{
    S.pizzaReady=false;if(pizzaProp){W.remove(pizzaProp);pizzaProp=null;}S.urge=Math.min(100,S.urge+10);S.hunger=Math.min(100,S.hunger+60);S.mood=Math.min(100,S.mood+10);SND.eat();playDrink(player,2.4);
    marker.visible=!!S.task;if(S.task)setupStep();hLine('pizza');}});
  const pr=S.prank;
  if(pr){
    if(pr.type==='cushion')L.push({id:'p1',x:pr.x,z:pr.z,r:2.3,prio:6,blip:'#ff5aa5',label:()=>'Furzkissen entfernen',use:()=>prankEnd(true)});
    if(pr.type==='fridge')L.push({id:'p2',x:pr.x,z:pr.z,r:1.6,prio:6,blip:'#ff5aa5',label:()=>'Versteckte Sandwiches finden',use:()=>{S.stock=Math.min(maxStock(),S.stock+2);prankEnd(true);}});
    if(pr.type==='cable')L.push({id:'p3',x:pr.x,z:pr.z,r:2.2,prio:6,blip:'#ff5aa5',label:()=>'Fernsehkabel einstecken',hold:()=>1.5,use:()=>prankEnd(true)});
    if(pr.label)L.push({id:'p-'+pr.type,x:pr.x,z:pr.z,r:2.0,prio:6,blip:'#ff5aa5',label:()=>pr.label,hold:()=>pr.hold||0,use:()=>prankEnd(true)});
  }
  L.push(...workInter());
  for(const n of NPCS)if(n.talk&&n.name!=='Pizzabote'&&!n.away)
    L.push({id:'npc-'+n.name,x:n.x,z:n.z,fl:flOf(n.y),r:1.9,prio:2,blip:n.blip,label:()=>'Mit '+n.name+' reden',use:()=>{const tx=n.talk();say(n.name,tx,4200);npcHey(n.name.toLowerCase());npcTalkGain(n);}});
  return L;
}
