import { requireAdmin, sameOrigin } from "./_lib/auth.js";
import { EMPTY_CONTENT, normalizeContent, pageSlug, readJson, validPagePath, writeJson } from "./_lib/storage.js";

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  const path = validPagePath(request.query.path);
  if (!path) return response.status(400).json({ error: "Página inválida." });
  const slug = pageSlug(path);

  if (request.method === "GET") {
    const draft = request.query.mode === "draft";
    if (draft && !requireAdmin(request, response)) return;
    const content = await readJson(`cms/pages/${slug}/${draft ? "draft" : "published"}.json`, EMPTY_CONTENT);
    return response.status(200).json({ path, content });
  }

  if (request.method !== "PUT") return response.status(405).json({ error: "Método não permitido." });
  if (!sameOrigin(request) || !requireAdmin(request, response)) return;

  const content = normalizeContent(request.body?.content);
  const serialized = JSON.stringify(content);
  if (serialized.length > 750000) return response.status(413).json({ error: "Conteúdo grande demais." });

  await writeJson(`cms/pages/${slug}/draft.json`, content);
  if (!request.body?.publish) return response.status(200).json({ ok: true, published: false });

  await writeJson(`cms/pages/${slug}/published.json`, content);
  const version = {
    id: `${Date.now()}-${crypto.randomUUID()}`,
    path,
    created_at: new Date().toISOString(),
    created_by: "Administrador",
    content,
  };
  await writeJson(`cms/versions/${slug}/${version.id}.json`, version);
  return response.status(200).json({
    ok: true,
    published: true,
    version: { id: version.id, path, created_at: version.created_at, created_by: version.created_by },
  });
}

