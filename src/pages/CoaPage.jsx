import { Link } from 'react-router-dom'

function FadeSection({ children, className = '', style = {} }) {
  return <section className={className} style={style}>{children}</section>
}

const coaFields = [
  { field: 'Purity', desc: 'Expressed as a percentage (e.g., 99.2%). Determined by HPLC — higher means fewer impurities. Look for 99% or above.', icon: '📊' },
  { field: 'Identity', desc: 'Confirmed via Mass Spectrometry. The measured molecular weight must match the theoretical mass of the peptide sequence.', icon: '🧬' },
  { field: 'Appearance', desc: 'Describes the physical state — typically "white lyophilized powder." Deviations may indicate moisture or degradation.', icon: '👁️' },
  { field: 'Endotoxin', desc: 'Measured in EU/mg. Lower is better. Our peptides are tested for endotoxin levels to ensure cleanliness.', icon: '🛡️' },
]

const testsPerformed = [
  'High-Performance Liquid Chromatography (HPLC)',
  'Mass Spectrometry (MS)',
  'Amino Acid Analysis',
  'Endotoxin Testing (LAL)',
  'Residual Solvent Analysis',
  'Water Content (Karl Fischer)',
  'Peptide Content Determination',
  'Visual Inspection',
]

export default function CoaPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-28 md:pt-36 pb-16 md:pb-24 text-center">
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#1A1F2E] leading-[1.05] tracking-[-0.03em] mb-5">
            Certificates of Analysis
          </h1>
          <p className="text-[#8B95A5] text-[17px] leading-relaxed max-w-2xl mx-auto">
            A Certificate of Analysis (CoA) is a lab-issued document that verifies a peptide batch meets its identity, purity, and quality specifications. Every Amino Select product ships with one.
          </p>
        </div>
      </section>

      {/* How to Read a COA */}
      <FadeSection className="py-20 md:py-28" style={{ backgroundColor: '#FAFAF7' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-[#1A1F2E] text-center tracking-[-0.02em] mb-4">
            How to Read a CoA
          </h2>
          <p className="text-center text-[#8B95A5] text-[15px] mb-14 max-w-2xl mx-auto">
            Understanding your Certificate of Analysis helps you verify the quality of your research materials.
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            {coaFields.map((item) => (
              <div key={item.field} className="bg-white rounded-[20px] p-7 apple-shadow card-lift">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-[16px] text-[#1A1F2E] mb-2">{item.field}</h3>
                <p className="text-[14px] text-[#8B95A5] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* What's Tested */}
      <FadeSection className="py-20 md:py-28">
        <div className="max-w-[700px] mx-auto px-6 lg:px-8">
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-[#1A1F2E] text-center tracking-[-0.02em] mb-14">
            What's Tested
          </h2>
          <div className="space-y-0">
            {testsPerformed.map((test, i) => (
              <div key={test} className="flex items-center gap-4 py-4 border-b border-[#E8E8ED] last:border-0">
                <div className="w-8 h-8 rounded-full bg-[#F7F5F0] flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-[15px] text-[#1A1F2E]">{test}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* CTA */}
      <FadeSection className="py-24" style={{ background: 'linear-gradient(135deg, #FFFDE7 0%, #F5F0FF 100%)' }}>
        <div className="max-w-[800px] mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold text-[#1A1F2E] leading-snug tracking-[-0.02em] mb-4">
            Every batch. Every order. Full documentation.
          </h2>
          <p className="text-[#8B95A5] text-[15px] mb-8">Browse our catalog and see the quality for yourself.</p>
          <Link to="/store" className="btn-apple inline-flex items-center gap-2 bg-[#1A1F2E] text-white text-[15px] font-medium px-8 py-3.5 rounded-full">
            Browse Products
          </Link>
        </div>
      </FadeSection>
    </div>
  )
}
