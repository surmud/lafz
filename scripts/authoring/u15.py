"""Unit 15 (advanced): If, wish, maybe, should have."""
from common import Unit, info, write_unit

u = Unit("u15")
P = u.P
P("agar-barish", "agar barish hui to hum nahin jayenge", "اگر بارش ہوئی تو ہم نہیں جائیں گے", "If it rains, we won't go", accept=["agar baarish hui to hum nahin jaenge", "agar barish hui toh hum nahin jayenge"])
P("agar-waqt", "agar waqt mila to zaroor aaunga", "اگر وقت ملا تو ضرور آؤں گا", "If I get time, I'll definitely come (man)", sense="if-time", accept=["agar waqt mila to zaroor aaungi", "agar waqt mila toh zaroor aaunga"])
P("agar-waqt-f", "agar waqt mila to zaroor aaungi", "اگر وقت ملا تو ضرور آؤں گی", "If I get time, I'll definitely come (woman)", sense="if-time", accept=["agar waqt mila to zaroor aaunga"])
P("aap-ki-jagah", "agar main aap ki jagah hota to mana kar deta", "اگر میں آپ کی جگہ ہوتا تو منع کر دیتا", "If I were you, I'd have said no (man)", literal="if I were in your place…", accept=["agar main aap ki jagah hoti to mana kar deti", "agar main aapki jagah hota to mana kar deta"])
P("kaash-wahan", "kaash main wahan hota", "کاش میں وہاں ہوتا", "I wish I were there (man)", accept=["kaash main wahan hoti", "kash main wahan hota"], hook="kaash sounds like a sigh. It is one.")
P("kaash-pehle", "kaash aap ne pehle bataya hota", "کاش آپ نے پہلے بتایا ہوتا", "I wish you'd told me earlier", accept=["kash aap ne pehle bataya hota", "kaash aapne pehle bataya hota"])
P("shayad", "shayad woh kal aaye", "شاید وہ کل آئے", "Maybe he'll come tomorrow", accept=["shayad wo kal aaye", "shayad woh kal aye"])
P("ho-sakta", "ho sakta hai", "ہو سکتا ہے", "It's possible / could be")
P("mumkin-nahin", "yeh mumkin nahin", "یہ ممکن نہیں", "That's not possible", accept=["yeh mumkin nahin hai"])
P("kya-pata", "kya pata", "کیا پتا", "Who knows", accept=["kya pata hai"])
P("lagta-hai", "lagta hai barish hogi", "لگتا ہے بارش ہو گی", "Looks like it'll rain", accept=["lagta hai baarish hogi", "lagta hai barish ho gi"])
P("chahiye-tha", "mujhe pehle aana chahiye tha", "مجھے پہلے آنا چاہیے تھا", "I should have come earlier")
P("nahin-chahiye-tha", "tumhein aisa nahin karna chahiye tha", "تمہیں ایسا نہیں کرنا چاہیے تھا", "You shouldn't have done that", accept=["tumhe aisa nahin karna chahiye tha"])
P("zaroori-ke", "zaroori hai ke aap aayein", "ضروری ہے کہ آپ آئیں", "It's essential that you come", accept=["zaroori hai ke aap aaen", "zaroori hai ki aap aayein", "zaroori hai ke aap ayen"])
P("chahta-ke", "main chahta hoon ke tum khush raho", "میں چاہتا ہوں کہ تم خوش رہو", "I want you to be happy (man)", accept=["main chahti hoon ke tum khush raho", "main chahta hoon ki tum khush raho"])
P("allah-kare", "Allah kare sab theek ho", "اللہ کرے سب ٹھیک ہو", "May everything turn out fine", literal="may God make all well", accept=["allah kare sab theek ho jaye"])
P("warna", "jaldi karo, warna der ho jayegi", "جلدی کرو، ورنہ دیر ہو جائے گی", "Hurry up, otherwise we'll be late", accept=["jaldi karo warna der ho jaegi", "jaldi karo varna der ho jayegi"])
P("jab-tak", "jab tak main na kahoon, mat jana", "جب تک میں نہ کہوں، مت جانا", "Don't go until I say so", accept=["jab tak main na kahun mat jana"])
P("chahe", "chahe kuch bhi ho", "چاہے کچھ بھی ہو", "No matter what happens", accept=["chahe kuch bhi ho jaye"])
# scene lines
P("b.s-ammi-chhatri", "Chhatri le lo. Lagta hai barish hogi", "چھتری لے لو۔ لگتا ہے بارش ہو گی", "Take an umbrella. Looks like it'll rain", speaker="ammi")
P("b.s-bilal-nahin", "Nahin hogi, Khala. Aasman saaf hai", "نہیں ہو گی، خالہ۔ آسمان صاف ہے", "It won't, Khala. The sky is clear", speaker="bilal")
P("b.s-bilal-kaash", "Kaash maine chhatri le li hoti", "کاش میں نے چھتری لے لی ہوتی", "I wish I'd taken the umbrella", speaker="bilal")
P("b.s-abbu-agar", "Agar tum waqt par nikalte to flight mil jati", "اگر تم وقت پر نکلتے تو فلائٹ مل جاتی", "If you'd left on time, you'd have caught the flight", speaker="abbu")
P("b.s-ammi-traffic", "Traffic bohat thi. Ab kya ho sakta hai?", "ٹریفک بہت تھی۔ اب کیا ہو سکتا ہے؟", "There was so much traffic. What can be done now?", speaker="ammi")
# boss
P("b.khala-1", "Tum aa gaye! Agar pehle batate to main biryani banati", "تم آ گئے! اگر پہلے بتاتے تو میں بریانی بناتی", "You're here! If you'd told me before, I'd have made biryani", speaker="khala")
P("b.you-chahiye-tha", "Mujhe pehle batana chahiye tha, Khala", "مجھے پہلے بتانا چاہیے تھا، خالہ", "I should have told you earlier, Khala", accept=["mujhe pehle batana chahiye tha"])
P("b.you-kaash", "Kaash maine pehle bataya hota!", "کاش میں نے پہلے بتایا ہوتا!", "I wish I'd told you earlier!", accept=["kaash maine pehle bataya hota", "kash maine pehle bataya hota"])
P("b.khala-2", "Koi baat nahin. Shayad kal bana doon. Kal aaoge?", "کوئی بات نہیں۔ شاید کل بنا دوں۔ کل آؤ گے؟", "Never mind. Maybe I'll make it tomorrow. Will you come tomorrow?", speaker="khala")
P("b.you-agar-waqt", "Agar waqt mila to zaroor aaunga", "اگر وقت ملا تو ضرور آؤں گا", "If I get time, I'll definitely come", accept=["agar waqt mila to zaroor aaungi", "agar waqt mila toh zaroor aaunga"])
P("b.you-chahe", "Chahe kuch bhi ho, main aaunga", "چاہے کچھ بھی ہو، میں آؤں گا", "No matter what, I'll come", accept=["chahe kuch bhi ho main aaungi", "chahe kuch bhi ho main aaunga"])
P("b.khala-3", "Aur Bilal ki mangni pe? Zaroori hai ke tum aao", "اور بلال کی منگنی پہ؟ ضروری ہے کہ تم آؤ", "And Bilal's engagement? It's essential that you come", speaker="khala")
P("b.you-inshallah", "Inshallah. Allah kare sab theek ho", "ان شاء اللہ۔ اللہ کرے سب ٹھیک ہو", "God willing. May everything go well", accept=["inshallah allah kare sab theek ho", "allah kare sab theek ho"])
P("b.you-ho-sakta", "Ho sakta hai. Kya pata", "ہو سکتا ہے۔ کیا پتا", "Could be. Who knows", accept=["ho sakta hai", "kya pata"])
P("b.khala-4a", "Shabash. Main chahti hoon ke tum hamesha khush raho", "شاباش۔ میں چاہتی ہوں کہ تم ہمیشہ خوش رہو", "Good. I want you to always be happy", speaker="khala")
P("b.khala-4b", "“Ho sakta hai”? Tumhare Abbu bhi yahi kehte the", "“ہو سکتا ہے”؟ تمہارے ابو بھی یہی کہتے تھے", "“Could be”? Your father used to say exactly that", speaker="khala")
P("b.khala-end", "Chalo, ab khana khao. Warna thanda ho jayega", "چلو، اب کھانا کھاؤ۔ ورنہ ٹھنڈا ہو جائے گا", "Come on, eat now. Otherwise it'll get cold", speaker="khala")

