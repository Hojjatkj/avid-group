import { useState } from 'react'
import StatusBadge from '../components/StatusBadge'

const publications = [
  { id: 1, title: 'متاآنالیز جامع اثربخشی استامینوفن در درد مزمن', authors: 'Smith J, et al.', journal: 'Lancet', year: '۲۰۲۴', source: 'PubMed', relevance: 96, type: 'meta', drug: 'استامینوفن', pmid: '38521847' },
  { id: 2, title: 'بررسی سیستماتیک ایمنی دیگوکسین در نارسایی قلبی پیشرفته', authors: 'Chen L, et al.', journal: 'JACC', year: '۲۰۲۴', source: 'PubMed', relevance: 91, type: 'systematic', drug: 'دیگوکسین', pmid: '38412633' },
  { id: 3, title: 'مقایسه وارفارین با آپیکسابان در بیماران مسن', authors: 'Kumar R, et al.', journal: 'NEJM', year: '۲۰۲۳', source: 'PubMed', relevance: 94, type: 'rct', drug: 'وارفارین', pmid: '37985412' },
  { id: 4, title: 'پروتکل جدید مدیریت درد با مورفین در بیماران انکولوژی', authors: 'Hassan M, et al.', journal: 'J Pain', year: '۲۰۲۳', source: 'PubMed', relevance: 88, type: 'guideline', drug: 'مورفین', pmid: '37451298' },
  { id: 5, title: 'متوتروکسات و خطر فیبروز ریوی: بررسی ۲۰ ساله', authors: 'Wang Y, et al.', journal: 'Chest', year: '۲۰۲۳', source: 'Cochrane', relevance: 92, type: 'systematic', drug: 'متوتروکسات', pmid: '37102584' },
  { id: 6, title: 'لیتیم در پیشگیری از خودکشی در اختلال دوقطبی', authors: 'Mueller C, et al.', journal: 'BJP', year: '۲۰۲۴', source: 'PubMed', relevance: 89, type: 'rct', drug: 'لیتیم', pmid: '38098741' },
]

const typeLabels: Record<string, string> = { meta: 'متاآنالیز', systematic: 'بررسی سیستماتیک', rct: 'کارآزمایی RCT', guideline: 'راهنما' }
const typeColors: Record<string, string> = { meta: 'var(--pharma-purple)', systematic: 'var(--pharma-cyan-light)', rct: 'var(--pharma-success)', guideline: 'var(--pharma-warning)' }

export default function Publications() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('همه')

  const filtered = publications.filter((p) => {
    const q = search.toLowerCase()
    return (!q || p.title.includes(q) || p.drug.includes(q) || p.authors.toLowerCase().includes(q))
      && (type === 'همه' || p.type === type)
  })

  return (
    <div className="p-6 animate-fade-in">
      <div className="card-pharma p-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی مقاله، نویسنده یا دارو..."
              className="w-full text-sm pr-9 pl-4 py-2.5 rounded-xl outline-none"
              style={{ background: 'var(--pharma-bg-elevated)', border: '1px solid var(--pharma-border)', color: 'var(--pharma-text)' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--pharma-cyan)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--pharma-border)')} />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--pharma-text-muted)" strokeWidth="1.8">
              <circle cx="6.5" cy="6.5" r="5" /><line x1="10.5" y1="10.5" x2="15" y2="15" />
            </svg>
          </div>
          {['همه', 'meta', 'systematic', 'rct', 'guideline'].map((t) => (
            <button key={t} onClick={() => setType(t)}
              className="text-xs px-3 py-2 rounded-lg transition-all whitespace-nowrap"
              style={type === t
                ? { background: 'rgba(var(--pharma-cyan-rgb),0.15)', color: 'var(--pharma-cyan)', border: '1px solid rgba(var(--pharma-cyan-rgb),0.4)' }
                : { background: 'var(--pharma-bg-elevated)', color: 'var(--pharma-text-muted)', border: '1px solid var(--pharma-border)' }}>
              {t === 'همه' ? 'همه' : typeLabels[t]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((p) => (
          <div key={p.id} className="card-pharma p-4 hover:border-[var(--pharma-border-bright)] transition-colors cursor-default">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="font-mono text-xs px-2 py-1 rounded" style={{ background: 'rgba(var(--pharma-success-rgb),0.1)', color: 'var(--pharma-success)' }}>
                  {p.relevance}%
                </div>
                <StatusBadge label={typeLabels[p.type]} color={typeColors[p.type]} dot={false} />
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(var(--pharma-cyan-rgb),0.08)', color: 'var(--pharma-cyan)' }}>{p.drug}</span>
              </div>
              <div className="text-right flex-1 mr-4">
                <div className="font-semibold text-sm mb-1" style={{ color: 'var(--pharma-text)' }}>{p.title}</div>
                <div className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>{p.authors}</div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: '1px solid var(--pharma-border)' }}>
              <div className="flex gap-3 text-xs" style={{ color: 'var(--pharma-text-muted)' }}>
                <span className="font-mono">PMID: {p.pmid}</span>
                <span>{p.source}</span>
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--pharma-text-muted)' }}>
                <span>{p.year}</span>
                <span className="font-medium" style={{ color: 'var(--pharma-text-2)' }}>{p.journal}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
