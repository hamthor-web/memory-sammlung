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
ids.rewardChoice.options=[...html.matchAll(/<option value="([^"]+)">([^<]+)<\/option>/g)].filter(x=>!/^\d+$/.test(x[1])).map(x=>({value:x[1],textContent:x[2]}));
const storage=new Map();const localStorage={getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)};
const delays=[];
const context=vm.createContext({localStorage,document:doc,window:{scrollTo(){},matchMedia:()=>({matches:true})},setTimeout:(f,ms)=>{delays.push(ms);f();return 1;},console});
for(const name of ['pfau-art.js','tree-art.js','tree.js','data.js','engine.js','pfau.js','knurpsel.js','rakete.js','matschwiese.js','unterwasserwelt.js','blumenwiese.js','wundereiche.js','baumhaus.js','marsmission.js','kinderzimmer.js','app.js'])vm.runInContext(fs.readFileSync('./'+name,'utf8'),context);
const get=code=>vm.runInContext(code,context);get('setRewardMode("manual")');
(async()=>{
// All full-page stories inherit the shared controller and opacity-only CSS.
const css=fs.readFileSync('./style.css','utf8');
for(const name of ['knurpsel-leave','knurpsel-enter','reward-arrive','pfau-arrive']){
 const rule=css.match(new RegExp('@keyframes '+name+'\\{from\\{([^}]*)\\}to\\{([^}]*)\\}\\}'));
 assert(rule,name+' exists');assert(!/transform|scale|filter|blur/.test(rule[1]+rule[2]));
}
assert(!/\.\w+-picture \.knurpsel-(?:enter|leave)\{animation:/.test(css),'No story overrides the shared crossfade');
for(const name of ['KnurpselReward','RocketReward','WonderOakReward','FlowerReward','BedroomReward','MarsMissionReward','TreehouseReward','UnderwaterReward','MeadowReward']){
 const view=get('new '+name+'.View(document.getElementById("treeMount"),document.getElementById("treeCounter"),document.getElementById("treeDialog"),()=>{})');
 assert(view instanceof context.KnurpselReward.View);assert([1500,2000].includes(view.art.duration));
}
get('rewardHistory={used:[],finished:{}}');

assert.equal(get('FlowerReward.stages.length'),11); for(let i=1;i<=10;i++){assert.equal(get('FlowerReward.stages['+i+']'),`assets/blumenwiese/blumenwiese-${String(i).padStart(2,'0')}.webp`);assert(fs.existsSync(get('FlowerReward.stages['+i+']')));}

for(const mode of ['blumenwiese'])for(const size of [6,9,12])for(const level of [1,2,3]){
 get('rewardHistory={used:[],finished:{}}');ids.rewardChoice.value=mode;
 ids.size.value=String(size);ids.group.value='0';get('level='+level);get('start()');if(mode==='pfau'){assert.equal(get('reward.state.round.filter(x=>x.si<=8).length'),7);assert.equal(get('reward.state.round.filter(x=>x.si>=9&&x.si<=11).length'),2);assert.equal(get('reward.state.round.filter(x=>x.si===12).length'),1);}
 assert.equal(get('reward.current.tag'),'div');assert.equal(get('reward.state.progress'),0);const plan=get('reward.state.round.map(x=>x.si+":"+x.id).join("|")');assert.equal(get('reward.picture.children.length'),1);
 for(let i=1;i<=10;i++){
  assert.equal(ids.board.children.length,size);assert.equal(get('number'),i);assert.equal(get('reward.state.round.map(x=>x.si+":"+x.id).join("|")'),plan);
  const wrong=get('round.deck.find(c=>c.id!==round.answer)');await context.choose(wrong,new Node());assert.equal(get('reward.state.progress'),i-1);
  const previous=get('reward.picture.querySelectorAll(".reward-sprite")');const correct=get('round.deck.find(c=>c.id===round.answer)'),box=new Node();const award=context.choose(correct,box);await context.choose(correct,box);
  for(let flush=0;flush<12;flush++)await Promise.resolve();
  assert.equal(ids.treeDialog.open,true,'Every earned detail stays large until a tap');
  assert.equal(get('reward.waiting'),true);assert.equal(ids.next.hidden,true);
  assert.equal(ids.treeContinue.hidden,false);assert.equal(ids.treeTitle.hidden,i<10);if(i===10)assert.equal(ids.treeTitle.textContent,'Aus etwas Kleinem ist etwas Schönes gewachsen!');assert(delays.includes(2000));
  if(i%3===0)ids.treeContinue.onclick();
  else if(i%3===1)get('reward.picture.onclick()');
  else get('reward.picture.listeners.keydown[0]({key:"Enter",preventDefault(){}})');
  await award;
  assert.equal(get('reward.state.progress'),i);assert.equal(get('reward.current.src'),`assets/blumenwiese/blumenwiese-${String(i).padStart(2,'0')}.webp`);assert.equal(get('reward.picture.children.length'),1);assert.equal(get('reward.picture.querySelectorAll(".knurpsel-enter").length'),0);
  if(i<10){assert.equal(ids.treeDialog.open,false);assert.equal(ids.next.hidden,true);assert.equal(get('number'),i+1,'One tap opens the next task');}else{assert.equal(ids.treeDialog.open,false);assert.equal(ids.finish.hidden,false);assert(get('rewardHistory.finished.blumenwiese'));assert(JSON.parse(storage.get('verrueckt-gesucht-rewards-v1')).used.includes('blumenwiese'));}
 }
}
get('rewardHistory={used:[],finished:{}}');
// Navigating away during an animation cancels stale updates; new round starts empty.
get('start()');const pending=context.choose(get('round.deck.find(c=>c.id===round.answer)'),new Node());get('show("setup")');await pending;assert.equal(ids.treeDialog.open,false);get('start()');assert.equal(get('reward.state.progress'),0);assert.equal(get('reward.picture.children.length'),1);
// Cancelling the inspection also releases the pending answer without advancing.
get('start()');const inspection=context.choose(get('round.deck.find(c=>c.id===round.answer)'),new Node());for(let flush=0;flush<12;flush++)await Promise.resolve();assert.equal(ids.treeDialog.open,true);get('show("setup")');await inspection;assert.equal(ids.treeDialog.open,false);assert.equal(ids.next.hidden,true);
// Switching from the peacock to meadow must remove every peacock picture.
ids.rewardChoice.value='pfau';get('start()');assert.equal(get('reward.art.kind'),'pfau');get('rewardHistory={used:[],finished:{}}');
ids.rewardChoice.value='blumenwiese';get('start()');assert.equal(get('reward.art.kind'),'blumenwiese');
assert.equal(ids.treeMount.children.length,1);assert.equal(get('reward.picture.querySelectorAll(".pfau-base").length'),0);
assert.equal(get('reward.picture.querySelectorAll(".pfau-piece").length'),0);
for(const [,path] of html.matchAll(/(?:src|href)="([^"?]+\.(?:js|css))\?v=([^" ]+)"/g))assert(fs.existsSync(path));
assert(/app\.js\?v=/.test(html));
get('rewardHistory={used:[],finished:{}}');
// Controlled timers verify the old picture remains unchanged for the full hold.
const timers=[];context.setTimeout=(fn,ms)=>{timers.push({fn,ms});return 1;};context.window.matchMedia=()=>({matches:false});
get('start()');
const old=get('reward.current');
const timed=context.choose(get('round.deck.find(c=>c.id===round.answer)'),new Node());
assert.equal(old.attrs['aria-label'],'Deine Blumenwiese entsteht mit der ersten Lösung');assert.equal(timers[0].ms,2000);assert.equal(get('reward.current'),old);assert.equal(get('reward.picture.children.length'),1);assert.equal(ids.treeContinue.hidden,true);
ids.treeContinue.onclick();assert.equal(ids.treeDialog.open,true);
timers.shift().fn();for(let flush=0;flush<12;flush++)await Promise.resolve();
assert.equal(timers[0].ms,2050);assert.equal(get('reward.picture.children.length'),2);assert.equal(ids.treeContinue.hidden,true);
timers.shift().fn();for(let flush=0;flush<12;flush++)await Promise.resolve();
assert.equal(get('reward.waiting'),true);assert.equal(get('reward.picture.children.length'),1);assert.equal(ids.treeContinue.hidden,false);
ids.treeContinue.onclick();await timed;
assert(get('rewardIds.includes("blumenwiese")'));assert(get('availableRewards().includes("blumenwiese")'));
assert.equal(ids.rewardChoice.options.filter(o=>o.value==='blumenwiese').length,1);
get('rewardHistory={used:rewardIds.filter(id=>id!=="blumenwiese"),finished:{}};setRewardMode("random")');assert.equal(get('chooseRewardId()'),'blumenwiese');
console.log('OK: 9 vollständige Blumenwiese-Runden mit zehn Bildwechseln, Fehlversuchen, Doppelklicks, Betrachtungspausen, Tastaturbedienung, Abschluss und Abbruch.');
})().catch(e=>{console.error(e);process.exitCode=1;});

