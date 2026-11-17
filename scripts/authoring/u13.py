"""Unit 13: Survival Kit. Conversation repair and emergencies."""
from common import Unit, info, write_unit

u = Unit("u13")
P = u.P
# repair
P("samajh-nahin", "mujhe samajh nahin aayi", "مجھے سمجھ نہیں آئی", "I didn't understand", accept=["mujhe samajh nahin aaya", "samajh nahin aayi", "samajh nahin aaya"], hook="samajh = understanding. It 'didn't come' to you: nahin aayi.")
P("dobara", "dobara kahiye", "دوبارہ کہیے", "Please say that again", accept=["dobara kahiye please", "phir se kahiye"], hook="do-bara: 'two times'.")
P("aahista-boliye", "zara aahista boliye", "ذرا آہستہ بولیے", "Please speak a bit slower", accept=["aahista boliye", "zara ahista boliye"])
P("likh-dijiye", "likh dijiye", "لکھ دیجیے", "Please write it down", accept=["likh dijiyega", "likh dein"])
P("kya-kehte", "isko Urdu mein kya kehte hain?", "اس کو اردو میں کیا کہتے ہیں؟", "What's this called in Urdu?", accept=["is ko urdu mein kya kehte hain", "isay urdu mein kya kehte hain", "ise urdu mein kya kehte hain"])
P("matlab", "iska matlab kya hai?", "اس کا مطلب کیا ہے؟", "What does this mean?", accept=["is ka matlab kya hai", "iska kya matlab hai"])
P("thori-urdu", "mujhe thori thori Urdu aati hai", "مجھے تھوڑی تھوڑی اردو آتی ہے", "I know a little Urdu", literal="a little little Urdu comes to me", accept=["mujhe thori urdu aati hai", "mujhe thodi thodi urdu aati hai"])
P("seekh-raha", "main Urdu seekh raha hoon", "میں اردو سیکھ رہا ہوں", "I'm learning Urdu (man)", sense="learning", accept=["main urdu seekh rahi hoon"])
P("seekh-rahi", "main Urdu seekh rahi hoon", "میں اردو سیکھ رہی ہوں", "I'm learning Urdu (woman)", sense="learning", accept=["main urdu seekh raha hoon"])
P("angrezi", "kya aapko angrezi aati hai?", "کیا آپ کو انگریزی آتی ہے؟", "Do you speak English?", literal="does English come to you?", accept=["aapko angrezi aati hai", "kya aapko english aati hai", "aap ko english aati hai"])
# emergencies
P("madad", "madad kijiye!", "مدد کیجیے!", "Please help!", accept=["meri madad kijiye", "madad karein"])
P("bachao", "bachao!", "بچاؤ!", "Help! (save me!)", note="The shout. For actual emergencies, and for when Khala brings out the photo albums.")
P("khatra", "khatra", "خطرہ", "danger", note="On signs: electricity boxes, building sites, some staircases.")
P("police", "police ko bulaiye", "پولیس کو بلائیے", "Call the police", sense="call")
P("doctor", "doctor ko bulaiye", "ڈاکٹر کو بلائیے", "Call a doctor", sense="call")
P("hospital", "mujhe hospital jana hai", "مجھے ہسپتال جانا ہے", "I need to go to the hospital", accept=["mujhe haspatal jana hai"])
# lost and broke
P("raasta-bhool", "main raasta bhool gaya hoon", "میں راستہ بھول گیا ہوں", "I'm lost (man)", literal="I've forgotten the way", sense="lost", accept=["main raasta bhool gayi hoon", "main rasta bhool gaya hoon"])
P("raasta-bhool-f", "main raasta bhool gayi hoon", "میں راستہ بھول گئی ہوں", "I'm lost (woman)", sense="lost", accept=["main raasta bhool gaya hoon", "main rasta bhool gayi hoon"])
P("phone-kho", "mera phone kho gaya hai", "میرا فون کھو گیا ہے", "I've lost my phone", accept=["mera phone gum ho gaya hai"])
P("batwa-chori", "mera batwa chori ho gaya hai", "میرا بٹوا چوری ہو گیا ہے", "My wallet's been stolen", accept=["mera batua chori ho gaya hai", "mera wallet chori ho gaya hai"])
P("paise-nahin", "mere paas paise nahin hain", "میرے پاس پیسے نہیں ہیں", "I don't have any money", literal="near me money is not")
P("phone-kar", "kya main ek phone kar sakta hoon?", "کیا میں ایک فون کر سکتا ہوں؟", "Can I make a phone call? (man)", sense="call-can", accept=["kya main ek phone kar sakti hoon", "kya main phone kar sakta hoon"])
P("phone-kar-f", "kya main ek phone kar sakti hoon?", "کیا میں ایک فون کر سکتی ہوں؟", "Can I make a phone call? (woman)", sense="call-can", accept=["kya main ek phone kar sakta hoon", "kya main phone kar sakti hoon"])
P("charger", "aap ke paas charger hai?", "آپ کے پاس چارجر ہے؟", "Do you have a charger?", accept=["kya aap ke paas charger hai", "aapke paas charger hai"])
P("pata", "mera pata yeh hai", "میرا پتا یہ ہے", "This is my address", accept=["yeh mera pata hai"])
# health
P("tabiyat", "meri tabiyat kharab hai", "میری طبیعت خراب ہے", "I'm not feeling well", accept=["meri tabiyat theek nahin hai", "meri tabiat kharab hai"])
P("allergy", "mujhe moongphali se allergy hai", "مجھے مونگ پھلی سے الرجی ہے", "I'm allergic to peanuts", accept=["mujhe moong phali se allergy hai"])
P("dawai", "mujhe dawai chahiye", "مجھے دوائی چاہیے", "I need medicine", accept=["mujhe dawa chahiye"])
P("zaroori", "yeh bohat zaroori hai", "یہ بہت ضروری ہے", "This is very important")
P("theek-hoon", "main theek hoon", "میں ٹھیک ہوں", "I'm okay")
P("koi-baat-nahin", "koi baat nahin", "کوئی بات نہیں", "No problem / never mind")
# scene lines
P("b.s-pervez-fast", "Jaldi baithiye, jaldi! Kahan jana hai?", "جلدی بیٹھیے، جلدی! کہاں جانا ہے؟", "Get in, quick, quick! Where to?", speaker="pervez")
P("b.s-ammi-slow", "Bhai, zara aahista boliye. Bachche ko samajh nahin aayi", "بھائی، ذرا آہستہ بولیے۔ بچے کو سمجھ نہیں آئی", "Brother, speak a bit slower. The kid didn't understand", speaker="ammi")
P("b.s-khala-chor", "Chor! Chor! Mera batwa chori ho gaya hai!", "چور! چور! میرا بٹوا چوری ہو گیا ہے!", "Thief! Thief! My wallet's been stolen!", speaker="khala")
P("b.s-abbu-police", "Main police ko bulata hoon", "میں پولیس کو بلاتا ہوں", "I'll call the police", speaker="abbu")
P("b.s-khala-found", "Ruko… batwa mere bag mein hai", "رکو… بٹوا میرے بیگ میں ہے", "Wait… the wallet's in my bag", speaker="khala")
P("b.s-nani-tabiyat", "Meri tabiyat kharab hai. Mujhe dawai chahiye", "میری طبیعت خراب ہے۔ مجھے دوائی چاہیے", "I'm not feeling well. I need medicine", speaker="nani")
P("b.s-bilal-dawai", "Nani, yeh dawai lijiye. Aur aaram kijiye", "نانی، یہ دوائی لیجیے۔ اور آرام کیجیے", "Nani, take this medicine. And rest", speaker="bilal")
# boss
P("b.bashir-1", "Ji, aaiye aaiye! Kya chahiye?", "جی، آئیے آئیے! کیا چاہیے؟", "Yes, come in, come in! What do you need?", speaker="bashir")
P("b.you-lost", "Maaf kijiye, main raasta bhool gaya hoon", "معاف کیجیے، میں راستہ بھول گیا ہوں", "Excuse me, I'm lost", accept=["maaf kijiye main raasta bhool gayi hoon", "main raasta bhool gaya hoon", "main raasta bhool gayi hoon"])
P("b.you-help", "Madad kijiye! Mera phone kho gaya hai", "مدد کیجیے! میرا فون کھو گیا ہے", "Please help! I've lost my phone", accept=["madad kijiye", "mera phone kho gaya hai"])
P("b.bashir-fast", "Arey! Aap seedha jaiye, phir baayen, phir chowk se daayen, phir masjid ke saamne!", "ارے! آپ سیدھا جائیے، پھر بائیں، پھر چوک سے دائیں، پھر مسجد کے سامنے!", "Oh! Go straight, then left, then right at the square, then it's opposite the mosque!", speaker="bashir")
P("b.you-slow", "Zara aahista boliye. Mujhe thori thori Urdu aati hai", "ذرا آہستہ بولیے۔ مجھے تھوڑی تھوڑی اردو آتی ہے", "Please speak a bit slower. I only know a little Urdu", accept=["zara aahista boliye", "aahista boliye"])
P("b.you-again", "Mujhe samajh nahin aayi. Dobara kahiye", "مجھے سمجھ نہیں آئی۔ دوبارہ کہیے", "I didn't understand. Please say it again", accept=["mujhe samajh nahin aaya dobara kahiye", "dobara kahiye", "mujhe samajh nahin aayi"])
P("b.bashir-slow", "Achha, achha. Seedha… phir baayen. Samajh aa gayi?", "اچھا، اچھا۔ سیدھا… پھر بائیں۔ سمجھ آ گئی؟", "Okay, okay. Straight… then left. Got it?", speaker="bashir")
P("b.you-call", "Ji. Kya main ek phone kar sakta hoon?", "جی۔ کیا میں ایک فون کر سکتا ہوں؟", "Yes. Can I make a phone call?", accept=["ji kya main ek phone kar sakti hoon", "kya main ek phone kar sakta hoon", "kya main ek phone kar sakti hoon"])
P("b.you-charger", "Ji. Aap ke paas charger hai?", "جی۔ آپ کے پاس چارجر ہے؟", "Yes. Do you have a charger?", accept=["aap ke paas charger hai"])
P("b.bashir-phone", "Haan haan, yeh lijiye. Pehle chai piyenge?", "ہاں ہاں، یہ لیجیے۔ پہلے چائے پئیں گے؟", "Yes yes, here you go. Tea first?", speaker="bashir")
P("b.you-thanks", "Bohat shukriya. Aap bohat achhe hain", "بہت شکریہ۔ آپ بہت اچھے ہیں", "Thank you so much. You're very kind", accept=["bohat shukriya", "shukriya aap bohat achhe hain"])
P("b.you-nopaise", "Shukriya, lekin mere paas paise nahin hain", "شکریہ، لیکن میرے پاس پیسے نہیں ہیں", "Thank you, but I don't have any money", accept=["lekin mere paas paise nahin hain", "mere paas paise nahin hain"])
P("b.bashir-end", "Koi baat nahin! Aap hamare mehmaan hain", "کوئی بات نہیں! آپ ہمارے مہمان ہیں", "No problem! You're our guest", speaker="bashir")
P("b.bashir-end2", "Paise? Mehmaan se paise? Tauba tauba!", "پیسے؟ مہمان سے پیسے؟ توبہ توبہ!", "Money? From a guest? Heaven forbid!", speaker="bashir")

