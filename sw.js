// Change VERSION whenever published application files change.
const VERSION='v63';
const PREFIX='fuehlmemory:'+self.registration.scope+':';
const CACHE=PREFIX+VERSION;
const files=['./','index.html','style.css','cards.js','engine.js','app.js','profile-store.js','profiles.js','CARD_MATRIX.csv','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','assets/backs/memory-boy.png','assets/backs/question-mark.png'];
files.push('eigenschaften.html','menu.css','menu.js','button-schilder.css','button-schilder.js','intro-animations.css','intro-animations.js',"wortmemory/1000256580.png","wortmemory/bad-badezimmer.png","wortmemory/bad-schwimmbad.png","wortmemory/birne-gluehbirne.png","wortmemory/birne-obst.png","wortmemory/blatt-baum.png","wortmemory/blatt-papier.png","wortmemory/decke-kuscheldecke.png","wortmemory/decke-zimmerdecke.png","wortmemory/hahn-bauernhof.png","wortmemory/hahn-wasserhahn.png","wortmemory/icon-180.png","wortmemory/icon-192.png","wortmemory/icon-512.png","wortmemory/icon-maskable-512.png","wortmemory/index.html","wortmemory/kartenrueckseite.png","wortmemory/nagel-finger.png","wortmemory/nagel-metall.png","wortmemory/note-musik.png","wortmemory/note-schule.png","wortmemory/paar-menschen.png","wortmemory/paar-schuhe.png","wortmemory/schale-frucht.png","wortmemory/schale-gefaess.png","wortmemory/schirm-lampe.png","wortmemory/schirm-regen.png","wortmemory/schlange-menschen.png","wortmemory/schlange-tier.png","wortmemory/schloss-gebaeude.png","wortmemory/schloss-tuerschloss.png","wortmemory/strauss-blumen.png","wortmemory/strauss-vogel.png","wortmemory/strom-energie.png","wortmemory/strom-fluss.png","wortmemory/tor-fussball.png","wortmemory/tor-garten.png");
files.push('wortmemory/linse-fernrohr.png');
files.push('assets/buttons/btn-memory.png','assets/buttons/memory-paper.svg','assets/buttons/memory-blue.svg','assets/buttons/fuehlmemory-ohne-deko.png','assets/buttons/memory-ohne-deko.png','wortmemory/test-zweispieler-2026-11-06.html');
files.push('synonymmemory/index.html','synonymmemory/style.css','synonymmemory/app.js','synonymmemory/data.js','assets/menu/synonymmemory.webp','assets/buttons/synonymmemory-paper.png');
files.push('assets/intro/synonymmemory.mp4','assets/buttons/eigenschaften-blueten.png','assets/buttons/eigenschaften-efeu.png');
files.push('assets/buttons/word-left-slice.svg','assets/buttons/word-center-slice.svg','assets/buttons/word-right-slice.svg','assets/buttons/verrueckt-left-slice.svg','assets/buttons/verrueckt-middle-slice.svg','assets/buttons/verrueckt-right-slice.svg');
files.push('menu-layered-buttons.css');
files.push('collection-navigation.js','collection-navigation.css','assets/buttons/los-gehts-verrueckt-menue.svg');
files.push('verrueckt-gesucht/index.html','verrueckt-gesucht/assets/knurpsel/stufe-08.png','verrueckt-gesucht/assets/buttons/los-gehts-v1.svg','assets/intro/verrueckt-gesucht.mp4');
// Beide undekorierten Originalbilder sind im Repository bestätigt.
importScripts('cards.js');
files.push(...MEMORY_CARDS.map(c=>c.image),...['Drehende_Karte_12Bilder_3s_weiss.webp','02_drehen_weiss.mp4','03_zwinkern.mp4','04_ausrutschen.mp4'].map(n=>'assets/animations/'+n));
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(files.map(file=>new Request(file,{cache:'reload'})))).catch(async error=>{await caches.delete(CACHE);throw error;})));
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
  try{const response=await fetch(event.request);if(response.ok&&url.pathname.endsWith('/assets/intro/verrueckt-gesucht.mp4'))cache.put(event.request.url,response.clone()).catch(()=>{});return response;}catch(error){if(event.request.mode==='navigate')return await cache.match('index.html');throw error;}
 })());
});
