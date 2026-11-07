const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
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
for(const name of ['pfau-art.js','tree-art.js','tree.js','data.js','engine.js','pfau.js','knurpsel.js','rakete.js','app.js'])vm.runInContext(fs.readFileSync('./'+name,'utf8'),context);
const get=code=>vm.runInContext(code,context);
(async()=>{
const config=JSON.parse(fs.readFileSync('rakete-fortschritt.json'));assert.deepEqual(Array.from(get('RocketReward.stages').slice(1)),config.steps.map(x=>x.image));for(const step of config.steps)assert(fs.existsSync(step.image));

for(const mode of ['rakete'])for(const size of [6,9,12])for(const level of [1,2,3]){
 ids.rewardChoice.value=mode;
 ids.size.value=String(size);ids.group.value='0';get('level='+level);get('start()');if(mode==='pfau'){assert.equal(get('reward.state.round.filter(x=>x.si<=8).length'),7);assert.equal(get('reward.state.round.filter(x=>x.si>=9&&x.si<=11).length'),2);assert.equal(get('reward.state.round.filter(x=>x.si===12).length'),1);}
 assert.equal(get('reward.current.tag'),'div');assert.equal(get('reward.state.progress'),0);const plan=get('reward.state.round.map(x=>x.si+":"+x.id).join("|")');assert.equal(get('reward.picture.children.length'),1);
 for(let i=1;i<=10;i++){
  assert.equal(ids.board.children.length,size);assert.equal(get('number'),i);assert.equal(get('reward.state.round.map(x=>x.si+":"+x.id).join("|")'),plan);
  const wrong=get('round.deck.find(c=>c.id!==round.answer)');await context.choose(wrong,new Node());assert.equal(get('reward.state.progress'),i-1);
  const previous=get('reward.picture.querySelectorAll(".reward-sprite")');const correct=get('round.deck.find(c=>c.id===round.answer)'),box=new Node();const award=context.choose(correct,box);await context.choose(correct,box);
  for(let flush=0;flush<12;flush++)await Promise.resolve();
  assert.equal(ids.treeDialog.open,true,'Every earned detail stays large until a tap');
  assert.equal(get('reward.waiting'),true);assert.equal(ids.next.hidden,true);
  assert.equal(ids.treeTitle.textContent,i===10?"Deine Rakete ist jetzt fertig.":'');assert.equal(get('reward.art.duration'),2000);assert.equal(ids.treeContinue.hidden,false);
  if(i%3===0)ids.treeContinue.onclick();
  else if(i%3===1)get('reward.picture.onclick()');
  else get('reward.picture.listeners.keydown[0]({key:"Enter",preventDefault(){}})');
  await award;
  assert.equal(get('reward.state.progress'),i);assert.equal(get('reward.current.src'),`assets/rakete/rakete-${String(i).padStart(2,'0')}.png`);assert.equal(get('reward.picture.children.length'),1);assert.equal(get('reward.picture.querySelectorAll(".knurpsel-enter").length'),0);
  if(i<10){assert.equal(ids.treeDialog.open,false);assert.equal(ids.next.hidden,true);assert.equal(get('number'),i+1,'One tap opens the next task');}else{assert.equal(ids.treeDialog.open,false);assert.equal(ids.finish.hidden,false);}
 }
}
// Navigating away during an animation cancels stale updates; new round starts empty.
get('start()');const pending=context.choose(get('round.deck.find(c=>c.id===round.answer)'),new Node());get('show("setup")');await pending;assert.equal(ids.treeDialog.open,false);get('start()');assert.equal(get('reward.state.progress'),0);assert.equal(get('reward.picture.children.length'),1);
// Cancelling the inspection also releases the pending answer without advancing.
get('start()');const inspection=context.choose(get('round.deck.find(c=>c.id===round.answer)'),new Node());for(let flush=0;flush<12;flush++)await Promise.resolve();assert.equal(ids.treeDialog.open,true);get('show("setup")');await inspection;assert.equal(ids.treeDialog.open,false);assert.equal(ids.next.hidden,true);
console.log('OK: 9 vollständige Raketen-Runden mit zehn Bildwechseln, Fehlversuchen, Doppelklicks, Betrachtungspausen, Tastaturbedienung, Abschluss und Abbruch.');
})().catch(e=>{console.error(e);process.exitCode=1;});

