# Backlog

Ordered by priority. Tick items off as they're done and add new ones freely. Each item lists its
acceptance criteria (AC). Phases are a guide, not a cage.

## Phase A — Foundation
- [x] **A1 Scaffold.** Next.js + TS strict + Tailwind, static export with `basePath /lafz`, ESLint,
  Prettier, Vitest, Playwright (iPhone + Pixel projects), `npm run check`.
  AC: `npm run build` produces `out/`, and a hello page renders at 375px.
- [x] **A2 CI/CD.** GitHub Actions: check, build, e2e on push. Deploy `out/` to GitHub Pages on main.
  AC: the site is live at https://surmud.github.io/lafz/, and Playwright screenshots upload as artifacts.
- [x] **A3 Design system.** (palette, type, Nastaliq, light/dark and base components done; /dev/ui gallery still to do) Colour palette (warm and desi, not Duolingo green), type scale, Nastaliq
  font self-hosted, light/dark, base components (Button, Card, ProgressBar, AudioButton,
  UrduText with Roman/Nastaliq toggle).
  AC: a /dev/ui gallery page; screenshots look polished at 375px in both themes.
- [x] **A4 Content schema.** Zod schema (SPEC §6–7), loader, content linter, `npm run content:check`.
  AC: invalid fixtures fail and valid ones pass, in CI.
- [x] **A5 Lesson engine.** A pure state machine with requeue-on-wrong, comeback bonus, and completion.
  AC: ≥90% branch coverage on the engine.
- [x] **A6 Roman matcher.** SPEC §8, with a ≥150-case variant table and a reject list.
  AC: all cases pass; documented in code.
- [x] **A7 Storage layer.** IndexedDB repo for progress/XP/streak/recordings, plus export/import.
  AC: unit tests with fake-indexeddb.

## Phase B — Core learning loop
- [x] **B1 Exercise UIs.** Multiple choice, match pairs, type answer, listen & select, build the
  sentence, respect pick, fill the gap. Instant feedback, with playful and varied feedback lines.
- [x] **B2 Lesson player.** Intro cards for new phrases, then exercises, then a completion screen with
  the can-do unlocked.
- [x] **B3 TTS pipeline.** `scripts/generate_audio.py` (MMS), normal and slow audio, hash cache, audio
  QA (silence/duration), credits screen.
  AC: every phrase in the content has two audio files, and the QA script passes.
- [x] **B4 Unit 1 content** (5–7 lessons + boss conversation), fully sourced.
- [x] **B5 Home / course map.** Speaking path, reading path, prep packs, "continue" button.
- [x] **B6 Placement check.** SPEC §11. AC: E2E test of placement → suggested unit.
- [x] **B7 XP, streak (rest/pause), can-do screen.**
- [x] **B8 Required E2E.** Placement → Unit 1 Lesson 1 complete, with screenshots.

## Phase C — Full course
- [x] **C1 Conversation engine + boss fights** (branching, choose/type/speak, in-character hints).
- [x] **C2 Units 2–4 content.**
- [x] **C3 Reading track R1–R5** (letters, joining forms, tracing).
- [x] **C4 Units 5–8 content.**
- [ ] **C5 Reading R6–R10.**
- [x] **C6 Units 9–12 content.**
- [x] **C7 Spaced review sessions** (Leitner) + a "Review" entry on home.

## Phase D — Family and speech
- [x] **D1 Speak it.** Web Speech API with a Whisper (transformers.js) fallback; graceful when unsupported.
- [x] **D2 Ask Ammi** share flow + badge.
- [x] **D3 Family voice** recording, which overrides TTS, with export/import.
- [x] **D4 Family tree** interactive explorer + respect meter.
- [x] **D5 Prep packs** (Shaadi in 5 days, Eid next week, Nani visiting, First call with Khala, Trip
  to Pakistan).

## Phase E — Polish and PWA
- [x] **E1 PWA.** Manifest, icons, service worker, offline lessons, "download unit".
- [x] **E2 Onboarding.** Pick heritage vs beginner, the placement offer, set your relatives' names
  (optional; personalises dialogue).
