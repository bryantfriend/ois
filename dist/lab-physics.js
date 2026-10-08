// Point-mass physics in SI units: 20 SVG units = 1 metre; no air drag or spin.
const LAB_PHYSICS_SCALE=20;
const LAB_PHYSICS_TIERS=[
 {name:'Easy',tag:'Explore',description:'Gravity, slopes and first experiments.'},
 {name:'Medium',tag:'Apply',description:'Gaps, changes of direction and controlled landings.'},
 {name:'Hard',tag:'Analyse',description:'Combine motion, friction and energy constraints.'},
 {name:'Expert',tag:'Engineer',description:'Precision routes, measurements and multiple constraints.'}
];
const LAB_PHYSICS_MATERIALS={smooth:{name:'Smooth',mu:.015,e:0,color:'#7856c7'},rough:{name:'Rough',mu:.28,e:0,color:'#bd7948'},bounce:{name:'Bouncy',mu:.015,e:.82,color:'#26a19f'}};
function labPhysicsReset(d){
 d.ball={x:d.start[0],y:d.start[1],vx:d.launch?d.speed*Math.cos(d.angle*Math.PI/180)*(d.launch.direction||1):d.velocity[0],vy:d.launch?-d.speed*Math.sin(d.angle*Math.PI/180):d.velocity[1]};
 d.running=false;d.age=0;d.collected=d.stars.map(()=>false);d.nextStar=0;d.trace=[];d.maxSpeed=0;d.bounces=0;d.distance=0;d.result=null;d.goalMiss=null;d.energyStart=.5*d.mass*(Math.hypot(d.ball.vx,d.ball.vy)/LAB_PHYSICS_SCALE)**2+d.mass*d.gravity*(388-d.ball.y)/LAB_PHYSICS_SCALE;
}
function labPhysicsCreate(id){
 const p=LAB_PHYSICS_PUZZLES[(Math.max(1,Number(id)||1)-1)%80];const d=JSON.parse(JSON.stringify(p));
 Object.assign(d,{lines:[],lineMaterials:[],ink:0,tool:d.materials[0],speed:d.launch?.speed||0,angle:d.launch?.angle||0,mass:d.mass||1,prediction:null,trials:[],attempt:0});labPhysicsReset(d);return d;
}
function labPhysicsSegments(d){
 const lines=d.fixed.map(l=>({points:l.points,mu:l.mu||0,e:l.e||0}));
 for(const [x,y,w,h] of d.blocks)lines.push(...[[[x,y],[x+w,y]],[[x+w,y],[x+w,y+h]],[[x+w,y+h],[x,y+h]],[[x,y+h],[x,y]]].map(points=>({points,mu:.12,e:0})));
 d.lines.forEach((points,i)=>lines.push({points, ...LAB_PHYSICS_MATERIALS[d.lineMaterials[i]||'smooth']}));return lines;
}
function labPhysicsContact(b,a,c,s,g,h){
 const dx=c[0]-a[0],dy=c[1]-a[1],length=dx*dx+dy*dy;if(!length)return;
 const t=Math.max(0,Math.min(1,((b.x-a[0])*dx+(b.y-a[1])*dy)/length)),x=a[0]+t*dx,y=a[1]+t*dy,dist=Math.hypot(b.x-x,b.y-y);
 if(dist>=11.8)return 0;
 const nx=dist?(b.x-x)/dist:0,ny=dist?(b.y-y)/dist:-1,vn=b.vx*nx+b.vy*ny;
 b.x=x+nx*11.8;b.y=y+ny*11.8;
 let rebound=0;
 if(vn<0){const e=Math.abs(vn)>12?s.e:0;b.vx-=(1+e)*vn*nx;b.vy-=(1+e)*vn*ny;if(e&&vn<-25)rebound=1;}
 const tx=-ny,ty=nx,vt=b.vx*tx+b.vy*ty,drag=Math.min(Math.abs(vt),s.mu*g*Math.abs(ny)*h);b.vx-=Math.sign(vt)*drag*tx;b.vy-=Math.sign(vt)*drag*ty;
 return rebound;
}
function labPhysicsMeasure(d){const speed=Math.hypot(d.ball.vx,d.ball.vy)/LAB_PHYSICS_SCALE,height=Math.max(0,(388-d.ball.y)/LAB_PHYSICS_SCALE);return {time:d.age,speed,height,kinetic:.5*d.mass*speed*speed,potential:d.mass*d.gravity*height,total:.5*d.mass*speed*speed+d.mass*d.gravity*height,maxSpeed:d.maxSpeed/LAB_PHYSICS_SCALE,bounces:d.bounces,distance:d.distance/LAB_PHYSICS_SCALE};}
function labPhysicsTick(d,dt){
 if(!d.running)return;const steps=Math.max(1,Math.ceil(dt/.004)),h=dt/steps,g=d.gravity*LAB_PHYSICS_SCALE,segments=labPhysicsSegments(d),b=d.ball;
 for(let k=0;k<steps;k++){
  const oldX=b.x,oldY=b.y;b.vy+=g*h;b.x+=b.vx*h;b.y+=b.vy*h;d.age+=h;
  // One contact per continuous line prevents sampled joins adding extra impulses.
  for(const l of segments){let closest=null,best=Infinity;for(let j=1;j<l.points.length;j++){const a=l.points[j-1],c=l.points[j],dx=c[0]-a[0],dy=c[1]-a[1],len=dx*dx+dy*dy;if(!len)continue;const t=Math.max(0,Math.min(1,((b.x-a[0])*dx+(b.y-a[1])*dy)/len)),distance=(b.x-a[0]-t*dx)**2+(b.y-a[1]-t*dy)**2;if(distance<best){best=distance;closest=[a,c];}}if(closest)d.bounces+=labPhysicsContact(b,...closest,l,g,h);}
  if(b.y>378){b.y=378;if(b.vy>0)b.vy=0;b.vx=Math.sign(b.vx)*Math.max(0,Math.abs(b.vx)-.16*g*h);}
  if(b.x<10){b.x=10;b.vx=Math.abs(b.vx)*.25;}if(b.x>590){b.x=590;b.vx=-Math.abs(b.vx)*.25;}
  if(b.y<10){b.y=10;b.vy=Math.abs(b.vy)*.1;}
  d.maxSpeed=Math.max(d.maxSpeed,Math.hypot(b.vx,b.vy));d.distance+=Math.hypot(b.x-oldX,b.y-oldY);
  if(d.hazards.some(([x,y,w,height])=>Math.hypot(b.x-Math.max(x,Math.min(x+w,b.x)),b.y-Math.max(y,Math.min(y+height,b.y)))<10)){d.result={success:false,reason:'The ball touched lava. Change the route or the launch.'};d.running=false;break;}
  const star=d.stars[d.nextStar];if(star&&Math.hypot(b.x-star[0],b.y-star[1])<d.starRadius){d.collected[d.nextStar]=true;d.nextStar++;}
  if(Math.hypot(b.x-d.goal[0],b.y-d.goal[1])<d.goalRadius){
   const m=labPhysicsMeasure(d);let reason='';
   if(d.nextStar<d.stars.length)reason='Visit the numbered checkpoints in order before the target.';
   else if(d.minBounces&&d.bounces<d.minBounces)reason='The target needs '+d.minBounces+' rebound'+(d.minBounces>1?'s':'')+'. Use an elastic surface.';
   else if(d.speedBand&&(m.speed<d.speedBand[0]||m.speed>d.speedBand[1]))reason='Arrival speed '+m.speed.toFixed(1)+' m/s is outside '+d.speedBand.join('–')+' m/s. Adjust friction or launch speed.';
   else if(d.energyBand&&(m.kinetic<d.energyBand[0]||m.kinetic>d.energyBand[1]))reason='Arrival kinetic energy '+m.kinetic.toFixed(1)+' J is outside '+d.energyBand.join('–')+' J. Compare mass and speed.';
   else if(d.timeBand&&(m.time<d.timeBand[0]||m.time>d.timeBand[1]))reason='Arrival time '+m.time.toFixed(2)+' s is outside '+d.timeBand.join('–')+' s. Adjust the path or launch.';
   if(!reason){d.result={success:true,reason:'Target reached with every constraint satisfied.',measurement:m};d.running=false;break;}d.goalMiss=reason;
  }
  if(d.age>20){d.result={success:false,reason:d.goalMiss||'The ball stopped short. Inspect the trail and try a different design.'};d.running=false;break;}
 }
 if(!d.trace.length||d.age-d.trace.at(-1).t>.045)d.trace.push({x:b.x,y:b.y,t:d.age});
}
function labPhysicsNewSession(){game.session.phase='difficulty';game.session.completed=[];game.session.physics=true;}
function labPhysicsSelectTier(tier){
 const s=game.session;s.tier=tier;game.items=JSON.parse(JSON.stringify(game.lesson.items.filter(q=>Math.floor((Number(q.answer)-1)%80/20)===tier)));if(!game.items.length)return;
 game.index=0;game.done=false;labPhysicsRound();
}
function labPhysicsRound(){const s=game.session;s.phase='play';s.message='';s.moves=0;s.seed=Number(current().answer);s.data=labPhysicsCreate(s.seed);game.answered=false;game.feedbackGood=false;game.correct=game.items.filter(q=>s.completed.includes((Number(q.answer)-1)%80+1)).length;}
function labPhysicsHandle(button){
 if(ui.view!=='player'||button.disabled)return;const s=game.session,d=s.data,a=button.dataset.modeAction.slice(4),n=Number(button.dataset.value);
 if(a==='tier'){labPhysicsSelectTier(n);renderGame();return;}
 if(a==='physics-menu'){s.phase='difficulty';game.done=false;renderGame();return;}
 if(a==='physics-level'){const index=game.items.findIndex(q=>Number(q.answer)===n);if(index>=0){game.index=index;labPhysicsRound();}renderGame();return;}
 if(a==='next'){if(game.index+1<game.items.length){game.index++;labPhysicsRound();}else s.phase='difficulty';renderGame();return;}
 if(a==='retry'){labPhysicsRound();renderGame();return;}
 if(a==='prediction'){d.prediction=n;renderGame();return;}
 if(a==='material'){if(!d.running&&d.materials.includes(button.dataset.material))d.tool=button.dataset.material;renderGame();return;}
 if(a==='release'){if(d.running)return;labPhysicsReset(d);d.testPrediction=d.prediction;d.attempt++;s.message='';d.running=true;s.phase='play';}
 if(a==='resetball'){labPhysicsReset(d);s.phase='play';s.message='';}
 if(a==='undo'&&!d.running){d.lines.pop();d.lineMaterials.pop();d.ink=labPhysicsInk(d.lines);}
 renderGame();
}
function labPhysicsInk(lines){return lines.reduce((sum,line)=>sum+line.slice(1).reduce((s,p,i)=>s+Math.hypot(p[0]-line[i][0],p[1]-line[i][1]),0),0);}
function labPhysicsGoalText(d){return [d.stars.length?'Checkpoints 1 → '+d.stars.length:'Reach the pink target',d.minBounces?d.minBounces+' rebound'+(d.minBounces>1?'s':''):'',d.speedBand?'Arrive '+d.speedBand.join('–')+' m/s':'',d.energyBand?'Arrive '+d.energyBand.join('–')+' J':'',d.timeBand?'Arrive '+d.timeBand.join('–')+' s':''].filter(Boolean).join(' · ');}
function labPhysicsBoard(d){
 const pts=line=>line.map(p=>p.join(',')).join(' '),line=(p,color,width=5,extra='')=>`<polyline points="${pts(p)}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round" ${extra}/>`;
 return `<svg id="lab-physics" viewBox="0 0 600 400" class="lab-drawing" aria-label="Physics drawing board: draw only inside the teal build areas"><defs><linearGradient id="lab-sky" x2="0" y2="1"><stop stop-color="#e1f3ff"/><stop offset="1" stop-color="#fff2d6"/></linearGradient><pattern id="lab-lava" width="24" height="16" patternUnits="userSpaceOnUse"><rect width="24" height="16" fill="#eb6651"/><path d="M0 9q6-8 12 0t12 0" fill="none" stroke="#ffd066" stroke-width="3"/></pattern></defs><rect width="600" height="400" fill="url(#lab-sky)"/><path d="M0 388H600" stroke="#71869d" stroke-width="5"/>${d.zones.map(([x,y,w,h])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#42bcaa14" stroke="#248d86" stroke-dasharray="5 5" rx="4"/>`).join('')}${d.blocks.map(([x,y,w,h])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#778a9e" stroke="#4a6379" rx="3"/>`).join('')}${d.hazards.map(([x,y,w,h])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#lab-lava)"/>`).join('')}${d.fixed.map(s=>line(s.points,s.e?'#26a19f':s.mu>.1?'#bd7948':'#71869d',6)).join('')}<polyline id="lab-trail" points="${d.trace.map(p=>p.x+','+p.y).join(' ')}" stroke="#359cce88" stroke-width="2" fill="none" stroke-dasharray="3 4"/>${d.stars.map((p,i)=>`<g id="lab-star-${i}" transform="translate(${p[0]} ${p[1]})" opacity="${d.collected[i]?.3:1}"><circle r="${d.starRadius}" fill="#fbd76033" stroke="#b37b12" stroke-dasharray="3 3"/><circle r="10" fill="#ffd35a"/><text y="5" text-anchor="middle" fill="#4c3c1f" font-size="14" font-weight="bold">${i+1}</text></g>`).join('')}<circle cx="${d.goal[0]}" cy="${d.goal[1]}" r="${d.goalRadius+8}" fill="#e672a82b" stroke="#d9508f" stroke-width="2"/><text x="${d.goal[0]}" y="${d.goal[1]+5}" text-anchor="middle" fill="#b13d75">♥</text><g id="lab-ramps">${d.lines.map((p,i)=>line(p,LAB_PHYSICS_MATERIALS[d.lineMaterials[i]].color)).join('')}</g><circle id="lab-ball" cx="${d.ball.x}" cy="${d.ball.y}" r="10" fill="#359cce" stroke="white" stroke-width="3"/><path d="M${d.start[0]} ${d.start[1]}v25m-5-7 5 7 5-7" stroke="#359cce" fill="none" stroke-width="2"/><text x="16" y="23" fill="#426479" font-size="12">↓ g = ${d.gravity} m/s² · 20 units = 1 m</text></svg>`;
}
function labPhysicsReadout(d){const m=labPhysicsMeasure(d);return `<div class="lab-physics-readings" id="lab-readings"><span>Time <b>${m.time.toFixed(2)} s</b></span><span>Speed <b>${m.speed.toFixed(1)} m/s</b></span><span>Height <b>${m.height.toFixed(1)} m</b></span><span>KE <b>${m.kinetic.toFixed(1)} J</b></span></div>`;}
function labPhysicsDebrief(d){
 if(!d.result)return '';const m=d.result.measurement||labPhysicsMeasure(d),prediction=d.testPrediction==null?'No prediction recorded.':(d.testPrediction===d.science.correct?'Your prediction matched the physics.':'Revise your prediction using the evidence.');
 return `<div class="lab-physics-debrief" role="status"><strong>${d.result.success?'Experiment complete':'Revise and test again'}</strong><p>${esc(d.result.reason)}</p><p>${prediction} ${esc(d.science.explain)}</p><p><b>Discuss:</b> ${esc(d.science.reflect)}</p><small>Measured: ${m.time.toFixed(2)} s · ${m.speed.toFixed(1)} m/s · ${m.kinetic.toFixed(1)} J · ${d.bounces} rebounds. Peak speed ${(d.maxSpeed/20).toFixed(1)} m/s.</small></div>`;
}
function labPhysicsRender(){
 const s=game.session;$('#play-title').textContent=game.lesson.title;$('#play-format').textContent='Oxford Draw Together';$('#play-subtitle').textContent='Physics design lab';$('.player-bottom>span').textContent='Predict → build → measure → explain';
 $('#scoreboard').innerHTML=`<div class="class-score"><strong>${s.completed.length} / 80 puzzles solved</strong><span>Physics design lab</span></div>`;
 if(s.phase==='difficulty'){
  const counts=LAB_PHYSICS_TIERS.map((_,t)=>game.lesson.items.filter(q=>Math.floor((Number(q.answer)-1)%80/20)===t).length);
  $('#arena').innerHTML=`<div class="lab-game lab-physics-menu" data-lab-engine="physics"><h2>Choose your challenge</h2><p>Draw routes, test a prediction, and explain the measurements.</p><div class="lab-difficulty-grid">${LAB_PHYSICS_TIERS.map((t,i)=>`<button class="lab-tier-card" data-mode-action="lab-tier" data-value="${i}" ${counts[i]?'':'disabled'}><b>${t.name}</b><span>${t.description}</span><small>${counts[i]} puzzles · ${s.completed.filter(n=>Math.floor((n-1)/20)===i).length} solved</small></button>`).join('')}</div><p class="lab-model-note">Model: an ideal sliding ball, no air drag or spin. Gravity, friction and rebound are simulated. Energies use a 1 kg ball unless you change its mass.</p></div>`;LAB_ENGINES.physics.bind(s.data);return;
 }
 const d=s.data,tier=LAB_PHYSICS_TIERS[d.tier],locked=d.running,m=LAB_PHYSICS_MATERIALS[d.tool];
 const selection=`<div class="lab-physics-nav">${labButton('physics-menu','← Difficulties')}<label>Puzzle <select id="lab-level-select" ${locked?'disabled':''}>${game.items.map(q=>{const p=LAB_PHYSICS_PUZZLES[(Number(q.answer)-1)%80];return `<option value="${q.answer}" ${Number(q.answer)===s.seed?'selected':''}>${p.level}. ${esc(p.title)}${s.completed.includes(p.id)?' ✓':''}</option>`;}).join('')}</select></label><span>${tier.name} · ${game.index+1} / ${game.items.length}</span></div>`;
 $('#arena').innerHTML=`<div class="lab-game" data-lab-engine="physics">${selection}<div class="lab-physics-heading"><strong>${d.title}</strong><span>${esc(d.task)}</span><small>${esc(labPhysicsGoalText(d))}</small></div><div class="lab-physics-workbench"><div><div id="lab-board-wrap">${labPhysicsBoard(d)}</div><div class="lab-physics-controls">${labButton('release',d.running?'Testing…':'Release ball',0,locked)}${labButton('resetball','Reset ball')}${labButton('undo','Undo',0,locked)}${labButton('retry','Clear design',0,locked)}</div><p id="lab-ink">Ink ${Math.round(d.ink)} / ${d.inkLimit} · Draw inside teal areas</p></div><aside class="lab-science">${d.result?labPhysicsDebrief(d):''}<div class="lab-experiment-inputs" ${d.result?'hidden':''}><b class="lab-concept">${esc(d.science.concept)}</b><p>${esc(d.science.question)}</p><div class="lab-predictions">${d.science.options.map((p,i)=>labButton('prediction',esc(p),i,locked,'aria-pressed="'+(d.prediction===i)+'"')).join('')}</div>${d.launch?`<div class="lab-launch-controls"><label>Launch speed <input id="lab-launch-speed" type="range" min="${d.launch.min}" max="${d.launch.max}" step="1" value="${d.speed}" ${locked?'disabled':''}><output>${(d.speed/20).toFixed(1)} m/s</output></label><label>Angle <input id="lab-launch-angle" type="range" min="${d.launch.angleMin}" max="${d.launch.angleMax}" step="1" value="${d.angle}" ${locked?'disabled':''}><output>${d.angle}°</output></label></div>`:''}${d.adjustMass?`<label class="lab-mass">Mass <select id="lab-mass" ${locked?'disabled':''}>${[.5,1,2,3].map(n=>`<option value="${n}" ${d.mass===n?'selected':''}>${n} kg</option>`).join('')}</select></label>`:''}<div class="lab-materials">${d.materials.map(k=>labButton('material',LAB_PHYSICS_MATERIALS[k].name,0,locked,'data-material="'+k+'" aria-pressed="'+(d.tool===k)+'"')).join('')}</div><small>New lines: μ = ${m.mu} · rebound e = ${m.e}</small>${labPhysicsReadout(d)}<details class="lab-physics-hint"><summary>Physics hint</summary><p>${esc(d.hint)}</p></details>${d.trials.length?`<div class="lab-trial-compare"><b>Compare your trials</b>${d.trials.slice(-3).map(t=>`<span>#${t.attempt}: ${t.speed.toFixed(1)} m/s · ${t.kinetic.toFixed(1)} J · ${t.time.toFixed(2)} s</span>`).join('')}</div>`:''}</div>${d.result?labPhysicsReadout(d):''}</aside></div>${d.result?.success?labButton('next',game.index+1<game.items.length?'Next puzzle →':'Choose another difficulty →'):''}<p class="lab-status" role="status">${esc(s.message)}</p></div>`;
 LAB_ENGINES.physics.bind(d);
}
function labPhysicsBind(d){
 document.querySelectorAll('.lab-game button[data-mode-action]').forEach(button=>{
  button.onpointerdown=e=>{if(e.pointerType!=='touch'||button.disabled)return;e.preventDefault();labPhysicsHandle(button);};
  button.onclick=e=>{if(e.pointerType==='touch'){e.preventDefault();e.stopPropagation();}};
 });
 const level=$('#lab-level-select');if(level)level.onchange=()=>labPhysicsHandle({dataset:{modeAction:'lab-physics-level',value:level.value}});
 for(const [id,key] of [['lab-launch-speed','speed'],['lab-launch-angle','angle'],['lab-mass','mass']]){const el=$('#'+id);if(el)el.oninput=()=>{if(d.running)return;d[key]=Number(el.value);labPhysicsReset(d);const out=el.parentElement.querySelector('output');if(out)out.textContent=key==='speed'?(d.speed/20).toFixed(1)+' m/s':d.angle+'°';const readings=$('#lab-readings');if(readings)readings.outerHTML=labPhysicsReadout(d);};if(el)el.onchange=()=>{game.session.phase='play';renderGame();};}
 const svg=$('#lab-physics');if(!svg||!d)return;let pointer=null,line=null,element=null,zone=null;
 const point=e=>{const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(svg.getScreenCTM().inverse());return [p.x,p.y];};
 const move=e=>{if(e.pointerId!==pointer||!line)return;const raw=point(e),p=[Math.max(zone[0],Math.min(zone[0]+zone[2],raw[0])),Math.max(zone[1],Math.min(zone[1]+zone[3],raw[1]))],last=line.at(-1);let length=Math.hypot(p[0]-last[0],p[1]-last[1]),remaining=d.inkLimit-d.ink;if(length<2||remaining<=0)return;if(length>remaining){p[0]=last[0]+(p[0]-last[0])*remaining/length;p[1]=last[1]+(p[1]-last[1])*remaining/length;length=remaining;}line.push(p);d.ink+=length;element.setAttribute('points',line.map(p=>p.join(',')).join(' '));$('#lab-ink').textContent='Ink '+Math.round(d.ink)+' / '+d.inkLimit+' · Draw inside teal areas';};
 svg.onpointerdown=e=>{if(e.button!==0||d.running||pointer!==null||d.ink>=d.inkLimit)return;const p=point(e);zone=d.zones.find(([x,y,w,h])=>p[0]>=x&&p[0]<=x+w&&p[1]>=y&&p[1]<=y+h);if(!zone){game.session.message='Draw inside a teal build area. Other areas must be crossed in flight.';$('.lab-status').textContent=game.session.message;return;}e.preventDefault();pointer=e.pointerId;svg.setPointerCapture(pointer);line=[p];d.lines.push(line);d.lineMaterials.push(d.tool);element=document.createElementNS('http://www.w3.org/2000/svg','polyline');for(const [a,v] of Object.entries({stroke:LAB_PHYSICS_MATERIALS[d.tool].color,'stroke-width':'5',fill:'none','stroke-linecap':'round'}))element.setAttribute(a,v);$('#lab-ramps').append(element);};
 const finish=e=>{if(e.pointerId!==pointer)return;if(e.type==='pointerup')move(e);if(line.length<2){d.lines.pop();d.lineMaterials.pop();element.remove();}else game.session.moves++;const id=pointer;pointer=null;line=null;if(svg.hasPointerCapture(id))svg.releasePointerCapture(id);};
 svg.onpointermove=move;svg.onpointerup=finish;svg.onpointercancel=finish;svg.onlostpointercapture=finish;
}
LAB_ENGINES.physics={
 init(c,seed){return labPhysicsCreate(seed);},render(d){return labPhysicsBoard(d);},action(){},bind:labPhysicsBind,
 step(d,dt){
  if(!d.running)return;labPhysicsTick(d,dt);
  const ball=$('#lab-ball');if(ball){ball.setAttribute('cx',d.ball.x);ball.setAttribute('cy',d.ball.y);}$('#lab-trail')?.setAttribute('points',d.trace.map(p=>p.x+','+p.y).join(' '));d.collected.forEach((v,i)=>{if(v)$('#lab-star-'+i)?.setAttribute('opacity','.3');});
  const readings=$('#lab-readings');if(readings)readings.outerHTML=labPhysicsReadout(d);
  if(d.result){const m=d.result.measurement||labPhysicsMeasure(d);d.trials.push({...m,attempt:d.attempt});const s=game.session;if(d.result.success){if(!s.completed.includes(d.id)){s.completed.push(d.id);game.score+=100;}game.correct=game.items.filter(q=>s.completed.includes((Number(q.answer)-1)%80+1)).length;game.attempts++;game.feedbackGood=true;s.phase='feedback';}renderGame();}
 }
};
