(function(root){
'use strict';
const stages=[null,...Array.from({length:10},(_,i)=>`assets/marsmission/marsmission-${String(i+1).padStart(2,'0')}.webp${i===5?'?v=2':''}`)];
class View extends KnurpselReward.View {
 constructor(mount,counter,dialog,onFinish){
  super(mount,counter,dialog,onFinish,{kind:'marsmission',name:'Marsmission',stages,duration:2000,finishText:'Geschafft! Deine Marsmission ist gelungen.'});
  this.picture.classList.add('marsmission-picture');
 }
 image(stage){
  const image=super.image(stage);
  if(stage===0)image.setAttribute('aria-label','Deine Marsmission beginnt mit der ersten Lösung');
  return image;
 }
}
root.MarsMissionReward={stages,View};
})(globalThis);
