"""Authoring source for Unit 2 (The Family Tree). Run to (re)write content/units/u02.json.
Sources are filled in afterwards by scripts/verify_lexicon.py."""
import json, pathlib

U = "u02"
def P(key, roman, urdu, en, **kw):
    d = {"id": f"{U}.{key}", "roman": roman, "urdu": urdu, "en": en, "confidence": "high"}
    d.update(kw)
    return d

phrases = [
  # core family
  P("ammi", "Ammi", "امی", "Mum", sense="mum"),
  P("abbu", "Abbu", "ابو", "Dad", sense="dad"),
  P("bhai", "bhai", "بھائی", "brother", note="Also what you call any man roughly your age. The waiter is bhai. The Uber driver is bhai."),
  P("behen", "behen", "بہن", "sister", accept=["bahen", "behan", "behn"]),
  P("beta", "beta", "بیٹا", "son"),
  P("beti", "beti", "بیٹی", "daughter"),
  P("bachche", "bachche", "بچے", "children / kids", accept=["bache", "bachay"]),
  # maternal side
  P("nana", "Nana", "نانا", "Mum's father (maternal grandad)"),
  P("nani", "Nani", "نانی", "Mum's mother (maternal grandma)"),
  P("khala", "Khala", "خالہ", "Mum's sister (maternal aunt)"),
  P("khalu", "Khalu", "خالو", "Khala's husband"),
  P("mamoon", "Mamoon", "ماموں", "Mum's brother (maternal uncle)", accept=["mamu", "mamun", "mamo", "mamoo"]),
  P("mumani", "Mumani", "ممانی", "Mamoon's wife", accept=["mami", "mamani"]),
  # paternal side
  P("dada", "Dada", "دادا", "Dad's father (paternal grandad)"),
  P("dadi", "Dadi", "دادی", "Dad's mother (paternal grandma)"),
  P("chacha", "Chacha", "چچا", "Dad's younger brother"),
  P("chachi", "Chachi", "چچی", "Chacha's wife"),
  P("taya", "Taya", "تایا", "Dad's older brother", accept=["taaya", "taya ji"]),
  P("tai", "Tai", "تائی", "Taya's wife", accept=["taai", "tayi", "tai ji"]),
  P("phuppo", "Phuppo", "پھپھو", "Dad's sister (paternal aunt)", accept=["phuppi", "phupho", "phupo"]),
  P("phuppa", "Phuppa", "پھوپھا", "Phuppo's husband", accept=["phupha", "phoopha"]),
  # in-laws and cousins
  P("bhabhi", "bhabhi", "بھابھی", "brother's wife (sister-in-law)"),
  P("susral", "susral", "سسرال", "in-laws (your spouse's family)", accept=["sasural", "sussral"]),
  P("cousin", "cousin", "کزن", "cousin (yes, just 'cousin')", register="casual", note="Urdu has proper terms like 'khala-zaad bhai' (khala's son), but every Pakistani family just says 'cousin'."),
  P("khandan", "khandan", "خاندان", "family / clan", accept=["khaandaan", "khandaan"]),
  # possession and description
  P("mera", "mera", "میرا", "my (with a masculine noun)", sense="my"),
  P("meri", "meri", "میری", "my (with a feminine noun)", sense="my"),
  P("mere", "mere", "میرے", "my (plural, or a respected man)", sense="my"),
  P("bara", "bara", "بڑا", "big / older", accept=["bada"]),
  P("chhota", "chhota", "چھوٹا", "small / younger", accept=["chota", "chhotaa"]),
  P("ammi-ki-behen", "Ammi ki behen", "امی کی بہن", "Mum's sister", literal="Mum of sister"),
  P("abbu-ki-behen", "Abbu ki behen", "ابو کی بہن", "Dad's sister"),
  P("ammi-ke-bhai", "Ammi ke bhai", "امی کے بھائی", "Mum's brother"),
  P("abbu-ke-bare-bhai", "Abbu ke bare bhai", "ابو کے بڑے بھائی", "Dad's older brother", accept=["abbu ke bade bhai"]),
  P("abbu-ke-chhote-bhai", "Abbu ke chhote bhai", "ابو کے چھوٹے بھائی", "Dad's younger brother", accept=["abbu ke chote bhai"]),
  P("nani-ka-ghar", "Nani ka ghar", "نانی کا گھر", "Nani's house"),
  # sentences
  P("yeh-meri-khala", "yeh meri Khala hain", "یہ میری خالہ ہیں", "This is my aunt (mum's sister)"),
  P("yeh-mere-mamoon", "yeh mere Mamoon hain", "یہ میرے ماموں ہیں", "This is my uncle (mum's brother)"),
  P("yeh-mera-bhai", "yeh mera bhai hai", "یہ میرا بھائی ہے", "This is my brother"),
  P("yeh-meri-behen", "yeh meri behen hai", "یہ میری بہن ہے", "This is my sister"),
  P("mere-do-bhai", "mere do bhai hain", "میرے دو بھائی ہیں", "I have two brothers", literal="my two brothers are"),
  P("meri-ek-behen", "meri ek behen hai", "میری ایک بہن ہے", "I have one sister", literal="my one sister is"),
  P("kitne-bhai-behen", "aap ke kitne bhai behen hain?", "آپ کے کتنے بھائی بہن ہیں؟", "How many brothers and sisters do you have?"),
  P("kitne-bachche", "aap ke kitne bachche hain?", "آپ کے کتنے بچے ہیں؟", "How many children do you have?"),
  P("woh-kaun-hain", "woh kaun hain?", "وہ کون ہیں؟", "Who is that? (respectful)"),
  P("bilal-cousin", "Bilal mera cousin hai", "بلال میرا کزن ہے", "Bilal is my cousin", register="casual"),
  P("woh-doctor", "woh doctor hai", "وہ ڈاکٹر ہے", "He's a doctor", register="casual", note="You will hear this sentence about Bilal more than you hear your own name."),
  P("khandan-bara", "mera khandan bohat bara hai", "میرا خاندان بہت بڑا ہے", "My family is very big", accept=["mera khandan bohat bada hai"]),
  P("ammi-ka-naam", "aap ki ammi ka naam kya hai?", "آپ کی امی کا نام کیا ہے؟", "What's your mum's name?"),
  P("shaadi-shuda", "aap shaadi-shuda hain?", "آپ شادی شدہ ہیں؟", "Are you married?", accept=["aap shadi shuda hain", "aap shaadi shuda hain"]),
  P("abhi-nahin", "abhi nahin", "ابھی نہیں", "Not yet", literal="not now"),
  P("kis-ke-bete", "aap kis ke bete hain?", "آپ کس کے بیٹے ہیں؟", "Whose son are you?", note="The classic elder question. They're placing you on the family map."),
  # boss lines
  P("b.salam-aunty", "Assalam-o-alaikum, Aunty", "السلام علیکم آنٹی", "Hello, Aunty", register="formal", accept=["assalam o alaikum aunty", "salam aunty"]),
  P("b.aao-beta", "Walaikum assalam! Aao beta, baitho", "وعلیکم السلام! آؤ بیٹا، بیٹھو", "Hello! Come dear, sit", speaker="mrs-butt"),
  P("b.kis-ke-bete", "Tum kis ke bete ho?", "تم کس کے بیٹے ہو؟", "Whose son are you?", speaker="mrs-butt"),
  P("b.shahid-ka-beta", "Main Shahid ka beta hoon", "میں شاہد کا بیٹا ہوں", "I'm Shahid's son", accept=["main shahid ka beta hun"]),
  P("b.ammi-shabnam-behen", "Meri Ammi Shabnam Khala ki behen hain", "میری امی شبنم خالہ کی بہن ہیں", "My mum is Shabnam Khala's sister"),
  P("b.achha-achha", "Achha achha! Shabnam ki behen ka beta!", "اچھا اچھا! شبنم کی بہن کا بیٹا!", "Oh, of course! Shabnam's sister's son!", speaker="mrs-butt"),
  P("b.kitne-bhai-behen", "Kitne bhai behen ho?", "کتنے بھائی بہن ہو؟", "How many brothers and sisters have you got?", speaker="mrs-butt"),
  P("b.do-bhai-ek-behen", "Mere do bhai aur ek behen hai", "میرے دو بھائی اور ایک بہن ہے", "I've got two brothers and a sister", accept=["mere do bhai aur ek behen hain"]),
  P("b.main-akela", "Main akela hoon", "میں اکیلا ہوں", "I'm an only child", literal="I am alone", accept=["main akela hun"]),
  P("b.shaadi-hui", "Shaadi hui?", "شادی ہوئی؟", "Married yet?", speaker="mrs-butt"),
  P("b.abhi-nahin-aunty", "Abhi nahin, Aunty", "ابھی نہیں آنٹی", "Not yet, Aunty", accept=["abhi nahin", "ji abhi nahin aunty", "ji nahin aunty"]),
  P("b.mera-cousin-doctor", "Mera cousin Bilal doctor hai!", "میرا کزن بلال ڈاکٹر ہے!", "My cousin Bilal is a doctor!", register="casual"),
  P("b.spreadsheet", "Bohat achha! Main list mein likh leti hoon", "بہت اچھا! میں لسٹ میں لکھ لیتی ہوں", "Excellent! I'll just add you to the list", speaker="mrs-butt", register="casual"),
  P("b.bilal-bhi", "Bilal? Doctor Bilal? Woh bhi list mein hai", "بلال؟ ڈاکٹر بلال؟ وہ بھی لسٹ میں ہے", "Bilal? DOCTOR Bilal? He's on the list too", speaker="mrs-butt", register="casual"),
  P("b.khuda-hafiz-aunty", "Achha Aunty, Khuda hafiz!", "اچھا آنٹی، خدا حافظ!", "Okay Aunty, goodbye!", accept=["khuda hafiz aunty", "allah hafiz aunty", "achha aunty allah hafiz"]),
]

