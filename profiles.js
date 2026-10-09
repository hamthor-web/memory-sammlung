'use strict';
let profileStorage;try{profileStorage=window.localStorage;}catch{profileStorage={getItem(){throw Error('Speicher nicht verfügbar');},setItem(){throw Error('Speicher nicht verfügbar');}};}
const profileStore=MemoryProfiles.createStore(profileStorage),profileDialog=document.getElementById('profileDialog');
function applyProfile(profile){document.getElementById('level').value=String(profile.level);document.getElementById('count').value=String(profile.count);reset();document.getElementById('profileSwitch').textContent='Profil: '+profile.name;document.getElementById('profileStorageNote').textContent=profileStore.isPersistent()?'':'Profile bleiben in diesem Browser nur für diese Sitzung erhalten.';}
function chooseProfile(profile){applyProfile(profile);profileDialog.close();document.getElementById('ready').focus();}
function showProfiles(){
 const list=document.getElementById('profileList');list.replaceChildren();const current=profileStore.active();
 for(const p of profileStore.list()){const b=document.createElement('button');b.type='button';b.textContent=p.name;if(current&&p.id===current.id)b.setAttribute('aria-current','true');b.onclick=()=>chooseProfile(profileStore.select(p.id));list.append(b);}
 document.getElementById('profileEmpty').hidden=profileStore.list().length>0;document.getElementById('profileClose').hidden=!current;document.getElementById('profileError').textContent='';document.getElementById('profileForm').reset();document.getElementById('profileRoundNote').hidden=stage==='study';profileDialog.showModal();
 if(list.firstElementChild)list.firstElementChild.focus();else document.getElementById('profileName').focus();
}
document.getElementById('profileForm').onsubmit=e=>{e.preventDefault();try{chooseProfile(profileStore.create(document.getElementById('profileName').value));}catch(err){document.getElementById('profileError').textContent=err.message;document.getElementById('profileName').focus();}};
document.getElementById('profileClose').onclick=()=>profileDialog.close();profileDialog.addEventListener('cancel',e=>{if(!profileStore.active())e.preventDefault();});
document.getElementById('profileSwitch').onclick=showProfiles;
for(const id of ['level','count'])document.getElementById(id).addEventListener('change',()=>{profileStore.settings(+document.getElementById('level').value,+document.getElementById('count').value);});
const existingProfile=profileStore.active();if(existingProfile)applyProfile(existingProfile);showProfiles();
