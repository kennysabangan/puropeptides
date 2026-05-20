import { createContext, useContext, useEffect, useState } from 'react'

const VerificationContext = createContext()

const VERIFICATION_STORAGE_KEY = 'amino-select-verified'
// TEMP — while iterating on the gate's visual design we want every page
// refresh to re-show it (including on the live Vercel deploy, which is
// where the design is being reviewed). Flip back to `true` before public
// launch so returning visitors aren't re-prompted.
const PERSIST = false

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
