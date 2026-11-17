"""Unit 5: Numbers, Time & Money."""
from common import Unit, info, write_unit

u = Unit("u05")
P = u.P
nums = [("ek", "ایک", "1"), ("do", "دو", "2"), ("teen", "تین", "3"), ("chaar", "چار", "4"), ("paanch", "پانچ", "5"), ("chhe", "چھ", "6"),
        ("saat", "سات", "7"), ("aath", "آٹھ", "8"), ("nau", "نو", "9"), ("das", "دس", "10"), ("bees", "بیس", "20"), ("tees", "تیس", "30"),
        ("chaalees", "چالیس", "40"), ("pachaas", "پچاس", "50"), ("sau", "سو", "100"), ("hazaar", "ہزار", "1,000")]
for r, ur, en in nums:
    P("n-" + r, r, ur, en, sense="n-" + r, accept={"chaar": ["char"], "paanch": ["panch"], "chhe": ["che", "chay", "chhay"], "aath": ["ath"], "chaalees": ["chalees", "chalis"], "pachaas": ["pachas"], "hazaar": ["hazar"]}.get(r, []))
P("kitne-ka", "kitne ka hai?", "کتنے کا ہے؟", "How much is it?", sense="price-q")
P("kitne-paise", "kitne paise?", "کتنے پیسے؟", "How much money?", sense="price-q")
P("sau-rupay", "sau rupay", "سو روپے", "100 rupees", accept=["sau rupaye", "sau rupee"])
P("mehnga", "bohat mehnga hai", "بہت مہنگا ہے", "That's too expensive", sense="pricey", accept=["bohat mehenga hai", "bohot mehnga hai"])
P("sasta", "yeh sasta hai", "یہ سستا ہے", "This is cheap", sense="cheap")
P("kitne-ka-liya", "kitne ka liya?", "کتنے کا لیا؟", "How much did you pay for it?", note="The desi national pastime. Ask anyone about anything they own.", sense="price-q")
P("kitne-baje-hain", "kitne baje hain?", "کتنے بجے ہیں؟", "What time is it?")
P("teen-baje", "teen baje", "تین بجے", "3 o'clock", sense="time")
P("saare-teen", "saare teen baje", "ساڑھے تین بجے", "half past three", note="saare = and a half. Saare teen = 3½ = 3:30.", sense="time", accept=["sade teen baje", "saade teen baje"])
P("sawa-teen", "sawa teen baje", "سوا تین بجے", "quarter past three", note="sawa = and a quarter.", sense="time")
P("paune-chaar", "paune chaar baje", "پونے چار بجے", "quarter to four", note="paune = a quarter less than. Paune chaar = 3¾.", sense="time", accept=["paune char baje"])
P("umar", "aap ki umar kya hai?", "آپ کی عمر کیا ہے؟", "How old are you?", literal="what is your age?")
P("bees-saal", "meri umar bees saal hai", "میری عمر بیس سال ہے", "I'm 20", literal="my age is twenty years")
P("aaj", "aaj", "آج", "today")
P("kal", "kal", "کل", "yesterday OR tomorrow", note="Same word. The verb tense tells you which. Yes, really.")
P("parson", "parson", "پرسوں", "the day after tomorrow (or before yesterday)")
P("subah", "subah", "صبح", "morning")
P("dopahar", "dopahar", "دوپہر", "afternoon", accept=["dopehar"])
P("shaam", "shaam", "شام", "evening")
P("raat", "raat", "رات", "night")
P("hafta", "hafta", "ہفتہ", "week (also: Saturday)")
P("mahina", "mahina", "مہینہ", "month")
P("saal", "saal", "سال", "year")
P("der-ho-gayi", "der ho gayi", "دیر ہو گئی", "It's late / I'm late", literal="lateness has happened")
P("paanch-minute", "bas paanch minute mein", "بس پانچ منٹ میں", "In just five minutes", register="casual", note="In desi time, this means 45 minutes. Plan accordingly.")
P("kab-tak", "aap kab tak aayenge?", "آپ کب تک آئیں گے؟", "By when will you come?")
P("das-baje-tak", "das baje tak", "دس بجے تک", "by 10 o'clock")
# boss
P("b.yeh-joote", "Yeh naye joote hain? Kitne ka liya?", "یہ نئے جوتے ہیں؟ کتنے کا لیا؟", "Are those new shoes? How much did you pay?", speaker="nani")
P("b.paanch-hazaar", "Paanch hazaar rupay, Nani", "پانچ ہزار روپے نانی", "Five thousand rupees, Nani", accept=["paanch hazaar rupay", "paanch hazaar"])
P("b.sasta-tha", "Bohat sasta tha, Nani", "بہت سستا تھا نانی", "It was really cheap, Nani", accept=["bohat sasta tha"])
P("b.paanch-hazaar-react", "Paanch hazaar?! Hamare zamane mein das rupay ke aate the!", "پانچ ہزار؟! ہمارے زمانے میں دس روپے کے آتے تھے!", "Five thousand?! In my day they cost ten rupees!", speaker="nani")
P("b.sasta-react", "Achha… Sasta? Phir mere liye bhi le aana", "اچھا… سستا؟ پھر میرے لیے بھی لے آنا", "Oh… cheap? Then get me a pair too", speaker="nani")
P("b.umar", "Aur tumhari umar kya hai ab?", "اور تمہاری عمر کیا ہے اب؟", "And how old are you now?", speaker="nani")
P("b.pachees", "Nani, main pachees saal ka hoon", "نانی، میں پچیس سال کا ہوں", "Nani, I'm 25", accept=["main pachees saal ka hoon", "main pachees saal ki hoon", "pachees saal"])
P("b.aap-ko-pata", "Aap ko pata hai, Nani!", "آپ کو پتا ہے نانی!", "You know already, Nani!", accept=["aap ko pata hai"])
P("b.pachees-react", "Pachees! Teri Ammi ki is umar mein shaadi ho gayi thi", "پچیس! تیری امی کی اس عمر میں شادی ہو گئی تھی", "Twenty-five! Your mum was married at your age", speaker="nani")
P("b.kab-aaoge", "Achha, aaj kitne baje wapas aaoge?", "اچھا، آج کتنے بجے واپس آؤ گے؟", "Right, what time will you be back today?", speaker="nani")
P("b.das-baje", "Das baje tak, Nani", "دس بجے تک نانی", "By ten, Nani", accept=["das baje tak"])
P("b.paanch-minute", "Bas paanch minute mein!", "بس پانچ منٹ میں!", "In just five minutes!", register="casual", accept=["paanch minute mein"])
P("b.das-react", "Das baje. Das. Gyarah nahin", "دس بجے۔ دس۔ گیارہ نہیں", "Ten. TEN. Not eleven", speaker="nani")
P("b.paanch-react", "Paanch minute… Tumhare paanch minute mujhe pata hain", "پانچ منٹ… تمہارے پانچ منٹ مجھے پتا ہیں", "Five minutes… I know your five minutes", speaker="nani")
P("b.ji-nani", "Ji, Nani", "جی نانی", "Yes, Nani", accept=["ji nani", "ji"])

