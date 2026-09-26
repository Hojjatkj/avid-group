import { useState, type FormEvent } from 'react'
import type { UserRole } from '../components/Sidebar'
import AvidLogo from '../components/AvidLogo'

interface LoginProps {
  onLogin: (role: UserRole, name: string) => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onBack?: () => void
}

export default function Login({ onLogin, theme, onToggleTheme, onBack }: LoginProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (mode === 'register') {
      if (!name.trim() || !email.trim() || password.length < 4) {
        setError('لطفاً نام، ایمیل و رمز عبور معتبر وارد کنید.')
        return
      }
      onLogin('user', name.trim())
      return
    }

    if (email.trim().toLowerCase() === 'admin@avid.ir' && password === 'admin123') {
      onLogin('admin', 'مدیر سامانه')
      return
    }
    if (email.trim().toLowerCase() === 'user@avid.ir' && password === 'user123') {
      onLogin('user', 'کاربر پژوهشگر')
      return
    }

    setError('اطلاعات ورود صحیح نیست. لطفاً ایمیل و رمز عبور را بررسی کنید.')
  }

  return (
    <main className="login-shell" dir="rtl">
      <button
        onClick={onToggleTheme}
        aria-label="تغییر حالت نمایش"
        style={{
          position: 'absolute', top: 20, left: 20, zIndex: 2,
          width: 38, height: 38, borderRadius: 10,
          border: '1px solid var(--chrome-input-border)', background: 'var(--chrome-input-bg)',
          color: 'var(--pharma-text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: 15,
        }}
      >
        {theme === 'dark' ? '☀' : '☾'}
      </button>
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: 'absolute', top: 20, right: 20, zIndex: 2,
            display: 'flex', alignItems: 'center', gap: 6,
            border: '1px solid var(--chrome-input-border)', background: 'var(--chrome-input-bg)',
            color: 'var(--pharma-text-2)', borderRadius: 10, padding: '9px 14px',
            cursor: 'pointer', fontSize: 11, fontFamily: 'inherit',
          }}
        >
          <span>→</span> بازگشت به صفحه اصلی
        </button>
      )}
      <div className="login-visual-bg" aria-hidden="true">
        <div className="medical-grid" />
        <div className="medical-orb orb-a" />
        <div className="medical-orb orb-b" />
        <div className="medical-orb orb-c" />
        <div className="medical-glass glass-a" />
        <div className="medical-glass glass-b" />
        <div className="medical-glass glass-c" />
        <div className="medical-molecule molecule-a"><i /><i /><i /><i /><i /></div>
        <div className="medical-molecule molecule-b"><i /><i /><i /><i /></div>
        <div className="medical-molecule molecule-c"><i /><i /><i /><i /><i /><i /></div>
      </div>
      <div className="login-grid" />
      <div className="login-orb login-orb-a" />
      <div className="login-orb login-orb-b" />

      <section className="login-card">
        <div className="login-brand">
          <AvidLogo size={30} context="card" />
          <div>
            <div className="login-brand-title">Avid</div>
            <div className="login-brand-subtitle">پلتفرم هوشمندی دارویی</div>
          </div>
        </div>

        <div className="login-heading">
          <h1>{mode === 'login' ? 'خوش آمدید' : 'ایجاد حساب کاربری'}</h1>
          <p>{mode === 'login' ? 'برای ورود به سامانه اطلاعات حساب خود را وارد کنید.' : 'حساب جدید ایجاد کنید؛ حساب‌های ثبت‌نامی با سطح دسترسی فقط خواندنی ساخته می‌شوند.'}</p>
        </div>

        <div className="login-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>ورود</button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>ثبت‌نام</button>
        </div>

        <form onSubmit={submit} className="login-form">
          {mode === 'register' && (
            <label>
              <span>نام و نام خانوادگی</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً علی محمدی" />
            </label>
          )}
          <label>
            <span>ایمیل</span>
            <input dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" type="email" />
          </label>
          <label>
            <span>رمز عبور</span>
            <input dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" type="password" />
          </label>

          {error && <div className="login-error">{error}</div>}

          <button className="login-submit" type="submit">
            {mode === 'login' ? 'ورود به سامانه' : 'ایجاد حساب'}
            <span>←</span>
          </button>
        </form>

      </section>
    </main>
  )
}
