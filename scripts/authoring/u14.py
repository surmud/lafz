"""Unit 14 (advanced): Formal and polite Urdu."""
from common import Unit, info, write_unit

u = Unit("u14")
P = u.P
P("tashreef-laiye", "tashreef laiye", "تشریف لائیے", "Please come in (formal)", literal="bring your honour", accept=["tashrif laiye"])
P("tashreef-rakhiye", "tashreef rakhiye", "تشریف رکھیے", "Please have a seat (formal)", literal="place your honour", accept=["tashrif rakhiye"], hook="You don't sit. You set your honour down.")
P("farmaiye", "farmaiye", "فرمائیے", "Please, go ahead / how can I help? (formal)", note="The formal 'say'. Elders don't bolna, they farmana.")
P("nosh", "nosh farmaiye", "نوش فرمائیے", "Please, do have some (food or drink, formal)", accept=["nosh farmaiye please"])
P("daulat-khana", "aap ka daulat khana kahan hai?", "آپ کا دولت خانہ کہاں ہے؟", "Where is your home? (formal)", literal="where is your house of wealth?", accept=["aapka daulat khana kahan hai"])
P("ghareeb-khana", "ghareeb khane par tashreef laiye", "غریب خانے پر تشریف لائیے", "Please come to my home (formal)", literal="bring your honour to the poor house", accept=["gharib khane par tashreef laiye", "ghareeb khane pe tashreef laiye"])
P("ism-e-shareef", "aap ka ism-e-shareef?", "آپ کا اسمِ شریف؟", "Your good name? (formal)", literal="your noble name?", accept=["aap ka isme shareef", "aapka ism e sharif"])
P("pehle-aap", "pehle aap", "پہلے آپ", "After you", literal="first you")
P("takalluf", "takalluf na kijiye", "تکلف نہ کیجیے", "Please, no formality / make yourself at home", accept=["takalluf mat kijiye", "takaluf na kijiye"])
P("meherbani", "aap ki bari meherbani", "آپ کی بڑی مہربانی", "That's very kind of you", accept=["aap ki badi meherbani", "aapki bari meharbani", "aap ki bari mehrbani"])
P("nawazish", "nawazish", "نوازش", "Much obliged (formal thanks)", accept=["navazish"])
P("shukr-guzar", "main aap ka shukr guzar hoon", "میں آپ کا شکر گزار ہوں", "I'm grateful to you", accept=["main aapka shukar guzar hoon", "main aap ki shukr guzar hoon"])
P("maazrat", "maazrat chahta hoon", "معذرت چاہتا ہوں", "I apologise (man)", sense="apologise", accept=["maazrat chahti hoon", "mazrat chahta hoon"])
P("maazrat-f", "maazrat chahti hoon", "معذرت چاہتی ہوں", "I apologise (woman)", sense="apologise", accept=["maazrat chahta hoon", "mazrat chahti hoon"])
P("zehmat", "zehmat ke liye maazrat", "زحمت کے لیے معذرت", "Sorry for the trouble", accept=["zahmat ke liye maazrat", "zehmat ke liye mazrat"])
P("gustakhi-maaf", "gustakhi maaf", "گستاخی معاف", "Pardon my rudeness (before you disagree)", accept=["gustakhi muaf"])
P("arz", "ek arz hai", "ایک عرض ہے", "I have a request (formal)", literal="there is one humble submission")
P("ijazat", "ab ijazat dijiye", "اب اجازت دیجیے", "I should take my leave now", literal="now give permission", accept=["ijazat dijiye", "ab ijaazat dijiye"])
P("zaroor", "ji zaroor", "جی ضرور", "Yes, certainly")
P("khidmat", "main aap ki kya khidmat kar sakta hoon?", "میں آپ کی کیا خدمت کر سکتا ہوں؟", "How may I help you? (man)", literal="what service can I do you?", accept=["main aap ki kya khidmat kar sakti hoon", "main aapki kya khidmat kar sakta hoon"])
P("musarrat", "aap se mil kar bohat musarrat hui", "آپ سے مل کر بہت مسرت ہوئی", "Delighted to meet you (formal)", accept=["aap se milkar bohat musarrat hui", "aap se mil kar bahut musarrat hui"])
P("aadaab", "aadaab arz hai", "آداب عرض ہے", "Greetings (courtly)", accept=["adaab arz hai", "aadab arz hai"])
P("janab", "janab", "جناب", "sir")
P("mohtarma", "mohtarma", "محترمہ", "madam", accept=["mohtarama"])
P("khawateen", "khawateen-o-hazraat", "خواتین و حضرات", "ladies and gentlemen", accept=["khawateen o hazraat", "khwateen o hazrat", "khawatin o hazraat"])
# scene lines
P("b.s-abbu-guest", "Aaiye janab, tashreef laiye!", "آئیے جناب، تشریف لائیے!", "Come, sir, please come in!", speaker="abbu")
P("b.s-bashir-reply", "Bari meherbani. Zehmat ke liye maazrat", "بڑی مہربانی۔ زحمت کے لیے معذرت", "Very kind of you. Sorry for the trouble", speaker="bashir")
P("b.s-abbu-zehmat", "Zehmat kaisi? Takalluf na kijiye, tashreef rakhiye", "زحمت کیسی؟ تکلف نہ کیجیے، تشریف رکھیے", "What trouble? No formality, please sit", speaker="abbu")
P("b.s-nani-pehle", "Pehle aap", "پہلے آپ", "After you", speaker="nani")
P("b.s-khala-pehle", "Nahin nahin, pehle aap", "نہیں نہیں، پہلے آپ", "No no, after you", speaker="khala")
P("b.s-nani-train", "Gaari chali gayi", "گاڑی چلی گئی", "The train has left", speaker="nani")
# boss
P("b.butt-1", "Aadaab! Tashreef laiye, tashreef laiye", "آداب! تشریف لائیے، تشریف لائیے", "Greetings! Come in, come in", speaker="mrs-butt")
P("b.you-aadaab", "Aadaab arz hai. Aap ki bari meherbani", "آداب عرض ہے۔ آپ کی بڑی مہربانی", "Greetings. That's very kind of you", accept=["aadaab arz hai", "adaab arz hai aap ki badi meherbani"])
P("b.you-salam", "Assalam-o-alaikum. Zehmat ke liye maazrat", "السلام علیکم۔ زحمت کے لیے معذرت", "Peace be upon you. Sorry for the trouble", accept=["assalamualaikum zehmat ke liye maazrat", "zehmat ke liye maazrat"])
P("b.butt-2", "Tashreef rakhiye. Chai nosh farmaiye", "تشریف رکھیے۔ چائے نوش فرمائیے", "Please sit. Do have some tea", speaker="mrs-butt")
P("b.you-zaroor", "Ji zaroor. Nawazish", "جی ضرور۔ نوازش", "Yes, certainly. Much obliged", accept=["ji zaroor", "nawazish"])
P("b.you-takalluf", "Takalluf na kijiye. Main aap ka shukr guzar hoon", "تکلف نہ کیجیے۔ میں آپ کا شکر گزار ہوں", "Please, no formality. I'm grateful to you", accept=["takalluf na kijiye", "main aap ka shukr guzar hoon"])
P("b.butt-3", "Aur aap ka daulat khana kahan hai?", "اور آپ کا دولت خانہ کہاں ہے؟", "And where is your home?", speaker="mrs-butt")
P("b.you-ghareeb", "Mera ghareeb khana London mein hai", "میرا غریب خانہ لندن میں ہے", "My humble home is in London", accept=["mera gharib khana london mein hai"])
P("b.you-daulat", "Mera daulat khana London mein hai", "میرا دولت خانہ لندن میں ہے", "My palace is in London")
P("b.butt-4a", "Mashallah! Kitni shaista Urdu hai", "ماشاء اللہ! کتنی شائستہ اردو ہے", "Mashallah! What refined Urdu", speaker="mrs-butt")
P("b.butt-4b", "Daulat khana! Mashallah, bohat khoob", "دولت خانہ! ماشاء اللہ، بہت خوب", "A palace! Mashallah, how nice", speaker="mrs-butt")
P("b.you-ijazat", "Ab ijazat dijiye. Aap se mil kar bohat musarrat hui", "اب اجازت دیجیے۔ آپ سے مل کر بہت مسرت ہوئی", "I should take my leave. Delighted to have met you", accept=["ab ijazat dijiye", "aap se mil kar bohat musarrat hui"])
P("b.you-arz", "Ek arz hai: ab ijazat dijiye", "ایک عرض ہے: اب اجازت دیجیے", "One request: allow me to take my leave", accept=["ek arz hai ab ijazat dijiye", "ab ijazat dijiye"])
P("b.butt-end", "Phir tashreef laiyega. Apni Ammi ko mera salaam kahiyega", "پھر تشریف لائیے گا۔ اپنی امی کو میرا سلام کہیے گا", "Do come again. Give your mother my salaam", speaker="mrs-butt")

