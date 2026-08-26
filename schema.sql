-- Wedding guest photo wall — D1 schema
CREATE TABLE IF NOT EXISTS posts (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,          -- never exposed via public API
  media_key   TEXT NOT NULL,          -- R2 object key
  media_type  TEXT NOT NULL,          -- 'image' | 'video'
  content_type TEXT NOT NULL,         -- original MIME type
  size        INTEGER NOT NULL,
  created_at  INTEGER NOT NULL,       -- unix ms
  caption     TEXT                    -- optional guest caption, max 80 chars (enforced in app code)
);

CREATE INDEX IF NOT EXISTS idx_posts_created ON posts (created_at DESC);

-- naive per-IP rate limiting
CREATE TABLE IF NOT EXISTS upload_log (
  ip          TEXT NOT NULL,
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_upload_log ON upload_log (ip, created_at);
