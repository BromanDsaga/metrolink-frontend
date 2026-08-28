import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const safeStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name) ?? sessionStorage.getItem(name)
    } catch {
      try { return sessionStorage.getItem(name) } catch { return null }
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value)
    } catch {
      try { sessionStorage.setItem(name, value) } catch {}
    }
  },
  removeItem: (name) => {
    try { localStorage.removeItem(name) } catch {}
    try { sessionStorage.removeItem(name) } catch {}
  },
}

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => {
        safeStorage.removeItem('token')
        set({ user: null })
      },
    }),
    {
      name: 'user',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
)
