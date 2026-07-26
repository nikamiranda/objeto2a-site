export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact" && request.method === "POST") {
      return saveContact(request, env);
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
