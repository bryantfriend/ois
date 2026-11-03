/* Local, deterministic practice bank. Each topic/difficulty generates 20 distinct prompts. */
(() => {
const grades = {
1:[['add','Addition within 20'],['subtract','Subtraction within 20'],['patterns','Number patterns']],
2:[['add','Addition & regrouping'],['subtract','Subtraction & regrouping'],['groups','Equal groups']],
3:[['multiply','Multiplication'],['divide','Division'],['perimeter','Perimeter']],
4:[['multiply','Multi-digit multiplication'],['fraction','Fractions of quantities'],['area','Area & perimeter']],
5:[['decimal','Decimal arithmetic'],['fraction','Fractions of quantities'],['volume','Volume']],
6:[['ratio','Ratios & proportion'],['percent','Percentages'],['integers','Signed integers']],
7:[['equation','Linear equations'],['percent','Percent change'],['probability','Probability']],
8:[['equation','Equations & substitution'],['pythagoras','Pythagoras'],['sequence','Arithmetic sequences']],
9:[['quadratic','Quadratic equations'],['slope','Coordinate geometry'],['probability','Probability & expected values']],
10:[['quadratic','Quadratics & functions'],['trig','Trigonometry'],['exponential','Exponential growth']],
11:[['derivative','Differentiation'],['logs','Logarithms'],['sequence','Sequences & series']]
};
const round=x=>Math.round(x*100)/100;
function bank(grade,topic,difficulty){
 if(!grades[grade]?.some(t=>t[0]===topic)||![0,1,2].includes(difficulty))throw Error('Unknown level');
 const d=difficulty, g=Number(grade), factor=d+1;
 return Array.from({length:20},(_,i)=>{
 const n=i+1,a=n+factor,b=factor+2;let text,answer,explanation;
 const q=(t,v,e)=>{text=t;answer=round(v);explanation=e;};
 switch(topic){
 case 'add': {let x=g===1?(i%10)+1:n*(d===0?2:7)+10,y=g===1?Math.min(d+1,20-x):(d+1)*13;
 q(`A robot has ${x} parts. Add ${y} more${d===2&&g>1?' and then 7 more':''}. How many parts now?`,x+y+(d===2&&g>1?7:0),`Add the quantities: ${x} + ${y}${d===2&&g>1?' + 7':''}.`);if(g===1&&i>=10)q(`The shop needs 20 parts. It has ${i-9}. How many more parts does it need?`,20-(i-9),`Find the missing part: 20 − ${i-9}.`);break;}
 case 'subtract': {let x=g===1?20:n*(d+2)+40,y=g===1?n:n+5;let extra=g>1&&d===2?8:0;q(`There are ${x} robot parts. Use ${y}${extra?' and then use 8 more':''}. How many remain?`,x-y-extra,`${x} − ${y}${extra?' − 8':''} = ${x-y-extra}.`);break;}
 case 'patterns': {let step=d+1;q(`What comes next? ${n}, ${n+step}, ${n+step*2}, __`,n+step*3,`Add ${step} each time.`);break;}
 case 'groups':case 'multiply': {let x=topic==='groups'?(i%10)+2:g===3?a:a*(g===4?3:1),y=topic==='groups'?d+2:b+(g>3?10:0);let extra=d===2?x:0;q(`${x} trays hold ${y} parts each.${extra?` Add ${extra} spare parts.`:''} How many parts altogether?`,x*y+extra,`${x} × ${y}${extra?` + ${extra}`:''} = ${x*y+extra}.`);if(topic==='groups'&&i>=10)q(`Pack ${x*y} parts into groups of ${y}. How many groups?`,x,`${x*y} ÷ ${y} = ${x}.`);break;}
 case 'divide': q(`${a*b} batteries are shared equally between ${b} robots.${d===2?' Each robot uses 1 battery. How many does each have left?':' How many batteries does each robot get?'}`,a-(d===2?1:0),`${a*b} ÷ ${b} = ${a}${d===2?'; then subtract 1':''}.`);break;
 case 'perimeter':case 'area': {let w=a,h=b+2;if(topic==='perimeter'||d===0)q(`A rectangular stall is ${w} m long and ${h} m wide. What is its perimeter in metres?`,2*(w+h),`Perimeter = 2 × (${w} + ${h}).`);else q(`A rectangular workshop is ${w} m by ${h} m.${d===2?' A 2 m² corner is unusable. What usable area remains in m²?':' What is its area in m²?'}`,w*h-(d===2?2:0),`Area = ${w} × ${h}${d===2?' − 2':''}.`);break;}
 case 'fraction': {let den=d+2,num=d===2?3:1,total=a*den;q(`What is ${num}/${den} of ${total} robot parts?`,a*num,`Divide ${total} by ${den}, then multiply by ${num}.`);break;}
 case 'decimal': {let x=round(a/10),y=round(b/10);q(`${x.toFixed(1)} coins ${d===0?'+':d===1?'×':'÷'} ${y.toFixed(1)} coins = ? Round to 2 decimal places if needed.`,d===0?x+y:d===1?x*y:x/y,`Calculate ${x} ${d===0?'+':d===1?'×':'÷'} ${y}, then round to 2 decimal places.`);break;}
 case 'volume': {let z=d+2;q(`A storage box is ${a} cm × ${b} cm × ${z} cm.${d===2?' Two identical boxes are filled. What is their combined volume in cm³?':' What is its volume in cm³?'}`,a*b*z*(d===2?2:1),`Volume = length × width × height${d===2?' × 2 boxes':''}.`);break;}
 case 'ratio': {let red=b,blue=b+1,scale=a;q(`Red : blue robots = ${red} : ${blue}. There are ${red*scale} red robots.${d===2?' How many robots are there altogether?':' How many blue robots are there?'}`,scale*(d===2?red+blue:blue),`One ratio part is ${red*scale} ÷ ${red} = ${scale}. Multiply by ${d===2?red+blue:blue}.`);break;}
 case 'percent': {let price=a*10,pct=[10,15,25][d];if(g===6)q(`What is ${pct}% of ${price} coins?`,price*pct/100,`${price} × ${pct}/100.`);else q(`A robot costs ${price} coins. Its price ${d===1?'increases':'decreases'} by ${pct}%. What is the new price?`,price*(1+(d===1?1:-1)*pct/100),`Find ${pct}% of ${price}, then ${d===1?'add':'subtract'} it.`);break;}
 case 'integers': q(`Calculate ${-a} ${d===0?'+':d===1?'−':'×'} ${b}.`,d===0?-a+b:d===1?-a-b:-a*b,`Apply the signed-number ${d===0?'addition':d===1?'subtraction':'multiplication'} rule.`);break;
 case 'equation': {let x=a,k=d+2,c=n+3;q(d===2?`Solve ${k}(x + ${c}) = ${k*(x+c)}. What is x?`:`Solve ${k}x + ${c} = ${k*x+c}. What is x?`,x,d===2?`Divide both sides by ${k}, then subtract ${c}.`:`Subtract ${c}, then divide by ${k}.`);break;}
 case 'probability': {let red=n+2,blue=n+4,total=red+blue;if(d===0)q(`A bag has ${red} red and ${blue} blue parts. What is P(red) as a decimal? Round to 2 decimal places.`,red/total,`Favourable ÷ total = ${red}/${total}.`);else if(d===1)q(`A bag has ${red} red and ${blue} blue parts. Replace each draw. What is P(two reds) as a decimal? Round to 2 decimal places.`,(red/total)**2,`Independent draws: (${red}/${total})².`);else q(`A robot sells for 10 coins with probability ${round(n/25)}, and 0 coins otherwise. What is its expected revenue?`,10*n/25,`Expected value = 10 × ${round(n/25)} + 0 × ${round(1-n/25)}.`);break;}
 case 'pythagoras': {let k=a;q(d===0?`A right triangle has legs ${3*k} and ${4*k}. Find the hypotenuse.`:d===1?`A right triangle has hypotenuse ${5*k} and one leg ${3*k}. Find the other leg.`:`A rectangular floor is ${5*k} m by ${12*k} m. Find its diagonal in metres.`,(d===0?5:d===1?4:13)*k,`Use a² + b² = c²${d===1?', rearranging to find the missing leg':''}.`);break;}
 case 'sequence': {let first=a,step=d+2,term=g===11?n+5:n+3;if(g===11&&d===2)q(`An arithmetic series starts at ${first} with common difference ${step}. Find the sum of the first ${term} terms.`,term/2*(2*first+(term-1)*step),`S = n/2 × [2a + (n − 1)d].`);else q(`An arithmetic sequence starts at ${first}, adding ${step} each time. Find term ${term}.`,first+(term-1)*step,`Term n = first + (n − 1) × difference.`);break;}
 case 'quadratic': {let r=a,s=a+d+2;if(d===0)q(`Find the larger root of (x − ${r})(x − ${s}) = 0.`,s,`Each factor can be zero: roots ${r} and ${s}; choose ${s}.`);else if(d===1)q(`Find the smaller root of x² − ${r+s}x + ${r*s} = 0.`,r,`Factor as (x − ${r})(x − ${s}); the smaller root is ${r}.`);else q(`For f(x) = (x − ${r})² + ${s}, what is the minimum value of f(x)?`,s,`The square is at least 0, attained at x = ${r}. The minimum is ${s}.`);break;}
 case 'slope': {let x=n,y=n+2,m=d+2;q(d===0?`Find the slope through (${x}, ${y}) and (${x+3}, ${y+3*m}).`:d===1?`A line has slope ${m} and passes through (${x}, ${y}). Find its y-intercept.`:`A line is y = ${m}x + ${y}. What is x when y = ${m*x+y}?`,d===0?m:d===1?y-m*x:x,d===0?'Slope = change in y ÷ change in x.':d===1?`b = y − mx = ${y} − ${m} × ${x}.`:`Subtract ${y}, then divide by ${m}.`);break;}
 case 'trig': {let h=a*3,angle=[30,45,60][d];q(`A right triangle has hypotenuse ${h} cm and angle ${angle}°. Find the side ${d===1?'adjacent':'opposite'} this angle. Round to 2 decimal places.`,h*(d===1?Math.cos(angle*Math.PI/180):Math.sin(angle*Math.PI/180)),`${d===1?'cos':'sin'}(${angle}°) = ${d===1?'adjacent':'opposite'} / hypotenuse. Multiply by ${h}.`);break;}
 case 'exponential': {let start=a*10,rate=[10,20,25][d],years=d+1;q(`A fund starts at ${start} coins and grows ${rate}% each year. How many coins after ${years} year(s)? Round to 2 decimal places.`,start*(1+rate/100)**years,`Use ${start} × (1 + ${rate}/100)^${years}.`);break;}
 case 'derivative': {let power=d+2,x=d===0?1:2;q(`If f(x) = ${a}x^${power}${d===2?` + ${b}x`:''}, find f′(${x}).`,a*power*x**(power-1)+(d===2?b:0),`Power rule: f′(x) = ${a*power}x^${power-1}${d===2?` + ${b}`:''}; substitute x = ${x}.`);break;}
 case 'logs': {let base=d+2,power=(i%5)+1;if(d===0)q(`Solve log₂(x) = ${n}. What is x?`,2**n,`Logarithmic form becomes x = 2^${n}.`);else if(d===1)q(`Solve log₃(x) + ${n} = ${n+power}. What is x?`,3**power,`Subtract ${n}; x = 3^${power}.`);else q(`Solve log₄(x − ${n}) = ${power}. What is x?`,4**power+n,`x − ${n} = 4^${power}, so add ${n}.`);break;}
 }
 if(!Number.isFinite(answer)||!text)throw Error('Invalid question');
 return {id:`${g}-${topic}-${d}-${i}`,text,answer,explanation};
 });
}
window.MathCurriculum={grades,bank};
})();
