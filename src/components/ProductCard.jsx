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

  return (
    <Link
      to={href}
      aria-label={`${product.name} — $${product.price.toFixed(2)}`}
      className="group block card-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F]/30 focus-visible:ring-offset-2 rounded-2xl"
    >
      <div className="rounded-2xl overflow-hidden mb-3" style={{ backgroundColor: bgColor }}>
        <div className="aspect-square flex items-center justify-center p-8">
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            draggable="false"
          />
        </div>
      </div>
      <div className="flex items-end justify-between gap-3 px-1">
        <div className="min-w-0">
          <h3 className="font-semibold text-[14px] text-[#1D1D1F] truncate">{product.name}</h3>
          <p className="text-[13px] text-[#86868B] mt-0.5">${product.price.toFixed(2)}</p>
        </div>
        <span
          aria-hidden="true"
          className="text-[#1D1D1F]/50 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#1D1D1F]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
