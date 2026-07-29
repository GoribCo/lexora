const CACHE = 'lexora-v1'
const ASSETS = ['/']

self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE).then(c => c.addAll(ASSETS))
))

self.addEventListener('fetch', e => e.respondWith(
  caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    if (!res || res.status !== 200 || res.type === 'opaque') return res
    const clone = res.clone()
    caches.open(CACHE).then(c => c.put(e.request, clone))
    return res
  }))
))
