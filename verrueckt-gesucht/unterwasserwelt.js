(function(root){
'use strict';
const stages=[null,...Array.from({length:10},(_,i)=>`assets/unterwasserwelt/unterwasserwelt-${String(i+1).padStart(2,'0')}.webp`)];
class View extends KnurpselReward.View {
 constructor(mount,counter,dialog,onFinish){
  super(mount,counter,dialog,onFinish,{kind:'unterwasserwelt',name:'Unterwasserwelt',stages,duration:2000,finishText:'Du hast den Schatz gefunden!'});
  this.picture.classList.add('unterwasserwelt-picture');
 }
 image(stage){
  const image=super.image(stage);
  if(stage===0)image.setAttribute('aria-label','Deine Unterwasserwelt entsteht mit der ersten Lösung');
  return image;
 }
}
root.UnderwaterReward={stages,View};
})(globalThis);