L = []
L.append({"id": "u13-l1", "title": "Say that again?", "blurb": "The four phrases that rescue every conversation.", "canDo": "You can stop a conversation that's going too fast and get it repeated",
 "teach": [info("You're allowed to not understand", "Fluent speakers do this all day. Saying 'dobara kahiye' in Urdu keeps the conversation in Urdu. Switching to English ends it."),
   u.teach("samajh-nahin", "Many people say 'aaya' instead of 'aayi'. Both are understood."), u.teach("dobara"), u.teach("aahista-boliye", "zara = 'a bit'. It softens any request."), u.teach("likh-dijiye", "For addresses, names and prices.")],
 "exercises": [u.scene([("pervez", "b.s-pervez-fast"), ("ammi", "b.s-ammi-slow")], "What does Ammi ask Pervez to do?", ["Speak more slowly", ("Drive more slowly", "She says 'boliye' (speak), not 'chalaiye' (drive)."), ("Say the price again", "No price yet. He hasn't even started the meter.")], setup="Outside the airport. Pervez talks the way he drives."),
   u.meaning("samajh-nahin"), u.say("dobara", "The shopkeeper said a price and you missed it.", ["likh-dijiye", "aahista-boliye"]),
   u.spot("aahista-boliye", ("aahista", "آہستہ"), ("jaldi", "جلدی"), "jaldi means quickly. That's the opposite of what you need."),
   u.dictation("dobara"), u.type("samajh-nahin", "Type: “I didn't understand”"), u.type("aahista-boliye", "Type: “Please speak a bit slower”"), u.speak("dobara")]})
