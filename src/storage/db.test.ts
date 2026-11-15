import "fake-indexeddb/auto";
import { afterEach, describe, expect, test } from "vitest";
import { emptyProgress } from "@/engine/progress";
import {
  BackupError,
  clearAll,
  closeDb,
  deleteRecording,
  exportBackup,
  getRecording,
  importBackup,
  listRecordingIds,
  loadProgress,
  saveProgress,
  saveRecording,
} from "./db";

afterEach(async () => {
  await clearAll();
  await closeDb();
});

const rec = (phraseId: string, text = "audio-bytes") => ({
  phraseId,
  blob: new Blob([text], { type: "audio/webm" }),
  mime: "audio/webm",
  at: "2026-11-15T10:00:00.000Z",
  by: "Ammi",
});

describe("on-device storage", () => {
  test("progress round-trips and defaults to empty", async () => {
    expect(await loadProgress()).toEqual(emptyProgress);
    await saveProgress({ ...emptyProgress, xp: 42 });
    await closeDb();
    expect((await loadProgress()).xp).toBe(42);
  });

  test("old or partial documents are migrated on load", async () => {
    await saveProgress({ xp: 7 } as never);
    expect(await loadProgress()).toMatchObject({ xp: 7, lessons: {}, skipped: [] });
  });

  test("recordings can be saved, listed, replaced and deleted", async () => {
    await saveRecording(rec("u01.salam"));
    await saveRecording(rec("u01.shukriya"));
    await saveRecording(rec("u01.salam", "second take"));
    expect((await listRecordingIds()).sort()).toEqual(["u01.salam", "u01.shukriya"]);
    expect((await getRecording("u01.salam"))?.by).toBe("Ammi");
    await deleteRecording("u01.salam");
    expect(await getRecording("u01.salam")).toBeUndefined();
  });

  test("export then import restores progress and recordings on a clean device", async () => {
    await saveProgress({ ...emptyProgress, xp: 99, askedFamily: 3 });
    await saveRecording(rec("u01.salam", "ammi says salam"));
    const backup = JSON.parse(JSON.stringify(await exportBackup(new Date("2026-11-15T12:00:00Z"))));
    expect(backup).toMatchObject({ app: "lafz", version: 1, exportedAt: "2026-11-15T12:00:00.000Z" });
    expect(backup.recordings[0].data).toBe(btoa("ammi says salam"));

    await clearAll();
    expect(await listRecordingIds()).toEqual([]);
    const restored = await importBackup(backup);
    expect(restored).toMatchObject({ xp: 99, askedFamily: 3 });
    expect(await loadProgress()).toMatchObject({ xp: 99 });
    const r = await getRecording("u01.salam");
    expect(r).toMatchObject({ by: "Ammi", mime: "audio/webm" });
    expect(r?.blob).toBeDefined();
  });

  test("import rejects foreign files and tolerates missing recording fields", async () => {
    await expect(importBackup(null)).rejects.toThrow(BackupError);
    await expect(importBackup({ app: "duo" })).rejects.toThrow(BackupError);
    await saveProgress({ ...emptyProgress, xp: 5 });
    await expect(importBackup({ app: "lafz", version: 2, progress: {} })).rejects.toThrow(BackupError);
    expect((await loadProgress()).xp).toBe(5); // untouched after a rejected import
    await importBackup({
      app: "lafz",
      version: 1,
      progress: { xp: 1 },
      recordings: [{ phraseId: "a", data: btoa("x") }, { nope: true }, null],
    });
    expect(await listRecordingIds()).toEqual(["a"]);
    expect(await getRecording("a")).toMatchObject({ by: "Family", mime: "audio/webm" });
    await importBackup({ app: "lafz", version: 1, progress: { xp: 2 } });
    expect(await listRecordingIds()).toEqual([]);
  });
});
