import { useEffect, useState } from 'react'

export type BlogRoute =
  | { type: 'archive' }
  | { type: 'post'; slug: string }
  | { type: 'legal'; page: 'privacy' | 'terms' }
  | { type: 'about' }
  | null

function resolve(pathname: string): BlogRoute {
  if (pathname === '/blog' || pathname === '/blog/') return { type: 'archive' }
  const match = pathname.match(/^\/blog\/([^/]+)\/?$/)
  if (match) return { type: 'post', slug: decodeURIComponent(match[1]) }
  if (pathname === '/about' || pathname === '/about/') return { type: 'about' }
  if (pathname === '/privacy' || pathname === '/privacy/') return { type: 'legal', page: 'privacy' }
  if (pathname === '/terms' || pathname === '/terms/') return { type: 'legal', page: 'terms' }
  return null
}

/**
 * Tracks public shareable routes such as /blog, /blog/:slug and /about.
 * The rest of the app (dashboard, login) keeps its existing useState-based
 * navigation — this only covers the blog, since those pages need real,
 * shareable/indexable URLs and the project has no router library installed
 * (and this environment can't run `npm install` to add one).
 *
 * Note for deployment: this relies on the host rewriting unknown paths to
 * index.html (Vite's dev server does this by default). A static host will
 * need an equivalent SPA fallback rule for /blog/* to work on direct load.
 */
export function useBlogRoute(): [BlogRoute, (path: string) => void] {
  const [route, setRoute] = useState<BlogRoute>(() =>
    typeof window !== 'undefined' ? resolve(window.location.pathname) : null
  )

  useEffect(() => {
    const onPopState = () => setRoute(resolve(window.location.pathname))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setRoute(resolve(path))
    window.scrollTo(0, 0)
  }

  // Keep public route links client-side so navigation is instant and scroll
  // position is reset consistently.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const anchor = (e.target as HTMLElement)?.closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || !['/blog', '/about'].some((path) => href === path || href.startsWith(`${path}/`))) return
      if (anchor.target === '_blank') return
      e.preventDefault()
      navigate(href)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [route, navigate]
}
