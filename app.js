'use strict';
const $=id=>document.getElementById(id),E=MemoryEngine,pool=MEMORY_CARDS;
const animations=['Drehende_Karte_12Bilder_3s_weiss.webp','02_drehen_weiss.mp4','03_zwinkern.mp4','04_ausrutschen.mp4'];
let field=[],found=new Set(),used=new Set(),history=new Set(),question=null,stage='study',level=1,totalQuestions=8,wrongId=null,correctId=null,epoch=0,lastAnimation=-1,rewardTimer=null,successTimer=null,installPrompt=null;
function reset(){
 epoch++;clearTimeout(rewardTimer);clearTimeout(successTimer);const video=$('rewardVideo');video.pause();video.onended=null;video.onerror=null;video.removeAttribute('src');video.load();const image=$('rewardImage');image.onload=null;image.onerror=null;image.removeAttribute('src');image.hidden=true;$('reward').hidden=true;$('finish').hidden=true;$('start').hidden=false;$('game').hidden=false;
 level=+$('level').value;const eligible=pool.filter(c=>E.questions([c],level,pool).length);let wanted=+$('count').value;
 for(const option of $('count').options)option.disabled=+option.value>eligible.length;
 if(wanted>eligible.length){wanted=eligible.length>=12?12:6;$('count').value=String(wanted);}
 field=E.selectRound(pool,wanted,level);found=new Set();used=new Set();history=new Set();question=null;wrongId=null;correctId=null;totalQuestions=field.length+2;stage='study';
 $('levelHint').textContent=level===1?'Eine Eigenschaft suchen. Alle 30 Karten sind im Pool.':level===2?`Zwei Eigenschaften verbinden. ${eligible.length} passende Karten aus dem Pool.`:`Kombinationen und Ausschlüsse. ${eligible.length} passende Karten aus dem Pool.`;
 $('message').textContent='Schau dir die Bilder an. Du hast so viel Zeit, wie du möchtest.';render();
}
function cardElement(c,index){
 const b=document.createElement('button');b.className='card';b.dataset.id=c.id;const revealed=stage==='study'||found.has(c.id)||wrongId===c.id;
 if(!revealed)b.classList.add('covered');if(found.has(c.id)&&c.id!==correctId)b.classList.add('found');if(wrongId===c.id)b.classList.add('wrong');if(correctId===c.id)b.classList.add('correct');b.disabled=found.has(c.id)||(stage!=='answer'&&!(stage==='wrong'&&wrongId===c.id));
 b.setAttribute('aria-label',revealed?c.name+(found.has(c.id)?' · gefunden':''):`Verdeckte Bildkarte ${index+1}`);
 const inner=document.createElement('span');inner.className='card-inner';const front=document.createElement('span');front.className='face front';const img=document.createElement('img');img.src=c.image;img.alt='';img.draggable=false;front.append(img);const back=document.createElement('span');back.className='face back';const backImage=document.createElement('img');backImage.src='assets/backs/memory-boy.png';backImage.alt='';backImage.draggable=false;back.append(backImage);back.setAttribute('aria-hidden','true');inner.append(front,back);b.append(inner);b.onclick=()=>answer(c);return b;
}
function renderQuestion(){
 const node=$('question');node.hidden=!question;node.classList.toggle('correct',stage==='success');if(!question)return;node.replaceChildren();node.append(question.yes.length===1&&question.yes[0]==='süß'?'Was schmeckt ':'Was ist ');
 function property(p){const mark=document.createElement('mark');mark.textContent=p;node.append(mark);}
 question.yes.forEach((p,i)=>{if(i)node.append(i===question.yes.length-1?' und ':', ');property(p);});if(question.no.length){node.append(', aber nicht ');question.no.forEach((p,i)=>{if(i)node.append(' oder ');property(p);});}node.append('?');
}
function render(){
 $('progress').textContent=`${found.size} von ${field.length} gefunden · ${totalQuestions-used.size} Fragekarten übrig`;$('phase').textContent={study:'Anschauen',choose:'Frage wählen',answer:'Bild finden',wrong:'Noch einmal antippen',success:'In Ruhe lesen',reward:'Animation',finish:'Alle gefunden'}[stage];
 $('ready').hidden=stage!=='study';$('questionZone').hidden=stage==='study'||stage==='finish';$('cards').classList.toggle('large',field.length>6);
 const oldCards=[...$('cards').children];
 if(oldCards.length!==field.length||oldCards.some((b,i)=>b.dataset.id!==field[i].id))$('cards').replaceChildren(...field.map(cardElement));
 else field.forEach((c,i)=>{const b=oldCards[i],revealed=stage==='study'||found.has(c.id)||wrongId===c.id;b.classList.toggle('covered',!revealed);b.classList.toggle('found',found.has(c.id)&&c.id!==correctId);b.classList.toggle('wrong',wrongId===c.id);b.classList.toggle('correct',correctId===c.id);b.disabled=found.has(c.id)||(stage!=='answer'&&!(stage==='wrong'&&wrongId===c.id));b.setAttribute('aria-label',revealed?c.name+(found.has(c.id)?' · gefunden':''):`Verdeckte Bildkarte ${i+1}`);});renderQuestion();
 const available=Array.from({length:totalQuestions},(_,i)=>i).filter(i=>!used.has(i));const width=Math.min(700,Math.max(250,$('fan').clientWidth||window.innerWidth-28));const cardWidth=window.innerWidth<=650?104:120;const spacing=Math.min(55,(width-cardWidth)/Math.max(1,available.length-1));
 $('fan').replaceChildren(...available.map((i,position)=>{const b=document.createElement('button');b.className='question-card';b.dataset.question=i;b.style.setProperty('--angle',`${(position-(available.length-1)/2)*Math.min(6,45/Math.max(1,available.length-1))}deg`);b.style.setProperty('--x',`${(position-(available.length-1)/2)*spacing}px`);b.style.zIndex=String(position+1);const backImage=document.createElement('img');backImage.src='assets/backs/question-mark.png';backImage.alt='';backImage.draggable=false;b.append(backImage);b.setAttribute('aria-label',`Fragekarte ${i+1}`);b.disabled=stage!=='choose';b.onclick=()=>choose(i);return b;}));
 $('fanLabel').textContent=stage==='choose'?'Wähle eine Fragekarte.':stage==='wrong'?'Tippe die offene Karte noch einmal an.':'Die Frage bleibt sichtbar, während du suchst.';
}
function choose(i){
 if(stage!=='choose'||used.has(i))return;question=E.chooseQuestion(field.filter(c=>!found.has(c.id)),level,pool,history);if(!question){$('message').textContent='Für diese Karten gibt es keine passende Frage.';return;}history.add(E.key(question));history.add(E.semanticKey(question,pool));used.add(i);stage='answer';$('message').textContent='Welche Bildkarte passt zur Frage?';render();
}
function answer(c){
 if(stage==='wrong'){if(c.id!==wrongId)return;wrongId=null;stage='answer';$('message').textContent='Versuche eine andere Bildkarte.';render();return;}if(stage!=='answer'||found.has(c.id))return;
 if(!E.matches(c,question)){wrongId=c.id;stage='wrong';$('message').textContent='Das passt noch nicht. Tippe dieselbe Karte an, um sie wieder zu verdecken.';render();return;}
 found.add(c.id);correctId=c.id;stage='success';$('message').textContent='Das passt! Schau dir Bild und Frage noch einmal an.';render();const token=epoch;successTimer=setTimeout(()=>{if(token===epoch)playReward(token);},2000);
}
function playReward(token){
 stage='reward';question=null;render();const choices=animations.map((_,i)=>i).filter(i=>i!==lastAnimation),index=choices[Math.floor(Math.random()*choices.length)];lastAnimation=index;const video=$('rewardVideo'),image=$('rewardImage'),isImage=animations[index].endsWith('.webp');$('reward').hidden=false;$('playVideo').hidden=true;$('videoStatus').hidden=true;video.hidden=isImage;image.hidden=!isImage;let complete=false;
 function done(){if(complete||token!==epoch)return;complete=true;correctId=null;clearTimeout(rewardTimer);video.pause();video.onended=null;video.onerror=null;image.onload=null;image.onerror=null;image.removeAttribute('src');image.hidden=true;$('reward').hidden=true;if(found.size===field.length){stage='finish';$('finish').hidden=false;$('message').textContent='';}else{stage='choose';$('message').textContent='Wähle deine nächste Fragekarte.';}render();if(stage==='finish')$('again').focus();}
 if(isImage){image.onload=()=>{if(token===epoch)rewardTimer=setTimeout(done,3000);};image.onerror=()=>{if(token!==epoch)return;$('videoStatus').textContent='Die Animation konnte nicht geladen werden.';$('videoStatus').hidden=false;rewardTimer=setTimeout(done,1200);};image.src='assets/animations/'+animations[index]+'?round='+token+'-'+found.size;return;}
 video.src='assets/animations/'+animations[index];video.currentTime=0;
 video.onended=done;video.onerror=()=>{if(token!==epoch)return;$('videoStatus').textContent='Die Animation konnte nicht geladen werden.';$('videoStatus').hidden=false;rewardTimer=setTimeout(done,1200);};
 function play(){video.play().then(()=>{if(token!==epoch)return;$('playVideo').hidden=true;rewardTimer=setTimeout(done,3200);}).catch(()=>{if(token!==epoch)return;$('playVideo').hidden=false;$('playVideo').onclick=play;});}play();
}
$('ready').onclick=()=>{if(stage!=='study')return;stage='choose';$('start').hidden=true;$('message').textContent='Wähle eine Fragekarte.';render();};$('reset').onclick=reset;$('again').onclick=reset;$('level').onchange=reset;$('count').onchange=reset;
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(stage!=='wrong')render();},120);});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('install').hidden=false;});$('install').onclick=async()=>{if(!installPrompt)return;await installPrompt.prompt();installPrompt=null;$('install').hidden=true;};
reset();
if('serviceWorker' in navigator&&location.protocol!=='file:'){
 let updating=false;
 const updateButton=document.createElement('button');updateButton.textContent='App aktualisieren';updateButton.hidden=true;document.querySelector('.header-actions').append(updateButton);
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(updating)location.reload();});
 $('offlineStatus').textContent='Offline-Paket wird vorbereitet …';
 navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).then(registration=>{
  const offerUpdate=()=>{if(registration.waiting){updateButton.hidden=false;updateButton.onclick=()=>{updating=true;registration.waiting.postMessage('SKIP_WAITING');};}};
  const observe=worker=>{if(!worker)return;worker.addEventListener('statechange',()=>{if(worker.state==='installed'){if(registration.active)offerUpdate();else $('offlineStatus').textContent='Offline bereit';}else if(worker.state==='redundant')$('offlineStatus').textContent='Offline-Paket nicht vollständig. Bitte mit Internet neu laden.';});};
  if(registration.active)$('offlineStatus').textContent='Offline bereit';
  observe(registration.installing);offerUpdate();registration.addEventListener('updatefound',()=>observe(registration.installing));
 }).catch(()=>{$('offlineStatus').textContent='Offline-Modus konnte nicht vorbereitet werden';});
}else $('offlineStatus').textContent='Installation benötigt HTTPS oder localhost';




