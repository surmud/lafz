"""Unit 18 (advanced): Poetry. Ghalib, Iqbal, Mir, and how to behave at a mushaira."""
from common import Unit, info, write_unit

u = Unit("u18")
P = u.P
# the vocabulary of poetry
P("sher", "sher", "شعر", "a couplet", note="Two lines. Not to be confused with sher (شیر), a lion, which is spelled differently.")
P("shayar", "shayar", "شاعر", "poet", accept=["shair", "shaayar"])
P("shayari", "shayari", "شاعری", "poetry", accept=["shairi", "shaayari"])
P("ghazal", "ghazal", "غزل", "ghazal (a poem of linked couplets)", accept=["gazal"])
P("mushaira", "mushaira", "مشاعرہ", "a poetry gathering", accept=["mushaera", "mushaaira"])
P("arz-kiya", "arz kiya hai", "عرض کیا ہے", "I submit… (what a poet says before reciting)", literal="it has been humbly submitted")
P("irshad", "irshad!", "ارشاد!", "Go on, recite! (the audience's reply)", accept=["irshaad"])
P("wah-wah", "wah wah!", "واہ واہ!", "Bravo!", accept=["waah waah", "wah wah"])
P("kya-baat", "kya baat hai!", "کیا بات ہے!", "How wonderful!", literal="what a thing it is!")
P("mukarrar", "mukarrar!", "مکرر!", "Again! Encore!", accept=["mukarar", "muqarrar"])
P("daad", "daad dijiye", "داد دیجیے", "Show your appreciation", literal="give praise", accept=["dad dijiye"])
# poetic words
P("ishq", "ishq", "عشق", "love (the consuming kind)", sense="love")
P("mohabbat", "mohabbat", "محبت", "love", sense="love", accept=["muhabbat", "mohabat"])
P("dard", "dard", "درد", "pain")
P("khwahish", "khwahish", "خواہش", "desire, wish", accept=["khwaish", "khuwahish"])
P("armaan", "armaan", "ارمان", "longing, a cherished wish", accept=["arman"])
P("jahan", "jahan", "جہاں", "world", accept=["jahaan"], note="Poetic. In everyday speech: duniya.")
P("sitara", "sitara", "ستارہ", "star", accept=["sitaara"])
P("taqdeer", "taqdeer", "تقدیر", "destiny", accept=["taqdir", "takdeer"])
P("khudi", "khudi", "خودی", "selfhood", note="Iqbal's big idea: the self you build, as opposed to the ego you inherit.")
P("gul", "gul", "گل", "rose, flower", note="Poetic. Everyday: phool.")
# Ghalib
P("g1a", "dil-e-nadaan tujhe hua kya hai", "دلِ ناداں تجھے ہوا کیا ہے", "Foolish heart, what has happened to you?", accept=["dil e nadan tujhe hua kya hai", "dile nadaan tujhe hua kya hai"])
P("g1b", "aakhir is dard ki dawa kya hai", "آخر اس درد کی دوا کیا ہے", "What, in the end, is the cure for this pain?", accept=["akhir is dard ki dawa kya hai"])
P("g2a", "hazaron khwahishen aisi ke har khwahish pe dam nikle", "ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے", "Thousands of desires, each one enough to die for", accept=["hazaron khwahishein aisi ke har khwahish pe dam nikle", "hazaaron khwahishen aisi ke har khwahish pe dam nikle"])
P("g2b", "bohat nikle mere armaan lekin phir bhi kam nikle", "بہت نکلے مرے ارمان لیکن پھر بھی کم نکلے", "Many of my longings were fulfilled, and still too few", accept=["bahut nikle mere armaan lekin phir bhi kam nikle", "bohat nikle mere arman lekin phir bhi kam nikle"])
P("g3a", "hum ko maloom hai jannat ki haqeeqat lekin", "ہم کو معلوم ہے جنت کی حقیقت لیکن", "I know the truth about paradise, but", accept=["humko maloom hai jannat ki haqiqat lekin"])
P("g3b", "dil ke khush rakhne ko Ghalib yeh khayal achha hai", "دل کے خوش رکھنے کو غالب یہ خیال اچھا ہے", "to keep the heart happy, Ghalib, it's a nice idea", accept=["dil ke khush rakhne ko ghalib ye khayal acha hai"])
# Iqbal
P("i1a", "sitaron se aage jahan aur bhi hain", "ستاروں سے آگے جہاں اور بھی ہیں", "Beyond the stars there are other worlds still", accept=["sitaaron se aage jahan aur bhi hain", "sitaron se agay jahan aur bhi hain"])
P("i1b", "abhi ishq ke imtihan aur bhi hain", "ابھی عشق کے امتحاں اور بھی ہیں", "Love has more trials for you yet", accept=["abhi ishq ke imtehan aur bhi hain", "abhi ishq ke imtihaan aur bhi hain"])
P("i2a", "khudi ko kar buland itna ke har taqdeer se pehle", "خودی کو کر بلند اتنا کہ ہر تقدیر سے پہلے", "Raise your self so high that before every decree of fate", accept=["khudi ko kar buland itna ke har taqdir se pehle"])
P("i2b", "Khuda bande se khud poochhe: bata, teri raza kya hai", "خدا بندے سے خود پوچھے: بتا، تیری رضا کیا ہے", "God Himself asks the man: tell me, what is it you want?", accept=["khuda bande se khud pooche bata teri raza kya hai", "khuda bande se khud puche bata teri raza kya hai"])
# Mir
P("m1a", "patta patta, boota boota haal hamara jaane hai", "پتا پتا، بوٹا بوٹا حال ہمارا جانے ہے", "Every leaf, every plant knows the state I'm in", accept=["patta patta boota boota haal hamara jaane hai", "pata pata buta buta haal hamara jane hai"])
P("m1b", "jaane na jaane gul hi na jaane, baagh to sara jaane hai", "جانے نہ جانے گل ہی نہ جانے، باغ تو سارا جانے ہے", "Only the rose doesn't know. The whole garden does", accept=["jaane na jaane gul hi na jaane baagh to sara jaane hai", "jane na jane gul hi na jane bagh to sara jane hai"])
# scene lines
P("b.s-abbu-arz", "Arz kiya hai…", "عرض کیا ہے…", "I submit…", speaker="abbu")
P("b.s-khala-irshad", "Irshad, irshad!", "ارشاد، ارشاد!", "Go on, go on!", speaker="khala")
P("b.s-abbu-sher", "Chai mein cheeni kam hai, zindagi mein gham hai", "چائے میں چینی کم ہے، زندگی میں غم ہے", "There's too little sugar in the tea, and sorrow in life", speaker="abbu")
P("b.s-nani-daad", "Wah wah… chai khud bana lo", "واہ واہ… چائے خود بنا لو", "Bravo… make your own tea", speaker="nani")
P("b.s-bilal-phool", "Yeh phool bohat khoobsurat hai", "یہ پھول بہت خوبصورت ہے", "This flower is very beautiful", speaker="bilal")
P("b.s-nani-gul", "Shayari mein “phool” nahin, “gul” kehte hain", "شاعری میں “پھول” نہیں، “گل” کہتے ہیں", "In poetry you don't say “phool”, you say “gul”", speaker="nani")
# boss
P("b.nani-1", "Aaj hamare ghar mushaira hai. Tum bhi kuch sunao!", "آج ہمارے گھر مشاعرہ ہے۔ تم بھی کچھ سناؤ!", "Tonight there's a mushaira at our house. You recite something too!", speaker="nani")
P("b.you-arz", "Arz kiya hai…", "عرض کیا ہے…", "I submit…", accept=["arz kiya hai"])
P("b.you-shy", "Nani, mujhe sirf ek sher aata hai", "نانی، مجھے صرف ایک شعر آتا ہے", "Nani, I only know one couplet", accept=["nani mujhe sirf ek sher aata hai", "mujhe sirf ek sher aata hai"])
P("b.nani-2", "Irshad, irshad!", "ارشاد، ارشاد!", "Go on, go on!", speaker="nani")
P("b.you-g1a", "Dil-e-nadaan tujhe hua kya hai…", "دلِ ناداں تجھے ہوا کیا ہے…", "Foolish heart, what has happened to you…", accept=["dil e nadan tujhe hua kya hai", "dil-e-nadaan tujhe hua kya hai"])
P("b.you-i1a", "Sitaron se aage jahan aur bhi hain…", "ستاروں سے آگے جہاں اور بھی ہیں…", "Beyond the stars there are other worlds still…", accept=["sitaron se aage jahan aur bhi hain"])
P("b.khala-wah", "Wah wah! Mukarrar!", "واہ واہ! مکرر!", "Bravo! Again!", speaker="khala")
P("b.you-g1b", "…aakhir is dard ki dawa kya hai", "…آخر اس درد کی دوا کیا ہے", "…what, in the end, is the cure for this pain?", accept=["aakhir is dard ki dawa kya hai"])
P("b.you-i1b", "…abhi ishq ke imtihan aur bhi hain", "…ابھی عشق کے امتحاں اور بھی ہیں", "…love has more trials for you yet", accept=["abhi ishq ke imtihan aur bhi hain"])
P("b.nani-ghalib", "Kya baat hai! Ghalib!", "کیا بات ہے! غالب!", "How wonderful! Ghalib!", speaker="nani")
P("b.nani-iqbal", "Kya baat hai! Iqbal!", "کیا بات ہے! اقبال!", "How wonderful! Iqbal!", speaker="nani")
P("b.nani-end", "Mashallah. Yeh bachcha to shayar nikla", "ماشاء اللہ۔ یہ بچہ تو شاعر نکلا", "Mashallah. The child has turned out to be a poet", speaker="nani")

