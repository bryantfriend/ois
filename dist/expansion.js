// Distinct classroom mechanics share only question delivery and accessible teacher controls.
function setupExpansionEditor(host){
 if(!EXPANSION[draft.format])return;
 if(['poll','impostor'].includes(draft.format))host.innerHTML+=`<label>Participating students<input id="exp-participants" type="number" min="4" max="40" value="${draft.settings.participants||12}"></label>${draft.format==='impostor'?`<label>Impostors<select id="exp-impostors"><option value="1">1</option><option value="2" ${draft.settings.impostors===2?'selected':''}>2</option></select></label>`:''}<p class="mode-help">Pass a single device privately. Other students look away. No names or student accounts are collected.</p>`;
 if(['escape','territory'].includes(draft.format))host.innerHTML+=`<label>Active-play minutes<input id="exp-minutes" type="number" min="5" max="30" value="${draft.settings.minutes||10}"></label><p class="mode-help">The timer pauses when the game tab is hidden or you return to editing.</p>`;
}
function readExpansionSettings(){return {participants:Number($('#exp-participants')?.value??draft?.settings?.participants??12),impostors:Number($('#exp-impostors')?.value??draft?.settings?.impostors??1),minutes:Number($('#exp-minutes')?.value??draft?.settings?.minutes??10)};}
function initExpansion(){
 const f=game.lesson.format,c=EXPANSION[f];
 game.session={engine:'expansion',phase:'question',qIndex:0,round:0,choices:[],message:'',success:null,groups:[],map:Array(24).fill(-1),health:5,boss:game.items.length*20,progress:0,fuel:6,oxygen:8,shields:2,supplies:3,safety:60,resilience:0,evacuated:false,keys:0,artifacts:0,maps:0,path:[],streak:0,best:0,mistakes:0,target:game.items.length*3,seconds:game.lesson.settings.minutes*60,code:Array.from({length:3},()=>String(Math.floor(Math.random()*10))),unlocked:0,solved:0,ballots:Array(4).fill(0),responses:0,agent:0,privateOpen:false,accused:[],market:10};
 const s=game.session;
 if(c.mode==='TEAM')s.groups=game.lesson.settings.teamNames.map((name,i)=>({name,color:TEAM_COLORS[i],answer:null,pick:null,action:null,ap:0,health:80,boss:80,streak:0,fuel:6,oxygen:8,hull:5,progress:0,food:6,water:6,shelter:0,signals:0,base:0,height:0,rare:0,antenna:0,cash:30,workers:0,factories:0,ads:0,treasure:0,crystal:3,captures:0,shield:0,scout:0,trap:false,guesses:3}));
 if(f==='spy'||f==='impostor'){s.qIndex=Math.floor(Math.random()*game.items.length);s.phase='private';s.impostors=shuffle(Array.from({length:game.lesson.settings.participants},(_,i)=>i)).slice(0,game.lesson.settings.impostors);}
 if(f==='higher')s.qIndex=1;
 expansionQuestion();
}
function expansionQuestion(){const s=game.session;s.choices=shuffle([current().answer,...current().options]);s.choice=null;s.ballots=Array(s.choices.length).fill(0);s.responses=0;s.groups.forEach(g=>{g.answer=null;g.pick=null;g.action=null;g.pending="wait";});}
function xButton(action,text,attrs='',disabled=false){return `<button class="button ${action==='next'?'primary':'secondary'}" data-mode-action="x-${action}" ${attrs} ${disabled?'disabled':''}>${text}</button>`;}
function xTeamSummary(g,f){
 if(f==='mars')return `🚀 ${g.progress}/8 · Fuel ${g.fuel} · O₂ ${g.oxygen} · Hull ${g.hull}`;
 if(f==='island')return `♥ ${g.health} · Food ${g.food} · Water ${g.water} · Shelter ${g.shelter} · Signals ${g.signals}`;
 if(f==='raid')return `Boss ${g.boss} · Team ♥ ${g.health} · AP ${g.ap} · Streak ${g.streak}`;
 if(f==='build')return `Materials ${g.ap} · Rare ${g.rare} · Base ${g.base} · Height ${g.height}/3 · Antenna ${g.antenna}`;
 if(f==='tycoon')return `Cash ${g.cash} · Staff ${g.workers} · Factories ${g.factories} · Ads ${g.ads}`;
 if(f==='fleet')return `Treasure ${g.treasure} · Fuel ${g.fuel} · Hull ${g.hull}`;
 if(f==='crystal')return `Crystal ${g.crystal}/3 · Captures ${g.captures} · Shield ${g.shield} · AP ${g.ap}`;
 if(f==='spy')return `${g.guesses} guesses remaining`;
 return `Territories ${game.session.map.filter(n=>n===game.session.groups.indexOf(g)).length} · AP ${g.ap}`;
}
function xActions(g,i){
 const f=game.lesson.format,s=game.session,a=[['wait','Save / wait',true]],add=(id,label,ok)=>a.push([id,label,ok]);
 if(f==='mars'){add('cruise','Cruise: 2 fuel → +1 distance',g.fuel>=2&&g.hull>0&&g.oxygen>0);add('boost','Boost: 4 fuel + 2 oxygen → +3 distance',g.fuel>=4&&g.oxygen>=3&&g.hull>0);add('repair','Repair: 2 fuel → +2 hull',g.fuel>=2);}
 if(f==='island'){add('food','Gather food: 1 AP → +3',g.ap>=1&&g.health>0);add('water','Collect water: 1 AP → +3',g.ap>=1&&g.health>0);add('shelter','Build shelter: 2 AP → storm protection',g.ap>=2&&g.health>0);add('signal','Rescue signal: 2 AP → +1 signal',g.ap>=2&&g.health>0);}
 if(f==='territory'){for(let n=0;n<24;n++){const own=s.map[n],neighbors=[n%6? n-1:-1,n%6<5?n+1:-1,n-6,n+6].filter(k=>k>=0&&k<24),adj=!s.map.includes(i)||neighbors.some(k=>s.map[k]===i);add('land:'+n,`Capture ${n+1}${n%6===0?' ★ bonus':''}: ${own<0?1:2} AP`,own!==i&&adj&&g.ap>=(own<0?1:2));}}
 if(f==='raid'){add('strike','Strike: 2 AP → 20 damage',g.ap>=2&&g.health>0);add('magic','Special attack: 3 AP → 35 damage',g.ap>=3&&g.health>0);add('heal','Heal: 2 AP → restore 25 health',g.ap>=2&&g.health>0);add('guard','Defend: 1 AP → block retaliation',g.ap>=1&&g.health>0);}
 if(f==='build'){add('base','Foundation: 2 materials',g.ap>=2&&!g.base);add('tower','Tower level: 2 materials; needs foundation',g.ap>=2&&g.base&&g.height<3);add('antenna','Antenna: 2 materials + 1 rare; needs 3 levels',g.ap>=2&&g.rare>=1&&g.height>=3&&!g.antenna);}
 if(f==='tycoon'){add('worker','Employee: 20 cash → market income',g.cash>=20);add('factory','Factory: 40 cash → double market income',g.cash>=40);add('ads','Advertising: 15 cash → +5 income/round',g.cash>=15);}
 if(f==='fleet'){add('coast','Coast: 1 fuel → 5 treasure, safe',g.fuel>=1&&g.hull>0);add('reef','Reef: 2 fuel → 15 treasure, possible 2 damage',g.fuel>=2&&g.hull>0);add('storm','Storm route: 3 fuel → 25 treasure, 3 damage',g.fuel>=3&&g.hull>0);add('repair','Repair: 1 fuel → +2 hull',g.fuel>=1);}
 if(f==='crystal'){add('shield','Shield: 1 AP → block one attack',g.ap>=1&&g.shield<3);add('scout','Scout: 1 AP → next attack +1 damage',g.ap>=1&&!g.scout);add('trap','Trap: 2 AP → cancel next incoming attack',g.ap>=2&&!g.trap);s.groups.forEach((r,n)=>{if(n!==i)add('attack:'+n,`Attack ${r.name}: 2 AP`,g.ap>=2);});}
 return a;
}
function xMap(){const s=game.session;return `<div class="territory-map">${s.map.map((owner,n)=>`<div title="${owner<0?'Unclaimed':esc(s.groups[owner].name)}" style="--owner:${owner<0?'#e6eafa':s.groups[owner].color}"><b>${n+1}${n%6===0?' ★':''}</b><small>${owner<0?'Free':esc(s.groups[owner].name)}</small></div>`).join('')}</div>`;}
function renderExpansion(){
 const f=game.lesson.format,s=game.session,c=EXPANSION[f],team=c.mode==='TEAM';
 $('#play-title').textContent=game.lesson.title;$('#play-format').textContent=c.name;$('#play-subtitle').textContent=`${team?'🔴 Teams':'🏫 Whole Class'} · ${['spy','impostor','poll'].includes(f)?'Pass the device privately':'Teacher hosts'}`;$('.player-bottom > span').textContent=team?'Discuss your plan together. Rotate the spokesperson.':'One shared classroom experience.';
 $('#scoreboard').innerHTML=team?`<div class="kingdom-scores">${s.groups.map(g=>`<div style="--team:${g.color}"><strong>${esc(g.name)}</strong><small>${xTeamSummary(g,f)}</small></div>`).join('')}</div>`:`<div class="class-score"><strong>${xClassStatus()}</strong><span>${f==='escape'||f==='territory'?'<span id="exp-timer"></span>':`Round ${s.round+1}`}</span></div>`;
 if(game.done){$('#arena').innerHTML=`<div class="result"><div class="result-icon">${c.emoji}</div><h2>${esc(s.result||'Activity complete')}</h2><p>${esc(s.message)}</p><div class="result-actions"><button class="button primary" data-replay>Play again</button><button class="button secondary" data-edit-result>Edit lesson</button></div></div>`;return;}
 let html=`<div class="mode-round">${c.name}${team&&f!=='spy'?` · Round ${s.round+1}${f==='territory'?'':` of ${Math.max(game.items.length,f==='build'?5:f==='raid'?4:f==='mars'?3:0)}`}`:''}${f==='territory'?' · <span id="exp-timer"></span>':''}</div>`;
 if(f==='spy'||f==='impostor'){html+=xPrivateUI();}
 else if(f==='poll'){html+=xPollUI();}
 else if(s.phase==='code'){html+=`<h2>The final exit lock</h2><p>Combine the digits you found: ${s.code.map((digit,i)=>`Lock ${i+1}: ${digit}`).join(' · ')}</p><label>Exit code<input id="escape-code" inputmode="numeric" maxlength="3" autocomplete="off"></label>${xButton('code','Unlock the exit')}<p>${esc(s.message)}</p>`;}
 else if(team){
  if(f==='territory')html+=xMap();
  if(s.phase==='question')html+=`<h2>${esc(current().prompt)}</h2>${xChoiceTiles()}<p class="mode-callout">Agree answers in your groups before anyone locks. Every team answers the same challenge; reveal together.</p><div class="team-decisions">${s.groups.map((g,i)=>`<section style="--team:${g.color}"><h3>${esc(g.name)}</h3>${g.answer!==null?'<p>🔒 Locked</p>':`<label>Group answer<select data-x-pick="${i}"><option value="" disabled ${g.pick===null?'selected':''}>Choose</option>${s.choices.map((_,n)=>`<option value="${n}" ${g.pick===n?'selected':''}>${String.fromCharCode(65+n)}</option>`).join('')}</select></label>${xButton('lock','Lock answer',`data-team="${i}"`,g.pick===null)}`}</section>`).join('')}</div>${xButton('reveal','Reveal together','',s.groups.some(g=>g.answer===null))}`;
  else if(s.phase==='plan')html+=`<div class="mode-feedback"><strong>Answer: ${esc(current().answer)}</strong><p>${esc(s.message)}</p></div><p class="mode-callout">Strategists: discuss and choose one action each. Everyone commits before actions resolve.</p><div class="team-decisions">${s.groups.map((g,i)=>`<section style="--team:${g.color}"><h3>${esc(g.name)}</h3>${g.action!==null?'<p>✓ Plan committed</p>':`<label>Team plan<select id="x-action-${i}">${xActions(g,i).map(([id,label,ok])=>`<option value="${id}" ${ok?'':'disabled'} ${g.pending===id?'selected':''}>${esc(label)}</option>`).join('')}</select></label>${xButton('plan','Commit plan',`data-team="${i}"`)}`}</section>`).join('')}</div>${xButton('resolve','Resolve team plans','',s.groups.some(g=>g.action===null))}`;
  else html+=`<h2>Round outcome</h2><div class="mode-feedback">${esc(s.message)}</div>${xButton('next','Continue together')}`;
 }else{
  const q=f==='higher'?`Reference: ${game.items[s.qIndex-1].prompt} = ${game.items[s.qIndex-1].answer}. Is ${current().prompt} higher, lower, or equal?`:current().prompt;
  html+=`<h2>${esc(q)}</h2>`;
  if(s.phase==='question'){const choices=f==='higher'?['Higher','Lower','Equal']:s.choices;html+=`<p class="mode-callout">Everyone discusses or votes. The teacher records the class decision.</p><div class="class-choice">${choices.map((a,i)=>xButton('choose',esc(a),`data-choice="${i}" aria-pressed="${s.choice===i}"`)).join('')}</div><p>${s.choice===null?'Choose together before revealing.':'Class choice: '+esc(choices[s.choice])}</p>${xButton('reveal','Reveal the class decision','',s.choice===null)}`;}
  else if(s.phase==='branch')html+=`<div class="mode-feedback"><strong>Answer: ${esc(current().answer)}</strong><p>${esc(current().explanation)}</p>${esc(s.message)}</div><p class="mode-callout">Take a class vote. Your choice changes what happens next.</p><div class="class-choice">${xBranches().map(([id,label,ok])=>xButton('branch',esc(label),`data-branch="${id}"`,!ok)).join('')}</div>`;
  else html+=`<div class="mode-feedback"><strong>Answer: ${esc(current().answer)}</strong><p>${esc(s.message)}</p>${current().explanation?`<p>${esc(current().explanation)}</p>`:''}</div>${xButton('next','Continue together')}`;
 }
 $('#arena').innerHTML=html;
 document.querySelectorAll('[data-x-pick]').forEach(el=>el.onchange=()=>{const i=Number(el.dataset.xPick);s.groups[i].pick=Number(el.value);$('#arena').querySelector(`[data-mode-action="x-lock"][data-team="${i}"]`).disabled=false;});
 document.querySelectorAll('[id^=x-action-]').forEach(el=>el.onchange=()=>{s.groups[Number(el.id.split('-').pop())].pending=el.value;});
 const timer=$('#exp-timer');if(timer)timer.textContent=xTime(s.seconds);
}
function xChoiceTiles(){return `<div class="class-options">${game.session.choices.map((a,i)=>`<div style="--choice:${TEAM_COLORS[i]}"><b>${String.fromCharCode(65+i)}</b>${esc(a)}</div>`).join('')}</div>`;}
function xClassStatus(){const s=game.session,f=game.lesson.format;return f==='monster'?`Monster ${s.boss} · Class hearts ${s.health}`:f==='mission'?`Home ${s.progress}/8 · Fuel ${s.fuel} · O₂ ${s.oxygen} · Shields ${s.shields} · Hull ${s.health}`:f==='escape'?`Locks ${s.unlocked}/3 · ${s.solved} puzzles solved`:f==='disaster'?`City safety ${s.safety} · Supplies ${s.supplies} · Communications ${s.resilience}`:f==='streak'?`${game.correct}/${s.target} correct · Streak ${s.streak} · Mistakes ${s.mistakes}/3`:f==='adventure'?`Artifacts ${s.artifacts}/4 · Keys ${s.keys} · Hearts ${s.health} · Maps ${s.maps}`:f==='higher'?`Shared streak ${s.streak} · Best ${s.best}`:'Every voice matters';}
function xPrivateUI(){
 const s=game.session,f=game.lesson.format,q=current(),spy=f==='spy',total=spy?s.groups.length*3:game.lesson.settings.participants;
 if(s.phase==='private'){
  const who=spy?`${s.groups[Math.floor(s.agent/3)].name} · Agent ${s.agent%3+1}`:`Student ${s.agent+1}`;
  if(!s.privateOpen)return `<h2>Pass the device to ${esc(who)}</h2><p>Everyone else looks away. Read your information privately, then hide it before passing on.</p>${xButton('private','Show only my information')}`;
  const clue=spy?[q.prompt,q.hint||`The word starts with ${q.answer[0]}.`,`${q.answer.length} letters; ends with ${q.answer.slice(-1)}.`][s.agent%3]:s.impostors.includes(s.agent)?`You are an impostor. Your category is ${game.lesson.topic}. Ask questions and blend in.`:`Your secret term is: ${q.answer}. Do not say it aloud. Describe it indirectly.`;
  return `<div class="private-card"><span>${esc(who)}</span><h2>${esc(clue)}</h2></div>${xButton('hide',s.agent+1===total?'Hide and begin discussion':'Hide and pass on')}`;
 }
 if(spy)return `<h2>Agents, combine your clues</h2><p>Which term connects your information? First correct team wins. Each group has three guesses.</p><div class="team-decisions">${s.groups.map((g,i)=>`<section style="--team:${g.color}"><h3>${esc(g.name)}</h3><label>Team’s agreed term<input id="spy-guess-${i}" autocomplete="off" maxlength="150"></label>${xButton('guess','Submit guess',`data-team="${i}"`,g.guesses<=0)}</section>`).join('')}</div><p role="status">${esc(s.message)}</p>`;
 return `<h2>Who has different information?</h2><p>Ask each other about the topic without naming the term. Agree a class accusation. Identify ${s.impostors.length} impostor${s.impostors.length===1?'':'s'}.</p><label>Accused student<select id="accused">${Array.from({length:game.lesson.settings.participants},(_,i)=>s.accused.includes(i)?'':`<option value="${i}">Student ${i+1}</option>`).join('')}</select></label>${xButton('accuse','Record class accusation')}<p>${s.accused.length} of ${s.impostors.length} accusations recorded. Roles remain hidden until all are recorded.</p>`;
}
function xPollUI(){const s=game.session;
 if(s.phase==='pass')return `<h2>Choice recorded privately</h2><p>${s.responses} responses collected. Pass the device before continuing.</p>${xButton('vote-ready','Next student')}${xButton('poll-close','Teacher: close voting')}`;
 if(s.phase==='review'){const total=Math.max(1,s.responses);return `<h2>${esc(current().prompt)}</h2><div class="vote-results">${s.choices.map((a,i)=>`<div><b>${esc(a)} · ${s.ballots[i]} votes (${Math.round(s.ballots[i]/total*100)}%)</b><progress value="${s.ballots[i]}" max="${total}"></progress></div>`).join('')}</div><p>Anonymous choices on this device. Discuss the reasons behind different views; there is no winning answer.</p>${xButton('next','Next discussion')}`;}
 return `<h2>${esc(current().prompt)}</h2><p>Choose privately. No names are saved. Other students look away; the graph stays hidden until voting closes.</p><div class="class-choice">${s.choices.map((a,i)=>xButton('vote',esc(a),`data-choice="${i}"`)).join('')}</div>`;
}
function xBranches(){const s=game.session,f=game.lesson.format;
 if(f==='mission')return [['home','Head home: 2 fuel → +2 distance',s.fuel>=2],['explore','Explore: 2 fuel → +1 distance, +1 shield',s.fuel>=2],['repair','Repair: 1 fuel → +2 shields',s.fuel>=1],['drift','Drift: +1 fuel, no progress',true]];
 if(f==='disaster')return [['evacuate','Evacuate: 2 supplies → +15 safety',s.supplies>=2],['shelter','Reinforce shelters: 1 supply → +8 safety',s.supplies>=1],['comms','Restore communications: 2 supplies → ongoing protection',s.supplies>=2],['wait','Wait for supplies: +1 supply',true]];
 return [['door','Mysterious door: 1 key → 2 artifacts',s.keys>=1],['tower','Climb tower: 1 key → map and protection',s.keys>=1],['tunnel','Explore tunnel: 1 artifact, risk a heart',true]];
}
function xFinish(title,success,message){game.done=true;game.session.result=title;game.session.success=success;game.session.message=message||game.session.message;}
function xTeamScores(){const s=game.session,f=game.lesson.format;return s.groups.map((g,i)=>f==='mars'?g.progress:f==='island'?(g.health>0?g.signals*5+g.shelter*2+g.food+g.water:-1):f==='territory'?s.map.filter(n=>n===i).length:f==='raid'?80-g.boss:f==='build'?g.height*2+g.base+g.antenna*5:f==='tycoon'?g.cash+g.workers*10+g.factories*20+g.ads*5:f==='fleet'?(g.hull>0?g.treasure:-1):g.captures*5+g.shield);}
function xTeamEnd(){const s=game.session,f=game.lesson.format,scores=xTeamScores();const goals=s.groups.map((g,i)=>f==='mars'?g.progress>=8:f==='raid'?g.boss<=0:f==='build'?g.antenna>0:false);if(goals.some(Boolean)){const names=s.groups.filter((_,i)=>goals[i]).map(g=>g.name).join(' & ');xFinish(`${names} completed the mission!`,true,'Groups share victory if they finish in the same round.');return true;}
 if(s.round+1>=Math.max(game.items.length,f==='build'?5:f==='raid'?4:f==='mars'?3:0)||s.seconds<=0&&f==='territory'){const best=Math.max(...scores),names=s.groups.filter((_,i)=>scores[i]===best).map(g=>g.name).join(' & ');const race=['mars','raid','build'].includes(f);if(best<0){xFinish('No team survived this expedition',false,'Plan repairs and supplies together, then try again.');return true;}xFinish(race?'The mission needs another attempt':`${names} lead the final standings`,!race,`${race?'No team completed the objective. ':''}${s.groups.map((g,i)=>`${g.name}: ${scores[i]}`).join(' · ')}`);return true;}return false;}
