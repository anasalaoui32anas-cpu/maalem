// معلّم قريب — Service Worker
// عند تعديل أي ملف، غيّر رقم الإصدار هنا ليحصل المستخدمون على النسخة الجديدة.
const CACHE = "warsha-v8";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon.svg", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// الملفات الثابتة للموقع فقط: من الذاكرة أولاً، مع تحديثها في الخلفية. طلبات Firebase وGoogle لا تمر من هنا.
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const key = req.mode === "navigate" ? "./index.html" : req;
    const cached = await cache.match(key);
    const network = fetch(req).then(res => { if (res && res.ok) cache.put(key, res.clone()); return res; }).catch(() => cached);
    return cached || network;
  }));
});

// ---------- الإشعارات على الهاتف (تصل من Firebase Cloud Messaging) ----------
self.addEventListener("push", e => {
  let p = {};
  try { p = e.data ? e.data.json() : {}; } catch (err) { p = { data: { title: "معلّم قريب", body: e.data ? e.data.text() : "" } }; }
  const d = p.data || {}, n = p.notification || {};
  const title = d.title || n.title || "معلّم قريب";
  const options = {
    body: d.body || n.body || "",
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    dir: "rtl",
    lang: "ar",
    tag: d.tag || undefined,
    renotify: !!d.tag,
    data: { link: d.link || "./" }
  };
  e.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const link = (e.notification.data && e.notification.data.link) || "./";
  const hash = link.includes("#") ? link.slice(link.indexOf("#")) : "";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const c of list) {
      if (c.url.startsWith(self.registration.scope)) { c.postMessage({ open: hash }); return c.focus(); }
    }
    return self.clients.openWindow(new URL(link, self.registration.scope).href);
  }));
});
