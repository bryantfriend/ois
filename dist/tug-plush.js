/* Generated plush art; rules and independent touch panels remain in tug.js. */
const plushArt={ready:false,failed:false,images:{},frames:{},paused:false};
const plushFiles={background:'jailoo.webp',coral:'coral-hamster.webp',teal:'teal-hamster.webp',rope:'rope.webp'};
function plushBounds(image,columns=1,rows=1){
 const c=document.createElement('canvas');c.width=image.naturalWidth;c.height=image.naturalHeight;
 const context=c.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0);
 const pixels=context.getImageData(0,0,c.width,c.height).data,out=[];
 for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){
  const left=Math.round(col*c.width/columns),right=Math.round((col+1)*c.width/columns),top=Math.round(row*c.height/rows),bottom=Math.round((row+1)*c.height/rows);
  let x0=right,y0=bottom,x1=left,y1=top;
  for(let y=top;y<bottom;y++)for(let x=left;x<right;x++)if(pixels[(y*c.width+x)*4+3]>48){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
  out.push({x:x0,y:y0,w:Math.max(1,x1-x0+1),h:Math.max(1,y1-y0+1)});
 }
 return out;
}
Promise.all(Object.entries(plushFiles).map(([key,file])=>new Promise((resolve,reject)=>{
 const img=new Image();img.onload=()=>{plushArt.images[key]=img;resolve();};img.onerror=()=>reject(new Error('Could not load '+file));img.src='./tug-assets/'+file;
}))).then(()=>{
 for(const key of ['coral','teal'])plushArt.frames[key]=plushBounds(plushArt.images[key],4,2);
 plushArt.frames.rope=plushBounds(plushArt.images.rope);
 plushArt.ready=true;renderArcade();
}).catch(error=>{plushArt.failed=true;console.warn(error.message);});

// Use generated portraits in the existing fixed-size feedback slots.
tugMascot=function(){return '<div class="tug-mascot plush-mascot" aria-hidden="true"><canvas class="tug-hamster-body" width="164" height="164"></canvas><span class="tug-clock-ring"></span><span class="tug-point-pop"></span></div>';};
const plushCountdown=updateTugCountdown;
updateTugCountdown=function(p,side){plushCountdown(p,side);const el=$('#arena').querySelector(`[data-side="${side}"] .plush-mascot`);if(el)el.style.setProperty('--wait',`${Math.max(0,p.cooldown||0)/5*360}deg`);};

