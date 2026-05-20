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
        className="h-full flex flex-col rounded-3xl overflow-hidden bg-[#F9F9F9] card-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F]/30 focus-visible:ring-offset-2"
      >
        {/* Image */}
        <div className="aspect-[4/5] flex items-center justify-center overflow-hidden relative" style={{ backgroundColor: bgColor }}>
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-contain p-6 lg:p-8 transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            draggable="false"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col flex-grow gap-2 p-4 lg:p-5 bg-[#F9F9F9]">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-[15px] lg:text-[16px] text-[#1D1D1F] leading-tight line-clamp-2 min-w-0">
              {product.name}
            </h3>
            <div className="flex-shrink-0 text-right leading-none">
              <span className="block text-[10px] lg:text-[11px] text-[#86868B] mb-0.5">From</span>
              <span className="block font-bold text-[16px] lg:text-[18px] text-[#1D1D1F]">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>

          {subtitle && (
            <p className="text-[12px] lg:text-[13px] text-[#86868B] line-clamp-1">{subtitle}</p>
          )}

          <span className="mt-auto pt-2 block w-full h-9 lg:h-10 rounded-full bg-[#1D1D1F] text-white text-[13px] font-medium flex items-center justify-center group-hover:bg-black transition">
            View
          </span>
        </div>
      </Link>
    </div>
  )
}
