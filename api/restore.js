import { requireAdmin, sameOrigin } from "./_lib/auth.js";
import { pageSlug, readJson, validPagePath, writeJson } from "./_lib/storage.js";

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "POST") return response.status(405).json({ error: "Método não permitido." });
  if (!sameOrigin(request) || !requireAdmin(request, response)) return;
  const path = validPagePath(request.body?.path);
  const versionId = String(request.body?.versionId || "").replace(/[^a-z0-9-]/gi, "");
  if (!path || !versionId) return response.status(400).json({ error: "Versão inválida." });
  const version = await readJson(`cms/versions/${pageSlug(path)}/${versionId}.json`);
  if (!version?.content) return response.status(404).json({ error: "Versão não encontrada." });
  await writeJson(`cms/pages/${pageSlug(path)}/draft.json`, version.content);
  return response.status(200).json({ ok: true, content: version.content });
}

