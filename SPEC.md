# Lafz — Product Spec (v2)

> **Lafz** (لفظ, "word"). An Urdu course from zero to conversational, built for heritage learners
> (diaspora kids who understand some Urdu but can't speak or read it) and usable by complete beginners.
>
> v2, 2026-11-15. Replaces v1 (Milestone 1 research). The v1 research (competitors, TTS comparison) is
> summarised in §12. Working rules for the build agent are in [CLAUDE.md](CLAUDE.md).

---

## 1. What we're building

A **free, installable, offline-capable web app** (PWA) with:

- A **Speaking track**: 12 situational units, about 70 lessons, from "Salaam" to telling a story about the wedding.
- A **Reading track**: about 10 units of Nastaliq, from letters to a Ghalib couplet.
- **Scripted branching conversations** (no LLM) as unit "boss fights".
- **Prep packs** for real upcoming events.
- **Speaking practice** with speech recognition.
- **Ask Ammi**: share phrases with family to check and practise.
- **Family voice**: a relative records the audio, and it replaces the TTS for that learner.
- **Kinship and respect** tools: a family tree, plus when to use aap, tum or tu.
- A **placement check**, **XP**, a **streak that never punishes**, and a **can-do progress** screen.

No backend, no accounts, no ads, no paywall, no LLM, no paid APIs. Everything runs on the device.

## 2. Core identity (the Duolingo pain points we fix)

1. **Useful phrases first, organised by situation.** Test for every lesson: *could you use it tonight?*
2. **Make mistakes for free.** No hearts, no energy, no lockouts. Wrong answers come back later in the
   lesson, and getting them right then earns a *comeback bonus*.
3. **Fluency, not streaks.** Progress is "You can now survive a dawat," not just XP.
4. **Trustworthy content.** All Urdu is cross-checked against reputable references (§6) and the source is recorded.
5. **Meet people where they are.** Placement lets heritage speakers skip what they already know. Nothing is ever locked.
6. **Respect.** No ads, no guilt-trip notifications, streaks pause instead of breaking, core is free forever.

## 3. Learner insights that shape the design

- **Heritage speakers understand far more than they can produce.** Bias exercises toward *producing*
  answers ("Khala says X. What do you say back?") over recognising them.
- **Diaspora families code-switch.** "Beta, homework ho gaya?" is real Urdu at home. Accept and teach
  natural Urdu–English mixing where natives would use it, and label it as casual.
- **Respect grammar is a social minefield.** aap, tum and tu, kinship terms (khala, phuppo, chachi,
  mami), and honorifics (ji, sahab) get dedicated teaching and are repeated throughout.
- **Real speech is fast.** Every phrase has normal and slow audio, and listening drills include
  "aunty speed".
- **The goal is family.** Features that bring the family in (Ask Ammi, family voice) are core, not extras.

## 4. Tone and humor

Playful, sharp, very desi. **No limit on humor.** Roast-level jokes about khalas, rishta aunties,
competitive cousins, desi parents, wedding chaos, chai snobbery, "beta, you've gotten fat/thin", and
engineer/doctor pressure are all in. Recurring characters give the course continuity (Fable can
expand the cast):

- **Shabnam Khala**: nosy, loving, calls at 6am Pakistan time, asks about rishtas within 30 seconds.
- **Nani**: says little, judges everything, secretly the funniest.
- **Bilal (cousin)**: insufferable, a doctor, mentioned constantly by your parents.
- **Rishta Aunty (Mrs. Butt)**: has a spreadsheet.
- **Ammi / Abbu**: the classic lines ("Hum tumhari umar mein…").
- **Rickshaw-wala Pervez**: haggling nemesis.

The jokes target situations and relatives, never the learner's mistakes. The learner should laugh
*with* the app.

## 5. Curriculum

### 5.1 Speaking track (Roman Urdu first, Nastaliq toggle on every screen)

Each unit has 5–7 lessons (2–4 minutes each), then a **boss conversation**, then a can-do unlocked.

| # | Unit | Situations | Grammar introduced |
|---|---|---|---|
| 1 | Salaam & Respect | greeting elders, "how are you", goodbyes, ji | hai/hain, main/aap/tum/tu |
| 2 | The Family Tree | who's who, introducing relatives, khala vs phuppo | possessives ka/ki/ke, mera/meri |
| 3 | Dawat Survival | eating, "bas bas!", praising food, chai | chahiye, pasand, nouns' gender |
| 4 | Calls to Pakistan | bad line, voice notes, "awaz aa rahi hai?" | questions (kya/kab/kahan/kaun), present continuous |
| 5 | Numbers, Time & Money | prices, age, time, dates | numbers 1–100, baje |
| 6 | Out & About | rickshaw, bazaar haggling, dhaba, directions | imperatives (aap/tum forms), postpositions |
| 7 | Shaadi Season | mehndi, baraat, rishta aunties, dancing pressure | future tense, ga/gi/ge |
| 8 | Body, Health & Nazar | sick, tired, desi remedies, nazar | feelings, sakna, lagna |
| 9 | All About You | job, studies, hobbies, "when are you settling down?" | simple past (non-ne verbs) |
| 10 | Eid, Ramadan & Occasions | Eid Mubarak, iftar, condolences, congrats | ne-construction |
| 11 | Taunts, Banter & Desi Parent Lines | sarcasm, comebacks, classic parent lines | compound verbs (ja/le/de), subjunctive |
| 12 | Tell a Story | recounting the wedding, gossip | putting the tenses together, connectors |

### 5.2 Reading track (Nastaliq), unlocked from day 1, independent of speaking

| # | Unit |
|---|---|
| R1 | How Urdu script works (right to left, joining, Nastaliq slant) |
| R2–R5 | Letters in shape families (ب پ ت ٹ ث / ج چ ح خ / د ڈ ذ ر ڑ ز ژ / س ش ص ض ط ظ ع غ …) with joining forms |
| R6 | Short vowels, zer/zabar/pesh, do-chashmi he, nun ghunna, choti/bari ye |
| R7 | Reading words you already know from the speaking track |
| R8 | Signs, menus, shop boards |
| R9 | WhatsApp messages from family (mixed script, emojis) |
| R10 | Final test: read a famous Ghalib or Faiz couplet, with meaning |

Reading exercises: letter recognition, which form is this (initial/medial/final/isolated), tracing
(pointer/touch canvas, scored loosely), word build, read-and-select-meaning, read aloud
(speech-recognition check).

### 5.3 Prep packs
Short playlists (3–5 lessons, mixing review and new material) for a real event, picked on the home screen:
"Shaadi in 5 days", "Eid next week", "Nani is visiting", "First call with Khala", "Trip to Pakistan".
They reuse lesson content, and each has its own can-do.

### 5.4 Kinship and respect tools
- **Family tree**: interactive. Tap a relative to get their term (maternal vs paternal), how to address
  them, and audio.
- **Respect meter**: some exercises ask you to pick the right register for the listener (nani vs
  cousin vs rickshaw-wala). Feedback explains the social effect ("Tu to nani?? Bold choice.").

## 6. Content and verification

- All lesson content is JSON in `content/`, validated by Zod in CI.
- **No human approval step.** Every phrase is checked against at least one reputable reference before
  it ships:
  - Rekhta Dictionary (rekhtadictionary.com): spelling, Nastaliq, meaning
  - Urdu Lughat, Urdu Dictionary Board (udb.gov.pk / urdulughat.pk)
  - Platts, *A Dictionary of Urdu, Classical Hindi and English* (dsal.uchicago.edu)
  - Wiktionary (Urdu entries) as a secondary source
  - For grammar: established Urdu grammar references (e.g. Schmidt, *Urdu: An Essential Grammar*)
- Each phrase records `sources: [{ ref, url?, checked: "2026-11-15" }]` and `confidence: "high" | "medium"`.
  Idioms and casual code-switched lines that dictionaries don't cover are marked `confidence: "medium"`
  and listed in PROGRESS.md so a native speaker can look later. They are **not** blocked.
- Nastaliq text is required on every phrase. TTS is generated from it, and the reading track uses it.

## 7. Exercise types

| Type | Notes |
|---|---|
| Multiple choice | en→ur, ur→en, situation→reply |
| Match pairs | tap pairs, including audio↔text |
| Type the answer | forgiving Roman Urdu matching (§8) |
| Listen & select | normal or aunty speed |
| Build the sentence | word tiles, so learners see word order |
| Respect pick | choose the register for this listener |
| Speak it | speech recognition, forgiving (§9) |
| Fill the gap | one-word cloze with a word bank |
| Reading types | §5.2 |
| Conversation | branching scripted dialogue: choose, type, or speak a reply |

### Scripted conversations (boss fights)
A directed graph of turns. Each learner turn accepts several valid replies (choice, typed or spoken),
and different replies can lead to different branches ("You told Khala you're single. She has
*someone* in mind.") Gentle in-character correction, hints on tap, and no failing: Khala just repeats
or rephrases. The format is the same one a future LLM tier would plug into.

## 8. Forgiving Roman Urdu matching

1. Normalise: lowercase, strip punctuation and diacritics, treat `-` and `'` as spaces, collapse whitespace.
2. Phonetic folding, applied to both sides:
   - collapse doubled letters (`aa`→`a`, `ee`→`i`, `oo`→`u`)
   - `w`↔`v`, `q`→`k`, `z`/`zh`/`dh`→`z`
   - optional nasal `n` after a vowel at the end of a word (`nahin`≈`nahi`, `hain`≈`hai`)
   - `ai`/`ae`/`ay`/`ey`→`e`, `ia`/`ya`→`ya`
   - a short-word lexicon (`h`=`hai`, `k`=`ke`, `mai`/`main`/`mein`)
3. Per token, compare with Damerau-Levenshtein, with a tolerance that scales with word length. Also
   require a whole-answer similarity threshold.
4. Results are `correct`, `almost` (show the canonical spelling, counts as correct) or `incorrect`.
5. Per-exercise `accept` and `reject` lists. `reject` catches near-misses that mean something else
   (khana "food" vs kahna "to say").
6. Code-switching: English words in an answer are accepted where the exercise allows mixing.

This needs a large unit-test table of real-world spelling variants.

## 9. Speech

### TTS (decided: open-source, generated offline)
- **Meta MMS-TTS** `facebook/mms-tts-urd-script_arabic`, run locally with Python and `transformers`.
  `scripts/generate_audio.py` reads the content JSON and synthesises from the **Nastaliq** text. Slow
  audio is made by time-stretching (pitch preserved) or a lower speaking rate.
- Output: `public/audio/<sha256(voice+rate+text)>.mp3` (or opus), small bitrate, committed to the repo.
  The cache is keyed by hash, so unchanged text is never re-synthesised.
- **Licence: CC-BY-NC 4.0 (non-commercial).** That's fine for the free MVP. It **must be replaced
  before any paid tier** (planned: Azure `ur-PK-UzmaNeural`/`AsadNeural`). Keep TTS behind an adapter
  (`mms` | `azure` | `browser`). Credit MMS in an About/credits screen.
- If MMS output for a phrase is bad (Fable listens via metrics and heuristics, plus speech recognition
  round-trips, §11), fall back to the browser's `speechSynthesis` (ur-PK/ur-IN voice if the device
  has one) and log it.
- **Family voice** recordings (§10) always win over TTS.

### Speech recognition ("Speak it")
- Primary: Web Speech API `SpeechRecognition` with `lang="ur-PK"` (Chrome/Edge/Android).
- Fallback: an in-browser Whisper model via transformers.js (lazy-loaded, cached), or hide the
  exercise gracefully if it's unsupported. Speaking is never required to finish a lesson.
- Matching: transcripts may come back in Nastaliq or Roman. Compare against both forms using the
  forgiving matcher (transliterate Nastaliq→Roman for comparison).

## 10. Family features (no backend)

- **Ask Ammi**: on any phrase, a "Did I say this right?" button. It uses the Web Share API, or a
  WhatsApp `wa.me/?text=` link with the Roman text, the Nastaliq text, and optionally the learner's
  recording. Light gamification: "Asked family 5 times" is a can-do badge.
- **Family voice**: hand the phone to a parent. They record phrases for a lesson (MediaRecorder,
  stored in IndexedDB), and those recordings replace TTS for this learner. An export/import file
  allows moving to a new device.
- **Practice with family** mode: a print/share card of "5 phrases to try at dinner tonight".

## 11. Architecture

- **Next.js (App Router) + TypeScript + Tailwind**, built with `output: "export"` as a fully static
  site. `basePath: "/lafz"` for GitHub Pages.
- **PWA**: manifest, icons, a service worker (Serwist or hand-rolled). Precache the app shell and the
  content JSON; cache audio on use, and per unit on request ("download unit for offline").
- **State**: all on the device. IndexedDB (via `idb` or Dexie) for progress, XP, streak and
  recordings; localStorage for small preferences. A data export/import screen.
- **Pure engine** in `src/engine/` (no React), unit tested: lesson state machine, matching, exercise
  checkers, placement, XP, streak, can-do derivation, spaced review queue.
- **Spaced review**: items you got wrong or haven't seen in a while come back in "Review" sessions
  (a simple Leitner scheme).
- **Future hooks** (interfaces only, no implementation): `SyncProvider` (accounts), `ConversationEngine`
  (scripted now, LLM later), `TtsProvider` (azure), `Entitlements` (paid AI tier).

### Streak that never punishes
The streak counts days with any practice. You get 2 automatic pause days per week. Once those run
out, the streak *rests*: it doesn't reset, and it resumes when you're back. Best streak is kept
forever. No notifications.

### Placement
About 5–8 adaptive questions (listening, picking a reply, register, typing, reading). Placement
*suggests* a starting unit, marks earlier units as "skipped, review anytime", and offers a reading
placement too. "Total beginner" skips the check. Nothing is locked.

### Can-do screen
A checklist of situations ("✓ You can greet elders respectfully"), units and reading level, XP, the
streak with pause days, minutes practised, the family badge, and the next can-do teaser.

## 12. Quality bar and testing

- **Vitest**: engine, matcher (variant table), placement, XP/streak (including time zones and DST),
  the content schema for every JSON file, and a content linter (every phrase has Nastaliq, audio,
  sources; every exercise references existing phrases).
- **Playwright**: mobile projects (iPhone and Pixel viewports). Persona-driven E2E runs with a
  screenshot at each step (see [docs/EVALS.md](docs/EVALS.md)). Required: placement, then Unit 1
  Lesson 1, end to end.
- **Accessibility**: tap targets ≥44px, contrast, screen-reader labels, `lang="ur"` and `dir="rtl"`
  on Urdu text, a Nastaliq web font (Noto Nastaliq Urdu, self-hosted).
- **CI** (GitHub Actions) on every push: lint → typecheck → unit → content validate → build → e2e →
  deploy to GitHub Pages (main only).
- **Lighthouse** PWA/performance check on the deployed site.

## 13. Out of scope for now
LLM chat, cloud TTS, accounts and sync, payments, push notifications, native apps, leaderboards.

## 14. Research summary (from v1)
- No Duolingo Urdu course for English speakers. Competitors (Ling, Mondly, UrduPod101, Talkpal, uTalk,
  Pimsleur/Mango) are paid, generic, or passive, with no placement and no heritage focus. Exact-match
  Roman Urdu checking marks real spellings as wrong.
- TTS: Azure ur-PK neural voices are the best paid option (Pakistani accent, SSML, ~$16/1M chars).
  Google offers ur-IN Chirp 3 HD and ur-PK Gemini-TTS in preview. Uplift AI (YC S25) is Urdu-first and
  worth a listen later. **Always synthesise from Nastaliq, not Roman.**
- Full v1 sources: git history of this file (commit 6ae425b).
