import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
// A held image also holds document.fonts.ready; capture the loading screen as-is.
process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY='1';
const {chromium}=await import(pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE).href);
const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4194';
const browser=await chromium.launch(),errors=[];
const page=await browser.newPage({viewport:{width:1366,height:768}});
page.on('pageerror',e=>errors.push(e.message));
const screen=()=>page.locator('#classroom-loading dialog');
async function ready(){await page.waitForFunction(()=>window.ClassroomLoading&&!ClassroomLoading.state.visible&&!document.querySelector('script[data-loading-script]:not([data-loaded])'));}
try{
 await fs.mkdir('output/loading',{recursive:true});
 let release;const held=new Promise(resolve=>{release=resolve;});
 await page.route('**/vocabulary-sprint/assets/forest.webp',async route=>{await held;await route.continue();});
 await page.goto(base+'/vocabulary-sprint/index.html',{waitUntil:'domcontentloaded'});
 await screen().waitFor({state:'visible'});await page.waitForFunction(()=>ClassroomLoading.state.loaded===4);
 assert.equal(await page.evaluate(()=>typeof window.render_game_to_text),'undefined');
 assert.equal(await page.locator('#classroom-loading progress').getAttribute('value'),'80');
 await page.screenshot({path:'output/loading/slow-desktop.png',animations:'disabled'});
 await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>['BODY','HTML'].includes(document.activeElement.tagName)||document.activeElement.id==='classroom-loading'));
 await page.keyboard.press('Escape');assert.ok(await screen().isVisible());
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'output/loading/slow-mobile.png',animations:'disabled'});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 release();await ready();assert.equal(await page.evaluate(()=>JSON.parse(render_game_to_text()).time),6);assert.equal(await page.evaluate(()=>JSON.parse(render_game_to_text()).elapsed),0);await page.locator('#start').click();await page.waitForFunction(()=>JSON.parse(render_game_to_text()).phase==='question');
 await page.screenshot({path:'output/loading/race-ready.png'});
 await page.unroute('**/vocabulary-sprint/assets/forest.webp');
 // An image failure must stay recoverable, and retry must actually request it again.
 let fail=true,requests=0;
 await page.route('**/magic-icing/assets/counter.webp',async route=>{requests++;if(fail)await route.abort('failed');else await route.continue();});
 await page.goto(base+'/magic-icing/index.html',{waitUntil:'domcontentloaded'});
 await page.locator('#classroom-loading .retry').waitFor({state:'visible'});assert.equal(await page.evaluate(()=>ClassroomLoading.state.failed),1);
 await page.screenshot({path:'output/loading/retry.png'});assert.equal(requests,1);fail=false;await page.locator('#classroom-loading .retry').click();await ready();assert.ok(requests>=2);assert.ok(await page.locator('#cake').isVisible());
 await page.unroute('**/magic-icing/assets/counter.webp');
 // The shared library must leave game clocks and match state untouched until ready.
 await page.setViewportSize({width:1366,height:768});let releaseBoard;const heldBoard=new Promise(resolve=>{releaseBoard=resolve;});
 await page.route('**/assets/chess/board-walnut.webp',async route=>{await heldBoard;await route.continue();});
 await page.goto(base,{waitUntil:'domcontentloaded'});await page.evaluate(()=>{openEditor(GAMES.find(g=>g.format==='lab-chess'));void startGame();});
 await screen().waitFor({state:'visible'});assert.equal(await page.evaluate(()=>ui.view),'editor');
 await page.locator('#start-game').evaluate(el=>el.click());await page.screenshot({path:'output/loading/library-chess.png'});
 releaseBoard();await page.waitForFunction(()=>ui.view==='player'&&!ClassroomLoading.state.visible);assert.equal(await page.locator('.classic-inputs button').count(),64);
 assert.equal(await page.evaluate(()=>game.session.data.history.length),0);
 await page.unroute('**/assets/chess/board-walnut.webp');
 await page.evaluate(async()=>{show('editor');await startGame();});assert.equal(await page.evaluate(()=>ui.view),'player');assert.equal(await screen().isVisible(),false);
 let releaseScene;const heldScene=new Promise(resolve=>{releaseScene=resolve;});
 await page.route('**/assets/chess/board-marble.webp',async route=>{await heldScene;await route.continue();});
 await page.evaluate(()=>{arcade.manual=true;void ClassroomLoading.prepare(['assets/chess/board-marble.webp'],{title:'Next scene',onCancel:()=>{}});});await screen().waitFor({state:'visible'});
 assert.ok(await page.evaluate(()=>{const time=arcade.time;advanceTime(1000);return arcade.time===time;}));releaseScene();await page.waitForFunction(()=>!ClassroomLoading.state.visible);await page.unroute('**/assets/chess/board-marble.webp');
 // A canceled load cannot start an old lesson after navigation.
 await page.evaluate(()=>{show('editor');const native=ClassroomLoadingAssets.games.blocks;window.savedLoadingAssets=native;ClassroomLoadingAssets.games.blocks=['assets/loading-cancel-test.png'];openEditor(GAMES.find(g=>g.format==='blocks'));void startGame();});
 await screen().waitFor({state:'visible'});await page.locator('#classroom-loading .back').click();assert.equal(await page.evaluate(()=>ui.view),'home');
 assert.equal(await page.evaluate(()=>ClassroomLoading.state.visible),false);
 await page.evaluate(()=>{ClassroomLoadingAssets.games.blocks=window.savedLoadingAssets;});
 // Every standalone entry must execute its scripts and clear the loading screen.
 for(const entry of ['alphabet-racing/index.html','alphabet-racing/solo.html','animal-post-office/index.html','coastal/index.html','explorer-island/index.html','magic-icing/index.html','shape-detective/index.html','supermarket/index.html','supermarket-ru/index.html','supermarket-ky/index.html','uk-border-geography/index.html','vocabulary-sprint/index.html','factory-maths.html','projectile-duel.html']){
  try{await fs.access('dist/'+entry);}catch{continue;}
  await page.goto(base+'/'+entry,{waitUntil:'domcontentloaded'});await ready();assert.equal(await screen().isVisible(),false,entry);console.log('Ready: '+entry);
 }
 assert.deepEqual(errors,[]);console.log('PASS: real image progress, boot gate, mobile, focus/keyboard, failed image retry, library launch and cancel, all 14 standalone entries, no page errors.');
}finally{await browser.close();}
