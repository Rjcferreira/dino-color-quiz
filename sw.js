const CACHE='dino-match-v13';
const FILES=['./','./index.html','./style.css?v=13','./app.js?v=13','./assets/three.module.js','./assets/three.core.js','./manifest.webmanifest','./icon.svg','./assets/dino-puzzles.jpg','./assets/dino-puzzles-2.jpg','./assets/paint-atlas.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
