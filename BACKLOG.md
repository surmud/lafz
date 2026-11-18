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
- [x] **G21 Console-error sweep** (new E2E): no console errors or hydration mismatches on 15 page types.
  Found and fixed a hydration mismatch on the family-voice recorder.
- [x] **G22 axe-core WCAG A/AA gate in light AND dark** (new E2E). Fixed 6 contrast failures: darker rose
  and green in light mode, ink tokens for text on green, red and rose buttons, legible "-deep" labels in dark.
- [x] **G23 Phrasebook**: every phrase with audio, forgiving Roman / Urdu / English search, "only mine" filter.
- [x] **G24 Share a boss win** with the family ("Tell the family 🎉").
- [x] **G25 Printable cheat sheet per speaking unit** (grammar + taught phrases, both scripts, audio).
- [ ] **G15 Question intonation / prosody.** (Needs a human ear: an automated pitch change can't be judged
  by the current metrics, so it isn't shipped blind.) Try raising pitch at the end of '?' lines in post-processing,
  or evaluate another free Urdu TTS (R7).

## Phase F — Self-improvement (ongoing, forever)
- [x] Eval passes 1 and 2 (docs/evals/). Keep doing one after every phase. File items from the lowest rubric scores.
- [x] Content audit pass (docs/evals/2026-11-17-rekhta-crosscheck.md). Repeat each eval pass.
- [x] Audio audit: round-trip with Whisper; regenerate or flag bad clips (voice v2, see docs/evals/2026-11-16-audio.md).
- [ ] Ideas list: add your own feature ideas here and build the good ones.

## Phase H — v2 expansion (founder brief, 2026-11-17 night; v1 is tagged `v1.0`)
Brief: more and deeper lessons, an advanced level, new lesson formats that are not Duolingo clones,
Speak / Read modes, progress analytics, on-device AI, a better voice, and fixes for the things people
dislike about Duolingo. Fun is fine; corny is not.

- [x] **H1 Speak / Read modes.** One toggle on home. Speak mode shows the speaking course; Read mode shows
  the reading course. The Read tab becomes a Practice hub (review, trouble words, listening, phrasebook).
- [x] **H2 New exercise formats.** `scene` (overhear a short exchange, then answer), `spot` (tap the wrong
  word), `sort` (drop words into buckets: tu/tum/aap, masculine/feminine…), `dictation` (hear it, type it).
  Engine + tests + UI, used in new units and retrofitted into old ones.
- [x] **H3 Survival Kit unit (u13)**: conversation repair and emergencies ("say that again", "what's this
  called in Urdu?", "I'm lost", "call a doctor").
- [x] **H4 Advanced course (u14–u19)**: formal & polite Urdu, conditionals and wishes, opinions and
  arguing, idioms, poetry (Ghalib, Mir, Iqbal), news vocabulary. Each with a boss conversation.
- [x] **H5 Placement reaches the advanced course.** A perfect run continues into advanced questions and can
  suggest starting at unit 14+.
- [x] **H6 Skill model + Insights page.** Log every answer by skill (listening, speaking, recall,
  recognition, reading, grammar); show strengths, accuracy trend, hardest phrases, estimated level.
- [x] **H7 User-base analytics.** Anonymous, opt-in event batches to a configurable endpoint, a receiver
  sample, and an aggregate report script. No endpoint configured = nothing leaves the device.
- [x] **H8 Trouble words.** A practice session built from the phrases you miss most.
- [x] **H9 Hard mode.** Setting: type or speak instead of tapping wherever possible.
- [x] **H10 Listening mode.** Hands-free audio loop (English, pause, Urdu, repeat) per unit.
- [x] **H11 Grammar guide hub.** All grammar notes in one searchable page.
- [x] **H12 AI phrase finder.** On-device sentence embeddings: "how do I politely refuse food?" finds the
  phrase. Embeddings precomputed at build time; the query model loads on demand.
- [x] **H13 Voice trial.** Matcha-TTS Urdu (Apache-2.0) vs MMS by Whisper round-trip; switch if better.
- [ ] **H14 AI conversation partner (experimental).** Small on-device LLM via WebGPU, opt-in download.
- [ ] **H15 Sher of the day** on home once the poetry unit exists.
- [x] **H16 Retrofit new formats into units 1–12** (at least one scene and one dictation per unit).

- [ ] **H18 OmniVoice Urdu trial** (Apache-2.0, voice cloning): could give each character their own voice.
- [x] **H19 Story mode (comprehensible input):** short illustrated stories per unit, tap any word for meaning, audio read-through.
- [x] **H20 Shadowing drill:** play a line, record yourself straight after, play both back to compare.
- [ ] **H21 Reading mode depth:** Read mode gets "read real things": signs, menus, WhatsApp messages, headlines at advanced level.
- [x] **H22 Weekly goal instead of daily streak pressure** (optional setting): "3 sessions this week".
- [x] **H17 Eval pass 3** (docs/evals/2026-11-18-3.md): fixed teach walls (interleaving), conversation start label, Insights wording.
- [ ] **H23 Weakest short-word clips** (11 below 0.6 round-trip): try a carrier sentence with Matcha, or flag for a human ear.
- [ ] **H25 Interleave check in content lint:** warn when a lesson has an exercise that can never become eligible before the end.
- [ ] **H26 More stories:** one per unit (5 of 19 so far: u01, u03, u06, u10, u12), including advanced ones.
- [ ] **H27 Story audio "play all"** with auto-advance for hands-free listening.
