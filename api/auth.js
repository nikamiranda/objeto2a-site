import {
  clearSessionCookie,
  createSessionCookie,
  hasAuthConfig,
  isAuthenticated,
  rateLimited,
  resetRateLimit,
  sameOrigin,
  verifyPassword,
} from "./_lib/auth.js";

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method === "GET") {
    return response.status(200).json({ authenticated: isAuthenticated(request), configured: hasAuthConfig() });
  }

  if (request.method === "DELETE") {
    response.setHeader("Set-Cookie", clearSessionCookie(request));
    return response.status(200).json({ ok: true });
  }

  if (request.method !== "POST") return response.status(405).json({ error: "Método não permitido." });
  if (!sameOrigin(request)) return response.status(403).json({ error: "Origem inválida." });
  if (!hasAuthConfig()) return response.status(503).json({ error: "Autenticação ainda não configurada." });
  if (rateLimited(request)) return response.status(429).json({ error: "Muitas tentativas. Aguarde alguns minutos." });

  const password = String(request.body?.password || "");
  if (!verifyPassword(password)) return response.status(401).json({ error: "Senha incorreta." });

  resetRateLimit(request);
  response.setHeader("Set-Cookie", createSessionCookie(request));
  return response.status(200).json({ ok: true, authenticated: true });
}

