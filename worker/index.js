export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact" && request.method === "POST") {
      return saveContact(request, env);
    }

    if (url.pathname === "/api/cms" && request.method === "GET") {
      return getCmsDocument(request, env);
    }
    if (url.pathname === "/api/cms" && request.method === "PUT") {
      return saveCmsDocument(request, env);
    }
    if (url.pathname === "/api/cms/versions" && request.method === "GET") {
      return listCmsVersions(request, env);
    }
    if (url.pathname === "/api/cms/restore" && request.method === "POST") {
      return restoreCmsVersion(request, env);
    }
    if (url.pathname === "/api/cms/media" && request.method === "GET") {
      return listCmsMedia(request, env);
    }
    if (url.pathname === "/api/cms/media" && request.method === "POST") {
      return uploadCmsMedia(request, env);
    }
    if (url.pathname.startsWith("/api/cms/media/") && request.method === "GET") {
      return serveCmsMedia(request, env);
    }

    if (url.pathname === "/admin" && !authenticatedEmail(request)) {
      return new Response(
        `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Acesso restrito</title><style>body{margin:0;display:grid;place-items:center;min-height:100vh;background:#12213a;color:white;font:16px system-ui}.card{max-width:440px;padding:44px;border:1px solid #ffffff25;border-radius:24px;background:#ffffff0a}h1{font:600 34px Georgia,serif}p{color:#c7ced9;line-height:1.6}a{color:#ff806b}</style><main class="card"><small>OBJETO 2A · ADMIN</small><h1>Acesso restrito</h1><p>Entre pela área privada autorizada para editar e publicar o conteúdo do site.</p><a href="/">Voltar ao site</a></main></html>`,
        { status: 401, headers: { "content-type": "text/html; charset=utf-8" } },
      );
    }

    const response = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");

    if (response.status !== 404) {
      return withDynamicMeta(response, request);
    }

    if (!acceptsHtml || !["GET", "HEAD"].includes(request.method)) {
      return response;
    }

    const indexUrl = new URL(request.url);
    indexUrl.pathname = "/index.html";
    indexUrl.search = "";
    return withDynamicMeta(await env.ASSETS.fetch(new Request(indexUrl, request)), request);
  },
};

const EMPTY_CONTENT = JSON.stringify({ patches: {}, order: [], seo: {} });

function authenticatedEmail(request) {
  return request.headers.get("oai-authenticated-user-email")?.trim() || "";
}

function requireEditor(request) {
  const email = authenticatedEmail(request);
  if (!email) return { error: Response.json({ error: "Acesso ao painel não autorizado." }, { status: 401 }) };
  return { email };
}

async function ensureCmsSchema(env) {
  const statements = [
    `CREATE TABLE IF NOT EXISTS cms_pages (
      path TEXT PRIMARY KEY,
      draft_json TEXT NOT NULL,
      published_json TEXT,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      published_at TEXT,
      updated_by TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS cms_versions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      content_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT
    )`,
    `CREATE INDEX IF NOT EXISTS cms_versions_path_idx ON cms_versions(path, id DESC)`,
    `CREATE TABLE IF NOT EXISTS cms_media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      object_key TEXT NOT NULL UNIQUE,
      filename TEXT NOT NULL,
      content_type TEXT NOT NULL,
      byte_size INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT
    )`,
  ];
  await env.DB.batch(statements.map((sql) => env.DB.prepare(sql)));
}

function validPagePath(value) {
  const path = String(value || "/").trim();
  return ["/", "/metodo", "/solucoes", "/trabalhos", "/sobre"].includes(path) ? path : null;
}

function normalizeContent(value) {
  const input = value && typeof value === "object" ? value : {};
  const patches = input.patches && typeof input.patches === "object" ? input.patches : {};
  const order = Array.isArray(input.order) ? input.order.map(String).slice(0, 100) : [];
  const seo = input.seo && typeof input.seo === "object" ? input.seo : {};
  const normalized = { patches: {}, order, seo: {
    title: String(seo.title || "").slice(0, 120),
    description: String(seo.description || "").slice(0, 320),
    image: String(seo.image || "").slice(0, 1000),
  } };
  for (const [id, patch] of Object.entries(patches).slice(0, 1000)) {
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
    normalized.patches[String(id).slice(0, 300)] = safe;
  }
  return normalized;
}

