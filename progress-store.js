/* Profile IDs, never names, own progress. Legacy data stays untouched as a backup. */
(function(root){
 'use strict';
 const PREFIX='memory-progress-v1:',LEGACY='verrueckt-gesucht-rewards-v1',ASSIGNMENT='memory-legacy-rewards-owner-v1';
 const clone=value=>JSON.parse(JSON.stringify(value));
 const emptyRewards=()=>({used:[],finished:{}});
 const variableStories=new Set(['pfau','baum']);
 function versionsFor(entry){if(!entry)return [];return clone(Array.isArray(entry.versions)?entry.versions:[entry]);}
 function completionCount(entry){if(!entry)return 0;return Number.isSafeInteger(entry.count)&&entry.count>0?entry.count:Math.max(1,versionsFor(entry).length);}
 const artworkKeys=['model','html','frames'];
 function packLegacy(entry,legacy){
  const packed={...entry};
  if(legacy&&artworkKeys.some(key=>entry[key]!==undefined)&&artworkKeys.every(key=>JSON.stringify(entry[key])===JSON.stringify(legacy[key]))){for(const key of artworkKeys)delete packed[key];packed.legacyRef=true;}
  if(packed.legacyRef)for(const key of artworkKeys)delete packed[key];
  if(Array.isArray(entry.versions))packed.versions=entry.versions.map(version=>packLegacy(version,legacy));
  return packed;
 }
 function unpackLegacy(entry,legacy){const unpacked=entry.legacyRef?{...legacy,...entry}:{...entry};if(Array.isArray(entry.versions))unpacked.versions=entry.versions.map(version=>unpackLegacy(version,legacy));return unpacked;}

 function createStore(storage,onError=()=>{}){
  function read(key,fallback){try{const value=storage.getItem(key);return value?JSON.parse(value):fallback;}catch(error){onError(error);return fallback;}}
  function write(key,value){try{storage.setItem(key,JSON.stringify(value));return true;}catch(error){onError(error);return false;}}
  function profile(id){if(!id)throw Error('Bitte zuerst ein Kind auswählen.');const value=read(PREFIX+id,{});return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}
  function assignedLegacy(id){const assignment=read(ASSIGNMENT,null);if(assignment?.ownerId!==id)return emptyRewards();return read(LEGACY,emptyRewards())||emptyRewards();}
  function rewards(id){const state=profile(id),legacy=assignedLegacy(id),current=state.rewards||emptyRewards();const finished={...legacy.finished};for(const [key,entry] of Object.entries(current.finished))finished[key]=unpackLegacy(entry,legacy.finished?.[key]);return clone({used:state.legacyImported?current.used:[...new Set([...(legacy.used||[]),...current.used])],finished});}
  function saveRewards(id,value){const state=profile(id),legacy=assignedLegacy(id),finished={};
   // Inherited legacy images remain in their original backup, avoiding a second large copy.
   for(const [key,entry] of Object.entries(value.finished))if(JSON.stringify(entry)!==JSON.stringify(legacy.finished?.[key]))finished[key]=packLegacy(entry,legacy.finished?.[key]);
   state.rewards={used:clone(value.used),finished};if(read(ASSIGNMENT,null)?.ownerId===id)state.legacyImported=true;return write(PREFIX+id,state);
  }
  function completeReward(id,story,completion){
   if(completion.progress!==10||!completion.runId||!completion.model||completion.model.id!==story)return false;
   const value=rewards(id),previous=value.finished[story];
   const completedRuns=previous?.completedRuns||[];
   if(completedRuns.includes(completion.runId)||versionsFor(previous).some(version=>version.runId===completion.runId))return true;
   const version={runId:completion.runId,model:clone(completion.model),date:completion.date};
   if(variableStories.has(story))value.finished[story]={count:completionCount(previous)+1,versions:[version,...versionsFor(previous)]};
   else value.finished[story]={...(previous||version),count:completionCount(previous)+1,completedRuns:[...completedRuns,completion.runId],lastCompletedAt:completion.date};
   if(!value.used.includes(story))value.used.push(story);
   return saveRewards(id,value);
  }
  function legacyPending(){const value=read(LEGACY,null);return !read(ASSIGNMENT,null)&&value&&((value.used||[]).length||Object.keys(value.finished||{}).length)>0;}
  function assignLegacy(id){profile(id);if(read(ASSIGNMENT,null)||!read(LEGACY,null))return false;
   // One tiny atomic write assigns the original backup without copying its image data.
   return write(ASSIGNMENT,{ownerId:id});
  }
  function loadRound(id,game){const value=profile(id).rounds?.[game];return value?.version===1?clone(value.state):null;}
  function saveRound(id,game,value){const state=profile(id);state.rounds=state.rounds||{};state.rounds[game]={version:1,state:clone(value)};return write(PREFIX+id,state);}
  function clearRound(id,game){const state=profile(id);if(state.rounds)delete state.rounds[game];return write(PREFIX+id,state);}
  return {rewards,saveRewards,completeReward,legacyPending,assignLegacy,loadRound,saveRound,clearRound};
 }
 const api={createStore,PREFIX,LEGACY,ASSIGNMENT,versionsFor,completionCount};root.MemoryProgress=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