L.append({"id": "u13-l2", "title": "What's this called?", "blurb": "Turn every person you meet into a free Urdu teacher.", "canDo": "You can ask what a thing is called and what a word means",
 "teach": [u.teach("kya-kehte", "Point at anything and say this. People love being asked."), u.teach("matlab"), u.teach("thori-urdu", "aana (to come) is how Urdu says you know a language: it 'comes to you'."), u.teach("seekh-raha"), u.teach("seekh-rahi"), u.teach("angrezi", "Last resort. But now you can ask it in Urdu.")],
 "exercises": [u.say("kya-kehte", "You're holding a vegetable you've never seen before.", ["matlab", "angrezi"]), u.meaning("matlab"),
   u.gap("thori-urdu", ("aati", "آتی"), [("aata", "آتا"), ("hoon", "ہوں")], "Urdu (the language) is feminine, so it's aati hai."),
   u.spot("kya-kehte", ("kya", "کیا"), ("kahan", "کہاں"), "kahan asks 'where'. You want kya, 'what'."),
   u.listen("angrezi", True), u.build("matlab"), u.type("thori-urdu", "Type: “I know a little Urdu”"), u.dictation("kya-kehte"), u.speak("matlab")]})
L.append({"id": "u13-l3", "title": "Help!", "blurb": "Hopefully never needed. Learn it anyway.", "canDo": "You can call for help and say who you need",
 "teach": [u.teach("madad", "Polite and urgent at once."), u.teach("bachao"), u.teach("khatra"), u.teach("police", "X ko bulaiye: call X."), u.teach("doctor"), u.teach("hospital", "mujhe … jana hai: I need to go to …")],
 "exercises": [u.scene([("khala", "b.s-khala-chor"), ("abbu", "b.s-abbu-police"), ("khala", "b.s-khala-found")], "Where was Khala's wallet?", ["In her bag the whole time", ("A thief took it", "That's what she thought. Listen to her last line."), ("At the police station", "Abbu offered to call them. He didn't need to.")], setup="Liberty Market, Saturday afternoon.", hide=True),
   u.match("madad", "khatra", "police", "doctor"),
   u.sort("Who do you call?", ["Police", "Doctor"], [("@batwa-chori", 0), ("@tabiyat", 1), ("@phone-kho", 0), ("@allergy", 1), ("chor! (thief!)", 0), ("sar mein dard (a headache)", 1)]),
   u.listen("hospital"), u.type("madad", "Type: “Please help!”"), u.type("doctor", "Type: “Call a doctor”"), u.dictation("police"), u.speak("madad")]})
