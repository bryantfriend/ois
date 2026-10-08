import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from 'file:///C:/Users/fangb_kyiapn1/.codex/skills/develop-web-game/node_modules/playwright/index.mjs';
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1366,height:768}});const errors=[];page.on('pageerror',e=>errors.push(e.stack));
await fs.mkdir('output/cell',{recursive:true});
try{
await page.goto('http://127.0.0.1:4174');
const packs=await page.evaluate(()=>GAMES.filter(g=>g.format==='diagram').map(g=>g.id));assert.ok(packs.length);
await fs.writeFile('output/cell/pack-id.txt',packs[0]);
for(const id of packs){
 await page.goto('http://127.0.0.1:4174/?game='+id);await page.locator('#start-game').click();await page.locator('[data-mode-action="act-cell-pick-type"][data-cell-type="animal"]').click();await page.locator('[data-mode-action="act-cell-begin"][data-level="easy"]').click();
 assert.equal(await page.locator('#arena .act-cell-art').count(),1);assert.equal(await page.locator('#arena button.act-marker').count(),6);
 await page.locator('[data-mode-action="act-cell-motion"]').click();assert.equal(await page.locator('#arena .act-cell-paused').count(),1);assert.equal(await page.locator('#arena .act-cell-drift').first().evaluate(e=>getComputedStyle(e).animationPlayState),'paused');
 await page.locator('[data-mode-action="act-cell-motion"]').click();assert.equal(await page.locator('#arena .act-cell-drift').first().evaluate(e=>getComputedStyle(e).animationPlayState),'running');
 await page.screenshot({path:'output/cell/desktop.png'});
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('#arena .act-cell-drift').first().evaluate(e=>getComputedStyle(e).animationName),'none');await page.emulateMedia({reducedMotion:'no-preference'});
 await page.evaluate(()=>document.body.classList.add('still-games'));assert.equal(await page.locator('#arena .act-cell-drift').first().evaluate(e=>getComputedStyle(e).animationName),'none');await page.evaluate(()=>document.body.classList.remove('still-games'));
 for(const size of [{width:1920,height:1080},{width:390,height:844}]){await page.setViewportSize(size);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:`output/cell/${size.width}.png`});}
 await page.setViewportSize({width:1366,height:768});
 while(!await page.evaluate(()=>game.done)){if(await page.evaluate(()=>game.session.phase==='feedback'))await page.locator('[data-mode-action="act-next"]').click();else {const index=await page.evaluate(()=>game.index);await page.locator(`[data-mode-action="act-diagram"][data-value="${index}"]`).click();}}
 assert.equal(await page.evaluate(()=>game.correct),6);console.log('PASS diagram playthrough '+id);
}
await page.goto('http://127.0.0.1:4174/?game='+packs[0]);await page.locator('#start-game').click();await page.locator('[data-mode-action="act-cell-pick-type"][data-cell-type="animal"]').click();await page.locator('[data-mode-action="act-cell-begin"][data-level="easy"]').click();
await page.evaluate(()=>{game.lesson.settings.diagramImage='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a5ioAAAAASUVORK5CYII=';renderGame();});assert.equal(await page.locator('#arena .act-diagram img').count(),1);assert.equal(await page.locator('[data-mode-action="act-cell-motion"]').count(),0);
assert.deepEqual(errors,[]);console.log('PASS motion controls, reduced motion, global motion off, sizes, custom image, no browser errors');
}finally{await browser.close();}



