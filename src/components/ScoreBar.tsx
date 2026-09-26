interface ScoreBarProps {
  value: number
  label?: string
  showValue?: boolean
  type?: 'default' | 'danger' | 'success' | 'warning'
  height?: number
}

const typeColors: Record<string, string> = {
  default: 'var(--pharma-cyan-light)',
  danger: 'var(--pharma-danger)',
  success: 'var(--pharma-success)',
  warning: 'var(--pharma-warning)',
}

export default function ScoreBar({ value, label, showValue = true, type = 'default', height = 6 }: ScoreBarProps) {
  const color = typeColors[type]
  const autoType = type === 'default'
    ? value >= 70 ? 'danger' : value >= 40 ? 'warning' : 'success'
    : type
  const autoColor = type === 'default' ? typeColors[autoType] : color

  return (
    <div className="flex items-center gap-3">
      {label && <span className="text-xs shrink-0" style={{ color: 'var(--pharma-text-muted)', minWidth: 80 }}>{label}</span>}
      <div className="flex-1 rounded-full overflow-hidden" style={{ background: 'var(--pharma-border)', height }}>
        <div
          className="rounded-full score-bar-fill"
          style={{ width: `${value}%`, height, background: autoColor }}
        />
      </div>
      {showValue && (
        <span className="font-mono text-xs font-medium w-8 text-left" style={{ color: autoColor }}>
          {value}
        </span>
      )}
    </div>
  )
}
