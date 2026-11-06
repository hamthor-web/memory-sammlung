/* Nur große Handlungs-Schaltflächen dekorieren; kleine Steuerknöpfe bleiben schlicht.
   Dekorative Randbilder werden per CSS ohne Verformung der Figuren platziert. */
(function(){
  const path=location.pathname.toLowerCase();
  const menu=!path.includes('eigenschaften.html')&&!path.includes('wortmemory/');
  const properties=path.includes('eigenschaften.html');
  const word=path.includes('wortmemory/');
  function skin(element,theme){
    if(!element||element.classList.contains('banner-button'))return;
    element.classList.add('banner-button','banner-'+theme);
    const span=document.createElement('span');
    span.className='banner-label';
    while(element.firstChild)span.appendChild(element.firstChild);
    element.appendChild(span);
  }
  function apply(){
    if(menu){
      document.querySelectorAll('.games .game').forEach(game=>{
        const target=game.querySelector('.play');
        const title=(game.querySelector('h2')?.textContent||'').toLowerCase();
        skin(target,title.includes('eigenschaften')?'blue':'paper');
      });
    }
    if(properties){
      ['startGame','ready','again','modeSolo','modeTwo'].forEach(id=>skin(document.getElementById(id),'blue'));
    }
    if(word){
      document.querySelectorAll('#again,#back,#galleryBack,.mode-picker .mode,.collection-actions button').forEach(el=>skin(el,'paper'));
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  if(word){
    const obs=new MutationObserver(apply);
    if(document.body)obs.observe(document.body,{childList:true,subtree:true});
    else document.addEventListener('DOMContentLoaded',()=>obs.observe(document.body,{childList:true,subtree:true}),{once:true});
  }
})();
