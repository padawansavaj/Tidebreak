// Tidebreak v0.2.0 service worker — network-first to avoid stale game versions.
const CACHE='tidebreak-v0200-realism-20261110';
const FILES=['./','./index.html','./manifest.webmanifest','./icon.svg','./apple-touch-icon.png','./assets/sand.webp','./assets/grass.webp','./assets/rock.webp','./assets/soil.webp','./assets/sky.webp'];
self.addEventListener('install',event=>event.waitUntil(
 caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())
));
self.addEventListener('activate',event=>event.waitUntil(
 caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('tidebreak-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 event.respondWith((async()=>{
  try{const response=await fetch(event.request);if(response.ok){const cache=await caches.open(CACHE);cache.put(event.request,response.clone());}return response;}
  catch{return await caches.match(event.request)||Response.error();}
 })());
});
