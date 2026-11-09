/* Six pieces per picture, earned only by completed solo rounds. */
(function(){
 'use strict';
 const $=id=>document.getElementById(id),catalog=PROPERTY_PUZZLES,byId=id=>catalog.find(p=>p.id===id);
 let mode='resume',serial=0,view='choose',store;
 function warning(){let p=$('puzzleSaveWarning');p.hidden=false;p.textContent='Dein Puzzle konnte nicht gespeichert werden. Bitte lass dir helfen und halte das Spiel geöffnet.';}
 try{store=PropertyPuzzleStore.createStore(localStorage,catalog.map(p=>p.id),warning);}catch{store=PropertyPuzzleStore.createStore({getItem(){throw Error('Speicher gesperrt');}},catalog.map(p=>p.id),warning);}
 const owner=()=>CollectionSession.profile()?.id;
 function state(){return owner()?store.load(owner()):{pieces:{},selected:null};}
 const count=(s,id)=>store.count(s,id);
 const partial=s=>catalog.filter(p=>count(s,p.id)>0&&!assembled(s,p.id));
 function random(s){const choices=catalog.filter(p=>count(s,p.id)<6);return choices[Math.floor(Math.random()*choices.length)]?.id||s.selected||catalog[0].id;}
 const assembled=(s,id)=>count(s,id)===6&&s.layouts?.[id]?.slice(0,6).filter(p=>p.placed).length===6;
 function picture(id,n,freshFrom=6,interactive=false){
  const p=byId(id),ns='http://www.w3.org/2000/svg',prefix='puzzle'+(++serial)+'-',child=owner();
  function el(tag,attributes={}){const e=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attributes))e.setAttribute(k,v);return e;}
  const wrap=document.createElement('div');wrap.className='puzzle-table';
  const svg=el('svg',{viewBox:`0 0 ${p.width*1.8} ${p.height*1.8}`,role:'group','aria-label':`${p.title}: ${n} von 6 Teilen gesammelt`});svg.classList.add('puzzle-picture');const viewport=document.createElement('div');viewport.className='puzzle-board-viewport';viewport.append(svg);wrap.append(viewport);
  const defs=el('defs');svg.append(defs);
  const current=state(),saved=(current.layouts?.[id]||[]).map((q,i)=>{
   const offset=(current.layoutVersions?.[id]||1)<(p.layoutVersion||1)?p.layoutOffsets?.[i]:null;
   return offset?{...q,x:q.x+offset.x,y:q.y+offset.y}:{...q};
  });
  const positions=Array.from({length:n},(_,i)=>saved[i]?{...saved[i]}:{x:0,y:0,placed:false});
  const status=document.createElement('p');status.className='puzzle-placement-status';status.setAttribute('role','status');
  function announce(){const placed=positions.filter(q=>q.placed).length;status.textContent=placed===6?'Dein Bild ist fertig!':`${placed} von ${n} gesammelten Teilen gelegt.`;}
  function save(){if(child!==owner())return;store.layout(child,id,positions,p.layoutVersion||1);announce();}
  if(interactive){const hint=document.createElement('p');hint.textContent='Schiebe die Teile zusammen. Du kannst ein Teil auch antippen und danach auf die gewünschte Stelle tippen.';wrap.prepend(hint);const controls=document.createElement('div');controls.className='zoom-controls';const label=document.createElement('strong');label.textContent='Spielfeldgröße';controls.append(label);for(const [text,delta]of [['−',-.1],['+',.1]]){const b=document.createElement('button');b.type='button';b.textContent=text;b.setAttribute('aria-label',delta<0?'Puzzle verkleinern':'Puzzle vergrößern');b.onclick=()=>zoom(size+delta);controls.append(b);}wrap.prepend(controls);wrap.append(status);announce();}
  let selected=null,drag=null;
  const nodes=[];
  function paint(i){const q=positions[i],b=nodes[i].box;nodes[i].g.setAttribute('transform',`translate(${q.x-b.x} ${q.y-b.y})`);nodes[i].g.classList.toggle('puzzle-placed',q.placed);}
  const neighbors=(i,j)=>Math.abs(i-j)===2||(Math.floor(i/2)===Math.floor(j/2)&&Math.abs(i-j)===1);
  function group(i){const result=new Set([i]);let more=true;while(more){more=false;for(const j of result)for(let k=0;k<n;k++)if(!result.has(k)&&neighbors(j,k)&&Math.hypot((positions[j].x-nodes[j].box.x)-(positions[k].x-nodes[k].box.x),(positions[j].y-nodes[j].box.y)-(positions[k].y-nodes[k].box.y))<1){result.add(k);more=true;}}return [...result];}
  function mark(){let largest=[];for(let i=0;i<n;i++){const joined=group(i);if(joined.length>largest.length)largest=joined;}positions.forEach((q,i)=>q.placed=largest.length>1&&largest.includes(i));nodes.forEach((_,i)=>paint(i));}
  function drop(i,x,y,members=[i]){const q=positions[i],dx=x-q.x,dy=y-q.y;members.forEach(k=>{positions[k].x+=dx;positions[k].y+=dy;});
   // Join matching edges wherever the child lays them, without a hidden target grid.
   let snap=null;for(const j of members)for(let k=0;k<n;k++){if(members.includes(k)||!neighbors(j,k))continue;const sx=positions[k].x-nodes[k].box.x+nodes[j].box.x-positions[j].x,sy=positions[k].y-nodes[k].box.y+nodes[j].box.y-positions[j].y,d=Math.hypot(sx,sy);if(d<Math.min(p.width,p.height)*.10&&(!snap||d<snap.d))snap={x:sx,y:sy,d};}
   if(snap)members.forEach(k=>{positions[k].x+=snap.x;positions[k].y+=snap.y;});
   members=group(i);
   // Keep the complete connected group reachable on the tabletop.
   const minX=Math.min(...members.map(k=>positions[k].x)),minY=Math.min(...members.map(k=>positions[k].y)),maxX=Math.max(...members.map(k=>positions[k].x+nodes[k].box.width)),maxY=Math.max(...members.map(k=>positions[k].y+nodes[k].box.height));
   const cx=minX<0?-minX:maxX>p.width*1.8?p.width*1.8-maxX:0,cy=minY<0?-minY:maxY>p.height*1.8?p.height*1.8-maxY:0;members.forEach(k=>{positions[k].x+=cx;positions[k].y+=cy;});
   mark();save();
  }
  function point(e){return new DOMPoint(e.clientX,e.clientY).matrixTransform(svg.getScreenCTM().inverse());}
  p.paths.slice(0,n).forEach((d,i)=>{
   const clip=el('clipPath',{id:prefix+i});clip.append(el('path',{d}));defs.append(clip);
   const g=el('g',{'data-piece':i}),image=el('image',{href:p.image,width:p.width,height:p.height,'clip-path':`url(#${prefix+i})`});
   const path=el('path',{d,fill:'transparent',stroke:'#fff','stroke-width':Math.max(p.width,p.height)/500});
   g.append(image,path);g.classList.add('puzzle-piece');if(i>=freshFrom)g.classList.add('puzzle-new');svg.append(g);
   // The outline bounds are measured only after mounting; never draw target contours.
   nodes.push({g,path,box:null});
  });
  function initialize(){if(!svg.isConnected)return;
   nodes.forEach(node=>node.box=node.path.getBBox());
   nodes.forEach((node,i)=>{
    if(!saved[i]){
     let best=null;const gap=p.width*.025;
     for(let attempt=0;attempt<180;attempt++){
      const candidate={x:p.width*.025+Math.random()*Math.max(0,p.width*1.75-node.box.width),y:p.height*.025+Math.random()*Math.max(0,p.height*1.75-node.box.height)};
      let overlap=0;nodes.forEach((other,k)=>{if(k===i||(!saved[k]&&k>=i))return;overlap+=Math.max(0,Math.min(candidate.x+node.box.width+gap,positions[k].x+other.box.width+gap)-Math.max(candidate.x,positions[k].x))*Math.max(0,Math.min(candidate.y+node.box.height+gap,positions[k].y+other.box.height+gap)-Math.max(candidate.y,positions[k].y));});
      if(!best||overlap<best.overlap)best={...candidate,overlap};if(!overlap)break;
     }
     positions[i].x=best.x;positions[i].y=best.y;
    }
    positions[i].x=Math.max(0,Math.min(p.width*1.8-node.box.width,positions[i].x));positions[i].y=Math.max(0,Math.min(p.height*1.8-node.box.height,positions[i].y));paint(i);
    if(!interactive)return;
    const g=node.g;g.setAttribute('tabindex','0');g.setAttribute('role','button');g.setAttribute('aria-label',`Puzzleteil ${i+1}. Mit den Pfeiltasten verschieben.`);
    g.onpointerdown=e=>{if(e.button!==0||child!==owner())return;e.preventDefault();const v=point(e);selected=i;nodes.forEach(t=>t.g.classList.remove('puzzle-selected'));g.classList.add('puzzle-selected');svg.append(g);drag={i,start:v,members:group(i).map(k=>({k,x:positions[k].x,y:positions[k].y})),moved:false};g.setPointerCapture(e.pointerId);};
    g.onpointermove=e=>{if(!drag||drag.i!==i)return;const v=point(e),dx=v.x-drag.start.x,dy=v.y-drag.start.y;if(Math.hypot(dx,dy)>p.width*.01)drag.moved=true;drag.members.forEach(({k,x,y})=>{positions[k].x=x+dx;positions[k].y=y+dy;paint(k);});};
    g.onpointerup=e=>{if(!drag||drag.i!==i)return;const moved=drag.moved,members=drag.members.map(q=>q.k);drag=null;if(moved){drop(i,positions[i].x,positions[i].y,members);selected=null;g.classList.remove('puzzle-selected');}};
    g.onpointercancel=()=>{if(drag?.i===i){drag.members.forEach(({k,x,y})=>{positions[k].x=x;positions[k].y=y;paint(k);});drag=null;}};
    g.onkeydown=e=>{const delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!delta)return;e.preventDefault();const step=p.width*(e.shiftKey?.01:.025);drop(i,positions[i].x+delta[0]*step,positions[i].y+delta[1]*step,group(i));};
   });
   if(interactive&&n){mark();save();}
  }
  requestAnimationFrame(initialize);
  if(interactive)svg.addEventListener('touchstart',e=>{if(e.target.closest('.puzzle-piece'))e.preventDefault();},{passive:false});
  svg.onpointerdown=e=>{if(e.target!==svg||selected===null)return;const v=point(e),i=selected,b=nodes[i].box;drop(i,v.x-b.width/2,v.y-b.height/2,group(i));nodes[i].g.classList.remove('puzzle-selected');selected=null;};
  return wrap;
 }
 function openAssembly(id){$('puzzleImageTitle').textContent=byId(id).title;$('puzzleImageMount').replaceChildren(picture(id,count(state(),id),6,true));$('puzzleImageDialog').showModal();$('puzzleImageDialog').scrollTop=0;$('puzzleImageTitle').tabIndex=-1;$('puzzleImageTitle').focus({preventScroll:true});}
 function refresh(){
  const s=state(),id=s.selected,active=byId(id);$('puzzleSetup').hidden=duo;
  $('puzzleResume').disabled=!partial(s).length;
  const chosen=active?active:null;
  $('puzzleCurrent').textContent=chosen?`Dein Puzzle: ${chosen.title} · ${count(s,id)} von 6 Teilen`:'Wähle dein Puzzle oder lass dich überraschen.';
  $('puzzlePreview').replaceChildren();if(chosen){$('puzzlePreview').append(picture(id,count(s,id)));if(count(s,id)>0){const play=document.createElement('button');play.type='button';play.textContent='Puzzle zusammensetzen';play.onclick=()=>openAssembly(id);$('puzzlePreview').append(play);}}
  for(const [button,value]of [['puzzleManual','choose'],['puzzleRandom','random'],['puzzleResume','resume']])$(button).setAttribute('aria-pressed',String(mode===value));
 }
 function choose(id){if(!owner()||!store.select(owner(),id))return;mode='resume';$('puzzleDialog').close();refresh();}
 function open(kind){
  view=kind;const s=state(),grid=$('puzzleChoices');grid.replaceChildren();
  $('puzzleDialogTitle').textContent=kind==='gallery'?'Meine Puzzle':kind==='resume'?'Welches Puzzle möchtest du fertigstellen?':'Welches Puzzle möchtest du wählen?';
  $('puzzleDialogHint').textContent=kind==='gallery'?'Öffne deine gesammelten Teile und setze dein Puzzle zusammen.':kind==='resume'?'Deine Teile und dein Legestand bleiben erhalten.':'Nach jeder fertigen Runde bekommst du neue Teile zum Puzzeln.';
  const items=kind==='resume'?partial(s):catalog;
  for(const p of items){const n=count(s,p.id),card=document.createElement('button');card.type='button';card.className='puzzle-choice';
   card.append(picture(p.id,n));
   const label=document.createElement('strong');label.textContent=p.title;const status=document.createElement('span');status.textContent=assembled(s,p.id)?'Fertig!':`${n} von 6 Teilen gesammelt`;card.append(label,status);
   if(kind==='gallery'){card.classList.toggle('puzzle-unsolved',n<6);card.disabled=n===0;card.onclick=()=>{openAssembly(p.id);};}
   else{card.disabled=kind!=='resume'&&n===6;card.setAttribute('aria-pressed',String(s.selected===p.id));card.onclick=()=>{if(kind==='resume'){openAssembly(p.id);}else choose(p.id);};}
   grid.append(card);
  }
  if(!$('puzzleDialog').open)$('puzzleDialog').showModal();
  $('puzzleDialog').scrollTop=0;$('puzzleDialogTitle').tabIndex=-1;$('puzzleDialogTitle').focus({preventScroll:true});
 }
  function begin(){
  if(duo||!owner())return null;const s=state();let id=s.selected;
  if(mode==='random'||!byId(id)||count(s,id)>=6)id=random(s);
  if(!store.select(owner(),id))return null;refresh();
  return {id:crypto.randomUUID(),puzzle:id,owner:owner(),level,duo:false};
 }
 function complete(run){
  if(duo)return;
  const mount=$('puzzleReward'),title=$('finishTitle');mount.replaceChildren();
  if(!run||run.owner!==owner()){mount.textContent='Für diese ältere Runde ist noch kein Puzzle gewählt. In deiner nächsten Runde sammelst du Puzzleteile.';return true;}
  const receipt=store.award(owner(),{...run,complete:true});if(!receipt){mount.textContent='Deine neuen Teile konnten noch nicht gespeichert werden. Bitte halte das Spiel geöffnet.';return false;}
  title.textContent=['Prima!','Klasse gemacht!','Alles gefunden!'][Math.floor(Math.random()*3)];
  const intro=document.createElement('h3');intro.textContent=receipt.total===1?'Dein neues Puzzle-Teil:':`Deine ${receipt.total} neuen Puzzle-Teile:`;mount.append(intro);
  for(const g of receipt.grants){const figure=document.createElement('figure'),caption=document.createElement('figcaption');figure.append(picture(g.id,g.after,g.before,true));caption.textContent=`${byId(g.id).title} · ${g.after} von 6 Teilen${g.after===6?' · Alle Teile gesammelt!':''}`;figure.append(caption);mount.append(figure);}
  const prompt=document.createElement('p');prompt.textContent=!receipt.total?'Du hast schon alle Puzzleteile gesammelt! Noch ein Spiel?':receipt.grants.at(-1)?.after===6?'Alle Teile sind da. Jetzt kannst du dein Bild zusammensetzen!':'Setze deine Teile zusammen! Noch ein Spiel?';mount.append(prompt);
  const confetti=$('puzzleConfetti');confetti.replaceChildren();for(let i=0;i<26;i++){const bit=document.createElement('i');bit.style.setProperty('--x',Math.random()*100+'%');bit.style.setProperty('--delay',Math.random()*.7+'s');bit.style.setProperty('--color',['#c2dd8f','#dd97c6','#97c6dd','#efc568'][i%4]);confetti.append(bit);}
  refresh();return true;
 }
 $('puzzleManual').onclick=()=>{mode='choose';refresh();open('choose');};
 $('puzzleRandom').onclick=()=>{if(!owner())return;const id=random(state());if(store.select(owner(),id)){mode='random';refresh();}};
 $('puzzleResume').onclick=()=>{mode='resume';refresh();open('resume');};
 $('puzzleGallery').onclick=()=>open('gallery');$('puzzleDialogClose').onclick=()=>$('puzzleDialog').close();$('puzzleImageClose').onclick=()=>{$('puzzleImageDialog').close();refresh();if($('puzzleDialog').open)open(view);};
 $('puzzleMenu').onclick=()=>{reset();window.scrollTo({top:0,behavior:'instant'});};
 let size=1;function zoom(v){size=Math.min(2,Math.max(.8,Math.round(v*10)/10));document.documentElement.style.setProperty('--field-zoom',size);$('fieldZoomValue').textContent=Math.round(size*100)+' %';}
 $('fieldZoomOut').onclick=()=>zoom(size-.1);$('fieldZoomIn').onclick=()=>zoom(size+.1);$('fieldZoomValue').onclick=()=>zoom(1);
 window.PropertyPuzzles={refresh,begin,complete,picture};refresh();
})();
