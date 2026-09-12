// Dedicated group and classroom engines. Shared-board participation needs no student devices.
const TEAM_COLORS=['#d73969','#3674d8','#178669','#b98414','#8157b8','#d7642c'];
const INVESTMENTS={farm:{name:'Farm',cost:[2,0,1],help:'+1 wood on each later correct answer'},quarry:{name:'Quarry',cost:[0,2,1],help:'+1 stone on each later correct answer'},monument:{name:'Monument',cost:[2,2,2],help:'+3 prestige'},save:{name:'Save resources',cost:[0,0,0],help:'Keep resources for a later round or final points'}};
function setupModeEditor(){
 const mode=GAME_MODES[FORMATS[draft.format].mode],host=$('#mode-setup');
 host.innerHTML=`<div class="mode-explainer"><strong>${mode.label}</strong><p>${mode.description}</p><small>${mode.control} · ${mode.objective}</small></div>`;
 if(draft.format!=='kingdom')return;
 const count=draft.settings.teamCount||4,names=draft.settings.teamNames||['Red','Blue','Green','Yellow','Purple','Orange'];
 host.innerHTML+=`<label>Number of teams<select id="team-count">${[2,3,4,5,6].map(n=>`<option ${n===count?'selected':''}>${n}</option>`).join('')}</select></label><div id="group-names">${Array.from({length:count},(_,i)=>`<label>Team ${i+1}<input data-group-name="${i}" maxlength="30" value="${esc(names[i]||'Team '+(i+1))}"></label>`).join('')}</div><p class="mode-help">Assign a captain, researcher and strategist in each group. Rotate these roles each round. Teams discuss away from the screen, then the teacher records their agreed choices.</p>`;
 $('#team-count').onchange=()=>{draft.settings={...draft.settings,...readModeSettings()};dirty=true;setupModeEditor();};
}
function readModeSettings(){if(draft?.format!=='kingdom'||!$('#team-count'))return {};return {teamCount:Number($('#team-count').value),teamNames:[...document.querySelectorAll('[data-group-name]')].map(n=>n.value)};}
function initModeGame(){
 game.session={phase:'discuss',health:60,choice:null,votes:[],roundVotes:[],groups:[]};
 if(game.lesson.format==='kingdom')game.session.groups=game.lesson.settings.teamNames.map((name,i)=>({name,color:TEAM_COLORS[i],resources:[3,3,2],farms:0,quarries:0,prestige:0,answer:null,pick:null,invested:false}));
}
function modeChoices(){return `<div class="class-options">${game.choices.map((a,i)=>`<div style="--choice:${TEAM_COLORS[i]}"><b>${String.fromCharCode(65+i)}</b><span>${esc(a)}</span></div>`).join('')}</div>`;}
function groupPoints(g){return g.prestige+Math.floor(g.resources.reduce((a,b)=>a+b,0)/3);}
function renderModeGame(){
 const f=game.lesson.format,s=game.session,mode=GAME_MODES[FORMATS[f].mode];
 $('#play-title').textContent=game.lesson.title;$('#play-format').textContent=FORMATS[f].name;$('#play-subtitle').textContent=`${mode.label} · ${mode.control}`;
 $('.player-bottom > span').textContent=f==='kingdom'?'Rotate roles each round. Agree as a group before choosing.':'Teacher-led · discuss, decide, reveal together.';
 $('#scoreboard').innerHTML=f==='kingdom'?`<div class="kingdom-scores">${s.groups.map((g,i)=>`<div style="--team:${g.color}"><strong>${esc(g.name)}</strong><span>🪵 ${g.resources[0]} · 🪨 ${g.resources[1]} · 🪙 ${g.resources[2]}</span><small>${g.prestige} prestige · ${groupPoints(g)} total points</small></div>`).join('')}</div>`:`<div class="class-score"><strong>${f==='earth'?`🌍 Shared planet health: ${s.health} / 100`:'🧭 Everyone participates'}</strong><span>${game.done?'Activity complete':`Round ${game.index+1} of ${game.items.length}`}</span></div>`;
 if(game.done){renderModeResult();return;}
 let html=`<div class="mode-round">${mode.label} · Round ${game.index+1} of ${game.items.length}</div><h2>${esc(current().prompt)}</h2>${modeChoices()}`;
 if(f==='kingdom'){
  if(s.phase==='discuss')html+=`<p class="mode-callout">Researcher: lead the discussion. Captains: agree your answers away from the board first. Teacher: lock each group’s choice, then reveal everyone together.</p><div class="team-decisions">${s.groups.map((g,i)=>`<section style="--team:${g.color}"><h3>${esc(g.name)}</h3>${g.answer===null?`<label>Captain’s answer<select id="answer-group-${i}" data-team-pick="${i}"><option value="" disabled ${g.pick===null?'selected':''}>Choose</option>${game.choices.map((_,n)=>`<option value="${n}" ${g.pick===n?'selected':''}>${String.fromCharCode(65+n)}</option>`).join('')}</select></label><button class="button" data-mode-action="lock" data-group="${i}" ${g.pick===null?'disabled':''}>Lock answer</button>`:'<p>🔒 Answer locked</p>'}</section>`).join('')}</div><button class="button primary" data-mode-action="reveal" ${s.groups.some(g=>g.answer===null)?'disabled':''}>Reveal all answers</button>`;
  else html+=`<div class="mode-feedback"><strong>Answer: ${esc(current().answer)}</strong><p>${esc(current().explanation||'Explain your reasoning before making your investment.')}</p></div><p class="mode-callout">Strategists: agree one investment per group. Farms and quarries earn extra resources on later correct answers. Monuments earn 3 prestige. Every 3 resources left at the end earns 1 point.</p><div class="team-decisions">${s.groups.map((g,i)=>`<section style="--team:${g.color}"><h3>${esc(g.name)} · ${game.choices[g.answer]===current().answer?'Correct: resources earned':'No new resources this round'}</h3><small>${g.farms} farms · ${g.quarries} quarries · ${g.prestige} prestige</small>${g.invested?'<p>✓ Investment decided</p>':Object.entries(INVESTMENTS).map(([id,v])=>`<button class="investment" data-mode-action="invest" data-group="${i}" data-investment="${id}" ${v.cost.some((cost,n)=>g.resources[n]<cost)?'disabled':''}><strong>${v.name}</strong><span>${v.cost.some(Boolean)?`🪵 ${v.cost[0]} · 🪨 ${v.cost[1]} · 🪙 ${v.cost[2]}`:'No cost'}</span><small>${v.help}</small></button>`).join('')}</section>`).join('')}</div><button class="button primary" data-mode-action="next" ${s.groups.some(g=>!g.invested)?'disabled':''}>${game.index===game.items.length-1?'See kingdoms':'Next round · rotate roles'}</button>`;
 }else if(s.phase==='discuss'){
  html+=f==='corners'?`<p class="mode-callout">Move to corner A, B, C or D—or point / show a letter from your seat. Discuss why you chose it. Teacher: optional counts below record the class vote.</p><div class="class-votes">${game.choices.map((_,i)=>`<label>Corner ${String.fromCharCode(65+i)}<input data-vote="${i}" type="number" min="0" max="200" step="1" value="${s.votes[i]||0}"></label>`).join('')}</div><button class="button primary" data-mode-action="reveal">Reveal & discuss</button>`:`<p class="mode-callout">Everyone discusses or votes. Teacher: choose the class’s agreed answer. We share the outcome: +10 health for a correct answer, −15 for a mistake.</p><div class="class-choice">${game.choices.map((_,i)=>`<button class="button ${s.choice===i?'primary':'secondary'}" aria-pressed="${s.choice===i}" data-mode-action="choose" data-choice="${i}">Class choice ${String.fromCharCode(65+i)}</button>`).join('')}</div><button class="button primary" data-mode-action="reveal" ${s.choice===null?'disabled':''}>Reveal the class answer</button>`;
 }else{
  const total=s.votes.reduce((a,b)=>a+b,0);
  html+=`<div class="mode-feedback"><strong>Answer: ${esc(current().answer)}</strong><p>${esc(current().explanation||'Invite someone to explain the reasoning. What changed your mind?')}</p>${f==='earth'?`<h3>${game.feedbackGood?'Our planet recovered 10 health!':'Our planet lost 15 health. Let’s discuss and recover together.'}</h3>`:total?`<div class="vote-results">${game.choices.map((_,i)=>`<div><b>${String.fromCharCode(65+i)} · ${s.votes[i]||0} votes</b><progress max="${total}" value="${s.votes[i]||0}"></progress></div>`).join('')}</div><p>${total} votes recorded this round. Counts are entered by the teacher.</p>`:'<p>No vote counts entered. Discuss the different choices together.</p>'}</div><button class="button primary" data-mode-action="next">${game.index===game.items.length-1||s.health<=0?'Finish together':'Next class question'}</button>`;
 }
 $('#arena').innerHTML=html;
 $('#arena').querySelectorAll('[data-team-pick]').forEach(select=>select.onchange=()=>{const i=Number(select.dataset.teamPick);s.groups[i].pick=Number(select.value);$('#arena').querySelector(`[data-mode-action="lock"][data-group="${i}"]`).disabled=false;});
 $('#arena').querySelectorAll('[data-vote]').forEach(input=>input.oninput=()=>{s.votes[Number(input.dataset.vote)]=Number(input.value);});
}
function renderModeResult(){
 const s=game.session,f=game.lesson.format;let title,detail;
 if(f==='kingdom'){const best=Math.max(...s.groups.map(groupPoints)),winners=s.groups.filter(g=>groupPoints(g)===best);title=winners.length===1?`${winners[0].name} built the winning kingdom!`:'The kingdoms share the victory!';detail=s.groups.map(g=>`<p><strong>${esc(g.name)}: ${groupPoints(g)} points</strong> · ${g.prestige} prestige + ${Math.floor(g.resources.reduce((a,b)=>a+b,0)/3)} resource points</p>`).join('');}
 else if(f==='earth'){title=s.health>0?'We saved our planet together!':'Let’s regroup and try together again.';detail=`<p>Shared planet health: ${s.health} / 100. ${game.correct} correct class decisions out of ${game.attempts}.</p>`;}
 else{title='Every voice was part of the lesson.';detail=`<p>${game.items.length} rounds of movement, voting and discussion. No individual winner.</p><p>${s.roundVotes.reduce((a,b)=>a+b,0)} votes recorded across all rounds (not unique students).</p>`;}
 $('#arena').innerHTML=`<div class="result"><div class="result-icon">${f==='kingdom'?'🏰':f==='earth'?'🌍':'🧭'}</div><h2>${esc(title)}</h2>${detail}<div class="result-actions"><button class="button primary" data-replay>Play again</button><button class="button secondary" data-edit-result>Edit this lesson</button></div></div>`;
}
function handleModeAction(button){
 if(game.done||ui.view!=='player')return;
 const s=game.session,f=game.lesson.format,action=button.dataset.modeAction;
 if(action==='lock'&&f==='kingdom'&&s.phase==='discuss'){const i=Number(button.dataset.group),g=s.groups[i];if(!g||g.answer!==null||g.pick===null)return;g.answer=g.pick;}
 else if(action==='choose'&&f==='earth'&&s.phase==='discuss')s.choice=Number(button.dataset.choice);
 else if(action==='reveal'&&s.phase==='discuss'){
  if(f==='kingdom'){
   if(s.groups.some(g=>g.answer===null))return;
   let hits=0;s.groups.forEach(g=>{if(game.choices[g.answer]===current().answer){g.resources[0]+=2+g.farms;g.resources[1]+=2+g.quarries;g.resources[2]+=2;hits++;}});game.attempts+=s.groups.length;game.correct+=hits;game.feedbackGood=hits>0;s.phase='invest';
  }else{
   if(f==='earth'&&s.choice===null)return;
   if(s.votes.some(n=>!Number.isInteger(n)||n<0||n>200)){notify('Enter whole-number vote counts from 0 to 200.');return;}
   game.attempts++;game.feedbackGood=f==='corners'||game.choices[s.choice]===current().answer;
   if(f==='earth'){if(game.feedbackGood)game.correct++;s.health=Math.max(0,Math.min(100,s.health+(game.feedbackGood?10:-15)));}
   else s.roundVotes.push(s.votes.reduce((a,b)=>a+b,0));s.phase='review';
  }
 }else if(action==='invest'&&f==='kingdom'&&s.phase==='invest'){
  const g=s.groups[Number(button.dataset.group)],id=button.dataset.investment,v=INVESTMENTS[id];if(!g||g.invested||!v||v.cost.some((n,i)=>g.resources[i]<n))return;
  v.cost.forEach((n,i)=>g.resources[i]-=n);if(id==='farm')g.farms++;if(id==='quarry')g.quarries++;if(id==='monument')g.prestige+=3;g.invested=true;
 }else if(action==='next'&&s.phase!=='discuss'){
  if(f==='kingdom'&&s.groups.some(g=>!g.invested))return;
  game.index++;if(game.index>=game.items.length||f==='earth'&&s.health<=0)game.done=true;
  else{prepareRound();s.phase='discuss';s.choice=null;s.votes=[];s.groups.forEach(g=>{g.answer=null;g.pick=null;g.invested=false;});}
 }else return;
 renderGame();
 $('#arena').querySelector('[data-mode-action]:not([disabled]),[data-replay]')?.focus({preventScroll:true});
}
function drawModeWorld(){
 const f=game.lesson.format,s=game.session;if(!s)return;
 if(f==='kingdom'){
  box(0,230,1100,70,0,'#60a47c');s.groups.forEach((g,i)=>{const x=110+i*880/Math.max(1,s.groups.length-1),h=Math.min(150,65+g.prestige*3);box(x-40,230-h,80,h,4,g.color);for(let k=0;k<3;k++)box(x-40+k*30,215-h,20,25,2,g.color);box(x-10,205,20,25,5,'#ffd785');star(x,190-h,9,'#ffdc6b',arcade.time*.5);label(g.name,x,266,17,'#193d41');label(groupPoints(g)+' pts',x,289,15,'#193d41');});
 }else if(f==='earth'){
  stars();circle(550,150,105,'#52acdf');ellipse(515,110,35,22,'#67c58b');ellipse(589,169,34,44,'#67c58b');ellipse(512,196,26,16,'#67c58b');circle(525,147,5,'#164366');circle(575,147,5,'#164366');line(534,174,566,s.health>30?174:165,'#164366',4);for(let i=0;i<10;i++)star(190+i*80,35,10,i<s.health/10?'#c4ff8a':'#ffffff30');label('OUR SHARED PLANET · '+s.health+' HEALTH',550,282,23,'#e7ffd9');
 }else{
  const places=[[200,75],[750,75],[200,190],[750,190]];places.forEach(([x,y],i)=>{box(x,y,150,70,15,TEAM_COLORS[i]);label(String.fromCharCode(65+i),x+75,y+35,35);});label('MOVE · POINT · EXPLAIN',550,35,23,'#245189');label('EVERYONE BELONGS IN THE DISCUSSION',550,290,17,'#245189');
 }
}
