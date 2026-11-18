/** When the one-time "buy me a chai" card may appear: after ~5 finished lessons, never once dismissed. */
export const CHAI_AFTER_LESSONS = 5;

export function showChaiCard(opts: { enabled: boolean; lessonsDone: number; dismissed: boolean }): boolean {
  return opts.enabled && !opts.dismissed && opts.lessonsDone >= CHAI_AFTER_LESSONS;
}
