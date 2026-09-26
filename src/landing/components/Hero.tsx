import React, { useEffect, useMemo, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { InteractiveNetwork } from './InteractiveNetwork'
import { SceneLighting } from './SceneLighting'

const DRUGS = [
  { en: 'Ibuprofen', fa: 'ایبوپروفن', score: 88, color: 'blue' },
  { en: 'Paracetamol', fa: 'استامینوفن', score: 91, color: 'cyan' },
  { en: 'Naproxen', fa: 'ناپروکسن', score: 84, color: 'indigo' },
]

const GRAPH_NODES = [
  { id: 'paracetamol', label: 'استامینوفن', type: 'drug', x: 50, y: 50 },
  { id: 'pain', label: 'درد', type: 'disease', x: 25, y: 31 },
  { id: 'fever', label: 'تب', type: 'disease', x: 23, y: 67 },
  { id: 'cox', label: 'COX', type: 'target', x: 74, y: 27 },
  { id: 'pge2', label: 'PGE2', type: 'target', x: 78, y: 68 },
  { id: 'study', label: 'Clinical Study', type: 'study', x: 50, y: 16 },
  { id: 'adverse', label: 'عوارض', type: 'adverse', x: 50, y: 84 },
  { id: 'liver', label: 'کبد', type: 'organ', x: 12, y: 49 },
  { id: 'nac', label: 'NAC', type: 'compound', x: 88, y: 49 },
  { id: 'metabolite', label: 'NAPQI', type: 'compound', x: 35, y: 16 },
  { id: 'dose', label: 'Dose', type: 'study', x: 65, y: 84 },
]

const GRAPH_EDGES = [
  ['paracetamol', 'pain'], ['paracetamol', 'fever'], ['paracetamol', 'cox'], ['paracetamol', 'pge2'],
  ['paracetamol', 'study'], ['paracetamol', 'adverse'], ['paracetamol', 'liver'], ['paracetamol', 'nac'],
  ['pain', 'cox'], ['fever', 'pge2'], ['cox', 'pge2'], ['study', 'metabolite'], ['adverse', 'dose'],
  ['liver', 'metabolite'], ['nac', 'metabolite'], ['pge2', 'dose'],
]

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const smoothstep = (v: number) => {
  const t = clamp01(v)
  return t * t * (3 - 2 * t)
}

// Every visual scene runs on its own "phase" (progress - sceneIndex), which is
// 0 exactly when the scene is centered in the viewport. This shared envelope
// turns that phase into an "openness" curve that rises to 1 just BEFORE the
// scene is centered, holds at 1 while centered, and falls back to 0 shortly
// AFTER — so each visual is fully assembled right when it's front-and-center,
// and is visibly closed/collapsed again by the time it fades into the next
// scene, instead of finishing its opening animation after it's already gone.
function sceneEnvelope(
  phase: number,
  riseStart = -0.5, riseEnd = -0.08, fallStart = 0.14, fallEnd = 0.68,
) {
  const openingProgress = smoothstep((phase - riseStart) / (riseEnd - riseStart))
  const closingProgress = smoothstep((phase - fallStart) / (fallEnd - fallStart))
  const openness = openingProgress * (1 - closingProgress)
  return { openness, openingProgress, closingProgress }
}

// Story transitions no longer consume equal scroll distance. The very first
// transition (intro -> scene 1) keeps its original, full-length share so
// that opening scroll feel is untouched; every later transition (1->2 ... 5->6)
// gets 3/4 of that share, cutting the "dead" scroll between scenes by about a
// quarter. Paired with the matching reduction in .avid-hero-story's height
// (see index.css), this preserves the first segment's actual scroll distance
// in vh while shortening the rest.
const FIRST_SEGMENT_WEIGHT = 1
const LATER_SEGMENT_WEIGHT = 0.75

function scrollFractionToProgress(fraction: number, totalScenes: number) {
  const weights = Array.from({ length: totalScenes }, (_, i) => (i === 0 ? FIRST_SEGMENT_WEIGHT : LATER_SEGMENT_WEIGHT))
  const weightTotal = weights.reduce((a, b) => a + b, 0)
  const target = fraction * weightTotal
  let cumulative = 0
  for (let i = 0; i < weights.length; i++) {
    const next = cumulative + weights[i]
    if (target <= next || i === weights.length - 1) {
      const segFrac = (target - cumulative) / weights[i]
      return i + Math.min(1, Math.max(0, segFrac))
    }
    cumulative = next
  }
  return totalScenes
}

function useStoryProgress(totalScenes: number) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    let frame = 0
    let running = false

    const update = () => {
      const el = document.getElementById('avid-hero-story')
      if (el) {
        const rect = el.getBoundingClientRect()
        const travel = Math.max(1, rect.height - window.innerHeight)
        const fraction = Math.min(1, Math.max(0, -rect.top / travel))
        setProgress(scrollFractionToProgress(fraction, totalScenes))
      }
      if (running) frame = requestAnimationFrame(update)
    }

    const start = () => {
      if (running) return
      running = true
      frame = requestAnimationFrame(update)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    const el = document.getElementById('avid-hero-story')
    if (!el || typeof IntersectionObserver === 'undefined') {
      // Fallback: no observer support, just run continuously as before.
      start()
      return () => stop()
    }

    // Only keep the rAF scroll-tracking loop alive while the hero story
    // section is actually visible. This avoids burning main-thread time
    // (and forcing repeated framer-motion re-renders of CardStack,
    // SearchComparison, GlassCore, ToxicityField, KnowledgeGraph and the
    // 14-node InteractiveNetwork) once the user has scrolled well past it.
    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting)
        if (isVisible) start()
        else stop()
      },
      { rootMargin: '20% 0px 20% 0px', threshold: 0 },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      stop()
    }
  }, [totalScenes])
  return progress
}

