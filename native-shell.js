/* Native Android services. The website keeps its normal browser behaviour. */
(function(){
 'use strict';
 const cap=window.Capacitor;if(!cap?.isNativePlatform?.())return;
 const documents=cap.registerPlugin('MemoryDocuments'),app=cap.registerPlugin('App');
 window.CollectionNative={saveBackup:(text,name)=>documents.save({text,name}),openBackup:()=>documents.open()};
 function flush(){window.CollectionSession?.flush();}
 async function start(){
  const viewport=document.querySelector('meta[name=viewport]');if(viewport)viewport.content=viewport.content.replace(/,?\s*viewport-fit=cover/g,'');
  for(const id of ['install','update','installApp','updateApp','downloadMatrix']){const button=document.getElementById(id);if(button){button.hidden=true;button.style.setProperty('display','none','important');}}
  for(const node of document.querySelectorAll('footer span'))if(node.textContent.includes('Safari'))node.hidden=true;
  const offline=document.getElementById('offline');if(offline)offline.textContent='Alle vier Spiele sind auf diesem Gerät gespeichert.';
  const status=document.getElementById('updateStatus');if(status)status.textContent='Aktualisierungen erhältst du über eine neue App-Version. Deine gespeicherten Fortschritte bleiben bei einem regulären Update erhalten.';
  app.getInfo().then(info=>{if(status)status.textContent='Installierte Version: '+info.version+'. Aktualisierungen erhältst du über eine neue App-Version.';}).catch(()=>{});
  await app.removeAllListeners();
  app.addListener('appStateChange',event=>{if(!event.isActive)flush();});
  app.addListener('backButton',()=>{
   flush();if(window.CollectionNavigation){CollectionNavigation.back();return;}
   const dialog=[...document.querySelectorAll('dialog[open]')].at(-1);
   if(dialog){
    if(dialog.id==='login'&&!CollectionSession.profile()){app.minimizeApp();return;}
    const later=[...dialog.querySelectorAll('button')].find(button=>button.textContent==='Später entscheiden');if(later){later.click();return;}
    if(dialog.dispatchEvent(new Event('cancel',{cancelable:true})))dialog.close();return;
   }
   app.minimizeApp();
  });
  document.addEventListener('click',event=>{
   const link=event.target.closest('a[href]');if(!link)return;
   const url=new URL(link.href,location.href);
   if((url.protocol==='https:'&&url.hostname==='lesespiele.heike-amthor.de')||link.href==='mailto:lesespiele.heike.amthor@gmx.de'){
    event.preventDefault();flush();documents.openExternal({url:link.href}).catch(error=>{
     let note=document.getElementById('nativeLinkStatus');if(!note){note=document.createElement('p');note.id='nativeLinkStatus';note.setAttribute('role','alert');(document.getElementById('appInfo')||document.body).append(note);}note.textContent=error.message||'Die Adresse konnte nicht geöffnet werden.';
    });
   }
  },true);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
