import { create } from 'zustand'

export const safeStorage = {
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value)
    } catch {
      try {
        sessionStorage.setItem(key, value)
      } catch {
        // both storages unavailable (e.g. Safari private mode) — nothing more we can do
      }
    }
  },
  getItem: (key) => {
    try {
      return localStorage.getItem(key) || sessionStorage.getItem(key)
    } catch {
      try {
        return sessionStorage.getItem(key)
      } catch {
        return null
      }
    }
  },
  removeItem: (key) => {
    try { localStorage.removeItem(key) } catch {}
    try { sessionStorage.removeItem(key) } catch {}
  },
}

const readStoredUser = () => {
  try {
    const stored = safeStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export const useAuthStore = create((set) => ({
  user: readStoredUser(),
  setUser: (user) => {
    safeStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },
  logout: () => {
    safeStorage.removeItem('token')
    safeStorage.removeItem('user')
    set({ user: null })
  },
}))
