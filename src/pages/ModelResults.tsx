import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend } from 'recharts'
import StatusBadge from '../components/StatusBadge'
import RadarAxisTick from '../components/RadarAxisTick'

function CT({ active, payload, label }: any) {
  if (active && payload?.length) return (
    <div className="rounded-lg px-3 py-2 text-xs" style={{ background: 'var(--pharma-bg-active)', border: '1px solid var(--pharma-border)', color: 'var(--pharma-text)' }}>
      <div className="mb-1">{label}</div>
      {payload.map((p: any, i: number) => <div key={i} style={{ color: p.color }}>{p.name}: {p.value}</div>)}
    </div>
  )
  return null
}

const models = [
  { name: 'Avid-LLM v3', type: 'LLM', accuracy: 94, f1: 91, precision: 93, recall: 89, params: '7B', status: 'active' },
  { name: 'EfficacyNet-2', type: 'Deep Learning', accuracy: 91, f1: 88, precision: 90, recall: 86, params: '340M', status: 'active' },
  { name: 'ToxPredict-AI', type: 'Predictive ML', accuracy: 88, f1: 85, precision: 87, recall: 83, params: '45M', status: 'active' },
  { name: 'DrugAssess v2', type: 'Ensemble', accuracy: 92, f1: 90, precision: 91, recall: 89, params: 'Multi', status: 'active' },
  { name: 'RegulatoryAI', type: 'NLP', accuracy: 87, f1: 84, precision: 86, recall: 82, params: '1.3B', status: 'active' },
  { name: 'ClinicalBERT-P', type: 'BERT-based', accuracy: 89, f1: 87, precision: 88, recall: 86, params: '110M', status: 'training' },
]

const barData = models.slice(0, 5).map((m) => ({ name: m.name.split(' ')[0], accuracy: m.accuracy, f1: m.f1 }))

const radarData = [
  { metric: 'دقت', ...Object.fromEntries(models.slice(0, 3).map((m) => [m.name.split(' ')[0], m.accuracy])) },
  { metric: 'F1', ...Object.fromEntries(models.slice(0, 3).map((m) => [m.name.split(' ')[0], m.f1])) },
  { metric: 'Precision', ...Object.fromEntries(models.slice(0, 3).map((m) => [m.name.split(' ')[0], m.precision])) },
  { metric: 'Recall', ...Object.fromEntries(models.slice(0, 3).map((m) => [m.name.split(' ')[0], m.recall])) },
]

const COLORS = ['var(--pharma-cyan)', 'var(--pharma-cyan-light)', 'var(--pharma-purple)']

export default function ModelResults() {
  return (
    <div className="p-6 animate-fade-in">
      {/* Model cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        {models.map((m) => (
          <div key={m.name} className="card-pharma p-4 hover:border-[var(--pharma-border-bright)] transition-colors">
            <div className="flex items-start justify-between mb-3">
              <StatusBadge
                label={m.status === 'active' ? 'فعال' : 'در حال آموزش'}
                color={m.status === 'active' ? 'var(--pharma-success)' : 'var(--pharma-warning)'}
              />
              <div className="text-right">
                <div className="font-semibold text-sm" style={{ color: 'var(--pharma-text)' }}>{m.name}</div>
                <div className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>{m.type} · {m.params}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { label: 'Accuracy', value: m.accuracy },
                { label: 'F1 Score', value: m.f1 },
                { label: 'Precision', value: m.precision },
                { label: 'Recall', value: m.recall },
              ].map((s) => (
                <div key={s.label} className="text-center p-1.5 rounded" style={{ background: 'var(--pharma-bg-elevated)' }}>
                  <div className="font-mono text-sm font-bold" style={{ color: 'var(--pharma-cyan)' }}>{s.value}%</div>
                  <div className="text-xs" style={{ color: 'var(--pharma-text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card-pharma p-4">
          <div className="text-sm font-semibold mb-4 text-right" style={{ color: 'var(--pharma-text)' }}>مقایسه دقت و F1</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 0, right: 8, bottom: 0, left: -20 }}>
              <XAxis dataKey="name" tick={{ fill: 'var(--pharma-text-2)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--pharma-text-muted)', fontSize: 10 }} axisLine={false} domain={[80, 100]} />
              <Tooltip content={<CT />} />
              <Bar dataKey="accuracy" name="Accuracy" fill="var(--pharma-cyan)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="f1" name="F1" fill="var(--pharma-purple)" radius={[3, 3, 0, 0]} />
              <Legend wrapperStyle={{ fontSize: 11, color: 'var(--pharma-text-2)', paddingTop: 8 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-pharma p-4">
          <div className="text-sm font-semibold mb-4 text-right" style={{ color: 'var(--pharma-text)' }}>مقایسه رادار مدل‌ها</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke="var(--pharma-border)" />
              <PolarAngleAxis dataKey="metric" tick={<RadarAxisTick />} />
              {models.slice(0, 3).map((m, i) => (
                <Radar key={m.name} name={m.name.split(' ')[0]} dataKey={m.name.split(' ')[0]}
                  stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.15} strokeWidth={2} />
              ))}
              <Tooltip content={<CT />} />
              <Legend wrapperStyle={{ fontSize: 10, color: 'var(--pharma-text-2)' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
