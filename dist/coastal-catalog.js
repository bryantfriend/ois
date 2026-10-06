// One standalone network game, discoverable in both requested year groups.
FORMATS['coastal-connections']={name:'Coastal Connections',icon:'⛴',emoji:'⛴',color:'#157f91',accent:'#f7c65e',mode:'SOLO',standalone:'./coastal/index.html',description:'Build a UK transport network, reveal new countries and keep passengers moving.'};
for(const grade of [7,8]) GAMES.push({id:`geography-${grade}-coastal-connections`,format:'coastal-connections',grade,subject:'geography',title:'Coastal Connections',topic:'UK geography and transport · countries, capitals and connections',minutes:'10–20',items:[]});
document.addEventListener('DOMContentLoaded',()=>{
 const params=new URLSearchParams(location.search);
 if(params.get('subject')==='geography'&&!params.has('game')){
  ui.subject='geography';
  ui.grade=['7','8'].includes(params.get('grade'))?Number(params.get('grade')):'all';
  renderLibrary();
 }
});
