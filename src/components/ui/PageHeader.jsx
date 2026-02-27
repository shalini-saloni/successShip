import { C } from '../../utils/theme.js'

export function PageHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h1
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          fontSize: 24,
          color: C.ink,
          margin: 0,
          letterSpacing: -0.6,
          lineHeight: 1.2,
        }}
      >
        {title}
      </h1>
      {sub && (
        <p
          style={{
            margin: '5px 0 0',
            fontSize: 13,
            color: C.inkSecondary,
            lineHeight: 1.5,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  )
}
