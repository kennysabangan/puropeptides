// Mono chapter-label eyebrow, e.g. "01  MISSION" or "— RESEARCH-GRADE PEPTIDES".
export default function SectionEyebrow({ number, children, dark = false, className = '' }) {
  const muted = dark ? 'text-white/45' : 'text-[#5B6660]'
  return (
    <div className={`label-mono flex items-center gap-2.5 ${className}`}>
      {number != null ? (
        <span className={muted}>{number}</span>
      ) : (
        <span className="text-[#2ECC6A]">—</span>
      )}
      <span className="text-[#2ECC6A]">{children}</span>
    </div>
  )
}
