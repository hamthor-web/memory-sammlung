const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block'});
 await context.addInitScript(()=>{if(!localStorage.getItem('fuehlmemory-profiles-v1'))localStorage.setItem('fuehlmemory-profiles-v1',JSON.stringify({profiles:[{id:'anna',name:'Anna',level:1,count:6},{id:'ben',name:'Ben',level:1,count:6}],activeId:'anna'}));});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8765/eigenschaften.html');
 assert(await page.locator('#puzzleResume').isDisabled());
 await page.locator('#puzzleManual').click();assert.equal(await page.locator('#puzzleChoices button').count(),7);await page.locator('#puzzleChoices button').first().click();
 const id=await page.evaluate(()=>CollectionSession.progress&&JSON.parse(localStorage.getItem('memory-progress-v1:anna')).propertyPuzzles.selected);
 async function complete(level){
  await page.locator(`#levelButtons button[data-value="${level}"]`).click();await page.locator('#startGame').click();await page.locator('#ready').click();
  while(await page.evaluate(()=>found.size<field.length)){
   await page.locator('#fan button').last().click();const correct=await page.evaluate(()=>field.find(c=>!found.has(c.id)&&E.matches(c,question)).id);
   await page.locator(`#cards [data-id="${correct}"]`).click();await page.locator('#successReadNext').click();await page.evaluate(()=>{if(stage==='reward')document.getElementById('rewardVideo').onended?.();});
   await page.waitForFunction(()=>stage==='choose'||stage==='finish');
  }
  await page.locator('#finish').waitFor({state:'visible'});console.log('PASS complete level',level,'duo',await page.evaluate(()=>duo));
 }
 await complete(1);await page.screenshot({path:`${process.env.PUZZLE_SCREENSHOTS||'/tmp'}/puzzle-reward.png`,fullPage:true});assert.match(await page.locator('#puzzleReward').innerText(),/1 von 6/);assert.equal(await page.locator('#puzzleReward .puzzle-new').count(),1);
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('memory-progress-v1:anna')).propertyPuzzles.pieces[PROPERTY_PUZZLES[0].id]),1);
 await page.locator('#puzzleMenu').click();assert(await page.locator('#puzzleResume').isEnabled());
 await page.locator('#startGame').click();await page.reload();await page.getByRole('button',{name:'Weiterspielen',exact:true}).click();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('memory-progress-v1:anna')).propertyPuzzles.pieces[PROPERTY_PUZZLES[0].id]),1,'aborted round adds nothing');
 await page.evaluate(()=>reset());await complete(2);assert.equal(await page.locator('#puzzleReward .puzzle-new').count(),2);await page.locator('#puzzleMenu').click();
 await complete(3);assert.equal(await page.locator('#puzzleReward .puzzle-new').count(),3);await page.locator('#puzzleMenu').click();
 await page.locator('#puzzleGallery').click();assert.equal(await page.locator('#puzzleChoices button:enabled').count(),1);await page.locator('#puzzleChoices button:enabled').click();await page.locator('#puzzleImageDialog').waitFor({state:'visible'});await page.locator('#puzzleImageClose').click();await page.locator('#puzzleDialogClose').click();
 // A persisted last-card checkpoint finishes exactly once after a reload.
 await page.locator('#puzzleRandom').click();await page.locator('#startGame').click();await page.locator('#ready').click();
 await page.evaluate(()=>{found=new Set(field.map(c=>c.id));stage='reward';checkpoint();});await page.reload();await page.getByRole('button',{name:'Weiterspielen',exact:true}).click();assert(await page.locator('#puzzleReward .puzzle-picture').count());
 const completed=await page.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('memory-progress-v1:anna')).propertyPuzzles.receipts).length);await page.reload();assert.equal(await page.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('memory-progress-v1:anna')).propertyPuzzles.receipts).length),completed);
 await page.locator('#modeTwo').click();assert(await page.locator('#puzzleSetup').isHidden());await complete(1);assert.match(await page.locator('#duoFinish').innerText(),/Anna: 6 Karten/);assert.equal(await page.locator('#puzzleReward .puzzle-picture').count(),0);assert.equal(await page.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('memory-progress-v1:anna')).propertyPuzzles.receipts).length),completed);
 await page.evaluate(()=>{CollectionSession.flush();const p=MemoryProfiles.createStore(localStorage).select('ben');applyProfile(p);});assert(await page.locator('#puzzleResume').isDisabled());await page.locator('#modeSolo').click();assert(await page.locator('#puzzleResume').isDisabled());
 await page.screenshot({path:`${process.env.PUZZLE_SCREENSHOTS||'/tmp'}/puzzle-menu.png`,fullPage:true});
 for(const [width,height]of [[393,852],[852,393],[768,1024],[1024,768]]){
  await page.setViewportSize({width,height});await page.evaluate(()=>{document.documentElement.style.setProperty('--button-zoom','2');document.getElementById('fieldZoomIn').click();});
  await page.locator('#puzzleManual').click();await page.screenshot({path:`${process.env.PUZZLE_SCREENSHOTS||'/tmp'}/puzzle-qa-${width}.png`,fullPage:true});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`no page overflow ${width}`);
  assert(await page.evaluate(()=>[...document.querySelectorAll('#puzzleChoices button')].every(b=>b.getBoundingClientRect().width>=44)));
  await page.locator('#puzzleDialogClose').click();
 }
 assert.deepEqual(errors,[]);console.log('PASS complete solo levels 1/2/3, interruption/resume, final checkpoint, gallery, profile switch, duo scoring, four formats at enlarged text');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
