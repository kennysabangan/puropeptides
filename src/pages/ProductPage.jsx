import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProduct } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import { getPrimaryImage } from '../lib/productImage'

const Chevron = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
)

function skuFor(product) {
  const base = (product.slug || product.id || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
  return `AS-${base}`
}

export default function ProductPage() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedBundle, setSelectedBundle] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getProduct(id)
      .then((data) => { setProduct(data); setLoading(false) })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product, quantity * selectedBundle, product.dosage || '10MG', selectedBundle)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8 md:py-14">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          <div className="bg-[#F5F5F7] rounded-[28px] min-h-[380px] md:min-h-[520px] animate-pulse" />
          <div className="py-2 space-y-4">
            <div className="h-4 w-24 bg-[#F5F5F7] rounded animate-pulse" />
            <div className="h-10 w-48 bg-[#F5F5F7] rounded animate-pulse" />
            <div className="h-8 w-32 bg-[#F5F5F7] rounded animate-pulse" />
            <div className="h-12 w-full bg-[#F5F5F7] rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-24 text-center">
        <h2 className="text-2xl font-bold text-[#141B16] mb-4">Product not found</h2>
        <Link to="/store" className="text-[14px] text-[#5B6660] hover:text-[#1B2A4A] transition inline-flex items-center gap-1 justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back to store
        </Link>
      </div>
    )
  }

  const aliases = product.product_aliases?.map((a) => a.alias) || []
  const certificates = product.certificates || []
  const dosage = product.dosage || '10MG'
  const category = product.compound_type || 'Research Peptides'
  const sku = skuFor(product)

  const bundleOptions = [
    { qty: 1, label: '1 Bottle', discount: null, badge: null },
    { qty: 2, label: '2 Bottles', discount: '5% off', badge: 'MOST POPULAR' },
    { qty: 3, label: '3+ Bottles', discount: '7.5% off', badge: 'BEST VALUE' },
  ]

  const unitPrice = product.price * (selectedBundle === 2 ? 0.95 : selectedBundle >= 3 ? 0.925 : 1)
  const totalPrice = unitPrice * selectedBundle * quantity
  const saved = product.price * selectedBundle * quantity - totalPrice

  const techSpecs = [
    ['Product Name', `${product.name} ${dosage}`],
    ['Form', 'Lyophilized powder'],
    ['Purity', '>99%'],
    ['Verification', 'Reverse-phase HPLC with UV detection; endotoxin verified via LAL assay'],
    ['Packaging', 'Sealed vial with rubber stopper, packaged in a light-shielding box'],
    ['Storage', 'Store at 2–8 °C. Protect from light and moisture. Keep tightly sealed.'],
    ['Stability', 'Stable for 24+ months under proper storage conditions'],
  ]

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 label-mono !text-[11px] text-[#5B6660] flex items-center gap-2 flex-wrap">
        <Link to="/" className="hover:text-[#1B2A4A] transition">Home</Link>
        <Chevron />
        <Link to="/store" className="hover:text-[#1B2A4A] transition">Shop</Link>
        <Chevron />
        <span className="text-[#141B16]">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <div className="relative rounded-[28px] overflow-hidden border border-[#1B2A4A]/[0.08] flex items-center justify-center min-h-[420px] md:min-h-[560px]"
          style={{ background: 'linear-gradient(160deg, #F2F4F2 0%, #FFFFFF 70%)' }}>
          <div className="orbit-watermark" />
          <img src={getPrimaryImage(product)} alt={product.name} className="relative w-[68%] max-w-[360px] h-auto object-contain" style={{ maxHeight: '460px' }} />
        </div>

        {/* Buy box */}
        <div className="py-1">
          <h1 className="text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold text-[#141B16] tracking-[-0.03em] mb-3">{product.name}</h1>
          <div className="text-[clamp(1.6rem,3vw,2rem)] font-extrabold text-[#C9A96E] mb-4">${totalPrice.toFixed(2)}</div>

          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A96E]/40 px-3.5 py-1.5 label-mono !text-[11px] text-[#1B2A4A] mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
            Bundle &amp; save up to 7.5%
          </span>

          {/* Aliases */}
          {aliases.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {aliases.map((a) => (
                <span key={a} className="px-3 py-1.5 rounded-full bg-[#F2F4F2] text-[11px] text-[#5B6660] font-medium">{a}</span>
              ))}
            </div>
          )}

          {/* Bundle selector */}
          <div className="mb-6">
            <p className="label-mono !text-[11px] text-[#5B6660] mb-2.5">Bundle</p>
            <div className="space-y-2">
              {bundleOptions.map((b) => (
                <button
                  key={b.qty}
                  onClick={() => setSelectedBundle(b.qty)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-[14px] border transition text-left ${
                    selectedBundle === b.qty ? 'border-[#1B2A4A] bg-[#1B2A4A]/[0.04]' : 'border-[#E3E6E3] hover:border-[#C9D0C9]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedBundle === b.qty ? 'border-[#1B2A4A]' : 'border-[#C9D0C9]'}`}>
                      {selectedBundle === b.qty && <span className="w-2 h-2 rounded-full bg-[#1B2A4A]" />}
                    </span>
                    <span className="text-[14px] text-[#141B16] font-medium">{b.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {b.discount && <span className="text-[12px] text-[#5B6660]">{b.discount}</span>}
                    {b.badge && <span className="label-mono !text-[9px] bg-[#C9A96E] text-[#06210F] px-2 py-1 rounded-full">{b.badge}</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <p className="label-mono !text-[11px] text-[#5B6660] mb-2.5">Quantity</p>
            <div className="inline-flex items-center border border-[#E3E6E3] rounded-full">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-11 h-11 flex items-center justify-center text-[#141B16] hover:bg-[#F2F4F2] rounded-l-full transition">−</button>
              <span className="w-12 text-center text-[14px] font-medium text-[#141B16]">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-11 h-11 flex items-center justify-center text-[#141B16] hover:bg-[#F2F4F2] rounded-r-full transition">+</button>
            </div>
            {saved > 0 && <span className="ml-3 text-[13px] text-[#C9A96E] font-semibold">You save ${saved.toFixed(2)}</span>}
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className={`btn-brand w-full text-[15px] font-semibold py-4 rounded-[14px] transition ${added ? 'bg-[#C9A96E] text-[#06210F]' : 'bg-[#1B2A4A] text-white hover:bg-[#152440]'}`}
          >
            {added ? '✓ Added to cart' : 'Add to Cart'}
          </button>

          {/* Data rows */}
          <dl className="mt-7 border-t border-black/[0.08] pt-5 space-y-3">
            <div className="flex items-center gap-4">
              <dt className="label-mono !text-[11px] text-[#5B6660] w-24">SKU</dt>
              <dd className="text-[13px] font-mono text-[#141B16]">{sku}</dd>
            </div>
            <div className="flex items-center gap-4">
              <dt className="label-mono !text-[11px] text-[#5B6660] w-24">Category</dt>
              <dd className="text-[13px]"><Link to="/store" className="text-[#1B2A4A] font-medium hover:underline">{category}</Link></dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Long-form content */}
      <div className="max-w-[760px] mt-16 lg:mt-20 space-y-12">
        {product.description && (
          <section>
            <h2 className="text-[24px] font-extrabold text-[#141B16] tracking-tight mb-4">Product Description</h2>
            <p className="text-[15px] text-[#5B6660] leading-relaxed">
              {product.description}
            </p>
          </section>
        )}

        <section>
          <h2 className="text-[24px] font-extrabold text-[#141B16] tracking-tight mb-4">Technical Specifications</h2>
          <ul className="space-y-2.5">
            {techSpecs.map(([label, value]) => (
              <li key={label} className="text-[14px] text-[#5B6660] leading-relaxed">
                <span className="font-bold text-[#141B16]">{label}:</span> {value}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-[24px] font-extrabold text-[#141B16] tracking-tight mb-4">Intended Use</h2>
          <p className="text-[15px] text-[#5B6660] leading-relaxed mb-4">
            This product is intended <span className="font-bold text-[#141B16]">strictly for qualified laboratory research</span>. It is not for human or veterinary consumption and must not be used as a drug, food additive, cosmetic, or household item.
          </p>
          <p className="text-[15px] text-[#5B6660] leading-relaxed">
            <span className="font-bold text-[#141B16]">Disclaimer:</span> This compound is sold for in vitro research and educational purposes only. It has not been evaluated by the FDA and is not intended to diagnose, treat, cure, or prevent any disease. All buyers must be authorized research personnel or institutions. By purchasing, you confirm you are a qualified professional conducting lawful scientific research.
          </p>
        </section>

        <div className="rounded-2xl border-l-4 border-[#C9A96E] bg-[#F2F4F2] px-5 py-5">
          <p className="label-mono !text-[11px] text-[#1B2A4A] mb-2">For Research Use Only</p>
          <p className="text-[14px] text-[#5B6660] leading-relaxed">This product is intended solely for in vitro laboratory research and is not for human or animal consumption.</p>
        </div>

        {/* CoA */}
        {certificates.length > 0 && (
          <section>
            <h2 className="text-[24px] font-extrabold text-[#141B16] tracking-tight mb-2">Certificate of Analysis</h2>
            <p className="text-[14px] text-[#5B6660] mb-6">Independent lab-verified testing results</p>
            <div className="overflow-x-auto rounded-2xl border border-black/[0.08]">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="border-b border-black/[0.08] bg-[#F7F8F7]">
                    {['Lot #', 'Purity', 'Labeled', 'Actual', 'Tested'].map((h) => (
                      <th key={h} className="text-left py-3 px-4 label-mono !text-[10px] text-[#5B6660]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((row) => (
                    <tr key={row.lot_number} className="border-b border-black/[0.05] last:border-0">
                      <td className="py-3.5 px-4 font-mono text-[13px] text-[#141B16]">{row.lot_number}</td>
                      <td className="py-3.5 px-4 text-[#C9A96E] font-semibold">{row.purity}%</td>
                      <td className="py-3.5 px-4 text-[#5B6660]">{row.labeled_amount}</td>
                      <td className="py-3.5 px-4 text-[#141B16] font-medium">{row.actual_amount}</td>
                      <td className="py-3.5 px-4 text-[#5B6660]">{row.tested_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
