# Lafz — MVP Spec

> **Lafz** (لفظ, "word"). An Urdu app for heritage learners: people who understand some Urdu but
> can't speak or read it well, and want to talk with family. Complete beginners come second.
>
> Status: Milestone 1 (research + spec). Last updated 2026-11-15.

---

## 1. Problem and positioning

Duolingo has no Urdu course for English speakers. A June 2026 Duolingo course goes the other way
(English for Urdu speakers), so it doesn't help this audience. People are asking for one: there are
Change.org petitions, and r/Urdu threads keep asking for "Duolingo but Urdu." The usual workaround is
Duolingo's **Hindi** course. It gets the spoken grammar right but teaches Sanskritised vocabulary and
the wrong script, and nothing in it is built around Pakistani or diaspora family life.

**Lafz in one line:** useful family phrases first, free to make mistakes, with progress measured by
what you can *do*.

## 2. Competitor teardown

| App | Model | What works | Where it falls short for heritage learners |
|---|---|---|---|
| **Duolingo** (Hindi as proxy) | Freemium, energy/hearts | Habit loop, polish, short lessons | No Urdu. Hindi vocab and Devanagari. Random-word-first ordering. Energy system punishes mistakes. Streak anxiety. |
| **Ling** | Subscription | Gamified, covers script, broad vocabulary | Generic topics. Light on grammar. Reviewers call it disorganised. Paywall arrives early. Starts everyone at zero. |
| **Mondly** | Subscription (~$10/mo) | Short, fun lessons | Same template across 40+ languages, so lessons aren't built around Urdu culture. Synthetic audio. No placement. |
| **UrduPod101** | Subscription, podcast-style | Native-speaker audio, good culture and grammar notes | Passive listening, not practice. English support drops off at higher levels. Upsells heavily. Clunky on mobile. |
| **Talkpal** | Subscription, AI chat | Open-ended conversation | AI-generated Urdu with no verification, so quality varies. Chat gets repetitive. No curriculum. |
| **uTalk** | Paid per language | Real recorded voices, many languages | Words and phrases only, mostly nouns. Not much you could use in a real conversation. |
| **Pimsleur / Mango** | Subscription | Audio-first spoken method (Pimsleur), structured (Mango) | Expensive (Pimsleur). Formal register. No family or desi situations. |

**What nobody does:**
1. Curriculum built around the situations heritage learners actually face: khala on the phone, a
   dawat, a wedding.
2. A placement check that lets someone who already understands Urdu skip "aap kaise hain."
3. Forgiving **Roman Urdu** typing. Everyone spells it differently (`kya`/`kia`, `hai`/`hey`,
   `nahi`/`nahin`), and exact-match apps mark correct answers wrong.
4. Free core lessons with no hearts or energy.

Sources: see §11.

## 3. Product principles (what we hold every decision to)

1. **Could you use it tonight?** Every lesson opens with phrases, not single words. No "the apple is red."
2. **Make mistakes for free.** No hearts, no energy, no ads, no lockouts. A wrong answer gets a gentle
   correction and the question comes back later in the lesson.
3. **Can-do over XP.** XP and streaks exist, but the main progress screen says things like
   "You can greet elders respectfully."
4. **Native-verified content.** Every Urdu string has a `verified` flag. Anything an AI or a non-native
   speaker wrote ships as `verified: false` and goes into the founder's review queue (PROGRESS.md
   plus a script, §5.4).
5. **Meet people where they are.** A ~5-question placement check routes heritage speakers past the basics.
6. **Roman Urdu first.** Nastaliq can be toggled on per lesson and is phased in gradually.
7. **Respect the user.** No guilt-trip notifications. Streaks pause instead of breaking. Pricing stays
   honest: core lessons are free forever, and only AI conversation and voice will be paid.
8. **Desi humor, real tone.** Khala, chai, rickshaws, rishta aunties, wedding chaos. Warm, never
   making fun of the learner.

## 4. Urdu TTS comparison and recommendation

### Candidates

