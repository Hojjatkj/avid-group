import { useState } from 'react'
import StatusBadge from '../components/StatusBadge'

const trials = [
  { id: 'NCT-04521283', drug: 'استامینوفن', title: 'اثربخشی استامینوفن در درد مزمن پس از جراحی', phase: 'فاز ۳', status: 'active', condition: 'درد مزمن', n: 480, start: '۲۰۲۳', end: '۲۰۲۵' },
  { id: 'NCT-03891724', drug: 'وارفارین', title: 'مقایسه وارفارین با NOACs در بیماران دیالیزی', phase: 'فاز ۳', status: 'recruiting', condition: 'فیبریلاسیون دهلیزی', n: 320, start: '۲۰۲۲', end: '۲۰۲۵' },
  { id: 'NCT-04109823', drug: 'متوتروکسات', title: 'دوز پایین متوتروکسات در آرتریت روماتوئید اولیه', phase: 'فاز ۴', status: 'completed', condition: 'آرتریت روماتوئید', n: 215, start: '۲۰۲۱', end: '۲۰۲۳' },
  { id: 'NCT-05231847', drug: 'مورفین', title: 'مورفین اکستندد ریلیز در درد سرطانی', phase: 'فاز ۳', status: 'active', condition: 'درد سرطانی', n: 380, start: '۲۰۲۳', end: '۲۰۲۶' },
  { id: 'NCT-03654129', drug: 'دیگوکسین', title: 'بهینه‌سازی دوز دیگوکسین با هوش مصنوعی', phase: 'فاز ۲', status: 'completed', condition: 'نارسایی قلبی', n: 156, start: '۲۰۲۰', end: '۲۰۲۲' },
  { id: 'NCT-04789321', drug: 'لیتیم', title: 'لیتیم در اختلال دوقطبی نوع ۲', phase: 'فاز ۳', status: 'recruiting', condition: 'اختلال دوقطبی', n: 240, start: '۲۰۲۴', end: '۲۰۲۶' },
]

const statusColors: Record<string, string> = {
  active: 'var(--pharma-success)',
  recruiting: 'var(--pharma-cyan-light)',
  completed: 'var(--pharma-text-2)',
  suspended: 'var(--pharma-danger)',
}
const statusLabels: Record<string, string> = {
  active: 'در حال اجرا',
  recruiting: 'در حال جذب',
  completed: 'تکمیل‌شده',
  suspended: 'متوقف',
}
const phaseColors: Record<string, string> = {
  'فاز ۲': 'var(--pharma-purple)',
  'فاز ۳': 'var(--pharma-cyan-light)',
  'فاز ۴': 'var(--pharma-success)',
}

export default function ClinicalTrials() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('همه')

  const filtered = trials.filter((t) => {
    const q = search.toLowerCase()
    return (!q || t.drug.includes(q) || t.title.includes(q) || t.id.toLowerCase().includes(q))
      && (status === 'همه' || t.status === status)
  })

  return (
    <div className="p-6 animate-fade-in">
      <div className="card-pharma p-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی کارآزمایی، دارو یا شناسه..."
              className="w-full text-sm pr-9 pl-4 py-2.5 rounded-xl outline-none"
              style={{ background: 'var(--pharma-bg-elevated)', border: '1px solid var(--pharma-border)', color: 'var(--pharma-text)' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--pharma-cyan)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--pharma-border)')}
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--pharma-text-muted)" strokeWidth="1.8">
              <circle cx="6.5" cy="6.5" r="5" /><line x1="10.5" y1="10.5" x2="15" y2="15" />
            </svg>
          </div>
          {['همه', 'active', 'recruiting', 'completed'].map((s) => (
            <button key={s} onClick={() => setStatus(s)}
              className="text-xs px-3 py-2 rounded-lg transition-all"
              style={status === s
                ? { background: 'rgba(var(--pharma-cyan-rgb),0.15)', color: 'var(--pharma-cyan)', border: '1px solid rgba(var(--pharma-cyan-rgb),0.4)' }
                : { background: 'var(--pharma-bg-elevated)', color: 'var(--pharma-text-muted)', border: '1px solid var(--pharma-border)' }}>
              {s === 'همه' ? 'همه' : statusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((t) => (
          <div key={t.id} className="card-pharma p-4 hover:border-[var(--pharma-border-bright)] transition-colors cursor-default">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <StatusBadge label={statusLabels[t.status]} color={statusColors[t.status]} />
                <StatusBadge label={t.phase} color={phaseColors[t.phase] || 'var(--pharma-text-2)'} dot={false} />
              </div>
              <div className="text-right">
                <div className="font-semibold text-sm mb-1" style={{ color: 'var(--pharma-text)' }}>{t.title}</div>
                <div className="flex items-center gap-3 justify-end">
                  <span className="font-mono text-xs" style={{ color: 'var(--pharma-text-muted)' }}>{t.id}</span>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(var(--pharma-cyan-rgb),0.08)', color: 'var(--pharma-cyan)' }}>{t.drug}</span>
                  <span className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>{t.condition}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid var(--pharma-border)' }}>
              <div className="flex gap-4 text-xs" style={{ color: 'var(--pharma-text-muted)' }}>
                <span>پایان: {t.end}</span>
                <span>شروع: {t.start}</span>
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--pharma-text-muted)' }}>
                <span>n=<span className="font-mono" style={{ color: 'var(--pharma-text-2)' }}>{t.n}</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
