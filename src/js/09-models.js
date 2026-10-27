/* ---------- 3D-Modelle (GLB, Mixamo-Skelett), Base64 eingebettet ---------- */
function b64buf(b){const s=atob(b),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u.buffer;}
function isIdle(n){return /angr|idle|shout|look_around/i.test(n);}
function attachModel(g,b64,opts){
  opts=opts||{};
  if(typeof THREE.GLTFLoader!=='function'||!b64)return;
  try{
    new THREE.GLTFLoader().parse(b64buf(b64),'',gltf=>{
      const model=gltf.scene;
      model.traverse(o=>{
        if(!o.isMesh)return;
        o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;
        const m=o.material;
        if(m){
          if(m.map){m.map.encoding=THREE.LinearEncoding;m.map.needsUpdate=true;}
          m.metalness=0;m.roughness=0.85;m.needsUpdate=true;
        }
      });
      model.scale.setScalar((opts.height||1.8)/1.7/g.scale.x);
      g.userData.body.visible=false;
      g.add(model);g.userData.model=model;g.userData.lift=0;
      if(opts.onModel){try{opts.onModel(model,g);}catch(e){console.warn("onModel",e);}}
      const mixer=new THREE.AnimationMixer(model),acts={};
      const names=gltf.animations.map(c=>c.name);
      const isHoug=names.some(n=>/^idle_3$/i.test(n)),isOld=names.some(n=>/elderly/i.test(n));
      const lifts=isHoug?{sittalk:0.04}:(isOld?{sitdrink:0.28,sitdoze:0.22,sitclap:0.14}:(names.some(n=>/shouting/i.test(n))?{sitdrink:0.27,sitdoze:0.21,sitclap:0.12}:{}));
      let walkClip=null;
      for(const c of gltf.animations){
        const a=mixer.clipAction(c);a.play();a.setEffectiveWeight(0);
        let k=null;const n=c.name;
        if(/^idle_3$/i.test(n))k='idle';
        else if(/^idle_15$/i.test(n))k='idle2';
        else if(/carry.*inplace/i.test(n))k='carry';
        else if(/cheer/i.test(n))k='cheer';
        else if(/checkout/i.test(n))k='checkout';
        else if(/elderly/i.test(n))k='walk';                 // Archie: wackeliger Altmännergang
        else if(/kneel/i.test(n))k='kneel';
        else if(/short_breathe/i.test(n))k=isHoug?'breath':'idle';   // Archie: Atmen und Umschauen als Leerlauf
        else if(/breath/i.test(n))k='breath';
        else if(/confus|scratch/i.test(n))k='scratch';
        else if(/angr|shout/i.test(n))k=isHoug?n:'talk';      // Connie: Schimpfen nur beim Sprechen, nie als Leerlauf
        else if(n==='Walking'){k=isOld?'walk0':'walk';walkClip=c;}
        else if(n==='Running')k='run';
        else if(/sit_to_stand/i.test(n))k='sitstand';
        else if(/sitting_answer/i.test(n))k='sittalk';
        else if(/seated_fist/i.test(n))k='sitclap';
        else if(/step_to_sit/i.test(n))k='standsit';
        else if(/doze/i.test(n))k='sitdoze';
        else if(/sit.*clap/i.test(n))k='sitclap';
        else if(/stand_to_sit/i.test(n))k='standsit';
        else if(/walk_to_sit/i.test(n))k='walksit';
        else if(/sit.*drink/i.test(n))k='sitdrink';          // sitzend trinken (Sofa in der Garage)
        else if(/chat/i.test(n))k='chat';
        else if(/clap/i.test(n))k='clap';
        else if(/drink/i.test(n))k='drink';
        else k=n;
        acts[k]=a;
        if(k==='idle')a.setEffectiveWeight(1);
      }
      const hadIdle=!!acts.idle;
      if(!acts.idle){      // kein Leerlauf-Clip: ruhige Standpose einfrieren (Anfang von Stand→Sitzen), sonst eine Gehpose
        const stand=gltf.animations.find(c=>/stand_to_sit/i.test(c.name));
        const src=stand||walkClip;
        if(src){const ia=mixer.clipAction(src.clone());ia.play();ia.time=stand?0:src.duration*0.25;ia.timeScale=0;ia.setEffectiveWeight(1);acts.idle=ia;}
      }
      for(const k of ['drink','breath','scratch','idle2','cheer','checkout','kneel','talk','chat','clap','sitclap','standsit','walksit','sitstand']){if(acts[k]){acts[k].loop=THREE.LoopOnce;acts[k].clampWhenFinished=true;}}
      const w={};for(const k in acts)w[k]=k==='idle'?1:0;
      Object.assign(g.userData,{lifts,fakeIdle:!hadIdle,drinkIdle:!hadIdle&&!!acts.drink,mixer,acts,w,once:null,onceT:0,lt:performance.now(),walkRef:isOld?2.2:1.5});
    },err=>{console.warn('GLB',err);});
  }catch(e){console.warn('GLB',e);}
}
/* Einmal-Animation (trinken, Atem holen, am Kopf kratzen) */
function playOnce(g,key,secs){
  const u=g.userData;if(!u.mixer||!u.acts[key])return;
  u.once=key;u.onceT=secs||2.5;u.acts[key].reset();u.acts[key].play();u.acts[key].timeScale=(key==='breath'||key==='drink')?1.4:1;
}
function playDrink(g,secs){playOnce(g,'drink',secs||2.6);}
function modelAnim(g,amt,sp){
  const u=g.userData,now=performance.now(),dt=Math.min(0.1,Math.max(0,(now-u.lt)/1000));u.lt=now;
  sp=sp||0;let tgt='idle';
  if(sp>0.4)u.idleT=0;else if(!u.once)u.idleT=(u.idleT||0)+dt;
  if(u.pose&&u.acts[u.pose]&&sp<0.4){if(u.once&&/^sit/.test(u.once)&&u.onceT>0&&u.acts[u.once]){u.onceT-=dt;tgt=u.once;}else{tgt=u.pose;u.once=null;}}
  else if(u.once&&u.onceT>0&&sp<0.4){u.onceT-=dt;tgt=u.once;}
  else{u.once=null;if(sp>0.4){tgt=sp>2.8?'run':'walk';if(u.carry&&u.acts.carry)tgt='carry';}
    else if(u.idleT>(u.drinkIdle?3.5:rand(14,22))){const pool=u.drinkIdle?['drink']:['idle2','breath','scratch'].filter(k=>u.acts[k]);if(pool.length){u.idleT=0;playOnce(g,pick(pool),u.drinkIdle?3.2:6.5);}}}
  if(tgt==='walk')u.acts.walk.timeScale=clamp(sp/(u.walkRef||1.5),0.7,1.7);
  if(tgt==='carry')u.acts.carry.timeScale=clamp(sp/1.8,0.7,1.6);
  if(tgt==='run')u.acts.run.timeScale=clamp(sp/4.2,0.8,1.5);
  if(u.fakeIdle&&u.model&&u.model.rotation){      // kein echter Leerlauf-Clip: leichtes Atmen und Gewichtsverlagern
    if(u.bsy===undefined){u.bsy=u.model.scale.y;u.brz=u.model.rotation.z;u.bry=u.model.rotation.y;u.bph=Math.random()*6;}
    const am=u.w&&u.w.idle!==undefined?u.w.idle:1,tt=now/1000+u.bph;
    u.model.scale.y=u.bsy*(1+0.007*am*Math.sin(tt*1.9));
    u.model.rotation.z=u.brz+0.016*am*Math.sin(tt*0.7);
    u.model.rotation.y=u.bry+0.05*am*Math.sin(tt*0.45);
  }
  const k=Math.min(1,dt*10);
  for(const n in u.acts){
    u.w[n]+=((n===tgt?1:0)-u.w[n])*k;
    u.acts[n].setEffectiveWeight(u.w[n]);
  }
  u.mixer.update(dt);
  if(u.model&&u.model.position){const want=(tgt==='sitdrink'||tgt==='sitdoze'||tgt==='sitclap'||tgt==='sittalk')?((u.lifts&&u.lifts[tgt]!==undefined)?u.lifts[tgt]:0.3):0;u.lift+=(want-u.lift)*Math.min(1,dt*8);u.model.position.y=u.lift/(g.scale.x||1);}
}
