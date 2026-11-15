import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import { emptyProgress, migrate, type Progress } from "@/engine/progress";

/**
 * On-device storage. One IndexedDB database with two stores:
 *   kv         – the progress document (and room for future small documents)
 *   recordings – family-voice audio blobs keyed by phrase id
 * Nothing ever leaves the device unless the learner exports a backup file themselves.
 */

export interface Recording {
  phraseId: string;
  blob: Blob;
  mime: string;
  /** ISO timestamp. */
  at: string;
  /** Who recorded it, e.g. "Ammi". */
  by: string;
}

interface LafzDb extends DBSchema {
  kv: { key: string; value: unknown };
  recordings: { key: string; value: Recording };
}

const DB_NAME = "lafz";
const PROGRESS_KEY = "progress";

let dbPromise: Promise<IDBPDatabase<LafzDb>> | null = null;

export function db(): Promise<IDBPDatabase<LafzDb>> {
  dbPromise ??= openDB<LafzDb>(DB_NAME, 1, {
    upgrade(d) {
      d.createObjectStore("kv");
      d.createObjectStore("recordings", { keyPath: "phraseId" });
    },
  });
  return dbPromise;
}

/** Test hook: forget the cached connection. */
export async function closeDb(): Promise<void> {
  if (dbPromise) (await dbPromise).close();
  dbPromise = null;
}

export async function loadProgress(): Promise<Progress> {
  const raw = await (await db()).get("kv", PROGRESS_KEY);
  return raw === undefined ? emptyProgress : migrate(raw);
}

export async function saveProgress(p: Progress): Promise<void> {
  await (await db()).put("kv", p, PROGRESS_KEY);
}

export async function saveRecording(r: Recording): Promise<void> {
  await (await db()).put("recordings", r);
}

export async function getRecording(phraseId: string): Promise<Recording | undefined> {
  return (await db()).get("recordings", phraseId);
}

export async function deleteRecording(phraseId: string): Promise<void> {
  await (await db()).delete("recordings", phraseId);
}

export async function listRecordingIds(): Promise<string[]> {
  return (await db()).getAllKeys("recordings");
}

export async function clearAll(): Promise<void> {
  const d = await db();
  await d.clear("kv");
  await d.clear("recordings");
}

/** Backup file format. Recordings travel as base64 so the file is plain JSON. */
export interface Backup {
  app: "lafz";
  version: 1;
  exportedAt: string;
  progress: Progress;
  recordings: { phraseId: string; mime: string; at: string; by: string; data: string }[];
}

async function blobToBase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(s);
}

function base64ToBlob(data: string, mime: string): Blob {
  const bin = atob(data);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export async function exportBackup(now = new Date()): Promise<Backup> {
  const d = await db();
  const recs = await d.getAll("recordings");
  return {
    app: "lafz",
    version: 1,
    exportedAt: now.toISOString(),
    progress: await loadProgress(),
    recordings: await Promise.all(
      recs.map(async (r) => ({
        phraseId: r.phraseId,
        mime: r.mime,
        at: r.at,
        by: r.by,
        data: await blobToBase64(r.blob),
      })),
    ),
  };
}

export class BackupError extends Error {}

/** Replace everything on the device with the contents of a backup file. */
export async function importBackup(raw: unknown): Promise<Progress> {
  if (typeof raw !== "object" || raw === null) throw new BackupError("That file is not a Lafz backup.");
  const b = raw as Partial<Backup>;
  if (b.app !== "lafz" || b.version !== 1 || typeof b.progress !== "object") {
    throw new BackupError("That file is not a Lafz backup.");
  }
  const progress = migrate(b.progress);
  const recordings = Array.isArray(b.recordings) ? b.recordings : [];
  await clearAll();
  await saveProgress(progress);
  for (const r of recordings) {
    if (typeof r?.phraseId !== "string" || typeof r.data !== "string") continue;
    await saveRecording({
      phraseId: r.phraseId,
      mime: r.mime ?? "audio/webm",
      at: r.at ?? "",
      by: r.by ?? "Family",
      blob: base64ToBlob(r.data, r.mime ?? "audio/webm"),
    });
  }
  return progress;
}
