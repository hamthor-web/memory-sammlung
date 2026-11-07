/* Shared profile identity, safe checkpoints and deliberate two-player handovers. */
(function(){
 'use strict';
 let storage;try{storage=localStorage;}catch{storage={getItem(){throw Error('Speicher gesperrt');},setItem(){throw Error('Speicher gesperrt');}};}
 function warn(){let note=document.getElementById('collectionSaveWarning');if(!note){note=document.createElement('p');note.id='collectionSaveWarning';note.className='collection-save-warning';note.setAttribute('role','alert');document.body.append(note);}note.textContent='Dein Fortschritt konnte nicht gespeichert werden. Bitte lass dir helfen und halte das Spiel geöffnet.';}
 const profiles=MemoryProfiles.createStore(storage),progress=MemoryProgress.createStore(storage,warn);
 let owner=profiles.active(),tracked=null,paused=false,modal=null;
 const nested=/\/(wortmemory|synonymmemory|verrueckt-gesucht)\//.test(location.pathname);
 const home=new URL(nested?'../index.html?menu=1':'index.html?menu=1',location.href);
 function save(game,state){return !paused&&owner&&progress.saveRound(owner.id,game,state);}
 function clear(game){return owner&&progress.clearRound(owner.id,game);}
 function flush(){if(!owner||!tracked||paused)return;const state=tracked.capture();if(state)save(tracked.game,state);}
 function dialog(title,kind='notice'){if(modal){modal.close();modal.remove();}const d=document.createElement('dialog');d.className='collection-dialog';d.id='collectionDialog';d.dataset.kind=kind;const h=document.createElement('h2');h.id='collectionDialogTitle';h.textContent=title;d.setAttribute('aria-labelledby',h.id);d.append(h);d.addEventListener('cancel',e=>e.preventDefault());document.body.append(d);modal=d;return d;}
 function button(d,label,action){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>{b.disabled=true;action();};d.append(b);return b;}
 function close(d){d.close();d.remove();if(modal===d)modal=null;}
 function offerResume(game,restore){if(!owner)return false;const state=progress.loadRound(owner.id,game);if(!state)return false;paused=true;const d=dialog(owner.name+', möchtest du weiterspielen?','resume');button(d,'Weiterspielen',()=>{close(d);try{restore(state);paused=false;flush();}catch(error){paused=false;warn();}});button(d,'Neue Runde',()=>{clear(game);paused=false;close(d);});d.showModal();return true;}
 function handoff(title,ready){const d=dialog(title,'handoff');button(d,'Ich bin bereit',()=>{close(d);ready();flush();});d.showModal();}
 function badge(){if(!owner)return;let bar=document.getElementById('collectionProfile');if(!bar){bar=document.createElement('div');bar.id='collectionProfile';bar.className='collection-profile';document.body.prepend(bar);}bar.replaceChildren();const label=document.createElement('span');label.textContent='Du spielst als '+owner.name;const a=document.createElement('a');const choice=new URL(home);choice.searchParams.set('kind','1');a.href=choice.href;a.textContent='Kind wechseln';bar.append(label,a);}
 function setOwner(profile){flush();owner=profile;paused=false;badge();}
 function legacyAssigned(){document.dispatchEvent(new CustomEvent('collection:legacy-assigned'));}
 function offerLegacy(){if(!progress.legacyPending()||modal)return;const d=dialog('Wem gehören die bisherigen Bilder?');const p=document.createElement('p');p.textContent='Diese Bilder wurden bisher gemeinsam gespeichert. Wähle mit einer erwachsenen Person das Kind aus, dem sie gehören. Es wird nichts gelöscht.';d.append(p);const select=document.createElement('select');select.setAttribute('aria-label','Kind für bisherige Fortschrittsbilder');select.id='legacyOwner';const placeholder=new Option('Bitte ein Kind auswählen','');select.add(placeholder);for(const child of MemoryProfiles.createStore(storage).list())select.add(new Option(child.name,child.id));d.append(select);const assign=button(d,'Bilder diesem Kind zuordnen',()=>{if(!select.value||!progress.assignLegacy(select.value)){assign.disabled=!select.value;return;}close(d);legacyAssigned();});assign.disabled=true;select.onchange=()=>{assign.disabled=!select.value;};button(d,'Später entscheiden',()=>close(d));d.showModal();}
 window.CollectionSession={dismissResume(){if(modal?.dataset.kind==='resume'){paused=false;close(modal);}},progress,profile:()=>owner,save,clear,flush,setOwner,offerResume,handoff,offerLegacy,
  track(game,capture){tracked={game,capture};},
  requireProfile(){if(owner)return true;location.replace(home.href);return false;},
  rewards:()=>owner?progress.rewards(owner.id):{used:[],finished:{}},
  saveRewards:value=>owner&&progress.saveRewards(owner.id,value),
  completeReward:(story,completion)=>owner&&progress.completeReward(owner.id,story,completion),
  escape:value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))};
 addEventListener('pagehide',flush);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flush();});
 addEventListener('pageshow',()=>{const active=MemoryProfiles.createStore(storage).active();if(active?.id!==owner?.id){flush();location.reload();}});
 addEventListener('storage',event=>{if(event.key===MemoryProfiles.KEY){const active=MemoryProfiles.createStore(storage).active();if(active?.id!==owner?.id){flush();location.reload();}}});
 document.addEventListener('click',event=>{if(event.target.closest('a[href]'))flush();},true);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',badge,{once:true});else badge();
})();
