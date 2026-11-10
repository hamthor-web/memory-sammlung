const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto'),assert=require('node:assert/strict'),{productionFiles}=require('../scripts/production-files.cjs');
const root=path.resolve(__dirname,'..'),inventory=productionFiles(),report=require('../docs/word-tree-art-conversion.json');
for(const image of report.images){assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,image.target))).digest('hex'),image.sha256);assert(inventory.includes(image.target));}
for(const id of ['herbst','mond','rosa','zauber']){
 const file=`wortmemory/trees/${id}/index.html`,html=fs.readFileSync(path.join(root,file),'utf8');assert(inventory.includes(file));assert(html.includes('../bridge.js'));
 for(const script of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(script[1]);
 for(const ref of html.matchAll(/(?:url\(['"]?|(?:src|href)=["'])([^"'\s)]+\.(?:webp|js))(?:\?[^"'\s)]*)?/g)){const target=path.posix.normalize(path.posix.join(path.posix.dirname(file),ref[1]));assert(fs.existsSync(path.join(root,target)),target);assert(inventory.includes(target),target);}
}
for(const file of ['wortmemory/tree-rewards.js','wortmemory/tree-store.js','wortmemory/tree-rewards.css','wortmemory/trees/bridge.js'])assert(inventory.includes(file),file);
console.log('PASS four embedded artwork pages, inline script syntax, asset hashes, local references and offline/Android inventory');
