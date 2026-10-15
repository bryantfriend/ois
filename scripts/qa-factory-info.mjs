import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL('C:/Users/fangb_kyiapn1/.codex/skills/develop-web-game/node_modules/playwright/index.mjs').href);
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1366,height:768},hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const state=()=>page.evaluate(()=>JSON.parse(render_game_to_text()));
const tap=async(x,y)=>{const p=await page.evaluate(([x,y])=>factoryTilePoint(x,y),[x,y]);await page.touchscreen.tap(p.x,p.y);};
try{
 await page.goto('http://127.0.0.1:4174/factory-maths.html');await page.locator('[data-level="1"]').click();await page.locator('#prediction').fill('24');await page.locator('[data-predict]').click();
 await tap(2,3);await page.locator('[data-tool="belt"]').click();await tap(3,3);await page.locator('[data-tool="plank"]').click();await tap(4,3);
 await page.locator('#run').click();await page.evaluate(()=>advanceTime(1000));await tap(4,3);await page.locator('#selection-info').tap();
 assert.match(await page.locator('#modal-content').innerText(),/Plank workshop/);assert.match(await page.locator('#modal-content').innerText(),/12 wood \/ min/);assert.match(await page.locator('#modal-content').innerText(),/5.00 seconds/);
 const before=await state();await page.evaluate(()=>advanceTime(5000));assert.equal((await state()).time,before.time);assert.equal(before.running,false);
 await fs.mkdir('output/factory-info',{recursive:true});await page.screenshot({path:'output/factory-info/workshop.png',fullPage:true});await page.locator('[data-close]').click();await page.waitForFunction(()=>JSON.parse(render_game_to_text()).running);assert.equal((await state()).running,true);
 await page.locator('#run').click();
 for(const [x,y,title]of [[2,3,'Wood extractor'],[3,3,'Conveyor belt'],[13,5,'Delivery dock']]){await page.locator('#deselect').click();await tap(x,y);await page.locator('#selection-info').tap();assert.equal(await page.locator('#modal-content h2').innerText(),title);await page.locator('[data-close]').click();assert.equal((await state()).running,false);}
 assert.equal(await page.locator('#delete-selected').isVisible(),false);assert.equal(await page.locator('#rotate-selected').isVisible(),false);
 await page.screenshot({path:'output/factory-info/dock-info-button.png',fullPage:true});assert.deepEqual(errors,[]);console.log('Info QA passed: touchscreen stats for workshop, extractor, belt and dock; recipe rates and timing; pause/resume preserves simulation; fixed dock controls protected.');
}finally{await browser.close();}
