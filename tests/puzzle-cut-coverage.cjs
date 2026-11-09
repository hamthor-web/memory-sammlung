const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),sharp=require('sharp');
const root=path.resolve(__dirname,'..'),context=vm.createContext({});vm.runInContext(fs.readFileSync(path.join(root,'puzzle-data.js'),'utf8'),context);
(async()=>{for(const p of vm.runInContext('PROPERTY_PUZZLES',context)){
 const image=await sharp(path.join(root,p.image)).metadata();assert.equal(image.width,p.width,p.id+' width');assert.equal(image.height,p.height,p.id+' height');assert.equal(p.paths.length,6);
 const width=768,height=Math.round(width*p.height/p.width),sum=new Uint16Array(width*height);
 for(const d of p.paths){const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" preserveAspectRatio="none" viewBox="0 0 ${p.width} ${p.height}"><path d="${d}" fill="white"/></svg>`;const {data,info}=await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({resolveWithObject:true});for(let i=0;i<sum.length;i++)sum[i]+=data[i*info.channels+3];}
 // Complementary antialiased edges sum to 255; allow a small raster rounding tolerance.
 const gaps=sum.reduce((n,a)=>n+(a<230),0),overlaps=sum.reduce((n,a)=>n+(a>280),0);
 assert.equal(gaps,0,p.id+' has uncovered image pixels');assert.equal(overlaps,0,p.id+' has overlapping interiors');console.log('PASS '+p.id+': six parts cover complete image without gaps/overlaps');
}})().catch(error=>{console.error(error);process.exitCode=1});
