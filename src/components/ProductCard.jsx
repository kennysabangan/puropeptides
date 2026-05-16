import { Link } from 'react-router-dom'

const bottleColors = [
  '#E8D5F5', '#D5E8F5', '#F5E8D5', '#D5F5E8',
  '#F5D5E8', '#F5F5D5', '#D5F5F5', '#E8E8D5',
]

export default function ProductCard({ product, index = 0 }) {
  const bgColor = bottleColors[index % bottleColors.length]

  return (
    <div className="group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="rounded-2xl overflow-hidden bg-[#F8F8F8] mb-3">
          <div
            className="aspect-square flex items-center justify-center p-8 transition-transform group-hover:scale-105"
            style={{ backgroundColor: bgColor }}
          >
            {/* SVG Bottle Placeholder */}
            <svg viewBox="0 0 80 160" className="w-20 h-40" fill="none">
              <rect x="28" y="0" width="24" height="16" rx="3" fill="#0B0B0B" opacity="0.15" />
              <rect x="22" y="16" width="36" height="8" rx="2" fill="#0B0B0B" opacity="0.2" />
              <rect x="20" y="24" width="40" height="120" rx="8" fill="white" stroke="#0B0B0B" strokeWidth="2" opacity="0.9" />
              <rect x="28" y="50" width="24" height="3" rx="1.5" fill="#0B0B0B" opacity="0.15" />
              <rect x="28" y="58" width="18" height="3" rx="1.5" fill="#0B0B0B" opacity="0.1" />
            </svg>
          </div>
        </div>
      </Link>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-poppins font-semibold text-sm text-[#0B0B0B]">{product.name}</h3>
          <p className="text-sm text-[#555555]">${product.price.toFixed(2)}</p>
        </div>
        <Link
          to={`/product/${product.id}`}
          className="bg-[#0B0B0B] text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-[#131315] transition"
        >
          View
        </Link>
      </div>
    </div>
  )
}
