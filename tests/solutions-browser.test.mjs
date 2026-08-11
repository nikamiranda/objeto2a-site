import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const homePage = fs.readFileSync(new URL("../src/HomePage.jsx", import.meta.url), "utf8");
const homeStyles = fs.readFileSync(new URL("../src/home-redesign.css", import.meta.url), "utf8");

test("the first solution always uses the in-person group photo", () => {
  const servicesSource = homePage.match(/const services = \[([\s\S]*?)\n\];/)?.[1] ?? "";
  const firstService = servicesSource.split(/\n  \{/, 2)[1] ?? "";

  assert.match(firstService, /image: "\/case-redballoon-grupo\.png"/);
  assert.doesNotMatch(firstService, /case-redballoon-dia2\.jpg/);
  assert.doesNotMatch(firstService, /case-redballoon-reuniao/);
});

test("solution images remount when the active service changes", () => {
  assert.match(homePage, /<img\s+key=\{service\.image\}\s+data-cms-key=/);
});

test("the workshops solution uses the horizontal in-person group media", () => {
  const servicesSource = homePage.match(/const services = \[([\s\S]*?)\n\];/)?.[1] ?? "";
  const workshopService = servicesSource.match(/title: "Workshops & masterclasses",([\s\S]*?)\n  \}/)?.[1] ?? "";

  assert.match(workshopService, /image: "\/case-redballoon-grupo-horizontal\.jpg"/);
  assert.doesNotMatch(workshopService, /case-redballoon-katia\.png/);
});

test("solution media fills its shape and dissolves toward the copy", () => {
  const integratedMediaRules = homeStyles.match(/\/\* Reliable image change:[\s\S]*?\/\* A continuous living thread/)?.[0] ?? "";

  assert.match(integratedMediaRules, /\.o2-solution-browser__panel figure \{[\s\S]*?padding: 0 !important/);
  assert.match(integratedMediaRules, /\.o2-solution-browser__media::before \{[\s\S]*?linear-gradient\(90deg/);
  assert.match(integratedMediaRules, /object-fit: cover/);
  assert.match(integratedMediaRules, /linear-gradient\(180deg/);
});
