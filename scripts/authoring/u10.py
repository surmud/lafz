"""Unit 10: Eid, Ramadan & Occasions."""
from common import Unit, info, write_unit

u = Unit("u10")
P = u.P
P("eid-mubarak", "Eid mubarak!", "عید مبارک!", "Happy Eid!", sense="eid", accept=["eid mubarak", "eed mubarak"])
P("ramzan-mubarak", "Ramzan mubarak!", "رمضان مبارک!", "Happy Ramadan!", sense="ramzan", accept=["ramadan mubarak", "ramzan mubarak"])
P("roza", "roza", "روزہ", "a fast (in Ramadan)")
P("roza-hai", "mera roza hai", "میرا روزہ ہے", "I'm fasting", literal="my fast is (on)")
P("iftar", "iftar", "افطار", "breaking the fast at sunset")
P("sehri", "sehri", "سحری", "the pre-dawn meal", accept=["sehari", "suhoor"])
P("eidi", "eidi", "عیدی", "Eid money (cash gifts for kids, and adults if lucky)")
P("chaand-raat", "chaand raat", "چاند رات", "the night before Eid (moon night)", note="Bangles, mehndi, last-minute shopping, and the whole family arguing about whether the moon was sighted.")
P("chaand-nazar", "chaand nazar aa gaya!", "چاند نظر آ گیا!", "The moon's been sighted!", accept=["chand nazar aa gaya"])
P("khair-mubarak", "khair mubarak", "خیر مبارک", "Thanks (reply to mubarak)")
P("mubarakbaad", "bohat bohat mubarakbaad!", "بہت بہت مبارکباد!", "Many, many congratulations!", sense="congrats")
P("bacche-ki-mubarak", "bachche ki mubarak ho!", "بچے کی مبارک ہو!", "Congratulations on the baby!", sense="congrats", accept=["bache ki mubarak ho"])
P("pass-mubarak", "pass hone ki mubarak ho!", "پاس ہونے کی مبارک ہو!", "Congrats on passing (your exams)!", register="casual", sense="congrats")
P("afsos", "bohat afsos hua", "بہت افسوس ہوا", "I'm so sorry (to hear that)", note="For condolences and bad news. Said quietly.", sense="sorry")
P("inna-lillahi", "Inna lillahi wa inna ilaihi rajioon", "انا للہ وانا الیہ راجعون", "We belong to God and to Him we return (said on hearing of a death)", note="The traditional words of condolence. Many people simply say 'Inna lillah'.", accept=["inna lillahi wa inna ilayhi rajioon", "inna lillah"])
P("allah-sabr", "Allah sabr de", "اللہ صبر دے", "May God give you patience", sense="sorry")
P("dua-mein-yaad", "dua mein yaad rakhiye", "دعا میں یاد رکھیے", "Remember me in your prayers")
# ne-construction
P("maine-khana-khaya", "maine khana khaya", "میں نے کھانا کھایا", "I ate (the food)", sense="ate")
P("maine-roti-khayi", "maine roti khayi", "میں نے روٹی کھائی", "I ate the roti", sense="ate", note="Roti is feminine, so the verb is khayi, whoever ate it.")
P("aap-ne-kya-kaha", "aap ne kya kaha?", "آپ نے کیا کہا؟", "What did you say?")
P("ammi-ne-biryani", "Ammi ne biryani banayi", "امی نے بریانی بنائی", "Mum made biryani")
P("maine-eidi-di", "maine eidi di", "میں نے عیدی دی", "I gave Eidi")
P("nani-ne-eidi-di", "Nani ne mujhe eidi di", "نانی نے مجھے عیدی دی", "Nani gave me Eidi")
# boss
P("b.eid-mubarak-beta", "Eid mubarak, beta! Aao, gale milo", "عید مبارک بیٹا! آؤ، گلے ملو", "Eid mubarak, dear! Come, hug", speaker="nani")
P("b.khair-mubarak-nani", "Khair mubarak, Nani! Aap ko bhi Eid mubarak", "خیر مبارک نانی! آپ کو بھی عید مبارک", "Thank you, Nani! Eid mubarak to you too", accept=["khair mubarak nani", "aap ko bhi eid mubarak"])
P("b.eid-mubarak-nani", "Eid mubarak, Nani!", "عید مبارک نانی!", "Eid mubarak, Nani!", accept=["eid mubarak nani", "eid mubarak"])
P("b.namaz", "Namaz parh li?", "نماز پڑھ لی؟", "Did you say your Eid prayers?", speaker="nani")
P("b.ji-parh-li", "Ji Nani, maine namaz parh li", "جی نانی، میں نے نماز پڑھ لی", "Yes Nani, I said my prayers", accept=["ji nani maine namaz parh li", "maine namaz parh li"])
P("b.so-gaya", "Main… so gaya tha", "میں… سو گیا تھا", "I… overslept", accept=["main so gaya tha", "main so gayi thi"])
P("b.shabash", "Shabash! Yeh lo, tumhari eidi", "شاباش! یہ لو، تمہاری عیدی", "Well done! Here, your Eidi", speaker="nani")
P("b.so-gaya-react", "Eid ke din bhi! Achha… phir bhi, yeh lo eidi", "عید کے دن بھی! اچھا… پھر بھی، یہ لو عیدی", "Even on Eid! Well… here's your Eidi anyway", speaker="nani")
P("b.shukriya-nani", "Shukriya, Nani! Allah aap ko lambi umar de", "شکریہ نانی! اللہ آپ کو لمبی عمر دے", "Thank you Nani! May God give you a long life", accept=["shukriya nani", "allah aap ko lambi umar de"])
P("b.nahin-nahin", "Nahin, nahin, Nani! Main bara ho gaya hoon", "نہیں، نہیں نانی! میں بڑا ہو گیا ہوں", "No, no, Nani! I'm all grown up now", accept=["nahin nahin nani", "main bara ho gaya hoon"])
P("b.lambi-umar-react", "Jeete raho! Ab sheer khurma khao. Main ne khud banaya", "جیتے رہو! اب شیر خرمہ کھاؤ۔ میں نے خود بنایا", "Bless you! Now eat the sheer khurma. I made it myself", speaker="nani")
P("b.bara-react", "Bare ho gaye? Jab tak tumhari shaadi nahin hoti, tum bachche ho. Lo!", "بڑے ہو گئے؟ جب تک تمہاری شادی نہیں ہوتی، تم بچے ہو۔ لو!", "All grown up? Until you're married, you're a child. Take it!", speaker="nani")
P("b.mazedaar", "Maine kha liya. Bohat mazedaar hai!", "میں نے کھا لیا۔ بہت مزیدار ہے!", "I've had some. It's delicious!", accept=["maine kha liya bohat mazedaar hai", "bohat mazedaar hai"])
P("b.end-line", "Mashallah. Ab sab ko Eid mubarak bolo", "ماشاء اللہ۔ اب سب کو عید مبارک بولو", "Mashallah. Now go say Eid mubarak to everyone", speaker="nani")

