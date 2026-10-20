import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE).href);
const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1440,height:1000}});
const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4199',full=[],errors=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('response',response=>{if(response.status()>=400)errors.push(response.status()+' '+response.url());});
let release;
const held=new Promise(resolve=>{release=resolve;});
try{
 await page.goto(base);
 await page.evaluate(async()=>{openEditor(GAMES.find(g=>g.format==='lab-chess'));await startGame();arcade.manual=true;});
 await page.route('**/assets/chess/previews/**',async route=>{await held;await route.continue();});
 page.on('request',request=>{const url=new URL(request.url());if(url.pathname.includes('/assets/chess/')&&!url.pathname.includes('/previews/'))full.push(url.pathname);});
 // A stalled preview must never prevent opening the dialog or changing mode.
 assert.ok(await page.evaluate(()=>{document.querySelector('[data-chess-settings]').click();return document.querySelector('.chess-settings').open&&!ClassroomLoading.state.visible;}));
 assert.ok(await page.evaluate(()=>{document.querySelector('[data-chess-mode="fantasy"]').click();return document.querySelectorAll('[data-chess-faction]').length===10&&!ClassroomLoading.state.visible;}));
 await page.locator('[data-chess-side="white"]').click();
 await page.locator('[data-chess-faction="robots"]').click();
 await page.locator('[data-chess-side="black"]').click();
 await page.locator('[data-chess-faction="mechs"]').click();
 assert.deepEqual(full,[],'Browsing the menu must not fetch full artwork');
 assert.ok(await page.locator('.chess-settings image').evaluateAll(images=>images.every(image=>image.getAttribute('href').includes('/previews/'))));
 assert.ok(await page.locator('.chess-settings img').evaluateAll(images=>images.every(image=>image.src.includes('/previews/'))));
 release();await page.waitForLoadState('networkidle');
 await fs.mkdir('output/chess-loading',{recursive:true});
 await page.screenshot({path:'output/chess-loading/fantasy-previews.png'});
 await page.locator('[data-chess-apply]').click();
 await page.locator('.chess-settings').waitFor({state:'hidden'});
 assert.deepEqual([...new Set(full)].sort(),['/assets/chess/factions/mechs.webp','/assets/chess/factions/robots.webp']);
 assert.equal(await page.locator('.classic-svg .chess-faction-piece').count(),32);
 assert.ok(await page.locator('.classic-svg image').evaluateAll(images=>images.every(image=>!image.getAttribute('href').includes('/previews/'))));
 await page.screenshot({path:'output/chess-loading/selected-armies.png'});
 assert.deepEqual(errors,[]);
 console.log('PASS: stalled previews do not block menu/mode/selection, zero full artwork downloads while browsing, only the two applied armies download, full artwork used on board, no browser errors.');
}finally{release();await browser.close();}
