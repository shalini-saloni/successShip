import { useState } from 'react'
import { Tag, TrendingUp, TrendingDown, Activity, Heart, Search } from 'lucide-react'
import { Panel, Pill, ScoreBar, PageHeader, MemoryTypeIcon } from '../ui/index.js'
import { computeScore, decayFactor, scoreColor } from '../../utils/scoring.js'
import { STALE_STYLE, IMPACT_STYLE } from '../../utils/styleHelpers.js'
import { C } from '../../utils/theme.js'

export function Inspector({ memories, initial }) {
  const [sel, setSel] = useState(initial || memories[0])
  const m = sel
  const sc = m ? computeScore(m) : 0
  const imp = m ? IMPACT_STYLE[m.impact] : {}
  const sta = m ? STALE_STYLE[m.staleness] : {}

  const decayCurve = [30, 90, 180, 300, 365]

  return (
    <div>
      <PageHeader title="Memory Inspector" sub="Deep-dive into individual memory records and decay curves" />

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 14 }}>
        {/* Memory list */}
        <Panel p={0} style={{ overflow: 'hidden' }}>
          <div style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: C.ink }}>All Memories</div>
            <div style={{ fontSize: 11, color: C.inkTertiary, marginTop: 2 }}>{memories.length} records</div>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 240px)' }}>
            {memories.map((mem) => (
              <div
                key={mem.id}
                onClick={() => setSel(mem)}
                style={{
                  display: 'flex', gap: 10, padding: '10px 14px',
                  borderBottom: `1px solid ${C.border}`, cursor: 'pointer',
                  background: sel?.id === mem.id ? C.brandLight : 'transparent',
                  transition: 'background .1s',
                }}
                onMouseEnter={(e) => { if (sel?.id !== mem.id) e.currentTarget.style.background = C.panelHover }}
                onMouseLeave={(e) => { if (sel?.id !== mem.id) e.currentTarget.style.background = 'transparent' }}
              >
                <MemoryTypeIcon type={mem.type} impact={mem.impact} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 12, color: C.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {mem.title}
                  </div>
                  <div style={{ fontSize: 11, color: C.inkTertiary, marginTop: 2 }}>
                    {mem.entity} · {mem.daysAgo}d
                  </div>
                </div>
                <ScoreBar value={computeScore(mem)} showBar={false} />
              </div>
            ))}
          </div>
        </Panel>

        {/* Detail panel */}
        {m ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Header card */}
            <Panel style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <MemoryTypeIcon type={m.type} impact={m.impact} size={44} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 18, color: C.ink, marginBottom: 6 }}>{m.title}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Pill bg={imp.bg} border={imp.border} color={imp.text}>{m.impact}</Pill>
                  <Pill bg={sta.bg} border={sta.border} color={sta.text}>{m.staleness}</Pill>
                  <Pill bg={C.brandLight} border={C.brandBorder} color={C.brand}>{m.type}</Pill>
                  {m.emotionalFlag && (
                    <Pill bg="#FFF1F2" border="#FECDD3" color="#E11D48">
                      <Heart size={8} fill="#E11D48" style={{ marginRight: 2 }} />emotional
                    </Pill>
                  )}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 32, color: scoreColor(sc), lineHeight: 1 }}>{sc}%</div>
                <div style={{ fontSize: 11, color: C.inkTertiary, marginTop: 4 }}>relevance score</div>
              </div>
            </Panel>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {/* Details */}
              <Panel>
                <div style={{ fontWeight: 600, fontSize: 13, color: C.ink, marginBottom: 14 }}>Memory Details</div>
                {[
                  ['Content',       m.content,      false],
                  ['Entity',        m.entity],
                  ['Category',      m.category],
                  ['Recorded',      `${m.date}  (${m.daysAgo}d ago)`],
                  ['Base Weight',   m.weight.toFixed(2)],
                  ['Related',       m.relatedIds.length ? m.relatedIds.join(', ') : 'None'],
                  ['Emotional Flag', m.emotionalFlag ? 'Active — urgency ×1.1' : 'Inactive'],
                ].map(([label, val, mono = true]) => (
                  <div key={label} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: C.inkTertiary, textTransform: 'uppercase', letterSpacing: 0.6, fontFamily: "'DM Mono',monospace", marginBottom: 3 }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 12, color: C.ink, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: '6px 10px', fontFamily: mono ? "'DM Mono',monospace" : 'inherit', lineHeight: 1.5 }}>
                      {val}
                    </div>
                  </div>
                ))}

                {/* Tags */}
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: C.inkTertiary, textTransform: 'uppercase', letterSpacing: 0.6, fontFamily: "'DM Mono',monospace", marginBottom: 6 }}>
                    Tags
                  </div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {m.tags.map((t) => (
                      <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 3, background: C.bg, border: `1px solid ${C.border}`, color: C.inkSecondary, fontSize: 11, padding: '3px 8px', borderRadius: 6, fontFamily: "'DM Mono',monospace" }}>
                        <Tag size={9} />{t}
                      </span>
                    ))}
                  </div>
                </div>
              </Panel>

              {/* Decay curve */}
              <Panel>
                <div style={{ fontWeight: 600, fontSize: 13, color: C.ink, marginBottom: 6 }}>Temporal Decay Curve</div>
                <p style={{ fontSize: 11, color: C.inkTertiary, lineHeight: 1.5, marginBottom: 16 }}>
                  Base weight: <strong style={{ color: C.ink }}>{m.weight.toFixed(2)}</strong> · Current age:{' '}
                  <strong style={{ color: C.ink }}>{m.daysAgo}d</strong>
                </p>

                {decayCurve.map((d) => {
                  const w = Math.round(m.weight * decayFactor(d) * 100)
                  const col = scoreColor(w)
                  const isNow = m.daysAgo > 0 && m.daysAgo <= d
                  return (
                    <div key={d} style={{ marginBottom: 11 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: C.inkTertiary, width: 30 }}>{d}d</span>
                          {isNow && (
                            <span style={{ fontSize: 10, color: C.brand, fontFamily: "'DM Mono',monospace", background: C.brandLight, padding: '1px 5px', borderRadius: 4, border: `1px solid ${C.brandBorder}` }}>
                              NOW
                            </span>
                          )}
                        </div>
                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, fontWeight: 700, color: col }}>{w}%</span>
                      </div>
                      <div style={{ height: 6, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${w}%`, background: col, borderRadius: 3, transition: 'width .5s' }} />
                      </div>
                    </div>
                  )
                })}

                {/* Current score summary */}
                <div style={{ marginTop: 16, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 11, color: C.inkTertiary }}>Effective relevance now</div>
                    <div style={{ fontWeight: 700, fontSize: 20, color: scoreColor(sc), marginTop: 2 }}>{sc}%</div>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: 11, background: sc > 75 ? C.greenLight : sc > 50 ? C.amberLight : C.redLight, border: `1px solid ${sc > 75 ? C.greenBorder : sc > 50 ? C.amberBorder : C.redBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {sc > 75 ? <TrendingUp size={18} color={C.green} /> : sc > 50 ? <Activity size={18} color={C.amber} /> : <TrendingDown size={18} color={C.red} />}
                  </div>
                </div>
              </Panel>
            </div>
          </div>
        ) : (
          <Panel style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
            <div style={{ textAlign: 'center' }}>
              <Search size={32} color={C.inkPlaceholder} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 13, color: C.inkTertiary }}>Select a memory to inspect</div>
            </div>
          </Panel>
        )}
      </div>
    </div>
  )
}
