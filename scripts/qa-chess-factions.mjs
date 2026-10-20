import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE).href);
const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
page.on('pageerror',e=>errors.push(e.stack));
const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4195',out='output/chess-factions';
const settings=page.locator('.chess-settings');
async function start(){await page.evaluate(async()=>{openEditor(GAMES.find(g=>g.format==='lab-chess'));await startGame();arcade.manual=true;});}
async function open(){await page.locator('[data-chess-settings]').click();await settings.waitFor({state:'visible'});}
async function apply(){await settings.locator('[data-chess-apply]').click();await settings.waitFor({state:'hidden'});}
try{
 await fs.mkdir(out,{recursive:true});await page.goto(base);await start();
 assert.equal(await page.evaluate(()=>chessAppearance.mode),'traditional');
 await open();await settings.locator('[data-chess-mode="fantasy"]').click();await settings.locator('[data-chess-faction="robots"]').waitFor({state:'visible'});
 assert.equal(await settings.locator('[data-chess-faction]').count(),10);
 await settings.locator('[data-chess-side="white"]').click();await settings.locator('[data-chess-faction="orcs"]').click();await settings.locator('[data-chess-side="black"]').click();await settings.locator('[data-chess-faction="humans"]').click();
 await page.screenshot({path:out+'/settings-desktop.png'});await apply();
 assert.deepEqual(await page.evaluate(()=>({...chessAppearance})),{mode:'fantasy',board:'walnut',white:'orcs',black:'humans'});
 assert.equal(await page.locator('.classic-svg .chess-faction-piece').count(),32);assert.equal(await page.locator('.classic-svg .chess-role-badge').count(),32);
 await page.screenshot({path:out+'/orcs-vs-humans.png'});
 await page.locator('[data-mode-action="lab-cell"][data-value="52"]').click();await page.locator('[data-mode-action="lab-cell"][data-value="36"]').click();await page.evaluate(()=>advanceTime(1200));
 const history=await page.evaluate(()=>JSON.stringify(game.session.data.history));
 // Every faction can be assigned independently to either side through the UI.
 const ids=await page.evaluate(()=>Object.keys(CHESS_FACTIONS));
 for(const [i,id] of ids.entries()){
  await open();await settings.locator('[data-chess-side="white"]').click();await settings.locator(`[data-chess-faction="${id}"]`).click();await settings.locator('[data-chess-side="black"]').click();await settings.locator(`[data-chess-faction="${ids[(i+1)%ids.length]}"]`).click();await apply();
  assert.equal(await page.evaluate(()=>JSON.stringify(game.session.data.history)),history);assert.equal(await page.locator('.classic-svg [data-recolored="true"]').count(),0);
  await page.screenshot({path:out+'/faction-'+id+'.png'});
 }
 // Check all 100 matchups and all 60 faction/role crops, including mirror colours.
 assert.equal(await page.evaluate(()=>{
  for(const white of Object.keys(CHESS_FACTIONS))for(const black of Object.keys(CHESS_FACTIONS)){
   const look={mode:'fantasy',board:'walnut',white,black};if(chessRequiredAssets(look).length!==(white===black?2:3))return false;
   for(const [role] of CHESS_ROLES)for(const color of ['w','b']){const html=chessArtwork(role,color,null,false,look);if(!html.includes('data-faction="'+(color==='w'?white:black)+'"')||!html.includes('data-recolored="'+(white===black)+'"'))return false;}
  }return true;
 }),true);
 await open();await settings.locator('[data-chess-side="white"]').click();await settings.locator('[data-chess-faction="robots"]').click();await settings.locator('[data-chess-side="black"]').click();await settings.locator('[data-chess-faction="robots"]').click();assert.match(await settings.locator('.chess-team-note').innerText(),/warm gold.*cool blue/);await apply();
 assert.equal(await page.locator('.classic-svg [data-recolored="true"]').count(),32);assert.equal(await page.locator('.classic-svg filter').count(),32);await page.screenshot({path:out+'/robots-mirror.png'});
 await page.reload();await start();assert.equal(await page.evaluate(()=>chessAppearance.white),'robots');assert.equal(await page.evaluate(()=>chessAppearance.black),'robots');assert.equal(await page.evaluate(()=>chessAppearance.mode),'fantasy');
 await open();await settings.locator('[data-chess-mode="traditional"]').click();await settings.locator('[data-chess-close]').first().click();assert.equal(await page.evaluate(()=>chessAppearance.mode),'fantasy');
 await open();await settings.locator('[data-chess-mode="traditional"]').click();await apply();assert.equal(await page.locator('.classic-svg .chess-faction-piece').count(),0);
 await open();await settings.locator('[data-chess-mode="fantasy"]').click();await settings.locator('[data-chess-faction="robots"]').waitFor({state:'visible'});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:out+'/settings-mobile.png'});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await apply();await page.screenshot({path:out+'/board-mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);console.log('PASS: ten distinct armies, independent side choices, 100 pairings / 60 roles, mirror tint, role badges, apply/cancel, preserved match, persistence, traditional mode, desktop/mobile, no browser errors.');
}finally{await browser.close();}
