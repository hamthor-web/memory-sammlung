const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
require('./tree-art.js');require('./pfau-art.js');require('./engine.js');const T=require('./tree.js');const P=require('./pfau.js');let seed=19;const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
for(let i=0;i<1000;i++){const r=T.plan(TREE_ART,10,rng);assert.equal(r.length,10);assert.equal(new Set(r.map(x=>x.id)).size,10);assert.equal(new Set(r.map(x=>x.si)).size,10);for(const x of r)assert(x.slot.cats.includes(TREE_ART.categories[x.id]));const p=new T.Progress(r);for(let j=0;j<10;j++){assert(p.award('q'+j));assert.equal(p.award('q'+j),null);}assert(p.complete);assert.equal(p.award('extra'),null);}
const featherSeen=new Set(),footSeen=new Set();for(let i=0;i<1000;i++){const r=P.plan(PFAU_ART,rng);assert.equal(r.length,10);assert.equal(new Set(r.map(x=>x.si)).size,10);assert.equal(r.filter(x=>x.si<=8).length,7);assert.equal(r.filter(x=>x.si>=9&&x.si<=11).length,2);assert.equal(r.filter(x=>x.si===12).length,1);assert.equal(new Set(r.map(x=>x.id)).size,10);assert.equal(r.filter(x=>x.si<=8&&x.id.startsWith('feder_neu_')).length,4);footSeen.add(r.find(x=>x.si===12).id);for(const x of r){if(x.si===12){assert(PFAU_ART.footVariants.some(v=>v.asset===x.id));assert(PFAU_ART.sources[x.id]);}else if(x.si===9||x.si===10){assert((x.si===9?PFAU_ART.headVariants:PFAU_ART.faceVariants).some(v=>v.asset===x.id));}else if(x.si<=8){featherSeen.add(x.id);assert(PFAU_ART.slots.includes(x.slot)||PFAU_ART.extraFeathers.some(f=>f.layouts.includes(x.slot)));}else assert.equal(x.slot,PFAU_ART.slots.find(p=>p.si===x.si));const [bx,by]=P.badge(PFAU_ART,x.slot);assert(bx>=0&&bx<=100&&by>=0&&by<=100);}}
assert.equal(featherSeen.size,21,'All eight original and thirteen new feathers must be selected');
assert.equal(footSeen.size,5,'All five shoe variants must be selected');
const heads=new Set(),faces=new Set();for(let i=0;i<1000;i++){for(const x of P.plan(PFAU_ART,rng)){if(x.si===9)heads.add(x.id);if(x.si===10)faces.add(x.id);}}assert.equal(heads.size,3);assert.equal(faces.size,2);assert(PFAU_ART.clawClip.includes('89.2%'));
// Minimal DOM harness exercises the actual app and reward controller together.
class Node {
 constructor(tag='div'){this.tag=tag;this.children=[];this.dataset={};this.style={};this.attrs={};this.hidden=false;this.open=false;this.listeners={};this.className='';this.classList={add:(...xs)=>{this.className=[...new Set([...this.className.split(' ').filter(Boolean),...xs])].join(' ');},remove:(...xs)=>{this.className=this.className.split(' ').filter(x=>!xs.includes(x)).join(' ');},toggle:(x,yes)=>{if(yes===undefined)yes=!this.className.split(' ').includes(x);this.classList[yes?'add':'remove'](x);}};}
 append(...xs){for(const x of xs){x.remove();x.parent=this;this.children.push(x);}}
 remove(){if(this.parent){this.parent.children=this.parent.children.filter(x=>x!==this);this.parent=null;}}
 replaceChildren(...xs){for(const x of [...this.children])x.remove();this.append(...xs);}
 setAttribute(k,v){this.attrs[k]=v;}
 addEventListener(k,f){(this.listeners[k]??=[]).push(f);}
 querySelectorAll(s){const found=[];const match=n=>s==='[data-level]'?n.dataset.level!==undefined:s.startsWith('[data-si=')?n.dataset.si==s.match(/"([^"]+)"/)[1]:n.className.split(' ').includes(s.slice(1));const walk=n=>{for(const c of n.children){if(match(c))found.push(c);walk(c);}};walk(this);return found;}
 querySelector(s){return this.querySelectorAll(s)[0]||null;}
 focus(){} showModal(){this.open=true;} close(){this.open=false;for(const f of this.listeners.close||[])f();}
}
const body=new Node('body'),ids={};const html=fs.readFileSync('./index.html','utf8');for(const [,id] of html.matchAll(/id="([^"]+)"/g)){ids[id]=new Node();body.append(ids[id]);}
for(let i=1;i<=3;i++){const n=new Node('button');n.dataset.level=String(i);body.append(n);}
const doc={body,getElementById:id=>ids[id],createElement:tag=>new Node(tag),querySelectorAll:s=>body.querySelectorAll(s)};
const context=vm.createContext({document:doc,window:{scrollTo(){},matchMedia:()=>({matches:true})},setTimeout:f=>{f();return 1;},console});
for(const name of ['pfau-art.js','tree-art.js','tree.js','data.js','engine.js','pfau.js','app.js'])vm.runInContext(fs.readFileSync('./'+name,'utf8'),context);
const get=code=>vm.runInContext(code,context);
(async()=>{
for(const mode of ['baum','pfau'])for(const size of [6,8,10,12])for(const level of [1,2,3]){
 ids.rewardChoice.value=mode;
 ids.size.value=String(size);ids.group.value='0';get('level='+level);get('start()');if(mode==='pfau'){assert.equal(get('reward.state.round.filter(x=>x.si<=8).length'),7);assert.equal(get('reward.state.round.filter(x=>x.si>=9&&x.si<=11).length'),2);assert.equal(get('reward.state.round.filter(x=>x.si===12).length'),1);}
 const plan=get('reward.state.round.map(x=>x.si+":"+x.id).join("|")');assert.equal(get('reward.picture.querySelectorAll(".reward-slot").length'),10);
 for(let i=1;i<=10;i++){
  assert.equal(ids.board.children.length,size);assert.equal(get('number'),i);assert.equal(get('reward.state.round.map(x=>x.si+":"+x.id).join("|")'),plan);
  const wrong=get('round.deck.find(c=>c.id!==round.answer)');await context.choose(wrong,new Node());assert.equal(get('reward.state.progress'),i-1);
  const previous=get('reward.picture.querySelectorAll(".reward-sprite")');const correct=get('round.deck.find(c=>c.id===round.answer)'),box=new Node();const award=context.choose(correct,box);await context.choose(correct,box);
  for(let flush=0;flush<8;flush++)await Promise.resolve();
  assert.equal(ids.treeDialog.open,true,'Every earned detail stays large until a tap');
  assert.equal(get('reward.waiting'),true);assert.equal(ids.next.hidden,true);
  assert.equal(ids.treeContinue.hidden,false);
  if(i%3===0)ids.treeContinue.onclick();
  else if(i%3===1)get('reward.picture.onclick()');
  else get('reward.picture.listeners.keydown[0]({key:"Enter",preventDefault(){}})');
  await award;
  assert.equal(get('reward.state.progress'),i);const now=get('reward.picture.querySelectorAll(".reward-sprite")');for(const node of previous)assert(now.includes(node),'Previously earned piece must keep its DOM identity');assert.equal(get('reward.picture.querySelectorAll(".pfau-flight").length'),0,'Settled pieces must not retain an animation class');if(mode==='pfau')for(const node of now)for(const image of node.children){assert.equal(image.style.animation,'none');assert.equal(image.style.transform,'none');}if(mode==='pfau'&&get('reward.state.round.slice(0,reward.state.progress).some(x=>x.si===12)')){assert.equal(get('reward.base.src===PFAU_ART.base'),true);assert.equal(get('reward.foreground.src===PFAU_ART.foreground'),true);assert.equal(get('reward.base.style.clipPath===PFAU_ART.clawClip'),true);assert.equal(get('reward.foreground.style.clipPath===PFAU_ART.clawClip'),true);}assert.equal(get('reward.picture.querySelectorAll(".reward-slot").length'),10-i);assert.equal(get('reward.picture.querySelectorAll(".reward-sprite").length'),i);
  if(i<10){assert.equal(ids.treeDialog.open,false);assert.equal(ids.next.hidden,true);assert.equal(get('number'),i+1,'One tap opens the next task');}else{assert.equal(ids.treeDialog.open,false);assert.equal(ids.finish.hidden,false);}
 }
}
// Navigating away during an animation cancels stale updates; new round starts empty.
get('start()');const pending=context.choose(get('round.deck.find(c=>c.id===round.answer)'),new Node());get('show("setup")');await pending;assert.equal(ids.treeDialog.open,false);get('start()');assert.equal(get('reward.state.progress'),0);assert.equal(get('reward.picture.querySelectorAll(".reward-slot").length'),10);
// Cancelling the inspection also releases the pending answer without advancing.
get('start()');const inspection=context.choose(get('round.deck.find(c=>c.id===round.answer)'),new Node());for(let flush=0;flush<8;flush++)await Promise.resolve();assert.equal(ids.treeDialog.open,true);get('show("setup")');await inspection;assert.equal(ids.treeDialog.open,false);assert.equal(ids.next.hidden,true);
console.log('OK: 1000 Baumpläne, 1000 Pfaupläne und 24 vollständige Spielrunden für Baum und Pfau mit Fehlversuchen, Doppelklicks, Abschlussanzeige und Neustart.');
})().catch(e=>{console.error(e);process.exitCode=1;});

