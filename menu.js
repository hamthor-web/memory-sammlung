'use strict';
let storage;try{storage=localStorage;}catch{storage={getItem(){throw Error();},setItem(){throw Error();}};}
const store=MemoryProfiles.createStore(storage),dialog=document.getElementById('login');
function choose(profile){CollectionSession.setOwner(profile);document.getElementById('greeting').textContent='Hallo '+profile.name+'!';document.getElementById('changeProfile').textContent='Profil: '+profile.name;document.getElementById('storageNote').textContent=store.isPersistent()?'':'Dein Profil bleibt nur für diese Sitzung erhalten.';dialog.close();document.querySelector('.game .play').focus();setTimeout(()=>{if(!dialog.open)CollectionSession.offerLegacy();},0);}
function show(){const list=document.getElementById('profiles');list.replaceChildren();for(const profile of store.list()){const button=document.createElement('button');button.textContent=profile.name;button.onclick=()=>choose(store.select(profile.id));list.append(button);}document.getElementById('error').textContent='';document.getElementById('closeLogin').hidden=!store.active();dialog.showModal();}
document.getElementById('newProfile').onsubmit=event=>{event.preventDefault();try{choose(store.create(document.getElementById('name').value));}catch(error){document.getElementById('error').textContent=error.message;}};
document.getElementById('changeProfile').onclick=show;document.getElementById('closeLogin').onclick=()=>dialog.close();dialog.addEventListener('cancel',event=>{if(!store.active())event.preventDefault();});
if(store.active())choose(store.active());if(!store.active()||!new URLSearchParams(location.search).has('menu'))show();
// Die App-Verwaltung gehoert in den Profil-Dialog und funktioniert auch ohne Profil.
const installButton=document.getElementById('install');
const updateButton=document.getElementById('update');
const updateStatus=document.getElementById('updateStatus');
let installPrompt=null,updating=false;
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
updateButton.onclick=async()=>{
 if(updating)return;
 if(!window.CollectionOffline){status('Offline-Dienst noch nicht bereit. Bitte kurz warten.');return;}
 updating=true;updateButton.disabled=true;
 try{await CollectionOffline.checkForUpdate();}finally{updating=false;updateButton.disabled=false;}
};
