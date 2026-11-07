(function(root){
'use strict';
const stages=[null,...Array.from({length:10},(_,i)=>`assets/kinderzimmer/kinderzimmer-${String(i+1).padStart(2,'0')}.webp`)];
class View extends KnurpselReward.View {
 constructor(mount,counter,dialog,onFinish){
  super(mount,counter,dialog,onFinish,{kind:'kinderzimmer',name:'Chaos im Kinderzimmer',stages,duration:2000,finishText:'War das alles nur ein Traum?'});
  this.picture.classList.add('kinderzimmer-picture');
 }
 image(stage){
  const image=super.image(stage);
  if(stage===0)image.setAttribute('aria-label','Deine Zimmergeschichte beginnt mit der ersten Lösung');
  return image;
 }
}
root.BedroomReward={stages,View};
})(globalThis);
