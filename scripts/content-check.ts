/**
 * Content linter (npm run content:check). Fails CI when content is invalid:
 *  - every unit, pack, character, relative and placement file matches the Zod schema
 *  - phrase ids are unique and every exercise, teach card and conversation references real phrases
 *  - every phrase has Nastaliq, sources and audio (audio is required once the manifest exists)
 *  - every exercise resolves (gap words exist in the sentence, answers are in range…)
 *  - conversation graphs are sound (reachable, can end, no learner-less loops)
 */
import { lintContent } from "../src/content/lint";

const { problems, summary } = lintContent(process.cwd());
console.log(summary);
if (problems.length > 0) {
  console.error(`\n${problems.length} content problem(s):`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  process.exit(1);
}
console.log("content:check ✓");
