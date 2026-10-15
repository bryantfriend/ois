import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const ctx=vm.createContext({LAB_ENGINES:{},Math});for(const p of ['dist/lab-physics-levels.js','dist/lab-physics.js'])vm.runInContext(fs.readFileSync(p,'utf8'),ctx);const answers=JSON.parse(fs.readFileSync('scripts/lab-physics-solutions.json','utf8'));let failures=[];
for(const a of answers){const d=ctx.labPhysicsCreate(a.id);Object.assign(d,{lines:a.lines,lineMaterials:a.materials,speed:a.speed,angle:a.angle,mass:a.mass});ctx.labPhysicsReset(d);d.running=true;for(let k=0;k<6000&&d.running;k++)ctx.labPhysicsTick(d,.004);if(!d.result?.success)failures.push({id:a.id,result:d.result,ball:d.ball,stars:d.collected,bounces:d.bounces});}
console.log('Reference failures:',JSON.stringify(failures));console.log('PASS',80-failures.length,'of 80');
assert.equal(failures.length,0,'Every authored puzzle must be solvable');
// Scientific invariants, independent of the authored solution fixtures.
function free(mass,gravity=9.81){const d=ctx.labPhysicsCreate(1);Object.assign(d,{mass,gravity,fixed:[],blocks:[],lines:[],stars:[],goal:[-1000,-1000]});ctx.labPhysicsReset(d);d.running=true;ctx.labPhysicsTick(d,.5);return d;}
const one=free(1),two=free(2),moon=free(1,1.62);
assert.ok(Math.abs(ctx.labPhysicsMeasure(one).speed-9.81*.5)<1e-9);
assert.equal(one.ball.y,two.ball.y);assert.equal(one.ball.vy,two.ball.vy);
assert.equal(ctx.labPhysicsMeasure(two).kinetic,2*ctx.labPhysicsMeasure(one).kinetic);
assert.ok(Math.abs(ctx.labPhysicsMeasure(moon).speed-1.62*.5)<1e-9);
const ball={x:100,y:90,vx:0,vy:100};ctx.labPhysicsContact(ball,[0,100],[200,100],{e:.82,mu:0},196.2,.004);assert.ok(Math.abs(ball.vy+82)<1e-9);
const runLine=points=>{const d=ctx.labPhysicsCreate(9);d.lines=[points];d.lineMaterials=['bounce'];d.running=true;ctx.labPhysicsTick(d,2);return d.ball;};
const long=runLine([[150,330],[500,330]]),sampled=runLine(Array.from({length:21},(_,i)=>[150+i*17.5,330]));
for(const key of ['x','y','vx','vy'])assert.ok(Math.abs(long[key]-sampled[key])<1e-7,'Polyline sampling invariance '+key);
console.log('PASS SI acceleration, Moon gravity, mass independence, kinetic energy, restitution, sampled-line invariance');
