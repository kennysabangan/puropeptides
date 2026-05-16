import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-bold text-[#0B0B0B] leading-tight mb-6">
              Researcher<br />sign-in required
            </h1>
            <p className="text-[#555555] text-base md:text-lg mb-8 max-w-md">
              Access our premium catalog of research peptides. Verified for 99%+ purity, independently tested, and shipped with care.
            </p>
            <Link
              to="/store"
              className="inline-flex items-center gap-2 bg-[#0B0B0B] text-white font-medium px-8 py-3.5 rounded-full hover:bg-[#131315] transition"
            >
              Get Started
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="relative">
            <div className="bg-[#F0EBFF] rounded-3xl p-8 md:p-12 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
              {/* Decorative bottles */}
              <div className="flex items-end gap-6">
                <svg viewBox="0 0 80 160" className="w-16 h-32 opacity-80" fill="none">
                  <rect x="28" y="0" width="24" height="16" rx="3" fill="#0B0B0B" opacity="0.15" />
                  <rect x="22" y="16" width="36" height="8" rx="2" fill="#0B0B0B" opacity="0.2" />
                  <rect x="20" y="24" width="40" height="120" rx="8" fill="white" stroke="#0B0B0B" strokeWidth="2" opacity="0.9" />
                  <text x="40" y="80" textAnchor="middle" fill="#0B0B0B" fontSize="8" fontFamily="Poppins" fontWeight="600">BPC</text>
                  <text x="40" y="92" textAnchor="middle" fill="#0B0B0B" fontSize="8" fontFamily="Poppins" fontWeight="600">-157</text>
                </svg>
                <svg viewBox="0 0 80 160" className="w-20 h-40" fill="none">
                  <rect x="28" y="0" width="24" height="16" rx="3" fill="#0B0B0B" opacity="0.15" />
                  <rect x="22" y="16" width="36" height="8" rx="2" fill="#0B0B0B" opacity="0.2" />
                  <rect x="20" y="24" width="40" height="120" rx="8" fill="white" stroke="#0B0B0B" strokeWidth="2" opacity="0.9" />
                  <text x="40" y="80" textAnchor="middle" fill="#0B0B0B" fontSize="8" fontFamily="Poppins" fontWeight="600">GLP</text>
                  <text x="40" y="92" textAnchor="middle" fill="#0B0B0B" fontSize="8" fontFamily="Poppins" fontWeight="600">-3</text>
                </svg>
                <svg viewBox="0 0 80 160" className="w-14 h-28 opacity-70" fill="none">
                  <rect x="28" y="0" width="24" height="16" rx="3" fill="#0B0B0B" opacity="0.15" />
                  <rect x="22" y="16" width="36" height="8" rx="2" fill="#0B0B0B" opacity="0.2" />
                  <rect x="20" y="24" width="40" height="120" rx="8" fill="white" stroke="#0B0B0B" strokeWidth="2" opacity="0.9" />
                  <text x="40" y="86" textAnchor="middle" fill="#0B0B0B" fontSize="8" fontFamily="Poppins" fontWeight="600">NAD+</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="bg-[#E9FCE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="font-poppins text-3xl md:text-4xl font-bold text-[#0B0B0B] mb-3">The Amino Club Guarantee</h2>
            <p className="text-[#555555]">Every peptide, independently verified.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { title: '99%+ Purity', desc: 'Every batch independently tested by third-party laboratories for verified purity standards.' },
              { title: 'Fast Shipping', desc: 'Free shipping on orders over $150. Overnight options available for urgent research needs.' },
              { title: 'Secure & Private', desc: '256-bit SSL encryption. Discreet packaging. Your research stays confidential.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-[#16A34A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className="font-poppins font-semibold text-[#0B0B0B] mb-2">{item.title}</h3>
                <p className="text-sm text-[#555555]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
