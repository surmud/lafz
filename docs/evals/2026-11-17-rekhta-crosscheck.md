# Rekhta spelling cross-check (G14) — 2026-11-17

Every word in the course is attested in Platts and/or Wiktionary (see `content/lexicon.json`). This pass
hand-checks high-traffic family and food words against Rekhta Dictionary, a second, Urdu-first source
(via its `rdict-dev.rekhta.org` mirror; the main site refuses scripted requests).

| Lafz spelling | Rekhta | Verdict |
|---|---|---|
| ممانی (mumani) | مُمانی, "wife of one's mother's brother" | ✅ same |
| تائی (tai) | تائی, "father's elder brother's wife" | ✅ same |
| پھپھو (phuppo) | headword is پُھپّی (phuppi), "father's sister" | ⚠️ We teach the colloquial Pakistani "Phuppo". Rekhta lists the "Phuppi" form, which the matcher already accepts. Kept, and noted. |
| مزیدار (mazedaar) | مَزے دار (two words), "delicious, tasty" | ⚠️ Both spellings are in use; ours is attested in Platts. Kept. |
| ڈھولکی (dholki) | ڈھولَک (dholak, small drum); "Dholak rakhnaa: pre-marriage festivities" | ✅ supports the wedding sense; ڈھولکی is the diminutive in common use |
| السلام علیکم / وعلیکم السلام | (checked earlier) "alaikum", "vaalaikum assalaam" | ✅ |
| Ghalib couplet | rekhta.org/couplets/hazaaron-khvaahishen-… | ✅ (Rekhta uses both "par" and "pe" in line 1) |

No disagreements needed a change. Two spelling differences are recorded above for a future native-speaker pass.
