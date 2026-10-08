// Plant cutaway and the shared two-step Cell Structures start screen.
function actPlantCellSVG(){
 const id='act-plant-'+(++actCellIllustrationId),paint=name=>'url(#'+id+'-'+name+')';
 const chloroplast=(x,y,scale=1)=>`<g transform="translate(${x} ${y}) scale(${scale})"><ellipse rx="44" ry="21" fill="${paint('chloroplast')}" stroke="#368841" stroke-width="3"/><ellipse rx="37" ry="15" fill="none" stroke="#d5f6ab" stroke-width="1.5"/><path d="M-27 0H27" stroke="#73ad50" stroke-width="2"/>${[-22,0,22].map((cx,i)=>`<g transform="translate(${cx} 0)" fill="#479a48" stroke="#c0eb8a" stroke-width="1">${[-7,-3,1,5].map(cy=>`<ellipse cy="${cy}" rx="8" ry="2.6"/>`).join('')}<circle class="act-cell-atp" style="animation-delay:-${i*.7}s" cy="-10" r="2.5" fill="#fff68e" stroke="#d2bc3d"/></g>`).join('')}</g>`;
 return `<svg class="act-cell-art act-plant-art" viewBox="0 0 600 330" role="img" aria-label="Plant cell cutaway showing cell wall, membrane, cytoplasm, nucleus, chloroplasts, central vacuole, mitochondrion, ribosomes, Golgi apparatus, rough and smooth endoplasmic reticulum and nucleolus">
 <defs>
 <linearGradient id="${id}-cyto" x2="0" y2="1"><stop stop-color="#fff6c4"/><stop offset="1" stop-color="#f4dfa0"/></linearGradient>
 <radialGradient id="${id}-vacuole" cx="35%" cy="30%"><stop stop-color="#e6fcff"/><stop offset=".7" stop-color="#ade8ef"/><stop offset="1" stop-color="#77c7d7"/></radialGradient>
 <radialGradient id="${id}-nucleus" cx="30%" cy="25%"><stop stop-color="#e5cbff"/><stop offset="1" stop-color="#8a60c5"/></radialGradient>
 <radialGradient id="${id}-chloroplast" cx="35%" cy="20%"><stop stop-color="#d6f3a6"/><stop offset="1" stop-color="#75bd61"/></radialGradient>
 </defs>
 <rect width="600" height="330" fill="#eff8e9"/>
 <rect x="42" y="25" width="516" height="280" rx="52" fill="#96c677" stroke="#467e48" stroke-width="5"/>
 <rect x="51" y="34" width="498" height="262" rx="44" fill="#d0e6a8" stroke="#6fa25f" stroke-width="3"/>
 <path d="M85 31H514M48 77V253M84 300H515M552 79V250" fill="none" stroke="#e7f4c9" stroke-width="3" stroke-dasharray="8 5"/>
 <rect x="63" y="45" width="474" height="240" rx="32" fill="${paint('cyto')}" stroke="#b35c88" stroke-width="6"/>
 <rect x="68" y="50" width="464" height="230" rx="28" fill="none" stroke="#f5bdd1" stroke-width="2"/>
 <g fill="#b89352" opacity=".3">${[[90,180],[102,205],[300,59],[333,62],[373,63],[475,71],[486,275],[335,270],[284,266],[203,272],[87,118],[512,168]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2"/>`).join('')}</g>
 <rect x="237" y="76" width="250" height="162" rx="48" fill="${paint('vacuole')}" stroke="#4c9eb4" stroke-width="4"/>
 <rect x="244" y="83" width="236" height="148" rx="43" fill="none" stroke="#e2fcff" stroke-width="2"/>
 <path d="M260 114Q267 91 293 91H421" fill="none" stroke="#fff" stroke-width="4" opacity=".8" stroke-linecap="round"/>
 <g class="act-cell-current" fill="#e9ffff">${[[283,137],[321,192],[433,171],[392,101]].map(([x,y],i)=>`<circle style="animation-delay:-${i}s" cx="${x}" cy="${y}" r="3"/>`).join('')}</g>
 <g fill="none" stroke-linecap="round"><g stroke="#509da5" stroke-width="9"><path d="M191 109C194 75 145 66 130 96"/><path d="M201 99C193 56 132 58 119 93"/><path d="M153 117C134 104 120 111 116 129"/></g><g stroke="#c2f1df" stroke-width="2.5"><path d="M191 109C194 75 145 66 130 96"/><path d="M201 99C193 56 132 58 119 93"/></g></g>
 <ellipse cx="165" cy="164" rx="54" ry="45" fill="${paint('nucleus')}" stroke="#704999" stroke-width="4"/>
 <ellipse cx="165" cy="164" rx="47" ry="38" fill="none" stroke="#e9d3ff" stroke-width="2"/>
 <path d="M127 154Q138 130 149 147T172 144M133 184Q149 195 152 175T173 190" fill="none" stroke="#8862b9" stroke-width="3"/>
 <circle cx="189" cy="168" r="16" fill="#62428e" stroke="#c6a4ee" stroke-width="2"/><ellipse cx="184" cy="162" rx="5" ry="3" fill="#bc98df"/>
 <g fill="#715098" stroke="#e9d3ff" stroke-width="1">${[[119,155],[142,124],[177,121],[217,158],[172,209],[125,189]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.5"/>`).join('')}</g>
 ${chloroplast(450,247)}${chloroplast(104,82,.65)}${chloroplast(352,267,.55)}
 <g transform="translate(112 244) rotate(-15)"><ellipse rx="33" ry="16" fill="#f3ae6b" stroke="#b85e39" stroke-width="3"/><path d="M-25-4C-17-15-19 11-11 5S-9-13-1-7S-3 14 8 7S6-13 16-6S16 7 25 2" fill="none" stroke="#ab522e" stroke-width="3" stroke-linecap="round"/><g fill="#fff4a1" stroke="#de9926" stroke-width=".6">${[-18,-2,14].map((x,i)=>`<circle class="act-cell-atp" style="animation-delay:-${i*.6}s" cx="${x}" r="2.8"/>`).join('')}</g></g>
 <g transform="translate(507 111) rotate(90)" fill="none" stroke-linecap="round"><path d="M-20-15Q0-2 20-15M-23-5Q0 9 23-5M-22 5Q0 20 22 5M-17 15Q0 26 17 15" stroke="#c98536" stroke-width="6"/><path d="M-20-17Q0-4 20-17M-23-7Q0 7 23-7M-22 3Q0 18 22 3" stroke="#ffe29a" stroke-width="2"/></g>
 <g fill="none" stroke-linecap="round"><path d="M189 239C201 226 223 236 219 248S202 264 224 269M219 248C242 239 251 254 239 269M206 250C191 256 189 271 206 272" stroke="#509da5" stroke-width="8"/><path d="M189 239C201 226 223 236 219 248S202 264 224 269" stroke="#c2f1df" stroke-width="2.5"/></g>
 <g fill="#3c6480" stroke="#e1f6ff" stroke-width="1">${[[145,83],[156,77],[171,80],[179,87],[131,97],[121,88],[499,200],[507,206],[493,209],[501,216],[514,196]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.5"/>`).join('')}</g>
 <g fill="#ffd765" stroke="#ae7929" stroke-width=".8">${[[509,216],[516,221],[524,221]].map(([x,y],i)=>`<circle class="act-cell-protein" style="animation-delay:-${(3-i)*.7}s" cx="${x}" cy="${y}" r="2.8"/>`).join('')}</g>
 <g class="act-cell-processes" stroke-width="1.2">
 <circle class="act-cell-cargo act-cell-membrane-cargo" style="offset-path:path('M30 190Q63 180 96 192')" r="4" fill="#66c8ed" stroke="#277fa3"/>
 <circle class="act-cell-cargo" style="offset-path:path('M183 87C280 44 438 55 501 101');animation-delay:-2s" r="4.5" fill="#9ae5d3" stroke="#398e87"/>
 <circle class="act-cell-cargo" style="offset-path:path('M510 130Q528 144 557 145');animation-delay:-4s" r="4.5" fill="#ffe6a0" stroke="#c18935"/>
 <circle class="act-cell-cargo" style="offset-path:path('M445 250Q302 281 126 246');animation-delay:-1s" r="3.5" fill="#ffd35d" stroke="#bd8e28"/>
 <circle class="act-cell-cargo" style="offset-path:path('M282 264Q289 233 296 209');animation-delay:-3s" r="3" fill="#66c8ed" stroke="#277fa3"/>
 <circle class="act-cell-cargo" style="offset-path:path('M573 308L469 259');animation-delay:-2.5s" r="3" fill="#fff385" stroke="#d9bd46"/>
 </g>
 </svg>`;
}
function actCellTypeOf(lesson){return lesson.items.some(q=>q.answer==='Chloroplast'||q.answer==='Central vacuole')?'plant':'animal';}
function actCellRenameLegacy(){
 const old=['Labelled Diagram: Animal cell structures','Labelled Diagram: Cell structures and their functions'];
 if(old.includes(game.lesson.title))game.lesson.title='Cell Structures';
 if(draft&&old.includes(draft.title)){draft.title='Cell Structures';$('#lesson-title').value=draft.title;}
}
function actCellSetup(){
 const s=game.session,type=s.pendingCellType||s.cellType||'animal',plant=type==='plant';
 $('#scoreboard').innerHTML='<div class="class-score"><strong>Choose your cell and difficulty</strong><span>6 · 9 · 12 structures</span></div>';
 if(s.cellSetupStep==='difficulty'){
  $('#arena').innerHTML=`<div class="act-cell-start"><span class="act-cell-discovery-kicker">Step 2 of 2</span><h2>Choose your difficulty</h2><p>${plant?'Plant':'Animal'} cell · select a level to begin</p><div class="act-cell-start-levels">${Object.entries(CELL_LEVELS).map(([key,level])=>`<button class="button secondary" data-mode-action="act-cell-begin" data-level="${key}" data-cell-type="${type}"><strong>${level.name}</strong><b>${level.count}</b><span>structures to label</span><small>${actCellLevelSummary(key,type)}</small></button>`).join('')}</div>${actButton('cell-setup','← Choose a different cell')}${s.cellSetupReturnPhase?actButton('cell-setup-cancel','Return to current game'):''}</div>`;
 }else{
  $('#arena').innerHTML=`<div class="act-cell-start"><span class="act-cell-discovery-kicker">Step 1 of 2</span><h2>Which cell will you explore?</h2><div class="act-cell-type-cards">${[['animal','Animal cell','Flexible membrane · small vacuoles',actCellSVG()],['plant','Plant cell','Cell wall · chloroplasts · central vacuole',actPlantCellSVG()]].map(([key,name,description,svg])=>`<button class="button secondary act-cell-type-card" data-mode-action="act-cell-pick-type" data-cell-type="${key}"><span class="act-cell-type-preview">${svg}</span><strong>${name}</strong><span>${description}</span><small>Choose ${key} →</small></button>`).join('')}</div>${s.cellSetupReturnPhase?actButton('cell-setup-cancel','Return to current game'):''}</div>`;
 }
}
function actCellLevelSummary(level,type){if(type!=='plant')return CELL_LEVELS[level].summary;return {easy:'Cell wall, membrane, cytoplasm, nucleus, chloroplast and central vacuole',medium:'Core structures + mitochondrion, ribosome and Golgi apparatus',hard:'All structures + rough ER, smooth ER and nucleolus'}[level];}
function actCellChoose(type,level){
 if(!['animal','plant'].includes(type)||!Object.hasOwn(CELL_LEVELS,level))return;
 const s=game.session;s.cellType=type;s.cellItems=clone(s.cellRosters[type]);s.cellSetupReturnPhase=null;
 game.lesson.items=clone(s.cellItems);game.lesson.settings.cellType=type;
 // Keep the editor, replay and exported lesson on the cell the class selected.
 if(draft?.format==='diagram'){
  draft.items=clone(s.cellItems);draft.settings.cellType=type;draft.settings.cellDifficulty=level;
  renderRows();
 }
 actCellApplyLevel(level);
}
