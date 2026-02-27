import { C, shadow } from '../../utils/theme.js'

export function Panel({ children, style = {}, p = 20, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: C.panel,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        boxShadow: shadow.sm,
        padding: p,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
