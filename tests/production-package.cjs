const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {root,productionFiles}=require('../scripts/production-files.cjs'),files=productionFiles(),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const report=JSON.parse(fs.readFileSync(path.join(root,'production-assets.json'),'utf8'));let saved=0;
for(const image of report.images){assert.equal(hash(fs.readFileSync(path.join(root,image.target))),image.targetSha256);assert(!fs.existsSync(path.join(root,image.source)));assert.equal(report.aliases[image.source],image.target);assert(image.decoded.width>0&&image.decoded.height>0);saved+=image.beforeBytes-image.afterBytes;}
assert(report.images.length>=80);assert(saved>20e6);
for(const item of report.removed)assert(!fs.existsSync(path.join(root,item.path)),item.path+' must remain outside the runtime inventory');
assert(files.every(file=>!file.startsWith('tests/')&&!file.startsWith('docs/')&&!file.startsWith('scripts/')&&!file.includes('.git/')));
assert(files.includes('wortmemory/index.html')&&files.includes('wortmemory/app.js')&&files.includes('wortmemory/data.js')&&files.includes('wortmemory/style.css'));
assert(!fs.readFileSync(path.join(root,'wortmemory/index.html'),'utf8').includes('data:image/'));
assert(fs.readFileSync(path.join(root,'index.html'),'utf8').includes('href="wortmemory/index.html"'));
const contract=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/word-content-contract.json'),'utf8')),context=vm.createContext({});vm.runInContext(fs.readFileSync(path.join(root,'wortmemory/data.js'),'utf8'),context);const pairs=JSON.parse(vm.runInContext('JSON.stringify(PAIRS)',context));assert.deepEqual(pairs.map(pair=>({...pair,a:{label:pair.a.label},b:{label:pair.b.label}})),contract.content);
for(const expected of contract.images){const pair=pairs.find(p=>p.id===expected.id),file='wortmemory/'+pair[expected.side].img;if(expected.source){assert.equal(file,report.aliases[expected.source]||expected.source);const converted=report.images.find(image=>image.source===expected.source);assert.equal(converted?converted.sourceSha256:hash(fs.readFileSync(path.join(root,file))),expected.sha256);}else assert.equal(hash(fs.readFileSync(path.join(root,file))),expected.sha256);}
assert.equal(hash(fs.readFileSync(path.join(root,'wortmemory',vm.runInContext('backImage',context)))),contract.backSha256);
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(ent=>ent.isDirectory()?walk(path.join(dir,ent.name)):[path.relative(path.join(root,'dist'),path.join(dir,ent.name)).replaceAll('\\','/')]);}
const actual=walk(path.join(root,'dist')).sort(),expected=[...files.filter(f=>f!=='./'),'sw.js','.nojekyll'].sort();assert.deepEqual(actual,expected);let bytes=0;for(const file of actual)bytes+=fs.statSync(path.join(root,'dist',file)).size;assert(bytes<125e6);
console.log('PASS production-only inventory, all optimized asset checksums, unchanged word questions/artwork and '+(bytes/1e6).toFixed(1)+' MB package');
