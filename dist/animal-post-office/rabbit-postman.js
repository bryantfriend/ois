// Six matched postman poses with state-driven gestures and speech animation.
(() => {
 'use strict';
 const host=document.getElementById('rabbit-postman');
 const names=['idle','wave','point','celebrate','blink','talk'];
 const frames=names.map((_,i)=>{const image=new Image();image.src='assets/rabbit/'+String(i+1).padStart(2,'0')+'.png';return image;});
 let time=0,override=null,until=0,lastFrame=-1,ready=false;
 Promise.all(frames.map(image=>image.decode())).then(()=>{ready=true;host.hidden=false;setFrame(0);}).catch(()=>{host.hidden=true;});
 function setFrame(index){if(!ready||index===lastFrame)return;lastFrame=index;host.style.backgroundImage=`url("${frames[index].src}")`;host.dataset.pose=names[index];}
 function react(action,duration=950){override=action;until=time+duration;}
 function update(ms,context){time+=Math.max(0,Number(ms)||0);if(!ready)return;const gentle=context.gentle||matchMedia('(prefers-reduced-motion: reduce)').matches;let action='idle',frame=0;
  if(gentle){action=context.phase==='delivering'||context.phase==='complete'?'celebrate':context.dragging?'point':'idle';frame=names.indexOf(action);}
  else if(context.phase==='arriving'){action='wave';frame=1;}
  else if(context.phase==='retry'){action='encourage';frame=1;}
  else if(context.phase==='delivering'||context.phase==='complete'){action='celebrate';frame=3;}
  else if(override&&time<until){action=override;frame=names.indexOf(action);}
  else if(context.dragging){action='point';frame=2;}
  else if(context.voicePlaying){action='talk';frame=Math.floor(time/190)%2?5:0;}
  else if(time%4200>4030){action='blink';frame=4;}
  host.dataset.action=action;host.classList.toggle('still',gentle);setFrame(Math.max(0,frame));
 }
 window.RabbitPostman={react,update,get pose(){return host.dataset.pose||'loading';},get action(){return host.dataset.action||'idle';},get ready(){return ready;}};
})();