S = lambda *k: u.i(*k)
L = []
L.append({"id": "u05-l1", "title": "Ek, do, teen", "blurb": "1 to 10. The building blocks of every bargain.", "canDo": "You can count to ten",
 "teach": [info("Counting", "Urdu numbers are old friends of Hindi ones: ek, do, teen… Learn 1–10 now; bigger numbers come next."), *[u.teach("n-" + r) for r, _, _ in nums[:10]]],
 "exercises": [u.match("n-ek", "n-do", "n-teen", "n-chaar"), u.match("n-paanch", "n-chhe", "n-saat", "n-aath"), u.listen("n-teen"), u.listen("n-saat", True), u.type("n-paanch", "Type: 5"), u.type("n-das", "Type: 10"),
   u.mc("“Do” means…", ["2", ("Do (the English verb)", "Not even close. It's a number."), "10"], show="n-do"), u.match("n-nau", "n-das", "n-ek", "n-chhe"), u.type("n-aath", "Type: 8")]})
L.append({"id": "u05-l2", "title": "Bees, pachaas, sau", "blurb": "The round numbers (and why 1–100 is a vocabulary list).", "canDo": "You can say round numbers up to a thousand",
 "teach": [info("Every number is its own word", "In Urdu, 21–99 are not 'twenty-one' built from parts. Each is its own word (ikkees, baees, teyees…). Native speakers often switch to English for big numbers. Start with the round ones."), *[u.teach("n-" + r) for r, _, _ in nums[10:]]],
 "exercises": [u.match("n-bees", "n-tees", "n-chaalees", "n-pachaas"), u.match("n-sau", "n-hazaar", "n-das", "n-bees"), u.listen("n-pachaas"), u.type("n-sau", "Type: 100"), u.type("n-hazaar", "Type: 1,000"),
   u.mc("Khala says the shalwar kameez cost “do hazaar”. How much?", ["2,000", ("200", "Do sau would be 200."), ("20", "That would be bees.")]), u.listen("sau-rupay", True), u.type("sau-rupay", "Type: “100 rupees”")]})
