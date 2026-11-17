"""Unit 7: Shaadi Season."""
from common import Unit, info, write_unit

u = Unit("u07")
P = u.P
P("shaadi", "shaadi", "شادی", "wedding / marriage", accept=["shadi"])
P("mehndi", "mehndi", "مہندی", "henna night (the fun pre-wedding party)", accept=["mehendi", "mehandi"])
P("baraat", "baraat", "بارات", "the groom's procession (wedding day)", accept=["barat"])
P("walima", "walima", "ولیمہ", "the reception, hosted by the groom's family")
P("dulha", "dulha", "دولہا", "groom")
P("dulhan", "dulhan", "دلہن", "bride")
P("dholki", "dholki", "ڈھولکی", "drum night: singing, clapping, aunties' songs")
P("salami", "salami", "سلامی", "gift money (in an envelope)")
P("mubarak-ho", "mubarak ho!", "مبارک ہو!", "Congratulations!", sense="congrats", accept=["mubarak ho"])
P("shaadi-mubarak", "shaadi mubarak!", "شادی مبارک!", "Happy wedding! (to the couple or family)", sense="congrats", accept=["shadi mubarak"])
P("khair-mubarak", "khair mubarak", "خیر مبارک", "Thank you (reply to mubarak)", note="The automatic reply to any 'mubarak'.")
P("naachunga", "main naachunga", "میں ناچوں گا", "I'll dance (man)", sense="dance")
P("naachungi", "main naachungi", "میں ناچوں گی", "I'll dance (woman)", sense="dance")
P("nahin-naachunga", "main nahin naachunga", "میں نہیں ناچوں گا", "I will NOT dance (man)", sense="nodance")
P("kya-pehnenge", "aap kya pehnenge?", "آپ کیا پہنیں گے؟", "What will you wear?")
P("shalwar-kameez", "main shalwar kameez pehnunga", "میں شلوار قمیض پہنوں گا", "I'll wear shalwar kameez (man)", accept=["main shalwar qameez pehnunga"])
P("kal-jayenge", "hum kal jayenge", "ہم کل جائیں گے", "We'll go tomorrow", accept=["hum kal jaenge"])
P("khana-kab", "khana kab milega?", "کھانا کب ملے گا؟", "When will the food be served?", note="Asked at every wedding at 11pm. Food is served at 1am.")
P("dulhan-khoobsurat", "dulhan bohat khoobsurat hai", "دلہن بہت خوبصورت ہے", "The bride looks beautiful", accept=["dulhan bohat khubsurat hai"])
P("agla-number", "agla number tumhara hai!", "اگلا نمبر تمہارا ہے!", "You're next!", register="casual", note="Said by every aunty to every single person at every wedding.")
P("jald-hi", "Inshallah, jald hi", "ان شاء اللہ، جلد ہی", "God willing, soon", accept=["inshallah jald hi", "jald hi"])
P("kab-shaadi", "tum kab shaadi karoge?", "تم کب شادی کرو گے؟", "When will you get married?", accept=["tum kab shadi karoge"])
P("pata-nahin", "pata nahin", "پتا نہیں", "No idea / who knows", accept=["pata nai", "patta nahin"])
# boss
P("b.aa-gaye", "Aa gaye! Mehndi pe bohat der se aaye ho", "آ گئے! مہندی پہ بہت دیر سے آئے ہو", "There you are! You're very late to the mehndi", speaker="khala")
P("b.mubarak-khala", "Mubarak ho, Khala!", "مبارک ہو خالہ!", "Congratulations, Khala!", accept=["mubarak ho khala", "mubarak ho"])
P("b.traffic", "Traffic tha, Khala", "ٹریفک تھا خالہ", "There was traffic, Khala", register="casual", accept=["traffic tha"])
P("b.khair-mubarak", "Khair mubarak, beta! Chalo, ab naacho!", "خیر مبارک بیٹا! چلو، اب ناچو!", "Thank you, dear! Now, dance!", speaker="khala")
P("b.traffic-react", "Traffic! Hamesha traffic! Chalo, ab naacho!", "ٹریفک! ہمیشہ ٹریفک! چلو، اب ناچو!", "Traffic! Always traffic! Now dance!", speaker="khala", register="casual")
P("b.naachunga", "Theek hai, main naachunga!", "ٹھیک ہے، میں ناچوں گا!", "Fine, I'll dance!", accept=["main naachunga", "theek hai main naachungi", "main naachungi"])
P("b.nahin-naachunga", "Nahin Khala, main nahin naachunga", "نہیں خالہ، میں نہیں ناچوں گا", "No Khala, I will not dance", accept=["main nahin naachunga", "main nahin naachungi"])
P("b.naach-react", "Wah wah! Dekho, Bilal se achha naachta hai!", "واہ واہ! دیکھو، بلال سے اچھا ناچتا ہے!", "Wow! Look, dances better than Bilal!", speaker="khala")
P("b.nahin-react", "Nahin? Mrs. Butt dekh rahi hain…", "نہیں؟ مسز بٹ دیکھ رہی ہیں…", "No? Mrs. Butt is watching…", speaker="khala", register="casual")
P("b.butt-agla", "Beta, agla number tumhara hai!", "بیٹا، اگلا نمبر تمہارا ہے!", "Dear, you're next!", speaker="mrs-butt", register="casual")
P("b.jald-hi", "Inshallah, Aunty. Jald hi", "ان شاء اللہ آنٹی۔ جلد ہی", "God willing, Aunty. Soon", accept=["inshallah aunty", "inshallah jald hi", "jald hi"])
P("b.pata-nahin", "Pata nahin, Aunty", "پتا نہیں آنٹی", "No idea, Aunty", accept=["pata nahin", "pata nahin aunty"])
P("b.butt-list", "Jald hi! Main list update karti hoon", "جلد ہی! میں لسٹ اپڈیٹ کرتی ہوں", "Soon! I'll update the list", speaker="mrs-butt", register="casual")
P("b.butt-pata", "Pata nahin? Mujhe pata hai. Mere paas teen options hain", "پتا نہیں؟ مجھے پتا ہے۔ میرے پاس تین آپشنز ہیں", "No idea? I know. I have three options", speaker="mrs-butt", register="casual")
P("b.khana-kab", "Khala, khana kab milega?", "خالہ، کھانا کب ملے گا؟", "Khala, when will the food come?", accept=["khana kab milega"])
P("b.dulhan", "Dulhan bohat khoobsurat lag rahi hai!", "دلہن بہت خوبصورت لگ رہی ہے!", "The bride looks so beautiful!", accept=["dulhan bohat khoobsurat hai", "dulhan bohat khoobsurat lag rahi hai"])
P("b.ek-baje", "Bas, ek baje tak", "بس، ایک بجے تک", "Oh, by one o'clock", speaker="khala")
P("b.dulhan-react", "Haan na! Meri bhanji hai. Main ne hi rishta karwaya!", "ہاں نا! میری بھانجی ہے۔ میں نے ہی رشتہ کروایا!", "Isn't she! My niece. I arranged it myself!", speaker="khala")

