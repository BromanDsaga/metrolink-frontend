import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'

export default function AuthPage() {
  const [mode, setMode] = useState('login')

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/'

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

  const resetMessages = () => {
    setError('')
  }

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setError('')
  }

  const validateForm = () => {
    if (!form.email.trim() || !form.password.trim()) {
      return 'Please enter your email and password.'
    }

    if (mode === 'register') {
      if (!form.fullName.trim()) {
        return 'Please enter your full name.'
      }

      if (!form.phone.trim()) {
        return 'Please enter your phone number.'
      }

      if (form.password.length < 6) {
        return 'Password must be at least 6 characters.'
      }

      if (form.password !== form.confirmPassword) {
        return 'Passwords do not match.'
      }
    }

    return ''
  }

  const handleSubmit = async () => {
    setError('')

    const validationError = validateForm()

    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register'

      const payload =
        mode === 'login'
          ? {
              email: form.email.trim(),
              password: form.password,
            }
          : {
              fullName: form.fullName.trim(),
              email: form.email.trim(),
              phone: form.phone.trim(),
              password: form.password,
            }

      const { data } = await api.post(endpoint, payload)

      localStorage.setItem('token', data.token)
      useAuthStore.getState().setUser({
        email: data.email,
        role: data.role,
        fullName: data.fullName || form.fullName,
        phone: data.phone || form.phone,
      })

      navigate(redirectTo)
    } catch (err) {
      const status = err?.response?.status

      if (mode === 'register' && (status === 400 || status === 409)) {
        setError('An account with this email already exists. Please login instead.')
      } else if (mode === 'login' && (status === 401 || status === 400)) {
        setError('Incorrect email or password. Please try again.')
      } else {
        setError('Something went wrong. Please try again later.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="container-shell flex min-h-[65vh] items-center justify-center">
        <div className="surface grid w-full max-w-4xl overflow-hidden md:grid-cols-2">
          <div className="bg-gradient-to-br from-red-700 to-red-900 p-8 text-white">
            <p className="text-sm text-red-100">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </p>

            <h1 className="mt-3 text-3xl font-black">
              Shop faster with Metrolink
            </h1>

            <p className="mt-4 text-sm leading-6 text-red-100">
              Track orders, save favorites, and restock household essentials without friction.
            </p>
          </div>

          <div className="p-8">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  mode === 'login'
                    ? 'bg-red-600 text-white'
                    : 'bg-zinc-100 text-gray-700 hover:bg-zinc-200'
                }`}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  mode === 'register'
                    ? 'bg-red-600 text-white'
                    : 'bg-zinc-100 text-gray-700 hover:bg-zinc-200'
                }`}
              >
                Register
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="mt-6 space-y-4">
              {mode === 'register' && (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">
                    Full Name
                  </span>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={handleChange('fullName')}
                    onFocus={resetMessages}
                    placeholder="Abdulbasit Abdulmajeed"
                    className="h-12 w-full rounded-2xl border border-zinc-200 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-medium">
                  Email
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  onFocus={resetMessages}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-2xl border border-zinc-200 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </label>

              {mode === 'register' && (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">
                    Phone Number
                  </span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={handleChange('phone')}
                    onFocus={resetMessages}
                    placeholder="08123456789"
                    className="h-12 w-full rounded-2xl border border-zinc-200 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-medium">
                  Password
                </span>
                <input
                  type="password"
                  value={form.password}
                  onChange={handleChange('password')}
                  onFocus={resetMessages}
                  placeholder="••••••••"
                  className="h-12 w-full rounded-2xl border border-zinc-200 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </label>

              {mode === 'register' && (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">
                    Confirm Password
                  </span>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    onFocus={resetMessages}
                    placeholder="••••••••"
                    className="h-12 w-full rounded-2xl border border-zinc-200 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </label>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="mt-6 w-full rounded-full bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {loading
                ? mode === 'login'
                  ? 'Logging in...'
                  : 'Creating account...'
                : mode === 'login'
                ? 'Continue'
                : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}