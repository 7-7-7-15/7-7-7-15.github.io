
importScripts("/explore/us5/us5.sw.js");

const sw = new us5ServiceWorker();

self.addEventListener("fetch", (event) => event.respondWith(sw.fetch(event)));
