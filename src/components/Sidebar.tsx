import { useState, type ReactNode } from 'react'
import AvidLogo from './AvidLogo'

type Page =
  | 'dashboard'
  | 'drug-explorer' | 'drug-profiles' | 'drug-comparison'
  | 'efficacy' | 'toxicity' | 'ai-assessment' | 'model-results'
  | 'clinical-trials' | 'publications'
  | 'regulatory-intel' | 'approvals' | 'alerts'
  | 'knowledge-graph'
  | 'data-sources' | 'ai-models' | 'users' | 'audit-logs'
  | 'ai-assistant'

export type UserRole = 'admin' | 'user'

interface SidebarProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  role: UserRole
  userName: string
  onLogin: () => void
  onLogout: () => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  mobileOpen?: boolean
  onCloseMobile?: () => void
  collapsed?: boolean
}

interface NavItem { id: Page; label: string; icon: string }
interface NavSection { id: string; label: string; items: NavItem[] }

const sections: NavSection[] = [
  {
    id: 'drug-intel',
    label: 'هوشمندی دارویی',
    items: [
      { id: 'drug-explorer', label: 'کاوشگر دارو', icon: 'search' },
      { id: 'drug-profiles', label: 'پروفایل داروها', icon: 'file' },
      { id: 'drug-comparison', label: 'مقایسه داروها', icon: 'compare' },
    ],
  },
  {
    id: 'ai-analysis',
    label: 'تحلیل هوش مصنوعی',
    items: [
      { id: 'efficacy', label: 'اثربخشی', icon: 'trend' },
      { id: 'toxicity', label: 'سمیت', icon: 'warning' },
      { id: 'ai-assessment', label: 'ارزیابی هوش مصنوعی', icon: 'check' },
      { id: 'model-results', label: 'نتایج مدل‌ها', icon: 'nodes' },
    ],
  },
  {
    id: 'clinical',
    label: 'شواهد بالینی',
    items: [
      { id: 'clinical-trials', label: 'کارآزمایی‌های بالینی', icon: 'flask' },
      { id: 'publications', label: 'مقالات و انتشارات', icon: 'file' },
    ],
  },
  {
    id: 'regulatory',
    label: 'رگولاتوری',
    items: [
      { id: 'regulatory-intel', label: 'هوشمندی رگولاتوری', icon: 'clock' },
      { id: 'approvals', label: 'مجوزها و تأییدیه‌ها', icon: 'check-circle' },
      { id: 'alerts', label: 'هشدارها', icon: 'warning' },
    ],
  },
]

const adminSection: NavSection = {
  id: 'admin',
  label: 'مدیریت سامانه',
  items: [
    { id: 'data-sources', label: 'منابع داده', icon: 'database' },
    { id: 'ai-models', label: 'مدل‌های هوش مصنوعی', icon: 'model' },
    { id: 'users', label: 'کاربران', icon: 'user' },
    { id: 'audit-logs', label: 'گزارش رویدادها', icon: 'list' },
  ],
}

