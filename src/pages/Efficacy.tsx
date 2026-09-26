import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { drugs } from '../data/drugs'
import ScoreBar from '../components/ScoreBar'

function CT({ active, payload, label }: any) {
  if (active && payload?.length) return (
    <div className="rounded-lg px-3 py-2 text-xs" style={{ background: 'var(--pharma-bg-active)', border: '1px solid var(--pharma-border)', color: 'var(--pharma-text)' }}>
      <div className="mb-1">{label}</div>
      {payload.map((p: any, i: number) => <div key={i} style={{ color: p.color }}>{p.name}: {p.value}</div>)}
    </div>
  )
  return null
}

const trendData = [
  { month: 'فروردین', score: 80, baseline: 75 },
  { month: 'اردیبهشت', score: 82, baseline: 75 },
  { month: 'خرداد', score: 84, baseline: 76 },
  { month: 'تیر', score: 85, baseline: 76 },
  { month: 'مرداد', score: 87, baseline: 77 },
  { month: 'شهریور', score: 87, baseline: 77 },
]

const conditionData = drugs.slice(0, 5).map((d) => ({ name: d.name, efficacy: d.efficacy, trials: d.trialsCount }))

export default function Efficacy() {
  const [selected, setSelected] = useState(1)
  const drug = drugs.find((d) => d.id === selected) || drugs[0]

  return (
    <div className="p-6 animate-fade-in">
      <div className="card-pharma p-4 mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          {drugs.map((d) => (
            <button key={d.id} onClick={() => setSelected(d.id)}
              className="text-xs px-3 py-1.5 rounded-lg transition-all"
              style={selected === d.id
                ? { background: 'rgba(var(--pharma-success-rgb),0.15)', color: 'var(--pharma-success)', border: '1px solid rgba(var(--pharma-success-rgb),0.4)' }
                : { background: 'var(--pharma-bg-elevated)', color: 'var(--pharma-text-muted)', border: '1px solid var(--pharma-border)' }}>
              {d.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div className="card-pharma p-5 text-center">
          <div className="font-mono text-5xl font-bold mb-2" style={{ color: 'var(--pharma-success)' }}>{drug.efficacy}</div>
          <div className="text-sm font-semibold mb-1" style={{ color: 'var(--pharma-text)' }}>امتیاز اثربخشی</div>
          <div className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>بر اساس {drug.trialsCount} کارآزمایی</div>
        </div>

        <div className="sm:col-span-2 card-pharma p-4">
          <div className="text-sm font-semibold mb-3 text-right" style={{ color: 'var(--pharma-text)' }}>روند اثربخشی ۶ ماهه</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={trendData} margin={{ top: 0, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--pharma-border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'var(--pharma-text-2)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--pharma-text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} domain={[65, 95]} />
              <Tooltip content={<CT />} />
              <Line type="monotone" dataKey="score" name="امتیاز" stroke="var(--pharma-success)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="baseline" name="خط پایه" stroke="var(--pharma-border)" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card-pharma p-4">
          <div className="text-sm font-semibold mb-4 text-right" style={{ color: 'var(--pharma-text)' }}>مقایسه اثربخشی داروها</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={conditionData} margin={{ top: 0, right: 8, bottom: 0, left: -20 }}>
              <XAxis dataKey="name" tick={{ fill: 'var(--pharma-text-2)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--pharma-text-muted)', fontSize: 11 }} axisLine={false} domain={[60, 100]} />
              <Tooltip content={<CT />} />
              <Bar dataKey="efficacy" name="اثربخشی" fill="var(--pharma-success)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-pharma p-4">
          <div className="text-sm font-semibold mb-4 text-right" style={{ color: 'var(--pharma-text)' }}>شاخص‌های اثربخشی</div>
          <div className="space-y-3">
            <ScoreBar value={drug.efficacy} label="اثربخشی کلی" type="success" />
            <ScoreBar value={drug.confidence} label="میزان اطمینان" type="success" />
            <ScoreBar value={drug.aiScore} label="امتیاز AI" type="default" />
          </div>
          <div className="mt-4 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2" style={{ borderTop: '1px solid var(--pharma-border)' }}>
            <div className="text-center p-2 rounded-lg" style={{ background: 'var(--pharma-bg-elevated)' }}>
              <div className="font-mono font-bold" style={{ color: 'var(--pharma-success)' }}>{drug.evidenceCount.toLocaleString()}</div>
              <div className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>مقاله پشتیبان</div>
            </div>
            <div className="text-center p-2 rounded-lg" style={{ background: 'var(--pharma-bg-elevated)' }}>
              <div className="font-mono font-bold" style={{ color: 'var(--pharma-cyan-light)' }}>{drug.trialsCount}</div>
              <div className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>کارآزمایی</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
