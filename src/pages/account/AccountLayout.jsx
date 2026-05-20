import { NavLink, Outlet } from 'react-router-dom'

const NAV = [
  { to: '/account', label: 'Overview', end: true },
  { to: '/account/orders', label: 'Orders' },
  { to: '/account/profile', label: 'Profile' },
  { to: '/account/addresses', label: 'Addresses' },
]

export default function AccountLayout() {
  return (
    <div className="max-w-[1100px] mx-auto px-6 lg:px-8 py-10 md:py-14">
      <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold text-[#1D1D1F] tracking-tight mb-8">My account</h1>
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
        <aside>
          <nav className="flex md:flex-col gap-1 overflow-x-auto">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-xl text-[13px] font-medium whitespace-nowrap transition ${
                    isActive ? 'bg-[#1D1D1F] text-white' : 'text-[#1D1D1F]/70 hover:bg-[#F5F5F7]'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <section>
          <Outlet />
        </section>
      </div>
    </div>
  )
}
