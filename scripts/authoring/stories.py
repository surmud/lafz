"""Stories (H19): short narrated stories for comprehensible input. Run after uNN.py and retrofit.py.

Each story's lines become phrases u<NN>.b.st-<n> (kept out of drills like other non-core lines), and
the unit gets a `story`. Idempotent."""
import json
from common import ROOT

N = None  # narrator
STORIES = {
 "u01": {"title": "The new neighbour", "emoji": "🚪", "blurb": "Someone rings the bell on a Sunday morning. He stays rather a long time.",
  "lines": [
   (N, "Aaj subah darwaze par ghanti baji.", "آج صبح دروازے پر گھنٹی بجی۔", "This morning the doorbell rang."),
   (N, "Darwaze par ek buzurg khade the.", "دروازے پر ایک بزرگ کھڑے تھے۔", "An elderly man was standing at the door."),
   ("ammi", "Assalam-o-alaikum! Aap kaun hain?", "السلام علیکم! آپ کون ہیں؟", "Hello! Who are you?"),
   ("bashir", "Walaikum assalam. Main aap ka naya padosi hoon.", "وعلیکم السلام۔ میں آپ کا نیا پڑوسی ہوں۔", "Hello. I'm your new neighbour."),
   ("ammi", "Aaiye, andar aaiye! Chai piyenge?", "آئیے، اندر آئیے! چائے پئیں گے؟", "Come in, come in! Will you have tea?"),
   ("bashir", "Ji, shukriya. Lekin sirf aadha cup.", "جی، شکریہ۔ لیکن صرف آدھا کپ۔", "Yes, thank you. But only half a cup."),
   (N, "Woh teen ghante baithe rahe, aur chaar cup chai pi gaye.", "وہ تین گھنٹے بیٹھے رہے، اور چار کپ چائے پی گئے۔", "He stayed for three hours and drank four cups of tea."),
   ("ammi", "Khuda hafiz! Phir aaiyega.", "خدا حافظ! پھر آئیے گا۔", "Goodbye! Do come again."),
  ],
  "glossary": {"aaj": "today", "subah": "morning", "darwaze": "door (the door)", "par": "on, at", "ghanti": "bell", "baji": "rang", "ek": "one, a", "buzurg": "elderly person (respectful)", "khade": "standing", "the": "were", "kaun": "who", "naya": "new", "padosi": "neighbour", "andar": "inside", "piyenge": "will (you) drink", "sirf": "only", "aadha": "half", "cup": "cup", "woh": "he, she, they", "teen": "three", "ghante": "hours", "baithe": "sat", "rahe": "stayed, kept (doing)", "chaar": "four", "pi": "drank", "gaye": "went (here: finished doing)", "phir": "again, then", "aaiyega": "please come (polite future)", "aaiye": "come (polite)", "ka": "of ('s)"},
  "questions": [
   {"question": "Who was at the door?", "options": [{"text": "The new neighbour"}, {"text": "Khala", "feedback": "Not this time. He says: main aap ka naya padosi hoon."}, {"text": "The postman", "feedback": "padosi means neighbour."}], "answer": 0},
   {"question": "He asked for half a cup. How much did he drink?", "options": [{"text": "Four cups"}, {"text": "Half a cup", "feedback": "That was the plan. Listen to the narrator: chaar cup."}, {"text": "None", "feedback": "He had plenty. Three hours' worth."}], "answer": 0}]},
 "u03": {"title": "Nani's table", "emoji": "🍛", "blurb": "Sunday lunch at Nani's. There is always room for more. Apparently.",
  "lines": [
   (N, "Itwaar ko hum Nani ke ghar gaye.", "اتوار کو ہم نانی کے گھر گئے۔", "On Sunday we went to Nani's house."),
   (N, "Mez par biryani, qorma, kabab aur teen qisam ki roti thi.", "میز پر بریانی، قورمہ، کباب اور تین قسم کی روٹی تھی۔", "On the table there was biryani, korma, kebabs and three kinds of roti."),
   ("nani", "Khao, beta! Tum bohat patle ho gaye ho.", "کھاؤ، بیٹا! تم بہت پتلے ہو گئے ہو۔", "Eat, dear! You've got so thin."),
   (N, "Maine do plate khaayin.", "میں نے دو پلیٹ کھائیں۔", "I ate two plates."),
   ("nani", "Bas? Aur lo!", "بس؟ اور لو!", "That's it? Have more!"),
   (N, "Nani, bas! Pait bhar gaya.", "نانی، بس! پیٹ بھر گیا۔", "Nani, enough! I'm full."),
   ("nani", "Achha. Phir meetha khao. Kheer bani hai.", "اچھا۔ پھر میٹھا کھاؤ۔ کھیر بنی ہے۔", "Fine. Then have dessert. There's kheer."),
   (N, "Kheer ke liye pait mein hamesha jagah hoti hai.", "کھیر کے لیے پیٹ میں ہمیشہ جگہ ہوتی ہے۔", "There's always room in the stomach for kheer."),
  ],
  "glossary": {"itwaar": "Sunday", "ko": "on (a day), to", "hum": "we", "ke": "of ('s)", "ghar": "house, home", "gaye": "went", "mez": "table", "par": "on", "aur": "and", "teen": "three", "qisam": "kind, type", "ki": "of", "roti": "flatbread", "thi": "was", "khao": "eat!", "beta": "dear (to a child)", "tum": "you", "bohat": "very", "patle": "thin", "ho": "are, become", "maine": "I (did)", "do": "two", "plate": "plate(s)", "khaayin": "ate", "bas": "enough, that's all", "lo": "take", "pait": "stomach", "bhar": "full", "gaya": "became, went", "achha": "okay, fine", "phir": "then", "meetha": "something sweet, dessert", "kheer": "rice pudding", "bani": "made", "hai": "is", "liye": "for", "mein": "in", "hamesha": "always", "jagah": "room, space", "hoti": "is (usually)"},
  "questions": [
   {"question": "Why does Nani say you must eat?", "options": [{"text": "You've got too thin"}, {"text": "The food will go cold", "feedback": "Not her argument. Listen for patle."}, {"text": "It's someone's birthday", "feedback": "No occasion needed."}], "answer": 0},
   {"question": "You said you were full. What happened next?", "options": [{"text": "You ate kheer anyway"}, {"text": "You went home", "feedback": "Nobody leaves Nani's that easily."}, {"text": "Nani cleared the table", "feedback": "She brought dessert."}], "answer": 0}]},
 "u06": {"title": "First rickshaw", "emoji": "🛺", "blurb": "Your first solo trip across Lahore. Pervez has quoted a price.",
  "lines": [
   (N, "Main Lahore mein pehli baar akela bahar gaya.", "میں لاہور میں پہلی بار اکیلا باہر گیا۔", "For the first time, I went out alone in Lahore."),
   ("pervez", "Kahan jana hai, bhai?", "کہاں جانا ہے، بھائی؟", "Where to, brother?"),
   (N, "Anarkali bazaar. Kitne paise?", "انارکلی بازار۔ کتنے پیسے؟", "Anarkali bazaar. How much?"),
   ("pervez", "Aath sau.", "آٹھ سو۔", "Eight hundred."),
   (N, "Aath sau? Bohat zyada hai! Chaar sau.", "آٹھ سو؟ بہت زیادہ ہے! چار سو۔", "Eight hundred? That's far too much! Four hundred."),
   ("pervez", "Chalo, paanch sau. Aakhri daam.", "چلو، پانچ سو۔ آخری دام۔", "Fine, five hundred. Final price."),
   (N, "Rickshaw bohat tez chala. Maine aankhein band kar leen.", "رکشا بہت تیز چلا۔ میں نے آنکھیں بند کر لیں۔", "The rickshaw went very fast. I shut my eyes."),
   (N, "Bazaar mein Ammi ne bataya: kiraya teen sau hota hai.", "بازار میں امی نے بتایا: کرایہ تین سو ہوتا ہے۔", "At the bazaar Ammi told me: the fare is usually three hundred."),
  ],
  "glossary": {"main": "I", "mein": "in", "pehli": "first", "baar": "time", "akela": "alone", "bahar": "out", "gaya": "went", "kahan": "where", "jana": "to go", "hai": "is", "bhai": "brother", "kitne": "how many, how much", "paise": "money", "aath": "eight", "sau": "hundred", "bohat": "very", "zyada": "too much", "chaar": "four", "chalo": "okay, come on", "paanch": "five", "aakhri": "last, final", "daam": "price", "tez": "fast", "chala": "went, moved", "maine": "I (did)", "aankhein": "eyes", "band": "closed", "kar": "do", "leen": "(did for myself)", "ammi": "Mum", "ne": "(marks who did it)", "bataya": "told", "kiraya": "fare", "teen": "three", "hota": "is (usually)", "rickshaw": "auto-rickshaw"},
  "questions": [
   {"question": "How much did you agree to pay?", "options": [{"text": "500"}, {"text": "800", "feedback": "That was his opening price."}, {"text": "400", "feedback": "Your offer. He came back with paanch sau."}], "answer": 0},
   {"question": "What is the usual fare, according to Ammi?", "options": [{"text": "300"}, {"text": "500", "feedback": "That's what you paid. Ammi says teen sau."}, {"text": "800", "feedback": "Nobody pays that. Except tourists."}], "answer": 0}]},
 "u10": {"title": "Moon night", "emoji": "🌙", "blurb": "The last night of Ramzan. Everyone is on the roof, looking for the moon.",
  "lines": [
   (N, "Ramzan ka aakhri din tha.", "رمضان کا آخری دن تھا۔", "It was the last day of Ramzan."),
   (N, "Sab chhat par chaand dekh rahe the.", "سب چھت پر چاند دیکھ رہے تھے۔", "Everyone was on the roof looking for the moon."),
   ("bilal", "Woh raha chaand!", "وہ رہا چاند!", "There's the moon!"),
   ("khala", "Kahan? Mujhe to sirf badal nazar aa rahe hain.", "کہاں؟ مجھے تو صرف بادل نظر آ رہے ہیں۔", "Where? All I can see is clouds."),
   ("abbu", "TV par ailaan ho gaya. Kal Eid hai!", "ٹی وی پر اعلان ہو گیا۔ کل عید ہے!", "It's been announced on TV. Eid is tomorrow!"),
   (N, "Sab ne ek doosre ko gale lagaya.", "سب نے ایک دوسرے کو گلے لگایا۔", "Everyone hugged each other."),
   ("nani", "Chalo, mehndi lagao aur choodiyan pehno.", "چلو، مہندی لگاؤ اور چوڑیاں پہنو۔", "Come on, put on mehndi and wear your bangles."),
   (N, "Raat bhar koi nahin soya.", "رات بھر کوئی نہیں سویا۔", "Nobody slept all night."),
  ],
  "glossary": {"ramzan": "the month of fasting", "ka": "of", "aakhri": "last", "din": "day", "tha": "was", "sab": "everyone, all", "chhat": "roof", "par": "on", "chaand": "moon", "dekh": "look, see", "rahe": "(were) -ing", "the": "were", "woh": "that, there", "raha": "(there it) is", "kahan": "where", "mujhe": "to me", "to": "(emphasis)", "sirf": "only", "badal": "clouds", "nazar": "sight", "aa": "come", "hain": "are", "tv": "TV", "ailaan": "announcement", "ho": "be", "gaya": "has (been)", "kal": "tomorrow", "eid": "Eid", "hai": "is", "ne": "(marks who did it)", "ek": "one", "doosre": "other", "ko": "to", "gale": "neck (gale lagana: to hug)", "lagaya": "put, applied", "chalo": "come on", "mehndi": "henna", "lagao": "put on", "aur": "and", "choodiyan": "bangles", "pehno": "wear", "raat": "night", "bhar": "all through", "koi": "anyone", "nahin": "not", "soya": "slept"},
  "questions": [
   {"question": "How did the family find out Eid was tomorrow?", "options": [{"text": "It was announced on TV"}, {"text": "Bilal saw the moon", "feedback": "He says he did. Khala only saw clouds. Abbu settles it: TV par ailaan."}, {"text": "Nani decided", "feedback": "She'd like to. But it was the TV."}], "answer": 0},
   {"question": "What did Khala see?", "options": [{"text": "Only clouds"}, {"text": "The moon", "feedback": "sirf badal: only clouds."}], "answer": 0}]},
 "u12": {"title": "The power cut", "emoji": "🔦", "blurb": "The best wedding of the year, thanks to the electricity company.",
  "lines": [
   (N, "Pata hai pichhle hafte shaadi mein kya hua?", "پتا ہے پچھلے ہفتے شادی میں کیا ہوا؟", "Guess what happened at the wedding last week?"),
   (N, "Dulha stage par aaya hi tha ke achanak bijli chali gayi.", "دولہا سٹیج پر آیا ہی تھا کہ اچانک بجلی چلی گئی۔", "The groom had just come on stage when suddenly the power went out."),
   (N, "Sab andhere mein chillane lage.", "سب اندھیرے میں چلانے لگے۔", "Everyone started shouting in the dark."),
   ("khala", "Generator kahan hai? Koi generator chalao!", "جنریٹر کہاں ہے؟ کوئی جنریٹر چلاؤ!", "Where's the generator? Somebody start the generator!"),
   (N, "Phir Bilal ne apne phone ki torch jalayi.", "پھر بلال نے اپنے فون کی ٹارچ جلائی۔", "Then Bilal switched on his phone's torch."),
   (N, "Uske baad sab ne torch jalayi. Bohat khoobsurat lag raha tha.", "اس کے بعد سب نے ٹارچ جلائی۔ بہت خوبصورت لگ رہا تھا۔", "After that everyone switched on their torches. It looked beautiful."),
   ("nani", "Hamare zamane mein to lalten hoti thi.", "ہمارے زمانے میں تو لالٹین ہوتی تھی۔", "In my day we had lanterns."),
   (N, "Aakhir mein bijli aa gayi, lekin sab ne kaha: torch wali shaadi behtar thi.", "آخر میں بجلی آ گئی، لیکن سب نے کہا: ٹارچ والی شادی بہتر تھی۔", "In the end the power came back, but everyone said: the torch wedding was better."),
  ],
  "glossary": {"pata": "known (pata hai: do you know)", "hai": "is", "pichhle": "last", "hafte": "week", "shaadi": "wedding", "mein": "in", "kya": "what", "hua": "happened", "dulha": "groom", "stage": "stage", "par": "on", "aaya": "came", "hi": "just", "tha": "was, had", "ke": "when, that", "achanak": "suddenly", "bijli": "electricity", "chali": "went", "gayi": "(went) away", "sab": "everyone", "andhere": "darkness", "chillane": "to shout", "lage": "started", "generator": "generator", "kahan": "where", "koi": "someone", "chalao": "start, run (it)", "phir": "then", "ne": "(marks who did it)", "apne": "his own", "phone": "phone", "ki": "of", "torch": "torch, flashlight", "jalayi": "lit, switched on", "uske": "that", "baad": "after", "bohat": "very", "khoobsurat": "beautiful", "lag": "seem", "raha": "(was) -ing", "hamare": "our", "zamane": "times, era", "to": "(emphasis)", "lalten": "lantern", "hoti": "used to be", "thi": "was", "aakhir": "end", "aa": "come", "lekin": "but", "kaha": "said", "wali": "the one with", "behtar": "better"},
  "questions": [
   {"question": "When did the power go out?", "options": [{"text": "Just as the groom came on stage"}, {"text": "During dinner", "feedback": "Earlier: dulha stage par aaya hi tha."}, {"text": "At the end", "feedback": "At the end it came back."}], "answer": 0},
   {"question": "Who switched on the first torch?", "options": [{"text": "Bilal"}, {"text": "Khala", "feedback": "Khala was shouting for the generator."}, {"text": "Nani", "feedback": "Nani was busy remembering lanterns."}], "answer": 0}]},
}

for uid, st in STORIES.items():
    f = ROOT / "content" / "units" / f"{uid}.json"
    u = json.loads(f.read_text())
    old = {p["id"]: p for p in u["phrases"]}
    u["phrases"] = [p for p in u["phrases"] if not p["id"].startswith(f"{uid}.b.st-")]
    lines = []
    for i, (speaker, roman, urdu, en) in enumerate(st["lines"], 1):
        pid = f"{uid}.b.st-{i}"
        p = {"id": pid, "roman": roman, "urdu": urdu, "en": en, "confidence": "high", "sources": [{"ref": "usage", "checked": "2026-11-18"}]}
        if speaker:
            p["speaker"] = speaker
        o = old.get(pid)
        if o and o["urdu"] == urdu:
            p["sources"], p["confidence"] = o["sources"], o["confidence"]
        u["phrases"].append(p)
        lines.append({"phrase": pid, **({"speaker": speaker} if speaker else {})})
    u["story"] = {"title": st["title"], "emoji": st["emoji"], "blurb": st["blurb"], "lines": lines, "glossary": st["glossary"], "questions": st["questions"]}
    f.write_text(json.dumps(u, ensure_ascii=False, indent=2) + "\n")
    print(uid, st["title"], len(lines), "lines")
