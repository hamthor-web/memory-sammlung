/* One navigation stack for every game: window -> settings -> collection. */
(function(){
 'use strict';
 function start(){
 const nested=/\/(wortmemory|synonymmemory|verrueckt-gesucht)\//.test(location.pathname);
 const home=new URL(nested?'../index.html?menu=1':'index.html?menu=1',location.href);
 if(location.pathname===home.pathname)return;
 const key='collectionNavV2';let current=null,muted=false,moving=false,leaving=false,reopen=null,queued=false;
 const $=id=>document.getElementById(id),game=window.CollectionGameNavigation||{};
 function setup(){if(game.isSetup)return game.isSetup();if($('syn-setup'))return !$('syn-setup').hidden;if($('selection'))return !$('selection').hidden;if($('setup'))return !$('setup').hidden;return !$('start')?.hidden;}
 function overlay(){const dialogs=[...document.querySelectorAll('dialog[open]')];if(dialogs.length)return dialogs.at(-1);if($('modal')?.classList.contains('show'))return $('modal');if($('compareTray')?.classList.contains('show'))return $('compareTray');if($('reward')&&!$('reward').hidden)return $('reward');return null;}
 function mandatory(node=overlay()){return !!node&&(node.dataset.kind==='handoff'||(node.id==='collectionDialog'&&[...node.querySelectorAll('button')].some(b=>b.textContent==='Ich bin bereit'))||((node.id==='login'||node.id==='profileDialog')&&!CollectionSession.profile()));}
 function hidden(node,value){if(node.hidden!==value)node.hidden=value;}
 function state(view,open=false){return {[key]:true,view,overlay:open,depth:(view==='settings'?1:2)+(open?1:0)};}
 function replace(value){window.history.replaceState(value,'');current=value;}
 function push(value){window.history.pushState(value,'');current=value;}
 function isPausedOverlay(id){return reopen?.id===id;}
 function closeOverlay(){
  const node=overlay();if(!node||mandatory(node))return false;
  const reading=['syn-modal','modal','compareTray','successReading','treeDialog','reward'].includes(node.id)&&!setup();
  if(node.id==='collectionDialog'&&node.dataset.kind==='resume'){CollectionSession.dismissResume();}
  else if(node.tagName==='DIALOG')node.close();
  else if(node.id==='modal'||node.id==='compareTray')node.classList.remove('show');
  else node.hidden=true;
  if(node.id==='treeDialog')document.body.classList.remove('treeOpen');
  if(reading)reopen=node;return true;
 }
 function toSettings(){
  if(mandatory())return;
  CollectionSession.flush();muted=true;
  while(overlay()&&!mandatory())closeOverlay();reopen=null;
  if(!setup()){if(game.settings)game.settings();else originalSettings?.();}
  muted=false;sync();window.scrollTo({top:0,behavior:'instant'});
 }
 function goHome(){
  if(mandatory())return;
  CollectionSession.flush();leaving=true;
  const finish=()=>location.replace(home.href);
  if(current?.depth){window.history.go(-current.depth);setTimeout(()=>{if(leaving)finish();},350);}else finish();
 }
 function restoreOverlay(){if(!reopen)return;const node=reopen;reopen=null;if(node.tagName==='DIALOG'){if(node.id==='treeDialog')document.body.classList.add('treeOpen');node.showModal();}else if(node.id==='modal'||node.id==='compareTray')node.classList.add('show');else node.hidden=false;sync();}
 const toolbar=document.createElement('nav');toolbar.id='collectionGameNav';toolbar.className='collection-game-nav';toolbar.setAttribute('aria-label','Spielnavigation');
 const all=document.createElement('a');all.href=home.href;all.className='collection-return';all.textContent='← Alle Spiele';all.onclick=event=>{event.preventDefault();goHome();};toolbar.append(all);
 const settings=$('reset')||$('syn-back')||$('selectGame')||$('playBack')||document.createElement('button');
 const originalSettings=settings.onclick;settings.type='button';settings.textContent='Einstellungen';settings.setAttribute('aria-label','Einstellungen für dieses Spiel');settings.classList.add('collection-settings');settings.onclick=toSettings;toolbar.append(settings);
 const continueReading=document.createElement('button');continueReading.id='collectionContinueReading';continueReading.type='button';continueReading.textContent='Weiterlesen';continueReading.onclick=restoreOverlay;continueReading.hidden=true;toolbar.append(continueReading);
 document.body.classList.add('collection-managed');document.body.dataset.collectionGame=$('cards')?'properties':$('syn-board')?'synonyms':$('grid')?'word':'search';const profile=$('collectionProfile');if(profile)profile.after(toolbar);else document.body.prepend(toolbar);
 for(const a of document.querySelectorAll('a[href]')){if(a===all||a.closest('#collectionProfile'))continue;try{if(new URL(a.href).pathname===home.pathname)a.hidden=true;}catch{}}
 // A single, fixed place for text sizing. Existing controls retain their handlers.
 let fontDialog=$('syn-settings');
 if(!fontDialog){fontDialog=document.createElement('dialog');fontDialog.id='collectionFontDialog';fontDialog.className='collection-font-dialog';fontDialog.setAttribute('aria-labelledby','collectionFontTitle');const title=document.createElement('h2');title.id='collectionFontTitle';title.textContent='Schriftgröße';fontDialog.append(title);const controls=game.fontControls?.()||document.querySelector('.button-zoom,.interface-zoom,.setupTextZoom');if(controls)fontDialog.append(controls);const cardSize=document.querySelector('.zoom-controls');if(cardSize){const label=document.createElement('h3');label.textContent='Karten';fontDialog.append(label,cardSize);}const done=document.createElement('button');done.type='button';done.textContent='Fertig';done.onclick=()=>fontDialog.close();fontDialog.append(done);document.body.append(fontDialog);}
 const font=document.createElement('button');font.id='collectionFont';font.className='collection-font-button';font.type='button';font.textContent='Aa';font.setAttribute('aria-label','Schriftgröße');font.title='Schriftgröße';font.onclick=()=>fontDialog.showModal();(profile||toolbar).append(font);
 function render(){const activeProfile=$('collectionProfile');if(activeProfile&&font.parentElement!==activeProfile)activeProfile.append(font);const label=reopen&&['treeDialog','reward'].includes(reopen.id)?'Bild ansehen':'Weiterlesen';if(continueReading.textContent!==label)continueReading.textContent=label;hidden(settings,setup());if(game.canReopen&&reopen&&!game.canReopen(reopen.id))reopen=null;hidden(continueReading,!reopen||setup());}
 function sync(){
  if(muted||moving||leaving||!current)return;render();const view=setup()?'settings':'round',open=!!overlay();
  if(view==='settings'&&current.view==='round'){moving=true;window.history.go(1-current.depth);return;}
  if(view==='round'&&current.view==='settings'){if(current.overlay)replace(state('round'));else push(state('round'));}
  if(open&&!current.overlay)push(state(view,true));else if(!open&&current.overlay){moving=true;window.history.back();}
 }
 function schedule(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;sync();});}
 function back(){if(mandatory())return;window.history.back();}
 function onPop(event){
  event.stopImmediatePropagation();if(leaving){location.replace(home.href);return;}
  if(initialTarget){const target=initialTarget;initialTarget=null;replace(target);moving=false;render();return;}
  const previous=current,target=event.state;
  if(mandatory()){push(previous);moving=false;return;}
  moving=false;
  if(!target?.[key]||target.depth===0){CollectionSession.flush();location.replace(home.href);return;}
  muted=true;
  if(!target.overlay){closeOverlay();if(target.view==='settings'&&!setup()){CollectionSession.flush();reopen=null;if(game.settings)game.settings();else originalSettings?.();}}
  current=target;muted=false;render();
  // A forward gesture never resurrects a discarded round from stale markup.
  if(target.view==='round'&&setup())replace(state('settings',!!overlay()));
 }
 addEventListener('popstate',onPop,{capture:true});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&overlay()){event.preventDefault();event.stopImmediatePropagation();back();}},true);
 document.addEventListener('cancel',event=>{event.preventDefault();event.stopImmediatePropagation();back();},true);
 // Native browser/Android back gestures use popstate; do not trigger a second back from touchend.
 let initialTarget=null;const initial=state(setup()?'settings':'round',!!overlay()),old=window.history.state;
 if(old?.[key]){current=old;if(old.depth>initial.depth){initialTarget=initial;moving=true;window.history.go(initial.depth-old.depth);}else if(old.depth===initial.depth)replace(initial);else{replace(state(initial.view,false));if(initial.overlay)push(initial);}}
 else{replace({[key]:true,depth:0});push(state('settings'));if(initial.view==='round')push(state('round'));if(initial.overlay)push(initial);}
 new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','open']});
 for(const id of ['modal','compareTray'])if($(id))new MutationObserver(schedule).observe($(id),{attributes:true,attributeFilter:['class']});
 window.CollectionNavigation={back,settings:toSettings,home:goHome,isPausedOverlay};render();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
