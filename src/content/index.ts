import "server-only";
import { pack } from "@/lang";
import fs from "node:fs";
import path from "node:path";
import type { UnitMeta } from "@/engine/course";
import {
  CharacterSchema,
  PackSchema,
  PlacementQuestionSchema,
  RelativeSchema,
  UnitSchema,
  type Character,
  type Pack,
  type Phrase,
  type PlacementQuestion,
  type Relative,
  type Unit,
} from "./schema";

/**
 * Build-time content access for server components. Pages pass only the slice they need to
 * client components, so each page ships just its own unit's content.
 */
const DIR = path.join(process.cwd(), "content", pack.code);

function read(file: string): unknown {
  return JSON.parse(fs.readFileSync(path.join(DIR, file), "utf8"));
}

let unitsCache: Unit[] | null = null;
export function units(): Unit[] {
  unitsCache ??= fs
    .readdirSync(path.join(DIR, "units"))
    .filter((f) => f.endsWith(".json"))
    .map((f) => UnitSchema.parse(read(`units/${f}`)))
    .sort((a, b) => a.track.localeCompare(b.track) * -1 || a.order - b.order);
  return unitsCache;
}

export function unit(id: string): Unit {
  const u = units().find((x) => x.id === id);
  if (!u) throw new Error(`no unit ${id}`);
  return u;
}

export function allPhrases(): Map<string, Phrase> {
  return new Map(units().flatMap((u) => u.phrases.map((p) => [p.id, p] as const)));
}

export function lessonUnit(lessonId: string): Unit {
  const u = units().find((x) => x.lessons.some((l) => l.id === lessonId));
  if (!u) throw new Error(`no lesson ${lessonId}`);
  return u;
}

function optional<T>(file: string, parse: (x: unknown) => T): T[] {
  if (!fs.existsSync(path.join(DIR, file))) return [];
  return (read(file) as unknown[]).map(parse);
}

export const characters = (): Character[] => optional("characters.json", (x) => CharacterSchema.parse(x));
export const packs = (): Pack[] => optional("packs.json", (x) => PackSchema.parse(x));
export const relatives = (): Relative[] => optional("family.json", (x) => RelativeSchema.parse(x));
export const placementQuestions = (): PlacementQuestion[] =>
  optional("placement.json", (x) => PlacementQuestionSchema.parse(x));

export function courseMeta(): UnitMeta[] {
  return units().map((u) => ({
    id: u.id,
    track: u.track,
    stage: u.stage,
    order: u.order,
    title: u.title,
    titleUrdu: u.titleUrdu,
    emoji: u.emoji,
    tagline: u.tagline,
    canDo: u.canDo,
    phraseCount: u.phrases.length,
    lessons: u.lessons.map((l) => ({ id: l.id, title: l.title, blurb: l.blurb, canDo: l.canDo })),
    boss: u.boss
      ? { id: u.boss.id, title: u.boss.title, blurb: u.boss.blurb, character: u.boss.character, canDo: u.boss.canDo }
      : undefined,
    story: u.story ? { title: u.story.title, emoji: u.story.emoji, blurb: u.story.blurb } : undefined,
  }));
}

/**
 * The client never needs provenance (sources, confidence): strip it so pages stay small.
 * Sources stay in the repo and are shown on the credits page in aggregate.
 */
export function slim(p: Phrase): Phrase {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { sources, confidence, ...rest } = p;
  return { ...rest, sources: [], confidence } as Phrase;
}

/** Only the phrases a set of ids needs (for review, packs, placement), slimmed for the client. */
export function pickPhrases(ids: Iterable<string>): Phrase[] {
  const all = allPhrases();
  return [...new Set(ids)].map((id) => all.get(id)).filter((p): p is Phrase => Boolean(p)).map(slim);
}
