import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-[70px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" stroke="#0B0B0B" strokeWidth="2" />
              <path d="M10 8v12M18 8v12M10 14h8" stroke="#0B0B0B" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="font-poppins font-bold text-lg tracking-tight">amino club</span>
          </Link>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/store" className="text-[13px] font-medium text-[#0B0B0B] hover:text-gray-600 transition">Products</Link>
            <a href="#" className="text-[13px] font-medium text-[#0B0B0B] hover:text-gray-600 transition">Research</a>
            <a href="#" className="text-[13px] font-medium text-[#0B0B0B] hover:text-gray-600 transition">Partner Program</a>
            <a href="#" className="text-[13px] font-medium text-[#0B0B0B] hover:text-gray-600 transition">Contact us</a>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button className="text-[#0B0B0B] hover:text-gray-600 transition">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            <button className="relative text-[#0B0B0B] hover:text-gray-600 transition">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className="absolute -top-1.5 -right-1.5 bg-[#0B0B0B] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </button>
            <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4">
          <nav className="flex flex-col gap-3">
            <Link to="/store" className="text-sm font-medium text-[#0B0B0B]" onClick={() => setMobileOpen(false)}>Products</Link>
            <a href="#" className="text-sm font-medium text-[#0B0B0B]">Research</a>
            <a href="#" className="text-sm font-medium text-[#0B0B0B]">Partner Program</a>
            <a href="#" className="text-sm font-medium text-[#0B0B0B]">Contact us</a>
          </nav>
        </div>
      )}
    </header>
  )
}
