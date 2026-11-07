'use strict';
let storage;try{storage=localStorage;}catch{storage={getItem(){throw Error();},setItem(){throw Error();}};}
const store=MemoryProfiles.createStore(storage),dialog=document.getElementById('login');
function choose(profile){document.getElementById('greeting').textContent='Hallo '+profile.name+'!';document.getElementById('changeProfile').textContent='Profil: '+profile.name;document.getElementById('storageNote').textContent=store.isPersistent()?'':'Dein Profil bleibt nur für diese Sitzung erhalten.';dialog.close();document.querySelector('.game .play').focus();}
function show(){const list=document.getElementById('profiles');list.replaceChildren();for(const profile of store.list()){const button=document.createElement('button');button.textContent=profile.name;button.onclick=()=>choose(store.select(profile.id));list.append(button);}document.getElementById('error').textContent='';document.getElementById('closeLogin').hidden=!store.active();dialog.showModal();}
document.getElementById('newProfile').onsubmit=event=>{event.preventDefault();try{choose(store.create(document.getElementById('name').value));}catch(error){document.getElementById('error').textContent=error.message;}};
document.getElementById('changeProfile').onclick=show;document.getElementById('closeLogin').onclick=()=>dialog.close();dialog.addEventListener('cancel',event=>{if(!store.active())event.preventDefault();});
if(store.active())choose(store.active());if(!store.active()||!new URLSearchParams(location.search).has('menu'))show();
// Die App-Verwaltung gehoert in den Profil-Dialog und funktioniert auch ohne Profil.
const installButton=document.getElementById('install');
const updateButton=document.getElementById('update');
const updateStatus=document.getElementById('updateStatus');
const offline=document.getElementById('offline');
let installPrompt=null,registration=null,updating=false;
const status=text=>{updateStatus.textContent=text;};
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;});
installButton.onclick=async()=>{
 if(installPrompt){
  try{await installPrompt.prompt();status('Beachte die Installationshinweise deines Gerätes.');}
  catch{status('Installation über das Browsermenü versuchen.');}
 }else{
  status(/iPhone|iPad/i.test(navigator.userAgent)?'iPhone/iPad: Öffne Safari, tippe auf Teilen und dann auf „Zum Home-Bildschirm“.':'Öffne das Browsermenü und wähle „App installieren“ oder „Zum Startbildschirm hinzufügen“.');
 }
};
function offerUpdate(){
 if(!registration?.waiting)return false;
 status('Eine neue Version ist bereit. Sie wird jetzt aktiviert.');
 navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload(),{once:true});
 registration.waiting.postMessage('SKIP_WAITING');
 return true;
}
updateButton.onclick=async()=>{
 if(updating)return;
 if(!('serviceWorker' in navigator)){
  status('Dieser Browser unterstützt die Offline-Aktualisierung nicht. Bitte die Seite neu laden.');return;
 }
 updating=true;updateButton.disabled=true;
 status('Suche nach einer neuen App-Version …');
 try{
  registration=registration||await navigator.serviceWorker.getRegistration('sw.js');
  if(!registration) registration=await navigator.serviceWorker.register('sw.js',{updateViaCache:'none'});
  if(!offerUpdate()){
   await registration.update();
   if(!offerUpdate())status('Die Versionsprüfung ist abgeschlossen. Sobald eine neue Version bereitsteht, wird sie hier angeboten.');
  }
 }catch(error){status('Aktualisierung konnte nicht geprüft werden. Bitte Internetverbindung prüfen.');}
 finally{updating=false;updateButton.disabled=false;}
};
if('serviceWorker' in navigator){
 offline.textContent='Alle Spiele werden für offline vorbereitet …';
 navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).then(reg=>{
  registration=reg;
  if(reg.active)offline.textContent='Offline bereit';
  if(reg.waiting)status('Ein Update ist bereit. Tippe auf „Auf Aktualisierung prüfen“.');
  reg.addEventListener('updatefound',()=>{
   const worker=reg.installing;if(!worker)return;
   worker.addEventListener('statechange',()=>{
    if(worker.state==='installed'){
     offline.textContent='Offline bereit';
     if(reg.waiting)status('Ein Update ist bereit. Tippe auf „Auf Aktualisierung prüfen“.');
    }
    if(worker.state==='redundant')offline.textContent='Offline-Paket unvollständig. Bitte mit Internet neu laden.';
   });
  });
 }).catch(()=>{offline.textContent='Offline-Paket konnte nicht geladen werden.';status('Offline-Dienst nicht erreichbar.');});
}
