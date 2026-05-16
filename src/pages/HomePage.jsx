import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getFeaturedProducts, subscribeEmail } from '../lib/supabase'

/* ─── Product image slug mapping ─── */
const featuredImageMap = {
  'GHK-Cu': '/images/homepage/featured-ghk-cu.png',
  'NAD+': '/images/homepage/featured-nad-plus.png',
  'Glutathione': '/images/homepage/featured-glutathione.png',
  'SEMAX': '/images/homepage/featured-semax.png',
  'SELANK': '/images/homepage/featured-selank.png',
  'DSIP': '/images/homepage/featured-dsip.png',
}

function getFeaturedImage(name) {
  return featuredImageMap[name] || null
}

function getProductImage(slug) {
  return `/images/products/${slug}/${slug}-vial.png`
}

function ProductImg({ slug, name, className = 'w-full h-full object-contain', style = {} }) {
  return <img src={getProductImage(slug)} alt={name} className={className} style={style} loading="lazy" />
}

/* ─── Intersection Observer hook ─── */
function useInView(options = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.15, ...options })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

/* ─── Section wrapper with fade-in ─── */
function FadeSection({ children, className = '', style = {}, delay = 0 }) {
  const [ref, visible] = useInView()
  return (
    <section
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </section>
  )
}

/* ─── Data ─── */
const bottleBgColors = ['#E8D5F5', '#D5E8F5', '#F5E8D5', '#D5F5E8', '#F5D5E8', '#F5F5D5']

const faqItems = [
  { q: 'What purity level are your peptides and how is it verified?', a: 'All Amino Select products are guaranteed 99%+ pure. Each batch is independently tested by accredited U.S. laboratories using HPLC and Mass Spectrometry. We provide a Certificate of Analysis (CoA) with every order.' },
  { q: 'What is a Certificate of Analysis (CoA)?', a: 'A CoA is an official lab document verifying your peptide\'s quality. Key sections include Purity (99%+), Identity (confirmed via mass spec), and Endotoxin levels. Each CoA is batch-specific and available on product pages.' },
  { q: 'How should I store the lyophilized product?', a: 'Lyophilized peptides are very stable. For short-term (under 3 months), store at room temperature in a cool, dark place. For long-term, refrigerate at 2-8°C or freeze at -20°C. Avoid repeated freeze-thaw cycles.' },
  { q: 'How fast do you ship?', a: 'Orders are processed within 0-2 business days. Standard shipping takes 3-5 business days. Every order includes free shipment protection. Lyophilized peptides don\'t require cold shipping.' },
  { q: 'Do you ship internationally?', a: 'Currently, we ship to all 50 U.S. states. Contact our support team for specific country availability on international orders.' },
  { q: 'Are these peptides for human use?', a: 'All products are sold strictly for research, laboratory, and educational purposes only. They are not approved for human consumption or therapeutic application.' },
]

const qualityTabs = [
  { key: 'potency', label: 'Potency', title: 'Verified Potency', desc: 'Every vial is tested to confirm it contains exactly what the label says — down to the microgram.', method: 'HPLC Analysis', why: 'You get the exact concentration you paid for, every single time.' },
  { key: 'purity', label: 'Purity', title: 'Verified Purity', desc: 'Each batch is tested to confirm 99%+ purity with no contaminants or adulterants.', method: 'Mass Spectrometry', why: 'Guaranteed purity means your research results won\'t be compromised.' },
  { key: 'stability', label: 'Stability', title: 'Verified Stability', desc: 'Peptides are tested for degradation over time under various storage conditions.', method: 'Accelerated Stability Testing', why: 'Know exactly how long your compound will remain viable.' },
  { key: 'safety', label: 'Safety', title: 'Verified Safety', desc: 'Every batch is screened for endotoxins, heavy metals, and microbial contamination.', method: 'LAL & ICP-MS Testing', why: 'Safety-tested compounds protect both researchers and research integrity.' },
  { key: 'consistency', label: 'Consistency', title: 'Verified Consistency', desc: 'Batch-to-batch uniformity ensures reproducible results across your entire research project.', method: 'Multi-Batch Comparison', why: 'Consistent compounds mean consistent, reproducible outcomes.' },
]

