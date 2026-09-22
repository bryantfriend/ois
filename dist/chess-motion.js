// Chess rules remain in chess.js; this layer animates their committed moves.
const CHESS_NAMES={p:'pawn',r:'rook',n:'knight',b:'bishop',q:'queen',k:'king'};
const chessIndex=square=>(8-Number(square[1]))*8+'abcdefgh'.indexOf(square[0]);
const chessSquare=index=>'abcdefgh'[index%8]+(8-Math.floor(index/8));
let chessRotatePreference=false;
function chessTransform(angle){const r=angle*Math.PI/180,scale=1/(Math.abs(Math.cos(r))+Math.abs(Math.sin(r)));return 'rotate('+angle+'deg) scale('+scale+')';}
function chessShape(type,color){
 const shapes={
  p:'<circle cy="-22" r="14"/><path d="M-10 -8Q-5 10 -20 24H20Q5 10 10 -8Z"/>',
  r:'<path d="M-25 -34H-13V-23H-5V-34H5V-23H13V-34H25V-10L17 -3V23H-17V-3L-25 -10Z"/>',
  n:'<path d="M-24 24Q-22 8 -4 -4L-23 1L-29 -10L-9 -34L-5 -43L3 -33Q29 -32 25 5L21 24Z"/><path d="M-8 -25L-2 -20" stroke="'+(color==='w'?'#263b51':'#f7db95')+'" stroke-width="5"/>',
  b:'<path d="M0 -42Q-31 -15 -12 -4L-9 5L-23 24H23L9 5L12 -4Q31 -15 0 -42Z"/><path d="M3 -29L-7 -14" fill="none"/>',
  q:'<path d="M-28 -22L-18 16H18L28 -22L13 -8L0 -33L-13 -8Z"/><circle cx="-28" cy="-27" r="5"/><circle cy="-38" r="5"/><circle cx="28" cy="-27" r="5"/><path d="M-20 21H20V29H-20Z"/>',
  k:'<path d="M-18 -23Q-30 -8 -12 2L-18 25H18L12 2Q30 -8 18 -23Z"/><path d="M0 -45V-20M-10 -35H10" fill="none" stroke-width="7"/>'
 };
 return '<ellipse cy="37" rx="33" ry="7" fill="#0b203940"/><g fill="'+(color==='w'?'#fff2d1':'#28465e')+'" stroke="'+(color==='w'?'#8f7149':'#9fb9c7')+'" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">'+shapes[type]+'<path d="M-25 25H25L30 35H-30Z"/></g>';
}
function chessPiece(piece,angle){return '<g class="chess-upright" transform="rotate('+(-angle)+')">'+chessShape(piece.type,piece.color)+'</g>';}
const chessBaseInit=LAB_ENGINES.classics.init;LAB_ENGINES.classics.init=function(c,seed){const d=chessBaseInit(c,seed);if(c.variant==='chess')Object.assign(d,{w:8,h:8,autoRotate:chessRotatePreference,viewAngle:0,rotation:null});return d;};
const chessBaseRender=LAB_ENGINES.classics.render;
LAB_ENGINES.classics.render=function(d,c){
 if(c.variant!=='chess')return chessBaseRender(d,c);
 const chess=labChess(d),board=chess.board().flat(),m=d.motion,angle=d.viewAngle||0,locked=!!m||!!d.rotation;
 const legal=d.selected===null?[]:chess.moves({square:chessSquare(d.selected),verbose:true}).map(move=>chessIndex(move.to));
 document.querySelectorAll('.board-players span').forEach((el,i)=>{el.style.setProperty('--side',i?'#28465e':'#8f7149');el.classList.toggle('active',i===(m?m.owner:d.turn));el.textContent=labPlayer(i)+(i?' · Black':' · White');});
 let svg='<rect width="840" height="840" rx="22" fill="#173750"/>';
 board.forEach((p,i)=>{const {x,y}=classicPoint(i,d);svg+='<rect x="'+(x-50)+'" y="'+(y-50)+'" width="100" height="100" fill="'+((i%8+Math.floor(i/8))%2?'#46858b':'#e6eee2')+'"/>';
  if(i===d.selected)svg+='<rect x="'+(x-47)+'" y="'+(y-47)+'" width="94" height="94" rx="10" fill="#ffe18b55" stroke="#ffe18b" stroke-width="5"/>';
  if(legal.includes(i))svg+='<circle cx="'+x+'" cy="'+y+'" r="'+(p?43:15)+'" fill="'+(p?'none':'#ffe18b')+'" stroke="#ffe18b" stroke-width="5"/>';
  if(p&&p.type==='k'&&p.color===chess.turn()&&chess.isCheck())svg+='<rect x="'+(x-48)+'" y="'+(y-48)+'" width="96" height="96" rx="12" fill="#ff657077" stroke="#cf3549" stroke-width="4"/>';
  if(p&&i!==m?.to&&i!==m?.rookTo)svg+='<g transform="translate('+x+' '+y+')">'+chessPiece(p,angle)+'</g>';
 });
 for(let i=0;i<8;i++)svg+='<g transform="translate('+(70+i*100)+' 830)"><g class="chess-upright" transform="rotate('+(-angle)+')"><text y="5" text-anchor="middle" font-size="15" fill="white">'+'abcdefgh'[i]+'</text></g></g><g transform="translate(10 '+(70+i*100)+')"><g class="chess-upright" transform="rotate('+(-angle)+')"><text y="5" text-anchor="middle" font-size="15" fill="white">'+(8-i)+'</text></g></g>';
 if(m){if(m.captured){const p=classicPoint(m.capture,d);svg+='<g id="chess-captured" transform="translate('+p.x+' '+p.y+')">'+chessPiece(m.captured,angle)+'</g>';}
  svg+='<g id="chess-mover">'+chessPiece(m.piece,angle)+'</g>';
  if(m.rookTo!==null)svg+='<g id="chess-rook">'+chessPiece({type:'r',color:m.piece.color},angle)+'</g>';
 }
 const controls=board.map((p,i)=>'<button data-mode-action="lab-cell" data-value="'+i+'" aria-label="'+chessSquare(i)+(p?' '+(p.color==='w'?'White ':'Black ')+CHESS_NAMES[p.type]:legal.includes(i)?' legal destination':' empty')+'" '+(locked||d.promotion?'disabled':'')+'></button>').join('');
 return '<div class="classic-layout classic-chess"><div class="classic-visual" style="aspect-ratio:1"><div class="chess-plane" style="transform:rotate('+angle+'deg)"><svg class="classic-svg" viewBox="0 0 840 840" aria-hidden="true">'+svg+'</svg><div class="classic-inputs" style="--columns:8;inset:2.380952%">'+controls+'</div></div></div><aside class="classic-sidebar"><span class="classic-kicker">CHESS</span><h2>'+(m?'Making a move…':d.rotation?'Turning the board…':esc(labPlayer(d.turn))+'’s turn')+'</h2><div class="classic-player-token"><svg viewBox="-45 -50 90 100">'+chessShape('k',(m?m.owner:d.turn)?'b':'w')+'</svg></div><p>'+(d.promotion?'Choose your new piece.':chess.isCheck()?'Check! Protect your king.':'Tap a piece, then a golden destination.')+'</p>'+(d.promotion?'<div class="chess-promotions">'+['Queen','Rook','Bishop','Knight'].map((name,i)=>labButton('promote',name,i)).join('')+'</div>':'')+'<button class="button secondary" data-mode-action="lab-rotate" aria-pressed="'+d.autoRotate+'" '+(locked?'disabled':'')+'>↻ Auto-rotate: '+(d.autoRotate?'On':'Off')+'</button><p class="classic-hint">'+(d.autoRotate?'The board faces the next player after each move.':'White stays at the bottom. Turn on to face each player.')+'</p><div class="classic-moves">'+d.history.length+' moves played</div>'+labButton('resign','Resign game',0,locked)+'</aside></div>';
};
function chessStartRotation(d){const target=d.autoRotate&&d.turn===1?180:0;if(d.viewAngle===target)return;if(arcade.reduced||matchMedia('(prefers-reduced-motion: reduce)').matches){d.viewAngle=target;return;}d.rotation={from:d.viewAngle,to:target,age:0,duration:.6};}
const chessBaseAction=LAB_ENGINES.classics.action;LAB_ENGINES.classics.action=function(d,a,n,c,...rest){
 if(c.variant!=='chess')return chessBaseAction(d,a,n,c,...rest);
 if(d.motion||d.rotation)return;
 if(a==='rotate'){d.autoRotate=!d.autoRotate;chessRotatePreference=d.autoRotate;chessStartRotation(d);return;}
 const before=labChess(d),count=d.history.length;
 chessBaseAction(d,a,n,c,...rest);
 if(count===d.history.length)return;
 const move=labChess(d).history({verbose:true}).at(-1),from=chessIndex(move.from),to=chessIndex(move.to),capture=move.flags.includes('e')?to+(move.color==='w'?8:-8):to;
 if(arcade.reduced||matchMedia('(prefers-reduced-motion: reduce)').matches){chessStartRotation(d);return;}
 const castle=move.flags.includes('k')||move.flags.includes('q');
 d.motion={chess:true,from,to,capture,piece:before.get(move.from),captured:move.captured?before.board().flat()[capture]:null,rookFrom:castle?(move.flags.includes('k')?from+3:from-4):null,rookTo:castle?(move.flags.includes('k')?from+1:from-1):null,owner:move.color==='w'?0:1,age:0,travel:.45,duration:.5,finish:game.session.phase==='feedback'};
 if(d.motion.finish)game.session.phase='play';
};
function chessPaint(){const d=game?.session?.data;if(game?.session?.config.variant!=='chess')return;const plane=$('.chess-plane');if(!plane)return;plane.style.transform=chessTransform(d.viewAngle);plane.querySelectorAll('.chess-upright').forEach(el=>el.setAttribute('transform','rotate('+(-d.viewAngle)+')'));
 const m=d.motion;if(!m)return;const t=Math.min(1,m.age/m.travel),ease=t*t*(3-2*t);
 const place=(id,from,to,jump=0)=>{const a=classicPoint(from,d),b=classicPoint(to,d);$(id)?.setAttribute('transform','translate('+(a.x+(b.x-a.x)*ease)+' '+(a.y+(b.y-a.y)*ease-Math.sin(Math.PI*t)*jump)+')');};
 place('#chess-mover',m.from,m.to,m.piece.type==='n'?65:0);if(m.rookTo!==null)place('#chess-rook',m.rookFrom,m.rookTo);
 $('#chess-captured')?.setAttribute('opacity',Math.max(0,1-Math.max(0,t-.5)*2));
}
const chessPaintClassic=classicPaintMotion;classicPaintMotion=function(){if(game?.session?.config.variant==='chess')chessPaint();else chessPaintClassic();};
const chessHandle=labHandle;labHandle=function(button){if(game?.session?.data?.rotation)return;chessHandle(button);chessPaint();};
const chessStep=stepArcade;stepArcade=function(dt){
 const s=game?.session,d=s?.data,m=d?.motion;
 // The shared movement clock completes slides first; rotate only after landing.
 chessStep(dt);
 if(ui.view!=='player'||s!==game?.session||s?.config.variant!=='chess')return;
 if(m&&!d.motion&&!game.done){chessStartRotation(d);renderGame();}
 if(d.rotation){const r=d.rotation;r.age+=dt;const t=Math.min(1,r.age/r.duration);d.viewAngle=r.from+(r.to-r.from)*(t*t*(3-2*t));chessPaint();if(t===1||arcade.reduced){d.viewAngle=r.to;d.rotation=null;renderGame();}}
};
