import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(process.env.OXFORD_PLAYWRIGHT_MODULE?pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE).href:'playwright');
const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4199';
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1366,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const out='output/boozled-tiles';await fs.mkdir(out,{recursive:true});
async function setup(){await page.goto(base+'/?game=english-7-boozled',{waitUntil:'domcontentloaded'});await page.locator('#boozled-continue').click();}
try {
await setup();const defaultTotal=await page.evaluate(()=>draft.items.length+draft.settings.boozledPowerCount);await page.locator('#boozled-surprise-apply').click();assert.equal(await page.evaluate(()=>game.session.deck.length),defaultTotal);
for(const total of [2,8,24,60]){
 await setup();if(total===2)await page.locator('#boozled-surprise-count').selectOption('0');await page.locator('#boozled-tile-count').selectOption(String(total));
 if(total===24)await page.screenshot({path:out+'/setup.png',fullPage:true});
 await page.locator('#boozled-surprise-apply').click();assert.equal(await page.evaluate(()=>game.session.deck.length),total);
 assert.equal(await page.locator('[data-mode-action="boozled-pick"]').count(),total);
 const stats=await page.evaluate(()=>{const q=game.session.deck.filter(c=>c.question!==undefined).map(c=>c.question),counts=game.items.map((_,i)=>q.filter(x=>x===i).length);return {powers:game.session.deck.filter(c=>c.power).length,min:Math.min(...counts),max:Math.max(...counts)};});assert.equal(stats.powers,total===2?0:4);assert.ok(stats.max-stats.min<=1);
 if(total===24)await page.screenshot({path:out+'/board-24.png',fullPage:true});
 if(total===60){await page.setViewportSize({width:390,height:844});await page.screenshot({path:out+'/mobile-60.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.setViewportSize({width:1366,height:900});}
 await page.evaluate(()=>{for(let i=0;i<game.session.deck.length;i++){handleBoozled({dataset:{modeAction:'boozled-pick',card:String(i)}});if(game.session.deck[i].power)handleBoozled({dataset:{modeAction:'boozled-apply'}});else{handleBoozled({dataset:{modeAction:'boozled-reveal'}});handleBoozled({dataset:{modeAction:'boozled-mark',correct:'true'}});}handleBoozled({dataset:{modeAction:'boozled-next'}});}});assert.equal(await page.evaluate(()=>game.done),true);await page.evaluate(()=>finishCelebration());await page.waitForFunction(total=>document.querySelector('#arena').textContent.includes('All '+total+' tiles played'),total);
}
await setup();await page.locator('#boozled-tile-count').selectOption('4');await page.locator('#boozled-surprise-apply').click();assert.match(await page.locator('.boozled-surprise-error').innerText(),/at least one question/);await page.locator('#boozled-tile-count').selectOption('24');await page.locator('#boozled-surprise-apply').click();
await page.evaluate(()=>{const lesson=validateLesson(JSON.parse(JSON.stringify(game.lesson)));openEditor(lesson);});
await page.locator('#save-lesson').click();const id=await page.evaluate(()=>draft.id);await page.reload({waitUntil:'domcontentloaded'});await page.evaluate(id=>(document.querySelector('#boozled-setup').close(),openEditor(saved.find(l=>l.id===id)),show('editor')),id);await page.evaluate(()=>openBoozledSurprises(false));assert.equal(await page.locator('#boozled-tile-count').inputValue(),'24');await page.locator('#boozled-tile-count').selectOption('12');await page.locator('#boozled-surprise-cancel').click();assert.equal(await page.evaluate(()=>draft.settings.boozledTileCount),24);
await page.evaluate(()=>{for(const value of [0,1,61,2.5,'12']){let failed=false;try{boozledSettings({...draft.settings,boozledTileCount:value});}catch{failed=true;}if(!failed)throw Error('Accepted invalid tile count '+value);}});
await page.setViewportSize({width:390,height:844});await page.evaluate(()=>openBoozledSurprises(false));await page.screenshot({path:out+'/mobile-setup.png',fullPage:true});assert.ok(await page.evaluate(()=>document.querySelector('#boozled-surprises').scrollWidth<=document.querySelector('#boozled-surprises').clientWidth+2));assert.deepEqual(errors,[]);console.log('PASS default; 2/8/24/60 tiles; balanced question cycling; completion; validation; JSON/save/reload/cancel; desktop/mobile; no browser errors');
}finally{await browser.close();}


