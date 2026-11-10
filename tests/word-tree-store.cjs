const assert=require('node:assert/strict'),{createStore,ids}=require('../wortmemory/tree-store.js');
const data=new Map(),storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)},s=createStore(storage);
storage.setItem('memory-progress-v1:anna',JSON.stringify({propertyPuzzles:{preserved:true},rounds:{wortmemory:{old:true}}}));
assert.equal(s.select('anna','herbst'),true);
for(const id of ids){
 for(let n=0;n<10;n++){
  const run=id+n,r=s.award('anna',run,id);assert.equal(r.before,n);assert.equal(r.after,n+1);assert.deepEqual(s.award('anna',run,id),r);
  assert.equal(createStore(storage).load('anna').pending.run,run);
  assert.equal(s.award('anna','unseen-replacement',id),null);
  assert.equal(s.seen('anna',run),true);
 }
 assert.equal(s.count(s.load('anna'),id),10);assert.equal(s.award('anna','extra-'+id,id),null);
}
assert.equal(s.load('anna').pending,null);assert.equal(s.count(s.load('ben'),'herbst'),0);
assert.deepEqual(JSON.parse(storage.getItem('memory-progress-v1:anna')).propertyPuzzles,{preserved:true});
assert.equal(s.select('ben','mond'),true);assert.equal(s.load('anna').selected,'zauber');
let errors=0;const failing=createStore({getItem:storage.getItem,setItem:()=>{throw Error('quota');}},()=>errors++);assert.equal(failing.award('ben','failed','mond'),null);assert.equal(errors,1);assert.equal(s.count(s.load('ben'),'mond'),0);
storage.setItem('memory-progress-v1:broken','invalid json');assert.equal(s.award('broken','test','herbst'),null);assert.equal(storage.getItem('memory-progress-v1:broken'),'invalid json');
console.log('PASS: 40 single grants, reload, pending protection, duplicate protection, ten-element limit, child isolation, preserved other progress, failed storage');