L = []
L.append({"id": "u10-l1", "title": "Ramzan mubarak", "blurb": "Roza, sehri, iftar, and the moon-sighting drama.", "canDo": "You can talk about Ramadan and fasting",
 "teach": [u.teach("ramzan-mubarak"), u.teach("roza"), u.teach("roza-hai", "Also the polite way to turn down a samosa at 2pm."), u.teach("sehri"), u.teach("iftar", "Pakora o'clock."), u.teach("chaand-raat"), u.teach("chaand-nazar")],
 "exercises": [u.match("roza", "sehri", "iftar", "chaand-raat"), u.say("roza-hai", "A colleague offers you lunch in Ramadan. Explain.", ["iftar", "ramzan-mubarak"]), u.listen("chaand-nazar", True), u.meaning("sehri"),
   u.type("ramzan-mubarak", "Type: “Happy Ramadan!”"), u.type("roza-hai", "Type: “I'm fasting”"), u.build("chaand-nazar")]})
L.append({"id": "u10-l2", "title": "Eid mubarak!", "blurb": "Greetings, hugs, Eidi, and the reply to every mubarak.", "canDo": "You can give and return Eid greetings and talk about Eidi",
 "teach": [u.teach("eid-mubarak", "Said with a hug: three times, alternating sides."), u.teach("khair-mubarak"), u.teach("eidi", "The real reason children love Eid."), u.teach("nani-ne-eidi-di"), u.teach("dua-mein-yaad")],
 "exercises": [u.say("khair-mubarak", "Your uncle says “Eid mubarak!” to you.", ["eid-mubarak", "afsos"]), u.meaning("eidi"), u.listen("eid-mubarak"), u.type("eid-mubarak", "Type: “Happy Eid!”"), u.type("khair-mubarak", "Reply to “Eid mubarak!”"),
   u.mc("You're 28. Nani hands you Eidi. What do you do?", [("Protest weakly, then accept", "Perfect. The protest is part of the ritual."), ("Refuse firmly", "She will put it in your pocket. Then your other pocket.")])]})
L.append({"id": "u10-l3", "title": "Mubarak & afsos", "blurb": "Babies, exams, weddings, and the hard moments too.", "canDo": "You can congratulate people and offer condolences",
 "teach": [u.teach("mubarakbaad"), u.teach("bacche-ki-mubarak"), u.teach("pass-mubarak"), info("Condolences", "When someone has lost a relative, keep it simple and quiet. Don't try to be clever: say 'Inna lillahi…' or 'Bohat afsos hua', and 'Allah sabr de'."), u.teach("inna-lillahi"), u.teach("afsos"), u.teach("allah-sabr")],
 "exercises": [u.say("bacche-ki-mubarak", "Your cousin just had a baby.", ["afsos", "pass-mubarak"]), u.say("afsos", "A friend tells you their grandfather has passed away.", ["mubarakbaad", "eid-mubarak"]),
   u.respect("Your neighbour's mother has died. You visit the family.", "Grieving family", [("allah-sabr", "right", "Quiet, kind and right."), ("afsos", "right", "Simple and sincere."), ("mubarakbaad", "wrong", "Oh no. Wrong word entirely. Apologise immediately.")]),
   u.listen("allah-sabr"), u.type("afsos", "Type: “I'm so sorry”"), u.type("mubarakbaad", "Type: “Many, many congratulations!”")]})
