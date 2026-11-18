"""Add the v2 exercise formats to units 1–12 (H16). Run after any of u01.py … u12.py is re-run.

For each unit: one overheard scene (new two- or three-line exchange between characters) goes into
the Mix-it-up lesson, and the last multi-word listen exercise of each other lesson becomes a
dictation. Idempotent."""
import json
from common import ROOT, UNITS

S = {
 "u01": ([("khala", "s-khala-salam", "Assalam-o-alaikum, Ammi! Aap kaisi hain?", "السلام علیکم، امی! آپ کیسی ہیں؟", "Hello, Mum! How are you?"),
          ("nani", "s-nani-theek", "Walaikum assalam. Main theek hoon, Alhamdulillah", "وعلیکم السلام۔ میں ٹھیک ہوں، الحمدللہ", "Hello. I'm fine, thank God")],
         "Khala rings her own mother's doorbell.", "How is Nani?", ["Fine, thank God", ("Tired", "She says theek: fine."), ("She doesn't say", "She does: main theek hoon.")], False),
 "u02": ([("mrs-butt", "s-butt-kaun", "Yeh kaun hai?", "یہ کون ہے؟", "Who is this?"),
          ("khala", "s-khala-behen", "Yeh meri behen ka beta hai", "یہ میری بہن کا بیٹا ہے", "This is my sister's son")],
         "A wedding. Mrs. Butt has spotted someone she can't place.", "Who is Khala introducing?", ["Her nephew", ("Her own son", "behen ka beta: her sister's son."), ("Her brother", "beta is son. Brother would be bhai.")], False),
 "u03": ([("nani", "s-nani-aur", "Aur lo, Bilal", "اور لو، بلال", "Have some more, Bilal"),
          ("bilal", "s-bilal-bas", "Bas, Nani. Pait bhar gaya", "بس، نانی۔ پیٹ بھر گیا", "Enough, Nani. I'm full"),
          ("nani", "s-nani-roti", "Ek roti aur lo", "ایک روٹی اور لو", "Have one more roti")],
         "Lunch at Nani's. Bilal is on his third plate.", "Does Nani accept that Bilal is full?", ["No. She offers another roti", ("Yes, she clears the plates", "This is Nani. Nobody is ever full."), ("She brings chai instead", "Not yet. First, one more roti.")], True),
 "u04": ([("khala", "s-khala-awaaz", "Hello? Awaaz nahin aa rahi!", "ہیلو؟ آواز نہیں آ رہی!", "Hello? I can't hear you!"),
          ("ammi", "s-ammi-baad", "Main baad mein phone karti hoon", "میں بعد میں فون کرتی ہوں", "I'll call you later")],
         "A call to Lahore. The line is doing what it always does.", "What's the problem?", ["Khala can't hear", ("Ammi is too busy to talk", "She'll call later because the line is bad."), ("It's a wrong number", "Right number. Wrong connection.")], True),
 "u05": ([("bashir", "s-bashir-daam", "Yeh paanch sau rupay ka hai", "یہ پانچ سو روپے کا ہے", "This one is five hundred rupees"),
          ("ammi", "s-ammi-daam", "Paanch sau? Bohat mehnga hai. Teen sau", "پانچ سو؟ بہت مہنگا ہے۔ تین سو", "Five hundred? Far too expensive. Three hundred")],
         "Bashir Bhai's shop. Ammi has picked up a dupatta.", "What price does Ammi offer?", ["300 rupees", ("500 rupees", "That's Bashir Bhai's price. She says teen sau."), ("200 rupees", "teen is three.")], True),
 "u06": ([("ammi", "s-ammi-rok", "Bhai, masjid ke paas rok dijiye", "بھائی، مسجد کے پاس روک دیجیے", "Brother, please stop near the mosque"),
          ("pervez", "s-pervez-do", "Ji, bas do minute", "جی، بس دو منٹ", "Yes, just two minutes")],
         "In Pervez's rickshaw.", "Where does Ammi want to stop?", ["Near the mosque", ("At the bazaar", "She says masjid ke paas."), ("Right here", "In two minutes, near the mosque.")], False),
 "u07": ([("khala", "s-khala-dulhan", "Dulhan kitni khoobsurat lag rahi hai!", "دلہن کتنی خوبصورت لگ رہی ہے!", "The bride looks so beautiful!"),
          ("mrs-butt", "s-butt-khana", "Mashallah. Aur khana kab lagega?", "ماشاء اللہ۔ اور کھانا کب لگے گا؟", "Mashallah. And when will the food be served?")],
         "The bride has just walked in.", "What is Mrs. Butt really thinking about?", ["The food", ("The bride's outfit", "She gives it one Mashallah and moves on."), ("The dancing", "khana kab lagega: when is the food.")], True),
 "u08": ([("abbu", "s-abbu-sar", "Mere sar mein dard hai", "میرے سر میں درد ہے", "I've got a headache"),
          ("ammi", "s-ammi-chai", "Chai kam piyo, paani zyada", "چائے کم پیو، پانی زیادہ", "Drink less tea, more water")],
         "Abbu is on his fifth cup of the day.", "What does Ammi advise?", ["Less tea, more water", ("See a doctor", "Bilal is spared this time."), ("Go to sleep", "kam chai, zyada paani.")], False),
 "u09": ([("mrs-butt", "s-butt-bilal", "Bilal kya karta hai?", "بلال کیا کرتا ہے؟", "What does Bilal do?"),
          ("khala", "s-khala-doctor", "Woh doctor hai. Sab ko pata hai", "وہ ڈاکٹر ہے۔ سب کو پتا ہے", "He's a doctor. Everybody knows that")],
         "Mrs. Butt is updating her records.", "What does Bilal do?", ["He's a doctor", ("He's an engineer", "As if the family would let you forget."), ("He's still studying", "Woh doctor hai.")], True),
 "u10": ([("bilal", "s-bilal-eidi", "Eid mubarak, Nani! Meri eidi?", "عید مبارک، نانی! میری عیدی؟", "Eid mubarak, Nani! My Eidi?"),
          ("nani", "s-nani-eidi", "Tum doctor ho. Tum mujhe eidi do", "تم ڈاکٹر ہو۔ تم مجھے عیدی دو", "You're a doctor. You give ME Eidi")],
         "Eid morning.", "Who ends up owing Eidi?", ["Bilal", ("Nani", "She turns it round: tum mujhe eidi do."), ("Nobody", "Somebody always owes Eidi.")], False),
 "u11": ([("abbu", "s-abbu-pankha", "Pankha band karo", "پنکھا بند کرو", "Turn the fan off"),
          ("ammi", "s-ammi-pankha", "Itni garmi mein? Khud band karo", "اتنی گرمی میں؟ خود بند کرو", "In this heat? Turn it off yourself")],
         "July. 44 degrees. Abbu has seen the bill.", "Does Ammi turn the fan off?", ["No", ("Yes", "khud band karo: do it yourself.")], True),
 "u12": ([("khala", "s-khala-gir", "Pata hai kya hua? Bilal gir gaya!", "پتا ہے کیا ہوا؟ بلال گر گیا!", "Guess what happened? Bilal fell over!"),
          ("nani", "s-nani-phir", "Haye Allah! Phir kya hua?", "ہائے اللہ! پھر کیا ہوا؟", "Oh my God! Then what happened?"),
          ("khala", "s-khala-theek", "Kuch nahin. Woh theek hai", "کچھ نہیں۔ وہ ٹھیک ہے", "Nothing. He's fine")],
         "Khala bursts in with news.", "Is Bilal all right?", ["Yes, he's fine", ("He's in hospital", "woh theek hai."), ("Nobody knows", "Khala knows. Khala always knows.")], False),
}

