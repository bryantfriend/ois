import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE).href);
const b=await chromium.launch(),p=await b.newPage({viewport:{width:1366,height:768}}),errors=[];
p.on('pageerror',e=>errors.push(e.message));
const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4174';
const click=(a,n)=>p.locator('[data-mode-action="tpl-'+a+'"]'+(n===undefined?'':'[data-value="'+n+'"]')).first().click();
const state=()=>p.evaluate(()=>({s:game.session,index:game.index,items:game.items,choices:game.choices,done:game.done,correct:game.correct}));
async function open(id){await p.goto(base+'/?game='+id);await p.locator('#start-game').click();await p.waitForTimeout(80);}
try{
 await fs.mkdir('output/templates',{recursive:true});await p.goto(base);
 const packs=await p.evaluate(()=>GAMES.filter(g=>TEMPLATES[g.format]).map(g=>({id:g.id,format:g.format})));
 assert.equal(packs.length,42);assert.equal(await p.evaluate(()=>GAMES.map(validateLesson).length),374);
 for(const g of packs){await open(g.id);assert.equal((await state()).s.template,true);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));const overflow=await p.locator('#arena').evaluate(el=>el.scrollHeight-el.clientHeight);assert.ok(overflow<=3,g.id+' overflow '+overflow);}
 console.log('PASS 42 packs validate, launch and fit smartboard');
 for(const f of await p.evaluate(()=>Object.keys(TEMPLATES))){
  await open(packs.find(g=>g.format===f).id);await p.screenshot({path:'output/templates/'+f+'.png'});
  let steps=0;
  while(!(await state()).done&&steps++<130){const {s,index,items,choices}=await state();
   if(s.phase==='feedback'){await click('next');continue;}
   if(f==='matchup'){const n=items.findIndex((_,i)=>!s.found.includes(i));await click('left',n);await click('right',n);}
   if(f==='classicquiz')await click('answer',choices.indexOf(items[index].answer));
   if(f==='flashcards'){await click('reveal');await click('learn');}
   if(f==='speaking'){if(s.phase==='pick')await click('deal');else{await click('reveal');await click('discussed');}}
   if(f==='groupsort')await click('group',s.categories.indexOf(items[index].answer));
   if(f==='complete'){await click('word',choices.indexOf(items[index].answer));await click('checkblank');}
   if(f==='spinwheel'){if(s.phase==='pick'){await click('spin');await p.evaluate(()=>advanceTime(3000));}else{await click('reveal');await click('discussed');}}
   if(f==='findmatch')await click('find',index);
   if(['anagram','unjumble'].includes(f)){for(let i=0;i<s.tiles.length;i++)await click('tile',i);await click('checktiles');}
   if(f==='openbox'){if(s.phase==='pick')await click('box',items.findIndex((_,i)=>!s.found.includes(i)));else{await click('reveal');await click('discussed');}}
   if(f==='matchingpairs'){const pair=items.findIndex((_,i)=>!s.found.includes(i));for(let i=0;i<s.cards.length;i++)if(s.cards[i].pair===pair)await click('card',i);}
  }
  assert.ok((await state()).done,f+' completes');assert.equal((await state()).correct,6,f+' correct');
  await p.locator('[data-replay]').click();assert.equal((await state()).done,false);
  await p.setViewportSize({width:390,height:844});await p.waitForTimeout(80);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),f+' mobile');await p.setViewportSize({width:1366,height:768});
  console.log('PASS '+f+' complete/replay/mobile');
 }
 assert.deepEqual(errors,[]);
}finally{await b.close();}
