"""Reading track R1–R5: letters in shape families, joining forms, first words.
Letter names and joining behaviour follow Wikipedia's 'Urdu alphabet' table (content/alphabet.json)."""
from common import Unit, info, write_unit

WIKI = {"ref": "wikipedia", "item": "Urdu alphabet", "url": "https://en.wikipedia.org/wiki/Urdu_alphabet", "checked": "2026-11-16"}
TATWEEL = "ـ"
# letter, roman name, Urdu name (for audio), sound, joins-left?
L = {
 "ا": ("alif", "الف", "long 'aa' (or a silent seat for a vowel)", False),
 "ب": ("be", "بے", "b", True), "پ": ("pe", "پے", "p", True), "ت": ("te", "تے", "soft t (tongue on teeth)", True),
 "ٹ": ("ṭe", "ٹے", "hard t (tongue curled back)", True), "ث": ("se", "ثے", "s (Arabic loanwords)", True),
 "ج": ("jeem", "جیم", "j", True), "چ": ("che", "چے", "ch", True), "ح": ("bari he", "بڑی حے", "h (Arabic loanwords)", True),
 "خ": ("khe", "خے", "kh (like Scottish 'loch')", True),
 "د": ("daal", "دال", "soft d", False), "ڈ": ("ḍaal", "ڈال", "hard d (tongue curled back)", False), "ذ": ("zaal", "ذال", "z (Arabic loanwords)", False),
 "ر": ("re", "رے", "rolled r", False), "ڑ": ("ṛe", "ڑے", "flapped ṛ (as in bara)", False), "ز": ("ze", "زے", "z", False), "ژ": ("zhe", "ژے", "zh (rare, as in 'measure')", False),
 "س": ("seen", "سین", "s", True), "ش": ("sheen", "شین", "sh", True),
 "ص": ("swaad", "صاد", "s (Arabic loanwords)", True), "ض": ("zwaad", "ضاد", "z (Arabic loanwords)", True),
 "ط": ("toe", "طوئے", "t (Arabic loanwords)", True), "ظ": ("zoe", "ظوئے", "z (Arabic loanwords)", True),
 "ع": ("ain", "عین", "a vowel carrier (Arabic loanwords)", True), "غ": ("ghain", "غین", "gh (a gargled g)", True),
 "ف": ("fe", "فے", "f", True), "ق": ("qaaf", "قاف", "q (deep k)", True),
 "ک": ("kaaf", "کاف", "k", True), "گ": ("gaaf", "گاف", "g", True), "ل": ("laam", "لام", "l", True), "م": ("meem", "میم", "m", True),
 "ن": ("noon", "نون", "n", True), "ں": ("noon ghunna", "نون غنہ", "nasal sound at the end (as in main, hain)", False),
 "و": ("wao", "واؤ", "w / v, or the vowels oo and o", False), "ہ": ("he", "ہے", "h", True), "ھ": ("do-chashmi he", "دو چشمی ہے", "the 'h' in bh, ph, kh, gh, chh", True),
 "ی": ("ye", "یے", "y, or the vowel ee", True), "ے": ("bari ye", "بڑی یے", "the vowel e / ai at the end of a word", False),
}

def forms(ch):
    _, _, _, joins = L[ch]
    if not joins:
        return [ch, TATWEEL + ch]
    return [ch, ch + TATWEEL, TATWEEL + ch + TATWEEL, TATWEEL + ch]

UNITS = [
 ("r01", 1, "How Urdu script works", "📜", "Right to left, letters that hold hands, and the b-p-t family.", ["ا", "ب", "پ", "ت", "ٹ", "ث"],
  [("aap", "آپ", "you (respectful)"), ("ab", "اب", "now"), ("baat", "بات", "a matter / talk"), ("baap", "باپ", "father")]),
 ("r02", 2, "The j-ch-kh family + d", "🪝", "Four letters with a hook, and three d's that never hold hands on the left.", ["ج", "چ", "ح", "خ", "د", "ڈ", "ذ"],
  [("jab", "جب", "when"), ("chup", "چپ", "quiet!"), ("dada", "دادا", "grandad (dad's dad)"), ("khuda", "خدا", "God")]),
 ("r03", 3, "R, z and the s family", "🐍", "Little tails (r, z) and the toothy s and sh.", ["ر", "ڑ", "ز", "ژ", "س", "ش"],
  [("sab", "سب", "all / everyone"), ("bas", "بس", "enough!"), ("bara", "بڑا", "big"), ("kharab", "خراب", "bad / broken")]),
 ("r04", 4, "The Arabic set: s, z, t, ain, f, q", "🕌", "Letters mostly found in Arabic loanwords. Same sounds, different spellings.", ["ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق"],
  [("saaf", "صاف", "clean"), ("sabr", "صبر", "patience"), ("farq", "فرق", "difference"), ("taraf", "طرف", "direction / side")]),
 ("r05", 5, "K, g, l, m, n and the h's", "🏠", "The last letters, and suddenly you can read family words.", ["ک", "گ", "ل", "م", "ن", "ں", "و", "ہ", "ھ", "ی", "ے"],
  [("naam", "نام", "name"), ("ghar", "گھر", "house / home"), ("ammi", "امی", "Mum"), ("nani", "نانی", "Nani"), ("hai", "ہے", "is"), ("nahin", "نہیں", "no / not"), ("main", "میں", "I"), ("shukriya", "شکریہ", "thank you")]),
]