L = []
L.append({"id": "u18-l1", "title": "At the mushaira", "blurb": "Poetry in Urdu is a team sport. The audience has lines too.", "canDo": "You can follow, and join in with, the call and response of a poetry gathering",
 "teach": [info("How a mushaira works", "The poet says 'arz kiya hai'. The audience shouts 'irshad!'. The poet recites the first line, often twice. The audience repeats the best bit. Second line. Then everyone shouts 'wah wah!' and, if it was really good, 'mukarrar!' so the poet has to say it again."),
   u.teach("sher"), u.teach("shayar"), u.teach("shayari"), u.teach("mushaira"), u.teach("arz-kiya"), u.teach("irshad"), u.teach("wah-wah"), u.teach("kya-baat"), u.teach("mukarrar"), u.teach("daad")],
 "exercises": [u.scene([("abbu", "b.s-abbu-arz"), ("khala", "b.s-khala-irshad"), ("abbu", "b.s-abbu-sher"), ("nani", "b.s-nani-daad")], "What is Abbu's couplet really about?", ["He wants more sugar in his tea", ("The sorrow of existence", "That's the cover story."), ("Nani's cooking", "He would not dare.")], setup="Abbu has discovered poetry. The family is being supportive."),
   u.sort("Who says it?", ["The poet", "The audience"], [("@arz-kiya", 0), ("@irshad", 1), ("@wah-wah", 1), ("@mukarrar", 1), ("@daad", 0), ("@kya-baat", 1)]),
   u.match("sher", "shayar", "shayari", "mushaira"),
   u.mc("The poet says “arz kiya hai”. You shout:", ["@irshad", ("@mukarrar", "Too early. He hasn't said anything yet."), ("@daad", "That's the poet asking you for applause.")]),
   u.mc("That couplet was so good you need to hear it again.", ["@mukarrar", ("@irshad", "That's for before the couplet."), ("@arz-kiya", "That's the poet's line.")]),
   u.listen("kya-baat", True), u.type("irshad", "The poet is waiting. Type your line."), u.dictation("arz-kiya"), u.type("mukarrar", "Type: “Encore!”"), u.speak("wah-wah")]})
