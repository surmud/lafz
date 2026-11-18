import { expect, test, vi } from "vitest";
import { emptyProgress } from "@/engine/progress";
import { syncOnLogin, type Backend } from "./account";

function fake(remote: typeof emptyProgress | null): Backend & { pushed: unknown[] } {
  const pushed: unknown[] = [];
  return {
    pushed,
    getUser: vi.fn(async () => null),
    signIn: vi.fn(async () => undefined),
    signOut: vi.fn(async () => undefined),
    pull: vi.fn(async () => remote),
    push: vi.fn(async (_id, p) => void pushed.push(p)),
    deleteAccount: vi.fn(async () => undefined),
    onChange: () => () => undefined,
  };
}

test("first sign-in uploads this device's progress", async () => {
  const b = fake(null);
  const local = { ...emptyProgress, xp: 40 };
  expect(await syncOnLogin(b, "u1", local)).toBe(local);
  expect(b.pushed).toEqual([local]);
});

test("sign-in on a second device merges both copies and writes the merge back", async () => {
  const remote = { ...emptyProgress, xp: 200, lessons: { a: { first: "2026-11-01", last: "2026-11-01", times: 1 } } };
  const b = fake(remote);
  const local = { ...emptyProgress, xp: 50, lessons: { b: { first: "2026-11-02", last: "2026-11-02", times: 1 } } };
  const merged = await syncOnLogin(b, "u1", local);
  expect(merged.xp).toBe(200);
  expect(Object.keys(merged.lessons).sort()).toEqual(["a", "b"]);
  expect(b.pushed).toEqual([merged]);
});
