
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
    cacheName: 'html',
  })
);

// Cache css/js/font.
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script' || request.destination === 'font',
  new workbox.strategies.CacheFirst({
    cacheName: 'css-js-font',
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

// Cache image.
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'image',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 Days
      })
    ]
  })
)

// Cache video
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'video',
  new workbox.strategies.CacheFirst({
    cacheName: 'video',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 Days
      }),
      new workbox.rangeRequests.RangeRequestsPlugin()
    ]
  })
)
