import { z } from "zod";

/** Content schema (SPEC §6–7). Every JSON file in content/ is validated against this in CI. */

const id = z.string().regex(/^[a-z0-9][a-z0-9.\-]*$/, "ids are lowercase letters, digits, dots and dashes");
const URDU_RE = /[؀-ۿ]/;
const urduText = z.string().min(1).regex(URDU_RE, "must contain Urdu script");
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const SourceSchema = z.strictObject({
  /** Which reference: rekhta, udb, platts, wiktionary, schmidt (grammar) or usage (attested usage). */
  ref: z.enum(["rekhta", "udb", "platts", "wiktionary", "wikipedia", "schmidt", "usage"]),
  url: z.url().optional(),
  /** The headword or point that was checked. */
  item: z.string().optional(),
  checked: day,
});

export const TokenPairSchema = z.strictObject({ roman: z.string().min(1), urdu: urduText });

export const PhraseSchema = z.strictObject({
  id,
  roman: z.string().min(1),
  urdu: urduText,
  en: z.string().min(1),
  literal: z.string().optional(),
  note: z.string().optional(),
  register: z.enum(["formal", "neutral", "casual", "intimate"]).default("neutral"),
  confidence: z.enum(["high", "medium"]),
  sources: z.array(SourceSchema).min(1),
  /** Other Roman spellings or wordings that mean the same thing. */
  accept: z.array(z.string()).optional(),
  /** Text sent to TTS when the display text would be read badly (single letters). */
  tts: z.string().optional(),
  /** Phrases sharing a sense ("greet", "bye", "thanks"…) are never used as each other's distractors. */
  sense: z.string().optional(),
  /** A memory hook shown when the phrase is taught. */
  hook: z.string().optional(),
  /** Character who typically says it (for avatars in exercises). */
  speaker: id.optional(),
});

const base = { note: z.string().optional() };

/** Show Urdu, pick the English meaning. Distractors are drawn from the unit unless given. */
const MeaningEx = z.strictObject({
  type: z.literal("meaning"),
  phrase: id,
  distractors: z.array(z.string()).min(2).optional(),
  ...base,
});

/** Situation or English prompt, pick the Urdu reply. */
const SayEx = z.strictObject({
  type: z.literal("say"),
  phrase: id,
  prompt: z.string().optional(),
  distractors: z.array(id).min(2).optional(),
  explain: z.string().optional(),
  ...base,
});

const McOption = z.strictObject({
  text: z.string().optional(),
  phrase: id.optional(),
  glyph: z.string().optional(),
  /** Shown if the learner picks this option. */
  feedback: z.string().optional(),
});

/** Fully custom multiple choice. */
const McEx = z.strictObject({
  type: z.literal("mc"),
  prompt: z.string(),
  /** Phrase displayed with the prompt. */
  show: id.optional(),
  /** Large Urdu glyph displayed with the prompt (reading track). */
  glyph: z.string().optional(),
  /** Phrase whose audio plays with the prompt. */
  audio: id.optional(),
  /** Reading track: show `show` in Urdu script only, so the Roman can't give the answer away. */
  urduOnly: z.boolean().optional(),
  options: z.array(McOption).min(2).max(5),
  answer: z.number().int().min(0),
  explain: z.string().optional(),
  ...base,
});

const MatchEx = z.strictObject({
  type: z.literal("match"),
  phrases: z.array(id).min(3).max(6),
  /** "meaning" pairs Urdu with English; "audio" pairs a sound with its text. */
  mode: z.enum(["meaning", "audio"]).default("meaning"),
  ...base,
});

const TypeEx = z.strictObject({
  type: z.literal("type"),
  phrase: id,
  prompt: z.string().optional(),
  accept: z.array(z.string()).optional(),
  reject: z.array(z.string()).optional(),
  ...base,
});

const ListenEx = z.strictObject({
  type: z.literal("listen"),
  phrase: id,
  speed: z.enum(["normal", "aunty"]).default("normal"),
  distractors: z.array(z.string()).min(2).optional(),
  ...base,
});

