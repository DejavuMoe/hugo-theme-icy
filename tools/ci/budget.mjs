#!/usr/bin/env node
/**
 * Size budgets (Node.js standard library only).
 *
 *   node tools/ci/budget.mjs exampleSite/public
 *
 * Fails (exit code 1) when:
 *   - any built page links more CSS or JS than its budget (gzip, summed over
 *     the files the page loads up front; on-demand vendor scripts are listed
 *     but not counted);
 *   - a demo media file, or all of them together, exceeds the media budget
 *     (exampleSite/content and exampleSite/assets).
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const KB = 1024;
const MB = 1024 * KB;

export const BUDGET = {
  css: 24 * KB, // gzip, per page
  js: 16 * KB, // gzip, per page
  mediaFile: 1.5 * MB,
  mediaTotal: 15 * MB,
};

const MEDIA = /\.(avif|flac|gif|jpe?g|m4a|mp3|mp4|ogg|opus|png|svg|webm|webp)$/i;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const kb = (n) => `${(n / KB).toFixed(1)} KB`;
const mb = (n) => `${(n / MB).toFixed(2)} MB`;

function attr(tag, name) {
  return tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"))?.slice(1).find((v) => v !== undefined);
}

async function pageAssets(site) {
  const sizes = new Map();
  async function gz(url) {
    if (!sizes.has(url)) {
      const file = path.join(site, decodeURI(new URL(url, "https://site.invalid/").pathname));
      sizes.set(url, gzipSync(await fs.readFile(file)).length);
    }
    return sizes.get(url);
  }

  const pages = [];
  for (const file of (await walk(site)).filter((f) => f.endsWith(".html"))) {
    const html = await fs.readFile(file, "utf8");
    const rel = path.relative(site, file).split(path.sep).join("/");
    if (/<meta\s+http-equiv=["']?refresh/i.test(html)) continue; // alias redirects
    let css = 0;
    let js = 0;
    for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
      if (/\brel=["']?stylesheet/i.test(tag) && attr(tag, "href")?.startsWith("/")) css += await gz(attr(tag, "href"));
    }
    for (const tag of html.match(/<script\b[^>]*>/gi) ?? []) {
      const src = attr(tag, "src");
      if (src?.startsWith("/")) js += await gz(src);
    }
    const vendor = html.match(/<script\b[^>]*\bid=["']?icy-vendor["']?[^>]*>([\s\S]*?)<\/script>/i);
    let lazy = 0;
    if (vendor) {
      for (const list of Object.values(JSON.parse(vendor[1]))) {
        for (const { src } of list) lazy += await gz(src);
      }
    }
    pages.push({ rel, css, js, lazy });
  }
  return pages;
}

async function media() {
  const files = [];
  for (const dir of ["exampleSite/content", "exampleSite/assets"]) {
    for (const file of await walk(path.join(root, dir))) {
      if (MEDIA.test(file)) files.push({ rel: path.relative(root, file).split(path.sep).join("/"), size: (await fs.stat(file)).size });
    }
  }
  return files;
}

async function main() {
  const site = process.argv[2];
  if (!site) {
    console.error("Usage: node tools/ci/budget.mjs <public directory>");
    process.exit(2);
  }
  const errors = [];

  const pages = await pageAssets(path.resolve(site));
  for (const p of pages) {
    if (p.css > BUDGET.css) errors.push(`${p.rel}: CSS ${kb(p.css)} gzip > ${kb(BUDGET.css)}`);
    if (p.js > BUDGET.js) errors.push(`${p.rel}: JS ${kb(p.js)} gzip > ${kb(BUDGET.js)}`);
  }
  const top = (key) => pages.toSorted((a, b) => b[key] - a[key])[0];
  const css = top("css");
  const js = top("js");
  console.log(`${pages.length} pages. Largest up-front assets (gzip):`);
  console.log(`  CSS ${kb(css.css)} / ${kb(BUDGET.css)}  ${css.rel}`);
  console.log(`  JS  ${kb(js.js)} / ${kb(BUDGET.js)}  ${js.rel}`);
  const lazy = top("lazy");
  if (lazy.lazy) console.log(`  on demand ${kb(lazy.lazy)}  ${lazy.rel} (not counted)`);

  const files = await media();
  const total = files.reduce((sum, f) => sum + f.size, 0);
  for (const f of files) {
    if (f.size > BUDGET.mediaFile) errors.push(`${f.rel}: ${mb(f.size)} > ${mb(BUDGET.mediaFile)} per media file`);
  }
  if (total > BUDGET.mediaTotal) errors.push(`demo media: ${mb(total)} > ${mb(BUDGET.mediaTotal)} in total`);
  const largest = files.toSorted((a, b) => b.size - a.size)[0];
  console.log(`Demo media: ${files.length} files, ${mb(total)} / ${mb(BUDGET.mediaTotal)}; largest ${mb(largest?.size ?? 0)} / ${mb(BUDGET.mediaFile)} (${largest?.rel})`);

  if (errors.length) {
    console.error(`\nOver budget:\n  ${errors.join("\n  ")}`);
    process.exit(1);
  }
  console.log("OK: within budget");
}

await main();
