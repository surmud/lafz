"""Reading track R6–R10: vowels and special letters, known words, signs, WhatsApp, Ghalib."""
from common import Unit, info, write_unit

GHALIB = {"ref": "rekhta", "item": "Ghalib, ghazal 'hazaaron khwahishen aisi'", "url": "https://rekhta.org/couplets/hazaaron-khvaahishen-aisii-ki-har-khvaahish-par-dam-nikle-mirza-ghalib-couplets", "checked": "2026-11-16"}


def word_lesson(u, lid, title, blurb, cando, intro, words, extra_teach=None):
    ids = [f"{u.U}.w-{w[0]}" for w in words]
    teach = [intro] + (extra_teach or []) + [{"phrase": i} for i in ids]
    ex = []
    for k, (roman, urdu, en) in enumerate(words):
        others = [w for w in words if w[0] != roman]
        others = (others[k % len(others):] + others)[:2]
        ex.append({"type": "mc", "prompt": "Read it. What does it say?", "glyph": urdu, "options": [{"text": f"{roman} ({en})"}] + [{"text": f"{o[0]} ({o[2]})"} for o in others], "answer": 0})
    for k, (roman, urdu, en) in enumerate(words[:3]):
        others = [w for w in words if w[0] != roman][:2]
        ex.append({"type": "mc", "prompt": f"Find: “{en}”", "audio": f"{u.U}.w-{roman}", "options": [{"glyph": urdu}] + [{"glyph": o[1]} for o in others], "answer": 0})
    return {"id": lid, "title": title, "blurb": blurb, "canDo": cando, "teach": teach, "exercises": ex}


def unit(uid, order, title, emoji, tagline, cando, lessons_spec, grammar):
    u = Unit(uid)
    lessons = []
    for n, spec in enumerate(lessons_spec, 1):
        for roman, urdu, en in spec["words"]:
            if not any(p["id"] == f"{uid}.w-{roman}" for p in u.phrases):
                u.P("w-" + roman, roman, urdu, en, **spec.get("kw", {}))
        lessons.append(word_lesson(u, f"{uid}-l{n}", spec["title"], spec["blurb"], spec["cando"], spec["intro"], spec["words"], spec.get("teach")))
    return u, lessons, {"track": "reading", "order": order, "title": title, "emoji": emoji, "tagline": tagline, "canDo": cando, "grammar": grammar}


# R6 — short vowels and special letters
u, L, meta = unit("r06", 6, "Vowel Marks & Special Letters", "🔤", "Short vowel marks, do-chashmi he, nun ghunna and the two ye's.",
  "You can read short-vowel marks, do-chashmi he, nun ghunna and both ye's", [
   {"title": "Zabar, zer, pesh", "blurb": "Three tiny marks for short vowels (usually left out!)", "cando": "You can read the three short-vowel marks",
    "intro": info("Short vowels are (mostly) invisible", "Urdu writes long vowels as letters (ا و ی) but short vowels as tiny marks, and usually skips them. Zabar (a line above) = a, zer (a line below) = i, pesh (a little و above) = u. Beginners' books show them; WhatsApp never does.", glyph="بَ  بِ  بُ"),
    "words": [("bas", "بَس", "enough / bus"), ("dil", "دِل", "heart"), ("gul", "گُل", "flower (poetic)"), ("kal", "کَل", "yesterday / tomorrow")]},
   {"title": "Do-chashmi he", "blurb": "The 'two-eyed h' that makes bh, ph, kh, gh, chh.", "cando": "You can read aspirated sounds like bh, ph, kh",
    "intro": info("The two-eyed h", "ھ (do-chashmi he, 'two-eyed he') never stands alone. It sits after a letter and adds a puff of air: ب + ھ = بھ (bh), پ + ھ = پھ (ph), ک + ھ = کھ (kh as in khana).", glyph="بھ  پھ  کھ  گھ  چھ"),
    "words": [("bhai", "بھائی", "brother"), ("phool", "پھول", "flower"), ("khana", "کھانا", "food"), ("ghar", "گھر", "house")]},
   {"title": "Nun ghunna and the ye's", "blurb": "The nasal n, choti ye and bari ye.", "cando": "You can read nasal endings and tell choti ye from bari ye",
    "intro": info("ں, ی and ے", "ں (nun ghunna) has no dot: it just nasalises the vowel before it, as in main (میں), hain (ہیں). ی (choti ye) is 'ee' at the end (Nani نانی). ے (bari ye) swings back right and is 'e' or 'ai' at the end (hai ہے, kaise کیسے).", glyph="ں  ی  ے"),
    "words": [("main", "میں", "I"), ("maan", "ماں", "mother"), ("nani", "نانی", "Nani"), ("hai", "ہے", "is")]},
  ], [{"title": "Cheat sheet", "body": "zabar َ = a · zer ِ = i · pesh ُ = u · ھ adds a puff of air (bh, ph, kh) · ں nasalises (main, hain) · ی = ee/y · ے = e/ai at the end of a word."}])
write_unit(u, meta, L, None)

