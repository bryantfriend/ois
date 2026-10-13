import {stationArt,stationArtUrl} from './coastal-station-art.js';
import {regions} from './coastal-geography.js';
import {t,registerTranslations} from './coastal-i18n.js';
for(const row of [
 ['Geography passport','Географический паспорт','Географиялык паспорт'],['Passport','Паспорт','Паспорт'],
 ['Destinations','Пункты назначения','Бара турган шаарлар'],['All destinations','Все пункты назначения','Бардык шаарлар'],
 ['Highlight destination city','Выделить город назначения','Бара турган шаарды белгилөө'],
 ['Close geography passport','Закрыть географический паспорт','Географиялык паспортту жабуу'],
 ['Passport regions','Регионы паспорта','Паспорттун аймактары'],['All countries','Все страны','Бардык өлкөлөр'],
 ['Destination symbol','Символ пункта назначения','Бара турган жердин белгиси'],
 ['Find city on map','Найти город на карте','Шаарды картадан табуу'],['Visited','Посещено','Барган жер'],
 ['Opens in round','Открывается в раунде','Ачыла турган айлампа'],['← Previous','← Назад','← Артка'],['Next →','Далее →','Кийинки →'],
 ['Small landmark badges show each passenger’s destination. Learn the symbols in your passport.','Маленькие значки показывают, куда едут пассажиры. Изучайте символы в паспорте.','Кичинекей белгилер жүргүнчүлөр кайда барарын көрсөтөт. Белгилерди паспорттон үйрөнүңүз.'],
 ['Match the landmark on a passenger to its city. The same symbol stays above the vehicle until arrival.','Сопоставьте значок пассажира с городом. Этот символ остаётся над транспортом до прибытия.','Жүргүнчүнүн белгисин шаар менен дал келтириңиз. Белги унаанын үстүндө жеткенге чейин турат.']
])registerTranslations(...row);

export const destinationArtUrl=(world,id)=>new URL('../assets/coastal/destinations/'+world+'/'+id+'.webp',import.meta.url).href;

export function createDestinationArtwork(state,onLoad){
 state.destinationFilter='all';
 const images=new Map();
 function get(id){const key=state.world+'-'+id;if(!images.has(key)){const image=new Image();image.src=destinationArtUrl(state.world,id);image.onload=onLoad;images.set(key,image);}return images.get(key);}
 for(let id=0;id<stationArt.length;id++)get(id);
 return {url:id=>destinationArtUrl(state.world,id),status:()=>({loaded:[...images.values()].filter(i=>i.complete&&i.naturalWidth>0).length,total:stationArt.length}),draw(ctx,id,x,y,r){
  const image=get(id);ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle='#fffdf0';ctx.fill();ctx.clip();
  if(image.complete&&image.naturalWidth>0){ctx.drawImage(image,x-r,y-r,r*2,r*2);}else{ctx.fillStyle='#174c59';ctx.font=`bold ${Math.max(7,r*.6)}px system-ui`;ctx.textAlign='center';ctx.fillText(stationArt[id]?.city.slice(0,3)??String(id+1),x,y+r*.2);}
  ctx.restore();ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.strokeStyle='#174c59';ctx.lineWidth=Math.max(1,r*.07);ctx.stroke();
 }};
}

export function installDestinationFilter({side,state,stops,node,draw}){
 const panel=node('details',null,'coastal-shape-filter coastal-destination-filter'),heading=node('summary','Destinations'),select=node('select'),info=node('p');select.setAttribute('aria-label',t('Highlight destination city'));panel.append(heading,select,info);side.prepend(panel);let key='';
 select.onchange=()=>{state.destinationFilter=select.value==='all'?'all':Number(select.value);const city=stops[state.destinationFilter];if(city){state.camera.x=500-city.x*state.camera.zoom;state.camera.y=280-city.y*state.camera.zoom;}key='';refresh();draw();};
 function refresh(){const next=JSON.stringify([state.world,state.round,state.destinationFilter]);if(next===key)return;key=next;select.replaceChildren();for(const id of ['all',...state.activeStops]){const option=node('option',id==='all'?t('All destinations'):t(stops[id].name));option.value=id;option.selected=String(id)===String(state.destinationFilter);select.append(option);}const art=stationArt[state.destinationFilter];heading.textContent=t('Destinations')+(art?' · '+t(art.city):'');info.textContent=art?t(art.landmark)+' · '+t(art.city):t('Small landmark badges show each passenger’s destination. Learn the symbols in your passport.');}
 return {refresh};
}

