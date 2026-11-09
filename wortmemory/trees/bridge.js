/* Display-only adapter: grants and saved stages belong to the parent game. */
(()=>{
 'use strict';const oak=typeof groups!=='undefined';let initialized=false;
 const send=type=>parent.postMessage({channel:'memory-tree',type},location.origin);
 async function initialize(data){
  if(initialized)return;initialized=true;step=Math.max(0,Math.min(10,Number(data.count)||0));
  if(oak){groups.forEach((g,i)=>{g.classList.toggle('shown',i<step);g.setAttribute('aria-hidden',String(i>=step));g.setAttribute('tabindex',i<step?'0':'-1');});update();}
  else{items.forEach((item,i)=>{item.el.classList.toggle('visible',i<step);item.el.tabIndex=i<step?0:-1;});count.textContent=`${step} von 10`;document.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('done',i<step));}
  // Existing stages appear together. Only the newly earned element is animated.
  const urls=new Set();for(const el of document.querySelectorAll('.scene,.sprite,.monkey-frame,image')){
   for(const match of getComputedStyle(el).backgroundImage.matchAll(/url\(["']?([^"')]+)["']?\)/g))urls.add(match[1]);
   const href=el.getAttribute('href');if(href)urls.add(href);
  }
  await Promise.all([...urls].map(src=>new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=()=>reject(Error('Bild fehlt'));img.src=src;})));
  if(data.reveal&&step<10){if(oak)await advance();else await reveal();}
  send('shown');
 }
 addEventListener('message',event=>{if(event.source===parent&&event.origin===location.origin&&event.data?.channel==='memory-tree'&&event.data.type==='initialize')initialize(event.data).catch(()=>send('error'));});
 send('ready');
})();
