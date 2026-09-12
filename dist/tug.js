// Independent decks and stable DOM panels let two touch pointers play concurrently.
function duelRule(){return game.lesson.format==='tug'?'Both players · three pulls to win':game.lesson.format==='relay'?`First to ${game.items.length} correct answers wins`:'Finish your own deck · highest points wins';}
function initTug(){
 game.tug=[0,1].map(()=>({deck:[],question:null,choices:[],locked:false,feedback:'',attempts:0,revision:0,finished:false,treasures:0}));
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
 game.history.push({prompt:q.prompt,answer:q.answer,correct:good});
 if(f==='tug'&&Math.abs(game.rope)>=3||f==='relay'&&game.teams[side]>=game.items.length||f==='board'&&game.tug.every(p=>p.attempts>=game.items.length))game.done=true;
 const owner=game,revision=p.revision,keyboard=document.activeElement===button;
 renderGame();
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
