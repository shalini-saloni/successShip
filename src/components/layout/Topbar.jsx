import { RefreshCw } from 'lucide-react'
import { C, shadow } from '../../utils/theme.js'
import { NAV_ITEMS } from '../../data/constants.js'

export function Topbar({ page, memoryCount, apiMode, loading, onRefresh }) {
  const current = NAV_ITEMS.find((n) => n.id === page)

  return (
    <header
      style={{
        height: 56,
        background: C.panel,
        borderBottom: `1px solid ${C.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        flexShrink: 0,
        boxShadow: shadow.xs,
      }}
    >
      <div style={{ fontWeight: 600, fontSize: 15, color: C.ink }}>
        {current?.label}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* API status */}
        <div
          title={apiMode ? 'Connected to backend API' : 'Using local seed data (backend offline)'}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: apiMode ? '#F0FDF4' : '#FFFBEB',
            border: `1px solid ${apiMode ? '#BBF7D0' : '#FDE68A'}`,
            borderRadius: 20, padding: '4px 10px', cursor: 'default',
          }}
        >
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: apiMode ? '#16A34A' : '#D97706',
          }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: apiMode ? '#16A34A' : '#D97706' }}>
            {apiMode ? 'API Connected' : 'Offline Mode'}
          </span>
        </div>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          title="Refresh data"
          style={{
            background: 'none', border: `1px solid ${C.border}`, borderRadius: 7,
            padding: '5px 7px', cursor: 'pointer', display: 'flex', alignItems: 'center',
            color: C.inkTertiary, transition: 'all .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = C.panelHover; e.currentTarget.style.color = C.ink }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.inkTertiary }}
        >
          <RefreshCw size={13} style={{ transform: loading ? 'rotate(360deg)' : 'none', transition: 'transform 0.5s' }} />
        </button>

        {/* Memory count */}
        <span style={{
          fontSize: 11, color: C.inkTertiary,
          fontFamily: "'DM Mono', monospace",
        }}>
          {memoryCount} memories
        </span>
      </div>
    </header>
  )
}
