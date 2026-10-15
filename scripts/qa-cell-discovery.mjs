import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE||'C:/Users/fangb_kyiapn1/.codex/skills/develop-web-game/node_modules/playwright/index.mjs').href);
const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1366,height:768},hasTouch:true}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4174';
async function open(id){await page.goto(base+'/?game='+id);await page.locator('#start-game').click();await page.locator('[data-mode-action="act-cell-pick-type"][data-cell-type="animal"]').click();await page.locator('[data-mode-action="act-cell-begin"][data-level="easy"]').click();}
await fs.mkdir('output/cell/discovery',{recursive:true});
try{
 for(const id of ['biology-7-diagram','biology-8-diagram']){
  await open(id);
  assert.ok(await page.evaluate(()=>game.items.every(q=>q.explanation.match(/[^.!?]+[.!?]/g).length===3)));
  for(let i=0;i<6;i++){
   await page.locator(`[data-mode-action="act-diagram"][data-value="${i}"]`).click();
   const name=await page.evaluate(()=>current().answer),card=page.locator('.act-cell-discovery');
   await card.locator('img').evaluate(img=>img.decode());
   assert.equal(await card.locator('h3').textContent(),name);
   assert.equal(await card.locator('p').textContent(),await page.evaluate(()=>current().explanation));
   assert.equal((await card.locator('p').textContent()).match(/[^.!?]+[.!?]/g).length,3);
   assert.ok(await card.locator('img').evaluate(img=>img.naturalWidth>0));
   for(const size of [{width:1366,height:768},{width:1920,height:1080},{width:768,height:1024},{width:390,height:844}]){
    await page.setViewportSize(size);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow');
    assert.ok(await card.evaluate(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.left>=0&&r.right<=innerWidth;}));
    if(size.width>=1000)assert.ok(await page.locator('[data-mode-action="act-next"]').evaluate(el=>el.getBoundingClientRect().bottom<=innerHeight),'Next button visible on desktop');
    if(id==='biology-7-diagram')await page.screenshot({path:`output/cell/discovery/${i}-${size.width}.png`,fullPage:size.width<1000});
   }
   await page.waitForTimeout(100);
   assert.equal(await page.evaluate(()=>game.session.phase),'feedback');
   await page.locator('[data-mode-action="act-next"]').tap();
   await page.setViewportSize({width:1366,height:768});
  }
  assert.equal(await page.evaluate(()=>game.correct),6);assert.ok(await page.evaluate(()=>game.done));
  console.log('PASS '+id+' six loaded illustrations, three-sentence explanations, four sizes, touch Next and completion');
 }
 await open('biology-7-diagram');
 await page.locator('[data-mode-action="act-diagram"][data-value="1"]').click();
 assert.equal(await page.locator('.act-cell-discovery').count(),1);assert.ok(await page.locator('.act-cell-correction').isVisible());
 await open('biology-7-diagram');
 await page.evaluate(()=>{current().explanation='The boundary that controls what enters the cell';});
 await page.locator('[data-mode-action="act-diagram"][data-value="0"]').click();
 assert.equal((await page.locator('.act-cell-discovery p').textContent()).match(/[^.!?]+[.!?]/g).length,3);
 await open('biology-7-diagram');
 await page.evaluate(()=>{current().explanation='A teacher’s custom explanation.';});
 await page.locator('[data-mode-action="act-diagram"][data-value="0"]').click();
 assert.equal(await page.locator('.act-cell-discovery p').textContent(),'A teacher’s custom explanation.');
 await open('biology-7-diagram');
 await page.evaluate(()=>{game.lesson.settings.diagramImage='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a5ioAAAAASUVORK5CYII=';});
 await page.locator('[data-mode-action="act-diagram"][data-value="0"]').click();assert.equal(await page.locator('.act-cell-discovery').count(),0);
 assert.deepEqual(errors,[]);console.log('PASS wrong-answer feedback, legacy explanations, teacher overrides, custom diagrams and no page errors');
}finally{await browser.close();}
