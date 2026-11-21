#!/usr/bin/env python3
"""Write store/listing.md (App Store Connect copy) and check every field against Apple's limits."""
from pathlib import Path

SITE = "https://surmud.github.io/lafz"
F = {
    "name": "Lafz",
    "name_fallback": "Lafz: Learn Urdu",
    "subtitle": "Speak Urdu with your family",
    "promo": "Learn the Urdu your family actually speaks: greetings, dawat survival, phone calls to Pakistan, weddings and stories. Free, no ads, works offline.",
    "keywords": "learn,pakistan,pakistani,hindustani,roman,nastaliq,language,heritage,ghalib,desi,phrases,grammar",
    "description": """Understand Urdu but freeze when it's your turn to speak? Lafz is for you.

Lafz teaches the Urdu that families really speak: greeting Nani properly, surviving a dawat ("bas, bas!"), a crackly phone call to Lahore, a shaadi, Eid, and finally telling the whole wedding story in Urdu. Every lesson is built around real family moments, with a cast you'll recognise: Khala, Nani, Bilal the cousin who's a doctor, and Mrs. Butt with her list.

MAKE MISTAKES FOR FREE
No hearts, no lives, nothing locked. Get something wrong and it simply comes back a little later, and fixing it earns a comeback bonus. Your streak never resets: if you miss days it rests and picks up again.

SPEAK MODE AND READ MODE
Speak mode is the speaking course: 13 core units plus 6 advanced ones (formal Urdu, ifs and wishes, opinions, idioms and proverbs, poetry by Ghalib, Iqbal and Mir, and the news). Read mode teaches the Urdu script from the first letters to signs, family WhatsApp messages and a Ghalib couplet. Switch any time.

NOT JUST FLASHCARDS
• Overheard scenes: listen in on the family and answer a question
• Short stories you can listen to or read, tapping any word for its meaning
• Conversations with characters that branch on what you say: pick, type or speak
• Spot the mistake, sort the words, dictation, shadowing
• Memory hooks for tricky words
• Type Roman Urdu however you normally spell it: "shukriya", "shukria" and "shukrya" all count

PRACTICE YOUR WAY
Spaced review, a "trouble words" session built from your mistakes, hands-free listening mode, hard mode, a searchable phrasebook and a grammar guide. Every phrase has natural and slow audio. A placement test lets you skip what you already know.

MADE FOR FAMILIES
Record a relative saying a phrase and their voice replaces the computer voice. Share "Ask Ammi: did I say it right?" with the family. Prep packs for a wedding, Eid, a call with family, a grandparent's visit or a trip to Pakistan.

PRIVATE BY DESIGN
No account, no ads, no tracking. Your progress stays on your phone, everything works offline, and the app collects no data.

Every Urdu phrase is checked against dictionaries (Platts, Rekhta, Wiktionary) and the sources are recorded.""",
    "support": f"{SITE}/support/",
    "marketing": f"{SITE}/",
    "privacy": f"{SITE}/privacy/",
    "copyright": "2026 Surmud Jamil",
}
LIMITS = {"name": 30, "name_fallback": 30, "subtitle": 30, "promo": 170, "keywords": 100, "description": 4000}

problems = [f"{k}: {len(F[k])} > {n}" for k, n in LIMITS.items() if len(F[k]) > n]
if " " in F["keywords"]:
    problems.append("keywords: contains spaces")
words = {w.lower().strip(":,") for w in (F["name"] + " " + F["subtitle"]).split()}
repeated = [k for k in F["keywords"].split(",") if k in words]
if problems:
    raise SystemExit("\n".join(problems))

shots = sorted(p.name for p in Path("store/screenshots/ios-6.9in-1320x2868").glob("*.png"))
md = f"""# App Store Connect listing: Lafz 1.0 (iOS)

Copy-paste ready. Character counts are checked by `scripts/store_listing.py` (re-run it after edits).
iOS 1.0 ships with **accounts and the tip jar off** in the app, so the privacy label is **Data Not Collected**
and Sign in with Apple is not required (guideline 4.8 applies only when third-party sign-in is offered).

| Field | Value | Chars / limit |
|---|---|---|
| App name | `{F['name']}` | {len(F['name'])} / 30 |
| Fallback name (if "Lafz" is taken) | `{F['name_fallback']}` | {len(F['name_fallback'])} / 30 |
| Subtitle | `{F['subtitle']}` | {len(F['subtitle'])} / 30 |
| Promotional text | {F['promo']} | {len(F['promo'])} / 170 |
| Keywords | `{F['keywords']}` | {len(F['keywords'])} / 100 |
| Support URL | {F['support']} | |
| Marketing URL | {F['marketing']} | |
| Privacy policy URL | {F['privacy']} | |
| Copyright | `{F['copyright']}` | |
| Primary category | Education | |
| Secondary category | Reference | |
| Price | Free | |
| Bundle ID / SKU | `app.lafz` / `lafz-ios` | |

Keywords deliberately avoid words already in the name and subtitle (Apple indexes those anyway){" (repeats: " + ", ".join(repeated) + ")" if repeated else ""}.

## Description ({len(F['description'])} / 4000)

```
{F['description']}
```

## Screenshots (6.9" display, 1320 × 2868, upload in this order)
Taken from the native build (`npm run build:native && STORE=1 npm run e2e:native -- store.spec.ts`), so
they show no sign-in and no tip jar. Files in `store/screenshots/ios-6.9in-1320x2868/`:

""" + "\n".join(f"{i}. `{s}`" for i, s in enumerate(shots, 1)) + """

The 6.5" set (`ios-6.5in-1284x2778/`) is optional now; App Store Connect scales the 6.9" set. iPad is not
needed: the app is iPhone-only.

## App Privacy
**Data Not Collected.** (The app has no accounts, tips, analytics or ads; progress and recordings never
leave the device. On-device AI models download from public CDNs only if the learner turns those features on;
that's a download, not data collection.)

## Age rating questionnaire
Answer **None / No** to everything: violence (cartoon, realistic), sexual content or nudity, profanity or
crude humour, alcohol/tobacco/drugs, simulated gambling, horror/fear themes, mature/suggestive themes,
medical or treatment information (Unit 8 teaches health *vocabulary*, not medical advice), contests,
unrestricted web access, user-generated content, messaging or chat between users, advertising.
The questionnaire will compute the lowest rating (4+). The founder's earlier choice was 13+, which App Store
Connect allows as an **age rating override to a higher rating**. Either is accurate; 4+ maximises reach.

## Review notes (paste into "Notes" for the reviewer)
```
Lafz is a free Urdu course for heritage learners and beginners. No login is required and the app has no
accounts, purchases, ads or analytics; all progress is stored on the device and the app works offline.
The microphone is used only for optional speaking practice, family voice recordings and shadowing;
recordings stay on the device and are never uploaded. Speaking exercises can always be skipped
("Can't speak now"). To try a full lesson: tap "Let's go", choose "I'm new to Urdu", then "Start lesson 1".
```

## Version 1.0 "What's New"
```
First release: 19 speaking units (including an advanced course), 10 reading units, 22 stories, conversations
with the family, and practice that never locks you out.
```
"""
Path("store/listing.md").write_text(md)
print("store/listing.md written;", {k: len(F[k]) for k in LIMITS}, "repeats:", repeated)
