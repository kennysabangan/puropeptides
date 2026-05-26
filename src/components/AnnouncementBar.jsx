// Stacked promotional bars above the header, Orbitrex-style.
export default function AnnouncementBar() {
  return (
    <div className="relative z-[60]">
      <div className="bg-[#0F1419] text-white text-center px-4 py-2.5">
        <p className="text-[12px] sm:text-[13px] font-medium leading-snug">
          Free UPS 2nd Day Air on orders over $200 — select the option at checkout
        </p>
      </div>
      <div className="bg-[#D92D29] text-white text-center px-4 py-2.5">
        <p className="text-[12px] sm:text-[13px] font-semibold leading-snug">
          Limited-time sale — use code{' '}
          <span className="inline-block bg-white/95 text-[#D92D29] font-bold rounded px-1.5 py-0.5 mx-0.5 tracking-wide">
            AMINO20
          </span>{' '}
          for 20% off site-wide
        </p>
      </div>
    </div>
  )
}
