import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'

/* ─── Quality tabs ─── */
const qualityTabs = [
  { key: 'potency',     label: 'Potency',     title: 'Verified Potency',             method: 'HPLC Analysis',          desc: 'Every vial is tested to confirm it contains exactly what the label says — down to the microgram.',                                why: 'No guessing games. You get the exact concentration you paid for, every single time.' },
  { key: 'purity',      label: 'Purity',      title: '99%+ Purity Guaranteed',       method: 'Mass Spectrometry',      desc: 'Comprehensive testing confirms our peptides are free from impurities, degradation products, and synthesis byproducts.',           why: 'Higher purity means better research outcomes. Every batch is verified to 99%+ purity.' },
  { key: 'stability',   label: 'Stability',   title: 'Long-Term Stability',          method: 'pH & Stability Testing', desc: 'Optimal pH and formulation testing ensures every batch remains intact throughout its labeled shelf life.',                       why: 'Stable lyophilized product from the day it ships through the labeled shelf life.' },
  { key: 'safety',      label: 'Safety',      title: 'Contaminant-Free',             method: 'Sterility & LAL Testing',desc: 'Rigorous third-party sterility and endotoxin testing confirms products are free from bacteria, fungi, and harmful toxins.',       why: 'Peace of mind knowing your research won\'t be compromised by contamination.' },
  { key: 'consistency', label: 'Consistency', title: 'Batch-to-Batch Consistency',   method: 'QC Verification',        desc: 'Precision weighing and quality controls ensure every batch meets the same exacting standards.',                                  why: 'Same great quality whether it\'s your first order or your fiftieth.' },
]

/* ─── Why-choose cards ─── */
const whyChooseCards = [
  { title: 'Always in Stock',          body: 'Top research peptides like BPC-157, TB-500, and Ipamorelin ready to ship. No backorders, no waiting.',         tint: '#E8DDF5', accent: '#9B6BD4', icon: 'box' },
  { title: 'Volume Pricing',           body: 'Bulk pricing available for larger research orders. Lower per-vial cost at higher volumes.',                     tint: '#DDF0DD', accent: '#34C759', icon: 'percent' },
  { title: 'Safe & Protected Shipping',body: 'Cold-pack shipping keeps peptides stable. Discreet packaging with full tracking on every USA order.',          tint: '#F5EBC5', accent: '#D4A946', icon: 'truck' },
  { title: 'Researcher Community',     body: 'Connect with fellow researchers. Share peer insights and discuss peptide research applications.',               tint: '#F5DDDD', accent: '#E07A7A', icon: 'globe' },
  { title: '99%+ Purity Guaranteed',   body: 'Every batch tested by US labs via HPLC and Mass Spec. Full Certificate of Analysis included free.',             tint: '#E0DDF5', accent: '#7C6BD4', icon: 'medal' },
  { title: 'Shipment Protection',      body: 'Every order includes free shipment protection. Lost, damaged, or stolen packages are reshipped at no cost.',    tint: '#DDF0E8', accent: '#5BC9A0', icon: 'bolt' },
]

