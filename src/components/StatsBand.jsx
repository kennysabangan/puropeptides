// Oversized figures over mono captions, hairline-separated. Used on the dark hero base.
const STATS = [
  { value: '64', caption: 'Peptides in catalog' },
  { value: '100%', caption: 'Third-party verified' },
  { value: '<24h', caption: 'Order turnaround' },
  { value: '$200+', caption: 'Free 2-day shipping' },
]

export default function StatsBand() {
  return (
    <div className="border-t border-white/10 relative">
      {/* Lighter gradient at bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1A2235] to-transparent pointer-events-none" />
      {STATS.map((s, i) => (
        <div
          key={s.caption}
          className={`border-b border-white/10 max-w-[1200px] mx-auto px-6 lg:px-10 py-6 flex items-baseline gap-5 ${i === STATS.length - 1 ? 'pb-8' : ''}`}
        >
          <span className="text-white font-extrabold tracking-tight text-[40px] sm:text-[48px] leading-none tabular-nums">
            {s.value}
          </span>
          <span className="label-mono text-white/45">{s.caption}</span>
        </div>
      ))}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </div>
  )
}
