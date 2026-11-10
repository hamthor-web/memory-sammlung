/* One atomic profile record; a completed round can reward only one world. */
(function(root){'use strict';
 const worlds=['house','clearing'],emptyHouse=()=>({version:1,count:0,roundIds:[],introduced:false});
 const valid=v=>v&&v.version===1&&Number.isInteger(v.count)&&v.count>=0&&v.count<=10&&Array.isArray(v.roundIds)&&v.roundIds.length===v.count&&new Set(v.roundIds).size===v.count&&v.roundIds.every(x=>typeof x==='string'&&x.length>0&&x.length<=200);
 function createStore(storage){
  function record(id){if(!id)throw Error('Bitte zuerst ein Kind auswählen.');const raw=storage.getItem('memory-progress-v1:'+id),v=raw?JSON.parse(raw):{};if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Fortschritt nicht lesbar.');if(v.wonderClearing!==undefined&&!valid(v.wonderClearing))throw Error('Lichtung nicht lesbar.');if(v.synonymSuccess!==undefined){const s=v.synonymSuccess;if(s.version!==1||!worlds.includes(s.selected)||!['choose','random','resume'].includes(s.strategy)||!valid(s.house)||typeof s.house.introduced!=='boolean')throw Error('Märchenhaus nicht lesbar.');}return v;}
  const state=v=>v.synonymSuccess||{version:1,selected:'house',strategy:'choose',house:emptyHouse()};
  const view=v=>({state:state(v),counts:{house:state(v).house.count,clearing:v.wonderClearing?.count||0},house:state(v).house,clearing:v.wonderClearing||{version:1,count:0,roundIds:[]}});
  function load(id){try{return {ok:true,...view(record(id))};}catch(error){return {ok:false,error:error.message};}}
  function change(id,fn){try{const v=record(id),s=state(v),result=fn(v,s);v.synonymSuccess=s;storage.setItem('memory-progress-v1:'+id,JSON.stringify(v));return {ok:true,...view(v),...result};}catch(error){return {ok:false,error:error.message};}}
  function select(id,world,strategy='choose'){return change(id,(v,s)=>{if(!worlds.includes(world)||!['choose','random','resume'].includes(strategy))throw Error('Ungültige Auswahl.');s.selected=world;s.strategy=strategy;});}
  function begin(id){return change(id,(v,s)=>{const counts=view(v).counts,available=worlds.filter(w=>counts[w]<10);if(s.strategy==='random'||counts[s.selected]===10)s.selected=available[Math.floor(Math.random()*available.length)]||s.selected;return {world:s.selected};});}
  function award(id,{world,roundId,complete}){if(!complete||!worlds.includes(world)||typeof roundId!=='string'||!roundId||roundId.length>200)return {ok:false};return change(id,(v,s)=>{const h=s.house,c=v.wonderClearing;if(h.roundIds.includes(roundId)||c?.roundIds.includes(roundId))return {added:false};const target=world==='house'?h:(v.wonderClearing||{version:1,count:0,roundIds:[]});if(target.count===10)return {added:false};target.count++;target.roundIds.push(roundId);if(world==='clearing')v.wonderClearing=target;return {added:true};});}
  function introduced(id){return change(id,(v,s)=>{if(s.house.count)s.house.introduced=true;});}
  return {load,select,begin,award,introduced};
 }
 const api={createStore,valid};root.SynonymSuccessStore=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
