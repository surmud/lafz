// Cloudflare Worker: receives Lafz's anonymous statistics and appends them to a KV namespace.
// Free tier is plenty (100k requests/day). Setup is in docs/TELEMETRY.md.
//
//   POST /        body: {"install": "...", "sent": 1790000000, "snapshot": {...}, "events": [...]}
//   GET  /export?key=<EXPORT_KEY>   → newline-delimited JSON of everything received
//
// Bindings: STATS (KV namespace), EXPORT_KEY (secret), ALLOW_ORIGIN (e.g. https://surmud.github.io)
const worker = {
  async fetch(request, env) {
    const origin = env.ALLOW_ORIGIN || "*";
    const cors = { "access-control-allow-origin": origin, "access-control-allow-methods": "POST, OPTIONS", "access-control-allow-headers": "content-type" };
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    if (request.method === "GET" && url.pathname === "/export") {
      if (!env.EXPORT_KEY || url.searchParams.get("key") !== env.EXPORT_KEY) return new Response("forbidden", { status: 403 });
      const lines = [];
      let cursor;
      do {
        const page = await env.STATS.list({ cursor });
        for (const k of page.keys) lines.push(await env.STATS.get(k.name));
        cursor = page.list_complete ? undefined : page.cursor;
      } while (cursor);
      return new Response(lines.join("\n") + "\n", { headers: { "content-type": "application/x-ndjson" } });
    }

    if (request.method !== "POST") return new Response("ok", { headers: cors });
    const text = await request.text();
    if (text.length > 20_000) return new Response("too large", { status: 413, headers: cors });
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      return new Response("bad json", { status: 400, headers: cors });
    }
    if (typeof body.install !== "string" || typeof body.snapshot !== "object") return new Response("bad shape", { status: 400, headers: cors });
    // One record per install per day: the latest snapshot wins, events accumulate.
    const day = new Date().toISOString().slice(0, 10);
    const key = `${day}:${body.install.slice(0, 40)}`;
    const prev = JSON.parse((await env.STATS.get(key)) || "null");
    const record = { day, install: body.install.slice(0, 40), snapshot: body.snapshot, events: [...(prev?.events ?? []), ...(Array.isArray(body.events) ? body.events : [])].slice(-300) };
    await env.STATS.put(key, JSON.stringify(record), { expirationTtl: 60 * 60 * 24 * 400 });
    return new Response("ok", { headers: cors });
  },
};

export default worker;
