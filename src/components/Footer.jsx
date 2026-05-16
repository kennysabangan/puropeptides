import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#0A192F] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-1.5 mb-4">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="13" stroke="white" strokeWidth="2" />
                <path d="M10 8v12M18 8v12M10 14h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="font-poppins font-bold text-lg">amino club</span>
            </Link>
            <p className="text-sm text-gray-400 mb-6 max-w-xs">
              Premium research-grade peptides for optimal controlled studies and performance. Third-party tested with Certificate of Analysis.
            </p>
            <div className="flex gap-3">
              {/* Instagram */}
              <a href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:border-white transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" />
                </svg>
              </a>
              {/* X */}
              <a href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:border-white transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              {/* YouTube */}
              <a href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:border-white transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
              </a>
            </div>
          </div>

          {/* SHOP */}
          <div>
            <h4 className="font-poppins font-semibold text-sm mb-4">SHOP</h4>
            <ul className="space-y-2.5">
              <li><Link to="/store" className="text-sm text-gray-400 hover:text-white transition">All Products</Link></li>
            </ul>
          </div>
          {/* RESOURCES */}
          <div>
            <h4 className="font-poppins font-semibold text-sm mb-4">RESOURCES</h4>
            <ul className="space-y-2.5">
              {['Research Library', 'Certificates of Analysis'].map(item => (
                <li key={item}><a href="#" className="text-sm text-gray-400 hover:text-white transition">{item}</a></li>
              ))}
            </ul>
          </div>
          {/* SUPPORT */}
          <div>
            <h4 className="font-poppins font-semibold text-sm mb-4">SUPPORT</h4>
            <ul className="space-y-2.5">
              {['Contact Us', 'FAQ', 'Shipping Info', 'Returns & Refunds'].map(item => (
                <li key={item}><a href="#" className="text-sm text-gray-400 hover:text-white transition">{item}</a></li>
              ))}
            </ul>
          </div>
          {/* LEGAL */}
          <div>
            <h4 className="font-poppins font-semibold text-sm mb-4">LEGAL</h4>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Terms of Service', 'Disclaimer'].map(item => (
                <li key={item}><a href="#" className="text-sm text-gray-400 hover:text-white transition">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* FDA Disclaimer */}
      <div className="bg-amber-500/10 border-t border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-start gap-2">
            <span className="text-amber-400 text-sm mt-0.5">⚠️</span>
            <p className="text-xs text-amber-200/80">
              <strong>FDA DISCLAIMER:</strong> Statements made regarding our products have not been evaluated by the U.S. Food and Drug Administration. The efficacy of these products has not been confirmed by FDA-approved research. Products are not intended to diagnose, treat, cure, or prevent any disease. Information presented is not a substitute for information from a qualified health care practitioner. Please consult a licensed health care professional before using any product. <a href="#" className="underline">Read the full disclaimer →</a>
            </p>
          </div>
        </div>
      </div>

      {/* Payment & Badges */}
      <div className="border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-500 bg-gray-800 px-2 py-1 rounded">VISA</span>
                <span className="text-[10px] font-bold text-gray-500 bg-gray-800 px-2 py-1 rounded">AMEX</span>
                <span className="text-[10px] font-bold text-gray-500 bg-gray-800 px-2 py-1 rounded">DISCOVER</span>
                <span className="text-[10px] font-bold text-gray-500 bg-gray-800 px-2 py-1 rounded">Apple Pay</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">© 2026 Amino Club. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {['SSL Secured', '99%+ Purity', 'Shipment Protection'].map(b => (
                <span key={b} className="text-[10px] text-gray-500">🔒 {b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
