/* Portable, additive backups. Existing profile/progress keys are never overwritten. */
(function(root,factory){const api=factory(root,root.MemoryProgress||(typeof require==='function'?require('./progress-store.js'):null));root.MemoryBackup=api;if(typeof module!=='undefined')module.exports=api;})(globalThis,function(root,Progress){
 'use strict';
 if(typeof module!=='undefined'&&module.exports){require('./verrueckt-gesucht/tree-art.js');require('./verrueckt-gesucht/pfau-art.js');}
 const PROFILE_KEY='fuehlmemory-profiles-v1',JOURNAL='memory-backup-pending-v1',FORMAT='memory-lesespiele-backup',MAX_BYTES=32*1024*1024;
 const games=['eigenschaften','wortmemory','synonymmemory','verrueckt-gesucht'];
 const stories=['pfau','baum','knurpsel','rakete','blumenwiese','wundereiche','kinderzimmer','marsmission','baumhaus','unterwasserwelt','matschwiese'];
 const fail=message=>{throw Error(message||'Die Sicherungsdatei ist ungültig oder beschädigt.');};
 const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
 function checkTree(value,depth=0,budget={nodes:0}){
  if(depth>60||++budget.nodes>200000)fail('Die Sicherungsdatei ist zu umfangreich.');
  if(value===null||typeof value==='boolean'||typeof value==='string')return;
  if(typeof value==='number'){if(!Number.isFinite(value))fail();return;}
  if(typeof value!=='object')fail();
  for(const [key,item] of Object.entries(value)){if(['__proto__','prototype','constructor'].includes(key))fail();checkTree(item,depth+1,budget);}
 }
 function canonical(value){if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';if(object(value))return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}';return JSON.stringify(value);}
 async function digest(value){const crypto=root.crypto||(typeof require==='function'?require('node:crypto').webcrypto:null);const bytes=new TextEncoder().encode(canonical(value));return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),n=>n.toString(16).padStart(2,'0')).join('');}
 function read(storage,key,fallback){const raw=storage.getItem(key);if(raw===null)return fallback;try{return JSON.parse(raw);}catch{fail('Gespeicherte Daten sind beschädigt. Die Sicherung wurde nicht verändert.');}}
 function registry(storage){const data=read(storage,PROFILE_KEY,{profiles:[],activeId:null});if(!object(data)||!Array.isArray(data.profiles)||data.profiles.length>1000)fail();const ids=new Set();for(const p of data.profiles){profile(p);if(ids.has(p.id))fail();ids.add(p.id);}if(data.activeId!==null&&!ids.has(data.activeId))fail();return data;}
 function profile(p){if(!object(p)||typeof p.id!=='string'||!p.id||p.id.length>200||typeof p.name!=='string'||!p.name.trim()||p.name.length>32||![1,2,3].includes(p.level)||![6,12,18].includes(p.count))fail();}
 function visual(entry,story,depth=0){
  if(!object(entry)||depth>3)fail();
  if(entry.completedRuns!==undefined&&(!Array.isArray(entry.completedRuns)||!entry.completedRuns.every(id=>typeof id==='string'&&id)))fail();
  if(entry.runId!==undefined&&typeof entry.runId!=='string')fail();
  if(entry.count!==undefined&&(!Number.isSafeInteger(entry.count)||entry.count<1))fail();
  if(entry.versions!==undefined){if(!Array.isArray(entry.versions)||!entry.versions.length||entry.versions.length>10000)fail();for(const v of entry.versions)visual(v,story,depth+1);}
  if(entry.model!==undefined){const m=entry.model;if(!object(m)||m.id!==story||!Array.isArray(m.round)||m.round.length!==10||typeof m.pictureClass!=='string'||!m.pictureClass.split(/\s+/).every(c=>['reward-picture','knurpsel-picture',story+'-picture'].includes(c))||!m.pictureClass.split(/\s+/).includes('reward-picture'))fail();if(story==='pfau'||story==='baum'){const art=story==='pfau'?root.PFAU_ART:root.TREE_ART;if(!art)fail('Die Bildprüfung ist nicht verfügbar.');const slots=new Set();for(const part of m.round){if(!object(part)||typeof part.id!=='string'||!Object.hasOwn(art.sources,part.id)||!Number.isInteger(part.si)||!object(part.slot)||slots.has(part.si))fail();slots.add(part.si);const slot=part.slot;if(!Number.isFinite(slot.x)||!Number.isFinite(slot.y))fail();if(story==='baum'){if(!art.slots[part.si]||!Number.isFinite(slot.w)||slot.w<=0)fail();}else{if(!art.slots.some(p=>p.si===part.si)||slot.asset!==part.id||slot.si!==part.si||!Number.isFinite(slot.scale)||slot.scale<=0||!Number.isFinite(slot.rot)||(slot.pivot!==undefined&&(!Array.isArray(slot.pivot)||slot.pivot.length!==2||!slot.pivot.every(Number.isFinite)))||(part.si<=8&&!Array.isArray(art.centers[part.id])))fail();}}}}
  if(entry.html!==undefined&&typeof entry.html!=='string')fail();
  if(entry.frames!==undefined&&(!Array.isArray(entry.frames)||!entry.frames.every(f=>typeof f==='string')||entry.frames.length>100))fail();
  if(!entry.model&&!entry.html&&!entry.versions&&!entry.frames?.length)fail();
  if(entry.legacyRef)fail('Ein älteres Bild fehlt in dieser Sicherung.');
 }
 function rewards(value){if(!object(value)||!Array.isArray(value.used)||!value.used.every(id=>stories.includes(id))||!object(value.finished))fail();for(const [id,entry] of Object.entries(value.finished)){if(!stories.includes(id))fail();visual(entry,id);}}
 function scores(value){return Array.isArray(value)&&value.length===2&&value.every(n=>Number.isSafeInteger(n)&&n>=0);}
 function names(value){return Array.isArray(value)&&value.length===2&&value.every(n=>typeof n==='string'&&n.length<=64);}
 function progress(value){
  if(!object(value))fail();if(value.rewards!==undefined)rewards(value.rewards);
  if(value.rounds!==undefined){if(!object(value.rounds))fail();for(const [game,round] of Object.entries(value.rounds)){if(!games.includes(game)||!object(round)||round.version!==1||!object(round.state))fail();const s=round.state;
   if(game==='eigenschaften'&&(!Array.isArray(s.field)||!s.field.length||!Array.isArray(s.found)||!names(s.names)||!scores(s.points)))fail();
   if(game==='wortmemory'&&(!Array.isArray(s.pairIds)||!s.pairIds.length||!Array.isArray(s.deck)||!Array.isArray(s.matched)||!names(s.playerNames)||!scores(s.playerScores)))fail();
   if(game==='wortmemory'){if(s.question!==null&&s.question!==undefined&&(!object(s.question)||typeof s.question.text!=='string'||!['a','b'].includes(s.question.answer)))fail();if(s.collectedPairIds!==undefined&&(!Array.isArray(s.collectedPairIds)||s.collectedPairIds.length!==2||!s.collectedPairIds.every(ids=>Array.isArray(ids)&&ids.every(id=>s.pairIds.includes(id)))))fail();}
   if(game==='synonymmemory'&&(!Array.isArray(s.deck)||!s.deck.length||!Array.isArray(s.found)||!names(s.names)||!scores(s.scores)||!Array.isArray(s.open)))fail();
   if(game==='verrueckt-gesucht'){if(!object(s.round)||!Array.isArray(s.round.deck)||!stories.includes(s.activeRewardId)||!object(s.reward)||!Array.isArray(s.reward.round)||!object(s.model))fail();visual({model:s.model},s.activeRewardId);if(!Number.isInteger(s.reward.progress)||s.reward.progress<0||s.reward.progress>10)fail();}
  }}
 }
 function validate(document){
  checkTree(document);
  if(!object(document)||document.format!==FORMAT||document.version!==1)fail('Diese Datei ist keine unterstützte Memory-&-Lesen-Sicherung.');
  if(typeof document.createdAt!=='string'||!Number.isFinite(Date.parse(document.createdAt))||!Array.isArray(document.profiles)||document.profiles.length>1000)fail();
  const ids=new Set();for(const p of document.profiles){profile(p);if(ids.has(p.id))fail();ids.add(p.id);progress(p.progress);}
  if(document.activeProfileId!==null&&!ids.has(document.activeProfileId))fail();
  if(document.unassignedRewards!==null)rewards(document.unassignedRewards);
  if(typeof document.checksum!=='string'||!/^[a-f0-9]{64}$/.test(document.checksum))fail();
 }
 function recover(storage){
  const pending=read(storage,JOURNAL,null);if(!pending)return;
  if(!object(pending)||!Array.isArray(pending.ids)||!pending.ids.every(id=>/^backup-import-[a-f0-9-]{36}$/.test(id)))fail('Eine unterbrochene Wiederherstellung konnte nicht geprüft werden.');
  const visible=new Set(registry(storage).profiles.map(p=>p.id));
  for(const id of pending.ids)if(!visible.has(id))storage.removeItem(Progress.PREFIX+id);
  storage.removeItem(JOURNAL);
 }
 function portable(value){if(Array.isArray(value))return value.map(portable);if(!object(value))return value;const result={};for(const [key,item] of Object.entries(value)){if(key==='legacyRef'&&(value.html||value.model||value.frames?.length))continue;result[key]=portable(item);}return result;}
 function records(storage){
  const list=registry(storage),legacyData=read(storage,Progress.LEGACY,null);if(legacyData!==null)rewards(portable(legacyData));let problem=false;const store=Progress.createStore(storage,()=>{problem=true;});
  const profiles=list.profiles.map(p=>{const state=read(storage,Progress.PREFIX+p.id,{});if(!object(state))fail();if(state.rewards!==undefined&&(!object(state.rewards)||!Array.isArray(state.rewards.used)||!object(state.rewards.finished)))fail();const result=portable({...state,rewards:store.rewards(p.id)});delete result.legacyImported;delete result.backupImport;return {...p,progress:result};});
  if(problem)fail('Ein gespeichertes Bild konnte nicht gelesen werden.');
  const legacy=read(storage,Progress.LEGACY,null),assignment=read(storage,Progress.ASSIGNMENT,null);
  const unassignedRewards=legacy&&(legacy.used.length||Object.keys(legacy.finished).length)&&(!assignment||!list.profiles.some(p=>p.id===assignment.ownerId))?legacy:null;
  return {profiles,activeProfileId:list.activeId,unassignedRewards};
 }
 async function create(storage,now=new Date()){
  recover(storage);const payload={format:FORMAT,version:1,createdAt:now.toISOString(),...records(storage)};
  payload.checksum=await digest(payload);validate(payload);const text=JSON.stringify(payload,null,2);if(new TextEncoder().encode(text).byteLength>MAX_BYTES)fail('Die Sicherung ist größer als 32 MB.');return text;
 }
 async function parse(text){
  if(typeof text!=='string'||text.length>MAX_BYTES||new TextEncoder().encode(text).byteLength>MAX_BYTES)fail('Die Sicherungsdatei darf höchstens 32 MB groß sein.');
  let document;try{document=JSON.parse(text);}catch{fail('Die Datei konnte nicht gelesen werden. Bitte eine JSON-Sicherungsdatei auswählen.');}
  validate(document);const {checksum,...payload}=document;if(await digest(payload)!==checksum)fail('Die Prüfsumme stimmt nicht. Die Datei ist beschädigt oder wurde verändert.');return document;
 }
 function cleanVisuals(value,sanitizeHTML){
  if(Array.isArray(value))return value.map(v=>cleanVisuals(v,sanitizeHTML));if(!object(value))return value;
  const result={};for(const [key,item] of Object.entries(value)){if(key==='html'){if(typeof sanitizeHTML!=='function')fail('Die Bildprüfung ist nicht verfügbar.');result[key]=sanitizeHTML(item);}else if(key==='frames'){if(typeof sanitizeHTML!=='function')fail('Die Bildprüfung ist nicht verfügbar.');result[key]=item.map(sanitizeHTML);}else result[key]=cleanVisuals(item,sanitizeHTML);}return result;
 }
 function nameFor(name,used){let candidate=name,index=1;while(used.has(candidate.normalize('NFC').toLocaleLowerCase('de'))){const suffix=index===1?' (Sicherung)':' (Sicherung '+index+')';candidate=name.slice(0,32-suffix.length)+suffix;index++;}used.add(candidate.normalize('NFC').toLocaleLowerCase('de'));return candidate;}
 async function prepare(storage,document,options={}){
  recover(storage);validate(document);const {checksum,...payload}=document;if(await digest(payload)!==checksum)fail('Die Prüfsumme stimmt nicht.');
  const before=storage.getItem(PROFILE_KEY),current=registry(storage),existing=records(storage),known=new Set();
  for(const p of existing.profiles){known.add(await digest(p));const raw=read(storage,Progress.PREFIX+p.id,{});if(typeof raw.backupImport?.fingerprint==='string')known.add(raw.backupImport.fingerprint);}
  const used=new Set(current.profiles.map(p=>p.name.normalize('NFC').toLocaleLowerCase('de'))),added=[],skipped=[];
  const incoming=[...document.profiles];if(document.unassignedRewards)incoming.push({id:'unassigned-legacy-pictures',name:'Bisherige Bilder',level:1,count:6,progress:{rewards:document.unassignedRewards}});
  for(const p of incoming){const fingerprint=await digest(p);if(known.has(fingerprint)){skipped.push(p.name);continue;}known.add(fingerprint);const id='backup-import-'+(options.makeId||(()=>root.crypto.randomUUID()))();if(!/^backup-import-[a-f0-9-]{36}$/.test(id)||storage.getItem(Progress.PREFIX+id)!==null||current.profiles.some(q=>q.id===id))fail();
   const clean=cleanVisuals(p.progress,options.sanitizeHTML);progress(clean);clean.backupImport={fingerprint};
   added.push({sourceId:p.id,sourceName:p.name,profile:{id,name:nameFor(p.name,used),level:p.level,count:p.count},progress:clean});
  }
  const activeId=current.activeId||added.find(p=>p.sourceId===document.activeProfileId)?.profile.id||added[0]?.profile.id||null;
  return {before,createdAt:document.createdAt,added,skipped,after:{profiles:[...current.profiles,...added.map(p=>p.profile)],activeId}};
 }
 function apply(storage,plan){
  recover(storage);if(storage.getItem(PROFILE_KEY)!==plan.before)fail('Die Profile wurden inzwischen geändert. Bitte die Datei erneut auswählen.');if(!plan.added.length)return {added:0,skipped:plan.skipped.length};
  let committed=false;const ids=plan.added.map(p=>p.profile.id),written=[];
  try{
   for(const id of ids)if(storage.getItem(Progress.PREFIX+id)!==null)fail();
   storage.setItem(JOURNAL,JSON.stringify({ids}));
   for(const item of plan.added){storage.setItem(Progress.PREFIX+item.profile.id,JSON.stringify(item.progress));written.push(item.profile.id);}
   if(storage.getItem(PROFILE_KEY)!==plan.before)fail('Die Profile wurden inzwischen geändert. Bitte die Datei erneut auswählen.');
   storage.setItem(PROFILE_KEY,JSON.stringify(plan.after));committed=true;
  }catch(error){if(!committed){for(const id of written)try{storage.removeItem(Progress.PREFIX+id);}catch{}try{storage.removeItem(JOURNAL);}catch{};}throw Error('Die Wiederherstellung konnte nicht gespeichert werden. Vorhandene Profile und Bilder bleiben erhalten. Bitte freien Speicher prüfen und die Datei erneut auswählen.');}
  try{storage.removeItem(JOURNAL);}catch{}return {added:ids.length,skipped:plan.skipped.length};
 }
 return {FORMAT,MAX_BYTES,PROFILE_KEY,JOURNAL,create,parse,prepare,apply,recover,digest};
});
