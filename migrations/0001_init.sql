-- Catalogue documents as JSON, plus the columns used for lookups and sorting.
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  ref TEXT NOT NULL UNIQUE,
  ord INTEGER NOT NULL DEFAULT 0,
  created TEXT NOT NULL,
  data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS products_ord ON products (ord, created);
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  ord INTEGER NOT NULL DEFAULT 0,
  data TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  data TEXT NOT NULL
);
