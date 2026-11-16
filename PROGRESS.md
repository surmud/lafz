# Progress

## Status (2026-11-16, end of day)
**The full course is live at https://surmud.github.io/lafz/** and CI is green on `main`.

What's built:
- **Speaking course: all 12 units**, 52 lessons, each with a scripted boss conversation (pick, type
  or speak a reply; branching endings). Units: Salaam & Respect · Family Tree · Dawat Survival · Calls
  to Pakistan · Numbers, Time & Money · Out & About · Shaadi Season · Body, Health & Nazar · All About
  You · Eid, Ramadan & Occasions · Taunts, Banter & Parent Lines · Tell a Story.
- **Reading track: R1–R10**, from letters in shape families and joining forms to reading signs,
  family WhatsApp messages and, at the end, a Ghalib couplet (cited to Rekhta).
- **Prep packs (5):** Shaadi in 5 days, Eid next week, First call with Khala, Nani is visiting, Trip to Pakistan.
- **Family:** an interactive family tree with a respect meter; **Family voice** (relatives record
  phrases, and the recordings replace the TTS); **Ask Ammi** sharing (Web Share or WhatsApp) with a badge.
- **Engine:** forgiving Roman Urdu matcher, lesson requeue + comeback bonus, a streak that rests and
  never resets, Leitner review, adaptive placement across all 12 units, can-dos. 300 unit tests.
- **PWA:** installable; offline app shell; "Download this unit for offline".
- **Content:** 690 phrases. Every word in a phrase is checked against Platts (DSAL), Wiktionary or
  Rekhta, and the sources are recorded per phrase. 1,310 MMS-TTS clips (normal + slow), all passing QA.
- **Tests:** E2E runs for all six EVALS personas plus the MVP flow, prep packs, family voice, offline
  use, trace centring and a screen gallery. Eval pass 1 is in `docs/evals/2026-11-16-1.md`.
- **Lighthouse** (mobile, local build): lesson page 94 / 100 / 100 / 91. Home performance 78 (filed as G10).

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
37 phrases in all. Each contains an English loanword in Urdu script that dictionaries don't list
(cousin, list, diet, please, line, voice note, hello, Mrs., jacket, washroom, traffic, options, update,
virus, engineer, surgery, settle, weekend, personal, pager, golf, smart, free). `npm run content:check`
prints the full count; `python scripts/verify_lexicon.py --report` lists every one.
These phrases contain English loanwords written in Urdu script, which no Urdu dictionary lists. The
spellings follow common usage:
- کزن (cousin): u02.cousin, u02.bilal-cousin, u02.b.mera-cousin-doctor
- لسٹ (list): u02.b.spreadsheet, u02.b.bilal-bhi
- ڈائٹ (diet), پلیز (please): u03.b.diet, u03.b.kya-diet, u03.b.ji-cheeni-kam
- لائن (line), وائس نوٹ (voice note), ہیلو (hello), مسز (Mrs.), جیکٹ (jacket): Unit 4 phone-call lines
- Idiom to double-check with a native speaker: "aap ke haath mein bohat zaiqa hai" (u03.haath-zaiqa).
  All of its words are attested, but the idiom itself is attested only by usage.

## Known issues
- Home page Lighthouse performance is 78: the home content depends on IndexedDB (G10).
- MMS audio passes QA but hasn't been round-tripped through speech recognition yet (G3). Its prosody is flat.
- No real-microphone E2E for family voice: headless Chromium can't open a fake mic here (G8).
- The Offline Omar test is occasionally flaky when the local machine is under heavy load (passes in CI).
- Speaking uses the Web Speech API only. Where it's missing, "I said it" and "Can't speak now" keep lessons moving (G9).
- Placement covers units 1–4 so far (G1).
- Prep packs and units 5–12 / R6–R10 are not built yet.
- The MMS clips haven't been checked by speech-recognition round-trip yet (G3).
- Speech recognition uses the Web Speech API only. There's no Whisper fallback yet.

## Next steps
G3 Whisper audio audit → G10 home first paint → G4 personalised names → G11 funnier drills → G6
deeper R1–R5 → eval pass 2.

## Needs founder
_(nothing)_
