/* Whole-lesson text editing. Structured game data stays attached through reference IDs. */
(()=>{
const main=$('.editor-main'), panel=document.createElement('section');
panel.className='panel lesson-text-panel';
panel.innerHTML=`<div class="panel-heading"><h2>Edit the whole lesson</h2><button id="lesson-editor-toggle" class="button secondary">Detailed editor</button></div><div id="lesson-text-content"><p>Copy, paste, and edit your lesson in one place. Keep the Question and Answer labels. Use a new Wrong line for each wrong choice.</p><div class="lesson-text-actions"><button id="copy-lesson-text" class="button secondary">Copy lesson</button><button id="copy-lesson-prompt" class="button secondary">Copy AI instructions</button><button id="check-lesson-text" class="button secondary">Check lesson</button></div><label for="lesson-text">Whole lesson</label><textarea id="lesson-text" rows="22" spellcheck="true" aria-describedby="lesson-text-status"></textarea><p id="lesson-text-status" role="status">Changes are used when you play, save, or download.</p><details><summary>Paste format & tips</summary><pre>Title: My lesson
Topic: My topic

Question: What is 6 × 7?
Answer: 42
Wrong: 36
Wrong: 48
Hint: Think of six groups of seven.

Question: What is 5 × 5?
Answer: 25
Wrong: 20
Wrong: 30</pre><p>Hint and Explanation are optional. For sequences, separate steps with |. You can also paste spreadsheet rows: question, answer, wrong choices separated by semicolons, hint (tab-separated columns). Keep Reference lines with their questions to retain attached pictures or activity data. Use Detailed editor for pictures, maps, and game settings.</p></details></div>`;
main.prepend(panel);
const box=$('#lesson-text'), status=$('#lesson-text-status');
const detailsPanel=$('#lesson-title').closest('.panel'), questionsPanel=$('#question-rows').closest('.panel');
let textMode=true, pending=false, refs=new Map(), serial=0;
const basic=new Set(['prompt','answer','options','hint','explanation']);
const field=(label,value)=>label+': '+String(value||'').replace(/\n/g,'\n  ');
function serialize(){
 refs=new Map();serial=0;
 const rows=draft.items.map(q=>{
  const lines=[];
  if(Object.keys(q).some(k=>!basic.has(k))){const id='item-'+(++serial);refs.set(id,clone(q));lines.push('Reference: '+id);}
  lines.push(field('Question',q.prompt),field('Answer',q.answer));
  (q.options||[]).forEach(x=>lines.push(field('Wrong',x)));
  if(q.hint)lines.push(field('Hint',q.hint));
  if(q.explanation)lines.push(field('Explanation',q.explanation));
  return lines.join('\n');
 });
 return [field('Title',$('#lesson-title').value),field('Topic',$('#lesson-topic').value),'',rows.join('\n\n')].join('\n');
}
function paint(){
 panel.hidden=!draft;
 if(!draft)return;
 $('#lesson-text-content').hidden=!textMode;
 $('#lesson-editor-toggle').textContent=textMode?'Detailed editor':'One text box';
 detailsPanel.hidden=textMode;questionsPanel.hidden=textMode||draft.format==='maths'||(draft.subject==='boardgames'&&BOARD_GRADES[draft.format]);
}
function refresh(){if(!draft)return;box.value=serialize();pending=false;status.textContent='Changes are used when you play, save, or download.';status.classList.remove('text-error');paint();}
function parse(){
 let source=box.value.replace(/\r/g,'').trim().replace(/^```[^\n]*\n/,'').replace(/\n```$/,'');
 let title=$('#lesson-title').value,topic=$('#lesson-topic').value,items=[];
 if(source.includes('\t')&&!/^Question:/mi.test(source)){
  items=source.split('\n').filter(x=>x.trim()).map((line,i)=>{const [prompt,answer,wrong='',hint='',...extra]=line.split('\t');if(!answer||extra.length)throw Error('Row '+(i+1)+': use question, answer, wrong choices, and optional hint columns.');return {prompt,answer,options:wrong.split(';').map(x=>x.trim()).filter(Boolean),hint,explanation:''};});
 }else{
  let q=null,last=null,reference=null;const seen=new Set();
  const finish=()=>{if(q){items.push(q);q=null;}last=null;};
  for(const [index,line] of source.split('\n').entries()){
   if(!line.trim())continue;
   if(/^  /.test(line)&&last){last.object[last.key]+='\n'+line.slice(2);continue;}
   const m=line.match(/^(Title|Topic|Reference|Question|Q|Answer|A|Wrong|Hint|Explanation):\s*(.*)$/i);
   if(!m)throw Error('Line '+(index+1)+': use a label such as Question: or Answer:. Indent continuation lines with two spaces.');
   const key=m[1].toLowerCase(),value=m[2];last=null;
   if(key==='title'||key==='topic'){if(q)throw Error('Put Title and Topic before the questions.');if(key==='title')title=value;else topic=value;continue;}
   if(key==='reference'){finish();if(!refs.has(value)||seen.has(value))throw Error('Line '+(index+1)+': unknown or repeated Reference. Keep the original reference with its question.');seen.add(value);reference=value;continue;}
   if(key==='question'||key==='q'){finish();q={...(reference?clone(refs.get(reference)):{}),prompt:value,answer:'',options:[],hint:'',explanation:''};reference=null;last={object:q,key:'prompt'};continue;}
   if(!q)throw Error('Line '+(index+1)+': add Question: before its answer.');
   if(key==='wrong'){q.options.push(value);last={object:q.options,key:q.options.length-1};}
   else {const name=key==='a'?'answer':key;if(q[name])throw Error('Line '+(index+1)+': repeated '+key+' label.');q[name]=value;last={object:q,key:name};}
  }
  if(reference)throw Error('Add a question after the Reference line.');finish();
 }
 if(refs.size&&items.some(q=>!Object.keys(q).some(k=>!basic.has(k))))throw Error('This activity needs pictures or structured data. Keep its Reference lines, or add new activities in Detailed editor.');
 return {title,topic,items};
}
const originalRead=readDraft;
readDraft=function(){
 if(!textMode||!pending)return originalRead();
 const previous=draft,oldTitle=$('#lesson-title').value,oldTopic=$('#lesson-topic').value;
 try{const data=parse();draft={...draft,...data};$('#lesson-title').value=data.title;$('#lesson-topic').value=data.topic;const valid=originalRead();draft=valid;pending=false;status.textContent=valid.items.length+' activities ready. Play, save, or download your lesson.';status.classList.remove('text-error');return valid;}
 catch(error){draft=previous;$('#lesson-title').value=oldTitle;$('#lesson-topic').value=oldTopic;status.textContent=error.message;status.classList.add('text-error');throw error;}
};
box.addEventListener('input',()=>{pending=true;dirty=true;status.textContent='Edited — changes will be checked before playing or saving.';status.classList.remove('text-error');});
const oldOpen=openEditor;openEditor=function(...args){textMode=true;pending=false;oldOpen(...args);refresh();};
$('#lesson-editor-toggle').onclick=()=>{try{if(textMode){readDraft();textMode=false;renderRows();paint();}else{textMode=true;refresh();}}catch(e){notify(e.message);box.focus();}};
$('#check-lesson-text').onclick=()=>{try{pending=true;readDraft();}catch(e){notify(e.message);box.focus();}};
async function copy(text){try{await navigator.clipboard.writeText(text);notify('Copied. Ready to paste.');}catch{box.focus();box.select();notify('Select Copy from your browser, or press Ctrl+C to copy the lesson.');}}
$('#copy-lesson-text').onclick=()=>copy(box.value);
$('#copy-lesson-prompt').onclick=()=>copy('Create or adapt a lesson for '+FORMATS[draft.format].name+'. Return only plain text using the format below. Use 2–40 activities. Keep the same answer structure and the required number of Wrong lines shown in the example. Optional fields: Hint and Explanation. Indent multiline values with two spaces. Keep every Reference with its original activity; it links pictures or structured game data. Do not invent references. No markdown bullets.\n\n'+box.value);
if(draft)refresh();else panel.hidden=true;
})();
