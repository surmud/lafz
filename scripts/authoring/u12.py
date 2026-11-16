"""Unit 12: Tell a Story."""
from common import Unit, info, write_unit

u = Unit("u12")
P = u.P
P("pata-hai-kya-hua", "pata hai kya hua?", "پتا ہے کیا ہوا؟", "Guess what happened?", literal="do you know what happened?")
P("phir-kya-hua", "phir kya hua?", "پھر کیا ہوا؟", "Then what happened?")
P("sach-mein", "sach mein?", "سچ میں؟", "Really?", sense="really")
P("pehle", "pehle", "پہلے", "first", sense="seq")
P("phir", "phir", "پھر", "then", sense="seq")
P("uske-baad", "uske baad", "اس کے بعد", "after that", sense="seq", accept=["us ke baad"])
P("lekin", "lekin", "لیکن", "but")
P("kyunke", "kyunke", "کیونکہ", "because", accept=["kyunki", "kyun ke"])
P("achanak", "achanak", "اچانک", "suddenly")
P("aakhir-mein", "aakhir mein", "آخر میں", "in the end", accept=["akhir mein"])
P("baraat-der", "baraat do ghante der se aayi", "بارات دو گھنٹے دیر سے آئی", "The baraat arrived two hours late")
P("dulha-gir", "dulha ghore se gir gaya", "دولہا گھوڑے سے گر گیا", "The groom fell off the horse")
P("sab-hans", "sab hans pade", "سب ہنس پڑے", "Everyone burst out laughing")
P("khala-ro", "Khala ro rahi thi", "خالہ رو رہی تھی", "Khala was crying", sense="was-ing")
P("hum-naach", "hum naach rahe the", "ہم ناچ رہے تھے", "We were dancing", sense="was-ing")
P("thak-gaya-tha", "main bohat thak gaya tha", "میں بہت تھک گیا تھا", "I was really tired (man)")
P("maine-suna", "maine suna hai ke…", "میں نے سنا ہے کہ…", "I've heard that…", note="The opening of all gossip.", accept=["maine suna hai ki"])
P("kisi-ko-mat", "kisi ko mat batana", "کسی کو مت بتانا", "Don't tell anyone", note="Guarantees everyone will know by Friday.")
P("allah-qasam", "Allah qasam", "اللہ قسم", "I swear to God", register="casual")
P("chhoro", "chhoro, yeh batao…", "چھوڑو، یہ بتاؤ…", "Forget that, tell me this…", register="casual", accept=["chhodo yeh batao"])
# boss
P("b.nani-ask", "Achha, shaadi kaisi thi? Sab batao", "اچھا، شادی کیسی تھی؟ سب بتاؤ", "So, how was the wedding? Tell me everything", speaker="nani")
P("b.pata-hai", "Nani, pata hai kya hua?", "نانی، پتا ہے کیا ہوا؟", "Nani, guess what happened?", accept=["pata hai kya hua"])
P("b.pehle-baraat", "Pehle to baraat do ghante der se aayi", "پہلے تو بارات دو گھنٹے دیر سے آئی", "First, the baraat came two hours late", accept=["pehle baraat do ghante der se aayi"])
P("b.kya", "Kya hua? Jaldi batao!", "کیا ہوا؟ جلدی بتاؤ!", "What happened? Quick, tell me!", speaker="nani")
P("b.do-ghante", "Do ghante! Hamare zamane mein to…", "دو گھنٹے! ہمارے زمانے میں تو…", "Two hours! In my day…", speaker="nani")
P("b.phir-dulha", "Phir dulha ghore se gir gaya!", "پھر دولہا گھوڑے سے گر گیا!", "Then the groom fell off the horse!", accept=["phir dulha ghore se gir gaya", "dulha ghore se gir gaya"])
P("b.achanak-dulha", "Achanak, dulha ghore se gir gaya!", "اچانک، دولہا گھوڑے سے گر گیا!", "Suddenly, the groom fell off the horse!", accept=["achanak dulha ghore se gir gaya"])
P("b.hai-allah", "Haye Allah! Phir kya hua?", "ہائے اللہ! پھر کیا ہوا؟", "Oh my God! Then what happened?", speaker="nani")
P("b.sab-hans", "Sab hans pade, aur Khala ro rahi thi", "سب ہنس پڑے، اور خالہ رو رہی تھی", "Everyone burst out laughing, and Khala was crying", accept=["sab hans pade aur khala ro rahi thi", "sab hans pade"])
P("b.lekin-theek", "Lekin woh theek tha, Alhamdulillah", "لیکن وہ ٹھیک تھا، الحمدللہ", "But he was fine, thank God", accept=["lekin woh theek tha", "woh theek tha alhamdulillah"])
P("b.khala-enters", "Main nahin ro rahi thi! Aankh mein kuch chala gaya tha", "میں نہیں رو رہی تھی! آنکھ میں کچھ چلا گیا تھا", "I was NOT crying! Something got in my eye", speaker="khala")
P("b.nani-laugh", "Hahaha! Shabnam ki shaadi pe bhi yahi hua tha", "ہاہاہا! شبنم کی شادی پہ بھی یہی ہوا تھا", "Hahaha! The same thing happened at Shabnam's wedding", speaker="nani")
P("b.gossip", "Aur maine suna hai ke… kisi ko mat batana…", "اور میں نے سنا ہے کہ… کسی کو مت بتانا…", "And I've heard that… don't tell anyone…", accept=["maine suna hai ke kisi ko mat batana", "kisi ko mat batana"])
P("b.aakhir", "Aakhir mein sab ne biryani khayi aur sab khush the", "آخر میں سب نے بریانی کھائی اور سب خوش تھے", "In the end everyone ate biryani and everyone was happy", accept=["aakhir mein sab khush the", "aakhir mein sab ne biryani khayi"])
P("b.nani-gossip", "Bolo, bolo! Main kisi ko nahin bataungi. Allah qasam", "بولو، بولو! میں کسی کو نہیں بتاؤں گی۔ اللہ قسم", "Tell me, tell me! I won't tell a soul. I swear", speaker="nani", register="casual")
P("b.nani-end", "Wah. Ab tum kahani suna sakte ho. Asli Urdu mein!", "واہ۔ اب تم کہانی سنا سکتے ہو۔ اصلی اردو میں!", "Wow. Now you can tell a story. In real Urdu!", speaker="nani")

