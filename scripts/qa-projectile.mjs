import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE).href);
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1366,height:768}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4174';
const state=()=>page.evaluate(()=>JSON.parse(render_game_to_text()));
try {
 await fs.mkdir('output/projectile',{recursive:true});
 await page.goto(base+'/?subject=physics');
 const card=page.locator('.game-card').filter({hasText:'Projectile Duel'});
 assert.equal(await card.count(),1);assert.match(await card.innerText(),/Free play/);
 await page.locator('[data-grade="8"]').click();assert.equal(await card.count(),1);
 await card.locator('[data-edit]').click();await page.waitForURL('**/projectile-duel.html');
 assert.equal(await page.locator('.slide,#lesson-view').count(),0);
 await page.evaluate(()=>advanceTime(0));
 await page.locator('#p1-angle').fill('90');
 await page.locator('[onclick="adjustInput(\'p1-angle\', 1)"]').click();
 assert.equal((await state()).players[0].angle,90);
 await page.locator('#p2-power').fill('20');
 await page.locator('[onclick="adjustInput(\'p2-power\', -2)"]').click();
 assert.equal((await state()).players[1].power,20);
 await page.locator('#p1-fire-btn').click();await page.locator('#p2-fire-btn').click();
 assert.equal((await state()).projectiles.length,2);
 await page.evaluate(()=>advanceTime(500));
 await page.screenshot({path:'output/projectile/flight.png'});
 await page.evaluate(()=>advanceTime(5500));
 assert.equal((await state()).projectiles.length,0);
 assert.equal(await page.locator('#p1-fire-btn').isDisabled(),false);
 // Solve shots against the visible terrain using the original discrete physics.
 for(const owner of [1,2]){
  await page.reload();await page.evaluate(()=>advanceTime(0));
  const shot=await page.evaluate(owner=>{
   const from=owner===1?p1Hitbox:p2Hitbox,to=owner===1?p2Hitbox:p1Hitbox,dir=owner===1?1:-1;
   for(let angle=1;angle<90;angle++)for(let power=20;power<=100;power++){
    const rad=angle*Math.PI/180,vx=power*.12*Math.cos(rad)*dir;
    let x=from.x+60*Math.cos(rad)*dir,y=from.y-60*Math.sin(rad),vy=-power*.12*Math.sin(rad);
    for(let n=0;n<300;n++){x+=vx;vy+=.15;y+=vy;if(y>450||x< -100||x>1100||isPointInMountain(x,y))break;if(Math.hypot(x-to.x,y-to.y)<40)return {angle,power};}
   }
  },owner);
  assert.ok(shot,'Initial terrain should permit a scoring shot');
  await page.locator(`#p${owner}-angle`).fill(String(shot.angle));
  await page.locator(`#p${owner}-power`).fill(String(shot.power));
  await page.locator(`#p${owner}-fire-btn`).click();
  for(let n=0;n<300&&(await state()).scores[owner-1]===0;n++)await page.evaluate(()=>advanceTime(1000/60));
  assert.equal((await state()).scores[owner-1],1);
  assert.equal((await state()).phase,'new-terrain');
  await page.screenshot({path:`output/projectile/score-${owner}.png`});
  const before=(await state()).mountain;
  await page.evaluate(()=>advanceTime(2500));
  assert.notDeepEqual((await state()).mountain,before);
  assert.equal((await state()).projectiles.length,0);
 }
 await page.getByRole('button',{name:'Restart scores'}).click();
 assert.deepEqual((await state()).scores,[0,0]);
 assert.deepEqual((await state()).cooldowns,[0,0]);
 await page.locator('#fullscreen-btn').click();
 await page.waitForFunction(()=>!!document.fullscreenElement);
 await page.keyboard.press('f');
 await page.waitForFunction(()=>!document.fullscreenElement);
 for(const size of [{width:1920,height:1080},{width:1366,height:768},{width:390,height:844}]){
  await page.setViewportSize(size);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  for(const id of ['#p1-fire-btn','#p2-fire-btn']){await page.locator(id).scrollIntoViewIfNeeded();assert.ok(await page.locator(id).isVisible());}
  await page.screenshot({path:`output/projectile/layout-${size.width}.png`,fullPage:true});
 }
 await page.getByRole('link',{name:'Physics games'}).click();await page.waitForURL('**/?subject=physics');
 assert.equal(await card.count(),1);
 await page.goto(base+'/?game=physics-8-projectile-duel');await page.waitForURL('**/projectile-duel.html');
 assert.deepEqual(errors,[]);
 console.log('PASS Physics catalogue, direct link, aim limits, simultaneous fire, cooldowns, both scores, terrain transition, restart, desktop/mobile layout, return navigation; no browser errors.');
} finally {await browser.close();}
