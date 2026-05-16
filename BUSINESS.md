# Amino Select — Business Documentation

## What Is This?

**Amino Select** is a premium research peptide e-commerce platform. We sell research-grade peptides (lyophilized powder in sterile vials) to verified researchers and laboratories. Every product is independently tested by accredited U.S. labs and comes with a Certificate of Analysis (COA).

Think of it as the "Apple Store" for research peptides — clean design, transparent quality data, frictionless purchasing.

## What We Sell

28 research peptides sold for **laboratory and research use only** — not for human consumption. Products range from $16.99 (Amino H2O sterile diluent) to $129.99 (KLOW quad stack).

**Categories:**
- Tissue Repair Research (BPC-157, TB-500, Wolverine Stack, GLOW)
- Dermal Research (GHK-Cu, SNAP-8)
- Cellular Research (NAD+, Glutathione, MOTS-C, IGF-1 LR3)
- Neuro Research (SEMAX, SELANK, DSIP)
- Circadian Research (DSIP, Melanotan I/II)

**Popular products:** BPC-157, NAD+, GHK-Cu, TB-500, Glutathione, CJC-1295/Ipamorelin

## How It Works

### Customer Flow
1. **Browse** — Customers view the product catalog (no login required)
2. **Select Product** — Choose a peptide, select dosage (e.g., 10MG), quantity, and bundle tier (1/2/3+ bottles with volume discounts)
3. **Cart** — Items persist in localStorage across sessions
4. **Checkout** — Enter email and shipping address (checkout integration TBD — currently placeholder)
5. **Fulfillment** — Orders ship within 0-2 business days, free shipping over $150

### Quality Assurance
Every product has:
- 99%+ purity guarantee
- Third-party identity testing (ISO 17025 accredited labs)
- Published COA with lot number, purity %, actual vs labeled amount
- Lyophilized powder in nitrogen-sealed sterile vials

### Trust Signals
- Free shipment protection on every order
- Damage replacement with photo evidence
- SSL-secured checkout
- FDA disclaimer (products not evaluated by FDA)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v4 (Apple-inspired design) |
| Routing | React Router v7 |
| Database | Supabase (PostgreSQL) |
| Hosting | Vercel |
| Domain | aminoselect.com |

## Architecture

```
src/
├── components/
│   ├── Header.jsx          # Frosted glass nav, cart badge
│   ├── Footer.jsx          # Dark footer, FDA disclaimer, payment icons
│   └── ProductCard.jsx     # Store grid card component
├── context/
│   └── CartContext.jsx      # Cart state (useReducer + localStorage)
├── lib/
│   └── supabase.js          # Supabase client + data fetching functions
├── pages/
│   ├── HomePage.jsx         # Landing page with hero, guarantee, featured, FAQ
│   ├── StorePage.jsx        # Product grid with search/filter/sort
│   ├── ProductPage.jsx      # Product detail with bundles, CoA, add-to-cart
│   └── CartPage.jsx         # Cart with quantity controls, totals, checkout CTA
├── index.css                # Global styles, animations, Apple design tokens
└── App.jsx                  # Router + CartProvider wrapper
```

## Database Schema

### Tables

**`products`** — Main product catalog
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| slug | TEXT (unique) | URL-friendly identifier (e.g., `bpc-157`) |
| name | TEXT | Display name (e.g., "BPC-157") |
| subtitle | TEXT | Category descriptor (e.g., "Cellular Peptide") |
| description | TEXT | Product description for researchers |
| price | DECIMAL(10,2) | Base price in USD |
| dosage | TEXT | Default dosage (e.g., "10MG") |
| compound_type | TEXT | Compound classification |
| bg_color | TEXT | Hex color for product card background |
| is_featured | BOOLEAN | Show in featured carousel |
| in_stock | BOOLEAN | Availability flag |

**`product_aliases`** — Alternative names for each product
| Column | Type |
|--------|------|
| product_id | UUID (FK → products) |
| alias | TEXT |

**`categories`** — Research categories
| Column | Type |
|--------|------|
| slug | TEXT (unique) |
| name | TEXT |

**`product_categories`** — Many-to-many: products ↔ categories

