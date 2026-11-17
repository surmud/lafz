"""Unit 9: All About You."""
from common import Unit, info, write_unit

u = Unit("u09")
P = u.P
P("kya-karte", "aap kya karte hain?", "آپ کیا کرتے ہیں؟", "What do you do (for work)?")
P("engineer", "main engineer hoon", "میں انجینئر ہوں", "I'm an engineer", register="casual", sense="job")
P("doctor-nahin", "main doctor nahin hoon", "میں ڈاکٹر نہیں ہوں", "I'm not a doctor", register="casual", note="Say it calmly. Your parents already know. They're just hoping.", sense="job")
P("parhai", "main parhai kar raha hoon", "میں پڑھائی کر رہا ہوں", "I'm studying (man)", sense="study", accept=["main padhai kar raha hoon"])
P("naukri", "main naukri karti hoon", "میں نوکری کرتی ہوں", "I have a job (woman)", sense="job", accept=["main naukri karti hun"])
P("rehta", "main London mein rehta hoon", "میں لندن میں رہتا ہوں", "I live in London (man)", sense="live")
P("rehti", "main Toronto mein rehti hoon", "میں ٹورنٹو میں رہتی ہوں", "I live in Toronto (woman)", sense="live")
P("cricket", "mujhe cricket pasand hai", "مجھے کرکٹ پسند ہے", "I like cricket", register="casual", sense="like")
P("khana-banana", "mujhe khana banana pasand hai", "مجھے کھانا بنانا پسند ہے", "I like cooking", sense="like")
P("kitaabein", "mujhe kitaabein parhna pasand hai", "مجھے کتابیں پڑھنا پسند ہے", "I like reading books", sense="like", accept=["mujhe kitaben parhna pasand hai"])
P("shauq", "aap ka shauq kya hai?", "آپ کا شوق کیا ہے؟", "What's your hobby?")
P("pakistan-gaya", "main Pakistan gaya tha", "میں پاکستان گیا تھا", "I went to Pakistan (man)", sense="went")
P("lahore-gaye", "hum Lahore gaye", "ہم لاہور گئے", "We went to Lahore", sense="went")
P("kal-aaya", "main kal aaya", "میں کل آیا", "I came yesterday (man)", sense="came")
P("kal-aayi", "main kal aayi", "میں کل آئی", "I came yesterday (woman)", sense="came")
P("so-gaya", "woh so gaya", "وہ سو گیا", "He fell asleep")
P("der-se-utha", "main der se utha", "میں دیر سے اٹھا", "I woke up late (man)")
P("kab-settle", "kab settle ho rahe ho?", "کب سیٹل ہو رہے ہو؟", "When are you settling down?", register="casual", note="Code for 'when are you getting married', with a side of 'and buying a house'.")
P("pehle-kaam", "abhi nahin, pehle kaam", "ابھی نہیں، پہلے کام", "Not yet. Work first")
P("tankhwah", "tankhwah kitni hai?", "تنخواہ کتنی ہے؟", "What's your salary?", note="Asked by aunties within minutes of meeting you. Legally.")
P("personal", "yeh personal hai, Aunty", "یہ پرسنل ہے آنٹی", "That's personal, Aunty", register="casual")
P("guzara", "guzara ho jata hai", "گزارا ہو جاتا ہے", "I get by", note="The perfect non-answer to the salary question.")
# boss
P("b.bilal-hi", "Arre! Kaise ho? Main abhi hospital se aaya", "ارے! کیسے ہو؟ میں ابھی ہسپتال سے آیا", "Hey! How are you? I just got back from the hospital", speaker="bilal", register="casual")
P("b.theek-tum", "Theek hoon, Bilal. Tum sunao?", "ٹھیک ہوں بلال۔ تم سناؤ؟", "I'm fine, Bilal. What's new with you?", accept=["theek hoon tum sunao", "tum sunao"])
P("b.bilal-surgery", "Bas, aaj teen surgery ki. Tum kya karte ho aaj kal?", "بس، آج تین سرجری کیں۔ تم کیا کرتے ہو آج کل؟", "Oh, just did three surgeries today. What are you up to these days?", speaker="bilal", register="casual")
P("b.engineer", "Main engineer hoon", "میں انجینئر ہوں", "I'm an engineer", accept=["main engineer hoon"])
P("b.parhai", "Main abhi parhai kar raha hoon", "میں ابھی پڑھائی کر رہا ہوں", "I'm still studying", accept=["main parhai kar raha hoon", "main parhai kar rahi hoon"])
P("b.bilal-engineer", "Achha, engineer. Bohat achha. Mere ek patient bhi engineer hain", "اچھا، انجینئر۔ بہت اچھا۔ میرے ایک مریض بھی انجینئر ہیں", "Oh, engineer. Very nice. One of my patients is an engineer too", speaker="bilal", register="casual")
P("b.bilal-parhai", "Abhi tak parhai? Main to pachees saal mein doctor ban gaya tha", "ابھی تک پڑھائی؟ میں تو پچیس سال میں ڈاکٹر بن گیا تھا", "Still studying? I was a doctor by twenty-five", speaker="bilal")
P("b.bilal-shauq", "Aur shauq? Main weekend pe golf khelta hoon", "اور شوق؟ میں ویک اینڈ پہ گالف کھیلتا ہوں", "And hobbies? I play golf on weekends", speaker="bilal", register="casual")
P("b.cooking", "Mujhe khana banana pasand hai", "مجھے کھانا بنانا پسند ہے", "I like cooking", accept=["mujhe khana banana pasand hai"])
P("b.cricket", "Mujhe cricket pasand hai. Tum golf hi khelo", "مجھے کرکٹ پسند ہے۔ تم گالف ہی کھیلو", "I like cricket. You stick to golf", register="casual", accept=["mujhe cricket pasand hai"])
P("b.bilal-cook", "Khana? Waah. Nani ko bataunga, khush hongi", "کھانا؟ واہ۔ نانی کو بتاؤں گا، خوش ہوں گی", "Cooking? Nice. I'll tell Nani, she'll be pleased", speaker="bilal")
P("b.bilal-cricket", "Haha! Achha, tum Pakistan kab gaye the?", "ہاہا! اچھا، تم پاکستان کب گئے تھے؟", "Haha! Okay, when did you last go to Pakistan?", speaker="bilal", register="casual")
P("b.pakistan-gaya", "Main pichhle saal Pakistan gaya tha", "میں پچھلے سال پاکستان گیا تھا", "I went to Pakistan last year", accept=["main pichhle saal pakistan gaya tha", "main pakistan gaya tha", "main pichhle saal pakistan gayi thi"])
P("b.bilal-bye", "Zabardast. Chalo, mera pager baj raha hai. Phir milte hain!", "زبردست۔ چلو، میرا پیجر بج رہا ہے۔ پھر ملتے ہیں!", "Brilliant. Right, my pager's going off. See you!", speaker="bilal", register="casual")
P("b.bye-doctor", "Khuda hafiz, Doctor sahab", "خدا حافظ ڈاکٹر صاحب", "Bye, Doctor sahab", accept=["khuda hafiz doctor sahab", "khuda hafiz"])

