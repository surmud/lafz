"""Unit 4: Calls to Pakistan."""
from common import Unit, info, write_unit

u = Unit("u04")
P = u.P
P("hello-awaaz", "Hello? Awaaz aa rahi hai?", "ہیلو؟ آواز آ رہی ہے؟", "Hello? Can you hear me?", literal="is the voice coming?", register="casual", accept=["awaaz aa rahi hai", "hello awaz aa rahi hai"])
P("awaaz-nahin", "awaaz nahin aa rahi", "آواز نہیں آ رہی", "I can't hear you", literal="the voice isn't coming", accept=["awaz nahin aa rahi", "awaaz nahin aa rahi hai"])
P("line-kharab", "line kharab hai", "لائن خراب ہے", "The line's bad", register="casual")
P("awaaz-kat-rahi", "aap ki awaaz kat rahi hai", "آپ کی آواز کٹ رہی ہے", "You're breaking up", literal="your voice is cutting")
P("zor-se", "zor se boliye", "زور سے بولیے", "Speak louder, please", literal="speak with force", accept=["zor se bolein", "zor se boliye na"])
P("phir-se", "phir se boliye", "پھر سے بولیے", "Say that again, please", accept=["phir se bolein", "dobara boliye"])
P("baad-mein-call", "main baad mein call karta hoon", "میں بعد میں کال کرتا ہوں", "I'll call back later (said by a man)", register="casual", sense="callback")
P("baad-mein-call-f", "main baad mein call karti hoon", "میں بعد میں کال کرتی ہوں", "I'll call back later (said by a woman)", register="casual", sense="callback")
P("voice-note", "voice note bhej dijiye", "وائس نوٹ بھیج دیجیے", "Send a voice note, please", register="casual", note="Pakistan's national communication format. Minimum length: four minutes.", accept=["voice note bhej dein", "voice note bhejiye"])
P("kaun-bol-raha", "kaun bol raha hai?", "کون بول رہا ہے؟", "Who's speaking?")
P("ali-bol-raha", "main Ali bol raha hoon", "میں علی بول رہا ہوں", "It's Ali speaking (man)", sense="speaking")
P("sara-bol-rahi", "main Sara bol rahi hoon", "میں سارہ بول رہی ہوں", "It's Sara speaking (woman)", sense="speaking")
P("kya", "kya?", "کیا؟", "what?", sense="q")
P("kab", "kab?", "کب؟", "when?", sense="q")
P("kahan", "kahan?", "کہاں؟", "where?", sense="q")
P("kaun", "kaun?", "کون؟", "who?", sense="q")
P("kyun", "kyun?", "کیوں؟", "why?", sense="q")
P("kaise", "kaise?", "کیسے؟", "how?", sense="q")
P("aap-kahan", "aap kahan hain?", "آپ کہاں ہیں؟", "Where are you?")
P("ghar-par", "main ghar par hoon", "میں گھر پر ہوں", "I'm at home", sense="where-i-am", accept=["main ghar pe hoon"])
P("kaam-par", "main kaam par hoon", "میں کام پر ہوں", "I'm at work", sense="where-i-am", accept=["main kaam pe hoon"])
P("kya-kar-rahe", "aap kya kar rahe hain?", "آپ کیا کر رہے ہیں؟", "What are you doing?")
P("khana-bana-raha", "main khana bana raha hoon", "میں کھانا بنا رہا ہوں", "I'm cooking (man)", sense="doing")
P("khana-bana-rahi", "main khana bana rahi hoon", "میں کھانا بنا رہی ہوں", "I'm cooking (woman)", sense="doing")
P("parh-raha", "main parh raha hoon", "میں پڑھ رہا ہوں", "I'm studying (man)", sense="doing", accept=["main padh raha hoon"])
P("parh-rahi", "main parh rahi hoon", "میں پڑھ رہی ہوں", "I'm studying (woman)", sense="doing", accept=["main padh rahi hoon"])
P("kab-aa-rahe", "aap kab aa rahe hain?", "آپ کب آ رہے ہیں؟", "When are you coming?")
P("kitne-baje", "wahan kitne baje hain?", "وہاں کتنے بجے ہیں؟", "What time is it there?")
P("yahan-raat", "yahan raat hai", "یہاں رات ہے", "It's night here")
P("mausam", "wahan mausam kaisa hai?", "وہاں موسم کیسا ہے؟", "How's the weather there?")
P("sardi", "yahan bohat sardi hai", "یہاں بہت سردی ہے", "It's really cold here", sense="weather")
P("garmi", "wahan bohat garmi hai", "وہاں بہت گرمی ہے", "It's really hot there", sense="weather")
P("sab-kaise", "sab kaise hain?", "سب کیسے ہیں؟", "How is everyone?")
P("sab-ko-salaam", "sab ko salaam", "سب کو سلام", "Salaam to everyone")
P("miss-kar-raha", "hum aap ko miss kar rahe hain", "ہم آپ کو مس کر رہے ہیں", "We miss you", register="casual", note="Very common code-switch. The formal 'yaad aa rahi hai' is next to it.")
P("yaad-aa-rahi", "aap ki bohat yaad aa rahi hai", "آپ کی بہت یاد آ رہی ہے", "I miss you so much", literal="your memory is coming a lot")
# boss
P("b.hello-beta", "Hello! Hello! Beta?", "ہیلو! ہیلو! بیٹا؟", "Hello! Hello! Dear?", speaker="khala", register="casual")
P("b.ji-khala-awaaz", "Ji Khala! Awaaz aa rahi hai?", "جی خالہ! آواز آ رہی ہے؟", "Yes Khala! Can you hear me?", register="casual", accept=["ji khala awaaz aa rahi hai", "awaaz aa rahi hai"])
P("b.huh", "Haan? Kya? Zor se bolo!", "ہاں؟ کیا؟ زور سے بولو!", "Huh? What? Speak up!", speaker="khala")
P("b.zor-se", "KHALA! AWAAZ AA RAHI HAI?", "خالہ! آواز آ رہی ہے؟", "KHALA! CAN YOU HEAR ME?", accept=["khala awaaz aa rahi hai"])
P("b.line-kharab-khala", "Khala, line kharab hai", "خالہ، لائن خراب ہے", "Khala, the line's bad", register="casual", accept=["line kharab hai", "khala line kharab hai"])
P("b.ab-aa-rahi", "Haan, ab aa rahi hai! Kya kar rahe ho?", "ہاں، اب آ رہی ہے! کیا کر رہے ہو؟", "Yes, now I can hear! What are you doing?", speaker="khala")
P("b.so-raha", "Main so raha tha, Khala. Yahan subah ke chhe baje hain", "میں سو رہا تھا خالہ۔ یہاں صبح کے چھے بجے ہیں", "I was asleep, Khala. It's 6am here", register="casual", accept=["main so raha tha", "yahan subah ke chhe baje hain"])
P("b.kaam-par", "Main kaam par hoon, Khala", "میں کام پر ہوں خالہ", "I'm at work, Khala", accept=["main kaam par hoon"])
P("b.chhe-baje", "Chhe baje? Main to fajr se uthi hui hoon!", "چھے بجے؟ میں تو فجر سے اٹھی ہوئی ہوں!", "Six? I've been up since dawn prayers!", speaker="khala")
P("b.rishta", "Achha suno, ek rishta aaya hai…", "اچھا سنو، ایک رشتہ آیا ہے…", "Okay listen, a marriage proposal has come…", speaker="khala")
P("b.awaaz-kat", "Khala, aap ki awaaz kat rahi hai…", "خالہ، آپ کی آواز کٹ رہی ہے…", "Khala, you're breaking up…", accept=["aap ki awaaz kat rahi hai", "awaaz kat rahi hai"])
P("b.kaun-hai", "Achha? Kaun hai?", "اچھا؟ کون ہے؟", "Oh? Who is it?", accept=["kaun hai", "achha kaun hai"])
P("b.voice-note-bhejti", "Main voice note bhejti hoon. Lamba wala!", "میں وائس نوٹ بھیجتی ہوں۔ لمبا والا!", "I'll send a voice note. A long one!", speaker="khala", register="casual")
P("b.mrs-butt-ki-bhanji", "Mrs. Butt ki bhanji. Doctor hai!", "مسز بٹ کی بھانجی۔ ڈاکٹر ہے!", "Mrs. Butt's niece. She's a doctor!", speaker="khala", register="casual")
P("b.baad-mein", "Khala, main baad mein call karta hoon", "خالہ، میں بعد میں کال کرتا ہوں", "Khala, I'll call you back later", register="casual", accept=["main baad mein call karta hoon", "main baad mein call karti hoon", "baad mein call karta hoon"])
P("b.sab-ko-salaam", "Ji Khala. Sab ko salaam!", "جی خالہ۔ سب کو سلام!", "Yes Khala. Salaam to everyone!", accept=["sab ko salaam", "ji khala sab ko salaam"])
P("b.allah-hafiz", "Achha beta, Allah hafiz. Sardi mein jacket pehnna!", "اچھا بیٹا، اللہ حافظ۔ سردی میں جیکٹ پہننا!", "Okay dear, bye. Wear a jacket in the cold!", speaker="khala", register="casual")

