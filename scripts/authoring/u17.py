"""Unit 17 (advanced): Idioms and proverbs."""
from common import Unit, info, write_unit

u = Unit("u17")
P = u.P
# food idioms
P("daal-kaala", "daal mein kuch kaala hai", "دال میں کچھ کالا ہے", "Something's fishy", literal="there's something black in the lentils", accept=["dal mein kuch kala hai"])
P("ghar-ki-murgi", "ghar ki murgi daal barabar", "گھر کی مرغی دال برابر", "We undervalue what we already have", literal="the chicken at home is worth the same as lentils", accept=["ghar ki murghi daal barabar", "ghar ki murgi dal barabar"])
P("oont-zeera", "oont ke munh mein zeera", "اونٹ کے منہ میں زیرہ", "A drop in the ocean", literal="a cumin seed in a camel's mouth", accept=["oont ke moonh mein zeera", "unt ke munh mein zeera"])
P("bandar-adrak", "bandar kya jaane adrak ka swaad", "بندر کیا جانے ادرک کا سواد", "It's wasted on someone who can't appreciate it", literal="what does a monkey know of the taste of ginger?", accept=["bandar kya jane adrak ka swad", "bandar kya jaane adrak ka sawad"])
# people
P("eid-ka-chaand", "tum to eid ka chaand ho gaye ho", "تم تو عید کا چاند ہو گئے ہو", "We never see you any more", literal="you've become the Eid moon", accept=["tum to eid ka chand ho gaye ho", "tum toh eid ka chaand ho gaye ho"], hook="The Eid moon is seen once a year, briefly, and everyone argues about whether they really saw it.")
P("aankhon-ka-tara", "woh Nani ki aankhon ka tara hai", "وہ نانی کی آنکھوں کا تارا ہے", "He's the apple of Nani's eye", literal="he's the star of Nani's eyes", accept=["woh nani ki aankhon ka taara hai", "wo nani ki ankhon ka tara hai"])
P("naak-mein-dam", "bachon ne naak mein dam kar diya hai", "بچوں نے ناک میں دم کر دیا ہے", "The kids have driven me up the wall", literal="the kids have put my breath in my nose", accept=["bachchon ne naak mein dam kar diya hai", "bachon ne nak mein dam kar diya hai"])
P("dil-baagh", "dil baagh baagh ho gaya", "دل باغ باغ ہو گیا", "I'm absolutely delighted", literal="my heart became a garden, a garden", accept=["dil bagh bagh ho gaya"])
P("aag-bagoola", "Abbu aag bagoola ho gaye", "ابو آگ بگولا ہو گئے", "Abbu was furious", literal="Abbu became a whirlwind of fire", accept=["abbu aag bagula ho gaye", "abbu aag baboola ho gaye"])
P("nau-do-gyarah", "chor nau do gyarah ho gaya", "چور نو دو گیارہ ہو گیا", "The thief made a run for it", literal="the thief became nine-two-eleven", accept=["chor nau do gyara ho gaya", "chor no do gyarah ho gaya"], hook="9 + 2 = 11. One moment he was there; then he was arithmetic.")
P("haath-par-haath", "haath par haath dhare mat baitho", "ہاتھ پر ہاتھ دھرے مت بیٹھو", "Don't just sit there doing nothing", literal="don't sit with hand placed on hand", accept=["haath pe haath dhare mat baitho", "hath par hath dhare mat baitho"])
# proverbs
P("naach-na-jaane", "naach na jaane aangan tedha", "ناچ نہ جانے آنگن ٹیڑھا", "A bad workman blames his tools", literal="can't dance, says the courtyard is crooked", accept=["nach na jane aangan tedha", "naach na jaane angan terha", "naach na jaane aangan terha"])
P("door-ke-dhol", "door ke dhol suhane", "دور کے ڈھول سہانے", "The grass is greener on the other side", literal="distant drums sound sweet", accept=["dur ke dhol suhane", "door ke dhol suhaane"])
P("jaisa-des", "jaisa des waisa bhes", "جیسا دیس ویسا بھیس", "When in Rome, do as the Romans do", literal="as the country, so the dress", accept=["jaisa desh waisa bhesh", "jaisa des vaisa bhes"])
P("ulta-chor", "ulta chor kotwal ko daante", "الٹا چور کوتوال کو ڈانٹے", "The guilty one is doing the accusing", literal="backwards: the thief scolds the police chief", accept=["ulta chor kotwal ko dante", "ulta chor kotwaal ko daante"])
P("aasman-se-gira", "aasman se gira, khajoor mein atka", "آسمان سے گرا، کھجور میں اٹکا", "Out of the frying pan, into the fire", literal="fell from the sky, got stuck in a date palm", accept=["aasman se gira khajoor mein atka", "asman se gira khajur mein atka"])
P("ek-teer", "ek teer se do shikar", "ایک تیر سے دو شکار", "Two birds with one stone", literal="two prey with one arrow", accept=["ek tir se do shikar", "ek teer se do shikaar"])
P("jitne-munh", "jitne munh utni baatein", "جتنے منہ اتنی باتیں", "Everyone has their own version", literal="as many mouths, that many stories", accept=["jitne moonh utni baatein", "jitne munh utni baten"])
P("chiragh-tale", "chiragh tale andhera", "چراغ تلے اندھیرا", "The problem is right under your nose", literal="darkness under the lamp", accept=["chirag tale andhera", "charagh tale andhera"])
P("qatra-qatra", "qatra qatra darya banta hai", "قطرہ قطرہ دریا بنتا ہے", "Little by little it adds up", literal="drop by drop a river is made", accept=["katra katra darya banta hai", "qatra qatra dariya banta hai"], note="Also true of learning a language.")
P("ab-pachhtaye", "ab pachhtaye kya hot, jab chiriyan chug gayin khet", "اب پچھتائے کیا ہوت، جب چڑیاں چگ گئیں کھیت", "No use crying over spilt milk", literal="what use is regret now, when the birds have eaten the field", accept=["ab pachtaye kya hot jab chidiya chug gayi khet", "ab pachhtaye kya hot jab chiriyan chug gayin khet", "ab pachtaye kya hot jab chiriya chug gayi khet"])
# scene lines
P("b.s-khala-daal", "Bilal ne kaha woh library mein hai. Lekin peeche music baj raha tha", "بلال نے کہا وہ لائبریری میں ہے۔ لیکن پیچھے میوزک بج رہا تھا", "Bilal said he's at the library. But there was music playing behind him", speaker="khala")
P("b.s-nani-daal", "Hmm. Daal mein kuch kaala hai", "ہمم۔ دال میں کچھ کالا ہے", "Hmm. Something's fishy", speaker="nani")
P("b.s-bilal-naach", "Yeh bat kharab hai. Is liye out ho gaya", "یہ بیٹ خراب ہے۔ اس لیے آؤٹ ہو گیا", "This bat's no good. That's why I got out", speaker="bilal")
P("b.s-abbu-naach", "Naach na jaane, aangan tedha", "ناچ نہ جانے، آنگن ٹیڑھا", "Can't dance, blames the courtyard", speaker="abbu")
P("b.s-ammi-chiragh", "Chashma dhoondh rahi hoon. Kahin nahin mil raha", "چشمہ ڈھونڈ رہی ہوں۔ کہیں نہیں مل رہا", "I'm looking for my glasses. Can't find them anywhere", speaker="ammi")
P("b.s-nani-chiragh", "Tumhare sar par hai. Chiragh tale andhera", "تمہارے سر پر ہے۔ چراغ تلے اندھیرا", "They're on your head. Darkness under the lamp", speaker="nani")
# boss
P("b.nani-1", "Aao, aao! Tum to eid ka chaand ho gaye ho", "آؤ، آؤ! تم تو عید کا چاند ہو گئے ہو", "Come, come! You've become the Eid moon", speaker="nani")
P("b.you-tara", "Nani, aap to meri aankhon ka tara hain", "نانی، آپ تو میری آنکھوں کا تارا ہیں", "Nani, you're the apple of my eye", accept=["nani aap to meri aankhon ka tara hain", "aap to meri aankhon ka tara hain"])
P("b.you-kaam", "Kaam ne naak mein dam kar diya hai, Nani", "کام نے ناک میں دم کر دیا ہے، نانی", "Work has been driving me up the wall, Nani", accept=["kaam ne naak mein dam kar diya hai"])
P("b.nani-2", "Bilal kehta hai London bohat achha hai. Door ke dhol suhane!", "بلال کہتا ہے لندن بہت اچھا ہے۔ دور کے ڈھول سہانے!", "Bilal says London is wonderful. Distant drums sound sweet!", speaker="nani")
P("b.you-murgi", "Sach hai, Nani. Ghar ki murgi daal barabar", "سچ ہے، نانی۔ گھر کی مرغی دال برابر", "True, Nani. We never value what's at home", accept=["sach hai nani ghar ki murgi daal barabar", "ghar ki murgi daal barabar"])
P("b.you-des", "Wahan bhi theek hai. Jaisa des waisa bhes", "وہاں بھی ٹھیک ہے۔ جیسا دیس ویسا بھیس", "It's fine there too. When in Rome", accept=["wahan bhi theek hai jaisa des waisa bhes", "jaisa des waisa bhes"])
P("b.nani-3", "Achha, yeh lo pachaas rupay. Mithai kha lena", "اچھا، یہ لو پچاس روپے۔ مٹھائی کھا لینا", "Right, here's fifty rupees. Buy yourself some sweets", speaker="nani")
P("b.you-baagh", "Shukriya Nani! Dil baagh baagh ho gaya", "شکریہ نانی! دل باغ باغ ہو گیا", "Thank you Nani! I'm delighted", accept=["shukriya nani dil baagh baagh ho gaya", "dil baagh baagh ho gaya"])
P("b.you-zeera", "Nani, yeh to oont ke munh mein zeera hai!", "نانی، یہ تو اونٹ کے منہ میں زیرہ ہے!", "Nani, that's a cumin seed in a camel's mouth!", accept=["nani yeh to oont ke munh mein zeera hai", "yeh to oont ke munh mein zeera hai"])
P("b.nani-4a", "Jeete raho. Qatra qatra darya banta hai", "جیتے رہو۔ قطرہ قطرہ دریا بنتا ہے", "Bless you. Drop by drop, a river is made", speaker="nani")
P("b.nani-4b", "Hahaha! Bandar kya jaane adrak ka swaad", "ہاہاہا! بندر کیا جانے ادرک کا سواد", "Hahaha! What does a monkey know of ginger", speaker="nani")

