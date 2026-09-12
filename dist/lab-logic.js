let labYinPool=null;function labYinValid(b){return labConnected(b,0,4)&&labConnected(b,1,4)&&Array.from({length:9},(_,i)=>{const n=Math.floor(i/3)*4+i%3;return new Set([b[n],b[n+1],b[n+4],b[n+5]]).size>1;}).every(Boolean);}
const LAB_COLORS=['#914cc7','#249aca','#e58c35','#44aa80','#df5b86','#5066bd'];
function labAdjacent(a,b,w){return Math.abs(a%w-b%w)+Math.abs(Math.floor(a/w)-Math.floor(b/w))===1;}
function labConnected(board,value,w){const cells=board.map((v,i)=>v===value?i:-1).filter(i=>i>=0);if(!cells.length)return false;const seen=new Set([cells[0]]),queue=[cells[0]];for(let k=0;k<queue.length;k++)for(const n of cells)if(!seen.has(n)&&labAdjacent(queue[k],n,w)){seen.add(n);queue.push(n);}return seen.size===cells.length;}
function labLightCells(i,w,rule){return Array.from({length:w*w},(_,j)=>j).filter(j=>rule===0?i===j||labAdjacent(i,j,w):rule===1?Math.floor(j/w)===Math.floor(i/w):rule===2?j%w===i%w:rule===3?Math.floor(j/w)===Math.floor(i/w)||j%w===i%w:rule===4?Math.abs(j%w-i%w)===Math.abs(Math.floor(j/w)-Math.floor(i/w)):i===j);}
LAB_ENGINES.logic={
 init(c,seed){const r=labRand(seed),v=c.variant,d={w:4,board:[],active:0,selected:null,found:[],revealed:[],picked:[null,null,null],rule:(seed+Math.max(0,["black","blue","green","orange","pink","red"].indexOf(c.colorName)))%5,color:c.color,solution:[],history:[]};
 if(v==='sudoku'){const nums=labShuffle([1,2,3,4],r),rows=labShuffle([0,1],r).flatMap(b=>labShuffle([b*2,b*2+1],r)),cols=labShuffle([0,1],r).flatMap(b=>labShuffle([b*2,b*2+1],r));d.solution=rows.flatMap(y=>cols.map(x=>nums[(y*2+Math.floor(y/2)+x)%4]));d.fixed=[0,2,5,7,8,10,13,15];d.board=d.solution.map((v,i)=>d.fixed.includes(i)?v:0);d.active=1;}
 if(v==='yinyang'){d.w=4;if(!labYinPool){labYinPool=[];for(let mask=1;mask<65535&&labYinPool.length<40;mask++){const board=Array.from({length:16},(_,i)=>(mask>>i)&1);if(labYinValid(board))labYinPool.push(board);}}d.solution=[...labYinPool[seed%labYinPool.length]];d.fixed=[0,3,5,8,10,15];d.board=d.solution.map((v,i)=>d.fixed.includes(i)?v:-1);}
 if(v==='lights'){d.w=4;d.board=Array(16).fill(1);d.scramble=Array.from({length:5},()=>Math.floor(r()*16));for(const i of d.scramble)for(const j of labLightCells(i,4,d.rule))d.board[j]^=1;}
 if(['slider','picture','sumslider','swap','sumlines'].includes(v)){d.w=['slider','picture'].includes(v)?4:3;d.solution=Array.from({length:d.w*d.w},(_,i)=>(i+1)%(d.w*d.w));d.board=[...d.solution];d.blank=d.board.length-1;d.scramble=[];for(let k=0;k<18;k++){const moves=d.board.map((_,i)=>i).filter(i=>labAdjacent(i,d.blank,d.w)),n=moves[Math.floor(r()*moves.length)];d.scramble.push(d.blank);[d.board[n],d.board[d.blank]]=[d.board[d.blank],d.board[n]];d.blank=n;}if(v==='swap'||v==='sumlines')d.board=labShuffle(d.solution,r);d.rows=Array.from({length:d.w},(_,y)=>d.solution.slice(y*d.w,y*d.w+d.w).reduce((a,b)=>a+b,0));d.cols=Array.from({length:d.w},(_,x)=>d.solution.filter((_,i)=>i%d.w===x).reduce((a,b)=>a+b,0));}
 if(v==='crossword'){d.w=2;d.solution=Array.from({length:4},()=>1+Math.floor(r()*8));d.board=[0,0,0,0];const [a,b,e,f]=d.solution;d.rows=[a*10+b,e*10+f];d.cols=[a*10+e,b*10+f];d.active=1;}
 if(v==='distance'){d.w=5;d.solution=labShuffle([0,1,2,3,4],r);d.board=Array(5).fill(-1);d.active=0;d.clues=d.solution.slice(1).map((v,i)=>[d.solution[i],v,1]);}
 if(v==='deduction'){d.names=[['Amina','Ben','Chen'],['Kite','Robot','Train'],['9:00','10:00','11:00']];d.solution=[0,1,2].map(()=>Math.floor(r()*3));d.clues=labShuffle(d.names.flatMap((names,k)=>names.flatMap((name,i)=>i===d.solution[k]?[]:[{group:k,excluded:i,text:name+' is ruled out.'}])),r);}
 if(v==='mystery'){d.w=3;d.solution=labShuffle([2,4,6],r);d.board=Array(9).fill(0);d.names=['Amina','Ben','Chen'];d.clues=d.solution.map((n,i)=>d.names[i]+(n===2?' has the smallest even number.':n===6?' has twice three.':' has four.'));}
 return d;
 },
 render(d,c){const v=c.variant;
 if(v==='deduction')return '<div class="lab-callout">Who used which toy, and when?</div>'+labGrid(d.clues.map((_,i)=>i),3,(n)=>d.revealed.includes(n)?esc(d.clues[n].text):'🚪 Room '+(n+1),'clue')+'<div class="lab-options">'+d.names.map((names,k)=>'<div><h3>'+['Who','Toy','Time'][k]+'</h3>'+names.map((name,i)=>labButton('pick',esc(name),k*3+i,false,'aria-pressed="'+(d.picked[k]===i)+'"')).join('')+'</div>').join('')+'</div>'+labButton('check','Solve the mystery');
 if(v==='mystery')return '<div class="lab-clues">'+d.clues.map(t=>'<p>'+esc(t)+'</p>').join('')+'</div><p>Columns: 2, 4, 6. Rows: Amina, Ben, Chen. Mark one match per row.</p>'+labGrid(d.board,3,v=>v?'✓':'·')+labButton('check','Check deductions');
 if(v==='distance')return '<div class="lab-clues">'+d.clues.map(([a,b,n])=>'<p>'+['🔴','🔵','🟢','🟡','🟣'][a]+' is '+n+' step to the left of '+['🔴','🔵','🟢','🟡','🟣'][b]+'</p>').join('')+'</div>'+labOptions('choose',['🔴','🔵','🟢','🟡','🟣'])+labGrid(d.board,5,v=>v<0?'?':['🔴','🔵','🟢','🟡','🟣'][v])+labButton('check','Check distances');
 if(v==='lights')return '<p>Make every tile '+esc(c.colorName||'bright')+'. Discover which tiles change together.</p>'+labGrid(d.board,4,v=>'<span class="lab-light" style="background:'+(v?d.color:'#eee9f4')+'">'+(v?'●':'○')+'</span>')+labButton('hint','Show a hint');
 if(v==='sudoku')return '<p>Use every '+(c.pet?'animal':'number')+' once in each row, column and 2×2 box.</p>'+labOptions('choose',c.pet?c.pets||['🐱','🐶','🐰','🐻']:[1,2,3,4])+'<div class="lab-sudoku">'+labGrid(d.board,4,(v,i)=>'<span class="'+(d.fixed.includes(i)?'lab-fixed':'')+'">'+(v?(c.pet?(c.pets||['🐱','🐶','🐰','🐻'])[v-1]:v):'?')+'</span>')+'</div>'+labButton('check','Check grid');
 if(v==='yinyang')return '<p>Both colours must connect. No 2×2 block may have just one colour.</p>'+labGrid(d.board,4,(v,i)=>'<span class="lab-light '+(d.fixed.includes(i)?'lab-fixed':'')+'" style="background:'+(v<0?'#ece4f5':v?'#ffda69':'#c76695')+'">'+(d.fixed.includes(i)?'◆':'')+'</span>')+labButton('check','Check connections');
 if(v==='crossword')return '<div class="lab-clues"><p>Across: '+(d.rows[0]-3)+' + 3; '+(d.rows[1]+5)+' − 5</p><p>Down: '+(d.cols[0]*2)+' ÷ 2; '+(d.cols[1]-4)+' + 4</p></div>'+labOptions('digit',[0,1,2,3,4,5,6,7,8,9])+labGrid(d.board,2,v=>v||'?')+labButton('check','Check across and down');
 return (['sumslider','swap','sumlines'].includes(v)?'<p>Match all row totals: '+d.rows.join(', ')+' and column totals: '+d.cols.join(', ')+'.</p>':'<p>Slide a tile next to the gap. Restore the correct order.</p>')+labGrid(d.board,d.w,(v,i)=>v?(c.variant==='picture'?'<span class="lab-picture-cell" style="background-position:'+((v-1)%4*100/3)+'% '+Math.floor((v-1)/4)*100/3+'%">'+v+'</span>':v):'·')+(['swap','sumlines'].includes(v)?'<p>Tap two tiles to swap their positions.</p>':'')+labButton('check','Check board');
 },
 action(d,a,n,c){const v=c.variant;if(a==='hint'&&v==='lights'){game.session.message=['A tile changes with its neighbours.','A whole row changes together.','A whole column changes together.','Its row and column change together.','Look along the diagonals.'][d.rule];return;}
 if(a==='clue'&&d.clues[n]&&!d.revealed.includes(n)){d.revealed.push(n);game.session.moves++;}
 if(a==='pick')d.picked[Math.floor(n/3)]=n%3;
 if(a==='choose')d.active=v==='sudoku'?n+1:n;if(a==='digit')d.active=n;
 if(a==='cell'&&n>=0&&n<d.board.length){game.session.moves++;
 if(v==='sudoku'&&!d.fixed.includes(n))d.board[n]=d.active;
 else if(v==='yinyang'&&!d.fixed.includes(n))d.board[n]=d.board[n]<0?0:1-d.board[n];
 else if(v==='lights'){for(const i of labLightCells(n,d.w,d.rule))d.board[i]^=1;if(d.board.every(Boolean))labWin();}
 else if(v==='mystery'){const row=Math.floor(n/3);for(let i=row*3;i<row*3+3;i++)d.board[i]=i===n?1:0;}
 else if(v==='distance'){d.board=d.board.map(x=>x===d.active?-1:x);d.board[n]=d.active;}
 else if(v==='crossword')d.board[n]=d.active;
 else if(v==='swap'||v==='sumlines'){if(d.selected===null)d.selected=n;else{[d.board[n],d.board[d.selected]]=[d.board[d.selected],d.board[n]];d.selected=null;}}
 else if(['slider','picture','sumslider'].includes(v)&&labAdjacent(n,d.blank,d.w)){[d.board[n],d.board[d.blank]]=[d.board[d.blank],d.board[n]];d.blank=n;}
 }
 if(a==='check'){let good=false;
 if(v==='deduction')good=d.picked.every((x,i)=>x===d.solution[i]);
 else if(v==='distance'||v==='crossword'||v==='slider'||v==='picture')good=d.board.every((x,i)=>x===d.solution[i]);
 else if(v==='mystery')good=d.solution.every((value,row)=>d.board[row*3+value/2-1]===1);
 else if(v==='sudoku')good=d.board.every(v=>v>0)&&[0,1,2,3].every(i=>new Set(d.board.slice(i*4,i*4+4)).size===4&&new Set([0,1,2,3].map(y=>d.board[y*4+i])).size===4)&&[0,2,8,10].every(i=>new Set([d.board[i],d.board[i+1],d.board[i+4],d.board[i+5]]).size===4);
 else if(v==='yinyang')good=d.board.every(v=>v>=0)&&labConnected(d.board,0,4)&&labConnected(d.board,1,4)&&Array.from({length:9},(_,i)=>{const n=Math.floor(i/3)*4+i%3;return new Set([d.board[n],d.board[n+1],d.board[n+4],d.board[n+5]]).size>1;}).every(Boolean);
 else good=d.rows.every((sum,y)=>d.board.slice(y*d.w,y*d.w+d.w).reduce((a,b)=>a+b,0)===sum)&&d.cols.every((sum,x)=>d.board.filter((_,i)=>i%d.w===x).reduce((a,b)=>a+b,0)===sum);
 good?labWin():labMiss('Check every clue, row and column.');}
 }
};