L.append({"id": "u10-l4", "title": "Maine kaha", "blurb": "The famous 'ne': how Urdu says I ate, I gave, she made.", "canDo": "You can say what you (or others) did with ne",
 "teach": [info("The ne-construction", "In the past tense, verbs that act on something (eat, say, make, give) mark the DOER with 'ne', and the verb agrees with the THING, not the person. 'Maine roti khayi': roti is feminine, so khayi, even if a man ate it. Main + ne = maine."),
   u.teach("maine-khana-khaya", "khana is masculine → khaya"), u.teach("maine-roti-khayi", "roti is feminine → khayi"), u.teach("ammi-ne-biryani", "biryani is feminine → banayi"), u.teach("aap-ne-kya-kaha"), u.teach("maine-eidi-di")],
 "exercises": [u.gap("maine-roti-khayi", ("khayi", "کھائی"), [("khaya", "کھایا"), ("khaye", "کھائے")], "roti is feminine → khayi (the doer doesn't matter)"),
   u.gap("maine-khana-khaya", ("khaya", "کھایا"), [("khayi", "کھائی"), ("khaye", "کھائے")], "khana is masculine → khaya"),
   u.gap("ammi-ne-biryani", ("ne", "نے"), [("ko", "کو"), ("se", "سے")], "past tense + doer → ne"),
   u.meaning("aap-ne-kya-kaha"), u.listen("ammi-ne-biryani", True), u.type("maine-khana-khaya", "Type: “I ate”"), u.build("nani-ne-eidi-di", extra=[("ko", "کو")]), u.speak("aap-ne-kya-kaha")]})

n, y, o = u.npc, u.you, u.opt
boss = {"id": "u10-boss", "title": "Eid at Nani's", "character": "nani",
 "blurb": "Eid morning. New clothes, sheer khurma, and Nani with an envelope.",
 "scene": "Eid morning. The house smells of sheer khurma and attar. You walk in wearing your new kurta, and Nani rises from her chair with her arms open and an envelope visibly tucked into her sleeve.",
 "canDo": "You can get through Eid with an elder: greetings, prayers, Eidi and food",
 "start": "a",
 "nodes": {
  "a": n("nani", "b.eid-mubarak-beta", "b"),
  "b": y("Return the greeting (and the hug).", [o("b.khair-mubarak-nani", "c", "great"), o("b.eid-mubarak-nani", "c", "fine")], "Khair mubarak…"),
  "c": n("nani", "b.namaz", "d"),
  "d": y("Did you say your Eid prayers?", [o("b.ji-parh-li", "e1", "great"), o("b.so-gaya", "e2", "bold", "Honesty on Eid morning. Brave.")], "Ji Nani, maine…"),
  "e1": n("nani", "b.shabash", "f"),
  "e2": n("nani", "b.so-gaya-react", "f"),
  "f": y("Eidi is being offered.", [o("b.shukriya-nani", "g1", "great", "A blessing in return. Nani's eyes go misty."), o("b.nahin-nahin", "g2", "fine", "The ritual protest. Correctly performed.")], "Shukriya, Nani…"),
  "g1": n("nani", "b.lambi-umar-react", "h"),
  "g2": n("nani", "b.bara-react", "h"),
  "h": y("Taste the sheer khurma and report back.", [o("b.mazedaar", "i", "great"), o("u03.haath-zaiqa", "i", "great")], "Maine kha liya…"),
  "i": n("nani", "b.end-line", "end"),
  "end": {"type": "end", "title": "Eid mubarak!", "text": "Greetings, prayers (or a confession), Eidi and sheer khurma, all in Urdu. Nani's verdict: 'Is saal bohat achhi Urdu bol raha hai.' This year he's speaking really good Urdu.", "outcome": "eid"}}}

meta = {"track": "speaking", "order": 10, "title": "Eid & Occasions", "titleUrdu": "عید اور رمضان", "emoji": "🌙",
 "tagline": "Ramadan, Eid, congratulations, condolences and the 'ne' past tense.", "canDo": "You can say the right thing at every occasion, happy or sad",
 "grammar": [{"title": "The ne-construction", "body": "Past tense of transitive verbs (eat, drink, say, make, give, see): doer + ne, and the verb agrees with the object. maine khana khaya (khana m.), maine roti khayi (roti f.), Ammi ne biryani banayi. Pronouns merge: main + ne = maine, tum ne, aap ne, us ne. Verbs of motion (go, come) never take ne."}]}
write_unit(u, meta, L, boss)
