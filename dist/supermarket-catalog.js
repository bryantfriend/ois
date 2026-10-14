FORMATS['supermarket-word-quest']={name:'Supermarket Word Quest',icon:'🛒',emoji:'🛒',color:'#257e78',accent:'#fff0c6',mode:'SOLO',input:'word',standalone:'./supermarket/index.html',editableStandalone:true,instructions:'Choose letters and illustrated vocabulary, then run your own conveyor checkout.'};
GAMES.push({id:'english-1-supermarket-word-quest',format:'supermarket-word-quest',grade:1,subject:'english',title:'Supermarket Word Quest',topic:'500 illustrated words · letters and simple reading',minutes:'10–15',settings:{supermarket:{letters:['A','B','C','M','E','J','S','P'],words:['cup','jam','egg','bag','ham','pot','hat','pen','dog','cat','bus','sun','map','nut','net','fan'],stage:0}},items:['cup','jam','egg','bag','ham','pot','hat','pen','dog','cat','bus','sun','map','nut','net','fan'].map(word=>({prompt:word,answer:word,options:[],hint:'',explanation:''}))});

function supermarketConfig(raw){
 const cfg=raw||{},letters=[...new Set((cfg.letters||['A','B','C','M','E','J','S','P']).map(x=>String(x).toUpperCase()))],words=[...new Set(cfg.words||SIMPLE_SHOP_WORDS)];
 if(!letters.length||letters.some(x=>! /^[A-Z]$/.test(x)))throw Error('Choose at least one letter from A to Z.');
 if(words.length<2||words.length>500)throw Error('Choose between 2 and 500 illustrated words.');
 const supported=new Set(SHOP_WORD_LIBRARY.map(x=>x.name));if(words.some(x=>!supported.has(x)))throw Error('Choose words from the illustrated library so every item has artwork.');
 const stage=Number(cfg.stage??0);if(![0,1,2].includes(stage))throw Error('Choose a valid learning stage.');return {letters,words,stage};
}

for(const edition of [
 {lang:'ru',subject:'russian',title:'Супермаркет: приключение со словами',topic:'Касса супермаркета · 76 предметов, буквы и простые слова'},
 {lang:'ky',subject:'kyrgyz',title:'Супермаркет: сөздөр дүйнөсү',topic:'Супермаркеттин кассасы · 76 буюм, тамгалар жана жөнөкөй сөздөр'}
]){
 const format='supermarket-word-quest-'+edition.lang;
 FORMATS[format]={...FORMATS['supermarket-word-quest'],name:edition.title,standalone:'./supermarket-'+edition.lang+'/index.html',description:edition.topic};
 GAMES.push({id:edition.subject+'-1-'+format,format,grade:1,subject:edition.subject,title:edition.title,topic:edition.topic,minutes:'10–15',items:[]});
}
