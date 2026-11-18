# Adding a language

Lafz is built for Urdu, but everything language-specific now sits behind a **language pack**, so a
second language (Punjabi in Shahmukhi, Hindi, Pashto, Arabic…) can reuse the app, engine and tooling.
Urdu is the only pack today. One pack is active per build.

## What a pack is
`src/lang/types.ts` defines `LanguagePack`:

| Field | Urdu value | Used by |
|---|---|---|
| `code` | `ur` | content folder `content/ur/`, device-voice fallback |
| `script.name`, `dir`, `lang`, `fontFamily` | Nastaliq, `rtl`, `ur` | `<Nastaliq>`, gap/spot exercises (`lang`/`dir` on native text) |
| `script.chars` | Arabic block `U+0600–U+06FF` | content schema (native text must use it), phrasebook search, speech transcripts |
| `script.normalise` | drop harakat, unify ي/ی, ك/ک, ه/ہ… | speech answers, audio audit similarity |
| `romanization.fold` | the Roman Urdu folding rules | the forgiving matcher (`src/engine/matcher.ts`) |
| `romanization.lexicon`, `confusables` | short-word classes; khana/kahna… | matcher |
| `romanization.finalVowelIsGrammar` | `true` (mera/meri) | matcher never forgives a final-vowel change |
| `speech.recognition`, `speech.whisper` | `ur-PK`, `ur` | Web Speech API, on-device Whisper |
| `voices.female`, `male`, `maleSpeakers` | `matcha-f1`, `matcha-m1`, Bilal/Abbu/Pervez/Bashir | audio file keys (`src/content/audio-key.ts`) |

Content lives in `content/<code>/`: `units/*.json`, `characters.json`, `family.json`, `packs.json`,
`placement.json`, `alphabet.json`, and the dictionary evidence `lexicon.json` / `lexicon-manual.json`.

## Steps
1. **Write the pack**: copy `src/lang/ur.ts` to `src/lang/<code>.ts`, fill every field, and register it in
   `packs` in `src/lang/index.ts`. Add its expectations to `src/lang/lang.test.ts`.
2. **Content**: create `content/<code>/` with the same files. The Zod schema still calls the two text
   fields `roman` and `urdu`: read them as "romanisation" and "native script". Write units with the
   authoring helpers in `scripts/authoring/` (run with `LAFZ_LANG=<code>`).
3. **Dictionary checks**: `scripts/verify_lexicon.py` looks words up in Platts and Wiktionary's *Urdu*
   section. For another language, change the Wiktionary section name and swap Platts for a suitable
   dictionary; keep recording `sources` on every phrase (CLAUDE.md content rules).
4. **Voices**: find an openly licensed TTS model for the language, add it to `scripts/generate_audio.py`
   (the `Synth` class), give it new voice ids in the pack, and run
   `LAFZ_LANG=<code> .venv/bin/python scripts/generate_audio.py`. Keep the Whisper round-trip check.
5. **Font**: self-host the script's font (add a `@fontsource` package) and point `script.fontFamily` and
   the `--font-urdu` CSS variable at it.
6. **UI copy**: English UI strings are not yet extracted; language names in copy ("Learn Urdu", "Roman
   Urdu", "Nastaliq") should come from the pack (`pack.name`, `pack.romanization.name`, `pack.script.name`)
   as you touch them.
7. **Build**: `NEXT_PUBLIC_LANG=<code> npm run build` (and `LAFZ_LANG=<code>` for the Python scripts).
   Give the build its own `basePath` and site if you host both languages.

## Not yet language-neutral (known)
- UI copy, the cast and the jokes are written for Pakistani-Urdu-speaking families.
- The reading track (R1–R10) teaches the Urdu alphabet specifically; a new script needs new reading units.
- `scripts/postbuild.mjs` keeps its own copy of the male-speaker list (it runs outside TypeScript);
  update it alongside the pack.
