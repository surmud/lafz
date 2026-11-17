"""Unit 16 (advanced): Opinions and arguing."""
from common import Unit, info, write_unit

u = Unit("u16")
P = u.P
P("mere-khayal", "mere khayal mein", "میرے خیال میں", "in my opinion", literal="in my thought", accept=["mere khyal mein", "mere khayaal mein"])
P("meri-raaye", "meri raaye mein yeh ghalat hai", "میری رائے میں یہ غلط ہے", "In my view, this is wrong", accept=["meri raye mein yeh ghalat hai", "meri rai mein yeh galat hai"])
P("ittefaq", "main aap se ittefaq karta hoon", "میں آپ سے اتفاق کرتا ہوں", "I agree with you (man)", sense="agree", accept=["main aap se ittefaq karti hoon", "main aapse ittefaq karta hoon", "main aap se ittifaq karta hoon"])
P("ittefaq-f", "main aap se ittefaq karti hoon", "میں آپ سے اتفاق کرتی ہوں", "I agree with you (woman)", sense="agree", accept=["main aap se ittefaq karta hoon", "main aap se ittifaq karti hoon"])
P("ittefaq-nahin", "main is baat se ittefaq nahin karta", "میں اس بات سے اتفاق نہیں کرتا", "I don't agree with that (man)", accept=["main is baat se ittefaq nahin karti", "main is baat se ittifaq nahin karta"])
P("bilkul-sahi", "bilkul sahi", "بالکل صحیح", "exactly right", accept=["bilkul sahih", "bilkul theek"])
P("aisa-nahin", "aisa nahin hai", "ایسا نہیں ہے", "That's not how it is", accept=["aisa nahi hai"])
P("baat-yeh", "baat yeh hai ke…", "بات یہ ہے کہ…", "The thing is…", accept=["baat yeh hai ki", "baat ye hai ke"])
P("asal-mein", "asal mein", "اصل میں", "actually", accept=["asl mein"])
P("sach-to", "sach to yeh hai", "سچ تو یہ ہے", "The truth is", accept=["sach toh yeh hai"])
P("halanke", "halanke", "حالانکہ", "although", accept=["halaanke", "halanki", "halan ke"])
P("balke", "balke", "بلکہ", "but rather", accept=["balki"], note="Not 'but'. It corrects: 'not X, balke Y'.")
P("bawajood", "is ke bawajood", "اس کے باوجود", "despite that", accept=["iske bawajood", "is ke bavajood"])
P("is-liye", "is liye", "اس لیے", "that's why / so", accept=["isliye", "is liye"])
P("misaal", "misaal ke taur par", "مثال کے طور پر", "for example", accept=["misal ke taur par", "misaal ke tor par", "misaal ke taur pe"])
P("ek-taraf", "ek taraf… doosri taraf…", "ایک طرف… دوسری طرف…", "on one hand… on the other…", accept=["ek taraf doosri taraf", "ek taraf dusri taraf"])
P("aap-ki-baat", "aap ki baat theek hai, lekin…", "آپ کی بات ٹھیک ہے، لیکن…", "You have a point, but…", accept=["aap ki baat theek hai lekin", "aapki baat theek hai lekin"])
P("meri-baat", "pehle meri baat suniye", "پہلے میری بات سنیے", "Hear me out first", accept=["pehle meri baat sunein", "pehle meri baat suniyega"])
P("farq", "is se kya farq parta hai?", "اس سے کیا فرق پڑتا ہے؟", "What difference does it make?", accept=["isse kya farq padta hai", "is se kya farq padta hai"])
P("nahin-maanta", "main nahin maanta", "میں نہیں مانتا", "I don't accept that (man)", accept=["main nahin maanti", "main nahi manta"])
P("chhoriye", "chhoriye, chai peete hain", "چھوڑیے، چائے پیتے ہیں", "Let it go, let's have tea", accept=["chhodiye chai peete hain", "choriye chai peete hain"], note="How every argument in the family officially ends.")
# scene lines
P("b.s-bilal-cricket", "Mere khayal mein Pakistan zaroor jeetega", "میرے خیال میں پاکستان ضرور جیتے گا", "In my opinion Pakistan will definitely win", speaker="bilal")
P("b.s-abbu-cricket", "Aisa nahin hai. Bowling achhi hai, lekin batting kamzor hai", "ایسا نہیں ہے۔ بولنگ اچھی ہے، لیکن بیٹنگ کمزور ہے", "That's not how it is. The bowling's good, but the batting's weak", speaker="abbu")
P("b.s-nani-chai", "Chhoro yeh sab. Chai thandi ho rahi hai", "چھوڑو یہ سب۔ چائے ٹھنڈی ہو رہی ہے", "Forget all this. The tea's getting cold", speaker="nani")
P("b.s-khala-karachi", "Lahore achha hai, balke sab se achha hai", "لاہور اچھا ہے، بلکہ سب سے اچھا ہے", "Lahore is good. In fact, it's the best", speaker="khala")
P("b.s-ammi-karachi", "Halanke Karachi mein samandar hai", "حالانکہ کراچی میں سمندر ہے", "Although Karachi has the sea", speaker="ammi")
# boss
P("b.abbu-1", "Baat yeh hai ke hamare zamane mein sab kuch behtar tha", "بات یہ ہے کہ ہمارے زمانے میں سب کچھ بہتر تھا", "The thing is, in our day everything was better", speaker="abbu")
P("b.you-point", "Aap ki baat theek hai, lekin aaj bhi bohat kuch achha hai", "آپ کی بات ٹھیک ہے، لیکن آج بھی بہت کچھ اچھا ہے", "You have a point, but a lot is good today too", accept=["aap ki baat theek hai lekin aaj bhi bohat kuch achha hai"])
P("b.you-disagree", "Gustakhi maaf, main is baat se ittefaq nahin karta", "گستاخی معاف، میں اس بات سے اتفاق نہیں کرتا", "Pardon me, but I don't agree with that", accept=["gustakhi maaf main is baat se ittefaq nahin karti", "main is baat se ittefaq nahin karta", "main is baat se ittefaq nahin karti"])
P("b.abbu-2", "Misaal ke taur par? Koi ek cheez batao", "مثال کے طور پر؟ کوئی ایک چیز بتاؤ", "For example? Name one thing", speaker="abbu")
P("b.you-video", "Misaal ke taur par, ab hum Nani se video call kar sakte hain", "مثال کے طور پر، اب ہم نانی سے ویڈیو کال کر سکتے ہیں", "For example, now we can video call Nani", accept=["misaal ke taur par ab hum nani se video call kar sakte hain"])
P("b.you-phone", "Asal mein, aap bhi sara din phone pe hote hain", "اصل میں، آپ بھی سارا دن فون پہ ہوتے ہیں", "Actually, you're on your phone all day too", accept=["asal mein aap bhi sara din phone pe hote hain", "asal mein aap bhi saara din phone par hote hain"])
P("b.abbu-3a", "Halanke… achha, yeh baat to sahi hai", "حالانکہ… اچھا، یہ بات تو صحیح ہے", "Although… fine, that part is true", speaker="abbu")
P("b.abbu-3b", "Woh… woh alag baat hai. Main khabrein parhta hoon", "وہ… وہ الگ بات ہے۔ میں خبریں پڑھتا ہوں", "That… that's different. I read the news", speaker="abbu")
P("b.you-both", "Ek taraf purana zamana, doosri taraf naya. Dono achhe hain", "ایک طرف پرانا زمانہ، دوسری طرف نیا۔ دونوں اچھے ہیں", "On one hand the old days, on the other the new. Both are good", accept=["ek taraf purana zamana doosri taraf naya dono achhe hain"])
P("b.you-chai", "Chhoriye, chai peete hain", "چھوڑیے، چائے پیتے ہیں", "Let it go, let's have tea", accept=["chhodiye chai peete hain"])
P("b.abbu-end", "Shabash. Bahas karna bhi seekh gaye. Chalo, chai", "شاباش۔ بحث کرنا بھی سیکھ گئے۔ چلو، چائے", "Well done. You've learned to argue too. Come on, tea", speaker="abbu")

