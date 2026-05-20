import { Link } from 'react-router-dom'

function FadeSection({ children, className = '', style = {} }) {
  return <section className={className} style={style}>{children}</section>
}

const shippingMethods = [
  { method: 'Standard Shipping', time: '3–5 business days', cost: 'Calculated at checkout' },
  { method: 'Expedited Shipping', time: '2–3 business days', cost: 'Calculated at checkout' },
  { method: 'Overnight Shipping', time: 'Next business day', cost: 'Available — contact us' },
]

export default function ShippingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-28 md:pt-36 pb-16 md:pb-24 text-center">
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#1D1D1F] leading-[1.05] tracking-[-0.03em] mb-5">
            Shipping Information
          </h1>
          <p className="text-[#86868B] text-[17px] leading-relaxed max-w-2xl mx-auto">
            Fast, reliable shipping with free shipment protection on every order.
          </p>
        </div>
      </section>

      {/* Processing & Methods */}
      <FadeSection className="py-20 md:py-28" style={{ backgroundColor: '#FBFBFD' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Processing */}
            <div>
              <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-[#1D1D1F] tracking-[-0.02em] mb-6">
                Processing Times
              </h2>
              <div className="bg-white rounded-[20px] p-7 apple-shadow mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#E8F5ED] rounded-full flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[15px] text-[#1D1D1F]">0–2 Business Days</h3>
                    <p className="text-[13px] text-[#86868B]">Orders placed before 2 PM PST ship same day</p>
                  </div>
                </div>
                <p className="text-[14px] text-[#86868B] leading-relaxed">
                  Most orders are processed and shipped within one business day. You'll receive a tracking number via email as soon as your order ships.
                </p>
              </div>
            </div>

            {/* Methods */}
            <div>
              <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-[#1D1D1F] tracking-[-0.02em] mb-6">
                Shipping Methods
              </h2>
              <div className="space-y-4">
                {shippingMethods.map((m) => (
                  <div key={m.method} className="bg-white rounded-[20px] p-6 apple-shadow flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[15px] text-[#1D1D1F]">{m.method}</h3>
                      <p className="text-[13px] text-[#86868B]">{m.time}</p>
                    </div>
                    <span className="text-[13px] text-[#86868B]">{m.cost}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeSection>

      {/* Features */}
      <FadeSection className="py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: 'Free Shipping Over $150', desc: 'Orders over $150 qualify for free standard shipping within the United States.', color: '#E8F5ED', icon: '🚚' },
              { title: 'Free Shipment Protection', desc: 'Every order is covered against loss, theft, and damage in transit at no additional cost.', color: '#E8F0FE', icon: '🛡️' },
              { title: 'Discreet Packaging', desc: 'All orders ship in plain, unmarked packaging with no external branding or product identification.', color: '#FFF3E0', icon: '📦' },
              { title: 'Cold Pack Shipping', desc: 'Temperature-sensitive items are shipped with insulated packaging and cold packs when required.', color: '#E0F7FA', icon: '🧊' },
              { title: 'Full Tracking', desc: 'Real-time tracking updates via email. Monitor your shipment from our facility to your door.', color: '#F5F0FF', icon: '📍' },
              { title: 'International Shipping', desc: 'We ship to select international destinations. Contact support@aminoselect.com for availability and rates.', color: '#FCE4EC', icon: '🌍' },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-[20px] p-7 apple-shadow card-lift">
                <div className="text-2xl mb-3">{card.icon}</div>
                <h3 className="font-semibold text-[15px] text-[#1D1D1F] mb-2">{card.title}</h3>
                <p className="text-[13px] text-[#86868B] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* CTA */}
      <FadeSection className="py-24" style={{ background: 'linear-gradient(135deg, #FFFDE7 0%, #F5F0FF 100%)' }}>
        <div className="max-w-[800px] mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold text-[#1D1D1F] leading-snug tracking-[-0.02em] mb-8">
            Ready to order?
          </h2>
          <Link to="/store" className="btn-apple inline-flex items-center gap-2 bg-[#1D1D1F] text-white text-[15px] font-medium px-8 py-3.5 rounded-full">
            Browse Products
          </Link>
        </div>
      </FadeSection>
    </div>
  )
}
