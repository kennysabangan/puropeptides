import { Link } from 'react-router-dom'
import { getPrimaryImage } from '../lib/productImage'

const bottleColors = [
  '#E8D5F5', '#D5E8F5', '#F5E8D5', '#D5F5E8',
  '#F5D5E8', '#F5F5D5', '#D5F5F5', '#E8E8D5',
]

export default function ProductCard({ product, index = 0 }) {
  const bgColor = product.bg_color || bottleColors[index % bottleColors.length]
  const imgSrc = getPrimaryImage(product)
  const href = `/product/${product.slug || product.id}`
  const subtitle = product.categories?.[0]?.name || product.subtitle || ''

  return (
    <div className="group h-full">
      <Link
        to={href}
        aria-label={`${product.name} — from $${product.price.toFixed(2)}`}
        className="h-full flex flex-col rounded-2xl overflow-hidden bg-white border border-[#1a5c3a]/[0.06] product-card-premium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a5c3a]/30 focus-visible:ring-offset-2"
      >
        {/* Image — taller ratio, less padding */}
        <div className="aspect-[3/4] flex items-center justify-center overflow-hidden relative" style={{ backgroundColor: bgColor }}>
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-contain p-3 lg:p-4 transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            draggable="false"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col flex-grow gap-2.5 p-4 lg:p-5">
          {subtitle && (
            <p className="text-[11px] lg:text-[12px] font-medium uppercase tracking-widest text-[#1a5c3a]/50 line-clamp-1">{subtitle}</p>
          )}

          <h3 className="font-semibold text-[14px] lg:text-[15px] text-[#1D1D1F] leading-snug line-clamp-2 min-w-0">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mt-auto pt-1">
            <div>
              <span className="block text-[10px] text-[#86868B] mb-0.5 uppercase tracking-wider">From</span>
              <span className="block font-bold text-[18px] lg:text-[20px] text-[#1a5c3a]">
                ${product.price.toFixed(2)}
              </span>
            </div>
            <span className="h-9 px-5 rounded-full bg-[#1a5c3a] text-white text-[12px] font-semibold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-0 translate-y-1">
              View
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}
