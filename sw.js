const CACHE='dino-match-v32';
const FILES=['./','./index.html','./style.css?v=15','./world.css?v=26','./racer.css?v=2','./app.js?v=32','./racer.js?v=5','./version.json','./assets/three.module.js','./assets/three.core.js','./manifest.webmanifest','./icon.svg','./assets/dino-puzzles.jpg','./assets/dino-puzzles-2.jpg','./assets/paint-atlas.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('message',e=>{if(e.data==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',e=>{if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy));return r}).catch(()=>caches.match('./index.html')));return}if(new URL(e.request.url).pathname.endsWith('/version.json')){e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>caches.match('./version.json')));return}e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