L = []
L.append({"id": "u07-l1", "title": "Shaadi vocab", "blurb": "Mehndi, baraat, walima: a wedding is three to five events. Minimum.", "canDo": "You can name the events and people of a Pakistani wedding",
 "teach": [info("A wedding is a season", "Dholki nights (weeks before), mehndi, baraat (the wedding day), walima (reception). Each is a separate outfit. Each is late. Each has biryani."),
   u.teach("dholki"), u.teach("mehndi"), u.teach("baraat"), u.teach("walima"), u.teach("dulha"), u.teach("dulhan"), u.teach("salami", "Cash in an envelope. The amount will be discussed by aunties for years.")],
 "exercises": [u.match("mehndi", "baraat", "walima", "dholki"), u.match("dulha", "dulhan", "salami", "shaadi"), u.listen("baraat"), u.meaning("walima"), u.type("dulhan", "Type: “bride”"),
   u.mc("Which event is hosted by the groom's family, after the wedding?", ["@walima", ("@mehndi", "Mehndi comes before."), ("@dholki", "Dholki is weeks before.")]), u.type("mehndi", "The henna night is called…")]})
L.append({"id": "u07-l2", "title": "Mubarak ho!", "blurb": "Congratulate everyone. Then congratulate them again.", "canDo": "You can congratulate the family and reply to congratulations",
 "teach": [u.teach("mubarak-ho", "Works for weddings, babies, exam results, new cars."), u.teach("shaadi-mubarak"), u.teach("khair-mubarak", "If someone says mubarak to you, this is the reply."), u.teach("dulhan-khoobsurat", "Say this. Mean it. It is always true at a wedding.")],
 "exercises": [u.say("mubarak-ho", "You walk into the mehndi and see the bride's mother.", ["khair-mubarak", "pata-nahin"]), u.say("khair-mubarak", "Someone says “Mubarak ho!” to you (your cousin is the bride).", ["mubarak-ho", "jald-hi"]),
   u.listen("dulhan-khoobsurat", True), u.build("dulhan-khoobsurat"), u.type("mubarak-ho", "Type: “Congratulations!”"), u.type("khair-mubarak", "Reply to a congratulations")]})
