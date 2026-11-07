(function(root){
'use strict';
function shuffle(items,rng){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function plan(art,total=10,rng=Math.random){
 if(!Number.isInteger(total)||total<6||total>art.slots.length)throw new Error('Ungültige Anzahl von Baumplätzen.');
 const chosen=new Set();
 for(const [ids,count] of [[[0,1,5,6,7],2],[[8,9],1],[[10,11],1],[[2,3,4],1]])for(const id of shuffle(ids,rng).slice(0,count))chosen.add(id);
 for(const id of shuffle(art.slots.map((_,i)=>i).filter(i=>!chosen.has(i)),rng)){if(chosen.size===total)break;chosen.add(id);}
 const ids=[...chosen].sort((a,b)=>art.slots[a].cats.length-art.slots[b].cats.length),used=new Set(),result=[];
 function assign(i){if(i===ids.length)return true;const si=ids[i],slot=art.slots[si];for(const id of shuffle(Object.keys(art.sources).filter(id=>!used.has(id)&&slot.cats.includes(art.categories[id])),rng)){used.add(id);result.push({si,id,slot});if(assign(i+1))return true;result.pop();used.delete(id);}return false;}
 if(!assign(0))throw new Error('Keine passenden Baumdetails gefunden.');return shuffle(result,rng);
}
class Progress {
 constructor(round){this.round=round;this.progress=0;this.solved=new Set();}
 award(taskId){if(this.solved.has(taskId)||this.progress===this.round.length)return null;this.solved.add(taskId);return this.round[this.progress++];}
 get complete(){return this.progress===this.round.length;}
}
class View {
 constructor(art,mount,counter,dialog,onFinish){this.art=art;this.mount=mount;this.counter=counter;this.dialog=dialog;this.onFinish=onFinish;this.picture=document.createElement('div');this.picture.className='reward-picture';this.run=0;this.busy=false;this.finished=false;
 document.getElementById('treeContinue').onclick=()=>{if(this.busy||!this.waiting||!this.dialog.open)return;const done=this.finished,resolve=this.dismissResolve;this.dismissResolve=null;this.close();if(done)this.onFinish();resolve(true);};
 this.picture.onclick=()=>{if(this.waiting&&!this.busy)document.getElementById('treeContinue').onclick();};
 this.picture.addEventListener('keydown',e=>{if(this.waiting&&(e.key==='Enter'||e.key===' ')){e.preventDefault();this.picture.onclick();}});
 dialog.addEventListener('cancel',e=>e.preventDefault());
 }
 reset(){this.run++;this.busy=false;this.finished=false;this.close();this.picture.setAttribute('role','img');this.picture.setAttribute('tabindex','-1');this.state=new Progress(plan(this.art,10));this.picture.replaceChildren();const base=document.createElement('img');base.className='reward-base';base.src=this.art.base;base.alt='Dein verrückter Fortschrittsbaum';this.picture.append(base);
 for(const info of this.state.round){const p=document.createElement('div');p.className='reward-slot';p.dataset.si=info.si;Object.assign(p.style,{left:info.slot.x+'%',top:info.slot.y+'%',width:(info.slot.w/2)+'%',height:(info.slot.w/2)+'%'});p.textContent='?';p.setAttribute('aria-hidden','true');this.picture.append(p);}this.mount.append(this.picture);this.update();}
 update(){this.counter.textContent=this.state.progress+' von 10 gefunden';}
 close(){this.waiting=false;if(this.dismissResolve){this.dismissResolve(false);this.dismissResolve=null;}if(this.dialog.open)this.dialog.close();this.mount.append(this.picture);document.body.classList.remove('treeOpen');}
 cancel(){this.run++;this.busy=false;this.close();}
 createSprite(info){const sprite=document.createElement('img');sprite.className='reward-sprite reward-flight';sprite.src=this.art.sources[info.id];sprite.alt=info.id.replaceAll('_',' ');let width=info.slot.w;if(info.id==='regenschirm')width+=8;if(info.id==='schielende_katze')width+=6;Object.assign(sprite.style,{left:info.slot.x+'%',top:info.slot.y+'%',width:width+'%'});this.picture.append(sprite);return sprite;}
 settleSprite(sprite){sprite.classList.remove('reward-flight');sprite.classList.add('reward-done');}
 async award(taskId){if(this.busy||this.waiting)return false;const info=this.state.award(taskId);if(!info)return false;this.busy=true;const run=this.run,reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches,wait=ms=>new Promise(resolve=>setTimeout(resolve,reduced?20:ms));
 const title=document.getElementById('treeTitle'),button=document.getElementById('treeContinue');title.hidden=false;title.textContent=this.art.kind==='pfau'?'Dein Pfau': 'Ein neues Detail für deinen Baum!';button.hidden=true;document.getElementById('treeLarge').append(this.picture);document.body.classList.add('treeOpen');this.dialog.showModal();await wait(350);if(run!==this.run)return false;
 const marker=this.picture.querySelector(`[data-si="${info.si}"]`);if(marker)marker.remove();const sprite=this.createSprite(info);sprite.style.animation='none';sprite.style.opacity='0';const pictures=sprite.matches('img')?[sprite]:[...sprite.querySelectorAll('img')];await Promise.race([Promise.all(pictures.map(im=>im.decode?.().catch(()=>{})||Promise.resolve())),wait(5000)]);if(run!==this.run)return false;const duration=reduced?20:1500;const begin=performance.now();await new Promise(resolve=>{const frame=now=>{if(run!==this.run){resolve();return;}const alpha=Math.min(1,(now-begin)/duration);sprite.style.opacity=String(alpha);if(alpha<1)requestAnimationFrame(frame);else resolve();};requestAnimationFrame(frame);});if(run!==this.run)return false;
 this.settleSprite(sprite);this.update();this.busy=false;
 this.finished=this.state.complete;this.waiting=true;this.picture.setAttribute('role','button');this.picture.setAttribute('tabindex','0');this.picture.setAttribute('aria-label','Fortschrittsbild schließen und weiterspielen');
 if(this.finished)title.textContent=this.art.kind==='pfau'?'Dein Pfau ist fertig.':'Super! Dein verrückter Baum ist fertig!';
 else title.textContent='Schau dir dein neues Detail an. Tippe zum Weiterspielen auf das Bild.';
 button.hidden=false;button.focus();return await new Promise(resolve=>{this.dismissResolve=resolve;});
 }
}
const api={plan,Progress,View};root.TreeReward=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
