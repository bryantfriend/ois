(() => {
'use strict';
const $ = id => document.getElementById(id);
const key='supermarket-word-quest-v1';
const blank=()=>({coins:0,unlocked:0,counts:[0,0,0],owned:[],theme:'coral',voice:true,voiceURI:'',effects:true,gentle:false});
let saved=blank();
try{const raw=JSON.parse(localStorage.getItem(key));if(raw&&Array.isArray(raw.counts)&&raw.counts.length===3){saved={...blank(),...raw};saved.coins=Math.max(0,Number(saved.coins)||0);saved.unlocked=Math.max(0,Math.min(2,Number(saved.unlocked)||0));saved.counts=saved.counts.map(n=>Math.max(0,Math.min(8,Number(n)||0)));saved.owned=Array.isArray(saved.owned)?saved.owned:[];}}catch{}
let stage=0,round=0,correct=false,hints=0,practice=false,choices=[],target='',session=0;
const letters=['A','B','C','M','E','J','S','P'];
const words=['CUP','JAM','EGG','BAG','CAN','HAM','CAP','POT'];
const names=['Ruby the rabbit','Milo the bear','Pip the rabbit','Benny the bear'];
const labels=['Meet the letters','Letter buddies','Little words'];
const descriptions=['Match a big letter','Pair big + little letters','Read and find'];
function persist(){try{localStorage.setItem(key,JSON.stringify(saved));}catch{} }
const svg=(body)=>`<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;
const products={
APPLE:svg('<path d="M62 38C55 18 74 15 86 20C85 34 73 39 62 38" fill="#629b69"/><path d="M61 44L56 25" stroke="#75513d" stroke-width="7" stroke-linecap="round"/><path d="M60 45C20 25 8 66 25 105C39 134 51 123 61 120C77 130 94 117 102 91C114 56 92 27 60 45" fill="#ef7868"/><path d="M35 57Q23 70 30 84" fill="none" stroke="#ffc3a5" stroke-width="9" stroke-linecap="round"/>'),
BANANA:svg('<path d="M17 84Q61 122 96 37L107 43Q108 109 64 123Q28 132 10 96Z" fill="#f3ca5f" stroke="#dfaa3f" stroke-width="3"/><path d="M26 93Q70 113 98 54" fill="none" stroke="#ffe69b" stroke-width="7"/><path d="M97 38L98 24L110 27L107 43" fill="#87623c"/>'),
MILK:svg('<path d="M30 39L44 17H81L94 39V124H30Z" fill="#fffaf0" stroke="#86bac5" stroke-width="3"/><path d="M30 39H94V70H30Z" fill="#85c9d7"/><path d="M44 17L54 39H94L81 17" fill="#b4e0e6"/><path d="M30 92H94V124H30Z" fill="#82bdcc"/><circle cx="62" cy="83" r="13" fill="#e4efd6"/>'),
EGG:svg('<path d="M60 19C40 19 19 69 22 95C26 132 98 132 100 94C102 66 78 19 60 19" fill="#fff2d8" stroke="#dcbf99" stroke-width="3"/><path d="M45 42Q30 64 34 84" fill="none" stroke="#fffdf5" stroke-width="10" stroke-linecap="round"/>'),
JAM:svg('<rect x="28" y="43" width="65" height="83" rx="16" fill="#dc6871" stroke="#ad4e56" stroke-width="3"/><rect x="23" y="26" width="75" height="24" rx="7" fill="#f0ae99"/><path d="M32 28V46M49 28V46M67 28V46M84 28V46" stroke="#fff2d7" stroke-width="8"/><rect x="35" y="66" width="51" height="41" rx="8" fill="#fff9e8"/><path d="M61 78C39 70 40 90 61 100C82 90 82 69 61 78" fill="#e17a73"/><path d="M60 79L65 70" stroke="#73a177" stroke-width="5"/>'),
CUP:svg('<path d="M85 52C124 38 126 103 86 99" fill="none" stroke="#db6b59" stroke-width="15"/><path d="M19 43H89L82 106Q54 135 27 106Z" fill="#ed7e69" stroke="#d86c58" stroke-width="3"/><ellipse cx="54" cy="44" rx="35" ry="10" fill="#ac5145"/><path d="M34 64L38 98" stroke="#ffb49b" stroke-width="8" stroke-linecap="round"/>'),
BAG:svg('<path d="M28 47H95L102 123H22Z" fill="#cda578" stroke="#a57d52" stroke-width="3"/><path d="M44 52V33Q60 13 79 33V52" fill="none" stroke="#9b744c" stroke-width="7"/><path d="M40 70H83" stroke="#e9ca9c" stroke-width="6"/>'),
CAN:svg('<rect x="28" y="31" width="65" height="88" rx="7" fill="#91bc9d" stroke="#659581" stroke-width="3"/><ellipse cx="60" cy="31" rx="32" ry="9" fill="#d9e4d9" stroke="#78948c" stroke-width="3"/><ellipse cx="60" cy="119" rx="32" ry="7" fill="#bdcfc2"/><rect x="33" y="57" width="55" height="40" rx="3" fill="#f9e7ac"/><circle cx="61" cy="77" r="12" fill="#e68c65"/>'),
HAM:svg('<path d="M43 100L27 118" stroke="#fff2d9" stroke-width="18"/><circle cx="24" cy="124" r="10" fill="#fff2d9"/><path d="M32 88C-5 50 50 10 85 36C125 66 98 119 63 116Z" fill="#c98969" stroke="#a56b53" stroke-width="3"/><ellipse cx="79" cy="74" rx="26" ry="36" transform="rotate(25 79 74)" fill="#f2b7a7"/><ellipse cx="79" cy="74" rx="11" ry="19" transform="rotate(25 79 74)" fill="#e29687"/>'),
CAP:svg('<path d="M25 82C16 15 104 15 99 81" fill="#6bb1b2" stroke="#4c9098" stroke-width="3"/><path d="M22 80Q73 65 111 91Q76 109 16 95Z" fill="#8cc5bd" stroke="#4c9098" stroke-width="3"/><path d="M63 30V71" stroke="#b3dcd0" stroke-width="4"/>'),
POT:svg('<path d="M24 66C-7 54 -2 100 26 94M96 66C126 54 124 100 94 94" fill="none" stroke="#6b9698" stroke-width="9"/><path d="M22 61H98L90 113Q60 131 30 113Z" fill="#8fb9b6" stroke="#638f91" stroke-width="3"/><path d="M19 61Q61 33 101 61Z" fill="#b9d2c6" stroke="#638f91" stroke-width="3"/><path d="M54 47V39H67V47" fill="#628b89"/>')};
function animal(bear=false){return svg(`<ellipse cx="60" cy="127" rx="41" ry="37" fill="${bear?'#679e8b':'#ec8a79'}"/>${bear?'<circle cx="28" cy="39" r="18" fill="#b77d52"/><circle cx="93" cy="39" r="18" fill="#b77d52"/>':'<ellipse cx="39" cy="31" rx="15" ry="31" fill="#fff8e9"/><ellipse cx="81" cy="31" rx="15" ry="31" fill="#fff8e9"/><ellipse cx="39" cy="30" rx="7" ry="22" fill="#f1b6a5"/><ellipse cx="81" cy="30" rx="7" ry="22" fill="#f1b6a5"/>'}<ellipse cx="60" cy="74" rx="46" ry="43" fill="${bear?'#c28b5c':'#fff8e9'}"/><ellipse cx="60" cy="91" rx="24" ry="18" fill="${bear?'#e9c89b':'#fff8e9'}"/><ellipse cx="44" cy="70" rx="5" ry="7" fill="#344846"/><ellipse cx="77" cy="70" rx="5" ry="7" fill="#344846"/><ellipse cx="30" cy="88" rx="9" ry="6" fill="#edaa92"/><ellipse cx="90" cy="88" rx="9" ry="6" fill="#edaa92"/><path d="M53 84Q60 77 67 84Q63 93 60 92Q57 92 53 84" fill="#7f5849"/><path d="M51 96Q60 108 70 96" fill="none" stroke="#7f5849" stroke-width="3" stroke-linecap="round"/><path d="M42 117H80V140H42Z" fill="${bear?'#3d8074':'#ffd78b'}"/><circle cx="61" cy="129" r="6" fill="#fff6dd"/>`);}
let voices=[],activeVoice=null,speechToken=0,pendingSpeech='',audioContext;
const reducedMotion=()=>saved.gentle||window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// The Web Speech API exposes names and languages, not a gender field.
function voiceScore(v){if(!/^en(?:-|_)/i.test(v.lang))return -1000;let score=0;const name=v.name.toLowerCase();if(/female|zira|samantha|victoria|karen|moira|tessa|susan|hazel|aria|jenny|sonia|ava/.test(name))score+=100;if(/google.*female/.test(name))score+=100;if(/natural|neural|premium|enhanced/.test(name))score+=60;if(/google us english/.test(name))score+=85;if(/male|david|mark|george|daniel|james/.test(name)&&!/female/.test(name))score-=160;if(/en[-_]us/i.test(v.lang))score+=10;return score;}
function loadVoices(){
 if(!('speechSynthesis' in window)){ $('voice-info').textContent='Speech is not available in this browser. The game still works without audio.';$('voice-preview').disabled=true;return; }
 voices=speechSynthesis.getVoices().filter(v=>/^en(?:-|_)/i.test(v.lang));
 activeVoice=voices.find(v=>v.voiceURI===saved.voiceURI)||[...voices].sort((a,b)=>voiceScore(b)-voiceScore(a))[0]||null;
 const select=$('voice-choice');select.replaceChildren(new Option('Automatic · prefer a female English voice',''));
 [...voices].sort((a,b)=>voiceScore(b)-voiceScore(a)).forEach(v=>select.add(new Option(`${v.name} (${v.lang})`,v.voiceURI)));
 select.value=voices.some(v=>v.voiceURI===saved.voiceURI)?saved.voiceURI:'';
 $('voice-info').textContent=activeVoice?`Using ${activeVoice.name}. Try the voice on your smartboard; available voices come from Chrome and the connected device.`:'Waiting for Chrome’s voices. Tap the speaker to enable audio. If no English voice appears, enable English text-to-speech on the connected device.';
 if(pendingSpeech&&activeVoice){const text=pendingSpeech;pendingSpeech='';say(text);}
}
function say(text){
 if(!saved.voice||!('speechSynthesis' in window))return;
 if(!activeVoice){loadVoices();if(!activeVoice){pendingSpeech=text;return;}}
 try{const token=++speechToken;speechSynthesis.cancel();$('customer').classList.remove('speaking');const utterance=new SpeechSynthesisUtterance(text);utterance.voice=activeVoice;utterance.lang=activeVoice.lang;utterance.rate=.93;utterance.pitch=1;
 utterance.onstart=()=>{if(token===speechToken)$('customer').classList.add('speaking');};
 const finish=()=>{if(token===speechToken)$('customer').classList.remove('speaking');};utterance.onend=finish;utterance.onerror=finish;speechSynthesis.speak(utterance);
 }catch{$('customer').classList.remove('speaking');}
}
function animateOnce(element,name){element.classList.remove(name);void element.offsetWidth;element.classList.add(name);element.addEventListener('animationend',()=>element.classList.remove(name),{once:true});}
function particle(text,x,y,dx,dy,kind='spark'){if(reducedMotion())return;const p=document.createElement('span');p.className=`particle ${kind}`;p.textContent=text;p.style.left=x+'px';p.style.top=y+'px';p.style.setProperty('--dx',dx+'px');p.style.setProperty('--dy',dy+'px');p.style.setProperty('--turn',(Math.random()*120-60)+'deg');$('effects-layer').append(p);p.addEventListener('animationend',()=>p.remove(),{once:true});setTimeout(()=>p.remove(),2200);}
function rewardAnimation(button){animateOnce($('customer'),'happy');animateOnce($('helper'),'happy');animateOnce(button,'reward-pop');animateOnce(document.querySelector('.wallet'),'coin-pop');const box=button.getBoundingClientRect(),wallet=document.querySelector('.wallet').getBoundingClientRect();const x=box.x+box.width/2,y=box.y+box.height/2;particle('★',x,y,wallet.x+wallet.width/2-x,wallet.y+wallet.height/2-y,'flying-coin');for(let i=0;i<12;i++){const a=i*Math.PI/6;particle(i%2?'✦':'★',x,y,Math.cos(a)*90,Math.sin(a)*75-30);}chime();}
function confetti(){if(reducedMotion())return;for(let i=0;i<40;i++){particle(['★','●','✦','■'][i%4],innerWidth*(.15+Math.random()*.7),innerHeight*.18,(Math.random()-.5)*400,innerHeight*.7,'confetti');}chime(true);}
function chime(big=false){if(!saved.effects)return;try{audioContext ||= new (window.AudioContext||window.webkitAudioContext)();audioContext.resume().catch(()=>{});const now=audioContext.currentTime;[523.25,659.25,...(big?[783.99,1046.5]:[])].forEach((freq,i)=>{const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type='sine';osc.frequency.value=freq;gain.gain.setValueAtTime(0,now+i*.09);gain.gain.linearRampToValueAtTime(.035,now+i*.09+.01);gain.gain.exponentialRampToValueAtTime(.001,now+i*.09+.24);osc.connect(gain);gain.connect(audioContext.destination);osc.start(now+i*.09);osc.stop(now+i*.09+.25);});}catch{} }
function promptText(){return stage===0?`Find the letter ${target}.`:stage===1?`Find the little letter ${target}.`:`Find the ${target.toLowerCase()}.`;}
function shuffle(arr){for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;}
function updateChrome(){
 $('coins').textContent=saved.coins;document.body.classList.remove('sunshine','berry');if(saved.theme!=='coral')document.body.classList.add(saved.theme);document.body.classList.toggle('gentle',saved.gentle);
 $('sound').textContent=saved.voice?'♫ Voice on':'♫ Voice off';$('sound').setAttribute('aria-label',saved.voice?'Turn voice off':'Turn voice on');
 $('stages').innerHTML=labels.map((s,i)=>`<button data-stage="${i}" ${i>saved.unlocked&&!practice?'disabled':''} class="${i===stage?'active':''}" ${i===stage?'aria-current="step"':''}><span class="step">${i>saved.unlocked&&!practice?'▧':i+1}</span><span>${s}<small>${descriptions[i]}</small></span></button>`).join('');
 $('stages').querySelectorAll('button').forEach(b=>b.onclick=()=>{stage=Number(b.dataset.stage);round=saved.counts[stage]<8?saved.counts[stage]:0;newRound();});
 $('plant').innerHTML=saved.owned.includes('plant')?svg('<path d="M60 106V38" stroke="#6c9a64" stroke-width="5"/><ellipse cx="41" cy="63" rx="15" ry="29" transform="rotate(-40 41 63)" fill="#79ab72"/><ellipse cx="78" cy="53" rx="15" ry="29" transform="rotate(35 78 53)" fill="#95bb7d"/><path d="M31 95H91L80 138H43Z" fill="#dca37d"/>'):'';
}
function newRound(){
 session++;correct=false;hints=0;target=(stage===2?words:letters)[round];
 const pool=stage===2?words:letters;choices=shuffle([target,...shuffle(pool.filter(x=>x!==target)).slice(0,2)]);
 updateChrome();$('round-label').textContent=`VISIT ${round+1} / 8`;$('target').textContent=target;
 $('task-label').textContent=stage===2?'READ MY SHOPPING REQUEST':'MY LETTER TODAY';
 $('instruction').textContent=stage===0?'Find the same letter.':stage===1?'Find its little letter.':'Which one will go in my basket?';
 $('feedback').textContent=stage===2?'Read the word. Choose the matching item.':'Take your time. You can do this!';
 $('customer').innerHTML=animal(round%2===1);$('helper').innerHTML=animal(round%2===0);
 for(const id of ['customer','helper']){const art=$(id).querySelector('svg');art.querySelectorAll('ellipse[fill="#344846"]').forEach(eye=>eye.classList.add('eye'));art.insertAdjacentHTML('beforeend','<g class="waving-arm"><path d="M91 126Q110 123 110 104" fill="none" stroke="'+(id==='customer'?(round%2?'#c28b5c':'#fff8e9'):(round%2?'#fff8e9':'#c28b5c'))+'" stroke-width="13" stroke-linecap="round"/></g>');}
 animateOnce($('customer'),'arriving');animateOnce(document.querySelector('.request'),'bubble-pop');
 $('customer-name').textContent=`Shopping with ${names[round%4]}`;
 $('shelves').innerHTML=['APPLE','BANANA','MILK','EGG','JAM','CUP'].map(x=>products[x]).join('');
 $('choices').innerHTML=choices.map((x,i)=>`<button class="choice" data-answer="${x}" aria-label="${stage===2?x.toLowerCase():stage===1?x.toLowerCase():x}">${stage===2?products[x]:stage===1?x.toLowerCase():x}<span class="key">${i+1}</span></button>`).join('');
 $('choices').querySelectorAll('button').forEach(b=>b.onclick=()=>answer(b.dataset.answer));
 [...$('choices').children].forEach((b,i)=>{b.style.animationDelay=i*.07+'s';b.classList.add('card-arrive');});
 $('next').hidden=true;$('hint').hidden=false;
 $('progress-label').textContent=`${labels[stage]} · ${round} of 8 helped`;
 $('dots').innerHTML=Array.from({length:8},(_,i)=>`<span class="${i<round?'done':''}"></span>`).join('');
 say(promptText());
}
function answer(value){
 if(correct)return;const button=[...$('choices').children].find(b=>b.dataset.answer===value);if(!button)return;
 if(value!==target){button.classList.remove('wrong');void button.offsetWidth;button.classList.add('wrong');$('feedback').textContent=stage===2?'Let’s try another item. Tap ♪ to hear the word.':'Look at the letter again. Try another one.';say('Have another try. '+promptText());return;}
 correct=true;button.classList.add('correct');[...$('choices').children].forEach(b=>b.disabled=true);
 saved.coins+=1;saved.counts[stage]=Math.max(saved.counts[stage],round+1);persist();updateChrome();
 $('feedback').textContent=`You found ${stage===1?target.toLowerCase():target}! One coin for helping. ★`;
 $('next').hidden=false;$('hint').hidden=true;$('next').textContent=round===7?'Finish this stage ★':'Next customer →';
 $('progress-label').textContent=`${labels[stage]} · ${round+1} of 8 helped`;
 $('dots').children[round].classList.add('done');rewardAnimation(button);say('Lovely! '+(stage===2?target.toLowerCase():target));
}
function next(){if(!correct)return;if(round<7){round++;newRound();return;}saved.unlocked=Math.min(2,Math.max(saved.unlocked,stage+1));persist();updateChrome();$('complete-title').textContent=stage===2?'You’re a word explorer!':'Look how much you learned!';$('complete-copy').textContent=stage===0?'Eight happy customers! Next, meet the little letters.':stage===1?'Your letter buddies are ready. Let’s read some little words!':'You helped eight friends read their shopping lists. Play again or decorate your shop.';$('continue').textContent=stage===2?'Shop again →':`Try ${labels[stage+1].toLowerCase()} →`;$('complete').showModal();}
 $('next').onclick=next;
 $('complete').addEventListener('close',()=>{$('effects-layer').replaceChildren();});
 new MutationObserver(()=>{if($('complete').open)confetti();}).observe($('complete'),{attributes:true,attributeFilter:['open']});
 $('continue').onclick=()=>{$('complete').close();stage=Math.min(2,stage+1);round=0;newRound();};
 $('listen').onclick=()=>say(promptText());
 $('hint').onclick=()=>{hints++;$('feedback').textContent=stage===2?`Say it slowly: ${target.split('').join(' · ')}. Then listen to the whole word.`:`Look for ${stage===1?target.toLowerCase():target}. Match the letter shape.`;if(hints>1){[...$('choices').children].find(b=>b.dataset.answer===target).classList.add('hinted');$('feedback').textContent='Here’s a little clue: try the golden card.';}say(promptText());};
 $('sound').onclick=()=>{saved.voice=!saved.voice;if(!saved.voice){pendingSpeech='';speechToken++;$('customer').classList.remove('speaking');if('speechSynthesis' in window)speechSynthesis.cancel();}persist();updateChrome();if(saved.voice)say(promptText());};
 $('voice-choice').onchange=e=>{saved.voiceURI=e.target.value;persist();loadVoices();say('Hello, little shopkeeper! Let’s find some letters together.');};
 $('voice-preview').onclick=()=>{saved.voice=true;persist();updateChrome();say('Hello, little shopkeeper! Can you find the letter B? Lovely! Now find the cup.');};
 $('effects').checked=saved.effects;$('effects').onchange=e=>{saved.effects=e.target.checked;persist();if(saved.effects)chime();};
 $('motion').checked=saved.gentle;$('motion').onchange=e=>{saved.gentle=e.target.checked;persist();updateChrome();if(saved.gentle)$('effects-layer').replaceChildren();};
 const decors=[{id:'plant',name:'A leafy shop plant',cost:3},{id:'sunshine',name:'Sunshine yellow awning',cost:5},{id:'berry',name:'Berry purple awning',cost:5}];
 function decorMenu(){ $('decor-options').innerHTML=decors.map(d=>`<button data-decor="${d.id}" ${!saved.owned.includes(d.id)&&saved.coins<d.cost?'disabled':''}><span>${d.name}</span><span>${saved.owned.includes(d.id)?(saved.theme===d.id||d.id==='plant'?'✓ In your shop':'Use this'):d.cost+' ★'}</span></button>`).join('');$('decor-options').querySelectorAll('button').forEach(b=>b.onclick=()=>{const d=decors.find(x=>x.id===b.dataset.decor);if(!saved.owned.includes(d.id)){if(saved.coins<d.cost)return;saved.coins-=d.cost;saved.owned.push(d.id);}if(d.id!=='plant')saved.theme=d.id;persist();updateChrome();animateOnce(document.querySelector('.shop'),'shop-glow');chime();decorMenu();});}
 $('decorate').onclick=()=>{decorMenu();$('decoration').showModal();};$('decoration').querySelector('.close').onclick=()=>$('decoration').close();
 $('practice').onchange=e=>{practice=e.target.checked;updateChrome();};
 $('reset').onclick=()=>{if(!confirm('Start fresh? This clears coins, decorations, and learning progress on this device.'))return;saved={...blank(),voiceURI:saved.voiceURI,voice:saved.voice,effects:saved.effects,gentle:saved.gentle};practice=false;$('practice').checked=false;persist();stage=0;round=0;newRound();};
 function fullscreen(){if(document.fullscreenElement)document.exitFullscreen?.().catch(()=>{});else document.documentElement.requestFullscreen?.().catch(()=>{});}
 $('fullscreen').onclick=fullscreen;
 document.addEventListener('keydown',e=>{if(e.target.matches('input,summary,select')||document.querySelector('dialog[open]'))return;if(['1','2','3'].includes(e.key)){e.preventDefault();answer(choices[Number(e.key)-1]);}if(e.key==='Enter'&&correct){e.preventDefault();next();}if(e.key.toLowerCase()==='f')fullscreen();});
 window.render_game_to_text=()=>JSON.stringify({mode:document.querySelector('dialog[open]')?.id||'shopping',stage,stageName:labels[stage],round:round+1,target,choices:choices.map((value,i)=>({value,keyboard:i+1})),correct,hints,coins:saved.coins,unlocked:saved.unlocked,counts:saved.counts,decorations:saved.owned,voice:saved.voice,selectedVoice:activeVoice?.name||null,gentle:saved.gentle,effects:saved.effects,coordinateSystem:'DOM layout; origin top left, x right, y down'});
 window.advanceTime=()=>Promise.resolve();
 loadVoices();if('speechSynthesis' in window)speechSynthesis.addEventListener('voiceschanged',loadVoices);
 newRound();
})();
