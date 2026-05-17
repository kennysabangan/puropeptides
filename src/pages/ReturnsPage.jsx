import { Link } from 'react-router-dom'

function FadeSection({ children, className = '', style = {} }) {
  return <section className={className} style={style}>{children}</section>
}

const eligible = [
  'Products damaged during shipping',
  'Incorrect items sent by our team',
  'Defective or compromised vials upon arrival',
  'Orders lost in transit',
]

const notEligible = [
  'Products opened or used after delivery',
  'Damage caused by improper storage',
  'Change of mind after order confirmation',
  'Orders delivered to incorrect addresses provided by customer',
]

export default function ReturnsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-28 md:pt-36 pb-16 md:pb-24 text-center">
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#1D1D1F] leading-[1.05] tracking-[-0.03em] mb-5">
            Returns & Refunds
          </h1>
          <p className="text-[#86868B] text-[17px] leading-relaxed max-w-2xl mx-auto">
            Every order is protected against damage in transit. If something goes wrong, we'll make it right.
          </p>
        </div>
      </section>

      {/* Damage Protection */}
      <FadeSection className="py-20 md:py-28" style={{ backgroundColor: '#FBFBFD' }}>
        <div className="max-w-[700px] mx-auto px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-[#E8F5ED] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>
          <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-[#1D1D1F] tracking-[-0.02em] mb-4">
            Damage Protection Policy
          </h2>
          <p className="text-[15px] text-[#86868B] leading-relaxed">
            Every Amino Select order includes free shipment protection. If your package arrives damaged, lost, or compromised in any way during transit, we'll send a replacement at no additional cost. No questions asked.
          </p>
        </div>
      </FadeSection>

      {/* How Returns Work */}
      <FadeSection className="py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-[#1D1D1F] text-center tracking-[-0.02em] mb-14">
            How Returns Work
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: '01', title: 'Document the Damage', desc: 'Take clear photos of the damaged product and packaging. Include the shipping label if visible.' },
              { num: '02', title: 'Contact Us', desc: 'Email support@aminoselect.com with your order number, photos, and a description of the issue.' },
              { num: '03', title: 'Get Your Replacement', desc: 'Once verified, we\'ll ship a replacement immediately. No need to return the damaged item.' },
            ].map((step) => (
              <div key={step.num} className="bg-white rounded-[20px] p-7 apple-shadow text-center">
                <span className="inline-block text-[11px] font-semibold text-[#86868B] tracking-wider mb-3">{step.num}</span>
                <h3 className="font-semibold text-[16px] text-[#1D1D1F] mb-2">{step.title}</h3>
                <p className="text-[14px] text-[#86868B] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* Eligible / Not Eligible */}
      <FadeSection className="py-20 md:py-28" style={{ backgroundColor: '#F5F5F7' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-[20px] p-8 apple-shadow">
              <div className="flex items-center gap-2 mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <h3 className="font-semibold text-[16px] text-[#1D1D1F]">Eligible for Replacement</h3>
              </div>
              <ul className="space-y-3">
                {eligible.map(item => (
                  <li key={item} className="flex items-start gap-3 text-[14px] text-[#86868B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-[20px] p-8 apple-shadow">
              <div className="flex items-center gap-2 mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <h3 className="font-semibold text-[16px] text-[#1D1D1F]">Not Eligible</h3>
              </div>
              <ul className="space-y-3">
                {notEligible.map(item => (
                  <li key={item} className="flex items-start gap-3 text-[14px] text-[#86868B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </FadeSection>

      {/* CTA */}
      <FadeSection className="py-24" style={{ background: 'linear-gradient(135deg, #FFFDE7 0%, #F5F0FF 100%)' }}>
        <div className="max-w-[800px] mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold text-[#1D1D1F] leading-snug tracking-[-0.02em] mb-4">
            Need help with an order?
          </h2>
          <p className="text-[#86868B] text-[15px] mb-8">Our support team is here to help, Monday through Friday.</p>
          <a href="mailto:support@aminoselect.com" className="btn-apple inline-flex items-center gap-2 bg-[#1D1D1F] text-white text-[15px] font-medium px-8 py-3.5 rounded-full">
            Contact Support
          </a>
        </div>
      </FadeSection>
    </div>
  )
}
