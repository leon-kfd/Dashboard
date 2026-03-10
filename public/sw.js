
if (location.href.includes('howdz.xyz')) {
  importScripts('https://cdn.staticfile.org/workbox-sw/7.0.0/workbox-sw.js')
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


self.addEventListener('activate', (event) => {
  event.waitUntil(
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1, 2],
      addRules: [
        {
          id: 1,
          priority: 1,
          action: {
            type: "modifyHeaders",
            responseHeaders: [
              { header: "x-frame-options", operation: "remove" },
              { header: "X-Frame-Options", operation: "remove" },
              { header: "frame-options", operation: "remove" }
            ]
          },
          condition: {
            urlFilter: "*",
            resourceTypes: ["sub_frame", "main_frame"]
          }
        },
        {
          id: 2,
          priority: 1,
          action: {
            type: "modifyHeaders",
            responseHeaders: [
              {
                header: "content-security-policy",
                operation: "remove"
              },
              {
                header: "Content-Security-Policy",
                operation: "remove"
              }
            ]
          },
          condition: {
            urlFilter: "*",
            resourceTypes: ["sub_frame", "main_frame"]
          }
        }
      ]
    }).then(() => {
      console.log('update rule success');
    }).catch((error) => {
      console.error('update rule error:', error);
    })
  );
});