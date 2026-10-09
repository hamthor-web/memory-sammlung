// Change VERSION whenever published application files change.
const VERSION='v1';
const PREFIX='fuehlmemory:'+self.registration.scope+':';
const CACHE=PREFIX+VERSION;
const files=['./','index.html','style.css','cards.js','engine.js','app.js','profile-store.js','profiles.js','CARD_MATRIX.csv','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','assets/backs/memory-boy.png','assets/backs/question-mark.png'];
importScripts('cards.js');
files.push(...MEMORY_CARDS.map(c=>c.image),...['Drehende_Karte_12Bilder_3s_weiss.webp','02_drehen_weiss.mp4','03_zwinkern.mp4','04_ausrutschen.mp4'].map(n=>'assets/animations/'+n));
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(files)).catch(async error=>{await caches.delete(CACHE);throw error;})));
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
async function rangeResponse(response,range){
 const bytes=await response.arrayBuffer(),size=bytes.byteLength,match=/^bytes=(\d*)-(\d*)$/.exec(range);
 const invalid=()=>new Response(null,{status:416,headers:{'Content-Range':`bytes */${size}`}});
 if(!match||(!match[1]&&!match[2]))return invalid();
 const start=match[1]?Number(match[1]):Math.max(0,size-Number(match[2]));
 const end=match[1]&&match[2]?Math.min(Number(match[2]),size-1):size-1;
 if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=size)return invalid();
 return new Response(bytes.slice(start,end+1),{status:206,headers:{'Content-Type':response.headers.get('Content-Type')||'video/mp4','Content-Length':String(end-start+1),'Content-Range':`bytes ${start}-${end}/${size}`,'Accept-Ranges':'bytes'}});
}
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||!url.href.startsWith(self.registration.scope))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const cached=await cache.match(event.request.url,{ignoreSearch:true});
  if(cached)return event.request.headers.has('range')&&url.pathname.endsWith('.mp4')?rangeResponse(cached,event.request.headers.get('range')):cached;
  try{return await fetch(event.request);}catch(error){if(event.request.mode==='navigate')return await cache.match('index.html');throw error;}
 })());
});
