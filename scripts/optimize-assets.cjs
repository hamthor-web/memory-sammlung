/* One-time/reproducible lossless asset preparation. Requires sharp as a dev tool. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),sharp=require('sharp');
const {root,productionFiles}=require('./production-files.cjs');
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
async function visiblePixels(file){const {data,info}=await sharp(file).toColourspace('srgb').ensureAlpha().raw().toBuffer({resolveWithObject:true});for(let i=0;i<data.length;i+=4)if(data[i+3]===0)data.fill(0,i,i+3);return {width:info.width,height:info.height,sha256:hash(data)};}
(async()=>{
 const previousFile=path.join(root,'production-assets.json'),previous=fs.existsSync(previousFile)?JSON.parse(fs.readFileSync(previousFile,'utf8')):{};
 const retained=new Set(productionFiles()),aliases={...previous.aliases},images=[...(previous.images||[])],removed=[...(previous.removed||[])];let beforeBytes=0;
 function walk(dir){return fs.readdirSync(path.join(root,dir),{withFileTypes:true}).flatMap(ent=>ent.isDirectory()?(['.git','dist','node_modules'].includes(ent.name)?[]:walk(path.posix.join(dir,ent.name))):[path.posix.join(dir,ent.name)]);}
 const artwork=[...walk('assets'),...walk('wortmemory/assets'),...walk('verrueckt-gesucht/assets'),...fs.readdirSync(path.join(root,'wortmemory')).filter(p=>/\.(?:png|jpe?g|webp)$/.test(p)).map(p=>'wortmemory/'+p),...fs.readdirSync(root).filter(p=>/\.(?:png|jpe?g|webp)$/.test(p))];
 for(const file of artwork){if(file==='App Icon Fröhlicher Memory-Karten-Kronenheld.png')continue;const size=fs.statSync(path.join(root,file)).size;beforeBytes+=size;if(!retained.has(file)&&/\.(?:png|webp|jpe?g|svg|mp4)$/.test(file)){removed.push({path:file,bytes:size,sha256:hash(fs.readFileSync(path.join(root,file)))});fs.unlinkSync(path.join(root,file));}}
 const candidates=[...retained].filter(file=>file.endsWith('.png')&&!/(?:^|\/)icon[^/]*\.png$/.test(file));
 let cursor=0;
 await Promise.all(Array.from({length:3},async()=>{while(cursor<candidates.length){const source=candidates[cursor++],input=path.join(root,source),meta=await sharp(input).metadata();if(meta.pages>1||meta.depth!=='uchar')continue;
  let target=source.replace(/\.png$/,'.webp');if(fs.existsSync(path.join(root,target)))target=source.replace(/\.png$/,'-lossless.webp');const output=path.join(root,target),original=fs.readFileSync(input),encoded=await sharp(input).webp({lossless:true,effort:6}).toBuffer();
  if(encoded.length>=original.length*.98)continue;fs.writeFileSync(output,encoded);const oldPixels=await visiblePixels(input),newPixels=await visiblePixels(output);if(JSON.stringify(oldPixels)!==JSON.stringify(newPixels))throw Error('Decoded pixels changed: '+source);
  aliases[source]=target;images.push({source,target,beforeBytes:original.length,afterBytes:encoded.length,sourceSha256:hash(original),targetSha256:hash(encoded),decoded:oldPixels});fs.unlinkSync(input);console.log(source+' -> '+target+' ('+Math.round(100*(1-encoded.length/original.length))+'% smaller, identical visible pixels)');
 }}));
 // Change static references relative to each source file; old saved markup is resolved at runtime.
 for(const file of [...walk('.').filter(f=>!f.startsWith('.git/')&&!f.startsWith('tests/')&&!f.startsWith('docs/')&&!f.startsWith('scripts/')&&/\.(?:js|html|css|svg|webmanifest)$/.test(f))]){let text=fs.readFileSync(path.join(root,file),'utf8');for(const [source,target] of Object.entries(aliases)){const from=path.posix.relative(path.posix.dirname(file),source),to=path.posix.relative(path.posix.dirname(file),target);text=text.split(from).join(to);}fs.writeFileSync(path.join(root,file),text);}
 for(const file of ['knurpsel.js','rakete.js','kinderzimmer.js']){const full=path.join(root,'verrueckt-gesucht',file);let text=fs.readFileSync(full,'utf8');text=text.replace(/(assets\/(?:knurpsel|rakete|kinderzimmer)\/[`'"\w${}().,+\- ]*)\.png/g,'$1.webp');fs.writeFileSync(full,text);}
 fs.writeFileSync(path.join(root,'production-assets.json'),JSON.stringify({version:1,aliases:Object.fromEntries(Object.entries(aliases).sort()),images:images.sort((a,b)=>a.source.localeCompare(b.source)),removed:removed.sort((a,b)=>a.path.localeCompare(b.path)),artworkBytesBefore:previous.artworkBytesBefore||beforeBytes},null,2)+'\n');
 console.log('Removed',removed.length,'unused assets; losslessly converted',images.length,'PNGs.');
})().catch(error=>{console.error(error);process.exitCode=1;});
