import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  supabase,
  signIn as apiSignIn,
  signUp as apiSignUp,
  signOut as apiSignOut,
  getProfile,
} from '../lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (u) => {
    if (!u) {
      setProfile(null)
      return
    }
    try {
      const p = await getProfile(u.id)
      setProfile(p)
    } catch (err) {
      console.error('Failed to load profile', err)
      setProfile(null)
    }
  }, [])

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return
      const u = data.session?.user ?? null
      setUser(u)
      await loadProfile(u)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      await loadProfile(u)
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [loadProfile])

  const signUp = async ({ email, password, fullName }) => {
    return apiSignUp({ email, password, fullName })
  }

  const signIn = async ({ email, password }) => {
    return apiSignIn({ email, password })
  }

  const signOut = async () => {
    await apiSignOut()
    setUser(null)
    setProfile(null)
  }

  const refreshProfile = async () => {
    await loadProfile(user)
  }

  const value = {
    user,
    profile,
    loading,
    isAdmin: !!profile?.is_admin,
    signUp,
    signIn,
    signOut,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
