/* ---------- Zustand, UI-Helfer, Spieler, NPCs ---------- */
const S={
  mode:'start',            // start | play | tv | pause | card | faint | end
  chapter:1, day:1, minutes:6*60,
  money:25, health:100, hunger:80, mood:70, stock:4,
  cnt:{tasks:0,tv:0,pranks:0},
  carry:null, task:null, taskCd:25, lastTask:null,
  prank:null, prankCd:40, fridgeBlock:false, tvBroken:false,
  pizzaT:0, pizzaReady:false, tvCd:0,
  friends:false, friendT:0, friendCd:110, friendDoneCh:{},
  archieHere:false,
  upg:{fridge:0,tv:0},deco:{},
  todo:[],ti:0,buffs:[],assigned:false,evaluated:false,tBack:900
};
const maxStock=()=>[8,12,18][S.upg.fridge];
const sandwichGain=()=>[30,36,44][S.upg.fridge];
const tvMult=()=>[1,1.5,2][S.upg.tv];
const decoCount=()=>Object.keys(S.deco).length;
const COL={connie:'#ff7eb3',archie:'#b9e07a',dean:'#7fd1ff',spike:'#ffb36b',benny:'#e0b0ff',houg:'#ffffff'};

/* Untertitel und Banner */
let subTimer=0,talkTimer=0;
const TALKERS=['connie','archie','dean','spike','benny'];
function say(name,text,ms=4800){
  const k=name.toLowerCase(),c=COL[k]||'#fff';
  if(k==='connie'){try{if(connie&&connie.mesh&&!connie.away&&!connie.mesh.userData.pose){const ca=connie.mesh.userData.acts;playOnce(connie.mesh,ca&&ca.chat?'chat':'talk',Math.min(4,ms/1000));}}catch(e){}}
  if(TALKERS.includes(k)){      // Dialoge von Connie, Archie und den Freunden: mittig oben
    const t=$('talk');t.style.setProperty('--tc',c);$('talkN').textContent=name;$('talkT').textContent=text;t.classList.add('show');
    clearTimeout(talkTimer);talkTimer=setTimeout(()=>t.classList.remove('show'),ms);return;
  }
  $('sub').innerHTML='<span style="color:'+c+'">'+name+':</span> '+text;
  clearTimeout(subTimer);subTimer=setTimeout(()=>{$('sub').innerHTML='';},ms);
}
/* Dialogfolge. Eintrag: [Name, Text, ms, optional MP3-Name]. Mit MP3 läuft die nächste Zeile erst, wenn sie zu Ende ist; fehlt die Datei, zählt die Zeit. */
function sayQueue(list){
  let i=0;
  const next=()=>{
    if(i>=list.length||S.mode==='start')return;
    const [n,tx,ms,clip]=list[i++],dur=ms||4200;let adv=false;
    const go=d=>{if(adv)return;adv=true;setTimeout(next,d);};
    say(n,tx,dur);
    const a=clip?clipOnly(clip):null;
    if(!a){go(dur+300);return;}
    a.addEventListener('loadedmetadata',()=>{if(a.duration&&isFinite(a.duration))say(n,tx,Math.max(dur,a.duration*1000+400));});
    a.addEventListener('ended',()=>go(500));
    a.addEventListener('error',()=>go(dur+300));
    setTimeout(()=>go(0),40000);
  };
  next();
}
let bannerTimer=0;
function banner(t,s,color){
  $('bT').textContent=t;$('bT').style.color=color||'';$('bS').textContent=s||'';
  $('banner').classList.add('show');clearTimeout(bannerTimer);
  bannerTimer=setTimeout(()=>$('banner').classList.remove('show'),2800);
}

/* Spieler */
const player=makeHuman(LOOKS.dave);scene.add(player);
attachModel(player,typeof HOUG_B64==='string'?HOUG_B64:'',{height:1.85,onModel:m=>{if(typeof hougOutfitBuild==='function')hougOutfitBuild(m);}});
const P={x:-6.8,y:0,fl:0,z:0.3,rot:Math.PI/2,vx:0,vz:0,walk:0,t:0};
player.position.set(P.x,P.y+0.04,P.z);player.rotation.y=P.rot;
const flOf=y=>y>1.45?1:(y<-1.45?-1:0);
const grp=f=>f===1?U:(f===-1?BM:W);
const flY=f=>f===1?2.9:(f===-1?-2.9:0);
/* Höhe: Rampen für beide Treppen, sonst Etagenniveau */
function levelY(x,z,y){
  if(x>=-1.3&&x<=1.3&&z>=-6&&z<=-4.6)return clamp((x+1.3)/2.6*2.9,0,2.9);
  if(x>=4.3&&x<=5.6&&z<=-8.2&&z>=-10.8)return -clamp((-8.2-z)/2.6*2.9,0,2.9);
  return y>1.45?2.9:(y<-1.45?-2.9:0);
}
const carryMesh=new THREE.Group();carryMesh.position.set(0,0.78,0.55);player.add(carryMesh);carryMesh.visible=false;
function setCarry(name,col,kind){
  S.carry=name;S.carryKind=name?kind:null;carryMesh.visible=!!name;
  while(carryMesh.children.length)carryMesh.remove(carryMesh.children[0]);
  carryMesh.scale.set(kind==='parcel'?2:1,1,1);carryMesh.position.y=kind==='parcel'?1.08:0.78;
  if(name){const it=makeItem(kind||'');carryMesh.add(it);}
}

