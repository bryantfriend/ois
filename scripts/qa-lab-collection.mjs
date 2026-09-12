
import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {pathToFileURL} from 'node:url';const {chromium}=await import(pathToFileURL(process.env.OXFORD_PLAYWRIGHT_MODULE).href),b=await chromium.launch(),p=await b.newPage({viewport:{width:1366,height:768}}),errors=[];p.on('pageerror',e=>errors.push(e.message));const base='http://127.0.0.1:4174',click=(a,n)=>p.locator('[data-mode-action="lab-'+a+'"]'+(n===undefined?'':'[data-value="'+n+'"]')).first().click(),st=()=>p.evaluate(()=>game.session);const engines=['merge','fit','sums','economy','creative','physics','mosaic'];
try{await p.goto(base);const packs=await p.evaluate(engines=>GAMES.filter(g=>engines.includes(LAB_GAMES[g.format]?.engine)).map(g=>({id:g.id,format:g.format})),engines);assert.equal(packs.length,52);for(const pack of packs.slice(Number(process.env.LAB_FROM||0))){await p.goto(base+'/?game='+pack.id);await p.locator('#start-game').click();await p.waitForTimeout(100);let s=await st(),d=s.data,v=s.config.variant;await p.screenshot({path:'output/playmath/qa/'+pack.format+'.png'});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),v+' width');let solved=true;
if(s.config.engine==='sums'){
if(['regions','fit','chains'].includes(v)){for(let i=0;i<9;i++){await click('tile',d.tiles.indexOf(d.solution[i]));await click('cell',i);}await click('check');}
if(v==='stacks'){await click('stack',2);await click('stack',0);await click('stack',3);await click('stack',1);await click('check');}
if(v==='out'){for(let k=1;k<=4;k++){await click('cell',d.board.indexOf(k));await click('cell',d.board.indexOf(-k));await click('remove');}await click('cell',d.board.indexOf(0));await click('remove');}
if(v==='stretch'||v==='magnet'){await click('cell',0);await click('cell',4);await click('cell',20);await click('cell',24);}
if(v==='hex'){for(let i=0;i<7;i++)if(d.solution[i])await click('hex',i);await click('check');}
if(v==='billy'){for(let i=0;i<3;i++)await click('move',1);await p.locator('#lab-number').fill(String(d.b));await p.locator('#lab-number').press('Enter');}
}
if(s.config.engine==='creative'){
if(v==='rope'){const pts=await p.evaluate(()=>[[420,230],[250,25]].map(([x,y])=>{const p=new DOMPoint(x,y).matrixTransform($('#lab-draw').getScreenCTM());return {x:p.x,y:p.y};}));await p.mouse.move(pts[0].x,pts[0].y);await p.mouse.down();await p.mouse.move(pts[1].x,pts[1].y,{steps:10});await p.mouse.up();await click('check');}
if(v==='hidden')for(const x of d.targets)await click('cell',d.board.indexOf(x));
if(v==='flower'){for(let i=0;i<9;i++){await click('flower',d.solution[i]);await click('cell',i);}await click('check');}
if(v==='paint'||v==='boo'){for(let color=1;color<=3;color++){await click('unmask');for(let i=0;i<8;i++)if(d.target[i]!==color)await click('mask',i);await click('dip',color-1);}await click('check');}
if(v==='dots'){for(let k=0;k<3;k++){await click('colour',k);for(const i of d.solutions[k])await click('cell',i);}await click('check');}
if(v==='line'||v==='missing'){for(const i of d.solution)await click('cell',i);await click('check');}
if(v==='count'){await click('pause');await p.locator('#lab-number').fill(String(d.answer));await p.locator('#lab-number').press('Enter');}
if(v==='race'){for(let k=0;k<8;k++){const lane=(await st()).data.lanes[0];await click('answer',lane.options.indexOf(lane.a*lane.b));}}
if(v==='robot'){for(const n of [0,0,0,0,2,0,0,0,0,2,0,0,0,0])await click('command',n);await click('run');await p.evaluate(()=>advanceTime(7000));}
}
if(s.config.engine==='economy'){
if(v==='market'){for(let guard=0;guard<100&&(await st()).phase==='play';guard++){const z=(await st()).data;for(let i=0;i<3;i++){if(z.stock[i]&&z.prices[i]>=8){for(let k=0;k<z.stock[i]&&(await st()).phase==='play';k++)await click('sell',i);}else if(z.prices[i]<=4){for(let k=0;k<Math.floor(z.cash/z.prices[i])&&(await st()).phase==='play';k++)await click('buy',i);}}if((await st()).phase==='play')await click('travel');}}
if(v==='property')for(let guard=0;guard<80&&(await st()).phase==='play';guard++)await click('roll');
if(v==='mine'){for(const i of [1,2,3,7,11,15])await click('cell',i);for(let k=0;k<14;k++)await click('train');await click('sellore');}
if(v==='clinic')for(let k=0;k<14;k++)await click('treat');
if(v==='factory'||v==='island'){for(let k=0;k<6;k++){if(v==='factory'){await click('ore');await click('ore');}else{await click('wood');await click('wood');await click('food');}await click('craft');await click('selltools');}}
}
if(s.config.engine==='fit'){
if(['packing','tangram','hexa'].includes(v)){for(let k=0;k<4;k++){await click('piece',k);await click('cell',k*4);}}
if(v==='rectangles'){for(const [a,b] of [[0,11],[2,14],[15,21],[17,24]]){await click('cell',a);await click('cell',b);}}
if(v==='parking'){await click('cell',9);await click('move',2);await click('move',2);await click('cell',12);for(let k=0;k<5;k++)await click('move',1);}
if(v==='arrows'){for(const i of [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15])await click('cell',i);}
if(v==='screws'){for(const [from,to] of [[0,3],[2,0],[4,2],[6,4],[8,6],[10,8]]){await click('cell',from);await click('cell',to);}}
if(['block','fall','sand'].includes(v)){await click('cell',0);assert.ok((await st()).data.board.some(Boolean));await click('undo');assert.deepEqual((await st()).data.board,d.board);solved=false;}
}
if(s.config.engine==='merge'){
if(v==='eat'){const used=new Set();for(let i=0;i<16;i++)if(!used.has(i)){const j=d.board.findIndex((x,k)=>k!==i&&!used.has(k)&&x+d.board[i]===10);await click('cell',i);await click('cell',j);await click('feed');used.add(i);used.add(j);}}
if(v==='tile'||v==='bus'||v==='car'){for(let x=1;x<=4;x++)for(let i=0;i<12;i++)if(d.board[i]===x){if(v==='car'){solved=false;break;}await click('cell',i);}}
if(v==='water'||v==='hexa'){const moves=await p.evaluate(()=>{const start=game.session.data.tubes,variant=game.session.config.variant,queue=[{t:start,m:[]}],seen=new Set();for(let k=0;k<queue.length&&k<100000;k++){const {t,m}=queue[k],key=JSON.stringify(t);if(seen.has(key))continue;seen.add(key);if(t.every(a=>!a.length||a.length===4&&a.every(x=>x===a[0])))return m;for(let i=0;i<t.length;i++)for(let j=0;j<t.length;j++)if(i!==j&&t[i].length&&t[j].length<4&&(!t[j].length||t[j].at(-1)===t[i].at(-1))){const copy=t.map(a=>[...a]),color=copy[i].at(-1);do{copy[j].push(copy[i].pop());}while(variant==='water'&&copy[i].at(-1)===color&&copy[j].length<4);queue.push({t:copy,m:[...m,[i,j]]});}}return null;});assert.ok(moves,v+' generated puzzle solvable');for(const [i,j] of moves){await click('tube',i);await click('tube',j);}}
if(v==='jelly'){const moves=await p.evaluate(()=>{const start=game.session.data.board,queue=[{b:start,m:[]}],seen=new Set();for(let k=0;k<queue.length&&k<50000;k++){const {b,m}=queue[k],key=b.join();if(seen.has(key))continue;seen.add(key);if([1,2,3].every(x=>b.filter(v=>v===x).length===1))return m;for(let dir=0;dir<4;dir++){const next=[...b],order=Array.from({length:16},(_,i)=>i).sort((a,b)=>dir===0?a-b:dir===2?b-a:dir===1?b%4-a%4:a%4-b%4);for(const i of order){if(next[i]<=0)continue;let at=i,n=labNeighbour(at,dir,4);while(n>=0&&next[n]===0){next[n]=next[at];next[at]=0;at=n;n=labNeighbour(at,dir,4);}if(n>=0&&next[n]===next[at])next[at]=0;}queue.push({b:next,m:[...m,dir]});}}return null;});assert.ok(moves);for(const i of moves)await click('move',i);}
if(['slide','drop','sticky','dice','get','mergix','car'].includes(v)){solved=false;if(v==='slide')await click('move',3);if(v==='drop')await click('cell',0);if(v==='sticky'){await click('cell',12);await click('cell',13);}if(v==='dice'||v==='get')await click('cell',0);if(v==='mergix')await click('cell',0);}
}
if(s.config.engine==='mosaic'){for(let k=0;k<d.pieces.length;k++){await click('piece',k);if(v==='tangram'){for(let r=0;r<3;r++)await click('rotate');const poly=d.solution[k],x=Math.min(...poly.map(p=>p[0])),y=Math.min(...poly.map(p=>p[1]));await p.locator('[data-mosaic-anchor="'+(y*5+x)+'"]').click();}else await p.locator('[data-mosaic-anchor="'+d.solution[k]+'"]').click();}}
if(s.config.engine==='physics'){const box=await p.locator('#lab-physics').boundingBox(),pt=(x,y)=>({x:box.x+x/600*box.width,y:box.y+y/300*box.height});const a=pt(25,95),z=pt(460,270);await p.mouse.move(a.x,a.y);await p.mouse.down();await p.mouse.move(z.x,z.y,{steps:30});await p.mouse.up();await click('release');await p.evaluate(()=>advanceTime(12000));}
if(solved)assert.equal((await st()).phase,'feedback',pack.id+' solved');else assert.equal((await st()).phase,'play');await p.setViewportSize({width:390,height:844});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),v+' mobile');await p.setViewportSize({width:1366,height:768});console.log('PASS '+pack.id+(solved?' complete':' controls'));}assert.deepEqual(errors,[]);}finally{await b.close();}
