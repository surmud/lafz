import { describe, expect, test } from "vitest";
import type { Conversation } from "@/content/schema";
import { ConvoError, createScriptedEngine, lintConversation } from "./conversation";
import { CONVO, PHRASE_MAP } from "./fixtures";

const ids = new Set(PHRASE_MAP.keys());

describe("scripted conversation engine", () => {
  const engine = createScriptedEngine(CONVO, PHRASE_MAP);

  test("starts by playing NPC lines up to the learner's turn", () => {
    const s = engine.start();
    expect(s.nodeId).toBe("n2");
    expect(s.transcript).toEqual([{ who: "npc", speaker: "khala", phraseId: "t.salam" }]);
    expect(engine.current(s).type).toBe("you");
  });

  test("choosing follows the branch, with narration and reactions in the transcript", () => {
    let s = engine.choose(engine.start(), 0);
    expect(s.nodeId).toBe("n5");
    expect(s.transcript.map((l) => l.who)).toEqual(["npc", "you", "narration", "npc"]);
    s = engine.choose(s, 1);
    expect(s).toMatchObject({ done: true, outcome: "good", turns: 2 });
    expect(engine.choose(s, 0)).toBe(s);
  });

  test("a different reply leads to a different ending", () => {
    const s = engine.choose(engine.start(), 1);
    expect(s).toMatchObject({ done: true, outcome: "rude" });
    expect(s.transcript.at(-1)).toEqual({ who: "narration", text: "You hung up on Khala. Bold." });
  });

  test("typed replies are matched forgivingly", () => {
    const { state, matched } = engine.reply(engine.start(), "walekum salam");
    expect(matched).toBe(true);
    expect(state.nodeId).toBe("n5");
    expect(engine.reply(engine.start(), "allah hafiz").state.outcome).toBe("rude");
    expect(engine.reply(engine.start(), "walaikm assalam").matched).toBe(true); // typo → almost
  });

  test("no failing: an unmatched reply just counts a miss and stays put", () => {
    let { state, matched } = engine.reply(engine.start(), "pizza please");
    expect(matched).toBe(false);
    expect(state).toMatchObject({ nodeId: "n2", misses: 1, totalMisses: 1, done: false });
    ({ state } = engine.reply(state, "???"));
    expect(state.misses).toBe(2);
    state = engine.choose(state, 0);
    expect(state).toMatchObject({ misses: 0, totalMisses: 2 });
  });

  test("out-of-range choices and replies after the end are ignored", () => {
    const s = engine.start();
    expect(engine.choose(s, 9)).toBe(s);
    const end = engine.choose(s, 1);
    expect(engine.reply(end, "x")).toEqual({ state: end, matched: false });
  });

  test("broken graphs throw clearly", () => {
    const broken: Conversation = { ...CONVO, start: "zzz" };
    expect(() => createScriptedEngine(broken, PHRASE_MAP).start()).toThrow(ConvoError);
    const loop: Conversation = {
      ...CONVO,
      start: "a",
      nodes: { a: { type: "narration", text: "x", next: "b" }, b: { type: "narration", text: "y", next: "a" } },
    };
    expect(() => createScriptedEngine(loop, PHRASE_MAP).start()).toThrow(/loop/);
  });
});

describe("lintConversation", () => {
  test("a sound conversation has no problems", () => {
    expect(lintConversation(CONVO, ids)).toEqual([]);
  });
  test("finds missing nodes, unknown phrases and duplicates", () => {
    const bad: Conversation = {
      ...CONVO,
      start: "nope",
      nodes: {
        ...CONVO.nodes,
        n1: { type: "npc", speaker: "khala", say: "t.missing", next: "gone" },
        n5: {
          type: "you",
          prompt: "",
          options: [
            { phrase: "t.theek", next: "good", quality: "fine" },
            { phrase: "t.theek", next: "good", quality: "fine" },
            { phrase: "t.unknown", next: "good", quality: "fine" },
          ],
        },
      },
    };
    const problems = lintConversation(bad, ids).join("\n");
    expect(problems).toMatch(/start node "nope"/);
    expect(problems).toMatch(/n1: next node "gone"/);
    expect(problems).toMatch(/n1: unknown phrase "t.missing"/);
    expect(problems).toMatch(/n5: unknown phrase "t.unknown"/);
    expect(problems).toMatch(/n5: duplicate reply options/);
  });
  test("finds unreachable nodes, dead ends and learner-less loops", () => {
    const bad: Conversation = {
      ...CONVO,
      nodes: {
        ...CONVO.nodes,
        orphan: { type: "narration", text: "nobody comes here", next: "good" },
        n3: { type: "narration", text: "loop", next: "trap" },
        trap: { type: "narration", text: "loop", next: "n3" },
      },
    };
    const problems = lintConversation(bad, ids).join("\n");
    expect(problems).toMatch(/orphan: unreachable/);
    expect(problems).toMatch(/trap: cannot reach an ending/);
    expect(problems).toMatch(/loop without a learner turn/);
    const noEnd: Conversation = {
      ...CONVO,
      nodes: { n1: { type: "npc", speaker: "khala", say: "t.salam", next: "n1" } },
      start: "n1",
    };
    expect(lintConversation(noEnd, ids).join("\n")).toMatch(/no end node/);
  });
});