/* Kollision: Kreis gegen Rechtecke */
function collide(x,z,r,fl){
  for(let pass=0;pass<2;pass++){
    for(const c of colliders){
      if(!c.on||c.fl!==fl)continue;
      const nx=clamp(x,c.x0,c.x1),nz=clamp(z,c.z0,c.z1),dx=x-nx,dz=z-nz,d2=dx*dx+dz*dz;
      if(d2<r*r){
        if(d2>1e-8){const d=Math.sqrt(d2);x=nx+dx/d*r;z=nz+dz/d*r;}
        else{
          const l=x-c.x0,rr=c.x1-x,t=z-c.z0,b=c.z1-z,m=Math.min(l,rr,t,b);
          if(m===l)x=c.x0-r;else if(m===rr)x=c.x1+r;else if(m===t)z=c.z0-r;else z=c.z1+r;
        }
      }
    }
  }
  return [clamp(x,-300,300),clamp(z,-300,300)];
}

/* NPCs laufen auf dem Wegenetz */
const NPCS=[];
function makeNPC(name,look,node,opts={}){
  const mesh=makeHuman(look),p=NODES[node];
  mesh.position.set(p[0],p[2]+0.04,p[1]);scene.add(mesh);
  const n={name,mesh,node,x:p[0],z:p[1],y:p[2],path:[],plan:[],wait:0,idle:rand(2,6),speed:opts.speed||2.1,
    roam:opts.roam||null,talk:opts.talk||null,t:rand(0,9),blip:opts.blip||null};
  NPCS.push(n);return n;
}
function goTo(n,target){
  // Wurde die Figur versetzt (Szene, Teleport), Startknoten auf den nächsten Knoten gleicher Ebene setzen – sonst "sinkt" sie auf dem Weg in den Boden
  {const cur=NODES[n.node];
   if(!cur||Math.hypot(cur[0]-n.x,cur[1]-n.z)>2.5||Math.abs(cur[2]-n.y)>0.8){
     let bk=null,bd=1e9;for(const k in NODES){const p=NODES[k];if(Math.abs(p[2]-n.y)>0.8||!ADJ[k]||!ADJ[k].length)continue;const d=Math.hypot(p[0]-n.x,p[1]-n.z);if(d<bd){bd=d;bk=k;}}
     if(bk)n.node=bk;}}n.path=route(n.node,target).map(k=>({k,x:NODES[k][0],z:NODES[k][1],y:NODES[k][2]}));}
function updateNPC(n,dt){
  if(n.away){n.mesh.visible=false;return;}
  n.t+=dt;let moving=false;
  if(n.wait>0){n.wait-=dt;}
  else if(n.path.length){
    const w=n.path[0],dx=w.x-n.x,dz=w.z-n.z,d=Math.hypot(dx,dz);
    if(w.len===undefined){w.len=Math.max(d,0.01);w.y0=n.y;}
    if(d<0.12){n.node=w.k;n.y=w.y;n.path.shift();}
    else{
      const st=Math.min(d,n.speed*dt);n.x+=dx/d*st;n.z+=dz/d*st;moving=true;n.dist=(n.dist||0)+st;
      n.y=w.y+(w.y0-w.y)*Math.min(1,d/w.len);
      n.mesh.rotation.y=angLerp(n.mesh.rotation.y,Math.atan2(dx,dz),Math.min(1,dt*10));
    }
  }
  else if(n.plan.length){
    const s=n.plan.shift();
    if(s.go)goTo(n,s.go);if(s.wait)n.wait=s.wait;if(s.fn)s.fn();
  }
  else if(n.roam){
    n.idle-=dt;
    if(n.idle<=0){n.idle=rand(8,16);const t=pick(n.roam);if(t!==n.node)goTo(n,t);}
  }
  n.mesh.position.set(n.x,n.y+0.04,n.z);n.mesh.visible=Math.abs(n.y-P.y)<1.6;
  if(!moving&&n.wasMoving&&(n.dist||0)>9){playOnce(n.mesh,'breath',3);}
  if(!moving&&n.wasMoving)n.dist=0;
  n.wasMoving=moving;
  if(moving)animWalk(n.mesh,n.t,1,n.speed);else animWalk(n.mesh,n.t,0,0);
}
function removeNPC(n){scene.remove(n.mesh);const i=NPCS.indexOf(n);if(i>=0)NPCS.splice(i,1);}

const connie=makeNPC('Connie',LOOKS.connie,'K2',{roam:['K2','B','A','KF','KS','G','E'],blip:'#ff7eb3',
  talk:()=>{
    if(S.mood<=10)return 'Kein Fernsehen heute, Houg. Erst bringst du den Haushalt in Ordnung.';
    if(S.hunger<30)return 'Du siehst blass aus. Iss was, bevor du mir umkippst.';
    if(S.task)return 'Was stehst du hier rum? Ich hab dir doch was aufgetragen.';
    return pick(['Hast du schon was gegessen? Der Kühlschrank ist voll genug.','Der Nachbar hat gefragt, ob du schon wieder Sofa-Urlaub machst.','Schatz, ich liebe dich. Und jetzt bring bitte den Müll raus.']);
  }});
attachModel(connie.mesh,typeof CONNIE_B64==='string'?CONNIE_B64:'',{height:1.72});
let archie=null;
