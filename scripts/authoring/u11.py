"""Unit 11: Taunts, Banter & Desi Parent Lines."""
from common import Unit, info, write_unit

u = Unit("u11")
P = u.P
P("hum-umar", "hum tumhari umar mein…", "ہم تمہاری عمر میں…", "When we were your age…", note="The sentence is never finished. It doesn't need to be.")
P("bilal-dekho", "Bilal ko dekho!", "بلال کو دیکھو!", "Look at Bilal!", note="Substitute any high-achieving cousin.")
P("log-kya", "log kya kahenge?", "لوگ کیا کہیں گے؟", "What will people say?", note="The four most powerful words in South Asia.")
P("paise-darakht", "paise darakhton par nahin ugte", "پیسے درختوں پر نہیں اگتے", "Money doesn't grow on trees")
P("bas-karo", "bas karo!", "بس کرو!", "Stop it! / Enough!", sense="stop")
P("chup-karo", "chup karo!", "چپ کرو!", "Be quiet!", sense="stop")
P("dimagh", "dimagh kharab hai?", "دماغ خراب ہے؟", "Have you lost your mind?", accept=["dimaag kharab hai"])
P("apna-kaam", "jao, apna kaam karo", "جاؤ، اپنا کام کرو", "Go and mind your own business / do your work")
P("mat-sikhao", "mujhe mat sikhao", "مجھے مت سکھاؤ", "Don't teach me (I know better)")
P("ac-band", "AC band karo!", "اے سی بند کرو!", "Turn the AC off!", register="casual", note="Every desi dad's thermostat policy.")
P("kha-lo", "kha lo", "کھا لو", "Eat it (up)", sense="cv")
P("ho-gaya", "ho gaya", "ہو گیا", "It's done", sense="cv")
P("de-do", "mujhe de do", "مجھے دے دو", "Give it to me", sense="cv")
P("rakh-do", "wahan rakh do", "وہاں رکھ دو", "Put it there", sense="cv")
P("so-jao", "so jao!", "سو جاؤ!", "Go to sleep!", sense="cv")
P("bhool-gaya", "main bhool gaya", "میں بھول گیا", "I forgot (man)", sense="forgot")
P("bhool-gayi", "main bhool gayi", "میں بھول گئی", "I forgot (woman)", sense="forgot")
P("shayad-aaye", "shayad woh aaye", "شاید وہ آئے", "Maybe he'll come", sense="maybe")
P("kya-karoon", "main kya karoon?", "میں کیا کروں؟", "What should I do?", accept=["main kya karun"])
P("chalein", "chalein?", "چلیں؟", "Shall we go?", sense="go")
P("theek-keh-rahi", "aap theek keh rahi hain", "آپ ٹھیک کہہ رہی ہیں", "You're right (to a woman)", sense="right")
P("theek-keh-rahe", "aap theek keh rahe hain", "آپ ٹھیک کہہ رہے ہیں", "You're right (to a man)", sense="right")
P("chal-hat", "chal hat!", "چل ہٹ!", "Get lost! (playful, to a cousin)", register="intimate", note="Strictly for cousins and best friends. Never upward.")
P("smart-mat", "zyada smart mat bano", "زیادہ سمارٹ مت بنو", "Don't get too clever", register="casual")
# boss
P("b.ac", "Yeh AC kis ne chalaya? Bijli ka bill dekha hai?", "یہ اے سی کس نے چلایا؟ بجلی کا بل دیکھا ہے؟", "Who turned on the AC? Have you seen the electricity bill?", speaker="abbu", register="casual")
P("b.garmi-hai", "Abbu, bohat garmi hai!", "ابو، بہت گرمی ہے!", "Dad, it's really hot!", accept=["abbu bohat garmi hai", "bohat garmi hai"])
P("b.maine-nahin", "Maine nahin chalaya, Abbu", "میں نے نہیں چلایا ابو", "I didn't turn it on, Dad", accept=["maine nahin chalaya"])
P("b.hum-umar", "Garmi? Hum tumhari umar mein pankhe ke bina sote the!", "گرمی؟ ہم تمہاری عمر میں پنکھے کے بغیر سوتے تھے!", "Hot? At your age, we slept without a fan!", speaker="abbu")
P("b.to-kis-ne", "To kis ne chalaya? Bhoot ne?", "تو کس نے چلایا؟ بھوت نے؟", "Then who did? A ghost?", speaker="abbu")
P("b.ji-abbu", "Ji Abbu, aap theek keh rahe hain", "جی ابو، آپ ٹھیک کہہ رہے ہیں", "Yes Dad, you're right", accept=["aap theek keh rahe hain", "ji abbu"])
P("b.zamana", "Abbu, zamana badal gaya hai", "ابو، زمانہ بدل گیا ہے", "Dad, times have changed", accept=["zamana badal gaya hai"])
P("b.paise", "Paise darakhton par nahin ugte, beta", "پیسے درختوں پر نہیں اگتے بیٹا", "Money doesn't grow on trees, son", speaker="abbu")
P("b.zamana-react", "Zamana badla hai, bijli ka bill nahin! Bilal ko dekho, woh AC nahin chalata", "زمانہ بدلا ہے، بجلی کا بل نہیں! بلال کو دیکھو، وہ اے سی نہیں چلاتا", "Times changed, the electricity bill didn't! Look at Bilal, he doesn't use the AC", speaker="abbu", register="casual")
P("b.band-karta", "Achha, main band kar deta hoon", "اچھا، میں بند کر دیتا ہوں", "Okay, I'll switch it off", accept=["main band kar deta hoon", "main band kar deti hoon"])
P("b.bilal-hospital", "Bilal hospital mein rehta hai, Abbu. Wahan AC free hai", "بلال ہسپتال میں رہتا ہے ابو۔ وہاں اے سی فری ہے", "Bilal lives at the hospital, Dad. The AC's free there", register="casual", accept=["bilal hospital mein rehta hai"])
P("b.shabash-abbu", "Shabash. Aur khidki khol do, hawa aayegi", "شاباش۔ اور کھڑکی کھول دو، ہوا آئے گی", "Good. And open the window, there'll be a breeze", speaker="abbu")
P("b.bilal-react", "…Chalo, theek hai. Sirf ek ghanta. Aur darwaza band rakho!", "…چلو، ٹھیک ہے۔ صرف ایک گھنٹہ۔ اور دروازہ بند رکھو!", "…Fine. One hour only. And keep the door shut!", speaker="abbu")

