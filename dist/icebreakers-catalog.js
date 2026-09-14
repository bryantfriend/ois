// Ice-breakers are cross-grade social activities with their own interaction engines.
const ICE_GAMES={
 'ice-dash':{name:'This or That Dash',icon:'👈👉',color:'#6952c7',mode:'CLASS',rule:'Tap + on a choice and select your name. One vote per student. Watch the class chart grow, then hear from randomly selected classmates.'},
 'ice-find':{name:'Find Someone Who…',icon:'🔍',color:'#138b78',mode:'CLASS',rule:'Mingle and find classmates who match the challenges. Tap + on a square to add a name. Complete the board together or collect squares for your team.'},
 'ice-mystery':{name:'Mystery Classmate',icon:'🕵️',color:'#7451b3',mode:'TEAM',rule:'Read one clue at a time. Teams guess with the + name picker. More clues mean fewer points. A wrong guess passes the turn.'},
 'ice-bingo':{name:'Human Bingo',icon:'🎯',color:'#c83e78',mode:'CLASS',rule:'Find classmates who match the statements. Add their names to make a row, column or diagonal on a 4×4 or 5×5 board.'},
 'ice-rather':{name:'Would You Rather: Move & Vote',icon:'🤔',color:'#137eae',mode:'CLASS',rule:'Move to your choice’s side of the room, or point from your seat. Add names to record the groups. Hear from random speakers and aim for a 50/50 class bonus.'}
};
const ICE_STATEMENTS=['Has a pet','Likes spicy food','Can speak more than one language','Has traveled to another country','Enjoys drawing','Likes football','Can cook something','Has been on an airplane','Likes reading','Enjoys singing','Has grown a plant','Can ride a bicycle','Likes puzzles','Has visited a museum','Enjoys dancing','Likes the same music as you','Has helped someone this week','Enjoys rainy days','Has a favorite board game','Likes swimming','Can teach you a new word','Enjoys making things','Likes early mornings','Has a favorite animal','Wants to learn a new skill'];
const ICE_PAIRS={
 'ice-dash':[['Cats 🐱','Dogs 🐶'],['Summer ☀️','Winter ❄️'],['Gaming 🎮','Sports ⚽'],['Books 📚','Movies 🎬'],['Mountains ⛰️','Beach 🏖️'],['Sweet 🍓','Savory 🧀']],
 'ice-rather':[['Explore space 🚀','Explore the ocean 🌊'],['Talk to animals 🐾','Speak every language 🌍'],['Fly like a bird 🦅','Breathe underwater 🐠'],['Visit the past 🦕','Visit the future 🤖'],['Live in a treehouse 🌳','Live in a castle 🏰'],['Have a tiny dragon 🐉','Have a giant hamster 🐹']]
};
SUBJECTS.push({id:'ice-breakers',name:'Ice-Breakers',icon:'🧊'});SUBJECT_MENU.splice(1,0,'ice-breakers');
for(const [id,c] of Object.entries(ICE_GAMES)){
 ACTIVITIES[id]={...c,input:'text',subjects:['ice-breakers']};FORMATS[id]={...ACTIVITIES[id],description:c.rule,instructions:c.rule};
 const prompts=id==='ice-mystery'?['Something I enjoy','A favorite food','Something I would like to learn','A place I would like to visit','A fun fact about me']:ICE_STATEMENTS.slice(0,id==='ice-find'?12:25);
 const items=ICE_PAIRS[id]?ICE_PAIRS[id].map(([a,b])=>({prompt:a,answer:b,options:[],hint:'',explanation:''})):prompts.map(prompt=>({prompt,answer:'Classmate',options:[],hint:'',explanation:''}));
 GAMES.push({id,format:id,mode:c.mode,title:c.name,topic:'Meet your classmates · All grades',subject:'ice-breakers',grade:7,minutes:'10–15',items,settings:{teamOne:'Player 1',teamTwo:'Player 2',teamCount:2,teamNames:['Red','Blue'],shuffle:false}});
}
// Preserve explicit teacher-saved roster and clue data through the existing lesson schema.
function iceSettings(raw){const s=raw?.ice;if(!s)return {};if(typeof s!=='object'||!Array.isArray(s.names)||s.names.length>100)throw Error('Use up to 100 student names.');const names=s.names.map(n=>{if(typeof n!=='string'||!n.trim()||n.length>60)throw Error('Student names must be 1–60 characters.');return n.trim();});if(new Set(names.map(n=>n.normalize('NFC').toLocaleLowerCase())).size!==names.length)throw Error('Give students with the same name an initial so each name is unique.');const profiles={};for(const n of names){const clues=s.profiles&&Object.hasOwn(s.profiles,n)?s.profiles[n]:[];if(!Array.isArray(clues)||clues.length>5||clues.some(c=>typeof c!=='string'||c.length>240))throw Error('Use up to five short clues per student.');Object.defineProperty(profiles,n,{value:clues.map(c=>c.trim()).filter(Boolean),enumerable:true,writable:true,configurable:true});}return {ice:{names,profiles,mode:s.mode==='teams'?'teams':'class',size:s.size===5?5:4,timer:[0,30,60,90].includes(s.timer)?s.timer:60,speakers:s.speakers===2?2:1}};}
const iceBaseSettings=activitySettings;activitySettings=function(raw){return {...iceBaseSettings(raw),...iceSettings(raw)};};
