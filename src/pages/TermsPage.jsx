function FadeSection({ children, className = '', style = {} }) {
  return <section className={className} style={style}>{children}</section>
}

const sections = [
  { title: '1. Acceptance of Terms', content: 'By accessing and using the Amino Select website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or purchase our products.' },
  { title: '2. Products and Use', content: 'All products sold by Amino Select are intended strictly for research, laboratory, and educational purposes only. Our products are not approved for human consumption, therapeutic use, or diagnostic applications. By purchasing, you agree to use our products solely for lawful research purposes.' },
  { title: '3. Age Requirements', content: 'You must be at least 21 years of age to purchase products from Amino Select. By placing an order, you confirm that you meet this age requirement and are legally permitted to purchase research peptides in your jurisdiction.' },
  { title: '4. Purchases and Payment', content: 'All prices are listed in U.S. Dollars. Payment is required at the time of order. We accept major credit cards, debit cards, and other payment methods as displayed at checkout. Orders are subject to acceptance and availability.' },
  { title: '5. Shipping', content: 'We ship to all 50 U.S. states. International shipping is available to select destinations. Processing times are 0–2 business days. Shipping costs and delivery estimates are provided at checkout. Risk of loss passes to you upon delivery to the carrier.' },
  { title: '6. Returns and Refunds', content: 'All orders include free shipment protection. Products damaged, lost, or compromised during transit are eligible for replacement. We do not accept returns for products that have been opened, used, or stored improperly. Contact support@aminoselect.com for return requests.' },
  { title: '7. Intellectual Property', content: 'All content on this website — including text, graphics, logos, images, and software — is the property of Amino Select and protected by applicable intellectual property laws. You may not reproduce, distribute, or modify any content without prior written consent.' },
  { title: '8. Limitation of Liability', content: 'To the fullest extent permitted by law, Amino Select shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our products or website. Our total liability shall not exceed the amount paid for the product in question.' },
  { title: '9. Governing Law', content: 'These Terms are governed by and construed in accordance with the laws of the State of Delaware, without regard to conflict of law principles. Any disputes shall be resolved in the courts of Delaware.' },
  { title: '10. Changes to Terms', content: 'We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated effective date. Continued use of the website after changes constitutes acceptance of the revised terms.' },
]

export default function TermsPage() {
  return (
    <div>
      <section className="bg-white">
        <div className="max-w-[800px] mx-auto px-6 lg:px-8 pt-28 md:pt-36 pb-16 md:pb-24">
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#1D1D1F] leading-[1.05] tracking-[-0.03em] mb-4">
            Terms of Service
          </h1>
          <p className="text-[#86868B] text-[14px] mb-2">Effective date: January 1, 2026</p>
          <p className="text-[#86868B] text-[15px] leading-relaxed">
            Please read these terms carefully before using Amino Select or purchasing our products.
          </p>
        </div>
      </section>

      <FadeSection className="pb-24">
        <div className="max-w-[800px] mx-auto px-6 lg:px-8">
          <div className="space-y-10">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="font-semibold text-[17px] text-[#1D1D1F] mb-3">{s.title}</h2>
                <p className="text-[15px] text-[#86868B] leading-[1.75]">{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeSection>
    </div>
  )
}
