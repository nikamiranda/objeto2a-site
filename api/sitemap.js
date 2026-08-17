import { getSupabaseAdmin } from "./_lib/supabase.js";
import { defaultArticles } from "../src/articleContent.js";

const siteUrl = "https://objeto2a.com";

function escapeXml(value) {
  return String(value).replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;",
  })[character]);
}

export default async function handler(request, response) {
  if (request.method !== "GET") return response.status(405).end();
  let articles = defaultArticles;
  try {
    const { data, error } = await getSupabaseAdmin().from("articles").select("published_slug").not("published", "is", null);
    if (!error && Array.isArray(data)) articles = data.map((item) => ({ slug: item.published_slug }));
  } catch {
    // Static defaults keep this endpoint valid before local secrets are configured.
  }
  const paths = ["/", "/metodo", "/solucoes", "/trabalhos", "/sobre", "/artigos"]
    .concat(articles.map((article) => `/artigos/${article.slug}`));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${escapeXml(`${siteUrl}${path}`)}</loc></url>`).join("\n")}\n</urlset>`;
  response.setHeader("Content-Type", "application/xml; charset=utf-8");
  response.setHeader("Cache-Control", "public, max-age=0, s-maxage=300");
  return response.status(200).send(xml);
}
