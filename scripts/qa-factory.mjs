import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE||'C:/Users/fangb_kyiapn1/.codex/skills/develop-web-game/node_modules/playwright/index.mjs').href);
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1920,height:1080},hasTouch:true});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4174';
const state=()=>page.evaluate(()=>JSON.parse(render_game_to_text()));
const tick=ms=>page.evaluate(ms=>advanceTime(ms),ms);
const screenshot=name=>page.screenshot({path:`output/factory/${name}.png`,fullPage:true});
async function tiles(tool,points,dir=0){await page.evaluate(({tool,dir})=>{
 document.querySelector(`[data-tool="${tool}"]`).click();
 let current=JSON.parse(render_game_to_text()).direction;while(current!==dir){document.querySelector('#rotate').click();current=(current+1)%4;}
}, {tool,dir});for(const [x,y]of points){const p=await page.evaluate(([x,y])=>factoryTilePoint(x,y),[x,y]);await page.mouse.click(p.x,p.y);if(tool==='belt'){let s=await state(),c=s.cells.find(c=>c.x===x&&c.y===y);while(c?.type==='belt'&&c.direction!==dir){await page.locator('#rotate-selected').click();s=await state();c=s.cells.find(c=>c.x===x&&c.y===y);}if(await page.locator('#selection-actions').isVisible())await page.locator('#deselect').click();}}}
async function path(points){for(let i=0;i<points.length;i++){const p=points[i],next=points[i+1];let d=0;if(next){d=next[0]>p[0]?0:next[1]>p[1]?1:next[0]<p[0]?2:3;}await tiles('belt',[p],d);}}
async function begin(id,answer='99'){await page.locator(`[data-level="${id}"]`).click();await page.locator('#prediction').fill(answer);await page.locator('[data-predict]').click();}
async function resumeAndFinish(ms=360000){await page.locator('#run').click();await tick(ms);if(await page.locator('#modal').evaluate(el=>el.open)){await page.locator('[data-close]').first().click();await page.locator('#run').click();await tick(90000);}}
async function simpleLine(){await tiles('extractor',[[2,3]]);await tiles('plank',[[4,3]]);await path([[3,3]]);await path([[5,3],[6,3],[7,3],[8,3],[9,3],[10,3],[11,3],[12,3],[12,4],[12,5]]);}
try{
 await fs.mkdir('output/factory',{recursive:true});
 await page.goto(base+'/?game=math-7-factory-maths');await page.waitForURL('**/factory-maths.html');
 assert.equal((await state()).unlocked.length,1);await screenshot('01-levels');
 await begin(1,'99');assert.equal((await state()).prediction,'99');await simpleLine();assert.equal((await state()).spent,66);
 // Native touch hit mapping, inspect, rotation and full refund.
 const p=await page.evaluate(()=>factoryTilePoint(7,7));await page.locator('[data-tool="belt"]').click();await page.touchscreen.tap(p.x,p.y);assert.equal((await state()).spent,67);
 await page.locator('[data-tool="inspect"]').click();await page.touchscreen.tap(p.x,p.y);assert.match(await page.locator('#inspector').innerText(),/Capacity/);
 await page.locator('#rotate-selected').click();assert.equal((await state()).cells.find(c=>c.x===7&&c.y===7).direction,1);
 await tiles('remove',[[7,7]]);assert.equal((await state()).spent,66);await page.locator('#undo').click();assert.equal((await state()).spent,67);await tiles('remove',[[7,7]]);
 await page.locator('#run').click();await tick(20000);await screenshot('02-running');assert.ok((await state()).cells.some(c=>c.queue.length));
 await tick(100000);assert.equal((await state()).stars[0],true);assert.equal((await state()).stars[2],true);assert.ok((await state()).unlocked.includes(2));await screenshot('03-result');
 await page.locator('[data-close]').first().click();await page.locator('#run').click();await tick(100000);assert.deepEqual((await state()).stars,[true,true,true]);assert.equal((await state()).wallet,3);await screenshot('04-three-stars');
 await page.locator('#shop').click();await page.locator('[data-buy="motor"]').click();assert.equal((await state()).wallet,0);assert.deepEqual((await state()).upgrades,['motor']);await page.locator('[data-close]').first().click();
 assert.equal((await state()).cells.find(c=>c.type==='plank').capacity,12,'Upgrade excluded from level one');
 await page.reload();await begin(1,'24');assert.equal((await state()).cells.filter(c=>c.type!=='dock').length,13,'Layout survives reload');await resumeAndFinish();assert.equal((await state()).wallet,0,'Replays do not farm stars');
 await page.locator('#teams').click();await page.locator('#new-team input').fill('Other team');await page.locator('#new-team button').click();assert.deepEqual((await state()).unlocked,[1]);assert.deepEqual((await state()).upgrades,[]);assert.equal((await state()).wallet,0);await screenshot('05-team-isolation');
 // Seed completed prerequisite records, never a factory or simulation result.
 await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('ois-factory-maths-v1'));s.active='team-1';const t=s.teams.find(t=>t.id==='team-1');for(let n=1;n<=12;n++)t.stars[n]=[true,false,false];t.upgrades=['motor'];t.spent=3;t.drafts={};localStorage.setItem('ois-factory-maths-v1',JSON.stringify(s));});await page.reload();
 for(const id of [4,6,9,11,12]){
  await begin(id);
  const sources=(await state()).sources;
  for(const [raw,x,y]of sources){await tiles('extractor',[[x,y]]);await tiles(raw==='wood'?'plank':raw==='ore'?'ingot':'wire',[[4,y]]);await tiles('belt',[[3,y]]);}
  if(id===4){await tiles('gear',[[7,3]]);await path([[5,3],[6,3]]);await path([[8,3],[9,3],[10,3],[11,3],[12,3],[12,4],[12,5]]);}
  else{
   const target=id===6||id===11?'toolkit':'circuit';await tiles(target,[[10,5]]);
   // 2x2 ports: feed rear from (9,5)/(9,6), third side from (11,7), output to (12,5).
   const top=sources[0][2];await path([[5,top],[6,top],[7,top],[8,top],...Array.from({length:5-top},(_,i)=>[8,top+i+1]),[9,5]]);
   if(sources.length===2){const y=sources[1][2];await path([[5,y],[6,y],[7,y],[8,y],[9,y],...Array.from({length:y-6},(_,i)=>[9,y-i-1]),[9,6]]);}
   else{await path([[5,5],[6,5],[7,5],[7,6],[8,6],[9,6]]);await path([[5,8],[6,8],[7,8],[8,8],[9,8],[10,8],[11,8],[11,7]]);await tiles('belt',[[11,7]],3);}
   await tiles('belt',[[9,5],[9,6],[12,5]],0);
  }
  await resumeAndFinish(550000);const s=await state();assert.ok(s.delivered[0]>=({4:12,6:12,9:12,11:18,12:24}[id]),`Level ${id} delivers, state ${JSON.stringify(s)}`);await screenshot(`level-${id}`);await page.locator('#teams').click();
 }
 // Parallel chains, equal splitting, percentage upgrade and belt ceiling.
 for(const id of [2,3,5,7,8,10]){
  await begin(id);const s=await state();
  if([2,3,7,8].includes(id)){
   for(const [raw,x,y]of s.sources){await tiles('extractor',[[x,y]]);await tiles(raw==='wood'?'plank':'ingot',[[4,y]]);await tiles('belt',[[3,y]]);await path([[5,y],[6,y],[7,y],[8,y],[9,y],[10,y],[11,y],...(y<5?[[11,4],[11,5]]:[[11,6],[11,5]])]);}
   await tiles('belt',[[11,5],[12,5]]);
  }else if(id===5){
   await tiles('extractor',[[2,5]]);await tiles('splitter',[[3,5]]);await tiles('belt',[[3,4],[3,6]]);await tiles('plank',[[4,4],[4,6]]);await path([[5,4],[6,4],[6,5]]);await path([[5,6],[6,6],[6,5]]);await tiles('belt',[[6,5]]);await tiles('splitter',[[7,5]]);await path([[7,4],[7,3],[8,3],[9,3],[10,3],[11,3],[12,3]]);await path([[7,6],[7,7],[7,8],[8,8],[9,8],[10,8],[11,8],[12,8]]);
  }else{
   await tiles('extractor',[[2,3]]);await tiles('ingot',[[4,3]]);await tiles('gear',[[7,3]]);await path([[3,3]]);await path([[5,3],[6,3]]);await path([[8,3],[9,3],[10,3],[11,3],[12,3],[12,4],[12,5]]);
  }
  await resumeAndFinish(550000);const final=await state();assert.ok(final.delivered[0]>0,`Level ${id} works`);if(id===5){assert.ok(final.delivered[1]>=12);assert.equal(final.stars[1],true,'Equal splitter sustains both docks');}if([2,3,7].includes(id))assert.equal(final.stars[1],true,`Level ${id} reaches throughput: ${JSON.stringify(final)}`);await screenshot(`level-${id}`);await page.locator('#teams').click();
 }
 // Real pointer drag across a bend sets the outgoing directions.
 await begin(2);page.once('dialog',d=>d.accept());await page.locator('#restart').click();await page.locator('#prediction').fill('24');await page.locator('[data-predict]').click();await page.locator('[data-tool="belt"]').click();const pts=await page.evaluate(()=>[[5,3],[6,3],[7,3],[7,4]].map(([x,y])=>factoryTilePoint(x,y)));await page.mouse.move(pts[0].x,pts[0].y);await page.mouse.down();for(const p of pts.slice(1))await page.mouse.move(p.x,p.y,{steps:4});await page.mouse.up();assert.equal((await state()).cells.find(c=>c.x===7&&c.y===3).direction,1);assert.equal((await state()).spent,4);
 await page.locator('#undo').click();assert.equal((await state()).spent,0,'Whole drag undo');
 await page.locator('#shop').click();await page.locator('[data-buy="belt"]').click();await page.locator('[data-buy="lens"]').click();assert.ok((await state()).upgrades.includes('belt'));assert.ok((await state()).upgrades.includes('lens'));await page.locator('[data-close]').first().click();
 await page.locator('#teams').click();await begin(8);assert.equal((await state()).beltCapacity,45,'Belt upgrade applies only in allowed level');
 await page.locator('#teams').click();const downloadEvent=page.waitForEvent('download');await page.locator('[data-export]').click();const download=await downloadEvent;await download.saveAs('output/factory/backup.json');const backup=JSON.parse(await fs.readFile('output/factory/backup.json','utf8'));assert.equal(backup.teams.length,2);assert.equal(backup.version,1);
 page.once('dialog',d=>d.accept());await page.locator('#backup-file').setInputFiles('output/factory/backup.json');await page.waitForTimeout(100);assert.equal((await state()).team,'Team 1');await begin(8);
 await page.setViewportSize({width:1366,height:768});await screenshot('06-laptop');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.setViewportSize({width:1920,height:1080});await screenshot('07-smartboard');
 assert.deepEqual(errors,[]);console.log('Factory QA passed: prediction, item flow, stars, once-only rewards, purchases, exclusions, saves, teams, multi-ingredient production, touch, drag, undo and layouts.');
}finally{await browser.close();}
