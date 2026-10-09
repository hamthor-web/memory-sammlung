(function(root){
 const KEY='fuehlmemory-profiles-v1';
 function createStore(storage,makeId=()=>globalThis.crypto.randomUUID()){
  let persistent=true,state={profiles:[],activeId:null};
  try{const parsed=JSON.parse(storage.getItem(KEY)||'null');if(parsed&&Array.isArray(parsed.profiles)){const ids=new Set();state.profiles=parsed.profiles.filter(p=>p&&typeof p.id==='string'&&p.id&&typeof p.name==='string'&&p.name.trim()&&!ids.has(p.id)&&ids.add(p.id)).map(p=>({id:p.id,name:p.name.trim().slice(0,32),level:[1,2,3].includes(p.level)?p.level:1,count:[6,12,18].includes(p.count)?p.count:6}));state.activeId=state.profiles.some(p=>p.id===parsed.activeId)?parsed.activeId:null;}}catch{persistent=false;}
  function save(){try{storage.setItem(KEY,JSON.stringify(state));persistent=true;}catch{persistent=false;}}
  function list(){return state.profiles.map(p=>({...p}));}
  function active(){return list().find(p=>p.id===state.activeId)||null;}
  function select(id){if(!state.profiles.some(p=>p.id===id))throw Error('Dieses Profil ist nicht mehr vorhanden.');state.activeId=id;save();return active();}
  function create(value){const name=String(value||'').normalize('NFC').trim().slice(0,32);if(!name)throw Error('Bitte einen Namen eingeben.');if(state.profiles.some(p=>p.name.normalize('NFC').toLocaleLowerCase('de')===name.toLocaleLowerCase('de')))throw Error('Diesen Namen gibt es schon. Wähle das vorhandene Profil.');const p={id:makeId(),name,level:1,count:6};state.profiles.push(p);return select(p.id);}
  function settings(level,count){const p=state.profiles.find(p=>p.id===state.activeId);if(!p)return;if(![1,2,3].includes(level)||![6,12,18].includes(count))throw Error('Ungültige Spieleinstellung.');p.level=level;p.count=count;save();}
  return {list,active,select,create,settings,isPersistent:()=>persistent};
 }
 const api={createStore,KEY};root.MemoryProfiles=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
