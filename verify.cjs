const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
require('./cards.js');const pool=globalThis.MEMORY_CARDS,E=require('./engine.js');
const lines=fs.readFileSync(path.join(__dirname,'CARD_MATRIX.csv'),'utf8').replace(/^\uFEFF/,'').trim().split(/\r?\n/),header=lines.shift().split(';');
assert.equal(pool.length,30);assert.equal(new Set(pool.map(c=>c.id)).size,30);
for(const line of lines){const parts=line.split(';'),card=pool.find(c=>c.id===parts[0]);assert(card);assert.equal(card.name,parts[1]);assert.deepEqual(card.properties,header.filter((_,i)=>parts[i]==='✓'));assert(fs.existsSync(path.join(__dirname,card.image)));}
assert.equal(E.wording({yes:['süß'],no:[]}),'Was schmeckt süß?');
for(let level=1;level<=3;level++){
 const eligible=pool.filter(c=>E.questions([c],level,pool).length);
 for(const card of eligible){const qs=E.questions([card],level,pool);for(const q of qs){assert(E.matches(card,q));assert.equal(q.yes.length+q.no.length,level);assert(!q.yes.some(p=>q.no.includes(p)));if(q.no.length)assert(pool.some(other=>q.yes.every(p=>other.properties.includes(p))&&!E.matches(other,q)));}}
 let rounds=0;for(const count of [6,12,18].filter(n=>n<=eligible.length))for(let repeat=0;repeat<100;repeat++){
 const field=E.selectRound(pool,count,level);assert.equal(field.length,count);assert.equal(new Set(field.map(c=>c.id)).size,count);const remaining=field.slice(),history=new Set();let used=0;
 while(remaining.length){const qs=E.questions(remaining,level,pool),fresh=qs.filter(q=>!history.has(E.key(q))),different=fresh.filter(q=>!history.has(E.semanticKey(q,pool))),q=E.chooseQuestion(remaining,level,pool,history);assert(q);assert(qs.every(candidate=>remaining.some(c=>E.matches(c,candidate))));if(fresh.length)assert(!history.has(E.key(q)));if(different.length)assert(!history.has(E.semanticKey(q,pool)));history.add(E.key(q));history.add(E.semanticKey(q,pool));const index=remaining.findIndex(c=>E.matches(c,q));assert(index>=0);remaining.splice(index,1);used++;assert(count+2-used>=2);}
 rounds++;
 }
 console.log(`Stufe ${level}: ${eligible.length} geeignete Karten, ${rounds} vollständige Runden geprüft.`);
}
for(const name of ['Drehende_Karte_12Bilder_3s_weiss.webp','02_drehen_weiss.mp4','03_zwinkern.mp4','04_ausrutschen.mp4'])assert(fs.statSync(path.join(__dirname,'assets/animations',name)).size>0);
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'manifest.webmanifest'),'utf8'));for(const icon of manifest.icons)assert(fs.existsSync(path.join(__dirname,icon.src)));
console.log('Matrix, Originalassets, Icons und Fragenlogik geprüft.');