const BuildEx = z.strictObject({
  type: z.literal("build"),
  phrase: id,
  prompt: z.string().optional(),
  distractors: z.array(TokenPairSchema).optional(),
  ...base,
});

const RespectEx = z.strictObject({
  type: z.literal("respect"),
  situation: z.string(),
  listener: z.string(),
  options: z
    .array(
      z.strictObject({
        phrase: id,
        verdict: z.enum(["right", "ok", "wrong"]),
        feedback: z.string(),
      }),
    )
    .min(2)
    .max(4),
  ...base,
});

const GapEx = z.strictObject({
  type: z.literal("gap"),
  phrase: id,
  word: TokenPairSchema,
  distractors: z.array(TokenPairSchema).min(2).max(4),
  explain: z.string().optional(),
  ...base,
});

const SpeakEx = z.strictObject({ type: z.literal("speak"), phrase: id, ...base });

/** Reading track: trace a letter or word on a canvas. Scored loosely. */
const TraceEx = z.strictObject({
  type: z.literal("trace"),
  glyph: urduText,
  label: z.string(),
  ...base,
});

/**
 * Overhear a short exchange between characters, then answer a question about it. With `hideText`
 * the lines are only heard until the learner answers (pure listening).
 */
const SceneEx = z.strictObject({
  type: z.literal("scene"),
  setup: z.string().optional(),
  lines: z.array(z.strictObject({ speaker: id, phrase: id })).min(2).max(6),
  question: z.string(),
  options: z.array(z.strictObject({ text: z.string(), feedback: z.string().optional() })).min(2).max(4),
  answer: z.number().int().min(0),
  hideText: z.boolean().optional(),
  explain: z.string().optional(),
  ...base,
});

/** A sentence with one word swapped for a wrong one: tap the word that doesn't belong. */
const SpotEx = z.strictObject({
  type: z.literal("spot"),
  /** The correct sentence. */
  phrase: id,
  /** The right word, as it appears in the sentence. */
  word: TokenPairSchema,
  /** The wrong word shown in its place. */
  wrong: TokenPairSchema,
  prompt: z.string().optional(),
  explain: z.string(),
  ...base,
});

/** Sort words or phrases into two or three buckets (tu / tum / aap, masculine / feminine…). */
const SortEx = z.strictObject({
  type: z.literal("sort"),
  prompt: z.string(),
  buckets: z.array(z.string()).min(2).max(3),
  items: z
    .array(z.strictObject({ phrase: id.optional(), text: z.string().optional(), bucket: z.number().int().min(0) }))
    .min(4)
    .max(8),
  explain: z.string().optional(),
  ...base,
});

/** Hear it, type it. No text is shown until the answer is checked. */
const DictationEx = z.strictObject({
  type: z.literal("dictation"),
  phrase: id,
  speed: z.enum(["normal", "aunty"]).default("normal"),
  ...base,
});

export const ExerciseSchema = z.discriminatedUnion("type", [
  MeaningEx,
  SayEx,
  McEx,
  MatchEx,
  TypeEx,
  ListenEx,
  BuildEx,
  RespectEx,
  GapEx,
  SpeakEx,
  TraceEx,
  SceneEx,
  SpotEx,
  SortEx,
  DictationEx,
]);

export const TeachCardSchema = z.strictObject({
  phrase: id,
  /** A short tip, cultural note or joke shown with the phrase. */
  tip: z.string().optional(),
});

/** An explanation card with no phrase (grammar point, script rule). */
export const InfoCardSchema = z.strictObject({
  info: z.string(),
  title: z.string(),
  glyph: z.string().optional(),
  examples: z.array(id).optional(),
});

export const LessonSchema = z.strictObject({
  id,
  title: z.string(),
  blurb: z.string(),
  canDo: z.string(),
  teach: z.array(z.union([TeachCardSchema, InfoCardSchema])).min(1),
  exercises: z.array(ExerciseSchema).min(4),
});