# R7 — words you know
u, L, meta = unit("r07", 7, "Words You Know", "💬", "Reading words you already know from the speaking course.",
  "You can read common family words you already know how to say", [
   {"title": "Greetings in script", "blurb": "Salaam, shukriya, and friends.", "cando": "You can read greetings and thanks",
    "intro": info("You know these already", "Every word in this lesson came up in the speaking course. Now you'll recognise them on a screen, a card or a wedding invitation.", glyph="سلام"),
    "words": [("salaam", "سلام", "hello"), ("shukriya", "شکریہ", "thank you"), ("ji", "جی", "yes (polite)"), ("nahin", "نہیں", "no"), ("khuda-hafiz", "خدا حافظ", "goodbye")]},
   {"title": "Family in script", "blurb": "Ammi, Abbu, Khala, Phuppo.", "cando": "You can read the names for family members",
    "intro": info("Family words", "Look for the shapes you know: the alif in امی, the khe in خالہ, the two-eyed he in پھپھو.", glyph="امی ابو"),
    "words": [("ammi", "امی", "Mum"), ("abbu", "ابو", "Dad"), ("khala", "خالہ", "Mum's sister"), ("phuppo", "پھپھو", "Dad's sister"), ("dadi", "دادی", "Dad's mum")]},
   {"title": "Food in script", "blurb": "Chai, roti, biryani.", "cando": "You can read the names of everyday food",
    "intro": info("Food words", "Menus, recipe videos, Nani's handwritten notes: food is the best reason to read Urdu.", glyph="چائے"),
    "words": [("chai", "چائے", "tea"), ("roti", "روٹی", "flatbread"), ("biryani", "بریانی", "biryani"), ("daal", "دال", "lentils"), ("paani", "پانی", "water")]},
  ], [{"title": "Tip", "body": "When a word looks unfamiliar, read it letter by letter right to left, then say it out loud: your ears often know it before your eyes do."}])
write_unit(u, meta, L, None)

# R8 — signs and menus
u, L, meta = unit("r08", 8, "Signs & Menus", "🪧", "Reading signs, menus and shop boards.",
  "You can read common signs and a simple menu", [
   {"title": "On the street", "blurb": "Open, closed, welcome, shop.", "cando": "You can read basic street and shop signs",
    "intro": info("Street Urdu", "Shop boards in Pakistan mix Urdu and English. The Urdu half usually says the same thing, so you can check yourself.", glyph="خوش آمدید"),
    "words": [("khush-aamdeed", "خوش آمدید", "welcome"), ("dukaan", "دکان", "shop"), ("band", "بند", "closed"), ("khula", "کھلا", "open"), ("masjid", "مسجد", "mosque")]},
   {"title": "On the menu", "blurb": "Order without pointing.", "cando": "You can read a dhaba menu",
    "intro": info("Dhaba menus", "Menus are short and handwritten. Look for the prices in rupees: روپے.", glyph="مینو"),
    "words": [("samosa", "سموسہ", "samosa"), ("pakora", "پکوڑا", "pakora"), ("thanda-paani", "ٹھنڈا پانی", "cold water"), ("qeemat", "قیمت", "price"), ("rupay", "روپے", "rupees")], "kw": {}},
   {"title": "Rules and warnings", "blurb": "The signs you're meant to obey.", "cando": "You can read common warnings and instructions",
    "intro": info("Warnings", "Signs that tell you what not to do usually end in منع ہے (is forbidden).", glyph="منع ہے"),
    "words": [("mana-hai", "منع ہے", "is forbidden"), ("khatra", "خطرہ", "danger"), ("rasta", "راستہ", "way / route"), ("aahista", "آہستہ", "slowly"), ("rukiye", "رکیے", "stop (please)")]},
  ], [{"title": "Tip", "body": "Signs often drop the verb: 'دکان بند' = shop closed. Read the nouns first."}])
write_unit(u, meta, L, None)

# R9 — WhatsApp from family
u, L, meta = unit("r09", 9, "Messages", "📱", "Reading short family messages.",
  "You can read short WhatsApp messages from family", [
   {"title": "Ammi's messages", "blurb": "Did you eat? When are you coming?", "cando": "You can read the classic parent check-in messages",
    "intro": info("No vowels, no mercy", "Family WhatsApp has no short-vowel marks, lots of emojis, and the occasional English word. Read the shapes you know first.", glyph="بیٹا کھانا کھا لیا؟"),
    "words": [("khana-kha-liya", "بیٹا کھانا کھا لیا؟", "Dear, have you eaten?"), ("kab-aa-rahe", "کب آ رہے ہو؟", "When are you coming?"), ("call-karo", "کال کرو", "Call me"), ("dua-karo", "دعا کرو", "Pray (for us)")]},
   {"title": "The family group", "blurb": "Jumma Mubarak, good-morning flowers, congratulations.", "cando": "You can read the family group's greetings",
    "intro": info("Group chat classics", "Every Friday: جمعہ مبارک. Every morning: a flower. Every result: مبارک ہو.", glyph="جمعہ مبارک"),
    "words": [("jumma-mubarak", "جمعہ مبارک", "Blessed Friday"), ("mubarak-ho", "مبارک ہو", "Congratulations"), ("sab-theek", "سب ٹھیک ہے؟", "Is everything okay?"), ("ameen", "آمین", "Amen")]},
   {"title": "Khala's essays", "blurb": "Longer messages: news, gossip, a rishta.", "cando": "You can get the gist of a longer family message",
    "intro": info("Get the gist", "You don't need every word. Spot names, family words and key verbs, and you'll know if it's news, gossip or a rishta.", glyph="رشتہ"),
    "words": [("rishta-aaya", "ایک رشتہ آیا ہے", "A proposal has come"), ("shaadi-hai", "اگلے ہفتے شادی ہے", "The wedding is next week"), ("kisi-ko-mat", "کسی کو مت بتانا", "Don't tell anyone"), ("jaldi-aao", "جلدی آؤ", "Come quickly")]},
  ], [{"title": "Tip", "body": "Short messages often drop hai at the end. 'کھانا کھا لیا؟' is a full question: (have you) eaten?"}])
