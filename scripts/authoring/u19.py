"""Unit 19 (advanced): The news. Formal vocabulary and the passive."""
from common import Unit, info, write_unit

u = Unit("u19")
P = u.P
P("khabar", "khabar", "خبر", "news, a piece of news", sense="news")
P("khabrein", "khabrein", "خبریں", "the news (plural)", sense="news", accept=["khabren", "khabrain"])
P("taaza-tareen", "taaza tareen khabar", "تازہ ترین خبر", "the latest news", literal="freshest news", accept=["taza tareen khabar", "taza tarin khabar"])
P("hukumat", "hukumat", "حکومت", "government", accept=["hukoomat", "hakumat"])
P("awaam", "awaam", "عوام", "the public, the people", accept=["awam"])
P("mulk", "mulk", "ملک", "country")
P("siyasat", "siyasat", "سیاست", "politics", accept=["siyaasat"])
P("wazir-e-azam", "wazir-e-azam", "وزیرِ اعظم", "prime minister", literal="minister-of-greatest", accept=["wazir e azam", "wazeer e azam", "wazire azam"])
P("intikhabat", "intikhabat", "انتخابات", "elections", accept=["intekhabat", "intikhaabat"])
P("adalat", "adalat", "عدالت", "court", accept=["adaalat"])
P("qanoon", "qanoon", "قانون", "law", accept=["kanoon", "qanun"])
P("mehngai", "mehngai", "مہنگائی", "inflation, high prices", accept=["mehangai", "mahngai"], hook="mehnga = expensive. mehngai = expensive-ness.")
P("maeeshat", "ma'eeshat", "معیشت", "the economy", accept=["maeeshat", "maishat", "maeshat"])
P("bijli", "bijli", "بجلی", "electricity")
P("load-shedding", "load-shedding", "لوڈ شیڈنگ", "scheduled power cuts", accept=["loadshedding", "load shedding"], register="casual")
P("qeemat-izafa", "petrol ki qeemat mein izafa", "پٹرول کی قیمت میں اضافہ", "a rise in the price of petrol", accept=["petrol ki keemat mein izafa", "petrol ki qeemat mein izaafa"])
P("kami", "kami", "کمی", "a decrease, a shortage")
P("ailaan", "hukumat ne naye budget ka ailaan kiya", "حکومت نے نئے بجٹ کا اعلان کیا", "The government announced the new budget", accept=["hukumat ne naye budget ka elaan kiya", "hukumat ne naye budget ka ailan kiya"])
P("kiya-gaya", "naye budget ka ailaan kiya gaya", "نئے بجٹ کا اعلان کیا گیا", "The new budget was announced", accept=["naye budget ka elaan kiya gaya", "naye budget ka ailan kiya gaya"])
P("ke-mutabiq", "zaraye ke mutabiq", "ذرائع کے مطابق", "according to sources", accept=["zarae ke mutabiq", "zaraye ke mutaabiq"])
P("mausam", "mausam ka haal", "موسم کا حال", "the weather report", literal="the state of the weather", accept=["mosam ka haal", "mausam ka hal"])
P("barish-imkaan", "kal barish ka imkaan hai", "کل بارش کا امکان ہے", "There's a chance of rain tomorrow", accept=["kal baarish ka imkaan hai", "kal barish ka imkan hai"])
P("match-jeet", "Pakistan ne match jeet liya", "پاکستان نے میچ جیت لیا", "Pakistan won the match", accept=["pakistan ne match jeet liya hai"])
P("aman", "aman", "امن", "peace")
P("taleem", "taleem", "تعلیم", "education", accept=["talim", "taaleem"])
# scene lines
P("b.s-abbu-headline", "Suno suno! Petrol ki qeemat mein phir izafa", "سنو سنو! پٹرول کی قیمت میں پھر اضافہ", "Listen, listen! Another rise in the price of petrol", speaker="abbu")
P("b.s-ammi-headline", "Aur tankhwah mein? Us mein kab izafa hoga?", "اور تنخواہ میں؟ اس میں کب اضافہ ہو گا؟", "And salaries? When will those rise?", speaker="ammi")
P("b.s-bilal-weather", "Mausam ka haal: kal barish ka imkaan hai", "موسم کا حال: کل بارش کا امکان ہے", "The weather report: a chance of rain tomorrow", speaker="bilal")
P("b.s-nani-weather", "Mere ghutne pehle hi bata chuke hain", "میرے گھٹنے پہلے ہی بتا چکے ہیں", "My knees have already told me", speaker="nani")
P("b.s-abbu-bijli", "Bijli phir chali gayi", "بجلی پھر چلی گئی", "The electricity's gone again", speaker="abbu")
P("b.s-khala-bijli", "Zaraye ke mutabiq, do ghante mein aayegi", "ذرائع کے مطابق، دو گھنٹے میں آئے گی", "According to sources, it'll be back in two hours", speaker="khala")
P("b.s-abbu-zaraye", "Kaun se zaraye? Humsaye?", "کون سے ذرائع؟ ہمسائے؟", "Which sources? The neighbours?", speaker="abbu")
# boss
P("b.abbu-1", "Khabrein suni? Petrol ki qeemat mein phir izafa!", "خبریں سنیں؟ پٹرول کی قیمت میں پھر اضافہ!", "Heard the news? Petrol's gone up again!", speaker="abbu")
P("b.you-mehngai", "Ji, mehngai bohat barh gayi hai", "جی، مہنگائی بہت بڑھ گئی ہے", "Yes, prices have gone up a lot", accept=["ji mehngai bohat barh gayi hai", "mehngai bohat barh gayi hai", "ji mehngai bohat badh gayi hai"])
P("b.you-hukumat", "Hukumat kya kar rahi hai?", "حکومت کیا کر رہی ہے؟", "What is the government doing?", accept=["hukumat kya kar rahi hai"])
P("b.abbu-2a", "Bilkul. Aur awaam pareshan hain", "بالکل۔ اور عوام پریشان ہیں", "Exactly. And the public are worried", speaker="abbu")
P("b.abbu-2b", "Yahi to main poochh raha hoon! Tees saal se poochh raha hoon!", "یہی تو میں پوچھ رہا ہوں! تیس سال سے پوچھ رہا ہوں!", "That's what I'm asking! I've been asking for thirty years!", speaker="abbu")
P("b.abbu-3", "Achha, koi achhi khabar bhi hai?", "اچھا، کوئی اچھی خبر بھی ہے؟", "Right, is there any good news?", speaker="abbu")
P("b.you-match", "Ji haan! Pakistan ne match jeet liya", "جی ہاں! پاکستان نے میچ جیت لیا", "Yes! Pakistan won the match", accept=["ji haan pakistan ne match jeet liya", "pakistan ne match jeet liya"])
P("b.you-barish", "Mausam ka haal: kal barish ka imkaan hai", "موسم کا حال: کل بارش کا امکان ہے", "The weather report: a chance of rain tomorrow", accept=["mausam ka haal kal barish ka imkaan hai", "kal barish ka imkaan hai"])
P("b.abbu-4a", "Wah! Yeh hui na baat. Mithai mangwao!", "واہ! یہ ہوئی نا بات۔ مٹھائی منگواؤ!", "Ha! Now that's more like it. Order sweets!", speaker="abbu")
P("b.abbu-4b", "Barish? Phir to bijli zaroor jayegi", "بارش؟ پھر تو بجلی ضرور جائے گی", "Rain? Then the electricity will definitely go", speaker="abbu")
P("b.abbu-end", "Tum to ab khabrein bhi samajhte ho. Remote tum rakho", "تم تو اب خبریں بھی سمجھتے ہو۔ ریموٹ تم رکھو", "So you understand the news now too. You keep the remote", speaker="abbu")

