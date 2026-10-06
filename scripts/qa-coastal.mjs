import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE).href);
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1366,height:768}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4174';
try {
 await fs.mkdir('output/coastal',{recursive:true});
 for(const grade of [7,8]){
  await page.goto(`${base}/?subject=geography&grade=${grade}`);
  const card=page.locator('.game-card').filter({hasText:'Coastal Connections'});
  assert.equal(await card.count(),1);
  assert.match(await card.innerText(),new RegExp(`GRADE ${grade}`));
  assert.match(await card.innerText(),/Free play/);
  await page.screenshot({path:`output/coastal/catalogue-${grade}.png`});
  await card.locator(grade===7?'[data-edit]':'[data-play]').click();
  await page.waitForURL('**/coastal/index.html');
  await page.waitForFunction(()=>typeof render_game_to_text==='function');
  const state=await page.evaluate(()=>JSON.parse(render_game_to_text()));
  assert.equal(state.credits,20);
  assert.equal(state.round,1);
  assert.equal(await page.locator('canvas').count(),1);
  assert.ok(await page.locator('canvas').isVisible());
  await page.evaluate(()=>advanceTime(100));
  await page.screenshot({path:`output/coastal/game-${grade}.png`});
  await page.getByRole('link',{name:'OIS Geography games'}).click();
  await page.waitForURL('**/?subject=geography');
  assert.equal(await page.locator('.game-card').filter({hasText:'Coastal Connections'}).count(),2);
 }
 await page.goto(`${base}/?subject=geography&grade=7`);
 await page.locator('[data-grade="3"]').click();
 assert.equal(await page.locator('.game-card').filter({hasText:'Coastal Connections'}).count(),0);
 await page.goto(base+'/coastal/index.html');
 await page.setViewportSize({width:390,height:844});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:'output/coastal/mobile.png'});
 assert.deepEqual(errors,[]);
 console.log('Coastal catalogue, both launch actions, return navigation and mobile passed.');
} finally {await browser.close();}
