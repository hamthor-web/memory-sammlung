const assert=require('node:assert/strict');
const {createStore,PREFIX,LEGACY,ASSIGNMENT,versionsFor,completionCount}=require('../progress-store.js');
const data=new Map(),storage={getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value)},store=createStore(storage);
const completion=(story,runId,variant=runId)=>({runId,progress:10,date:'2026-11-07T12:00:00Z',model:{id:story,round:[{variant}],pictureClass:'reward-picture'}});
assert.equal(store.completeReward('anna','pfau',{...completion('pfau','unfinished'),progress:9}),false);
assert.equal(completionCount(store.rewards('anna').finished.pfau),0);
assert(store.completeReward('anna','pfau',completion('pfau','one')));
const first=JSON.stringify(versionsFor(store.rewards('anna').finished.pfau)[0]);
assert(store.completeReward('anna','pfau',completion('pfau','two')));
assert.equal(completionCount(store.rewards('anna').finished.pfau),2);
assert.equal(JSON.stringify(versionsFor(store.rewards('anna').finished.pfau)[1]),first,'older artwork never changes');
assert.deepEqual(versionsFor(store.rewards('anna').finished.pfau).map(v=>v.runId),['two','one']);
assert(store.completeReward('anna','pfau',completion('pfau','one')));assert.equal(completionCount(store.rewards('anna').finished.pfau),2,'resume/duplicate finish never counts twice');
for(const story of ['baum','unterwasserwelt','knurpsel','rakete','blumenwiese','wundereiche','kinderzimmer','marsmission','baumhaus','matschwiese']){
 for(let n=0;n<3;n++)assert(store.completeReward('anna',story,completion(story,story+n)));
 const entry=store.rewards('anna').finished[story];assert.equal(completionCount(entry),3);
 assert.equal(versionsFor(entry).length,story==='baum'?3:1);
 assert.equal(completionCount(store.rewards('ben').finished[story]),0);
}
// Old profile-local single entries are one known completion, including old HTML snapshots.
store.saveRewards('ben',{used:['baum'],finished:{baum:{html:'<div>Old tree</div>',frames:['first','last'],date:'old'}}});
assert(store.completeReward('ben','baum',completion('baum','new-tree')));
const trees=versionsFor(store.rewards('ben').finished.baum);assert.equal(trees.length,2);assert.equal(trees[1].html,'<div>Old tree</div>');assert.deepEqual(trees[1].frames,['first','last']);
// Assigned legacy artwork stays in its untouched backup instead of being copied into every version.
const legacy=JSON.stringify({used:['pfau','unterwasserwelt'],finished:{pfau:{html:'<div>Legacy peacock</div>',date:'old'},unterwasserwelt:{html:'<div>Legacy sea</div>',date:'old'}}});
storage.setItem(LEGACY,legacy);assert(store.assignLegacy('ben'));
assert(store.completeReward('ben','pfau',completion('pfau','legacy-new')));
assert(store.completeReward('ben','unterwasserwelt',completion('unterwasserwelt','sea-new')));
const raw=JSON.parse(storage.getItem(PREFIX+'ben')).rewards.finished;
assert.deepEqual(raw.pfau.versions[1],{date:'old',legacyRef:true});assert(raw.unterwasserwelt.legacyRef);assert(!raw.unterwasserwelt.html);
assert.equal(versionsFor(store.rewards('ben').finished.pfau)[1].html,'<div>Legacy peacock</div>');assert.equal(completionCount(store.rewards('ben').finished.unterwasserwelt),2);assert.equal(storage.getItem(LEGACY),legacy);
const reopened=createStore(storage);assert.equal(completionCount(reopened.rewards('ben').finished.pfau),2);assert.equal(versionsFor(reopened.rewards('ben').finished.pfau)[1].html,'<div>Legacy peacock</div>');
// Failed writes never consume a run ID; retrying after a quota error saves once.
let errors=0;const failed=createStore({getItem:key=>storage.getItem(key),setItem(){throw Error('Quota');}},()=>errors++);
assert.equal(failed.completeReward('anna','pfau',completion('pfau','retry')),false);assert.equal(errors,1);assert.equal(completionCount(store.rewards('anna').finished.pfau),2);
assert(store.completeReward('anna','pfau',completion('pfau','retry')));assert(store.completeReward('anna','pfau',completion('pfau','retry')));assert.equal(completionCount(store.rewards('anna').finished.pfau),3);
console.log('PASS multiple immutable versions, fixed-story counts, all 11 stories, child isolation, old pictures, duplicate finishes and quota retries');
