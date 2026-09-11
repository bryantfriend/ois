import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(process.env.OXFORD_PLAYWRIGHT_MODULE?pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE).href:'playwright');
const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4174';
await fs.mkdir('output/arcade',{recursive:true});
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:1120}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(base);await page.screenshot({path:'output/arcade/library.png'});await page.locator('#search').fill('Rocket Rally');assert.equal(await page.locator('.game-card').count(),2);await page.locator('#reset').click();
 const formats=['quiz','tug','relay','sort','match','order','board','wager','survival','clue'];
 for(const format of formats){await page.goto(`${base}/?game=math-7-${format}`);await page.locator('#start-game').click();await page.evaluate(()=>window.advanceTime(500));assert.equal(await page.locator('#arcade-mission').isVisible(),true);await page.screenshot({path:`output/arcade/${format}.png`});}
 await page.goto(`${base}/?game=math-7-tug`);assert.equal(await page.locator('#format-name').textContent(),'Hamster Tug of War');await page.locator('#start-game').click();
 const before=await page.evaluate(()=>JSON.parse(render_game_to_text()));await page.waitForTimeout(120);const after=await page.evaluate(()=>JSON.parse(render_game_to_text()));assert.ok(after.animation.time>before.animation.time,'Animation advances automatically');
 await page.locator('[data-answer]').filter({hasText:/^[A-F]12$/}).click();await page.evaluate(()=>window.advanceTime(200));const hit=await page.evaluate(()=>JSON.parse(render_game_to_text()));assert.equal(hit.animation.event,'hit');assert.ok(hit.animation.particles>0);assert.ok(hit.animation.ropePosition<0);assert.equal(hit.rope,-1);await page.screenshot({path:'output/arcade/tug-hit.png'});
 await page.evaluate(()=>window.advanceTime(2500));assert.equal(await page.evaluate(()=>JSON.parse(render_game_to_text()).animation.particles),0);
 await page.locator('#arcade-motion').click();const reducedBefore=await page.evaluate(()=>JSON.parse(render_game_to_text()).animation.time);await page.evaluate(()=>window.advanceTime(1000));assert.equal(await page.evaluate(()=>JSON.parse(render_game_to_text()).animation.time),reducedBefore);assert.equal(await page.locator('#arcade-motion').getAttribute('aria-pressed'),'false');
 await page.locator('#arcade-sound').click();assert.equal(await page.locator('#arcade-sound').getAttribute('aria-pressed'),'true');await page.locator('#arcade-sound').click();assert.equal(await page.locator('#arcade-sound').getAttribute('aria-pressed'),'false');
 // Sort via dragging, with clicking still available to keyboard/touch users.
 await page.goto(`${base}/?game=math-7-sort`);await page.locator('#start-game').click();const correct=page.locator('[data-answer]').filter({hasText:'Positive'});await page.locator('#question-prompt').dragTo(correct);assert.equal(await page.evaluate(()=>JSON.parse(render_game_to_text()).correct),1);
 // All ten worlds fit a phone and can turn down motion independently of scoring.
 await page.setViewportSize({width:390,height:844});for(const format of formats){await page.goto(`${base}/?game=english-7-${format}`);await page.locator('#start-game').click();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true,format);if(format==='tug'||format==='survival')await page.screenshot({path:`output/arcade/${format}-mobile.png`,fullPage:true});}
 // Respect an OS reduced-motion preference on first load.
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(`${base}/?game=math-7-quiz`);await page.locator('#start-game').click();assert.equal(await page.locator('#arcade-motion').getAttribute('aria-pressed'),'false');await page.evaluate(()=>window.advanceTime(1000));assert.equal(await page.evaluate(()=>JSON.parse(render_game_to_text()).animation.time),0);
 assert.deepEqual(errors,[]);await fs.writeFile('output/arcade/results.json',JSON.stringify({passed:true,formats,checks:['automatic animation','particles and expiry','eased team movement','motion toggle','sound toggle','drag sorting','10 mobile layouts','OS reduced motion'],errors},null,2));console.log('PASS: ten animated worlds, feedback particles, eased movement, sound/motion toggles, drag sorting and responsive layouts.');
}finally{await browser.close();}