KEY = {}
for uid, order, title, emoji, tagline, letters, words in UNITS:
    u = Unit(uid)
    for ch in letters:
        name, uname, sound, _ = L[ch]
        key = "l-" + name.replace(" ", "-").replace("ṭ", "tt").replace("ḍ", "dd").replace("ṛ", "rr")
        KEY[ch] = f"{uid}.{key}"
        u.P(key, name, ch, f"the letter {name}: {sound}", tts=uname, sources=[WIKI], sense=f"letter-{key}")
    for roman, urdu, en in words:
        u.P("w-" + roman, roman, urdu, en)

    lid = lambda n: f"{uid}-l{n}"
    teach1 = [info("Right to left", "Urdu runs right to left, like Arabic and Persian. Books open from what English calls the back. Your eyes start on the right edge.", glyph="← ا ب پ")] if uid == "r01" else []
    teach1 += [u.teach(KEY[ch].split(".", 1)[1], f"Sounds like: {L[ch][2]}. Its name is '{L[ch][0]}'.") for ch in letters]
    ex1 = []
    for i, ch in enumerate(letters):
        others = [c for c in letters if c != ch][:2] if len(letters) > 2 else []
        ex1.append({"type": "mc", "prompt": "Which letter is this?", "glyph": ch, "answer": 0,
                    "options": [{"text": L[ch][0]}] + [{"text": L[o][0]} for o in others]})
    for ch in letters[:3]:
        ex1.append({"type": "trace", "glyph": ch, "label": L[ch][0]})
    ex1.append({"type": "match", "phrases": [KEY[c] for c in letters[:4]], "mode": "audio"})
    lesson1 = {"id": lid(1), "title": "Meet the letters", "blurb": f"{len(letters)} letters: {' '.join(letters)}",
               "canDo": f"You can recognise {', '.join(L[c][0] for c in letters)}", "teach": teach1, "exercises": ex1}

    joiners = [c for c in letters if L[c][3]]
    nonjoin = [c for c in letters if not L[c][3]]
    teach2 = [info("Letters hold hands", "Most letters join to the next letter on their left, so they have up to four shapes: on their own, at the start, in the middle and at the end of a word. The core shape (and the dots!) always stays the same.", glyph="ب  بـ  ـبـ  ـب")]
    if nonjoin:
        teach2.append(info("Some letters won't hold hands", f"{' '.join(nonjoin)} join to the letter before them, but never to the one after. The next letter starts fresh, as if a new word began.", glyph="  ".join(forms(nonjoin[0]))))
    teach2.append(info("Dots matter", "Many letters share a shape and differ only in their dots: ب (b, one below), پ (p, three below), ت (t, two above), ث (s, three above). Read the dots first.", glyph="ب پ ت ث") if uid == "r01" else info("Shape families", f"This unit's letters: {'  '.join(letters)}. Same family, same body: look at the dots and small marks to tell them apart.", glyph=" ".join(letters)))
    pos = ["on its own", "at the start", "in the middle", "at the end"]
    ex2 = []
    for ch in (joiners[:4] + nonjoin[:2]):
        fs = forms(ch)
        for k in ([1, 2, 3] if len(fs) == 4 else [1]):
            if L[ch][3]:
                right = pos[k]; wrong = [p for p in pos if p != right][:2]
            else:
                right = "at the end (joined from the right)"; wrong = ["at the start", "in the middle"]
            ex2.append({"type": "mc", "prompt": f"Where in a word does this shape of '{L[ch][0]}' appear?", "glyph": fs[k], "options": [{"text": right}] + [{"text": w} for w in wrong], "answer": 0})
            if len(ex2) >= 7:
                break
        if len(ex2) >= 7:
            break
    other = [c for c in L if c not in letters][:3] if uid != "r01" else ["ج", "س", "م"]
    ex2.append({"type": "mc", "prompt": f"Which one is '{L[letters[1]][0]}'?", "options": [{"glyph": letters[1]}, {"glyph": letters[0]}, {"glyph": letters[2]}], "answer": 0, "audio": KEY[letters[1]]})
    lesson2 = {"id": lid(2), "title": "Shapes and joins", "blurb": "Start, middle, end: same letter, different outfits.",
               "canDo": "You can spot these letters at the start, middle and end of a word", "teach": teach2, "exercises": ex2}

    ws = [f"{uid}.w-{w[0]}" for w in words]
    teach3 = [info("Your first words", "Now put the letters together. Read right to left, sound out each letter, then check yourself with the audio.", glyph=words[0][1])]
    teach3 += [{"phrase": w} for w in ws]
    ex3 = []
    for roman, urdu, en in words:
        others = [w for w in words if w[0] != roman][:2]
        ex3.append({"type": "mc", "prompt": "Read it. Which word is this?", "glyph": urdu, "options": [{"text": f"{roman} ({en})"}] + [{"text": f"{o[0]} ({o[2]})"} for o in others], "answer": 0})
    for roman, urdu, en in words[:3]:
        others = [w for w in words if w[0] != roman][:2]
        ex3.append({"type": "mc", "prompt": f"Find the word “{roman}”", "audio": f"{uid}.w-{roman}", "options": [{"glyph": urdu}] + [{"glyph": o[1]} for o in others], "answer": 0})
    ex3.append({"type": "trace", "glyph": words[0][1], "label": words[0][0]})
    lesson3 = {"id": lid(3), "title": "Read real words", "blurb": " ".join(w[1] for w in words[:4]),
               "canDo": f"You can read {', '.join(w[0] for w in words[:4])} in Urdu script", "teach": teach3, "exercises": ex3}

    # Lesson 4: mix it up. Spelling with dot-family decoys, and sound → letter.
    SIB = {"ب": "پ", "پ": "ب", "ت": "ٹ", "ٹ": "ت", "ث": "ت", "ج": "چ", "چ": "ج", "ح": "خ", "خ": "ح", "د": "ڈ", "ڈ": "د", "ذ": "ز",
           "ر": "ڑ", "ڑ": "ر", "ز": "ذ", "س": "ش", "ش": "س", "ص": "ض", "ض": "ص", "ط": "ظ", "ظ": "ط", "ع": "غ", "غ": "ع", "ف": "ق", "ق": "ف",
           "ک": "گ", "گ": "ک", "ن": "ت", "ی": "ے", "ے": "ی", "ہ": "ھ", "ا": "آ", "م": "ل", "ل": "م", "و": "ر"}
    ex4 = []
    for roman, urdu, en in words:
        letters_of = [c for c in urdu if c.strip() and c != "ـ"]
        right = " + ".join(letters_of)
        wrongs = []
        for k, c in enumerate(letters_of):
            if c in SIB and len(wrongs) < 2:
                alt = letters_of[:k] + [SIB[c]] + letters_of[k + 1:]
                cand = " + ".join(alt)
                if cand != right and cand not in wrongs:
                    wrongs.append(cand)
        if len(wrongs) < 2:
            wrongs.append(" + ".join(reversed(letters_of)))
        if len(set([right] + wrongs)) < 3:
            continue
        ex4.append({"type": "mc", "prompt": f"Which letters spell “{roman}” ({en})? Right to left.", "options": [{"glyph": right}] + [{"glyph": w} for w in wrongs[:2]], "answer": 0, "explain": f"{urdu}: from the right, {' then '.join(L[c][0] if c in L else ('alif madda' if c == 'آ' else c) for c in letters_of)}."})
    for ch in letters[:5]:
        others = [c for c in letters if c != ch][:2]
        ex4.append({"type": "mc", "prompt": f"Which letter makes the sound: {L[ch][2]}?", "options": [{"glyph": ch}] + [{"glyph": o} for o in others], "answer": 0})
    lesson4 = {"id": lid(4), "title": "Mix it up", "blurb": "Spell words letter by letter. Watch the dots.",
               "canDo": f"You can spell {', '.join(w[0] for w in words[:3])} letter by letter", "teach": [info("Spelling, right to left", "Break a word into letters, starting from the right. Many wrong answers here differ by just one dot. Look closely.", glyph=words[0][1])], "exercises": ex4}

    meta = {"track": "reading", "order": order, "title": title, "emoji": emoji, "tagline": tagline,
            "canDo": f"You can read the letters {' '.join(letters)} and words made from them",
            "grammar": [{"title": "Letter sounds", "body": "  ·  ".join(f"{c} {L[c][0]} = {L[c][2]}" for c in letters)}]}
    write_unit(u, meta, [lesson1, lesson2, lesson3, lesson4], None)