L = []
L.append({"id": "u09-l1", "title": "Aap kya karte hain?", "blurb": "Your job, your studies, and your parents' hopes.", "canDo": "You can say what you do and where you live",
 "teach": [u.teach("kya-karte", "The 'karte hain' (habitual) means 'do, generally'."), u.teach("engineer", "Most job titles are just English. Easy."), u.teach("doctor-nahin"), u.teach("parhai"), u.teach("naukri"), u.teach("rehta"), u.teach("rehti", "rehta / rehti: the -ta/-ti ending shows habits, and your gender.")],
 "exercises": [u.meaning("kya-karte"), u.say("engineer", "An uncle asks what you do. You're an engineer.", ["doctor-nahin", "parhai"]), u.gap("rehti", ("rehti", "رہتی"), [("rehta", "رہتا"), ("rehte", "رہتے")], "a woman speaking → rehti"),
   u.listen("naukri"), u.type("rehta", "You're a guy. Type: “I live in London”"), u.type("kya-karte", "Ask an elder: “What do you do?”"), u.build("doctor-nahin", extra=[("hai", "ہے")])]})
L.append({"id": "u09-l2", "title": "Shauq", "blurb": "Hobbies, and why 'Netflix' is not one in front of Abbu.", "canDo": "You can talk about what you like doing",
 "teach": [u.teach("shauq"), info("Liking activities", "'I like cooking' = mujhe khana banana pasand hai. Use the full verb (banana, parhna, khelna) before pasand hai."), u.teach("cricket", "Every Pakistani family's shared religion, after the actual one."), u.teach("khana-banana"), u.teach("kitaabein")],
 "exercises": [u.say("kitaabein", "Tell Nani you like reading books. (She'll approve.)", ["cricket", "khana-banana"]), u.meaning("shauq"), u.listen("khana-banana", True), u.build("cricket", extra=[("hoon", "ہوں")]), u.type("shauq", "Ask: “What's your hobby?”"), u.type("khana-banana", "Type: “I like cooking”")]})
L.append({"id": "u09-l3", "title": "Main gaya tha", "blurb": "The simple past: went, came, slept, woke up late.", "canDo": "You can say where you went and what happened",
 "teach": [info("Simple past (motion verbs)", "For verbs like go, come, sleep, wake: stem + a/i/e matches the subject's gender. main gaya (I went, man), main gayi (woman), hum gaye (we went). Add 'tha' for further back: main Pakistan gaya tha."),
   u.teach("pakistan-gaya"), u.teach("lahore-gaye"), u.teach("kal-aaya"), u.teach("kal-aayi"), u.teach("so-gaya", "Also what happens to every uncle after biryani."), u.teach("der-se-utha")],
 "exercises": [u.gap("kal-aayi", ("aayi", "آئی"), [("aaya", "آیا"), ("aaye", "آئے")], "a woman → aayi"), u.say("lahore-gaye", "Tell your friend your family went to Lahore.", ["pakistan-gaya", "kal-aaya"]), u.listen("so-gaya"),
   u.meaning("der-se-utha"), u.type("pakistan-gaya", "You're a guy. Type: “I went to Pakistan”"), u.build("lahore-gaye", extra=[("gaya", "گیا")]), u.speak("pakistan-gaya")]})