- [x] **E3 Accessibility pass + Lighthouse ≥ 90** on all categories. (Home 90/100/100/91, lesson 94/100/100/91; SEO 91 is the domain-root robots.txt, outside this repo.)
- [x] **E4 Delight.** (original SVG character portraits, confetti, entrance animations, synthesized feedback sounds) Character illustrations (SVG, original), micro-animations, sound effects,
  lesson-complete celebrations.
- [ ] **E5 PROGRESS.md final.** What's built, medium-confidence Urdu list, known issues, next steps.

## Discovered while building (2026-11-16)
- [x] **G1 Placement pool grows with the course.** Add 2 placement questions per new unit (levels 2–12);
  placement can only suggest units that exist.
- [x] **G2 /dev/ui gallery** (finishes A3).
- [x] **G3 Whisper round-trip audio audit** (EVALS §3): transcribe each MMS clip, log similarity, flag the worst 5%.
- [x] **G4 Personalised names in dialogue.** Onboarding stores relatives' names but nothing uses them yet.
- [x] **G5 Persona specs** for all six EVALS personas (only the MVP flow and a screen gallery exist).

- [x] **G6 Reading R1–R5 depth.** Each reading unit has 3 lessons; add a "build the word from letters"
  exercise and a 4th lesson of mixed review before R6.
- [x] **G7 Page weight as units grow.** (precache is now the app shell only, 2.3 MB; lesson pages cache on use or per-unit download) Each lesson page embeds its unit's phrase pool; watch HTML size
  (now 35–60 KB) and the precache (2.8 MB) as units 5–12 land.

- [x] **G8 Family voice: real-mic E2E.** (passes in Linux CI; skipped on macOS, which blocks the fake mic) Headless Chromium can't open a fake mic in this setup; the test
  injects a recording. Try headed or `channel: "chrome"` in CI.
- [x] **G9 Whisper fallback for Speak it** (D1 remainder): transformers.js, lazy-loaded.

- [x] **G10 Home first paint.** (server-rendered intro card; home Lighthouse performance 78 → 90) Home content depends on IndexedDB, so LCP waits for hydration (perf 78).
  Render a static course map shell server-side and hydrate progress into it.
- [x] **G11 Funnier generated drills.** Review/pack drills use generic prompts ("How do you say…"); add
  situational prompt templates per sense/register.

- [x] **G12 Single-word audio.** (voice v3: carrier-sentence synthesis + duration-based cut; 12-word test 0.23 → 0.70) MMS is weakest on isolated words (docs/evals/2026-11-16-audio.md).
  Try a carrier phrase ("لفظ ہے: X") and trimming, or a free alternative TTS for words only.

- [x] **G13 Funnier Mix-it-up lessons.** Hand-write one situational joke prompt per unit's warm-up (R5).
- [x] **G14 Rekhta spelling cross-check** for U1–U3 core phrases, by hand; log disagreements (R6).
- [x] **G16 "5 phrases to try at dinner tonight" card** (SPEC §10, never built): picks recent phrases,
  share via Web Share/WhatsApp, printable.
- [x] **G17 Reading placement offer** (SPEC §11): after placement, a 3-question script check that
  suggests a reading unit.
- [x] **G19 Future-hook interfaces** (SPEC §11): TtsProvider (MMS adapter in use), SyncProvider, Entitlements, ConversationEngine.
- [x] **G20 Bundle budget gate in CI** (EVALS §3): first-load JS 186.8 KB gzip of 200 KB.
- [x] **G18 Ask Ammi with your own voice** (SPEC §10): record yourself and share the clip with the text.
- [ ] **G15 Question intonation / prosody.** (Needs a human ear: an automated pitch change can't be judged
  by the current metrics, so it isn't shipped blind.) Try raising pitch at the end of '?' lines in post-processing,
  or evaluate another free Urdu TTS (R7).

## Phase F — Self-improvement (ongoing, forever)
- [x] Eval passes 1 and 2 (docs/evals/). Keep doing one after every phase. File items from the lowest rubric scores.
- [x] Content audit pass (docs/evals/2026-11-17-rekhta-crosscheck.md). Repeat each eval pass.
- [x] Audio audit: round-trip with Whisper; regenerate or flag bad clips (voice v2, see docs/evals/2026-11-16-audio.md).
- [ ] Ideas list: add your own feature ideas here and build the good ones.
