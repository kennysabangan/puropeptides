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
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-poppins font-bold text-[#0B0B0B] mb-4">Product not found</h2>
        <Link to="/store" className="text-sm text-[#555555] hover:underline">← Back to store</Link>
      </div>
    )
  }

  const bundleOptions = [
    { qty: 1, label: '1 Bottle', discount: null, badge: null },
    { qty: 2, label: '2 Bottles', discount: '5% off', badge: 'MOST POPULAR', color: 'teal' },
    { qty: 3, label: '3+ Bottles', discount: '7.5% off', badge: 'BEST VALUE', color: 'amber' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[#555555]">
        <Link to="/store" className="hover:underline">Store</Link>
        <span className="mx-2">/</span>
        <span className="text-[#0B0B0B] font-medium">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Panel */}
        <div className="bg-[#F8F8F8] rounded-3xl p-10 md:p-16 flex items-center justify-center min-h-[350px] md:min-h-[500px]">
          <svg viewBox="0 0 80 160" className="w-28 h-56" fill="none">
            <rect x="28" y="0" width="24" height="16" rx="3" fill="#0B0B0B" opacity="0.15" />
            <rect x="22" y="16" width="36" height="8" rx="2" fill="#0B0B0B" opacity="0.2" />
            <rect x="20" y="24" width="40" height="120" rx="8" fill="white" stroke="#0B0B0B" strokeWidth="2" opacity="0.9" />
            <rect x="28" y="50" width="24" height="3" rx="1.5" fill="#0B0B0B" opacity="0.15" />
            <rect x="28" y="58" width="18" height="3" rx="1.5" fill="#0B0B0B" opacity="0.1" />
            <text x="40" y="85" textAnchor="middle" fill="#0B0B0B" fontSize="7" fontFamily="Poppins" fontWeight="600">{product.name}</text>
          </svg>
        </div>

        {/* Details Panel */}
        <div>
          {detail && <p className="text-sm text-[#5A5A5A] mb-1">{detail.subtitle}</p>}
          <h1 className="font-poppins text-4xl md:text-5xl font-bold text-[#0B0B0B] mb-3">{product.name}</h1>

          {/* Aliases */}
          {detail && (
            <div className="flex flex-wrap gap-2 mb-4">
              {detail.aliases.map(a => (
                <span key={a} className="px-3 py-1 rounded-full border border-[#E4E4E7] text-xs text-[#555555]">{a}</span>
              ))}
            </div>
          )}

          {/* Description */}
          {detail && (
            <p className="text-[#555555] text-sm leading-relaxed mb-6">{detail.description}</p>
          )}

          {/* Dosage Selector */}
          <div className="mb-5">
            <label className="text-xs font-medium text-[#555555] mb-2 block">Dosage</label>
            <div className="inline-flex items-center bg-[#0B0B0B] text-white text-sm font-medium px-5 py-2 rounded-full">
              10MG
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="text-xs font-medium text-[#555555] mb-2 block">Quantity</label>
            <div className="inline-flex items-center border border-[#E4E4E7] rounded-full">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-[#0B0B0B] hover:bg-gray-50 rounded-l-full transition"
              >
                −
              </button>
              <span className="w-12 text-center text-sm font-medium text-[#0B0B0B]">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-[#0B0B0B] hover:bg-gray-50 rounded-r-full transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <span className="font-poppins text-3xl font-bold text-[#0B0B0B]">${(product.price * quantity).toFixed(2)}</span>
          </div>

          {/* Bundle & Save */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-[#0B0B0B] mb-3">Bundle & Save</h3>
            <div className="space-y-2">
              {bundleOptions.map(b => (
                <button
                  key={b.qty}
                  onClick={() => setSelectedBundle(b.qty)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition text-left ${
                    selectedBundle === b.qty ? 'border-[#0B0B0B] bg-[#FAFAFA]' : 'border-[#E4E4E7] hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedBundle === b.qty ? 'border-[#0B0B0B]' : 'border-gray-300'}`}>
                      {selectedBundle === b.qty && <div className="w-2 h-2 rounded-full bg-[#0B0B0B]" />}
                    </div>
                    <span className="text-sm text-[#0B0B0B] font-medium">{b.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {b.discount && <span className="text-xs text-[#555555]">{b.discount}</span>}
                    {b.badge && (
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        b.color === 'teal' ? 'bg-teal-600 text-white' : 'bg-amber-500 text-white'
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
              className="px-6 py-3 rounded-full border border-[#0B0B0B] text-[#0B0B0B] text-sm font-medium hover:bg-gray-50 transition"
            >
              View CoA
            </button>
            <button className="flex-1 bg-[#0B0B0B] text-white text-sm font-medium py-3 rounded-full hover:bg-[#131315] transition">
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
              <div key={t.title} className="text-center p-3 rounded-xl bg-[#FAFAFA]">
                <div className="text-lg mb-1">{t.icon}</div>
                <p className="text-xs font-medium text-[#0B0B0B]">{t.title}</p>
                <p className="text-[10px] text-[#555555]">{t.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CoA Section */}
      {showCoa && detail && (
        <div className="mt-10 bg-[#FAFAFA] rounded-2xl p-6 md:p-8">
          <h3 className="font-poppins font-bold text-xl text-[#0B0B0B] mb-2">Certificate of Analysis</h3>
          <p className="text-sm text-[#555555] mb-6">Independent lab-verified testing results</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E4E4E7]">
                  <th className="text-left py-3 font-medium text-[#555555]">Lot #</th>
                  <th className="text-left py-3 font-medium text-[#555555]">Purity</th>
                  <th className="text-left py-3 font-medium text-[#555555]">Labeled</th>
                  <th className="text-left py-3 font-medium text-[#555555]">Actual</th>
                  <th className="text-left py-3 font-medium text-[#555555]">Tested</th>
                </tr>
              </thead>
              <tbody>
                {detail.coa.map(row => (
                  <tr key={row.lot} className="border-b border-[#E8E8E8]">
                    <td className="py-3 font-medium text-[#0B0B0B]">{row.lot}</td>
                    <td className="py-3 text-[#16A34A] font-semibold">{row.purity}%</td>
                    <td className="py-3 text-[#555555]">{row.labeled}</td>
                    <td className="py-3 text-[#0B0B0B] font-medium">{row.actual}</td>
                    <td className="py-3 text-[#555555]">{row.tested}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Compound Info */}
      {detail && (
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="bg-[#FAFAFA] rounded-2xl p-6">
            <h3 className="font-poppins font-semibold text-[#0B0B0B] mb-4">Compound Information</h3>
            <div className="space-y-2.5">
              {Object.entries(detail.compoundInfo).map(([key, val]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-[#555555] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-[#0B0B0B] font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#FAFAFA] rounded-2xl p-6">
            <h3 className="font-poppins font-semibold text-[#0B0B0B] mb-4">Storage</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-[#555555]">Lyophilized</p>
                <p className="text-sm font-medium text-[#0B0B0B]">{detail.storage.lyophilized}</p>
              </div>
              <div>
                <p className="text-sm text-[#555555]">Reconstituted</p>
                <p className="text-sm font-medium text-[#0B0B0B]">{detail.storage.reconstituted}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
