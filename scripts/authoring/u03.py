"""Unit 3: Dawat Survival."""
from common import Unit, info, write_unit

u = Unit("u03")
P = u.P
P("khana-lag-gaya", "khana lag gaya hai", "کھانا لگ گیا ہے", "Food's on the table", literal="food has been laid")
P("bismillah", "Bismillah", "بسم اللہ", "In the name of God (said before eating)", accept=["bismilla", "bismila"])
P("roti", "roti", "روٹی", "flatbread", sense="food")
P("chawal", "chawal", "چاول", "rice", accept=["chaawal"])
P("salan", "salan", "سالن", "curry", note="The generic word for any curry with gravy.")
P("daal", "daal", "دال", "lentils", accept=["dal"])
P("gosht", "gosht", "گوشت", "meat")
P("sabzi", "sabzi", "سبزی", "vegetables / veg curry")
P("mithai", "mithai", "مٹھائی", "sweets")
P("chai", "chai", "چائے", "tea", accept=["chae", "chaye"])
P("paani", "paani", "پانی", "water")
P("cheeni", "cheeni", "چینی", "sugar")
P("mirch", "mirch", "مرچ", "chilli / spice heat", accept=["mirchi"])
P("mazedaar", "bohat mazedaar hai", "بہت مزیدار ہے", "It's delicious", sense="yum", accept=["bohot mazedar hai", "bohat mazedar hai"])
P("khana-achha", "khana bohat achha hai", "کھانا بہت اچھا ہے", "The food is really good", sense="yum")
P("chai-achhi", "chai bohat achhi hai", "چائے بہت اچھی ہے", "The tea is really good", sense="yum")
P("maza-aa-gaya", "maza aa gaya!", "مزہ آ گیا!", "That was amazing!", literal="enjoyment came", sense="yum", accept=["mazaa aa gaya", "maza agaya"])
P("haath-zaiqa", "aap ke haath mein bohat zaiqa hai", "آپ کے ہاتھ میں بہت ذائقہ ہے", "You cook so well", literal="there's great flavour in your hands", note="The ultimate compliment to the cook. Say this to Nani and you're in the will.", sense="yum")
P("bas-bas", "bas, bas!", "بس، بس!", "Enough, enough!", note="Say it with a hand over your plate. Words alone do not stop a desi host.", sense="enough")
P("pait-bhar-gaya", "mera pait bhar gaya", "میرا پیٹ بھر گیا", "I'm full", literal="my stomach has filled", sense="enough", accept=["mera pet bhar gaya", "pait bhar gaya"])
P("aur-nahin", "aur nahin, shukriya", "اور نہیں، شکریہ", "No more, thank you", sense="enough")
P("thora-sa", "thora sa", "تھوڑا سا", "just a little", accept=["thoda sa"])
P("aur-lo", "aur lo, beta", "اور لو بیٹا", "Have some more, dear", speaker="nani", accept=["aur lo"])
P("mujhe-chai", "mujhe chai chahiye", "مجھے چائے چاہیے", "I'd like some tea", literal="to me, tea is needed", sense="want")
P("mujhe-paani", "mujhe paani chahiye", "مجھے پانی چاہیے", "I'd like some water", sense="want")
P("paani-milega", "paani milega?", "پانی ملے گا؟", "Could I have some water?", literal="will water be got?", accept=["pani milega"])
P("chai-piyenge", "chai piyenge?", "چائے پئیں گے؟", "Will you have some tea? (respectful)", accept=["chai peeyenge", "chai pienge"])
P("ji-zaroor", "ji, zaroor", "جی، ضرور", "Yes, of course")
P("cheeni-kam", "cheeni kam", "چینی کم", "Less sugar", note="Say this immediately. Desi chai default sweetness is 'dentist's retirement fund'.")
P("biryani-pasand", "mujhe biryani pasand hai", "مجھے بریانی پسند ہے", "I like biryani", literal="to me, biryani is liked")
P("mirch-pasand-nahin", "mujhe mirch pasand nahin", "مجھے مرچ پسند نہیں", "I don't like spicy food", accept=["mujhe mirch pasand nahin hai", "mujhe mirchi pasand nahin"])
P("yeh-kya-hai", "yeh kya hai?", "یہ کیا ہے؟", "What's this?")
P("kis-ne-banaya", "yeh kis ne banaya?", "یہ کس نے بنایا؟", "Who made this?")
P("garam-garam", "garam garam", "گرم گرم", "piping hot")
P("thanda-ho-raha", "khana thanda ho raha hai", "کھانا ٹھنڈا ہو رہا ہے", "The food's getting cold", note="Every host's battle cry. Means 'stop talking and eat'.")
P("takleef", "aap ne kyun takleef ki?", "آپ نے کیوں تکلیف کی؟", "You shouldn't have gone to the trouble!", literal="why did you take trouble?", note="The guest's ritual line when a lavish spread appears. The host will say 'koi takleef nahin'.", accept=["aap ne takleef kyun ki"])
P("koi-takleef-nahin", "koi takleef nahin", "کوئی تکلیف نہیں", "No trouble at all")
# boss
P("b.khana-lag-gaya", "Aao beta, khana lag gaya hai", "آؤ بیٹا، کھانا لگ گیا ہے", "Come dear, food's on the table", speaker="nani")
P("b.bismillah-nani", "Bismillah! Shukriya, Nani", "بسم اللہ! شکریہ نانی", "Bismillah! Thank you, Nani", accept=["bismillah shukriya nani", "bismillah"])
P("b.takleef-nani", "Nani, aap ne kyun takleef ki?", "نانی، آپ نے کیوں تکلیف کی؟", "Nani, you shouldn't have!", accept=["aap ne kyun takleef ki"])
P("b.koi-takleef", "Koi takleef nahin. Khao!", "کوئی تکلیف نہیں۔ کھاؤ!", "No trouble at all. Eat!", speaker="nani")
P("b.aur-lo", "Aur lo! Kuch khaya hi nahin", "اور لو! کچھ کھایا ہی نہیں", "Have more! You've barely eaten anything", speaker="nani")
P("b.bas-pait-bhar", "Bas, bas! Mera pait bhar gaya", "بس، بس! میرا پیٹ بھر گیا", "Enough! I'm full", accept=["bas bas mera pait bhar gaya", "bas bas", "mera pait bhar gaya"])
P("b.thora-sa", "Achha, thora sa", "اچھا، تھوڑا سا", "Okay, just a little", accept=["thora sa", "achha thoda sa"])
P("b.diet", "Main diet par hoon", "میں ڈائٹ پر ہوں", "I'm on a diet", register="casual")
P("b.kya-diet", "Diet?! Itne patle ho!", "ڈائٹ؟! اتنے پتلے ہو!", "Diet?! You're so thin!", speaker="nani", register="casual")
P("b.ek-roti-aur", "Ek roti aur lo", "ایک روٹی اور لو", "Have one more roti", speaker="nani")
P("b.khana-kaisa", "Khana kaisa hai?", "کھانا کیسا ہے؟", "How's the food?", speaker="nani")
P("b.bohat-mazedaar", "Bohat mazedaar hai, Nani!", "بہت مزیدار ہے نانی!", "It's delicious, Nani!", accept=["bohat mazedaar hai", "bohat mazedar hai nani"])
P("b.haath-zaiqa", "Nani, aap ke haath mein bohat zaiqa hai", "نانی، آپ کے ہاتھ میں بہت ذائقہ ہے", "Nani, you cook so well", accept=["aap ke haath mein bohat zaiqa hai"])
P("b.theek-hai", "Theek hai", "ٹھیک ہے", "It's okay")
P("b.sirf-theek", "Sirf theek?", "صرف ٹھیک؟", "Just... okay?", speaker="nani")
P("b.nahin-bohat-achha", "Nahin nahin, bohat achha hai!", "نہیں نہیں، بہت اچھا ہے!", "No no, it's really good!", accept=["nahin bohat achha hai", "bohat achha hai"])
P("b.chai", "Chai piyoge?", "چائے پیو گے؟", "Want some tea?", speaker="nani")
P("b.ji-cheeni-kam", "Ji zaroor. Cheeni kam, please", "جی ضرور۔ چینی کم، پلیز", "Yes please. Less sugar, please", register="casual", accept=["ji zaroor cheeni kam", "cheeni kam", "ji cheeni kam"])
P("b.ji-shukriya", "Ji, shukriya", "جی، شکریہ", "Yes, thank you")
P("b.jeete-raho", "Shabash. Jeete raho", "شاباش۔ جیتے رہو", "Well done. Bless you", speaker="nani")