async function getCmsDocument(request, env) {
  try {
    await ensureCmsSchema(env);
    const url = new URL(request.url);
    const path = validPagePath(url.searchParams.get("path"));
    if (!path) return Response.json({ error: "Página inválida." }, { status: 400 });
    const wantsDraft = url.searchParams.get("mode") === "draft";
    if (wantsDraft) {
      const auth = requireEditor(request);
      if (auth.error) return auth.error;
    }
    const row = await env.DB.prepare(
      "SELECT draft_json, published_json, updated_at, published_at, updated_by FROM cms_pages WHERE path = ?"
    ).bind(path).first();
    const raw = wantsDraft ? row?.draft_json : row?.published_json;
    return Response.json({
      path,
      content: JSON.parse(raw || EMPTY_CONTENT),
      updatedAt: row?.updated_at || null,
      publishedAt: row?.published_at || null,
      updatedBy: wantsDraft ? row?.updated_by || null : undefined,
    });
  } catch {
    return Response.json({ error: "Não foi possível carregar o conteúdo." }, { status: 500 });
  }
}

async function saveCmsDocument(request, env) {
  const auth = requireEditor(request);
  if (auth.error) return auth.error;
  try {
    await ensureCmsSchema(env);
    const body = await request.json();
    const path = validPagePath(body.path);
    if (!path) return Response.json({ error: "Página inválida." }, { status: 400 });
    const content = normalizeContent(body.content);
    const json = JSON.stringify(content);
    if (json.length > 750000) return Response.json({ error: "O conteúdo excede o limite permitido." }, { status: 413 });

    if (body.publish) {
      await env.DB.prepare(
        `INSERT INTO cms_pages (path, draft_json, published_json, updated_at, published_at, updated_by)
         VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)
         ON CONFLICT(path) DO UPDATE SET
           draft_json = excluded.draft_json,
           published_json = excluded.published_json,
           updated_at = CURRENT_TIMESTAMP,
           published_at = CURRENT_TIMESTAMP,
           updated_by = excluded.updated_by`
      ).bind(path, json, json, auth.email).run();
      const inserted = await env.DB.prepare(
        "INSERT INTO cms_versions (path, content_json, created_by) VALUES (?, ?, ?) RETURNING id, path, created_at, created_by"
      ).bind(path, json, auth.email).first();
      return Response.json({ ok: true, published: true, version: inserted });
    }

    await env.DB.prepare(
      `INSERT INTO cms_pages (path, draft_json, updated_at, updated_by)
       VALUES (?, ?, CURRENT_TIMESTAMP, ?)
       ON CONFLICT(path) DO UPDATE SET
         draft_json = excluded.draft_json,
         updated_at = CURRENT_TIMESTAMP,
         updated_by = excluded.updated_by`
    ).bind(path, json, auth.email).run();
    return Response.json({ ok: true, published: false });
  } catch {
    return Response.json({ error: "Não foi possível salvar o conteúdo." }, { status: 500 });
  }
}

async function listCmsVersions(request, env) {
  const auth = requireEditor(request);
  if (auth.error) return auth.error;
  try {
    await ensureCmsSchema(env);
    const path = validPagePath(new URL(request.url).searchParams.get("path"));
    if (!path) return Response.json({ error: "Página inválida." }, { status: 400 });
    const result = await env.DB.prepare(
      "SELECT id, path, created_at, created_by FROM cms_versions WHERE path = ? ORDER BY id DESC LIMIT 30"
    ).bind(path).all();
    return Response.json({ items: result.results || [] });
  } catch {
    return Response.json({ error: "Não foi possível carregar o histórico." }, { status: 500 });
  }
}

async function restoreCmsVersion(request, env) {
  const auth = requireEditor(request);
  if (auth.error) return auth.error;
  try {
    await ensureCmsSchema(env);
    const body = await request.json();
    const path = validPagePath(body.path);
    const versionId = Number(body.versionId);
    const row = await env.DB.prepare(
      "SELECT content_json FROM cms_versions WHERE id = ? AND path = ?"
    ).bind(versionId, path).first();
    if (!row) return Response.json({ error: "Versão não encontrada." }, { status: 404 });
    await env.DB.prepare(
      `INSERT INTO cms_pages (path, draft_json, updated_at, updated_by)
       VALUES (?, ?, CURRENT_TIMESTAMP, ?)
       ON CONFLICT(path) DO UPDATE SET draft_json = excluded.draft_json, updated_at = CURRENT_TIMESTAMP, updated_by = excluded.updated_by`
    ).bind(path, row.content_json, auth.email).run();
    return Response.json({ ok: true, content: JSON.parse(row.content_json) });
  } catch {
    return Response.json({ error: "Não foi possível restaurar a versão." }, { status: 500 });
  }
}

