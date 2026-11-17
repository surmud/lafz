import { expect, test } from "@playwright/test";
import { freshStart, shooter } from "./helpers";

// Headless Chromium can't open a (fake) microphone here, so the recording is written straight into
// IndexedDB the way the recorder saves it. This covers what matters: family audio wins over TTS.
test("family voice: a stored recording replaces TTS in lessons", async ({ page }, info) => {
  test.skip(info.project.name !== "pixel");
  const shot = shooter(page, "family-voice", info.project.name);
  await freshStart(page);
  await page.goto("./family/");
  await page.getByRole("link", { name: /Family voice/ }).click();
  await page.getByRole("link", { name: /Greetings/ }).click();
  await expect(page.getByRole("button", { name: "Record assalam-o-alaikum" })).toBeVisible();
  await shot("recorder");
  await page.evaluate(async () => {
    // A real, playable clip: borrow the TTS file and store it as if Nani recorded it.
    const res = await fetch("/lafz/offline/u01.json");
    const url = ((await res.json()).audio as string[])[0]!;
    const blob = await (await fetch(url)).blob();
    await new Promise<void>((resolve, reject) => {
      const open = indexedDB.open("lafz", 1);
      open.onsuccess = () => {
        const tx = open.result.transaction("recordings", "readwrite");
        tx.objectStore("recordings").put({ phraseId: "u01.salam", blob, mime: "audio/mpeg", at: new Date().toISOString(), by: "Nani" });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      };
      open.onerror = () => reject(open.error);
    });
  });
  await page.reload();
  await expect(page.getByRole("button", { name: /Play the family recording of assalam-o-alaikum/ })).toBeVisible();
  await shot("recorded");
  await page.goto("./lesson/u01-l1/");
  const play = page.getByRole("button", { name: /assalam-o-alaikum/ }).first();
  await play.click();
  await expect(play).toHaveAttribute("data-source", "family", { timeout: 10_000 });
  await shot("lesson-family-audio");
});
