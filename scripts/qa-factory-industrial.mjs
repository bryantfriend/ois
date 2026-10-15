import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL('C:/Users/fangb_kyiapn1/.codex/skills/develop-web-game/node_modules/playwright/index.mjs').href);
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1920,height:1080}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const tap=async(x,y)=>{const p=await page.evaluate(([x,y])=>factoryTilePoint(x,y),[x,y]);await page.mouse.click(p.x,p.y);};
try{
 await page.addInitScript(()=>{requestAnimationFrame=()=>0;});await page.goto('http://127.0.0.1:4174/factory-maths.html');await page.locator('[data-level="1"]').click();await page.locator('#prediction').fill('24');await page.locator('[data-predict]').click();await tap(2,3);await page.locator('[data-tool="belt"]').click();await tap(3,3);await page.locator('[data-tool="plank"]').click();await tap(4,3);await page.locator('#run').click();await page.evaluate(()=>advanceTime(2000));
 const first=await page.locator('canvas').screenshot();await page.evaluate(()=>advanceTime(200));assert.notDeepEqual(await page.locator('canvas').screenshot(),first,'Working machine imagery animates');
 await page.locator('#run').click();const paused=await page.locator('canvas').screenshot();await page.evaluate(()=>advanceTime(5000));assert.deepEqual(await page.locator('canvas').screenshot(),paused,'Paused mechanisms stay visually frozen');
 await fs.mkdir('output/factory-industrial',{recursive:true});for(let i=0;i<2;i++)await page.locator('#zoom-in').click();
 await page.locator('[data-tool="pan"]').click();await page.mouse.move(650,600);await page.mouse.down();await page.mouse.move(870,860,{steps:12});await page.mouse.up();await page.locator('[data-tool="inspect"]').click();await tap(4,3);
 for(let dir=0;dir<4;dir++){await page.screenshot({path:`output/factory-industrial/direction-${dir}.png`,fullPage:true});await page.locator('#rotate-selected').click();}
 assert.deepEqual(errors,[]);console.log('Industrial graphics QA passed: active mechanical animation, exact paused canvas freeze, all four model orientations without rendering errors.');
}finally{await browser.close();}
