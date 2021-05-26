
// importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.4/workbox-sw.js');
// importScripts('https://cdn.jsdelivr.net/npm/workbox-cdn/workbox/workbox-sw.js')
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
// Cache image.
workbox.routing.registerRoute(
  ({ request }) => {
    return request.destination === 'image' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font' ||
    request.destination === 'video'
  },
  new workbox.strategies.CacheFirst({
    cacheName: 'sources',
    plugins: [
      // Ensure that only requests that result in a 200 status are cached
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200],
      }),
      // Don't cache more than 50 items, and expire them after 7 days
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 Days
      }),
    ]
  })
);