| Provider | Urdu voices | Accent | Price (list, per 1M chars) | Free tier | Learner-relevant controls | Notes |
|---|---|---|---|---|---|---|
| **Azure AI Speech** | `ur-PK-UzmaNeural` (F), `ur-PK-AsadNeural` (M); also `ur-IN-GulNeural`, `ur-IN-SalmanNeural` | **Pakistani** (ur-PK) + Indian | ~$15–16 neural | 0.5M chars/mo (F0) | Full SSML: `prosody rate` for slow mode, `<phoneme>`, `<break>`, per-word timing via word-boundary events | GA since 2021. Mature SDK and REST. |
| **Google Cloud TTS** | Chirp 3 HD + Standard/WaveNet for **ur-IN only**; Gemini-TTS has ur-PK in *preview* | Indian (ur-IN) | $30 Chirp 3 HD; $4 Standard/WaveNet | 1M chars/mo Chirp HD, 4M Standard | Chirp 3 HD has limited SSML. Gemini-TTS can be steered with prompts but is preview-only. | Chirp HD is very natural in general, but the accent is Indian. Gemini-TTS can drift, repeat itself or go silent, per community reports. |
| **ElevenLabs** | Multilingual v2/v3 voices, Urdu supported | Mixed, not consistently Pakistani | Much higher (credit-based) | Small | Voice cloning (could clone a native-speaker founder-approved voice later) | Best emotional range. Developers report weaker Urdu specifically. Cost doesn't fit "free forever." |
| **OpenAI gpt-4o-mini-tts** | Multilingual, Urdu not specifically benchmarked | Varies by voice | Cheap per minute | — | Prompt-steerable tone | No Urdu-specific evaluation found. Accent and pronunciation of loanwords unknown. |
| **Uplift AI** (YC S25) | Urdu, Sindhi, Balochi ("Orator") | **Pakistani**, Urdu-first | Not public | Unknown | WAV output, API key | Built specifically for Pakistani languages. Young company, so vendor risk. Worth a listening test. |

### Key technical finding
**Generate audio from the Nastaliq (Urdu script) text, not from Roman Urdu.** Every engine above was
trained on Urdu script. Roman Urdu input gets read with English phonetics ("kya" said like "kai-a").
So every phrase in our content has to carry Urdu-script text even when the UI shows only Roman Urdu.
The schema in §5 requires it.

### Recommendation: **Azure `ur-PK-UzmaNeural` (primary) + `ur-PK-AsadNeural` (second voice)**

Why:
1. **Pakistani accent.** It's the only major cloud provider with GA ur-PK voices. Our first audience is
   mostly Pakistani diaspora, and an Indian ur-IN accent would sound "off" to their parents.
2. **SSML control.** We need a slow mode (`<prosody rate="-30%">`) and pronunciation fixes
   (`<phoneme>`, or substituting text) for words the model mispronounces.
3. **Cost.** At ~$16/1M chars, the whole MVP (5 lessons, about 150 phrases at roughly 30 chars each,
   times 2 speeds and 2 voices, ≈ 18k chars) costs **pennies** and fits inside the free tier.
4. **Two voices** make dialogue lessons work: khala (Uzma), chacha (Asad).

**Caveats and next steps:**
- I can't listen to audio. The founder should do a 10-minute blind listening test before Milestone 3:
  `scripts/tts-compare.ts` (to be added) renders the same 10 phrases with Azure ur-PK, Google
  Chirp 3 HD ur-IN, and Uplift. If Uplift clearly sounds more natural, swap it in. The TTS layer
  is pluggable (§6.4), so swapping is a config change.
- Long term, the best audio is **real native recordings** (a parent recording session). The schema
  allows `audio.source: "human"` to override TTS for any phrase.

### Cost control
- Audio is **pre-generated at build/content time** by `scripts/generate-audio.ts`, not at runtime.
- Cache key: `sha256(provider + voice + rate + ssml_text)`. Output goes to `public/audio/<hash>.mp3`
  (or Supabase Storage if size becomes a problem). Unchanged text never gets re-synthesised.
- The script enforces `TTS_MAX_CHARS_PER_RUN` (default 50k) and refuses to run over it.
- Runtime TTS (AI khala chat replies) is server-side only, rate-limited per user, cached by hash,
  and capped by `TTS_DAILY_CHAR_BUDGET`.

## 5. Lesson content schema

Content lives in the repo as JSON under `content/`, validated by a **Zod** schema
(`src/content/schema.ts`) in CI. TypeScript types are inferred from Zod.

### 5.1 Types

