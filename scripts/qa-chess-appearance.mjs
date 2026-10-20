import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE).href);
const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4192';
async function start(){await page.evaluate(()=>{openEditor(GAMES.find(g=>LAB_GAMES[g.format]?.variant==='chess'));startGame();arcade.manual=true;});}
try{
 await fs.mkdir('output/chess-appearance',{recursive:true});await page.goto(base);await start();
 await page.locator('[data-mode-action="lab-cell"][data-value="52"]').click();await page.locator('[data-mode-action="lab-cell"][data-value="36"]').click();await page.evaluate(()=>advanceTime(1300));
 const history=await page.evaluate(()=>JSON.stringify(game.session.data.history));
 await page.locator('[data-chess-settings]').click();assert.equal(await page.locator('dialog[open]').count(),1);
 for(const board of ['walnut','marble','garden','ocean','royal'])for(const pieces of ['classic','woodland','crystal','candy','space']){
  await page.locator(`[data-chess-kind="board"][data-chess-choice="${board}"]`).click();await page.locator(`[data-chess-kind="pieces"][data-chess-choice="${pieces}"]`).click();
  assert.deepEqual(await page.evaluate(()=>JSON.parse(render_game_to_text()).chess.appearance),{board,pieces});
  assert.equal(await page.evaluate(()=>JSON.stringify(game.session.data.history)),history);
  assert.equal(await page.locator('.chess-style-choice[aria-pressed=true]').count(),2);
 }
 assert.ok(await page.evaluate(async()=>{const urls=[...CHESS_BOARDS.map(id=>chessAsset('board',id)),...CHESS_SETS.map(id=>chessAsset('pieces',id))];return (await Promise.all(urls.map(src=>new Promise(resolve=>{const image=new Image();image.onload=()=>resolve(image.naturalWidth>0);image.onerror=()=>resolve(false);image.src=src;})))).every(Boolean);}));
 await page.screenshot({path:'output/chess-appearance/settings-desktop.png'});await page.keyboard.press('Escape');assert.equal(await page.locator('dialog[open]').count(),0);assert.ok(await page.locator('[data-chess-settings]').evaluate(el=>el===document.activeElement));
 await page.screenshot({path:'output/chess-appearance/royal-space.png'});
 await page.reload();await start();assert.deepEqual(await page.evaluate(()=>({...chessAppearance})),{board:'royal',pieces:'space'});
 for(const id of ['classic','woodland','crystal','candy','space']){await page.locator('[data-chess-settings]').click();await page.locator(`[data-chess-choice="${id}"]`).click();await page.locator('dialog footer [data-chess-close]').click();await page.screenshot({path:`output/chess-appearance/pieces-${id}.png`});}
 await page.setViewportSize({width:390,height:844});await page.locator('[data-chess-settings]').click();await page.screenshot({path:'output/chess-appearance/settings-mobile.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.locator('dialog footer [data-chess-close]').click();await page.screenshot({path:'output/chess-appearance/board-mobile.png',fullPage:true});assert.deepEqual(errors,[]);
 console.log('PASS: 25 combinations, 10 loaded images, unchanged match, persistence, Escape/focus return, desktop/mobile, no browser errors.');
}finally{await browser.close();}
