import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from 'file:///C:/Users/fangb_kyiapn1/.codex/skills/develop-web-game/node_modules/playwright/index.mjs';
const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1366,height:900}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));await fs.mkdir('output/block-builder',{recursive:true});
const click=async(a,v)=>page.click('[data-mode-action="pr-bb-'+a+'"]'+(v===undefined?'':'[data-value="'+v+'"]'));
for(const grade of [1,2,3]){
 await page.goto('http://127.0.0.1:5198/index.html?game=math-'+grade+'-blocks');await page.click('#start-game');await page.waitForSelector('.bb-workshop');
 await page.click('[data-mode-action="pr-check"]');assert.equal(await page.evaluate(()=>game.correct),0);
 const before=await page.evaluate(()=>[...game.session.board]);for(let i=0;i<4;i++)await click('rotate',1);assert.equal(await page.evaluate(()=>game.session.bb.turn),0);assert.deepEqual(await page.evaluate(()=>game.session.board),before);
 for(let i=0;i<10;i++)await page.evaluate(()=>handlePrimary({dataset:{modeAction:'pr-bb-zoom',value:'1'}}));assert.equal(await page.evaluate(()=>game.session.bb.zoom),1.4);
 for(let i=0;i<20;i++)await page.evaluate(()=>handlePrimary({dataset:{modeAction:'pr-bb-zoom',value:'-1'}}));assert.equal(await page.evaluate(()=>game.session.bb.zoom),.7);await click('reset');
 await click('cell',0);await click('height',3);assert.equal(await page.locator('[data-mode-action="pr-bb-step"][data-value="1"]').isDisabled(),true);await click('step',-1);await click('undo');assert.equal(await page.evaluate(()=>game.session.board[0]),3);await click('height',0);assert.equal(await page.locator('[data-mode-action="pr-bb-step"][data-value="-1"]').isDisabled(),true);
 await page.locator('[data-bb-cell="4"]').first().press('Enter');assert.equal(await page.evaluate(()=>game.session.bb.cell),4);
 for(let round=0;round<3;round++){
  const values=await page.evaluate(()=>game.session.values.map(Number));for(let i=0;i<9;i++){await click('cell',i);await click('height',values[i]);}
  if(round===0){await click('rotate',1);await click('zoom',1);await page.screenshot({path:'output/block-builder/grade-'+grade+'.png',fullPage:true});}
  await page.click('[data-mode-action="pr-check"]');assert.equal(await page.evaluate(()=>game.correct),round+1);await page.click('[data-mode-action="pr-next"]');
 }
 assert.equal(await page.evaluate(()=>game.done),true);assert.equal(await page.evaluate(()=>game.score),300);await page.click('[data-replay]');assert.deepEqual(await page.evaluate(()=>game.session.board),Array(9).fill(0));assert.equal(await page.evaluate(()=>game.session.bb.turn),0);
}
for(const size of [{width:1920,height:1080},{width:1366,height:768},{width:1024,height:768},{width:390,height:844}]){await page.setViewportSize(size);await page.screenshot({path:'output/block-builder/layout-'+size.width+'.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow '+size.width);}
const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});const tp=await touch.newPage();await tp.goto('http://127.0.0.1:5198/index.html?game=math-1-blocks');await tp.tap('#start-game');await tp.tap('[data-mode-action="pr-bb-cell"][data-value="8"]');await tp.tap('[data-mode-action="pr-bb-height"][data-value="2"]');assert.equal(await tp.evaluate(()=>game.session.board[8]),2);await tp.tap('[data-mode-action="pr-bb-rotate"][data-value="1"]');assert.equal(await tp.evaluate(()=>game.session.bb.turn),1);assert.deepEqual(errors,[]);await browser.close();console.log('PASS: all grades, 9 puzzles, scoring, replay, camera bounds/rotation/reset, editing, undo, keyboard, touch, responsive widths; zero page errors.');