L = []
L.append({"id": "u04-l1", "title": "Awaaz aa rahi hai?", "blurb": "Every call to Pakistan starts with the same 30 seconds.",
 "canDo": "You can handle a bad phone line in Urdu",
 "teach": [u.teach("hello-awaaz", "The opening line of every international call since 1987."), u.teach("awaaz-nahin"), u.teach("line-kharab", "Code-switch alert: 'line' is English, and everyone says it."), u.teach("awaaz-kat-rahi"), u.teach("zor-se", "Respectful '-iye' ending. To a cousin: 'zor se bolo'."), u.teach("phir-se")],
 "exercises": [u.meaning("awaaz-kat-rahi"), u.say("hello-awaaz", "The call connects. Nothing but static. What do you say?", ["line-kharab", "phir-se"]), u.listen("awaaz-nahin", True), u.match("hello-awaaz", "line-kharab", "zor-se", "phir-se"), u.build("awaaz-kat-rahi", extra=[("ka", "کا")]), u.type("phir-se", "Nani said something you missed. Ask her to say it again, politely."), u.type("line-kharab", "Type: “The line's bad”"), u.speak("hello-awaaz")]})
L.append({"id": "u04-l2", "title": "Kaun bol raha hai?", "blurb": "Who's calling, and the six question words you'll use forever.",
 "canDo": "You can say who's calling and ask kya, kab, kahan, kaun, kyun, kaise",
 "teach": [u.teach("kaun-bol-raha"), u.teach("ali-bol-raha", "Men say 'raha'…"), u.teach("sara-bol-rahi", "…women say 'rahi'. The verb tells everyone your gender."),
           info("Six question words", "kya (what), kab (when), kahan (where), kaun (who), kyun (why), kaise (how). They mostly start with k, like English 'wh-' words.", examples=["u04.kya", "u04.kab", "u04.kahan", "u04.kaun", "u04.kyun", "u04.kaise"])],
 "exercises": [u.match("kya", "kab", "kahan", "kaun"), u.match("kyun", "kaise", "kab", "kahan"), u.say("ali-bol-raha", "You're Ali. Khala picks up and asks who's speaking.", ["sara-bol-rahi", "kaun-bol-raha"]),
   u.gap("sara-bol-rahi", ("rahi", "رہی"), [("raha", "رہا"), ("rahe", "رہے")], "Sara is a woman → rahi"), u.listen("kaun-bol-raha", True), u.type("kab", "Type: “when?”"), u.type("kahan", "Type: “where?”"),
   u.mc("“Kaun” means…", ["who", ("why", "That's kyun."), ("where", "That's kahan.")], show="kaun")]})