senses = {"grandparent-m": ["nana", "dada"], "grandparent-f": ["nani", "dadi"]}

def ex_type(phrase, prompt=None, **kw):
    d = {"type": "type", "phrase": f"{U}.{phrase}"}
    if prompt: d["prompt"] = prompt
    d.update(kw); return d

def tp(roman, urdu): return {"roman": roman, "urdu": urdu}
ids = lambda *xs: [f"{U}.{x}" for x in xs]

lessons = [
 {"id": "u02-l1", "title": "Ammi, Abbu & co.", "blurb": "Parents, siblings, kids. The people who eat your leftovers.",
  "canDo": "You can name your closest family in Urdu",
  "teach": [
    {"phrase": f"{U}.ammi", "tip": "Ammi, Ammi jaan, Mama, Mummy: families vary. Ammi is the classic."},
    {"phrase": f"{U}.abbu", "tip": "Abbu, Abba, Papa. Same man, same opinions about the thermostat."},
    {"phrase": f"{U}.bhai", "tip": "Brother. Also every man you need something from."},
    {"phrase": f"{U}.behen", "tip": "Sister. The 'h' is soft: beh-en."},
    {"phrase": f"{U}.beta", "tip": "Son. (Yes, and also everyone under 50, as you learned.)"},
    {"phrase": f"{U}.beti", "tip": "Daughter. Same pattern: -a for him, -i for her."},
  ],
  "exercises": [
    {"type": "match", "phrases": ids("ammi", "abbu", "bhai", "behen")},
    {"type": "meaning", "phrase": f"{U}.beti"},
    {"type": "listen", "phrase": f"{U}.behen"},
    {"type": "say", "phrase": f"{U}.yeh-mera-bhai", "prompt": "Introduce your brother.", "distractors": ids("yeh-meri-behen", "beta")},
    {"type": "mc", "prompt": "You call the waiter at the dhaba “bhai”. Is that weird?", "options": [{"text": "No. Any man around your age is bhai.", "feedback": "Correct. You now have thousands of brothers."}, {"text": "Yes, he's not your brother", "feedback": "He is now. That's how it works."}], "answer": 0},
    ex_type("behen", "Type: “sister”"),
    {"type": "build", "phrase": f"{U}.yeh-meri-behen", "distractors": [tp("mera", "میرا")]},
    ex_type("bachche", "Type: “children”"),
    {"type": "match", "phrases": ids("beta", "beti", "bachche", "khandan")},
  ]},
 {"id": "u02-l2", "title": "Mum's side", "blurb": "Nana, Nani, Khala, Mamoon. The fun side (don't tell Dad).",
  "canDo": "You can name everyone on your mum's side",
  "teach": [
    {"title": "Every side has its own words", "info": "English has 'aunt' and 'uncle'. Urdu tells you exactly WHICH aunt: mum's side or dad's side, older or younger, blood or married in. Get it right and elders melt. Get it wrong and you've just called Khala 'Phuppo' (a family feud in one word)."},
    {"phrase": f"{U}.nana", "tip": "Mum's dad. Nana = mum's side; remember N for 'Nani's husband'."},
    {"phrase": f"{U}.nani", "tip": "Mum's mum. Judge, jury, best halwa."},
    {"phrase": f"{U}.khala", "tip": "Mum's sister. Shabnam Khala is one of these. Brace yourself."},
    {"phrase": f"{U}.khalu", "tip": "Khala's husband. Usually quietly watching cricket."},
    {"phrase": f"{U}.mamoon", "tip": "Mum's brother. Traditionally the one who spoils you."},
    {"phrase": f"{U}.mumani", "tip": "Mamoon's wife. Many families say 'Mami'."},
  ],
  "exercises": [
    {"type": "match", "phrases": ids("nana", "nani", "khala", "mamoon")},
    {"type": "mc", "prompt": "Your mum's sister is your…", "options": [{"phrase": f"{U}.khala"}, {"phrase": f"{U}.phuppo", "feedback": "Phuppo is DAD's sister. Khala would like a word."}, {"phrase": f"{U}.mumani", "feedback": "Mumani married in: she's Mamoon's wife."}], "answer": 0},
    {"type": "mc", "prompt": "Your mum's brother is your…", "options": [{"phrase": f"{U}.mamoon"}, {"phrase": f"{U}.chacha", "feedback": "Chacha is on dad's side."}, {"phrase": f"{U}.khalu", "feedback": "Khalu married Khala. Different man."}], "answer": 0},
    {"type": "listen", "phrase": f"{U}.nani"},
    {"type": "say", "phrase": f"{U}.yeh-meri-khala", "prompt": "Introduce Shabnam Khala to a friend.", "distractors": ids("yeh-mere-mamoon", "yeh-meri-behen")},
    ex_type("mamoon", "Type the word for your mum's brother."),
    {"type": "build", "phrase": f"{U}.yeh-mere-mamoon", "distractors": [tp("mera", "میرا")]},
    {"type": "match", "phrases": ids("khalu", "mumani", "nana", "khala")},
    ex_type("nani-ka-ghar", "Type: “Nani's house”"),
  ]},
 {"id": "u02-l3", "title": "Dad's side", "blurb": "Dada, Dadi, Chacha, Taya, Phuppo. Older vs younger matters here.",
  "canDo": "You can name everyone on your dad's side, including older vs younger uncles",
  "teach": [
    {"phrase": f"{U}.dada", "tip": "Dad's dad. D for Dad's side: Dada, Dadi."},
    {"phrase": f"{U}.dadi", "tip": "Dad's mum."},
    {"phrase": f"{U}.taya", "tip": "Dad's OLDER brother. Seniority is everything."},
    {"phrase": f"{U}.chacha", "tip": "Dad's YOUNGER brother. Calling Taya 'Chacha' makes him younger, and he will not thank you."},
    {"phrase": f"{U}.phuppo", "tip": "Dad's sister. In TV dramas, the villain. In real life, usually lovely. Usually."},
    {"phrase": f"{U}.phuppa", "tip": "Phuppo's husband."},
    {"phrase": f"{U}.chachi", "tip": "Chacha's wife. (And Tai is Taya's wife.)"},
  ],
  "exercises": [
    {"type": "match", "phrases": ids("dada", "dadi", "chacha", "phuppo")},
    {"type": "mc", "prompt": "Your dad has an older brother. You call him…", "options": [{"phrase": f"{U}.taya"}, {"phrase": f"{U}.chacha", "feedback": "Chacha is the YOUNGER brother. Taya just aged backwards and he's not happy."}, {"phrase": f"{U}.mamoon", "feedback": "Mamoon is mum's brother."}], "answer": 0},
    {"type": "mc", "prompt": "Your dad's sister is your…", "options": [{"phrase": f"{U}.phuppo"}, {"phrase": f"{U}.khala", "feedback": "Khala is MUM's sister."}, {"phrase": f"{U}.chachi", "feedback": "Chachi married Chacha."}], "answer": 0},
    {"type": "listen", "phrase": f"{U}.phuppo"},
    {"type": "match", "phrases": ids("taya", "tai", "chachi", "phuppa")},
    ex_type("dadi", "Type: Dad's mum"),
    {"type": "mc", "prompt": "Which pair are BOTH on your dad's side?", "options": [{"text": "Dada and Phuppo"}, {"text": "Nani and Chacha", "feedback": "Nani is mum's side."}, {"text": "Khala and Taya", "feedback": "Khala is mum's side."}], "answer": 0, "explain": "D for Dad: Dada, Dadi. Then Chacha, Taya, Phuppo."},
    ex_type("chacha", "Type the word for dad's younger brother."),
  ]},
 {"id": "u02-l4", "title": "Ka, ki, ke", "blurb": "Mum's sister, Dad's brother: the little word that does all the work.",
  "canDo": "You can say whose relative someone is (Ammi ki behen, Abbu ke bhai)",
  "teach": [
    {"title": "ka, ki, ke = 's", "info": "Urdu says “Ammi ki behen”: Mum's sister. The little word changes to match the thing owned, not the owner: ka before a masculine word, ki before a feminine word, ke before a plural or a respected man. Behen is feminine, so: Ammi ki behen."},
    {"phrase": f"{U}.ammi-ki-behen", "tip": "Behen is feminine → ki. And Ammi ki behen = Khala."},
    {"phrase": f"{U}.abbu-ki-behen", "tip": "Same shape. Abbu ki behen = Phuppo."},
    {"phrase": f"{U}.ammi-ke-bhai", "tip": "An uncle is a respected man → ke. Ammi ke bhai = Mamoon."},
    {"phrase": f"{U}.nani-ka-ghar", "tip": "Ghar (house) is masculine → ka."},
    {"phrase": f"{U}.mera", "tip": "'My' works the same way: mera (m), meri (f), mere (plural or respect)."},
    {"phrase": f"{U}.meri"}, {"phrase": f"{U}.mere"},
  ],
  "exercises": [
    {"type": "gap", "phrase": f"{U}.ammi-ki-behen", "word": tp("ki", "کی"), "distractors": [tp("ka", "کا"), tp("ke", "کے")], "explain": "behen is feminine → ki"},
    {"type": "gap", "phrase": f"{U}.nani-ka-ghar", "word": tp("ka", "کا"), "distractors": [tp("ki", "کی"), tp("ke", "کے")], "explain": "ghar is masculine → ka"},
    {"type": "gap", "phrase": f"{U}.ammi-ke-bhai", "word": tp("ke", "کے"), "distractors": [tp("ka", "کا"), tp("ki", "کی")], "explain": "a respected man → ke"},
    {"type": "mc", "prompt": "“Abbu ke bare bhai” is your…", "show": f"{U}.abbu-ke-bare-bhai", "options": [{"phrase": f"{U}.taya"}, {"phrase": f"{U}.chacha", "feedback": "bare = older. Chacha is the younger one."}, {"phrase": f"{U}.mamoon"}], "answer": 0},
    {"type": "mc", "prompt": "“Abbu ki behen” is your…", "show": f"{U}.abbu-ki-behen", "options": [{"phrase": f"{U}.phuppo"}, {"phrase": f"{U}.khala"}, {"phrase": f"{U}.dadi"}], "answer": 0},
    {"type": "gap", "phrase": f"{U}.yeh-meri-behen", "word": tp("meri", "میری"), "distractors": [tp("mera", "میرا"), tp("mere", "میرے")], "explain": "behen is feminine → meri"},
    {"type": "gap", "phrase": f"{U}.yeh-mera-bhai", "word": tp("mera", "میرا"), "distractors": [tp("meri", "میری"), tp("mere", "میرے")], "explain": "bhai is masculine → mera"},
    {"type": "build", "phrase": f"{U}.abbu-ke-chhote-bhai", "prompt": "Explain who Chacha is: “Dad's younger brother”", "distractors": [tp("ki", "کی")]},
    ex_type("ammi-ki-behen", "Explain who Khala is: “Mum's sister”"),
  ]},
 {"id": "u02-l5", "title": "Meet the family", "blurb": "Introduce people, count siblings, answer the classic elder question.",
  "canDo": "You can introduce your family and say how many siblings you have",
  "teach": [
    {"phrase": f"{U}.mere-do-bhai", "tip": "Urdu doesn't 'have' siblings: it says 'my two brothers are'."},
    {"phrase": f"{U}.meri-ek-behen", "tip": "One sister → hai (singular). Two brothers → hain."},
    {"phrase": f"{U}.kitne-bhai-behen", "tip": "'Bhai behen' together = siblings."},
    {"phrase": f"{U}.woh-kaun-hain", "tip": "Point (discreetly) at someone at the dawat."},
    {"phrase": f"{U}.kis-ke-bete", "tip": "Elders place you by your parents. Answer with your dad's (or mum's) name: “Main Shahid ka beta hoon”."},
    {"phrase": f"{U}.khandan-bara", "tip": "Bara = big. Every Pakistani khandan is bohat bara."},
  ],
  "exercises": [
    {"type": "meaning", "phrase": f"{U}.kitne-bhai-behen"},
    {"type": "say", "phrase": f"{U}.mere-do-bhai", "prompt": "You have two brothers. Say so.", "distractors": ids("meri-ek-behen", "yeh-mera-bhai")},
    {"type": "gap", "phrase": f"{U}.meri-ek-behen", "word": tp("hai", "ہے"), "distractors": [tp("hain", "ہیں"), tp("hoon", "ہوں")], "explain": "one sister → hai"},
    {"type": "listen", "phrase": f"{U}.woh-kaun-hain", "speed": "aunty"},
    {"type": "build", "phrase": f"{U}.kitne-bhai-behen", "distractors": [tp("kya", "کیا")]},
    ex_type("mere-do-bhai", "Type: “I have two brothers”"),
    {"type": "mc", "prompt": "An elder asks “Aap kis ke bete hain?” What do they want?", "options": [{"text": "Your dad's name, to place you in the family", "feedback": "Exactly. Within 10 seconds they'll know your entire lineage."}, {"text": "Your job", "feedback": "That's the NEXT question."}], "answer": 0},
    ex_type("khandan-bara", "Type: “My family is very big”"),
    {"type": "speak", "phrase": f"{U}.mere-do-bhai"},
  ]},
 {"id": "u02-l6", "title": "Cousins & in-laws", "blurb": "Bhabhi, susral, and the cousin your parents won't stop mentioning.",
  "canDo": "You can talk about cousins and in-laws (and survive 'are you married?')",
  "teach": [
    {"phrase": f"{U}.cousin", "tip": "Just 'cousin'. Everyone code-switches here, and that's real Urdu."},
    {"phrase": f"{U}.bilal-cousin"},
    {"phrase": f"{U}.woh-doctor", "tip": "Hear it once, hear it forever."},
    {"phrase": f"{U}.bhabhi", "tip": "Your brother's wife. Also what you call a friend's wife."},
    {"phrase": f"{U}.susral", "tip": "Your spouse's family. Comes up a lot once you're married. Comes up even more before."},
    {"phrase": f"{U}.shaadi-shuda", "tip": "The question. Asked at every gathering, by every aunty."},
    {"phrase": f"{U}.abhi-nahin", "tip": "The answer. Add 'Aunty' and a polite smile."},
  ],
  "exercises": [
    {"type": "match", "phrases": ids("cousin", "bhabhi", "susral", "khandan")},
    {"type": "listen", "phrase": f"{U}.woh-doctor"},
    {"type": "say", "phrase": f"{U}.abhi-nahin", "prompt": "Rishta Aunty: “Aap shaadi-shuda hain?” You're not married yet.", "distractors": ids("woh-doctor", "bilal-cousin")},
    {"type": "build", "phrase": f"{U}.bilal-cousin", "distractors": [tp("meri", "میری")]},
    ex_type("shaadi-shuda", "Type the question every aunty asks: “Are you married?”"),
    {"type": "mc", "prompt": "Your brother's wife is your…", "options": [{"phrase": f"{U}.bhabhi"}, {"phrase": f"{U}.behen"}, {"phrase": f"{U}.chachi"}], "answer": 0},
    ex_type("abhi-nahin", "Type: “Not yet”"),
    {"type": "speak", "phrase": f"{U}.abhi-nahin"},
  ]},
]

