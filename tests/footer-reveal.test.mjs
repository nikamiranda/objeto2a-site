import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(new URL("../src/home-redesign.css", import.meta.url), "utf8");

test("keeps the fixed footer covered until the closing contact section", () => {
  const aboutRule = css.match(/\.o2-about\s*\{[^}]+\}/)?.[0] ?? "";

  assert.match(aboutRule, /background:\s*var\(--o2-paper\)/);
  assert.match(css, /\.o2-footer\s*\{[^}]+opacity:\s*0/);
  assert.match(css, /\.o2-footer\.is-reveal-ready\s*\{[^}]+opacity:\s*1/);
});

test("gives the animated contact headline enough room for every glyph", () => {
  const headlineRule = css.match(/\.o2-contact__lead h2\s*\{[^}]+\}/)?.[0] ?? "";
  const lineRule = css.match(/\.o2-contact__line\s*\{[^}]+\}/)?.[0] ?? "";

  assert.match(headlineRule, /line-height:\s*1\.04/);
  assert.match(lineRule, /overflow:\s*clip/);
  assert.match(lineRule, /overflow-clip-margin:\s*\.12em/);
});
