import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RegisterPage() {
  const { signUp, signIn } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const [confirmSent, setConfirmSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      const result = await signUp({ email, password, fullName })
      if (result?.session) {
        navigate('/account', { replace: true })
        return
      }
      try {
        await signIn({ email, password })
        navigate('/account', { replace: true })
      } catch {
        setConfirmSent(true)
      }
    } catch (err) {
      setError(err.message || 'Sign up failed')
    } finally {
      setBusy(false)
    }
  }

  if (confirmSent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-[440px] bg-white/85 backdrop-blur-xl rounded-3xl apple-shadow p-8 sm:p-10 text-center">
          <h1 className="text-[24px] font-bold text-[#1D1D1F] tracking-tight mb-3">Check your email</h1>
          <p className="text-[14px] text-[#86868B] mb-6">
            We sent a confirmation link to <strong className="text-[#1D1D1F]">{email}</strong>. Click it to
            activate your account.
          </p>
          <Link to="/login" className="inline-block px-5 py-2.5 rounded-full bg-[#1D1D1F] text-white text-[13px] font-medium btn-apple">
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-14">
      <div className="w-full max-w-[440px] bg-white/85 backdrop-blur-xl rounded-3xl apple-shadow p-8 sm:p-10">
        <h1 className="text-[26px] font-bold text-[#1D1D1F] tracking-tight mb-2">Create account</h1>
        <p className="text-[13px] text-[#86868B] mb-7">For qualified researchers and laboratories.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[12px] font-medium text-[#1D1D1F] mb-1.5">Full name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-[#1D1D1F] outline-none focus:border-[#1D1D1F] transition"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#1D1D1F] mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-[#1D1D1F] outline-none focus:border-[#1D1D1F] transition"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#1D1D1F] mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-[#1D1D1F] outline-none focus:border-[#1D1D1F] transition"
            />
            <p className="text-[11px] text-[#86868B] mt-1.5">Minimum 8 characters.</p>
          </div>

          {error && <p className="text-[12px] text-[#FF3B30]">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className={`w-full rounded-full py-3.5 text-[14px] font-medium transition ${
              busy ? 'bg-[#1D1D1F]/30 text-white cursor-not-allowed' : 'bg-[#1D1D1F] text-white btn-apple'
            }`}
          >
            {busy ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-[13px] text-[#86868B] mt-6 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-[#1D1D1F] font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
