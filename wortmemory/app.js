let desiredCount = 6;
CollectionSession.requireProfile();
let handoffPending=false;
let playerMode = 1;
let activePlayer = 0;
let playerScores = [0,0];
let collectedPairs = [[],[]];
let playerNames = ['Spieler 1','Spieler 2'];
function updatePlayers(){
  const el=document.getElementById('twoPlayerScore');
  el.hidden=playerMode!==2 || document.getElementById('grid').hidden;
  if(playerMode!==2)return;
  for(let i=0;i<2;i++){
    document.getElementById('namePlayer'+i).textContent=playerNames[i];
    document.getElementById('pairsPlayer'+i).textContent=playerScores[i];
    document.getElementById('scorePlayer'+i).classList.toggle('current',i===activePlayer);
  }
  document.getElementById('turnNotice').textContent=playerNames[activePlayer]+' ist dran';
}
function nextPlayer(){
  if(playerMode!==2)return;
  activePlayer=1-activePlayer;
  handoffPending=true;busy=true;updatePlayers();wordCheckpoint();
  wordHandoff();
}
let currentPairs = [];
let first = null, second = null, busy = false, found = 0;
let pendingQuiz = null;
let comparisonActive = false;
let mismatchActive = false;
let boardZoom = 1;
let controlZoom = 1;
function applyControlZoom(value){
  controlZoom=Math.max(.8,Math.min(1.6,Math.round(value*100)/100));
  document.documentElement.style.setProperty('--control-zoom',controlZoom);
  document.getElementById('uiZoomReset').textContent=Math.round(controlZoom*100)+' %';
}
const lastQuestion = {};
const timers = new Set();
function later(fn, delay) {
  const id=setTimeout(()=>{timers.delete(id);fn();},delay);
  timers.add(id);return id;
}
function resetRound() {
  handoffPending=false;
  timers.forEach(clearTimeout); timers.clear(); closeModal();
  first=second=null; pendingQuiz=null; comparisonActive=false; mismatchActive=false; busy=false; found=0;
  const tray=document.getElementById('compareTray');
  if(tray) { tray.innerHTML=''; tray.classList.remove('show'); }
}
function showSelection() {
  if(typeof currentPairs!=='undefined'&&currentPairs.length)wordCheckpoint();
  document.body.classList.add('choosing-pairs');
  resetRound();currentPairs=[];
  document.getElementById('grid').innerHTML='';
  document.getElementById('selection').hidden=false;
  document.getElementById('startWordMemory').disabled=true;
  document.querySelectorAll('#selection .count').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false');});
  ['grid','status','game-controls'].forEach(id=>document.getElementById(id).hidden=true);
  document.getElementById('twoPlayerScore').hidden=true;
  window.scrollTo(0,0);
  // Keine automatische Fokussierung oder optische Vormarkierung einer Paarzahl.
}

