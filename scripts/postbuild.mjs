// After `next build`: write out/sw.js (precache list + version) and out/offline/<unit>.json
// (every audio clip a unit uses, for "download unit for offline").
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");
const BASE = "/lafz";
const VOICE = "mms-urd-3";

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

const files = walk(OUT)
  .map((f) => path.relative(OUT, f).split(path.sep).join("/"))
  .filter((f) => !f.startsWith("audio/") && !f.startsWith("offline/") && f !== "sw.js" && !f.endsWith(".map"))
  // Fontsource ships every unicode subset; keep only the ones we use (latin + arabic).
  // Precache what a cold offline start needs: HTML, JS/CSS, woff2 fonts we use, icons, manifest.
  // RSC payloads (.txt) are cached on use; .woff is a fallback modern browsers never fetch.
  .filter((f) => !f.endsWith(".txt") && !f.endsWith(".woff") && !f.endsWith(".ttf"))
  .filter((f) => !(/\.woff2$/.test(f) && /latin-ext|vietnamese|cyrillic|greek/.test(f)));

// Lesson, boss, pack-session and voice pages are cached on use or by "Download this unit"; everything
// else (home, unit maps, tabs, static assets) is precached so the app opens offline.
const onDemand = /^(lesson|boss|voice)\/|^pack\/[^/]+\/[^/]+\//;
const shellFiles = files.filter((f) => !onDemand.test(f));
const shell = shellFiles.map((f) => `${BASE}/${f.replace(/index\.html$/, "")}`);
const size = shellFiles.reduce((n, f) => n + fs.statSync(path.join(OUT, f)).size, 0);
const version = crypto.createHash("sha256").update(files.map((f) => f + fs.statSync(path.join(OUT, f)).size).join("|")).digest("hex").slice(0, 12);

// Per-unit audio lists
const sha16 = (s) => crypto.createHash("sha256").update(s, "utf8").digest("hex").slice(0, 16);
const ttsText = (p) => (p.tts ?? p.urdu).normalize("NFC").trim();
fs.mkdirSync(path.join(OUT, "offline"), { recursive: true });
const units = fs.readdirSync("content/units").filter((f) => f.endsWith(".json"));
for (const f of units) {
  const u = JSON.parse(fs.readFileSync(path.join("content/units", f), "utf8"));
  const urls = new Set();
  for (const p of u.phrases) for (const rate of ["normal", "slow"]) urls.add(`${BASE}/audio/${sha16(`${VOICE}|${rate}|${ttsText(p)}`)}.mp3`);
  const pages = [...u.lessons.map((l) => `${BASE}/lesson/${l.id}/`), `${BASE}/unit/${u.id}/`, ...(u.boss ? [`${BASE}/boss/${u.id}/`] : [])];
  fs.writeFileSync(path.join(OUT, "offline", `${u.id}.json`), JSON.stringify({ unit: u.id, audio: [...urls], pages }));
}

const tpl = fs.readFileSync("scripts/sw-template.js", "utf8");
fs.writeFileSync(path.join(OUT, "sw.js"), tpl.replace("__VERSION__", version).replace("__SHELL__", JSON.stringify(shell)));
console.log(`sw.js: ${shell.length} files precached (${(size / 1024).toFixed(0)} KB), version ${version}; ${units.length} offline unit lists`);
