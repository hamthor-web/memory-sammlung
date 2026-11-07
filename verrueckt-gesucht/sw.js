'use strict';
const VERSION='2026-11-05-sausage-buttons-f-1';
const CACHE='verrueckt-gesucht-shell-'+VERSION;
const SHELL=['./','index.html','style.css','app.js','style-release-20261105-b.css','app-release-20261105-b.js','style-release-20261105-c.css','app-release-20261105-c.js','style-release-20261105-e.css','app-release-20261105-e.js','style-release-20261105-f.css','app-release-20261105-f.js','assets/buttons/los-gehts-v1.svg','assets/buttons/weiter-v1.svg','data.js','assets/hund-gelbe-nase-05.svg','assets/hund-gelbe-nase-06.svg','engine.js','tree.js','pfau.js','pfau-art.js','tree-art.js','knurpsel.js','rakete.js','matschwiese.js','unterwasserwelt.js','baumhaus.js','marsmission.js','kinderzimmer.js','blumenwiese.js','wundereiche.js','pwa.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(async cache=>{for(const p of SHELL){const u=new URL(p,self.registration.scope);const res=await fetch(u,{cache:'reload'});if(!res.ok)throw Error('Missing: '+p);await cache.put(u,res);}}));self.skipWaiting();});
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith('verrueckt-gesucht-shell-')&&k!==CACHE)await caches.delete(k);await self.clients.claim();})()));

const refreshTasks=new Map();
self.addEventListener('message',event=>{
 const data=event.data||{};
 if(data.type!=='VG_REFRESH_SHELL'||!event.source||!data.id)return;
 const client=event.source;
 // Mehrfache Aktualisierungen auf demselben Gerät nicht parallel ausführen.
 if(refreshTasks.has(client.id)){client.postMessage({type:'VG_UPDATE_PROGRESS',id:data.id,phase:'error',message:'Eine Aktualisierung läuft bereits.'});return;}
 const job=(async()=>{
  const stagingName=CACHE+'-refresh-'+client.id;
  const report=payload=>client.postMessage({type:'VG_UPDATE_PROGRESS',id:data.id,...payload});
  try{
   const temp=await caches.open(stagingName);
   for(let i=0;i<SHELL.length;i++){
    const url=new URL(SHELL[i],self.registration.scope);
    const response=await fetch(url,{cache:'reload'});
    if(!response.ok)throw Error('Datei konnte nicht geladen werden: '+SHELL[i]);
    await temp.put(url,response);
    report({phase:'progress',done:i+1,total:SHELL.length});
   }
   const main=await caches.open(CACHE);
   for(const item of SHELL){
    const url=new URL(item,self.registration.scope);
    const response=await temp.match(url);
    if(!response)throw Error('Datei fehlt: '+item);
    await main.put(url,response);
   }
   report({phase:'done',total:SHELL.length});
  }catch(error){report({phase:'error',message:String(error.message||error)});}
  finally{await caches.delete(stagingName);refreshTasks.delete(client.id);}
 })();
 refreshTasks.set(client.id,job);
 event.waitUntil(job);
});

self.addEventListener('fetch',event=>{
 const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);if(url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
 event.respondWith((async()=>{
  if(req.mode==='navigate'){try{const fresh=await fetch(req);if(fresh.ok)(await caches.open(CACHE)).put(new URL('index.html',self.registration.scope),fresh.clone());return fresh;}catch{const cache=await caches.open(CACHE);return await cache.match(new URL('index.html',self.registration.scope))||Response.error();}}
  const cache=await caches.open(CACHE);
  const cached=await cache.match(req,{ignoreSearch:true});
  // App-Code und Styles bei Netzverbindung frisch laden; offline aus dem Cache.
  // So bleiben neue Layouts nicht an einer alten installierten PWA hängen.
  if(/\.(?:js|css|html)$/.test(url.pathname)){
   try{
    const fresh=await fetch(req,{cache:'no-store'});
    if(fresh.ok){cache.put(new URL(url.pathname,self.location.origin),fresh.clone()).catch(()=>{});return fresh;}
    return cached||fresh;
   }catch{return cached||Response.error();}
  }
  if(cached)return cached;
  try{const fresh=await fetch(req);if(fresh.ok)cache.put(req,fresh.clone()).catch(()=>{});return fresh;}catch{return Response.error();}
 })());
});