function Icon({ name, size = 15 }: { name: string; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const paths: Record<string, ReactNode> = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    file: <><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></>,
    compare: <><path d="M8 5v14M16 5v14M5 9h6M13 15h6"/></>,
    trend: <><path d="M4 17V7M4 17h16"/><path d="m7 14 4-5 3 3 5-7"/></>,
    warning: <><path d="m12 3 9 17H3L12 3Z"/><path d="M12 9v4M12 17h.01"/></>,
    check: <><rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8 12 2.5 2.5L16 9"/></>,
    nodes: <><circle cx="12" cy="12" r="3"/><circle cx="5" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="m9.8 9.8-3.4-3.4M14.2 9.8l3.4-3.4M14.2 14.2l3.4 3.4"/></>,
    flask: <><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3"/><path d="M8 15h8"/></>,
    clock: <><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></>,
    'check-circle': <><circle cx="12" cy="12" r="8"/><path d="m8.5 12 2.3 2.3 4.7-5"/></>,
    database: <><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7"/></>,
    model: <><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="9" y="14" width="6" height="6" rx="1"/><path d="M10 7h4M7 10v4M17 10v4M12 14v-4"/></>,
    user: <><circle cx="12" cy="8" r="3"/><path d="M5 20c.8-3.3 3.1-5 7-5s6.2 1.7 7 5"/></>,
    list: <><path d="M8 6h12M8 12h12M8 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/></>,
    dashboard: <><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/></>,
    graph: <><circle cx="6" cy="12" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="m8 11 8-4M8 13l8 4"/></>,
    login: <><path d="M10 17l5-5-5-5M15 12H4"/><path d="M20 4v16"/></>,
    logout: <><path d="M14 17l5-5-5-5M19 12H8"/><path d="M4 4v16"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
    moon: <><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/></>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

export default function Sidebar({ currentPage, onNavigate, role, userName, onLogin, onLogout, theme, onToggleTheme, mobileOpen = false, onCloseMobile, collapsed = false }: SidebarProps) {
  const isInSection = (s: NavSection) => s.items.some((i) => i.id === currentPage)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries([...sections, adminSection].map((s) => [s.id, true]))
  )

  const toggle = (id: string) => setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }))

  // On mobile the sidebar is a drawer: picking a page should close it,
  // otherwise it stays open covering the newly-navigated content.
  const navigateAndClose = (page: Page) => {
    onNavigate(page)
    onCloseMobile?.()
  }

  return (
    <>
      <div
        className={`sidebar-backdrop ${mobileOpen ? 'open' : ''}`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />
      <aside className={`claude-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`} aria-label="ناوبری اصلی">
        <div className="claude-sidebar-inner">
          <div className="sidebar-brand">
            <a href="/" aria-label="Avid — صفحه اصلی"><AvidLogo size={30} context="chrome" /></a>
            <div>
              <div className="sidebar-brand-title">Avid</div>
              <div className="sidebar-brand-subtitle">هوشمندی دارویی</div>
            </div>
            <button className="sidebar-close-button" onClick={onCloseMobile} aria-label="بستن منو">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>

          <nav className="claude-nav">
            <button className={`claude-nav-item ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => navigateAndClose('dashboard')}>
              <Icon name="dashboard" />
              <span>داشبورد</span>
            </button>

            {sections.map((section) => {
              const active = isInSection(section)
              const open = openSections[section.id]
              return (
                <section key={section.id} className="claude-nav-section">
                  <button className={`claude-section-label ${active ? 'section-active' : ''}`} onClick={() => toggle(section.id)} aria-expanded={open}>
                    <span>{section.label}</span>
                  </button>
                  {open && (
                    <div className="claude-section-items">
                      {section.items.map((item) => (
                        <button key={item.id} className={`claude-nav-item ${currentPage === item.id ? 'active' : ''}`} onClick={() => navigateAndClose(item.id)}>
                          <Icon name={item.icon} />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              )
            })}

            <button className={`claude-nav-item standalone ${currentPage === 'knowledge-graph' ? 'active' : ''}`} onClick={() => navigateAndClose('knowledge-graph')}>
              <Icon name="graph" />
              <span>گراف دانش</span>
            </button>

            {role === 'admin' && (() => {
              const section = adminSection
              const active = isInSection(section)
              const open = openSections[section.id]
              return (
                <section className="claude-nav-section">
                  <button className={`claude-section-label ${active ? 'section-active' : ''}`} onClick={() => toggle(section.id)} aria-expanded={open}>
                    <span>{section.label}</span>
                  </button>
                  {open && (
                    <div className="claude-section-items">
                      {section.items.map((item) => (
                        <button key={item.id} className={`claude-nav-item ${currentPage === item.id ? 'active' : ''}`} onClick={() => navigateAndClose(item.id)}>
                          <Icon name={item.icon} />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              )
            })()}
          </nav>

          <div className="sidebar-auth">
            <button className="theme-toggle" onClick={onToggleTheme} aria-label="تغییر حالت نمایش">
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={13} />
              <span>{theme === 'dark' ? 'حالت روشن' : 'حالت تیره'}</span>
            </button>
            {role ? (
              <div className="sidebar-user-card">
                <div className="sidebar-user-avatar">{userName.slice(0, 1)}</div>
                <div className="sidebar-user-meta">
                  <div>{userName}</div>
                  <span>{role === 'admin' ? 'مدیر سامانه · دسترسی کامل' : 'کاربر · فقط خواندنی'}</span>
                </div>
                <button onClick={onLogout} title="خروج" aria-label="خروج از حساب" className="sidebar-icon-button"><Icon name="logout" size={14} /></button>
              </div>
            ) : (
              <button className="sidebar-auth-button" onClick={onLogin}>
                <Icon name="login" />
                <span>ورود / ثبت‌نام</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
