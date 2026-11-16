"""Shared helpers for unit authoring scripts. Each uNN.py builds a dict and calls write_unit()."""
import json
import pathlib
import re

FULL = re.compile(r"^[ur]\d\d\.")

ROOT = pathlib.Path(__file__).resolve().parents[2]


class Unit:
    def __init__(self, uid: str):
        self.U = uid
        self.phrases: list[dict] = []

    def P(self, key, roman, urdu, en, **kw):
        d = {"id": f"{self.U}.{key}", "roman": roman, "urdu": urdu, "en": en, "confidence": "high"}
        d.update(kw)
        self.phrases.append(d)
        return d

    def i(self, *keys):
        return [self.id(k) for k in keys]

    def id(self, key):
        return key if FULL.match(key) else f"{self.U}.{key}"

    # exercises
    def type(self, phrase, prompt=None, **kw):
        d = {"type": "type", "phrase": self.id(phrase)}
        if prompt:
            d["prompt"] = prompt
        d.update(kw)
        return d

    def say(self, phrase, prompt=None, distractors=None, explain=None):
        d = {"type": "say", "phrase": self.id(phrase)}
        if prompt:
            d["prompt"] = prompt
        if distractors:
            d["distractors"] = self.i(*distractors)
        if explain:
            d["explain"] = explain
        return d

    def meaning(self, phrase):
        return {"type": "meaning", "phrase": self.id(phrase)}

    def listen(self, phrase, aunty=False):
        return {"type": "listen", "phrase": self.id(phrase), "speed": "aunty" if aunty else "normal"}

    def match(self, *keys):
        return {"type": "match", "phrases": self.i(*keys)}

    def build(self, phrase, prompt=None, extra=None):
        d = {"type": "build", "phrase": self.id(phrase)}
        if prompt:
            d["prompt"] = prompt
        if extra:
            d["distractors"] = [tp(r, u) for r, u in extra]
        return d

    def gap(self, phrase, word, wrong, explain=None):
        d = {"type": "gap", "phrase": self.id(phrase), "word": tp(*word), "distractors": [tp(r, u) for r, u in wrong]}
        if explain:
            d["explain"] = explain
        return d

    def speak(self, phrase):
        return {"type": "speak", "phrase": self.id(phrase)}

    def mc(self, prompt, options, answer=0, explain=None, show=None):
        opts = []
        for o in options:
            if isinstance(o, str):
                opts.append({"phrase": self.id(o[1:])} if o.startswith("@") else {"text": o})
            else:
                text, fb = o
                opts.append({**({"phrase": self.id(text[1:])} if text.startswith("@") else {"text": text}), "feedback": fb})
        d = {"type": "mc", "prompt": prompt, "options": opts, "answer": answer}
        if explain:
            d["explain"] = explain
        if show:
            d["show"] = self.id(show)
        return d

    def respect(self, situation, listener, options):
        return {
            "type": "respect",
            "situation": situation,
            "listener": listener,
            "options": [{"phrase": self.id(p), "verdict": v, "feedback": f} for p, v, f in options],
        }

    def teach(self, phrase, tip=None):
        d = {"phrase": self.id(phrase)}
        if tip:
            d["tip"] = tip
        return d

    # conversations
    def npc(self, speaker, say, nxt):
        return {"type": "npc", "speaker": speaker, "say": self.id(say), "next": nxt}

    def you(self, prompt, options, hint=None):
        d = {"type": "you", "prompt": prompt, "options": options}
        if hint:
            d["hint"] = hint
        return d

    def opt(self, phrase, nxt, quality="fine", reaction=None):
        d = {"phrase": self.id(phrase), "next": nxt, "quality": quality}
        if reaction:
            d["reaction"] = reaction
        return d


def tp(roman, urdu):
    return {"roman": roman, "urdu": urdu}


def info(title, text, glyph=None, examples=None):
    d = {"title": title, "info": text}
    if glyph:
        d["glyph"] = glyph
    if examples:
        d["examples"] = examples
    return d