L = []
L.append({"id": "u03-l1", "title": "Khana lag gaya!", "blurb": "What's on the table, and how to start eating.",
  "canDo": "You can name the food on a desi table",
  "teach": [u.teach("khana-lag-gaya", "The call to the table. Drop everything. Nobody waits."), u.teach("bismillah", "Said quietly before the first bite."),
            u.teach("roti"), u.teach("chawal"), u.teach("salan", "Any curry. 'Aaj kya salan hai?' = What curry is it today?"), u.teach("daal"), u.teach("gosht"), u.teach("sabzi")],
  "exercises": [u.match("roti", "chawal", "daal", "gosht"), u.meaning("khana-lag-gaya"), u.listen("salan"), u.match("sabzi", "mithai", "chai", "paani"),
    u.type("chawal", "Type: “rice”"), u.say("bismillah", "You're about to take the first bite. What do you say?", ["khana-lag-gaya", "garam-garam"]),
    u.type("roti", "Type the word for flatbread"), u.listen("khana-lag-gaya", True), u.mc("Khala says “Khana lag gaya hai!” What should you do?", [("Go to the table now", "Correct. Food waits for no one."), ("Finish your episode first", "The food is getting cold. Khala's patience is getting colder."), ("Ask what's for dinner", "You'll find out. At the table. Go.")])]})
