"""Unit 6: Out & About."""
from common import Unit, info, write_unit

u = Unit("u06")
P = u.P
P("ruko", "ruko!", "رکو!", "Stop! (to a friend)", register="casual", sense="stop")
P("rukiye", "rukiye", "رکیے", "Please stop (respectful)", register="formal", sense="stop", accept=["rukiye na", "rukein"])
P("chalo", "chalo!", "چلو!", "Let's go! / Come on!", register="casual", sense="go")
P("chaliye", "chaliye", "چلیے", "Let's go (respectful)", register="formal", sense="go", accept=["chalein"])
P("aaiye", "aaiye", "آئیے", "Please come in", register="formal", accept=["aayiye", "aaein"])
P("baithiye", "baithiye", "بیٹھیے", "Please sit", register="formal", accept=["baithein", "bethiye"])
P("baitho", "baitho", "بیٹھو", "Sit (to a friend or kid)", register="casual")
P("yahan-rukiye", "yahan rukiye", "یہاں رکیے", "Stop here, please")
P("seedha", "seedha chaliye", "سیدھا چلیے", "Go straight on", accept=["sidha chaliye", "seedhe chaliye"])
P("daayen", "daayen mudiye", "دائیں مڑیے", "Turn right", accept=["dayen mudiye", "daen mudiye"])
P("baayen", "baayen mudiye", "بائیں مڑیے", "Turn left", accept=["bayen mudiye", "baen mudiye"])
P("aahista", "aahista chalaiye!", "آہستہ چلائیے!", "Drive slowly, please!", accept=["ahista chalaiye", "aahista chalayein"])
P("masjid-kahan", "masjid kahan hai?", "مسجد کہاں ہے؟", "Where's the mosque?")
P("washroom-kahan", "washroom kahan hai?", "واش روم کہاں ہے؟", "Where's the bathroom?", register="casual", note="Everyone in Pakistan says 'washroom'. Asking for the 'toilet' gets a wince.")
P("bazaar-mein", "bazaar mein", "بازار میں", "in the bazaar")
P("ghar-ke-paas", "ghar ke paas", "گھر کے پاس", "near the house")
P("dukaan-saamne", "dukaan ke saamne", "دکان کے سامنے", "in front of the shop", accept=["dukan ke samne"])
P("masjid-peeche", "masjid ke peeche", "مسجد کے پیچھے", "behind the mosque", accept=["masjid ke piche"])
P("bazaar-chalenge", "bazaar chalenge?", "بازار چلیں گے؟", "Will you go to the bazaar? (asking a driver)", accept=["bazar chalenge", "bazaar chalein ge"])
P("kitna-kiraya", "kitna kiraya?", "کتنا کرایہ؟", "What's the fare?", accept=["kiraya kitna hai", "kitna kiraya hai"])
P("bohat-zyada", "bohat zyada hai", "بہت زیادہ ہے", "That's way too much", accept=["bohot zyada hai", "bohat ziada hai"])
P("do-sau-theek", "do sau theek hai", "دو سو ٹھیک ہے", "Two hundred is fair")
P("aakhri-daam", "aakhri daam?", "آخری دام؟", "Final price?", accept=["akhri daam", "aakhri daam kya hai"])
P("rehne-dein", "rehne dein", "رہنے دیں", "Forget it, then", note="The walk-away. Say it, turn around, walk slowly. Count to three.", accept=["rehne do", "rehne dijiye"])
P("do-chai-samosa", "do chai, ek samosa", "دو چائے، ایک سموسہ", "Two teas, one samosa", accept=["do chai aur ek samosa"])
P("bill", "bill de dijiye", "بل دے دیجیے", "The bill, please", register="casual", accept=["bill de dein", "bill dijiye"])
# boss
P("b.kahan-jana", "Haan ji, kahan jana hai?", "ہاں جی، کہاں جانا ہے؟", "Yes sir/ma'am, where to?", speaker="pervez")
P("b.bazaar-chalenge", "Bhai sahab, bazaar chalenge?", "بھائی صاحب، بازار چلیں گے؟", "Brother, will you go to the bazaar?", accept=["bhai sahab bazaar chalenge", "bazaar chalenge"])
P("b.chalenge-kitna", "Bazaar chalenge? Kitna kiraya?", "بازار چلیں گے؟ کتنا کرایہ؟", "Bazaar? How much?", accept=["kitna kiraya", "bazaar kitna kiraya"])
P("b.paanch-sau", "Paanch sau", "پانچ سو", "Five hundred", speaker="pervez")
P("b.bohat-zyada-do-sau", "Bohat zyada hai! Do sau", "بہت زیادہ ہے! دو سو", "That's way too much! Two hundred", accept=["bohat zyada hai do sau", "do sau"])
P("b.theek-hai-paanch", "Theek hai, chaliye", "ٹھیک ہے، چلیے", "Fine, let's go", accept=["theek hai chaliye", "chaliye"])
P("b.teen-sau-aakhri", "Teen sau. Aakhri daam!", "تین سو۔ آخری دام!", "Three hundred. Final price!", speaker="pervez")
P("b.rehne-dein", "Rehne dein, bhai", "رہنے دیں بھائی", "Forget it, brother", accept=["rehne dein", "rehne do bhai"])
P("b.achha-dhai-sau", "Achha achha! Dhai sau. Baithiye", "اچھا اچھا! ڈھائی سو۔ بیٹھیے", "Okay, okay! Two-fifty. Get in", speaker="pervez")
P("b.overpaid", "Bismillah! Aap jaise sawari roz nahin milti", "بسم اللہ! آپ جیسی سواری روز نہیں ملتی", "Bismillah! Passengers like you don't come every day", speaker="pervez")
P("b.speed", "Aur ab hum chalenge… tez!", "اور اب ہم چلیں گے… تیز!", "And now we go… FAST!", speaker="pervez")
P("b.aahista", "Bhai, aahista chalaiye!", "بھائی، آہستہ چلائیے!", "Brother, drive slowly!", accept=["aahista chalaiye", "bhai aahista"])
P("b.ya-allah", "Ya Allah!", "یا اللہ!", "Oh God!", accept=["ya allah"])
P("b.fikr-na", "Fikr na karein, main pandrah saal se chala raha hoon", "فکر نہ کریں، میں پندرہ سال سے چلا رہا ہوں", "Don't worry, I've been driving for fifteen years", speaker="pervez")
P("b.yahan-rukiye", "Bas, yahan rukiye. Shukriya!", "بس، یہاں رکیے۔ شکریہ!", "Okay, stop here. Thanks!", accept=["yahan rukiye", "bas yahan rukiye shukriya"])
P("b.khuda-hafiz", "Khuda hafiz! Phir milenge!", "خدا حافظ! پھر ملیں گے!", "Bye! See you again!", speaker="pervez")