```ts
type Register = "respectful" | "casual" | "intimate";   // aap / tum / tu

interface UrduText {
  roman: string;            // primary display, canonical spelling, e.g. "Assalam o alaikum"
  urdu: string;             // Nastaliq, required (used for TTS + script toggle), e.g. "السلام علیکم"
  romanVariants?: string[]; // accepted alternate spellings beyond the fuzzy matcher
  literal?: string;         // word-by-word gloss, e.g. "peace be upon you"
  verified: boolean;        // true only after native-speaker review
  verifiedBy?: string;      // reviewer initials
  notes?: string;           // reviewer notes / cultural context
}

interface Phrase {
  id: string;               // stable, e.g. "greet.salaam"
  text: UrduText;
  english: string;          // natural meaning, e.g. "Hello (peace be upon you)"
  register?: Register;
  speaker?: "khala" | "chacha" | "ammi" | "abbu" | "cousin" | "waiter" | "you";
  audio?: {                 // filled by generate-audio script
    normal: string;         // "/audio/<hash>.mp3"
    slow: string;
    source: "tts" | "human";
    voice?: string;         // e.g. "ur-PK-UzmaNeural"
  };
  tip?: string;             // playful cultural note
}

type Exercise =
  | { id: string; type: "multiple_choice"; prompt: Prompt; choices: string[]; answerIndex: number; }
  | { id: string; type: "match_pairs"; pairs: { left: string; right: string }[]; } // left = phraseId
  | { id: string; type: "type_answer"; prompt: Prompt; answers: string[]; }        // phraseIds or roman strings
  | { id: string; type: "listen_select"; phraseId: string; choices: string[]; answerIndex: number; }; // stretch

interface Prompt {
  kind: "en_to_ur" | "ur_to_en" | "audio_to_en" | "situation"; // "situation": "Khala asks if you've eaten. Say yes."
  text?: string;
  phraseId?: string;
}

interface Lesson {
  id: string;               // "l1-greetings-elders"
  order: number;
  title: string;            // "Salaam to the elders"
  situation: string;        // one-line scene: "Your nani just walked in."
  canDo: string;            // "You can greet elders respectfully and ask how they are."
  estMinutes: number;       // 2–4
  level: "foundation" | "heritage"; // placement can skip "foundation"
  scriptDefault: "roman" | "roman+urdu";
  phrases: Phrase[];        // 5–8 per lesson
  exercises: Exercise[];    // 8–12 per lesson
}
```

### 5.2 Example (abbreviated)

```json
{
  "id": "l1-greetings-elders",
  "order": 1,
  "title": "Salaam to the elders",
  "situation": "Nani just walked into the living room. Everyone is looking at you.",
  "canDo": "You can greet elders respectfully and ask how they are.",
  "estMinutes": 3,
  "level": "foundation",
  "scriptDefault": "roman",
  "phrases": [
    {
      "id": "greet.salaam",
      "text": { "roman": "Assalam o alaikum", "urdu": "السلام علیکم",
                "romanVariants": ["asalamualaikum", "salam alaikum"], "verified": false },
      "english": "Hello (peace be upon you)",
      "register": "respectful",
      "tip": "Say it first. Elders notice who greets whom."
    }
  ],
  "exercises": [
    { "id": "e1", "type": "type_answer",
      "prompt": { "kind": "situation", "text": "Nani walks in. Greet her." },
      "answers": ["greet.salaam"] }
  ]
}
```

### 5.3 Forgiving Roman Urdu matching (`src/engine/romanMatch.ts`)

Roman Urdu has no standard spelling, so we normalise both strings and then fuzzy-compare:

1. Lowercase, strip punctuation and diacritics, collapse whitespace, treat `-` and `'` as spaces.
2. Phonetic folding rules (ordered, applied to both sides):
   - doubled vowels/consonants → single (`aa`→`a`, `ee`→`i`, `oo`→`u`, `kk`→`k`)
   - `w`↔`v`, `q`→`k`, `z`/`zh`/`dh`→`z`, `ph`→`f` (where unambiguous), `kh`/`gh` preserved
   - nasal endings: trailing `n` after a vowel optional (`nahin`≈`nahi`, `hain`≈`hai`)
   - `ai`/`ae`/`ay`/`ey`→`e`; `ia`/`ya`→`ya` (`kia`=`kya`); `o`/`u` interchangeable in unstressed positions
   - common words lexicon: `h`→`hai`, `k`→`kay/ke`, `mai`/`main`/`mein`→`me`
3. Compare token-by-token with **Damerau-Levenshtein**. Accept if every token is within
   `max(1, floor(len/4))` edits **and** total normalised distance ≤ 15%.
4. Results: `correct` | `almost` (typo tolerated, show canonical spelling) | `incorrect`.
   `almost` counts as correct. We never punish spelling.
