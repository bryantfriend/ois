// Factions change the artwork; chess.js continues to own every rule and move.
const CHESS_BOARDS=['walnut','marble','garden','ocean','royal'];
const CHESS_FACTIONS={
 robots:{name:'Robots',note:'Inventors, shield bots and robotic riders'},
 orcs:{name:'Orcs',note:'Chieftains, shamans and wolf riders'},
 humans:{name:'Humans',note:'Royal knights, wizards and cavalry'},
 elves:{name:'Elves',note:'Archers, druids and stag riders'},
 dwarves:{name:'Dwarves',note:'Forge royalty, runesmiths and ram riders'},
 mechs:{name:'Mechs',note:'Command walkers, siege armour and scouts'},
 military:{name:'Military',note:'Commanders, medics, tanks and scouts'},
 zerg:{name:'SC2 Zerg',note:'Brood leaders, ultralisks and zerglings'},
 protoss:{name:'SC2 Protoss',note:'Highlords, templars and psionic warriors'},
 goblins:{name:'Goblins',note:'Tinkerers, alchemists and spider riders'}
};
const CHESS_ROLES=[['k','King'],['q','Queen'],['r','Rook'],['b','Bishop'],['n','Knight'],['p','Pawn']];
const chessAppearance={board:'walnut',mode:'traditional',white:'humans',black:'orcs'};
try{
 const saved=JSON.parse(localStorage.getItem('ois.chess.appearance')||'{}');
 if(CHESS_BOARDS.includes(saved?.board))chessAppearance.board=saved.board;
 if(['traditional','fantasy'].includes(saved?.mode))chessAppearance.mode=saved.mode;
 for(const side of ['white','black'])if(Object.hasOwn(CHESS_FACTIONS,saved?.[side]))chessAppearance[side]=saved[side];
}catch{}
const chessAsset=(kind,id)=>'./assets/chess/'+kind+'-'+id+'.png';
const chessFactionAsset=id=>'./assets/chess/factions/'+id+'.png';
function chessRequiredAssets(look=chessAppearance){
 return [chessAsset('board',look.board),...(look.mode==='fantasy'?[...new Set([look.white,look.black])].map(chessFactionAsset):[chessAsset('pieces','classic')])];
}
function chessArmyName(color){return chessAppearance.mode==='fantasy'?CHESS_FACTIONS[chessAppearance[color==='w'?'white':'black']].name:'Traditional';}
let chessArtworkSerial=0;
function chessArtwork(type,color,faction=null,preview=false,look=chessAppearance){
 const index=CHESS_ROLES.findIndex(([role])=>role===type);
 if(!faction&&look.mode==='traditional'){
  const row=color==='w'?0:1;
  return '<svg x="-32" y="-48" width="64" height="96" viewBox="'+index*200+' '+row*300+' 200 300" preserveAspectRatio="none" overflow="hidden"><image href="'+chessAsset('pieces','classic')+'" width="1200" height="600" preserveAspectRatio="none"/></svg>';
 }
 const id=faction||look[color==='w'?'white':'black'],same=!preview&&!faction&&look.white===look.black;
 const filter='chess-faction-tint-'+(++chessArtworkSerial),white=color==='w';
 // Matching armies get two different material palettes, rather than a faint hue shift.
 const tint=same?'<defs><filter id="'+filter+'" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope="'+(white?'.8':'.32')+'" intercept="'+(white?'.2':'.04')+'"/><feFuncG type="linear" slope="'+(white?'.66':'.66')+'" intercept="'+(white?'.12':'.12')+'"/><feFuncB type="linear" slope="'+(white?'.36':'.8')+'" intercept="'+(white?'.04':'.2')+'"/></feComponentTransfer></filter></defs>':'';
 const art='<svg x="-47" y="-51" width="94" height="94" viewBox="'+index%3*300+' '+Math.floor(index/3)*300+' 300 300" preserveAspectRatio="none" overflow="hidden"><image href="'+chessFactionAsset(id)+'" width="900" height="600" preserveAspectRatio="none" '+(same?'filter="url(#'+filter+')"':'')+'/></svg>';
 const badge=preview?'':'<g class="chess-role-badge"><rect x="-15" y="28" width="30" height="20" rx="8" fill="'+(white?'#fff4d8':'#153c56')+'" stroke="'+(white?'#795725':'#d0edf5')+'" stroke-width="1.8"/><text x="0" y="43" text-anchor="middle" font-family="system-ui,sans-serif" font-size="15" font-weight="800" fill="'+(white?'#433318':'#fff')+'">'+type.toUpperCase()+'</text></g>';
 return '<g class="chess-faction-piece" data-faction="'+id+'" data-team="'+color+'" data-recolored="'+same+'">'+tint+art+badge+'</g>';
}
document.addEventListener('DOMContentLoaded',()=>{
 const dialog=document.createElement('dialog');dialog.className='chess-settings';dialog.setAttribute('aria-labelledby','chess-settings-title');document.body.append(dialog);
 let pending={...chessAppearance},side='white',opener,request=0,applying=false;
 const title=id=>id.charAt(0).toUpperCase()+id.slice(1);
 const playerName=s=>typeof labPlayer==='function'?labPlayer(s==='white'?0:1):title(s);
 function miniature(faction,color='w',type='k',team=false){return '<svg viewBox="-50 -54 100 108" aria-hidden="true">'+chessArtwork(type,color,team?null:faction,!team,pending)+'</svg>';}
 function paint(focus){
  const fantasy=pending.mode==='fantasy';
  dialog.innerHTML='<header><div><span class="chess-settings-kicker">CHESS · APPEARANCE</span><h2 id="chess-settings-title">Choose your armies</h2></div><button class="button secondary" data-chess-close aria-label="Cancel appearance changes">✕</button></header>'+ 
   '<div class="chess-mode-switch" role="group" aria-label="Piece style">'+['traditional','fantasy'].map(mode=>'<button data-chess-mode="'+mode+'" aria-pressed="'+(pending.mode===mode)+'"><strong>'+title(mode)+'</strong><span>'+(mode==='fantasy'?'Each player chooses an army':'Classic White and Black pieces')+'</span></button>').join('')+'</div>'+ 
   (fantasy?'<div class="chess-army-sides" role="group" aria-label="Choose which player to customise">'+['white','black'].map(s=>'<button class="chess-army-side '+s+'" data-chess-side="'+s+'" aria-pressed="'+(side===s)+'">'+miniature(pending[s],s==='white'?'w':'b','k',true)+'<span><small>'+title(s)+' · '+esc(playerName(s))+'</small><strong>'+CHESS_FACTIONS[pending[s]].name+'</strong></span><b>'+(side===s?'Choosing now':'Change army')+'</b></button>').join('')+'</div>'+ 
    '<section aria-label="Fantasy factions"><h3>'+title(side)+' chooses <span>'+CHESS_FACTIONS[pending[side]].name+'</span></h3><div class="chess-faction-grid">'+Object.entries(CHESS_FACTIONS).map(([id,f])=>'<button class="chess-faction-choice" data-chess-faction="'+id+'" aria-label="'+f.name+' for '+title(side)+'" aria-pressed="'+(pending[side]===id)+'">'+miniature(id)+'<strong>'+f.name+'</strong></button>').join('')+'</div><p class="chess-faction-note">'+CHESS_FACTIONS[pending[side]].note+'</p></section>'+ 
    '<div class="chess-role-lineup" aria-label="Chess role guide">'+CHESS_ROLES.map(([role,name])=>'<div>'+miniature(pending[side],side==='white'?'w':'b',role,true)+'<span>'+name+'</span></div>').join('')+'</div><p class="chess-team-note">'+(pending.white===pending.black?'Same army: White wears warm gold; Black wears cool blue.':'Choose any matchup. Piece letters and light/dark badges show each chess role and side.')+'</p>':
    '<div class="chess-traditional-preview">'+['w','b'].map(color=>'<div>'+miniature(null,color)+'<strong>'+(color==='w'?'White':'Black')+'</strong></div>').join('')+'</div>')+
   '<details class="chess-board-picker"><summary>Board <strong>'+title(pending.board)+'</strong></summary><div class="chess-style-grid">'+CHESS_BOARDS.map(id=>'<button class="chess-style-choice" data-chess-board="'+id+'" aria-label="'+title(id)+' board" aria-pressed="'+(pending.board===id)+'"><img alt="" src="'+chessAsset('board',id)+'"><span>'+title(id)+'</span></button>').join('')+'</div></details>'+ 
   '<footer><span>Your match stays in progress.</span><button class="button secondary" data-chess-close>Cancel</button><button class="button" data-chess-apply>Apply appearance</button></footer>';
  if(focus?.startsWith('[data-chess-board'))dialog.querySelector('details').open=true;
  if(focus)dialog.querySelector(focus)?.focus({preventScroll:true});
 }
 async function load(paths){
  if(window.ClassroomLoading)return ClassroomLoading.prepare(paths,{title:'Chess armies',onCancel:()=>{}});
  try{await Promise.all(paths.map(src=>new Promise((resolve,reject)=>{const image=new Image();image.onload=resolve;image.onerror=reject;image.src=src;})));return true;}catch{if(typeof notify==='function')notify('The chess pictures could not load. Please try again.');return false;}
 }
 const previewAssets=()=>[...CHESS_BOARDS.map(id=>chessAsset('board',id)),...(pending.mode==='fantasy'?Object.keys(CHESS_FACTIONS).map(chessFactionAsset):[chessAsset('pieces','classic')])];
 dialog.addEventListener('close',()=>{request++;if(opener?.isConnected)opener.focus();else document.querySelector('[data-chess-settings]')?.focus();});
 document.addEventListener('click',async event=>{
  const target=event.target.closest('button');if(!target)return;
  if(target.hasAttribute('data-chess-settings')){
   const current=++request;opener=target;pending={...chessAppearance};side=game?.session?.data?.turn===1?'black':'white';
   window.ClassroomVoice?.cancel?.();if(await load(previewAssets())&&current===request){paint();dialog.showModal();}return;
  }
  if(!dialog.contains(target)||applying)return;
  if(target.hasAttribute('data-chess-close')){dialog.close();return;}
  if(target.dataset.chessMode){const previous=pending.mode;pending.mode=target.dataset.chessMode;const current=++request;if(await load(previewAssets())&&current===request)paint('[data-chess-mode="'+pending.mode+'"]');else pending.mode=previous;return;}
  if(target.dataset.chessSide){side=target.dataset.chessSide;paint('[data-chess-side="'+side+'"]');return;}
  if(target.dataset.chessFaction){pending[side]=target.dataset.chessFaction;paint('[data-chess-faction="'+pending[side]+'"]');return;}
  if(target.dataset.chessBoard){pending.board=target.dataset.chessBoard;paint('[data-chess-board="'+pending.board+'"]');dialog.querySelector('details').open=true;return;}
  if(target.hasAttribute('data-chess-apply')){
   applying=true;target.disabled=true;const current=request;
   try{if(await load(chessRequiredAssets(pending))&&current===request&&dialog.open){Object.assign(chessAppearance,pending);try{localStorage.setItem('ois.chess.appearance',JSON.stringify(chessAppearance));}catch{}if(game?.session?.config?.variant==='chess'){renderGame();chessPaint();}dialog.close();}}
   finally{applying=false;target.disabled=false;}
  }
 });
});
