/* Integer tick arithmetic keeps decimal and fraction cargo exact. */
(() => {
const concepts={
1:[['bonds','Number bonds'],['count','Counting & addition'],['missing','Missing amounts']],
2:[['tens','Tens & ones'],['subtract','Subtraction'],['groups','Equal groups']],
3:[['multiply','Multiplication'],['divide','Division'],['mass','Mass & measures']],
4:[['fractions','Fractions'],['factors','Factors'],['perimeter','Perimeter']],
5:[['decimals','Decimals'],['fraction-sums','Fraction sums'],['volume','Volume']],
6:[['ratio','Ratios'],['percent','Percentages'],['integers','Positive & negative numbers']],
7:[['equations','Linear equations'],['expressions','Expressions'],['multi','Multi-step reasoning']]
};
const gcd=(a,b)=>b?gcd(b,a%b):a;
function fraction(n,d){if(n===0)return '0';const g=gcd(Math.abs(n),d);n/=g;d/=g;return d===1?''+n:`${n}/${d}`;}
function make(grade,concept,difficulty,variant){
const d=difficulty,k=variant,n=d*2+k+2;
let q={grade,concept,difficulty,variant,scale:1,unit:'units',target:10,choices:[],initial:[],rule:'sum',requiredCount:null,hint:'Try a larger cube first, then fill the gap with smaller cubes.',solution:[]};
const numbers=values=>values.map(v=>({label:String(v),value:v}));
const set=(question,target,values,solution)=>Object.assign(q,{question,target,choices:numbers(values),solution});
switch(concept){
case 'bonds':set(`Make ${[6,10,12,15,18,20][d*2+k]}.`,[6,10,12,15,18,20][d*2+k],[1,2,3,4,5,10],[]);break;
case 'count':set(`Load ${n+3} units of cargo.`,n+3,[1,2,3,4,5,6],[]);break;
case 'missing':{const t=8+d*5+k*2,v=3+d;set(`The ship needs ${t} units. It already has ${v}. Complete the load.`,t,[1,2,3,4,5,10],[]);q.initial=[{label:String(v),value:v}];q.hint=`Start with ${v}. How many more make ${t}?`;break;}
case 'tens':set(`Build ${30+d*20+k*5} using tens and ones.`,30+d*20+k*5,[1,5,10,20,30,50],[]);q.hint='Load tens first. Then add the ones.';break;
case 'subtract':{const a=30+d*25+k*10,b=10+d*5+k*5;set(`What is ${a} minus ${b}? Load the answer.`,a-b,[1,5,10,15,20,25],[]);q.targetLabel=`${a} − ${b}`;q.hint=`Subtract ${b} from ${a}, then build that answer with cargo.`;break;}
case 'groups':{const size=2+d+k,count=3+d;set(`Load ${count} equal groups of ${size}. Use one cube for each group.`,size*count,[size,1,size+1,size+2,size*2,size+3],Array(count).fill(0));q.rule='groups';q.requiredCount=count;q.groupSize=size;q.hint=`Choose the ${size} cube ${count} times. Each cube is one group.`;break;}
case 'multiply':{const a=2+d,b=3+k+d;set(`Load a total of ${a*b*2}. Work out the products on the cubes.`,a*b*2,[],[0,0]);q.choices=[{label:`${a} × ${b}`,value:a*b},{label:'2 × 2',value:4},{label:'3 × 3',value:9},{label:'2 × 5',value:10},{label:'1 × 2',value:2},{label:'1 × 1',value:1}];q.hint=`Work out ${a} times ${b}. Two of those cubes will fill this order.`;break;}
case 'divide':{const a=3+d+k;set(`Load a total of ${a*3}. Work out the divisions on the cubes.`,a*3,[],[0,0,0]);q.choices=[{label:`${a*4} ÷ 4`,value:a},{label:'10 ÷ 2',value:5},{label:'12 ÷ 3',value:4},{label:'6 ÷ 3',value:2},{label:'9 ÷ 3',value:3},{label:'2 ÷ 2',value:1}];q.hint=`${a*4} divided by four is ${a}. Try three of those cubes.`;break;}
case 'mass':set(`The ship needs ${12+d*8+k*3} kilograms of supplies.`,12+d*8+k*3,[1,2,3,5,10,20],[]);q.unit='kg';q.hint='All cubes show kilograms. Add their masses to reach the target.';break;
case 'fractions':case 'fraction-sums':{const den=concept==='fraction-sums'?8:4,t=den*(1+d)+k*(den/2);set(`Load exactly ${fraction(t,den)} ${t===den?'whole':'wholes'} of cargo.`,t,[],[]);q.scale=den;q.unit='wholes';q.choices=[1,2,3,den/2,den-1,den].map(v=>({label:fraction(v,den),value:v}));q.hint=`The fractions all fit into ${den} equal parts. You need ${t} of those parts.`;q.targetLabel=fraction(t,den);break;}
case 'factors':{const t=[12,18,20,24,30,36][d*2+k],f=Array.from({length:t},(_,i)=>i+1).filter(x=>t%x===0&&x<=t/2).slice(-4);set(`Make ${t}. Every cube must be a factor of ${t}.`,t,[...f,7,11],[]);q.rule='factors';q.hint=`A factor divides ${t} exactly. Use two cubes marked ${t/2}.`;q.solution=[f.indexOf(t/2),f.indexOf(t/2)];break;}
case 'perimeter':{const w=3+d*2+k,h=2+d;set(`A rectangle is ${w} metres long and ${h} metres wide. Load its perimeter.`,2*(w+h),[1,2,3,4,5,10],[]);q.unit='m';q.targetLabel=`${w} × ${h} m`;q.hint=`Add ${w} and ${h}, then double it. A perimeter goes all the way around.`;break;}
case 'decimals':{const t=15+d*12+k*5;set(`Load exactly ${(t/10).toFixed(1)} units.`,t,[],[]);q.scale=10;q.targetLabel=(t/10).toFixed(1);q.choices=[1,2,5,10,15,20].map(v=>({label:(v/10).toFixed(1),value:v}));q.hint='Think in tenths. Ten tenths make one whole.';break;}
case 'volume':{const w=2+d,l=3+k,h=2+d;set(`A box is ${w} by ${l} by ${h} centimetres. Load its volume in cubic centimetres.`,w*l*h,[1,2,5,10,20,50],[]);q.unit='cm³';q.targetLabel=`${w} × ${l} × ${h}`;q.hint=`Multiply length, width and height: ${w} times ${l} times ${h}.`;break;}
case 'ratio':{const a=1+d,b=2+k,total=(a+b)*2;set(`Load ${total} cubes. Blue to orange must be ${a} to ${b}.`,total,[],[...Array(a*2).fill(0),...Array(b*2).fill(1)]);q.choices=[{label:'BLUE',value:1,kind:'blue'},{label:'ORANGE',value:1,kind:'orange'}];q.rule='ratio';q.ratio=[a,b];q.unit='cubes';q.requiredCount=total;q.maxCargo=12;q.hint=`Use ${a*2} blue cubes and ${b*2} orange cubes. That keeps the ratio ${a} to ${b}.`;q.targetLabel=`${a} : ${b}`;break;}
case 'percent':{const base=[40,60,80][d]+k*20,p=[25,50,75][d];set(`What is ${p} percent of ${base}? Load the answer.`,base*p/100,[1,2,5,10,20,25],[]);q.targetLabel=`${p}% of ${base}`;q.hint=`One quarter of ${base} is ${base/4}. ${p} percent is ${p/25} quarters.`;break;}
case 'integers':{const t=-(3+d*3+k);set(`Set the net cargo charge to ${t}. Positive and negative cubes combine.`,t,[-1,-2,-3,-5,2,5],[]);q.allowOver=true;q.unit='charge';q.hint=`Negative cubes lower the charge. Positive cubes raise it. Aim for ${t}.`;break;}
case 'equations':{const x=3+d*2+k,a=2+d,b=3+k;set(`Solve ${a} x plus ${b} equals ${a*x+b}. Load the value of x.`,x,[1,2,3,4,5,10],[]);q.targetLabel=`${a}x + ${b} = ${a*x+b}`;q.hint=`Subtract ${b} from ${a*x+b}. Then divide by ${a}.`;break;}
case 'expressions':{const x=2+d+k,a=2+d,b=1+k;set(`When x is ${x}, what is ${a} x plus ${b}? Load the value.`,a*x+b,[1,2,3,5,10,20],[]);q.targetLabel=`${a}x + ${b}, x = ${x}`;q.hint=`Replace x with ${x}. Multiply by ${a}, then add ${b}.`;break;}
case 'multi':{const packs=3+d,each=4+k,left=2+d,t=packs*each-left;set(`There are ${packs} packs of ${each} units. The crew uses ${left} units. Load what remains.`,t,[1,2,3,5,10,20],[]);q.targetLabel=`${packs} × ${each} − ${left}`;q.hint=`Multiply ${packs} by ${each}, then subtract ${left}.`;break;}
}
q.maxCargo=q.maxCargo||8;
q.targetText=q.targetLabel||String(q.target/q.scale);
q.display=v=>q.scale===4||q.scale===8?fraction(v,q.scale):q.scale===10?(v/10).toFixed(1):String(v);
if(!q.solution.length){
 // Find a short valid packing plan. Signed missions are bounded to avoid infinite searches.
 const queue=[{sum:0,path:[]}],seen=new Set(['0']);
 while(queue.length){const node=queue.shift();if(node.sum===q.target&&node.path.length){q.solution=node.path;break;}if(node.path.length>=q.maxCargo)continue;
 q.choices.forEach((c,i)=>{const sum=node.sum+c.value;if(Math.abs(sum)>Math.abs(q.target)+60||seen.has(sum))return;seen.add(sum);queue.push({sum,path:[...node.path,i]});});}
}
return q;
}
const successes=[
'Perfect cargo! Doors closing. Ready for takeoff!',
'Spot on, commander! Your ship is ready for the stars.',
'Brilliant maths! Cargo secured. Next stop, adventure!',
'Mission accomplished! That is one perfectly packed spaceship.',
'You nailed the numbers! Let us get this cargo into orbit.',
'Excellent thinking! The flight crew gives you a big thumbs up.',
'Another stellar solution! Engines warming. Stand by for launch.',
'That adds up beautifully! Your delivery is cleared for departure.',
'Fantastic work, cargo commander! The galaxy is waiting.',
'Right on target! Close the doors and reach for the stars.',
'A first-class solution! This spaceship is ready to soar.',
'Wonderful problem solving! Your cargo is going on a cosmic journey.',
'The numbers check out! Ground control, we are ready to fly.',
'What a clever load! Our robot is impressed with your maths.',
'Success at the spaceport! Another ship is ready for its adventure.',
'You have cracked this mission! All systems are ready for takeoff.',
'Beautifully calculated! Your cargo is packed and your ship is ready.',
'A star performance! Let us send this delivery on its way.',
'Great job, space explorer! Your maths has powered another mission.',
'Cargo complete! Give yourself a cheer as your spaceship takes off.'
];
const texts=['Welcome to Starport Cargo! Click a cube and your robot will load it. Click cargo inside the ship to take it out.',...successes,'That cube would go past the target. Try a smaller cube, or unload something first.','The cargo hold is full. Remove a cube to make room.','Every cube must be a factor of the target. Try another cube.','The total is right. Check the special mission rule before takeoff.'];
for(const [g,list] of Object.entries(concepts))for(const [c] of list)for(let d=0;d<3;d++)for(let k=0;k<2;k++){const q=make(+g,c,d,k);texts.push(q.question,q.hint);}
window.CargoMissions={concepts,make,successes,texts:[...new Set(texts)]};
})();
