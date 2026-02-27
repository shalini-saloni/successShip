import { Clock, BookOpen, Settings, Zap, Layers } from 'lucide-react'
import { IMPACT_STYLE } from '../../utils/styleHelpers.js'

const TYPE_ICON_MAP = {
  episodic:   Clock,
  semantic:   BookOpen,
  procedural: Settings,
  working:    Zap,
}

export function MemoryTypeIcon({ type, impact, size = 32 }) {
  const Icon = TYPE_ICON_MAP[type] || Layers
  const s = IMPACT_STYLE[impact] || IMPACT_STYLE.low
  const iconSize = Math.round(size * 0.44)

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.25),
        background: s.bg,
        border: `1px solid ${s.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon size={iconSize} color={s.text} strokeWidth={2} />
    </div>
  )
}