function plushPose(side,phase=0){
 const p=game.tug?.[side],c=game.celebration;
 if(c&&!c.finished)return side===(game.rope<0?0:1)?7:6;
 if(arcade.reduced)return p?.locked?(p.good?2:6):0;
 if(p?.locked&&p.good){const age=1.1-p.cooldown;if(age<.15)return 1;if(age<.65)return 2;return 3;}
 if(p?.locked&&!p.good){const age=5-p.cooldown;return age<.65?5:age<1.2?6:0;}
 return (arcade.time+phase)%4.3>4.05?4:0;
}
function plushSprite(context,side,frame,x,ground,height,phase=0,portrait=false){
 const key=side?'teal':'coral',image=plushArt.images[key],f=plushArt.frames[key]?.[frame];if(!f)return;
 // Register every pose to a shared baseline and scale, preventing sheet jitter.
 const maxHeight=Math.max(...plushArt.frames[key].map(b=>b.h)),scale=height/maxHeight,w=f.w*scale,h=f.h*scale;
 const c=game.celebration,win=c&&!c.finished&&side===(game.rope<0?0:1),t=arcade.time+phase;
 const hop=!arcade.reduced&&win?Math.abs(Math.sin(c.age*6+phase))*16:0;
 const breath=arcade.reduced?1:1+Math.sin(t*2.2)*.008;
 context.save();context.translate(x,ground-hop);context.scale(side?-1:1,breath);
 if(!portrait){context.fillStyle='#563d242b';context.beginPath();context.ellipse(0,1,w*.34,5,0,0,Math.PI*2);context.fill();}
 const p=game.tug?.[side];let previous=frame,blend=1;
 if(!arcade.reduced&&p?.locked&&!(c&&!c.finished)){
  const age=(p.good?1.1:5)-p.cooldown;
  const sequence=p.good?[[0,0],[1,0],[2,.15],[3,.65]]:[[5,0],[6,.65],[0,1.2]];
  const index=sequence.findLastIndex(([pose,start])=>frame===pose&&age>=start);
  if(index>0){previous=sequence[index-1][0];blend=Math.min(1,(age-sequence[index][1])/.12);}
 }
 if(blend<1){const old=plushArt.frames[key][previous],ow=old.w*scale,oh=old.h*scale;context.globalAlpha=1-blend;context.drawImage(image,old.x,old.y,old.w,old.h,-ow/2,-oh,ow,oh);}
 context.globalAlpha=blend;context.drawImage(image,f.x,f.y,f.w,f.h,-w/2,-h,w,h);context.restore();
}
const originalPlushTug=drawTug;
drawTug=function(){
 if(!plushArt.ready){originalPlushTug();return;}
 const bg=plushArt.images.background;cx.drawImage(bg,0,0,bg.width,bg.height,0,0,1100,300);
 const pull=arcade.rope*45,c=game.celebration,celebrating=c&&!c.finished;
 // Fixed centre line and seven ground pegs explain the three-pull lead.
 line(550,209,550,267,'#fff9',2);
 for(let i=-3;i<=3;i++){circle(550+i*45,263,i===0?5:3,'#fff9');}
 const rope=plushArt.images.rope,f=plushArt.frames.rope[0];
 const ropeY=celebrating?240:180+(arcade.reduced?0:Math.sin(arcade.time*2)*.5);
 cx.drawImage(rope,f.x,f.y,f.w,f.h,169+pull,ropeY-11,762,48);
 // Rear teammate first; front teammate has a larger silhouette and separate idle blink.
 for(const side of [0,1]){
  const sign=side?1:-1;
  plushSprite(cx,side,plushPose(side,.9),550+sign*305+pull,247,151,.9);
  plushSprite(cx,side,plushPose(side),550+sign*190+pull,253,182);
 }
 box(425,7,250,34,17,'#fff9e9e8');label(celebrating?teamName(game.rope<0?0:1)+' wins!':'Three pulls to win',550,24,17,'#513c2b');
 for(const side of [0,1]){box(side?817:35,12,248,31,15,side?'#087f86e8':'#ce5548ed');label(teamName(side),side?941:159,28,16,'#fff');}
 box(425,272,250,23,11,'#fff9e9eb');
 for(let i=-3;i<=3;i++)circle(550+i*30,283,i===Math.round(arcade.rope)?7:4,i===Math.round(arcade.rope)?(arcade.rope>0?'#087f86':'#d85d4c'):'#c6bba7');
 for(const side of [0,1]){const portrait=$('#arena').querySelector(`[data-side="${side}"] .plush-mascot canvas`);if(!portrait)continue;const context=portrait.getContext('2d');context.clearRect(0,0,164,164);plushSprite(context,side,plushPose(side),82,155,143,0,true);}
};

// Pause freezes the same simulation clock used by poses, rope, cooldowns and victory.
const plushPause=document.createElement('button');plushPause.id='tug-pause';plushPause.textContent='Pause';plushPause.setAttribute('aria-pressed','false');controls.prepend(plushPause);
function setPlushPause(value){plushArt.paused=value;plushPause.textContent=value?'Resume':'Pause';plushPause.setAttribute('aria-pressed',String(value));$('#player').classList.toggle('tug-paused',value);if(game?.lesson.format==='tug')$('#arena').inert=value||!!(game.celebration&&!game.celebration.finished);if(value)window.ClassroomVoice?.cancel?.();}
plushPause.onclick=()=>setPlushPause(!plushArt.paused);
const plushStep=stepArcade;stepArcade=function(dt){if(game?.lesson.format==='tug'&&plushArt.paused)return;plushStep(dt);};
const plushStart=startGame;startGame=function(...args){setPlushPause(false);return plushStart(...args);};
const plushShow=show;show=function(view){if(view!=='player')setPlushPause(false);return plushShow(view);};
const plushState=window.render_game_to_text;window.render_game_to_text=function(){const s=JSON.parse(plushState());if(game?.lesson.format==='tug'&&ui.view==='player')s.plush={loaded:plushArt.ready,failed:plushArt.failed,paused:plushArt.paused,poses:[plushPose(0),plushPose(1)],art:'plush-mountain-v1'};return JSON.stringify(s);};

