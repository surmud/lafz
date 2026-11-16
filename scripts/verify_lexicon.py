#!/usr/bin/env python3
"""Check every Urdu word used in content/ against online dictionaries and record what was found.

Sources (SPEC §6):
  platts      Platts, A Dictionary of Urdu, Classical Hindi and English (DSAL, U. Chicago)
  wiktionary  English Wiktionary, Urdu entries (secondary)
Rekhta and the Urdu Dictionary Board block scripted access, so words these two sources do not cover
are checked by hand and recorded in content/lexicon-manual.json.

Results are cached in content/lexicon.json, so only new words hit the network.

  python scripts/verify_lexicon.py            # verify new words, then write sources into the units
  python scripts/verify_lexicon.py --report   # only list words with no dictionary evidence
"""
from __future__ import annotations

import datetime
import glob
import json
import re
import ssl
import sys
from concurrent.futures import ThreadPoolExecutor
import time
import urllib.parse
import urllib.request
from pathlib import Path

import certifi

SSL = ssl.create_default_context(cafile=certifi.where())

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
CACHE = CONTENT / "lexicon.json"
MANUAL = CONTENT / "lexicon-manual.json"
UA = "LafzContentCheck/1.0 (https://github.com/surmud/lafz; educational, low volume)"
TODAY = datetime.date.today().isoformat()

PUNCT = re.compile(r"[?!.,،۔؟!\"“”…:؛()\-–—]")
DIACRITICS = re.compile(r"[ً-ٰٟ]")


def tokens(urdu: str) -> list[str]:
    return [t for t in PUNCT.sub(" ", DIACRITICS.sub("", urdu)).split() if re.search(r"[؀-ۿ]", t)]


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=30, context=SSL) as r:
                return r.read().decode("utf-8", "replace")
        except Exception as e:  # noqa: BLE001
            if attempt == 2:
                print(f"  ! {url}: {e}", file=sys.stderr)
                return ""
            time.sleep(2 + attempt * 3)
    return ""


def strip_tags(html: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html)).strip()


def platts_forms(word: str) -> list[str]:
    """DSAL's Platts uses Arabic code points: ي for medial/final ye, ه for both ہ and ھ."""
    base = word.replace("ھ", "ه").replace("ہ", "ه").replace("ۂ", "ه")
    a = base.replace("ی", "ي")
    b = base[:-1].replace("ی", "ي") + base[-1:]  # keep a final ی
    return list(dict.fromkeys([a, b, word]))


def platts(word: str) -> dict | None:
    for form in platts_forms(word):
        hit = platts_one(form)
        if hit:
            return hit
    return None


def platts_one(word: str) -> dict | None:
    url = (
        "https://dsal.uchicago.edu/cgi-bin/app/platts_query.py?qs="
        + urllib.parse.quote(word)
        + "&searchhws=yes&matchtype=exact"
    )
    html = fetch(url)
    entries = re.findall(r"<entry>(.*?)(?:</entry>|</div>)", html, flags=re.S)
    if not entries:
        return None
    out = []
    for e in entries[:4]:
        hw = re.search(r"<hw>(.*?)</hw>", e, flags=re.S)
        translit = strip_tags(" ".join(re.findall(r"<i>(.*?)</i>", hw.group(1)))) if hw else ""
        gloss = strip_tags(e.split("</hw>", 1)[1] if "</hw>" in e else e)
        out.append({"translit": translit[:60], "gloss": gloss[:220]})
    return {"url": url, "entries": out}


def clean_wikitext(line: str) -> str:
    line = re.sub(r"\{\{(?:lb|label|lbl)\|ur\|([^}]*)\}\}", r"(\1)", line)
    line = re.sub(r"\{\{(?:inflection of|infl of)\|ur\|([^|}]*)\|[^}]*\}\}", r"inflection of \1", line)
    line = re.sub(r"\{\{[a-z\- ]*(?:form|plural|feminine|masculine|oblique|vocative|direct)[a-z\- ]*of\|ur\|([^|}]*)[^}]*\}\}", r"form of \1", line)
    line = re.sub(r"\{\{(?:l|m|link|mention)\|[a-z\-]+\|([^|}]*)[^}]*\}\}", r"\1", line)
    line = re.sub(r"\{\{[^}]*\}\}", "", line)
    line = re.sub(r"\[\[(?:[^|\]]*\|)?([^\]]*)\]\]", r"\1", line)
    return re.sub(r"\s+", " ", line.replace("'''", "").replace("''", "")).strip(" #:")


def wiktionary(word: str) -> dict | None:
    api = (
        "https://en.wiktionary.org/w/api.php?action=parse&prop=wikitext&format=json&redirects=1&page="
        + urllib.parse.quote(word)
    )
    raw = fetch(api)
    try:
        text = json.loads(raw)["parse"]["wikitext"]["*"]
    except Exception:  # noqa: BLE001
        return None
    m = re.search(r"^==Urdu==\s*$(.*?)(?=^==[^=]|\Z)", text, flags=re.S | re.M)
    if not m:
        return None
    section = m.group(1)
    glosses = [clean_wikitext(line) for line in section.splitlines() if re.match(r"^#[^:*#]", line)]
    glosses = [g for g in glosses if g][:4]
    translit = re.search(r"\|tr=([^|}]+)", section)
    return {
        "url": "https://en.wiktionary.org/wiki/" + urllib.parse.quote(word) + "#Urdu",
        "translit": translit.group(1).strip() if translit else "",
        "glosses": glosses,
    }