L = []
L.append({"id": "u19-l1", "title": "Headlines", "blurb": "The words that scroll across the bottom of every news channel.", "canDo": "You can pick out the key words in a news headline",
 "teach": [info("News Urdu is formal Urdu", "The news uses the Arabic and Persian end of the vocabulary: hukumat, not sarkar; awaam, not log; taaza tareen, not nayi. The grammar is the grammar you know. It's the nouns that are new."),
   u.teach("khabar"), u.teach("khabrein"), u.teach("taaza-tareen", "-tareen makes a superlative: taaza (fresh) → taaza tareen (freshest). behtareen = best."), u.teach("hukumat"), u.teach("awaam", "Always plural: awaam pareshan hain."), u.teach("mulk"), u.teach("siyasat"), u.teach("wazir-e-azam", "The izafat again: minister-of-greatest.")],
 "exercises": [u.match("khabar", "hukumat", "awaam", "mulk", "siyasat"),
   u.sort("Everyday word or news word?", ["Everyday", "News"], [("log (people)", 0), ("@awaam", 1), ("sarkar (government)", 0), ("@hukumat", 1), ("nayi khabar (new news)", 0), ("@taaza-tareen", 1)]),
   u.meaning("wazir-e-azam"), u.listen("taaza-tareen", True),
   u.gap("taaza-tareen", ("tareen", "ترین"), [("bohat", "بہت"), ("wala", "والا")], "-tareen = the most."),
   u.type("hukumat", "Type the word for “government”"), u.dictation("khabrein"), u.type("awaam", "Type the word for “the public”"), u.speak("wazir-e-azam")]})