async function listCmsMedia(request, env) {
  const auth = requireEditor(request);
  if (auth.error) return auth.error;
  try {
    await ensureCmsSchema(env);
    const result = await env.DB.prepare(
      "SELECT id, filename, content_type, byte_size, created_at FROM cms_media ORDER BY id DESC LIMIT 100"
    ).all();
    return Response.json({
      items: (result.results || []).map((item) => ({ ...item, url: `/api/cms/media/${item.id}` })),
    });
  } catch {
    return Response.json({ error: "Não foi possível carregar a biblioteca." }, { status: 500 });
  }
}

async function uploadCmsMedia(request, env) {
  const auth = requireEditor(request);
  if (auth.error) return auth.error;
  try {
    await ensureCmsSchema(env);
    const contentType = request.headers.get("content-type") || "application/octet-stream";
    if (!contentType.startsWith("image/") && !contentType.startsWith("video/")) {
      return Response.json({ error: "Envie uma imagem ou vídeo válido." }, { status: 415 });
    }
    const declaredLength = Number(request.headers.get("content-length") || 0);
    if (declaredLength > 25 * 1024 * 1024) {
      return Response.json({ error: "O arquivo deve ter no máximo 25 MB." }, { status: 413 });
    }
    const bytes = await request.arrayBuffer();
    if (!bytes.byteLength || bytes.byteLength > 25 * 1024 * 1024) {
      return Response.json({ error: "O arquivo deve ter entre 1 byte e 25 MB." }, { status: 413 });
    }
    const encodedName = request.headers.get("x-filename") || "arquivo";
    let filename = "arquivo";
    try { filename = decodeURIComponent(encodedName).replace(/[^\p{L}\p{N}._ -]/gu, "").slice(0, 180) || "arquivo"; } catch {}
    const extension = filename.includes(".") ? filename.split(".").pop().toLowerCase().slice(0, 8) : "bin";
    const key = `cms/${Date.now()}-${crypto.randomUUID()}.${extension}`;
    await env.MEDIA.put(key, bytes, { httpMetadata: { contentType } });
    const inserted = await env.DB.prepare(
      "INSERT INTO cms_media (object_key, filename, content_type, byte_size, created_by) VALUES (?, ?, ?, ?, ?) RETURNING id, filename, content_type, byte_size, created_at"
    ).bind(key, filename, contentType, bytes.byteLength, auth.email).first();
    return Response.json({ item: { ...inserted, url: `/api/cms/media/${inserted.id}` } }, { status: 201 });
  } catch {
    return Response.json({ error: "Não foi possível enviar o arquivo." }, { status: 500 });
  }
}

async function serveCmsMedia(request, env) {
  try {
    await ensureCmsSchema(env);
    const id = Number(new URL(request.url).pathname.split("/").pop());
    const row = await env.DB.prepare(
      "SELECT object_key, filename, content_type FROM cms_media WHERE id = ?"
    ).bind(id).first();
    if (!row) return new Response("Arquivo não encontrado", { status: 404 });
    const object = await env.MEDIA.get(row.object_key);
    if (!object) return new Response("Arquivo não encontrado", { status: 404 });
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("cache-control", "public, max-age=31536000, immutable");
    headers.set("content-disposition", `inline; filename="${row.filename.replaceAll('"', "")}"`);
    return new Response(object.body, { headers });
  } catch {
    return new Response("Não foi possível carregar o arquivo", { status: 500 });
  }
}

async function withDynamicMeta(response, request) {
  if (!response.headers.get("content-type")?.includes("text/html")) return response;
  const origin = new URL(request.url).origin;
  const html = (await response.text()).replaceAll("__SITE_ORIGIN__", origin);
  return new Response(html, response);
}

async function saveContact(request, env) {
  try {
    const data = await request.json();
    const name = String(data.name || "").trim();
    const email = String(data.email || "").trim();
    const organization = String(data.organization || "").trim();
    const message = String(data.message || "").trim();

    if (!name || !email.includes("@") || !message || name.length > 120 || email.length > 180 || message.length > 4000) {
      return Response.json({ error: "Dados inválidos" }, { status: 400 });
    }

    await env.DB.prepare(
      `CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        organization TEXT,
        message TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`
    ).run();

    await env.DB.prepare(
      "INSERT INTO contacts (name, email, organization, message) VALUES (?, ?, ?, ?)"
    ).bind(name, email, organization, message).run();

    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: "Erro ao registrar contato" }, { status: 500 });
  }
}
