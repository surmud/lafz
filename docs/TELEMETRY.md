# Anonymous statistics

Lafz has no backend. To see how learners progress as a group, the app can send a small anonymous
summary to an endpoint **you** host. Until an endpoint is configured, nothing is ever sent and the
switch is not shown.

## What is collected (only after the learner switches it on, Me → Insights)
- A random install id (not tied to a person, an account or a device identifier).
- The **snapshot** shown on the Insights page under "See exactly what the summary contains":
  learner type (heritage/beginner), estimated level band, XP, lessons and conversations finished,
  placement result, phrases met/solid, active days, minutes, best streak, accuracy and answer counts
  per skill, and the furthest lesson reached in each track.
- Up to 100 recent events: `lesson`, `review`, `boss`, `placement`, each with a timestamp, the lesson
  id, first-try accuracy and seconds taken.

Never collected: names (including the family names typed at onboarding), typed answers, voice
recordings, IP-derived location, contacts.

## Turning it on (needs the founder: a free Cloudflare account)
1. Create a Cloudflare account, then a KV namespace called `lafz-stats`.
2. Create a Worker, paste `tools/telemetry/worker.js`, bind the namespace as `STATS`, and add two
   variables: `ALLOW_ORIGIN=https://surmud.github.io` and a secret `EXPORT_KEY` (any long random string).
3. In the GitHub repo: Settings → Secrets and variables → Actions → Variables → add
   `NEXT_PUBLIC_TELEMETRY_URL` with the Worker URL. The CI build passes it to `next build`.
4. Update the onboarding line "Your progress stays on this device" only if you change the default.
   As shipped, sharing is off until the learner turns it on, so the line stays true.

## Reading the data
```bash
curl -s "https://<worker>/export?key=<EXPORT_KEY>" > stats.ndjson
python scripts/telemetry_report.py stats.ndjson > docs/userbase-report.md
```
The report covers: who is learning, the level-band distribution, median accuracy per skill across
learners, the funnel by furthest unit reached, 1/7/30-day return rates, and the lessons with the
lowest first-try accuracy (the ones to rewrite first).

## On-device insights (no setup)
Every learner gets Me → Insights: estimated level, accuracy per skill, 14-day activity, trouble
words. That page is computed locally from `progress.skills` and `progress.days` (src/engine/skills.ts).
