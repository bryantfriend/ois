const CARGO_QA_BASE=process.env.CARGO_QA_BASE_URL||'http://127.0.0.1:4189';
const {chromium}=require(process.env.OXFORD_PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{const b=await chromium.launch({headless:true,args:['--autoplay-policy=no-user-gesture-required']}),p=await b.newPage({viewport:{width:1440,height:1080}}),errors=[];p.on('pageerror',e=>errors.push(e.message));const state=()=>p.evaluate(()=>JSON.parse(render_game_to_text())),tick=ms=>p.evaluate(ms=>advanceTime(ms),ms);fs.mkdirSync('output/space-cargo/success',{recursive:true});
try{
 await p.goto(CARGO_QA_BASE + "/space-cargo/index.html");
 assert.equal(await p.evaluate(()=>CargoMissions.successes.length),20);assert.equal(await p.evaluate(()=>new Set(CargoMissions.successes).size),20);assert.ok(await p.evaluate(()=>CargoMissions.successes.every(t=>ClassroomVoice.has(t))));
 await p.locator('#mute').click();await p.locator('#settings-btn').click();await p.selectOption('#grade','1');await p.selectOption('#concept','bonds');await p.selectOption('#difficulty','0');await p.locator('#auto-read').uncheck();await p.locator('#apply').click();await tick(2400);
 const seen=[];
 for(let round=0;round<41;round++){
  if(round===7){const before=await p.evaluate(()=>JSON.parse(localStorage.getItem('ois-starport-cargo-v1')).successBag);await p.reload();await p.locator('#start').click();await tick(2400);assert.deepEqual(await p.evaluate(()=>JSON.parse(localStorage.getItem('ois-starport-cargo-v1')).successBag),before);}
  const target=(await state()).target;for(const i of target===6?[4,0]:[4,4]){await p.locator(`[data-supply="${i}"]`).click();await tick(2250);}
  assert.equal((await state()).phase,'success');seen.push(await p.locator('#status').innerText());
  if(round===0){await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:'output/space-cargo/success/success.png',fullPage:true});}
  await tick(10000);assert.equal((await state()).phase,'idle');
 }
 assert.equal(new Set(seen.slice(0,20)).size,20);assert.equal(new Set(seen.slice(20,40)).size,20);for(let i=1;i<seen.length;i++)assert.notEqual(seen[i],seen[i-1]);
 // Play a real new recording and verify its duration gates door closing.
 await p.locator('#mute').click();const t=(await state()).target;for(const i of t===6?[4,0]:[4,4]){await p.locator(`[data-supply="${i}"]`).click();await tick(2250);}
 const spoken=await p.locator('#status').innerText();await p.waitForFunction(text=>ClassroomVoice.lastPlayed===text&&ClassroomVoice.playing,spoken);assert.equal(await p.evaluate(()=>ClassroomVoice.lastBackend),'natural-recorded');await tick(5000);assert.equal((await state()).phase,'success');await p.waitForFunction(()=>!ClassroomVoice.playing);await tick(800);assert.ok(['closing','launch'].includes((await state()).phase));
 assert.deepEqual(errors,[]);console.log('PASS: 20 unique recorded success messages, two shuffled cycles with no repeats, no boundary repeats, shuffle persistence across reload, displayed/spoken message match, real Sonia recording and awaited door sequence, no page errors.');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1);});