L = []
L.append({"id": "u15-l1", "title": "Agar… to…", "blurb": "If this, then that. The backbone of every plan and every threat.", "canDo": "You can say what will happen if something else does",
 "teach": [info("Real ifs", "agar (if) … to (then) …. For things that might really happen, Urdu often puts the 'if' half in the past form even though it means the future: agar barish hui (if it 'rained') to hum nahin jayenge."),
   u.teach("agar-barish"), u.teach("agar-waqt", "The most common soft no in the language."), u.teach("agar-waqt-f"), u.teach("warna", "warna = otherwise. Every parent's favourite word."), u.teach("jab-tak", "jab tak … na = until. Note the 'na': literally 'as long as I don't say'.")],
 "exercises": [u.scene([("ammi", "b.s-ammi-chhatri"), ("bilal", "b.s-bilal-nahin"), ("bilal", "b.s-bilal-kaash")], "Who was right about the weather?", ["Ammi", ("Bilal", "Listen to his last line. He's wet."), ("Neither. It snowed", "In Lahore. In June.")], setup="Morning, front door. Then, an hour later."),
   u.meaning("agar-barish"), u.gap("agar-barish", ("to", "تو"), [("ko", "کو"), ("se", "سے")], "agar … to …: if … then …"),
   u.build("agar-waqt"), u.say("warna", "Abbu is at the door with the car keys.", ["jab-tak", "agar-barish"]),
   u.dictation("agar-waqt"), u.type("warna", "Type: “Hurry up, otherwise we'll be late”"), u.speak("agar-barish")]})
