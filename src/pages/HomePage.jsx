import { useRef } from 'react'
import { Link } from 'react-router-dom'

/* ─── Featured product config ─── */
const featuredProducts = [
  { id: 'ghk-cu',      name: 'GHK-Cu',      subtitle: 'Dermal Compound',                       priceFrom: 29.99, bg: '#DCE7F0' },
  { id: 'nad-plus',    name: 'NAD+',        subtitle: 'Cellular Peptide',                      priceFrom: 69.99, bg: '#F5DCDC' },
  { id: 'glutathione', name: 'Glutathione', subtitle: 'Antioxidant & Detoxification Peptide',  priceFrom: 59.99, bg: '#DCE3EA' },
  { id: 'semax',       name: 'SEMAX',       subtitle: 'Cognitive & Neuroprotective Peptide',   priceFrom: 29.99, bg: '#DDE0EC' },
  { id: 'selank',      name: 'SELANK',      subtitle: 'Cognitive & Anxiolytic Peptide',        priceFrom: 29.99, bg: '#E5E0EC' },
  { id: 'dsip',        name: 'DSIP',        subtitle: 'Circadian Peptide',                     priceFrom: 29.99, bg: '#E8DDE8' },
  { id: 'bpc-157',     name: 'BPC-157',     subtitle: 'Tissue Repair Peptide',                 priceFrom: 39.99, bg: '#DCEEDC' },
  { id: 'tb-500',      name: 'TB-500',      subtitle: 'Tissue Repair Peptide',                 priceFrom: 39.99, bg: '#DCEAEE' },
]

function productImg(id) {
  return `/images/products/${id}/00.png`
}

/* ─── Reusable icons ─── */
const Arrow = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
)

const ChevronLeft = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

const ChevronRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
)

const CardIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
  </svg>
)

const LockIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const VerifiedBadge = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2l2.4 1.8 3 .2.8 2.9 2.4 1.8-1 2.8 1 2.8-2.4 1.8-.8 2.9-3 .2L12 22l-2.4-1.8-3-.2-.8-2.9L3.4 15.3l1-2.8-1-2.8L5.8 7.9l.8-2.9 3-.2z" fill="#34C759"/>
    <path d="M8.5 12.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
)

const TruckIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="6" width="14" height="10" rx="1.5" /><path d="M15 9h4l3 3v4h-7" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" />
  </svg>
)

const FlaskIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3" /><line x1="8" y1="15" x2="16" y2="15" />
  </svg>
)

/* ─── Hero floating vial ─── */
function FloatingVial({ src, alt, className, style }) {
  return <img src={src} alt={alt} className={`absolute select-none drop-shadow-2xl ${className}`} style={style} />
}

