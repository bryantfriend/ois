
import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {pathToFileURL} from 'node:url';const {chromium}=await import(pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE).href),b=await chromium.launch(),p=await b.newPage({viewport:{width:1366,height:768}}),errors=[];p.on('pageerror',e=>errors.push(e.message));const base='http://127.0.0.1:4174',click=(a,n)=>p.locator('[data-mode-action="lab-'+a+'"]'+(n===undefined?'':'[data-value="'+n+'"]')).first().click(),state=()=>p.evaluate(()=>game.session);
try{await p.goto(base);const packs=await p.evaluate(()=>GAMES.filter(g=>['path','classics'].includes(LAB_GAMES[g.format]?.engine)).map(g=>({id:g.id,format:g.format})));assert.equal(packs.length,23);for(const pack of packs){await p.goto(base+'/?game='+pack.id);await p.locator('#start-game').click();await p.waitForTimeout(100);const s=await state(),d=s.data,v=s.config.variant;await p.screenshot({path:'output/playmath/qa/'+pack.format+'.png'});if(s.config.engine==='path'){
if(['connect','sequence','tail','spots'].includes(v))for(const i of d.solution.slice(1))await click('cell',i);
if(v==='coordinate')for(const i of d.targets)await click('cell',i);
if(v==='knight')for(const i of d.route.slice(1))await click('cell',i);
if(v==='laser'){if(d.mirrors[4]!=='\\')await click('cell',4);if(d.mirrors[24]!=='/')await click('cell',24);await click('fire');}
if(v==='paint')for(const i of [1,2,3,2,1])await click('move',i);
if(v==='maze')for(const i of [1,2])await click('move',i);
if(v==='step')for(const i of [1,1,1,1,2,2,2,2])await click('move',i);
if(v==='snake')for(const i of [1,1,1,1,2,2,2,2,3,3,3,3,0,0,1,1,1,1,2,2])await click('move',i);
if(['pipes','rails'].includes(v)){for(let i=0;i<16;i++)for(let k=0;k<(4-d.rotations[i])%4;k++)await click('cell',i);await click('flow');}
if(v==='unroll'){for(const [a,b] of [...d.swaps].reverse()){await click('cell',a);await click('cell',b);}await click('flow');}
assert.equal((await state()).phase,'feedback',v+' solvable');
}else{
if(v==='chess'){for(const [a,z] of [[53,45],[12,28],[54,38],[3,39]]){await click('cell',a);await click('cell',z);}assert.equal((await state()).phase,'feedback','fools mate');}
if(v==='tic'){for(const i of [0,3,1,4,2])await click('cell',i);assert.equal((await state()).phase,'feedback');}
if(v==='fourrow'){for(const i of [0,1,0,1,0,1,0])await click('cell',i);assert.equal((await state()).phase,'feedback');}
if(v==='corners'){for(const i of [0,24,1,23,5,22,6])await click('cell',i);assert.equal((await state()).phase,'feedback');}
if(v==='mancala'){await click('pit',2);assert.equal((await state()).data.turn,0);assert.equal((await state()).data.pits.reduce((a,b)=>a+b,0),48);}
if(['checkers','kids'].includes(v)){const move=await p.evaluate(()=>labCheckerMoves(game.session.data)[0]);await click('cell',move.from);await click('cell',move.to);assert.equal((await state()).data.turn,1);}
if(v==='dominoes'){await click('domino',0);assert.equal((await state()).data.hands[0].length,6);}
if(v==='honeycomb'){await click('honey',0);assert.equal((await state()).data.turn,1);}
}console.log('PASS '+v);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.setViewportSize({width:390,height:844});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.setViewportSize({width:1366,height:768});}assert.deepEqual(errors,[]);}finally{await b.close();}
