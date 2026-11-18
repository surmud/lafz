#!/usr/bin/env python3
"""Precompute sentence embeddings for the phrase finder ("How do I say…?").

  .venv/bin/python scripts/build_embeddings.py

Model: sentence-transformers/all-MiniLM-L6-v2 (Apache-2.0, 384 dimensions). Each phrase is embedded
as its English meaning plus the context it is taught in (note, lesson title and can-do), so a query
like "politely refuse more food" lands on "bas, bas". The app embeds the learner's query on the
device with the same model (transformers.js) and ranks by cosine similarity.

Output: public/ai/phrases.bin (N x 384 int8, unit vectors scaled by 127) and public/ai/phrases.json
({"dim", "ids", "model"}). Deterministic for unchanged content."""
import glob, json, re
from pathlib import Path

import numpy as np
import torch
from transformers import AutoModel, AutoTokenizer
import os
LANG = os.environ.get("LAFZ_LANG", "ur")  # content/<LANG>/: the language pack being built

ROOT = Path(__file__).resolve().parent.parent
MODEL = "sentence-transformers/all-MiniLM-L6-v2"


def docs():
    out = []
    for f in sorted(glob.glob(str(ROOT / "content" / LANG / "units" / "u*.json"))):
        u = json.loads(Path(f).read_text())
        where = {}
        for l in u["lessons"]:
            for t in l["teach"]:
                if "phrase" in t:
                    where.setdefault(t["phrase"], (l, t.get("tip", "")))
        for p in u["phrases"]:
            if ".b." in p["id"]:
                continue
            l, tip = where.get(p["id"], (None, ""))
            en = re.sub(r"\s*\((man|woman)\)", "", p["en"])
            parts = [en, p.get("literal", ""), p.get("note", ""), tip]
            if l:
                parts.append(f"{u['title']}: {l['canDo']}")
            out.append((p["id"], ". ".join(x.strip(" .") for x in parts if x)))
    return out


def grammar_docs():
    """Every unit's grammar notes, so questions like "why aati not aata" find the right note."""
    out, notes = [], {}
    for f in sorted(glob.glob(str(ROOT / "content" / LANG / "units" / "*.json"))):
        u = json.loads(Path(f).read_text())
        for i, g in enumerate(u.get("grammar", [])):
            gid = f"g:{u['id']}:{i}"
            notes[gid] = {"unit": u["id"], "unitTitle": u["title"], "title": g["title"], "body": g["body"]}
            out.append((gid, f"{g['title']}. {g['body']}"))
    return out, notes


def main():
    gdocs, notes = grammar_docs()
    items = docs() + gdocs
    tok = AutoTokenizer.from_pretrained(MODEL)
    model = AutoModel.from_pretrained(MODEL).eval()
    vecs = []
    with torch.no_grad():
        for i in range(0, len(items), 64):
            enc = tok([t for _, t in items[i : i + 64]], padding=True, truncation=True, max_length=128, return_tensors="pt")
            h = model(**enc).last_hidden_state
            m = enc["attention_mask"].unsqueeze(-1).float()
            v = (h * m).sum(1) / m.sum(1)
            vecs.append(torch.nn.functional.normalize(v, dim=1).numpy())
    mat = np.clip(np.round(np.concatenate(vecs) * 127), -127, 127).astype(np.int8)
    out = ROOT / "public" / "ai"
    out.mkdir(parents=True, exist_ok=True)
    (out / "phrases.bin").write_bytes(mat.tobytes())
    (out / "phrases.json").write_text(json.dumps({"model": MODEL, "dim": int(mat.shape[1]), "ids": [i for i, _ in items], "text": [t for _, t in items], "notes": notes}, ensure_ascii=False) + "\n")
    print(f"{mat.shape[0]} phrases x {mat.shape[1]} dims, {mat.nbytes / 1024:.0f} KB")

    # Sanity: a few queries should land where a human would expect.
    def q(text):
        enc = tok([text], return_tensors="pt")
        with torch.no_grad():
            h = model(**enc).last_hidden_state
        v = torch.nn.functional.normalize(h.mean(1), dim=1).numpy()[0]
        top = np.argsort(-(mat.astype(np.float32) @ v))[:3]
        return [items[i][0] for i in top]

    for text in ["why is it aati not aata", "how does the past tense work", "politely refuse more food", "I am lost", "ask someone to speak slowly", "congratulate someone at a wedding", "my head hurts"]:
        print(f"  {text!r} → {q(text)}")


if __name__ == "__main__":
    main()
