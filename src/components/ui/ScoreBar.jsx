import { scoreColor } from '../../utils/scoring.js'
import { C } from '../../utils/theme.js'

export function ScoreBar({ value, showBar = true }) {
  const col = scoreColor(value)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {showBar && (
        <div
          style={{
            width: 44,
            height: 5,
            background: C.bg,
            borderRadius: 3,
            overflow: 'hidden',
            border: `1px solid ${C.border}`,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${value}%`,
              background: col,
              borderRadius: 3,
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      )}
      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          fontWeight: 700,
          color: col,
        }}
      >
        {value}%
      </span>
    </div>
  )
}
