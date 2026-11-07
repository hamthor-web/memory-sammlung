(function(root){
'use strict';
const pairs=[[0,1],[0,2],[1,2]];
const articles={m:{which:'Welcher',nom:'Der',acc:'den'},f:{which:'Welche',nom:'Die',acc:'die'},n:{which:'Welches',nom:'Das',acc:'das'}};
const capitalize=s=>s[0].toUpperCase()+s.slice(1);
function splitClause(text){const space=text.indexOf(' ');return {verb:text.slice(0,space),rest:text.slice(space+1)};}
function predicate(clauses,subordinate=false){
 const parts=clauses.map(splitClause);
 if(parts.length===2&&parts[0].verb===parts[1].verb){const rest=parts.map(p=>p.rest).join(' und ');return subordinate?rest+' '+parts[0].verb:parts[0].verb+' '+rest;}
 return parts.map(p=>subordinate?p.rest+' '+p.verb:p.verb+' '+p.rest).join(' und ');
}
function clause(card,g,k){return card.clausesOverride?.[k]||g.clauses[k][card.bits[k]];}
function formulate(q,card,g,style=0){
 const a=articles[g.gender],pronoun={m:'Er',f:'Sie',n:'Es'}[g.gender];
 const features=q.conditions.filter(x=>!x.exclude).map(x=>x.feature),combined=card.pairClausesOverride?.[features.join('')];
 const clauses=combined?[combined]:features.map(f=>clause(card,g,f)),object=g.accusative||g.motif;
 const positive=predicate(clauses),relative=predicate(clauses,true);
 const negative=q.conditions.find(x=>x.exclude);let neg=negative?g.negatives[negative.feature][negative.value]:'';
 if(negative&&card.group===5&&negative.feature===2&&card.bits[1]===0)neg=['trägt keinen roten Hut','trägt keinen gelben Hut'][negative.value];
 if(negative&&card.group===2&&negative.feature===1&&card.bits[0]===1)neg=['hat keine orangefarbenen Schwänze','hat keine lila Schwänze'][negative.value];
 const subject=a.nom+' '+g.motif,n=negative?splitClause(neg):null,extra=n?`${pronoun} ${n.verb} aber ${n.rest}. `:'';
 const patterns=[`${a.which} ${g.motif} ${positive}? ${extra}`,`Zeige mir ${a.acc} ${object}, ${a.nom.toLowerCase()} ${relative}. ${extra}`,`${subject} ${positive}. ${extra}Welches Bild passt?`,`Gesucht ist ${g.gender==='f'?'eine':'ein'} ${g.motif}. ${pronoun} ${positive}. ${extra}Zeige das passende Bild.`,`Entdecke ${a.acc} ${object}, ${a.nom.toLowerCase()} ${relative}. ${extra}`,`Schau genau: ${subject} ${positive}. ${extra}Welches Bild ist gemeint?`,`${subject} ${positive}. ${extra}Kannst du das passende Bild zeigen?`];
 return patterns[style%patterns.length].trim();
}
function buildMatrix(data){const questions=[];
 for(const c of data.cards){const g=data.groups[c.group-1];
  for(let f=0;f<3;f++)questions.push(make(c,g,1,[f]));
  for(const pair of pairs){questions.push(make(c,g,2,pair));questions.push(make(c,g,3,pair));}
 }
 function make(c,g,level,features){const conditions=features.map(f=>({feature:f,value:c.bits[f],exclude:false}));
  if(level===3){const f=[0,1,2].find(f=>!features.includes(f));conditions.push({feature:f,value:1-c.bits[f],exclude:true});}
  const q={id:`${c.id}-S${level}-F${features.map(x=>x+1).join('')}`,target:c.id,group:c.group,level,conditions};
  return {...q,variants:Array.from({length:7},(_,i)=>formulate(q,c,g,i))};
 }
 return questions;
}
function matches(card,q,ignoreExclusion=false){return card.group===q.group&&q.conditions.every(x=>ignoreExclusion&&x.exclude|| (x.exclude?card.bits[x.feature]!==x.value:card.bits[x.feature]===x.value));}
function valid(q,deck){const correct=deck.filter(c=>matches(c,q));if(correct.length!==1)return false;
 if(q.level===3&&deck.filter(c=>matches(c,q,true)).length!==2)return false;
 if(q.level===2){for(const cond of q.conditions){if(!deck.some(c=>c.group===q.group&&!matches(c,q)&&c.bits[cond.feature]!==cond.value&&q.conditions.filter(x=>x!==cond).every(x=>c.bits[x.feature]===x.value)))return false;}}
 return true;
}
function shuffle(items,rng=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function makeRound(data,matrix,options={},rng=Math.random){
 const level=Number(options.level||1),size=Number(options.size||6),used=new Set(options.used||[]),group=Number(options.group||0);
 const candidates=shuffle(matrix.filter(q=>q.level===level&&(!group||q.group===group)&&!used.has(q.id)),rng);
 for(const planned of candidates){
  const target=data.cards.find(c=>c.id===planned.target),same=data.cards.filter(c=>c.group===planned.group),deck=[target];
  const add=c=>{if(c&&!deck.some(x=>x.id===c.id))deck.push(c);};
  if(level===3){const partner=same.find(c=>c.id!==target.id&&matches(c,planned,true));if(!partner)continue;add(partner);}
  if(level===2){let possible=true;for(const cond of planned.conditions){const partner=same.find(c=>c.bits[cond.feature]!==cond.value&&planned.conditions.filter(x=>x!==cond).every(x=>c.bits[x.feature]===x.value));if(!partner){possible=false;break;}add(partner);}if(!possible)continue;}
  const wrong=shuffle(same.filter(c=>!matches(c,planned)),rng);for(const c of wrong){if(deck.length>=Math.min(size,4))break;add(c);}
  for(const c of shuffle(data.cards.filter(c=>c.group!==planned.group),rng)){if(deck.length>=size)break;add(c);}
  const laidOut=shuffle(deck,rng);if(!valid(planned,laidOut))continue;
  // Validate questions against the actual cards before selecting a formulation.
  const available=matrix.filter(q=>q.level===level&&q.group===planned.group&&valid(q,laidOut)&&!used.has(q.id));
  const question=available.find(q=>q.id===planned.id);if(!question)continue;
  return {deck:laidOut,question,answer:laidOut.find(c=>matches(c,question)).id};
 }
 if(used.size)return makeRound(data,matrix,{...options,used:[]},rng);
 throw new Error('Für diese Auswahl konnte keine eindeutige Aufgabe erstellt werden.');
}
const api={buildMatrix,formulate,matches,valid,makeRound,shuffle};root.QuestionEngine=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
