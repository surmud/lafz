"""Unit 8: Body, Health & Nazar."""
from common import Unit, info, write_unit

u = Unit("u08")
P = u.P
P("beemar", "main beemar hoon", "میں بیمار ہوں", "I'm sick", sense="sick", accept=["main bimar hoon"])
P("bukhaar", "mujhe bukhaar hai", "مجھے بخار ہے", "I have a fever", sense="sick", accept=["mujhe bukhar hai"])
P("sar-dard", "mere sar mein dard hai", "میرے سر میں درد ہے", "I have a headache", literal="there's pain in my head", sense="pain")
P("pait-dard", "mere pait mein dard hai", "میرے پیٹ میں درد ہے", "I have a stomach ache", sense="pain", accept=["mere pet mein dard hai"])
P("thak-gaya", "main thak gaya hoon", "میں تھک گیا ہوں", "I'm tired (man)", sense="tired")
P("thak-gayi", "main thak gayi hoon", "میں تھک گئی ہوں", "I'm tired (woman)", sense="tired")
P("neend", "mujhe neend aa rahi hai", "مجھے نیند آ رہی ہے", "I'm sleepy", literal="sleep is coming to me", sense="tired")
P("bhook", "mujhe bhook lagi hai", "مجھے بھوک لگی ہے", "I'm hungry", literal="hunger has struck me", sense="hunger", accept=["mujhe bhuk lagi hai"])
P("pyaas", "mujhe pyaas lagi hai", "مجھے پیاس لگی ہے", "I'm thirsty", sense="thirst", accept=["mujhe pyas lagi hai"])
P("sardi-lag", "mujhe sardi lag rahi hai", "مجھے سردی لگ رہی ہے", "I feel cold", sense="cold")
P("kaisa-lag", "aap ko kaisa lag raha hai?", "آپ کو کیسا لگ رہا ہے؟", "How are you feeling?")
P("achha-lag", "mujhe achha lag raha hai", "مجھے اچھا لگ رہا ہے", "I'm feeling good")
P("nazar", "nazar lag gayi", "نظر لگ گئی", "Someone's put the evil eye on you", note="Any illness, bad luck or broken phone after a compliment = nazar. Cure: Ammi waves red chillies around your head and burns them.")
P("mashallah", "Mashallah", "ماشاء اللہ", "God has willed it (said with a compliment, to ward off nazar)", accept=["masha allah", "mashaallah"])
P("haldi-doodh", "haldi wala doodh", "ہلدی والا دودھ", "turmeric milk", note="Cures everything. Everything.")
P("dawai-li", "dawai li?", "دوائی لی؟", "Did you take your medicine?", accept=["dawa li", "dawai li"])
P("theek-ho-jaunga", "main theek ho jaunga", "میں ٹھیک ہو جاؤں گا", "I'll be fine (man)", accept=["theek ho jaunga"])
P("urdu-bol-sakta", "main Urdu bol sakta hoon", "میں اردو بول سکتا ہوں", "I can speak Urdu (man)", sense="can")
P("urdu-bol-sakti", "main Urdu bol sakti hoon", "میں اردو بول سکتی ہوں", "I can speak Urdu (woman)", sense="can")
P("nahin-kha-sakta", "main aur nahin kha sakta", "میں اور نہیں کھا سکتا", "I can't eat any more (man)")
P("ja-sakta", "kya main ja sakta hoon?", "کیا میں جا سکتا ہوں؟", "May I go? (man)", accept=["kya mai ja sakta hoon"])
P("mote", "tum mote ho gaye ho!", "تم موٹے ہو گئے ہو!", "You've put on weight!", register="casual", note="A greeting. Not an insult. (It's a bit of an insult.)")
P("patle", "tum kitne patle ho gaye ho!", "تم کتنے پتلے ہو گئے ہو!", "You've got so thin!", register="casual", note="Said by the same aunty, to the same person, one year later.")
P("sehat", "sehat ka khayal rakho", "صحت کا خیال رکھو", "Look after your health")
# boss
P("b.kya-hua", "Kya hua? Chehra utra hua hai", "کیا ہوا؟ چہرہ اترا ہوا ہے", "What's wrong? Your face looks drained", speaker="ammi")
P("b.bukhaar", "Ammi, mujhe bukhaar hai", "امی، مجھے بخار ہے", "Mum, I've got a fever", accept=["mujhe bukhaar hai", "ammi mujhe bukhar hai"])
P("b.sar-dard", "Mere sar mein bohat dard hai", "میرے سر میں بہت درد ہے", "My head really hurts", accept=["mere sar mein dard hai"])
P("b.nazar", "Nazar lag gayi hai! Kal Mrs. Butt ne tumhari tareef ki thi", "نظر لگ گئی ہے! کل مسز بٹ نے تمہاری تعریف کی تھی", "It's nazar! Mrs. Butt complimented you yesterday", speaker="ammi", register="casual")
P("b.virus", "Ammi, yeh nazar nahin, virus hai", "امی، یہ نظر نہیں، وائرس ہے", "Mum, it's not nazar, it's a virus", register="casual", accept=["yeh nazar nahin virus hai"])
P("b.ji-ammi", "Ji Ammi, shayad", "جی امی، شاید", "Yes Mum, maybe", accept=["ji ammi shayad", "shayad"])
P("b.mirchein", "Chalo, pehle mirchein waarti hoon. Phir haldi wala doodh", "چلو، پہلے مرچیں وارتی ہوں۔ پھر ہلدی والا دودھ", "Right, first I'll do the chillies. Then turmeric milk", speaker="ammi")
P("b.virus-react", "Virus bhi nazar se hi aata hai. Haldi wala doodh piyo", "وائرس بھی نظر سے ہی آتا ہے۔ ہلدی والا دودھ پیو", "Viruses come from nazar too. Drink your turmeric milk", speaker="ammi", register="casual")
P("b.doodh-ok", "Theek hai, Ammi. Shukriya", "ٹھیک ہے امی۔ شکریہ", "Okay, Mum. Thank you", accept=["theek hai ammi", "theek hai ammi shukriya"])
P("b.doodh-no", "Ammi, mujhe haldi pasand nahin", "امی، مجھے ہلدی پسند نہیں", "Mum, I don't like turmeric", accept=["mujhe haldi pasand nahin"])
P("b.bilal-call", "Main Bilal ko phone karti hoon. Woh doctor hai", "میں بلال کو فون کرتی ہوں۔ وہ ڈاکٹر ہے", "I'm calling Bilal. He's a doctor", speaker="ammi", register="casual")
P("b.bilal-says", "Bilal keh raha hai: aaram karo, paani piyo", "بلال کہہ رہا ہے: آرام کرو، پانی پیو", "Bilal says: rest, drink water", speaker="ammi")
P("b.theek-ho-jaunga", "Ji Ammi, main theek ho jaunga", "جی امی، میں ٹھیک ہو جاؤں گا", "Yes Mum, I'll be fine", accept=["main theek ho jaunga", "main theek ho jaungi"])
P("b.wahi-kaha", "Main ne bhi yahi kaha tha!", "میں نے بھی یہی کہا تھا!", "That's what I said!", accept=["main ne bhi yahi kaha tha"])
P("b.sehat", "Mashallah, mera bachcha. Ab aaram karo", "ماشاء اللہ، میرا بچہ۔ اب آرام کرو", "Mashallah, my baby. Now rest", speaker="ammi")

