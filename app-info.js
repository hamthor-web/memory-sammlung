/* Shared legal/contact links; opening this dialog never sends a message. */
(function(){
 'use strict';
 function start(){
  const nav=document.getElementById('collectionGameNav'),header=document.querySelector('main > header');
  if(!nav&&!header)return;
  const panel=document.createElement('dialog');panel.id='appInfo';panel.setAttribute('aria-labelledby','appInfoTitle');
  panel.innerHTML='<h2 id="appInfoTitle">Informationen &amp; Kontakt</h2><p>Memory &amp; Lesen · Heike Amthor</p><nav class="app-info-links" aria-label="Informationen zur App"><a href="https://lesespiele.heike-amthor.de/impressum" target="_blank" rel="noopener noreferrer">Impressum <span>(Website)</span></a><a href="https://lesespiele.heike-amthor.de/datenschutz" target="_blank" rel="noopener noreferrer">Datenschutz <span>(Website)</span></a><a href="https://lesespiele.heike-amthor.de/" target="_blank" rel="noopener noreferrer">Website der Entwicklerin</a><a href="mailto:lesespiele.heike.amthor@gmx.de">Nachricht an die Entwicklerin</a></nav><p class="app-info-email">lesespiele.heike.amthor@gmx.de</p><p class="app-info-note">Die Website-Links benötigen Internet und öffnen eine neue Seite. Für eine Nachricht öffnet sich deine E-Mail-App. Eine Nachricht wird erst verschickt, wenn du sie dort selbst sendest.</p><button type="button" id="appInfoClose">Schließen</button>';
  document.body.append(panel);
  const menu=!nav;
  function open(){if(panel.open)return;if(menu)history.pushState({...history.state,collectionInfo:true},'');panel.showModal();}
  function close(){if(menu&&history.state?.collectionInfo)history.back();else panel.close();}
  panel.querySelector('#appInfoClose').onclick=close;
  if(menu){addEventListener('popstate',()=>{if(panel.open&&!history.state?.collectionInfo)panel.close();});panel.addEventListener('cancel',event=>{if(history.state?.collectionInfo){event.preventDefault();close();}});}
  const button=document.createElement('button');button.type='button';button.id='appInfoButton';button.className='app-info-button';button.setAttribute('aria-label','Informationen, Impressum und Kontakt');button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls',panel.id);button.title='Informationen & Kontakt';button.innerHTML='<span aria-hidden="true">i</span>';button.onclick=open;
  (nav||header).append(button);if(!nav&&header)header.classList.add('has-app-info');
  const login=document.getElementById('login');if(login){const fromLogin=document.createElement('button');fromLogin.type='button';fromLogin.id='appInfoFromLogin';fromLogin.textContent='Informationen & Kontakt';fromLogin.onclick=open;login.append(fromLogin);}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
