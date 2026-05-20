import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProduct } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import { getPrimaryImage, getGalleryImages } from '../lib/productImage'

export default function ProductPage() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedBundle, setSelectedBundle] = useState(1)
  const [showCoa, setShowCoa] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getProduct(id)
      .then(data => { setProduct(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product, quantity * selectedBundle, '10MG', selectedBundle)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8 md:py-14">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <div className="bg-[#F5F5F7] rounded-[24px] min-h-[380px] md:min-h-[520px] animate-pulse" />
          <div className="py-2 space-y-4">
            <div className="h-4 w-24 bg-[#F5F5F7] rounded animate-pulse" />
            <div className="h-10 w-48 bg-[#F5F5F7] rounded animate-pulse" />
            <div className="h-20 w-full bg-[#F5F5F7] rounded animate-pulse" />
            <div className="h-8 w-32 bg-[#F5F5F7] rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-24 text-center">
        <h2 className="text-2xl font-bold text-[#1D1D1F] mb-4">Product not found</h2>
        <Link to="/store" className="text-[14px] text-[#86868B] hover:text-[#1D1D1F] transition flex items-center gap-1 justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to store
        </Link>
      </div>
    )
  }

  const aliases = product.product_aliases?.map(a => a.alias) || []
  const certificates = product.certificates || []

  const bundleOptions = [
    { qty: 1, label: '1 Bottle', discount: null, badge: null },
    { qty: 2, label: '2 Bottles', discount: '5% off', badge: 'MOST POPULAR', color: 'teal' },
    { qty: 3, label: '3+ Bottles', discount: '7.5% off', badge: 'BEST VALUE', color: 'amber' },
  ]

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8 md:py-14">
      {/* Breadcrumb */}
      <nav className="mb-8 text-[13px] text-[#86868B] flex items-center gap-2">
        <Link to="/store" className="hover:text-[#1D1D1F] transition">Store</Link>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
        <span className="text-[#1D1D1F] font-medium">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        {/* Image Panel */}
        <div className="bg-[#F5F5F7] rounded-[24px] p-8 md:p-12 flex flex-col items-center justify-center min-h-[380px] md:min-h-[520px]">
          <img src={getPrimaryImage(product)} alt={product.name} className="w-40 h-auto object-contain" style={{ maxHeight: '340px' }} />
        </div>

        {/* Details Panel */}
        <div className="py-2">
          {product.category && <p className="text-[13px] text-[#86868B] mb-1">{product.category}</p>}
          <h1 className="text-[clamp(2rem,4vw,3rem)] font-bold text-[#1D1D1F] tracking-[-0.03em] mb-4">{product.name}</h1>

          {/* Aliases */}
          {aliases.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {aliases.map(a => (
                <span key={a} className="px-3 py-1.5 rounded-full bg-[#F5F5F7] text-[11px] text-[#86868B] font-medium">{a}</span>
              ))}
            </div>
          )}

          {/* Description */}
          {product.description && (
            <p className="text-[#86868B] text-[14px] leading-relaxed mb-7">{product.description}</p>
          )}

          {/* Dosage Selector */}
          <div className="mb-5">
            <label className="text-[12px] font-medium text-[#86868B] uppercase tracking-wider mb-2 block">Dosage</label>
            <span className="inline-flex items-center bg-[#1D1D1F] text-white text-[13px] font-medium px-5 py-2.5 rounded-full">
              10MG
            </span>
          </div>

          {/* Quantity */}
          <div className="mb-7">
            <label className="text-[12px] font-medium text-[#86868B] uppercase tracking-wider mb-2 block">Quantity</label>
            <div className="inline-flex items-center border border-[#E8E8ED] rounded-full">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-11 h-11 flex items-center justify-center text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-l-full transition"
              >−</button>
              <span className="w-12 text-center text-[14px] font-medium text-[#1D1D1F]">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-11 h-11 flex items-center justify-center text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-r-full transition"
              >+</button>
            </div>
          </div>

          {/* Price */}
          <div className="mb-7">
            {(() => {
              const unitPrice = product.price * (selectedBundle === 2 ? 0.95 : selectedBundle >= 3 ? 0.925 : 1)
              const totalPrice = unitPrice * selectedBundle * quantity
              const originalTotal = product.price * selectedBundle * quantity
              const saved = originalTotal - totalPrice
              return (
                <div>
                  <span className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-[#1D1D1F]">${totalPrice.toFixed(2)}</span>
                  {saved > 0 && (
                    <span className="ml-2 text-[14px] text-[#34C759] font-medium">You save ${saved.toFixed(2)}</span>
                  )}
                  <p className="text-[13px] text-[#86868B] mt-1">${unitPrice.toFixed(2)} per bottle</p>
                </div>
              )
            })()}
          </div>

          {/* Bundle & Save */}
          <div className="mb-7">
            <h3 className="text-[13px] font-semibold text-[#1D1D1F] mb-3">Bundle & Save</h3>
            <div className="space-y-2">
              {bundleOptions.map(b => (
                <button
                  key={b.qty}
                  onClick={() => setSelectedBundle(b.qty)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-[14px] border transition text-left ${
                    selectedBundle === b.qty ? 'border-[#1D1D1F] bg-[#F5F5F7]' : 'border-[#E8E8ED] hover:border-[#D1D1D6]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedBundle === b.qty ? 'border-[#1D1D1F]' : 'border-[#D1D1D6]'}`}>
                      {selectedBundle === b.qty && <div className="w-2 h-2 rounded-full bg-[#1D1D1F]" />}
                    </div>
                    <span className="text-[14px] text-[#1D1D1F] font-medium">{b.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {b.discount && <span className="text-[12px] text-[#86868B]">{b.discount}</span>}
                    {b.badge && (
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                        b.color === 'teal' ? 'bg-[#30D5C8] text-white' : 'bg-[#FFB800] text-white'
                      }`}>
                        {b.badge}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-8 relative">
            <button
              onClick={() => setShowCoa(!showCoa)}
              className="px-6 py-3.5 rounded-full border border-[#1D1D1F] text-[#1D1D1F] text-[14px] font-medium hover:bg-[#F5F5F7] transition"
            >
              View CoA
            </button>
            <button
              onClick={handleAddToCart}
              className={`btn-apple flex-1 text-[14px] font-medium py-3.5 rounded-full transition-all ${added ? 'bg-[#34C759] text-white' : 'bg-[#1D1D1F] text-white'}`}
            >
              {added ? '✓ Added!' : 'Add to Cart'}
            </button>
          </div>

          {/* Trust Strip */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: '🚚', title: 'Free Shipping', sub: 'Over $150' },
              { icon: '🛡️', title: 'Protection', sub: 'Damage covered' },
              { icon: '🔒', title: 'Secure', sub: '256-bit SSL' },
            ].map(t => (
              <div key={t.title} className="text-center p-3.5 rounded-[14px] bg-[#F5F5F7]">
                <div className="text-lg mb-1">{t.icon}</div>
                <p className="text-[11px] font-semibold text-[#1D1D1F]">{t.title}</p>
                <p className="text-[10px] text-[#86868B]">{t.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CoA Section */}
      {showCoa && certificates.length > 0 && (
        <div className="mt-12 bg-[#FBFBFD] rounded-[20px] p-7 md:p-9">
          <h3 className="font-bold text-xl text-[#1D1D1F] mb-2">Certificate of Analysis</h3>
          <p className="text-[14px] text-[#86868B] mb-6">Independent lab-verified testing results</p>
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="border-b border-[#E8E8ED]">
                  <th className="text-left py-3 font-medium text-[#86868B] text-[12px] uppercase tracking-wider">Lot #</th>
                  <th className="text-left py-3 font-medium text-[#86868B] text-[12px] uppercase tracking-wider">Purity</th>
                  <th className="text-left py-3 font-medium text-[#86868B] text-[12px] uppercase tracking-wider">Labeled</th>
                  <th className="text-left py-3 font-medium text-[#86868B] text-[12px] uppercase tracking-wider">Actual</th>
                  <th className="text-left py-3 font-medium text-[#86868B] text-[12px] uppercase tracking-wider">Tested</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map(row => (
                  <tr key={row.lot_number} className="border-b border-[#E8E8ED]/60">
                    <td className="py-3.5 font-medium text-[#1D1D1F]">{row.lot_number}</td>
                    <td className="py-3.5 text-[#34C759] font-semibold">{row.purity}%</td>
                    <td className="py-3.5 text-[#86868B]">{row.labeled_amount}</td>
                    <td className="py-3.5 text-[#1D1D1F] font-medium">{row.actual_amount}</td>
                    <td className="py-3.5 text-[#86868B]">{row.tested_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
