/* ---------- Fernseher: Kanalsurfen ---------- */
function P_(c,pts,col){c.fillStyle=col;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();}
function R_(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(x,y,w,h);}
function C_(c,x,y,r,col){c.fillStyle=col;c.beginPath();c.arc(x,y,Math.max(0.5,r),0,7);c.fill();}
function TXT(c,s,x,y,size,col,align='left'){c.font='700 '+size+'px "Barlow Condensed",Arial,sans-serif';c.fillStyle=col;c.textAlign=align;c.fillText(s,x,y);}

const GEN=[
 {id:'sport',name:'Football-Spiel',logo:'SPORT LIVE',draw(c,t,w,h){
   R_(c,0,0,w,h,'#2f8f3e');for(let i=0;i<6;i++)R_(c,i*w/6,0,w/12,h,'#2a8438');
   c.strokeStyle='#fff';c.lineWidth=h*.012;c.strokeRect(w*.06,h*.14,w*.88,h*.72);
   c.beginPath();c.moveTo(w/2,h*.14);c.lineTo(w/2,h*.86);c.stroke();
   const bx=w/2+Math.sin(t*1.3)*w*.28,by=h/2+Math.sin(t*2.1)*h*.18;
   for(let i=0;i<8;i++)C_(c,bx+Math.sin(t*1.1+i*2)*w*.12+(i%2?w*.09:-w*.09),by+Math.cos(t*.9+i*1.7)*h*.14,h*.032,i%2?'#e33':'#36e');
   C_(c,bx,by,h*.02,'#fff');}},
 {id:'koch',name:'Kochsendung',logo:'KOCH-STUDIO',draw(c,t,w,h){
   R_(c,0,0,w,h,'#f3d9a8');R_(c,0,h*.7,w,h*.3,'#a56a3b');
   P_(c,[[w*.5,h*.5],[w*.74,h*.5],[w*.7,h*.74],[w*.54,h*.74]],'#777');
   for(let i=0;i<3;i++)C_(c,w*.57+i*w*.05+Math.sin(t*2+i)*5,h*.46-((t*28+i*18)%52),h*.035,'rgba(255,255,255,.7)');
   R_(c,w*.17,h*.5,h*.2,h*.22,'#fff');C_(c,w*.17+h*.1,h*.42,h*.075,'#f2c9a0');R_(c,w*.17+h*.02,h*.28,h*.16,h*.1,'#fff');}},
 {id:'news',name:'Nachrichten',logo:'NEWS 24',draw(c,t,w,h){
   R_(c,0,0,w,h,'#1d3f7a');R_(c,w*.62,h*.12,w*.28,h*.24,'#2e6fb8');C_(c,w*.7,h*.24,h*.05,'#7fd16a');
   P_(c,[[w*.38,h*.7],[w*.62,h*.7],[w*.58,h*.5],[w*.42,h*.5]],'#222');C_(c,w*.5,h*.4,h*.085,'#f0c8a0');
   R_(c,w*.1,h*.68,w*.8,h*.2,'#c9ced6');R_(c,0,h*.9,w,h*.1,'#c22');
   TXT(c,'+++ EILMELDUNG: PARKPLATZ IN REGO PARK ENDLICH FREI +++ ',w-((t*70)%(w*2.2)),h*.975,h*.07,'#fff');}},
 {id:'ring',name:'Wrestling',logo:'RING FREI',draw(c,t,w,h){
   R_(c,0,0,w,h,'#2b1a1a');R_(c,0,h*.72,w,h*.28,'#6b1f1f');
   for(let i=0;i<3;i++)R_(c,w*.05,h*(.38+i*.12),w*.9,h*.018,'#e8e8e8');
   const a=Math.sin(t*3)*w*.05;
   R_(c,w*.33+a,h*.42,h*.16,h*.3,'#3a7bd5');C_(c,w*.33+a+h*.08,h*.37,h*.065,'#f0c8a0');
   R_(c,w*.6-a,h*.42,h*.16,h*.3,'#d53a3a');C_(c,w*.6-a+h*.08,h*.37,h*.065,'#b98860');}},
 {id:'toon',name:'Zeichentrickfilm',logo:'TOON TV',draw(c,t,w,h){
   R_(c,0,0,w,h,'#8fd4ff');C_(c,w*.85,h*.18,h*.09,'#ffe14d');C_(c,w*.3,h*1.05,h*.5,'#6fcf5a');C_(c,w*.8,h*1.1,h*.45,'#59bf4a');
   const y=h*.62-Math.abs(Math.sin(t*3))*h*.3,x=w*.5+Math.sin(t*.8)*w*.2;
   C_(c,x,y,h*.12,'#ffd23f');C_(c,x-h*.04,y-h*.02,h*.025,'#fff');C_(c,x+h*.04,y-h*.02,h*.025,'#fff');
   C_(c,x-h*.04,y-h*.02,h*.01,'#000');C_(c,x+h*.04,y-h*.02,h*.01,'#000');}},
 {id:'shop',name:'Teleshopping',logo:'SHOP-TV',draw(c,t,w,h){
   R_(c,0,0,w,h,'#5b2a86');R_(c,w*.4,h*.3,w*.2,h*.36,'#bfe3f2');R_(c,w*.37,h*.66,w*.26,h*.1,'#222');R_(c,w*.46,h*.22,w*.08,h*.08,'#444');
   const s=1+Math.sin(t*6)*.08,cx=w*.8,cy=h*.3,pts=[];
   for(let i=0;i<10;i++){const r=(i%2?h*.07:h*.14)*s,an=i*Math.PI/5-Math.PI/2;pts.push([cx+Math.cos(an)*r,cy+Math.sin(an)*r]);}
   P_(c,pts,'#e63946');TXT(c,'19,99',cx,cy+h*.025,h*.07,'#fff','center');
   if(Math.floor(t*2)%2)TXT(c,'NUR HEUTE!',w*.2,h*.25,h*.09,'#ffe14d','center');}},
 {id:'quiz',name:'Quizshow',logo:'QUIZ-ARENA',draw(c,t,w,h){
   R_(c,0,0,w,h,'#0e2a6b');P_(c,[[w*.4,0],[w*.6,0],[w*.85,h],[w*.15,h]],'rgba(255,255,255,.08)');
   TXT(c,'?',w*.5,h*.5,h*.45,'#ffe14d','center');
   const cols=['#e63946','#3a86ff','#2ec4b6','#f4a261'],on=Math.floor(t*1.5)%4;
   for(let i=0;i<4;i++)R_(c,w*(.08+i*.22),h*.7,w*.2,h*.14,i===on?'#fff':cols[i]);}},
 {id:'wetter',name:'Wetterbericht',logo:'WETTER',draw(c,t,w,h){
   R_(c,0,0,w,h,'#5fb3e6');P_(c,[[w*.15,h*.6],[w*.3,h*.3],[w*.55,h*.25],[w*.8,h*.4],[w*.7,h*.75],[w*.4,h*.8]],'#6fbf73');
   C_(c,w*.7,h*.25,h*.09,'#ffe14d');for(let i=0;i<8;i++){const an=i*Math.PI/4+t;R_(c,w*.7+Math.cos(an)*h*.13-2,h*.25+Math.sin(an)*h*.13-2,5,5,'#ffe14d');}
   C_(c,w*.3,h*.35,h*.06,'#fff');C_(c,w*.36,h*.33,h*.07,'#fff');C_(c,w*.42,h*.36,h*.055,'#fff');
   TXT(c,'18°',w*.5,h*.72,h*.2,'#fff','center');}}
];
function drawChannel(c,ch,t,w,h,num){
  if(ch.stat>0){for(let i=0;i<260;i++){const g=Math.floor(Math.random()*255);R_(c,Math.random()*w,Math.random()*h,w*.04,h*.03,'rgb('+g+','+g+','+g+')');}return;}
  if(ch.ad>0){
    for(let i=0;i<12;i++)R_(c,i*w/12,0,w/12,h,i%2?'#ffd400':'#ff3b7a');
    R_(c,w*.1,h*.35,w*.8,h*.3,'#111');TXT(c,'WERBUNG',w/2,h*.56,h*.18,'#fff','center');
  }else{
    const g=GEN[ch.g];g.draw(c,t,w,h);
    R_(c,w*.03,h*.04,w*.3,h*.1,'rgba(0,0,0,.65)');TXT(c,g.logo,w*.045,h*.115,h*.07,'#fff');
  }
  if(num){TXT(c,'CH '+(num),w*.97,h*.1,h*.08,'#7dff7d','right');}
}