L.append({"id": "u13-l4", "title": "Lost and broke", "blurb": "No phone, no wallet, no idea where you are. A normal Tuesday in Anarkali.", "canDo": "You can explain that you're lost or that something's been lost or stolen",
 "teach": [info("gaya or gayi?", "The verb ending shows who is speaking: a man says bhool gaya hoon and kar sakta hoon, a woman says bhool gayi hoon and kar sakti hoon. Things have gender too: phone kho gaya (masculine), ghari kho gayi (feminine)."),
   u.teach("raasta-bhool"), u.teach("raasta-bhool-f"), u.teach("phone-kho"), u.teach("batwa-chori"), u.teach("paise-nahin", "mere paas = 'near me'. It's how Urdu says 'I have'."), u.teach("phone-kar"), u.teach("phone-kar-f"), u.teach("charger"), u.teach("pata")],
 "exercises": [u.sort("Who is speaking?", ["A man", "A woman"], [("seekh raha hoon", 0), ("seekh rahi hoon", 1), ("bhool gaya hoon", 0), ("bhool gayi hoon", 1), ("kar sakta hoon", 0), ("kar sakti hoon", 1)], "-a endings for a man, -i endings for a woman."),
   u.meaning("batwa-chori"), u.say("phone-kho", "You pat your pockets. Nothing.", ["batwa-chori", "paise-nahin"]),
   u.gap("paise-nahin", ("paas", "پاس"), [("ko", "کو"), ("se", "سے")], "mere paas … hai = I have …"),
   u.build("phone-kar"), u.listen("charger", True), u.type("raasta-bhool", "Type: “I'm lost”"), u.dictation("paise-nahin"), u.type("phone-kho", "Type: “I've lost my phone”")]})
