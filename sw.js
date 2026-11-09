/* Generated manifest: every game is installed before offline readiness is announced. */
importScripts('offline-files.js');
const VERSION=self.OFFLINE_VERSION;
const PREFIX='fuehlmemory:'+self.registration.scope+':';
const CACHE=PREFIX+VERSION;
const files=self.OFFLINE_FILES;
const aliases=self.OFFLINE_ALIASES||{};
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);let cursor=0,completed=0;
 const report=async()=>{for(const client of await self.clients.matchAll({includeUncontrolled:true}))client.postMessage({type:'COLLECTION_DOWNLOAD',completed,total:files.length});};
 await Promise.all(Array.from({length:4},async()=>{while(cursor<files.length){const file=files[cursor++];const request=new Request(new URL(file,self.registration.scope),{cache:'reload'});
 // A fingerprint identifies one complete release. Resume only its own files.
 if(!await cache.match(request)){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),45000);
  try{const response=await fetch(request,{signal:controller.signal});if(!response.ok)throw Error('Offline-Datei fehlt: '+file);await cache.put(request,response);}finally{clearTimeout(timer);}
 }
 completed++;if(completed%10===0||completed===files.length)await report();
 }}));
 // Keep partial downloads for retry; the previous release remains active.
 // No skipWaiting: an existing game must not receive new files mid-round.
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 await self.clients.claim();
 const keys=await caches.keys();await Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)));
})()));
async function offlineStatus(){const cache=await caches.open(CACHE),keys=new Set((await cache.keys()).map(r=>r.url));return {version:VERSION,ready:files.every(file=>keys.has(new URL(file,self.registration.scope).href)),count:files.length};}
self.addEventListener('message',event=>{
 if(event.data==='SKIP_WAITING')event.waitUntil(self.skipWaiting());
 if(event.data==='CLAIM_COLLECTION')event.waitUntil(self.clients.claim());
 if(event.data==='OFFLINE_STATUS'&&event.ports[0])event.waitUntil(offlineStatus().then(status=>event.ports[0].postMessage(status)));
});
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
 if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
 event.respondWith((async()=>{
  const relative=decodeURIComponent(url.pathname.slice(new URL(self.registration.scope).pathname.length)),alias=aliases[relative],target=alias?new URL(alias,self.registration.scope).href:event.request.url;
  const cache=await caches.open(CACHE),cached=await cache.match(target,{ignoreSearch:true});
  if(cached)return event.request.headers.has('range')&&url.pathname.endsWith('.mp4')?rangeResponse(cached,event.request.headers.get('range')):cached;
  // Never mask a missing game document with the menu, or mix uncached app code into a release.
  return fetch(alias?target:event.request);
 })());
});
