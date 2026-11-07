(function(root){
'use strict';
function featherPlan(art,shuffle){
 const slots=shuffle(art.slots.filter(x=>x.si<=8)).slice(0,7);
 if(!art.extraFeathers?.length)return slots;
 const pool=shuffle(art.extraFeathers);
 return slots.map((slot,i)=>i%3===0?slot:(pool[i].layouts.find(x=>x.si===slot.si)));
}
function plan(art,rng=Math.random){const shuffle=a=>QuestionEngine.shuffle(a,rng);const feathers=featherPlan(art,shuffle),accessories=shuffle(art.slots.filter(x=>x.si>=9&&x.si<=11)).slice(0,2).map(slot=>{const variants=slot.si===9?art.headVariants:slot.si===10?art.faceVariants:null;return variants?.length?{...slot,...variants[Math.floor(rng()*variants.length)],si:slot.si}:slot;}),footSlot=art.slots.find(x=>x.si===12),foot=art.footVariants?.length?art.footVariants[Math.floor(rng()*art.footVariants.length)]:null,feet=foot?{...footSlot,...foot,si:12}:footSlot;return shuffle([...feathers,...accessories,feet]).map(slot=>({si:slot.si,id:slot.asset,slot}));}
function badge(art,slot){if(slot.si>=9){return [slot.x,slot.y-({9:11,10:4,11:4,12:11}[slot.si])];}const c=art.centers[slot.asset],pivot=slot.pivot||[.5,1],a=slot.rot*Math.PI/180,dx=(c[0]-pivot[0])*slot.scale*100,dy=(c[1]-pivot[1])*slot.scale*100;return [slot.x+dx*Math.cos(a)-dy*Math.sin(a),slot.y+dx*Math.sin(a)+dy*Math.cos(a)];}
class View extends TreeReward.View {
 reset(){this.run++;this.busy=false;this.finished=false;this.close();this.state=new TreeReward.Progress(plan(this.art));this.picture.replaceChildren();this.picture.className='reward-picture pfau-picture';this.picture.style.aspectRatio='1';this.picture.setAttribute('role','img');this.picture.setAttribute('tabindex','-1');
 this.base=document.createElement('img');this.base.src=this.art.base;this.base.className='pfau-base';this.base.alt='Dein Fortschrittspfau';this.picture.append(this.base);this.foreground=document.createElement('img');this.foreground.src=this.art.foreground;this.foreground.className='pfau-body';this.foreground.alt='';this.picture.append(this.foreground);
 for(const info of this.state.round){const q=document.createElement('div');q.className='reward-slot pfau-question';q.dataset.si=info.si;const [x,y]=badge(this.art,info.slot);Object.assign(q.style,{left:x+'%',top:y+'%',width:'9%',height:'9%'});q.textContent='?';q.setAttribute('aria-hidden','true');this.picture.append(q);}this.mount.append(this.picture);this.update();
 }
 settleSprite(sprite){super.settleSprite(sprite);for(const image of sprite.querySelectorAll('.pfau-flight')){image.classList.remove('pfau-flight');image.classList.add('pfau-settled');image.style.animation='none';image.style.transform='none';image.style.opacity='1';}}
 createSprite(info){const p=info.slot,pivot=p.pivot||[.5,1],wrapper=document.createElement('div');wrapper.className='reward-sprite pfau-piece';wrapper.dataset.part=info.id;Object.assign(wrapper.style,{left:p.x+'%',top:p.y+'%',width:(p.scale*100)+'%',transform:`translate(${-pivot[0]*100}%,${-pivot[1]*100}%) rotate(${p.rot}deg)`,transformOrigin:`${pivot[0]*100}% ${pivot[1]*100}%`,zIndex:p.si<=8?'2':'4'});const image=document.createElement('img');image.src=this.art.sources[info.id];image.alt='';image.className='pfau-flight';wrapper.append(image);if(p.pair){Object.assign(image.style,{position:'absolute',left:'-14%',top:'0',scale:'-1 1'});const other=document.createElement('img');other.src=image.src;other.alt='';other.className='pfau-flight';Object.assign(other.style,{position:'absolute',left:'14%',top:'0'});wrapper.append(other);}this.picture.append(wrapper);if(p.si===12){this.base.style.clipPath=this.art.clawClip;this.foreground.style.clipPath=this.art.clawClip;}return wrapper;}
}
root.PeacockReward={plan,badge,View};if(typeof module!=='undefined')module.exports=root.PeacockReward;
})(globalThis);

