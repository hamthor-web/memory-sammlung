(function(root){
function combinations(xs,n){if(n===0)return [[]];return xs.flatMap((x,i)=>combinations(xs.slice(i+1),n-1).map(t=>[x,...t]));}
function matches(card,q){return q.yes.every(p=>card.properties.includes(p))&&q.no.every(p=>!card.properties.includes(p));}
function key(q){return JSON.stringify([q.yes.slice().sort(),q.no.slice().sort()]);}
function semanticKey(q,reference){return 'answers:'+reference.filter(c=>matches(c,q)).map(c=>c.id).sort().join(',');}
function questions(cards,level,reference=cards){
 const out=[],seen=new Set();function add(yes,no=[]){const q={yes,no},k=key(q);if(seen.has(k)||!cards.some(c=>matches(c,q)))return;seen.add(k);out.push(q);}
 for(const c of cards){if(level<3){combinations(c.properties,level).forEach(p=>add(p));continue;}
 combinations(c.properties,3).forEach(p=>add(p));
 combinations(c.properties,2).forEach(pair=>{const similar=reference.filter(other=>other.id!==c.id&&pair.every(p=>other.properties.includes(p)));const negatives=[...new Set(similar.flatMap(other=>other.properties))].filter(p=>!c.properties.includes(p));negatives.forEach(p=>add(pair,[p]));});}
 return out;
}
function wording(q){if(q.yes.length===1&&q.yes[0]==='süß'&&!q.no.length)return 'Was schmeckt süß?';const pos=q.yes.length===3?q.yes.slice(0,2).join(', ')+' und '+q.yes[2]:q.yes.join(' und ');return 'Was ist '+pos+(q.no.length?', aber nicht '+q.no.join(' oder '):'')+'?';}
function shuffle(items,random=Math.random){const out=items.slice();for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
function selectRound(pool,count,level){return shuffle(pool.filter(c=>questions([c],level,pool).length)).slice(0,count);}
function chooseQuestion(cards,level,reference,history){const qs=questions(cards,level,reference),fresh=qs.filter(q=>!history.has(key(q))),different=fresh.filter(q=>!history.has(semanticKey(q,reference))),source=different.length?different:fresh.length?fresh:qs;return source.length?source[Math.floor(Math.random()*source.length)]:null;}
const api={questions,matches,wording,key,semanticKey,shuffle,selectRound,chooseQuestion};root.MemoryEngine=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
