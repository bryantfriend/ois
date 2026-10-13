// One standalone network game, discoverable in both requested year groups.
FORMATS['coastal-connections']={name:'Landmark Connections',icon:'🧭',emoji:'🧭',color:'#157f91',accent:'#f7c65e',mode:'SOLO',standalone:'./coastal/index.html',description:'Explore UK or Kyrgyzstan transport networks, learn geography in English, Russian or Kyrgyz, and keep passengers moving.'};
for(const grade of [7,8]) GAMES.push({id:`geography-${grade}-coastal-connections`,format:'coastal-connections',grade,subject:'geography',title:'Landmark Connections',topic:'UK and Kyrgyzstan · landmarks, languages and transport',minutes:'10–20',items:[]});
document.addEventListener('DOMContentLoaded',()=>{
 const params=new URLSearchParams(location.search);
 if(params.get('subject')==='geography'&&!params.has('game')){
  ui.subject='geography';
  ui.grade=['7','8'].includes(params.get('grade'))?Number(params.get('grade')):'all';
  renderLibrary();
 }
});

// Use the same landmark destination artwork as the game, linked by transport routes.
function landmarkLibraryArt(){
 document.querySelectorAll('.art-coastal-connections').forEach(art=>{
  art.classList.add('landmark-network-art');
  art.innerHTML='<svg viewBox="0 0 800 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="800" height="320" fill="#e2eee4"/><path d="M0 200Q100 120 210 210T420 160T800 160V320H0Z" fill="#bdd5c4"/><path d="M60 260Q160 170 240 190T435 150T725 90" fill="none" stroke="#1c7b86" stroke-width="15" stroke-linecap="round"/><path d="M90 80Q240 40 390 210T710 220" fill="none" stroke="#dc9650" stroke-width="10" stroke-linecap="round"/>'+[[90,80,'uk',0,true],[240,190,'uk',1,false],[470,115,'kyrgyzstan',0,false],[710,220,'kyrgyzstan',1,false]].map(([x,y,w,id,v2])=>'<circle cx="'+x+'" cy="'+y+'" r="62" fill="#fffdf1" stroke="#214f57" stroke-width="5"/><image href="./coastal/assets/coastal/destinations/'+(v2?'v2/':'')+w+'/'+id+'.webp" x="'+(x-54)+'" y="'+(y-54)+'" width="108" height="108"/>').join('')+'<g transform="translate(335 145) rotate(-12)"><rect x="-32" y="-17" width="64" height="34" rx="8" fill="#fff8df" stroke="#214f57" stroke-width="4"/><path d="M-20-5H20" stroke="#76afbb" stroke-width="13"/><circle cx="-17" cy="19" r="6" fill="#214f57"/><circle cx="17" cy="19" r="6" fill="#214f57"/></g></svg><span class="format-tag">Landmark Connections</span>';
 });
}
document.addEventListener('DOMContentLoaded',()=>{const previous=renderLibrary;renderLibrary=function(){previous();landmarkLibraryArt();};landmarkLibraryArt();});
