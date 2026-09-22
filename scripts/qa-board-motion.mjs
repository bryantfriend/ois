import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE).href);
const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];
page.on('pageerror',e=>errors.push(e.stack));
const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4186';
const state=()=>page.evaluate(()=>game.session.data);
const advance=ms=>page.evaluate(ms=>advanceTime(ms),ms);
const cell=n=>page.locator(`[data-mode-action="lab-cell"][data-value="${n}"]`).click();
async function start(variant){await page.evaluate(v=>{openEditor(GAMES.find(g=>LAB_GAMES[g.format]?.variant===v));startGame();arcade.manual=true;},variant);await page.waitForTimeout(180);}
try{
 await fs.mkdir('output/board-motion',{recursive:true});await page.goto(base);
 await start('fourrow');await cell(3);assert.equal((await state()).board[38],0);assert.ok((await state()).motion);
 await advance(250);await page.screenshot({path:'output/board-motion/drop.png'});
 assert.equal(await page.locator('.classic-inputs button:disabled').count(),7);
 await advance(500);assert.equal((await state()).motion,null);
 for(const n of [2,3,2,3,2]){await cell(n);await advance(600);}
 await cell(3);assert.ok((await state()).motion.finish);assert.equal(await page.evaluate(()=>game.done),false);
 await advance(600);assert.equal(await page.evaluate(()=>game.done),true);assert.ok(await page.locator('#skip-victory').isVisible());
 await page.locator('#skip-victory').click();await page.locator('[data-replay]').click();assert.equal((await state()).board.filter(x=>x>=0).length,0);
 await start('checkers');await cell(40);await cell(33);assert.ok((await state()).motion);await advance(150);await page.screenshot({path:'output/board-motion/slide.png'});await advance(400);assert.equal((await state()).turn,1);
 // Controlled legal positions exercise forced multi-capture and coronation.
 await page.evaluate(()=>{const d=game.session.data;d.board.fill(null);d.board[40]={owner:0,king:false};for(const i of [33,19,46])d.board[i]={owner:1,king:false};d.turn=0;d.selected=null;d.forced=null;renderGame();});
 await cell(40);await cell(26);assert.equal((await state()).forced,26);await advance(320);await page.screenshot({path:'output/board-motion/jump.png'});await advance(400);await cell(12);await advance(700);assert.equal((await state()).board[19],null);assert.equal((await state()).turn,1);
 await page.evaluate(()=>{const d=game.session.data;d.board.fill(null);d.board[8]={owner:0,king:false};d.board[46]={owner:1,king:false};d.turn=0;d.selected=null;d.forced=null;renderGame();});
 await cell(8);await cell(1);assert.ok((await state()).motion.promoted);await advance(600);await page.screenshot({path:'output/board-motion/crown.png'});await advance(600);assert.ok((await state()).board[1].king);
 // Restart/navigation during animation must not apply a deferred result later.
 await start('fourrow');await cell(0);await start('checkers');await advance(1500);assert.equal((await state()).board.filter(Boolean).length,24);
 for(const size of [{width:1366,height:768},{width:1920,height:1080},{width:820,height:1180},{width:390,height:844}]){
  await page.setViewportSize(size);
  for(const variant of ['fourrow','checkers','kids']){
   await start(variant);await page.screenshot({path:`output/board-motion/${variant}-${size.width}.png`,fullPage:true});
   const bounds=await page.evaluate(()=>({width:document.documentElement.scrollWidth,arena:document.querySelector('#arena').getBoundingClientRect().toJSON(),board:document.querySelector('.classic-visual').getBoundingClientRect().toJSON(),overflow:document.querySelector('#arena').scrollHeight-document.querySelector('#arena').clientHeight}));
   assert.ok(bounds.width<=size.width,JSON.stringify(bounds));
   if(size.width>=1024){assert.ok(bounds.overflow<5,variant+JSON.stringify(bounds));assert.ok(bounds.board.height>bounds.arena.height*.8,JSON.stringify(bounds));}
  }
 }
 await page.emulateMedia({reducedMotion:'reduce'});await start('fourrow');await cell(0);assert.ok(!(await state()).motion);
 await page.goto(base+'/projectile-duel.html');
 const plus=page.getByRole('button',{name:'Increase Blue angle'}),box=await plus.boundingBox();
 await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();
 assert.equal(await page.locator('#p1-angle').inputValue(),'46');await page.waitForTimeout(550);await page.mouse.up();
 const angle=+(await page.locator('#p1-angle').inputValue());assert.ok(angle>=50);await page.waitForTimeout(150);assert.equal(+(await page.locator('#p1-angle').inputValue()),angle);
 await page.locator('#p1-angle').fill('42.5');assert.equal(await page.locator('#p1-angle-val').textContent(),'42.5');
 const fire=await page.locator('#p1-fire-btn').boundingBox();await page.mouse.move(fire.x+20,fire.y+20);await page.mouse.down();assert.equal(await page.evaluate(()=>activeProjectiles.length),1);await page.mouse.up();
 assert.deepEqual(errors,[]);console.log('PASS drops, win timing, checker slides, chained captures, promotion, restart, reduced motion, large/mobile layouts and immediate/held cannon controls.');
}finally{await browser.close();}
