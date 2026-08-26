-- Adds optional guest caption to posts (max 80 chars, enforced in app code)
ALTER TABLE posts ADD COLUMN caption TEXT;
