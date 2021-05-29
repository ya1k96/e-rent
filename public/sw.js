const staticDevCoffee = "eRent"
const assets = [
  "/",
  "./css/vendor/bootstrap.min.css",
  "./css/flat-ui.css",
  "./css/my-css.css",
  "./css/jquery.dataTables.min.css",
  "./scripts/jquery-3.3.1.min.js",
  "https://unpkg.com/popper.js@1.14.1/dist/umd/popper.min.js",
  "./scripts/flat-ui.js",
  "./scripts/jquery.dataTables.min.js",
  "./scripts/moment.js",
  "//cdn.jsdelivr.net/npm/sweetalert2@11",
  "./scripts/functions.js",
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