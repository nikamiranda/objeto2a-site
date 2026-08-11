import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const homePage = await readFile(new URL("../src/HomePage.jsx", import.meta.url), "utf8");
const homeStyles = await readFile(new URL("../src/home-redesign.css", import.meta.url), "utf8");

test("solution changes keep the outgoing image visible while the next image enters", () => {
  const selectionHandler = homePage.match(/function selectService\(index\) \{[\s\S]*?\n  \}/)?.[0] ?? "";

  assert.match(selectionHandler, /setPreviousService\(activeService\)/);
  assert.match(selectionHandler, /setActiveService\(index\)/);
  assert.doesNotMatch(selectionHandler, /servicePhase !== "idle"/);
  assert.match(homePage, /className="is-outgoing"/);
  assert.match(homePage, /className=\{outgoingService \? "is-incoming" : "is-current"\}/);
});

test("solution media uses a contextual crossfade instead of an opaque cover", () => {
  const editorialBrowser = homeStyles.split("/* Solutions browser: an editorial index")[1] ?? "";

  assert.match(editorialBrowser, /\.o2-solution-browser__panel \.o2-solution-browser__media::after \{ content: none; \}/);
  assert.match(editorialBrowser, /@keyframes o2-solution-image-in/);
  assert.match(editorialBrowser, /@keyframes o2-solution-image-out/);
  assert.match(editorialBrowser, /@media \(prefers-reduced-motion: reduce\)/);
});
