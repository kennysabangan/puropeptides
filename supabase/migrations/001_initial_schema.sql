-- Puro Peptides Database Schema

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  dosage TEXT,
  compound_type TEXT,
  bg_color TEXT DEFAULT '#F5F5F5',
  is_featured BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Product aliases
CREATE TABLE product_aliases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  alias TEXT NOT NULL
);

-- Categories
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL
);

CREATE TABLE product_categories (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

-- Certificates of Analysis
CREATE TABLE certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  lot_number TEXT NOT NULL,
  variant TEXT DEFAULT '10mg',
  purity DECIMAL(5,3) NOT NULL,
  labeled_amount TEXT,
  actual_amount TEXT,
  tested_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Orders
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL DEFAULT 'PP-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0'),
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  subtotal DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Order items
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  dosage TEXT,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL
);

-- Newsletter subscribers
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_orders_email ON orders(email);

-- RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read aliases" ON product_aliases FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can subscribe" ON subscribers FOR INSERT WITH CHECK (true);

-- Seed categories
INSERT INTO categories (slug, name) VALUES
  ('tissue-repair', 'Tissue Repair Research'),
  ('dermal', 'Dermal Research'),
  ('cellular', 'Cellular Research'),
  ('neuro', 'Neuro Research'),
  ('circadian', 'Circadian Research');

