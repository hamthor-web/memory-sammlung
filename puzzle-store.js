/* Puzzle rewards share the existing profile backup, but never the search-game rewards. */
(function(root){
 'use strict';
 function createStore(storage,ids,onError=()=>{}){
  const valid=new Set(ids),prefix='memory-progress-v1:';
  function read(id){if(!id)throw Error('Bitte zuerst ein Kind auswählen.');return JSON.parse(storage.getItem(prefix+id)||'{}');}
  function state(profile){const s=profile.propertyPuzzles;return s&&s.version===1?s:{version:1,selected:null,pieces:{},receipts:{}};}
  function transaction(id,change){try{const profile=read(id),s=state(profile),result=change(s);profile.propertyPuzzles=s;storage.setItem(prefix+id,JSON.stringify(profile));return result;}catch(error){onError(error);return null;}}
  function load(id){try{return JSON.parse(JSON.stringify(state(read(id))));}catch(error){onError(error);return {version:1,selected:null,pieces:{},receipts:{}};}}
  function count(s,id){return Math.min(6,Math.max(0,Number(s.pieces[id])||0));}
  function select(id,puzzle){if(!valid.has(puzzle))return false;return transaction(id,s=>{s.selected=puzzle;return true;})===true;}
  function award(id,run){
   if(!run||!run.id||!valid.has(run.puzzle)||![1,2,3].includes(run.level)||run.duo||!run.complete)return null;
   return transaction(id,s=>{
    if(s.receipts[run.id])return s.receipts[run.id];
    let left=run.level,puzzle=run.puzzle;const grants=[];
    while(left){
     if(count(s,puzzle)>=6)puzzle=ids.find(key=>count(s,key)<6);
     if(!puzzle)break;
     const before=count(s,puzzle),added=Math.min(left,6-before);s.pieces[puzzle]=before+added;
     grants.push({id:puzzle,before,after:before+added,added});left-=added;s.selected=puzzle;
    }
    const receipt={grants,total:grants.reduce((sum,g)=>sum+g.added,0)};s.receipts[run.id]=receipt;return receipt;
   });
  }
  function layout(id,puzzle,positions){
   if(!valid.has(puzzle)||!Array.isArray(positions)||positions.length>6)return false;
   return transaction(id,s=>{s.layouts=s.layouts||{};s.layouts[puzzle]=positions.map(p=>({x:Number(p.x)||0,y:Number(p.y)||0,placed:p.placed===true}));return true;})===true;
  }
  return {load,count,select,award,layout};
 }
 const api={createStore};root.PropertyPuzzleStore=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
