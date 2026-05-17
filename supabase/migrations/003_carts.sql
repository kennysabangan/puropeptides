-- Server-side cart for signed-in users
-- Idempotent: safe to re-run.

CREATE TABLE IF NOT EXISTS carts (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own cart" ON carts;
CREATE POLICY "Users read own cart"
  ON carts FOR SELECT USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Users insert own cart" ON carts;
CREATE POLICY "Users insert own cart"
  ON carts FOR INSERT WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Users update own cart" ON carts;
CREATE POLICY "Users update own cart"
  ON carts FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Users delete own cart" ON carts;
CREATE POLICY "Users delete own cart"
  ON carts FOR DELETE USING (user_id = auth.uid());
