'use strict';
(()=>{
 const {recipes,items,levels,upgrades}=FACTORY_DATA;
 const $=s=>document.querySelector(s),canvas=$('#board'),modal=$('#modal');let ctx=canvas.getContext('2d');
 const W=16,H=11,dirs=[[1,0],[0,1],[-1,0],[0,-1]],arrows=['↘','↙','↖','↗'],SAVE='ois-factory-maths-v1';
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const key=(x,y)=>`${x},${y}`;
 const isTunnel=c=>c?.type==='tunnelIn'||c?.type==='tunnelOut';
 const isTransport=c=>c?.type==='belt'||c?.type==='splitter'||isTunnel(c);
 const sizeOf=c=>c.legacySmall?1:Object.keys(recipes[c.type]?.input||{}).length>1?2:1;
 function footprint(c){const n=sizeOf(c);return Array.from({length:n*n},(_,i)=>[c.x+i%n,c.y+Math.floor(i/n)]);}
 function cellAt(x,y){return state.cells.get(key(x,y))||[...state.cells.values()].find(c=>sizeOf(c)>1&&x>=c.x&&x<c.x+2&&y>=c.y&&y<c.y+2);}
 function localTile(c,u,v){const n=sizeOf(c)-1;for(let i=0;i<c.dir;i++)[u,v]=[n-v,u];return {x:c.x+u,y:c.y+v};}
 function outputTile(c){return sizeOf(c)===2?localTile(c,1,0):{x:c.x,y:c.y};}
 function inputPorts(c){if(sizeOf(c)!==2)return [];return Object.keys(recipes[c.type].input).map((item,i)=>{const p=localTile(c,...[[0,0],[0,1],[1,1]][i]),d=dirs[(c.dir+(i===2?1:2))%4];return {...p,item,fromX:p.x+d[0],fromY:p.y+d[1]};});}
 function canPlace(c){return footprint(c).every(([x,y])=>x>=0&&y>=0&&x<W&&y<H&&!cellAt(x,y)&&dockAt(x,y)<0&&(c.type==='extractor'?!!sourceAt(x,y):!sourceAt(x,y)));}
 function tunnelExit(c){if(c.type!=='tunnelIn')return null;const d=dirs[c.dir];for(let n=1;n<=5;n++){const other=cellAt(c.x+d[0]*n,c.y+d[1]*n);if(other?.type==='tunnelIn'&&other.dir===c.dir)return null;if(other?.type==='tunnelOut'&&other.dir===c.dir)return other;}return null;}
 function underground(c,q){if(c.type==='tunnelOut')return (q.progress||0)<.5;if(c.type!=='tunnelIn')return false;const exit=tunnelExit(c),distance=exit?Math.abs(exit.x-c.x)+Math.abs(exit.y-c.y):1;return (q.progress||0)*distance>.5;}
 function destination(c,q){if(c.type==='tunnelIn')return tunnelExit(c);const p=outputTile(c),d=dirs[c.type==='splitter'?(q?.exit??c.dir):c.dir];return cellAt(p.x+d[0],p.y+d[1]);}
 let store={version:1,teams:[{id:'team-1',name:'Team 1',stars:{},spent:0,upgrades:[],drafts:{}}],active:'team-1'};
 let persistenceWarning=false;
 function validSave(raw){
  if(raw?.version!==1||!Array.isArray(raw.teams)||!raw.teams.length||raw.teams.length>12)throw Error('Choose a valid Factory Maths backup.');
  const ids=new Set();
  const teams=raw.teams.map(t=>{
   if(typeof t.id!=='string'||ids.has(t.id)||typeof t.name!=='string'||!t.name.trim()||t.name.length>30)throw Error('Invalid team details.');ids.add(t.id);
   const stars={};for(const l of levels){const bits=t.stars?.[l.id]??[false,false,false];if(!Array.isArray(bits)||bits.length!==3||bits.some(x=>typeof x!=='boolean'))throw Error('Invalid star record.');stars[l.id]=bits;}
   const owned=t.upgrades??[];if(!Array.isArray(owned)||new Set(owned).size!==owned.length||owned.some(id=>!upgrades.some(u=>u.id===id)))throw Error('Invalid upgrades.');
   const spent=owned.reduce((n,id)=>n+upgrades.find(u=>u.id===id).cost,0);if(spent!==t.spent||spent>Object.values(stars).flat().filter(Boolean).length)throw Error('Invalid star balance.');
   return {id:t.id,name:t.name.trim(),stars,spent,upgrades:owned,drafts:t.drafts&&typeof t.drafts==='object'?t.drafts:{},tutorial:t.tutorial&&typeof t.tutorial==='object'?t.tutorial:null,tutorialComplete:t.tutorialComplete===true};
  });return {version:1,teams,active:teams.some(t=>t.id===raw.active)?raw.active:teams[0].id};
 }
 try{const raw=localStorage.getItem(SAVE);if(raw)store=validSave(JSON.parse(raw));}catch{persistenceWarning=true;}
 const team=()=>store.teams.find(t=>t.id===store.active),earned=t=>Object.values(t.stars).flat().filter(Boolean).length,wallet=()=>earned(team())-team().spent;
 let state={mode:'levels',level:levels[0],cells:new Map(),tool:'extractor',dir:0,budget:0,time:0,running:false,speed:1,prediction:'',selected:null,history:[],production:[],rate:0,hold:0,deliveries:[0,0],undo:[],currentStars:[false,false,false],resultShown:false,peakSpend:0};
 let projection={size:34,ox:400,oy:60},gesture=null,last=performance.now(),toastUntil=0,visualTime=0;
 let nextItemId=1;let camera={zoom:1,x:0,y:0},pinch=null;const pointers=new Map(),multiSelected=new Set();
 const SETTINGS_SAVE='ois-factory-maths-settings-v1';
 let settings={conveyorArrows:true,flowOverlay:false};
 try{const saved=JSON.parse(localStorage.getItem(SETTINGS_SAVE));if(typeof saved?.conveyorArrows==='boolean')settings.conveyorArrows=saved.conveyorArrows;}catch{}
 try{const saved=JSON.parse(localStorage.getItem(SETTINGS_SAVE));if(typeof saved?.flowOverlay==='boolean')settings.flowOverlay=saved.flowOverlay;}catch{}
 function flowToggle(){settings.flowOverlay=!settings.flowOverlay;try{localStorage.setItem(SETTINGS_SAVE,JSON.stringify(settings));}catch{}renderUI();draw();}
 const ratioPresets=[[1,1,1],[1,1,0],[1,2,0],[2,3,0]];
 function splitPorts(c){return [c.dir,(c.dir+1)%4,(c.dir+3)%4].map((dir,i)=>{const d=dirs[dir];return {dir,weight:(c.weights||[1,1,1])[i],dest:cellAt(c.x+d[0],c.y+d[1])};}).filter(p=>p.weight>0&&p.dest&&p.dest.type!=='extractor');}
 function saveRatio(c,weights){if(!weights.some(n=>n>0)){notify('Keep at least one output weight above zero.');$('#splitter-controls').dataset.markup='';renderUI();return;}snapshot();resetMeasurement();c.weights=weights;c.routeTurn=0;recordDraft();renderUI();draw();}
 function notify(msg){$('#toast').textContent=msg;$('#toast').style.display='block';toastUntil=performance.now()+3300;}
 function save(){try{localStorage.setItem(SAVE,JSON.stringify(store));return true;}catch{persistenceWarning=true;notify('Progress is only in memory. Download a backup from Teams & levels.');return false;}}
 function opened(l){return l.id===1||team().stars[l.id-1]?.[0]===true;}
 const allowed=id=>state.level.upgrades.includes(id)&&team().upgrades.includes(id);
 const recipeRate=r=>r.rate*(allowed('motor')?1.25:1);
 const beltRate=()=> (state.level.beltRate||120)*(allowed('belt')?1.5:1);
 const BELT_GAP=.5;
 const beltTravelTime=()=>60/beltRate()/BELT_GAP;
 const cost=t=>t==='extractor'?20:t==='belt'?1:t==='tunnelIn'||t==='tunnelOut'?4:t==='splitter'?12:recipes[t]?.cost||0;
 const sourceAt=(x,y)=>state.level.sources.find(s=>s[1]===x&&s[2]===y);
 function docks(){return state.level.secondDock?[[13,3],[13,8]]:[[13,5]];}
 const dockAt=(x,y)=>docks().findIndex(p=>p[0]===x&&p[1]===y);
 function cell(type,x,y,dir=state.dir){return {type,x,y,dir,queue:[],buffer:{},cooldown:0,turn:0,routeTurn:0,job:null,produced:0,status:'Ready',weights:[1,1,1],flow:[],blockedFor:0};}
 function construction(){return [...state.cells.values()].filter(c=>c.type!=='dock').map(({type,x,y,dir,legacySmall,weights})=>({type,x,y,dir,legacySmall,weights}));}
 function recordDraft(){if(state.level?.id==='tutorial'){tutorial.persist();return;}if(!state.level||state.mode==='levels')return;team().drafts[state.level.id]={prediction:state.prediction,plan:state.plan,reflection:state.reflection,cells:construction()};save();}
 function resetMeasurement(){state.history=[];state.production=[];state.rate=0;state.hold=0;state.runStarted=state.time;}
 function invalidate(){state.running=false;resetMeasurement();$('#run').textContent='▶ Run factory';}
 function loadLevel(l,restore=true){
  if(!opened(l))return;recordDraft();state={...state,mode:'building',level:l,cells:new Map(),tool:'extractor',dir:0,budget:l.budget,time:0,running:false,speed:1,prediction:'',selected:null,history:[],production:[],rate:0,hold:0,deliveries:[0,0],undo:[],currentStars:[false,false,false],resultShown:false,runStarted:0,peakSpend:0};
  docks().forEach((p,i)=>{const c=cell('dock',...p);c.dock=i;state.cells.set(key(...p),c);});
  const draft=restore?team().drafts[l.id]:null;
  if(draft){state.prediction=typeof draft.prediction==='string'?draft.prediction.slice(0,10):'';for(const saved of Array.isArray(draft.cells)?draft.cells.slice(0,176):[]){if(!Number.isInteger(saved.x)||!Number.isInteger(saved.y)||!Number.isInteger(saved.dir)||saved.dir<0||saved.dir>3||!['extractor','belt','tunnelIn','tunnelOut',...l.tools].includes(saved.type))continue;const c=cell(saved.type,saved.x,saved.y,saved.dir);c.legacySmall=saved.legacySmall===true||Object.keys(recipes[c.type]?.input||{}).length>1&&saved.legacySmall===undefined;if(canPlace(c)&&cost(c.type)<=state.budget){if(Array.isArray(saved.weights)&&saved.weights.length===3&&saved.weights.every(n=>Number.isInteger(n)&&n>=0&&n<=9)&&saved.weights.some(n=>n))c.weights=saved.weights;state.cells.set(key(c.x,c.y),c);state.budget-=cost(c.type);}}}
  state.plan=draft?.plan&&Number.isFinite(draft.plan.target)&&draft.plan.target>0&&draft.plan.target<=240?{target:draft.plan.target,guesses:Object.fromEntries(Object.keys(items).map(i=>[i,String(draft.plan.guesses?.[i]||'').slice(0,10)])),revealed:draft.plan.revealed===true}:null;state.reflection=draft?.reflection?{explanation:String(draft.reflection.explanation||'').slice(0,1600),improvement:String(draft.reflection.improvement||'').slice(0,1000)}:null;state.timeline=[];state.deliveryFlow=[];state.nextSample=0;
  camera={zoom:1,x:0,y:0};multiSelected.clear();state.selected=null;modal.close();renderUI();draw();predictionDialog(false);
 }
 function dialog(content,live=false){modal.dataset.live=String(live);if(!live)invalidate();$('#modal-content').innerHTML=content;if(!modal.open)modal.showModal();}
 function heading(label,title){return `<div class="modal-top"><div><span class="eyebrow">${label}</span><h2>${title}</h2></div>${state.mode==='building'?'<button data-close>Back to factory</button>':''}</div>`;}
 function levelsDialog(){
  recordDraft();dialog(`${heading('PREDICT · BUILD · TEST · IMPROVE','Your factory journey')}<button data-tutorial-open>Learn to optimise · tutorial</button><p>One team builds. Everyone thinks. Earn each star once, then spend it on upgrades.</p><div class="team-strip">${store.teams.map(t=>`<button data-team="${esc(t.id)}" class="${t.id===store.active?'selected':''}">${esc(t.name)} · ${earned(t)-t.spent} ★</button>`).join('')}</div><form class="team-create" id="new-team"><input name="name" placeholder="New team name" maxlength="30" aria-label="New team name" required><button ${store.teams.length>=12?'disabled':''}>Add team</button></form><div class="level-grid">${levels.map(l=>`<button class="level-card" data-level="${l.id}" ${opened(l)?'':'disabled'}><span class="num">${String(l.id).padStart(2,'0')} / ${opened(l)?'READY':'LOCKED'}</span><b>${esc(l.name)}</b><small>${l.concept}</small><div class="stars">${(team().stars[l.id]||[false,false,false]).map(v=>v?'★':'☆').join('')}</div></button>`).join('')}</div><div class="modal-footer"><button data-export>Download team backup</button><button data-import>Restore backup</button><input id="backup-file" type="file" accept="application/json,.json"><span class="small-note">Saved on this browser. Keep a backup for another board.${persistenceWarning?' Browser storage is unavailable or could not be read.':''}</span></div>`);
  $('#new-team').onsubmit=e=>{e.preventDefault();const name=new FormData(e.target).get('name').trim();if(!name||store.teams.length>=12)return;recordDraft();const t={id:crypto.randomUUID(),name,stars:{},spent:0,upgrades:[],drafts:{}};store.teams.push(t);store.active=t.id;state.mode='levels';save();levelsDialog();renderUI();};
  $('#backup-file').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>1000000)throw Error('Backup is too large.');const next=validSave(JSON.parse(await file.text()));if(!confirm('Replace the team progress on this browser with this backup? Download your current backup first if needed.'))return;store=next;state.mode='levels';save();levelsDialog();renderUI();}catch(error){notify(error.message);alert(error.message);}};
 }
 function predictionDialog(revise){
  const l=state.level,counts=l.dockCounts?l.dockCounts.join(' / '):l.count,rates=l.rateGoals?l.rateGoals.join(' / '):l.rate;
  dialog(`${heading('LEVEL '+String(l.id).padStart(2,'0')+' · '+l.concept,revise?'Revise your prediction':l.name)}<div class="prediction-layout"><div><div class="briefing"><span class="eyebrow">DISCUSS WITH YOUR TEAM</span><p>${l.question}</p></div><p>Your prediction is a starting point. Build a line, observe its output, and change your thinking.</p><ul class="goal-list"><li>Deliver ${counts} ${items[l.target][0].toLowerCase()}${l.secondDock?(l.dockCounts?' to docks 1 and 2, respectively':' to each dock'):''}.</li><li>Sustain ${rates} / min${l.secondDock?(l.rateGoals?' at docks 1 and 2, respectively':' at each dock'):''} for 20 seconds.</li><li>Complete delivery using ${l.lean} construction credits or fewer.</li></ul><p class="small-note">${l.sources.map(s=>`${items[s[0]][0]} patch: ${s[3]} / min`).join(' · ')}<br>Allowed upgrades: ${l.upgrades.length?l.upgrades.map(id=>upgrades.find(u=>u.id===id).name+(allowed(id)?' (active)':'')).join(', '):'none in this level'}.</p>${revise?`<div class="feedback">Actual delivery: ${state.rate.toFixed(1)} / min. Predict the quantity asked above; it may be an input rate rather than the delivery rate.</div>`:''}</div><div><label class="eyebrow" for="prediction">YOUR ANSWER</label><input id="prediction" class="prediction-input" inputmode="decimal" type="text" maxlength="10" value="${esc(state.prediction)}" autocomplete="off"><div class="keypad">${['1','2','3','4','5','6','7','8','9','.','0','⌫'].map(k=>`<button data-key="${k}">${k}</button>`).join('')}</div><button class="primary" data-predict style="width:100%;margin-top:12px">${revise?'Save & return':'Start building'} →</button></div></div>`);
 }
 function shopDialog(){recordDraft();dialog(`${heading('TEAM UPGRADES',esc(team().name)+' · '+wallet()+' ★ to spend')}<p>Stars are earned once per objective. Purchased upgrades apply only in levels that allow them.</p><div class="upgrade-grid">${upgrades.map(u=>`<div class="upgrade"><div class="icon">${u.icon}</div><h3>${u.name}</h3><p>${u.description}</p><p class="small-note">Available in levels ${levels.filter(l=>l.upgrades.includes(u.id)).map(l=>l.id).join(', ')}.</p><button data-buy="${u.id}" ${team().upgrades.includes(u.id)||wallet()<u.cost?'disabled':''}>${team().upgrades.includes(u.id)?'✓ Owned':u.cost+' ★ · Buy upgrade'}</button></div>`).join('')}</div>`,true);}
 function resultDialog(){const l=state.level;dialog(`${heading('FIRST STAR EARNED',l.name+' complete!')}<p>You delivered the requested ${items[l.target][0].toLowerCase()}. Your next level is unlocked.</p><div class="feedback"><b>Your prediction: ${esc(state.prediction)}</b><p>${l.question}</p><p>The calculation gives <b>${l.answer}</b>. ${Number(state.prediction)===l.answer?'Your prediction matches.':'Compare it with your prediction and discuss what changed.'}</p></div><p>Measured delivery: <b>${state.rate.toFixed(1)} / min</b> · Construction spent: <b>${l.budget-state.budget}</b>.</p><div class="modal-footer"><button class="primary" data-close>Keep optimising</button>${l.id<levels.length?`<button data-level="${l.id+1}">Next level →</button>`:'<button data-levels>All levels</button>'}<button data-revise>Revise prediction</button><button data-math-debrief>Explain our run</button></div>`);}
 modal.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.hasAttribute('data-close'))modal.close();
  if(b.dataset.team){recordDraft();store.active=b.dataset.team;state.mode='levels';save();levelsDialog();renderUI();}
  if(b.dataset.level)loadLevel(levels[Number(b.dataset.level)-1]);
  if(b.dataset.key){const input=$('#prediction');input.value=b.dataset.key==='⌫'?input.value.slice(0,-1):(input.value+b.dataset.key).slice(0,10);}
  if(b.hasAttribute('data-predict')){const value=$('#prediction').value.trim();if(!/^\d+(\.\d+)?$/.test(value)||!Number.isFinite(Number(value))){$('#prediction').focus();return;}state.prediction=value;modal.close();recordDraft();renderUI();}
  if(b.dataset.buy){const u=upgrades.find(u=>u.id===b.dataset.buy);if(!u||team().upgrades.includes(u.id)||wallet()<u.cost)return;team().upgrades.push(u.id);team().spent+=u.cost;save();shopDialog();renderUI();}
  if(b.hasAttribute('data-revise'))predictionDialog(true);
  if(b.hasAttribute('data-levels'))levelsDialog();if(b.hasAttribute('data-tutorial-open'))tutorial.intro();
  if(b.hasAttribute('data-export')){recordDraft();const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(store,null,2)],{type:'application/json'}));a.href=url;a.download='factory-maths-teams.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  if(b.hasAttribute('data-import'))$('#backup-file').click();
 });
 modal.addEventListener('cancel',e=>{if(state.mode!=='building')e.preventDefault();});
 $('#teams').onclick=levelsDialog;$('#shop').onclick=shopDialog;$('#revise').onclick=()=>predictionDialog(true);
 async function toggleFullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{notify('Fullscreen is unavailable in this browser.');}}
 $('#fullscreen').onclick=toggleFullscreen;
 document.addEventListener('fullscreenchange',()=>{const active=!!document.fullscreenElement;$('#fullscreen').textContent=active?'⛶ Exit fullscreen':'⛶ Fullscreen';$('#fullscreen').setAttribute('aria-pressed',String(active));requestAnimationFrame(draw);});
 document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||e.target.isContentEditable||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(e.key.toLowerCase()==='f')$('#fullscreen').click();if(e.key.toLowerCase()==='r'&&!modal.open&&!e.repeat){e.preventDefault();if(placementPreview()){state.dir=(state.dir+1)%4;renderUI();draw();}else $('#rotate').click();}});
 function rotateSelected(delta){const c=state.cells.get(state.selected);if(!c||c.type==='dock')return;snapshot();resetMeasurement();c.dir=(c.dir+delta+4)%4;recordDraft();renderUI();draw();}
 $('#rotate').onclick=()=>{if(state.selected&&state.cells.get(state.selected)?.type!=='dock')rotateSelected(1);else{state.dir=(state.dir+1)%4;renderUI();draw();}};
 $('#rotate-selected').onclick=()=>rotateSelected(1);$('#rotate-left').onclick=()=>rotateSelected(-1);
 let statsResume=false;
 $('#settings').onclick=()=>{
  statsResume=state.running;state.running=false;
  $('#modal-content').innerHTML=`${heading('DISPLAY OPTIONS','Settings')}<label class="settings-row" for="conveyor-arrows"><span><strong>Conveyor arrows</strong><small>Show direction arrows on conveyor belts and splitters.</small></span><input id="conveyor-arrows" type="checkbox" role="switch" ${settings.conveyorArrows?'checked':''}></label><label class="settings-row" for="flow-overlay-setting"><span><strong>Live flow overlay</strong><small>Show actual output / maximum capacity, in items per minute. Amber marks backed-up outputs.</small></span><input id="flow-overlay-setting" type="checkbox" role="switch" ${settings.flowOverlay?'checked':''}></label><p class="small-note">Your display preference is saved on this browser. Production pauses while this menu is open.</p>`;
  $('#conveyor-arrows').onchange=e=>{settings.conveyorArrows=e.target.checked;try{localStorage.setItem(SETTINGS_SAVE,JSON.stringify(settings));}catch{notify('Display preference could not be saved on this browser.');}draw();};
  $('#flow-overlay-setting').onchange=e=>{settings.flowOverlay=e.target.checked;try{localStorage.setItem(SETTINGS_SAVE,JSON.stringify(settings));}catch{}renderUI();draw();};
  modal.showModal();draw();
 };
 modal.addEventListener('close',()=>{if(statsResume){state.running=!document.hidden;statsResume=false;}renderUI();draw();});
 $('#selection-info').onclick=()=>{
  const c=state.selected&&state.cells.get(state.selected);if(!c)return;
  const r=recipes[c.type],source=sourceAt(c.x,c.y),transport=isTransport(c),rate=r?recipeRate(r):c.type==='extractor'?source[3]:transport?beltRate():null;
  const name=r?.name||(c.type==='extractor'?items[source[0]][0]+' extractor':c.type==='dock'?'Delivery dock':c.type==='splitter'?'Belt splitter':c.type==='tunnelIn'?'Tunnel entrance':c.type==='tunnelOut'?'Tunnel exit':'Conveyor belt');
  const counts=list=>Object.entries(list).map(([i,n])=>`${n} ${items[i][0].toLowerCase()}`).join(' · ')||'Empty';
  const queued={};c.queue.forEach(q=>queued[q.item]=(queued[q.item]||0)+1);
  const rows=[['Status',c.status],['Position',`Column ${c.x+1} · row ${c.y+1}`],['Output direction',c.type==='dock'?'Receives goods':arrows[c.dir]],['Construction cost',c.type==='dock'?'Fixed delivery point':cost(c.type)+' credits'],['Output queue',counts(queued)]];
  if(rate!==null)rows.push(['Maximum capacity',rate+' items / min'],[r?'Craft time':transport?(c.type==='tunnelIn'?'Tunnel travel time':'Time across one belt'):'Extraction interval',(transport?beltTravelTime()*(c.type==='tunnelIn'&&tunnelExit(c)?Math.abs(tunnelExit(c).x-c.x)+Math.abs(tunnelExit(c).y-c.y):1):60/rate).toFixed(2)+' seconds']);
  if(isTunnel(c))rows.push(['Tunnel role',c.type==='tunnelIn'?'Entrance · feeds underground':'Exit · returns to surface'],['Tunnel range','5 tiles · same direction'],['Linked exit',tunnelExit(c)?`Column ${tunnelExit(c).x+1} · row ${tunnelExit(c).y+1}`:c.type==='tunnelIn'?'Not connected':'Receives matching entrance']);
  if(sizeOf(c)===2)rows.push(['Footprint','2 × 2 tiles'],['Input ports',inputPorts(c).map((p,i)=>`${i+1}: ${items[p.item][0]} · column ${p.fromX+1}, row ${p.fromY+1}`).join(' / ')]);
  if(r)rows.push(['Input buffer',counts(c.buffer)],['Required input rate',Object.entries(r.input).map(([i,n])=>`${n*rate} ${items[i][0].toLowerCase()} / min`).join(' · ')],['Current craft',c.job?Math.round(jobProgress(c)*100)+'% · '+Math.max(0,c.job.end-state.time).toFixed(1)+' seconds remaining':'Waiting for inputs'],['Produced this attempt',String(c.produced)]);
  if(c.type==='extractor')rows.push(['Resource',items[source[0]][0]+' · unlimited supply'],['Extracted this attempt',String(c.produced)]);
  if(c.type==='splitter')rows.push(['Forward / right / left weights',(c.weights||[1,1,1]).join(' : ')],['Connected outlet shares',splitPorts(c).map(p=>p.weight+'/'+splitPorts(c).reduce((n,p)=>n+p.weight,0)).join(' · ')||'No connected open outlet']);
  if(transport)rows.push(['Queue capacity',c.queue.length+(c.type==='tunnelIn'?' / 12 items':' / 3 items')],['Routing',c.type==='splitter'?'Weighted cycle across connected open outlets':c.type==='tunnelIn'?'Travels underground to matching exit':c.type==='tunnelOut'?'Returns underground items to the surface':'Follows output arrow']);
  if(c.type==='dock')rows.push(['Accepted item',items[state.level.target][0]],['Delivered this attempt',String(state.deliveries[c.dock])],['Measured delivery rate',state.rate.toFixed(1)+' / min']);
  if(c.type!=='dock'){const dest=destination(c);rows.push(['Next output connection',dest?(recipes[dest.type]?.name||({belt:'Conveyor belt',splitter:'Belt splitter',tunnelIn:'Tunnel entrance',tunnelOut:'Tunnel exit',extractor:'Extractor',dock:'Delivery dock'})[dest.type]):'No connected piece']);}
  const relevant=upgrades.filter(u=>allowed(u.id)&&(u.id==='lens'||u.id==='motor'&&r||u.id==='belt'&&transport));rows.push(['Active upgrades',relevant.map(u=>u.name).join(' · ')||'None']);
  statsResume=state.running;state.running=false;
  $('#modal-content').innerHTML=`${heading('PIECE STATS',name)}${r?`<div class="piece-recipe"><b>Recipe</b><br>${counts(r.input)} → 1 ${items[r.output][0].toLowerCase()}</div>`:''}<div class="piece-stats">${rows.map(([label,value])=>`<div class="piece-stat"><small>${esc(label)}</small><strong>${esc(value)}</strong></div>`).join('')}</div><p class="small-note">Production pauses while viewing stats and resumes when you return.</p>`;
  modal.showModal();draw();
 };
 $('#deselect').onclick=()=>{state.selected=null;renderUI();draw();};
 function deletePieces(keys){const cells=[...keys].map(k=>state.cells.get(k)).filter(c=>c&&c.type!=='dock');if(!cells.length)return;snapshot();resetMeasurement();let refund=0;for(const c of cells){refund+=cost(c.type);state.cells.delete(key(c.x,c.y));}state.budget+=refund;state.selected=null;multiSelected.clear();recordDraft();renderUI();draw();notify(`Deleted ${cells.length} piece${cells.length===1?'':'s'} · ${refund} credits refunded. Undo restores them.`);}
 $('#delete-selected').onclick=()=>deletePieces([state.selected]);$('#delete-multiple').onclick=()=>deletePieces(multiSelected);
 $('#clear-multiple').onclick=()=>{multiSelected.clear();draw();};
 document.addEventListener('keydown',e=>{if((e.key==='Delete'||e.key==='Backspace')&&!modal.open&&!/INPUT|TEXTAREA/.test(e.target.tagName)){e.preventDefault();deletePieces(multiSelected.size?multiSelected:[state.selected]);}});
 function zoomAt(factor,px=canvas.clientWidth/2,py=canvas.clientHeight/2){const next=Math.min(3.5,Math.max(.55,camera.zoom*factor)),ratio=next/camera.zoom;camera.x=px-(px-camera.x-canvas.clientWidth/2)*ratio-canvas.clientWidth/2;camera.y=py-(py-camera.y-canvas.clientHeight/2)*ratio-canvas.clientHeight/2;camera.zoom=next;draw();}
 $('#zoom-in').onclick=()=>zoomAt(1.25);$('#zoom-out').onclick=()=>zoomAt(.8);$('#fit-view').onclick=()=>{camera={zoom:1,x:0,y:0};draw();};
 canvas.addEventListener('wheel',e=>{if(modal.open)return;e.preventDefault();const r=canvas.getBoundingClientRect();zoomAt(Math.exp(-e.deltaY*.002),e.clientX-r.left,e.clientY-r.top);},{passive:false});
 $('#speed').onclick=()=>{state.speed=state.speed===1?4:1;renderUI();};
 $('#run').onclick=()=>{if(state.mode!=='building')return;if(!state.prediction){predictionDialog(false);return;}state.running=!state.running;if(state.running)resetMeasurement();renderUI();};
 $('#restart').onclick=()=>{if(state.mode==='building'&&confirm('Restart this attempt? Your earned stars and upgrades are kept.')){delete team().drafts[state.level.id];state.mode='levels';loadLevel(state.level,false);}};
 $('#undo').onclick=()=>{const snapshot=state.undo.pop();if(!snapshot)return;resetMeasurement();restoreConstruction(snapshot);state.selected=null;multiSelected.clear();recordDraft();renderUI();draw();};
 function renderUI(){
  const l=state.level;$('#title').textContent=l.name;$('#chapter').textContent=l.id==='tutorial'?'GUIDED PRACTICE · FIND AND FIX A BOTTLENECK':`LEVEL ${String(l.id).padStart(2,'0')} / ${levels.length} · ${l.concept.toUpperCase()}`;$('#subtitle').textContent=`Build a line for ${items[l.target][0].toLowerCase()}. ${allowed('motor')?'Motors +25% active. ':''}${allowed('belt')?'Belts +50% active.':''}`;
  $('#team-name').textContent=team().name;$('#budget').textContent=state.budget;$('#rate').textContent=state.rate.toFixed(1);$('#clock').textContent=`${Math.floor(state.time/60)}:${String(Math.floor(state.time%60)).padStart(2,'0')}`;
  $('#prediction-value').textContent=state.prediction||'Not yet recorded';$('#run').textContent=state.running?'Ⅱ Pause factory':'▶ Run factory';$('#speed').textContent=state.speed+'× speed';$('#rotate').textContent='Direction '+arrows[state.dir];$('#undo').disabled=!state.undo.length;
  const previous=team().stars[l.id]||[false,false,false],minDelivered=l.secondDock?Math.min(...state.deliveries):state.deliveries[0],deliveryText=l.dockCounts?state.deliveries.map((n,i)=>n+' / '+l.dockCounts[i]).join(' · ')+` ${items[l.target][0].toLowerCase()} across docks`:`${minDelivered} / ${l.count} ${items[l.target][0].toLowerCase()}${l.secondDock?(l.rateGoals?' at docks 1 and 2, respectively':' at each dock'):''}`,rateText=l.rateGoals?l.rateGoals.join(' / ')+' items/min at docks 1 / 2':l.rate+' / min'+(l.secondDock?(l.rateGoals?' at docks 1 and 2, respectively':' at each dock'):'');
  const peakSpend=Math.max(state.peakSpend,l.budget-state.budget),progress=[l.dockCounts?Math.min(...state.deliveries.map((n,i)=>n/l.dockCounts[i])):minDelivered/l.count,state.hold/20,peakSpend/l.lean];
  $('#objectives').innerHTML=[['Deliver the goods',deliveryText],['Balance the flow',`${rateText} · ${Math.min(20,Math.floor(state.hold))} / 20s sustained`],['Build economically',`Deliver using ≤ ${l.lean} credits · Peak run spend ${peakSpend}`]].map((o,i)=>`<div class="objective ${previous[i]?'earned':''} ${i===2&&peakSpend>l.lean?'over-budget':''}"><span class="star" aria-hidden="true">${previous[i]?'★':'☆'}</span><div><b>${o[0]}${previous[i]?'<span class="sr-only"> · Star earned</span>':''}</b><small>${o[1]}${previous[i]&&!state.currentStars[i]?' · Previously earned':''}</small><div class="objective-progress" aria-hidden="true"><span style="width:${Math.max(0,Math.min(1,previous[i]?1:progress[i]))*100}%"></span></div></div></div>`).join('');
  const toolList=['inspect','select','pan','belt','extractor',...(l.id>=6?['tunnelIn','tunnelOut']:[]),...l.tools,'remove'];
  const toolsMarkup=toolList.map(t=>`<button data-tool="${t}" class="${state.tool===t?'active':''}" aria-pressed="${state.tool===t}"><span class="tool-icon">${factoryToolIcon(t)}</span>${t==='select'?'Multi-select':t==='pan'?'Move view':t==='inspect'?'Inspect':t==='remove'?'Remove':t==='extractor'?'Extractor':t==='belt'?'Belt':t==='tunnelIn'?'Tunnel in':t==='tunnelOut'?'Tunnel out':t==='splitter'?'Splitter':t==='plank'?'Planks':t==='ingot'?'Furnace':t==='gear'?'Gears':t==='wire'?'Wire':t==='toolkit'?'Toolkits':'Circuits'}<small>${cost(t)?cost(t)+' credits'+(Object.keys(recipes[t]?.input||{}).length>1?' · 2×2':''):t==='select'?'Tap or drag':t==='pan'?'Drag to pan':t==='remove'?'Full refund':'Tap a machine'}</small></button>`).join('');
  if($('#tools').dataset.markup!==toolsMarkup){$('#tools').innerHTML=toolsMarkup;$('#tools').dataset.markup=toolsMarkup;}
  $('#tools').onclick=e=>{const b=e.target.closest('[data-tool]');if(b){if(state.tool!==b.dataset.tool)multiSelected.clear();state.tool=b.dataset.tool;state.selected=null;renderUI();draw();}};
  canvas.classList.toggle('select-mode',state.tool==='select');
  canvas.classList.toggle('pan-mode',state.tool==='pan');
  $('#board-hint').textContent=isTunnel({type:state.tool})?'Tunnel in → Tunnel out: same direction, straight line, up to 5 tiles apart. Surface belts cross above.':state.tool==='select'?'Tap pieces to add or remove them from selection. Drag an area to select a group, then Delete selected.':state.tool==='pan'?'Drag to move the board. Pinch or use + / − to zoom. Fit board resets the view.':state.tool==='belt'?'Mouse: drag to build. Touch: move the grey preview, then lift to place. R rotates the preview. Tap an existing belt to rotate or delete it. Two fingers move or zoom the board.':state.tool==='inspect'?'Tap any building for its on-board rotation and delete controls.':state.tool==='extractor'?'Preview on a resource patch, then click or lift to place. R rotates the preview. Tap an existing machine to rotate or delete it.':state.tool==='remove'?'Tap or drag to remove buildings. Credits are fully refunded.':`Move the grey preview, then click or lift to place ${recipes[state.tool]?.name||'a splitter'}. R rotates the preview. Tap a building to rotate or delete it.`;
  $('#flow-toggle').setAttribute('aria-pressed',String(settings.flowOverlay));$('#flow-toggle').textContent=settings.flowOverlay?'Flow on':'Flow';$('#flow-legend').hidden=!settings.flowOverlay;learning.update();tutorial.update();
  renderInspector();
 }
 function renderInspector(){
  const c=state.selected&&state.cells.get(state.selected);if(!c){const r=recipes[state.tool];$('#inspector').innerHTML=isTunnel({type:state.tool})?'<h3>Underground belts</h3><p>Place <b>Tunnel in</b> and <b>Tunnel out</b> in a straight line, facing the same direction, up to 5 tiles apart. Belts above keep their own flow.</p><p>Each end costs 4 credits. Rotate either end on the board to align them.</p>':r?`<h3>${r.name}</h3><p class="recipe">${Object.entries(r.input).map(([i,n])=>n+' '+items[i][0].toLowerCase()).join(' + ')} → 1 ${items[r.output][0].toLowerCase()}</p><p>Capacity: <b>${recipeRate(r)} / min</b><br>Construction: ${r.cost} credits.</p><p>Place on a clear ${Object.keys(r.input).length>1?'2 × 2 area. Feed each labelled ingredient port':'tile. Inputs arrive from adjacent belts'}; output follows ${arrows[state.dir]}.</p>`:'<h3>Build your line</h3><p>Extractor → workshop → delivery dock. Arrows show output direction. Tap <b>Inspect</b>, then a machine, for its recipe and rate.</p>';return;}
  const r=recipes[c.type],s=sourceAt(c.x,c.y),name=r?.name||(c.type==='extractor'?items[s[0]][0]+' extractor':c.type==='dock'?'Delivery dock':c.type==='splitter'?'Ratio splitter':c.type==='tunnelIn'?'Tunnel entrance':c.type==='tunnelOut'?'Tunnel exit':'Conveyor');
  $('#inspector').innerHTML=`<h3>${name}</h3>${r?`<p class="recipe">${Object.entries(r.input).map(([i,n])=>n+' '+items[i][0].toLowerCase()).join(' + ')} → 1 ${items[r.output][0].toLowerCase()}</p><p>Capacity: <b>${recipeRate(r)} / min</b><br>Made this attempt: ${c.produced}${sizeOf(c)===2?'<br><b>2 × 2 factory</b> · '+inputPorts(c).map((p,i)=>(i+1)+': '+items[p.item][0]).join(' / '):c.legacySmall?'<br>Saved compact factory. Rebuild to use the larger input ports.':''}</p>`:c.type==='extractor'?`<p>Capacity: <b>${s[3]} / min</b>. Infinite resource; finite rate.</p>`:isTransport(c)?`<p>Capacity: <b>${beltRate()} / min</b>${c.type==='splitter'?'<br>Uses the selected weights across connected open outlets.':''}</p>`:`<p>Accepts ${items[state.level.target][0].toLowerCase()} only.</p>`}<p class="status">${esc(c.status)}</p><p>Waiting items: ${c.queue.length}${Object.keys(c.buffer).length?' · Inputs: '+Object.entries(c.buffer).map(([i,n])=>n+' '+items[i][0].toLowerCase()).join(', '):''}</p>${c.type!=='dock'?'<p class="small-note">Rotate using the controls beside this building.</p>':''}`;
  updateSelection();
 }
 function snapshot(){state.undo.push({cells:[...state.cells.values()].map(c=>structuredClone(c)),budget:state.budget,time:state.time});if(state.undo.length>30)state.undo.shift();}
 function restoreConstruction(old){
  const elapsed=state.time-old.time;
  state.cells=new Map(old.cells.map(saved=>{const k=key(saved.x,saved.y),current=state.cells.get(k);if(current?.type===saved.type){current.dir=saved.dir;current.weights=saved.weights||[1,1,1];current.routeTurn=saved.routeTurn||0;return [k,current];}const restored=structuredClone(saved);for(const q of restored.queue)q.ready+=elapsed;if(restored.job){restored.job.start+=elapsed;restored.job.end+=elapsed;}return [k,restored];}));state.budget=old.budget;
 }
 function place(x,y,dir=state.dir){
  if(x<0||y<0||x>=W||y>=H)return false;const k=key(x,y),existing=cellAt(x,y);
  if(state.tool==='inspect'){state.selected=existing?key(existing.x,existing.y):null;renderInspector();return false;}
  if(existing?.type==='dock'){if(state.tool==='remove')notify('Delivery docks stay fixed.');else{state.selected=k;renderInspector();}return false;}
  if(state.tool==='remove'){if(!existing)return false;state.budget+=cost(existing.type);state.cells.delete(key(existing.x,existing.y));return true;}
  if(existing){if(state.tool==='belt'&&existing.type==='belt'){existing.dir=dir;return true;}notify('This tile is occupied. Remove the building first.');return false;}
  if(state.tool==='extractor'&&!sourceAt(x,y)){notify('Extractors need a resource patch.');return false;}
  if(state.tool!=='extractor'&&sourceAt(x,y)){notify('Keep this resource patch for an extractor.');return false;}
  if(cost(state.tool)>state.budget){notify('Not enough construction credits. Remove a building for a full refund.');return false;}
  const built=cell(state.tool,x,y,dir);built.legacySmall=false;if(!canPlace(built)){notify('This factory needs a clear 2 × 2 area, away from resource patches.');return false;}state.cells.set(k,built);state.budget-=cost(state.tool);state.selected=null;return true;
 }
 function point(x,y){const {size,ox,oy}=projection;return {x:ox+(x-y)*size,y:oy+(x+y)*size*.5};}
 function tileFromEvent(e){const rect=canvas.getBoundingClientRect(),px=e.clientX-rect.left,py=e.clientY-rect.top,{size,ox,oy}=projection,a=(px-ox)/size,b=(py-oy)/(size*.5);return {x:Math.round((a+b)/2),y:Math.round((b-a)/2)};}
 let previewPointer=null;
 function placementPreview(){
  if(!previewPointer||modal.open||state.mode!=='building'||pinch||gesture?.pan||['inspect','select','pan','remove'].includes(state.tool))return null;
  const p=tileFromEvent(previewPointer);if(p.x<0||p.y<0||p.x>=W||p.y>=H)return null;
  const c=cell(state.tool,p.x,p.y);c.legacySmall=false;return {c,valid:canPlace(c)&&cost(c.type)<=state.budget};
 }
 const ghostCanvas=document.createElement('canvas');let ghostKey='';
 function drawPlacementPreview(){const preview=placementPreview();if(!preview)return;const {c,valid}=preview,s=projection.size,p=point(c.x,c.y),left=p.x-s*3,top=p.y-s*4;
  const cacheKey=JSON.stringify([c.type,c.x,c.y,c.dir,s,sourceAt(c.x,c.y),incoming(c),settings.conveyorArrows,state.running?Math.floor(visualTime*10):0]);
  // Render and recolour only the piece on a separate transparent sprite canvas.
  // The board context never receives a greyscale filter.
  if(cacheKey!==ghostKey){const boardContext=ctx;ghostCanvas.width=Math.ceil(s*7);ghostCanvas.height=Math.ceil(s*6);ctx=ghostCanvas.getContext('2d',{willReadFrequently:true});
   try{ctx.translate(-left,-top);if(c.type==='belt'||c.type==='splitter')drawBelt(c);else if(isTunnel(c)){drawBelt(c);drawTunnel(c);}else drawMachine(c);
    const pixels=ctx.getImageData(0,0,ghostCanvas.width,ghostCanvas.height);for(let i=0;i<pixels.data.length;i+=4){if(!pixels.data[i+3])continue;const grey=Math.round(pixels.data[i]*.2126+pixels.data[i+1]*.7152+pixels.data[i+2]*.0722);pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=grey;}ctx.putImageData(pixels,0,0);ghostKey=cacheKey;
   }finally{ctx=boardContext;}
  }
  ctx.save();ctx.globalAlpha=.58;ctx.drawImage(ghostCanvas,left,top);ctx.restore();
  for(const [x,y]of footprint(c))diamond(x,y,1.02,'#00000000',valid?'#edf2f4':'#ff8b83');
 }
 function startPaint(){snapshot();resetMeasurement();state.selected=null;gesture.painting=true;gesture.changed=place(gesture.last.x,gesture.last.y);}
 function finishGesture(cancel=false){if(!gesture)return;if(cancel&&gesture.selection){multiSelected.clear();for(const k of gesture.baseSelection)multiSelected.add(k);}if(gesture.painting){if(cancel){const old=state.undo.pop();if(old)restoreConstruction(old);}else{if(!gesture.changed)state.undo.pop();recordDraft();}}gesture=null;renderUI();draw();}
 function pinchMetrics(){const [a,b]=[...pointers.values()];return {x:(a.x+b.x)/2,y:(a.y+b.y)/2,distance:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y))};}
 canvas.addEventListener('pointerdown',e=>{
  if(modal.open||state.mode!=='building')return;e.preventDefault();canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pointers.size>=2){previewPointer=null;finishGesture(true);pinch=pinchMetrics();return;}
  previewPointer={clientX:e.clientX,clientY:e.clientY};const p=tileFromEvent(e);gesture={touch:e.pointerType==='touch',id:e.pointerId,last:p,startX:e.clientX,startY:e.clientY,screenX:e.clientX,screenY:e.clientY,changed:false,painting:false,pan:state.tool==='pan'||e.button===1||e.button===2};
  if(state.tool==='select'&&!gesture.pan){gesture.selection=true;gesture.selectionStart={...p};gesture.baseSelection=[...multiSelected];gesture.dragged=false;state.selected=null;return;}
  // Defer touch construction until a tap/drag is established, so a pinch cannot place a building.
  if(!gesture.pan&&e.pointerType!=='touch'&&!cellAt(p.x,p.y)&&state.tool!=='inspect')startPaint();
 });
 canvas.addEventListener('pointermove',e=>{
  previewPointer={clientX:e.clientX,clientY:e.clientY};if(!pointers.has(e.pointerId)){draw();return;}pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pointers.size>=2){const next=pinchMetrics(),r=canvas.getBoundingClientRect();if(pinch){camera.x+=next.x-pinch.x;camera.y+=next.y-pinch.y;zoomAt(next.distance/pinch.distance,next.x-r.left,next.y-r.top);}pinch=next;draw();return;}
  if(!gesture||gesture.id!==e.pointerId)return;
  if(gesture.pan){camera.x+=e.clientX-gesture.screenX;camera.y+=e.clientY-gesture.screenY;gesture.screenX=e.clientX;gesture.screenY=e.clientY;draw();return;}
  if(gesture.selection){if(Math.hypot(e.clientX-gesture.startX,e.clientY-gesture.startY)<7&&!gesture.dragged)return;gesture.dragged=true;gesture.last=tileFromEvent(e);const a=gesture.selectionStart,b=gesture.last;multiSelected.clear();for(const k of gesture.baseSelection)multiSelected.add(k);for(const c of state.cells.values())if(c.type!=='dock'&&footprint(c).some(([x,y])=>x>=Math.min(a.x,b.x)&&x<=Math.max(a.x,b.x)&&y>=Math.min(a.y,b.y)&&y<=Math.max(a.y,b.y)))multiSelected.add(key(c.x,c.y));draw();return;}
  if(gesture.touch&&state.tool!=='remove'){gesture.last=tileFromEvent(e);draw();return;}
  if(!gesture.painting){if(Math.hypot(e.clientX-gesture.startX,e.clientY-gesture.startY)<7)return;if(!['belt','remove'].includes(state.tool))return;startPaint();}
  const p=tileFromEvent(e);if(p.x<0||p.y<0||p.x>=W||p.y>=H)return;let from=gesture.last;
  while(from.x!==p.x||from.y!==p.y){const next={x:from.x,y:from.y};if(next.x!==p.x)next.x+=Math.sign(p.x-next.x);else next.y+=Math.sign(p.y-next.y);const d=dirs.findIndex(v=>v[0]===next.x-from.x&&v[1]===next.y-from.y);if(state.tool==='belt'){const prev=state.cells.get(key(from.x,from.y));if(prev?.type==='belt')prev.dir=d;}if(state.tool==='belt'||state.tool==='remove')gesture.changed=place(next.x,next.y)||gesture.changed;from=next;}gesture.last=p;renderUI();
 });
 canvas.addEventListener('pointerup',e=>{
  if(e.pointerType==='touch')previewPointer=null;pointers.delete(e.pointerId);if(pinch){if(pointers.size<2)pinch=null;gesture=null;return;}
  if(gesture?.id===e.pointerId&&gesture.selection){if(!gesture.dragged){const c=cellAt(gesture.last.x,gesture.last.y),k=c?key(c.x,c.y):null;if(c&&c.type!=='dock'){if(multiSelected.has(k))multiSelected.delete(k);else multiSelected.add(k);}}finishGesture();return;}
  if(gesture?.id===e.pointerId&&!gesture.painting&&!gesture.pan){gesture.last=tileFromEvent(e);const p=gesture.last,c=cellAt(p.x,p.y);if(c&&state.tool!=='remove'){state.selected=key(c.x,c.y);}else if(state.tool==='inspect'){state.selected=null;}else startPaint();}
  finishGesture();
 });
 canvas.addEventListener('pointerleave',()=>{if(!pointers.size){previewPointer=null;draw();}});
 canvas.addEventListener('pointercancel',e=>{previewPointer=null;pointers.delete(e.pointerId);pinch=null;finishGesture(true);});
 canvas.addEventListener('contextmenu',e=>e.preventDefault());
 function updateSelection(){
  const keys=[...multiSelected].filter(k=>state.cells.has(k)&&state.cells.get(k).type!=='dock'),multi=$('#multi-actions');multi.hidden=!keys.length||modal.open;$('#multi-count').textContent=`${keys.length} piece${keys.length===1?'':'s'} selected`;$('#delete-multiple').textContent=`Delete · refund ${keys.reduce((n,k)=>n+cost(state.cells.get(k).type),0)} credits`;
  const c=state.selected&&state.cells.get(state.selected),panel=$('#selection-actions');if(!c||modal.open){panel.hidden=true;return;}
  const p=point(c.x,c.y),w=canvas.clientWidth,h=canvas.clientHeight;if(p.x<0||p.x>w||p.y<0||p.y>h){panel.hidden=true;return;}
  panel.hidden=false;$('#selection-name').textContent=recipes[c.type]?.name||(c.type==='extractor'?'Extractor':c.type==='dock'?'Delivery dock':c.type==='splitter'?'Belt splitter':c.type==='tunnelIn'?'Tunnel entrance':c.type==='tunnelOut'?'Tunnel exit':'Conveyor belt');$('#selection-direction').textContent=c.type==='dock'?'Fixed delivery point':`Output ${arrows[c.dir]} · tap to turn`;
  panel.querySelector('.selection-buttons').hidden=c.type==='dock';$('#delete-selected').hidden=c.type==='dock';
  const split=$('#splitter-controls');split.hidden=c.type!=='splitter';if(c.type==='splitter'){const weights=c.weights||[1,1,1],sum=splitPorts(c).reduce((n,p)=>n+p.weight,0);const markup=`<div class="split-label">Output weights · forward / right / left</div><div class="ratio-presets">${ratioPresets.map((r,i)=>`<button data-ratio="${i}" aria-pressed="${r.join()===weights.join()}">${r[2]?r.join(':'):r.slice(0,2).join(':')}</button>`).join('')}</div><div class="ratio-weights">${weights.map((w,i)=>`<label>${['Forward','Right','Left'][i]}<select data-weight="${i}" aria-label="${['Forward','Right','Left'][i]} output weight">${Array.from({length:10},(_,n)=>`<option ${n===w?'selected':''}>${n}</option>`).join('')}</select></label>`).join('')}</div><small>Connected outlets: ${splitPorts(c).map(p=>`${p.weight}/${sum}`).join(' · ')||'none'}. Zero closes an outlet.</small>`;if(split.dataset.markup!==markup){split.innerHTML=markup;split.dataset.markup=markup;}}
  $('#delete-selected').textContent=`Delete piece · refund ${cost(c.type)} credits`;panel.style.left=Math.min(w-264,Math.max(10,p.x+projection.size*.8))+'px';panel.style.top=Math.min(h-panel.offsetHeight-45,Math.max(76,p.y-170))+'px';
 }
 $('#splitter-controls').addEventListener('click',e=>{const b=e.target.closest('[data-ratio]'),c=state.cells.get(state.selected);if(b&&c?.type==='splitter')saveRatio(c,[...ratioPresets[Number(b.dataset.ratio)]]);});
 $('#splitter-controls').addEventListener('change',e=>{const c=state.cells.get(state.selected);if(c?.type!=='splitter'||!e.target.matches('[data-weight]'))return;const weights=[...(c.weights||[1,1,1])];weights[Number(e.target.dataset.weight)]=Number(e.target.value);saveRatio(c,weights);});
 function accept(c,item,from,itemId){
  if(c.type==='dock'){if(item!==state.level.target)return false;state.deliveries[c.dock]++;c.lastDelivery=state.time;state.history.push({time:state.time,dock:c.dock});state.deliveryFlow??=[];state.deliveryFlow.push({time:state.time,dock:c.dock});return true;}
  const r=recipes[c.type];if(r){if(sizeOf(c)===2&&!inputPorts(c).some(p=>p.item===item&&from&&outputTile(from).x===p.fromX&&outputTile(from).y===p.fromY))return false;if(!r.input[item]||(c.buffer[item]||0)>=Math.max(6,r.input[item]*3))return false;c.buffer[item]=(c.buffer[item]||0)+1;return true;}
  if(isTunnel(c)&&from){const p=outputTile(from),back=dirs[(c.dir+2)%4];if(c.type==='tunnelOut'?from.type!=='tunnelIn'||tunnelExit(from)!==c:p.x!==c.x+back[0]||p.y!==c.y+back[1])return false;}
  if(isTransport(c)&&c.queue.length<(c.type==='tunnelIn'?12:3)&&(!c.queue.length||c.queue.at(-1).progress>=BELT_GAP/(c.type==='tunnelIn'&&tunnelExit(c)?Math.abs(tunnelExit(c).x-c.x)+Math.abs(tunnelExit(c).y-c.y):1)-1e-8)){const entry=c.type==='tunnelOut'?(c.dir+2)%4:from?dirs.findIndex(d=>d[0]===outputTile(from).x-c.x&&d[1]===outputTile(from).y-c.y):(c.dir+2)%4;let exit=c.dir;if(c.type==='splitter'){const ports=splitPorts(c),schedule=ports.flatMap(p=>Array(p.weight).fill(p.dir));if(!schedule.length)return false;exit=schedule[c.routeTurn%schedule.length];c.routeTurn++;}c.queue.push({id:itemId??nextItemId++,item,ready:state.time+beltTravelTime(),entry,exit,progress:0});return true;}return false;
 }
 function send(c,q){
  const dest=destination(c,q);const sent=!!dest&&accept(dest,q.item,c,q.id);if(sent){c.flow??=[];c.flow.push({time:state.time,item:q.item,to:[dest.x,dest.y]});}return sent;
 }
 function step(dt){
  if(!state.running||(modal.open&&modal.dataset.live!=='true')||state.mode!=='building')return;state.time+=dt;state.peakSpend=Math.max(state.peakSpend,state.level.budget-state.budget);
  // Move every belt before transfers, so tile insertion order cannot advance an item twice.
  const positions=new Map([...state.cells.values()].flatMap(c=>c.queue.map(q=>[q.id,q.progress||0]))),travel=dt/beltTravelTime();
  for(const c of state.cells.values())if(isTransport(c))c.queue.forEach((q,i)=>{
   const exit=tunnelExit(c),distance=exit?Math.abs(exit.x-c.x)+Math.abs(exit.y-c.y):1,move=travel/(c.type==='tunnelIn'?distance:1),gap=BELT_GAP/(c.type==='tunnelIn'?distance:1);let limit=1;
   if(i)limit=c.queue[i-1].progress-gap;
   else{const dest=destination(c,q);if(c.type!=='tunnelIn'&&isTransport(dest)&&dest.queue.length)limit=Math.min(1,1+positions.get(dest.queue.at(-1).id)+travel-BELT_GAP);}
   q.progress=Math.max(q.progress||0,Math.min((q.progress||0)+move,Math.max(0,limit)));
   if(q.progress>1-1e-8)q.progress=1;
  });
  for(const c of state.cells.values()){
   c.flow=(c.flow||[]).filter(f=>f.time>state.time-30);if(c.type==='dock')continue;
   const transport=isTransport(c);
   if(c.queue.length&&(transport?c.queue[0].progress>=1:c.queue[0].ready<=state.time)){if(send(c,c.queue[0])){c.queue.shift();c.status='Flowing';}else c.status=c.type==='tunnelIn'&&!tunnelExit(c)?'Needs matching exit within 5 tiles':'Output blocked';}
   c.blockedFor=c.status==='Output blocked'||c.status.startsWith('Needs matching')?(c.blockedFor||0)+dt:0;
   c.cooldown=Math.max(0,c.cooldown)-dt;
   if(c.type==='extractor'){
    if(c.cooldown<=0&&c.queue.length<3){c.queue.push({id:nextItemId++,item:sourceAt(c.x,c.y)[0],ready:state.time+.01});c.cooldown+=60/sourceAt(c.x,c.y)[3];c.job={start:state.time,end:state.time+60/sourceAt(c.x,c.y)[3]};c.produced++;c.status='Extracting';}
   }else if(recipes[c.type]){
    const r=recipes[c.type];if(c.cooldown<=0&&c.queue.length<2){if(Object.entries(r.input).every(([i,n])=>(c.buffer[i]||0)>=n)){for(const [i,n]of Object.entries(r.input))c.buffer[i]-=n;c.queue.push({id:nextItemId++,item:r.output,ready:state.time+60/recipeRate(r)});c.cooldown+=60/recipeRate(r);c.job={start:state.time,end:state.time+60/recipeRate(r)};c.produced++;state.production.push({time:state.time,item:r.output});c.status='Producing';}else c.status='Waiting for '+Object.entries(r.input).filter(([i,n])=>(c.buffer[i]||0)<n).map(([i])=>items[i][0].toLowerCase()).join(' + ');}
   }
   if(c.job&&state.time>=c.job.end&&!c.queue.length)c.job=null;
  }
  state.history=state.history.filter(h=>h.time>state.time-30-0.000001);
  const rates=docks().map((_,i)=>state.history.filter(h=>h.dock===i).length*2);state.rate=Math.min(...rates);
  state.production=state.production.filter(p=>p.time>state.time-30-0.000001);
  const productionRate=state.production.filter(p=>p.item===state.level.target).length*2;
  if(state.time-state.runStarted>=30&&rates.every((r,i)=>r>=(state.level.rateGoals?.[i]??state.level.rate))&&productionRate>=(state.level.rateGoals?.reduce((a,b)=>a+b,0)??state.level.rate*docks().length))state.hold+=dt;else state.hold=0;
  state.timeline??=[];if(state.time>=(state.nextSample||0)){state.deliveryFlow=(state.deliveryFlow||[]).filter(h=>h.time>state.time-30);state.timeline.push({time:state.time,rates:docks().map((_,i)=>state.deliveryFlow.filter(h=>h.dock===i).length*2)});state.timeline=state.timeline.filter(p=>p.time>=state.time-120);state.nextSample=state.time+2;}
  if(state.level.id==='tutorial')return;
  const done=docks().every((_,i)=>state.deliveries[i]>=(state.level.dockCounts?.[i]??state.level.count)),bits=[done,done&&state.hold>=20,done&&state.peakSpend<=state.level.lean];
  let newStar=false;const previous=team().stars[state.level.id]||[false,false,false];bits.forEach((v,i)=>{if(v){state.currentStars[i]=true;if(!previous[i]){previous[i]=true;newStar=true;}}});
  team().stars[state.level.id]=previous;
  if(newStar){save();notify('★ Star earned! '+wallet()+' stars available for upgrades.');}
  if(done&&!state.resultShown&&!modal.open){state.resultShown=true;state.running=false;renderUI();resultDialog();}
 }
 function polygon(points,fill,stroke){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}}
 function diamond(x,y,scale=1,color='#40a657',stroke){const p=point(x,y),s=projection.size*scale;polygon([{x:p.x,y:p.y-s*.5},{x:p.x+s,y:p.y},{x:p.x,y:p.y+s*.5},{x:p.x-s,y:p.y}],color,stroke);}
 function box(x,y,w,h,top,left,right){const s=projection.size,p=point(x,y),a=s*w,b=s*w*.5,z=s*h;polygon([{x:p.x-a,y:p.y-b},{x:p.x,y:p.y-2*b},{x:p.x+a,y:p.y-b},{x:p.x,y:p.y}],top);polygon([{x:p.x-a,y:p.y-b},{x:p.x,y:p.y},{x:p.x,y:p.y+z},{x:p.x-a,y:p.y-b+z}],left);polygon([{x:p.x,y:p.y},{x:p.x+a,y:p.y-b},{x:p.x+a,y:p.y-b+z},{x:p.x,y:p.y+z}],right);}
 function text(txt,x,y,size=13,color='#fff'){ctx.font=`700 ${size}px system-ui`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(txt,x,y);}
 function gridPlane(fn){const {size:s,ox,oy}=projection;ctx.save();ctx.transform(s,s*.5,-s,s*.5,ox,oy);fn();ctx.restore();}
 function directionArrow(c,machine=false){
  if(!machine&&!settings.conveyorArrows)return;
  const d=dirs[c.dir],n=[-d[1],d[0]],center=machine?.53:c.arrowOffset??.13,scale=c.arrowScale??1;
  gridPlane(()=>{const p=(a,b)=>({x:c.x+d[0]*(a*scale+center)+n[0]*b*scale,y:c.y+d[1]*(a*scale+center)+n[1]*b*scale});
   const pts=[p(-.23,-.085),p(.015,-.085),p(.015,-.20),p(.27,0),p(.015,.20),p(.015,.085),p(-.23,.085)];
   ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.lineWidth=.055;ctx.strokeStyle=machine?'#553618':'#14383b';ctx.stroke();ctx.fillStyle=machine?'#ffc75a':'#68f5e4';ctx.fill();
  });
 }
 function incoming(c){const result=[];dirs.forEach((d,i)=>{const other=cellAt(c.x+d[0],c.y+d[1]);if(!other||other.type==='dock')return;const ports=other.type==='splitter'?[other.dir,(other.dir+1)%4,(other.dir+3)%4]:[other.dir];if(ports.includes((i+2)%4)&&destination(other)?.x===c.x&&destination(other)?.y===c.y)result.push(i);});return result.length?result:[(c.dir+2)%4];}
 function drawBelt(c){
  const ins=isTunnel(c)?[(c.dir+2)%4]:incoming(c),outs=c.type==='splitter'?[c.dir,(c.dir+1)%4,(c.dir+3)%4].filter((_,i)=>(c.weights||[1,1,1])[i]>0):[c.dir],junction=ins.length>1||c.type==='splitter',routes=ins.flatMap(input=>outs.filter(output=>input!==output).map(output=>({input,output})));
  gridPlane(()=>{
   const path=()=>{ctx.beginPath();for(const {input,output}of routes){const a=dirs[input],b=dirs[output];ctx.moveTo(c.x+a[0]*.51,c.y+a[1]*.51);if((input+2)%4===output)ctx.lineTo(c.x+b[0]*.51,c.y+b[1]*.51);else ctx.quadraticCurveTo(c.x,c.y,c.x+b[0]*.51,c.y+b[1]*.51);}};
   // Draw each material across every branch before the next layer: the shared
   // surface covers internal rails instead of stacking complete belts.
   ctx.lineJoin='round';ctx.lineCap='butt';for(const [color,width]of [['#174833',.85],['#d4e0da',.74],['#263b42',.57],['#314a50',.50]]){path();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
   for(const {input,output}of junction?[]:routes){const a=dirs[input],b=dirs[output];
    // Moving tread bars, clipped to the central lane; rounded bends retain their rails.
    ctx.save();
    const offset=state.running?(visualTime*.13)% .2:0;for(let t=.06+offset;t<.98;t+=.2){const straight=(input+2)%4===output,ax=a[0]*.51,ay=a[1]*.51,bx=b[0]*.51,by=b[1]*.51;const x=straight?ax+(bx-ax)*t:(1-t)*(1-t)*ax+t*t*bx,y=straight?ay+(by-ay)*t:(1-t)*(1-t)*ay+t*t*by;const tx=straight?bx-ax:2*(t*bx-(1-t)*ax),ty=straight?by-ay:2*(t*by-(1-t)*ay),len=Math.hypot(tx,ty),nx=-ty/len*.21,ny=tx/len*.21;ctx.beginPath();ctx.moveTo(c.x+x+nx,c.y+y+ny);ctx.lineTo(c.x+x-nx,c.y+y-ny);ctx.lineWidth=.035;ctx.strokeStyle='#668087';ctx.stroke();}ctx.restore();
   }
   if(junction){
    // One unobstructed hub, with treads only on the separate inlet/outlet arms.
    ctx.fillStyle='#314a50';ctx.beginPath();ctx.arc(c.x,c.y,.30,0,Math.PI*2);ctx.fill();
    const offset=state.running?(visualTime*.13)%.14:0;
    for(const port of new Set([...ins,...outs])){const d=dirs[port],n=[-d[1],d[0]];for(let dist=.29+offset;dist<.51;dist+=.14){ctx.beginPath();ctx.moveTo(c.x+d[0]*dist+n[0]*.20,c.y+d[1]*dist+n[1]*.20);ctx.lineTo(c.x+d[0]*dist-n[0]*.20,c.y+d[1]*dist-n[1]*.20);ctx.strokeStyle='#668087';ctx.lineWidth=.035;ctx.stroke();}}
    if(c.type==='splitter'){ctx.strokeStyle='#e4ae53';ctx.lineWidth=.035;ctx.lineCap='round';ctx.beginPath();for(const out of outs){const d=dirs[out];ctx.moveTo(c.x,c.y);ctx.lineTo(c.x+d[0]*.15,c.y+d[1]*.15);}ctx.stroke();ctx.lineCap='butt';}
   }
  });
  for(const out of outs)directionArrow(junction?{...c,dir:out,arrowOffset:.34,arrowScale:.52}:c);
 }
 function jobProgress(c){return c.job?Math.min(1,Math.max(0,(state.time-c.job.start)/(c.job.end-c.job.start))):0;}
 function itemPosition(c,q){
  if(!isTransport(c)){const d=dirs[c.dir],p=outputTile(c);return {x:p.x+d[0]*.5,y:p.y+d[1]*.5,dx:d[0],dy:d[1]};}
  if(c.type==='tunnelIn'){const d=dirs[c.dir],exit=tunnelExit(c),length=exit?Math.abs(exit.x-c.x)+Math.abs(exit.y-c.y):1,t=q.progress||0;return {x:c.x-d[0]*.5+d[0]*length*t,y:c.y-d[1]*.5+d[1]*length*t,dx:d[0],dy:d[1],underground:underground(c,q)};}
  const entry=q.entry??(c.dir+2)%4,exit=c.type==='splitter'?(q.exit??c.dir):c.dir,a=dirs[entry],b=dirs[exit],t=Math.min(1,Math.max(0,q.progress||0));
  if((entry+2)%4===exit)return {x:c.x+a[0]*.5+(b[0]-a[0])*.5*t,y:c.y+a[1]*.5+(b[1]-a[1])*.5*t,dx:b[0]-a[0],dy:b[1]-a[1],underground:underground(c,q)};
  return {x:c.x+((1-t)**2*a[0]+t*t*b[0])*.5,y:c.y+((1-t)**2*a[1]+t*t*b[1])*.5,dx:t*b[0]-(1-t)*a[0],dy:t*b[1]-(1-t)*a[1]};
 }
 function drawItem(item,v){
  const p=point(v.x,v.y),s=projection.size;ctx.save();ctx.translate(p.x,p.y-s*.045);
  const angle=Math.atan2((v.dx+v.dy)*.5,v.dx-v.dy);ctx.rotate(angle);
  ctx.fillStyle='#10292d38';ctx.beginPath();ctx.ellipse(0,s*.07,s*.23,s*.10,0,0,Math.PI*2);ctx.fill();
  if(item==='wood'){
   // A bark-covered log with a pale cut face and growth rings.
   const length=s*.44,r=s*.095;ctx.fillStyle='#754222';ctx.fillRect(-length/2,-r,length,r*2);ctx.fillStyle='#ae6936';ctx.fillRect(-length/2,-r,length,r*.8);ctx.strokeStyle='#5e361e';ctx.lineWidth=Math.max(1,s*.025);for(const y of [-.02,.055]){ctx.beginPath();ctx.moveTo(-length*.35,s*y);ctx.lineTo(length*.4,s*(y+.012));ctx.stroke();}ctx.fillStyle='#e4b975';ctx.beginPath();ctx.ellipse(length/2,0,r*.55,r,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#a77841';ctx.lineWidth=Math.max(.7,s*.014);for(const k of [.4,.75]){ctx.beginPath();ctx.ellipse(length/2,0,r*.55*k,r*k,0,0,Math.PI*2);ctx.stroke();}
  }else if(item==='plank'){
   const length=s*.49,w=s*.16;ctx.fillStyle='#9d642c';ctx.fillRect(-length/2,-w/2+.06*s,length,w);ctx.fillStyle='#efc379';ctx.fillRect(-length/2,-w/2,length,w);ctx.strokeStyle='#c68c44';ctx.lineWidth=Math.max(1,s*.017);for(const y of [-.035,.028]){ctx.beginPath();ctx.moveTo(-length*.42,s*y);ctx.bezierCurveTo(-length*.12,s*(y+.026),length*.14,s*(y-.012),length*.43,s*y);ctx.stroke();}ctx.beginPath();ctx.ellipse(length*.16,0,s*.025,s*.014,0,0,Math.PI*2);ctx.stroke();
  }else{ctx.fillStyle=items[item][1];ctx.fillRect(-s*.15,-s*.1,s*.3,s*.17);ctx.fillStyle='#fff7';ctx.fillRect(-s*.15,-s*.1,s*.3,s*.04);}
  ctx.restore();
 }
 function drawResource(item,x,y){
  const s=projection.size,p=point(x,y),occupied=!!cellAt(x,y);
  diamond(x,y,.96,item==='wood'?'#78ac60':item==='copper'?'#af9872':'#8c9e87','#b6d18a');
  const leaf=(cx,cy,r,color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(cx,cy,r,r*.78,-.12,0,Math.PI*2);ctx.fill();};
  if(item==='wood'){
   for(const [dx,dy,h]of occupied?[[-.35,-.12,.65],[.13,-.35,.72]]:[[-.29,-.24,.78],[.28,-.15,.95],[-.03,.30,.72]]){
    const t=point(x+dx,y+dy);ctx.fillStyle='#173f3028';ctx.beginPath();ctx.ellipse(t.x,t.y+s*.06,s*.24,s*.10,0,0,Math.PI*2);ctx.fill();
    polygon([{x:t.x-s*.045,y:t.y+s*.06},{x:t.x-s*.04,y:t.y-s*h*.57},{x:t.x+s*.04,y:t.y-s*h*.57},{x:t.x+s*.055,y:t.y+s*.06}],'#8b542b');
    ctx.strokeStyle='#c8964c';ctx.lineWidth=Math.max(1,s*.022);ctx.beginPath();ctx.moveTo(t.x+s*.016,t.y);ctx.lineTo(t.x+s*.008,t.y-s*h*.48);ctx.stroke();
    leaf(t.x,t.y-s*h*.66,s*.25,'#175f43');leaf(t.x-s*.11,t.y-s*h*.69,s*.19,'#248151');leaf(t.x+s*.11,t.y-s*h*.77,s*.19,'#30975b');leaf(t.x-s*.02,t.y-s*h*.93,s*.18,'#54b76e');leaf(t.x-s*.08,t.y-s*h*.96,s*.11,'#78ce81');
   }
   for(const [dx,dy]of [[-.32,.30],[.35,.26]]){const t=point(x+dx,y+dy);leaf(t.x,t.y,s*.065,'#c8dc76');}
  }else{
   for(const [dx,dy,r,h]of [[-.27,-.17,.28,.24],[.28,-.17,.25,.31],[.04,.25,.32,.22]]){
    const t=point(x+dx,y+dy),top={x:t.x-s*r*.16,y:t.y-s*h},left={x:t.x-s*r,y:t.y-s*h*.34},right={x:t.x+s*r,y:t.y-s*h*.22},bottom={x:t.x+s*r*.14,y:t.y+s*r*.32};
    ctx.fillStyle='#25483730';ctx.beginPath();ctx.ellipse(t.x,t.y+s*r*.15,s*r*1.15,s*r*.44,0,0,Math.PI*2);ctx.fill();
    polygon([left,top,{x:t.x+s*r*.53,y:t.y-s*h*.8},right,bottom,{x:t.x-s*r*.7,y:t.y+s*r*.20}],item==='copper'?'#97745a':'#7e9399','#4e666a');
    polygon([left,top,{x:t.x+s*r*.53,y:t.y-s*h*.8},{x:t.x+s*r*.05,y:t.y-s*h*.18}],item==='copper'?'#d3ac78':'#c4d2d0');
    polygon([{x:t.x+s*r*.05,y:t.y-s*h*.18},{x:t.x+s*r*.53,y:t.y-s*h*.8},right,bottom],item==='copper'?'#b98252':'#99acb0');
    ctx.strokeStyle=item==='copper'?'#e8a75c':'#d9e7e5';ctx.lineWidth=Math.max(1,s*.025);ctx.beginPath();ctx.moveTo(t.x-s*r*.50,t.y-s*h*.35);ctx.lineTo(t.x-s*r*.05,t.y-s*h*.48);ctx.lineTo(t.x+s*r*.25,t.y-s*h*.35);ctx.stroke();
   }
  }
  if(!occupied)text(sourceAt(x,y)[3]+'/m',p.x,p.y+s*.7,Math.max(10,s*.3),'#f6ffe5');
 }
 function drawPorts(c){
  if(sizeOf(c)!==2)return;
  inputPorts(c).forEach((port,i)=>{const d={x:port.fromX-port.x,y:port.fromY-port.y},v={x:port.x+d.x*.64,y:port.y+d.y*.64};gridPlane(()=>{ctx.strokeStyle=items[port.item][1];ctx.lineWidth=.28;ctx.beginPath();ctx.moveTo(port.x+d.x*.35,port.y+d.y*.35);ctx.lineTo(v.x+d.x*.13,v.y+d.y*.13);ctx.stroke();ctx.strokeStyle='#234b41';ctx.lineWidth=.035;ctx.stroke();});drawItem(port.item,{...v,dx:-d.x,dy:-d.y});const p=point(v.x+d.x*.38,v.y+d.y*.38);text(`${i+1} ${items[port.item][0]}`,p.x,p.y,Math.max(10,projection.size*.25),'#fff5d0');});
  directionArrow({...c,...outputTile(c)},true);
 }
 function drawTunnel(c){
  const d=dirs[c.dir],n=[-d[1],d[0]],s=projection.size,at=(u,v,z=0)=>{const p=point(c.x+d[0]*u+n[0]*v,c.y+d[1]*u+n[1]*v);return {x:p.x,y:p.y-z*s};};
  const sign=c.type==='tunnelIn'?1:-1;
  polygon([at(-.16*sign,-.39),at(.42*sign,-.39),at(.42*sign,.39),at(-.16*sign,.39)],'#223f49','#b5d6d2');
  polygon([at(.06*sign,-.38,.36),at(.42*sign,-.38,.36),at(.42*sign,.38,.36),at(.06*sign,.38,.36)],'#6b8c99','#274e5c');
  polygon([at(.06*sign,-.38,0),at(.06*sign,-.38,.36),at(.06*sign,.38,.36),at(.06*sign,.38,0)],'#182f38','#9cd5cc');
  for(const v of [-.34,.34])polygon([at(.02*sign,v-.055),at(.02*sign,v-.055,.38),at(.02*sign,v+.055,.38),at(.02*sign,v+.055)],'#ffc15a');
  const p=at(.24*sign,0,.39);text(c.type==='tunnelIn'?'IN':'OUT',p.x,p.y,Math.max(9,s*.24),'#e5fff5');
  directionArrow({...c,arrowOffset:c.type==='tunnelIn'?-.31:.31,arrowScale:.60});
  if(state.selected===key(c.x,c.y)&&c.type==='tunnelIn'){const exit=tunnelExit(c);if(exit){gridPlane(()=>{ctx.setLineDash([.12,.10]);ctx.strokeStyle='#9ce9dd';ctx.lineWidth=.055;ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.lineTo(exit.x,exit.y);ctx.stroke();ctx.setLineDash([]);});}else{const p=point(c.x,c.y);text('Match exit →',p.x,p.y-s*.75,11,'#ffe08d');}}
 }
 function drawMachine(c){
  const s=projection.size,progress=jobProgress(c),working=!!c.job&&progress<1,clock=c.job?Math.min(state.time,c.job.end):0,phase=clock*Math.PI*4,d=dirs[c.dir],n=[-d[1],d[0]];
  const scale=sizeOf(c)===2?1.8:1,centre=sizeOf(c)===2?.5:0;
  const world=(u,v)=>({x:c.x+centre+(d[0]*u+n[0]*v)*scale,y:c.y+centre+(d[1]*u+n[1]*v)*scale});
  const at=(u,v,z=0)=>{const w=world(u,v),p=point(w.x,w.y);return {x:p.x,y:p.y-z*s};};
  const steel=['#dce5e9','#7c8c96','#a6b5be'],orange=['#ffad40','#b95515','#e8791c'],dark=['#4d6068','#25363e','#364b54'];
  function block(u,v,length,width,z,height,colors){
   const corners=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>[u+a*length/2,v+b*width/2]);
   const top=corners.map(([a,b])=>at(a,b,z+height)),bottom=corners.map(([a,b])=>at(a,b,z));
   polygon(top,colors[0],'#17303a55');
   for(let i=0;i<4;i++){const j=(i+1)%4,mid=world((corners[i][0]+corners[j][0])/2,(corners[i][1]+corners[j][1])/2),center=world(u,v);if(mid.x+mid.y>center.x+center.y+.001)polygon([top[i],top[j],bottom[j],bottom[i]],colors[i%2?1:2],'#17303a55');}
  }
  function rod(a,b,width,color){const pa=at(...a),pb=at(...b);ctx.lineCap='round';ctx.strokeStyle='#23353e';ctx.lineWidth=s*(width+.045);ctx.beginPath();ctx.moveTo(pa.x,pa.y);ctx.lineTo(pb.x,pb.y);ctx.stroke();ctx.strokeStyle=color;ctx.lineWidth=s*width;ctx.stroke();ctx.lineCap='butt';}
  function joint(u,v,z,r){const p=at(u,v,z);ctx.fillStyle='#263a43';ctx.beginPath();ctx.arc(p.x,p.y,s*r,0,Math.PI*2);ctx.fill();ctx.fillStyle='#aebdc5';ctx.beginPath();ctx.arc(p.x,p.y,s*r*.57,0,Math.PI*2);ctx.fill();ctx.fillStyle='#546a76';ctx.beginPath();ctx.arc(p.x,p.y,s*r*.22,0,Math.PI*2);ctx.fill();}
  function roller(u){rod([u,-.30,.17],[u,.30,.17],.13,'#7c919b');for(const v of [-.30,.30]){joint(u,v,.17,.075);const p=at(u,v,.17),angle=phase*2;ctx.strokeStyle='#d9e4e8';ctx.lineWidth=Math.max(1,s*.025);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+Math.cos(angle)*s*.048,p.y+Math.sin(angle)*s*.048);ctx.stroke();}}
  function carried(item,u,v,z){const w=world(u,v);ctx.save();ctx.translate(0,-z*s);drawItem(item,{...w,dx:d[0],dy:d[1]});ctx.restore();}
  function log(u,v,z){
   const a=at(u-.23,v,z),b=at(u+.23,v,z);ctx.lineCap='round';ctx.strokeStyle='#5b321b';ctx.lineWidth=s*.20;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.strokeStyle='#b57138';ctx.lineWidth=s*.14;ctx.stroke();ctx.lineCap='butt';
   const angle=Math.atan2(b.y-a.y,b.x-a.x);ctx.save();ctx.translate(b.x,b.y);ctx.rotate(angle);ctx.fillStyle='#f5cb87';ctx.beginPath();ctx.ellipse(0,0,s*.045,s*.095,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#aa783e';ctx.lineWidth=Math.max(1,s*.014);for(const r of [.45,.78]){ctx.beginPath();ctx.ellipse(0,0,s*.045*r,s*.095*r,0,0,Math.PI*2);ctx.stroke();}ctx.restore();
  }
  function wheel(u,v,z,r,color,spin=phase){const pts=[];for(let i=0;i<32;i++){const a=i*Math.PI/16+spin,rad=r*(i%2?.82:1);pts.push(at(u+Math.cos(a)*rad,v,z+Math.sin(a)*rad));}polygon(pts,color,'#354e5b');joint(u,v,z,r*.26);}
  // All machine geometry uses its output direction, including the working mechanisms.
  block(0,0,.84,.76,.02,.10,dark);
  if(c.type==='dock'){
   block(0,0,.78,.70,.12,.06,steel);block(0,0,.60,.53,.18,.035,dark);
   for(const v of [-.32,.32])block(0,v,.79,.06,.18,.11,orange);
   for(const u of [-.33,.33])block(u,-.28,.09,.09,.18,.52,orange);
   block(0,-.28,.80,.13,.68,.08,steel);
   if(state.deliveries[c.dock]){carried(state.level.target,-.08,0,.22);carried(state.level.target,.16,.06,.23);}
   const sign=at(0,-.28,.49);ctx.fillStyle='#154f3c';ctx.fillRect(sign.x-s*.24,sign.y-s*.13,s*.48,s*.24);text('↓',sign.x,sign.y-s*.02,s*.28,'#c3ffe7');
   const pulse=c.lastDelivery!==undefined?Math.max(0,1-(state.time-c.lastDelivery)*2):0,light=at(.33,-.28,.78);ctx.fillStyle=pulse?'#8dffd0':'#49a98a';ctx.beginPath();ctx.arc(light.x,light.y,s*(.055+pulse*.035),0,Math.PI*2);ctx.fill();
   const label=at(0,0,-.55);text('DELIVER',label.x,label.y,Math.max(9,s*.25),'#edfff5');return;
  }else if(c.type==='extractor'){
   block(.14,.06,.48,.62,.12,.29,orange);block(.14,.06,.48,.62,.41,.07,steel);
   block(.39,0,.08,.33,.12,.22,dark);block(.43,0,.08,.37,.12,.035,steel);
   for(let i=0;i<3;i++)block(.12+i*.07,.38,.035,.012,.22,.10,dark);
   const resource=sourceAt(c.x,c.y)?.[0]||'wood';
   if(resource==='wood'){
   const carrying=working&&progress>=.15&&progress<.75,feed=working?Math.min(1,Math.max(0,(progress-.15)/.60)):0,reach=progress>.75?Math.max(0,1-(progress-.75)/.25):feed,lift=Math.sin(reach*Math.PI);
   const shoulder=[-.14,.14,.48],elbow=[-.32,.12,.92+lift*.12],wrist=[-.43+reach*.74,-.20,.46+lift*.22];
   block(-.40,-.20,.44,.30,.12,.06,dark);if(!working||progress<.15)log(-.43,-.20,.27);if(working&&progress>=.75)log(.34,-.16,.25);
   block(-.14,.14,.21,.24,.40,.16,dark);rod(shoulder,elbow,.15,'#f18a21');rod(elbow,wrist,.13,'#f18a21');rod([-.12,.19,.56],[-.24,.17,.87+lift*.16],.04,'#d9e4eb');
   joint(...shoulder,.09);joint(...elbow,.085);joint(...wrist,.07);
   if(carrying)log(wrist[0],wrist[1],wrist[2]-.15);
   const spread=carrying?.13:.22;
   for(const side of [-1,1]){rod(wrist,[wrist[0],wrist[1]+side*spread,wrist[2]-.12],.055,'#768c98');rod([wrist[0],wrist[1]+side*spread,wrist[2]-.12],[wrist[0]+.04,wrist[1]+side*.07,wrist[2]-.25],.055,'#768c98');}
   }else{
    const copper=resource==='copper',rock=copper?['#c39062','#754b33','#a16b47']:['#b0bec5','#586b77','#8296a1'];
    block(-.27,-.10,.34,.35,.12,.15,rock);block(-.30,.20,.12,.12,.13,.77,orange);block(-.12,.20,.45,.22,.87,.10,steel);
    const plunge=working?(Math.sin(phase*1.5)+1)*.075:0;
    rod([-.24,-.10,.85],[-.24,-.10,.29+plunge],.095,'#d3dee4');
    for(let i=0;i<5;i++){const z=.35+i*.09+plunge,turn=phase*2+i*1.7;rod([-.24+Math.cos(turn)*.07,-.10+Math.sin(turn)*.07,z],[-.24-Math.cos(turn)*.07,-.10-Math.sin(turn)*.07,z+.045],.028,'#405764');}
    if(working){for(let i=0;i<4;i++){const t=(clock*2+i*.21)%1;block(-.24+t*.24,-.12+i*.055,.045,.045,.24+t*.13,.04,rock);}carried(resource,.30,-.12,.24);}
   }
  }else if(c.type==='ingot'){
   const brick=['#b97a58','#703f33','#93523a'];
   block(0,0,.69,.64,.12,.54,brick);block(0,0,.75,.70,.66,.07,dark);
   block(-.22,-.20,.20,.22,.73,.36,brick);block(-.22,-.20,.25,.27,1.09,.06,dark);
   polygon([at(-.21,.331,.20),at(.21,.331,.20),at(.21,.331,.55),at(-.21,.331,.55)],'#26313b','#f6a74c');
   if(working){const flicker=.04*Math.sin(phase*2);polygon([at(-.15,.34,.24),at(.15,.34,.24),at(.12,.34,.39),at(.035,.34,.35),at(-.035,.34,.51+flicker),at(-.10,.34,.36)],'#ff9634');polygon([at(-.07,.35,.24),at(.07,.35,.24),at(0,.35,.42+flicker)],'#ffe083');
    for(let i=0;i<3;i++){const t=(clock*.5+i*.33)%1,p=at(-.22+t*.1,-.20,1.16+t*.30);ctx.fillStyle='#bac6c44d';ctx.beginPath();ctx.arc(p.x,p.y,s*(.05+t*.08),0,Math.PI*2);ctx.fill();}}
   for(const u of [-.15,0,.15])rod([u,.36,.19],[u,.36,.50],.025,'#687b80');
   block(.35,0,.10,.41,.13,.11,steel);if(working)carried('ingot',.32,-.06,.27);
  }else if(c.type==='gear'){
   block(0,0,.69,.59,.12,.18,steel);
   for(const v of [-.24,.24])block(-.12,v,.14,.12,.30,.50,orange);
   block(-.12,0,.24,.64,.80,.10,orange);
   const press=working?(Math.sin(phase)+1)*.09:0;
   rod([-.12,0,.81],[-.12,0,.53-press],.09,'#b7c9d1');block(-.12,0,.33,.31,.43-press,.09,dark);
   wheel(.17,.32,.45,.20,'#e8c378',phase);wheel(-.15,.32,.38,.12,'#becbd1',-phase*1.6);
   block(.32,0,.12,.32,.21,.045,orange);
  }else if(c.type==='wire'){
   const blue=['#6f9ba6','#325b68','#477c88'];block(0,-.10,.69,.47,.12,.27,blue);
   roller(-.29);roller(.29);
   for(const u of [-.18,.18]){rod([u,-.20,.43],[u,.20,.43],.20,'#b6703e');for(const v of [-.22,.22]){wheel(u,v,.43,.18,'#d29b62',phase*(u<0?1:-1));}for(let k=0;k<4;k++)rod([u-.09+k*.055,-.14,.49],[u-.09+k*.055,.14,.49],.012,'#f0ba78');}
   rod([-.18,.23,.43],[.18,.23,.43],.025,'#efaf68');block(0,-.27,.57,.08,.39,.09,orange);
  }else if(c.type==='toolkit'){
   const teal=['#75a293','#315f58','#4a7d6e'];
   for(const u of [-.28,.28])for(const v of [-.26,.26])block(u,v,.09,.09,.12,.25,dark);
   block(0,0,.77,.67,.37,.09,teal);block(-.24,.07,.22,.22,.46,.12,steel);
   rod([-.25,.24,.51],[-.25,.36,.51],.04,'#c9d8de');joint(-.25,.36,.51,.055);
   const hammer=working?Math.sin(phase)*.13:0;
   rod([-.30,-.22,.49],[-.03,-.22,.70+hammer],.045,'#a07948');block(-.03,-.22,.20,.12,.66+hammer,.10,steel);
   block(.16,.10,.33,.31,.46,.18,['#ed9562','#8d4438','#c56643']);rod([.09,.10,.64],[.09,.10,.73],.027,'#293e49');rod([.09,.10,.73],[.23,.10,.73],.027,'#293e49');rod([.23,.10,.73],[.23,.10,.64],.027,'#293e49');
   block(.16,.27,.06,.018,.51,.04,steel);carried('plank',-.10,-.22,.49);
  }else if(c.type==='circuit'){
   const navy=['#7d91bc','#374769','#536489'];block(0,0,.76,.66,.12,.17,navy);block(0,0,.57,.43,.29,.035,['#5cc59b','#1f7258','#329e79']);
   for(let i=0;i<3;i++){block(-.17+i*.16,0,.09,.11,.325,.045,dark);rod([-.17+i*.16,-.15,.33],[-.17+i*.16,.15,.33],.015,'#ecd285');}
   for(const u of [-.31,.31])block(u,-.25,.08,.08,.29,.48,steel);block(0,-.25,.73,.13,.77,.09,orange);
   const move=working?Math.sin(phase*.5)*.19:0;block(move,-.25,.13,.18,.68,.13,navy);rod([move,-.25,.69],[move,.02,.58],.045,'#d7e5ea');rod([move,.02,.58],[move,.02,.40],.025,'#e8c57c');
   for(let i=0;i<3;i++){const p=at(.29,.23,.32+i*.045);ctx.fillStyle=working&&Math.sin(phase+i)>0?'#9cffd3':'#347767';ctx.beginPath();ctx.arc(p.x,p.y,s*.026,0,Math.PI*2);ctx.fill();}
  }else{
   block(0,-.29,.72,.12,.12,.56,orange);roller(-.30);roller(.30);
   if(working){const ingredient=Object.keys(recipes[c.type].input)[0];carried(ingredient,-.23+progress*.36,0,.23);}
   const saw=c.type==='plank',radius=saw?.25:.19,spin=phase*1.7,teeth=[];
   for(let i=0;i<40;i++){const angle=i*Math.PI/20+spin,r=radius*(i%2?.87:1);teeth.push(at(.02+Math.cos(angle)*r,.19,.43+Math.sin(angle)*r));}
   polygon(teeth,saw?'#d9e5eb':'#e3ad51','#485f6b');joint(.02,.19,.43,.075);
   block(0,.29,.72,.12,.12,.10,orange);block(-.32,.29,.12,.14,.22,.46,orange);block(0,.29,.72,.12,.62,.06,orange);block(0,0,.79,.72,.68,.11,steel);
   block(-.32,-.29,.12,.14,.12,.67,orange);block(.32,.29,.12,.14,.12,.67,orange);
   for(let i=0;i<3;i++)block(-.14+i*.11,.36,.065,.018,.17,.025,dark);
   const mark=at(.23,.37,.64);polygon([{x:mark.x,y:mark.y-s*.05},{x:mark.x+s*.045,y:mark.y+s*.03},{x:mark.x-s*.045,y:mark.y+s*.03}],'#ffc447','#985b13');
   if(working&&saw){ctx.fillStyle='#ffd590';for(let i=0;i<4;i++){const t=(clock*3+i*.23)%1,p=at(.05+t*.21,.35+t*.08,.25+t*.16);ctx.fillRect(p.x,p.y,Math.max(1,s*.023),Math.max(1,s*.023));}}
  }
  if(sizeOf(c)===1)directionArrow(c,true);
 }
 function drawProgress(c){
  if(!recipes[c.type])return;const p=point(c.x+(sizeOf(c)===2?.5:0),c.y+(sizeOf(c)===2?.5:0)),s=projection.size,r=Math.max(13,Math.min(29,s*.34)),y=p.y-s*(c.type==='ingot'?1.55:sizeOf(c)===2?1.65:1.20)-r*.5,progress=jobProgress(c),active=!!c.job&&progress<1;
  ctx.fillStyle='#143e32ed';ctx.beginPath();ctx.arc(p.x,y,r+4,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#527465';ctx.lineWidth=Math.max(3,r*.16);ctx.beginPath();ctx.arc(p.x,y,r,0,Math.PI*2);ctx.stroke();if(c.job){ctx.strokeStyle=active?'#77f1d6':'#efc168';ctx.lineCap='round';ctx.beginPath();ctx.arc(p.x,y,r,-Math.PI/2,-Math.PI/2+Math.PI*2*progress);ctx.stroke();ctx.lineCap='butt';}text(c.job?Math.round(progress*100)+'%':'—',p.x,y,Math.max(9,r*.51),'#f2fff7');
 }
 function draw(){
  const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;const dpr=Math.min(window.devicePixelRatio||1,2);if(canvas.width!==Math.round(rect.width*dpr)||canvas.height!==Math.round(rect.height*dpr)){canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);}ctx.setTransform(dpr,0,0,dpr,0,0);
  const width=rect.width,height=rect.height,base=Math.max(1,Math.min((width-75)/(W+H),(height-100)/((W+H)*.5))),s=base*camera.zoom;projection={size:s,ox:width/2-(W-H)*s/2+camera.x,oy:height/2+(45-height/2)*camera.zoom+camera.y};$('#zoom-value').textContent=Math.round(camera.zoom*100)+'%';
  ctx.fillStyle='#29994c';ctx.fillRect(0,0,width,height);
  for(let sum=0;sum<W+H;sum++)for(let x=0;x<W;x++){const y=sum-x;if(y>=0&&y<H)diamond(x,y,1,(x+y)%2?'#35a655':'#38ab58','#2b994b');}
  for(const [item,x,y]of state.level.sources)drawResource(item,x,y);
  const sorted=[...state.cells.values()].sort((a,b)=>a.x+a.y-b.x-b.y),sprites=[];
  // Surfaces first: no downstream belt can paint over an item on an upstream belt.
  for(const c of sorted){if(c.type==='belt'||c.type==='splitter')drawBelt(c);else if(isTunnel(c))drawBelt(c);else for(const [x,y]of footprint(c))diamond(x,y,.95,c.type==='dock'?'#dad48f':'#d8923d');}
  for(const c of sorted){
   if(c.type!=='belt'&&c.type!=='splitter')sprites.push({depth:c.x+c.y+(sizeOf(c)===2?1.05:.05),c});
   c.queue.forEach(q=>{if(!isTransport(c)&&q.ready>state.time||underground(c,q))return;const v=itemPosition(c,q);sprites.push({depth:v.x+v.y+.02,item:q.item,v});});
  }
  sprites.sort((a,b)=>a.depth-b.depth);
  for(const sprite of sprites){if(sprite.item){drawItem(sprite.item,sprite.v);continue;}if(isTunnel(sprite.c))drawTunnel(sprite.c);else drawMachine(sprite.c);}
  for(const c of sorted){const p=point(c.x,c.y);drawProgress(c);drawPorts(c);if(settings.flowOverlay)drawFlow(c);
   if(key(c.x,c.y)===state.selected||multiSelected.has(key(c.x,c.y))){for(const [x,y]of footprint(c))diamond(x,y,1.02,'#ffe19038','#ffe190');}
   if(allowed('lens')){const count=c.queue.length+Object.values(c.buffer).reduce((a,b)=>a+b,0);if(count)text(String(count),p.x,p.y-s*.95,Math.max(12,s*.35),'#fff');}
   if(c.status==='Output blocked'){ctx.fillStyle='#efba46';ctx.beginPath();ctx.arc(p.x+s*.55,p.y-s*.65,Math.max(4,s*.12),0,Math.PI*2);ctx.fill();}
  }
  if(gesture?.selection&&gesture.dragged){const a=gesture.selectionStart,b=gesture.last;gridPlane(()=>{ctx.beginPath();ctx.rect(Math.min(a.x,b.x)-.5,Math.min(a.y,b.y)-.5,Math.abs(a.x-b.x)+1,Math.abs(a.y-b.y)+1);ctx.fillStyle='#ffe19020';ctx.fill();ctx.strokeStyle='#ffe190';ctx.lineWidth=.045;ctx.stroke();});}
  for(const [,x,y]of tutorial.targets()){diamond(x,y,1.05,'#b6fbff35','#adf9ff');const p=point(x,y);text('↓',p.x,p.y-projection.size*.8,20,'#d9ffff');}
  drawPlacementPreview();updateSelection();if(performance.now()>toastUntil)$('#toast').style.display='none';
 }
 function drawFlow(c){if(c.type==='dock')return;const p=point(c.x+(sizeOf(c)===2?.5:0),c.y+(sizeOf(c)===2?.5:0)),s=projection.size,blocked=(c.blockedFor||0)>=2,label=`${learning.rate(c).toFixed(0)} / ${learning.capacity(c)}${blocked?' !':''}`,font=Math.max(10,Math.min(14,s*.32));ctx.font=`800 ${font}px system-ui`;const width=ctx.measureText(label).width+12,y=p.y+s*.50+7;ctx.fillStyle=blocked?'#ffe0a1':'#113b32eb';ctx.beginPath();ctx.roundRect(p.x-width/2,y-font*.7,width,font+6,6);ctx.fill();text(label,p.x,y+2,font,blocked?'#704818':'#b8ffe5');if(blocked)for(const [x,y]of footprint(c))diamond(x,y,1,'#ffcc5220','#ffd174');}
 window.render_game_to_text=()=>JSON.stringify({mode:modal.open?'dialog':state.mode,dialog:modal.open?$('#modal-content h2')?.textContent:null,team:team().name,teamId:team().id,wallet:wallet(),upgrades:team().upgrades,level:state.level.id,unlocked:levels.filter(opened).map(l=>l.id),prediction:state.prediction,tool:state.tool,direction:state.dir,fullscreen:!!document.fullscreenElement,placementPreview:(()=>{const p=placementPreview();return p?{type:p.c.type,x:p.c.x,y:p.c.y,direction:p.c.dir,footprint:footprint(p.c),valid:p.valid}:null;})(),camera:{...camera},settings:{...settings},learning:learning.snapshot(),tutorial:tutorial.snapshot(),selected:state.selected,multiSelected:[...multiSelected],budget:state.budget,spent:state.level.budget-state.budget,running:state.running,speed:state.speed,time:state.time,delivered:state.deliveries,measuredRate:state.rate,sustainedSeconds:state.hold,stars:team().stars[state.level.id]||[false,false,false],currentStars:state.currentStars,movingItems:[...state.cells.values()].flatMap(c=>c.queue.filter(q=>isTransport(c)||q.ready<=state.time).map(q=>({id:q.id,item:q.item,tile:[c.x,c.y],progress:q.progress??null,...itemPosition(c,q)}))),coordinateSystem:'Grid origin (0,0); x southeast/right, y southwest/left. Orthographic isometric projection. Grid 16 by 11.',sources:state.level.sources,docks:docks(),beltCapacity:beltRate(),cells:[...state.cells.values()].map(c=>({x:c.x,y:c.y,type:c.type,direction:c.dir,weights:c.type==='splitter'?c.weights:undefined,footprint:footprint(c),ports:inputPorts(c),output:outputTile(c),tunnelExit:tunnelExit(c)?[tunnelExit(c).x,tunnelExit(c).y]:null,queue:c.queue.map(q=>q.item),inputs:c.buffer,status:c.status,productionProgress:jobProgress(c),crafting:!!c.job&&state.time<c.job.end,capacity:recipes[c.type]?recipeRate(recipes[c.type]):undefined}))});
 window.advanceTime=ms=>{for(let remaining=Math.min(Math.max(ms,0),600000)/1000;remaining>0;remaining-=1/30)step(Math.min(remaining,1/30));renderUI();draw();};
 let practiceReturn=null;
 function startPractice(savedCells){
  if(state.level.id!=='tutorial'){recordDraft();practiceReturn={state,camera:{...camera},flow:settings.flowOverlay};}
  const level={id:'tutorial',name:'Double the output',concept:'Bottlenecks, parallel rates and percentage gain',target:'plank',count:999999,rate:24,budget:300,lean:115,sources:[['wood',2,3,24]],tools:['plank','splitter'],upgrades:[]};
  state={...state,mode:'building',level,cells:new Map(),tool:'inspect',dir:0,budget:300,time:0,running:false,speed:1,prediction:'12',selected:null,history:[],production:[],rate:0,hold:0,deliveries:[0,0],undo:[],currentStars:[false,false,false],resultShown:false,runStarted:0,peakSpend:0,plan:null,reflection:null,timeline:[],deliveryFlow:[],nextSample:0};
  const dock=cell('dock',13,5,0);dock.dock=0;state.cells.set('13,5',dock);
  const base=[{type:'extractor',x:2,y:3,dir:0},{type:'belt',x:3,y:3,dir:0},{type:'plank',x:4,y:3,dir:0},...Array.from({length:9},(_,n)=>({type:'belt',x:n+5,y:3,dir:n===8?1:0})),{type:'belt',x:13,y:4,dir:1}];
  for(const v of Array.isArray(savedCells)?savedCells.slice(0,176):base){if(!['extractor','belt','plank','splitter'].includes(v.type)||!Number.isInteger(v.x)||!Number.isInteger(v.y)||!Number.isInteger(v.dir)||v.dir<0||v.dir>3)continue;const c=cell(v.type,v.x,v.y,v.dir);if(canPlace(c)&&cost(c.type)<=state.budget){if(Array.isArray(v.weights)&&v.weights.length===3&&v.weights.every(n=>Number.isInteger(n)&&n>=0&&n<=9)&&v.weights.some(n=>n))c.weights=v.weights;state.cells.set(key(c.x,c.y),c);state.budget-=cost(c.type);}}
  camera={zoom:1,x:0,y:0};multiSelected.clear();modal.close();renderUI();draw();
 }
 function leavePractice(){const previous=practiceReturn;practiceReturn=null;modal.close();if(previous){state=previous.state;camera=previous.camera;settings.flowOverlay=previous.flow;}multiSelected.clear();renderUI();draw();if(state.mode==='levels')levelsDialog();}
 function demonstrateBuild(type,x,y,dir){snapshot();resetMeasurement();const existing=cellAt(x,y);if(existing?.type==='dock')return;if(existing){state.cells.delete(key(existing.x,existing.y));state.budget+=cost(existing.type);}const c=cell(type,x,y,dir);if(canPlace(c)&&cost(type)<=state.budget){state.cells.set(key(x,y),c);state.budget-=cost(type);}recordDraft();renderUI();draw();}
 const tutorial=factoryTutorial({get:()=>state,team,save,construction,heading,open:html=>dialog(html,true),start:startPractice,exit:leavePractice,build:demonstrateBuild,rate:()=>learning.dockRate(0),enableFlow:()=>{settings.flowOverlay=true;renderUI();draw();},cancel:()=>modal.close()});
 const learning=factoryLearning({get:()=>state,recipes,items,esc,recipeRate,beltRate,sourceAt,isTransport,heading,save:recordDraft,open:content=>dialog(content,true)});
 $('#math-lab').onclick=()=>learning.planner();$('#flow-toggle').onclick=flowToggle;
 modal.addEventListener('click',e=>{if(e.target.closest('[data-math-debrief]'))learning.review();});
 // Projection-only hook supports touch QA without bypassing construction or simulation.
 window.factoryTilePoint=(x,y)=>{const p=point(x,y),r=canvas.getBoundingClientRect();return {x:p.x+r.left,y:p.y+r.top};};
 let uiElapsed=0;
 function frame(now){const dt=Math.min((now-last)/1000,.1);last=now;visualTime+=dt;step(dt*state.speed);uiElapsed+=dt;if(uiElapsed>.3){renderUI();uiElapsed=0;}draw();requestAnimationFrame(frame);}
 window.addEventListener('pagehide',recordDraft);document.addEventListener('visibilitychange',()=>{if(document.hidden){invalidate();recordDraft();}});
 new ResizeObserver(draw).observe(canvas);state.budget=state.level.budget;renderUI();levelsDialog();draw();requestAnimationFrame(frame);
})();
