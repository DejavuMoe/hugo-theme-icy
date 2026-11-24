#!/usr/bin/env node
/**
 * Print the Lighthouse scores (median run per page) as a Markdown table, and
 * add it to the GitHub Actions job summary when there is one.
 */
import { appendFileSync, readFileSync } from "node:fs";
import process from "node:process";

const manifest = JSON.parse(readFileSync(new URL("lighthouse/manifest.json", import.meta.url), "utf8"));
const categories = ["performance", "accessibility", "best-practices", "seo"];
const score = (value) => (value == null ? "–" : Math.round(value * 100));

const rows = manifest
  .filter((run) => run.isRepresentativeRun)
  .map((run) => `| ${new URL(run.url).pathname} | ${categories.map((c) => score(run.summary[c])).join(" | ")} |`);

const table = [
  "### Lighthouse (mobile, median of 3 runs)",
  "",
  `| Page | ${categories.map((c) => c.replace("-", " ")).join(" | ")} |`,
  `| --- | ${categories.map(() => "---:").join(" | ")} |`,
  ...rows,
  "",
].join("\n");

console.log(table);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${table}\n`);