L = []
L.append({"id": "u14-l1", "title": "Tashreef", "blurb": "The verbs change when the guest is important.", "canDo": "You can welcome and seat a guest in formal Urdu",
 "teach": [info("Formal Urdu swaps the verb", "Everyday: aaiye, baithiye, boliye, khaiye. Formal: tashreef laiye, tashreef rakhiye, farmaiye, nosh farmaiye. Same meaning, more ceremony. You'll hear it at weddings, on TV, and from anyone's grandfather."),
   u.teach("tashreef-laiye"), u.teach("tashreef-rakhiye"), u.teach("farmaiye", "Also what a shopkeeper says when you walk in: 'Ji, farmaiye?'"), u.teach("nosh", "Only for someone else's eating. Nobody 'nosh farmaos' their own lunch.")],
 "exercises": [u.sort("Everyday or formal?", ["Everyday", "Formal"], [("baithiye", 0), ("@tashreef-rakhiye", 1), ("aaiye", 0), ("@tashreef-laiye", 1), ("boliye", 0), ("@farmaiye", 1)], "The formal set is for guests and elders you want to honour."),
   u.scene([("abbu", "b.s-abbu-guest"), ("bashir", "b.s-bashir-reply"), ("abbu", "b.s-abbu-zehmat")], "What is Bashir Bhai apologising for?", ["Being a bother", ("Being late", "He says zehmat: trouble, bother."), ("Not bringing sweets", "A serious offence, but not this one.")], setup="Bashir Bhai visits the house for the first time."),
   u.meaning("tashreef-rakhiye"), u.say("farmaiye", "An elder clears his throat to speak. Invite him to.", ["nosh", "tashreef-laiye"]),
   u.dictation("tashreef-laiye"), u.type("tashreef-rakhiye", "Type: “Please have a seat” (formal)"), u.type("nosh", "Offer the plate, formally."), u.speak("tashreef-laiye")]})
