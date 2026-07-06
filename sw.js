/* =====================================================================
   Service Worker — uygulamanın internetsiz (offline) çalışmasını sağlar.
   Strateji: kurulunca HER ŞEY önbelleğe alınır; sonra tüm istekler
   önce önbellekten karşılanır (cache-first). İnternet hiç olmasa bile
   uygulama açılır. Gezinme (navigation) istekleri her zaman önbellekteki
   index.html'e düşer.
   ===================================================================== */
const CACHE = "ehliyet-kankam-v3";
const ASSETS = [
  "./", "index.html", "css/style.css",
  "js/questions.js", "js/content.js", "js/scenes.js", "js/app.js",
  "manifest.webmanifest", "icons/icon.svg", "icons/icon-192.png", "icons/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.all(ASSETS.map((u) =>
        c.add(new Request(u, { cache: "reload" })).catch(() => null)  // biri düşse bile devam
      )))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  // Sayfa açılışı (gezinme): önce önbellekteki index.html, olmazsa ağ
  if (req.mode === "navigate") {
    e.respondWith(
      caches.match("index.html").then((hit) => hit || caches.match("./").then((h2) => h2 || fetch(req)))
    );
    return;
  }

  // Diğer her şey: önce önbellek, yoksa ağdan al + önbelleğe ekle
  e.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match("index.html"));
    })
  );
});
