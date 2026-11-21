# Progress

## Status (2026-11-18, morning)
Live at https://surmud.github.io/lafz/ (v1 is tagged `v1.0`). CI green.
- **Two modes:** Speak (speaking course, 13 core + 6 advanced units) and Read (10 reading units +
  stories in Nastaliq). Toggle on home.
- **Content:** 29 units, 137 lessons, 1,170 exercises, 1,173 phrases (81 medium-confidence, mostly
  English loanwords like TV, petrol, torch), 22 stories, 19 boss conversations, 5 prep packs.
- **Lesson formats:** pick, type, build, match, gap, respect, speak, trace, plus the v2 formats:
  overheard scenes, spot-the-mistake, sort, dictation. Long lessons interleave teaching and practice.
  Memory hooks on tricky words.
- **Practice hub:** review, trouble words, stories, shadowing, hands-free listening, "How do I say…?"
  (on-device AI search over phrases and grammar), phrasebook, grammar guide, hard mode.
- **Progress:** Insights (level band, six skills, 14-day chart), daily streak or weekly goal,
  can-dos. Opt-in anonymous statistics ready but off until the founder sets up an endpoint.
- **Audio:** Matcha-TTS Urdu (Apache-2.0), male and female voices by character, 2,200+ clips,
  Whisper round-trip mean 0.94; short words use a carrier-sentence fallback.
- **Tests:** 331 unit tests, 15 Playwright specs (personas, a11y light/dark, console sweep, offline,
  v2 features), bundle budget 189.6 of 200 KB.

### Needs founder
Public build values live in the committed **`.env.production`** (tip link, Supabase URL + publishable key,
contact address). Edit that file to change them; CI builds from it.

**Done (2026-11-18):** tip jar live on the web (Stripe link); Supabase URL + publishable key in place and
Google sign-in switched on for the web build (verified up to Google's page: Supabase sends the redirect
with `…supabase.co/auth/v1/callback`); contact address `surmudjamil11+lafz@gmail.com` on /privacy,
/terms and /delete-account; Apple Developer Program enrolled; Google OAuth client in Supabase.

