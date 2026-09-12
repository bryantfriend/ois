// The launch screen keeps team configuration separate from lesson editing.
let boozledSetup=null;
function openTeamSetup(){
 boozledSetup={count:draft.settings.teamCount||2,names:[...(draft.settings.teamNames||['Red','Blue','Green','Yellow','Purple','Orange'])]};
 $('#boozled-setup-name').textContent=FORMATS[draft.format].name;$('#boozled-setup-emoji').textContent=FORMATS[draft.format].icon;
 renderBoozledSetup();$('#boozled-setup').showModal();$('#boozled-setup-title').focus();
}
function renderBoozledSetup(){
 const s=boozledSetup;
 $('#boozled-team-counts').innerHTML=[2,3,4,5,6].map(n=>`<button type="button" data-boozled-count="${n}" aria-pressed="${n===s.count}">${n}<small>teams</small></button>`).join('');
 $('#boozled-team-names').innerHTML=Array.from({length:s.count},(_,i)=>`<label style="--team:${TEAM_COLORS[i]}">Team ${i+1}<input data-boozled-name="${i}" maxlength="30" value="${esc(s.names[i]||'')}" placeholder="${['Red','Blue','Green','Yellow','Purple','Orange'][i]}" autocomplete="off"></label>`).join('');
 $('#boozled-team-counts').onclick=e=>{const b=e.target.closest('[data-boozled-count]');if(!b)return;s.count=Number(b.dataset.boozledCount);renderBoozledSetup();$('#boozled-team-counts').querySelector('[aria-pressed="true"]').focus();};
 $('#boozled-team-names').oninput=e=>{if(e.target.hasAttribute('data-boozled-name'))s.names[Number(e.target.dataset.boozledName)]=e.target.value;};
 $('#boozled-continue').onclick=()=>applyBoozledSetup(true);
 $('#boozled-edit-questions').onclick=()=>applyBoozledSetup(false);
 const cancel=()=>{$('#boozled-setup').close();show('home');renderLibrary();document.querySelector('[data-edit="'+CSS.escape(draft.id)+'"]')?.focus();};
 $('#boozled-setup-back').onclick=cancel;$('#boozled-setup').oncancel=e=>{e.preventDefault();cancel();};
}
function applyBoozledSetup(play){
 const s=boozledSetup,defaults=['Red','Blue','Green','Yellow','Purple','Orange'];
 draft.settings={...draft.settings,teamCount:s.count,teamNames:Array.from({length:s.count},(_,i)=>s.names[i]?.trim()||defaults[i])};
 setupModeEditor();dirty=true;$('#boozled-setup').close();if(play)startGame();else $('#editor-title').focus();
}
