/* Shared, dependency-free picture loader. The inline illustration needs no download. */
(() => {
 'use strict';
 const script=document.currentScript,base=new URL('../../',script.src),cache=new Map();
 const language=(document.documentElement.lang||'en').split('-')[0];
 const copy={
  en:{title:'Getting your game ready',pictures:'Loading pictures…',ready:'Almost ready…',failed:'Some pictures could not load.',help:'Check your connection, then try again.',retry:'Try again',back:'Back to games',picture:'pictures ready'},
  ru:{title:'Готовим игру',pictures:'Загружаем картинки…',ready:'Почти готово…',failed:'Не удалось загрузить некоторые картинки.',help:'Проверьте соединение и попробуйте ещё раз.',retry:'Попробовать снова',back:'К играм',picture:'картинок готово'},
  ky:{title:'Оюнду даярдап жатабыз',pictures:'Сүрөттөр жүктөлүүдө…',ready:'Дээрлик даяр…',failed:'Айрым сүрөттөр жүктөлгөн жок.',help:'Интернет байланышын текшерип, кайра аракет кылыңыз.',retry:'Кайра аракет кылуу',back:'Оюндарга кайтуу',picture:'сүрөт даяр'}
 }[language]||null;
 const words=copy||{title:'Getting your game ready',pictures:'Loading pictures…',ready:'Almost ready…',failed:'Some pictures could not load.',help:'Check your connection, then try again.',retry:'Try again',back:'Back to games',picture:'pictures ready'};
 const host=document.createElement('div');host.id='classroom-loading';
 const shadow=host.attachShadow({mode:'open'});
 shadow.innerHTML=`<style>
 :host{font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#173e50}*{box-sizing:border-box}
 dialog{position:fixed;inset:0;margin:0;border:0;max-width:none;max-height:none;width:100%;height:100%;padding:24px;background:#f1f8f5;color:#173e50;overflow:auto}
 dialog[open]{display:grid;place-items:center}dialog::backdrop{background:#f1f8f5}
 article{text-align:center;width:min(440px,100%);margin:auto}svg{display:block;width:min(260px,72vw);height:190px;margin:0 auto 22px;overflow:visible}
 .cloud{animation:float 3s ease-in-out infinite}.spark{transform-origin:210px 40px;animation:twinkle 2s ease-in-out infinite}
 .eyebrow{font-size:12px;letter-spacing:3px;font-weight:750;color:#468778;margin:0 0 12px}h1{font-size:clamp(25px,5vw,34px);line-height:1.2;margin:0 0 12px;letter-spacing:-.8px}
 p{line-height:1.5;margin:8px 0;color:#526e76}.game-title{font-size:15px;overflow-wrap:anywhere;min-height:23px}
 progress{appearance:none;-webkit-appearance:none;border:0;width:100%;height:16px;display:block;border-radius:30px;overflow:hidden;background:#d5e5de;margin:24px 0 10px;color:#217f70}
 progress::-webkit-progress-bar{background:#d5e5de;border-radius:30px}progress::-webkit-progress-value{background:#217f70;border-radius:30px}progress::-moz-progress-bar{background:#217f70;border-radius:30px}
 .details{display:flex;justify-content:space-between;gap:12px;font-size:14px;font-variant-numeric:tabular-nums}.details strong{color:#217f70}
 .actions{margin-top:24px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap}button{font:700 14px system-ui;border:1px solid #bbd4cb;border-radius:12px;background:transparent;color:#355b61;padding:12px 18px;min-height:44px;cursor:pointer}button.primary{background:#217f70;border-color:#217f70;color:white}button:focus-visible{outline:3px solid #e2af43;outline-offset:4px}[hidden]{display:none!important}
 @keyframes float{50%{transform:translateY(-7px)}}@keyframes twinkle{50%{transform:scale(.75);opacity:.5}}
 @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
 </style><dialog aria-labelledby="loading-title" aria-describedby="loading-status"><article>
 <svg viewBox="0 0 280 200" aria-hidden="true"><ellipse cx="140" cy="178" rx="104" ry="12" fill="#dbece1"/><g class="cloud"><path d="M51 72c-25-1-28-31-6-36 2-23 35-27 44-5 27-6 37 31 12 37Z" fill="white"/><path d="M195 96c-23 0-26-27-6-32 4-20 31-20 37-2 25-2 28 30 4 32Z" fill="white"/></g><path d="M70 100q34-18 70 2v70q-36-20-70-3Z" fill="#ffdb84" stroke="#b68b38" stroke-width="3" stroke-linejoin="round"/><path d="M140 102q36-20 70-2v69q-34-17-70 3Z" fill="#fff9e6" stroke="#b68b38" stroke-width="3" stroke-linejoin="round"/><path d="M140 103v68M83 119q22-8 43 1M83 134q22-8 43 1M155 119q22-8 40-1M155 134q22-8 40-1" fill="none" stroke="#c8a55d" stroke-width="3" stroke-linecap="round"/><path d="M110 89l30-17 30 17-30 18Z" fill="#79baa6"/><path d="M110 89v25l30 17v-24Z" fill="#398b78"/><path d="M170 89v25l-30 17v-24Z" fill="#58a18d"/><path class="spark" d="M210 25l5 12 13 3-13 5-5 12-5-12-13-5 13-3Z" fill="#e8b04a"/><circle cx="80" cy="58" r="5" fill="#79baa6"/><circle cx="196" cy="147" r="4" fill="#e8b04a"/></svg>
 <p class="eyebrow">LET’S PLAY</p><h1 id="loading-title"></h1><p class="game-title"></p><p id="loading-status" role="status" aria-live="polite"></p>
 <progress max="100" value="0"></progress><div class="details"><span class="count"></span><strong class="percentage">0%</strong></div>
 <p class="help" hidden></p><div class="actions"><button class="primary retry" hidden></button><button class="back"></button></div>
 </article></dialog>`;
 document.documentElement.append(host);
 const find=s=>shadow.querySelector(s),dialog=find('dialog');
 find('h1').textContent=words.title;find('.retry').textContent=words.retry;find('.back').textContent=words.back;find('progress').setAttribute('aria-label',words.pictures);
 if(language==='ru')find('.eyebrow').textContent='ПОРА ИГРАТЬ';else if(language==='ky')find('.eyebrow').textContent='ОЙНОЙЛУ';
 let active=null;
 const state={visible:false,loaded:0,total:0,failed:0,title:''};
 function open(title){state.visible=true;state.title=title||'';find('.game-title').textContent=title||'';if(!dialog.open)dialog.showModal();}
 function close(){state.visible=false;if(dialog.open)dialog.close();}
 function progress(loaded,total){state.loaded=loaded;state.total=total;const value=total?Math.round(loaded/total*100):100;find('progress').value=value;find('.percentage').textContent=value+'%';find('.count').textContent=loaded+' / '+total+' '+words.picture;}
 function image(url){
  if(cache.has(url))return cache.get(url);
  const task=new Promise((resolve,reject)=>{
   const img=new Image();let settled=false;
   const finish=error=>{if(settled)return;settled=true;clearTimeout(timer);img.onload=img.onerror=null;error?reject(error):resolve(img);};
   const timer=setTimeout(()=>{finish(Error('Picture timed out'));img.src='';},45000);
   img.onload=()=>{if(img.decode)img.decode().then(()=>finish()).catch(()=>finish(Error('Picture could not be decoded')));else finish();};
   img.onerror=()=>finish(Error('Picture could not load'));img.src=url;
  });cache.set(url,task);task.catch(()=>cache.delete(url));return task;
 }
 async function prepare(paths,{title='',keepOpen=false,onCancel}={}){
  const urls=[...new Set(paths.filter(Boolean).map(p=>new URL(p,base).href))];
  if(active)return active.promise;
  let resolve;const promise=new Promise(r=>{resolve=r;});
  const session={promise,canceled:false,resolve,onCancel};active=session;
  const finish=ok=>{if(active!==session)return;active=null;if(!keepOpen||!ok)close();resolve(ok);};
  session.finish=finish;
  find('.retry').hidden=true;find('.help').hidden=true;find('#loading-status').textContent=words.pictures;state.failed=0;progress(0,urls.length);
  // A fast cached launch does not flash the screen.
  let delayed=setTimeout(()=>{if(active===session)open(title);},100);
  let remaining=urls;
  async function attempt(){
   const failed=[];let completed=urls.length-remaining.length,next=0;
   find('.retry').hidden=true;find('.help').hidden=true;find('#loading-status').textContent=words.pictures;state.failed=0;progress(completed,urls.length);
   await Promise.all(Array.from({length:Math.min(6,remaining.length)},async()=>{while(next<remaining.length&&!session.canceled){const url=remaining[next++];try{await image(url);completed++;}catch{failed.push(url);}if(active===session)progress(completed,urls.length);}}));
   if(session.canceled||active!==session)return;
   clearTimeout(delayed);
   if(failed.length){remaining=failed;state.failed=failed.length;open(title);find('#loading-status').textContent=words.failed;find('.help').hidden=false;find('.help').textContent=words.help;find('.retry').hidden=false;find('.retry').onclick=()=>{attempt();};return;}
   find('#loading-status').textContent=words.ready;progress(urls.length,urls.length);finish(true);
  }
  session.cancel=()=>{session.canceled=true;clearTimeout(delayed);finish(false);onCancel?.();};
  attempt();return promise;
 }
 function cancel(){active?.cancel();}
 dialog.addEventListener('cancel',e=>{e.preventDefault();if(active?.onCancel)cancel();});
 find('.back').onclick=()=>{if(active?.onCancel)cancel();else location.href=new URL('index.html',base).href;};
 function sources(root){return [...root.querySelectorAll('img[src],svg image[href],svg image[xlink\\:href]')].map(el=>el instanceof HTMLImageElement?(el.currentSrc||el.src):(el.getAttribute('href')||el.getAttribute('xlink:href'))).filter(src=>src&&!src.startsWith('data:')&&!src.startsWith('blob:')).map(src=>new URL(src,location.href).href);}
 const observed=new WeakSet();
 function watch(root){
  if(!root||observed.has(root))return;observed.add(root);let scheduled=false;
  const scan=()=>{scheduled=false;if(!root.isConnected||root.hidden)return;if(active){if(!scheduled){scheduled=true;active.promise.then(()=>requestAnimationFrame(scan));}return;}const urls=sources(root);if(urls.some(url=>!cache.has(url)))prepare(urls,{title:document.title,onCancel:()=>{if(typeof show==='function')show('home');else location.href=new URL('index.html',base).href;}});};
  new MutationObserver(()=>{if(!scheduled){scheduled=true;requestAnimationFrame(scan);}}).observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['src','href','xlink:href']});scan();
 }
 window.ClassroomLoading={prepare,cancel,watch,image,sources,state,base:base.href};
 window.addEventListener('pagehide',()=>{cancel();close();});
 async function boot(){
  document.body.append(host);
  if(script.dataset.mode!=='standalone')return;
  const page=script.dataset.page,assets=window.ClassroomLoadingAssets?.pages[page]||[];
  const ok=await prepare(assets,{title:document.title.split('·')[0].trim(),keepOpen:true});if(!ok)return;
  // Game clocks and narration start only after their pictures are decoded.
  const pending=[...document.querySelectorAll('script[data-loading-script]')];
  async function run(){
   const startupTimer=setTimeout(()=>open(document.title.split('·')[0].trim()),100);
   find('.retry').hidden=true;find('.help').hidden=true;find('#loading-status').textContent=words.ready;
   try{for(const placeholder of pending){if(placeholder.dataset.loaded)continue;await new Promise((resolve,reject)=>{const element=document.createElement('script');for(const {name,value} of placeholder.attributes)if(!['type','data-loading-script','data-loaded','src','defer','async'].includes(name))element.setAttribute(name,value);if(placeholder.dataset.loadingScript==='module')element.type='module';element.async=false;const src=placeholder.getAttribute('src');if(src){element.onload=resolve;element.onerror=()=>{element.remove();reject(Error('Game script could not load'));};element.src=src;}else{element.textContent=placeholder.textContent;if(element.type==='module'){const event='classroom-module-'+crypto.randomUUID();document.addEventListener(event,resolve,{once:true});element.textContent+='\n;document.dispatchEvent(new Event('+JSON.stringify(event)+'));';element.onerror=reject;}}
    placeholder.after(element);if(!src&&element.type!=='module')resolve();});placeholder.dataset.loaded='true';}
    clearTimeout(startupTimer);close();watch(document.body);document.dispatchEvent(new Event('classroom-ready'));
   }catch{clearTimeout(startupTimer);open(document.title.split('·')[0]);find('#loading-status').textContent=words.failed;find('.help').hidden=false;find('.help').textContent=words.help;find('.retry').hidden=false;find('.retry').onclick=run;}
  }
  await run();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
