import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { blankArticle, defaultArticles, normalizeArticle, slugifyArticle } from "../src/articleContent.js";

test("normalizes article slugs and preserves structured sections", () => {
  assert.equal(slugifyArticle("  Escuta, Cultura & Direção!  "), "escuta-cultura-direcao");
  const article = normalizeArticle({
    title: "Uma leitura",
    sections: [{ heading: "Começo", paragraphs: ["Primeiro.", "Segundo."] }],
  });
  assert.equal(article.slug, "uma-leitura");
  assert.deepEqual(article.sections[0].paragraphs, ["Primeiro.", "Segundo."]);
});

test("ships the existing articles as the initial Supabase seed", () => {
  assert.equal(defaultArticles.length, 3);
  assert.equal(defaultArticles.filter((article) => article.featured).length, 1);
  assert.ok(defaultArticles.every((article) => article.sections.length >= 3));
  assert.equal(blankArticle().status, undefined);
});

test("article API uses Supabase and the dashboard exposes editorial CRUD", async () => {
  const [api, mediaApi, admin, migration, bucketMigration] = await Promise.all([
    readFile(new URL("../api/articles.js", import.meta.url), "utf8"),
    readFile(new URL("../api/article-media.js", import.meta.url), "utf8"),
    readFile(new URL("../src/Admin.jsx", import.meta.url), "utf8"),
    readFile(new URL("../supabase/migrations/20260817195841_create_editorial_articles.sql", import.meta.url), "utf8"),
    readFile(new URL("../supabase/migrations/20260817200229_create_article_media_bucket.sql", import.meta.url), "utf8"),
  ]);
  assert.match(api, /getSupabaseAdmin/);
  assert.doesNotMatch(api, /Vercel|Blob|readJson|writeJson/);
  assert.match(admin, /Criar novo artigo/);
  assert.match(admin, /saveArticle\(true\)/);
  assert.match(admin, /deleteArticle/);
  assert.match(admin, /\/api\/article-media/);
  assert.match(mediaApi, /createSignedUploadUrl/);
  assert.match(mediaApi, /article-media/);
  assert.doesNotMatch(mediaApi, /Vercel|Blob/);
  assert.match(migration, /enable row level security/i);
  assert.match(migration, /revoke all on table public\.articles from anon, authenticated/i);
  assert.match(bucketMigration, /storage\.buckets/);
});
