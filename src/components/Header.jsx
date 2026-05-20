import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import AccountMenu from './AccountMenu'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { getCartCount, openCart } = useCart()
  const cartCount = getCartCount()
  const location = useLocation()
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <header className="bg-[#E6E8EA] border-b border-black/5">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Wordmark */}
          <Link to="/" className="flex flex-col leading-none">
            <span className="font-bold text-[26px] tracking-tight text-[#1D1D1F] lowercase">amino</span>
            <span className="text-[11px] tracking-[0.2em] text-[#1D1D1F]/70 uppercase font-semibold -mt-0.5 self-end">select</span>
          </Link>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            <Link to="/store" className={`text-[14px] font-medium transition nav-link ${isActive('/store') ? 'text-[#1A5C30] nav-link-active' : 'text-[#1D1D1F]'}`}>Products</Link>
            <a href="#research" className="text-[14px] text-[#1D1D1F] font-medium nav-link transition">Research</a>
            <a href="#partner" className="text-[14px] text-[#1D1D1F] font-medium nav-link transition">Partner Program</a>
            <a href="#contact" className="text-[14px] text-[#1D1D1F] font-medium nav-link transition">Contact us</a>
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-5">
            <AccountMenu />
            <button onClick={openCart} aria-label="Open cart" className="relative text-[#1D1D1F]/80 hover:text-[#1D1D1F] transition">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-[#1D1D1F] text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            </button>
            <button className="md:hidden text-[#1D1D1F]" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-[#E6E8EA] border-t border-black/5 px-6 py-5">
          <nav className="flex flex-col gap-4">
            <Link to="/store" className={`text-[15px] font-medium transition ${isActive('/store') ? 'text-[#1A5C30]' : 'text-[#1D1D1F]'}`} onClick={() => setMobileOpen(false)}>Products</Link>
            <a href="#research" className="text-[15px] font-medium text-[#1D1D1F] transition hover:text-[#1A5C30]">Research</a>
            <a href="#partner" className="text-[15px] font-medium text-[#1D1D1F] transition hover:text-[#1A5C30]">Partner Program</a>
            <a href="#contact" className="text-[15px] font-medium text-[#1D1D1F] transition hover:text-[#1A5C30]">Contact us</a>
          </nav>
        </div>
      )}
    </header>
  )
}
