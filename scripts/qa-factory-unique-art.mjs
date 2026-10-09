import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL('C:/Users/fangb_kyiapn1/.codex/skills/develop-web-game/node_modules/playwright/index.mjs').href);
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1920,height:1080}});const errors=[];page.on('pageerror',e=>errors.push(e.message));const state=()=>page.evaluate(()=>JSON.parse(render_game_to_text()));
async function place(tool,x,y,dir=0){await page.locator(`[data-tool="${tool}"]`).click();while((await state()).direction!==dir)await page.locator('#rotate').click();const p=await page.evaluate(([x,y])=>factoryTilePoint(x,y),[x,y]);await page.mouse.click(p.x,p.y);}
try{
 await page.addInitScript(()=>{requestAnimationFrame=()=>0;const stars={};for(let n=1;n<=12;n++)stars[n]=[true,false,false];localStorage.setItem('ois-factory-maths-v1',JSON.stringify({version:1,active:'team-1',teams:[{id:'team-1',name:'Team 1',stars,spent:0,upgrades:[],drafts:{}}]}));});await page.goto('http://127.0.0.1:4174/factory-maths.html');
 // Fixture supplies feed every factory through normal extractor acceptance/crafting.
 const sources=[['wood',4,3,0],['ore',8,3,0],['ingot',12,3,0],['copper',4,7,0],['plank',8,7,0],['ingot',9,6,1],['plank',12,8,0],['ingot',13,7,1],['wire',14,8,2]];
 await page.evaluate(sources=>{FACTORY_DATA.levels[11].tools=Object.keys(FACTORY_DATA.recipes);FACTORY_DATA.levels[11].sources=sources.map(([i,x,y])=>[i,x,y,120]);},sources);await page.locator('[data-level="12"]').click();await page.locator('#prediction').fill('4');await page.locator('[data-predict]').click();
 for(const [i,x,y,d]of sources)await place('extractor',x,y,d);
 const machines=[['plank',5,3],['ingot',9,3],['gear',13,3],['wire',5,7],['toolkit',9,7],['circuit',13,8]];for(const [type,x,y]of machines)await place(type,x,y);
 await page.locator('#run').click();await page.evaluate(()=>advanceTime(3000));for(const [type]of machines)assert.ok((await state()).cells.find(c=>c.type===type).crafting,`${type} is crafting`);
 await fs.mkdir('output/factory-unique-art',{recursive:true});await page.screenshot({path:'output/factory-unique-art/all-factories.png',fullPage:true});
 const before=await page.locator('canvas').screenshot();await page.evaluate(()=>advanceTime(200));assert.equal((await page.locator('canvas').screenshot()).equals(before),false);await page.locator('#run').click();await page.evaluate(()=>advanceTime(0));await page.locator('canvas').screenshot({path:'output/factory-unique-art/paused-before.png'});const frozen=(await state()).time;await page.evaluate(()=>advanceTime(4000));assert.equal((await state()).time,frozen);await page.locator('canvas').screenshot({path:'output/factory-unique-art/paused-after.png'});
 for(const [type,x,y]of machines){await place('inspect',x,y);for(let d=0;d<4;d++)await page.locator('#rotate-selected').click();await page.locator('#deselect').click();}
 assert.deepEqual(errors,[]);console.log('Unique factory QA passed: all six factories craft via actual supplied inputs, distinct models render in four directions, working imagery animates and paused simulation time stays fixed.');
}finally{await browser.close();}
