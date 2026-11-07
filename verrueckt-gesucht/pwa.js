'use strict';
(()=>{
 const button=document.getElementById('installApp'),status=document.getElementById('installStatus'),dialog=document.getElementById('installHelp'),help=document.getElementById('installHelpText');
 const updateButton=document.getElementById('updateApp'),updateStatus=document.getElementById('updateStatus'),updateProgress=document.getElementById('updateProgress');
 if(!button)return;
 let deferred=null;
 const ua=navigator.userAgent||'',ios=/iPad|iPhone|iPod/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 const android=/Android/i.test(ua),firefox=/Firefox|FxiOS/i.test(ua),safari=/Safari/i.test(ua)&&!/Chrome|CriOS|Edg|FxiOS|OPR/i.test(ua);
 const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 const msg=t=>{status.hidden=false;status.textContent=t;};
 function update(){button.textContent=standalone()?'Installiert':'Installieren';button.disabled=standalone();}
 addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;update();});
 addEventListener('appinstalled',()=>{deferred=null;msg('Das Spiel ist installiert und kann vom Startbildschirm geöffnet werden.');update();});
 document.getElementById('installHelpClose').onclick=()=>dialog.close();
 function guidance(){
  if(ios)return 'Auf iPhone oder iPad: Öffne diese Seite in Safari. Tippe auf „Teilen“ und anschließend auf „Zum Home-Bildschirm“ bzw. „Zum Home-Bildschirm hinzufügen“. Bestätige die Auswahl.';
  if(android&&firefox)return 'Firefox auf Android: Öffne das Menü (⋮) und wähle „Installieren“ oder „Zum Startbildschirm hinzufügen“. Die genaue Bezeichnung hängt von deiner Firefox-Version ab.';
  if(android)return 'Öffne das Browsermenü (⋮) und wähle „App installieren“ oder „Zum Startbildschirm hinzufügen“. In Chrome, Edge oder Samsung Internet kann die Bezeichnung abweichen.';
  if(firefox)return 'Firefox unter Windows und Linux unterstützt keine direkte Installation dieser Web-App als eigenständige Anwendung. Du kannst sie weiter in Firefox spielen. Für eine installierte App öffne dieselbe Adresse in Chrome oder Edge und wähle im Browsermenü „App installieren“.';
  if(safari)return 'Safari auf dem Mac: Wähle im Menü „Ablage“ die Funktion „Zum Dock hinzufügen“, sofern deine macOS-Version sie anbietet.';
  return 'In Chrome oder Edge: Öffne das Browsermenü und wähle „App installieren“ bzw. unter „Apps“ die Installationsfunktion. Falls der Eintrag fehlt, lade die Seite neu. Das Spiel kann jederzeit auch direkt im Browser genutzt werden.';
 }
 button.onclick=async()=>{
  if(standalone())return;
  if(deferred){const p=deferred;deferred=null;try{await p.prompt();const chosen=await p.userChoice;if(chosen.outcome==='accepted')msg('Installation bestätigt. Folge gegebenenfalls den weiteren Hinweisen des Geräts.');else msg('Installation nicht gestartet. Du kannst sie später erneut versuchen.');}catch{help.textContent=guidance();dialog.showModal();}update();return;}
  help.textContent=guidance();dialog.showModal();
 };
 // Der Ladezähler zählt tatsächlich erfolgreich übertragene Dateien, keine erfundene Zeit.
 let updating=false,requestId='',lastCount=0,worker=null;
 const updateMessage=t=>{updateStatus.hidden=false;updateStatus.textContent=t;};
 function setBusy(on){updating=on;updateButton.disabled=on;updateButton.textContent=on?'Aktualisierung läuft …':'Auf Aktualisierung prüfen';}
 function finishUpdate(text){setBusy(false);updateMessage(text);}
 navigator.serviceWorker?.addEventListener('message',event=>{
  const data=event.data||{};
  if(data.type!=='VG_UPDATE_PROGRESS'||data.id!==requestId)return;
  if(data.phase==='progress'){
   lastCount=data.done;
   updateProgress.hidden=false;updateProgress.max=data.total;updateProgress.value=data.done;
   updateMessage('Aktualisierung: '+data.done+' von '+data.total+' Dateien geladen. Bitte noch warten …');
  }else if(data.phase==='done'){
   finishUpdate('Alle '+data.total+' Dateien geladen. Die App wird jetzt neu geöffnet.');
   // Neu öffnen erst nach erfolgreicher, vollständiger Aktualisierung.
   location.reload();
  }else if(data.phase==='error')finishUpdate('Aktualisierung fehlgeschlagen: '+(data.message||'Bitte Internetverbindung prüfen und erneut versuchen.'));
 });
 async function checkForUpdate(){
  if(updating)return;
  if(!('serviceWorker' in navigator)||location.protocol!=='https:'){
   updateMessage('Die Aktualisierung benötigt eine sichere HTTPS-Verbindung.');return;
  }
  setBusy(true);lastCount=0;updateProgress.hidden=true;updateMessage('Suche nach einer neuen Version …');
  try{
   const registration=await navigator.serviceWorker.ready;
   await registration.update();
   // Auch ohne neue Service-Worker-Version alle App-Dateien kontrolliert auffrischen.
   const target=navigator.serviceWorker.controller||registration.active;
   if(!target)throw Error('Offline-Dienst noch nicht bereit. Bitte die App neu öffnen.');
   requestId='refresh-'+Date.now()+'-'+Math.random().toString(36).slice(2);
   target.postMessage({type:'VG_REFRESH_SHELL',id:requestId});
   updateMessage('Aktualisierung wird vorbereitet …');
  }catch(err){finishUpdate('Aktualisierung nicht möglich: '+err.message);}
 }
 if(updateButton)updateButton.addEventListener('click',checkForUpdate);
 if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).catch(()=>{msg('Der Installationsdienst ist gerade nicht verfügbar. Du kannst das Spiel trotzdem im Browser nutzen.');});

 update();
})();