write_unit(u, meta, L, None)

# R10 — Ghalib
u = Unit("r10")
u.P("line1", "Hazaaron khwahishen aisi ke har khwahish pe dam nikle", "ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے", "Thousands of desires, each one worth dying for", sources=[GHALIB], literal="thousands of wishes, such that at each wish the breath leaves")
u.P("line2", "Bohat nikle mere armaan lekin phir bhi kam nikle", "بہت نکلے مرے ارمان لیکن پھر بھی کم نکلے", "Many of my longings came true, yet still too few", sources=[GHALIB])
for r, ur, en in [("khwahish", "خواہش", "wish, desire"), ("hazaaron", "ہزاروں", "thousands"), ("dam", "دم", "breath"), ("armaan", "ارمان", "longing"), ("nikle", "نکلے", "came out / were fulfilled"), ("har", "ہر", "every")]:
    u.P("w-" + r, r, ur, en)
L = [
 {"id": "r10-l1", "title": "The words", "blurb": "Six words that unlock the couplet.", "canDo": "You can read the key words of a famous Ghalib couplet",
  "teach": [info("Mirza Ghalib (1797–1869)", "The most loved poet in Urdu. His couplets are quoted at weddings, in arguments and on trucks. Reading one in the original is the finish line of this track.", glyph="غالب"),
            *[{"phrase": f"r10.w-{w}"} for w in ["hazaaron", "khwahish", "har", "dam", "armaan", "nikle"]]],
  "exercises": [{"type": "mc", "prompt": "Read it. What does it say?", "glyph": g, "options": [{"text": a}, {"text": b}, {"text": c}], "answer": 0} for g, a, b, c in [
    ("خواہش", "khwahish (wish)", "khana (food)", "khala (aunt)"), ("ہزاروں", "hazaaron (thousands)", "hamesha (always)", "har (every)"), ("ارمان", "armaan (longing)", "ammi (Mum)", "aaj (today)"),
    ("دم", "dam (breath)", "dil (heart)", "do (two)"), ("نکلے", "nikle (came out)", "nahin (no)", "naam (name)"), ("ہر", "har (every)", "hai (is)", "hum (we)")]]},
 {"id": "r10-l2", "title": "Read the couplet", "blurb": "Two lines. Two hundred years old. Still perfect.", "canDo": "You can read and understand a Ghalib couplet in Nastaliq",
  "teach": [info("How a sher works", "A couplet (sher) is two lines that share a rhythm and end-rhyme (here: …dam nikle / …kam nikle). Read slowly, right to left, then listen.", glyph="شعر"), {"phrase": "r10.line1"}, {"phrase": "r10.line2"}],
  "exercises": [
   {"type": "mc", "prompt": "What does the first line mean?", "show": "r10.line1", "urduOnly": True, "options": [{"text": "Thousands of desires, each one worth dying for"}, {"text": "A thousand people came to the wedding"}, {"text": "Every wish has already come true"}], "answer": 0},
   {"type": "mc", "prompt": "What does the second line mean?", "show": "r10.line2", "urduOnly": True, "options": [{"text": "Many of my longings came true, yet still too few"}, {"text": "My longings were too many to count"}, {"text": "None of my wishes came true"}], "answer": 0},
   {"type": "mc", "prompt": "Which word do both lines end on?", "options": [{"glyph": "نکلے"}, {"glyph": "خواہش"}, {"glyph": "ارمان"}], "answer": 0, "explain": "nikle: the shared refrain (radif) that ties the couplet together."},
   {"type": "listen", "phrase": "r10.line1"},
   {"type": "speak", "phrase": "r10.line1"},
   {"type": "speak", "phrase": "r10.line2"}]},
]
meta = {"track": "reading", "order": 10, "title": "A Ghalib Couplet", "emoji": "🪶", "tagline": "Reading a couplet by Mirza Ghalib.",
        "canDo": "You can read a classic Urdu couplet in Nastaliq", "grammar": [{"title": "Poetic spellings", "body": "Poetry bends spelling for the metre: مرے (mire) is a poetic short form of میرے (mere, my). پہ (pe) is a short form of پر (par, on)."}]}
write_unit(u, meta, L, None)
