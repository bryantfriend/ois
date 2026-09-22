import fs from 'node:fs';
import crypto from 'node:crypto';
for (const page of ['index.html','projectile-duel.html']) {
 let html=fs.readFileSync('dist/'+page,'utf8');
 if(page==='index.html'&&!html.includes('site-release.js'))html=html.replace('</head>','<script src="./site-release.js" defer></script></head>');
 html=html.replace(/(src|href)="\.\/([^"?]+\.(?:js|css))(?:\?[^\"]*)?"/g,(_,attr,file)=>`${attr}="./${file}?v=${crypto.createHash('sha256').update(fs.readFileSync('dist/'+file)).digest('hex').slice(0,12)}"`);
 fs.writeFileSync('dist/'+page,html);
}
fs.writeFileSync('dist/release.json',JSON.stringify({version:'lesson-text-and-games-2026-09-22'})+'\n');
console.log('Versioned browser assets.');