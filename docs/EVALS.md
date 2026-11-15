# Evals: how Lafz judges itself

The build agent runs an eval pass after each phase, and after any notable user-facing change. It
writes the results to `docs/evals/YYYY-MM-DD-<n>.md` and turns the lowest scores into BACKLOG items.

## 1. Personas (Playwright, mobile viewport, screenshot every step)

| Persona | Profile | Script | Checks especially |
|---|---|---|---|
| **Heritage Hamza** (iPhone) | 24, understands parents, freezes when speaking, can't read | Takes placement, gets ~4/6, starts mid-course, does 2 lessons + a boss conversation | Placement skip works, production-heavy exercises, no boredom |
| **Zero Zara** (Pixel) | 30, married into a Pakistani family, knows nothing | "Total beginner", Unit 1 Lessons 1–3, then the reading track R1 | Nothing assumed, explanations clear, never feels lost |
| **Sloppy Sam** (iPhone) | Types Roman Urdu every which way ("kia hal h", "shukria") | Type-answer-heavy lesson | Matcher accepts real variants, rejects wrong meanings, feedback is kind |
| **Wrong-a-lot Wajid** (Pixel) | Gets 50% wrong on purpose | Full lesson | Never blocked, requeue works, comeback bonus fires, tone stays encouraging |
| **Away-for-a-week Ayesha** | Returns after 9 days (mock clock) | Opens the app | Streak is *resting*, not reset; welcome-back is warm, no guilt |
| **Offline Omar** | Airplane mode after first load | Starts a downloaded unit | Lesson and audio work offline |

Each persona run saves numbered screenshots to `e2e/screenshots/<persona>/` and is uploaded by CI.

## 2. Rubric (score 1–5 each, from the screenshots and the experience)

| # | Criterion | 5 looks like |
|---|---|---|
| R1 | **Use it tonight** | Every lesson's phrases would come up in a real family conversation this week |
| R2 | **Mistakes are free** | Wrong answers cost nothing, feedback teaches, tone is warm |
| R3 | **Can-do clarity** | After each lesson the user knows exactly what they can now *do* |
| R4 | **Heritage fit** | Heritage users skip the basics fast; the content feels like *their* family |
| R5 | **Funny** | At least one genuine laugh per lesson; characters feel alive |
| R6 | **Urdu quality** | Natural, sourced, correct Nastaliq, register-appropriate |
| R7 | **Audio** | Clear, correct pronunciation, slow mode useful, no glitches |
| R8 | **Visual polish** | Looks like a top-50 App Store app at 375px; consistent, no layout bugs |
| R9 | **Speed and flow** | Tap-to-feedback feels instant; a lesson takes 2–4 min; no dead ends |
| R10 | **Accessibility** | Readable, tappable, screen-reader labelled, RTL correct |
| R11 | **Reading track** | A beginner can genuinely read simple words after R1–R7 |
| R12 | **Trust** | No ads, no dark patterns, clear about what data stays on the device |

Write down the scores and the reasoning, compare with the last pass, and treat any drop as a bug.

## 3. Automated quality gates (CI)
- Unit, content and E2E tests are green.
- Content linter: 100% of phrases have Nastaliq, audio and sources.
- Audio QA: no silent or overlong clips. Whisper round-trip similarity is logged, and the worst 5% are
  flagged in PROGRESS.md.
- Lighthouse on the deployed site: PWA installable, performance ≥ 90 on mobile.
- Bundle size budget: first load JS ≤ 200 KB gzip (heavy features lazy-loaded).

## 4. Self-play content review
For each new unit, the agent re-reads the unit as a skeptical native speaker and as a confused beginner
and fixes anything that fails: unnatural phrasing, the wrong register for the listener, jokes that
fall flat, or exercises solvable without understanding (e.g. picking the only Urdu-looking option).
