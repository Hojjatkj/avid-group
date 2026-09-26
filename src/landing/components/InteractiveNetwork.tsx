import { motion } from 'motion/react'

type Side = 'left' | 'right'

const NODES: { id: string; side: Side; size: number }[] = [
  { id: 'l1', side: 'left', size: 5 },
  { id: 'l2', side: 'left', size: 6 },
  { id: 'l3', side: 'left', size: 4 },
  { id: 'l4', side: 'left', size: 5 },
  { id: 'l5', side: 'left', size: 4 },
  { id: 'l6', side: 'left', size: 3 },
  { id: 'l7', side: 'left', size: 5 },
  { id: 'r1', side: 'right', size: 5 },
  { id: 'r2', side: 'right', size: 6 },
  { id: 'r3', side: 'right', size: 4 },
  { id: 'r4', side: 'right', size: 5 },
  { id: 'r5', side: 'right', size: 4 },
  { id: 'r6', side: 'right', size: 3 },
  { id: 'r7', side: 'right', size: 5 },
]

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}
function smooth(t: number) {
  const x = Math.max(0, Math.min(1, t))
  return x * x * (3 - 2 * x)
}

function sceneTarget(scene: number, i: number, side: Side) {
  const a = (i / NODES.length) * Math.PI * 2
  switch (scene) {
    case 0:
      return { x: 50 + Math.cos(a) * 17, y: 46 + Math.sin(a) * 20 }
    case 1:
      return { x: 70 + (i % 4) * 5.4, y: 34 + Math.floor(i / 4) * 8.2 }
    case 2:
      if (side === 'left') {
        const idx = i % 7
        return { x: 8 + idx * 4.6, y: 36 + Math.sin(idx * 0.9) * 1.4 }
      }
      return { x: 14 + (i % 3) * 10, y: 56 + ((i % 4) - 1.5) * 5.5 }
    case 3:
      return { x: 26 + Math.cos(a) * 6.5, y: 50 + Math.sin(a) * 6.5 }
    case 4:
      return { x: 26 + Math.cos(a) * 19, y: 50 + Math.sin(a) * 17 }
    default:
      return {
        x: 16 + (i % 5) * 8.5 + (i % 2) * 3,
        y: 22 + Math.floor(i / 5) * 18 + (i % 3) * 4,
      }
  }
}

export function InteractiveNetwork({ progress }: { progress: number }) {
  const scene = Math.min(5, Math.floor(progress))
  const local = progress - scene
  const next = Math.min(5, scene + 1)
  const blend = scene === 5 ? 0 : smooth((local - 0.58) / 0.4)
  const idle = progress

  return (
    <div className="avid-interactive-network" aria-hidden="true">
      <svg className="avid-int-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        {NODES.slice(0, 10).map((node, i) => {
          const from = sceneTarget(scene, i, node.side)
          const to = sceneTarget(next, i, node.side)
          const x1 = lerp(from.x, to.x, blend)
          const y1 = lerp(from.y, to.y, blend)
          const hubFrom = sceneTarget(scene, 0, 'left')
          const hubTo = sceneTarget(next, 0, 'left')
          const x2 = lerp(hubFrom.x, hubTo.x, blend)
          const y2 = lerp(hubFrom.y, hubTo.y, blend)
          const opacity = 0.12 + (1 - Math.abs(local - 0.4)) * 0.18
          return (
            <line
              key={`ln-${node.id}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(16,168,193,0.28)"
              strokeWidth={0.18}
              opacity={opacity}
            />
          )
        })}
      </svg>

      {NODES.map((node, i) => {
        const from = sceneTarget(scene, i, node.side)
        const to = sceneTarget(next, i, node.side)
        const x = lerp(from.x, to.x, blend)
        const y = lerp(from.y, to.y, blend)
        const floatX = Math.sin(idle * 1.6 + i * 0.85) * 1.15
        const floatY = Math.cos(idle * 1.35 + i * 1.05) * 0.95
        const scale = 1 + Math.sin(idle * 2 + i) * 0.08 + (scene === 3 ? 0.35 : 0)
        const opacity = 0.55 + Math.sin(idle * 1.5 + i * 0.6) * 0.12

        return (
          <motion.div
            key={node.id}
            className={`avid-int-node ${node.side}`}
            animate={{
              left: `${x + floatX}%`,
              top: `${y + floatY}%`,
              scale,
              opacity,
            }}
            transition={{ type: 'spring', stiffness: 70, damping: 18, mass: 0.5 }}
            style={{ width: node.size * 2, height: node.size * 2 }}
          />
        )
      })}
    </div>
  )
}