L.append({"id": "u15-l2", "title": "Kaash", "blurb": "Wishes and what-ifs. The grammar of regret.", "canDo": "You can talk about things that didn't happen and wish they had",
 "teach": [info("Unreal ifs use hota", "For things that didn't happen, both halves take the -ta form: agar main wahan hota to madad karta (if I had been there, I would have helped). kaash + hota = I wish."),
   u.teach("kaash-wahan"), u.teach("kaash-pehle"), u.teach("aap-ki-jagah", "aap ki jagah = in your place. Advice, with deniability.")],
 "exercises": [u.scene([("abbu", "b.s-abbu-agar"), ("ammi", "b.s-ammi-traffic")], "What happened?", ["They missed the flight", ("They caught the flight", "mil jati = 'would have been caught'. It wasn't."), ("The flight was cancelled", "No. The flight left. Without them.")], setup="Departures hall. Two suitcases, one argument.", hide=True),
   u.sort("Real plan or just a wish?", ["Might happen", "Didn't happen"], [("@agar-barish", 0), ("@kaash-wahan", 1), ("@agar-waqt", 0), ("@kaash-pehle", 1), ("@warna", 0), ("@aap-ki-jagah", 1)], "hota / deta / bataya hota: it didn't happen."),
   u.meaning("kaash-pehle"), u.gap("kaash-wahan", ("hota", "ہوتا"), [("hoon", "ہوں"), ("hai", "ہے")], "A wish about something unreal: hota."),
   u.spot("aap-ki-jagah", ("hota", "ہوتا"), ("hoon", "ہوں"), "You aren't in their place, so it's hota (were), not hoon (am)."),
   u.listen("aap-ki-jagah", True), u.type("kaash-wahan", "Type: “I wish I were there”"), u.dictation("kaash-pehle")]})
L.append({"id": "u15-l3", "title": "Shayad", "blurb": "Maybe, possibly, who knows. How to commit to nothing.", "canDo": "You can say how likely something is",
 "teach": [info("Maybe takes the short form", "After shayad, the verb drops its ending: woh aayega (he will come) → shayad woh aaye (maybe he'll come). This short form is the subjunctive: for things that are possible, wanted or needed, not certain."),
   u.teach("shayad"), u.teach("ho-sakta"), u.teach("mumkin-nahin"), u.teach("kya-pata"), u.teach("lagta-hai", "lagta hai = it seems. Add it to any sentence to make it an opinion.")],
 "exercises": [u.sort("How sure are they?", ["Not sure", "Sure"], [("@shayad", 0), ("@mumkin-nahin", 1), ("@ho-sakta", 0), ("@kya-pata", 0), ("woh kal aayega", 1), ("bilkul nahin", 1)]),
   u.gap("shayad", ("aaye", "آئے"), [("aayega", "آئے گا"), ("aaya", "آیا")], "After shayad the verb is the short form: aaye."),
   u.meaning("lagta-hai"), u.say("kya-pata", "Someone asks when the electricity will come back.", ["mumkin-nahin", "shayad"]),
   u.listen("ho-sakta"), u.type("mumkin-nahin", "Type: “That's not possible”"), u.dictation("lagta-hai"), u.speak("shayad")]})
