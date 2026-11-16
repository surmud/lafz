#!/usr/bin/env python3
"""Generate normal and slow audio for every phrase with Meta MMS-TTS (SPEC §9).

  .venv/bin/python scripts/generate_audio.py          # synthesise anything new, then QA
  .venv/bin/python scripts/generate_audio.py --qa     # QA only

Model: facebook/mms-tts-urd-script_arabic (CC-BY-NC 4.0, credited in the app). Synthesis always
uses the Nastaliq text (or a phrase's `tts` override). Files are named by a hash of
voice|rate|text (the same key as src/content/audio-key.ts), so unchanged text is never
re-synthesised. public/audio/manifest.json maps key → {file, seconds}.

Slow audio is the normal take time-stretched to 0.72x with pitch preserved (librosa).
Voice v3 (G12): MMS mumbles isolated words, so 1–2 word phrases are synthesised inside a carrier
sentence ("یہ لفظ X ہے", "this word is X") and cut back out using the model's own per-character
durations, captured from its duration predictor. Whisper round-trip similarity on a 12-word test went
from 0.23 to 0.70. Longer phrases are synthesised directly with noise_scale 0.5.
QA: no silent clips, no clipping, duration within a sane range for the text length.
"""
from __future__ import annotations

import glob
import hashlib
import json
import sys
import unicodedata
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "audio"
MANIFEST = OUT / "manifest.json"
VOICE = "mms-urd-3"
MODEL = "facebook/mms-tts-urd-script_arabic"
SLOW_RATE = 0.72
SR_OUT = 16000


def tts_text(p: dict) -> str:
    return unicodedata.normalize("NFC", p.get("tts") or p["urdu"]).strip()


def key(p: dict, rate: str) -> str:
    return f"{VOICE}|{rate}|{tts_text(p)}"


def file_for(k: str) -> str:
    return hashlib.sha256(k.encode("utf-8")).hexdigest()[:16] + ".mp3"


CARRIER_PRE, CARRIER_POST = "یہ لفظ ", " ہے"


def synth(model, tok, text: str) -> np.ndarray:
    """Return a mono waveform at the model's rate (16 kHz for MMS)."""
    import torch

    short = len(text.split()) <= 2
    if not short:
        model.speaking_rate, model.noise_scale = 1.0, 0.5
        torch.manual_seed(0)
        with torch.no_grad():
            return model(**tok(text, return_tensors="pt")).waveform[0].numpy().astype(np.float32)
    # Carrier synthesis: capture durations from the duration predictor and cut the word out.
    captured = {}
    handle = model.duration_predictor.register_forward_hook(lambda m, i, o: captured.__setitem__("logw", o))
    try:
        model.speaking_rate, model.noise_scale = 0.9, 0.5
        full = CARRIER_PRE + text + CARRIER_POST
        enc = tok(full, return_tensors="pt")
        torch.manual_seed(0)
        with torch.no_grad():
            wave = model(**enc).waveform[0].numpy().astype(np.float32)
    finally:
        handle.remove()
    rate = model.speaking_rate
    dur = torch.ceil(torch.exp(captured["logw"][0, 0]) * (1.0 / rate)).long().tolist()
    hop = getattr(model.config, "hop_length", 256)
    frames = np.cumsum([0] + dur)
    blank = getattr(tok, "add_blank", True)
    ci = (lambda c: 2 * c + 1) if blank else (lambda c: c)
    s_char, e_char = len(CARRIER_PRE), len(CARRIER_PRE) + len(text)
    start = frames[ci(s_char) - (1 if blank else 0)] * hop
    end = frames[min(len(frames) - 1, ci(e_char - 1) + (2 if blank else 1))] * hop
    seg = wave[max(0, int(start) - hop): int(end) + hop]
    return seg if len(seg) > 1600 else wave  # fall back to the whole carrier only if the cut failed


def phrases() -> list[dict]:
    out = []
    for f in sorted(glob.glob(str(ROOT / "content" / "units" / "*.json"))):
        out.extend(json.loads(Path(f).read_text())["phrases"])
    return out