const TV={on:false,chans:[],ch:0,round:0,wins:0,target:0,time:0,chg:0,adT:0,between:0,msg:'',msgT:0,t:0};
const tvc=$('tvc'),tctx=tvc.getContext('2d');
const RND_TIME=[45,40,35],NCH=27;
function tvNewRound(){
  TV.target=Math.floor(Math.random()*GEN.length);TV.found=0;
  TV.chans=[];for(let i=0;i<NCH;i++){let g=Math.floor(Math.random()*GEN.length);if(g===TV.target)g=(g+1)%GEN.length;TV.chans.push({g,ad:0,stat:0});}
  const a=Math.floor(Math.random()*NCH);let b=(a+7+Math.floor(Math.random()*(NCH-14)))%NCH;
  TV.chans[a].g=TV.target;TV.chans[b].g=TV.target;
  TV.time=RND_TIME[TV.round];TV.between=0;TV.chg=1.5;TV.adT=1.2;
  $('tvR').textContent=(TV.round+1)+'/3';$('tvT').textContent=GEN[TV.target].name;$('tvF').textContent='0/2';
  tvMsg('Finde 2 Kanäle: '+GEN[TV.target].name);
}
function tvMsg(s){TV.msg=s;TV.msgT=2.2;$('tvmsg').textContent=s;}
function tvOpen(){
  audioInit();S.mode='tv';$('tv').hidden=false;
  TV.on=true;TV.round=0;TV.wins=0;TV.ch=0;TV.t=0;tvNewRound();SND.click(300);
}
function tvChannel(d){
  if(!TV.on||TV.between>0)return;
  TV.ch=((TV.ch+d)%NCH+NCH)%NCH;TV.chans[TV.ch].stat=0.18;SND.click(300+(TV.ch%9)*40);
}
function tvLock(){
  if(!TV.on||TV.between>0)return;
  const c=TV.chans[TV.ch];
  if(c.ad>0){TV.time-=3;tvMsg('Das ist Werbung!  −3 s');SND.buzz();return;}
  if(c.g===TV.target){
    TV.wins++;TV.found++;SND.win();$('tvF').textContent=TV.found+'/2';
    c.g=(TV.target+1+Math.floor(Math.random()*(GEN.length-1)))%GEN.length;if(c.g===TV.target)c.g=(c.g+1)%GEN.length;c.stat=0.5;
    if(TV.found>=2){tvMsg('Beide gefunden!');TV.between=1.4;}else tvMsg('Richtig! Noch einer …');
  }else{TV.time-=4;tvMsg('Falsch: '+GEN[c.g].name+'  −4 s');SND.buzz();}
}
function tvRoundEnd(){
  TV.round++;
  if(TV.round>=3)tvClose(false);else tvNewRound();
}
function tvClose(abort){
  TV.on=false;$('tv').hidden=true;S.mode='play';S.tvCd=buffOn('tvglueck')?0:30;
  if(abort&&TV.wins===0){return;}
  let pay=TV.wins*5+(TV.wins===6?15:0);if(S.friends)pay*=2;pay=Math.round(pay*tvMult()*buffMult('tvmoney'));
  if(pay>0){S.money+=pay;S.mood=Math.min(100,S.mood+3);banner('FERNSEHABEND','+$'+pay+'  ('+TV.wins+'/6 gefunden)');}
  if(TV.wins>=3){S.cnt.tv++;checkChapter();}
}
function tvUpdate(dt){
  TV.t+=dt;
  if(TV.msgT>0){TV.msgT-=dt;if(TV.msgT<=0)$('tvmsg').textContent='';}
  if(TV.between>0){TV.between-=dt;if(TV.between<=0)tvRoundEnd();}
  else{
    TV.time-=dt;
    if(TV.time<=0){tvMsg('Zeit abgelaufen!');SND.buzz();TV.time=0;TV.between=1.2;}
    TV.chg-=dt;
    if(TV.chg<=0){
      TV.chg=rand(0.9,1.8);const i=Math.floor(Math.random()*NCH),old=TV.chans[i].g;
      TV.chans[i].g=Math.floor(Math.random()*GEN.length);
      if(TV.chans.filter(c=>c.g===TV.target).length<2-TV.found)TV.chans[i].g=old;
    }
    TV.adT-=dt;
    if(TV.adT<=0){TV.adT=rand(1.5,2.8);const c=pick(TV.chans);if(c.ad<=0)c.ad=rand(1.4,2.4);}
  }
  for(const c of TV.chans){if(c.ad>0)c.ad-=dt;if(c.stat>0)c.stat-=dt;}
  $('tvTime').textContent=Math.ceil(TV.time);
  drawChannel(tctx,TV.chans[TV.ch],TV.t,480,300,(TV.ch+1)+'/'+NCH);
}
$('chUp').addEventListener('click',()=>tvChannel(1));
$('chDn').addEventListener('click',()=>tvChannel(-1));
$('chOk').addEventListener('click',tvLock);
$('chUp5').addEventListener('click',()=>tvChannel(5));
$('chDn5').addEventListener('click',()=>tvChannel(-5));
tvc.addEventListener('wheel',e=>{e.preventDefault();tvChannel((e.deltaY>0?1:-1)*(e.shiftKey?5:1));},{passive:false});
tvc.addEventListener('click',tvLock);

/* kleines Bild im 3D-Fernseher */
const tv3=tvTex.getContext('2d');const ambient={g:0,ad:0,stat:0};let ambT=0,ambS=0,ambBlack=false;
function updateAmbientTV(dt,near){
  ambT+=dt;ambS-=dt;
  if(ambS<=0){ambS=rand(6,10);ambient.g=Math.floor(Math.random()*GEN.length);}
  if(!near||S.tvBroken){if(!ambBlack){ambBlack=true;tv3.fillStyle='#050505';tv3.fillRect(0,0,256,160);tvTexture.needsUpdate=true;}return;}
  ambBlack=false;
  if(Math.floor(ambT*8)!==Math.floor((ambT-dt)*8)){drawChannel(tv3,ambient,ambT,256,160,0);tvTexture.needsUpdate=true;}
}
