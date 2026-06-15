const CACHE = 'kianzo-panel-v1'
const SHELL = ['/admin/dashboard']

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {})
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

// Network-first para peticiones GET
self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  event.respondWith(
    fetch(req).catch(() => caches.match(req).then((r) => r || caches.match('/admin/dashboard')))
  )
})

// Notificaciones desde la página (postMessage)
self.addEventListener('message', (event) => {
  if (event.data?.type === 'KZ_NOTIFY') {
    const { title, body, tag } = event.data
    self.registration.showNotification(title, {
      body,
      tag,
      icon: '/logo-kianzo.png',
      badge: '/logo-kianzo.png',
      vibrate: [200, 100, 200],
      requireInteraction: false,
    })
  }
})

// Click en notificación → enfoca/abre el panel
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const panel = clients.find((c) => c.url.includes('/admin'))
      if (panel) return panel.focus()
      return self.clients.openWindow('/admin/dashboard')
    })
  )
})