def variants(word: str) -> list[str]:
    """Spelling variants dictionaries may file the word under."""
    out = [word]
    if word.endswith("ے"):
        out.append(word[:-1] + "ا")  # oblique/plural -> direct singular (کیسے -> کیسا)
    if word.endswith("ی") and len(word) > 2:
        out.append(word[:-1] + "ا")  # feminine -> masculine (کیسی -> کیسا)
    if word.endswith("وں") and len(word) > 3:
        out.append(word[:-2])  # oblique plural
    if word.endswith("یں") and len(word) > 3:
        out.append(word[:-2])
    return list(dict.fromkeys(out))


def verify(word: str, manual: dict) -> dict:
    entry: dict = {"checked": TODAY}
    lemma = manual.get("lemmas", {}).get(word)
    tried = ([lemma] if lemma else []) + variants(word)
    for form in dict.fromkeys(tried):
        if "wiktionary" not in entry:
            w = wiktionary(form)
            time.sleep(0.25)
            if w:
                entry["wiktionary"] = {**w, "headword": form}
        if "platts" not in entry:
            p = platts(form)
            time.sleep(0.25)
            if p:
                entry["platts"] = {**p, "headword": form}
        if "wiktionary" in entry and "platts" in entry:
            break
    return entry


def load_units() -> list[tuple[Path, dict]]:
    return [(Path(p), json.loads(Path(p).read_text())) for p in sorted(glob.glob(str(CONTENT / "units" / "*.json")))]


def sources_for(phrase: dict, cache: dict, manual: dict) -> tuple[list[dict], list[str]]:
    sources: list[dict] = []
    missing: list[str] = []
    seen: set[tuple[str, str]] = set()

    def add(ref: str, item: str, url: str | None, checked: str) -> None:
        if (ref, item) in seen:
            return
        seen.add((ref, item))
        s = {"ref": ref, "item": item, "checked": checked}
        if url:
            s["url"] = url
        sources.append(s)

    names = set(manual.get("names", []))
    for tok in tokens(phrase["urdu"]):
        if tok in names:
            continue  # proper nouns need no dictionary
        hand = manual.get("words", {}).get(tok)
        entry = cache.get(tok, {})
        found = False
        if entry.get("platts"):
            add("platts", entry["platts"]["headword"], entry["platts"]["url"], entry["checked"])
            found = True
        if entry.get("wiktionary"):
            add("wiktionary", entry["wiktionary"]["headword"], entry["wiktionary"]["url"], entry["checked"])
            found = True
        if hand:
            add(hand["ref"], hand.get("item", tok), hand.get("url"), hand["checked"])
            found = True
        if not found:
            missing.append(tok)
    for extra in manual.get("phrases", {}).get(phrase["id"], []):
        add(extra["ref"], extra.get("item", phrase["roman"]), extra.get("url"), extra["checked"])
    return sources, missing


def main() -> int:
    report_only = "--report" in sys.argv
    cache = json.loads(CACHE.read_text()) if CACHE.exists() else {}
    manual = json.loads(MANUAL.read_text()) if MANUAL.exists() else {"lemmas": {}, "words": {}, "phrases": {}}
    units = load_units()

    words: dict[str, None] = {}
    names = set(manual.get("names", []))
    for _, unit in units:
        for ph in unit["phrases"]:
            for t in tokens(ph["urdu"]):
                if t not in names:
                    words[t] = None

    todo = [w for w in words if w not in cache or (manual.get("lemmas", {}).get(w) and not (cache[w].get("platts") or cache[w].get("wiktionary")))]
    if todo and not report_only:
        print(f"verifying {len(todo)} new words…")
        with ThreadPoolExecutor(max_workers=4) as pool:
            for i, (w, entry) in enumerate(zip(todo, pool.map(lambda x: verify(x, manual), todo)), 1):
                cache[w] = entry
                hit = [k for k in ("platts", "wiktionary") if k in entry]
                print(f"  [{i}/{len(todo)}] {w}: {', '.join(hit) or 'NOT FOUND'}", flush=True)
        CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=1, sort_keys=True) + "\n")

    unverified: dict[str, list[str]] = {}
    downgraded = 0
    for path, unit in units:
        for ph in unit["phrases"]:
            sources, missing = sources_for(ph, cache, manual)
            for m in missing:
                unverified.setdefault(m, []).append(ph["id"])
            if report_only:
                continue
            if sources:
                ph["sources"] = sources
            # A phrase with any word that no reference covers cannot claim high confidence.
            if missing and ph.get("confidence") == "high":
                ph["confidence"] = "medium"
                downgraded += 1
        if not report_only:
            path.write_text(json.dumps(unit, ensure_ascii=False, indent=2) + "\n")

    print(f"{len(words)} distinct words, {len(unverified)} with no dictionary evidence")
    for w, ids in sorted(unverified.items()):
        print(f"  {w}  ← {', '.join(ids[:4])}{' …' if len(ids) > 4 else ''}")
    if downgraded:
        print(f"{downgraded} phrases downgraded to medium confidence")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