L.append({"id": "u04-l3", "title": "Kya kar rahe ho?", "blurb": "Present continuous: what you're doing right now.",
 "canDo": "You can say where you are and what you're doing",
 "teach": [info("-raha hoon = I'm …ing", "Verb stem + raha/rahi/rahe + hoon/hai/hain. 'Main khana bana raha hoon' = I'm making food. Raha for a man, rahi for a woman, rahe for aap or plural.", examples=["u04.khana-bana-raha", "u04.khana-bana-rahi"]),
           u.teach("kya-kar-rahe", "With aap, it's always 'rahe hain'."), u.teach("aap-kahan"), u.teach("ghar-par"), u.teach("kaam-par"), u.teach("parh-raha", "Parhna = to study / read. Every parent's favourite verb.")],
 "exercises": [u.meaning("kya-kar-rahe"), u.gap("khana-bana-rahi", ("rahi", "رہی"), [("raha", "رہا"), ("rahe", "رہے")], "a woman speaking → rahi"),
   u.gap("parh-raha", ("hoon", "ہوں"), [("hai", "ہے"), ("hain", "ہیں")], "main … hoon"), u.say("kaam-par", "Ammi calls during a meeting. Tell her you're at work.", ["ghar-par", "parh-raha"]),
   u.build("kya-kar-rahe", extra=[("ho", "ہو")]), u.listen("ghar-par"), u.type("parh-raha", "Abbu asks what you're doing. (You're a guy, and you're 'studying'.)"), u.type("aap-kahan", "Type: “Where are you?” (respectfully)")]})
