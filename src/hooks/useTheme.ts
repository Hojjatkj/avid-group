import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'
const STORAGE_KEY = 'avid-theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    const syncTheme = (event: Event) => {
      const next = (event as CustomEvent<Theme>).detail
      if (next === 'light' || next === 'dark') setTheme(next)
    }
    window.addEventListener('avid-theme-change', syncTheme)
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
    window.localStorage.setItem(STORAGE_KEY, theme)
    window.dispatchEvent(new CustomEvent('avid-theme-change', { detail: theme }))
    return () => window.removeEventListener('avid-theme-change', syncTheme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  return { theme, toggleTheme }
}
