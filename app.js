'use strict';
const $=id=>document.getElementById(id),E=MemoryEngine,pool=MEMORY_CARDS;
const animations=['Drehende_Karte_12Bilder_3s_weiss.webp','02_drehen_weiss.mp4','03_zwinkern.mp4','04_ausrutschen.mp4'];
let puzzleRun=null;
let duo=false,turn=0,points=[0,0],names=['Spieler 1','Spieler 2'];
function showDuo(){
 const score=$('duoScore');score.hidden=!duo||stage==='finish';
 if(!duo)return;
 for(let i=0;i<2;i++){
  $('duoLabel'+i).textContent=names[i];
  $('duoPoints'+i).textContent=points[i]+' Karte'+(points[i]===1?'':'n');
  $('duoCard'+i).classList.toggle('active',turn===i);
 }
 $('duoTurn').textContent=names[turn]+' ist dran';
}
function switchTurn(){if(!duo)return;turn=1-turn;showDuo();}
function setMode(isTwo){
 duo=isTwo;
 $('modeSolo').classList.toggle('mode-selected',!duo);
 $('modeTwo').classList.toggle('mode-selected',duo);
 $('modeSolo').setAttribute('aria-pressed',String(!duo));
 $('modeTwo').setAttribute('aria-pressed',String(duo));
 $('duoNames').hidden=!duo;
 reset();
}
let field=[],found=new Set(),used=new Set(),history=new Set(),question=null,stage='study',level=1,totalQuestions=8,wrongId=null,correctId=null,epoch=0,lastAnimation=-1,rewardTimer=null,successTimer=null,installPrompt=null;
function syncBigSettings(){
 for(const [control,group] of [['level','levelButtons'],['count','countButtons']]){
  const select=$(control);
  document.querySelectorAll('#'+group+' button').forEach(b=>{
   const option=Array.from(select.options).find(o=>o.value===b.dataset.value);
   const chosen=select.value===b.dataset.value;
   b.classList.toggle('chosen',chosen);
   b.setAttribute('aria-pressed',String(chosen));
   b.disabled=!!option?.disabled;
  });
 }
}
for(const [control,group] of [['level','levelButtons'],['count','countButtons']]){
 document.querySelectorAll('#'+group+' button').forEach(b=>b.onclick=()=>{
  const select=$(control);
  if(b.disabled||select.value===b.dataset.value)return;
  select.value=b.dataset.value;
  select.dispatchEvent(new Event('change',{bubbles:true}));
 });
}
function reset(){
 document.body.classList.add('start-layout');
 puzzleRun=null;
 $('puzzleReward').replaceChildren();$('puzzleConfetti').replaceChildren();$('finishTitle').textContent='Schön, alles gefunden!';$('puzzleMenu').hidden=duo;$('again').hidden=false;
 turn=0;points=[0,0];
 names=[$('duoName0').value.trim()||'Spieler 1',$('duoName1').value.trim()||'Spieler 2'];
 $('duoFinish').hidden=true;
 if($('cardPreview').open)$('cardPreview').close();
 if($('successReading').open)$('successReading').close();
 epoch++;clearTimeout(rewardTimer);clearTimeout(successTimer);const video=$('rewardVideo');video.pause();video.onended=null;video.onerror=null;video.removeAttribute('src');video.load();const image=$('rewardImage');image.onload=null;image.onerror=null;image.removeAttribute('src');image.hidden=true;$('reward').hidden=true;$('finish').hidden=true;$('start').hidden=false;$('game').hidden=true;
 level=+$('level').value;const eligible=pool.filter(c=>E.questions([c],level,pool).length);let wanted=+$('count').value;
 for(const option of $('count').options)option.disabled=+option.value>eligible.length;
 if(wanted>eligible.length){wanted=eligible.length>=12?12:6;$('count').value=String(wanted);}
 field=E.selectRound(pool,wanted,level);found=new Set();used=new Set();history=new Set();question=null;wrongId=null;correctId=null;totalQuestions=field.length+2;stage='study';
 $('levelHint').textContent=level===1?'Suche ein Bild mit einer passenden Eigenschaft.':level===2?'Suche ein Bild, zu dem beide Hinweise passen.':'Lies alle Hinweise. Achte auch auf „nicht“. Hier kannst du 6 oder 12 Bilder wählen.';
 $('message').textContent='Schau dir die Bilder an. Du hast so viel Zeit, wie du möchtest.';syncBigSettings();render();showDuo();
 window.PropertyPuzzles?.refresh();
}
function previewCard(c){
 if(stage!=='study')return;
 $('previewTitle').textContent=c.name;
 $('previewImage').src=c.image;
 $('previewImage').alt=c.name;
 $('previewDescription').textContent='Eigenschaften: '+c.properties.join(', ')+'.';
 $('cardPreview').showModal();
}
$('previewClose').onclick=()=>$('cardPreview').close();
function cardElement(c,index){
 const b=document.createElement('button');b.className='card';b.dataset.id=c.id;const revealed=stage==='study'||found.has(c.id)||wrongId===c.id;
 if(!revealed)b.classList.add('covered');if(found.has(c.id)&&c.id!==correctId)b.classList.add('found');if(wrongId===c.id)b.classList.add('wrong');if(correctId===c.id)b.classList.add('correct');b.disabled=(found.has(c.id)&&!(stage==='success'&&correctId===c.id))||(stage!=='study'&&stage!=='answer'&&!(stage==='wrong'&&wrongId===c.id)&&!(stage==='success'&&correctId===c.id));
 b.setAttribute('aria-label',stage==='success'&&correctId===c.id?c.name+' · Lies den Text und tippe die Karte noch einmal an.':revealed?c.name+(found.has(c.id)?' · gefunden':''):`Verdeckte Bildkarte ${index+1}`);
 const inner=document.createElement('span');inner.className='card-inner';const front=document.createElement('span');front.className='face front';const img=document.createElement('img');img.src=c.image;img.alt='';img.draggable=false;front.append(img);const back=document.createElement('span');back.className='face back';const backImage=document.createElement('img');backImage.src='assets/backs/memory-boy.webp';backImage.alt='';backImage.draggable=false;back.append(backImage);back.setAttribute('aria-hidden','true');inner.append(front,back);b.append(inner);b.onclick=()=>stage==='study'?previewCard(c):answer(c);return b;
}
function renderQuestion(){
 const node=$('question');node.hidden=!question;node.classList.toggle('correct',stage==='success');if(!question)return;node.replaceChildren();node.append(question.yes.length===1&&question.yes[0]==='süß'?'Was schmeckt ':'Was ist ');
 function property(p){const mark=document.createElement('mark');mark.textContent=p;node.append(mark);}
 question.yes.forEach((p,i)=>{if(i)node.append(i===question.yes.length-1?' und ':', ');property(p);});if(question.no.length){node.append(', aber nicht ');question.no.forEach((p,i)=>{if(i)node.append(' oder ');property(p);});}node.append('?');
}
function render(){
 document.querySelector('.study-help').hidden=stage!=='study';
 $('progress').textContent=`${found.size} von ${field.length} gefunden · ${totalQuestions-used.size} Fragekarten übrig`;$('phase').textContent={study:'Anschauen',choose:'Frage wählen',answer:'Bild finden',wrong:'Noch einmal antippen',handoff:'Weitergeben',success:'In Ruhe lesen',reward:'Animation',finish:'Alle gefunden'}[stage];
 $('ready').hidden=stage!=='study';$('readPrompt').hidden=stage!=='success';$('questionZone').hidden=stage==='study'||stage==='finish';$('cards').classList.toggle('large',field.length>6);
 const oldCards=[...$('cards').children];
 if(oldCards.length!==field.length||oldCards.some((b,i)=>b.dataset.id!==field[i].id))$('cards').replaceChildren(...field.map(cardElement));
 else field.forEach((c,i)=>{const b=oldCards[i],revealed=stage==='study'||found.has(c.id)||wrongId===c.id;b.classList.toggle('covered',!revealed);b.classList.toggle('found',found.has(c.id)&&c.id!==correctId);b.classList.toggle('wrong',wrongId===c.id);b.classList.toggle('correct',correctId===c.id);b.disabled=(found.has(c.id)&&!(stage==='success'&&correctId===c.id))||(stage!=='study'&&stage!=='answer'&&!(stage==='wrong'&&wrongId===c.id)&&!(stage==='success'&&correctId===c.id));b.setAttribute('aria-label',stage==='success'&&correctId===c.id?c.name+' · Lies den Text und tippe die Karte noch einmal an.':revealed?c.name+(found.has(c.id)?' · gefunden':''):`Verdeckte Bildkarte ${i+1}`);});renderQuestion();
 showDuo();
 const available=Array.from({length:totalQuestions},(_,i)=>i).filter(i=>!used.has(i));const width=Math.min(700,Math.max(250,$('fan').clientWidth||window.innerWidth-28));const cardWidth=window.innerWidth<=650?104:120;const spacing=Math.min(55,(width-cardWidth)/Math.max(1,available.length-1));
 $('fan').replaceChildren(...available.map((i,position)=>{const b=document.createElement('button');b.className='question-card';b.dataset.question=i;b.style.setProperty('--angle',`${(position-(available.length-1)/2)*Math.min(6,45/Math.max(1,available.length-1))}deg`);b.style.setProperty('--x',`${(position-(available.length-1)/2)*spacing}px`);b.style.zIndex=String(position+1);const backImage=document.createElement('img');backImage.src='assets/backs/question-mark.webp';backImage.alt='';backImage.draggable=false;b.append(backImage);b.setAttribute('aria-label',`Fragekarte ${i+1}`);b.disabled=stage!=='choose';b.onclick=()=>choose(i);return b;}));
 $('fanLabel').textContent=stage==='choose'?'Wähle hier zuerst deine Fragekarte.':stage==='wrong'?'Tippe unten die offene Bildkarte noch einmal an.':stage==='success'?'Lies den Text und tippe die Karte noch einmal an.':'Lies die Frage und suche unten das passende Bild.';
 $('fan').hidden=stage!=='choose';$('fanLabel').hidden=stage!=='choose';
 $('wrongContinue').hidden=stage!=='wrong';$('wrongContinue').textContent=duo?'Weiter – '+names[1-turn]+' ist dran':'Noch einmal versuchen';
 checkpoint();
}
function choose(i){
 if(stage!=='choose'||used.has(i))return;question=E.chooseQuestion(field.filter(c=>!found.has(c.id)),level,pool,history);if(!question){$('message').textContent='Für diese Karten gibt es keine passende Frage.';return;}history.add(E.key(question));history.add(E.semanticKey(question,pool));used.add(i);stage='answer';$('message').textContent='Welche Bildkarte passt zur Frage?';render();
}
function finishReading(){
 if(stage!=='success'||!correctId)return;
 if($('successReading').open)$('successReading').close();
 playReward(epoch);
}
$('readContinue').onclick=finishReading;
$('successReadNext').onclick=finishReading;
$('successReading').addEventListener('cancel',event=>event.preventDefault());
function openSuccessReading(card){
 const dialog=$('successReading');
 const image=$('successReadImage');
 image.src=card.image;
 image.alt=card.name+' – '+card.properties.join(', ');
 dialog.showModal();
 $('successReadNext').focus({preventScroll:true});
}
function answer(c){
 if(stage==='success'){
  if(c.id!==correctId)return;
  // Die richtige Karte bleibt ohne Zeitlimit offen, bis das Kind weiterklickt.
  finishReading();
  return;
 }
 if(stage==='wrong'){if(c.id!==wrongId)return;wrongId=null;if(duo){switchTurn();stage='handoff';render();openHandoff();}else{stage='answer';$('message').textContent='Versuche eine andere Bildkarte.';render();}return;}if(stage!=='answer'||found.has(c.id))return;
 if(!E.matches(c,question)){wrongId=c.id;stage='wrong';$('message').textContent='Das passt noch nicht. Tippe dieselbe Karte an, um sie wieder zu verdecken.';render();return;}
 found.add(c.id);if(duo)points[turn]++;correctId=c.id;stage='success';$('message').textContent='Lies den Text. Tippe dann auf Weiter.';render();
 openSuccessReading(c);
}
function playReward(token){
 stage='reward';question=null;render();const finalJubel=found.size===field.length;const choices=animations.map((_,i)=>i).filter(i=>i!==lastAnimation),index=choices[Math.floor(Math.random()*choices.length)];if(!finalJubel)lastAnimation=index;const animationFile=finalJubel?'Fuehlmemory_Wuerstchen_Jubelanimation.mp4':animations[index];const video=$('rewardVideo'),image=$('rewardImage'),isImage=animationFile.endsWith('.webp');$('reward').hidden=false;$('playVideo').hidden=true;$('videoStatus').hidden=true;video.hidden=isImage;image.hidden=!isImage;let complete=false;
 function done(){if(complete||token!==epoch)return;complete=true;correctId=null;clearTimeout(rewardTimer);video.pause();video.onended=null;video.onerror=null;image.onload=null;image.onerror=null;image.removeAttribute('src');image.hidden=true;$('reward').hidden=true;if(found.size===field.length){
 stage='finish';$('game').hidden=true;$('finish').hidden=false;$('message').textContent='';
 if(duo){
  $('duoFinish').hidden=false;
  $('duoFinish').textContent=names[0]+': '+points[0]+' Karten · '+names[1]+': '+points[1]+' Karten · '+(points[0]===points[1]?'Unentschieden!':names[points[0]>points[1]?0:1]+' hat die meisten Karten gefunden.');
 }else {$('duoFinish').hidden=true;if(window.PropertyPuzzles?.complete(puzzleRun)&&puzzleRun)puzzleRun.rewardSaved=true;$('again').hidden=true;}
 $('puzzleMenu').hidden=duo;
}else{
 stage='choose';$('message').textContent=duo?'Richtig! '+names[turn]+' darf noch einmal.':'Wähle deine nächste Fragekarte.';
}render();if(stage==='finish')(duo?$('again'):$('puzzleMenu')).focus();}
 if(isImage){image.onload=()=>{if(token===epoch)rewardTimer=setTimeout(done,3000);};image.onerror=()=>{if(token!==epoch)return;$('videoStatus').textContent='Die Animation konnte nicht geladen werden.';$('videoStatus').hidden=false;rewardTimer=setTimeout(done,1200);};image.src='assets/animations/'+animations[index]+'?round='+token+'-'+found.size;return;}
 video.src='assets/animations/'+animationFile;video.currentTime=0;
 video.onended=done;video.onerror=()=>{if(token!==epoch)return;$('videoStatus').textContent='Die Animation konnte nicht geladen werden.';$('videoStatus').hidden=false;rewardTimer=setTimeout(done,1200);};
 function play(){video.play().then(()=>{if(token!==epoch)return;$('playVideo').hidden=true;rewardTimer=setTimeout(done,finalJubel?5500:3200);}).catch(()=>{if(token!==epoch)return;$('playVideo').hidden=false;$('playVideo').onclick=play;});}play();
}
$('startGame').onclick=()=>{
 if(!$('game').hidden)return;
 names=[$('duoName0').value.trim()||'Spieler 1',$('duoName1').value.trim()||'Spieler 2'];
 puzzleRun=window.PropertyPuzzles?.begin()||null;
 document.body.classList.remove('start-layout');
 $('start').hidden=true;
 $('game').hidden=false;
 // Die Karten erst im sichtbaren Spielfeld neu erzeugen.
 // So sind sie in der Anschauphase aktiv und die Großansicht ist antippbar.
 $('cards').replaceChildren();
 stage='study';
 render();
 showDuo();
 window.scrollTo({top:0,behavior:'instant'});
 $('ready').focus({preventScroll:true});
};
$('modeSolo').onclick=()=>setMode(false);
$('modeTwo').onclick=()=>setMode(true);
$('ready').onclick=()=>{if(stage!=='study')return;document.body.classList.remove('start-layout');stage='choose';$('start').hidden=true;$('message').textContent='Beginne oben bei den Fragekarten.';render();$('questionZone').scrollIntoView({block:'start',behavior:'smooth'});};$('reset').onclick=()=>{reset();window.scrollTo({top:0,behavior:'instant'});};$('again').onclick=()=>{reset();$('startGame').click();};$('level').onchange=reset;$('count').onchange=reset;
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(stage!=='wrong')render();},120);});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('install').hidden=false;});$('install').onclick=async()=>{if(!installPrompt)return;await installPrompt.prompt();installPrompt=null;$('install').hidden=true;};
reset();

