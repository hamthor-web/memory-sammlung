(function(root){
'use strict';
const stages=[null,...Array.from({length:10},(_,i)=>`assets/wundereiche/wundereiche-${String(i+1).padStart(2,'0')}.webp`)];
class View extends KnurpselReward.View {
 constructor(mount,counter,dialog,onFinish){
  super(mount,counter,dialog,onFinish,{kind:'wundereiche',name:'Wundereiche',stages,duration:2000,finishText:'… und jetzt entsteht etwas Neues. Bist auch du bereit?'});
  this.picture.classList.add('wundereiche-picture');
 }
 image(stage){
  const image=super.image(stage);
  if(stage===0)image.setAttribute('aria-label','Deine Wundereiche entsteht mit der ersten Lösung');
  return image;
 }
}
root.WonderOakReward={stages,View};
})(globalThis);
