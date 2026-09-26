import { useState } from 'react'
import { drugs } from '../data/drugs'
import ScoreBar from '../components/ScoreBar'
import StatusBadge from '../components/StatusBadge'

const keyFindings = [
  { text: 'اثربخشی بالا در کنترل درد و تب با پروفایل ایمنی مناسب در دوزهای درمانی', type: 'positive' },
  { text: 'خطر هپاتوتوکسیسیتی در مصرف دوزهای بالا یا همزمان با الکل به‌طور قابل‌توجهی افزایش می‌یابد', type: 'risk' },
  { text: 'تداخل دارویی محدود در مقایسه با NSAIDها، مناسب برای بیماران با ریسک خونریزی گوارشی', type: 'positive' },
  { text: 'شواهد قوی از کارآزمایی‌های تصادفی‌سازی‌شده در کنترل درد حاد', type: 'evidence' },
  { text: 'لازم به مانیتورینگ عملکرد کبدی در مصرف دراز‌مدت', type: 'warning' },
]

const modelResults = [
  { model: 'Avid-LLM v3', score: 82, confidence: 94, type: 'LLM-based' },
  { model: 'EfficacyNet-2', score: 87, confidence: 91, type: 'Deep Learning' },
  { model: 'ToxPredict-AI', score: 34, confidence: 89, type: 'Predictive' },
  { model: 'DrugAssess v2', score: 79, confidence: 86, type: 'Ensemble' },
]

const strengths = [
  'پروفایل ایمنی مناسب در دوزهای درمانی',
  'بدون اثر ضد پلاکتی',
  'مناسب برای اکثر گروه‌های سنی',
  'موجود به صورت OTC',
  'تداخل دارویی کم',
]

const risks = [
  'هپاتوتوکسیسیتی در overdose',
  'خطر بالاتر در بیماران کبدی',
  'تداخل با وارفارین',
  'خطر مصرف ناآگاهانه (ترکیبات مختلف)',
]

