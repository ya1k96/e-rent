const staticDevCoffee = "eRent"
const assets = [
  "/",
  "/public/css/vendor/bootstrap.min.css",
  "/public/css/flat-ui.css",
  "/public/css/my-css.css",
  "/public/css/jquery.dataTables.min.css",
  "/public/scripts/jquery-3.3.1.min.js",
  "https://unpkg.com/popper.js@1.14.1/dist/umd/popper.min.js",
  "https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js",
  "/public/scripts/flat-ui.js",
  "/public/scripts/jquery.dataTables.min.js",
  "/public/scripts/moment.js",
  "/public//cdn.jsdelivr.net/npm/sweetalert2@11",
  "/public/scripts/functions.js",
  "/scripts/my-script.js"
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