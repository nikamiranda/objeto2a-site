import { list, put } from "@vercel/blob";

export const EMPTY_CONTENT = { patches: {}, order: [], seo: {} };

export function pageSlug(path) {
  return path === "/" ? "home" : String(path).replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9-]/gi, "-");
}

export function validPagePath(value) {
  const path = String(value || "/").trim();
  return ["/", "/metodo", "/solucoes", "/trabalhos", "/sobre", "/artigos"].includes(path) ? path : null;
}

export async function readJson(pathname, fallback = null) {
  const result = await list({ prefix: pathname, limit: 1 });
  const exact = result.blobs.find((blob) => blob.pathname === pathname);
  if (!exact) return fallback;
  const response = await fetch(exact.url, { cache: "no-store" });
  if (!response.ok) return fallback;
  return response.json();
}

export async function writeJson(pathname, value) {
  return put(pathname, JSON.stringify(value), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });
}

export function normalizeContent(value) {
  const input = value && typeof value === "object" ? value : {};
  const output = {
    patches: {},
    order: Array.isArray(input.order) ? input.order.map(String).slice(0, 100) : [],
    seo: {
      title: String(input.seo?.title || "").slice(0, 120),
      description: String(input.seo?.description || "").slice(0, 320),
      image: String(input.seo?.image || "").slice(0, 1000),
    },
  };
  for (const [id, patch] of Object.entries(input.patches || {}).slice(0, 1000)) {
    if (!patch || typeof patch !== "object") continue;
    const safe = {};
    if (patch.text !== undefined) safe.text = String(patch.text).slice(0, 10000);
    if (patch.src !== undefined) safe.src = String(patch.src).slice(0, 2000);
    if (patch.alt !== undefined) safe.alt = String(patch.alt).slice(0, 500);
    if (patch.styles && typeof patch.styles === "object") {
      safe.styles = {};
      for (const name of ["textAlign", "fontSize", "color", "marginTop", "marginBottom", "width", "borderRadius", "objectPosition"]) {
        if (patch.styles[name] !== undefined) safe.styles[name] = String(patch.styles[name]).slice(0, 100);
      }
    }
    output.patches[String(id).slice(0, 300)] = safe;
  }
  return output;
}
