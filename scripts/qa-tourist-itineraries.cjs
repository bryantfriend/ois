const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require(process.env.OXFORD_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4195';
(async()=>{
 const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));fs.mkdirSync('output/tourist-itineraries',{recursive:true});
 await page.goto(base+'/coastal/index.html?v=tourist-itineraries-1');
 await page.locator('[data-mode=hard]').click();assert.match(await page.locator('fieldset').innerText(),/tourists visit 2–3 landmarks in order/);
 await page.screenshot({path:'output/tourist-itineraries/hard-description.png'});
 await page.locator('[data-start-journey]').click({noWaitAfter:true});await page.waitForFunction(()=>typeof render_game_to_text==='function'&&JSON.parse(render_game_to_text()).destinationArtwork.loaded===35);
 await page.getByRole('button',{name:'Skip for now'}).click();
 assert.equal(await page.evaluate(()=>JSON.parse(render_game_to_text()).passengers.filter(p=>p.itinerary).length),2);
 await page.screenshot({path:'output/tourist-itineraries/waiting-tourists.png'});
 await page.getByText('Network tools',{exact:true}).click();await page.getByRole('button',{name:'Passenger journeys',exact:true}).click();await page.getByRole('button',{name:/♦ Tourist/}).first().click();
 assert.equal(await page.locator('.coastal-tourist-itinerary li').count(),2);assert.match(await page.locator('.coastal-tourist-itinerary').innerText(),/Radcliffe Camera.*Big Ben/s);
 await page.waitForFunction(()=>[...document.querySelectorAll('.coastal-tourist-itinerary img')].every(i=>i.complete&&i.naturalWidth));
 await page.screenshot({path:'output/tourist-itineraries/two-stop-itinerary.png'});await page.getByRole('button',{name:'Close passenger journey ×'}).click();
 for(const world of ['uk','kyrgyzstan']){
  const results=await page.evaluate(async world=>{
   const m=await import('./src/coastal-connections.js?v=tourist-itineraries-1'),e=await import('./src/coastal-expedition.js?v=tourist-itineraries-1');
   const check=(condition,message)=>{if(!condition)throw Error(message);};
   const normal=m.createGameState(123,'normal',world);check(normal.passengers.every(p=>!p.itinerary),'Normal spawned a tourist');
   m.setDifficulty(normal,'hard');check(normal.passengers.filter(p=>p.itinerary).length===2,'Mode selector failed to add tourists');m.setDifficulty(normal,'normal');check(normal.passengers.every(p=>!p.itinerary),'Normal mode selector kept tourists');
   const training=m.createGameState(123,'hard',world);check(m.buyRoute(training,0,1,'road'),'First route failed');training.running=true;
   for(let i=0;i<600&&training.delivered<3&&!training.failed;i++)m.advanceGame(training,.05);
   check(training.delivered===3&&training.starterGrantPaid,'Tourists blocked the training grant');check(m.buyRoute(training,1,2,'road'),'Training cannot afford Bristol/Kant route');
   for(let i=0;i<1200&&!training.complete&&!training.failed;i++)m.advanceGame(training,.05);
   check(training.complete&&!training.failed&&training.passengers.every(p=>p.mode==='delivered'),'Hard training round failed');
   const state=m.createGameState(123,'hard',world);state.tutorial.status='skipped';state.passengers=[{id:0,at:0,origin:0,destination:1,itinerary:[1,2,0],itineraryIndex:0,mode:'waiting',wait:0}];state.target=1;state.credits=1000;
   m.buyLine(state,[0,1],'road');m.buyLine(state,[1,2],'road');state.running=true;
   const stages=[];for(let i=0;i<2000&&!state.complete&&!state.failed;i++){m.advanceGame(state,.05);const p=state.passengers[0];if(p.itineraryIndex>stages.length){check(state.delivered===0&&!state.complete,'Tourist counted early');check(p.destination===p.itinerary[p.itineraryIndex],'Badge did not change');check(!state.links.some(l=>l.cargo.includes(p.id)),'Tourist failed to unload at a visit');check(p.wait===0,'Visit did not reset patience');stages.push({index:p.itineraryIndex,at:p.at,next:p.destination,income:state.roundIncome});const saved=e.decodeSave(e.encodeSave(state));check(saved.passengers[0].itineraryIndex===p.itineraryIndex,'Saved progress changed');for(const key of Object.keys(state))delete state[key];Object.assign(state,saved,{running:true});}}
   check(stages.length===2&&stages[0].income===3&&stages[1].income===6,'Intermediate fares incorrect');check(state.complete&&!state.failed&&state.delivered===1&&state.roundIncome===9,'Final tourist delivery failed');check([0,1,2].every(id=>state.expedition.visits[id]),'Visits missing from passport');
   for(const round of [2,8]){const seeded=m.createGameState(456,'hard',world);seeded.round=round;m.nextRound(seeded,true);seeded.running=true;const duration=m.arrivalInterval(seeded)*4+.1;m.advanceGame(seeded,duration);const tourists=seeded.passengers.filter(p=>p.itinerary);check(tourists.length>=1,'No tourists generated');check(tourists.every(p=>p.itinerary.length===(round===2?2:3)&&new Set(p.itinerary).size===p.itinerary.length&&!p.itinerary.includes(p.origin)&&p.itinerary.every(id=>seeded.activeStops.includes(id))),'Invalid itinerary generation');const before=seeded.passengers.map(p=>[p.at,p.destination,p.itinerary]);m.nextRound(seeded,true);seeded.running=true;m.advanceGame(seeded,duration);check(JSON.stringify(before)===JSON.stringify(seeded.passengers.map(p=>[p.at,p.destination,p.itinerary])),'Retry changed seeded itineraries');}
   const cancelled=m.createGameState(789,'hard',world);cancelled.credits=1000;cancelled.passengers=[{id:0,at:0,origin:0,destination:1,itinerary:[1,2],itineraryIndex:0,mode:'riding',wait:0}];m.buyLine(cancelled,[0,1],'road');m.buyLineVehicle(cancelled,0);Object.assign(cancelled.links[0].vehicles[0],{a:0,b:1,position:.8,direction:1,cargo:[0]});m.removeRoute(cancelled,0);check(cancelled.passengers[0].at!==1&&cancelled.passengers[0].destination===1&&cancelled.passengers[0].itineraryIndex===0,'Removing an extra vehicle stranded a tourist');e.decodeSave(e.encodeSave(cancelled));
   const old=e.decodeSave(e.encodeSave(m.createGameState(999,'normal',world)));check(old.passengers.every(p=>!p.itinerary),'Old save incompatible');
   const invalid=JSON.parse(e.encodeSave(state));invalid.state.passengers[0].itineraryIndex=8;let rejected=false;try{e.decodeSave(JSON.stringify(invalid));}catch{rejected=true;}check(rejected,'Corrupt tourist save accepted');
   return {world,trainingElapsed:training.elapsed,stages,final:state.passengers[0]};
  },world);
  console.log(JSON.stringify(results));
 }
 // Show an in-progress three-stop tour, with transfers and saved visit progress.
 await page.evaluate(async()=>{const m=await import('./src/coastal-connections.js?v=tourist-itineraries-1');const s=m.createGameState(123,'hard','uk');s.tutorial.status='skipped';s.passengers=[{id:0,at:1,origin:1,destination:2,itinerary:[1,2,0],itineraryIndex:1,mode:'waiting',wait:0}];s.target=1;s.credits=1000;m.buyLine(s,[0,1],'road');m.buyLine(s,[1,2],'road');const g=m.createCoastalGame(s);document.querySelector('.coastal-world-host').replaceWith(g.element);window.__touristGame=g;});
 await page.getByText('Network tools',{exact:true}).click();await page.getByRole('button',{name:'Passenger journeys',exact:true}).click();await page.getByRole('button',{name:/♦ Tourist/}).click();assert.equal(await page.locator('[data-visit=visited]').count(),1);assert.equal(await page.locator('[data-visit=next]').count(),1);assert.equal(await page.locator('[data-visit=later]').count(),1);
 await page.screenshot({path:'output/tourist-itineraries/three-stop-progress.png'});await page.setViewportSize({width:390,height:844});await page.screenshot({path:'output/tourist-itineraries/mobile-itinerary.png'});const layout=await page.locator('.coastal-network-shop[open]').evaluate(d=>({width:d.clientWidth,scroll:d.scrollWidth,overflow:[...d.querySelectorAll('*')].filter(e=>e.getBoundingClientRect().right>d.getBoundingClientRect().right).map(e=>[e.tagName,e.className,e.getBoundingClientRect().right])}));assert.ok(layout.scroll<=layout.width+2);
 await page.getByRole('button',{name:'Close passenger journey ×'}).click();await page.setViewportSize({width:1440,height:900});
 await page.evaluate(()=>{const g=window.__touristGame;g.state.running=true;for(let i=0;i<60;i++){advanceTime(50);if(g.state.links.some(l=>l.cargo.length&&l.position>.15))break;}});
 assert.equal(await page.evaluate(()=>window.__touristGame.state.passengers[0].mode),'riding');assert.equal(await page.evaluate(()=>window.__touristGame.state.passengers[0].destination),2);await page.screenshot({path:'output/tourist-itineraries/onboard-next-landmark.png'});
 await page.getByRole('button',{name:'Passenger journeys',exact:true}).click();await page.getByRole('button',{name:/♦ Tourist/}).click();assert.equal(await page.locator('.coastal-tourist-itinerary li').count(),3);await page.getByRole('button',{name:'Close passenger journey ×'}).click();
 for(const [language,expected]of [['ru','туристы посещают'],['ky','туристтер']]){await page.goto(base+'/coastal/index.html?v=tourist-itineraries-1');await page.locator('[data-language]').selectOption(language);await page.locator('[data-mode=hard]').click();assert.ok((await page.locator('fieldset').innerText()).includes(expected));}
 assert.deepEqual(errors,[]);await browser.close();console.log('Difficulty descriptions, tourist panel, three-stop progress and mobile passed; zero browser errors.');
})().catch(e=>{console.error(e);process.exit(1)});
