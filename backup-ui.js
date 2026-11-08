/* Local files only. No upload, no automatic sharing and no replacement of children. */
(function(){
 'use strict';
 const Backup=window.MemoryBackup,host=document.getElementById('appManagement');if(!Backup||!host)return;
 const root=new URL('./',document.currentScript.src),gameRoot=new URL('verrueckt-gesucht/',root);
 const section=document.createElement('section');section.id='backupManagement';section.setAttribute('aria-labelledby','backupTitle');
 section.innerHTML='<h3 id="backupTitle">Sicherung &amp; Wiederherstellung</h3><p>Für Erwachsene: Sichere alle Kinderprofile, laufenden Runden und Fortschrittsbilder in einer Datei.</p><button type="button" id="exportBackup">Sicherung speichern</button><button type="button" id="chooseBackup" aria-describedby="backupFileName">Sicherung auswählen</button><input type="file" id="importBackup" accept=".json,application/json" hidden><p id="backupFileName"></p><p class="backup-note">Die Datei enthält Namen und Bilder. Bewahre sie privat auf. Es wird nichts automatisch hochgeladen.</p><p id="backupStatus" role="status" aria-live="polite"></p><a id="backupDownloadLink" hidden>Datei erneut zum Speichern öffnen</a><section id="backupPreview" hidden aria-labelledby="backupPreviewTitle"><h4 id="backupPreviewTitle">Diese Sicherung enthält</h4><p id="backupDate"></p><ul id="backupProfiles"></ul><p id="backupSkipped"></p><p id="backupCleanNotice" hidden></p><p>Vorhandene Profile und Bilder bleiben erhalten. Gleiche Namen erhalten den Zusatz „Sicherung“.</p><button type="button" id="restoreBackup">Profile hinzufügen</button><button type="button" id="cancelBackup">Abbrechen</button></section><section id="backupResult" hidden><p id="backupResultText"></p><button type="button" id="finishBackup">Zu den Spielen</button></section>';
 const closeButton=Array.from(host.children).find(e=>e.tagName==='BUTTON');host.insertBefore(section,closeButton||null);
 const $=id=>document.getElementById(id),status=$('backupStatus'),input=$('importBackup');let plan=null,generation=0,busy=false,restored=false,removedParts=0,downloadURL=null;
 function tell(message,error=false){status.textContent=message;status.setAttribute('role',error?'alert':'status');}
 function reset(clearFile=true){generation++;$('backupDownloadLink').hidden=true;if(downloadURL){const old=downloadURL;setTimeout(()=>URL.revokeObjectURL(old),60000);downloadURL=null;}plan=null;removedParts=0;$('backupCleanNotice').hidden=true;$('backupPreview').hidden=true;$('backupProfiles').replaceChildren();if(clearFile){input.value='';$('backupFileName').textContent='';}}
 function lock(on){busy=on;$('exportBackup').disabled=on;input.disabled=on;$('chooseBackup').disabled=on;$('restoreBackup').disabled=on;$('cancelBackup').disabled=on;if(closeButton)closeButton.disabled=on;}
 function resource(value){
  const text=String(value).trim();if(/^#[\w:.-]+$/.test(text))return text;
  if(/^data:image\/(?:png|jpe?g|webp|gif);base64,[a-z0-9+/=\s]+$/i.test(text))return text;
  let url;try{url=new URL(text,gameRoot);}catch{throw Error('Die Datei enthält eine nicht unterstützte Bildadresse.');}
  if(!['http:','https:'].includes(url.protocol))throw Error('Die Datei enthält eine nicht unterstützte Bildadresse.');
  const match=url.pathname.match(/(?:^|\/)(verrueckt-gesucht\/)?assets\/([a-zA-Z0-9_./-]+\.(?:png|webp|jpe?g|gif|svg))$/);
  if(!match||match[2].includes('..'))throw Error('Die Datei enthält eine nicht unterstützte Bildadresse.');
  const local=match[1]?'verrueckt-gesucht/assets/'+match[2]:url.origin===root.origin&&url.pathname.startsWith(gameRoot.pathname)?'verrueckt-gesucht/assets/'+match[2]:'assets/'+match[2];
  return CollectionSession.resolveAsset(new URL(local,root).href);
 }
 function safeHTML(html){
  if(!window.DOMPurify?.isSupported)throw Error('Die Bildprüfung ist nicht verfügbar. Bitte die App aktualisieren.');
  // Normalize before parsing, so legacy absolute addresses never contact another server.
  const prepared=String(html).replace(/(\b(?:src|href|poster|xlink:href)\s*=\s*)(?:(["'])(.*?)\2|([^\s>]+))/gi,(_,prefix,quote,value,plain)=>prefix+'"'+resource(value??plain).replace(/&/g,'&amp;').replace(/"/g,'&quot;')+'"').replace(/url\(\s*(['"]?)([^'"\)]+)\1\s*\)/gi,(_,quote,value)=>'url('+resource(value)+')');
  const fragment=DOMPurify.sanitize(prepared,{RETURN_DOM_FRAGMENT:true,USE_PROFILES:{html:true,svg:true,svgFilters:true},FORBID_TAGS:['style','a','form','input','button','video','audio','iframe','object','embed','use','foreignObject','animate','animateMotion','animateTransform','set'],FORBID_ATTR:['srcset','formaction','action','target','name']});
  removedParts+=DOMPurify.removed.length;
  const ids=new Map(),prefix='backup-art-'+crypto.randomUUID()+'-';for(const node of fragment.querySelectorAll('[id]')){const old=node.id,next=prefix+ids.size;ids.set(old,next);node.id=next;}
  const localResource=value=>value.startsWith('#')&&ids.has(value.slice(1))?'#'+ids.get(value.slice(1)):resource(value);
  for(const node of fragment.querySelectorAll('*')){
   for(const attr of Array.from(node.attributes)){
    if(/^(?:src|href|poster|xlink:href)$/i.test(attr.name))node.setAttribute(attr.name,localResource(attr.value));
    else if(/url\(/i.test(attr.value))node.setAttribute(attr.name,attr.value.replace(/url\(\s*(['"]?)([^'"\)]+)\1\s*\)/gi,(_,q,value)=>'url('+localResource(value)+')'));
   }
   if(node.hasAttribute('style')){
    for(const property of Array.from(node.style)){const value=node.style.getPropertyValue(property).replace(/url\([^)]*\)/gi,'url(local)');if(/[\\]|@import|expression\s*\(|image-set\s*\(|behavior\s*:|-moz-binding|https?:|\/\//i.test(value))node.style.removeProperty(property);}
    if(['fixed','sticky'].includes(node.style.position))node.style.removeProperty('position');
   }
  }
  const container=document.createElement('div');container.append(fragment);return container.innerHTML;
 }
 async function download(){
  if(busy||restored)return;reset();lock(true);tell('Die Sicherung wird vorbereitet …');
  try{CollectionSession.flush();const text=await Backup.create(localStorage),document=await Backup.parse(text);if(!document.profiles.length&&!document.unassignedRewards)throw Error('Es sind noch keine Profile oder Bilder zum Sichern vorhanden.');
   const url=URL.createObjectURL(new Blob([text],{type:'application/json'})),link=$('backupDownloadLink');downloadURL=url;link.href=url;link.hidden=false;link.download='Memory-Lesen-Sicherung-'+new Date().toLocaleDateString('sv-SE')+'.json';link.click();
   tell('Die Sicherungsdatei wurde zum Speichern geöffnet. Prüfe bitte im Download-Ordner oder im Speicherdialog deines Geräts, ob sie gespeichert wurde.');
  }catch(error){tell(error.message||'Die Sicherung konnte nicht erstellt werden.',true);}finally{lock(false);}
 }
 $('exportBackup').onclick=download;
 $('chooseBackup').onclick=()=>input.click();
 input.onchange=async()=>{
  if(busy||restored)return;const file=input.files[0];reset(false);if(!file)return;$('backupFileName').textContent=file.name;const run=generation;lock(true);tell('Die Sicherung wird geprüft …');
  try{if(file.size>Backup.MAX_BYTES)throw Error('Die Sicherungsdatei darf höchstens 32 MB groß sein.');const document=await Backup.parse(await file.text());const next=await Backup.prepare(localStorage,document,{sanitizeHTML:safeHTML});if(run!==generation)return;plan=next;
   $('backupDate').textContent='Gesichert am '+new Date(next.createdAt).toLocaleString('de-DE');
   for(const item of next.added){const node=window.document.createElement('li'),r=item.progress.rewards||{finished:{}},entries=Object.values(r.finished),pictures=entries.reduce((n,e)=>n+MemoryProgress.versionsFor(e).length,0),rounds=Object.keys(item.progress.rounds||{}).length;
    node.textContent=(item.sourceName===item.profile.name?item.profile.name:item.sourceName+' → '+item.profile.name)+': '+pictures+' '+(pictures===1?'Fortschrittsbild':'Fortschrittsbilder')+', '+rounds+' '+(rounds===1?'laufende Runde':'laufende Runden');$('backupProfiles').append(node);
   }
   for(const name of next.skipped){const node=window.document.createElement('li');node.textContent=name+' – bereits vorhanden';$('backupProfiles').append(node);}
   $('backupSkipped').textContent=next.skipped.length?next.skipped.length+(next.skipped.length===1?' bereits vorhandenes oder bereits wiederhergestelltes Profil wird ausgelassen.':' bereits vorhandene oder bereits wiederhergestellte Profile werden ausgelassen.'):'';
   $('backupCleanNotice').hidden=!removedParts;$('backupCleanNotice').textContent='Nicht unterstützte Bestandteile älterer Bildinhalte wurden entfernt. Prüfe die Bilder nach der Wiederherstellung. Die Original-Sicherungsdatei bleibt unverändert.';
   $('backupPreview').hidden=false;$('restoreBackup').hidden=!next.added.length;$('backupPreviewTitle').tabIndex=-1;$('backupPreviewTitle').focus();tell(next.added.length?'Die Datei ist geprüft. Prüfe die Übersicht und tippe dann auf „Profile hinzufügen“.':'Diese Sicherung ist bereits vorhanden. Es wurde nichts verändert.');
  }catch(error){tell(error.message||'Die Datei konnte nicht geprüft werden.',true);input.value='';}finally{lock(false);}
 };
 $('cancelBackup').onclick=()=>{reset();tell('Wiederherstellung abgebrochen. Es wurde nichts verändert.');};
 $('restoreBackup').onclick=async()=>{
  if(busy||!plan||restored)return;lock(true);tell('Die Profile werden hinzugefügt …');
  try{const apply=()=>Backup.apply(localStorage,plan),result=navigator.locks?await navigator.locks.request('memory-backup-import',apply):apply();restored=true;$('backupPreview').hidden=true;$('backupResult').hidden=false;$('backupResultText').textContent=result.added+(result.added===1?' Profil wurde hinzugefügt.':' Profile wurden hinzugefügt.')+' Vorhandene Daten sind erhalten geblieben.';tell('Wiederherstellung erfolgreich. Öffne jetzt die Spielauswahl.');$('finishBackup').focus();
  }catch(error){reset();tell(error.message||'Die Wiederherstellung konnte nicht abgeschlossen werden.',true);}finally{lock(false);if(restored){$('exportBackup').disabled=true;input.disabled=true;$('chooseBackup').disabled=true;}}
 };
 $('finishBackup').onclick=()=>location.replace(new URL('index.html?menu=1',root).href);
 host.addEventListener('cancel',event=>{if(busy){event.preventDefault();event.stopImmediatePropagation();}});
 host.addEventListener('close',()=>{if(restored)location.replace(new URL('index.html?menu=1',root).href);else if(!busy){reset();tell('');}});
 try{Backup.recover(localStorage);}catch{tell('Eine unterbrochene Wiederherstellung konnte noch nicht bereinigt werden. Bitte freien Speicher und den Zugriff auf lokale Daten prüfen.',true);}
})();