L.append({"id": "u18-l2", "title": "Ghalib", "blurb": "Mirza Ghalib (1797–1869). Heartbreak, wit, and the most quoted lines in the language.", "canDo": "You can recite and explain a couplet by Ghalib",
 "teach": [info("Reading a sher", "A sher is two lines that stand alone. The first sets something up; the second lands it. Poetic Urdu uses old pronouns (tujhe for tumhein), Persian links (dil-e-nadaan: heart-of-foolishness) and its own vocabulary."),
   u.teach("g1a", "nadaan = naive, foolish. He's talking to his own heart."), u.teach("g1b", "dard (pain) and dawa (medicine): Ghalib loved a matching pair."),
   u.teach("khwahish"), u.teach("armaan"), u.teach("g2a", "dam nikalna = for the breath to leave: to die."), u.teach("g2b"),
   u.teach("g3a"), u.teach("g3b", "The poet's name in the last couplet is his signature. And yes, he's being cheeky about paradise.")],
 "exercises": [u.meaning("g1a"), u.build("g1b"),
   u.mc("In “dil-e-nadaan”, what does the -e- do?", [("Links the two words: ‘heart of foolishness’, a foolish heart", "It's the izafat from Unit 14."), ("Means ‘and’", "That's -o-, as in sher-o-shayari."), ("Makes it plural", "No. It's a link.")]),
   u.gap("g1b", ("dawa", "دوا"), [("dua", "دعا"), ("hawa", "ہوا")], "The cure (dawa) for the pain (dard)."),
   u.mc("What is Ghalib saying in “dil ke khush rakhne ko Ghalib yeh khayal achha hai”?", [("Paradise is a comforting idea, whether or not it's true", "Cheeky, and 150 years ahead of its time."), ("He is certain of paradise", "Read the first line again: he 'knows the truth' about it."), ("His heart is happy", "He's saying what it takes to keep it happy.")]),
   u.listen("g2a"), u.match("khwahish", "armaan", "dard", "ishq"), u.dictation("g1a"), u.speak("g1a")]})
