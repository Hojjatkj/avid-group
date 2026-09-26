import { useState } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { drugs } from '../data/drugs'
import StatusBadge from '../components/StatusBadge'
import RadarAxisTick from '../components/RadarAxisTick'

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg px-3 py-2 text-xs" style={{ background: 'var(--pharma-bg-active)', border: '1px solid var(--pharma-border)', color: 'var(--pharma-text)' }}>
        <div className="mb-1">{label || payload[0]?.payload?.subject}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} style={{ color: p.color || p.fill }}>{p.name || 'مقدار'}: {p.value}</div>
        ))}
      </div>
    )
  }
  return null
}

const toxTypes = [
  { key: 'hepatic', label: 'سمیت کبدی', icon: '⬡', color: 'var(--pharma-danger)', desc: 'آسیب کبدی ناشی از متابولیسم دارو' },
  { key: 'renal', label: 'سمیت کلیوی', icon: '◎', color: 'var(--pharma-purple)', desc: 'اثر دارو بر عملکرد کلیه' },
  { key: 'cardiac', label: 'سمیت قلبی', icon: '◈', color: 'var(--pharma-warning)', desc: 'تأثیر بر ریتم و عملکرد قلب' },
  { key: 'genotoxic', label: 'سمیت ژنوتوکسیک', icon: '◻', color: 'var(--pharma-cyan-light)', desc: 'آسیب به DNA و مواد ژنتیکی' },
]

export default function Toxicity() {
  const [selected, setSelected] = useState(1)
  const drug = drugs.find((d) => d.id === selected) || drugs[0]

  const radarData = [
    { subject: 'کبدی', A: drug.hepatic },
    { subject: 'کلیوی', A: drug.renal },
    { subject: 'قلبی', A: drug.cardiac },
    { subject: 'ژنوتوکسیک', A: drug.genotoxic },
    { subject: 'تنفسی', A: Math.round(drug.toxicity * 0.55) },
    { subject: 'عصبی', A: Math.round(drug.toxicity * 0.45) },
  ]

  const barData = drugs.slice(0, 6).map((d) => ({
    name: d.name,
    hepatic: d.hepatic,
    cardiac: d.cardiac,
  }))

  return (
    <div className="p-6 animate-fade-in">
      {/* Drug Selector */}
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
          <div className="text-right">
            <div className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>دارو انتخاب‌شده</div>
            <div className="font-semibold" style={{ color: 'var(--pharma-text)' }}>{drug.name}</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Radar */}
        <div className="card-pharma p-4">
          <div className="text-sm font-semibold mb-2 text-right" style={{ color: 'var(--pharma-text)' }}>پروفایل سمیت — {drug.name}</div>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData} margin={{ top: 10, right: 25, bottom: 10, left: 25 }}>
              <PolarGrid stroke="var(--pharma-border)" />
              <PolarAngleAxis dataKey="subject" tick={<RadarAxisTick />} />
              <Radar dataKey="A" stroke="var(--pharma-danger)" fill="var(--pharma-danger)" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <span
              className="font-mono text-2xl font-bold"
              style={{ color: drug.toxicity >= 70 ? 'var(--pharma-danger)' : drug.toxicity >= 40 ? 'var(--pharma-warning)' : 'var(--pharma-success)' }}
            >
              {drug.toxicity}
            </span>
            <span className="text-xs mr-1" style={{ color: 'var(--pharma-text-muted)' }}>امتیاز سمیت کلی</span>
          </div>
        </div>

        {/* Toxicity Types */}
        <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {toxTypes.map((t) => {
            const val = (drug as any)[t.key] as number
            return (
              <div key={t.key} className="card-pharma p-4">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="font-mono text-xl font-bold"
                    style={{ color: t.color }}
                  >
                    {val}
                    <span className="text-xs font-normal">/100</span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end mb-1">
                      <div className="text-sm font-semibold" style={{ color: 'var(--pharma-text)' }}>{t.label}</div>
                      <span style={{ color: t.color }}>{t.icon}</span>
                    </div>
                    <div className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>{t.desc}</div>
                  </div>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'var(--pharma-border)' }}>
                  <div
                    className="h-1.5 rounded-full score-bar-fill"
                    style={{ width: `${val}%`, background: t.color }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-end">
                  <StatusBadge
                    label={val >= 70 ? 'بالا' : val >= 40 ? 'متوسط' : 'پایین'}
                    color={val >= 70 ? 'var(--pharma-danger)' : val >= 40 ? 'var(--pharma-warning)' : 'var(--pharma-success)'}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detail Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div className="card-pharma p-4">
          <div className="text-sm font-semibold mb-3 text-right" style={{ color: 'var(--pharma-text)' }}>دوز سمیت</div>
          <div className="font-mono text-lg font-bold text-center py-3" style={{ color: 'var(--pharma-cyan)' }}>
            {drug.toxDose}
          </div>
        </div>
        <div className="card-pharma p-4">
          <div className="text-sm font-semibold mb-3 text-right" style={{ color: 'var(--pharma-text)' }}>آنتی‌دوت</div>
          <div className="font-mono text-sm text-right" style={{ color: 'var(--pharma-cyan-light)' }}>{drug.antidote}</div>
        </div>
        <div className="card-pharma p-4">
          <div className="text-sm font-semibold mb-3 text-right" style={{ color: 'var(--pharma-text)' }}>اندام‌های هدف</div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {drug.targetOrgans.map((o) => (
              <span key={o} className="text-xs px-2 py-0.5 rounded"
                style={{ background: 'rgba(var(--pharma-danger-rgb),0.1)', color: 'var(--pharma-danger)', border: '1px solid rgba(var(--pharma-danger-rgb),0.2)' }}>
                {o}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Cross-drug comparison bar chart */}
      <div className="card-pharma p-4">
        <div className="text-sm font-semibold mb-4 text-right" style={{ color: 'var(--pharma-text)' }}>
          مقایسه سمیت کبدی و قلبی — داروهای مرجع
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} margin={{ top: 0, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--pharma-border)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: 'var(--pharma-text-2)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--pharma-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="hepatic" name="سمیت کبدی" fill="var(--pharma-danger)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="cardiac" name="سمیت قلبی" fill="var(--pharma-warning)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