L = []
L.append({"id": "u12-l1", "title": "Pata hai kya hua?", "blurb": "Start a story. Keep them hooked.", "canDo": "You can start a story and react to someone else's",
 "teach": [u.teach("pata-hai-kya-hua", "The universal story opener."), u.teach("phir-kya-hua", "The listener's job: say this, often."), u.teach("sach-mein"), u.teach("allah-qasam", "Casual. For stories that sound made up (and probably are).")],
 "exercises": [u.meaning("pata-hai-kya-hua"), u.say("phir-kya-hua", "Your cousin stops mid-story. Prompt them.", ["sach-mein", "pata-hai-kya-hua"]), u.listen("sach-mein", True), u.type("phir-kya-hua", "Type: “Then what happened?”"), u.type("pata-hai-kya-hua", "Start a story: “Guess what happened?”"), u.speak("pata-hai-kya-hua")]})
L.append({"id": "u12-l2", "title": "Pehle, phir, aakhir mein", "blurb": "Connectors: the glue that turns sentences into a story.", "canDo": "You can link events with first, then, but, because, suddenly",
 "teach": [u.teach("pehle"), u.teach("phir"), u.teach("uske-baad"), u.teach("lekin"), u.teach("kyunke"), u.teach("achanak", "Every good wedding story needs one."), u.teach("aakhir-mein")],
 "exercises": [u.match("pehle", "phir", "lekin", "kyunke"), u.match("achanak", "aakhir-mein", "uske-baad", "phir"), u.mc("Which word means ‘suddenly’?", ["@achanak", ("@aakhir-mein", "That's ‘in the end’."), ("@lekin", "That's ‘but’.")]),
   u.listen("kyunke"), u.type("lekin", "Type: “but”"), u.type("aakhir-mein", "Type: “in the end”")]})
