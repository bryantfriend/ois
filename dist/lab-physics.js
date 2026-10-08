// Authored puzzles: SVG coordinates, origin at top left, gravity points down.
const LAB_PHYSICS_LEVELS=[
 {title:'First slope',hint:'Draw a downhill ramp to your friend.',start:[60,40],goal:[280,230],ink:360},
 {title:'Think left',hint:'Gravity works in both directions. Try a ramp sloping left.',start:[540,40],goal:[300,230],ink:360},
 {title:'Long journey',hint:'Build a smooth route across the whole board.',start:[50,35],goal:[535,265],ink:590},
 {title:'High meeting',hint:'Your friend is above the floor. Catch the ball early.',start:[60,35],goal:[420,170],ink:470},
 {title:'Finish the road',hint:'The grey ramp is fixed. Extend it to reach your friend.',start:[60,40],goal:[500,265],ink:390,ramps:[[[30,85],[200,150]]]},
 {title:'Lava bridge',hint:'Keep the ball above the red lava.',start:[70,35],goal:[510,240],ink:570,hazards:[[170,255,260,33]]},
 {title:'Over the wall',hint:'Find a route over the tall block.',start:[60,30],goal:[500,175],ink:560,blocks:[[260,180,30,108]]},
 {title:'Low ceiling',hint:'Let the ball fall below the ceiling before it rolls right.',start:[60,35],goal:[500,265],ink:580,blocks:[[170,15,170,90]]},
 {title:'Between shelves',hint:'Keep your route inside the open corridor.',start:[60,35],goal:[520,195],ink:570,blocks:[[220,15,160,90],[220,225,160,63]]},
 {title:'Star detour',hint:'Collect the gold star before meeting your friend.',start:[60,30],goal:[500,230],ink:570,stars:[[280,144]]},
 {title:'Two wishes',hint:'One route must collect both stars.',start:[60,35],goal:[520,246],ink:560,stars:[[180,122],[370,190]]},
 {title:'Return trip',hint:'Collect both stars on a journey to the left.',start:[540,35],goal:[80,246],ink:560,stars:[[420,122],[230,190]]},
 {title:'Mind the gap',hint:'The fixed ramp ends above lava. Catch the ball on the far side.',start:[60,35],goal:[520,263],ink:300,ramps:[[[30,85],[250,170]]],hazards:[[265,270,90,18]]},
 {title:'Missing steps',hint:'Connect the two grey ramps, then finish the route.',start:[60,35],goal:[520,265],ink:390,ramps:[[[30,90],[160,120]],[[220,155],[350,185]]]},
 {title:'Thread the needle',hint:'Fit a route through the opening between the blocks.',start:[60,30],goal:[530,246],ink:590,blocks:[[240,15,30,105],[240,190,30,98]]},
 {title:'Underpass',hint:'The roof and raised floor leave little room for your ramp.',start:[60,35],goal:[520,185],ink:560,blocks:[[160,15,280,85],[160,215,280,73]]},
 {title:'Lava islands',hint:'Cross two lava pools while travelling left.',start:[540,35],goal:[70,245],ink:570,hazards:[[120,260,120,28],[340,260,110,28]],stars:[[300,166]]},
 {title:'Ink saver',hint:'Use the fixed road. You only have 340 units of ink to finish it.',start:[60,35],goal:[520,263],ink:340,ramps:[[[30,80],[250,155]]],stars:[[380,197]]},
 {title:'Three-star route',hint:'Collect every star and stay above the block.',start:[90,30],goal:[530,246],ink:550,stars:[[180,110],[330,168],[460,218]],blocks:[[300,230,80,58]],hazards:[[130,270,140,18]]},
 {title:'Grand reunion',hint:'Join the broken road, cross the lava, and collect all three stars.',start:[60,30],goal:[520,246],ink:310,ramps:[[[30,75],[170,120]],[[350,200],[550,265]]],stars:[[120,91],[270,163],[450,220]],hazards:[[180,270,160,18]],blocks:[[260,15,60,85]]}
];
function labPhysicsReset(d){d.ball={x:d.start.x,y:d.start.y,vx:0,vy:0};d.running=false;d.age=0;d.collected=d.stars.map(()=>false);}
function labPhysicsLines(d){return [...d.ramps,...d.blocks.flatMap(([x,y,w,h])=>[[{x,y},{x:x+w,y}],[{x:x+w,y},{x:x+w,y:y+h}],[{x:x+w,y:y+h},{x,y:y+h}],[{x,y:y+h},{x,y}]]),...d.lines];}
function labPhysicsStop(d,message){d.running=false;game.session.message=message;renderGame();}
function labPhysicsContact(ball,a,b){
 const dx=b.x-a.x,dy=b.y-a.y,len=dx*dx+dy*dy;if(!len)return;
 const t=Math.max(0,Math.min(1,((ball.x-a.x)*dx+(ball.y-a.y)*dy)/len)),x=a.x+t*dx,y=a.y+t*dy,dist=Math.hypot(ball.x-x,ball.y-y);
 if(dist>=12)return;
 const nx=dist?(ball.x-x)/dist:0,ny=dist?(ball.y-y)/dist:-1,dot=ball.vx*nx+ball.vy*ny;
 ball.x=x+nx*12;ball.y=y+ny*12;if(dot<0){ball.vx-=dot*nx;ball.vy-=dot*ny;ball.vx*=.999;ball.vy*=.999;}
}
LAB_ENGINES.physics={
 init(c,seed){
  // Older saved Ramp Lab / Ink Physics copies still open in the shared engine.
  const index=(Math.max(1,Number(seed)||1)-1)%LAB_PHYSICS_LEVELS.length,l=LAB_PHYSICS_LEVELS[index];
  const d={level:index+1,title:l.title,hint:l.hint,start:{x:l.start[0],y:l.start[1]},goal:{x:l.goal[0],y:l.goal[1]},maxInk:l.ink,lines:[],ink:0,ramps:(l.ramps||[]).map(line=>line.map(([x,y])=>({x,y}))),blocks:(l.blocks||[]).map(r=>[...r]),hazards:(l.hazards||[]).map(r=>[...r]),stars:(l.stars||[]).map(([x,y])=>({x,y})),collected:[]};
  labPhysicsReset(d);return d;
 },
 render(d){
  const points=line=>line.map(p=>p.x+','+p.y).join(' ');
  return `<div class="lab-physics-heading"><strong>Level ${d.level} / 20 · ${esc(d.title)}</strong><span>${esc(d.hint)}</span></div><svg id="lab-physics" viewBox="0 0 600 300" class="lab-drawing" aria-label="Draw ramps to bring the blue ball to its pink friend"><defs><linearGradient id="lab-sky" x2="0" y2="1"><stop stop-color="#d9efff"/><stop offset="1" stop-color="#fff1d1"/></linearGradient><pattern id="lab-lava" width="24" height="16" patternUnits="userSpaceOnUse"><rect width="24" height="16" fill="#eb6651"/><path d="M0 9q6-8 12 0t12 0" fill="none" stroke="#ffd066" stroke-width="3"/></pattern></defs><rect width="600" height="300" fill="url(#lab-sky)"/><path d="M0 288H600" stroke="#71869d" stroke-width="6"/>${d.blocks.map(([x,y,w,h])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#71869d" stroke="#4a6379" stroke-width="2"/>`).join('')}${d.hazards.map(([x,y,w,h])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#lab-lava)"/>`).join('')}${d.ramps.map(line=>`<polyline points="${points(line)}" stroke="#71869d" stroke-width="6" fill="none" stroke-linecap="round"/>`).join('')}${d.stars.map((p,i)=>`<g id="lab-star-${i}" transform="translate(${p.x} ${p.y})" opacity="${d.collected[i]?.25:1}"><path d="m0-12 4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="#f6bc35" stroke="#a87518" stroke-width="1.5"/></g>`).join('')}<circle cx="${d.goal.x}" cy="${d.goal.y}" r="16" fill="#e672a8" stroke="#fff" stroke-width="2"/><text x="${d.goal.x}" y="${d.goal.y+5}" text-anchor="middle" fill="white">♥</text><g id="lab-ramps">${d.lines.map(line=>`<polyline points="${points(line)}" stroke="#7a4fb0" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('')}</g><circle id="lab-ball" cx="${d.ball.x}" cy="${d.ball.y}" r="10" fill="#359cce" stroke="white" stroke-width="3"/></svg><p id="lab-ink">Ink ${Math.round(d.ink)} / ${d.maxInk}${d.stars.length?' · Stars '+d.collected.filter(Boolean).length+' / '+d.stars.length:''}</p>${labButton('release','Release ball',0,d.running)}${labButton('undo','Undo line',0,d.running)}${labButton('resetball','Reset ball')}`;
 },
 action(d,a){
  if(a==='release'){if(d.running)return;labPhysicsReset(d);game.session.message='';d.running=true;}
  if(a==='resetball'){labPhysicsReset(d);game.session.message='';}
  if(a==='undo'&&!d.running){d.lines.pop();d.ink=d.lines.reduce((sum,line)=>sum+line.slice(1).reduce((s,p,i)=>s+Math.hypot(p.x-line[i].x,p.y-line[i].y),0),0);}
 },
 bind(d){
  // Touch controls act directly, including after a captured drawing gesture.
  document.querySelectorAll('.lab-game button[data-mode-action],.lab-game button[data-replay]').forEach(button=>{
   button.onpointerdown=e=>{if(e.pointerType!=='touch'||button.disabled)return;e.preventDefault();if(button.hasAttribute('data-replay'))startGame();else labHandle(button);};
   button.onclick=e=>{if(e.pointerType==='touch'){e.preventDefault();e.stopPropagation();}};
  });
  const svg=$('#lab-physics');if(!svg)return;
  const point=e=>{const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(svg.getScreenCTM().inverse());return {x:Math.max(12,Math.min(588,p.x)),y:Math.max(15,Math.min(282,p.y))};};
  let pointer=null,line=null,element=null;
  const move=e=>{if(e.pointerId!==pointer||!line)return;let p=point(e),last=line.at(-1),length=Math.hypot(p.x-last.x,p.y-last.y),remaining=d.maxInk-d.ink;if(length<3||remaining<=0)return;if(length>remaining){p={x:last.x+(p.x-last.x)*remaining/length,y:last.y+(p.y-last.y)*remaining/length};length=remaining;}line.push(p);d.ink+=length;element.setAttribute('points',line.map(p=>p.x+','+p.y).join(' '));$('#lab-ink').textContent='Ink '+Math.round(d.ink)+' / '+d.maxInk+(d.stars.length?' · Stars 0 / '+d.stars.length:'');};
  svg.onpointerdown=e=>{if(e.button!==0||d.running||pointer!==null||d.ink>=d.maxInk)return;e.preventDefault();pointer=e.pointerId;svg.setPointerCapture(pointer);line=[point(e)];d.lines.push(line);element=document.createElementNS('http://www.w3.org/2000/svg','polyline');for(const [a,v] of Object.entries({stroke:'#7a4fb0','stroke-width':'5',fill:'none','stroke-linecap':'round'}))element.setAttribute(a,v);$('#lab-ramps').append(element);};
  svg.onpointermove=move;
  const finish=e=>{if(e.pointerId!==pointer)return;if(e.type==='pointerup')move(e);if(line.length<2){d.lines.pop();element.remove();}else game.session.moves++;if(svg.hasPointerCapture(pointer))svg.releasePointerCapture(pointer);pointer=null;line=null;};
  svg.onpointerup=finish;svg.onpointercancel=finish;svg.onlostpointercapture=finish;
 },
 step(d,dt){
  if(!d.running)return;
  const ball=d.ball,lines=labPhysicsLines(d),steps=Math.max(1,Math.ceil(dt/.008)),h=dt/steps;
  for(let k=0;k<steps;k++){
   ball.vy+=160*h;ball.x+=ball.vx*h;ball.y+=ball.vy*h;
   for(const line of lines)for(let j=1;j<line.length;j++)labPhysicsContact(ball,line[j-1],line[j]);
   if(ball.y>276){ball.y=276;ball.vy=0;ball.vx*=.995;}
   if(ball.x<10){ball.x=10;ball.vx=Math.abs(ball.vx)*.3;}if(ball.x>590){ball.x=590;ball.vx=-Math.abs(ball.vx)*.3;}
   if(d.hazards.some(([x,y,w,height])=>Math.hypot(ball.x-Math.max(x,Math.min(x+w,ball.x)),ball.y-Math.max(y,Math.min(y+height,ball.y)))<10)){labPhysicsStop(d,'Lava! Reset the ball and try a safer route.');return;}
   d.stars.forEach((p,i)=>{if(!d.collected[i]&&Math.hypot(ball.x-p.x,ball.y-p.y)<24){d.collected[i]=true;$('#lab-star-'+i)?.setAttribute('opacity','.25');}});
   if(Math.hypot(ball.x-d.goal.x,ball.y-d.goal.y)<25){
    if(d.collected.every(Boolean)){d.running=false;labWin('Level '+d.level+' complete! The two friends are together.');renderGame();return;}
    labPhysicsStop(d,'Collect every gold star before meeting your friend.');return;
   }
  }
  d.age+=dt;const el=$('#lab-ball');if(el){el.setAttribute('cx',ball.x);el.setAttribute('cy',ball.y);}const ink=$('#lab-ink');if(ink)ink.textContent='Ink '+Math.round(d.ink)+' / '+d.maxInk+(d.stars.length?' · Stars '+d.collected.filter(Boolean).length+' / '+d.stars.length:'');
  if(d.age>18)labPhysicsStop(d,'The ball stopped short. Adjust your ramps and retry.');
 }
};
