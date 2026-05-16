import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-black/5">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 md:h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" stroke="#1D1D1F" strokeWidth="1.5" />
              <path d="M10 8v12M18 8v12M10 14h8" stroke="#1D1D1F" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="font-semibold text-[15px] tracking-tight text-[#1D1D1F]">Puro Peptides</span>
          </Link>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center gap-7">
            <Link to="/store" className="text-[13px] text-[#1D1D1F]/80 hover:text-[#1D1D1F] transition font-medium">Products</Link>
            <a href="#" className="text-[13px] text-[#1D1D1F]/80 hover:text-[#1D1D1F] transition font-medium">Research</a>
            <a href="#" className="text-[13px] text-[#1D1D1F]/80 hover:text-[#1D1D1F] transition font-medium">Partner Program</a>
            <a href="#" className="text-[13px] text-[#1D1D1F]/80 hover:text-[#1D1D1F] transition font-medium">Contact</a>
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button className="text-[#1D1D1F]/70 hover:text-[#1D1D1F] transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            <button className="relative text-[#1D1D1F]/70 hover:text-[#1D1D1F] transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-[#1D1D1F] text-white text-[9px] font-semibold w-3.5 h-3.5 rounded-full flex items-center justify-center">0</span>
            </button>
            <button className="md:hidden text-[#1D1D1F]" onClick={() => setMobileOpen(!mobileOpen)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                {mobileOpen ? (
                  <>
                    <path d="M18 6L6 18M6 6l12 12" />
                  </>
                ) : (
                  <>
                    <path d="M3 12h18M3 6h18M3 18h18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden glass-nav border-t border-black/5 px-6 py-5">
          <nav className="flex flex-col gap-4">
            <Link to="/store" className="text-[15px] font-medium text-[#1D1D1F]" onClick={() => setMobileOpen(false)}>Products</Link>
            <a href="#" className="text-[15px] font-medium text-[#1D1D1F]">Research</a>
            <a href="#" className="text-[15px] font-medium text-[#1D1D1F]">Partner Program</a>
            <a href="#" className="text-[15px] font-medium text-[#1D1D1F]">Contact</a>
          </nav>
        </div>
      )}
    </header>
  )
}
