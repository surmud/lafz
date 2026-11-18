// After `next build`: write out/sw.js (precache list + version) and out/offline/<unit>.json
// (every audio clip a unit uses, for "download unit for offline").
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");
const UNITS = path.join("content", process.env.NEXT_PUBLIC_LANG ?? "ur", "units");
const BASE = process.env.NEXT_PUBLIC_NATIVE === "1" ? "" : "/lafz";
const MALE = new Set(["bilal", "abbu", "pervez", "bashir"]); // keep in step with src/lang/ur.ts voices
const voice = (speaker) => (MALE.has(speaker) ? "matcha-m1" : "matcha-f1");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

const files = walk(OUT)
  .map((f) => path.relative(OUT, f).split(path.sep).join("/"))
  .filter((f) => !f.startsWith("audio/") && !f.startsWith("offline/") && !f.startsWith("ai/") && f !== "sw.js" && !f.endsWith(".map"))
  // Fontsource ships every unicode subset; keep only the ones we use (latin + arabic).
  // Precache what a cold offline start needs: HTML, JS/CSS, woff2 fonts we use, icons, manifest.
  // RSC payloads (.txt) are cached on use; .woff is a fallback modern browsers never fetch.
  .filter((f) => !f.endsWith(".txt") && !f.endsWith(".woff") && !f.endsWith(".ttf"))
  .filter((f) => !(/\.woff2$/.test(f) && /latin-ext|vietnamese|cyrillic|greek/.test(f)));

// Lesson, boss, pack-session and voice pages are cached on use or by "Download this unit"; everything
// else (home, unit maps, tabs, static assets) is precached so the app opens offline.
const onDemand = /^(lesson|boss|voice|story)\/|^pack\/[^/]+\/[^/]+\/|^unit\/[^/]+\/sheet\//;
const shellFiles = files.filter((f) => !onDemand.test(f));
const shell = shellFiles.map((f) => `${BASE}/${f.replace(/index\.html$/, "")}`);
const size = shellFiles.reduce((n, f) => n + fs.statSync(path.join(OUT, f)).size, 0);
const version = crypto.createHash("sha256").update(files.map((f) => f + fs.statSync(path.join(OUT, f)).size).join("|")).digest("hex").slice(0, 12);

// Per-unit audio lists
const sha16 = (s) => crypto.createHash("sha256").update(s, "utf8").digest("hex").slice(0, 16);
const ttsText = (p) => (p.tts ?? p.urdu).normalize("NFC").trim();
fs.mkdirSync(path.join(OUT, "offline"), { recursive: true });
const units = fs.readdirSync(UNITS).filter((f) => f.endsWith(".json"));
for (const f of units) {
  const u = JSON.parse(fs.readFileSync(path.join(UNITS, f), "utf8"));
  const urls = new Set();
  const byId = new Map(u.phrases.map((p) => [p.id, p]));
  const add = (p, speaker) => {
    for (const rate of ["normal", "slow"]) urls.add(`${BASE}/audio/${sha16(`${voice(speaker)}|${rate}|${ttsText(p)}`)}.mp3`);
  };
  for (const p of u.phrases) add(p, p.speaker);
  for (const line of u.story?.lines ?? []) if (byId.has(line.phrase)) add(byId.get(line.phrase), line.speaker);
  for (const l of u.lessons) for (const ex of l.exercises) if (ex.type === "scene") for (const line of ex.lines) if (byId.has(line.phrase)) add(byId.get(line.phrase), line.speaker);
  const pages = [
    ...u.lessons.map((l) => `${BASE}/lesson/${l.id}/`),
    `${BASE}/unit/${u.id}/`,
    ...(u.boss ? [`${BASE}/boss/${u.id}/`] : []),
    ...(u.story ? [`${BASE}/story/${u.id}/`] : []),
    ...(u.track === "speaking" ? [`${BASE}/unit/${u.id}/sheet/`] : []),
  ];
  fs.writeFileSync(path.join(OUT, "offline", `${u.id}.json`), JSON.stringify({ unit: u.id, audio: [...urls], pages }));
}

// Lightweight phrase index for client features that need the whole course (dinner card).
const lite = [];
for (const f of units) {
  const u = JSON.parse(fs.readFileSync(path.join(UNITS, f), "utf8"));
  for (const p of u.phrases) if (!p.id.includes(".b.") && !p.id.includes(".l-")) lite.push({ id: p.id, roman: p.roman, urdu: p.urdu, en: p.en, ...(p.sense ? { sense: p.sense } : {}), ...(p.speaker ? { speaker: p.speaker } : {}) });
}
fs.writeFileSync(path.join(OUT, "phrases.json"), JSON.stringify(lite));

const tpl = fs.readFileSync("scripts/sw-template.js", "utf8");
fs.writeFileSync(path.join(OUT, "sw.js"), tpl.replace("__VERSION__", version).replace("__SHELL__", JSON.stringify(shell)));
console.log(`sw.js: ${shell.length} files precached (${(size / 1024).toFixed(0)} KB), version ${version}; ${units.length} offline unit lists`);
