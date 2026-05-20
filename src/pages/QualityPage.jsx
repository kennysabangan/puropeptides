import { Link } from 'react-router-dom'

function FadeSection({ children, className = '', style = {}, delay = 0 }) {
  return (
    <section className={className} style={style}>
      {children}
    </section>
  )
}

const differenceCards = [
  { title: 'USA-Based', desc: 'All manufacturing and quality testing is conducted in the United States. Our facilities operate under strict domestic standards.', icon: '🇺🇸' },
  { title: 'Controlled Synthesis', desc: 'Each peptide is synthesized in-house using automated solid-phase peptide synthesis (SPPS) for precise sequence control.', icon: '🔬' },
  { title: 'Third-Party Testing', desc: 'Independent ISO 17025 accredited laboratories verify every batch before release. Results are available on request.', icon: '✅' },
  { title: '99%+ Purity', desc: 'Our purity standard is 99% or higher, confirmed through HPLC analysis and mass spectrometry on every batch.', icon: '💎' },
]

const qualitySteps = [
  { num: '01', title: 'Raw Material Verification', desc: 'All starting amino acids and reagents are sourced from verified suppliers and tested for identity and purity before entering production.' },
  { num: '02', title: 'Peptide Synthesis', desc: 'Automated SPPS systems build each peptide chain amino acid by amino acid under controlled conditions for maximum accuracy.' },
  { num: '03', title: 'Purification', desc: 'Crude peptides undergo preparative HPLC purification to remove incomplete sequences, protecting groups, and synthesis byproducts.' },
  { num: '04', title: 'Identity & Content Testing', desc: 'Mass spectrometry confirms molecular weight. HPLC determines purity percentage. Amino acid analysis verifies composition.' },
  { num: '05', title: 'Documentation', desc: 'A Certificate of Analysis is generated for each batch, recording all test results, lot numbers, and expiration dates.' },
  { num: '06', title: 'Packaging & Storage', desc: 'Lyophilized peptides are sealed under argon atmosphere in sterile vials, then stored at controlled temperatures until shipment.' },
]

const commitments = [
  { title: 'In-House Manufacturing', desc: 'We control every step of production in our U.S. facility — from synthesis to packaging.', color: '#E8F5ED' },
  { title: 'Batch Traceability', desc: 'Every vial can be traced back to its production batch, raw materials, and test results.', color: '#E8F0FE' },
  { title: 'Continuous Improvement', desc: 'We regularly audit and upgrade our processes to stay ahead of industry standards.', color: '#FFF3E0' },
  { title: 'Transparent Communication', desc: 'We publish testing methodologies and welcome questions about our quality procedures.', color: '#F5F0FF' },
]

export default function QualityPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-28 md:pt-36 pb-16 md:pb-24 text-center">
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#1D1D1F] leading-[1.05] tracking-[-0.03em] mb-5">
            Our Quality Commitment
          </h1>
          <p className="text-[#86868B] text-[17px] leading-relaxed max-w-2xl mx-auto">
            Every peptide we produce is synthesized, purified, and verified under rigorous quality controls. We don't cut corners — your research depends on it.
          </p>
        </div>
      </section>

      {/* The Amino Select Difference */}
      <FadeSection className="py-20 md:py-28" style={{ backgroundColor: '#FBFBFD' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-[#1D1D1F] text-center tracking-[-0.02em] mb-14">
            The Amino Select Difference
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {differenceCards.map((card) => (
              <div key={card.title} className="bg-white rounded-[20px] p-7 apple-shadow card-lift">
                <div className="text-2xl mb-4">{card.icon}</div>
                <h3 className="font-semibold text-[15px] text-[#1D1D1F] mb-2">{card.title}</h3>
                <p className="text-[13px] text-[#86868B] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* Our Quality Process */}
      <FadeSection className="py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-[#1D1D1F] text-center tracking-[-0.02em] mb-4">
            Our Quality Process
          </h2>
          <p className="text-center text-[#86868B] text-[15px] mb-14 max-w-2xl mx-auto">
            From raw materials to your lab bench, every step is documented and verified.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qualitySteps.map((step) => (
              <div key={step.num} className="bg-white rounded-[20px] p-7 apple-shadow">
                <span className="text-[11px] font-semibold text-[#86868B] tracking-wider">{step.num}</span>
                <h3 className="font-semibold text-[16px] text-[#1D1D1F] mt-2 mb-2">{step.title}</h3>
                <p className="text-[13px] text-[#86868B] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* Our Commitments */}
      <FadeSection className="py-20 md:py-28" style={{ backgroundColor: '#F5F5F7' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-[#1D1D1F] text-center tracking-[-0.02em] mb-14">
            Our Commitments
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {commitments.map((card) => (
              <div key={card.title} className="bg-white rounded-[20px] p-8 apple-shadow card-lift">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: card.color }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[16px] text-[#1D1D1F] mb-2">{card.title}</h3>
                <p className="text-[14px] text-[#86868B] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* CTA */}
      <FadeSection className="py-24" style={{ background: 'linear-gradient(135deg, #FFFDE7 0%, #F5F0FF 100%)' }}>
        <div className="max-w-[800px] mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold text-[#1D1D1F] leading-snug tracking-[-0.02em] mb-4">
            See the proof for yourself
          </h2>
          <p className="text-[#86868B] text-[15px] mb-8">Browse our catalog or review our Certificates of Analysis.</p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/store" className="btn-apple inline-flex items-center gap-2 bg-[#1D1D1F] text-white text-[15px] font-medium px-8 py-3.5 rounded-full">
              Browse Products
            </Link>
            <Link to="/coa" className="inline-flex items-center gap-2 border border-[#1D1D1F]/10 text-[#1D1D1F] text-[15px] font-medium px-8 py-3.5 rounded-full hover:bg-[#1D1D1F]/5 transition">
              View COAs
            </Link>
          </div>
        </div>
      </FadeSection>
    </div>
  )
}
