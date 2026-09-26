import { motion } from 'motion/react'

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}
function smooth(t: number) {
  const x = Math.max(0, Math.min(1, t))
  return x * x * (3 - 2 * x)
}

const LIGHTS = [
  { x: 50, y: 46, strength: 1 },
  { x: 78, y: 48, strength: 0.92 },
  { x: 22, y: 46, strength: 0.88 },
  { x: 28, y: 50, strength: 1 },
  { x: 28, y: 50, strength: 0.86 },
  { x: 30, y: 48, strength: 0.9 },
]

export function SceneLighting({ progress }: { progress: number }) {
  const scene = Math.min(5, Math.floor(progress))
  const local = progress - scene
  const next = Math.min(5, scene + 1)
  const blend = scene === 5 ? 0 : smooth((local - 0.55) / 0.42)
  const from = LIGHTS[scene]
  const to = LIGHTS[next]
  const x = lerp(from.x, to.x, blend)
  const y = lerp(from.y, to.y, blend)
  const strength = lerp(from.strength, to.strength, blend)
  const pulse = 0.88 + Math.sin(progress * 2.2) * 0.08
  const videoOn = progress < 1.2 ? 1 : Math.max(0.35, 1 - (progress - 1.2) * 0.45)

  return (
    <div
      className="avid-light-rig"
      aria-hidden="true"
      style={
        {
          '--lx': `${x}%`,
          '--ly': `${y}%`,
          '--ls': String(strength * pulse),
        } as React.CSSProperties
      }
    >
      <div className="avid-light-vignette" style={{ opacity: 0.55 + videoOn * 0.25 }} />
      <motion.div
        className="avid-light-key"
        animate={{ left: `${x}%`, top: `${y}%`, opacity: 0.7 * strength * pulse * (0.55 + videoOn * 0.45) }}
        transition={{ type: 'spring', stiffness: 40, damping: 22 }}
      />
      <motion.div
        className="avid-light-core"
        animate={{ left: `${x}%`, top: `${y}%`, opacity: 0.85 * strength * pulse }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      />
      <motion.div
        className="avid-light-shaft"
        animate={{ left: `${x}%`, top: `${y}%`, opacity: 0.35 * strength * videoOn }}
        transition={{ type: 'spring', stiffness: 36, damping: 24 }}
      />
    </div>
  )
}
