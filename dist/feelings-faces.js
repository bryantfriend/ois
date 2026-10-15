/* Sticker-book Feelings Faces. The shared lesson editor owns the question deck. */
(() => {
 'use strict';
 const friends=[['hijab-girl','Hijab girl'],['kalpak-boy','Kalpak boy'],['football-boy','Football boy'],['everyday-girl','Girl'],['snow-leopard','Snow leopard']];
 const feelings=Object.keys(PR_FEEL),cache=new Map();
 const lines=window.FEELINGS_LINES;
 // Shuffle bags give all six phrasings a turn before repeating any of them.
 function pickLine(kind){
  const f=state(),key=kind+'Bag',last=kind+'Last';
  if(!f[key]?.length){f[key]=shuffle(lines[kind].map((_,i)=>i));if(f[key].length>1&&f[key][0]===f[last])[f[key][0],f[key][1]]=[f[key][1],f[key][0]];}
  const index=f[key].shift();f[last]=index;
  return lines[kind][index];
 }
 let speechToken=0;
 const active=()=>game?.lesson.format==='emotions'&&ui.view==='player';
 const state=()=>game?.session?.feelings;
 const reduced=()=>arcade.reduced||matchMedia('(prefers-reduced-motion: reduce)').matches;
 const art=(friend,feeling)=>'./assets/feelings-faces/'+friends[friend][0]+'/'+feeling+'.webp';
 const icon=(name)=>({sound:'◖))',mute:'◖×',pause:'Ⅱ',play:'▶',replay:'↻'})[name];
 function cancelVoice(){speechToken++;window.ClassroomVoice?.cancel();}
 async function speak(text,after){
  cancelVoice();const token=speechToken,owner=game,f=state();
  if(!f||f.muted){after?.();return;}
  const result=await window.ClassroomVoice.speak(text);
  if(token!==speechToken||game!==owner||!active()||f.paused)return;
  if(result.reason!=='canceled')after?.();
 }
 function preload(url){if(!cache.has(url))cache.set(url,new Promise((resolve,reject)=>{const im=new Image();im.onload=resolve;im.onerror=()=>{cache.delete(url);reject(Error('Picture unavailable'));};im.src=url;}));return cache.get(url);}
 function setPhase(phase){const f=state();f.phase=phase;f.age=0;renderGame();}
 function prepareFaces(){
  const f=state(),owner=game,round=game.index;
  f.friend=f.fixedFriend===null?game.index%friends.length:f.fixedFriend;
  const target=current().answer;
  // Shuffle both the distractors and their positions. All 12 expressions are available.
  f.choices=shuffle([target,...shuffle(feelings.filter(x=>x!==target)).slice(0,5)]);
  f.imagesReady=false;f.artError=false;f.open=0;f.wrong=null;f.selected=null;f.message='';f.voiceDone=false;
  Promise.all(f.choices.map(word=>preload(art(f.friend,word)))).then(()=>{
   if(game!==owner||state()!==f||game.index!==round)return;f.imagesReady=true;
  }).catch(()=>{if(game===owner&&state()===f&&game.index===round){f.artError=true;f.message='A picture could not load. Please try again.';renderGame();}});
 }
 function beginRound(){const f=state();if(f.lineRound!==game.index){f.questionTemplate=pickLine('questions');f.questionText=f.questionTemplate.replace('{feeling}',current().answer);f.correctText='';f.lineRound=game.index;}prepareFaces();f.phase='closed';f.age=0;}
 const originalInit=initPrimary;
 initPrimary=function(){cancelVoice();originalInit();if(game.lesson.format==='emotions'){
  game.session.feelings={fixedFriend:null,friend:0,phase:'closed',age:0,open:0,muted:false,paused:false,choices:[],imagesReady:false,voiceDone:false,nextKind:'round'};
  // This game handles its own final confetti and reveal rather than the generic victory layer.
  game.celebration={finished:true};beginRound();
 }};
 function promptVoice(){const f=state();f.voiceDone=false;speak(f.questionText,()=>{f.voiceDone=true;if(f.phase==='prompt')setPhase('question');});}
 function feedbackVoice(){const f=state();f.voiceDone=false;speak(f.correctText,()=>{f.voiceDone=true;});}
 function finishVoice(){speak('Wonderful work! You found all the feelings.');}
 function step(dt){
  if(!active())return;const f=state();if(!f||f.paused)return;
  f.age+=dt;const duration=reduced()?.12:.65;
  if(f.phase==='closed'&&f.imagesReady&&f.age>=.18)setPhase('opening');
  else if(f.phase==='opening'){
   f.open=Math.min(1,f.age/duration);updateCurtain();
   if(f.open===1){setPhase('prompt');promptVoice();}
  }else if(f.phase==='celebrating'&&f.age>=(reduced()?.65:1.65)&&f.voiceDone){f.nextKind='round';setPhase('closing');}
  else if(f.phase==='closing'){
   f.open=1-Math.min(1,f.age/duration);updateCurtain();
   if(f.open===0){
    cancelVoice();
    if(f.nextKind==='friend'){beginRound();renderGame();}
    else if(game.index+1===game.items.length){game.done=true;f.phase='final-opening';f.age=0;f.message='Every feeling belongs here.';renderGame();}
    else{game.index++;prepareRound();beginRound();renderGame();}
   }
  }else if(f.phase==='final-opening'){
   f.open=Math.min(1,f.age/duration);updateCurtain();
   if(f.open===1){f.phase='complete';renderGame();finishVoice();}
  }
 }
 function updateCurtain(){const f=state(),el=document.querySelector('.ff-stage');if(el)el.style.setProperty('--open',f.open);}
 function choose(index){
  const f=state();if(!active()||f.paused||f.phase!=='question'||!Number.isInteger(index)||!f.choices[index])return;
  cancelVoice();game.attempts++;f.selected=index;
  const good=f.choices[index]===current().answer;game.feedbackGood=good;
  if(good){game.correct++;game.score+=100;game.answered=true;f.wrong=null;f.correctText=pickLine('correct').replace('{feeling}',current().answer);f.message=f.correctText;setPhase('celebrating');feedbackVoice();}
  else{f.wrong=index;f.message='Take another look. You can do it!';renderGame();speak(f.message);}
 }
 function togglePause(){
  const f=state();f.paused=!f.paused;cancelVoice();renderGame();
  if(!f.paused){if(f.phase==='prompt')promptVoice();else if(f.phase==='celebrating')feedbackVoice();else if(f.phase==='complete')finishVoice();}
 }
 function toggleMute(){
  const f=state();f.muted=!f.muted;cancelVoice();
  if(f.muted){f.voiceDone=true;if(f.phase==='prompt')f.phase='question';}
  renderGame();if(!f.muted&&!f.paused){if(f.phase==='prompt'||f.phase==='question')promptVoice();else if(f.phase==='celebrating')feedbackVoice();}
 }
 function action(name,value){
  const f=state();if(!f)return;
  if(name==='pause')return togglePause();if(name==='mute')return toggleMute();
  if(f.paused)return;
  if(name==='listen'&&['question','prompt'].includes(f.phase))promptVoice();
  if(name==='answer')choose(Number(value));
  if(name==='retry-art'){beginRound();renderGame();}
  if(name==='friend'&&['question','prompt'].includes(f.phase)){
   const friend=value==='mix'?null:Number(value);if(friend!==null&&(!Number.isInteger(friend)||!friends[friend]))return;
   if(friend===f.fixedFriend)return;cancelVoice();f.fixedFriend=friend;f.nextKind='friend';setPhase('closing');
  }
 }
 const confetti=()=>'<div class="ff-confetti" aria-hidden="true">'+Array.from({length:54},(_,i)=>'<i style="--i:'+i+';--x:'+((i*47)%100)+'%;--drift:'+((i%2?1:-1)*(20+i%65))+'px;--delay:'+(i%9*.045)+'s;--c:'+['#ed6651','#e9b92e','#2877b6','#3b9c91','#aa7dbd'][i%5]+'"></i>').join('')+'</div>';
 function stageMarkup(){
  const f=state(),complete=game.done,locked=f.paused||f.phase!=='question',celebrating=f.phase==='celebrating';
  const choosing=['question','prompt'].includes(f.phase)&&!f.paused;
  return `<section class="ff-book ${f.paused?'ff-paused':''} ${reduced()?'ff-reduced':''}" aria-label="Feelings sticker book">
   <header class="ff-header"><div class="ff-title"><span>OUR FEELINGS STICKER BOOK</span><strong>Feelings Faces <small>Level ${game.lesson.grade}</small></strong></div>
    <div class="ff-tools"><button type="button" data-ff="mute" aria-label="${f.muted?'Unmute narration':'Mute narration'}" aria-pressed="${f.muted}">${icon(f.muted?'mute':'sound')}</button><button type="button" data-ff="pause" aria-label="${f.paused?'Resume game':'Pause game'}" aria-pressed="${f.paused}">${icon(f.paused?'play':'pause')}</button></div></header>
   <div class="ff-prompt"><h2>${complete?'So many feelings. All belong.':esc(f.questionTemplate).replace('{feeling}',`<em>${esc(current().answer)}</em>`)}</h2>${!complete?`<button type="button" data-ff="listen" aria-label="Hear the feeling again" ${!choosing?'disabled':''}>${icon('sound')}</button>`:''}</div>
   <div class="ff-friends" role="group" aria-label="Choose a character"><button type="button" data-ff="friend" data-value="mix" aria-pressed="${f.fixedFriend===null}" ${!choosing?'disabled':''}>Mix friends</button>${friends.map(([id,label],i)=>`<button type="button" data-ff="friend" data-value="${i}" aria-label="Play with ${label}" aria-pressed="${f.fixedFriend===i}" ${!choosing?'disabled':''}><img src="${art(i,'happy')}" alt="" width="30" height="30"><span>${label}</span></button>`).join('')}</div>
   <div class="ff-stage" style="--open:${f.open}" data-phase="${f.phase}" aria-busy="${!['question','complete'].includes(f.phase)}">
    <div class="ff-paper-corner ff-corner-one" aria-hidden="true">✦</div><div class="ff-paper-corner ff-corner-two" aria-hidden="true">♡</div>
    ${complete?`<div class="ff-finale"><div class="ff-final-friends">${friends.map((_,i)=>`<img src="${art(i,'happy')}" alt="${friends[i][1]}">`).join('')}</div><h3>Wonderful work!</h3><p>You found ${game.correct} feelings.</p><button type="button" class="button primary" data-replay ${f.phase!=='complete'||f.paused?'disabled':''}>Play again ↻</button></div>`:
    `<div class="ff-cards" role="group" aria-label="Choose the matching expression">${f.choices.map((word,i)=>`<button type="button" class="ff-card ${f.wrong===i?'ff-try-again':''} ${celebrating&&f.selected===i?'ff-correct':''}" data-ff="answer" data-value="${i}" aria-label="${esc(word)} face" ${locked?'disabled':''}><img src="${art(f.friend,word)}" alt="" draggable="false"><span class="ff-key" aria-hidden="true">${i+1}</span>${celebrating&&f.selected===i?'<span class="ff-tick" aria-hidden="true">✓</span>':''}</button>`).join('')}</div>`}
    ${celebrating?confetti():''}
    <div class="ff-curtain ff-curtain-left" aria-hidden="true"></div><div class="ff-curtain ff-curtain-right" aria-hidden="true"></div><div class="ff-valance" aria-hidden="true"></div>
    ${f.paused?'<div class="ff-pause-overlay"><strong>Take a little pause</strong><button type="button" data-ff="pause">Keep playing ▶</button></div>':''}
    ${f.artError?'<div class="ff-art-error" role="alert"><p>A picture could not load.</p><button type="button" data-ff="retry-art">Try loading again</button></div>':''}
   </div>
   <footer class="ff-footer"><span class="ff-kind">Every feeling belongs here.</span><div class="ff-progress" aria-label="${game.correct} of ${game.items.length} feelings found">${game.items.map((_,i)=>`<i class="${i<game.correct?'ff-found':''}" aria-hidden="true"></i>`).join('')}<b>${complete?game.correct:game.index+1} / ${game.items.length}</b></div><span class="ff-message" role="status" aria-live="polite">${esc(f.message|| (f.phase==='question'?'Look at the eyes, eyebrows and mouth.':''))}</span></footer>
  </section>`;
 }
 const originalRender=renderPrimary;
 renderPrimary=function(){
  if(game.lesson.format!=='emotions')return originalRender();
  const f=state();if(!f)return;
  $('#player').classList.add('feelings-player');$('#play-title').textContent=game.lesson.title;$('#play-format').textContent='Feelings Faces';$('#play-subtitle').textContent='Naming feelings · Level '+game.lesson.grade;
  $('#scoreboard').innerHTML='';$('.player-bottom>span').textContent='Take your time. Every feeling belongs.';
  $('#arena').innerHTML=stageMarkup();
  $('#arena').querySelectorAll('[data-ff]').forEach(button=>button.onclick=e=>{e.stopPropagation();if(!button.disabled)action(button.dataset.ff,button.dataset.value);});
 };
 const originalHandle=handlePrimary;
 handlePrimary=function(button){if(game.lesson.format==='emotions')return;return originalHandle(button);};
 const originalStep=stepArcade;
 stepArcade=function(dt){originalStep(dt);step(dt);};
 const originalShow=show;
 show=function(view){if(view!=='player'){cancelVoice();$('#player').classList.remove('feelings-player');}return originalShow(view);};
 const originalStart=startGame;
 startGame=function(...args){cancelVoice();$('#player').classList.remove('feelings-player');return originalStart(...args);};
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&active()&&state()&&!state().paused)togglePause();});
 window.addEventListener('pagehide',cancelVoice);
 // A restart confirmation freezes the scene too; dismissing it resumes play.
 new MutationObserver(()=>{
  const f=state();if(!active()||!f)return;
  if($('#confirm').open&&!f.paused){f.dialogPaused=true;togglePause();}
  else if(!$('#confirm').open&&f.dialogPaused){f.dialogPaused=false;if(f.paused)togglePause();}
 }).observe($('#confirm'),{attributes:true,attributeFilter:['open']});
 document.addEventListener('keydown',e=>{
  if(!active()||!state()||e.repeat||e.ctrlKey||e.altKey||e.metaKey||e.target.matches('input,textarea,select')||document.querySelector('dialog[open]'))return;
  if(/^[1-6]$/.test(e.key)){e.preventDefault();choose(Number(e.key)-1);}
  else if(e.key.toLowerCase()==='p'){e.preventDefault();togglePause();}
  else if(e.key.toLowerCase()==='m'){e.preventDefault();toggleMute();}
 });
 const originalText=window.render_game_to_text;
 window.render_game_to_text=()=>{const result=JSON.parse(originalText());if(active()&&state()){const f=state();result.feelings={phase:f.phase,curtainsOpen:f.open,friend:friends[f.friend][1],fixedFriend:f.fixedFriend,choices:f.choices,target:current().answer,questionText:f.questionText,correctText:f.correctText,questionVariation:f.questionsLast,correctVariation:f.correctLast,paused:f.paused,muted:f.muted,imagesReady:f.imagesReady,voiceDone:f.voiceDone,round:game.index+1,total:game.items.length};}return JSON.stringify(result);};
})();
