import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function initialOf(profile, user) {
  const source = profile?.full_name || user?.email || '?'
  return source.trim().charAt(0).toUpperCase()
}

export default function AccountMenu() {
  const { user, profile, isAdmin, signOut, loading } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  const handleSignOut = async () => {
    setOpen(false)
    await signOut()
    navigate('/')
  }

  if (loading) {
    return (
      <button className="text-[#1A1F2E]/40" aria-label="Account">
        <UserIcon />
      </button>
    )
  }

  if (!user) {
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-[#1A1F2E]/70 hover:text-[#1A1F2E] transition"
          aria-label="Account"
        >
          <UserIcon />
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl apple-shadow border border-black/5 py-2 z-50">
            <Link to="/login" onClick={() => setOpen(false)} className="block px-4 py-2 text-[13px] text-[#1A1F2E] hover:bg-[#F5F5F7]">Sign in</Link>
            <Link to="/register" onClick={() => setOpen(false)} className="block px-4 py-2 text-[13px] text-[#1A1F2E] hover:bg-[#F5F5F7]">Create account</Link>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-7 h-7 rounded-full bg-[#1A1F2E] text-white text-[12px] font-semibold flex items-center justify-center hover:opacity-90 transition"
        aria-label="Account menu"
      >
        {initialOf(profile, user)}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl apple-shadow border border-black/5 py-2 z-50">
          <div className="px-4 py-2 border-b border-black/5">
            <p className="text-[13px] font-medium text-[#1A1F2E] truncate">{profile?.full_name || 'Account'}</p>
            <p className="text-[11px] text-[#8B95A5] truncate">{user.email}</p>
          </div>
          <Link to="/account" onClick={() => setOpen(false)} className="block px-4 py-2 text-[13px] text-[#1A1F2E] hover:bg-[#F5F5F7]">Overview</Link>
          <Link to="/account/orders" onClick={() => setOpen(false)} className="block px-4 py-2 text-[13px] text-[#1A1F2E] hover:bg-[#F5F5F7]">Orders</Link>
          <Link to="/account/profile" onClick={() => setOpen(false)} className="block px-4 py-2 text-[13px] text-[#1A1F2E] hover:bg-[#F5F5F7]">Profile</Link>
          <Link to="/account/addresses" onClick={() => setOpen(false)} className="block px-4 py-2 text-[13px] text-[#1A1F2E] hover:bg-[#F5F5F7]">Addresses</Link>
          {isAdmin && (
            <Link to="/admin" onClick={() => setOpen(false)} className="block px-4 py-2 text-[13px] text-[#1A1F2E] hover:bg-[#F5F5F7] border-t border-black/5">
              Admin
            </Link>
          )}
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-[13px] text-[#FF3B30] hover:bg-[#F5F5F7] border-t border-black/5"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
