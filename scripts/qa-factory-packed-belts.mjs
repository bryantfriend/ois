import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL('C:/Users/fangb_kyiapn1/.codex/skills/develop-web-game/node_modules/playwright/index.mjs').href);
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1366,height:768}});const errors=[];page.on('pageerror',e=>errors.push(e.message));const state=()=>page.evaluate(()=>JSON.parse(render_game_to_text()));
async function place(x,y,dir=0){while((await state()).direction!==dir)await page.locator('#rotate').click();const p=await page.evaluate(([x,y])=>factoryTilePoint(x,y),[x,y]);await page.mouse.click(p.x,p.y);}
try{
 await page.addInitScript(()=>{requestAnimationFrame=()=>0;});await page.goto('http://127.0.0.1:4174/factory-maths.html');
 // Stress only the supply: real UI/simulation, with enough wood to fully pack a 120/min belt.
 await page.evaluate(()=>{const l=FACTORY_DATA.levels[0];l.sources[0][3]=600;l.target='wood';l.count=10000;});await page.locator('[data-level="1"]').click();await page.locator('#prediction').fill('24');await page.locator('[data-predict]').click();await place(2,3);await page.locator('[data-tool="belt"]').click();for(let x=3;x<=11;x++)await place(x,3);await place(12,3,1);await place(12,4,1);await place(12,5,0);await page.locator('#run').click();
 await page.evaluate(()=>advanceTime(20000));let s=await state(),previous=new Map(s.movingItems.map(i=>[i.id,i])),stops=0,tracked=0,handoffs=0;const initial=s.delivered[0];
 for(let f=0;f<360;f++){await page.evaluate(()=>advanceTime(1000/60));s=await state();for(const i of s.movingItems){const last=previous.get(i.id);if(last&&i.tile[1]===3&&i.tile[0]>=5&&i.tile[0]<=10){const distance=Math.hypot(i.x-last.x,i.y-last.y);assert.ok(distance<.04,'No position jumps');if(distance<1e-7)stops++;tracked++;if(last.tile[0]!==i.tile[0])handoffs++;}}previous=new Map(s.movingItems.map(i=>[i.id,i]));}
 assert.ok(tracked>1000);assert.ok(handoffs>20);assert.equal(stops,0,'Packed items move continuously through clear straight tiles');assert.ok(s.delivered[0]-initial>=11&&s.delivered[0]-initial<=13,'120/min capacity is preserved');
 await fs.mkdir('output/factory-packed-belts',{recursive:true});await page.screenshot({path:'output/factory-packed-belts/dense-flow.png',fullPage:true});assert.deepEqual(errors,[]);console.log(`Packed belt QA passed: ${tracked} moving item frames, ${handoffs} smooth tile transfers, zero artificial stops, ${s.delivered[0]-initial} items in six seconds at 120/min.`);
}finally{await browser.close();}
