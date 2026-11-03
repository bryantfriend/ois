const nodes=l=>l.nodes??[l.a,l.b];
const loop=l=>nodes(l).length>=4&&nodes(l)[0]===nodes(l).at(-1);
export const servesStop=(l,id)=>[nodes(l)[0],nodes(l).at(-1)].includes(id)||l.serviceMode!=='express'||!l.skipStops?.includes(id);
export function serviceEdges(l){
 const route=nodes(l),edges=[];let from=route[0],via=[from];
 for(const id of route.slice(1)){via.push(id);if(servesStop(l,id)){edges.push({a:from,b:id,type:l.type,link:l,via:[...via]});from=id;via=[id];}}
 return edges;
}
export function nextServiceStop(l,at){
 const list=nodes(l),count=list.length-1;let index=l.segment??0;
 for(let n=0;n<count+1;n++){const target=l.direction===1?list[index+1]:list[index];if(servesStop(l,target)&&target!==at)return target;index+=l.direction;if(loop(l))index=(index+count)%count;else if(index<0||index>=count)return target;}
 return at;
}
// Changes are applied only to an empty line, so no existing rider is stranded.
export function setServicePattern(state,index,mode,skipped=[],vehicleIndex=0){
 const parent=state.links[index];if(!parent)return 'Choose a line.';
 const l=[parent,...(parent.vehicles??[])][vehicleIndex];if(!l)return 'Choose a vehicle.';
 l.nodes=parent.nodes;l.type=parent.type;
 if(l.cargo.length||l.service?.passenger!=null)return 'Wait until this vehicle is empty to change its stops.';
 const list=nodes(l),allowed=list.slice(1,-1),skip=[...new Set(skipped)].filter(id=>allowed.includes(id));
 if(mode==='express'&&skip.length&&(!['road','rail','highspeed'].includes(l.type)||loop(l)))return 'Express needs a bus or train line with two ends.';
 l.serviceMode=mode==='express'?'express':'local';l.skipStops=l.serviceMode==='express'?skip:[];
 if(l.service&&!servesStop(l,l.service.at))l.service=null;
 state.editUndo=null;return null;
}