/* ─── Featured product card ─── */
function FeaturedCard({ product }) {
  return (
    <div className="flex-shrink-0 w-[260px] sm:w-[280px] bg-white rounded-2xl overflow-hidden border border-black/[0.06] hover:shadow-lg transition">
      <div className="relative h-[260px] flex items-center justify-center overflow-hidden" style={{ background: product.bg }}>
        <img src={productImg(product.id)} alt={product.name} className="w-full h-full object-contain p-6" loading="lazy" />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-[18px] font-semibold text-[#1D1D1F] leading-tight">{product.name}</h3>
          <div className="text-right flex-shrink-0">
            <div className="text-[10px] text-[#86868B] leading-none">From</div>
            <div className="text-[16px] font-semibold text-[#1D1D1F] leading-tight">${product.priceFrom}</div>
          </div>
        </div>
        <p className="text-[12px] text-[#86868B] mb-4 min-h-[2.5em] leading-snug">{product.subtitle}</p>
        <div className="flex gap-2">
          <button className="flex-1 border border-[#1D1D1F]/15 rounded-full py-2 text-[12px] font-medium text-[#1D1D1F] hover:bg-black/5 transition">
            View Studies
          </button>
          <Link to={`/product/${product.id}`} className="flex-1 bg-[#1D1D1F] text-white rounded-full py-2 text-[12px] font-medium text-center hover:opacity-90 transition">
            View
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ─── Feature grid card (large) ─── */
function LargeFeatureCard({ title, body, button, illustration }) {
  return (
    <div className="bg-white/70 rounded-3xl p-8 sm:p-10 relative overflow-hidden min-h-[260px] flex flex-col">
      <h3 className="text-[22px] sm:text-[24px] font-bold text-[#1D1D1F] tracking-tight mb-3 max-w-[420px]">{title}</h3>
      <p className="text-[14px] text-[#1D1D1F]/70 leading-relaxed mb-6 max-w-[420px]">{body}</p>
      <div className="mt-auto">
        <button className="border border-[#1D1D1F] rounded-full px-5 py-2.5 text-[13px] font-medium text-[#1D1D1F] hover:bg-[#1D1D1F] hover:text-white transition">
          {button}
        </button>
      </div>
      <div className="absolute right-6 bottom-6 opacity-50 pointer-events-none">{illustration}</div>
    </div>
  )
}

/* ─── Feature grid card (small) ─── */
function SmallFeatureCard({ title, illustration }) {
  return (
    <div className="bg-white/70 rounded-3xl p-8 relative overflow-hidden min-h-[140px] flex items-center justify-between">
      <h3 className="text-[20px] font-bold text-[#1D1D1F] tracking-tight max-w-[300px]">{title}</h3>
      <div className="opacity-50 pointer-events-none flex-shrink-0">{illustration}</div>
    </div>
  )
}

/* ─── Sketch-style illustrations ─── */
const TestTubeRack = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#1D1D1F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="20" y1="35" x2="100" y2="35" /><line x1="20" y1="80" x2="100" y2="80" />
    {[30, 50, 70, 90].map((x, i) => (
      <g key={i}>
        <line x1={x} y1="35" x2={x} y2="80" />
        <line x1={x + 10} y1="35" x2={x + 10} y2="80" />
        <ellipse cx={x + 5} cy="80" rx="5" ry="2" />
      </g>
    ))}
  </svg>
)

const DropperPetri = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#1D1D1F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="60" cy="92" rx="42" ry="6" /><path d="M18 92v-8a4 4 0 0 1 4-4h76a4 4 0 0 1 4 4v8" />
    <line x1="74" y1="30" x2="74" y2="74" /><circle cx="74" cy="76" r="3" fill="#1D1D1F" />
    <rect x="68" y="14" width="12" height="18" rx="1.5" />
  </svg>
)

const MagnifyingGlass = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" stroke="#1D1D1F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="52" cy="52" r="32" /><line x1="76" y1="76" x2="100" y2="100" />
    <line x1="40" y1="52" x2="64" y2="52" /><line x1="52" y1="40" x2="52" y2="64" />
  </svg>
)

const Stopwatch = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" stroke="#1D1D1F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="60" cy="68" r="36" /><line x1="60" y1="68" x2="60" y2="46" /><line x1="60" y1="68" x2="76" y2="68" />
    <line x1="52" y1="20" x2="68" y2="20" /><line x1="60" y1="20" x2="60" y2="32" />
    <line x1="92" y1="36" x2="100" y2="44" />
  </svg>
)

const ShieldCheck = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" stroke="#1D1D1F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M60 14l36 14v24c0 22-16 40-36 46-20-6-36-24-36-46V28z" />
    <path d="M44 60l12 12 22-26" />
  </svg>
)

