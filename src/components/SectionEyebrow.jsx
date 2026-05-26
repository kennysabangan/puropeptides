// Mono chapter-label eyebrow, e.g. "01  MISSION" or "— RESEARCH-GRADE PEPTIDES".
export default function SectionEyebrow({ number, children, dark = false, className = '' }) {
  const muted = dark ? 'text-white/45' : 'text-[#5B6660]'
  return (
    <div className={`label-mono flex items-center gap-2.5 ${className}`}>
      {number != null ? (
        <span className={`${muted} text-[15px] sm:text-[16px]`}>{number}</span>
      ) : (
        <span className="text-[#C9A96E]">—</span>
      )}
      <span className="text-[#C9A96E]">{children}</span>
    </div>
  )
}
