import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {pathToFileURL} from 'node:url';const {chromium}=await import(pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE).href);const b=await chromium.launch(),p=await b.newPage({viewport:{width:1366,height:768}}),errors=[];p.on('pageerror',e=>errors.push(e.message));const click=(a,n)=>p.locator('[data-mode-action="lab-'+a+'"]'+(n===undefined?'':'[data-value="'+n+'"]')).first().click();const st=()=>p.evaluate(()=>({s:game.session,done:game.done}));const base=process.env.OXFORD_TEST_URL||'http://127.0.0.1:4174';
try{await fs.mkdir('output/playmath/qa',{recursive:true});await p.goto(base);const packs=await p.evaluate(()=>GAMES.filter(g=>["number","logic"].includes(LAB_GAMES[g.format]?.engine)).map(g=>({id:g.id,format:g.format})));assert.ok(await p.evaluate(()=>GAMES.map(validateLesson).length));for(const pack of packs){await p.goto(base+'/?game='+pack.id);await p.locator('#start-game').click();await p.waitForTimeout(80);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:'output/playmath/qa/'+pack.format+'.png'});let guard=0;while(!(await st()).done&&guard++<10){const {s}=await st(),d=s.data,v=s.config.variant;if(s.phase==='feedback'){await click('next');continue;}
if(s.config.engine==='number'){
 if(v==='arithmagons'){for(let i=0;i<3;i++){await click('tile',d.tiles.indexOf(d.values[i]));await click('slot',i);}await click('check');}
 if(v==='numberline')await click('line',d.line);
 if(v==='big'){for(let i=0;i<3;i++)for(let k=0;k<d.values[i];k++)await click('place',i);await click('check');}
 if(v==='small'||v==='perimeter'){for(let i=0;i<(v==='small'?d.a:2*(d.a+d.b));i++)await click('more');await click('check');}
 if(v==='multiply'||v==='array'||v==='piggy'){await p.locator('#lab-number').fill(String(v==='piggy'?d.target:d.a*d.b));await p.locator('#lab-number').press('Enter');}
 if(v==='fraction'||v==='fraction2'){for(let i=0;i<d.numerator;i++)await click('part',i);await click('check');}
 if(v==='change'){let amount=d.paid-d.price;for(let i=d.coins.length-1;i>=0;i--)while(amount>=d.coins[i]){await click('coin',i);amount-=d.coins[i];}await click('check');}
}
if(s.config.engine==='logic'){
 if(v==='deduction'){for(let i=0;i<3;i++)await click('pick',i*3+d.solution[i]);await click('check');}
 if(v==='mystery'){for(let i=0;i<3;i++)await click('cell',i*3+d.solution[i]/2-1);await click('check');}
 if(v==='crossword'){for(let i=0;i<4;i++){await click('digit',d.solution[i]);await click('cell',i);}await click('check');}
 if(v==='distance'){for(let i=0;i<5;i++){await click('choose',d.solution[i]);await click('cell',i);}await click('check');}
 if(v==='sudoku'){for(let i=0;i<16;i++)if(!d.fixed.includes(i)){await click('choose',d.solution[i]-1);await click('cell',i);}await click('check');}
 if(v==='yinyang'){for(let i=0;i<16;i++)if(!d.fixed.includes(i)){await click('cell',i);if(d.solution[i])await click('cell',i);}await click('check');}
 if(v==='lights')for(const i of [...d.scramble].reverse()){if((await st()).s.phase!=='play')break;await click('cell',i);}
 if(v==='slider'||v==='picture'||v==='sumslider'){for(const i of [...d.scramble].reverse())await click('cell',i);await click('check');}
 if(v==='swap'||v==='sumlines'){let board=[...d.board];for(let i=0;i<board.length;i++)if(board[i]!==d.solution[i]){const j=board.indexOf(d.solution[i]);await click('cell',i);await click('cell',j);[board[i],board[j]]=[board[j],board[i]];}await click('check');}
}
assert.equal((await st()).s.phase,'feedback',pack.id+' solved');}
assert.ok((await st()).done,pack.id+' complete');await p.locator('[data-replay]').click();await p.setViewportSize({width:390,height:844});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),pack.id+' mobile');await p.setViewportSize({width:1366,height:768});console.log('PASS '+pack.id);}
assert.deepEqual(errors,[]);}finally{await b.close();}