export function installLandmarkPassport({state,stops,node,mapKey,draw}){
 const content=mapKey.content;content.className='coastal-landmark-ref-content';let region='all',page=0,key='';
 const close=mapKey.dialog.firstElementChild;close.textContent='×';close.setAttribute('aria-label',t('Close geography passport'));close.classList.add('coastal-landmark-ref-close');
 function button(label,action){const b=node('button',t(label));b.type='button';b.onclick=action;return b;}
 function render(){
  content.replaceChildren();const intro=node('p',t('Match the landmark on a passenger to its city. The same symbol stays above the vehicle until arrival.'),'coastal-landmark-ref-intro');content.append(intro);
  const tabs=node('nav',null,'coastal-landmark-ref-tabs');tabs.setAttribute('aria-label',t('Passport regions'));for(const r of [{id:'all',name:state.world==='kyrgyzstan'?'Kyrgyzstan':'All countries'},...regions]){const tab=button(r.name,()=>{region=r.id;page=0;key='';refresh();});tab.setAttribute('aria-pressed',String(region===r.id));tabs.append(tab);}content.append(tabs);
  const entries=stops.filter(s=>region==='all'||s.region===region),pages=Math.max(1,Math.ceil(entries.length/6));page=Math.min(page,pages-1);const spread=node('div',null,'coastal-landmark-ref-spread');
  for(const city of entries.slice(page*6,page*6+6)){const art=stationArt[city.id],card=node('article',null,'coastal-landmark-ref-stamp'),emblem=node('img'),picture=node('img'),text=node('div',null,'coastal-landmark-ref-caption');card.dataset.passportCity=city.id;emblem.src=destinationArtUrl(state.world,city.id);emblem.alt=t('Destination symbol')+' · '+t(art.landmark);emblem.className='coastal-landmark-ref-emblem';picture.src=state.world==='kyrgyzstan'&&city.id===8?emblem.src:stationArtUrl(city.id);picture.alt=t(art.landmark)+' · '+t(city.name);picture.className='coastal-landmark-ref-picture';picture.onerror=()=>{picture.onerror=null;picture.src=emblem.src;};text.append(node('h4',t(city.name)),node('p',t(art.landmark)),node('small',t(regions.find(r=>r.id===city.region).name)));card.append(emblem,picture,text);
   const visit=state.expedition?.visits?.[city.id];if(visit)card.append(node('span',t('Visited')+' · '+t('Round')+' '+visit.round,'coastal-landmark-ref-visited'));
   if(state.activeStops.includes(city.id)){const find=button('Find city on map',()=>{state.destinationFilter=city.id;state.camera={zoom:Math.max(1,state.camera.zoom),x:0,y:0};state.camera.x=500-city.x*state.camera.zoom;state.camera.y=280-city.y*state.camera.zoom;state.cameraReady=true;mapKey.dialog.close();draw();});card.append(find);}else card.append(node('small',t('Opens in round')+' '+city.round,'coastal-landmark-ref-locked'));
   spread.append(card);
  }content.append(spread);const navigation=node('nav',null,'coastal-landmark-ref-pages'),previous=button('← Previous',()=>{page--;key='';refresh();}),next=button('Next →',()=>{page++;key='';refresh();});previous.disabled=page===0;next.disabled=page===pages-1;navigation.append(previous,node('span',(page+1)+' / '+pages),next);content.append(navigation);
 }
 function refresh(){const next=JSON.stringify([state.world,state.language,state.round,state.expedition?.visits,region,page]);if(next===key)return;key=next;render();}
 return {refresh};
}
