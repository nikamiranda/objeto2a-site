import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(new URL("../src/home-redesign.css", import.meta.url), "utf8");

test("lets the expanded mobile navigation escape the header capsule", () => {
  const openHeaderRule = css.match(/\.o2-header\.is-menu-open\s*\{[^}]+\}/)?.[0] ?? "";

  assert.match(openHeaderRule, /overflow:\s*visible/);
});