L = []
L.append({"id": "u11-l1", "title": "Parent lines", "blurb": "The greatest hits. You've heard them all. Now understand them.", "canDo": "You can recognise (and quote) classic desi parent lines",
 "teach": [u.teach("hum-umar"), u.teach("bilal-dekho"), u.teach("log-kya"), u.teach("paise-darakht"), u.teach("ac-band"), u.teach("dimagh")],
 "exercises": [u.match("hum-umar", "log-kya", "paise-darakht", "ac-band"), u.meaning("log-kya"), u.listen("hum-umar", True), u.listen("paise-darakht", True), u.type("log-kya", "Type the four most powerful words: “What will people say?”"),
   u.mc("Abbu says “Hum tumhari umar mein…” How does the sentence end?", [("It doesn't. The point has been made.", "Correct. The silence IS the ending."), ("“…had the same problems”", "Never in history.")]), u.type("bilal-dekho", "Type: “Look at Bilal!”")]})
L.append({"id": "u11-l2", "title": "Bas karo!", "blurb": "Commands with attitude: stop it, be quiet, don't teach me.", "canDo": "You can understand (and carefully use) sharp everyday commands",
 "teach": [u.teach("bas-karo"), u.teach("chup-karo"), u.teach("apna-kaam"), u.teach("mat-sikhao", "mat = don't, for commands."), u.teach("chal-hat"), u.teach("smart-mat")],
 "exercises": [u.respect("Your little cousin keeps poking you.", "Little cousin", [("bas-karo", "right", "Firm and fine for a kid."), ("chal-hat", "ok", "Playful. Fine with cousins."), ("mat-sikhao", "wrong", "He's six. He's not teaching you anything.")]),
   u.respect("Abbu is explaining your phone to you. Wrongly.", "Abbu", [("theek-keh-rahe", "right", "Diplomacy. You'll fix it later when he's not looking."), ("mat-sikhao", "wrong", "Telling Abbu not to teach you? The lecture will now last until Maghrib."), ("chal-hat", "wrong", "We'll pray for you.")]),
   u.meaning("smart-mat"), u.listen("chup-karo"), u.type("bas-karo", "Type: “Stop it!”"), u.type("chup-karo", "Type: “Be quiet!”")]})