L.append({"id": "u07-l3", "title": "Main naachunga", "blurb": "The future tense, featuring the dance-floor ultimatum.", "canDo": "You can say what you will and won't do",
 "teach": [info("Future: -unga, -ungi, -enge", "Stem + unga (I, man) / ungi (I, woman) / enge (we, aap). Naach (dance): main naachunga, main naachungi, hum naachenge. Ga/gi/ge is written as a separate little word in Urdu script."),
   u.teach("naachunga"), u.teach("naachungi"), u.teach("nahin-naachunga", "Nahin goes right before the verb."), u.teach("kal-jayenge"), u.teach("kya-pehnenge"), u.teach("shalwar-kameez")],
 "exercises": [u.say("naachungi", "You're a woman and Khala insists. Agree to dance.", ["naachunga", "nahin-naachunga"]),
   u.say("nahin-naachunga", "You're a man and you will NOT be dancing.", ["naachunga", "naachungi"]), u.meaning("kya-pehnenge"), u.listen("kal-jayenge"), u.build("shalwar-kameez", extra=[("pehnungi", "پہنوں گی")]),
   u.type("naachunga", "You're a guy. Type: “I'll dance”"), u.type("kal-jayenge", "Type: “We'll go tomorrow”"), u.speak("nahin-naachunga")]})
L.append({"id": "u07-l4", "title": "Agla number tumhara!", "blurb": "Every wedding conversation with an aunty, and how to escape it.", "canDo": "You can survive 'you're next!' and 'when are you getting married?'",
 "teach": [u.teach("agla-number"), u.teach("kab-shaadi", "Future tense again: karoge = will you do."), u.teach("jald-hi", "The diplomatic answer."), u.teach("pata-nahin", "The honest answer."), u.teach("khana-kab", "The question everyone is secretly asking.")],
 "exercises": [u.meaning("agla-number"), u.say("jald-hi", "An aunty asks when you're getting married. Be diplomatic.", ["pata-nahin", "khana-kab"]), u.listen("kab-shaadi", True), u.type("pata-nahin", "Type: “No idea”"),
   u.mc("It's 11pm at the baraat. You ask “Khana kab milega?” Realistic answer?", [("Around 1am", "Correct. Bring snacks."), ("Right now", "Adorable.")]), u.type("khana-kab", "Ask: “When will the food be served?”"), u.build("agla-number", extra=[("mera", "میرا")])]})

n, y, o = u.npc, u.you, u.opt
boss = {"id": "u07-boss", "title": "The Mehndi", "character": "khala",
 "blurb": "Your cousin's mehndi. Khala wants you on the dance floor. Mrs. Butt wants you on her list.",
 "scene": "Yellow and orange everywhere, a dhol thumping, three hundred guests. You've barely stepped in when Shabnam Khala spots you from across the lawn and starts marching over.",
 "canDo": "You can get through a wedding event: congratulate, dance (or refuse), and deflect the rishta questions",
 "start": "a",
 "nodes": {
  "a": n("khala", "b.aa-gaye", "b"),
  "b": y("Greet her. (Her daughter is the bride.)", [o("b.mubarak-khala", "c1", "great"), o("b.traffic", "c2", "fine", "An excuse before a congratulations. Bold sequencing.")], "Mubarak ho…"),
  "c1": n("khala", "b.khair-mubarak", "d"),
  "c2": n("khala", "b.traffic-react", "d"),
  "d": y("She's pulling you to the dance floor.", [o("b.naachunga", "e1", "great", "The dhol player nods at you. You are now a dancer."), o("b.nahin-naachunga", "e2", "bold")], "Main naachunga…"),
  "e1": n("khala", "b.naach-react", "f"),
  "e2": n("khala", "b.nahin-react", "f"),
  "f": n("mrs-butt", "b.butt-agla", "g"),
  "g": y("Mrs. Butt has entered the chat.", [o("b.jald-hi", "h1", "great"), o("b.pata-nahin", "h2", "bold")], "Inshallah, Aunty…"),
  "h1": n("mrs-butt", "b.butt-list", "i"),
  "h2": n("mrs-butt", "b.butt-pata", "i"),
  "i": y("Change the subject. Fast.", [o("b.dulhan", "j1", "great", "Flawless deflection. Nobody can resist talking about the bride."), o("b.khana-kab", "j2", "fine")], "Dulhan bohat…"),
  "j1": n("khala", "b.dulhan-react", "end"),
  "j2": n("khala", "b.ek-baje", "end"),
  "end": {"type": "end", "title": "Mehndi survived", "text": "You congratulated, (maybe) danced, and deflected two rishta attacks. Food arrived at 1:14am. You were there for it.", "outcome": "survived"}}}

meta = {"track": "speaking", "order": 7, "title": "Weddings", "titleUrdu": "شادی کا موسم", "emoji": "💃",
 "tagline": "Weddings: the events, congratulations and the future tense.", "canDo": "You can get through a Pakistani wedding season, in Urdu",
 "grammar": [{"title": "Future tense", "body": "Verb stem + ending + ga/gi/ge. main jaunga (I'll go, man), main jaungi (woman), tum jaoge, woh jayega/jayegi, hum/aap jayenge. The ga/gi/ge matches the speaker's gender and number, and in Urdu script it's written as a separate word: جاؤں گا."}]}
write_unit(u, meta, L, boss)
