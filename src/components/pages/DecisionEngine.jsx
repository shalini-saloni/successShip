import { useState } from 'react'
import {
  Play, RotateCcw, CheckCircle, Activity, Info, ChevronRight,
  AlertTriangle, TrendingUp, Heart, Users, Sun, CreditCard,
  Truck, XCircle, Package, AlertCircle, FileText, Calendar,
  Zap, PhoneCall, Clock, Shield, Star, Headphones,
} from 'lucide-react'
import { Panel, Pill, ScoreBar, PageHeader, MemoryTypeIcon } from '../ui/index.js'
import { computeScore } from '../../utils/scoring.js'
import { STALE_STYLE } from '../../utils/styleHelpers.js'
import { SCENARIOS } from '../../data/scenarios.js'
import { DECISIONS } from '../../data/decisions.js'
import { useDecisionEngine } from '../../hooks/useDecisionEngine.js'
import { C } from '../../utils/theme.js'

const ICON_MAP = {
  AlertTriangle, TrendingUp, Heart, Users, Sun, CreditCard,
  Truck, XCircle, Package, AlertCircle, FileText, Calendar,
  Zap, PhoneCall, Clock, Shield, Star, CheckCircle,
}

const SCENARIO_ICONS = { invoice: FileText, support: Headphones }

