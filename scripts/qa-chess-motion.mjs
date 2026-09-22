import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE).href);
const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];
page.on('pageerror',e=>errors.push(e.stack));
const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4186';
const state=()=>page.evaluate(()=>game.session.data);
const advance=ms=>page.evaluate(ms=>advanceTime(ms),ms);
const index=s=>(8-Number(s[1]))*8+'abcdefgh'.indexOf(s[0]);
const cell=n=>page.locator(`[data-mode-action="lab-cell"][data-value="${n}"]`).click();
async function start(variant){await page.evaluate(v=>{openEditor(GAMES.find(g=>LAB_GAMES[g.format]?.variant===v));startGame();arcade.manual=true;},variant);await page.waitForTimeout(200);}
async function move(from,to,ms=1300){await cell(index(from));await cell(index(to));if(ms)await advance(ms);}
async function watch(){await page.evaluate(()=>{window.testStage=document.querySelector('.classic-layout');window.testSVG=document.querySelector('.classic-svg');window.testRect=testStage.getBoundingClientRect().toJSON();window.testVisual=document.querySelector('.classic-visual').getBoundingClientRect().toJSON();});}
async function stable(){assert.ok(await page.evaluate(()=>{const now=document.querySelector('.classic-layout').getBoundingClientRect(),visual=document.querySelector('.classic-visual').getBoundingClientRect();return testStage===document.querySelector('.classic-layout')&&testSVG===document.querySelector('.classic-svg')&&Math.abs(testRect.height-now.height)<1&&Math.abs(testRect.y-now.y)<1&&['x','y','width','height'].every(key=>Math.abs(testVisual[key]-visual[key])<1);}),'Stage/SVG must remain mounted and stable');}
try{
 await fs.mkdir('output/chess-motion',{recursive:true});await page.goto(base);
 // Regression: the same stage and SVG must survive selection, motion and landing.
 for(const v of ['fourrow','checkers']){await start(v);await watch();if(v==='fourrow')await cell(3);else{await cell(40);await stable();await cell(33);}await stable();for(let n=0;n<8;n++){await advance(100);await stable();}}
 await start('chess');await watch();assert.equal((await state()).autoRotate,false);
 await page.locator('[data-mode-action="lab-rotate"]').click();assert.equal((await state()).autoRotate,true);
 await move('e2','e4',0);assert.ok((await state()).motion);await stable();await advance(230);await page.screenshot({path:'output/chess-motion/slide.png'});
 await advance(500);assert.ok((await state()).rotation);assert.ok((await state()).viewAngle>0&&(await state()).viewAngle<180);await stable();await page.screenshot({path:'output/chess-motion/turning.png'});
 await advance(800);assert.equal((await state()).viewAngle,180);await stable();await page.screenshot({path:'output/chess-motion/black-facing.png'});
 const a8=await page.locator('[data-value="0"][data-mode-action="lab-cell"]').boundingBox(),h1=await page.locator('[data-value="63"][data-mode-action="lab-cell"]').boundingBox();assert.ok(a8.x>h1.x&&a8.y>h1.y);
 await move('e7','e5');assert.equal((await state()).viewAngle,0);assert.equal((await state()).history.length,2);
 await page.locator('[data-mode-action="lab-rotate"]').click();assert.equal((await state()).autoRotate,false);
 for(const [a,b] of [['g1','f3'],['b8','c6'],['f1','c4'],['g8','f6']])await move(a,b);
 await move('e1','g1',0);assert.equal((await state()).motion.rookTo,index('f1'));await advance(230);await page.screenshot({path:'output/chess-motion/castling.png'});await advance(800);
 assert.equal(await page.evaluate(()=>labChess(game.session.data).get('f1').type),'r');
 await start('chess');for(const [a,b] of [['e2','e4'],['a7','a6'],['e4','e5'],['d7','d5']])await move(a,b);
 await move('e5','d6',0);assert.equal((await state()).motion.capture,index('d5'));await advance(800);assert.equal(await page.evaluate(()=>labChess(game.session.data).get('d5')??null),null);
 // Legal small positions allow all promotion options without a long pawn race.
 await page.evaluate(()=>{window.testOriginalChess=labChess;labChess=function(d){if(!d.testFen)return testOriginalChess(d);const c=new LabChess(d.testFen);for(const m of d.history)c.move(m);return c;};});
 for(const promotion of [0,3]){
  await start('chess');await page.evaluate(()=>{const d=game.session.data;d.testFen='7k/P7/8/8/8/8/8/7K w - - 0 1';d.history=[];renderGame();});
  await move('a7','a8',0);assert.ok((await state()).promotion);assert.equal(await page.locator('.chess-promotions button').count(),4);await page.screenshot({path:'output/chess-motion/promotion.png'});
  await page.locator(`[data-mode-action="lab-promote"][data-value="${promotion}"]`).click();await advance(900);assert.equal(await page.evaluate(()=>labChess(game.session.data).get('a8').type),promotion===0?'q':'n');
 }
 await start('chess');for(const [a,b] of [['f2','f3'],['e7','e5'],['g2','g4']])await move(a,b);await move('d8','h4',0);assert.ok((await state()).motion.finish);assert.equal(await page.evaluate(()=>game.done),false);await advance(800);assert.equal(await page.evaluate(()=>game.done),true);assert.match(await page.evaluate(()=>game.session.message),/checkmate/);
 await page.locator('#skip-victory').click();await page.locator('[data-replay]').click();assert.equal((await state()).history.length,0);
 for(const size of [{width:1366,height:768},{width:1920,height:1080},{width:390,height:844}]){await page.setViewportSize(size);await start('chess');await page.screenshot({path:`output/chess-motion/layout-${size.width}.png`,fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));if(size.width>=1024)assert.ok(await page.evaluate(()=>document.querySelector('#arena').scrollHeight-document.querySelector('#arena').clientHeight<5));}
 await page.emulateMedia({reducedMotion:'reduce'});await start('chess');await page.locator('[data-mode-action="lab-rotate"]').click();await move('e2','e4',0);assert.ok(!(await state()).motion);assert.equal((await state()).viewAngle,180);
 assert.deepEqual(errors,[]);console.log('PASS stable boards throughout moves, chess moves/captures, rotated hit targets, optional rotation, castling, en passant, queen/knight promotion, checkmate timing, replay, reduced motion and layouts.');
}finally{await browser.close();}
