interface StatusBadgeProps {
  label: string
  color?: string
  dot?: boolean
  size?: 'sm' | 'md'
}

export default function StatusBadge({ label, color = 'var(--pharma-text-2)', dot = true, size = 'sm' }: StatusBadgeProps) {
  const pad = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${pad}`}
      style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
      )}
      {label}
    </span>
  )
}
