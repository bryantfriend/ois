/* Browse mechanics once; keep every prepared deck as a starting example. */
const STYLE_CATEGORIES=[['all','All game styles','▦'],['quiz','Quiz & competition','⚡'],['words','Words & matching','Aa'],['strategy','Strategy & board games','♟'],['puzzles','Numbers & puzzles','🧩'],['create','Build & experiment','⚙'],['explore','Explore & discover','🧭'],['ice','Icebreakers & discussion','☀']];
let stylePage=1,styleFilter='',styleOpener=null;
const STYLE_PAGE_SIZE=24;
function gameStyleKey(g){
 if(g.id==='english-7-quiz')return 'forest-race';
 if(g.id==='math-7-quiz')return 'starbridge-rescue';
 if(g.format.startsWith('supermarket-word-quest'))return 'supermarket-word-quest';
 const config=LAB_GAMES[g.format];
 if(config){const first=LAB_SPECS.find(c=>c.engine===config.engine&&c.variant===config.variant&&c.mode===config.mode&&!c.archived);if(first)return 'lab-'+first.slug;}
 return g.format;
}
function gameStyleCategory(g){
 const f=g.format,engine=LAB_GAMES[f]?.engine;
 if(g.subject==='ice-breakers'||f.startsWith('ice-'))return 'ice';
 if(g.subject==='board-games'||engine==='classics')return 'strategy';
 if(['physics','creative','mosaic'].includes(engine)||['factory-maths','projectile-duel','blocks'].includes(f))return 'create';
 if(g.subject==='geography'||['explorer-island','shape-detective'].includes(f))return 'explore';
 if(/supermarket|alphabet|letter|word|spelling|animal-post|sentence|phonics/i.test(f+' '+FORMATS[f].name)||['match','order','sort'].includes(f)||g.id==='english-7-quiz')return 'words';
 if(engine||Object.hasOwn(PRIMARY,f))return 'puzzles';
 return 'quiz';
}
function gameStyleGroups(){
 const groups=new Map();
 for(const g of GAMES){
  if(geoIsArchived(g)||LAB_GAMES[g.format]?.archived)continue;
  const key=gameStyleKey(g);
  if(!groups.has(key)){
   const config=FORMATS[g.format],world=window.OXFORD_WORLDS?.[g.format];
   const name=key==='forest-race'?'Forest Trail':key==='starbridge-rescue'?'Starbridge Rescue':key==='supermarket-word-quest'?'Supermarket Word Quest':world?.name||config.name;
   groups.set(key,{key,lesson:g,name:LAB_GAMES[g.format]?.variant==='lights'?'Lights Out':name.replace(/^Oxford /,''),category:gameStyleCategory(g),examples:[],description:(key==='forest-race'?'Race through a forest trail. Answer questions to help your runner reach the finish.':key==='starbridge-rescue'?'Pilot a rescue ship. Correct answers recover stranded crew pods; mistakes test your shields.':config.description||config.rule||config.instructions||'Choose a challenge and make it your own.').split('Teacher:')[0].trim()});
  }
  groups.get(key).examples.push(g);
 }
 const featured=['airplane','tug','starbridge-rescue','forest-race','boozled','lab-chess','coastal-connections','supermarket-word-quest','match','order','factory-maths','animal-post-office','explorer-island'];
 return [...groups.values()].sort((a,b)=>{
  const rank=k=>featured.includes(k)?featured.indexOf(k):featured.length;
  return rank(a.key)-rank(b.key)||a.name.localeCompare(b.name);
 });
}
function renderStyleLibrary(){
 document.body.classList.add('style-browser');
 $('#search').placeholder='Search game styles or examples';
 $('#search').setAttribute('aria-label','Search game styles or examples');
 if(ui.subject!=='all'){
  ui.styleCategory=ui.subject==='board-games'?'strategy':ui.subject==='ice-breakers'?'ice':ui.subject==='geography'?'explore':ui.subject==='math'?'puzzles':'words';
  ui.subject='all';
 }
 const all=gameStyleGroups(),category=ui.styleCategory||'all',query=ui.search.trim().toLowerCase();
 const matched=all.filter(s=>(category==='all'||s.category===category)&&(ui.players==='all'||s.examples.some(g=>playerModes(g.format).includes(ui.players)))&&[s.name,s.description,FORMATS[s.lesson.format].sourceTitle||'',...s.examples.flatMap(g=>[g.title,g.topic,SUBJECTS.find(x=>x.id===g.subject)?.name||''])].join(' ').toLowerCase().includes(query));
 const signature=JSON.stringify([category,query,ui.players]);if(styleFilter!==signature){stylePage=1;styleFilter=signature;}
 const pages=Math.max(1,Math.ceil(matched.length/STYLE_PAGE_SIZE));stylePage=Math.min(stylePage,pages);
 const visible=matched.slice((stylePage-1)*STYLE_PAGE_SIZE,stylePage*STYLE_PAGE_SIZE);
 $('#saved-count').textContent=saved.length;$('#lesson-total').textContent=all.length;$('#format-total').textContent=GAMES.filter(g=>!geoIsArchived(g)&&!LAB_GAMES[g.format]?.archived).length;
 document.querySelectorAll('.header .nav-link').forEach(b=>b.classList.toggle('active',b.dataset.action==='library'));
 $('.sidebar>.eyebrow').textContent='FIND A GAME';
 $('#subjects').innerHTML=STYLE_CATEGORIES.map(([id,name,icon])=>`<button class="subject ${category===id?'active':''}" data-style-category="${id}" aria-pressed="${category===id}"><span aria-hidden="true">${icon}</span>${name}<small>${id==='all'?all.length:all.filter(s=>s.category===id).length}</small></button>`).join('');
 $('#players').value=ui.players;$('#mode-description').textContent='Choose a game style, then adapt its questions or settings for your class.';
 $('#library-title').textContent=STYLE_CATEGORIES.find(c=>c[0]===category)?.[1]||'All game styles';
 $('#collection-label').textContent='ONE CARD PER GAME STYLE';
 $('#results').textContent=`${matched.length} game style${matched.length===1?'':'s'}${ui.players==='all'?'':` · ${PLAYER_LABELS[ui.players]}`}`;
 $('#library-note').textContent='Choose how you want to play. Grade and subject examples are inside each game. Your saved lessons stay in My lessons.';
 $('#games').innerHTML=visible.map(s=>{
  const g=s.lesson,c=FORMATS[g.format],editable=!c.standalone||c.editableStandalone;
  return `<article class="game-card style-card" data-style-key="${esc(s.key)}"><div class="card-art art-${g.format}" aria-hidden="true"><span class="art-symbol">${c.icon}</span><span class="art-mini"></span><span class="format-tag">${esc(s.name)}</span></div><div class="card-body"><div class="card-meta"><span>${esc(STYLE_CATEGORIES.find(x=>x[0]===s.category)[1])}</span></div><h3>${esc(s.name)}</h3><p>${esc(s.description)}</p><div class="player-tags">${playerModes(g.format).map(mode=>`<span>${PLAYER_LABELS[mode]}</span>`).join('')}<span>${editable?'Teacher editable':'Built-in challenges'}</span></div><div class="card-details"><span>${s.examples.length>1?`${s.examples.length} starting examples`:'Ready to try'}</span></div><div class="card-actions"><button class="edit-card" data-edit="${esc(g.id)}" data-style-open="${esc(s.key)}">${editable?'Make it yours':'Explore game'} <span>↗</span></button><button class="quick-play" data-play="${esc(g.id)}" aria-label="Try ${esc(s.name)}">▶</button></div></div></article>`;
 }).join('');
 let pager=$('#style-pages');if(!pager){pager=document.createElement('nav');pager.id='style-pages';pager.setAttribute('aria-label','Game library pages');$('#games').after(pager);}
 pager.hidden=pages<=1;pager.innerHTML=`<button class="button secondary" data-style-page="${stylePage-1}" ${stylePage===1?'disabled':''}>← Previous</button><span>Page ${stylePage} of ${pages}</span><button class="button secondary" data-style-page="${stylePage+1}" ${stylePage===pages?'disabled':''}>Next →</button>`;
 $('#empty').hidden=matched.length!==0;$('#empty-title').textContent='No game styles found';$('#empty-message').textContent='Try another category, fewer search words, or a different player mode.';
}
function openGameStyle(key){
 const style=gameStyleGroups().find(s=>s.key===key);if(!style)return;
 const dialog=$('#game-style-dialog');styleOpener=document.activeElement;
 const editable=!FORMATS[style.lesson.format].standalone||FORMATS[style.lesson.format].editableStandalone;
 dialog.innerHTML=`<button class="text-button style-close" data-style-close aria-label="Close game details">✕</button><div class="eyebrow">${esc(STYLE_CATEGORIES.find(c=>c[0]===style.category)[1])}</div><h2 id="game-style-title">${esc(style.name)}</h2><p>${esc(style.description)}</p><div class="player-tags">${playerModes(style.lesson.format).map(mode=>`<span>${PLAYER_LABELS[mode]}</span>`).join('')}</div><label for="style-example">${style.examples.length>1?'Choose a starting example':'Starting example'}</label><select id="style-example">${style.examples.map(g=>`<option value="${esc(g.id)}">${esc(g.title)} · ${esc(SUBJECTS.find(s=>s.id===g.subject)?.name)} · Grade ${g.grade}</option>`).join('')}</select><p class="quiet">${editable?'These are starting points. Change the grade, subject and content in the teacher editor.':'This game has its own built-in challenges and settings.'}</p><div class="result-actions"><button class="button primary" data-style-customise>${editable?'Edit & play':'Open game'} →</button><button class="button secondary" data-style-try>Try example ▶</button></div>`;
 dialog.showModal();
}
document.addEventListener('DOMContentLoaded',()=>{
 const dialog=document.createElement('dialog');dialog.id='game-style-dialog';dialog.setAttribute('aria-labelledby','game-style-title');document.body.append(dialog);
 dialog.addEventListener('close',()=>styleOpener?.isConnected&&styleOpener.focus());
 dialog.onclick=e=>{
  if(e.target.closest('[data-style-close]')){dialog.close();return;}
  const play=e.target.closest('[data-style-try]'),edit=e.target.closest('[data-style-customise]');if(!play&&!edit)return;
  const lesson=findLesson($('#style-example').value);dialog.close();if(!lesson)return;
  openEditor(lesson);
  if(play&&ui.view==='editor'){if(FORMATS[lesson.format].mode==='TEAM')openTeamSetup();else startGame();}
 };
 document.addEventListener('click',e=>{
  const category=e.target.closest('[data-style-category]'),page=e.target.closest('[data-style-page]');
  if(category){ui.styleCategory=category.dataset.styleCategory;ui.search='';$('#search').value='';renderLibrary();document.querySelector(`[data-style-category="${ui.styleCategory}"]`)?.focus();}
  if(page&&!page.disabled){stylePage=Number(page.dataset.stylePage);renderLibrary();$('#library-title').scrollIntoView({block:'start'});$('#style-pages button:not(:disabled)')?.focus({preventScroll:true});}
 });
 $('.welcome h1').textContent='Find your next game.';
 $('.welcome>div>p').textContent='Pick a game style, add your lesson, and bring the class into play.';
 $('.welcome-facts').innerHTML='<span><strong id="lesson-total"></strong> game styles</span><span><strong id="format-total"></strong> starting examples</span><span>Adapt for <strong>your class</strong></span>';
 const steps=$$('.teacher-path small');
 function $$(s){return [...document.querySelectorAll(s)];}
 $('.teacher-path strong').textContent='Find your game';if(steps[0])steps[0].textContent='Browse by how you want to play';
 $('#search').placeholder='Search game styles or examples';$('#search').setAttribute('aria-label','Search game styles or examples');
 $('#lab-browse').hidden=true;const geo=$('#geo-browse');if(geo)geo.hidden=true;
 const contact=$('#teacher-contact');if(contact)$('#home').append(contact);
 $('.side-note p').textContent='Choose a style, pick an example, then adapt it for your class.';
 $('#empty [data-action="reset"]').textContent='Browse all game styles';
 // Existing game modules decorate card artwork; keep its caption aligned with the style.
 const previousLibrary=renderLibrary;
 renderLibrary=function(){previousLibrary();document.querySelectorAll('.style-card').forEach(card=>{const tag=card.querySelector('.format-tag');if(tag)tag.textContent=card.querySelector('h3').textContent;});};
 renderLibrary();
});
