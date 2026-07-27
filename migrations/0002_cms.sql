CREATE TABLE IF NOT EXISTS cms_pages (
  path TEXT PRIMARY KEY,
  draft_json TEXT NOT NULL,
  published_json TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_at TEXT,
  updated_by TEXT
);

CREATE TABLE IF NOT EXISTS cms_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  path TEXT NOT NULL,
  content_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT
);

CREATE INDEX IF NOT EXISTS cms_versions_path_idx ON cms_versions(path, id DESC);

CREATE TABLE IF NOT EXISTS cms_media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  object_key TEXT NOT NULL UNIQUE,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  byte_size INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT
);
