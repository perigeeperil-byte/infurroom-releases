/* Service worker ของเว็บแอป inDisign (ติดตั้งลงคอมได้ + เปิดได้เมื่อเน็ตหลุด)
 * - หน้าหลัก (index.html): ดึงจากเน็ตก่อน เพื่อให้ได้รุ่นล่าสุดทุกครั้ง · เน็ตหลุดใช้ตัวที่เก็บไว้
 * - ไฟล์อื่นในเว็บนี้ (js/css/ฟอนต์/โมเดล 3D): ใช้ตัวที่เก็บไว้ก่อน (ชื่อไฟล์เปลี่ยนทุกครั้งที่ build)
 * - ไม่แตะคำขอไปเว็บอื่น (Google Sheet / ลงชื่อเข้าใช้ / ใบอนุญาต)
 */
const CACHE = 'indisign-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put('./', copy));
        return res;
      }).catch(() => caches.match('./').then(r => r || Response.error())),
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    })),
  );
});