const ConvoNpc = z.strictObject({
  type: z.literal("npc"),
  speaker: id,
  say: id,
  next: id,
});
const ConvoNarration = z.strictObject({ type: z.literal("narration"), text: z.string(), next: id });
const ConvoYou = z.strictObject({
  type: z.literal("you"),
  /** Stage direction in English: what you are trying to do. */
  prompt: z.string(),
  options: z
    .array(
      z.strictObject({
        phrase: id,
        next: id,
        /** Narrator aside shown after the choice. */
        reaction: z.string().optional(),
        quality: z.enum(["great", "fine", "bold"]).default("fine"),
      }),
    )
    .min(2)
    .max(4),
  hint: z.string().optional(),
});
const ConvoEnd = z.strictObject({
  type: z.literal("end"),
  title: z.string(),
  text: z.string(),
  outcome: id,
});

export const ConversationSchema = z.strictObject({
  id,
  title: z.string(),
  blurb: z.string(),
  character: id,
  scene: z.string(),
  canDo: z.string(),
  start: id,
  nodes: z.record(id, z.discriminatedUnion("type", [ConvoNpc, ConvoNarration, ConvoYou, ConvoEnd])),
});

export const UnitSchema = z.strictObject({
  id,
  track: z.enum(["speaking", "reading"]),
  /** "advanced" units sit in their own section after the core course. */
  stage: z.enum(["core", "advanced"]).default("core"),
  order: z.number().int().min(1),
  title: z.string(),
  titleUrdu: urduText.optional(),
  emoji: z.string(),
  tagline: z.string(),
  canDo: z.string(),
  grammar: z.array(z.strictObject({ title: z.string(), body: z.string() })).default([]),
  phrases: z.array(PhraseSchema),
  lessons: z.array(LessonSchema).min(1),
  boss: ConversationSchema.optional(),
});

export const CharacterSchema = z.strictObject({
  id,
  name: z.string(),
  nameUrdu: urduText,
  role: z.string(),
  bio: z.string(),
  emoji: z.string(),
  color: z.enum(["primary", "accent", "rose", "good"]),
});

export const PackSchema = z.strictObject({
  id,
  title: z.string(),
  emoji: z.string(),
  tagline: z.string(),
  canDo: z.string(),
  /** Lessons are built from these phrases, in order, a few at a time. */
  sessions: z
    .array(z.strictObject({ id, title: z.string(), blurb: z.string(), phrases: z.array(id).min(3).max(8) }))
    .min(3)
    .max(5),
});

export const PlacementQuestionSchema = z.strictObject({
  id,
  level: z.number().int().min(1).max(30),
  skill: z.enum(["listening", "reply", "register", "typing", "reading", "meaning"]),
  exercise: ExerciseSchema,
});

export const RelativeSchema = z.strictObject({
  id,
  phrase: id,
  side: z.enum(["maternal", "paternal", "you", "both"]),
  generation: z.number().int().min(-1).max(2),
  relation: z.string(),
  address: z.string(),
  note: z.string().optional(),
  emoji: z.string(),
});

export type Source = z.infer<typeof SourceSchema>;
export type TokenPair = z.infer<typeof TokenPairSchema>;
export type Phrase = z.infer<typeof PhraseSchema>;
export type Exercise = z.infer<typeof ExerciseSchema>;
export type TeachCard = z.infer<typeof TeachCardSchema>;
export type InfoCard = z.infer<typeof InfoCardSchema>;
export type Lesson = z.infer<typeof LessonSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;
export type ConvoNode = Conversation["nodes"][string];
export type Unit = z.infer<typeof UnitSchema>;
export type Character = z.infer<typeof CharacterSchema>;
export type Pack = z.infer<typeof PackSchema>;
export type PlacementQuestion = z.infer<typeof PlacementQuestionSchema>;
export type Relative = z.infer<typeof RelativeSchema>;
