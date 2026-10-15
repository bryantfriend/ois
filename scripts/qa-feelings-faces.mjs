import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {spawn} from 'node:child_process';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.resolve(root,'../output/feelings-faces-qa');
const playwright=process.env.OXFORD_PLAYWRIGHT_MODULE||'C:/Users/fangb_kyiapn1/.codex/skills/develop-web-game/node_modules/playwright/index.mjs';
const {chromium}=await import(pathToFileURL(playwright));
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.mp3':'audio/mpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost'),file=path.resolve(root,'dist','.'+(url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname)));if(!file.startsWith(path.join(root,'dist')+path.sep)){res.writeHead(403);return res.end();}const body=await fs.readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(body);}catch{res.writeHead(404);res.end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
await fs.mkdir(output,{recursive:true});
let browser;
try{
 // Required skill client, using the same test server/network context as this process.
 if(process.argv.includes('--skill-client')){
  const clientDir=path.join(output,'skill-client-verified');await fs.mkdir(clientDir,{recursive:true});
  await fs.rm(path.join(clientDir,'errors-0.json'),{force:true});
  await new Promise((resolve,reject)=>{const child=spawn(process.execPath,['C:/Users/fangb_kyiapn1/.codex/skills/develop-web-game/scripts/web_game_playwright_client.js','--url',base+'/?game=english-1-emotions','--click-selector','#start-game','--actions-json',JSON.stringify({steps:[{buttons:[],frames:100}]}),'--iterations','1','--pause-ms','3000','--screenshot-dir',clientDir],{stdio:'inherit',env:process.env});child.on('exit',code=>code===0?resolve():reject(Error('Skill client failed '+code)));});
  const clientErrors=await fs.readFile(path.join(clientDir,'errors-0.json'),'utf8').catch(()=>null);assert.equal(clientErrors,null,'Skill client console errors: '+clientErrors);
 }
 browser=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
 const p=await browser.newPage({viewport:{width:1366,height:768}}),errors=[],failures=[];
 p.on('pageerror',e=>errors.push(e.message));
 p.on('response',r=>{if(r.status()>=400)failures.push(r.status()+' '+r.url());});
 const snapshot=()=>p.evaluate(()=>JSON.parse(render_game_to_text()));
 const ff=async()=> (await snapshot()).feelings;
 const click=async(name,value)=>p.locator('[data-ff="'+name+'"]'+(value===undefined?'':'[data-value="'+value+'"]')).first().click();
 const tick=async(ms)=>p.evaluate(ms=>advanceTime(ms),ms);
 const waitQuestion=async()=>p.waitForFunction(()=>game.session.feelings.phase==='question',null,{timeout:12000});
 const capture=async(name)=>{await p.screenshot({path:path.join(output,name+'.png'),fullPage:true});await fs.writeFile(path.join(output,name+'.json'),JSON.stringify(await snapshot(),null,2));};
 await p.goto(base+'/?game=english-1-emotions');await p.locator('#start-game').click();
 await waitQuestion();await capture('desktop');
 console.log('Initial:',JSON.stringify(await ff()));
 assert.equal(await p.evaluate(()=>ClassroomVoice.lastBackend),'natural-recorded');
 assert.equal(await p.evaluate(()=>ClassroomVoice.has('Can you find calm?')),true);
 const missingLines=await p.evaluate(()=>Object.values(FEELINGS_LINES).flatMap(templates=>templates.flatMap(template=>Object.keys(PR_FEEL).map(word=>template.replace('{feeling}',word)))).filter(text=>!ClassroomVoice.has(text)));
 assert.deepEqual(missingLines,[],'All 144 question/praise combinations have natural recordings');
 assert.equal((await ff()).total,12);
 if(process.argv.includes('--preview-only')){console.log('Preview complete');process.exitCode=0;}
 else{
  // Real recorded feedback must finish before the next scene advances.
  let spoken=await ff();await click('answer',spoken.choices.indexOf(spoken.target));
  assert.equal((await ff()).phase,'celebrating');await p.waitForTimeout(600);assert.equal((await ff()).round,1);
  await p.waitForFunction(()=>game.index===1&&game.session.feelings.phase==='question',null,{timeout:14000});
  // Restart freezes the scene while its confirmation is open, then resets cleanly.
  await p.locator('#restart').click();await p.waitForFunction(()=>game.session.feelings.paused);
  assert.equal(await p.evaluate(()=>ClassroomVoice.playing),false);await p.locator('#confirm-cancel').click();await p.waitForFunction(()=>!game.session.feelings.paused);
  await p.locator('#restart').click();await p.locator('#confirm-ok').click();await waitQuestion();assert.equal((await ff()).round,1);assert.equal((await snapshot()).correct,0);
  // From here mute to make deterministic scene checks independent of audio duration.
  await click('mute');await p.evaluate(()=>{arcade.manual=true;});
  const questionVariations=[],correctVariations=[];
  let z=await ff();assert.equal(z.curtainsOpen,1);assert.equal(new Set(z.choices).size,6);assert.ok(z.choices.includes(z.target));
  assert.equal(await p.locator('.ff-prompt h2').innerText(),z.questionText);
  await click('listen');assert.equal((await ff()).questionText,z.questionText,'Replay preserves the wording');
  const wrong=z.choices.findIndex(x=>x!==z.target);await click('answer',wrong);
  assert.equal((await snapshot()).correct,0);assert.equal((await ff()).phase,'question');assert.equal(await p.locator('.ff-try-again').count(),1);
  // Character change is covered by closed curtains; it does not score or skip the question.
  await click('friend',1);assert.equal((await ff()).phase,'closing');await tick(350);await capture('curtains-closing');assert.ok((await ff()).curtainsOpen>0&&(await ff()).curtainsOpen<1);
  await click('pause');const paused=await ff();await tick(2000);assert.equal((await ff()).curtainsOpen,paused.curtainsOpen);await capture('paused');await click('pause');
  await tick(400);assert.equal((await ff()).phase,'closed');assert.equal((await ff()).friend,'Kalpak boy');await capture('curtains-closed');
  await p.waitForFunction(()=>game.session.feelings.imagesReady);await tick(200);await tick(700);await waitQuestion();await capture('kalpak');
  assert.equal((await ff()).round,1);assert.equal((await snapshot()).correct,0);
  // Every character and every generated portrait loads successfully.
  for(const [i,id] of ['hijab-girl','kalpak-boy','football-boy','everyday-girl','snow-leopard'].entries()){
   if((await ff()).fixedFriend!==i){await click('friend',i);await tick(700);await p.waitForFunction(()=>game.session.feelings.imagesReady);await tick(200);await tick(700);await waitQuestion();}
   const art=await p.evaluate(async id=>{const words=Object.keys(PR_FEEL);return Promise.all(words.map(word=>new Promise(resolve=>{const im=new Image();im.onload=()=>resolve({word,width:im.naturalWidth,height:im.naturalHeight});im.onerror=()=>resolve({word,width:0});im.src='./assets/feelings-faces/'+id+'/'+word+'.webp';})));},id);
   assert.equal(art.length,12);assert.ok(art.every(x=>x.width>=300&&x.height>=300),id+' portraits');
   await capture(id);
  }
  await click('friend','mix');await tick(700);await p.waitForFunction(()=>game.session.feelings.imagesReady);await tick(200);await tick(700);await waitQuestion();
  // Success -> confetti -> closing -> fully closed -> new round -> opening -> playable.
  z=await ff();questionVariations.push(z.questionVariation);await click('answer',z.choices.indexOf(z.target));correctVariations.push((await ff()).correctVariation);assert.equal(await p.locator('.ff-message').innerText(),(await ff()).correctText);await tick(200);await p.waitForTimeout(550);await capture('confetti');assert.equal((await ff()).phase,'celebrating');
  const count=(await snapshot()).correct;await p.keyboard.press('1');assert.equal((await snapshot()).correct,count);
  await tick(1600);assert.equal((await ff()).phase,'closing');await tick(700);assert.equal((await ff()).phase,'closed');assert.equal((await ff()).round,2);await capture('next-round-closed');
  await p.waitForFunction(()=>game.session.feelings.imagesReady);await tick(200);await tick(700);await waitQuestion();assert.equal((await ff()).friend,'Kalpak boy');
  // Mobile and smartboard layouts: all six answers fit within the viewport.
  for(const [width,height] of [[390,844],[768,1024],[1024,600],[1920,1080]]){
   await p.setViewportSize({width,height});
   const wording=await p.evaluate(()=>{const f=game.session.feelings,previous=[f.questionTemplate,f.questionText];f.questionTemplate=FEELINGS_LINES.questions.reduce((a,b)=>a.length>b.length?a:b);f.questionText=f.questionTemplate.replace('{feeling}',current().answer);renderGame();return previous;});
   await p.waitForTimeout(100);await capture('layout-'+width+'x'+height);
   const bounds=await p.locator('.ff-card').evaluateAll(cards=>cards.map(el=>{const b=el.getBoundingClientRect();return {left:b.left,right:b.right,top:b.top,bottom:b.bottom,width:b.width,height:b.height};}));
   assert.ok(bounds.every(b=>b.width>=75&&b.height>=65&&b.left>=0&&b.right<=width&&b.top>=0&&b.bottom<=height),JSON.stringify({width,height,bounds}));
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow');
   await p.evaluate(([template,text])=>{const f=game.session.feelings;f.questionTemplate=template;f.questionText=text;renderGame();},wording);
  }
  await p.setViewportSize({width:1366,height:768});
  // Complete all twelve feelings, including transitions for the final curtain reveal.
  while(!(await snapshot()).view.includes('result')){
   z=await ff();assert.equal(z.phase,'question');questionVariations.push(z.questionVariation);assert.equal(await p.locator('.ff-prompt h2').innerText(),z.questionText);await p.keyboard.press(String(z.choices.indexOf(z.target)+1));correctVariations.push((await ff()).correctVariation);await tick(1700);await tick(700);
   if(await p.evaluate(()=>game.done)){await tick(700);break;}
   await p.waitForFunction(()=>game.session.feelings.imagesReady);await tick(200);await tick(700);await waitQuestion();
  }
  assert.equal((await snapshot()).correct,12);assert.equal((await ff()).phase,'complete');await capture('complete');
  for(const variations of [questionVariations,correctVariations]){assert.equal(variations.length,12);assert.equal(new Set(variations.slice(0,6)).size,6);assert.equal(new Set(variations.slice(6)).size,6);assert.ok(variations.every((value,i)=>i===0||value!==variations[i-1]),'No consecutive repeated wording');}
  await p.locator('[data-replay]').click();await click('mute');await p.evaluate(()=>{arcade.manual=true;});await p.waitForFunction(()=>game.session.feelings.imagesReady);await tick(200);await tick(700);await waitQuestion();assert.equal((await snapshot()).correct,0);assert.equal((await ff()).round,1);
  // Reduced motion keeps the sequence, with short transitions and static confetti.
  await p.evaluate(()=>{arcade.reduced=true;});z=await ff();await click('answer',z.choices.indexOf(z.target));await capture('reduced-motion');await tick(700);await tick(150);await p.waitForFunction(()=>game.session.feelings.imagesReady);await tick(200);await tick(150);await waitQuestion();
  // Navigate away mid-transition; narration and game UI must stop cleanly.
  await click('mute');await click('listen');await p.locator('#edit-again').click();await tick(5000);assert.equal(await p.evaluate(()=>ClassroomVoice.playing),false);assert.equal(await p.locator('#player').evaluate(el=>el.classList.contains('feelings-player')),false);
  // Another primary activity still uses the existing engine.
  await p.evaluate(()=>{openEditor(findLesson('math-1-blocks'));startGame();});assert.equal(await p.locator('.pr-grid.nine button').count(),9);assert.equal(await p.locator('.ff-book').count(),0);
  console.log('PASS: 60 portraits, narration, retries, character changes, curtains, confetti, input locks, pause, mute, layouts, 12-round completion, replay, reduced motion, navigation and primary regression.');
 }
 assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
