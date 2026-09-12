import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(process.env.OXFORD_PLAYWRIGHT_MODULE?pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE).href:'playwright');
const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4174';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1365,height:1000}});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
const state=()=>page.evaluate(()=>JSON.parse(window.render_game_to_text()));
try{
 await page.goto(`${base}/?game=math-7-quiz`);
 assert.equal(await page.evaluate(()=>GAMES.map(validateLesson).length),106);
 await page.locator('#paste-toggle').click();
 await page.locator('#bulk-input').fill('What is 3 + 3?\t6\t4; 5; 7\tAdd three.\nWhat is 4 + 4?\t8\t6; 7; 9');
 await page.locator('#bulk-replace').click();assert.equal(await page.locator('#confirm').isVisible(),true);
 await page.locator('#confirm-cancel').click();assert.equal(await page.locator('[data-row]').count(),6);
 await page.locator('#bulk-replace').click();await page.locator('#confirm-ok').click();assert.equal(await page.locator('[data-row]').count(),2);
 await page.locator('#lesson-title').fill('A quick warm-up');await page.locator('#play-bottom').click();assert.equal((await state()).question,'What is 3 + 3?');
 // Unsaved custom work is protected even when leaving the game screen.
 await page.locator('.header [data-action="library"]').click();assert.equal(await page.locator('#confirm').isVisible(),true);await page.locator('#confirm-cancel').click();assert.equal((await state()).view,'playing');
 await page.locator('[data-answer]').filter({hasText:/^[A-F]6$/}).click();assert.equal((await state()).score,100);
 await page.locator('#restart').click();await page.locator('#confirm-cancel').click();assert.equal((await state()).score,100);
 await page.locator('#restart').click();await page.locator('#confirm-ok').click();assert.equal((await state()).score,0);
 await page.locator('#fullscreen').click();await page.waitForFunction(()=>!!document.fullscreenElement);await page.locator('#fullscreen').click();await page.waitForFunction(()=>!document.fullscreenElement);
 await page.locator('#edit-again').click();await page.locator('#save-lesson').click();
 // Custom spoken answers work without distractors.
 await page.locator('[data-row="0"] [data-field="options"]').fill('');await page.locator('#play-bottom').click();assert.equal(await page.locator('[data-answer]').count(),0);await page.locator('[data-reveal]').click();assert.equal((await state()).modelAnswer,'6');await page.locator('[data-mark="true"]').click();assert.equal((await state()).score,100);
 await page.locator('#edit-again').click();await page.locator('#save-lesson').click();
 // Removing one question is reversible via Cancel, and validates minimum deck size.
 await page.locator('[data-remove="1"]').click();await page.locator('#confirm-cancel').click();assert.equal(await page.locator('[data-row]').count(),2);
 await page.locator('[data-remove="1"]').click();await page.locator('#confirm-ok').click();await page.locator('#play-bottom').click();assert.match(await page.locator('#toast').textContent(),/between 2 and 40/);
 await page.locator('#add-question').click();assert.equal(await page.locator('[data-row]').count(),2);
 await page.locator('[data-row="1"] [data-field="prompt"]').fill('Five plus five?');await page.locator('[data-row="1"] [data-field="answer"]').fill('10');await page.locator('#save-lesson').click();
 // Final mobile progress screenshot, and keyboard-driven choice.
 await page.goto(`${base}/?game=english-8-order`);await page.setViewportSize({width:390,height:844});await page.locator('#start-game').click();await page.locator('[data-tile="0"]').focus();await page.keyboard.press('Enter');assert.deepEqual((await state()).selected,[0]);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true);await page.screenshot({path:'output/qa/order-mobile-final.png',fullPage:true});
 // At 200% text size, core layout remains free of horizontal document overflow.
 await page.goto(base);await page.setViewportSize({width:1440,height:1000});await page.addStyleTag({content:'html{font-size:200%}'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true);
 // Tools register via supported modelContext, using the same UI filter action.
 const toolsContext=await browser.newContext();await toolsContext.addInitScript(()=>{Object.defineProperty(document,'modelContext',{value:{registerTool(tool){window.registeredOxfordTool=tool;}}});});const toolPage=await toolsContext.newPage();await toolPage.goto(base);
 const toolResult=await toolPage.evaluate(async()=>{const tool=window.registeredOxfordTool;const result=await tool.execute({grade:8,subject:'math'});let invalid=false;try{await tool.execute({grade:99,subject:'math'});}catch{invalid=true;}return {name:tool.name,result,invalid,visible:document.querySelector('#results').textContent};});
 assert.equal(toolResult.name,'filter_classroom_games');assert.equal(toolResult.result.summary,'26 lessons · Grade 8');assert.equal(toolResult.visible,'26 lessons · Grade 8');assert.equal(toolResult.invalid,true);await toolsContext.close();
 assert.deepEqual(errors,[]);await fs.writeFile('output/qa/teacher-results.json',JSON.stringify({passed:true,checks:['paste replacement and cancel','custom lesson launch','unsaved work protection','restart and cancel','fullscreen','spoken answer fallback','question add/remove validation','keyboard control','mobile overflow','WebMCP contract'],consoleErrors:errors},null,2));console.log('PASS: focused teacher workflow, custom play, fullscreen, keyboard, responsive and tool contract checks.');
}finally{await browser.close();}