o = lambda phrase, nxt, quality="fine", reaction=None: {k: v for k, v in {"phrase": f"{U}.{phrase}", "next": nxt, "quality": quality, "reaction": reaction}.items() if v is not None}
boss = {
 "id": "u02-boss", "title": "The Rishta Aunty", "character": "mrs-butt",
 "blurb": "Mrs. Butt corners you at a dawat. She has a spreadsheet. You are about to be in it.",
 "scene": "A dawat at Shabnam Khala's. You're reaching for a samosa when a hand lands on your shoulder. Mrs. Butt, the neighbourhood Rishta Aunty, smiles a smile that has arranged 300 marriages.",
 "canDo": "You can explain who you are in the family to a total stranger",
 "start": "m0",
 "nodes": {
  "m0": {"type": "you", "prompt": "Greet her respectfully.", "hint": "Assalam-o-alaikum…", "options": [o("b.salam-aunty", "m1", "great"), o("b.khuda-hafiz-aunty", "flee", "bold", "You tried to say goodbye before saying hello. She has not let go of your shoulder.")]},
  "flee": {"type": "npc", "speaker": "mrs-butt", "say": f"{U}.b.aao-beta", "next": "m2"},
  "m1": {"type": "npc", "speaker": "mrs-butt", "say": f"{U}.b.aao-beta", "next": "m2"},
  "m2": {"type": "npc", "speaker": "mrs-butt", "say": f"{U}.b.kis-ke-bete", "next": "m3"},
  "m3": {"type": "you", "prompt": "Place yourself in the family: your dad is Shahid, or say your mum is Shabnam Khala's sister.", "hint": "Main Shahid ka…", "options": [o("b.shahid-ka-beta", "m4", "fine", "She types 'Shahid' into her phone. Then stops. She needs more."), o("b.ammi-shabnam-behen", "m4", "great", "Her eyes light up. She KNOWS Shabnam.")]},
  "m4": {"type": "npc", "speaker": "mrs-butt", "say": f"{U}.b.achha-achha", "next": "m5"},
  "m5": {"type": "npc", "speaker": "mrs-butt", "say": f"{U}.b.kitne-bhai-behen", "next": "m6"},
  "m6": {"type": "you", "prompt": "Tell her about your siblings.", "hint": "Mere do bhai…", "options": [o("b.do-bhai-ek-behen", "m7", "great"), o("b.main-akela", "m7", "fine", "'Akela!' She writes something down. It's underlined.")]},
  "m7": {"type": "npc", "speaker": "mrs-butt", "say": f"{U}.b.shaadi-hui", "next": "m8"},
  "m8": {"type": "you", "prompt": "Answer the inevitable question. Or deflect to Bilal.", "hint": "Abhi nahin…", "options": [o("b.abhi-nahin-aunty", "list-you", "great"), o("b.mera-cousin-doctor", "list-bilal", "bold", "You threw your cousin under the bus. Respect.")]},
  "list-you": {"type": "npc", "speaker": "mrs-butt", "say": f"{U}.b.spreadsheet", "next": "bye"},
  "list-bilal": {"type": "npc", "speaker": "mrs-butt", "say": f"{U}.b.bilal-bhi", "next": "bye-bilal"},
  "bye-bilal": {"type": "narration", "text": "Across the room, Bilal's phone buzzes. He looks up, confused. You eat your samosa in peace.", "next": "bye"},
  "bye": {"type": "you", "prompt": "Escape. Politely.", "hint": "Achha Aunty, Khuda hafiz", "options": [o("b.khuda-hafiz-aunty", "end", "great"), {"phrase": "u01.allah-hafiz", "next": "end", "quality": "fine"}]},
  "end": {"type": "end", "title": "You survived the Rishta Aunty", "text": "You introduced yourself, placed yourself in the family tree, and got out alive. You are now in a spreadsheet. Everyone is. It's fine.", "outcome": "survived"},
 }}

