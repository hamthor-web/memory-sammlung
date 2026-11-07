const assert=require('node:assert/strict'),fs=require('node:fs');
require('./data.js');const E=require('./engine.js'),d=GAME_DATA,m=E.buildMatrix(d);
assert.equal(m.length,1080);assert.equal(new Set(m.map(q=>q.id)).size,1080);
for(const c of d.cards){const qs=m.filter(q=>q.target===c.id);assert.equal(qs.length,9);for(let s=1;s<=3;s++)assert.equal(qs.filter(q=>q.level===s).length,3);}
for(const q of m){const c=d.cards.find(c=>c.id===q.target);assert(E.matches(c,q));assert.equal(q.conditions.filter(x=>x.exclude).length,q.level===3?1:0);assert.equal(q.conditions.filter(x=>!x.exclude).length,q.level===1?1:2);assert.equal(q.variants.length,7);for(const text of q.variants){assert(!/undefined|null|Häschen/.test(text));assert(text.length<310);}}
let seed=113;const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};let count=0;
for(let group=0;group<=20;group++)for(let level=1;level<=3;level++)for(const size of [6,9,12]){const used=[];for(let i=0;i<10;i++){
 const r=E.makeRound(d,m,{group,level,size,used},rng);used.push(r.question.id);assert.equal(r.deck.length,size);assert.equal(new Set(r.deck.map(c=>c.id)).size,size);assert(E.valid(r.question,r.deck));assert.equal(r.deck.filter(c=>E.matches(c,r.question)).length,1);assert.equal(r.answer,r.question.target);if(group)assert.equal(r.question.group,group);if(level===3)assert.equal(r.deck.filter(c=>E.matches(c,r.question,true)).length,2);count++;
}}
// Deliberately ambiguous displays and redundant exclusions must be rejected.
const hard=m.find(q=>q.level===3&&d.cards.filter(c=>E.matches(c,q,true)).length===2);
assert(!E.valid(hard,[d.cards.find(c=>c.id===hard.target)]));
const simple=m.find(q=>q.level===1);assert(!E.valid(simple,d.cards.filter(c=>c.group===simple.group)));
// Main and relative clauses require different verb positions.
const sample=(group,bits,features,level=2,style=4)=>{const c=d.cards.find(c=>c.group===group&&c.bits.join('')===bits);const q=m.find(q=>q.target===c.id&&q.level===level&&q.conditions.filter(x=>!x.exclude).map(x=>x.feature).join('')===features);return q.variants[style];};
assert.equal(sample(12,'100','0',1),'Entdecke den Roboter, der drei Augen hat.');
assert.equal(sample(10,'000','02'),'Entdecke das Mädchen, das zwei Zöpfe hat und ein gelbes Kleid trägt.');
assert.equal(sample(12,'000','01'),'Entdecke den Roboter, der zwei Augen und rote Bauchknöpfe hat.');
assert.equal(sample(8,'000','02'),'Entdecke den Frosch, der grün ist und auf einer Wolke sitzt.');
assert.equal(sample(14,'000','02'),'Entdecke die Blume, die zwei Blüten hat und in einem gelben Blumentopf steht.');
assert.equal(sample(12,'100','01',3),'Entdecke den Roboter, der drei Augen und rote Bauchknöpfe hat. Er hat aber nicht zwei Antennen.');
for(const q of m)for(const text of q.variants){assert(!/, (der|die|das) (hat|trägt|sitzt|ist|steht)\b/.test(text),text);assert(!/aber (hat|trägt|sitzt|ist|steht)\b/.test(text),text);if(q.group===9)assert(!/orange/.test(text),text);}
assert.deepEqual(d.groups[8].features[1][1],['rot','blau']);
assert.equal(sample(11,'000','0',1),'Entdecke den Jungen, der eine rote Mütze trägt.');
assert.equal(sample(3,'000','01'),'Entdecke den Drachen, der zwei rote Ohren hat.');
assert.equal(sample(5,'000','12'),'Entdecke den Elefanten, der einen roten Hut trägt.');
assert.equal(sample(2,'000','01'),'Entdecke die Katze, die einen orangefarbenen Schwanz hat.');
assert.equal(sample(13,'000','01'),'Entdecke den Apfelbaum, der drei blaue Äpfel hat.');
assert.equal(sample(14,'000','01'),'Entdecke die Blume, die zwei rote Blüten hat.');
assert.equal(sample(17,'000','01'),'Entdecke die Tasche, die zwei gelbe Knöpfe hat.');
const artifact={project:'Verrückt gesucht!',version:2,cardCount:120,questionCount:1080,formulationsPerQuestion:7,levels:[{id:1,rule:'1 positives Merkmal'},{id:2,rule:'2 positive Merkmale, beide zur Unterscheidung nötig'},{id:3,rule:'2 positive Merkmale plus Ausschluss der anderen Ausprägung des dritten Merkmals; ohne Ausschluss genau 2 passende Karten'}],questions:m};
fs.writeFileSync('./questions.json',JSON.stringify(artifact,null,2));
console.log(`OK: ${m.length} Grundaufgaben, ${m.length*7} Formulierungen und ${count} Auslagen geprüft.`);
