import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(new URL("../src/home-redesign.css", import.meta.url), "utf8");
const homePage = await readFile(new URL("../src/HomePage.jsx", import.meta.url), "utf8");

test("keeps the fixed footer covered until the closing contact section", () => {
  const aboutRule = css.match(/\.o2-about\s*\{[^}]+\}/)?.[0] ?? "";

  assert.match(aboutRule, /background:\s*var\(--o2-paper\)/);
  assert.match(css, /\.o2-footer\s*\{[^}]+opacity:\s*0/);
  assert.match(css, /\.o2-footer\.is-reveal-ready\s*\{[^}]+opacity:\s*1/);
});

test("keeps the complete institutional footer in the homepage", () => {
  const footerRule = css.match(/\.o2-footer\s*\{[^}]+\}/)?.[0] ?? "";

  assert.match(homePage, /function SiteFooter/);
  assert.match(homePage, /Psicanálise aplicada à leitura do que move pessoas, relações e trabalho\./);
  assert.match(homePage, /Navegação/);
  assert.match(homePage, /Acompanhe/);
  assert.match(homePage, /Todos os direitos reservados\./);
  assert.match(homePage, /Rio de Janeiro · Brasil/);
  assert.match(homePage, /if \(!entry\.isIntersecting\) return;[\s\S]+setContactVisible\(true\);[\s\S]+observer\.disconnect\(\);/);
  assert.match(footerRule, /grid-template-rows:\s*minmax\(0, 1fr\) auto/);
  assert.match(footerRule, /row-gap:\s*24px/);
  assert.doesNotMatch(footerRule, /[;{]\s*gap:\s*clamp\(48px, 7vw, 120px\)/);
});

test("gives the animated contact headline enough room for every glyph", () => {
  const headlineRule = css.match(/\.o2-contact__lead h2\s*\{[^}]+\}/)?.[0] ?? "";
  const lineRule = css.match(/\.o2-contact__line\s*\{[^}]+\}/)?.[0] ?? "";

  assert.match(headlineRule, /line-height:\s*1\.04/);
  assert.match(lineRule, /overflow:\s*clip/);
  assert.match(lineRule, /overflow-clip-margin:\s*\.12em/);
});