**`certificates`** — Certificate of Analysis data
| Column | Type | Description |
|--------|------|-------------|
| product_id | UUID (FK → products) | |
| lot_number | TEXT | Batch identifier |
| purity | DECIMAL(5,3) | Purity percentage (e.g., 99.876) |
| labeled_amount | TEXT | What the label says (e.g., "10mg") |
| actual_amount | TEXT | Actual measured amount |
| tested_date | DATE | When the lab test was performed |

**`orders`** — Customer orders
| Column | Type |
|--------|------|
| order_number | TEXT (auto-generated, e.g., "PP-123456") |
| email | TEXT |
| status | TEXT (pending/confirmed/shipped/delivered/cancelled) |
| subtotal | DECIMAL |
| shipping | DECIMAL |
| total | DECIMAL |
| shipping_address | JSONB |

**`order_items`** — Line items per order

**`subscribers`** — Newsletter email list

### Row Level Security
- Products, aliases, categories, certificates: **public read** (no auth needed)
- Orders, order items: **anyone can insert** (checkout flow)
- All tables: **service_role full access** (admin operations)

## API / Data Access

The app uses the Supabase JS client directly (no backend API layer). Key functions in `src/lib/supabase.js`:

```javascript
getProducts()           // Fetch all products (store grid)
getProduct(slug)        // Fetch single product + aliases + certificates
getFeaturedProducts()   // Fetch featured products (homepage carousel)
subscribeEmail(email)   // Add email to newsletter list
```

## Key Features

| Feature | Status | Description |
|---------|--------|-------------|
| Product catalog | ✅ Live | 28 products, search, filter by category, sort |
| Product detail | ✅ Live | Full PDP with aliases, CoA table, compound info |
| Bundle pricing | ✅ Live | 1/2/3+ bottle tiers with 5%/7.5% discounts |
| Cart | ✅ Live | Add/remove, quantity controls, localStorage persistence |
| Checkout | 🚧 Placeholder | Cart → checkout button (needs payment integration) |
| Newsletter | ✅ Live | Email subscribe via Supabase |
| Age gate | ❌ Removed | Was on original, not needed for B2B research |
| User accounts | ❌ Not built | Could add via Supabase Auth if needed |

## Payment Integration (TODO)

Currently missing. Options:
- **Stripe** — Standard e-commerce, supports research supply sales
- **Crypto** — Could align with no-KYC domain strategy
- **Manual** — Email-based order confirmation with invoice

## Design System

Apple-inspired UI with these tokens:
- Primary text: `#1D1D1F` (near-black)
- Secondary text: `#86868B` (grey)
- Accent green: `#34C759` (Apple green, for trust badges)
- Section bg: `#FBFBFD` (off-white)
- Font: Inter (closest web alternative to SF Pro)
- Shadows: `0 8px 40px rgba(0,0,0,0.04)` (Apple-style)
- Border radius: 12-20px on cards
- Nav: Frosted glass (`backdrop-blur: saturate(200%) blur(25px)`)
- Animations: Fade-in on scroll, card-lift hover, smooth accordion

## Environment Variables

```env
VITE_SUPABASE_URL=https://tvlrreyhbgaxauyxuqrw.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

## Deployment

- **Git:** `github.com/kennysabangan/puropeptides`
- **Vercel:** Auto-deploys from `main` branch
- **Live URL:** https://aminoselect.vercel.app
- **Custom domain:** aminoselect.com (pending DNS setup)

## Competitive Landscape

| Competitor | What They Do Well | What We Do Better |
|------------|-------------------|-------------------|
| Amino Club | Clean design, COA transparency | Same quality + better UI (Apple-style) |
| Other peptide vendors | Price competition | Premium branding, trust signals, bundle pricing |

## Future Roadmap

1. **Payment integration** — Stripe or crypto checkout
2. **User accounts** — Supabase Auth, order history, saved addresses
3. **Reviews** — Product reviews from verified researchers
4. **Blog/Research** — SEO content about peptide research
5. **Wholesale portal** — Volume pricing for institutional buyers
6. **International shipping** — Expand beyond US
