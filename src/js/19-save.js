/* ---------- Speichern und Laden ---------- */
const SAVE_KEY='houg_save_v1',AUTO_KEY='houg_save_auto_v1';
const SAVE_FIELDS=['bag','wardrobe','outfit','wardGift','chapter','day','minutes','money','health','hunger','mood','stock','hygiene','urge','social','cnt','friendDoneCh','upg','deco','trip','tripLevel','work','vac','dayMode','workHome','cLeft','ch3','ch3Done','lastRoute','shiftN','noLate','assigned','evaluated','archieHere','buffs','bonusCnt','taskCd','prankCd','tBack','friendCd','date','dinner','tq','bonusDone','archVisitCd','towerKey'];
const saveApplied={};
function saveSnapshot(){
  const d={v:1,t:Date.now(),S:{}};
  for(const k of SAVE_FIELDS)if(S[k]!==undefined)d.S[k]=JSON.parse(JSON.stringify(S[k]));
  d.todo=S.todo.filter(t=>t.def&&t.def.id&&TASKS.some(x=>x.id===t.def.id)).map(t=>({id:t.def.id,done:!!t.done}));
  d.bins=BINS.map(b=>b.until||0);
  d.nextBuffs=nextBuffs.slice();
  d.home=atHome();
  d.pos=d.home?{x:P.x,z:P.z,y:P.y,fl:P.fl,rot:P.rot}:null;
  return d;
}
function storeGet(key){try{return JSON.parse(localStorage.getItem(key)||'null');}catch(e){return null;}}
function storeSet(key,d){try{localStorage.setItem(key,JSON.stringify(d));return true;}catch(e){return false;}}
/* Speicherdatei auf der Festplatte (File System Access API, Chrome/Edge): überlebt das Leeren des Browser-Caches */
let FH=null,fhBusy=false,fhAsked=false;
const FH_OPTS={suggestedName:'houg-of-queens-spielstand.json',types:[{description:'Spielstand',accept:{'application/json':['.json']}}]};
function idbOp(mode,fn){return new Promise(res=>{try{const rq=indexedDB.open('houg_fh',1);rq.onupgradeneeded=()=>rq.result.createObjectStore('h');rq.onerror=()=>res(null);
  rq.onsuccess=()=>{try{const tx=rq.result.transaction('h',mode),r=fn(tx.objectStore('h'));tx.oncomplete=()=>res(r&&r.result!==undefined?r.result:null);tx.onerror=()=>res(null);}catch(e){res(null);}};}catch(e){res(null);}});}
