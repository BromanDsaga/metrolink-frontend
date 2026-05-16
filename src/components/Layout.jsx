import { motion } from 'framer-motion'
import {
  Grid2X2,
  Home,
  LogOut,
  Menu,
  ShoppingCart,
  UserRound,
} from 'lucide-react'

import {
  Link,
  NavLink,
  useNavigate,
} from 'react-router-dom'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useCartStore } from '../store/cartStore'

export default function Layout({ children }) {

  const [visible, setVisible] = useState(true)
  const [lastY, setLastY] = useState(0)
  const [user, setUser] = useState(null)
  const [search, setSearch] = useState('')

  const count = useCartStore((state) => state.count())

  const navigate = useNavigate()

  // Load user
  useEffect(() => {

    const stored = localStorage.getItem('user')

    if (stored) {
      setUser(JSON.parse(stored))
    }

  }, [])

  // Header hide/show on scroll
  useEffect(() => {

    const onScroll = () => {

      const current = window.scrollY

      setVisible(current < 80 || current < lastY)

      setLastY(current)

    }

    window.addEventListener('scroll', onScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }

  }, [lastY])

  // Clean display name
  const displayName = useMemo(() => {

    if (user?.fullName?.trim()) {
      return user.fullName.trim().split(' ')[0]
    }

    if (user?.email) {
      return user.email.split('@')[0]
    }

    return 'Account'

  }, [user])

  // Logout
  const handleLogout = () => {

    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setUser(null)

    navigate('/')

  }

  return (
    <>

      <motion.header
        animate={{ y: visible ? 0 : -120 }}
        transition={{
          duration: 0.25,
          ease: 'easeOut',
        }}
        className="fixed inset-x-0 top-0 z-50"
      >

        {/* Top Banner */}
        <div className="bg-red-700 py-2 text-center text-xs font-medium text-white">
          FREE delivery on orders over ₦20,000
        </div>

        {/* Main Navbar */}
        <div className="border-b border-zinc-200 bg-white/95 backdrop-blur">

          <div className="container-shell flex h-20 items-center gap-4">

            {/* Logo */}
            <Link
              to="/"
              className="flex shrink-0 items-center gap-3"
            >

              <span className="grid h-10 w-10 place-items-center rounded-full bg-red-600 text-lg font-bold text-white">
                M
              </span>

              <span>

                <span className="block text-lg font-bold leading-none">
                  Metrolink
                </span>

                <span className="text-xs text-zinc-500">
                  Everyday Essentials
                </span>

              </span>

            </Link>

            {/* Search */}
            <div className="hidden flex-1 items-center rounded-full border border-zinc-200 bg-zinc-50 px-4 md:flex">

              <input
                className="h-11 flex-1 bg-transparent text-sm outline-none"
                placeholder="Search for products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {

                  if (e.key === 'Enter' && search.trim()) {

                    navigate(
                      `/products?query=${encodeURIComponent(
                        search.trim()
                      )}`
                    )

                    setSearch('')

                  }

                }}
              />

              <button
                onClick={() => {

                  if (search.trim()) {

                    navigate(
                      `/products?query=${encodeURIComponent(
                        search.trim()
                      )}`
                    )

                    setSearch('')

                  }

                }}
                className="border-l border-zinc-200 pl-4 text-sm text-zinc-500 transition hover:text-red-600"
              >
                Search
              </button>

            </div>

            {/* Desktop Navigation */}
            <nav className="ml-auto hidden items-center gap-6 text-sm lg:flex">

              {[
                ['Categories', '/products'],
                ['Deals', '/products'],
                ...(user?.role === 'ADMIN'
                  ? [['Admin', '/admin']]
                  : []),
              ].map(([label, href]) => (

                <NavLink
                  key={label}
                  to={href}
                  className={({ isActive }) =>
                    isActive
                      ? 'font-semibold text-red-600'
                      : 'text-zinc-600 hover:text-red-600'
                  }
                >
                  {label}
                </NavLink>

              ))}

            </nav>

            {/* Right Side */}
            <div className="ml-auto flex items-center gap-2 lg:ml-2">

              {/* Cart */}
              <Link
                to="/cart"
                className="relative grid h-11 w-11 place-items-center rounded-full border border-zinc-200 text-zinc-700 hover:border-red-200 hover:text-red-600"
              >

                <ShoppingCart size={19} />

                {count > 0 && (

                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                    {count}
                  </span>

                )}

              </Link>

              {/* Logged In */}
              {user ? (

                <div className="hidden items-center gap-2 sm:flex">

                  <span className="max-w-[120px] truncate text-sm font-medium text-zinc-700">
                    👋 {displayName}
                  </span>

                  <button
                    onClick={handleLogout}
                    className="flex h-11 items-center gap-2 rounded-full border border-zinc-200 px-4 text-sm text-zinc-700 hover:border-red-200 hover:text-red-600"
                  >

                    <LogOut size={15} />

                    Logout

                  </button>

                </div>

              ) : (

                <Link
                  to="/auth"
                  className="hidden h-11 items-center gap-2 rounded-full border border-zinc-200 px-4 text-sm text-zinc-700 hover:border-red-200 hover:text-red-600 sm:flex"
                >

                  <UserRound size={17} />

                  Account

                </Link>

              )}

              {/* Mobile Menu */}
              <button className="grid h-11 w-11 place-items-center rounded-full border border-zinc-200 lg:hidden">

                <Menu size={18} />

              </button>

            </div>

          </div>

        </div>

      </motion.header>

      {/* Page Content */}
      <main className="min-h-screen pb-10 pt-32">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-2xl border border-zinc-200 bg-white/95 p-2 shadow-[0_15px_40px_rgba(24,24,27,0.14)] backdrop-blur sm:hidden">

        {[
          [Home, 'Home', '/'],
          [Grid2X2, 'Categories', '/products'],
          [ShoppingCart, 'Cart', '/cart'],
          [UserRound, 'Account', '/auth'],
        ].map(([Icon, label, href]) => (

          <NavLink
            key={label}
            to={href}
            className={({ isActive }) =>
              `flex min-w-16 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[11px] ${
                isActive
                  ? 'bg-red-50 font-semibold text-red-600'
                  : 'text-zinc-500'
              }`
            }
          >

            <Icon size={17} />

            {label}

          </NavLink>

        ))}

      </nav>

    </>
  )
}