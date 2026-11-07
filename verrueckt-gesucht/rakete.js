(function(root){
'use strict';
const stages=[null,...Array.from({length:10},(_,i)=>`assets/rakete/rakete-${String(i+1).padStart(2,'0')}.png`)];
const descriptions=['Rakete','Flamme','Erstes Auge','Zweites Auge','Mund mit Zunge','Großer Haken','Leiter','Astronaut','Sternschnuppe','Sternenhimmel'];
class View extends KnurpselReward.View {
 constructor(mount,counter,dialog,onFinish){super(mount,counter,dialog,onFinish,{kind:'rakete',name:'Rakete',stages,descriptions,duration:2000});}
}
root.RocketReward={stages,View};
})(globalThis);
