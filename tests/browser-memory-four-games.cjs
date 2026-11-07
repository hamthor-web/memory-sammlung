const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base='http://127.0.0.1:8765/';
const entries=['eigenschaften.html','wortmemory/test-zweispieler-2026-11-06.html','synonymmemory/index.html','verrueckt-gesucht/index.html'];
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']});
try{
for(const viewport of [{width:390,height:844},{width:844,height:390},{width:768,height:1024},{width:1024,height:768}]){
  const context=await browser.newContext({viewport,hasTouch:true,isMobile:viewport.width===390});
  const page=await context.newPage();
  await page.goto(base+'index.html?menu=1');
  if(await page.locator('#login').evaluate(e=>e.open)){
    await page.locator('#name').fill('Testkind');
    await page.locator('#newProfile button').click();
  }
  // Profile dialog exposes update and installation before a child profile exists.
  await page.goto(base+'index.html');
  await page.evaluate(()=>localStorage.removeItem('fuehlmemory-profiles-v1'));
  await page.reload();
  assert.equal(await page.locator('#login').evaluate(el=>el.open),true);
  assert.equal(await page.locator('#update').isVisible(),true);
  assert.equal(await page.locator('#install').isVisible(),true);
  assert.equal(await page.locator('#profiles button').count(),0);
  await page.locator('#update').click();
  await page.locator('#updateStatus').waitFor();
  assert.equal(await page.locator('#updateStatus').isVisible(),true);
  await page.locator('#name').fill('Testkind');
  await page.locator('#newProfile button').click();
  await page.goto(base+'index.html?menu=1');
  assert.equal(await page.locator('.games .game').count(),4);
  const dims=await page.locator('.games .game > .play').evaluateAll(els=>els.map(el=>({
   x:el.getBoundingClientRect().x,y:el.getBoundingClientRect().y,height:el.getBoundingClientRect().height,bottom:el.getBoundingClientRect().bottom,
   label:el.textContent.trim()
  })));
  assert(dims[3].height>=65,JSON.stringify({viewport,button:dims[3]}));
  const shield=await page.locator('.games .game-verrueckt .play-verrueckt').evaluate(el=>{
    const bg=getComputedStyle(el).backgroundImage;
    const width=el.getBoundingClientRect().width;
    return {bg,width,height:el.getBoundingClientRect().height};
  });
  assert(shield.bg.includes('los-gehts-verrueckt-menue.svg'),JSON.stringify(shield));
  assert(shield.height>=dims[2].height-8,'Shield is too small: '+JSON.stringify(shield));
  const svg=await (await page.request.get(base+'assets/buttons/los-gehts-verrueckt-menue.svg')).text();
  assert(svg.includes('preserveAspectRatio="none"'),'Menu SVG must stretch vertically');

  assert(dims[3].label.includes('Los geht'),JSON.stringify(dims[3]));
  assert(Math.abs(dims[2].bottom-dims[3].bottom)<=6,JSON.stringify({viewport,buttons:dims}));
  assert(Math.abs(dims[0].bottom-dims[1].bottom)<=6,JSON.stringify({viewport,buttons:dims}));
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  assert(overflow<=3,'Menu horizontal overflow '+overflow+' '+JSON.stringify(viewport));
  for(const href of entries){
    // Test the full common intro -> game -> Android/browser back route.
    await page.goto(base+'index.html?menu=1');
    const link=page.locator('.games a[href="'+href+'"]');
    await link.click();
    await page.locator('#introOverlay:not([hidden])').waitFor({timeout:8000});
    await page.locator('#introSkip').click();
    await page.waitForURL(url=>url.pathname.endsWith('/'+href),{timeout:10000});
    await page.goBack({waitUntil:'domcontentloaded'});
    await page.waitForURL(url=>url.pathname.endsWith('/index.html')&&url.searchParams.get('menu')==='1',{timeout:10000});
    // Back-forward cache must never resurrect the animation over the main menu.
    assert.equal(await page.locator('#introOverlay').isVisible(),false,
      'Stale intro overlay after browser back: '+href);
    assert.equal(await page.locator('.games .game').count(),4);

  }
  await page.goto(base+'verrueckt-gesucht/index.html');
  assert(await page.locator('#openGallery').isVisible());
  const order=await page.evaluate(()=>{
    const ids=['rewardChoice','size','start','openGallery'];
    return ids.map(id=>document.getElementById(id).compareDocumentPosition(document.getElementById('start')));
  });
  const relative=await page.evaluate(()=>{
   const ids=['rewardChoice','size','start','openGallery'];
   const nodes=ids.map(id=>document.getElementById(id));
   return nodes[0].compareDocumentPosition(nodes[1])&Node.DOCUMENT_POSITION_FOLLOWING &&
      nodes[1].compareDocumentPosition(nodes[2])&Node.DOCUMENT_POSITION_FOLLOWING &&
      nodes[2].compareDocumentPosition(nodes[3])&Node.DOCUMENT_POSITION_FOLLOWING;
  });
  assert(relative,'Selection/gallery order');
  assert.equal(await page.locator('#openGallery').textContent(),'Meine Fortschrittsbilder noch einmal ansehen');
  assert.equal(await page.locator('.install-panel').isVisible(),false);
  console.log('PASS viewport '+viewport.width+'x'+viewport.height+': 4 games, menu alignment, four intro transitions and back gestures.');
  await context.close();
}
}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
