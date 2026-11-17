// Bundle budget (docs/EVALS.md §3): first-load JS for the home page must stay ≤ 200 KB gzip.
// Reads the script tags out of out/index.html and gzips each referenced chunk.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const BUDGET = 200 * 1024;
const html = fs.readFileSync("out/index.html", "utf8");
const srcs = [...new Set([...html.matchAll(/<script[^>]+src="\/lafz\/([^"]+\.js)"/g)].map((m) => m[1]))];
let total = 0;
for (const s of srcs) total += zlib.gzipSync(fs.readFileSync(path.join("out", s))).length;
console.log(`first-load JS: ${srcs.length} files, ${(total / 1024).toFixed(1)} KB gzip (budget ${BUDGET / 1024} KB)`);
if (total > BUDGET) {
  console.error("bundle budget exceeded");
  process.exit(1);
}
