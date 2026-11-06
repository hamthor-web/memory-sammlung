/* Eingangsvideos – nur auf dem gemeinsamen Auswahlbildschirm.
   Video vollständig, Schlussbild für zwei Sekunden, dann Navigation. */
(function(){
 'use strict';
 const clips={
  'eigenschaften.html':'assets/intro/fuehlmemory.mp4',
  'wortmemory/index.html':'assets/intro/wortmemory.mp4',
  'wortmemory/test-zweispieler-2026-11-06.html':'assets/intro/wortmemory.mp4'
 };
 const links=[...document.querySelectorAll('.games a[href]')].filter(a=>clips[a.getAttribute('href')]);
 if(!links.length)return;
 const overlay=document.createElement('div');overlay.id='introOverlay';overlay.hidden=true;
 overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');
 overlay.setAttribute('aria-label','Eingangsanimation');
 overlay.innerHTML='<div class="intro-inner"><video id="introVideo" playsinline muted preload="auto" aria-label="Eingangsanimation"></video><button id="introSkip" type="button" aria-label="Animation überspringen">Überspringen</button></div>';
 document.body.append(overlay);
 const video=overlay.querySelector('#introVideo');
 const skip=overlay.querySelector('#introSkip');
 let target='',busy=false,holdTimer=0,watchdog=0;
 function clean(){
  clearTimeout(holdTimer);clearTimeout(watchdog);
  video.onended=null;video.onerror=null;video.onstalled=null;
 }
 function go(){
  if(!busy)return;
  clean();busy=false;location.assign(target);
 }
 function finish(){
  if(!busy)return;
  video.pause();
  // Das Schlussbild bleibt sichtbar, auch in Browsern, die bei 'ended'
  // automatisch zum ersten Bild zurückspringen.
  try {
   if(Number.isFinite(video.duration)&&video.duration>.05)
    video.currentTime=Math.max(0,video.duration-.04);
  }catch(_){}
  clearTimeout(watchdog);
  holdTimer=setTimeout(go,2000);
 }
 function play(link){
  if(busy)return;
  busy=true;target=link.href;
  overlay.hidden=false;
  video.muted=true;video.playsInline=true;video.autoplay=false;
  video.src=clips[link.getAttribute('href')];
  video.onended=finish;
  video.onerror=go; // Falls das Videopaket noch nicht hochgeladen ist
  video.onstalled=()=>{if(video.readyState===0)go();};
  skip.onclick=go;
  skip.focus({preventScroll:true});
  watchdog=setTimeout(go,18000); // Keine Endlossperre bei Videoproblemen
  const p=video.play();
  if(p&&typeof p.catch==='function')p.catch(go);
 }
 links.forEach(a=>a.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();play(a);
 }));
})();
