import { useState } from 'react'
import { Database, CheckCircle } from 'lucide-react'
import { Panel, Pill, PageHeader, MemoryTypeIcon } from '../ui/index.js'
import { MEMORY_TYPES, IMPACT_LEVELS } from '../../data/constants.js'
import { IMPACT_STYLE } from '../../utils/styleHelpers.js'
import { C } from '../../utils/theme.js'

const BLANK = {
  title: '', content: '', entity: '', category: '',
  type: 'episodic', impact: 'medium', weight: '0.80', tags: '',
}

export function AddMemory({ addMemory }) {
  const [form, setForm] = useState(BLANK)
  const [saved, setSaved] = useState(false)
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const handleSubmit = () => {
    if (!form.title || !form.content || !form.entity) return
    addMemory(form)
    setSaved(true)
    setForm(BLANK)
    setTimeout(() => setSaved(false), 2500)
  }

  const previewScore = () => {
    let s = (parseFloat(form.weight) || 0) * 100
    if (form.impact === 'critical') s *= 1.3
    else if (form.impact === 'high') s *= 1.15
    return Math.min(Math.round(s), 99)
  }

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    fontSize: 13,
    color: C.ink,
    background: C.bg,
    outline: 'none',
    fontFamily: "'DM Sans',sans-serif",
    transition: 'border .15s',
  }

  const labelStyle = {
    fontSize: 11,
    fontWeight: 600,
    color: C.inkSecondary,
    display: 'block',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: "'DM Mono',monospace",
  }

  const imp = IMPACT_STYLE[form.impact]

  return (
    <div>
      <PageHeader title="Add Memory" sub="Store a new memory record in the agent knowledge base" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, alignItems: 'start' }}>
        {/* Form */}
        <Panel>
          {saved && (
            <div style={{ background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 9, padding: '11px 14px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle size={15} color={C.green} />
              <span style={{ fontSize: 13, color: C.green, fontWeight: 600 }}>Memory stored successfully!</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Title *</label>
              <input style={inputStyle} placeholder="Brief, descriptive title" value={form.title} onChange={(e) => set('title', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Entity *</label>
              <input style={inputStyle} placeholder="e.g. Supplier XYZ" value={form.entity} onChange={(e) => set('entity', e.target.value)} />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Content *</label>
            <textarea
              rows={4}
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              placeholder="Detailed description of this memory record…"
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Category</label>
              <input style={inputStyle} placeholder="quality, payment…" value={form.category} onChange={(e) => set('category', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Type</label>
              <select value={form.type} onChange={(e) => set('type', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                {Object.values(MEMORY_TYPES).map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Impact</label>
              <select value={form.impact} onChange={(e) => set('impact', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                {IMPACT_LEVELS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Base Weight</label>
              <input type="number" min="0" max="1" step="0.05" style={inputStyle} value={form.weight} onChange={(e) => set('weight', e.target.value)} />
            </div>
          </div>

          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>Tags (comma-separated)</label>
            <input style={inputStyle} placeholder="quality, risk, seasonal…" value={form.tags} onChange={(e) => set('tags', e.target.value)} />
          </div>

          <button
            onClick={handleSubmit}
            style={{ background: `linear-gradient(135deg,${C.brand},${C.brandDark})`, border: 'none', borderRadius: 9, padding: '11px 24px', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: `0 4px 14px ${C.brand}35` }}
          >
            <Database size={14} /> Store Memory
          </button>
        </Panel>

        {/* Sidebar: preview + guide */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Live preview */}
          <Panel>
            <div style={{ fontWeight: 600, fontSize: 13, color: C.ink, marginBottom: 12 }}>Live Preview</div>
            {form.title ? (
              <>
                <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                  <MemoryTypeIcon type={form.type} impact={form.impact} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: C.ink }}>{form.title}</div>
                    <div style={{ fontSize: 11, color: C.inkTertiary }}>{form.entity || '—'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                  <Pill bg={C.greenLight} border={C.greenBorder} color={C.green}>fresh</Pill>
                  <Pill bg={imp.bg} border={imp.border} color={imp.text}>{form.impact}</Pill>
                  <Pill bg={C.brandLight} border={C.brandBorder} color={C.brand}>{form.type}</Pill>
                </div>
                <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: C.inkTertiary }}>Initial relevance</span>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 700, fontSize: 15, color: C.green }}>{previewScore()}%</span>
                </div>
              </>
            ) : (
              <div style={{ fontSize: 12, color: C.inkTertiary, textAlign: 'center', padding: '20px 0' }}>
                Fill the form to preview
              </div>
            )}
          </Panel>

          {/* Impact guide */}
          <Panel>
            <div style={{ fontWeight: 600, fontSize: 13, color: C.ink, marginBottom: 10 }}>Impact Multipliers</div>
            {[['critical', '×1.3'], ['high', '×1.15'], ['medium', '×1.0'], ['low', '×0.9']].map(([lvl, mult]) => {
              const s = IMPACT_STYLE[lvl]
              return (
                <div key={lvl} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: `1px solid ${C.border}` }}>
                  <Pill bg={s.bg} border={s.border} color={s.text}>{lvl}</Pill>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 700, fontSize: 13, color: C.ink }}>{mult}</span>
                </div>
              )
            })}
            <div style={{ marginTop: 12, fontSize: 11, color: C.inkTertiary, lineHeight: 1.5 }}>
              Base weight × impact multiplier = initial relevance score.
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
