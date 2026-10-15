// Shared natural classroom voice. Runtime audio is served with the game, not generated remotely.
(() => {
 'use strict';
 const base=new URL('.',document.currentScript.src),player=new Audio();player.preload='auto';
 const native=window.speechSynthesis,nativeSpeak=native?.speak.bind(native),nativeCancel=native?.cancel.bind(native);
 const normalize=text=>String(text).trim().replace(/\s+/g,' ').replace(/[.!?]+$/,'').toLowerCase();
 const clips=new Map(Object.entries(window.CLASSROOM_VOICE_MANIFEST?.clips||{}).map(([text,file])=>[normalize(text),new URL(file,base).href]));
 let token=0,finishPending=null;
 const packs=new Map();
 async function audioSource(uri){if(!uri.includes('.json#'))return uri;const url=new URL(uri),key=url.hash.slice(1);url.hash='';if(!packs.has(url.href))packs.set(url.href,fetch(url.href).then(response=>{if(!response.ok)throw Error('Voice pack unavailable');return response.json();}).catch(error=>{packs.delete(url.href);throw error;}));const entries=await packs.get(url.href),data=entries[key];if(!data)throw Error('Voice clip unavailable');return 'data:audio/mpeg;base64,'+data;}
 function resolveClips(text){const direct=clips.get(normalize(text));if(direct)return [direct];const parts=String(text).trim().split(/(?<=[.!?])\s+/).filter(Boolean),result=parts.map(part=>clips.get(normalize(part)));return result.length&&result.every(Boolean)?result:null;}
 function cancel(){token++;player.pause();player.onended=null;player.onerror=null;nativeCancel?.();if(finishPending){finishPending({reason:'canceled'});finishPending=null;}}
 async function speak(text,options={}){cancel();const current=token,lang=options.lang||'en-GB',paths=/^en(?:-|_|$)/i.test(lang)?resolveClips(text):null;let started=false;
  const onstart=()=>{if(current!==token||started)return;started=true;window.ClassroomVoice.playCount++;window.ClassroomVoice.lastPlayed=String(text);options.onstart?.();};
  if(paths){window.ClassroomVoice.lastBackend='natural-recorded';for(const uri of paths){if(current!==token)return {reason:'canceled'};let source=uri;if(uri.includes('.json#')){try{source=await audioSource(uri);}catch{if(current!==token)return {reason:'canceled'};options.onerror?.({reason:'error'});return {reason:'error'};}if(current!==token)return {reason:'canceled'};}const result=await new Promise(resolve=>{finishPending=resolve;player.src=source;player.onended=()=>{if(current!==token)return;finishPending=null;resolve({reason:'ended'});};player.onerror=()=>{if(current!==token)return;finishPending=null;resolve({reason:'error'});};player.play().then(onstart).catch(()=>{if(current!==token)return;finishPending=null;resolve({reason:'error'});});});if(result.reason!=='ended'){options.onerror?.(result);return result;}}options.onend?.();return {reason:'ended'};}
  window.ClassroomVoice.lastBackend='device';if(!nativeSpeak){options.onerror?.({reason:'unavailable'});return {reason:'unavailable'};}
  return new Promise(resolve=>{finishPending=resolve;const u=new SpeechSynthesisUtterance(text),voices=native.getVoices().filter(v=>v.lang.toLowerCase().startsWith(lang.slice(0,2).toLowerCase()));u.lang=lang;u.rate=.97;u.voice=voices.find(v=>/sonia|natural|neural|google/i.test(v.name))||voices[0]||null;u.onstart=onstart;const finish=reason=>{if(current!==token)return;finishPending=null;(reason==='ended'?options.onend:options.onerror)?.({reason});resolve({reason});};u.onend=()=>finish('ended');u.onerror=()=>finish('error');try{nativeSpeak(u);}catch{finish('error');}});
 }
 window.ClassroomVoice={speak,cancel,has:text=>!!resolveClips(text),playCount:0,lastPlayed:null,lastBackend:null,get playing(){return !player.paused||!!native?.speaking;},get currentTime(){return player.currentTime;},get source(){return player.src;}};
 // Existing mute/pause handlers also stop shared recordings.
 if(native)native.cancel=cancel;
 window.addEventListener('pagehide',cancel);
})();
