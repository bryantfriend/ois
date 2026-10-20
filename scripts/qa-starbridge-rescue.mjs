import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE).href);
const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];
page.on('pageerror',e=>errors.push(e.stack));
const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4196',out='output/starbridge-rescue';
const data=()=>page.evaluate(()=>JSON.parse(render_game_to_text()));
const tick=ms=>page.evaluate(ms=>advanceTime(ms),ms);
async function start(){await page.evaluate(async()=>{openEditor(GAMES.find(g=>g.id==='math-7-quiz'));await startGame();arcade.manual=true;});await page.waitForTimeout(150);}
async function answer(correct){const n=await page.evaluate(correct=>game.choices.findIndex(choice=>(choice===current().answer)===correct),correct);await page.locator('[data-answer="'+n+'"]').click();}
async function dimensions(){return page.locator('#game-canvas').evaluate(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};});}
try{
 await fs.mkdir(out,{recursive:true});await page.goto(base);
 assert.equal(await page.evaluate(()=>GAMES.find(g=>g.id==='math-7-quiz').title),'Starbridge Rescue');await start();
 assert.equal(await page.evaluate(()=>validateLesson({...game.lesson,id:'saved-rescue-copy'}).settings.starbridgeRescue),true);
 assert.match(await page.locator('.starbridge-briefing').innerText(),/stranded crew/i);
 const initial=await dimensions();await page.screenshot({path:out+'/ready.png',fullPage:true});
 await answer(true);assert.equal((await data()).starbridge.phase,'rescue');assert.equal((await data()).starbridge.aboard,0);assert.equal(await page.locator('[data-next]').isDisabled(),true);
 await tick(750);assert.deepEqual(await dimensions(),initial);assert.deepEqual((await data()).starbridge.ship,{x:300,y:158,width:144,height:76,scale:1});await page.screenshot({path:out+'/tractor-beam.png',fullPage:true});
 await tick(900);assert.equal((await data()).starbridge.aboard,1);assert.equal(await page.locator('[data-next]').isDisabled(),true);await page.screenshot({path:out+'/crew-secured.png',fullPage:true});await tick(600);assert.equal(await page.locator('[data-next]').isDisabled(),false);
 await page.locator('[data-next]').click();await page.waitForTimeout(80);assert.deepEqual(await dimensions(),initial);
 await answer(false);await tick(240);assert.equal((await data()).starbridge.phase,'impact');assert.equal((await data()).starbridge.rescued,1);assert.deepEqual(await dimensions(),initial);await page.screenshot({path:out+'/shield-impact.png',fullPage:true});
 await page.locator('#starbridge-pause').click();const paused=(await data()).starbridge;await tick(3000);assert.equal((await data()).starbridge.animationSeconds,paused.animationSeconds);assert.equal(await page.locator('#arena').evaluate(el=>el.inert),true);await page.screenshot({path:out+'/paused.png',fullPage:true});await page.locator('#starbridge-pause').click();await tick(1500);assert.equal(await page.locator('[data-next]').isDisabled(),false);
 await page.locator('[data-next]').click();for(let i=2;i<6;i++){await answer(true);await tick(2300);assert.deepEqual(await dimensions(),initial);await page.locator('[data-next]').click();}
 assert.equal((await data()).starbridge.rescued,5);assert.match(await page.locator('.victory-caption').innerText(),/5 \/ 6 crew pods/);await page.locator('#skip-victory').click();assert.match(await page.locator('.starbridge-report').innerText(),/5 \/ 6.*1 rescue beacon/s);await page.screenshot({path:out+'/partial-report.png',fullPage:true});
 await page.locator('[data-replay]').click();await page.waitForFunction(()=>game.index===0&&!game.done);assert.equal((await data()).starbridge.rescued,0);
 // Gentle motion gives an immediate, readable outcome with no animation wait.
 await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>{arcade.reduced=true;});await answer(true);assert.equal((await data()).starbridge.aboard,1);assert.equal(await page.locator('[data-next]').isDisabled(),false);
 await start();await page.evaluate(()=>arcade.reduced=true);for(let i=0;i<6;i++){await answer(true);await page.locator('[data-next]').click();}await page.locator('#skip-victory').click();assert.match(await page.locator('.starbridge-report').innerText(),/Every crew is safe/);await page.screenshot({path:out+'/perfect-report.png',fullPage:true});
 for(const size of [{width:1920,height:1080},{width:390,height:844}]){await page.setViewportSize(size);await start();const before=await dimensions();await answer(true);await page.waitForTimeout(80);const after=await dimensions();assert.equal(after.width,before.width);assert.equal(after.height,before.height);await page.screenshot({path:out+'/layout-'+size.width+'.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 // This lesson's presentation must not alter another quiz.
 await page.evaluate(async()=>{openEditor(GAMES.find(g=>g.id==='math-8-quiz'));await startGame();});assert.equal(await page.locator('#player').evaluate(el=>el.classList.contains('starbridge-rescue')),false);assert.equal(await page.locator('#starbridge-pause').isVisible(),false);
 assert.deepEqual(errors,[]);console.log('PASS: renamed mission, fixed canvas/hull across answers, tractor recovery, shield impact, animation input gate, pause, partial/perfect rescue reports, replay, reduced motion, desktop/mobile and unrelated quiz isolation.');
}finally{await browser.close();}
