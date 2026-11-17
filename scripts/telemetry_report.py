#!/usr/bin/env python3
"""Turn the anonymous statistics export into a user-base report.

  curl -s "https://<worker>/export?key=<EXPORT_KEY>" > stats.ndjson
  python scripts/telemetry_report.py stats.ndjson > docs/userbase-report.md

Input: one JSON object per line: {"day", "install", "snapshot", "events"} (tools/telemetry/worker.js).
Output: Markdown: how many learners, where they are (level bands), how the skills compare,
how far people get (funnel), who comes back (retention), and which lessons go worst."""
import collections
import datetime
import json
import statistics
import sys

BANDS = ["starter", "survival", "conversational", "confident", "advanced"]
SKILLS = ["listening", "speaking", "recall", "recognition", "reading", "grammar"]


def load(path):
    rows = []
    for line in open(path, encoding="utf-8"):
        line = line.strip()
        if line:
            try:
                rows.append(json.loads(line))
            except json.JSONDecodeError:
                pass
    return rows


def report(rows) -> str:
    by_install = collections.defaultdict(list)
    for r in rows:
        by_install[r["install"]].append(r)
    latest = {i: max(rs, key=lambda r: r["day"])["snapshot"] for i, rs in by_install.items()}
    n = len(latest)
    out = ["# Lafz user-base report", "", f"Generated {datetime.date.today()} from {len(rows)} daily records, {n} installs (opted in).", ""]
    if n == 0:
        return "\n".join(out + ["No data yet."])

    out += ["## Who is learning", "", "| | installs | share |", "|---|---:|---:|"]
    kinds = collections.Counter(s.get("kind") or "unknown" for s in latest.values())
    for k, c in kinds.most_common():
        out.append(f"| {k} | {c} | {c / n:.0%} |")

    out += ["", "## Where they are (estimated level)", "", "| band | installs | share |", "|---|---:|---:|"]
    bands = collections.Counter(s.get("band", "starter") for s in latest.values())
    for b in BANDS:
        out.append(f"| {b} | {bands[b]} | {bands[b] / n:.0%} |")
    med = lambda key: statistics.median(s.get(key, 0) for s in latest.values())
    out += ["", f"Median: {med('lessons'):.0f} lessons, {med('met'):.0f} phrases met, {med('solid'):.0f} solid, {med('minutes'):.0f} minutes, {med('activeDays'):.0f} active days."]

    out += ["", "## Skills across the user base", "", "| skill | learners with data | median accuracy | answers |", "|---|---:|---:|---:|"]
    for sk in SKILLS:
        acc = [s["accuracy"][sk] for s in latest.values() if sk in s.get("accuracy", {})]
        ans = sum(s.get("answers", {}).get(sk, 0) for s in latest.values())
        out.append(f"| {sk} | {len(acc)} | {statistics.median(acc):.0%} | {ans} |" if acc else f"| {sk} | 0 | n/a | {ans} |")

    out += ["", "## Funnel (furthest speaking lesson reached)", "", "| reached | installs | share |", "|---|---:|---:|"]
    furthest = collections.Counter((s.get("furthest", {}).get("speaking") or "none").split("-")[0] for s in latest.values())
    reached = 0
    for unit in sorted((u for u in furthest if u != "none"), reverse=True):
        reached += furthest[unit]
        out.append(f"| {unit} or later | {reached} | {reached / n:.0%} |")
    out.append(f"| no lesson finished | {furthest['none']} | {furthest['none'] / n:.0%} |")

    out += ["", "## Retention", ""]
    first = {i: min(r["day"] for r in rs) for i, rs in by_install.items()}
    days = {i: {r["day"] for r in rs} for i, rs in by_install.items()}
    for gap in (1, 7, 30):
        eligible = [i for i in first if (datetime.date.today() - datetime.date.fromisoformat(first[i])).days >= gap]
        back = [i for i in eligible if any((datetime.date.fromisoformat(d) - datetime.date.fromisoformat(first[i])).days >= gap for d in days[i])]
        out.append(f"- Seen again {gap}+ days after first day: {len(back)}/{len(eligible)}" + (f" ({len(back) / len(eligible):.0%})" if eligible else ""))

    out += ["", "## Lessons that go worst (lowest first-try accuracy, 5+ completions)", "", "| lesson | completions | median accuracy | median seconds |", "|---|---:|---:|---:|"]
    per = collections.defaultdict(list)
    for r in rows:
        for e in r.get("events", []):
            if e.get("e") == "lesson" and "id" in e and "acc" in e:
                per[e["id"]].append(e)
    worst = sorted(((statistics.median(x["acc"] for x in es), k, es) for k, es in per.items() if len(es) >= 5))[:15]
    for acc, k, es in worst:
        out.append(f"| {k} | {len(es)} | {acc:.0%} | {statistics.median(x.get('secs', 0) for x in es):.0f} |")
    if not worst:
        out.append("| (not enough data yet) | | | |")
    return "\n".join(out) + "\n"


if __name__ == "__main__":
    print(report(load(sys.argv[1])))
