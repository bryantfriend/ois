import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL('C:/Users/fangb_kyiapn1/.codex/skills/develop-web-game/node_modules/playwright/index.mjs').href);
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1920,height:1080}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const state=()=>page.evaluate(()=>JSON.parse(render_game_to_text()));const advance=ms=>page.evaluate(ms=>advanceTime(ms),ms);
async function place(tool,x,y,dir=0){await page.locator(`[data-tool="${tool}"]`).click();let s=await state();while(s.direction!==dir){await page.locator('#rotate').click();s=await state();}const p=await page.evaluate(([x,y])=>factoryTilePoint(x,y),[x,y]);await page.mouse.click(p.x,p.y);}
try{
 await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
 await fs.mkdir('output/factory-animation',{recursive:true});await page.goto('http://127.0.0.1:4174/factory-maths.html');await page.locator('[data-level="1"]').click();await page.locator('#prediction').fill('24');await page.locator('[data-predict]').click();await place('extractor',2,3);await place('plank',7,3);
 for(const [x,y,d]of [[3,3,0],[4,3,0],[5,3,0],[6,3,0],[8,3,0],[9,3,1],[9,4,0],[10,4,0],[11,4,0],[12,4,1],[12,5,0]])await place('belt',x,y,d);
 await page.locator('#zoom-in').click();await page.locator('#run').click();await advance(5000);let s=await state();const factory=s.cells.find(c=>c.type==='plank');assert.ok(factory.crafting);assert.ok(factory.productionProgress>0&&factory.productionProgress<1);assert.ok(!s.movingItems.some(i=>i.item==='plank'),'Unfinished product stays inside factory');await page.screenshot({path:'output/factory-animation/crafting-ring.png',fullPage:true});
 // Compare individual item identities frame by frame, including straight/curved tile handoffs.
 let prev=new Map(s.movingItems.map(i=>[i.id,i])),handoffs=0,curves=0,peakStep=0;
 for(let frame=0;frame<650;frame++){await advance(1000/60);s=await state();for(const i of s.movingItems){const last=prev.get(i.id);if(last){const distance=Math.hypot(i.x-last.x,i.y-last.y);peakStep=Math.max(peakStep,distance);assert.ok(distance<.16,`Item ${i.id} teleported ${distance} grid units`);if(last.tile.join(',')!==i.tile.join(','))handoffs++;if(i.tile.join(',')==='9,3'&&i.progress>0&&i.progress<1)curves++;}}prev=new Map(s.movingItems.map(i=>[i.id,i]));if(frame===180)await page.screenshot({path:'output/factory-animation/log-detail.png',fullPage:true});if(frame===260)await page.screenshot({path:'output/factory-animation/logs-and-planks.png',fullPage:true});}
 assert.ok(handoffs>10);assert.ok(curves>0);assert.ok(s.movingItems.some(i=>i.item==='wood')||s.delivered[0]>0);
 await page.locator('#run').click();const before=await state();await advance(5000);const after=await state();assert.equal(after.time,before.time);assert.deepEqual(after.movingItems,before.movingItems);assert.equal(after.cells.find(c=>c.type==='plank').productionProgress,before.cells.find(c=>c.type==='plank').productionProgress);await page.screenshot({path:'output/factory-animation/paused.png',fullPage:true});
 assert.deepEqual(errors,[]);console.log(`Animation QA passed: real craft progress, hidden unfinished items, ${handoffs} continuous transfers, curved travel, max frame displacement ${peakStep.toFixed(3)}, pause freezes production and items.`);
}finally{await browser.close();}
