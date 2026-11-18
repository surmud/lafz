"""Generate normal and slow audio for every phrase (SPEC §9).

  .venv/bin/python scripts/generate_audio.py          # synthesise anything new, then QA
  .venv/bin/python scripts/generate_audio.py --qa     # QA only

Voice v4: Matcha-TTS Urdu (AhsanTalal/urdu-matcha-tts and -female, Apache-2.0) with the BSC Vocos
22 kHz vocoder (Apache-2.0). A Whisper round-trip on 60 phrases scored sentences 0.93 (female) and
0.94 (male) against 0.84 for the old Meta MMS voice, and single words 0.79 against 0.75
(docs/evals/2026-11-18-voice.md). Two voices: lines spoken by a male character use the male voice,
everything else the female one.

Synthesis always uses the Nastaliq text (or a phrase's `tts` override). Files are named by a hash of
voice|rate|text (the same key as src/content/audio-key.ts), so unchanged text is never
re-synthesised. public/audio/manifest.json maps key → {file, seconds}.

Slow audio is synthesised slower by the model itself (length scale 1.45), not time-stretched.
Every clip is checked by ear-substitute: Whisper transcribes it, and if the transcript is far from
the text the clip is re-synthesised (up to 4 takes) and the closest take is kept.
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

sys.path.insert(0, str(Path(__file__).parent))

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "audio"
MANIFEST = OUT / "manifest.json"
VOICES = {"f": ("matcha-f1", "AhsanTalal/urdu-matcha-tts-female"), "m": ("matcha-m1", "AhsanTalal/urdu-matcha-tts")}
MALE_SPEAKERS = {"bilal", "abbu", "pervez", "bashir"}  # keep in step with src/content/audio-key.ts
SLOW_LENGTH = 1.45
SR_OUT = 22050
TAKES = 4


def tts_text(p: dict) -> str:
    return unicodedata.normalize("NFC", p.get("tts") or p["urdu"]).strip()


def gender(speaker: str | None) -> str:
    return "m" if speaker in MALE_SPEAKERS else "f"


def key(text: str, g: str, rate: str) -> str:
    return f"{VOICES[g][0]}|{rate}|{text}"


def file_for(k: str) -> str:
    return hashlib.sha256(k.encode("utf-8")).hexdigest()[:16] + ".mp3"


class Synth:
    def __init__(self):
        import onnxruntime as ort
        from huggingface_hub import hf_hub_download

        from voice_trial import load_vocos

        self.vocos = load_vocos()
        self.models = {}
        for g, (_, repo) in VOICES.items():
            sess = ort.InferenceSession(hf_hub_download(repo, "matcha_tts.onnx"), providers=["CPUExecutionProvider"])
            stoi = json.load(open(hf_hub_download(repo, "vocab.json"), encoding="utf-8"))
            self.models[g] = (sess, stoi)

    def raw(self, text: str, g: str, length: float) -> np.ndarray:
        import torch

        sess, stoi = self.models[g]
        ids = [stoi.get(ch, stoi[" "]) for ch in text]
        inter = [0] * (len(ids) * 2 + 1)
        inter[1::2] = ids
        mel, _ = sess.run(None, {"x": np.array([inter], dtype=np.int64), "x_lengths": np.array([len(inter)], dtype=np.int64), "scales": np.array([0.667, length], dtype=np.float32)})
        with torch.no_grad():
            return self.vocos.decode(torch.from_numpy(mel))[0].numpy().astype(np.float32)

    def similarity(self, wave: np.ndarray, text: str) -> float:
        import librosa
        import mlx_whisper

        from audio_audit import dist, norm

        w16 = librosa.resample(wave, orig_sr=SR_OUT, target_sr=16000).astype(np.float32)
        heard = mlx_whisper.transcribe(w16, path_or_hf_repo="mlx-community/whisper-large-v3-turbo", language="ur", condition_on_previous_text=False)["text"]
        a, b = norm(text), norm(heard)
        return 1 - dist(a, b) / max(len(a), len(b), 1)

    def best(self, text: str, g: str, slow: bool, check: bool = True) -> tuple[np.ndarray, float]:
        """Synthesise, check with Whisper, retry weak takes and keep the closest one."""
        short = len(text.split()) <= 2
        # Isolated words come out clearer a little slower; the male voice also wants a full stop.
        send = text + "۔" if short and g == "m" and text[-1] not in "؟!۔" else text
        length = (1.2 if short else 1.0) * (SLOW_LENGTH if slow else 1.0)
        best_wave, best_sim = None, -1.0
        for take in range(TAKES if check else 1):
            wave = self.raw(send, g, length * (1.0 + 0.05 * take))
            sim = self.similarity(wave, text) if check else 1.0
            if sim > best_sim:
                best_wave, best_sim = wave, sim
            if sim >= (0.8 if short else 0.9):
                break
        return best_wave, best_sim


def wanted() -> dict[tuple[str, str], str]:
    """Every (text, voice) the app can ask for → an id for logs. Phrases use their own speaker's voice;
    scene lines and conversation turns use the voice of whoever says them."""
    out: dict[tuple[str, str], str] = {}
    by_id = {}
    units = [json.loads(Path(f).read_text()) for f in sorted(glob.glob(str(ROOT / "content" / "units" / "*.json")))]
    for u in units:
        for p in u["phrases"]:
            by_id[p["id"]] = p
            out.setdefault((tts_text(p), gender(p.get("speaker"))), p["id"])
    for u in units:
        for l in u["lessons"]:
            for ex in l["exercises"]:
                if ex["type"] == "scene":
                    for line in ex["lines"]:
                        out.setdefault((tts_text(by_id[line["phrase"]]), gender(line["speaker"])), line["phrase"])
        for line in (u.get("story") or {}).get("lines", []):
            out.setdefault((tts_text(by_id[line["phrase"]]), gender(line.get("speaker"))), line["phrase"])
        for n in (u.get("boss") or {}).get("nodes", {}).values():
            if n["type"] == "npc":
                out.setdefault((tts_text(by_id[n["say"]]), gender(n["speaker"])), n["say"])
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
    want = wanted()
    have = lambda k: k in manifest and (OUT / manifest[k]["file"]).exists()
    todo = [(t, g) for (t, g) in want if not (have(key(t, g, "normal")) and have(key(t, g, "slow")))]
    weak = []

    if todo and not qa_only:
        import librosa

        synth = Synth()
        print(f"synthesising {len(todo)} texts…", flush=True)
        for i, (text, g) in enumerate(todo, 1):
            sims = []
            for rate in ("normal", "slow"):
                # Whisper can't judge single letter names, and the slow take follows the normal one.
                w, sim = synth.best(text, g, rate == "slow", check=rate == "normal" and ".l-" not in want[(text, g)])
                sims.append(sim)
                # Trim edge silence, normalise to -1 dBFS peak, add short fades and padding.
                w, _ = librosa.effects.trim(w, top_db=35)
                w = w / (np.max(np.abs(w)) + 1e-9) * 0.89
                fade = min(220, len(w) // 4)
                w[:fade] *= np.linspace(0, 1, fade)
                w[-fade:] *= np.linspace(1, 0, fade)
                w = np.concatenate([np.zeros(1100, np.float32), w, np.zeros(2200, np.float32)])
                k = key(text, g, rate)
                name = file_for(k)
                sf.write(OUT / name, w, SR_OUT, format="MP3", bitrate_mode="VARIABLE", compression_level=0.6)
                manifest[k] = {"file": name, "seconds": round(len(w) / SR_OUT, 2), "sim": round(sim, 2)}
            if sims[0] < 0.6:
                weak.append((want[(text, g)], text, round(sims[0], 2)))
            print(f"  [{i}/{len(todo)}] {want[(text, g)]} {g} {manifest[key(text, g, 'normal')]['seconds']}s sim {sims[0]:.2f}/{sims[1]:.2f}", flush=True)
            if i % 25 == 0:
                MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=0, sort_keys=True) + "\n")

    # Drop entries for text that no longer exists, and delete their files.
    live = {key(t, g, r) for (t, g) in want for r in ("normal", "slow")}
    for k in [k for k in manifest if k not in live]:
        f = OUT / manifest.pop(k)["file"]
        if f.exists():
            f.unlink()
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=0, sort_keys=True) + "\n")

    bad = 0
    for (text, g), pid in want.items():
        entry = manifest.get(key(text, g, "normal"))
        if not entry:
            continue
        wave, _ = sf.read(OUT / entry["file"], dtype="float32")
        problems = qa(wave, text)
        if problems:
            bad += 1
            print(f"  QA {pid}: {', '.join(problems)}")
    total = sum((OUT / v["file"]).stat().st_size for v in manifest.values() if (OUT / v["file"]).exists())
    sims = [v["sim"] for k, v in manifest.items() if "|normal|" in k and "sim" in v]
    print(f"{len(manifest)} clips, {total / 1024:.0f} KB, {bad} QA problems, mean round-trip {np.mean(sims):.3f}" if sims else f"{len(manifest)} clips")
    if weak:
        print(f"{len(weak)} weak clips (round-trip < 0.6):")
        for pid, text, sim in weak:
            print(f"  {pid} {text} {sim}")
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main())
