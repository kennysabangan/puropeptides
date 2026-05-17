-- Add Metabolic + Secretagogue categories (to match competitor coverage)
-- and populate product_categories for every seeded product.
-- Idempotent: safe to re-run.

INSERT INTO categories (slug, name) VALUES
  ('metabolic',    'Metabolic Research'),
  ('secretagogue', 'Secretagogue Research')
ON CONFLICT (slug) DO NOTHING;

-- Display order for the chip row on the store page.
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 100;

UPDATE categories SET sort_order =  10 WHERE slug = 'tissue-repair';
UPDATE categories SET sort_order =  20 WHERE slug = 'dermal';
UPDATE categories SET sort_order =  30 WHERE slug = 'metabolic';
UPDATE categories SET sort_order =  40 WHERE slug = 'secretagogue';
UPDATE categories SET sort_order =  50 WHERE slug = 'cellular';
UPDATE categories SET sort_order =  60 WHERE slug = 'neuro';
UPDATE categories SET sort_order =  70 WHERE slug = 'circadian';

-- Map every seeded product to its categories. Many products span more
-- than one (e.g. BPC-157 is both tissue repair and cellular). The first
-- listed category for a product is intended as the "primary" one.
WITH mapping(product_slug, cat_slugs) AS (
  VALUES
    ('glp-3',            ARRAY['metabolic']),
    ('bpc-157',          ARRAY['tissue-repair', 'cellular']),
    ('ghk-cu',           ARRAY['dermal', 'tissue-repair']),
    ('tesamorlin',       ARRAY['secretagogue', 'metabolic']),
    ('tb-500',           ARRAY['tissue-repair', 'cellular']),
    ('melanotan-ii',     ARRAY['dermal']),
    ('nad-plus',         ARRAY['cellular']),
    ('aod-9604',         ARRAY['metabolic']),
    ('mots-c',           ARRAY['cellular', 'metabolic']),
    ('cjc-ipa-no-dac',   ARRAY['secretagogue']),
    ('wolverine-stack',  ARRAY['tissue-repair', 'cellular']),
    ('glow',             ARRAY['dermal', 'tissue-repair']),
    ('dsip',             ARRAY['circadian', 'neuro']),
    ('semax',            ARRAY['neuro']),
    ('selank',           ARRAY['neuro']),
    ('klow',             ARRAY['tissue-repair', 'cellular']),
    ('kpv',              ARRAY['tissue-repair', 'cellular']),
    ('pt-141',           ARRAY['neuro']),
    ('glutathione',      ARRAY['cellular']),
    ('ipamorelin',       ARRAY['secretagogue']),
    ('igf-1-lr3',        ARRAY['secretagogue', 'tissue-repair']),
    ('amino-h2o',        ARRAY['cellular']),
    ('cagrilintide',     ARRAY['metabolic']),
    ('epithalon',        ARRAY['cellular', 'circadian']),
    ('5-amino-1mq',      ARRAY['metabolic']),
    ('melanotan-i',      ARRAY['dermal']),
    ('snap-8',           ARRAY['dermal']),
    ('thymosin-alpha-1', ARRAY['cellular'])
)
INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id
FROM mapping m
CROSS JOIN LATERAL unnest(m.cat_slugs) AS cat_slug
JOIN products   p ON p.slug = m.product_slug
JOIN categories c ON c.slug = cat_slug
ON CONFLICT (product_id, category_id) DO NOTHING;
