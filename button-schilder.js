/* Die vorhandenen Schilder als klar sichtbare Hauptaktionen einsetzen.
   Kleine System-, Profil- und Zoom-Knöpfe bleiben schlicht. */
(function(){
 'use strict';
 const path=location.pathname.toLowerCase();
 const menu=!path.includes('eigenschaften.html')&&!path.includes('wortmemory/');
 const properties=path.includes('eigenschaften.html');
 const word=path.includes('wortmemory/');
 function skin(el,theme){
  if(!el||el.classList.contains('banner-button'))return;
  el.classList.add('banner-button','banner-'+theme);
  const label=document.createElement('span');
  label.className='banner-label';
  while(el.firstChild)label.appendChild(el.firstChild);
  el.appendChild(label);
 }
 function apply(){
  if(menu){
   document.querySelectorAll('.games .game').forEach(game=>{
    const theme=game.classList.contains('game-blue')?'blue':'paper';
    game.querySelectorAll('a.play').forEach(link=>skin(link,theme));
   });
  }
  if(properties){
   ['startGame','ready','again','modeSolo','modeTwo','successReadNext'].forEach(id=>skin(document.getElementById(id),'blue'));
   document.querySelectorAll('#levelButtons button,#countButtons button').forEach(el=>skin(el,'blue'));

  }
  if(word){
   document.querySelectorAll('#again,#back,#galleryBack,.mode-picker .mode,#selection button.count,.collection-actions button').forEach(el=>skin(el,'paper'));
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
 if(word){
  const obs=new MutationObserver(apply);
  const start=()=>obs.observe(document.body,{childList:true,subtree:true});
  if(document.body)start();else document.addEventListener('DOMContentLoaded',start,{once:true});
 }
})();
