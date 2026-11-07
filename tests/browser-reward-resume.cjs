const {chromium}=require('playwright');const assert=require('node:assert/strict');
const base=process.env.TEST_BASE||'http://127.0.0.1:8765/';
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/chromium',args:['--no-sandbox']});try{
 const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});await context.addInitScript(()=>{if(!localStorage.getItem('fuehlmemory-profiles-v1'))localStorage.setItem('fuehlmemory-profiles-v1',JSON.stringify({activeId:'anna',profiles:[{id:'anna',name:'Anna',level:1,count:6}]}));});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'verrueckt-gesucht/index.html');
 const ids=await page.locator('#rewardChoice option').evaluateAll(es=>es.map(e=>e.value));
 for(const id of ids){await page.locator('#rewardManual').click();await page.locator('#rewardChoice').selectOption(id);await page.locator('#start').click();const answer=await page.evaluate(()=>round.answer);await page.locator('#board [data-id="'+answer+'"] .answer').click();await page.reload();await page.locator('#collectionDialog').getByRole('button',{name:'Weiterspielen',exact:true}).click();assert.equal(await page.evaluate(()=>reward.state.progress),1,id);assert.equal(await page.evaluate(()=>number),2,id);assert.equal(await page.evaluate(()=>firstTry),1,id);
 const task=await page.evaluate(()=>({question:$('question').textContent,deck:round.deck.map(c=>c.id)}));await page.reload();await page.locator('#collectionDialog').getByRole('button',{name:'Weiterspielen',exact:true}).click();assert.deepEqual(await page.evaluate(()=>({question:$('question').textContent,deck:round.deck.map(c=>c.id)})),task,id);
 await page.locator('#playBack').click();await page.evaluate(()=>CollectionSession.clear('verrueckt-gesucht'));console.log('PASS reward and exact task resume '+id);
 }
 assert.deepEqual(errors,[]);await context.close();
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
