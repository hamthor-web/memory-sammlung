const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=process.env.TEST_BASE||'http://127.0.0.1:8765/';
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/chromium',args:['--no-sandbox']});try{
 const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block',reducedMotion:'reduce'});await context.addInitScript(()=>localStorage.setItem('fuehlmemory-profiles-v1',JSON.stringify({activeId:'anna',profiles:[{id:'anna',name:'Anna',level:1,count:6}]})));
 const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/verrueckt-gesucht/index.html',route=>route.fulfill({contentType:'text/html',body:fs.readFileSync(path.join(__dirname,'fixtures/verrueckt-before-gallery.html'),'utf8')}));
 await page.goto(base+'verrueckt-gesucht/index.html');
 console.log('MIXED VERSION ERRORS',errors);
 assert.deepEqual(errors,[],'cached pre-gallery HTML must start with the new game script');
 assert.equal(await page.locator('#startError').isVisible(),false);await page.locator('#start').click();assert.equal(await page.locator('#board .answer').count(),6);
 await page.locator('#playBack').click();await page.locator('#openGallery').click();assert.equal(await page.locator('#gallery').isVisible(),true);
 await page.evaluate(()=>{for(let i=0;i<2;i++)CollectionSession.completeReward('pfau',{runId:'cached-'+i,progress:10,date:new Date().toISOString(),model:{id:'pfau',round:PeacockReward.plan(PFAU_ART),pictureClass:'reward-picture pfau-picture'}});rewardHistory=loadRewards();renderGallery();});
 await page.locator('.gallery-tile[data-story="pfau"]').click();assert.equal(await page.locator('.gallery-version').count(),2);await page.locator('.gallery-version').first().click();await page.locator('#galleryVersionsBack').click();assert.equal(await page.locator('#galleryVersionsDialog').isVisible(),true);
 await page.locator('#galleryVersionsClose').click();await page.unroute('**/verrueckt-gesucht/index.html');await page.reload();assert.equal(await page.locator('#galleryVersionsDialog').count(),1);assert.equal(await page.locator('#galleryVersionsBack').count(),1);assert.deepEqual(errors,[]);console.log('PASS cached old HTML plus new script starts without reload, version selection works, fresh HTML has no duplicate controls');
}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