L = []
L.append({"id": "u17-l1", "title": "Lentils and camels", "blurb": "Half of Urdu's idioms are about food. Nobody is surprised.", "canDo": "You can understand and use four everyday food idioms",
 "teach": [info("Don't translate. Picture it", "An idiom means its picture, not its words. Each one here comes with the literal image: learn the image and the meaning sticks."),
   u.teach("daal-kaala", "Said with narrowed eyes."), u.teach("ghar-ki-murgi", "Chicken is a treat. But the one in your own yard? Might as well be lentils."), u.teach("oont-zeera", "For any amount that is nowhere near enough."), u.teach("bandar-adrak", "For when your effort is not appreciated. Use carefully: you are calling someone a monkey.")],
 "exercises": [u.scene([("khala", "b.s-khala-daal"), ("nani", "b.s-nani-daal")], "What does Nani think?", ["Bilal isn't telling the truth", ("Bilal is cooking lentils", "There are no actual lentils."), ("The library has good music", "It does not. That's her point.")], setup="Khala has just got off the phone."),
   u.mc("Your salary went up by 1%. Rent went up by 30%. The raise is…", ["@oont-zeera", ("@ghar-ki-murgi", "That's about not valuing what you have."), ("@daal-kaala", "Suspicious, yes. But the idiom you want is about 'not nearly enough'.")]),
   u.mc("You cook for six hours. Bilal says “it's fine” without looking up from his phone.", ["@bandar-adrak", ("@oont-zeera", "That's 'far too little'."), ("@daal-kaala", "Nothing fishy. He's just a monkey with ginger.")]),
   u.meaning("ghar-ki-murgi"), u.build("daal-kaala"), u.listen("oont-zeera", True),
   u.spot("daal-kaala", ("kaala", "کالا"), ("peela", "پیلا"), "Lentils are supposed to be yellow (peela). It's the black (kaala) bit that's suspicious."),
   u.type("daal-kaala", "Type: “Something's fishy”"), u.dictation("ghar-ki-murgi")]})
