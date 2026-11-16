"""Add lemma mappings, drop their cache entries, reset a unit's confidence, and re-verify.
Usage: python scripts/fix_lemmas.py UNIT word=lemma [word=lemma ...]"""
import json, subprocess, sys
from pathlib import Path
R = Path(__file__).resolve().parent.parent
unit, pairs = sys.argv[1], [a.split("=", 1) for a in sys.argv[2:]]
m = json.loads((R / "content/lexicon-manual.json").read_text())
m["lemmas"].update(dict(pairs))
(R / "content/lexicon-manual.json").write_text(json.dumps(m, ensure_ascii=False, indent=2) + "\n")
c = json.loads((R / "content/lexicon.json").read_text())
for w, _ in pairs:
    c.pop(w, None)
(R / "content/lexicon.json").write_text(json.dumps(c, ensure_ascii=False, indent=1, sort_keys=True) + "\n")
p = R / f"content/units/{unit}.json"
u = json.loads(p.read_text())
for ph in u["phrases"]:
    if ".l-" not in ph["id"]:
        ph["confidence"] = "high"
p.write_text(json.dumps(u, ensure_ascii=False, indent=2) + "\n")
subprocess.run([sys.executable, str(R / "scripts/verify_lexicon.py")], check=True)
