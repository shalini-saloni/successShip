import { Database, CheckCircle, AlertTriangle, Brain } from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'
import { StatCard, Panel, Pill, ScoreBar, PageHeader, MemoryTypeIcon } from '../ui/index.js'
import { computeScore } from '../../utils/scoring.js'
import { STALENESS } from '../../data/constants.js'
import { STALE_STYLE } from '../../utils/styleHelpers.js'
import { C } from '../../utils/theme.js'

export function Dashboard({ memories, goTo }) {
  const fresh    = memories.filter((m) => m.staleness === STALENESS.FRESH).length
  const critical = memories.filter((m) => m.impact === 'critical').length
  const entities = [...new Set(memories.map((m) => m.entity))]
  const avgScore = Math.round(
    memories.reduce((a, m) => a + computeScore(m), 0) / memories.length
  )
  const recent = [...memories].sort((a, b) => a.daysAgo - b.daysAgo).slice(0, 5)

  const lifecycleRows = [
    { label: 'Fresh',    count: memories.filter((m) => m.staleness === STALENESS.FRESH).length,    color: C.green, track: '#DCFCE7' },
    { label: 'Aging',    count: memories.filter((m) => m.staleness === STALENESS.AGING).length,    color: C.amber, track: '#FEF3C7' },
    { label: 'Stale',    count: memories.filter((m) => m.staleness === STALENESS.STALE).length,    color: C.red,   track: '#FEE2E2' },
    { label: 'Archived', count: memories.filter((m) => m.staleness === STALENESS.ARCHIVED).length, color: C.inkTertiary, track: C.bg },
  ]

  return (
    <div>
      <PageHeader title="Dashboard" sub="Overview of your AI agent memory system" />

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label="Total Memories"   value={memories.length} Icon={Database}      color={C.brand}  bg={C.brandLight}  border={C.brandBorder}  sub="indexed" />
        <StatCard label="Fresh Memories"   value={fresh}           Icon={CheckCircle}   color={C.green}  bg={C.greenLight}  border={C.greenBorder}  sub="active"  />
        <StatCard label="Critical Signals" value={critical}        Icon={AlertTriangle} color={C.red}    bg={C.redLight}    border={C.redBorder}    sub="urgent"  />
        <StatCard label="Avg Relevance"    value={avgScore + '%'}  Icon={Brain}         color={C.violet} bg={C.violetLight} border={C.violetBorder} sub="system"  />
      </div>

      {/* Middle row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Lifecycle */}
        <Panel>
          <div style={{ fontWeight: 600, fontSize: 14, color: C.ink, marginBottom: 16 }}>Memory Lifecycle</div>
          {lifecycleRows.map((r) => (
            <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: C.inkSecondary, width: 52, flexShrink: 0 }}>{r.label}</span>
              <div style={{ flex: 1, height: 6, background: r.track, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${memories.length ? (r.count / memories.length) * 100 : 0}%`, background: r.color, borderRadius: 3, transition: 'width .5s' }} />
              </div>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, fontWeight: 600, color: C.ink, width: 16, textAlign: 'right' }}>{r.count}</span>
            </div>
          ))}
        </Panel>

        {/* Entities */}
        <Panel>
          <div style={{ fontWeight: 600, fontSize: 14, color: C.ink, marginBottom: 14 }}>Entities</div>
          {entities.map((ent) => {
            const ms  = memories.filter((m) => m.entity === ent)
            const avg = Math.round(ms.reduce((a, m) => a + computeScore(m), 0) / ms.length)
            const hasCrit = ms.some((m) => m.impact === 'critical')
            return (
              <div key={ent} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {hasCrit && <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.red, flexShrink: 0 }} />}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: C.ink }}>{ent}</div>
                    <div style={{ fontSize: 11, color: C.inkTertiary }}>{ms.length} memories</div>
                  </div>
                </div>
                <ScoreBar value={avg} />
              </div>
            )
          })}
        </Panel>
      </div>

      {/* Recent memories */}
      <Panel p={0}>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: C.ink }}>Recent Memories</span>
          <button onClick={() => goTo('memories')} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: C.brand, fontSize: 12, fontWeight: 600 }}>
            View all <ArrowUpRight size={13} />
          </button>
        </div>
        {recent.map((m, i) => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px', borderBottom: i < recent.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            <MemoryTypeIcon type={m.type} impact={m.impact} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 500, fontSize: 13, color: C.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
              <div style={{ fontSize: 11, color: C.inkTertiary }}>{m.entity} · {m.daysAgo}d ago</div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <Pill bg={STALE_STYLE[m.staleness].bg} border={STALE_STYLE[m.staleness].border} color={STALE_STYLE[m.staleness].text}>{m.staleness}</Pill>
              <ScoreBar value={computeScore(m)} />
            </div>
          </div>
        ))}
      </Panel>
    </div>
  )
}
