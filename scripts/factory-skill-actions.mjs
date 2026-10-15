// Prepare an action payload for the skill's unmodified browser client.
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL('C:/Users/fangb_kyiapn1/.codex/skills/develop-web-game/node_modules/playwright/index.mjs').href);
const browser=await chromium.launch();const page=await browser.newPage();
await page.goto('http://127.0.0.1:4174/factory-maths.html');await page.locator('[data-level="1"]').click();
const coords=async sel=>page.locator(sel).evaluate(el=>{const b=el.getBoundingClientRect(),c=document.querySelector('canvas').getBoundingClientRect();return {mouse_x:b.x+b.width/2-c.x,mouse_y:b.y+b.height/2-c.y};});
const steps=[];const click=async sel=>steps.push({buttons:['left_mouse_button'],frames:1,...await coords(sel)});
await click('[data-key="2"]');await click('[data-key="4"]');await click('[data-predict]');
await page.locator('#prediction').fill('24');await page.locator('[data-predict]').click();
const tile=async(x,y)=>{const p=await page.evaluate(([x,y])=>{const p=factoryTilePoint(x,y),c=document.querySelector('canvas').getBoundingClientRect();return {mouse_x:p.x-c.x,mouse_y:p.y-c.y};},[x,y]);steps.push({buttons:['left_mouse_button'],frames:1,...p});};
await tile(2,3);await click('[data-tool="belt"]');await tile(3,3);await click('[data-tool="plank"]');await tile(4,3);await click('[data-tool="belt"]');for(let x=5;x<=12;x++)await tile(x,3);await click('#rotate');await tile(13,3);await tile(13,4);await click('#run');steps.push({buttons:[],frames:1200});
await fs.mkdir('output/factory-skill',{recursive:true});await fs.writeFile('output/factory-skill/actions.json',JSON.stringify({steps}));await browser.close();
