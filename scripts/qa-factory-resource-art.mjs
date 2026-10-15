import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL('C:/Users/fangb_kyiapn1/.codex/skills/develop-web-game/node_modules/playwright/index.mjs').href);
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1920,height:1080}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const tap=async(x,y)=>{const p=await page.evaluate(([x,y])=>factoryTilePoint(x,y),[x,y]);await page.mouse.click(p.x,p.y);};
try{
 await page.addInitScript(()=>{requestAnimationFrame=()=>0;const stars={};for(let n=1;n<=12;n++)stars[n]=[true,false,false];localStorage.setItem('ois-factory-maths-v1',JSON.stringify({version:1,active:'team-1',teams:[{id:'team-1',name:'Team 1',stars,spent:0,upgrades:[],drafts:{}}]}));});await fs.mkdir('output/factory-resource-art',{recursive:true});await page.goto('http://127.0.0.1:4174/factory-maths.html');
 for(const [level,x,y,name]of [[1,2,3,'wood'],[3,2,3,'iron'],[9,2,8,'copper']]){
  await page.locator(`[data-level="${level}"]`).click();await page.locator('#prediction').fill('24');await page.locator('[data-predict]').click();await tap(x,y);await page.locator('#run').click();await page.evaluate(()=>advanceTime(2000));
  await page.screenshot({path:`output/factory-resource-art/${name}.png`,fullPage:true});const before=await page.locator('canvas').screenshot();await page.evaluate(()=>advanceTime(200));assert.equal((await page.locator('canvas').screenshot()).equals(before),false,`${name} extraction animates`);
  await page.locator('#run').click();const paused=await page.locator('canvas').screenshot();await page.evaluate(()=>advanceTime(5000));assert.equal((await page.locator('canvas').screenshot()).equals(paused),true,`${name} extraction freezes while paused`);await page.locator('#teams').click();
 }
 await page.evaluate(()=>{FACTORY_DATA.levels[0].target='wood';FACTORY_DATA.levels[0].count=10000;});await page.locator('[data-level="1"]').click();await page.locator('[data-predict]').click();await page.locator('[data-tool="belt"]').click();for(let x=3;x<=12;x++)await tap(x,3);await page.locator('#rotate').click();await tap(13,3);await tap(13,4);await page.locator('#run').click();await page.evaluate(()=>advanceTime(22000));
 assert.ok(await page.evaluate(()=>JSON.parse(render_game_to_text()).delivered[0]>0));await page.screenshot({path:'output/factory-resource-art/dock-receiving.png',fullPage:true});
 assert.deepEqual(errors,[]);console.log('Resource art QA passed: wood/iron/copper production visuals animate and freeze exactly when paused; redesigned dock accepts and displays delivered goods without rendering errors.');
}finally{await browser.close();}
