import { useState } from 'react'

interface Node {
  id: string
  label: string
  type: 'drug' | 'compound' | 'disease' | 'target' | 'publication' | 'trial' | 'side_effect'
  x: number
  y: number
}

interface Edge {
  from: string
  to: string
  label: string
}

const nodeColors: Record<string, string> = {
  drug: '#3C4F72',
  compound: '#5B76A3',
  disease: '#D6304C',
  target: '#FF9B18',
  publication: '#3D8833',
  trial: '#FF9B18',
  side_effect: '#FF8A65',
}

const nodeLabels: Record<string, string> = {
  drug: 'دارو',
  compound: 'ترکیب',
  disease: 'بیماری',
  target: 'هدف مولکولی',
  publication: 'مقاله',
  trial: 'کارآزمایی',
  side_effect: 'عارضه',
}

const nodes: Node[] = [
  { id: 'acetaminophen', label: 'استامینوفن', type: 'drug', x: 380, y: 240 },
  { id: 'cox', label: 'COX Enzymes', type: 'target', x: 230, y: 140 },
  { id: 'prostaglandin', label: 'Prostaglandin', type: 'compound', x: 130, y: 240 },
  { id: 'pain', label: 'درد', type: 'disease', x: 230, y: 340 },
  { id: 'fever', label: 'تب', type: 'disease', x: 380, y: 370 },
  { id: 'napqi', label: 'NAPQI', type: 'compound', x: 530, y: 140 },
  { id: 'liver', label: 'سمیت کبدی', type: 'side_effect', x: 630, y: 240 },
  { id: 'nac', label: 'N-Acetylcysteine', type: 'compound', x: 680, y: 360 },
  { id: 'pub1', label: 'Lancet 2023', type: 'publication', x: 100, y: 140 },
  { id: 'trial1', label: 'NCT-04521283', type: 'trial', x: 530, y: 360 },
  { id: 'warfarin', label: 'وارفارین', type: 'drug', x: 230, y: 460 },
  { id: 'interaction', label: 'تداخل دارویی', type: 'side_effect', x: 130, y: 370 },
]

const edges: Edge[] = [
  { from: 'acetaminophen', to: 'cox', label: 'مهار' },
  { from: 'cox', to: 'prostaglandin', label: 'تولید' },
  { from: 'prostaglandin', to: 'pain', label: 'واسطه' },
  { from: 'prostaglandin', to: 'fever', label: 'واسطه' },
  { from: 'acetaminophen', to: 'napqi', label: 'متابولیت' },
  { from: 'napqi', to: 'liver', label: 'ایجاد' },
  { from: 'nac', to: 'liver', label: 'آنتی‌دوت' },
  { from: 'pub1', to: 'acetaminophen', label: 'مرتبط' },
  { from: 'trial1', to: 'acetaminophen', label: 'مطالعه' },
  { from: 'acetaminophen', to: 'warfarin', label: 'تداخل' },
  { from: 'warfarin', to: 'interaction', label: 'ایجاد' },
]

const nodeDetails: Record<string, { title: string; desc: string; props: { k: string; v: string }[] }> = {
  acetaminophen: {
    title: 'استامینوفن (Acetaminophen)',
    desc: 'مسکن و ضد تب رایج با مصرف گسترده جهانی. فرمول: C₈H₉NO₂',
    props: [
      { k: 'دسته', v: 'مسکن / ضد تب' },
      { k: 'امتیاز AI', v: '82/100' },
      { k: 'سمیت کبدی', v: '78/100' },
      { k: 'وضعیت FDA', v: 'OTC Approved' },
    ],
  },
  cox: {
    title: 'COX Enzymes (هدف مولکولی)',
    desc: 'آنزیم‌های سیکلواکسیژناز (COX-1 و COX-2) - هدف اصلی داروهای ضد التهاب',
    props: [
      { k: 'نوع', v: 'آنزیم' },
      { k: 'مسیر', v: 'سنتز پروستاگلاندین' },
    ],
  },
  pain: {
    title: 'درد (بیماری)',
    desc: 'بیماری هدف اصلی برای درمان با استامینوفن',
    props: [{ k: 'ICD-10', v: 'R52' }, { k: 'اثربخشی', v: '۸۷/۱۰۰' }],
  },
}

