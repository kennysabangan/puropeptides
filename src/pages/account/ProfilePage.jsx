import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase, updateProfile } from '../../lib/supabase'

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()
  return (
    <ProfileForm
      key={`${user?.id || 'anon'}-${profile?.updated_at || ''}`}
      user={user}
      profile={profile}
      refreshProfile={refreshProfile}
    />
  )
}

function ProfileForm({ user, profile, refreshProfile }) {
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setMessage(null); setError(null); setSavingProfile(true)
    try {
      await updateProfile(user.id, { full_name: fullName })
      if (email && email !== user.email) {
        const { error: emailErr } = await supabase.auth.updateUser({ email })
        if (emailErr) throw emailErr
        setMessage('Saved. Check your inbox to confirm the new email.')
      } else {
        setMessage('Saved.')
      }
      await refreshProfile()
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setMessage(null); setError(null); setSavingPassword(true)
    try {
      const { error: pwErr } = await supabase.auth.updateUser({ password })
      if (pwErr) throw pwErr
      setPassword('')
      setMessage('Password updated.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="space-y-10 max-w-[520px]">
      <div>
        <h2 className="text-[18px] font-semibold text-[#1D1D1F] mb-5">Profile</h2>
        <form onSubmit={handleSaveProfile} className="space-y-3">
          <Field label="Full name" value={fullName} onChange={setFullName} />
          <Field label="Email" type="email" value={email} onChange={setEmail} />
          <button
            type="submit"
            disabled={savingProfile}
            className={`px-5 py-2.5 rounded-full text-[13px] font-medium transition ${
              savingProfile ? 'bg-[#1D1D1F]/30 text-white cursor-not-allowed' : 'bg-[#1D1D1F] text-white btn-apple'
            }`}
          >
            {savingProfile ? 'Saving…' : 'Save'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-[18px] font-semibold text-[#1D1D1F] mb-5">Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-3">
          <Field label="New password" type="password" value={password} onChange={setPassword} minLength={8} />
          <button
            type="submit"
            disabled={savingPassword || password.length < 8}
            className={`px-5 py-2.5 rounded-full text-[13px] font-medium transition ${
              savingPassword || password.length < 8
                ? 'bg-[#1D1D1F]/30 text-white cursor-not-allowed'
                : 'bg-[#1D1D1F] text-white btn-apple'
            }`}
          >
            {savingPassword ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>

      {message && <p className="text-[12px] text-[#16A34A]">{message}</p>}
      {error && <p className="text-[12px] text-[#FF3B30]">{error}</p>}
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', ...rest }) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-[#1D1D1F] mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-[#1D1D1F] outline-none focus:border-[#1D1D1F] transition"
        {...rest}
      />
    </div>
  )
}
