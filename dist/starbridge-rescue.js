/* Integer operations power a crew rescue. Quiz scoring and teacher decks stay shared. */
(() => {
 'use strict';
 const NAME='Starbridge Rescue',ID='math-7-quiz',SHIP={x:300,y:158,width:144,height:76};
 const view=()=>innerWidth<761?{width:600,shipX:150,podX:430,stationX:540,mobile:true}:{width:1100,shipX:300,podX:780,stationX:967,mobile:false};
 const active=(lesson=game?.lesson)=>lesson?.format==='quiz'&&(lesson.id===ID||lesson.settings?.starbridgeRescue===true||lesson.title==='Integer Sprint');
 const oldValidate=validateLesson;validateLesson=function(raw){const rescue=active(raw),lesson=oldValidate(raw);if(rescue)lesson.settings.starbridgeRescue=true;return lesson;};
 for(const lesson of saved)if(lesson.format==='quiz'&&lesson.title==='Integer Sprint'){lesson.title=NAME;lesson.settings={...lesson.settings,starbridgeRescue:true};}
 function state(){
  if(!active())return null;
  const s=game.starbridge ||= {time:0,age:0,event:'search',seen:0,question:game.index,paused:false};
  if(s.question!==game.index){s.question=game.index;s.event='search';s.age=0;}
  if(s.seen!==game.attempts){s.seen=game.attempts;s.event=game.feedbackGood?'rescue':'impact';s.age=0;}
  return s;
 }
 const duration=s=>arcade.reduced?0:s.event==='rescue'?2.2:s.event==='impact'?1.45:0;
 const busy=s=>s&&s.age<duration(s);
 const recovered=s=>Math.max(0,game.correct-(s.event==='rescue'&&!arcade.reduced&&s.age<1.55?1:0));
 const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
 function text(value,x,y,size=16,color='#c8eaf2',align='left'){label(value,x,y,size,color,align);}
 function rock(x,y,r,rotation=0,alpha=1){
  cx.save();cx.globalAlpha=alpha;cx.translate(x,y);cx.rotate(rotation);
  polygon([[-r,-r*.2],[-r*.45,-r*.8],[r*.35,-r],[r*.88,-r*.3],[r*.7,r*.55],[-r*.25,r*.85],[-r*.9,r*.4]],'#506479');
  polygon([[-r*.8,-r*.2],[-r*.3,-r*.65],[r*.4,-r*.7],[r*.1,-r*.06]],'#8192a0');circle(r*.3,r*.3,r*.18,'#344b62');circle(-r*.38,r*.05,r*.15,'#3d5369');cx.restore();
 }
 function pod(x,y,age=0,lit=true){
  cx.save();cx.translate(x,y);if(!arcade.reduced)cx.rotate(Math.sin(age*2)*.045);
  ellipse(0,26,29,5,'#04132255');box(-24,-30,48,59,12,'#c7e3e6');box(-16,-18,32,28,10,lit?'#4dd9ce':'#486b82');
  circle(0,-7,7,'#ffdbad');ellipse(0,7,11,8,'#1d4970');box(-21,-30,42,7,3,'#f5b953');box(-21,23,42,7,3,'#e6a63e');
  line(-30,-15,-30,12,'#729cb1',5);line(30,-15,30,12,'#729cb1',5);circle(0,-37,4,lit?'#8affd7':'#f3ae64');cx.restore();
 }
 function ship(s){
  const impact=s.event==='impact'&&!arcade.reduced&&s.age<.5,shake=impact?Math.sin(s.age*75)*5*(1-s.age/.5):0;
  const y=SHIP.y+(arcade.reduced?0:Math.sin(s.time*2)*3);
  cx.save();cx.translate(view().shipX+shake,y); // No scaling: hull geometry is identical on every answer.
  const boost=s.event==='rescue'&&s.age<.65;
  const flame=arcade.reduced?31:31+Math.sin(s.time*28)*7+(boost?24:0);
  polygon([[-61,-21],[-70-flame,-12],[-61,-2]],'#e5953e');polygon([[-61,3],[-70-flame,13],[-61,23]],'#e5953e');
  polygon([[-61,-17],[-64-flame*.7,-12],[-61,-6]],'#b4ffff');polygon([[-61,7],[-64-flame*.7,13],[-61,19]],'#b4ffff');
  polygon([[-49,-21],[-25,-38],[17,-32],[33,-16]],'#3b7790');polygon([[-49,21],[-25,38],[17,32],[33,16]],'#3b7790');
  polygon([[-66,-20],[-22,-28],[40,-22],[78,0],[40,22],[-22,28],[-66,20]],'#e3eef0');
  polygon([[-62,12],[34,14],[66,0],[78,0],[40,22],[-22,28],[-66,20]],'#91b5c4');
  box(-55,-26,26,14,4,'#e6a73d');box(-55,12,26,14,4,'#e6a73d');
  polygon([[8,-17],[36,-14],[55,0],[8,0]],'#17425d');polygon([[13,-13],[34,-10],[42,-5],[13,-5]],'#73e9e2');
  box(-18,-13,20,29,4,'#506e7d');line(-8,-8,-8,10,'#a4d8d7',2);
  const cargoLit=s.event==='rescue'&&s.age>=1.55;circle(-7,2,5,cargoLit?'#a6ffad':'#f2c66a');
  line(58,-3,72,-3,'#f6c36c',3);cx.restore();
  return {x:view().shipX+shake,y};
 }
 function station(s){
  const camera=view();cx.save();cx.translate(camera.stationX,152);cx.globalAlpha=.7;
  line(-70,0,65,0,'#597387',13);box(-24,-35,48,70,8,'#66899a');box(-20,-21,40,42,6,'#263e55');
  for(const dx of [-66,66]){box(dx-16,-48,32,34,3,'#274f73');box(dx-16,14,32,34,3,'#274f73');line(dx,-46,dx,-17,'#88a9b6',2);line(dx,17,dx,46,'#88a9b6',2);}
  circle(0,0,12,'#efa658');cx.restore();
  if(!camera.mobile)text('DISABLED RESEARCH STATION',camera.stationX,222,11,'#8eaec3','center');
 }
 function status(s){
  const amount=recovered(s),total=game.items.length,camera=view();
  const caption=s.paused?'MISSION PAUSED':game.done?'RESCUE SWEEP COMPLETE':s.event==='rescue'?(s.age<1.55&&!arcade.reduced?'TRACTOR BEAM · RECOVERING CREW':'CREW POD SECURED'):s.event==='impact'?'SHIELD HELD · BEACON STILL ACTIVE':'SOS SIGNAL DETECTED';
  box(20,14,camera.width-40,camera.mobile?62:40,12,'#0b2033dc');text(caption,38,35,camera.mobile?19:16,s.event==='impact'?'#ffd194':'#a7f4e7');text(amount+' / '+total+' PODS ABOARD',camera.width-40,camera.mobile?61:35,camera.mobile?19:16,'#fff2bf','right');
  for(let i=0;i<Math.min(total,12);i++){
   const item=game.history[i],pending=i===game.index&&s.event==='rescue'&&s.age<1.55&&!arcade.reduced;
   const fill=item?.correct&&!pending?'#88e7b9':item&&!item.correct?'#c78b5a':'#2a465c';
   box(28+i*28,263,20,12,4,fill);if(item&&!item.correct){line(34+i*28,266,42+i*28,272,'#ffdeb2',2);}
  }
  if(!camera.mobile)text('Correct → recover a pod   ·   Incorrect → shield impact',1060,270,13,'#b2cdda','right');
 }
 function draw(s){
  const camera=view(),shipX=camera.shipX,podX=camera.podX;
  const gradient=cx.createLinearGradient(0,0,camera.width,300);gradient.addColorStop(0,'#0c2039');gradient.addColorStop(.6,'#16394a');gradient.addColorStop(1,'#24345a');cx.fillStyle=gradient;cx.fillRect(0,0,camera.width,300);
  for(let i=0;i<65;i++){const speed=i%3?7:18,x=(i*137+63-s.time*speed)%(camera.width+50);circle(x<0?x+camera.width+50:x,65+(i*47)%180,i%5===0?1.8:1,'#bfdfed80');}
  station(s);
  for(let i=0;i<7;i++){const span=camera.width+230,x=((i*231+15-s.time*22)%span+span)%span-90;rock(x,i%2?239:85,12+i%3*6,i*.8+s.time*.1,.5);}
  const moving=s.event==='rescue'&&!arcade.reduced&&s.age<1.55;
  const showPod=!game.done&&(s.event!=='rescue'||moving);
  if(s.event==='rescue'&&(moving||arcade.reduced)){
   const pull=ease((s.age-.45)/1.1),x=podX+(shipX-podX)*pull,y=155-Math.sin(pull*Math.PI)*27;
   if(!arcade.reduced){cx.save();cx.globalAlpha=Math.max(0,Math.min(1,s.age*4))*(1-pull*.8);polygon([[shipX+50,145],[x+10,y-35],[x+10,y+35],[shipX+50,170]],'#70f9dc38');line(shipX+55,155,x,y,'#a3ffdf',2);for(let i=0;i<5;i++){const wave=(s.age*1.6+i*.2)%1;cx.strokeStyle='#8dffe888';cx.lineWidth=2;cx.beginPath();cx.ellipse(shipX+70+wave*(x-shipX-70),155,7,12+wave*14,0,0,Math.PI*2);cx.stroke();}cx.restore();}
   if(showPod)pod(x,y,s.time,true);
  }else if(showPod){pod(podX,155+(arcade.reduced?0:Math.sin(s.time*1.6)*5),s.time,true);if(s.event==='search'){text('SOS',podX,104,15,'#ffd98f','center');line(podX-28,122,podX-35,122,'#f4ca77',2);line(podX+27,122,podX+35,122,'#f4ca77',2);}}
  if(s.event==='impact'&&!arcade.reduced&&s.age<1.45){
   const t=s.age,arrival=Math.min(1,t/.28);if(t<.28)rock(shipX+370-260*arrival,80+75*arrival,20,t*7);
   cx.save();cx.globalAlpha=Math.max(0,1-t/1.45);cx.strokeStyle='#74dbff';cx.lineWidth=4;cx.beginPath();cx.ellipse(shipX+9,SHIP.y,99,61,0,-1.45,1.45);cx.stroke();
   if(t>.2)for(let i=0;i<13;i++){const a=-1.8+i*.27,r=(t-.2)*150;line(shipX+97+Math.cos(a)*r,155+Math.sin(a)*r,shipX+105+Math.cos(a)*(r+16),155+Math.sin(a)*(r+16),i%2?'#ffd994':'#83f0ee',3);}
   cx.restore();
  }
  ship(s);
  if(s.event==='rescue'&&(arcade.reduced||s.age>=1.55)){
   if(!arcade.reduced&&s.age<2.2){cx.save();cx.globalAlpha=1-(s.age-1.55)/.65;cx.strokeStyle='#acffd9';cx.lineWidth=3;cx.beginPath();cx.arc(shipX,SHIP.y,45+(s.age-1.55)*80,0,Math.PI*2);cx.stroke();cx.restore();}
   text('CREW SECURED',shipX,224,camera.mobile?20:15,'#bbffdc','center');
  }
  if(game.done){text(game.correct===game.items.length?'Every crew pod is safe aboard!':'Unrecovered pods are still broadcasting. Replay to reach them.',675,140,17,'#e7f8e8','center');}
  status(s);
  if(s.paused){box(camera.width/2-143,113,286,70,16,'#091b2bf2');text('MISSION PAUSED',camera.width/2,149,22,'#e4f7eb','center');}
 }
 const briefing=document.createElement('div');briefing.className='starbridge-briefing';briefing.hidden=true;
 briefing.innerHTML='<strong>RESCUE THE STRANDED CREW</strong><span>Use integer answers to tractor crew pods out of the asteroid field.</span>';
 cv.before(briefing);
 const pause=document.createElement('button');pause.id='starbridge-pause';pause.textContent='Pause mission';pause.hidden=true;pause.setAttribute('aria-pressed','false');controls.prepend(pause);
 pause.onclick=()=>{const s=state();if(!s||game.done)return;s.paused=!s.paused;pause.textContent=s.paused?'Resume mission':'Pause mission';pause.setAttribute('aria-pressed',String(s.paused));$('#arena').inert=s.paused;if(s.paused)window.ClassroomVoice?.cancel?.();renderArcade();};
 function updateControls(){
  const s=state();if(!s)return;const next=$('#arena [data-next]');
  if(next){next.disabled=busy(s);next.textContent=busy(s)?s.event==='rescue'?'Recovering crew…':'Shield stabilising…':game.index===game.items.length-1?'See rescue report →':'Next rescue beacon →';}
 }
 function decorate(){
  const enabled=active();$('#player').classList.toggle('starbridge-rescue',enabled);briefing.hidden=!enabled;pause.hidden=!enabled;
  if(!enabled)return;
  const s=state();pause.disabled=game.done;pause.textContent=s.paused?'Resume mission':'Pause mission';pause.setAttribute('aria-pressed',String(s.paused));
  $('#play-format').textContent='INTEGER OPERATIONS · SOLO RESCUE';$('#player').style.setProperty('--world','#176d80');$('#player').style.setProperty('--spark','#86e8d1');
  const feedback=$('#arena .feedback');if(feedback&&!feedback.querySelector('.starbridge-feedback')){const p=document.createElement('p');p.className='starbridge-feedback';p.textContent=game.feedbackGood?'Tractor beam locked. Bringing this crew pod aboard.':'The shield absorbed the debris. This rescue beacon stays active for your next mission.';feedback.append(p);}
  const result=$('#arena .result');if(result&&!result.querySelector('.starbridge-report')){
   const report=document.createElement('div');report.className='starbridge-report';const missing=game.items.length-game.correct;
   report.innerHTML='<strong>'+game.correct+' / '+game.items.length+' crew pods rescued</strong><p>'+(missing?missing+' rescue '+(missing===1?'beacon is':'beacons are')+' still active. Replay the mission to bring everyone home.':'Every crew is safe aboard the rescue ship. All beacons cleared!')+'</p>';result.prepend(report);
   result.querySelector('h2').textContent=missing?'Rescue sweep complete':'All crews aboard!';
  }
  const caption=$('#victory-layer .victory-caption');if(caption&&caption.firstChild?.nodeType===Node.TEXT_NODE)caption.firstChild.textContent=game.correct+' / '+game.items.length+' crew pods recovered! ';
  updateControls();
 }
 const oldRenderArcade=renderArcade;renderArcade=function(){
  if(!active()||ui.view!=='player')return oldRenderArcade();
  const width=view().width,scale=Math.min(3,Math.max(1,Math.ceil(cv.clientWidth/width*(devicePixelRatio||1))));
  if(cv.width!==width*scale||cv.height!==300*scale){cv.width=width*scale;cv.height=300*scale;}
  cx.setTransform(scale,0,0,scale,0,0);syncArcade();draw(state());updateControls();
 };
 drawCanvas=renderArcade;
 const oldStep=stepArcade;stepArcade=function(dt){
  const s=state();if(s?.paused)return;oldStep(dt);if(!s)return;
  if(!arcade.reduced)s.time+=dt;s.age=Math.min(10,s.age+dt);updateControls();
 };
 const oldNext=nextRound;nextRound=function(){if(active()&&(busy(state())||state().paused))return;return oldNext();};
 const oldAward=award;award=function(correct){if(active()&&state().paused)return;return oldAward(correct);};
 const oldRender=renderGame;renderGame=function(){oldRender();decorate();};
 const oldFinish=finishCelebration;finishCelebration=function(){oldFinish();if(active())decorate();};
 const oldShow=show;show=function(view){if(view!=='player'){$('#player').classList.remove('starbridge-rescue');briefing.hidden=true;pause.hidden=true;}return oldShow(view);};
 function decorateEditor(){if(!active(draft))return;$('#format-name').textContent=NAME;$('#format-icon').textContent='🛰';$('#format-instructions').textContent='Rescue crew pods from an asteroid field. Correct integer answers activate a tractor beam; incorrect answers trigger the shield and leave a beacon for the next mission. Recover every pod for a complete rescue. Quiz points and streak bonuses still apply.';}
 const oldEditor=openEditor;openEditor=function(lesson){if(active(lesson))lesson={...lesson,title:lesson.title==='Integer Sprint'?NAME:lesson.title,settings:{...lesson.settings,starbridgeRescue:true}};oldEditor(lesson);decorateEditor();};
 const oldLibrary=renderLibrary;renderLibrary=function(){oldLibrary();document.querySelectorAll('.game-card').forEach(card=>{const id=card.querySelector('[data-edit]')?.dataset.edit,lesson=findLesson(id);if(!active(lesson))return;card.classList.add('starbridge-card');card.querySelector('.format-tag').textContent=NAME;card.querySelector('.preview-character').textContent='🛰️';card.querySelector('.preview-small').textContent='🧑‍🚀';});};
 const previousState=window.render_game_to_text;window.render_game_to_text=()=>{const payload=JSON.parse(previousState());const s=state();if(s&&ui.view==='player'){if(payload.animation)payload.animation.world=NAME;payload.starbridge={objective:'Recover every crew pod from the asteroid field',phase:game.done?'report':s.paused?'paused':s.event,animationSeconds:+s.age.toFixed(3),rescued:game.correct,aboard:recovered(s),total:game.items.length,beaconsRemaining:game.items.length-game.correct,transitionLocked:busy(s),paused:s.paused,ship:{...SHIP,x:view().shipX,scale:1},canvas:cv.getBoundingClientRect().toJSON(),coordinates:view().width+'×300; origin top-left; x right, y down'};}return JSON.stringify(payload);};
 window.StarbridgeRescue={active,state};
 renderLibrary();if(ui.view==='editor')decorateEditor();
})();
