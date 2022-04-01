
if (location.href.includes('/Dashboard')) {
  importScripts('https://cdn.jsdelivr.net/npm/workbox-cdn/workbox/workbox-sw.js')
  workbox.setConfig({
    debug: false,
  });
  console.log('sw.js is load by CDN!')
} else {
  importScripts('./workbox/workbox-sw.js')
  workbox.setConfig({
    debug: false,
    modulePathPrefix: './workbox/'
  });
  console.log('sw.js is load by local!')
}
// Cache html.
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'document',
  new workbox.strategies.NetworkFirst({
    cacheName: 'document'
  })
);
// Cache image/css/js.
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script',
  new workbox.strategies.CacheFirst({
    cacheName: 'sources',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 Days
      }),
    ]
  })
);
// Cache image/video/font.
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image' || request.destination === 'video' || request.destination === 'font',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'videos'
  })
)