function SceneText({ title, body, active }: { title: string; body: string; active: boolean }) {
  return (
    <motion.div
      className="avid-scene-copy"
      // y uses calc(-50% + Npx): the -50% keeps the block vertically centered
      // (matching the CSS `top:50%` this class is positioned with), while the
      // +Npx part still does the slide-up-into-place animation. Passing a
      // plain px number here (like before) drops the -50% centering entirely,
      // because Framer writes its own `transform` once it manages y/scale/
      // rotateX on an element, discarding the CSS translateY(-50%) — that's
      // what was pinning the text toward the bottom of the viewport.
      animate={{
        opacity: active ? 1 : 0,
        y: active ? 'calc(-50% + 0px)' : 'calc(-50% + 86px)',
        scale: active ? 1 : 0.92,
        rotateX: active ? 0 : -34,
      }}
      transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: active ? 'auto' : 'none' }}
    >
      <h2>{title}</h2>
      <p>{body}</p>
    </motion.div>
  )
}

function CardStack({ phase }: { phase: number }) {
  const cards = [
    { title: 'جستجوی داروها', meta: 'DRUG EXPLORER', icon: '⌕', detail: 'کشف دارو بر اساس نام، بیماری یا داده‌های مرتبط' },
    { title: 'پروفایل کامل دارو', meta: 'DRUG PROFILE', icon: '◌', detail: 'نمایش ساختار، کاربردها، شواهد و مشخصات دارویی' },
    { title: 'ویژگی‌های دارویی', meta: 'PROPERTIES', icon: '✦', detail: 'بررسی ویژگی‌ها، اهداف و شاخص‌های کلیدی' },
    { title: 'ارتباطات دارو', meta: 'RELATIONSHIPS', icon: '⌘', detail: 'بیماری‌ها، اهداف مولکولی و مطالعات مرتبط' },
  ]
  return (
    <div className="avid-card-stack" aria-label="ویژگی‌های هوشمندی دارویی">
      {cards.map((card, index) => {
        const z = cards.length - index
        const { openness: spread } = sceneEnvelope(phase)
        const x = index * 18 * spread
        const y = index * -22 * spread
        const rotate = (index - 1.5) * 4.5 * spread
        const depth = index * -24
        return (
          <motion.div
            key={card.title}
            className="avid-feature-card"
            style={{ zIndex: z }}
            animate={{
              x: x + Math.sin(phase * 4 + index) * 4,
              y: y + Math.cos(phase * 3.5 + index) * 3,
              rotate: rotate + Math.sin(phase * 2.2 + index) * 1.2,
              z: depth,
              scale: 0.9 + spread * 0.1,
              opacity: 0.62 + spread * 0.38,
            }}
            transition={{ type: 'spring', stiffness: 70, damping: 20, mass: 0.6 }}
          >
            <span className="avid-card-icon">{card.icon}</span>
            <div>
              <small>{card.meta}</small>
              <strong>{card.title}</strong>
              <p>{card.detail}</p>
            </div>
            <span className="avid-card-index">0{index + 1}</span>
          </motion.div>
        )
      })}
    </div>
  )
}

