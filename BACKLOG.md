# Backlog

Ordered by priority. Tick items off as they're done and add new ones freely. Each item lists its
acceptance criteria (AC). Phases are a guide, not a cage.

## Phase A — Foundation
- [ ] **A1 Scaffold.** Next.js + TS strict + Tailwind, static export with `basePath /lafz`, ESLint,
  Prettier, Vitest, Playwright (iPhone + Pixel projects), `npm run check`.
  AC: `npm run build` produces `out/`, and a hello page renders at 375px.
- [ ] **A2 CI/CD.** GitHub Actions: check, build, e2e on push. Deploy `out/` to GitHub Pages on main.
  AC: the site is live at https://surmud.github.io/lafz/, and Playwright screenshots upload as artifacts.
- [ ] **A3 Design system.** Colour palette (warm and desi, not Duolingo green), type scale, Nastaliq
  font self-hosted, light/dark, base components (Button, Card, ProgressBar, AudioButton,
  UrduText with Roman/Nastaliq toggle).
  AC: a /dev/ui gallery page; screenshots look polished at 375px in both themes.
- [ ] **A4 Content schema.** Zod schema (SPEC §6–7), loader, content linter, `npm run content:check`.
  AC: invalid fixtures fail and valid ones pass, in CI.
- [ ] **A5 Lesson engine.** A pure state machine with requeue-on-wrong, comeback bonus, and completion.
  AC: ≥90% branch coverage on the engine.
- [ ] **A6 Roman matcher.** SPEC §8, with a ≥150-case variant table and a reject list.
  AC: all cases pass; documented in code.
- [ ] **A7 Storage layer.** IndexedDB repo for progress/XP/streak/recordings, plus export/import.
  AC: unit tests with fake-indexeddb.

## Phase B — Core learning loop
- [ ] **B1 Exercise UIs.** Multiple choice, match pairs, type answer, listen & select, build the
  sentence, respect pick, fill the gap. Instant feedback, with playful and varied feedback lines.
- [ ] **B2 Lesson player.** Intro cards for new phrases, then exercises, then a completion screen with
  the can-do unlocked.
- [ ] **B3 TTS pipeline.** `scripts/generate_audio.py` (MMS), normal and slow audio, hash cache, audio
  QA (silence/duration), credits screen.
  AC: every phrase in the content has two audio files, and the QA script passes.
- [ ] **B4 Unit 1 content** (5–7 lessons + boss conversation), fully sourced.
- [ ] **B5 Home / course map.** Speaking path, reading path, prep packs, "continue" button.
- [ ] **B6 Placement check.** SPEC §11. AC: E2E test of placement → suggested unit.
- [ ] **B7 XP, streak (rest/pause), can-do screen.**
- [ ] **B8 Required E2E.** Placement → Unit 1 Lesson 1 complete, with screenshots.

## Phase C — Full course
- [ ] **C1 Conversation engine + boss fights** (branching, choose/type/speak, in-character hints).
- [ ] **C2 Units 2–4 content.**
- [ ] **C3 Reading track R1–R5** (letters, joining forms, tracing).
- [ ] **C4 Units 5–8 content.**
- [ ] **C5 Reading R6–R10.**
- [ ] **C6 Units 9–12 content.**
- [ ] **C7 Spaced review sessions** (Leitner) + a "Review" entry on home.

## Phase D — Family and speech
- [ ] **D1 Speak it.** Web Speech API with a Whisper (transformers.js) fallback; graceful when unsupported.
- [ ] **D2 Ask Ammi** share flow + badge.
- [ ] **D3 Family voice** recording, which overrides TTS, with export/import.
- [ ] **D4 Family tree** interactive explorer + respect meter.
- [ ] **D5 Prep packs** (Shaadi in 5 days, Eid next week, Nani visiting, First call with Khala, Trip
  to Pakistan).

## Phase E — Polish and PWA
- [ ] **E1 PWA.** Manifest, icons, service worker, offline lessons, "download unit".
- [ ] **E2 Onboarding.** Pick heritage vs beginner, the placement offer, set your relatives' names
  (optional; personalises dialogue).
- [ ] **E3 Accessibility pass + Lighthouse ≥ 90** on all categories.
- [ ] **E4 Delight.** Character illustrations (SVG, original), micro-animations, sound effects,
  lesson-complete celebrations.
- [ ] **E5 PROGRESS.md final.** What's built, medium-confidence Urdu list, known issues, next steps.

## Phase F — Self-improvement (ongoing, forever)
- [ ] Eval pass after every phase. File items from the lowest rubric scores.
- [ ] Content audit: re-check a random 10% of phrases against sources each pass.
- [ ] Audio audit: round-trip with Whisper; regenerate or flag bad clips.
- [ ] Ideas list: add your own feature ideas here and build the good ones.
