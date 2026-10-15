import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL('C:/Users/fangb_kyiapn1/.codex/skills/develop-web-game/node_modules/playwright/index.mjs').href);
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1920,height:1080},hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
await fs.mkdir('output/factory-bright-ui',{recursive:true});
await page.addInitScript(()=>{const stars={};for(let n=1;n<=12;n++)stars[n]=[true,false,false];localStorage.setItem('ois-factory-maths-v1',JSON.stringify({version:1,active:'team-1',teams:[{id:'team-1',name:'Team 1',stars,spent:0,upgrades:[],drafts:{}}]}));});
await page.goto('http://127.0.0.1:4174/factory-maths.html');await page.screenshot({path:'output/factory-bright-ui/levels.png',fullPage:true});await page.locator('[data-level="1"]').click();await page.locator('#prediction').fill('24');await page.locator('[data-predict]').click();
assert.equal(await page.locator('.objective-progress').count(),3);assert.equal(await page.locator('.tool-icon svg').count(),7);
await page.screenshot({path:'output/factory-bright-ui/smartboard.png',fullPage:true});
await page.setViewportSize({width:1366,height:768});await page.screenshot({path:'output/factory-bright-ui/laptop.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+3),'First-level controls fit laptop screen');
await page.locator('#settings').click();await page.screenshot({path:'output/factory-bright-ui/settings.png',fullPage:true});await page.locator('[data-close]').click();
await page.locator('#teams').click();await page.locator('[data-level="12"]').click();await page.locator('#prediction').fill('4');await page.locator('[data-predict]').click();await page.screenshot({path:'output/factory-bright-ui/advanced.png',fullPage:true});
for(const size of [{width:1366,height:768},{width:768,height:1024},{width:390,height:844}]){await page.setViewportSize(size);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow');}
assert.deepEqual(errors,[]);console.log('Bright UI passed: illustrated tools, three objective bars, smartboard/laptop/mobile layout, settings and advanced-level tools; no browser errors.');
}finally{await browser.close();}
