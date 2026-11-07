'use strict';
CollectionSession.requireProfile();
const data=GAME_DATA,E=QuestionEngine,matrix=E.buildMatrix(data),$=id=>document.getElementById(id);
// Mobile Hochformat-Erkennung auch für ungewöhnliche PWA-Viewport-Größen.
function adjustPortraitSetup(){
 const portrait=window.innerHeight>window.innerWidth*1.12;
 const touch=('ontouchstart' in window)||navigator.maxTouchPoints>0;
 const deviceShortSide=Math.min(window.screen?.width||window.innerWidth,window.screen?.height||window.innerHeight);
 document.documentElement.classList.toggle('vg-portrait-compact',portrait&&touch&&deviceShortSide<=1200);
}
adjustPortraitSetup();
window.addEventListener('resize',adjustPortraitSetup);
window.addEventListener('orientationchange',adjustPortraitSetup);

let level=1,number=0,round=null,locked=false,used=[],lastStyle=-1,errors=0,firstTry=0,missed=false,activeRewardId='pfau',rewardMode='random';
const rewardIds=['pfau','baum','knurpsel','rakete','blumenwiese','wundereiche','kinderzimmer','marsmission','baumhaus','unterwasserwelt','matschwiese'];
const rewardKey='verrueckt-gesucht-rewards-v1';
function loadRewards(){const obj=CollectionSession.rewards();return {used:obj.used.filter(x=>rewardIds.includes(x)),finished:obj.finished};}
let rewardHistory=loadRewards();
function saveRewards(){return CollectionSession.saveRewards(rewardHistory);}
document.addEventListener('collection:legacy-assigned',()=>{rewardHistory=loadRewards();refreshRewardPicker();if(currentScreen==='gallery')renderGallery();});
// Der Zufallsmodus durchläuft die elf Geschichten, bevor er sie erneut anbietet.
// Im manuellen Modus sind alle Geschichten jederzeit und auf jeder Spielstufe wählbar.
function availableRewards(){return rewardIds.filter(id=>!rewardHistory.used.includes(id));}
function refreshRewardPicker(){
 const remaining=availableRewards().length;
 $('rewardRemaining').textContent='Alle 11 Fortschrittsgeschichten sind jederzeit auswählbar. Im Überraschungsmodus wechseln sie ohne Wiederholung, bis alle einmal dran waren.';
 for(const option of $('rewardChoice').options){
  option.disabled=false;
  option.textContent=option.textContent.replace(/ ✓$/,'')+(rewardHistory.finished[option.value]?' ✓':'');
 }
}
function setRewardMode(mode){rewardMode=mode;$('rewardChoiceWrap').hidden=mode!=='manual';for(const [id,on] of [['rewardRandom',mode==='random'],['rewardManual',mode==='manual']]){const b=$(id);b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on));}refreshRewardPicker();}
$('rewardRandom').onclick=()=>setRewardMode('random');$('rewardManual').onclick=()=>setRewardMode('manual');
function chooseRewardId(){
 refreshRewardPicker();
 if(rewardMode==='manual')return $('rewardChoice').value;
 let avail=availableRewards();
 if(!avail.length){rewardHistory.used=[];saveRewards();avail=[...rewardIds];}
 return avail[Math.floor(Math.random()*avail.length)];
}
function rememberReward(){
 if(!rewardHistory.used.includes(activeRewardId))rewardHistory.used.push(activeRewardId);
 rewardHistory.finished[activeRewardId]={model:rewardModel(),date:new Date().toISOString()};
 return saveRewards();
}