L.append({"id": "u03-l2", "title": "Bas, bas!", "blurb": "The ancient art of refusing seconds (and thirds).",
  "canDo": "You can stop a host refilling your plate (eventually)",
  "teach": [u.teach("aur-lo", "You'll hear this every 90 seconds."), u.teach("bas-bas"), u.teach("pait-bhar-gaya"), u.teach("aur-nahin"), u.teach("thora-sa", "The tactical compromise. Accept a little, stop a lot."),
            info("The three-no rule", "A desi host hears your first 'no' as politeness, your second as shyness, and maybe your third as a real no. Hand over the plate helps. Leaving a little food on it helps more.")],
  "exercises": [u.say("bas-bas", "Nani is spooning more rice onto your plate. Stop her!", ["thora-sa", "chai-piyenge"]), u.meaning("pait-bhar-gaya"), u.listen("aur-lo", True), u.build("pait-bhar-gaya", extra=[("meri", "میری")]),
    u.type("bas-bas", "Type the magic words: “Enough, enough!”"), u.match("bas-bas", "pait-bhar-gaya", "thora-sa", "aur-lo"),
    u.mc("You said “Ji nahin, shukriya” once. Khala is still holding the serving spoon. Next move?", [("“Bas, bas!”, hand over plate", "Textbook. Khala respects a hand over the plate."), ("Say nothing", "Silence is a yes. Here comes more biryani.")]),
    u.type("aur-nahin", "Type: “No more, thank you”"), u.speak("bas-bas")]})
L.append({"id": "u03-l3", "title": "Mazedaar!", "blurb": "Praise the food. Lavishly. It's the price of admission.",
  "canDo": "You can praise the food and the cook properly",
  "teach": [u.teach("mazedaar", "Mazedaar = tasty. The bare minimum."), u.teach("khana-achha"), u.teach("maza-aa-gaya", "Casual and enthusiastic: 'That was amazing!'"),
            u.teach("haath-zaiqa", "The power move. Elders will repeat it to everyone."), u.teach("kis-ne-banaya", "Ask this, then praise whoever made it."), u.teach("takleef"), u.teach("koi-takleef-nahin")],
  "exercises": [u.meaning("haath-zaiqa"), u.say("mazedaar", "Khala asks how the food is.", ["mirch-pasand-nahin", "pait-bhar-gaya"]), u.listen("maza-aa-gaya"),
    u.respect("Nani made everything from scratch. You want to praise her.", "Nani", [("haath-zaiqa", "right", "Nani pretends not to be pleased. She is extremely pleased."), ("maza-aa-gaya", "ok", "Sweet and casual. She'd have liked a bit more ceremony."), ("mirch-pasand-nahin", "wrong", "You told Nani her food is too spicy. To her face. In her house.")]),
    u.build("kis-ne-banaya"), u.type("mazedaar", "Type: “It's delicious”"), u.say("takleef", "You arrive and there are nine dishes on the table. Say the polite thing.", ["koi-takleef-nahin", "khana-lag-gaya"]), u.type("maza-aa-gaya", "Type: “That was amazing!”")]})
