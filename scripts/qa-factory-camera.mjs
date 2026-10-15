import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL('C:/Users/fangb_kyiapn1/.codex/skills/develop-web-game/node_modules/playwright/index.mjs').href);
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1920,height:1080},hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const state=()=>page.evaluate(()=>JSON.parse(render_game_to_text()));const point=(x,y)=>page.evaluate(([x,y])=>factoryTilePoint(x,y),[x,y]);
const tap=async(x,y)=>{const p=await point(x,y);await page.touchscreen.tap(p.x,p.y);};
try{
 await fs.mkdir('output/factory-camera',{recursive:true});await page.goto('http://127.0.0.1:4174/factory-maths.html');await page.locator('[data-level="1"]').click();await page.locator('#prediction').fill('24');await page.locator('[data-predict]').click();
 await tap(2,3);await page.locator('[data-tool="plank"]').click();await tap(4,3);await page.locator('[data-tool="belt"]').click();
 const pts=await page.evaluate(()=>[[3,3],[3,4],[4,4],[5,4],[6,4]].map(([x,y])=>factoryTilePoint(x,y)));await page.mouse.move(pts[0].x,pts[0].y);await page.mouse.down();for(const p of pts.slice(1))await page.mouse.move(p.x,p.y,{steps:5});await page.mouse.up();
 await tap(2,3);assert.ok(await page.locator('#selection-actions').isVisible());assert.match(await page.locator('#selection-name').innerText(),/Extractor/);const spent=(await state()).spent;
 await page.locator('#rotate-selected').click();assert.equal((await state()).cells.find(c=>c.type==='extractor').direction,1);await page.locator('#rotate-left').click();assert.equal((await state()).cells.find(c=>c.type==='extractor').direction,0);assert.equal((await state()).spent,spent);
 await page.screenshot({path:'output/factory-camera/extractor-rotation.png',fullPage:true});await page.locator('#deselect').click();
 await tap(4,3);await page.locator('#rotate-selected').click();assert.equal((await state()).cells.find(c=>c.type==='plank').direction,1);await page.locator('#deselect').click();await tap(5,4);await page.locator('#rotate-selected').click();assert.equal((await state()).cells.find(c=>c.x===5&&c.y===4).direction,1);await page.locator('#deselect').click();
 // Zoom/pan changes only the camera. Tile selection/rotation stays aligned.
 await page.locator('#zoom-in').click();await page.locator('#zoom-in').click();assert.equal((await state()).camera.zoom,1.5625);await page.locator('[data-tool="pan"]').click();
 const rect=await page.locator('canvas').boundingBox();await page.mouse.move(rect.x+rect.width/2,rect.y+rect.height/2);await page.mouse.down();await page.mouse.move(rect.x+rect.width/2+100,rect.y+rect.height/2+60,{steps:5});await page.mouse.up();assert.equal(Math.round((await state()).camera.x),100);assert.equal(Math.round((await state()).camera.y),60);assert.equal((await state()).spent,spent);
 await page.locator('[data-tool="inspect"]').click();await tap(4,3);assert.match(await page.locator('#selection-name').innerText(),/Plank/);await page.locator('#rotate-left').click();assert.equal((await state()).cells.find(c=>c.type==='plank').direction,0);await page.screenshot({path:'output/factory-camera/zoomed-factory.png',fullPage:true});await page.locator('#deselect').click();
 await page.locator('[data-tool="belt"]').click();await tap(8,5);assert.ok((await state()).cells.some(c=>c.x===8&&c.y===5&&c.type==='belt'),'Touch placement after pan/zoom');
 await page.locator('#fit-view').click();assert.deepEqual((await state()).camera,{zoom:1,x:0,y:0});
 await page.mouse.move(rect.x+rect.width/2,rect.y+rect.height/2);await page.mouse.wheel(0,-250);await page.waitForTimeout(100);assert.ok((await state()).camera.zoom>1);await page.locator('#fit-view').click();
 // Native multi-touch pinch + pan must not create an accidental belt under the first finger.
 const session=await page.context().newCDPSession(page),cx=rect.x+rect.width*.6,cy=rect.y+rect.height*.55;const before=(await state()).spent;
 await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:cx-50,y:cy,id:1},{x:cx+50,y:cy,id:2}]});
 await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:cx-90+25,y:cy+30,id:1},{x:cx+90+25,y:cy+30,id:2}]});
 await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.ok((await state()).camera.zoom>1.6);assert.equal((await state()).spent,before,'Pinch cannot place a belt');
 await page.locator('#fit-view').click();await page.setViewportSize({width:1366,height:768});await page.screenshot({path:'output/factory-camera/laptop.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);console.log('Camera QA passed: local rotations, correct tile mapping after zoom/pan, wheel, native pinch/pan, no accidental building, refunds unchanged.');
}finally{await browser.close();}