L.append({"id": "u14-l2", "title": "Palace and poor house", "blurb": "Your house is a palace. Mine is a hovel. Those are the rules.", "canDo": "You can follow the raise-them, lower-yourself etiquette of formal Urdu",
 "teach": [info("Raise them, lower yourself", "In formal Urdu the other person's things get grand words and yours get humble ones. Their home is a daulat khana (house of wealth). Yours is a ghareeb khana (poor house), even if it has a pool."),
   u.teach("daulat-khana"), u.teach("ghareeb-khana"), info("The little -e-", "ism-e-shareef, 'name of nobility'. That -e- is the izafat: it links two words as 'X of Y' or 'Y X'. You know it already: Koh-e-Noor (mountain of light), Sher-e-Punjab, Wazir-e-Azam."),
   u.teach("ism-e-shareef"), u.teach("pehle-aap", "The joke about two nawabs of Lucknow: each said 'pehle aap' at the train door until the train left."), u.teach("takalluf", "What the host says. The guest's job is to keep being formal anyway.")],
 "exercises": [u.scene([("nani", "b.s-nani-pehle"), ("khala", "b.s-khala-pehle"), ("nani", "b.s-nani-pehle"), ("nani", "b.s-nani-train")], "What went wrong?", ["They were so polite they missed the train", ("Khala pushed in first", "Nobody went first. That's the problem."), ("Nani forgot the tickets", "The tickets are fine. The manners were excessive.")], setup="Lahore station. The Karachi train is at the platform.", hide=True),
   u.sort("Whose house?", ["Yours (humble)", "Theirs (grand)"], [("ghareeb khana", 0), ("daulat khana", 1), ("mera chhota sa ghar", 0), ("aap ka mahal", 1)], "Never call your own home a daulat khana."),
   u.meaning("ism-e-shareef"), u.say("takalluf", "Your guest refuses a third samosa out of politeness.", ["pehle-aap", "daulat-khana"]),
   u.spot("ghareeb-khana", ("ghareeb", "غریب"), ("daulat", "دولت"), "You're inviting them to YOUR home, so it's the humble word."),
   u.type("pehle-aap", "Hold the door. Type: “After you”"), u.dictation("daulat-khana"), u.type("ism-e-shareef", "Ask their name, formally.")]})
L.append({"id": "u14-l3", "title": "Thanks and sorry, upgraded", "blurb": "Shukriya and sorry got you this far. These get you further.", "canDo": "You can thank and apologise in formal Urdu",
 "teach": [u.teach("meherbani"), u.teach("nawazish", "One word. Very elegant. Use sparingly for full effect."), u.teach("shukr-guzar"), u.teach("maazrat"), u.teach("maazrat-f"), u.teach("zehmat", "Say it on arriving, on leaving, and whenever anyone gets up to fetch anything for you."), u.teach("gustakhi-maaf", "The polite way to announce that you're about to disagree with an elder.")],
 "exercises": [u.match("meherbani", "nawazish", "zehmat", "gustakhi-maaf"),
   u.sort("Thanking or apologising?", ["Thanks", "Sorry"], [("@nawazish", 0), ("@maazrat", 1), ("@meherbani", 0), ("@zehmat", 1), ("@shukr-guzar", 0), ("@gustakhi-maaf", 1)]),
   u.gap("maazrat-f", ("chahti", "چاہتی"), [("chahta", "چاہتا"), ("chahte", "چاہتے")], "A woman is speaking: chahti hoon."),
   u.listen("shukr-guzar", True), u.say("gustakhi-maaf", "You're about to tell Nana his cricket facts are wrong.", ["nawazish", "meherbani"]),
   u.type("meherbani", "Type: “That's very kind of you”"), u.dictation("zehmat"), u.speak("nawazish")]})