async function fhRestore(){if(!window.showSaveFilePicker)return;const h=await idbOp('readonly',st=>st.get('fh'));if(h&&h.kind==='file'){FH=h;refreshSaveUI();}}
async function fhPerm(ask){if(!FH)return false;try{let p=await FH.queryPermission({mode:'readwrite'});if(p==='granted')return true;if(ask){p=await FH.requestPermission({mode:'readwrite'});return p==='granted';}}catch(e){}return false;}
async function fhWrite(d){
  if(!FH||fhBusy)return false;fhBusy=true;
  try{if(!(await fhPerm(false)))return false;const w=await FH.createWritable();await w.write(JSON.stringify(d));await w.close();return true;}
  catch(e){return false;}finally{fhBusy=false;}
}
async function fhLink(){   // neue Speicherdatei anlegen oder vorhandene wählen und ab jetzt automatisch beschreiben
  if(!window.showSaveFilePicker){banner('NICHT MÖGLICH','Dieser Browser kann keine Speicherdatei verwalten. Nutze „Exportieren“ (Chrome/Edge gehen).','#ff7b7b');return false;}
  try{const h=await window.showSaveFilePicker(FH_OPTS);FH=h;await idbOp('readwrite',st=>st.put(h,'fh'));
    await fhPerm(true);const ok=await fhWrite(saveSnapshot());refreshSaveUI();
    banner(ok?'SPEICHERDATEI AKTIV':'FEHLER',ok?(h.name+' wird ab jetzt automatisch aktualisiert'):'Datei konnte nicht beschrieben werden','#8ee26b');return ok;}
  catch(e){return false;}
}
async function fhOpen(){   // Spielstand aus einer Datei laden und diese Datei weiter verwenden
  if(!window.showOpenFilePicker){banner('NICHT MÖGLICH','Dieser Browser kann keine Dateien öffnen. Nutze „Importieren“.','#ff7b7b');return null;}
  try{const [h]=await window.showOpenFilePicker({types:FH_OPTS.types});const f=await h.getFile();const d=JSON.parse(await f.text());
    if(!(d&&d.S&&d.v===1)){banner('FEHLER','Datei ist kein gültiger Spielstand','#ff7b7b');return null;}
    FH=h;await idbOp('readwrite',st=>st.put(h,'fh'));try{await h.requestPermission({mode:'readwrite'});}catch(e){}refreshSaveUI();return d;}
  catch(e){return null;}
}
document.addEventListener('click',()=>{if(FH&&!fhAsked){fhAsked=true;fhPerm(true);}},true);   // Schreibrecht nach Neuladen einmal pro Sitzung erneuern
function saveGame(key){
  const d=saveSnapshot();
  const ok=storeSet(key||SAVE_KEY,d);
  fhWrite(d);
  return ok;
}
function saveInfo(d){
  if(!d||!d.S)return '';
  const dt=new Date(d.t),p=n=>String(n).padStart(2,'0');
  return 'Kapitel '+d.S.chapter+' · Tag '+d.S.day+' · $'+Math.floor(d.S.money)+' · '+p(dt.getDate())+'.'+p(dt.getMonth()+1)+'. '+p(dt.getHours())+':'+p(dt.getMinutes());
}
function applySave(d){
  if(!d||!d.S||typeof d.S!=='object')return false;
  const s=d.S;
  // Welt zurücksetzen
  try{if(S.prank)prankEnd(false);}catch(e){}
  try{truckReset();}catch(e){}
  S.shift=null;S.carryStop=null;S.arrived=false;S.shiftOver=false;
  try{clearStopMarks();}catch(e){}
  setCarry(null);clearStepProp();marker.visible=false;S.task=null;
  // Werte
  const prevUpg={fridge:S.upg.fridge,tv:S.upg.tv},prevDeco=Object.assign({},S.deco);
  for(const k of SAVE_FIELDS)if(s[k]!==undefined)S[k]=s[k];
  S.cnt=Object.assign({tasks:0,tv:0,pranks:0,parcels:0},S.cnt);
  if(S.dinner&&S.dinner.st==='scene')S.dinner.st='call';S.scene=null;
  S.prank=null;S.pizzaT=0;S.pizzaReady=false;S.fridgeBlock=false;S.tvBroken=false;S.ring=null;
  // Käufe: Aussehen nachbauen (nur was noch nicht gebaut ist)
  const wantF=S.upg.fridge,wantT=S.upg.tv,wantD=S.deco,stock=S.stock;
  S.upg={fridge:prevUpg.fridge,tv:prevUpg.tv};S.deco=prevDeco;
  for(const it of CATALOG){
    const want=it.deco?!!wantD[it.id]:(it.id.startsWith('fridge')?wantF>=+it.id.slice(-1):wantT>=+it.id.slice(-1));
    if(!want||saveApplied[it.id])continue;
    const sm=S.money;it.buy();S.money=sm;saveApplied[it.id]=1;if(it.deco)S.deco[it.id]=1;
  }
  S.stock=stock;
  S.upg.fridge=Math.max(S.upg.fridge,wantF);S.upg.tv=Math.max(S.upg.tv,wantT);
  // Kapitel
  if(S.chapter>=2&&!archie)chapterStart(2,true);
  S.archieHere=S.chapter>=2;
  if(Array.isArray(d.nextBuffs))nextBuffs=d.nextBuffs.slice();
  if(Array.isArray(d.bins))BINS.forEach((b,i)=>{b.until=d.bins[i]||0;});
  // Aufgaben
  S.todo=(d.todo||[]).map(t=>({def:TASKS.find(x=>x.id===t.id),step:0,done:!!t.done}));
  S.ti=0;
  const first=S.todo.findIndex(t=>!t.done);
  if(first>=0)selectTask(first);else setupStep();
  // Spieler und Connie
  if(d.pos){P.x=d.pos.x;P.z=d.pos.z;P.y=d.pos.y;P.fl=d.pos.fl;P.rot=d.pos.rot;}
  else{P.x=-6.8;P.z=0.3;P.y=0;P.fl=0;P.rot=Math.PI/2;}
  P.vx=P.vz=0;
  try{connieUnsit();const gone=!!S.cLeft||(S.date&&S.date.st==='there');connie.away=gone;connie.mesh.visible=!gone;connie.plan=[];connie.path=[];}catch(e){}
  S.mode='play';
  $('pause').hidden=true;$('start').hidden=true;$('intro').hidden=true;$('hud').hidden=false;
  try{updateQuestUI();}catch(e){}
  return true;
}
function loadGame(key){
  const d=storeGet(key||SAVE_KEY);
  if(!d)return false;
  const ok=applySave(d);
  if(ok)banner('GELADEN',saveInfo(d),'#8ee26b');
  return ok;
}
function exportSave(){
  const d=saveSnapshot();
  try{navigator.clipboard.writeText(JSON.stringify(d)).then(()=>banner('KOPIERT','Spielstand liegt in der Zwischenablage. Mit „Importieren“ wieder einfügen.','#8ee26b'),()=>{});}catch(e){}
  const blob=new Blob([JSON.stringify(d)],{type:'application/json'}),a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download='houg-of-queens-spielstand.json';
  document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);
}
function importSave(file,cb){
  const r=new FileReader();
  r.onload=()=>{let ok=false;try{const d=JSON.parse(r.result);if(d&&d.S&&d.v===1){ok=true;cb(d);}}catch(e){}if(!ok)banner('FEHLER','Datei ist kein gültiger Spielstand','#ff7b7b');};
  r.readAsText(file);
}
function refreshSaveUI(){
  const m=storeGet(SAVE_KEY),a=storeGet(AUTO_KEY);
  $('svInfo').textContent=(m?'Gespeichert: '+saveInfo(m):'Noch nicht gespeichert.')+(FH?' · Datei: '+FH.name:'');
  $('svLoad').disabled=!m;
  $('svAuto').disabled=!a;$('svAuto').title=a?saveInfo(a):'';
  const sb=$('stLoad');if(sb){sb.hidden=!(m||a);sb.textContent=m?'Spielstand laden':'Autosave laden';}
}
function startFromSave(){
  const d=storeGet(SAVE_KEY)||storeGet(AUTO_KEY);if(!d)return;
  audioInit();
  applySave(d);banner('GELADEN',saveInfo(d),'#8ee26b');
}
function autoSave(){if(S.mode==='play'||S.mode==='daycard')saveGame(AUTO_KEY);}
$('svSave').addEventListener('click',()=>{
  const ok=saveGame(SAVE_KEY);refreshSaveUI();
  if(ok)banner('GESPEICHERT',saveInfo(storeGet(SAVE_KEY)),'#8ee26b');
  else banner('SPEICHERN FEHLGESCHLAGEN','Browser-Speicher nicht verfügbar. Nutze „Exportieren“.','#ff7b7b');
});
$('svLoad').addEventListener('click',()=>{if(loadGame(SAVE_KEY))refreshSaveUI();});
$('svAuto').addEventListener('click',()=>{if(loadGame(AUTO_KEY))refreshSaveUI();});
$('svExp').addEventListener('click',exportSave);
$('svImp').addEventListener('click',()=>{let t=null;try{t=window.prompt('Spielstand hier einfügen (oder Abbrechen, um eine Datei zu wählen):');}catch(e){}if(t){try{const d=JSON.parse(t);if(d&&d.S&&d.v===1){applySave(d);banner('GELADEN',saveInfo(d),'#8ee26b');return;}}catch(e){}banner('FEHLER','Kein gültiger Spielstand','#ff7b7b');}else $('svFile').click();});
$('svFile').addEventListener('change',e=>{const f=e.target.files[0];e.target.value='';if(f)importSave(f,d=>{applySave(d);banner('GELADEN',saveInfo(d),'#8ee26b');});});
$('stLoad').addEventListener('click',startFromSave);
$('stImp').addEventListener('click',()=>$('stFile').click());
$('stFile').addEventListener('change',e=>{const f=e.target.files[0];e.target.value='';if(f)importSave(f,d=>{audioInit();applySave(d);banner('GELADEN',saveInfo(d),'#8ee26b');});});
$('svFileLink').addEventListener('click',fhLink);
$('stFileOpen').addEventListener('click',async()=>{const d=await fhOpen();if(d){audioInit();applySave(d);banner('GELADEN',saveInfo(d)+' (aus Datei)','#8ee26b');}});
refreshSaveUI();fhRestore();
