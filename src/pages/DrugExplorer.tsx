import { useState } from 'react'
import { drugs, getRegulatoryColor, getRegulatoryLabel, getRiskColor, getRiskLabel } from '../data/drugs'
import StatusBadge from '../components/StatusBadge'
import ScoreBar from '../components/ScoreBar'

const categories = ['همه', 'مسکن / ضد تب', 'قلبی-عروقی', 'ضد انعقاد', 'اوپیوئید / مسکن', 'ضد سرطان / ایمونوساپرسیو', 'روان‌پزشکی / تثبیت‌کننده خلق', 'آنتی‌کولینرژیک']

export default function DrugExplorer({ onNavigate }: { onNavigate: (p: string, id?: number) => void }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('همه')
  const [risk, setRisk] = useState('همه')
  const [regulatory, setRegulatory] = useState('همه')
  const [view, setView] = useState<'table' | 'cards'>('table')

  const filtered = drugs.filter((d) => {
    const q = search.toLowerCase()
    const matchSearch = !q || d.name.includes(q) || d.nameEn.toLowerCase().includes(q) || d.formula.toLowerCase().includes(q)
    const matchCat = category === 'همه' || d.category === category
    const matchRisk = risk === 'همه' || d.riskLevel === risk
    const matchReg = regulatory === 'همه' || d.regulatory === regulatory
    return matchSearch && matchCat && matchRisk && matchReg
  })

  return (
    <div className="p-6 animate-fade-in">
      {/* Search */}
      <div
        className="card-pharma p-4 mb-5"
        style={{ background: 'linear-gradient(135deg, var(--pharma-bg-card) 0%, var(--pharma-bg-elevated) 100%)' }}
      >
        <div className="relative mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی دارو، ترکیب یا بیماری..."
            className="w-full text-sm pr-10 pl-4 py-3 rounded-xl outline-none transition-all"
            style={{
              background: 'var(--pharma-bg-elevated)',
              border: '1px solid var(--pharma-border)',
              color: 'var(--pharma-text)',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--pharma-cyan)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--pharma-border)')}
          />
          <svg
            className="absolute right-3.5 top-1/2 -translate-y-1/2"
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            stroke="var(--pharma-text-muted)" strokeWidth="1.8"
          >
            <circle cx="6.5" cy="6.5" r="5" />
            <line x1="10.5" y1="10.5" x2="15" y2="15" />
          </svg>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-xs rounded-lg px-3 py-1.5 outline-none"
            style={{ background: 'var(--pharma-bg-elevated)', border: '1px solid var(--pharma-border)', color: 'var(--pharma-text-2)' }}
          >
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>

          <select
            value={risk}
            onChange={(e) => setRisk(e.target.value)}
            className="text-xs rounded-lg px-3 py-1.5 outline-none"
            style={{ background: 'var(--pharma-bg-elevated)', border: '1px solid var(--pharma-border)', color: 'var(--pharma-text-2)' }}
          >
            <option value="همه">همه سطوح خطر</option>
            <option value="low">خطر پایین</option>
            <option value="medium">خطر متوسط</option>
            <option value="high">خطر بالا</option>
            <option value="critical">بحرانی</option>
          </select>

          <select
            value={regulatory}
            onChange={(e) => setRegulatory(e.target.value)}
            className="text-xs rounded-lg px-3 py-1.5 outline-none"
            style={{ background: 'var(--pharma-bg-elevated)', border: '1px solid var(--pharma-border)', color: 'var(--pharma-text-2)' }}
          >
            <option value="همه">همه وضعیت‌ها</option>
            <option value="approved">تأیید شده</option>
            <option value="controlled">کنترل‌شده</option>
            <option value="review">در حال بررسی</option>
          </select>

          <div className="mr-auto flex gap-1">
            <button
              onClick={() => setView('table')}
              className="px-2 py-1.5 rounded text-xs"
              style={{
                background: view === 'table' ? 'rgba(var(--pharma-cyan-rgb),0.15)' : 'var(--pharma-bg-elevated)',
                color: view === 'table' ? 'var(--pharma-cyan)' : 'var(--pharma-text-muted)',
                border: '1px solid var(--pharma-border)',
              }}
            >
              ≡ جدول
            </button>
            <button
              onClick={() => setView('cards')}
              className="px-2 py-1.5 rounded text-xs"
              style={{
                background: view === 'cards' ? 'rgba(var(--pharma-cyan-rgb),0.15)' : 'var(--pharma-bg-elevated)',
                color: view === 'cards' ? 'var(--pharma-cyan)' : 'var(--pharma-text-muted)',
                border: '1px solid var(--pharma-border)',
              }}
            >
              ⊞ کارت
            </button>
          </div>

          <div className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>
            {filtered.length} نتیجه
          </div>
        </div>
      </div>

      {/* Table View */}
      {view === 'table' && (
        <div className="card-pharma overflow-x-auto">
          <table className="w-full" style={{ minWidth: 720 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--pharma-border)' }}>
                {['امتیاز AI', 'وضعیت رگولاتوری', 'سمیت', 'اثربخشی', 'دسته', 'فرمول', 'نام دارو'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-right text-xs font-semibold"
                    style={{ color: 'var(--pharma-text-muted)', background: 'var(--pharma-bg-elevated)' }}
                  >
                    {h}
                  </th>
                ))}
                <th style={{ background: 'var(--pharma-bg-elevated)' }} />
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr
                  key={d.id}
                  className="hover:bg-[var(--pharma-bg-hover)] transition-colors cursor-pointer"
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--pharma-border)' : 'none' }}
                  onClick={() => onNavigate('drug-profiles', d.id)}
                >
                  <td className="px-4 py-3">
                    <span
                      className="font-mono text-xs font-semibold px-2 py-0.5 rounded"
                      style={{ background: 'rgba(var(--pharma-cyan-rgb),0.1)', color: 'var(--pharma-cyan)' }}
                    >
                      {d.aiScore}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      label={getRegulatoryLabel(d.regulatory)}
                      color={getRegulatoryColor(d.regulatory)}
                    />
                  </td>
                  <td className="px-4 py-3" style={{ minWidth: 120 }}>
                    <ScoreBar value={d.toxicity} showValue type="default" height={5} />
                  </td>
                  <td className="px-4 py-3" style={{ minWidth: 120 }}>
                    <ScoreBar value={d.efficacy} showValue type="success" height={5} />
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--pharma-text-2)' }}>
                    {d.category}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs" style={{ color: 'var(--pharma-text-muted)' }}>
                      {d.formula}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-semibold text-sm" style={{ color: 'var(--pharma-text)' }}>{d.name}</div>
                    <div className="text-xs font-mono" style={{ color: 'var(--pharma-text-muted)' }}>{d.nameEn}</div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="text-xs px-2 py-1 rounded"
                      style={{ color: 'var(--pharma-cyan)', background: 'rgba(var(--pharma-cyan-rgb),0.08)' }}
                      onClick={(e) => { e.stopPropagation(); onNavigate('drug-profiles', d.id) }}
                    >
                      مشاهده
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cards View */}
      {view === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((d) => (
            <div
              key={d.id}
              className="card-pharma p-4 cursor-pointer hover:border-[var(--pharma-border-bright)] transition-all"
              onClick={() => onNavigate('drug-profiles', d.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-2">
                  <StatusBadge label={getRegulatoryLabel(d.regulatory)} color={getRegulatoryColor(d.regulatory)} />
                  <StatusBadge label={getRiskLabel(d.riskLevel)} color={getRiskColor(d.riskLevel)} dot={false} />
                </div>
                <div>
                  <div className="font-bold text-base" style={{ color: 'var(--pharma-text)' }}>{d.name}</div>
                  <div className="text-xs font-mono" style={{ color: 'var(--pharma-text-muted)' }}>{d.nameEn}</div>
                </div>
              </div>

              <div className="font-mono text-sm mb-3" style={{ color: 'var(--pharma-cyan-light)' }}>
                {d.formula}
              </div>

              <div className="text-xs mb-3" style={{ color: 'var(--pharma-text-2)' }}>{d.category}</div>

              <div className="space-y-2">
                <ScoreBar value={d.efficacy} label="اثربخشی" type="success" height={5} />
                <ScoreBar value={d.toxicity} label="سمیت" height={5} />
                <ScoreBar value={d.aiScore} label="امتیاز AI" type="default" height={5} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
