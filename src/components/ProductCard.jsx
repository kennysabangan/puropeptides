import { Link } from 'react-router-dom'
import { getPrimaryImage } from '../lib/productImage'

export default function ProductCard({ product }) {
  const bgColor = product.bg_color || '#EDEDED'
  const imgSrc = getPrimaryImage(product)
  const href = `/product/${product.slug || product.id}`
  const detail = product.dosage || product.compound_type || product.categories?.[0]?.name || ''

  return (
    <div className="group h-full">
      <Link
        to={href}
        aria-label={`${product.name} — $${product.price.toFixed(2)}`}
        className="h-full flex flex-col rounded-[20px] overflow-hidden bg-white border border-[#1a5c3a]/[0.08] product-card-premium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a5c3a]/30 focus-visible:ring-offset-2"
      >
        {/* Image with COA pill + orbit watermark */}
        <div
          className="relative aspect-[4/5] flex items-center justify-center overflow-hidden"
          style={{ background: `linear-gradient(160deg, ${bgColor} 0%, #FFFFFF 100%)` }}
        >
          <div className="orbit-watermark" />
          <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 label-mono !text-[10px] text-[#1a5c3a] border border-[#1a5c3a]/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC6A]" />
            COA
          </span>
          <img
            src={imgSrc}
            alt={product.name}
            className="relative w-full h-full object-contain p-4 lg:p-5 transition-transform duration-500 group-hover:scale-[1.07]"
            loading="lazy"
            draggable="false"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col flex-grow gap-3 p-4 lg:p-5">
          <h3 className="font-bold text-[15px] lg:text-[16px] text-[#141B16] leading-snug line-clamp-2 min-w-0">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-auto pt-1">
            {detail && <span className="label-mono !text-[11px] text-[#5B6660] truncate pr-2">{detail}</span>}
            <span className="font-bold text-[18px] lg:text-[20px] text-[#2ECC6A] ml-auto">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}
