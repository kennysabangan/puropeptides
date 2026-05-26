import { Link } from 'react-router-dom'

// Data-sheet product spotlight (hero). Dark card with image panel + label/value grid.
function Cell({ label, value, accent = false, align = 'left' }) {
  return (
    <div className={align === 'right' ? 'text-right' : ''}>
      <p className="label-mono text-white/40 mb-1.5">{label}</p>
      <p className={`text-[15px] sm:text-[17px] font-bold ${accent ? 'text-[#C9A96E]' : 'text-white'}`}>
        {value}
      </p>
    </div>
  )
}

export default function SpecCard({ name, dosage, price, sku, purity = '≥ 99%', image, href }) {
  return (
    <div className="w-full max-w-[440px] rounded-[28px] border border-white/10 bg-white/[0.03] p-4 sm:p-5 backdrop-blur-sm">
      {/* Image panel */}
      <div className="relative rounded-[20px] bg-white overflow-hidden aspect-[4/3] flex items-center justify-center">
        <div className="orbit-watermark" />
        <img src={image} alt={name} className="relative w-[70%] h-[80%] object-contain" loading="eager" />
      </div>

      {/* Spec grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-5 px-2 pt-6 pb-2">
        <Cell label="Compound" value={`${name}${dosage ? ` / ${dosage}` : ''}`} />
        <Cell label="Unit price" value={`$${price}`} accent align="right" />
        <Cell label="SKU" value={sku} />
        <Cell label="Purity" value={purity} align="right" />
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between border-t border-white/10 mt-4 px-2 pt-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A96E]/40 px-3 py-1.5 label-mono text-[#C9A96E] !text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
          COA Verified
        </span>
        <Link to={href} className="label-mono !text-[11px] text-white hover:text-[#C9A96E] transition inline-flex items-center gap-1.5">
          View
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
