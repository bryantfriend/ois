/* Keep the real board on screen while the completed game is input-locked. */
function celebrationTheme(){
 const f=game.lesson.format;
 if(['tug','relay'].includes(f))return 'hamsters';
 if(/quiz|airplane|rocket/.test(f))return 'launch';
 if(/sort|ocean|earth|geog/.test(f)||game.session?.geography)return 'nature';
 if(/match|potion|pair/.test(f))return 'bubbles';
 if(/board|boozled|treasure|kingdom|wager/.test(f))return 'treasure';
 if(/word|spell|letter|cross|anagram|sentence/.test(f))return 'letters';
 return 'board';
}
function celebrationSuccessful(){return game.session?.success!==false&&!(game.lesson.format==='survival'&&game.lives<=0)&&!(game.lesson.format==='earth'&&game.session?.health<=0);}
function celebrationIntercept(render){
 if(!game||ui.view!=='player'||!game.done||!celebrationSuccessful()||game.celebration?.finished)return false;
 if(game.celebration)return true;
 const c=game.celebration={age:0,duration:arcade.reduced?1.2:4.6,theme:celebrationTheme(),render,finished:false};
 document.querySelectorAll('#scoreboard .team-score strong').forEach((el,i)=>el.textContent=game.teams[i]);const arena=$('#arena');arena.inert=true;$('#player').classList.add('celebrating');
 const layer=document.createElement('div');layer.id='victory-layer';layer.dataset.theme=c.theme;
 const art={launch:'<path d="M100 150Q60 80 100 20Q140 80 100 150Z" fill="#fff" stroke="#6558bc" stroke-width="5"/><circle cx="100" cy="75" r="17" fill="#52dce9"/><path d="M85 148L100 195L115 148" fill="#ffbe43"/>',nature:'<path d="M100 170V70" stroke="#168c72" stroke-width="9"/><path d="M98 125Q20 120 40 55Q110 65 98 125M104 100Q175 105 165 35Q105 40 104 100" fill="#55dca5"/>',bubbles:'<path d="M70 35H130V90L165 150Q175 180 145 183H55Q25 180 35 150L70 90Z" fill="#93f4ea" stroke="#6045a5" stroke-width="6"/><path d="M45 145Q100 115 155 145L145 170H55Z" fill="#c17aff"/><circle cx="90" cy="120" r="12" fill="white"/><circle cx="115" cy="70" r="8" fill="#ffbf65"/>',treasure:'<path d="M30 90Q30 35 100 35Q170 35 170 90Z" fill="#ffc34f" stroke="#90543a" stroke-width="6"/><rect x="30" y="105" width="140" height="75" rx="12" fill="#d18543" stroke="#90543a" stroke-width="6"/><path d="M60 110V175M140 110V175" stroke="#ffe582" stroke-width="13"/><circle cx="100" cy="95" r="22" fill="#fff2a2"/>',letters:'<text x="100" y="135" text-anchor="middle" font-size="95" font-weight="900" fill="#6954bd">ABC</text>',board:'<path d="M40 100L80 145L165 50" stroke="#1cad87" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'};
 layer.innerHTML=(['hamsters','board'].includes(c.theme)?'':'<svg class="victory-art" viewBox="0 0 200 200" aria-hidden="true">'+art[c.theme]+'</svg>')+'<div class="victory-confetti" aria-hidden="true">'+Array.from({length:65},(_,i)=>'<i style="--x:'+((i*37)%101)+'%;--delay:'+((i%13)*.08)+'s;--color:'+['#ff628d','#ffda58','#49d9ba','#9b7cff','#52c9ff'][i%5]+';--drift:'+((i%2?1:-1)*(30+i%80))+'px"></i>').join('')+'</div><div class="victory-caption" role="status">'+({hamsters:'Victory dance!',launch:'Blast off!',nature:'Watch your world flourish!',bubbles:'A little learning magic!',treasure:'Treasure unlocked!',letters:'Words in motion!',board:'Look what you made!'}[c.theme])+' <button type="button" class="button secondary" id="skip-victory">Skip animation →</button></div>';
 $('#player').append(layer);$('#skip-victory').onclick=finishCelebration;$('#skip-victory').focus({preventScroll:true});
 return true;
}
function clearCelebration(){document.querySelector('#victory-layer')?.remove();$('#player').classList.remove('celebrating');$('#arena').inert=false;}
function finishCelebration(){if(!game?.celebration||game.celebration.finished)return;const c=game.celebration;c.finished=true;clearCelebration();c.render();}
const victoryRender=renderGame;renderGame=function(){if(!celebrationIntercept(()=>victoryRender()))victoryRender();};
const victoryGeoRender=geoRender;geoRender=function(){if(!celebrationIntercept(()=>{victoryGeoRender();fitSmartboard();}))victoryGeoRender();};
const victoryShow=show;show=function(view){if(view!=='player')clearCelebration();return victoryShow(view);};
const victoryStart=startGame;startGame=function(...args){clearCelebration();return victoryStart(...args);};
const victoryStep=stepArcade;stepArcade=function(dt){victoryStep(dt);if(ui.view!=='player')return;const c=game?.celebration;if(c&&!c.finished){c.age+=dt;if(c.age>=c.duration)finishCelebration();}if(game?.session?.phase==='counting')stepCounting(dt);};
const victoryTug=drawTug;drawTug=function(){
 const c=game.celebration;if(!c||c.finished){victoryTug();return;}terrain();
 const winner=game.rope<0?0:1,t=arcade.reduced?0:c.age;
 for(let side=0;side<2;side++)for(let i=0;i<2;i++){
  const x=side?730+i*115:370-i*115,y=205;
  cx.save();cx.translate(x,y+40);
  if(side===winner){cx.translate(0,-Math.abs(Math.sin(t*7+i*.7))*55);cx.rotate(Math.sin(t*7+i)*.14);}
  else {cx.rotate((side? -1:1)*Math.min(1,t*2)*1.35);cx.scale(1,1-Math.min(1,t*2)*.18);}
  hamster(0,-40,side?'#3578ec':'#f14060',.85,side?-1:1,side===winner&&!arcade.reduced);cx.restore();
 }
 line(260,265,840,265,'#fce0a5',7);label(teamName(winner)+' · VICTORY DANCE!',550,45,28,'#fff');
};
const victoryRacer=drawRacer;drawRacer=function(side,y,color){const c=game.celebration;if(!c||c.finished){victoryRacer(side,y,color);return;}const win=game.teams[side]===Math.max(...game.teams),t=arcade.reduced?0:c.age;hamster(130+arcade.racers[side]*760,y-(win?Math.abs(Math.sin(t*8))*28:0),color,.64,1,win&&!arcade.reduced);};
/* Counting demonstrates one-to-one correspondence, including custom totals. */
const countingScore=prScore;prScore=function(good){countingScore(good);if(good&&['countpictures','pictureadd'].includes(game.lesson.format)){const s=game.session;s.phase='counting';s.countAge=0;s.countTotal=s.values.reduce((n,v)=>n+Number(v),0);s.countStep=-1;}};
const countingRender=renderPrimary;renderPrimary=function(){
 const s=game.session;if(s.phase!=='counting'){countingRender();if(['countpictures','pictureadd'].includes(game.lesson.format)&&s.phase==='feedback')document.querySelector('.pr-win')?.remove();return;}
 const a=Number(s.values[0]),n=s.countTotal;$('#scoreboard').innerHTML='<div class="class-score"><strong>'+game.correct+' / '+game.items.length+' solved</strong><span>'+game.score+' points</span></div>';
 $('#arena').innerHTML='<section class="count-story"><h2>Let’s count them together</h2><div class="count-fruits">'+Array.from({length:n},(_,i)=>'<span class="count-fruit" data-fruit="'+i+'" aria-label="'+(i<a?'orange':'apple')+'">'+(i<a?'🍊':'🍎')+'<b></b></span>').join('')+'</div><div class="count-number" role="status" aria-live="polite"></div><button class="button secondary" id="skip-count">Skip counting →</button></section>';
 $('#skip-count').onclick=finishCounting;stepCounting(0);
};
function finishCounting(){const s=game?.session;if(s?.phase!=='counting')return;s.phase='feedback';s.message=s.countTotal+' fruits altogether!';renderGame();}
function stepCounting(dt){const s=game.session;s.countAge+=dt;const i=Math.min(s.countTotal-1,Math.floor(s.countAge/.65)),final=s.countAge>=s.countTotal*.65,number=$('.count-number');if(!number)return;
 document.querySelectorAll('[data-fruit]').forEach((el,j)=>{el.classList.toggle('count-active',j===i&&!final);el.classList.toggle('count-seen',j<=i);el.querySelector('b').textContent=j<=i?j+1:'';});number.textContent=i+1;number.classList.toggle('count-finale',final);s.countStep=i+1;if(s.countAge>=s.countTotal*.65+2)finishCounting();}
document.addEventListener('DOMContentLoaded',()=>{const state=window.render_game_to_text;window.render_game_to_text=()=>{const s=JSON.parse(state());if(game&&ui.view==='player'){s.celebration=game.celebration?{theme:game.celebration.theme,age:game.celebration.age,finished:game.celebration.finished}:null;if(game.session?.phase==='counting')s.counting={number:game.session.countStep,total:game.session.countTotal};}return JSON.stringify(s);};});