export default function KnowledgeGraph() {
  const [selectedNode, setSelectedNode] = useState<string | null>('acetaminophen')
  const [filter, setFilter] = useState<string | null>(null)

  const filteredNodes = filter ? nodes.filter((n) => n.type === filter) : nodes
  const filteredEdges = edges.filter(
    (e) =>
      filteredNodes.some((n) => n.id === e.from) &&
      filteredNodes.some((n) => n.id === e.to)
  )

  const detail = selectedNode ? nodeDetails[selectedNode] : null
  const selNode = selectedNode ? nodes.find((n) => n.id === selectedNode) : null

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-56px)] animate-fade-in">
      {/* Main Graph */}
      <div className="flex-1 min-h-[320px] relative overflow-hidden bg-grid-subtle" style={{ background: 'var(--pharma-bg)' }}>
        {/* Filter toolbar */}
        <div className="absolute top-4 right-4 z-10 flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilter(null)}
            className="text-xs px-2.5 py-1 rounded-full transition-all"
            style={
              !filter
                ? { background: 'rgba(var(--pharma-cyan-rgb),0.2)', color: 'var(--pharma-cyan)', border: '1px solid rgba(var(--pharma-cyan-rgb),0.4)' }
                : { background: 'rgba(13,22,40,0.8)', color: 'var(--pharma-text-muted)', border: '1px solid var(--pharma-border)' }
            }
          >
            همه
          </button>
          {Object.entries(nodeLabels).map(([type, label]) => (
            <button
              key={type}
              onClick={() => setFilter(filter === type ? null : type)}
              className="text-xs px-2.5 py-1 rounded-full transition-all"
              style={
                filter === type
                  ? { background: `${nodeColors[type]}26`, color: nodeColors[type], border: `1px solid ${nodeColors[type]}66` }
                  : { background: 'rgba(13,22,40,0.8)', color: 'var(--pharma-text-muted)', border: '1px solid var(--pharma-border)' }
              }
            >
              {label}
            </button>
          ))}
        </div>

        <svg width="100%" height="100%" viewBox="0 40 800 460" preserveAspectRatio="xMidYMid meet" style={{ direction: 'ltr' }}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="var(--pharma-border)" />
            </marker>
          </defs>

          {/* Edges */}
          {filteredEdges.map((e) => {
            const from = nodes.find((n) => n.id === e.from)
            const to = nodes.find((n) => n.id === e.to)
            if (!from || !to) return null
            const mx = (from.x + to.x) / 2
            const my = (from.y + to.y) / 2
            const isConnected = selectedNode && (e.from === selectedNode || e.to === selectedNode)
            return (
              <g key={`${e.from}-${e.to}`}>
                <line
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={isConnected ? 'rgba(var(--pharma-cyan-rgb),0.4)' : 'var(--pharma-border)'}
                  strokeWidth={isConnected ? 1.5 : 1}
                  markerEnd="url(#arrow)"
                />
                <text x={mx} y={my - 4} fill="var(--pharma-text-muted)" fontSize="10" textAnchor="middle">{e.label}</text>
              </g>
            )
          })}

          {/* Nodes */}
          {filteredNodes.map((n) => {
            const color = nodeColors[n.type]
            const isSelected = n.id === selectedNode
            const isConnected = selectedNode && edges.some(
              (e) => (e.from === selectedNode && e.to === n.id) || (e.to === selectedNode && e.from === n.id)
            )
            const r = n.type === 'drug' ? 22 : 16
            return (
              <g
                key={n.id}
                onClick={() => setSelectedNode(n.id === selectedNode ? null : n.id)}
                style={{ cursor: 'pointer' }}
              >
                {isSelected && (
                  <circle
                    cx={n.x} cy={n.y} r={r + 10}
                    fill="none"
                    stroke={color}
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity={0.5}
                  >
                    <animateTransform attributeName="transform" type="rotate"
                      from={`0 ${n.x} ${n.y}`} to={`360 ${n.x} ${n.y}`} dur="8s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  cx={n.x} cy={n.y} r={r}
                  fill={color}
                  stroke={isSelected || isConnected ? color : '#FFFFFF'}
                  strokeWidth={isSelected ? 2.5 : 1.25}
                  filter={isSelected ? 'url(#glow)' : undefined}
                  opacity={selectedNode && !isSelected && !isConnected ? 0.55 : 0.92}
                />
                <text
                  x={n.x} y={n.y + r + 14}
                  fill={isSelected ? color : 'var(--pharma-text-2)'}
                  fontSize="11"
                  textAnchor="middle"
                  fontFamily="Vazirmatn, sans-serif"
                >
                  {n.label}
                </text>
                {n.type === 'drug' && (
                  <text x={n.x} y={n.y + 4} fill="#FFFFFF" fontSize="10" textAnchor="middle">⬡</text>
                )}
              </g>
            )
          })}
        </svg>

        {/* Legend */}
        <div
          className="absolute bottom-4 right-4 p-3 rounded-xl text-xs"
          style={{ background: 'rgba(13,22,40,0.9)', border: '1px solid var(--pharma-border)' }}
        >
          <div className="font-semibold mb-2 text-right" style={{ color: 'var(--pharma-text-muted)' }}>راهنما</div>
          <div className="space-y-1.5">
            {Object.entries(nodeLabels).map(([type, label]) => (
              <div key={type} className="flex items-center gap-2 justify-end">
                <span style={{ color: 'var(--pharma-text-2)' }}>{label}</span>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: nodeColors[type] }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <div
        className="w-full lg:w-72 max-h-56 lg:max-h-none overflow-y-auto flex flex-col shrink-0 border-t lg:border-t-0 lg:border-r"
        style={{ background: 'var(--pharma-bg-card)', borderColor: 'var(--pharma-border)' }}
      >
        <div
          className="px-4 py-3 text-xs font-semibold"
          style={{ borderBottom: '1px solid var(--pharma-border)', color: 'var(--pharma-text-muted)' }}
        >
          جزئیات موجودیت
        </div>

        {detail && selNode ? (
          <div className="p-4 space-y-4">
            <div>
              <div className="flex items-center gap-2 justify-end mb-2">
                <div className="font-semibold text-sm" style={{ color: 'var(--pharma-text)' }}>{detail.title}</div>
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: nodeColors[selNode.type] }}
                />
              </div>
              <p className="text-xs text-right leading-6" style={{ color: 'var(--pharma-text-2)' }}>{detail.desc}</p>
            </div>

            <div
              className="rounded-lg p-3 space-y-2"
              style={{ background: 'var(--pharma-bg-elevated)', border: '1px solid var(--pharma-border)' }}
            >
              {detail.props.map((p) => (
                <div key={p.k} className="flex items-center justify-between text-xs">
                  <span className="font-mono" style={{ color: 'var(--pharma-cyan)' }}>{p.v}</span>
                  <span style={{ color: 'var(--pharma-text-muted)' }}>{p.k}</span>
                </div>
              ))}
            </div>

            <div>
              <div className="text-xs font-semibold mb-2 text-right" style={{ color: 'var(--pharma-text)' }}>اتصالات</div>
              <div className="space-y-1">
                {edges
                  .filter((e) => e.from === selNode.id || e.to === selNode.id)
                  .map((e, i) => {
                    const otherId = e.from === selNode.id ? e.to : e.from
                    const other = nodes.find((n) => n.id === otherId)
                    if (!other) return null
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedNode(otherId)}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded text-xs hover:bg-[var(--pharma-bg-hover)] transition-colors"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: nodeColors[other.type] }}
                        />
                        <div className="flex items-center gap-1.5 text-right">
                          <span style={{ color: 'var(--pharma-text)' }}>{other.label}</span>
                          <span style={{ color: 'var(--pharma-text-muted)' }}>— {e.label}</span>
                        </div>
                      </button>
                    )
                  })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center" style={{ color: 'var(--pharma-text-muted)' }}>
              <div className="text-3xl mb-3">◉</div>
              <div className="text-xs">یک موجودیت در گراف را انتخاب کنید</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
