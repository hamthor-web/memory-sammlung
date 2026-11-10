const {chromium}=require('playwright'),assert=require('node:assert/strict');
const base=process.env.TEST_BASE||'http://127.0.0.1:8765/';
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/chromium',args:['--no-sandbox']});try{
 const ctx=await browser.newContext({viewport:{width:393,height:700},serviceWorkers:'block'});await ctx.addInitScript(()=>{localStorage.setItem('fuehlmemory-profiles-v1',JSON.stringify({profiles:[{id:'zoom-child',name:'Bildtest',level:1,count:6}],activeId:'zoom-child'}));localStorage.setItem('memory-progress-v1:zoom-child',JSON.stringify({synonymSuccess:{version:1,selected:'house',strategy:'choose',house:{version:1,count:5,roundIds:['1','2','3','4','5'],introduced:true}}}));});
 const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const integrated of [false,true]){
 await page.goto(base+(integrated?'synonymmemory/index.html':'synonymmemory/fairy-house/index.html'));if(integrated)await page.locator('#syn-view-house').click();const frame=integrated?page.frameLocator('#syn-house-frame'):page;
 await frame.locator('#window5').click();await frame.getByRole('button',{name:'Pause',exact:true}).click();
 for(const viewport of [{width:393,height:700},{width:852,height:393},{width:768,height:1024},{width:1024,height:768},{width:320,height:568},{width:360,height:640}]){
  await page.setViewportSize(viewport);
  for(const font of [100,160]){await frame.locator('#fontZoom').evaluate((e,v)=>{e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}))},font);
  for(const zoom of [50,100,200]){const caption=await frame.locator('#caption').evaluate(e=>getComputedStyle(e).fontSize);await frame.locator('#storyZoom').evaluate((e,v)=>{e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}))},zoom);await page.waitForTimeout(80);assert.equal(await frame.locator('#caption').evaluate(e=>getComputedStyle(e).fontSize),caption,'picture zoom preserves text size');
   const bounds=await frame.locator('#story').evaluate(e=>({width:innerWidth,height:innerHeight,buttons:[...e.querySelectorAll('button')].filter(b=>b.getClientRects().length).map(b=>({id:b.id,x:b.getBoundingClientRect().x,y:b.getBoundingClientRect().y,right:b.getBoundingClientRect().right,bottom:b.getBoundingClientRect().bottom}))}));
   for(const b of bounds.buttons)assert(b.x>=-1&&b.y>=-1&&b.right<=bounds.width+1&&b.bottom<=bounds.height+1,JSON.stringify({integrated,viewport,font,zoom,b,bounds:{width:bounds.width,height:bounds.height}}));
   if(integrated)assert(await page.locator('#syn-house-frame').evaluate(e=>e.getBoundingClientRect().bottom<=innerHeight+1),'parent does not push controls below screen');
  }}
 }
 await frame.locator('#fontZoom').evaluate(e=>{e.value='100';e.dispatchEvent(new Event('input',{bubbles:true}))});await frame.locator('#storyZoom').press('Home');assert.equal(await frame.locator('#storyZoomOut').innerText(),'50 %');await frame.locator('#storySize').click();assert.equal(await frame.locator('#storyZoomOut').innerText(),'60 %');await frame.locator('#storySmaller').click();assert.equal(await frame.locator('#storyZoomOut').innerText(),'50 %');
 }
 assert.deepEqual(errors,[]);console.log('PASS six phone/tablet formats × two text sizes × three picture zooms, standalone and integrated; every story button fully inside viewport');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
