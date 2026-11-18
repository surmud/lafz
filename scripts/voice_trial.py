#!/usr/bin/env python3
"""Compare candidate Urdu voices against the current MMS clips with a Whisper round-trip.

  .venv/bin/python scripts/voice_trial.py [N]

Candidates: Matcha-TTS Urdu (Apache-2.0, AhsanTalal/urdu-matcha-tts and -female) + Vocos vocoder.
Writes samples to .voice-trial/ (gitignored) and prints mean similarity by voice, split into
words (1-2 tokens) and sentences."""
import glob, hashlib, json, random, sys, unicodedata
from pathlib import Path

import numpy as np
import soundfile as sf

sys.path.insert(0, str(Path(__file__).parent))
from audio_audit import dist, norm  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / ".voice-trial"
N = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else 60


def load_vocos():
    """BSC-LT/vocos-mel-22khz (Apache-2.0): the Matcha-compatible 22 kHz vocoder. Decoder only."""
    import torch
    from huggingface_hub import hf_hub_download
    from vocos.heads import ISTFTHead
    from vocos.models import VocosBackbone

    class V(torch.nn.Module):
        def __init__(self):
            super().__init__()
            self.backbone = VocosBackbone(input_channels=80, dim=512, intermediate_dim=1536, num_layers=8)
            self.head = ISTFTHead(dim=512, n_fft=1024, hop_length=256, padding="same")

        def decode(self, mel):
            return self.head(self.backbone(mel))

    v = V()
    sd = torch.load(hf_hub_download("BSC-LT/vocos-mel-22khz", "pytorch_model.bin"), map_location="cpu")
    v.load_state_dict({k: w for k, w in sd.items() if k.startswith(("backbone.", "head."))}, strict=False)
    return v.eval()


def main():
    import librosa, mlx_whisper, onnxruntime as ort, torch
    from huggingface_hub import hf_hub_download

    OUT.mkdir(exist_ok=True)
    phrases = []
    for f in sorted(glob.glob(str(ROOT / "content/units/u*.json"))):
        phrases += json.loads(Path(f).read_text())["phrases"]
    random.Random(7).shuffle(phrases)
    texts = list(dict.fromkeys(unicodedata.normalize("NFC", p["urdu"]).strip() for p in phrases))[:N]
    vocos = load_vocos()

    def hear(wave16):
        return mlx_whisper.transcribe(wave16.astype(np.float32), path_or_hf_repo="mlx-community/whisper-large-v3-turbo", language="ur", condition_on_previous_text=False)["text"].strip()

    def sim(text, heard):
        a, b = norm(text), norm(heard)
        return 1 - dist(a, b) / max(len(a), len(b), 1)

    voices = {}
    for name, repo in (("matcha-f", "AhsanTalal/urdu-matcha-tts-female"), ("matcha-m", "AhsanTalal/urdu-matcha-tts")):
        sess = ort.InferenceSession(hf_hub_download(repo, "matcha_tts.onnx"), providers=["CPUExecutionProvider"])
        stoi = json.load(open(hf_hub_download(repo, "vocab.json"), encoding="utf-8"))
        voices[name] = (sess, stoi)

    def matcha(name, text, length=1.0):
        sess, stoi = voices[name]
        ids = [stoi.get(ch, stoi[" "]) for ch in text]
        inter = [0] * (len(ids) * 2 + 1)
        inter[1::2] = ids
        mel, _ = sess.run(None, {"x": np.array([inter], dtype=np.int64), "x_lengths": np.array([len(inter)], dtype=np.int64), "scales": np.array([0.667, length], dtype=np.float32)})
        with torch.no_grad():
            return vocos.decode(torch.from_numpy(mel))[0].numpy()

    rows = []
    for i, text in enumerate(texts):
        row = {"text": text, "short": len(text.split()) <= 2}
        mp3 = ROOT / "public/audio" / (hashlib.sha256(f"mms-urd-3|normal|{text}".encode()).hexdigest()[:16] + ".mp3")
        if mp3.exists():
            w, _ = sf.read(mp3, dtype="float32")
            row["mms"] = sim(text, hear(w))
        for name in voices:
            w = matcha(name, text)
            sf.write(OUT / f"{i:03d}-{name}.wav", w, 22050)
            h = hear(librosa.resample(w, orig_sr=22050, target_sr=16000))
            row[name] = sim(text, h)
            row[name + "-heard"] = h
        rows.append(row)
        print(i, text, {k: round(v, 2) for k, v in row.items() if isinstance(v, float)}, flush=True)
    (OUT / "results.json").write_text(json.dumps(rows, ensure_ascii=False, indent=1))
    for label, pick in (("words", True), ("sentences", False)):
        sub = [r for r in rows if r["short"] == pick]
        print(label, len(sub), {k: round(float(np.mean([r[k] for r in sub if k in r])), 3) for k in ("mms", "matcha-f", "matcha-m")})


if __name__ == "__main__":
    main()
