const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=process.env.TEST_BASE||'http://127.0.0.1:8765/';
const profileState={profiles:[{id:'anna',name:'Anna',level:1,count:6},{id:'ben',name:'Ben',level:1,count:6}],activeId:'anna'};
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,serviceWorkers:'block',reducedMotion:'reduce'});
 await context.addInitScript(state=>{if(!localStorage.getItem('fuehlmemory-profiles-v1'))localStorage.setItem('fuehlmemory-profiles-v1',JSON.stringify(state));},profileState);
 const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
 async function resume(){await page.locator('#collectionDialog').getByRole('button',{name:'Weiterspielen',exact:true}).click();}
 async function ready(){await page.locator('#collectionDialog').getByRole('button',{name:'Ich bin bereit',exact:true}).click();}
 await page.goto(base+'index.html?menu=1');
 await page.evaluate(()=>localStorage.setItem('verrueckt-gesucht-rewards-v1',JSON.stringify({used:['pfau'],finished:{pfau:{html:'<div>Altes Bild</div>'}}})));
 await page.reload();await page.locator('#legacyOwner').waitFor();assert.equal(await page.locator('#legacyOwner').inputValue(),'');
 await page.locator('#legacyOwner').selectOption('ben');await page.getByRole('button',{name:'Bilder diesem Kind zuordnen'}).click();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('memory-legacy-rewards-owner-v1')).ownerId),'ben');
 console.log('PASS explicit legacy owner selection with untouched backup');
 await page.goto(base+'eigenschaften.html');await page.locator('#modeTwo').click();await page.locator('#duoName1').fill('Ben');await page.locator('#startGame').click();await page.locator('#ready').click();await page.locator('#fan button').last().click();
 let wrong=await page.evaluate(()=>field.find(c=>!E.matches(c,question)).id);await page.locator('#cards [data-id="'+wrong+'"]').click();await page.locator('#wrongContinue').click();
 assert.match(await page.locator('#collectionDialog').innerText(),/Ben/);await page.reload();await resume();assert.match(await page.locator('#collectionDialog').innerText(),/Ben/);await ready();
 assert.equal(await page.evaluate(()=>turn),1);
 let correct=await page.evaluate(()=>field.find(c=>!found.has(c.id)&&E.matches(c,question)).id);await page.locator('#cards [data-id="'+correct+'"]').click();await page.locator('#successReadNext').click();
 await page.reload();await resume();assert.deepEqual(await page.evaluate(()=>({turn,points,found:found.size,stage})),{turn:1,points:[0,1],found:1,stage:'choose'});
 for(let n=0;n<5;n++){await page.locator('#fan button').last().click();const id=await page.evaluate(()=>field.find(c=>!found.has(c.id)&&E.matches(c,question)).id);await page.locator('#cards [data-id="'+id+'"]').click();await page.locator('#successReadNext').click();if(n<4)await page.waitForFunction(()=>stage==='choose');}
 await page.reload();await resume();assert.match(await page.locator('#duoFinish').innerText(),/Ben: 6 Karten/);assert.equal(await page.locator('#finish').isVisible(),true);assert.equal(await page.evaluate(()=>CollectionSession.progress.loadRound('anna','eigenschaften')),null);
 console.log('PASS properties handover, interrupted animations, six consecutive hits and interrupted final-result resume');
 await page.goto(base+'wortmemory/test-zweispieler-2026-11-06.html');await page.locator('.mode[data-mode="2"]').click();await page.locator('#player2Name').fill('Ben');await page.locator('.count[data-count="6"]').click();await page.locator('#startWordMemory').click();
 const cards=await page.locator('#grid .card').evaluateAll(es=>es.map(e=>e.dataset.pair));const other=cards.findIndex(x=>x!==cards[0]);await page.locator('#grid .card').nth(0).click();await page.locator('#grid .card').nth(other).click();await page.locator('#compareTray button').first().click();await page.locator('#compareTray button').first().click();
 assert.match(await page.locator('#collectionDialog').innerText(),/Ben/);await page.reload();await resume();await ready();assert.equal(await page.evaluate(()=>activePlayer),1);
 async function wordPair(){const id=await page.locator('#grid .card:not(.matched)').first().getAttribute('data-pair');await page.locator('#grid [data-pair="'+id+'"]').nth(0).click();await page.locator('#grid [data-pair="'+id+'"]').nth(1).click();await page.locator('#choices').waitFor();}
 async function wordAnswer(){await page.evaluate(()=>{const question=pendingQuiz.question;document.querySelectorAll('#choices button')[question.answer==='a'?0:1].click();});await page.waitForTimeout(750);}
 await wordPair();const quiz=await page.locator('.quiztext').innerText();await page.reload();await resume();assert.equal(await page.locator('.quiztext').innerText(),quiz);assert.deepEqual(await page.evaluate(()=>playerScores),[0,1]);await wordAnswer();assert.equal(await page.evaluate(()=>activePlayer),1);
 for(let i=0;i<5;i++){await wordPair();await wordAnswer();}
 await page.getByText('Super! Alle Wortpaare sind gefunden.',{exact:true}).waitFor();assert.deepEqual(await page.evaluate(()=>playerScores),[0,6]);assert.equal(await page.evaluate(()=>CollectionSession.progress.loadRound('anna','wortmemory')),null);
 console.log('PASS word mismatch handover, exact quiz resume, no duplicate scores, six consecutive hits and result');
 await page.route('**/synonymmemory/app.js',route=>route.fulfill({contentType:'application/javascript',body:fs.readFileSync(path.join(__dirname,'../synonymmemory/app.js'),'utf8').replace(/\}\)\(\);\s*$/,'window.__synState=()=>({deck,phase,open,turn,scores,found:[...found]});})();')}));
 await page.goto(base+'synonymmemory/index.html');await page.locator('[data-mode="2"]').click();await page.locator('#syn-name2').fill('Ben');await page.locator('[data-count="6"]').click();await page.locator('#syn-start').click();
 const synOther=await page.evaluate(()=>__synState().deck.findIndex(c=>c.id!==__synState().deck[0].id));await page.locator('#syn-board button').nth(0).click();await page.locator('#syn-second').click();await page.locator('#syn-board button').nth(synOther).click();await page.locator('#syn-yes').click();assert.match(await page.locator('#syn-feedback').innerText(),/verschiedene/);await page.locator('#syn-no').click();await page.locator('#syn-next').click();
 await page.reload();await resume();await ready();assert.equal(await page.evaluate(()=>__synState().turn),1);
 for(let n=0;n<6;n++){const positions=await page.evaluate(()=>{const s=__synState(),id=s.deck.find(c=>!s.found.includes(c.id)).id;return s.deck.map((c,i)=>c.id===id?i:-1).filter(i=>i>=0);});await page.locator('#syn-board button').nth(positions[0]).click();await page.locator('#syn-second').click();await page.locator('#syn-board button').nth(positions[1]).click();if(n===0){await page.reload();await resume();await page.locator('#syn-no').click();assert.match(await page.locator('#syn-feedback').innerText(),/dieselbe/);}await page.locator('#syn-yes').click();await page.locator('#syn-next').click();}
 assert.match(await page.locator('#syn-end').innerText(),/Ben/);assert.deepEqual(await page.evaluate(()=>__synState().scores),[0,6]);
 console.log('PASS synonyms correction without point penalty, handover resume, decision resume and end result');
 await page.goto(base+'verrueckt-gesucht/index.html');await page.locator('#rewardManual').click();await page.locator('#rewardChoice').selectOption('knurpsel');await page.locator('#start').click();
 const answer=await page.evaluate(()=>round.answer);await page.locator('#board [data-id="'+answer+'"] .answer').click();await page.reload();await resume();assert.equal(await page.evaluate(()=>number),2);assert.equal(await page.evaluate(()=>reward.state.progress),1);assert.equal(await page.evaluate(()=>firstTry),1);
 for(let n=1;n<10;n++){const answer=await page.evaluate(()=>round.answer);await page.locator('#board [data-id="'+answer+'"] .answer').click();await page.locator('#treeContinue').waitFor({state:'visible',timeout:12000});await page.locator('#treeContinue').click();}
 await page.locator('#finish:not([hidden])').waitFor();await page.locator('#choose').click();await page.locator('#openGallery').click();assert.equal(await page.locator('.gallery-tile').count(),1);assert.match(await page.locator('#gallery h1').innerText(),/Anna/);
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('memory-progress-v1:anna')));assert(saved.rewards.finished.knurpsel.model);assert(!saved.rewards.finished.knurpsel.html);assert(!saved.rounds['verrueckt-gesucht']);
 await page.goto(base+'index.html?menu=1');await page.locator('#changeProfile').click();await page.locator('#profiles').getByRole('button',{name:'Ben',exact:true}).click();await page.goto(base+'verrueckt-gesucht/index.html');assert.equal(await page.locator('#collectionDialog').count(),0);await page.locator('#openGallery').click();assert.equal(await page.locator('.gallery-tile').count(),1);assert.match(await page.locator('.gallery-tile').innerText(),/Pfau/);assert.match(await page.locator('#gallery h1').innerText(),/Ben/);
 assert.deepEqual(errors,[]);console.log('PASS search interrupted reward resume, full ten-task round, compact gallery model and child isolation');
 await context.close();
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
