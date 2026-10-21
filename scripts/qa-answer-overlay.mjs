import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE).href);
const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1366,height:950}}),errors=[];
const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4201';
page.on('pageerror',e=>errors.push(e.stack));
const modal=page.locator('.answer-overlay[open]');
async function launch(format,id){
 await page.goto(base);
 await page.evaluate(async({format,id})=>{openEditor(GAMES.find(g=>id?g.id===id:g.format===format));await startGame();arcade.manual=true;}, {format,id});
 if(await page.locator('.courier-intro[open]').count())await page.locator('[data-courier-begin]').click();
}
async function fly(good){
 const lane=await page.evaluate(good=>game.choices.findIndex(a=>(a===current().answer)===good),good);
 await page.locator(`[data-courier-route="${lane}"]`).click();await page.evaluate(()=>window.originalPlane=document.querySelector('#courier-canvas'));await page.locator('[data-courier-send]').click();await page.evaluate(()=>advanceTime(3500));await modal.waitFor({state:'visible'});
}
async function next(){await modal.locator('[data-next],[data-mode-action$="-next"],[data-mode-action="lab-retry"]').first().click();await modal.waitFor({state:'hidden'});}
try{
 await fs.mkdir('output/answer-overlay',{recursive:true});
 // The same shared behavior across button, text, template, primary and puzzle renderers.
 for(const [format,selector,score] of [
  ['balloon','.act-targets',()=>{actScore(true);renderGame();}],
  ['typed','#act-answer-form',()=>{actScore(true);renderGame();}],
  ['classicquiz','.tpl-game',()=>{tplFeedback(true);renderGame();}],
  ['fruitsudoku','.pr-sudoku',()=>{prScore(true);renderGame();}],
  ['lab-sudoggos','.lab-grid',()=>{labWin();renderGame();}],
  ['quiz','.answers',()=>{award(true);}]
 ]){
  await launch(format,format==='quiz'?'english-8-quiz':null);
  await page.evaluate(selector=>window.originalBoard=document.querySelector(selector),selector);assert.ok(await page.evaluate(()=>!!originalBoard),format);
  await page.evaluate(score);await modal.waitFor({state:'visible'});assert.equal(await page.evaluate(selector=>originalBoard===document.querySelector(selector),selector),true,format);
  await page.screenshot({path:`output/answer-overlay/${format}.png`});await next();
 }
 // Retry restores puzzle controls; restarting/navigating discards old feedback.
 await launch('lab-sudoggos');await page.evaluate(()=>{labLose('Try another arrangement.');renderGame();});await modal.waitFor({state:'visible'});await next();assert.equal(await page.evaluate(()=>game.session.phase),'play');
 await page.evaluate(()=>{labWin();renderGame();});await modal.waitFor({state:'visible'});await modal.locator('.answer-overlay-exit').click();assert.equal(await page.evaluate(()=>ui.view),'home');assert.equal(await modal.count(),0);
 await launch('typed');await page.locator('#act-answer').fill(await page.evaluate(()=>current().answer));await page.locator('#act-answer').press('Enter');await modal.waitFor({state:'visible'});await page.evaluate(async()=>{await startGame();});assert.equal(await modal.count(),0);assert.equal(await page.evaluate(()=>game.index),0);
 await page.evaluate(()=>{actScore(false);renderGame();});await modal.waitFor({state:'visible'});await page.evaluate(()=>show('editor'));assert.equal(await modal.count(),0);
 // Timed sorting retains its automatic transition, and existing inline games stay inline.
 await launch('speedsort');await page.evaluate(()=>{actScore(true);renderGame();advanceTime(800);});assert.equal(await modal.count(),0);assert.equal(await page.evaluate(()=>game.session.phase),'question');
 await launch('picturevocab');await page.evaluate(()=>{actScore(true);renderGame();});assert.equal(await modal.count(),0);assert.equal(await page.locator('.vocab-picture').count(),1);
 await page.setViewportSize({width:390,height:844});await launch('diagram');await page.locator('[data-mode-action="act-cell-pick-type"][data-cell-type="animal"]').click();await page.locator('[data-mode-action="act-cell-begin"][data-level="easy"]').click();await page.locator('[data-mode-action="act-diagram"][data-value="0"]').click();await modal.waitFor({state:'visible'});assert.equal(await page.locator('#arena .act-diagram').count(),1);assert.equal(await modal.locator('.act-cell-discovery').count(),1);await modal.locator('img').evaluate(img=>img.decode());await page.setViewportSize({width:390,height:844});assert.equal(await modal.evaluate(el=>el.scrollTop),0);await page.screenshot({path:'output/answer-overlay/cell-mobile.png'});await next();assert.equal(await page.locator('#arena .act-diagram').count(),1);
 await page.setViewportSize({width:1366,height:950});await launch('typed');
 while(!await page.evaluate(()=>game.done)){await page.locator('#act-answer').fill(await page.evaluate(()=>current().answer));await page.locator('#act-answer').press('Enter');await modal.waitFor({state:'visible'});await next();}
 assert.equal(await modal.count(),0);if(await page.locator('#skip-victory').count())await page.locator('#skip-victory').click();assert.equal(await page.locator('[data-replay]').count(),1);await page.locator('[data-replay]').click();assert.equal(await page.evaluate(()=>game.index),0);assert.equal(await modal.count(),0);
 assert.deepEqual(errors,[]);console.log('PASS: preserved DOM/playfield, transparency, input lock, paused clock, Continue/retry, 6 shared renderer families, mobile, keyboard, text submission, restart/navigation cleanup, timed sorting, inline-game exclusion, no browser errors.');
}finally{await browser.close();}