L = []
L.append({"id": "u16-l1", "title": "Mere khayal mein", "blurb": "Have an opinion. Say it out loud. In Urdu.", "canDo": "You can give your opinion and agree or disagree politely",
 "teach": [u.teach("mere-khayal", "Put it at the front of any sentence and it becomes an opinion instead of a fight."), u.teach("meri-raaye"), u.teach("ittefaq", "X se ittefaq karna: to agree 'from' X."), u.teach("ittefaq-f"), u.teach("ittefaq-nahin"), u.teach("bilkul-sahi"), u.teach("aisa-nahin", "Softer than 'you're wrong'. Means exactly the same.")],
 "exercises": [u.scene([("bilal", "b.s-bilal-cricket"), ("abbu", "b.s-abbu-cricket"), ("nani", "b.s-nani-chai")], "What does Abbu think is Pakistan's weak point?", ["The batting", ("The bowling", "He says the bowling is achhi. Listen for kamzor."), ("The tea", "That's Nani's concern, and it is a serious one.")], setup="Match day. The TV is on. So is everyone's opinion."),
   u.sort("Agree or disagree?", ["Agreeing", "Disagreeing"], [("@bilkul-sahi", 0), ("@aisa-nahin", 1), ("@ittefaq", 0), ("@ittefaq-nahin", 1), ("@meri-raaye", 1), ("ji haan, theek", 0)]),
   u.meaning("mere-khayal"), u.gap("ittefaq", ("se", "سے"), [("ko", "کو"), ("ka", "کا")], "You agree 'from' someone: aap se ittefaq."),
   u.dictation("aisa-nahin"), u.type("mere-khayal", "Type: “in my opinion”"), u.type("ittefaq-nahin", "Type: “I don't agree with that”"), u.speak("bilkul-sahi")]})
