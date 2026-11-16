"""Replace a unit's placement questions. Usage: python scripts/add_placement.py LEVEL '<json list>'"""
import json, sys
from pathlib import Path
p = Path(__file__).resolve().parent.parent / "content/placement.json"
level, items = int(sys.argv[1]), json.loads(sys.argv[2])
q = [x for x in json.loads(p.read_text()) if x["level"] != level]
for i, it in enumerate(items):
    q.append({"id": f"p{level:02d}-{i}", "level": level, **it})
p.write_text(json.dumps(q, ensure_ascii=False, indent=2) + "\n")
print(len(q), "placement questions")
