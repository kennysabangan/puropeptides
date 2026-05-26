import { useState, useEffect, useCallback } from 'react'

const SLIDES = [
  {
    title: 'Customer Service Comes First',
    body: 'We are committed to meeting every customer\'s needs through a responsive support email and a dedicated phone line to a live representative. We stand behind the quality of our products and are here to address any questions or concerns you may have.',
    image: '/images/homepage/illustration-support.png',
  },
  {
    title: 'Lab Quality, No Markup',
    body: 'Our approach is rooted in precision, discipline, and integrity. We operate with the same mindset used to maintain mission-critical reliability: attention to detail, traceable processes, and continuous improvement.',
    image: '/images/homepage/illustration-lab-testing.png',
  },
  {
    title: '3rd-Party Verified COAs and a Proven Track Record',
    body: 'Every Amino Select compound is verified through rigorous third-party testing by accredited American laboratories. Our Certificates of Analysis confirm purity, identity, and potency — so what is on the label matches what is in the vial.',
    image: '/images/homepage/illustration-research.png',
  },
]

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
)

export default function DifferenceCarousel() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback((i) => {
    setActive(((i % SLIDES.length) + SLIDES.length) % SLIDES.length)
  }, [])

  const prev = useCallback(() => goTo(active - 1), [active, goTo])
  const next = useCallback(() => goTo(active + 1), [active, goTo])

  // Auto-play every 5s, pause on hover
  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(id)
  }, [paused])

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Track */}
      <div className="overflow-hidden rounded-[28px] border border-white/10">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {SLIDES.map(({ title, body, image }) => (
            <div key={title} className="w-full shrink-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 items-center p-7 sm:p-10">
                {/* Text */}
                <div>
                  <h3 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight leading-snug mb-4">
                    {title}
                  </h3>
                  <p className="text-[15px] sm:text-[16px] text-white/65 leading-relaxed">
                    {body}
                  </p>
                </div>
                {/* Image */}
                <div className="rounded-2xl overflow-hidden bg-white/[0.03]">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-auto object-contain max-h-[280px] sm:max-h-[320px]"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots + Arrows */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition"
        >
          <ChevronLeft />
        </button>
        <div className="flex items-center gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.title}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? 'w-7 h-1.5 rounded-full bg-[#C9A96E]' : 'w-1.5 h-1.5 rounded-full bg-white/25 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
        <button
          onClick={next}
          aria-label="Next slide"
          className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  )
}
