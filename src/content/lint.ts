import { pack } from "@/lang";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { lintConversation } from "@/engine/conversation";
import { resolveExercise } from "@/engine/exercises";
import { audioKey } from "./audio-key";
import {
  CharacterSchema,
  PackSchema,
  PlacementQuestionSchema,
  RelativeSchema,
  UnitSchema,
  type Phrase,
  type Unit,
} from "./schema";

function readJson(file: string): unknown {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function issues(where: string, err: z.ZodError): string[] {
  return err.issues.map((i) => `${where}: ${i.path.join(".")}: ${i.message}`);
}

export interface LintResult {
  problems: string[];
  summary: string;
}

export function lintContent(root: string, opts: { requireAudio?: boolean } = {}): LintResult {
  const problems: string[] = [];
  const contentDir = path.join(root, "content", pack.code);
  const unitDir = path.join(contentDir, "units");
  const units: Unit[] = [];
  for (const f of fs.readdirSync(unitDir).filter((x) => x.endsWith(".json")).sort()) {
    const r = UnitSchema.safeParse(readJson(path.join(unitDir, f)));
    if (!r.success) problems.push(...issues(`units/${f}`, r.error));
    else {
      if (`${r.data.id}.json` !== f) problems.push(`units/${f}: id "${r.data.id}" must match the file name`);
      units.push(r.data);
    }
  }

  const phrases = new Map<string, Phrase>();
  for (const u of units) {
    for (const p of u.phrases) {
      if (phrases.has(p.id)) problems.push(`${u.id}: duplicate phrase id "${p.id}"`);
      phrases.set(p.id, p);
      if (!p.id.startsWith(`${u.id}.`)) problems.push(`${u.id}: phrase "${p.id}" should start with "${u.id}."`);
    }
  }

  const ids = new Set(phrases.keys());
  const seenLesson = new Set<string>();
  let exerciseCount = 0;
  for (const u of units) {
    const pool = u.phrases;
    const orders = units.filter((x) => x.track === u.track && x.order === u.order);
    if (orders.length > 1) problems.push(`${u.id}: order ${u.order} is used twice in the ${u.track} track`);
    for (const l of u.lessons) {
      if (seenLesson.has(l.id)) problems.push(`${u.id}: duplicate lesson id "${l.id}"`);
      seenLesson.add(l.id);
      for (const t of l.teach) {
        const refs = "phrase" in t ? [t.phrase] : (t.examples ?? []);
        for (const ref of refs) if (!ids.has(ref)) problems.push(`${l.id}: teach card uses unknown phrase "${ref}"`);
      }
      l.exercises.forEach((ex, i) => {
        exerciseCount++;
        try {
          resolveExercise(ex, `${l.id}#${i}`, { phrases, pool });
        } catch (e) {
          problems.push(`${l.id}#${i} (${ex.type}): ${(e as Error).message}`);
        }
        if (ex.type === "build") {
          const p = phrases.get(ex.phrase);
          if (p && p.roman.split(/\s+/).length !== p.urdu.replace(/[،۔؟!?.,]/g, " ").trim().split(/\s+/).length) {
            // Not an error: tiles are per script. Only flag one-word builds, which are pointless.
          }
          if (p && p.roman.trim().split(/\s+/).length < 2) problems.push(`${l.id}#${i}: build needs 2+ words`);
        }
        if (ex.type === "gap") {
          const p = phrases.get(ex.phrase);
          if (p && ex.distractors.some((d) => d.roman === ex.word.roman)) {
            problems.push(`${l.id}#${i}: gap distractor equals the answer`);
          }
        }
      });
    }
    if (u.boss) {
      for (const p of lintConversation(u.boss, ids)) problems.push(`${u.boss.id}: ${p}`);
    }
    if (u.story) {
      for (const line of u.story.lines) if (!ids.has(line.phrase)) problems.push(`${u.id} story: unknown phrase "${line.phrase}"`);
      u.story.questions.forEach((q, i) => {
        if (q.answer >= q.options.length) problems.push(`${u.id} story question ${i}: answer out of range`);
      });
    }
  }

  const optional = <T,>(file: string, schema: z.ZodType<T>): T[] => {
    const full = path.join(contentDir, file);
    if (!fs.existsSync(full)) return [];
    const r = z.array(schema).safeParse(readJson(full));
    if (!r.success) {
      problems.push(...issues(file, r.error));
      return [];
    }
    return r.data;
  };

  const characters = optional("characters.json", CharacterSchema);
  const charIds = new Set(characters.map((c) => c.id));
  for (const u of units) {
    if (u.boss && !charIds.has(u.boss.character)) problems.push(`${u.boss.id}: unknown character "${u.boss.character}"`);
    for (const line of u.story?.lines ?? []) {
      if (line.speaker && !charIds.has(line.speaker)) problems.push(`${u.id} story: unknown speaker "${line.speaker}"`);
    }
    for (const l of u.lessons) {
      for (const ex of l.exercises) {
        if (ex.type !== "scene") continue;
        for (const line of ex.lines) if (!charIds.has(line.speaker)) problems.push(`${l.id}: scene uses unknown speaker "${line.speaker}"`);
      }
    }
    for (const n of Object.values(u.boss?.nodes ?? {})) {
      if (n.type === "npc" && !charIds.has(n.speaker)) problems.push(`${u.boss?.id}: unknown speaker "${n.speaker}"`);
    }
  }

  for (const pack of optional("packs.json", PackSchema)) {
    for (const s of pack.sessions) {
      for (const ref of s.phrases) if (!ids.has(ref)) problems.push(`packs/${pack.id}/${s.id}: unknown phrase "${ref}"`);
    }
  }
  for (const rel of optional("family.json", RelativeSchema)) {
    if (!ids.has(rel.phrase)) problems.push(`family/${rel.id}: unknown phrase "${rel.phrase}"`);
  }
  for (const q of optional("placement.json", PlacementQuestionSchema)) {
    try {
      resolveExercise(q.exercise, q.id, { phrases, pool: [...phrases.values()] });
    } catch (e) {
      problems.push(`placement/${q.id}: ${(e as Error).message}`);
    }
  }

  // Audio: every phrase needs a normal and a slow clip once audio has been generated.
  const manifestFile = path.join(root, "public", "audio", "manifest.json");
  let missingAudio = 0;
  if (fs.existsSync(manifestFile)) {
    const manifest = readJson(manifestFile) as Record<string, unknown>;
    const need = (p: { urdu: string; tts?: string }, speaker?: string) => {
      for (const rate of ["normal", "slow"] as const) {
        if (!manifest[audioKey({ ...p, speaker }, rate)]) missingAudio++;
      }
    };
    for (const p of phrases.values()) need(p, p.speaker);
    // Scene and story lines are voiced by whoever says them, which may differ from the phrase's own speaker.
    for (const u of units) {
      for (const line of u.story?.lines ?? []) {
        const p = phrases.get(line.phrase);
        if (p) need(p, line.speaker);
      }
      for (const l of u.lessons) {
        for (const ex of l.exercises) {
          if (ex.type !== "scene") continue;
          for (const line of ex.lines) {
            const p = phrases.get(line.phrase);
            if (p) need(p, line.speaker);
          }
        }
      }
    }
    if (missingAudio > 0) problems.push(`${missingAudio} audio clip(s) missing: run python scripts/generate_audio.py`);
  } else if (opts.requireAudio) {
    problems.push("public/audio/manifest.json missing: run python scripts/generate_audio.py");
  }

  const medium = [...phrases.values()].filter((p) => p.confidence === "medium").length;
  return {
    problems,
    summary:
      `${units.length} units, ${seenLesson.size} lessons, ${exerciseCount} exercises, ${phrases.size} phrases ` +
      `(${medium} medium-confidence), ${characters.length} characters`,
  };
}