/* ─── FAQ items ─── */
const faqItems = [
  { q: 'What purity level are your peptides and how is it verified?',          a: 'All Amino Select peptides are guaranteed 99%+ pure. Each batch is independently tested by accredited U.S. laboratories using HPLC (High-Performance Liquid Chromatography) and Mass Spectrometry. We provide a Certificate of Analysis (CoA) with every order showing exact purity percentages, molecular weight verification, and amino acid sequence confirmation.' },
  { q: 'What is a Certificate of Analysis (CoA) and how do I read it?',        a: 'A Certificate of Analysis is an official lab document that verifies your peptide\'s quality. Key sections include: Purity (should be 99%+), Identity (confirms correct peptide via mass spec), Appearance (should match product description), and Endotoxin levels (should be below 1 EU/mg). Each CoA is batch-specific and available on product pages.' },
  { q: 'What is Amino H2O?',                                                   a: 'Amino H2O is sterile water containing 0.9% benzyl alcohol, which inhibits bacterial growth. It is a standard laboratory supply used in research settings. We offer Amino H2O in our accessories section as research supply.' },
  { q: 'How should I store the lyophilized product?',                          a: 'Lyophilized (freeze-dried) peptides are very stable. For short-term storage (under 3 months), room temperature in a cool, dark place is fine. For long-term storage, refrigerate at 2-8°C or freeze at -20°C. Avoid repeated freeze-thaw cycles. Properly stored lyophilized peptides can remain stable for 2+ years.' },
  { q: 'How long is the lyophilized product stable?',                          a: 'Lyophilized (freeze-dried) peptides are highly stable and can last 2+ years when stored properly at -20°C or 2-8°C. Always store away from light and avoid repeated temperature fluctuations.' },
  { q: 'How fast do you ship and is cold shipping required?',                  a: 'Orders are processed within 0-2 business days. Standard shipping takes 3-5 business days from fulfillment. Every order includes free shipment protection. Lyophilized peptides don\'t require cold shipping — they\'re stable at room temperature. All orders ship in discreet, unlabeled packaging.' },
  { q: 'Do you ship internationally?',                                         a: 'Currently, we ship to all 50 U.S. states. International shipping varies by country due to customs regulations on research materials. Contact our support team for specific country availability. All international orders may be subject to local customs fees and import duties.' },
  { q: 'What is Amino Select and why should I trust you?',                     a: 'Amino Select is a U.S.-based research peptide supplier committed to quality and transparency. Our peptides are manufactured in-house and independently tested for identity and content on every batch at accredited American third-party laboratories. Unlike other suppliers, we provide full Certificates of Analysis, maintain documented quality procedures, and back everything with our 99%+ identity purity guarantee. Our community of researchers provides real peer feedback and support.' },
  { q: 'Are these peptides for human use?',                                    a: 'All Amino Select peptides are sold strictly for research, laboratory, and educational purposes only. They are not approved for human consumption, veterinary use, or any therapeutic application. By purchasing, you confirm you are a qualified researcher and will use products in accordance with all applicable laws and regulations.' },
  { q: 'What is your return and refund policy?',                               a: 'We offer damage protection on every order. If your product arrives damaged in transit, contact us with photos of the damage and we\'ll send a one-time replacement. All claims require photo evidence and are subject to review. One replacement per customer per order. Reconstituted products are not eligible. We are not responsible for misuse or improper storage after delivery.' },
  { q: 'How can I contact Amino Select support?',                              a: 'You can reach our support team via the contact form on the site. We typically respond within 24 hours on business days. For order issues, have your order number ready. Our team can help with product questions, order tracking, and any concerns about your purchase.' },
]

/* ─── Featured product config ─── */
const featuredProducts = [
  { id: 'ghk-cu',      name: 'GHK-Cu',      subtitle: 'Dermal Compound',                       priceFrom: 29.99, bg: '#DCE7F0' },
  { id: 'nad-plus',    name: 'NAD+',        subtitle: 'Cellular Peptide',                      priceFrom: 69.99, bg: '#F5DCDC' },
  { id: 'glutathione', name: 'Glutathione', subtitle: 'Antioxidant & Detoxification Peptide',  priceFrom: 59.99, bg: '#DCE3EA' },
  { id: 'semax',       name: 'SEMAX',       subtitle: 'Cognitive & Neuroprotective Peptide',   priceFrom: 29.99, bg: '#DDE0EC' },
  { id: 'selank',      name: 'SELANK',      subtitle: 'Cognitive & Anxiolytic Peptide',        priceFrom: 29.99, bg: '#E5E0EC' },
  { id: 'dsip',        name: 'DSIP',        subtitle: 'Circadian Peptide',                     priceFrom: 29.99, bg: '#E8DDE8' },
  { id: 'bpc-157',     name: 'BPC-157',     subtitle: 'Cellular Peptide',                      priceFrom: 39.99, bg: '#DCEEDC' },
  { id: 'tb-500',      name: 'TB-500',      subtitle: 'Cellular Peptide',                      priceFrom: 39.99, bg: '#DCEAEE' },
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

/* ─── Why-choose card icons ─── */
const whyIcons = {
  box: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  percent: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  ),
  truck: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="6" width="14" height="10" rx="1.5" /><path d="M15 9h4l3 3v4h-7" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" />
      <path d="M9 10l1.5 1.5L13 9" stroke="currentColor" strokeWidth="1.6" fill="none" />
    </svg>
  ),
  globe: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><line x1="3" y1="12" x2="21" y2="12" /><path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  ),
  medal: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="14" r="6" /><polygon points="8 14 12 11 16 14 12 17 8 14" />
      <path d="M8.5 8L7 3h10l-1.5 5" />
    </svg>
  ),
  bolt: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
}

/* ─── Quality stat block ─── */
function StatBlock({ value, label1, label2 }) {
  return (
    <div className="flex items-baseline gap-3">
      <div className="text-[34px] sm:text-[40px] font-bold text-[#1D1D1F] tracking-tight leading-none">{value}</div>
      <div className="text-[12px] text-[#86868B] leading-tight">
        <div>{label1}</div>
        {label2 && <div>{label2}</div>}
      </div>
    </div>
  )
}

/* ─── Why-choose card ─── */
function WhyChooseCard({ card }) {
  return (
    <div className="bg-white rounded-3xl p-7 border border-black/[0.06] relative overflow-hidden" style={{ boxShadow: `0 0 0 1px ${card.accent}15` }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: card.tint, color: card.accent }}>
        {whyIcons[card.icon]}
      </div>
      <h3 className="text-[17px] font-bold text-[#1D1D1F] mb-2.5 tracking-tight">{card.title}</h3>
      <p className="text-[13px] text-[#86868B] leading-relaxed">{card.body}</p>
    </div>
  )
}