export default function AIAssessment() {
  const [selected, setSelected] = useState(1)
  const drug = drugs.find((d) => d.id === selected) || drugs[0]

  return (
    <div className="p-6 animate-fade-in">
      {/* Drug selector */}
      <div className="card-pharma p-4 mb-5">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {drugs.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelected(d.id)}
                className="text-xs px-3 py-1.5 rounded-lg transition-all"
                style={
                  selected === d.id
                    ? { background: 'rgba(var(--pharma-cyan-rgb),0.15)', color: 'var(--pharma-cyan)', border: '1px solid rgba(var(--pharma-cyan-rgb),0.4)' }
                    : { background: 'var(--pharma-bg-elevated)', color: 'var(--pharma-text-muted)', border: '1px solid var(--pharma-border)' }
                }
              >
                {d.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge label="Avid-LLM v3" color="var(--pharma-purple)" dot={false} size="md" />
            <div className="text-right">
              <div className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>ارزیابی هوش مصنوعی</div>
              <div className="font-semibold" style={{ color: 'var(--pharma-text)' }}>{drug.name}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Main Assessment */}
        <div className="sm:col-span-2 space-y-4">
          {/* Overall Score */}
          <div
            className="card-pharma p-5"
            style={{ background: 'linear-gradient(135deg, var(--pharma-bg-card) 0%, var(--pharma-bg-active) 100%)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="font-mono text-4xl font-bold"
                  style={{ color: 'var(--pharma-cyan)' }}
                >
                  {drug.aiScore}
                </div>
                <div>
                  <div className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>امتیاز ارزیابی کلی</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--pharma-text-muted)' }}>
                    میزان اطمینان: <span className="font-mono" style={{ color: 'var(--pharma-success)' }}>{drug.confidence}%</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: 'var(--pharma-text)' }}>{drug.name}</div>
                <div className="text-xs font-mono" style={{ color: 'var(--pharma-text-muted)' }}>{drug.nameEn}</div>
              </div>
            </div>
            <p className="text-sm leading-7 text-right" style={{ color: 'var(--pharma-text-2)' }}>
              بر اساس تحلیل {drug.evidenceCount.toLocaleString()} مقاله علمی و {drug.trialsCount} کارآزمایی بالینی،
              هوش مصنوعی Avid-LLM v3 ارزیابی جامعی از این دارو ارائه می‌دهد.
              این ارزیابی شامل تحلیل اثربخشی، سمیت، تداخلات دارویی و وضعیت رگولاتوری می‌باشد.
              نتایج به‌صورت ساختاریافته و قابل استناد ارائه شده است.
            </p>
          </div>

          {/* Key Findings */}
          <div className="card-pharma p-4">
            <div className="text-sm font-semibold mb-4 text-right" style={{ color: 'var(--pharma-text)' }}>
              یافته‌های کلیدی
            </div>
            <div className="space-y-2">
              {keyFindings.map((f, i) => {
                const color = f.type === 'positive' ? 'var(--pharma-success)' : f.type === 'risk' ? 'var(--pharma-danger)' : f.type === 'warning' ? 'var(--pharma-warning)' : 'var(--pharma-cyan-light)'
                const icon = f.type === 'positive' ? '✓' : f.type === 'risk' ? '⚠' : f.type === 'warning' ? '!' : '◈'
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg text-right"
                    style={{ background: `${color}08`, border: `1px solid ${color}20` }}
                  >
                    <p className="text-sm flex-1" style={{ color: 'var(--pharma-text-2)' }}>{f.text}</p>
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                      style={{ background: `${color}20`, color }}
                    >
                      {icon}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Strengths & Risks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card-pharma p-4">
              <div className="text-sm font-semibold mb-3 text-right" style={{ color: 'var(--pharma-text)' }}>نقاط قوت</div>
              <div className="space-y-2">
                {strengths.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 justify-end text-xs" style={{ color: 'var(--pharma-text-2)' }}>
                    <span>{s}</span>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--pharma-success)' }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="card-pharma p-4">
              <div className="text-sm font-semibold mb-3 text-right" style={{ color: 'var(--pharma-text)' }}>عوامل خطر</div>
              <div className="space-y-2">
                {risks.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 justify-end text-xs" style={{ color: 'var(--pharma-text-2)' }}>
                    <span>{r}</span>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--pharma-danger)' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Scores */}
          <div className="card-pharma p-4">
            <div className="text-sm font-semibold mb-4 text-right" style={{ color: 'var(--pharma-text)' }}>شاخص‌های ارزیابی</div>
            <div className="space-y-3">
              <ScoreBar value={drug.efficacy} label="اثربخشی" type="success" />
              <ScoreBar value={drug.toxicity} label="سمیت" />
              <ScoreBar value={drug.aiScore} label="امتیاز AI" type="default" />
              <ScoreBar value={drug.confidence} label="اطمینان" type="success" />
            </div>
          </div>

          {/* Model Results */}
          <div className="card-pharma p-4">
            <div className="text-sm font-semibold mb-3 text-right" style={{ color: 'var(--pharma-text)' }}>نتایج مدل‌ها</div>
            <div className="space-y-3">
              {modelResults.map((m) => (
                <div key={m.model} className="p-3 rounded-lg" style={{ background: 'var(--pharma-bg-elevated)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-sm" style={{ color: 'var(--pharma-cyan)' }}>{m.score}</span>
                    <div className="text-right">
                      <div className="text-xs font-medium" style={{ color: 'var(--pharma-text)' }}>{m.model}</div>
                      <div className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>{m.type}</div>
                    </div>
                  </div>
                  <div className="h-1 rounded-full" style={{ background: 'var(--pharma-border)' }}>
                    <div className="h-1 rounded-full" style={{ width: `${m.score}%`, background: 'var(--pharma-cyan)' }} />
                  </div>
                  <div className="text-xs mt-1 text-left font-mono" style={{ color: 'var(--pharma-text-muted)' }}>
                    conf: {m.confidence}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence count */}
          <div className="card-pharma p-4">
            <div className="text-sm font-semibold mb-3 text-right" style={{ color: 'var(--pharma-text)' }}>شواهد پشتیبان</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="text-center p-2 rounded-lg" style={{ background: 'var(--pharma-bg-elevated)' }}>
                <div className="font-mono font-bold" style={{ color: 'var(--pharma-cyan)' }}>{drug.evidenceCount.toLocaleString()}</div>
                <div className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>مقاله</div>
              </div>
              <div className="text-center p-2 rounded-lg" style={{ background: 'var(--pharma-bg-elevated)' }}>
                <div className="font-mono font-bold" style={{ color: 'var(--pharma-cyan-light)' }}>{drug.trialsCount}</div>
                <div className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>کارآزمایی</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
