const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone = value => JSON.parse(JSON.stringify(value));
const shuffle = values => { const a=[...values]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
const PLAYER_LABELS={all:'All modes',...Object.fromEntries(Object.values(GAME_MODES).map(m=>[m.key,m.label]))};
function playerModes(format){return [GAME_MODES[FORMATS[format].mode].key];}
const ui={grade:7,subject:'all',players:'all',search:'',collection:'library',view:'home'};
let draft=null, dirty=false, game=null, saved=[], toastTimer, decision=null;
const storageKey='oxford.lessons.v1';
function notify(message){$('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,5000);}
function confirmAction(title,text,action){$('#confirm-title').textContent=title;$('#confirm-text').textContent=text;decision=action;$('#confirm').showModal();}
$('#confirm-cancel').onclick=()=>$('#confirm').close();
$('#confirm-ok').onclick=()=>{const action=decision;$('#confirm').close();decision=null;action?.();};
function textField(value,name,max=1500){if(typeof value!=='string'||!value.trim()||value.length>max)throw Error(`${name} is required (maximum ${max} characters).`);return value.trim();}
function validateLesson(raw){
 if(!raw||typeof raw!=='object')throw Error('Choose a valid Oxford lesson file.');
 const title=textField(raw.title,'Lesson title',120).replace(/^Kareem-Boozled(?=:|$)/,'Oxford-Boozled'),topic=textField(raw.topic||'Custom lesson','Topic',120);
 if(!SUBJECTS.some(s=>s.id===raw.subject&&s.id!=='all'))throw Error('Choose a valid subject.');
 if(!Number.isInteger(raw.grade)||raw.grade<1||raw.grade>12)throw Error('Choose a grade from 1 to 12.');
 if(!Object.hasOwn(FORMATS,raw.format))throw Error('This game format is not supported.');
 if(!Array.isArray(raw.items)||raw.items.length<2||raw.items.length>40)throw Error('Use between 2 and 40 questions.');
 const items=raw.items.map((item,i)=>{
  if(!item||typeof item!=='object')throw Error(`Check question ${i+1}.`);
  const prompt=textField(item.prompt,`Question ${i+1}`),answer=textField(item.answer,`Answer ${i+1}`);
  if(!Array.isArray(item.options)||item.options.length>5||item.options.some(x=>typeof x!=='string'||x.length>500))throw Error(`Question ${i+1}: use up to five short wrong choices.`);
  const options=item.options.map(x=>x.trim()).filter(Boolean);
  if(new Set([answer,...options].map(x=>x.toLocaleLowerCase())).size!==options.length+1)throw Error(`Question ${i+1}: answer choices must be different.`);
  if(FORMATS[raw.format].input==='number'&&!Number.isFinite(Number(answer.replace('−','-'))))throw Error('Higher or Lower answers must be plain numbers.');
  if((FORMATS[raw.format].input==='choice'||['kingdom','corners','earth'].includes(raw.format))&&(!options.length||options.length>3))throw Error(`Question ${i+1}: use 1–3 wrong choices for this activity.`);
  if(raw.format==='sort'&&!options.length)throw Error(`Question ${i+1}: add at least one other category.`);
  if(raw.format==='order'){const tokens=answer.split('|').map(x=>x.trim());if(tokens.length<2||tokens.length>10||tokens.some(x=>!x))throw Error(`Question ${i+1}: use 2–10 steps separated by |.`);}
  if(typeof (item.hint??'')!=='string'||(item.hint||'').length>1500||typeof (item.explanation??'')!=='string'||(item.explanation||'').length>1500)throw Error(`Question ${i+1}: hint and explanation must be short text.`);
  return {prompt,answer,options,hint:item.hint||'',explanation:item.explanation||''};
 });
 if(raw.format==='match' && new Set(items.map(x=>x.answer.toLocaleLowerCase())).size!==items.length)throw Error('Matching games need a different answer for each pair.');
 const settings={teamOne:String(raw.settings?.teamOne||'Player 1').slice(0,30),teamTwo:String(raw.settings?.teamTwo||'Player 2').slice(0,30),shuffle:raw.settings?.shuffle===true};
 settings.boozledPowerCount=raw.settings?.boozledPowerCount??4;if(![0,2,4,8].includes(settings.boozledPowerCount))throw Error('Choose 0, 2, 4 or 8 surprise tiles.');
 settings.participants=raw.settings?.participants??12;settings.impostors=raw.settings?.impostors??1;settings.minutes=raw.settings?.minutes??10;if(!Number.isInteger(settings.participants)||settings.participants<4||settings.participants>40||![1,2].includes(settings.impostors)||!Number.isInteger(settings.minutes)||settings.minutes<5||settings.minutes>30)throw Error('Use 4–40 participants, 1–2 impostors, and 5–30 minutes.');
 const count=raw.settings?.teamCount??4;if(!Number.isInteger(count)||count<2||count>6)throw Error('Choose 2–6 teams.');settings.teamCount=count;settings.teamNames=Array.from({length:count},(_,i)=>String(raw.settings?.teamNames?.[i]||['Red','Blue','Green','Yellow','Purple','Orange'][i]).trim().slice(0,30));
 return {mode:FORMATS[raw.format].mode,id:typeof raw.id==='string'?raw.id.slice(0,100):'',title,topic,subject:raw.subject,grade:raw.grade,format:raw.format,minutes:raw.format==='board'?'15–20':'8–12',items,settings};
}
try{const data=JSON.parse(localStorage.getItem(storageKey)||'[]');if(!Array.isArray(data))throw Error();saved=data.slice(0,100).map(validateLesson);}catch{saved=[];notify('Saved lessons could not be read. You can still open a downloaded lesson file.');}
function show(view){ui.view=view;for(const id of ['home','editor','player'])$('#'+id).hidden=id!==view;document.body.classList.toggle('playing',view==='player');window.scrollTo(0,0);}
function leaveEditor(action){if(['editor','player'].includes(ui.view)&&dirty)confirmAction('Leave this draft?','Changes have not been saved. Stay here to save a copy, or continue to leave the draft.',()=>{dirty=false;action();});else action();}
function library(collection='library'){leaveEditor(()=>{ui.collection=collection;if(collection==='saved'){ui.grade='all';ui.subject='all';ui.players='all';ui.search='';$('#search').value='';}show('home');renderLibrary();});}
const openSubjectGroups=new Set();
function subjectButton(id){const s=SUBJECTS.find(s=>s.id===id);return `<button class="subject ${ui.subject===id?'active':''}" data-subject="${id}" aria-pressed="${ui.subject===id}"><span>${s.icon}</span>${s.name}</button>`;}
function renderSubjectMenu(){
 $('#subjects').innerHTML=SUBJECT_MENU.map(entry=>typeof entry==='string'?subjectButton(entry):`<details class="subject-group" data-subject-group="${entry.id}" ${openSubjectGroups.has(entry.id)||entry.children.includes(ui.subject)?'open':''}><summary class="subject ${entry.children.includes(ui.subject)?'group-active':''}"><span>${entry.icon}</span>${entry.name}<b aria-hidden="true">⌄</b></summary><div class="subject-children">${entry.children.map(subjectButton).join('')}</div></details>`).join('');
 document.querySelectorAll('[data-subject-group]').forEach(el=>el.ontoggle=()=>{if(el.open)openSubjectGroups.add(el.dataset.subjectGroup);else openSubjectGroups.delete(el.dataset.subjectGroup);});
}
function subjectEditorOptions(){const option=id=>{const s=SUBJECTS.find(s=>s.id===id);return `<option value="${id}">${s.name}</option>`;};return SUBJECT_MENU.filter(e=>e!=='all').map(entry=>typeof entry==='string'?option(entry):`<optgroup label="${entry.name}">${entry.children.map(option).join('')}</optgroup>`).join('');}
function renderLibrary(){
 $('#saved-count').textContent=saved.length;$('#lesson-total').textContent=GAMES.length;$('#format-total').textContent=Object.keys(FORMATS).length;
 $('#players').value=ui.players;
 $('#mode-description').textContent=Object.values(GAME_MODES).find(m=>m.key===ui.players)?.description||'Choose who owns the challenge: a student, a pair, a team, or the whole classroom.';
 document.querySelectorAll('.header .nav-link').forEach(b=>b.classList.toggle('active',b.dataset.action===(ui.collection==='saved'?'saved':'library')));
 renderSubjectMenu();
 $('#grades').innerHTML=['all',7,8].map(n=>`<button class="grade ${ui.grade===n?'active':''}" data-grade="${n}" aria-pressed="${ui.grade===n}">${n==='all'?'All grades':`Grade ${n}`}</button>`).join('');
 $('#other-grade').value=[7,8,'all'].includes(ui.grade)?'':String(ui.grade);
 const source=ui.collection==='saved'?saved:GAMES;
 const filtered=source.filter(g=>(ui.grade==='all'||g.grade===ui.grade)&&(ui.subject==='all'||g.subject===ui.subject)&&(ui.players==='all'||playerModes(g.format).includes(ui.players))&&`${g.title} ${g.topic} ${FORMATS[g.format].name} ${window.OXFORD_WORLDS?.[g.format]?.name||""}`.toLowerCase().includes(ui.search.toLowerCase()));
 $('#library-title').textContent=ui.collection==='saved'?'My lessons':ui.subject==='all'?'Your game library':SUBJECTS.find(s=>s.id===ui.subject).name;
 $('#collection-label').textContent=ui.collection==='saved'?'SAVED ON THIS DEVICE':'READY TO TEACH';
 $('#results').textContent=`${filtered.length} lesson${filtered.length===1?'':'s'} · ${ui.grade==='all'?'All grades':`Grade ${ui.grade}`}${ui.players==='all'?'':` · ${PLAYER_LABELS[ui.players]}`}`;
 $('#library-note').innerHTML=ui.collection==='saved'?'These copies are saved in this browser. <strong>Download a lesson file</strong> to back up or move your work.':'Start with a prepared lesson, or select <strong>Edit & play</strong> to use your own questions. No student logins needed.';
 $('#games').innerHTML=filtered.map(g=>`<article class="game-card ${g.subject==='math'?'math':'english'}"><div class="card-art art-${g.format}" aria-hidden="true"><span class="art-symbol">${FORMATS[g.format].icon}</span><span class="art-mini">${g.subject==='math'?'x + y':'Aa'}</span><span class="format-tag">${FORMATS[g.format].name}</span></div><div class="card-body"><div class="card-meta"><span>${esc(SUBJECTS.find(s=>s.id===g.subject).name)}</span><span>GRADE ${g.grade}</span></div><h3>${esc(g.title)}</h3><p>${esc(g.topic)}</p><div class="player-tags">${playerModes(g.format).map(mode=>`<span>${PLAYER_LABELS[mode]}</span>`).join('')}</div><div class="card-details"><span>◷ ${g.minutes} min</span><span>${g.items.length} ${g.format==='match'?'pairs':'questions'}</span></div><div class="card-actions"><button class="edit-card" data-edit="${esc(g.id)}">Edit & play <span>↗</span></button><button class="quick-play" data-play="${esc(g.id)}" aria-label="Play ${esc(g.title)} grade ${g.grade}">▶</button></div></div></article>`).join('');
 $('#empty').hidden=filtered.length!==0;
 $('#empty-title').textContent=ui.collection==='saved'?'Your lessons belong here.':'This shelf is ready to grow.';
 $('#empty-message').textContent=ui.collection==='saved'?'Save a copy from the teacher editor. Try All grades if you already saved a lesson.':ui.subject==='russian'||ui.subject==='kyrgyz'?'This language has its own section now. To make a lesson, edit any existing game and change its subject here.':'No lessons match these filters. To create one for this subject, edit an existing game and choose its subject in Lesson details.';
}
$('#other-grade').innerHTML+=[1,2,3,4,5,6,9,10,11,12].map(n=>`<option value="${n}">Grade ${n}</option>`).join('');
$('#subjects').onclick=e=>{const b=e.target.closest('[data-subject]');if(b){ui.subject=b.dataset.subject;renderLibrary();$(`[data-subject="${ui.subject}"]`).focus();}};
$('#grades').onclick=e=>{const b=e.target.closest('[data-grade]');if(b){ui.grade=b.dataset.grade==='all'?'all':Number(b.dataset.grade);renderLibrary();$(`[data-grade="${ui.grade}"]`).focus();}};
$('#other-grade').onchange=e=>{if(e.target.value){ui.grade=Number(e.target.value);renderLibrary();}};
$('#players').onchange=e=>{ui.players=e.target.value;renderLibrary();};
$('#search').oninput=e=>{ui.search=e.target.value;renderLibrary();};
function resetFilters(){ui.grade='all';ui.subject='all';ui.players='all';ui.search='';$('#search').value='';renderLibrary();}
$('#reset').onclick=resetFilters;
document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;if(b.dataset.action==='library')library();if(b.dataset.action==='saved')library('saved');if(b.dataset.action==='reset'){ui.collection='library';resetFilters();}if(b.dataset.action==='import')leaveEditor(()=>$('#import-file').click());});
function findLesson(id){return [...saved,...GAMES].find(g=>g.id===id);}
$('#games').onclick=e=>{const b=e.target.closest('[data-edit],[data-play]');if(!b)return;const lesson=findLesson(b.dataset.edit||b.dataset.play);if(!lesson)return;openEditor(lesson);if(FORMATS[lesson.format].mode==='TEAM')openTeamSetup();else if(b.dataset.play)startGame();};
function openEditor(lesson){
 draft=clone(lesson);draft.settings ||= {teamOne:'Player 1',teamTwo:'Player 2',shuffle:false};dirty=false;
 $('#lesson-title').value=draft.title;$('#lesson-topic').value=draft.topic;
 $('#lesson-grade').innerHTML=Array.from({length:12},(_,i)=>`<option value="${i+1}">${i+1}</option>`).join('');$('#lesson-grade').value=draft.grade;
 $('#lesson-subject').innerHTML=subjectEditorOptions();$('#lesson-subject').value=draft.subject;
 $('#team-one').value=draft.settings.teamOne;$('#team-two').value=draft.settings.teamTwo;$('#shuffle').checked=draft.settings.shuffle;
 $('#team-fields').hidden=!['tug','relay','board'].includes(draft.format);
 setupModeEditor();
 $('#format-icon').textContent=FORMATS[draft.format].icon;$('#format-name').textContent=FORMATS[draft.format].name;$('#format-instructions').textContent=FORMATS[draft.format].instructions;
 $('#format-help').textContent=EXPANSION[draft.format]?(draft.format==='poll'?'Write an opinion prompt and 2–4 choices. There is no correct answer; all choices contribute to the anonymous graph.':FORMATS[draft.format].input==='secret'?'Write a clue as the prompt and a secret term as the answer. Add a hint for the second spy agent.':draft.format==='higher'?'Write an expression or quantity as the prompt and its numeric value as the answer.': 'Use a question, correct answer and 1–3 wrong choices. Your lesson questions earn resources or progress in this game.'):draft.format==='order'?'Write the answer in its correct order, with | between each step. The game will mix the tiles for you.':draft.format==='match'?'Each row is a pair. Use a unique answer for every pair. The right-hand cards will be shuffled.':draft.format==='sort'?'Write the correct category as the answer. Put the other categories under Wrong choices.':draft.format==='clue'?'Give each mystery a question, an answer, and an optional hint. The teacher marks spoken answers.':['tug','relay','board','kingdom','corners','earth'].includes(draft.format)?'Add wrong choices for students to choose from. Team and whole-class templates use up to four answer choices.':'Add wrong choices for automatic scoring. Leave them empty for spoken answers that the teacher marks.';
 $('#paste-panel').hidden=true;$('#bulk-input').value='';renderRows();show('editor');$('#editor-title').focus();
}
function renderRows(){
 $('#question-count').textContent=draft.items.length;
 $('#question-rows').innerHTML=draft.items.map((q,i)=>`<div class="question-row" data-row="${i}"><div class="row-heading"><strong>${draft.format==='match'?'Pair':'Question'} ${i+1}</strong><button class="remove-row" data-remove="${i}" aria-label="Remove question ${i+1}">Remove</button></div><label>${draft.format==='match'?'Left card':'Question / prompt'}<textarea data-field="prompt" rows="2" maxlength="1500">${esc(q.prompt)}</textarea></label><label>${draft.format==='order'?'Correct sequence · separate steps with |':draft.format==='poll'?'Choice 1 (no correct answer)':draft.format==='higher'?'Numeric value':draft.format==='match'?'Matching right card':'Correct / model answer'}<textarea data-field="answer" rows="2" maxlength="1500">${esc(q.answer)}</textarea></label>${(FORMATS[draft.format].input==='choice'||['quiz','tug','relay','board','sort','wager','survival','kingdom','corners','earth'].includes(draft.format))?`<label>${draft.format==='poll'?'Other voting choices':'Wrong choices'}${draft.format==='sort'?' / other categories':''} <span class="quiet">· one per line</span><textarea data-field="options" rows="2">${esc(q.options.join('\n'))}</textarea></label>`:''}<details ${draft.format==='clue'?'open':''}><summary>${draft.format==='clue'?'Hint':'Add a hint or explanation'}</summary><label>Hint<textarea data-field="hint" rows="2" maxlength="1500">${esc(q.hint)}</textarea></label><label>Explanation after answering<textarea data-field="explanation" rows="2" maxlength="1500">${esc(q.explanation)}</textarea></label></details></div>`).join('');
}
$('#editor').addEventListener('input',e=>{dirty=true;const field=e.target.dataset.field;if(field){const i=Number(e.target.closest('[data-row]').dataset.row);draft.items[i][field]=field==='options'?e.target.value.split('\n').map(s=>s.trim()).filter(Boolean):e.target.value;}});
$('#question-rows').onclick=e=>{const b=e.target.closest('[data-remove]');if(!b)return;const i=Number(b.dataset.remove);confirmAction('Remove this question?',draft.items[i].prompt||'This row will be removed from the draft.',()=>{draft.items.splice(i,1);dirty=true;renderRows();});};
$('#add-question').onclick=()=>{if(draft.items.length>=40)return notify('A lesson can contain up to 40 questions.');draft.items.push({prompt:'',answer:'',options:[],hint:'',explanation:''});dirty=true;renderRows();$('#question-rows').lastElementChild.querySelector('textarea').focus();};
$('#paste-toggle').onclick=()=>{$('#paste-panel').hidden=!$('#paste-panel').hidden;};
function pasteQuestions(replace=false){
 const lines=$('#bulk-input').value.trim().split('\n').filter(s=>s.trim());
 if(!lines.length||!lines[0].includes('\t'))return notify('Paste at least two spreadsheet columns: question and answer, separated by a tab.');
 const rows=lines.map(line=>{const [prompt='',answer='',wrong='',hint='']=line.split('\t');return {prompt:prompt.trim(),answer:answer.trim(),options:wrong.split(';').map(s=>s.trim()).filter(Boolean),hint:hint.trim(),explanation:''};});
 if(rows.some(r=>!r.prompt||!r.answer))return notify('Each pasted row needs both a question and an answer. Nothing was added.');
 if((replace?0:draft.items.length)+rows.length>40)return notify('That would exceed 40 questions. Remove some rows first.');
 const apply=()=>{draft.items=replace?rows:[...draft.items,...rows];dirty=true;$('#bulk-input').value='';renderRows();notify(`${rows.length} questions ${replace?'loaded':'added'}. Review them below.`);};
 if(replace)confirmAction('Replace the question list?',`Replace the current ${draft.items.length} questions with your ${rows.length} pasted questions?`,apply);else apply();
}
$('#bulk-add').onclick=()=>pasteQuestions();
const replaceList=document.createElement('button');replaceList.id='bulk-replace';replaceList.className='button secondary';replaceList.textContent='Replace with my questions';replaceList.onclick=()=>pasteQuestions(true);$('#bulk-add').after(replaceList);
function readDraft(){return validateLesson({...draft,title:$('#lesson-title').value,topic:$('#lesson-topic').value,grade:Number($('#lesson-grade').value),subject:$('#lesson-subject').value,settings:{...draft.settings,...readModeSettings(),teamOne:$('#team-one').value,teamTwo:$('#team-two').value,shuffle:$('#shuffle').checked}});}
function validAction(action){try{const lesson=readDraft();action(lesson);}catch(error){notify(error.message);}}
$('#save-lesson').onclick=()=>validAction(lesson=>{
 const id=lesson.id.startsWith('custom-')?lesson.id:`custom-${crypto.randomUUID()}`;const copy={...lesson,id};const next=[copy,...saved.filter(s=>s.id!==id)];
 if(next.length>100)return notify('This browser has 100 lessons. Download a backup before saving more.');
 try{localStorage.setItem(storageKey,JSON.stringify(next));saved=next;draft=clone(copy);dirty=false;$('#saved-count').textContent=saved.length;notify('Saved to My lessons on this device.');}catch{notify('This browser could not save the lesson. Use Download lesson file instead.');}
});
$('#download-lesson').onclick=()=>validAction(lesson=>{const blob=new Blob([JSON.stringify({schemaVersion:1,lesson},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`oxford-${lesson.title.replace(/[^a-z0-9а-яёөңү-]/gi,'-').slice(0,70)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);dirty=false;notify('Lesson file downloaded. Keep it as your backup.');});
$('#import-file').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>500000)throw Error('Choose a lesson file smaller than 500 KB.');const data=JSON.parse(await file.text());if(data.schemaVersion!==1)throw Error('This is not a supported Oxford lesson file.');const lesson=validateLesson(data.lesson);lesson.id=`custom-${crypto.randomUUID()}`;openEditor(lesson);dirty=true;notify('Lesson opened. Review it, then play or save a copy.');}catch(error){notify(error instanceof SyntaxError?'The file is not valid JSON. Choose an Oxford lesson download.':error.message);}e.target.value='';};
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
function startGame(){validAction(lesson=>{if(['tug','relay','board'].includes(lesson.format)&&lesson.items.some(q=>!q.options.length)){notify('Add at least one wrong choice to every question for this two-player game.');return;}draft=lesson;game={lesson:clone(lesson),items:lesson.settings.shuffle?shuffle(lesson.items):clone(lesson.items),index:0,score:lesson.format==='wager'?300:0,teams:[0,0],turn:0,rope:0,lives:3,streak:0,answered:false,revealed:false,hinted:false,wager:0,done:false,correct:0,attempts:0,history:[],used:[],selected:[],left:null,matched:[],feedback:'',feedbackGood:false};game.right=shuffle(game.items.map((_,i)=>i));if(['tug','relay','board'].includes(lesson.format))initTug();prepareRound();if(EXPANSION[lesson.format]||['kingdom','corners','earth','boozled'].includes(lesson.format))initModeGame();show('player');renderGame();});}
$('#start-game').onclick=startGame;
const playBottom=document.createElement('button');playBottom.className='button primary';playBottom.id='play-bottom';playBottom.textContent='Play this lesson ▶';playBottom.onclick=startGame;$('#add-question').after(playBottom);
$('#edit-again').onclick=()=>{const wasDirty=dirty;openEditor(draft);dirty=wasDirty;};
$('#restart').onclick=()=>confirmAction('Restart this game?','Scores and progress will reset. Your lesson questions will stay the same.',startGame);
$('#fullscreen').onclick=()=>{if(document.fullscreenElement)document.exitFullscreen?.();else $('#player').requestFullscreen?.().catch(()=>notify('Full screen is not available in this browser.'));};
window.addEventListener('keydown',e=>{if(ui.view==='player'&&!e.target.closest('input,textarea,select,[contenteditable]')&&e.key.toLowerCase()==='f'&&!e.ctrlKey&&!e.metaKey){e.preventDefault();$('#fullscreen').click();}});
function current(){if(game.session?.engine==='expansion')return game.items[game.session.qIndex];if(game.lesson.format==='boozled'&&game.session){const card=game.session.deck[game.session.active];return card?.question!==undefined?game.items[card.question]:undefined;}return game.items[game.index];}
function teamName(i){return i===0?game.lesson.settings.teamOne:game.lesson.settings.teamTwo;}
function prepareRound(){game.answered=false;game.revealed=false;game.hinted=false;game.wager=0;game.feedback='';game.selected=[];if(current()){game.choices=shuffle([current().answer,...current().options]);const tokens=current().answer.split('|').map(s=>s.trim());game.tiles=shuffle(tokens.map((text,id)=>({text,id})));if(tokens.length>1&&game.tiles.every((t,i)=>t.id===i))game.tiles.reverse();}}
function award(correct){
 if(game.answered||game.done)return;
 const f=game.lesson.format;game.answered=true;game.attempts++;if(correct)game.correct++;
 let points=100;if(f==='quiz'){points+=game.streak*20;game.streak=correct?game.streak+1:0;}if(f==='clue'&&game.hinted)points=50;if(f==='board')points=(game.index%5+1)*100;
 if(f==='wager'){points=game.wager;game.score=Math.max(0,game.score+(correct?points:-points));}else if(correct)game.score+=points;
 if(['tug','relay','board'].includes(f)&&correct){game.teams[game.turn]+=f==='board'?points:1;if(f==='tug')game.rope+=game.turn===0?-1:1;}
 if(f==='survival'&&!correct)game.lives--;
 game.feedback=correct?`Correct · +${points} points`:(f==='wager'?`Not this time · −${points} points`:f==='survival'?'Not this time · one life used':'Not this time. Discuss the answer together.');game.feedbackGood=correct;
 game.history.push({prompt:current().prompt,answer:current().answer,correct});renderGame();
}
function nextRound(){
 if(!game.answered)return;const f=game.lesson.format;
 if(f==='board'){game.used.push(game.index);game.index=-1;}else game.index++;
 if(['tug','relay','board'].includes(f))game.turn=1-game.turn;
 if(game.index>=game.items.length||game.used.length===game.items.length||game.lives<=0||Math.abs(game.rope)>=3)game.done=true;
 prepareRound();renderGame();
}
function finishMatch(){game.done=true;game.correct=game.items.length;game.score=Math.max(0,game.items.length*100-(game.attempts-game.items.length)*20);renderGame();}
function scoreText(){const f=game.lesson.format;if(['tug','relay','board'].includes(f))return `${teamName(0)} ${game.teams[0]} · ${teamName(1)} ${game.teams[1]}`;return `${game.score} points`;}
function renderGame(){
 if(!game)return;if(game.session){renderModeGame();return;}$('.player-bottom > span').textContent='Discuss together. Take turns. Explain your thinking.';const f=game.lesson.format,format=FORMATS[f],teamMode=['tug','relay','board'].includes(f);
 $('#play-title').textContent=game.lesson.title;$('#play-format').textContent=format.name;$('#play-subtitle').textContent=`Grade ${game.lesson.grade} · ${SUBJECTS.find(s=>s.id===game.lesson.subject).name}`;
 $('#scoreboard').innerHTML=teamMode?`<div class="team-score ${(game.tug||game.turn===0)?'active-team':''}"><span>${esc(teamName(0))}</span><strong>${game.teams[0]}</strong></div><span class="turn-label">${game.done?'Final scores':game.tug?duelRule():`${esc(teamName(game.turn))}’s turn`}</span><div class="team-score blue ${(game.tug||game.turn===1)?'active-team':''}"><span>${esc(teamName(1))}</span><strong>${game.teams[1]}</strong></div>`:`<div class="solo-score"><span>${f==='match'?'Pairs matched':'Score'}</span><strong>${f==='match'?`${game.matched.length} / ${game.items.length}`:game.score}</strong></div><span class="turn-label">${f==='survival'?`${'♥'.repeat(Math.max(0,game.lives))} · ${game.lives} lives`:f==='quiz'?`Streak ${game.streak}`:f==='match'?`${game.attempts} attempts`:'Think it through together'}</span>`;
 drawCanvas();
 if(game.done){renderResult();return;}
 if(game.tug){renderTug();return;}
 if(f==='match'){renderMatch();return;}
 if(f==='board'&&game.index===-1){renderBoard();return;}
 if(f==='board'&&game.history.length===0&&game.index===0&&!game.boardOpened){game.index=-1;renderBoard();return;}
 const q=current();
 let content=`<div class="question-top"><span>${f==='board'?`Challenge ${(game.index%5+1)*100}`:`Question ${game.index+1} of ${game.items.length}`}</span><span>${f==='sort'?'Choose the category':f==='order'?'Build the correct sequence':f==='clue'?'Solve the clue':'Take a moment to discuss'}</span></div><h2 id="question-prompt">${esc(q.prompt)}</h2>`;
 if(game.answered){content+=`<div class="feedback ${game.feedbackGood?'correct':'incorrect'}" role="status"><strong>${esc(game.feedback)}</strong><p>${f==='order'?'Correct sequence':'Answer'}: ${esc(q.answer.replace(/\|/g,' → '))}</p>${q.explanation?`<p>${esc(q.explanation)}</p>`:''}</div><button data-next class="button primary">${game.index===game.items.length-1&&f!=='board'||game.lives<=0||Math.abs(game.rope)>=3?'See results':'Continue →'}</button>`;}
 else if(f==='order'){
  content+=`<div class="sequence-answer" aria-label="Your sequence">${game.selected.length?game.selected.map((id,i)=>`<span><b>${i+1}</b>${esc(game.tiles.find(t=>t.id===id).text)}</span>`).join(''):'Choose the first tile below…'}</div><div class="sequence-tiles">${game.tiles.map(t=>`<button data-tile="${t.id}" ${game.selected.includes(t.id)?'disabled':''}>${esc(t.text)}</button>`).join('')}</div><div class="sequence-controls"><button class="button secondary" data-undo ${!game.selected.length?'disabled':''}>Undo</button><button class="button secondary" data-clear ${!game.selected.length?'disabled':''}>Clear</button><button class="button primary" data-check ${game.selected.length!==game.tiles.length?'disabled':''}>Check sequence</button></div>`;
 }else if(f==='wager'&&!game.wager){content+=`<p class="play-instruction">How confident are you? Choose your wager to see the answers.</p><div class="wagers">${[50,100,150].map(n=>`<button data-wager="${n}"><span>◆</span><strong>${n}</strong><small>points</small></button>`).join('')}</div>`;}
 else if(['board','clue'].includes(f)||!q.options.length){
  content+=`<p class="play-instruction">Answer aloud, then reveal the model answer. The teacher decides whether it is correct.</p>`;
  if(f==='clue'&&q.hint)content+=game.hinted?`<div class="hint"><strong>Hint · worth 50 points</strong><p>${esc(q.hint)}</p></div>`:`<button data-hint class="button secondary">Show a hint · play for 50 points</button>`;
  content+=game.revealed?`<div class="model-answer"><span>MODEL ANSWER</span><h3>${esc(q.answer)}</h3></div><div class="marking"><button data-mark="false" class="button secondary">Not yet</button><button data-mark="true" class="button primary">Correct answer ✓</button></div>`:`<button data-reveal class="button primary">Reveal answer</button>`;
 }else{content+=`${f==='wager'?`<p class="wager-label">Your wager: ${game.wager} points</p>`:''}<div class="answers">${game.choices.map((a,i)=>`<button data-answer="${i}"><span>${f==='sort'?'↳':String.fromCharCode(65+i)}</span>${esc(a)}</button>`).join('')}</div>`;}
 $('#arena').innerHTML=content;
}
function renderBoard(){$('#arena').innerHTML=`<p class="eyebrow">CHOOSE YOUR NEXT CHALLENGE</p><h2>Pick a tile, ${esc(teamName(game.turn))}.</h2><div class="challenge-board">${game.items.map((q,i)=>`<button data-board="${i}" ${game.used.includes(i)?'disabled':''}><span>CHALLENGE ${i+1}</span><strong>${game.used.includes(i)?'✓':(i%5+1)*100}</strong></button>`).join('')}</div>`;}
function renderMatch(){
 $('#arena').innerHTML=`<div class="question-top"><span>Connect each pair</span><span>${game.attempts} attempts</span></div><h2>What belongs together?</h2><p class="play-instruction">Choose a left card, then its matching right card.</p><p class="match-feedback" role="status">${esc(game.feedback||'Choose a card to begin.')}</p><div class="matching"><div>${game.items.map((q,i)=>`<button data-left="${i}" ${game.matched.includes(i)?'disabled':''} class="${game.left===i?'selected':''}">${esc(q.prompt)}${game.matched.includes(i)?' ✓':''}</button>`).join('')}</div><div>${game.right.map(i=>`<button data-right="${i}" ${game.matched.includes(i)||game.left===null?'disabled':''}>${esc(game.items[i].answer)}${game.matched.includes(i)?' ✓':''}</button>`).join('')}</div></div>`;
}
function renderResult(){
 const f=game.lesson.format,teamMode=['tug','relay','board'].includes(f);let title='Lesson complete!';
 if(teamMode)title=game.teams[0]===game.teams[1]?'It’s a draw!':`${teamName(game.teams[0]>game.teams[1]?0:1)} wins!`;
 if(f==='survival')title=game.lives>0?'You protected all the learning!':'A good moment to regroup.';
 const missed=game.history.filter(h=>!h.correct);
 $('#arena').innerHTML=`<div class="result"><div class="result-icon">${f==='survival'&&!game.lives?'↺':'✦'}</div><div class="eyebrow">${game.items.length} QUESTIONS IN THIS LESSON</div><h2>${esc(title)}</h2><p class="result-score">${esc(scoreText())}</p><p>${f==='match'?`${game.items.length} pairs found in ${game.attempts} attempts.`:`${game.correct} correct out of ${game.attempts} attempted.`}</p><div class="result-actions"><button data-replay class="button primary">Play again ↺</button><button data-edit-result class="button secondary">Edit this lesson</button></div>${missed.length?`<details class="review"><summary>Review ${missed.length} question${missed.length===1?'':'s'} together</summary>${missed.map(h=>`<div><strong>${esc(h.prompt)}</strong><p>${esc(h.answer.replace(/\|/g,' → '))}</p></div>`).join('')}</details>`:''}</div>`;
}
$('#arena').onclick=e=>{
 const b=e.target.closest('button');if(!b||b.disabled||!game)return;
 if(game.session&&b.hasAttribute('data-mode-action'))return handleModeAction(b);
 if(b.hasAttribute('data-replay'))return startGame();if(b.hasAttribute('data-edit-result'))return $('#edit-again').click();if(game.done)return;
 if(b.hasAttribute('data-tug-answer'))return answerTug(b);
 if(b.hasAttribute('data-next'))return nextRound();
 if(b.hasAttribute('data-answer'))return award(game.choices[Number(b.dataset.answer)]===current().answer);
 if(b.hasAttribute('data-mark'))return award(b.dataset.mark==='true');
 if(b.hasAttribute('data-reveal')){game.revealed=true;return renderGame();}
 if(b.hasAttribute('data-hint')){game.hinted=true;return renderGame();}
 if(b.hasAttribute('data-wager')){game.wager=Number(b.dataset.wager);return renderGame();}
 if(b.hasAttribute('data-board')){game.index=Number(b.dataset.board);game.boardOpened=true;prepareRound();return renderGame();}
 if(b.hasAttribute('data-tile')){const id=Number(b.dataset.tile);if(!game.selected.includes(id))game.selected.push(id);return renderGame();}
 if(b.hasAttribute('data-undo')){game.selected.pop();return renderGame();}if(b.hasAttribute('data-clear')){game.selected=[];return renderGame();}
 if(b.hasAttribute('data-check'))return award(game.selected.map(id=>game.tiles.find(t=>t.id===id).text).join('|')===current().answer.split('|').map(s=>s.trim()).join('|'));
 if(b.hasAttribute('data-left')){game.left=Number(b.dataset.left);game.feedback='Now choose its matching right card.';return renderGame();}
 if(b.hasAttribute('data-right')&&game.left!==null){game.attempts++;if(Number(b.dataset.right)===game.left){game.matched.push(game.left);game.feedback='A match! Choose the next pair.';}else game.feedback='Not a match. Try another pair.';game.left=null;if(game.matched.length===game.items.length)return finishMatch();return renderGame();}
};
// Keep keyboard focus inside the current activity when its controls are redrawn.
$('#arena').addEventListener('click',event=>{
 if(event.detail!==0||event.target.closest('[data-tug-answer],[data-mode-action]'))return;const button=event.target.closest('button');if(!button)return;
 queueMicrotask(()=>{
  let selector='[data-answer], [data-tile]:not([disabled]), [data-board]:not([disabled]), [data-reveal], [data-wager], [data-left]:not([disabled]), [data-replay]';
  if(game?.answered)selector='[data-next]';
  else if(button.hasAttribute('data-left'))selector='[data-right]:not([disabled])';
  else if(button.hasAttribute('data-reveal'))selector='[data-mark="true"]';
  else if(button.hasAttribute('data-tile')&&game?.selected.length===game?.tiles.length)selector='[data-check]';
  $('#arena').querySelector(selector)?.focus({preventScroll:true});
 });
});
function drawCanvas(){
 const canvas=$('#game-canvas'),ctx=canvas.getContext('2d'),f=game.lesson.format;ctx.clearRect(0,0,1100,140);ctx.fillStyle='#f4f5fb';ctx.fillRect(0,0,1100,140);
 ctx.font='600 18px Segoe UI';ctx.textBaseline='middle';ctx.textAlign='center';
 if(f==='tug'){
  ctx.strokeStyle='#b9bdd5';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(170,85);ctx.lineTo(930,85);ctx.stroke();
  for(let i=-3;i<=3;i++){ctx.fillStyle=i===0?'#37386b':'#c4c7d9';ctx.beginPath();ctx.arc(550+i*110,85,7,0,Math.PI*2);ctx.fill();}
  const x=550+game.rope*110;ctx.strokeStyle='#33355f';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,30);ctx.lineTo(x,104);ctx.stroke();ctx.fillStyle='#ed202b';ctx.beginPath();ctx.moveTo(x,30);ctx.lineTo(x+55,45);ctx.lineTo(x,60);ctx.fill();ctx.fillStyle='#c0162b';ctx.fillText('RED TEAM',90,85);ctx.fillStyle='#34366e';ctx.fillText('BLUE TEAM',1010,85);
 }else if(f==='relay'){
  for(let t=0;t<2;t++){const y=45+t*55;ctx.fillStyle='#e1e3ee';ctx.fillRect(130,y-12,830,24);ctx.fillStyle=t?'#37386b':'#df2535';ctx.fillRect(130,y-12,Math.min(830,game.teams[t]/Math.ceil(game.items.length/2)*830),24);ctx.fillText(`${t?'BLUE':'RED'} ${game.teams[t]}`,65,y);ctx.fillText('⚑',1000,y);}
 }else{
  const count=f==='match'?game.matched.length:f==='board'?game.used.length:game.history.length;ctx.fillStyle='#e1e3ee';ctx.fillRect(85,60,930,20);ctx.fillStyle='#38396f';ctx.fillRect(85,60,930*Math.min(1,count/game.items.length),20);ctx.fillStyle='#525877';ctx.font=`600 ${canvas.clientWidth<600?38:18}px Segoe UI`;ctx.fillText(`${count} of ${game.items.length} completed`,550,110);
 }
}
window.render_game_to_text=()=>JSON.stringify(game&&ui.view==='player'?{view:game.done?'result':'playing',format:game.lesson.format,mode:FORMATS[game.lesson.format].mode,session:game.session,lesson:game.lesson.title,grade:game.lesson.grade,score:game.score,teams:game.teams,tugPlayers:game.tug?.map((p,i)=>({team:teamName(i),question:game.items[p.question].prompt,questionIndex:p.question,choices:p.choices,locked:p.locked,feedback:p.feedback,attempts:p.attempts,deckRemaining:p.deck.length})),turn:game.tug?null:game.turn,rope:game.rope,lives:game.lives,attempts:game.attempts,correct:game.correct,question:game.done||game.tug?null:current()?.prompt,choices:game.answered||game.tug?[]:game.session?.engine==='expansion'?game.session.choices:game.choices,answered:game.answered,feedback:game.feedback,revealed:game.revealed,modelAnswer:game.revealed||game.answered||game.session&&(game.session.phase==='review'||game.session.phase==='invest'||game.session.revealed)?current()?.answer:null,selected:game.selected,matched:game.matched,used:game.used,wager:game.wager,coordinateSystem:'Canvas origin top-left; x right, y down. Controls are accessible HTML.'}:{view:ui.view,grade:ui.grade,subject:ui.subject,players:ui.players});
window.advanceTime=()=>{if(game&&ui.view==='player')drawCanvas();};
// Read-only runtime inspection hooks above support repeatable classroom-game QA.
renderLibrary();
const requested=new URLSearchParams(location.search).get('game');if(requested){const lesson=findLesson(requested);if(lesson){openEditor(lesson);if(FORMATS[lesson.format].mode==='TEAM')openTeamSetup();}else notify('That lesson is unavailable. Choose one from the library.');}
if(document.modelContext?.registerTool){const lifecycle=new AbortController();try{Promise.resolve(document.modelContext.registerTool({name:'filter_classroom_games',description:'Filter the Oxford game library by grade, subject, and players. Does not launch a lesson or overwrite teacher work.',inputSchema:{type:'object',properties:{grade:{enum:['all',1,2,3,4,5,6,7,8,9,10,11,12]},subject:{enum:SUBJECTS.map(s=>s.id)},players:{enum:Object.keys(PLAYER_LABELS)}},required:['grade','subject'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){if(!input||!['all',1,2,3,4,5,6,7,8,9,10,11,12].includes(input.grade)||!SUBJECTS.some(s=>s.id===input.subject)||(input.players!==undefined&&!Object.hasOwn(PLAYER_LABELS,input.players))||Object.keys(input).some(k=>!['grade','subject','players'].includes(k)))throw Error('Choose a valid grade and subject.');if(ui.view!=='home')throw Error('Return to the library before filtering.');ui.grade=input.grade;ui.subject=input.subject;ui.players=input.players??'all';renderLibrary();return {summary:$('#results').textContent};}},{signal:lifecycle.signal})).catch(()=>{});}catch{}window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});}
