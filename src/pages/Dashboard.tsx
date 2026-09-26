import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import StatusBadge from '../components/StatusBadge'

const kpiCards = [
  { label: 'تعداد داروها', value: '۲٬۴۸۱', sub: '+۲۳ این ماه', color: 'var(--pharma-cyan)', icon: '⬡' },
  { label: 'تعداد ترکیبات', value: '۸٬۷۴۳', sub: '+۱۵۶ این ماه', color: 'var(--pharma-cyan-light)', icon: '◎' },
  { label: 'تحلیل‌های انجام‌شده', value: '۱۲٬۳۴۸', sub: '+۴۸ امروز', color: 'var(--pharma-purple)', icon: '◈' },
  { label: 'مدل‌های فعال', value: '۱۲', sub: '۳ در حال آموزش', color: 'var(--pharma-success)', icon: '✦' },
  { label: 'شواهد جدید', value: '۱۴۸', sub: 'در ۷ روز گذشته', color: 'var(--pharma-warning)', icon: '◻' },
  { label: 'هشدارهای جدید', value: '۲۳', sub: '۵ بحرانی', color: 'var(--pharma-danger)', icon: '⚠' },
]

const activityData = [
  { day: 'شن', analyses: 42, drugs: 8 },
  { day: 'یک', analyses: 67, drugs: 12 },
  { day: 'دو', analyses: 55, drugs: 9 },
  { day: 'سه', analyses: 89, drugs: 15 },
  { day: 'چه', analyses: 72, drugs: 11 },
  { day: 'پن', analyses: 94, drugs: 18 },
  { day: 'جم', analyses: 78, drugs: 14 },
]

const toxicityOverview = [
  { name: 'کبدی', value: 68, fill: 'var(--pharma-danger)' },
  { name: 'قلبی', value: 45, fill: 'var(--pharma-warning)' },
  { name: 'کلیوی', value: 52, fill: 'var(--pharma-purple)' },
  { name: 'ژنوتوکسیک', value: 31, fill: 'var(--pharma-cyan-light)' },
]

const recentAnalyses = [
  { drug: 'استامینوفن', type: 'تحلیل سمیت', model: 'Avid-LLM v3', score: 82, status: 'completed', time: '۱۰ دقیقه پیش' },
  { drug: 'وارفارین', type: 'ارزیابی اثربخشی', model: 'EfficacyNet-2', score: 76, status: 'completed', time: '۴۵ دقیقه پیش' },
  { drug: 'متوتروکسات', type: 'ارزیابی هوش مصنوعی', model: 'DrugAssess v2', score: 74, status: 'running', time: 'در حال اجرا' },
  { drug: 'دیگوکسین', type: 'مقایسه مدل‌ها', model: 'Ensemble', score: 71, status: 'completed', time: '۲ ساعت پیش' },
  { drug: 'مورفین', type: 'تحلیل رگولاتوری', model: 'RegulatoryAI', score: 79, status: 'completed', time: '۳ ساعت پیش' },
]

const alerts = [
  { drug: 'متوتروکسات', text: 'FDA هشدار جدید برای تداخل دارویی صادر کرد', severity: 'critical', time: '۱۵ دق' },
  { drug: 'وارفارین', text: 'بروزرسانی پروتکل مانیتورینگ INR', severity: 'warning', time: '۲ ساعت' },
  { drug: 'دیگوکسین', text: 'EMA دامنه درمانی را بازنگری کرد', severity: 'info', time: 'دیروز' },
]

const recentEvidence = [
  { title: 'متاآنالیز جدید در مورد اثربخشی استامینوفن در درد مزمن', source: 'PubMed', date: '۲۰۲۴', relevance: 94 },
  { title: 'کارآزمایی فاز ۳ وارفارین در فیبریلاسیون دهلیزی', source: 'ClinicalTrials.gov', date: '۲۰۲۴', relevance: 88 },
  { title: 'بررسی سیستماتیک ایمنی مورفین در درد سرطانی', source: 'Cochrane', date: '۲۰۲۳', relevance: 91 },
]

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg px-3 py-2 text-xs" style={{ background: 'var(--pharma-bg-active)', border: '1px solid var(--pharma-border)', color: 'var(--pharma-text)' }}>
        <div className="font-medium mb-1">{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} style={{ color: p.color }}>{p.name}: {p.value}</div>
        ))}
      </div>
    )
  }
  return null
}

