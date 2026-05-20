import { Link } from 'react-router-dom'

function FadeSection({ children, className = '', style = {} }) {
  return <section className={className} style={style}>{children}</section>
}

const productUseItems = [
  'Products are not intended for human consumption, injection, ingestion, or any therapeutic application.',
  'Products have not been evaluated or approved by the Food and Drug Administration (FDA).',
  'Products are not intended to diagnose, treat, cure, or prevent any disease or medical condition.',
  'No warranty or guarantee is made regarding the fitness of products for any particular research purpose.',
  'Buyers assume all responsibility for the safe handling, storage, and disposal of products.',
]

export default function DisclaimerPage() {
  return (
    <div>
      <section className="bg-white">
        <div className="max-w-[800px] mx-auto px-6 lg:px-8 pt-28 md:pt-36 pb-16 md:pb-24">
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#1D1D1F] leading-[1.05] tracking-[-0.03em] mb-5">
            Disclaimer
          </h1>
          <p className="text-[#86868B] text-[15px] leading-relaxed">
            Please read this disclaimer carefully before purchasing or using any Amino Select products.
          </p>
        </div>
      </section>

      <FadeSection className="pb-24">
        <div className="max-w-[800px] mx-auto px-6 lg:px-8">
          {/* Research Use Only */}
          <div className="bg-[#FFF3E0] border border-[#FFB74D]/30 rounded-[20px] p-8 mb-10">
            <div className="flex items-center gap-3 mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E65100" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <h2 className="font-bold text-[18px] text-[#E65100]">Research Use Only</h2>
            </div>
            <p className="text-[15px] text-[#86868B] leading-relaxed">
              All products sold by Amino Select are intended <strong className="text-[#1D1D1F]">strictly for laboratory research and educational purposes only</strong>. They are not drugs, foods, cosmetics, or medical devices. They are not intended for use in humans or animals.
            </p>
          </div>

          {/* General Disclaimer */}
          <div className="space-y-10">
            <div>
              <h2 className="font-semibold text-[17px] text-[#1D1D1F] mb-3">General Disclaimer</h2>
              <p className="text-[15px] text-[#86868B] leading-[1.75]">
                The information provided on this website is for general informational purposes only. While we strive to keep information accurate and up to date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-[17px] text-[#1D1D1F] mb-3">Product Use Disclaimer</h2>
              <ul className="space-y-3">
                {productUseItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] text-[#86868B] leading-[1.75]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#86868B] mt-2.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-[17px] text-[#1D1D1F] mb-3">No Medical Advice</h2>
              <p className="text-[15px] text-[#86868B] leading-[1.75]">
                Nothing on this website or in our product documentation should be construed as medical advice. Always consult a licensed healthcare professional before making health-related decisions. Amino Select does not provide medical consultations.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-[17px] text-[#1D1D1F] mb-3">Research Information</h2>
              <p className="text-[15px] text-[#86868B] leading-[1.75]">
                Research articles and educational content on this website are provided for informational purposes only. They do not constitute endorsements of any products for specific uses. Citation of studies does not imply that our products have been used in or approved for the referenced applications.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-[17px] text-[#1D1D1F] mb-3">Buyer Responsibility</h2>
              <p className="text-[15px] text-[#86868B] leading-[1.75] mb-4">
                By purchasing from Amino Select, you confirm that:
              </p>
              <ul className="space-y-3">
                {[
                  'You are at least 21 years of age.',
                  'You are a qualified researcher, or purchasing on behalf of a qualified research institution.',
                  'You will use products solely for legitimate research purposes.',
                  'You will comply with all applicable federal, state, and local laws regarding the purchase, handling, storage, and disposal of research chemicals.',
                  'You understand and accept the risks associated with handling research-grade compounds.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] text-[#86868B] leading-[1.75]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1D1D1F] mt-2.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </FadeSection>
    </div>
  )
}