L.append({"id": "u15-l4", "title": "Should have", "blurb": "Regrets, obligations and blessings.", "canDo": "You can say what should have happened and what you want for someone",
 "teach": [u.teach("chahiye-tha", "chahiye = should. chahiye tha = should have."), u.teach("nahin-chahiye-tha"), u.teach("zaroori-ke", "zaroori hai ke + short form. Same subjunctive as after shayad."), u.teach("chahta-ke", "'I want that you stay happy.' Urdu needs the 'ke'."), u.teach("allah-kare"), u.teach("chahe")],
 "exercises": [u.match("chahiye-tha", "zaroori-ke", "allah-kare", "chahe"),
   u.spot("chahiye-tha", ("mujhe", "مجھے"), ("main", "میں"), "chahiye takes mujhe, even in the past."),
   u.gap("zaroori-ke", ("aayein", "آئیں"), [("aate", "آتے"), ("aaye the", "آئے تھے")], "After zaroori hai ke: the short form, aayein."),
   u.meaning("nahin-chahiye-tha"), u.say("allah-kare", "Your cousin has an exam tomorrow.", ["chahe", "chahiye-tha"]),
   u.build("chahta-ke"), u.type("chahiye-tha", "Type: “I should have come earlier”"), u.dictation("chahe"), u.speak("allah-kare")]})

n, y, o = u.npc, u.you, u.opt
boss = {"id": "u15-boss", "title": "The Surprise Visit", "character": "khala",
 "blurb": "You turned up at Khala's unannounced. Every sentence she says starts with 'if'.",
 "scene": "You were in the neighbourhood, so you rang Khala's bell. She is delighted and also slightly offended: she had no time to cook.",
 "canDo": "You can handle ifs, wishes and should-haves in a real conversation",
 "start": "a",
 "nodes": {
  "a": n("khala", "b.khala-1", "b"),
  "b": y("Own it.", [o("b.you-chahiye-tha", "c", "great"), o("b.you-kaash", "c", "great", "A wish in the past. She's impressed despite herself.")], "Mujhe pehle…"),
  "c": n("khala", "b.khala-2", "d"),
  "d": y("Will you come tomorrow?", [o("b.you-chahe", "e", "great"), o("b.you-agar-waqt", "e", "fine", "She knows what 'agar waqt mila' means. She has used it herself.")], "Chahe kuch bhi ho…"),
  "e": n("khala", "b.khala-3", "f"),
  "f": y("Bilal's engagement. Commit, or don't.", [o("b.you-inshallah", "g1", "great"), o("b.you-ho-sakta", "g2", "bold", "A dangerous level of vagueness.")], "Inshallah…"),
  "g1": n("khala", "b.khala-4a", "h"),
  "g2": n("khala", "b.khala-4b", "h"),
  "h": n("khala", "b.khala-end", "end"),
  "end": {"type": "end", "title": "Hypothetically fluent", "text": "Ifs, wishes, maybes and should-haves, all with the right verb forms. There was no biryani today. There will be a great deal tomorrow.", "outcome": "conditional"}}}

meta = {"track": "speaking", "stage": "advanced", "order": 15, "title": "If, Wish, Maybe", "titleUrdu": "اگر، کاش، شاید", "emoji": "🤔",
 "tagline": "Conditionals, wishes, possibility and should-have.", "canDo": "You can talk about what might happen, what didn't, and what should have",
 "grammar": [{"title": "Real conditions", "body": "agar + past form, to + future: agar barish hui to hum nahin jayenge (if it rains, we won't go). The past form here means 'once that has happened'."},
             {"title": "Unreal conditions and wishes", "body": "Both halves in the -ta form: agar main wahan hota to madad karta. kaash main wahan hota (I wish I were there). kaash aap ne bataya hota (I wish you had told me)."},
             {"title": "The subjunctive (short form)", "body": "Drop -ga/-gi/-ge from the future: aayega → aaye, aayenge → aayein. Used after shayad (maybe), zaroori hai ke (it's necessary that), chahta hoon ke (I want that), Allah kare (may God), jab tak … na (until)."},
             {"title": "Should have", "body": "mujhe aana chahiye tha (I should have come). The person takes ko/mujhe/tumhein; the verb stays in the -na form."}]}
write_unit(u, meta, L, boss)
