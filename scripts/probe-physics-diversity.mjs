import fs from 'node:fs';import vm from 'node:vm';const ctx=vm.createContext({LAB_ENGINES:{},Math});for(const p of ['dist/lab-physics-levels.js','dist/lab-physics.js'])vm.runInContext(fs.readFileSync(p,'utf8'),ctx);let noDraw=[],straight=[];
for(let id=1;id<=80;id++){for(const recipe of ['none','right','left','direct']){const d=ctx.labPhysicsCreate(id);if(recipe!=='none'){d.lines=[recipe==='right'?[[30,80],[570,365]]:recipe==='left'?[[570,80],[30,365]]:[[d.start[0]-20,d.start[1]+45],[d.goal[0],d.goal[1]+12]]];d.lineMaterials=['smooth'];}d.running=true;for(let k=0;k<1300&&d.running;k++)ctx.labPhysicsTick(d,.016);if(d.result?.success)(recipe==='none'?noDraw:straight).push(id);}}
console.log('Unchanged controls / no drawing solve:',noDraw);console.log('Simple slope recipes solve unique:',[...new Set(straight)]);
if(noDraw.join(',')!=='1')throw Error('Only the introductory free-fall puzzle should pass unchanged controls');
if(new Set(straight).size>=20)throw Error('Generic straight slopes solve too much of the puzzle set');
console.log('PASS repeated-route regression: at least 60 puzzles reject all three generic slope recipes, even without build-area restrictions');