L.append({"id": "u17-l2", "title": "Eid moons and whirlwinds", "blurb": "Idioms for people: the ones you love, and the ones driving you mad.", "canDo": "You can describe people and feelings with idioms",
 "teach": [u.teach("eid-ka-chaand", "The standard greeting for any relative who hasn't visited in a month."), u.teach("aankhon-ka-tara"), u.teach("naak-mein-dam"), u.teach("dil-baagh"), u.teach("aag-bagoola"), u.teach("nau-do-gyarah"), u.teach("haath-par-haath")],
 "exercises": [u.sort("Happy feelings or not?", ["Good", "Not good"], [("@dil-baagh", 0), ("@aag-bagoola", 1), ("@aankhon-ka-tara", 0), ("@naak-mein-dam", 1), ("@nau-do-gyarah", 1), ("@haath-par-haath", 1)]),
   u.match("eid-ka-chaand", "aankhon-ka-tara", "naak-mein-dam", "dil-baagh"),
   u.mc("You haven't called Khala in six weeks. Her first words:", ["@eid-ka-chaand", ("@dil-baagh", "She will be delighted. But first, the guilt."), ("@nau-do-gyarah", "That's what you'd like to do right now.")]),
   u.gap("nau-do-gyarah", ("gyarah", "گیارہ"), [("baarah", "بارہ"), ("das", "دس")], "9 and 2 make 11: nau do gyarah."),
   u.meaning("aag-bagoola"), u.listen("naak-mein-dam", True), u.build("dil-baagh"), u.type("dil-baagh", "Type: “I'm absolutely delighted” (the idiom)"), u.dictation("eid-ka-chaand"), u.speak("dil-baagh")]})