function SearchComparison({ phase }: { phase: number }) {
  // All three result cards share one anchor point in CSS (see
  // .avid-result-space .avid-drug-orb) and this component's Motion x/y is
  // the ONLY thing that moves them from there — no flexbox spacing fighting
  // it anymore. That's what makes a genuine open/close story possible: at
  // openT = 0 they sit stacked on the anchor (a real deck), and as openT
  // rises toward 1 they fan out into the three legible result slots.
  //
  // Closing used to run all the way to fallEnd = 0.78, by which point the
  // whole scene (governed separately, by distance from the scene index) had
  // already faded to ~25% opacity — so the re-stacking motion was mostly
  // invisible, swallowed by the outer fade before it finished. Finishing the
  // close earlier (0.46 instead of 0.78) means it completes while the scene
  // is still clearly legible, and the deck then sits fully closed and
  // visible for a stretch before the outer fade takes over — giving the
  // "closed" state, on both sides, a real moment to register instead of
  // being a blink.
  // Cards no longer all move in perfect lockstep — each one's envelope is
  // read from a slightly shifted phase (CARD_STAGGER per index), so they
  // fan open and re-stack in a visible sequence (card 1, then 2, then 3)
  // instead of snapping as one block. That sequencing is what makes the
  // deck read as "orderly" rather than a single opacity/scale fade.
  const CARD_STAGGER = 0.045
  return (
    <div className="avid-search-stage">
      <motion.div className="avid-search-box" animate={{ scale: 1 + Math.sin(phase * 3) * 0.006 }}>
        <span>⌕</span>
        <div>
          <small>DRUG EXPLORER</small>
          <strong>داروهای ضد درد را پیدا کن</strong>
        </div>
        <kbd>↵</kbd>
      </motion.div>
      <div className="avid-result-space">
        {DRUGS.map((drug, index) => {
          // Each card lives at the exact same anchor point (see
          // .avid-result-space .avid-drug-orb in CSS: centered via
          // left/top + negative margin, no flex spacing). Motion's x/y then
          // do 100% of the positioning, so there's a single source of truth
          // and no fight between CSS layout and scroll-driven transforms.
          //
          // Closed (openT = 0): cards sit almost exactly on top of each
          // other — a genuine stacked deck, offset by a few px per index so
          // the edges peek out, with a gentle fan rotation and dimmed
          // opacity so it still reads as "there" rather than invisible.
          // Open (openT = 1): they fan out into the three legible result
          // slots, same as before.
          const { openness: openT } = sceneEnvelope(phase - index * CARD_STAGGER, -0.92, -0.5, 0.16, 0.46)
          const stackX = (index - 1) * 16
          const stackY = index * -13
          const stackRotate = (index - 1) * 9
          const openX = (index - 1) * 198
          const openY = 22 + index * 12
          return (
            <motion.div
              key={drug.en}
              className={`avid-drug-orb ${drug.color}`}
              style={{
                zIndex: DRUGS.length - index,
                pointerEvents: openT > 0.6 ? 'auto' : 'none',
              }}
              animate={{
                opacity: 0.55 + openT * 0.45,
                x: stackX * (1 - openT) + openX * openT + Math.sin(phase * 5 + index * 1.7) * openT * 5,
                y: stackY * (1 - openT) + openY * openT + Math.cos(phase * 5 + index * 1.7) * openT * 5,
                scale: 0.72 + openT * 0.28 * (1 + Math.sin(phase * 5 + index * 1.7) * openT * 0.012),
                rotateY: (index - 1) * 8 * openT,
                rotateZ: stackRotate * (1 - openT) + ((index - 1) * 1.8 * openT + Math.sin(phase * 4 + index) * openT * 1.4),
                z: (1 - openT) * (index - 1) * -24 + index * (1 - openT) * -6,
              }}
              whileHover={{
                scale: (0.62 + openT * 0.38) * 1.1,
                y: -12,
                z: 24,
                rotate: [0, -2.4, 2.4, 0],
                transition: { rotate: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' } },
              }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              // The little hover shake only repeats for the `rotate` keyframes;
              // everything else (scale/y/z) settles normally on hover-in.
              whileTap={{ scale: (0.62 + openT * 0.38) * 1.04 }}
            >
              <span className="drug-orb-ring" />
              <small>{drug.en}</small>
              <strong>{drug.fa}</strong>
              <em>{drug.score}% relevance</em>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function GlassCore({ phase }: { phase: number }) {
  // Explicit timeline gates (all reached before the scene is centered at
  // phase 0), instead of deriving "searching" from the overlap of two
  // independent curves — that overlap was only ~0.02 of phase wide, which
  // scrolls past in an instant and barely reads. Each stage now gets its
  // own real width: typing settles, THEN a clearly-held "searching" beat,
  // THEN the answer reveals — fully assembled before phase 0, as requested,
  // but no longer as an abrupt last-second snap.
  const TYPING_DONE = -0.4
  const SEARCH_END = -0.2
  const ANSWER_DONE = -0.02

  const { openingProgress: inputT, closingProgress: outputT } = sceneEnvelope(phase, -0.6, TYPING_DONE, 0.18, 0.72)
  // Rises quickly right after typing settles, holds through the searching
  // window, then eases back out as the answer takes over.
  const { openness: searchingT } = sceneEnvelope(phase, TYPING_DONE, TYPING_DONE + 0.05, SEARCH_END - 0.05, SEARCH_END)
  const { openness: answerT } = sceneEnvelope(phase, SEARCH_END, ANSWER_DONE, 0.2, 0.7)
  const question = 'آیا استامینوفن برای این بیمار انتخاب مناسبی است؟'

  return (
    <div className="avid-ai-chat-stage">
      <motion.div
        className="avid-ai-chat-bubble"
        animate={{
          opacity: 0.2 + inputT * 0.8,
          x: -28 + inputT * 28 - outputT * 22,
          y: 8 - inputT * 8,
          scale: 0.94 + inputT * 0.06,
        }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="avid-ai-chat-avatar" aria-hidden="true">
          <span>✦</span>
        </div>
        <div className="avid-ai-chat-message">
          <small>YOUR QUESTION</small>
          <strong>
            {question}
            <i className="avid-ai-caret" aria-hidden="true" />
          </strong>
          <motion.div
            className="avid-ai-searching"
            animate={{ opacity: searchingT, y: (1 - searchingT) * 4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ pointerEvents: 'none' }}
            aria-hidden="true"
          >
            <span className="avid-ai-searching-dots"><i /><i /><i /></span>
            <span>در حال جستجو…</span>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="avid-ai-dashboard"
        animate={{
          opacity: 0.14 + answerT * 0.86,
          x: 58 - answerT * 58 + outputT * 34,
          y: 42 - answerT * 42 + outputT * 18,
          scale: 0.88 + answerT * 0.12,
          rotate: 2.5 - answerT * 2.5,
        }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="avid-ai-dashboard-head">
          <div>
            <small>AI ANALYSIS</small>
            <strong>نتیجه تحلیل هوشمند</strong>
          </div>
          <span className="avid-ai-pulse-dot" />
        </div>

        <div className="avid-ai-dashboard-score">
          <div>
            <span>CONFIDENCE</span>
            <strong>94%</strong>
          </div>
          <div className="avid-ai-score-ring" aria-hidden="true">
            <svg viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="18" className="score-track" />
              <circle cx="22" cy="22" r="18" className="score-progress" />
            </svg>
          </div>
        </div>

        <div className="avid-ai-dashboard-bars">
          {[
            ['Efficacy', 92],
            ['Evidence', 88],
            ['Safety', 76],
          ].map(([label, value], barIndex) => {
            // Previously the fill jumped straight from the scroll-linked
            // answerT value with no transition (a raw scrub, felt like a
            // snap rather than a fill), and the number label only appeared
            // once answerT crossed 0.72 — an abrupt pop from 0% to the full
            // value. Now each bar eases in with its own gentle tween and a
            // small per-row stagger, and the number counts up in step with
            // the fill instead of jumping.
            const filled = Math.round(answerT * Number(value))
            return (
              <div className="avid-ai-bar-row" key={label}>
                <span className="avid-ai-bar-label">{label}</span>
                <div className="avid-ai-bar-track">
                  <motion.i
                    className="avid-ai-bar-fill"
                    animate={{ width: `${answerT * Number(value)}%` }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: barIndex * 0.06 }}
                  />
                </div>
                <b>{filled}%</b>
              </div>
            )
          })}
        </div>

        <div className="avid-ai-dashboard-answer">
          <span>AI INSIGHT</span>
          <p>شواهد موجود، اثربخشی مناسب و ریسک قابل بررسی است.</p>
        </div>
      </motion.div>

      <div className="avid-ai-stream" aria-hidden="true">
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.i
            key={i}
            style={{ '--i': i } as React.CSSProperties}
            animate={{
              opacity: [0.15, 0.75, 0.15],
              x: [0, 26, 0],
              y: [0, -10, 0],
            }}
            transition={{ duration: 2.2 + i * 0.18, repeat: Infinity, ease: 'easeInOut', delay: i * 0.14 }}
          />
        ))}
      </div>
    </div>
  )
}

function ToxicityField({ phase }: { phase: number }) {
  const { openness: focusT } = sceneEnvelope(phase)
  return (
    <div className="avid-tox-stage">
      <div className="tox-background-drugs">
        <span>Ibuprofen</span><span>Naproxen</span>
      </div>
      <motion.div className="tox-focus-drug" animate={{ scale: 0.82 + focusT * 0.18, y: (1 - focusT) * 45 }}>
        <div className="tox-drug-core">C₈H₉NO₂</div>
        <strong>Paracetamol</strong>
        <small>استامینوفن · Focus Drug</small>
      </motion.div>
      <motion.div className="tox-halo" animate={{ scale: 0.72 + focusT * 0.35, opacity: 0.35 + focusT * 0.35 }} />
      <div className="tox-particles" aria-hidden="true">
        {Array.from({ length: 22 }).map((_, i) => (
          <motion.i key={i} style={{ '--i': i } as React.CSSProperties} animate={{ x: Math.sin(phase * 2 + i) * 24, y: Math.cos(phase * 2.4 + i) * 22, opacity: 0.3 + focusT * 0.7 }} />
        ))}
      </div>
      <div className="tox-labels">
        <span>Toxicity Risk</span><span>Potential Adverse Effects</span><span>Toxicity Patterns</span>
      </div>
    </div>
  )
}

function KnowledgeGraph({ phase, onLoginClick }: { phase: number; onLoginClick: () => void }) {
  const [selected, setSelected] = useState('paracetamol')
  const { openness: expansion, closingProgress: pullback } = sceneEnvelope(phase, -0.5, -0.1, 0.16, 0.6)
  const byId = useMemo(() => Object.fromEntries(GRAPH_NODES.map(n => [n.id, n])), [])
  return (
    <div className="avid-graph-stage" style={{ '--graph-scale': String(1 + pullback * 0.22) } as React.CSSProperties}>
      <svg className="avid-graph-svg" viewBox="0 0 100 100" aria-label="گراف دانش دارویی">
        {GRAPH_EDGES.map(([a, b], i) => {
          const na = byId[a], nb = byId[b]
          return (
            <g key={`${a}-${b}`} style={{ opacity: expansion * (0.35 + (i % 3) * 0.18) }}>
              <line x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} className="graph-edge" />
              {/* Halo rides the same path just behind the core dot, giving
                  the moving particle a soft neon bloom instead of reading
                  as a plain small dot. */}
              <circle r="1.5" className="graph-flow-halo">
                <animateMotion dur={`${2.4 + (i % 4) * 0.5}s`} repeatCount="indefinite" path={`M ${na.x} ${na.y} L ${nb.x} ${nb.y}`} />
              </circle>
              <circle r="1.1" className="graph-flow">
                <animateMotion dur={`${2.4 + (i % 4) * 0.5}s`} repeatCount="indefinite" path={`M ${na.x} ${na.y} L ${nb.x} ${nb.y}`} />
              </circle>
            </g>
          )
        })}
      </svg>
      <div className="avid-graph-nodes">
        {GRAPH_NODES.map(node => {
          const isCore = node.id === 'paracetamol'
          const selectedNode = selected === node.id
          return (
            <button
              key={node.id}
              className={`graph-node ${node.type} ${isCore ? 'core' : ''} ${selectedNode ? 'selected' : ''}`}
              style={{ left: `${50 + (node.x - 50) * (0.42 + expansion * 0.58)}%`, top: `${50 + (node.y - 50) * (0.42 + expansion * 0.58)}%` }}
              onClick={() => setSelected(node.id)}
              aria-label={`نود: ${node.label}، نوع: ${node.type}`}
              aria-pressed={selectedNode}
            >
              <span className="graph-node-dot" />
              <span className="graph-node-label">{node.label}</span>
            </button>
          )
        })}
      </div>
      {selected !== 'paracetamol' && (
        <motion.div className="graph-popover" role="status" aria-live="polite" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <small>{byId[selected as keyof typeof byId]?.type?.toUpperCase()}</small>
          <strong>{byId[selected as keyof typeof byId]?.label}</strong>
          <span>برای مشاهده رابطه‌های مرتبط، روی Nodeهای دیگر کلیک کنید.</span>
        </motion.div>
      )}
      <motion.button
        type="button"
        className="graph-cta"
        onClick={onLoginClick}
        whileHover={{ y: -3, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>ورود / ثبت‌نام</span>
        <b>→</b>
      </motion.button>
    </div>
  )
}

export const Hero = ({ onLoginClick }: { onLoginClick: () => void }) => {
  const progress = useStoryProgress(6)
  const mx = useMotionValue(0), my = useMotionValue(0)
  const smx = useSpring(mx, { stiffness: 80, damping: 20 })
  const smy = useSpring(my, { stiffness: 80, damping: 20 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      mx.set(x * 13); my.set(y * 10)
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [mx, my])

  const sceneData = [
    { title: '', body: '' },
    { title: 'هوشمندی دارویی', body: 'اطلاعات دارویی را جستجو کنید، بررسی کنید و ارتباطات آن را کشف کنید.' },
    { title: 'جستجو و مقایسه داروها', body: 'داروهای مورد نیاز را پیدا کنید، نتایج را بررسی کنید و آن‌ها را در یک نگاه مقایسه کنید.' },
    { title: 'تحلیل هوشمند با هوش مصنوعی', body: 'داده‌های دارویی را با کمک هوش مصنوعی تحلیل کنید و به بینش‌های دقیق‌تر برسید.' },
    { title: 'پیش‌بینی سمیت دارویی', body: 'ریسک‌ها و الگوهای مرتبط با سمیت دارو را پیش از تصمیم‌گیری بررسی کنید.' },
    { title: 'گراف دانش دارویی', body: 'ارتباط میان داده‌های دارویی را کشف و روابط پنهان میان آن‌ها را بررسی کنید.' },
  ]

  const scenePalette = [
    // Distinct but restrained medical pastels: the navy/cyan brand accents
    // stay constant while each scroll gets its own atmosphere.
    { bg: '#f4eee3', accent: '#102f50' }, // warm ivory
    { bg: '#e4f3ee', accent: '#0b7188' }, // mint medical
    { bg: '#e5effb', accent: '#173f68' }, // powder blue
    { bg: '#eeeafb', accent: '#394a78' }, // soft lavender
    { bg: '#f5e9e9', accent: '#6b4350' }, // dusty rose
    { bg: '#e7edf8', accent: '#102f50' }, // periwinkle / navy
  ]

  const sceneIndex = Math.min(5, Math.floor(progress))
  const palette = scenePalette[sceneIndex]

  const renderScene = (i: number) => {
    // Scene 0 intro lives outside the 3D scene-layer so it can share
    // the same stacking context as the video (lighting / blend).
    if (i === 0) return null

    const relative = i - progress
    const distance = Math.abs(relative)
    const active = distance < 0.7
    const clamped = Math.max(-1.1, Math.min(1.1, relative))

    const y = clamped * 94
    const z = clamped < 0
      ? Math.min(80, Math.abs(clamped) * 120)
      : -Math.min(360, clamped * 360)
    const scale = clamped < 0
      ? 1 + Math.min(0.13, Math.abs(clamped) * 0.13)
      : 1 - Math.min(0.12, clamped * 0.12)
    const rotateX = clamped * -11
    const opacity = distance > 1.05 ? 0 : Math.max(0, 1 - distance * 0.96)

    // Continuous crossfade for the visual itself. The old version snapped
    // opacity from 1 to 0.12 the instant "active" flipped, which — combined
    // with a slower spring transition that couldn't keep up with fast
    // scrolling — showed up as a dim empty gap between scenes. Now it's one
    // smooth curve, peaking (opacity 1 / scale 1) exactly at distance 0,
    // i.e. exactly when the scene is centered in the viewport.
    const closeness = Math.max(0, 1 - distance / 0.95)
    const eased = closeness * closeness * (3 - 2 * closeness)
    const visualScale = 0.94 + eased * 0.06

    return (
      <motion.div
        key={i}
        className="avid-scene"
        animate={{ opacity, y: `${y}vh`, z, rotateX, scale }}
        transition={{ duration: 0.12, ease: 'linear' }}
        style={{ pointerEvents: active ? 'auto' : 'none' }}
      >
        <SceneText active={active} title={sceneData[i].title} body={sceneData[i].body} />
        <motion.div
          className="avid-scene-visual visual-left"
          // y: '-50%' re-establishes true vertical centering. Framer Motion
          // writes its own inline `transform` whenever it manages rotateY/
          // rotateX/scale on an element, which silently discarded the CSS
          // `transform: translateY(-50%)` this class relies on — so the box
          // was centering from its top edge instead of its middle, landing
          // the "complete" visual lower than the actual viewport center.
          animate={{ opacity: 1, scale: visualScale, y: '-50%' }}
          style={{ rotateY: smx, rotateX: smy }}
          transition={{ duration: 0.12, ease: 'linear' }}
        >
          {i === 1 && <CardStack phase={progress - 1} />}
          {i === 2 && <SearchComparison phase={progress - 2} />}
          {i === 3 && <GlassCore phase={progress - 3} />}
          {i === 4 && <ToxicityField phase={progress - 4} />}
          {i === 5 && <KnowledgeGraph phase={progress - 5} onLoginClick={onLoginClick} />}
        </motion.div>
      </motion.div>
    )
  }

  // Intro headline and background video now share ONE fade curve so they
  // dissolve together instead of at two different speeds — previously the
  // text (a hard *4 curve finishing by 0.3) vanished much faster than the
  // video (finishing by 1.3), so the video kept sitting there on its own
  // after the text was long gone, still fully visible as the CardStack scene
  // — and even the start of the search/comparison scene at progress 1.3 —
  // appeared, reading as if the video had become the second scene's
  // background. Using smoothstep (instead of a linear *N ramp) also makes
  // the dissolve itself gentler/smoother rather than a mechanical fade.
  // Finishing by progress 0.4 keeps CardStack's own overlap modest (~38%
  // opaque at that point) while still being well clear of the search scene.
  const introFadeStart = 0.05
  const introFadeEnd = 0.4
  const introOpacity = 1 - smoothstep((progress - introFadeStart) / (introFadeEnd - introFadeStart))

  return (
    <section
      id="avid-hero-story"
      className="avid-hero-story"
      style={{ '--hero-bg': palette.bg, '--hero-accent': palette.accent } as React.CSSProperties}
    >
      <div className="avid-hero-sticky">
        <motion.div
          className="avid-scene-color"
          animate={{ backgroundColor: palette.bg }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          aria-hidden="true"
        />

        <motion.div
          className="avid-page1-video-wrap"
          animate={{ opacity: introOpacity }}
          transition={{ duration: 0.35 }}
          aria-hidden="true"
        >
          <video
            className="avid-page1-video"
            src="/avid-page1-bg.mp4"
            poster="/avid-page1-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className="avid-page1-video-wash" />
          <SceneLighting progress={progress} />
        </motion.div>

        <div className="avid-medical-bg" aria-hidden="true">
          <div className="medical-orb orb-a" />
          <div className="medical-orb orb-b" />
          <div className="medical-orb orb-c" />
          <div className="medical-grid" />
          <div className="medical-molecule molecule-a"><i /><i /><i /><i /><i /></div>
          <div className="medical-molecule molecule-b"><i /><i /><i /><i /></div>
          <div className="medical-molecule molecule-c"><i /><i /><i /><i /><i /><i /></div>
          <div className="medical-glass glass-a" /><div className="medical-glass glass-b" />
          <div className="medical-glass glass-c" />
        </div>

        <InteractiveNetwork progress={progress} />

        {/* Intro lives beside the video (same 2D stack), not inside the 3D scene-layer */}
        <motion.div
          className="avid-intro-flat"
          animate={{ opacity: introOpacity, scale: 0.98 + introOpacity * 0.02 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{ pointerEvents: introOpacity > 0.15 ? 'auto' : 'none' }}
        >
          <div className="avid-intro-copy">
            <h1>از داده‌های پزشکی،<br /><span>تا تصمیم‌های هوشمند</span></h1>
          </div>
        </motion.div>

        <motion.div className="avid-mouse-depth" style={{ x: smx, y: smy }} />

        <div className="avid-scene-layer">
          {Array.from({ length: 6 }, (_, i) => renderScene(i))}
        </div>

        <div className="avid-scene-progress" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => <span key={i} className={Math.abs(i - progress) < 0.5 ? 'active' : ''} />)}
        </div>
      </div>
    </section>
  )
}