L.append({"id": "u18-l3", "title": "Iqbal", "blurb": "Allama Iqbal (1877–1938). Poet of ambition. Every Pakistani schoolchild knows these two.", "canDo": "You can recite and explain a couplet by Iqbal",
 "teach": [u.teach("sitara"), u.teach("jahan"), u.teach("i1a", "jahan here is the plural 'worlds'. aur bhi = more, still others."), u.teach("i1b", "imtihan = exam, trial. Still the everyday word for a school exam."),
   u.teach("khudi"), u.teach("taqdeer"), u.teach("i2a", "buland = high, lofty. kar buland = make it lofty."), u.teach("i2b", "raza = will, what you consent to. The line that launched a thousand graduation speeches.")],
 "exercises": [u.meaning("i1a"), u.build("i1b"),
   u.mc("What's the message of “sitaron se aage jahan aur bhi hain”?", [("Don't stop here: there's always further to go", "Aim past the stars."), ("Space travel is possible", "He wrote it in the 1930s. It's a metaphor."), ("The stars are very far away", "True, but he had a larger point.")]),
   u.gap("i2a", ("buland", "بلند"), [("band", "بند"), ("bandar", "بندر")], "buland = high. Raise your khudi high."),
   u.sort("Everyday word or poetic word?", ["Everyday", "Poetic"], [("duniya (world)", 0), ("@jahan", 1), ("phool (flower)", 0), ("@gul", 1), ("pyaar (love)", 0), ("@ishq", 1)], "Poetry has its own vocabulary, mostly from Persian."),
   u.listen("i2b"), u.match("sitara", "jahan", "khudi", "taqdeer"), u.dictation("i1a"), u.speak("i1a")]})
