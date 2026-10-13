import {registerTranslations} from './coastal-i18n.js';
for(const row of [
 ['Hard: tourists visit 2–3 landmarks in order, and geography events disrupt your network.','Сложный: туристы посещают 2–3 достопримечательности по порядку, а географические события влияют на сеть.','Кыйын: туристтер 2–3 көрүнүктүү жерге кезеги менен барышат, ал эми географиялык окуялар тармакка таасир этет.'],
 ['Some passengers are tourists: visit 2 landmarks in order, or 3 from round 8. Their badge changes after each visit. Each visit earns a fare; only a finished itinerary counts toward the round target. Geography events begin in round 3 with 12 seconds of warning.','Некоторые пассажиры — туристы: они посещают 2 достопримечательности по порядку, а с раунда 8 — три. Значок меняется после каждого посещения. За каждое посещение начисляется плата; в цель раунда засчитывается только весь маршрут. Географические события начинаются с раунда 3 с предупреждением за 12 секунд.','Айрым жүргүнчүлөр — туристтер: алар 2 көрүнүктүү жерге кезеги менен барышат, 8-айлампадан тартып үчөөнө барышат. Ар бир баргандан кийин белги өзгөрөт. Ар бир барган жер үчүн акы берилет; айлампанын максатына толук бүткөн саякат гана эсептелет. Географиялык окуялар 3-айлампадан башталып, 12 секунд мурда эскертилет.'],
 ['per landmark visit','за посещение достопримечательности','көрүнүктүү жерге барганы үчүн'],
 ['Tourist itinerary','Маршрут туриста','Туристтин саякаты'],['Tourist','Турист','Турист'],
 ['Gold diamonds mark tourists. The badge shows the next landmark to visit.','Золотые ромбы обозначают туристов. Значок показывает следующую достопримечательность.','Алтын ромбдор туристтерди белгилейт. Белги кийинки көрүнүктүү жерди көрсөтөт.'],
 ['Earn a fare at each visit. Finish the whole itinerary to deliver this tourist.','Получайте плату за каждое посещение. Завершите весь маршрут, чтобы доставить туриста.','Ар бир барган жер үчүн акы алыңыз. Туристти жеткирүү үчүн бүт саякатты аяктаңыз.'],
 ['Next visit','Следующее посещение','Кийинки бара турган жер'],['Later visit','Позже','Кийин бара турган жер'],['On board','В транспорте','Унаада'],['LANDMARK VISITED','ДОСТОПРИМЕЧАТЕЛЬНОСТЬ ПОСЕЩЕНА','КӨРҮНҮКТҮҮ ЖЕРГЕ БАРДЫ']
])registerTranslations(...row);

// Itineraries contain landmark visits, not interchange stops on a transport route.
export function addTouristItinerary(state,passenger){
 if(state.mode!=='hard')return passenger;
 const remaining=state.activeStops.filter(id=>id!==passenger.at&&id!==passenger.destination);
 const itinerary=[passenger.destination],length=state.round>=8?3:2;
 while(itinerary.length<length&&remaining.length){
  state.rng=(Math.imul(state.rng,1664525)+1013904223)>>>0;
  itinerary.push(remaining.splice(state.rng%remaining.length,1)[0]);
 }
 if(itinerary.length>1){passenger.itinerary=itinerary;passenger.itineraryIndex=0;}
 return passenger;
}

export function finishLandmarkVisit(passenger){
 if(!passenger.itinerary||passenger.itineraryIndex===passenger.itinerary.length-1)return true;
 passenger.itineraryIndex++;
 passenger.destination=passenger.itinerary[passenger.itineraryIndex];
 // Missions and crossing records describe this new leg of the tourist's trip.
 passenger.origin=passenger.at;passenger.crossings=[];
 return false;
}

export function validItinerary(passenger,stops){
 if(passenger.itinerary===undefined)return passenger.itineraryIndex===undefined;
 const visits=passenger.itinerary,index=passenger.itineraryIndex;
 return Array.isArray(visits)&&visits.length>=2&&visits.length<=3&&
  visits.every(id=>Number.isInteger(id)&&Boolean(stops[id]))&&new Set(visits).size===visits.length&&
  Number.isInteger(index)&&index>=0&&index<visits.length&&passenger.destination===visits[index]&&
  (passenger.mode!=='delivered'||index===visits.length-1);
}