L.append({"id": "u03-l4", "title": "Chai, cheeni kam", "blurb": "Accept tea like a pro. Save your teeth.",
  "canDo": "You can ask for tea, water, and less sugar",
  "teach": [u.teach("chai-piyenge", "Never a real question. The chai is already brewing."), u.teach("ji-zaroor"), u.teach("cheeni-kam"),
            info("mujhe … chahiye", "‘I want X’ is ‘mujhe X chahiye’: literally ‘to me, X is needed’. The thing you want comes in the middle.", examples=["u03.mujhe-chai", "u03.mujhe-paani"]),
            u.teach("paani-milega", "Softer than 'chahiye'. Perfect with elders.")],
  "exercises": [u.say("ji-zaroor", "Khala: “Chai piyenge?”", ["cheeni-kam", "aur-nahin"]), u.build("mujhe-chai", extra=[("main", "میں")]), u.listen("chai-piyenge"),
    u.gap("mujhe-paani", ("chahiye", "چاہیے"), [("hai", "ہے"), ("hoon", "ہوں")], "mujhe … chahiye = I want"), u.type("cheeni-kam", "Type: “Less sugar”"),
    u.mc("What's the most polite way to ask Nani for water?", ["@paani-milega", ("@mujhe-paani", "Fine, but a little blunt for Nani."), ("@paani", "Just 'water'? She's not a waiter.")]),
    u.type("mujhe-paani", "Type: “I'd like some water”"), u.speak("cheeni-kam")]})
L.append({"id": "u03-l5", "title": "Pasand hai", "blurb": "What you like, what you don't, and why chai is a 'she'.",
  "canDo": "You can say what you like and don't like to eat",
  "teach": [info("mujhe … pasand hai", "‘I like X’ is ‘mujhe X pasand hai’: literally ‘to me, X is liked’. Same pattern as chahiye.", examples=["u03.biryani-pasand", "u03.mirch-pasand-nahin"]),
            info("Food has gender", "Every noun is masculine or feminine, and adjectives follow. Khana (food) is masculine: khana achha hai. Chai is feminine: chai achhi hai. Words ending in -a are usually masculine; -i usually feminine.", examples=["u03.khana-achha", "u03.chai-achhi"]),
            u.teach("yeh-kya-hai"), u.teach("mirch", "Heads up: 'thori si mirch' in a desi kitchen is not a little.")],
  "exercises": [u.gap("chai-achhi", ("achhi", "اچھی"), [("achha", "اچھا"), ("achhe", "اچھے")], "chai is feminine → achhi"),
    u.gap("khana-achha", ("achha", "اچھا"), [("achhi", "اچھی"), ("achhe", "اچھے")], "khana is masculine → achha"),
    u.say("biryani-pasand", "Tell Khala you like biryani (she'll make it every visit now).", ["mirch-pasand-nahin", "mujhe-chai"]),
    u.build("mirch-pasand-nahin", extra=[("hoon", "ہوں")]), u.meaning("yeh-kya-hai"), u.type("biryani-pasand", "Type: “I like biryani”"),
    u.listen("mirch-pasand-nahin", True), u.type("mirch-pasand-nahin", "Type: “I don't like spicy food”")]})
L.append({"id": "u03-l6", "title": "Garam garam", "blurb": "Hosts' battle cries and how to answer them.",
  "canDo": "You can keep up with a host's running commentary",
  "teach": [u.teach("garam-garam", "'Fresh roti, garam garam!' Accept it. Resistance is futile."), u.teach("thanda-ho-raha"), u.teach("mithai", "Dessert. There is always room.")],
  "exercises": [u.meaning("thanda-ho-raha"), u.listen("garam-garam"), u.match("garam-garam", "mithai", "cheeni", "mirch"),
    u.mc("Khala says “Khana thanda ho raha hai!” What does she mean?", [("Stop talking and eat", "Exactly."), ("The AC is too high", "Plausible, but no."), ("Please put it in the microwave", "Never. She'll make fresh.")]),
    u.type("khana-lag-gaya", "Type: “Food's on the table”"), u.build("thanda-ho-raha"), u.speak("maza-aa-gaya"),
    u.type("haath-zaiqa", "The power move: “You cook so well” (in Urdu, respectfully)")]})

