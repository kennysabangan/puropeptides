import { Link } from 'react-router-dom'

const quickLinks = [
  { label: 'Shop', to: '/store' },
  { label: 'Certificates', to: '/coa' },
  { label: 'Research', to: '/research' },
  { label: 'Track Your Order', to: '/account/orders' },
  { label: 'Contact us', to: '/contact' },
]

const legalLinks = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Shipping & Returns', to: '/shipping' },
  { label: 'Terms & Conditions', to: '/terms' },
  { label: 'RUO Disclaimer', to: '/disclaimer' },
]

const Orbit = () => (
  <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="8" stroke="#C9A96E" strokeWidth="2" />
    <ellipse cx="20" cy="20" rx="18" ry="7" stroke="#C9A96E" strokeWidth="2" transform="rotate(-30 20 20)" />
  </svg>
)

function PaymentTile({ src, alt }) {
  return (
    <div className="h-9 w-14 rounded-lg bg-white flex items-center justify-center">
      <img src={src} alt={alt} className="h-4 w-auto object-contain" />
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="text-white" style={{ background: 'linear-gradient(165deg, #0F1A30 0%, #0A0E1A 100%)' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-16 pb-10">
        {/* FDA disclaimer card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 mb-14">
          <p className="text-[13px] text-white/65 leading-relaxed">
            <span className="font-bold text-white">FDA Disclaimer:</span> The statements made within
            this website have not been evaluated by the US Food and Drug Administration. The
            statements and the products of this company are not intended to diagnose, treat, cure, or
            prevent any disease. Amino Select is not a compounding pharmacy or chemical compounding
            facility as defined under 503A of the Federal Food, Drug, and Cosmetic Act. Amino Select
            is not an outsourcing facility as defined under 503B of the Federal Food, Drug, and
            Cosmetic Act. All products are sold for research, laboratory, or analytical purposes
            only, and are not for human consumption.
          </p>
        </div>

        {/* Brand + tagline + payment */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-12 lg:gap-10">
          <div>
            <Link to="/" className="mb-5 block">
              <img src="/images/logo.png" alt="Amino Select" className="h-20 w-auto" />
            </Link>
            <p className="text-[13px] text-white/55 leading-relaxed mb-6 max-w-[280px]">
              Free shipping over $200, rapid customer support, and fast shipping on research-grade
              peptides.
            </p>
            <div className="flex gap-2.5">
              <PaymentTile src="/images/homepage/payment-amex.svg" alt="American Express" />
              <PaymentTile src="/images/homepage/payment-visa.svg" alt="Visa" />
              <PaymentTile src="/images/homepage/payment-discover.svg" alt="Discover" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[15px] font-bold mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] flex-shrink-0" />
                  <Link to={l.to} className="text-[13px] text-white/65 hover:text-white transition">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Pages */}
          <div>
            <h4 className="text-[15px] font-bold mb-5">Legal Pages</h4>
            <ul className="space-y-3">
              {legalLinks.map((l) => (
                <li key={l.label} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] flex-shrink-0" />
                  <Link to={l.to} className="text-[13px] text-white/65 hover:text-white transition">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get In Touch */}
          <div>
            <h4 className="text-[15px] font-bold mb-5">Get In Touch</h4>
            <div className="space-y-4 text-[13px]">
              <div>
                <p className="text-white/55 mb-1">For general questions or more information:</p>
                <a href="mailto:inquiry@aminoselect.com" className="text-[#C9A96E] hover:underline">inquiry@aminoselect.com</a>
              </div>
              <div>
                <p className="text-white/55 mb-1">For orders, shipping, or product/quality concerns:</p>
                <a href="mailto:support@aminoselect.com" className="text-[#C9A96E] hover:underline">support@aminoselect.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-6 text-center">
          <p className="text-[12px] text-white/45">
            © 2026 Amino Select. For Research Use Only. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
