"""Memory hooks for tricky core words (keyword and pattern mnemonics). Run after the unit scripts.
Hooks are shown on the word's teach card. Patterns over puns: each hook should also teach something true."""
import json
from common import ROOT, UNITS

HOOKS = {
 "u01.aap": "aap, tum, tu: the longer the word, the more respect.",
 "u01.ji": "Add ji to almost anything to make it polite: ji haan, ji nahin, Khala ji.",
 "u02.dada": "D for Dad's side: Dada and Dadi. Mum's side are Nana and Nani.",
 "u02.nana": "Nana and Nani are Mum's parents. Dad's parents are Dada and Dadi: D for Dad.",
 "u02.taya": "Dad's brothers: the older one is Taya, the younger one is Chacha. Taya Tops Chacha.",
 "u02.mera": "mera with -a for masculine things, meri with -i for feminine ones: the same -a/-i as achha/achhi and gaya/gayi.",
 "u03.paani": "Think of paani puri: a crisp shell you fill with spiced water.",
 "u03.mithai": "From meetha, sweet. Mithai is 'sweet things'.",
 "u03.cheeni": "cheeni also means 'Chinese': refined sugar once came from China.",
 "u04.kya": "Almost every question word starts with k: kya, kab, kahan, kaun, kyun, kaise. Hear a k at the start, expect a question.",
 "u05.n-do": "do = 2, like duo.",
 "u05.n-teen": "teen = 3, like three and tri-.",
 "u05.n-saat": "saat = 7, from the same old root as Latin septem (September was once month 7).",
 "u05.n-aath": "aath = 8, from the same root as octo- (octopus, eight legs).",
 "u05.n-nau": "nau = 9, from the same root as nine and nove.",
 "u05.n-das": "das = 10, from the same root as deca- and dix.",
 "u05.kal": "kal is yesterday AND tomorrow. The verb tells you which: kal aaya (came) or kal aayega (will come).",
 "u05.hafta": "From Persian haft, seven: a week is seven days.",
 "u06.baayen": "baayen = left, daayen = right. B comes before D, and left comes before right.",
 "u07.dulha": "dulha is the groom; add -n for the bride: dulhan.",
 "u10.sehri": "Sehri is the meal before the sun rises; iftar breaks the fast after it sets.",
}

for uid in sorted({k.split(".")[0] for k in HOOKS}):
    f = UNITS / f"{uid}.json"
    u = json.loads(f.read_text())
    n = 0
    for p in u["phrases"]:
        if p["id"] in HOOKS:
            p["hook"] = HOOKS[p["id"]]
            n += 1
    f.write_text(json.dumps(u, ensure_ascii=False, indent=2) + "\n")
    print(uid, n, "hooks")
missing = set(HOOKS) - {p["id"] for f in (UNITS).glob("u*.json") for p in json.loads(f.read_text())["phrases"]}
assert not missing, missing
