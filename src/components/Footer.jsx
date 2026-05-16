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
              Premium research peptides for the scientific community. All compounds verified for purity and quality.
            </p>
            <div className="flex gap-3">
              {['twitter', 'instagram', 'facebook'].map((s) => (
                <a key={s} href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:border-white transition">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {s === 'twitter' && <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 12 7.5v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />}
                    {s === 'instagram' && <><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" /></>}
                    {s === 'facebook' && <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-poppins font-semibold text-sm mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {['All Products', 'Best Sellers', 'New Arrivals', 'Bundles'].map((item) => (
                <li key={item}><Link to="/store" className="text-sm text-gray-400 hover:text-white transition">{item}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-poppins font-semibold text-sm mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {['Research Papers', 'Lab Results', 'Peptide Guide', 'Blog'].map((item) => (
                <li key={item}><a href="#" className="text-sm text-gray-400 hover:text-white transition">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-poppins font-semibold text-sm mb-4">Support</h4>
            <ul className="space-y-2.5">
              {['FAQ', 'Shipping Info', 'Returns', 'Contact'].map((item) => (
                <li key={item}><a href="#" className="text-sm text-gray-400 hover:text-white transition">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-poppins font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Disclaimer'].map((item) => (
                <li key={item}><a href="#" className="text-sm text-gray-400 hover:text-white transition">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* FDA Disclaimer */}
      <div className="bg-amber-500/10 border-t border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs text-amber-200/80 text-center">
            ⚠️ FDA Disclaimer: The statements made regarding these products have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">© 2026 Amino Club. All rights reserved.</p>
            <div className="flex items-center gap-6">
              {/* Payment icons */}
              <div className="flex items-center gap-3">
                {['Visa', 'MC', 'Amex', 'PayPal'].map((p) => (
                  <span key={p} className="text-[10px] font-medium text-gray-500 bg-gray-800 px-2 py-1 rounded">{p}</span>
                ))}
              </div>
              <div className="flex items-center gap-4">
                {['SSL Secured', '99% Purity', 'Lab Tested'].map((b) => (
                  <span key={b} className="text-[10px] text-gray-500">🔒 {b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
