import { Clock, BookOpen, Settings, Zap, Layers } from 'lucide-react'
import { Panel, Pill, ScoreBar, PageHeader } from '../ui/index.js'
import { computeScore, scoreColor } from '../../utils/scoring.js'
import { MEMORY_TYPES, STALENESS, IMPACT_LEVELS } from '../../data/constants.js'
import { STALE_STYLE, IMPACT_STYLE } from '../../utils/styleHelpers.js'
import { C } from '../../utils/theme.js'

const TYPE_ICONS = { episodic: Clock, semantic: BookOpen, procedural: Settings, working: Zap }

export function Analytics({ memories }) {
  const entities = [...new Set(memories.map((m) => m.entity))]

  const byType = Object.values(MEMORY_TYPES).map((t) => ({
    type: t,
    count: memories.filter((m) => m.type === t).length,
  }))

  const byImpact = IMPACT_LEVELS.map((imp) => ({
    impact: imp,
    count: memories.filter((m) => m.impact === imp).length,
  }))

  const byStaleness = Object.values(STALENESS).map((s) => ({
    staleness: s,
    count: memories.filter((m) => m.staleness === s).length,
  }))

  const maxTypeCount = Math.max(...byType.map((x) => x.count), 1)

  const needsReview = memories.filter(
    (m) => m.staleness === STALENESS.STALE || m.staleness === STALENESS.ARCHIVED
  ).length

  return (
    <div>
      <PageHeader title="Analytics" sub="Memory distribution, lifecycle state, and entity performance" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Memory Type Distribution */}
        <Panel>
          <div style={{ fontWeight: 600, fontSize: 14, color: C.ink, marginBottom: 16 }}>Type Distribution</div>
          {byType.map(({ type, count }) => {
            const Icon = TYPE_ICONS[type] || Layers
            return (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 30, height: 30, borderRadius: 7, background: C.brandLight, border: `1px solid ${C.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={13} color={C.brand} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: C.ink, textTransform: 'capitalize' }}>{type}</span>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: C.inkSecondary }}>{count}</span>
                  </div>
                  <div style={{ height: 6, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(count / maxTypeCount) * 100}%`, background: C.brand, borderRadius: 3, transition: 'width .5s' }} />
                  </div>
                </div>
              </div>
            )
          })}
        </Panel>

        {/* Impact Breakdown */}
        <Panel>
          <div style={{ fontWeight: 600, fontSize: 14, color: C.ink, marginBottom: 16 }}>Impact Levels</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {byImpact.map(({ impact, count }) => {
              const s = IMPACT_STYLE[impact]
              return (
                <div key={impact} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ fontWeight: 700, fontSize: 28, color: s.text, lineHeight: 1 }}>{count}</div>
                  <div style={{ fontSize: 12, color: s.text, marginTop: 4, fontWeight: 600, textTransform: 'capitalize' }}>{impact}</div>
                </div>
              )
            })}
          </div>
        </Panel>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Entity Performance */}
        <Panel>
          <div style={{ fontWeight: 600, fontSize: 14, color: C.ink, marginBottom: 14 }}>Entity Performance</div>
          {entities.map((ent) => {
            const ms = memories.filter((m) => m.entity === ent)
            const avg = Math.round(ms.reduce((a, m) => a + computeScore(m), 0) / ms.length)
            const crit = ms.filter((m) => m.impact === 'critical').length
            return (
              <div key={ent} style={{ paddingBottom: 14, marginBottom: 14, borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: C.ink }}>{ent}</div>
                    <div style={{ fontSize: 11, color: C.inkTertiary }}>
                      {ms.length} memories · {crit} critical
                    </div>
                  </div>
                  <ScoreBar value={avg} />
                </div>
                <div style={{ height: 5, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${avg}%`, borderRadius: 3, background: scoreColor(avg), transition: 'width .5s' }} />
                </div>
              </div>
            )
          })}
        </Panel>

        {/* Lifecycle State */}
        <Panel>
          <div style={{ fontWeight: 600, fontSize: 14, color: C.ink, marginBottom: 14 }}>Lifecycle State</div>
          {byStaleness.map(({ staleness, count }) => {
            const s = STALE_STYLE[staleness]
            const pct = memories.length ? Math.round((count / memories.length) * 100) : 0
            return (
              <div key={staleness} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 9, padding: '12px 14px', marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: s.text, textTransform: 'capitalize' }}>{staleness}</span>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, fontWeight: 700, color: s.text }}>
                    {count} ({pct}%)
                  </span>
                </div>
                <div style={{ height: 5, background: 'rgba(0,0,0,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: s.text, borderRadius: 3, transition: 'width .5s' }} />
                </div>
              </div>
            )
          })}

          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 14px', marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: C.inkSecondary }}>Memories needing review</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: needsReview > 0 ? C.red : C.green }}>
              {needsReview}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}
