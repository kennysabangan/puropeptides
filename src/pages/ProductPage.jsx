import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { products, bpc157Detail } from '../data/products'

export default function ProductPage() {
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [selectedBundle, setSelectedBundle] = useState(1)
  const [showCoa, setShowCoa] = useState(false)

  const isBpc = id === 'bpc-157'
  const product = isBpc ? bpc157Detail : products.find(p => p.id === id)
  const detail = isBpc ? bpc157Detail : null

  if (!product) {
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
        <div className="bg-[#F5F5F7] rounded-[24px] p-12 md:p-20 flex items-center justify-center min-h-[380px] md:min-h-[520px]">
          <svg viewBox="0 0 80 160" className="w-28 h-56" fill="none">
            <rect x="28" y="0" width="24" height="16" rx="3" fill="#0B0B0B" opacity="0.1" />
            <rect x="22" y="16" width="36" height="8" rx="2" fill="#0B0B0B" opacity="0.12" />
            <rect x="20" y="24" width="40" height="120" rx="10" fill="white" stroke="#0B0B0B" strokeWidth="1.5" opacity="0.85" />
            <rect x="28" y="50" width="24" height="3" rx="1.5" fill="#0B0B0B" opacity="0.1" />
            <rect x="28" y="58" width="18" height="3" rx="1.5" fill="#0B0B0B" opacity="0.06" />
            <text x="40" y="85" textAnchor="middle" fill="#0B0B0B" fontSize="7" fontFamily="Inter" fontWeight="600">{product.name}</text>
          </svg>
        </div>

        {/* Details Panel */}
        <div className="py-2">
          {detail && <p className="text-[13px] text-[#86868B] mb-1">{detail.subtitle}</p>}
          <h1 className="text-[clamp(2rem,4vw,3rem)] font-bold text-[#1D1D1F] tracking-[-0.03em] mb-4">{product.name}</h1>

          {/* Aliases */}
          {detail && (
            <div className="flex flex-wrap gap-2 mb-5">
              {detail.aliases.map(a => (
                <span key={a} className="px-3 py-1.5 rounded-full bg-[#F5F5F7] text-[11px] text-[#86868B] font-medium">{a}</span>
              ))}
            </div>
          )}

          {/* Description */}
          {detail && (
            <p className="text-[#86868B] text-[14px] leading-relaxed mb-7">{detail.description}</p>
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
              >
                −
              </button>
              <span className="w-12 text-center text-[14px] font-medium text-[#1D1D1F]">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-11 h-11 flex items-center justify-center text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-r-full transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="mb-7">
            <span className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-[#1D1D1F]">${(product.price * quantity).toFixed(2)}</span>
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
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setShowCoa(!showCoa)}
              className="px-6 py-3.5 rounded-full border border-[#1D1D1F] text-[#1D1D1F] text-[14px] font-medium hover:bg-[#F5F5F7] transition"
            >
              View CoA
            </button>
            <button className="btn-apple flex-1 bg-[#1D1D1F] text-white text-[14px] font-medium py-3.5 rounded-full">
              Add to Cart
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
      {showCoa && detail && (
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
                {detail.coa.map(row => (
                  <tr key={row.lot} className="border-b border-[#E8E8ED]/60">
                    <td className="py-3.5 font-medium text-[#1D1D1F]">{row.lot}</td>
                    <td className="py-3.5 text-[#34C759] font-semibold">{row.purity}%</td>
                    <td className="py-3.5 text-[#86868B]">{row.labeled}</td>
                    <td className="py-3.5 text-[#1D1D1F] font-medium">{row.actual}</td>
                    <td className="py-3.5 text-[#86868B]">{row.tested}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Compound Info */}
      {detail && (
        <div className="mt-8 grid md:grid-cols-2 gap-5">
          <div className="bg-[#FBFBFD] rounded-[20px] p-7">
            <h3 className="font-semibold text-[15px] text-[#1D1D1F] mb-5">Compound Information</h3>
            <div className="space-y-3">
              {Object.entries(detail.compoundInfo).map(([key, val]) => (
                <div key={key} className="flex justify-between text-[14px]">
                  <span className="text-[#86868B] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-[#1D1D1F] font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#FBFBFD] rounded-[20px] p-7">
            <h3 className="font-semibold text-[15px] text-[#1D1D1F] mb-5">Storage</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[13px] text-[#86868B]">Lyophilized</p>
                <p className="text-[14px] font-medium text-[#1D1D1F]">{detail.storage.lyophilized}</p>
              </div>
              <div>
                <p className="text-[13px] text-[#86868B]">Reconstituted</p>
                <p className="text-[14px] font-medium text-[#1D1D1F]">{detail.storage.reconstituted}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
