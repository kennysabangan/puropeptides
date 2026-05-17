-- Server-side cart for signed-in users

CREATE TABLE carts (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own cart"
  ON carts FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users insert own cart"
  ON carts FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own cart"
  ON carts FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users delete own cart"
  ON carts FOR DELETE USING (user_id = auth.uid());
