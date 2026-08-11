import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const styles = fs.readFileSync(new URL("../src/home-redesign.css", import.meta.url), "utf8");
const homePage = fs.readFileSync(new URL("../src/HomePage.jsx", import.meta.url), "utf8");

test("the hero hands the page to the opening through an interactive thread", () => {
  assert.doesNotMatch(styles, /o2-opening-veil-in/);
  assert.doesNotMatch(styles, /\.o2-opening::before/);
  assert.match(styles, /\.o2-opening__handoff-line \{[\s\S]*?stroke: var\(--o2-terracotta\)/);
  assert.match(homePage, /function HeroOpeningHandoff\(\)/);
  assert.match(homePage, /window\.addEventListener\("pointermove", updatePointer/);
  assert.match(homePage, /scrollTarget = Math\.min/);
  assert.match(homePage, /<HeroOpeningHandoff \/>/);
});

test("the handoff respects reduced motion", () => {
  assert.match(homePage, /prefers-reduced-motion: reduce/);
  assert.match(homePage, /if \(!reducedMotion\) frame = requestAnimationFrame\(draw\)/);
});