function openHandoff(){CollectionSession.handoff('Jetzt ist '+names[turn]+' dran.',()=>{stage='answer';$('message').textContent='Welche Bildkarte passt zur Frage?';render();});}
function roundSnapshot(){
 if($('game').hidden&&stage!=='finish')return null;
 if(stage==='finish'&&(duo||!puzzleRun||puzzleRun.rewardSaved))return null;
 let savedStage=stage;
 if(stage==='success'||stage==='reward')savedStage=found.size===field.length?'finish':'choose';

 return {puzzleRun,field:field.map(c=>c.id),found:[...found],used:[...used],history:[...history],question:savedStage==='choose'?null:question,stage:savedStage,level,count:field.length,duo,turn,points,names,wrongId,correctId:null,totalQuestions};
}
function checkpoint(){if(typeof CollectionSession==='undefined')return;if(stage==='finish'&&(duo||!puzzleRun||puzzleRun.rewardSaved)){CollectionSession.clear('eigenschaften');return;}const state=roundSnapshot();if(state)CollectionSession.save('eigenschaften',state);}
function restoreRound(state){
 if(!Array.isArray(state.field)||!state.field.length||state.field.some(id=>!pool.some(c=>c.id===id)))throw Error('Ungültige Runde');
 reset();puzzleRun=state.puzzleRun?{...state.puzzleRun,owner:CollectionSession.profile()?.id}:null;field=state.field.map(id=>pool.find(c=>c.id===id));found=new Set(state.found);used=new Set(state.used);history=new Set(state.history);question=state.question;stage=state.stage;level=state.level;duo=state.duo;turn=state.turn;points=state.points;names=state.names;wrongId=state.wrongId;totalQuestions=state.totalQuestions;
 $('level').value=String(level);$('count').value=String(state.count);$('duoName0').value=names[0];$('duoName1').value=names[1];$('modeSolo').setAttribute('aria-pressed',String(!duo));$('modeTwo').setAttribute('aria-pressed',String(duo));
 document.body.classList.remove('start-layout');$('start').hidden=true;$('game').hidden=false;$('message').textContent='Deine Runde geht weiter.';$('cards').replaceChildren();render();if(stage==='finish'){if(!duo){if(window.PropertyPuzzles?.complete(puzzleRun)&&puzzleRun)puzzleRun.rewardSaved=true;$('again').hidden=true;}$('puzzleMenu').hidden=duo;$('game').hidden=true;$('finish').hidden=false;$('duoFinish').hidden=!duo;$('duoFinish').textContent=names[0]+': '+points[0]+' Karten · '+names[1]+': '+points[1]+' Karten · '+(points[0]===points[1]?'Unentschieden!':names[points[0]>points[1]?0:1]+' hat die meisten Karten gefunden.');}if(stage==='finish')checkpoint();if(stage==='handoff')openHandoff();
}
$('wrongContinue').onclick=()=>{const card=field.find(c=>c.id===wrongId);if(card)answer(card);};
CollectionSession.track('eigenschaften',roundSnapshot);

window.CollectionGameNavigation={isSetup:()=>!$('start').hidden,settings:()=>reset(),canReopen:id=>(id==='successReading'&&stage==='success')||(id==='reward'&&stage==='reward')};