-- Seed 28 products
INSERT INTO products (slug, name, subtitle, description, price, dosage, compound_type, bg_color, is_featured) VALUES
  ('glp-3','GLP-3 (RT)','Metabolic Peptide','A 39-amino acid triple agonist peptide targeting GIP, GLP-1, and glucagon receptors.',69.99,'10MG','Triple Agonist','#E8F5E9',false),
  ('bpc-157','BPC-157','Cellular Peptide','A 15-amino acid peptide derived from human gastric juice with regenerative effects.',39.99,'10MG','Pentadecapeptide','#E8F5E9',true),
  ('ghk-cu','GHK-Cu','Dermal Compound','A naturally occurring copper tripeptide promoting tissue remodeling and collagen synthesis.',29.99,'10MG','Copper Tripeptide','#E3F2FD',true),
  ('tesamorlin','Tesamorlin','GHRH Analog','A 44-amino acid GHRH analog stimulating pituitary GH secretion.',69.99,'10MG','GHRH Analog','#FBE9E7',false),
  ('tb-500','TB-500','Regenerative Peptide','A 43-amino acid fragment of thymosin beta-4 regulating actin polymerization.',39.99,'10MG','Synthetic Fragment','#E0F7FA',false),
  ('melanotan-ii','Melanotan II','Melanocortin Analog','A cyclic peptide analog of α-MSH binding melanocortin receptors.',29.99,'10MG','Cyclic Peptide','#FFF3E0',false),
  ('nad-plus','NAD+','Coenzyme','A critical dinucleotide coenzyme activating sirtuins and supporting mitochondrial function.',69.99,'10MG','Coenzyme','#FFF8E1',true),
  ('aod-9604','AOD-9604','Lipolytic Peptide','A 15-amino acid lipolytic peptide stimulating fat cell breakdown.',49.99,'10MG','hGH Fragment','#F3E5F5',false),
  ('mots-c','MOTS-C','Mitochondrial Peptide','A mitochondrial-derived peptide modulating metabolic processes.',39.99,'10MG','Mitochondrial Peptide','#E8EAF6',false),
  ('cjc-ipa-no-dac','CJC-1295 / Ipamorelin','GH Release Blend','A peptide combination enhancing GH release through GHRH and ghrelin receptor activation.',59.99,'10MG','Peptide Blend','#E0F2F1',false),
  ('wolverine-stack','Wolverine Stack','Regenerative Stack','A synergistic combination supporting tissue repair through complementary cellular mechanisms.',109.99,'10MG','Peptide Blend','#E8F5E9',false),
  ('glow','GLOW','Triple Regenerative','BPC-157, TB-500, and GHK-Cu targeting angiogenic and extracellular matrix pathways.',114.99,'10MG','Peptide Blend','#F1F8E9',false),
  ('dsip','DSIP','Sleep Peptide','Delta sleep-inducing peptide studied for circadian rhythm regulation.',29.99,'10MG','Endogenous Peptide','#EDE7F6',true),
  ('semax','SEMAX','Nootropic Peptide','A synthetic ACTH analog studied for neuroprotective properties.',29.99,'10MG','ACTH Analog','#E1F5FE',true),
  ('selank','SELANK','Anxiolytic Peptide','A synthetic tuftsin analog studied for anxiolytic properties.',29.99,'10MG','Tuftsin Analog','#E0F7FA',true),
  ('klow','KLOW','Quad Regenerative','A quad-peptide combination for comprehensive regenerative research.',129.99,'10MG','Peptide Blend','#F1F8E9',false),
  ('kpv','KPV','Anti-Inflammatory','A tripeptide fragment of alpha-MSH studied for anti-inflammatory properties.',39.99,'10MG','Tripeptide','#FCE4EC',false),
  ('pt-141','PT-141','Melanocortin Agonist','A synthetic melanocortin agonist peptide studied for receptor pathways.',29.99,'10MG','Melanocortin Agonist','#F3E5F5',false),
  ('glutathione','Glutathione','Antioxidant','A master antioxidant tripeptide studied for oxidative stress reduction.',59.99,'10MG','Tripeptide','#E8EAF6',true),
  ('ipamorelin','Ipamorelin','GHS Receptor Agonist','A selective growth hormone secretagogue studied for GH release.',49.99,'10MG','GH Secretagogue','#E0F2F1',false),
  ('igf-1-lr3','IGF-1 LR3','Growth Factor','A modified insulin-like growth factor studied for cell growth and proliferation.',69.99,'10MG','Growth Factor','#FFF3E0',false),
  ('amino-h2o','Amino H2O','Amino Blend','Sterile research-grade amino acid solution for laboratory use.',16.99,'50ML','Research Supply','#E3F2FD',false),
  ('cagrilintide','Cagrilintide','Amylin Analog','A long-acting amylin analog studied for metabolic regulation.',69.99,'10MG','Amylin Analog','#FBE9E7',false),
  ('epithalon','Epithalon','Anti-Aging Peptide','A synthetic tetrapeptide studied for telomerase activation.',29.99,'10MG','Tetrapeptide','#E8EAF6',false),
  ('5-amino-1mq','5-Amino-1MQ','NNMT Inhibitor','A small molecule NNMT inhibitor studied for metabolic research.',49.99,'10MG','NNMT Inhibitor','#F1F8E9',false),
  ('melanotan-i','Melanotan I','Melanocortin','A synthetic melanocortin analog studied for melanogenesis.',29.99,'10MG','Melanocortin Analog','#FFF3E0',false),
  ('thymosin-alpha-1','Thymosin Alpha-1','Immune Peptide','A synthetic thymic peptide studied for immune system modulation.',39.99,'10MG','Thymic Peptide','#E8F5E9',false),
  ('snap-8','SNAP-8','Cosmetic Peptide','An acetyl octapeptide studied for cosmetic research applications.',29.99,'10MG','Octapeptide','#FCE4EC',false);

-- Seed aliases
INSERT INTO product_aliases (product_id, alias)
  SELECT id, unnest(ARRAY['Body Protection Compound-157','PL-14736','PLD-116','Bepecin']) FROM products WHERE slug='bpc-157';
INSERT INTO product_aliases (product_id, alias)
  SELECT id, unnest(ARRAY['Copper Tripeptide-1','Glycyl-L-histidyl-L-lysine Copper']) FROM products WHERE slug='ghk-cu';

-- Seed COAs
INSERT INTO certificates (product_id, lot_number, variant, purity, labeled_amount, actual_amount, tested_date)
  SELECT id,'BP0001','10mg',99.876,'10mg','11.18mg','2026-05-01' FROM products WHERE slug='bpc-157';
INSERT INTO certificates (product_id, lot_number, variant, purity, labeled_amount, actual_amount, tested_date)
  SELECT id,'P0142','10mg',99.105,'10mg','11.65mg','2026-02-04' FROM products WHERE slug='bpc-157';