L.append({"id": "u19-l2", "title": "Prices and power cuts", "blurb": "The two topics that open every conversation in Pakistan.", "canDo": "You can follow news about prices, the economy and electricity",
 "teach": [u.teach("mehngai"), u.teach("maeeshat"), u.teach("qeemat-izafa", "X mein izafa: a rise in X. The noun for 'more'."), u.teach("kami", "X mein kami: a fall in X. The noun for 'less'."), u.teach("bijli"), u.teach("load-shedding", "English words, entirely Pakistani meaning. Everyone knows their neighbourhood's schedule by heart.")],
 "exercises": [u.scene([("abbu", "b.s-abbu-headline"), ("ammi", "b.s-ammi-headline")], "What does Ammi want to know?", ["When salaries will go up too", ("Why petrol is expensive", "She knows why. She has a follow-up question."), ("Where the newspaper is", "Abbu has it. Abbu always has it.")], setup="Breakfast. Abbu reads the paper aloud whether asked or not."),
   u.scene([("abbu", "b.s-abbu-bijli"), ("khala", "b.s-khala-bijli"), ("abbu", "b.s-abbu-zaraye")], "Who does Abbu think Khala's ‘sources’ are?", ["The neighbours", ("The electricity company", "If only."), ("The prime minister", "She's well connected, but not that well.")], hide=True),
   u.sort("Going up or coming down?", ["Up", "Down"], [("qeemat mein izafa", 0), ("qeemat mein kami", 1), ("mehngai barh gayi", 0), ("mehngai kam hui", 1)]),
   u.meaning("mehngai"), u.build("qeemat-izafa"), u.listen("maeeshat"),
   u.type("mehngai", "Type the word for “inflation”"), u.dictation("bijli"), u.speak("qeemat-izafa")]})
