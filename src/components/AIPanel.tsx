import { useState, useRef, useEffect } from 'react'

interface Message {
  id: number
  role: 'user' | 'assistant'
  text: string
}

interface AIPanelProps {
  onClose: () => void
  context?: string
}

const quick = [
  'مکانیسم سمیت چیست؟',
  'مهم‌ترین عوامل خطر کدامند؟',
  'آنتی‌دوت این دارو چیست؟',
  'شواهد مرتبط را نمایش بده',
]

export default function AIPanel({ onClose, context = 'استامینوفن' }: AIPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'assistant', text: `سلام! در مورد **${context}** می‌توانم به شما کمک کنم. چه سوالی دارید؟` },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const end = useRef<HTMLDivElement>(null)

  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

  const send = (text?: string) => {
    const q = text || input
    if (!q.trim()) return
    setMessages((p) => [...p, { id: Date.now(), role: 'user', text: q }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((p) => [
        ...p,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: `بر اساس شواهد موجود در پایگاه داده Avid، پاسخ به سوال شما درباره ${context} به شرح زیر است. برای اطلاعات کامل‌تر به صفحه پروفایل دارو مراجعه کنید. میزان اطمینان: ۹۱٪`,
        },
      ])
    }, 1600)
  }

  return (
    <div
      className="fixed left-4 right-4 sm:right-auto bottom-4 sm:w-80 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
      style={{
        background: 'var(--pharma-bg-card)',
        border: '1px solid var(--pharma-border)',
        height: 440,
        maxHeight: 'calc(100vh - 2rem)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(var(--pharma-cyan-rgb),0.1)',
      }}
      role="dialog"
      aria-label="دستیار هوش مصنوعی"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{
          background: 'linear-gradient(135deg, var(--pharma-bg-elevated) 0%, var(--pharma-bg-active) 100%)',
          borderBottom: '1px solid var(--pharma-border)',
        }}
      >
        <button onClick={onClose} className="text-xs" style={{ color: 'var(--pharma-text-muted)' }} aria-label="بستن دستیار هوش مصنوعی">✕</button>
        <div className="flex items-center gap-2">
          <div>
            <div className="text-xs font-semibold text-right" style={{ color: 'var(--pharma-text)' }}>دستیار هوش مصنوعی</div>
            <div className="text-xs text-right" style={{ color: 'var(--pharma-text-muted)' }}>{context}</div>
          </div>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(var(--pharma-cyan-rgb),0.15)', color: 'var(--pharma-cyan)' }}
          >
            <span className="pulse-cyan">✦</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div
              className="rounded-xl px-3 py-2 text-xs leading-5 max-w-[85%] text-right"
              style={
                m.role === 'user'
                  ? { background: 'var(--pharma-bg-elevated)', color: 'var(--pharma-text)' }
                  : {
                      background: 'rgba(var(--pharma-cyan-rgb),0.08)',
                      color: 'var(--pharma-text-2)',
                      border: '1px solid rgba(var(--pharma-cyan-rgb),0.15)',
                    }
              }
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-end">
            <div className="rounded-xl px-3 py-2 flex gap-1" style={{ background: 'rgba(var(--pharma-cyan-rgb),0.08)' }}>
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--pharma-cyan)', animation: `pulse-cyan 1.2s ${i * 0.2}s ease-in-out infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={end} />
      </div>

      {/* Quick questions */}
      <div className="px-3 pb-2 flex flex-wrap gap-1">
        {quick.map((q) => (
          <button key={q} onClick={() => send(q)}
            className="text-xs px-2 py-1 rounded-full transition-colors"
            style={{ background: 'var(--pharma-bg-elevated)', color: 'var(--pharma-text-muted)', border: '1px solid var(--pharma-border)' }}>
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div
        className="flex items-center gap-2 px-3 py-2 shrink-0"
        style={{ borderTop: '1px solid var(--pharma-border)' }}
      >
        <button
          onClick={() => send()}
          disabled={!input.trim() || typing}
          aria-label="ارسال پیام"
          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all shrink-0"
          style={{
            background: input.trim() && !typing ? 'var(--pharma-cyan)' : 'var(--pharma-bg-elevated)',
            color: input.trim() && !typing ? 'var(--pharma-bg)' : 'var(--pharma-text-muted)',
          }}
        >
          ↑
        </button>
        <input
          type="text" value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="سوال بپرسید..."
          aria-label="پیام خود را بنویسید"
          className="flex-1 text-xs rounded-lg px-3 py-1.5 outline-none"
          style={{ background: 'var(--pharma-bg-elevated)', border: '1px solid var(--pharma-border)', color: 'var(--pharma-text)' }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--pharma-cyan)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--pharma-border)')}
        />
      </div>
    </div>
  )
}