L.append({"id": "u04-l4", "title": "Wahan, yahan", "blurb": "Time zones, weather and missing each other.",
 "canDo": "You can chat about time and weather across continents",
 "teach": [u.teach("kitne-baje", "Asked at the start of every call. Answered wrong every time."), u.teach("yahan-raat", "Yahan = here, wahan = there."), u.teach("mausam"), u.teach("sardi"), u.teach("garmi"), u.teach("yaad-aa-rahi", "The lovely, proper way."), u.teach("miss-kar-raha", "The way most people actually say it.")],
 "exercises": [u.match("yahan-raat", "sardi", "garmi", "mausam"), u.say("sardi", "Khala asks about the weather. It's freezing where you are.", ["garmi", "yahan-raat"]), u.listen("kitne-baje", True),
   u.gap("sardi", ("yahan", "یہاں"), [("wahan", "وہاں"), ("kahan", "کہاں")], "yahan = here"), u.meaning("yaad-aa-rahi"), u.type("mausam", "Ask Nani: “How's the weather there?”"), u.build("yaad-aa-rahi"), u.type("yahan-raat", "Type: “It's night here”")]})
L.append({"id": "u04-l5", "title": "Voice notes & goodbyes", "blurb": "End the call before it ends you.",
 "canDo": "You can wrap up a family call and promise to call back",
 "teach": [u.teach("sab-kaise"), u.teach("sab-ko-salaam", "Mandatory. Calls cannot legally end without it."), u.teach("baad-mein-call", "A man says 'karta hoon'…"), u.teach("baad-mein-call-f", "…a woman says 'karti hoon'."), u.teach("voice-note"), u.teach("kab-aa-rahe", "Asked on every call. 'Inshallah' is a valid answer.")],
 "exercises": [u.say("sab-ko-salaam", "You're ending a call with Nani. Send love to the whole household.", ["sab-kaise", "voice-note"]), u.meaning("kab-aa-rahe"), u.listen("voice-note"),
   u.gap("baad-mein-call-f", ("karti", "کرتی"), [("karta", "کرتا"), ("karte", "کرتے")], "a woman speaking → karti"), u.type("sab-kaise", "Type: “How is everyone?”"),
   u.mc("Khala: “Kab aa rahe ho?” The honest answer is ‘no idea’. You say:", ["@u01.inshallah", ("@u04.kab", "Answering a question with a question. Bold.")]), u.type("baad-mein-call", "You're a guy on the bus. Tell Khala you'll call back later."), u.speak("sab-ko-salaam")]})

