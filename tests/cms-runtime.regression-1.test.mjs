import assert from "node:assert/strict";
import test from "node:test";

import { createCmsElementId, resolveCmsPatchId } from "../src/cmsRuntime.js";

// Regression: ISSUE-001 — imagens de abas diferentes compartilhavam o mesmo alvo numérico
// Found by /qa on 2026-07-30
// Report: .gstack/qa-reports/qa-report-localhost-2026-07-30.md
test("creates stable and distinct IDs for each solution image", () => {
  const programs = createCmsElementId({
    path: "/",
    scope: "solucoes",
    kind: "img",
    key: "solution-1-image",
  });
  const mentorship = createCmsElementId({
    path: "/",
    scope: "solucoes",
    kind: "img",
    key: "solution-2-image",
  });

  assert.equal(programs, "/:v2:solucoes:img:solution-1-image");
  assert.equal(
    createCmsElementId({ path: "/", scope: "solucoes", kind: "img", key: "solution-1-image" }),
    programs,
  );
  assert.notEqual(mentorship, programs);
  assert.notEqual(programs, "/:media:8");
});

test("keeps the same semantic media key synchronized across responsive copies", () => {
  const desktop = createCmsElementId({
    path: "/",
    scope: "metodo",
    kind: "img",
    key: "method-01-image",
  });
  const mobile = createCmsElementId({
    path: "/",
    scope: "metodo",
    kind: "img",
    key: "method-01-image",
  });

  assert.equal(desktop, mobile);
});

test("migrates the two published legacy photos to their intended semantic targets", () => {
  assert.equal(resolveCmsPatchId("/", "/:media:6"), "/:v2:metodo:img:method-03-image");
  assert.equal(resolveCmsPatchId("/", "/:media:7"), "/:v2:solucoes:img:solution-1-image");
  assert.equal(resolveCmsPatchId("/", "/:text:3"), "/:text:3");
});
