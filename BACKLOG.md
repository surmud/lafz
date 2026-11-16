# Backlog

Ordered by priority. Tick items off as they're done and add new ones freely. Each item lists its
acceptance criteria (AC). Phases are a guide, not a cage.

## Phase A — Foundation
- [x] **A1 Scaffold.** Next.js + TS strict + Tailwind, static export with `basePath /lafz`, ESLint,
  Prettier, Vitest, Playwright (iPhone + Pixel projects), `npm run check`.
  AC: `npm run build` produces `out/`, and a hello page renders at 375px.
- [x] **A2 CI/CD.** GitHub Actions: check, build, e2e on push. Deploy `out/` to GitHub Pages on main.
  AC: the site is live at https://surmud.github.io/lafz/, and Playwright screenshots upload as artifacts.
- [~] **A3 Design system.** (palette, type, Nastaliq, light/dark and base components done; /dev/ui gallery still to do) Colour palette (warm and desi, not Duolingo green), type scale, Nastaliq
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
- [ ] **C2 Units 2–4 content.**
- [ ] **C3 Reading track R1–R5** (letters, joining forms, tracing).
- [ ] **C4 Units 5–8 content.**
- [ ] **C5 Reading R6–R10.**
- [ ] **C6 Units 9–12 content.**
- [x] **C7 Spaced review sessions** (Leitner) + a "Review" entry on home.

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

## Discovered while building (2026-11-16)
- [ ] **G1 Placement pool grows with the course.** Add 2 placement questions per new unit (levels 2–12);
  placement can only suggest units that exist.
- [ ] **G2 /dev/ui gallery** (finishes A3).
- [ ] **G3 Whisper round-trip audio audit** (EVALS §3): transcribe each MMS clip, log similarity, flag the worst 5%.
- [ ] **G4 Personalised names in dialogue.** Onboarding stores relatives' names but nothing uses them yet.
- [ ] **G5 Persona specs** for all six EVALS personas (only the MVP flow and a screen gallery exist).

## Phase F — Self-improvement (ongoing, forever)
- [ ] Eval pass after every phase. File items from the lowest rubric scores.
- [ ] Content audit: re-check a random 10% of phrases against sources each pass.
- [ ] Audio audit: round-trip with Whisper; regenerate or flag bad clips.
- [ ] Ideas list: add your own feature ideas here and build the good ones.
