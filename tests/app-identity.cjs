const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),base='https://example.org/memory-sammlung/';
const expected=new URL('manifest.webmanifest',base).href;
for(const file of ['index.html','eigenschaften.html','wortmemory/index.html','synonymmemory/index.html','verrueckt-gesucht/index.html']){
 const html=fs.readFileSync(path.join(root,file),'utf8');const links=[...html.matchAll(/<link\b[^>]*>/g)].map(m=>m[0]);
 for(const rel of ['manifest','icon','apple-touch-icon']){const tag=links.find(t=>t.includes('rel="'+rel+'"'));assert(tag,file+' needs '+rel);const href=tag.match(/href="([^"]+)"/)[1];assert.equal(new URL(href,new URL(file,base)).href,rel==='manifest'?expected:new URL('icon-192.png',base).href,file+' uses the collection '+rel);}
}
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));assert.equal(new URL(manifest.id,expected).href,base);assert.equal(new URL(manifest.start_url,expected).href,base);assert.equal(new URL(manifest.scope,expected).href,base);
console.log('PASS one collection identity, installation entry and shared icons from all five pages');
