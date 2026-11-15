// Tiny static server that serves ./out under /lafz, mimicking GitHub Pages.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const port = Number(process.argv[2] ?? 4173);
const root = path.resolve("out");
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
    if (!p.startsWith("/lafz")) {
      res.writeHead(302, { Location: "/lafz/" });
      return res.end();
    }
    p = p.slice("/lafz".length) || "/";
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
    res.writeHead(200, { "Content-Type": type, "Content-Length": data.length, "Accept-Ranges": "bytes" });
    res.end(data);
  })
  .listen(port, () => console.log(`serving out/ at http://localhost:${port}/lafz/`));