L.append({"id": "u19-l3", "title": "The bulletin", "blurb": "Who announced what, according to whom. Plus the weather and the cricket.", "canDo": "You can follow a short news bulletin, including passive sentences",
 "teach": [info("The passive: kiya gaya", "News avoids saying who did it. Active: hukumat ne ailaan kiya (the government announced). Passive: ailaan kiya gaya (it was announced). The recipe: past form + gaya/gayi/gaye."),
   u.teach("ailaan"), u.teach("kiya-gaya"), u.teach("ke-mutabiq", "X ke mutabiq: according to X. zaraye = sources."), u.teach("intikhabat"), u.teach("adalat"), u.teach("qanoon"),
   u.teach("mausam"), u.teach("barish-imkaan", "imkaan = possibility. From the same root as mumkin (possible)."), u.teach("match-jeet", "The one headline everybody reads."), u.teach("aman"), u.teach("taleem")],
 "exercises": [u.scene([("bilal", "b.s-bilal-weather"), ("nani", "b.s-nani-weather")], "How did Nani already know about the rain?", ["Her knees told her", ("She watched the news earlier", "She doesn't need the news."), ("Bilal told her yesterday", "Bilal is the one being upstaged here.")]),
   u.sort("Who did it? Or was it just ‘done’?", ["Active (someone did it)", "Passive (it was done)"], [("@ailaan", 0), ("@kiya-gaya", 1), ("@match-jeet", 0), ("faisla kiya gaya", 1)], "kiya gaya, diya gaya, kaha gaya: the doer has left the sentence."),
   u.match("intikhabat", "adalat", "qanoon", "aman", "taleem"),
   u.spot("kiya-gaya", ("gaya", "گیا"), ("hai", "ہے"), "The passive needs gaya: ailaan kiya gaya."),
   u.meaning("ke-mutabiq"), u.listen("barish-imkaan", True), u.build("ailaan"), u.type("match-jeet", "Type the good news: “Pakistan won the match”"), u.dictation("ke-mutabiq"), u.speak("barish-imkaan")]})

n, y, o = u.npc, u.you, u.opt
boss = {"id": "u19-boss", "title": "The Nine O'Clock News", "character": "abbu",
 "blurb": "Abbu watches the news at full volume and wants someone to agree with him.",
 "scene": "Nine o'clock. The headlines music plays. Abbu pats the sofa next to him without taking his eyes off the screen.",
 "canDo": "You can discuss the day's headlines in Urdu",
 "start": "a",
 "nodes": {
  "a": n("abbu", "b.abbu-1", "b"),
  "b": y("React to the headline.", [o("b.you-mehngai", "c1", "great"), o("b.you-hukumat", "c2", "bold", "You have asked The Question. He has been waiting for someone to ask it.")], "Ji, mehngai…"),
  "c1": n("abbu", "b.abbu-2a", "d"),
  "c2": n("abbu", "b.abbu-2b", "d"),
  "d": n("abbu", "b.abbu-3", "e"),
  "e": y("Find him some good news.", [o("b.you-match", "f1", "great"), o("b.you-barish", "f2", "fine")], "Ji haan! Pakistan ne…"),
  "f1": n("abbu", "b.abbu-4a", "g"),
  "f2": n("abbu", "b.abbu-4b", "g"),
  "g": n("abbu", "b.abbu-end", "end"),
  "end": {"type": "end", "title": "You have the remote", "text": "You followed the headlines, had an opinion and found the good news. Abbu handed over the remote. In this house, that has never happened before.", "outcome": "informed"}}}

meta = {"track": "speaking", "stage": "advanced", "order": 19, "title": "The News", "titleUrdu": "خبریں", "emoji": "📺",
 "tagline": "Headlines, prices, politics and the passive voice.", "canDo": "You can follow the gist of an Urdu news bulletin and talk about it",
 "grammar": [{"title": "The passive", "body": "Past form + jana: ailaan kiya gaya (it was announced), faisla kiya gaya (it was decided), bataya gaya hai ke… (it has been said that…). The verb agrees with the thing: ailaan (m.) kiya gaya, baat (f.) ki gayi."},
             {"title": "X mein izafa / kami", "body": "qeemat mein izafa (a rise in price), bijli ki qeemat mein kami (a fall in the price of electricity). News prefers these nouns to the everyday verbs barhna and kam hona."},
             {"title": "-tareen: the most", "body": "taaza tareen (latest), behtareen (best), bad-tareen (worst), aham tareen (most important). A Persian superlative that everyday Urdu also uses."},
             {"title": "ke mutabiq", "body": "zaraye ke mutabiq (according to sources), hukumat ke mutabiq (according to the government), Nani ke mutabiq (according to Nani: the most reliable)."}]}
write_unit(u, meta, L, boss)
