import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE).href);
const browser=await chromium.launch(),page=await browser.newPage();
try{
 await fs.mkdir('output/library-styles',{recursive:true});
 await page.goto(process.env.OXFORD_TEST_URL||'http://127.0.0.1:4199');
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  await page.setViewportSize({width,height});await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:`output/library-styles/${name}.png`});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 assert.ok(await page.locator('[data-style-category="quiz"]').evaluate(el=>el.getBoundingClientRect().left<innerWidth),'Next category must be partly visible to signal horizontal browsing');
 await page.locator('#search').fill('chess');await page.locator('[data-style-open]').first().click();
 assert.equal(await page.locator('[data-style-customise]').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(52, 54, 110)');
 await page.screenshot({path:'output/library-styles/details-mobile.png'});
 console.log('PASS: desktop/mobile layout, category discovery, visible dialog action.');
}finally{await browser.close();}
