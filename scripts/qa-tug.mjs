import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(process.env.OXFORD_PLAYWRIGHT_MODULE?pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE).href:'playwright');
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000},hasTouch:true});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4174';
const state=()=>page.evaluate(()=>JSON.parse(render_game_to_text()));
async function open(){await page.goto(`${base}/?game=math-7-tug`);await page.locator('#start-game').click();}
async function choice(side,good=true){return page.evaluate(({side,good})=>{const p=game.tug[side],answer=game.items[p.question].answer;return p.choices.findIndex(a=>good?a===answer:a!==answer);},{side,good});}
async function answer(side,good=true){await page.locator(`[data-player="${side}"][data-tug-answer="${await choice(side,good)}"]`).click();}
async function ready(side){await page.waitForFunction(side=>!game.tug[side].locked,side);}
try{
 await fs.mkdir('output/tug',{recursive:true});await open();
 let s=await state();assert.notEqual(s.tugPlayers[0].questionIndex,s.tugPlayers[1].questionIndex);
 await page.screenshot({path:'output/tug/duel.png',fullPage:true});
 // Real browser multi-touch: both fingers go down in the same input event.
 const cdp=await page.context().newCDPSession(page),points=[];
 for(let side=0;side<2;side++){const b=await page.locator(`[data-player="${side}"][data-tug-answer="${await choice(side)}"]`).boundingBox();points.push({x:b.x+b.width/2,y:b.y+b.height/2,id:side+1});}
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:points});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 s=await state();assert.equal(s.attempts,2);assert.deepEqual(s.teams,[1,1]);assert.equal(s.rope,0);
 await page.screenshot({path:'output/tug/simultaneous.png',fullPage:true});
 await ready(0);await ready(1);
 await page.evaluate(()=>window.opponentButton=document.querySelector('[data-player="1"]'));
 const opponent=(await state()).tugPlayers[1].question;
 await answer(0,false);s=await state();assert.equal(s.rope,0);assert.equal(s.tugPlayers[1].question,opponent);
 assert.ok(await page.evaluate(()=>window.opponentButton===document.querySelector('[data-player="1"]')));
 // Opponent keeps playing while the first player reads their feedback.
 await answer(1);assert.equal((await state()).rope,1);
 await ready(1);await answer(1);await ready(1);await answer(1);
 assert.equal((await state()).view,'result');assert.equal((await state()).rope,3);
 await page.screenshot({path:'output/tug/winner.png',fullPage:true});
 // Restart while callbacks are pending; old callbacks must not change the new match.
 await page.locator('[data-replay]').click();const fresh=await state();await page.waitForTimeout(2300);assert.deepEqual((await state()).tugPlayers,fresh.tugPlayers);
 await answer(0);await page.locator('#restart').click();await page.locator('#confirm-ok').click();const restarted=await state();assert.equal(restarted.attempts,0);await page.waitForTimeout(2300);assert.deepEqual((await state()).tugPlayers,restarted.tugPlayers);for(let i=0;i<2;i++)assert.equal(await page.locator(`[data-side="${i}"] h2`).textContent(),restarted.tugPlayers[i].question);
 // Each independent deck uses all questions before refilling, even after wrong answers.
 const seen=new Set();for(let i=0;i<7;i++){s=await state();if(i<6){assert.ok(!seen.has(s.tugPlayers[0].questionIndex));seen.add(s.tugPlayers[0].questionIndex);}await answer(0,false);await ready(0);}
 assert.equal(seen.size,6);assert.equal((await state()).rope,0);
 // Left-side win and keyboard activation.
 await page.locator(`[data-player="0"][data-tug-answer="${await choice(0)}"]`).focus();await page.keyboard.press('Enter');await ready(0);await answer(0);await ready(0);await answer(0);assert.equal((await state()).rope,-3);assert.equal((await state()).view,'result');
 await open();await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'output/tug/mobile.png',fullPage:true});
 // Teacher custom questions are used by both decks; missing distractors block launch clearly.
 await page.goto(`${base}/?game=english-8-tug`);await page.locator('[data-row="0"] [data-field="prompt"]').fill('Custom classroom question');await page.locator('[data-row="0"] [data-field="options"]').fill('');await page.locator('#start-game').click();assert.equal((await state()).view,'editor');
 await page.locator('[data-row="0"] [data-field="options"]').fill('Custom wrong answer');await page.locator('#start-game').click();assert.ok(await page.evaluate(()=>game.items.some(q=>q.prompt==='Custom classroom question')));
 assert.deepEqual(errors,[]);console.log('PASS simultaneous native touch, independent decks, feedback, both winners, restart, keyboard, mobile, custom pool and validation');
}finally{await browser.close();}
