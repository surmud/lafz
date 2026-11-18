#!/usr/bin/env python3
"""Round-trip every normal-speed clip through Whisper and compare with the source Nastaliq
(docs/EVALS.md §3). Writes docs/audio-audit.json and prints the worst 5%.

  .venv/bin/python scripts/audio_audit.py [--model mlx-community/whisper-large-v3-turbo] [--sample N]

Similarity is 1 - edit distance / length on normalised Urdu (diacritics stripped, Arabic/Urdu
letter variants unified), the same normalisation the app uses for speech answers.
Low scores flag clips worth a listen; Whisper itself is imperfect on Urdu, so this is triage."""
import glob, hashlib, json, re, sys, unicodedata
from pathlib import Path

import numpy as np
import soundfile as sf
import os
LANG = os.environ.get("LAFZ_LANG", "ur")  # content/<LANG>/: the language pack being built

ROOT = Path(__file__).resolve().parent.parent
MODEL = sys.argv[sys.argv.index("--model") + 1] if "--model" in sys.argv else "mlx-community/whisper-large-v3-turbo"


def norm(s: str) -> str:
    s = unicodedata.normalize("NFC", s)
    s = re.sub(r"[ً-ٰٟۖ-ۭ]", "", s)
    for a, b in [("ي", "ی"), ("ى", "ی"), ("ك", "ک"), ("ه", "ہ"), ("ھ", "ہ"), ("ة", "ہ"), ("أ", "ا"), ("إ", "ا"), ("آ", "ا"), ("ؤ", "و"), ("ئ", "ی"), ("ے", "ی")]:
        s = s.replace(a, b)
    return re.sub(r"[^؀-ۿ]", "", s)


def dist(a: str, b: str) -> int:
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        cur = [i]
        for j, cb in enumerate(b, 1):
            cur.append(min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (ca != cb)))
        prev = cur
    return prev[-1]


def main() -> int:
    # MLX Whisper (Apple silicon) is ~5x faster than transformers on MPS here; clips are 16 kHz mono.
    import mlx_whisper

    def transcribe(wave):
        return mlx_whisper.transcribe(wave, path_or_hf_repo=MODEL, language="ur", condition_on_previous_text=False)["text"]

    phrases = []
    for f in sorted(glob.glob(str(ROOT / "content" / LANG / "units" / "*.json"))):
        phrases += json.loads(Path(f).read_text())["phrases"]
    import random

    sample = int(sys.argv[sys.argv.index("--sample") + 1]) if "--sample" in sys.argv else 0
    if sample:
        random.Random(42).shuffle(phrases)
    seen, rows = set(), []
    for p in phrases:
        if sample and len(rows) >= sample:
            break
        text = unicodedata.normalize("NFC", p.get("tts") or p["urdu"]).strip()
        if text in seen or ".l-" in p["id"]:
            continue  # single letter names are too short for a meaningful round-trip
        seen.add(text)
        voice = "matcha-m1" if p.get("speaker") in ("bilal", "abbu", "pervez", "bashir") else "matcha-f1"
        name = hashlib.sha256(f"{voice}|normal|{text}".encode()).hexdigest()[:16] + ".mp3"
        path = ROOT / "public/audio" / name
        if not path.exists():
            continue
        wave, sr = sf.read(path, dtype="float32")
        if sr != 16000:
            import librosa
            wave = librosa.resample(wave, orig_sr=sr, target_sr=16000)
        heard = transcribe(wave.astype(np.float32)).strip()
        a, b = norm(text), norm(heard)
        sim = 1 - dist(a, b) / max(len(a), len(b), 1)
        rows.append({"id": p["id"], "text": text, "heard": heard, "similarity": round(sim, 3)})
        if len(rows) % 25 == 0:
            print(f"  {len(rows)} clips…", flush=True)
            (ROOT / "docs/audio-audit.partial.json").write_text(json.dumps(rows, ensure_ascii=False, indent=1))
    rows.sort(key=lambda r: r["similarity"])
    sims = [r["similarity"] for r in rows]
    (ROOT / "docs/audio-audit.partial.json").unlink(missing_ok=True)
    summary = {"model": MODEL, "sample": sample or "all", "clips": len(rows), "mean": round(float(np.mean(sims)), 3), "median": round(float(np.median(sims)), 3)}
    (ROOT / "docs/audio-audit.json").write_text(json.dumps({"summary": summary, "rows": rows}, ensure_ascii=False, indent=1) + "\n")
    print(summary)
    worst = rows[: max(1, len(rows) // 20)]
    print(f"worst 5% ({len(worst)}):")
    for r in worst:
        print(f"  {r['similarity']:.2f} {r['id']}: {r['text']}  →  {r['heard']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
