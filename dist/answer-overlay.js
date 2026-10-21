/* Retain the actual playfield nodes while existing feedback controls do their job. */
document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 const arena=document.getElementById('arena');
 let board=null,overlay=null;
 function key(){return [game.index,game.session?.round??'',game.session?.seed??''].join(':');}
 function feedback(){
  if(!game||ui.view!=='player'||game.done||game.tug)return false;
  const f=game.lesson.format,s=game.session;
  // These games already keep their playfields visible beside inline feedback.
  if(['picturevocab','mole','emotions'].includes(f)||game.lesson.id==='english-7-quiz'||game.lesson.id==='math-7-quiz'||game.lesson.settings?.starbridgeRescue)return false;
  if(f==='airplane'&&s?.courier)return false;
  if(s?.geography||s?.config?.engine==='classics'||s?.config?.engine==='boardplay')return false;
  if(s)return s.engine==='activities'&&['feedback','retry'].includes(s.phase);
  return game.answered;
 }
 function close(){
  if(!overlay)return;
  const previous=overlay;overlay=null;
  if(previous.dialog.open)previous.dialog.close();
  previous.dialog.remove();
  if(previous.background.isConnected)previous.background.replaceWith(...previous.background.childNodes);
  arena.classList.remove('has-answer-overlay');
 }
 function remember(){
  if(!game||ui.view!=='player'||game.done||feedback())return;
  board={owner:game,key:key(),nodes:[...arena.childNodes],height:arena.getBoundingClientRect().height};
 }
 const render=renderGame;
 renderGame=function(...args){
  const shouldOverlay=feedback()&&board?.owner===game&&board.key===key();
  const stamp=shouldOverlay?[key(),game.attempts,game.session?.phase].join(':'):'';
  if(shouldOverlay&&overlay?.owner===game&&overlay.stamp===stamp)return;
  close();
  const result=render(...args);
  if(!shouldOverlay||game.done){remember();return result;}
  let content=[...arena.childNodes];
  if(!game.session){const message=arena.querySelector('.feedback'),next=arena.querySelector('[data-next]');if(message&&next)content=[message,next];}
  if(!content.length)return result;
  const background=document.createElement('div');background.className='answer-overlay-board';background.inert=true;background.setAttribute('aria-hidden','true');background.append(...board.nodes);
  const dialog=document.createElement('dialog');dialog.className='answer-overlay';dialog.dataset.good=String(game.feedbackGood);dialog.setAttribute('aria-labelledby','answer-overlay-title');
  const heading=document.createElement('h2');heading.id='answer-overlay-title';heading.className='answer-overlay-title';heading.textContent=game.lesson.format==='airplane'&&game.session?.courier?(game.feedbackGood?'Delivery cleared!':'Wrong address'):game.feedbackGood?'Correct!':'Let’s take another look';
  const icon=document.createElement('div');icon.className='answer-overlay-icon';icon.setAttribute('aria-hidden','true');icon.textContent=game.feedbackGood?'✓':'↻';
  const body=document.createElement('div');body.className='answer-overlay-content';body.append(...content);
  body.querySelectorAll('h2').forEach(title=>{if(title.textContent.trim()===heading.textContent)title.remove();});
  const exit=document.createElement('button');exit.type='button';exit.className='answer-overlay-exit';exit.textContent='Back to games';
  exit.onclick=()=>leaveEditor(()=>{close();board=null;ui.collection='library';show('home');renderLibrary();});
  dialog.append(icon,heading,body,exit);
  arena.replaceChildren(background,dialog);arena.classList.add('has-answer-overlay');arena.style.setProperty('--answer-board-height',board.height+'px');
  overlay={dialog,background,owner:game,stamp};
  dialog.addEventListener('cancel',event=>{event.preventDefault();primary()?.focus();});
  function primary(){return dialog.querySelector('[data-next],[data-mode-action$="-next"],[data-mode-action="lab-retry"]');}
  dialog.showModal();
  if(dialog.scrollHeight>dialog.clientHeight){heading.tabIndex=-1;heading.focus({preventScroll:true});dialog.scrollTop=0;}
  else (primary()||exit).focus({preventScroll:true});
  return result;
 };
 const windowShow=show;
 show=function(view){if(view!=='player'){close();board=null;}return windowShow(view);};
 const start=startGame;
 startGame=function(...args){close();board=null;return start(...args);};
 const step=stepArcade;
 stepArcade=function(dt){if(overlay?.owner===game&&game.lesson.format!=='speedsort')return;return step(dt);};
 const state=window.render_game_to_text;
 window.render_game_to_text=()=>{const data=JSON.parse(state());data.answerOverlay={visible:!!overlay,correct:overlay?game.feedbackGood:null};return JSON.stringify(data);};
 window.addEventListener('pagehide',()=>{close();board=null;});
 if(ui.view==='player')remember();
});
