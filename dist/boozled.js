// Adapted rules from bryantfriend/GP_Games/kareemboozled.html; Oxford-native lesson data and controls.
const BOOZLED_POWERS={swap:{title:'SWAP POINTS!',emoji:'🔄',detail:'Trade your entire score with a rival.',target:true},steal:{title:'STEAL 20!',emoji:'🦊',detail:'Take up to 20 points from a rival.',target:true},lose:{title:'LOSE 20!',emoji:'🍌',detail:'Oops! Lose up to 20 points.'},gain50:{title:'GAIN 50!',emoji:'🎉',detail:'A surprise bonus: 50 points for your team!'},enemyLose:{title:'RIVAL LOSES 20!',emoji:'⚡',detail:'Choose a rival to lose up to 20 points.',target:true}};
function initBoozled(){
 const powers=shuffle(['swap','steal','lose','gain50','swap','enemyLose','steal','gain50']).slice(0,game.lesson.settings.boozledPowerCount);
 game.session={phase:'board',groups:game.lesson.settings.teamNames.map((name,i)=>({name,color:TEAM_COLORS[i],score:0})),deck:shuffle([...game.items.map((_,question)=>({question})),...powers.map(power=>({power}))]),used:[],active:null,revealed:false,target:null,message:'',event:'',turn:0};
}
function renderBoozled(){
 const s=game.session,g=s.groups[s.turn],card=s.active===null?null:s.deck[s.active];
 $('#play-title').textContent=game.lesson.title;$('#play-format').textContent='Oxford-Boozled';$('#play-subtitle').textContent='🔴 Teams · Teacher hosts';$('.player-bottom > span').textContent='Discuss as a group. Rotate your tile picker and spokesperson each turn.';
 $('#scoreboard').innerHTML=`<div class="kingdom-scores boozled-scores">${s.groups.map((t,i)=>`<div style="--team:${t.color}" class="${i===s.turn&&!game.done?'boozled-active':''}"><strong>${esc(t.name)}</strong><b>${t.score} points</b><small>${i===s.turn&&!game.done?'Your team’s turn':'Shared team score'}</small></div>`).join('')}</div>`;
 if(game.done){const high=Math.max(...s.groups.map(t=>t.score)),winners=s.groups.filter(t=>t.score===high);$('#arena').innerHTML=`<div class="result"><div class="result-icon">🏆</div><h2>${winners.length===1?esc(winners[0].name)+' wins!':'It’s a tie!'}</h2><p>${winners.map(t=>esc(t.name)).join(' · ')} · ${high} points</p><p>All ${s.deck.length} tiles played. ${game.correct} correct answers out of ${game.attempts} questions.</p><div class="result-actions"><button class="button primary" data-replay>Play again</button><button class="button secondary" data-edit-result>Edit lesson</button></div></div>`;return;}
 if(s.phase==='board'){$('#arena').innerHTML=`<div class="boozled-heading"><span>🎲 ${esc(g.name)}’s turn</span><strong>Which tile is calling your name?</strong><small>${s.deck.length-s.used.length} mystery tiles left · Questions + surprise twists</small></div><div class="boozled-board">${s.deck.map((_,i)=>`<button data-mode-action="boozled-pick" data-card="${i}" ${s.used.includes(i)?'disabled':''} aria-label="${s.used.includes(i)?'Used':'Choose'} tile ${i+1}"><span>${s.used.includes(i)?'✓':i+1}</span><small>${s.used.includes(i)?'PLAYED':'MYSTERY'}</small></button>`).join('')}</div>`;return;}
 let html=`<div class="boozled-heading"><span>${esc(g.name)} · Tile ${s.active+1}</span></div>`;
 if(card.power){const power=BOOZLED_POWERS[card.power];html+=`<div class="boozled-surprise"><div class="boozled-emoji">${power.emoji}</div><h2>${power.title}</h2><p>${power.detail}</p></div>`;if(s.phase==='card'){if(power.target)html+=`<label class="boozled-target">Your chosen rival<select id="boozled-target">${s.groups.map((t,i)=>i===s.turn?'':`<option value="${i}">${esc(t.name)} · ${t.score} points</option>`).join('')}</select></label>`;html+='<button class="button primary" data-mode-action="boozled-apply">Activate surprise!</button>';}}
 else{const q=game.items[card.question];html+=`<div class="eyebrow">DISCUSS TOGETHER · 15 POINTS</div><h2>${esc(q.prompt)}</h2>`;if(!s.revealed)html+='<p class="play-instruction">Agree on an answer as a group. Your spokesperson answers aloud.</p><button class="button primary" data-mode-action="boozled-reveal">Reveal model answer</button>';else{html+=`<div class="mode-feedback"><strong>${esc(q.answer)}</strong>${q.explanation?`<p>${esc(q.explanation)}</p>`:''}</div>`;if(s.phase==='card')html+='<p>Teacher: was the team’s answer correct?</p><div class="result-actions"><button class="button secondary" data-mode-action="boozled-mark" data-correct="false">Not this time</button><button class="button primary" data-mode-action="boozled-mark" data-correct="true">Correct · +15</button></div>';}}
 if(s.phase==='resolved')html+=`<div class="boozled-outcome" role="status">${esc(s.message)}</div><button class="button primary" data-mode-action="boozled-next">${s.used.length===s.deck.length?'See winners':'Next team →'}</button>`;
 $('#arena').innerHTML=html;
}
function handleBoozled(button){
 if(game.done||ui.view!=='player')return;const s=game.session,a=button.dataset.modeAction,g=s.groups[s.turn];
 if(a==='boozled-pick'&&s.phase==='board'){const i=Number(button.dataset.card);if(!Number.isInteger(i)||!s.deck[i]||s.used.includes(i))return;s.active=i;s.phase='card';s.revealed=false;s.message='';s.event='';}
 else if(a==='boozled-reveal'&&s.phase==='card'&&!s.deck[s.active].power&&!s.revealed)s.revealed=true;
 else if(a==='boozled-mark'&&s.phase==='card'&&s.revealed&&!s.deck[s.active].power){const good=button.dataset.correct==='true';if(good){g.score+=15;game.correct++;}game.attempts++;game.feedbackGood=good;s.message=good?`${g.name} earns 15 points!`:'No points this time. The next tile could change everything!';s.event=good?'correct':'miss';game.history.push({prompt:game.items[s.deck[s.active].question].prompt,answer:game.items[s.deck[s.active].question].answer,correct:good});resolveBoozled();}
 else if(a==='boozled-apply'&&s.phase==='card'&&s.deck[s.active].power){const id=s.deck[s.active].power,power=BOOZLED_POWERS[id];const target=power.target?Number($('#boozled-target').value):null;if(power.target&&(!Number.isInteger(target)||target===s.turn||!s.groups[target]))return;const rival=s.groups[target];s.target=target;
  if(id==='swap'){[g.score,rival.score]=[rival.score,g.score];s.message=`${g.name} and ${rival.name} swap scores!`;}
  if(id==='steal'){const amount=Math.min(20,rival.score);g.score+=amount;rival.score-=amount;s.message=`${g.name} steals ${amount} points from ${rival.name}!`;}
  if(id==='lose'){const amount=Math.min(20,g.score);g.score-=amount;s.message=`${g.name} loses ${amount} points!`;}
  if(id==='gain50'){g.score+=50;s.message=`${g.name} gains 50 points!`;}
  if(id==='enemyLose'){const amount=Math.min(20,rival.score);rival.score-=amount;s.message=`${rival.name} loses ${amount} points!`;}
  s.event=id;resolveBoozled();
 }else if(a==='boozled-next'&&s.phase==='resolved'){if(s.used.length===s.deck.length)game.done=true;else{s.turn=(s.turn+1)%s.groups.length;s.phase='board';s.active=null;s.event='';s.target=null;}}
 else return;
 renderGame();if(s.phase==='resolved')burst(s.event!=='miss'&&s.event!=='lose');$('#arena').querySelector('[data-mode-action]:not([disabled]),[data-replay]')?.focus({preventScroll:true});
}
function resolveBoozled(){const s=game.session;s.used.push(s.active);s.phase='resolved';}
function drawBoozledWorld(){
 stars();const s=game.session;if(!s)return;
 const colors=['#ffcf58','#ff75bd','#72e4db','#b29aff'];for(let i=0;i<7;i++){const x=115+i*145,y=140+Math.sin(arcade.time*2+i)*12;cx.save();cx.translate(x,y);cx.rotate(Math.sin(arcade.time+i)*.1);box(-43,-52,86,104,12,colors[i%4]);label('?',0,0,48,'#3b2469');cx.restore();}
 const symbols={swap:'↔',steal:'−20 →',lose:'−20',gain50:'+50',enemyLose:'−20',correct:'+15',miss:'Oops!'};
 label(game.done?'THE FINAL TWIST':s.phase==='resolved'?symbols[s.event]||'SURPRISE!':'OXFORD-BOOZLED!',550,46,30,'#fff1a2');
 label(game.done?'THANKS FOR PLAYING':s.groups[s.turn].name+' · '+(s.deck.length-s.used.length)+' TILES LEFT',550,270,22,'#fff');
}
