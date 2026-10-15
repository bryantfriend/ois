const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require(process.env.OXFORD_PLAYWRIGHT_MODULE||'playwright');
(async()=>{const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));fs.mkdirSync('output/landmark-qa',{recursive:true});
await page.goto('http://127.0.0.1:4194/coastal/index.html');
await page.locator('[data-start-journey]').click({noWaitAfter:true});await page.waitForFunction(()=>typeof render_game_to_text==='function');
await page.waitForFunction(()=>JSON.parse(render_game_to_text()).destinationArtwork.loaded===35);
await page.getByRole('button',{name:'Skip for now'}).click();
await page.screenshot({path:'output/landmark-qa/uk-waiting.png'});
await page.getByRole('button',{name:'Geography passport',exact:true}).click();
assert.equal(await page.locator('[data-passport-city]').count(),6);assert.equal(await page.locator('[data-passport-city="0"] .coastal-landmark-ref-emblem').getAttribute('src').then(x=>x.endsWith('/uk/0.webp')),true);
await page.screenshot({path:'output/landmark-qa/uk-passport.png'});
await page.getByRole('button',{name:'Next →',exact:true}).click();assert.equal(await page.locator('[data-passport-city="6"]').count(),1);
await page.getByRole('button',{name:'Close geography passport',exact:true}).click();
for(const world of ['uk','kyrgyzstan']){
 const report=await page.evaluate(async world=>{const m=await import('./src/coastal-connections.js?v=landmarks-20261013'),e=await import('./src/coastal-expedition.js');
 const state=m.createGameState(123,'normal',world);state.credits=1000;state.tutorial.active=false;state.tutorial.dismissed=true;
 // Destination 2 and origin 0 had identical shapes. Exact-city journey must remain meaningful.
 state.passengers=[{id:0,at:0,destination:2,mode:'waiting',wait:0,origin:0}];state.target=1;state.terminals={...state.terminals,0:4,1:4,2:4};
 m.buyLine(state,[0,1],'road');m.buyLine(state,[1,2],'road');
 const journey=m.passengerJourney(state,state.passengers[0]);if(!journey)throw Error('Missing city-specific journey');
 const saved=e.decodeSave(e.encodeSave(state));if(saved.passengers[0].destination!==2)throw Error('Saved destination changed');
 const game=m.createCoastalGame(saved);document.body.querySelector('.coastal-world-host').replaceWith(game.element);window.__landmarkGame=game;window.__landmarkEngine=m;game.state.running=true;
 advanceTime(800);return {journey,passenger:game.state.passengers[0],destinations:JSON.parse(render_game_to_text()).stops.map(s=>s.destinationImage)};
 },world);
 assert.deepEqual(report.journey.route,[0,1,2]);assert.deepEqual(report.journey.transfers,[1]);assert.ok(['boarding','riding'].includes(report.passenger.mode));
 await page.waitForFunction(()=>JSON.parse(render_game_to_text()).destinationArtwork.loaded===35);
 await page.evaluate(()=>{for(let i=0;i<100;i++){advanceTime(20);const s=window.__landmarkGame.state;if(s.links.some(l=>l.cargo.length&&l.position>.15&&l.position<.85))break;}});await page.screenshot({path:`output/landmark-qa/${world}-onboard.png`});
 await page.getByRole('button',{name:'Geography passport',exact:true}).click();assert.equal(await page.evaluate(()=>JSON.parse(render_game_to_text()).running),false);await page.screenshot({path:`output/landmark-qa/${world}-passport.png`});await page.getByRole('button',{name:'Close geography passport',exact:true}).click();await page.waitForFunction(()=>JSON.parse(render_game_to_text()).running===true);
 const outcome=await page.evaluate(()=>{const g=window.__landmarkGame;for(let i=0;i<240&&!g.state.complete&&!g.state.failed;i++)advanceTime(500);return {passenger:g.state.passengers[0],complete:g.state.complete,failed:g.state.failed,visits:g.state.expedition?.visits};});
 assert.equal(outcome.failed,false);assert.equal(outcome.complete,true);assert.equal(outcome.passenger.at,2);assert.equal(outcome.passenger.mode,'delivered');assert.ok(outcome.visits[2]);
 console.log(world+': exact destination, boarding, transfer, delivery, save roundtrip, 35 artwork images, passport pause/resume passed');
 }
await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Geography passport',exact:true}).click();await page.screenshot({path:'output/landmark-qa/mobile-passport.png'});assert.ok(await page.evaluate(()=>{const d=document.querySelector('.coastal-landmark-passport');return d.scrollWidth<=d.clientWidth+2}));
assert.deepEqual(errors,[]);await browser.close();console.log('No browser errors; responsive passport passed.');
})().catch(e=>{console.error(e);process.exit(1)});
