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
 const partial=s=>catalog.filter(p=>count(s,p.id)>0&&count(s,p.id)<6);
 function random(s){const choices=catalog.filter(p=>count(s,p.id)<6);return choices[Math.floor(Math.random()*choices.length)]?.id||s.selected||catalog[0].id;}
 function picture(id,n,freshFrom=6){
  const p=byId(id),ns='http://www.w3.org/2000/svg',prefix='puzzle'+(++serial)+'-';
  function el(tag,attributes={}){const e=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attributes))e.setAttribute(k,v);return e;}
  const svg=el('svg',{viewBox:`0 0 ${p.width} ${p.height}`,role:'img','aria-label':`${p.title}: ${n} von 6 Teilen`});svg.classList.add('puzzle-picture');
  const defs=el('defs');svg.append(defs);
  const gray=el('image',{href:p.image,width:p.width,height:p.height});gray.classList.add('puzzle-gray');svg.append(gray);
  p.paths.forEach((d,i)=>{const clip=el('clipPath',{id:prefix+i}),path=el('path',{d});clip.append(path);defs.append(clip);
   if(i<n){const g=el('g',{'clip-path':`url(#${prefix+i})`});g.append(el('image',{href:p.image,width:p.width,height:p.height}));if(i>=freshFrom)g.classList.add('puzzle-new');svg.append(g);}
   if(n<6)svg.append(el('path',{d,fill:'none',stroke:'#fff','stroke-width':Math.max(p.width,p.height)/230,'stroke-linejoin':'round'}));
  });return svg;
 }
 function refresh(){
  const s=state(),id=s.selected,active=byId(id);$('puzzleSetup').hidden=duo;
  $('puzzleResume').disabled=!partial(s).length;
  const chosen=active&&count(s,id)<6?active:null;
  $('puzzleCurrent').textContent=chosen?`Dein Puzzle: ${chosen.title} · ${count(s,id)} von 6 Teilen`:'Wähle dein Puzzle oder lass dich überraschen.';
  $('puzzlePreview').replaceChildren();if(chosen)$('puzzlePreview').append(picture(id,count(s,id)));
  for(const [button,value]of [['puzzleManual','choose'],['puzzleRandom','random'],['puzzleResume','resume']])$(button).setAttribute('aria-pressed',String(mode===value));
 }
 function choose(id){if(!owner()||!store.select(owner(),id))return;mode='resume';$('puzzleDialog').close();refresh();}
 function open(kind){
  view=kind;const s=state(),grid=$('puzzleChoices');grid.replaceChildren();
  $('puzzleDialogTitle').textContent=kind==='gallery'?'Meine Puzzle':kind==='resume'?'Welches Puzzle möchtest du fertigstellen?':'Welches Puzzle möchtest du wählen?';
  $('puzzleDialogHint').textContent=kind==='gallery'?'Deine fertigen Bilder sind bunt. Die anderen Bilder bleiben grau.':kind==='resume'?'Deine gesammelten Teile bleiben erhalten.':'Nach jeder fertigen Runde wird dein Bild bunter.';
  const items=kind==='resume'?partial(s):catalog;
  for(const p of items){const n=count(s,p.id),card=document.createElement('button');card.type='button';card.className='puzzle-choice';
   card.append(picture(p.id,kind==='gallery'?(n===6?6:0):n));
   const label=document.createElement('strong');label.textContent=p.title;const status=document.createElement('span');status.textContent=n===6?'Fertig!':`${n} von 6 Teilen`;card.append(label,status);
   if(kind==='gallery'){card.classList.toggle('puzzle-unsolved',n<6);card.disabled=n<6;card.onclick=()=>{openImage(p.id);};}
   else{card.disabled=n===6;card.setAttribute('aria-pressed',String(s.selected===p.id));card.onclick=()=>choose(p.id);}
   grid.append(card);
  }
  if(!$('puzzleDialog').open)$('puzzleDialog').showModal();
 }
 function openImage(id){$('puzzleImageTitle').textContent=byId(id).title;$('puzzleImageMount').replaceChildren(picture(id,6));$('puzzleImageDialog').showModal();}
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
  for(const g of receipt.grants){const figure=document.createElement('figure'),caption=document.createElement('figcaption');figure.append(picture(g.id,g.after,g.before));caption.textContent=`${byId(g.id).title} · ${g.after} von 6 Teilen${g.after===6?' · Dein Bild ist fertig!':''}`;figure.append(caption);mount.append(figure);}
  const prompt=document.createElement('p');prompt.textContent=!receipt.total?'Du hast schon alle Puzzle fertig! Noch ein Spiel?':receipt.grants.at(-1)?.after===6?'Dein Bild ist fertig! Noch ein Spiel?':'Bald ist dein Bild fertig! Noch ein Spiel?';mount.append(prompt);
  const confetti=$('puzzleConfetti');confetti.replaceChildren();for(let i=0;i<26;i++){const bit=document.createElement('i');bit.style.setProperty('--x',Math.random()*100+'%');bit.style.setProperty('--delay',Math.random()*.7+'s');bit.style.setProperty('--color',['#c2dd8f','#dd97c6','#97c6dd','#efc568'][i%4]);confetti.append(bit);}
  refresh();return true;
 }
 $('puzzleManual').onclick=()=>{mode='choose';refresh();open('choose');};
 $('puzzleRandom').onclick=()=>{if(!owner())return;const id=random(state());if(store.select(owner(),id)){mode='random';refresh();}};
 $('puzzleResume').onclick=()=>{mode='resume';refresh();open('resume');};
 $('puzzleGallery').onclick=()=>open('gallery');$('puzzleDialogClose').onclick=()=>$('puzzleDialog').close();$('puzzleImageClose').onclick=()=>$('puzzleImageDialog').close();
 $('puzzleMenu').onclick=()=>{reset();window.scrollTo({top:0,behavior:'instant'});};
 let size=1;function zoom(v){size=Math.min(2,Math.max(.8,Math.round(v*10)/10));document.documentElement.style.setProperty('--field-zoom',size);$('fieldZoomValue').textContent=Math.round(size*100)+' %';}
 $('fieldZoomOut').onclick=()=>zoom(size-.1);$('fieldZoomIn').onclick=()=>zoom(size+.1);$('fieldZoomValue').onclick=()=>zoom(1);
 window.PropertyPuzzles={refresh,begin,complete,picture};refresh();
})();
