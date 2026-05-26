import { useRef, useState } from 'react'

const Magnifier = () => (
  <svg viewBox="0 0 120 120" fill="none" stroke="#2ECC6A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24">
    <circle cx="50" cy="50" r="34" />
    <line x1="75" y1="75" x2="100" y2="100" />
    <path d="M38 50l9 9 18-20" />
  </svg>
)
const Microscope = () => (
  <svg viewBox="0 0 120 120" fill="none" stroke="#2ECC6A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24">
    <path d="M48 30l18 18-12 12-18-18z" />
    <path d="M57 57l14 14a22 22 0 0 1-28 28" />
    <line x1="30" y1="100" x2="92" y2="100" />
    <path d="M40 100a26 26 0 0 0 40-21" />
    <line x1="60" y1="22" x2="68" y2="30" />
  </svg>
)
const Shield = () => (
  <svg viewBox="0 0 120 120" fill="none" stroke="#2ECC6A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24">
    <path d="M60 18l34 13v22c0 21-15 38-34 44-19-6-34-23-34-44V31z" />
    <path d="M44 58l12 12 22-26" />
  </svg>
)

const SLIDES = [
  {
    title: '3rd-Party Verified COAs and a Proven Track Record',
    body: 'Every Amino Select compound is verified through rigorous third-party testing by accredited American laboratories. Our Certificates of Analysis confirm purity, identity, and potency — so what is on the label matches what is in the vial.',
    Icon: Magnifier,
  },
  {
    title: 'Lab Quality, No Markup',
    body: 'Our approach is rooted in precision, discipline, and integrity. We operate with the same mindset used to maintain mission-critical reliability: attention to detail, traceable processes, and continuous improvement.',
    Icon: Microscope,
  },
  {
    title: 'Shipment Protection on Every Order',
    body: 'Every order ships with free shipment protection. If a package is lost, damaged, or stolen in transit, we make it right — reshipped or refunded, no runaround.',
    Icon: Shield,
  },
]

export default function DifferenceCarousel() {
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)

  const onScroll = () => {
    const el = trackRef.current
    if (!el) return
    const i = Math.round(el.scrollLeft / el.clientWidth)
    if (i !== active) setActive(i)
  }

  const goTo = (i) => {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0"
      >
        {SLIDES.map(({ title, body, Icon }) => (
          <div key={title} className="snap-center shrink-0 w-full px-1">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 sm:p-10">
              <h3 className="text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-snug mb-4 max-w-[460px]">
                {title}
              </h3>
              <p className="text-[14px] sm:text-[15px] text-white/65 leading-relaxed mb-9 max-w-[520px]">
                {body}
              </p>
              <div className="rounded-[20px] border border-white/10 bg-[#0A1A0F]/60 py-10 flex items-center justify-center relative overflow-hidden">
                <div className="orbit-watermark" />
                <Icon />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-7">
        {SLIDES.map((s, i) => (
          <button
            key={s.title}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? 'w-7 bg-[#2ECC6A]' : 'w-1.5 bg-white/25 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
