FORMATS['supermarket-word-quest']={name:'Supermarket Word Quest',icon:'🛒',emoji:'🛒',color:'#257e78',accent:'#fff0c6',mode:'SOLO',input:'word',standalone:'./supermarket/index.html',editableStandalone:true,instructions:'Choose letters and illustrated vocabulary, then run your own conveyor checkout.'};
GAMES.push({id:'english-1-supermarket-word-quest',format:'supermarket-word-quest',grade:1,subject:'english',title:'Supermarket Word Quest',topic:'500 illustrated words · letters and simple reading',minutes:'10–15',settings:{supermarket:{letters:['A','B','C','M','E','J','S','P'],words:['cup','jam','egg','bag','ham','pot','hat','pen','dog','cat','bus','sun','map','nut','net','fan'],stage:0}},items:['cup','jam','egg','bag','ham','pot','hat','pen','dog','cat','bus','sun','map','nut','net','fan'].map(word=>({prompt:word,answer:word,options:[],hint:'',explanation:''}))});

function supermarketConfig(raw){
 const cfg=raw||{},letters=[...new Set((cfg.letters||['A','B','C','M','E','J','S','P']).map(x=>String(x).toUpperCase()))],words=[...new Set(cfg.words||SIMPLE_SHOP_WORDS)];
 if(!letters.length||letters.some(x=>! /^[A-Z]$/.test(x)))throw Error('Choose at least one letter from A to Z.');
 if(words.length<2||words.length>500)throw Error('Choose between 2 and 500 illustrated words.');
 const supported=new Set(SHOP_WORD_LIBRARY.map(x=>x.name));if(words.some(x=>!supported.has(x)))throw Error('Choose words from the illustrated library so every item has artwork.');
 const stage=Number(cfg.stage??0);if(![0,1,2].includes(stage))throw Error('Choose a valid learning stage.');return {letters,words,stage};
}