export function DecisionEngine({ memories }) {
  const [scenarioId, setScenarioId] = useState('invoice')
  const { phase, step, run, reset, steps } = useDecisionEngine()

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)
  const decision = DECISIONS[scenarioId]
  const relevant = memories.filter((m) => scenario.relevantIds.includes(m.id))
  const avgRel = Math.round(
    relevant.reduce((a, m) => a + computeScore(m), 0) / (relevant.length || 1)
  )
  const isCrit = decision.level === 'critical'
  const vc = isCrit
    ? { bg: C.redLight, border: C.redBorder, text: C.red }
    : { bg: C.amberLight, border: C.amberBorder, text: C.amber }

  const handleScenarioChange = (id) => { setScenarioId(id); reset() }

  return (
    <div>
      <PageHeader title="Decision Engine" sub="Run memory-augmented decisions for business scenarios" />

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 14 }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Panel>
            <div style={{ fontWeight: 600, fontSize: 13, color: C.ink, marginBottom: 12 }}>Scenario</div>
            {SCENARIOS.map((s) => {
              const SI = SCENARIO_ICONS[s.id] || FileText
              const active = scenarioId === s.id
              return (
                <button key={s.id} onClick={() => handleScenarioChange(s.id)}
                  style={{ width: '100%', display: 'flex', gap: 10, alignItems: 'center', padding: '10px 12px', background: active ? s.light : 'transparent', border: `1.5px solid ${active ? s.color : C.border}`, borderRadius: 9, cursor: 'pointer', marginBottom: 6, textAlign: 'left', transition: 'all .15s' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: active ? `${s.color}22` : 'transparent', border: `1px solid ${active ? s.color : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <SI size={14} color={active ? s.color : C.inkTertiary} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 12, color: active ? s.color : C.ink }}>{s.title}</div>
                    <div style={{ fontSize: 11, color: C.inkTertiary, marginTop: 1 }}>{s.subtitle}</div>
                  </div>
                </button>
              )
            })}
          </Panel>

          <Panel p={0} style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: C.ink }}>Context Memories</div>
              <div style={{ fontSize: 11, color: C.inkTertiary, marginTop: 2 }}>{relevant.length} retrieved</div>
            </div>
            <div style={{ overflowY: 'auto' }}>
              {relevant.map((m) => (
                <div key={m.id} style={{ display: 'flex', gap: 10, padding: '10px 14px', borderBottom: `1px solid ${C.border}`, alignItems: 'flex-start' }}>
                  <MemoryTypeIcon type={m.type} impact={m.impact} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 12, color: C.ink, lineHeight: 1.3 }}>{m.title}</div>
                    <div style={{ display: 'flex', gap: 5, marginTop: 4 }}>
                      <Pill bg={STALE_STYLE[m.staleness].bg} border={STALE_STYLE[m.staleness].border} color={STALE_STYLE[m.staleness].text}>{m.staleness}</Pill>
                      <ScoreBar value={computeScore(m)} showBar={false} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* RIGHT */}
        <Panel p={0} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
            {[
              { l: 'Retrieved', v: relevant.length },
              { l: 'Avg Relevance', v: `${avgRel}%` },
              { l: 'High/Critical', v: relevant.filter((m) => ['critical', 'high'].includes(m.impact)).length },
              { l: 'Emotional', v: relevant.filter((m) => m.emotionalFlag).length },
            ].map(({ l, v }, i, arr) => (
              <div key={l} style={{ flex: 1, padding: '12px 16px', borderRight: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                <div style={{ fontSize: 11, color: C.inkTertiary, marginBottom: 3 }}>{l}</div>
                <div style={{ fontWeight: 700, fontSize: 18, color: C.ink }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.inkTertiary, textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: "'DM Mono',monospace", marginBottom: 6 }}>AGENT QUERY</div>
              <div style={{ fontSize: 13, color: C.ink, lineHeight: 1.65 }}>{scenario.query}</div>
            </div>

            {phase === 'idle' && (
              <button onClick={run}
                style={{ background: `linear-gradient(135deg,${scenario.color},${scenario.color}cc)`, border: 'none', borderRadius: 10, padding: '13px 0', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: `0 4px 14px ${scenario.color}38` }}>
                <Play size={14} strokeWidth={2.5} /> Run Memory-Augmented Decision Engine
              </button>
            )}

            {phase === 'loading' && (
              <Panel style={{ padding: 18 }}>
                <div style={{ fontSize: 11, color: C.inkTertiary, fontFamily: "'DM Mono',monospace", marginBottom: 14 }}>Retrieving memories…</div>
                {steps.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 9, opacity: i < step ? 1 : i === step - 1 ? 0.55 : 0.18, transition: 'opacity .3s' }}>
                    {i < step ? <CheckCircle size={13} color={C.green} /> : i === step - 1 ? <Activity size={13} color={C.amber} /> : <div style={{ width: 13, height: 13, borderRadius: '50%', border: `1.5px solid ${C.border}` }} />}
                    <span style={{ fontSize: 12, color: i < step ? C.green : C.inkSecondary, fontFamily: "'DM Mono',monospace" }}>{s}</span>
                  </div>
                ))}
                <div style={{ marginTop: 14, height: 4, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(step / steps.length) * 100}%`, background: `linear-gradient(90deg,${scenario.color},${C.brand})`, borderRadius: 2, transition: 'width .48s ease' }} />
                </div>
              </Panel>
            )}

            {phase === 'done' && (
              <>
                <div style={{ background: vc.bg, border: `1.5px solid ${vc.border}`, borderRadius: 10, padding: 16, borderLeft: `4px solid ${vc.text}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: vc.text }}>{decision.verdict}</span>
                    <Pill bg={`${vc.text}14`} border={`${vc.text}40`} color={vc.text}>{decision.confidence}% confidence</Pill>
                  </div>
                  <p style={{ fontSize: 13, color: C.inkSecondary, lineHeight: 1.65, margin: 0 }}>{decision.summary}</p>
                </div>

                <Panel>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.inkTertiary, textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: "'DM Mono',monospace", marginBottom: 14 }}>MEMORY REASONING CHAIN</div>
                  {decision.reasoning.map((r, i) => {
                    const RI = ICON_MAP[r.iconName] || AlertTriangle
                    return (
                      <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 13, marginBottom: 13, borderBottom: i < decision.reasoning.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: `${r.color}15`, border: `1px solid ${r.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                          <RI size={13} color={r.color} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13, color: C.ink, marginBottom: 4 }}>{r.title}</div>
                          <div style={{ fontSize: 12, color: C.inkSecondary, lineHeight: 1.6 }}>{r.body}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 5, fontSize: 10, color: C.inkTertiary, fontFamily: "'DM Mono',monospace" }}>
                            <ChevronRight size={9} /> memory/{r.memoryId}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </Panel>

                <div style={{ background: C.violetLight, border: `1.5px solid ${C.violetBorder}`, borderRadius: 10, padding: 14, borderLeft: `4px solid ${C.violet}` }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                    <Info size={12} color={C.violet} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: C.violet, textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: "'DM Mono',monospace" }}>{decision.conflict.label}</span>
                  </div>
                  <p style={{ fontSize: 12, color: C.inkSecondary, lineHeight: 1.65, margin: 0 }}>{decision.conflict.body}</p>
                </div>

                <Panel>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.inkTertiary, textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: "'DM Mono',monospace", marginBottom: 12 }}>RECOMMENDED ACTIONS</div>
                  {decision.actions.map((a, i) => {
                    const AI = ICON_MAP[a.iconName] || CheckCircle
                    return (
                      <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, background: C.greenLight, border: `1px solid ${C.greenBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                          <AI size={11} color={C.green} />
                        </div>
                        <span style={{ fontSize: 12, color: C.ink, lineHeight: 1.55 }}>{a.text}</span>
                      </div>
                    )
                  })}
                </Panel>

                <button onClick={reset}
                  style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 0', color: C.inkSecondary, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <RotateCcw size={11} /> Reset
                </button>
              </>
            )}
          </div>
        </Panel>
      </div>
    </div>
  )
}
