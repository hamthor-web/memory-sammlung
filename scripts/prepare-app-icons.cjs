/* Technical resizing only: uses the supplied artwork without cropping or redrawing. */
const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const root=path.resolve(__dirname,'..');
(async()=>{
 const input=process.argv[2];if(!input)throw Error('Usage: node scripts/prepare-app-icons.cjs /path/to/original.png');
 const source=fs.readFileSync(input),metadata=await sharp(source).metadata();
 if(metadata.width!==metadata.height||metadata.width<512)throw Error('Original must be square and at least 512 × 512 pixels.');
 const files={'icon-192.png':192,'icon-512.png':512,'wortmemory/icon-180.png':180,'wortmemory/icon-192.png':192,'verrueckt-gesucht/icons/icon-192.png':192,'verrueckt-gesucht/icons/icon-512.png':512};
 for(const [file,size] of Object.entries(files)){const data=await sharp(source).rotate().resize(size,size,{fit:'contain'}).png({compressionLevel:9}).toBuffer();await sharp(data).metadata().then(meta=>{if(meta.width!==size||meta.height!==size)throw Error('Wrong dimensions: '+file)});fs.writeFileSync(path.join(root,file),data);console.log(file+' '+size+'×'+size);}
 console.log('Source artwork preserved. Run node scripts/build-production.cjs afterwards.');
})().catch(error=>{console.error(error.message);process.exitCode=1;});
