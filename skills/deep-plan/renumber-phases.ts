#!/usr/bin/env bun
/**
 * renumber-phases — make room for a new phase by shifting every later one.
 *
 * Usage: bun renumber-phases.ts <repo-root> --from <N> [--by 1] [--plans docs/plans]
 *          [--exclude "ToolExec|toolexec"] [--skip docs/plans/phase-03-new.md,docs/DESIGN.md] [--apply]
 *
 * Shifts phases numbered >= N by --by (default 1):
 *   - renames <plans>/phase-NN-*.md files (highest first, so nothing collides)
 *   - rewrites `phase-NN-` in links (except inside URLs of the excluded upstream project)
 *   - fixes bare-number link text like `[5](./phase-06-…)` so it matches the new file number
 *   - rewrites prose "Phase N", "phases N–M", unless the 25 chars before it match --exclude
 *     (references to ANOTHER project's phase numbers, e.g. "ToolExec's phase 18")
 * Files in --skip (e.g. the newly written phase, already numbered correctly) are left alone.
 * Dry run by default: prints what would change and every excluded match. Re-run with --apply.
 * After applying, grep for bare ranges like "(5–8)" and diagrams — those carry no "phase" word.
 */
import { Glob } from "bun";
import { readFileSync, renameSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const root = args[0] ?? ".";
const flag = (name: string, fallback: string) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1]! : fallback;
};
const from = Number(flag("--from", "NaN"));
const by = Number(flag("--by", "1"));
const plans = flag("--plans", "docs/plans");
const exclude = new RegExp(flag("--exclude", "(?!)"));
const skip = new Set(flag("--skip", "").split(",").filter(Boolean));
const apply = args.includes("--apply");
if (!Number.isInteger(from)) throw new Error("--from <N> is required");

const shift = (n: number) => (n >= from ? n + by : n);
const pad = (n: number) => String(n).padStart(2, "0");

// 1. rename files, highest number first
const phaseFiles = Array.from(new Glob(`${plans}/phase-*.md`).scanSync(root))
  .filter((f) => !skip.has(f))
  .map((f) => ({ f, n: Number(/phase-(\d+)-/.exec(f)![1]) }))
  .filter(({ n }) => n >= from)
  .sort((a, b) => b.n - a.n);
for (const { f, n } of phaseFiles) {
  const to = f.replace(/phase-\d+-/, `phase-${pad(shift(n))}-`);
  console.log(`rename ${f} -> ${to}`);
  if (apply) renameSync(`${root}/${f}`, `${root}/${to}`);
}

// 2. rewrite references
const docs = ["AGENTS.md", "CLAUDE.md", "README.md", ...Array.from(new Glob("docs/**/*.md").scanSync(root))].filter(
  (f) => !skip.has(f) && !skip.has(f.replace(/phase-(\d+)-/, (_m, d) => `phase-${pad(shift(Number(d)) - by)}-`)),
);
for (const f of docs) {
  let text: string;
  try {
    text = readFileSync(`${root}/${f}`, "utf8");
  } catch {
    continue;
  }
  const before = text;
  text = text.replace(/(?<!\/blob\/[^/\s]+\/[^\s)]*)phase-(\d\d)-/g, (_m, d) => `phase-${pad(shift(Number(d)))}-`);
  text = text.replace(/\[(\d+)\]\(((?:\.\.?\/)?(?:[\w-]+\/)*)phase-(\d\d)-/g, (m, n, pre, d) =>
    Number(n) === Number(d) - by && Number(n) >= from ? `[${Number(d)}](${pre}phase-${d}-` : m,
  );
  text = text.replace(/([Pp]hases? )(\d+)(?:([–-])(\d+))?/g, (m, word, a, dash, b, offset, s) => {
    const context = s.slice(Math.max(0, offset - 25), offset);
    if (exclude.test(context)) {
      if (Number(a) >= from) console.log(`excluded ${f}: …${context.replace(/\n/g, " ")}[${m}]`);
      return m;
    }
    return `${word}${shift(Number(a))}${dash ? dash + shift(Number(b)) : ""}`;
  });
  if (text !== before) {
    console.log(`rewrite ${f}`);
    if (apply) writeFileSync(`${root}/${f}`, text);
  }
}
if (!apply) console.log("dry run — re-run with --apply");
