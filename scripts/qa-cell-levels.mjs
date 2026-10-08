import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {chromium} from 'file:///C:/Users/fangb_kyiapn1/.codex/skills/develop-web-game/node_modules/playwright/index.mjs';
const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1366,height:768},hasTouch:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));const base='http://127.0.0.1:4174';await fs.mkdir('output/cell/levels',{recursive:true});
async function open(id,level){await page.goto(base+'/?game='+id);await page.locator('#start-game').click();await page.locator('[data-mode-action="act-cell-pick-type"][data-cell-type="animal"]').click();await page.locator(`[data-mode-action="act-cell-begin"][data-level="${level}"]`).click();}
try{
for(const id of ['biology-7-diagram','biology-8-diagram'])for(const [level,count] of [['easy',6],['medium',9],['hard',12]]){
 await open(id,level);assert.equal(await page.evaluate(()=>game.items.length),count);assert.equal(await page.locator('#arena button.act-marker').count(),count);assert.ok(await page.locator(`[data-level="${level}"]`).getAttribute('aria-pressed')==='true');
 for(const size of [{width:1366,height:768},{width:1920,height:1080},{width:768,height:1024},{width:390,height:844}]){
  await page.setViewportSize(size);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const markers=await page.locator('#arena button.act-marker').evaluateAll(nodes=>nodes.map(el=>{const r=el.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,r:r.width/2};}));
  for(let i=0;i<markers.length;i++)for(let j=i+1;j<markers.length;j++)assert.ok(Math.hypot(markers[i].x-markers[j].x,markers[i].y-markers[j].y)>markers[i].r+markers[j].r-2,`${level} markers ${i+1}/${j+1} don't overlap at ${size.width}`);
  if(size.width>=1000)assert.ok(await page.locator('[data-mode-action="act-cell-motion"]').evaluate(el=>el.getBoundingClientRect().bottom<innerHeight));
  await page.screenshot({path:`output/cell/levels/${id}-${level}-${size.width}.png`,fullPage:size.width<1000});
 }
 await page.setViewportSize({width:1366,height:768});
 for(let i=0;i<count;i++){
  const good=i%2===0;await page.locator(`[data-mode-action="act-diagram"][data-value="${good?i:(i+1)%count}"]`).click();
  const card=page.locator('.act-cell-discovery');await card.locator('img').evaluate(img=>img.decode());assert.equal(await card.locator('h3').textContent(),await page.evaluate(()=>current().answer));assert.equal((await card.locator('p').textContent()).match(/[^.!?]+[.!?]/g).length,3);assert.equal(await page.evaluate(()=>game.feedbackGood),good);
  assert.equal(await card.locator('img').evaluate(img=>img.naturalWidth),768);assert.ok((await card.getAttribute('class')).includes('act-cell-correction')===!good);
  if(id==='biology-7-diagram'&&level==='hard')await page.screenshot({path:`output/cell/levels/feedback-${i}-${good?'correct':'wrong'}.png`});
  await page.locator('[data-mode-action="act-next"]').click();
 }
 assert.ok(await page.evaluate(()=>game.done));assert.equal(await page.evaluate(()=>game.correct),Math.ceil(count/2));console.log('PASS '+id+' '+level+' '+count+' parts, four sizes, every illustration and correct/wrong teaching cards');
}
await open('biology-7-diagram','hard');
const cargo=page.locator('#arena .act-cell-cargo').first();const position=()=>cargo.evaluate(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,d:getComputedStyle(e).offsetDistance};});
const before=await position();await page.waitForTimeout(1100);const after=await position();assert.ok(Math.hypot(after.x-before.x,after.y-before.y)>8,'transport actually moves');
await page.locator('[data-mode-action="act-cell-motion"]').click();const paused=await position();await page.waitForTimeout(600);assert.deepEqual(await position(),paused);await page.locator('[data-mode-action="act-cell-motion"]').click();await page.waitForTimeout(600);assert.notDeepEqual(await position(),paused);
for(const cls of ['act-cell-atp','act-cell-protein','act-cell-digest'])assert.notEqual(await page.locator('#arena .'+cls).first().evaluate(e=>getComputedStyle(e).animationName),'none');
await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await cargo.evaluate(e=>getComputedStyle(e).animationName),'none');await page.emulateMedia({reducedMotion:'no-preference'});await page.evaluate(()=>document.body.classList.add('still-games'));assert.equal(await cargo.evaluate(e=>getComputedStyle(e).animationName),'none');await page.evaluate(()=>document.body.classList.remove('still-games'));
assert.ok(await page.evaluate(()=>{try{validateLesson({...game.lesson,settings:{...game.lesson.settings,cellDifficulty:'invalid'}});return false;}catch{return true;}}));
await page.locator('[data-level="easy"]').click();assert.equal(await page.evaluate(()=>game.items.length),6);assert.equal(await page.evaluate(()=>game.correct),0);assert.equal(await page.evaluate(()=>game.session.round),0);
await page.locator('[data-mode-action="act-diagram"][data-value="0"]').click();await page.locator('[data-mode-action="act-next"]').click();await page.locator('[data-level="medium"]').click();assert.equal(await page.evaluate(()=>game.items.length),9);assert.equal(await page.evaluate(()=>game.correct),0);
assert.deepEqual(errors,[]);console.log('PASS real cargo movement, stable pause/resume, all process animations, reduced/global motion off, validation and level reset');
}finally{await browser.close();}
