/* Original layered SVG illustration: no raster runtime assets. */
(() => {
const names=['Kestrel','Atlas Hauler','Moon Manta','Peregrine','Aurora Express','Iron Beetle','Solar Swan','Comet Runner','Nebula Whale','Thunderbird','Lunar Fox','Titan Mule','Starlight Ray','Nova Arrow','Cloud Albatross','Copper Scarab','Polar Tern','Meteor Swift','Cosmic Leviathan','Phoenix'];
const colours=['#39c6d9','#ffae50','#9989fc','#69e5b1','#f780ad','#e1b66c','#7bd9ec','#fc7863','#a8b5ff','#f0d86d','#a8e6c8','#c49169','#62daed','#cc92f5','#efb4d2','#f6b35a','#b3d3f7','#a8e06b','#90b6f7','#ff9476'];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const bolt=(x,y,r=3)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#b2c1c9" stroke="#3a5364" stroke-width="1.5"/><path d="M${x-r/2} ${y}h${r}" stroke="#354e5c"/>`;
const defs=`<defs>
<linearGradient id="sky" x2=".8" y2="1"><stop stop-color="#061c3a"/><stop offset=".65" stop-color="#174866"/><stop offset="1" stop-color="#64a1ac"/></linearGradient>
<radialGradient id="planet"><stop stop-color="#5fa5be"/><stop offset=".65" stop-color="#237395"/><stop offset="1" stop-color="#0c325b"/></radialGradient>
<linearGradient id="hull" x2=".15" y2="1"><stop stop-color="#f6faf0"/><stop offset=".3" stop-color="#d5e2e3"/><stop offset=".55" stop-color="#9eafb7"/><stop offset=".58" stop-color="#e9ece2"/><stop offset="1" stop-color="#5d7483"/></linearGradient>
<linearGradient id="metal" x2="0" y2="1"><stop stop-color="#647b8c"/><stop offset=".3" stop-color="#b0c0c8"/><stop offset=".45" stop-color="#3e5669"/><stop offset="1" stop-color="#172e42"/></linearGradient>
<linearGradient id="gold" x2=".4" y2="1"><stop stop-color="#ffe6a6"/><stop offset=".3" stop-color="#ffc65e"/><stop offset=".55" stop-color="#e59b31"/><stop offset="1" stop-color="#8f5426"/></linearGradient>
<linearGradient id="glass" x2=".8" y2="1"><stop stop-color="#63e5f0"/><stop offset=".35" stop-color="#1f7f9a"/><stop offset=".5" stop-color="#164360"/><stop offset="1" stop-color="#071b33"/></linearGradient>
<linearGradient id="bay" x2="0" y2="1"><stop stop-color="#101f31"/><stop offset=".6" stop-color="#243948"/><stop offset="1" stop-color="#4d6265"/></linearGradient>
<linearGradient id="deck" x2=".2" y2="1"><stop stop-color="#334f60"/><stop offset="1" stop-color="#142b40"/></linearGradient>
<linearGradient id="crateShade" x2=".2" y2="1"><stop stop-color="#fff" stop-opacity=".35"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#00132b" stop-opacity=".5"/></linearGradient>
<linearGradient id="flame"><stop stop-color="#ff8738" stop-opacity="0"/><stop offset=".55" stop-color="#ffb655"/><stop offset="1" stop-color="#fff7be"/></linearGradient>
<pattern id="hazard" width="28" height="20" patternUnits="userSpaceOnUse" patternTransform="skewX(-35)"><rect width="28" height="20" fill="#e6ad4d"/><rect width="14" height="20" fill="#192f40"/></pattern>
<pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#8ddbe8" stroke-opacity=".08"/></pattern>
<filter id="glow" x="-70%" y="-70%" width="240%" height="240%"><feGaussianBlur stdDeviation="4"/></filter>
<filter id="shadow" x="-30%" y="-30%" width="170%" height="190%"><feDropShadow dx="0" dy="9" stdDeviation="7" flood-color="#020a15" flood-opacity=".5"/></filter>
<clipPath id="window-clip"><rect x="55" y="90" width="1330" height="380" rx="20"/></clipPath>
<clipPath id="hold-clip"><rect x="795" y="343" width="356" height="160" rx="13"/></clipPath>
</defs>`;
function background(){let stars='',truss='',floor='',buildings='';for(let i=0;i<100;i++){const x=(i*173+41)%1440,y=(i*67+27)%470;stars+=`<circle cx="${x}" cy="${y}" r="${i%7===0?1.8:.8}" fill="#b4eaff" opacity="${.2+(i%5)*.15}"/>`;}
for(let i=0;i<12;i++){const x=i*130;truss+=`<path d="M${x} 55l65 65 65-65M${x} 120l65-65 65 65" stroke="#4c6b7f" stroke-width="5" fill="none"/>`;}
for(let i=0;i<15;i++)floor+=`<path d="M720 450L${-800+i*220} 730" stroke="#89b5c4" stroke-opacity=".12"/>`;
for(let i=0;i<32;i++){const x=i*49,h=20+(i*43)%120;buildings+=`<rect x="${x}" y="${448-h}" width="${20+i%3*6}" height="${h}" fill="#133b53"/><path d="M${x+4} ${458-h}v${h-20}" stroke="#5cacc1" stroke-width="2" stroke-dasharray="3 9"/>`;}
return `${defs}<rect width="1440" height="730" fill="#10283b"/><g clip-path="url(#window-clip)"><rect x="0" y="65" width="1440" height="440" fill="url(#sky)"/>${stars}<circle cx="1125" cy="135" r="190" fill="#82e9f5" opacity=".12" filter="url(#glow)"/><circle cx="1125" cy="135" r="180" fill="url(#planet)"/><path d="M1000 2q-60 80 70 85l-25 65 120 39 28-59 75 2-12-88-74-18-65-60M1123 218l-30 51 85 22 74-49" fill="#72b9a9" opacity=".45"/><path d="M947 128a180 180 0 0 1 273-147" stroke="#b4faff" stroke-width="5" fill="none" opacity=".6"/><ellipse cx="1120" cy="175" rx="290" ry="27" fill="none" stroke="#bad6dd" stroke-width="5" opacity=".2" transform="rotate(-20 1120 175)"/><path d="M0 391l85-29 96 22 95-52 136 49 96-35 105 47 145-21 95 20 92-29 154 26 146-33 145 39V490H0Z" fill="#1e5570"/>${buildings}<path d="M0 460Q400 422 1440 452" stroke="#5ec5d8" stroke-width="3" fill="none" opacity=".6"/><g transform="translate(165 190) rotate(-12)" opacity=".6"><path d="M0 0h60l20 9-20 8H0l-10-8Z" fill="#c0e8ec"/><path d="M20 2l10-18h14l-5 18M20 14l10 19h14l-5-19" fill="#6d9ba9"/><path d="M-12 8h-65" stroke="#b7e8f1" stroke-opacity=".3" stroke-width="2"/></g></g>
<rect x="55" y="90" width="1330" height="380" rx="20" fill="none" stroke="#618294" stroke-width="10"/><rect x="64" y="99" width="1312" height="362" rx="13" fill="url(#grid)"/><path d="M90 114h180M80 124h65" stroke="#bae5e9" opacity=".25" stroke-width="3"/>
<rect y="45" width="1440" height="18" fill="#112236"/><g>${truss}</g><path d="M0 123H1440M0 53H1440" stroke="#6c8795" stroke-width="9"/><path d="M0 130H1440" stroke="#101e30" stroke-width="14"/>
<g fill="#1b3449" stroke="#6c8997" stroke-width="3"><path d="M0 122h48v375H0ZM1392 122h48v375h-48Z"/><path d="M460 130h18v338h-18Z" opacity=".6"/></g><g stroke="#a2dee8" stroke-width="4" opacity=".6"><path d="M19 170v70M1414 170v70"/></g>
<path d="M0 480H1440V730H0Z" fill="url(#deck)"/>${floor}<path d="M0 533H1440M0 603H1440M0 699H1440" stroke="#6b8b9d" stroke-opacity=".2"/><path d="M620 551h720l-95 31H580Z" fill="#081c2a" stroke="#4d6a7c" stroke-width="2"/><path d="M669 552h583" stroke="#f0c16e" stroke-width="4" stroke-dasharray="28 12"/><ellipse cx="991" cy="548" rx="293" ry="31" fill="#000b1b" opacity=".45"/>
<g transform="translate(65 365)"><path d="M0 10l85-10 12 105-86 12Z" fill="#263f50" stroke="#658595" stroke-width="3"/><path d="M9 20l66-7 7 63-66 8Z" fill="#081e32" stroke="#83b3c5"/><text x="22" y="41" fill="#7ffbd3" font-size="10" font-family="monospace">DOCK 07</text><path d="M23 55h38M23 65h26" stroke="#57c6d0" stroke-width="3"/><circle cx="31" cy="96" r="5" fill="#f9c26f"/><circle cx="59" cy="92" r="5" fill="#6df4bf"/><path d="M35 111v35h38v-40" fill="#1a3146" stroke="#63808d" stroke-width="3"/></g>
<g transform="translate(1190 590)"><path d="M0 0h120l22 55H-15Z" fill="#213c50" stroke="#547486" stroke-width="2"/><path d="M5 5h106l7 14H0Z" fill="url(#hazard)"/><rect x="22" y="25" width="65" height="20" rx="4" fill="#071c2c"/><text x="54" y="40" text-anchor="middle" font-family="monospace" font-size="11" fill="#81e8db">OIS / 07</text></g>
<path d="M190 612h880l41 87H143Z" fill="#122a3d" stroke="#5b7c8d" stroke-width="3"/><path d="M179 657h907l14 30H159Z" fill="#081c2d"/><path d="M183 661h899" stroke="#4bc3d3" stroke-width="3"/><g fill="#738d98" stroke="#152e41" stroke-width="4">${Array.from({length:25},(_,i)=>`<ellipse cx="${190+i*36}" cy="678" rx="12" ry="6"/>`).join('')}</g>
<text x="205" y="714" fill="#7a9daf" font-family="monospace" font-size="9" letter-spacing="4">CARGO SUPPLY / REUSABLE STOCK</text>
<g transform="translate(1242 650)"><ellipse cx="30" cy="36" rx="37" ry="9" fill="#081a29"/><path d="M6 7l4-29h42l4 29-6 24H12Z" fill="#c5dbe0" stroke="#3d687b" stroke-width="3"/><rect x="9" y="-17" width="44" height="24" rx="11" fill="#09263d"/><path d="M19-5q4-9 9 0M35-5q4-9 9 0" fill="none" stroke="#76ffe2" stroke-width="3"/><path d="M4 7l-13 13M56 7l13 13" stroke="#dcba6d" stroke-width="6"/><circle cx="31" cy="18" r="4" fill="#e7bc72"/><path d="M31-23v-13" stroke="#92adb8" stroke-width="3"/><circle cx="31" cy="-39" r="4" fill="#74fbd2" class="beacon"/></g>`;
}
function ship(id,{mini=false}={}){
const family=id%5,series=Math.floor(id/5),accent=colours[id],name=names[id];
const bodies=[
'M690 326L762 286H1118Q1269 287 1331 402L1328 459Q1291 512 1198 520H739L686 473Z',
'M690 306L747 277H1163L1285 326 1326 381V478L1268 524H731L685 472Z',
'M660 366Q695 282 863 282H1092Q1270 282 1345 398L1326 470Q1227 517 1070 518H789Q684 505 660 448Z',
'M696 352L809 285 1100 302 1261 339 1360 411 1288 478 1108 521H754L699 464Z',
'M673 340Q727 262 835 284L1156 303Q1297 316 1329 391L1337 457Q1309 510 1199 520H751Q697 500 673 454Z'];
const wings=[
'M789 303L744 208H803L921 303M963 494L1012 574H1143L1082 491',
'M770 300L730 239H840L892 300M905 500L940 558H1193L1097 498',
'M811 316L715 233H808L1009 303M800 468L674 543H804L954 491',
'M805 318L855 229H909L958 319M1020 474L1110 553H1270L1148 466',
'M744 319L716 227H776L860 319M920 486L960 563H1080L1027 486'];
const cockpits=[
'M1201 333q62 18 92 63l9 45-91-4-30-29Z',
'M1195 325h49l49 40 15 72-103-6-22-31Z',
'M1196 334q92 4 111 75l-13 32-97-8q-30-40-1-99Z',
'M1190 343l61 13 66 55-107 18-29-26Z',
'M1202 337q63 1 83 41l16 57-100-3-20-31Z'];
const cockpitFrames=[
'M1243 354l-4 66M1196 401l103 8',
'M1226 334l-3 91M1264 353l-6 77M1190 391l109 10',
'M1239 344v86M1193 384l106 15',
'M1225 355l-12 59M1262 376l-15 44',
'M1220 343l-1 78M1264 353l-15 74M1191 393h101'];
let details='';
for(let i=0;i<5;i++)details+=`<path d="M${825+i*58} 310v15" stroke="#647e8a" stroke-width="2"/>${bolt(824+i*58,315,2)}`;
for(let i=0;i<6;i++)details+=`<path d="M${813+i*54} 511v-9" stroke="#415d70" stroke-width="2"/>`;
const extras=series===0?`<path d="M744 283v-55h25l31 55" fill="${accent}" stroke="#122e44" stroke-width="4"/>`:series===1?`<path d="M921 292l25-63h73l30 68" fill="url(#hull)" stroke="#173447" stroke-width="4"/><rect x="950" y="245" width="40" height="13" rx="4" fill="${accent}"/>`:series===2?`<g fill="${accent}" stroke="#143247" stroke-width="4"><path d="M703 337l-42-74h60l41 76Z"/><path d="M1065 305l25-69h51l21 73Z"/></g>`:`<path d="M778 298l57-70 153 4 37 68" fill="#1e3a51" stroke="#88a0ab" stroke-width="4"/><path d="M836 239h135l23 48H802Z" fill="${accent}"/><path d="M853 250h74" stroke="#e9fff4" stroke-width="5"/>`;
return `<g ${mini?'': 'filter="url(#shadow)"'}>
<g id="engine-flames" opacity="0"><path class="engine-fire" d="M706 379Q603 325 488 397Q607 450 706 419Z" fill="url(#flame)"/><path class="engine-fire" d="M706 445Q600 405 530 462Q639 493 707 472Z" fill="url(#flame)"/></g>
<path d="${wings[family]}" fill="${accent}" stroke="#10283d" stroke-width="5"/><path d="M778 311L766 257M992 513l57 46h49" stroke="#d2f5ed" stroke-opacity=".5" stroke-width="3" fill="none"/>${extras}
<g stroke="#18374d" stroke-width="4"><path d="M768 491v53h35v-53M1176 491v53h34v-53" fill="#93a9b2"/><path d="M749 548h76M1157 548h76" stroke-width="12" stroke-linecap="round"/></g>
<path d="${bodies[family]}" fill="url(#hull)" stroke="#102b41" stroke-width="5"/>
<path d="M707 346L768 307H1147Q1250 313 1285 358L1191 342H769L707 377Z" fill="#ffffff" opacity=".65"/>
<path d="M717 460L769 488H1219L1270 469 1293 486 1218 512H750L707 474Z" fill="${accent}" stroke="#2c4b5d" stroke-width="2"/>
<path d="M719 333l28-24v173l-30-16Z" fill="${accent}"/><path d="M753 318v167" stroke="#e5f4ef" stroke-width="4"/>
<g><rect x="667" y="351" width="61" height="102" rx="18" fill="url(#metal)" stroke="#0c263b" stroke-width="5"/><ellipse cx="671" cy="402" rx="20" ry="46" fill="#1d3043" stroke="#9cabb0" stroke-width="5"/><ellipse cx="669" cy="402" rx="12" ry="31" fill="#efb663"/><ellipse cx="670" cy="402" rx="6" ry="22" fill="#fff2b2"/><path d="M692 359v87M706 357v90" stroke="#273e52" stroke-width="6"/></g>
${series===1||series===3?'<g fill="#31485b" stroke="#9daeb7" stroke-width="3"><rect x="691" y="453" width="84" height="34" rx="13"/><path d="M705 460h48M705 470h48" stroke="#ecb561" stroke-width="4"/></g>':''}
${series===2?`<path d="M743 293l-25-31h-61v27h65l15 28M750 489l-35 32h-64v-27h62l21-24" fill="${accent}" stroke="#173448" stroke-width="4"/><g fill="url(#metal)" stroke="#132d42" stroke-width="4"><rect x="636" y="253" width="42" height="45" rx="12"/><rect x="631" y="485" width="46" height="44" rx="12"/></g><path d="M646 265v20M641 496v20" stroke="#ffe3a1" stroke-width="8"/>`:''}
<path d="${cockpits[family]}" fill="url(#glass)" stroke="#27495d" stroke-width="6"/><path d="M1204 346q43 11 64 40l-59-5Z" fill="#bdffff" opacity=".28"/><path d="${cockpitFrames[family]}" stroke="#75959f" stroke-width="4"/>
<path d="M1308 451h13M1313 459h9" stroke="#ffd690" stroke-width="4"/>
<text x="1193" y="479" text-anchor="middle" fill="#29485d" font-size="23" font-weight="900" font-family="Arial">OIS</text><text x="783" y="334" fill="#2b4b5c" font-size="8" letter-spacing="2" font-family="monospace">${String(id+1).padStart(2,'0')} / ${esc(name.toUpperCase())}</text>
${details}
<path d="M795 336H1147L1170 358V496L1146 514H795L776 492V357Z" fill="#152c40" stroke="#557182" stroke-width="5"/><path d="M803 341H1144L1157 359V493L1140 503H802L787 488V360Z" fill="url(#bay)" stroke="#b3bec1" stroke-width="5"/>
<g clip-path="url(#hold-clip)"><path d="M831 343v160M895 343v160M959 343v160M1023 343v160M1087 343v160" stroke="#79929b" stroke-width="2" opacity=".25"/><path d="M795 468h360" stroke="#162d3d" stroke-width="9"/><path d="M795 493h356" stroke="#a6b8b7" stroke-width="7"/><g id="loaded-cubes"></g>
<g id="bay-door" transform="translate(0,-170)"><rect x="791" y="337" width="366" height="172" rx="8" fill="url(#hull)" stroke="#3c5668" stroke-width="5"/><path d="M803 372h341M803 402h341M803 432h341M803 462h341" stroke="#79919c" stroke-width="3"/><path d="M809 347h327v25H809Z" fill="${accent}"/><text x="974" y="449" text-anchor="middle" fill="#274d62" font-size="34" letter-spacing="7" font-family="Arial" font-weight="900">OIS</text><text x="974" y="482" text-anchor="middle" fill="#345b6b" font-size="9" letter-spacing="4" font-family="monospace">STARPORT CARGO</text></g></g>
<path d="M815 351h67M939 351h67M1061 351h62" stroke="#ffe2a2" stroke-width="5" stroke-linecap="round"/><path d="M795 508h356" stroke="url(#hazard)" stroke-width="8"/>
${[795,1147].map(x=>`${bolt(x,355,3)}${bolt(x,490,3)}`).join('')}
<path d="M1169 350v128" stroke="${accent}" stroke-width="4"/><circle cx="1173" cy="489" r="4" fill="#7affd0" class="beacon"/>
</g>`;
}
const cubeColours=['#2b9fe7','#f7a636','#56ce8d','#aa7be8','#ed728b','#57d3da'];
function cube(label,index=0,kind='',size=1){const colour=kind==='blue'?cubeColours[0]:kind==='orange'?cubeColours[1]:cubeColours[index%6];return `<g class="cube-shape" transform="scale(${size})"><path class="focus-ring" d="M-5-16H80V77H-5Z" fill="none" stroke="none"/><path d="M0 0L13-12H66L76 0V57L64 69H0Z" fill="${colour}" stroke="#102c46" stroke-width="3"/><path d="M0 0L13-12H66L76 0H0Z" fill="#fff" opacity=".27"/><path d="M64 0h12v57L64 69Z" fill="#082c4b" opacity=".35"/><rect x="0" y="0" width="64" height="69" rx="5" fill="url(#crateShade)" stroke="#122c43" stroke-width="2"/><rect x="6" y="8" width="52" height="51" rx="3" fill="#10364a" fill-opacity=".15" stroke="#fff" stroke-opacity=".28"/><path d="M0 9h64M0 58h64M10 0v69M54 0v69" stroke="#102e46" stroke-opacity=".5" stroke-width="3"/>${[[5,5],[59,5],[5,64],[59,64]].map(([x,y])=>bolt(x,y,2)).join('')}<path d="M19-8h32" stroke="#fff" stroke-opacity=".7" stroke-width="2"/><text x="32" y="40" dominant-baseline="middle" text-anchor="middle" fill="#fffef1" stroke="#0b3655" stroke-opacity=".4" stroke-width=".8" paint-order="stroke" font-family="Arial,sans-serif" font-weight="900" font-size="${label.length>5?12:label.length>3?16:label.length>2?23:32}">${esc(label)}</text><path d="M17 53h28" stroke="#001e35" stroke-opacity=".25" stroke-width="2"/></g>`;}
function robot(endpoint){
const base={x:Math.max(300,Math.min(1080,endpoint.x-150)),y:202},dx=endpoint.x-base.x,dy=endpoint.y-base.y,L=238,dist=Math.min(474,Math.hypot(dx,dy)),angle=Math.atan2(dy,dx)+Math.acos(Math.max(-1,Math.min(1,dist/(2*L)))),elbow={x:base.x+Math.cos(angle)*L,y:base.y+Math.sin(angle)*L};
const link=(a,b,w)=>{const length=Math.hypot(b.x-a.x,b.y-a.y),rot=Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI;return `<g transform="translate(${a.x} ${a.y}) rotate(${rot})"><path d="M20 ${-w/2}H${length-25}L${length-8} -12V12L${length-25} ${w/2}H20L5 12V-12Z" fill="url(#gold)" stroke="#152e41" stroke-width="4"/><path d="M30 ${-w/2+6}H${length-34}" stroke="#fff0c0" stroke-width="3"/><rect x="48" y="-8" width="${Math.max(0,length-100)}" height="16" rx="5" fill="#514833" stroke="#f6cc76" stroke-width="2"/><rect x="58" y="-4" width="${Math.max(0,length-130)}" height="8" rx="4" fill="#102a40"/><path d="M45 ${w/2+9}H${length-35}" stroke="#132c3f" stroke-width="11"/><path d="M45 ${w/2+9}H${length-90}" stroke="#a9bcc0" stroke-width="5"/>${bolt(35,0,4)}${bolt(length-33,0,4)}</g>`;};
const joint=(p,r)=>`<circle cx="${p.x}" cy="${p.y}" r="${r}" fill="#172f43" stroke="#d0b578" stroke-width="5"/><circle cx="${p.x}" cy="${p.y}" r="${r-9}" fill="url(#metal)" stroke="#0a2236" stroke-width="3"/><circle cx="${p.x}" cy="${p.y}" r="${r-17}" fill="#11364b" stroke="#75d5d0" stroke-width="3"/>${bolt(p.x,p.y,4)}`;
return `<g filter="url(#shadow)"><path d="M${base.x-60} 147h120l-10 36h-100Z" fill="url(#metal)" stroke="#112b42" stroke-width="4"/><rect x="${base.x-47}" y="155" width="94" height="22" rx="4" fill="url(#hazard)"/><path d="M${base.x} 172v32" stroke="#7a9aa6" stroke-width="25"/>${link(base,elbow,47)}${link(elbow,endpoint,39)}${joint(base,31)}${joint(elbow,28)}${joint(endpoint,22)}<g transform="translate(${endpoint.x} ${endpoint.y})"><path d="M-12 12v17h24V12" fill="url(#metal)" stroke="#163348" stroke-width="3"/><path d="M-11 27l-28 12v28l13 8M11 27l28 12v28l-13 8" fill="none" stroke="#10293b" stroke-width="12" stroke-linejoin="round"/><path d="M-11 27l-28 12v28l13 8M11 27l28 12v28l-13 8" fill="none" stroke="#d7ba72" stroke-width="7" stroke-linejoin="round"/><rect x="-18" y="20" width="36" height="15" rx="4" fill="url(#gold)" stroke="#102a40" stroke-width="3"/><circle cy="28" r="4" fill="#7dfbd5"/></g><path d="M${base.x+20} 184Q${base.x+90} 245 ${elbow.x+16} ${elbow.y-12}" fill="none" stroke="#0c2337" stroke-width="8"/><path d="M${base.x+20} 184Q${base.x+90} 245 ${elbow.x+16} ${elbow.y-12}" fill="none" stroke="#819b9f" stroke-width="2"/></g>`;
}
window.CargoArt={background,ship,cube,robot,names,colours,esc};
})();
