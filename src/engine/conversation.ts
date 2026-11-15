import type { Conversation, ConvoNode, Phrase } from "@/content/schema";
import { matchAnswer } from "./matcher";

/**
 * Scripted branching conversations ("boss fights"). A directed graph of turns: the NPC speaks,
 * the learner picks, types or speaks a reply, and different replies lead down different branches.
 * There is no failing. A reply that matches nothing just makes the character ask again, with a hint.
 *
 * `ConversationEngine` is the seam a future LLM tier plugs into: same inputs, same transcript.
 */

export interface TranscriptLine {
  who: "npc" | "you" | "narration";
  speaker?: string;
  phraseId?: string;
  text?: string;
  quality?: "great" | "fine" | "bold";
}

export interface ConvoState {
  nodeId: string;
  transcript: TranscriptLine[];
  /** Typed or spoken replies at the current node that matched nothing. */
  misses: number;
  totalMisses: number;
  turns: number;
  done: boolean;
  outcome: string | null;
}

export interface ConversationEngine {
  start(): ConvoState;
  current(state: ConvoState): ConvoNode;
  choose(state: ConvoState, optionIndex: number): ConvoState;
  reply(state: ConvoState, text: string): { state: ConvoState; matched: boolean };
}

export class ConvoError extends Error {}

function node(convo: Conversation, nodeId: string): ConvoNode {
  const n = convo.nodes[nodeId];
  if (!n) throw new ConvoError(`${convo.id}: missing node "${nodeId}"`);
  return n;
}

/** Walk forward through NPC lines and narration until the learner has to act or the scene ends. */
function settle(convo: Conversation, state: ConvoState): ConvoState {
  let s = state;
  for (let guard = 0; guard < 200; guard++) {
    const n = node(convo, s.nodeId);
    if (n.type === "npc") {
      s = { ...s, nodeId: n.next, transcript: [...s.transcript, { who: "npc", speaker: n.speaker, phraseId: n.say }] };
    } else if (n.type === "narration") {
      s = { ...s, nodeId: n.next, transcript: [...s.transcript, { who: "narration", text: n.text }] };
    } else if (n.type === "end") {
      return { ...s, done: true, outcome: n.outcome };
    } else {
      return s;
    }
  }
  throw new ConvoError(`${convo.id}: loop without a learner turn`);
}

export function createScriptedEngine(convo: Conversation, phrases: ReadonlyMap<string, Phrase>): ConversationEngine {
  const choose = (state: ConvoState, optionIndex: number): ConvoState => {
    const n = node(convo, state.nodeId);
    if (state.done || n.type !== "you") return state;
    const opt = n.options[optionIndex];
    if (!opt) return state;
    const transcript: TranscriptLine[] = [...state.transcript, { who: "you", phraseId: opt.phrase, quality: opt.quality }];
    if (opt.reaction) transcript.push({ who: "narration", text: opt.reaction });
    return settle(convo, { ...state, nodeId: opt.next, transcript, misses: 0, turns: state.turns + 1 });
  };

  return {
    start: () =>
      settle(convo, {
        nodeId: convo.start,
        transcript: [],
        misses: 0,
        totalMisses: 0,
        turns: 0,
        done: false,
        outcome: null,
      }),
    current: (state) => node(convo, state.nodeId),
    choose,
    reply: (state, text) => {
      const n = node(convo, state.nodeId);
      if (state.done || n.type !== "you") return { state, matched: false };
      let almost = -1;
      for (let i = 0; i < n.options.length; i++) {
        const p = phrases.get(n.options[i]?.phrase ?? "");
        if (!p) continue;
        const v = matchAnswer(text, p.roman, { accept: p.accept }).verdict;
        if (v === "correct") return { state: choose(state, i), matched: true };
        if (v === "almost" && almost < 0) almost = i;
      }
      if (almost >= 0) return { state: choose(state, almost), matched: true };
      return { state: { ...state, misses: state.misses + 1, totalMisses: state.totalMisses + 1 }, matched: false };
    },
  };
}

/** Structural problems in a conversation graph. Empty means it is sound. */
export function lintConversation(convo: Conversation, phraseIds: ReadonlySet<string>): string[] {
  const problems: string[] = [];
  const ids = Object.keys(convo.nodes);
  if (!convo.nodes[convo.start]) problems.push(`start node "${convo.start}" does not exist`);
  const edges = (n: ConvoNode): string[] =>
    n.type === "you" ? n.options.map((o) => o.next) : n.type === "end" ? [] : [n.next];

  for (const [nid, n] of Object.entries(convo.nodes)) {
    for (const next of edges(n)) {
      if (!convo.nodes[next]) problems.push(`${nid}: next node "${next}" does not exist`);
    }
    if (n.type === "npc" && !phraseIds.has(n.say)) problems.push(`${nid}: unknown phrase "${n.say}"`);
    if (n.type === "you") {
      for (const o of n.options) if (!phraseIds.has(o.phrase)) problems.push(`${nid}: unknown phrase "${o.phrase}"`);
      if (new Set(n.options.map((o) => o.phrase)).size !== n.options.length) {
        problems.push(`${nid}: duplicate reply options`);
      }
    }
  }
  if (problems.length > 0) return problems;

  // Reachability, and every reachable node must be able to reach an end.
  const reach = new Set<string>();
  const stack = [convo.start];
  while (stack.length > 0) {
    const cur = stack.pop() as string;
    if (reach.has(cur)) continue;
    reach.add(cur);
    const n = convo.nodes[cur];
    if (n) stack.push(...edges(n));
  }
  for (const nid of ids) if (!reach.has(nid)) problems.push(`${nid}: unreachable`);

  const canEnd = new Set(ids.filter((i) => convo.nodes[i]?.type === "end"));
  if (canEnd.size === 0) problems.push("no end node");
  for (let changed = true; changed; ) {
    changed = false;
    for (const nid of ids) {
      const n = convo.nodes[nid];
      if (!n || canEnd.has(nid)) continue;
      if (edges(n).some((e) => canEnd.has(e))) {
        canEnd.add(nid);
        changed = true;
      }
    }
  }
  for (const nid of reach) if (!canEnd.has(nid)) problems.push(`${nid}: cannot reach an ending`);

  // An NPC/narration-only cycle would never give the learner a turn.
  for (const nid of reach) {
    let cur = nid;
    const seen = new Set<string>();
    while (true) {
      const n = convo.nodes[cur];
      if (!n || n.type === "you" || n.type === "end") break;
      if (seen.has(cur)) {
        problems.push(`${nid}: loop without a learner turn`);
        break;
      }
      seen.add(cur);
      cur = n.next;
    }
  }
  return problems;
}
