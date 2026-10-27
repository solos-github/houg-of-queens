/* ---------- Connies Tagesablauf im Haus: feste Stationen statt Zufallsgehen ---------- */
Object.assign(NODES,{CS:[-3.4,-0.2,0],PH:[2.4,-1.2,0],KH:[2.4,-4.5,0],DT:[-1.7,3.6,0]});
for(const k of ['CS','PH','KH','DT'])ADJ[k]=[];
for(const [a,b] of [['W1','CS'],['K3','PH'],['K3','KH'],['E','DT'],['DT','G']]){EDGES.push([a,b]);ADJ[a].push(b);ADJ[b].push(a);}
connie.roam=null;
const CSEAT={x:-3.6,z:-1.2};
const faceTo=(n,x,z)=>{n.mesh.rotation.y=Math.atan2(x-n.x,z-n.z);};
const cu=()=>connie.mesh.userData;
function connieSit(){
  connie.x=CSEAT.x;connie.z=CSEAT.z;connie.y=0;connie.mesh.rotation.y=0;connie.sitting=true;
  if(cu().acts&&cu().acts.sitdrink)cu().pose='sitdrink';
}
function connieUnsit(){
  if(!connie.sitting)return;connie.sitting=false;
  cu().pose=null;cu().once=null;connie.x=NODES.CS[0];connie.z=NODES.CS[1];connie.y=0;
}
const CACT={
  koche:()=>[{go:'KH'},{fn:()=>faceTo(connie,2.4,-6)},{wait:rand(14,24)},{go:'KF'},{fn:()=>faceTo(connie,3.4,-6)},{wait:rand(8,14)}],
  kuehlschrank:()=>[{go:'A1'},{fn:()=>faceTo(connie,6,-4.6)},{wait:rand(6,10)}],
  telefon:()=>[{go:'PH'},{fn:()=>{faceTo(connie,1.2,-1.2);playOnce(connie.mesh,'chat',5);}},{wait:6.5},{fn:()=>playOnce(connie.mesh,'chat',5)},{wait:5.5}],
  esstisch:()=>[{go:'DT'},{fn:()=>faceTo(connie,-0.1,1.5)},{wait:rand(8,14)},{go:'G'},{fn:()=>faceTo(connie,0,1.5)},{wait:rand(5,9)}],
  flur:()=>[{go:'F'},{fn:()=>faceTo(connie,-12,0)},{wait:rand(6,10)}],
  fernsehen:()=>[{go:'W1'},{fn:()=>faceTo(connie,-4.6,3.3)},{wait:rand(10,18)}],
  sofa:()=>[{go:'CS'},{fn:()=>{faceTo(connie,-4.6,3.3);const a=cu().acts;if(a&&a.standsit)playOnce(connie.mesh,'standsit',3.4);}},{wait:3.3},
            {fn:connieSit},{wait:rand(28,50)},{fn:connieUnsit},{wait:0.8}]
};
function connieChoose(){
  const h=S.minutes/60,we=!isWorkday();
  const w={koche:1,kuehlschrank:1,telefon:0.7,esstisch:1,flur:0.6,fernsehen:1,sofa:1};
  if(h<9){w.koche=3;w.kuehlschrank=2;w.sofa=0.2;}
  else if(h>=17&&h<19){w.koche=3;w.esstisch=2;w.sofa=0.4;}
  else if(h>=19){w.sofa=3;w.fernsehen=2;w.koche=0.3;}
  else if(we){w.sofa=2;w.fernsehen=1.5;}
  if(!S.todo||!S.todo.length)w.telefon*=1.5;
  if(connie.lastAct)w[connie.lastAct]=0;
  let tot=0;for(const k in w)tot+=w[k];let r=Math.random()*tot;
  for(const k in w){r-=w[k];if(r<=0)return k;}
  return 'sofa';
}
function connieStep(dt){
  // Connie ist bei der Arbeit (cLeft), steht aber noch im Haus: ausblenden, sobald sie nicht mehr zur Tür läuft
  if(S.cLeft&&!S.scene&&!connie.away&&!connie.path.length&&!connie.plan.length&&connie.wait<=0){connie.away=true;connie.mesh.visible=false;return;}
  if(S.scene||connie.away||S.cLeft)return;
  if(S.date&&(S.date.st==='wait'||S.date.st==='there'))return;
  if(connie.path.length||connie.plan.length||connie.wait>0)return;
  if(connie.sitting)connieUnsit();
  connie.idle-=dt;if(connie.idle>0)return;
  connie.idle=rand(1.5,4);
  const k=connieChoose();connie.lastAct=k;connie.plan=CACT[k]();
}
