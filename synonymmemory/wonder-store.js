/* Progress is owned by a stable profile ID, not a typed player name. */
(function(root){
 'use strict';
 const empty=()=>({version:1,count:0,roundIds:[]});
 function valid(v){return v&&v.version===1&&Number.isInteger(v.count)&&v.count>=0&&v.count<=10&&Array.isArray(v.roundIds)&&v.roundIds.length===v.count&&new Set(v.roundIds).size===v.count&&v.roundIds.every(id=>typeof id==='string'&&id.length>0&&id.length<=200);}
 function createStore(storage,onError=()=>{}){
  function record(id){if(!id)throw Error('Bitte zuerst ein Kind auswählen.');const raw=storage.getItem('memory-progress-v1:'+id),value=raw?JSON.parse(raw):{};if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Der gespeicherte Fortschritt kann nicht gelesen werden.');if(value.wonderClearing!==undefined&&!valid(value.wonderClearing))throw Error('Die gespeicherte Lichtung kann nicht gelesen werden.');return value;}
  function load(id){try{return {ok:true,state:record(id).wonderClearing||empty()};}catch(error){onError(error);return {ok:false,state:null};}}
  function award(id,roundId){try{if(typeof roundId!=='string'||!roundId||roundId.length>200)throw Error('Diese Runde kann nicht zugeordnet werden.');const value=record(id),state=value.wonderClearing||empty();if(state.roundIds.includes(roundId)||state.count===10)return {ok:true,added:false,state};const next={version:1,count:state.count+1,roundIds:[...state.roundIds,roundId]};value.wonderClearing=next;storage.setItem('memory-progress-v1:'+id,JSON.stringify(value));return {ok:true,added:true,state:next};}catch(error){onError(error);return {ok:false,added:false,state:null};}}
  return {load,award};
 }
 const api={createStore,valid};root.WonderClearingStore=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
