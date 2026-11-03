export const PEOPLE={commuter:{name:'Commuter',colour:'#427b86',detail:'A familiar journey. Keep the connection easy.'},tourist:{name:'Tourist',colour:'#bd7546',detail:'Here for the landmarks and a good view.'},hiker:{name:'Hiker',colour:'#68894f',detail:'A little adventure starts at the next stop.'}};
export const TRIP_STAMPS=[{id:'sightseer',name:'Golden camera'},{id:'trail',name:'Trail pennant'},{id:'explorer',name:'Explorer star'}];
export function personKind(p){return p.personality??=(p.itinerary?'tourist':['commuter','tourist','hiker'][p.id%3]);}
export function prepareAtlasDay(s){
 if(s.atlasDay===s.round)return;
 s.atlasDay=s.round;s.serviceStreak={count:0,best:0,bonuses:0,earned:0};s.specialTrip=null;
}
export function specialOffer(s){
 if(s.playMode!=='campaign'||s.round<2||s.activeStops.length<3)return null;
 const points=[...s.activeStops],origin=points[0],visits=points.slice(1,4),stamp=TRIP_STAMPS[(s.round-2)%3];
 return {id:s.world+':'+s.round,origin,visits,stamp:stamp.id,name:stamp.name,reward:12};
}
export function acceptSpecialTrip(s){
 prepareAtlasDay(s);const offer=specialOffer(s);if(!offer||s.specialTrip||s.complete||s.failed)return false;
 const id=s.passengers.length;s.passengers.push({id,at:offer.origin,origin:offer.origin,destination:offer.visits[0],itinerary:offer.visits,itineraryIndex:0,mode:'waiting',wait:0,personality:offer.stamp==='trail'?'hiker':'tourist',special:true});
 s.specialTrip={...offer,passenger:id,status:'active'};return true;
}
export function trackAtlasWait(s){for(const p of s.passengers){personKind(p);p.longestWait=Math.max(p.longestWait??0,p.wait??0);}}
export function atlasDelivery(s,p,finished){
 if(!finished)return;prepareAtlasDay(s);const streak=s.serviceStreak;
 streak.count=(p.longestWait??0)<=20?streak.count+1:0;streak.best=Math.max(streak.best,streak.count);
 if(streak.count&&streak.count%5===0&&streak.bonuses<3&&s.playMode==='campaign'){streak.bonuses++;streak.earned+=2;s.credits+=2;s.roundIncome+=2;}
 if(p.special&&s.specialTrip?.passenger===p.id&&s.specialTrip.status==='active'){
  s.specialTrip.status='complete';s.credits+=s.specialTrip.reward;s.roundIncome+=s.specialTrip.reward;
  const quality=window.playablesBridge?.quality?.()??{},souvenirs=[...new Set([...(quality.souvenirs??[]),s.specialTrip.stamp])];window.playablesBridge?.setQuality?.({souvenirs});
 }
}
export function drawPersonBadge(ctx,p,x,y,r,z){
 const kind=personKind(p),size=Math.max(3,r*.44),cx=x+r*.78,cy=y+r*.7;ctx.save();ctx.translate(cx,cy);ctx.fillStyle=PEOPLE[kind].colour;ctx.strokeStyle='#fff9e9';ctx.lineWidth=1/z;ctx.beginPath();ctx.roundRect(-size,-size,size*2,size*1.6,1/z);ctx.fill();ctx.stroke();ctx.strokeStyle='#fff9e9';ctx.lineWidth=1/z;
 if(kind==='tourist'){ctx.beginPath();ctx.arc(0,-size*.2,size*.4,0,7);ctx.stroke();}else if(kind==='commuter'){ctx.strokeRect(-size*.4,-size*1.3,size*.8,size*.35);}else{ctx.beginPath();ctx.moveTo(-size*.6,0);ctx.lineTo(0,-size*.75);ctx.lineTo(size*.6,0);ctx.stroke();}
 if(p.special){ctx.fillStyle='#dfad43';ctx.beginPath();ctx.arc(0,-size*1.6,2/z,0,7);ctx.fill();}ctx.restore();
}
export function drawFleetSouvenir(ctx,id,x,y,z){
 if(!id)return;ctx.save();ctx.translate(x,y+17/z);ctx.scale(1/z,1/z);ctx.fillStyle='#e5b34f';ctx.strokeStyle='#5d5c31';ctx.lineWidth=1;
 ctx.beginPath();if(id==='sightseer'){ctx.roundRect(-5,-3,10,7,2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(0,.5,2,0,7);ctx.stroke();}else if(id==='trail'){ctx.moveTo(-3,5);ctx.lineTo(-3,-5);ctx.lineTo(5,-3);ctx.lineTo(-3,0);ctx.fill();ctx.stroke();}else{for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?2.5:5;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.fill();ctx.stroke();}ctx.restore();
}
export function drawAtlasAtmosphere(ctx,s,stops,time,reduced){
 const z=s.camera.zoom;const guest=s.specialTrip?.status==='active'?s.passengers[s.specialTrip.passenger]:null;if(guest){const p=stops[guest.destination];ctx.save();ctx.strokeStyle='#bc8a24';ctx.lineWidth=2/z;ctx.setLineDash([3/z,5/z]);ctx.beginPath();ctx.arc(p.x,p.y,29/z,0,7);ctx.stroke();ctx.restore();}if(z<.65)return;
 for(const id of s.activeStops){const p=stops[id],x=p.x-34/z,y=p.y+15/z,wave=reduced?0:Math.sin(time*2+id)*2;
 ctx.save();ctx.translate(x,y);ctx.scale(1/z,1/z);ctx.strokeStyle='#426f68';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,4);ctx.lineTo(0,-13);ctx.stroke();ctx.fillStyle=id%2?'#d4945f':'#559e93';ctx.beginPath();ctx.moveTo(1,-13);ctx.quadraticCurveTo(7,-16+wave,14,-11+wave);ctx.lineTo(14,-3+wave);ctx.quadraticCurveTo(7,-7,1,-5);ctx.fill();
 if((s.landmarkVisits?.[id]??0)>=3){ctx.fillStyle='#fff5d9';ctx.beginPath();ctx.arc(-7,7,5,0,7);ctx.fill();ctx.stroke();const a=reduced?-.8:time*.12;ctx.beginPath();ctx.moveTo(-7,7);ctx.lineTo(-7+Math.cos(a)*3,7+Math.sin(a)*3);ctx.moveTo(-7,7);ctx.lineTo(-7,4);ctx.stroke();}
 const recent=s.deliveryMoments?.some(e=>e.city===id&&s.elapsed-e.time<3);if(recent){ctx.fillStyle='#c38252';ctx.beginPath();ctx.arc(9,13,2.5,0,7);ctx.fill();ctx.fillRect(7,16,4,6);ctx.beginPath();ctx.moveTo(10,17);ctx.lineTo(15,12+wave);ctx.stroke();}ctx.restore();}
}