L.append({"id": "u18-l4", "title": "Mir", "blurb": "Mir Taqi Mir (1723–1810). The one Ghalib looked up to. Simple words, devastating effect.", "canDo": "You can recite and explain a couplet by Mir",
 "teach": [u.teach("gul"), u.teach("ishq"), u.teach("mohabbat"), u.teach("dard"), u.teach("m1a", "jaane hai is old Urdu for jaanta hai. patta = leaf, boota = plant."), u.teach("m1b", "The whole garden knows he's in love. The only one who doesn't is the rose: the beloved.")],
 "exercises": [u.scene([("bilal", "b.s-bilal-phool"), ("nani", "b.s-nani-gul")], "What is Nani correcting?", ["His word for flower: poetry says gul", ("His grammar", "The grammar is fine. The register isn't poetic enough for her."), ("The flower isn't beautiful", "She agrees it's beautiful. She just wants it said properly.")]),
   u.meaning("m1a"), u.build("m1b"),
   u.mc("In Mir's couplet, who is the “gul” (rose)?", [("The beloved, who alone hasn't noticed", "Everyone else can see it."), ("The poet", "He's the one whose state everyone knows."), ("The gardener", "No gardener appears. Only heartbreak.")]),
   u.spot("m1b", ("baagh", "باغ"), ("gul", "گل"), "It's the whole garden (baagh) that knows. The rose is the one that doesn't."),
   u.listen("m1a"), u.type("ishq", "Type the poetic word for love."), u.dictation("m1a"), u.speak("m1a")]})

n, y, o = u.npc, u.you, u.opt
boss = {"id": "u18-boss", "title": "The Living-Room Mushaira", "character": "nani",
 "blurb": "Nani is hosting a mushaira. You've been volunteered.",
 "scene": "Cushions on the floor, a candle in front of whoever is reciting, and twelve relatives who all know more poetry than you. Nani pushes the candle your way.",
 "canDo": "You can recite a famous couplet with the proper ceremony",
 "start": "a",
 "nodes": {
  "a": n("nani", "b.nani-1", "b"),
  "b": y("The candle is in front of you. Begin properly.", [o("b.you-arz", "c", "great", "The room goes quiet. You sound like you know what you're doing."), o("b.you-shy", "c", "fine", "One is all you need.")], "Arz kiya hai…"),
  "c": n("nani", "b.nani-2", "d"),
  "d": y("First line. Choose your poet.", [o("b.you-g1a", "e1", "great"), o("b.you-i1a", "e2", "great")], "Dil-e-nadaan… or Sitaron se aage…"),
  "e1": n("khala", "b.khala-wah", "f1"),
  "e2": n("khala", "b.khala-wah", "f2"),
  "f1": y("Land the second line.", [o("b.you-g1b", "g1", "great"), o("b.you-i1b", "g1", "bold", "Half Ghalib, half Iqbal. Nobody has attempted this before. Abbu applauds anyway.")], "…aakhir is dard ki…"),
  "f2": y("Land the second line.", [o("b.you-i1b", "g2", "great"), o("b.you-g1b", "g2", "bold", "Half Iqbal, half Ghalib. An avant-garde choice.")], "…abhi ishq ke…"),
  "g1": n("nani", "b.nani-ghalib", "h"),
  "g2": n("nani", "b.nani-iqbal", "h"),
  "h": n("nani", "b.nani-end", "end"),
  "end": {"type": "end", "title": "Wah wah!", "text": "You recited a couplet from memory, with 'arz kiya hai' at the front and applause at the back. Khala recorded it. It is already in three WhatsApp groups.", "outcome": "shayar"}}}

meta = {"track": "speaking", "stage": "advanced", "order": 18, "title": "Poetry", "titleUrdu": "شاعری", "emoji": "🕯️",
 "tagline": "Six famous couplets by Ghalib, Iqbal and Mir, and how a mushaira works.", "canDo": "You can recite, understand and applaud classic Urdu couplets",
 "grammar": [{"title": "Poetic pronouns and verbs", "body": "Poetry keeps older forms: tujhe (to you, for tumhein), mere → mire/mere, jaane hai (for jaanta hai), pe (for par). They're still understood by everyone."},
             {"title": "Izafat everywhere", "body": "dil-e-nadaan (foolish heart), dard-e-dil (pain of the heart), gham-e-ishq (the sorrow of love). The -e- links a noun to its describer or owner; poetry uses it constantly."},
             {"title": "Two vocabularies", "body": "Everyday → poetic: phool → gul (flower), duniya → jahan (world), pyaar → ishq / mohabbat (love), aankh → chashm (eye), raat → shab (night). Knowing a few unlocks most ghazals and half of all film songs."}]}
write_unit(u, meta, L, boss)
