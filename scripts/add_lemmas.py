#!/usr/bin/env python3
"""Record dictionary headwords for inflected forms: python scripts/add_lemmas.py form=lemma …
Then run scripts/verify_lexicon.py, which looks the lemma up and sources the form to it."""
import json, sys
from pathlib import Path
import os
LANG = os.environ.get("LAFZ_LANG", "ur")  # content/<LANG>/: the language pack being built

f = Path(__file__).resolve().parent.parent / "content" / LANG / "lexicon-manual.json"
d = json.loads(f.read_text())
for pair in sys.argv[1:]:
    form, lemma = pair.split("=")
    d["lemmas"][form] = lemma
f.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n")
print(f"{len(sys.argv) - 1} lemmas recorded")