L.append({"id": "u12-l3", "title": "The wedding story", "blurb": "Past tense, all of it: came, fell, laughed, was crying.", "canDo": "You can tell what happened at an event, in order",
 "teach": [info("Past continuous: was …ing", "Stem + raha/rahi/rahe + tha/thi/the: Khala ro rahi thi (Khala was crying), hum naach rahe the (we were dancing). It sets the scene while the main events happen."),
   u.teach("baraat-der"), u.teach("dulha-gir", "This happens at roughly one wedding in five."), u.teach("sab-hans", "pade (fell) adds 'burst out'."), u.teach("khala-ro"), u.teach("hum-naach"), u.teach("thak-gaya-tha")],
 "exercises": [u.gap("khala-ro", ("thi", "تھی"), [("tha", "تھا"), ("the", "تھے")], "Khala is a woman → thi"), u.gap("hum-naach", ("the", "تھے"), [("tha", "تھا"), ("thi", "تھی")], "hum (we) → the"),
   u.meaning("dulha-gir"), u.listen("baraat-der", True), u.build("sab-hans"), u.type("khala-ro", "Type: “Khala was crying”"), u.type("dulha-gir", "Type: “The groom fell off the horse”"), u.speak("baraat-der")]})
L.append({"id": "u12-l4", "title": "Gossip", "blurb": "Maine suna hai… the language of every family WhatsApp group.", "canDo": "You can share (and receive) family gossip",
 "teach": [u.teach("maine-suna"), u.teach("kisi-ko-mat"), u.teach("chhoro")],
 "exercises": [u.meaning("kisi-ko-mat"), u.say("maine-suna", "Start some gossip.", ["kisi-ko-mat", "chhoro"]), u.listen("chhoro", True), u.type("kisi-ko-mat", "Type: “Don't tell anyone”"), u.type("maine-suna", "Type: “I've heard that…”"),
   u.mc("Khala says “Kisi ko mat batana.” How many people will know by Friday?", [("Everyone", "Correct. Including people in other countries."), ("Nobody", "Have you met Khala?")])]})

n, y, o = u.npc, u.you, u.opt
boss = {"id": "u12-boss", "title": "The Story for Nani", "character": "nani",
 "blurb": "Nani missed the wedding. You're telling her everything. In Urdu. Khala is listening.",
 "scene": "Nani couldn't go to the baraat (her knees). The next morning she pats the sofa beside her, pours two cups of chai, and says: tell me everything.",
 "canDo": "You can tell a whole story in Urdu, in order, to an elder",
 "start": "a",
 "nodes": {
  "a": n("nani", "b.nani-ask", "b"),
  "b": y("Hook her in.", [o("b.pata-hai", "c1", "great"), o("b.pehle-baraat", "c2", "fine")], "Nani, pata hai…"),
  "c1": n("nani", "b.kya", "d"),
  "c2": n("nani", "b.do-ghante", "d"),
  "d": y("The big moment.", [o("b.achanak-dulha", "e", "great", "'Achanak'! Nani leans in."), o("b.phir-dulha", "e", "fine")], "Achanak…"),
  "e": n("nani", "b.hai-allah", "f"),
  "f": y("What happened next?", [o("b.sab-hans", "g1", "bold"), o("b.lekin-theek", "g2", "great")], "Sab hans pade…"),
  "g1": n("khala", "b.khala-enters", "g2"),
  "g2": n("nani", "b.nani-laugh", "h"),
  "h": y("Finish the story. Or add gossip.", [o("b.aakhir", "i1", "great"), o("b.gossip", "i2", "bold", "Khala freezes in the doorway. Nani puts her chai down. This is the real story.")], "Aakhir mein…"),
  "i1": n("nani", "b.nani-end", "end"),
  "i2": n("nani", "b.nani-gossip", "end"),
  "end": {"type": "end", "title": "You told the story", "text": "Beginning, middle, end, with past tenses, connectors and drama, in Urdu, to Nani. This is what the whole course was for. She'll repeat it to everyone, slightly improved.", "outcome": "storyteller"}}}

meta = {"track": "speaking", "order": 12, "title": "Tell a Story", "titleUrdu": "کہانی سنائیں", "emoji": "📖",
 "tagline": "The wedding, the gossip, the groom who fell off the horse. Put it all together.", "canDo": "You can tell a story in Urdu: what happened, in order, with feeling",
 "grammar": [{"title": "Past continuous", "body": "Stem + raha/rahi/rahe + tha/thi/the: woh ro rahi thi (she was crying), hum naach rahe the (we were dancing)."},
             {"title": "Story glue", "body": "pehle (first), phir (then), uske baad (after that), lekin (but), kyunke (because), achanak (suddenly), aakhir mein (in the end). Listener noises: sach mein? phir kya hua? haye Allah!"}]}
write_unit(u, meta, L, boss)