/* ─── Page ─── */
export default function HomePage() {
  const carouselRef = useRef(null)

  const scrollCarousel = (dir) => {
    const el = carouselRef.current
    if (!el) return
    el.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-[#1FA84D] text-white">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-2.5 flex items-center justify-center gap-2.5">
          <CardIcon size={17} />
          <p className="text-[13px] font-medium">
            Sorry for the downtime — payments are back and live.
          </p>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-[#E6E8EA] relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[560px]">
          {/* Left */}
          <div className="flex items-center px-6 lg:px-16 py-16 lg:py-24 max-w-[640px] lg:max-w-none mx-auto lg:mx-0 lg:ml-auto lg:w-full">
            <div className="w-full max-w-[480px] lg:ml-auto lg:mr-12">
              <h1 className="text-[44px] sm:text-[56px] lg:text-[72px] font-bold text-[#1D1D1F] tracking-[-0.03em] leading-[1.02] mb-6">
                Researcher<br />sign-in<br />required
              </h1>
              <p className="text-[15px] text-[#1D1D1F]/65 leading-relaxed mb-8 max-w-[420px]">
                Create an account or sign in to view our research peptide catalog.
                99%+ identity purity with full documentation.
              </p>
              <button className="bg-[#1D1D1F] text-white rounded-full px-7 py-3.5 text-[14px] font-medium inline-flex items-center gap-3 hover:opacity-90 transition">
                Get Started
                <Arrow />
              </button>
            </div>
          </div>

          {/* Right — lavender column with floating vials */}
          <div className="relative min-h-[400px] lg:min-h-[560px]" style={{ background: 'linear-gradient(135deg, #DDD8EE 0%, #E4DEF0 50%, #D9DEF0 100%)' }}>
            <FloatingVial
              src="/images/products/amino-h2o/00.png"
              alt="Amino H2O"
              className="w-[68%] max-w-[420px] top-1/2 left-1/2"
              style={{ transform: 'translate(-58%, -50%) rotate(-8deg)' }}
            />
            <FloatingVial
              src="/images/products/tb-500/00.png"
              alt="TB-500"
              className="w-[28%] max-w-[180px] top-[18%] right-[10%]"
              style={{ transform: 'rotate(18deg)' }}
            />
            <FloatingVial
              src="/images/products/bpc-157/00.png"
              alt="BPC-157"
              className="w-[26%] max-w-[170px] bottom-[22%] right-[6%]"
              style={{ transform: 'rotate(-12deg)' }}
            />
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="bg-[#EBEDEF]">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">
          {/* Left — vial photo */}
          <div className="relative min-h-[400px] lg:min-h-[520px] flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #E8D6E4 0%, #E5D5DE 40%, #D8D2E5 100%)' }}>
            <img
              src="/images/products/nad-plus/00.png"
              alt="NAD+ vial"
              className="w-[70%] max-w-[420px] drop-shadow-2xl"
              style={{ transform: 'rotate(-8deg)' }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/4 translate-y-[140%] bg-white/85 backdrop-blur rounded-full px-3 py-1 text-[10px] font-semibold text-[#1D1D1F] border border-black/5">
              Purity ≥ 99%
            </div>
          </div>

          {/* Right — guarantee content */}
          <div className="px-6 lg:px-16 py-16 lg:py-20 flex flex-col justify-center">
            <h2 className="text-[34px] sm:text-[40px] font-bold text-[#1D1D1F] tracking-tight mb-4 max-w-[480px]">
              The Amino Select Guarantee
            </h2>
            <p className="text-[15px] text-[#1D1D1F]/65 leading-relaxed mb-10 max-w-[460px]">
              Documented quality for research and laboratory use.
              Every batch meets our internal purity standards.
            </p>

            <div className="flex flex-col gap-3 max-w-[560px]">
              {/* 99% Purity */}
              <div className="flex items-center gap-4 bg-white rounded-2xl pl-4 pr-5 py-4 border-l-4 border-[#34C759]">
                <div className="w-11 h-11 rounded-full bg-[#34C759]/10 flex items-center justify-center flex-shrink-0">
                  <VerifiedBadge />
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                    99% Purity Guaranteed
                  </div>
                  <div className="text-[12px] text-[#86868B]">Every batch verified</div>
                </div>
              </div>

              {/* Shipment Protection */}
              <div className="flex items-center gap-4 bg-white rounded-2xl pl-4 pr-5 py-4 border-l-4 border-[#007AFF]">
                <div className="w-11 h-11 rounded-full bg-[#007AFF]/10 flex items-center justify-center flex-shrink-0">
                  <TruckIcon />
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                    Shipment Protection
                    <span className="text-[#86868B] text-[12px]">?</span>
                  </div>
                  <div className="text-[12px] text-[#86868B]">Every order fully covered</div>
                </div>
              </div>

              {/* CoA */}
              <div className="flex items-center gap-4 bg-white rounded-2xl pl-4 pr-5 py-4 border-l-4 border-[#F7C948]">
                <div className="w-11 h-11 rounded-full bg-[#F7C948]/15 flex items-center justify-center flex-shrink-0">
                  <FlaskIcon />
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                    CoA with Every Batch
                    <span className="text-[#86868B] text-[12px]">?</span>
                  </div>
                  <div className="text-[12px] text-[#86868B]">Third Party tested in America</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-[#E6E8EA] py-20 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-10 gap-6">
            <div>
              <h2 className="text-[34px] sm:text-[40px] font-bold text-[#1D1D1F] tracking-tight mb-2">
                Featured Products
              </h2>
              <p className="text-[14px] text-[#86868B]">
                Research peptides, third-party identity tested
              </p>
            </div>
            <Link to="/store" className="border border-[#1D1D1F]/20 rounded-full px-5 py-2 text-[13px] font-medium text-[#1D1D1F] hover:bg-[#1D1D1F] hover:text-white transition flex-shrink-0">
              View all
            </Link>
          </div>

          <div className="relative">
            <button
              onClick={() => scrollCarousel(-1)}
              aria-label="Previous"
              className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-11 h-11 rounded-full bg-white shadow-md border border-black/5 items-center justify-center text-[#1D1D1F] hover:scale-105 transition"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => scrollCarousel(1)}
              aria-label="Next"
              className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-11 h-11 rounded-full bg-white shadow-md border border-black/5 items-center justify-center text-[#1D1D1F] hover:scale-105 transition"
            >
              <ChevronRight />
            </button>

            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth -mx-6 px-6 lg:-mx-2 lg:px-2"
            >
              {featuredProducts.map((p) => (
                <div key={p.id} className="snap-start">
                  <FeaturedCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sign in CTA */}
      <section className="bg-[#E6E8EA] py-20 lg:py-28">
        <div className="max-w-[820px] mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur rounded-full px-4 py-1.5 mb-6 border border-black/5">
            <LockIcon />
            <span className="text-[12px] text-[#1D1D1F]/70">Verified Researchers Only</span>
          </div>
          <h2 className="text-[40px] sm:text-[52px] font-bold text-[#1D1D1F] tracking-[-0.025em] leading-[1.1] mb-5">
            Sign in to access the research catalog
          </h2>
          <p className="text-[15px] text-[#1D1D1F]/65 leading-relaxed mb-10 max-w-[600px] mx-auto">
            Create an account or sign in to view our complete research peptide catalog.
            Available to verified researchers and labs for laboratory and research use only.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button className="bg-[#1D1D1F] text-white rounded-full px-7 py-3.5 text-[14px] font-medium inline-flex items-center gap-3 hover:opacity-90 transition">
              Create Account
              <Arrow />
            </button>
            <button className="border border-[#1D1D1F]/30 rounded-full px-7 py-3.5 text-[14px] font-medium text-[#1D1D1F] hover:bg-[#1D1D1F] hover:text-white transition">
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Everything you need to succeed */}
      <section className="bg-[#D5EBD7] py-20 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <h2 className="text-[34px] sm:text-[42px] font-bold text-[#1D1D1F] tracking-tight text-center mb-14">
            Everything you need to succeed
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <LargeFeatureCard
              title="Join a community of researchers"
              body="Every purchase unlocks access to our research community. Connect with fellow researchers, share lab notes, and reference up-to-date documentation on each compound."
              button="Shop & Join Community"
              illustration={<TestTubeRack />}
            />
            <LargeFeatureCard
              title="Research-grade quality meets researcher-friendly pricing"
              body="U.S.-based provider with in-house manufacturing. Every batch undergoes rigorous third-party identity and content testing with full documentation. Documented quality procedures combined with research-grade pricing—keeping high identity purity research supply accessible."
              button="Shop USA tested Peptides"
              illustration={<DropperPetri />}
            />

            <SmallFeatureCard title="Expert support whenever you need it" illustration={<MagnifyingGlass size={60} />} />
            <LargeFeatureCard
              title="Extensive research library at your fingertips"
              body="Access our comprehensive collection of research articles, studies, and educational resources. Stay informed with our regularly updated blog covering the latest peptide research and discoveries."
              button="Explore Research Library"
              illustration={<MagnifyingGlass />}
            />

            <SmallFeatureCard title="Anywhere in the US, as fast as next day" illustration={<Stopwatch size={60} />} />
            <LargeFeatureCard
              title="Free shipment protection on every order"
              body="Every order is protected against damage, loss, or theft in transit. If your product arrives damaged, we'll replace it at no cost."
              button="Shop With Confidence"
              illustration={<ShieldCheck />}
            />
          </div>
        </div>
      </section>
    </>
  )
}
