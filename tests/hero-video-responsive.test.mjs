import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const homePage = await readFile(new URL("../src/HomePage.jsx", import.meta.url), "utf8");
const css = await readFile(new URL("../src/home-redesign.css", import.meta.url), "utf8");

test("tablet and coarse-pointer devices use the autonomous hero video cycle", () => {
  assert.match(homePage, /matchMedia\("\(max-width: 1120px\), \(hover: none\), \(pointer: coarse\)"\)/);
  assert.match(homePage, /if \(!isVisible \|\| !autonomousQuery\.matches\) return/);
});

test("hero video reloads its responsive source when the viewport mode changes", () => {
  assert.match(homePage, /mobileSourceQuery = window\.matchMedia\("\(max-width: 720px\)"\)/);
  assert.match(homePage, /video\.load\(\)/);
  assert.match(homePage, /window\.addEventListener\("resize", syncViewport/);
  assert.match(homePage, /window\.addEventListener\("orientationchange", syncViewport\)/);
});

test("tablet media fills the hero and keeps its focal architecture in view", () => {
  assert.match(css, /@media \(min-width: 721px\) and \(max-width: 1120px\)[\s\S]*?aspect-ratio:\s*auto/);
  assert.match(css, /\.o2-hero__media \.o2-hero__video\s*\{[^}]*object-fit:\s*cover/);
});
