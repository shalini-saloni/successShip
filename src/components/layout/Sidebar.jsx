import {
  LayoutDashboard, Database, Cpu, Search,
  PlusCircle, BarChart2, ChevronLeft, ChevronRight, Brain,
} from 'lucide-react'
import { C, shadow } from '../../utils/theme.js'
import { NAV_ITEMS } from '../../data/constants.js'

const NAV_ICONS = {
  dashboard: LayoutDashboard,
  memories:  Database,
  decision:  Cpu,
  inspector: Search,
  add:       PlusCircle,
  analytics: BarChart2,
}

export function Sidebar({ page, setPage, collapsed, setCollapsed }) {
  return (
    <aside
      className="sidebar"
      style={{
        width: collapsed ? 56 : 210,
        background: C.sidebar,
        borderRight: `1px solid ${C.border}`,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
        boxShadow: shadow.xs,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '16px 14px 14px',
          borderBottom: `1px solid ${C.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          minHeight: 57,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${C.brand}, ${C.brandDark})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 2px 8px ${C.brand}35`,
          }}
        >
          <Brain size={14} color="#fff" strokeWidth={2} />
        </div>
        {!collapsed && (
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: C.ink,
                letterSpacing: -0.3,
                lineHeight: 1,
              }}
            >
              ContextOS
            </div>
            <div
              style={{
                fontSize: 10,
                color: C.inkTertiary,
                letterSpacing: 0.3,
                marginTop: 2,
              }}
            >
              Memory System
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '10px 8px', overflow: 'hidden' }}>
        {NAV_ITEMS.map(({ id, label }) => {
          const Icon = NAV_ICONS[id]
          const active = page === id
          return (
            <button
              key={id}
              onClick={() => setPage(id)}
              title={collapsed ? label : ''}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: collapsed ? '8px 0' : '8px 10px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                background: active ? C.brandLight : 'transparent',
                border: active
                  ? `1px solid ${C.brandBorder}`
                  : '1px solid transparent',
                borderRadius: 7,
                cursor: 'pointer',
                marginBottom: 2,
                transition: 'all 0.12s',
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = C.panelHover
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = 'transparent'
              }}
            >
              <Icon
                size={15}
                color={active ? C.brand : C.inkTertiary}
                strokeWidth={active ? 2.5 : 2}
              />
              {!collapsed && (
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    color: active ? C.brand : C.inkSecondary,
                  }}
                >
                  {label}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div style={{ padding: '10px 8px', borderTop: `1px solid ${C.border}` }}>
        <button
          onClick={() => setCollapsed((v) => !v)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: collapsed ? '8px 0' : '8px 10px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            background: 'transparent',
            border: '1px solid transparent',
            borderRadius: 7,
            cursor: 'pointer',
            color: C.inkTertiary,
            transition: 'all 0.12s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = C.panelHover)}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          {collapsed ? (
            <ChevronRight size={15} />
          ) : (
            <>
              <ChevronLeft size={15} />
              <span style={{ fontSize: 13, color: C.inkTertiary }}>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