n, y, o = u.npc, u.you, u.opt
boss = {"id": "u04-boss", "title": "The 6am Call", "character": "khala",
 "blurb": "Shabnam Khala calls from Lahore. It's 6am for you. The line is terrible. She has news.",
 "scene": "Your phone buzzes on the nightstand. 6:02am. 'Shabnam Khala (Lahore)'. You know you can't decline: she'll just call Ammi, and Ammi will call you.",
 "canDo": "You can get through a crackly phone call with family in Pakistan",
 "start": "a",
 "nodes": {
  "a": n("khala", "b.hello-beta", "b"),
  "b": y("Answer and check she can hear you.", [o("b.ji-khala-awaaz", "c", "great"), o("b.line-kharab-khala", "c", "fine")], "Ji Khala! Awaaz…"),
  "c": n("khala", "b.huh", "d"),
  "d": y("She can't hear you. Speak up!", [o("b.zor-se", "e", "great", "Your neighbour bangs on the wall. Worth it."), o("b.line-kharab-khala", "e", "fine")], "zor se…"),
  "e": n("khala", "b.ab-aa-rahi", "f"),
  "f": y("Tell her what you're doing (or were doing).", [o("b.so-raha", "g", "bold", "Passive-aggressive time-zone reminder. She does not take the hint."), o("b.kaam-par", "h", "fine", "Lying at 6am. Bold, but okay.")], "Main so raha…"),
  "g": n("khala", "b.chhe-baje", "h"),
  "h": n("khala", "b.rishta", "i"),
  "i": y("A rishta. At 6am. Choose your move.", [o("b.awaaz-kat", "j", "bold", "Classic. The fake bad line. Every desi kid's secret weapon."), o("b.kaun-hai", "k", "fine", "You asked. You have only yourself to blame.")], "Khala, aap ki awaaz…"),
  "j": n("khala", "b.voice-note-bhejti", "l"),
  "k": n("khala", "b.mrs-butt-ki-bhanji", "l"),
  "l": y("Wrap it up.", [o("b.baad-mein", "m", "great"), o("b.sab-ko-salaam", "m", "great")], "main baad mein call…"),
  "m": n("khala", "b.allah-hafiz", "end"),
  "end": {"type": "end", "title": "Call survived", "text": "You handled a bad line, a time-zone ambush and a surprise rishta, all in Urdu, before sunrise. A 7-minute voice note is already downloading.", "outcome": "survived"}}}

meta = {"track": "speaking", "order": 4, "title": "Phone Calls", "titleUrdu": "پاکستان فون", "emoji": "📞",
 "tagline": "Phone calls: bad lines, questions, what you're doing, and saying goodbye.", "canDo": "You can hold a whole phone call with family in Pakistan",
 "grammar": [{"title": "Question words", "body": "kya (what), kab (when), kahan (where), kaun (who), kyun (why), kaise (how). They usually sit right before the verb: 'aap kahan hain?' 'aap kab aa rahe hain?' Kya at the very start turns a sentence into a yes/no question."},
             {"title": "Present continuous: -raha hoon", "body": "Stem + raha/rahi/rahe + hoon/ho/hai/hain. main parh raha hoon (I'm studying, man), main parh rahi hoon (woman), aap kya kar rahe hain? (respectful). In speech the final hai is often dropped: 'awaaz nahin aa rahi'."}]}
write_unit(u, meta, L, boss)