/* ─── FAQ row ─── */
function FaqRow({ item, open, onToggle }) {
  return (
    <div className="border-b border-black/10">
      <button onClick={onToggle} className="w-full flex items-center justify-between py-5 text-left">
        <span className="text-[15px] font-semibold text-[#1D1D1F] pr-4">{item.q}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-[#1D1D1F]/60 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className={`grid transition-[grid-template-rows] duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <p className="text-[14px] text-[#86868B] leading-relaxed pb-5 max-w-[800px]">{item.a}</p>
        </div>
      </div>
    </div>
  )
}

/* ─── Page ─── */
export default function HomePage() {
  const carouselRef = useRef(null)
  const [qualityTab, setQualityTab] = useState('potency')
  const [openFaq, setOpenFaq] = useState(null)
  const activeTab = qualityTabs.find(t => t.key === qualityTab)

  const scrollCarousel = (dir) => {
    const el = carouselRef.current
    if (!el) return
    el.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  return (
    <>
      {/* Hero — Dark Orbitrex-style */}
      <section className="relative overflow-hidden hero-dark-gradient">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Left — headline + trust line */}
          <div className="flex items-center px-6 lg:px-16 py-20 lg:py-28 max-w-[640px] lg:max-w-none mx-auto lg:mx-0 lg:ml-auto lg:w-full">
            <div className="w-full max-w-[520px] lg:ml-auto lg:mr-12">
              <h1 className="hero-headline text-[52px] sm:text-[64px] lg:text-[72px] font-extrabold text-white tracking-[-0.04em] leading-[1.02] mb-6">
                Research Peptides<br />You Can Trust
              </h1>
              <p className="hero-trust text-[16px] sm:text-[18px] text-[#7FCB98] leading-relaxed mb-10 max-w-[460px]">
                Research-grade peptides with Certificate of Analysis on every batch.<br />
                99%+ identity purity, third-party tested in the USA.
              </p>
              <Link to="/store" className="bg-white text-[#0f3d24] rounded-full px-8 py-4 text-[15px] font-semibold inline-flex items-center gap-3 hover:bg-[#7FCB98] hover:text-white transition-all duration-300">
                Browse Catalog
                <Arrow />
              </Link>
            </div>
          </div>

          {/* Right — dark column with floating vials */}
          <div className="relative min-h-[400px] lg:min-h-[600px]" style={{ background: 'linear-gradient(180deg, rgba(15,61,36,0.4) 0%, rgba(26,26,26,0.6) 100%)' }}>
            <FloatingVial
              src="/images/products/amino-h2o/00.png"
              alt="Amino H2O"
              className="w-[68%] max-w-[420px] top-1/2 left-1/2"
              style={{ transform: 'translate(-58%, -50%) rotate(-8deg)', filter: 'brightness(1.1)' }}
            />
            <FloatingVial
              src="/images/products/tb-500/00.png"
              alt="TB-500"
              className="w-[28%] max-w-[180px] top-[18%] right-[10%]"
              style={{ transform: 'rotate(18deg)', filter: 'brightness(1.1)' }}
            />
            <FloatingVial
              src="/images/products/bpc-157/00.png"
              alt="BPC-157"
              className="w-[26%] max-w-[170px] bottom-[22%] right-[6%]"
              style={{ transform: 'rotate(-12deg)', filter: 'brightness(1.1)' }}
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

      {/* Quality you can verify */}
      <section className="bg-[#E6E8EA] py-20 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left */}
          <div>
            <h2 className="text-[34px] sm:text-[44px] font-bold text-[#1D1D1F] tracking-[-0.025em] leading-[1.1] mb-5">
              Quality you can verify, not just trust
            </h2>
            <p className="text-[15px] text-[#1D1D1F]/65 leading-relaxed mb-9 max-w-[520px]">
              Every batch is independently tested by accredited U.S. laboratories.
              We don't ask you to take our word for it — we give you the proof.
            </p>

            <div className="flex flex-wrap gap-x-10 gap-y-4 mb-10">
              <StatBlock value="99%+" label1="Purity"      label2="Guaranteed" />
              <StatBlock value="5"    label1="Quality"     label2="Checks" />
              <StatBlock value="100%" label1="U.S. Verified" />
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {qualityTabs.map(t => {
                const active = t.key === qualityTab
                return (
                  <button
                    key={t.key}
                    onClick={() => setQualityTab(t.key)}
                    className={`px-4 py-2 rounded-full text-[13px] font-medium transition flex items-center gap-1.5 ${
                      active ? 'bg-[#1D1D1F] text-white' : 'border border-black/15 text-[#1D1D1F] hover:bg-black/5'
                    }`}
                  >
                    {active ? (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                    ) : (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    )}
                    {t.label}
                  </button>
                )
              })}
            </div>

            {/* Active tab content */}
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <h3 className="text-[18px] font-bold text-[#1D1D1F]">{activeTab.title}</h3>
                <span className="inline-flex items-center gap-1.5 bg-[#34C759]/10 text-[#1A8A3F] rounded-full px-2.5 py-1 text-[11px] font-semibold">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  {activeTab.method}
                </span>
              </div>
              <p className="text-[13px] text-[#86868B] leading-relaxed mb-4">{activeTab.desc}</p>
              <div className="border-l-2 border-[#34C759] pl-4 py-1">
                <p className="text-[13px] text-[#1D1D1F]/80 leading-relaxed">
                  <span className="font-semibold text-[#1D1D1F]">Why it matters: </span>{activeTab.why}
                </p>
              </div>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link to="/store" className="bg-[#1D1D1F] text-white rounded-full px-6 py-3 text-[14px] font-medium inline-flex items-center gap-3 hover:opacity-90 transition">
                Shop Now <Arrow />
              </Link>
              <span className="inline-flex items-center gap-2 text-[13px] text-[#1D1D1F]/70">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="8 12 11 15 16 9" /></svg>
                Free COA included with every order
              </span>
            </div>
          </div>

          {/* Right — vial showcase */}
          <div className="relative rounded-3xl overflow-hidden min-h-[520px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #DDE5F0 0%, #E0DAEE 100%)' }}>
            <img src="/images/products/tb-500/00.png" alt="TB-500" className="w-[60%] max-w-[320px] drop-shadow-2xl" style={{ transform: 'rotate(-6deg)' }} />

            {/* Purity badge */}
            <div className="absolute top-6 right-6 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-md">
              <div className="w-9 h-9 rounded-full bg-[#34C759]/15 flex items-center justify-center text-[#34C759]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#1D1D1F] leading-tight">99%+ Purity</div>
                <div className="text-[11px] text-[#86868B] leading-tight">Verified by HPLC</div>
              </div>
            </div>

            {/* See the proof */}
            <a href="#" className="absolute bottom-6 left-6 right-6 bg-white/85 backdrop-blur rounded-2xl px-4 py-3 flex items-center gap-3 hover:bg-white transition">
              <div className="w-9 h-9 rounded-lg bg-[#1D1D1F]/5 flex items-center justify-center text-[#1D1D1F]/70">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="13" y2="17" /></svg>
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-[#1D1D1F] leading-tight">See the Proof</div>
                <div className="text-[11px] text-[#86868B] leading-tight">View our quality procedures</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Why choose Amino Select */}
      <section className="bg-[#E6E8EA] pb-20 lg:pb-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <h2 className="text-[34px] sm:text-[42px] font-bold text-[#1D1D1F] tracking-tight text-center mb-14">
            Why choose Amino Select?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyChooseCards.map(card => <WhyChooseCard key={card.title} card={card} />)}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#E6E8EA] pb-20 lg:pb-24">
        <div className="max-w-[920px] mx-auto px-6 lg:px-10">
          <h2 className="text-[34px] sm:text-[42px] font-bold text-[#1D1D1F] tracking-tight text-center mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-[14px] text-[#86868B] text-center mb-12">
            Everything you need to know about peptide research
          </p>
          <div>
            {faqItems.map((item, i) => (
              <FaqRow
                key={i}
                item={item}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(105deg, #E0DDEE 0%, #E4E8D2 55%, #DCEED8 100%)' }}>
        <img
          src="/images/products/dsip/00.png"
          alt=""
          aria-hidden="true"
          className="absolute select-none hidden md:block"
          style={{ left: '-5%', top: '20%', width: '280px', transform: 'rotate(-18deg)' }}
        />
        <div className="relative max-w-[920px] mx-auto px-6 py-24 lg:py-32 text-center">
          <h2 className="text-[32px] sm:text-[42px] font-bold text-[#1D1D1F] tracking-[-0.02em] leading-[1.2] mb-9 max-w-[760px] mx-auto">
            All the research peptides you need, with the{' '}
            <span className="relative inline-block">
              <span className="absolute inset-x-0 bottom-1 h-3 bg-[#9FE5A8]/70 -z-0" />
              <span className="relative">peace of mind</span>
            </span>{' '}
            and research community at your fingertips.
          </h2>
          <Link to="/store" className="bg-[#1D1D1F] text-white rounded-full px-7 py-3.5 text-[14px] font-medium inline-flex items-center gap-3 hover:opacity-90 transition">
            Shop Now <Arrow />
          </Link>
        </div>
      </section>
    </>
  )
}
