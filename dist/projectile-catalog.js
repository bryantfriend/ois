// Standalone game extracted from the supplied projectile-motion activity.
FORMATS['projectile-duel']={name:'Projectile Duel',icon:'🎯',emoji:'🎯',color:'#2563eb',accent:'#ffe47e',mode:'DUEL',standalone:'./projectile-duel.html',description:'Aim a cannon over the mountain and hit your opponent.'};
GAMES.push({id:'physics-8-projectile-duel',format:'projectile-duel',grade:8,subject:'physics',title:'Projectile Duel',topic:'Projectile motion · angle, power and gravity',minutes:'10–15',items:[]});
document.addEventListener('DOMContentLoaded',()=>{
    const params=new URLSearchParams(location.search);
    if(params.get('subject')==='physics'&&!params.has('game')){
        ui.subject='physics';ui.grade='all';renderLibrary();
    }
});
