import { useState } from 'react'

function FadeSection({ children, className = '', style = {} }) {
  return <section className={className} style={style}>{children}</section>
}

const faqItems = [
  { q: 'How do I track my order?', a: 'Once your order ships, you\'ll receive an email with a tracking number and link. You can also log into your account to view order status and tracking details at any time.' },
  { q: 'What if I received the wrong item?', a: 'Contact us at support@aminoselect.com with your order number and a photo of the item received. We\'ll ship the correct product immediately and provide a prepaid return label.' },
  { q: 'How can I verify the quality of my peptides?', a: 'Every order includes a Certificate of Analysis (CoA) specific to your batch. You can also request additional testing documentation by contacting our support team.' },
  { q: 'Do you offer bulk or institutional pricing?', a: 'Yes — we offer volume pricing for larger research orders. Contact us at support@aminoselect.com with your requirements and we\'ll prepare a custom quote.' },
]

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-28 md:pt-36 pb-16 md:pb-24 text-center">
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#1A1F2E] leading-[1.05] tracking-[-0.03em] mb-5">
            Contact Us
          </h1>
          <p className="text-[#8B95A5] text-[17px] leading-relaxed max-w-2xl mx-auto">
            Questions about an order, our products, or research documentation? We typically respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Email & FAQ */}
      <FadeSection className="py-20 md:py-28" style={{ backgroundColor: '#FAFAF7' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Left: Email + Form */}
            <div>
              <div className="mb-10">
                <h3 className="font-semibold text-[15px] text-[#1A1F2E] mb-2">Email Us</h3>
                <a href="mailto:support@aminoselect.com" className="text-[#1A1F2E] text-[17px] font-medium hover:underline">
                  support@aminoselect.com
                </a>
                <p className="text-[13px] text-[#8B95A5] mt-1">We respond within 24 hours, Monday through Friday.</p>
              </div>

              {submitted ? (
                <div className="bg-white rounded-[20px] p-8 apple-shadow text-center">
                  <div className="w-14 h-14 bg-[#F7F5F0] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-[17px] text-[#1A1F2E] mb-2">Message Sent</h3>
                  <p className="text-[14px] text-[#8B95A5]">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-[20px] p-8 apple-shadow space-y-5">
                  <div>
                    <label className="block text-[13px] font-medium text-[#1A1F2E] mb-1.5">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E8ED] bg-[#FAFAF7] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A1F2E]/10 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#1A1F2E] mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E8ED] bg-[#FAFAF7] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A1F2E]/10 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#1A1F2E] mb-1.5">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E8ED] bg-[#FAFAF7] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A1F2E]/10 transition appearance-none"
                    >
                      <option value="">Select a subject</option>
                      <option value="order">Order Question</option>
                      <option value="product">Product Question</option>
                      <option value="quality">Quality & COA</option>
                      <option value="shipping">Shipping</option>
                      <option value="returns">Returns & Refunds</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#1A1F2E] mb-1.5">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E8ED] bg-[#FAFAF7] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A1F2E]/10 transition resize-none"
                    />
                  </div>
                  <button type="submit" className="btn-apple w-full bg-[#1A1F2E] text-white font-medium py-3.5 rounded-full text-[15px]">
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Right: FAQ */}
            <div>
              <h3 className="font-semibold text-[20px] text-[#1A1F2E] mb-6">Frequently Asked</h3>
              <div className="space-y-0">
                {faqItems.map((item, i) => (
                  <div key={i} className="border-b border-[#E8E8ED]">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between py-5 text-left group"
                    >
                      <span className="font-medium text-[15px] text-[#1A1F2E] pr-6 group-hover:text-[#1A1F2E]/70 transition">{item.q}</span>
                      <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center text-[#8B95A5] transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </button>
                    <div className={`accordion-content ${openFaq === i ? 'open' : ''}`}>
                      <div className="accordion-inner">
                        <p className="text-[14px] text-[#8B95A5] leading-relaxed pb-5">{item.a}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeSection>
    </div>
  )
}