export default function Dashboard({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <div className="p-6 animate-fade-in">
      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {kpiCards.map((k) => (
          <div
            key={k.label}
            className="card-pharma p-4 hover:border-[var(--pharma-border-bright)] transition-colors cursor-default"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                style={{ background: `${k.color}18`, color: k.color }}
              >
                {k.icon}
              </div>
            </div>
            <div className="text-xl font-bold font-mono mb-0.5" style={{ color: k.color }}>
              {k.value}
            </div>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--pharma-text)' }}>{k.label}</div>
            <div className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Activity Chart */}
        <div className="card-pharma p-4 sm:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>۷ روز گذشته</div>
            <div className="text-sm font-semibold" style={{ color: 'var(--pharma-text)' }}>
              فعالیت تحلیل‌ها
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={activityData} margin={{ top: 0, right: 8, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--pharma-cyan)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--pharma-cyan)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--pharma-cyan-light)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--pharma-cyan-light)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--pharma-border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: 'var(--pharma-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--pharma-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="analyses" name="تحلیل‌ها" stroke="var(--pharma-cyan)" strokeWidth={2} fill="url(#cyanGrad)" dot={false} />
              <Area type="monotone" dataKey="drugs" name="داروهای جدید" stroke="var(--pharma-cyan-light)" strokeWidth={2} fill="url(#blueGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Toxicity Overview */}
        <div className="card-pharma p-4">
          <div className="text-sm font-semibold mb-4 text-right" style={{ color: 'var(--pharma-text)' }}>
            نمای کلی سمیت
          </div>
          <div className="space-y-3">
            {toxicityOverview.map((t) => (
              <div key={t.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-xs font-medium" style={{ color: t.fill }}>{t.value}%</span>
                  <span className="text-xs" style={{ color: 'var(--pharma-text-2)' }}>{t.name}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'var(--pharma-border)' }}>
                  <div
                    className="h-1.5 rounded-full score-bar-fill"
                    style={{ width: `${t.value}%`, background: t.fill }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--pharma-border)' }}>
            <div className="text-xs text-center" style={{ color: 'var(--pharma-text-muted)' }}>
              میانگین در ۷ داروی مرجع
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Recent Analyses */}
        <div className="card-pharma sm:col-span-2">
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid var(--pharma-border)' }}
          >
            <button
              onClick={() => onNavigate('drug-explorer')}
              className="text-xs"
              style={{ color: 'var(--pharma-cyan)' }}
            >
              مشاهده همه
            </button>
            <div className="text-sm font-semibold" style={{ color: 'var(--pharma-text)' }}>
              آخرین تحلیل‌ها
            </div>
          </div>
          <div>
            {recentAnalyses.map((a, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-3 text-sm hover:bg-[var(--pharma-bg-hover)] transition-colors cursor-default"
                style={{ borderBottom: i < recentAnalyses.length - 1 ? '1px solid var(--pharma-border)' : 'none' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="font-mono text-xs px-2 py-0.5 rounded"
                    style={{ background: 'var(--pharma-bg-elevated)', color: 'var(--pharma-cyan)', minWidth: 28, textAlign: 'center' }}
                  >
                    {a.score}
                  </div>
                  <div>
                    <div className="text-xs font-medium" style={{ color: 'var(--pharma-text-muted)' }}>{a.model}</div>
                    <div className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>{a.time}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium" style={{ color: 'var(--pharma-text)' }}>{a.drug}</div>
                  <div className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>{a.type}</div>
                </div>
                <StatusBadge
                  label={a.status === 'completed' ? 'کامل' : 'در حال اجرا'}
                  color={a.status === 'completed' ? 'var(--pharma-success)' : 'var(--pharma-warning)'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Alerts + Evidence */}
        <div className="flex flex-col gap-4">
          {/* Alerts */}
          <div className="card-pharma flex-1">
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid var(--pharma-border)' }}
            >
              <button onClick={() => onNavigate('alerts')} className="text-xs" style={{ color: 'var(--pharma-cyan)' }}>
                همه
              </button>
              <div className="text-sm font-semibold" style={{ color: 'var(--pharma-text)' }}>هشدارهای رگولاتوری</div>
            </div>
            <div>
              {alerts.map((a, i) => (
                <div
                  key={i}
                  className="px-4 py-3 text-right"
                  style={{ borderBottom: i < alerts.length - 1 ? '1px solid var(--pharma-border)' : 'none' }}
                >
                  <div className="flex items-start gap-2 justify-end">
                    <div>
                      <div className="text-xs font-medium mb-0.5" style={{ color: 'var(--pharma-text)' }}>{a.drug}</div>
                      <div className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>{a.text}</div>
                    </div>
                    <span
                      className="w-2 h-2 rounded-full mt-1 shrink-0"
                      style={{
                        background: a.severity === 'critical' ? 'var(--pharma-danger)' : a.severity === 'warning' ? 'var(--pharma-warning)' : 'var(--pharma-cyan-light)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Evidence */}
          <div className="card-pharma">
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid var(--pharma-border)' }}
            >
              <button onClick={() => onNavigate('publications')} className="text-xs" style={{ color: 'var(--pharma-cyan)' }}>
                همه
              </button>
              <div className="text-sm font-semibold" style={{ color: 'var(--pharma-text)' }}>شواهد جدید</div>
            </div>
            {recentEvidence.map((e, i) => (
              <div
                key={i}
                className="px-4 py-3 text-right"
                style={{ borderBottom: i < recentEvidence.length - 1 ? '1px solid var(--pharma-border)' : 'none' }}
              >
                <div className="text-xs font-medium mb-1" style={{ color: 'var(--pharma-text)' }}>{e.title}</div>
                <div className="flex items-center justify-end gap-2">
                  <span className="font-mono text-xs" style={{ color: 'var(--pharma-success)' }}>{e.relevance}%</span>
                  <span className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>
                    {e.source} · {e.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
