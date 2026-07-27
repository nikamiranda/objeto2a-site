import { list } from "@vercel/blob";
import { requireAdmin } from "./_lib/auth.js";
import { pageSlug, readJson, validPagePath } from "./_lib/storage.js";

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "GET") return response.status(405).json({ error: "Método não permitido." });
  if (!requireAdmin(request, response)) return;
  const path = validPagePath(request.query.path);
  if (!path) return response.status(400).json({ error: "Página inválida." });
  const prefix = `cms/versions/${pageSlug(path)}/`;
  const result = await list({ prefix, limit: 30 });
  const items = await Promise.all(result.blobs.map((blob) => readJson(blob.pathname)));
  return response.status(200).json({
    items: items.filter(Boolean).sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map(({ content: _content, ...item }) => item),
  });
}

