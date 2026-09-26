import { useState } from 'react'

type Page = string

interface TopBarProps {
  pageTitle: string
  pageSubtitle?: string
  onNavigate: (page: Page) => void
  onMenuClick?: () => void
}

const pageTitles: Record<string, { title: string; sub: string }> = {
  dashboard: { title: 'مرکز هوشمندی دارویی', sub: 'نمای کلی سیستم' },
  'drug-explorer': { title: 'کاوشگر دارو', sub: 'جستجو و کاوش در پایگاه داروها' },
  'drug-profiles': { title: 'پروفایل داروها', sub: 'اطلاعات جامع دارویی' },
  'drug-comparison': { title: 'مقایسه داروها', sub: 'تحلیل مقایسه‌ای داروها' },
  efficacy: { title: 'تحلیل اثربخشی', sub: 'ارزیابی هوش مصنوعی از اثربخشی' },
  toxicity: { title: 'تحلیل سمیت', sub: 'پروفایل سمیت و ارزیابی خطر' },
  'ai-assessment': { title: 'ارزیابی هوش مصنوعی', sub: 'تحلیل ساختاریافته مدل‌های AI' },
  'model-results': { title: 'نتایج مدل‌ها', sub: 'مقایسه و تحلیل خروجی مدل‌های AI' },
  'clinical-trials': { title: 'کارآزمایی‌های بالینی', sub: 'پایگاه داده کارآزمایی‌های بالینی' },
  publications: { title: 'مقالات و انتشارات', sub: 'شواهد علمی و منابع پژوهشی' },
  'regulatory-intel': { title: 'هوشمندی رگولاتوری', sub: 'تحلیل وضعیت رگولاتوری' },
  approvals: { title: 'مجوزها و تأییدیه‌ها', sub: 'وضعیت تأییدیه FDA، EMA و سایر مراجع' },
  alerts: { title: 'هشدارهای رگولاتوری', sub: 'هشدارها و اطلاعیه‌های مراجع بین‌المللی' },
  'knowledge-graph': { title: 'گراف دانش', sub: 'شبکه روابط دارویی' },
  'data-sources': { title: 'منابع داده', sub: 'مدیریت منابع و اتصالات داده' },
  'ai-models': { title: 'مدل‌های هوش مصنوعی', sub: 'مدیریت و پیکربندی مدل‌های AI' },
  users: { title: 'کاربران', sub: 'مدیریت کاربران و دسترسی‌ها' },
  'audit-logs': { title: 'گزارش رویدادها', sub: 'تاریخچه فعالیت‌های سیستم' },
  'ai-assistant': { title: 'دستیار هوش مصنوعی', sub: 'فضای کاری پژوهش دارویی' },
}

export default function TopBar({ pageTitle, onMenuClick }: TopBarProps) {
  const [notifOpen, setNotifOpen] = useState(false)
  const info = pageTitles[pageTitle] || { title: pageTitle, sub: '' }

  return (
    <header
      className="h-14 flex items-center justify-between px-6 shrink-0"
      style={{
        background: 'var(--chrome-bg)',
        borderBottom: '1px solid var(--chrome-border)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Left: user actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="topbar-menu-button flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ color: 'var(--chrome-text-2)' }}
          aria-label="باز و بسته کردن منوی ناوبری"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
            style={{ color: 'var(--chrome-text-2)' }}
            title="اعلان‌ها"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a5.5 5.5 0 0 0-5.5 5.5v2L1 10v1h14v-1l-1.5-1.5v-2A5.5 5.5 0 0 0 8 1ZM6.5 13a1.5 1.5 0 0 0 3 0h-3Z" />
            </svg>
            <span
              className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--pharma-danger)' }}
            />
          </button>
          {notifOpen && (
            <div
              className="absolute right-0 top-10 w-72 rounded-xl shadow-2xl overflow-hidden z-50"
              style={{ background: 'var(--pharma-bg-elevated)', border: '1px solid var(--pharma-border)' }}
            >
              <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--pharma-border)' }}>
                <div className="text-sm font-semibold" style={{ color: 'var(--pharma-text)' }}>اعلان‌ها</div>
              </div>
              {[
                { t: 'هشدار جدید FDA برای متوتروکسات', s: '۱۵ دقیقه پیش', c: 'var(--pharma-danger)' },
                { t: 'بروزرسانی داده EMA', s: '۲ ساعت پیش', c: 'var(--pharma-cyan-light)' },
                { t: 'کارآزمایی جدید ثبت شد', s: 'دیروز', c: 'var(--pharma-success)' },
              ].map((n, i) => (
                <div
                  key={i}
                  className="px-4 py-3 text-sm border-b cursor-pointer"
                  style={{ borderColor: 'var(--pharma-border)', color: 'var(--pharma-text-2)' }}
                >
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: n.c }} />
                    <div>
                      <div style={{ color: 'var(--pharma-text)' }}>{n.t}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--pharma-text-muted)' }}>{n.s}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: page title */}
      <div className="text-center">
        <div className="text-sm font-semibold" style={{ color: 'var(--chrome-text)' }}>
          {info.title}
        </div>
        {info.sub && (
          <div className="text-xs" style={{ color: 'var(--chrome-text-muted)' }}>
            {info.sub}
          </div>
        )}
      </div>

      {/* Right: search */}
      <div className="topbar-search flex items-center gap-3" style={{ minWidth: 300 }}>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="جستجو در داروها، ترکیبات، شواهد و مطالعات..."
            className="w-full text-xs pr-8 pl-4 py-2 rounded-lg outline-none transition-colors"
            style={{
              background: 'var(--pharma-bg-elevated)',
              border: '1px solid var(--pharma-border)',
              color: 'var(--pharma-text)',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--pharma-cyan)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--pharma-border)')}
          />
          <svg
            className="absolute right-2.5 top-1/2 -translate-y-1/2"
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            stroke="var(--pharma-text-muted)"
            strokeWidth="2"
          >
            <circle cx="6.5" cy="6.5" r="5" />
            <line x1="10.5" y1="10.5" x2="15" y2="15" />
          </svg>
        </div>
      </div>
    </header>
  )
}