L.append({"id": "u09-l4", "title": "Settle kab?", "blurb": "Salary, settling down, and the art of the non-answer.", "canDo": "You can deflect nosy questions about money and marriage politely",
 "teach": [u.teach("kab-settle"), u.teach("pehle-kaam"), u.teach("tankhwah"), u.teach("guzara", "Polite, vague, unbeatable."), u.teach("personal", "The nuclear option. Use sparingly.")],
 "exercises": [u.respect("Mrs. Butt asks your salary at a dawat.", "Mrs. Butt", [("guzara", "right", "Elegant. She'll never know, and she knows she'll never know."), ("personal", "ok", "Fair, but she'll tell everyone you're 'very private'. Which means 'unemployed'."), ("engineer", "wrong", "She asked for a number. You gave a job title. She's now guessing. Loudly.")]),
   u.meaning("kab-settle"), u.listen("tankhwah", True), u.type("pehle-kaam", "Type: “Not yet. Work first”"), u.type("guzara", "Type the perfect non-answer: “I get by”")]})

n, y, o = u.npc, u.you, u.opt
boss = {"id": "u09-boss", "title": "Doctor Bilal", "character": "bilal",
 "blurb": "Cousin Bilal, MD, wants to 'catch up'. It's a competition. It's always been a competition.",
 "scene": "Eid lunch at Nani's. You're filling your plate when a hand claps your shoulder. It's Bilal, still in scrubs (on purpose), stethoscope round his neck (also on purpose).",
 "canDo": "You can talk about your work, hobbies and travels with family, even Bilal",
 "start": "a",
 "nodes": {
  "a": n("bilal", "b.bilal-hi", "b"),
  "b": y("Answer, then turn it back on him.", [o("b.theek-tum", "c", "great", "'Tum sunao' (you tell me): mistake. He will."), o("u01.alhamdulillah", "c", "fine")], "Theek hoon…"),
  "c": n("bilal", "b.bilal-surgery", "d"),
  "d": y("Tell him what you do.", [o("b.engineer", "e1", "great"), o("b.parhai", "e2", "fine")], "Main engineer…"),
  "e1": n("bilal", "b.bilal-engineer", "f"),
  "e2": n("bilal", "b.bilal-parhai", "f"),
  "f": n("bilal", "b.bilal-shauq", "g"),
  "g": y("Your hobby. Make it count.", [o("b.cooking", "h1", "great", "The Nani play. Masterful."), o("b.cricket", "h2", "bold", "Golf burn. The uncles nearby nod in approval.")], "Mujhe … pasand hai"),
  "h1": n("bilal", "b.bilal-cook", "i"),
  "h2": n("bilal", "b.bilal-cricket", "i"),
  "i": y("Talk about your last trip to Pakistan.", [o("b.pakistan-gaya", "j", "great"), o("u09.pakistan-gaya", "j", "fine")], "Main pichhle saal…"),
  "j": n("bilal", "b.bilal-bye", "k"),
  "k": y("He's leaving. (Nobody has used a pager since 2003.)", [o("b.bye-doctor", "end", "great", "'Doctor sahab'. Sarcasm, perfectly deniable."), o("u01.khuda-hafiz", "end", "fine")], "Khuda hafiz…"),
  "end": {"type": "end", "title": "Survived Doctor Bilal", "text": "Job, hobbies, past trips: all in Urdu, against the family's undefeated champion. Nani watched the whole thing. She gave you the extra kebab.", "outcome": "survived"}}}

meta = {"track": "speaking", "order": 9, "title": "About You", "titleUrdu": "آپ کے بارے میں", "emoji": "🧑‍💻",
 "tagline": "Work, studies, hobbies and where you've been.", "canDo": "You can talk about your life: work, hobbies, where you've been",
 "grammar": [{"title": "Habits: -ta hoon", "body": "Stem + ta/ti/te + hoon/hai/hain describes habits and general facts: main London mein rehta hoon (I live in London), aap kya karte hain? (what do you do?)."},
             {"title": "Simple past (verbs of motion)", "body": "Stem + a/i/e, matching the subject: main gaya / gayi, hum gaye, woh aaya / aayi. Add tha/thi/the to push it further into the past: main Pakistan gaya tha. Transitive verbs (eat, say, do) use 'ne' instead: that's Unit 10."}]}
write_unit(u, meta, L, boss)
