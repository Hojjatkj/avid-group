import avidLogoImg from '../assets/avid-logo.png'

interface AvidLogoProps {
  size?: number
  /** 'card' = sitting on a light/card surface (login card, landing header).
   *  'chrome' = sitting on the navy/dark sidebar or top bar background. */
  context?: 'card' | 'chrome'
  showWordmark?: boolean
}

/**
 * Avid brand mark — reused across the sidebar, login screen and
 * landing page so the identity stays consistent everywhere.
 */
export default function AvidLogo({ size = 30, context = 'card', showWordmark = false }: AvidLogoProps) {
  const mark = (
    <img
      src={avidLogoImg}
      alt="Avid"
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: 'contain', display: 'block' }}
    />
  )

  if (!showWordmark) return mark

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {mark}
      <span
        style={{
          fontSize: size * 0.6,
          fontWeight: 800,
          color: context === 'chrome' ? 'var(--chrome-text)' : 'var(--pharma-text)',
          letterSpacing: '.2px',
        }}
      >
        Avid
      </span>
    </div>
  )
}
