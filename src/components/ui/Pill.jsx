export function Pill({ children, bg, border, color, size = 11, style = {} }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        fontSize: size,
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: 20,
        background: bg,
        border: `1px solid ${border}`,
        color,
        fontFamily: "'DM Mono', monospace",
        whiteSpace: 'nowrap',
        lineHeight: 1.6,
        ...style,
      }}
    >
      {children}
    </span>
  )
}