def qa(wave: np.ndarray, text: str) -> list[str]:
    problems = []
    secs = len(wave) / SR_OUT
    letters = sum(1 for c in text if unicodedata.category(c).startswith("L"))
    peak = float(np.max(np.abs(wave))) if len(wave) else 0.0
    rms = float(np.sqrt(np.mean(wave**2))) if len(wave) else 0.0
    if rms < 0.005:
        problems.append(f"near-silent (rms {rms:.4f})")
    if peak >= 0.999:
        problems.append("clipped")
    if secs < 0.25:
        problems.append(f"too short ({secs:.2f}s)")
    if secs > max(2.5, letters * 0.35):
        problems.append(f"too long ({secs:.2f}s for {letters} letters)")
    return problems


def main() -> int:
    qa_only = "--qa" in sys.argv
    OUT.mkdir(parents=True, exist_ok=True)
    manifest: dict = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
    items = phrases()
    texts = {tts_text(p): p for p in items}
    todo = [t for t in texts if any(key(texts[t], r) not in manifest or not (OUT / manifest[key(texts[t], r)]["file"]).exists() for r in ("normal", "slow"))]

    if todo and not qa_only:
        import librosa
        import torch
        from transformers import AutoTokenizer, VitsModel

        torch.manual_seed(0)
        model = VitsModel.from_pretrained(MODEL)
        tok = AutoTokenizer.from_pretrained(MODEL)
        sr = model.config.sampling_rate
        print(f"synthesising {len(todo)} texts…", flush=True)
        for i, text in enumerate(todo, 1):
            p = texts[text]
            wave = synth(model, tok, text)
            if sr != SR_OUT:
                wave = librosa.resample(wave, orig_sr=sr, target_sr=SR_OUT)
            # Trim edge silence, normalise to -1 dBFS peak, add short fades and padding.
            wave, _ = librosa.effects.trim(wave, top_db=35)
            wave = wave / (np.max(np.abs(wave)) + 1e-9) * 0.89
            slow = librosa.effects.time_stretch(wave, rate=SLOW_RATE)
            slow = slow / (np.max(np.abs(slow)) + 1e-9) * 0.89
            for rate, w in (("normal", wave), ("slow", slow)):
                fade = min(160, len(w) // 4)
                w = w.copy()
                w[:fade] *= np.linspace(0, 1, fade)
                w[-fade:] *= np.linspace(1, 0, fade)
                w = np.concatenate([np.zeros(800, np.float32), w, np.zeros(1600, np.float32)])
                k = key(p, rate)
                name = file_for(k)
                sf.write(OUT / name, w, SR_OUT, format="MP3", bitrate_mode="VARIABLE", compression_level=0.6)
                manifest[k] = {"file": name, "seconds": round(len(w) / SR_OUT, 2)}
            print(f"  [{i}/{len(todo)}] {p['id']} {manifest[key(p, 'normal')]['seconds']}s", flush=True)
            if i % 25 == 0:
                MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=0, sort_keys=True) + "\n")

    # Drop entries for text that no longer exists, and delete their files.
    live = {key(p, r) for p in items for r in ("normal", "slow")}
    for k in [k for k in manifest if k not in live]:
        f = OUT / manifest.pop(k)["file"]
        if f.exists():
            f.unlink()
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=0, sort_keys=True) + "\n")

    bad = 0
    for text, p in texts.items():
        entry = manifest.get(key(p, "normal"))
        if not entry:
            continue
        wave, _ = sf.read(OUT / entry["file"], dtype="float32")
        problems = qa(wave, text)
        if problems:
            bad += 1
            print(f"  QA {p['id']}: {', '.join(problems)}")
    total = sum((OUT / v["file"]).stat().st_size for v in manifest.values() if (OUT / v["file"]).exists())
    print(f"{len(manifest)} clips, {total / 1024:.0f} KB, {bad} QA problems")
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main())
