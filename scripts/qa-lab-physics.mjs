import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from 'file:///C:/Users/fangb_kyiapn1/.codex/skills/develop-web-game/node_modules/playwright/index.mjs';
const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4187',solutions=JSON.parse(await fs.readFile('scripts/lab-physics-solutions.json','utf8'));
const button=a=>page.locator('[data-mode-action="lab-'+a+'"]'),state=()=>page.evaluate(()=>game.session.data);
async function draw(lines){for(const line of lines){const points=await page.locator('#lab-physics').evaluate((svg,line)=>line.map(([x,y])=>{const p=new DOMPoint(x,y).matrixTransform(svg.getScreenCTM());return {x:p.x,y:p.y};}),line);await page.mouse.move(points[0].x,points[0].y);await page.mouse.down();for(const p of points.slice(1))await page.mouse.move(p.x,p.y,{steps:35});await page.mouse.up();}}
async function open(level=1){await page.goto(base+'/?game=math-3-lab-drawsome');await page.locator('#start-game').click();await page.evaluate(level=>{arcade.manual=true;game.index=level-1;labRound();renderGame();},level);await page.waitForTimeout(100);}
try{
 await fs.mkdir('output/draw-together/levels',{recursive:true});
 await page.goto(base);await page.evaluate(()=>{resetFilters();renderLibrary();});assert.equal(await page.locator('[data-play="math-4-lab-physics-ball"]').count(),0);assert.equal(await page.locator('[data-play="math-4-lab-brain-buster"]').count(),0);assert.equal(await page.locator('[data-play="math-3-lab-drawsome"]').count(),1);
 assert.deepEqual(await page.evaluate(()=>GAMES.find(g=>g.format==='lab-drawsome').items.map(q=>Number(q.answer))),Array.from({length:20},(_,i)=>i+1));
 assert.equal(await page.evaluate(()=>LAB_PHYSICS_LEVELS.length),20);
 for(const slug of ['physics-ball','brain-buster']){await page.goto(base+'/?game=math-4-lab-'+slug);await page.locator('#start-game').click();assert.equal((await state()).level,1);}
 // Saved teacher copies of archived formats are retained in My lessons.
 await page.evaluate(()=>{saved=[validateLesson({...GAMES.find(g=>g.format==='lab-physics-ball'),id:'saved-archived-ramp',title:'My saved ramp'})];ui.collection='saved';ui.view='home';resetFilters();show('home');renderLibrary();});assert.equal(await page.locator('[data-play="saved-archived-ramp"]').count(),1);
 await open();
 await button('release').click();assert.equal((await state()).running,true);assert.equal(await button('release').isDisabled(),true);await page.evaluate(()=>advanceTime(1000));assert.ok((await state()).ball.y>100);assert.equal(Number(await page.locator('#lab-ball').getAttribute('cy')),(await state()).ball.y);
 await button('resetball').click();assert.equal((await state()).ball.y,40);await button('release').focus();await page.keyboard.press('Enter');assert.equal((await state()).running,true);await button('resetball').click();
 // All twenty solutions are drawn with real mouse gestures, within their ink budgets.
 if(!process.env.OXFORD_EDGES_ONLY){for(let level=1;level<=20;level++){
  assert.equal((await state()).level,level);await page.waitForTimeout(80);
  await draw(solutions[level-1]);const d=await state();assert.ok(d.ink<=d.maxInk+.001,level+' ink');assert.equal(d.lines.length,solutions[level-1].length);
  await page.screenshot({path:'output/draw-together/levels/level-'+level+'.png'});
  await button('release').click();await page.evaluate(()=>{advanceTime(10000);advanceTime(8500);});assert.equal(await page.evaluate(()=>game.session.phase),'feedback','level '+level+' solved');assert.ok((await state()).collected.every(Boolean));
  await button('next').click();console.log('PASS level '+level+' real drawing, ink budget, collision, stars and completion');
 }
 assert.equal(await page.evaluate(()=>game.done),true);assert.equal(await page.evaluate(()=>game.correct),20);assert.equal(await page.evaluate(()=>game.score),2000);
 await page.evaluate(()=>advanceTime(5000));await page.locator('[data-replay]').click();assert.equal((await state()).level,1);assert.equal(await page.evaluate(()=>game.correct),0);}
 // Failure paths allow revision without losing ramps.
 await open(6);await button('release').click();await page.evaluate(()=>{advanceTime(10000);advanceTime(9000);});assert.equal((await state()).running,false);
 await page.evaluate(()=>{const d=game.session.data;d.ball={x:200,y:250,vx:0,vy:0};d.running=true;});await page.evaluate(()=>advanceTime(100));assert.match(await page.locator('.lab-status').textContent(),/Lava/);await button('resetball').click();assert.equal(await page.locator('.lab-status').textContent(),'');
 await open(10);await page.evaluate(()=>{const d=game.session.data;d.ball={...d.goal,vx:0,vy:0};d.running=true;});await page.evaluate(()=>advanceTime(16));assert.match(await page.locator('.lab-status').textContent(),/Collect every/);assert.equal(await page.evaluate(()=>game.correct),0);await button('resetball').click();assert.deepEqual((await state()).collected,[false]);
 await open(18);await draw([[[30,130],[580,270]]]);assert.ok(Math.abs((await state()).ink-340)<.01);await button('undo').click();assert.equal((await state()).ink,0);await draw(solutions[17]);await button('release').click();await page.evaluate(()=>advanceTime(500));await button('resetball').click();assert.equal((await state()).lines.length,1);assert.deepEqual((await state()).collected,[false]);await button('retry').click();assert.equal((await state()).lines.length,0);
 for(const viewport of [{width:1920,height:1080},{width:1366,height:768},{width:768,height:1024},{width:390,height:844}]){await page.setViewportSize(viewport);await open(20);await page.waitForTimeout(200);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));if(viewport.width>=1024)assert.ok(await page.evaluate(()=>document.querySelector('#arena').scrollHeight<=document.querySelector('#arena').clientHeight+2));await page.screenshot({path:'output/draw-together/levels/layout-'+viewport.width+'.png',fullPage:true});}
 const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true}),mobile=await touch.newPage();mobile.on('pageerror',e=>errors.push(e.message));await mobile.goto(base+'/?game=math-3-lab-drawsome');await mobile.locator('#start-game').tap();await mobile.evaluate(()=>{arcade.manual=true;});
 const client=await touch.newCDPSession(mobile),coords=await mobile.locator('#lab-physics').evaluate(svg=>[[30,90],[300,250]].map(([x,y])=>{const p=new DOMPoint(x,y).matrixTransform(svg.getScreenCTM());return {x:p.x,y:p.y};}));
 await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[coords[0]]});for(let k=1;k<=35;k++)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:coords[0].x+(coords[1].x-coords[0].x)*k/35,y:coords[0].y+(coords[1].y-coords[0].y)*k/35}]});await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.equal(await mobile.evaluate(()=>game.session.data.lines.length),1);await mobile.waitForTimeout(100);await mobile.locator('[data-mode-action="lab-release"]').tap();await mobile.bringToFront();await mobile.evaluate(()=>{arcade.manual=false;});await mobile.waitForTimeout(600);assert.ok(await mobile.evaluate(()=>game.session.data.ball.y>40));await mobile.screenshot({path:'output/draw-together/levels/touch.png',fullPage:true});await mobile.evaluate(()=>advanceTime(10000));assert.equal(await mobile.evaluate(()=>game.session.phase),'feedback');await mobile.locator('[data-mode-action="lab-next"]').tap();assert.equal(await mobile.evaluate(()=>game.session.data.level),2);await mobile.locator('[data-mode-action="lab-release"]').tap();assert.equal(await mobile.evaluate(()=>game.session.data.running),true);await mobile.locator('[data-mode-action="lab-resetball"]').tap();assert.equal(await mobile.evaluate(()=>game.session.data.running),false);await touch.close();
 assert.deepEqual(errors,[]);console.log('PASS archive/saved compatibility, keyboard, failures, undo, ink limit, reset/retry, replay, desktop/tablet/mobile layout, native touch and real animation; no browser errors');
}finally{await browser.close();}




