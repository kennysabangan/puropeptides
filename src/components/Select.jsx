import { useEffect, useId, useRef, useState } from 'react'

// Modern custom select dropdown.
// Replaces native <select> with an Apple-style pill button + animated
// menu, full keyboard support, and consistent focus rings.
export default function Select({
  value,
  onChange,
  options,                  // [{ value, label }]
  placeholder = 'Select…',
  leftIcon = null,
  align = 'left',           // 'left' | 'right'
  className = '',
  buttonClassName = '',
  disabled = false,
  ariaLabel,
}) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef(null)
  const listRef = useRef(null)
  const id = useId()

  const selected = options.find((o) => o.value === value)
  const selectedIndex = options.findIndex((o) => o.value === value)

  // Close on outside click / ESC
  useEffect(() => {
    if (!open) return
    const onMouseDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [open])

  // Reset active index when opening to the currently-selected option
  useEffect(() => {
    if (open) setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
  }, [open, selectedIndex])

  // Scroll the active option into view as you arrow through
  useEffect(() => {
    if (!open || activeIndex < 0 || !listRef.current) return
    const el = listRef.current.children[activeIndex]
    if (el) el.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex])

  const choose = (val) => {
    onChange(val)
    setOpen(false)
  }

  const onKeyDown = (e) => {
    if (disabled) return
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        setOpen(true)
      }
      return
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(options.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(0, i - 1))
    } else if (e.key === 'Home') {
      e.preventDefault(); setActiveIndex(0)
    } else if (e.key === 'End') {
      e.preventDefault(); setActiveIndex(options.length - 1)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (activeIndex >= 0 && options[activeIndex]) choose(options[activeIndex].value)
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        aria-label={ariaLabel}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-[13px] font-medium transition select-none ${
          open
            ? 'border-[#1D1D1F]/40 bg-white shadow-sm'
            : 'border-[#E8E8ED] bg-[#FBFBFD] hover:bg-white hover:border-[#D1D1D6]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${buttonClassName}`}
      >
        {leftIcon && (
          <span className={`flex-shrink-0 ${selected ? 'text-[#1D1D1F]' : 'text-[#86868B]'}`}>
            {leftIcon}
          </span>
        )}
        <span className={`truncate ${selected ? 'text-[#1D1D1F]' : 'text-[#86868B]'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          width="13" height="13" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round"
          className={`ml-1 text-[#86868B] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Menu */}
      <div
        className={`absolute z-50 mt-2 min-w-full ${align === 'right' ? 'right-0' : 'left-0'}
          origin-top ${align === 'right' ? 'origin-top-right' : 'origin-top-left'}
          transition duration-150 ease-out
          ${open ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                 : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'}`}
        aria-hidden={!open}
      >
        <ul
          ref={listRef}
          id={`${id}-listbox`}
          role="listbox"
          tabIndex={-1}
          className="bg-white/95 backdrop-blur-xl rounded-2xl border border-black/[0.06] apple-shadow py-1.5 max-h-[280px] overflow-auto"
        >
          {options.map((opt, i) => {
            const isSelected = opt.value === value
            const isActive = i === activeIndex
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => choose(opt.value)}
                  className={`w-full text-left px-3.5 py-2 text-[13px] flex items-center justify-between gap-3 transition ${
                    isSelected ? 'text-[#1D1D1F] font-medium' : 'text-[#1D1D1F]/85'
                  } ${isActive ? 'bg-[#F5F5F7]' : ''}`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <svg
                      width="14" height="14" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2.6"
                      strokeLinecap="round" strokeLinejoin="round"
                      className="text-[#1D1D1F] flex-shrink-0"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
