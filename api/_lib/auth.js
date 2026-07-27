import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";

const COOKIE = "objeto2a_admin";
const SESSION_SECONDS = 60 * 60 * 8;
const attempts = new Map();

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

function sign(value) {
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "").update(value).digest("base64url");
}

function parseCookies(header = "") {
  return Object.fromEntries(
    header.split(";").map((part) => {
      const index = part.indexOf("=");
      return index < 0 ? [part.trim(), ""] : [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1))];
    }),
  );
}

export function hasAuthConfig() {
  return Boolean(process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_SESSION_SECRET);
}

export function verifyPassword(password) {
  if (!hasAuthConfig()) return false;
  const [salt, expected] = process.env.ADMIN_PASSWORD_HASH.split(":");
  if (!salt || !expected) return false;
  const actual = scryptSync(String(password || ""), Buffer.from(salt, "base64"), 64);
  const expectedBuffer = Buffer.from(expected, "base64");
  return actual.length === expectedBuffer.length && timingSafeEqual(actual, expectedBuffer);
}

export function createSessionCookie(request) {
  const payload = base64url(JSON.stringify({ exp: Date.now() + SESSION_SECONDS * 1000 }));
  const token = `${payload}.${sign(payload)}`;
  const secure = request.headers["x-forwarded-proto"] === "https" || process.env.VERCEL;
  return `${COOKIE}=${encodeURIComponent(token)}; HttpOnly; ${secure ? "Secure; " : ""}SameSite=Strict; Path=/; Max-Age=${SESSION_SECONDS}`;
}

export function clearSessionCookie(request) {
  const secure = request.headers["x-forwarded-proto"] === "https" || process.env.VERCEL;
  return `${COOKIE}=; HttpOnly; ${secure ? "Secure; " : ""}SameSite=Strict; Path=/; Max-Age=0`;
}

export function isAuthenticated(request) {
  if (!hasAuthConfig()) return false;
  const token = parseCookies(request.headers.cookie)[COOKIE];
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")).exp > Date.now();
  } catch {
    return false;
  }
}

export function requireAdmin(request, response) {
  if (isAuthenticated(request)) return true;
  response.status(401).json({ error: "Sessão expirada. Entre novamente." });
  return false;
}

export function sameOrigin(request) {
  const origin = request.headers.origin;
  if (!origin) return true;
  const host = request.headers["x-forwarded-host"] || request.headers.host;
  return origin === `${request.headers["x-forwarded-proto"] || "https"}://${host}`
    || origin === `http://${host}`;
}

export function rateLimited(request) {
  const key = String(request.headers["x-forwarded-for"] || request.socket?.remoteAddress || "unknown").split(",")[0];
  const now = Date.now();
  const current = attempts.get(key) || { count: 0, reset: now + 15 * 60 * 1000 };
  if (now > current.reset) {
    attempts.set(key, { count: 1, reset: now + 15 * 60 * 1000 });
    return false;
  }
  current.count += 1;
  attempts.set(key, current);
  return current.count > 8;
}

export function resetRateLimit(request) {
  const key = String(request.headers["x-forwarded-for"] || request.socket?.remoteAddress || "unknown").split(",")[0];
  attempts.delete(key);
}

