caches.open("chap-cache").then((cache) => {
  return cache.addAll([
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./assets/teaCHAP.jpg"  // додано
  ]);
});