L = []
L.append({"id": "u08-l1", "title": "Main beemar hoon", "blurb": "Say what hurts. (Ammi will diagnose nazar anyway.)", "canDo": "You can say you're ill and describe what hurts",
 "teach": [u.teach("beemar"), u.teach("bukhaar"), info("Pain lives IN things", "'I have a headache' is 'mere sar mein dard hai': there is pain in my head. Swap the body part: pait (stomach), kamar (back), daant (tooth)."), u.teach("sar-dard"), u.teach("pait-dard"), u.teach("dawai-li", "Ammi will ask this hourly.")],
 "exercises": [u.meaning("bukhaar"), u.say("sar-dard", "Your head is pounding. Tell Ammi.", ["pait-dard", "bukhaar"]), u.listen("pait-dard", True), u.build("sar-dard", extra=[("meri", "میری")]), u.type("beemar", "Type: “I'm sick”"), u.type("bukhaar", "Type: “I have a fever”"), u.meaning("dawai-li")]})
L.append({"id": "u08-l2", "title": "Bhook lagi hai", "blurb": "Hungry, thirsty, cold, sleepy: feelings happen TO you in Urdu.", "canDo": "You can say you're hungry, thirsty, tired, sleepy or cold",
 "teach": [info("Feelings 'strike' you", "In Urdu you don't 'be' hungry, hunger strikes you: mujhe bhook lagi hai. Same with thirst (pyaas), cold (sardi), and liking (achha lagna)."), u.teach("bhook"), u.teach("pyaas"), u.teach("sardi-lag"), u.teach("neend"), u.teach("thak-gaya"), u.teach("thak-gayi")],
 "exercises": [u.match("bhook", "pyaas", "neend", "sardi-lag"), u.say("bhook", "Dinner is late. Complain (politely).", ["pyaas", "neend"]), u.gap("thak-gayi", ("gayi", "گئی"), [("gaya", "گیا"), ("gaye", "گئے")], "a woman speaking → gayi"),
   u.listen("neend", True), u.type("pyaas", "Type: “I'm thirsty”"), u.type("bhook", "Type: “I'm hungry”"), u.speak("bhook")]})
L.append({"id": "u08-l3", "title": "Nazar & haldi", "blurb": "The desi medical system: evil eye, turmeric milk, and Mashallah.", "canDo": "You can talk about nazar and desi remedies (and say Mashallah)",
 "teach": [u.teach("nazar"), u.teach("mashallah", "Compliment a baby without Mashallah and watch the room go silent."), u.teach("haldi-doodh"), u.teach("kaisa-lag"), u.teach("achha-lag"), u.teach("sehat")],
 "exercises": [u.mc("You compliment your cousin's new baby. What MUST you add?", ["@mashallah", ("@u01.inshallah", "Inshallah is for the future. Mashallah is for praise."), ("@u01.shukriya", "Thanking the baby? Sweet, but no.")]), u.meaning("nazar"), u.listen("haldi-doodh"), u.say("achha-lag", "Ammi asks how you're feeling. You're better.", ["kaisa-lag", "neend"]),
   u.type("mashallah", "Type the word that protects a compliment"), u.type("kaisa-lag", "Ask Nani: “How are you feeling?”")]})