L.append({"id": "u05-l3", "title": "Kitne ka hai?", "blurb": "Prices, gasping at prices, and asking everyone what they paid.", "canDo": "You can ask prices and react to them",
 "teach": [u.teach("kitne-ka", "The shopping essential."), u.teach("mehnga", "Say it with feeling. Even if it isn't."), u.teach("sasta"), u.teach("kitne-ka-liya"), u.teach("kitne-paise")],
 "exercises": [u.meaning("kitne-ka"), u.say("mehnga", "The shopkeeper names a price. Act shocked.", ["sasta", "kitne-ka"]), u.listen("kitne-ka-liya", True), u.build("mehnga", extra=[("sasta", "سستا")]),
   u.type("kitne-ka", "Ask: “How much is it?”"), u.mc("Your aunt sees your new phone. What's her first question?", ["@kitne-ka-liya", ("@kitne-baje-hain", "Time? No. Price. Always price.")]), u.type("mehnga", "Type: “That's too expensive”"), u.speak("kitne-ka")]})
L.append({"id": "u05-l4", "title": "Kitne baje?", "blurb": "Telling time the desi way: saare, sawa, paune.", "canDo": "You can tell and ask the time, including half and quarter past",
 "teach": [u.teach("kitne-baje-hain"), u.teach("teen-baje", "baje = o'clock. Teen baje = 3:00."), u.teach("saare-teen"), u.teach("sawa-teen"), u.teach("paune-chaar"),
   info("Special halves", "Two times have their own words: derh (1:30) and dhai (2:30). After that it's regular: saare teen, saare chaar…")],
 "exercises": [u.mc("“Saare teen baje” is…", ["3:30", ("3:15", "That's sawa teen."), ("2:45", "That's paune teen.")], show="saare-teen"), u.mc("“Sawa teen baje” is…", ["3:15", ("3:30", "That's saare teen."), ("3:45", "That's paune chaar.")], show="sawa-teen"),
   u.mc("“Paune chaar baje” is…", ["3:45", ("4:15", "That's sawa chaar."), ("4:45", "That's paune paanch.")], show="paune-chaar"), u.listen("kitne-baje-hain"), u.type("teen-baje", "Type: “3 o'clock”"), u.type("kitne-baje-hain", "Ask: “What time is it?”"),
   u.match("teen-baje", "saare-teen", "sawa-teen", "paune-chaar")]})
