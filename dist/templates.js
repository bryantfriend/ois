// Editable templates from the teacher's reference image.
const TEMPLATES = {
 matchup: {name:'Match Up', icon:'🔗', input:'text', source:'match', rule:'Match each keyword to its meaning. Drag a keyword onto its partner, or tap the two cards. Correct pairs stay connected.'},
 classicquiz: {name:'Quiz', icon:'❓', input:'choice', source:'quiz', rule:'Choose the correct answer to each question. Review the explanation before continuing.'},
 flashcards: {name:'Flash Cards', icon:'🗂️', mode:'SOLO', input:'text', source:'quiz', rule:'Recall the answer, then flip the card. Mark it learned or put it back in the deck to practise again.'},
 speaking: {name:'Speaking Cards', icon:'💬', mode:'CLASS', input:'text', source:'clue', rule:'Deal a random discussion card. Take turns explaining your answer aloud. Reveal the model answer when ready, then deal the next card.'},
 groupsort: {name:'Group Sort', icon:'🧺', input:'choice', source:'sort', rule:'Drag the example into its category, or tap a category. Correct examples collect in their groups. Retry mistakes until everything is sorted.'},
 complete: {name:'Complete the Sentence', icon:'✍️', input:'choice', source:'quiz', english:true, rule:'Drag the missing word into the blank, or tap a word. Teachers: put ___ once in each sentence and add the correct word plus wrong choices.'},
 spinwheel: {name:'Spin the Wheel', icon:'🎡', mode:'CLASS', input:'text', source:'clue', rule:'Spin to choose a random prompt. Discuss it, reveal the model answer, and remove it from the wheel. Each prompt is chosen once.'},
 findmatch: {name:'Find the Match', icon:'🎯', input:'text', source:'match', rule:'Read the prompt and tap its matching answer. Each correct answer leaves the board. Keep going until all answers are gone.'},
 anagram: {name:'Anagram', icon:'🔠', input:'word', source:'spell', english:true, rule:'Use the clue to unscramble the letters. Drag or tap letters into the answer; tap a placed letter to undo it. Check when ready.'},
 unjumble: {name:'Unjumble', icon:'🧩', input:'order', source:'magnets', english:true, rule:'Rearrange the words to build the sentence. Drag or tap tiles into the answer, then check it. Teachers: separate words with |.'},
 openbox: {name:'Open the Box', icon:'🎁', mode:'CLASS', input:'text', source:'clue', rule:'Choose a mystery box to uncover a challenge. Discuss it, reveal the answer, then complete the box or close it to revisit later.'},
 matchingpairs: {name:'Matching Pairs', icon:'🧠', input:'text', source:'match', rule:'Turn over two cards to find a keyword and its matching meaning. Matched cards stay revealed. Remember the positions and find every pair.'}
};
for (const [id,c] of Object.entries(TEMPLATES)) {
 c.mode ||= 'SOLO'; c.color=['#176eab','#a53685','#138775','#704bc0'][Object.keys(TEMPLATES).indexOf(id)%4];
 ACTIVITIES[id]=c; FORMATS[id]={...c,description:c.rule,instructions:c.rule};
 for (const subject of c.english?['english']:['english','math']) for (const grade of [7,8]) {
  const source=GAMES.find(g=>g.id===subject+'-'+grade+'-'+c.source), g=JSON.parse(JSON.stringify(source));
  g.id=subject+'-'+grade+'-'+id;g.format=id;g.minutes='8–15';
  if(id==='complete') {
   const lines=grade===7?[
    ['The chef will ___ a delicious soup.','cook','tasty','hot','eat'],['The kitten had ___ fur.','soft','sleep','purr','play'],['Mira was ___ to speak in public.','reluctant','abundant','precise','brief'],['The map gave us ___ directions.','precise','dangerous','reluctant','crowded'],['Fresh water was ___ after the rain.','abundant','brief','narrow','unwilling'],['The icy path was ___.','treacherous','comfortable','helpful','familiar']
   ]:[['A writer supports a claim with ___.','evidence','rumour','decoration','repetition'],['A ___ challenges an opposing argument.','rebuttal','caption','setting','simile'],['Check whether the source is ___.','reliable','colourful','lengthy','popular'],['A conclusion should follow ___ from the evidence.','logically','randomly','silently','immediately'],['The author acknowledges a ___ before defending her claim.','counterargument','rhyme','character','metaphor'],['The report shows ___ because it presents only one perspective.','bias','balance','certainty','agreement']];
   g.topic=grade===7?'Words in context':'Argument vocabulary';g.items=lines.map(([prompt,answer,...options])=>({prompt,answer,options,hint:'',explanation:''}));
  }
  g.title=c.name+': '+g.topic;GAMES.push(g);
 }
}
function validateTemplate(raw,items){
 const f=raw.format;if(!TEMPLATES[f])return;
 if(['matchup','findmatch','matchingpairs'].includes(f)){
  if(items.length>12)throw Error('Use up to 12 pairs in a matching lesson.');
  if(new Set(items.map(q=>actNorm(q.answer))).size!==items.length||new Set(items.map(q=>actNorm(q.prompt))).size!==items.length)throw Error('Give every pair a different keyword and answer.');
 }
 if(f==='complete'&&items.some(q=>q.prompt.split('___').length!==2))throw Error('Put exactly one ___ blank in each sentence.');
 if(f==='groupsort'&&new Set(items.flatMap(q=>[q.answer,...q.options]).map(actNorm)).size>6)throw Error('Use up to 6 categories in Group Sort.');
}
function tplButton(action,text,value='',disabled=false,extra=''){
 return '<button type="button" class="button secondary" data-mode-action="tpl-'+action+'" data-value="'+value+'" '+(disabled?'disabled ':'')+extra+'>'+text+'</button>';
}
function initTemplate(){
 game.session={engine:'activities',template:true,phase:'question',groups:[],found:[],selected:[],active:null,revealed:false,message:'',success:true,age:0,queue:game.items.map((_,i)=>i),right:shuffle(game.items.map((_,i)=>i)),cards:shuffle(game.items.flatMap((_,i)=>[{pair:i,side:0},{pair:i,side:1}])),categories:[...new Set(game.items.flatMap(q=>[q.answer,...q.options]))],sorted:[],turns:0,rotation:0};
 if(['spinwheel','openbox','speaking'].includes(game.lesson.format))game.session.phase='pick';
 tplRound();
}
function tplRound(){
 prepareRound();const s=game.session;
 s.selected=[];s.revealed=false;s.active=null;s.message='';
 s.tiles=shuffle((game.lesson.format==='anagram'?Array.from(actWord(current().answer)):current().answer.split('|').map(t=>t.trim())).map((text,i)=>({text,i})));
 if(s.tiles.length>1&&s.tiles.every((t,i)=>t.i===i))s.tiles.reverse();
}
function tplAward(){game.correct++;game.score+=100;game.feedbackGood=true;}
function tplFinish(){game.done=true;game.session.success=true;game.session.message='All done! '+game.correct+' completed · '+game.attempts+' attempts';}
function tplAdvance(){
 const s=game.session,f=game.lesson.format;
 if(!s.found.includes(game.index))s.found.push(game.index);
 if(s.found.length===game.items.length){tplFinish();return;}
 game.index=game.items.findIndex((_,i)=>!s.found.includes(i));s.phase=['spinwheel','openbox','speaking'].includes(f)?'pick':'question';tplRound();
}
function tplFeedback(good,retry=false){
 const s=game.session;game.attempts++;game.feedbackGood=good;s.message=good?'Great work!':retry?'Not yet. Try another arrangement.':'Let’s learn from this one.';
 if(good)tplAward();if(!retry||good){s.phase='feedback';game.answered=true;}
}
function renderTemplate(){
 const f=game.lesson.format,c=TEMPLATES[f],s=game.session,q=current();
 $('#play-title').textContent=game.lesson.title;$('#play-format').textContent=c.name;$('#play-subtitle').textContent=GAME_MODES[c.mode].label;
 $('.player-bottom>span').textContent=c.mode==='CLASS'?'Discuss together. Take turns explaining your thinking.':'Drag tiles or tap the large buttons. Take your time.';
 $('#scoreboard').innerHTML='<div class="class-score"><strong>'+game.score+' points · '+game.correct+'/'+game.items.length+' completed</strong><span>'+game.attempts+' attempts</span></div>';
 let h='';
 if(game.done)h='<div class="result"><div class="result-icon">🏆</div><h2>'+esc(s.message)+'</h2><div class="result-actions"><button class="button primary" data-replay>Play again</button><button class="button secondary" data-edit-result>Edit lesson</button></div></div>';
 else if(s.phase==='feedback')h='<div class="tpl-feedback"><div class="tpl-celebrate">'+(game.feedbackGood?'🌟':'💡')+'</div><h2>'+esc(s.message)+'</h2><p>'+esc(q.answer.replaceAll('|',' '))+'</p><p>'+esc(q.explanation||'')+'</p>'+tplButton('next','Continue →')+'</div>';
 else if(f==='matchup')h='<p>Drag a keyword to its meaning, or tap one from each side.</p><div class="tpl-match"><div>'+game.items.map((q,i)=>tplButton('left',esc(q.prompt),i,s.found.includes(i),'draggable="true" data-tpl-drag="'+i+'" aria-pressed="'+(s.active===i)+'"')).join('')+'</div><div>'+s.right.map(i=>tplButton('right',esc(game.items[i].answer),i,s.found.includes(i),'data-tpl-drop="right"')).join('')+'</div></div>';
 else if(f==='findmatch')h='<h2>'+esc(q.prompt)+'</h2><div class="tpl-grid">'+s.right.map(i=>tplButton('find',s.found.includes(i)?'✓':esc(game.items[i].answer),i,s.found.includes(i))).join('')+'</div>';
 else if(f==='matchingpairs')h='<p>Find each keyword and its matching meaning.</p><div class="tpl-memory">'+s.cards.map((card,i)=>{const shown=s.selected.includes(i)||s.found.includes(card.pair);return tplButton('card',shown?'<small>'+(card.side?'MEANING':'KEYWORD')+'</small><span>'+esc(game.items[card.pair][card.side?'answer':'prompt'])+'</span>':'<b>✦</b><small>Card '+(i+1)+'</small>',i,s.found.includes(card.pair)||s.selected.includes(i),'data-pair-state="'+(s.found.includes(card.pair)?'matched':shown?'revealed':'hidden')+'" aria-label="'+(shown?'Revealed card '+(i+1):'Reveal card '+(i+1))+'"');}).join('')+'</div>'+(s.selected.length===2?tplButton('hide','Turn these cards back over'):'');
 else if(f==='groupsort')h='<div class="tpl-sort-item" draggable="true" data-tpl-drag="0"><small>Drag this example to a group</small><h2>'+esc(q.prompt)+'</h2></div><div class="tpl-bins">'+s.categories.map((cat,i)=>tplButton('group','<strong>'+esc(cat)+'</strong><small>'+s.sorted.filter(x=>x.category===cat).length+' sorted</small>',i,false,'data-tpl-drop="group"')).join('')+'</div>';
 else if(f==='classicquiz')h='<h2>'+esc(q.prompt)+'</h2><div class="class-choice">'+game.choices.map((v,i)=>tplButton('answer',esc(v),i)).join('')+'</div>';
 else if(f==='complete')h='<h2 class="tpl-sentence">'+esc(q.prompt.split('___')[0])+'<span class="tpl-blank" data-tpl-drop="blank">'+(s.active===null?'?':esc(game.choices[s.active]))+'</span>'+esc(q.prompt.split('___')[1])+'</h2><div class="tpl-tiles">'+game.choices.map((v,i)=>tplButton('word',esc(v),i,false,'draggable="true" data-tpl-drag="'+i+'" aria-pressed="'+(s.active===i)+'"')).join('')+'</div>'+tplButton('checkblank','Check sentence','',s.active===null);
 else if(['anagram','unjumble'].includes(f))h='<h2>'+esc(q.prompt)+'</h2><div class="tpl-answer" data-tpl-drop="tile" aria-label="Build your answer here">'+(s.selected.length?s.selected.map((id,i)=>tplButton('undo',esc(s.tiles.find(t=>t.i===id).text),i)).join(''):'<span>Build your answer here ↓</span>')+'</div><div class="tpl-tiles">'+s.tiles.map(t=>tplButton('tile',esc(t.text),t.i,s.selected.includes(t.i),'draggable="true" data-tpl-drag="'+t.i+'"')).join('')+'</div><div class="tpl-actions">'+tplButton('clear','Clear')+tplButton('checktiles','Check answer','',s.selected.length!==s.tiles.length)+'</div>';
 else if(f==='flashcards')h='<div class="tpl-flash '+(s.revealed?'is-flipped':'')+'"><small>'+(s.revealed?'ANSWER':'QUESTION')+'</small><h2>'+esc(s.revealed?q.answer:q.prompt)+'</h2></div>'+(!s.revealed?tplButton('reveal','Flip card ↻'):'<div class="tpl-actions">'+tplButton('learn','✓ I knew it')+tplButton('again','↻ Practise again')+'</div>');
 else if(f==='openbox'&&s.phase==='pick')h='<h2>Choose a mystery box</h2><div class="tpl-boxes">'+game.items.map((_,i)=>tplButton('box','<b>'+(s.found.includes(i)?'⭐':'🎁')+'</b><span>Box '+(i+1)+'</span>',i,s.found.includes(i))).join('')+'</div>';
 else if(f==='spinwheel'&&['pick','spin'].includes(s.phase)){
  const remaining=game.items.map((_,i)=>i).filter(i=>!s.found.includes(i)),angle=360/remaining.length;
  h='<div class="tpl-wheel-layout"><div class="tpl-wheel-wrap"><span class="tpl-pointer">▼</span><div class="tpl-wheel '+(s.phase==='spin'?'is-spinning':'')+'" style="--rotation:'+s.rotation+'deg;background:conic-gradient('+remaining.map((_,i)=>['#7957cb','#ed77ac','#39afa6','#57a9e5','#efb54c','#eb786b'][i%6]+' '+i*angle+'deg '+(i+1)*angle+'deg').join(',')+')">'+remaining.map((id,i)=>'<span style="transform:rotate('+(i+.5)*angle+'deg) translateY(-105px) rotate('+(-(i+.5)*angle)+'deg)">'+(id+1)+'</span>').join('')+'</div></div><div><h2>'+(s.phase==='spin'?'Spinning…':'What will come next?')+'</h2><p>'+remaining.length+' prompts left. Numbers match your lesson cards.</p>'+tplButton('spin','Spin the wheel 🎡','',s.phase==='spin')+'</div></div>';
 }
 else if(f==='speaking'&&s.phase==='pick')h='<div class="tpl-flash"><div class="tpl-celebrate">💬</div><h2>Everyone has something to say</h2><p>Take turns with a partner or around the class.</p></div>'+tplButton('deal','Deal a speaking card');
 else h='<div class="tpl-flash"><small>Card '+(game.index+1)+'</small><h2>'+esc(q.prompt)+'</h2>'+(s.revealed?'<div class="tpl-model"><strong>Model answer</strong><p>'+esc(q.answer)+'</p></div>':'<p>Discuss your answer before revealing.</p>')+'</div><div class="tpl-actions">'+(!s.revealed?tplButton('reveal','Reveal model answer'):tplButton('discussed','✓ Discussed — continue'))+(f==='openbox'?tplButton('close','Close and revisit'):'')+'</div>';
 if(!game.done&&s.phase!=='feedback')h+='<p class="tpl-status" role="status">'+esc(s.message)+'</p>';
 $('#arena').innerHTML='<div class="tpl-game" style="--tpl-color:'+c.color+'">'+h+'</div>';
 $('#arena').classList.add('activity-arena');
 document.querySelectorAll('[data-tpl-drag]').forEach(el=>el.ondragstart=e=>e.dataTransfer.setData('text/plain',el.dataset.tplDrag));
 document.querySelectorAll('[data-tpl-drop]').forEach(el=>{el.ondragover=e=>e.preventDefault();el.ondrop=e=>{e.preventDefault();const value=e.dataTransfer.getData('text/plain');if(!/^\d+$/.test(value))return;if(el.dataset.tplDrop==='right')s.active=Number(value);handleTemplate({dataset:{modeAction:'tpl-'+({blank:'word',tile:'tile'}[el.dataset.tplDrop]||el.dataset.tplDrop),value:['right','group'].includes(el.dataset.tplDrop)?el.dataset.value:value}});};});
}
function handleTemplate(button){
 if(game.done||ui.view!=='player'||button.disabled)return;
 const s=game.session,f=game.lesson.format,a=button.dataset.modeAction.slice(4),n=Number(button.dataset.value),q=current();
 if(s.phase==='feedback'){if(a==='next')tplAdvance();renderGame();return;}
 if(s.phase==='spin')return;
 if(a==='answer'&&f==='classicquiz'&&game.choices[n]!==undefined)tplFeedback(game.choices[n]===q.answer);
 else if(a==='left'&&f==='matchup'&&game.items[n]&&!s.found.includes(n))s.active=n;
 else if(a==='right'&&f==='matchup'&&s.active!==null&&game.items[s.active]&&game.items[n]&&!s.found.includes(n)&&!s.found.includes(s.active)){
  game.attempts++;if(s.active===n){tplAward();s.found.push(n);s.message='Connected!';if(s.found.length===game.items.length)tplFinish();}else{s.message='Those do not match. Try another partner.';game.feedbackGood=false;}s.active=null;
 }
 else if(a==='find'&&f==='findmatch'&&game.items[n]&&!s.found.includes(n)){game.attempts++;if(n===game.index){tplAward();tplAdvance();}else s.message='Look again for the matching answer.';}
 else if(a==='card'&&f==='matchingpairs'&&s.cards[n]&&s.selected.length<2&&!s.selected.includes(n)&&!s.found.includes(s.cards[n].pair)){
  s.selected.push(n);if(s.selected.length===2){game.attempts++;if(s.cards[s.selected[0]].pair===s.cards[n].pair){tplAward();s.found.push(s.cards[n].pair);s.selected=[];s.message='A perfect pair!';if(s.found.length===game.items.length)tplFinish();}else s.message='Remember these positions, then turn them over.';}
 }
 else if(a==='hide'&&f==='matchingpairs'&&s.selected.length===2){s.selected=[];s.message='Find another pair.';}
 else if(a==='group'&&f==='groupsort'&&s.categories[n]!==undefined){game.attempts++;if(s.categories[n]===q.answer){tplAward();s.sorted.push({prompt:q.prompt,category:q.answer});tplAdvance();}else s.message='Try another category.';}
 else if(a==='word'&&f==='complete'&&game.choices[n]!==undefined)s.active=n;
 else if(a==='checkblank'&&f==='complete'&&s.active!==null)tplFeedback(game.choices[s.active]===q.answer,true);
 else if(a==='tile'&&['anagram','unjumble'].includes(f)&&s.tiles.some(t=>t.i===n)&&!s.selected.includes(n))s.selected.push(n);
 else if(a==='undo'&&['anagram','unjumble'].includes(f)&&n>=0&&n<s.selected.length)s.selected.splice(n,1);
 else if(a==='clear'&&['anagram','unjumble'].includes(f))s.selected=[];
 else if(a==='checktiles'&&['anagram','unjumble'].includes(f)&&s.selected.length===s.tiles.length){const text=s.selected.map(id=>s.tiles.find(t=>t.i===id).text).join(f==='anagram'?'':' ');tplFeedback(f==='anagram'?text===actWord(q.answer):actNorm(text)===actNorm(q.answer.replaceAll('|',' ')),true);}
 else if(a==='reveal'&&['flashcards','speaking','spinwheel','openbox'].includes(f)&&s.phase==='question')s.revealed=true;
 else if(a==='learn'&&f==='flashcards'&&s.revealed){game.attempts++;tplAward();s.queue=s.queue.filter(i=>i!==game.index);s.found.push(game.index);if(!s.queue.length)tplFinish();else{game.index=s.queue[0];tplRound();}}
 else if(a==='again'&&f==='flashcards'&&s.revealed){game.attempts++;s.queue=s.queue.filter(i=>i!==game.index);s.queue.push(game.index);game.index=s.queue[0];tplRound();}
 else if(a==='discussed'&&['speaking','spinwheel','openbox'].includes(f)&&s.phase==='question'&&s.revealed){game.attempts++;tplAward();tplAdvance();}
 else if(a==='close'&&f==='openbox'){s.phase='pick';s.revealed=false;}
 else if(a==='box'&&f==='openbox'&&s.phase==='pick'&&game.items[n]&&!s.found.includes(n)){game.index=n;tplRound();s.phase='question';}
 else if(a==='deal'&&f==='speaking'&&s.phase==='pick'){game.index=shuffle(game.items.map((_,i)=>i).filter(i=>!s.found.includes(i)))[0];tplRound();s.phase='question';}
 else if(a==='spin'&&f==='spinwheel'&&s.phase==='pick'){
  const remaining=game.items.map((_,i)=>i).filter(i=>!s.found.includes(i)),position=Math.floor(Math.random()*remaining.length);game.index=remaining[position];s.phase='spin';s.age=0;s.rotation=1440+360-(position+.5)*360/remaining.length;
 }
 renderGame();
}
function stepTemplate(dt){const s=game.session;if(game.lesson.format==='spinwheel'&&s.phase==='spin'){s.age+=dt;if(s.age>=2.8){tplRound();s.phase='question';renderGame();}}}
