(function(){
 'use strict';
 if(!('serviceWorker' in navigator)||location.protocol==='file:')return;
 const script=document.currentScript.src,workerURL=new URL('sw.js',script),scope=new URL('./',script).href;
 const inMenu=location.pathname===new URL('index.html',script).pathname||location.pathname===new URL('./',script).pathname;
 let registration=null,activateRequested=false,reloading=false;
 function status(text,ready=false){const element=document.getElementById('offline')||document.getElementById('offlineStatus');if(element)element.textContent=text;document.dispatchEvent(new CustomEvent('collection:offline-status',{detail:{text,ready}}));}
 function note(text){const node=document.getElementById('updateStatus');if(node)node.textContent=text;}
 function ask(worker){return new Promise(resolve=>{const channel=new MessageChannel(),timer=setTimeout(()=>resolve(null),4000);channel.port1.onmessage=event=>{clearTimeout(timer);channel.port1.close();resolve(event.data);};worker.postMessage('OFFLINE_STATUS',[channel.port2]);});}
 async function verify(){if(!registration?.active)return;const result=await ask(registration.active);status(result?.ready?'Offline bereit – alle vier Spiele':'Das vollständige Offline-Paket wird vorbereitet …',!!result?.ready);}
 function activate(){if(!inMenu||!registration?.waiting)return;note('Die neue Version ist vollständig geladen und wird jetzt geöffnet.');reloading=true;registration.waiting.postMessage('SKIP_WAITING');}
 function observe(worker){if(!worker)return;worker.addEventListener('statechange',()=>{if(worker.state==='installed'){verify();if(registration.waiting){note('Eine neue Version ist bereit. Tippe auf „Auf Aktualisierung prüfen“.');if(activateRequested)activate();}}if(worker.state==='redundant')status('Offline-Paket unvollständig. Die bisherige Version bleibt erhalten. Bitte mit Internet erneut versuchen.');});}
 status('Alle vier Spiele werden für offline vorbereitet …');
 const ready=navigator.serviceWorker.register(workerURL.href,{scope,updateViaCache:'none'}).then(async reg=>{
  registration=reg;
  // Retire the old nested registration; only the complete collection owns offline files.
  for(const old of await navigator.serviceWorker.getRegistrations())if(old.scope.startsWith(scope)&&old.scope!==scope)await old.unregister();
  reg.active?.postMessage('CLAIM_COLLECTION');observe(reg.installing);reg.addEventListener('updatefound',()=>observe(reg.installing));
  await verify();if(reg.waiting)note('Eine neue Version ist bereit. Tippe auf „Auf Aktualisierung prüfen“.');return reg;
 }).catch(()=>{status('Offline-Paket konnte nicht geladen werden. Bitte Internetverbindung prüfen.');return null;});
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloading){CollectionSession?.flush();location.reload();}else verify();});
 window.CollectionOffline={ready,verify,async checkForUpdate(){const reg=await ready;if(!reg){note('Aktualisierung nicht möglich. Bitte Internetverbindung prüfen.');return;}activateRequested=true;try{if(reg.waiting){activate();return;}await reg.update();if(reg.waiting)activate();else if(reg.installing)note('Die neue Version wird vollständig geladen. Bitte warten …');else note('Du verwendest die aktuelle Version.');}catch{activateRequested=false;note('Aktualisierung nicht möglich. Die bisherige Version bleibt erhalten.');}}};
})();
