#!/usr/bin/env node
/**
 * Translation keys (Node.js standard library only).
 *
 *   node tools/ci/i18n.mjs
 *
 * Every file in i18n/ must define the same keys as i18n/en.toml. A plural
 * table ([key] with one/other…) counts as one key, since languages have
 * different plural forms. Fails (exit code 1) on a missing or extra key.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../i18n");

function keys(source) {
  const found = new Set();
  let table = null;
  for (const raw of source.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const header = line.match(/^\[([^\]]+)\]$/);
    if (header) {
      table = header[1].trim();
      found.add(table);
      continue;
    }
    const key = line.match(/^([A-Za-z0-9_-]+)\s*=/);
    if (key && table === null) found.add(key[1]);
  }
  return found;
}

const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".toml")).sort();
const base = keys(await fs.readFile(path.join(dir, "en.toml"), "utf8"));
const errors = [];
for (const file of files.filter((f) => f !== "en.toml")) {
  const other = keys(await fs.readFile(path.join(dir, file), "utf8"));
  for (const k of base) if (!other.has(k)) errors.push(`${file}: missing "${k}"`);
  for (const k of other) if (!base.has(k)) errors.push(`${file}: "${k}" is not in en.toml`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`OK: ${files.length} languages, ${base.size} keys each`);
