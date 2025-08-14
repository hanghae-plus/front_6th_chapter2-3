import { create } from 'zustand'

const LS_KEY = 'preferences'
interface PersistedPrefs {
  darkMode: boolean
}

interface PreferencesState extends PersistedPrefs {
  toggleDarkMode: () => void
}

const load = (): PersistedPrefs => {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : { darkMode: false }
  } catch {
    return { darkMode: false }
  }
}

const save = (state: PersistedPrefs) => {
  localStorage.setItem(LS_KEY, JSON.stringify(state))
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  ...load(),
  toggleDarkMode: () => {
    set((s) => {
      const next = { darkMode: !s.darkMode }
      save(next)
      return next
    })
  },
}))