L.append({"id": "u08-l4", "title": "Sakna: can", "blurb": "Can, can't, may I. Plus the aunty weight report.", "canDo": "You can say what you can and can't do, and ask permission",
 "teach": [info("sakna = can", "Verb stem + sakta/sakti/sakte + hoon/hai/hain. Bol (speak): main bol sakta hoon. Add nahin for can't: main nahin kha sakta. Turn it into permission with kya at the start."), u.teach("urdu-bol-sakta", "Say this one proudly."), u.teach("urdu-bol-sakti"), u.teach("nahin-kha-sakta", "A useful lie at any dawat."), u.teach("ja-sakta"), u.teach("mote"), u.teach("patle")],
 "exercises": [u.say("urdu-bol-sakti", "You're a woman. Tell Khala you can speak Urdu now.", ["urdu-bol-sakta", "ja-sakta"]), u.gap("urdu-bol-sakta", ("sakta", "سکتا"), [("sakti", "سکتی"), ("sakte", "سکتے")], "a man speaking → sakta"),
   u.listen("mote", True), u.mc("An aunty says “Tum mote ho gaye ho!” What's the polite response?", [("Smile and say “Ji Aunty, aap ki duaaein”", "Perfect. Deflect with her blessings."), ("Point out that she has too", "True, but you'll never be invited again.")]),
   u.build("ja-sakta"), u.type("urdu-bol-sakta", "You're a guy. Type: “I can speak Urdu”"), u.type("nahin-kha-sakta", "You're a guy at a dawat: “I can't eat any more”"), u.speak("urdu-bol-sakta")]})

n, y, o = u.npc, u.you, u.opt
boss = {"id": "u08-boss", "title": "Ammi, MD", "character": "ammi",
 "blurb": "You're sick. Ammi has a diagnosis (nazar), a treatment plan (turmeric), and a second opinion (Bilal).",
 "scene": "You're on the sofa under three blankets. Ammi walks in, takes one look at you, and puts down her shopping. A full desi medical consultation is about to begin.",
 "canDo": "You can explain how you feel and get through a desi home treatment",
 "start": "a",
 "nodes": {
  "a": n("ammi", "b.kya-hua", "b"),
  "b": y("Tell her what's wrong.", [o("b.bukhaar", "c", "great"), o("b.sar-dard", "c", "great")], "Ammi, mujhe bukhaar…"),
  "c": n("ammi", "b.nazar", "d"),
  "d": y("Respond to the diagnosis.", [o("b.virus", "e2", "bold", "Science vs Ammi. You know who wins."), o("b.ji-ammi", "e1", "fine", "Wise. Never argue with the doctor.")], "Ammi, yeh nazar nahin…"),
  "e1": n("ammi", "b.mirchein", "f"),
  "e2": n("ammi", "b.virus-react", "f"),
  "f": y("The turmeric milk is coming. Accept your fate?", [o("b.doodh-ok", "g", "great"), o("b.doodh-no", "g", "bold", "She heard 'I love turmeric'. Two glasses.")], "Theek hai, Ammi…"),
  "g": n("ammi", "b.bilal-call", "h"),
  "h": n("ammi", "b.bilal-says", "i"),
  "i": y("Bilal has spoken. Reply.", [o("b.theek-ho-jaunga", "j", "great"), o("b.wahi-kaha", "j", "bold", "Correct, and yet nobody will remember you said it.")], "Ji Ammi, main theek…"),
  "j": n("ammi", "b.sehat", "end"),
  "end": {"type": "end", "title": "Treatment complete", "text": "You described your symptoms, survived the nazar diagnosis, and drank the turmeric milk. You'll be better by morning. Ammi will credit the chillies.", "outcome": "cured"}}}

meta = {"track": "speaking", "order": 8, "title": "Body, Health & Nazar", "titleUrdu": "صحت اور نظر", "emoji": "🧿",
 "tagline": "Fevers, feelings, the evil eye, and turmeric milk for everything.", "canDo": "You can talk about how you feel, what hurts and what you can do",
 "grammar": [{"title": "Feelings with 'mujhe … lagna'", "body": "Hunger, thirst, cold and liking happen to you: mujhe bhook lagi hai (I'm hungry), mujhe sardi lag rahi hai (I feel cold), mujhe achha lagta hai (I like it). The verb agrees with the feeling, not with you."},
             {"title": "sakna (can)", "body": "Stem + sakta (m) / sakti (f) / sakte (pl/aap) + hoon/hai/hain. main bol sakta hoon = I can speak. Negative: main nahin bol sakta. Permission: kya main ja sakta hoon?"}]}
write_unit(u, meta, L, boss)
