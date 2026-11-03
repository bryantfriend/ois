// Camera rotation changes the view only. Board indices always remain A1..C3.
function bbInit(s){s.bb={turn:0,yaw:Math.PI/4,pitch:.62,zoom:1,cell:4,history:[]};}
function bbLabel(i){return 'ABC'[i%3]+(Math.floor(i/3)+1);}
function bbScene(values,editable=false){
 const b=game.session.bb,yaw=b.yaw??Math.PI/4,pitch=b.pitch??.62,sy=Math.sin(yaw),cy=Math.cos(yaw),sp=Math.sin(pitch),cp=Math.cos(pitch),faces=[];
 const project=([x,y,z])=>[200+(x*cy-y*sy)*62*b.zoom,180+((x*sy+y*cy)*sp*62-z*cp*43)*b.zoom];
 const face=(points,fill,i,label='')=>{const centre=points.reduce((a,p)=>a.map((v,k)=>v+p[k]/points.length),[0,0,0]);faces.push({points,fill,i,label,centre,layer:2,depth:(centre[0]*sy+centre[1]*cy)*cp*62+centre[2]*sp*43});};
 const box=(x,y,z,w,h,colors,i)=>{
  const x1=x+w,y1=y+w,z1=z+h;
  const xx=sy>=0?x1:x,yy=cy>=0?y1:y;
  face([[xx,y,z],[xx,y1,z],[xx,y1,z1],[xx,y,z1]],colors[1],i);
  face([[x,yy,z],[x1,yy,z],[x1,yy,z1],[x,yy,z1]],colors[2],i);
  face([[x,y,z1],[x1,y,z1],[x1,y1,z1],[x,y1,z1]],colors[0],i);
 };
 box(-1.56,-1.56,-.22,3.12,.16,['#c0d7df','#8caebb','#a2c4ce'],-1);faces.forEach(f=>f.layer=0);
 for(let i=0;i<9;i++){
  const x=i%3-1.5,y=Math.floor(i/3)-1.5,n=Number(values[i]),sel=editable&&i===b.cell;
  face([[x+.025,y+.025,0],[x+.975,y+.025,0],[x+.975,y+.975,0],[x+.025,y+.975,0]],sel?'#ffd080':'#e4f0f5',i,n?'':bbLabel(i));faces[faces.length-1].layer=1;
  for(let z=0;z<n;z++)box(x+.035,y+.035,z,.93,.98,i===4?['#ffc266','#f5a13c','#d97920']:['#72ded6','#24b7b4','#118c94'],i);
  if(n)faces[faces.length-1].label=bbLabel(i);
 }
 faces.sort((a,b)=>a.layer-b.layer||a.depth-b.depth);
 return '<svg class="bb-orbit" data-bb-scene="'+(editable?'build':'target')+'" viewBox="-10 -90 420 410" role="group" aria-label="'+(editable?'Your build':'Target model')+'. Drag the space around the board to rotate and tilt.">'+faces.map(f=>{const p=project(f.centre);return '<g'+(editable&&f.i>=0?' data-bb-cell="'+f.i+'" role="button" tabindex="-1" aria-label="Select '+bbLabel(f.i)+'"':'')+'><polygon points="'+f.points.map(v=>project(v).map(n=>n.toFixed(2)).join(',')).join(' ')+'" fill="'+f.fill+'" stroke="#ffffffb0" stroke-width="1.2" stroke-linejoin="round"/>'+(f.label?'<text x="'+p[0]+'" y="'+(p[1]+4)+'" text-anchor="middle" fill="#123f55" font-size="12" font-weight="800" pointer-events="none">'+f.label+'</text>':'')+'</g>';}).join('')+'</svg>';
}
function bbTool(action,label,value='',disabled=false,extra=''){return prBtn('bb-'+action,label,value,disabled,extra);}
function bbRender(){const s=game.session,b=s.bb,h=s.board[b.cell];return '<section class="bb-workshop" aria-label="Block Builder workshop"><header class="bb-heading"><div><span class="bb-kicker">PLAN · BUILD · LEARN</span><h2>Block Builder <small>Builder Workshop</small></h2></div><span class="bb-progress">Challenge '+(game.index+1)+' / '+game.items.length+'</span></header><div class="bb-layout"><section class="bb-card bb-target"><h3>Build this</h3>'+bbScene(s.values)+'<p>Drag the space around either board to rotate. Drag up or down to tilt.</p></section><section class="bb-build"><h3>Your build</h3>'+bbScene(s.board,true)+'<div class="bb-camera" role="group" aria-label="Camera controls">'+bbTool('rotate','↶',-1,false,'aria-label="Rotate left"')+bbTool('rotate','↷',1,false,'aria-label="Rotate right"')+'<span>Zoom</span>'+bbTool('zoom','−',-1,b.zoom<=.7,'aria-label="Zoom out"')+'<output>'+Math.round(b.zoom*100)+'%</output>'+bbTool('zoom','+',1,b.zoom>=1.4,'aria-label="Zoom in"')+bbTool('reset','Reset view')+'</div></section><section class="bb-card bb-editor"><h3>Build a column</h3><h4><b>1</b> Pick a square</h4><div class="bb-grid">'+s.board.map((v,i)=>bbTool('cell','<span>'+bbLabel(i)+'</span><strong>'+v+'</strong>',i,false,'aria-label="Select square '+bbLabel(i)+', height '+v+'" aria-pressed="'+(i===b.cell)+'"')).join('')+'</div><h4><b>2</b> Set its height</h4><p class="bb-selected">Square <strong>'+bbLabel(b.cell)+'</strong> · Height <strong>'+h+' of 3</strong></p><div class="bb-step">'+bbTool('step','− Remove block',-1,h===0)+bbTool('step','+ Add block',1,h===3)+'</div><div class="bb-heights" role="group" aria-label="Choose height">'+[0,1,2,3].map(n=>bbTool('height','<span class="bb-stack" aria-hidden="true">'+('<i></i>'.repeat(n)||'<em>empty</em>')+'</span><strong>'+n+'</strong>',n,false,'aria-label="Set height '+n+'" aria-pressed="'+(h===n)+'"')).join('')+'</div></section></div><div class="bb-footer">'+prBtn('check','✓ Check model')+bbTool('undo','↶ Undo','',!b.history.length)+'<span>Pick a square, then add or remove blocks.</span></div></section>';}
function bbHandle(a,n){const s=game.session,b=s.bb;
 if(a==='cell'&&Number.isInteger(n)&&n>=0&&n<9)b.cell=n;
 if(a==='rotate'){b.turn=(b.turn+(n===-1?3:1))%4;b.yaw=(b.yaw??Math.PI/4)+(n===-1?-1:1)*Math.PI/2;}
 if(a==='zoom')b.zoom=Math.round(Math.min(1.4,Math.max(.7,b.zoom+n*.1))*10)/10;
 if(a==='reset'){b.turn=0;b.yaw=Math.PI/4;b.pitch=.62;b.zoom=1;}
 if(a==='undo'&&b.history.length){const prev=b.history.pop();s.board=prev.board;b.cell=prev.cell;s.message='';}
 if(a==='height'||a==='step'){const value=a==='height'?n:s.board[b.cell]+n;if(Number.isInteger(value)&&value>=0&&value<=3&&value!==s.board[b.cell]){b.history.push({board:[...s.board],cell:b.cell});s.board[b.cell]=value;s.message='';}}
}
function bbBind(){
 document.querySelectorAll('[data-bb-scene]').forEach(svg=>{
  let drag=null,suppress=false;
  svg.onpointerdown=e=>{if(e.button!==0||drag||e.target.closest('g'))return;const b=game.session.bb;drag={id:e.pointerId,x:e.clientX,y:e.clientY,yaw:b.yaw??Math.PI/4,pitch:b.pitch??.62};suppress=false;svg.setPointerCapture(e.pointerId);svg.classList.add('bb-dragging');e.preventDefault();};
  svg.onpointermove=e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)<4&&!suppress)return;suppress=true;const b=game.session.bb;b.yaw=drag.yaw+dx*.012;b.pitch=Math.min(1.25,Math.max(.24,drag.pitch+dy*.008));b.turn=((Math.round((b.yaw-Math.PI/4)/(Math.PI/2))%4)+4)%4;
   document.querySelectorAll('[data-bb-scene]').forEach(el=>{const editable=el.dataset.bbScene==='build',temp=document.createElement('div');temp.innerHTML=bbScene(editable?game.session.board:game.session.values,editable);el.innerHTML=temp.firstElementChild.innerHTML;});
  };
  const end=e=>{if(drag&&e.pointerId===drag.id){drag=null;svg.classList.remove('bb-dragging');if(svg.hasPointerCapture(e.pointerId))svg.releasePointerCapture(e.pointerId);}};
  svg.onpointerup=svg.onpointercancel=svg.onlostpointercapture=end;
  svg.onclick=e=>{if(suppress){suppress=false;return;}const cell=e.target.closest('[data-bb-cell]');if(cell)handlePrimary({dataset:{modeAction:'pr-bb-cell',value:cell.dataset.bbCell}});};
  svg.onkeydown=e=>{const cell=e.target.closest('[data-bb-cell]');if(cell&&(e.key==='Enter'||e.key===' ')){e.preventDefault();handlePrimary({dataset:{modeAction:'pr-bb-cell',value:cell.dataset.bbCell}});}};
 });
}
