import { useState } from 'react'

function FadeSection({ children, className = '', style = {} }) {
  return <section className={className} style={style}>{children}</section>
}

const categories = ['All', 'Tissue Repair', 'Cellular', 'Neuro', 'Dermal', 'Circadian']

const articles = [
  { title: 'BPC-157 and Tendon Healing: A Review', category: 'Tissue Repair', date: '2026-03-15', desc: 'An overview of preclinical research on BPC-157\'s effects on tendon and ligament repair mechanisms.' },
  { title: 'TB-500 in Wound Repair Models', category: 'Tissue Repair', date: '2026-02-28', desc: 'Examining the role of thymosin beta-4 analogs in accelerated wound healing across animal models.' },
  { title: 'NAD+ Precursors and Cellular Energy', category: 'Cellular', date: '2026-03-01', desc: 'How NAD+ supplementation affects mitochondrial function and cellular energy metabolism.' },
  { title: 'Glutathione: The Master Antioxidant', category: 'Cellular', date: '2026-01-20', desc: 'A comprehensive review of glutathione\'s role in oxidative stress defense and cellular detoxification.' },
  { title: 'SEMAX and Cognitive Performance', category: 'Neuro', date: '2026-02-10', desc: 'Investigating nootropic properties of SEMAX in preclinical cognitive testing models.' },
  { title: 'SELANK: Anxiolytic Peptide Research', category: 'Neuro', date: '2026-01-15', desc: 'Research into SELANK\'s mechanisms of action on GABAergic and serotonergic systems.' },
  { title: 'GHK-Cu and Dermal Regeneration', category: 'Dermal', date: '2026-03-05', desc: 'How copper peptide complexes stimulate collagen synthesis and skin remodeling.' },
  { title: 'DSIP and Sleep Architecture', category: 'Circadian', date: '2026-02-20', desc: 'Exploring delta sleep-inducing peptide\'s effects on sleep stage distribution and quality.' },
  { title: 'Melanotan II: Research Applications', category: 'Dermal', date: '2026-01-30', desc: 'Current research on melanocortin receptor agonists in pigmentation studies.' },
]

export default function ResearchPage() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All' ? articles : articles.filter(a => a.category === activeCategory)

  return (
    <div>
      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-28 md:pt-36 pb-16 md:pb-24 text-center">
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#1D1D1F] leading-[1.05] tracking-[-0.03em] mb-5">
            Research Library
          </h1>
          <p className="text-[#86868B] text-[17px] leading-relaxed max-w-2xl mx-auto">
            Explore peer-reviewed studies, research summaries, and educational resources on the peptides we offer.
          </p>
        </div>
      </section>

      {/* Category Filters & Articles */}
      <FadeSection className="py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap gap-2.5 mb-12 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[13px] font-medium px-5 py-2.5 rounded-full transition-all ${
                  activeCategory === cat
                    ? 'bg-[#1D1D1F] text-white'
                    : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((article) => (
              <div key={article.title} className="bg-white rounded-[20px] p-7 apple-shadow card-lift">
                <span className="inline-block text-[11px] font-semibold text-[#86868B] tracking-wider uppercase mb-3">{article.category}</span>
                <h3 className="font-semibold text-[16px] text-[#1D1D1F] mb-2">{article.title}</h3>
                <p className="text-[13px] text-[#86868B] leading-relaxed mb-4">{article.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#86868B]/60">{article.date}</span>
                  <span className="inline-flex items-center gap-1 text-[13px] font-medium text-[#1D1D1F] hover:gap-1.5 transition-all cursor-pointer">
                    Read more
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeSection>
    </div>
  )
}
