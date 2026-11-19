// Always ask GitHub for the newest file (skipping the browser's 10-minute cache); fall back to the saved copy offline.
const C='golf-logbook-v35';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'])));});
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==C)await caches.delete(k);await self.clients.claim();})()));
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;
  e.respondWith(fetch(req,{cache:'no-store'}).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(req,cp));return r;}).catch(()=>caches.match(req)));
});
