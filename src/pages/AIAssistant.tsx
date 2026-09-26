import { useState, useRef, useEffect } from 'react'

interface Message {
  id: number
  role: 'user' | 'assistant'
  text: string
  time: string
  sources?: { title: string; source: string; relevance: number }[]
  confidence?: number
}

const conversations = [
  { id: 1, title: 'سمیت استامینوفن در دوزهای بالا', drug: 'استامینوفن', time: '۱۰ دق' },
  { id: 2, title: 'تداخل وارفارین با آنتی‌بیوتیک‌ها', drug: 'وارفارین', time: 'دیروز' },
  { id: 3, title: 'مقایسه اثربخشی مورفین و ترامادول', drug: 'مورفین', time: '۲ روز' },
  { id: 4, title: 'پروتکل مانیتورینگ دیگوکسین', drug: 'دیگوکسین', time: '۵ روز' },
]

const quickQuestions = [
  'مکانیسم سمیت این دارو چیست؟',
  'مهم‌ترین عوامل خطر کدامند؟',
  'شواهد مرتبط را نمایش بده',
  'این دارو را با داروی مشابه مقایسه کن',
  'آنتی‌دوت در مسمومیت چیست؟',
]

const mockResponses = [
  {
    text: `بر اساس شواهد موجود در {drug.evidenceCount} مقاله و کارآزمایی‌های بالینی ثبت‌شده، مکانیسم اصلی سمیت این دارو از طریق متابولیت‌های فعال اتفاق می‌افتد.

در دوزهای بالا، مسیر اصلی متابولیسم کبدی اشباع می‌شود و متابولیت‌های سمی تولید می‌شوند. این فرآیند می‌تواند منجر به آسیب مستقیم سلولی در اندام‌های هدف گردد.

مدل Avid-LLM v3 با اطمینان ۹۴٪ این تحلیل را تأیید می‌کند.`,
    sources: [
      { title: 'Mechanisms of Drug-Induced Hepatotoxicity', source: 'PubMed PMID: 32145678', relevance: 96 },
      { title: 'Clinical Pharmacokinetics Review', source: 'Cochrane Library', relevance: 91 },
      { title: 'Toxicology Case Studies 2024', source: 'Clinical Toxicology Journal', relevance: 88 },
    ],
    confidence: 94,
  },
]

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      text: 'سلام! من دستیار هوش مصنوعی Avid هستم. می‌توانم در تحلیل داروها، بررسی سمیت، اثربخشی، تداخلات دارویی و شواهد علمی به شما کمک کنم. چه سوالی دارید؟',
      time: 'اکنون',
      confidence: 100,
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [activeDrug, setActiveDrug] = useState('استامینوفن')
  const [activeConv, setActiveConv] = useState(1)
  const messagesEnd = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = (text?: string) => {
    const q = text || input
    if (!q.trim()) return
    const userMsg: Message = { id: Date.now(), role: 'user', text: q, time: 'اکنون' }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const resp = mockResponses[0]
      const assistantMsg: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        text: resp.text.replace('{drug.evidenceCount}', '۲,۸۴۷'),
        time: 'اکنون',
        sources: resp.sources,
        confidence: resp.confidence,
      }
      setMessages((prev) => [...prev, assistantMsg])
    }, 1800)
  }

  return (
    <div className="flex h-[calc(100vh-56px)] animate-fade-in">
      {/* Conversation History - Left panel in RTL */}
      <div
        className="w-56 flex flex-col shrink-0"
        style={{ background: 'var(--pharma-bg-card)', borderLeft: '1px solid var(--pharma-border)' }}
      >
        <div
          className="px-4 py-3 text-xs font-semibold"
          style={{ borderBottom: '1px solid var(--pharma-border)', color: 'var(--pharma-text-muted)' }}
        >
          تاریخچه گفتگوها
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveConv(c.id)}
              className="w-full px-3 py-2.5 text-right text-xs hover:bg-[var(--pharma-bg-hover)] transition-colors"
              style={{ borderRight: activeConv === c.id ? '2px solid var(--pharma-cyan)' : '2px solid transparent' }}
            >
              <div className="font-medium truncate" style={{ color: activeConv === c.id ? 'var(--pharma-cyan)' : 'var(--pharma-text)' }}>
                {c.title}
              </div>
              <div className="flex justify-between mt-0.5" style={{ color: 'var(--pharma-text-muted)' }}>
                <span>{c.time}</span>
                <span className="font-mono text-xs">{c.drug}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="p-3" style={{ borderTop: '1px solid var(--pharma-border)' }}>
          <button
            className="w-full py-2 rounded-lg text-xs transition-all"
            style={{ background: 'rgba(var(--pharma-cyan-rgb),0.1)', color: 'var(--pharma-cyan)', border: '1px solid rgba(var(--pharma-cyan-rgb),0.3)' }}
            onClick={() => setMessages([{
              id: Date.now(), role: 'assistant',
              text: 'گفتگوی جدید شروع شد. چه سوالی دارید؟', time: 'اکنون', confidence: 100,
            }])}
          >
            + گفتگوی جدید
          </button>
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Context bar */}
        <div
          className="flex items-center justify-between px-5 py-2 text-xs shrink-0"
          style={{ background: 'var(--pharma-bg-elevated)', borderBottom: '1px solid var(--pharma-border)' }}
        >
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--pharma-text-muted)' }}>مدل:</span>
            <span style={{ color: 'var(--pharma-cyan)' }}>Avid-LLM v3</span>
            <span className="w-1.5 h-1.5 rounded-full pulse-cyan" style={{ background: 'var(--pharma-cyan)' }} />
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--pharma-text-muted)' }}>دارو:</span>
            <select
              value={activeDrug}
              onChange={(e) => setActiveDrug(e.target.value)}
              className="text-xs bg-transparent outline-none"
              style={{ color: 'var(--pharma-text)' }}
            >
              {['استامینوفن', 'دیگوکسین', 'وارفارین', 'مورفین', 'متوتروکسات', 'لیتیم', 'آتروپین'].map((d) => (
                <option key={d} value={d} style={{ background: 'var(--pharma-bg-card)' }}>{d}</option>
              ))}
            </select>
            <span style={{ color: 'var(--pharma-text-muted)' }}>زمینه:</span>
            <span style={{ color: 'var(--pharma-text-2)' }}>دستیار پژوهش دارویی</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
              <div style={{ maxWidth: '75%' }}>
                {m.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-1 justify-end">
                    <span className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>{m.time}</span>
                    <span className="text-xs font-medium" style={{ color: 'var(--pharma-cyan)' }}>Avid AI</span>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: 'rgba(var(--pharma-cyan-rgb),0.15)', color: 'var(--pharma-cyan)' }}>✦</span>
                  </div>
                )}
                <div
                  className="rounded-2xl px-4 py-3 text-sm leading-7 text-right"
                  style={
                    m.role === 'user'
                      ? { background: 'var(--pharma-bg-elevated)', color: 'var(--pharma-text)', borderRadius: '18px 4px 18px 18px' }
                      : { background: 'var(--pharma-bg-card)', border: '1px solid var(--pharma-border)', color: 'var(--pharma-text-2)', borderRadius: '4px 18px 18px 18px' }
                  }
                >
                  {m.text}
                </div>

                {m.confidence !== undefined && m.role === 'assistant' && (
                  <div className="flex items-center gap-2 mt-1.5 justify-end">
                    <span className="text-xs font-mono" style={{ color: 'var(--pharma-success)' }}>{m.confidence}% اطمینان</span>
                  </div>
                )}

                {m.sources && (
                  <div className="mt-2 space-y-1">
                    {m.sources.map((s, i) => (
                      <div
                        key={i}
                        className="rounded-lg px-3 py-2 text-right"
                        style={{ background: 'var(--pharma-bg-elevated)', border: '1px solid var(--pharma-border)' }}
                      >
                        <div className="text-xs font-medium mb-0.5" style={{ color: 'var(--pharma-text)' }}>{s.title}</div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs" style={{ color: 'var(--pharma-cyan)' }}>{s.relevance}%</span>
                          <span className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>{s.source}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-end">
              <div
                className="rounded-2xl px-4 py-3 flex items-center gap-2"
                style={{ background: 'var(--pharma-bg-card)', border: '1px solid var(--pharma-border)' }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: 'var(--pharma-cyan)',
                      animation: `pulse-cyan 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEnd} />
        </div>

        {/* Quick questions */}
        <div
          className="px-5 py-2 flex gap-2 overflow-x-auto"
          style={{ borderTop: '1px solid var(--pharma-border)' }}
        >
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="text-xs px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 transition-colors"
              style={{
                background: 'var(--pharma-bg-elevated)',
                color: 'var(--pharma-text-2)',
                border: '1px solid var(--pharma-border)',
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div
          className="px-5 py-4 flex items-end gap-3"
          style={{ borderTop: '1px solid var(--pharma-border)', background: 'var(--pharma-bg-card)' }}
        >
          <button
            onClick={() => send()}
            disabled={!input.trim() || typing}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all"
            style={{
              background: input.trim() && !typing ? 'var(--pharma-cyan)' : 'var(--pharma-bg-elevated)',
              color: input.trim() && !typing ? 'var(--pharma-bg)' : 'var(--pharma-text-muted)',
            }}
          >
            ↑
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder={`سوال خود را درباره ${activeDrug} بپرسید...`}
            rows={1}
            className="flex-1 resize-none rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
            style={{
              background: 'var(--pharma-bg-elevated)',
              border: '1px solid var(--pharma-border)',
              color: 'var(--pharma-text)',
              minHeight: 40,
              maxHeight: 120,
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--pharma-cyan)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--pharma-border)')}
          />
        </div>
      </div>

      {/* Evidence Panel - Right in RTL */}
      <div
        className="w-64 flex flex-col shrink-0"
        style={{ background: 'var(--pharma-bg-card)', borderRight: '1px solid var(--pharma-border)' }}
      >
        <div
          className="px-4 py-3 text-xs font-semibold"
          style={{ borderBottom: '1px solid var(--pharma-border)', color: 'var(--pharma-text-muted)' }}
        >
          شواهد و منابع
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {[
            { t: 'متاآنالیز: اثربخشی در درد حاد', s: 'Cochrane 2024', r: 96, type: 'meta' },
            { t: 'کارآزمایی فاز ۳ تصادفی‌سازی‌شده', s: 'NEJM 2023', r: 91, type: 'trial' },
            { t: 'بررسی سیستماتیک ایمنی کبدی', s: 'Hepatology 2024', r: 88, type: 'review' },
            { t: 'گزارش مورد: سمیت در overdose', s: 'Clin Tox 2023', r: 84, type: 'case' },
            { t: 'مطالعه فارماکوکینتیک', s: 'CPT 2022', r: 79, type: 'pk' },
          ].map((e, i) => (
            <div
              key={i}
              className="p-2.5 rounded-lg cursor-pointer hover:border-[var(--pharma-border-bright)] transition-colors"
              style={{ background: 'var(--pharma-bg-elevated)', border: '1px solid var(--pharma-border)' }}
            >
              <div className="text-xs font-medium text-right mb-1" style={{ color: 'var(--pharma-text)' }}>{e.t}</div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs" style={{ color: 'var(--pharma-success)' }}>{e.r}%</span>
                <span className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>{e.s}</span>
              </div>
            </div>
          ))}
        </div>
        <div
          className="p-3 text-center"
          style={{ borderTop: '1px solid var(--pharma-border)' }}
        >
          <div className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>
            {activeDrug} · {messages[0]?.confidence}% اطمینان کلی
          </div>
        </div>
      </div>
    </div>
  )
}
