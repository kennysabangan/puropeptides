import { Link } from 'react-router-dom'

const bottleColors = [
  '#E8D5F5', '#D5E8F5', '#F5E8D5', '#D5F5E8',
  '#F5D5E8', '#F5F5D5', '#D5F5F5', '#E8E8D5',
]

export default function ProductCard({ product, index = 0 }) {
  const bgColor = product.bg_color || bottleColors[index % bottleColors.length]
  const imgSrc = `/images/products/${product.slug}/${product.slug}-vial.png`

  return (
    <div className="group card-lift">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="rounded-2xl overflow-hidden mb-4" style={{ backgroundColor: bgColor }}>
          <div className="aspect-square flex items-center justify-center p-8">
            <img src={imgSrc} alt={product.name} className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" loading="lazy" />
          </div>
        </div>
      </Link>
      <div className="flex items-end justify-between">
        <div>
          <h3 className="font-semibold text-[14px] text-[#1D1D1F]">{product.name}</h3>
          <p className="text-[13px] text-[#86868B] mt-0.5">${product.price.toFixed(2)}</p>
        </div>
        <Link
          to={`/product/${product.slug}`}
          className="text-[13px] font-medium text-[#1D1D1F] flex items-center gap-1 hover:gap-1.5 transition-all"
        >
          View
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