L.append({"id": "u17-l3", "title": "Nani's proverbs", "blurb": "She has one for every situation. Now you'll know which.", "canDo": "You can recognise common proverbs and what they're really saying",
 "teach": [u.teach("naach-na-jaane"), u.teach("door-ke-dhol"), u.teach("jaisa-des"), u.teach("ulta-chor"), u.teach("ek-teer"), u.teach("jitne-munh"), u.teach("chiragh-tale")],
 "exercises": [u.scene([("bilal", "b.s-bilal-naach"), ("abbu", "b.s-abbu-naach")], "What is Abbu saying about Bilal?", ["He's blaming the bat for his own bad batting", ("He should take dance lessons", "Nobody is dancing. It's a proverb."), ("The pitch really is crooked", "The pitch is fine. So is the bat.")], setup="Garden cricket. Bilal has just been bowled. By Nani."),
   u.scene([("ammi", "b.s-ammi-chiragh"), ("nani", "b.s-nani-chiragh")], "Where are Ammi's glasses?", ["On her head", ("Under the lamp", "That's the proverb, not the location."), ("Lost for good", "Found. Nani finds everything.")], hide=True),
   u.mc("You go to the bank and also pick up the dry cleaning next door.", ["@ek-teer", ("@jitne-munh", "That's about everyone having a different story."), ("@door-ke-dhol", "That's 'the grass is greener'.")]),
   u.mc("Five relatives, five different versions of what happened at the wedding.", ["@jitne-munh", ("@ek-teer", "That's 'two birds, one stone'."), ("@ulta-chor", "That's when the guilty one does the accusing.")]),
   u.match("naach-na-jaane", "door-ke-dhol", "jaisa-des", "ulta-chor"),
   u.listen("jaisa-des"), u.build("ek-teer"), u.type("door-ke-dhol", "Type the proverb: “distant drums sound sweet”"), u.dictation("chiragh-tale")]})
