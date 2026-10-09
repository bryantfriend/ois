const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const api=(p,...args)=>JSON.parse(execFileSync('gh',['api','repos/bryantfriend/ois/'+p,...args],{encoding:'utf8',maxBuffer:50*1024*1024}));
const out=path.resolve('../ois-cell-publish'),prior=path.resolve('../ois-draw-release'),parent=api('git/ref/heads/main').object.sha;
const put=(p,s)=>{const target=path.join(out,p);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,s);};
const base=api('git/commits/'+parent).tree.sha,entries=api('git/trees/'+base+'?recursive=1').tree.filter(e=>e.type==='blob'&&!/\.(png|webp|jpg|jpeg|gif|pdf)$/i.test(e.path));
async function prepare(){let next=0;await Promise.all(Array.from({length:8},async()=>{while(next<entries.length){const e=entries[next++];const p=fs.existsSync(path.join(out,e.path))?path.join(out,e.path):path.join(prior,e.path);let buf=fs.existsSync(p)?fs.readFileSync(p):null;const hash=buf&&crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+buf.length+'\0'),buf])).digest('hex');if(hash!==e.sha){const data=await new Promise((resolve,reject)=>require('node:child_process').execFile('gh',['api','repos/bryantfriend/ois/git/blobs/'+e.sha],{maxBuffer:50*1024*1024},(err,stdout)=>err?reject(err):resolve(JSON.parse(stdout))));buf=Buffer.from(data.content,'base64');}put(e.path,buf);}}));
const files=['dist/activities-catalog.js','dist/activities.js','dist/activities.css','dist/cell-structures.js','dist/chess-motion.js','scripts/serve.mjs','scripts/qa-cell.mjs','scripts/qa-cell-discovery.mjs','scripts/qa-cell-levels.mjs','scripts/qa-cell-level-settings.mjs','scripts/qa-cell-types.mjs','scripts/qa-cell-type-settings.mjs','design/cell-image-prompts.json','design/cell-added-image-prompts.json','design/plant-cell-image-prompts.json'];
for(const p of files)put(p,fs.readFileSync(p));
function copyImages(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+entry.name;if(entry.isDirectory())copyImages(p);else{files.push(p);put(p,fs.readFileSync(p));}}}copyImages('dist/assets/cell-structures');
const read=p=>fs.readFileSync(path.join(out,p),'utf8');
let html=read('dist/index.html');html=html.replace(/(<script src="\.\/activities\.js[^>]*><\/script>)/,'$1<script src="./cell-structures.js" defer></script>');if(!html.includes('cell-structures.js'))throw Error('Missing script insertion');
const version='cell-structures-0.3.17-2026-10-08';put('dist/site-release.js',read('dist/site-release.js').replace(/const OXFORD_RELEASE='[^']+'/,"const OXFORD_RELEASE='"+version+"'"));put('dist/release.json',JSON.stringify({version})+'\n');put('scripts/version-assets.mjs',read('scripts/version-assets.mjs').replace(/version:'[^']+'/,"version:'"+version+"'"));
const pkg=JSON.parse(read('package.json'));pkg.version='0.3.17';pkg.scripts.check+=' && node --check dist/cell-structures.js && node --check scripts/qa-cell-types.mjs';put('package.json',JSON.stringify(pkg,null,2)+'\n');
put('README.md',read('README.md').replace('Labelled Diagram (place labels on an animal cell)','Cell Structures (choose an animal or plant cell, then label 6, 9 or 12 structures)'));
for(const p of files.filter(p=>p.startsWith('scripts/qa-cell')))put(p,read(p).replaceAll("'http://127.0.0.1:4174/?game=biology-7-diagram'","(process.env.OXFORD_TEST_URL||'http://127.0.0.1:4174')+'/?game=biology-7-diagram'"));
files.push('dist/index.html','dist/site-release.js','dist/release.json','scripts/version-assets.mjs','package.json','README.md');
const wanted=new Set(files.filter(p=>p.startsWith('dist/')).map(p=>p.slice(5)));html=html.replace(/(src|href)="\.\/([^"?]+\.(?:js|css))(?:\?[^\"]*)?"/g,(match,attr,file)=>wanted.has(file)?`${attr}="./${file}?v=${crypto.createHash('sha256').update(fs.readFileSync(path.join(out,'dist',file))).digest('hex').slice(0,12)}"`:match);put('dist/index.html',html);
put('cell-release-manifest.json',JSON.stringify({parent,base,files},null,2));console.log('Prepared '+files.length+' scoped files on '+parent+'; source baseline verified against remote blobs; existing binary assets remain in the remote base tree.');

}prepare().catch(e=>{console.error(e);process.exit(1)});



