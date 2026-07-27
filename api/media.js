import { list } from "@vercel/blob";
import { requireAdmin } from "./_lib/auth.js";

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "GET") return response.status(405).json({ error: "Método não permitido." });
  if (!requireAdmin(request, response)) return;
  const result = await list({ prefix: "cms/media/", limit: 100 });
  return response.status(200).json({
    items: result.blobs
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
      .map((blob) => ({
        id: blob.pathname,
        filename: blob.pathname.split("/").pop().replace(/^\d+-/, ""),
        content_type: blob.contentType,
        byte_size: blob.size,
        created_at: blob.uploadedAt,
        url: blob.url,
      })),
  });
}

