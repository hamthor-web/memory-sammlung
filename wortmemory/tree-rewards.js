(()=>{
 'use strict';
 const catalog=[['herbst','Herbstbaum'],['mond','Mondbaum'],['rosa','Rosa Zauberbaum'],['zauber','Zauberbaum']];
 const questions=['Bist du schon auf die nächste Überraschung gespannt?','Wer zieht wohl heute in deinen Baum ein?','Was hat sich zwischen den Zweigen versteckt?','Welche kleine Zauberei wartet diesmal auf dich?','Möchtest du entdecken, wie dein Baum weiterwächst?'];
 const owner=CollectionSession.profile()?.id;if(!owner)return;
 let lastQuestion=-1,dialog=null,frame=null,frameInit=null,onExit=null;
 const store=WordTreeStore.createStore(localStorage,()=>{if(document.querySelector('.tree-storage-warning'))return;const p=document.createElement('p');p.className='tree-storage-warning';p.setAttribute('role','alert');p.textContent='Dein Baum konnte gerade nicht gespeichert werden. Bitte lass diese Seite offen und versuche es noch einmal.';document.body.prepend(p);});
 const area=document.createElement('section');area.id='treeChoice';area.innerHTML='<h2>Welcher Baum soll wachsen?</h2><p>Nach jeder Runde kommt eine Überraschung dazu.</p><div class="tree-options"><button type="button" id="treeRandom">Zufälliger Baum</button><button type="button" id="treeResume">Baum fortsetzen</button><button type="button" id="treeChoose">Meinen Baum wählen</button><button type="button" id="treeGallery">Meine Bäume ansehen</button></div><p id="treeSelected" role="status"></p><div id="treeChoices" class="tree-choices" hidden></div>';
 document.querySelector('#selection .pairs-heading').before(area);
 const state=()=>store.load(owner);
 function render(){
  area.hidden=playerMode===2;const s=state();document.getElementById('treeResume').disabled=!catalog.some(([id])=>store.count(s,id)>0&&store.count(s,id)<10);
  const name=catalog.find(c=>c[0]===s.selected)?.[1];document.getElementById('treeSelected').textContent=catalog.every(([id])=>store.count(s,id)===10)?'Alle vier Bäume sind vollständig! Du kannst sie jederzeit ansehen und weiterspielen.':name?`${name}: ${store.count(s,s.selected)} von 10 Überraschungen`:'Wähle deinen Baum oder lass dich überraschen.';
 }
 function choose(id){if(!store.select(owner,id))return;document.getElementById('treeChoices').hidden=true;render();}
 function choices(resume=false,gallery=false){
  const s=state(),list=document.getElementById('treeChoices');list.replaceChildren();list.hidden=false;
  catalog.filter(([id])=>!resume||store.count(s,id)>0&&store.count(s,id)<10).forEach(([id,name])=>{
   const b=document.createElement('button');b.type='button';const n=store.count(s,id);b.textContent=`${name} · ${n} von 10${n===10?' · vollständig':''}`;
   b.onclick=()=>gallery||n===10?view(id,n,false,null,()=>{}):choose(id);list.append(b);
  });
 }
 document.getElementById('treeRandom').onclick=()=>{const s=state(),available=catalog.filter(([id])=>store.count(s,id)<10);if(available.length)choose(available[Math.floor(Math.random()*available.length)][0]);else choices(false,true);};
 document.getElementById('treeResume').onclick=()=>choices(true);document.getElementById('treeChoose').onclick=()=>choices();document.getElementById('treeGallery').onclick=()=>choices(false,true);
 document.querySelectorAll('.mode').forEach(b=>b.addEventListener('click',render));
 function prepare(saved){
  if(saved?.playerMode===2)return null;
  if(saved?.treeRun)return saved.treeRun;
  if(!saved&&playerMode===2)return null;const s=state();let id=s.selected;
  if(!id||store.count(s,id)>=10){const available=catalog.filter(([key])=>store.count(s,key)<10);id=available[Math.floor(Math.random()*available.length)]?.[0];if(id)choose(id);}
  return id?{id:crypto.randomUUID(),tree:id}:null;
 }
 function grant(run){return run&&store.award(owner,run.id,run.tree);}
 function prompt(receipt,done){
  if(!receipt||receipt.seen){done();return;}
  const panel=document.getElementById('panel'),options=questions.map((_,i)=>i).filter(i=>i!==lastQuestion);lastQuestion=options[Math.floor(Math.random()*options.length)];
  panel.innerHTML='<h2>Schau dir an, was zu deinem Baum dazukommt!</h2><p class="quiztext"></p><div class="finish-actions"><button type="button" id="treeWant" class="primary">Will ich sehen</button></div>';
  panel.querySelector('p').textContent=questions[lastQuestion];document.getElementById('modal').classList.add('show');panel.focus();
  panel.querySelector('#treeWant').onclick=()=>{document.getElementById('modal').classList.remove('show');view(receipt.tree,receipt.before,true,receipt,done);};
 }
 function view(id,n,reveal,receipt,done){
  if(dialog)return;const name=catalog.find(c=>c[0]===id)?.[1]||'Dein Baum';
  dialog=document.createElement('dialog');dialog.className='tree-dialog';dialog.setAttribute('aria-label',name);dialog.innerHTML='<div class="tree-dialog-top"><h2></h2><button type="button" id="treeClose" disabled>Weiter</button></div><p class="tree-loading" role="status">Dein Baum wird geladen …</p><iframe title="Dein gespeicherter Baum"></iframe>';
  dialog.querySelector('h2').textContent=name;frame=dialog.querySelector('iframe');const close=dialog.querySelector('#treeClose');close.textContent=reveal?'Weiter spielen':'Zurück';onExit=done;
  const finish=()=>{if(close.disabled)return;dialog.close();dialog.remove();dialog=null;frame=null;frameInit=null;const exit=onExit;onExit=null;render();const pending=state().pending;if(receipt&&pending?.run===receipt.run)prompt(pending,exit);else exit?.();};
  dialog.addEventListener('cancel',event=>{event.preventDefault();finish();});close.onclick=finish;dialog.dataset.run=receipt?.run||'';
  frameInit={channel:'memory-tree',type:'initialize',count:n,reveal};frame.src=`trees/${id}/index.html`;document.body.append(dialog);dialog.showModal();
  const timer=setTimeout(()=>{if(!dialog)return;const loading=dialog.querySelector('.tree-loading');if(!loading.hidden){loading.textContent='Das Laden dauert länger. Deine Überraschung bleibt gespeichert. Du kannst zurückgehen und es erneut versuchen.';close.disabled=false;}},20000);dialog.addEventListener('close',()=>clearTimeout(timer),{once:true});
 }
 addEventListener('message',event=>{
  if(!frame||event.source!==frame.contentWindow||event.origin!==location.origin||event.data?.channel!=='memory-tree')return;
  if(event.data.type==='ready')frame.contentWindow.postMessage(frameInit,location.origin);
  if(event.data.type==='shown'){
   if(dialog.dataset.run&&!store.seen(owner,dialog.dataset.run))return;
   dialog.querySelector('.tree-loading').hidden=true;dialog.querySelector('#treeClose').disabled=false;
  }
  if(event.data.type==='error'){dialog.querySelector('.tree-loading').textContent='Der Baum konnte nicht vollständig angezeigt werden. Deine Überraschung bleibt gespeichert. Versuche es erneut.';dialog.querySelector('#treeClose').disabled=false;}
 });
 function finish(run,done){
  const receipt=grant(run);
  if(run&&!receipt){const panel=document.getElementById('panel');panel.innerHTML='<h2>Deine Überraschung wartet noch.</h2><p class="quiztext">Dein Baum konnte gerade nicht gespeichert werden. Bitte versuche es noch einmal.</p><button type="button" id="treeRetry">Erneut versuchen</button>';document.getElementById('modal').classList.add('show');panel.querySelector('#treeRetry').onclick=()=>finish(run,done);return;}
  prompt(state().pending,done);
 }
 render();window.WordTrees={prepare,grant,prompt,finish,pending:()=>state().pending,needsCompletion:run=>!!run&&!state().receipts[run.id]?.seen,render};
})();
