import assert from "node:assert/strict";
import test from "node:test";

import { getActiveChapter, getPageProgress, isHeaderOverLightSection } from "../src/interactionState.js";

// Regression: FINDING-014 — long pages had no persistent wayfinding state.
// Found by /design-review on 2026-08-05.
test("clamps page progress at both scroll boundaries", () => {
  assert.equal(getPageProgress(-120, 900, 4000), 0);
  assert.equal(getPageProgress(1550, 900, 4000), 0.5);
  assert.equal(getPageProgress(5000, 900, 4000), 1);
});

test("selects the latest chapter crossed by the viewport marker", () => {
  const chapters = [
    { id: "inicio", top: 0 },
    { id: "abertura", top: 850 },
    { id: "solucoes", top: 1700 },
  ];

  assert.equal(getActiveChapter(chapters, 400), "inicio");
  assert.equal(getActiveChapter(chapters, 1200), "abertura");
  assert.equal(getActiveChapter(chapters, 2400), "solucoes");
});

test("falls back safely when chapter offsets are unavailable", () => {
  assert.equal(getActiveChapter([], 500), "inicio");
});

test("keeps the header transparent until the light section reaches it", () => {
  assert.equal(isHeaderOverLightSection(820, 108), false);
  assert.equal(isHeaderOverLightSection(109, 108), false);
  assert.equal(isHeaderOverLightSection(108, 108), true);
  assert.equal(isHeaderOverLightSection(72, 108), true);
});
