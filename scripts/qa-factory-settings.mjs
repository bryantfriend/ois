import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL('C:/Users/fangb_kyiapn1/.codex/skills/develop-web-game/node_modules/playwright/index.mjs').href);
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1366,height:768},hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const state=()=>page.evaluate(()=>JSON.parse(render_game_to_text()));
try{
 await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});await fs.mkdir('output/factory-settings',{recursive:true});
 await page.goto('http://127.0.0.1:4174/factory-maths.html');await page.locator('[data-level="1"]').click();await page.locator('#prediction').fill('24');await page.locator('[data-predict]').click();
 await page.locator('[data-tool="belt"]').click();for(let x=3;x<8;x++){const p=await page.evaluate(x=>factoryTilePoint(x,3),x);await page.touchscreen.tap(p.x,p.y);}
 await page.screenshot({path:'output/factory-settings/arrows-on.png',fullPage:true});const on=await page.locator('canvas').screenshot();await page.locator('#run').click();const before=await state();
 await page.locator('#settings').tap();assert.equal(await page.locator('#conveyor-arrows').isChecked(),true);await page.locator('#conveyor-arrows').tap();await page.screenshot({path:'output/factory-settings/menu.png',fullPage:true});await page.evaluate(()=>advanceTime(2000));assert.equal((await state()).time,before.time);
 await page.locator('[data-close]').click();await page.waitForFunction(()=>JSON.parse(render_game_to_text()).running);assert.equal((await state()).settings.conveyorArrows,false);assert.equal((await state()).budget,before.budget);
 await page.screenshot({path:'output/factory-settings/arrows-off.png',fullPage:true});assert.notDeepEqual(await page.locator('canvas').screenshot(),on);
 await page.reload();await page.locator('[data-level="1"]').click();await page.locator('[data-predict]').click();assert.equal((await state()).settings.conveyorArrows,false);
 await page.locator('#settings').tap();await page.locator('#conveyor-arrows').tap();await page.locator('[data-close]').click();assert.equal((await state()).settings.conveyorArrows,true);assert.equal((await state()).running,false);assert.deepEqual(errors,[]);
 console.log('Settings QA passed: native touch toggle, changed conveyor graphics, saved preference across reload, frozen menu time, running/paused state and budget preserved.');
}finally{await browser.close();}
