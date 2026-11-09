/* Separate per-child tree progress inside the existing portable profile record. */
(function(root){
 'use strict';const ids=['herbst','mond','rosa','zauber'];
 function createStore(storage,onError=()=>{}){
  const empty=()=>({version:1,selected:null,counts:{},receipts:{},pending:null});
  function read(owner){if(!owner)throw Error('Bitte ein Kind auswählen.');return JSON.parse(storage.getItem('memory-progress-v1:'+owner)||'{}');}
  function state(p){if(p.wordTrees===undefined)return empty();const s=p.wordTrees;if(s?.version!==1||!s.counts||!s.receipts)throw Error('Baumfortschritt konnte nicht gelesen werden.');return s;}
  function load(owner){try{return JSON.parse(JSON.stringify(state(read(owner))));}catch(e){onError(e);return empty();}}
  function change(owner,fn){try{const p=read(owner),s=state(p),result=fn(s);p.wordTrees=s;storage.setItem('memory-progress-v1:'+owner,JSON.stringify(p));return result;}catch(e){onError(e);return null;}}
  const count=(s,id)=>Math.min(10,Math.max(0,Number(s.counts[id])||0));
  function select(owner,id){if(!ids.includes(id))return false;return change(owner,s=>{s.selected=id;return true;})===true;}
  function award(owner,run,id){if(typeof run!=='string'||!run||!ids.includes(id))return null;return change(owner,s=>{if(s.receipts[run])return s.receipts[run];if(s.pending)return null;const before=count(s,id);if(before>=10)return null;const receipt={run,tree:id,before,after:before+1,seen:false};s.counts[id]=receipt.after;s.receipts[run]=receipt;s.pending=receipt;s.selected=id;return receipt;});}
  function seen(owner,run){return change(owner,s=>{if(s.receipts[run])s.receipts[run].seen=true;if(s.pending?.run===run)s.pending=null;return true;});}
  return {load,count,select,award,seen};
 }
 const api={ids,createStore};root.WordTreeStore=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
