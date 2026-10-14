// Bundled Kyrgyz narration. The same clips play on devices with no system Kyrgyz voice.
(() => {
 'use strict';
 let context=null,source=null,token=0;
 const cache=new Map();
 const getContext=()=>context ||= new (window.AudioContext||window.webkitAudioContext)();
 function unlock(){try{getContext().resume().catch(()=>{});}catch{}}
 document.addEventListener('pointerdown',unlock,{capture:true});
 document.addEventListener('keydown',unlock,{capture:true});
 function cancel(){token++;if(source){source.onended=null;try{source.stop();}catch{}source=null;}document.getElementById('helper')?.classList.remove('speaking');}
 function segments(text){if(window.KYRGYZ_AUDIO[text])return [text];const praise=Object.keys(window.KYRGYZ_AUDIO).find(x=>text.startsWith(x+' ')&&window.KYRGYZ_AUDIO[text.slice(x.length+1)]);return praise?[praise,text.slice(praise.length+1)]:[];}
 async function decode(text){if(!cache.has(text)){const bytes=Uint8Array.from(atob(window.KYRGYZ_AUDIO[text]),c=>c.charCodeAt(0));cache.set(text,getContext().decodeAudioData(bytes.buffer).catch(error=>{cache.delete(text);throw error;}));}return cache.get(text);}
 async function speak(text){cancel();const current=token;const parts=segments(text);if(!parts.length)throw Error('Missing Kyrgyz narration: '+text);const ctx=getContext();await ctx.resume();
  for(const part of parts){const buffer=await decode(part);if(current!==token)return;source=ctx.createBufferSource();source.buffer=buffer;source.connect(ctx.destination);document.getElementById('helper')?.classList.add('speaking');await new Promise(resolve=>{const playing=source;playing.onended=resolve;playing.start();window.KyrgyzVoice.lastPlayed=part;window.KyrgyzVoice.playCount++;setTimeout(resolve,(buffer.duration+.25)*1000);});if(current!==token)return;}
  source=null;document.getElementById('helper')?.classList.remove('speaking');
 }
 window.KyrgyzVoice={speak,cancel,segments,decode,playCount:0,lastPlayed:null,get contextState(){return context?.state||'uninitialized';}};
})();