L = []
L.append({"id": "u06-l1", "title": "Aaiye, baithiye", "blurb": "Polite commands: the -iye ending that makes anything respectful.", "canDo": "You can give polite commands and invitations",
 "teach": [info("Two ways to tell someone to do something", "To a friend or kid: stem + o (ruko, baitho, chalo). To an elder or stranger: stem + iye (rukiye, baithiye, chaliye). Same verb, different respect level."),
   u.teach("aaiye", "Every host's first word."), u.teach("baithiye"), u.teach("baitho", "To your little cousin."), u.teach("chalo", "Also means 'okay, fine' and 'anyway'. Versatile."), u.teach("chaliye"), u.teach("ruko"), u.teach("rukiye")],
 "exercises": [u.respect("Nani walks into your flat for the first time.", "Nani", [("aaiye", "right", "Perfect. 'Aaiye' plus a little bow and she's yours."), ("baitho", "wrong", "You just told Nani to sit like she's six."), ("chalo", "wrong", "'Chalo' at the door sounds like you're kicking her out.")]),
   u.match("aaiye", "baithiye", "chaliye", "rukiye"), u.gap("baithiye", ("baithiye", "بیٹھیے"), [("baitho", "بیٹھو"), ("baith", "بیٹھ")]) | {"explain": "-iye is the respectful ending"},
   u.say("chalo", "Hurry your cousin along: “Come on, let's go!”", ["rukiye", "baithiye"]), u.listen("baithiye"), u.type("rukiye", "Ask a driver, politely, to stop."), u.type("aaiye", "Welcome a guest in: “Please come in”"), u.speak("aaiye")]})