const whyChooseCards = [
  { title: 'Always in Stock', desc: 'Top peptides like BPC-157, TB-500, and Ipamorelin ready to ship. No backorders.', color: '#B39DDB', icon: '📦' },
  { title: 'Volume Pricing', desc: 'Bulk pricing available for larger research orders. Lower per-vial cost at higher volumes.', color: '#FFEE58', icon: '💰' },
  { title: 'Safe Shipping', desc: 'Cold-pack shipping keeps peptides stable. Discreet packaging with full tracking.', color: '#81C784', icon: '🚚' },
  { title: 'Researcher Community', desc: 'Connect with fellow researchers. Share insights and discuss peptide research.', color: '#F48FB1', icon: '👥' },
  { title: '99%+ Purity', desc: 'Every batch tested by US labs via HPLC and Mass Spec. Full CoA included free.', color: '#81C784', icon: '✅' },
  { title: 'Shipment Protection', desc: 'Every order includes free protection. Lost or damaged packages reshipped free.', color: '#81C784', icon: '🛡️' },
]

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [openFaq, setOpenFaq] = useState(null)
  const [activeTab, setActiveTab] = useState('potency')
  const scrollRef = useRef(null)
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    getFeaturedProducts()
      .then(data => {
        if (data && data.length > 0) {
          setFeaturedProducts(data)
        }
      })
      .catch(() => {
        // Keep empty — UI falls back gracefully
      })
  }, [])

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' })
    }
  }

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    try {
      await subscribeEmail(email)
      setSubscribed(true)
      setEmail('')
    } catch {
      // Silently fail for now
      setSubscribed(true)
    }
  }

  const activeQuality = qualityTabs.find(t => t.key === activeTab)

  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-24 md:pt-32 pb-16 md:pb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold text-[#1D1D1F] leading-[1.05] tracking-[-0.03em] mb-6">
                Research Peptides<br />You Can Trust
              </h1>
              <p className="text-[#86868B] text-[17px] leading-relaxed mb-10 max-w-md mx-auto md:mx-0">
                Research-grade peptides with Certificate of Analysis on every batch. 99%+ identity purity, third-party tested.
              </p>
              <Link
                to="/store"
                className="btn-apple inline-flex items-center gap-2 bg-[#1D1D1F] text-white text-[15px] font-medium px-8 py-3.5 rounded-full"
              >
                Browse Catalog
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="relative">
              <div className="rounded-[24px] p-10 md:p-14 flex items-center justify-center min-h-[320px] md:min-h-[420px] hero-gradient">
                <div className="flex items-end gap-5">
                  <img src="/images/homepage/hero-bpc157-vial.webp" alt="BPC-157 vial" className="w-28 h-auto opacity-90" style={{ maxHeight: '220px' }} />
                  <img src="/images/homepage/hero-tb500-vial.webp" alt="TB-500 vial" className="w-32 h-auto" style={{ maxHeight: '260px' }} />
                  <img src="/images/homepage/hero-amino-h2o-bottle.png" alt="Amino H2O bottle" className="w-24 h-auto opacity-80" style={{ maxHeight: '200px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Guarantee Section ─── */}
      <FadeSection className="py-20 md:py-28" style={{ backgroundColor: '#FBFBFD' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="bg-gradient-to-br from-[#F5F0FF] to-[#EDE7FF] rounded-[24px] flex items-center justify-center min-h-[280px] overflow-hidden">
              <img src="/images/homepage/hero-tb500-vial-large.png" alt="TB-500 vial" className="w-40 h-auto object-contain" style={{ maxHeight: '300px' }} />
            </div>
            <div>
              <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-[#1D1D1F] leading-tight tracking-[-0.02em] mb-4">
                The Amino Select Guarantee
              </h2>
              <p className="text-[#86868B] text-[16px] leading-relaxed">
                Documented quality for research and laboratory use. Every batch meets our internal purity standards.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { title: '99% Purity Guaranteed', sub: 'Every batch verified', color: '#34C759' },
              { title: 'Shipment Protection', sub: 'Every order fully covered', color: '#007AFF' },
              { title: 'CoA with Every Batch', sub: 'Third-party tested in America', color: '#FFB800' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-[20px] p-7 apple-shadow card-lift">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4 overflow-hidden" style={{ backgroundColor: `${item.color}18` }}>
                  <img src={item.title === '99% Purity Guaranteed' ? '/images/homepage/icon-purity-check.png' : item.title === 'Shipment Protection' ? '/images/homepage/icon-shipment-shield.png' : '/images/homepage/icon-coa-doc.png'} alt={item.title} className="w-6 h-6 object-contain" />
                </div>
                <h3 className="font-semibold text-[#1D1D1F] text-[15px] mb-1">{item.title}</h3>
                <p className="text-[13px] text-[#86868B]">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* ─── Featured Products ─── */}
      <FadeSection className="py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-[#1D1D1F] tracking-[-0.02em]">Featured Products</h2>
              <p className="text-[#86868B] text-[14px] mt-1.5">Research peptides, third-party identity tested</p>
            </div>
            <Link to="/store" className="text-[14px] font-medium text-[#1D1D1F] flex items-center gap-1 hover:gap-1.5 transition-all">
              View all
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="relative">
            <button onClick={() => scroll(-1)} className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur shadow-lg rounded-full w-10 h-10 flex items-center justify-center hover:bg-white transition hidden md:flex apple-shadow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button onClick={() => scroll(1)} className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur shadow-lg rounded-full w-10 h-10 flex items-center justify-center hover:bg-white transition hidden md:flex apple-shadow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
            <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
              {featuredProducts.map((p, i) => (
                <div key={p.id} className="flex-shrink-0 w-[200px]">
                  <Link to={`/product/${p.id}`} className="block">
                    <div className="rounded-[20px] overflow-hidden mb-3 card-lift" style={{ backgroundColor: bottleBgColors[i % bottleBgColors.length] }}>
                      <div className="aspect-square flex items-center justify-center p-6">
                        <img src={getFeaturedImage(p.name) || getProductImage(p.id)} alt={p.name} className="w-full h-full object-contain p-4" />
                      </div>
                    </div>
                  </Link>
                  <h3 className="font-semibold text-[14px] text-[#1D1D1F]">{p.name}</h3>
                  <p className="text-[13px] text-[#86868B] mt-0.5">${Number(p.price).toFixed(2)}</p>
                  {p.category && <p className="text-[11px] text-[#86868B]/60 mb-3">{p.category}</p>}
                  <Link to={`/product/${p.id}`} className="btn-apple inline-flex items-center gap-1.5 bg-[#1D1D1F] text-white text-[12px] font-medium px-4 py-2 rounded-full">
                    View
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeSection>

      {/* ─── Sign In CTA ─── */}
      <FadeSection className="py-20">
        <div className="max-w-[800px] mx-auto px-6 lg:px-8">
          <div className="bg-[#F0FFF4] rounded-[24px] p-12 text-center">
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-[#1D1D1F] tracking-[-0.02em] mb-3">20+ More Products</h2>
            <p className="text-[#86868B] mb-8">Sign in or create an account to view our full catalog</p>
            <Link to="/store" className="btn-apple inline-flex items-center gap-2 bg-[#1D1D1F] text-white text-[15px] font-medium px-8 py-3.5 rounded-full">
              Get Access
            </Link>
          </div>
        </div>
      </FadeSection>

      {/* ─── Everything You Need ─── */}
      <FadeSection className="py-20 md:py-28" style={{ backgroundColor: '#FBFBFD' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-[#1D1D1F] text-center tracking-[-0.02em] mb-14">
            Everything you need to succeed
          </h2>
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            {[
              { title: 'Join a community of researchers', desc: 'Every purchase unlocks access to our research community. Connect with fellow researchers, share lab notes, and reference documentation.', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2. M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z. M23 21v-2a4 4 0 0 0-3-3.87. M16 3.13a4 4 0 0 1 0 7.75', cta: 'Shop & Join Community' },
              { title: 'Research-grade quality, researcher-friendly pricing', desc: 'U.S.-based provider with in-house manufacturing. Every batch undergoes rigorous third-party identity and content testing.', icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14. M22 4 12 14.01 9 11.01', cta: 'Shop USA tested Peptides' },
              { title: 'Expert support whenever you need it', desc: 'Our dedicated support team is available to help with product questions, order tracking, and research guidance.', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', cta: 'Contact Support' },
              { title: 'Extensive research library at your fingertips', desc: 'Access our comprehensive collection of research articles, studies, and educational resources.', icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20. M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z', cta: 'Explore Research Library' },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-[20px] p-8 apple-shadow card-lift">
                <div className="w-11 h-11 bg-[#E8F5ED] rounded-full flex items-center justify-center mb-5 overflow-hidden">
                  <img src={card.title === 'Join a community of researchers' ? '/images/homepage/illustration-community.png' : card.title === 'Research-grade quality, researcher-friendly pricing' ? '/images/homepage/illustration-lab-testing.png' : card.title === 'Expert support whenever you need it' ? '/images/homepage/illustration-support.png' : '/images/homepage/illustration-research.png'} alt={card.title} className="w-7 h-7 object-contain" />
                </div>
                <h3 className="font-semibold text-[17px] text-[#1D1D1F] mb-2">{card.title}</h3>
                <p className="text-[14px] text-[#86868B] leading-relaxed mb-5">{card.desc}</p>
                <Link to="/store" className="inline-flex items-center gap-2 border border-[#1D1D1F]/10 bg-white text-[#1D1D1F] text-[13px] font-medium px-5 py-2.5 rounded-full hover:bg-[#1D1D1F]/5 transition">
                  {card.cta}
                </Link>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white rounded-[20px] p-8 apple-shadow">
              <h3 className="font-semibold text-[17px] text-[#1D1D1F]">Anywhere in the US, as fast as next day</h3>
            </div>
            <div className="bg-white rounded-[20px] p-8 apple-shadow">
              <h3 className="font-semibold text-[17px] text-[#1D1D1F] mb-2">Free shipment protection on every order</h3>
              <p className="text-[14px] text-[#86868B] leading-relaxed mb-5">Every order is protected against damage, loss, or theft in transit. If your product arrives damaged, we'll replace it at no cost.</p>
              <Link to="/store" className="inline-flex items-center gap-2 border border-[#1D1D1F]/10 bg-white text-[#1D1D1F] text-[13px] font-medium px-5 py-2.5 rounded-full hover:bg-[#1D1D1F]/5 transition">
                Shop With Confidence
              </Link>
            </div>
          </div>
        </div>
      </FadeSection>

      {/* ─── Quality Verification ─── */}
      <FadeSection className="py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-[#1D1D1F] leading-tight tracking-[-0.02em] mb-4">
                Quality you can verify, not just trust
              </h2>
              <p className="text-[#86868B] text-[15px] leading-relaxed mb-8">
                Every batch is independently tested by accredited U.S. laboratories. We don't ask you to take our word for it — we give you the proof.
              </p>
              <div className="flex flex-wrap gap-2.5 mb-8">
                {[
                  { text: '99%+ Purity', bg: '#E8F5ED', color: '#1B7A3D' },
                  { text: '5 Quality Checks', bg: '#E8F0FE', color: '#1A56DB' },
                  { text: '100% U.S. Verified', bg: '#FFF3E0', color: '#C75B12' },
                ].map(s => (
                  <span key={s.text} className="text-[12px] font-semibold px-3.5 py-1.5 rounded-full" style={{ backgroundColor: s.bg, color: s.color }}>
                    {s.text}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {qualityTabs.map(t => (
                  <button key={t.key} onClick={() => setActiveTab(t.key)}
                    className={`text-[13px] font-medium px-4 py-2 rounded-full transition-all ${
                      activeTab === t.key
                        ? 'bg-[#1D1D1F] text-white'
                        : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED]'
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="bg-[#FBFBFD] rounded-[20px] p-7">
                <h4 className="font-semibold text-[#1D1D1F] text-[16px] mb-1.5">{activeQuality.title}</h4>
                <p className="text-[14px] text-[#86868B] leading-relaxed mb-4">{activeQuality.desc}</p>
                <span className="inline-block bg-[#E8F5ED] text-[#1B7A3D] text-[11px] font-semibold px-3 py-1 rounded-full mb-4">{activeQuality.method}</span>
                <div className="border-l-2 border-[#34C759] pl-4 mb-5">
                  <p className="text-[13px] text-[#86868B]"><strong className="text-[#1D1D1F]">Why it matters:</strong> {activeQuality.why}</p>
                </div>
                <Link to="/store" className="btn-apple inline-flex items-center gap-2 bg-[#1D1D1F] text-white text-[13px] font-medium px-5 py-2.5 rounded-full">
                  Shop Now
                </Link>
                <div className="flex items-center gap-1.5 mt-3">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span className="text-[12px] text-[#86868B]">Free CoA included with every order</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-6 sticky top-28">
              <div className="bg-gradient-to-br from-[#F5F0FF] to-[#E8F5ED] rounded-[24px] p-10 flex items-center justify-center overflow-hidden">
                <img src="/images/homepage/hero-tb500-vial-large.png" alt="Quality verified vial" className="w-48 h-auto object-contain" style={{ maxHeight: '380px' }} />
              </div>
              <a href="#" className="text-[13px] font-medium text-[#1D1D1F] flex items-center gap-1 hover:gap-1.5 transition-all">
                View our quality procedures
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </FadeSection>

      {/* ─── Free COA Strip ─── */}
      <FadeSection className="py-14" style={{ background: 'linear-gradient(135deg, #F5F0FF 0%, #FFFDE7 100%)' }}>
        <div className="max-w-[700px] mx-auto px-6 lg:px-8 text-center">
          <h3 className="text-[clamp(1.1rem,2.5vw,1.5rem)] font-bold text-[#1D1D1F] mb-5">Free CoA included with every order</h3>
          <div className="flex items-center justify-center gap-3 mb-6">
            {['99%+ Purity', 'Verified by HPLC'].map(t => (
              <span key={t} className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur rounded-full px-4 py-2 text-[13px] font-medium text-[#1D1D1F] apple-shadow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                {t}
              </span>
            ))}
          </div>
          <Link to="/store" className="btn-apple inline-flex items-center gap-2 bg-[#1D1D1F] text-white text-[14px] font-medium px-7 py-3 rounded-full">
            See the Proof
          </Link>
        </div>
      </FadeSection>

      {/* ─── Why Choose ─── */}
      <FadeSection className="py-20 md:py-28" style={{ backgroundColor: '#F5F5F7' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-[#1D1D1F] text-center tracking-[-0.02em] mb-14">
            Why choose Amino Select?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyChooseCards.map((card) => (
              <div key={card.title} className="bg-white rounded-[20px] p-7 apple-shadow card-lift">
                <div className="w-11 h-11 rounded-full flex items-center justify-center mb-5 text-lg" style={{ backgroundColor: `${card.color}20` }}>
                  {card.icon}
                </div>
                <h3 className="font-semibold text-[15px] text-[#1D1D1F] mb-1.5">{card.title}</h3>
                <p className="text-[13px] text-[#86868B] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* ─── FAQ ─── */}
      <FadeSection className="py-20 md:py-28">
        <div className="max-w-[700px] mx-auto px-6 lg:px-8">
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-[#1D1D1F] text-center tracking-[-0.02em] mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-[#86868B] text-[14px] mb-12">Everything you need to know about peptide research</p>
          <div className="space-y-0">
            {faqItems.map((item, i) => (
              <div key={i} className="border-b border-[#E8E8ED]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <span className="font-medium text-[15px] text-[#1D1D1F] pr-6 group-hover:text-[#1D1D1F]/70 transition">{item.q}</span>
                  <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center text-[#86868B] transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                <div className={`accordion-content ${openFaq === i ? 'open' : ''}`}>
                  <div className="accordion-inner">
                    <p className="text-[14px] text-[#86868B] leading-relaxed pb-5">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* ─── CTA Strip ─── */}
      <FadeSection className="py-24" style={{ background: 'linear-gradient(135deg, #FFFDE7 0%, #F5F0FF 100%)' }}>
        <div className="max-w-[800px] mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold text-[#1D1D1F] leading-snug tracking-[-0.02em] mb-8">
            All the research peptides you need, with the peace of mind and research community at your fingertips.
          </h2>
          <Link to="/store" className="btn-apple inline-flex items-center gap-2 bg-[#1D1D1F] text-white text-[15px] font-medium px-8 py-3.5 rounded-full">
            Shop Now
          </Link>
        </div>
      </FadeSection>

      {/* ─── Newsletter ─── */}
      <FadeSection className="py-20" style={{ backgroundColor: '#F5F0FF' }}>
        <div className="max-w-[500px] mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-bold text-[#1D1D1F] mb-3">Research updates from Amino Select</h2>
          <p className="text-[14px] text-[#86868B] mb-7">Subscribe for catalog updates, new compounds, and quality documentation</p>
          {subscribed ? (
            <p className="text-[14px] text-[#34C759] font-medium">✓ Thanks for subscribing!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-5 py-3 rounded-full border border-[#E8E8ED] bg-white/80 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1D1D1F]/10 transition"
              />
              <button type="submit" className="btn-apple bg-[#1D1D1F] text-white font-medium px-6 py-3 rounded-full text-[14px]">
                Subscribe
              </button>
            </form>
          )}
          <p className="text-[11px] text-[#86868B]/60 mt-3">For researchers and labs. No spam, unsubscribe anytime.</p>
        </div>
      </FadeSection>
    </div>
  )
}
