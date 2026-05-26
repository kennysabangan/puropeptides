import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/account'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await signIn({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Sign in failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-14">
      <div className="w-full max-w-[440px] bg-white/85 backdrop-blur-xl rounded-3xl apple-shadow p-8 sm:p-10">
        <h1 className="text-[26px] font-bold text-[#1A1F2E] tracking-tight mb-2">Sign in</h1>
        <p className="text-[13px] text-[#8B95A5] mb-7">Access your orders, addresses, and saved cart.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[12px] font-medium text-[#1A1F2E] mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-[#1A1F2E] outline-none focus:border-[#1A1F2E] transition"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#1A1F2E] mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-[#1A1F2E] outline-none focus:border-[#1A1F2E] transition"
            />
          </div>

          {error && <p className="text-[12px] text-[#FF3B30]">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className={`w-full rounded-full py-3.5 text-[14px] font-medium transition ${
              busy ? 'bg-[#1A1F2E]/30 text-white cursor-not-allowed' : 'bg-[#1A1F2E] text-white btn-apple'
            }`}
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-[13px] text-[#8B95A5] mt-6 text-center">
          No account?{' '}
          <Link to="/register" className="text-[#1A1F2E] font-medium hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  )
}
