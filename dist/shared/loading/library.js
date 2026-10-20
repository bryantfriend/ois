/* Start the existing game only after its artwork has loaded. */
document.addEventListener('DOMContentLoaded',()=>{
 const loader=window.ClassroomLoading;if(!loader)return;
 const originalStart=startGame;let launching=false;
 startGame=async function(...args){
  if(launching)return;launching=true;const lesson=draft,format=lesson?.format;
  try{
   let paths=window.ClassroomLoadingAssets?.games[format]||[];
   if(format==='lab-chess'&&typeof chessRequiredAssets==='function')paths=chessRequiredAssets();
   const ready=await loader.prepare(paths,{title:lesson?.title,onCancel:()=>show('home')});
   if(ready&&draft===lesson){const result=originalStart(...args);loader.watch(document.getElementById('player'));return result;}
  }finally{launching=false;}
 };
 for(const id of ['start-game','play-bottom']){const button=document.getElementById(id);if(button)button.onclick=()=>startGame();}
 const originalShow=show;show=function(view){if(view!=='player')loader.cancel();return originalShow(view);};
 const originalStep=stepArcade;stepArcade=function(dt){if(!loader.state.visible)originalStep(dt);};
 const originalState=window.render_game_to_text;
 if(originalState)window.render_game_to_text=()=>{const data=JSON.parse(originalState());data.loading={...loader.state};return JSON.stringify(data);};
});
