import { requireAdmin, sameOrigin } from "./_lib/auth.js";
import { getSupabaseAdmin } from "./_lib/supabase.js";
import { defaultArticles, normalizeArticle, slugifyArticle } from "../src/articleContent.js";

function sortArticles(items) {
  return [...items].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))
    || String(b.publishedAt || b.updatedAt || "").localeCompare(String(a.publishedAt || a.updatedAt || "")));
}

function rowToAdmin(row) {
  return {
    ...normalizeArticle({ ...row.draft, id: row.id }, row.slug),
    id: row.id,
    status: row.status,
    hasUnpublishedChanges: row.has_unpublished_changes,
    publishedSlug: row.published_slug || "",
    publishedAt: row.published_at || "",
    updatedAt: row.updated_at || "",
  };
}

function rowToPublished(row) {
  return normalizeArticle({ ...row.published, id: row.id, slug: row.published_slug, publishedAt: row.published_at }, row.published_slug);
}

function databaseError(response, error) {
  console.error("Supabase articles error", error);
  return response.status(500).json({ error: "Não foi possível acessar os artigos agora." });
}

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    if (request.method === "GET" && request.query.mode !== "admin") {
      const slug = request.query.slug ? slugifyArticle(request.query.slug) : "";
      const article = slug ? defaultArticles.find((item) => item.slug === slug) : null;
      return slug
        ? article ? response.status(200).json({ article }) : response.status(404).json({ error: "Artigo não encontrado." })
        : response.status(200).json({ items: defaultArticles });
    }
    return response.status(503).json({ error: "Supabase ainda não foi configurado neste ambiente." });
  }

  if (request.method === "GET") {
    if (request.query.mode === "admin") {
      if (!requireAdmin(request, response)) return;
      const { data, error } = await supabase.from("articles").select("*").order("updated_at", { ascending: false });
      if (error) return databaseError(response, error);
      return response.status(200).json({ items: sortArticles(data.map(rowToAdmin)) });
    }

    const slug = request.query.slug ? slugifyArticle(request.query.slug) : "";
    let query = supabase.from("articles").select("id,published,published_slug,published_at")
      .not("published", "is", null).order("published_at", { ascending: false });
    if (slug) query = query.eq("published_slug", slug).limit(1);
    const { data, error } = await query;
    if (error) return databaseError(response, error);
    if (slug) return data[0]
      ? response.status(200).json({ article: rowToPublished(data[0]) })
      : response.status(404).json({ error: "Artigo não encontrado." });
    return response.status(200).json({ items: sortArticles(data.map(rowToPublished)) });
  }

  if (!sameOrigin(request) || !requireAdmin(request, response)) return;

  if (request.method === "PUT") {
    const article = normalizeArticle(request.body?.article, "artigo");
    const originalId = String(request.body?.originalId || "").trim();
    if (!article.title || !article.excerpt || !article.sections.length) {
      return response.status(400).json({ error: "Preencha título, resumo e ao menos uma seção." });
    }

    const ignoredId = /^[0-9a-f-]{36}$/i.test(originalId) ? originalId : "00000000-0000-0000-0000-000000000000";
    const { data: conflict, error: conflictError } = await supabase.from("articles").select("id")
      .eq("slug", article.slug).neq("id", ignoredId).maybeSingle();
    if (conflictError) return databaseError(response, conflictError);
    if (conflict) return response.status(409).json({ error: "Já existe um artigo com esse endereço." });

    const validId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(originalId);
    const { data: existing, error: existingError } = validId
      ? await supabase.from("articles").select("*").eq("id", originalId).maybeSingle()
      : { data: null, error: null };
    if (existingError) return databaseError(response, existingError);

    const now = new Date().toISOString();
    const publish = Boolean(request.body?.publish);
    const draft = { ...article };
    delete draft.id;
    delete draft.publishedAt;
    const payload = {
      slug: article.slug,
      draft,
      status: publish ? "published" : (existing?.published ? "published" : "draft"),
      has_unpublished_changes: !publish,
      published: publish ? draft : (existing?.published || null),
      published_slug: publish ? article.slug : (existing?.published_slug || null),
      published_at: publish ? (existing?.published_at || now) : (existing?.published_at || null),
      updated_at: now,
    };
    const operation = existing
      ? supabase.from("articles").update(payload).eq("id", existing.id).select("*").single()
      : supabase.from("articles").insert(payload).select("*").single();
    const { data, error } = await operation;
    if (error) return error.code === "23505"
      ? response.status(409).json({ error: "Já existe um artigo com esse endereço." })
      : databaseError(response, error);
    return response.status(200).json({ ok: true, published: publish, article: rowToAdmin(data) });
  }

  if (request.method === "PATCH") {
    const id = String(request.body?.id || "");
    if (!/^[0-9a-f-]{36}$/i.test(id) || request.body?.action !== "unpublish") return response.status(400).json({ error: "Ação inválida." });
    const { error } = await supabase.from("articles").update({
      status: "draft", published: null, published_slug: null, published_at: null,
      has_unpublished_changes: true, updated_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) return databaseError(response, error);
    return response.status(200).json({ ok: true });
  }

  if (request.method === "DELETE") {
    const id = String(request.body?.id || "");
    if (!/^[0-9a-f-]{36}$/i.test(id)) return response.status(400).json({ error: "Artigo inválido." });
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) return databaseError(response, error);
    return response.status(200).json({ ok: true });
  }

  return response.status(405).json({ error: "Método não permitido." });
}
