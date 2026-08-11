import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(new URL("../src/home-redesign.css", import.meta.url), "utf8");

test("tablet hero keeps the desktop full-bleed composition without letterboxing", () => {
  const tabletRules = css.match(/@media \(max-width: 1120px\) \{[\s\S]*?@media \(max-width: 860px\)/)?.[0] ?? "";

  assert.match(tabletRules, /\.o2-hero__inner\s*\{[^}]*display:\s*block/);
  assert.match(css, /@media \(min-width: 721px\) and \(max-width: 1120px\)[\s\S]*?\.o2-hero\s*\{[^}]*min-height:\s*max\(100svh,\s*760px\)/);
  assert.match(css, /@media \(min-width: 721px\) and \(max-width: 1120px\)[\s\S]*?\.o2-hero__media\s*\{[^}]*position:\s*absolute/);
  assert.match(css, /@media \(min-width: 721px\) and \(max-width: 1120px\)[\s\S]*?\.o2-hero__media\s*\{[^}]*aspect-ratio:\s*auto/);
  assert.match(css, /\.o2-hero__media \.o2-hero__video\s*\{[^}]*object-fit:\s*cover/);
  assert.match(css, /\.o2-hero__media \.o2-hero__video\s*\{[^}]*object-position:\s*right center/);
});