function shuffle(a) {
  a=[...a];
  for(let i=a.length-1;i>0;i--) {
    const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function updateProgress() {
  document.getElementById('progress').textContent = `${found} von ${currentPairs.length} Paaren gefunden`;
}

function boardColumnsForZoom() {
  const portrait=window.innerHeight>=window.innerWidth;
  if(portrait) {
    if(boardZoom<=.50) return 6;
    if(boardZoom<=.65) return 5;
    if(boardZoom<=.85) return 4;
    return 3;
  }
  if(boardZoom<=.50) return 8;
  if(boardZoom<=.65) return 7;
  if(boardZoom<=.85) return 6;
  return 5;
}

function applyBoardZoom(value) {
  boardZoom=Math.max(.35,Math.min(1.15,Math.round(value*100)/100));
  const grid=document.getElementById('grid');
  grid.style.setProperty('--board-scale',boardZoom);
  grid.style.setProperty('--board-cols',boardColumnsForZoom());
  const h=grid.scrollHeight || 0;
  grid.style.marginBottom=`${Math.round(h*(boardZoom-1))}px`;
  document.getElementById('zoomReset').textContent=`${Math.round(boardZoom*100)} %`;
}

function openEntries() {
  const entries=[];
  if(first?.el?.classList.contains('flipped')) entries.push(first);
  if(second?.el?.classList.contains('flipped')) entries.push(second);
  if(pendingQuiz) {
    pendingQuiz.entries.forEach(entry=>{
      if(entry.el.classList.contains('flipped') && !entries.some(e=>e.el===entry.el)) entries.push(entry);
    });
  }
  return entries.slice(0,2);
}

function renderCompareTray() {
  const tray=document.getElementById('compareTray');
  tray.innerHTML='';
  const entries=openEntries();
  if(entries.length===0) comparisonActive=false;
  const showComparison=comparisonActive && entries.length>0;
  tray.classList.toggle('show',showComparison&&!window.CollectionNavigation?.isPausedOverlay('compareTray'));
  if(!showComparison) return;
  entries.forEach(entry=>{
    const b=document.createElement('button');
    b.type='button';
    b.className='compare-card';
    b.setAttribute('aria-label',`${entry.c.data.label}. Zum Wegdrehen antippen.`);
    b.innerHTML=`<img src="${entry.c.data.img}" alt="${entry.c.data.label}">`;
    b.onclick=()=>closeCard(entry.el,entry.c);
    tray.appendChild(b);
  });
}

function closeCard(el,c) {
  el.classList.remove('flipped');
  el.setAttribute('aria-label',`Karte mit ${c.data.label} wieder aufdecken`);

  if(el.classList.contains('matched')) {
    el.classList.add('locked');
    renderCompareTray();
    return;
  }

  if(mismatchActive) {
    const bothClosed =
      first && second &&
      !first.el.classList.contains('flipped') &&
      !second.el.classList.contains('flipped');

    if(bothClosed) {
      first=second=null;
      mismatchActive=false;
      comparisonActive=false;
      nextPlayer();
    }
    renderCompareTray();wordCheckpoint();
    return;
  }

  if(first && first.el===el) {
    first=null;
  } else if(second && second.el===el) {
    second=null;
  }
  renderCompareTray();
}

function build(saved) {
  saved=saved?.deck?saved:null;
  document.body.classList.remove('choosing-pairs');
  const grid=document.getElementById('grid');
  grid.innerHTML='';
  resetRound();
  activePlayer=0;playerScores=[0,0];collectedPairs=[[],[]];
  playerNames=[document.getElementById('player1Name').value.trim()||'Spieler 1',document.getElementById('player2Name').value.trim()||'Spieler 2'];
  document.getElementById('selection').hidden=true;
  ['grid','status','game-controls'].forEach(id=>document.getElementById(id).hidden=false);
  document.getElementById('timing').textContent='Du bestimmst das Tempo. Tippe eine offene Karte an, wenn du fertig gelesen hast.';
  currentPairs=saved?saved.pairIds.map(id=>PAIRS.find(p=>p.id===id)):shuffle(PAIRS).slice(0, desiredCount);
  const cards=[];
  currentPairs.forEach(p=>['a','b'].forEach(side=>cards.push({pair:p, pairId:p.id, side, data:p[side]})));
  const laidOut=saved?saved.deck.map(c=>{const pair=PAIRS.find(p=>p.id===c.pairId);return {pair,pairId:pair.id,side:c.side,data:pair[c.side]};}):shuffle(cards);
  laidOut.forEach((c,idx)=>{
    const el=document.createElement('button');
    el.type='button';
    el.className='card';
    el.setAttribute('aria-label', `Karte ${idx+1} aufdecken`);
    el.dataset.pair=c.pairId;
    el.dataset.side=c.side;
    el.innerHTML=`
      <div class="inner">
        <div class="face back"><img src="${backImage}" alt="Kartenrückseite"></div>
        <div class="face front"><img src="${c.data.img}" alt="${c.data.label}"></div>
        <div class="check">✓</div>
      </div>`;
    el.addEventListener('click',()=>flip(el,c));
    grid.appendChild(el);
  });
  updateProgress();
  updatePlayers();
  applyBoardZoom(desiredCount>=12 ? .70 : desiredCount>=10 ? .78 : desiredCount>=8 ? .88 : 1);
  if(saved)restoreWordState(saved);else wordCheckpoint();
}

function flip(el,c) {
  if(busy) return;

  if(el.classList.contains('flipped')) {
    closeCard(el,c);
    return;
  }

  if(el.classList.contains('matched') || el.classList.contains('locked')) return;
  if(pendingQuiz) return;
  if(mismatchActive) return;
  if(second) return;

  el.classList.add('flipped');
  el.setAttribute('aria-label',`${c.data.label}. Zum Wegdrehen noch einmal antippen.`);
  const entry={el,c};

  if(!first) {
    first=entry;
    renderCompareTray();wordCheckpoint();
    return;
  }

  second=entry;
  comparisonActive=true;
  renderCompareTray();

  if(first.c.pairId===second.c.pairId) {
    const p=first.c.pair;
    const entries=[first,second];
    first.el.classList.add('matched');
    second.el.classList.add('matched');
    found++;
    if(playerMode===2){playerScores[activePlayer]++;collectedPairs[activePlayer].push(p);}
    updateProgress();
    updatePlayers();
    pendingQuiz={pair:p,entries,shown:true};
    first=second=null;

    // Das Paar ist gefunden: die große Vergleichsansicht sofort schließen.
    // Die beiden aufgedeckten Karten bleiben an ihren ursprünglichen
    // Positionen im Spielfeld sichtbar und bilden den Hintergrund.
    comparisonActive=false;
    renderCompareTray();

    showMatchConfirmation(p);
  } else {
    mismatchActive=true;
  }
  wordCheckpoint();
}

function showMatchConfirmation(pair) {
  busy=true;
  const panel=document.getElementById('panel');
  panel.innerHTML=`
    <h2>✓ Richtiges Paar!</h2>
    <div class="quiztext">Die beiden Karten gehören zusammen.</div>`;
  if(!window.CollectionNavigation?.isPausedOverlay('modal'))document.getElementById('modal').classList.add('show');
  panel.focus();
  later(()=>{
    closeModal();
    showQuiz(pair);
  },700);
}

function chooseQuestion(pair) {
  let options=pair.questions.map((q,i)=>i);
  if(lastQuestion[pair.id] !== undefined && options.length>1) options=options.filter(i=>i!==lastQuestion[pair.id]);
  const idx=options[Math.floor(Math.random()*options.length)];
  lastQuestion[pair.id]=idx;
  return pair.questions[idx];
}

function showQuiz(pair) {
  busy=true;
  const q=pendingQuiz?.question||chooseQuestion(pair);
  if(pendingQuiz)pendingQuiz.question=q;
  const panel=document.getElementById('panel');
  panel.innerHTML=`
    <h2>Welches Bild passt zu diesem Satz?</h2>
    <div class="quiztext">${q.text}</div>
    <div class="choices" id="choices"></div>
    <div class="feedback" id="feedback"></div>`;
  let answered=false;
  const choices=panel.querySelector('#choices');
  ['a','b'].forEach(side=>{
    const b=document.createElement('button');
    b.className='choice';
    b.innerHTML=`<img src="${pair[side].img}" alt="${pair[side].label}">`;
    b.onclick=()=>{
      if(answered) return;
      if(side===q.answer) {
        answered=true;
        choices.querySelectorAll('button').forEach(button=>button.disabled=true);
        b.classList.add('good');
        panel.querySelector('#feedback').textContent='✓ Richtig!';
        later(()=>{
          closeModal();
          pendingQuiz=null;
          busy=false;wordCheckpoint();
          if(found===currentPairs.length) later(showJubelBeforeFinish,180);
          else {document.getElementById('timing').textContent=playerMode===2?'Richtig! '+playerNames[activePlayer]+' darf noch einmal.':'Finde das nächste Paar.';wordCheckpoint();}
        },700);
      } else {
        b.classList.add('bad');
        panel.querySelector('#feedback').textContent='Schau noch einmal genau.';
        later(()=>b.classList.remove('bad'),550);
      }
    };
    choices.appendChild(b);
  });
  if(!window.CollectionNavigation?.isPausedOverlay('modal'))document.getElementById('modal').classList.add('show');
  panel.focus();wordCheckpoint();
}

function showCollectedPairs(playerIndex) {
  const panel=document.getElementById('panel');
  const name=playerNames[playerIndex];
  const pairs=collectedPairs[playerIndex];
  const gallery=pairs.length
    ? pairs.map(pair=>`<article class="collected-pair">
         <h3>${pair.word}</h3>
         <div class="collected-images">
           <figure><img src="${pair.a.img}" alt="${pair.a.label}"><figcaption>${pair.a.label}</figcaption></figure>
           <figure><img src="${pair.b.img}" alt="${pair.b.label}"><figcaption>${pair.b.label}</figcaption></figure>
         </div>
       </article>`).join('')
    : '<p>Du hast diesmal kein Paar gesammelt.</p>';
  panel.innerHTML=`<h2>${name}: Meine gefundenen Paare</h2>
    <p class="quiztext">${pairs.length} von ${currentPairs.length} Paaren</p>
    <div class="collection-grid">${gallery}</div>
    <div class="finish-actions"><button class="primary" id="galleryBack">Zur Ergebnisübersicht</button></div>`;
  if(!window.CollectionNavigation?.isPausedOverlay('modal'))document.getElementById('modal').classList.add('show');
  panel.focus();
  panel.querySelector('#galleryBack').onclick=showFinish;
}
// Jubel nach der letzten vollständig beantworteten Satz-Bild-Aufgabe, nur einmal pro Runde.
function showJubelBeforeFinish() {
  busy=true;
  const panel=document.getElementById('panel');
  panel.innerHTML=`
    <h2>Geschafft!</h2>
    <video id="wordJubelVideo" playsinline muted preload="auto"
      aria-label="Das Würstchen jongliert eine Karte mit Obstbirne und Glühbirne"
      style="display:block;width:min(100%,420px);max-height:60dvh;object-fit:contain;margin:0 auto"
      src="../assets/animations/Wuerstchen_Jubel_Birne_Gluehbirne.mp4"></video>
    <div class="finish-actions"><button type="button" id="skipWordJubel">Weiter</button></div>`;
  if(!window.CollectionNavigation?.isPausedOverlay('modal'))document.getElementById('modal').classList.add('show');
  panel.focus();
  const video=panel.querySelector('#wordJubelVideo');
  let finished=false;
  let failsafe=0;
  function finish() {
    if(finished)return;
    finished=true;
    clearTimeout(failsafe);
    video.pause();
    showFinish();
  }
  panel.querySelector('#skipWordJubel').onclick=finish;
  video.addEventListener('ended',finish,{once:true});
  video.addEventListener('error',finish,{once:true});
  failsafe=setTimeout(finish,9000);
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finish();
    return;
  }
  const attempt=video.play();
  if(attempt && typeof attempt.catch==='function')attempt.catch(finish);
}
function showFinish() {
  busy=true;CollectionSession.clear('wortmemory');
  const panel=document.getElementById('panel');
  const twoResult=playerMode===2
    ? `<p class="quiztext">${CollectionSession.escape(playerNames[0])}: ${playerScores[0]} Paare<br>${CollectionSession.escape(playerNames[1])}: ${playerScores[1]} Paare</p><p class="quiztext">${playerScores[0]===playerScores[1]?'Unentschieden!':(CollectionSession.escape(playerNames[playerScores[0]>playerScores[1]?0:1])+' hat die meisten Paare gefunden!')}</p>`
    : '';
  panel.innerHTML=`
    <h2>Super! Alle Wortpaare sind gefunden.</h2>
    ${twoResult}
    ${playerMode===2 ? `<div class="collection-actions"><button id="showCollection0" type="button">${CollectionSession.escape(playerNames[0])}: Paare ansehen</button><button id="showCollection1" type="button">${CollectionSession.escape(playerNames[1])}: Paare ansehen</button></div>` : ''}
    <div class="finish-actions">
      <button class="primary" id="again">Noch einmal spielen</button>
      <button id="back">Einstellungen</button>
    </div>`;
  if(!window.CollectionNavigation?.isPausedOverlay('modal'))document.getElementById('modal').classList.add('show');
  panel.focus();
  if(playerMode===2){
    panel.querySelector('#showCollection0').onclick=()=>showCollectedPairs(0);
    panel.querySelector('#showCollection1').onclick=()=>showCollectedPairs(1);
  }
  panel.querySelector('#again').onclick=()=>{ closeModal(); build(); };
  panel.querySelector('#back').onclick=showSelection;
}

function closeModal() {
  document.getElementById('modal').classList.remove('show');
}

document.getElementById('restart').onclick=build;
document.getElementById('zoomOut').onclick=()=>applyBoardZoom(boardZoom-.10);
document.getElementById('zoomIn').onclick=()=>applyBoardZoom(boardZoom+.10);
document.getElementById('zoomReset').onclick=()=>applyBoardZoom(1);
document.getElementById('uiZoomOut').onclick=()=>applyControlZoom(controlZoom-.1);
document.getElementById('uiZoomIn').onclick=()=>applyControlZoom(controlZoom+.1);
document.getElementById('uiZoomReset').onclick=()=>applyControlZoom(1);
window.addEventListener('resize',()=>applyBoardZoom(boardZoom));

document.querySelectorAll('.mode').forEach(btn=>btn.onclick=()=>{
  playerMode=Number(btn.dataset.mode);
  document.querySelectorAll('.mode').forEach(b=>{const on=b===btn;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
  document.getElementById('playerNames').hidden=playerMode!==2;
});
document.querySelectorAll('.count').forEach(btn=>btn.onclick=()=>{
  document.querySelectorAll('.count').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#selection .count').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));
  desiredCount=Number(btn.dataset.count);
  const startButton=document.getElementById('startWordMemory');
  startButton.disabled=false;
  startButton.scrollIntoView({behavior:'smooth',block:'center'});
});

document.getElementById('startWordMemory').onclick=()=>{CollectionSession.clear('wortmemory');build();};
document.getElementById('selectGame').onclick=showSelection;


function wordHandoff(){CollectionSession.handoff('Jetzt ist '+playerNames[activePlayer]+' dran.',()=>{handoffPending=false;busy=false;wordCheckpoint();});}
function wordSnapshot(){
 if(!currentPairs.length||document.getElementById('grid').hidden)return null;
 if(found===currentPairs.length&&!pendingQuiz)return null;
 const elements=[...document.querySelectorAll('#grid .card')];
 return {pairIds:currentPairs.map(p=>p.id),deck:elements.map(el=>({pairId:el.dataset.pair,side:el.dataset.side})),matched:elements.filter(el=>el.classList.contains('matched')).map(el=>el.dataset.pair),flipped:elements.map((el,i)=>el.classList.contains('flipped')?i:-1).filter(i=>i>=0),pendingPair:pendingQuiz?.pair.id||null,question:pendingQuiz?.question||null,first:first?elements.indexOf(first.el):null,second:second?elements.indexOf(second.el):null,mismatchActive,comparisonActive,handoffPending,desiredCount,playerMode,activePlayer,playerScores,playerNames,found,boardZoom,controlZoom};
}
function wordCheckpoint(){const state=wordSnapshot();if(state)CollectionSession.save('wortmemory',state);else if(currentPairs.length&&found===currentPairs.length)CollectionSession.clear('wortmemory');}
function restoreWordState(s){
 playerMode=s.playerMode;activePlayer=s.activePlayer;playerScores=s.playerScores;playerNames=s.playerNames;desiredCount=s.desiredCount;found=s.found;handoffPending=s.handoffPending;
 const elements=[...document.querySelectorAll('#grid .card')];
 const entry=i=>{const el=elements[i],pair=PAIRS.find(p=>p.id===el.dataset.pair),side=el.dataset.side;return {el,c:{pair,pairId:pair.id,side,data:pair[side]}};};
 elements.forEach((el,i)=>{if(s.matched.includes(el.dataset.pair))el.classList.add('matched');if(s.flipped.includes(i))el.classList.add('flipped');});
 first=s.first===null?null:entry(s.first);second=s.second===null?null:entry(s.second);mismatchActive=s.mismatchActive;comparisonActive=s.comparisonActive;
 updateProgress();updatePlayers();applyBoardZoom(s.boardZoom);applyControlZoom(s.controlZoom);renderCompareTray();
 if(s.pendingPair){const pair=PAIRS.find(p=>p.id===s.pendingPair);pendingQuiz={pair,entries:elements.map((el,i)=>el.dataset.pair===pair.id?entry(i):null).filter(Boolean),question:s.question};showQuiz(pair);}else if(handoffPending){busy=true;wordHandoff();}else busy=false;
}
window.CollectionGameNavigation={isSetup:()=>!document.getElementById('selection').hidden,settings:showSelection,canReopen:id=>(id==='modal'&&busy)||(id==='compareTray'&&comparisonActive)};
CollectionSession.track('wortmemory',wordSnapshot);
showSelection();
const wordProfile=CollectionSession.profile();if(wordProfile)document.getElementById('player1Name').value=wordProfile.name;
CollectionSession.offerResume('wortmemory',s=>{desiredCount=s.desiredCount;build(s);});
