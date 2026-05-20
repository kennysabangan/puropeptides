import { useState } from 'react'
import { useVerification } from '../context/VerificationContext'

const FLOATING_VIALS = [
  { src: '/images/products/nad-plus/00.png',   top: '4%',  left: '72%', size: 180, rotate: -12, opacity: 0.55 },
  { src: '/images/products/bpc-157/00.png',    top: '10%', left: '12%', size: 150, rotate: 18,  opacity: 0.45 },
  { src: '/images/products/dsip/00.png',       top: '24%', left: '28%', size: 170, rotate: -22, opacity: 0.5  },
  { src: '/images/products/ghk-cu/00.png',     top: '22%', left: '58%', size: 130, rotate: 14,  opacity: 0.4  },
  { src: '/images/products/glow/00.png',       top: '64%', left: '20%', size: 220, rotate: 8,   opacity: 0.55 },
  { src: '/images/products/melanotan-i/00.png',top: '70%', left: '78%', size: 160, rotate: -16, opacity: 0.5  },
  { src: '/images/products/semax/00.png',      top: '82%', left: '46%', size: 130, rotate: 24,  opacity: 0.45 },
]

export default function ResearcherGate() {
  const { setVerified } = useVerification()
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [researcherConfirmed, setResearcherConfirmed] = useState(false)

  const canEnter = ageConfirmed && researcherConfirmed

  const handleEnter = () => {
    if (!canEnter) return
    setVerified()
  }

  const handleExit = () => {
    window.location.href = 'https://www.google.com'
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-[#EFF1F3]">
      {/* Floating vial backdrop */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {FLOATING_VIALS.map((v, i) => (
          <img
            key={i}
            src={v.src}
            alt=""
            className="absolute select-none"
            style={{
              top: v.top,
              left: v.left,
              width: v.size,
              opacity: v.opacity,
              transform: `rotate(${v.rotate}deg)`,
            }}
          />
        ))}
      </div>

      {/* Foreground */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-10">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="#1D1D1F" strokeWidth="1.5" />
            <path d="M10 8v12M18 8v12M10 14h8" stroke="#1D1D1F" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="font-semibold text-[20px] tracking-tight text-[#1D1D1F]">Amino Select</span>
        </div>

        {/* Card */}
        <div className="w-full max-w-[520px] bg-white/85 backdrop-blur-xl rounded-3xl apple-shadow p-8 sm:p-10">
          <h1 className="text-[28px] sm:text-[30px] font-bold text-[#1D1D1F] tracking-tight mb-3">
            Researcher verification
          </h1>
          <p className="text-[14px] leading-[1.55] text-[#86868B] mb-7">
            Amino Select sells research peptides exclusively to qualified researchers and laboratories
            for in vitro and laboratory use. Please confirm before continuing.
          </p>

          <label className="flex items-start gap-3 border border-black/10 rounded-2xl px-4 py-3.5 mb-3 cursor-pointer hover:bg-black/[0.02] transition">
            <input
              type="checkbox"
              checked={ageConfirmed}
              onChange={(e) => setAgeConfirmed(e.target.checked)}
              className="mt-0.5 w-[18px] h-[18px] accent-[#1D1D1F] cursor-pointer flex-shrink-0"
            />
            <span className="text-[14px] text-[#1D1D1F] leading-snug">
              I am at least <strong className="font-semibold">21 years of age</strong>.
            </span>
          </label>

          <label className="flex items-start gap-3 border border-black/10 rounded-2xl px-4 py-3.5 mb-6 cursor-pointer hover:bg-black/[0.02] transition">
            <input
              type="checkbox"
              checked={researcherConfirmed}
              onChange={(e) => setResearcherConfirmed(e.target.checked)}
              className="mt-0.5 w-[18px] h-[18px] accent-[#1D1D1F] cursor-pointer flex-shrink-0"
            />
            <span className="text-[14px] text-[#1D1D1F] leading-snug">
              I confirm I am a <strong className="font-semibold">qualified researcher</strong> purchasing
              for <strong className="font-semibold">in vitro / laboratory research</strong> only — not
              for human or veterinary use.
            </span>
          </label>

          <button
            type="button"
            onClick={handleEnter}
            disabled={!canEnter}
            className={`w-full rounded-full py-3.5 text-[15px] font-medium flex items-center justify-center gap-2 transition ${
              canEnter
                ? 'bg-[#1D1D1F] text-white btn-apple'
                : 'bg-[#1D1D1F]/20 text-white cursor-not-allowed'
            }`}
          >
            Enter Amino Select
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </button>

          <p className="text-[11px] leading-[1.55] text-[#86868B]/80 mt-6">
            By proceeding you affirm the statements above are true. Products are not for human or
            veterinary use, not for use in diagnostic procedures, and have not been evaluated by the
            U.S. Food and Drug Administration.{' '}
            <a href="#" className="underline hover:text-[#1D1D1F] transition">Full disclaimer.</a>
          </p>
        </div>

        <button
          type="button"
          onClick={handleExit}
          className="mt-6 text-[13px] text-[#86868B] hover:text-[#1D1D1F] transition"
        >
          Not a researcher? <span className="font-semibold">Exit</span>
        </button>
      </div>
    </div>
  )
}