**iOS 1.0 (ship first; accounts and tips OFF in the app, privacy label "Data Not Collected"):**
1. **Create the App Store Connect app record**: bundle id `app.lafz` (register it at
   https://developer.apple.com/account/resources/identifiers/add/bundleId if it isn't listed), name "Lafz"
   (fallback "Lafz: Learn Urdu"), SKU `lafz-ios`. Then tell me, and I'll run
   `APPLE_TEAM_ID=JM6S2923X5 npm run ios:upload` (team found in Xcode's signed-in account; confirm it's
   the right one).
2. **TestFlight on your iPhone**: install the build, try a lesson, a story, the mic, and flight mode.
3. **Paste the listing** from `store/listing.md`, upload `store/screenshots/ios-6.9in-1320x2868/` in
   order, App Privacy = Data Not Collected, age rating (4+ computed; override to 13+ if you still want it),
   review notes. Submit for review. Full checklist: docs/RELEASE.md "iOS 1.0".

**Website (accounts are live there):**
4. **Create the progress table**: open https://supabase.com/dashboard/project/tcavluxpbwchtevumvlo/sql/new,
   paste all of `supabase/migrations/20261118000000_user_progress.sql`, click Run. (Needs your dashboard
   login; I can't do it without the service_role key, which must never be shared.)
5. **Try one real Google sign-in** on https://surmud.github.io/lafz/ → Me → Account, then try Delete
   account and data.

**iOS 1.1 (after 1.0 ships):**
6. **Sign in with Apple** (only needed once the app offers Google sign-in):
   1. https://developer.apple.com/account/resources/identifiers/list → App ID `app.lafz` → tick **Sign in with Apple** → Save.
   2. Identifiers → **+** → **Services IDs** → `app.lafz.signin` → tick Sign in with Apple → Configure:
      Primary App ID `app.lafz`; Domains `tcavluxpbwchtevumvlo.supabase.co`; Return URL
      `https://tcavluxpbwchtevumvlo.supabase.co/auth/v1/callback`.
   3. https://developer.apple.com/account/resources/authkeys/list → **+** → Sign in with Apple → download
      the .p8 once; note Key ID and Team ID.
   4. https://supabase.com/dashboard/project/tcavluxpbwchtevumvlo/auth/providers → Apple → enable; Client IDs
      `app.lafz.signin,app.lafz`; Secret Key from the .p8 (guide:
      https://supabase.com/docs/guides/auth/social-login/auth-apple). It expires every 6 months.
7. **Native sign-in redirect**: when I build native sign-in (BACKLOG I4b), add `app.lafz://auth/callback`
   to Supabase → Authentication → URL Configuration → Redirect URLs.

**Not urgent:** user-base statistics (Cloudflare Worker, docs/TELEMETRY.md); governing law for the terms;
a human listen to the 3 weakest clips (چچی، ہفتہ، عدالت); family recordings for character voices (H18).
**Deferred:** Google Play (Play Console, Android Studio on this Mac, 12 testers × 14 days).

## v1 status (2026-11-16, end of day)
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
- **Lighthouse** (mobile, local build with gzip): home 90 / 100 / 100 / 91, lesson page 94 / 100 / 100 / 91.
- **103 lessons:** each speaking unit has 5–7, including a generated "Mix it up" warm-up before its
  boss; each reading unit has 2–4.
- **Original SVG portraits** for the whole cast (Khala, Nani, Bilal, Mrs. Butt, Ammi, Abbu, Pervez, Bashir).

## Log
- 2026-11-21: iOS 1.0 prep (accounts and tips off in the app). Native build: statistics off too, no
  delete-account link where accounts don't exist, app-specific privacy wording ("the app collects no
  data"). New /support FAQ (App Store support URL). `npm run e2e:native` checks the App Store build served
  from its bundle with the network blocked. Screenshots re-taken from the native build. `store/listing.md`
  (limits checked by scripts/store_listing.py). `npm run ios:archive` / `ios:upload` with
  ios/ExportOptions.plist, waiting on the App Store Connect record.
- 2026-11-18: Founder config committed in `.env.production` (CI builds from it): tip jar on for the web,
  Supabase Google sign-in on for the web, contact alias on the legal pages. E2E checks the sign-in step,
  skip, and that Supabase hands off to Google with the right callback (without opening Google's page).
  iOS Release device build verified (unsigned, 57 MB); tips stay hidden and accounts stay off in the app.
- 2026-11-18 (founder priorities I1–I7): removed the relatives-names step (stored names dropped on
  load); "Buy me a chai" tip jar (web only, flag); optional Supabase accounts with Google (Apple behind a
  flag), merge-on-login sync, in-app delete account, RLS migration; Capacitor iOS/Android shell (`app.lafz`),
  running in the iOS simulator, store screenshots, docs/RELEASE.md; /privacy, /terms, /delete-account,
  /credits, erase-device control, brand guardrails; WCAG 2.2 AA pass (e2e/wcag22.spec.ts); language-pack
  refactor (`src/lang/`, content moved to `content/ur/`, docs/ADDING_A_LANGUAGE.md).
- 2026-11-18 (overnight, cont.): Reading-track stories for R7–R9 (Nastaliq-first, every word already
  taught in the reading units, all dictionary-verified). Read mode home shows a "Stories to read"
  card. Tapping a course word in a story adds it to the review deck.
- 2026-11-18 (overnight, cont.): **Every speaking unit now has a story** (19 stories). Memory hooks
  (pattern mnemonics: "almost every question word starts with k", "D for Dad's side") show on teach
  cards and in the feedback after a miss. OmniVoice (per-character voices) evaluated and deferred:
  needs licensed reference recordings (see BACKLOG H18, needs founder).
- 2026-11-18 (overnight, cont.): Five more stories (Seven o'clock sharp, Fever and chillies, The
  missing phone, If Bilal weren't a doctor, The Eid moon): 10 units now have one. Stories got
  "Play all". "How do I say…?" also answers grammar questions by retrieving the matching grammar note
  ("why aati not aata?" → the aana note). Decision on an on-device chat LLM (H14): not shipped, because
  small models can't be trusted to write correct Urdu; AI stays retrieval-only for now.
- 2026-11-18 (overnight, cont.): **Stories** (H19): five short stories (new neighbour, Nani's table,
  first rickshaw, moon night, the power cut). Speak mode plays each line first; Read mode shows the
  Nastaliq first. Tap any word for its meaning; two comprehension questions; counts toward listening
  or reading in Insights. **Shadowing** (H20): hear a sentence, record yourself, compare back to back
  (recordings never saved). **Weekly goal** (H22): Me → Practice goal: daily streak, or 3 / 5 days a
  week with a week-dots badge instead of the streak. Eval pass 3 fixes: lessons with 5+ new phrases
  now interleave teaching and practice.
- 2026-11-18 (overnight, v2): Checkpoint tagged `v1.0`. Then, from the founder's brief:
  - **Speak / Read modes**: a toggle on home switches between the speaking and reading courses. The
    Read tab became **Practice** (review, trouble words, listening mode, "How do I say…?", phrasebook,
    grammar guide, alphabet, hard mode).
  - **New lesson formats** (not Duolingo's): *overheard scenes* (characters talk; answer a question,
    sometimes audio-only), *spot the mistake*, *sort into buckets* (tu/aap, man/woman speaker, formal
    vs everyday), *dictation*. Retrofitted into units 1–12 (a scene in every Mix it up, ~48 dictations).
  - **New content**: Unit 13 Survival Kit (repair phrases, emergencies, lost/broke, pharmacy) and an
    **Advanced course**: 14 Formal Urdu, 15 If/Wish/Maybe, 16 Opinions, 17 Idioms & Proverbs, 18
    Poetry (Ghalib, Iqbal, Mir couplets, cited to Rekhta), 19 The News. 328 new phrases, 7 bosses.
  - **Placement reaches advanced**: a perfect run continues past 7 questions (bonus round) and can
    suggest the advanced course.
  - **Better voices**: switched from Meta MMS to Matcha-TTS Urdu (Apache-2.0), male and female voices
    by character, Whisper-checked takes. Sentence round-trip 0.84 → 0.94 (docs/evals/2026-11-18-voice.md).
  - **Insights** (Me → Insights): estimated level band (CEFR-ish), accuracy per skill (listening,
    speaking, recall, recognition, reading, grammar), 14-day activity, phrases met/solid.
  - **User-base analytics**, opt-in and off by default: snapshot + events to a self-hosted endpoint,
    Cloudflare Worker sample, `scripts/telemetry_report.py` (levels, skills, funnel, retention, worst
    lessons). **Needs founder**: a free Cloudflare account to switch on (docs/TELEMETRY.md).
  - **On-device AI**: "How do I say…?" finds phrases by meaning with MiniLM embeddings
    (precomputed at build, query embedded on the phone via transformers.js, 23 MB on request).
  - Duolingo pain points addressed: hard mode (type, don't tap), trouble-words practice, hands-free
    listening mode, a real grammar guide, no energy/hearts (still none).
- 2026-11-17 (night): Printable cheat sheet per speaking unit (G25). Backlog is clear apart from G15
  (prosody), which needs a human ear.
- 2026-11-17 (evening): Phrasebook (G23), boss-win sharing (G24), Ask Ammi with your own recording
  (G18), future-hook interfaces (G19), CI bundle budget at 186.8 of 200 KB gzip (G20), console-error
  sweep (G21, fixed a hydration mismatch), axe WCAG A/AA in light and dark (G22, fixed 6 contrast
  failures).
- 2026-11-17 (later): G13 scene-setting intros for each unit's warm-up. G14 Rekhta cross-check (no
  corrections needed; two spelling variants logged). G16 "5 phrases to try at dinner tonight" card
  (share or print). G17 reading placement after the speaking placement. G15 (prosody) stays parked
  because it needs a human ear.
- 2026-11-17: Eval pass 2 (docs/evals/2026-11-17-2.md): rubric up in R4, R7, R8, R9, R11; nothing
  went down. Fixed a brief default-name flash in boss intros, save-then-show progress ordering, and
  definition-style prompts in Mix it up. Filed G13–G15.
- 2026-11-17: Voice v3 (carrier-sentence synthesis for short words). On-device Whisper fallback for
  "Speak it", verified to transcribe "آپ کیسے ہیں؟" exactly in Chromium. Experimental real-mic CI test.
- 2026-11-16 (night): Whisper audio audit done (MLX large-v3-turbo, 150-clip sample). All clips
  regenerated as voice v2: short phrases slower and less noisy. Details in docs/evals/2026-11-16-audio.md.
- 2026-11-16 (evening): Relatives' names from onboarding now appear in boss conversations. Review
  and pack drills got situational prompts. R1–R5 got a spelling lesson with dot-family decoys. Every
  speaking unit got a "Mix it up" warm-up. Added original character portraits and a /dev/ui gallery.
  The precache is now the app shell only (5.8 MB → 2.3 MB). Home Lighthouse performance went from 78
  to 90. Fixed a race in the match exercise. Started the Whisper (MLX large-v3-turbo) audio audit on
  a 150-clip sample. Early finding: MMS mispronounces "السلام علیکم".
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
- MMS audio: sentences round-trip well (median 0.87). Single words were weak; voice v3 synthesises them in a carrier sentence (0.23 → 0.70 on the hardest words). MMS prosody is still flat; Azure ur-PK remains the plan before any paid tier.
- The Offline Omar test is occasionally flaky when the local machine is under heavy load (passes in CI).
- Speaking: the Web Speech API where available. Elsewhere there's an opt-in on-device Whisper (whisper-base, ~80 MB, runs in the browser via transformers.js from jsDelivr, voice never leaves the phone).
- Placement covers units 1–4 so far (G1).
- Prep packs and units 5–12 / R6–R10 are not built yet.
- The MMS clips haven't been checked by speech-recognition round-trip yet (G3).
- Speech recognition uses the Web Speech API only. There's no Whisper fallback yet.

## Next steps
Eval pass 3 → G15 prosody (needs a human ear) →
G9 (Whisper fallback for Speak it) → native-speaker pass on the medium-confidence list (needs a human,
optional).

## Needs founder
_(nothing)_
