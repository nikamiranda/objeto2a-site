import { requireAdmin, sameOrigin } from "./_lib/auth.js";
import { getSupabaseAdmin } from "./_lib/supabase.js";

const BUCKET = "article-media";
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_SIZE = 10 * 1024 * 1024;

function safeFilename(filename = "imagem") {
  const parts = filename.split(".");
  const extension = parts.length > 1 ? parts.pop().toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  const basename = parts.join(".").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "imagem";
  return `${basename}-${crypto.randomUUID()}${extension ? `.${extension}` : ""}`;
}

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Método não permitido." });
  if (!sameOrigin(request) || !requireAdmin(request, response)) return;

  const { filename, contentType, size } = request.body || {};
  if (!ALLOWED_TYPES.has(contentType)) return response.status(400).json({ error: "Envie uma imagem JPG, PNG, WebP ou GIF." });
  if (!Number.isFinite(size) || size <= 0 || size > MAX_SIZE) return response.status(400).json({ error: "A imagem deve ter no máximo 10 MB." });

  try {
    const supabase = getSupabaseAdmin();
    const path = `articles/${new Date().toISOString().slice(0, 10)}/${safeFilename(filename)}`;
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);
    if (error) throw error;
    const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return response.status(200).json({
      path,
      signedUrl: data.signedUrl,
      publicUrl: publicData.publicUrl,
    });
  } catch (error) {
    return response.status(500).json({ error: error.message || "Não foi possível preparar o envio da imagem." });
  }
}