L.append({"id": "u16-l2", "title": "Halanke, balke", "blurb": "The connectors that make you sound like you've thought about it.", "canDo": "You can link ideas with although, rather, despite and so",
 "teach": [u.teach("halanke"), u.teach("balke"), u.teach("bawajood"), u.teach("is-liye", "is liye = so. kyunke = because. Cause and effect, in either order."), u.teach("misaal"), u.teach("ek-taraf")],
 "exercises": [u.match("halanke", "balke", "bawajood", "is-liye", "misaal"),
   u.scene([("khala", "b.s-khala-karachi"), ("ammi", "b.s-ammi-karachi")], "What is Ammi's point in favour of Karachi?", ["It has the sea", ("It has better food", "A real argument, but not the one she made."), ("It's bigger", "True. Not what she said.")], setup="The oldest argument in Pakistan.", hide=True),
   u.mc("“Woh ameer nahin, ___ bohat ameer hai.” (He's not rich, rather he's very rich.)", ["@balke", ("@halanke", "That's 'although'."), ("@is-liye", "That's 'so'.")]),
   u.mc("“Barish thi, ___ hum nahin gaye.” (It was raining, so we didn't go.)", ["@is-liye", ("@bawajood", "That would mean you went anyway."), ("@misaal", "That's 'for example'.")]),
   u.listen("misaal", True), u.type("halanke", "Type: “although”"), u.dictation("bawajood"), u.type("misaal", "Type: “for example”")]})
L.append({"id": "u16-l3", "title": "Hold your ground", "blurb": "Concede a little, push back a lot, then have tea.", "canDo": "You can argue a point without starting a feud",
 "teach": [u.teach("baat-yeh", "Buys you three seconds to work out what the thing actually is."), u.teach("asal-mein"), u.teach("sach-to"), u.teach("aap-ki-baat", "Concede first, then disagree. It's the lekin that does the work."), u.teach("meri-baat"), u.teach("farq"), u.teach("nahin-maanta"), u.teach("chhoriye")],
 "exercises": [u.say("aap-ki-baat", "Nana has made a point. A wrong one. Be diplomatic.", ["nahin-maanta", "farq"]),
   u.spot("meri-baat", ("meri", "میری"), ("aap ki", "آپ کی"), "You want them to hear YOUR point: meri baat."),
   u.meaning("farq"), u.sort("Opening a point, or ending the argument?", ["Opening", "Ending"], [("@baat-yeh", 0), ("@chhoriye", 1), ("@sach-to", 0), ("@asal-mein", 0), ("@farq", 1), ("koi baat nahin", 1)]),
   u.listen("sach-to", True), u.build("meri-baat"), u.type("chhoriye", "End the argument the traditional way."), u.dictation("asal-mein"), u.speak("aap-ki-baat")]})

n, y, o = u.npc, u.you, u.opt
boss = {"id": "u16-boss", "title": "In Our Day", "character": "abbu",
 "blurb": "Abbu says everything was better in his day. Disagree with him. Respectfully.",
 "scene": "Sunday afternoon. Abbu puts down the newspaper, takes off his glasses, and begins a sentence with 'hamare zamane mein'. Everyone else leaves the room.",
 "canDo": "You can disagree with an elder, give an example and find the middle ground",
 "start": "a",
 "nodes": {
  "a": n("abbu", "b.abbu-1", "b"),
  "b": y("Push back, politely.", [o("b.you-point", "c", "great"), o("b.you-disagree", "c", "bold", "'Gustakhi maaf' first. Smart. He can't even be angry.")], "Aap ki baat theek hai, lekin…"),
  "c": n("abbu", "b.abbu-2", "d"),
  "d": y("He wants an example.", [o("b.you-video", "e1", "great"), o("b.you-phone", "e2", "bold", "Ammi, from the kitchen: a single loud laugh.")], "Misaal ke taur par…"),
  "e1": n("abbu", "b.abbu-3a", "f"),
  "e2": n("abbu", "b.abbu-3b", "f"),
  "f": y("Land it.", [o("b.you-both", "g", "great"), o("b.you-chai", "g", "fine")], "Ek taraf…"),
  "g": n("abbu", "b.abbu-end", "end"),
  "end": {"type": "end", "title": "You won. Sort of", "text": "You disagreed with Abbu, backed it up with an example, and finished on speaking terms. He'll tell his friends you argue 'like a lawyer'. From him, that's praise.", "outcome": "debater"}}}

meta = {"track": "speaking", "stage": "advanced", "order": 16, "title": "Opinions", "titleUrdu": "بحث", "emoji": "⚖️",
 "tagline": "Give an opinion, disagree politely, connect your ideas.", "canDo": "You can hold your own in a family argument",
 "grammar": [{"title": "Agreeing takes se", "body": "main aap se ittefaq karta hoon (I agree with you). main is baat se ittefaq nahin karta (I don't agree with this point)."},
             {"title": "Connectors", "body": "halanke (although), balke (but rather: corrects what came before), is ke bawajood (despite that), is liye (so), kyunke (because), misaal ke taur par (for example), ek taraf… doosri taraf… (on one hand… on the other…)."},
             {"title": "ke: that", "body": "baat yeh hai ke… (the thing is that…), mera khayal hai ke… (I think that…), sach to yeh hai ke… (the truth is that…). ke introduces the whole next clause."}]}
write_unit(u, meta, L, boss)