L.append({"id": "u06-l2", "title": "Seedha, daayen, baayen", "blurb": "Directions, for when Google Maps gives up in the old city.", "canDo": "You can give and follow simple directions",
 "teach": [u.teach("seedha"), u.teach("daayen", "Daayen = right."), u.teach("baayen", "Baayen = left. They rhyme. Good luck."), u.teach("yahan-rukiye"), u.teach("aahista", "Possibly the most-used phrase in any Pakistani rickshaw.")],
 "exercises": [u.match("seedha", "daayen", "baayen", "yahan-rukiye"), u.listen("daayen", True), u.listen("baayen", True), u.say("yahan-rukiye", "You've arrived. Tell the driver to stop.", ["seedha", "aahista"]), u.type("seedha", "Type: “Go straight on”"), u.build("aahista"), u.type("baayen", "Type: “Turn left”")]})
L.append({"id": "u06-l3", "title": "Kahan hai?", "blurb": "Where things are: ke paas, ke saamne, ke peeche.", "canDo": "You can ask where something is and understand the answer",
 "teach": [info("Postpositions", "English puts 'near' before the noun. Urdu puts it after, with ke: ghar ke paas (house near), dukaan ke saamne (shop in-front-of), masjid ke peeche (mosque behind). 'In' is just mein: bazaar mein."),
   u.teach("masjid-kahan"), u.teach("washroom-kahan"), u.teach("ghar-ke-paas"), u.teach("dukaan-saamne"), u.teach("masjid-peeche"), u.teach("bazaar-mein")],
 "exercises": [u.meaning("dukaan-saamne"), u.match("ghar-ke-paas", "dukaan-saamne", "masjid-peeche", "bazaar-mein"), u.gap("ghar-ke-paas", ("paas", "پاس"), [("peeche", "پیچھے"), ("saamne", "سامنے")], "paas = near"),
   u.type("washroom-kahan", "The most important question: where's the bathroom?"), u.listen("masjid-peeche"), u.build("masjid-kahan", extra=[("kab", "کب")]), u.type("bazaar-mein", "Type: “in the bazaar”")]})
L.append({"id": "u06-l4", "title": "Kitna kiraya?", "blurb": "Haggling: the sacred dance between you and every rickshaw-wala.", "canDo": "You can negotiate a fare without being fleeced (much)",
 "teach": [info("The haggling script", "1. Ask if they'll go. 2. Ask the fare. 3. Gasp. 4. Counter at about half. 5. Walk away if needed. 6. They call you back. Never skip the gasp."),
   u.teach("bazaar-chalenge"), u.teach("kitna-kiraya"), u.teach("bohat-zyada"), u.teach("do-sau-theek"), u.teach("aakhri-daam"), u.teach("rehne-dein")],
 "exercises": [u.say("bazaar-chalenge", "Flag down a rickshaw. Ask if he'll go to the bazaar.", ["kitna-kiraya", "rehne-dein"]), u.say("bohat-zyada", "He says 500 rupees. React.", ["do-sau-theek", "aakhri-daam"]), u.listen("aakhri-daam", True),
   u.mc("He won't go below 300. What's the classic move?", [("“Rehne dein” and walk away slowly", "Textbook. He'll shout '250!' within three steps."), ("Pay 300 immediately", "He'll be telling this story at dinner.")]), u.type("kitna-kiraya", "Type: “What's the fare?”"), u.type("rehne-dein", "The walk-away line: “Forget it, then”"), u.build("bohat-zyada"), u.speak("bohat-zyada")]})
