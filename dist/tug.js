// Independent decks and stable DOM panels let two touch pointers play concurrently.
function duelRule(){return game.lesson.format==='tug'?'3 pulls to win · Wrong: wait 5s · Two wrong in a row: −1 point & pull':game.lesson.format==='relay'?`First to ${game.items.length} correct answers wins`:'Finish your own deck · highest points wins';}
function initTug(){
 game.tug=[0,1].map(()=>({deck:[],question:null,choices:[],locked:false,feedback:'',attempts:0,revision:0,finished:false,treasures:0,wrongStreak:0,cooldown:0,penalty:false}));
 game.tug.forEach((_,i)=>drawTugQuestion(i));
}
function drawTugQuestion(side){
 const p=game.tug[side],other=game.tug[1-side];
 if(game.lesson.format==='board'&&p.attempts>=game.items.length){p.finished=true;p.locked=true;p.revision++;return;}
 if(!p.deck.length)p.deck=shuffle(game.items.map((_,i)=>i));
 // Avoid an immediate repeat and the opponent's current question when possible.
 let pick=p.deck.findIndex(id=>id!==p.question&&id!==other.question);
 if(pick<0)pick=p.deck.findIndex(id=>id!==p.question);
 if(pick<0)pick=0;
 p.question=p.deck.splice(pick,1)[0];
 const q=game.items[p.question];p.choices=shuffle([q.answer,...q.options]);
 p.locked=false;p.feedback='';p.revision++;
}
function renderTug(){
 if(game.lesson.format==='tug'){renderHamsterPanels();return;}
 const arena=$('#arena');
 $('.player-bottom > span').textContent=duelRule();
 if(arena.tugOwner!==game||!arena.querySelector('.tug-duel'))arena.innerHTML='<div class="tug-duel"><section class="tug-side" data-side="0"></section><section class="tug-side" data-side="1"></section></div>';
 arena.tugOwner=game;
 game.tug.forEach((p,i)=>{
  const panel=arena.querySelector(`[data-side="${i}"]`);
  const stamp=`${p.revision}-${p.locked}`;
  if(panel.dataset.stamp===stamp)return;
  panel.dataset.stamp=stamp;
  const q=game.items[p.question];
  if(p.finished){panel.innerHTML=`<div class="tug-player-heading"><strong>${esc(teamName(i))}</strong></div><h2>All treasures explored!</h2><p>${game.teams[i]} points · Waiting for the other player to finish.</p>`;return;}
  panel.innerHTML=`<div class="tug-player-heading"><strong>PLAYER ${i+1}: ${esc(teamName(i))}</strong><span>${game.lesson.format==='board'?`${(p.question%5+1)*100} points`:`Question ${p.attempts+(p.locked?0:1)}`}</span></div><h2>${esc(q.prompt)}</h2><div class="tug-answers">${p.choices.map((answer,n)=>`<button data-tug-answer="${n}" data-player="${i}" data-revision="${p.revision}" ${p.locked?'disabled':''}><span>${String.fromCharCode(65+n)}</span>${esc(answer)}</button>`).join('')}</div><div class="tug-feedback ${p.locked?(p.good?'good':'miss'):''}" role="status">${p.locked?`${esc(p.feedback)}<small>Next question coming…</small>`:'Your side, your answers. Ready when you are!'}</div>`;
 });
}
function answerTug(button){
 if(!game?.tug||game.done||ui.view!=='player')return;
 const side=Number(button.dataset.player),p=game.tug[side];
 if(!p||p.locked||Number(button.dataset.revision)!==p.revision)return;
 const q=game.items[p.question],good=p.choices[Number(button.dataset.tugAnswer)]===q.answer;
 p.locked=true;p.good=good;p.attempts++;game.attempts++;
 const f=game.lesson.format,points=f==='board'?(p.question%5+1)*100:100;
 p.feedback=good?(f==='tug'?'Correct! One pull your way.':f==='relay'?'Correct! Your hamster advances.':`Treasure found! +${points} points`):`Answer: ${q.answer}`;
 game.feedbackGood=good;
 if(f==='relay'&&!good)p.reaction={kind:HAMSTER_REACTIONS[Math.floor(Math.random()*HAMSTER_REACTIONS.length)],age:0};
 if(good){p.treasures++;game.correct++;game.score+=points;game.teams[side]+=f==='board'?points:1;if(f==='tug')game.rope+=side===0?-1:1;if(f==='board'&&!game.used.includes(p.question))game.used.push(p.question);}
 if(f==='tug'){
  p.wrongStreak=good?0:p.wrongStreak+1;p.penalty=p.wrongStreak===2;
  if(p.penalty){game.teams[side]--;game.score-=100;game.rope+=side===0?1:-1;p.wrongStreak=0;}
  p.cooldown=good?1.1:5;
  p.feedback=good?'Correct! +1 point and a pull.':p.penalty?'Two wrong in a row: −1 point and a pull.':'Not quite. Take five seconds to think.';
  p.keyboard=document.activeElement===button;
 }
 game.history.push({prompt:q.prompt,answer:q.answer,correct:good});
 if(f==='tug'&&Math.abs(game.rope)>=3||f==='relay'&&game.teams[side]>=game.items.length||f==='board'&&game.tug.every(p=>p.attempts>=game.items.length))game.done=true;
 if(f==='tug'&&game.done)renderHamsterPanels();
 const owner=game,revision=p.revision,keyboard=document.activeElement===button;
 renderGame();
 if(f==='tug')return;
 // Only this player's panel advances. Old timers cannot affect a restarted game.
 setTimeout(()=>{
  if(game!==owner||game.done||ui.view!=='player'||p.revision!==revision)return;
  drawTugQuestion(side);renderGame();
  if(keyboard&&!document.activeElement?.closest('button,input,textarea,select'))$('#arena').querySelector(`[data-side="${side}"] button`)?.focus({preventScroll:true});
 },good?1100:2200);
}
$('#arena').addEventListener('pointerdown',event=>{
 const button=event.target.closest('[data-tug-answer]');
 if(!button||event.pointerType!=='touch'||button.disabled)return;
 event.preventDefault();answerTug(button);
});

