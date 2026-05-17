import { createContext, useContext, useEffect, useState } from 'react'

const VerificationContext = createContext()

const VERIFICATION_STORAGE_KEY = 'amino-select-verified'
// In dev (vite dev server) we always re-show the gate on refresh so we
// can iterate on its visual design. In prod, the verification persists
// in localStorage across sessions like before.
const PERSIST = !import.meta.env.DEV

function loadVerified() {
  if (!PERSIST) return false
  try {
    return localStorage.getItem(VERIFICATION_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function VerificationProvider({ children }) {
  const [verified, setVerifiedState] = useState(loadVerified)

  useEffect(() => {
    if (!PERSIST) return
    if (verified) {
      localStorage.setItem(VERIFICATION_STORAGE_KEY, 'true')
    }
  }, [verified])

  const setVerified = () => setVerifiedState(true)

  return (
    <VerificationContext.Provider value={{ verified, setVerified }}>
      {children}
    </VerificationContext.Provider>
  )
}

export function useVerification() {
  const ctx = useContext(VerificationContext)
  if (!ctx) throw new Error('useVerification must be used within VerificationProvider')
  return ctx
}
