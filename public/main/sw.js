// Choose a cache name
const cacheName = "cache-v1.0.0.1";
// List the files to precache
const precacheResources = [
  "/",
  "/account/",
  "/account/index.html",
  "/account-management/",
  "/account-management/index.html",
  "/css/my-events/charity.css",
  "/css/my-events/my-events.css",
  "/css/my-events/new-event.css",
  "/css/my-events/standard.css",
  "/css/account.css",
  "/css/event.css",
  "/css/generalPage.css",
  "/css/landing.css",
  "/css/loading.css",
  "/css/mainPage.css",
  "/css/mat.min.css",
  "/css/onboarding.css",
  "/css/refund.css",
  "/css/register.css",
  "/css/signIn.css",
  "/event/refund/",
  "/event/refund/index.html",
  "/event/register/",
  "/event/register/index.html",
  "/event/",
  "/event/index.html",
  "/js/myEvents/charity.js",
  "/js/myEvents/edit-event.js",
  "/js/myEvents/my-events.js",
  "/js/myEvents/new-event.js",
  "/js/myEvents/standard.js",
  "/js/tinymce/js/tinymce/jquery.tinymce.min.js",
  "/js/tinymce/js/tinymce/tinymce.min.js",
  "/js/tinymce/js/tinymce/tinymce.d.ts",
  "/js/account-management.js",
  "/js/account.js",
  "/js/blurhash_min.js",
  "/js/ethics.js",
  "/js/event.js",
  "/js/landing.js",
  "/js/main.js",
  "/js/onboarding.js",
  "/js/preFirebaseLoad.js",
  "/js/purchase.js",
  "/js/refund.js",
  "/js/register.js",
  "/js/sharded-counter.js",
  "/js/sign-in.js",
  "/js/sign-out.js",
  "/js/terms.js",
  "/landing/",
  "/landing/index.html",
  "/my-events/edit/",
  "/my-events/edit/index.html",
  "/my-events/new-event/",
  "/my-events/new-event/index.html",
  "/my-events/",
  "/my-events/index.html",
  "/onboarding/",
  "/onboarding/index.html",
  "/sign-in/",
  "/sign-in/index.html",
  "/sign-out/",
  "/sign-out/index.html",
  "/index.html",
  "/ethics.html",
  "/purchaseAgreement.html",
  "/terms.html",
  "/__/firebase/9.1.0/firebase-app.js",
  "/__/firebase/9.1.0/firebase-auth.js",
  "/__/firebase/9.1.0/firebase-firestore.js",
  "/__/firebase/9.1.0/firebase-functions.js",
  "/__/firebase/9.1.0/firebase-storage.js",
  "/__/firebase/9.1.0/firebase-analytics.js",
  "/__/firebase/9.1.0/firebase-performance.js",
  "/__/firebase/init.js?useEmulator=true",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",
  "https://fonts.googleapis.com/css?family=Roboto:400,500,700",
  "https://fonts.gstatic.com/s/roboto/v27/KFOlCnqEu92Fr1MmWUlfBBc4.woff2",
  "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.woff2",
  "https://www.gstatic.com/firebasejs/ui/4.8.1/firebase-ui-auth.js",
  "https://www.gstatic.com/firebasejs/ui/4.8.1/firebase-ui-auth.css",
  "/manifest.webmanifest"
];

// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener("install", (event) => {
  console.log("Service worker install event!");
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(precacheResources))
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service worker activate event!");
});

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener("fetch", (event) => {
  // console.log("Fetch intercepted for:", event.request.url);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log(`[cache] ${event.request.url}`);
        return cachedResponse;
      }
      console.log(`[fetch] ${event.request.url}`);
      return fetch(event.request);
    })
  );
});