for uid, (lines, setup, question, options, hide) in S.items():
    f = UNITS / f"{uid}.json"
    u = json.loads(f.read_text())
    old = {p["id"]: p for p in u["phrases"]}
    u["phrases"] = [p for p in u["phrases"] if not p["id"].startswith(f"{uid}.b.s-")]
    for speaker, key, roman, urdu, en in lines:
        pid = f"{uid}.b.{key}"
        p = {"id": pid, "roman": roman, "urdu": urdu, "en": en, "confidence": "high", "speaker": speaker, "sources": [{"ref": "usage", "checked": "2026-11-18"}]}
        if pid in old and old[pid]["urdu"] == urdu:
            p["sources"], p["confidence"] = old[pid]["sources"], old[pid]["confidence"]
        u["phrases"].append(p)
    scene = {"type": "scene", "setup": setup, "lines": [{"speaker": sp, "phrase": f"{uid}.b.{k}"} for sp, k, *_ in lines], "question": question,
             "options": [{"text": o} if isinstance(o, str) else {"text": o[0], "feedback": o[1]} for o in options], "answer": 0}
    if hide:
        scene["hideText"] = True
    by_id = {p["id"]: p for p in u["phrases"]}
    for l in u["lessons"]:
        if l["id"].endswith("-mix"):
            l["exercises"] = [e for e in l["exercises"] if e["type"] != "scene"]
            l["exercises"].insert(1, scene)
        else:
            if any(e["type"] == "dictation" for e in l["exercises"]):
                continue
            for i in range(len(l["exercises"]) - 1, -1, -1):
                e = l["exercises"][i]
                if e["type"] == "listen" and len(by_id[e["phrase"]]["roman"].split()) >= 2:
                    l["exercises"][i] = {"type": "dictation", "phrase": e["phrase"], "speed": e.get("speed", "normal")}
                    break
    f.write_text(json.dumps(u, ensure_ascii=False, indent=2) + "\n")
    print(uid, "scene +", sum(1 for l in u["lessons"] for e in l["exercises"] if e["type"] == "dictation"), "dictations")