L.append({"id": "u14-l4", "title": "Requests and exits", "blurb": "How to ask, how to offer, how to leave.", "canDo": "You can make a formal request, offer help and take your leave",
 "teach": [u.teach("aadaab", "The courtly greeting, with a slight bow and a hand raised to the forehead. Heard at mushairas and in old films."), u.teach("arz", "arz = a humble submission. Poets say 'arz kiya hai' before reciting."), u.teach("khidmat"), u.teach("zaroor"),
   u.teach("musarrat"), u.teach("ijazat", "You don't announce that you're leaving. You ask permission to."), u.teach("janab"), u.teach("mohtarma"), u.teach("khawateen", "The -o- means 'and', as in sher-o-shayari. Every wedding MC's first three words.")],
 "exercises": [u.say("ijazat", "It's 11pm. The host is still pouring chai. Make your exit.", ["arz", "khidmat"]), u.meaning("khidmat"),
   u.mc("The MC taps the microphone. What comes first?", ["@khawateen", ("@pehle-aap", "Only if there are two MCs."), ("@ijazat", "That's how the speech ends, not starts.")]),
   u.spot("musarrat", ("musarrat", "مسرت"), ("zehmat", "زحمت"), "zehmat is trouble. Meeting them should be a musarrat, a delight."),
   u.listen("aadaab"), u.build("khidmat"), u.type("ijazat", "Type: “I should take my leave now”"), u.dictation("zaroor"), u.type("arz", "Type: “I have a request”"), u.speak("khawateen")]})

n, y, o = u.npc, u.you, u.opt
boss = {"id": "u14-boss", "title": "Tea at Mrs. Butt's", "character": "mrs-butt",
 "blurb": "Formal drawing room. Good china. Mrs. Butt is grading your manners.",
 "scene": "Ammi has sent you to drop off a wedding card. Mrs. Butt opens the door herself. The drawing room has plastic on the sofas and a clock shaped like Pakistan.",
 "canDo": "You can get through a formal visit in polished Urdu",
 "start": "a",
 "nodes": {
  "a": n("mrs-butt", "b.butt-1", "b"),
  "b": y("Greet her properly.", [o("b.you-aadaab", "c", "great", "She did not expect 'aadaab' from someone your age. Points awarded."), o("b.you-salam", "c", "fine")], "Aadaab arz hai…"),
  "c": n("mrs-butt", "b.butt-2", "d"),
  "d": y("Accept the tea like a professional.", [o("b.you-zaroor", "e", "great"), o("b.you-takalluf", "e", "fine")], "Ji zaroor…"),
  "e": n("mrs-butt", "b.butt-3", "f"),
  "f": y("Where do you live? Careful which word you use for your own home.", [o("b.you-ghareeb", "g1", "great"), o("b.you-daulat", "g2", "bold", "You have just called your flat-share a palace.")], "Mera … khana"),
  "g1": n("mrs-butt", "b.butt-4a", "h"),
  "g2": n("mrs-butt", "b.butt-4b", "h"),
  "h": y("Time to go.", [o("b.you-ijazat", "i", "great"), o("b.you-arz", "i", "fine")], "Ab ijazat…"),
  "i": n("mrs-butt", "b.butt-end", "end"),
  "end": {"type": "end", "title": "Impeccable", "text": "You arrived, sat, sipped and left in formal Urdu. Mrs. Butt has already phoned three people to say how well brought up you are. This will have consequences.", "outcome": "polished"}}}

meta = {"track": "speaking", "stage": "advanced", "order": 14, "title": "Formal Urdu", "titleUrdu": "تکلف", "emoji": "🎩",
 "tagline": "The polite, ceremonial register: guests, elders, speeches.", "canDo": "You can switch into formal Urdu when the occasion calls for it",
 "grammar": [{"title": "Honorific verbs", "body": "Formal Urdu replaces everyday verbs for the person you're honouring: aana → tashreef lana, baithna → tashreef rakhna, kehna → farmana, khana/peena → nosh farmana. Use them for others, never for yourself."},
             {"title": "Izafat: the linking -e-", "body": "ism-e-shareef (noble name), wazir-e-azam (prime minister), dard-e-dil (pain of the heart). The -e- joins a noun to what describes or owns it. The -o- means 'and': khawateen-o-hazraat."},
             {"title": "Raise them, lower yourself", "body": "Their home: daulat khana. Yours: ghareeb khana. Their speaking: farmana. Yours: arz karna. The grammar is ordinary; the word choice carries the respect."}]}
write_unit(u, meta, L, boss)
