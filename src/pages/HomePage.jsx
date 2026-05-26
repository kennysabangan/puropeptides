import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SectionEyebrow from '../components/SectionEyebrow'
import StatsBand from '../components/StatsBand'
import SpecCard from '../components/SpecCard'
import DifferenceCarousel from '../components/DifferenceCarousel'
import ProductCard from '../components/ProductCard'

/* ─── Featured products (static config; ids map to product slugs) ─── */
const featuredProducts = [
  { id: 'ghk-cu', name: 'GHK-Cu', price: 29.99, dosage: '10MG', bg_color: '#EDEDED' },
  { id: 'nad-plus', name: 'NAD+', price: 69.99, dosage: '10MG', bg_color: '#EDEDED' },
  { id: 'bpc-157', name: 'BPC-157', price: 39.99, dosage: '10MG', bg_color: '#EDEDED' },
  { id: 'tb-500', name: 'TB-500', price: 39.99, dosage: '10MG', bg_color: '#EDEDED' },
  { id: 'semax', name: 'SEMAX', price: 29.99, dosage: '10MG', bg_color: '#EDEDED' },
  { id: 'selank', name: 'SELANK', price: 29.99, dosage: '10MG', bg_color: '#EDEDED' },
  { id: 'glutathione', name: 'Glutathione', price: 59.99, dosage: '10MG', bg_color: '#EDEDED' },
  { id: 'dsip', name: 'DSIP', price: 29.99, dosage: '10MG', bg_color: '#EDEDED' },
].map((p) => ({ ...p, slug: p.id }))

/* ─── Standards (folds the old quality-tabs messaging into a numbered list) ─── */
const standards = [
  { n: '01', title: 'Proven Purity', body: 'Independently verified to 99%+ by accredited U.S. labs via HPLC and mass spectrometry — authenticity and consistency in every batch.' },
  { n: '02', title: 'Precise Dosage', body: 'Precision-weighed and securely sealed so every vial contains exactly what the label says, down to the microgram.' },
  { n: '03', title: 'Long-Term Stability', body: 'pH and stability testing ensures every lyophilized batch stays intact through its labeled shelf life.' },
  { n: '04', title: 'Contaminant-Free', body: 'Third-party sterility and endotoxin (LAL) testing confirms products are free of bacteria, fungi, and harmful toxins.' },
  { n: '05', title: 'Quality Traceability', body: 'Every product is documented to its Certificate of Analysis so you can trace the vial back to its lab report.' },
]

/* ─── FAQ ─── */
const faqItems = [
  { q: 'What purity level are your peptides and how is it verified?', a: 'All Amino Select peptides are guaranteed 99%+ pure. Each batch is independently tested by accredited U.S. laboratories using HPLC (High-Performance Liquid Chromatography) and Mass Spectrometry. We provide a Certificate of Analysis (CoA) with every order showing exact purity percentages, molecular weight verification, and amino acid sequence confirmation.' },
  { q: 'What is a Certificate of Analysis (CoA) and how do I read it?', a: 'A Certificate of Analysis is an official lab document that verifies your peptide\'s quality. Key sections include: Purity (should be 99%+), Identity (confirms correct peptide via mass spec), Appearance (should match product description), and Endotoxin levels (should be below 1 EU/mg). Each CoA is batch-specific and available on product pages.' },
  { q: 'What should I expect with my order?', a: 'Orders are processed within 0–2 business days and shipped via standard carriers, with applicable documentation (including the Certificate of Analysis) included. Same-day shipping is available for orders placed before the daily cutoff. All orders ship in discreet, unlabeled packaging.' },
  { q: 'How should I store the lyophilized product?', a: 'Store lyophilized peptides at −20 °C for long-term storage, though 2–8 °C is acceptable for short periods. Reconstituted solutions should be stored at 2–8 °C and used promptly. Avoid repeated freeze-thaw cycles. Properly stored lyophilized peptides remain stable for 2+ years.' },
  { q: 'What does "for research use only" mean?', a: '"For research use only" indicates that products are supplied solely for laboratory research and analytical purposes. They are not intended for human or veterinary use, diagnostics, therapeutics, or any clinical application.' },
  { q: 'What if my package is lost, damaged, or stolen?', a: 'Every order includes shipment protection. If your package is lost, damaged, or stolen in transit, contact our support team within 30 days of the shipping date for a replacement or refund.' },
  { q: 'Do you ship internationally?', a: 'Currently we ship to all 50 U.S. states. International availability varies by country due to customs regulations on research materials — contact support for specifics. International orders may be subject to local customs fees and import duties.' },
  { q: 'Are these peptides for human use?', a: 'No. All Amino Select peptides are sold strictly for research, laboratory, and educational purposes. They are not approved for human consumption, veterinary use, or any therapeutic application. By purchasing, you confirm you are a qualified researcher and will use products in accordance with all applicable laws.' },
]

const ArrowUpRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M7 7h10v10" />
  </svg>
)

const trustDots = ['3rd-party verified', 'Same-day shipping', 'Batch traceability']

/* ─── FAQ row ─── */
function FaqRow({ item, open, onToggle }) {
  return (
    <div className="rounded-2xl border border-black/[0.08] bg-white overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left">
        <span className="text-[15px] sm:text-[16px] font-semibold text-[#141B16]">{item.q}</span>
        <span className="relative w-5 h-5 flex-shrink-0 text-[#2ECC6A]">
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-current rounded-full" />
          <span className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-current rounded-full transition-transform duration-300 ${open ? 'rotate-90' : ''}`} />
        </span>
      </button>
      <div className={`grid transition-[grid-template-rows] duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <p className="text-[14px] text-[#5B6660] leading-relaxed px-5 sm:px-6 pb-5">{item.a}</p>
        </div>
      </div>
    </div>
  )
}

/* ─── Scroll-to-top FAB ─── */
function ScrollTopFab() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className={`fab-scroll-top fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-white shadow-lg border border-black/10 flex items-center justify-center text-[#1A5C30] ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  )
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState(0)
  const heroProduct = featuredProducts.find((p) => p.id === 'tb-500')

  return (
    <>
      {/* ─── Hero (dark) ─── */}
      <section className="hero-orbitrex">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-16 lg:pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <SectionEyebrow>Research-grade peptides</SectionEyebrow>
            <h1 className="mt-6 text-[44px] sm:text-[58px] lg:text-[64px] font-extrabold text-white tracking-[-0.03em] leading-[1.03]">
              Quality you can trace.<br />Numbers you can <span className="accent-italic">verify</span>.
            </h1>
            <p className="mt-6 text-[16px] sm:text-[17px] text-[#A8BDB0] leading-relaxed max-w-[480px]">
              Every Amino Select peptide ships with a third-party Certificate of Analysis and
              batch-level traceability that links the vial to its lab report. No unknowns. No
              compromises.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link
                to="/store"
                className="btn-brand inline-flex items-center justify-center gap-2.5 rounded-full bg-[#2ECC6A] text-[#06210F] font-semibold text-[15px] px-7 py-4 hover:bg-[#34D873] transition"
              >
                Shop the Catalog <ArrowUpRight />
              </Link>
              <Link
                to="/coa"
                className="inline-flex items-center justify-center rounded-full border border-white/25 text-white font-medium text-[15px] px-7 py-4 hover:bg-white/5 transition"
              >
                View COAs
              </Link>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
              {trustDots.map((t) => (
                <li key={t} className="flex items-center gap-2 label-mono !tracking-[0.12em] text-white/55 !text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC6A]" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — spec card */}
          <div className="flex justify-center lg:justify-end">
            <SpecCard
              name={heroProduct.name}
              dosage={heroProduct.dosage}
              price={heroProduct.price}
              sku="AS-TB500"
              image={`/images/products/${heroProduct.id}/${heroProduct.id}-vial.png`}
              href={`/product/${heroProduct.slug}`}
            />
          </div>
        </div>

        {/* Stats band (still on dark) */}
        <StatsBand />
      </section>

      {/* ─── 01 Mission (light) ─── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-[820px] mx-auto px-6 text-center">
          <SectionEyebrow number="01" className="justify-center">Mission</SectionEyebrow>
          <h2 className="mt-6 text-[34px] sm:text-[44px] font-extrabold text-[#141B16] tracking-[-0.02em] leading-[1.1]">
            Where dedication meets <span className="accent-italic">accuracy</span>
          </h2>
          <p className="mt-6 text-[16px] sm:text-[17px] text-[#5B6660] leading-relaxed">
            Independent researchers deserve a foundation they can rely on. That's why we deliver
            research-grade peptides with proven purity, precise dosing, and full traceability. Every
            product is third-party tested, every vial is documented to its Certificate of Analysis,
            and every order ships fast. No shortcuts. No compromises. Just science you can trust.
          </p>
        </div>
      </section>

      {/* ─── 02 Standards (light) ─── */}
      <section className="bg-[#F7F8F7] py-20 lg:py-28">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
          <SectionEyebrow number="02">Standards</SectionEyebrow>
          <h2 className="mt-6 mb-12 text-[34px] sm:text-[44px] font-extrabold text-[#141B16] tracking-[-0.02em] leading-[1.08] max-w-[520px]">
            Five things we get right, every batch.
          </h2>
          <div className="divide-y divide-black/[0.08] border-t border-black/[0.08]">
            {standards.map((s) => (
              <div key={s.n} className="grid grid-cols-[auto_1fr] sm:grid-cols-[120px_1fr] gap-x-6 gap-y-2 py-7">
                <div className="label-mono text-[#2ECC6A] flex items-start gap-2 pt-1">
                  <span className="text-[#5B6660]">→</span> {s.n}
                </div>
                <div>
                  <h3 className="text-[19px] sm:text-[21px] font-bold text-[#141B16] mb-2">{s.title}</h3>
                  <p className="text-[14px] sm:text-[15px] text-[#5B6660] leading-relaxed max-w-[620px]">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 03 Catalog (light) ─── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <SectionEyebrow number="03">Catalog</SectionEyebrow>
          <div className="mt-6 mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <h2 className="text-[34px] sm:text-[44px] font-extrabold text-[#141B16] tracking-[-0.02em] leading-[1.08]">
              Best-selling research <span className="accent-italic">peptides</span>
            </h2>
            <Link
              to="/store"
              className="btn-brand inline-flex items-center gap-2.5 rounded-full bg-[#1A5C30] text-white font-semibold text-[14px] px-6 py-3.5 hover:bg-[#15502A] transition self-start sm:self-auto"
            >
              See All Products <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {featuredProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── 04 Difference (dark carousel) ─── */}
      <section className="section-forest py-20 lg:py-28">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
          <SectionEyebrow number="04" dark>Difference</SectionEyebrow>
          <h2 className="mt-6 mb-12 text-[34px] sm:text-[44px] font-extrabold text-white tracking-[-0.02em] leading-[1.08]">
            What sets <span className="accent-italic">Amino Select</span> apart.
          </h2>
          <DifferenceCarousel />
        </div>
      </section>

      {/* ─── 05 FAQ (light) ─── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-[860px] mx-auto px-6 lg:px-10">
          <SectionEyebrow number="05">FAQ</SectionEyebrow>
          <h2 className="mt-6 mb-12 text-[34px] sm:text-[44px] font-extrabold text-[#141B16] tracking-[-0.02em] leading-[1.08]">
            Frequently asked <span className="accent-italic">questions</span>
          </h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <FaqRow key={i} item={item} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
            ))}
          </div>
        </div>
      </section>

      <ScrollTopFab />
    </>
  )
}
