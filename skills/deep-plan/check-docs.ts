#!/usr/bin/env bun
/**
 * check-docs — mechanical checks for a docs/plans tree.
 *
 * Usage: bun check-docs.ts <repo-root> [--plans docs/plans] [--require "## Scope,## Steps"]
 *
 * 1. Every relative markdown link in AGENTS.md, CLAUDE.md, README.md, and docs/** resolves to a file,
 *    and every #anchor resolves to a heading (GitHub slug rules).
 * 2. Every phase doc (<plans>/phase-*.md) contains each required heading/marker.
 * Exits 1 with one line per problem.
 */
import { Glob } from "bun";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";

const args = process.argv.slice(2);
const root = args[0] ?? ".";
const flag = (name: string, fallback: string) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1]! : fallback;
};
const plansDir = flag("--plans", "docs/plans");
const required = flag(
  "--require",
  "> **Goal:**,## Scope,## Steps,## Verification,## Definition of done,## Learnings from the build",
).split(",").map((s) => s.trim()).filter(Boolean);

const files = [
  ...["AGENTS.md", "CLAUDE.md", "README.md"].filter((f) => existsSync(resolve(root, f))),
  ...Array.from(new Glob("docs/**/*.md").scanSync(root)),
];

/** GitHub-style heading slug: lowercase, drop punctuation except - and _, spaces to -. */
const slug = (h: string) =>
  h.trim().toLowerCase().replace(/[`*~]/g, "").replace(/[^\p{L}\p{N}\s_-]/gu, "").replace(/\s/g, "-");

/** All anchors a markdown file exposes, with GitHub's -1, -2 suffixes for duplicates. */
const anchors = (path: string) => {
  const out = new Set<string>();
  const seen = new Map<string, number>();
  let inCode = false;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    if (line.startsWith("```")) inCode = !inCode;
    if (inCode) continue;
    const m = /^#{1,6}\s+(.*)$/.exec(line);
    if (!m) continue;
    const base = slug(m[1]!);
    const n = seen.get(base) ?? 0;
    out.add(n ? `${base}-${n}` : base);
    seen.set(base, n + 1);
  }
  return out;
};

let problems = 0;
const report = (msg: string) => {
  console.log(msg);
  problems++;
};

for (const f of files) {
  const abs = resolve(root, f);
  let inCode = false;
  readFileSync(abs, "utf8").split("\n").forEach((line, i) => {
    if (line.startsWith("```")) inCode = !inCode;
    if (inCode) return;
    for (const m of line.matchAll(/\]\(([^)\s]+)\)/g)) {
      const target = m[1]!;
      if (/^(https?:|mailto:)/.test(target)) continue;
      const [path, anchor] = target.split("#");
      const resolved = path ? resolve(dirname(abs), path) : abs;
      if (!existsSync(resolved)) {
        report(`${f}:${i + 1} missing ${target}`);
        continue;
      }
      if (anchor && statSync(resolved).isFile() && resolved.endsWith(".md") && !anchors(resolved).has(anchor))
        report(`${f}:${i + 1} bad anchor ${target}`);
    }
  });
}

for (const f of files.filter((f) => f.startsWith(`${plansDir}/phase-`))) {
  const text = readFileSync(resolve(root, f), "utf8");
  for (const h of required) if (!text.includes(h)) report(`${f} lacks "${h}"`);
}

console.log(problems ? `${problems} problems` : `all good (${files.length} files)`);
process.exit(problems ? 1 : 0);
