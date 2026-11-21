// Tiny static server that serves ./out under /lafz, mimicking GitHub Pages.
// SERVE_ROOT=native-www SERVE_BASE= serves the native (Capacitor) bundle at / instead.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const port = Number(process.argv[2] ?? 4173);
const root = path.resolve(process.env.SERVE_ROOT ?? "out");
const base = process.env.SERVE_BASE ?? "/lafz";
const types = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".mp3": "audio/mpeg", ".svg": "image/svg+xml", ".png": "image/png",
  ".woff2": "font/woff2", ".woff": "font/woff", ".webmanifest": "application/manifest+json",
  ".txt": "text/plain", ".ico": "image/x-icon",
};

http
  .createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://x");
    let p = decodeURIComponent(url.pathname);
    if (base && !p.startsWith(base)) {
      res.writeHead(302, { Location: `${base}/` });
      return res.end();
    }
    p = p.slice(base.length) || "/";
    let file = path.join(root, p);
    if (!file.startsWith(root)) {
      res.writeHead(403);
      return res.end();
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file) && fs.existsSync(file + ".html")) file += ".html";
    if (!fs.existsSync(file)) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      const nf = path.join(root, "404.html");
      return res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : "Not found");
    }
    const data = fs.readFileSync(file);
    const type = types[path.extname(file)] ?? "application/octet-stream";
    const range = req.headers.range;
    if (range) {
      const m = /bytes=(\d*)-(\d*)/.exec(range);
      const start = m && m[1] ? Number(m[1]) : 0;
      const end = m && m[2] ? Number(m[2]) : data.length - 1;
      res.writeHead(206, {
        "Content-Type": type, "Accept-Ranges": "bytes",
        "Content-Range": `bytes ${start}-${end}/${data.length}`, "Content-Length": end - start + 1,
      });
      return res.end(data.subarray(start, end + 1));
    }
    // Compress text like GitHub Pages does, so local Lighthouse numbers are realistic.
    if (/text|javascript|json|svg|manifest/.test(type) && /gzip/.test(req.headers["accept-encoding"] ?? "")) {
      const gz = zlib.gzipSync(data);
      res.writeHead(200, { "Content-Type": type, "Content-Encoding": "gzip", "Content-Length": gz.length, "Cache-Control": "max-age=600" });
      return res.end(gz);
    }
    res.writeHead(200, { "Content-Type": type, "Content-Length": data.length, "Accept-Ranges": "bytes", "Cache-Control": "max-age=600" });
    res.end(data);
  })
  .listen(port, () => console.log(`serving ${root} at http://localhost:${port}${base}/`));
