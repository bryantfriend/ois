const CARGO_QA_BASE=process.env.CARGO_QA_BASE_URL||'http://127.0.0.1:4189';
const {chromium}=require(process.env.OXFORD_PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:1080}}),errors=[];page.on('pageerror',e=>errors.push(e.message));fs.mkdirSync('output/space-cargo/qa',{recursive:true});
const state=()=>page.evaluate(()=>JSON.parse(render_game_to_text())),tick=ms=>page.evaluate(ms=>advanceTime(ms),ms);
async function configure(grade,concept,difficulty=0){await page.locator('#settings-btn').click();await page.selectOption('#grade',String(grade));await page.selectOption('#concept',concept);await page.selectOption('#difficulty',String(difficulty));await page.locator('#auto-read').uncheck();await page.locator('#apply').click();await tick(2400);assert.equal((await state()).phase,'idle');}
async function load(i){await page.locator(`[data-supply="${i}"]`).click();await tick(2250);}
try{
await page.goto(CARGO_QA_BASE + "/space-cargo/index.html");await page.locator('#mute').click();await page.locator('#start').click();await tick(2400);await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'output/space-cargo/qa/desktop.png',fullPage:true});
await load(1);assert.equal((await state()).total,2);const before=await state();await page.locator('[data-supply="5"]').dispatchEvent('click');assert.equal((await state()).total,before.total);assert.equal((await state()).phase,'idle');
await page.locator('[data-loaded]').click();await tick(800);assert.ok((await state()).transfer?.unload);await page.screenshot({path:'output/space-cargo/qa/unloading.png',fullPage:true});await tick(1500);assert.equal((await state()).total,0);
await page.locator('[data-supply="2"]').click();await tick(600);await page.locator('#pause').click();const arm=(await state()).arm;await tick(5000);assert.deepEqual((await state()).arm,arm);await page.locator('#resume').click();await tick(1700);assert.equal((await state()).total,3);
await page.locator('#reset').click();assert.equal((await state()).total,0);await load(0);await page.locator('#reset').click();assert.equal((await state()).cargo.length,0);
// Keyboard selection is retained while the SVG is idle.
await page.locator('[data-supply="1"]').focus();await page.waitForTimeout(80);await page.keyboard.press('Enter');await tick(2250);assert.equal((await state()).total,2);await page.locator('#reset').click();
const bank=await page.evaluate(()=>{const out=[];for(const [g,list]of Object.entries(CargoMissions.concepts))for(const[c]of list)for(let d=0;d<3;d++)for(let k=0;k<2;k++){const q=CargoMissions.make(+g,c,d,k);out.push({grade:+g,concept:c,difficulty:d,variant:k,target:q.target,scale:q.scale,choices:q.choices,initial:q.initial,solution:q.solution,rule:q.rule,groupSize:q.groupSize,requiredCount:q.requiredCount,ratio:q.ratio,maxCargo:q.maxCargo});}return out;});
assert.equal(bank.length,126);for(const q of bank){assert.ok(q.solution.length<=q.maxCargo);const cubes=q.solution.map(i=>q.choices[i]);assert.equal(cubes.reduce((v,c)=>v+c.value,0),q.target,JSON.stringify(q));if(q.rule==='groups')assert.ok(cubes.every(c=>c.value===q.groupSize));if(q.rule==='factors')assert.ok(cubes.every(c=>q.target%c.value===0));if(q.rule==='ratio'){const b=cubes.filter(c=>c.kind==='blue').length,o=cubes.length-b;assert.equal(b*q.ratio[1],o*q.ratio[0]);}}
// Exercise every grade/concept/difficulty through the real mission controls and transfer actions.
for(const q of bank.filter(q=>q.variant===0)){
 await configure(q.grade,q.concept,q.difficulty);
 let plan=q.solution;
 if(q.initial.length){const needed=q.target-q.initial.reduce((v,c)=>v+c.value,0);const queue=[{n:0,p:[]}],seen=new Set([0]);while(queue.length){const a=queue.shift();if(a.n===needed){plan=a.p;break;}q.choices.forEach((c,i)=>{const n=a.n+c.value;if(n<=needed&&!seen.has(n)){seen.add(n);queue.push({n,p:[...a.p,i]});}});}}
 for(const i of plan)await load(i);
 assert.equal((await state()).correct,true,`${q.grade} ${q.concept} ${q.difficulty}`);assert.equal((await state()).phase,'success');await tick(1200);assert.ok(['closing','launch'].includes((await state()).phase));await tick(3600);assert.ok((await state()).deliveries>0);
}
// Wrong equal-group packing can meet the sum without winning.
await configure(2,'groups');await load(4);await load(0);assert.equal((await state()).total,6);assert.equal((await state()).correct,false);assert.equal((await state()).phase,'idle');await page.locator('#reset').click();
// Load illustration with occupied hold and capture the actual closing/takeoff states.
await configure(1,'bonds');await load(1);await page.locator('[data-supply="2"]').click();await tick(1400);await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'output/space-cargo/qa/robot-transfer.png',fullPage:true});await tick(900);await load(0);await tick(1400);await page.screenshot({path:'output/space-cargo/qa/doors.png',fullPage:true});await tick(1800);await page.screenshot({path:'output/space-cargo/qa/takeoff.png',fullPage:true});await tick(4000);
await page.locator('#fleet-btn').click();assert.equal(await page.locator('[data-ship]').count(),20);await page.screenshot({path:'output/space-cargo/qa/fleet.png',fullPage:true});await page.locator('[data-ship="19"]').click();await tick(2400);assert.equal((await state()).ship,19);
await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'output/space-cargo/qa/mobile.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.locator('.scene-shell').evaluate(el=>el.scrollLeft=el.scrollWidth);await page.screenshot({path:'output/space-cargo/qa/mobile-hold.png',fullPage:true});
await page.reload();assert.equal((await state()).ship,19);assert.equal((await state()).muted,true);assert.ok((await state()).deliveries>=63);
assert.deepEqual(errors,[]);console.log('PASS: 126 mission solutions; 63 UI mission flows; load/unload, robot pause, rejection, reset, keyboard, rule checks, doors/takeoff, 20 ships, mobile, persistence, no page errors.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
