// SVG presentation for the existing rules engines. A move is committed once;
// input stays locked until its visual journey ends, including the winning move.
function cinematicClassic(c){return c?.engine==='classics'&&['checkers','kids','fourrow'].includes(c.variant);}
function classicPoint(i,d){return d.w===7?{x:65+(i%7)*90+45,y:90+Math.floor(i/7)*90+45}:{x:20+(i%d.w)*100+50,y:20+Math.floor(i/d.w)*100+50};}
function classicToken(owner,king=false){return '<circle cy="6" r="36" fill="#14243a" opacity=".3"/><circle r="36" fill="url(#token-'+owner+')" stroke="'+(owner?'#872c41':'#173a80')+'" stroke-width="4"/><circle cy="-2" r="27" fill="none" stroke="#ffffff80" stroke-width="3"/><path d="M-23 -16Q0 -35 23 -16" fill="none" stroke="#fff" opacity=".65" stroke-width="5" stroke-linecap="round"/>'+(king?'<g class="classic-crown"><path d="M-22 -13L-12 -2L0 -20L12 -2L22 -13L16 15H-16Z" fill="#ffe481" stroke="#86531b" stroke-width="3"/><path d="M-16 20H16" stroke="#ffe481" stroke-width="5" stroke-linecap="round"/></g>':'');}
const classicOriginalRender=LAB_ENGINES.classics.render;
LAB_ENGINES.classics.render=function(d,c){
 if(!cinematicClassic(c))return classicOriginalRender(d,c);
 const four=c.variant==='fourrow',size=four?760:d.w*100+40,height=four?720:size,m=d.motion;
 document.querySelectorAll('.board-players span').forEach((el,i)=>{el.style.setProperty('--side',i?'#b72d50':'#1c58b5');el.classList.toggle('active',i===(m?m.owner:d.turn));el.textContent=labPlayer(i)+(i?' · Coral':' · Blue');});
 const legal=four?[]:d.selected===null?[]:labCheckerMoves(d,d.forced).filter(x=>x.from===d.selected).map(x=>x.to);
 let svg='<defs><radialGradient id="token-0" cx="35%" cy="25%"><stop stop-color="#89ddff"/><stop offset=".55" stop-color="#3297ee"/><stop offset="1" stop-color="#1c58b5"/></radialGradient><radialGradient id="token-1" cx="35%" cy="25%"><stop stop-color="#ffb89c"/><stop offset=".55" stop-color="#f6676b"/><stop offset="1" stop-color="#b72d50"/></radialGradient><linearGradient id="board-frame" x2=".6" y2="1"><stop stop-color="#255b93"/><stop offset="1" stop-color="#122b51"/></linearGradient></defs>';
 svg+=four?'<rect x="43" y="76" width="674" height="576" rx="32" fill="#0b2039"/><rect x="43" y="66" width="674" height="576" rx="32" fill="url(#board-frame)" stroke="#76b5d4" stroke-width="5"/><path d="M60 657H700" stroke="#152d49" stroke-width="24" stroke-linecap="round"/>':'<rect width="'+size+'" height="'+size+'" rx="22" fill="url(#board-frame)"/>';
 d.board.forEach((p,i)=>{
  const {x,y}=classicPoint(i,d),owner=four?p:p?.owner;
  svg+=four?'<circle cx="'+x+'" cy="'+y+'" r="38" fill="#071a31" stroke="#497596" stroke-width="3"/>':'<rect x="'+(x-50)+'" y="'+(y-50)+'" width="100" height="100" fill="'+((i%d.w+Math.floor(i/d.w))%2?'#387b88':'#e1eee6')+'"/>';
  if(legal.includes(i))svg+='<circle cx="'+x+'" cy="'+y+'" r="18" fill="#ffe08c"/><circle cx="'+x+'" cy="'+y+'" r="38" fill="none" stroke="#ffe08c" stroke-width="4" stroke-dasharray="7 5"/>';
  if(d.selected===i)svg+='<rect x="'+(x-46)+'" y="'+(y-46)+'" width="92" height="92" rx="12" fill="none" stroke="#ffe08c" stroke-width="5"/>';
  if(owner!==undefined&&owner>=0&&(!m||i!==m.to))svg+='<g transform="translate('+x+' '+y+')">'+classicToken(owner,p?.king)+'</g>';
 });
 if(m){
  if(m.capture!==null){const p=classicPoint(m.capture,d);svg+='<g id="classic-captured" transform="translate('+p.x+' '+p.y+')">'+classicToken(1-m.owner,m.capturedKing)+'</g>';}
  svg+='<g id="classic-mover">'+classicToken(m.owner,m.wasKing)+'<g id="classic-coronation" opacity="0"><circle r="44" fill="none" stroke="#ffdf6f" stroke-width="5"/>'+Array.from({length:8},(_,i)=>'<path d="M0 -49L3 -56L0 -63L-3 -56Z" fill="#ffd35e" transform="rotate('+i*45+')"/>').join('')+classicToken(m.owner,true)+'</g></g>';
 }
 const controls=four?Array.from({length:7},(_,i)=>'<button data-mode-action="lab-cell" data-value="'+i+'" aria-label="Drop in column '+(i+1)+'" '+(m||d.board[i]>=0?'disabled':'')+'><span>↓</span></button>').join(''):d.board.map((p,i)=>'<button data-mode-action="lab-cell" data-value="'+i+'" aria-label="Row '+(Math.floor(i/d.w)+1)+', column '+(i%d.w+1)+(p?', '+(p.owner?'Coral':'Blue')+(p.king?' crowned piece':' piece'):legal.includes(i)?', legal destination':', empty')+'" '+(m?'disabled':'')+'></button>').join('');
 return '<div class="classic-layout '+(four?'classic-four':'classic-checkers')+'"><div class="classic-visual" style="aspect-ratio:'+size+'/'+height+'"><svg class="classic-svg" viewBox="0 0 '+size+' '+height+'" aria-hidden="true">'+svg+'</svg><div class="classic-inputs" style="--columns:'+d.w+';'+(!four?'inset:'+20/size*100+'%;':'')+'">'+controls+'</div></div><aside class="classic-sidebar"><span class="classic-kicker">'+(four?'CONNECT FOUR':'CHECKERS')+'</span><h2>'+(m?'Nice move!':esc(labPlayer(d.turn))+'’s turn')+'</h2><div class="classic-player-token"><svg viewBox="-45 -45 90 95">'+classicToken(m?m.owner:d.turn)+'</svg></div><p>'+(m?m.promoted?'Crowning a champion!':m.capture!==null?'Jump & capture!':'Watch it land.':four?'Choose a column. Connect four pieces in any direction.':d.forced!==null?'Keep jumping with the highlighted piece.':'Tap your piece, then a golden destination. Captures take priority.')+'</p>'+(!four?'<p class="classic-hint">Reach the far side to earn a crown and move both ways.</p>':'')+'<div class="classic-moves">'+game.session.moves+' moves played</div>'+labButton('resign','Resign game',0,!!m)+'</aside></div>';
};
const classicOriginalAction=LAB_ENGINES.classics.action;
LAB_ENGINES.classics.action=function(d,a,n,c,...rest){
 if(!cinematicClassic(c))return classicOriginalAction(d,a,n,c,...rest);
 if(d.motion)return;
 const before=d.board.map(p=>p&&typeof p==='object'?{...p}:p),owner=d.turn,count=game.session.moves;
 classicOriginalAction(d,a,n,c,...rest);
 if(a!=='cell'||count===game.session.moves||arcade.reduced||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const four=c.variant==='fourrow',to=d.board.findIndex((p,i)=>four?p===owner&&before[i]<0:p&&before[i]===null);
 if(to<0)return;
 const from=four?to:before.findIndex((p,i)=>p?.owner===owner&&!d.board[i]);
 const capture=four?-1:before.findIndex((p,i)=>p&&p.owner!==owner&&!d.board[i]);
 const promoted=!four&&!before[from].king&&d.board[to].king;
 d.motion={from,to,owner,capture:capture<0?null:capture,capturedKing:capture>=0&&before[capture].king,wasKing:!four&&before[from].king,promoted,age:0,travel:four?.55:capture>=0?.65:.35,duration:(four?.55:capture>=0?.65:.35)+(promoted?.65:0),finish:game.session.phase==='feedback'};
 if(d.motion.finish)game.session.phase='play';
};
const classicHandle=labHandle;labHandle=function(button){if(game?.session?.data?.motion)return;classicHandle(button);classicPaintMotion();};
function classicPaintMotion(){
 const d=game?.session?.data,m=d?.motion,el=$('#classic-mover');if(!m||!el)return;
 const to=classicPoint(m.to,d),from=d.w===7?{x:to.x,y:18}:classicPoint(m.from,d),t=Math.min(1,m.age/m.travel);
 const eased=d.w===7?(t<.8?Math.pow(t/.8,2):1-Math.sin((t-.8)/.2*Math.PI)*.045):1-Math.pow(1-t,3),jump=m.capture!==null?Math.sin(Math.PI*t)*90:0;
 const x=from.x+(to.x-from.x)*eased,y=from.y+(to.y-from.y)*eased-jump;
 el.setAttribute('transform','translate('+x+' '+y+') scale('+(1+(m.capture!==null?Math.sin(Math.PI*t)*.16:0))+')');
 const captured=$('#classic-captured');if(captured){const f=Math.max(0,Math.min(1,(t-.4)/.4)),p=classicPoint(m.capture,d);captured.setAttribute('transform','translate('+p.x+' '+p.y+') scale('+(1-f*.9)+') rotate('+(f*100)+')');captured.setAttribute('opacity',1-f);}
 const crown=$('#classic-coronation');if(crown&&m.promoted){const f=Math.max(0,Math.min(1,(m.age-m.travel)/.5));crown.setAttribute('opacity',f);crown.setAttribute('transform','scale('+(1+Math.sin(f*Math.PI)*.35)+')');}
}
const classicStep=stepArcade;stepArcade=function(dt){classicStep(dt);if(ui.view!=='player')return;const s=game?.session,m=s?.data?.motion;if(!m)return;m.age+=dt;if(m.age>=m.duration||arcade.reduced){s.data.motion=null;if(m.finish)s.phase='feedback';renderGame();}else classicPaintMotion();};
const classicFit=boardFit;boardFit=function(){classicFit();const layout=$('.classic-layout');if(!layout||ui.view!=='player')return;const arena=$('#arena'),available=innerWidth>=1024?arena.clientHeight-52:innerHeight-260,ratio=layout.classList.contains('classic-four')?760/720:1;layout.style.setProperty('--classic-height',Math.max(240,Math.min(available,(layout.clientWidth-254)/ratio))+'px');classicPaintMotion();};
document.addEventListener('fullscreenchange',()=>requestAnimationFrame(boardFit));

// Preserve the stage, its measured size and its SVG between moves. Replacing
// arena.innerHTML used to reset the board to its fallback height for two frames.
function classicPatchNode(current,next){
 if(current.nodeType!==next.nodeType||current.nodeName!==next.nodeName){current.replaceWith(next.cloneNode(true));return;}
 if(current.nodeType===Node.TEXT_NODE){if(current.nodeValue!==next.nodeValue)current.nodeValue=next.nodeValue;return;}
 if(current.nodeType!==Node.ELEMENT_NODE)return;
 for(const a of [...current.attributes])if(!next.hasAttribute(a.name)&&!(a.name==='style'&&current.classList.contains('classic-layout')))current.removeAttribute(a.name);
 for(const a of next.attributes)if(current.getAttribute(a.name)!==a.value)current.setAttribute(a.name,a.value);
 const old=[...current.childNodes],fresh=[...next.childNodes];
 for(let i=0;i<Math.max(old.length,fresh.length);i++){if(!fresh[i])old[i].remove();else if(!old[i])current.append(fresh[i].cloneNode(true));else classicPatchNode(old[i],fresh[i]);}
}
let classicStageOwner=null;
const classicStableRender=labRender;labRender=function(){
 const s=game?.session,c=s?.config,layout=$('.classic-layout');
 const enhanced=cinematicClassic(c)||c?.engine==='classics'&&c.variant==='chess';
 if(!enhanced||game.done||classicStageOwner!==game||!layout){classicStableRender();classicStageOwner=game;boardFit();return;}
 const template=document.createElement('template');template.innerHTML=LAB_ENGINES[c.engine].render(s.data,c);
 classicPatchNode(layout,template.content.firstElementChild);
 const status=$('.board-game .lab-status');if(status)status.textContent=s.message;
 classicPaintMotion();
 if(s.phase==='feedback'){game.done=true;renderGame();}
};
