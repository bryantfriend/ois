// Recover space from decorative artwork before allowing long lesson content to scroll.
let boardFitFrame=0;
function fitSmartboard(){
 cancelAnimationFrame(boardFitFrame);const player=$('#player');player.classList.remove('board-dense');
 if(!game||ui.view!=='player'||innerWidth<1024)return;
 player.style.setProperty('--team-count',game.session?.groups?.length||4);
 boardFitFrame=requestAnimationFrame(()=>{const arena=$('#arena');if(arena.scrollHeight>arena.clientHeight+2)player.classList.add('board-dense');});
}
const boardRender=renderGame;renderGame=function(){boardRender();fitSmartboard();};
window.addEventListener('resize',fitSmartboard);document.addEventListener('fullscreenchange',fitSmartboard);
fitSmartboard();
