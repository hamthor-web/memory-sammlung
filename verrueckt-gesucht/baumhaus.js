(function(root){
'use strict';
const stages=[null,...Array.from({length:10},(_,i)=>`assets/baumhaus/baumhaus-${String(i+1).padStart(2,'0')}.webp`)];
class View extends KnurpselReward.View {
 constructor(mount,counter,dialog,onFinish){
  super(mount,counter,dialog,onFinish,{kind:'baumhaus',name:'Baumhaus',stages,duration:2000,finishText:'Dein Baumhaus ist jetzt fertig!'});
  this.picture.classList.add('baumhaus-picture');
 }
 image(stage){
  const image=super.image(stage);
  if(stage===0)image.setAttribute('aria-label','Dein Baumhaus entsteht mit der ersten Lösung');
  return image;
 }
}
root.TreehouseReward={stages,View};
})(globalThis);