L.append({"id": "u13-l5", "title": "At the pharmacy", "blurb": "Say what's wrong, say what you need, say what you can't eat.", "canDo": "You can say you're unwell, ask for medicine and mention an allergy",
 "teach": [u.teach("tabiyat", "tabiyat = how you're feeling in general. It covers everything from a cold to regret."), u.teach("dawai"), u.teach("allergy", "X se allergy: allergic 'from' X. Swap in doodh (milk), anda (egg), dhool (dust)."), u.teach("zaroori"), u.teach("theek-hoon"), u.teach("koi-baat-nahin")],
 "exercises": [u.scene([("nani", "b.s-nani-tabiyat"), ("bilal", "b.s-bilal-dawai")], "What does Bilal tell Nani to do?", ["Take the medicine and rest", ("Go to the hospital", "He's a doctor. He never misses a chance to prescribe at home."), ("Drink some chai", "For once, no.")]),
   u.spot("dawai", ("mujhe", "مجھے"), ("main", "میں"), "chahiye always takes mujhe ('to me'), never main."),
   u.meaning("allergy"), u.say("koi-baat-nahin", "Someone apologises for bumping into you.", ["theek-hoon", "zaroori"]),
   u.listen("tabiyat", True), u.type("dawai", "Type: “I need medicine”"), u.type("tabiyat", "Type: “I'm not feeling well”"), u.dictation("theek-hoon"), u.speak("allergy")]})

n, y, o = u.npc, u.you, u.opt
boss = {"id": "u13-boss", "title": "Lost in Anarkali", "character": "bashir",
 "blurb": "Phone dead, driver gone, and Bashir Bhai gives directions at full speed.",
 "scene": "Anarkali bazaar, late afternoon. You stepped out of the car to look at one thing. That was forty minutes ago. A shopkeeper waves you in.",
 "canDo": "You can get yourself out of trouble in Urdu: explain the problem, slow people down, ask for what you need",
 "start": "a",
 "nodes": {
  "a": n("bashir", "b.bashir-1", "b"),
  "b": y("Tell him what's wrong.", [o("b.you-lost", "c", "great"), o("b.you-help", "c", "fine")], "Maaf kijiye, main…"),
  "c": n("bashir", "b.bashir-fast", "d"),
  "d": y("That was far too fast.", [o("b.you-slow", "e", "great", "He grins. Foreign-returned, trying in Urdu: his favourite kind of customer."), o("b.you-again", "e", "fine")], "Zara aahista…"),
  "e": n("bashir", "b.bashir-slow", "f"),
  "f": y("You need to reach your family.", [o("b.you-call", "g", "great"), o("b.you-charger", "g", "fine")], "Kya main…"),
  "g": n("bashir", "b.bashir-phone", "h"),
  "h": y("He's handing you his phone and a cup of chai.", [o("b.you-thanks", "i1", "great"), o("b.you-nopaise", "i2", "bold", "He looks personally wounded.")], "Bohat shukriya…"),
  "i1": n("bashir", "b.bashir-end", "end"),
  "i2": n("bashir", "b.bashir-end2", "end"),
  "end": {"type": "end", "title": "You got yourself found", "text": "You explained the problem, slowed him down, and borrowed a phone, all in Urdu. Ammi is on her way. Bashir Bhai is on his second cup and is now telling you about his nephew in Manchester.", "outcome": "found"}}}

meta = {"track": "speaking", "order": 13, "title": "Survival Kit", "titleUrdu": "کام کی باتیں", "emoji": "🆘",
 "tagline": "When you don't understand, when you're lost, when you need help.", "canDo": "You can rescue a conversation and handle an emergency in Urdu",
 "grammar": [{"title": "aana: knowing a language", "body": "Skills 'come to you': mujhe Urdu aati hai (I know Urdu), kya aapko angrezi aati hai? (do you speak English?). The verb agrees with the language (feminine: aati)."},
             {"title": "ko bulaiye, se allergy, ke paas", "body": "doctor ko bulaiye (call a doctor). moongphali se allergy (allergic to peanuts). mere paas paise nahin hain (I have no money): 'paas' (near) is how Urdu says 'have' for things you carry."},
             {"title": "Who is speaking: -a or -i", "body": "A man says gaya hoon, raha hoon, sakta hoon. A woman says gayi hoon, rahi hoon, sakti hoon. The rest of the sentence stays the same."}]}
write_unit(u, meta, L, boss)
