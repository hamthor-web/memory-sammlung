/* Run against an authorized local preview: TEST_BASE=http://127.0.0.1:8765/ */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
fs.mkdirSync('/tmp/word-trees',{recursive:true});
const base=process.env.TEST_BASE||'http://127.0.0.1:8765/';
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/chromium',args:['--no-sandbox']});try{
 const context=await browser.newContext({viewport:{width:393,height:780},serviceWorkers:'block',reducedMotion:'reduce'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await context.addInitScript(()=>{if(!localStorage.getItem('fuehlmemory-profiles-v1'))localStorage.setItem('fuehlmemory-profiles-v1',JSON.stringify({profiles:[{id:'anna',name:'Anna',level:1,count:6},{id:'ben',name:'Ben',level:1,count:6}],activeId:'anna'}));});
 await page.goto(base+'wortmemory/index.html');assert.equal(await page.locator('#treeResume').isDisabled(),true);
 await page.locator('#treeChoose').click();await page.locator('#treeChoices button').filter({hasText:'Mondlichtbaum'}).click();await page.locator('[data-count="6"]').click();await page.locator('#startWordMemory').click();
 const run=await page.evaluate(()=>treeRun);assert.equal(run.tree,'mond');await page.reload();await page.getByRole('button',{name:'Weiterspielen',exact:true}).click();assert.deepEqual(await page.evaluate(()=>treeRun),run);
 for(let n=0;n<6;n++){
  const indexes=await page.evaluate(()=>{const els=[...document.querySelectorAll('#grid .card')],first=els.find(e=>!e.classList.contains('matched'));return els.map((el,i)=>el.dataset.pair===first.dataset.pair?i:-1).filter(i=>i>=0);});
  await page.locator('#grid .card').nth(indexes[0]).click();await page.locator('#grid .card').nth(indexes[1]).click();await page.locator('#choices button').first().waitFor();const answer=await page.evaluate(()=>pendingQuiz.question.answer);await page.locator('#choices button').nth(answer==='a'?0:1).click();await page.waitForTimeout(850);
 }
 await page.locator('#treeWant').waitFor();assert.equal(await page.evaluate(()=>WordTrees.pending().after),1);await page.reload();await page.getByRole('button',{name:'Weiterspielen',exact:true}).click();await page.locator('#treeWant').waitFor();assert.equal(await page.evaluate(()=>WordTrees.pending().after),1);
 await page.locator('#treeWant').click();await page.locator('#treeClose:enabled').waitFor();let art=page.frameLocator('.tree-dialog iframe');assert.equal(await art.locator('.item.visible').count(),1);await page.locator('#treeClose').click();await page.locator('#back').click();assert.equal(await page.locator('#treeResume').isDisabled(),false);
 console.log('PASS full six-pair game, quiz, jubel, saved round, unseen reward reload, once-only reveal');
 for(const [width,height] of [[393,780],[780,393],[768,1024],[1024,768]]){
  await page.setViewportSize({width,height});
  for(const [id,label] of [['herbst','Herbstbaum'],['mond','Mondlichtbaum'],['rosa','Rosa Zauberbaum'],['zauber','Erster Zauberbaum']]){
   await page.evaluate(id=>{const s=WordTreeStore.createStore(localStorage);for(let i=0;i<10;i++){const r=s.award('anna','qa-'+id+i,id);if(r)s.seen('anna',r.run);}},id);
   await page.locator('#treeGallery').click();await page.locator('#treeChoices button').filter({hasText:new RegExp('^'+label+' ·')}).click();await page.locator('#treeClose:enabled').waitFor();art=page.frameLocator('.tree-dialog iframe');const oak=id==='zauber';assert.equal(await art.locator(oak?'.reward.shown':'.item.visible').count(),10);
   await page.screenshot({path:`/tmp/word-trees/${id}-${width}x${height}-normal.png`});
   const pictureBefore=await art.locator('.scene').evaluate(e=>e.getBoundingClientRect().width);
   await art.locator(oak?'#textZoom':'#textSize').evaluate(e=>{e.value='150';e.dispatchEvent(new Event('input',{bubbles:true}));});
   assert(Math.abs(await art.locator('.scene').evaluate(e=>e.getBoundingClientRect().width)-pictureBefore)<1,'Text zoom preserves tree width');
   const fontBefore=await art.locator('body').evaluate(e=>getComputedStyle(e).fontSize);
   await art.locator(oak?'#treeZoom':'#treeSize').evaluate(e=>{e.value='180';e.dispatchEvent(new Event('input',{bubbles:true}));});
   assert.equal(await art.locator('body').evaluate(e=>getComputedStyle(e).fontSize),fontBefore,'Tree zoom preserves font size');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
   await page.screenshot({path:`/tmp/word-trees/${id}-${width}x${height}-zoom.png`});await page.locator('#treeClose').click();
  }
 }
 await page.evaluate(()=>{const p=JSON.parse(localStorage.getItem('fuehlmemory-profiles-v1'));p.activeId='ben';localStorage.setItem('fuehlmemory-profiles-v1',JSON.stringify(p));});await page.reload();assert.equal(await page.locator('#treeResume').isDisabled(),true);
 await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width:393,height:780});
 for(const id of ['herbst','mond','rosa','zauber']){
  await page.evaluate(id=>WordTrees.finish({id:'animation-'+id,tree:id},()=>{}),id);
  await page.locator('#treeWant').click();await page.locator('#treeClose:enabled').waitFor();
  const art=page.frameLocator('.tree-dialog iframe');assert.equal(await art.locator(id==='zauber'?'.reward.shown':'.item.visible').count(),1);
  assert.equal(await page.evaluate(()=>WordTrees.pending()),null);
  await page.locator('#treeClose').click();
 }
 console.log('PASS original arrival animations with normal motion in all four trees');
 await page.locator('[data-mode="2"]').click();assert.equal(await page.locator('#treeChoice').isVisible(),false);assert.deepEqual(errors,[]);
 console.log('PASS four complete trees in four screen formats, both zooms, profile separation and duo exclusion');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
