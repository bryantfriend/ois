import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL('C:/Users/fangb_kyiapn1/.codex/skills/develop-web-game/node_modules/playwright/index.mjs').href);
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1366,height:768}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const state=()=>page.evaluate(()=>JSON.parse(render_game_to_text()));const tick=ms=>page.evaluate(ms=>advanceTime(ms),ms);
const tap=async(x,y)=>{const p=await page.evaluate(([x,y])=>factoryTilePoint(x,y),[x,y]);await page.mouse.click(p.x,p.y);};
try{
 await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;localStorage.setItem('ois-factory-maths-v1',JSON.stringify({version:1,active:'team-1',teams:[{id:'team-1',name:'Team 1',spent:0,upgrades:[],drafts:{},stars:{1:[true,true,true]}}]}));});
 await page.goto('http://127.0.0.1:4174/factory-maths.html');await page.locator('[data-level="1"]').click();await page.locator('#prediction').fill('24');await page.locator('[data-predict]').click();await tap(2,3);await page.locator('#run').click();await tick(1000);
 await page.locator('[data-tool="belt"]').click();await tap(8,7);assert.equal((await state()).running,true);await tick(1000);const originalProduced=(await state()).cells.find(c=>c.type==='extractor').queue.length;
 await tap(8,7);await page.locator('#rotate-selected').click();assert.equal((await state()).running,true);assert.equal((await state()).cells.find(c=>c.x===8&&c.y===7).direction,1);
 await page.locator('#delete-selected').click();assert.equal((await state()).running,true);await tick(5000);const production=(await state()).cells.find(c=>c.type==='extractor').queue.length;assert.ok(production>originalProduced);
 await page.locator('#undo').click();assert.equal((await state()).running,true);assert.equal((await state()).cells.find(c=>c.type==='extractor').queue.length,production,'Undo preserves unrelated machine progress');
 await page.locator('[data-tool="select"]').click();await tap(8,7);await page.locator('#delete-multiple').click();assert.equal((await state()).running,true);
 await page.locator('#shop').click();const before=(await state()).time;await tick(1000);assert.ok((await state()).time>before,'Factory runs in shop');await page.locator('[data-buy="motor"]').click();assert.equal((await state()).running,true);assert.deepEqual((await state()).upgrades,['motor']);await tick(1000);assert.ok((await state()).time>before+1);
 await fs.mkdir('output/factory-live-edit',{recursive:true});await page.screenshot({path:'output/factory-live-edit/shop-running.png',fullPage:true});await page.locator('[data-close]').click();assert.equal((await state()).running,true);
 await page.locator('#run').click();await page.locator('[data-tool="belt"]').click();await tap(9,7);assert.equal((await state()).running,false,'Editing a paused factory stays paused');assert.deepEqual(errors,[]);console.log('Live editing QA passed: build, rotate, single/group deletion, undo preserve run state; unrelated production continues; shop and purchase run live; paused edits stay paused.');
}finally{await browser.close();}
