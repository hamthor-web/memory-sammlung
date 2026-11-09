const assert=require('node:assert/strict'),Backup=require('../backup-store.js'),{createStore}=require('../wortmemory/tree-store.js');
const data=new Map(),storage={getItem:k=>data.has(k)?data.get(k):null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};
storage.setItem(Backup.PROFILE_KEY,JSON.stringify({profiles:[{id:'anna',name:'Anna',level:1,count:6}],activeId:'anna'}));
const s=createStore(storage);s.select('anna','rosa');s.award('anna','runde-1','rosa');
(async()=>{const text=await Backup.create(storage),doc=await Backup.parse(text);assert.equal(doc.profiles[0].progress.wordTrees.counts.rosa,1);assert.equal(doc.profiles[0].progress.wordTrees.pending.run,'runde-1');console.log('PASS tree progress, selection and unseen surprise included in portable profile backup');})().catch(e=>{console.error(e);process.exitCode=1;});
