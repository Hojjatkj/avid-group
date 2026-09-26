import { lazy, Suspense, useEffect, useState } from 'react'
import { useTheme } from './hooks/useTheme'
import Sidebar, { type UserRole } from './components/Sidebar'
import TopBar from './components/TopBar'
import AIPanel from './components/AIPanel'
import Login from './pages/Login'
import Landing from './landing/Landing'
import BlogArchive from './landing/pages/BlogArchive'
import BlogPost from './landing/pages/BlogPost'
import AboutPage from './landing/pages/AboutPage'
import { useBlogRoute } from './lib/useBlogRoute'

// Dashboard pages are only ever needed after a successful login, so they're
// code-split out of the landing/login bundle with React.lazy. A visitor who
// only ever sees the marketing landing page never downloads, parses or
// executes any of this (recharts, framer-motion heavy pages, etc.) — it's
// fetched on demand once they actually navigate into the dashboard.
const Dashboard = lazy(() => import('./pages/Dashboard'))
const DrugExplorer = lazy(() => import('./pages/DrugExplorer'))
const DrugProfile = lazy(() => import('./pages/DrugProfile'))
const DrugComparison = lazy(() => import('./pages/DrugComparison'))
const Toxicity = lazy(() => import('./pages/Toxicity'))
const AIAssessment = lazy(() => import('./pages/AIAssessment'))
const AIAssistant = lazy(() => import('./pages/AIAssistant'))
const KnowledgeGraph = lazy(() => import('./pages/KnowledgeGraph'))
const ClinicalTrials = lazy(() => import('./pages/ClinicalTrials'))
const Publications = lazy(() => import('./pages/Publications'))
const Regulatory = lazy(() => import('./pages/Regulatory'))
const Efficacy = lazy(() => import('./pages/Efficacy'))
const ModelResults = lazy(() => import('./pages/ModelResults'))
const AdminPage = lazy(() => import('./pages/AdminPage'))

type Page =
  | 'dashboard'
  | 'drug-explorer' | 'drug-profiles' | 'drug-comparison'
  | 'efficacy' | 'toxicity' | 'ai-assessment' | 'model-results'
  | 'clinical-trials' | 'publications'
  | 'regulatory-intel' | 'approvals' | 'alerts'
  | 'knowledge-graph'
  | 'data-sources' | 'ai-models' | 'users' | 'audit-logs'
  | 'ai-assistant'

const SESSION_KEY = 'avid-session'

type StoredSession = {
  role: UserRole
  userName: string
  page: Page
  drugId: number
}

function loadSession(): StoredSession | null {
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || (parsed.role !== 'admin' && parsed.role !== 'user')) return null
    return {
      role: parsed.role,
      userName: typeof parsed.userName === 'string' ? parsed.userName : '',
      page: typeof parsed.page === 'string' ? (parsed.page as Page) : 'dashboard',
      drugId: typeof parsed.drugId === 'number' ? parsed.drugId : 1,
    }
  } catch {
    return null
  }
}

