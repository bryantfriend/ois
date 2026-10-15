import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from 'file:///C:/Users/fangb_kyiapn1/.codex/skills/develop-web-game/node_modules/playwright/index.mjs';
const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1366,height:768},hasTouch:true}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4174';
await fs.mkdir('output/cell/types',{recursive:true});
async function pick(type,level){await page.locator(`[data-mode-action="act-cell-pick-type"][data-cell-type="${type}"]`).tap();assert.equal(await page.evaluate(()=>game.session.cellSetupStep),'difficulty');await page.locator(`[data-mode-action="act-cell-begin"][data-level="${level}"]`).tap();}
async function open(id,type,level){await page.goto(base+'/?game='+id);await page.locator('#start-game').click();assert.equal(await page.evaluate(()=>game.session.phase),'cell-setup');assert.equal(await page.locator('.act-cell-type-card').count(),2);await pick(type,level);}
try{
 for(const grade of [7,8])for(const type of ['animal','plant'])for(const [level,count] of [['easy',6],['medium',9],['hard',12]]){
  await open('biology-'+grade+'-diagram',type,level);
  assert.equal(await page.locator('#play-title').textContent(),'Cell Structures');assert.equal(await page.evaluate(()=>game.items.length),count);assert.equal(await page.evaluate(()=>game.session.cellType),type);
  assert.ok(await page.evaluate(()=>game.items.every(q=>q.explanation.match(/[^.!?]+[.!?]/g).length===3)));
  if(type==='plant')assert.ok(await page.evaluate(()=>!game.items.some(q=>['Lysosome','Centrioles','Vacuole'].includes(q.answer))));
  for(const size of [{width:1366,height:768},{width:1920,height:1080},{width:768,height:1024},{width:390,height:844}]){
   await page.setViewportSize(size);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   const markers=await page.locator('#arena button.act-marker').evaluateAll(nodes=>nodes.map(el=>{const r=el.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,r:r.width/2};}));
   assert.equal(markers.length,count);for(let i=0;i<count;i++)for(let j=i+1;j<count;j++)assert.ok(Math.hypot(markers[i].x-markers[j].x,markers[i].y-markers[j].y)>markers[i].r+markers[j].r-2,`${type} ${level} markers ${i+1}/${j+1} separated at ${size.width}`);
   if(size.width>=1000)assert.ok(await page.locator('[data-mode-action="act-cell-motion"]').evaluate(el=>el.getBoundingClientRect().bottom<innerHeight));
   if(grade===7)await page.screenshot({path:`output/cell/types/${type}-${level}-${size.width}.png`,fullPage:size.width<1000});
  }
  await page.setViewportSize({width:1366,height:768});
  for(let i=0;i<count;i++){
   const correct=i%2===0;await page.locator(`[data-mode-action="act-diagram"][data-value="${correct?i:(i+1)%count}"]`).click();
   const card=page.locator('.act-cell-discovery');await card.locator('img').evaluate(img=>img.decode());assert.equal(await card.locator('h3').textContent(),await page.evaluate(()=>current().answer));assert.equal((await card.locator('p').textContent()).match(/[^.!?]+[.!?]/g).length,3);
   assert.equal(await card.locator('img').evaluate(img=>img.naturalWidth),768);assert.equal((await card.locator('img').getAttribute('src')).includes('/plant/'),type==='plant');assert.equal(await page.evaluate(()=>game.feedbackGood),correct);
   if(grade===7&&type==='plant'&&level==='hard')await page.screenshot({path:`output/cell/types/plant-feedback-${i}.png`});
   await page.locator('[data-mode-action="act-next"]').tap();
  }
  assert.ok(await page.evaluate(()=>game.done));assert.equal(await page.evaluate(()=>game.correct),Math.ceil(count/2));console.log('PASS grade '+grade+' '+type+' '+level+': '+count+' labels, four sizes, all feedback images and completion');
 }
 await open('biology-7-diagram','plant','hard');
 const cargo=page.locator('#arena .act-cell-cargo').first();const pos=()=>cargo.evaluate(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y};});const p=await pos();await page.waitForTimeout(850);assert.notDeepEqual(await pos(),p);
 await page.locator('[data-mode-action="act-cell-motion"]').click();const paused=await pos();await page.waitForTimeout(500);assert.deepEqual(await pos(),paused);await page.locator('[data-mode-action="act-cell-motion"]').click();
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await cargo.evaluate(el=>getComputedStyle(el).animationName),'none');await page.emulateMedia({reducedMotion:'no-preference'});
 await page.locator('[data-mode-action="act-diagram"][data-value="0"]').click();await page.locator('[data-mode-action="act-next"]').click();
 await page.locator('[data-mode-action="act-cell-setup"]').click();await page.locator('[data-cell-type="animal"]').click();await page.locator('[data-mode-action="act-cell-setup-cancel"]').click();assert.equal(await page.evaluate(()=>game.session.cellType),'plant');assert.equal(await page.evaluate(()=>game.correct),1);
 await page.locator('[data-mode-action="act-cell-setup"]').click();await pick('animal','medium');assert.equal(await page.evaluate(()=>game.items.length),9);assert.equal(await page.evaluate(()=>game.correct),0);assert.equal(await page.locator('#arena .act-plant-art').count(),0);
 await page.locator('[data-mode-action="act-cell-setup"]').click();await pick('plant','easy');assert.equal(await page.evaluate(()=>game.items.length),6);assert.equal(await page.evaluate(()=>game.items[0].answer),'Cell wall');
 assert.deepEqual(errors,[]);console.log('PASS native touch choice, cell switch/reset, cancel preserves progress, plant transport/pause and reduced motion; no page errors');
}finally{await browser.close();}
