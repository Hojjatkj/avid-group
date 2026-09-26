interface RadarAxisTickProps {
  cx?: number
  cy?: number
  x?: number
  y?: number
  payload?: { value: string }
}

/** Keeps radar labels outside the polygon instead of letting them drift into it. */
export default function RadarAxisTick({ cx = 0, cy = 0, x = 0, y = 0, payload }: RadarAxisTickProps) {
  const dx = x - cx
  const dy = y - cy
  const length = Math.sqrt(dx * dx + dy * dy) || 1
  const offset = 13
  const tx = x + (dx / length) * offset
  const ty = y + (dy / length) * offset
  const absX = Math.abs(dx / length)
  const textAnchor = absX < 0.28 ? 'middle' : dx > 0 ? 'start' : 'end'
  const verticalOffset = Math.abs(dy / length) > 0.75 ? (dy < 0 ? -2 : 5) : 4

  return (
    <text
      x={tx}
      y={ty}
      dy={verticalOffset}
      textAnchor={textAnchor}
      fill="var(--pharma-text-2)"
      fontSize={11}
    >
      {payload?.value}
    </text>
  )
}