L.append({"id": "u17-l4", "title": "Too late, and little by little", "blurb": "Three longer ones worth knowing by heart.", "canDo": "You can follow longer proverbs when elders use them",
 "teach": [u.teach("aasman-se-gira"), u.teach("qatra-qatra"), u.teach("ab-pachhtaye", "Old-fashioned wording ('hot' for 'hota'). Proverbs keep their antique grammar.")],
 "exercises": [u.meaning("aasman-se-gira"), u.build("qatra-qatra"),
   u.mc("You escaped a boring wedding conversation and walked straight into Mrs. Butt.", ["@aasman-se-gira", ("@qatra-qatra", "That's 'little by little'."), ("@ab-pachhtaye", "Close in spirit, but that one is about regret after the fact.")]),
   u.mc("The exam was yesterday. Bilal's cousin starts studying today.", ["@ab-pachhtaye", ("@qatra-qatra", "Too late for little by little."), ("@aasman-se-gira", "That's out of one problem, into another.")]),
   u.listen("ab-pachhtaye", True), u.spot("qatra-qatra", ("darya", "دریا"), ("sahra", "صحرا"), "Drops make a river (darya), not a desert (sahra)."),
   u.type("qatra-qatra", "Type: “drop by drop a river is made”"), u.dictation("aasman-se-gira")]})

n, y, o = u.npc, u.you, u.opt
boss = {"id": "u17-boss", "title": "Nani Speaks in Proverbs", "character": "nani",
 "blurb": "Nani hasn't seen you in a month. She will express this entirely in idioms.",
 "scene": "You finally visit Nani. She's on the takht with her paan-daan, and she has been saving these up.",
 "canDo": "You can keep up with an elder who talks in idioms, and answer in kind",
 "start": "a",
 "nodes": {
  "a": n("nani", "b.nani-1", "b"),
  "b": y("You've been told off, lovingly. Respond.", [o("b.you-tara", "c", "great", "Flattery, in idiom. She is defenceless."), o("b.you-kaam", "c", "fine")], "Nani, aap to…"),
  "c": n("nani", "b.nani-2", "d"),
  "d": y("Answer a proverb with a proverb.", [o("b.you-murgi", "e", "great"), o("b.you-des", "e", "fine")], "Sach hai…"),
  "e": n("nani", "b.nani-3", "f"),
  "f": y("Fifty rupees. In this economy.", [o("b.you-baagh", "g1", "great"), o("b.you-zeera", "g2", "bold", "Fifty rupees last bought a box of mithai in about 1994.")], "Shukriya Nani…"),
  "g1": n("nani", "b.nani-4a", "end"),
  "g2": n("nani", "b.nani-4b", "end"),
  "end": {"type": "end", "title": "Proverb for proverb", "text": "You understood every idiom Nani threw at you and threw a few back. She'll tell everyone your Urdu is 'bilkul hamari tarah', just like ours. There is no higher grade.", "outcome": "idiomatic"}}}

meta = {"track": "speaking", "stage": "advanced", "order": 17, "title": "Idioms and Proverbs", "titleUrdu": "محاورے", "emoji": "🐪",
 "tagline": "The sayings elders use, with the pictures behind them.", "canDo": "You can understand everyday idioms and proverbs, and use a few yourself",
 "grammar": [{"title": "Idioms are verbs: conjugate them", "body": "naak mein dam karna, aag bagoola hona, nau do gyarah hona: the last word is an ordinary verb, so it changes like one. usne naak mein dam kar diya; woh aag bagoola ho gayi."},
             {"title": "Proverbs are frozen", "body": "Proverbs don't change: naach na jaane aangan tedha is said exactly like that, whoever it's about. Some keep old grammar (kya hot for kya hota)."},
             {"title": "jitna… utna, jaisa… waisa", "body": "Paired words build comparisons: jitne munh utni baatein (as many mouths, that many stories), jaisa des waisa bhes (as the country, so the dress)."}]}
write_unit(u, meta, L, boss)
