const $ = id => document.getElementById(id);
const types = {
  forest: {name:'Forest', note:'A woodland of tall trees', color:'#49775a', path:'<path d="M12 3l7 8h-4l5 6H4l5-6H5z"/><path d="M12 17v4"/>'},
  camp: {name:'Camp', note:'A place to rest and explore', color:'#b47b36', path:'<path d="M3 20L12 4l9 16z"/><path d="M8 20l4-8 4 8M12 4V1"/>'},
  bridge: {name:'Bridge', note:'A crossing over the water', color:'#997445', path:'<path d="M3 18V8m18 10V8M3 12q9-10 18 0M3 18q9-10 18 0M7 10v5m5-7v5m5-3v5"/>'},
  mountain: {name:'Mountain', note:'A high, rocky peak', color:'#718187', path:'<path d="M2 20L10 4l6 10 2-4 5 10z"/><path d="M7 10l3 2 3-3"/>'},
  ruin: {name:'Ruins', note:'Remains of an ancient tower', color:'#8c8378', path:'<path d="M5 21V4h4v4h6V4h4v17z"/><path d="M10 21v-6h4v6M5 11h14"/>'},
  beacon: {name:'Beacon', note:'A light that guides explorers', color:'#b49338', path:'<path d="M7 21l2-12h6l2 12zM8 9V5l4-3 4 3v4zM3 5H1m22 0h-2M5 1L3 0m16 1l2-1"/>'}
};
function symbol(type, extra='') {const t=types[type];return `<svg viewBox="0 0 24 24" fill="none" stroke="${t.color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${extra}>${t.path}</svg>`;}
function inline(type){return `<span class="inline-symbol" role="img" aria-label="${types[type].name} symbol">${symbol(type)}</span>`;}
const nodes = [
  {id:'A',type:'camp',x:27,y:53}, {id:'B',type:'forest',x:35,y:35},
  {id:'C',type:'bridge',x:49,y:45}, {id:'D',type:'camp',x:64,y:35},
  {id:'E',type:'mountain',x:71,y:22}, {id:'F',type:'forest',x:72,y:54},
  {id:'G',type:'camp',x:55,y:68}, {id:'H',type:'bridge',x:41,y:65},
  {id:'I',type:'ruin',x:30,y:73}, {id:'J',type:'beacon',x:77,y:70},
  {id:'K',type:'ruin',x:53,y:24}, {id:'L',type:'beacon',x:24,y:31}
];
const links = [['A','B'],['A','C'],['B','C'],['B','L'],['C','D'],['C','H'],['C','K'],['D','E'],['D','F'],['D','K'],['F','G'],['F','J'],['G','H'],['G','J'],['H','I'],['I','A']];
const missions = [
  {title:'The first sign', description:'Learn to read the island. Your first map piece is hidden among the trees.', clue:`Find ${inline('forest')}. Choose the one in the north-west of the island.`,targets:['B'],hints:['The key tells you which icon means forest. North-west is the upper-left part of the map.','There are two forest markers. Look for the one above and to the left of the central bridge.'],tip:'North is up. West is left. North-west is toward the upper-left.'},
  {title:'A place to rest',description:'The same symbol can appear in more than one place. Use the whole clue to decide.',clue:`Find ${inline('camp')} north-east of the central ${inline('bridge')}.`,targets:['D'],hints:['Decode both symbols. Find the bridge near the middle, then look above and to its right.','There are three camps. You need the camp connected to the central bridge on its upper-right side.'],tip:'East is right. North-east is toward the upper-right.'},
  {title:'Across the water',description:'The dotted paths show which places are beside each other.',clue:`Find ${inline('camp')} beside the southern ${inline('bridge')}.`,targets:['G'],hints:['Southern means lower on the map. “Beside” means joined by a dotted path.','Look at the lower bridge. One path leads right to a camp; the other leads left to ruins.'],tip:'“Beside” means connected by a dotted path. Trace the path with your eyes.'},
  {title:'The winding trail',description:'Start at the forest marked START. Follow each symbol in order, one path at a time.',clue:`From START, follow this route: ${inline('bridge')} → ${inline('bridge')} → ${inline('ruin')}.`,targets:['C','H','I'],start:'B',hints:['Check the key to decode your next symbol. You can only travel along a path from your current location.','The first bridge is central. The second is farther south. The ruins are left of that southern bridge.'],tip:'Route clues are read from left to right. Each stop must connect to the last one.'},
  {title:'An ancient discovery',description:'Ancient ruins hold another piece of the lost map. Read their symbol carefully.',clue:`Find ${inline('ruin')} north of the central ${inline('bridge')}.`,targets:['K'],hints:['The tower-shaped icon means ruins. Find the one above the central bridge.','The other ruins are in the south-west. Your destination is near the top-middle.'],tip:'Some symbols look similar. Compare their shapes closely in your map key.'},
  {title:'Follow the light',description:'Start at the southern camp. Your final map piece is waiting by a guiding light.',clue:`From START, follow ${inline('forest')} → ${inline('beacon')}.`,targets:['F','J'],start:'G',hints:['Follow a connected path to the forest first. Then look for a connected beacon.','From the southern camp, head up-right to the forest. From there, head down-right to the beacon.'],tip:'A beacon is a guiding light. Its symbol is different from the ruins.'},
  {title:'The lost map, restored',description:'All six pieces fit together! Start at the northern ruins and follow the map to the treasure.',clue:`The treasure route: ${inline('camp')} → ${inline('forest')} → ${inline('beacon')}.`,targets:['D','F','J'],start:'K',hints:['Start at the ruins near the top. Read the restored map from left to right, following connected paths.','Visit the north-eastern camp, then the eastern forest, then the south-eastern beacon.'],tip:'You have everything you need. Read the key, follow the paths, and trust your discoveries.'}
];
let state={mode:'ready',mission:0,step:0,pieces:0,mistakes:0,hints:0,hintLevel:0,visited:[],discovered:[],current:null,selected:null,sound:false,t:0};
let focused=0, audio;
const canvas=$('scene'), ctx=canvas.getContext('2d'), image=new Image();
image.src='assets/island.png';image.onload=()=>draw();
const landmarks=new Image();landmarks.src='assets/landmarks.png';landmarks.onload=()=>draw();
function node(id){return nodes.find(n=>n.id===id);}
function connected(a,b){return links.some(([x,y])=>(x===a&&y===b)||(x===b&&y===a));}
function sound(success=true){if(!state.sound)return;try{audio??=new (window.AudioContext||window.webkitAudioContext)();audio.resume();[0,1,2].forEach((i)=>{const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=(success?[440,554,659]:[220,196,165])[i];g.gain.setValueAtTime(0,audio.currentTime+i*.09);g.gain.linearRampToValueAtTime(.055,audio.currentTime+i*.09+.02);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+i*.09+.3);o.connect(g);g.connect(audio.destination);o.start(audio.currentTime+i*.09);o.stop(audio.currentTime+i*.09+.32);});}catch{}}
function feedback(text,kind=''){$('feedback').textContent=text;$('feedback').className=kind;}
function makeLegend(){
  $('legend-items').innerHTML=Object.entries(types).map(([k,t])=>`<div class="legend-row ${state.mission===4&&['ruin','beacon'].includes(k)?'new':''}"><span class="legend-symbol">${symbol(k)}</span><div><strong>${t.name}</strong><small>${t.note}</small></div></div>`).join('');
}
function makeLocations(){
  $('locations').innerHTML=nodes.map((n,i)=>`<button class="marker" data-id="${n.id}" style="left:${n.x}%;top:${n.y}%" aria-label="Location ${n.id}, ${types[n.type].name} symbol" title="Location ${n.id}" tabindex="${i===focused?0:-1}"><span class="pin">${symbol(n.type)}</span><span class="letter">${n.id}</span></button>`).join('');
  document.querySelectorAll('.marker').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.id)));
}
function updateLocations(){
  document.querySelectorAll('.marker').forEach(b=>{b.disabled=state.mode!=='playing';b.classList.toggle('selected',b.dataset.id===state.selected);b.classList.toggle('visited',state.visited.includes(b.dataset.id));b.classList.remove('hinted');b.querySelector('.letter').textContent=b.dataset.id===state.current&&state.step===0&&missions[state.mission].start?'START':b.dataset.id;});
  const explorer=$('explorer');explorer.style.display=state.current?'block':'none';if(state.current){const n=node(state.current);explorer.style.left=`${n.x}%`;explorer.style.top=`${n.y+7}%`;}
}
function progress(){
  $('pieces').innerHTML=Array.from({length:6},(_,i)=>`<span class="piece ${i<state.pieces?'collected':''}" aria-label="Piece ${i+1} ${i<state.pieces?'collected':'missing'}">${i<state.pieces?'✦':'·'}</span>`).join('');
  $('piece-count').textContent=`${state.pieces} of 6 map pieces found`;
  $('satchel-copy').innerHTML=state.pieces===6?'Your map is complete.<br>The treasure route is revealed.':`${6-state.pieces} pieces still to discover.<br>Each clue brings you closer.`;
}
function renderMission(){
  const m=missions[state.mission];
  $('mission-stage').textContent=state.mission===6?'THE FINAL TREASURE':'EXPEDITION '+(state.mission+1)+' OF 6';
  $('mission-number').textContent=String(state.mission+1).padStart(2,'0');
  $('chapter-label').textContent=state.mission===6?'THE MAP IS RESTORED':'YOUR EXPEDITION';
  $('mission-title').textContent=m.title;$('mission-description').textContent=m.description;
  $('clue').innerHTML=`<span class="eyebrow">${m.start?'FOLLOW THE ROUTE':'DECODE YOUR CLUE'}</span><p>${m.clue}</p>`;
  $('route-steps').innerHTML=m.start?m.targets.map((id,i)=>`<span class="step ${i<state.step?'done':i===state.step?'active':''}" aria-label="Route step ${i+1}: ${types[node(id).type].name}${i<state.step?', completed':''}">${i<state.step?'✓':i+1} ${symbol(node(id).type)}</span>`).join(''):'';
  $('tip').textContent=m.tip;$('hint').disabled=state.mode!=='playing';$('next').hidden=state.mode!=='complete';
  $('next').innerHTML=state.mission===5?'Reveal the treasure map <span>→</span>':'Next clue <span>→</span>';
  $('route-count').textContent=m.start?`${state.step} / ${m.targets.length} stops`:'';
  $('world-status').textContent=state.mode==='complete'?'Map piece discovered!':state.mission===6?'The final trail awaits':m.start?'Follow the dotted paths':'Read the key. Choose a place.';
  makeLegend();progress();updateLocations();draw();
}
function beginMission(){
  state.mode='playing';state.step=0;state.current=missions[state.mission].start||null;state.selected=null;state.hintLevel=0;state.visited=[];
  feedback(missions[state.mission].start?'Your explorer is at START. Choose the first symbol on a connected path.':'Compare the clue with your map key, then tap a marker.');renderMission();
}
function start(){
  state={mode:'playing',mission:0,step:0,pieces:0,mistakes:0,hints:0,hintLevel:0,visited:[],discovered:[],current:null,selected:null,sound:state.sound,t:state.t};
  $('start-screen').hidden=true;$('start-screen').style.display='none';$('win-dialog').close();beginMission();
}
function choose(id){
  if(state.mode!=='playing')return;
  const m=missions[state.mission],target=m.targets[state.step], n=node(id), expected=node(target);
  state.selected=id;
  if(id!==target){
    state.mistakes++;sound(false);
    if(m.start&&id===state.current)feedback('You are already here. Find the next symbol on a path leading away from this marker.','error');
    else if(m.start&&!connected(state.current,id))feedback('That place is not connected to your current stop. Follow one dotted path at a time.','error');
    else if(n.type!==expected.type)feedback(`That symbol means ${types[n.type].name.toLowerCase()}. Check the key: your ${m.start?'next stop':'clue'} asks for ${types[expected.type].name.toLowerCase()}.`,'error');
    else feedback('The symbol matches! Now check its position and the nearby landmarks in the clue.','error');
    updateLocations();draw();return;
  }
  state.current=id;state.visited.push(id);if(!state.discovered.includes(id))state.discovered.push(id);state.step++;sound();
  if(state.step===m.targets.length){
    if(state.mission===6){state.mode='won';feedback('The beacon lights up — and the hidden treasure is yours!','success');renderMission();win();return;}
    state.mode='complete';state.pieces++;
    feedback(`Map piece ${state.pieces} found! ${state.pieces===6?'Your map is complete. Reveal its secret route.':`You found the ${types[n.type].name.toLowerCase()} and read the clue correctly.`}`,'success');
    confetti(12);
  }else feedback(`You reached the ${types[n.type].name.toLowerCase()}. Now follow a connected path to the next symbol.`,'success');
  renderMission();
}
function hint(){if(state.mode!=='playing')return;const m=missions[state.mission];state.hints++;feedback(m.hints[Math.min(state.hintLevel,1)]);state.hintLevel++;if(state.hintLevel>=3){const target=m.targets[state.step];document.querySelector(`[data-id="${target}"]`).classList.add('hinted');feedback('Follow the softly glowing marker. Match its symbol with the key before you select it.');}}
function confetti(count){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;for(let i=0;i<count;i++){const e=document.createElement('span');e.className='confetti';e.style.left=`${15+Math.random()*70}%`;e.style.background=['#e2b552','#81b291','#efca85','#559591'][i%4];e.style.animationDelay=`${Math.random()*.5}s`;document.body.append(e);setTimeout(()=>e.remove(),3500);}}
function win(){
  $('win-stats').innerHTML=`<div><strong>6 / 6</strong><small>Map pieces</small></div><div><strong>${state.mistakes}</strong><small>Learning retries</small></div><div><strong>${state.hints}</strong><small>Hints used</small></div>`;
  $('world-status').textContent='Willow Island treasure found';$('win-dialog').showModal();confetti(45);sound();
}
function reset(){if(state.mode==='ready')return;start();}
function resize(){const r=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
function draw(){
  const {width:w,height:h}=canvas.getBoundingClientRect();ctx.clearRect(0,0,w,h);
  const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#c5e5ed');sky.addColorStop(1,'#e1f2ed');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
  if(image.complete&&image.naturalWidth)ctx.drawImage(image,0,0,w,h);
  else{ctx.fillStyle='#6d9e74';ctx.beginPath();ctx.ellipse(w*.5,h*.52,w*.38,h*.32,0,0,Math.PI*2);ctx.fill();}
  if(state.mode!=='ready'){
    links.forEach(([a,b])=>{const p=node(a),q=node(b);const traveled=state.visited.includes(a)&&state.visited.includes(b);ctx.beginPath();ctx.moveTo(p.x*w/100,p.y*h/100);ctx.lineTo(q.x*w/100,q.y*h/100);ctx.lineWidth=5;ctx.strokeStyle='#3b654960';ctx.setLineDash(traveled?[]:[2,7]);ctx.lineCap='round';ctx.stroke();ctx.lineWidth=traveled?3:2.5;ctx.strokeStyle=traveled?'#ffdf8a':'#fff6d5';ctx.stroke();});ctx.setLineDash([]);
    if(landmarks.complete&&landmarks.naturalWidth){const cellW=landmarks.naturalWidth/3,cellH=landmarks.naturalHeight/2;state.discovered.forEach(id=>{const n=node(id),index=Object.keys(types).indexOf(n.type),size=Math.min(w*.13,100);ctx.drawImage(landmarks,(index%3)*cellW,Math.floor(index/3)*cellH,cellW,cellH,n.x*w/100-size*.5,n.y*h/100-size*.85,size,size);});}
  }
  if(state.mode==='won'){const p=node('J');ctx.save();ctx.translate(p.x*w/100,p.y*h/100);ctx.fillStyle='#ac6b30';ctx.fillRect(-18,-17,36,30);ctx.fillStyle='#e7be5a';ctx.fillRect(-18,-17,36,8);ctx.fillRect(-18,3,36,5);ctx.fillRect(-3,-5,6,8);ctx.restore();}
  for(let i=0;i<7;i++){const x=((i*.147+state.t*.000008)%1)*w,y=(.15+(Math.sin(state.t*.0002+i)*.04)+i*.105)*h;ctx.fillStyle='#fffdf0aa';ctx.beginPath();ctx.arc(x,y,1.4,0,Math.PI*2);ctx.fill();}
}
$('start-btn').onclick=start;$('hint').onclick=hint;
$('next').onclick=()=>{if(state.mode==='complete'){state.mission++;beginMission();}};
$('restart').onclick=()=>{if(state.mode==='ready')return;const d=$('help-dialog');d.innerHTML='<button class="close" aria-label="Close">×</button><span class="eyebrow">A FRESH START</span><h2>Start a new expedition?</h2><p>Your current map pieces will be cleared.</p><button class="primary" id="confirm-restart">Start again →</button><button class="secondary" id="cancel-restart" style="width:100%;margin-top:14px">Keep exploring</button>';d.showModal();d.querySelector('.close').onclick=()=>{d.close();restoreHelp();};$('cancel-restart').onclick=()=>{d.close();restoreHelp();};$('confirm-restart').onclick=()=>{d.close();restoreHelp();reset();};};
const helpMarkup=$('help-dialog').innerHTML;
function restoreHelp(){$('help-dialog').innerHTML=helpMarkup;wireHelp();}
function wireHelp(){$('close-help').onclick=()=> $('help-dialog').close();$('help-done').onclick=()=> $('help-dialog').close();}
wireHelp();$('help').onclick=()=> $('help-dialog').showModal();
$('help-dialog').addEventListener('cancel',()=>setTimeout(restoreHelp,0));
$('replay').onclick=()=>{$('win-dialog').close();start();};$('view-island').onclick=()=> $('win-dialog').close();
$('sound').onclick=()=>{state.sound=!state.sound;$('sound').textContent=state.sound?'Sound on':'Sound off';$('sound').setAttribute('aria-label',state.sound?'Turn sound off':'Turn sound on');if(state.sound)sound();};
async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{feedback('Fullscreen is unavailable in this browser window.');}}
$('fullscreen').onclick=fullscreen;
document.addEventListener('keydown',e=>{
  if(e.key.toLowerCase()==='f'&&!document.querySelector('dialog[open]')){e.preventDefault();fullscreen();}
  if(state.mode==='playing'&&['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(e.key)&&!document.querySelector('dialog[open]')){e.preventDefault();focused=(focused+(['ArrowLeft','ArrowUp'].includes(e.key)?nodes.length-1:1))%nodes.length;document.querySelectorAll('.marker').forEach((b,i)=>b.tabIndex=i===focused?0:-1);document.querySelectorAll('.marker')[focused].focus();}
});
window.render_game_to_text=()=>JSON.stringify({mode:state.mode,mission:state.mission+1,title:missions[state.mission].title,pieces:state.pieces,current:state.current,routeStep:state.step,route:missions[state.mission].targets.map(id=>node(id).type),clue:$('clue').innerText,feedback:$('feedback').textContent,mistakes:state.mistakes,hints:state.hints,coordinateSystem:'Percent of island viewport; origin top-left; x increases right/east, y increases down/south.',locations:nodes.map(n=>({...n,visited:state.visited.includes(n.id)})),paths:links});
window.advanceTime=ms=>{state.t+=ms;draw();};
makeLegend();makeLocations();progress();updateLocations();new ResizeObserver(resize).observe(canvas);
let last=performance.now();function frame(now){state.t+=Math.min(now-last,50);last=now;draw();requestAnimationFrame(frame);}requestAnimationFrame(frame);
