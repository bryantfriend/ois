/* Airplane's existing teacher decks now power an illustrated delivery adventure. */
document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 const NAME='Cloud Courier',asset='./assets/cloud-courier/';
 const active=()=>game?.lesson.format==='airplane'&&ui.view==='player';
 const rule='Deliver parcels to the sky villages. Read the question, choose the destination with the matching answer, then send your plane. A correct delivery earns 100 points. Wrong deliveries use a shield; three mistakes end the route. Tap a village or use the arrow keys, then press Enter to deliver. Take your time: there is no answer countdown.';
 Object.assign(ACTIVITIES.airplane,{name:NAME,rule});
 Object.assign(FORMATS.airplane,{name:NAME,sourceTitle:'Airplane',description:'Fly a parcel plane between floating villages. Choose the right destination to complete each delivery.',instructions:rule});
 Object.assign(WORLDS.airplane,{name:NAME,emoji:'📦',color:'#806039',accent:'#ffdb7c',mission:'Get the parcels to the right sky villages.'});
 for(const lesson of GAMES)if(lesson.format==='airplane')lesson.title=lesson.title.replace(/^Airplane(?=:|$)/,NAME);
 let owner=null,root=null,canvas=null,context=null,assets=null,observer=null;
 const reduced=()=>arcade.reduced;
 function pictures(){
  if(assets)return assets;
  assets={};
  for(const name of ['sky','plane','dock']){const img=new Image();img.onload=()=>{if(active())draw();};img.src=asset+name+'.webp';assets[name]=img;}
  return assets;
 }
 function state(){
  const s=game.session;
  if(!s.courier)s.courier={round:game.index,phase:'briefing',selected:null,age:0,time:0,paused:false,deliverySeconds:0};
  const c=s.courier;
  if(c.round!==game.index&&!game.done){Object.assign(c,{round:game.index,phase:'choose',selected:null,age:0,paused:false,deliverySeconds:0});}
  return c;
 }
 function usable(){return active()&&!game.done&&game.session.phase==='question'&&state().phase==='choose'&&!state().paused;}
 function choose(index){
  if(!usable()||!Number.isInteger(index)||!game.choices[index])return;
  const c=state();c.selected=index;game.session.lane=index;refresh();draw();
 }
 function send(){
  if(!usable()||state().selected===null)return;
  const c=state();if(c.transfer<1)return;Object.assign(c,{phase:'flying',age:0,deliverySeconds:reduced()?.35:2.65});
  window.ClassroomVoice?.cancel();refresh();draw();
 }
 function shield(lit){return '<svg viewBox="0 0 32 36" aria-hidden="true" class="'+(lit?'':'used')+'"><path d="M3 4L16 1L29 4V18Q27 28 16 34Q5 28 3 18Z" fill="'+(lit?'#ffce67':'#8a9ba4')+'" stroke="#fff7dd" stroke-width="2"/><path d="M16 5V29Q25 23 25 17V7Z" fill="'+(lit?'#daa13b':'#667782')+'"/></svg>';}
 function markup(){
  const c=state(),total=game.items.length;
  return '<section class="courier-game" aria-label="Cloud Courier delivery game">'+
   '<div class="courier-world"><canvas id="courier-canvas" aria-label="A red parcel plane flying between floating mountain villages"></canvas>'+
   '<header class="courier-hud"><div class="courier-brand"><span aria-hidden="true">☁</span><strong>Cloud Courier</strong></div><div class="courier-deliveries" aria-live="polite"></div><div class="courier-shields" role="img"></div><button class="courier-pause" data-courier-pause aria-label="Pause delivery route">❚❚</button></header>'+
   '<div class="courier-docks" role="group" aria-label="Choose a delivery destination" style="--dock-count:'+game.choices.length+'">'+game.choices.map((answer,i)=>'<button class="courier-dock" data-courier-route="'+i+'" aria-pressed="false" aria-label="Destination '+(i+1)+': '+esc(answer)+'" title="'+esc(answer)+'"><img src="'+asset+'dock.webp" alt="" draggable="false"><span class="courier-dock-label '+(answer.length>65?'long':'')+'"><b>'+(i+1)+'</b><span>'+esc(answer)+'</span></span><span class="courier-route-mark" aria-hidden="true">✓</span></button>').join('')+'</div>'+
   '<div class="courier-flight-caption" role="status" aria-live="polite"></div><div class="courier-feedback" role="status" aria-live="polite" hidden></div></div>'+
   '<div class="courier-mission"><div class="courier-parcel" aria-hidden="true">📦</div><div class="courier-question"><span class="courier-eyebrow">DELIVERY '+Math.min(game.index+1,total)+' OF '+total+'</span><h2 id="courier-question">'+esc(current().prompt)+'</h2><p class="courier-selection"></p></div><div class="courier-controls"><div class="courier-steer"><button data-courier-steer="-1" aria-label="Previous destination">↑</button><button data-courier-steer="1" aria-label="Next destination">↓</button></div><button class="courier-send" data-courier-send disabled>Deliver parcel <span aria-hidden="true">→</span></button><small>Choose a village · Enter to fly</small></div></div>'+
   '<dialog class="courier-modal courier-intro" aria-labelledby="courier-intro-title"><div class="courier-modal-icon" aria-hidden="true">📦</div><span class="courier-eyebrow">WELCOME TO THE SKY POST</span><h2 id="courier-intro-title">The villages are waiting.</h2><p>Help our pilot deliver the parcels. Read each question and choose the village with the matching answer.</p><p>Tap a destination or use <strong>↑ ↓</strong>, then <strong>Deliver parcel</strong>. Wrong addresses cost a shield. There’s no rush.</p><button data-courier-begin>Start delivery route →</button><button class="courier-text-button" data-courier-exit>Back to games</button></dialog>'+
   '<dialog class="courier-modal courier-pause-modal" aria-labelledby="courier-pause-title"><span class="courier-modal-icon" aria-hidden="true">☁</span><h2 id="courier-pause-title">Taking a sky break</h2><p>Your plane and parcels will wait here.</p><button data-courier-resume>Resume delivery →</button><button class="courier-text-button" data-courier-exit>Back to games</button></dialog>'+
   (game.done?'<dialog class="courier-modal courier-report" aria-labelledby="courier-report-title"><span class="courier-modal-icon" aria-hidden="true">'+(game.correct===total?'✦':'📦')+'</span><span class="courier-eyebrow">SKY POST · DELIVERY REPORT</span><h2 id="courier-report-title">'+(game.correct===total?'Every parcel found its home!':game.session.lives<=0?'Time to return to the depot.':'Delivery route complete.')+'</h2><div class="courier-report-score">'+game.correct+' <span>/ '+total+' delivered</span></div><p>'+game.score+' points · '+(game.attempts-game.correct)+' wrong address'+(game.attempts-game.correct===1?'':'es')+'</p><p>'+(game.correct===total?'The sky villages send their thanks.':'Try the route again to get more parcels to the right villages.')+'</p><button data-replay>Fly the route again →</button><button class="courier-text-button" data-edit-result>Edit lesson</button><button class="courier-text-button" data-courier-exit>Back to games</button></dialog>':'')+'</section>';
 }
 function refresh(){
  if(!root||!active())return;
  const c=state(),s=game.session,busy=['flying','returning','pickup'].includes(c.phase)||s.phase==='feedback'||game.done;
  root.querySelector('.courier-deliveries').innerHTML='<span>Delivered</span><strong>'+game.correct+' / '+game.items.length+'</strong>';
  const shields=root.querySelector('.courier-shields');shields.innerHTML=[0,1,2].map(i=>shield(i<s.lives)).join('');shields.setAttribute('aria-label',s.lives+' of 3 shields remaining');
  root.querySelectorAll('[data-courier-route]').forEach((button,i)=>{button.setAttribute('aria-pressed',String(c.selected===i));button.disabled=busy||c.paused||c.phase==='briefing';button.querySelector('.courier-route-mark').textContent=c.phase==='delivered'?'✓':c.phase==='missed'?'↻':'→';});
  root.querySelectorAll('[data-courier-steer]').forEach(button=>button.disabled=busy||c.paused||c.phase==='briefing');
  const send=root.querySelector('[data-courier-send]');send.disabled=!usable()||c.selected===null||c.transfer<1;
  send.innerHTML=c.phase==='flying'?'Parcel in flight…':game.done?'Route finished':'Deliver parcel <span aria-hidden="true">→</span>';
  root.querySelector('.courier-selection').textContent=c.phase==='flying'?'Flying to destination '+(c.selected+1)+'…':c.selected===null?'Choose the village that matches your answer.':'Destination '+(c.selected+1)+': '+game.choices[c.selected];
  root.querySelector('.courier-flight-caption').textContent=c.phase==='delivered'?'Parcel delivered!':c.phase==='missed'?'Wrong address · a shield kept your parcel safe.':c.phase==='flying'?'SPECIAL DELIVERY':c.selected===null?'Where should this parcel go?':'Route selected · ready for take-off';
  if(c.phase==='returning'||c.phase==='pickup'){root.querySelector('.courier-flight-caption').textContent=c.phase==='returning'?'Returning to the sky post':'Picking up your next parcel…';root.querySelector('.courier-selection').textContent=c.phase==='returning'?'Flying back for a new parcel.':'Loading the next delivery…';send.textContent=c.phase==='returning'?'Returning to depot…':'Loading parcel…';}
  root.dataset.phase=c.phase;root.classList.toggle('courier-paused',c.paused);
 }
 function scene(){
  document.body.classList.add('courier-active');$('#player').classList.add('courier-active');
  $('#play-title').textContent=NAME;$('#play-subtitle').textContent='Solo · Sky Post';
  const c=state();pictures();
  if(owner===game&&root?.isConnected&&Number(root.dataset.round)!==game.index&&!game.done){
   const template=document.createElement('template');template.innerHTML=markup();
   for(const selector of ['.courier-docks','.courier-mission'])root.querySelector(selector).replaceWith(template.content.querySelector(selector));
   root.dataset.round=game.index;root.classList.remove('courier-arriving');void root.offsetWidth;root.classList.add('courier-arriving');
  }
  if(owner!==game||!root?.isConnected||Number(root.dataset.round)!==game.index||game.done&&!root.querySelector('.courier-report')){
   observer?.disconnect();owner=game;
   $('#arena').innerHTML=markup();root=$('#arena .courier-game');root.dataset.round=game.index;
   canvas=root.querySelector('canvas');context=canvas.getContext('2d');
   observer=new ResizeObserver(()=>{if(active())draw();});observer.observe(root.querySelector('.courier-world'));
  }
  refresh();draw();
  if(game.done){const report=root.querySelector('.courier-report');if(!report.open){report.showModal();report.querySelector('[data-replay]').focus({preventScroll:true});}}
  else if(c.phase==='briefing'){const intro=root.querySelector('.courier-intro');if(!intro.open)intro.showModal();}
 }
 function pause(value){
  if(!active()||game.done||state().phase==='briefing')return;
  const c=state();c.paused=value;window.ClassroomVoice?.cancel();
  const dialog=root.querySelector('.courier-pause-modal');if(value&&!dialog.open)dialog.showModal();else if(!value&&dialog.open)dialog.close();refresh();draw();
 }
 function begin(){const c=state();if(c.phase!=='briefing')return;c.phase='choose';root.querySelector('.courier-intro').close();refresh();root.querySelector('[data-courier-route]')?.focus({preventScroll:true});}
 function destination(index){
  const rect=canvas.getBoundingClientRect(),dock=root.querySelector('[data-courier-route="'+index+'"]')?.getBoundingClientRect();
  return {x:rect.width*(rect.width<600?.54:.70),y:dock?dock.top-rect.top+dock.height*.59:rect.height*.5};
 }
 function geometry(){
  const w=canvas.clientWidth,h=canvas.clientHeight,c=state(),home={x:w*(w<600?.20:.23),y:h*.50};
  const end=destination(c.selected??0),flying=['flying','delivered','missed'].includes(c.phase),progress=flying?Math.min(1,c.age/(c.deliverySeconds*.64||1)):0;
  const eased=progress*progress*(3-2*progress),x=home.x+(end.x-w*.095-home.x)*eased,y=home.y+(end.y-h*.045-home.y)*eased;
  const t=c.phase==='returning'?Math.min(1,c.returnAge/(reduced()?.2:1.45)):c.phase==='pickup'?1:0,ease=t*t*(3-2*t);
  return {w,h,home,end,x:c.from&&['returning','pickup'].includes(c.phase)?c.from.x*w+(home.x-c.from.x*w)*ease:x,y:c.from&&['returning','pickup'].includes(c.phase)?c.from.y*h+(home.y-c.from.y*h)*ease:y,progress,flying,pw:w*(w<600?.30:.19)};
 }
 function cover(img,w,h,dx=0){if(!img?.complete||!img.naturalWidth)return;const scale=Math.max(w/img.width,h/img.height);context.drawImage(img,(w-img.width*scale)/2+dx,(h-img.height*scale)/2,img.width*scale,img.height*scale);}
 function parcel(x,y,size,alpha=1){
  const ctx=context;ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.fillStyle='#bf813e';ctx.strokeStyle='#805023';ctx.lineWidth=1.5;ctx.fillRect(-size/2,-size/2,size,size);ctx.strokeRect(-size/2,-size/2,size,size);ctx.fillStyle='#ffe2a0';ctx.fillRect(-size*.08,-size/2,size*.16,size);ctx.fillRect(-size/2,-size*.08,size,size*.16);ctx.restore();
 }
 function draw(){
  if(!active()||!canvas?.isConnected||!context)return;
  const c=state(),g=geometry(),ctx=context,dpr=Math.min(2,devicePixelRatio||1),w=g.w,h=g.h;
  if(!w||!h)return;
  if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#a7dff5';ctx.fillRect(0,0,w,h);cover(pictures().sky,w+18,h,reduced()?0:Math.sin(c.time*.06)*7-9);
  // Soft foreground cloud wisps provide movement without moving the answer signs.
  if(!reduced())for(let i=0;i<4;i++){const x=((i*w*.34+c.time*8)%(w+200))-100;ctx.fillStyle='rgba(255,255,255,.17)';ctx.beginPath();ctx.ellipse(x,h*(.81+i%2*.11),w*.13,18+i*4,0,0,Math.PI*2);ctx.fill();}
  for(let i=0;i<game.choices.length;i++){
   const d=destination(i),selected=c.selected===i;
   ctx.save();ctx.globalAlpha=c.selected===null?.48:selected?.92:.17;ctx.strokeStyle=selected?'#fff1b8':'#fff';ctx.lineWidth=selected?3.5:2;ctx.setLineDash([7,10]);ctx.lineDashOffset=reduced()?0:-c.time*18;ctx.beginPath();ctx.moveTo(g.home.x+g.pw*.30,g.home.y);ctx.bezierCurveTo(w*.44,g.home.y,w*.47,d.y,d.x,d.y);ctx.stroke();ctx.restore();
  }
  const bob=!g.flying&&!reduced()?Math.sin(c.time*2)*5:0,angle=g.flying&&!reduced()?Math.sin(g.progress*Math.PI)*(g.end.y-g.home.y)/h*.23:0;
  const plane=pictures().plane,ph=g.pw*(plane.naturalHeight/plane.naturalWidth||.56);
  ctx.save();ctx.translate(g.x,g.y+bob);ctx.rotate(angle);if(c.phase==='returning')ctx.scale(-1,1);
  if(plane.complete&&plane.naturalWidth)ctx.drawImage(plane,-g.pw/2,-ph/2,g.pw,ph);
  // A translucent propeller shimmer is small, so the aircraft never changes size.
  if(!reduced()){ctx.strokeStyle='rgba(255,244,204,.32)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(g.pw*.475,-ph*.04,Math.abs(Math.sin(c.time*44))*5+2,ph*.34,0,0,Math.PI*2);ctx.stroke();}
  ctx.restore();
  if(g.flying){
   const drop=Math.max(0,Math.min(1,(c.age/(c.deliverySeconds||1)-.63)/.25)),size=Math.max(14,w*.018);
   parcel(g.x+g.pw*.06+(g.end.x-g.x)*drop,g.y+ph*.28+(g.end.y-g.y-ph*.28)*drop,size,c.phase==='missed'?.5:1);
   if(c.age/(c.deliverySeconds||1)>.85){
    const good=game.choices[c.selected]===current().answer,age=Math.max(0,c.age/(c.deliverySeconds||1)-.85)/.15;
    ctx.save();ctx.globalAlpha=.9-age*.45;ctx.strokeStyle=good?'#fff1a1':'#a8edff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(g.end.x,g.end.y,20+age*30,0,Math.PI*2);ctx.stroke();
    if(good)for(let i=0;i<10;i++){const a=i*Math.PI/5,r=18+age*36;ctx.fillStyle=i%2?'#ffde73':'#fff';ctx.fillRect(g.end.x+Math.cos(a)*r,g.end.y+Math.sin(a)*r,4,4);}ctx.restore();
   }
  }else if(['choose','briefing'].includes(c.phase)||c.phase==='pickup'&&c.returnAge>.2)parcel(g.x-g.pw*.06,g.y+ph*.27,Math.max(11,w*.014));
 }
 const render=renderActivity;
 renderActivity=function(){
  if(!active())return render();
  if(game.session.phase==='feedback'&&!game.done){refresh();draw();return;}
  scene();
 };
 const step=stepActivity;
 stepActivity=function(dt){
  if(!active())return step(dt);
  const c=state();if(c.paused||c.phase==='briefing'||game.done||document.hidden)return;
  c.time+=dt;
  if(c.phase==='returning'){c.returnAge+=dt;if(c.returnAge>=(reduced()?.2:1.45)){c.phase='pickup';c.returnAge=0;refresh();}return;}
  if(c.phase==='pickup'){c.returnAge+=dt;if(c.returnAge>=(reduced()?.15:.55)){actNext();renderGame();}return;}
  if(['delivered','missed'].includes(c.phase)){c.feedbackAge=(c.feedbackAge||0)+dt;if(c.feedbackAge>=c.feedbackSeconds)nextDelivery();return;}
  if(c.phase==='flying'){
   c.age=Math.min(c.deliverySeconds,c.age+dt);
   if(c.age>=c.deliverySeconds){const good=game.choices[c.selected]===current().answer;c.phase=good?'delivered':'missed';actScore(good);game.session.message=good?'Parcel delivered to the right village!':'Wrong address. Your shield kept the parcel safe.';c.feedbackAge=0;c.feedbackSeconds=good?1.05:4.5;
    if(!game.done){const feedback=root.querySelector('.courier-feedback');feedback.hidden=false;feedback.dataset.good=String(good);feedback.innerHTML='<strong>'+(good?'✓ Delivered! +100':'Wrong address · '+esc(current().answer))+'</strong>'+(!good&&current().explanation?'<span>'+esc(current().explanation)+'</span>':'')+'<button data-courier-next aria-label="Continue to next delivery">'+(good?'Keep flying →':'Continue →')+'</button>';refresh();draw();}else renderGame();}
  }
 };
 function nextDelivery(){
  const c=state();if(!['delivered','missed'].includes(c.phase)||game.done)return;
  const g=geometry();c.from={x:g.x/g.w,y:g.y/g.h};c.phase='returning';c.returnAge=0;
  root.querySelector('.courier-feedback').hidden=true;refresh();draw();
 }
 const renderWorld=renderArcade;renderArcade=function(){if(!active())return renderWorld();syncArcade();draw();};
 const drawOld=drawCanvas;drawCanvas=function(){if(active())return draw();return drawOld();};
 const oldMove=actMove;actMove=function(direction){if(!active())return oldMove(direction);if(!usable()||!['up','down'].includes(direction))return;const c=state();choose(c.selected===null?0:Math.max(0,Math.min(game.choices.length-1,c.selected+(direction==='up'?-1:1))));};
 const victory=celebrationIntercept;celebrationIntercept=function(render){return active()?false:victory(render);};
 $('#arena').addEventListener('click',event=>{
  if(!active())return;const b=event.target.closest('button');if(!b||b.disabled)return;
  if(b.hasAttribute('data-courier-route'))choose(Number(b.dataset.courierRoute));
  if(b.hasAttribute('data-courier-steer')){const c=state();choose(c.selected===null?0:Math.max(0,Math.min(game.choices.length-1,c.selected+Number(b.dataset.courierSteer))));}
  if(b.hasAttribute('data-courier-send'))send();
  if(b.hasAttribute('data-courier-next'))nextDelivery();
  if(b.hasAttribute('data-courier-begin'))begin();
  if(b.hasAttribute('data-courier-pause'))pause(true);
  if(b.hasAttribute('data-courier-resume'))pause(false);
  if(b.hasAttribute('data-courier-exit'))leaveEditor(()=>{clean();library();});
 });
 $('#arena').addEventListener('cancel',event=>{
  if(!event.target.matches('.courier-modal'))return;event.preventDefault();
  if(event.target.matches('.courier-pause-modal'))pause(false);
 },true);
 document.addEventListener('keydown',event=>{
  if(!active()||event.ctrlKey||event.metaKey||event.altKey||event.target.closest('input,textarea,select,[contenteditable]')||document.querySelector('dialog[open]'))return;
  const key=event.key;if(!['ArrowUp','ArrowDown','Enter','Escape','p','P','1','2','3','4'].includes(key))return;
  event.preventDefault();event.stopImmediatePropagation();
  if(key==='Escape'||key.toLowerCase()==='p'){pause(true);return;}
  if(key==='Enter'){if(game.session.phase==='feedback')nextDelivery();else send();return;}
  if(key==='ArrowUp'||key==='ArrowDown')actMove(key==='ArrowUp'?'up':'down');else choose(Number(key)-1);
 },true);
 function clean(){
  root?.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());observer?.disconnect();root=null;canvas=null;context=null;owner=null;
  document.body.classList.remove('courier-active');$('#player').classList.remove('courier-active');window.ClassroomVoice?.cancel();
 }
 const showOld=show;show=function(view){if(view!=='player')clean();return showOld(view);};
 const start=startGame;startGame=function(...args){clean();return start(...args);};
 const oldState=window.render_game_to_text;
 window.render_game_to_text=()=>{const data=JSON.parse(oldState());if(active()){const c=state(),g=canvas?.isConnected?geometry():null;data.cloudCourier={objective:'Deliver parcels to the villages matching your answers',phase:game.done?'report':c.paused?'paused':c.phase,selectedDestination:c.selected,delivered:game.correct,total:game.items.length,shields:game.session.lives,flightSeconds:+c.age.toFixed(3),time:+c.time.toFixed(3),plane:g?{x:+g.x.toFixed(1),y:+g.y.toFixed(1),width:+g.pw.toFixed(1),scale:1}:null,controls:'Tap a village or use arrows / 1–4; Enter delivers; P pauses',coordinates:'Canvas CSS pixels; x increases right, y increases down',assetsReady:!!assets&&Object.values(assets).every(img=>img.complete&&img.naturalWidth>0)};}return JSON.stringify(data);};
 const editor=openEditor;openEditor=function(lesson){const result=editor(lesson);if(lesson.format==='airplane'){$('#format-name').textContent=NAME;$('#format-instructions').textContent=rule;}return result;};
 renderLibrary();if(ui.view==='editor'&&draft?.format==='airplane'){
  const prepared=GAMES.find(lesson=>lesson.id===draft.id);
  if(prepared&&!dirty&&/^Airplane(?=:|$)/.test(draft.title))openEditor(prepared);
  else{$('#format-name').textContent=NAME;$('#format-instructions').textContent=rule;}
 }
 window.addEventListener('pagehide',clean);
});
