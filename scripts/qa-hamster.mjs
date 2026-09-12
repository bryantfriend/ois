import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(process.env.OXFORD_PLAYWRIGHT_MODULE?pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE).href:'playwright');
const b=await chromium.launch(),p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4174';
async function open(){await p.goto(`${base}/?game=math-7-relay`);await p.locator('#start-game').click();await p.evaluate(()=>advanceTime(0));}
async function miss(side,n){await p.evaluate(({side,n})=>{const player=game.tug[side],answer=game.items[player.question].answer,choice=player.choices.findIndex(a=>a!==answer),random=Math.random;Math.random=()=>n/5+.01;try{document.querySelector(`[data-player="${side}"][data-tug-answer="${choice}"]`).click();}finally{Math.random=random;}},{side,n});}
try{
 await fs.mkdir('output/hamster',{recursive:true});
 for(const [n,name]of ['tumble','sneeze','dizzy','hop','squash'].entries()){
  await open();await miss(0,n);assert.equal(await p.evaluate(()=>game.tug[0].reaction.kind),name);assert.equal(await p.evaluate(()=>game.teams[0]),0);
  await p.evaluate(()=>advanceTime(550));await p.screenshot({path:`output/hamster/${name}.png`,fullPage:true});
  // A second player's mistake gets its own effect without replacing the first.
  await miss(1,(n+1)%5);assert.equal(await p.evaluate(()=>game.tug[0].reaction.kind),name);assert.ok(await p.evaluate(()=>game.tug[1].reaction));
  await p.evaluate(()=>advanceTime(2000));assert.ok(await p.evaluate(()=>game.tug.every(p=>!p.reaction)));
 }
 await open();
 // Dashes must remain present after long play, including negative-modulo failure times.
 for(const seconds of [0,60,180,600,3600]){
  const white=await p.evaluate(seconds=>{arcade.time=seconds;renderArcade();const data=cx.getImageData(0,169,990,1).data;let count=0;for(let i=0;i<data.length;i+=4)if(data[i]>240&&data[i+1]>240&&data[i+2]>240)count++;return count;},seconds);assert.ok(white>250,`White track dashes at ${seconds}s: ${white}`);
 }
 await p.screenshot({path:'output/hamster/long-track.png'});
 await p.locator('#arcade-motion').click();await miss(0,2);await p.evaluate(()=>advanceTime(400));assert.ok(await p.evaluate(()=>arcade.reduced));await p.screenshot({path:'output/hamster/reduced.png'});
 await p.locator('#restart').click();await p.locator('#confirm-ok').click();assert.ok(await p.evaluate(()=>game.tug.every(p=>!p.reaction)));
 assert.deepEqual(errors,[]);console.log('PASS five randomized effects, per-player isolation, expiry, unchanged scores, restart, reduced motion, and persistent white lines through one hour');
}finally{await b.close();}
