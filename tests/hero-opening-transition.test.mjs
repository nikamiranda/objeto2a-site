import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const styles = fs.readFileSync(new URL("../src/home-redesign.css", import.meta.url), "utf8");

test("the hero dissolves into the opening section instead of ending on a hard edge", () => {
  const openingTransition = styles.match(/\.o2-opening \{[\s\S]*?@keyframes o2-opening-veil-in \{[\s\S]*?\n\}/)?.[0] ?? "";

  assert.match(openingTransition, /\.o2-opening::before/);
  assert.match(openingTransition, /linear-gradient\(180deg, transparent/);
  assert.match(openingTransition, /animation-timeline: view\(\)/);
  assert.match(openingTransition, /translateY\(34px\) scaleY\(\.72\)/);
});
