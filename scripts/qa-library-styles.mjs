import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE).href);
const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4199';
page.on('pageerror',e=>errors.push(e.stack));
page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
try{
 await fs.mkdir('output/library-styles',{recursive:true});await page.goto(base);await page.waitForFunction(()=>document.body.classList.contains('style-browser'));
 const inventory=await page.evaluate(()=>({groups:gameStyleGroups().length,examples:gameStyleGroups().reduce((n,s)=>n+s.examples.length,0),active:GAMES.filter(g=>!geoIsArchived(g)&&!LAB_GAMES[g.format]?.archived).length}));
 assert.equal(inventory.examples,inventory.active);assert.ok(inventory.groups<inventory.active);
 assert.equal(await page.locator('#grades').isVisible(),false);assert.equal(await page.locator('.style-card').count(),24);
 const keys=[];
 for(;;){keys.push(...await page.locator('[data-style-key]').evaluateAll(cards=>cards.map(c=>c.dataset.styleKey)));const next=page.locator('#style-pages button').last();if(await next.isDisabled())break;await next.click();}
 assert.equal(keys.length,inventory.groups);assert.equal(new Set(keys).size,keys.length);
 await page.locator('#reset').click();assert.equal(await page.locator('[data-style-key]').first().getAttribute('data-style-key'),'airplane');await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'output/library-styles/desktop.png'});
 for(const category of ['quiz','words','strategy','puzzles','create','explore','ice']){
  await page.locator(`[data-style-category="${category}"]`).click();assert.ok(await page.locator('.style-card').count()>0,category);
  assert.ok(await page.evaluate(category=>[...document.querySelectorAll('[data-style-key]')].every(card=>gameStyleGroups().find(s=>s.key===card.dataset.styleKey).category===category),category));
 }
 await page.locator('#reset').click();await page.locator('#search').fill('Supermarket');assert.equal(await page.locator('.style-card').count(),1);
 await page.locator('[data-style-open]').click();assert.equal(await page.locator('#style-example option').count(),3);await page.locator('[data-style-close]').click();
 await page.locator('#search').fill('Tug of War');await page.locator('[data-style-open]').click();assert.ok(await page.locator('#style-example option').count()>1);
 const option=await page.locator('#style-example option').last().getAttribute('value');await page.locator('#style-example').selectOption(option);await page.locator('[data-style-customise]').click();
 assert.equal(await page.evaluate(()=>draft.id),option);assert.equal(await page.locator('#editor').isVisible(),true);
 const original=await page.evaluate(id=>JSON.stringify(GAMES.find(g=>g.id===id)),option);
 if(!await page.locator('#lesson-title').isVisible())await page.locator('#lesson-editor-toggle').click();await page.locator('#lesson-title').fill('My adaptable game');await page.locator('#lesson-grade').selectOption('5');await page.locator('#save-lesson').click();
 assert.equal(await page.evaluate(id=>JSON.stringify(GAMES.find(g=>g.id===id)),option),original);
 await page.locator('.header [data-action="saved"]').click();assert.equal(await page.locator('#games h3').innerText(),'My adaptable game');assert.equal(await page.locator('#grades').isVisible(),true);
 await page.locator('[data-edit]').click();assert.equal(await page.locator('#lesson-grade').inputValue(),'5');
 await page.locator('.header [data-action="library"]').click();await page.locator('#reset').click();
 await page.locator('#search').fill('Starbridge');assert.equal(await page.locator('.style-card').count(),1);await page.locator('[data-play]').click();await page.waitForFunction(()=>ui.view==='player');
 assert.equal(await page.evaluate(()=>game.lesson.id),'math-7-quiz');await page.locator('#game-home').click();
 await page.locator('#reset').click();await page.locator('#players').selectOption('two');assert.ok(await page.evaluate(()=>[...document.querySelectorAll('[data-style-key]')].every(card=>gameStyleGroups().find(s=>s.key===card.dataset.styleKey).examples.some(g=>playerModes(g.format).includes('two')))));
 await page.locator('#reset').click();await page.locator('#search').fill('nothing-will-match-this');assert.equal(await page.locator('#empty').isVisible(),true);await page.locator('#reset').click();
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'output/library-styles/mobile.png'});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.locator('#search').fill('chess');await page.locator('[data-style-open]').first().click();await page.screenshot({path:'output/library-styles/details-mobile.png'});assert.ok(await page.evaluate(()=>document.querySelector('#game-style-dialog').getBoundingClientRect().right<=innerWidth));await page.keyboard.press('Escape');assert.equal(await page.locator('#game-style-dialog').isVisible(),false);
 assert.deepEqual(errors,[]);console.log('PASS',JSON.stringify(inventory),'unique styles across all pages, categories, search, modes, language variants, example selection, editor/save preservation, quick play, empty state, mobile, keyboard close, no browser errors.');
}finally{await browser.close();}
