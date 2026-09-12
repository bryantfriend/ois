import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(process.env.OXFORD_PLAYWRIGHT_MODULE?pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE).href:'playwright');
const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4174';
await fs.mkdir('output/qa',{recursive:true});
const context=vm.createContext({});
vm.runInContext(await fs.readFile('dist/catalog.js','utf8')+';globalThis.catalog=GAMES;',context);
const catalog=JSON.parse(JSON.stringify(context.catalog));
assert.equal(catalog.length,56);
for(const subject of ['english','math'])for(const grade of [7,8])assert.equal(catalog.filter(x=>x.subject===subject&&x.grade===grade).length,14);
assert.equal(new Set(catalog.map(x=>x.id)).size,56);
const browser=await chromium.launch({headless:true});
const ctx=await browser.newContext({viewport:{width:1440,height:1050},acceptDownloads:true});
const page=await ctx.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
page.on('dialog',d=>d.accept());
const state=()=>page.evaluate(()=>JSON.parse(window.render_game_to_text()));
async function open(id){await page.goto(`${base}/?game=${id}`);if(await page.locator('#boozled-setup[open]').count()){await page.locator('[data-boozled-count="4"]').click();await page.locator('#boozled-edit-questions').click();}await page.locator('#start-game').click();assert.equal((await state()).view,'playing');}
async function answerRound(lesson,correct=true){
 const s=await state();
 if(lesson.format==='boozled'){await page.locator('[data-mode-action="boozled-pick"]:not([disabled])').first().click();if(await page.locator('[data-mode-action="boozled-reveal"]').count()){await page.locator('[data-mode-action="boozled-reveal"]').click();await page.locator('[data-correct="true"]').click();}else await page.locator('[data-mode-action="boozled-apply"]').click();await page.locator('[data-mode-action="boozled-next"]').click();return;}
 if(['kingdom','corners','earth'].includes(lesson.format)){
  const choice=await page.evaluate(()=>game.choices.indexOf(current().answer));
  if(lesson.format==='kingdom'){for(let i=0;i<s.session.groups.length;i++){await page.locator('#answer-group-'+i).selectOption(String(choice));await page.locator('[data-mode-action="lock"][data-group="'+i+'"]').click();}await page.locator('[data-mode-action="reveal"]').click();for(let i=0;i<s.session.groups.length;i++)await page.locator('[data-investment="save"][data-group="'+i+'"]').click();}
  else {if(lesson.format==='earth')await page.locator('[data-mode-action="choose"][data-choice="'+choice+'"]').click();await page.locator('[data-mode-action="reveal"]').click();}
  await page.locator('[data-mode-action="next"]').click();return;
 }
 if(['tug','relay','board'].includes(lesson.format)){const side=lesson.format==='board'&&s.tugPlayers[0].attempts>=lesson.items.length?1:0;await page.waitForFunction(i=>!game.tug[i].locked,side);const p=(await state()).tugPlayers[side],q=lesson.items.find(q=>q.prompt===p.question),n=p.choices.findIndex(a=>correct?a===q.answer:a!==q.answer);await page.locator(`[data-player="${side}"][data-tug-answer="${n}"]`).click();return;}
 if(lesson.format==='match'){
  const ids=await page.locator('[data-left]:not([disabled])').evaluateAll(nodes=>nodes.map(n=>n.dataset.left));
  for(const id of ids){await page.locator(`[data-left="${id}"]`).click();await page.locator(`[data-right="${id}"]`).click();}return;
 }
 if(lesson.format==='board')await page.locator('[data-board]:not([disabled])').first().click();
 if(lesson.format==='order'){
  const count=await page.locator('[data-tile]').count();const ids=Array.from({length:count},(_,i)=>i);if(!correct)ids.reverse();
  for(const id of ids)await page.locator(`[data-tile="${id}"]`).click();await page.locator('[data-check]').click();
 }else if(['board','clue'].includes(lesson.format)){
  await page.locator('[data-reveal]').click();await page.locator(`[data-mark="${correct}"]`).click();
 }else{
  if(lesson.format==='wager')await page.locator('[data-wager="100"]').click();
  const question=(await state()).question;const item=lesson.items.find(x=>x.prompt===question);
  const choices=await page.locator('[data-answer]').allTextContents();
  const selected=choices.findIndex(x=>correct?x.trim().slice(1)===item.answer:x.trim().slice(1)!==item.answer);
  assert.ok(selected>=0,`Find answer: ${question}`);await page.locator('[data-answer]').nth(selected).click();
 }
 assert.equal((await state()).answered,true);await page.locator('[data-next]').click();
}
try{
 await page.goto(base);
 assert.equal(await page.locator('.game-card').count(),53);
 assert.equal(await page.locator('.brand img').evaluate(img=>img.complete&&img.naturalWidth>0),true);
 await page.screenshot({path:'output/qa/library-desktop.png',fullPage:false});
 await page.locator('[data-subject-group="language"] summary').click();await page.locator('[data-subject="english"]').click();assert.equal(await page.locator('.game-card').count(),27);
 await page.locator('[data-grade="8"]').click();assert.equal(await page.locator('.game-card').count(),27);
 await page.locator('#search').fill('Paragraph');assert.equal(await page.locator('.game-card').count(),1);
 await page.locator('#reset').click();assert.equal(await page.locator('.game-card').count(),106);
 await page.locator('[data-subject="russian"]').click();assert.equal(await page.locator('#empty').isVisible(),true);
 await page.locator('[data-subject="kyrgyz"]').click();assert.equal(await page.locator('#empty').isVisible(),true);
 const summary=[];
 for(const lesson of catalog){
  await open(lesson.id);let rounds=0;
  while((await state()).view!=='result'){await answerRound(lesson,true);assert.ok(++rounds<=40);}
  const s=await state();assert.equal(s.correct,lesson.format==='corners'?0:lesson.format==='kingdom'?lesson.items.length*4:lesson.format==='tug'?3:lesson.format==='board'?lesson.items.length*2:lesson.items.length,lesson.id);assert.equal(s.attempts,lesson.format==='kingdom'?lesson.items.length*4:lesson.format==='tug'?3:lesson.format==='board'?lesson.items.length*2:lesson.items.length,lesson.id);
  if(['quiz','sort','order','clue','survival'].includes(lesson.format))assert.ok(s.score>=600,lesson.id);
  if(lesson.format==='wager')assert.equal(s.score,900);
  summary.push({id:lesson.id,score:s.score,correct:s.correct});
 }
 // All incorrect survival answers consume exactly three lives and end the round.
 const survival=catalog.find(x=>x.id==='math-7-survival');await open(survival.id);
 for(let i=0;i<3;i++)await answerRound(survival,false);assert.equal((await state()).view,'result');assert.equal((await state()).lives,0);
 // Only one scoring event is allowed per answered question.
 await open('math-7-tug');await answerRound(catalog.find(x=>x.id==='math-7-tug'));const first=await state();assert.equal(first.teams[0],1);assert.equal(first.rope,-1);assert.equal(first.tugPlayers[0].locked,true);assert.equal(first.tugPlayers[1].locked,false);
 // Win by pulling three steps to one side.
 await open('math-7-tug');for(const correct of [true,false,true,false,true])await answerRound(catalog.find(x=>x.id==='math-7-tug'),correct);assert.equal((await state()).view,'result');assert.equal((await state()).rope,-3);
 // Matching error, recovery, and result.
 await open('english-7-match');await page.locator('[data-left="0"]').click();await page.locator('[data-right="1"]').click();assert.equal((await state()).matched.length,0);assert.equal((await state()).attempts,1);await answerRound(catalog.find(x=>x.id==='english-7-match'));assert.equal((await state()).score,580);
 // Sequence undo and clear, then an incorrect response.
 await open('math-8-order');await page.locator('[data-tile="1"]').click();await page.locator('[data-undo]').click();assert.deepEqual((await state()).selected,[]);await page.locator('[data-tile="2"]').click();await page.locator('[data-clear]').click();assert.deepEqual((await state()).selected,[]);await answerRound(catalog.find(x=>x.id==='math-8-order'),false);assert.equal((await state()).score,0);
 // Hint discount and wager loss.
 await open('english-8-clue');await page.locator('[data-hint]').click();await answerRound(catalog.find(x=>x.id==='english-8-clue'));assert.equal((await state()).score,50);
 await open('math-8-wager');await answerRound(catalog.find(x=>x.id==='math-8-wager'),false);assert.equal((await state()).score,200);
 // Teacher edit, paste, save, reload, import, export, and custom game launch.
 await page.goto(`${base}/?game=math-7-quiz`);
 await page.locator('#lesson-title').fill('My Kyrgyz lesson <script>');
 await page.locator('#lesson-subject').selectOption('kyrgyz');
 await page.locator('[data-row="0"] [data-field="prompt"]').fill('Салам! 2 + 2 = ?');
 await page.locator('[data-row="0"] [data-field="answer"]').fill('4');
 await page.locator('[data-row="0"] [data-field="options"]').fill('3\n5\n6');
 await page.locator('#paste-toggle').click();await page.locator('#bulk-input').fill('What is 9 + 1?\t10\t8; 9; 11\tAdd one.');await page.locator('#bulk-add').click();assert.equal(await page.locator('[data-row]').count(),7);
 await page.locator('#save-lesson').click();await page.reload();
 await page.locator('[data-action="saved"]').click();assert.equal(await page.locator('.game-card').count(),1);assert.equal(await page.locator('.game-card script').count(),0);
 await page.locator('[data-edit]').click();assert.equal(await page.locator('#lesson-title').inputValue(),'My Kyrgyz lesson <script>');assert.equal(await page.locator('[data-row]').count(),7);
 const downloadPromise=page.waitForEvent('download');await page.locator('#download-lesson').click();const download=await downloadPromise;await download.saveAs('output/qa/custom-lesson.json');
 const downloaded=JSON.parse(await fs.readFile('output/qa/custom-lesson.json','utf8'));assert.equal(downloaded.lesson.subject,'kyrgyz');assert.equal(downloaded.lesson.items[0].answer,'4');
 await page.locator('#start-game').click();assert.equal((await state()).question,'Салам! 2 + 2 = ?');assert.equal((await state()).lesson,'My Kyrgyz lesson <script>');
 await page.locator('#edit-again').click();await page.locator('[data-row="0"] [data-field="answer"]').fill('');await page.locator('#start-game').click();assert.equal(await page.locator('#editor').isVisible(),true);assert.match(await page.locator('#toast').textContent(),/Answer 1 is required/);
 await page.locator('[data-row="0"] [data-field="answer"]').fill('4');await page.locator('#download-lesson').click();
 await page.locator('#import-file').setInputFiles('output/qa/custom-lesson.json');assert.equal(await page.locator('#lesson-subject').inputValue(),'kyrgyz');assert.equal(await page.locator('[data-row]').count(),7);
 await page.locator('#save-lesson').click();
 await page.screenshot({path:'output/qa/editor-desktop.png',fullPage:false});
 // Malformed imports must not replace the valid draft.
 await page.locator('#import-file').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({schemaVersion:1,lesson:{title:'Bad',format:'__proto__'}}))});assert.equal(await page.locator('#lesson-title').inputValue(),'My Kyrgyz lesson <script>');
 // Invalid mapping and unsupported data never mutate the saved lesson.
 const invalid=await page.evaluate(()=>{try{validateLesson({title:'x',topic:'x',subject:'english',grade:7,format:'match',items:[{prompt:'a',answer:'same',options:[]},{prompt:'b',answer:'same',options:[]}]});return false;}catch{return true;}});assert.equal(invalid,true);
 // Responsive library, editor and classroom game screenshots.
 await page.goto(base);await page.setViewportSize({width:390,height:844});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true);await page.screenshot({path:'output/qa/library-mobile.png',fullPage:false});
 await page.goto(`${base}/?game=english-8-order`);await page.screenshot({path:'output/qa/editor-mobile.png',fullPage:false});await page.locator('#start-game').click();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true);await page.screenshot({path:'output/qa/order-mobile.png',fullPage:false});
 await page.setViewportSize({width:1440,height:1050});await open('math-8-tug');await page.screenshot({path:'output/qa/tug-desktop.png',fullPage:false});
 await open('english-8-match');await page.screenshot({path:'output/qa/match-desktop.png',fullPage:false});
 assert.deepEqual(errors,[]);await fs.writeFile('output/qa/results.json',JSON.stringify({passed:true,lessons:summary,consoleErrors:errors},null,2));console.log('PASS: all 56 original lessons completed; failure paths, custom edit/save/reload/import/export, and responsive checks passed.');
}finally{await browser.close();}