L.append({"id": "u11-l3", "title": "Kha lo, so jao", "blurb": "Compound verbs: the little helpers ja, le, de that finish the action.", "canDo": "You can use compound verbs like kha lo, de do, ho gaya",
 "teach": [info("Helper verbs", "Urdu often adds a second verb that adds a feeling: le (for yourself), de (for someone else), ja (completely / a change). kha (eat) + lo = eat it up. de (give) + do = hand it over. so (sleep) + jao = go to sleep. ho (be) + gaya = it's done."),
   u.teach("kha-lo"), u.teach("ho-gaya", "Also what you say when the homework 'is basically done'."), u.teach("de-do"), u.teach("rakh-do"), u.teach("so-jao"), u.teach("bhool-gaya"), u.teach("bhool-gayi")],
 "exercises": [u.match("kha-lo", "ho-gaya", "de-do", "so-jao"), u.gap("bhool-gayi", ("gayi", "گئی"), [("gaya", "گیا"), ("gaye", "گئے")], "a woman → gayi"), u.say("ho-gaya", "Ammi: “Homework?” It's done (it is not).", ["bhool-gaya", "so-jao"]), u.listen("rakh-do"),
   u.type("kha-lo", "Type what Nani says 40 times per visit: “Eat it up”"), u.type("bhool-gaya", "You're a guy. Type: “I forgot”"), u.build("de-do", extra=[("le", "لے")])]})
L.append({"id": "u11-l4", "title": "Shayad, karoon?", "blurb": "The subjunctive: maybe, should I, shall we.", "canDo": "You can say maybe, ask what you should do, and suggest plans",
 "teach": [info("The subjunctive", "For 'maybe', 'should I' and 'shall we', drop the ga/gi/ge from the future: shayad woh aaye (maybe he'll come), main kya karoon? (what should I do?), chalein? (shall we go?)."), u.teach("shayad-aaye"), u.teach("kya-karoon"), u.teach("chalein", "The polite way to end any visit."), u.teach("theek-keh-rahi"), u.teach("theek-keh-rahe")],
 "exercises": [u.meaning("kya-karoon"), u.say("chalein", "It's time to leave the dawat. Suggest it to your mum.", ["shayad-aaye", "kya-karoon"]), u.listen("shayad-aaye"), u.gap("theek-keh-rahi", ("rahi", "رہی"), [("rahe", "رہے"), ("raha", "رہا")], "to a woman → rahi"),
   u.type("chalein", "Type: “Shall we go?”"), u.type("theek-keh-rahe", "Agree with Abbu: “You're right”"), u.speak("kya-karoon")]})

n, y, o = u.npc, u.you, u.opt
boss = {"id": "u11-boss", "title": "The Thermostat War", "character": "abbu",
 "blurb": "It's 34°C. You turned on the AC. Abbu has noticed.",
 "scene": "A sweltering July afternoon. You've just turned on the AC and lain down. Footsteps. The AC beeps off. Abbu stands in the doorway with the remote and the electricity bill.",
 "canDo": "You can hold your own (respectfully) in a classic desi parent lecture",
 "start": "a",
 "nodes": {
  "a": n("abbu", "b.ac", "b"),
  "b": y("Defend yourself.", [o("b.garmi-hai", "c1", "fine"), o("b.maine-nahin", "c2", "bold", "A lie, with the remote's warmth still in your hand.")], "Abbu, bohat garmi…"),
  "c1": n("abbu", "b.hum-umar", "d"),
  "c2": n("abbu", "b.to-kis-ne", "d"),
  "d": y("Choose your strategy.", [o("b.ji-abbu", "e1", "great", "Strategic surrender. Wise beyond your years."), o("b.zamana", "e2", "bold")], "Ji Abbu…"),
  "e1": n("abbu", "b.paise", "f"),
  "e2": n("abbu", "b.zamana-react", "f"),
  "f": y("Final move.", [o("b.band-karta", "g1", "great"), o("b.bilal-hospital", "g2", "bold", "Using Bilal against Abbu. Nobody has tried this before. It works?!")], "Achha, main band…"),
  "g1": n("abbu", "b.shabash-abbu", "end"),
  "g2": n("abbu", "b.bilal-react", "end"),
  "end": {"type": "end", "title": "The war is over (for today)", "text": "You argued, conceded or out-witted your father, in Urdu, about the AC. Tomorrow it's the thermostat in the car.", "outcome": "survived"}}}

meta = {"track": "speaking", "order": 11, "title": "Family Talk", "emoji": "🙄",
 "tagline": "Common parent phrases, commands, compound verbs and 'maybe'.", "canDo": "You can follow and answer desi banter, taunts and lectures",
 "grammar": [{"title": "Compound verbs", "body": "Main verb stem + helper: le (for yourself), de (for others), ja (completion or change). kha lo, de do, so jao, ho gaya, bhool gaya. The helper carries the tense: main kha leta hoon, maine kha liya."},
             {"title": "Subjunctive", "body": "Future without ga/gi/ge: main karoon, tum karo, woh kare, hum/aap karein. Use it for maybe (shayad), should (main kya karoon?) and suggestions (chalein?)."}]}
write_unit(u, meta, L, boss)
