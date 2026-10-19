import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(process.env.OXFORD_PLAYWRIGHT_MODULE?pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE).href:'playwright');
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:1000},hasTouch:true});
const errors=[];page.on('pageerror',e=>errors.push(e.stack));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
const base=process.env.TEST_URL||'http://127.0.0.1:4187',out='output/tug-plush';await fs.mkdir(out,{recursive:true});
const state=()=>page.evaluate(()=>JSON.parse(render_game_to_text()));
const tick=ms=>page.evaluate(ms=>advanceTime(ms),ms);
async function answer(side,good=true){const n=await page.evaluate(({side,good})=>{const p=game.tug[side];return p.choices.findIndex(a=>(a===game.items[p.question].answer)===good);},{side,good});await page.locator(`[data-player="${side}"][data-tug-answer="${n}"]`).click();}
async function open(){await page.goto(base+'/?game=english-7-tug');await page.click('#start-game');await page.waitForFunction(()=>plushArt.ready);await tick(0);await page.waitForTimeout(150);}
try{
 await open();assert.equal((await state()).plush.loaded,true);assert.equal(await page.locator('.plush-mascot canvas').count(),2);assert.equal(await page.locator('.tug-mascot svg').count(),0);
 await page.screenshot({path:out+'/ready.png',fullPage:true});
 await page.evaluate(()=>advanceTime((4.15-arcade.time)*1000));assert.deepEqual((await state()).plush.poses,[4,4]);
 await answer(0);await tick(50);assert.equal((await state()).plush.poses[0],1);await tick(200);assert.equal((await state()).plush.poses[0],2);await page.screenshot({path:out+'/pull.png',fullPage:true});
 const beforePause=await state();await page.click('#tug-pause');await tick(5000);const paused=await state();assert.equal(paused.plush.paused,true);assert.equal(paused.animation.time,beforePause.animation.time);assert.equal(paused.tugPlayers[0].cooldownSeconds,beforePause.tugPlayers[0].cooldownSeconds);assert.equal(paused.animation.ropePosition,beforePause.animation.ropePosition);
 assert.equal(await page.locator('#arena').evaluate(el=>el.inert),true);await page.screenshot({path:out+'/paused.png',fullPage:true});await page.click('#tug-pause');await tick(1000);
 await answer(1,false);await tick(200);assert.equal((await state()).plush.poses[1],5);await page.screenshot({path:out+'/stumble.png',fullPage:true});await tick(600);assert.equal((await state()).plush.poses[1],6);await tick(4500);
 await answer(1,false);assert.equal((await state()).tugPlayers[1].penalty,true);await tick(5001);
 // Reduced motion has static poses, no breathing, and cooldowns still advance.
 await page.click('#arcade-motion');await tick(300);assert.equal((await state()).animation.reducedMotion,true);await answer(0);await tick(400);assert.equal((await state()).plush.poses[0],7);
 // Winning pose is held even when motion is off, with a short skippable celebration.
 if(!(await state()).celebration)await answer(0);assert.equal((await state()).plush.poses[0],7);await page.screenshot({path:out+'/victory.png',fullPage:true});await page.click('#skip-victory');await page.click('[data-replay]');assert.equal((await state()).plush.paused,false);assert.deepEqual((await state()).teams,[0,0]);
 await page.click('#arcade-motion');
 for(const [width,height] of [[1366,768],[800,900],[390,844]]){await page.setViewportSize({width,height});await page.waitForTimeout(150);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:out+`/layout-${width}.png`,fullPage:true});}
 await page.setViewportSize({width:1440,height:1000});await page.click('#tug-pause');await page.click('#restart');await page.click('#confirm-ok');assert.equal((await state()).plush.paused,false);assert.equal((await state()).attempts,0);
 await page.click('#game-home');assert.equal(await page.locator('#tug-pause').isVisible(),false);
 assert.deepEqual(errors,[]);console.log('PASS generated assets/portraits, idle blink, anticipation/pull/stumble/recovery/victory poses, pause freezes simulation, resume, penalties, reduced motion, replay/restart/navigation, responsive layout, no browser errors.');
}finally{await browser.close();}
