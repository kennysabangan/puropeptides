function FadeSection({ children, className = '', style = {} }) {
  return <section className={className} style={style}>{children}</section>
}

const sections = [
  { title: 'Information We Collect', content: 'We collect information you provide directly, including your name, email address, shipping address, and payment information when you place an order. We also collect device and usage data automatically through cookies and similar technologies.' },
  { title: 'How We Use Your Information', content: 'We use your information to process and fulfill orders, communicate about your account and transactions, improve our website and products, detect and prevent fraud, and comply with legal obligations. We do not sell your personal information to third parties.' },
  { title: 'Cookies and Tracking', content: 'We use cookies and similar technologies to remember your preferences, analyze site traffic, and improve your experience. You can control cookie settings through your browser. Disabling cookies may affect site functionality.' },
  { title: 'Third-Party Services', content: 'We share information with trusted third-party service providers who assist with payment processing, shipping, analytics, and marketing. These providers are contractually obligated to protect your data and use it only for the services they provide to us.' },
  { title: 'Data Security', content: 'We implement industry-standard security measures including SSL encryption, secure payment processing, and access controls to protect your personal information. However, no method of transmission over the internet is 100% secure.' },
  { title: 'Your Rights', content: 'You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time. To exercise these rights, contact us at support@aminoselect.com.' },
  { title: 'Changes to This Policy', content: 'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.' },
]

export default function PrivacyPage() {
  return (
    <div>
      <section className="bg-white">
        <div className="max-w-[800px] mx-auto px-6 lg:px-8 pt-28 md:pt-36 pb-16 md:pb-24">
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#1A1F2E] leading-[1.05] tracking-[-0.03em] mb-4">
            Privacy Policy
          </h1>
          <p className="text-[#8B95A5] text-[14px] mb-2">Effective date: January 1, 2026</p>
          <p className="text-[#8B95A5] text-[15px] leading-relaxed">
            Your privacy matters to us. This policy explains how Amino Select collects, uses, and protects your information.
          </p>
        </div>
      </section>

      <FadeSection className="pb-24">
        <div className="max-w-[800px] mx-auto px-6 lg:px-8">
          <div className="space-y-10">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="font-semibold text-[17px] text-[#1A1F2E] mb-3">{s.title}</h2>
                <p className="text-[15px] text-[#8B95A5] leading-[1.75]">{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeSection>
    </div>
  )
}
