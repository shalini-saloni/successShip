import { Panel } from './Panel.jsx'
import { C } from '../../utils/theme.js'

export function StatCard({ label, value, color, bg, border, sub }) {
  return (
    <Panel p={18} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            background: bg,
            border: `1px solid ${border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={16} color={color} strokeWidth={2} />
        </div>
        {sub && (
          <span
            style={{
              fontSize: 11,
              color: C.inkTertiary,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {sub}
          </span>
        )}
      </div>
      <div>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: 28,
            color: C.ink,
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: 12, color: C.inkSecondary, marginTop: 4 }}>
          {label}
        </div>
      </div>
    </Panel>
  )
}
