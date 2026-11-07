(function(root){
'use strict';
const stages=[null,...Array.from({length:10},(_,i)=>`assets/matschwiese/matschwiese-${String(i+1).padStart(2,'0')}.jpeg`)];
class View extends KnurpselReward.View {
 constructor(mount,counter,dialog,onFinish){
  super(mount,counter,dialog,onFinish,{kind:'matschwiese',name:'Matschwiese',stages,duration:1500,finishText:'Wer hat jetzt hier Pech gehabt?'});
  this.picture.classList.add('matschwiese-picture');
 }
 image(stage){
  const image=super.image(stage);
  if(stage===0)image.setAttribute('aria-label','Deine Matschgeschichte beginnt mit der ersten Lösung');
  return image;
 }
}
root.MeadowReward={stages,View};
})(globalThis);
