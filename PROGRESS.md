# Progress

## Status (2026-11-16)
**The MVP is live at https://surmud.github.io/lafz/** and CI is green on `main`. A Playwright test
covers onboarding → placement → suggested unit → Unit 1 Lesson 1 → home on iPhone and Pixel viewports
(375 px wide), with screenshots uploaded as CI artifacts.

Built so far:
- **Engine** (`src/engine/`, pure TS, 300 unit tests, >93% branch coverage): forgiving Roman Urdu
  matcher (230-case variant table), lesson state machine (requeue on wrong, comeback bonus, never
  blocked), never-punishing streak (pause days, rest, DST-safe), XP and levels, Leitner review,
  adaptive placement, scripted branching conversations with a graph linter, progress and can-dos.
- **Storage**: IndexedDB for progress and family recordings, plus backup export/import.
- **Content**: Unit 1 "Salaam & Respect": 62 phrases, 6 lessons, 59 exercises, and a boss
  conversation with Shabnam Khala that has a recoverable "tu" disaster branch.
- **Verification**: `scripts/verify_lexicon.py` looks up every Urdu word in Platts (DSAL) and
  Wiktionary, plus hand-checked Rekhta entries in `content/lexicon-manual.json`, and writes `sources`
  onto every phrase. 70/70 Unit 1 words are covered.
- **Audio**: `scripts/generate_audio.py` uses MMS-TTS to make normal and slow (0.72×) clips, named by
  hash, with QA for silence, clipping and duration. There are 124 clips (699 KB). The app finds clips
  by hashing in the browser, so no manifest is shipped.
- **UI**: home/course map, unit page, lesson player with 8 exercise types (choice, match, type, build,
  respect meter, fill the gap, speak, trace), boss chat (pick, type or speak), placement, review, and a
  Me page (can-dos, streak, settings, backup, credits). Onboarding is in place. Light and dark themes
  both work.

## Log
- 2026-11-16 (later): Units 2–4 (Family Tree, Dawat Survival, Calls to Pakistan), each with a boss
  conversation. Reading track R1–R5 (all letters, joining forms, tracing, first words). Interactive
  family tree with respect meter. PWA: installable, offline shell, per-unit offline download. Persona
  E2Es for all six EVALS personas pass (Hamza = MVP spec, Zara, Sloppy Sam, Wrong-a-lot Wajid,
  Away-for-a-week Ayesha, Offline Omar). Fixed a data-loss race (early saves could overwrite stored
  progress) and a service-worker bug (HTML/RSC cache collision broke offline home).
- 2026-11-16: Engine, storage, Unit 1, audio, all core UI, MVP E2E. Deployed.
- 2026-11-15: Scaffold, CI/CD to Pages. Plan v2 merged.

## Decisions
- No LLM, cloud TTS or backend in the MVP. Cost is $0.
- TTS: Meta MMS (CC-BY-NC). It must be replaced (Azure ur-PK) before any paid tier.
- Verification: reputable references, not human review. Dictionary checks are **word-level**
  (every word is attested in a reference). Phrase-level naturalness rests on standard usage. Set
  greetings are additionally checked as whole phrases (Rekhta, Wiktionary).
- Rekhta and UDB block scripted access (HTTP 503), so they are checked by hand and recorded in
  `content/lexicon-manual.json`.
- DSAL's Platts stores headwords with Arabic code points (ي, ه). The verifier converts the spelling
  before querying.
- `dh → z` folding from SPEC §8 is not applied globally: `dh` is usually aspirated د (doodh). The
  lexicon handles ramzan/ramadan instead.
- Match exercises can't be failed (wrong taps just shake). Speaking always has "I said it" and
  "Can't speak now", because speaking is never required.
- Commits carry the co-author line of the model that actually wrote them (Opus 5.5 / Fable 5.1 sessions).

## Medium-confidence Urdu (for an eventual native-speaker pass)
These phrases contain English loanwords written in Urdu script, which no Urdu dictionary lists. The
spellings follow common usage:
- کزن (cousin): u02.cousin, u02.bilal-cousin, u02.b.mera-cousin-doctor
- لسٹ (list): u02.b.spreadsheet, u02.b.bilal-bhi
- ڈائٹ (diet), پلیز (please): u03.b.diet, u03.b.kya-diet, u03.b.ji-cheeni-kam
- لائن (line), وائس نوٹ (voice note), ہیلو (hello), مسز (Mrs.), جیکٹ (jacket): Unit 4 phone-call lines
- Idiom to double-check with a native speaker: "aap ke haath mein bohat zaiqa hai" (u03.haath-zaiqa).
  All of its words are attested, but the idiom itself is attested only by usage.

## Known issues
- Placement covers units 1–4 so far (G1).
- Prep packs and units 5–12 / R6–R10 are not built yet.
- The MMS clips haven't been checked by speech-recognition round-trip yet (G3).
- Speech recognition uses the Web Speech API only. There's no Whisper fallback yet.

## Next steps
Units 2–4 with placement questions → family tree → reading R1–R5 → prep packs → PWA/offline → units
5–12 → R6–R10 → persona evals.

## Needs founder
_(nothing)_
