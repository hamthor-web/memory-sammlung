/* Profile IDs, never names, own progress. Legacy data stays untouched as a backup. */
(function(root){
 'use strict';
 const PREFIX='memory-progress-v1:',LEGACY='verrueckt-gesucht-rewards-v1',ASSIGNMENT='memory-legacy-rewards-owner-v1';
 const clone=value=>JSON.parse(JSON.stringify(value));
 const emptyRewards=()=>({used:[],finished:{}});
 function createStore(storage,onError=()=>{}){
  function read(key,fallback){try{const value=storage.getItem(key);return value?JSON.parse(value):fallback;}catch(error){onError(error);return fallback;}}
  function write(key,value){try{storage.setItem(key,JSON.stringify(value));return true;}catch(error){onError(error);return false;}}
  function profile(id){if(!id)throw Error('Bitte zuerst ein Kind auswählen.');const value=read(PREFIX+id,{});return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}
  function assignedLegacy(id){const assignment=read(ASSIGNMENT,null);if(assignment?.ownerId!==id)return emptyRewards();return read(LEGACY,emptyRewards())||emptyRewards();}
  function rewards(id){const state=profile(id),legacy=assignedLegacy(id),current=state.rewards||emptyRewards();return clone({used:state.legacyImported?current.used:[...new Set([...(legacy.used||[]),...current.used])],finished:{...legacy.finished,...current.finished}});}
  function saveRewards(id,value){const state=profile(id),legacy=assignedLegacy(id),finished={};
   // Inherited legacy images remain in their original backup, avoiding a second large copy.
   for(const [key,entry] of Object.entries(value.finished))if(JSON.stringify(entry)!==JSON.stringify(legacy.finished?.[key]))finished[key]=entry;
   state.rewards={used:clone(value.used),finished};if(read(ASSIGNMENT,null)?.ownerId===id)state.legacyImported=true;return write(PREFIX+id,state);
  }
  function legacyPending(){const value=read(LEGACY,null);return !read(ASSIGNMENT,null)&&value&&((value.used||[]).length||Object.keys(value.finished||{}).length)>0;}
  function assignLegacy(id){profile(id);if(read(ASSIGNMENT,null)||!read(LEGACY,null))return false;
   // One tiny atomic write assigns the original backup without copying its image data.
   return write(ASSIGNMENT,{ownerId:id});
  }
  function loadRound(id,game){const value=profile(id).rounds?.[game];return value?.version===1?clone(value.state):null;}
  function saveRound(id,game,value){const state=profile(id);state.rounds=state.rounds||{};state.rounds[game]={version:1,state:clone(value)};return write(PREFIX+id,state);}
  function clearRound(id,game){const state=profile(id);if(state.rounds)delete state.rounds[game];return write(PREFIX+id,state);}
  return {rewards,saveRewards,legacyPending,assignLegacy,loadRound,saveRound,clearRound};
 }
 const api={createStore,PREFIX,LEGACY,ASSIGNMENT};root.MemoryProgress=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
