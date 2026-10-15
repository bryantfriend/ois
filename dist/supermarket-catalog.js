// A standalone early-reading supermarket checkout.
FORMATS['supermarket-word-quest']={name:'Supermarket Word Quest',icon:'🛒',emoji:'🛒',color:'#257e78',accent:'#fff0c6',mode:'SOLO',standalone:'./supermarket/index.html',description:'Run the conveyor checkout, learn letters, and scan and bag each customer’s shopping.'};
GAMES.push({id:'english-1-supermarket-word-quest',format:'supermarket-word-quest',grade:1,subject:'english',title:'Supermarket Word Quest',topic:'Conveyor checkout · 130 objects, letters and simple words',minutes:'10–15',items:[]});
for(const edition of [
 {lang:'ru',subject:'russian',title:'Супермаркет: приключение со словами',topic:'Касса супермаркета · 76 предметов, буквы и простые слова'},
 {lang:'ky',subject:'kyrgyz',title:'Супермаркет: сөздөр дүйнөсү',topic:'Супермаркеттин кассасы · 76 буюм, тамгалар жана жөнөкөй сөздөр'}
]){
 const format='supermarket-word-quest-'+edition.lang;
 FORMATS[format]={...FORMATS['supermarket-word-quest'],name:edition.title,standalone:'./supermarket-'+edition.lang+'/index.html',description:edition.topic};
 GAMES.push({id:edition.subject+'-1-'+format,format,grade:1,subject:edition.subject,title:edition.title,topic:edition.topic,minutes:'10–15',items:[]});
}