5. Explicit `romanVariants` always match. Explicit "wrong-meaning" near-misses can be listed to
   block false positives (e.g. `khana` (food) vs `kahna` (to say)).

This module gets the heaviest unit testing (a table of ~100 real spelling variants).

### 5.4 Verification workflow
- `npm run content:unverified` prints every `verified: false` string, grouped by lesson. PROGRESS.md
  embeds the same list.
- The founder (or a parent) reviews, fixes, and sets `verified: true, verifiedBy: "SJ"`.
- CI **warns** (doesn't fail) on unverified content. The UI shows a small "beta" dot on unverified
  phrases in dev builds only.

## 6. Architecture

```
Next.js (App Router, TS, Tailwind) — installable PWA on Vercel
│
├── app/
│   ├── (marketing)/page.tsx          landing: "Make mistakes for free"
│   ├── onboarding/placement/         5-question placement check
│   ├── learn/                        lesson path (map of situations)
│   ├── learn/[lessonId]/             lesson player (client component, engine-driven)
│   ├── progress/                     can-do screen + XP + streak
│   ├── chat/khala/                   AI khala scenario
│   └── api/
│       ├── chat/route.ts             LLM proxy (server-only key, streaming, rate-limited)
│       ├── tts/route.ts              runtime TTS for chat replies (cached, budgeted)
│       └── progress/route.ts         (optional) server writes; default is client → Supabase w/ RLS
│
├── src/engine/                       PURE TypeScript, no React — unit tested with Vitest
│   ├── lessonEngine.ts               state machine: queue, answer, retry-later, complete
│   ├── romanMatch.ts                 forgiving matching
│   ├── exercises/*.ts                checkers per exercise type
│   ├── placement.ts                  scoring → starting lesson
│   ├── xp.ts / streak.ts             rules (incl. streak pause)
│   └── canDo.ts                      derive can-do list from completed lessons
├── src/content/                      schema.ts (Zod), loader.ts
├── content/lessons/*.json            the 5 lessons
├── content/placement.json
├── content/scenarios/khala.json      persona + goals + guardrails for AI chat
├── public/audio/                     pre-generated, hashed mp3s
├── scripts/                          generate-audio.ts, tts-compare.ts, list-unverified.ts
└── e2e/                              Playwright specs + screenshots
```

### 6.1 Lesson engine (state machine)
`idle → presenting(phrase intro cards) → exercising → feedback → (next | requeue) → complete`
- A wrong answer shows feedback with the correct answer and audio, and the exercise is **requeued** two
  or three items later. No lives lost.
- Lesson completes when every exercise has been answered correctly once.
- XP: +10 per lesson, +1 per first-try correct, +5 "comeback" bonus for getting a requeued item right
  (mistakes earn a reward instead of a penalty).
- The engine is pure (`reduce(state, action) → state`), which makes it easy to test and replay.

### 6.2 Data and auth (Supabase)
- **Anonymous-first:** users start learning right away. Progress lives in `localStorage` plus an
  anonymous Supabase session. Signing up (magic link / Google) links the anonymous user. No signup wall.
- Tables (RLS: `user_id = auth.uid()`):
  - `profiles(user_id pk, display_name, placement_level, script_pref, created_at)`
  - `lesson_progress(user_id, lesson_id, completed_at, best_accuracy, xp_earned, pk(user_id, lesson_id))`
  - `daily_activity(user_id, day date, xp, pk(user_id, day))` → streak is derived, not stored
  - `streak_pauses(user_id, day date)` → freeze days
  - `entitlements(user_id, tier text default 'free', ai_messages_used int, period_start)` ← **paid-tier hook**
  - `chat_sessions(id, user_id, scenario, created_at)`; `chat_messages(session_id, role, content, created_at)`
- Without Supabase env vars, the app falls back to local-only storage, so it works offline and for
  E2E tests.

### 6.3 Streak that doesn't punish
- The streak counts days with ≥1 completed lesson or chat.
- **Free pauses:** 2 auto-applied pause days per week. Missing a day uses a pause silently.
- After pauses run out, the streak doesn't reset to 0. It shows "Welcome back — your 12-day streak is
  resting" and **resumes** from 12 when you return. "Best streak" is kept forever.
- No push notifications in the MVP. Later, opt-in only, one per day at most, never guilt-based.

### 6.4 TTS adapter
```ts
interface TtsProvider { synthesize(ssml: string, voice: string): Promise<Buffer>; name: string }
```
Implementations: `azure` (default), `google`, `uplift`. Chosen with `TTS_PROVIDER`. Key: `TTS_API_KEY`
(+ `TTS_REGION` for Azure). The build-time script and the runtime chat route share the adapter and
the hash cache.

### 6.5 AI khala chat
- Persona: **Shabnam Khala**, a loving, nosy aunt on a phone call. She asks about food, studies or job,
  marriage ("koi larki/larka pasand hai?"), and when you're visiting.
- `/api/chat` streams from the LLM (`LLM_API_KEY`, server-only). It sends the full session history
  (context within the session), a system prompt, and a scenario-goal checklist.
- Response contract (JSON mode / tool call):
  `{ reply: {roman, urdu, english}, correction?: {youSaid, better, why}, goalsMet: string[] }`
- **Gentle correction:** at most one correction per turn, phrased kindly ("Khala smiles: you can also
  say…"), never interrupting the flow. Hints are available on tap. The user can answer in English,
  Roman Urdu or a mix, and khala still replies.
- **Anti-repetition:** the prompt tracks which topics have been covered, and khala moves on. A
  temperature/presence penalty helps too.
- Guardrails: stays in persona, keeps content family-friendly, refuses off-topic requests, and caps
  each session at 30 turns.
- AI output is shown with a small "AI" label (it isn't verified content). Corrections link back to
  the verified phrases in lessons where possible.
- **Paid-tier hook:** every call to `/api/chat` goes through `checkEntitlement(user, "ai_chat")`. In the
  MVP everyone gets a generous free quota (e.g. 20 messages/day), enforced server-side. Later, Stripe
  updates `entitlements.tier`. No payment code in the MVP.

### 6.6 PWA
- `app/manifest.ts`, icons, theme color. Service worker via **Serwist** (`@serwist/next`).
- Offline: app shell, lesson JSON and lesson audio are precached after first visit, so lessons work
  offline. Chat needs a network connection.

### 6.7 Testing and CI
- **Vitest:** engine, romanMatch (variant table), placement scoring, XP/streak (including pause and
  resume edge cases and timezones), content schema validation for all JSON.
- **Playwright** (mobile viewport, iPhone 13 + Pixel 7 projects): placement check → lesson 1
  end-to-end, with screenshots at each step saved as CI artifacts. The chat test uses a mocked LLM
  route.
- **GitHub Actions** on every PR: `lint → typecheck → vitest → content validate → build → playwright`.
- **Vercel** preview deploy per PR. Secrets live in Vercel and GitHub env settings only.
  `.env.example` documents them, and `.env*` is gitignored.

### 6.8 Secrets and spend
- `LLM_API_KEY`, `TTS_API_KEY`, `TTS_REGION`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY` (server only, ideally unused).
- Spend caps: `TTS_MAX_CHARS_PER_RUN`, `TTS_DAILY_CHAR_BUDGET`, `AI_FREE_MESSAGES_PER_DAY`,
  `LLM_MAX_OUTPUT_TOKENS`. Also set hard budget alerts in the Azure and LLM consoles (founder action).

## 7. MVP content plan

| # | Lesson | Situation | Can-do | Level |
|---|---|---|---|---|
| 1 | **Salaam to the elders** | Nani walks in | Greet elders respectfully, ask how they are, say you're fine | foundation |
| 2 | **Phone call with Khala** | Khala calls on WhatsApp, the connection is bad | Answer the phone, say who you are, ask "can you hear me?", say goodbye | foundation |
| 3 | **At the dawat** | A big family dinner and the aunties keep serving | Say you're full, praise the food, politely refuse a third helping (and fail) | heritage |
| 4 | **Ordering food** | A dhaba / desi restaurant | Order chai and food, ask for less spice, ask for the bill | heritage |
| 5 | **Wedding small talk** | The mehndi, cornered by a rishta aunty | Introduce yourself, say what you do, deflect "when is *your* shaadi?" | heritage |

Each lesson has 5–8 phrases, 8–12 exercises (a mix of all 3 types) and about 3 minutes of practice.
All Urdu is drafted by Claude and marked `verified: false` until reviewed.

## 8. Placement check
- 5 questions of increasing difficulty: (1) recognise a greeting, (2) understand a phone line from
  audio, (3) choose the respectful form (aap vs tum), (4) type a dawat reply, (5) understand a
  wedding question.
- Score 0–2 → start at Lesson 1. 3–4 → Lesson 3, with 1–2 marked "skipped, review anytime".
  5 → all unlocked.
- Nothing is ever locked. Placement only decides where we *suggest* you start. "I'm a total beginner"
  skips the check.

## 9. Can-do progress screen
- A list of situations with ✓, built from completed lessons: "✓ You can greet elders respectfully."
- Below that: XP total, current/best streak with pause days shown, and minutes practised.
- A teaser for the next can-do ("Next: survive the dawat").

## 10. Milestones (a PR at each checkpoint)

1. **Research + SPEC.md** ← *this PR*
2. **Lesson engine + exercise types + tests.** Next.js scaffold, Tailwind, Zod schema, pure engine,
   romanMatch with variant table, 3 exercise UIs, Vitest, CI workflow (lint/typecheck/test/build).
3. **Content.** 5 lessons as JSON, Azure TTS adapter, `generate-audio` with hash cache and spend cap,
   `tts-compare` script for the founder's listening test, audio playback with slow mode.
4. **Placement + XP/streak + can-do.** Supabase schema and RLS migrations, anonymous-first auth,
   local fallback, progress screen.
5. **AI khala chat.** `/api/chat` streaming, persona and correction contract, entitlement hook, rate
   limit, mocked-LLM test.
6. **PWA polish + deploy.** Manifest, Serwist offline, mobile polish, Vercel preview, full Playwright
   run with screenshots, PROGRESS.md.

**Definition of done:** CI green. A Playwright test completes placement and Lesson 1. The preview URL
works on mobile. PROGRESS.md lists what's built, the unverified Urdu, known issues and next steps.

### Open questions for the founder
1. Run the TTS listening test (Azure ur-PK vs Google ur-IN vs Uplift) before Milestone 3. ~10 min.
2. Is the khala persona name and tone OK, and are any topics off-limits (e.g. rishta jokes)?
3. Which LLM provider sits behind `LLM_API_KEY`? The adapter will be provider-agnostic, defaulting to
   Anthropic Claude (`claude-sonnet-5-5` for chat quality, `claude-haiku-5-5` for cheap turns).
4. Supabase project: create one now, or keep local-only storage until Milestone 4?

## 11. Sources
- Azure ur-PK neural voices announcement: https://techcommunity.microsoft.com/t5/azure-ai-services-blog/eleven-more-languages-are-generally-available-for-azure-neural/ba-p/2236871
- Azure low-resource TTS update (MOS > 4.3 across low-resource voices): https://techcommunity.microsoft.com:443/t5/ai-azure-ai-services-blog/low-resource-technology-updates-for-azure-neural-text-to-speech/ba-p/3716922
- Azure Speech pricing: https://azure.microsoft.com/en-in/pricing/details/speech
- Google Chirp 3 HD (ur-IN supported): https://docs.cloud.google.com/text-to-speech/docs/chirp3-hd
- Google Gemini-TTS (ur-PK preview): https://cloud.google.com/text-to-speech/docs/gemini-tts
- Google TTS pricing: https://cloud.google.com/text-to-speech/pricing
- Gemini TTS Urdu field notes: https://www.positioniseverything.net/why-does-an-urdu-ai-voice-break-in-gemini-tts-wav-or-whatsapp/
- ElevenLabs Urdu: https://elevenlabs.io/text-to-speech/urdu
- Uplift AI (YC S25) launch: https://hn-3iuih7f1s-svelte.vercel.app/item/44950661 · https://www.ycombinator.com/companies/uplift-ai · https://www.dawn.com/news/amp/1969895 · https://docs.pipecat.ai/api-reference/server/services/tts/upliftai
- Duolingo has no Urdu course: https://duolingoguides.com/does-duolingo-have-urdu/
- Petitions: https://www.change.org/p/make-urdu-a-duolingo-course
- r/Urdu "app like Duolingo" thread: https://redlib.hyperreal.coffee/r/Urdu/comments/1hn5805/is_there_any_app_like_duolingo_where_i_can_learn
- App reviews: https://preply.com/en/blog/apps-to-learn-urdu/ · https://www.alllanguageresources.com/learn-urdu-app/ · https://www.alllanguageresources.com/urdupod101/ · https://www.langoly.com/urdu-learning-apps/ · https://mezzoguild.com/online-urdu-courses

*Competitor rows for Talkpal, uTalk and Pimsleur/Mango come from general product knowledge, not
from sources fetched for this spec. Check them before using them in any public pitch.*
