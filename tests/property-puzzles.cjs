const assert=require('node:assert/strict');
const {createStore}=require('../puzzle-store.js');
const map=new Map(),storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};
const store=createStore(storage,['a','b']);
const run=(id,level=1,puzzle='a')=>({id,level,puzzle,complete:true,duo:false});
store.select('anna','a');
assert.equal(store.award('anna',{...run('aborted'),complete:false}),null);
assert.equal(store.award('anna',{...run('duo'),duo:true}),null);
assert.deepEqual(store.load('anna').pieces,{});
assert.equal(store.award('anna',run('r1')).total,1);
assert.equal(store.award('anna',run('r2',2)).total,2);
assert.equal(store.award('anna',run('r3',3)).total,3);
assert.equal(store.load('anna').pieces.a,6);
store.award('anna',run('r3',3));assert.equal(store.load('anna').pieces.b,undefined,'same round never awards twice');
store.award('anna',run('r4',2,'b'));store.award('anna',run('r5',3,'b'));assert.equal(store.load('anna').pieces.b,5);
assert.equal(store.award('anna',run('r6',3,'b')).total,1,'all pictures complete: no phantom pieces');
assert.deepEqual(store.load('ben').pieces,{});
const overflow=createStore(storage,['a','b','c']);overflow.award('ben',run('1',3));overflow.award('ben',run('2',2));
const receipt=overflow.award('ben',run('3',3));assert.deepEqual(receipt.grants.map(g=>g.added),[1,2]);
const before=JSON.stringify(overflow.load('ben'));let warnings=0;
const failed=createStore({getItem:storage.getItem,setItem(){throw Error('Quota');}},['a','b','c'],()=>warnings++);
assert.equal(failed.award('ben',run('lost',3)),null);assert.equal(warnings,1);assert.equal(JSON.stringify(overflow.load('ben')),before);
console.log('PASS 1/2/3 pieces, aborted/duo exclusions, profile isolation, idempotency, overflow and storage failure');
(async()=>{
 const backup=require('../backup-store.js');
 storage.removeItem=k=>map.delete(k);
 storage.setItem('fuehlmemory-profiles-v1',JSON.stringify({profiles:[{id:'anna',name:'Anna',level:1,count:6},{id:'ben',name:'Ben',level:1,count:6}],activeId:'anna'}));
 store.layout('anna','a',[{x:90,y:180,placed:false},{x:270,y:180,placed:true}]);
 const document=await backup.parse(await backup.create(storage));
 const restored=new Map(),target={getItem:k=>restored.get(k)||null,setItem:(k,v)=>restored.set(k,v),removeItem:k=>restored.delete(k)};
 let n=0;const plan=await backup.prepare(target,document,{makeId:()=>`00000000-0000-4000-8000-${String(++n).padStart(12,'0')}`});backup.apply(target,plan);
 const imported=createStore(target,['a','b','c']),anna=plan.added.find(p=>p.sourceId==='anna').profile.id;
 assert.deepEqual(imported.load(anna),store.load('anna'));
 const previous=JSON.stringify(imported.load(anna));imported.award(anna,run('r3',3));assert.equal(JSON.stringify(imported.load(anna)),previous);
 console.log('PASS puzzle progress and award receipts survive the existing additive backup restore');
})().catch(e=>{console.error(e);process.exit(1);});

{
 const memory=new Map(),storage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)},store=createStore(storage,['a']);
 store.award('anna',{id:'round',puzzle:'a',level:3,complete:true});
 assert.equal(store.layout('anna','a',[{x:100,y:90,placed:false},{x:200,y:90,placed:true}]),true);
 assert.equal(store.load('anna').layouts.a[1].x,200);
 assert.equal(store.load('anna').pieces.a,3);
 assert.equal(store.load('ben').layouts,undefined);
 assert.equal(store.layout('anna','invalid',[]),false);
 assert.equal(store.load('anna').receipts.round.total,3);
 console.log('PASS puzzle layout persistence, child isolation, and retained awards');
}
