(() => {
'use strict';
const $=id=>document.getElementById(id),A=window.CargoArt,M=window.CargoMissions;
const KEY='ois-starport-cargo-v1';
let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch{}
const s={grade:Math.min(7,Math.max(1,+saved.grade||1)),concept:saved.concept||'bonds',difficulty:Math.min(2,Math.max(0,+saved.difficulty||0)),ship:Math.min(19,Math.max(0,+saved.ship||0)),delivered:Array.isArray(saved.delivered)?saved.delivered.filter(x=>Number.isInteger(x)&&x>=0&&x<20):[],deliveries:+saved.deliveries||0,muted:!!saved.muted,autoRead:saved.autoRead!==false,gentle:!!saved.gentle||matchMedia('(prefers-reduced-motion: reduce)').matches,started:false,paused:false,phase:'ready',elapsed:0,cargo:[],q:null,transfer:null,arm:{x:445,y:390},voiceDone:true,sequence:0,variant:0,modal:false};
if(!M.concepts[s.grade].some(([id])=>id===s.concept))s.concept=M.concepts[s.grade][0][0];
const requestedGrade=Number(new URLSearchParams(location.search).get('grade'));if(requestedGrade>=1&&requestedGrade<=7&&Number.isInteger(requestedGrade)){s.grade=requestedGrade;s.concept=M.concepts[s.grade][0][0];}
let nextId=1,last=performance.now(),movingCube='',shipTransform='',doorY=-170,flame=0;
let successBag=Array.isArray(saved.successBag)?[...new Set(saved.successBag.filter(i=>Number.isInteger(i)&&i>=0&&i<M.successes.length))]:[];
let lastSuccess=Number.isInteger(saved.lastSuccess)&&saved.lastSuccess>=0&&saved.lastSuccess<M.successes.length?saved.lastSuccess:null;
function persist(){try{localStorage.setItem(KEY,JSON.stringify({grade:s.grade,concept:s.concept,difficulty:s.difficulty,ship:s.ship,delivered:s.delivered,deliveries:s.deliveries,muted:s.muted,autoRead:s.autoRead,gentle:s.gentle,successBag,lastSuccess}));}catch{}}
function nextSuccess(){
 if(!successBag.length){successBag=M.successes.map((_,i)=>i);for(let i=successBag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[successBag[i],successBag[j]]=[successBag[j],successBag[i]];}if(successBag[0]===lastSuccess)[successBag[0],successBag[1]]=[successBag[1],successBag[0]];}
 lastSuccess=successBag.shift();persist();return M.successes[lastSuccess];
}
function sum(){return s.cargo.reduce((v,c)=>v+c.value,0);}
function initialCargo(){return s.q.initial.map(c=>({...c,id:nextId++,colour:Math.max(0,s.q.choices.findIndex(choice=>choice.value===c.value&&choice.label===c.label))}));}
function status(text){$('status').textContent=text;}
function phase(p){s.phase=p;s.elapsed=0;$('phase-label').textContent=({ready:'STANDING BY',landing:'INCOMING SHIP',loading:'CARGO TRANSFER',idle:'READY TO LOAD',success:'PERFECT MANIFEST',closing:'SEALING CARGO DOORS',launch:'CLEARED FOR TAKEOFF',departed:'DELIVERY COMPLETE'})[p]||p;}
function cancel(){window.ClassroomVoice?.cancel();}
async function speak(text){if(s.muted||!s.started||s.paused||s.modal)return {reason:'muted'};return await window.ClassroomVoice.speak(text);}
function slot(i){const cols=s.q.maxCargo===12?6:4,scale=cols===6?.65:.8;return {x:809+(i%cols)*(cols===6?56:85),y:Math.floor(i/cols)===0?369:439,scale};}
function rack(i){const count=s.q.choices.length;return {x:count===2?420+i*220:240+i*132,y:598,scale:count===2?1:1};}
function cubeGroup(c,index,loc,loaded){const blocked=!s.started||s.phase!=='idle'||s.paused||s.modal;const extra=loaded?'':(s.q.rule==='factors'&&s.q.target%c.value!==0)||(!s.q.allowOver&&sum()+c.value>s.q.target);return `<g class="cube-button" data-${loaded?'loaded':'supply'}="${loaded?c.id:index}" role="button" tabindex="${blocked?-1:0}" aria-label="${loaded?'Unload':'Load'} ${A.esc(c.label)}${c.kind?' '+c.kind:''} cargo" aria-disabled="${!!(blocked||extra)}" transform="translate(${loc.x} ${loc.y})">${A.cube(c.label,index,c.kind,loc.scale)}</g>`;}
function scene(){
const supplies=s.q.choices.map((c,i)=>cubeGroup(c,i,rack(i),false)).join('');
$('scene').innerHTML=A.background()+`<g id="ship-wrap">${A.ship(s.ship)}</g><g id="supply-cubes">${supplies}</g><g id="robot"></g><g id="moving-cube"></g>`;
$('ship-name').textContent=`ST-${String(s.ship+1).padStart(2,'0')} · ${A.names[s.ship]}`;
paint();
}
function paint(){
if(!$('robot'))return;
$('robot').innerHTML=A.robot(s.arm);
$('ship-wrap').setAttribute('transform',shipTransform);
$('bay-door').setAttribute('transform',`translate(0,${doorY})`);
$('engine-flames').setAttribute('opacity',flame);
$('loaded-cubes').innerHTML=s.cargo.filter(c=>!(s.transfer?.unload&&s.transfer.cube.id===c.id&&s.transfer.picked)).map(c=>cubeGroup(c,c.colour,slot(s.cargo.indexOf(c)),true)).join('');
$('moving-cube').innerHTML=movingCube;
document.querySelectorAll('[data-supply]').forEach(el=>{const c=s.q.choices[+el.dataset.supply],blocked=!s.started||s.phase!=='idle'||s.paused||s.modal||(s.q.rule==='factors'&&s.q.target%c.value!==0)||(!s.q.allowOver&&sum()+c.value>s.q.target)||s.cargo.length>=s.q.maxCargo;el.setAttribute('aria-disabled',String(!!blocked));el.setAttribute('tabindex',s.started&&s.phase==='idle'&&!s.paused&&!s.modal?'0':'-1');});
}
function ui(){
const q=s.q,total=sum(),conceptName=M.concepts[s.grade].find(([id])=>id===s.concept)[1];
$('question').textContent=q.question;$('target').textContent=q.targetText;
$('target').style.fontSize=q.targetText.length>12?'20px':q.targetText.length>6?'25px':'';
$('instruction').textContent=q.rule==='ratio'?'Blue and orange cargo must match both the count and the ratio.':q.rule==='groups'?`Use exactly ${q.requiredCount} equal cargo cubes.`:q.allowOver?'Negative cubes lower the charge. Click loaded cargo to remove it.':'Click a cube to load it. Click cargo inside the ship to unload it.';
$('mission-tag').textContent=`DOCK 07 · MISSION ${String(s.deliveries+1).padStart(2,'0')}`;
$('lesson-label').textContent=`Grade ${s.grade} · ${conceptName} · ${['Explore','Practise','Challenge'][s.difficulty]}`;
$('equation').textContent=s.cargo.length?s.cargo.map(c=>c.label.startsWith('-')?`(${c.label.replace('-','−')})`:c.label).join(' + '):'Empty hold';
$('total').textContent=q.display(total);const targetSpan=document.createElement('span');targetSpan.textContent=` ${q.unit}`;$('total').append(targetSpan);
$('meter-fill').style.width=`${Math.min(100,Math.abs(total/q.target)*100)}%`;
$('total-label').textContent=q.rule==='ratio'?'CUBES LOADED':q.allowOver?'NET CHARGE':'TOTAL LOADED';
$('delivery-count').textContent=`${s.deliveries} ${s.deliveries===1?'delivery':'deliveries'}`;
$('mute').textContent=s.muted?'Voice off':'Voice on';$('mute').setAttribute('aria-pressed',String(s.muted));$('mute').setAttribute('aria-label',s.muted?'Enable narration':'Mute narration');
$('pause').textContent=s.paused?'Resume':'Pause';$('pause').setAttribute('aria-pressed',String(s.paused));$('pause-screen').hidden=!s.paused;
$('reset').disabled=!s.started||s.paused||s.modal||!['idle','loading'].includes(s.phase);
$('hint').disabled=!s.started||s.paused||s.phase!=='idle';
$('read').disabled=!s.started||s.paused||s.muted;
document.querySelector('.scene-shell').classList.toggle('gentle',s.gentle);
}
function newMission(land=true){cancel();s.sequence++;s.q=M.make(s.grade,s.concept,s.difficulty,s.variant%2);s.variant++;s.transfer=null;s.cargo=initialCargo();s.arm={x:445,y:390};movingCube='';doorY=land?0:-170;shipTransform=land?'translate(900,-200)':'';flame=land?1:0;phase(land?'landing':'idle');status(land?'Incoming cargo ship. Stand clear of the landing pad.':'Choose a cube from the supply rack.');scene();ui();if(!land&&s.started&&s.autoRead)speak(s.q.question);}
function correct(){const q=s.q;if(sum()!==q.target)return false;if(q.rule==='groups')return s.cargo.length===q.requiredCount&&s.cargo.every(c=>c.value===q.groupSize);if(q.rule==='ratio'){const blue=s.cargo.filter(c=>c.kind==='blue').length,orange=s.cargo.length-blue;return blue*q.ratio[1]===orange*q.ratio[0]&&s.cargo.length===q.requiredCount;}if(q.rule==='factors')return s.cargo.every(c=>q.target%c.value===0);return true;}
function success(){phase('success');s.voiceDone=false;const message=nextSuccess();status(message);const seq=s.sequence;speak(message).then(()=>{if(seq===s.sequence)s.voiceDone=true;});ui();}
function reject(text){status(text);speak(text);}
function transfer(c,index,unload=false){
if(!s.started||s.paused||s.modal||s.phase!=='idle')return;
if(!unload){if(s.q.rule==='factors'&&s.q.target%c.value!==0)return reject('Every cube must be a factor of the target. Try another cube.');if(!s.q.allowOver&&sum()+c.value>s.q.target)return reject('That cube would go past the target. Try a smaller cube, or unload something first.');if(s.cargo.length>=s.q.maxCargo)return reject('The cargo hold is full. Remove a cube to make room.');}
const cube=unload?c:{...c,id:nextId++,colour:index};
const from=unload?slot(index):rack(index),to=unload?rack(c.colour):slot(s.cargo.length);
s.transfer={cube,unload,index,from,to,start:{...s.arm},picked:false};
phase('loading');status(`${unload?'Unloading':'Loading'} ${c.label}${c.kind?' '+c.kind:''}. Robot arm in motion.`);ui();paint();
}
const lerp=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t}),ease=t=>t*t*(3-2*t);
function tick(ms,render=true){
if(s.paused||s.modal||!s.started||s.phase==='idle'||s.phase==='ready')return;s.elapsed+=ms;const gentle=s.gentle;
if(s.phase==='landing'){
 const t=Math.min(1,s.elapsed/(gentle?500:2300)),e=ease(t);shipTransform=`translate(${900*(1-e)},${-170*(1-e)})`;doorY=-170*Math.max(0,(t-.65)/.35);flame=1-t;
 if(t===1){shipTransform='';doorY=-170;flame=0;phase('idle');status('Ship docked. Select cargo from the supply rack.');ui();if(s.autoRead)speak(s.q.question);}
}else if(s.phase==='loading'){
 const tr=s.transfer,t=Math.min(1,s.elapsed/(gentle?700:2200)),source={x:tr.from.x+32*tr.from.scale,y:tr.from.y-40*tr.from.scale},dest={x:tr.to.x+32*tr.to.scale,y:tr.to.y-40*tr.to.scale};
 const points=[tr.start,source,source,{x:source.x,y:source.y-135},{x:dest.x,y:Math.min(source.y,dest.y)-135},dest,dest,{x:445,y:390}],times=[0,.15,.23,.36,.56,.72,.8,1];
 let i=0;while(i<times.length-2&&t>times[i+1])i++;s.arm=lerp(points[i],points[i+1],ease((t-times[i])/(times[i+1]-times[i])));tr.picked=t>=.2;
 if(t>=.2&&t<.8){const scale=tr.from.scale+(tr.to.scale-tr.from.scale)*Math.min(1,Math.max(0,(t-.36)/.36));movingCube=`<g transform="translate(${s.arm.x-32*scale} ${s.arm.y+40*scale})">${A.cube(tr.cube.label,tr.cube.colour,tr.cube.kind,scale)}</g>`;}else movingCube='';
 if(t>=.8&&!tr.committed){if(tr.unload)s.cargo=s.cargo.filter(c=>c.id!==tr.cube.id);else s.cargo.push(tr.cube);tr.committed=true;ui();}
 if(t===1){s.transfer=null;movingCube='';phase('idle');ui();if(correct())success();else if(sum()===s.q.target)reject('The total is right. Check the special mission rule before takeoff.');else status(tr.unload?'Cargo returned to the rack. What will you load next?':'Cargo placed. Keep building your answer.');}
}else if(s.phase==='success'){
 if(s.elapsed>700&&s.voiceDone)phase('closing');
}else if(s.phase==='closing'){
 const t=Math.min(1,s.elapsed/(gentle?350:1200));doorY=-170*(1-ease(t));if(t===1){phase('launch');status(`${A.names[s.ship]} cleared for takeoff!`);}
}else if(s.phase==='launch'){
 const t=Math.min(1,s.elapsed/(gentle?600:2500));flame=Math.min(1,t*3);shipTransform=`translate(${1500*t*t},${-360*t*t})`;if(t===1){s.deliveries++;if(!s.delivered.includes(s.ship))s.delivered.push(s.ship);persist();phase('departed');status('Delivery complete! Your next ship is approaching.');ui();}
}else if(s.phase==='departed'&&s.elapsed>(gentle?300:1000)){s.ship=(s.ship+1)%20;persist();newMission();}
if(render)paint();
}
function frame(now){const dt=Math.min(60,now-last);last=now;tick(dt);requestAnimationFrame(frame);}requestAnimationFrame(frame);
function togglePause(){if(!s.started)return;s.paused=!s.paused;if(s.paused){cancel();s.voiceDone=true;}ui();paint();}
function openDialog(id){if(s.transfer){status('Please let the robot finish this transfer before opening a panel.');return;}s.modal=true;cancel();s.voiceDone=true;$(id).showModal();ui();paint();}
function closeDialog(){s.modal=false;ui();paint();}
function fillConcepts(){const g=+$('grade').value;$('concept').innerHTML=M.concepts[g].map(([id,label])=>`<option value="${id}">${label}</option>`).join('');}
function settings(){ $('grade').value=s.grade;fillConcepts();$('concept').value=s.concept;$('difficulty').value=s.difficulty;$('auto-read').checked=s.autoRead;$('motion').checked=s.gentle;openDialog('settings');}
function fleet(){ $('fleet-grid').innerHTML=A.names.map((name,id)=>`<button class="fleet-card ${s.ship===id?'selected':''} ${s.delivered.includes(id)?'delivered':''}" data-ship="${id}" aria-label="Select ${A.esc(name)}"><svg viewBox="630 200 740 390" aria-hidden="true">${A.ship(id,{mini:true})}</svg><b>${String(id+1).padStart(2,'0')} · ${name}</b><small>${s.delivered.includes(id)?'✓ DELIVERY LOGGED':s.ship===id?'CURRENT SHIP':'READY FOR SERVICE'}</small></button>`).join('');openDialog('fleet');}
$('grade').innerHTML=Array.from({length:7},(_,i)=>`<option value="${i+1}">Grade ${i+1}</option>`).join('');
$('grade').addEventListener('change',fillConcepts);
$('settings-btn').onclick=settings;$('fleet-btn').onclick=fleet;
for(const id of ['settings','fleet'])$(id).addEventListener('close',closeDialog);
$('close-fleet').onclick=()=>$('fleet').close();
$('apply').onclick=()=>{s.grade=+$('grade').value;s.concept=$('concept').value;s.difficulty=+$('difficulty').value;s.autoRead=$('auto-read').checked;s.gentle=$('motion').checked;s.variant=0;s.paused=false;s.started=true;s.modal=false;$('welcome').hidden=true;$('settings').close();persist();newMission();};
$('fleet-grid').onclick=e=>{const b=e.target.closest('[data-ship]');if(!b)return;s.ship=+b.dataset.ship;s.modal=false;$('fleet').close();persist();newMission(s.started);};
$('start').onclick=()=>{s.started=true;$('welcome').hidden=true;newMission();};
$('scene').addEventListener('click',e=>{const el=e.target.closest('[data-supply],[data-loaded]');if(!el)return;if(el.hasAttribute('data-supply')){const i=+el.dataset.supply;transfer(s.q.choices[i],i);}else{const i=s.cargo.findIndex(c=>c.id===+el.dataset.loaded);if(i>=0)transfer(s.cargo[i],i,true);}});
$('scene').addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)&&e.target.closest('[role=button]')){e.preventDefault();e.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
$('mute').onclick=()=>{s.muted=!s.muted;if(s.muted){cancel();s.voiceDone=true;}persist();ui();};
$('pause').onclick=togglePause;$('resume').onclick=togglePause;
$('read').onclick=()=>speak(s.q.question);
$('hint').onclick=()=>{if(s.phase!=='idle'||s.paused)return;status(s.q.hint);speak(s.q.hint);};
$('reset').onclick=()=>{if(s.paused||!s.started)return;cancel();s.sequence++;s.transfer=null;s.cargo=initialCargo();s.arm={x:445,y:390};movingCube='';phase('idle');status('Manifest reset. Try a new cargo combination.');ui();paint();};
async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{status('Use your browser full-screen control to expand the spaceport.');}}
$('fullscreen').onclick=fullscreen;
document.addEventListener('keydown',e=>{if(e.target.matches('input,select,textarea')||s.modal)return;if(e.key.toLowerCase()==='f')fullscreen();if(e.key.toLowerCase()==='p')togglePause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&s.started&&!s.paused)togglePause();});
window.addEventListener('pagehide',cancel);
window.render_game_to_text=()=>JSON.stringify({coordinateSystem:'SVG 1440x730; origin top-left; x right, y down',started:s.started,phase:s.phase,paused:s.paused,modal:s.modal,grade:s.grade,concept:s.concept,difficulty:s.difficulty,ship:s.ship,shipName:A.names[s.ship],deliveries:s.deliveries,question:s.q.question,target:s.q.target,scale:s.q.scale,rule:s.q.rule,requiredCount:s.q.requiredCount,choices:s.q.choices.map((c,i)=>({...c,...rack(i)})),cargo:s.cargo.map((c,i)=>({...c,...slot(i)})),total:sum(),correct:correct(),transfer:s.transfer?{unload:s.transfer.unload,cube:s.transfer.cube.label,picked:s.transfer.picked}:null,arm:s.arm,doorY,muted:s.muted,narrationBackend:window.ClassroomVoice?.lastBackend});
window.advanceTime=ms=>{for(let remaining=ms;remaining>0;remaining-=16.6667)tick(Math.min(16.6667,remaining),false);paint();};
newMission(false);
})();
