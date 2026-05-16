import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

/* ─── Shared SVGs ─── */
const BottleSVG = ({ className = 'w-20 h-40', label = '', color = '#E8D5F5' }) => (
  <svg viewBox="0 0 80 160" className={className} fill="none">
    <rect x="28" y="0" width="24" height="16" rx="3" fill="#0B0B0B" opacity="0.15" />
    <rect x="22" y="16" width="36" height="8" rx="2" fill="#0B0B0B" opacity="0.2" />
    <rect x="20" y="24" width="40" height="120" rx="8" fill={color} stroke="#0B0B0B" strokeWidth="2" opacity="0.9" />
    {label && (
      <text x="40" y="86" textAnchor="middle" fill="#0B0B0B" fontSize="8" fontFamily="Poppins" fontWeight="600">{label}</text>
    )}
    <rect x="28" y="50" width="24" height="3" rx="1.5" fill="#0B0B0B" opacity="0.15" />
    <rect x="28" y="58" width="18" height="3" rx="1.5" fill="#0B0B0B" opacity="0.1" />
  </svg>
)

const ShieldIcon = ({ color = '#16A34A' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
)

const ArrowRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

const ChevronDown = ({ open }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const QuestionIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

/* ─── Featured products data ─── */
const featuredProducts = [
  { id: 'ghk-cu', name: 'GHK-Cu', price: 29.99, category: 'Dermal Compound', bgColor: '#E8D5F5' },
  { id: 'nad-plus', name: 'NAD+', price: 69.99, category: 'Cellular Peptide', bgColor: '#D5E8F5' },
  { id: 'glutathione', name: 'Glutathione', price: 59.99, category: 'Antioxidant & Detoxification Peptide', bgColor: '#F5E8D5' },
  { id: 'semax', name: 'SEMAX', price: 29.99, category: 'Cognitive & Neuroprotective Peptide', bgColor: '#D5F5E8' },
  { id: 'selank', name: 'SELANK', price: 29.99, category: 'Cognitive & Anxiolytic Peptide', bgColor: '#F5D5E8' },
  { id: 'dsip', name: 'DSIP', price: 29.99, category: 'Circadian Peptide', bgColor: '#F5F5D5' },
]

/* ─── FAQ data ─── */
const faqItems = [
  { q: 'What purity level are your peptides and how is it verified?', a: 'All Amino Club peptides are guaranteed 99%+ pure. Each batch is independently tested by accredited U.S. laboratories using HPLC (High-Performance Liquid Chromatography) and Mass Spectrometry. We provide a Certificate of Analysis (CoA) with every order showing exact purity percentages, molecular weight verification, and amino acid sequence confirmation.' },
  { q: 'What is a Certificate of Analysis (CoA) and how do I read it?', a: 'A Certificate of Analysis is an official lab document that verifies your peptide\'s quality. Key sections include: Purity (should be 99%+), Identity (confirms correct peptide via mass spec), Appearance (should match product description), and Endotoxin levels (should be below 1 EU/mg). Each CoA is batch-specific and available on product pages.' },
  { q: 'What is Amino H2O?', a: 'Amino H2O is sterile water containing 0.9% benzyl alcohol, which inhibits bacterial growth. It is a standard laboratory supply used in research settings. We offer Amino H2O in our accessories section as research supply.' },
  { q: 'How should I store the lyophilized product?', a: 'Lyophilized (freeze-dried) peptides are very stable. For short-term storage (under 3 months), room temperature in a cool, dark place is fine. For long-term storage, refrigerate at 2-8°C or freeze at -20°C. Avoid repeated freeze-thaw cycles. Properly stored lyophilized peptides can remain stable for 2+ years.' },
  { q: 'How long is the lyophilized product stable?', a: 'Lyophilized (freeze-dried) peptides are highly stable and can last 2+ years when stored properly at -20°C or 2-8°C. Always store away from light and avoid repeated temperature fluctuations.' },
  { q: 'How fast do you ship and is cold shipping required?', a: 'Orders are processed within 0-2 business days. Standard shipping takes 3-5 business days from fulfillment. Every order includes free shipment protection. Lyophilized peptides don\'t require cold shipping—they\'re stable at room temperature. All orders ship in discreet, unlabeled packaging.' },
  { q: 'Do you ship internationally?', a: 'Currently, we ship to all 50 U.S. states. International shipping varies by country due to customs regulations on research materials. Contact our support team for specific country availability. All international orders may be subject to local customs fees and import duties.' },
  { q: 'What is Amino Club and why should I trust you?', a: 'Amino Club is a U.S.-based research peptide supplier committed to quality and transparency. Our peptides are manufactured in-house and independently tested for identity and content on every batch at accredited American third-party laboratories. Unlike other suppliers, we provide full Certificates of Analysis, maintain documented quality procedures, and back everything with our 99%+ identity purity guarantee.' },
  { q: 'Are these peptides for human use?', a: 'All Amino Club peptides are sold strictly for research, laboratory, and educational purposes only. They are not approved for human consumption, veterinary use, or any therapeutic application. By purchasing, you confirm you are a qualified researcher and will use products in accordance with all applicable laws and regulations.' },
  { q: 'What is your return and refund policy?', a: 'We offer damage protection on every order. If your product arrives damaged in transit, contact us with photos of the damage and we\'ll send a one-time replacement. All claims require photo evidence and are subject to review. One replacement per customer per order. Reconstituted products are not eligible.' },
]

/* ─── Quality tabs ─── */
const qualityTabs = [
  { key: 'potency', label: 'Potency', title: 'Verified Potency', desc: 'Every vial is tested to confirm it contains exactly what the label says—down to the microgram.', method: 'HPLC Analysis', why: 'No guessing games. You get the exact concentration you paid for, every single time.' },
  { key: 'purity', label: 'Purity', title: 'Verified Purity', desc: 'Each batch is tested to confirm 99%+ purity with no contaminants or adulterants.', method: 'Mass Spectrometry', why: 'Guaranteed purity means your research results won\'t be compromised by impure compounds.' },
  { key: 'stability', label: 'Stability', title: 'Verified Stability', desc: 'Peptides are tested for degradation over time under various storage conditions.', method: 'Accelerated Stability Testing', why: 'Know exactly how long your compound will remain viable under proper storage.' },
  { key: 'safety', label: 'Safety', title: 'Verified Safety', desc: 'Every batch is screened for endotoxins, heavy metals, and microbial contamination.', method: 'LAL & ICP-MS Testing', why: 'Safety-tested compounds protect both researchers and research integrity.' },
  { key: 'consistency', label: 'Consistency', title: 'Verified Consistency', desc: 'Batch-to-batch uniformity ensures reproducible results across your entire research project.', method: 'Multi-Batch Comparison', why: 'Consistent compounds mean consistent, reproducible research outcomes.' },
]

/* ─── Why Choose cards ─── */
const whyChooseCards = [
  { title: 'Always in Stock', desc: 'Top research peptides like BPC-157, TB-500, and Ipamorelin ready to ship. No backorders, no waiting.', color: '#B39DDB', icon: '📦' },
  { title: 'Volume Pricing', desc: 'Bulk pricing available for larger research orders. Lower per-vial cost at higher volumes.', color: '#FFEE58', icon: '💰' },
  { title: 'Safe & Protected Shipping', desc: 'Cold-pack shipping keeps peptides stable. Discreet packaging with full tracking on every USA order.', color: '#81C784', icon: '🚚' },
  { title: 'Researcher Community', desc: 'Connect with fellow researchers. Share peer insights and discuss peptide research applications.', color: '#F48FB1', icon: '👥' },
  { title: '99%+ Purity Guaranteed', desc: 'Every batch tested by US labs via HPLC and Mass Spec. Full Certificate of Analysis included free.', color: '#81C784', icon: '✅' },
  { title: 'Shipment Protection', desc: 'Every order includes free shipment protection. Lost, damaged, or stolen packages are reshipped at no cost.', color: '#81C784', icon: '🛡️' },
]

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [openFaq, setOpenFaq] = useState(null)
  const [activeTab, setActiveTab] = useState('potency')
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' })
    }
  }

  const activeQuality = qualityTabs.find(t => t.key === activeTab)

  return (
    <div>
      {/* ─── 1. Announcement Bar ─── */}
      <div className="bg-[#16A34A] text-white text-center py-2.5 px-4 text-sm font-medium flex items-center justify-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="18" rx="2" />
          <path d="M2 8h20" />
        </svg>
        Sorry for the downtime — payments are back and live.
      </div>

      {/* ─── 3. Hero Section (CORRECTED) ─── */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h1 className="font-poppins text-[2.5rem] md:text-5xl lg:text-[3.75rem] font-bold text-[#000000] leading-[1.1] mb-6">
                Research Peptides You Can Trust
              </h1>
              <p className="text-[#333333] text-base md:text-lg mb-8 max-w-lg mx-auto md:mx-0">
                Research-grade peptides with Certificate of Analysis on every batch. 99%+ identity purity, third-party tested.
              </p>
              <Link
                to="/store"
                className="inline-flex items-center gap-2 bg-[#0B0B0B] text-white font-medium px-8 py-3.5 rounded-full hover:bg-[#131315] transition"
              >
                Browse Catalog
                <ArrowRight />
              </Link>
            </div>
            <div className="relative">
              <div className="rounded-3xl p-8 md:p-12 flex items-center justify-center min-h-[300px] md:min-h-[400px]"
                style={{ background: 'linear-gradient(135deg, #FDE8F0 0%, #E8D5F5 50%, #D5E8F5 100%)' }}>
                <div className="flex items-end gap-6">
                  <BottleSVG className="w-16 h-32 opacity-80" label="BPC-157" color="#FFB6C1" />
                  <BottleSVG className="w-20 h-40" label="GLP-3" color="#C8E6C9" />
                  <BottleSVG className="w-14 h-28 opacity-70" label="NAD+" color="#E1BEE7" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Guarantee Section ─── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <div className="bg-[#F5F0FF] rounded-3xl flex items-center justify-center min-h-[250px]">
              <BottleSVG className="w-24 h-48" label="BPC-157" color="white" />
            </div>
            <div>
              <h2 className="font-poppins text-3xl md:text-4xl font-bold text-[#0B0B0B] mb-3">The Amino Club Guarantee</h2>
              <p className="text-[#555555] text-base md:text-lg">
                Documented quality for research and laboratory use. Every batch meets our internal purity standards.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: '99% Purity Guaranteed', sub: 'Every batch verified', stripe: '#5CB85C' },
              { title: 'Shipment Protection', sub: 'Every order fully covered', stripe: '#2196F3', hasQuestion: true },
              { title: 'CoA with Every Batch', sub: 'Third Party tested in America', stripe: '#FFEB3B', hasQuestion: true },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-lg shadow-sm flex overflow-hidden">
                <div className="w-[6px] flex-shrink-0" style={{ backgroundColor: item.stripe }} />
                <div className="p-6 flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: item.stripe }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-poppins font-semibold text-[#0B0B0B] text-[15px]">{item.title}</h3>
                      {item.hasQuestion && <QuestionIcon />}
                    </div>
                    <p className="text-sm text-[#555555] mt-0.5">{item.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. Featured Products ─── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-poppins text-2xl md:text-3xl font-bold text-[#0B0B0B]">Featured Products</h2>
              <p className="text-[#555555] text-sm mt-1">Research peptides, third-party identity tested</p>
            </div>
            <Link to="/store" className="text-sm font-medium text-[#0B0B0B] underline underline-offset-4 hover:text-gray-600">View all</Link>
          </div>
          <div className="relative">
            <button onClick={() => scroll(-1)} className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition hidden md:flex">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0B0B0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button onClick={() => scroll(1)} className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition hidden md:flex">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0B0B0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
            <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {featuredProducts.map((p) => (
                <div key={p.id} className="flex-shrink-0 w-[200px]">
                  <Link to={`/product/${p.id}`} className="block">
                    <div className="rounded-2xl overflow-hidden mb-3" style={{ backgroundColor: p.bgColor }}>
                      <div className="aspect-square flex items-center justify-center p-6">
                        <BottleSVG className="w-16 h-32" label={p.name === 'NAD+' ? 'NAD+' : p.name} color="white" />
                      </div>
                    </div>
                  </Link>
                  <h3 className="font-poppins font-semibold text-sm text-[#0B0B0B]">{p.name}</h3>
                  <p className="text-xs text-[#555555] mb-1">From</p>
                  <p className="font-poppins font-semibold text-sm text-[#0B0B0B] mb-1">${p.price.toFixed(2)}</p>
                  <p className="text-xs text-[#777] mb-3">{p.category}</p>
                  <div className="flex items-center gap-2">
                    <a href="#" className="text-xs font-medium border border-[#0B0B0B] text-[#0B0B0B] px-3 py-1.5 rounded-full hover:bg-[#0B0B0B] hover:text-white transition">View Studies</a>
                    <Link to={`/product/${p.id}`} className="bg-[#0B0B0B] text-white text-xs font-medium px-4 py-1.5 rounded-full hover:bg-[#131315] transition">View</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. Sign In CTA ─── */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#E0FFE5] rounded-3xl p-10 text-center">
            <h2 className="font-poppins text-2xl md:text-3xl font-bold text-[#0B0B0B] mb-2">20+ More Products</h2>
            <p className="text-[#555555] mb-6">Sign in or create an account to view our full catalog</p>
            <Link to="/store" className="inline-flex items-center gap-2 bg-[#0B0B0B] text-white font-medium px-8 py-3.5 rounded-full hover:bg-[#131315] transition">
              Get Access
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 7. Everything You Need to Succeed ─── */}
      <section className="py-16" style={{ backgroundColor: '#F5FCF7' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-poppins text-3xl md:text-4xl font-bold text-[#0B0B0B] text-center mb-12">Everything you need to succeed</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Card 1 - Community */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-[#DEF2E8] rounded-full flex items-center justify-center mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
              <h3 className="font-poppins font-semibold text-lg text-[#0B0B0B] mb-2">Join a community of researchers</h3>
              <p className="text-sm text-[#555555] mb-4">Every purchase unlocks access to our research community. Connect with fellow researchers, share lab notes, and reference up-to-date documentation on each compound.</p>
              <Link to="/store" className="inline-flex items-center gap-2 border border-[#DEF2E8] bg-white text-[#0B0B0B] text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#DEF2E8] transition">
                Shop & Join Community
              </Link>
            </div>
            {/* Card 2 - Quality */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-[#DEF2E8] rounded-full flex items-center justify-center mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              </div>
              <h3 className="font-poppins font-semibold text-lg text-[#0B0B0B] mb-2">Research-grade quality meets researcher-friendly pricing</h3>
              <p className="text-sm text-[#555555] mb-4">U.S.-based provider with in-house manufacturing. Every batch undergoes rigorous third-party identity and content testing with full documentation.</p>
              <Link to="/store" className="inline-flex items-center gap-2 border border-[#DEF2E8] bg-white text-[#0B0B0B] text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#DEF2E8] transition">
                Shop USA tested Peptides
              </Link>
            </div>
            {/* Card 3 - Support */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-[#DEF2E8] rounded-full flex items-center justify-center mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              </div>
              <h3 className="font-poppins font-semibold text-lg text-[#0B0B0B] mb-2">Expert support whenever you need it</h3>
              <p className="text-sm text-[#555555] mb-4">Our dedicated support team is available to help with product questions, order tracking, and research guidance.</p>
              <a href="#" className="inline-flex items-center gap-2 border border-[#DEF2E8] bg-white text-[#0B0B0B] text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#DEF2E8] transition">
                Contact Support
              </a>
            </div>
            {/* Card 4 - Library */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-[#DEF2E8] rounded-full flex items-center justify-center mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
              </div>
              <h3 className="font-poppins font-semibold text-lg text-[#0B0B0B] mb-2">Extensive research library at your fingertips</h3>
              <p className="text-sm text-[#555555] mb-4">Access our comprehensive collection of research articles, studies, and educational resources. Stay informed with our regularly updated blog.</p>
              <a href="#" className="inline-flex items-center gap-2 border border-[#DEF2E8] bg-white text-[#0B0B0B] text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#DEF2E8] transition">
                Explore Research Library
              </a>
            </div>
          </div>
          {/* Bottom row */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center md:text-left">
              <h3 className="font-poppins font-semibold text-lg text-[#0B0B0B]">Anywhere in the US, as fast as next day</h3>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="font-poppins font-semibold text-lg text-[#0B0B0B] mb-2">Free shipment protection on every order</h3>
              <p className="text-sm text-[#555555] mb-4">Every order is protected against damage, loss, or theft in transit. If your product arrives damaged, we'll replace it at no cost.</p>
              <Link to="/store" className="inline-flex items-center gap-2 border border-[#DEF2E8] bg-white text-[#0B0B0B] text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#DEF2E8] transition">
                Shop With Confidence
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. Quality Verification ─── */}
      <section className="py-16" style={{ background: 'linear-gradient(180deg, #E9FCE6 0%, #FFFFFF 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left */}
            <div>
              <h2 className="font-poppins text-3xl md:text-4xl font-bold text-[#0B0B0B] mb-3">Quality you can verify, not just trust</h2>
              <p className="text-[#555555] mb-8">Every batch is independently tested by accredited U.S. laboratories. We don't ask you to take our word for it—we give you the proof.</p>
              {/* Stats badges */}
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="inline-flex items-center bg-[#E8F5E9] text-[#2E7D32] text-sm font-semibold px-4 py-2 rounded-full">99%+ Purity Guaranteed</span>
                <span className="inline-flex items-center bg-[#E3F2FD] text-[#1565C0] text-sm font-semibold px-4 py-2 rounded-full">5 Quality Checks</span>
                <span className="inline-flex items-center bg-[#FFF3E0] text-[#E65100] text-sm font-semibold px-4 py-2 rounded-full">100% U.S. Verified</span>
              </div>
              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {qualityTabs.map(t => (
                  <button key={t.key} onClick={() => setActiveTab(t.key)}
                    className={`text-sm font-medium px-4 py-2 rounded-full transition ${
                      activeTab === t.key
                        ? 'text-[#00695C] font-semibold'
                        : 'bg-white text-[#0B0B0B] border border-gray-200 hover:bg-gray-50'
                    }`}
                    style={activeTab === t.key ? { background: 'linear-gradient(135deg, #E0F7FA 0%, #80DEEA 100%)' } : {}}>
                    {t.label}
                  </button>
                ))}
              </div>
              {/* Detail card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h4 className="font-poppins font-semibold text-[#0B0B0B] mb-1">{activeQuality.title}</h4>
                <p className="text-sm text-[#555555] mb-3">{activeQuality.desc}</p>
                <span className="inline-block bg-[#E8F5E9] text-[#2E7D32] text-xs font-semibold px-3 py-1 rounded-full mb-3">{activeQuality.method}</span>
                <div className="border-l-4 border-[#16A34A] pl-3 mb-4">
                  <p className="text-sm text-[#555555]"><strong>Why it matters:</strong> {activeQuality.why}</p>
                </div>
                <Link to="/store" className="inline-flex items-center gap-2 bg-[#0B0B0B] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#131315] transition">
                  Shop Now
                </Link>
                <div className="flex items-center gap-1.5 mt-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span className="text-xs text-[#555555]">Free COA included with every order</span>
                </div>
              </div>
            </div>
            {/* Right */}
            <div className="flex flex-col items-center gap-6">
              <div className="bg-white/60 rounded-3xl p-8 flex items-center justify-center">
                <BottleSVG className="w-28 h-56" label="BPC-157" color="white" />
              </div>
              <a href="#" className="text-sm font-medium text-[#0B0B0B] underline underline-offset-4 hover:text-gray-600">View our quality procedures</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. Free COA Strip ─── */}
      <section className="py-10" style={{ background: 'linear-gradient(135deg, #F0E8FF 0%, #FFFED7 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-poppins text-xl md:text-2xl font-bold text-[#0B0B0B] mb-4">Free COA included with every order</h3>
          <div className="flex items-center justify-center gap-4 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-white rounded-full px-4 py-2 text-sm font-medium text-[#0B0B0B] shadow-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              99%+ Purity
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white rounded-full px-4 py-2 text-sm font-medium text-[#0B0B0B] shadow-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              Verified by HPLC
            </span>
          </div>
          <Link to="/store" className="inline-flex items-center gap-2 bg-[#0B0B0B] text-white font-medium px-6 py-3 rounded-full hover:bg-[#131315] transition">
            See the Proof
          </Link>
        </div>
      </section>

      {/* ─── 10. Why Choose Amino Club? ─── */}
      <section className="py-16" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-poppins text-3xl md:text-4xl font-bold text-[#0B0B0B] text-center mb-12">Why choose Amino Club?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseCards.map((card) => (
              <div key={card.title} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-xl" style={{ backgroundColor: `${card.color}30` }}>
                  {card.icon}
                </div>
                <h3 className="font-poppins font-semibold text-[#0B0B0B] mb-2">{card.title}</h3>
                <p className="text-sm text-[#555555]">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 11. FAQ Section ─── */}
      <section className="py-16" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-poppins text-3xl md:text-4xl font-bold text-[#0B0B0B] text-center mb-2">Frequently Asked Questions</h2>
          <p className="text-center text-[#555555] mb-10">Everything you need to know about peptide research</p>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left">
                  <span className="font-medium text-[#0B0B0B] text-sm md:text-base pr-4">{item.q}</span>
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${openFaq === i ? 'bg-[#0B0B0B] text-white' : 'bg-gray-100 text-[#0B0B0B]'}`}>
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-[#555555] leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 12. CTA Strip ─── */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #FFFED7 0%, #F0E8FF 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-poppins text-2xl md:text-3xl lg:text-4xl font-bold text-[#0B0B0B] mb-6 leading-snug">
            All the research peptides you need, with the peace of mind and research community at your fingertips.
          </h2>
          <Link to="/store" className="inline-flex items-center gap-2 bg-[#0B0B0B] text-white font-medium px-8 py-3.5 rounded-full hover:bg-[#131315] transition">
            Shop Now
          </Link>
        </div>
      </section>

      {/* ─── 13. Newsletter ─── */}
      <section className="py-16" style={{ backgroundColor: '#F4EAFF' }}>
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-poppins text-2xl md:text-3xl font-bold text-[#0B0B0B] mb-2">Research updates from Amino Club</h2>
          <p className="text-sm text-[#555555] mb-6">Subscribe for catalog updates, new research compounds, and quality documentation news</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-full border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0B0B0B]/20" />
            <button className="bg-[#0B0B0B] text-white font-medium px-6 py-3 rounded-full hover:bg-[#131315] transition text-sm">Subscribe</button>
          </div>
          <p className="text-xs text-[#777] mt-3">For researchers and labs. No spam, unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  )
}
