/* ---------- Minispiel: Geschirr spülen und Spülmaschine einräumen ---------- */
const DISH={on:false,items:[],time:0,drag:null,off:[0,0],last:[0,0],msg:'',msgT:0,ready:false,t:0};
const dc=$('dishc'),dctx=dc.getContext('2d');
const BASIN={x:24,y:160,w:384,h:236}, RACK={x:440,y:96,w:178,h:300}, STARTB={x:456,y:30,w:146,h:46};
const SLOTS=[[490,160],[580,160],[490,240],[580,240],[535,330]];
const DTYPES=[['plate',38],['plate',38],['cup',30],['pan',42],['bowl',34]];
function dishNew(){
  DISH.items=DTYPES.map(([type,r],i)=>({type,r,x:62+i*84,y:84,hx:62+i*84,hy:84,dirt:1,racked:false,
    blots:[[rand(-.5,.5),rand(-.5,.5),rand(.25,.4)],[rand(-.5,.5),rand(-.5,.5),rand(.2,.35)],[rand(-.4,.4),rand(-.4,.4),rand(.2,.3)]]}));
  DISH.drag=null;DISH.ready=false;DISH.time=50;DISH.t=0;dishMsg('Alles Schmutzige ins Becken!');
}
function dishMsg(s){DISH.msg=s;DISH.msgT=3;$('dishmsg').textContent=s;}
function dishOpen(){
  audioInit();S.mode='dish';$('dish').hidden=false;DISH.on=true;dishNew();SND.click(260);
}
function dishClose(ok){
  DISH.on=false;$('dish').hidden=true;S.mode='play';
  if(ok){SND.win();advanceTask();}
  else{say('Houg','Das Geschirr steht noch da. Später.',2600);}
}
const inR=(x,y,r)=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h;
function dishDown(x,y){
  if(!DISH.on)return;
  if(inR(x,y,STARTB)){
    if(DISH.ready)dishClose(true);else dishMsg('Erst alle fünf Teile einräumen.');
    return;
  }
  for(let i=DISH.items.length-1;i>=0;i--){
    const it=DISH.items[i];
    if(!it.racked&&Math.hypot(x-it.x,y-it.y)<=it.r+6){
      DISH.drag=it;DISH.off=[it.x-x,it.y-y];DISH.last=[x,y];
      DISH.items.splice(i,1);DISH.items.push(it);SND.click(500);return;
    }
  }
}
function dishMove(x,y){
  const it=DISH.drag;if(!it)return;
  const d=Math.hypot(x-DISH.last[0],y-DISH.last[1]);DISH.last=[x,y];
  it.x=clamp(x+DISH.off[0],it.r,640-it.r);it.y=clamp(y+DISH.off[1],it.r,420-it.r);
  if(inR(it.x,it.y,BASIN)&&it.dirt>0){
    it.dirt=Math.max(0,it.dirt-d/260);
    if(it.dirt===0){SND.click(900);dishMsg('Sauber! Ab in die Spülmaschine.');}
  }
}
function dishUp(x,y){
  const it=DISH.drag;if(!it)return;DISH.drag=null;
  if(inR(it.x,it.y,RACK)){
    if(it.dirt>0.03){dishMsg('Noch schmutzig! Erst im Becken schrubben.');SND.buzz();it.x=it.hx;it.y=it.hy;return;}
    const used=DISH.items.filter(o=>o.racked).map(o=>o.slot);
    const free=SLOTS.map((s,i)=>i).filter(i=>!used.includes(i));
    if(free.length){
      free.sort((a,b)=>Math.hypot(SLOTS[a][0]-it.x,SLOTS[a][1]-it.y)-Math.hypot(SLOTS[b][0]-it.x,SLOTS[b][1]-it.y));
      it.slot=free[0];it.x=SLOTS[it.slot][0];it.y=SLOTS[it.slot][1];it.racked=true;SND.click(380);
      const n=DISH.items.filter(o=>o.racked).length;$('dishN').textContent=n+'/5';
      if(n===5){DISH.ready=true;dishMsg('Alles drin! Jetzt START drücken.');}
    }
  }
}
function dishDrawItem(c,it,lift){
  const r=it.r*(lift?1.08:1);
  c.save();c.translate(it.x,it.y);
  if(lift){c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(5,9,r,r*.85,0,0,7);c.fill();}
  if(it.type==='plate'){C_(c,0,0,r,'#f4f4ef');C_(c,0,0,r*.68,'#e6e6de');}
  else if(it.type==='bowl'){C_(c,0,0,r,'#f0d4a0');C_(c,0,0,r*.7,'#e0b878');}
  else if(it.type==='cup'){R_(c,-r*.7,-r*.7,r*1.4,r*1.4,'#e3ecff');c.strokeStyle='#cfd8ee';c.lineWidth=5;c.beginPath();c.arc(r*.85,0,r*.4,-1.5,1.5);c.stroke();R_(c,-r*.7,-r*.7,r*1.4,r*.25,'#bcc9ea');}
  else{C_(c,0,0,r,'#3a3a3e');C_(c,0,0,r*.78,'#4a4a50');R_(c,r*.9,-6,r*1.1,12,'#2a2a2e');}
  if(it.dirt>0.02){for(const b of it.blots)C_(c,b[0]*r,b[1]*r,b[2]*r*(.4+it.dirt*.6),'rgba(110,70,30,'+(0.25+it.dirt*.65)+')');}
  else{C_(c,-r*.3,-r*.3,3,'#fff');C_(c,r*.25,r*.1,2,'#fff');}
  c.restore();
}
function dishDraw(){
  const c=dctx,t=DISH.t;
  R_(c,0,0,640,420,'#c79f6b');
  R_(c,0,0,640,150,'#d8b887');TXT(c,'ABLAGE',14,28,22,'rgba(60,40,20,.65)');
  c.fillStyle='#7f95a6';c.beginPath();c.roundRect?c.roundRect(BASIN.x,BASIN.y,BASIN.w,BASIN.h,16):c.rect(BASIN.x,BASIN.y,BASIN.w,BASIN.h);c.fill();
  R_(c,BASIN.x+10,BASIN.y+10,BASIN.w-20,BASIN.h-20,'#9bc6dd');
  c.strokeStyle='rgba(255,255,255,.45)';c.lineWidth=2;
  for(let i=0;i<4;i++){c.beginPath();c.moveTo(BASIN.x+20,BASIN.y+50+i*46);for(let x=0;x<=344;x+=12)c.lineTo(BASIN.x+20+x,BASIN.y+50+i*46+Math.sin(t*2+x/20+i)*4);c.stroke();}
  TXT(c,'SPÜLBECKEN: HIER SCHRUBBEN',BASIN.x+BASIN.w/2,BASIN.y+BASIN.h-14,20,'rgba(20,50,80,.7)','center');
  R_(c,RACK.x,RACK.y,RACK.w,RACK.h,'#cfd4d8');R_(c,RACK.x+8,RACK.y+8,RACK.w-16,RACK.h-16,'#98a1ab');
  c.strokeStyle='#6c7580';c.lineWidth=3;
  for(let i=0;i<7;i++){c.beginPath();c.moveTo(RACK.x+14,RACK.y+22+i*40);c.lineTo(RACK.x+RACK.w-14,RACK.y+22+i*40);c.stroke();}
  for(const s of SLOTS){c.strokeStyle='rgba(255,255,255,.6)';c.setLineDash([6,6]);c.beginPath();c.arc(s[0],s[1],34,0,7);c.stroke();c.setLineDash([]);}
  TXT(c,'SPÜLMASCHINE',RACK.x+RACK.w/2,RACK.y-8,20,'#fff','center');
  R_(c,STARTB.x,STARTB.y,STARTB.w,STARTB.h,DISH.ready?'#7bd36a':'#6d7580');
  TXT(c,'START',STARTB.x+STARTB.w/2,STARTB.y+32,28,DISH.ready?'#10260a':'#aab2bb','center');
  for(const it of DISH.items)if(it!==DISH.drag)dishDrawItem(c,it,false);
  if(DISH.drag)dishDrawItem(c,DISH.drag,true);
}
function dishUpdate(dt){
  DISH.t+=dt;DISH.time-=dt;
  if(DISH.msgT>0){DISH.msgT-=dt;if(DISH.msgT<=0)$('dishmsg').textContent='';}
  $('dishT').textContent=Math.max(0,Math.ceil(DISH.time));
  if(DISH.time<=0){dishMsg('Zu langsam!');SND.buzz();dishClose(false);return;}
  dishDraw();
}
function dishPt(e){const r=dc.getBoundingClientRect();return [(e.clientX-r.left)*dc.width/r.width,(e.clientY-r.top)*dc.height/r.height];}
dc.addEventListener('pointerdown',e=>{try{dc.setPointerCapture(e.pointerId);}catch(_){}const p=dishPt(e);dishDown(p[0],p[1]);});
dc.addEventListener('pointermove',e=>{const p=dishPt(e);dishMove(p[0],p[1]);});
dc.addEventListener('pointerup',e=>{const p=dishPt(e);dishUp(p[0],p[1]);});
$('dishX').addEventListener('click',()=>dishClose(false));
