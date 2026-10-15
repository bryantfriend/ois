// Supported picture vocabulary and portable teacher lessons.
(() => {
 const words=window.PostVocabulary.items.map(item=>item.name);
 const defaults=()=>({title:'Animal Post Office',letters:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',words:[...words],stage:0});
 function validate(input){if(!input||typeof input!=='object')throw Error('Choose a valid Animal Post Office lesson.');const letters=Array.isArray(input.letters)?input.letters.join(''):String(input.letters||'');if(!/^[A-Za-z\s,]*$/.test(letters))throw Error('Use letters A–Z only.');const selected=[...new Set(letters.toUpperCase().replace(/[^A-Z]/g,''))].join('');if(selected.length<2)throw Error('Choose at least two letters.');if(!Array.isArray(input.words)||input.words.some(word=>!words.includes(word)))throw Error('Choose words from the illustrated vocabulary.');const chosen=[...new Set(input.words)];if(chosen.length<2)throw Error('Choose at least two words.');if(![0,1,2].includes(input.stage))throw Error('Choose a starting lesson.');return {title:String(input.title||'Animal Post Office').trim().slice(0,100)||'Animal Post Office',letters:selected,words:chosen,stage:input.stage};}
 window.PostLesson={words,defaults,validate};
})();