function PageFallback() {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[240px]">
      <div className="avid-spinner" role="status" aria-label="در حال بارگذاری" />
    </div>
  )
}

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const initialSession = loadSession()
  const [page, setPage] = useState<Page>(initialSession?.page ?? 'dashboard')
  const [drugId, setDrugId] = useState<number>(initialSession?.drugId ?? 1)
  const [aiPanelOpen, setAIPanelOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [aiHintVisible, setAiHintVisible] = useState(true)
  const [role, setRole] = useState<UserRole | null>(initialSession?.role ?? null)
  const [userName, setUserName] = useState(initialSession?.userName ?? '')
  // If we restored a logged-in session, skip the landing/login screens entirely.
  const [entryScreen, setEntryScreen] = useState<'landing' | 'login'>('landing')
  const [blogRoute, navigateBlog] = useBlogRoute()

  // Keep the dashboard session (role/user/page/drug) in sessionStorage so a
  // hard refresh while inside the dashboard reopens the same page instead of
  // dropping back to the marketing landing screen. sessionStorage (not
  // localStorage) means it naturally clears when the tab/browser is closed,
  // matching normal "still logged in" refresh behavior without persisting
  // the session forever.
  useEffect(() => {
    if (!role) {
      window.sessionStorage.removeItem(SESSION_KEY)
      return
    }
    const session: StoredSession = { role, userName, page, drugId }
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }, [role, userName, page, drugId])

  useEffect(() => {
    const publicLightPage = !role && (entryScreen === 'landing' || blogRoute?.type === 'archive' || blogRoute?.type === 'post' || blogRoute?.type === 'about')
    if (!publicLightPage) return
    document.documentElement.removeAttribute('data-theme')
    window.localStorage.setItem('avid-theme', 'light')
  }, [role, entryScreen, blogRoute])

  const login = (nextRole: UserRole, name: string) => {
    setRole(nextRole)
    setUserName(name)
    setPage('dashboard')
    setAIPanelOpen(false)
  }

  const logout = () => {
    setRole(null)
    setUserName('')
    setAIPanelOpen(false)
    setPage('dashboard')
    setEntryScreen('landing')
  }

  const navigate = (p: string, id?: number) => {
    const next = p as Page
    const adminPages: Page[] = ['data-sources', 'ai-models', 'users', 'audit-logs']
    if (role !== 'admin' && adminPages.includes(next)) {
      setPage('dashboard')
      return
    }
    setPage(next)
    if (id !== undefined) setDrugId(id)
  }

  // Blog routes are public and independent of login state / the internal
  // page state machine below — they need real, shareable URLs.
  const goToLoginFromBlog = () => {
    navigateBlog('/')
    setEntryScreen('login')
  }

  if (blogRoute?.type === 'about') {
    return <AboutPage onLoginClick={goToLoginFromBlog} onHomeClick={() => navigateBlog('/')} />
  }
  if (blogRoute?.type === 'archive') {
    return <BlogArchive onLoginClick={goToLoginFromBlog} onAboutClick={() => navigateBlog('/about')} />
  }
  if (blogRoute?.type === 'post') {
    return <BlogPost slug={blogRoute.slug} onLoginClick={goToLoginFromBlog} onAboutClick={() => navigateBlog('/about')} />
  }

  if (!role) {
    if (entryScreen === 'landing') {
      return <Landing onLoginClick={() => setEntryScreen('login')} onAboutClick={() => navigateBlog('/about')} />
    }
    return (
      <Login
        onLogin={login}
        theme={theme}
        onToggleTheme={toggleTheme}
        onBack={() => setEntryScreen('landing')}
      />
    )
  }

  const renderPage = () => {
    if (page === 'ai-assistant') return <Suspense fallback={<PageFallback />}><AIAssistant /></Suspense>
    if (page === 'knowledge-graph') return <Suspense fallback={<PageFallback />}><KnowledgeGraph /></Suspense>

    const content = (() => {
      switch (page) {
        case 'dashboard': return <Dashboard onNavigate={navigate} />
        case 'drug-explorer': return <DrugExplorer onNavigate={navigate} />
        case 'drug-profiles': return <DrugProfile drugId={drugId} onNavigate={navigate} onAIPanel={() => setAIPanelOpen(true)} />
        case 'drug-comparison': return <DrugComparison />
        case 'toxicity': return <Toxicity />
        case 'ai-assessment': return <AIAssessment />
        case 'efficacy': return <Efficacy />
        case 'model-results': return <ModelResults />
        case 'clinical-trials': return <ClinicalTrials />
        case 'publications': return <Publications />
        case 'regulatory-intel': return <Regulatory subPage="intel" />
        case 'approvals': return <Regulatory subPage="approvals" />
        case 'alerts': return <Regulatory subPage="alerts" />
        case 'data-sources': return <AdminPage subPage="data-sources" />
        case 'ai-models': return <AdminPage subPage="ai-models" />
        case 'users': return <AdminPage subPage="users" />
        case 'audit-logs': return <AdminPage subPage="audit-logs" />
        default: return <Dashboard onNavigate={navigate} />
      }
    })()
    return <div className="overflow-y-auto flex-1"><Suspense fallback={<PageFallback />}>{content}</Suspense></div>
  }

  const isFullBleed = page === 'ai-assistant' || page === 'knowledge-graph'

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--pharma-bg)', direction: 'rtl' }}>
      <Sidebar
        currentPage={page}
        onNavigate={navigate}
        role={role}
        userName={userName}
        onLogin={() => setRole('user')}
        onLogout={logout}
        theme={theme}
        onToggleTheme={toggleTheme}
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar pageTitle={page} onNavigate={navigate} onMenuClick={() => {
          if (window.matchMedia('(max-width: 820px)').matches) {
            setSidebarOpen(true)
          } else {
            setSidebarCollapsed((v) => !v)
          }
        }} />
        <div className={isFullBleed ? 'flex-1 overflow-hidden no-scrollbar' : 'flex-1 overflow-y-auto bg-grid-subtle no-scrollbar'} style={{ background: 'var(--pharma-bg)' }}>
          {renderPage()}
        </div>
      </div>

      {!aiPanelOpen && (
        <>
          {aiHintVisible && (
            <div className="ai-help-bubble" role="status">
              <button
                type="button"
                className="ai-help-bubble-close"
                onClick={() => setAiHintVisible(false)}
                aria-label="بستن پیام دستیار"
              >
                ×
              </button>
              <button type="button" className="ai-help-bubble-text" onClick={() => setAIPanelOpen(true)}>
                چطور میتونم کمکتون کنم؟
              </button>
            </div>
          )}
          <button className="floating-ai-trigger" onClick={() => setAIPanelOpen(true)} aria-label="باز کردن دستیار هوش مصنوعی">
            <span>✦</span>
          </button>
        </>
      )}

      {aiPanelOpen && (
        <AIPanel onClose={() => setAIPanelOpen(false)} context={page === 'drug-profiles' ? undefined : 'استامینوفن'} />
      )}
    </div>
  )
}
