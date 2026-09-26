import { useState } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import { drugs, getRegulatoryColor, getRegulatoryLabel, getRiskColor, getRiskLabel } from '../data/drugs'
import StatusBadge from '../components/StatusBadge'
import ScoreBar from '../components/ScoreBar'
import RadarAxisTick from '../components/RadarAxisTick'

const tabs = [
  { id: 'overview', label: 'نمای کلی' },
  { id: 'efficacy', label: 'اثربخشی' },
  { id: 'toxicity', label: 'سمیت' },
  { id: 'mechanism', label: 'مکانیسم' },
  { id: 'evidence', label: 'شواهد' },
  { id: 'regulatory', label: 'رگولاتوری' },
  { id: 'ai', label: 'ارزیابی AI' },
]

function CustomTooltip({ active, payload }: any) {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg px-3 py-2 text-xs" style={{ background: 'var(--pharma-bg-active)', border: '1px solid var(--pharma-border)', color: 'var(--pharma-text)' }}>
        {payload.map((p: any, i: number) => (
          <div key={i}>{p.payload.subject}: {p.value}</div>
        ))}
      </div>
    )
  }
  return null
}

export default function DrugProfile({
  drugId,
  onNavigate,
  onAIPanel,
}: {
  drugId: number
  onNavigate: (p: string, id?: number) => void
  onAIPanel: () => void
}) {
  const drug = drugs.find((d) => d.id === drugId) || drugs[0]
  const [tab, setTab] = useState('overview')

  const toxRadar = [
    { subject: 'کبدی', A: drug.hepatic },
    { subject: 'کلیوی', A: drug.renal },
    { subject: 'قلبی', A: drug.cardiac },
    { subject: 'ژنوتوکسیک', A: drug.genotoxic },
    { subject: 'تنفسی', A: Math.round(drug.toxicity * 0.6) },
  ]

  return (
    <div className="p-6 animate-fade-in">
      {/* Header Card */}
      <div className="card-pharma p-5 mb-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onAIPanel}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{ background: 'rgba(var(--pharma-cyan-rgb),0.1)', color: 'var(--pharma-cyan)', border: '1px solid rgba(var(--pharma-cyan-rgb),0.3)' }}
            >
              <span>✦</span>
              از هوش مصنوعی بپرسید
            </button>
            <button
              onClick={() => onNavigate('drug-comparison')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
              style={{ background: 'var(--pharma-bg-elevated)', color: 'var(--pharma-text-2)', border: '1px solid var(--pharma-border)' }}
            >
              مقایسه
            </button>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-3 justify-end mb-2">
              <StatusBadge label={getRegulatoryLabel(drug.regulatory)} color={getRegulatoryColor(drug.regulatory)} size="md" />
              <StatusBadge label={getRiskLabel(drug.riskLevel)} color={getRiskColor(drug.riskLevel)} size="md" />
            </div>
            <h1 className="text-2xl font-bold mb-0.5" style={{ color: 'var(--pharma-text)' }}>{drug.name}</h1>
            <div className="text-sm font-mono" style={{ color: 'var(--pharma-text-muted)' }}>{drug.nameEn}</div>
          </div>
        </div>

        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-5 pt-4"
          style={{ borderTop: '1px solid var(--pharma-border)' }}
        >
          {[
            { label: 'فرمول شیمیایی', value: drug.formula, mono: true, color: 'var(--pharma-cyan-light)' },
            { label: 'جرم مولی', value: `${drug.molWeight} g/mol`, mono: true, color: 'var(--pharma-text)' },
            { label: 'دسته دارویی', value: drug.category, mono: false, color: 'var(--pharma-text)' },
            { label: 'امتیاز AI', value: String(drug.aiScore), mono: true, color: 'var(--pharma-cyan)' },
            { label: 'میزان اطمینان', value: `${drug.confidence}%`, mono: true, color: 'var(--pharma-success)' },
          ].map((f) => (
            <div key={f.label} className="text-right">
              <div className="text-xs mb-1" style={{ color: 'var(--pharma-text-muted)' }}>{f.label}</div>
              <div
                className={f.mono ? 'font-mono text-sm font-semibold' : 'text-sm font-semibold'}
                style={{ color: f.color }}
              >
                {f.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 mb-4 p-1 rounded-xl"
        style={{ background: 'var(--pharma-bg-card)', border: '1px solid var(--pharma-border)' }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
            style={
              tab === t.id
                ? { background: 'var(--pharma-bg-active)', color: 'var(--pharma-cyan)', border: '1px solid rgba(var(--pharma-cyan-rgb),0.3)' }
                : { color: 'var(--pharma-text-muted)' }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in" key={tab}>
        {tab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-4">
              <div className="card-pharma p-4">
                <div className="text-sm font-semibold mb-3 text-right" style={{ color: 'var(--pharma-text)' }}>توضیحات</div>
                <p className="text-sm leading-7 text-right" style={{ color: 'var(--pharma-text-2)' }}>{drug.description}</p>
              </div>
              <div className="card-pharma p-4">
                <div className="text-sm font-semibold mb-3 text-right" style={{ color: 'var(--pharma-text)' }}>موارد مصرف</div>
                <div className="flex flex-wrap gap-2 justify-end">
                  {drug.indications.map((ind) => (
                    <span key={ind} className="text-xs px-2 py-1 rounded-lg"
                      style={{ background: 'var(--pharma-bg-elevated)', color: 'var(--pharma-text-2)', border: '1px solid var(--pharma-border)' }}>
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="card-pharma p-4">
                <div className="text-sm font-semibold mb-3 text-right" style={{ color: 'var(--pharma-text)' }}>شاخص‌های کلیدی</div>
                <div className="space-y-3">
                  <ScoreBar value={drug.efficacy} label="اثربخشی" type="success" />
                  <ScoreBar value={drug.toxicity} label="سمیت" />
                  <ScoreBar value={drug.aiScore} label="امتیاز AI" type="default" />
                  <ScoreBar value={drug.confidence} label="اطمینان" type="success" />
                </div>
              </div>
              <div className="card-pharma p-4">
                <div className="text-sm font-semibold mb-2 text-right" style={{ color: 'var(--pharma-text)' }}>شواهد و مطالعات</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'مقالات', value: drug.evidenceCount.toLocaleString() },
                    { label: 'کارآزمایی', value: drug.trialsCount.toLocaleString() },
                  ].map((s) => (
                    <div key={s.label} className="text-center p-2 rounded-lg" style={{ background: 'var(--pharma-bg-elevated)' }}>
                      <div className="font-mono font-bold text-base" style={{ color: 'var(--pharma-cyan)' }}>{s.value}</div>
                      <div className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'toxicity' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="card-pharma p-4 flex flex-col items-center">
              <div className="text-sm font-semibold mb-4 text-right w-full" style={{ color: 'var(--pharma-text)' }}>پروفایل سمیت</div>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={toxRadar} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                  <PolarGrid stroke="var(--pharma-border)" />
                  <PolarAngleAxis dataKey="subject" tick={<RadarAxisTick />} />
                  <Radar name={drug.name} dataKey="A" stroke="var(--pharma-cyan)" fill="var(--pharma-cyan)" fillOpacity={0.2} strokeWidth={2} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="sm:col-span-2 space-y-4">
              <div className="card-pharma p-4">
                <div className="text-sm font-semibold mb-4 text-right" style={{ color: 'var(--pharma-text)' }}>سمیت اندام‌ها</div>
                <div className="space-y-3">
                  {[
                    { label: 'سمیت کبدی', value: drug.hepatic, icon: '⬡' },
                    { label: 'سمیت کلیوی', value: drug.renal, icon: '◎' },
                    { label: 'سمیت قلبی', value: drug.cardiac, icon: '◈' },
                    { label: 'سمیت ژنوتوکسیک', value: drug.genotoxic, icon: '◻' },
                  ].map((t) => (
                    <div key={t.label} className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0"
                        style={{ background: 'var(--pharma-bg-elevated)', color: 'var(--pharma-text-muted)' }}
                      >
                        {t.icon}
                      </div>
                      <div className="flex-1">
                        <ScoreBar value={t.value} label={t.label} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="card-pharma p-4">
                  <div className="text-sm font-semibold mb-3 text-right" style={{ color: 'var(--pharma-text)' }}>اندام‌های هدف</div>
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {drug.targetOrgans.map((o) => (
                      <span key={o} className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(var(--pharma-danger-rgb),0.1)', color: 'var(--pharma-danger)', border: '1px solid rgba(var(--pharma-danger-rgb),0.2)' }}>{o}</span>
                    ))}
                  </div>
                </div>
                <div className="card-pharma p-4">
                  <div className="text-sm font-semibold mb-3 text-right" style={{ color: 'var(--pharma-text)' }}>آنتی‌دوت</div>
                  <div className="text-sm font-mono" style={{ color: 'var(--pharma-cyan)' }}>{drug.antidote}</div>
                  <div className="text-xs mt-2" style={{ color: 'var(--pharma-text-muted)' }}>دوز سمیت: <span className="font-mono">{drug.toxDose}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'mechanism' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card-pharma p-4">
              <div className="text-sm font-semibold mb-3 text-right" style={{ color: 'var(--pharma-text)' }}>مکانیسم اثر</div>
              <p className="text-sm leading-7 text-right" style={{ color: 'var(--pharma-text-2)' }}>{drug.mechanism}</p>
            </div>
            <div className="card-pharma p-4">
              <div className="text-sm font-semibold mb-3 text-right" style={{ color: 'var(--pharma-text)' }}>علائم مسمومیت</div>
              <div className="space-y-2">
                {drug.symptoms.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 justify-end text-sm" style={{ color: 'var(--pharma-text-2)' }}>
                    <span>{s}</span>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--pharma-danger)' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'regulatory' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { agency: 'FDA', status: drug.fdaStatus, flag: '🇺🇸', year: drug.approvalYear },
              { agency: 'EMA', status: drug.emaStatus, flag: '🇪🇺', year: drug.approvalYear + 1 },
            ].map((r) => (
              <div key={r.agency} className="card-pharma p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono" style={{ color: 'var(--pharma-text-muted)' }}>سال تأیید: {r.year}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{r.flag}</span>
                    <span className="font-mono font-bold" style={{ color: 'var(--pharma-cyan)' }}>{r.agency}</span>
                  </div>
                </div>
                <div className="text-sm" style={{ color: 'var(--pharma-text)' }}>{r.status}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'ai' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2 card-pharma p-4">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="font-mono text-2xl font-bold"
                  style={{ color: 'var(--pharma-cyan)' }}
                >
                  {drug.aiScore}<span className="text-sm">/100</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold" style={{ color: 'var(--pharma-text)' }}>ارزیابی کلی هوش مصنوعی</div>
                  <div className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>مدل: Avid-LLM v3</div>
                </div>
              </div>
              <p className="text-sm leading-7 text-right" style={{ color: 'var(--pharma-text-2)' }}>
                بر اساس تحلیل {drug.evidenceCount.toLocaleString()} مقاله و {drug.trialsCount} کارآزمایی بالینی،
                امتیاز کلی این دارو در ارزیابی هوش مصنوعی {drug.aiScore} از ۱۰۰ است.
                میزان اطمینان مدل به این ارزیابی {drug.confidence}% می‌باشد.
              </p>
            </div>
            <div className="card-pharma p-4">
              <div className="text-sm font-semibold mb-3 text-right" style={{ color: 'var(--pharma-text)' }}>میزان اطمینان</div>
              <div className="text-center py-4">
                <div className="font-mono text-4xl font-bold" style={{ color: 'var(--pharma-success)' }}>{drug.confidence}%</div>
                <div className="text-xs mt-2" style={{ color: 'var(--pharma-text-muted)' }}>بر اساس شواهد موجود</div>
              </div>
            </div>
          </div>
        )}

        {(tab === 'efficacy' || tab === 'evidence') && (
          <div className="card-pharma p-6">
            <div className="text-sm text-right" style={{ color: 'var(--pharma-text-2)' }}>
              اطلاعات {tab === 'efficacy' ? 'اثربخشی' : 'شواهد'} این دارو در حال بارگذاری است.
              برای مشاهده تحلیل کامل، از بخش تحلیل هوش مصنوعی استفاده کنید.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
