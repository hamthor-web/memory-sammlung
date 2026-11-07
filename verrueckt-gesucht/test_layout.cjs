const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8'),css=fs.readFileSync('style.css','utf8'),app=fs.readFileSync('app.js','utf8');
const choices=[...html.matchAll(/<option value="(\d+)">\d+ Bilder<\/option>/g)].map(x=>Number(x[1]));assert.deepEqual(choices,[6,9,12]);
const source=app.slice(app.indexOf('function fitBoard(){'),app.indexOf("window.addEventListener?.('resize'"));
for(const [width,height,top] of [[390,844,240],[768,1024,250],[1024,768,250],[820,1180,280],[1180,820,280]])for(const size of [6,9,12]){
 const landscape=width>height,columns=size===6?2:size===9?3:landscape?4:3,rows=Math.ceil(size/columns);let imageHeight;
 const board={dataset:{size:String(size)},getBoundingClientRect:()=>({top,width:width-24}),style:{setProperty:(k,v)=>{imageHeight=parseFloat(v);}}};
 const context=vm.createContext({$:id=>id==='board'?board:{hidden:false},window:{innerHeight:height,matchMedia:()=>({matches:landscape})}});vm.runInContext(source+'fitBoard()',context);
 assert(imageHeight>=72);assert(top+rows*(imageHeight+16)+(rows-1)*10<=height-16,`${width}x${height}: ${size} cards exceed viewport`);
}
assert(css.includes('#board[data-size="6"]{grid-template-columns:repeat(2'));
assert(css.includes('#board[data-size="9"],#board[data-size="12"]{grid-template-columns:repeat(3'));
assert(css.includes('@media(orientation:landscape){#board[data-size="12"]{grid-template-columns:repeat(4'));
console.log('OK: 6/9/12 Karten und berechnete Rasterhöhen für 15 Handy-/Tablet-Konfigurationen. Kein gerenderter Browsertest.');
