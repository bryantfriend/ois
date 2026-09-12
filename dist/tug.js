// Independent decks and stable DOM panels let two touch pointers play concurrently.
function initTug(){
 game.tug=[0,1].map(()=>({deck:[],question:null,choices:[],locked:false,feedback:'',attempts:0,revision:0}));
 game.tug.forEach((_,i)=>drawTugQuestion(i));
}
function drawTugQuestion(side){
 const p=game.tug[side],other=game.tug[1-side];
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
 $('.player-bottom > span').textContent='Play at the same time. Correct answers pull toward your side.';
 if(arena.tugOwner!==game||!arena.querySelector('.tug-duel'))arena.innerHTML='<div class="tug-duel"><section class="tug-side" data-side="0"></section><section class="tug-side" data-side="1"></section></div>';
 arena.tugOwner=game;
 game.tug.forEach((p,i)=>{
  const panel=arena.querySelector(`[data-side="${i}"]`);
  const stamp=`${p.revision}-${p.locked}`;
  if(panel.dataset.stamp===stamp)return;
  panel.dataset.stamp=stamp;
  const q=game.items[p.question];
  panel.innerHTML=`<div class="tug-player-heading"><strong>${i===0?'←':'→'} ${esc(teamName(i))}</strong><span>Question ${p.attempts+(p.locked?0:1)}</span></div><h2>${esc(q.prompt)}</h2><div class="tug-answers">${p.choices.map((answer,n)=>`<button data-tug-answer="${n}" data-player="${i}" data-revision="${p.revision}" ${p.locked?'disabled':''}><span>${String.fromCharCode(65+n)}</span>${esc(answer)}</button>`).join('')}</div><div class="tug-feedback ${p.locked?(p.good?'good':'miss'):''}" role="status">${p.locked?`${esc(p.feedback)}<small>Next question coming…</small>`:'Your side, your answers. Ready when you are!'}</div>`;
 });
}
function answerTug(button){
 if(!game?.tug||game.done||ui.view!=='player')return;
 const side=Number(button.dataset.player),p=game.tug[side];
 if(!p||p.locked||Number(button.dataset.revision)!==p.revision)return;
 const q=game.items[p.question],good=p.choices[Number(button.dataset.tugAnswer)]===q.answer;
 p.locked=true;p.good=good;p.attempts++;game.attempts++;
 p.feedback=good?'Correct! One pull your way.':`Answer: ${q.answer}`;
 game.feedbackGood=good;
 if(good){game.correct++;game.score+=100;game.teams[side]++;game.rope+=side===0?-1:1;}
 game.history.push({prompt:q.prompt,answer:q.answer,correct:good});
 if(Math.abs(game.rope)>=3)game.done=true;
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