// A stable per-player skeleton keeps hit targets still, including during multi-touch.
function tugMascot(){return `<svg class="tug-mascot" viewBox="0 0 100 100" aria-hidden="true"><circle class="tug-clock-track" cx="50" cy="50" r="45"/><circle class="tug-clock-ring" cx="50" cy="50" r="45" pathLength="100"/><g class="tug-hamster"><ellipse cx="50" cy="84" rx="25" ry="5" fill="#25395b22"/><g class="tug-hamster-body"><ellipse cx="31" cy="29" rx="12" ry="14" fill="#db9a62"/><ellipse cx="69" cy="29" rx="12" ry="14" fill="#db9a62"/><ellipse cx="31" cy="29" rx="6" ry="8" fill="#f7b3ae"/><ellipse cx="69" cy="29" rx="6" ry="8" fill="#f7b3ae"/><ellipse cx="50" cy="57" rx="32" ry="29" fill="#eab77a"/><ellipse cx="50" cy="65" rx="24" ry="20" fill="#fff1d6"/><g class="tug-eyes" fill="#35304c"><ellipse cx="38" cy="49" rx="3" ry="5"/><ellipse cx="62" cy="49" rx="3" ry="5"/></g><ellipse cx="30" cy="61" rx="7" ry="4" fill="#ef9d99"/><ellipse cx="70" cy="61" rx="7" ry="4" fill="#ef9d99"/><path d="M46 59 Q50 54 54 59 L50 63Z" fill="#a96666"/><path d="M43 66 Q50 74 57 66" fill="none" stroke="#804c43" stroke-width="2"/><path d="M22 77 H80" stroke="#b8874d" stroke-width="5" stroke-linecap="round"/><g class="tug-paws" fill="#ce8e59"><ellipse cx="34" cy="77" rx="7" ry="5"/><ellipse cx="66" cy="77" rx="7" ry="5"/></g></g></g><g class="tug-stars" fill="#f6bd36"><path d="m19 13 2 5 6 1-5 3 1 6-4-4-5 3 2-6-4-3 6-1z"/><path d="m77 10 2 5 6 1-5 3 1 6-4-4-5 3 2-6-4-3 6-1z"/></g><text class="tug-point-pop" x="75" y="27" text-anchor="middle"></text></svg>`;}
function renderHamsterPanels(){
 const arena=$('#arena');$('.player-bottom > span').textContent=duelRule();
 if(arena.tugOwner!==game||!arena.querySelector('.hamster-duel')){
  const slots=Math.max(...game.items.map(q=>q.options.length+1));
  arena.innerHTML=`<div class="tug-duel hamster-duel" style="--answer-rows:${Math.ceil(slots/2)};--answer-slots:${slots}">${[0,1].map(side=>`<section class="tug-side" data-side="${side}"><div class="tug-player-heading"><strong></strong><span></span></div><h2 tabindex="0"></h2><div class="tug-answers">${Array.from({length:slots},(_,n)=>`<button data-tug-answer="${n}" data-player="${side}"><span>${String.fromCharCode(65+n)}</span><b class="tug-answer-text"></b></button>`).join('')}</div><div class="tug-feedback">${tugMascot()}<div class="tug-feedback-copy" tabindex="0"><strong role="status"></strong><div class="tug-answer-review"></div><small class="tug-countdown" role="timer" aria-live="off"></small></div></div></section>`).join('')}</div>`;
  arena.tugOwner=game;
 }
 game.tug.forEach((p,side)=>{
  const panel=arena.querySelector(`[data-side="${side}"]`),stamp=`${p.revision}-${p.locked}`;
  if(panel.dataset.stamp===stamp)return;panel.dataset.stamp=stamp;
  const q=game.items[p.question];
  panel.dataset.reaction=p.locked?(p.good?'pull':p.penalty?'penalty':'miss'):'ready';
  panel.querySelector('.tug-player-heading strong').textContent=`PLAYER ${side+1}: ${teamName(side)}`;
  panel.querySelector('.tug-player-heading span').textContent=`Question ${p.attempts+(p.locked?0:1)}`;
  panel.querySelector('h2').textContent=q.prompt;
  panel.querySelectorAll('[data-tug-answer]').forEach((button,n)=>{
   button.style.visibility=n<p.choices.length?'visible':'hidden';button.disabled=p.locked||n>=p.choices.length;button.dataset.revision=p.revision;
   button.querySelector('.tug-answer-text').textContent=p.choices[n]||'';
   button.classList.toggle('tug-correct',p.locked&&p.choices[n]===q.answer);
  });
  panel.querySelector('.tug-feedback-copy strong').textContent=p.locked?p.feedback:p.wrongStreak?'One mistake. A correct answer resets your streak.':'Ready! Choose an answer on your side.';
  panel.querySelector('.tug-answer-review').textContent=p.locked&&!p.good?`Answer: ${q.answer}`:'';
  panel.querySelector('.tug-point-pop').textContent=p.locked?(p.good?'+1':p.penalty?'−1':''):'';
  updateTugCountdown(p,side);
 });
}
function updateTugCountdown(p,side){
 const panel=$('#arena').querySelector(`[data-side="${side}"]`);if(!panel)return;
 const label=p.locked?(p.good?'Next question coming…':`Try again in ${Math.ceil(p.cooldown)}s`):'Wrong answer: 5s wait · Every two in a row: −1';
 const countdown=panel.querySelector('.tug-countdown');if(countdown.textContent!==label)countdown.textContent=label;
 panel.querySelector('.tug-clock-ring').style.strokeDashoffset=String(100*(1-p.cooldown/5));
}
function stepTug(dt){
 if(!game?.tug||game.lesson.format!=='tug'||game.done||ui.view!=='player')return;
 game.tug.forEach((p,side)=>{
  if(!p.locked)return;p.cooldown=Math.max(0,p.cooldown-dt);
  if(p.cooldown>0){updateTugCountdown(p,side);return;}
  drawTugQuestion(side);renderHamsterPanels();
  if(p.keyboard&&document.activeElement?.dataset.player===String(side))$('#arena').querySelector(`[data-side="${side}"] button`)?.focus({preventScroll:true});
 });
}
