import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#1D1D1F] text-white">
      {/* Main Footer */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="13" stroke="white" strokeWidth="1.5" />
                <path d="M10 8v12M18 8v12M10 14h8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="font-semibold text-[15px]">Amino Select</span>
            </Link>
            <p className="text-[13px] text-[#86868B] mb-8 max-w-xs leading-relaxed">
              Premium research-grade peptides for optimal controlled studies. Third-party tested with Certificate of Analysis.
            </p>
            <div className="flex gap-3">
              {[
                /* Instagram */
                <svg key="ig" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" />
                </svg>,
                /* X */
                <svg key="x" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
                /* YouTube */
                <svg key="yt" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>,
              ].map((icon) => (
                <a key={icon.key} href="#" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:border-white/60 transition text-white/60 hover:text-white">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* SHOP */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-wider uppercase text-[#86868B] mb-5">Shop</h4>
            <ul className="space-y-3">
              <li><Link to="/store" className="text-[13px] text-[#86868B] hover:text-white transition">All Products</Link></li>
            </ul>
          </div>
          {/* RESOURCES */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-wider uppercase text-[#86868B] mb-5">Resources</h4>
            <ul className="space-y-3">
              {['Research Library', 'Certificates of Analysis'].map(item => (
                <li key={item}><a href="#" className="text-[13px] text-[#86868B] hover:text-white transition">{item}</a></li>
              ))}
            </ul>
          </div>
          {/* SUPPORT */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-wider uppercase text-[#86868B] mb-5">Support</h4>
            <ul className="space-y-3">
              {['Contact Us', 'FAQ', 'Shipping Info', 'Returns'].map(item => (
                <li key={item}><a href="#" className="text-[13px] text-[#86868B] hover:text-white transition">{item}</a></li>
              ))}
            </ul>
          </div>
          {/* LEGAL */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-wider uppercase text-[#86868B] mb-5">Legal</h4>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Disclaimer', 'Research Use Only'].map(item => (
                <li key={item}><a href="#" className="text-[13px] text-[#86868B] hover:text-white transition">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        {/* FDA Disclaimer — yellow-bordered callout */}
        <div className="mt-12 rounded-2xl border border-[#F5C842]/40 bg-[#F5C842]/[0.04] p-5 flex gap-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5C842" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <h5 className="text-[12px] font-bold tracking-wider uppercase text-[#F5C842] mb-2">FDA Disclaimer</h5>
            <p className="text-[12px] text-white/65 leading-relaxed">
              Statements made regarding our products have <strong className="text-white/90">not been evaluated by the U.S. Food and Drug Administration</strong>. The efficacy of these products has not been confirmed by FDA-approved research. Products are <strong className="text-white/90">not intended to diagnose, treat, cure, or prevent any disease</strong>. Information presented on this website is not a substitute for, or alternative to, information from a qualified health care practitioner. Please consult a licensed health care professional regarding any potential interactions or complications before using any product. This notice is required under the Federal Food, Drug, and Cosmetic Act.{' '}
              <a href="#" className="text-[#F5C842] font-semibold hover:underline">Read the full disclaimer →</a>
            </p>
          </div>
        </div>
      </div>

      {/* Payment & Badges */}
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/images/homepage/payment-visa.png" alt="Visa" className="h-6 object-contain opacity-50" />
              <img src="/images/homepage/payment-amex.png" alt="Amex" className="h-6 object-contain opacity-50" />
              <img src="/images/homepage/payment-discover.png" alt="Discover" className="h-6 object-contain opacity-50" />
              <img src="/images/homepage/payment-applepay.png" alt="Apple Pay" className="h-6 object-contain opacity-50" />
            </div>
            <p className="text-[11px] text-[#86868B]/50">© 2026 Amino Select. All rights reserved.</p>
            <div className="flex items-center gap-5">
              {['SSL Secured', '99%+ Purity', 'Shipment Protection'].map(b => (
                <span key={b} className="text-[10px] text-[#86868B]/40">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
