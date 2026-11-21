// Always get the newest file. GitHub's CDN can hand out a copy up to 10 minutes old even when asked not to,
// so every request carries a unique ?_= that the CDN has never seen. Offline, fall back to the saved copy.
const C='golf-logbook-v41';
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
const fresh=u=>fetch(u+(u.includes('?')?'&':'?')+'_='+Date.now(),{cache:'no-store'});
self.addEventListener('install',e=>{self.skipWaiting();
  e.waitUntil(caches.open(C).then(c=>Promise.all(FILES.map(u=>fresh(u).then(r=>{if(!r.ok)throw new Error(u+' '+r.status);return c.put(u,r);})))));});
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==C)await caches.delete(k);await self.clients.claim();})()));
self.addEventListener('fetch',e=>{
  const req=e.request;const url=new URL(req.url);if(req.method!=='GET'||url.origin!==location.origin)return;
  e.respondWith(fresh(url.origin+url.pathname).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(req,cp));}return r;}).catch(()=>caches.match(req,{ignoreSearch:true})));
});
