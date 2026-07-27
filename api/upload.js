import { handleUpload } from "@vercel/blob/client";
import { requireAdmin, sameOrigin } from "./_lib/auth.js";

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Método não permitido." });
  if (!sameOrigin(request) || !requireAdmin(request, response)) return;
  try {
    const json = await handleUpload({
      body: request.body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const safeName = pathname.split("/").pop().replace(/[^\p{L}\p{N}._ -]/gu, "").slice(0, 180) || "arquivo";
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"],
          maximumSizeInBytes: 50 * 1024 * 1024,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ safeName }),
        };
      },
      onUploadCompleted: async () => {},
    });
    return response.status(200).json(json);
  } catch (error) {
    return response.status(400).json({ error: error.message || "Não foi possível enviar o arquivo." });
  }
}
