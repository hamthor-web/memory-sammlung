/* Explicit application roots plus their static and data-driven dependencies. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),origin='https://production.invalid/';
const entries=['index.html','aktualisieren.html','aktualisierung-retten.html','eigenschaften.html','wortmemory/index.html','synonymmemory/index.html','verrueckt-gesucht/index.html'];
function productionFiles(){
 const selected=new Set(),queue=[];
 function add(file){file=file.replace(/\\/g,'/');if(file==='sw.js'||selected.has(file)||!fs.existsSync(path.join(root,file))||!fs.statSync(path.join(root,file)).isFile())return;selected.add(file);queue.push(file);}
 function reference(value,base){if(/^(?:data:|https?:|mailto:|#|javascript:)/.test(value)||value.includes('${'))return;try{const url=new URL(value,new URL(base,origin));if(url.origin===new URL(origin).origin)add(decodeURIComponent(url.pathname.slice(1)));}catch{}}
 for(const file of entries)add(file);
 add('vendor/DOMPurify.LICENSE');add('offline-files.js');add('wortmemory/test-zweispieler-2026-11-06.html');add('verrueckt-gesucht/sw.js');
 // Cached older game pages can still request their former icon/manifest addresses.
 for(const file of ['wortmemory/icon-192.png','wortmemory/icon-180.png','verrueckt-gesucht/manifest.webmanifest'])add(file);
 for(const file of fs.readdirSync(path.join(root,'verrueckt-gesucht')))if(/^(?:app|style)-release-.*\.(?:js|css)$/.test(file))add('verrueckt-gesucht/'+file);
 // Every animation is selectable; paths are assembled dynamically by the games.
 for(const dir of ['assets/animations','assets/intro'])for(const name of fs.readdirSync(path.join(root,dir)))if(/\.(?:mp4|webp)$/.test(name))add(dir+'/'+name);
 // Old saved gallery HTML may reference any original search-game artwork.
 for(const name of fs.readdirSync(path.join(root,'verrueckt-gesucht/assets')))if(/\.(?:png|webp|jpe?g|svg)$/.test(name))add('verrueckt-gesucht/assets/'+name);
 const context=vm.createContext({});
 for(const file of ['cards.js','verrueckt-gesucht/data.js','verrueckt-gesucht/engine.js','verrueckt-gesucht/tree-art.js','verrueckt-gesucht/pfau-art.js','verrueckt-gesucht/tree.js','verrueckt-gesucht/knurpsel.js','verrueckt-gesucht/rakete.js','verrueckt-gesucht/baumhaus.js','verrueckt-gesucht/blumenwiese.js','verrueckt-gesucht/kinderzimmer.js','verrueckt-gesucht/marsmission.js','verrueckt-gesucht/matschwiese.js','verrueckt-gesucht/unterwasserwelt.js','verrueckt-gesucht/wundereiche.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context);
 function strings(value,base){if(typeof value==='string')reference(value,base);else if(Array.isArray(value))value.forEach(v=>strings(v,base));else if(value&&typeof value==='object')Object.values(value).forEach(v=>strings(v,base));}
 strings(vm.runInContext('MEMORY_CARDS',context),'cards.js');
 for(const expr of ['GAME_DATA','TREE_ART','PFAU_ART','KnurpselReward.stages','RocketReward.stages','TreehouseReward.stages','FlowerReward.stages','BedroomReward.stages','MarsMissionReward.stages','MeadowReward.stages','UnderwaterReward.stages','WonderOakReward.stages'])strings(vm.runInContext(expr,context),'verrueckt-gesucht/data.js');
 while(queue.length){const file=queue.shift();if(file==='offline-files.js')continue;if(!/\.(?:html|js|css|svg|webmanifest)$/.test(file))continue;const text=fs.readFileSync(path.join(root,file),'utf8');
  if(file.endsWith('.webmanifest')){const data=JSON.parse(text);for(const icon of data.icons||[])reference(icon.src,file);}
  for(const match of text.matchAll(/(?:src|href|poster)=["']([^"']+)["']/g))reference(match[1],file);
  for(const match of text.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/g))reference(match[1],file);
  for(const match of text.matchAll(/["'`]([^"'`\n]*?\.(?:png|webp|jpe?g|svg|mp4|css|js|html|webmanifest))(?:\?[^"'`]*)?["'`]/g))reference(match[1],file);
 }
 return ['.',...selected].map(file=>file==='.'?'./':file).sort();
}
module.exports={root,entries,productionFiles};
if(require.main===module){const files=productionFiles();let bytes=0;for(const file of files)if(file!=='./')bytes+=fs.statSync(path.join(root,file)).size;console.log(JSON.stringify({files:files.length,bytes,megabytes:bytes/1e6},null,2));}
