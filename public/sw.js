const staticDevCoffee = "eRent"
const assets = [
  "./css/vendor/bootstrap.min.css",
  "./css/flat-ui.css",
  "./css/my-css.css",
  "./css/jquery.dataTables.min.css",
  "./scripts/jquery-3.6.0.min.js",
  "./scripts/popper.min.js",
  "./scripts/flat-ui.js",
  "./scripts/jquery.dataTables.min.js",
  "./scripts/moment.js",
  "./scripts/sweetalert2.js",
  "./scripts/firebase-app.js",
  "./scripts/firebase-auth.js",
  "./scripts/functions.js",
  "./scripts/my-script.js"
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticDevCoffee).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })

  self.addEventListener('push', function(e) {
    console.log(e);
    const message = e.data; // 1
  
    const options = { // 2
      body: message.body,
      data: 'Holi',
      actions: [
        {
          action: 'Detail',
          title: 'Detalles'
        }
      ]
    };
  
    e.waitUntil(self.registration.showNotification(message.title, options)); // 3
  });

  self.addEventListener('notificationclick', function(e) {
    console.log('Notification click Received.', e.notification.data);
  
    e.notification.close(); // 1
    e.waitUntil(clients.openWindow(e.notification.data)); // 2
  });