n, y, o = u.npc, u.you, u.opt
boss = {"id": "u03-boss", "title": "Nani's Dastarkhwan", "character": "nani",
 "blurb": "Nani has cooked for eleven. There are four of you. Survive dinner.",
 "scene": "Sunday at Nani's. The table bends under biryani, two salans, daal, fresh roti and a mountain of kebabs. Nani sits at the head, watching your plate like a hawk.",
 "canDo": "You can survive a full desi meal: eat, praise, refuse seconds, and accept chai",
 "start": "a",
 "nodes": {
  "a": n("nani", "b.khana-lag-gaya", "b"),
  "b": y("Sit down and get started.", [o("b.bismillah-nani", "c", "great"), o("b.takleef-nani", "takleef", "great", "Nani waves it away, delighted that you know the script.")], "Bismillah…"),
  "takleef": n("nani", "b.koi-takleef", "c"),
  "c": {"type": "narration", "text": "Ten minutes later. Your plate has been refilled twice without you noticing. Nani reaches for the biryani again.", "next": "d"},
  "d": n("nani", "b.aur-lo", "e"),
  "e": y("Stop the refill.", [o("b.bas-pait-bhar", "f", "great"), o("b.thora-sa", "f", "fine", "A tactical 'thora sa'. She gives you a large thora sa."), o("b.diet", "diet", "bold")], "Bas, bas…"),
  "diet": n("nani", "b.kya-diet", "diet2"),
  "diet2": n("nani", "b.ek-roti-aur", "diet3"),
  "diet3": {"type": "narration", "text": "The word 'diet' has been noted. Two extra kebabs land on your plate as punishment.", "next": "f"},
  "f": n("nani", "b.khana-kaisa", "g"),
  "g": y("Praise the food.", [o("b.haath-zaiqa", "h", "great", "Nani suppresses a smile. You are now officially her favourite."), o("b.bohat-mazedaar", "h", "great"), o("b.theek-hai", "meh", "bold")], "Bohat mazedaar…"),
  "meh": n("nani", "b.sirf-theek", "meh2"),
  "meh2": y("Save yourself.", [o("b.nahin-bohat-achha", "h", "fine", "Nani accepts your correction. The silence before it will haunt you."), o("b.haath-zaiqa", "h", "great", "Recovered with the power move.")], "Nahin nahin…"),
  "h": n("nani", "b.chai", "i"),
  "i": y("Accept the chai, wisely.", [o("b.ji-cheeni-kam", "j", "great", "'Cheeni kam' noted. She adds two spoons anyway, but smaller ones."), o("b.ji-shukriya", "j", "fine", "You get the standard four sugars. Godspeed.")], "Ji zaroor…"),
  "j": n("nani", "b.jeete-raho", "end"),
  "end": {"type": "end", "title": "Dinner survived", "text": "You ate, praised, refused (sort of), and accepted chai. Nani will tell the whole family you 'eat like a proper bacha now'. That's a compliment.", "outcome": "survived"}}}

meta = {"track": "speaking", "order": 3, "title": "Meals & Visits", "titleUrdu": "دعوت", "emoji": "🍛",
  "tagline": "Food, eating at someone's home, accepting and refusing, and tea.", "canDo": "You can get through a desi dinner as a guest without offending anyone",
  "grammar": [{"title": "mujhe … chahiye / pasand hai", "body": "Wanting and liking are said backwards: 'mujhe chai chahiye' (to me, tea is needed) and 'mujhe biryani pasand hai' (to me, biryani is liked). 'Mujhe' = to me."},
              {"title": "Nouns have gender", "body": "Masculine nouns often end in -a (khana, kamra), feminine in -i (roti, chai). Adjectives that end in -a change to match: achha khana, achhi chai, achhe log (plural)."}]}
write_unit(u, meta, L, boss)