MIX_PROMPTS = [
    "Khala is on the phone. Say: “{en}”",
    "Nani is waiting. Say: “{en}”",
    "The whole room goes quiet. Your line: “{en}”",
    "Type it for the family group: “{en}”",
]


def mix_lesson(uid: str, meta: dict, lessons: list, phrases: list) -> dict:
    """A consolidation lesson before the boss: every lesson's taught phrases, production first."""
    by_id = {p["id"]: p for p in phrases}
    taught = []
    for l in lessons:
        for t in l["teach"]:
            pid = t.get("phrase")
            if pid and pid.startswith(uid + ".") and pid in by_id and pid not in taught:
                taught.append(pid)
    step = max(1, len(taught) // 9)
    pick = taught[::step][:9]
    clean = lambda en: re.sub(r"\s*\(.*?\)", "", en).strip()
    ex = []
    for i, pid in enumerate(pick):
        p = by_id[pid]
        kind = ["say", "type", "listen", "build", "type", "say", "meaning", "type", "listen"][i % 9]
        if kind == "build" and len(p["roman"].split()) < 2:
            kind = "type"
        prompt = MIX_PROMPTS[i % len(MIX_PROMPTS)].replace("{en}", clean(p["en"]))
        if kind == "say":
            ex.append({"type": "say", "phrase": pid, "prompt": prompt})
        elif kind == "type":
            ex.append({"type": "type", "phrase": pid, "prompt": prompt if "Type" in prompt else f"Type it: “{clean(p['en'])}”"})
        elif kind == "listen":
            ex.append({"type": "listen", "phrase": pid, "speed": "aunty" if i % 2 else "normal"})
        elif kind == "build":
            ex.append({"type": "build", "phrase": pid})
        else:
            ex.append({"type": "meaning", "phrase": pid})
    if len(pick) >= 4:
        ex.insert(3, {"type": "match", "phrases": pick[:4]})
    return {
        "id": f"{uid}-mix",
        "title": "Mix it up",
        "blurb": "Everything from this unit, shuffled. Warm-up for the boss.",
        "canDo": f"You can use this unit's phrases without a prompt: {meta['canDo'][0].lower() + meta['canDo'][1:]}",
        "teach": [info("Boss warm-up", "Everything from this unit, mixed together and mostly production: you say it, you type it. Mistakes come back, as always, for free.")],
        "exercises": ex,
    }


def write_unit(u: Unit, meta: dict, lessons: list, boss: dict | None, senses: dict | None = None):
    if meta.get("track") == "speaking" and not any(l["id"].endswith("-mix") for l in lessons):
        lessons = [*lessons, mix_lesson(u.U, meta, lessons, u.phrases)]
    for s, keys in (senses or {}).items():
        for ph in u.phrases:
            if ph["id"].split(".", 1)[1] in keys:
                ph["sense"] = s
    unit = {**meta, "id": u.U, "phrases": u.phrases, "lessons": lessons}
    if boss:
        unit["boss"] = boss
    out = ROOT / "content" / "units" / f"{u.U}.json"
    if out.exists():
        old = {p["id"]: p for p in json.loads(out.read_text())["phrases"]}
        for ph in u.phrases:
            o = old.get(ph["id"])
            if o and o.get("sources") and o["urdu"] == ph["urdu"]:
                ph["sources"] = o["sources"]
                ph["confidence"] = o["confidence"]
    for ph in u.phrases:
        ph.setdefault("sources", [{"ref": "usage", "checked": "2026-11-16"}])
    order = ["id", "track", "order", "title", "titleUrdu", "emoji", "tagline", "canDo", "grammar", "phrases", "lessons", "boss"]
    unit = {k: unit[k] for k in order if k in unit}
    out.write_text(json.dumps(unit, ensure_ascii=False, indent=2) + "\n")
    print(f"wrote {out.name}: {len(u.phrases)} phrases, {len(lessons)} lessons")