unit = {
 "id": U, "track": "speaking", "order": 2, "title": "The Family Tree", "titleUrdu": "خاندان",
 "emoji": "🌳", "tagline": "Khala vs Phuppo, Chacha vs Taya, and who exactly Bilal is.",
 "canDo": "You can explain who's who in your family, on both sides",
 "grammar": [
  {"title": "ka, ki, ke (possessive 's)", "body": "X ka/ki/ke Y = X's Y. The form agrees with Y, the thing owned: ka for masculine (Nani ka ghar), ki for feminine (Ammi ki behen), ke for plural or a respected man (Ammi ke bhai). 'My' works the same: mera, meri, mere."},
  {"title": "Mum's side vs dad's side", "body": "Maternal: Nana, Nani, Khala (+Khalu), Mamoon (+Mumani). Paternal: Dada, Dadi, Phuppo (+Phuppa), Chacha (younger, +Chachi), Taya (older, +Tai). Add 'ji' to any of them for extra respect: Khala ji, Taya ji."},
  {"title": "Having = 'my X is/are'", "body": "Urdu has no everyday verb 'to have' for family. 'I have two brothers' is 'mere do bhai hain' (my two brothers are)."},
 ],
 "phrases": phrases, "lessons": lessons, "boss": boss,
}
for s, keys in senses.items():
    for ph in phrases:
        if ph["id"].split(".", 1)[1] in keys: ph["sense"] = s

out = pathlib.Path(__file__).resolve().parents[2] / "content" / "units" / f"{U}.json"
# keep any sources already verified
if out.exists():
    old = {p["id"]: p for p in json.loads(out.read_text())["phrases"]}
    for ph in phrases:
        if ph["id"] in old and old[ph["id"]].get("sources") and old[ph["id"]]["urdu"] == ph["urdu"]:
            ph["sources"] = old[ph["id"]]["sources"]; ph["confidence"] = old[ph["id"]]["confidence"]
for ph in phrases:
    ph.setdefault("sources", [{"ref": "usage", "checked": "2026-11-16"}])
out.write_text(json.dumps(unit, ensure_ascii=False, indent=2) + "\n")
print("wrote", out, len(phrases), "phrases")
