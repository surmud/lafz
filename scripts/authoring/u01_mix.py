"""Unit 1 is hand-authored JSON; this adds (or refreshes) its generated 'Mix it up' lesson."""
import json
from common import ROOT, mix_lesson, UNITS

p = UNITS / "u01.json"
u = json.loads(p.read_text())
lessons = [l for l in u["lessons"] if not l["id"].endswith("-mix")]
u["lessons"] = [*lessons, mix_lesson("u01", u, lessons, u["phrases"])]
p.write_text(json.dumps(u, ensure_ascii=False, indent=2) + "\n")
print("u01:", len(u["lessons"]), "lessons")