L.append({"id": "u06-l5", "title": "Dhaba time", "blurb": "Order chai and samosas at a roadside dhaba, pay, leave happy.", "canDo": "You can order at a dhaba and ask for the bill",
 "teach": [u.teach("do-chai-samosa", "Numbers come before the thing: do chai, ek samosa."), u.teach("u03.mujhe-chai"), u.teach("bill", "Casual code-switch. Everyone says bill."), u.teach("u03.paani-milega")],
 "exercises": [u.say("do-chai-samosa", "Order two teas and one samosa.", ["bill", "kitna-kiraya"]), u.listen("bill"), u.build("do-chai-samosa", extra=[("teen", "تین")]), u.type("bill", "Ask for the bill"),
   u.mc("At the dhaba, what do you call the waiter?", [("Bhai, or Bhai sahab", "Exactly. Everyone is bhai."), ("Waiter!", "He'll come. Eventually. After serving everyone who called him bhai.")]), u.type("do-chai-samosa", "Order: “Two teas, one samosa”")]})

n, y, o = u.npc, u.you, u.opt
boss = {"id": "u06-boss", "title": "Pervez and the Fare", "character": "pervez",
 "blurb": "You need to get to the bazaar. Pervez has a rickshaw, a price, and no change.",
 "scene": "Lahore, 4pm, 38°C. A rickshaw sputters to a stop in front of you. The driver, Pervez, leans out with the confidence of a man who has never lost a negotiation.",
 "canDo": "You can haggle a rickshaw fare and give directions on the way",
 "start": "a",
 "nodes": {
  "a": n("pervez", "b.kahan-jana", "b"),
  "b": y("Ask if he'll go to the bazaar (and how much).", [o("b.bazaar-chalenge", "c", "great"), o("b.chalenge-kitna", "c", "fine")], "Bhai sahab, bazaar…"),
  "c": n("pervez", "b.paanch-sau", "d"),
  "d": y("Five hundred. Respond.", [o("b.bohat-zyada-do-sau", "e", "great", "The gasp was perfect. He nods with grudging respect."), o("b.theek-hai-paanch", "over", "bold", "You accepted the first price. Somewhere, every Pakistani aunty felt a disturbance.")], "Bohat zyada…"),
  "over": n("pervez", "b.overpaid", "ride"),
  "e": n("pervez", "b.teen-sau-aakhri", "f"),
  "f": y("He says 300 is final. Is it?", [o("b.rehne-dein", "g", "great", "You turn and walk. One step. Two steps…"), o("b.theek-hai-paanch", "ride", "fine", "Three hundred. Respectable.")], "Rehne dein…"),
  "g": n("pervez", "b.achha-dhai-sau", "ride"),
  "ride": n("pervez", "b.speed", "h"),
  "h": y("He's driving like it's a Fast & Furious audition.", [o("b.aahista", "i", "great"), o("b.ya-allah", "i", "fine")], "Bhai, aahista…"),
  "i": n("pervez", "b.fikr-na", "j"),
  "j": y("You've arrived. Stop him.", [o("b.yahan-rukiye", "k", "great"), o("u06.rukiye", "k", "fine")], "Yahan rukiye…"),
  "k": n("pervez", "b.khuda-hafiz", "end"),
  "end": {"type": "end", "title": "Fare negotiated", "text": "You haggled, survived the drive and got out in one piece. Pervez didn't have change, obviously. You'll call it a tip.", "outcome": "arrived"}}}

meta = {"track": "speaking", "order": 6, "title": "Getting Around", "titleUrdu": "باہر", "emoji": "🛺",
 "tagline": "Directions, taking a rickshaw, haggling and ordering food.", "canDo": "You can get around a Pakistani city: directions, fares, ordering",
 "grammar": [{"title": "Commands: -o vs -iye", "body": "Tum form: stem + o (ruko, baitho, chalo). Aap form: stem + iye (rukiye, baithiye, chaliye). A softer aap form ends in -ein (rukein, chalein). Irregular: karo/kijiye (do), lo/lijiye (take), do/dijiye (give)."},
             {"title": "Postpositions", "body": "Urdu has 'post'-positions: they come after the noun. mein (in), par (on/at), se (from), tak (until), ko (to). Place words take ke: ghar ke paas (near the house), dukaan ke saamne (in front of the shop), masjid ke peeche (behind the mosque)."}]}
write_unit(u, meta, L, boss)
