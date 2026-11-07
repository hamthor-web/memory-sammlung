(function(root){
'use strict';
const stages=[null,...Array.from({length:10},(_,i)=>`assets/blumenwiese/blumenwiese-${String(i+1).padStart(2,'0')}.webp`)];
class View extends KnurpselReward.View {
 constructor(mount,counter,dialog,onFinish){
  super(mount,counter,dialog,onFinish,{kind:'blumenwiese',name:'Blumenwiese',stages,duration:2000,finishText:'Aus etwas Kleinem ist etwas Schönes gewachsen!'});
  this.picture.classList.add('blumenwiese-picture');
 }
 image(stage){
  const image=super.image(stage);
  if(stage===0)image.setAttribute('aria-label','Deine Blumenwiese entsteht mit der ersten Lösung');
  return image;
 }
}
root.FlowerReward={stages,View};
})(globalThis);
