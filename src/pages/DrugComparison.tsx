import { useState } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { drugs, getRegulatoryColor, getRegulatoryLabel, getRiskColor, getRiskLabel } from '../data/drugs'
import StatusBadge from '../components/StatusBadge'
import RadarAxisTick from '../components/RadarAxisTick'

const COLORS = ['var(--pharma-cyan)', 'var(--pharma-cyan-light)', 'var(--pharma-purple)', 'var(--pharma-warning)']

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

export default function DrugComparison() {
  const [selected, setSelected] = useState<number[]>([1, 2, 3])

  const addDrug = (id: number) => {
    if (!selected.includes(id) && selected.length < 4) setSelected([...selected, id])
  }
  const removeDrug = (id: number) => setSelected(selected.filter((s) => s !== id))

  const selectedDrugs = drugs.filter((d) => selected.includes(d.id))

  const barData = [
    { name: 'اثربخشی', ...Object.fromEntries(selectedDrugs.map((d) => [d.name, d.efficacy])) },
    { name: 'سمیت', ...Object.fromEntries(selectedDrugs.map((d) => [d.name, d.toxicity])) },
    { name: 'امتیاز AI', ...Object.fromEntries(selectedDrugs.map((d) => [d.name, d.aiScore])) },
    { name: 'اطمینان', ...Object.fromEntries(selectedDrugs.map((d) => [d.name, d.confidence])) },
  ]

  const radarData = [
    { subject: 'اثربخشی', ...Object.fromEntries(selectedDrugs.map((d) => [d.name, d.efficacy])) },
    { subject: 'امتیاز AI', ...Object.fromEntries(selectedDrugs.map((d) => [d.name, d.aiScore])) },
    { subject: 'سمیت کبدی', ...Object.fromEntries(selectedDrugs.map((d) => [d.name, d.hepatic])) },
    { subject: 'سمیت قلبی', ...Object.fromEntries(selectedDrugs.map((d) => [d.name, d.cardiac])) },
    { subject: 'اطمینان', ...Object.fromEntries(selectedDrugs.map((d) => [d.name, d.confidence])) },
    { subject: 'سمیت کلیوی', ...Object.fromEntries(selectedDrugs.map((d) => [d.name, d.renal])) },
  ]

  return (
    <div className="p-6 animate-fade-in">
      {/* Drug Selector */}
      <div className="card-pharma p-4 mb-5">
        <div className="text-sm font-semibold mb-3 text-right" style={{ color: 'var(--pharma-text)' }}>
          انتخاب داروها برای مقایسه (حداکثر ۴ دارو)
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          {drugs.map((d) => (
            <button
              key={d.id}
              onClick={() => selected.includes(d.id) ? removeDrug(d.id) : addDrug(d.id)}
              className="text-xs px-3 py-1.5 rounded-lg transition-all"
              style={
                selected.includes(d.id)
                  ? {
                      background: `${COLORS[selected.indexOf(d.id)]}20`,
                      color: COLORS[selected.indexOf(d.id)],
                      border: `1px solid ${COLORS[selected.indexOf(d.id)]}50`,
                    }
                  : {
                      background: 'var(--pharma-bg-elevated)',
                      color: 'var(--pharma-text-muted)',
                      border: '1px solid var(--pharma-border)',
                    }
              }
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {selectedDrugs.length > 0 && (
        <>
          {/* Comparison Table */}
          <div className="card-pharma overflow-x-auto mb-5">
            <table className="w-full" style={{ minWidth: 200 + selectedDrugs.length * 140 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--pharma-border)', background: 'var(--pharma-bg-elevated)' }}>
                  <th className="px-4 py-3 text-right text-xs font-semibold" style={{ color: 'var(--pharma-text-muted)' }}>شاخص</th>
                  {selectedDrugs.map((d, i) => (
                    <th key={d.id} className="px-4 py-3 text-center text-xs font-semibold" style={{ color: COLORS[i] }}>
                      {d.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'نام انگلیسی', key: 'nameEn', mono: true },
                  { label: 'فرمول', key: 'formula', mono: true },
                  { label: 'دسته', key: 'category', mono: false },
                  { label: 'اثربخشی', key: 'efficacy', bar: true },
                  { label: 'سمیت', key: 'toxicity', bar: true },
                  { label: 'امتیاز AI', key: 'aiScore', bar: true },
                  { label: 'اطمینان', key: 'confidence', bar: true },
                  { label: 'وضعیت رگولاتوری', key: 'regulatory', badge: true },
                  { label: 'سطح خطر', key: 'riskLevel', riskBadge: true },
                  { label: 'سال تأیید', key: 'approvalYear', mono: true },
                ].map((row) => (
                  <tr
                    key={row.key}
                    className="hover:bg-[var(--pharma-bg-hover)] transition-colors"
                    style={{ borderBottom: '1px solid var(--pharma-border)' }}
                  >
                    <td className="px-4 py-3 text-right text-xs" style={{ color: 'var(--pharma-text-muted)' }}>{row.label}</td>
                    {selectedDrugs.map((d, i) => (
                      <td key={d.id} className="px-4 py-3 text-center">
                        {(row as any).bar ? (
                          <div className="flex items-center gap-2 justify-center">
                            <div className="w-20 h-1.5 rounded-full" style={{ background: 'var(--pharma-border)' }}>
                              <div
                                className="h-1.5 rounded-full"
                                style={{ width: `${(d as any)[row.key]}%`, background: COLORS[i] }}
                              />
                            </div>
                            <span className="font-mono text-xs" style={{ color: COLORS[i] }}>{(d as any)[row.key]}</span>
                          </div>
                        ) : (row as any).badge ? (
                          <div className="flex justify-center">
                            <StatusBadge label={getRegulatoryLabel((d as any)[row.key])} color={getRegulatoryColor((d as any)[row.key])} />
                          </div>
                        ) : (row as any).riskBadge ? (
                          <div className="flex justify-center">
                            <StatusBadge label={getRiskLabel((d as any)[row.key])} color={getRiskColor((d as any)[row.key])} />
                          </div>
                        ) : (
                          <span
                            className={`text-xs ${row.mono ? 'font-mono' : ''}`}
                            style={{ color: 'var(--pharma-text-2)' }}
                          >
                            {(d as any)[row.key]}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Charts */}
          <div className="comparison-charts-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card-pharma comparison-chart-card p-4">
              <div className="text-sm font-semibold mb-4 text-right" style={{ color: 'var(--pharma-text)' }}>مقایسه شاخص‌ها</div>
              <ResponsiveContainer width="100%" height={270}>
                <BarChart data={barData} margin={{ top: 4, right: 12, bottom: 4, left: 34 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--pharma-border)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: 'var(--pharma-text-muted)', fontSize: 11 }} axisLine={false} domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" tick={{ fill: 'var(--pharma-text-2)', fontSize: 11, dx: -8 }} axisLine={false} tickLine={false} width={122} tickMargin={14} />
                  <Tooltip content={<CustomTooltip />} />
                  {selectedDrugs.map((d, i) => (
                    <Bar key={d.id} dataKey={d.name} fill={COLORS[i]} radius={[0, 3, 3, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
              <div className="comparison-chart-legend" dir="rtl">
                {selectedDrugs.map((d, i) => (
                  <div key={d.id} className="comparison-chart-legend-item">
                    <span className="comparison-chart-legend-dot" style={{ background: COLORS[i] }} />
                    <span>{d.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-pharma comparison-chart-card p-4">
              <div className="text-sm font-semibold mb-4 text-right" style={{ color: 'var(--pharma-text)' }}>نمودار رادار مقایسه‌ای</div>
              <ResponsiveContainer width="100%" height={270}>
                <RadarChart data={radarData} margin={{ top: 24, right: 52, bottom: 12, left: 52 }}>
                  <PolarGrid stroke="var(--pharma-border)" />
                  <PolarAngleAxis dataKey="subject" tick={<RadarAxisTick />} />
                  {selectedDrugs.map((d, i) => (
                    <Radar
                      key={d.id}
                      name={d.name}
                      dataKey={d.name}
                      stroke={COLORS[i]}
                      fill={COLORS[i]}
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  ))}
                  <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
              </ResponsiveContainer>
              <div className="comparison-chart-legend" dir="rtl">
                {selectedDrugs.map((d, i) => (
                  <div key={d.id} className="comparison-chart-legend-item">
                    <span className="comparison-chart-legend-dot" style={{ background: COLORS[i] }} />
                    <span>{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
