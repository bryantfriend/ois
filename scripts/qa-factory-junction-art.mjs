import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL('C:/Users/fangb_kyiapn1/.codex/skills/develop-web-game/node_modules/playwright/index.mjs').href);
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1920,height:1080}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const state=()=>page.evaluate(()=>JSON.parse(render_game_to_text()));const tap=async(x,y)=>{const p=await page.evaluate(([x,y])=>factoryTilePoint(x,y),[x,y]);await page.mouse.click(p.x,p.y);};
async function place(tool,x,y,dir=0){await page.locator(`[data-tool="${tool}"]`).click();while((await state()).direction!==dir)await page.locator('#rotate').click();await tap(x,y);}
try{
 await page.addInitScript(()=>{requestAnimationFrame=()=>0;const stars={};for(let n=1;n<=5;n++)stars[n]=[true,false,false];localStorage.setItem('ois-factory-maths-v1',JSON.stringify({version:1,active:'team-1',teams:[{id:'team-1',name:'Team 1',stars,spent:0,upgrades:[],drafts:{}}]}));});
 await page.goto('http://127.0.0.1:4174/factory-maths.html');await page.locator('[data-level="5"]').click();await page.locator('#prediction').fill('12');await page.locator('[data-predict]').click();
 await place('splitter',7,5);for(const [x,y,d]of [[6,5,0],[8,5,0],[7,4,3],[7,6,1],[8,7,0],[9,6,1],[9,7,0],[10,7,0]])await place('belt',x,y,d);
 await page.locator('#zoom-in').click();await fs.mkdir('output/factory-junction-art',{recursive:true});await page.screenshot({path:'output/factory-junction-art/branches-and-merge.png',fullPage:true});
 for(let dir=0;dir<4;dir++){await tap(7,5);await page.locator('#rotate-selected').click();await page.locator('#deselect').click();await page.screenshot({path:`output/factory-junction-art/splitter-rotation-${dir}.png`,fullPage:true});}
 const before=(await state()).budget;await page.locator('#settings').click();await page.locator('#conveyor-arrows').uncheck();await page.locator('[data-close]').click();await page.screenshot({path:'output/factory-junction-art/arrows-off.png',fullPage:true});assert.equal((await state()).budget,before);assert.deepEqual(errors,[]);
 console.log('Junction art QA passed: splitter branches, multi-input merge, four rotations and arrow-free rendering without page errors or credit changes.');
}finally{await browser.close();}
