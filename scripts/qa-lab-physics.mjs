import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {chromium} from 'file:///C:/Users/fangb_kyiapn1/.codex/skills/develop-web-game/node_modules/playwright/index.mjs';
const b=await chromium.launch(),p=await b.newPage({viewport:{width:1366,height:768}}),errors=[];p.on('pageerror',e=>errors.push(e.message));const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4188',answers=JSON.parse(await fs.readFile('scripts/lab-physics-solutions.json','utf8'));
const btn=(a,n)=>p.locator('[data-mode-action="lab-'+a+'"]'+(n===undefined?'':'[data-value="'+n+'"]'));
async function inputs(a){await p.evaluate(a=>{for(const [id,key] of [['lab-launch-speed','speed'],['lab-launch-angle','angle'],['lab-mass','mass']]){const el=document.getElementById(id);if(el){el.value=String(a[key]);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}}},a);}
async function draw(a){for(let i=0;i<a.lines.length;i++){await p.locator('[data-mode-action="lab-material"][data-material="'+a.materials[i]+'"]').click();const pts=await p.locator('#lab-physics').evaluate((svg,line)=>line.map(([x,y])=>{const q=new DOMPoint(x,y).matrixTransform(svg.getScreenCTM());return {x:q.x,y:q.y};}),a.lines[i]);await p.mouse.move(pts[0].x,pts[0].y);await p.mouse.down();for(const q of pts.slice(1))await p.mouse.move(q.x,q.y,{steps:20});await p.mouse.up();}}
try{
 await fs.mkdir('output/physics80/qa',{recursive:true});await p.goto(base+'/?game=math-3-lab-drawsome');await p.locator('#start-game').click();assert.equal(await p.locator('.lab-tier-card').count(),4);assert.deepEqual(await p.locator('.lab-tier-card small').allTextContents(),Array(4).fill('20 puzzles · 0 solved'));await p.evaluate(()=>{arcade.manual=true;});await p.screenshot({path:'output/physics80/qa/menu.png'});
 for(let tier=0;tier<4;tier++){
  await btn('tier',tier).click();assert.equal(await p.locator('#lab-level-select option').count(),20);
  for(let level=0;level<20;level++){
   const a=answers[tier*20+level];if(process.env.OXFORD_PUZZLE_ID&&a.id!==Number(process.env.OXFORD_PUZZLE_ID)){await p.locator('#lab-level-select').selectOption(String(a.id));continue;}
   await p.locator('#lab-level-select').selectOption(String(a.id));await inputs(a);await draw(a);const d=await p.evaluate(()=>game.session.data);assert.equal(d.lines.length,a.lines.length,'lines '+a.id);assert.ok(d.ink<=d.inkLimit,'ink '+a.id);
   await btn('prediction',d.science.correct).click();await btn('release').click();await p.evaluate(()=>{advanceTime(10000);advanceTime(10000);advanceTime(1000);});
   const result=await p.evaluate(()=>({id:game.session.data.id,result:game.session.data.result,ball:game.session.data.ball,stars:game.session.data.collected,lines:game.session.data.lines,bounces:game.session.data.bounces}));assert.ok(result.result?.success,JSON.stringify(result));
   assert.match(await p.locator('.lab-physics-debrief').textContent(),/prediction matched/);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   if([0,3,6,8,10,13,16,17,19].includes(level)){await p.screenshot({path:'output/physics80/qa/result-'+a.id+'.png'});}
   console.log('PASS '+a.id+' real drawing / controls / physics / debrief');
  }
  await btn('physics-menu').click();
 }
 if(!process.env.OXFORD_PUZZLE_ID){assert.equal(await p.evaluate(()=>game.session.completed.length),80);assert.equal(await p.evaluate(()=>game.score),8000);assert.deepEqual(await p.locator('.lab-tier-card small').allTextContents(),Array(4).fill('20 puzzles · 20 solved'));}
 assert.deepEqual(errors,[]);console.log('PASS four difficulties, 80-puzzle completion, scoring, measurements, explanations, menu progress, no browser errors');
}finally{await b.close();}
