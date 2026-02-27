import { useState } from 'react'
import { Search, Eye, Trash2 } from 'lucide-react'
import { Panel, Pill, ScoreBar, PageHeader, MemoryTypeIcon } from '../ui/index.js'
import { computeScore } from '../../utils/scoring.js'
import { MEMORY_TYPES, STALENESS } from '../../data/constants.js'
import { STALE_STYLE, IMPACT_STYLE } from '../../utils/styleHelpers.js'
import { C } from '../../utils/theme.js'

export function MemoryStore({ memories, deleteMemory, openInspector }) {
  const [q, setQ]         = useState('')
  const [fType, setFType] = useState('all')
  const [fStale, setFStale] = useState('all')
  const [fEnt, setFEnt]   = useState('all')

  const entities = ['all', ...new Set(memories.map((m) => m.entity))]

  const rows = memories
    .filter((m) => fType  === 'all' || m.type      === fType)
    .filter((m) => fStale === 'all' || m.staleness  === fStale)
    .filter((m) => fEnt   === 'all' || m.entity     === fEnt)
    .filter((m) => !q || m.title.toLowerCase().includes(q.toLowerCase()) || m.entity.toLowerCase().includes(q.toLowerCase()) || m.tags.some((t) => t.includes(q.toLowerCase())))
    .map((m) => ({ ...m, sc: computeScore(m) }))
    .sort((a, b) => b.sc - a.sc)

  const selStyle = {
    padding: '7px 10px',
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    fontSize: 12,
    color: C.ink,
    background: C.panel,
    outline: 'none',
    cursor: 'pointer',
  }

  return (
    <div>
      <PageHeader
        title="Memory Store"
        sub={`${memories.length} memories across ${[...new Set(memories.map((m) => m.entity))].length} entities`}
      />

      {/* Filters */}
      <Panel p={14} style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={13} color={C.inkTertiary} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search memories…"
              style={{ width: '100%', padding: '7px 10px 7px 30px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, color: C.ink, background: C.bg, outline: 'none' }}
            />
          </div>
          <select value={fType} onChange={(e) => setFType(e.target.value)} style={selStyle}>
            <option value="all">All types</option>
            {Object.values(MEMORY_TYPES).map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={fStale} onChange={(e) => setFStale(e.target.value)} style={selStyle}>
            <option value="all">All states</option>
            {Object.values(STALENESS).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={fEnt} onChange={(e) => setFEnt(e.target.value)} style={selStyle}>
            {entities.map((e) => <option key={e} value={e}>{e === 'all' ? 'All entities' : e}</option>)}
          </select>
          <span style={{ fontSize: 11, color: C.inkTertiary, fontFamily: "'DM Mono',monospace", marginLeft: 'auto' }}>
            {rows.length} results
          </span>
        </div>
      </Panel>

      {/* Table */}
      <Panel p={0}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 120px 90px 72px', padding: '9px 18px', borderBottom: `1px solid ${C.border}`, background: C.bg, borderRadius: '12px 12px 0 0' }}>
          {['Memory', 'Entity', 'Status', 'Relevance', ''].map((h) => (
            <div key={h} style={{ fontSize: 11, fontWeight: 600, color: C.inkTertiary, textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: "'DM Mono',monospace" }}>{h}</div>
          ))}
        </div>

        {rows.length === 0 && (
          <div style={{ padding: '40px 0', textAlign: 'center', color: C.inkTertiary, fontSize: 13 }}>
            No results found
          </div>
        )}

        {rows.map((m, i) => {
          const imp = IMPACT_STYLE[m.impact]
          const sta = STALE_STYLE[m.staleness]
          return (
            <div
              key={m.id}
              style={{ display: 'grid', gridTemplateColumns: '1fr 160px 120px 90px 72px', padding: '11px 18px', borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : 'none', transition: 'background .1s' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.panelHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', minWidth: 0, paddingRight: 16 }}>
                <MemoryTypeIcon type={m.type} impact={m.impact} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 13, color: C.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
                  <div style={{ fontSize: 11, color: C.inkTertiary }}>{m.type} · {m.daysAgo}d ago</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 12, color: C.ink, fontWeight: 500 }}>{m.entity}</div>
                <div style={{ fontSize: 11, color: C.inkTertiary }}>{m.category}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'center' }}>
                <Pill bg={sta.bg} border={sta.border} color={sta.text}>{m.staleness}</Pill>
                <Pill bg={imp.bg} border={imp.border} color={imp.text}>{m.impact}</Pill>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ScoreBar value={m.sc} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                <ActionBtn icon={Eye} onClick={() => openInspector(m)} hoverColor={C.brand} hoverBg={C.brandLight} />
                <ActionBtn icon={Trash2} onClick={() => deleteMemory(m.id)} hoverColor={C.red} hoverBg={C.redLight} />
              </div>
            </div>
          )
        })}
      </Panel>
    </div>
  )
}

function ActionBtn({ icon: Icon, onClick, hoverColor, hoverBg }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '5px 6px',
        background: hov ? hoverBg : 'none',
        border: `1px solid ${hov ? hoverColor + '60' : C.border}`,
        borderRadius: 6,
        cursor: 'pointer',
        color: hov ? hoverColor : C.inkTertiary,
        display: 'flex',
        alignItems: 'center',
        transition: 'all .15s',
      }}
    >
      <Icon size={12} />
    </button>
  )
}
