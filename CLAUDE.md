# Working rules for Lafz

You are building Lafz end to end, autonomously, over a long session. The founder has given you full
latitude: **use your own judgement, take initiative, go big**. Nobody is reviewing each step. Your
job is to ship a high-functioning MVP, and then keep improving it from your own testing.

Read first, every session: [SPEC.md](SPEC.md) (what), [BACKLOG.md](BACKLOG.md) (what next),
[PROGRESS.md](PROGRESS.md) (where things stand), [docs/EVALS.md](docs/EVALS.md) (how to judge quality).

## The loop
1. Pick the top unfinished item in BACKLOG.md. If you see something more valuable, reorder and say why
   in PROGRESS.md.
2. Build it with tests. Run `npm run check` (lint + typecheck + unit + content validation) and the
   relevant Playwright specs.
3. Commit straight to `main` with a clear message, then push. CI deploys to GitHub Pages.
4. Update BACKLOG.md (tick the item off, add whatever you discovered) and PROGRESS.md (log entry,
   known issues).
5. Every few items, or after any user-facing change, run an **eval pass** (docs/EVALS.md): persona
   runs with screenshots, look at the screenshots yourself, score against the rubric, and file the
   lowest scores as backlog items. Then repeat.

Never stop just because a phase is done. When the backlog runs dry, run evals, brainstorm, and refill it.

## Git
- Commit and push directly to `main`. No PRs needed. Small, frequent commits.
- Keep `main` green. If CI breaks, fixing it comes first.
- End commit messages with: `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`
- Never force-push and never rewrite history on main.

## Content rules
- All Urdu must be cross-checked against a reputable source (Rekhta Dictionary, Urdu Lughat/UDB,
  Platts via DSAL, Wiktionary as secondary) **before** it's committed. Record `sources` and `confidence`
  on each phrase (SPEC §6). You have web access, so use it. There is **no human approval step**.
- Every phrase needs: Roman text, Nastaliq text, English meaning, sources, confidence, and audio.
- Prefer how Pakistani families actually talk over textbook-formal Urdu. Natural code-switching is fine
  where real people do it; mark it `register: "casual"`.
- Humor: no limit. Roast the relatives, the situations, the culture. The learner is always laughing
  *with* the app, never mocked for mistakes.
- Medium-confidence items (idioms, slang) ship anyway and get listed in PROGRESS.md.

## Product rules (don't break these)
- No hearts, energy, lockouts, ads, or guilt. Nothing is ever locked behind progress.
- Streak rests, never resets.
- Progress is shown as can-dos.
- Roman first, Nastaliq toggle everywhere, reading track available from day one.
- Mobile first: design at 375px wide, then scale up.

## Tech rules
- Next.js App Router + TypeScript (strict) + Tailwind, static export, `basePath: "/lafz"`, GitHub Pages.
- No backend, no paid APIs, no secrets. Everything runs on the device (IndexedDB).
- Business logic lives in `src/engine/` as pure TS with Vitest coverage. Components stay thin.
- TTS: Meta MMS (`facebook/mms-tts-urd-script_arabic`) via `scripts/generate_audio.py`, generated
  locally and committed, hash-cached. Use a Python venv in `.venv/` (gitignored). The model licence is
  CC-BY-NC, so keep the adapter swappable and credit it in the app.
- Self-host fonts (Noto Nastaliq Urdu). Put `lang="ur" dir="rtl"` on Urdu text.
- Keep the deployed bundle lean. Lazy-load heavy things (Whisper, the audio for each unit).
- Use current stable versions of dependencies. Check the docs when unsure. Don't guess at APIs.

## Testing your own work
- Use Playwright for persona runs and screenshots (`e2e/`). Read the screenshots: you can see images,
  and this is how you catch ugly or broken UI.
- Use the built-in browser preview to explore the app like a user does.
- Audio sanity: duration in range, not silent, not clipped. Where possible, round-trip the audio through
  speech recognition (Whisper, local) and compare with the source text to catch broken TTS.
- The definition of done for any feature: tests pass, the persona run passes, the screenshot looks
  good at 375px, and the rubric score doesn't go down.

## When to stop and ask the founder
Almost never. Only for: spending money, creating accounts on third-party services, changing the
licence/visibility of the repo, or something that would publish under the founder's name beyond this
repo and its Pages site. Everything else: decide, document the decision in PROGRESS.md, move on.

## Budget
$0. No paid services. If something would cost money, find a free alternative or file it under
"Needs founder" in PROGRESS.md and carry on.
