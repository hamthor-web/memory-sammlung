/* A reproducible webDir for Android packaging and production-only browser tests. */
const fs=require('node:fs'),path=require('node:path');const {root}=require('./production-files.cjs');
const {files,bytes,version}=require('./build-offline.cjs'),out=path.join(root,'dist');
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
for(const file of [...files.filter(f=>f!=='./'),'sw.js']){const destination=path.join(out,file);fs.mkdirSync(path.dirname(destination),{recursive:true});fs.copyFileSync(path.join(root,file),destination);}
fs.writeFileSync(path.join(out,'.nojekyll'),'');console.log(`Production-only dist/: ${version}, ${(bytes/1e6).toFixed(1)} MB. No tests, docs, scripts or Git history.`);