L.append({"id": "u05-l5", "title": "Aaj, kal, parson", "blurb": "Days, ages, and the five-minute lie.", "canDo": "You can talk about when things happen and say your age",
 "teach": [u.teach("aaj"), u.teach("kal", "Kal = yesterday AND tomorrow. Context does the rest."), u.teach("parson"), u.teach("subah"), u.teach("shaam"), u.teach("umar"), u.teach("bees-saal", "Swap in your own age."), u.teach("paanch-minute"), u.teach("der-ho-gayi")],
 "exercises": [u.match("subah", "dopahar", "shaam", "raat"), u.match("hafta", "mahina", "saal", "aaj"),
   u.mc("“Main kal aaunga” (I will come). Kal means…", ["tomorrow", ("yesterday", "The verb is future (aaunga), so it's tomorrow.")]), u.meaning("umar"), u.type("bees-saal", "Say you're 20: “My age is twenty years”"),
   u.mc("Your cousin says “Bas paanch minute mein!” When will they arrive?", [("In about 45 minutes", "Correct. Desi Standard Time."), ("In five minutes", "Sweet summer child.")]), u.type("der-ho-gayi", "Type: “It's late”"), u.listen("kab-tak", True), u.speak("der-ho-gayi")]})

n, y, o = u.npc, u.you, u.opt
boss = {"id": "u05-boss", "title": "Nani's Price Check", "character": "nani",
 "blurb": "Nani spots your new shoes. Then asks your age. Then your curfew. Numbers under pressure.",
 "scene": "You're putting on new shoes by the front door when you feel a presence behind you. Nani has seen the shoes. Nani has questions.",
 "canDo": "You can answer questions about prices, your age and times without panicking",
 "start": "a",
 "nodes": {
  "a": n("nani", "b.yeh-joote", "b"),
  "b": y("Tell her the price. Or lie.", [o("b.paanch-hazaar", "c1", "great", "Honesty. Brave."), o("b.sasta-tha", "c2", "bold")], "Paanch hazaar…"),
  "c1": n("nani", "b.paanch-hazaar-react", "d"),
  "c2": n("nani", "b.sasta-react", "d"),
  "d": n("nani", "b.umar", "e"),
  "e": y("Tell her your age. (She knows. She was there.)", [o("b.pachees", "f", "great"), o("b.aap-ko-pata", "f", "bold", "Answering an elder's question with sass. She lets it go, because she's about to win.")], "Main pachees saal…"),
  "f": n("nani", "b.pachees-react", "g"),
  "g": n("nani", "b.kab-aaoge", "h"),
  "h": y("Give her a time.", [o("b.das-baje", "i1", "great"), o("b.paanch-minute", "i2", "bold", "You used the five-minute lie on the woman who invented it.")], "Das baje tak…"),
  "i1": n("nani", "b.das-react", "j"),
  "i2": n("nani", "b.paanch-react", "j"),
  "j": y("Accept your fate.", [o("b.ji-nani", "end", "great"), o("u01.achha", "end", "fine")], "Ji, Nani"),
  "end": {"type": "end", "title": "Price check passed", "text": "Prices, ages, times: all answered in Urdu, under Nani's gaze. You're home by ten. (You're home by eleven.)", "outcome": "survived"}}}

meta = {"track": "speaking", "order": 5, "title": "Numbers, Time & Money", "titleUrdu": "گنتی، وقت اور پیسے", "emoji": "🔢",
 "tagline": "Numbers, prices, telling the time, days and age.", "canDo": "You can handle prices, times, dates and your age",
 "grammar": [{"title": "Numbers", "body": "1–10: ek, do, teen, chaar, paanch, chhe, saat, aath, nau, das. Round numbers: bees (20), tees (30), chaalees (40), pachaas (50), sau (100), hazaar (1,000). 11–99 are each their own word; learn them as you need them."},
             {"title": "Telling time", "body": "X baje = X o'clock. sawa X = X:15, saare X = X:30, paune X = (X−1):45. Two special halves: derh (1:30) and dhai (2:30)."},
             {"title": "kal", "body": "kal means both yesterday and tomorrow, and parson both the day before yesterday and the day after tomorrow. The verb's tense tells you which."}]}
write_unit(u, meta, L, boss)