function handleExpansion(button){
 const s=game.session,f=game.lesson.format,a=button.dataset.modeAction.slice(2),i=Number(button.dataset.team),g=s.groups[i],n=Number(button.dataset.choice);if(game.done||button.disabled)return;
 if(a==='lock'&&s.phase==='question'&&g&&g.answer===null&&Number.isInteger(g.pick))g.answer=g.pick;
 else if(a==='plan'&&s.phase==='plan'&&g&&g.action===null){const v=document.getElementById('x-action-'+i).value;if(xActions(g,i).some(([id,,ok])=>id===v&&ok))g.action=v;}
 else if(a==='resolve'&&s.phase==='plan'&&s.groups.every(g=>g.action!==null))xResolveTeams();
 else if(a==='choose'&&s.phase==='question'&&n>=0&&n<(f==='higher'?3:s.choices.length))s.choice=n;
 else if(a==='reveal'&&s.phase==='question'){
  if(s.groups.length){if(s.groups.some(g=>g.answer===null))return;let hits=0;s.groups.forEach((g,i)=>{const good=s.choices[g.answer]===current().answer;g.streak=good?g.streak+1:0;if(good){hits++;g.ap+=2+(f==='raid'&&g.streak%3===0?1:0);if(['mars','fleet'].includes(f))g.fuel+=2;if(f==='mars')g.oxygen++;if(f==='tycoon')g.cash+=20;if(f==='build'&&(s.round+1)%3===0)g.rare++;}if(f==='territory')g.ap+=s.map.filter((owner,n)=>owner===i&&n%6===0).length;});game.attempts+=s.groups.length;game.correct+=hits;game.feedbackGood=hits>0;s.message=`${hits} groups earned resources. ${current().explanation||''}`;s.phase='plan';}
  else {if(s.choice===null)return;const value=Number(current().answer.replace('−','-')),prev=Number(game.items[Math.max(0,s.qIndex-1)].answer.replace('−','-'));const good=f==='higher'?s.choice===(value>prev?0:value<prev?1:2):s.choices[s.choice]===current().answer;game.attempts++;if(good)game.correct++;game.feedbackGood=good;s.streak=good?s.streak+1:0;s.best=Math.max(s.best,s.streak);s.message=good?'Correct! Your class moves forward.':'Not this time. Discuss the explanation together.';s.phase='outcome';
   if(f==='monster'){if(good)s.boss=Math.max(0,s.boss-20);else s.health-=s.boss<=game.items.length*20/3?2:1;if(!s.boss)xFinish('The class defeated the monster!',true);else if(s.health<=0)xFinish('The monster won this round',false);else s.message+=s.boss<=game.items.length*20/3?' Final phase: mistakes cost two hearts.':' Keep working together to weaken the monster.';}
   if(f==='escape'){if(good){s.solved++;s.unlocked=Math.min(3,Math.floor(s.solved/2));s.message+=` ${s.solved%2?'One more puzzle opens this lock.':'A lock opens! Digit: '+s.code[s.unlocked-1]}`;if(s.unlocked===3)s.phase='code';}else s.seconds=Math.max(0,s.seconds-30);}
   if(f==='streak'){if(!good)s.mistakes++;if(game.correct>=s.target)xFinish('Class challenge complete!',true,`${game.correct} correct together. Best streak: ${s.best}.`);else if(s.mistakes>=3)xFinish('Three mistakes — regroup and retry',false,`You collected ${game.correct} correct answers. Best streak: ${s.best}.`);else if(good&&s.streak%5===0)s.message+=` Milestone: ${s.streak} in a row!`;}
   if(['mission','disaster','adventure'].includes(f)){if(f==='mission'){if(good){s.fuel+=2;s.oxygen++;}else s.health--;}if(f==='disaster'){if(good)s.supplies++;else s.safety-=8;}if(f==='adventure'){if(good)s.keys++;else s.health--;}s.phase='branch';if(s.health<=0)xFinish('Your class needs another attempt',false);}
  }
 }
 else if(a==='branch'&&s.phase==='branch'){const v=button.dataset.branch;if(!xBranches().some(([id,,ok])=>id===v&&ok))return;xResolveBranch(v);}
 else if(a==='private'&&s.phase==='private'&&!s.privateOpen)s.privateOpen=true;
 else if(a==='hide'&&s.phase==='private'&&s.privateOpen){s.privateOpen=false;s.agent++;if(s.agent>=(f==='spy'?s.groups.length*3:game.lesson.settings.participants))s.phase='discussion';}
 else if(a==='guess'&&f==='spy'&&s.phase==='discussion'&&g&&g.guesses>0){const guess=document.getElementById('spy-guess-'+i).value.trim();if(!guess)return;g.guesses--;if(guess.toLocaleLowerCase()===current().answer.trim().toLocaleLowerCase())xFinish(g.name+' cracked the spy code!',true,'The secret term was '+current().answer+'.');else {s.message=g.name+': that term does not match. Compare your clues again.';if(s.groups.every(g=>g.guesses===0))xFinish('The secret remains unsolved',false,'The term was '+current().answer+'.');}}
 else if(a==='accuse'&&f==='impostor'&&s.phase==='discussion'){const accused=Number($('#accused').value);if(s.accused.includes(accused))return;s.accused.push(accused);if(s.accused.length===s.impostors.length){const good=s.accused.every(i=>s.impostors.includes(i));xFinish(good?'The class found the impostors!':'The impostors blended in!',good,`Impostors: ${s.impostors.map(i=>'Student '+(i+1)).join(', ')}. Secret term: ${current().answer}.`);}}
 else if(a==='vote'&&f==='poll'&&s.phase==='question'&&n>=0&&n<s.choices.length){s.ballots[n]++;s.responses++;s.phase='pass';}
 else if(a==='vote-ready'&&s.phase==='pass')s.phase=s.responses>=game.lesson.settings.participants?'review':'question';
 else if(a==='poll-close'&&s.phase==='pass'&&s.responses>0)s.phase='review';
 else if(a==='code'&&s.phase==='code'){if($('#escape-code').value.trim()===s.code.join(''))xFinish('The classroom escaped!',true,'All three locks solved, and the exit code is correct.');else {s.seconds=Math.max(0,s.seconds-30);s.message='That code does not match. Check the order of the three digits. −30 seconds.';}}
 else if(a==='next'&&['outcome','review'].includes(s.phase)){s.round++;const finite=['higher','poll','mission','disaster','adventure'].includes(f);if(finite&&s.qIndex+1>=game.items.length){xFinish(f==='higher'?'Comparison challenge complete!':f==='poll'?'Every voice heard':f==='mission'?'The ship has not reached home':f==='disaster'?'The city weathered the disaster':s.artifacts>=4?'Adventure complete!':'The adventure needs another attempt',f==='mission'?false:f==='adventure'?s.artifacts>=4:true,`${s.message} ${f==='higher'?'Best streak: '+s.best:''}`);}else {s.qIndex=(s.qIndex+1)%game.items.length;if(s.qIndex===0&&f==='streak')game.items=shuffle(game.items);s.phase='question';expansionQuestion();}}
 if(!game.done&&['escape','territory'].includes(f)&&s.seconds<=0){if(f==='escape')xFinish('Time is up',false,'Discuss the puzzles and try the escape again.');else xTeamEnd();}renderGame();
}
function xResolveTeams(){const s=game.session,f=game.lesson.format,notes=[],oldMap=[...s.map];s.phase='outcome';
 if(f==='crystal')s.groups.forEach(g=>{if(g.action==='shield'){g.ap--;g.shield++;}if(g.action==='scout'){g.ap--;g.scout=1;}if(g.action==='trap'){g.ap-=2;g.trap=true;}});
 const attacks=s.groups.map(()=>[]);
 s.groups.forEach((g,i)=>{const a=g.action;
  if(f==='mars'){if(a==='cruise'){g.fuel-=2;g.progress++;}if(a==='boost'){g.fuel-=4;g.oxygen-=2;g.progress+=3;}if(a==='repair'){g.fuel-=2;g.hull=Math.min(5,g.hull+2);}g.oxygen=Math.max(0,g.oxygen-1);if(s.round%3===2)g.hull=Math.max(0,g.hull-1);}
  if(f==='island'){if(a==='food'){g.ap--;g.food+=3;}if(a==='water'){g.ap--;g.water+=3;}if(a==='shelter'){g.ap-=2;g.shelter++;}if(a==='signal'){g.ap-=2;g.signals++;}g.food=Math.max(0,g.food-1);g.water=Math.max(0,g.water-1);if(s.round%3===2&&!g.shelter){g.food=Math.max(0,g.food-2);notes.push(g.name+': storm took food; build a shelter.');}g.health=Math.max(0,g.health-(g.food===0?10:0)-(g.water===0?10:0));}
  if(f==='territory'&&a.startsWith('land:')){const n=Number(a.split(':')[1]);g.ap-=oldMap[n]<0?1:2;if(s.groups.filter(r=>r.action===a).length===1)s.map[n]=i;else notes.push('Contested territory '+(n+1)+': no change of owner.');}
  if(f==='raid'){if(a==='strike'){g.ap-=2;g.boss=Math.max(0,g.boss-20);}if(a==='magic'){g.ap-=3;g.boss=Math.max(0,g.boss-35);}if(a==='heal'){g.ap-=2;g.health=Math.min(80,g.health+25);}if(a==='guard')g.ap--;if(g.boss>0&&a!=='guard')g.health=Math.max(0,g.health-(g.boss<=30?16:8));}
  if(f==='build'){if(a==='base'){g.ap-=2;g.base=1;}if(a==='tower'){g.ap-=2;g.height++;}if(a==='antenna'){g.ap-=2;g.rare--;g.antenna=1;}}
  if(f==='tycoon'){if(a==='worker'){g.cash-=20;g.workers++;}if(a==='factory'){g.cash-=40;g.factories++;}if(a==='ads'){g.cash-=15;g.ads++;}}
  if(f==='fleet'){if(a==='coast'){g.fuel--;g.treasure+=5;}if(a==='reef'){g.fuel-=2;g.treasure+=15;if(Math.random()<.5)g.hull=Math.max(0,g.hull-2);}if(a==='storm'){g.fuel-=3;g.treasure+=25;g.hull=Math.max(0,g.hull-3);}if(a==='repair'){g.fuel--;g.hull=Math.min(5,g.hull+2);}}
  if(f==='crystal'&&a.startsWith('attack:')){g.ap-=2;attacks[Number(a.split(':')[1])].push({i,damage:1+g.scout});g.scout=0;}
 });
 if(f==='crystal')attacks.forEach((hits,i)=>{const target=s.groups[i];let damage=0;const contributors=[];for(const hit of hits){if(target.trap){target.trap=false;continue;}if(target.shield){target.shield--;continue;}damage+=hit.damage;contributors.push(hit.i);}target.crystal-=damage;if(target.crystal<=0){contributors.forEach(n=>s.groups[n].captures++);target.crystal=3;notes.push(target.name+': crystal captured! Contributing teams share the capture.');}});
 if(f==='tycoon'){s.market=[5,10,15][Math.floor(Math.random()*3)];s.groups.forEach(g=>g.cash+=g.workers*s.market+g.factories*s.market*2+g.ads*5);notes.push(`Market income: ${s.market} per employee, ${s.market*2} per factory; ads earn 5.`);}
 s.message=notes.concat(s.groups.map(g=>g.name+': '+xTeamSummary(g,f))).join(' · ');if(f!=='territory')xTeamEnd();
}
function xResolveBranch(v){const s=game.session,f=game.lesson.format;s.path.push(v);s.phase='outcome';
 if(f==='mission'){if(v==='home'){s.fuel-=2;s.progress+=2;}if(v==='explore'){s.fuel-=2;s.progress++;s.shields++;}if(v==='repair'){s.fuel--;s.shields+=2;}if(v==='drift')s.fuel++;s.oxygen=Math.max(0,s.oxygen-1);if(s.round%2===1){if(s.shields)s.shields--;else s.health--;}s.message='Route chosen: '+v+'. Asteroids strike every second round; shields absorb them.';if(s.progress>=8)xFinish('Mission Control brought everyone home!',true);else if(s.health<=0||s.oxygen===0)xFinish('The rescue mission needs another attempt',false);}
 if(f==='disaster'){if(v==='evacuate'){s.supplies-=2;s.safety+=15;s.evacuated=true;}if(v==='shelter'){s.supplies--;s.safety+=8;}if(v==='comms'){s.supplies-=2;s.resilience++;}if(v==='wait')s.supplies++;const damage=Math.max(0,10+s.round*2-s.resilience*4-(s.evacuated?3:0));s.safety=Math.max(0,Math.min(100,s.safety)-damage);s.message=`${['Floodwaters rise','Power fails','A storm reaches the city'][s.round%3]}. Your decision: ${v}. City loses ${damage} safety after protection.`;if(s.safety<=0)xFinish('The city needs a new rescue plan',false);}
 if(f==='adventure'){if(v==='door'){s.keys--;s.artifacts+=2;}if(v==='tower'){s.keys--;s.maps++;}if(v==='tunnel'){s.artifacts++;if(!s.maps&&Math.random()<.5)s.health--;}s.message=v==='door'?'You unlock a hidden chamber and find two artifacts.':v==='tower'?'The tower map protects future tunnel journeys.':'A tunnel reveals an artifact'+(s.maps?' — your map guides you safely.':', but uncharted paths can cost a heart.');if(s.health<=0)xFinish('Your explorers need to regroup',false);}
}
function xTime(seconds){const n=Math.ceil(seconds);return Math.floor(n/60)+':'+String(n%60).padStart(2,'0');}
function stepExpansion(dt){const s=game.session;if(s?.engine!=='expansion'||game.done||ui.view!=='player'||document.hidden||!['territory','escape'].includes(game.lesson.format))return;s.seconds=Math.max(0,s.seconds-dt);const el=$('#exp-timer');if(el)el.textContent=xTime(s.seconds);if(s.seconds<=0){if(game.lesson.format==='territory')xTeamEnd();else xFinish('Time is up',false,'Discuss the puzzles and try again.');renderGame();}}
function drawExpansion(){const s=game.session,f=game.lesson.format,c=EXPANSION[f];
 const icon=(text,x,y,size=48)=>{cx.save();cx.font=`${size}px sans-serif`;cx.textAlign='center';cx.textBaseline='middle';cx.fillText(text,x,y);cx.restore();};
 if(f==='territory'){s.map.forEach((owner,n)=>{const x=290+n%6*86,y=48+Math.floor(n/6)*51;box(x,y,76,43,8,owner<0?'#ffffff66':s.groups[owner].color);label(String(n+1)+(n%6===0?' ★':''),x+38,y+22,17,'#17254b');});return;}
 if(s.groups.length){s.groups.forEach((g,i)=>{const x=100+i*900/Math.max(1,s.groups.length-1),y=146;box(x-65,215,130,29,10,g.color);label(g.name,x,230,14,'#fff');
 if(f==='build'){for(let n=0;n<g.height+g.base;n++)box(x-32,188-n*30,64,27,4,g.color);if(g.antenna)icon('📡',x,65);}
 else if(f==='mars'){icon('🔴',x,46,30);icon('🚀',x,190-g.progress*15+(arcade.reduced?0:Math.sin(arcade.time*2+i))*3);}
 else if(f==='island'){icon('🏝️',x,y,72);if(g.shelter)icon('🛖',x+22,170,30);if(g.signals)icon('🔥',x-25,140,30);}
 else if(f==='raid'){icon(g.boss>0?'👾':'💫',x,y+(arcade.reduced?0:Math.sin(arcade.time*3+i))*5,65);box(x-45,190,90,8,4,'#fff5');box(x-45,190,90*g.boss/80,8,4,g.color);}
 else if(f==='tycoon'){icon('🏭',x,y,55+g.factories*3);label('$'+g.cash,x,80,24,'#fff');}
 else if(f==='fleet'){icon('⛵',x,y+(arcade.reduced?0:Math.sin(arcade.time*2+i))*8,70);label('💰 '+g.treasure,x,80,22,'#fff');}
 else if(f==='crystal'){icon('💎',x,y,50+g.crystal*5);if(g.shield)icon('🛡️',x+28,175,32);}
 else icon('🕵️',x,y,65);
 });return;}
 const symbol=f==='monster'?'👾':f==='mission'?'🚀':f==='escape'?'🚪':f==='poll'?'🗳️':f==='disaster'?'🏙️':f==='streak'?'🔥':f==='impostor'?'🕵️':f==='higher'?'↕️':'🧙';
 icon(symbol,550,135+(arcade.reduced?0:Math.sin(arcade.time*2))*5,110);label(c.name,550,235,25,'#fff');
 if(f==='escape')s.code.forEach((_,i)=>icon(i<s.unlocked?'🔓':'🔒',350+i*200,58,32));
 if(f==='monster'){box(380,55,340,14,7,'#fff5');box(380,55,340*s.boss/(game.items.length*20),14,7,'#ff6f9e');}
 if(f==='streak')label(`${game.correct} / ${s.target}`,750,130,40,'#ffe577');
 if(f==='adventure')label('💎 '+s.artifacts+'   🗝️ '+s.keys,760,135,25,'#fff');
 if(f==='mission')label('HOME '+s.progress+'/8',760,130,25,'#fff');
 if(f==='disaster')label(s.safety+'% safe',760,130,25,'#fff');
}