for(const id of ['VG-01-01','VG-03-05','VG-10-03']){const c=data.cards.find(c=>c.id===id),im=document.createElement('img');im.src=c.image;im.alt='';$('sample').append(im);}
document.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{level=Number(b.dataset.level);document.querySelectorAll('[data-level]').forEach(x=>{const yes=x===b;x.classList.toggle('selected',yes);x.setAttribute('aria-pressed',String(yes));});});
let reward=new PeacockReward.View(PFAU_ART,$('treeMount'),$('treeCounter'),$('treeDialog'),finish);
let finishedSaved=false;
function finish(){finishedSaved=rememberReward();if(finishedSaved)CollectionSession.clear('verrueckt-gesucht');$('result').textContent=`${firstTry} Aufgaben hast du beim ersten Versuch gefunden.`;show('finish');}
const names=['','Einfach','Etwas schwieriger','Ganz schwierig'];
// Jede Spielansicht erhält einen eigenen Verlaufseintrag: Android-Zurück und
// Browser-Wischgeste kehren zur vorherigen Ansicht zurück statt die PWA zu beenden.
let currentScreen='setup',restoringHistory=false;
try{history.replaceState({...history.state,vgScreen:'setup'},'');}catch{}
function show(name,fromHistory=false){
 if(currentScreen==='play'&&name!=='play')checkpointVG();
 if(!fromHistory&&name!==currentScreen){
  try{history.pushState({vgScreen:name},'');}catch{}
 }
 currentScreen=name;
 document.body.classList.toggle('playing',name==='play');
 document.body.classList.toggle('view-gallery',name==='gallery');
 document.body.classList.toggle('view-finish',name==='finish');
 document.body.dataset.screen=name;
 if(name!=='play')reward.cancel();
 // WICHTIG: [hidden] allein reichte wegen früherer display:grid!important-
 // Hochformatregeln nicht aus. Wichtiges Inline-display hat Vorrang.
 for(const id of ['setup','play','finish','gallery']){
  const page=$(id),visible=id===name;
  page.hidden=!visible;
  page.style.removeProperty('display');
  if(!visible)page.style.setProperty('display','none','important');
  page.setAttribute('aria-hidden',String(!visible));
 }
 $('settingsButton').hidden=name==='setup';
 $('settingsButton').style.removeProperty('display');
 if(name==='setup')$('settingsButton').style.setProperty('display','none','important');
 document.documentElement.scrollTop=0;
 document.body.scrollTop=0;
 window.scrollTo(0,0);
 requestAnimationFrame(()=>{
  window.scrollTo(0,0);
  if(name==='play')fitBoard();
 });
}
window.addEventListener('popstate',e=>{
 const name=e.state?.vgScreen;
 if(['setup','play','finish','gallery'].includes(name))show(name,true);
 else if(currentScreen!=='setup')show('setup',true);
});
// Ergänzende Wischgeste innerhalb des Inhalts, auch wenn der Browser
// keine Zurückgeste bereitstellt. Vertikales Scrollen bleibt ungestört.
let startSwipe=null;
document.addEventListener('touchstart',e=>{
 if(e.touches.length!==1)return;
 const t=e.touches[0];
 startSwipe={x:t.clientX,y:t.clientY,time:Date.now()};
},{passive:true});
document.addEventListener('touchend',e=>{
 if(!startSwipe||e.changedTouches.length!==1)return;
 const t=e.changedTouches[0],dx=t.clientX-startSwipe.x,dy=t.clientY-startSwipe.y;
 const intent=dx>100&&Math.abs(dy)<Math.min(65,dx*.55)&&Date.now()-startSwipe.time<850;
 startSwipe=null;
 if(!intent)return;
 const dialog=Array.from(document.querySelectorAll('dialog[open]')).at(-1);
 if(dialog){if(dialog.id!=='treeDialog')dialog.close();return;}
 if(currentScreen!=='setup')history.back();
},{passive:true});
document.addEventListener('touchcancel',()=>{startSwipe=null;},{passive:true});
function createReward(){reward=activeRewardId==='blumenwiese'?new FlowerReward.View($('treeMount'),$('treeCounter'),$('treeDialog'),finish):activeRewardId==='wundereiche'?new WonderOakReward.View($('treeMount'),$('treeCounter'),$('treeDialog'),finish):activeRewardId==='kinderzimmer'?new BedroomReward.View($('treeMount'),$('treeCounter'),$('treeDialog'),finish):activeRewardId==='marsmission'?new MarsMissionReward.View($('treeMount'),$('treeCounter'),$('treeDialog'),finish):activeRewardId==='baumhaus'?new TreehouseReward.View($('treeMount'),$('treeCounter'),$('treeDialog'),finish):activeRewardId==='unterwasserwelt'?new UnderwaterReward.View($('treeMount'),$('treeCounter'),$('treeDialog'),finish):activeRewardId==='matschwiese'?new MeadowReward.View($('treeMount'),$('treeCounter'),$('treeDialog'),finish):activeRewardId==='rakete'?new RocketReward.View($('treeMount'),$('treeCounter'),$('treeDialog'),finish):activeRewardId==='knurpsel'?new KnurpselReward.View($('treeMount'),$('treeCounter'),$('treeDialog'),finish):activeRewardId==='baum'?new TreeReward.View(TREE_ART,$('treeMount'),$('treeCounter'),$('treeDialog'),finish):new PeacockReward.View(PFAU_ART,$('treeMount'),$('treeCounter'),$('treeDialog'),finish);}
function start(){finishedSaved=false;reward.cancel();activeRewardId=chooseRewardId();$('treeContinue').textContent='Weiter';createReward();$('treeMount').replaceChildren();number=0;used=[];errors=0;firstTry=0;reward.reset();show('play');nextRound();}
function nextRound(restored=null,savedText=null){const restoring=!!restored?.question;if(!restoring)number++;locked=false;if(!restoring)missed=false;$('next').hidden=true;$('feedback').textContent='Tippe auf das passende Bild.';
 try{round=restoring?restored:E.makeRound(data,matrix,{level,group:0,size:$('size').value,used});}catch(err){$('feedback').textContent=err.message;return;}
 if(!restoring)used.push(round.question.id);let style=Math.floor(Math.random()*7);if(style===lastStyle)style=(style+1)%7;lastStyle=style;
 $('question').textContent=savedText||round.question.variants[style];$('levelLabel').textContent=names[level];$('progressText').textContent=`Aufgabe ${number} von 10`;$('progressBar').style.width=`${(number-1)*10}%`;
 const board=$('board');board.replaceChildren();board.classList.toggle('many',Number($('size').value)>6);board.dataset.size=$('size').value;
 for(const c of round.deck){const box=document.createElement('div');box.className='card';box.dataset.id=c.id;const answer=document.createElement('button');answer.className='answer';answer.setAttribute('aria-label',`${c.motif}, Bild ${round.deck.indexOf(c)+1}`);const im=document.createElement('img');im.src=c.image;im.alt='';answer.append(im);answer.onclick=()=>choose(c,box);const zoom=document.createElement('button');zoom.className='zoomButton';zoom.textContent='⌕';zoom.setAttribute('aria-label',`${c.motif} vergrößern`);zoom.onclick=()=>openZoom(c);box.append(answer,zoom);board.append(box);}
 fitBoard();if(window.requestAnimationFrame)window.requestAnimationFrame(fitBoard);
 $('question').focus({preventScroll:true});checkpointVG();
}
async function choose(c,box){if(locked)return;if(c.id===round.answer){locked=true;box.classList.add('correct');if(!missed)firstTry++;$('feedback').textContent='Richtig! Du hast genau hingesehen.';$('next').textContent=number===10?'Runde beenden →':'Nächste Aufgabe →';document.querySelectorAll('.answer').forEach(b=>b.setAttribute('aria-disabled','true'));const active=reward;const award=reward.award(round.question.id);checkpointVG();const completed=await award;if(active!==reward||currentScreen!=='play')return;if(completed&&number<10){nextRound();window.scrollTo({top:0,behavior:'instant'});}$('progressBar').style.width=`${reward.state.progress*10}%`;}else{missed=true;errors++;box.classList.remove('wrong');void box.offsetWidth;box.classList.add('wrong');$('feedback').textContent=level===3?'Schau noch einmal: Was wird ausgeschlossen?':'Schau noch einmal auf die Merkmale in der Frage.';setTimeout(()=>box.classList.remove('wrong'),450);checkpointVG();}}
function openZoom(c){$('zoomImage').src=c.image;$('zoomImage').alt=c.motif;$('zoomLabel').textContent=c.motif;$('zoom').showModal();document.body.classList.add('zoomOpen');}
$('zoom').addEventListener('close',()=>document.body.classList.remove('zoomOpen'));$('closeZoom').onclick=()=>$('zoom').close();$('zoom').onclick=e=>{if(e.target===$('zoom'))$('zoom').close();};
function launchGame(){
 CollectionSession.clear('verrueckt-gesucht');
 const btn=$('start'),notice=$('startError');
 notice.hidden=true;
 btn.disabled=true;
 try{
  start();
  if($('play').hidden||!round||!$('board').children.length)throw Error('Die erste Spielrunde konnte nicht aufgebaut werden.');
 }catch(error){
  console.error('Verrückt gesucht! Startfehler:',error);
  // Falls nur die Navigationsansicht gewechselt hat, zurück zur Auswahl.
  show('setup',true);
  notice.textContent='Das Spiel konnte nicht gestartet werden: '+(error?.message||'Unbekannter Fehler')+'. Bitte aktualisiere die App und versuche es erneut.';
  notice.hidden=false;
 }finally{btn.disabled=false;}
}
$('start').onclick=launchGame;$('again').onclick=launchGame;$('choose').onclick=()=>show('setup');$('settingsButton').onclick=()=>show('setup');$('playBack').onclick=()=>show('setup');$('home').onclick=e=>{e.preventDefault();show('setup');};$('next').onclick=()=>{if(number===10){finish();}else{nextRound();window.scrollTo({top:0,behavior:'instant'});}};
$('downloadMatrix').onclick=()=>{const blob=new Blob([JSON.stringify({project:'Verrückt gesucht!',cardCount:120,questionCount:matrix.length,questions:matrix},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Verrueckt_gesucht_Fragenmatrix.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);};

function fitBoard(){
 const board=$('board');if($('play').hidden||typeof board.getBoundingClientRect!=='function')return;
 const landscape=window.matchMedia('(orientation: landscape)').matches,size=Number(board.dataset.size||6);
 const columns=size===6?2:size===9?3:landscape?4:3,rows=Math.ceil(size/columns);
 const rect=board.getBoundingClientRect(),gap=10,viewport=window.visualViewport?.height||window.innerHeight;
 const rowHeight=Math.floor((viewport-rect.top-16-gap*(rows-1))/rows);
 const columnWidth=Math.floor((rect.width-gap*(columns-1))/columns);
 board.style.setProperty('--card-image-height',Math.max(72,Math.min(320,columnWidth-16,rowHeight-16))+'px');
}
// Leseschriftgröße: dauerhaft je Gerät, unabhängig von Bild-Zoom und Spielstand.
const fontZoomKey='verrueckt-gesucht-aufgabenschrift-v1';
let textScale=1;
try{const saved=Number(localStorage.getItem(fontZoomKey));if(Number.isFinite(saved)&&saved>=0.85&&saved<=1.6)textScale=saved;}catch{}
function setTextScale(next){
 textScale=Math.round(Math.max(0.85,Math.min(1.6,next))*100)/100;
 document.documentElement.style.setProperty('--question-zoom-extra',Math.round((textScale-1)*34)+'px');
 $('textReset').textContent=Math.round(textScale*100)+' %';
 $('textSmaller').disabled=textScale<=0.85;
 $('textLarger').disabled=textScale>=1.6;
 try{localStorage.setItem(fontZoomKey,String(textScale));}catch{}
 fitBoard();
}
$('textSmaller').onclick=()=>setTextScale(textScale-0.15);
$('textLarger').onclick=()=>setTextScale(textScale+0.15);
$('textReset').onclick=()=>setTextScale(1);
setTextScale(textScale);
// Eigene Schriftgröße auf der Startseite, unabhängig vom Lesetext im Spiel.
const setupZoomKey='verrueckt-gesucht-startschrift-v1';
let setupScale=1;
try{const saved=Number(localStorage.getItem(setupZoomKey));if(Number.isFinite(saved)&&saved>=0.85&&saved<=1.6)setupScale=saved;}catch{}
function setSetupScale(next){
 setupScale=Math.round(Math.max(.85,Math.min(1.6,next))*100)/100;
 const offset=Math.round((setupScale-1)*22);
 document.documentElement.style.setProperty('--setup-extra',offset+'px');
 $('setupTextReset').textContent=Math.round(setupScale*100)+' %';
 $('setupTextSmaller').disabled=setupScale<=.85;
 $('setupTextLarger').disabled=setupScale>=1.6;
 try{localStorage.setItem(setupZoomKey,String(setupScale));}catch{}
}
$('setupTextSmaller').onclick=()=>setSetupScale(setupScale-.15);
$('setupTextLarger').onclick=()=>setSetupScale(setupScale+.15);
$('setupTextReset').onclick=()=>setSetupScale(1);
setSetupScale(setupScale);


window.addEventListener?.('resize',fitBoard);
window.visualViewport?.addEventListener('resize',fitBoard);

// Completed artwork gallery: snapshots preserve the exact random feather/slot layout of a finished round.
function openGallery(){
 checkpointVG();const profile=CollectionSession.profile();$('gallery').querySelector('h1').textContent=profile?profile.name+'s Bilder':'Meine Bilder';
 reward.cancel();
 show('gallery');
 renderGallery();
 requestAnimationFrame(()=>window.scrollTo(0,0));
}
function renderGallery(){
 const grid=$('galleryGrid');
 grid.replaceChildren();
 let count=0;
 for(const opt of $('rewardChoice').options){
  const id=opt.value,entry=rewardHistory.finished[id];
  // "Meine Bilder" zeigt nur bereits erspielte Geschichten, damit leere
  // Platzhalter die Galerie nicht auf mehrere Bildschirmhöhen strecken.
  if(!entry)continue;
  count++;
  const card=document.createElement('button');
  card.type='button';card.className='gallery-tile';card.disabled=false;
  const picture=document.createElement('div');picture.className='gallery-thumb';
  const parsed=document.createElement('div');parsed.innerHTML=entry.html||'';
  const scene=entry.model?rewardScene(entry.model,10):parsed.firstElementChild;
  if(scene){scene.removeAttribute('role');scene.removeAttribute('tabindex');picture.append(scene);}
  const label=document.createElement('strong');label.textContent=opt.textContent.replace(/ ✓$/,'');
  const status=document.createElement('small');status.textContent='Noch einmal ansehen';
  card.append(picture,label,status);
  card.onclick=()=>showGalleryPicture(id,label.textContent);
  grid.append(card);
 }
 if(!count){
  const empty=document.createElement('p');
  empty.className='gallery-empty';
  empty.textContent='Hier erscheinen deine fertigen Fortschrittsbilder. Spiele zuerst eine Runde, um dein erstes Bild zu sammeln.';
  grid.append(empty);
 }
}
let galleryFrames=[],galleryIndex=0,galleryRun=0,galleryBusy=false;
function galleryScene(html){const host=document.createElement('div');host.innerHTML=html;const scene=host.firstElementChild;if(!scene)return document.createElement('div');scene.removeAttribute('role');scene.removeAttribute('tabindex');scene.querySelectorAll('.reward-flight,.pfau-flight,.knurpsel-enter,.knurpsel-leave').forEach(node=>{node.classList.remove('reward-flight','pfau-flight','knurpsel-enter','knurpsel-leave');node.style.animation='none';});return scene;}
function replayFrames(id,entry){
 if(entry.model)return Array.from({length:11},(_,i)=>rewardScene(entry.model,i).outerHTML);
 const sequences={knurpsel:KnurpselReward,rakete:RocketReward,blumenwiese:FlowerReward,wundereiche:WonderOakReward,kinderzimmer:BedroomReward,marsmission:MarsMissionReward,baumhaus:TreehouseReward,unterwasserwelt:UnderwaterReward,matschwiese:MeadowReward};
 const sequence=sequences[id];
 if(sequence){return sequence.stages.filter(Boolean).map((src,i)=>{const scene=galleryScene(entry.html);scene.replaceChildren();const image=document.createElement('img');image.className='knurpsel-frame';image.src=src;image.alt='Bild '+(i+1)+' der Fortschrittsgeschichte';scene.append(image);return scene.outerHTML;});}
 if(Array.isArray(entry.frames)&&entry.frames.length>1)return entry.frames;
 // Older albums saved only the last scene. Its appended pieces preserve the earned order.
 const final=galleryScene(entry.html),pieces=final.querySelectorAll('.reward-sprite'),frames=[];
 for(let step=0;step<=pieces.length;step++){const scene=galleryScene(entry.html);scene.querySelectorAll('.reward-sprite').forEach((part,index)=>{if(index>=step)part.remove();});if(id==='pfau'&&!Array.from(pieces).slice(0,step).some(part=>new Set([PFAU_ART.slots.find(slot=>slot.si===12).asset,...(PFAU_ART.footVariants||[]).map(slot=>slot.asset)]).has(part.dataset.part))){scene.querySelectorAll('.pfau-base,.pfau-body').forEach(image=>image.style.clipPath='');}frames.push(scene.outerHTML);}
 return frames.length>1?frames:[entry.html];
}
function updateGalleryControls(){const last=galleryIndex===galleryFrames.length-1;$('galleryStep').textContent='Bild '+(galleryIndex+1)+' von '+galleryFrames.length;$('galleryNext').textContent=last?'Noch einmal von vorn ↺':'Nächstes Bild →';$('galleryNext').disabled=galleryBusy||galleryFrames.length<2;$('galleryPrev').disabled=galleryBusy||galleryIndex===0;}
function showGalleryPicture(id,name){const entry=rewardHistory.finished[id];if(!entry)return;galleryRun++;galleryBusy=false;galleryFrames=replayFrames(id,entry);galleryIndex=0;$('galleryTitle').textContent=name;$('galleryPicture').replaceChildren(galleryScene(galleryFrames[0]));updateGalleryControls();$('galleryDialog').showModal();}
async function moveGallery(step){if(galleryBusy||!$('galleryDialog').open||galleryFrames.length<2)return;const next=step<0?Math.max(0,galleryIndex-1):(galleryIndex+1)%galleryFrames.length;if(next===galleryIndex)return;galleryBusy=true;const run=galleryRun;updateGalleryControls();const host=$('galleryPicture'),outgoing=host.firstElementChild,incoming=galleryScene(galleryFrames[next]);incoming.style.opacity='0';host.append(incoming);
 const images=incoming.querySelectorAll('img');await Promise.all(Array.from(images,image=>typeof image.decode==='function'?image.decode().catch(()=>{}):Promise.resolve()));if(run!==galleryRun)return;
 outgoing.classList.add('gallery-leave');incoming.classList.add('gallery-enter');incoming.style.opacity='';await new Promise(resolve=>setTimeout(resolve,window.matchMedia('(prefers-reduced-motion: reduce)').matches?20:2050));if(run!==galleryRun)return;
 outgoing.remove();incoming.classList.remove('gallery-enter');galleryIndex=next;galleryBusy=false;updateGalleryControls();
}
$('galleryNext').onclick=()=>moveGallery(1);$('galleryPrev').onclick=()=>moveGallery(-1);$('galleryPicture').onclick=()=>moveGallery(1);$('galleryPicture').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '||e.key==='ArrowRight'){e.preventDefault();moveGallery(1);}else if(e.key==='ArrowLeft'){e.preventDefault();moveGallery(-1);}});$('galleryDialog').addEventListener('close',()=>{galleryRun++;galleryBusy=false;});
$('openGallery').onclick=openGallery;$('closeGallery').onclick=()=>show('setup');$('galleryClose').onclick=()=>$('galleryDialog').close();$('galleryDialog').onclick=e=>{if(e.target===$('galleryDialog'))$('galleryDialog').close();};
setRewardMode('random');

// Initialansicht ebenfalls eindeutig festlegen; falls der Browser aus einem
// alten PWA-Stand ein display:grid!important kennt, wird es hier korrigiert.
show('setup',true);

function snapshotVG(){
 if(finishedSaved||!round||!number||currentScreen!=='play')return null;
 return {level,size:$('size').value,number,used,lastStyle,errors,firstTry,missed,locked,activeRewardId,rewardMode,model:rewardModel(),reward:{round:reward.state.round,progress:reward.state.progress,solved:[...reward.state.solved]},round:{deck:round.deck.map(c=>c.id),questionId:round.question.id,answer:round.answer},questionText:$('question').textContent};
}
function checkpointVG(){const state=snapshotVG();if(state)CollectionSession.save('verrueckt-gesucht',state);}
function restoreVG(s){
 if(!rewardIds.includes(s.activeRewardId)||!s.round.deck.every(id=>data.cards.some(c=>c.id===id)))throw Error('Ungültige Runde');
 reward.cancel();level=s.level;$('size').value=s.size;number=s.number;used=s.used;lastStyle=s.lastStyle;errors=s.errors;firstTry=s.firstTry;missed=s.missed;locked=false;activeRewardId=s.activeRewardId;rewardMode=s.rewardMode;finishedSaved=false;
 createReward();reward.reset();reward.state=new TreeReward.Progress(s.reward.round);reward.state.progress=s.reward.progress;reward.state.solved=new Set(s.reward.solved);
 const scene=rewardScene(s.model,s.reward.progress);reward.picture.replaceChildren(...scene.childNodes);
 if(reward.art.stages)reward.current=reward.picture.firstElementChild;
 else{reward.base=reward.picture.querySelector('.pfau-base');reward.foreground=reward.picture.querySelector('.pfau-body');}
 reward.update();round={deck:s.round.deck.map(id=>data.cards.find(c=>c.id===id)),question:matrix.find(q=>q.id===s.round.questionId),answer:s.round.answer};
 if(s.locked){if(s.reward.progress===10){show('play');finish();}else{show('play');nextRound();}return;}
 // Reuse the board renderer with the saved question and card order, never draw a new task.
 show('play');nextRound(round,s.questionText);checkpointVG();
}
CollectionSession.track('verrueckt-gesucht',snapshotVG);
CollectionSession.offerResume('verrueckt-gesucht',restoreVG);

function rewardModel(){return {id:activeRewardId,round:reward.state.round,pictureClass:reward.picture.className};}
function rewardScene(model,step){
 const sequences={knurpsel:KnurpselReward,rakete:RocketReward,blumenwiese:FlowerReward,wundereiche:WonderOakReward,kinderzimmer:BedroomReward,marsmission:MarsMissionReward,baumhaus:TreehouseReward,unterwasserwelt:UnderwaterReward,matschwiese:MeadowReward};
 const picture=document.createElement('div');picture.className=model.pictureClass;picture.setAttribute('role','img');picture.setAttribute('aria-label','Dein Fortschrittsbild nach '+step+' Aufgaben');
 if(sequences[model.id]){const src=sequences[model.id].stages[step];if(src){const image=document.createElement('img');image.className='knurpsel-frame';image.src=src;image.alt='Fortschrittsbild';picture.append(image);}else{const q=document.createElement('div');q.className='knurpsel-frame rakete-empty';q.textContent='?';picture.append(q);}return picture;}
 const isPeacock=model.id==='pfau',view=Object.create((isPeacock?PeacockReward:TreeReward).View.prototype);view.art=isPeacock?PFAU_ART:TREE_ART;view.picture=picture;
 const base=document.createElement('img');base.src=view.art.base;base.className=isPeacock?'pfau-base':'reward-base';base.alt='';picture.append(base);view.base=base;
 if(isPeacock){picture.style.aspectRatio='1';view.foreground=document.createElement('img');view.foreground.src=view.art.foreground;view.foreground.className='pfau-body';view.foreground.alt='';picture.append(view.foreground);}
 for(const info of model.round.slice(step)){const marker=document.createElement('div');marker.className='reward-slot'+(isPeacock?' pfau-question':'');marker.dataset.si=info.si;marker.textContent='?';marker.setAttribute('aria-hidden','true');if(isPeacock){const [x,y]=PeacockReward.badge(view.art,info.slot);Object.assign(marker.style,{left:x+'%',top:y+'%',width:'9%',height:'9%'});}else Object.assign(marker.style,{left:info.slot.x+'%',top:info.slot.y+'%',width:(info.slot.w/2)+'%',height:(info.slot.w/2)+'%'});picture.append(marker);}
 for(const info of model.round.slice(0,step)){const sprite=view.createSprite(info);view.settleSprite(sprite);sprite.style.animation='none';sprite.style.opacity='1';}
 return picture;
}
