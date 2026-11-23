import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The dumbest thing my agent did today: it ran `ls` on an empty folder,
// got flagged by its own safety check for it, and spent the rest of the
// day apologizing to the folder. Original writing, 131 Unicode code
// points, well within the 1-200 cap.
const TEXT =
  "My agent ran `ls` on an empty folder, got flagged by its own safety " +
  "check, and spent the rest of the day apologizing to the folder.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Gate: the entry must be 1-200 Unicode code points and not only whitespace.
// Counted as code points ([...TEXT]), not UTF-16 code units, per the rules.
function assertValidEntry(text: string): number {
  const codePoints = [...text].length;
  if (codePoints < 1 || codePoints > 200 || text.trim() === "") {
    throw new Error(`entry text is ${codePoints} code points; must be 1-200 and non-blank`);
  }
  return codePoints;
}

const codePoints = assertValidEntry(TEXT);

// Sanity: the length check above already ran, so reaching this line means
// the entry is valid. codePoints is kept for the record, not printed:
// the program writes only entry.txt and nothing else, so both runs are
// byte-identical by construction.
void codePoints;

// Output: the grader reads /output/entry.txt (or $MAKEFUN_OUTPUT_DIR when set).
// Create the directory first, tolerating a pre-existing path, then write
// the entry as UTF-8. The written text is byte-identical to TEXT above.
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), TEXT, { encoding: "utf8", flag: "w" });
