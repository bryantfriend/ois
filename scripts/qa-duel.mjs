import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(process.env.OXFORD_PLAYWRIGHT_MODULE?pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE).href:'playwright');
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:1000},hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4174';const state=()=>page.evaluate(()=>JSON.parse(render_game_to_text()));
async function button(side,good=true){const n=await page.evaluate(({side,good})=>{const p=game.tug[side],a=game.items[p.question].answer;return p.choices.findIndex(c=>good?c===a:c!==a);},{side,good});return page.locator(`[data-player="${side}"][data-tug-answer="${n}"]`);}
async function ready(side){await page.waitForFunction(i=>!game.tug[i].locked,side);}
try{
 await fs.mkdir('output/duel',{recursive:true});
 for(const format of ['tug','relay','board'])for(const subject of ['english','math'])for(const grade of [7,8]){
  await page.goto(`${base}/?game=${subject}-${grade}-${format}`);await page.locator('#start-game').click();assert.equal(await page.locator('.tug-side').count(),2);assert.notEqual((await state()).tugPlayers[0].questionIndex,(await state()).tugPlayers[1].questionIndex);
  // Both contacts in a single native multi-touch event.
  const cdp=await page.context().newCDPSession(page),points=[];for(let i=0;i<2;i++){const r=await(await button(i)).boundingBox();points.push({x:r.x+r.width/2,y:r.y+r.height/2,id:i+1});}await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:points});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.equal((await state()).attempts,2);
  await ready(0);await ready(1);
  // Preserve the opponent's actual DOM nodes through an answer and feedback update.
  await page.evaluate(()=>window.other=document.querySelector('[data-player="1"]'));await(await button(0,false)).click();assert.ok(await page.evaluate(()=>window.other===document.querySelector('[data-player="1"]')));await ready(0);
  await page.screenshot({path:`output/duel/${subject}-${grade}-${format}.png`,fullPage:true});
  if(format==='board'){
   // First player's completed deck waits, second keeps answering. Both get six attempts.
   while((await state()).tugPlayers[0].attempts<6){await ready(0);await(await button(0)).click();}
   await page.waitForFunction(()=>game.tug[0].finished);assert.equal((await state()).view,'playing');
   while((await state()).view!=='result'){await ready(1);await(await button(1)).click();}
   const s=await state();assert.equal(s.attempts,12);assert.equal(s.teams[1],1600);assert.ok(s.teams[0]<s.teams[1]);
  }else{while((await state()).view!=='result'){await ready(0);await(await button(0)).click();}assert.equal((await state()).teams[0],format==='tug'?4:6);}
  await page.locator('[data-replay]').click();assert.equal((await state()).attempts,0);assert.equal(await page.locator('.tug-side').count(),2);
  console.log(`PASS ${subject}-${grade}-${format}`);
 }
 for(const f of ['tug','relay','board']){
  await page.goto(`${base}/?game=english-8-${f}`);await page.locator('#start-game').click();await page.setViewportSize({width:1920,height:1080});await page.locator('#fullscreen').click();await page.screenshot({path:`output/duel/${f}-board.png`});assert.ok(await page.locator('.tug-side').count()===2);await page.evaluate(()=>document.exitFullscreen());await page.waitForTimeout(250);await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:`output/duel/${f}-mobile.png`,fullPage:true});await page.setViewportSize({width:1440,height:1000});
 }
 assert.deepEqual(errors,[]);console.log('PASS all 12 two-player lessons, native multi-touch, independent feedback, scoring, completion, replay, board and phone layouts');
}finally{await browser.close();}
