(function(root){
'use strict';
const stages=Array.from({length:11},(_,i)=>`assets/knurpsel/stufe-${String(i).padStart(2,'0')}.png`);
class View extends TreeReward.View {
 constructor(mount,counter,dialog,onFinish,art={kind:'knurpsel',name:'Knurpsel',stages,duration:2000}){super(art,mount,counter,dialog,onFinish);this.picture.className='reward-picture knurpsel-picture'+(art.kind==='rakete'?' rakete-picture':'');this.picture.style.setProperty?.('--reward-duration',art.duration+'ms');}
 image(stage){if(!this.art.stages[stage]){const empty=document.createElement('div');empty.className='knurpsel-frame rakete-empty';empty.textContent='?';empty.setAttribute('aria-label','Deine Rakete entsteht mit der ersten Lösung');return empty;}const image=document.createElement('img');image.className='knurpsel-frame';image.src=this.art.stages[stage];image.alt=stage===0?`${this.art.name} am Anfang`:`${this.art.name} nach ${stage} gelösten Aufgaben${this.art.descriptions?', '+this.art.descriptions[stage-1]:''}`;image.draggable=false;return image;}
 reset(){this.run++;this.busy=false;this.finished=false;this.close();this.state=new TreeReward.Progress(this.art.stages.slice(1).map((src,i)=>({src,stage:i+1})));this.picture.setAttribute('role','img');this.picture.setAttribute('tabindex','-1');this.picture.setAttribute('aria-label','Deine Fortschrittsfigur '+this.art.name);this.current=this.image(0);this.picture.replaceChildren(this.current);this.mount.append(this.picture);this.update();
  // Start loading every stage without changing the original artwork.
  this.preloaded=this.art.stages.map((_,i)=>this.image(i));
 }
 close(){super.close();this.dialog.setAttribute('aria-labelledby','treeTitle');}
 async award(taskId){
  if(this.busy||this.waiting)return false;
  const info=this.state.award(taskId);if(!info)return false;
  this.busy=true;const run=this.run;
  const title=document.getElementById('treeTitle'),button=document.getElementById('treeContinue');
  title.textContent='';title.hidden=true;this.dialog.setAttribute('aria-labelledby','treeCounter');button.hidden=true;
  document.getElementById('treeLarge').append(this.picture);document.body.classList.add('treeOpen');this.dialog.showModal();
  await new Promise(resolve=>setTimeout(resolve,2000));
  if(run!==this.run)return false;
  const incoming=this.preloaded[info.stage];
  // Beim Bildladen niemals unbegrenzt hängenbleiben; ruhige alte Überblendung erhalten.
  let loaded=false;
  try{
    loaded=await Promise.race([
      (async()=>{if(incoming.decode)await incoming.decode();else if(!incoming.complete)await new Promise((resolve,reject)=>{incoming.addEventListener('load',resolve,{once:true});incoming.addEventListener('error',reject,{once:true});});return incoming.naturalWidth>0;})(),
      new Promise(resolve=>setTimeout(()=>resolve(false),5000))
    ]);
  }catch{loaded=false;}
  if(run!==this.run)return false;
  if(loaded){
    const outgoing=this.current,reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    incoming.style.opacity='0';incoming.style.animation='none';
    this.picture.append(incoming);
    const duration=reduced?20:this.art.duration;
    const t0=performance.now();
    await new Promise(resolve=>{const step=t=>{if(run!==this.run){resolve();return;}const p=Math.min(1,(t-t0)/duration);incoming.style.opacity=String(p);outgoing.style.opacity=String(1-p);if(p<1)requestAnimationFrame(step);else resolve();};requestAnimationFrame(step);});
    if(run!==this.run)return false;
    outgoing.remove();incoming.style.opacity='1';incoming.classList.remove('knurpsel-enter');this.current=incoming;
  }else{
    const error=document.createElement('div');error.className='reward-image-error';
    error.textContent='Dieses Bild konnte nicht geladen werden. Mit Weiter geht es trotzdem weiter.';
    this.picture.replaceChildren(error);this.current=error;
  }
  this.update();this.busy=false;this.finished=this.state.complete;this.waiting=true;
  this.picture.setAttribute('role','button');this.picture.setAttribute('tabindex','0');this.picture.setAttribute('aria-label',this.art.name+(this.finished?' anschauen und Runde beenden':' anschauen und weiterspielen'));
  title.hidden=!this.finished;
  title.textContent=this.finished?(this.art.finishText||(this.art.kind==='rakete'?'Deine Rakete ist jetzt fertig.':'Dein Knurpsel ist jetzt fertig.')):'';
  this.dialog.setAttribute('aria-labelledby',this.finished?'treeTitle':'treeCounter');
  button.textContent=this.finished?'Runde beenden →':'Weiter →';button.hidden=false;button.focus();
  // No timer dismisses the picture: only the child's tap resolves the award.
  return await new Promise(resolve=>{this.dismissResolve=resolve;});
 }
}
root.KnurpselReward={stages,View};
})(globalThis);
