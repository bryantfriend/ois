import assert from 'node:assert/strict';
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE||'C:/Users/fangb_kyiapn1/.codex/skills/develop-web-game/node_modules/playwright/index.mjs').href);
const b=await chromium.launch(),p=await b.newPage({viewport:{width:1366,height:768},hasTouch:true});const errors=[];p.on('pageerror',e=>errors.push(e.message));const base=process.env.TEST_URL||'http://127.0.0.1:4183';fs.mkdirSync('output/tug-fair-play',{recursive:true});
const state=()=>p.evaluate(()=>JSON.parse(render_game_to_text()));
async function open(manual=true){await p.goto(base+'/?game=math-7-tug');await p.click('#start-game');if(manual)await p.evaluate(()=>advanceTime(0));await p.waitForTimeout(100);}
async function selector(side,good=true){const n=await p.evaluate(({side,good})=>{const s=game.tug[side];return s.choices.findIndex(a=>(a===game.items[s.question].answer)===good);},{side,good});return `[data-player="${side}"][data-tug-answer="${n}"]`;}
async function answer(side,good=true){await p.locator(await selector(side,good)).click();}
async function tick(ms){await p.evaluate(ms=>advanceTime(ms),ms);}
async function rects(){return p.evaluate(()=>[...document.querySelectorAll('.tug-side,.tug-answers button,#game-canvas')].map(el=>{const r=el.getBoundingClientRect();return [r.x,r.y,r.width,r.height];}));}
try{
 await open();const before=await rects();await p.evaluate(()=>window.opponentButton=document.querySelector('[data-player="1"]'));
 await answer(0);await tick(1101);assert.deepEqual((await state()).teams,[1,0]);
 await answer(0,false);assert.equal((await state()).tugPlayers[0].cooldownSeconds,5);assert.equal((await state()).tugPlayers[0].wrongStreak,1);await p.waitForTimeout(100);assert.deepEqual(await rects(),before);
 await p.evaluate(()=>{for(let i=0;i<50;i++)document.querySelector('[data-player="0"]').dispatchEvent(new MouseEvent('click',{bubbles:true}));});assert.equal((await state()).attempts,2);
 await answer(1);assert.deepEqual((await state()).teams,[1,1]);assert.equal(await p.evaluate(()=>window.opponentButton===document.querySelector('[data-player="1"]')),true);
 await tick(4999);assert.equal((await state()).tugPlayers[0].locked,true);await tick(2);assert.equal((await state()).tugPlayers[0].locked,false);assert.deepEqual(await rects(),before);
 await answer(0,false);assert.deepEqual((await state()).teams,[0,1]);assert.equal((await state()).rope,1);assert.equal((await state()).tugPlayers[0].wrongStreak,0);assert.equal(await p.locator('[data-side="0"]').getAttribute('data-reaction'),'penalty');await p.screenshot({path:'output/tug-fair-play/penalty.png'});
 await tick(5001);await answer(0);await tick(1101);await answer(0,false);await tick(5001);await answer(0);assert.equal((await state()).tugPlayers[0].wrongStreak,0);await tick(1101);await answer(0,false);assert.equal((await state()).tugPlayers[0].penalty,false);
 // Fresh zero scores still incur the promised deduction; restart clears both timers/streaks.
 await open();await answer(0,false);await tick(5001);await answer(0,false);assert.deepEqual((await state()).teams,[-1,0]);await p.click('#restart');await p.click('#confirm-ok');await tick(6000);assert.deepEqual((await state()).teams,[0,0]);assert.equal((await state()).attempts,0);
 // Native simultaneous touches are independently accepted, while extra held-side taps are ignored.
 const cdp=await p.context().newCDPSession(p),points=[];for(let side=0;side<2;side++){const r=await p.locator(await selector(side,false)).boundingBox();points.push({x:r.x+r.width/2,y:r.y+r.height/2,id:side+1});}
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:points});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.equal((await state()).attempts,2);assert.ok((await state()).tugPlayers.every(s=>s.locked));await tick(5001);
 await p.locator(await selector(0)).focus();await p.keyboard.press('Enter');assert.equal((await state()).teams[0],1);
 // Right-side win caused by the opponent's penalty still reaches celebration and final result.
 await open();await answer(1);await tick(1101);await answer(1);await answer(0,false);await tick(5001);await answer(0,false);assert.equal((await state()).rope,3);assert.equal((await state()).view,'result');await p.click('#skip-victory');assert.match(await p.locator('#arena').textContent(),/Player 2/);await p.click('[data-replay]');assert.deepEqual((await state()).teams,[0,0]);
 // Multiple question lengths/counts retain both panels and target rectangles through transitions.
 await p.evaluate(()=>{const l=clone(GAMES.find(g=>g.format==='tug'));l.items=[{prompt:'Short?',answer:'Yes',options:['No'],hint:'',explanation:''},{prompt:'Long classroom question '.repeat(25),answer:'A long correct answer '.repeat(12),options:['A long wrong answer '.repeat(12),'Second','Third'],hint:'',explanation:''}];openEditor(l);startGame();advanceTime(0);});
 for(const [w,h] of [[1366,768],[1920,1080],[800,900],[390,844]]){await p.setViewportSize({width:w,height:h});await p.waitForTimeout(100);const r=await rects();await answer(0,false);await p.waitForTimeout(100);assert.deepEqual(await rects(),r);await tick(5001);assert.deepEqual(await rects(),r);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:`output/tug-fair-play/layout-${w}.png`,fullPage:true});await answer(1,false);await tick(5001);}
 await p.click('#arcade-motion');assert.equal(await p.locator('.tug-hamster-body').first().evaluate(el=>getComputedStyle(el).animationName),'none');await answer(0,false);await tick(5001);assert.equal((await state()).tugPlayers[0].locked,false);
 // Real animation-clock cooldown: no input before 5 seconds, ready shortly afterwards.
 await p.setViewportSize({width:1366,height:768});await open(false);await answer(0,false);await p.waitForTimeout(4500);assert.equal((await state()).tugPlayers[0].locked,true);await p.waitForFunction(()=>!game.tug[0].locked,{},{timeout:3000});
 await answer(0);await p.screenshot({path:'output/tug-fair-play/pull.png'});assert.deepEqual(errors,[]);console.log('PASS fixed rectangles, independent 5s cooldowns, spam/multi-touch, consecutive penalties/reset, negative scores, penalty win, restart, keyboard, long text, mobile/tablet/desktop and reduced motion.');
}finally{await b.close();}
