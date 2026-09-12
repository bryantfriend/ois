// Number relationships, money and mathematical representations.
LAB_ENGINES.number={
 init(c,seed){const r=labRand(seed),a=2+Math.floor(r()*7),b=2+Math.floor(r()*7),d=1+Math.floor(r()*7);return {a,b,c:d,values:[a,b,d],inputs:[],selected:[],target:a+b,coinPile:[1,2,5,10][seed%4]?[1,2,5,10,2,1].slice(0,3+seed%4):[1,2,5],coins:[1,2,5,10,20,50],paid:100,price:10+a*7,number:a*100+b*10+d,placed:[0,0,0],parts:0,denominator:b+2,numerator:1+seed%(b+1),line:Math.floor(r()*11),slots:[null,null,null],tiles:labShuffle([a,b,d],r),grid:labShuffle([a,b,d,a+1,b+1,d+1],r)};},
 render(d,c){const f=c.variant;
 if(f==='arithmagons')return '<div class="lab-triangle"><div>'+labButton('slot',d.slots[0]??'?',0)+'</div><div class="lab-triangle-edges"><b>'+(d.a+d.b)+'</b><b>'+(d.a+d.c)+'</b></div><div>'+labButton('slot',d.slots[1]??'?',1)+'<b>'+(d.b+d.c)+'</b>'+labButton('slot',d.slots[2]??'?',2)+'</div></div>'+labOptions('tile',d.tiles)+'<p>Select a value, then place it in a circle. Each edge is the sum of its ends.</p>'+labButton('check','Check sums');
 if(f==='numberline')return '<div class="lab-callout">Place '+d.line+' on the number line.</div><div class="lab-numberline">'+Array.from({length:11},(_,i)=>labButton('line',i===0?'0':i===10?'10':'│',i)).join('')+'</div>';
 if(f==='big')return '<div class="lab-callout">Build '+d.number+'</div><div class="lab-options">'+['Hundreds','Tens','Ones'].map((name,i)=>'<div><h3>'+name+'</h3>'+labButton('place',d.placed[i],i)+'</div>').join('')+'</div><p>Tap each place to cycle 0–9.</p>'+labButton('check','Check number');
 if(f==='small')return '<div class="lab-callout">Build a group of '+d.a+'</div><div class="lab-counters">'+('🟠'.repeat(d.parts)||'Tap + to add a counter')+'</div>'+labButton('less','−')+labButton('more','+')+labButton('check','Check group');
 if(f==='multiply'||f==='array')return '<div class="lab-callout">'+d.a+' groups of '+d.b+' = ?</div><div class="lab-array" style="--cols:'+d.b+'">'+Array.from({length:d.a*d.b},()=>'<span>●</span>').join('')+'</div>'+(f==='array'?'<p>Rotate the array: '+d.b+' × '+d.a+' has the same total.</p>'+labButton('rotate','Rotate array'):'')+'<form id="lab-form"><input id="lab-number" inputmode="numeric" aria-label="Product"><button class="button primary">Open the gate</button></form>';
 if(f==='fraction'||f==='fraction2')return '<div class="lab-callout">Cut out '+d.numerator+'/'+d.denominator+(f==='fraction2'?' = '+(d.numerator*2)+'/'+(d.denominator*2):'')+' of the whole</div><div class="lab-fraction" style="--cols:'+d.denominator+'">'+Array.from({length:d.denominator},(_,i)=>labButton('part',d.selected.includes(i)?'🟦':'□',i,false,'aria-pressed="'+d.selected.includes(i)+'"')).join('')+'</div><p>Each slice is equal. Select the required amount to clear the barrier.</p>'+labButton('check','Release the slices');
 if(f==='piggy'||f==='change'){if(f==='piggy')d.target=d.coinPile.reduce((a,b)=>a+b,0);const target=f==='piggy'?d.target:d.paid-d.price;return '<div class="lab-callout">'+(f==='piggy'?'🐷 Count the money tokens: '+d.coinPile.map(v=>'<span class="lab-coin">'+v+'</span>').join(''):'Price: '+d.price+' · Paid: '+d.paid+'<br>Make the exact change.')+'</div>'+(f==='piggy'?'<form id="lab-form"><input id="lab-number" inputmode="numeric" aria-label="Total value"><button class="button primary">Check total</button></form>':labOptions('coin',d.coins)+'<div class="lab-callout">Your change: '+d.selected.reduce((s,v)=>s+v,0)+'</div>'+labButton('undo','Undo coin')+labButton('check','Give change'));}
 if(f==='perimeter')return '<svg class="lab-diagram" viewBox="0 0 400 200"><rect x="80" y="40" width="240" height="120" fill="#d7ecff" stroke="#6c56b1" stroke-width="5"/><text x="200" y="30" text-anchor="middle">'+d.a+' units</text><text x="330" y="110">'+d.b+'</text></svg><div class="lab-callout">Grow a line equal to the perimeter: '+d.parts+'</div>'+labButton('less','−')+labButton('more','+')+labButton('check','Check perimeter');
 return '<div class="lab-callout">Target: '+d.target+'</div>'+labGrid(d.grid,3,(v,i)=>'<span class="'+(d.selected.includes(i)?'lab-picked':'')+'">'+v+'</span>')+'<p>Choose numbers that add to the target.</p>'+labButton('check','Check combination');
 },
 action(d,a,n,c){const f=c.variant;
 if(a==='part'){d.selected=d.selected.includes(n)?d.selected.filter(v=>v!==n):[...d.selected,n];game.session.moves++;}
 if(a==='cell'){d.selected=d.selected.includes(n)?d.selected.filter(v=>v!==n):[...d.selected,n];}
 if(a==='tile')d.active=d.tiles[n];if(a==='slot'&&d.active!==undefined){d.slots[n]=d.active;game.session.moves++;}
 if(a==='place')d.placed[n]=(d.placed[n]+1)%10;
 if(a==='more')d.parts++;if(a==='less')d.parts=Math.max(0,d.parts-1);
 if(a==='rotate'){[d.a,d.b]=[d.b,d.a];game.session.moves++;}
 if(a==='line'){game.session.moves++;n===d.line?labWin():labMiss('That point is '+n+'. Try again.');}
 if(a==='coin')d.selected.push(d.coins[n]);if(a==='undo')d.selected.pop();
 if(a==='submit'){const raw=$('#lab-number').value.trim();if(!/^\d+$/.test(raw)){labMiss('Type a whole number.');return;}Number(raw)===(f==='piggy'?d.target:d.a*d.b)?labWin():labMiss();}
 if(a==='check'){let good=false;
 if(f==='arithmagons')good=d.slots.every(v=>v!==null)&&d.slots[0]+d.slots[1]===d.a+d.b&&d.slots[0]+d.slots[2]===d.a+d.c&&d.slots[1]+d.slots[2]===d.b+d.c;
 else if(f==='big')good=d.placed[0]*100+d.placed[1]*10+d.placed[2]===d.number;
 else if(f==='small')good=d.parts===d.a;
 else if(f==='fraction'||f==='fraction2')good=d.selected.length===d.numerator;
 else if(f==='change')good=d.selected.reduce((s,v)=>s+v,0)===d.paid-d.price;
 else if(f==='perimeter')good=d.parts===2*(d.a+d.b);
 else good=d.selected.reduce((s,i)=>s+d.grid[i],0)===d.target;
 good?labWin():labMiss();}
 }
};
